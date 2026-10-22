// Günün sanatçısı için kısa biyografiler → data/biyografiler.json
// Kaynak: Wikidata site bağlantısı → Türkçe Vikipedi'nin giriş bölümü (düz metin), 180 kelimede cümle sonunda kesilir.
// Türkçe madde yoksa İngilizce giriş scripts/.ham/biyografi_en.json'a yazılır; bunlar elle sade Türkçeye çevrilip
// data/biyografiler.json'a "dil": "en→tr" olarak eklenir (betik bu kayıtları korur).
// Kullanım: NODE_USE_ENV_PROXY=1 node scripts/biyografi.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { SPARQL } from '../js/wikidata.js';
import { getir, onbellekli, bekle, HAM } from './kaynaklar/ortak.mjs';
import { biyografiDuzelt } from './kaynaklar/biyografi_duzelt.mjs';

const EN_FAZLA = 180;
const EN_AZ = 120;
const kok = new URL('../', import.meta.url);
const oku = async (yol, yedek) => {
  try {
    return JSON.parse(await readFile(new URL(yol, kok), 'utf8'));
  } catch {
    return yedek;
  }
};

// Cümle sonunda keserek en fazla n kelime
export function kisalt(metin, n = EN_FAZLA) {
  const temiz = String(metin || '')
    .replace(/\s*\([^()]*\)/g, (m) => (m.length > 60 ? '' : m)) // uzun parantez içi telaffuz/ad bilgilerini at
    .replace(/\s+/g, ' ')
    .trim();
  const cumleler = temiz.match(/[^.!?]+[.!?]+(\s|$)/g) || [temiz];
  let sonuc = '';
  for (const c of cumleler) {
    const aday = (sonuc + c).trim();
    if (aday.split(/\s+/).length > n && sonuc) break;
    sonuc = aday + ' ';
  }
  return sonuc.trim();
}

const onbellek = await oku('data/eserler_onbellek.json', { sanatcilar: {} });
const mevcut = await oku('data/biyografiler.json', { sanatcilar: {} });
const kimlikler = Object.entries(onbellek.sanatcilar)
  .filter(([, k]) => k.qid && k.eserler && k.eserler.length)
  .map(([id, k]) => ({ id, qid: k.qid }));

// Site bağlantıları
const baglantilar = {};
for (let i = 0; i < kimlikler.length; i += 60) {
  const parca = kimlikler.slice(i, i + 60);
  const q = `SELECT ?s ?dil ?ad WHERE { VALUES ?s { ${parca.map((x) => 'wd:' + x.qid).join(' ')} }
    ?m schema:about ?s ; schema:isPartOf ?w ; schema:name ?ad . VALUES (?w ?dil) { (<https://tr.wikipedia.org/> "tr") (<https://en.wikipedia.org/> "en") } }`;
  const j = await onbellekli(`bio-site:${parca.map((x) => x.qid).join(',')}`, () => getir(`${SPARQL}?format=json&query=${encodeURIComponent(q)}`));
  for (const b of j.results.bindings) (baglantilar[b.s.value.split('/').pop()] ||= {})[b.dil.value] = b.ad.value;
}

const giris = async (dil, baslik, tum = false) => {
  const url = `https://${dil}.wikipedia.org/w/api.php?action=query&prop=extracts&${tum ? 'exlimit=1' : 'exintro=1'}&explaintext=1&redirects=1&format=json&titles=${encodeURIComponent(baslik)}`;
  const j = await onbellekli(`bio-${dil}${tum ? '-tam' : ''}:${baslik}`, async () => {
    await bekle(400);
    return getir(url);
  });
  const sayfa = Object.values((j.query && j.query.pages) || {})[0] || {};
  // Kaynakça / dış bağlantılar / notlar bölümlerinden sonrasını kes, kalan bölüm başlıklarını at
  const metin = (sayfa.extract || '').split(
    /^=+\s*(Kaynakça|Kaynaklar|Dış bağlantılar|Ayrıca bakınız|Notlar|Dipnotlar|References|External links|See also|Notes)\s*=+\s*$/m,
  )[0];
  return metin.replace(/^=+[^=\n]*=+\s*$/gm, ' ');
};

const kelime = (m) => m.split(/\s+/).filter(Boolean).length;

const sonuc = {
  aciklama: 'Kısa biyografiler. tr: Türkçe Vikipedi giriş bölümü (kısaltılmış). en→tr: İngilizce Vikipedi girişinden Claude çevirisi.',
  olusturma: new Date().toISOString(),
  sanatcilar: {},
};
const ingilizce = {};
for (const { id, qid } of kimlikler) {
  const b = baglantilar[qid] || {};
  try {
    if (b.tr) {
      let metin = kisalt(await giris('tr', b.tr));
      // Giriş bölümü kısaysa maddenin ilk cümleleriyle tamamla (120–180 kelime hedefi)
      if (kelime(metin) < EN_AZ) {
        const uzun = kisalt(await giris('tr', b.tr, true));
        if (kelime(uzun) > kelime(metin)) metin = uzun;
      }
      metin = biyografiDuzelt(id, metin);
      if (kelime(metin) >= 40) {
        sonuc.sanatcilar[id] = {
          metin,
          dil: 'tr',
          kaynak: { ad: 'Türkçe Vikipedi', url: `https://tr.wikipedia.org/wiki/${encodeURIComponent(b.tr.replace(/ /g, '_'))}` },
        };
        console.log(id, 'tr', metin.split(/\s+/).length);
        continue;
      }
    }
    if (mevcut.sanatcilar[id] && ['en→tr', 'claude'].includes(mevcut.sanatcilar[id].dil)) {
      sonuc.sanatcilar[id] = mevcut.sanatcilar[id];
      console.log(id, 'en→tr (korundu)');
      continue;
    }
    if (b.en) {
      ingilizce[id] = {
        baslik: b.en,
        metin: kisalt(await giris('en', b.en), 200),
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(b.en.replace(/ /g, '_'))}`,
      };
      console.log(id, 'en (çevrilecek)');
    } else console.log(id, 'madde yok');
  } catch (e) {
    console.log(id, 'HATA', e.message);
  }
}
await writeFile(new URL('data/biyografiler.json', kok), JSON.stringify(sonuc, null, 1));
await writeFile(new URL('biyografi_en.json', HAM), JSON.stringify(ingilizce, null, 1));
console.log('Bitti:', Object.keys(sonuc.sanatcilar).length, 'biyografi;', Object.keys(ingilizce).length, 'çevrilecek');
