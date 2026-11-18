// Gör adımının kamerası (1.89.1). Önceden resmin konumu ve ölçeği tek bir CSS geçişiyle, birbirinden bağımsız
// değişiyordu: iki ayrıntı arasında resim yamuk bir yoldan kayıyor, hep aynı sürede ve aynı eğriyle duruyordu
// (Emre: "mekanik ve sert"). Burada kamera bir göz gibi yürür: uzak iki ayrıntı arasında önce biraz geri çekilir,
// sonra yeni ayrıntıya yaklaşır (van Wijk ve Nuij'in yumuşak yakınlaşma yolu; d3-interpolate'teki interpolateZoom
// ile aynı formül). Süre yolun uzunluğuna göre uzar, yavaş başlar ve uzun, yumuşak bir inişle durur.
// Bu dosya DOM'a dokunmaz; ders ekranı yolu örnekleyip Web Animations ile oynatır.

const RHO = 1.15; // geri çekilmenin derinliği (d3'te √2; biraz daha az, resim kadrajdan çok uzaklaşmasın)

// Bir kamera duruşu { tx, ty, s }: resmin sol üst köşesinin ekrandaki yeri ve ölçek (transform-origin 0 0).
// Görüş alanına çevrilir: bakılan noktanın resimdeki yeri (ux, uy) ve görünen genişlik (w, resim pikseliyle).
export function gorusAlani(p, W, orta) {
  return { ux: (W / 2 - p.tx) / p.s, uy: (orta - p.ty) / p.s, w: W / p.s };
}
export function durusa(g, W, orta) {
  const s = W / g.w;
  return { tx: W / 2 - g.ux * s, ty: orta - g.uy * s, s };
}

// a'dan b'ye yumuşak yol. W: sahnenin genişliği, orta: bakılan alanın dikey ortası (ekran pikseli).
// Döner: ornek(t) (t 0..1 → duruş) ve sure (ms).
export function kameraYolu(a, b, W, orta) {
  const g0 = gorusAlani(a, W, orta);
  const g1 = gorusAlani(b, W, orta);
  const dx = g1.ux - g0.ux;
  const dy = g1.uy - g0.uy;
  const d2 = dx * dx + dy * dy;
  const r2 = RHO * RHO;
  let S;
  let ornek;
  if (d2 < 1e-6 * Math.max(1, g0.w * g0.w)) {
    // aynı noktada yalnız yakınlaşma ya da uzaklaşma
    S = Math.log(g1.w / g0.w) / RHO;
    ornek = (t) => durusa({ ux: g0.ux + t * dx, uy: g0.uy + t * dy, w: g0.w * Math.exp(RHO * t * S) }, W, orta);
  } else {
    const d1 = Math.sqrt(d2);
    const b0 = (g1.w * g1.w - g0.w * g0.w + r2 * r2 * d2) / (2 * g0.w * r2 * d1);
    const b1 = (g1.w * g1.w - g0.w * g0.w - r2 * r2 * d2) / (2 * g1.w * r2 * d1);
    const k0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
    const k1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
    S = (k1 - k0) / RHO;
    const ch0 = Math.cosh(k0);
    const sh0 = Math.sinh(k0);
    ornek = (t) => {
      const s = t * S;
      const u = (g0.w / (r2 * d1)) * (ch0 * Math.tanh(RHO * s + k0) - sh0);
      return durusa({ ux: g0.ux + u * dx, uy: g0.uy + u * dy, w: (g0.w * ch0) / Math.cosh(RHO * s + k0) }, W, orta);
    };
  }
  // uç noktalar tam olsun (yuvarlama birikmesin)
  const yol = (t) => (t <= 0 ? { ...a } : t >= 1 ? { ...b } : ornek(t));
  const sure = Math.round(Math.min(1900, Math.max(750, 520 + Math.abs(S) * 520)));
  return { ornek: yol, sure, uzunluk: Math.abs(S) };
}

// CSS cubic-bezier(x1, y1, x2, y2) eğrisi (zaman → ilerleme); örnekler yolun üzerine bu eğriyle dağıtılır
export function egri(x1, y1, x2, y2) {
  const bx = (t) => ((1 - 3 * x2 + 3 * x1) * t + (3 * x2 - 6 * x1)) * t * t + 3 * x1 * t;
  const by = (t) => ((1 - 3 * y2 + 3 * y1) * t + (3 * y2 - 6 * y1)) * t * t + 3 * y1 * t;
  const dbx = (t) => 3 * (1 - 3 * x2 + 3 * x1) * t * t + 2 * (3 * x2 - 6 * x1) * t + 3 * x1;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = bx(t) - x;
      if (Math.abs(e) < 1e-6) break;
      const d = dbx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    // Newton kaçarsa ikiye bölme
    if (!(t >= 0 && t <= 1) || Math.abs(bx(t) - x) > 1e-4) {
      let lo = 0;
      let hi = 1;
      t = x;
      for (let i = 0; i < 30; i++) {
        if (bx(t) < x) lo = t;
        else hi = t;
        t = (lo + hi) / 2;
      }
    }
    return by(t);
  };
}

// Kameranın eğrisi: yavaş kalkış, uzun ve yumuşak iniş (kamera bir yere "çarpmaz", yerine oturur)
export const KAMERA_EGRI = egri(0.45, 0.05, 0.2, 1);

// Yolu Web Animations karelerine çevirir (kareler arası doğrusal; eğri örneklemede uygulanır)
export function kameraKareleri(yol, adet = 40) {
  const kareler = [];
  for (let i = 0; i <= adet; i++) {
    const o = i / adet;
    const p = yol.ornek(KAMERA_EGRI(o));
    kareler.push({ offset: o, transform: donusum(p) });
  }
  return kareler;
}

export const donusum = (p) => `translate3d(${p.tx.toFixed(2)}px, ${p.ty.toFixed(2)}px, 0) scale(${p.s.toFixed(5)})`;

// getComputedStyle(...).transform → duruş (matrix(a, b, c, d, e, f) ya da matrix3d)
export function donusumOku(m) {
  if (!m || m === 'none') return null;
  const sayilar = m.slice(m.indexOf('(') + 1).match(/-?[\d.]+(?:e-?\d+)?/g);
  if (!sayilar) return null;
  const n = sayilar.map(Number);
  if (m.startsWith('matrix3d') && n.length >= 16) return { s: n[0], tx: n[12], ty: n[13] };
  if (n.length >= 6) return { s: n[0], tx: n[4], ty: n[5] };
  return null;
}
