// Rehberli eser incelemesi (İş 151): data/eser_ayrintilari.json'daki ayrıntı noktaları. Görüntüleyicide tablonun
// üstünde numaralı noktalar; dokununca o bölgeye yakınlaşılır ve 2–3 cümlelik açıklama çıkar.
// Kayıt: { anahtar (QID ya da "sanatçıId|başlık"; data/basyapitlar.json'dakiyle aynı), sanatci, baslik, gorsel (yerel ad),
//          noktalar: [{ ad, x, y, w, h, metin }] } — x, y, w, h görselin en/boyuna oranla 0–1 (sol üst köşe + boy).
// Üretim ve denetim kuralları: scripts/ayrinti/TALIMAT.md; scripts/ayrinti/denetle.py aynı kuralları Python'da uygular.

export const EN_AZ_NOKTA = 4;
export const EN_COK_NOKTA = 6;
export const METIN_EN_AZ = 60; // karakter
export const METIN_EN_COK = 420;

const yazi = (x) => typeof x === 'string' && x.trim().length > 0;
const oran = (n) => Number.isFinite(n) && n >= 0 && n <= 1;

// Tek bir noktanın geçerliliği: koordinatlar 0–1 arasında, kutu görselin içinde, boyu makul, açıklama var
export function noktaGecerliMi(n) {
  if (!n || !yazi(n.ad) || !yazi(n.metin)) return false;
  if (![n.x, n.y, n.w, n.h].every(oran)) return false;
  if (n.w < 0.02 || n.h < 0.02) return false;
  if (n.x + n.w > 1.0001 || n.y + n.h > 1.0001) return false;
  return true;
}

// Veri dosyasından geçerli kayıtlar (bozuk kayıt sessizce atılır; denetle.py bunları ayrıca raporlar)
export function ayrintilariAl(json) {
  const l = json && Array.isArray(json.eserler) ? json.eserler : [];
  const sonuc = [];
  for (const e of l) {
    if (!e || !yazi(e.anahtar) || !Array.isArray(e.noktalar)) continue;
    const noktalar = e.noktalar.filter(noktaGecerliMi);
    if (noktalar.length < 1) continue;
    sonuc.push({ anahtar: e.anahtar, sanatci: e.sanatci || '', baslik: e.baslik || '', gorsel: e.gorsel || '', noktalar });
  }
  return sonuc;
}

// Uygulamadaki eser nesnesinin ayrıntı anahtarı: QID, yoksa "sanatçıId|başlık" (eserler.js sanatciEserleri sid verir)
export function ayrintiAnahtari(e) {
  if (!e) return '';
  if (e.qid) return e.qid;
  return e.sid && e.baslik ? `${e.sid}|${e.baslik}` : '';
}

export function ayrintiBul(liste, anahtar) {
  return (liste || []).find((k) => k.anahtar === anahtar) || null;
}

// Bir eser nesnesi için kayıt (yoksa null)
export function eserinAyrintisi(liste, e) {
  const a = ayrintiAnahtari(e);
  return a ? ayrintiBul(liste, a) : null;
}

// Noktaya yakınlaşma: görselin ölçek 1'deki kutusu (taban: {w, h}, px), sahnenin kutusu ({w, h}, px) ve nokta verilince
// hedef ölçek ve kayma. Ölçek: kutunun sahneye payla (pay) sığdığı en büyük değer, [enAz, enCok] arasında. Kayma:
// kutunun ortası sahnenin ortasına gelir (görüntüleyicide transform-origin ortadadır); kenarlar sahneyi aşmasın diye
// sınırlandırılır (küçük ölçekte görsel sahneden küçükse kayma 0).
export function noktaOdagi(nokta, taban, sahne, { pay = 0.78, enAz = 1.15, enCok = 6 } = {}) {
  if (!nokta || !taban || !sahne || !taban.w || !taban.h || !sahne.w || !sahne.h) return null;
  const kw = Math.max(0.02, nokta.w) * taban.w;
  const kh = Math.max(0.02, nokta.h) * taban.h;
  let olcek = Math.min((sahne.w * pay) / kw, (sahne.h * pay) / kh);
  olcek = Math.min(enCok, Math.max(enAz, olcek));
  // kutunun ortasının görselin ortasına uzaklığı (ölçek 1'de, px)
  const mx = (nokta.x + nokta.w / 2 - 0.5) * taban.w;
  const my = (nokta.y + nokta.h / 2 - 0.5) * taban.h;
  let tx = -mx * olcek;
  let ty = -my * olcek;
  const sx = Math.max(0, (taban.w * olcek - sahne.w) / 2);
  const sy = Math.max(0, (taban.h * olcek - sahne.h) / 2);
  tx = Math.min(sx, Math.max(-sx, tx));
  ty = Math.min(sy, Math.max(-sy, ty));
  return { olcek: Math.round(olcek * 1000) / 1000, tx: Math.round(tx) || 0, ty: Math.round(ty) || 0 };
}

// Noktanın işaretinin yeri (görselin kutusuna göre yüzde): kutunun ortası
export function noktaYeri(n) {
  return { x: Math.round((n.x + n.w / 2) * 10000) / 100, y: Math.round((n.y + n.h / 2) * 10000) / 100 };
}
