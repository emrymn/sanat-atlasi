// İş 80: keskin görseller. iPhone'un ekranı 3 kat yoğun: 400 px'lik küçük kopya 133 noktadan, 1280 px'lik kopya
// 427 noktadan geniş gösterilince büyütülüp bulanıklaşıyordu (sanatçı sayfasındaki eserler, dönem sayfası, Tuval'in
// büyük tablosu). Görsel yüklenince ekranda kapladığı yere bakılır; gerçek pikseli yetmiyorsa bir üst kopya arkada
// indirilir ve hazır olunca yerine geçer (bu sırada küçük kopya görünür kalır; inemezse küçüğü kalır).
import { ustKopya, ADIMLAR } from './gorsel.js';

const ESIK = 0.8; // görselin pikseli / ekran pikseli; altı bulanık sayılır
const BUYUK_ALAN = 0.3; // ekranın bu kadarını kaplayan tablo en büyük kopyayı hak eder

export function keskinlik(img) {
  const r = img.getBoundingClientRect();
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!nw || !nh || r.width < 1 || r.height < 1) return Infinity;
  const fit = getComputedStyle(img).objectFit;
  const olcek = fit === 'contain' || fit === 'scale-down' ? Math.min(r.width / nw, r.height / nh) : Math.max(r.width / nw, r.height / nh);
  return 1 / (olcek * (window.devicePixelRatio || 1));
}

// Wikimedia küçük resmi: gereken genişliğe yeten hazır basamak (yoksa en büyüğü); özgün dosyadan büyükse adres hata verir,
// o zaman küçüğü kalır
function commonsUstu(src, k, nw) {
  const m = /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/.+\/)(\d+)px-([^/]+)$/.exec(src);
  if (!m) return '';
  const gerek = nw / k;
  const adim = ADIMLAR.find((a) => a >= gerek) || ADIMLAR[ADIMLAR.length - 1];
  return adim > Number(m[2]) ? `${m[1]}${adim}px-${m[3]}` : '';
}

// İş 82: telefona indirilmiş en büyük kopya (Ayarlar → en büyük kopyalar) varsa küçük yerde de kullanılır: indirme
// yok, yalnız gerektiğinde (1280 px kopya yetmiyorsa)
const KALICI = 'atlas-devasa-kalici';
function telefonda(url) {
  if (typeof caches === 'undefined') return Promise.resolve(false);
  return caches
    .open(KALICI)
    .then((c) => c.match(url))
    .then(Boolean)
    .catch(() => false);
}

function yukselt(img, ust) {
  img.dataset.keskinBekliyor = '1';
  const on = new Image();
  on.decoding = 'async';
  const bitir = () => delete img.dataset.keskinBekliyor;
  on.onload = () => {
    bitir();
    if (!img.isConnected) return;
    const once = img.currentSrc || img.src;
    img.src = on.src;
    img.dataset.keskin = once;
  };
  on.onerror = bitir;
  on.src = ust;
}

export function keskinlestir(img) {
  if (!img || !img.isConnected || img.dataset.keskinBekliyor || img.closest('.gor, .sayfa-katman')) return;
  const r = img.getBoundingClientRect();
  const k = keskinlik(img);
  if (r.width < 48 || k >= ESIK) return;
  const src = img.currentSrc || img.src;
  const commons = commonsUstu(src, k, img.naturalWidth);
  if (commons) return yukselt(img, commons);
  const buyuk = (r.width * r.height) / (innerWidth * innerHeight) >= BUYUK_ALAN;
  const ust = ustKopya(src, { buyuk: true });
  if (!ust) return;
  // en büyük kopya: ekranı büyük ölçüde kaplıyorsa her zaman; küçük yerde yalnız telefonda inmişse
  if (/\/d\/[0-9a-f]+(?:-[0-9a-f]+)?\.jpg$/.test(ust) && !buyuk) {
    img.dataset.keskinBekliyor = '1';
    telefonda(ust).then((var_) => {
      delete img.dataset.keskinBekliyor;
      if (var_) yukselt(img, ust);
    });
    return;
  }
  yukselt(img, ust);
}
