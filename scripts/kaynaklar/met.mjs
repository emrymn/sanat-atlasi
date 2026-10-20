// The Metropolitan Museum of Art Collection API (anahtar gerekmez). Yalnızca kamu malı (isPublicDomain)
// ve sanatçının Wikidata QID'i ile doğrudan atfedilmiş eserler.
import { getir, onbellekli, bekle, dogrudanAtifMi, resimselTurMu } from './ortak.mjs';

const KOK = 'https://collectionapi.metmuseum.org/public/collection';
const EN_FAZLA_NESNE = 150;

export async function metEserleri(sanatci, qid) {
  if (!qid) return [];
  const ara = await onbellekli(`met-ara:${sanatci.ad_arama}`, () =>
    getir(`${KOK}/v1.1/search?q=${encodeURIComponent(sanatci.ad_arama)}&artistOrCulture=true&hasImages=true&limit=${EN_FAZLA_NESNE}`),
  );
  const ids = (ara.objectIDs || []).slice(0, EN_FAZLA_NESNE);
  const nesneler = new Array(ids.length);
  let sira = 0;
  const isci = async () => {
    while (sira < ids.length) {
      const j = sira++;
      try {
        nesneler[j] = await onbellekli(`met-nesne:${ids[j]}`, async () => {
          await bekle(30);
          return getir(`${KOK}/v1/objects/${ids[j]}`);
        });
      } catch {
        nesneler[j] = null;
      }
    }
  };
  await Promise.all(Array.from({ length: 8 }, isci));
  const sonuc = [];
  for (const n of nesneler) {
    if (!n || !n.isPublicDomain || !n.primaryImageSmall) continue;
    if (!String(n.artistWikidata_URL || '').endsWith('/' + qid)) continue;
    if (n.artistRole !== 'Artist' || n.artistPrefix || !dogrudanAtifMi(n.artistSuffix) || !dogrudanAtifMi(n.artistDisplayName)) continue;
    if (!resimselTurMu(n.classification)) continue;
    sonuc.push({
      kaynak: 'met',
      kimlik: String(n.objectID),
      baslik: n.title,
      yil: Number.isFinite(n.objectBeginDate) ? n.objectBeginDate : null,
      muze: 'The Metropolitan Museum of Art, New York',
      tur: n.classification,
      populer: (n.isHighlight ? 3 : 0) + (/paint/i.test(n.classification) ? 1 : 0),
      gorsel: { k: 'met', u: n.primaryImageSmall, l: 'CC0', s: n.objectURL || `https://www.metmuseum.org/art/collection/search/${n.objectID}` },
    });
  }
  return sonuc;
}
