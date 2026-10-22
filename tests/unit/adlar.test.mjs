import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { adParcala, bilinenAd } from '../../js/adlar.js';

const kisa = JSON.parse(readFileSync(new URL('../../data/kisa_adlar.json', import.meta.url), 'utf8')).adlar;
const sanatcilar = JSON.parse(readFileSync(new URL('../../data/sanatcilar.json', import.meta.url), 'utf8'));
const s = (id) => sanatcilar.find((x) => x.id === id);
const parcala = (id) => adParcala(s(id).ad, kisa[id]);

test('bilinen adlar büyük satırda', () => {
  assert.deepEqual(parcala('rembrandt-van-rijn'), { ilk: '', son: 'Rembrandt', tam: 'Rembrandt van Rijn' });
  assert.deepEqual(parcala('leonardo-da-vinci'), { ilk: '', son: 'Leonardo', tam: 'Leonardo da Vinci' });
  assert.deepEqual(parcala('giotto-di-bondone'), { ilk: '', son: 'Giotto', tam: 'Giotto di Bondone' });
  assert.equal(parcala('michelangelo').son, 'Michelangelo');
  // Raphael ve Titian verideki adlarıyla (listede yok, tek kelime → büyük satır)
  assert.deepEqual(parcala('raphael'), { ilk: '', son: 'Raphael' });
  assert.deepEqual(parcala('titian'), { ilk: '', son: 'Titian' });
  assert.equal(bilinenAd(s('rembrandt-van-rijn').ad, kisa['rembrandt-van-rijn']), 'Rembrandt');
});

test('listede olmayanlarda kural: son kelime, ekler ve parantez', () => {
  assert.deepEqual(adParcala('Wassily Kandinsky'), { ilk: 'Wassily', son: 'Kandinsky' });
  assert.deepEqual(adParcala('Jan van Eyck'), { ilk: 'Jan', son: 'van Eyck' });
  assert.deepEqual(adParcala('Georges de La Tour'), { ilk: 'Georges', son: 'de La Tour' });
  assert.deepEqual(adParcala('Caravaggio'), { ilk: '', son: 'Caravaggio' });
  assert.deepEqual(adParcala('El Greco'), { ilk: '', son: 'El Greco' });
  assert.deepEqual(adParcala('Hans Holbein (Genç)'), { ilk: 'Hans', son: 'Holbein (Genç)' });
  assert.deepEqual(adParcala('Limbourg kardeşler'), { ilk: '', son: 'Limbourg kardeşler' });
});

test('kısa ad listesindeki her kimlik sanatcilar.json içinde var', () => {
  for (const id of Object.keys(kisa)) assert.ok(s(id), id);
});

test('D7: bilinen ad tam adın başındaysa büyük satır önce, altında tam ad', () => {
  assert.deepEqual(parcala('michelangelo'), { ilk: '', son: 'Michelangelo', tam: 'Michelangelo Buonarroti' });
  // bilinen ad sonda: küçük satır üstte kalır ("Francisco de / Goya")
  assert.deepEqual(parcala('francisco-de-goya'), { ilk: 'Francisco de', son: 'Goya' });
  // küçük satırı olmayan bilinen ad
  assert.deepEqual(adParcala('Man Ray', { buyuk: 'Man Ray', kucuk: '' }), { ilk: '', son: 'Man Ray' });
});
