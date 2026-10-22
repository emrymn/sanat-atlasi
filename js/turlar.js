// Özel turlar (rapor 5. paket). Saf fonksiyonlar (birim testli). Bkz. KARARLAR.md "İş 18".
// Ö6 konu turu: bir konu işlenince yalnız o konunun sanatçılarıyla kısa tur (günlük yeni sınırı yok).
// Ö5 hatalarım turu: son 7 günde yanlış yapılan sanatçılar ve karıştırılan ikililer; ikilinin iki sanatçısı
// ardışık kartlarda gelir ve birbirinin çeldiricisi olur.
import { gorulduMu, gunEkle } from './leitner.js';
import { karistir } from './yardimci.js';
import { tanismaGerekirMi } from './ogrenme.js';

export const KONU_TURU_EN_AZ = 6;
export const KONU_TURU_EN_FAZLA = 8;
export const HATA_GUNU = 7;
export const HATA_TURU_EN_FAZLA = 20;
export const HATA_IKILI_EN_FAZLA = 4;

// Konu turunun kart sırası: önce hiç görülmemişler (tanışılanlar), sonra diğerleri; en çok 8 kart.
// 6'dan az sanatçı varsa aynı sanatçılar ikinci kez gelir (başka eserle), ama aynı sanatçı arka arkaya gelmez.
export function konuTuru(adaylar, skorlar = {}, rng = Math.random) {
  if (!adaylar.length) return [];
  const yeni = karistir(
    adaylar.filter((s) => tanismaGerekirMi(skorlar[s.id])),
    rng,
  );
  const eski = karistir(
    adaylar.filter((s) => !tanismaGerekirMi(skorlar[s.id])),
    rng,
  );
  const ilk = [...yeni, ...eski].slice(0, KONU_TURU_EN_FAZLA).map((s) => s.id);
  const idler = ilk.slice();
  let tur = karistir(ilk, rng);
  while (idler.length < KONU_TURU_EN_AZ) {
    if (!tur.length) tur = karistir(ilk, rng);
    // arka arkaya aynı sanatçı gelmesin (tek sanatçılık konuda kaçınılmaz)
    let i = tur.findIndex((id) => id !== idler[idler.length - 1]);
    if (i < 0) i = 0;
    idler.push(tur.splice(i, 1)[0]);
  }
  return idler;
}

// Tanışma ekranları arka arkaya: konunun hiç sorulmamış sanatçıları, kurs sanatçıları önce
export function konuTanismalari(adaylar, skorlar = {}) {
  const l = adaylar.filter((s) => tanismaGerekirMi(skorlar[s.id]));
  return [...l.filter((s) => s.kaynak === 'kurs'), ...l.filter((s) => s.kaynak !== 'kurs')].map((s) => s.id);
}

// Son HATA_GUNU gün içinde mi? (tarih "YYYY-MM-DD")
function yakinMi(tarih, bugun) {
  return !!tarih && tarih <= bugun && tarih > gunEkle(bugun, -HATA_GUNU);
}

// Sanatçı sorusunda son cevabı yanlış olan (kutu 0) ve son 7 günde görülen sanatçılar
export function hataliMi(skor, bugun) {
  const s = skor && skor.sanatci;
  return gorulduMu(s) && s.kutu === 0 && s.yanlis > 0 && yakinMi(s.son, bugun);
}

/**
 * Hatalarım turu.
 * adaylar: açık (ve eseri olan) sanatçılar; karisanlar: ilerleme.karisanlar { "a|b": { n, son } }
 * Dönen: { idler: [...], esler: { id: eşinin id'si }, ikililer: [{ a, b, n }], hatalilar: [id] }
 * Sıra: son 7 günde karıştırılan ikililer (çok karıştırılan önce) yan yana, sonra kalan hatalı sanatçılar.
 */
export function hatalarTuru({ adaylar, skorlar = {}, karisanlar = {}, bugun, rng = Math.random, adet = HATA_TURU_EN_FAZLA }) {
  const acik = new Set(adaylar.map((s) => s.id));
  const ikililer = Object.entries(karisanlar || {})
    .map(([k, v]) => {
      const [a, b] = k.split('|');
      return { a, b, n: (v && v.n) || 0, son: (v && v.son) || '' };
    })
    .filter((x) => x.n > 0 && acik.has(x.a) && acik.has(x.b) && yakinMi(x.son, bugun))
    .sort((x, y) => y.n - x.n || y.son.localeCompare(x.son));
  const kullanilan = new Set();
  const secilenIkililer = [];
  for (const x of ikililer) {
    if (secilenIkililer.length >= HATA_IKILI_EN_FAZLA || kullanilan.size + 2 > adet) break;
    if (kullanilan.has(x.a) || kullanilan.has(x.b)) continue;
    kullanilan.add(x.a);
    kullanilan.add(x.b);
    secilenIkililer.push(x);
  }
  const esler = {};
  const idler = [];
  for (const x of secilenIkililer) {
    // ikilinin hangisi önce gelecek: rastgele
    const [p, q] = rng() < 0.5 ? [x.a, x.b] : [x.b, x.a];
    idler.push(p, q);
    esler[p] = q;
    esler[q] = p;
  }
  const hatalilar = adaylar.filter((s) => hataliMi(skorlar[s.id], bugun)).map((s) => s.id);
  for (const id of karistir(hatalilar, rng)) {
    if (idler.length >= adet) break;
    if (!kullanilan.has(id)) {
      kullanilan.add(id);
      idler.push(id);
    }
  }
  return { idler, esler, ikililer: secilenIkililer.map(({ a, b, n }) => ({ a, b, n })), hatalilar };
}

// Eşi seçeneklerde yoksa doğru olmayan bir seçeneğin yerine konur (seçenek sayısı ve sırası korunur)
export function esiEkle(secenekler, dogruId, esId, rng = Math.random) {
  if (!esId || esId === dogruId || secenekler.includes(esId)) return secenekler.slice();
  const yerler = secenekler.map((id, i) => (id === dogruId ? -1 : i)).filter((i) => i >= 0);
  if (!yerler.length) return secenekler.slice();
  const sonuc = secenekler.slice();
  sonuc[yerler[Math.floor(rng() * yerler.length)]] = esId;
  return sonuc;
}
