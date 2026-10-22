// Koleksiyonum (K4): işaretlenen eserler.
// ilerleme.koleksiyon = [{ a: eserAnahtarı, s: sanatçıId, t: "YYYY-MM-DD" }], en yeni başta
export const KOLEKSIYON_SINIRI = 500;

export function koleksiyonDogrula(k) {
  if (!Array.isArray(k)) return [];
  const goruldu = new Set();
  const sonuc = [];
  for (const x of k) {
    if (!x || typeof x.a !== 'string' || typeof x.s !== 'string' || goruldu.has(x.a)) continue;
    goruldu.add(x.a);
    sonuc.push({ a: x.a, s: x.s, t: typeof x.t === 'string' ? x.t : '' });
  }
  return sonuc.slice(0, KOLEKSIYON_SINIRI);
}

export function koleksiyondaMi(ilerleme, eser) {
  return !!eser && (ilerleme.koleksiyon || []).some((x) => x.a === eser.anahtar);
}

// Eseri ekler ya da çıkarır; yeni durumu (koleksiyonda mı) döndürür. Sanatçısı bilinmeyen eser eklenmez
export function koleksiyonDegistir(ilerleme, eser, tarih) {
  if (!eser || !eser.sid) return false;
  const k = (ilerleme.koleksiyon ||= []);
  const i = k.findIndex((x) => x.a === eser.anahtar);
  if (i >= 0) {
    k.splice(i, 1);
    return false;
  }
  k.unshift({ a: eser.anahtar, s: eser.sid, t: tarih });
  if (k.length > KOLEKSIYON_SINIRI) k.length = KOLEKSIYON_SINIRI;
  return true;
}
