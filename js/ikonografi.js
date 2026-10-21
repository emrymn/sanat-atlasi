// Resimlerdeki konular ve hikâyeleri (data/ikonografi.json). Bkz. KARARLAR.md "İş 9".
// Konu: { id, ad, ozgun, tur, ozet, kaynak, hikaye: [paragraf], tanima: [işaret], eserler: [[anahtar, sanatçıId], …] }

export const TUR_AD = {
  eski_ahit: 'Eski Ahit',
  yeni_ahit: 'Yeni Ahit',
  aziz: 'Azizler',
  mitoloji: 'Mitoloji',
  tarih_edebiyat: 'Tarih ve edebiyat',
  diger: 'Diğer',
};
export const TUR_SIRA = Object.keys(TUR_AD);

const yazi = (x) => typeof x === 'string' && x.trim().length > 0;

export function konulariAl(json, varMi = () => true) {
  const l = json && Array.isArray(json.konular) ? json.konular : [];
  return l
    .filter((k) => k && yazi(k.id) && yazi(k.ad) && Array.isArray(k.hikaye) && k.hikaye.some(yazi))
    .map((k) => ({
      ...k,
      tur: TUR_AD[k.tur] ? k.tur : 'diger',
      ozet: yazi(k.ozet) ? k.ozet : '',
      kaynak: yazi(k.kaynak) ? k.kaynak : '',
      hikaye: k.hikaye.filter(yazi),
      tanima: Array.isArray(k.tanima) ? k.tanima.filter(yazi) : [],
      eserler: (Array.isArray(k.eserler) ? k.eserler : []).filter((x) => Array.isArray(x) && yazi(x[0]) && yazi(x[1]) && varMi(x[1])),
    }))
    .filter((k) => k.eserler.length > 0);
}

export function konuBul(liste, id) {
  return liste.find((k) => k.id === id) || null;
}

// Eser → konu haritası (görüntüleyicideki "Konu:" bağlantısı için)
let harita = new Map();
export function konuHaritasiniAyarla(liste) {
  harita = new Map();
  for (const k of liste) for (const [a] of k.eserler) if (!harita.has(a)) harita.set(a, { id: k.id, ad: k.ad });
}
// e.sid: sanatciEserleri her esere sanatçı kimliğini ekler
export function eserKonusu(e, h = harita) {
  if (!e) return null;
  return (e.qid && h.get(e.qid)) || (e.sid && h.get(`${e.sid}|${e.baslik}`)) || null;
}
