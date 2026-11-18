// 1.89: kalabalık durakların tanışması gruplara bölünür (js/bolum.js)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tanismaGruplari, gorulenGruplar, tanismaGrubuGoruldu, bolumKaydi, bolumlerDogrula, TANISMA_BOLME } from '../../js/bolum.js';

const ids = (n) => Array.from({ length: n }, (_, i) => `s${i}`);
const boylar = (n) => tanismaGruplari(ids(n)).map((g) => g.length);

test('5 ve altı bölünmez; 6 ve üstü 3–4 kişilik gruplara', () => {
  assert.equal(TANISMA_BOLME, 6);
  for (const n of [0, 1, 3, 5]) assert.deepEqual(boylar(n), n ? [n] : [0]);
  assert.deepEqual(boylar(6), [3, 3]);
  assert.deepEqual(boylar(7), [4, 3]);
  assert.deepEqual(boylar(8), [4, 4]);
  assert.deepEqual(boylar(9), [3, 3, 3]);
  assert.deepEqual(boylar(10), [4, 3, 3]);
  for (let n = 6; n <= 20; n++) for (const b of boylar(n)) assert.ok(b >= 3 && b <= 4, `${n}: ${boylar(n)}`);
});

test('gruplar sırayı korur, her sanatçı tam bir grupta', () => {
  const l = ids(10);
  assert.deepEqual(tanismaGruplari(l).flat(), l);
});

test('her grup ayrı kaydedilir; hepsi görülünce seviyenin tanışması tamam', () => {
  const il = { bolumler: { '4-1': { kolay: 0.5 } } };
  tanismaGrubuGoruldu(il, '4-1', 'kolay', 1, 2);
  let k = bolumKaydi(il, '4-1');
  assert.deepEqual(k.tanitimGrup, [1]);
  assert.equal(k.tanitim, undefined);
  assert.equal(k.kolay, 0.5);
  assert.deepEqual(gorulenGruplar(k, 'kolay', 2), [1]);
  tanismaGrubuGoruldu(il, '4-1', 'kolay', 0, 2);
  k = bolumKaydi(il, '4-1');
  assert.equal(k.tanitim, true);
  assert.deepEqual(gorulenGruplar(k, 'kolay', 2), [0, 1]);
  // Orta'nın grupları ayrı
  assert.deepEqual(gorulenGruplar(k, 'orta', 2), []);
  tanismaGrubuGoruldu(il, '4-1', 'orta', 0, 2);
  assert.deepEqual(bolumKaydi(il, '4-1').tanitimOrtaGrup, [0]);
});

test('eskiden bütünüyle tanışılmış durakta bütün gruplar görülmüş sayılır', () => {
  assert.deepEqual(gorulenGruplar({ tanitim: true }, 'kolay', 3), [0, 1, 2]);
  assert.deepEqual(gorulenGruplar({ tanitimOrta: true }, 'orta', 2), [0, 1]);
});

test('yedek doğrulaması grup listelerini korur, geçersizleri atar', () => {
  const v = bolumlerDogrula({ '9-2': { kolay: 1, tanitimGrup: [2, 0, 0, 'x', -1, 40], tanitimOrtaGrup: 'yok' } });
  assert.deepEqual(v['9-2'], { kolay: 1, tanitimGrup: [0, 2] });
});
