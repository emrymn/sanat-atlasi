// İş 191 · Dersin kaynağı ve "ders bitti mi?" (haritanın ön koşulu). Emre: "bu ders kısmını geçmeden haritada
// ilerleyemeyelim, dersi bitirmeyi bir ön koşul olarak değiştirelim".
// data/ders_kaynaklari.json bir kez yüklenir; yüklenince her dersin adımları (Gör'ü olmayan derste Öğren ve Ayırt et)
// eşzamanlı sorulabilir hale gelir, böylece harita durumu (js/bolum.js bolumDurumlari) eşzamanlı kalır.
import { d, jsonGetir } from './ortak.js';
import { dersKaydi, dersDurumu } from '../ders.js';
import { dersAdimlari } from '../dersIcerik.js';

// 1.79.0 · dersin ve adımlarının adresleri
export const dersAdresi = (akim, adim = '') => `#/pekistir/ders/${encodeURIComponent(akim)}${adim ? `/${adim}` : ''}`;

let kaynakSozu = null;
let adimlar = null; // Map: akım → dersin adımları (kaynak yüklenince)

export function dersKaynagi() {
  kaynakSozu ||= jsonGetir('data/ders_kaynaklari.json')
    .then((k) => {
      adimlar = new Map(((k && k.dersler) || []).map((x) => [x.akim, dersAdimlari(x, d.yuruyus || {})]));
      return k;
    })
    .catch(() => {
      kaynakSozu = null; // çevrimdışı ilk açılış: sonraki açılışta yeniden denenir
      return null;
    });
  return kaynakSozu;
}

// Haritanın ön koşulu: dönemin dersi bitti mi? Kaynak henüz yüklenmediyse null (kapı uygulanmaz; harita ekranı ve bölüm
// turu kaynağı bekler). Dersi olmayan dönem için true.
export function dersBittiMi(akim) {
  if (!adimlar || window.__atlasDersKapisiYok) return null; // testler: kapı kapalı (tests/e2e/ortak.js)
  const a = adimlar.get(akim);
  return !a || dersDurumu(dersKaydi(d.ilerleme, akim), a).bitti;
}
