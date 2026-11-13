// Çalış · Ders düzeni çekirdeği (js/ders.js) ve kaynak haritası (data/ders_kaynaklari.json, scripts/ders/kaynaklar.mjs)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DERS_ADIMLARI, SINA_GECME, dersKaydi, adimIsle, adimBittiMi, dersDurumu, bugununDersi, derslerDogrula } from '../../js/ders.js';
import { ilerlemeDogrula } from '../../js/depo.js';
import { sanatcilariBirlestir, ozellikleriBirlestir } from '../../js/birlesme.js';

const oku = (f) => JSON.parse(readFileSync(new URL(`../../data/${f}`, import.meta.url), 'utf8'));

test('kayıt: boş akımda dört adım sıfır; adım yalnız artar, eşikte biter ve günü bir kez yazılır', () => {
  const il = {};
  assert.deepEqual(Object.keys(dersKaydi(il, 'Gotik')), DERS_ADIMLARI);
  assert.equal(dersDurumu(dersKaydi(il, 'Gotik')).siradaki, 'gor');
  let r = adimIsle(il, 'Gotik', 'gor', 0.4, '2026-11-13');
  assert.deepEqual([r.sonra.gor.i, r.bitti, r.yeniBitti], [0.4, false, false]);
  r = adimIsle(il, 'Gotik', 'gor', 0.2, '2026-11-13');
  assert.equal(r.sonra.gor.i, 0.4); // düşmez
  r = adimIsle(il, 'Gotik', 'gor', 1, '2026-11-14');
  assert.deepEqual([r.bitti, r.yeniBitti, r.sonra.gor.t], [true, true, '2026-11-14']);
  r = adimIsle(il, 'Gotik', 'gor', 1, '2026-11-20');
  assert.deepEqual([r.yeniBitti, r.sonra.gor.t], [false, '2026-11-14']);
  // Sına %75'te biter, ötekiler tamamında
  adimIsle(il, 'Gotik', 'sina', SINA_GECME, '2026-11-14');
  adimIsle(il, 'Gotik', 'ogren', 0.99, '2026-11-14');
  const k = dersKaydi(il, 'Gotik');
  assert.equal(adimBittiMi(k, 'sina'), true);
  assert.equal(adimBittiMi(k, 'ogren'), false);
  const dd = dersDurumu(k);
  assert.deepEqual([dd.siradaki, dd.biten, dd.bitti], ['ogren', 2, false]);
  assert.throws(() => adimIsle(il, 'Gotik', 'oyun', 1, '2026-11-14'));
});

test('bugünün dersi: Yolculuk’taki akım önce; bittiyse dönem sırasıyla ilk bitmemiş; hepsi bittiyse yok', () => {
  const il = {};
  const acikAkimlar = ['Gotik', 'Erken Rönesans', 'Kuzey Rönesansı'];
  assert.equal(bugununDersi({ acikAkimlar, ilerleme: il, yolculukAkimi: 'Erken Rönesans' }), 'Erken Rönesans');
  assert.equal(bugununDersi({ acikAkimlar, ilerleme: il, yolculukAkimi: 'Barok' }), 'Gotik'); // açık değil
  for (const a of DERS_ADIMLARI) adimIsle(il, 'Erken Rönesans', a, 1, '2026-11-13');
  assert.equal(bugununDersi({ acikAkimlar, ilerleme: il, yolculukAkimi: 'Erken Rönesans' }), 'Gotik');
  for (const ad of acikAkimlar) for (const a of DERS_ADIMLARI) adimIsle(il, ad, a, 1, '2026-11-13');
  assert.equal(bugununDersi({ acikAkimlar, ilerleme: il }), null);
});

test('doğrulama: bozuk değerler atılır; birleşen akım hedefe katılır; yedekten geri yüklemede korunur', () => {
  const v = {
    Gotik: { gor: { i: 0.5 }, ogren: { i: 1, t: '2026-11-20' }, sina: { i: 'x' } },
    'Uluslararası Gotik': { gor: { i: 1, t: '2026-11-10' }, ogren: { i: 1, t: '2026-11-12' } },
    Barok: { gor: { i: 7, t: 'dün' } },
    Bos: { gor: { i: 0 } },
    Dizi: [1, 2],
  };
  const d = derslerDogrula(v);
  assert.deepEqual(d, {
    Gotik: { gor: { i: 1, t: '2026-11-10' }, ogren: { i: 1, t: '2026-11-12' } },
    Barok: { gor: { i: 1 } },
  });
  assert.deepEqual(derslerDogrula(null), {});
  const il = ilerlemeDogrula({ islenen: [3], dersler: { Gotik: { gor: { i: 1, t: '2026-11-13' } } } });
  assert.deepEqual(il.dersler, { Gotik: { gor: { i: 1, t: '2026-11-13' } } });
  assert.deepEqual(ilerlemeDogrula({ islenen: [3] }).dersler, {}); // eski yedek
});

test('kaynak haritası: akımlar, sanatçılar ve maddeler uygulamanın verisiyle tutarlı; kanıtlar dersin sanatçılarından', () => {
  const k = oku('ders_kaynaklari.json');
  const sanatcilar = new Map(sanatcilariBirlestir(oku('sanatcilar.json')).map((s) => [s.id, s]));
  const ozellikler = ozellikleriBirlestir(oku('akim_ozellikleri.json').akimlar);
  const adlar = new Set(k.dersler.map((d) => d.akim));
  assert.ok(!adlar.has('Uluslararası Gotik'));
  assert.ok(adlar.has('Gotik'));
  const yuruyus = oku('yuruyus.json').eserler;
  const onbellek = oku('eserler_onbellek.json');
  for (const d of k.dersler) {
    const uyeler = new Set(d.sanatcilar);
    for (const id of d.sanatcilar) assert.equal(sanatcilar.get(id).akim, d.akim, id);
    assert.deepEqual(d.ogren.map((m) => m.madde), ozellikler[d.akim] || [], d.akim);
    for (const m of d.ogren) for (const a of m.kanit_adaylari) assert.ok(uyeler.has(a.sanatci), `${d.akim}: ${a.sanatci}`);
    for (const g of d.gor) {
      assert.ok(uyeler.has(g.sanatci));
      assert.equal(yuruyus[g.sanatci].eser, g.eser);
    }
    for (const c of d.ayirt) {
      assert.ok(adlar.has(c.komsu), `${d.akim} ↔ ${c.komsu}`);
      assert.ok(c.eserler.kendi.length && c.eserler.komsu.length, `${d.akim} ↔ ${c.komsu}: eser seçilmemiş`);
      for (const e of c.eserler.kendi) {
        assert.ok(uyeler.has(e.sanatci), `${d.akim}: ${e.sanatci}`);
        const eser = (onbellek.sanatcilar[e.sanatci].eserler || []).find((x) => x.baslik === e.baslik && (!e.qid || x.qid === e.qid));
        assert.ok(eser && eser.gorseller && eser.gorseller.length && eser.pekistirme !== false, `${d.akim}: ${e.baslik} eser listesinde yok ya da görseli yok`);
      }
    }
    assert.deepEqual(d.sina.map((x) => x.id), d.sanatcilar);
  }
});

test('doğrulama: her kanıt adayına karar verilmiş; her karar hâlâ var olan bir adaya ait', () => {
  const k = oku('ders_kaynaklari.json');
  const kararlar = oku('ders_dogrulama.json').kararlar;
  const adaylar = new Set();
  for (const d of k.dersler)
    for (const m of d.ogren)
      for (const a of [...m.kanit_adaylari, ...m.genel_adaylar]) {
        adaylar.add(`${d.akim}|${m.no + 1}|${a.id}`);
        assert.notEqual(a.durum, 'bakilmadi', `${d.akim} ${m.no + 1}. madde: ${a.cumle} (scripts/ders/kaynaklar.mjs yeni aday buldu; data/ders_dogrulama.json'a karar yazılmalı)`);
      }
  for (const anahtar of Object.keys(kararlar)) assert.ok(adaylar.has(anahtar), `sahipsiz karar: ${anahtar}`);
  for (const v of Object.values(kararlar)) assert.ok(['dogru', 'yanlis', 'belirsiz'].includes(v.d));
});
