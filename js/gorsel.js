// Bir eserin görselleri: kaynağa göre URL, kaynak yazısı ve kullanıcının "kötü" işaretledikleri.
// Görsel biçimi: { k: 'commons'|'met'|'aic'|'cma'|'nga', d?: Commons dosyası, u?: doğrudan URL,
//                  i?: IIIF kimliği/adresi, l?: lisans, s?: kaynak sayfası, p?: kalite puanı }
import { resimUrl, dosyaSayfasi, dosyaNormal } from './yardimci.js';

export const KAYNAK_ADI = {
  commons: 'Wikimedia Commons',
  met: 'The Met',
  aic: 'Art Institute of Chicago',
  cma: 'Cleveland Museum of Art',
  nga: 'National Gallery of Art',
};

export function gorselAnahtari(g) {
  return g.k === 'commons' ? 'c:' + dosyaNormal(g.d).toLowerCase() : `${g.k}:${g.i || g.u}`;
}

export function gorselUrl(g, genislik = 800) {
  if (!g) return '';
  switch (g.k) {
    case 'commons':
      return resimUrl(g.d, genislik);
    case 'aic':
      return `https://www.artic.edu/iiif/2/${g.i}/full/${genislik <= 400 ? 400 : 843},/0/default.jpg`;
    case 'nga':
      return `${g.i}/full/!${genislik},${genislik}/0/default.jpg`;
    default:
      return g.u;
  }
}

export function gorselSayfasi(g) {
  return g.k === 'commons' ? dosyaSayfasi(g.d) : g.s || '';
}

export function gorselKaynakYazisi(g) {
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
