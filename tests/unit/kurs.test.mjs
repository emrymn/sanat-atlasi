// İlerleme kitaplığı: kapağı olan kurs konuları (İş 28)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { konuKapagi, kursKonulari } from '../../js/kurs.js';
import { gorunurSanatcilar } from '../../js/resim.js';

const oku = (p) => JSON.parse(readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8'));
const turler = oku('data/eser_turleri.json');
const tum = oku('data/sanatcilar.json');
const sanatcilar = gorunurSanatcilar(tum, turler, oku('data/eserler_onbellek.json'));
const konular = oku('data/konular.json');
const liste = kursKonulari(konular, sanatcilar, turler, tum);
const no = (n) => liste.find((k) => k.no === n);

test('kapak sırası: konunun sanatçısı, o dersteki resim (başlıktaki sanatçı önce), başlıktaki sanatçının eseri', () => {
  assert.ok(!no(1).kapak.dosya);
  assert.equal(no(20).kapak.sanatci, 'raphael');
  assert.match(no(20).kapak.dosya, /School_of_Athens/);
  assert.equal(no(23).kapak.sanatci, 'michelangelo');
  assert.equal(no(4).kapak.sanatci, 'giotto-di-bondone');
});

test('heykel ve mimari derslerinde o eserin fotoğrafı; hiç eseri olmayan ders yok; ad benzerliği yanıltmaz', () => {
  for (const n of [47, 55, 60, 61]) assert.equal(no(n), undefined, `konu ${n}`);
  assert.equal(no(13).kapak.sanatci, 'lorenzo-ghiberti');
  assert.match(no(13).kapak.baslik, /Gates of Paradise/);
  assert.equal(no(13).kapak.resimDegil, true);
  assert.equal(no(29).kapak.sanatci, 'gian-lorenzo-bernini'); // "Bernini, David" → Jacques-Louis David değil
  assert.equal(no(14).kapak.sanatci, 'donatello');
  assert.ok(liste.every((k) => k.kapak.sanatci && tum.some((s) => s.id === k.kapak.sanatci)));
  // her sanatçılı konu listede
  for (const s of sanatcilar) assert.ok(no(s.konu), `konu ${s.konu}`);
});

test('küçük örnek: sanatçısız konuya o dersteki kurs resmi, yoksa eserin fotoğrafı, eser yoksa kapak yok', () => {
  const s = [{ id: 'a', ad: 'Ali Usta', konu: 1, kurs_eserleri: [{ konu: 2, commons_dosya: 'X.jpg', baslik: 'Resim' }, { konu: 3, commons_dosya: 'Y.jpg', baslik: 'Heykel' }] }];
  const t = { kurs: { 'y.jpg': { karar: 'degil' } } };
  assert.deepEqual(konuKapagi({ no: 1, baslik: '' }, s, t), { sanatci: 'a' });
  assert.deepEqual(konuKapagi({ no: 2, baslik: '' }, s, t), { sanatci: 'a', dosya: 'X.jpg', baslik: 'Resim' });
  assert.deepEqual(konuKapagi({ no: 3, baslik: '' }, s, t), { sanatci: 'a', dosya: 'Y.jpg', baslik: 'Heykel', resimDegil: true });
  assert.equal(konuKapagi({ no: 5, baslik: '' }, s, t), null);
  assert.deepEqual(konuKapagi({ no: 4, baslik: 'Usta and friends' }, s, t), { sanatci: 'a' });
});
