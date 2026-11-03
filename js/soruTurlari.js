// İş 105: iki yeni soru turu (Emre'nin fikirleri): saf mantık (ekranı js/ekranlar/soruTurlari.js çizer).
//  · Bölüm turu (#/pekistir/bolum): "Bu eser hangi bölümde?" — sanatçı → kurs konusu → kurs bölümü. Şıklar komşu
//    bölümler (en yakınlar önce). Skor sanatçı başına skorlar[id].bolumKart (haritanın bölüm kayıtlarıyla çakışmaz).
//  · Konu turu (#/pekistir/ikonografi): "Bu eserin konusu ne?" — data/ikonografi.json'daki eser → konu bağlantıları.
//    Şıklar aynı türden (Eski Ahit, Mitoloji…) konular. Skor konu başına skorlarKonu[konuId].
import { gorulduMu, vadesiGeldiMi, zayifMi } from './leitner.js';
import { karistir } from './yardimci.js';

// Kurs bölümleri sırasıyla: [{ id: 'Bölüm 5', no: 5, ad: '16. yüzyıl sanatı', konular: [16, …] }]
export function kursBolumleri(konular, konularTr = null) {
  const l = [];
  for (const k of konular || []) {
    let b = l.find((x) => x.id === k.bolum);
    if (!b) {
      const no = Number(String(k.bolum).replace(/\D+/g, '')) || l.length + 1;
      b = { id: k.bolum, no, ad: (konularTr && konularTr.bolumler && konularTr.bolumler[k.bolum]) || k.bolum_ad || k.bolum, konular: [] };
      l.push(b);
    }
    b.konular.push(k.no);
  }
  return l.sort((a, b) => a.no - b.no);
}

// Şıkta sığsın diye kısa ad (cevap yaprağında tam ad): ilk üç bölümün kurs adları uzun, yüzyıl bölümlerinde "sanatı" düşer
const KISA = { 1: 'Floransa’da Rönesans', 2: 'Antik klasikler', 3: 'Gotik, erken Rönesans' };
export function bolumKisaAdi(b) {
  return KISA[b.no] || String(b.ad).replace(/\s+sanatı$/, '');
}

export function sanatciBolumu(s, bolumler) {
  return (s && bolumler.find((b) => b.konular.includes(s.konu))) || null;
}

// Doğru bölüm + en yakın komşular (uzaklık 1, sonra 2…; aynı uzaklıkta rastgele), sonra karıştırılır
export function bolumSecenekleri(dogruId, bolumler, rng = Math.random, n = 4) {
  const i = bolumler.findIndex((b) => b.id === dogruId);
  if (i < 0) return [];
  const digerleri = bolumler
    .map((b, j) => ({ id: b.id, u: Math.abs(j - i), r: rng() }))
    .filter((x) => x.id !== dogruId)
    .sort((a, b) => a.u - b.u || a.r - b.r)
    .slice(0, n - 1)
    .map((x) => x.id);
  return karistir([dogruId, ...digerleri], rng);
}

// "13.–14. yüzyıl" · "MÖ 5. yüzyıl – 2. yüzyıl": bölümdeki sanatçıların etkin yıllarının (doğum + 30, yoksa ölüm − 10)
// yüzyılları, en eskiden en yeniye (uçlar kırpılarak)
const yuzyil = (y) => (y > 0 ? Math.floor((y - 1) / 100) + 1 : -(Math.floor(-y / 100) + 1));
const yuzyilYaz = (c) => (c > 0 ? `${c}.` : `MÖ ${-c}.`);
export function yuzyilAraligi(bolum, sanatcilar) {
  const yillar = (sanatcilar || [])
    .filter((s) => bolum && bolum.konular.includes(s.konu))
    .map((s) => (s.dogum != null ? s.dogum + 30 : s.olum != null ? s.olum - 10 : null))
    .filter((y) => y != null);
  if (!yillar.length) return '';
  // uçtaki birkaç sanatçı aralığı genişletmesin (Bölüm 4 "15. yüzyıl" 14.–16. çıkıyordu): 5+ sanatçıda %10–%90 arası
  yillar.sort((x, y) => x - y);
  const kes = yillar.length >= 5 ? Math.floor(yillar.length * 0.1) : 0;
  const a = yuzyil(yillar[kes]);
  const b = yuzyil(yillar[yillar.length - 1 - kes]);
  if (a === b) return `${yuzyilYaz(a)} yüzyıl`;
  return a > 0 || b < 0 ? `${yuzyilYaz(a)}–${yuzyilYaz(b)} yüzyıl` : `${yuzyilYaz(a)} yüzyıl – ${yuzyilYaz(b)} yüzyıl`;
}

// Doğru konu + aynı türden konular (yetmezse diğer türlerden), karıştırılır
export function konuSecenekleri(dogru, konular, rng = Math.random, n = 4) {
  if (!dogru) return [];
  const ayni = karistir(
    konular.filter((k) => k.id !== dogru.id && k.tur === dogru.tur),
    rng,
  );
  const diger = karistir(
    konular.filter((k) => k.id !== dogru.id && k.tur !== dogru.tur),
    rng,
  );
  return karistir([dogru.id, ...[...ayni, ...diger].slice(0, n - 1).map((k) => k.id)], rng);
}

// Kart kategorisi: 0 vadesi gelmiş, 1 zayıf, 2 yeni, 3 diğer
export function skorKategorisi(s, bugun) {
  if (!gorulduMu(s)) return 2;
  if (vadesiGeldiMi(s, bugun)) return 0;
  if (zayifMi(s)) return 1;
  return 3;
}

// Turun kartları: vadesi gelenler ve zayıflar önce (kutusu küçük olan önce), sonra yeniler, sonra diğerleri
// (en uzun süredir görülmeyen önce). skorAl(anahtar) → Leitner skoru ya da undefined.
export function turSirasi(anahtarlar, skorAl, { bugun, adet = 20, rng = Math.random } = {}) {
  const l = karistir(
    anahtarlar.map((a) => ({ a, s: skorAl(a), r: rng() })),
    rng,
  ).map((x) => ({ ...x, k: skorKategorisi(x.s, bugun) }));
  l.sort((x, y) => {
    if (x.k !== y.k) return x.k - y.k;
    if (x.k === 0 || x.k === 1) return (x.s.kutu ?? 0) - (y.s.kutu ?? 0);
    if (x.k === 3) return String(x.s.son).localeCompare(String(y.s.son));
    return 0;
  });
  return l.slice(0, adet).map((x) => x.a);
}

// İkonografi: konunun açık sanatçılara ait eserleri ([anahtar, sanatçıId] çiftleri)
export function konuEserleri(konu, acikIdler) {
  return (konu && konu.eserler ? konu.eserler : []).filter(([, sid]) => acikIdler.has(sid));
}

// Eser listesinde ikonografi anahtarına karşılık gelen eser (QID ya da "sanatçı|başlık")
export function anahtarlaEser(eserler, anahtar, sid) {
  return (eserler || []).find((e) => (e.qid && e.qid === anahtar) || `${sid}|${e.baslik}` === anahtar) || null;
}
