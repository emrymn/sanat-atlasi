import { test } from 'node:test';
import assert from 'node:assert/strict';
import { taninmaMetni, eserNotu, notlariAl, karsilastirmaAdresi, karsilastirmaRotasi, benzerSanatcilar } from '../../js/karsilastir.js';

test('taninma: sanatçının kendi notu önce, yoksa ek dosyadaki not', () => {
  const notlar = { a: 'ek not' };
  assert.equal(taninmaMetni({ id: 'a', taninma: 'kendi' }, notlar), 'kendi');
  assert.equal(taninmaMetni({ id: 'a' }, notlar), 'ek not');
  assert.equal(taninmaMetni({ id: 'b' }, notlar), '');
  assert.equal(taninmaMetni(null, notlar), '');
});

test('eser notu: önce QID, yoksa "sanatçı|başlık"', () => {
  const notlar = { Q1: 'qid notu', 'x|Başlık': 'başlık notu' };
  assert.equal(eserNotu('x', { qid: 'Q1', baslik: 'Başlık' }, notlar), 'qid notu');
  assert.equal(eserNotu('x', { qid: 'Q2', baslik: 'Başlık' }, notlar), 'başlık notu');
  assert.equal(eserNotu('x', { qid: null, baslik: 'Başlık' }, notlar), 'başlık notu');
  assert.equal(eserNotu('y', { qid: null, baslik: 'Başlık' }, notlar), '');
  assert.equal(eserNotu('x', null, notlar), '');
});

test('not dosyası: yok, bozuk ya da boş değerler güvenle atlanır', () => {
  assert.deepEqual(notlariAl(null), {});
  assert.deepEqual(notlariAl({}), {});
  assert.deepEqual(notlariAl({ notlar: [] }), {});
  assert.deepEqual(notlariAl({ notlar: { a: ' x ', b: '', c: 3 } }), { a: 'x' });
});

test('karşılaştırma rotası: adres ↔ çözümleme', () => {
  const h = karsilastirmaAdresi('j-m-w-turner', 'john-constable');
  assert.equal(h, '#/karsilastir/j-m-w-turner/john-constable');
  assert.deepEqual(karsilastirmaRotasi(h), ['j-m-w-turner', 'john-constable']);
  assert.equal(karsilastirmaRotasi('#/karsilastir/a/a'), null);
  assert.equal(karsilastirmaRotasi('#/karsilastir/a'), null);
  assert.equal(karsilastirmaRotasi('#/sanatci/a'), null);
});

test('benzer sanatçılar: aynı akım önce, komşu akım sonra, ±50 yıl, en çok 8', () => {
  const akimlar = [
    { ad: 'Romantizm', komsular: ['Neoklasisizm'] },
    { ad: 'Neoklasisizm', komsular: ['Romantizm'] },
    { ad: 'Kübizm', komsular: [] },
  ];
  const s = { id: 't', ad: 'Turner', akim: 'Romantizm', dogum: 1775 };
  const liste = [
    s,
    { id: 'c', ad: 'Constable', akim: 'Romantizm', dogum: 1776 },
    { id: 'f', ad: 'Friedrich', akim: 'Romantizm', dogum: 1774 },
    { id: 'd', ad: 'David', akim: 'Neoklasisizm', dogum: 1748 },
    { id: 'eski', ad: 'Eski', akim: 'Neoklasisizm', dogum: 1700 },
    { id: 'p', ad: 'Picasso', akim: 'Kübizm', dogum: 1881 },
  ];
  const ids = benzerSanatcilar(s, liste, akimlar).map((x) => x.id);
  assert.deepEqual(ids, ['c', 'f', 'd']);
  const cok = Array.from({ length: 12 }, (_, i) => ({ id: 'r' + i, ad: 'R' + i, akim: 'Romantizm', dogum: 1770 + i }));
  assert.equal(benzerSanatcilar(s, [s, ...cok], akimlar).length, 8);
});
