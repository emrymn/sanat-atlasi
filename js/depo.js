// İlerleme nesnesi: localStorage'da tutulur, IndexedDB'ye yansıtılır (yedek).
import { idbAl, idbKoy } from './idb.js';
import { bugunStr } from './leitner.js';

export const ANAHTAR = 'sanat-atlasi:ilerleme';
export const SURUM = 1;
export const TEMALAR = ['sepya', 'acik', 'koyu'];

export function varsayilanIlerleme(islenen = []) {
  return {
    surum: SURUM,
    islenen: islenen.slice(),
    ayarlar: { gunlukKart: 20, tema: 'sepya' },
    skorlar: {},
    gunluk: { tarih: bugunStr(), yeni: 0, kart: 0, yeniIdler: [] },
    sonEserler: {},
    olusturma: new Date().toISOString(),
  };
}

function skorGecerli(s) {
  return (
    s === undefined ||
    (s && typeof s === 'object' && Number.isInteger(s.kutu) && s.kutu >= 0 && s.kutu <= 5 && Number.isFinite(s.dogru) && Number.isFinite(s.yanlis))
  );
}

// Yedekten gelen ya da depodan okunan nesneyi doğrular ve eksikleri tamamlar.
// Geçersizse Error fırlatır.
export function ilerlemeDogrula(nesne) {
  if (!nesne || typeof nesne !== 'object') throw new Error('Yedek bir JSON nesnesi değil.');
  const v = nesne.ilerleme && typeof nesne.ilerleme === 'object' ? nesne.ilerleme : nesne;
  if (!Array.isArray(v.islenen) || !v.islenen.every((n) => Number.isInteger(n))) throw new Error('“islenen” konu listesi bulunamadı.');
  if (v.skorlar !== undefined && (typeof v.skorlar !== 'object' || Array.isArray(v.skorlar))) throw new Error('“skorlar” geçersiz.');
  const skorlar = {};
  for (const [id, s] of Object.entries(v.skorlar || {})) {
    if (!s || typeof s !== 'object' || !skorGecerli(s.sanatci) || !skorGecerli(s.akim)) throw new Error(`“${id}” için skor geçersiz.`);
    skorlar[id] = {};
    if (s.sanatci) skorlar[id].sanatci = s.sanatci;
    if (s.akim) skorlar[id].akim = s.akim;
  }
  const t = varsayilanIlerleme();
  const ayarlar = { ...t.ayarlar, ...(v.ayarlar || {}) };
  if (!TEMALAR.includes(ayarlar.tema)) ayarlar.tema = 'sepya';
  ayarlar.gunlukKart = Math.min(100, Math.max(5, parseInt(ayarlar.gunlukKart, 10) || 20));
  return {
    ...t,
    islenen: [...new Set(v.islenen)].sort((a, b) => a - b),
    ayarlar,
    skorlar,
    gunluk:
      v.gunluk && typeof v.gunluk === 'object'
        ? { ...t.gunluk, ...v.gunluk, yeniIdler: Array.isArray(v.gunluk.yeniIdler) ? v.gunluk.yeniIdler : [] }
        : t.gunluk,
    sonEserler: v.sonEserler && typeof v.sonEserler === 'object' ? v.sonEserler : {},
    olusturma: v.olusturma || t.olusturma,
  };
}

export function yedekMetni(ilerleme) {
  return JSON.stringify({ uygulama: 'sanat-atlasi', surum: SURUM, tarih: new Date().toISOString(), ilerleme }, null, 1);
}

export function yedekCoz(metin) {
  let nesne;
  try {
    nesne = JSON.parse(String(metin || '').trim());
  } catch (e) {
    throw new Error('Metin geçerli JSON değil.');
  }
  return ilerlemeDogrula(nesne);
}

// Günlük sayaçları tarih değişince sıfırla
export function gunlukGuncelle(ilerleme, bugun = bugunStr()) {
  if (!ilerleme.gunluk || ilerleme.gunluk.tarih !== bugun) ilerleme.gunluk = { tarih: bugun, yeni: 0, kart: 0, yeniIdler: [] };
  return ilerleme.gunluk;
}

export async function ilerlemeYukle(baslangicGetir) {
  try {
    const ham = localStorage.getItem(ANAHTAR);
    if (ham) return ilerlemeDogrula(JSON.parse(ham));
  } catch (e) {
    /* bozuk ya da erişilemez; IndexedDB yedeğine bak */
  }
  try {
    const idb = await idbAl('ilerleme', 'ana');
    if (idb) return ilerlemeDogrula(idb);
  } catch (e) {
    /* yok */
  }
  let islenen = [];
  try {
    islenen = (await baslangicGetir()).islenen || [];
  } catch (e) {
    /* başlangıç dosyası yoksa boş */
  }
  return varsayilanIlerleme(islenen);
}

let idbZamanlayici = null;
export function ilerlemeKaydet(ilerleme) {
  try {
    localStorage.setItem(ANAHTAR, JSON.stringify(ilerleme));
  } catch (e) {
    /* kota/özel mod: IndexedDB yine denenir */
  }
  clearTimeout(idbZamanlayici);
  idbZamanlayici = setTimeout(() => idbKoy('ilerleme', 'ana', JSON.parse(JSON.stringify(ilerleme))), 300);
}
