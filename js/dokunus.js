// İş 73: yutulan dokunuşlar. iPhone Safari bazı dokunuşlarda (ör. Göz At'taki dönem kartı) parmak kalktığı hâlde
// tıklama üretmiyor: ilk dokunuş yalnız "üzerine gelme" sayılıyor ya da hareket sezgisiyle yutuluyor, kullanıcı ikinci
// kez dokunmak zorunda kalıyordu. Kısa, kıpırdamayan bir dokunuştan sonra kısa süre içinde o öğeye tıklama gelmezse
// tıklama burada üretilir. Tıklama zaten geldiyse hiçbir şey yapılmaz (çift gezinme ya da çift işlem olmaz).

const HEDEF = 'a[href], button, [role="button"], summary, label, .eser, [data-kucuk]';
const HARIC = 'input, select, textarea, [contenteditable], .gor, #sekmeler, [data-dokunus-yok]';
const KIPIRTI = 10; // px
const EN_UZUN = 700; // ms: bundan uzun basış uzun basmadır, tıklama değildir
const BEKLE = 180; // ms: Safari'nin kendi tıklaması gecikirse çift olmasın

let bas = null;
let sonTiklama = { el: null, zaman: 0 };

export function dokunuslariKoru() {
  if (typeof document === 'undefined') return;
  document.addEventListener(
    'pointerdown',
    (e) => {
      bas = null;
      if (e.pointerType !== 'touch' || !e.isPrimary) return;
      const el = e.target.closest && e.target.closest(HEDEF);
      if (!el || el.closest(HARIC) || el.matches(':disabled, [aria-disabled="true"]')) return;
      bas = { el, x: e.clientX, y: e.clientY, zaman: performance.now(), id: e.pointerId };
    },
    { capture: true, passive: true },
  );
  const iptal = () => (bas = null);
  document.addEventListener('pointercancel', iptal, { capture: true, passive: true });
  document.addEventListener(
    'pointermove',
    (e) => {
      if (bas && e.pointerId === bas.id && Math.hypot(e.clientX - bas.x, e.clientY - bas.y) > KIPIRTI) bas = null;
    },
    { capture: true, passive: true },
  );
  // gerçek tıklamalar (Safari'nin kendi ürettikleri ve bizimkiler) kaydedilir
  document.addEventListener(
    'click',
    (e) => {
      sonTiklama = { el: e.target, zaman: performance.now() };
    },
    { capture: true },
  );
  document.addEventListener(
    'pointerup',
    (e) => {
      const b = bas;
      bas = null;
      if (!b || e.pointerId !== b.id) return;
      if (performance.now() - b.zaman > EN_UZUN || Math.hypot(e.clientX - b.x, e.clientY - b.y) > KIPIRTI) return;
      const kalkis = document.elementFromPoint(e.clientX, e.clientY);
      if (!kalkis || !b.el.contains(kalkis)) return;
      const t = performance.now();
      setTimeout(() => {
        // bu dokunuştan sonra o öğeye (ya da içine) tıklama geldiyse Safari kendisi halletti
        if (sonTiklama.zaman >= t - 5 && sonTiklama.el && (b.el.contains(sonTiklama.el) || sonTiklama.el.contains(b.el))) return;
        if (!b.el.isConnected || document.querySelector('.gor')) return;
        b.el.click();
      }, BEKLE);
    },
    { capture: true, passive: true },
  );
}
