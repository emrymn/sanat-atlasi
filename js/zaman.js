// Zaman (K2 · yıl kadranı): bir yıl seçilir, o yıl hayatta olan sanatçılar akımlarına göre listelenir.
// Saf fonksiyonlar (birim testli). Bkz. KARARLAR.md "İş 19" ve "1.76.5".

export const BAS = 1250;
export const SON = 2000;
export const ADIM = 10; // cetveldeki yoğunluk çubukları ve ‹ › düğmeleri

// Sanatçının yaşam aralığı [başlangıç, bitiş]; yıl bilinmiyorsa diğerinden tahmin, ikisi de yoksa null
export function yasamAraligi(s) {
  const bas = s.dogum ?? (s.olum != null ? s.olum - 60 : null);
  const son = s.olum ?? (s.dogum != null ? s.dogum + 60 : null);
  if (bas == null || son == null || son < BAS || bas > SON) return null;
  return [bas, son];
}

export const yilSinirla = (yil) => Math.max(BAS, Math.min(SON, Math.round(yil)));

// Yıl → piksel (cetvelin solu BAS)
export const yilX = (yil, px) => Math.round((yilSinirla(yil) - BAS) * px);

// O yıl hayatta olanlar (doğum ≤ yıl ≤ ölüm), doğum sırasıyla
export function yasayanlar(sanatcilar, yil) {
  const l = [];
  for (const s of sanatcilar) {
    const a = yasamAraligi(s);
    if (a && a[0] <= yil && yil <= a[1]) l.push({ s, bas: a[0], son: a[1] });
  }
  return l.sort((x, y) => x.bas - y.bas || x.son - y.son);
}

// Yaşadıklarını akımlara ayırır; akımlar kronolojik (akimlar.json sırası)
export function akimlaraAyir(liste, akimlar) {
  const sira = new Map(akimlar.map((a, i) => [a.ad, a.sira ?? i]));
  const gruplar = new Map();
  for (const x of liste) {
    if (!gruplar.has(x.s.akim)) gruplar.set(x.s.akim, []);
    gruplar.get(x.s.akim).push(x);
  }
  return [...gruplar]
    .map(([ad, l]) => ({ ad, l }))
    .sort((a, b) => (sira.get(a.ad) ?? 999) - (sira.get(b.ad) ?? 999));
}

// Hayatının yüzde kaçında (0–1); yaş tahmini ancak doğum biliniyorsa gösterilir
export const hayatPayi = (x, yil) => (x.son > x.bas ? Math.max(0, Math.min(1, (yil - x.bas) / (x.son - x.bas))) : 1);
export const yas = (s, yil) => (s.dogum != null ? yil - s.dogum : null);

// Cetvelin yoğunluk çubukları: her ADIM yılın ortasında kaç sanatçı hayatta, en kalabalık akım hangisi
export function yogunluk(sanatcilar, acikMi = () => true) {
  const l = [];
  for (let y = BAS; y < SON; y += ADIM) {
    const orta = y + ADIM / 2;
    const canli = yasayanlar(sanatcilar, orta);
    const say = new Map();
    for (const x of canli) say.set(x.s.akim, (say.get(x.s.akim) || 0) + 1);
    let akim = null;
    for (const [ad, n] of say) if (!akim || n > say.get(akim)) akim = ad;
    l.push({ yil: y, n: canli.length, acik: canli.some((x) => acikMi(x.s)), akim });
  }
  return l;
}

// "XVI. yüzyıl başı / ortası / sonu"
const ROMA = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
export function yuzyilEvresi(yil) {
  const y = Math.floor((yil - 1) / 100) + 1;
  const r = 'X'.repeat(Math.floor(y / 10)) + ROMA[y % 10];
  const icinde = (yil - 1) % 100;
  const evre = icinde < 33 ? 'başı' : icinde < 66 ? 'ortası' : 'sonu';
  return `${r}. yüzyıl ${evre}`;
}
