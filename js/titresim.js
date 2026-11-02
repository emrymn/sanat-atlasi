// İş 106 · Dokunsal geri bildirim (Emre: "doğru/yanlış cevapta hafif titreşim, Ayarlar'dan aç/kapa").
// iPhone'da Safari `navigator.vibrate`'i desteklemez. iOS 18'den beri anahtar biçimli onay kutusu
// (<input type="checkbox" switch>) değişince sistem hafif bir "tık" titreşimi verir: görünmez bir anahtarın etiketine
// tıklanarak tetiklenir. Resmî bir API değil; çalışmazsa sessizce hiçbir şey olmaz. Android'de vibrate kullanılır.
// Doğru: tek tık · yanlış/bilmiyorum: iki tık. Dokunuşa yanıt olarak (tıklama işleyicisinin içinde) çağrılmalı.

const ARALIK = 110; // iki tık arası (ms)

function iosTik() {
  if (typeof document === 'undefined') return;
  const etiket = document.createElement('label');
  etiket.setAttribute('aria-hidden', 'true');
  etiket.setAttribute('data-titresim-gizli', ''); // js/dokunus.js bu tıklamayı saymaz
  etiket.style.display = 'none';
  const kutu = document.createElement('input');
  kutu.type = 'checkbox';
  kutu.setAttribute('switch', '');
  kutu.tabIndex = -1;
  etiket.appendChild(kutu);
  document.head.appendChild(etiket);
  etiket.click();
  etiket.remove();
}

// tur: 'dogru' | 'yanlis'; acik: Ayarlar'daki seçim; ortam testler için değiştirilebilir
export function titret(tur, acik = true, ortam = typeof navigator !== 'undefined' ? navigator : null) {
  if (!acik) return 'kapali';
  const iki = tur !== 'dogru';
  if (ortam && typeof ortam.vibrate === 'function') {
    try {
      if (ortam.vibrate(iki ? [18, 70, 18] : 14)) return 'vibrate';
    } catch {
      /* desteklemiyor: iOS yoluna düş */
    }
  }
  try {
    iosTik();
    if (iki) setTimeout(iosTik, ARALIK);
    return 'ios';
  } catch {
    return 'yok';
  }
}
