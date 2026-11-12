// Resim rengi: her eserden 5–6 renklik palet (canvas), vurgu rengi seçimi ve kontrast ayarı.
// Saf hesaplar (paletHesapla, vurguSec, acikHal, doluButon, renkTemasi) testlerde de çalışır;
// paletGetir yalnızca tarayıcıda (Image + canvas) ve sonucu IndexedDB'de saklar.
import { kontrast } from './tasarim.js';
import { idbAl, idbKoy } from './idb.js';

export const PALET_SURUMU = 1;
export const KOYU_YAZI = '#0B0A0B';
export const BEYAZ_YAZI = '#FFFFFF';
const HEDEF = 4.5;

export function hexten(hex) {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

export function hexe([r, g, b]) {
  return (
    '#' +
    [r, g, b]
      .map((x) =>
        Math.round(Math.min(255, Math.max(0, x)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

export function hsl(hex) {
  const [r, g, b] = hexten(hex).map((x) => x / 255);
  const en = Math.max(r, g, b);
  const az = Math.min(r, g, b);
  const l = (en + az) / 2;
  if (en === az) return [0, 0, l];
  const d = en - az;
  const s = l > 0.5 ? d / (2 - en - az) : d / (en + az);
  let h;
  if (en === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (en === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h * 60, s, l];
}

export function hsldenHex(h, s, l) {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return hexe([f(0) * 255, f(8) * 255, f(4) * 255]);
}

// İki rengi karıştır: oran = a'nın payı
export function karistir(a, b, oran) {
  const x = hexten(a);
  const y = hexten(b);
  return hexe(x.map((v, i) => v * oran + y[i] * (1 - oran)));
}

// RGBA piksel dizisinden median-cut ile en fazla `adet` renk; pay = piksel oranı (büyükten küçüğe)
export function paletHesapla(veri, adet = 6) {
  const px = [];
  for (let i = 0; i + 3 < veri.length; i += 4) if (veri[i + 3] >= 128) px.push([veri[i], veri[i + 1], veri[i + 2]]);
  if (!px.length) return [];
  const kutular = [px];
  while (kutular.length < adet) {
    let secilen = -1;
    let enIyi = 0;
    let kanal = 0;
    kutular.forEach((k, i) => {
      if (k.length < 2) return;
      for (let c = 0; c < 3; c++) {
        let az = 255;
        let en = 0;
        for (const p of k) {
          if (p[c] < az) az = p[c];
          if (p[c] > en) en = p[c];
        }
        // geniş ve kalabalık kutular önce bölünür
        const puan = (en - az) * k.length;
        if (puan > enIyi) {
          enIyi = puan;
          secilen = i;
          kanal = c;
        }
      }
    });
    if (secilen < 0) break;
    const k = kutular[secilen].slice().sort((a, b) => a[kanal] - b[kanal]);
    const orta = k.length >> 1;
    kutular.splice(secilen, 1, k.slice(0, orta), k.slice(orta));
  }
  return kutular
    .map((k) => {
      const t = [0, 0, 0];
      for (const p of k) for (let c = 0; c < 3; c++) t[c] += p[c];
      return { renk: hexe(t.map((v) => v / k.length)), pay: k.length / px.length };
    })
    .sort((a, b) => b.pay - a.pay);
}

// Paletin en doygun orta tonu (çok küçük lekeler sayılmaz)
export function vurguSec(palet) {
  if (!palet || !palet.length) return null;
  const aday = palet.filter((p) => p.pay >= 0.04);
  const havuz = aday.length ? aday : palet;
  const orta = havuz.filter((p) => {
    const l = hsl(p.renk)[2];
    return l >= 0.25 && l <= 0.72;
  });
  const liste = orta.length ? orta : havuz;
  return liste.reduce((en, p) => (hsl(p.renk)[1] > hsl(en.renk)[1] ? p : en), liste[0]).renk;
}

function koyuMu(zemin) {
  return hsl(zemin)[2] < 0.5;
}

// Zeminde metin olarak okunan hali: koyu zeminde açılır, açık zeminde koyulaşır (≥ 4.5:1)
export function acikHal(renk, zemin) {
  const [h, s, l0] = hsl(renk);
  const koyu = koyuMu(zemin);
  let l = koyu ? Math.max(l0, 0.62) : Math.min(l0, 0.45);
  for (let i = 0; i < 60; i++) {
    const c = hsldenHex(h, s, l);
    if (kontrast(c, zemin) >= HEDEF) return c;
    l = Math.min(1, Math.max(0, l + (koyu ? 0.02 : -0.02)));
  }
  return koyu ? BEYAZ_YAZI : KOYU_YAZI;
}

// Dolu düğme: yazı (koyu ya da beyaz) zeminle en az 4.5:1; gerekirse zeminin açıklığı ayarlanır
export function doluButon(renk) {
  const [h, s, l0] = hsl(renk);
  let l = l0;
  for (let i = 0; i < 60; i++) {
    const c = hsldenHex(h, s, l);
    const kk = kontrast(c, KOYU_YAZI);
    const kb = kontrast(c, BEYAZ_YAZI);
    if (Math.max(kk, kb) >= HEDEF) return { zemin: c, yazi: kk >= kb ? KOYU_YAZI : BEYAZ_YAZI };
    l = Math.min(1, Math.max(0, l + (l >= 0.5 ? 0.02 : -0.02)));
  }
  return { zemin: KOYU_YAZI, yazi: BEYAZ_YAZI };
}

// Vurgu yağlı boya tonunda kalır, parlak ya da neon renk çıkmaz (Emre: "yağlı boya renkleri olsun").
// Sarılar okra kayar; bütün renklerin doygunluğu ve açıklığı toprak boyalarının aralığına indirilir.
export function yumusat(renk) {
  let [h, s, l] = hsl(renk);
  if (h >= 45 && h < 75) h = 36 + (h - 45) * 0.15;
  s = Math.min(s, h >= 75 && h < 170 ? 0.28 : 0.4);
  l = Math.min(Math.max(l, 0.3), 0.46);
  return hsldenHex(h, s, l);
}

function sonuk(renk) {
  const [h, s, l] = hsl(renk);
  return hsldenHex(h, Math.min(s, 0.26), l);
}

// Paletten CSS değişkenleri; zemin: temanın --bg rengi
export function renkTemasi(palet, zemin) {
  const secilen = vurguSec(palet);
  if (!secilen) return null;
  // İş 141: Gece'de vurgu daha az doygun (koyu zeminde açılan renk parlıyordu: "sınırlı sıcak vurgu")
  const ana = koyuMu(zemin) ? sonuk(yumusat(secilen)) : yumusat(secilen);
  const dolu = doluButon(ana);
  const acik = acikHal(ana, zemin);
  const acikYazi = kontrast(acik, KOYU_YAZI) >= kontrast(acik, BEYAZ_YAZI) ? KOYU_YAZI : BEYAZ_YAZI;
  return {
    vurgu: dolu.zemin,
    vurguYazi: dolu.yazi,
    vurguAcik: acik,
    vurguAcikYazi: acikYazi,
    vurguKoyu: karistir(ana, zemin, koyuMu(zemin) ? 0.3 : 0.14),
    vurguRgb: hexten(ana).join(', '),
  };
}

// ---------- tarayıcı: görselden palet (IndexedDB önbellekli) ----------
const bellek = new Map();

// görseli küçültüp (uzun kenarı n px) piksellerini hesapla'ya verir
function resimdenOku(url, n, hesapla) {
  return new Promise((coz, reddet) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    const zaman = setTimeout(() => reddet(new Error('zaman aşımı')), 15000);
    img.onload = () => {
      clearTimeout(zaman);
      try {
        const oran = img.naturalWidth / img.naturalHeight || 1;
        const w = oran >= 1 ? n : Math.max(8, Math.round(n * oran));
        const h = oran >= 1 ? Math.max(8, Math.round(n / oran)) : n;
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const x = c.getContext('2d', { willReadFrequently: true });
        x.drawImage(img, 0, 0, w, h);
        // CORS izni yoksa getImageData SecurityError fırlatır
        coz(hesapla(x.getImageData(0, 0, w, h).data));
      } catch (e) {
        reddet(e);
      }
    };
    img.onerror = () => {
      clearTimeout(zaman);
      reddet(new Error('görsel açılmadı'));
    };
    img.src = url;
  });
}

// url'deki görselin paleti; olmazsa (CORS, çevrimdışı) hata verir — çağıran sabit renge düşer
export function paletGetir(url) {
  if (!url) return Promise.reject(new Error('görsel yok'));
  if (bellek.has(url)) return bellek.get(url);
  const s = (async () => {
    const kayit = await idbAl('palet', url);
    if (kayit && kayit.surum === PALET_SURUMU && Array.isArray(kayit.palet) && kayit.palet.length) return kayit.palet;
    const palet = await resimdenOku(url, 64, paletHesapla);
    if (!palet.length) throw new Error('boş palet');
    idbKoy('palet', url, { palet, surum: PALET_SURUMU, zaman: Date.now() });
    return palet;
  })();
  bellek.set(url, s);
  s.catch(() => bellek.delete(url));
  return s;
}

// ---------- 1.77.0 · renkli Gündüz için tablonun renk aileleri ----------
// Median-cut paleti (yukarıda) tabloyu 6 kutuya bölüp ortalar: çok renkli tablolarda bile çoğu zaman kahverengiler
// çıkar. Eski, verniklenmiş tablolarda renkler gözün sandığından da soluktur (Pontormo'nun "mavi" cüppesi
// rgb(136,143,151)). Gündüz paleti için pikseller altı renk ailesine ayrılır: kırmızı, turuncu (ten, toprak), okr
// (altın, sarı), yeşil, mavi, mor. Önce tablonun genel renk kayması (sarı vernik) yarı yarıya dengelenir (gri dünya):
// göz de soluk maviyi sarı tablonun içinde mavi görür. Ağırlık renkliliğin karesi (en − en az kanal; en az 0,04):
// geniş ama soluk alanlar değil, tablonun canlı yerleri sayılır. Her aile için payı ve ortalama tonu döner.
// acik: açık alanların (gök, zemin) dengelenmemiş ortalaması; renkOrani: renkli piksellerin payı (gravürde ~0).
export const RENK_AILELERI = [
  ['kirmizi', 345, 15],
  ['turuncu', 15, 45],
  ['okr', 45, 70],
  ['yesil', 70, 170],
  ['mavi', 170, 260],
  ['mor', 260, 345],
];
const DENGE = 0.5;
function aileBul(h) {
  for (const [ad, a, b] of RENK_AILELERI) if (a < b ? h >= a && h < b : h >= a || h < b) return ad;
  return 'kirmizi';
}
export function tonlariHesapla(veri) {
  const ort = [0, 0, 0];
  let say = 0;
  for (let i = 0; i + 3 < veri.length; i += 4) {
    if (veri[i + 3] < 128) continue;
    ort[0] += veri[i];
    ort[1] += veri[i + 1];
    ort[2] += veri[i + 2];
    say++;
  }
  const gri = (ort[0] + ort[1] + ort[2]) / 3;
  const kazanc = ort.map((m) => (m > 0 ? (gri / m) ** DENGE : 1));
  const aile = Object.fromEntries(RENK_AILELERI.map(([ad]) => [ad, { w: 0, x: 0, y: 0, s: 0, l: 0 }]));
  const acik = [0, 0, 0];
  let acikSay = 0;
  let renkli = 0;
  for (let i = 0; i + 3 < veri.length; i += 4) {
    if (veri[i + 3] < 128) continue;
    const r = Math.min(1, (veri[i] / 255) * kazanc[0]);
    const g = Math.min(1, (veri[i + 1] / 255) * kazanc[1]);
    const b = Math.min(1, (veri[i + 2] / 255) * kazanc[2]);
    const en = Math.max(r, g, b);
    const az = Math.min(r, g, b);
    const l = (en + az) / 2;
    if ((veri[i] + veri[i + 1] + veri[i + 2]) / 765 >= 0.62) {
      acik[0] += veri[i];
      acik[1] += veri[i + 1];
      acik[2] += veri[i + 2];
      acikSay++;
    }
    const f = en - az;
    if (f < 0.04 || l < 0.1 || l > 0.92) continue;
    renkli++;
    const s = f / (1 - Math.abs(2 * l - 1));
    let h = en === r ? ((g - b) / f) % 6 : en === g ? (b - r) / f + 2 : (r - g) / f + 4;
    h = (h * 60 + 360) % 360;
    const w = f * f * (1 - Math.abs(l - 0.5));
    const k = aile[aileBul(h)];
    const a = (h * Math.PI) / 180;
    k.w += w;
    k.x += Math.cos(a) * w;
    k.y += Math.sin(a) * w;
    k.s += s * w;
    k.l += l * w;
  }
  const toplamW = Object.values(aile).reduce((t, k) => t + k.w, 0);
  const aileler = RENK_AILELERI.map(([ad]) => {
    const k = aile[ad];
    if (!k.w) return { ad, pay: 0, renk: null };
    const h = ((Math.atan2(k.y, k.x) * 180) / Math.PI + 360) % 360;
    return { ad, pay: k.w / toplamW, renk: hsldenHex(h, Math.min(1, Math.max(0.3, k.s / k.w)), k.l / k.w) };
  });
  return {
    aileler,
    acik: acikSay ? hexe(acik.map((v) => v / acikSay)) : null,
    renkOrani: say ? renkli / say : 0,
  };
}

// görselin tonları (paletGetir gibi IndexedDB önbellekli; ayrı anahtar)
const TON_SURUMU = 4;
const tonBellek = new Map();
export function tonlariGetir(url) {
  if (!url) return Promise.reject(new Error('görsel yok'));
  if (tonBellek.has(url)) return tonBellek.get(url);
  const s = (async () => {
    const anahtar = 'ton:' + url;
    const kayit = await idbAl('palet', anahtar);
    if (kayit && kayit.surum === TON_SURUMU && kayit.tonlar) return kayit.tonlar;
    const tonlar = await resimdenOku(url, 96, tonlariHesapla);
    idbKoy('palet', anahtar, { tonlar, surum: TON_SURUMU, zaman: Date.now() });
    return tonlar;
  })();
  tonBellek.set(url, s);
  s.catch(() => tonBellek.delete(url));
  return s;
}
