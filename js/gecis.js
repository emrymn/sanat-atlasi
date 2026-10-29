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
export function gecisBildir({ geriMi, sekmeden, ilk }) {
  bekleyen = null;
  if (ilk || sekmeden || hareketAz()) return;
  if (geriMi) {
    if (Date.now() - geriBasildi < 1500) bekleyen = { yon: 'geri' };
  } else bekleyen = { yon: 'ileri' };
  geriBasildi = 0;
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

function sayfaKaydir(ekran, yon) {
  const { c } = kopyala(ekran);
  c.style.height = '';
  c.dataset.hareket = '';
  c.classList.add(yon === 'ileri' ? 'gecis-alt' : 'gecis-ust');
  document.body.appendChild(c);
  return () => {
    ekran.classList.add(yon === 'ileri' ? 'gecis-ust-sayfa' : 'gecis-alt-sayfa');
    document.documentElement.classList.add('gecis-suruyor');
    const bitir = () => {
      c.remove();
      ekran.classList.remove('gecis-ust-sayfa', 'gecis-alt-sayfa');
      document.documentElement.classList.remove('gecis-suruyor');
    };
    const ayar = { duration: SURE, easing: EGRI, fill: 'both' };
    let a;
    if (yon === 'ileri') {
      c.animate([{ transform: 'none', filter: 'brightness(1)' }, { transform: 'translateX(-28%)', filter: 'brightness(0.7)' }], ayar);
      a = ekran.animate([{ transform: 'translateX(100%)' }, { transform: 'none' }], ayar);
    } else {
      // geri: eski sayfa sağa çekilir, alttaki önceki sayfa karanlıktan aydınlanır (yeni sayfa kaydırılmaz:
      // içindeki sabit öğeler ve geri yüklenen kaydırma yeri bozulmasın)
      a = c.animate([{ transform: 'none' }, { transform: 'translateX(100%)' }], ayar);
      ekran.animate([{ filter: 'brightness(0.7)' }, { filter: 'brightness(1)' }], { duration: SURE, easing: EGRI });
    }
    a.finished.then(bitir, bitir);
    if (yon === 'ileri') a.finished.then(() => a.cancel(), () => {});
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
    const ayar = { duration: SURE + 80, easing: EGRI, fill: 'both' };
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
