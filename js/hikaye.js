// İş 169: Resimlerin hikâyesi (Emre: "çoğu resim bir olaya referans olarak yapılıyor ve seyirci bu olayları ve hikâyeleri
// bilmiyor; bu komplike resimlerin hikâyelerini açıklayıcı şekilde ver"). data/eser_hikayeleri.json:
// { surum, eserler: [{ anahtar (QID ya da "sanatçıId|başlık", rehberli incelemeyle aynı), sanatci, baslik,
//   olay: [paragraf] (Ne oluyor?), kim: [{ ad, metin, kutu?: [x, y, w, h] (0–1) }] (Kim kimdir?),
//   ressam?: [paragraf] (Ressamla bağı), gozden?: [madde] (Gözden kaçanlar) }] }
// Kutusu olan karakterler görüntüleyicide rehberli incelemenin altyapısıyla gezilir (numaralı noktalar, yakınlaşma).
import { ayrintiAnahtari, noktaGecerliMi } from './ayrinti.js';

const yazi = (x) => typeof x === 'string' && x.trim().length > 0;
const yazilar = (l) => Array.isArray(l) && l.length > 0 && l.every(yazi);

function karakterAl(k) {
  if (!k || !yazi(k.ad) || !yazi(k.metin)) return null;
  const c = { ad: k.ad, metin: k.metin };
  if (Array.isArray(k.kutu) && k.kutu.length === 4) {
    const [x, y, w, h] = k.kutu;
    if (noktaGecerliMi({ ad: k.ad, metin: k.metin, x, y, w, h })) c.kutu = [x, y, w, h];
  }
  return c;
}

// Geçerli kayıtlar (bozuk kayıt sessizce atlanır)
export function hikayeleriAl(json) {
  const l = json && Array.isArray(json.eserler) ? json.eserler : [];
  const sonuc = [];
  for (const e of l) {
    if (!e || !yazi(e.anahtar) || !yazi(e.baslik) || !yazilar(e.olay)) continue;
    const kim = Array.isArray(e.kim) ? e.kim.map(karakterAl).filter(Boolean) : [];
    sonuc.push({
      anahtar: e.anahtar,
      sanatci: e.sanatci || '',
      baslik: e.baslik,
      olay: e.olay,
      kim,
      ressam: yazilar(e.ressam) ? e.ressam : [],
      gozden: yazilar(e.gozden) ? e.gozden : [],
    });
  }
  return sonuc;
}

export function eserinHikayesi(liste, e) {
  const a = ayrintiAnahtari(e);
  return (a && (liste || []).find((k) => k.anahtar === a)) || null;
}

// Kutusu olan karakterler rehberli inceleme kaydı biçiminde
export function karakterKaydi(k) {
  const noktalar = (k.kim || []).filter((c) => c.kutu).map((c) => ({ ad: c.ad, metin: c.metin, x: c.kutu[0], y: c.kutu[1], w: c.kutu[2], h: c.kutu[3] }));
  return noktalar.length ? { birim: 'karakter', noktalar } : null;
}

// Hikâyenin metni (kacis: HTML kaçışı)
export function hikayeHtml(k, kacis) {
  const p = (l) => l.map((x) => `<p>${kacis(x)}</p>`).join('');
  const b = (t, ic) => `<section class="hikaye-bolum"><h3>${t}</h3>${ic}</section>`;
  return [
    b('Ne oluyor?', p(k.olay)),
    k.kim.length ? b('Kim kimdir?', `<ul class="hikaye-kim">${k.kim.map((c) => `<li><b>${kacis(c.ad)}</b> ${kacis(c.metin)}</li>`).join('')}</ul>`) : '',
    k.ressam.length ? b('Ressamla bağı', p(k.ressam)) : '',
    k.gozden.length ? b('Gözden kaçanlar', `<ul>${k.gozden.map((x) => `<li>${kacis(x)}</li>`).join('')}</ul>`) : '',
  ].join('');
}
