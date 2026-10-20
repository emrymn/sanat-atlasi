// Wikidata erişimi: QID çözümleme ve eser listesi.
// Hem tarayıcıda (uygulama) hem Node'da (scripts/onbellek.mjs) çalışır.
// Doğruluk kuralı: bir eser yalnızca doğrulanmış QID için P170/P84 ile bağlıysa alınır.

export const API = 'https://www.wikidata.org/w/api.php';
export const SPARQL = 'https://query.wikidata.org/sparql';
export const KULLANICI_AJANI = 'SanatAtlasi/1.0 (personal study app; emreyaman1024@gmail.com)';

// İnsan (Q5) dışında kabul edilen "grup" türleri (ör. Limbourg kardeşler).
export const GRUP_TURLERI = new Set([
  'Q16334295', // group of humans
  'Q16979650', // sibling group
  'Q14073567', // sibling duo
  'Q10648343', // duo
  'Q281643', // trio
]);

// Wikidata zaman dizgesinden yıl: "+1267-00-00T00:00:00Z" → 1267, "-0479-…" → -479
export function yilAyikla(zaman) {
  if (typeof zaman !== 'string') return null;
  const m = /^([+-]?)(\d{1,})-/.exec(zaman.trim());
  if (!m) return null;
  const y = parseInt(m[2], 10);
  return m[1] === '-' ? -y : y;
}

function gecerliIddialar(varlik, ozellik) {
  const iddialar = (varlik.claims && varlik.claims[ozellik]) || [];
  return iddialar.filter((c) => c.rank !== 'deprecated' && c.mainsnak && c.mainsnak.snaktype === 'value' && c.mainsnak.datavalue);
}

// Doğum tarihi için tolerans: yıl hassasiyetinde ±3 (yönerge). Tarih "yaklaşık" (P1480)
// nitelendirmeliyse ya da on yıl hassasiyetindeyse ±10, yüzyıl hassasiyetindeyse ±100.
// Antik sanatçılarda (doğum yılı MÖ) en az ±15 kullanılır (bkz. adayUygunMu).
export function dogumTolerans(iddia) {
  const deger = iddia.mainsnak.datavalue.value || {};
  const hassasiyet = deger.precision;
  if (typeof hassasiyet === 'number' && hassasiyet <= 7) return 100;
  const yaklasik = ((iddia.qualifiers && iddia.qualifiers.P1480) || []).length > 0;
  if (hassasiyet === 8 || yaklasik) return 10;
  return 3;
}

export const ANTIK_TOLERANS = 15;

// Aday varlık sanatçıyla eşleşiyor mu? (P31 = Q5 ya da grup; doğum yılı toleransı)
export function adayUygunMu(varlik, sanatci) {
  if (!varlik || varlik.missing !== undefined) return false;
  const turler = gecerliIddialar(varlik, 'P31').map((c) => c.mainsnak.datavalue.value.id);
  const insan = turler.includes('Q5');
  const grup = turler.some((t) => GRUP_TURLERI.has(t));
  if (!insan && !grup) return false;
  if (sanatci.dogum === null || sanatci.dogum === undefined) return true;
  return gecerliIddialar(varlik, 'P569').some((c) => {
    const y = yilAyikla(c.mainsnak.datavalue.value.time);
    const tolerans = sanatci.dogum < 0 ? Math.max(ANTIK_TOLERANS, dogumTolerans(c)) : dogumTolerans(c);
    return y !== null && Math.abs(y - sanatci.dogum) <= tolerans;
  });
}

// Basit JSON getirici: 429/5xx için Retry-After'a uyarak yeniden dener.
export function jsonGetiriciYap({ basliklar = {}, deneme = 4, bekle = (ms) => new Promise((r) => setTimeout(r, ms)), zamanAsimi = 20000 } = {}) {
  return async function getir(url, ek = {}) {
    let son;
    for (let i = 0; i < deneme; i++) {
      const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const t = ctrl ? setTimeout(() => ctrl.abort(), zamanAsimi) : null;
      try {
        const yanit = await fetch(url, { headers: { ...basliklar, ...(ek.headers || {}) }, signal: ctrl && ctrl.signal });
        if (yanit.status === 429 || yanit.status >= 500) {
          const ra = parseInt(yanit.headers.get('retry-after') || '', 10);
          son = new Error('HTTP ' + yanit.status);
          await bekle((Number.isFinite(ra) ? ra : 2 ** i * 2) * 1000);
          continue;
        }
        if (!yanit.ok) throw new Error('HTTP ' + yanit.status);
        return await yanit.json();
      } catch (e) {
        son = e;
        if (e && e.message && /^HTTP 4/.test(e.message)) throw e;
        if (i < deneme - 1) await bekle(2 ** i * 1000);
      } finally {
        if (t) clearTimeout(t);
      }
    }
    throw son || new Error('getirilemedi');
  };
}

// Sanatçının QID'ini bulur; doğrulanamazsa null (tahmin yok).
export async function qidCoz(sanatci, getir) {
  const ara = `${API}?action=wbsearchentities&search=${encodeURIComponent(sanatci.ad_arama)}&language=en&type=item&limit=7&format=json&origin=*`;
  const sonuc = await getir(ara);
  const adaylar = ((sonuc && sonuc.search) || []).map((s) => s.id).filter(Boolean);
  if (!adaylar.length) return null;
  const ent = await getir(`${API}?action=wbgetentities&ids=${adaylar.join('|')}&props=claims&format=json&origin=*`);
  const varliklar = (ent && ent.entities) || {};
  for (const id of adaylar) {
    if (adayUygunMu(varliklar[id], sanatci)) return id;
  }
  return null;
}

export function eserSorgusu(qid) {
  if (!/^Q\d+$/.test(qid)) throw new Error('geçersiz QID');
  // wdt: yalnızca en iyi sıradaki iddiaları verir. "Muhtemelen/tartışmalı" gibi
  // P5102 niteleyicisi taşıyan (atıf = Q230768 dışındaki) yaratıcı iddiaları elenir.
  return `SELECT ?item (SAMPLE(?img) AS ?resim) (MIN(?inc) AS ?tarih) (SAMPLE(?sl) AS ?sitelinks)
  (SAMPLE(?ltr) AS ?tr) (SAMPLE(?len) AS ?en) (SAMPLE(?lmul) AS ?mul) WHERE {
  { ?item wdt:P170 wd:${qid} . } UNION { ?item wdt:P84 wd:${qid} . }
  FILTER NOT EXISTS { ?item p:P170 ?st . ?st ps:P170 wd:${qid} ; pq:P5102 ?nit . FILTER(?nit != wd:Q230768) }
  ?item wdt:P18 ?img .
  ?item wikibase:sitelinks ?sl .
  OPTIONAL { ?item wdt:P571 ?inc . }
  OPTIONAL { ?item rdfs:label ?ltr . FILTER(LANG(?ltr) = "tr") }
  OPTIONAL { ?item rdfs:label ?len . FILTER(LANG(?len) = "en") }
  OPTIONAL { ?item rdfs:label ?lmul . FILTER(LANG(?lmul) = "mul") }
} GROUP BY ?item ORDER BY DESC(?sitelinks) LIMIT 40`;
}

// Commons dosya adı: P18 değeri "http://commons.wikimedia.org/wiki/Special:FilePath/X.jpg" biçimindedir.
export function dosyaAdiAyikla(deger) {
  if (!deger) return null;
  const i = deger.indexOf('Special:FilePath/');
  let ad = i >= 0 ? deger.slice(i + 'Special:FilePath/'.length) : deger;
  try {
    ad = decodeURIComponent(ad);
  } catch (e) {
    /* olduğu gibi bırak */
  }
  return ad.replace(/ /g, '_');
}

export function sparqlSonucunuCevir(json) {
  const satirlar = (json && json.results && json.results.bindings) || [];
  const eserler = [];
  for (const s of satirlar) {
    const qid = s.item && s.item.value.split('/').pop();
    const dosya = dosyaAdiAyikla(s.resim && s.resim.value);
    const baslik = (s.tr && s.tr.value) || (s.en && s.en.value) || (s.mul && s.mul.value) || null;
    if (!qid || !dosya || !baslik) continue;
    const yil = s.tarih ? yilAyikla(s.tarih.value) : null;
    eserler.push({ qid, baslik, yil, dosya, sl: s.sitelinks ? parseInt(s.sitelinks.value, 10) || 0 : 0 });
  }
  return eserler;
}

export async function eserleriGetir(qid, getir) {
  const url = `${SPARQL}?format=json&query=${encodeURIComponent(eserSorgusu(qid))}`;
  return sparqlSonucunuCevir(await getir(url, { headers: { Accept: 'application/sparql-results+json' } }));
}
