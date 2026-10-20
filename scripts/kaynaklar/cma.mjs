// Cleveland Museum of Art Open Access API (CC0, anahtar gerekmez). Sanatçı ad + doğum yılıyla eşlenir;
// nitelendirmeli ("workshop of", "attributed to"…) yaratıcılar alınmaz.
import { getir, onbellekli, dogrudanAtifMi, resimselTurMu, sanatciEslesirMi, tanimCoz } from './ortak.mjs';

const KOK = 'https://openaccess-api.clevelandart.org/api/artworks/';
const TURLER = ['Painting', 'Drawing', 'Print', 'Miniature'];

export async function cmaEserleri(sanatci, ekAdlar = []) {
  const sonuc = [];
  for (const tur of TURLER) {
    const y = await onbellekli(`cma:${sanatci.ad_arama}:${tur}`, () =>
      getir(`${KOK}?q=${encodeURIComponent(sanatci.ad_arama)}&cc0=1&has_image=1&limit=100&type=${encodeURIComponent(tur)}`),
    );
    for (const e of y.data || []) {
      const yaratici = (e.creators || []).find((c) => c.role === 'artist' && sanatciEslesirMi(sanatci, tanimCoz(c.description), ekAdlar));
      if (!yaratici || yaratici.qualifier || !dogrudanAtifMi(yaratici.description)) continue;
      const url = e.images && e.images.web && e.images.web.url;
      if (!url || !resimselTurMu(e.type)) continue;
      sonuc.push({
        kaynak: 'cma',
        kimlik: String(e.accession_number),
        baslik: e.title,
        yil: Number.isFinite(e.creation_date_earliest) ? e.creation_date_earliest : null,
        muze: 'Cleveland Museum of Art',
        tur: e.type,
        populer: /paint/i.test(e.type) ? 1 : 0,
        gorsel: { k: 'cma', u: url, l: 'CC0', s: e.url || `https://www.clevelandart.org/art/${e.accession_number}` },
      });
    }
  }
  return sonuc;
}
