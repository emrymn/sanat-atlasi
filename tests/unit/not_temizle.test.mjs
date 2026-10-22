import { test } from 'node:test';
import assert from 'node:assert/strict';
import { notTemizle } from '../../js/yardimci.js';
import { eserBaslik, onbellekEseri } from '../../js/eserler.js';
import { basyapitlariAl } from '../../js/basyapit.js';
import { sanatcilar } from './yardimci.mjs';

test('D8: parantez içindeki slayt/metin notları atılır', () => {
  assert.equal(notTemizle('1401 (slayt yazısı)'), '1401');
  assert.equal(notTemizle('c1428 (slayt altyazısı)'), 'c1428');
  assert.equal(notTemizle('The Progress of Love (slaytta: The Meeting, from Love of the Shepherds)'), 'The Progress of Love');
  assert.equal(notTemizle('c. 1597 / c. 1599 (metinde ikisi de geçer)'), 'c. 1597 / c. 1599');
  assert.equal(notTemizle('1840 (sipariş 1832; slayt altyazısı 1804 der)'), '1840');
});

test('D8: önekler atılır, ders metninin tarihi varken slayt tarihi düşer', () => {
  assert.equal(notTemizle('slaytta c1308–11'), 'c1308–11');
  assert.equal(notTemizle('Slayta göre National Gallery, Londra'), 'National Gallery, Londra');
  assert.equal(notTemizle('slayt: Santo Tomé, Toledo'), 'Santo Tomé, Toledo');
  assert.equal(notTemizle("metinde 1520'ler; slaytta c1500"), "1520'ler");
  assert.equal(notTemizle('metne göre 1914–1919; slayt künyeleri 1914-17, 1916'), '1914–1919');
  // metinden tarih yoksa slayttaki bilgi kalır
  assert.equal(notTemizle("slaytta 1474; fresklere 1465'te başlanır"), "1474; fresklere 1465'te başlanır");
  assert.equal(notTemizle("1834 yangını; slayt künyesine göre 1835'te boyandı"), "1834 yangını; 1835'te boyandı");
});

test('D8: not olmayan yazıya dokunulmaz (Kıyametin ≠ metin)', () => {
  for (const s of ['The Four Horsemen of the Apocalypse (Kıyametin Dört Atlısı)', 'Gece Nöbeti', 'c. 1665', '']) assert.equal(notTemizle(s), s);
  assert.equal(notTemizle(null), '');
});

test('D8: verideki hiçbir kurs eserinin gösterilen başlık, tarih ve yerinde slayt notu kalmaz', () => {
  const kalan = [];
  for (const s of sanatcilar)
    for (const e of s.kurs_eserleri || [])
      for (const k of ['baslik', 'tarih', 'yer']) {
        const v = notTemizle(e[k] || '');
        if (/slayt/i.test(v)) kalan.push(`${s.id} ${k}: ${v}`);
        if (e[k] && !v.trim()) kalan.push(`${s.id} ${k}: boş kaldı (${e[k]})`);
      }
  assert.deepEqual(kalan, []);
});

test('D8: eser nesnesinde gösterim temiz, anahtar başlığı değişmez', () => {
  const e = onbellekEseri({ baslik: 'Tahta Meryem (slayt yazısı)', tarih: 'slaytta c1308–11', muze: 'Louvre, Paris (slayt yazısı)', kurs: true, kaynaklar: ['kurs'], gorseller: [{ k: 'commons', d: 'A.jpg' }] });
  assert.equal(e.baslik, 'Tahta Meryem (slayt yazısı)'); // eşleştirme anahtarları için özgün
  assert.equal(eserBaslik(e), 'Tahta Meryem');
  assert.equal(e.tarih, 'c1308–11');
  assert.equal(e.muze, 'Louvre, Paris');
  const [b] = basyapitlariAl({ eserler: [{ anahtar: 'x|y', sanatci: 'x', baslik: 'Y', tarih: 'Maniyerizmin sonu (slayt: 1586)', muze: 'slayt: Santo Tomé, Toledo', bolumler: [{ baslik: 'a', metin: 'b' }] }] });
  assert.equal(b.tarih, 'Maniyerizmin sonu');
  assert.equal(b.muze, 'Santo Tomé, Toledo');
  assert.equal(b.anahtar, 'x|y');
});
