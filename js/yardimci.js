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

// Kurs notlarından kalan "slayt/metin" açıklamalarını gösterimden atar (D8). Veri değişmez; yalnızca görünen yazı.
// "1401 (slayt yazısı)" → "1401", "slaytta c1308–11" → "c1308–11", "Slayta göre Uffizi" → "Uffizi",
// "metinde 1520'ler; slaytta c1500" → "1520'ler" (ders metninin verdiği tarih varken slayt notu düşer).
const NOT_KELIME = /(?<![\p{L}])(slayt\p{L}*|metin\p{L}*|metne|künye\p{L}*|altyaz\p{L}*)/iu;
const NOT_ONEK =
  /^(slayt\p{L}*\s+(künye\p{L}*|yazı\p{L}*|altyazı\p{L}*|etiket\p{L}*)(\s+göre)?|slayt\p{L}*(\s+göre)?|metin\p{L}*(\s+göre)?|metne\s+göre)\s*:?\s*/iu;
export function notTemizle(metin) {
  let s = String(metin ?? '');
  if (!NOT_KELIME.test(s)) return s;
  // parantez içi notlar: "(slayt yazısı)", "(slaytta: …)", "(metin)", "(metinde ikisi de geçer)"
  s = s.replace(/\s*\(([^()]*)\)/g, (tum, ic) => (NOT_KELIME.test(ic) ? '' : tum));
  const parcalar = s
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const onekli = NOT_ONEK.test(p);
      return { metin: p.replace(NOT_ONEK, '').trim(), slayt: onekli && /^slayt/i.test(p), metinden: onekli && /^met/i.test(p) };
    })
    .filter((p) => p.metin && !NOT_KELIME.test(p.metin));
  // ders metninden gelen bir tarih varsa slayttaki tarih tekrar sayılır ve düşer
  const kalan = parcalar.some((p) => p.metinden) ? parcalar.filter((p) => !p.slayt) : parcalar;
  return kalan.map((p) => p.metin).join('; ');
}
