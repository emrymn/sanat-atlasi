// Derleme zamanı Wikidata sorguları: uygulamadaki sorgunun geniş hâli (müze kimlikleri, tüm P18
// görselleri, İngilizce başlık, koleksiyon) ve sanatçı bilgisi (ULAN, Commons kategorisi, etiketler).
import { SPARQL, resimSuzgeci, yilAyikla, dosyaAdiAyikla } from '../../js/wikidata.js';
import { getir, onbellekli } from './ortak.mjs';

const sparql = (q) => getir(`${SPARQL}?format=json&query=${encodeURIComponent(q)}`, { headers: { Accept: 'application/sparql-results+json' } });

export function genisEserSorgusu(qid) {
  if (!/^Q\d+$/.test(qid)) throw new Error('geçersiz QID');
  return `SELECT ?item (GROUP_CONCAT(DISTINCT STR(?img); separator="|") AS ?resimler) (MIN(?inc) AS ?tarih)
  (SAMPLE(?sl) AS ?sitelinks) (SAMPLE(?ltr) AS ?tr) (SAMPLE(?len) AS ?en) (SAMPLE(?lmul) AS ?mul)
  (SAMPLE(?met) AS ?metId) (SAMPLE(?aic) AS ?aicId) (SAMPLE(?cma) AS ?cmaId) (SAMPLE(?nga) AS ?ngaId) (SAMPLE(?kolL) AS ?muze) WHERE {
  ?item wdt:P170 wd:${qid} .
  FILTER NOT EXISTS { ?item p:P170 ?st . ?st ps:P170 wd:${qid} ; pq:P5102 ?nit . FILTER(?nit != wd:Q230768) }
  ${resimSuzgeci('?item')}
  ?item wdt:P18 ?img .
  ?item wikibase:sitelinks ?sl .
  OPTIONAL { ?item wdt:P571 ?inc . }
  OPTIONAL { ?item rdfs:label ?ltr . FILTER(LANG(?ltr) = "tr") }
  OPTIONAL { ?item rdfs:label ?len . FILTER(LANG(?len) = "en") }
  OPTIONAL { ?item rdfs:label ?lmul . FILTER(LANG(?lmul) = "mul") }
  OPTIONAL { ?item wdt:P3634 ?met . }
  OPTIONAL { ?item wdt:P4610 ?aic . }
  OPTIONAL { ?item wdt:P11110 ?cma . }
  OPTIONAL { ?item wdt:P4683 ?nga . }
  OPTIONAL { ?item wdt:P195 ?kol . ?kol rdfs:label ?kolL . FILTER(LANG(?kolL) = "en") }
} GROUP BY ?item ORDER BY DESC(?sitelinks) LIMIT 40`;
}

export function genisSonucuCevir(json) {
  const v = (s, k) => (s[k] ? s[k].value : null);
  return ((json && json.results && json.results.bindings) || [])
    .map((s) => {
      const dosyalar = (v(s, 'resimler') || '').split('|').filter(Boolean).map(dosyaAdiAyikla);
      const baslik = v(s, 'tr') || v(s, 'en') || v(s, 'mul');
      return {
        qid: v(s, 'item').split('/').pop(),
        baslik,
        baslikEn: v(s, 'en') || v(s, 'mul') || null,
        yil: v(s, 'tarih') ? yilAyikla(v(s, 'tarih')) : null,
        dosyalar,
        sl: parseInt(v(s, 'sitelinks') || '0', 10) || 0,
        muze: v(s, 'muze') || '',
        muzeIdler: { met: v(s, 'metId'), aic: v(s, 'aicId'), cma: v(s, 'cmaId'), nga: v(s, 'ngaId') },
      };
    })
    .filter((e) => e.baslik && e.dosyalar.length);
}

export async function wikidataEserleri(qid) {
  if (!qid) return [];
  return genisSonucuCevir(await onbellekli(`wd-genis:${qid}`, () => sparql(genisEserSorgusu(qid))));
}

// Sanatçılar için ULAN (P245), Commons kategorisi (P373) ve İngilizce etiket/diğer adlar
export async function sanatciBilgileri(qidler) {
  const sonuc = {};
  for (let i = 0; i < qidler.length; i += 60) {
    const parca = qidler.slice(i, i + 60);
    const q = `SELECT ?s (SAMPLE(?u) AS ?ulan) (SAMPLE(?c) AS ?kat) (SAMPLE(?l) AS ?en) (GROUP_CONCAT(DISTINCT ?a; separator="|") AS ?diger) WHERE {
      VALUES ?s { ${parca.map((x) => 'wd:' + x).join(' ')} }
      OPTIONAL { ?s wdt:P245 ?u } OPTIONAL { ?s wdt:P373 ?c } OPTIONAL { ?s rdfs:label ?l FILTER(LANG(?l)="en") }
      OPTIONAL { ?s skos:altLabel ?a FILTER(LANG(?a)="en") } } GROUP BY ?s`;
    const j = await onbellekli(`wd-sanatci:${parca.join(',')}`, () => sparql(q));
    for (const b of j.results.bindings) {
      sonuc[b.s.value.split('/').pop()] = {
        ulan: b.ulan ? b.ulan.value : null,
        kategori: b.kat ? b.kat.value : null,
        adlar: [b.en && b.en.value, ...(b.diger ? b.diger.value.split('|') : [])].filter(Boolean),
      };
    }
  }
  return sonuc;
}
