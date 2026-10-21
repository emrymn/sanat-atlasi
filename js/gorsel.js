// Bir eserin görselleri: kaynağa göre URL, kaynak yazısı ve kullanıcının "kötü" işaretledikleri.
// Görsel biçimi: { k: 'commons'|'met'|'aic'|'cma'|'nga'|'wikiart', d?: Commons dosyası, u?: doğrudan URL,
//                  i?: IIIF kimliği/adresi, l?: lisans, s?: kaynak sayfası, p?: kalite puanı }
import { resimUrl, dosyaSayfasi, dosyaNormal } from './yardimci.js';
import { md5 } from './md5.js';

export const KAYNAK_ADI = {
  commons: 'Wikimedia Commons',
  met: 'The Met',
  aic: 'Art Institute of Chicago',
  cma: 'Cleveland Museum of Art',
  nga: 'National Gallery of Art',
  wikiart: 'WikiArt',
};

export function gorselAnahtari(g) {
  return g.k === 'commons' ? 'c:' + dosyaNormal(g.d).toLowerCase() : `${g.k}:${g.i || g.u}`;
}

// Wikimedia'nın hazır küçük resim basamakları; başka genişlik istenince yeniden üretilir ve 429'a takılır
export const ADIMLAR = [330, 500, 960, 1280, 1920];

// Commons küçük resmi doğrudan upload.wikimedia.org'dan (CORS'a açık, yönlendirmesiz).
// Özgün dosyadan büyük genişlikte bu adres hata verir: o zaman gorselYedek (Special:FilePath) kullanılır.
export function commonsKucuk(dosya, genislik) {
  const ad = dosyaNormal(dosya);
  const h = md5(ad);
  const uz = ((/\.([a-z0-9]+)$/i.exec(ad) || [])[1] || '').toLowerCase();
  const w = ADIMLAR.find((a) => a >= genislik) || ADIMLAR[ADIMLAR.length - 1];
  const on = /^tiff?$/.test(uz) ? 'lossy-page1-' : /^(pdf|djvu)$/.test(uz) ? 'page1-' : '';
  const ek = /^(jpe?g|png|gif|webp)$/.test(uz) ? '' : uz === 'svg' ? '.png' : '.jpg';
  const kod = encodeURIComponent(ad);
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${h[0]}/${h.slice(0, 2)}/${kod}/${on}${w}px-${kod}${ek}`;
}

// Birincil adres açılmazsa denenecek adres (data-yedek): Commons'ta Special:FilePath, diğerlerinde 800 px
export function gorselYedek(g) {
  if (!g) return '';
  return g.k === 'commons' ? resimUrl(g.d, 800) : gorselUrl(g, 800);
}

// Uygulamayla birlikte yayınlanan görsel kopyaları (data/yerel_gorseller.json; gorseller/ klasörü).
// Wikimedia'nın hız sınırı (429) ve müze engelleri (403) bu görselleri etkilemez. Anahtar: kaynak + özgün kimlik.
let yerel = {};
let buyukYerel = new Set();
// harita: { "kaynak:kimlik": "ad" }; buyuk: 1280 px kopyası da olanların anahtarları (başyapıtlar)
export function yerelGorselleriAyarla(harita, buyuk = []) {
  yerel = harita && typeof harita === 'object' && !Array.isArray(harita) ? harita : {};
  buyukYerel = new Set(Array.isArray(buyuk) ? buyuk : []);
}
export function yerelAnahtar(g) {
  return `${g.k}:${g.d || g.i || g.u || ''}`;
}
export function yerelUrl(g, genislik = 800) {
  const a = g && yerelAnahtar(g);
  const ad = a && yerel[a];
  if (!ad) return '';
  if (genislik <= 400) return `gorseller/k/${ad}.jpg`;
  // 1280 px kopya (buyuk listesinde); eski biçimdeki 800'lük kopya yalnızca listede yoksa
  return buyukYerel.has(a) || !buyukYerel.size ? `gorseller/b/${ad}.jpg` : `gorseller/${ad}.jpg`;
}

export function gorselUrl(g, genislik = 800) {
  if (!g) return '';
  const y = yerelUrl(g, genislik);
  if (y) return y;
  switch (g.k) {
    case 'commons':
      return commonsKucuk(g.d, genislik);
    case 'aic':
      return `https://www.artic.edu/iiif/2/${g.i}/full/${genislik <= 400 ? 400 : 843},/0/default.jpg`;
    case 'nga':
      return `${g.i}/full/!${genislik},${genislik}/0/default.jpg`;
    case 'wikiart':
      // Veride HalfHD (1366×800) ya da daha küçük özgün dosya; küçük resimde Large (750×600) yeter
      return genislik <= 400 ? String(g.u).replace(/!HalfHD\.jpg$/i, '!Large.jpg') : g.u;
    default:
      return g.u;
  }
}

// Palet çıkarmak için CORS'a açık adres. Commons'ta Special:FilePath yönlendirmesi CORS başlığı
// göndermediği için doğrudan upload.wikimedia.org küçük resmi (standart 330 px genişlik) kullanılır.
export const PALET_GENISLIGI = 330;
export function paletUrl(g) {
  if (!g) return '';
  if (yerelUrl(g, 400)) return yerelUrl(g, 400); // aynı köken: CORS sorunu yok
  if (g.k !== 'commons') return gorselUrl(g, 400);
  return commonsKucuk(g.d, PALET_GENISLIGI);
}

export function gorselSayfasi(g) {
  return g.k === 'commons' ? dosyaSayfasi(g.d) : g.s || '';
}

export function gorselKaynakYazisi(g) {
  if (g.k === 'wikiart') return 'Kaynak: WikiArt';
  return `${KAYNAK_ADI[g.k] || g.k}${g.l ? ' · ' + g.l : ''}`;
}

// Kullanıcının reddetmediği ilk (en iyi) görsel; hepsi reddedildiyse null
export function secilenGorsel(eser, kotuler = {}) {
  const red = new Set(kotuler[eser.anahtar] || []);
  return (eser.gorseller || []).find((g) => !red.has(gorselAnahtari(g))) || null;
}

// Görseli "kötü" işaretler (kotuler nesnesini değiştirir); sıradaki görseli döndürür
export function kotuIsaretle(eser, gorsel, kotuler) {
  const a = gorselAnahtari(gorsel);
  const liste = (kotuler[eser.anahtar] ||= []);
  if (!liste.includes(a)) liste.push(a);
  return secilenGorsel(eser, kotuler);
}

// Pekiştirmede kullanılabilir mi? (elle "kötü" işaretli tek görseli olanlar ve kullanıcı reddi hariç)
export function pekistirmeyeUygunMu(eser, kotuler = {}) {
  const g = secilenGorsel(eser, kotuler);
  return !!g && eser.pekistirme !== false && !(g.p !== undefined && g.p <= 5);
}
