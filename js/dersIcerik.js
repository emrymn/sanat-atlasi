// Çalış · Ders düzeni (1.79.0): adımların içerik seçimi. Saf mantık (birim testli; ekran yok): data/ders_kaynaklari.json
// (scripts/ders/kaynaklar.mjs) → ekranda gösterilecek plan. Ekranlar: js/ekranlar/ders.js; kayıt: js/ders.js.
//
// Doğruluk kuralları burada tek yerde uygulanır:
//  - Öğren'de kanıt olarak YALNIZ durum: 'dogrulandi' olan kanit_adaylari çıkar; 'yanlis', 'belirsiz' ve 'bakilmadi'
//    hiçbir plana girmez. genel_adaylar (yine yalnız doğrulanmışlar) kanıt değil, maddeyi açıklayan metindir.
//  - Doğrulanmış kanıtı olmayan madde eser göstermeden, yalnız metinle anlatılır (kanitlar boş döner).
//  - Gör verisi olmayan derste Gör adımı yoktur (ders üç adım); yürüyüş uydurulmaz.
import { DERS_ADIMLARI } from './ders.js';

export const GOR_ESER = 3; // Gör: derste yürünen en çok eser (kaynak listesi öncelik sırasında: önce kurs, sonra rehberli)
export const KANIT_ESER = 3; // Öğren: bir maddede gösterilen en çok eser
export const ACIKLAMA_SAYISI = 2; // Öğren: bir maddenin altındaki en çok açıklama cümlesi
export const DOGRULANDI = 'dogrulandi';

export function dersBul(kaynak, akim) {
  const l = kaynak && Array.isArray(kaynak.dersler) ? kaynak.dersler : [];
  return l.find((x) => x.akim === akim) || null;
}

// Gör: yürüyüşü yazılmış ilk GOR_ESER eser. yuruyus: data/yuruyus.json'un eserler alanı ({ sanatçı: kayıt }).
// Kayıt başka bir esere geçmişse (kaynak eskimiş) o eser atlanır. Dönen: { eserler: [{ sanatci, kayit }], toplam }
export function gorPlani(ders, yuruyus, adet = GOR_ESER) {
  const eserler = [];
  for (const g of (ders && ders.gor) || []) {
    const kayit = yuruyus && yuruyus[g.sanatci];
    if (!kayit || kayit.eser !== g.eser || !Array.isArray(kayit.noktalar) || !kayit.noktalar.length) continue;
    eserler.push({ sanatci: g.sanatci, kayit });
    if (eserler.length >= adet) break;
  }
  return { eserler, toplam: eserler.reduce((t, e) => t + e.kayit.noktalar.length, 0) };
}

// Dersin var olan adımları: Gör planı boşsa üç adım
export function dersAdimlari(ders, yuruyus) {
  return gorPlani(ders, yuruyus).eserler.length ? DERS_ADIMLARI : DERS_ADIMLARI.filter((a) => a !== 'gor');
}

// Bir kanıtın eseri (aynı eser iki kaynaktan iki cümleyle gelebilir; ekranda eser bir kez görünür)
const eserKimligi = (a) => `${a.sanatci}|${a.qid || a.anahtar || a.eser}`;

// Öğren: her madde için doğrulanmış kanıtlar (eser başına bir cümle, en çok KANIT_ESER eser) ve doğrulanmış açıklamalar.
// Dönen: [{ no, madde, kanitlar: [{ sanatci, eser, qid, anahtar, yer, cumle, id }], aciklamalar: [{ sanatci, yer, cumle, id }] }]
export function ogrenPlani(ders, { kanit = KANIT_ESER, aciklama = ACIKLAMA_SAYISI } = {}) {
  return ((ders && ders.ogren) || []).map((m) => {
    const gorulen = new Set();
    const kanitlar = [];
    for (const a of m.kanit_adaylari || []) {
      if (a.durum !== DOGRULANDI || !a.sanatci || !a.eser) continue;
      const k = eserKimligi(a);
      if (gorulen.has(k)) continue;
      gorulen.add(k);
      if (kanitlar.length < kanit) kanitlar.push({ sanatci: a.sanatci, eser: a.eser, qid: a.qid || null, anahtar: a.anahtar || null, yer: a.yer || '', cumle: a.cumle, id: a.id });
    }
    const aciklamalar = (m.genel_adaylar || [])
      .filter((a) => a.durum === DOGRULANDI)
      .slice(0, aciklama)
      .map((a) => ({ sanatci: a.sanatci || null, yer: a.yer || '', cumle: a.cumle, id: a.id }));
    return { no: m.no, madde: m.madde, kanitlar, aciklamalar };
  });
}

// Ayırt et: görünür komşularla ikililer; açık (konusu işlenmiş) komşular önce, kaynak sırası korunur.
// maddeler: (akım) => "Nasıl tanınır?" maddeleri. Dönen: [{ komsu, acik, cumleler, kendi, karsi, maddeler: { kendi, komsu } }]
export function ayirtPlani(ders, { gorunur = null, acik = null, maddeler = () => [] } = {}) {
  const l = ((ders && ders.ayirt) || [])
    .filter((c) => (!gorunur || gorunur.has(c.komsu)) && c.eserler && c.eserler.kendi && c.eserler.kendi.length && c.eserler.komsu && c.eserler.komsu.length)
    .map((c) => ({
      komsu: c.komsu,
      acik: !acik || acik.has(c.komsu),
      cumleler: (c.karsilastirma_cumleleri || []).map((x) => ({ kaynak: x.kaynak, cumle: x.cumle })),
      kendi: c.eserler.kendi,
      karsi: c.eserler.komsu,
      maddeler: { kendi: maddeler(ders.akim), komsu: maddeler(c.komsu) },
    }));
  return [...l.filter((x) => x.acik), ...l.filter((x) => !x.acik)];
}

// Eser listesinde bir kaynak kaydını bulur (QID, başyapıt anahtarı ya da başlık); görseli olmayan eser sayılmaz.
// ref: { qid?, anahtar?, baslik? | eser? }
export function eserEslestir(eserler, sid, ref) {
  const baslik = ref.baslik || ref.eser || '';
  const gorselli = (eserler || []).filter((e) => e.gorseller && e.gorseller.length);
  return (
    (ref.qid && gorselli.find((e) => e.qid === ref.qid)) ||
    (ref.anahtar && gorselli.find((e) => e.qid === ref.anahtar || `${sid}|${e.baslik}` === ref.anahtar)) ||
    (baslik && gorselli.find((e) => e.baslik === baslik || e.ad === baslik)) ||
    null
  );
}

// Sına: soru sayısı sanatçı sayısına göre (tek sanatçılı derste kısa; kalabalık derste herkes en az bir kez)
export function sinaSoruSayisi(n) {
  if (n <= 0) return 0;
  if (n === 1) return 4;
  return Math.max(6, Math.min(12, n));
}

// Adımın ilerlemesi: görülen / toplam (0–1)
export const adimOrani = (gorulen, toplam) => (toplam > 0 ? Math.min(1, Math.max(0, gorulen / toplam)) : 0);

// Yarım kalan adım kaldığı yerden açılır: kayıtlı oran → sıradaki öğenin sırası. Biten adım baştan (tekrar) açılır.
export function kalinanYer(i, toplam) {
  if (!(toplam > 0) || !(i > 0) || i >= 1 - 1e-9) return 0;
  return Math.min(toplam - 1, Math.round(i * toplam));
}

// Menüdeki kısa durum: 'bitti' | 'suruyor' | 'sirada'
export function dersHali(durum) {
  if (durum.bitti) return 'bitti';
  return durum.adimlar.some((x) => x.i > 0) ? 'suruyor' : 'sirada';
}
