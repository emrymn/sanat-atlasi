// İlerleme nesnesi: localStorage'da tutulur, IndexedDB'ye yansıtılır (yedek).
import { idbAlKesin, idbKoy } from './idb.js';
import { hataEkle } from './hataGunlugu.js';
import { bugunStr } from './leitner.js';
import { karisanlarDogrula } from './ogrenme.js';
import { seviyelerDogrula } from './seviye.js';
import { gecmisDogrula } from './gecmis.js';
import { koleksiyonDogrula } from './koleksiyon.js';
import { gorulenDogrula } from './harita.js';
import { bolumlerDogrula } from './bolum.js';
import { bildirimlerDogrula } from './bildirim.js';

export const ANAHTAR = 'sanat-atlasi:ilerleme';
// 2: "Gece galerisi" teması varsayılan oldu (eski varsayılan Sepya ve kaldırılan Koyu bir kez Gece'ye geçer)
export const SURUM = 2;
// İş 140: Sepya ve Açık tek bir Gündüz temasında birleşti (v0'ın denemesinden; zemin sabit nötr kâğıt)
export const TEMALAR = ['gece', 'gunduz'];
export const VARSAYILAN_TEMA = 'gece';

export function varsayilanIlerleme(islenen = []) {
  return {
    surum: SURUM,
    islenen: islenen.slice(),
    ayarlar: { gunlukKart: 20, tema: VARSAYILAN_TEMA, tanisma: true, rozet: false, egim: true, titresim: true },
    skorlar: {},
    skorlarKonu: {}, // İş 105: konu turu skorları { konuId: Leitner skoru }
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
    haritaGorulen: [], // yolculuk haritasında görülmüş (açık) bölümler (İş 23/24)
    haritaYolcu: null, // İş 90: öğrencinin haritada en son durduğu bölüm (yeni bölüm açılınca oradan yürür)
    haritaYolcuOn: false, // İş 96: oraya önceki durağa dönerek geldi: yüzü ekrana dönük durur
    bolumler: {}, // İş 24: harita bölümlerinin en iyi oranları { 'sira-no': { kolay, orta, zor, tanitim } }
    bildirimler: [], // "Bu görsel hatalı" bildirimleri (İ5)
    sonSurum: null, // Bugün'de "Yenilikler" notunun son gösterildiği sürüm (T4)
    gelistirici: null, // İş 42: geliştirici modu açıkken { tarih, yedek: açılmadan önceki ilerleme, yarim }
    olusturma: new Date().toISOString(),
  };
}

function skorGecerli(s) {
  return (
    s === undefined ||
    (s && typeof s === 'object' && Number.isInteger(s.kutu) && s.kutu >= 0 && s.kutu <= 5 && Number.isFinite(s.dogru) && Number.isFinite(s.yanlis))
  );
}

// İş 135: geçerli skorun alanları düzeltilir (elle düzenlenmiş ya da bozuk yedek tekrar sırasını bozmasın): sayaçlar
// negatif olmayan tam sayı, tarihler "YYYY-MM-DD" ya da null. Bozuk tarihte kart vadesi gelmiş sayılır (bugün gelir).
const TARIH = /^\d{4}-\d{2}-\d{2}$/;
function skorTemizle(s) {
  const sayac = (x) => Math.max(0, Math.floor(x));
  const t = { ...s, dogru: sayac(s.dogru), yanlis: sayac(s.yanlis) };
  t.son = typeof s.son === 'string' && TARIH.test(s.son) ? s.son : s.son ? bugunStr() : null;
  t.sonraki = typeof s.sonraki === 'string' && TARIH.test(s.sonraki) ? s.sonraki : t.son ? bugunStr() : null;
  return t;
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
    if (s.sanatci) skorlar[id].sanatci = skorTemizle(s.sanatci);
    if (s.akim) skorlar[id].akim = skorTemizle(s.akim);
    if (s.bolumKart && skorGecerli(s.bolumKart)) skorlar[id].bolumKart = skorTemizle(s.bolumKart); // İş 105: bölüm turu
  }
  // İş 105: konu (ikonografi) turu, konu başına; bozuk kayıt sessizce atlanır
  const skorlarKonu = {};
  if (v.skorlarKonu && typeof v.skorlarKonu === 'object' && !Array.isArray(v.skorlarKonu))
    for (const [id, s] of Object.entries(v.skorlarKonu)) if (s && skorGecerli(s) && id.length < 120) skorlarKonu[id] = skorTemizle(s);
  const t = varsayilanIlerleme();
  const ayarlar = { ...t.ayarlar, ...(v.ayarlar || {}) };
  // Sürüm 1'de varsayılan Sepya'ydı ve Koyu tema vardı: ikisi de bir kez Gece'ye geçer (Açık seçimi korunur)
  if (!(v.surum >= 2) && (ayarlar.tema === 'sepya' || ayarlar.tema === 'koyu')) ayarlar.tema = VARSAYILAN_TEMA;
  // İş 140: kaldırılan Sepya ve Açık Gündüz'e geçer (açık tema seçen açık temada kalır)
  if (ayarlar.tema === 'sepya' || ayarlar.tema === 'acik') ayarlar.tema = 'gunduz';
  if (!TEMALAR.includes(ayarlar.tema)) ayarlar.tema = VARSAYILAN_TEMA;
  ayarlar.gunlukKart = Math.min(100, Math.max(5, parseInt(ayarlar.gunlukKart, 10) || 20));
  ayarlar.tanisma = ayarlar.tanisma !== false;
  ayarlar.rozet = ayarlar.rozet === true;
  ayarlar.egim = ayarlar.egim !== false;
  ayarlar.titresim = ayarlar.titresim !== false; // İş 106
  return {
    ...t,
    islenen: [...new Set(v.islenen)].sort((a, b) => a - b),
    ayarlar,
    skorlar,
    skorlarKonu,
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
    haritaYolcu: typeof v.haritaYolcu === 'string' && v.haritaYolcu.length < 40 ? v.haritaYolcu : null,
    haritaYolcuOn: v.haritaYolcuOn === true,
    bolumler: bolumlerDogrula(v.bolumler),
    bildirimler: bildirimlerDogrula(v.bildirimler),
    sonSurum: typeof v.sonSurum === 'string' && /^\d+\.\d+\.\d+$/.test(v.sonSurum) ? v.sonSurum : null,
    gelistirici: gelistiriciDogrula(v.gelistirici),
    // ana sayfadaki "başka sanatçı": o gün için seçilen günün sanatçısı
    gununDegisim:
      v.gununDegisim && typeof v.gununDegisim.id === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v.gununDegisim.tarih || '')
        ? { tarih: v.gununDegisim.tarih, id: v.gununDegisim.id }
        : null,
    olusturma: v.olusturma || t.olusturma,
  };
}

// ---------- Geliştirici modu (İş 42) ----------
// Açılınca o anki ilerleme (ve yarım oturum) ilerlemenin içine yedeklenir, bütün konular işlenmiş ve bütün harita
// bölümlerinin Kolay'ı ile Orta'sı geçilmiş sayılır (Zor da açılır). Kapanınca yedek olduğu gibi geri gelir; mod açıkken
// yapılan her şey (skorlar, bölüm sonuçları) atılır, yalnız ayarlar (tema vb.) korunur. Yedek ilerlemenin içinde
// durduğu için uygulama kapanıp açılsa da, "Yedekle" ile alınıp geri yüklense de kaybolmaz.
function gelistiriciDogrula(g) {
  if (!g || typeof g !== 'object' || !g.yedek) return null;
  try {
    const yedek = ilerlemeDogrula({ ...g.yedek, gelistirici: null });
    return { tarih: typeof g.tarih === 'string' ? g.tarih : null, yedek, yarim: g.yarim && typeof g.yarim === 'object' ? g.yarim : null };
  } catch (e) {
    return null;
  }
}

// konular: bütün konu numaraları; bolumIdleri: bütün harita bölümlerinin id'leri ('sira-no')
export function gelistiriciAc(ilerleme, konular, bolumIdleri, yarim = null) {
  if (ilerleme.gelistirici) return ilerleme;
  const yedek = JSON.parse(JSON.stringify({ ...ilerleme, gelistirici: null }));
  const bolumler = { ...(ilerleme.bolumler || {}) };
  for (const id of bolumIdleri) bolumler[id] = { ...bolumler[id], kolay: 1, orta: 1 };
  return {
    ...ilerleme,
    islenen: [...new Set([...(ilerleme.islenen || []), ...konular])].sort((a, b) => a - b),
    bolumler,
    gelistirici: { tarih: new Date().toISOString(), yedek, yarim: yarim ? JSON.parse(JSON.stringify(yarim)) : null },
  };
}

// Dönen: { ilerleme: geri gelen ilerleme (güncel ayarlarla), yarim: mod açılırken yarım kalan oturum ya da null }
export function gelistiriciKapat(ilerleme) {
  const g = ilerleme.gelistirici;
  if (!g) return { ilerleme, yarim: null };
  const geri = ilerlemeDogrula({ ...g.yedek, ayarlar: ilerleme.ayarlar, gelistirici: null });
  return { ilerleme: geri, yarim: g.yarim || null };
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

// İlerleme okunamadığında (kayıt var olabilir ama depo hata verdi) bu açılışta kayıt kilitlenir: yerine konan boş
// (başlangıç) ilerleme gerçek kaydın üzerine yazılmasın. Kilit yedek geri yüklenince açılır; uygulama yeniden açılınca
// yeniden okunur. Bozuk (ayrıştırılamayan, doğrulanamayan) kayıt ise IndexedDB'de "bozuk" anahtarıyla saklanır.
let kayitKilidi = false;
export const kayitKilitliMi = () => kayitKilidi;
export function kayitKilidiniAc() {
  kayitKilidi = false;
}
// ekranlar/ortak.js dinler ve kullanıcıya bir kez söyler: 'kilitli' | 'yazilamadi'
function kayitSorunu(tur) {
  try {
    globalThis.dispatchEvent(new CustomEvent('atlas-kayit-sorunu', { detail: tur }));
  } catch {
    /* olay yok (test ortamı) */
  }
}
function bozukSakla(ham) {
  idbKoy('ilerleme', 'bozuk', { zaman: new Date().toISOString(), ham });
}
const mesajOf = (e) => (e && (e.name && e.name !== 'Error' ? `${e.name}: ${e.message}` : e.message)) || String(e);

export async function ilerlemeYukle(baslangicGetir) {
  let okunamadi = null;
  let ham = null;
  try {
    ham = localStorage.getItem(ANAHTAR);
  } catch (e) {
    okunamadi = `localStorage: ${mesajOf(e)}`;
  }
  if (ham) {
    try {
      return ilerlemeDogrula(JSON.parse(ham));
    } catch (e) {
      bozukSakla(ham); // bozuk: IndexedDB yedeğine bakılır
      hataEkle({ m: `Kayıtlı ilerleme bozuk (${mesajOf(e)}); IndexedDB yedeğine bakıldı, bozuk kayıt saklandı`, k: 'depo' });
    }
  }
  try {
    const idb = await idbAlKesin('ilerleme', 'ana');
    if (idb) {
      try {
        return ilerlemeDogrula(idb);
      } catch (e) {
        bozukSakla(idb);
        hataEkle({ m: `IndexedDB'deki ilerleme bozuk (${mesajOf(e)}); bozuk kayıt saklandı`, k: 'depo' });
      }
    }
  } catch (e) {
    if (typeof indexedDB !== 'undefined') okunamadi = `${okunamadi ? okunamadi + ' · ' : ''}IndexedDB: ${mesajOf(e)}`;
  }
  if (okunamadi) {
    kayitKilidi = true;
    hataEkle({ m: `İlerleme okunamadı (${okunamadi}); bu açılışta kaydetme durduruldu`, k: 'depo' });
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
let lsUyarildi = false;
export function ilerlemeKaydet(ilerleme) {
  if (kayitKilidi) return kayitSorunu('kilitli');
  let lsTamam = true;
  try {
    localStorage.setItem(ANAHTAR, JSON.stringify(ilerleme));
  } catch (e) {
    // kota/özel mod: IndexedDB yine denenir. Eski kopya silinir: kalırsa bir sonraki açılışta IndexedDB'deki yeni
    // kayıt yerine o (bayat) okunurdu
    lsTamam = false;
    try {
      localStorage.removeItem(ANAHTAR);
    } catch {
      /* depo kapalı */
    }
    if (!lsUyarildi) (lsUyarildi = true), hataEkle({ m: `İlerleme localStorage'a yazılamadı: ${mesajOf(e)}`, k: 'depo' });
  }
  clearTimeout(idbZamanlayici);
  idbZamanlayici = setTimeout(async () => {
    const tamam = await idbKoy('ilerleme', 'ana', JSON.parse(JSON.stringify(ilerleme)));
    if (!tamam && !lsTamam) kayitSorunu('yazilamadi');
  }, 300);
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
