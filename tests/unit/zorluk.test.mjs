import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { zorlukDilimi, kolaylikAl, eserSec } from '../../js/eserler.js';
import { tanismaEserleri } from '../../js/ogrenme.js';

const eserler = [
  { anahtar: 'a', p: 10 },
  { anahtar: 'b', p: 8 },
  { anahtar: 'c', p: 6 },
  { anahtar: 'd', p: 4 },
  { anahtar: 'e', p: 2 },
];
const kol = (e) => e.p;
const adlar = (l) => l.map((e) => e.anahtar);

test('zorluk dilimi: yeni/zayıf → kolay yarı, ileri → zor yarı, orta → hepsi', () => {
  assert.deepEqual(adlar(zorlukDilimi(eserler, kol, 0)), ['a', 'b', 'c']);
  assert.deepEqual(adlar(zorlukDilimi(eserler, kol, 1)), ['a', 'b', 'c']);
  assert.deepEqual(adlar(zorlukDilimi(eserler, kol, 2)), ['a', 'b', 'c', 'd', 'e']);
  assert.deepEqual(adlar(zorlukDilimi(eserler, kol, 5)), ['c', 'd', 'e']);
});

test('zorluk dilimi: puan yoksa ya da azsa süzme yok; puansızlar uçlarda düşer', () => {
  assert.equal(zorlukDilimi(eserler, null, 0).length, 5);
  assert.equal(zorlukDilimi(eserler, kol, null).length, 5);
  const tekPuan = [{ anahtar: 'x', p: 9 }, { anahtar: 'y' }];
  assert.equal(zorlukDilimi(tekPuan, kol, 0).length, 2);
  const karisik = [{ anahtar: 'x', p: 9 }, { anahtar: 'y' }, { anahtar: 'z', p: 3 }];
  assert.deepEqual(adlar(zorlukDilimi(karisik, kol, 0)), ['x']);
});

test('eserSec seviyeye göre dilimden seçer', () => {
  const l = eserler.map((e) => ({ ...e, gorseller: [{ k: 'commons', d: e.anahtar + '.jpg' }] }));
  for (let i = 0; i < 20; i++) {
    const r = () => i / 20;
    assert.ok(['a', 'b', 'c'].includes(eserSec(l, [], r, {}, { kolaylik: kol, seviye: 0 }).anahtar));
    assert.ok(['c', 'd', 'e'].includes(eserSec(l, [], r, {}, { kolaylik: kol, seviye: 4 }).anahtar));
  }
});

test('kolaylık dosyası: 2–10 dışı ve bozuk değerler atılır', () => {
  assert.deepEqual(kolaylikAl(null), {});
  assert.deepEqual(kolaylikAl({ kolaylik: { a: 7, b: 11, c: 1, d: '5', e: 2 } }), { a: 7, e: 2 });
});

test('tanışma eserleri: puan varsa en kolaylar önce', () => {
  const l = [
    { anahtar: 'a', sl: 50, p: 3 },
    { anahtar: 'b', sl: 10, p: 9 },
    { anahtar: 'c', sl: 30 },
    { anahtar: 'd', sl: 5, p: 7 },
  ];
  assert.deepEqual(adlar(tanismaEserleri(l, 'x', 3, kol)), ['b', 'd', 'a']);
  assert.deepEqual(adlar(tanismaEserleri(l, 'x', 3)), ['a', 'c', 'b']);
});

test('data/eser_zorluk.json (varsa): biçim', () => {
  const yol = new URL('../../data/eser_zorluk.json', import.meta.url);
  if (!existsSync(yol)) return;
  const k = kolaylikAl(JSON.parse(readFileSync(yol, 'utf8')));
  assert.ok(Object.keys(k).length > 100);
});
