// Atölye'de bugünkü turun destesi telefonu sağa sola çevirince iskambil gibi yelpaze açılır, deste o yöne yatar;
// bırakınca yaylanıp toplanır (İş 47). Algılayıcı, izin ve "Hareketi aç" akışı Bugün'deki eğimle aynı (js/egim.js);
// yay fiziği bölüm sonucundaki sarkaçla aynı (js/sallanma.js). Kök öğeye --acilim (0…1) ve --yatma (derece) yazılır;
// CSS bunları kartların kendi animasyonlarından (transform) ayrı olarak rotate ve translate ile uygular.
import { egimBaslat } from './egim.js';
import { sarkacAdim, durgunMu } from './sallanma.js';

export const YATMA = 6; // tam eğimde destenin yattığı açı (derece)
const SERTLIK = 90; // yay: ~0,66 sn'lik gidip gelme
const SONUM = 6; // az sürtünme: toplanırken bir iki kez yaylanır

// Eğimin sağa-sola bileşeninden (x, -1…1) hedef: ne kadar çevrilirse o kadar açılır, deste dönüş yönünün tersine yatar
export function yelpazeHedefi(x) {
  return { acilim: Math.min(1, Math.abs(x)), yatma: -x * YATMA };
}

let kok = null;
let hedef = { acilim: 0, yatma: 0 };
let acilim = { aci: 0, hiz: 0 };
let yatma = { aci: 0, hiz: 0 };
let kare = 0;
let sonZaman = 0;

function adim(t) {
  kare = 0;
  if (!kok || !kok.isConnected) return desteDurdur();
  const dt = sonZaman ? Math.min(0.04, (t - sonZaman) / 1000) : 1 / 60;
  sonZaman = t;
  acilim = sarkacAdim(acilim, hedef.acilim, dt, SERTLIK, SONUM);
  yatma = sarkacAdim(yatma, hedef.yatma, dt, SERTLIK, SONUM);
  kok.style.setProperty('--acilim', acilim.aci.toFixed(3));
  kok.style.setProperty('--yatma', `${yatma.aci.toFixed(2)}deg`);
  if (durgunMu(acilim, hedef.acilim) && durgunMu(yatma, hedef.yatma)) sonZaman = 0;
  else kare = requestAnimationFrame(adim);
}

// el: .pk-sahne (içinde .pk-deste ve [data-egim-dugme]); acik: Ayarlar'daki hareket seçimi
export function desteBaslat(el, acik) {
  desteDurdur();
  if (!el) return;
  kok = el;
  egimBaslat(el, acik, (h) => {
    hedef = yelpazeHedefi(h.x);
    if (!kare && kok === el) kare = requestAnimationFrame(adim);
  });
}

export function desteDurdur() {
  if (kare) cancelAnimationFrame(kare);
  kare = 0;
  sonZaman = 0;
  kok = null;
  hedef = { acilim: 0, yatma: 0 };
  acilim = { aci: 0, hiz: 0 };
  yatma = { aci: 0, hiz: 0 };
}
