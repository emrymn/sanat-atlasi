// Zaman şeridi (K2): sanatçıların yaşam çizgileri ve akım bantları için yerleşim. Saf fonksiyonlar (birim testli).
// Bkz. KARARLAR.md "İş 19".

export const BAS = 1250;
export const SON = 2000;
export const PX_EN_AZ = 1.2;
export const PX_EN_COK = 14;

// Sanatçının yaşam aralığı [başlangıç, bitiş]; yıl bilinmiyorsa diğerinden tahmin, ikisi de yoksa null
export function yasamAraligi(s) {
  const bas = s.dogum ?? (s.olum != null ? s.olum - 60 : null);
  const son = s.olum ?? (s.dogum != null ? s.dogum + 60 : null);
  if (bas == null || son == null || son < BAS || bas > SON) return null;
  return [bas, son];
}

// Yıl → piksel (şeridin solu BAS)
export const yilX = (yil, px) => Math.round((Math.max(BAS, Math.min(SON, yil)) - BAS) * px);

// Öğeleri üst üste binmeyecek şeritlere dağıtır (açgözlü). oge: { bas, son, etiketPx }
// Her öğe [x, max(x + w, x + etiketPx) + bosluk] alanını kaplar.
export function seritle(ogeler, px, { bosluk = 10 } = {}) {
  const sonlar = [];
  return ogeler
    .slice()
    .sort((a, b) => a.bas - b.bas || a.son - b.son)
    .map((o) => {
      const x = yilX(o.bas, px);
      const w = Math.max(3, yilX(o.son, px) - x);
      const bitis = Math.max(x + w, x + (o.etiketPx || 0)) + bosluk;
      let serit = sonlar.findIndex((s) => s <= x);
      if (serit < 0) serit = sonlar.push(0) - 1;
      sonlar[serit] = bitis;
      return { ...o, x, w, serit };
    });
}

// Sanatçı çubukları: harf genişliği yaklaşık (serif 13 px ≈ 6.6 px/harf)
export function sanatciSeritleri(sanatcilar, px, { harf = 6.6, adFn = (s) => s.ad } = {}) {
  const ogeler = [];
  for (const s of sanatcilar) {
    const a = yasamAraligi(s);
    if (a) ogeler.push({ s, bas: a[0], son: a[1], etiketPx: Math.ceil(adFn(s).length * harf) });
  }
  return seritle(ogeler, px);
}

// Akım bantları: üyelerin çalışma hayatı (doğum + 20 … ölüm)
export function akimBantlari(akimlar, sanatcilar, px, { harf = 7 } = {}) {
  const ogeler = [];
  for (const a of akimlar) {
    const uyeler = sanatcilar
      .filter((s) => s.akim === a.ad)
      .map(yasamAraligi)
      .filter(Boolean);
    if (!uyeler.length) continue;
    const bas = Math.min(...uyeler.map((x) => Math.min(x[0] + 20, x[1])));
    const son = Math.max(...uyeler.map((x) => x[1]));
    ogeler.push({ ad: a.ad, renk: a.renk, bas, son, etiketPx: Math.min(Math.ceil(a.ad.length * harf), 60) });
  }
  return seritle(ogeler, px, { bosluk: 4 });
}

// Eksen çentikleri: yakınlaştıkça sıklaşır
export function centikler(px) {
  const adim = px >= 6 ? 10 : px >= 3 ? 25 : 50;
  const l = [];
  for (let y = BAS; y <= SON; y += adim) l.push({ yil: y, buyuk: y % 100 === 0 });
  return l;
}

export function pxSinirla(px) {
  return Math.max(PX_EN_AZ, Math.min(PX_EN_COK, px));
}
