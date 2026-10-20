// National Gallery of Art açık verisi (github.com/NationalGalleryOfArt/opendata, CC0).
// CSV'ler scripts/.ham/nga/ altına indirilir. Sanatçı, NGA'nın kendi Wikidata eşlemesiyle bulunur;
// yalnızca rolü "artist" olan ve öneki (attributed to, circle of…) olmayan eserler alınır.
import { readFile } from 'node:fs/promises';
import { HAM, dogrudanAtifMi, resimselTurMu } from './ortak.mjs';

// Tırnaklı alanları ve satır içi yeni satırları destekleyen CSV ayrıştırıcı
export function csvAyristir(metin) {
  const satirlar = [];
  let satir = [];
  let alan = '';
  let tirnak = false;
  for (let i = 0; i < metin.length; i++) {
    const c = metin[i];
    if (tirnak) {
      if (c === '"') {
        if (metin[i + 1] === '"') {
          alan += '"';
          i++;
        } else tirnak = false;
      } else alan += c;
    } else if (c === '"') tirnak = true;
    else if (c === ',') {
      satir.push(alan);
      alan = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && metin[i + 1] === '\n') i++;
      satir.push(alan);
      satirlar.push(satir);
      satir = [];
      alan = '';
    } else alan += c;
  }
  if (alan || satir.length) {
    satir.push(alan);
    satirlar.push(satir);
  }
  const [baslik, ...veri] = satirlar;
  return veri.filter((s) => s.length > 1).map((s) => Object.fromEntries(baslik.map((b, i) => [b, s[i] ?? ''])));
}

let dizin = null;
async function dizinKur() {
  if (dizin) return dizin;
  const oku = async (ad) => csvAyristir(await readFile(new URL(`nga/${ad}.csv`, HAM), 'utf8'));
  const [kurucular, iliskiler, nesneler, gorseller] = await Promise.all([oku('constituents'), oku('objects_constituents'), oku('objects'), oku('published_images')]);
  const qidden = new Map();
  for (const k of kurucular) if (k.wikidataid) qidden.set(k.wikidataid, k.constituentid);
  const kurucuEserleri = new Map();
  for (const r of iliskiler) {
    if (r.roletype !== 'artist' || r.role !== 'artist' || r.prefix.trim()) continue;
    if (!kurucuEserleri.has(r.constituentid)) kurucuEserleri.set(r.constituentid, []);
    kurucuEserleri.get(r.constituentid).push(r.objectid);
  }
  const nesne = new Map(nesneler.map((n) => [n.objectid, n]));
  const gorsel = new Map();
  for (const g of gorseller) if (g.viewtype === 'primary' && g.openaccess === '1' && g.iiifurl) gorsel.set(g.depictstmsobjectid, g.iiifurl);
  dizin = { qidden, kurucuEserleri, nesne, gorsel };
  return dizin;
}

export async function ngaEserleri(qid) {
  if (!qid) return [];
  const { qidden, kurucuEserleri, nesne, gorsel } = await dizinKur();
  const kurucu = qidden.get(qid);
  if (!kurucu) return [];
  const sonuc = [];
  for (const id of kurucuEserleri.get(kurucu) || []) {
    const n = nesne.get(id);
    const iiif = gorsel.get(id);
    if (!n || !iiif || !resimselTurMu(n.classification) || !dogrudanAtifMi(n.attribution)) continue;
    sonuc.push({
      kaynak: 'nga',
      kimlik: String(n.objectid),
      baslik: n.title,
      yil: n.beginyear ? Number(n.beginyear) : null,
      muze: 'National Gallery of Art, Washington',
      tur: n.classification,
      populer: /paint/i.test(n.classification) ? 1 : 0,
      gorsel: { k: 'nga', i: iiif, l: 'CC0', s: `https://www.nga.gov/collection/art-object-page.${n.objectid}.html` },
    });
  }
  return sonuc;
}
