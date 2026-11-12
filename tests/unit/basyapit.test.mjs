import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { basyapitlariAl, basyapitBul, sanatcininBasyapitlari, eserEslestir, oneCikanlar } from '../../js/basyapit.js';

const kayit = (k, sid, ek = {}) => ({ anahtar: k, sanatci: sid, baslik: 'Ad', bolumler: [{ baslik: 'B', metin: 'M' }], ...ek });

test('başyapıt verisi: bozuk kayıtlar atılır, eksik alanlar tamamlanır', () => {
  assert.deepEqual(basyapitlariAl(null), []);
  const l = basyapitlariAl({
    eserler: [kayit('Q1', 'a', { bak: ['x', 3] }), kayit('Q2', 'yok'), { anahtar: 'Q3', sanatci: 'a', baslik: 'X', bolumler: [] }, kayit('', 'a')],
  }, (id) => id === 'a');
  assert.equal(l.length, 1);
  assert.deepEqual(l[0].bak, ['x']);
  assert.equal(l[0].ozet, '');
});

test('arama ve eşleştirme: QID ya da "sanatçı|başlık"', () => {
  const l = basyapitlariAl({ eserler: [kayit('Q1', 'a'), kayit('b|The Hay Wain', 'b')] });
  assert.equal(basyapitBul(l, 'Q1').sanatci, 'a');
  assert.equal(basyapitBul(l, 'yok'), null);
  assert.equal(sanatcininBasyapitlari(l, 'b').length, 1);
  const eserler = [{ qid: 'Q9', baslik: 'X' }, { qid: null, baslik: 'The Hay Wain' }, { qid: 'Q1', baslik: 'Y' }];
  assert.equal(eserEslestir(eserler, l[0]).baslik, 'Y');
  assert.equal(eserEslestir(eserler, l[1]).baslik, 'The Hay Wain');
});

test('data/basyapitlar.json (varsa): biçim ve sanatçılar', () => {
  const yol = new URL('../../data/basyapitlar.json', import.meta.url);
  if (!existsSync(yol)) return;
  const ham = JSON.parse(readFileSync(yol, 'utf8'));
  const idler = new Set(JSON.parse(readFileSync(new URL('../../data/sanatcilar.json', import.meta.url), 'utf8')).map((s) => s.id));
  const l = basyapitlariAl(ham, (id) => idler.has(id));
  assert.equal(l.length, ham.eserler.length, 'geçersiz kayıt var');
});

// 1.76.4: Başyapıtlar sahnesinin öne çıkanları
test('öne çıkanlar: hikâyesi olanlar başta, tekrar yok, açık sanatçılar önce, gün değişince seçim değişir', () => {
  const l = Array.from({ length: 12 }, (_, i) => kayit(`Q${i}`, i < 6 ? 'acik' : 'kilitli'));
  const acikMi = (b) => b.sanatci === 'acik';
  const one = oneCikanlar(l, new Set(['Q9', 'Q3']), acikMi, 0);
  assert.equal(one.length, 4);
  assert.deepEqual(one.slice(0, 2).map((b) => b.anahtar), ['Q3', 'Q9']); // listedeki sırayla, kilitli olsa da
  assert.equal(new Set(one).size, 4);
  assert.ok(one.slice(2).every(acikMi));
  // başka gün, başka eserler
  assert.notDeepEqual(oneCikanlar(l, new Set(), acikMi, 0).map((b) => b.anahtar), oneCikanlar(l, new Set(), acikMi, 1).map((b) => b.anahtar));
  // az eser: hepsi, bir kez
  assert.deepEqual(oneCikanlar(l.slice(0, 2), new Set(), acikMi, 5).map((b) => b.anahtar).sort(), ['Q0', 'Q1']);
  assert.deepEqual(oneCikanlar([], new Set()), []);
  // açık sanatçı yoksa kilitlilerden dolar; hikâyeliler dörtten çoksa ilk dördü
  assert.equal(oneCikanlar(l.slice(6), new Set(), acikMi, 3).length, 4);
  assert.equal(oneCikanlar(l, new Set(l.map((b) => b.anahtar)), acikMi, 3).length, 4);
});
