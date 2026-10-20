// Küçük, saf yardımcılar.

export function kacis(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

// Tohumlanabilir rastgele sayı üreteci (testler için) — mulberry32
export function rastgeleYap(tohum = Date.now()) {
  let a = tohum >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function karistir(dizi, rng = Math.random) {
  const a = dizi.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function yilYaz(y) {
  if (y === null || y === undefined || y === '') return '?';
  return y < 0 ? `MÖ ${-y}` : String(y);
}

export function yillarYaz(s) {
  if (s.dogum == null && s.olum == null) return 'tarih bilinmiyor';
  if (s.dogum == null) return `ö. ${yilYaz(s.olum)}`;
  if (s.olum == null) return `d. ${yilYaz(s.dogum)}`;
  if (s.dogum < 0 && s.olum < 0) return `MÖ ${-s.dogum}–${-s.olum}`;
  return `${yilYaz(s.dogum)}–${yilYaz(s.olum)}`;
}

// Başlık karşılaştırması için normalleştirme
export function baslikNormal(s) {
  return String(s || '')
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Commons dosya adı: bazıları veride %xx kodlu, bazıları değil. Tek biçime getir.
export function dosyaNormal(ad) {
  let s = String(ad || '').trim();
  if (/%[0-9A-Fa-f]{2}/.test(s)) {
    try {
      s = decodeURIComponent(s);
    } catch (e) {
      /* olduğu gibi */
    }
  }
  s = s.replace(/^File:/i, '').replace(/ /g, '_');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function resimUrl(dosya, genislik = 800) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(dosyaNormal(dosya))}?width=${genislik}`;
}

export function dosyaSayfasi(dosya) {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(dosyaNormal(dosya))}`;
}

// Sayıdan sonra bulunma eki: 3'te, 9'da, 12'de, 40'ta …
export function bulunmaEki(n) {
  const sayi = Math.abs(Math.trunc(n));
  const birler = ['', 'de', 'de', 'te', 'te', 'te', 'da', 'de', 'de', 'da'];
  const onlar = ['', 'da', 'de', 'da', 'ta', 'de', 'ta', 'de', 'de', 'da'];
  if (sayi === 0) return `${n}'da`;
  if (sayi % 10) return `${n}'${birler[sayi % 10]}`;
  if (sayi % 100) return `${n}'${onlar[(sayi / 10) % 10]}`;
  return `${n}'de`; // yüz, bin
}
