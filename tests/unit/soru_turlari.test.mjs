import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  kursBolumleri,
  sanatciBolumu,
  bolumSecenekleri,
  yuzyilAraligi,
  konuSecenekleri,
  turSirasi,
  skorKategorisi,
  konuEserleri,
  anahtarlaEser,
} from '../../js/soruTurlari.js';
import { cevapla } from '../../js/leitner.js';
import { ilerlemeDogrula, varsayilanIlerleme } from '../../js/depo.js';
import { rastgeleYap } from '../../js/yardimci.js';

const oku = (p) => JSON.parse(readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8'));
const konular = oku('data/konular.json');
const konularTr = oku('data/konular_tr.json');
const sanatcilar = oku('data/sanatcilar.json');

test('İş 105 kursBolumleri: 9 bölüm sırayla, Türkçe adlarıyla; her sanatçının bölümü var', () => {
  const b = kursBolumleri(konular, konularTr);
  assert.deepEqual(
    b.map((x) => x.no),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
  assert.equal(b[4].ad, '16. yüzyıl sanatı');
  for (const s of sanatcilar) assert.ok(sanatciBolumu(s, b), s.id);
});

test('İş 105 bolumSecenekleri: doğru bölüm + en yakın komşular, tekrarsız', () => {
  const b = kursBolumleri(konular, konularTr);
  for (const [dogru, beklenen] of [
    ['Bölüm 5', ['Bölüm 3', 'Bölüm 4', 'Bölüm 5', 'Bölüm 6', 'Bölüm 7']],
    ['Bölüm 1', ['Bölüm 1', 'Bölüm 2', 'Bölüm 3', 'Bölüm 4']],
    ['Bölüm 9', ['Bölüm 6', 'Bölüm 7', 'Bölüm 8', 'Bölüm 9']],
  ])
    for (let i = 0; i < 20; i++) {
      const s = bolumSecenekleri(dogru, b, rastgeleYap(i));
      assert.equal(s.length, 4);
      assert.ok(s.includes(dogru));
      assert.equal(new Set(s).size, 4);
      for (const x of s) assert.ok(beklenen.includes(x), `${dogru}: ${x}`);
    }
  // uç bölümde komşular tam belirli
  assert.deepEqual(bolumSecenekleri('Bölüm 1', b, rastgeleYap(3)).sort(), ['Bölüm 1', 'Bölüm 2', 'Bölüm 3', 'Bölüm 4']);
});

test('İş 105 yuzyilAraligi: bölüm sanatçılarının yüzyılları; MÖ de yazılır', () => {
  const b = kursBolumleri(konular, konularTr);
  assert.match(yuzyilAraligi(b[4], sanatcilar), /^1[56]\.–1[67]\. yüzyıl$/);
  const sahte = { konular: [99] };
  assert.equal(yuzyilAraligi(sahte, [{ konu: 99, dogum: 1500 }, { konu: 99, dogum: 1550 }]), '16. yüzyıl');
  assert.equal(yuzyilAraligi(sahte, [{ konu: 99, dogum: -480 }, { konu: 99, dogum: 150 }]), 'MÖ 5. yüzyıl – 2. yüzyıl');
  assert.equal(yuzyilAraligi(sahte, []), '');
});

test('İş 105 konuSecenekleri: aynı türden konular önce, yetmezse diğer türler', () => {
  const k = [
    { id: 'a', tur: 'mitoloji' },
    { id: 'b', tur: 'mitoloji' },
    { id: 'c', tur: 'mitoloji' },
    { id: 'd', tur: 'mitoloji' },
    { id: 'e', tur: 'yeni_ahit' },
  ];
  for (let i = 0; i < 10; i++) {
    const s = konuSecenekleri(k[0], k, rastgeleYap(i));
    assert.deepEqual([...s].sort(), ['a', 'b', 'c', 'd']);
  }
  const s = konuSecenekleri(k[4], k, rastgeleYap(1));
  assert.equal(s.length, 4);
  assert.ok(s.includes('e'));
});

test('İş 105 turSirasi: vadesi gelen ve zayıf önce, sonra yeni, sonra diğerleri; adet sınırı', () => {
  const b = '2026-11-02';
  const iyi = cevapla(cevapla(undefined, true, '2026-10-01'), true, '2026-10-02'); // kutu 2, vadesi ileride
  iyi.sonraki = '2026-12-01';
  const vade = { ...iyi, sonraki: '2026-11-01' };
  const zayif = cevapla(undefined, false, '2026-11-01');
  zayif.sonraki = '2026-11-05';
  const skor = { vade, zayif, iyi, yeni: undefined };
  assert.equal(skorKategorisi(vade, b), 0);
  assert.equal(skorKategorisi(zayif, b), 1);
  assert.equal(skorKategorisi(undefined, b), 2);
  assert.equal(skorKategorisi(iyi, b), 3);
  const s = turSirasi(['iyi', 'yeni', 'zayif', 'vade'], (a) => skor[a], { bugun: b, adet: 10, rng: rastgeleYap(2) });
  assert.deepEqual(s, ['vade', 'zayif', 'yeni', 'iyi']);
  assert.equal(turSirasi(['iyi', 'yeni', 'zayif', 'vade'], (a) => skor[a], { bugun: b, adet: 2 }).length, 2);
});

test('İş 105 konuEserleri/anahtarlaEser: yalnız açık sanatçıların eserleri; QID ya da "sanatçı|başlık"', () => {
  const konu = { eserler: [['Q1', 'giotto'], ['monet|Su Zambakları', 'monet']] };
  assert.deepEqual(konuEserleri(konu, new Set(['giotto'])), [['Q1', 'giotto']]);
  const eserler = [{ qid: 'Q1', baslik: 'X' }, { baslik: 'Su Zambakları' }];
  assert.equal(anahtarlaEser(eserler, 'Q1', 'giotto'), eserler[0]);
  assert.equal(anahtarlaEser(eserler, 'monet|Su Zambakları', 'monet'), eserler[1]);
  assert.equal(anahtarlaEser(eserler, 'Q9', 'x'), null);
});

test('İş 105 ilerlemeDogrula: bölüm turu ve konu turu skorları korunur, bozuklar atılır', () => {
  const v = varsayilanIlerleme([1]);
  const sk = cevapla(undefined, true, '2026-11-02');
  v.skorlar.giotto = { sanatci: sk, bolumKart: sk };
  v.skorlar.duccio = { sanatci: sk, bolumKart: { kutu: 9 } };
  v.skorlarKonu = { 'mujde': sk, bozuk: { kutu: 'x' } };
  const d = ilerlemeDogrula(JSON.parse(JSON.stringify(v)));
  assert.deepEqual(d.skorlar.giotto.bolumKart, sk);
  assert.equal(d.skorlar.duccio.bolumKart, undefined);
  assert.deepEqual(d.skorlarKonu, { mujde: sk });
  assert.deepEqual(ilerlemeDogrula({ islenen: [1] }).skorlarKonu, {});
});
