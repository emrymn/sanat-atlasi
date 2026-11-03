// İş 114 · Harita penceresini aşağı çekerek kapatma (Emre: "aşağı indirince kapanacak şekilde ayarla çünkü aşağı
// kaydırmada haritayı kaydırıyor"). Pencerenin üstündeki dokunuşlar haritaya geçmez: içerik en üstteyken aşağı çekiş
// pencereyi parmakla birlikte indirir, yeterince çekilince (ya da hızlı fırlatılınca) kapanır, az çekilince geri yaylanır;
// içerik kaydırılabiliyorsa önce içerik kayar, ucuna gelince sayfa (harita) kaymaz.

export const KAPAT_MESAFE = 90; // pt
export const KAPAT_HIZ = 0.5; // pt/ms (hızlı fırlatma)

// Bırakınca: 'kapat' ya da 'geri'
export function birakmaKarari(dy, hiz) {
  return dy > KAPAT_MESAFE || (dy > 24 && hiz > KAPAT_HIZ) ? 'kapat' : 'geri';
}

// Parmak kayarken: 'surukle' (pencereyi indir) · 'icerik' (içerik kendi kaysın) · 'engelle' (sayfa kaymasın)
export function hareketKarari(dy, ustte, altta) {
  if (dy > 0 && ustte) return 'surukle';
  if (dy < 0 && altta) return 'engelle';
  return 'icerik';
}

// kutu: pencere kabı (.harita-pencere); kapat(): pencereyi gizleyen işlev
export function surukleKapatKur(kok, kutuSec, kapat) {
  let bas = null;
  kok.addEventListener(
    'touchstart',
    (e) => {
      const kutu = kutuSec();
      const ic = kutu && !kutu.hidden && e.target.closest && e.target.closest('.harita-pencere-ic');
      if (!ic || e.touches.length !== 1) return (bas = null);
      bas = { ic, y: e.touches[0].clientY, t: performance.now(), dy: 0, son: [], surukluyor: false };
    },
    { passive: true },
  );
  kok.addEventListener(
    'touchmove',
    (e) => {
      if (!bas) return;
      const y = e.touches[0].clientY;
      const dy = y - bas.y;
      const { ic } = bas;
      const ustte = ic.scrollTop <= 0;
      const altta = ic.scrollTop + ic.clientHeight >= ic.scrollHeight - 1;
      const karar = bas.surukluyor ? 'surukle' : hareketKarari(dy, ustte, altta);
      bas.son.push({ y, t: performance.now() });
      if (bas.son.length > 5) bas.son.shift();
      if (karar === 'icerik') return;
      e.preventDefault(); // harita (sayfa) kaymasın
      if (karar === 'engelle') return;
      bas.surukluyor = true;
      bas.dy = Math.max(0, dy);
      ic.style.transition = 'none';
      ic.style.transform = `translateY(${bas.dy}px)`;
      ic.style.opacity = String(1 - Math.min(0.4, bas.dy / 600));
    },
    { passive: false },
  );
  const bitir = () => {
    if (!bas) return;
    const { ic, surukluyor, dy, son } = bas;
    bas = null;
    if (!surukluyor) return;
    const ilk = son[0];
    const sonu = son[son.length - 1];
    const hiz = ilk && sonu && sonu.t > ilk.t ? (sonu.y - ilk.y) / (sonu.t - ilk.t) : 0;
    ic.style.transition = 'transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.22s';
    if (birakmaKarari(dy, hiz) === 'kapat') {
      ic.style.transform = 'translateY(110%)';
      ic.style.opacity = '0';
      setTimeout(() => {
        kapat();
        ic.style.transform = ic.style.opacity = ic.style.transition = '';
      }, 200);
    } else {
      ic.style.transform = '';
      ic.style.opacity = '';
      setTimeout(() => (ic.style.transition = ''), 240);
    }
  };
  kok.addEventListener('touchend', bitir, { passive: true });
  kok.addEventListener('touchcancel', bitir, { passive: true });
}
