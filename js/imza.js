// Ressamın gerçek imzası (İş 48): Wikidata'daki imza görseli (P109, Commons dosyası), sanatçı sayfasında adın altında.
// Doğruluk kuralı: imza yalnız doğrulanmış QID'in kaydından gelir (önbellek dosyasındaki ya da canlı Wikidata'nın
// doğruladığı QID); QID yoksa ya da kayıtta imza yoksa hiçbir şey gösterilmez, tahmin yok.
// Sıra: data/imzalar.json (scripts/imzalar.mjs ile önceden hesaplanır; dosya yoksa atlanır) → IndexedDB (30 gün
// taze) → Wikidata wbgetentities. İmza yok bilgisi de saklanır, her açılışta yeniden sorulmaz.
import { idbAl, idbKoy } from './idb.js';
import { API, KULLANICI_AJANI, jsonGetiriciYap, gecerliIddialar } from './wikidata.js';
import { hazirOnbellek, tazeMi } from './eserler.js';
import { commonsKucuk } from './gorsel.js';

// Varlığın imza dosyası: önce "tercih edilen" sıradaki, yoksa ilk geçerli iddia; yoksa null
export function imzaDosyasi(varlik) {
  if (!varlik) return null;
  const iddialar = gecerliIddialar(varlik, 'P109');
  const c = iddialar.find((x) => x.rank === 'preferred') || iddialar[0];
  const v = c && c.mainsnak.datavalue.value;
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

const getir = jsonGetiriciYap({ basliklar: { 'Api-User-Agent': KULLANICI_AJANI }, deneme: 2, zamanAsimi: 15000 });
const anahtar = (id) => `imza:${id}`;

let hazirSozu = null;
function hazirImzalar() {
  if (!hazirSozu)
    hazirSozu = fetch('data/imzalar.json')
      .then((y) => (y.ok ? y.json() : null))
      .then((j) => (j && j.imzalar ? j.imzalar : null))
      .catch(() => null);
  return hazirSozu;
}

const bellek = new Map();

// Sanatçının imza dosyası (Commons dosya adı) ya da null
export function sanatciImzasi(s) {
  if (!bellek.has(s.id)) bellek.set(s.id, bul(s).catch(() => null));
  return bellek.get(s.id);
}

async function bul(s) {
  const hazir = await hazirImzalar();
  if (hazir && s.id in hazir) return hazir[s.id];
  const kayit = await idbAl('eserler', anahtar(s.id));
  if (kayit && tazeMi(kayit.zaman)) return kayit.dosya;
  const eski = kayit ? kayit.dosya : null;
  const onbellek = await hazirOnbellek();
  const qid = onbellek?.sanatcilar?.[s.id]?.qid || (await idbAl('eserler', s.id))?.qid;
  if (!qid || (typeof navigator !== 'undefined' && navigator.onLine === false)) return eski;
  try {
    const j = await getir(`${API}?action=wbgetentities&ids=${qid}&props=claims&format=json&origin=*`);
    const dosya = imzaDosyasi(j?.entities?.[qid]);
    await idbKoy('eserler', anahtar(s.id), { dosya, zaman: Date.now() });
    return dosya;
  } catch {
    bellek.delete(s.id); // geçici hata: sonraki açılışta yeniden denenir
    return eski;
  }
}

// İmza görselini mürekkep maskesine çevirir: koyu mürekkep opak, kâğıt zemini (beyaz ya da saydam) tamamen saydam;
// boş kenarlar kırpılır. Maskeyi temanın rengi boyar, böylece imza her temada yalnız mürekkep olarak görünür.
// Görsel CORS'a kapalıysa (tuval kirlenir) null: o zaman düz görsel gösterilir.
export function murekkepMaskesi(img, yukseklik = 240) {
  try {
    const olcek = Math.min(1, (yukseklik * 2) / Math.max(1, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * olcek));
    const h = Math.max(1, Math.round(img.naturalHeight * olcek));
    const t = document.createElement('canvas');
    t.width = w;
    t.height = h;
    const c = t.getContext('2d', { willReadFrequently: true });
    c.drawImage(img, 0, 0, w, h);
    const v = c.getImageData(0, 0, w, h);
    const p = v.data;
    let x0 = w;
    let y0 = h;
    let x1 = -1;
    let y1 = -1;
    for (let i = 0; i < p.length; i += 4) {
      const koyu = (1 - (0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]) / 255) * (p[i + 3] / 255);
      // kâğıt lekesi ve gölge kaybolur, mürekkep opak; arası yumuşak geçiş (kenar tırtıklanmaz)
      const t = Math.max(0, Math.min(1, (koyu - 0.12) / 0.5));
      const a = t * t * (3 - 2 * t);
      p[i] = p[i + 1] = p[i + 2] = 0;
      p[i + 3] = Math.round(a * 255);
      if (a > 0.1) {
        const k = i / 4;
        const x = k % w;
        const y = (k - x) / w;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
    if (x1 < 0) return null;
    // tablonun üstündeki imzanın fotoğrafı (mürekkep değil): maske dikdörtgen ya da leke olur, gösterilmez
    // (scripts/imza_maske.py'deki fotograf_mi ile aynı kural, kırpılmış alanda)
    let dolu = 0;
    let orta = 0;
    let say = 0;
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const a = p[(y * w + x) * 4 + 3];
        say++;
        if (a >= 128) dolu++;
        if (a >= 40 && a < 216) orta++;
      }
    if (dolu / say > 0.5 || orta / say > 0.15) return null;
    c.putImageData(v, 0, 0);
    const pay = 2;
    x0 = Math.max(0, x0 - pay);
    y0 = Math.max(0, y0 - pay);
    const kw = Math.min(w, x1 + pay + 1) - x0;
    const kh = Math.min(h, y1 + pay + 1) - y0;
    const k = document.createElement('canvas');
    k.width = kw;
    k.height = kh;
    k.getContext('2d').drawImage(t, x0, y0, kw, kh, 0, 0, kw, kh);
    return { adres: k.toDataURL('image/png'), en: kw, boy: kh };
  } catch {
    return null;
  }
}

function yukle(adres, cors = true) {
  return new Promise((coz, red) => {
    const img = new Image();
    if (cors) img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.fetchPriority = 'high';
    img.onload = () => coz(img);
    img.onerror = red;
    img.src = adres;
  });
}

// İmzayı isim bloğunda adın altına koyar. Önce uygulamayla gelen hazır maske (gorseller/imza/<id>.png,
// scripts/imza_maske.py üretir: ağa ve Wikimedia'nın hız sınırına bağlı değil); yoksa canlı görselden tuvalde maske.
// Maske yapılamazsa hiçbir şey gösterilmez: imza her zaman yalnız altın mürekkep olarak görünür, beyaz kâğıt yok.
export async function imzaGoster(s, kutu) {
  if (!kutu) return;
  const dosya = await sanatciImzasi(s);
  if (!dosya || !kutu.isConnected || kutu.querySelector('.imza')) return;
  let m = null;
  const yerel = `gorseller/imza/${encodeURIComponent(s.id)}.png`;
  const hazir = await yukle(yerel, false).catch(() => null);
  // tam adres: CSS değişkenindeki göreli url() stil dosyasına (css/) göre çözülürdü
  if (hazir) m = { adres: new URL(yerel, document.baseURI).href, en: hazir.naturalWidth, boy: hazir.naturalHeight };
  else {
    // küçük resim (CORS'lu); Wikimedia hız sınırına (429) takıldıysa birkaç saniye sonra bir kez daha
    const kucuk = commonsKucuk(dosya, 960); // büyük kaynak: maske 3 kat ekranda keskin kalsın
    const img = await yukle(kucuk)
      .catch(() => new Promise((r) => setTimeout(r, 4000)).then(() => yukle(kucuk)))
      .catch(() => null);
    m = img && murekkepMaskesi(img);
  }
  if (!m || !kutu.isConnected || kutu.querySelector('.imza')) return;
  const el = document.createElement('span');
  el.className = 'imza';
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', `${s.ad} imzası`);
  el.dataset.test = 'imza';
  el.dataset.dosya = dosya;
  el.style.aspectRatio = `${m.en} / ${m.boy}`;
  el.style.setProperty('--imza', `url("${m.adres}")`);
  // kap: maskeli öğe kendi gölgesini taşıyamaz; gölge (ana sayfada tablonun üstünde okunsun diye) kaba verilir
  const kap = document.createElement('span');
  kap.className = 'imza-kap';
  kap.append(el);
  const ad = kutu.querySelector('.isim');
  if (ad) ad.after(kap);
  else kutu.prepend(kap);
}
