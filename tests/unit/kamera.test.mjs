import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kameraYolu, kameraKareleri, egri, KAMERA_EGRI, donusumOku, gorusAlani, durusa } from '../../js/kamera.js';

const yakin = (a, b, e = 1e-3) => Math.abs(a - b) < e;
const W = 390;
const orta = 400;

test('görüş alanı ve duruş birbirinin tersi', () => {
  const p = { tx: -120, ty: -340, s: 2.4 };
  const q = durusa(gorusAlani(p, W, orta), W, orta);
  assert.ok(yakin(q.tx, p.tx) && yakin(q.ty, p.ty) && yakin(q.s, p.s));
});

test('kamera yolu iki ucunda tam başlangıçta ve hedefte', () => {
  const a = { tx: 0, ty: 120, s: 0.3 };
  const b = { tx: -400, ty: -600, s: 1.6 };
  const y = kameraYolu(a, b, W, orta);
  assert.deepEqual(y.ornek(0), a);
  assert.deepEqual(y.ornek(1), b);
  const m = y.ornek(0.5);
  assert.ok(m.s > Math.min(a.s, b.s) * 0.5 && m.s < Math.max(a.s, b.s));
});

test('uzak iki ayrıntı arasında kamera önce biraz geri çekilir', () => {
  const a = durusa({ ux: 200, uy: 300, w: 150 }, W, orta);
  const b = durusa({ ux: 1100, uy: 900, w: 150 }, W, orta);
  const y = kameraYolu(a, b, W, orta);
  const ortaS = y.ornek(0.5).s;
  assert.ok(ortaS < a.s, 'ortada daha uzak');
  // yol düzgün: ardışık örneklerde ani sıçrama yok
  let onceki = gorusAlani(y.ornek(0), W, orta);
  for (let i = 1; i <= 50; i++) {
    const g = gorusAlani(y.ornek(i / 50), W, orta);
    assert.ok(Math.hypot(g.ux - onceki.ux, g.uy - onceki.uy) < 120);
    onceki = g;
  }
});

test('süre yolun uzunluğuyla artar, sınırlar içinde', () => {
  const a = durusa({ ux: 500, uy: 500, w: 900 }, W, orta);
  const kisa = kameraYolu(a, durusa({ ux: 520, uy: 500, w: 800 }, W, orta), W, orta);
  const uzun = kameraYolu(a, durusa({ ux: 100, uy: 900, w: 120 }, W, orta), W, orta);
  assert.ok(kisa.sure >= 750 && uzun.sure <= 1900 && uzun.sure > kisa.sure);
});

test('aynı noktada yalnız yakınlaşma', () => {
  const a = durusa({ ux: 300, uy: 300, w: 800 }, W, orta);
  const b = durusa({ ux: 300, uy: 300, w: 200 }, W, orta);
  const y = kameraYolu(a, b, W, orta);
  const g = gorusAlani(y.ornek(0.5), W, orta);
  assert.ok(yakin(g.ux, 300) && yakin(g.uy, 300) && yakin(g.w, 400, 1));
});

test('eğri: uçlar sabit, tekdüze artan, yavaş başlar', () => {
  assert.equal(KAMERA_EGRI(0), 0);
  assert.equal(KAMERA_EGRI(1), 1);
  let o = 0;
  for (let i = 1; i <= 100; i++) {
    const v = KAMERA_EGRI(i / 100);
    assert.ok(v >= o - 1e-9);
    o = v;
  }
  assert.ok(KAMERA_EGRI(0.1) < 0.1);
  assert.ok(yakin(egri(0, 0, 1, 1)(0.37), 0.37));
});

test('kareler ve dönüşüm okuma', () => {
  const y = kameraYolu({ tx: 0, ty: 0, s: 1 }, { tx: -50, ty: -80, s: 2 }, W, orta);
  const k = kameraKareleri(y, 10);
  assert.equal(k.length, 11);
  assert.equal(k[0].offset, 0);
  assert.equal(k[10].offset, 1);
  assert.deepEqual(donusumOku('matrix(2, 0, 0, 2, -50, -80)'), { s: 2, tx: -50, ty: -80 });
  assert.deepEqual(donusumOku('matrix3d(1.5, 0, 0, 0, 0, 1.5, 0, 0, 0, 0, 1, 0, 10, 20, 0, 1)'), { s: 1.5, tx: 10, ty: 20 });
  assert.equal(donusumOku('none'), null);
});
