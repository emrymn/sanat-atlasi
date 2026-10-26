// Telefonu eğince ya da sağa sola çevirince Bugün'ün tablosu hareket eder (İş 32): tablo hafifçe döner ve kayar,
// üstünden ışık geçer, sanatçının adı katman katman ters yöne kayar (derinlik).
// Kaynak jiroskop (devicemotion → rotationRate, °/sn): dönüş hızı toplanır, bırakınca yavaşça ortaya döner
// (iPhone duvar kâğıdındaki gibi). Telefon hangi açıda tutulursa tutulsun aynı çalışır; cihaz açıları (beta/gamma)
// telefon dikken kararsızlaşıp (gimbal kilidi) adı rastgele yerlere atıyordu. Jiroskop yoksa açılar yedek olarak,
// takla atmayan biçimde kullanılır.
// iOS hareket verisini ancak izinle verir (DeviceMotionEvent.requestPermission). İzin istemek dokunuş ister ve iOS izni
// kalıcı tutmaz (uygulama kapanıp açılınca çoğu zaman unutur). Açılışta önce dokunuşsuz sorulur: iOS hatırlıyorsa kutu
// çıkmadan evet der; hatırlamıyorsa tablonun üstünde "Hareketi aç" düğmesi belirir, izin yalnız ona (ya da Ayarlar'daki
// düğmeye) dokununca istenir.
// Saf hesap burada (birim testli); CSS değişkenleri: --egx, --egy (-1…1), --egim-eksen (rotate değeri) tablo için;
// --yzx, --yzy ad için (aynı değer, daha yavaş izler).

const SINIR = 22; // bu kadar derece dönüş / eğim tam etki
const EN_COK_ACI = 5; // tablonun en çok dönüş açısı (derece)
const SONUM = 1.6; // jiroskop: toplanan dönüş bu kadar saniyede ~%63 söner (bırakınca ortaya dönüş)
const TAKIP = 0.003; // açı yedeği: sıfır noktası tutuş açısını olay başına bu hızla izler
const SUZGEC = 0.3; // açı yedeği: algılayıcı titremesine karşı yumuşatma (olay başına)
const TABLO_IZ = 0.2; // tablo hedefe her karede bu kadar yaklaşır
const YAZI_IZ = 0.06; // ad daha ağır izler (hızlı kayması rahatsız ediyordu)

const sinirla = (v) => Math.max(-1, Math.min(1, v));
const DERECE = Math.PI / 180;
// iki açının farkı -180…180 (359° ile 1° arası 2°)
const fark = (a, b) => ((((a - b) % 360) + 540) % 360) - 180;

// x, y (-1…1) → rotate değeri: eğilen kenar geriye gider (sağa: dikey eksen, öne: yatay eksen)
function eksenYaz(x, y) {
  const buyukluk = Math.min(1, Math.hypot(x, y));
  return buyukluk < 0.001 ? '0 1 0 0deg' : `${(-y).toFixed(3)} ${x.toFixed(3)} 0 ${(buyukluk * EN_COK_ACI).toFixed(2)}deg`;
}

// Jiroskop: durum { x, y } (derece), hiz { beta, gamma } (°/sn; beta yatay eksen = öne-arka, gamma dikey eksen =
// sağa-sola), dt (sn). Dönüş toplanır ve SONUM ile söner; en çok SINIR'ın 1,5 katı birikir.
export function donusIzle(durum, hiz, dt, sonum = SONUM) {
  const k = Math.exp(-dt / sonum);
  const tavan = SINIR * 1.5;
  const sin = (v) => Math.max(-tavan, Math.min(tavan, v));
  return { x: sin(durum.x * k + (hiz.gamma || 0) * dt), y: sin(durum.y * k + (hiz.beta || 0) * dt) };
}

// rotationRate'in eksenleri: standartta (Chrome) beta yatay eksen, gamma dikey eksen; iOS Safari ise kaydırır:
// alpha yatay eksen, beta dikey eksen. Bunu bilmeden iPhone'da sağa sola çevirmek tabloyu yukarı aşağı oynatıyordu.
export function hizEksenleri(r, ios) {
  return ios ? { beta: r.alpha, gamma: r.beta } : { beta: r.beta, gamma: r.gamma };
}
export const iosMu = () =>
  typeof navigator !== 'undefined' &&
  (/iP(hone|ad|od)/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1));

export function donustenEgim(durum) {
  const x = sinirla(durum.x / SINIR);
  const y = sinirla(durum.y / SINIR);
  return { x, y, eksen: eksenYaz(x, y) };
}

// Açı yedeği. Cihazın beta/gamma açıları dik tutuşta takla atar; aynı duruş için sürekli olan iki eğim:
// yerçekiminin cihaza göre yönünden öne-arka (on) ve sağa-sola (yan), derece.
export function egimAcilari(beta, gamma) {
  const b = beta * DERECE;
  const g = gamma * DERECE;
  const yan = Math.asin(Math.max(-1, Math.min(1, Math.cos(b) * Math.sin(g)))) / DERECE;
  const on = Math.atan2(Math.sin(b), Math.cos(b) * Math.cos(g)) / DERECE;
  return { on, yan };
}

// beta (öne-arka) / gamma (sağa-sola): eğim açıları (derece); taban: { beta, gamma } sıfır noktası.
export function egimHesapla(beta, gamma, taban) {
  const x = sinirla(fark(gamma, taban.gamma) / SINIR);
  const y = sinirla(fark(beta, taban.beta) / SINIR);
  return { x, y, eksen: eksenYaz(x, y) };
}

// Sıfır noktası yeni ölçüme doğru yavaşça kayar (ilk ölçümde doğrudan oraya oturur)
export function tabanIzle(taban, beta, gamma, takip = TAKIP) {
  if (!taban) return { beta, gamma };
  return { beta: taban.beta + fark(beta, taban.beta) * takip, gamma: taban.gamma + fark(gamma, taban.gamma) * takip };
}

export const egimVar = () => typeof window !== 'undefined' && ('DeviceMotionEvent' in window || 'DeviceOrientationEvent' in window);
const izinVeren = () =>
  typeof window === 'undefined'
    ? null
    : [window.DeviceMotionEvent, window.DeviceOrientationEvent].find((t) => t && typeof t.requestPermission === 'function') || null;
export const izinGerekli = () => egimVar() && !!izinVeren();
const azHareket = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

let izinDurumu = null; // null: sorulmadı, true / false
// Dokunuşsuz soru: iOS daha önceki izni hatırlıyorsa evet; hatırlamıyorsa (dokunuş gerektiği için) hayır, kutu açılmaz.
// Hayır, reddedildi sayılmaz.
export async function izinVarMi() {
  if (izinDurumu !== null) return izinDurumu;
  const t = izinVeren();
  if (!t) return egimVar();
  try {
    if ((await t.requestPermission()) === 'granted') izinDurumu = true;
  } catch {
    // dokunuş gerekiyor: düğme gösterilecek
  }
  return izinDurumu === true;
}

// Dokunuşun içinden çağrılmalı (iOS; hareket ve yön için tek izin); izin gerekmeyen tarayıcıda hemen evet
export async function egimIzni() {
  if (!egimVar()) return false;
  const t = izinVeren();
  if (!t) return (izinDurumu = true);
  try {
    izinDurumu = (await t.requestPermission()) === 'granted';
  } catch {
    izinDurumu = false;
  }
  return izinDurumu;
}

let kok = null;
let hedef = { x: 0, y: 0 };
let anlik = { x: 0, y: 0 };
let yazi = { x: 0, y: 0 };
let kare = 0;
// jiroskop
let donus = { x: 0, y: 0 };
let sonZaman = 0;
let jiroskop = false; // dönüş hızı geldiyse açı yedeği kullanılmaz
// açı yedeği
let taban = null;
let suzulmus = null;
// isteğe bağlı: hedef eğim her değişince çağrılır (bölüm sonucundaki asılı tablolar kendi sarkaç fiziğini sürer)
let dinleyici = null;

const IOS = iosMu();
function hareket(e) {
  const r = e.rotationRate && hizEksenleri(e.rotationRate, IOS);
  if (!r || (r.beta == null && r.gamma == null)) return;
  jiroskop = true;
  const simdi = performance.now();
  const dt = sonZaman ? Math.min(0.05, (simdi - sonZaman) / 1000) : 1 / 60;
  sonZaman = simdi;
  donus = donusIzle(donus, r, dt);
  hedef = donustenEgim(donus);
  if (dinleyici) dinleyici(hedef);
  if (!kare) kare = requestAnimationFrame(ciz);
}

function yon(e) {
  if (jiroskop || e.beta == null || e.gamma == null) return;
  const { on, yan } = egimAcilari(e.beta, e.gamma);
  suzulmus = tabanIzle(suzulmus, on, yan, SUZGEC);
  taban = tabanIzle(taban, suzulmus.beta, suzulmus.gamma);
  hedef = egimHesapla(suzulmus.beta, suzulmus.gamma, taban);
  if (dinleyici) dinleyici(hedef);
  if (!kare) kare = requestAnimationFrame(ciz);
}

const yaklas = (a, b, k) => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });

// Ekrana yumuşakça uygulanır; kök sayfadan çıkınca dinleme kendiliğinden biter
function ciz() {
  kare = 0;
  if (!kok || !kok.isConnected) return egimDurdur();
  anlik = yaklas(anlik, hedef, TABLO_IZ);
  yazi = yaklas(yazi, hedef, YAZI_IZ);
  kok.style.setProperty('--egx', anlik.x.toFixed(3));
  kok.style.setProperty('--egy', anlik.y.toFixed(3));
  kok.style.setProperty('--egim-eksen', eksenYaz(anlik.x, anlik.y));
  kok.style.setProperty('--yzx', yazi.x.toFixed(3));
  kok.style.setProperty('--yzy', yazi.y.toFixed(3));
  const uzak = (a) => Math.abs(hedef.x - a.x) > 0.002 || Math.abs(hedef.y - a.y) > 0.002;
  if (uzak(anlik) || uzak(yazi)) kare = requestAnimationFrame(ciz);
}

// el: tablonun kutusu (içinde [data-egim-dugme] "Hareketi aç" düğmesi). acik: ayardaki seçim.
// degisince: isteğe bağlı, hedef eğim ({ x, y }, -1…1) her değiştiğinde çağrılır.
export function egimBaslat(el, acik, degisince = null) {
  egimDurdur();
  if (!el || !acik || !egimVar() || azHareket() || izinDurumu === false) return;
  kok = el;
  dinleyici = degisince;
  const dinle = () => {
    if (kok !== el) return;
    el.classList.remove('egim-izinsiz');
    window.addEventListener('devicemotion', hareket);
    window.addEventListener('deviceorientation', yon);
    el.classList.add('egimli');
  };
  if (!izinGerekli() || izinDurumu) return dinle();
  const dugme = el.querySelector('[data-egim-dugme]');
  if (dugme) {
    dugme.onclick = async () => {
      if (await egimIzni()) dinle();
      else el.classList.remove('egim-izinsiz'); // reddedildi: bu açılışta bir daha sorulmaz
    };
  }
  izinVarMi().then((hatirliyor) => {
    if (kok !== el) return;
    if (hatirliyor) dinle();
    else if (dugme) el.classList.add('egim-izinsiz');
  });
}

export function egimDurdur() {
  window.removeEventListener('devicemotion', hareket);
  window.removeEventListener('deviceorientation', yon);
  if (kare) cancelAnimationFrame(kare);
  kare = 0;
  if (kok) kok.classList.remove('egimli', 'egim-izinsiz');
  kok = null;
  dinleyici = null;
  hedef = { x: 0, y: 0 };
  anlik = { x: 0, y: 0 };
  yazi = { x: 0, y: 0 };
  donus = { x: 0, y: 0 };
  sonZaman = 0;
  jiroskop = false;
  taban = null;
  suzulmus = null;
}
