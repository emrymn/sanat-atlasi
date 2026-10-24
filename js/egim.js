// Telefonu eğince Bugün'ün tablosu hareket eder (İş 32): sağa sola (gamma) ve öne arkaya (beta) eğim, tutuş açısına göre
// sıfırlanır; tablo hafifçe döner ve kayar, üstünden ışık geçer, sanatçının adı ters yöne kayar (derinlik).
// iOS hareket verisini ancak bir dokunuşla istenen izinle verir (DeviceOrientationEvent.requestPermission).
// Saf hesap burada (birim testli); CSS değişkenleri: --egx, --egy (-1…1), --egim-eksen (rotate değeri).

const SINIR = 22; // bu kadar derece eğim tam etki
const EN_COK_ACI = 5; // tablonun en çok dönüş açısı (derece)
const TAKIP = 0.012; // tutuş açısı (sıfır noktası) eğimi bu hızla izler: sabit tutunca tablo yavaşça ortalanır

const sinirla = (v) => Math.max(-1, Math.min(1, v));

// beta/gamma: cihaz açıları (derece); taban: { beta, gamma } sıfır noktası. Dönen: x, y (-1…1) ve rotate değeri.
export function egimHesapla(beta, gamma, taban) {
  const x = sinirla((gamma - taban.gamma) / SINIR);
  const y = sinirla((beta - taban.beta) / SINIR);
  const buyukluk = Math.min(1, Math.hypot(x, y));
  // eğilen kenar geriye gider: sağa eğince sağ kenar uzaklaşır (y ekseni), öne eğince üst kenar (x ekseni)
  const eksen = buyukluk < 0.001 ? '0 1 0 0deg' : `${(-y).toFixed(3)} ${x.toFixed(3)} 0 ${(buyukluk * EN_COK_ACI).toFixed(2)}deg`;
  return { x, y, eksen };
}

// Sıfır noktası yeni ölçüme doğru yavaşça kayar (ilk ölçümde doğrudan oraya oturur)
export function tabanIzle(taban, beta, gamma, takip = TAKIP) {
  if (!taban) return { beta, gamma };
  return { beta: taban.beta + (beta - taban.beta) * takip, gamma: taban.gamma + (gamma - taban.gamma) * takip };
}

export const egimVar = () => typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
export const izinGerekli = () => egimVar() && typeof window.DeviceOrientationEvent.requestPermission === 'function';
const azHareket = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

let izinDurumu = null; // null: sorulmadı, true / false
// Dokunuşun içinden çağrılmalı (iOS); izin gerekmeyen tarayıcıda hemen evet
export async function egimIzni() {
  if (!egimVar()) return false;
  if (!izinGerekli()) return (izinDurumu = true);
  try {
    izinDurumu = (await window.DeviceOrientationEvent.requestPermission()) === 'granted';
  } catch {
    izinDurumu = false;
  }
  return izinDurumu;
}

let kok = null;
let taban = null;
let hedef = { x: 0, y: 0 };
let anlik = { x: 0, y: 0 };
let kare = 0;
let bekleyen = null; // izin için beklenen ilk dokunuş

function olcum(e) {
  if (e.beta == null || e.gamma == null) return;
  taban = tabanIzle(taban, e.beta, e.gamma);
  hedef = egimHesapla(e.beta, e.gamma, taban);
  if (!kare) kare = requestAnimationFrame(ciz);
}

// Ekrana yumuşakça uygulanır; kök sayfadan çıkınca dinleme kendiliğinden biter
function ciz() {
  kare = 0;
  if (!kok || !kok.isConnected) return egimDurdur();
  anlik = { x: anlik.x + (hedef.x - anlik.x) * 0.18, y: anlik.y + (hedef.y - anlik.y) * 0.18 };
  const { eksen } = egimHesapla(anlik.y * SINIR, anlik.x * SINIR, { beta: 0, gamma: 0 });
  kok.style.setProperty('--egx', anlik.x.toFixed(3));
  kok.style.setProperty('--egy', anlik.y.toFixed(3));
  kok.style.setProperty('--egim-eksen', eksen);
  if (Math.abs(hedef.x - anlik.x) > 0.002 || Math.abs(hedef.y - anlik.y) > 0.002) kare = requestAnimationFrame(ciz);
}

// el: tablonun kutusu. acik: ayardaki seçim. İzin gerekiyorsa ve henüz alınmadıysa ilk dokunuşta istenir.
export function egimBaslat(el, acik) {
  egimDurdur();
  if (!el || !acik || !egimVar() || azHareket() || izinDurumu === false) return;
  kok = el;
  const dinle = () => {
    if (kok !== el) return;
    window.addEventListener('deviceorientation', olcum);
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
  window.removeEventListener('deviceorientation', olcum);
  if (kare) cancelAnimationFrame(kare);
  kare = 0;
  if (kok) kok.classList.remove('egimli');
  kok = null;
  taban = null;
  hedef = { x: 0, y: 0 };
  anlik = { x: 0, y: 0 };
}
