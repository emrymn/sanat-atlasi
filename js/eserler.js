// Bir sanatçının eserleri: önce kurs eserleri (doğrulanmış), sonra Wikidata.
// Wikidata sonuçları IndexedDB'de 30 gün saklanır; data/eserler_onbellek.json varsa ilk açılışta ondan gelir.
import { idbAl, idbKoy } from './idb.js';
import { qidCoz, eserleriGetir, jsonGetiriciYap, KULLANICI_AJANI } from './wikidata.js';
import { baslikNormal, dosyaNormal } from './yardimci.js';
import { kursResimleri } from './resim.js';

export const TAZELIK_GUN = 30;
export const TEST_HAVUZU = 12; // pekiştirmede bir sanatçı için kullanılan en fazla eser

const GUN_MS = 24 * 60 * 60 * 1000;
// 2: yalnızca resimsel eserler. Daha eski kayıtlar (heykel/mimari içerebilir) kullanılmaz.
export const ONBELLEK_SURUMU = 2;

let turler = null;
// data/eser_turleri.json — hangi kurs eserlerinin resim olduğu
export function eserTurleriniAyarla(t) {
  turler = t;
  bellek.clear();
}

// Kurs eserleri + Wikidata eserleri → tek liste (kurs önce, yinelenenler atılır)
export function eserleriBirlestir(kursEserleri = [], wdEserleri = []) {
  const sonuc = [];
  const dosyalar = new Set();
  const basliklar = new Set();
  const ekle = (e) => {
    const d = dosyaNormal(e.dosya).toLowerCase();
    const b = baslikNormal(e.baslik);
    if (!e.dosya || dosyalar.has(d) || (b && basliklar.has(b))) return;
    dosyalar.add(d);
    if (b) basliklar.add(b);
    sonuc.push({ ...e, anahtar: d });
  };
  for (const e of kursEserleri) {
    ekle({
      kaynak: 'kurs',
      baslik: e.baslik,
      tarih: e.tarih || '',
      yer: e.yer || '',
      dosya: e.commons_dosya,
      lisans: e.lisans || '',
      kursKonu: e.konu ?? null,
    });
  }
  for (const e of wdEserleri) {
    ekle({
      kaynak: 'wikidata',
      baslik: e.baslik,
      tarih: e.yil === null || e.yil === undefined ? '' : e.yil < 0 ? `MÖ ${-e.yil}` : String(e.yil),
      dosya: e.dosya,
      qid: e.qid,
    });
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

async function wikidataKaydi(sanatci, { canli }) {
  const idb = await idbAl('eserler', sanatci.id);
  const kayit = idb && idb.surum === ONBELLEK_SURUMU ? idb : null;
  if (kayit && tazeMi(kayit.zaman)) return kayit;
  const hazir = await hazirOnbellek();
  const hk = hazir && hazir.sanatcilar && hazir.sanatcilar[sanatci.id];
  const hazirZaman = hazir && Date.parse(hazir.olusturma);
  if (hk && tazeMi(hazirZaman)) return { qid: hk.qid, eserler: hk.eserler, zaman: hazirZaman };
  const eski = kayit || (hk ? { qid: hk.qid, eserler: hk.eserler, zaman: hazirZaman || 0 } : null);
  if (!canli || (typeof navigator !== 'undefined' && navigator.onLine === false)) return eski;
  const yenile = async () => {
    try {
      const qid = eski && eski.qid ? eski.qid : await qidCoz(sanatci, getir);
      const eserler = qid ? await eserleriGetir(qid, getir) : [];
      const yeni = { qid, eserler, zaman: Date.now(), surum: ONBELLEK_SURUMU };
      await idbKoy('eserler', sanatci.id, yeni);
      bellek.delete(sanatci.id);
      return yeni;
    } catch (e) {
      return eski;
    }
  };
  // Eski veri varsa hemen onu kullan, arka planda yenile.
  if (eski) {
    yenile();
    return eski;
  }
  return yenile();
}

// Sanatçının birleşik eser listesi
export function sanatciEserleri(sanatci, { canli = true } = {}) {
  if (bellek.has(sanatci.id)) return Promise.resolve(bellek.get(sanatci.id));
  if (suren.has(sanatci.id)) return suren.get(sanatci.id);
  const soz = wikidataKaydi(sanatci, { canli })
    .catch(() => null)
    .then((wd) => {
      const eserler = eserleriBirlestir(kursResimleri(sanatci, turler), (wd && wd.eserler) || []);
      bellek.set(sanatci.id, eserler);
      suren.delete(sanatci.id);
      return eserler;
    });
  suren.set(sanatci.id, soz);
  return soz;
}

// Pekiştirmede gösterilecek eseri seç: son gösterilenlerden kaçın.
export function eserSec(eserler, sonGosterilenler = [], rng = Math.random) {
  const havuz = eserler.slice(0, TEST_HAVUZU);
  if (!havuz.length) return null;
  const kacinilacak = new Set(sonGosterilenler.slice(-Math.min(5, havuz.length - 1)));
  const adaylar = havuz.filter((e) => !kacinilacak.has(e.anahtar));
  const liste = adaylar.length ? adaylar : havuz;
  return liste[Math.floor(rng() * liste.length)];
}
