// Ö1 · Ters soru: ne zaman sorulur, dört eser nasıl seçilir, yarım oturumda nasıl saklanır
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tersSorulurMu, tersSecenekleri, TERS_ORANI } from '../../js/ters.js';
import { kayitYap, kayitGecerliMi, kayittanKur } from '../../js/devam.js';
import { Oturum } from '../../js/oturum.js';

const eser = (anahtar, ek = {}) => ({ anahtar, baslik: anahtar, gorseller: [{ k: 'commons', d: `${anahtar}.jpg` }], ...ek });
const sabit = (x) => () => x;

test('yalnızca karışık kipte, Orta ve Zor seviyede ve yaklaşık dörtte bir', () => {
  assert.equal(TERS_ORANI, 0.25);
  assert.equal(tersSorulurMu({ kip: 'karisik', seviye: 1, rng: sabit(0.1) }), true);
  assert.equal(tersSorulurMu({ kip: 'karisik', seviye: 2, rng: sabit(0.24) }), true);
  assert.equal(tersSorulurMu({ kip: 'karisik', seviye: 2, rng: sabit(0.3) }), false);
  assert.equal(tersSorulurMu({ kip: 'karisik', seviye: 0, rng: sabit(0) }), false, 'Kolay seviyede yok');
  assert.equal(tersSorulurMu({ kip: 'donem', seviye: 2, rng: sabit(0) }), false, 'Döneme göre turda yok');
  assert.equal(tersSorulurMu({ kip: 'karisik', seviye: 1, rng: sabit(0.9), oran: 1 }), true, 'test için oran verilebilir');
});

test('dört seçenek: doğru eser + üç çeldirici sanatçıdan birer eser, her sanatçı bir kez', () => {
  let i = 0;
  const rng = () => ((i = (i * 7 + 3) % 10) / 10);
  const d = tersSecenekleri({
    dogru: { id: 'a', eser: eser('a1') },
    celdiriciler: [
      { id: 'b', eserler: [eser('b1'), eser('b2')] },
      { id: 'a', eserler: [eser('a2')] }, // doğru sanatçı çeldirici olamaz
      { id: 'c', eserler: [] }, // eseri yok: atlanır
      { id: 'd', eserler: [eser('d1')] },
      { id: 'b', eserler: [eser('b3')] }, // aynı sanatçı ikinci kez gelmez
      { id: 'e', eserler: [eser('e1', { pekistirme: false }), eser('e2')] },
    ],
    rng,
  });
  assert.equal(d.length, 4);
  assert.deepEqual(d.map((x) => x.id).sort(), ['a', 'b', 'd', 'e']);
  assert.equal(d.find((x) => x.id === 'a').eser.anahtar, 'a1');
  assert.equal(d.find((x) => x.id === 'e').eser.anahtar, 'e2', 'pekiştirmeye uygun olmayan eser seçilmez');
});

test('mümkünse aynı konuyu işleyen eserler (konu ipucu vermesin)', () => {
  const konular = { a1: 'mujde', b2: 'mujde', c1: 'mujde', d1: 'portre' };
  const konusu = (e) => (konular[e.anahtar] ? { id: konular[e.anahtar] } : null);
  const d = tersSecenekleri({
    dogru: { id: 'a', eser: eser('a1') },
    celdiriciler: [
      { id: 'b', eserler: [eser('b1'), eser('b2'), eser('b3')] },
      { id: 'c', eserler: [eser('c0'), eser('c1')] },
      { id: 'd', eserler: [eser('d1'), eser('d2')] },
    ],
    rng: sabit(0),
    konusu,
  });
  const anahtar = Object.fromEntries(d.map((x) => [x.id, x.eser.anahtar]));
  assert.equal(anahtar.b, 'b2');
  assert.equal(anahtar.c, 'c1');
  assert.equal(anahtar.d, 'd1', 'aynı konuda eseri yoksa herhangi bir eseri');
});

test('üç çeldirici eser bulunamazsa null (normal soru sorulur)', () => {
  assert.equal(tersSecenekleri({ dogru: { id: 'a', eser: eser('a1') }, celdiriciler: [{ id: 'b', eserler: [eser('b1')] }, { id: 'c', eserler: [] }] }), null);
  assert.equal(tersSecenekleri({ dogru: { id: 'a', eser: null }, celdiriciler: [] }), null);
});

test('yarım oturum: ters kartın dört eseri anahtarlarıyla saklanır ve geri kurulur', () => {
  const ot = new Oturum(['a', 'b'], { rng: () => 0 });
  const ters = [
    { id: 'c', eser: eser('c1') },
    { id: 'a', eser: eser('a1') },
    { id: 'd', eser: eser('d1') },
    { id: 'e', eser: eser('e1') },
  ];
  const o = { kimlik: 'x', kip: 'karisik', akim: null, oturum: ot, gosterilen: [], kart: { konum: 0, id: 'a', eser: eser('a1'), secenekler: ['c', 'a', 'd', 'e'], akimSecenekleri: null, adim: 1, cevapSanatci: null, cevapAkim: null, bitti: false, tur: 'ters', ters } };
  const k = kayitYap(o, 1000);
  assert.equal(k.kart.tur, 'ters');
  assert.deepEqual(k.kart.ters, [
    { id: 'c', eser: 'c1' },
    { id: 'a', eser: 'a1' },
    { id: 'd', eser: 'd1' },
    { id: 'e', eser: 'e1' },
  ]);
  const json = JSON.parse(JSON.stringify(k));
  assert.ok(kayitGecerliMi(json, 2000));
  const kur = kayittanKur(json, { varMi: () => true });
  assert.equal(kur.kart.tur, 'ters');
  assert.equal(kur.kart.ters.length, 4);
  // bozuk ters kaydı reddedilir
  assert.equal(kayitGecerliMi({ ...json, kart: { ...json.kart, ters: [{ id: 'c' }] } }, 2000), false);
  // normal kartın kaydında ters alanı yok
  const n = kayitYap({ ...o, kart: { ...o.kart, tur: undefined, ters: undefined } }, 1000);
  assert.equal(n.kart.tur, undefined);
});
