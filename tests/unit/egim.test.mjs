// Telefonu eğince Bugün'ün tablosu (İş 32): eğim hesabı ve sıfır noktası
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { egimHesapla, tabanIzle } from '../../js/egim.js';

test('eğim: tutuş açısı sıfır, 22° tam etki, sınırın ötesi kırpılır', () => {
  const taban = { beta: 40, gamma: 0 };
  assert.deepEqual(egimHesapla(40, 0, taban), { x: 0, y: 0, eksen: '0 1 0 0deg' });
  const sag = egimHesapla(40, 11, taban);
  assert.equal(sag.x, 0.5);
  assert.equal(sag.y, 0);
  assert.equal(egimHesapla(40, 90, taban).x, 1);
  assert.equal(egimHesapla(40, -90, taban).x, -1);
  assert.equal(egimHesapla(80, 0, taban).y, 1);
});

test('eğim: sağa eğince dikey eksende, öne eğince yatay eksende döner; açı en çok 5°', () => {
  const taban = { beta: 0, gamma: 0 };
  assert.equal(egimHesapla(0, 22, taban).eksen, '0.000 1.000 0 5.00deg');
  assert.equal(egimHesapla(22, 0, taban).eksen, '-1.000 0.000 0 5.00deg');
  // köşegen: büyüklük 1'de kırpılır
  assert.match(egimHesapla(22, 22, taban).eksen, / 5\.00deg$/);
});

test('sıfır noktası: ilk ölçüme oturur, sonra yeni tutuşa yavaşça kayar', () => {
  const t0 = tabanIzle(null, 40, 5);
  assert.deepEqual(t0, { beta: 40, gamma: 5 });
  const t1 = tabanIzle(t0, 60, 5, 0.5);
  assert.deepEqual(t1, { beta: 50, gamma: 5 });
  let t = t0;
  for (let i = 0; i < 2000; i++) t = tabanIzle(t, 60, 25);
  assert.ok(Math.abs(t.beta - 60) < 0.01 && Math.abs(t.gamma - 25) < 0.01);
});
