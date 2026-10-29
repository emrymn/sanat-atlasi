// İş 70: iPhone tarzı ekran geçişleri.
// - Sayfa kayarak gelir: daha derine inince yeni sayfa sağdan, önceki hafifçe sola çekilerek; uygulamanın geri
//   düğmesiyle dönünce tersi. iPhone'un kenardan geri hareketi kendi geçişini yaptığından o dönüşte geçiş yok.
// - Kart büyüyerek açılır: Başyapıtlar ve Konular kartına dokununca kart ekranı kaplayacak kadar büyür, açılan sayfa
//   onun içinden belirir (App Store'daki "Bugün" kartları gibi).
// Eski sayfanın görüntüsü için içeriğin bir kopyası kullanılır (tarayıcı desteği gerektirmez); hareket azaltma
// açıksa hiçbiri yok.

const SURE = 380;
const EGRI = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
const KART_SECICI = '.vitrin-kart, .konu-kart';

let bekleyen = null; // { yon: 'ileri' | 'geri' } — yönlendirici bırakır, ciz() tüketir
let geriBasildi = 0;
let kart = null; // { el, zaman } — dokunulan kart

// Hareket azaltma açıksa geçiş yok. Otomatik testlerde de yok (navigator.webdriver): geçiş sırasında eski sayfanın
// kopyası bir an aynı öğeleri iki kez gösterir; geçişleri sınayan testler window.__atlasGecis = true ile açar.
export const hareketAz = () =>
  (typeof navigator !== 'undefined' && navigator.webdriver && !(typeof window !== 'undefined' && window.__atlasGecis)) ||
  (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);

if (typeof document !== 'undefined') {
  document.addEventListener(
    'pointerdown',
    (e) => {
      const k = e.target.closest && e.target.closest(KART_SECICI);
      kart = k ? { el: k, zaman: Date.now() } : null;
    },
    true,
  );
}

// uygulamanın kendi geri düğmesi (history.back öncesi)
export function geriDugmesiBasildi() {
  geriBasildi = Date.now();
}

// yönlendirici her adres değişiminde çağırır
export function gecisBildir({ geriMi, sekmeden, ilk, gezinti = null }) {
  bekleyen = null;
  const dugmeyle = Date.now() - geriBasildi < 1500;
  geriBasildi = 0;
  if (ilk || sekmeden || hareketAz()) return;
  // geçmişte gezinme: yalnız uygulamanın geri okuyla dönüşte kendi geçişimiz; iPhone'un kenardan kaydırması ve
  // tarayıcının geri/ileri tuşu kendi kaymasını yapar, sayfa hareketsiz (yeniden açılıyormuş gibi değil) çizilir
  if (geriMi || gezinti) {
    if (geriMi && dugmeyle) bekleyen = { yon: 'geri' };
  } else bekleyen = { yon: 'ileri' };
}

// ciz() yeni içeriği koymadan hemen önce çağırır; dönen işlev içerik konduktan sonra çağrılır
export function gecisHazirla(ekran) {
  const g = bekleyen;
  bekleyen = null;
  if (!g || !ekran.firstElementChild) return () => {};
  // kart yalnız gidilen adres kartın kendi adresiyse büyür (kaydırırken dokunulan kart başka yere gidişte büyümesin)
  const k =
    g.yon === 'ileri' && kart && Date.now() - kart.zaman < 1500 && kart.el.isConnected && kart.el.getAttribute('href') === (location.hash || '#/')
      ? kart.el
      : null;
  kart = null;
  if (k) return kartBuyut(ekran, k);
  return sayfaKaydir(ekran, g.yon);
}

function kopyala(el) {
  const r = el.getBoundingClientRect();
  const c = el.cloneNode(true);
  c.removeAttribute('id');
  c.setAttribute('aria-hidden', 'true');
  c.inert = true;
  c.classList.add('gecis-kopya');
  // kopyada kimlik kalmasın: belgeden kimlikle aranan öğe hep gerçek sayfanınki olsun
  for (const x of c.querySelectorAll('[id]')) x.removeAttribute('id');
  const cs = getComputedStyle(el);
  Object.assign(c.style, { top: `${r.top}px`, left: `${r.left}px`, width: `${r.width}px`, height: `${r.height}px`, margin: '0', padding: cs.padding, boxSizing: 'border-box' });
  return { c, r };
}

// İş 70b: kopyasız. Eski sayfanın kopyası uzun sayfalarda (Göz At) iPhone'u kasıyordu: dokunuşlar gecikiyor, ikinci
// dokunuş gerekiyor, sekme çubuğu tepki vermiyordu. Artık yalnız yeni sayfa kayarak ve belirerek gelir (tek öğe, ucuz).
function sayfaKaydir(ekran, yon) {
  return () => {
    document.documentElement.classList.add('gecis-suruyor');
    const ileri = yon === 'ileri';
    const a = ekran.animate(
      [
        // saydamlık değişmez: iPhone geri kaydırma için sayfanın görüntüsünü bu sırada alırsa karanlık çıkmasın
        { transform: `translateX(${ileri ? 32 : -18}%)` },
        { transform: 'none' },
      ],
      { duration: ileri ? SURE : SURE - 60, easing: EGRI },
    );
    const bitir = () => document.documentElement.classList.remove('gecis-suruyor');
    a.finished.then(bitir, bitir);
  };
}

function kartBuyut(ekran, k) {
  const { c, r } = kopyala(k);
  c.classList.add('gecis-kart');
  document.body.appendChild(c);
  k.style.visibility = 'hidden';
  return () => {
    const W = innerWidth;
    const H = innerHeight;
    // kart büyümesi görüntüleyicinin açılışıyla aynı hızda (yavaş, yay eğrisi)
    const ayar = { duration: 640, easing: 'cubic-bezier(0.32, 0.72, 0, 1)', fill: 'both' };
    // kart kopyası yerinden ekranı kaplayacak kadar büyür ve söner; yeni sayfa aynı anda içinden belirir
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
    const a = ekran.animate(
      [
        { opacity: 0, transform: 'scale(0.94)' },
        { opacity: 0, transform: 'scale(0.94)', offset: 0.35 },
        { opacity: 1, transform: 'none' },
      ],
      ayar,
    );
    document.documentElement.classList.add('gecis-suruyor');
    const bitir = () => {
      c.remove();
      a.cancel();
      document.documentElement.classList.remove('gecis-suruyor');
    };
    a.finished.then(bitir, bitir);
  };
}
