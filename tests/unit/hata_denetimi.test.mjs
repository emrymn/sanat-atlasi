import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { gorselUrl, gorselYedek, commonsKucuk, paletUrl, ADIMLAR } from '../../js/gorsel.js';

test('Commons küçük resmi Wikimedia\'nın standart basamaklarına yuvarlanır', () => {
  const g = { k: 'commons', d: 'Mona Lisa.jpg' };
  for (const [istenen, beklenen] of [[400, 500], [800, 960], [1200, 1280], [330, 330], [5000, 1920]]) {
    assert.match(gorselUrl(g, istenen), new RegExp(`/${beklenen}px-Mona_Lisa\\.jpg$`));
    assert.ok(ADIMLAR.includes(beklenen));
  }
  assert.match(gorselUrl(g, 800), /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/[0-9a-f]\/[0-9a-f]{2}\/Mona_Lisa\.jpg\//);
});

test('Commons: TIFF/PDF önekleri ve uzantı eki', () => {
  assert.match(commonsKucuk('Eser.tif', 800), /\/lossy-page1-960px-Eser\.tif\.jpg$/);
  assert.match(commonsKucuk('Kitap.pdf', 800), /\/page1-960px-Kitap\.pdf\.jpg$/);
  assert.match(commonsKucuk('Cizim.svg', 800), /\/960px-Cizim\.svg\.png$/);
  assert.match(paletUrl({ k: 'commons', d: 'Eser.tif' }), /\/lossy-page1-330px-Eser\.tif\.jpg$/);
});

test('data-yedek: Commons için Special:FilePath, diğer kaynaklar için 800 px', () => {
  assert.match(gorselYedek({ k: 'commons', d: 'A b.jpg' }), /Special:FilePath\/A_b\.jpg\?width=800$/);
  assert.equal(gorselYedek({ k: 'aic', i: 'abc' }), 'https://www.artic.edu/iiif/2/abc/full/843,/0/default.jpg');
  assert.equal(gorselYedek(null), '');
});

// ---- service worker: sahte ortamda resim() ----
function swKur({ fetchYanit, putHata = false }) {
  const depo = new Map();
  const cache = {
    match: async (u) => depo.get(u),
    put: async (u, y) => {
      if (putHata) throw new Error('QuotaExceededError');
      depo.set(u, y);
    },
    delete: async (u) => depo.delete(u),
    keys: async () => [...depo.keys()].map((url) => ({ url })),
  };
  const dinleyiciler = {};
  const ctx = {
    self: { addEventListener: (t, f) => (dinleyiciler[t] = f), location: { href: 'https://x.test/' }, registration: { scope: 'https://x.test/' }, clients: { claim() {} }, skipWaiting() {} },
    caches: { open: async () => cache, keys: async () => [], delete: async () => true, match: async () => undefined },
    indexedDB: { open: () => { throw new Error('idb yok'); } }, // meta işlemleri sessizce başarısız olur
    fetch: async (url, opt) => fetchYanit(url, opt),
    URL, Request, Response, Promise, Date, Math, parseInt, Number, Set, Map, console, setTimeout,
  };
  vm.createContext(ctx);
  vm.runInContext(readFileSync(new URL('../../sw.js', import.meta.url), 'utf8') + '\n;this.__resim = resim;', ctx);
  return { depo, resim: (url) => {
    const bekleyen = [];
    return ctx.__resim({ request: { url }, waitUntil: (p) => bekleyen.push(p) }).then(async (y) => { await Promise.all(bekleyen); return y; });
  } };
}

const gorselYanit = () => new Response('x', { status: 200, headers: { 'content-type': 'image/jpeg' } });
const URL1 = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/X.jpg/500px-X.jpg';

test('SW: 200 görsel saklanır', async () => {
  const sw = swKur({ fetchYanit: gorselYanit });
  const y = await sw.resim(URL1);
  assert.equal(y.status, 200);
  assert.ok(sw.depo.has(URL1));
});

test('SW: 403 ve görsel olmayan 200 yanıtlar önbelleğe girmez', async () => {
  const sw = swKur({ fetchYanit: () => new Response('yasak', { status: 403, headers: { 'content-type': 'text/html' } }) });
  const y = await sw.resim(URL1);
  assert.equal(y.status, 403);
  assert.equal(sw.depo.size, 0);
  const sw2 = swKur({ fetchYanit: () => new Response('<html>', { status: 200, headers: { 'content-type': 'text/html' } }) });
  await sw2.resim(URL1);
  assert.equal(sw2.depo.size, 0);
});

test('SW: önbellek yazımı (kota) başarısız olsa da görsel sayfaya döner', async () => {
  const sw = swKur({ fetchYanit: gorselYanit, putHata: true });
  const y = await sw.resim(URL1);
  assert.equal(y.status, 200);
  assert.equal(await y.text(), 'x');
});

test('SW: kayıtlı görsel yeniden doğrulanıp hata yanıtıyla ezilmez', async () => {
  let cagri = 0;
  const sw = swKur({ fetchYanit: () => { cagri++; return gorselYanit(); } });
  await sw.resim(URL1);
  await sw.resim(URL1);
  assert.equal(cagri, 1);
});

test('SW: sürüm, yeni resim önbelleği, hata bildirimi ve onabort', () => {
  const kaynak = readFileSync(new URL('../../sw.js', import.meta.url), 'utf8');
  assert.match(kaynak, /const SURUM = '1\.17\.1'/);
  assert.match(kaynak, /const RESIM = 'atlas-resim-2'/);
  assert.match(kaynak, /a === 'atlas-resim'/);
  assert.match(kaynak, /tip === 'resim-sil'/);
  assert.match(kaynak, /t\.onabort/);
});

test('önbellek eseri sl (bilinirlik) alanını korur', async () => {
  const { onbellekEseri } = await import('../../js/eserler.js');
  const e = onbellekEseri({ baslik: 'A', qid: 'Q1', kaynaklar: ['wikidata'], sl: 42, gorseller: [{ k: 'commons', d: 'A.jpg' }] });
  assert.equal(e.sl, 42);
  assert.equal(onbellekEseri({ baslik: 'B', qid: 'Q2', kaynaklar: ['wikidata'], gorseller: [{ k: 'commons', d: 'B.jpg' }] }).sl, 0);
});
