// Sanat Atlası service worker
// - Uygulama kabuğu ve data/*.json: önce önbellek (sürümlü; SURUM değişince yenilenir)
// - Wikimedia görselleri: bayatken-yeniden-doğrula, ~300 MB üst sınır, en eski kullanılan silinir (LRU)
// - Wikidata API/SPARQL: önce ağ, olmazsa önbellek
const SURUM = '1.4.0';
const KABUK = `atlas-kabuk-${SURUM}`;
const RESIM = 'atlas-resim';
const WIKIDATA = 'atlas-wikidata';
const FONT = 'atlas-font';
const RESIM_SINIRI = 300 * 1024 * 1024;
const RESIM_HEDEF = 270 * 1024 * 1024;
const RESIM_TAZELIK = 30 * 24 * 60 * 60 * 1000;

// Müze görselleri (The Met, Art Institute of Chicago IIIF, NGA IIIF, Cleveland)
const MUZE_GORSELLERI = [
  { host: 'images.metmuseum.org', yol: '/' },
  { host: 'www.artic.edu', yol: '/iiif/' },
  { host: 'api.nga.gov', yol: '/iiif/' },
  { host: 'openaccess-cdn.clevelandart.org', yol: '/' },
];

const KABUK_DOSYALARI = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/app.css',
  'js/app.js',
  'js/celdirici.js',
  'js/depo.js',
  'js/eserler.js',
  'js/goruntuleyici.js',
  'js/gorsel.js',
  'js/gunun.js',
  'js/idb.js',
  'js/kilit.js',
  'js/leitner.js',
  'js/oturum.js',
  'js/resim.js',
  'js/tasarim.js',
  'js/wikidata.js',
  'js/yardimci.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'data/sanatcilar.json',
  'data/akimlar.json',
  'data/konular.json',
  'data/baslangic_ilerleme.json',
  'data/eser_turleri.json',
  'data/akim_bilgi.json',
  'data/biyografiler.json',
];
// Olmasa da kurulumu bozmayan dosyalar
const ISTEGE_BAGLI = ['data/eserler_onbellek.json', 'icons/icon-maskable-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    (async () => {
      const c = await caches.open(KABUK);
      await c.addAll(KABUK_DOSYALARI.map((u) => new Request(u, { cache: 'reload' })));
      await Promise.all(ISTEGE_BAGLI.map((u) => c.add(new Request(u, { cache: 'reload' })).catch(() => {})));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      const adlar = await caches.keys();
      await Promise.all(adlar.filter((a) => a.startsWith('atlas-kabuk-') && a !== KABUK).map((a) => caches.delete(a)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (e) => {
  const istek = e.request;
  if (istek.method !== 'GET') return;
  const url = new URL(istek.url);
  if (url.origin === self.location.origin) {
    e.respondWith(kabuk(istek));
  } else if (url.hostname === 'commons.wikimedia.org' && url.pathname.includes('Special:FilePath')) {
    e.respondWith(resim(e));
  } else if (url.hostname === 'upload.wikimedia.org' || url.hostname === 'thumb.wikimedia.org') {
    e.respondWith(resim(e));
  } else if (MUZE_GORSELLERI.some((h) => url.hostname === h.host && url.pathname.startsWith(h.yol))) {
    e.respondWith(resim(e));
  } else if (url.hostname === 'www.wikidata.org' || url.hostname === 'query.wikidata.org') {
    e.respondWith(onceAg(istek, WIKIDATA));
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(oncePaket(istek, FONT));
  }
});

async function kabuk(istek) {
  const c = await caches.open(KABUK);
  if (istek.mode === 'navigate') {
    const k = await c.match(new URL('index.html', self.registration.scope).href);
    if (k) return k;
    return fetch(istek);
  }
  const k = await c.match(istek, { ignoreSearch: true });
  if (k) return k;
  const y = await fetch(istek);
  if (y.ok && new URL(istek.url).pathname.match(/\.(js|css|json|png|webmanifest)$/)) c.put(istek, y.clone());
  return y;
}

async function oncePaket(istek, ad) {
  const c = await caches.open(ad);
  const k = await c.match(istek);
  if (k) return k;
  const y = await fetch(istek);
  if (y.ok || y.type === 'opaque') c.put(istek, y.clone());
  return y;
}

async function onceAg(istek, ad) {
  const c = await caches.open(ad);
  try {
    const y = await fetch(istek);
    if (y.ok) {
      c.put(istek.url, y.clone());
      return y;
    }
    return (await c.match(istek.url)) || y;
  } catch (err) {
    const k = await c.match(istek.url);
    if (k) return k;
    throw err;
  }
}

// ---- görseller (LRU) ----
function tahminiBoyut(url) {
  const u = new URL(url);
  const g = parseInt(u.searchParams.get('width') || (/\/full\/(400),/.test(u.pathname) ? '400' : '800'), 10);
  return g <= 400 ? 60 * 1024 : 180 * 1024;
}

async function resim(e) {
  const anahtar = e.request.url;
  const c = await caches.open(RESIM);
  const kayitli = await c.match(anahtar);
  const getir = () =>
    fetch(anahtar, { mode: 'no-cors', credentials: 'omit' }).then(async (y) => {
      if (y.ok || y.type === 'opaque') {
        let boyut = tahminiBoyut(anahtar);
        if (y.type !== 'opaque') {
          const u = parseInt(y.headers.get('content-length') || '', 10);
          if (u > 0) boyut = u;
        }
        await c.put(anahtar, y.clone());
        await metaYaz(anahtar, { boyut, erisim: Date.now(), zaman: Date.now() });
        budama();
      }
      return y;
    });
  if (kayitli) {
    const m = await metaOku(anahtar);
    if (!m || Date.now() - m.zaman > RESIM_TAZELIK) e.waitUntil(getir().catch(() => {}));
    else if (Date.now() - m.erisim > 60 * 60 * 1000) e.waitUntil(metaYaz(anahtar, { ...m, erisim: Date.now() }));
    return kayitli;
  }
  return getir();
}

let budamaSuruyor = false;
async function budama() {
  if (budamaSuruyor) return;
  budamaSuruyor = true;
  try {
    const hepsi = await metaHepsi();
    let toplam = hepsi.reduce((t, m) => t + m.boyut, 0);
    if (toplam <= RESIM_SINIRI) return;
    const c = await caches.open(RESIM);
    hepsi.sort((a, b) => a.erisim - b.erisim);
    for (const m of hepsi) {
      if (toplam <= RESIM_HEDEF) break;
      await c.delete(m.url);
      await metaSil(m.url);
      toplam -= m.boyut;
    }
  } finally {
    budamaSuruyor = false;
  }
}

// ---- küçük IndexedDB (yalnızca service worker kullanır) ----
let db = null;
function dbAc() {
  if (db) return db;
  db = new Promise((coz, reddet) => {
    const r = indexedDB.open('atlas-sw', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('resimler', { keyPath: 'url' });
    r.onsuccess = () => coz(r.result);
    r.onerror = () => reddet(r.error);
  });
  return db;
}
function tx(kip, fn) {
  return dbAc().then(
    (d) =>
      new Promise((coz, reddet) => {
        const t = d.transaction('resimler', kip);
        const r = fn(t.objectStore('resimler'));
        t.oncomplete = () => coz(r && r.result);
        t.onerror = () => reddet(t.error);
      }),
  );
}
const metaOku = (url) => tx('readonly', (s) => s.get(url)).catch(() => null);
const metaYaz = (url, m) => tx('readwrite', (s) => s.put({ ...m, url })).catch(() => {});
const metaSil = (url) => tx('readwrite', (s) => s.delete(url)).catch(() => {});
const metaHepsi = () => tx('readonly', (s) => s.getAll()).catch(() => []);
