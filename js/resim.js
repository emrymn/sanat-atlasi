// Yalnızca iki boyutlu resimsel eserler: kurs eserlerinin türü ve gösterilecek sanatçılar.
// Veri: data/eser_turleri.json (kurs eseri kararları, ana uğraşı resim olmayan sanatçılar).
import { dosyaNormal } from './yardimci.js';

// Tabloda olmayan (yeni eklenmiş) bir kurs eseri gösterilir; kararı yalnızca tablo verir.
export function kursEseriResimMi(eser, turler) {
  const k = turler && turler.kurs && turler.kurs[dosyaNormal(eser.commons_dosya).toLowerCase()];
  return !k || k.karar === 'resim';
}

export function kursResimleri(sanatci, turler) {
  return (sanatci.kurs_eserleri || []).filter((e) => kursEseriResimMi(e, turler));
}

// onbellek: data/eserler_onbellek.json (surum ≥ 2, yalnızca resimler) ya da null
export function resimSanatcisiMi(sanatci, turler, onbellek) {
  if (turler && turler.ana_ugras_disi && turler.ana_ugras_disi[sanatci.id]) return false;
  if (kursResimleri(sanatci, turler).length) return true;
  if (!onbellek) return !(sanatci.kurs_eserleri || []).length; // bilinmiyor: kurs eseri yoksa göster
  const k = onbellek.sanatcilar && onbellek.sanatcilar[sanatci.id];
  // Önbellekte hiç kaydı yoksa (önbellekten sonra eklenmiş sanatçı) bilinmiyor sayılır: eserleri canlı Wikidata'dan gelir
  if (!k) return !(sanatci.kurs_eserleri || []).length;
  return !!(k.eserler && k.eserler.length);
}

export function gorunurSanatcilar(sanatcilar, turler, onbellek) {
  return sanatcilar.filter((s) => resimSanatcisiMi(s, turler, onbellek));
}

// En az bir görünür sanatçısı olan akımlar (sıra korunur)
export function gorunurAkimlar(akimlar, sanatcilar) {
  const adlar = new Set(sanatcilar.map((s) => s.akim));
  return akimlar.filter((a) => adlar.has(a.ad));
}
