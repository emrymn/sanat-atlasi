// Öğrenme yardımcıları: yeni sanatçıyla tanışma ve sık karıştırılan ikililer.
// Bkz. KARARLAR.md "İş 5".
import { gorulduMu } from './leitner.js';

// ---------- tanışma ----------
// Sanatçı hiç sorulmadıysa (ne sanatçı ne akım sorusu) ilk kartından önce kısa bir tanışma gösterilir.
export function tanismaGerekirMi(skor) {
  const s = skor || {};
  return !gorulduMu(s.sanatci) && !gorulduMu(s.akim);
}

// Tanışmada gösterilecek eserler: uygun olanlar arasından en bilinenler, sorulacak eser hariç
// (soru tanışmada görülmeyen bir eserle gelsin).
export function tanismaEserleri(havuz, haricAnahtar, adet = 3) {
  return havuz
    .filter((e) => e.anahtar !== haricAnahtar)
    .map((e, i) => ({ e, i }))
    .sort((a, b) => (b.e.sl || 0) - (a.e.sl || 0) || a.i - b.i)
    .slice(0, adet)
    .map((x) => x.e);
}

// ---------- karıştırılan ikililer ----------
// { "a|b": { n, son } } — anahtar alfabetik sıralı iki sanatçı kimliği
export const KARISAN_ESIGI = 2; // bu kadar karıştırınca cevap yaprağında yan yana gösterilir

export function karisanAnahtari(a, b) {
  return [a, b].sort().join('|');
}

// Yanlış cevapta çağrılır; ikilinin yeni sayısını döndürür
export function karisanEkle(ilerleme, dogruId, secilenId, tarih) {
  if (!dogruId || !secilenId || dogruId === secilenId) return 0;
  const k = karisanAnahtari(dogruId, secilenId);
  ilerleme.karisanlar = ilerleme.karisanlar || {};
  const eski = ilerleme.karisanlar[k] || { n: 0 };
  ilerleme.karisanlar[k] = { n: eski.n + 1, son: tarih };
  return ilerleme.karisanlar[k].n;
}

// En sık karıştırılan ikililer: [{ a, b, n, son }] (n ≥ esik, çok olan önce, eşitse yakın tarihli önce)
export function enCokKarisanlar(karisanlar, { adet = 5, esik = KARISAN_ESIGI, varMi = () => true } = {}) {
  return Object.entries(karisanlar || {})
    .map(([k, v]) => {
      const [a, b] = k.split('|');
      return { a, b, n: v.n, son: v.son || '' };
    })
    .filter((x) => x.n >= esik && varMi(x.a) && varMi(x.b))
    .sort((x, y) => y.n - x.n || y.son.localeCompare(x.son))
    .slice(0, adet);
}

// Yedekten / depodan gelen kaydı doğrular; geçersiz girdiler atılır
export function karisanlarDogrula(k) {
  if (!k || typeof k !== 'object' || Array.isArray(k)) return {};
  const sonuc = {};
  for (const [anahtar, v] of Object.entries(k)) {
    const parca = anahtar.split('|');
    if (parca.length !== 2 || !parca[0] || !parca[1] || parca[0] === parca[1]) continue;
    if (!v || !Number.isInteger(v.n) || v.n < 1) continue;
    sonuc[karisanAnahtari(parca[0], parca[1])] = { n: v.n, son: typeof v.son === 'string' ? v.son : '' };
  }
  return sonuc;
}
