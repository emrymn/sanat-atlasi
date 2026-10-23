// Yolculuk haritası (İş 23)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { BOLGELER, bolgeBul, haritaKur, yildiz, yolNoktasi, durakKonumlari, yolParcasi, yeniAcilanDuraklar, gorulenDogrula } from '../../js/harita.js';
import { ilerlemeDogrula } from '../../js/depo.js';

const akimlar = JSON.parse(readFileSync(new URL('../../data/akimlar.json', import.meta.url), 'utf8'));

test('her akım bir bölgeye düşer; bölgeler sırayla ve çakışmadan; her bölgenin resmi var', () => {
  for (const a of akimlar) assert.ok(bolgeBul(a.sira), a.ad);
  for (let i = 1; i < BOLGELER.length; i++) assert.equal(BOLGELER[i].ilk, BOLGELER[i - 1].son + 1);
  for (const b of BOLGELER) {
    assert.ok(existsSync(new URL(`../../gorseller/harita/${b.id}.webp`, import.meta.url)), b.id);
    assert.ok(b.yol.length >= 4);
    for (const [x, y] of b.yol) assert.ok(x > 0 && x < 1 && y > 0 && y < 1, `${b.id} ${x},${y}`);
    // yol alttan yukarı: ilk nokta son noktadan aşağıda
    assert.ok(b.yol[0][1] > b.yol[b.yol.length - 1][1]);
  }
  // telefonda üst üste binmesin: bir adada en çok 5 durak (bugünkü akımlarla)
  for (const b of BOLGELER) assert.ok(akimlar.filter((a) => bolgeBul(a.sira).id === b.id).length <= 5, b.id);
});

test('duraklar, yıldızlar ve "buradasın"', () => {
  const durumlar = [
    { ad: 'Gotik', sira: 2, acik: true, acikSayisi: 2, toplam: 3, acilacagiKonu: 5 },
    { ad: 'Erken Rönesans', sira: 4, acik: true, acikSayisi: 1, toplam: 4, acilacagiKonu: 9 },
    { ad: 'Barok X', sira: 9, acik: false, acikSayisi: 0, toplam: 3, acilacagiKonu: 30 },
  ];
  const il = { seviyeler: { Gotik: { s: 2, son: [1, 1, 1, 1, 1] }, 'Erken Rönesans': { s: 1, son: [] }, 'Barok X': { s: 2, son: [] } } };
  const h = haritaKur(durumlar, il);
  assert.equal(h.simdiki, 'Erken Rönesans');
  assert.deepEqual(
    h.duraklar.map((x) => x.yildiz),
    [3, 1, 0],
  ); // kilitli durak yıldız göstermez
  assert.deepEqual(
    h.bolgeler.map((b) => [b.id, b.acik]),
    [
      ['ortacag', true],
      ['ronesans', true],
      ['barok', false],
    ],
  );
  assert.equal(yildiz({}, 'Yok'), 0);
  assert.equal(haritaKur([{ ...durumlar[2] }], il).simdiki, null);
  assert.deepEqual(yeniAcilanDuraklar(h.duraklar, ['Gotik']), ['Erken Rönesans']);
  assert.deepEqual(yeniAcilanDuraklar(h.duraklar, null), ['Gotik', 'Erken Rönesans']);
});

test('yol üzerinde yerleşim', () => {
  const yol = [
    [0.5, 0.9],
    [0.5, 0.5],
    [0.5, 0.1],
  ];
  assert.deepEqual(yolNoktasi(yol, 0), [0.5, 0.9]);
  assert.ok(Math.abs(yolNoktasi(yol, 1)[1] - 0.1) < 1e-9);
  const [, y] = yolNoktasi(yol, 0.25);
  assert.ok(Math.abs(y - 0.7) < 1e-9);
  assert.deepEqual(durakKonumlari(1), [0.5]);
  assert.deepEqual(durakKonumlari(2), [0.3, 0.7]);
  const t = durakKonumlari(5);
  assert.equal(t.length, 5);
  assert.ok(Math.abs(t[0] - 0.12) < 1e-9 && Math.abs(t[4] - 0.86) < 1e-9);
  assert.deepEqual(durakKonumlari(0), []);
  assert.equal(yolParcasi(yol, 0), '');
  assert.equal(yolParcasi(yol, 0.5), '300.0,810.0 300.0,450.0');
  assert.equal(yolParcasi(yol, 1).split(' ').length, 3);
});

test('görülen duraklar yedekte doğrulanır', () => {
  assert.deepEqual(gorulenDogrula(['a', 'a', 3, 'b']), ['a', 'b']);
  assert.deepEqual(gorulenDogrula('x'), []);
  assert.deepEqual(ilerlemeDogrula({ islenen: [1], haritaGorulen: ['Gotik', 5] }).haritaGorulen, ['Gotik']);
  assert.deepEqual(ilerlemeDogrula({ islenen: [] }).haritaGorulen, []);
});
