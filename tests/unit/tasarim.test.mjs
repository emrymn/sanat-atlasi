import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kontrast, metinRengi, yuzyil, yuzyilAraligi, akimYuzyillari, ikon } from '../../js/tasarim.js';
import { akimlar } from './yardimci.mjs';

test('kontrast oranı (WCAG)', () => {
  assert.equal(Math.round(kontrast('#000000', '#FFFFFF')), 21);
  assert.equal(kontrast('#777777', '#777777'), 1);
  assert.ok(kontrast('#352B21', '#F8F2E6') > 10);
});

test('akım rengi metinde yalnızca kontrast yeterliyse', () => {
  assert.equal(metinRengi('#2B4A9A', '#F8F2E6'), '#2B4A9A');
  assert.equal(metinRengi('#C9A227', '#F8F2E6'), null, 'Post-Empresyonizm sarısı açık zeminde metin olamaz');
  assert.equal(metinRengi('#C9A227', '#26221E'), '#C9A227', 'koyu zeminde olur');
});

test('her akımın geçerli bir rengi var', () => {
  for (const a of akimlar) assert.match(a.renk, /^#[0-9A-F]{6}$/i, a.ad);
});

test('yüzyıl hesabı ve aralık yazımı', () => {
  assert.equal(yuzyil(1300), 13);
  assert.equal(yuzyil(1301), 14);
  assert.equal(yuzyil(-450), -5);
  assert.equal(yuzyilAraligi(1420, 1490), '15. yüzyıl');
  assert.equal(yuzyilAraligi(1270, 1340), '13.–14. yüzyıl');
  assert.equal(yuzyilAraligi(null, null), '');
  assert.equal(akimYuzyillari([{ dogum: 1267, olum: 1337 }]), '13.–14. yüzyıl');
});

test('ikon: dekoratif SVG', () => {
  assert.match(ikon('geri'), /^<svg[^>]*aria-hidden="true"/);
});
