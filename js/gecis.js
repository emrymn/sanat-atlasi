// İş 70/75: iPhone tarzı ekran geçişleri ve uygulamanın kendi geri kaydırması.
//
// İş 75: sayfalar arası gezinme iPhone'un geçmişine yazılmaz (location.replace); geçmiş uygulamanın kendi yığınında
// (d.yigin). Sebep: uygulama tek sayfa, iPhone'un kenardan geri kaydırması "#…" adres değişimlerinde önceki sayfanın
// görüntüsünü tutmuyor: solda siyah, bırakınca sayfa sıfırdan çiziliyordu. Geçmişte geri kayıt olmayınca iPhone'un
// hareketi devreye girmez; kenardan kaydırmayı uygulama yakalar ve önceki sayfayı gerçek hâliyle altta gösterir.
//
// Sayfa belleği: ileri gidilince ayrılan sayfanın düğümleri (kopya değil, yerinden alınır; ucuz) kaydırma yeri ve
// renkleriyle saklanır. Geri dönünce (geri oku ya da kenardan kaydırma) sayfa yeniden çizilmez, bellekten konur:
// anında, kaldığı yerde, resimleri yüklenmiş.
//
// Geçişler (iOS gezinme denetleyicisi gibi): ileri gidince yeni sayfa sağdan gelir, eski sayfa altta sola çekilip
// kararır; geri dönünce ayrılan sayfa sağa çekilir, önceki altından aydınlanarak çıkar. Başyapıtlar ve Konular
// kartları büyüyerek açılır. Hareket azaltma açıksa geçiş yok (bellek ve kendi geri kaydırma yine çalışır).

const SURE = 420;
const EGRI = 'cubic-bezier(0.32, 0.72, 0, 1)';
const KART_SECICI = '.vitrin-kart, .konu-kart';
const KENAR = 24; // px: kenardan kaydırmanın başlayabildiği şerit
const BELLEK_EN_COK = 6;

let ortam = null; // { ekran, d, sekmeler } — app.js kurar
let bekleyenYon = null; // gezin() bırakır, yönlendirici alır
let bekleyen = null; // { yon } — yönlendirici bırakır, ciz() tüketir
let kart = null; // { el, zaman } — dokunulan kart
const bellek = new Map(); // adres → { dugumler, y, stil, nesil }
// İlerleme her kaydedildiğinde (cevap, ayar, işlendi…) bellekteki sayfalar eskir: yerine konmaz, yeniden çizilir
// (sayıları güncel olsun); kaydırma sırasında altta önizleme olarak yine gösterilir.
let nesil = 0;
export function bellekEskit() {
  nesil++;
}
// Kendi gözcüleri ve kaydırma dinleyicileri olan sayfalar bellekten konmaz (gözcüler sayfa ayrılınca kapanıyor)
const YENIDEN_CIZ = /^#\/harita$/;
const sekmeKoku = (adres) => !!ortam && ortam.sekmeler.some((a) => ayni(a, adres));
function bellekBul(adres) {
  for (const [a, s] of bellek) if (ayni(a, adres)) return s;
  return null;
}

// Hareket azaltma açıksa geçiş yok. Otomatik testlerde de yok (navigator.webdriver); geçişleri sınayan testler
// window.__atlasGecis = true ile açar.
export const hareketAz = () =>
  (typeof navigator !== 'undefined' && navigator.webdriver && !(typeof window !== 'undefined' && window.__atlasGecis)) ||
  (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);

if (typeof document !== 'undefined') {
  document.addEventListener(
    'pointerdown',
    (e) => {
      const k = e.target.closest && e.target.closest(KART_SECICI);
      kart = k ? { el: k, zaman: Date.now(), r: k.getBoundingClientRect() } : null;
    },
    true,
  );
}

// ---------- Gezinme ----------
const simdiki = () => location.hash || '#/';
const ayni = (a, b) => a === b || ((a === '#/' || a === '#' || a === '') && (b === '#/' || b === '#' || b === ''));

// yon: 'ileri' (yeni sayfa), 'geri' (geri oku), 'kaydirma' (kenardan kaydırma bitti), 'sekme' (sekme çubuğu)
export function gezin(href, yon = 'ileri') {
  if (!href || ayni(href, simdiki())) return false;
  bekleyenYon = yon;
  location.replace(href);
  return true;
}
export function yonAl() {
  const y = bekleyenYon;
  bekleyenYon = null;
  return y;
}

// yönlendirici her adres değişiminde çağırır
export function gecisBildir({ yon, ilk }) {
  bekleyen = null;
  if (ilk || yon === 'sekme' || yon === 'kaydirma' || hareketAz()) return;
  bekleyen = { yon: yon === 'geri' ? 'geri' : 'ileri' };
}

// ---------- Sayfa belleği ----------
// ciz() yeni adresin içeriğini koymadan önce ayrılan sayfayı alır (düğümler yerinden çıkarılır)
export function sayfayiAyir(ekran, adres) {
  if (!adres || !ekran.firstChild) return null;
  const s = { adres, dugumler: [...ekran.childNodes], y: window.scrollY, stil: document.documentElement.getAttribute('style') || '' };
  for (const n of s.dugumler) n.remove();
  return s;
}
function bellegeKoy(s) {
  if (!s) return;
  s.nesil = nesil;
  bellek.delete(s.adres);
  bellek.set(s.adres, s);
  // sekmelerin ana sayfaları (sayfalama için) ve yığındaki (geri dönülebilecek) sayfalar; ikincilerden en çok BELLEK_EN_COK
  const yigin = ortam ? new Set(ortam.d.yigin) : null;
  for (const a of [...bellek.keys()]) if (yigin && !yigin.has(a) && !sekmeKoku(a)) bellek.delete(a);
  const digerleri = [...bellek.keys()].filter((a) => !sekmeKoku(a));
  while (digerleri.length > BELLEK_EN_COK) bellek.delete(digerleri.shift());
}
export const bellegeAl = bellegeKoy;
// Ayrılıp yeniden belgeye konan düğümlerde tarayıcı CSS giriş animasyonlarını (kartların, resimlerin belirmesi)
// baştan oynatır: önceki sayfa altta bir an boş (siyah) görünür, geri dönünce "baştan yükleniyor" gibi olurdu.
// Sayfa zaten görülmüş: animasyonlar sonlarına atlatılır (sonsuz dönenler kendi hâlinde kalır).
function animasyonlariBitir(kok) {
  if (!kok.getAnimations) return;
  for (const a of kok.getAnimations({ subtree: true })) {
    if (typeof CSSAnimation !== 'undefined' && !(a instanceof CSSAnimation)) continue;
    try {
      a.finish();
    } catch {
      /* sonsuz animasyon */
    }
  }
}
export function bellekte(adres) {
  return bellek.has(adres);
}
// geri dönüşte bellekteki sayfa yerine konur; döndürür: { y } ya da null
export function bellektenKoy(adres, ekran) {
  const s = bellek.get(adres);
  if (!s || s.nesil !== nesil || YENIDEN_CIZ.test(adres)) return null;
  bellek.delete(adres);
  ekran.replaceChildren(...s.dugumler);
  animasyonlariBitir(ekran);
  if (s.stil) document.documentElement.setAttribute('style', s.stil);
  else document.documentElement.removeAttribute('style');
  return s;
}

// ciz() yeni içeriği koymadan hemen önce çağırır (eski: ayrılan sayfa); dönen işlev içerik konduktan sonra çağrılır
export function gecisHazirla(ekran, eski) {
  const g = bekleyen;
  bekleyen = null;
  // (ayrılan sayfa belgeden çıkarıldı: kart onun düğümleri arasında aranır, yeri dokunuş anında alındı)
  const kk =
    g && g.yon === 'ileri' && eski && kart && Date.now() - kart.zaman < 1500 && kart.el.getAttribute('href') === simdiki() && eski.dugumler.some((n) => n.contains && n.contains(kart.el))
      ? kart
      : null;
  kart = null;
  if (!g || !eski) {
    // geçiş yok: ileri gidişte ayrılan sayfa belleğe
    if (eski && (!g || g.yon !== 'geri')) bellegeKoy(eski);
    return null;
  }
  if (g.yon === 'geri') return geriGecis(ekran, eski);
  if (kk) return kartBuyut(ekran, kk.el, kk.r, eski);
  return ileriGecis(ekran, eski);
}
// geri dönüşte (bellekten) ayrılan sayfa: geri okuyla geçişli, kaydırmada geçişsiz
export function geriGecisi(ekran, eski, yon) {
  if (!eski || yon !== 'geri' || hareketAz()) return null;
  return geriGecis(ekran, eski);
}

// sekme çubuğundan bellekteki sayfaya geçiş: sayfa geldiği yönden hafifçe kayarak belirir
export function sekmeGecisi(ekran) {
  if (hareketAz()) return;
  const y = ekran.dataset.yon === 'sag' ? 1 : ekran.dataset.yon === 'sol' ? -1 : 0;
  ekran.animate([{ opacity: 0.35, transform: `translateX(${y * 28}px)` }, { opacity: 1, transform: 'none' }], { duration: 260, easing: EGRI });
}

// ayrılan / önceki sayfanın ekrandaki görüntüsü: düğümler sabit bir katmana konur, kaydırma yerinde
function katman(s, ust = false) {
  const k = document.createElement('div');
  // sayfanın kendi renkleri (günün sanatçısının renkleri html'in değişkenlerinde)
  if (s.stil) k.setAttribute('style', s.stil);
  k.className = `sayfa-katman${ust ? ' ust' : ''}`;
  k.setAttribute('aria-hidden', 'true');
  k.inert = true;
  const ic = document.createElement('main');
  ic.className = 'sayfa-katman-ic';
  ic.dataset.hareket = '';
  ic.append(...s.dugumler);
  ic.style.transform = `translateY(${-s.y}px)`;
  // sayfanın düzeni (#uygulama'nın kenar boşlukları ve genişliği) aynen
  const cs = getComputedStyle(ortam.ekran);
  Object.assign(ic.style, { padding: cs.padding, maxWidth: cs.maxWidth, minHeight: cs.minHeight });
  k.appendChild(ic);
  ortam.ekran.after(k);
  animasyonlariBitir(ic);
  return { k, ic, geriAl: () => (s.dugumler = [...ic.childNodes]) };
}

function suruyor(acik) {
  document.documentElement.classList.toggle('gecis-suruyor', acik);
}

function ileriGecis(ekran, eski) {
  return () => {
    const { k, ic, geriAl } = katman(eski);
    suruyor(true);
    ekran.classList.add('gecis-on');
    const ayar = { duration: SURE, easing: EGRI };
    k.animate([{ transform: 'none', filter: 'brightness(1)' }, { transform: 'translateX(-30%)', filter: 'brightness(0.72)' }], { ...ayar, fill: 'forwards' });
    const a = ekran.animate([{ transform: 'translateX(100%)' }, { transform: 'none' }], ayar);
    const bitir = () => {
      geriAl();
      k.remove();
      ic.remove();
      ekran.classList.remove('gecis-on');
      suruyor(false);
      bellegeKoy(eski);
    };
    a.finished.then(bitir, bitir);
  };
}

function geriGecis(ekran, eski) {
  return () => {
    const { k } = katman(eski, true);
    suruyor(true);
    const ayar = { duration: SURE - 40, easing: EGRI };
    k.animate([{ transform: 'none' }, { transform: 'translateX(100%)' }], { ...ayar, fill: 'forwards' });
    const a = ekran.animate([{ transform: 'translateX(-30%)', filter: 'brightness(0.72)' }, { transform: 'none', filter: 'brightness(1)' }], ayar);
    const bitir = () => {
      k.remove();
      suruyor(false);
    };
    a.finished.then(bitir, bitir);
  };
}

function kartBuyut(ekran, kartEl, r, eski) {
  const c = kartEl.cloneNode(true);
  c.setAttribute('aria-hidden', 'true');
  c.inert = true;
  c.classList.add('gecis-kopya', 'gecis-kart');
  for (const x of c.querySelectorAll('[id]')) x.removeAttribute('id');
  Object.assign(c.style, { top: `${r.top}px`, left: `${r.left}px`, width: `${r.width}px`, height: `${r.height}px`, margin: '0' });
  kartEl.style.visibility = 'hidden';
  return () => {
    const { k, ic, geriAl } = katman(eski);
    document.body.appendChild(c);
    suruyor(true);
    const W = innerWidth;
    const H = innerHeight;
    const ayar = { duration: 640, easing: EGRI, fill: 'both' };
    const olcek = `translate(${-r.left}px, ${-r.top}px) scale(${W / r.width}, ${H / r.height})`;
    c.style.transformOrigin = '0 0';
    c.animate(
      [
        { transform: 'none', opacity: 1, borderRadius: '14px' },
        { transform: olcek, opacity: 0.85, offset: 0.6 },
        { transform: olcek, opacity: 0, borderRadius: '0px' },
      ],
      ayar,
    );
    ekran.classList.add('gecis-on');
    const a = ekran.animate(
      [
        { opacity: 0, transform: 'scale(0.94)' },
        { opacity: 0, transform: 'scale(0.94)', offset: 0.35 },
        { opacity: 1, transform: 'none' },
      ],
      ayar,
    );
    const bitir = () => {
      c.remove();
      a.cancel();
      kartEl.style.visibility = '';
      geriAl();
      k.remove();
      ic.remove();
      ekran.classList.remove('gecis-on');
      suruyor(false);
      bellegeKoy(eski);
    };
    a.finished.then(bitir, bitir);
  };
}

let kaydirmaBekleyen = null;
// sekmeler arası kaydırmada gelen sayfanın önizlemesi (bellekten) gösterildi mi: gösterildiyse yeniden çizilen sayfa
// öğeleri sırayla belirmeden konur (önizlemenin yerine geçer), gösterilmediyse (boş sayfa) sırayla belirir
let onizlemeli = false;
export function onizlemeAl() {
  const o = onizlemeli;
  onizlemeli = false;
  return o;
}
// kenardan kaydırma bittikten sonra önceki sayfa yerine konunca çağrılır
export function kaydirmaSonu() {
  const f = kaydirmaBekleyen;
  kaydirmaBekleyen = null;
  if (f) f();
}

// ---------- Kurulum: bağlantılar ve kenardan kaydırma ----------
export function gecisKur({ ekran, d, sekmeler = [] }) {
  ortam = { ekran, d, sekmeler };
  if (typeof document === 'undefined') return;

  // Uygulama içi bağlantılar iPhone'un geçmişine yazılmadan (location.replace) açılır. Tıklamayı önleyen kendi
  // işleyicisi olan öğeler (defaultPrevented) dokunulmaz; yeni sekmede açma ve değiştirici tuşlar tarayıcıya kalır.
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.target || a.hasAttribute('download')) return;
    e.preventDefault();
    gezin(a.getAttribute('href'), a.closest('#sekmeler') ? 'sekme' : 'ileri');
  });

  // Kenardan geri kaydırma: önceki sayfa altta gerçek hâliyle görünür, şimdiki sayfa parmağı izler. Görüntüleyici
  // açıksa o kaydırılarak kapanır (altındaki sayfa görünür).
  let k = null;
  const W = () => window.innerWidth;
  document.addEventListener(
    'touchstart',
    (e) => {
      k = null;
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      if (t.clientX > KENAR) return;
      const gor = document.querySelector('.gor');
      if (gor && typeof gor.kapat !== 'function') return;
      if (!gor && d.yigin.length < 2) return;
      k = { x: t.clientX, y: t.clientY, gor, basladi: false, izler: [] };
    },
    { passive: true, capture: true },
  );
  document.addEventListener(
    'touchmove',
    (e) => {
      if (!k) return;
      const t = e.touches[0];
      const dx = t.clientX - k.x;
      const dy = t.clientY - k.y;
      if (!k.basladi) {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
          k = null;
          return;
        }
        // yatay ağırlıklı ilk kıpırtıda tarayıcı kaydırmayı üstlenmesin (sonra iptal edilemiyor)
        if (dx < 8) {
          if (Math.abs(dx) >= 4 && Math.abs(dx) > Math.abs(dy) && e.cancelable) e.preventDefault();
          return;
        }
        k.basladi = true;
        kaydirmaBaslat(k);
      }
      e.preventDefault();
      k.dx = Math.max(0, dx);
      k.izler.push([performance.now(), k.dx]);
      if (k.izler.length > 6) k.izler.shift();
      kaydirmaIlerlet(k);
    },
    { passive: false, capture: true },
  );
  const bitir = () => {
    const x = k;
    k = null;
    if (!x || !x.basladi) return;
    const [a, b] = [x.izler[0], x.izler[x.izler.length - 1]];
    const hiz = a && b && b[0] > a[0] ? (b[1] - a[1]) / (b[0] - a[0]) : 0;
    kaydirmaBitir(x, x.dx > W() * 0.33 || (hiz > 0.35 && x.dx > 20));
  };
  document.addEventListener('touchend', bitir, { capture: true });
  document.addEventListener('touchcancel', bitir, { capture: true });

  // Sekmelerin ana sayfaları arasında yatay kaydırma (sayfalama): ana sayfalarda geri yok; parmakla sola kaydırınca
  // sağdaki sekme, sağa kaydırınca soldaki gelir. Komşu sayfa yanında gerçek hâliyle (bellekten) görünür; daha önce
  // açılmadıysa boş sayfa gelir, bırakınca içerik belirir. Yatay kayan şeritlerde, yazı alanlarında, açık pencerede
  // ve sekme çubuğunda başlamaz.
  let s = null;
  const SAYFALAMA_YOK = 'input, textarea, select, [contenteditable], #sekmeler, .gor, [data-sayfalama-yok]';
  const yatayKayar = (el) => {
    for (; el && el.nodeType === 1 && el !== document.body; el = el.parentElement) {
      if (el.scrollWidth > el.clientWidth + 1 && /auto|scroll/.test(getComputedStyle(el).overflowX)) return true;
    }
    return false;
  };
  document.addEventListener(
    'touchstart',
    (e) => {
      s = null;
      if (k || e.touches.length !== 1) return;
      const i = ortam.sekmeler.findIndex((a) => ayni(a, simdiki()));
      if (i < 0 || document.querySelector('.gor, .harita-pencere:not([hidden])')) return;
      const h = e.target;
      if (!h || !h.closest || h.closest(SAYFALAMA_YOK) || yatayKayar(h)) return;
      const t = e.touches[0];
      s = { x: t.clientX, y: t.clientY, i, basladi: false, izler: [] };
    },
    { passive: true, capture: true },
  );
  document.addEventListener(
    'touchmove',
    (e) => {
      if (!s) return;
      const t = e.touches[0];
      const dx = t.clientX - s.x;
      const dy = t.clientY - s.y;
      if (!s.basladi) {
        // dikey kaydırma başladıysa (ya da dikey ağırlıklıysa) sayfalama yok
        if (!e.cancelable || (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx))) {
          s = null;
          return;
        }
        if (Math.abs(dx) < 12 || Math.abs(dx) < Math.abs(dy) * 1.3) {
          // yatay ağırlıklı ilk kıpırtıda tarayıcı kaydırmayı üstlenmesin (sonra iptal edilemiyor)
          if (Math.abs(dx) >= 4 && Math.abs(dx) > Math.abs(dy)) e.preventDefault();
          return;
        }
        s.basladi = true;
        s.x = t.clientX - Math.sign(dx) * 4; // eşik atlaması olmasın
        sayfalaBaslat(s);
      }
      e.preventDefault();
      s.dx = t.clientX - s.x;
      s.izler.push([performance.now(), s.dx]);
      if (s.izler.length > 6) s.izler.shift();
      sayfalaIlerlet(s);
    },
    { passive: false, capture: true },
  );
  const sayfalaBirak = () => {
    const x = s;
    s = null;
    if (!x || !x.basladi) return;
    const [a, b] = [x.izler[0], x.izler[x.izler.length - 1]];
    const hiz = a && b && b[0] > a[0] ? (b[1] - a[1]) / (b[0] - a[0]) : 0;
    const e = etkin(x);
    const yon = e < 0 ? 1 : -1; // 1: sağdaki sekme, -1: soldaki
    const komsu = yon === 1 ? x.sag : x.sol;
    const tamam = !!komsu && (Math.abs(e) > W() * 0.3 || (Math.abs(hiz) > 0.35 && Math.sign(hiz) === -yon && Math.abs(e) > 20));
    sayfalaBitir(x, tamam, yon);
  };
  document.addEventListener('touchend', sayfalaBirak, { capture: true });
  document.addEventListener('touchcancel', sayfalaBirak, { capture: true });

  const nav = () => document.getElementById('sekmeler');
  // komşu yoksa (ilk ya da son sekme) lastik gibi az gelir
  const etkin = (x) => (x.dx > 0 && !x.sol) || (x.dx < 0 && !x.sag) ? x.dx * 0.25 : x.dx;
  function komsuKatman(j) {
    const adres = ortam.sekmeler[j];
    if (!adres) return null;
    const b = bellekBul(adres);
    if (b) return { ...katman(b), adres, onizleme: true };
    const k = document.createElement('div');
    k.className = 'sayfa-katman';
    k.setAttribute('aria-hidden', 'true');
    ekran.after(k);
    return { k, geriAl: () => {}, adres, onizleme: false };
  }
  function sayfalaBaslat(x) {
    suruyor(true);
    x.sol = komsuKatman(x.i - 1);
    x.sag = komsuKatman(x.i + 1);
    ekran.classList.add('gecis-on', 'kaydiriliyor', 'sayfalaniyor');
    const n = nav();
    if (n) n.classList.add('suruklen');
  }
  function sayfalaIlerlet(x) {
    const e = etkin(x);
    ekran.style.transform = `translateX(${e}px)`;
    if (x.sol) x.sol.k.style.transform = `translateX(${e - W()}px)`;
    if (x.sag) x.sag.k.style.transform = `translateX(${e + W()}px)`;
    const n = nav();
    if (n) n.style.setProperty('--surukle', Math.max(0, Math.min(ortam.sekmeler.length - 1, x.i - e / W())).toFixed(3));
  }
  function sayfalaBitir(x, tamam, yon) {
    const e = etkin(x);
    const hedef = tamam ? -yon * W() : 0;
    const sure = Math.max(160, Math.min(380, Math.abs(hedef - e) * 0.9));
    const ayar = { duration: sure, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'forwards' };
    const animler = [ekran.animate([{ transform: `translateX(${e}px)` }, { transform: `translateX(${hedef}px)` }], ayar)];
    if (x.sol) animler.push(x.sol.k.animate([{ transform: `translateX(${e - W()}px)` }, { transform: `translateX(${hedef - W()}px)` }], ayar));
    if (x.sag) animler.push(x.sag.k.animate([{ transform: `translateX(${e + W()}px)` }, { transform: `translateX(${hedef + W()}px)` }], ayar));
    const n = nav();
    if (n) n.style.setProperty('--surukle', String(tamam ? x.i + yon : x.i));
    const temizle = () => {
      for (const l of [x.sol, x.sag]) {
        if (!l) continue;
        l.geriAl();
        l.k.remove();
      }
      for (const a of animler) a.cancel();
      ekran.style.transform = '';
      ekran.classList.remove('gecis-on', 'kaydiriliyor', 'sayfalaniyor');
      if (n) {
        n.classList.remove('suruklen');
        n.style.removeProperty('--surukle');
      }
      suruyor(false);
    };
    const son = () => {
      if (!tamam) return temizle();
      // yeni sekme yerine konunca (bellekten ya da çizilince) temizlenir; arada eski sayfa bir an bile görünmesin
      const komsu = yon === 1 ? x.sag : x.sol;
      kaydirmaBekleyen = temizle;
      onizlemeli = komsu.onizleme;
      if (!gezin(komsu.adres, 'sayfa')) kaydirmaSonu();
      else setTimeout(kaydirmaSonu, 4000);
    };
    animler[0].finished.then(son, son);
  }

  function kaydirmaBaslat(x) {
    suruyor(true);
    if (x.gor) {
      x.gor.classList.add('kaydiriliyor');
      return;
    }
    const onceki = d.yigin[d.yigin.length - 2];
    const s = bellek.get(onceki);
    x.onceki = onceki;
    x.s = s;
    x.katman = s ? katman(s) : null;
    ekran.classList.add('gecis-on', 'kaydiriliyor');
  }
  function kaydirmaIlerlet(x) {
    const p = Math.min(1, x.dx / W());
    if (x.gor) {
      x.gor.style.transform = `translateX(${x.dx}px)`;
      return;
    }
    ekran.style.transform = `translateX(${x.dx}px)`;
    if (x.katman) {
      x.katman.k.style.transform = `translateX(${-30 * (1 - p)}%)`;
      x.katman.k.style.filter = `brightness(${0.72 + 0.28 * p})`;
    }
  }
  function kaydirmaBitir(x, tamam) {
    const el = x.gor || ekran;
    const kalan = tamam ? W() - x.dx : x.dx;
    const sure = Math.max(120, Math.min(360, kalan * 0.9));
    const hedef = tamam ? W() : 0;
    const a = el.animate([{ transform: `translateX(${x.dx}px)` }, { transform: `translateX(${hedef}px)` }], { duration: sure, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'forwards' });
    if (x.katman) {
      const p = x.dx / W();
      x.katman.k.animate(
        [
          { transform: `translateX(${-30 * (1 - p)}%)`, filter: `brightness(${0.72 + 0.28 * p})` },
          { transform: tamam ? 'none' : 'translateX(-30%)', filter: `brightness(${tamam ? 1 : 0.72})` },
        ],
        { duration: sure, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'forwards' },
      );
    }
    const son = () => {
      if (x.gor) {
        x.gor.classList.remove('kaydiriliyor');
        if (tamam) x.gor.kapat({ gecissiz: true });
        else {
          a.cancel();
          x.gor.style.transform = '';
        }
        suruyor(false);
        return;
      }
      const temizle = () => {
        if (x.katman) {
          x.katman.geriAl();
          x.katman.k.remove();
        }
        ekran.style.transform = '';
        a.cancel();
        ekran.classList.remove('gecis-on', 'kaydiriliyor');
        suruyor(false);
      };
      // tamamlandı: sayfa kaydırılmış, önceki sayfa altta görünür kalır; yönlendirici önceki sayfayı (bellekten)
      // yerine koyunca temizlenir (arada şimdiki sayfa bir an bile görünmesin)
      if (tamam) {
        kaydirmaBekleyen = temizle;
        if (!gezin(x.onceki, 'kaydirma')) kaydirmaSonu();
        else setTimeout(kaydirmaSonu, 1500); // yönlendirici bir sebeple çizmezse sayfa kaymış kalmasın
      } else temizle();
    };
    a.finished.then(son, son);
  }
}
