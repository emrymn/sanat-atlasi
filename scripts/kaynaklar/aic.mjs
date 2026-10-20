// Art Institute of Chicago API (anahtar gerekmez). Sanatçı ad + doğum yılıyla eşlenir; yalnızca
// is_public_domain eserler, görsel IIIF.
import { getir, onbellekli, dogrudanAtifMi, resimselTurMu, sanatciEslesirMi } from './ortak.mjs';

const KOK = 'https://api.artic.edu/api/v1';

export async function aicEserleri(sanatci, ekAdlar = []) {
  const ajanlar = await onbellekli(`aic-ajan:${sanatci.ad_arama}`, () =>
    getir(`${KOK}/agents/search?q=${encodeURIComponent(sanatci.ad_arama)}&limit=10&fields=id,title,birth_date,death_date,is_artist`),
  );
  const ajan = (ajanlar.data || []).find((a) => a.is_artist && sanatciEslesirMi(sanatci, { ad: a.title, dogum: a.birth_date }, ekAdlar));
  if (!ajan) return [];
  const params = {
    query: { bool: { must: [{ term: { artist_id: ajan.id } }, { term: { is_public_domain: true } }] } },
    limit: 100,
    fields: ['id', 'title', 'date_start', 'artist_display', 'artwork_type_title', 'image_id', 'is_boosted', 'has_not_been_viewed_much'],
  };
  const yanit = await onbellekli(`aic-eser:${ajan.id}`, () => getir(`${KOK}/artworks/search?params=${encodeURIComponent(JSON.stringify(params))}`));
  return (yanit.data || [])
    .filter((e) => e.image_id && resimselTurMu(e.artwork_type_title) && dogrudanAtifMi(String(e.artist_display || '').split('\n')[0].split('(')[0]))
    .map((e) => ({
      kaynak: 'aic',
      kimlik: String(e.id),
      baslik: e.title,
      yil: Number.isFinite(e.date_start) ? e.date_start : null,
      muze: 'Art Institute of Chicago',
      tur: e.artwork_type_title,
      populer: (e.is_boosted ? 3 : 0) + (e.has_not_been_viewed_much ? -1 : 0) + (/paint/i.test(e.artwork_type_title) ? 1 : 0),
      gorsel: { k: 'aic', i: e.image_id, l: 'CC0', s: `https://www.artic.edu/artworks/${e.id}` },
    }));
}
