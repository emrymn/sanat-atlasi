// Zor yanlış seçenekler (çeldiriciler).
import { karistir } from './yardimci.js';

const VARSAYILAN_OMUR = 60;

// Akımların ortalama orta yılı: tarihi bilinmeyen sanatçılar için tahmin
export function akimOrtaYillari(sanatcilar) {
  const top = {};
  for (const s of sanatcilar) {
    const a = yasamAraligi(s, null);
    if (!a) continue;
    (top[s.akim] ||= []).push((a[0] + a[1]) / 2);
  }
  const sonuc = {};
  for (const [ad, ys] of Object.entries(top)) sonuc[ad] = ys.reduce((x, y) => x + y, 0) / ys.length;
  return sonuc;
}

// [başlangıç, bitiş] yaşam aralığı; eksik uçlar tahmin edilir.
export function yasamAraligi(s, ortaYillar) {
  let d = s.dogum ?? null;
  let o = s.olum ?? null;
  if (d === null && o === null) {
    const m = ortaYillar && ortaYillar[s.akim];
    if (m === undefined || m === null) return null;
    return [m - VARSAYILAN_OMUR / 2, m + VARSAYILAN_OMUR / 2];
  }
  if (d === null) d = o - VARSAYILAN_OMUR;
  if (o === null) o = d + VARSAYILAN_OMUR;
  return [d, o];
}

function ortusur(a, b, pay) {
  if (!a || !b) return false;
  return b[0] <= a[1] + pay && b[1] >= a[0] - pay;
}

function ortaNokta(a) {
  return a ? (a[0] + a[1]) / 2 : 0;
}

// Sanatçı sorusu için 3 çeldirici. seviye (js/seviye.js) şıkların ne kadar benzer olacağını belirler:
// 'zor':   1) aynı akım (önce açık, sonra kapalı), 2) komşu akımlar ±50 yıl örtüşen,
//          3) ±100 yıl içindeki herkes, 4) (yedek) zamanca en yakınlar.
// 'orta':  aynı akım yok; önce komşu akımlar (±50 yıl), sonra başka akımlardan ±100 yıl içindekiler.
// 'kolay': aynı ve komşu akımlar yok; dönem sırasında en az UZAK_FARK uzak akımlardan.
// 'karma': 1 şaşırtmalı (aynı ya da komşu akım) + gerisi 'kolay' gibi uzak (İş 30, harita bölümleri).
// Orta ve kolayda yeterli aday yoksa zor sıraya düşülür (her zaman 4 seçenek olsun).
export const UZAK_FARK = 3;
// İş 30 · aynı soyadlı akrabalar (Lorenzetti kardeşler, Orazio ve Artemisia Gentileschi …) hiçbir soruda birbirinin şıkkı olmaz.
// Soyadı: adın son kelimesi; "the Elder/Younger", "il Giovane/Vecchio", "Jr." ve parantezler atılır.
export function soyadi(s) {
  const t = String((s && (s.ad_arama || s.ad)) || '')
    .replace(/\(.*?\)/g, ' ')
    .replace(/,.*$/, '')
    .replace(/\b(the (elder|younger)|il (giovane|vecchio)|jr\.?|sr\.?)/gi, ' ')
    .trim()
    .toLocaleLowerCase('tr')
    .split(/\s+/);
  return t[t.length - 1] || '';
}
export const akrabaMi = (a, b) => !!a && !!b && a.id !== b.id && soyadi(a) !== '' && soyadi(a) === soyadi(b);
export function sanatciCeldiricileri(hedef, { sanatcilar, akimlar, acikIdler = new Set(), rng = Math.random, adet = 3, ortaYillar = null, seviye = 'zor' }) {
  const oy = ortaYillar || akimOrtaYillari(sanatcilar);
  const hedefAralik = yasamAraligi(hedef, oy);
  const akim = akimlar.find((a) => a.ad === hedef.akim);
  const komsular = new Set((akim && akim.komsular) || []);
  const secilen = [];
  const kullanilan = new Set([hedef.id]);
  const kullanilanAd = new Set([hedef.ad]);

  const acikOnce = (liste) => {
    const k = karistir(liste, rng);
    return [...k.filter((s) => acikIdler.has(s.id)), ...k.filter((s) => !acikIdler.has(s.id))];
  };
  const soyadlar = new Set([soyadi(hedef)]);
  // gevşek: şıklar birbirinin akrabası olabilir ama hedefin akrabası asla (yalnız aday yetmezse, 4 şık olsun diye)
  let gevsek = false;
  const ekle = (liste, sinir = adet) => {
    for (const s of liste) {
      if (secilen.length >= sinir) return;
      if (kullanilan.has(s.id) || kullanilanAd.has(s.ad)) continue;
      if (gevsek ? soyadi(s) === soyadi(hedef) : soyadlar.has(soyadi(s))) continue;
      soyadlar.add(soyadi(s));
      kullanilan.add(s.id);
      kullanilanAd.add(s.ad);
      secilen.push(s);
    }
  };

  const sira = Object.fromEntries(akimlar.map((a) => [a.ad, a.sira]));
  const uzak = (s) => akim && sira[s.akim] !== undefined && !komsular.has(s.akim) && Math.abs(sira[s.akim] - akim.sira) >= UZAK_FARK;
  if (seviye === 'kolay') {
    ekle(acikOnce(sanatcilar.filter(uzak)));
    ekle(acikOnce(sanatcilar.filter((s) => s.akim !== hedef.akim && !komsular.has(s.akim))));
  } else if (seviye === 'karma') {
    // İş 30 · harita bölümlerinde Kolay ve Orta: biri şaşırtmalı (aynı akım, yoksa komşu akım), gerisi uzak dönemlerden
    ekle(acikOnce(sanatcilar.filter((s) => s.akim === hedef.akim)), 1);
    ekle(acikOnce(sanatcilar.filter((s) => komsular.has(s.akim) && ortusur(hedefAralik, yasamAraligi(s, oy), 50))), 1);
    ekle(acikOnce(sanatcilar.filter(uzak)));
    ekle(acikOnce(sanatcilar.filter((s) => s.akim !== hedef.akim && !komsular.has(s.akim))));
  } else if (seviye === 'orta') {
    ekle(acikOnce(sanatcilar.filter((s) => komsular.has(s.akim) && ortusur(hedefAralik, yasamAraligi(s, oy), 50))));
    ekle(acikOnce(sanatcilar.filter((s) => s.akim !== hedef.akim && ortusur(hedefAralik, yasamAraligi(s, oy), 100))));
  }
  const genel = () => {
    ekle(acikOnce(sanatcilar.filter((s) => s.akim === hedef.akim)));
    ekle(acikOnce(sanatcilar.filter((s) => komsular.has(s.akim) && ortusur(hedefAralik, yasamAraligi(s, oy), 50))));
    ekle(acikOnce(sanatcilar.filter((s) => ortusur(hedefAralik, yasamAraligi(s, oy), 100))));
    if (secilen.length < adet) {
      const m = ortaNokta(hedefAralik);
      ekle(sanatcilar.slice().sort((a, b) => Math.abs(ortaNokta(yasamAraligi(a, oy)) - m) - Math.abs(ortaNokta(yasamAraligi(b, oy)) - m)));
    }
  };
  genel();
  if (secilen.length < adet) {
    gevsek = true;
    genel();
  }
  return secilen;
}

// Dört seçenek (doğru + 3 çeldirici), karıştırılmış.
export function sanatciSecenekleri(hedef, baglam) {
  const rng = baglam.rng || Math.random;
  return karistir([hedef, ...sanatciCeldiricileri(hedef, baglam)], rng);
}

// Akım sorusu: doğru akım + en fazla 3 komşu, sonra kronolojik olarak en yakınlar.
// seviye 'kolay': komşular yerine dönem sırasında en az UZAK_FARK uzak akımlar (yetmezse en yakınlar).
export function akimSecenekleri(akimAdi, akimlar, rng = Math.random, adet = 4, seviye = 'zor') {
  const akim = akimlar.find((a) => a.ad === akimAdi);
  if (!akim) return [akimAdi];
  const secilen = [akimAdi];
  if (seviye === 'kolay') {
    const komsu = new Set(akim.komsular || []);
    for (const a of karistir(akimlar.filter((a) => !komsu.has(a.ad) && Math.abs(a.sira - akim.sira) >= UZAK_FARK), rng)) {
      if (secilen.length >= adet) break;
      secilen.push(a.ad);
    }
  }
  for (const k of seviye === 'kolay' ? [] : karistir(akim.komsular || [], rng)) {
    if (secilen.length >= adet) break;
    if (!secilen.includes(k) && akimlar.some((a) => a.ad === k)) secilen.push(k);
  }
  const yakinlar = akimlar
    .filter((a) => !secilen.includes(a.ad))
    .sort((a, b) => Math.abs(a.sira - akim.sira) - Math.abs(b.sira - akim.sira) || a.sira - b.sira);
  for (const a of yakinlar) {
    if (secilen.length >= adet) break;
    secilen.push(a.ad);
  }
  return karistir(secilen, rng);
}
