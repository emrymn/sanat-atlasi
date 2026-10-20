// Tasarım yardımcıları: akım renkleri, kontrast, yüzyıl aralığı, ince çizgi SVG ikonlar.

// WCAG göreli parlaklık ve kontrast oranı
function parlaklik(hex) {
  const h = hex.replace('#', '');
  const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

export function kontrast(a, b) {
  const [x, y] = [parlaklik(a), parlaklik(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

// Akım rengi metinde yalnızca zemine karşı kontrast yeterliyse (≥ 4.5) kullanılır
export function metinRengi(renk, zemin) {
  return renk && zemin && kontrast(renk, zemin) >= 4.5 ? renk : null;
}

// Yıl → yüzyıl numarası (MÖ için negatif): 1305 → 14, 1300 → 13, -450 → -5
export function yuzyil(yil) {
  return yil > 0 ? Math.floor((yil - 1) / 100) + 1 : -(Math.floor(-yil / 100) + 1);
}

function yuzyilYaz(y) {
  return y < 0 ? `MÖ ${-y}.` : `${y}.`;
}

// "13.–14. yüzyıl" ya da "15. yüzyıl"
export function yuzyilAraligi(bas, son) {
  if (bas == null && son == null) return '';
  const a = yuzyil(bas ?? son);
  const b = yuzyil(son ?? bas);
  return a === b ? `${yuzyilYaz(a)} yüzyıl` : `${yuzyilYaz(a)}–${yuzyilYaz(b)} yüzyıl`;
}

// Bir akımın sanatçılarından yüzyıl aralığı (çalışma hayatı: doğum + 20 … ölüm)
export function akimYuzyillari(uyeler) {
  const bas = uyeler.map((s) => (s.dogum != null ? s.dogum + 20 : s.olum != null ? s.olum - 30 : null)).filter((x) => x != null);
  const son = uyeler.map((s) => s.olum ?? (s.dogum != null ? s.dogum + 60 : null)).filter((x) => x != null);
  if (!bas.length) return '';
  return yuzyilAraligi(Math.min(...bas), Math.max(...son));
}

const YOLLAR = {
  geri: '<path d="M15 5l-7 7 7 7"/>',
  ileri: '<path d="M9 5l7 7-7 7"/>',
  kapat: '<path d="M6 6l12 12M18 6L6 18"/>',
  dogru: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  yanlis: '<path d="M7 7l10 10M17 7L7 17"/>',
  kilit: '<rect x="5.5" y="10.5" width="13" height="9" rx="1.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  buyut: '<path d="M14 5h5v5M10 19H5v-5M19 5l-6 6M5 19l6-6"/>',
};

// İnce çizgi ikon (dekoratif; erişilebilir ad düğmede verilir)
export function ikon(ad, boyut = 20) {
  return `<svg class="ikon" width="${boyut}" height="${boyut}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${YOLLAR[ad] || ''}</svg>`;
}
