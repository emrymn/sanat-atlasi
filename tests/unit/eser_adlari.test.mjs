import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { eserAdiBul, eserBaslik, adlariAl } from '../../js/eserler.js';

test('eser adı: önce QID, sonra "sanatçı|başlık"; yoksa boş', () => {
  const adlar = { Q1: 'Gece Devriyesi', 'x|The Hay Wain': 'Saman Arabası' };
  assert.equal(eserAdiBul('x', { qid: 'Q1', baslik: 'The Night Watch' }, adlar), 'Gece Devriyesi');
  assert.equal(eserAdiBul('x', { qid: null, baslik: 'The Hay Wain' }, adlar), 'Saman Arabası');
  assert.equal(eserAdiBul('y', { qid: null, baslik: 'The Hay Wain' }, adlar), '');
});

test('gösterilen başlık: Türkçe ad varsa o, yoksa özgün başlık', () => {
  assert.equal(eserBaslik({ baslik: 'Bathers', ad: 'Yıkananlar' }), 'Yıkananlar');
  assert.equal(eserBaslik({ baslik: 'Bathers' }), 'Bathers');
  assert.equal(eserBaslik(null), '');
});

test('adlar dosyası: bozuk ya da eksikse boş, boş metinler atılır', () => {
  assert.deepEqual(adlariAl(null), {});
  assert.deepEqual(adlariAl({ adlar: [] }), {});
  assert.deepEqual(adlariAl({ adlar: { a: ' Müjde ', b: '', c: 3 } }), { a: 'Müjde' });
});

test('data/eser_adlari_tr.json (varsa): anahtarlar QID ya da "sanatçıId|başlık"', () => {
  const yol = new URL('../../data/eser_adlari_tr.json', import.meta.url);
  if (!existsSync(yol)) return;
  const idler = new Set(JSON.parse(readFileSync(new URL('../../data/sanatcilar.json', import.meta.url), 'utf8')).map((s) => s.id));
  const adlar = adlariAl(JSON.parse(readFileSync(yol, 'utf8')));
  assert.ok(Object.keys(adlar).length > 0);
  for (const k of Object.keys(adlar)) {
    if (/^Q\d+$/.test(k)) continue;
    const [sid, b] = k.split('|');
    assert.ok(idler.has(sid) && b, k);
  }
});
