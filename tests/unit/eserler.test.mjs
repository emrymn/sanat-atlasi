import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eserleriBirlestir, eserSec, tazeMi, TEST_HAVUZU, onbellekEseri, pekistirmeHavuzu } from '../../js/eserler.js';
import { resimUrl, dosyaNormal } from '../../js/yardimci.js';
import { rastgeleYap } from '../../js/yardimci.js';
import { sanatcilar } from './yardimci.mjs';

test('Commons URL: kodlu ve kodsuz dosya adları aynı sonucu verir', () => {
  assert.equal(resimUrl('Le_Jupiter_Olympien_ou_l%27art.jpg', 400), resimUrl("Le_Jupiter_Olympien_ou_l'art.jpg", 400));
  assert.equal(resimUrl('Mona Lisa.jpg'), 'https://commons.wikimedia.org/wiki/Special:FilePath/Mona_Lisa.jpg?width=800');
  assert.equal(dosyaNormal('File:a b.jpg'), 'A_b.jpg');
});

test('birleştirme: kurs eserleri önce, aynı dosya ya da aynı başlık yinelenmez', () => {
  const kurs = [
    { baslik: 'Ağıt', tarih: '1305', commons_dosya: 'Giotto_Lamentation.jpg', lisans: 'Public domain', konu: 4 },
    { baslik: 'Ognissanti Madonna', tarih: '', commons_dosya: 'Ognissanti%20Madonna.jpg', lisans: 'Public domain' },
  ];
  const wd = [
    { qid: 'Q1', baslik: 'Lamentation', yil: 1305, dosya: 'giotto_Lamentation.jpg' }, // aynı dosya (ilk harf büyük/küçük)
    { qid: 'Q2', baslik: 'Ognissanti Madonna', yil: 1310, dosya: 'Baska.jpg' }, // aynı başlık
    { qid: 'Q3', baslik: 'Stefaneschi Triptych', yil: -20, dosya: 'Stefaneschi.jpg' },
  ];
  const e = eserleriBirlestir(kurs, wd);
  assert.deepEqual(
    e.map((x) => x.kaynak),
    ['kurs', 'kurs', 'wikidata'],
  );
  assert.equal(e[2].baslik, 'Stefaneschi Triptych');
  assert.equal(e[2].tarih, 'MÖ 20');
  assert.equal(e[0].gorseller[0].l, 'Public domain');
  assert.equal(e[2].anahtar, 'q:Q3');
});

test('tüm kurs eserleri geçerli bir dosya adına sahip ve birleştirmeden geçer', () => {
  for (const s of sanatcilar) {
    const e = eserleriBirlestir(s.kurs_eserleri || [], []);
    assert.ok(e.length >= Math.min(1, (s.kurs_eserleri || []).length), s.id);
    for (const x of e) assert.match(resimUrl(x.gorseller[0].d), /^https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/[^ ]+\?width=800$/);
  }
});

const es = (anahtar, ek = {}) => ({ anahtar, gorseller: [{ k: 'commons', d: anahtar + '.jpg' }], pekistirme: true, ...ek });

test('eser seçimi son gösterilenlerden kaçınır', () => {
  const eserler = ['a', 'b', 'c', 'd'].map((a) => es(a));
  const rng = rastgeleYap(4);
  for (let i = 0; i < 50; i++) assert.equal(eserSec(eserler, ['a', 'b', 'c'], rng).anahtar, 'd');
  // tek eser varsa onu verir
  assert.equal(eserSec([es('x')], ['x'], rng).anahtar, 'x');
  assert.equal(eserSec([], [], rng), null);
  // havuz sınırı
  const cok = Array.from({ length: 30 }, (_, i) => es('e' + i));
  for (let i = 0; i < 100; i++) assert.ok(Number(eserSec(cok, [], rng).anahtar.slice(1)) < TEST_HAVUZU);
});

test('30 günlük tazelik', () => {
  const simdi = Date.UTC(2026, 9, 19);
  assert.equal(tazeMi(simdi - 29 * 864e5, simdi), true);
  assert.equal(tazeMi(simdi - 31 * 864e5, simdi), false);
  assert.equal(tazeMi(undefined, simdi), false);
});

test('bulunma eki', async () => {
  const { bulunmaEki } = await import('../../js/yardimci.js');
  const b = Object.fromEntries([1, 3, 6, 9, 10, 12, 20, 24, 30, 40, 50, 60, 100].map((n) => [n, bulunmaEki(n)]));
  assert.deepEqual(b, {
    1: "1'de",
    3: "3'te",
    6: "6'da",
    9: "9'da",
    10: "10'da",
    12: "12'de",
    20: "20'de",
    24: "24'te",
    30: "30'da",
    40: "40'ta",
    50: "50'de",
    60: "60'ta",
    100: "100'de",
  });
});

test('pekiştirme havuzu: görseli elle kötü işaretli ya da kullanıcının reddettiği eserler çıkar', () => {
  const eserler = [es('a', { pekistirme: false }), es('b'), es('c', { gorseller: [{ k: 'commons', d: 'c.jpg', p: 5 }] }), es('d')];
  assert.deepEqual(
    pekistirmeHavuzu(eserler).map((e) => e.anahtar),
    ['b', 'd'],
  );
  assert.deepEqual(
    pekistirmeHavuzu(eserler, { d: ['c:d.jpg'] }).map((e) => e.anahtar),
    ['b'],
  );
  const r = rastgeleYap(1);
  for (let i = 0; i < 20; i++) assert.notEqual(eserSec(eserler, [], r).anahtar, 'a');
});

test('önbellek kaydı eser nesnesine çevrilir', () => {
  const e = onbellekEseri({
    baslik: 'Ağıt',
    yil: 1305,
    muze: 'Scrovegni',
    kurs: true,
    konu: 4,
    qid: 'Q1',
    kaynaklar: ['kurs', 'wikidata', 'nga'],
    sl: 9,
    gorseller: [
      { k: 'nga', i: 'https://api.nga.gov/iiif/x' },
      { k: 'commons', d: 'A.jpg' },
    ],
  });
  assert.equal(e.kaynak, 'kurs');
  assert.equal(e.tarih, '1305');
  assert.equal(e.kursKonu, 4);
  assert.equal(e.anahtar, 'nga:https://api.nga.gov/iiif/x');
  const w = onbellekEseri({ baslik: 'X', qid: 'Q9', kaynaklar: ['wikidata'], gorseller: [{ k: 'commons', d: 'X.jpg' }], pekistirme: false });
  assert.equal(w.anahtar, 'q:Q9');
  assert.equal(w.pekistirme, false);
  assert.equal(w.tarih, '');
});
