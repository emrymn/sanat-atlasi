import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tanismaGerekirMi, tanismaEserleri, karisanAnahtari, karisanEkle, enCokKarisanlar, karisanlarDogrula } from '../../js/ogrenme.js';

const gorulmus = { kutu: 1, dogru: 1, yanlis: 0, son: '2026-10-20', vade: '2026-10-21' };

test('tanışma yalnızca hiç sorulmamış sanatçıda', () => {
  assert.equal(tanismaGerekirMi(undefined), true);
  assert.equal(tanismaGerekirMi({}), true);
  assert.equal(tanismaGerekirMi({ sanatci: gorulmus }), false);
  assert.equal(tanismaGerekirMi({ akim: gorulmus }), false);
});

test('tanışma eserleri: en bilinenler, sorulacak eser hariç, en fazla 3', () => {
  const h = [
    { anahtar: 'a', sl: 5 },
    { anahtar: 'b', sl: 50 },
    { anahtar: 'c', sl: 20 },
    { anahtar: 'd', sl: 40 },
    { anahtar: 'e' },
  ];
  assert.deepEqual(
    tanismaEserleri(h, 'b').map((e) => e.anahtar),
    ['d', 'c', 'a'],
  );
  assert.deepEqual(
    tanismaEserleri(h.slice(0, 2), 'b').map((e) => e.anahtar),
    ['a'],
  );
});

test('karıştırılan ikili: anahtar sırasız, sayaç artar', () => {
  assert.equal(karisanAnahtari('monet', 'sisley'), karisanAnahtari('sisley', 'monet'));
  const i = {};
  assert.equal(karisanEkle(i, 'monet', 'sisley', '2026-10-20'), 1);
  assert.equal(karisanEkle(i, 'sisley', 'monet', '2026-10-21'), 2);
  assert.deepEqual(i.karisanlar, { 'monet|sisley': { n: 2, son: '2026-10-21' } });
  assert.equal(karisanEkle(i, 'monet', 'monet', '2026-10-21'), 0);
  assert.equal(karisanEkle(i, 'monet', null, '2026-10-21'), 0);
});

test('en çok karıştırılanlar: eşik, sıra, var olmayan sanatçı süzülür', () => {
  const k = {
    'a|b': { n: 3, son: '2026-10-01' },
    'c|d': { n: 1, son: '2026-10-20' },
    'e|f': { n: 3, son: '2026-10-10' },
    'g|x': { n: 5, son: '2026-10-10' },
  };
  const l = enCokKarisanlar(k, { varMi: (id) => id !== 'x' });
  assert.deepEqual(
    l.map((x) => `${x.a}|${x.b}`),
    ['e|f', 'a|b'],
  );
});

test('karıştırılanlar doğrulaması: bozuk girdiler atılır, anahtar sıralanır', () => {
  assert.deepEqual(karisanlarDogrula(null), {});
  assert.deepEqual(karisanlarDogrula([]), {});
  assert.deepEqual(
    karisanlarDogrula({ 'z|a': { n: 2, son: '2026-10-01' }, 'a|a': { n: 1 }, tek: { n: 1 }, 'b|c': { n: 0 }, 'd|e': { n: 1.5 }, 'f|g': { n: 1 } }),
    { 'a|z': { n: 2, son: '2026-10-01' }, 'f|g': { n: 1, son: '' } },
  );
});
