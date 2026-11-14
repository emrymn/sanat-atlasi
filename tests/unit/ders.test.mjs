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

// ---------- 1.79.0 · adımların içerik seçimi (js/dersIcerik.js) ve üç adımlı dersler ----------
import { dersBul, gorPlani, ogrenPlani, ayirtPlani, dersAdimlari, eserEslestir, sinaSoruSayisi, adimOrani, kalinanYer, dersHali, GOR_ESER, KANIT_ESER } from '../../js/dersIcerik.js';

const KAYNAK = oku('ders_kaynaklari.json');
const YURUYUS = oku('yuruyus.json').eserler;
const GOR_YOK = ['Dada', 'Sürrealizm', 'Savaş sonrası figürasyon'];

test('üç adımlı ders: Gör verisi olmayan derste Gör yok; ders üç adımla biter ve bugünün dersi olmaktan çıkar', () => {
  for (const d of KAYNAK.dersler) {
    const adimlar = dersAdimlari(d, YURUYUS);
    assert.deepEqual(adimlar, GOR_YOK.includes(d.akim) ? ['ogren', 'ayirt', 'sina'] : DERS_ADIMLARI, d.akim);
  }
  const il = {};
  const uc = ['ogren', 'ayirt', 'sina'];
  assert.equal(dersDurumu(dersKaydi(il, 'Dada'), uc).siradaki, 'ogren');
  assert.equal(dersDurumu(dersKaydi(il, 'Dada'), uc).adimlar.length, 3);
  for (const a of uc) adimIsle(il, 'Dada', a, 1, '2026-11-13');
  assert.equal(dersDurumu(dersKaydi(il, 'Dada'), uc).bitti, true);
  assert.equal(dersDurumu(dersKaydi(il, 'Dada')).bitti, false); // dört adım sayılsaydı hiç bitmezdi
  const adimlar = (ad) => (ad === 'Dada' ? uc : DERS_ADIMLARI);
  assert.equal(bugununDersi({ acikAkimlar: ['Dada', 'Sürrealizm'], ilerleme: il, yolculukAkimi: 'Dada', adimlar }), 'Sürrealizm');
  assert.equal(bugununDersi({ acikAkimlar: ['Dada'], ilerleme: il, yolculukAkimi: 'Dada', adimlar }), null);
});

test('Gör planı: en çok üç eser, kaynak sırasıyla; yürüyüşü değişmiş ya da noktasız eser atlanır', () => {
  const gotik = dersBul(KAYNAK, 'Gotik');
  const p = gorPlani(gotik, YURUYUS);
  assert.equal(p.eserler.length, GOR_ESER);
  assert.deepEqual(p.eserler.map((e) => e.sanatci), gotik.gor.slice(0, 3).map((g) => g.sanatci));
  assert.equal(p.toplam, p.eserler.reduce((t, e) => t + e.kayit.noktalar.length, 0));
  assert.ok(p.toplam > 0);
  // kayıt başka esere geçmişse o eser plana girmez (yürüyüş uydurulmaz)
  const ilk = gotik.gor[0].sanatci;
  const bozuk = { ...YURUYUS, [ilk]: { ...YURUYUS[ilk], eser: 'Başka eser' } };
  assert.ok(!gorPlani(gotik, bozuk).eserler.some((e) => e.sanatci === ilk));
  assert.deepEqual(gorPlani(gotik, {}), { eserler: [], toplam: 0 });
  assert.deepEqual(gorPlani(dersBul(KAYNAK, 'Dada'), YURUYUS).eserler, []);
  assert.equal(dersBul(KAYNAK, 'Olmayan akım'), null);
});

test('Öğren planı: kanıt yalnız doğrulanmış adaylardan; yanlış, belirsiz ve bakılmamış hiçbir yere girmez', () => {
  const durumlar = new Map(); // aday kimliği → durumlar (aynı cümle iki maddede farklı karar alabilir)
  let kanitsiz = 0;
  let madde = 0;
  let yanlisVar = false;
  for (const d of KAYNAK.dersler) {
    const plan = ogrenPlani(d);
    assert.deepEqual(plan.map((m) => m.madde), d.ogren.map((m) => m.madde), d.akim);
    plan.forEach((m, i) => {
      madde++;
      const ham = d.ogren[i];
      const izinli = new Set(ham.kanit_adaylari.filter((a) => a.durum === 'dogrulandi').map((a) => a.id));
      const genel = new Set(ham.genel_adaylar.filter((a) => a.durum === 'dogrulandi').map((a) => a.id));
      if (ham.kanit_adaylari.some((a) => a.durum !== 'dogrulandi')) yanlisVar = true;
      for (const k of m.kanitlar) {
        assert.ok(izinli.has(k.id), `${d.akim} ${i + 1}: doğrulanmamış kanıt ${k.id}`);
        assert.ok(k.sanatci && k.eser && k.cumle);
      }
      for (const a of m.aciklamalar) assert.ok(genel.has(a.id), `${d.akim} ${i + 1}: doğrulanmamış açıklama ${a.id}`);
      assert.ok(m.kanitlar.length <= KANIT_ESER);
      // aynı eser iki kez gösterilmez
      assert.equal(new Set(m.kanitlar.map((k) => `${k.sanatci}|${k.qid || k.anahtar || k.eser}`)).size, m.kanitlar.length);
      if (!m.kanitlar.length) kanitsiz++;
      for (const a of [...ham.kanit_adaylari, ...ham.genel_adaylar]) durumlar.set(`${d.akim}|${i}|${a.id}`, a.durum);
    });
  }
  assert.ok(yanlisVar, 'veride doğrulanmamış aday kalmadıysa bu test bir şey sınamıyor');
  // referans/ders_eksikler.md: doğrulanmış eser kanıtı olmayan 35 madde yalnız metinle anlatılır
  assert.deepEqual([kanitsiz, madde], [35, 115]);
  // sınır kaldırılınca da doğrulanmamış aday çıkmaz
  for (const d of KAYNAK.dersler)
    d.ogren.forEach((ham, i) => {
      const m = ogrenPlani(d, { kanit: 99, aciklama: 99 })[i];
      for (const x of [...m.kanitlar, ...m.aciklamalar]) assert.equal(durumlar.get(`${d.akim}|${i}|${x.id}`), 'dogrulandi');
    });
  // uydurma veriyle: yalnız 'dogrulandi' geçer
  const sahte = { ogren: [{ no: 0, madde: 'm', kanit_adaylari: ['dogrulandi', 'yanlis', 'belirsiz', 'bakilmadi', undefined].map((durum, i) => ({ id: `k${i}`, sanatci: 's', eser: `e${i}`, cumle: 'c', durum })), genel_adaylar: [{ id: 'g0', cumle: 'c', durum: 'yanlis' }, { id: 'g1', cumle: 'c', durum: 'dogrulandi' }] }] };
  const [m] = ogrenPlani(sahte);
  assert.deepEqual([m.kanitlar.map((k) => k.id), m.aciklamalar.map((a) => a.id)], [['k0'], ['g1']]);
});

test('Ayırt et planı: görünür komşular, açık olanlar önce; iki akımın birinci eserleri ve madde listeleri', () => {
  const erken = dersBul(KAYNAK, 'Erken Rönesans');
  const maddeler = (ad) => dersBul(KAYNAK, ad).ogren.map((m) => m.madde);
  const hepsi = ayirtPlani(erken, { maddeler });
  assert.deepEqual(hepsi.map((x) => x.komsu), erken.ayirt.map((c) => c.komsu));
  for (const [i, x] of hepsi.entries()) {
    assert.deepEqual(x.kendi[0], erken.ayirt[i].eserler.kendi[0]);
    assert.deepEqual(x.karsi[0], erken.ayirt[i].eserler.komsu[0]);
    assert.deepEqual(x.maddeler.kendi, maddeler('Erken Rönesans'));
    assert.deepEqual(x.maddeler.komsu, maddeler(x.komsu));
    // cümleler yalnız kaynaktaki karşılaştırma cümleleri (yeni cümle yazılmaz)
    assert.deepEqual(x.cumleler.map((c) => c.cumle), erken.ayirt[i].karsilastirma_cumleleri.map((c) => c.cumle));
  }
  const sirali = ayirtPlani(erken, { acik: new Set(['Venedik Rönesansı']), maddeler });
  assert.equal(sirali[0].komsu, 'Venedik Rönesansı');
  assert.deepEqual(sirali.map((x) => x.acik), [true, false, false]);
  assert.deepEqual(ayirtPlani(erken, { gorunur: new Set(['Gotik']), maddeler }).map((x) => x.komsu), ['Gotik']);
  // karşılaştırma cümlesi olmayan ikili cümlesiz çıkar
  const cumlesiz = KAYNAK.dersler.flatMap((d) => ayirtPlani(d, { maddeler })).filter((x) => !x.cumleler.length);
  assert.equal(cumlesiz.length, 27);
});

test('eser eşleştirme: QID, başyapıt anahtarı ya da başlıkla; görseli olmayan eser sayılmaz', () => {
  const g = [{ k: 'commons', d: 'x.jpg' }];
  const l = [
    { baslik: 'A', qid: 'Q1', gorseller: g },
    { baslik: 'B', qid: null, gorseller: g, ad: 'Be' },
    { baslik: 'C', qid: 'Q3', gorseller: [] },
  ];
  assert.equal(eserEslestir(l, 's', { qid: 'Q1', eser: 'başka ad' }).baslik, 'A');
  assert.equal(eserEslestir(l, 's', { anahtar: 'Q1' }).baslik, 'A');
  assert.equal(eserEslestir(l, 's', { anahtar: 's|B' }).baslik, 'B');
  assert.equal(eserEslestir(l, 's', { baslik: 'B' }).baslik, 'B');
  assert.equal(eserEslestir(l, 's', { eser: 'Be' }).baslik, 'B');
  assert.equal(eserEslestir(l, 's', { qid: 'Q3', baslik: 'C' }), null);
  assert.equal(eserEslestir(l, 's', { qid: 'Q9', baslik: 'Yok' }), null);
  assert.equal(eserEslestir(null, 's', { qid: 'Q1' }), null);
  // doğrulanmış her kanıt ve her Ayırt et birinci eseri önbellekteki eser listesinde bulunur
  const onbellek = oku('eserler_onbellek.json').sanatcilar;
  const adlar = oku('eser_adlari_tr.json').adlar || {};
  const liste = (sid) => ((onbellek[sid] || {}).eserler || []).map((e) => ({ ...e, ad: (e.qid && adlar[e.qid]) || adlar[`${sid}|${e.baslik}`] }));
  for (const d of KAYNAK.dersler) {
    for (const m of ogrenPlani(d, { kanit: 99 })) for (const k of m.kanitlar) assert.ok(eserEslestir(liste(k.sanatci), k.sanatci, k), `${d.akim}: ${k.eser}`);
    for (const c of d.ayirt) for (const e of [c.eserler.kendi[0], c.eserler.komsu[0]]) assert.ok(eserEslestir(liste(e.sanatci), e.sanatci, e), `${d.akim} ↔ ${c.komsu}: ${e.baslik}`);
  }
});

test('Sına soru sayısı, adım oranı, kalınan yer ve dersin hâli', () => {
  assert.deepEqual([0, 1, 2, 5, 9, 13].map(sinaSoruSayisi), [0, 4, 6, 6, 9, 12]);
  assert.deepEqual([adimOrani(0, 7), adimOrani(3, 6), adimOrani(9, 6), adimOrani(1, 0)], [0, 0.5, 1, 0]);
  // yarım kalan adım sıradaki öğeden; biten adım baştan açılır
  assert.deepEqual([kalinanYer(0, 7), kalinanYer(3 / 7, 7), kalinanYer(0.429, 7), kalinanYer(6 / 7, 7), kalinanYer(1, 7), kalinanYer(0.5, 0)], [0, 3, 3, 6, 0, 0]);
  const il = {};
  assert.equal(dersHali(dersDurumu(dersKaydi(il, 'Gotik'))), 'sirada');
  adimIsle(il, 'Gotik', 'gor', 0.3, '2026-11-13');
  assert.equal(dersHali(dersDurumu(dersKaydi(il, 'Gotik'))), 'suruyor');
  for (const a of DERS_ADIMLARI) adimIsle(il, 'Gotik', a, 1, '2026-11-13');
  assert.equal(dersHali(dersDurumu(dersKaydi(il, 'Gotik'))), 'bitti');
});
