import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { varsayilanIlerleme, yedekMetni, yedekCoz, ilerlemeDogrula, gunlukGuncelle, sonCalisilanEkle, SON_CALISILAN } from '../../js/depo.js';
import { cevapla, yeniSkor } from '../../js/leitner.js';

test('yedek → geri yükleme gidiş-dönüşü kayıpsız', () => {
  const i = varsayilanIlerleme([1, 2, 3]);
  i.skorlar.giotto = { sanatci: cevapla(yeniSkor(), true, '2026-10-19'), akim: cevapla(yeniSkor(), false, '2026-10-19') };
  i.ayarlar.tema = 'sepya';
  i.ayarlar.gunlukKart = 30;
  i.ekSanatcilar = ['claude-monet'];
  i.kotuGorseller = { 'q:Q1': ['c:a.jpg'] };
  sonCalisilanEkle(i, 'giotto');
  const geri = yedekCoz(yedekMetni(i));
  assert.deepEqual(geri.islenen, [1, 2, 3]);
  assert.deepEqual(geri.skorlar, i.skorlar);
  assert.deepEqual(geri.ayarlar, { gunlukKart: 30, tema: 'sepya', tanisma: true, rozet: false, egim: true });
  assert.deepEqual(geri.ekSanatcilar, ['claude-monet']);
  assert.deepEqual(geri.kotuGorseller, { 'q:Q1': ['c:a.jpg'] });
  assert.deepEqual(geri.sonCalisilanlar, ['giotto']);
});

test('varsayılan tema Gece; sürüm 1 ilerlemesinde Sepya ve Koyu bir kez Geceye geçer, Açık korunur', () => {
  assert.equal(varsayilanIlerleme().ayarlar.tema, 'gece');
  assert.equal(ilerlemeDogrula({ surum: 1, islenen: [], ayarlar: { tema: 'sepya' } }).ayarlar.tema, 'gece');
  assert.equal(ilerlemeDogrula({ surum: 1, islenen: [], ayarlar: { tema: 'koyu' } }).ayarlar.tema, 'gece');
  assert.equal(ilerlemeDogrula({ surum: 1, islenen: [], ayarlar: { tema: 'acik' } }).ayarlar.tema, 'acik');
  // geçişten sonra Sepya seçimi kalıcıdır
  assert.equal(ilerlemeDogrula({ surum: 2, islenen: [], ayarlar: { tema: 'sepya' } }).ayarlar.tema, 'sepya');
});

test('son çalışılanlar: en yeni başta, tekrarsız, sınırlı', () => {
  const i = varsayilanIlerleme();
  for (let n = 0; n < SON_CALISILAN + 3; n++) sonCalisilanEkle(i, 's' + n);
  sonCalisilanEkle(i, 's5');
  assert.equal(i.sonCalisilanlar.length, SON_CALISILAN);
  assert.equal(i.sonCalisilanlar[0], 's5');
  assert.equal(new Set(i.sonCalisilanlar).size, SON_CALISILAN);
});

test('bozuk yedekler anlaşılır hata verir', () => {
  assert.throws(() => yedekCoz('merhaba'), /JSON/);
  assert.throws(() => yedekCoz('{"a":1}'), /islenen/);
  assert.throws(() => yedekCoz('{"islenen":[1],"skorlar":{"x":{"sanatci":{"kutu":9,"dogru":0,"yanlis":0}}}}'), /x/);
});

test('eksik alanlar tamamlanır, geçersiz ayarlar düzeltilir', () => {
  const i = ilerlemeDogrula({ islenen: [3, 1, 3], ayarlar: { tema: 'mor', gunlukKart: 1000 } });
  assert.deepEqual(i.islenen, [1, 3]);
  assert.equal(i.ayarlar.tema, 'gece');
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
