// Sanat Atlası service worker
// - Uygulama kabuğu ve data/*.json: önce önbellek (sürümlü; SURUM değişince yenilenir)
// - Wikimedia, müze ve WikiArt görselleri: bayatken-yeniden-doğrula, ~700 MB üst sınır, en eski kullanılan silinir (LRU)
// - Wikidata API/SPARQL: önce ağ, olmazsa önbellek
const SURUM = '1.68.2';
const KABUK = `atlas-kabuk-${SURUM}`;
const RESIM = 'atlas-resim-2'; // eski 'atlas-resim' hata yanıtları içerebilir; activate'te silinir
const WIKIDATA = 'atlas-wikidata';
const FONT = 'atlas-font';
// İş 58e: en büyük kopyalar (R2 d/, 3–15 MB) ayrı ve küçük bir önbellekte: birkaç tablo büyütmek 1280'lik ve küçük
// kopyaları (çevrimdışı indirilenler dahil) görsel önbelleğinden itmesin. En son açılan 30 tanesi kalır.
const DEVASA = 'atlas-devasa';
const DEVASA_EN_COK = 30;
// İş 60/129: Ayarlar'dan bilerek indirilen en büyük kopyalar IndexedDB'de (atlas-devasa); devasaDepodan
// İş 62: R2 görselleri Emre'nin alan adından (r2.dev bazı mobil operatörlerde engelli); r2.dev de tanınır (testler, eski kayıtlar)
const R2_ALAN = 'gorsel.noracloud.ai';
const r2Mi = (u) => u.hostname === R2_ALAN || u.hostname.endsWith('.r2.dev');
const RESIM_SINIRI = 700 * 1024 * 1024;
const RESIM_HEDEF = 650 * 1024 * 1024;
// CORS başlığı gönderdiği bilinen görsel sunucuları: cors kipiyle istenir, böylece durum kodu görülür
const CORS_HOSTLARI = new Set(['upload.wikimedia.org', 'thumb.wikimedia.org', 'api.nga.gov', 'www.artic.edu']);

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
  'js/adlar.js',
  'js/app.js',
  'js/ekranlar/ayarlar.js',
  'js/ekranlar/bugun.js',
  'js/ekranlar/gozat.js',
  'js/ekranlar/soruTurlari.js',
  'js/ekranlar/ilerleme.js',
  'js/ekranlar/ortak.js',
  'js/ekranlar/pekistir.js',
  'js/ekranlar/pano.js',
  'js/kurs.js',
  'js/ekranlar/yonlendirme.js',
  'js/basyapit.js',
  'js/celdirici.js',
  'js/depo.js',
  'js/devam.js',
  'js/eserler.js',
  'js/goruntuleyici.js',
  'js/gecis.js',
  'js/dokunus.js',
  'js/keskin.js',
  'js/devasaOnbellek.js',
  'js/gorsel.js',
  'js/gunun.js',
  'js/idb.js',
  'js/ikonografi.js',
  'js/soruTurlari.js',
  'js/karsilastir.js',
  'js/kilit.js',
  'js/leitner.js',
  'js/md5.js',
  'js/ogrenme.js',
  'js/oturum.js',
  'js/renk.js',
  'js/resim.js',
  'js/sallanma.js',
  'js/deste.js',
  'js/harfler.js',
  'js/cerceve.js',
  'js/imza.js',
  'js/kunye.js',
  'js/seviye.js',
  'js/surum.js',
  'js/tasarim.js',
  'js/titresim.js',
  'js/surukleKapat.js',
  'js/hataGunlugu.js',
  'js/ters.js',
  'js/turlar.js',
  'js/arama.js',
  'js/ekranlar/arama.js',
  'js/zaman.js',
  'js/ekranlar/zaman.js',
  'js/akim.js',
  'js/ekranlar/akim.js',
  'js/gecmis.js',
  'js/koleksiyon.js',
  'js/harita.js',
  'js/egim.js',
  'js/bolum.js',
  'js/bildirim.js',
  'js/rozet.js',
  'js/yenilikler.js',
  'js/ekranlar/calisma.js',
  'js/ekranlar/koleksiyon.js',
  'js/ekranlar/harita.js',
  'js/ekranlar/bildirim.js',
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
  'data/harita.json',
  'data/harita_yolcu.json',
  'data/harita_patikalar.json',
  'data/harita_motifler.json',
  'data/imzalar.json',
  'data/kunye.json',
  'data/biyografiler.json',
  'data/kisa_adlar.json',
  'data/akim_ozellikleri.json',
];
// Olmasa da kurulumu bozmayan dosyalar
const ISTEGE_BAGLI = [
  'data/eserler_onbellek.json',
  'data/tanima_notlari.json',
  'data/eser_notlari.json',
  'data/eser_adlari_tr.json',
  'data/eser_zorluk.json',
  'data/basyapitlar.json',
  'data/ikonografi.json',
  'data/yerel_gorseller.json',
  'data/gorsel_oranlari.json',
  'data/gorsel_odak.json',
  'data/kopya_eserler.json',
  'data/cikarilan_gorseller.json',
  'icons/icon-maskable-512.png',
];

// İş 65: GitHub Pages'in ara sunucuları (Fastly) dosyaları 10 dakikaya kadar eski haliyle verebiliyor; güncelleme
// gönderilir gönderilmez kurulan sürüm yeni sw.js ama eski js/data dosyalarıyla kalıyordu (Ayarlar'da eski sürüm, her
// açılışta aynı). Dosyalar sürüm sorgusuyla (?v=SURUM; ara sunucuda ayrı kayıt) istenir, sorgusuz adresle saklanır.
// Sürüm dosyası tutmazsa kurulum başarısız sayılır: eski sürüm sağlam kalır, sonraki açılışta yeniden denenir.
const taze = (u) => new Request(`${u}${u.includes('?') ? '&' : '?'}v=${SURUM}`, { cache: 'reload' });
async function kabugaKoy(c, u) {
  const y = await fetch(taze(u));
  if (!y.ok) throw new Error(`${u}: ${y.status}`);
  await c.put(new Request(u), y);
}

self.addEventListener('install', (e) => {
  e.waitUntil(
    (async () => {
      const c = await caches.open(KABUK);
      await Promise.all(KABUK_DOSYALARI.map((u) => kabugaKoy(c, u)));
      await Promise.all(ISTEGE_BAGLI.map((u) => kabugaKoy(c, u).catch(() => {})));
      const surum = await c.match('js/surum.js');
      if (!surum || !(await surum.text()).includes(`'${SURUM}'`)) {
        await caches.delete(KABUK);
        throw new Error('Kabuk dosyaları bu sürümün değil');
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      const adlar = await caches.keys();
      await Promise.all(adlar.filter((a) => (a.startsWith('atlas-kabuk-') && a !== KABUK) || a === 'atlas-resim').map((a) => caches.delete(a)));
      // İş 135: görsel önbelleğinin (atlas-resim-2) boyut/erişim kayıtları sürüm geçişinde korunur (önceden her sürümde
      // silinip LRU sırası kayboluyordu; kayıtlar eski 'atlas-resim' içindi, o çoktan silindi)
      await self.clients.claim();
    })(),
  );
});

// Sayfa yüklenemeyen (büyük olasılıkla hata gövdeli opak) bir görseli bildirir: önbellekten sil
self.addEventListener('message', (e) => {
  if (e.data && e.data.tip === 'resim-sil' && typeof e.data.url === 'string') {
    e.waitUntil(
      caches
        .open(RESIM)
        .then((c) => c.delete(e.data.url))
        .then(() => metaSil(e.data.url))
        .catch(() => {}),
    );
  }
});

self.addEventListener('fetch', (e) => {
  const istek = e.request;
  if (istek.method !== 'GET') return;
  // İş 131: Ayarlar'daki telefona indirme (cache: 'no-store') service worker'dan geçmez: görsel önbelleğine de yazılıp
  // onu boşuna doldurmasın, budamayla yavaşlatmasın
  if (istek.cache === 'no-store') return;
  const url = new URL(istek.url);
  // Palet çıkarmak için CORS ile istenen görseller önbellekteki opak yanıtı kullanamaz: doğrudan ağa gider
  if (istek.mode === 'cors' && istek.destination === 'image' && url.origin !== self.location.origin) return;
  if (url.origin === self.location.origin && url.pathname.includes('/gorseller/ses/')) {
    // okunuş kayıtları: Safari sesi parça parça (Range) ister, 206 yanıtı bekler
    e.respondWith(sesYaniti(e));
  } else if (url.origin === self.location.origin && url.pathname.includes('/gorseller/')) {
    // uygulamayla yayınlanan görsel kopyaları: sürümden bağımsız görsel önbelleği (LRU). İş 131: telefona indirilmişse
    // (400'lükler) IndexedDB'den; önbellek hata verirse ağdan
    e.respondWith(depodanYaDa(e));
  } else if (r2Mi(url) && url.pathname.startsWith('/d/')) {
    // İş 129: önbellek hata verirse görsel yine ağdan gelsin (telefonda Cache Storage bozulmuştu)
    e.respondWith(devasaResim(e).catch(() => fetch(istek)));
  } else if (r2Mi(url)) {
    // İş 58: Cloudflare R2'deki görsel kopyaları (1280 px). İş 130: telefona indirilmişse (en büyük kopyası olmayanlar)
    // IndexedDB'den
    e.respondWith(depodanYaDa(e));
  } else if (url.origin === self.location.origin && (url.pathname.endsWith('/data/kunye.json') || url.pathname.endsWith('/data/gorsel_kaynagi.json'))) {
    // künye (portre, okunuş, IPA) Emre'nin Mac'inde güncellenir: sürüm beklemeden gelsin diye önce ağ, yoksa önbellek
    // İş 135: ağ yavaşsa (kopmadan sürünüyorsa) açılış beklemesin: önbellekte varsa 2,5 sn sonra o verilir, ağ arkada sürer
    e.respondWith(onceAg(e, KABUK, 2500));
  } else if (url.origin === self.location.origin) {
    // İş 122: önbellek okunamazsa (telefonda depolama dolu ya da bozuk) ağdan; yoksa iPhone "WebKit encountered an
    // internal error" gösterip uygulamayı hiç açmıyordu
    e.respondWith(kabuk(istek).catch(() => fetch(istek)));
  } else if (url.hostname === 'commons.wikimedia.org' && url.pathname.includes('Special:FilePath')) {
    e.respondWith(resim(e));
  } else if (url.hostname === 'upload.wikimedia.org' || url.hostname === 'thumb.wikimedia.org') {
    e.respondWith(resim(e));
  } else if (/^uploads\d*\.wikiart\.org$/.test(url.hostname)) {
    // WikiArt görselleri (yalnızca görsel; WikiArt API'sine telefondan hiç gidilmez)
    e.respondWith(resim(e));
  } else if (MUZE_GORSELLERI.some((h) => url.hostname === h.host && url.pathname.startsWith(h.yol))) {
    e.respondWith(resim(e));
  } else if (url.hostname === 'www.wikidata.org' || url.hostname === 'query.wikidata.org') {
    e.respondWith(onceAg(e, WIKIDATA, 8000));
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(oncePaket(istek, FONT));
  }
});

async function kabuk(istek) {
  const c = await caches.open(KABUK);
  if (istek.mode === 'navigate') {
    // Yalnız uygulamanın kendi adresi (kök ya da index.html) kabuktan gelir; sitedeki başka sayfalar (ör.
    // deneme/titresim.html) ağdan: yoksa onlar da uygulamaya dönüşüp göreli yolları bulamıyor, "Yükleniyor…"da kalıyordu
    const kok = new URL(self.registration.scope).pathname;
    const yol = new URL(istek.url).pathname;
    const indexUrl = new URL('index.html', self.registration.scope).href;
    if (yol !== kok && yol !== `${kok}index.html`) return fetch(istek).catch(() => c.match(indexUrl));
    const k = await c.match(indexUrl);
    if (k) return k;
    return fetch(istek);
  }
  const k = await c.match(istek, { ignoreSearch: true });
  if (k) return k;
  const y = await fetch(istek);
  if (y.ok && new URL(istek.url).pathname.match(/\.(js|css|json|png|webmanifest)$/)) c.put(istek, y.clone()).catch(() => {});
  return y;
}

async function oncePaket(istek, ad) {
  const c = await caches.open(ad);
  const k = await c.match(istek);
  if (k) return k;
  const y = await fetch(istek);
  if (y.ok || y.type === 'opaque') c.put(istek, y.clone()).catch(() => {});
  return y;
}

// Önce ağ; ağ hata verirse önbellek. sure verilirse ve önbellekte kopya varsa ağ o kadar beklenir, gecikirse önbellekteki
// verilir; ağ isteği arkada sürer ve gelince önbelleği yeniler (bir sonraki açılışa)
async function onceAg(e, ad, sure = 0) {
  const istek = e.request;
  const c = await caches.open(ad);
  const ag = fetch(istek).then((y) => {
    if (y.ok) c.put(istek.url, y.clone()).catch(() => {});
    return y;
  });
  const eski = sure ? await c.match(istek.url).catch(() => undefined) : undefined;
  if (eski) {
    try {
      e.waitUntil(ag.catch(() => {}));
    } catch (err) {
      /* olay bitmiş */
    }
    const y = await Promise.race([ag.catch(() => null), new Promise((coz) => setTimeout(() => coz(null), sure))]);
    return y && y.ok ? y : eski;
  }
  try {
    const y = await ag;
    if (y.ok) return y;
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
  if (u.hostname.endsWith('wikiart.org')) return /!Large\.jpg$/i.test(u.pathname) ? 90 * 1024 : 220 * 1024;
  const g = parseInt(u.searchParams.get('width') || (/\/full\/(400),/.test(u.pathname) ? '400' : '800'), 10);
  return g <= 400 ? 60 * 1024 : 180 * 1024;
}

// İş 131: kendi sunucularımız (aynı köken, R2) sınırsız; Wikimedia'ya aynı anda en çok 4 istek; 429'da (cors kipinde görülebilir) bir kez bekleyip tekrar denenir
let aktif = 0;
const kuyruk = [];
async function sinirli(fn, en = 4) {
  if (aktif >= en) await new Promise((r) => kuyruk.push(r));
  aktif++;
  try {
    return await fn();
  } finally {
    aktif--;
    const r = kuyruk.shift();
    if (r) r();
  }
}

// { y, saklanir }: yalnızca gerçekten görsel olduğu bilinen (ya da doğrulanamayan opak) yanıtlar saklanır
async function agdan(url) {
  // uygulamayla yayınlanan görsel kopyaları (gorseller/): aynı köken, durum kodu görünür
  if (new URL(url).origin === self.location.origin) {
    const y = await fetch(url);
    return { y, saklanir: y.ok };
  }
  if (CORS_HOSTLARI.has(new URL(url).hostname) || r2Mi(new URL(url))) {
    try {
      const y = await fetch(url, { mode: 'cors', credentials: 'omit' });
      const gorselMi = (y.headers.get('content-type') || '').startsWith('image/');
      return { y, saklanir: y.ok && gorselMi };
    } catch (err) {
      /* CORS yoksa no-cors'a düş */
    }
  }
  const y = await fetch(url, { mode: 'no-cors', credentials: 'omit' });
  return { y, saklanir: y.type === 'opaque' }; // hata gövdesi çıkarsa sayfa bildirir, kayıt silinir
}

async function agdanTekrarli(url) {
  const u = new URL(url);
  if (u.origin === self.location.origin || r2Mi(u)) return agdan(url);
  let s = await sinirli(() => agdan(url));
  if (s.y.status === 429) {
    const ra = parseInt(s.y.headers.get('retry-after') || '', 10);
    await new Promise((r) => setTimeout(r, Math.min(Number.isFinite(ra) ? ra : 2, 5) * 1000));
    s = await sinirli(() => agdan(url));
  }
  return s;
}

// Önbelleğe yazma yanıtı geciktirmez ve başarısız olursa görseli düşürmez
async function sakla(c, url, y, boyut) {
  if (onbellekBozuk) return;
  try {
    await c.put(url, y.clone());
  } catch (err) {
    if (!err || err.name !== 'QuotaExceededError') {
      onbellekBozuk = true; // yer sorunu değil: önbellek bozuk, budama işe yaramaz
      return;
    }
    await budama(true).catch(() => {});
    try {
      await c.put(url, y.clone());
    } catch (err2) {
      return;
    }
  }
  await metaYaz(url, { boyut, erisim: Date.now(), zaman: Date.now() });
  await budama().catch(() => {});
}

// Sesler görsel önbelleğinde bütün dosya olarak durur; Range isteğine o parçayla (206) yanıt verilir.
// Bütün dosyayı 200 ile vermek iOS'ta sesin hiç çalmamasına yol açar.
async function sesYaniti(e) {
  const anahtar = e.request.url.split('#')[0];
  const c = await caches.open(RESIM);
  let y = await c.match(anahtar);
  if (!y) {
    const ag = await fetch(anahtar);
    if (!ag.ok) return ag;
    y = ag.clone();
    const boyut = parseInt(ag.headers.get('content-length') || '', 10) || 30000;
    e.waitUntil(sakla(c, anahtar, ag, boyut));
  }
  return parcala(y, e.request.headers.get('range'));
}

async function parcala(y, aralik) {
  const m = /^bytes=(\d*)-(\d*)$/.exec((aralik || '').trim());
  if (!m) return y;
  const govde = await y.blob();
  const top = govde.size;
  let bas, son;
  if (m[1] === '') {
    bas = Math.max(0, top - parseInt(m[2] || '0', 10));
    son = top - 1;
  } else {
    bas = parseInt(m[1], 10);
    son = m[2] === '' ? top - 1 : Math.min(parseInt(m[2], 10), top - 1);
  }
  if (bas >= top || bas > son) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${top}` } });
  return new Response(govde.slice(bas, son + 1), {
    status: 206,
    headers: {
      'Content-Type': y.headers.get('content-type') || 'audio/mpeg',
      'Content-Range': `bytes ${bas}-${son}/${top}`,
      'Content-Length': String(son - bas + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}

// İş 131: telefonda Cache Storage bozulabiliyor (yazma TypeError, okuma "Internal error"): bir kez yazılamayınca bu
// çalışma boyunca görsel önbelleği atlanır (her görselde yeniden denenip budama çalışınca sayfalar çok geç yükleniyordu)
let onbellekBozuk = false;
async function depodanYaDa(e) {
  const y = await devasaDepodan(e.request.url.split('?')[0]).catch(() => null);
  if (y) return y;
  if (onbellekBozuk) return agdan(e.request.url).then((s) => s.y);
  return resim(e).catch(() => fetch(e.request));
}

async function resim(e) {
  const anahtar = e.request.url;
  const c = await caches.open(RESIM);
  const kayitli = await c.match(anahtar);
  if (kayitli) {
    // Görseller değişmeyen dosyalardır: yeniden doğrulama yok (hata yanıtı sağlam kaydın üstüne yazılmasın)
    const m = await metaOku(anahtar);
    if (!m) e.waitUntil(metaYaz(anahtar, { boyut: tahminiBoyut(anahtar), erisim: Date.now(), zaman: Date.now() }));
    else if (Date.now() - m.erisim > 60 * 60 * 1000) e.waitUntil(metaYaz(anahtar, { ...m, erisim: Date.now() }));
    return kayitli;
  }
  const { y, saklanir } = await agdanTekrarli(anahtar);
  if (saklanir) {
    let boyut = tahminiBoyut(anahtar);
    if (y.type !== 'opaque') {
      const u = parseInt(y.headers.get('content-length') || '', 10);
      if (u > 0) boyut = u;
    }
    e.waitUntil(sakla(c, anahtar, y, boyut));
  }
  return y;
}

// İş 129: telefona indirilen en büyük kopyalar IndexedDB'de (atlas-devasa · g; js/devasaOnbellek.js ile aynı)
let depoSozu = null;
function depoAc() {
  depoSozu ||= new Promise((coz, reddet) => {
    const r = indexedDB.open('atlas-devasa', 1);
    r.onupgradeneeded = () => {
      if (!r.result.objectStoreNames.contains('g')) r.result.createObjectStore('g');
    };
    r.onerror = () => reddet(r.error);
    r.onblocked = () => reddet(new Error('kilitli'));
    r.onsuccess = () => {
      r.result.onversionchange = () => (r.result.close(), (depoSozu = null));
      r.result.onclose = () => (depoSozu = null);
      coz(r.result);
    };
  });
  depoSozu.catch(() => (depoSozu = null));
  return depoSozu;
}
function devasaDepodan(url) {
  return depoAc()
    .then(
      (db) =>
        new Promise((coz) => {
          try {
            const g = db.transaction('g', 'readonly').objectStore('g').get(url);
            g.onsuccess = () => coz(g.result || null);
            g.onerror = () => coz(null);
          } catch {
            depoSozu = null;
            coz(null);
          }
        }),
    )
    .then((v) => {
      if (!v) return null;
      const blob = v instanceof Blob ? v : v.b ? new Blob([v.b], { type: v.t || 'image/jpeg' }) : null;
      return blob && new Response(blob, { status: 200, headers: { 'Content-Type': blob.type || 'image/jpeg', 'Content-Length': String(blob.size) } });
    });
}

async function devasaResim(e) {
  const anahtar = e.request.url.split('?')[0];
  const kalici = await devasaDepodan(anahtar).catch(() => null);
  if (kalici) return kalici;
  const c = await caches.open(DEVASA);
  const kayitli = await c.match(anahtar);
  if (kayitli) return kayitli;
  const { y, saklanir } = await agdanTekrarli(anahtar);
  if (saklanir && y.type !== 'opaque') {
    const kopya = y.clone();
    e.waitUntil(
      (async () => {
        await c.put(anahtar, kopya);
        // anahtarlar ekleme sırasıyla: en eskiler silinir
        const hepsi = await c.keys();
        for (const r of hepsi.slice(0, Math.max(0, hepsi.length - DEVASA_EN_COK))) await c.delete(r);
      })().catch(() => {}),
    );
  }
  return y;
}

let budamaSuruyor = false;
// İş 135: budama bütün kayıtları ve anahtarları okur: her görselden sonra değil, en çok BUDAMA_ARALIGI'nda bir
// (sınır bu arada birkaç MB aşılabilir; yer dolarsa sakla() zorla budar)
const BUDAMA_ARALIGI = 30000;
let sonBudama = 0;
async function budama(zorla = false) {
  if (budamaSuruyor) return;
  if (!zorla && Date.now() - sonBudama < BUDAMA_ARALIGI) return;
  sonBudama = Date.now();
  budamaSuruyor = true;
  try {
    const c = await caches.open(RESIM);
    const meta = new Map((await metaHepsi()).map((m) => [m.url, m]));
    // Önbellek anahtarları esas alınır: meta kaydı olmayan (sahipsiz) girdiler en eski sayılır
    const hepsi = (await c.keys()).map((r) => meta.get(r.url) || { url: r.url, boyut: tahminiBoyut(r.url), erisim: 0 });
    let toplam = hepsi.reduce((t, m) => t + m.boyut, 0);
    if (!zorla && toplam <= RESIM_SINIRI) return;
    hepsi.sort((a, b) => a.erisim - b.erisim);
    const hedef = zorla ? Math.min(RESIM_HEDEF, toplam * 0.9) : RESIM_HEDEF;
    for (const m of hepsi) {
      if (toplam <= hedef) break;
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
    r.onsuccess = () => {
      const x = r.result;
      x.onclose = x.onversionchange = () => {
        try {
          x.close();
        } catch (err) {
          /* zaten kapalı */
        }
        db = null;
      };
      coz(x);
    };
    r.onerror = () => reddet(r.error);
  });
  db.catch(() => (db = null)); // bozuk bağlantı bir sonraki istekte yeniden açılır
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
        t.onabort = () => reddet(t.error || new Error('abort'));
      }),
  );
}
const metaOku = (url) => tx('readonly', (s) => s.get(url)).catch(() => null);
const metaYaz = (url, m) => tx('readwrite', (s) => s.put({ ...m, url })).catch(() => {});
const metaSil = (url) => tx('readwrite', (s) => s.delete(url)).catch(() => {});
const metaHepsi = () => tx('readonly', (s) => s.getAll()).catch(() => []);
