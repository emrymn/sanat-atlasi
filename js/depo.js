// İlerleme nesnesi: localStorage'da tutulur, IndexedDB'ye yansıtılır (yedek).
import { idbAl, idbKoy } from './idb.js';
import { bugunStr } from './leitner.js';
import { karisanlarDogrula } from './ogrenme.js';
import { seviyelerDogrula } from './seviye.js';
import { gecmisDogrula } from './gecmis.js';
import { koleksiyonDogrula } from './koleksiyon.js';
import { gorulenDogrula } from './harita.js';
import { bildirimlerDogrula } from './bildirim.js';

export const ANAHTAR = 'sanat-atlasi:ilerleme';
// 2: "Gece galerisi" teması varsayılan oldu (eski varsayılan Sepya ve kaldırılan Koyu bir kez Gece'ye geçer)
export const SURUM = 2;
export const TEMALAR = ['gece', 'sepya', 'acik'];
export const VARSAYILAN_TEMA = 'gece';

export function varsayilanIlerleme(islenen = []) {
  return {
    surum: SURUM,
    islenen: islenen.slice(),
    ayarlar: { gunlukKart: 20, tema: VARSAYILAN_TEMA, tanisma: true, rozet: false },
    skorlar: {},
    gunluk: { tarih: bugunStr(), yeni: 0, kart: 0, yeniIdler: [] },
    sonEserler: {},
    kotuGorseller: {},
    ekSanatcilar: [],
    sonCalisilanlar: [],
    karisanlar: {},
    seviyeler: {},
    sonYedek: null, // son yedeğin günü "YYYY-MM-DD" (İ3)
    gecmis: {}, // günlük çalışma kaydı (İ1/İ4, js/gecmis.js)
    koleksiyon: [], // işaretlenen eserler (K4)
    haritaGorulen: [], // yolculuk haritasında görülmüş (açık) duraklar (İş 23)
    bildirimler: [], // "Bu görsel hatalı" bildirimleri (İ5)
    sonSurum: null, // Bugün'de "Yenilikler" notunun son gösterildiği sürüm (T4)
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
  // Sürüm 1'de varsayılan Sepya'ydı ve Koyu tema vardı: ikisi de bir kez Gece'ye geçer (Açık seçimi korunur)
  if (!(v.surum >= 2) && (ayarlar.tema === 'sepya' || ayarlar.tema === 'koyu')) ayarlar.tema = VARSAYILAN_TEMA;
  if (!TEMALAR.includes(ayarlar.tema)) ayarlar.tema = VARSAYILAN_TEMA;
  ayarlar.gunlukKart = Math.min(100, Math.max(5, parseInt(ayarlar.gunlukKart, 10) || 20));
  ayarlar.tanisma = ayarlar.tanisma !== false;
  ayarlar.rozet = ayarlar.rozet === true;
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
    kotuGorseller: kotuGorselleriDogrula(v.kotuGorseller),
    ekSanatcilar: Array.isArray(v.ekSanatcilar) ? [...new Set(v.ekSanatcilar.filter((x) => typeof x === 'string'))] : [],
    sonCalisilanlar: Array.isArray(v.sonCalisilanlar) ? [...new Set(v.sonCalisilanlar.filter((x) => typeof x === 'string'))].slice(0, SON_CALISILAN) : [],
    karisanlar: karisanlarDogrula(v.karisanlar),
    seviyeler: seviyelerDogrula(v.seviyeler),
    sonYedek: typeof v.sonYedek === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v.sonYedek) ? v.sonYedek : null,
    gecmis: gecmisDogrula(v.gecmis),
    koleksiyon: koleksiyonDogrula(v.koleksiyon),
    haritaGorulen: gorulenDogrula(v.haritaGorulen),
    bildirimler: bildirimlerDogrula(v.bildirimler),
    sonSurum: typeof v.sonSurum === 'string' && /^\d+\.\d+\.\d+$/.test(v.sonSurum) ? v.sonSurum : null,
    olusturma: v.olusturma || t.olusturma,
  };
}

// Ana sayfadaki "Son çalıştıkların" için en son pekiştirilen sanatçılar (en yeni başta)
export const SON_CALISILAN = 12;
export function sonCalisilanEkle(ilerleme, id) {
  ilerleme.sonCalisilanlar = [id, ...(ilerleme.sonCalisilanlar || []).filter((x) => x !== id)].slice(0, SON_CALISILAN);
}

// { eserAnahtarı: [görselAnahtarı, …] } — geçersiz kayıtlar atılır
function kotuGorselleriDogrula(k) {
  if (!k || typeof k !== 'object' || Array.isArray(k)) return {};
  const sonuc = {};
  for (const [a, liste] of Object.entries(k)) if (Array.isArray(liste)) sonuc[a] = liste.filter((x) => typeof x === 'string');
  return sonuc;
}

// yarimOturum: yarım kalan pekiştirme oturumu (js/devam.js), yoksa alan yazılmaz
export function yedekMetni(ilerleme, yarimOturum = null) {
  const y = { uygulama: 'sanat-atlasi', surum: SURUM, tarih: new Date().toISOString(), ilerleme };
  if (yarimOturum) y.yarimOturum = yarimOturum;
  return JSON.stringify(y, null, 1);
}

// Yedekteki yarım oturum (doğrulaması js/devam.js kayitGecerliMi ile yapılır)
export function yedekYarimOturum(metin) {
  try {
    const n = JSON.parse(String(metin || '').trim());
    return (n && n.yarimOturum) || null;
  } catch (e) {
    return null;
  }
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

// ---------- Yedek hatırlatması (İ3) ----------
export const YEDEK_ARALIGI = 14; // gün

function gunFarki(a, b) {
  const g = (x) => {
    const [y, m, d] = x.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((g(b) - g(a)) / 86400000);
}

// Bugün'ün altındaki satır: son yedekten (hiç yoksa ilk kullanımdan) 14 gün geçtiyse ve kaydedilecek ilerleme varsa
// { gun, metin }; değilse null.
export function yedekHatirlatmasi(ilerleme, bugun = bugunStr()) {
  if (!ilerleme || !Object.keys(ilerleme.skorlar || {}).length) return null;
  if (ilerleme.sonYedek) {
    const gun = gunFarki(ilerleme.sonYedek, bugun);
    return gun >= YEDEK_ARALIGI ? { gun, metin: `Son yedek ${gun} gün önce` } : null;
  }
  const ilk = String(ilerleme.olusturma || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ilk)) return null;
  const gun = gunFarki(ilk, bugun);
  return gun >= YEDEK_ARALIGI ? { gun, metin: 'Henüz yedek almadın' } : null;
}
