// Çalış · Ders düzeni (1.79.0 hazırlığı): her akım bir ders, dört adım: Gör → Öğren → Ayırt et → Sına.
// Saf mantık (birim testli; ekran yok). Ekranlar bunun üstüne kurulur; adımların içeriği data/ders_kaynaklari.json'dan
// (scripts/ders/kaynaklar.mjs). Tasarım: https://claude.ai/artifact/VFJEDsgn6e7278NmuBgsYF
//
// Kayıt: ilerleme.dersler[akım adı] = { gor: { i, t }, ogren: { i, t }, ayirt: { i, t }, sina: { i, t } }
//   i: adımın ilerlemesi 0–1 (görülen nokta / madde / ikili oranı ya da Sına'nın en iyi doğru oranı; hiç düşmez)
//   t: adımın ilk bittiği gün (YYYY-MM-DD) ya da yok
// Bir adım i ≥ esiği olunca biter (Sına için SINA_GECME, ötekiler için 1). Adımlar sırayla önerilir ama kilitli
// değildir: kullanıcı istediği adımı açabilir (ders düzeni öğretmek içindir, sınav kapısı değil).
import { akimAdi } from './birlesme.js';

export const DERS_ADIMLARI = ['gor', 'ogren', 'ayirt', 'sina'];
export const ADIM_ADLARI = { gor: 'Gör', ogren: 'Öğren', ayirt: 'Ayırt et', sina: 'Sına' };
export const SINA_GECME = 0.75; // haritadaki bölüm geçme sınırıyla aynı (js/bolum.js BOLUM_GECME)

const TARIH = /^\d{4}-\d{2}-\d{2}$/;
const esik = (adim) => (adim === 'sina' ? SINA_GECME : 1);
const sinirla = (x) => Math.min(1, Math.max(0, Math.round(x * 1000) / 1000));

// Bir akımın kaydı (yoksa boş adımlar); her zaman dört adım döner
export function dersKaydi(ilerleme, akim) {
  const k = ilerleme && ilerleme.dersler && Object.hasOwn(ilerleme.dersler, akim) ? ilerleme.dersler[akim] : null;
  return Object.fromEntries(DERS_ADIMLARI.map((a) => [a, { i: (k && k[a] && k[a].i) || 0, t: (k && k[a] && k[a].t) || null }]));
}

export const adimBittiMi = (kayit, adim) => (kayit[adim] ? kayit[adim].i : 0) >= esik(adim) - 1e-9;

// Adımın ilerlemesini işler (yalnız artar). Dönen: { once, sonra, bitti, yeniBitti }
export function adimIsle(ilerleme, akim, adim, oran, bugun) {
  if (!DERS_ADIMLARI.includes(adim)) throw new Error(`bilinmeyen ders adımı: ${adim}`);
  const once = dersKaydi(ilerleme, akim);
  const i = Math.max(once[adim].i, sinirla(Number(oran) || 0));
  const sonraAdim = { i, t: once[adim].t };
  const yeniBitti = !adimBittiMi(once, adim) && i >= esik(adim) - 1e-9;
  if (yeniBitti) sonraAdim.t = bugun;
  const sonra = { ...once, [adim]: sonraAdim };
  ilerleme.dersler = { ...(ilerleme.dersler || {}), [akim]: sonra };
  return { once, sonra, bitti: adimBittiMi(sonra, adim), yeniBitti };
}

// Ekrandaki durum: her adımın ilerlemesi, sıradaki (ilk bitmemiş) adım, biten adım sayısı.
// adimlar (1.79.0): dersin var olan adımları. Gör verisi olmayan derste (Dada, Sürrealizm, Savaş sonrası figürasyon)
// ['ogren', 'ayirt', 'sina'] verilir: ders üç adımla gösterilir ve üç adımla biter. Verilmezse dört adım.
export function dersDurumu(kayit, adimlar = DERS_ADIMLARI) {
  const liste = DERS_ADIMLARI.filter((a) => adimlar.includes(a));
  const durumlar = liste.map((a) => ({ adim: a, ad: ADIM_ADLARI[a], i: kayit[a].i, bitti: adimBittiMi(kayit, a) }));
  const siradaki = (durumlar.find((x) => !x.bitti) || null)?.adim ?? null;
  const biten = durumlar.filter((x) => x.bitti).length;
  return { adimlar: durumlar, siradaki, biten, bitti: biten === liste.length };
}

// "Bugünün dersi": Yolculuk'taki "Buradasın" durağının akımı (dersi bitmemişse); yoksa dönem sırasıyla ilk bitmemiş açık
// akım; hepsi bittiyse null. acikAkimlar: kronolojik sırayla açık akım adları. adimlar: (akım) => o dersin adımları
// (verilmezse her ders dört adım).
export function bugununDersi({ acikAkimlar, ilerleme, yolculukAkimi = null, adimlar = null }) {
  const bitmedi = (ad) => !dersDurumu(dersKaydi(ilerleme, ad), adimlar ? adimlar(ad) : DERS_ADIMLARI).bitti;
  if (yolculukAkimi && acikAkimlar.includes(yolculukAkimi) && bitmedi(yolculukAkimi)) return yolculukAkimi;
  return acikAkimlar.find(bitmedi) ?? null;
}

// Yedek ve açılış doğrulaması (js/depo.js ilerlemeDogrula). Bozuk değerler atılır; birleşen akımların kaydı hedefe
// katılır (yüksek ilerleme, erken bitiş günü).
export function derslerDogrula(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {};
  const sonuc = {};
  for (const [ham, k] of Object.entries(v)) {
    if (!k || typeof k !== 'object' || Array.isArray(k) || ham.length > 80) continue;
    const ad = akimAdi(ham);
    const eski = sonuc[ad] || {};
    const t = {};
    for (const a of DERS_ADIMLARI) {
      const x = k[a];
      const i = x && typeof x.i === 'number' && Number.isFinite(x.i) ? sinirla(x.i) : 0;
      const gun = x && typeof x.t === 'string' && TARIH.test(x.t) ? x.t : null;
      const o = eski[a] || { i: 0, t: null };
      const enIyi = Math.max(i, o.i);
      const gunler = [gun, o.t].filter(Boolean).sort();
      if (enIyi > 0 || gunler.length) t[a] = { i: enIyi, ...(gunler.length && enIyi >= esik(a) - 1e-9 ? { t: gunler[0] } : {}) };
    }
    if (Object.keys(t).length) sonuc[ad] = t;
  }
  return sonuc;
}
