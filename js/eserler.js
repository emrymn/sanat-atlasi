// Bir sanatçının eserleri.
// 1) data/eserler_onbellek.json (surum 3): kurs eserleri + Wikidata + müzeler (Met, AIC, Cleveland, NGA) +
//    Commons, derleme zamanında birleştirilmiş ve sıralanmış hâli. Varsa esas budur.
// 2) Yoksa: kurs eserleri (yalnızca resim) + Wikidata (IndexedDB'de 30 gün saklanır, canlı yenilenir).
// Önbellek dosyası 30 günden eskiyse canlı Wikidata sonuçlarındaki yeni eserler listenin sonuna eklenir.
import { idbAl, idbKoy } from './idb.js';
import { qidCoz, eserleriGetir, jsonGetiriciYap, KULLANICI_AJANI } from './wikidata.js';
import { baslikNormal, dosyaNormal, yilYaz } from './yardimci.js';
import { kursResimleri } from './resim.js';
import { gorselAnahtari, pekistirmeyeUygunMu } from './gorsel.js';

export const TAZELIK_GUN = 30;
export const TEST_HAVUZU = 12; // pekiştirmede bir sanatçı için kullanılan en fazla eser

const GUN_MS = 24 * 60 * 60 * 1000;
// Önbellek dosyası biçimi: 3 = çok kaynaklı, görsel listeli. Daha eskisi kullanılmaz.
export const ONBELLEK_SURUMU = 3;
// IndexedDB'deki canlı Wikidata kayıtlarının biçimi (2 = yalnızca resimler)
export const IDB_SURUMU = 2;

let turler = null;
// data/eser_turleri.json — hangi kurs eserlerinin resim olduğu
export function eserTurleriniAyarla(t) {
  turler = t;
  bellek.clear();
}

function tarihYaz(yil) {
  return yil === null || yil === undefined ? '' : yilYaz(yil);
}

// Önbellek dosyasındaki bir kaydı uygulamanın eser nesnesine çevirir
export function onbellekEseri(e) {
  const ilk = e.gorseller[0];
  const anahtar = e.kurs ? gorselAnahtari(ilk) : e.qid ? 'q:' + e.qid : gorselAnahtari(ilk);
  return {
    anahtar,
    kaynak: e.kurs ? 'kurs' : e.kaynaklar[0],
    kaynaklar: e.kaynaklar,
    baslik: e.baslik,
    tarih: e.tarih || tarihYaz(e.yil),
    yil: e.yil ?? null,
    muze: e.muze || '',
    kursKonu: e.konu ?? null,
    qid: e.qid || null,
    gorseller: e.gorseller,
    pekistirme: e.pekistirme !== false,
    sl: e.sl || 0, // bilinirlik sıralaması (enBilinen, bilinirlikSirasi) bunu kullanır
  };
}

// Önbellek yokken: kurs eserleri + Wikidata eserleri → tek liste (kurs önce, yinelenenler atılır)
export function eserleriBirlestir(kursEserleri = [], wdEserleri = [], mevcut = []) {
  const sonuc = mevcut.slice();
  const dosyalar = new Set(mevcut.flatMap((e) => e.gorseller.filter((g) => g.k === 'commons').map((g) => dosyaNormal(g.d).toLowerCase())));
  const basliklar = new Set(mevcut.map((e) => baslikNormal(e.baslik)).filter(Boolean));
  const qidler = new Set(mevcut.map((e) => e.qid).filter(Boolean));
  const ekle = (e, dosya) => {
    const d = dosyaNormal(dosya).toLowerCase();
    const b = baslikNormal(e.baslik);
    if (!dosya || dosyalar.has(d) || (b && basliklar.has(b)) || (e.qid && qidler.has(e.qid))) return;
    dosyalar.add(d);
    if (b) basliklar.add(b);
    if (e.qid) qidler.add(e.qid);
    sonuc.push({ ...e, anahtar: e.kaynak === 'kurs' || !e.qid ? 'c:' + d : 'q:' + e.qid });
  };
  for (const e of kursEserleri) {
    const g = { k: 'commons', d: dosyaNormal(e.commons_dosya), l: e.lisans || '' };
    ekle(
      {
        kaynak: 'kurs',
        kaynaklar: ['kurs'],
        baslik: e.baslik,
        tarih: e.tarih || '',
        yil: null,
        muze: e.yer || '',
        kursKonu: e.konu ?? null,
        qid: null,
        gorseller: [g],
        pekistirme: true,
      },
      e.commons_dosya,
    );
  }
  for (const e of wdEserleri) {
    const g = { k: 'commons', d: dosyaNormal(e.dosya), l: '' };
    ekle(
      {
        kaynak: 'wikidata',
        kaynaklar: ['wikidata'],
        baslik: e.baslik,
        tarih: tarihYaz(e.yil),
        yil: e.yil ?? null,
        muze: '',
        kursKonu: null,
        qid: e.qid,
        gorseller: [g],
        pekistirme: true,
      },
      e.dosya,
    );
  }
  return sonuc;
}

export function tazeMi(zaman, simdi = Date.now()) {
  return typeof zaman === 'number' && simdi - zaman < TAZELIK_GUN * GUN_MS;
}

let onbellekDosyasi = null;
export function hazirOnbellek() {
  if (!onbellekDosyasi) {
    onbellekDosyasi = fetch('data/eserler_onbellek.json')
      .then((y) => (y.ok ? y.json() : null))
      .then((j) => (j && j.surum >= ONBELLEK_SURUMU ? j : null))
      .catch(() => null);
  }
  return onbellekDosyasi;
}

const getir = jsonGetiriciYap({ basliklar: { 'Api-User-Agent': KULLANICI_AJANI }, deneme: 2, zamanAsimi: 15000 });
const bellek = new Map();
const suren = new Map();

// Canlı Wikidata kaydı (IndexedDB). gerekli=false ise yalnızca taze kayıt ya da arka planda yenileme.
async function canliWikidata(sanatci, qid, { canli, bekle }) {
  const idb = await idbAl('eserler', sanatci.id);
  const kayit = idb && idb.surum === IDB_SURUMU ? idb : null;
  if (kayit && tazeMi(kayit.zaman)) return kayit;
  if (!canli || (typeof navigator !== 'undefined' && navigator.onLine === false)) return kayit;
  const yenile = async () => {
    try {
      const q = qid || (kayit && kayit.qid) || (await qidCoz(sanatci, getir));
      const eserler = q ? await eserleriGetir(q, getir) : [];
      const yeni = { qid: q, eserler, zaman: Date.now(), surum: IDB_SURUMU };
      await idbKoy('eserler', sanatci.id, yeni);
      bellek.delete(sanatci.id);
      return yeni;
    } catch (e) {
      return kayit;
    }
  };
  if (kayit || !bekle) {
    yenile();
    return kayit;
  }
  return yenile();
}

async function hesapla(sanatci, { canli }) {
  const hazir = await hazirOnbellek();
  const hk = hazir && hazir.sanatcilar && hazir.sanatcilar[sanatci.id];
  if (hk) {
    const liste = hk.eserler.map(onbellekEseri);
    if (tazeMi(Date.parse(hazir.olusturma))) return liste;
    // Dosya eski: canlı Wikidata'daki yeni eserleri sona ekle (arka planda yenilenir)
    const wd = await canliWikidata(sanatci, hk.qid, { canli, bekle: false });
    return eserleriBirlestir([], (wd && wd.eserler) || [], liste);
  }
  const wd = await canliWikidata(sanatci, null, { canli, bekle: true });
  return eserleriBirlestir(kursResimleri(sanatci, turler), (wd && wd.eserler) || []);
}

// Sanatçının birleşik eser listesi (en bilinenler önce; kurs eserleri en başta)
export function sanatciEserleri(sanatci, { canli = true } = {}) {
  if (bellek.has(sanatci.id)) return Promise.resolve(bellek.get(sanatci.id));
  if (suren.has(sanatci.id)) return suren.get(sanatci.id);
  const soz = hesapla(sanatci, { canli })
    .catch(() => eserleriBirlestir(kursResimleri(sanatci, turler), []))
    .then((eserler) => {
      for (const e of eserler) {
        e.sid = sanatci.id;
        const ad = eserAdiBul(sanatci.id, e);
        if (ad && ad !== e.baslik) e.ad = ad;
      }
      bellek.set(sanatci.id, eserler);
      suren.delete(sanatci.id);
      return eserler;
    });
  suren.set(sanatci.id, soz);
  return soz;
}

// Türkçe eser adları (data/eser_adlari_tr.json): anahtar eserin QID'i, yoksa "sanatçıId|başlık".
// Eser nesnesine `ad` alanı olarak eklenir; `baslik` (özgün ad) değişmez, notlar ve eşleştirme onu kullanır.
let eserAdlari = {};
export function eserAdlariniAyarla(adlar) {
  eserAdlari = adlar || {};
  for (const liste of bellek.values()) for (const e of liste) delete e.ad;
  bellek.clear();
}
export function eserAdiBul(sanatciId, e, adlar = eserAdlari) {
  return (e.qid && adlar[e.qid]) || adlar[`${sanatciId}|${e.baslik}`] || '';
}
// Ekranda gösterilecek ad: Türkçe ad varsa o, yoksa özgün başlık
export function eserBaslik(e) {
  return (e && (e.ad || e.baslik)) || '';
}
// Veri dosyasının "adlar" alanını güvenle okur (dosya yok / bozuk → {})
export function adlariAl(json) {
  const a = json && typeof json === 'object' ? json.adlar : null;
  if (!a || typeof a !== 'object' || Array.isArray(a)) return {};
  const sonuc = {};
  for (const [k, v] of Object.entries(a)) if (typeof v === 'string' && v.trim()) sonuc[k] = v.trim();
  return sonuc;
}

// Pekiştirme havuzu: görseli kullanılabilir ilk TEST_HAVUZU eser
export function pekistirmeHavuzu(eserler, kotuler = {}) {
  return eserler.filter((e) => pekistirmeyeUygunMu(e, kotuler)).slice(0, TEST_HAVUZU);
}

// Zorluk dilimi: kolaylık puanı olan adaylardan sanatçının seviyesine uyan kısım (bkz. KARARLAR İş 7).
// seviye: sanatçının sanatçı sorusundaki Leitner kutusu (yeni = 0). 0–1 → en kolay yarı, 4–5 → en zor yarı, 2–3 → hepsi.
// Puanı olmayan eserler yalnızca orta seviyede seçilir; puanlı aday 2'den azsa süzme yapılmaz.
export function zorlukDilimi(adaylar, kolaylik, seviye) {
  if (!kolaylik || seviye === null || seviye === undefined) return adaylar;
  const puanli = adaylar.map((e, i) => ({ e, i, p: kolaylik(e) })).filter((x) => typeof x.p === 'number');
  if (puanli.length < 2) return adaylar;
  if (seviye >= 2 && seviye <= 3) return adaylar;
  puanli.sort((a, b) => b.p - a.p || a.i - b.i);
  const yari = Math.ceil(puanli.length / 2);
  return (seviye <= 1 ? puanli.slice(0, yari) : puanli.slice(puanli.length - yari)).map((x) => x.e);
}

// Pekiştirmede gösterilecek eseri seç: son gösterilenlerden kaçın; puan varsa sanatçının seviyesine göre zorluk.
export function eserSec(eserler, sonGosterilenler = [], rng = Math.random, kotuler = {}, { kolaylik = null, seviye = null } = {}) {
  const havuz = pekistirmeHavuzu(eserler, kotuler);
  if (!havuz.length) return null;
  const kacinilacak = new Set(sonGosterilenler.slice(-Math.min(5, havuz.length - 1)));
  const adaylar = havuz.filter((e) => !kacinilacak.has(e.anahtar));
  const liste = zorlukDilimi(adaylar.length ? adaylar : havuz, kolaylik, seviye);
  return liste[Math.floor(rng() * liste.length)];
}

// Eser kolaylık puanları (data/eser_zorluk.json): anahtar QID ya da "sanatçıId|başlık", değer 2 (zor) … 10 (kolay)
export function kolaylikAl(json) {
  const k = json && typeof json === 'object' ? json.kolaylik : null;
  if (!k || typeof k !== 'object' || Array.isArray(k)) return {};
  const sonuc = {};
  for (const [a, v] of Object.entries(k)) if (Number.isFinite(v) && v >= 2 && v <= 10) sonuc[a] = v;
  return sonuc;
}
