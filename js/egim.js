// Telefonu eğince ya da sağa sola çevirince Bugün'ün tablosu hareket eder (İş 32): tablo hafifçe döner ve kayar,
// üstünden ışık geçer, sanatçının adı katman katman ters yöne kayar (derinlik).
// Kaynak jiroskop (devicemotion → rotationRate, °/sn): dönüş hızı toplanır, bırakınca yavaşça ortaya döner
// (iPhone duvar kâğıdındaki gibi). Telefon hangi açıda tutulursa tutulsun aynı çalışır; cihaz açıları (beta/gamma)
// telefon dikken kararsızlaşıp (gimbal kilidi) adı rastgele yerlere atıyordu. Jiroskop yoksa açılar yedek olarak,
// takla atmayan biçimde kullanılır.
// iOS hareket verisini ancak bir dokunuşla istenen izinle verir (DeviceMotionEvent.requestPermission).
// Saf hesap burada (birim testli); CSS değişkenleri: --egx, --egy (-1…1), --egim-eksen (rotate değeri).

const SINIR = 22; // bu kadar derece dönüş / eğim tam etki
const EN_COK_ACI = 5; // tablonun en çok dönüş açısı (derece)
const SONUM = 1.6; // jiroskop: toplanan dönüş bu kadar saniyede ~%63 söner (bırakınca ortaya dönüş)
const TAKIP = 0.003; // açı yedeği: sıfır noktası tutuş açısını olay başına bu hızla izler
const SUZGEC = 0.3; // açı yedeği: algılayıcı titremesine karşı yumuşatma (olay başına)

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
let kare = 0;
let bekleyen = null; // izin için beklenen ilk dokunuş
// jiroskop
let donus = { x: 0, y: 0 };
let sonZaman = 0;
let jiroskop = false; // dönüş hızı geldiyse açı yedeği kullanılmaz
// açı yedeği
let taban = null;
let suzulmus = null;

function hareket(e) {
  const r = e.rotationRate;
  if (!r || (r.beta == null && r.gamma == null)) return;
  jiroskop = true;
  const simdi = performance.now();
  const dt = sonZaman ? Math.min(0.05, (simdi - sonZaman) / 1000) : 1 / 60;
  sonZaman = simdi;
  donus = donusIzle(donus, r, dt);
  hedef = donustenEgim(donus);
  if (!kare) kare = requestAnimationFrame(ciz);
}

function yon(e) {
  if (jiroskop || e.beta == null || e.gamma == null) return;
  const { on, yan } = egimAcilari(e.beta, e.gamma);
  suzulmus = tabanIzle(suzulmus, on, yan, SUZGEC);
  taban = tabanIzle(taban, suzulmus.beta, suzulmus.gamma);
  hedef = egimHesapla(suzulmus.beta, suzulmus.gamma, taban);
  if (!kare) kare = requestAnimationFrame(ciz);
}

// Ekrana yumuşakça uygulanır; kök sayfadan çıkınca dinleme kendiliğinden biter
function ciz() {
  kare = 0;
  if (!kok || !kok.isConnected) return egimDurdur();
  anlik = { x: anlik.x + (hedef.x - anlik.x) * 0.2, y: anlik.y + (hedef.y - anlik.y) * 0.2 };
  kok.style.setProperty('--egx', anlik.x.toFixed(3));
  kok.style.setProperty('--egy', anlik.y.toFixed(3));
  kok.style.setProperty('--egim-eksen', eksenYaz(anlik.x, anlik.y));
  if (Math.abs(hedef.x - anlik.x) > 0.002 || Math.abs(hedef.y - anlik.y) > 0.002) kare = requestAnimationFrame(ciz);
}

// el: tablonun kutusu. acik: ayardaki seçim. İzin gerekiyorsa ve henüz alınmadıysa ilk dokunuşta istenir.
export function egimBaslat(el, acik) {
  egimDurdur();
  if (!el || !acik || !egimVar() || azHareket() || izinDurumu === false) return;
  kok = el;
  const dinle = () => {
    if (kok !== el) return;
    window.addEventListener('devicemotion', hareket);
    window.addEventListener('deviceorientation', yon);
    el.classList.add('egimli');
  };
  if (!izinGerekli() || izinDurumu) return dinle();
  bekleyen = async () => {
    dokunusuBirak();
    if (await egimIzni()) dinle();
  };
  document.addEventListener('click', bekleyen, true);
  document.addEventListener('touchend', bekleyen, true);
}

function dokunusuBirak() {
  if (!bekleyen) return;
  document.removeEventListener('click', bekleyen, true);
  document.removeEventListener('touchend', bekleyen, true);
  bekleyen = null;
}

export function egimDurdur() {
  dokunusuBirak();
  window.removeEventListener('devicemotion', hareket);
  window.removeEventListener('deviceorientation', yon);
  if (kare) cancelAnimationFrame(kare);
  kare = 0;
  if (kok) kok.classList.remove('egimli');
  kok = null;
  hedef = { x: 0, y: 0 };
  anlik = { x: 0, y: 0 };
  donus = { x: 0, y: 0 };
  sonZaman = 0;
  jiroskop = false;
  taban = null;
  suzulmus = null;
}
