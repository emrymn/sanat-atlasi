// İş 80: keskin görseller. iPhone'un ekranı 3 kat yoğun: 400 px'lik küçük kopya 133 noktadan, 1280 px'lik kopya
// 427 noktadan geniş gösterilince büyütülüp bulanıklaşıyordu (sanatçı sayfasındaki eserler, dönem sayfası, Tuval'in
// büyük tablosu). Görsel yüklenince ekranda kapladığı yere bakılır; gerçek pikseli yetmiyorsa bir üst kopya arkada
// indirilir ve hazır olunca yerine geçer (bu sırada küçük kopya görünür kalır; inemezse küçüğü kalır).
import { ustKopya } from './gorsel.js';

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

export function keskinlestir(img) {
  if (!img || !img.isConnected || img.dataset.keskinBekliyor || img.closest('.gor, .sayfa-katman')) return;
  const r = img.getBoundingClientRect();
  if (r.width < 48 || keskinlik(img) >= ESIK) return;
  const buyuk = (r.width * r.height) / (innerWidth * innerHeight) >= BUYUK_ALAN;
  const ust = ustKopya(img.currentSrc || img.src, { buyuk });
  if (!ust) return;
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
