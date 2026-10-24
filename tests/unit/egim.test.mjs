// Telefonu eğince Bugün'ün tablosu (İş 32): jiroskop toplaması, açı yedeği (eğim hesabı, sıfır noktası, takla)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { egimHesapla, tabanIzle, donusIzle, donustenEgim, egimAcilari } from '../../js/egim.js';

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
  for (let i = 0; i < 4000; i++) t = tabanIzle(t, 60, 25);
  assert.ok(Math.abs(t.beta - 60) < 0.01 && Math.abs(t.gamma - 25) < 0.01);
});

test('jiroskop: dönüş hızı toplanır, bırakınca söner, birikim sınırlı', () => {
  let d = { x: 0, y: 0 };
  // sağa 60°/sn, 0,3 sn: ~18° birikir (sönüm biraz azaltır)
  for (let i = 0; i < 18; i++) d = donusIzle(d, { beta: 0, gamma: 60 }, 1 / 60);
  assert.ok(d.x > 15 && d.x < 18, String(d.x));
  assert.equal(d.y, 0);
  const e = donustenEgim(d);
  assert.ok(e.x > 0.7 && e.x < 0.82);
  assert.match(e.eksen, /deg$/);
  // bırakınca (hız 0) 3 sn sonra büyük ölçüde ortaya döner
  for (let i = 0; i < 180; i++) d = donusIzle(d, { beta: 0, gamma: 0 }, 1 / 60);
  assert.ok(Math.abs(d.x) < 3, String(d.x));
  // çok hızlı dönüşte birikim 33°'de durur
  for (let i = 0; i < 120; i++) d = donusIzle(d, { beta: -500, gamma: 500 }, 1 / 60);
  assert.equal(d.x, 33);
  assert.equal(d.y, -33);
  assert.deepEqual(donustenEgim(d), { x: 1, y: -1, eksen: '1.000 1.000 0 5.00deg' });
});

test('açı yedeği: dik tutuşta takla atan beta/gamma aynı duruş için aynı eğimi verir', () => {
  // aynı duruşun iki gösterimi: (beta, gamma) ve (180 - beta, gamma ± 180) — gamma ±90'ı aşamadığı için tarayıcı ikincisini verir
  const a = egimAcilari(100, 30);
  const b = egimAcilari(80, -150);
  assert.ok(Math.abs(a.on - b.on) < 1e-9 && Math.abs(a.yan - b.yan) < 1e-9);
  // olağan tutuş: düz sağa eğim yan açıya geçer
  const c = egimAcilari(0, 20);
  assert.ok(Math.abs(c.yan - 20) < 1e-9 && Math.abs(c.on) < 1e-9);
  // 359° ile 1° arası fark 2°
  assert.ok(Math.abs(egimHesapla(0, 1, { beta: 0, gamma: 359 }).x - 2 / 22) < 1e-9);
});
