// Her akımın kendi harfi (İş 48): akım sayfasının büyük başlığı ve haritadaki dönem adları o dönemin yazısına yakın
// bir yazı tipiyle yazılır (Gotik'te kırık harf, Rönesans'ta Roma büyük harfleri, Venedik'te Aldus italiği,
// Neoklasisizm'de Bodoni…). Yalnız başlıklarda; metinler okunaklı kalır.
// Seçilenlerin hepsinde Türkçe harfler var (Google Fonts latin-ext; ş, ğ, ı, İ olmayanlar elendi: UnifrakturMaguntia,
// IM Fell, Federo…). Yazı tipi yalnız başlığın harfleri için indirilir (css2 &text=), servis çalışanı saklar;
// inmezse uygulamanın kendi serifi kalır.

// aile: Google Fonts adı; italik / kalinlik isteğe bağlı; olcek: yazı tipi gözle büyük ya da küçük duruyorsa başlık boyu çarpanı
export const AKIM_HARFLERI = {
  'Antik Yunan ve Roma': { aile: 'Marcellus' },
  Romanesk: { aile: 'Uncial Antiqua', olcek: 0.86 },
  Gotik: { aile: 'Grenze Gotisch', kalinlik: 500, olcek: 1.14 },
  'Uluslararası Gotik': { aile: 'Grenze Gotisch', kalinlik: 500, olcek: 1.14 },
  'Erken Rönesans': { aile: 'Cinzel', olcek: 0.86 },
  'Kuzey Rönesansı': { aile: 'Pirata One' },
  'Yüksek Rönesans': { aile: 'Cinzel', olcek: 0.86 },
  'Venedik Rönesansı': { aile: 'EB Garamond', italik: true, olcek: 1.08 },
  Maniyerizm: { aile: 'Cinzel Decorative', olcek: 0.8 },
  'İtalyan Barok ve Caravaggizm': { aile: 'Libre Caslon Display' },
  'İspanyol Barok': { aile: 'Libre Caslon Display' },
  'Flaman Barok': { aile: 'Libre Caslon Display' },
  'Hollanda Altın Çağı': { aile: 'Libre Caslon Display' },
  'Fransız Klasisizmi': { aile: 'Cormorant Garamond', kalinlik: 500, olcek: 1.06 },
  'Geç İtalyan Barok': { aile: 'Libre Caslon Display' },
  Rokoko: { aile: 'Petit Formal Script', olcek: 0.84 },
  Neoklasisizm: { aile: 'Bodoni Moda' },
  Romantizm: { aile: 'Playfair Display', italik: true },
  Prerafaelitler: { aile: 'Almendra' },
  'Akademizm ve Oryantalizm': { aile: 'Gilda Display' },
  'Barbizon ve Realizm': { aile: 'Old Standard TT' },
  Empresyonizm: { aile: 'Fraunces', italik: true, kalinlik: 300 },
  'Ukiyo-e (Japon baskısı)': { aile: 'Shippori Mincho', kalinlik: 500 },
  'Post-Empresyonizm': { aile: 'Gloock' },
  Sembolizm: { aile: 'Fredericka the Great', olcek: 0.9 },
  'Art Nouveau ve Viyana Secession': { aile: 'Poiret One' },
  Ekspresyonizm: { aile: 'Big Shoulders Display', kalinlik: 800, olcek: 1.06 },
  Kübizm: { aile: 'Major Mono Display', olcek: 0.78 },
  Dada: { aile: 'Rubik Mono One', olcek: 0.72 },
  Sürrealizm: { aile: 'Syne', kalinlik: 700, olcek: 0.86 },
  'Savaş sonrası figürasyon': { aile: 'Space Grotesk', kalinlik: 600, olcek: 0.9 },
};

// Haritanın dokuz dönemi (js/harita.js BOLGELER kimlikleri)
export const BOLGE_HARFLERI = {
  ortacag: AKIM_HARFLERI.Gotik,
  ronesans: AKIM_HARFLERI['Erken Rönesans'],
  barok: AKIM_HARFLERI['İtalyan Barok ve Caravaggizm'],
  barok2: AKIM_HARFLERI['Fransız Klasisizmi'],
  aydinlanma: AKIM_HARFLERI.Rokoko,
  romantik: AKIM_HARFLERI.Romantizm,
  empresyonizm: AKIM_HARFLERI.Empresyonizm,
  postempresyonizm: AKIM_HARFLERI['Post-Empresyonizm'],
  modern: AKIM_HARFLERI['Savaş sonrası figürasyon'],
};

// Google Fonts css2 adresi; metin verilirse yalnız onun harfleri indirilir (Türkçe harfler dahil, birkaç KB)
export function fontAdresi(h, metin = '') {
  const aile = h.aile.replace(/ /g, '+');
  const eksen = h.italik ? `:ital,wght@1,${h.kalinlik || 400}` : h.kalinlik ? `:wght@${h.kalinlik}` : '';
  const harfler = metin ? `&text=${encodeURIComponent([...new Set(metin)].sort().join(''))}` : '';
  return `https://fonts.googleapis.com/css2?family=${aile}${eksen}${harfler}&display=swap`;
}

// Uygulamanın kendi yazı tipi (index.html yükler): ayrıca indirilmez
const HAZIR = new Set(['Bodoni Moda']);
const yuklenen = new Set();

function yukle(h, metin) {
  if (HAZIR.has(h.aile) || typeof document === 'undefined') return;
  const adres = fontAdresi(h, metin);
  if (yuklenen.has(adres)) return;
  yuklenen.add(adres);
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = adres;
  document.head.appendChild(l);
}

// el'in yazısını h harfiyle yazar. Başlık boyu, harfi eklemeden önceki boyun olcek katı.
export function harfUygula(el, h) {
  if (!el || !h) return;
  yukle(h, el.textContent.trim());
  if (h.olcek && h.olcek !== 1) {
    const boy = parseFloat(getComputedStyle(el).fontSize);
    if (boy) el.style.fontSize = `${(boy * h.olcek).toFixed(1)}px`;
  }
  el.classList.add('donem-harfi');
  el.style.fontFamily = `'${h.aile}', var(--serif)`;
  el.style.fontStyle = h.italik ? 'italic' : 'normal';
  el.style.fontWeight = String(h.kalinlik || 400);
}
