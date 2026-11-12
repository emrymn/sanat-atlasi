import { notTemizle } from './yardimci.js';

// Başyapıt yakın okumaları (data/basyapitlar.json): veri doğrulama ve arama. Bkz. KARARLAR.md "İş 8".
// Kayıt: { anahtar (QID ya da "sanatçıId|başlık"), sanatci (id), baslik (Türkçe), ozgun, tarih, muze,
//          ozet, bolumler: [{ baslik, metin }], bak: [metin] }

const yazi = (x) => typeof x === 'string' && x.trim().length > 0;

export function basyapitlariAl(json, varMi = () => true) {
  const l = json && Array.isArray(json.eserler) ? json.eserler : [];
  return l.filter(
    (e) =>
      e &&
      yazi(e.anahtar) &&
      yazi(e.sanatci) &&
      varMi(e.sanatci) &&
      yazi(e.baslik) &&
      Array.isArray(e.bolumler) &&
      e.bolumler.length > 0 &&
      e.bolumler.every((b) => b && yazi(b.baslik) && yazi(b.metin)),
  ).map((e) => ({
    ...e,
    ozet: yazi(e.ozet) ? e.ozet : '',
    // ders notu artıkları gösterimden atılır (D8); anahtar değişmez
    tarih: notTemizle(e.tarih || ''),
    muze: notTemizle(e.muze || ''),
    ozgun: notTemizle(e.ozgun || ''),
    bak: Array.isArray(e.bak) ? e.bak.filter(yazi) : [],
  }));
}

export function basyapitBul(liste, anahtar) {
  return liste.find((e) => e.anahtar === anahtar) || null;
}

export function sanatcininBasyapitlari(liste, sanatciId) {
  return liste.filter((e) => e.sanatci === sanatciId);
}

// Uygulamadaki eser listesinde kaydın eseri (görsel için): önce QID, sonra "sanatçı|başlık"
export function eserEslestir(eserler, kayit) {
  return eserler.find((e) => (e.qid && e.qid === kayit.anahtar) || `${kayit.sanatci}|${e.baslik}` === kayit.anahtar) || null;
}

// Başyapıtlar sayfasının sahnesi (1.76.4): öne çıkan en çok `adet` eser. Hikâyesi olanlar (hikayeli: anahtar kümesi) başta;
// kalan yerler açık sanatçıların eserlerinden (hiç yoksa hepsinden), listeye yayılarak ve her gün (gun) başka bir
// yerden başlayarak dolar. Aynı eser iki kez gelmez.
export function oneCikanlar(l, hikayeli, acikMi = () => true, gun = Math.floor(Date.now() / 864e5), adet = 4) {
  const n = Math.min(adet, l.length);
  const one = l.filter((b) => hikayeli.has(b.anahtar)).slice(0, n);
  const acik = l.filter((b) => !one.includes(b) && acikMi(b));
  const kalan = acik.length ? acik : l.filter((b) => !one.includes(b));
  const adim = Math.max(1, Math.floor(kalan.length / adet));
  for (let i = 0; one.length < n && i < kalan.length; i++) {
    const b = kalan[(gun + i * adim) % kalan.length];
    if (!one.includes(b)) one.push(b);
  }
  for (const b of kalan) if (one.length < n && !one.includes(b)) one.push(b);
  for (const b of l) if (one.length < n && !one.includes(b)) one.push(b);
  return one;
}
