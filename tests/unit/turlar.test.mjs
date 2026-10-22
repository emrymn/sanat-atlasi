// Rapor 5. paket: Ö6 konu turu, Ö5 hatalarım turu, Ö9 seviye seçimi; yarım oturumda yeni kipler
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { konuTuru, konuTanismalari, hatalarTuru, hataliMi, esiEkle, KONU_TURU_EN_AZ, KONU_TURU_EN_FAZLA } from '../../js/turlar.js';
import { seviyeSecenekleri, kartSeviyesi, pencereyeYazilirMi } from '../../js/seviye.js';
import { kayitYap, kayitGecerliMi, kayittanKur, devamOzeti } from '../../js/devam.js';
import { Oturum } from '../../js/oturum.js';

const sanatci = (id, ek = {}) => ({ id, ad: id, kaynak: 'kurs', ...ek });
const goruldu = (ek = {}) => ({ kutu: 2, sonraki: '2026-10-30', dogru: 2, yanlis: 0, son: '2026-10-20', ...ek });
let tohum = 1;
const rng = () => (tohum = (tohum * 16807) % 2147483647) / 2147483647;

test('Ö6 konu turu: 6–8 kart, yeniler önce, az sanatçıda tekrar ama arka arkaya değil', () => {
  const on = Array.from({ length: 10 }, (_, i) => sanatci(`s${i}`));
  const skor = { s0: { sanatci: goruldu() }, s1: { sanatci: goruldu() } };
  const t = konuTuru(on, skor, rng);
  assert.equal(t.length, KONU_TURU_EN_FAZLA);
  assert.equal(new Set(t).size, t.length);
  // hiç görülmemiş 8 sanatçı var: görülmüş ikisi tura girmez
  assert.ok(!t.includes('s0') && !t.includes('s1'));

  const uc = [sanatci('a'), sanatci('b'), sanatci('c')];
  const t3 = konuTuru(uc, {}, rng);
  assert.equal(t3.length, KONU_TURU_EN_AZ);
  for (const id of ['a', 'b', 'c']) assert.equal(t3.filter((x) => x === id).length, 2);
  for (let i = 1; i < t3.length; i++) assert.notEqual(t3[i], t3[i - 1], 'aynı sanatçı arka arkaya gelmez');

  assert.deepEqual(konuTuru([], {}, rng), []);
  assert.equal(konuTuru([sanatci('tek')], {}, rng).length, KONU_TURU_EN_AZ, 'tek sanatçılı konuda bile kısa tur');
});

test('Ö6 tanışmalar: yalnızca hiç sorulmamışlar, kurs sanatçıları önce', () => {
  const l = [sanatci('ek1', { kaynak: 'ek' }), sanatci('k1'), sanatci('k2'), sanatci('eski')];
  assert.deepEqual(konuTanismalari(l, { eski: { sanatci: goruldu() } }), ['k1', 'k2', 'ek1']);
});

test('Ö5 hatalı: kutu 0, yanlış var ve son 7 gün içinde', () => {
  const b = '2026-10-22';
  assert.equal(hataliMi({ sanatci: goruldu({ kutu: 0, yanlis: 1, son: '2026-10-20' }) }, b), true);
  assert.equal(hataliMi({ sanatci: goruldu({ kutu: 0, yanlis: 1, son: '2026-10-15' }) }, b), false, '7 günden eski');
  assert.equal(hataliMi({ sanatci: goruldu({ kutu: 0, yanlis: 1, son: '2026-10-16' }) }, b), true, '6 gün önce');
  assert.equal(hataliMi({ sanatci: goruldu({ kutu: 1, yanlis: 1 }) }, b), false, 'sonra doğru yapılmış');
  assert.equal(hataliMi({ akim: goruldu({ kutu: 0, yanlis: 1 }) }, b), false, 'yalnızca sanatçı sorusu sayılır');
  assert.equal(hataliMi(undefined, b), false);
});

test('Ö5 hatalarım turu: ikililer yan yana ve birbirinin eşi, sonra kalan hatalılar', () => {
  const b = '2026-10-22';
  const adaylar = ['a', 'b', 'c', 'd', 'e', 'f', 'kapali'].map((id) => sanatci(id));
  const yanlis = goruldu({ kutu: 0, yanlis: 1, son: '2026-10-21' });
  const skorlar = { a: { sanatci: yanlis }, e: { sanatci: yanlis }, f: { sanatci: yanlis } };
  const karisanlar = {
    'a|b': { n: 3, son: '2026-10-21' },
    'c|d': { n: 1, son: '2026-10-20' },
    'a|c': { n: 2, son: '2026-10-21' }, // a zaten bir ikilide: atlanır
    'e|x': { n: 5, son: '2026-10-21' }, // x açık değil
    'b|f': { n: 4, son: '2026-09-01' }, // eski
  };
  const h = hatalarTuru({ adaylar, skorlar, karisanlar, bugun: b, rng });
  assert.deepEqual(h.ikililer, [
    { a: 'a', b: 'b', n: 3 },
    { a: 'c', b: 'd', n: 1 },
  ]);
  // ikililer ardışık
  assert.deepEqual(new Set(h.idler.slice(0, 2)), new Set(['a', 'b']));
  assert.deepEqual(new Set(h.idler.slice(2, 4)), new Set(['c', 'd']));
  assert.equal(h.esler.a, 'b');
  assert.equal(h.esler.b, 'a');
  assert.equal(h.esler.d, 'c');
  // kalan hatalılar (a ikilide zaten var)
  assert.deepEqual(new Set(h.idler.slice(4)), new Set(['e', 'f']));
  assert.equal(h.idler.length, 6);
  assert.equal(new Set(h.idler).size, 6);
  assert.deepEqual(new Set(h.hatalilar), new Set(['a', 'e', 'f']));
  // hiç hata yoksa boş
  assert.deepEqual(hatalarTuru({ adaylar, skorlar: {}, karisanlar: {}, bugun: b, rng }).idler, []);
  // en fazla adet
  assert.ok(hatalarTuru({ adaylar, skorlar, karisanlar, bugun: b, rng, adet: 3 }).idler.length <= 3);
});

test('Ö5 eş şıklarda: doğru olmayan bir seçeneğin yerine, sayı korunur', () => {
  assert.deepEqual(esiEkle(['x', 'd', 'y', 'z'], 'd', 'y', rng), ['x', 'd', 'y', 'z'], 'zaten var');
  const r = esiEkle(['x', 'd', 'y', 'z'], 'd', 'e', rng);
  assert.equal(r.length, 4);
  assert.ok(r.includes('e') && r.includes('d'));
  assert.equal(r[1], 'd', 'doğru seçenek yerinde kalır');
  assert.deepEqual(esiEkle(['x', 'd'], 'd', null, rng), ['x', 'd']);
});

test('Ö9 seviye seçimi: açılmamış seviye kilitli, kart seviyesi üst sınırı aşmaz, alt seviye pencereye yazılmaz', () => {
  const orta = { s: 1, son: [1, 1] };
  assert.deepEqual(
    seviyeSecenekleri(orta).map((x) => [x.ad, x.acik]),
    [
      ['Kolay', true],
      ['Orta', true],
      ['Zor', false],
    ],
  );
  assert.equal(kartSeviyesi(orta, null), 1);
  assert.equal(kartSeviyesi(orta, 0), 0);
  assert.equal(kartSeviyesi(orta, 2), 1, 'kilitli seviyeye çıkılmaz');
  assert.equal(pencereyeYazilirMi(orta, 0), false);
  assert.equal(pencereyeYazilirMi(orta, 1), true);
  assert.equal(pencereyeYazilirMi({ s: 0, son: [] }, 0), true);
});

test('yarım oturum: konu ve hatalarım kipleri, seçilen seviye ve eşler kayda girer', () => {
  const o = {
    kip: 'konu',
    akim: '12',
    kimlik: 'k1',
    oturum: new Oturum(['a', 'b', 'a']),
    kart: null,
    seviye: null,
    esler: null,
  };
  o.oturum.konum = 1;
  const k = kayitYap(o);
  assert.equal(kayitGecerliMi(k), true);
  assert.equal(devamOzeti(k), 'Konu 12 · 2 / 3');
  const h = kayitYap({ ...o, kip: 'hatalar', akim: null, esler: { a: 'b', b: 'a' } });
  assert.equal(kayitGecerliMi(h), true);
  assert.deepEqual(h.esler, { a: 'b', b: 'a' });
  assert.equal(devamOzeti(h), 'Hatalarım · 2 / 3');
  const dn = kayitYap({ ...o, kip: 'donem', akim: 'Barok', seviye: 0 });
  assert.equal(dn.seviye, 0);
  assert.equal(kayitGecerliMi({ ...k, kip: 'bilinmeyen' }), false);
  assert.equal(kayitGecerliMi({ ...k, akim: null }), false, 'konu kipinde konu numarası gerekli');
  assert.ok(kayittanKur(h, { varMi: () => true }));
});
