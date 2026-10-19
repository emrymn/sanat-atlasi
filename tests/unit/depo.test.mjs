import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { varsayilanIlerleme, yedekMetni, yedekCoz, ilerlemeDogrula, gunlukGuncelle } from '../../js/depo.js';
import { cevapla, yeniSkor } from '../../js/leitner.js';

test('yedek → geri yükleme gidiş-dönüşü kayıpsız', () => {
  const i = varsayilanIlerleme([1, 2, 3]);
  i.skorlar.giotto = { sanatci: cevapla(yeniSkor(), true, '2026-10-19'), akim: cevapla(yeniSkor(), false, '2026-10-19') };
  i.ayarlar.tema = 'koyu';
  i.ayarlar.gunlukKart = 30;
  const geri = yedekCoz(yedekMetni(i));
  assert.deepEqual(geri.islenen, [1, 2, 3]);
  assert.deepEqual(geri.skorlar, i.skorlar);
  assert.deepEqual(geri.ayarlar, { gunlukKart: 30, tema: 'koyu' });
});

test('bozuk yedekler anlaşılır hata verir', () => {
  assert.throws(() => yedekCoz('merhaba'), /JSON/);
  assert.throws(() => yedekCoz('{"a":1}'), /islenen/);
  assert.throws(() => yedekCoz('{"islenen":[1],"skorlar":{"x":{"sanatci":{"kutu":9,"dogru":0,"yanlis":0}}}}'), /x/);
});

test('eksik alanlar tamamlanır, geçersiz ayarlar düzeltilir', () => {
  const i = ilerlemeDogrula({ islenen: [3, 1, 3], ayarlar: { tema: 'mor', gunlukKart: 1000 } });
  assert.deepEqual(i.islenen, [1, 3]);
  assert.equal(i.ayarlar.tema, 'sepya');
  assert.equal(i.ayarlar.gunlukKart, 100);
  assert.deepEqual(i.skorlar, {});
});

test('günlük sayaç gün değişince sıfırlanır', () => {
  const i = varsayilanIlerleme([]);
  i.gunluk = { tarih: '2026-10-18', yeni: 5, kart: 20, yeniIdler: ['a'] };
  gunlukGuncelle(i, '2026-10-19');
  assert.deepEqual(i.gunluk, { tarih: '2026-10-19', yeni: 0, kart: 0, yeniIdler: [] });
});

test('service worker önbellek listesi tüm uygulama dosyalarını içerir', () => {
  const sw = readFileSync(new URL('../../sw.js', import.meta.url), 'utf8');
  const js = readdirSync(new URL('../../js/', import.meta.url)).filter((f) => f.endsWith('.js'));
  for (const f of js) assert.ok(sw.includes(`'js/${f}'`), `sw.js listesinde yok: js/${f}`);
  for (const f of ['index.html', 'css/app.css', 'manifest.webmanifest', 'data/sanatcilar.json', 'data/akimlar.json', 'data/konular.json'])
    assert.ok(sw.includes(`'${f}'`), f);
});

test('manifest geçerli ve göreli yollar kullanır', () => {
  const m = JSON.parse(readFileSync(new URL('../../manifest.webmanifest', import.meta.url), 'utf8'));
  assert.equal(m.name, 'Sanat Atlası');
  assert.equal(m.short_name, 'Atlas');
  assert.equal(m.display, 'standalone');
  for (const b of ['180x180', '192x192', '512x512'])
    assert.ok(
      m.icons.some((i) => i.sizes === b),
      b,
    );
  for (const i of m.icons) assert.ok(!i.src.startsWith('/'), 'göreli yol: ' + i.src);
  assert.ok(!m.start_url.startsWith('/'));
});
