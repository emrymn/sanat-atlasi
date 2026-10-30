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
// İş 86c/87: büyüyerek açılışın süresi ve eğrisi. Yay eğrisi (950 ms) de iPhone'da "çok hızlı" göründü: genişlemenin
// yarısı ilk 270 ms'de bitiyordu. Yavaş başlayıp yumuşakça yerine oturan eğri: hareketin ortası ~500 ms'de,
// büyüme baştan sona izlenir.
const ACILIS = 1250;
const ACILIS_EGRI = 'cubic-bezier(0.5, 0, 0.2, 1)';
const KART_SECICI = '.vitrin-kart, .konu-kart';
const KENAR = 24; // px: kenardan kaydırmanın başlayabildiği şerit
const BELLEK_EN_COK = 6;
// açıkça yatay kıpırtı (dikeye yakın kıpırtılar sayfanın kendi kaydırmasına kalır)
const yatayKipirti = (dx, dy) => Math.abs(dx) >= 6 && Math.abs(dx) > 2 * Math.abs(dy);
// parmak kalkarkenki hız (px/ms): yalnız son 100 ms'deki hareket; parmak durup bekledikten sonra kalkarsa 0
// (yoksa durmadan önceki hız sayılıyor, kısa kaydırma bile sayfayı geçiriyordu)
function birakmaHizi(izler) {
  const simdi = performance.now();
  const son = izler.filter(([t]) => simdi - t <= 100);
  if (son.length < 2) return 0;
  const [a, b] = [son[0], son[son.length - 1]];
  return b[0] > a[0] ? (b[1] - a[1]) / (b[0] - a[0]) : 0;
}

let ortam = null; // { ekran, d, sekmeler } — app.js kurar
let bekleyenYon = null; // gezin() bırakır, yönlendirici alır
let bekleyen = null; // { yon } — yönlendirici bırakır, ciz() tüketir
let kart = null; // { el, zaman } — dokunulan kart
let dokunus = null; // { zaman, x, y, g } — son dokunulan öğenin ortası (İş 86)
const kokenler = new Map(); // adres → { x, y }: sayfanın büyüyerek açıldığı yer (geri dönüşte oraya küçülür)
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
      // İş 86: yeni sayfa dokunulan öğenin yerinden büyüyerek açılır: öğenin ortası (yoksa dokunulan nokta)
      const o = e.target.closest && e.target.closest('a, button, [role="button"], .eser, label');
      const r = o && o.getBoundingClientRect();
      // İş 86e: öğenin kutusu ve köşe yuvarlaklığı da: sayfa o şekilden açılır, o şekle kapanır
      const kutu = r && r.width >= 24 && r.height >= 16 ? { x: r.left, y: r.top, w: r.width, h: r.height, yc: Math.min(28, parseFloat(getComputedStyle(o).borderTopLeftRadius) || 12) } : null;
      dokunus = { zaman: Date.now(), x: r ? r.left + r.width / 2 : e.clientX, y: r ? r.top + r.height / 2 : e.clientY, g: r ? r.width : 0, kutu };
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
  // sekmelerin ana sayfaları (sekme çubuğuyla dönülünce kaldığı yerde) ve yığındaki (geri dönülebilecek) sayfalar; ikincilerden en çok BELLEK_EN_COK
  const yigin = ortam ? new Set(ortam.d.yigin) : null;
  for (const a of [...bellek.keys()]) if (yigin && !yigin.has(a) && !sekmeKoku(a)) bellek.delete(a);
  const digerleri = [...bellek.keys()].filter((a) => !sekmeKoku(a));
  while (digerleri.length > BELLEK_EN_COK) bellek.delete(digerleri.shift());
}
export const bellegeAl = bellegeKoy;
// Ayrılıp yeniden belgeye konan düğümlerde tarayıcı CSS giriş animasyonlarını (kartların, resimlerin belirmesi)
// baştan oynatır: önceki sayfa altta bir an boş (siyah) görünür, geri dönünce "baştan yükleniyor" gibi olurdu.
// Sayfa zaten görülmüş: animasyonlar sonlarına atlatılır (sonsuz dönenler kendi hâlinde kalır).
// İş 77: kaydırmaya bağlı animasyonlara (animation-timeline: scroll()/view(); Tuval'de adın ve yazıların kaydırdıkça
// solması) dokunulmaz: sonlarına atlatılınca yazılar solmuş kalıyordu. Yalnız zamana bağlı giriş animasyonları.
function animasyonlariBitir(kok) {
  if (!kok.getAnimations) return;
  for (const a of kok.getAnimations({ subtree: true })) {
    if (typeof CSSAnimation !== 'undefined' && !(a instanceof CSSAnimation)) continue;
    if (a.timeline && typeof document !== 'undefined' && a.timeline !== document.timeline) continue;
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
  if (kk) {
    kokenler.set(simdiki(), { x: kk.r.left + kk.r.width / 2, y: kk.r.top + kk.r.height / 2, kutu: { x: kk.r.left, y: kk.r.top, w: kk.r.width, h: kk.r.height, yc: 14 } });
    return kartBuyut(ekran, kk.el, kk.r, eski);
  }
  // İş 86: yandan kaymak yerine dokunulan yerden büyüyerek (dokunuş yoksa ekranın ortasından)
  const n = dokunus && Date.now() - dokunus.zaman < 1500 ? dokunus : { x: innerWidth / 2, y: innerHeight / 2, g: 0 };
  dokunus = null;
  kokenler.set(simdiki(), { x: n.x, y: n.y, kutu: n.kutu || null });
  return n.kutu ? sekilGecis(ekran, eski, n) : buyumeGecis(ekran, eski, n);
}
// geri dönüşte (bellekten) ayrılan sayfa: geri okuyla geçişli, kaydırmada geçişsiz
export function geriGecisi(ekran, eski, yon) {
  if (!eski || yon !== 'geri' || hareketAz()) return null;
  return geriGecis(ekran, eski);
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
  // sayfanın düzeni (#uygulama'nın kenar boşlukları ve genişliği) aynen
  const cs = getComputedStyle(ortam.ekran);
  Object.assign(ic.style, { padding: cs.padding, maxWidth: cs.maxWidth, minHeight: cs.minHeight });
  // İş 87: karartma filtre değil üstte siyah bir perde (opaklık): iPhone büyük katmanda filtreyi her karede yeniden
  // boyuyor (takılma) ve kimi zaman katmanı hiç göstermiyordu
  const perde = document.createElement('div');
  perde.className = 'katman-perde';
  // İş 87: katmanın içi sayfanın kaldığı yere kendisi kaydırılır (içerik ötelenmez): kaydırmaya bağlı animasyonlar
  // (view(): listeler, hikâye) katmanda da sayfadaki gibi görünür; içerik yetmezse kalan kısım ötelenir
  const kay = document.createElement('div');
  kay.className = 'sayfa-katman-kay';
  kay.append(ic);
  k.append(kay, perde);
  ortam.ekran.after(k);
  kay.scrollTop = s.y;
  const kalan = s.y - kay.scrollTop;
  if (kalan > 0) ic.style.transform = `translateY(${-kalan}px)`;
  animasyonlariBitir(ic);
  return { k, ic, perde, geriAl: () => (s.dugumler = [...ic.childNodes]) };
}
// alttaki sayfanın kararması (0: hiç, 1: tam siyah)
const karart = (x) => ({ opacity: x });

function suruyor(acik) {
  document.documentElement.classList.toggle('gecis-suruyor', acik);
}

// İş 86: yeni sayfa dokunulan yerden büyüyerek gelir (iPhone'da uygulama açılır gibi); alttaki sayfa hafifçe
// küçülüp kararır. Yalnız transform ve opaklık: ekran kartı işler, her karede boyama yok.
// İş 86e: kutu (ekran koordinatları) → öğenin kendi koordinatlarında clip-path inset (yuvarlak köşeli). r: öğenin kutusu.
function kirpma(k, r, yc) {
  return `inset(${k.y - r.top}px ${r.right - (k.x + k.w)}px ${r.bottom - (k.y + k.h)}px ${k.x - r.left}px round ${yc}px)`;
}
const ekranKutusu = () => ({ x: 0, y: 0, w: innerWidth, h: innerHeight });
// iki kutu arasında (t: 0–1)
const araKutu = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t, h: a.h + (b.h - a.h) * t });

// İş 86e: sayfa dokunulan öğenin şeklinden açılır: görünen pencere öğenin kutusundan (köşeleri onunkiler gibi) ekranın
// kenarlarına genişler, içerik o pencerede belirir; alttaki sayfada öğe yerinde kalır (pencere tam onun üstünden çıkar).
function sekilGecis(ekran, eski, n) {
  return () => {
    const { k, ic, perde, geriAl } = katman(eski);
    suruyor(true);
    ekran.classList.add('gecis-on', 'buyuyor', 'sekilli');
    const r = ekran.getBoundingClientRect();
    k.style.transformOrigin = `${n.x}px ${n.y}px`;
    // İş 87: 950 ms yay eğrisi iPhone'da yine hızlı göründü (genişlemenin çoğu ilk çeyrekte bitiyordu): daha uzun ve
    // yumuşak başlayıp yumuşak biten eğri; pencere öğenin içinden yavaşça belirir
    const ayar = { duration: ACILIS, easing: ACILIS_EGRI };
    k.animate([{ transform: 'none' }, { transform: 'scale(0.95)' }], { ...ayar, fill: 'forwards' });
    perde.animate([karart(0), karart(0.45)], { ...ayar, fill: 'forwards' });
    const a = ekran.animate(
      [
        { clipPath: kirpma(n.kutu, r, n.kutu.yc), opacity: 0 },
        { opacity: 1, offset: 0.25 },
        { clipPath: kirpma(ekranKutusu(), r, 0), opacity: 1 },
      ],
      ayar,
    );
    let bitti = false;
    const bitir = () => {
      if (bitti) return;
      bitti = true;
      if (suren === bitir) suren = null;
      a.cancel();
      geriAl();
      k.remove();
      ic.remove();
      ekran.classList.remove('gecis-on', 'buyuyor', 'sekilli');
      suruyor(false);
      bellegeKoy(eski);
    };
    suren = bitir;
    a.finished.then(bitir, bitir);
  };
}

function buyumeGecis(ekran, eski, n) {
  return () => {
    const { k, ic, perde, geriAl } = katman(eski);
    suruyor(true);
    ekran.classList.add('gecis-on', 'buyuyor');
    const r = ekran.getBoundingClientRect();
    ekran.style.transformOrigin = `${n.x - r.left}px ${n.y - r.top}px`;
    k.style.transformOrigin = `${n.x}px ${n.y}px`;
    const bas = Math.min(0.6, Math.max(0.12, (n.g || 0) / innerWidth));
    const ayar = { duration: ACILIS, easing: ACILIS_EGRI }; // İş 86b/c, 87: 480 → 780 → 950 ms yetmedi
    k.animate([{ transform: 'none' }, { transform: 'scale(0.94)' }], { ...ayar, fill: 'forwards' });
    perde.animate([karart(0), karart(0.45)], { ...ayar, fill: 'forwards' });
    const a = ekran.animate(
      [
        { transform: `scale(${bas})`, opacity: 0, borderRadius: '28px' },
        { opacity: 1, offset: 0.2 }, // küçük hâli erkenden görünür: büyüme baştan izlenir
        { transform: 'none', opacity: 1, borderRadius: '0px' },
      ],
      ayar,
    );
    let bitti = false;
    const bitir = () => {
      if (bitti) return;
      bitti = true;
      if (suren === bitir) suren = null;
      a.cancel();
      geriAl();
      k.remove();
      ic.remove();
      ekran.classList.remove('gecis-on', 'buyuyor');
      ekran.style.transformOrigin = '';
      suruyor(false);
      bellegeKoy(eski);
    };
    suren = bitir;
    a.finished.then(bitir, bitir);
  };
}

// İş 87: geri dönüşte alttaki (önceki) sayfanın karartması: sayfanın üstünde, ayrılan katmanın altında sabit perde
function ustPerde() {
  const p = document.createElement('div');
  p.className = 'katman-perde sabit';
  p.setAttribute('aria-hidden', 'true');
  ortam.ekran.after(p);
  return p;
}

function geriGecis(ekran, eski) {
  return () => {
    const { k } = katman(eski, true);
    const perde = ustPerde();
    suruyor(true);
    const bitir = () => {
      k.remove();
      perde.remove();
      ekran.style.transformOrigin = '';
      suruyor(false);
    };
    // İş 86: büyüyerek açılan sayfa geldiği yere küçülerek kapanır; önceki sayfa yerine oturur
    const koken = kokenler.get(eski.adres);
    // İş 86e: geldiği öğenin şekline daralıp onun içine söner (altında gerçek öğe görünür)
    if (koken && koken.kutu) {
      kokenler.delete(eski.adres);
      k.classList.add('kuculuyor', 'sekilli');
      const ayar = { duration: 760, easing: 'cubic-bezier(0.32, 0.5, 0.2, 1)' };
      const kr = { top: 0, left: 0, right: innerWidth, bottom: innerHeight };
      k.animate(
        [
          { clipPath: kirpma(ekranKutusu(), kr, 0), opacity: 1 },
          { opacity: 1, offset: 0.7 },
          { clipPath: kirpma(koken.kutu, kr, koken.kutu.yc), opacity: 0 },
        ],
        { ...ayar, fill: 'forwards' },
      );
      ekran.style.transformOrigin = `${koken.x - ekran.getBoundingClientRect().left}px ${koken.y - ekran.getBoundingClientRect().top}px`;
      perde.animate([karart(0.45), karart(0)], { ...ayar, fill: 'forwards' });
      const a = ekran.animate([{ transform: 'scale(0.95)' }, { transform: 'none' }], ayar);
      a.finished.then(bitir, bitir);
      return;
    }
    if (koken) {
      kokenler.delete(eski.adres);
      k.classList.add('kuculuyor');
      k.style.transformOrigin = `${koken.x}px ${koken.y}px`;
      const ayar = { duration: 720, easing: 'cubic-bezier(0.3, 0.6, 0.2, 1)' };
      k.animate([{ transform: 'none', opacity: 1, borderRadius: '0px' }, { opacity: 1, offset: 0.55 }, { transform: 'scale(0.2)', opacity: 0, borderRadius: '28px' }], { ...ayar, fill: 'forwards' });
      perde.animate([karart(0.45), karart(0)], { ...ayar, fill: 'forwards' });
      const a = ekran.animate([{ transform: 'scale(0.94)' }, { transform: 'none' }], ayar);
      a.finished.then(bitir, bitir);
      return;
    }
    const ayar = { duration: SURE - 40, easing: EGRI };
    k.animate([{ transform: 'none' }, { transform: 'translateX(100%)' }], { ...ayar, fill: 'forwards' });
    perde.animate([karart(0.28), karart(0)], { ...ayar, fill: 'forwards' });
    const a = ekran.animate([{ transform: 'translateX(-30%)' }, { transform: 'none' }], ayar);
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
// İş 87: süren açılış geçişinin bitirişi: açılış bitmeden geri kaydırılırsa önce o bitirilir (ayrılan sayfa belleğe girer)
let suren = null;
// kenardan kaydırma bittikten sonra önceki sayfa yerine konunca çağrılır (her çizimin sonunda da çağrılır)
export function kaydirmaSonu() {
  const f = kaydirmaBekleyen;
  kaydirmaBekleyen = null;
  if (f) f();
}

// ---------- Kurulum: bağlantılar ve kenardan kaydırma ----------
export function gecisKur({ ekran, d, sekmeler = [] }) {
  ortam = { ekran, d, sekmeler };
  if (typeof document === 'undefined') return;
  // İş 79: sekmeler arası kaydırma kaldırıldı; onun için saklanan sayfa önizlemeleri silinir (yer kaplamasın)
  try {
    localStorage.removeItem('sanat-atlasi:sekme-onizleme');
  } catch {
    /* depolama kapalı */
  }

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
      // İş 87: önceki kaydırmanın bitişi gelmediyse (iPhone kimi zaman touchend göndermiyor) önce o bitirilir
      if (k && k.basladi && !k.bitti) bitir();
      k = null;
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      if (t.clientX > KENAR) return;
      const gor = document.querySelector('.gor');
      if (gor && typeof gor.kapat !== 'function') return;
      // geri gidilecek sayfa yok (sekmelerin ana sayfaları): kenardan yatay hareket tarayıcının kendi geri hareketine
      // de bırakılmaz (önceki siteye ya da boş sayfaya gidebilir), hiçbir şey olmaz
      if (!gor && d.yigin.length < 2) {
        k = { x: t.clientX, y: t.clientY, yok: true };
        return;
      }
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
      if (k.yok) {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) k = null;
        else if (yatayKipirti(dx, dy) && e.cancelable) e.preventDefault();
        return;
      }
      if (!k.basladi) {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
          k = null;
          return;
        }
        // açıkça yatay ilk kıpırtıda tarayıcı kaydırmayı üstlenmesin (sonra iptal edilemiyor); dikeye yakın
        // kıpırtıya dokunulmaz (iPhone ilk kıpırtı engellenirse o dokunuşta sayfayı hiç kaydırmıyor)
        if (dx < 8) {
          if (yatayKipirti(dx, dy) && e.cancelable) e.preventDefault();
          return;
        }
        k.basladi = true;
        kaydirmaBaslat(k);
      }
      e.preventDefault();
      k.dx = Math.max(0, dx);
      k.izler.push([performance.now(), k.dx]);
      if (k.izler.length > 6) k.izler.shift();
      const x = k;
      if (!x.kare) x.kare = requestAnimationFrame(() => {
        x.kare = 0;
        if (!x.bitti) kaydirmaIlerlet(x);
      });
    },
    { passive: false, capture: true },
  );
  const bitir = () => {
    const x = k;
    k = null;
    if (!x || !x.basladi) return;
    if (x.kare) cancelAnimationFrame(x.kare);
    x.bitti = true;
    const hiz = birakmaHizi(x.izler);
    kaydirmaBitir(x, x.dx > W() * 0.33 || (hiz > 0.35 && x.dx > 20));
  };
  document.addEventListener('touchend', bitir, { capture: true });
  document.addEventListener('touchcancel', bitir, { capture: true });
  document.addEventListener('visibilitychange', () => document.hidden && bitir());

  // İş 86d: kenardan kaydırarak geri: sayfa yandan kaymak yerine geldiği yere (açıldığı nokta) doğru küçülür, köşeleri
  // yuvarlaklaşır; alttaki önceki sayfa aydınlanıp yerine oturur. Bırakınca küçülüp söner ya da geri büyür.
  // Hareket azaltma açıksa eski yandan kayma.
  // İş 87: kaydırılan sayfa kaydırma boyunca ekran boyunda sabit bir katmana alınır (#uygulama boşalır): iPhone'da
  // sayfanın kendisini (çok uzun öğe) kırpmak alttaki önceki sayfayı göstermiyordu (sayfa siyah zeminde bir şerit kalıyordu)
  // ve her karede yeniden boyanıyordu. Vazgeçilirse düğümler yerine konur, sayfa kaldığı yere kaydırılır.
  const kucul = (x) => !x.gor && !hareketAz();
  // İş 86e: açıldığı öğenin kutusu biliniyorsa sayfa ona daralır (clip-path); yoksa küçülme (scale)
  const sekilli = (x) => kucul(x) && x.koken && x.koken.kutu;
  const kr = () => ({ top: 0, left: 0, right: W(), bottom: window.innerHeight });
  const kKirp = (x, t) => kirpma(araKutu(ekranKutusu(), x.koken.kutu, t), kr(), Math.round(x.koken.kutu.yc * t));
  function kaydirmaBaslat(x) {
    suruyor(true);
    if (x.gor) {
      x.gor.classList.add('kaydiriliyor');
      return;
    }
    if (suren) suren();
    const onceki = d.yigin[d.yigin.length - 2];
    const s = bellek.get(onceki);
    x.onceki = onceki;
    x.adres = simdiki();
    x.s = s;
    x.katman = s ? katman(s) : null;
    // şimdiki sayfa: üst katmana (kaldığı yerde)
    x.bu = { adres: x.adres, dugumler: [...ekran.childNodes], y: window.scrollY, stil: document.documentElement.getAttribute('style') || '' };
    x.ust = katman(x.bu, true);
    x.ust.perde.remove();
    x.ust.k.classList.add('kaydiriliyor');
    if (kucul(x)) {
      const k = kokenler.get(simdiki()) || { x: W() / 2, y: window.innerHeight / 2 };
      x.koken = k;
      x.ust.k.classList.add('kuculuyor');
      if (sekilli(x)) x.ust.k.classList.add('sekilli');
      x.ust.k.style.transformOrigin = `${k.x}px ${k.y}px`;
      if (x.katman) x.katman.k.style.transformOrigin = `${k.x}px ${k.y}px`;
    }
  }
  // kaydırma oranına göre küçülme (p: 0–1)
  const kucukDurum = (x, p) => ({
    transform: `translate3d(${(x.dx || 0) * 0.3}px, 0, 0) scale(${1 - 0.45 * p})`,
    borderRadius: `${Math.round(28 * Math.min(1, p * 3))}px`,
  });
  const alttaki = (p) => ({ transform: `scale(${0.95 + 0.05 * p})` });
  const golge = (x, p, en = 0.45) => {
    if (x.katman) x.katman.perde.style.opacity = String(en * (1 - p));
  };
  function kaydirmaIlerlet(x) {
    const p = Math.min(1, x.dx / W());
    if (x.gor) {
      x.gor.style.transform = `translate3d(${x.dx}px, 0, 0)`;
      return;
    }
    const el = x.ust.k;
    if (sekilli(x)) {
      // parmak ekranın %60'ına gelince pencere öğenin şeklini almış olur
      const t = Math.min(1, p / 0.6);
      el.style.clipPath = kKirp(x, t);
      if (x.katman) Object.assign(x.katman.k.style, alttaki(p));
      golge(x, p);
      return;
    }
    if (kucul(x)) {
      Object.assign(el.style, kucukDurum(x, p));
      if (x.katman) Object.assign(x.katman.k.style, alttaki(p));
      golge(x, p);
      return;
    }
    el.style.transform = `translate3d(${x.dx}px, 0, 0)`;
    if (x.katman) x.katman.k.style.transform = `translate3d(${-30 * (1 - p)}%, 0, 0)`;
    golge(x, p, 0.28);
  }
  function kaydirmaBitir(x, tamam) {
    const el = x.gor || x.ust.k;
    const p = Math.min(1, x.dx / W());
    let a;
    const alt = (ayar, en = 0.45) => {
      if (!x.katman) return;
      x.katman.perde.animate([karart(en * (1 - p)), karart(tamam ? 0 : en)], ayar);
    };
    if (x.gor) {
      const kalan = tamam ? W() - x.dx : x.dx;
      const sure = Math.max(120, Math.min(360, kalan * 0.9));
      a = el.animate([{ transform: `translateX(${x.dx}px)` }, { transform: `translateX(${tamam ? W() : 0}px)` }], { duration: sure, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'forwards' });
    } else if (sekilli(x)) {
      const t = Math.min(1, p / 0.6);
      const ayar = { duration: tamam ? 560 : 380, easing: tamam ? 'cubic-bezier(0.32, 0.5, 0.2, 1)' : 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'forwards' };
      a = el.animate([{ clipPath: kKirp(x, t), opacity: 1 }, tamam ? { clipPath: kKirp(x, 1), opacity: 0 } : { clipPath: kKirp(x, 0), opacity: 1 }], ayar);
      if (x.katman) x.katman.k.animate([alttaki(p), tamam ? { transform: 'none' } : alttaki(0)], ayar);
      alt(ayar);
    } else if (kucul(x)) {
      const ayar = { duration: tamam ? 460 : 380, easing: tamam ? 'cubic-bezier(0.3, 0.6, 0.2, 1)' : 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'forwards' };
      const simdi = { ...kucukDurum(x, p), opacity: 1 };
      a = el.animate([simdi, tamam ? { transform: `translate3d(${x.dx * 0.3}px, 0, 0) scale(0.2)`, borderRadius: '28px', opacity: 0 } : { transform: 'none', borderRadius: '0px', opacity: 1 }], ayar);
      if (x.katman) x.katman.k.animate([alttaki(p), tamam ? { transform: 'none' } : alttaki(0)], ayar);
      alt(ayar);
    } else {
      const kalan = tamam ? W() - x.dx : x.dx;
      const ayar = { duration: Math.max(120, Math.min(360, kalan * 0.9)), easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'forwards' };
      a = el.animate([{ transform: `translateX(${x.dx}px)` }, { transform: `translateX(${tamam ? W() : 0}px)` }], ayar);
      if (x.katman) x.katman.k.animate([{ transform: `translateX(${-30 * (1 - p)}%)` }, { transform: tamam ? 'none' : 'translateX(-30%)' }], ayar);
      alt(ayar, 0.28);
    }
    let bitti = false;
    const son = () => {
      if (bitti) return;
      bitti = true;
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
        // sayfa değişmediyse (vazgeçildi ya da yönlendirici çizmedi) şimdiki sayfa yerine, kaldığı yere
        x.ust.geriAl();
        if (!ekran.firstChild && x.bu.dugumler.length) {
          ekran.append(...x.bu.dugumler);
          animasyonlariBitir(ekran);
          window.scrollTo(0, x.bu.y);
        }
        x.ust.k.remove();
        if (tamam && x.koken) kokenler.delete(x.adres);
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
    // İş 87: animasyon bir sebeple bitmezse (iPhone'da sekme arka plana geçti vb.) yine temizlenir
    setTimeout(son, 1200);
  }
}
