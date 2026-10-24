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

// 14 → "XIV" (yüzyıllar için yeter: 1–39)
export function roma(n) {
  return 'X'.repeat(Math.floor(n / 10)) + ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'][n % 10];
}

function yuzyilYaz(y, r) {
  const n = Math.abs(y);
  const yazi = r ? roma(n) : `${n}.`;
  return y < 0 ? `MÖ ${yazi}` : yazi;
}

// "13.–14. yüzyıl" ya da "15. yüzyıl"; roma: true → "XIII–XIV. yüzyıl", "XV. yüzyıl"
export function yuzyilAraligi(bas, son, { roma: r = false } = {}) {
  if (bas == null && son == null) return '';
  const a = yuzyil(bas ?? son);
  const b = yuzyil(son ?? bas);
  const nokta = r ? '.' : '';
  return a === b ? `${yuzyilYaz(a, r)}${nokta} yüzyıl` : `${yuzyilYaz(a, r)}–${yuzyilYaz(b, r)}${nokta} yüzyıl`;
}

// Bir akımın sanatçılarından yüzyıl aralığı (çalışma hayatı: doğum + 20 … ölüm)
export function akimYuzyillari(uyeler, secenek) {
  const bas = uyeler.map((s) => (s.dogum != null ? s.dogum + 20 : s.olum != null ? s.olum - 30 : null)).filter((x) => x != null);
  const son = uyeler.map((s) => s.olum ?? (s.dogum != null ? s.dogum + 60 : null)).filter((x) => x != null);
  if (!bas.length) return '';
  return yuzyilAraligi(Math.min(...bas), Math.max(...son), secenek);
}

const YOLLAR = {
  geri: '<path d="m15 18-6-6 6-6"/>',
  ileri: '<path d="m9 18 6-6-6-6"/>',
  asagi: '<path d="m6 9 6 6 6-6"/>',
  kapat: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  dogru: '<path d="M20 6 9 17l-5-5"/>',
  yanlis: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  kilit: '<rect x="5.5" y="10.5" width="13" height="9" rx="1.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  buyut: '<path d="M14 5h5v5M10 19H5v-5M19 5l-6 6M5 19l6-6"/>',
  karsilastir: '<rect x="3" y="4" width="7.5" height="16" rx="1.5"/><rect x="13.5" y="4" width="7.5" height="16" rx="1.5"/>',
  ara: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  arti: '<path d="M12 5v14M5 12h14"/>',
  eksi: '<path d="M5 12h14"/>',
  daha: '<circle cx="5.5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18.5" cy="12" r="1.2"/>',
  isaret: '<path d="M6.5 4h11a1 1 0 0 1 1 1v15l-6.5-4-6.5 4V5a1 1 0 0 1 1-1z"/>',
  kitap:'<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
  // sekme çubuğu (tasarım A mockup'larındaki çizgi ikonlar)
  bugun:
    '<path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/>',
  gozat: '<path d="M3 22h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M12 2l8 5H4z"/>',
  pekistir:
    '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/><path d="M22 17.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>',
  ilerleme: '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  // sekme çubuğu: atölye nesneleri — şövale, pusula, çerçeve, palet, eskiz defteri
  'sekme-bugun': '<rect x="5" y="3" width="14" height="10" rx="1"/><path d="M12 1.5V3"/><path d="M12 13v8"/><path d="m8.5 21 2-8"/><path d="m15.5 21-2-8"/><path d="m8 10 2.5-3 2 2 1.5-1.5L16 10"/>',
  'sekme-harita': '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/><path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21"/>',
  'sekme-gozat': '<rect x="3" y="3.5" width="18" height="17" rx="1"/><rect x="6.5" y="7" width="11" height="10"/><path d="m6.5 15 3-3 2.5 2.5 2-2 3.5 3.5"/>',
  'sekme-pekistir': '<path d="M12 3a9 9 0 1 0 0 18c1 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.5-.7-.5-1.1 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5C21 6.3 17 3 12 3z"/><circle cx="7.5" cy="11.5" r="1"/><circle cx="9.5" cy="7.5" r="1"/><circle cx="14.5" cy="7.5" r="1"/>',
  'sekme-ilerleme': '<rect x="5" y="4" width="14" height="17" rx="1.5"/><path d="M8.5 2.5v3M12 2.5v3M15.5 2.5v3"/><path d="M8 16c1.4-3.2 2.8-3.2 3.8 0s2.6 1.2 4.2-3"/>',
  // yolculuk haritası: katlanmış harita ve üstünde yol
  harita: '<path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5"/><path d="M15 6.5V20"/>',
  gunes: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
  ay: '<path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z"/>',
  ayarlar:
    '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
};

// İnce çizgi ikon (dekoratif; erişilebilir ad düğmede verilir)
export function ikon(ad, boyut = 20, kalinlik = 1.6) {
  return `<svg class="ikon" width="${boyut}" height="${boyut}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${kalinlik}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${YOLLAR[ad] || ''}</svg>`;
}
