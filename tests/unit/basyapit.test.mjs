import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { basyapitlariAl, basyapitBul, sanatcininBasyapitlari, eserEslestir } from '../../js/basyapit.js';

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
