// 1.78.0 · Uluslararası Gotik uygulamada Gotik'e katıldı (js/birlesme.js); veri dosyaları değişmez
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  akimAdi,
  sanatcilariBirlestir,
  akimlariBirlestir,
  akimBilgisiBirlestir,
  ozellikleriBirlestir,
  seviyeleriBirlestir,
} from '../../js/birlesme.js';
import { akimSecenekleri } from '../../js/celdirici.js';
import { ilerlemeDogrula } from '../../js/depo.js';
import { gecmisDogrula } from '../../js/gecmis.js';
import { rastgeleYap } from '../../js/yardimci.js';

const oku = (f) => JSON.parse(readFileSync(new URL(`../../data/${f}`, import.meta.url), 'utf8'));
const IG = 'Uluslararası Gotik';

test('sanatçılar: Limbourg kardeşler ve Gentile Gotik; gelen veri değişmez', () => {
  const ham = oku('sanatcilar.json');
  const l = sanatcilariBirlestir(ham);
  assert.equal(l.length, ham.length);
  assert.ok(!l.some((s) => s.akim === IG));
  assert.equal(l.find((s) => s.id === 'limbourg-kardesler').akim, 'Gotik');
  assert.equal(l.find((s) => s.id === 'gentile-da-fabriano').akim, 'Gotik');
  assert.equal(ham.find((s) => s.id === 'limbourg-kardesler').akim, IG);
  assert.equal(l.filter((s) => s.akim === 'Gotik').length, 12);
});

test('akımlar: Uluslararası Gotik listede yok, komşu listelerinde Gotik oldu, kendine komşu ve tekrar yok', () => {
  const l = akimlariBirlestir(oku('akimlar.json'));
  assert.ok(!l.some((a) => a.ad === IG));
  for (const a of l) {
    assert.ok(!a.komsular.includes(IG), a.ad);
    assert.ok(!a.komsular.includes(a.ad), a.ad);
    assert.equal(new Set(a.komsular).size, a.komsular.length, a.ad);
  }
  assert.deepEqual(l.find((a) => a.ad === 'Gotik').komsular, ['Erken Rönesans', 'Romanesk']);
  assert.deepEqual(l.find((a) => a.ad === 'Kuzey Rönesansı').komsular, ['Gotik', 'Erken Rönesans', 'Flaman Barok']);
  // akım sorusunda Uluslararası Gotik artık şık olamaz
  for (let i = 0; i < 20; i++) assert.ok(!akimSecenekleri('Gotik', l, rastgeleYap(i)).includes(IG));
  assert.equal(akimAdi(IG), 'Gotik');
  assert.equal(akimAdi('Barok'), 'Barok');
});

test('dönem metni ve "Nasıl tanınır?" Gotik’in sonuna eklenir', () => {
  const b = akimBilgisiBirlestir(oku('akim_bilgi.json')).akimlar;
  assert.ok(!(IG in b));
  assert.match(b.Gotik.metin, /Proto-Rönesans.*Uluslararası Gotik, 14\. yüzyılın sonu/s);
  assert.equal(b.Gotik.donem, '12. yüzyıl – y. 1425');
  const oz = ozellikleriBirlestir(oku('akim_ozellikleri.json').akimlar);
  assert.ok(!(IG in oz));
  assert.equal(oz.Gotik.length, 7);
  assert.ok(oz.Gotik.slice(4).every((x) => x.endsWith(`(${IG})`)));
});

test('seviye kaydı birleşir: yüksek seviye kalır, eşitse son cevaplar birleşir', () => {
  assert.deepEqual(seviyeleriBirlestir({ [IG]: { s: 1, son: [1] }, Gotik: { s: 0, son: [0, 1] } }), { Gotik: { s: 1, son: [1] } });
  assert.deepEqual(seviyeleriBirlestir({ [IG]: { s: 0, son: [1, 1] }, Gotik: { s: 1, son: [0] } }), { Gotik: { s: 1, son: [0] } });
  assert.deepEqual(seviyeleriBirlestir({ [IG]: { s: 0, son: [1, 0] }, Gotik: { s: 0, son: [1] } }), { Gotik: { s: 0, son: [1, 0, 1] } });
  assert.deepEqual(seviyeleriBirlestir({ [IG]: { s: 2, son: [] } }), { Gotik: { s: 2, son: [] } });
  // açılışta ve yedekten geri yüklemede (ilerlemeDogrula)
  const v = ilerlemeDogrula({ islenen: [10], seviyeler: { [IG]: { s: 1, son: [1, 1] } } });
  assert.deepEqual(v.seviyeler, { Gotik: { s: 1, son: [1, 1] } });
});

test('geçmişteki akım sayıları Gotik altında toplanır', () => {
  const g = gecmisDogrula({ '2026-11-01': { kart: 5, dogru: 3, akimlar: { [IG]: 2, Gotik: 3 } } });
  assert.deepEqual(g['2026-11-01'].akimlar, { Gotik: 5 });
});

test('harita: birleşen akımın durağı geri gelir, ortalama sayıda sanatçıyla ve eski kimliğiyle (1.78.1)', async () => {
  const { bolumleriKur } = await import('../../js/bolum.js');
  const akimlar = [{ ad: 'Gotik', sira: 2 }, { ad: 'B', sira: 4 }];
  const s = (id, akim, konu, dogum, birlesen) => ({ id, akim, konu, dogum, ...(birlesen ? { birlesen } : {}) });
  const sanatcilar = [
    s('g1', 'Gotik', 3, 1200), s('g2', 'Gotik', 3, 1240), s('g3', 'Gotik', 3, 1266),
    s('g4', 'Gotik', 5, 1255), s('g5', 'Gotik', 6, 1280), s('g6', 'Gotik', 6, 1284), s('g7', 'Gotik', 6, 1290),
    s('ig1', 'Gotik', 10, 1385, IG), s('ig2', 'Gotik', 10, 1370, IG),
    s('b1', 'B', 1, 1400), s('b2', 'B', 1, 1401), s('b3', 'B', 1, 1402), s('b4', 'B', 1, 1403), s('b5', 'B', 1, 1404),
  ];
  const l = bolumleriKur(akimlar, sanatcilar);
  // ortalama: (3 + 4 + 5) / 3 = 4
  assert.deepEqual(l.map((b) => b.id), ['2-1', '2-2', '3-1', '4-1']);
  const ig = l.find((b) => b.id === '3-1');
  assert.equal(ig.akim, 'Gotik');
  assert.deepEqual(ig.sanatcilar, ['g6', 'g7', 'ig2', 'ig1']); // en geç doğan iki Gotik sanatçısı, doğum sırasıyla
  assert.deepEqual(ig.konular, [6, 10]);
  assert.deepEqual([ig.no, ig.adet], [3, 3]);
  // Gotik'in kendi durakları birleşmeden önceki gibi; tamamlayan sanatçılar orada da kalır
  assert.deepEqual(l.find((b) => b.id === '2-2').sanatcilar, ['g4', 'g5', 'g6', 'g7']);
  assert.equal(l.find((b) => b.id === '2-1').adet, 3);
});
