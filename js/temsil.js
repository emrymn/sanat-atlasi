// Temsil dışı eserler: bir akımı, dönemi, konuyu ya da sanatçıyı temsil eden yerlerde (çarkın kemeri, akım sayfası,
// Başyapıtlar, konu kapakları, günün resmi, haritadaki durak resmi) hiç kullanılmaz; sanatçının eser listesinde ve
// pekiştirmede kalır. Emre (1.77.1, Gotik çarkındaki Berlinghieri panosu için): "bu resmi kullanma hiçbir yerde".
export const TEMSIL_DISI = new Set([
  'Q3947103', // Bonaventura Berlinghieri, Aziz Francesco ve hayatından sahneler (Pescia, 1235)
]);

// e: eser ({ qid, anahtar: 'q:Q…' }) ya da başyapıt kaydı ({ anahtar: 'Q…' })
export function temsilOlabilir(e) {
  if (!e) return false;
  const a = String(e.anahtar || '').replace(/^q:/, '');
  return !TEMSIL_DISI.has(e.qid) && !TEMSIL_DISI.has(a);
}

// Akımın çarktaki kemer resmi elle seçildiyse (QID). Yoksa en eski açık sanatçıların en bilinen eseri.
// Emre (1.77.1): Gotik'te önce Berlinghieri'nin Aziz Francesco panosu, sonra diptiği geliyordu; "gotik resmi bi daha
// değiştir": Duccio'nun Rucellai Madonnası (Uffizi, 1285), dönemin en bilinen panosu, üçgen alınlığı kemere oturuyor.
export const AKIM_KAPAK = {
  Gotik: 'Q948745',
};
