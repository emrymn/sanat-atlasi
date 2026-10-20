// Wikimedia Commons "Paintings by <sanatçı>" kategorileri (alt kategoriler değil, yalnızca doğrudan dosyalar).
// Kategori adı sanatçının Wikidata Commons kategorisinden (P373) türetilir. Bu kategorilerin doğrudan
// dosyaları arasında kartpostal ve galeri fotoğrafları çok olduğu için yalnızca müze taraması ya da
// Google Art Project kaynaklı dosyalar alınır.
export const TARAMA =
  /google[ _]art[ _]project|\bwga\d+|metropolitan[ _]museum|\bmet[ _]d[pt]\d|rijksmuseum|nationalmuseum|mauritshuis|the[ _]yorck[ _]project|national[ _]gallery[ _]of[ _]art/i;
import { onbellekli, bekle } from './ortak.mjs';
import { jsonGetiriciYap, KULLANICI_AJANI } from '../../js/wikidata.js';

// Commons API sık sık 429 döndürür: az deneme, başarısızsa kaynak atlanır
const getir = jsonGetiriciYap({ basliklar: { 'User-Agent': KULLANICI_AJANI }, deneme: 3, zamanAsimi: 30000 });

const API = 'https://commons.wikimedia.org/w/api.php';

// "Johannes Vermeer - Girl with a Pearl Earring (1665) - Google Art Project.jpg" → { baslik, yil }
// haricYillar: sanatçının doğum/ölüm yılları (dosya adındaki yaşam aralığı eser yılı sanılmasın)
export function dosyaBasligi(dosya, adlar = [], haricYillar = []) {
  let s = String(dosya)
    .replace(/^File:/i, '')
    .replace(/\.(jpe?g|png|tiff?|gif|webp)$/i, '')
    .replace(/_/g, ' ');
  const yil = [...s.matchAll(/\b(1[2-9]\d\d)\b/g)].map((m) => Number(m[1])).find((y) => !haricYillar.includes(y));
  for (const ad of adlar) if (ad) s = s.replace(new RegExp(ad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), ' ');
  s = s
    .replace(/google art project/gi, ' ')
    .replace(/\b(wga\d+|dp\d+|dt\d+|crop(ped)?|edit|retouched|adj|hi[- ]?res)\b/gi, ' ')
    .replace(/\((\s*c?\.?\s*1[2-9]\d\d[^)]*)\)/g, ' ')
    .replace(/\b1[2-9]\d\d\b/g, ' ')
    .replace(/\s*[-–,;]\s*(?=[-–,;]|$)/g, ' ')
    .replace(/^[\s\-–,;:.]+|[\s\-–,;:.]+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return { baslik: s, yil: yil ?? null };
}

export async function commonsEserleri(sanatci, kategori, adlar = [], enFazla = 15) {
  if (!kategori) return [];
  const baslik = `Category:Paintings by ${kategori}`;
  let y;
  try {
    y = await onbellekli(`commons-kat:${baslik}`, async () => {
      await bekle(1500);
      return getir(`${API}?action=query&list=categorymembers&cmtitle=${encodeURIComponent(baslik)}&cmtype=file&cmlimit=50&format=json`);
    });
  } catch {
    return [];
  }
  const dosyalar = ((y.query && y.query.categorymembers) || []).map((m) => m.title.replace(/^File:/, '').replace(/ /g, '_'));
  return dosyalar
    .filter((d) => TARAMA.test(d))
    .map((d) => ({ d, ...dosyaBasligi(d, adlar, [sanatci.dogum, sanatci.olum]) }))
    .filter((x) => x.baslik.length >= 3)
    .slice(0, enFazla)
    .map((x) => ({
      kaynak: 'commons',
      kimlik: x.d,
      baslik: x.baslik,
      yil: x.yil,
      muze: '',
      tur: 'Painting',
      populer: -1,
      gorsel: { k: 'commons', d: x.d, l: '' },
    }));
}
