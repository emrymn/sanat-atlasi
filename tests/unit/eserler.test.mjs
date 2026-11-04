import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eserleriBirlestir, eserSec, tazeMi, TEST_HAVUZU, onbellekEseri, pekistirmeHavuzu, kopyalariAyikla } from '../../js/eserler.js';
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

test('K4: Koleksiyonum’daki eser iki kat sık seçilir; yoksa davranış aynı', () => {
  const eserler = ['a', 'b', 'c', 'd'].map((a) => es(a));
  const say = (isaretli) => {
    const rng = rastgeleYap(11);
    const n = {};
    for (let i = 0; i < 4000; i++) {
      const e = eserSec(eserler, [], rng, {}, { isaretli });
      n[e.anahtar] = (n[e.anahtar] || 0) + 1;
    }
    return n;
  };
  const n = say(new Set(['b']));
  assert.ok(n.b > 1.6 * n.a && n.b < 2.5 * n.a, JSON.stringify(n));
  // işaretli eser adaylar arasında değilse ya da küme boşsa eski seçim (aynı rastgele dizi, aynı sonuç)
  const r1 = rastgeleYap(5);
  const r2 = rastgeleYap(5);
  for (let i = 0; i < 20; i++) assert.equal(eserSec(eserler, [], r1, {}, { isaretli: new Set(['z']) }).anahtar, eserSec(eserler, [], r2).anahtar);
  // son gösterilenlerden kaçınma önce gelir
  const r3 = rastgeleYap(6);
  for (let i = 0; i < 30; i++) assert.notEqual(eserSec(eserler, ['b'], r3, {}, { isaretli: new Set(['b']) }).anahtar, 'b');
});

// İş 101: farklı adla iki kez kayıtlı aynı tablo (data/kopya_eserler.json)
test('kopyalariAyikla: silinen çıkar, kurs bilgisi ve başlığı kalana geçer, eksik çifte dokunulmaz', () => {
  const liste = () => [
    { anahtar: 'c:a.jpg', kaynak: 'kurs', kaynaklar: ['kurs'], baslik: 'Zevk Bahçesi', kursKonu: 7, sl: 0 },
    { anahtar: 'q:Q1', kaynak: 'wikidata', kaynaklar: ['wikidata'], baslik: 'Garden of Earthly Delights', kursKonu: null, sl: 40 },
    { anahtar: 'q:Q2', kaynak: 'wikidata', kaynaklar: ['wikidata'], baslik: 'Başka', kursKonu: null, sl: 5 },
  ];
  const k = { bosch: [{ sil: 'c:a.jpg', kalan: 'q:Q1' }] };
  const l = kopyalariAyikla('bosch', liste(), k);
  assert.deepEqual(
    l.map((e) => e.anahtar),
    ['q:Q1', 'q:Q2'],
  );
  assert.equal(l[0].kaynak, 'kurs');
  assert.equal(l[0].kursKonu, 7);
  assert.equal(l[0].baslik, 'Zevk Bahçesi');
  assert.equal(l[0].sl, 40);
  // başka sanatçı, eksik kayıt: liste aynen döner
  const ham = liste();
  assert.equal(kopyalariAyikla('baska', ham, k), ham);
  assert.equal(kopyalariAyikla('bosch', ham, { bosch: [{ sil: 'c:yok.jpg', kalan: 'q:Q1' }] }).length, 3);
  // kalan başka bir çiftte silinmişse ikinci çift uygulanmaz (ikisi birden gitmesin)
  const zincir = kopyalariAyikla('bosch', liste(), { bosch: [{ sil: 'q:Q2', kalan: 'q:Q1' }, { sil: 'q:Q1', kalan: 'q:Q2' }] });
  assert.deepEqual(
    zincir.map((e) => e.anahtar),
    ['c:a.jpg', 'q:Q1'],
  );
});

// İş 117: Emre'nin bildirdiği ve denetimin çıkardığı görseller hangi yoldan gelirse gelsin gösterilmez
test('İş 117: çıkarılan görseller atılır, görseli kalmayan eser düşer; liste veride ve önbellekte tutarlı', async () => {
  const { cikarilanlariAyikla } = await import('../../js/eserler.js');
  const c = new Set(['masaccio,_trinità.jpg', 'met:https://x/a.jpg']);
  const liste = [
    { anahtar: 'a', gorseller: [{ k: 'commons', d: 'Masaccio,_trinit%C3%A0.jpg' }, { k: 'commons', d: 'Masaccio - Trinity.jpg' }] },
    { anahtar: 'b', gorseller: [{ k: 'met', u: 'https://x/a.jpg' }] },
    { anahtar: 'c', gorseller: [{ k: 'commons', d: 'Başka.jpg' }] },
  ];
  const s = cikarilanlariAyikla(liste, c);
  assert.deepEqual(s.map((e) => e.anahtar), ['a', 'c']);
  assert.deepEqual(s[0].gorseller.map((g) => g.d), ['Masaccio - Trinity.jpg']);
  assert.equal(s[1], liste[2]);
  assert.equal(cikarilanlariAyikla(liste, new Set()), liste);
  // veri: listedeki hiçbir görsel önbellekte yok (scripts/gorsel_denetim/isle.py ikisini birlikte yazar)
  const { readFileSync } = await import('node:fs');
  const oku = (f) => JSON.parse(readFileSync(new URL(`../../${f}`, import.meta.url)));
  const cikar = new Set(oku('data/cikarilan_gorseller.json').anahtarlar);
  const ob = oku('data/eserler_onbellek.json').sanatcilar;
  for (const v of Object.values(ob)) assert.equal(cikarilanlariAyikla(v.eserler, cikar).length, v.eserler.length);
  for (const a of ['cenacolo_di_fuligno_di_pietro_perugino.jpg', 'masaccio,_trinità.jpg', 'assisis_basilica_superiore.jpg']) assert.ok(cikar.has(a), a);
});
