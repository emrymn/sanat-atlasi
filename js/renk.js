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

// Neon görünen tonları temaya yaklaştırır: sarılar altın tonuna kayar ve doygunluğu düşer,
// yeşiller ve öbür renkler de üst sınırla yumuşar (Emre: "neon sarı temayı bozuyor")
export function yumusat(renk) {
  let [h, s, l] = hsl(renk);
  if (h >= 45 && h < 75) {
    h = 40 + (h - 40) * 0.3;
    s = Math.min(s, 0.42);
  } else if (h >= 75 && h < 170) s = Math.min(s, 0.38);
  else s = Math.min(s, 0.6);
  return hsldenHex(h, s, l);
}

// Paletten CSS değişkenleri; zemin: temanın --bg rengi
export function renkTemasi(palet, zemin) {
  const secilen = vurguSec(palet);
  if (!secilen) return null;
  const ana = yumusat(secilen);
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

function resimdenPalet(url) {
  return new Promise((coz, reddet) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    const zaman = setTimeout(() => reddet(new Error('zaman aşımı')), 15000);
    img.onload = () => {
      clearTimeout(zaman);
      try {
        const n = 64;
        const oran = img.naturalWidth / img.naturalHeight || 1;
        const w = oran >= 1 ? n : Math.max(8, Math.round(n * oran));
        const h = oran >= 1 ? Math.max(8, Math.round(n / oran)) : n;
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const x = c.getContext('2d', { willReadFrequently: true });
        x.drawImage(img, 0, 0, w, h);
        // CORS izni yoksa getImageData SecurityError fırlatır
        coz(paletHesapla(x.getImageData(0, 0, w, h).data));
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
    const palet = await resimdenPalet(url);
    if (!palet.length) throw new Error('boş palet');
    idbKoy('palet', url, { palet, surum: PALET_SURUMU, zaman: Date.now() });
    return palet;
  })();
  bellek.set(url, s);
  s.catch(() => bellek.delete(url));
  return s;
}
