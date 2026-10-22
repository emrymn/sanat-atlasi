// Rapor 6. paket: K1 arama dizini, K2 zaman şeridi yerleşimi, K3 akım kimlik kartı hesapları
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normallestir, dizinKur, ara, puan } from '../../js/arama.js';
import { yasamAraligi, seritle, sanatciSeritleri, akimBantlari, yilX, centikler, pxSinirla, BAS, PX_EN_COK } from '../../js/zaman.js';
import { paletBirlestir, tipikKonular, enBilinenEserler, karsilastirmaKomsulari, akimKarsilastirmaAdresi } from '../../js/akim.js';

test('K1 normalleştirme: Türkçe harfler ve aksanlar', () => {
  assert.equal(normallestir('Çığlık Şölen Öğle Ünlü'), 'ciglik solen ogle unlu');
  assert.equal(normallestir('Dürer'), 'durer');
  assert.equal(normallestir('Velázquez · Géricault'), 'velazquez gericault');
  assert.equal(normallestir('İzlenim, Gün Doğumu'), 'izlenim gun dogumu');
  assert.equal(normallestir('  The   Night-Watch '), 'the night watch');
});

test('K1 arama: gruplu sonuç, Türkçe ve özgün ad, kelime başı önce', () => {
  const s1 = { id: 'rembrandt', ad: 'Rembrandt van Rijn', konu: 30 };
  const s2 = { id: 'durer', ad: 'Albrecht Dürer', konu: 15 };
  const dizin = dizinKur({
    sanatcilar: [s1, s2],
    eserler: [
      { s: s1, e: { anahtar: 'q1', baslik: 'The Night Watch', ad: 'Gece Devriyesi', sl: 90 } },
      { s: s2, e: { anahtar: 'q2', baslik: 'Melencolia I', sl: 40 } },
      { s: s2, e: { anahtar: 'q3', baslik: 'Young Hare', ad: 'Genç Tavşan', sl: 30 } },
    ],
    konular: [{ id: 'mujde', ad: 'Müjde', ozgun: 'Annunciation', eserler: [[1, 2]] }],
    basyapitlar: [{ anahtar: 'q1', baslik: 'Gece Devriyesi', ozgun: 'De Nachtwacht', sanatci: 'rembrandt' }],
    adlar: { rembrandt: { buyuk: 'Rembrandt' } },
  });
  const r = ara(dizin, 'gece');
  assert.deepEqual(
    r.eser.map((x) => x.veri.e.anahtar),
    ['q1'],
  );
  assert.equal(r.basyapit.length, 1);
  assert.equal(ara(dizin, 'night watch').eser[0].veri.e.anahtar, 'q1', 'özgün adla');
  assert.equal(ara(dizin, 'DURER').sanatci[0].id, 'durer', 'aksansız ve büyük harf');
  assert.equal(ara(dizin, 'mujde').konu[0].id, 'mujde');
  assert.equal(ara(dizin, 'annunciation').konu.length, 1);
  assert.equal(ara(dizin, 'g').toplam, 0, 'iki harften kısa sorgu');
  assert.equal(ara(dizin, 'zzzz').toplam, 0);
  // iki kelime: ikisi de geçmeli
  assert.equal(ara(dizin, 'genc tav').eser.length, 1);
  assert.equal(ara(dizin, 'genc gece').toplam, 0);
  // grup başına sınır ve sayı
  const cok = dizinKur({ sanatcilar: Array.from({ length: 12 }, (_, i) => ({ id: `a${i}`, ad: `Anna ${i}` })) });
  const rc = ara(cok, 'anna', { enFazla: 5 });
  assert.equal(rc.sanatci.length, 5);
  assert.equal(rc.sayilar.sanatci, 12);
});

test('K1 puan: tam > kelime başı > içinde', () => {
  assert.ok(puan('gece devriyesi', ['gece']) > puan('on ikinci gecenin', ['gece']));
  assert.equal(puan('melencolia i', ['xyz']), 0);
  assert.ok(puan('rembrandt', ['brandt']) > 0, 'üç harften uzun parça içinde de bulunur');
});

test('K2 yaşam aralığı ve şeritler: üst üste binmez', () => {
  assert.deepEqual(yasamAraligi({ dogum: 1571, olum: 1610 }), [1571, 1610]);
  assert.deepEqual(yasamAraligi({ dogum: null, olum: 1416 }), [1356, 1416]);
  assert.equal(yasamAraligi({ dogum: -480, olum: -430 }), null, 'antik çağ şeritte yok');
  assert.equal(yasamAraligi({ dogum: null, olum: null }), null);
  assert.equal(yilX(BAS, 3), 0);
  assert.equal(yilX(1100, 3), 0, 'baştan önce kırpılır');
  const l = seritle(
    [
      { bas: 1500, son: 1550, etiketPx: 0 },
      { bas: 1520, son: 1560, etiketPx: 0 },
      { bas: 1560, son: 1600, etiketPx: 0 },
    ],
    2,
    { bosluk: 0 },
  );
  assert.deepEqual(
    l.map((x) => x.serit),
    [0, 1, 0],
  );
  // etiket uzunsa yan yana sığmaz
  const e = seritle(
    [
      { bas: 1500, son: 1510, etiketPx: 200 },
      { bas: 1520, son: 1530, etiketPx: 0 },
    ],
    2,
  );
  assert.deepEqual(
    e.map((x) => x.serit),
    [0, 1],
  );
  const c = sanatciSeritleri(
    [
      { id: 'a', ad: 'A', dogum: 1600, olum: 1650 },
      { id: 'b', ad: 'B', dogum: -400, olum: -300 },
    ],
    3,
  );
  assert.equal(c.length, 1);
  const b = akimBantlari([{ ad: 'X', renk: '#000' }, { ad: 'Boş' }], [{ akim: 'X', dogum: 1600, olum: 1650 }], 3);
  assert.equal(b.length, 1);
  assert.equal(b[0].bas, 1620, 'çalışma hayatı doğum + 20');
  assert.ok(centikler(8).length > centikler(2).length, 'yakınlaştıkça sık çentik');
  assert.equal(pxSinirla(99), PX_EN_COK);
});

test('K3 palet birleştirme: yakın renkler toplanır, paylar 1 eder', () => {
  const p = paletBirlestir([
    [
      { renk: '#ff0000', pay: 0.6 },
      { renk: '#0000ff', pay: 0.4 },
    ],
    [
      { renk: '#fa0505', pay: 0.5 },
      { renk: '#00ff00', pay: 0.5 },
    ],
  ]);
  assert.equal(p.length, 3);
  assert.match(p[0].renk, /^#f[a-f0-9]0[0-9a-f]0[0-9a-f]$/);
  assert.ok(Math.abs(p.reduce((t, x) => t + x.pay, 0) - 1) < 1e-9);
  assert.deepEqual(paletBirlestir([]), []);
  assert.deepEqual(paletBirlestir([null, []]), []);
});

test('K3 tipik konular, en bilinen eserler, komşular', () => {
  const konular = [
    {
      id: 'a',
      ad: 'Aşk',
      eserler: [
        ['1', 'x'],
        ['2', 'x'],
        ['3', 'y'],
      ],
    },
    { id: 'b', ad: 'Bahçe', eserler: [['4', 'z']] },
    { id: 'c', ad: 'Cennet', eserler: [['5', 'y']] },
  ];
  assert.deepEqual(
    tipikKonular(konular, ['x', 'y']).map((k) => [k.id, k.n]),
    [
      ['a', 3],
      ['c', 1],
    ],
  );
  const g = [{ d: 'a' }];
  const l = enBilinenEserler([
    {
      s: { id: 'x' },
      eserler: [
        { baslik: 'x1', sl: 5, gorseller: g },
        { baslik: 'x2', sl: 50, gorseller: g },
      ],
    },
    { s: { id: 'y' }, eserler: [{ baslik: 'y1', sl: 20, gorseller: g }] },
    { s: { id: 'z' }, eserler: [{ baslik: 'z1', sl: 99, gorseller: [] }] },
  ]);
  assert.deepEqual(
    l.map((x) => x.e.baslik),
    ['x2', 'y1'],
    'her sanatçıdan bir, görseli olmayan atlanır',
  );
  const akimlar = [{ ad: 'Barok', komsular: ['Rokoko', 'Yok'] }, { ad: 'Rokoko' }];
  assert.deepEqual(karsilastirmaKomsulari('Barok', akimlar), ['Rokoko']);
  assert.equal(
    akimKarsilastirmaAdresi('Post-Empresyonizm', 'Ukiyo-e (Japon baskısı)'),
    '#/akim-karsilastir/Post-Empresyonizm/Ukiyo-e%20(Japon%20bask%C4%B1s%C4%B1)',
  );
});

test('K3 akım özellikleri: her akım için 3–4 madde', () => {
  const oz = JSON.parse(readFileSync(new URL('../../data/akim_ozellikleri.json', import.meta.url), 'utf8')).akimlar;
  const akimlar = JSON.parse(readFileSync(new URL('../../data/akimlar.json', import.meta.url), 'utf8'));
  for (const a of akimlar) {
    assert.ok(Array.isArray(oz[a.ad]), `${a.ad} eksik`);
    assert.ok(oz[a.ad].length >= 3 && oz[a.ad].length <= 4, `${a.ad}: 3–4 madde`);
    for (const m of oz[a.ad]) assert.ok(m.length > 8 && m.length < 90, `${a.ad}: kısa madde`);
  }
});
