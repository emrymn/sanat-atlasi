import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { konulariAl, konuBul, konuHaritasiniAyarla, eserKonusu } from '../../js/ikonografi.js';

const konu = (id, ek = {}) => ({ id, ad: 'Ad ' + id, tur: 'mitoloji', hikaye: ['P'], eserler: [['Q1', 'a'], ['a|Başlık', 'a']], ...ek });

test('konu verisi: bozuk kayıtlar, bilinmeyen tür ve olmayan sanatçının eserleri ayıklanır', () => {
  assert.deepEqual(konulariAl(null), []);
  const l = konulariAl(
    { konular: [konu('x', { tur: 'uydurma' }), konu('y', { hikaye: [] }), konu('z', { eserler: [['Q9', 'yok']] }), konu('w', { eserler: [['Q2', 'a'], ['Q3', 'yok'], 'bozuk'] })] },
    (id) => id === 'a',
  );
  assert.deepEqual(l.map((k) => k.id), ['x', 'w']);
  assert.equal(l[0].tur, 'diger');
  assert.deepEqual(l[1].eserler, [['Q2', 'a']]);
  assert.equal(konuBul(l, 'w').ad, 'Ad w');
});

test('eserin konusu: QID ya da sanatçı|başlık', () => {
  konuHaritasiniAyarla(konulariAl({ konular: [konu('judith')] }));
  assert.equal(eserKonusu({ qid: 'Q1', baslik: 'X', sid: 'b' }).id, 'judith');
  assert.equal(eserKonusu({ qid: null, baslik: 'Başlık', sid: 'a' }).ad, 'Ad judith');
  assert.equal(eserKonusu({ qid: null, baslik: 'Başlık', sid: 'b' }), null);
  assert.equal(eserKonusu(null), null);
});

test('data/ikonografi.json (varsa): biçim', () => {
  const yol = new URL('../../data/ikonografi.json', import.meta.url);
  if (!existsSync(yol)) return;
  const ham = JSON.parse(readFileSync(yol, 'utf8'));
  const idler = new Set(JSON.parse(readFileSync(new URL('../../data/sanatcilar.json', import.meta.url), 'utf8')).map((s) => s.id));
  const l = konulariAl(ham, (id) => idler.has(id));
  assert.ok(l.length > 10);
  assert.equal(new Set(l.map((k) => k.id)).size, l.length, 'yinelenen konu kimliği');
});
