import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kayitYap, kayitGecerliMi, kayittanKur, devamOzeti, devamKonumu } from '../../js/devam.js';
import { Oturum } from '../../js/oturum.js';
import { yedekMetni, yedekYarimOturum, yedekCoz, varsayilanIlerleme } from '../../js/depo.js';

const GUN = 24 * 60 * 60 * 1000;

function bellekOturumu({ konum = 0, kart = null } = {}) {
  const ot = new Oturum(['a', 'b', 'c', 'd'], { rng: () => 0 });
  ot.konum = konum;
  return { kimlik: 'x1', kip: 'donem', akim: 'Gotik', oturum: ot, kart, gosterilen: [{ id: 'a', eser: 'q:Q1' }] };
}

const kart = (x = {}) => ({
  konum: 1,
  id: 'b',
  eser: { anahtar: 'q:Q2', baslik: 'Eser' },
  secenekler: ['b', 'a', 'c', 'd'],
  akimSecenekleri: null,
  adim: 1,
  cevapSanatci: null,
  cevapAkim: null,
  bitti: false,
  ...x,
});

test('kayıt: kip, akım, sıra, şu anki kart (eser anahtarı, seçenekler, adım, cevaplar), gösterilenler', () => {
  const o = bellekOturumu({ konum: 1, kart: kart({ cevapSanatci: 'a' }) });
  o.oturum.isle(false); // yanlış: tekrar kuyruğuna girer
  const k = kayitYap(o, 1000);
  assert.equal(k.kip, 'donem');
  assert.equal(k.akim, 'Gotik');
  assert.equal(k.konum, 1);
  assert.equal(k.kuyruk.length, 5, 'tekrar kuyruğu dahil');
  assert.equal(k.yanlis, 1);
  assert.deepEqual(k.tekrarSayisi, { b: 1 });
  assert.equal(k.kart.eser, 'q:Q2');
  assert.equal(k.kart.cevapSanatci, 'a');
  assert.deepEqual(k.gosterilen, [{ id: 'a', eser: 'q:Q1' }]);
  assert.equal(kayitGecerliMi(JSON.parse(JSON.stringify(k)), 1000), true, 'JSON gidiş-dönüşü');
});

test('7 günden eski ya da bozuk kayıt geçersiz', () => {
  const k = kayitYap(bellekOturumu(), 0);
  assert.equal(kayitGecerliMi(k, 6 * GUN), true);
  assert.equal(kayitGecerliMi(k, 7 * GUN + 1), false);
  assert.equal(kayitGecerliMi({ ...k, kip: 'baska' }, 0), false);
  assert.equal(kayitGecerliMi({ ...k, konum: 99 }, 0), false);
  assert.equal(kayitGecerliMi(null, 0), false);
});

test('devam: yarım kart aynı eser ve adımla; tamamlanmış kartta sonraki karttan', () => {
  const k = kayitYap(bellekOturumu({ konum: 1, kart: kart({ cevapSanatci: 'b', adim: 2 }) }), 0);
  const kur = kayittanKur(k, { varMi: () => true });
  assert.equal(kur.oturum.konum, 1);
  assert.equal(kur.kart.eser, 'q:Q2');
  assert.equal(kur.kart.adim, 2);
  assert.equal(kur.kart.cevapSanatci, 'b', 'verilen cevap korunur (yeniden sayılmaz)');
  assert.equal(devamOzeti(k), 'Döneme göre · Gotik · 2 / 4');

  const bitmis = kayitYap(bellekOturumu({ konum: 4 - 3, kart: kart({ cevapSanatci: 'b', bitti: true }) }), 0);
  const kur2 = kayittanKur(bitmis, { varMi: () => true });
  assert.equal(kur2.oturum.konum, 2);
  assert.equal(kur2.kart, null);
  assert.equal(devamKonumu(bitmis), 3);
});

test('devam: veride olmayan sanatçının kartı atlanır, sıra kayar', () => {
  const k = kayitYap(bellekOturumu({ konum: 2, kart: { ...kart(), konum: 2, id: 'c' } }), 0);
  const kur = kayittanKur(k, { varMi: (id) => id !== 'a' });
  assert.deepEqual(
    kur.oturum.kuyruk.map((x) => x.id),
    ['b', 'c', 'd'],
  );
  assert.equal(kur.oturum.konum, 1);
  assert.equal(kur.kart.id, 'c');
  assert.equal(kur.kart.konum, 1);
  const kurYok = kayittanKur(k, { varMi: (id) => id === 'a' });
  assert.equal(kurYok, null, 'kalan kart yok');
});

test('devam: tekrar kuyruğu ve sayaçlar aynı oturum olarak sürer', () => {
  const o = bellekOturumu({ konum: 0 });
  o.oturum.isle(false);
  o.oturum.isle(true);
  const kur = kayittanKur(kayitYap(o, 0), { varMi: () => true, rng: () => 0 });
  assert.equal(kur.oturum.dogru, 1);
  assert.equal(kur.oturum.yanlis, 1);
  assert.equal(kur.oturum.toplam, o.oturum.toplam);
  assert.deepEqual(kur.oturum.tekrarSayisi, o.oturum.tekrarSayisi);
});

test('özet: Karışık ve Hepsi', () => {
  const k = kayitYap({ ...bellekOturumu(), kip: 'karisik', akim: null }, 0);
  assert.equal(devamOzeti(k), 'Karışık · 1 / 4');
  assert.equal(devamOzeti({ ...k, kip: 'donem', akim: 'hepsi' }), 'Döneme göre · Hepsi · 1 / 4');
});

test('yedek yarım oturumu içerir ve geri verir', () => {
  const k = kayitYap(bellekOturumu(), Date.now());
  const metin = yedekMetni(varsayilanIlerleme([1]), k);
  assert.deepEqual(yedekYarimOturum(metin), JSON.parse(JSON.stringify(k)));
  assert.deepEqual(yedekCoz(metin).islenen, [1]);
  assert.equal(yedekYarimOturum(yedekMetni(varsayilanIlerleme([1]))), null);
  assert.equal(yedekYarimOturum('bozuk'), null);
});
