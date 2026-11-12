// 1.77.0 · Renkli Gündüz: hazır paletler ve günün tablosundan üretilen palet her zaman okunur kalmalı
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resimdenPalet, gunduzPaleti, paletDegiskenleri, HAZIR_PALETLER, GUNDUZ_RENKLERI, YEDEK_PALET, PALET_DEGISKENLERI } from '../../js/gunduzRenk.js';
import { kontrast } from '../../js/tasarim.js';
import { hsl, hsldenHex, tonlariHesapla, RENK_AILELERI } from '../../js/renk.js';
import { ilerlemeDogrula, varsayilanIlerleme } from '../../js/depo.js';

function okunurMu(p, ad) {
  for (const z of [p.bg, p.surface]) {
    assert.ok(kontrast(p.ink, z) >= 7, `${ad}: mürekkep ${p.ink} / ${z}`);
    assert.ok(kontrast(p.ink2, z) >= 4.5, `${ad}: ikincil mürekkep ${p.ink2} / ${z}`);
    assert.ok(kontrast(p.ink3, z) >= 4.5, `${ad}: üçüncü mürekkep ${p.ink3} / ${z}`);
    assert.ok(kontrast(p.pirinc, z) >= 4.5, `${ad}: pirinç ${p.pirinc} / ${z}`);
    assert.ok(kontrast(p.etiket, z) >= 4.5, `${ad}: etiket ${p.etiket} / ${z}`);
  }
  assert.ok(kontrast(p.bandInk, p.band) >= 7, `${ad}: bant yazısı ${p.bandInk} / ${p.band}`);
  assert.ok(kontrast(p.bandInk2, p.band) >= 4.5, `${ad}: bant ikincil yazısı ${p.bandInk2} / ${p.band}`);
  assert.ok(kontrast(p.bandInk2, p.sekme) >= 4.5, `${ad}: sekme yazısı ${p.bandInk2} / ${p.sekme}`);
}

test('hazır paletlerin hepsi okunur (yazı ≥ 4.5, mürekkep ve bant yazısı ≥ 7)', () => {
  for (const [ad, p] of Object.entries(HAZIR_PALETLER)) okunurMu(p, ad);
});

// sınama için aile listesi: { ad: [pay, renk] }
const tablo = (a, acik = '#e8dcc0', renkOrani = 0.5) => ({
  aileler: RENK_AILELERI.map(([ad]) => (a[ad] ? { ad, pay: a[ad][0], renk: a[ad][1] } : { ad, pay: 0, renk: null })),
  acik,
  renkOrani,
});

test('günün tablosundan palet: rastgele 500 tabloda da okunur', () => {
  let tohum = 7;
  const rnd = () => ((tohum = (tohum * 1103515245 + 12345) % 2147483648) / 2147483648);
  let uretilen = 0;
  for (let i = 0; i < 500; i++) {
    const a = {};
    for (const [ad, bas, son] of RENK_AILELERI) {
      if (rnd() < 0.4) continue;
      const genis = (son - bas + 360) % 360;
      a[ad] = [rnd(), hsldenHex((bas + rnd() * genis) % 360, 0.3 + rnd() * 0.7, 0.1 + rnd() * 0.8)];
    }
    const top = Object.values(a).reduce((t, x) => t + x[0], 0) || 1;
    for (const k of Object.keys(a)) a[k][0] /= top;
    const p = resimdenPalet(tablo(a, rnd() < 0.8 ? hsldenHex(rnd() * 360, rnd(), 0.62 + rnd() * 0.38) : null));
    if (!p) continue;
    uretilen++;
    okunurMu(p, JSON.stringify(a));
  }
  assert.ok(uretilen > 300, `yalnız ${uretilen} palet üretildi`);
});

test('bant tablonun kimlik rengi: mavi ve altın tabloda bant mavi, vurgu altın; yeşil ve kırmızıda bant yeşil, vurgu kırmızı', () => {
  const p = resimdenPalet(tablo({ turuncu: [0.6, '#b07040'], mavi: [0.1, '#5878a0'], okr: [0.3, '#c8a040'] }));
  assert.ok(hsl(p.band)[0] > 190 && hsl(p.band)[0] < 250, `bant tonu ${hsl(p.band)[0]}`);
  assert.ok(hsl(p.altin)[0] >= 33 && hsl(p.altin)[0] <= 47, `altın tonu ${hsl(p.altin)[0]}`);
  assert.ok(hsl(p.bg)[2] > 0.8, 'zemin açık kalır');
  const q = resimdenPalet(tablo({ yesil: [0.48, '#3c6020'], kirmizi: [0.29, '#a03030'], turuncu: [0.2, '#a06030'] }));
  assert.ok(hsl(q.band)[0] > 70 && hsl(q.band)[0] < 170, `bant tonu ${hsl(q.band)[0]}`);
  assert.ok(hsl(q.altin)[0] < 15 || hsl(q.altin)[0] > 345, `vurgu tonu ${hsl(q.altin)[0]}`);
});

test('kimlik rengi olmayan tablo (yalnız ten, toprak, altın): bant siena, vurgu altın; sarı bant olmaz', () => {
  const p = resimdenPalet(tablo({ okr: [0.58, '#c8a040'], turuncu: [0.4, '#a86838'], mavi: [0.02, '#506070'] }));
  const [hb] = hsl(p.band);
  assert.ok(hb >= 10 && hb <= 30, `bant tonu ${hb}`);
  assert.ok(hsl(p.altin)[0] >= 33 && hsl(p.altin)[0] <= 47, `altın tonu ${hsl(p.altin)[0]}`);
});

test('renksiz tablo (gravür) palet üretmez; otomatik seçim hazır yedeğe düşer, Nötr null', () => {
  const gri = tablo({ turuncu: [1, '#806050'] }, '#eeeeee', 0.01);
  assert.equal(resimdenPalet(gri), null);
  assert.equal(resimdenPalet(null), null);
  assert.deepEqual(gunduzPaleti('otomatik', gri), HAZIR_PALETLER[YEDEK_PALET]);
  assert.deepEqual(gunduzPaleti('otomatik', null), HAZIR_PALETLER[YEDEK_PALET]);
  assert.deepEqual(gunduzPaleti('safran', gri), HAZIR_PALETLER.safran);
  assert.equal(gunduzPaleti('notr', gri), null);
});

test('tonlariHesapla: sarı vernikli tablodaki soluk mavi de mavi ailesine düşer; gri görselde renk oranı ~0', () => {
  const px = (renkler) => {
    const v = [];
    for (const [rgb, n] of renkler) for (let i = 0; i < n; i++) v.push(...rgb, 255);
    return new Uint8ClampedArray(v);
  };
  // Pontormo'nun cüppesi gibi: rgb(136,143,151), çevresi sıcak ten ve toprak
  const t = tonlariHesapla(px([[[208, 163, 121], 600], [[164, 126, 105], 300], [[136, 143, 151], 100]]));
  const mavi = t.aileler.find((a) => a.ad === 'mavi');
  assert.ok(mavi.pay >= 0.05, `mavi payı ${mavi.pay}`);
  assert.ok(t.renkOrani > 0.9);
  const g = tonlariHesapla(px([[[30, 30, 30], 500], [[200, 200, 200], 500]]));
  assert.equal(g.renkOrani, 0);
  assert.equal(resimdenPalet(g), null);
});

test('CSS değişkenleri: hepsi dolu, hep aynı anahtarlar', () => {
  for (const p of Object.values(HAZIR_PALETLER)) {
    const v = paletDegiskenleri(p);
    assert.deepEqual(Object.keys(v), PALET_DEGISKENLERI);
    for (const [k, x] of Object.entries(v)) assert.ok(typeof x === 'string' && x.length, k);
  }
});

test('ayar: varsayılan "Günün resmi"; tanınmayan değer varsayılana döner, geçerli seçim korunur', () => {
  assert.equal(varsayilanIlerleme().ayarlar.gunduzRenk, 'otomatik');
  for (const r of GUNDUZ_RENKLERI) {
    const i = varsayilanIlerleme();
    i.ayarlar.gunduzRenk = r;
    assert.equal(ilerlemeDogrula(i).ayarlar.gunduzRenk, r);
  }
  const i = varsayilanIlerleme();
  i.ayarlar.gunduzRenk = 'mor';
  assert.equal(ilerlemeDogrula(i).ayarlar.gunduzRenk, 'otomatik');
  delete i.ayarlar.gunduzRenk;
  assert.equal(ilerlemeDogrula(i).ayarlar.gunduzRenk, 'otomatik');
});
