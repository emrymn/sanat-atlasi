// 1.77.0 · Renkli Gündüz (Emre: "gündüz teması çok beyaz ve parlak, bu bir resim tarihi uygulaması, bu kadar sade
// olmamalı"; ardından: "renklerin seçimi günün resimlerine göre ayarlansın … tema o renklere göre değişsin, ayarlardan
// değiştirme seçeneği ekleriz"). Gündüz'ün zemini, kartları, mürekkebi, sekme çubuğu, çark ve etiketleri bir paletten
// boyanır. Palet ya günün tablosundan üretilir (otomatik) ya da dört hazır pigment paletinden biridir; "Nötr kâğıt"
// eski Gündüz'dür. Yalnız renk değişir: düzen, yazılar ve resimler aynı kalır. Saf fonksiyonlar; DOM'a ortak.js yazar.
import { hsl, hsldenHex, hexten } from './renk.js';
import { kontrast } from './tasarim.js';

export const GUNDUZ_RENKLERI = ['otomatik', 'lapis', 'pompei', 'bakir', 'safran', 'notr'];
export const VARSAYILAN_GUNDUZ_RENGI = 'otomatik';
export const GUNDUZ_RENK_AD = {
  otomatik: 'Günün resmi',
  lapis: 'Lapis',
  pompei: 'Pompei',
  bakir: 'Bakır yeşili',
  safran: 'Safran',
  notr: 'Nötr kâğıt',
};

// Bir palet: zemin (bg), kart (surface), çizgi (border), mürekkepler, koyu bant (sekme çubuğu, çark, durum çubuğu),
// bandın üstündeki yazılar, altın (seçili sekme, çarkın ibresi, çerçeve), pirinç (metin olarak okunan vurgu),
// etiket (üst etiketler)
export const HAZIR_PALETLER = {
  lapis: {
    bg: '#e6dcc4', surface: '#faf5e8', border: '#d3c6a6',
    ink: '#1a2138', ink2: '#424862', ink3: '#555a72', soluk: '#8a8778',
    band: '#1f3768', bandInk: '#f4ecd8', bandInk2: '#c9cfe3', sekme: '#1f3768',
    altin: '#c49a3a', pirinc: '#7a510e', etiket: '#1f3768',
  },
  pompei: {
    bg: '#efdcc6', surface: '#fff7ec', border: '#dfc2a5',
    ink: '#2b1712', ink2: '#5e4134', ink3: '#6e5144', soluk: '#9a7d6c',
    band: '#8c2a22', bandInk: '#fbebd8', bandInk2: '#f0cdb9', sekme: '#3a1e17',
    altin: '#d29a3c', pirinc: '#8a5410', etiket: '#8c2a22',
  },
  bakir: {
    bg: '#d6e3da', surface: '#f4f9f5', border: '#b6cbc2',
    ink: '#12302b', ink2: '#3e5852', ink3: '#4c665f', soluk: '#7f958f',
    band: '#22544d', bandInk: '#eef7f2', bandInk2: '#cfe7df', sekme: '#12302b',
    altin: '#d97c8e', pirinc: '#a2405a', etiket: '#22544d',
  },
  safran: {
    bg: '#f3e1b0', surface: '#fff8e4', border: '#e2c987',
    ink: '#1d1e3a', ink2: '#48466a', ink3: '#57557a', soluk: '#8c8466',
    band: '#25306a', bandInk: '#fbf1d6', bandInk2: '#c5cae6', sekme: '#25306a',
    altin: '#e0a02f', pirinc: '#a33a24', etiket: '#25306a',
  },
};

// Otomatik palet üretilemezse (siyah-beyaz gravür, renksiz tablo, görsel açılmadı)
export const YEDEK_PALET = 'lapis';

const arala = (x, a, b) => Math.min(b, Math.max(a, x));
const tonFarki = (a, b) => {
  const x = Math.abs(a - b) % 360;
  return Math.min(x, 360 - x);
};

// (h, s) tonunda, verilen zeminlerin hepsine en az `hedef` kontrastla okunan renk: açıklık koyulaştırılarak aranır
function okunur(h, s, l, zeminler, hedef = 4.5) {
  for (let i = 0; i < 60; i++) {
    const c = hsldenHex(h, s, l);
    if (zeminler.every((z) => kontrast(c, z) >= hedef)) return c;
    l = Math.max(0, l - 0.015);
  }
  return hsldenHex(h, s, 0.08);
}
// koyu zeminde okunan açık renk: açıklık artırılarak aranır
function acikOkunur(h, s, l, zemin, hedef = 4.5) {
  for (let i = 0; i < 60; i++) {
    const c = hsldenHex(h, s, l);
    if (kontrast(c, zemin) >= hedef) return c;
    l = Math.min(1, l + 0.015);
  }
  return '#ffffff';
}

// Günün tablosunun renk ailelerinden (js/renk.js tonlariHesapla: { aileler: [{ad, pay, renk}], acik, renkOrani })
// Gündüz paleti; "en uygun kombinasyon" şöyle seçilir:
// · bant (sekme çubuğu, çark, durum çubuğu): tablonun kimliğini veren renk: kırmızı, yeşil, mavi ya da mor
//   ailelerinden payı en az %5 olan en büyüğü (Pontormo ve Tizian'da mavi, van Eyck'te yeşil, Gece Kahvesi'nde
//   kırmızı). Hemen her eski tabloda en çok yer tutan ten, toprak ve altın bandı olamaz; böyle renk yoksa (Caravaggio)
//   bant toprak, siena olur.
// · altın (seçili sekme, ibre, çerçeve, pirinç yazı): bandın tonundan en az 45° ayrışan en büyük aile; çoğu zaman
//   tablonun okru ya da altını. Yoksa okr altın.
// · kâğıt: tablonun açık alanlarının tonu (yoksa bandın), hafif renkli.
// Açıklıklar sabit aralıkta, kontrast denetimli: yazı her palette okunur (≥ 4.5; mürekkep ve bant yazısı ≥ 7).
// Renksiz tabloda (gravür, grisaille) null döner; çağıran hazır palete düşer.
const BANT_AILELERI = ['kirmizi', 'yesil', 'mavi', 'mor'];
const BANT_ESIGI = 0.05;
export function resimdenPalet(t) {
  if (!t || !Array.isArray(t.aileler) || !(t.renkOrani >= 0.04)) return null;
  const aileler = t.aileler
    .filter((a) => a && a.pay > 0 && /^#[0-9a-f]{6}$/i.test(a.renk))
    .map((a) => {
      const [h, s, l] = hsl(a.renk);
      return { ad: a.ad, h, s, l, pay: a.pay };
    })
    .sort((a, b) => b.pay - a.pay);
  if (!aileler.length) return null;
  const kimlik = aileler.find((a) => BANT_AILELERI.includes(a.ad) && a.pay >= BANT_ESIGI);
  const ana = kimlik || { ad: 'toprak', h: 20, s: 0.45, l: 0.3, pay: 0 };
  // toprak bandında vurgu tablonun altını (okr ya da turuncu: siena ile altın açıklıkça ayrışır)
  const ikinci = kimlik
    ? aileler.find((a) => a !== kimlik && tonFarki(a.h, ana.h) >= 45 && a.pay >= 0.04)
    : aileler.find((a) => (a.ad === 'okr' || a.ad === 'turuncu') && a.pay >= 0.04);
  const vurgu = ikinci || { h: 40, s: 0.55 };
  const hb = ana.h;
  const sb = arala(ana.s, 0.35, 0.6);
  // okr ve turuncu vurgu altına çekilir (yaldız tonu); başka renkler kendi tonunda
  const ha = ikinci && (ikinci.ad === 'turuncu' || ikinci.ad === 'okr') ? arala(vurgu.h, 34, 46) : vurgu.h;
  const sa = arala(vurgu.s, 0.45, 0.65);
  // kâğıt: tablonun açık alanlarının tonu; renksizse bandın tonu
  const [ah, as] = t.acik ? hsl(t.acik) : [hb, 0];
  const hz = as >= 0.08 ? ah : hb;
  const sz = arala(as >= 0.08 ? as : 0.25, 0.18, 0.38);

  const bg = hsldenHex(hz, sz, 0.86);
  const surface = hsldenHex(hz, sz * 0.8, 0.955);
  const border = hsldenHex(hz, sz * 0.8, 0.76);
  // bant: üstündeki açık yazı en az 7:1 okunana kadar koyulaşır (yeşil gibi parlak tonlar daha koyu iner)
  const bandInk = hsldenHex(hz, 0.45, 0.93);
  const band = okunur(hb, sb, 0.27, [bandInk], 7);
  const zeminler = [bg, surface];
  return {
    bg, surface, border,
    ink: okunur(hb, 0.35, 0.15, zeminler, 7),
    ink2: okunur(hb, 0.2, 0.33, zeminler),
    ink3: okunur(hb, 0.16, 0.38, zeminler),
    soluk: hsldenHex(hb, 0.12, 0.55),
    band,
    bandInk: acikOkunur(hz, 0.45, 0.93, band, 7),
    bandInk2: acikOkunur(hb, 0.3, 0.8, band),
    sekme: band,
    altin: hsldenHex(ha, sa, 0.6),
    pirinc: okunur(ha, sa, 0.42, zeminler),
    etiket: okunur(hb, sb, 0.3, zeminler),
  };
}

const rgb = (hex) => hexten(hex).join(', ');

// Paletten CSS değişkenleri (kökün satır içi stiline yazılır; temanın sabit Gündüz değerlerinin önüne geçer)
export function paletDegiskenleri(p) {
  const altinYazi = kontrast(p.altin, p.ink) >= 4.5 ? p.ink : '#ffffff';
  return {
    '--bg': p.bg,
    '--bg-rgb': rgb(p.bg),
    '--surface': p.surface,
    '--border': p.border,
    '--ink': p.ink,
    '--ink-2': p.ink2,
    '--ink-3': p.ink3,
    '--ink-soluk': p.soluk,
    '--notr-kenar': `rgba(${rgb(p.band)}, 0.2)`,
    '--notr-yuzey': `rgba(${rgb(p.band)}, 0.06)`,
    '--doku': `radial-gradient(rgba(${rgb(p.band)}, 0.06) 1px, transparent 1px)`,
    '--tab-bg': `rgba(${rgb(p.surface)}, 0.84)`,
    '--overlay-btn': `rgba(${rgb(p.surface)}, 0.85)`,
    '--durum-cubugu': p.band,
    '--pirinc': p.pirinc,
    '--pirinc-rgb': rgb(p.pirinc),
    '--pirinc-yazi': p.surface,
    '--band': p.band,
    '--band-rgb': rgb(p.band),
    '--band-ink': p.bandInk,
    '--band-ink-2': p.bandInk2,
    '--sekme-zemin': rgb(p.sekme),
    '--altin': p.altin,
    '--altin-rgb': rgb(p.altin),
    '--altin-yazi': altinYazi,
    '--etiket': p.etiket,
  };
}
// kökten silinecek değişkenler (tema Gece'ye ya da Nötr'e dönünce)
export const PALET_DEGISKENLERI = Object.keys(paletDegiskenleri(HAZIR_PALETLER.lapis));

// Seçime göre palet: otomatikte günün tablosunun tonları (yoksa ya da renksizse hazır yedek); notr → null
export function gunduzPaleti(secim, tonlar) {
  if (secim === 'notr') return null;
  if (HAZIR_PALETLER[secim]) return HAZIR_PALETLER[secim];
  return resimdenPalet(tonlar) || HAZIR_PALETLER[YEDEK_PALET];
}
