// İş 106 · Dokunsal geri bildirim (Emre: "doğru/yanlış cevapta hafif titreşim, Ayarlar'dan aç/kapa").
// Android: navigator.vibrate (doğruda bir, yanlışta iki darbe).
// iPhone: Safari `navigator.vibrate`'i desteklemez. iOS 18'den beri anahtar biçimli onay kutusu
// (<input type="checkbox" switch>) değişince sistem hafif bir "tık" verir; ama Emre'nin iPhone'unda (iOS 27) yalnız
// PARMAĞIN değdiği anahtar titretti, kodla tıklanan hiçbir gizli anahtar titretmedi (deneme/titresim.html, 0–8).
// Parmakla dokunulan etiketin içindeki gizli anahtar (yöntem 7) titrettiği için cevap düğmelerinin içine düğmeyi
// tamamen kaplayan bir etiket konur (TIK). Dokunuş etikete gelir, etiket kendi anahtarını çevirir (iPhone burada titrer),
// sonra düğmenin kendisine tıklanır; uygulamanın işleyicileri hep düğmenin tıklamasını görür. iPhone'da doğru ile yanlış
// ayırt edilemez: tık, cevap denetlenmeden parmağın değdiği anda gelir.

// Düğmenin içine konur (düğme position: relative olmalı; css/app.css .tik). Yalnız titreşim açıkken ve
// navigator.vibrate olmayan tarayıcıda (iPhone) çizilir: Android kendi titreşimini kullanır, cevap da gecikmeden işlenir.
export const TIK = '<label class="tik" data-tik aria-hidden="true"><input type="checkbox" switch tabindex="-1"></label>';

export function tik(acik, ortam = typeof navigator !== 'undefined' ? navigator : null) {
  return acik && !(ortam && typeof ortam.vibrate === 'function') ? TIK : '';
}

// Etiketin ve anahtarın kendi tıklamaları uygulamaya ulaşmaz; onların yerine sahibi olan düğmeye bir kez tıklanır.
// Anahtarın tıklaması (dolayısıyla iPhone'un tık titreşimi) bitmeden düğme yeniden çizilmesin diye sonraki turda.
export function tikleriKur(belge = typeof document !== 'undefined' ? document : null) {
  if (!belge) return;
  let bekleyen = null;
  const sahibeTikla = (etiket) => {
    clearTimeout(bekleyen);
    const sahip = etiket.parentElement;
    bekleyen = setTimeout(() => {
      bekleyen = null;
      if (sahip && sahip.isConnected && !sahip.disabled) sahip.click();
    }, 0);
  };
  belge.addEventListener(
    'click',
    (e) => {
      const t = e.target;
      const etiket = t && t.closest && t.closest('[data-tik]');
      if (!etiket) return;
      e.stopPropagation();
      if (t.tagName === 'INPUT') sahibeTikla(etiket);
      // etiketin kendi tıklaması: tarayıcı birazdan anahtara tıklar; tıklamazsa da düğme yine tıklansın
      else bekleyen = setTimeout(() => sahibeTikla(etiket), 60);
    },
    { capture: true },
  );
}

// tur: 'dogru' | 'yanlis'; acik: Ayarlar'daki seçim; ortam testler için değiştirilebilir. Yalnız vibrate olan
// tarayıcılarda (Android) titretir; iPhone'da titreşimi düğmedeki TIK verir.
export function titret(tur, acik = true, ortam = typeof navigator !== 'undefined' ? navigator : null) {
  if (!acik) return 'kapali';
  if (!ortam || typeof ortam.vibrate !== 'function') return 'yok';
  try {
    return ortam.vibrate(tur === 'dogru' ? 14 : [18, 70, 18]) ? 'vibrate' : 'yok';
  } catch {
    return 'yok';
  }
}
