// "Bu görsel hatalı" bildirimleri (İ5). ilerleme.bildirimler = [{ a, s, baslik, neden, g, t }]
// a: eser anahtarı, s: sanatçı id, g: bildirilen görselin anahtarı. Ayarlar'dan JSON olarak kopyalanır.
import { secilenGorsel, gorselAnahtari } from './gorsel.js';

export const NEDENLER = ['Yanlış sanatçı', 'Heykel/mimari', 'Kötü görsel', 'Yanlış ad'];
const SINIR = 300;

export function bildirimlerDogrula(b) {
  if (!Array.isArray(b)) return [];
  return b
    .filter((x) => x && typeof x.a === 'string' && typeof x.s === 'string' && NEDENLER.includes(x.neden))
    .map((x) => ({ a: x.a, s: x.s, baslik: String(x.baslik || ''), neden: x.neden, g: typeof x.g === 'string' ? x.g : '', t: typeof x.t === 'string' ? x.t : '' }))
    .slice(0, SINIR);
}

// Bildirimi kaydeder ve eseri pekiştirmeden çıkarır (ilerleme.kotuGorseller üzerinden).
// "Kötü görsel": yalnızca gösterilen görsel çıkar; eserin başka görseli varsa eser kalır.
// Diğer nedenler: eserin bütün görselleri çıkar. Aynı eser, neden ve görsel tekrar bildirilirse kayıt tazelenir.
// Döndürür: bildirimden sonra seçilen görsel (kalmadıysa null).
export function eseriBildir(ilerleme, eser, gorsel, neden, tarih) {
  const kotuler = (ilerleme.kotuGorseller ||= {});
  if (!eser || !NEDENLER.includes(neden)) return eser ? secilenGorsel(eser, kotuler) : null;
  const g = gorsel || secilenGorsel(eser, kotuler) || (eser.gorseller || [])[0] || null;
  const gAnahtar = g ? gorselAnahtari(g) : '';
  const liste = (kotuler[eser.anahtar] ||= []);
  for (const x of neden === 'Kötü görsel' ? (g ? [g] : []) : eser.gorseller || []) {
    const a = gorselAnahtari(x);
    if (!liste.includes(a)) liste.push(a);
  }
  const b = (ilerleme.bildirimler ||= []);
  const i = b.findIndex((x) => x.a === eser.anahtar && x.neden === neden && x.g === gAnahtar);
  if (i >= 0) b.splice(i, 1);
  b.unshift({ a: eser.anahtar, s: eser.sid || '', baslik: eser.baslik || '', neden, g: gAnahtar, t: tarih });
  if (b.length > SINIR) b.length = SINIR;
  return secilenGorsel(eser, kotuler);
}

// Ayarlar'daki "kopyala" için: bir Claude oturumuna verilebilecek JSON
export function bildirimMetni(ilerleme) {
  return JSON.stringify({ uygulama: 'sanat-atlasi', tur: 'gorsel-bildirimleri', bildirimler: ilerleme.bildirimler || [] }, null, 1);
}
