import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanatciCeldiricileri, sanatciSecenekleri, akimSecenekleri, yasamAraligi, akimOrtaYillari } from '../../js/celdirici.js';
import { rastgeleYap } from '../../js/yardimci.js';
import { sanatcilar, akimlar } from './yardimci.mjs';

const s = (id, ad, akim, dogum, olum) => ({ id, ad, akim, dogum, olum });
const AKIMLAR = [
  { ad: 'A', sira: 0, komsular: ['B'] },
  { ad: 'B', sira: 1, komsular: ['A', 'C'] },
  { ad: 'C', sira: 2, komsular: ['B'] },
  { ad: 'D', sira: 3, komsular: ['C'] },
  { ad: 'E', sira: 4, komsular: [] },
];

test('önce aynı akımdaki açık sanatçılar, sonra kapalılar', () => {
  const liste = [
    s('h', 'Hedef', 'A', 1400, 1450),
    s('a1', 'A1', 'A', 1410, 1460),
    s('a2', 'A2', 'A', 1405, 1470),
    s('a3', 'A3', 'A', 1300, 1350),
    s('b1', 'B1', 'B', 1400, 1450),
  ];
  for (let t = 1; t < 20; t++) {
    const c = sanatciCeldiricileri(liste[0], { sanatcilar: liste, akimlar: AKIMLAR, acikIdler: new Set(['a1']), rng: rastgeleYap(t) });
    assert.deepEqual(c.map((x) => x.id)[0], 'a1', 'açık olan ilk sırada');
    assert.deepEqual(new Set(c.map((x) => x.id)), new Set(['a1', 'a2', 'a3']), 'aynı akım diğer her şeyden önce');
  }
});

test('aynı akım yetmezse komşu akımdan ±50 yıl örtüşen gelir, uzak olan gelmez', () => {
  const liste = [
    s('h', 'Hedef', 'A', 1400, 1450),
    s('a1', 'A1', 'A', 1410, 1460),
    s('b-yakin', 'B yakın', 'B', 1480, 1530), // 1450+50 = 1500 sınırı içinde başlıyor
    s('b-uzak', 'B uzak', 'B', 1700, 1750),
    s('d-yakin', 'D yakın', 'D', 1420, 1470), // komşu değil ama ±100 içinde
    s('e-uzak', 'E uzak', 'E', 1900, 1950),
  ];
  const c = sanatciCeldiricileri(liste[0], { sanatcilar: liste, akimlar: AKIMLAR, rng: rastgeleYap(3) }).map((x) => x.id);
  assert.deepEqual(c, ['a1', 'b-yakin', 'd-yakin']);
});

test('±100 yıl kuralı, yine olmazsa zamanca en yakın yedek', () => {
  const liste = [
    s('h', 'Hedef', 'E', 1400, 1450),
    s('x1', 'X1', 'D', 1520, 1560),
    s('x2', 'X2', 'D', 1800, 1850),
    s('x3', 'X3', 'D', 1900, 1950),
    s('x4', 'X4', 'D', 1600, 1650),
  ];
  const c = sanatciCeldiricileri(liste[0], { sanatcilar: liste, akimlar: AKIMLAR, rng: rastgeleYap(1) }).map((x) => x.id);
  assert.equal(c[0], 'x1');
  assert.deepEqual(c.slice(1), ['x4', 'x2']);
});

test('aynı sanatçı iki kez kullanılmaz, hedef çeldirici olmaz; tam 4 seçenek', () => {
  const rng = rastgeleYap(42);
  const acik = new Set(sanatcilar.filter((x) => x.konu <= 12).map((x) => x.id));
  const oy = akimOrtaYillari(sanatcilar);
  for (const hedef of sanatcilar) {
    const sec = sanatciSecenekleri(hedef, { sanatcilar, akimlar, acikIdler: acik, rng, ortaYillar: oy });
    assert.equal(sec.length, 4, hedef.id);
    assert.equal(new Set(sec.map((x) => x.id)).size, 4, hedef.id);
    assert.equal(new Set(sec.map((x) => x.ad)).size, 4, hedef.id);
    assert.ok(sec.some((x) => x.id === hedef.id));
  }
});

test('gerçek veride çeldiriciler önce aynı akımdan', () => {
  const hedef = sanatcilar.find((x) => x.akim === 'Empresyonizm');
  const c = sanatciCeldiricileri(hedef, { sanatcilar, akimlar, rng: rastgeleYap(9) });
  assert.ok(c.every((x) => x.akim === 'Empresyonizm'));
});

test('seçenekler karıştırılır (doğru cevap hep aynı yerde değil)', () => {
  const rng = rastgeleYap(5);
  const hedef = sanatcilar.find((x) => x.akim === 'Maniyerizm');
  const yerler = new Set();
  for (let i = 0; i < 40; i++) yerler.add(sanatciSecenekleri(hedef, { sanatcilar, akimlar, rng }).findIndex((x) => x.id === hedef.id));
  assert.ok(yerler.size >= 3);
});

test('tarihi bilinmeyen sanatçı için yaşam aralığı akımdan tahmin edilir', () => {
  const oy = { Gotik: 1200 };
  assert.deepEqual(yasamAraligi({ akim: 'Gotik', dogum: null, olum: null }, oy), [1170, 1230]);
  assert.deepEqual(yasamAraligi({ akim: 'Gotik', dogum: null, olum: 1416 }, oy), [1356, 1416]);
  assert.deepEqual(yasamAraligi({ akim: 'Gotik', dogum: 1300, olum: null }, oy), [1300, 1360]);
});

test('akım sorusu: doğru + komşular, sonra kronolojik olarak yakın olanlar', () => {
  const sec = akimSecenekleri('Romanesk', akimlar, rastgeleYap(2));
  assert.equal(sec.length, 4);
  assert.ok(sec.includes('Romanesk'));
  assert.ok(sec.includes('Gotik')); // tek komşu
  // kalan ikisi en yakın sıradakiler: Antik (0) ve Proto-Rönesans (3)
  assert.deepEqual(new Set(sec), new Set(['Romanesk', 'Gotik', 'Antik Yunan ve Roma', 'Proto-Rönesans']));
  const g = akimSecenekleri('Gotik', akimlar, rastgeleYap(2));
  assert.deepEqual(new Set(g), new Set(['Gotik', 'Proto-Rönesans', 'Uluslararası Gotik', 'Romanesk']));
  for (const a of akimlar) {
    const x = akimSecenekleri(a.ad, akimlar, rastgeleYap(a.sira));
    assert.equal(new Set(x).size, 4, a.ad);
  }
});
