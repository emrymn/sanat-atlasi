// İş 174: Qwen denetimi doğrulamasından çıkan düzeltmeler — elle eser düzeltmeleri (data/eser_duzeltmeleri.json),
// ortak atıflı eserler (iki sanatçıda aynı QID), hata iletisi, yürüyüş yılı, Wikidata sorgu kök nedeni
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  onbellekEseri,
  cikarilanlariAyikla,
  kopyalariAyikla,
  duzeltmeleriAyarla,
  duzeltmeleriUygula,
  ortakAtiflariAyarla,
  ortakSanatcilar,
  yilSupheliMi,
} from '../../js/eserler.js';
import { sanatciCeldiricileri } from '../../js/celdirici.js';
import { tersSecenekleri } from '../../js/ters.js';
import { eserSorgusu } from '../../js/wikidata.js';
import { genisEserSorgusu } from '../../scripts/kaynaklar/wikidata.mjs';
import { rastgeleYap } from '../../js/yardimci.js';

const oku = (p) => JSON.parse(readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8'));
const onbellek = oku('data/eserler_onbellek.json');
const duz = oku('data/eser_duzeltmeleri.json');
const sanatcilar = oku('data/sanatcilar.json');
const S = Object.fromEntries(sanatcilar.map((s) => [s.id, s]));
duzeltmeleriAyarla(duz);

const liste = (sid) => duzeltmeleriUygula(sid, (onbellek.sanatcilar[sid].eserler || []).map(onbellekEseri));

test('düzeltme dosyası: geçerli yapı, bütün sanatçı ve QID anahtarları var olan kayıtlara işaret ediyor', () => {
  const qidler = new Set(Object.values(onbellek.sanatcilar).flatMap((v) => v.eserler.map((e) => e.qid).filter(Boolean)));
  for (const [sid, l] of Object.entries(duz.cikar)) {
    assert.ok(S[sid], `bilinmeyen sanatçı ${sid}`);
    for (const x of l) {
      assert.match(x.qid, /^Q\d+$/);
      assert.ok(x.neden && x.neden.length > 10, 'her çıkarmanın gerekçesi var');
      assert.ok(onbellek.sanatcilar[sid].eserler.some((e) => e.qid === x.qid), `${sid} listesinde ${x.qid} yok`);
    }
  }
  for (const [sid, kayitlar] of Object.entries(duz.gorsel_cikar))
    for (const [q, dosyalar] of Object.entries(kayitlar)) {
      const e = onbellek.sanatcilar[sid].eserler.find((x) => x.qid === q);
      assert.ok(e, `${sid} ${q} yok`);
      for (const d of dosyalar) assert.ok(e.gorseller.some((g) => g.d === d), `${q} kaydında ${d} yok`);
    }
  for (const q of [...Object.keys(duz.muze), ...Object.keys(duz.tarih)]) assert.ok(qidler.has(q), `önbellekte ${q} yok`);
  for (const t of Object.values(duz.tarih)) assert.ok(Number.isInteger(t.yil) && t.kaynak, 'tarih düzeltmesinin yılı ve kaynağı var');
});

test('sanatçıya ait olmadığı belli eserler o sanatçının listesinden çıkar', () => {
  assert.ok(!liste('cimabue').some((e) => e.qid === 'Q119086004'), 'Courtauld sahtesi');
  assert.ok(!liste('leonardo-da-vinci').some((e) => e.qid === 'Q3492887'), 'Uffizi Medusa');
  assert.ok(!liste('ambrogio-lorenzetti').some((e) => e.qid === 'Q17335819'), 'Bulgarini');
  assert.ok(!liste('giulio-romano').some((e) => e.qid === 'Q98207179'), 'Galle gravürü');
  // başka eserler yerinde
  assert.ok(liste('leonardo-da-vinci').length > 10);
});

test('başka esere ait görseller yalnız o kayıttan çıkar; görseli kalmayan kayıt düşer', () => {
  const trinity = liste('robert-campin').find((e) => e.qid === 'Q3998895');
  assert.deepEqual(trinity.gorseller.map((g) => g.d), ['Robert_campin,_trinity.jpg']);
  // aynı görsel kendi kaydında (Madonna and child) kalır
  assert.ok(liste('robert-campin').find((e) => e.qid === 'Q18508793').gorseller.some((g) => g.d === 'Madonna-and-child-1823.jpg'));
  const before = liste('william-hogarth').find((e) => e.qid === 'Q20183486');
  assert.ok(before.gorseller.length >= 2 && before.gorseller.every((g) => !/after/i.test(g.d)), 'Before kaydında After görseli yok');
  assert.ok(liste('william-hogarth').find((e) => e.qid === 'Q20184523'), 'After kaydı yerinde');
  for (const q of ['Q674682', 'Q2633337', 'Q2982846']) assert.ok(!liste('joan-miro').some((e) => e.qid === q), `Miró ${q}: ziyaretçi fotoğrafı`);
  // gösterilen hiçbir eserde QRpedia fotoğrafı kalmadı
  for (const v of Object.values(onbellek.sanatcilar)) for (const e of v.eserler) for (const g of e.gorseller) if (/qrpedia/i.test(g.d || '')) assert.ok(duz.gorsel_cikar['joan-miro'][e.qid]);
});

test('Führermuseum gösterilmiyor; bugünkü kurum ya da boş', () => {
  for (const [sid, v] of Object.entries(onbellek.sanatcilar))
    for (const e of duzeltmeleriUygula(sid, v.eserler.map(onbellekEseri))) assert.ok(!/Führermuseum|Collecting Point/.test(e.muze), `${sid}: ${e.baslik}`);
  assert.equal(liste('jean-honore-fragonard').find((e) => e.qid === 'Q974414').muze, 'Toledo Museum of Art');
  assert.equal(liste('alessandro-magnasco').find((e) => e.qid === 'Q111645952').muze, '');
});

test('müze kataloğundaki tarih Wikidata yılının yerine geçer ve yaşamla çelişmez', () => {
  const boucher = liste('francois-boucher').find((e) => e.qid === 'Q11092366');
  assert.equal(boucher.yil, 1739);
  assert.equal(boucher.tarih, '1739');
  const rogier = liste('rogier-van-der-weyden').find((e) => e.qid === 'Q286096');
  assert.equal(rogier.tarih, 'y. 1435–1440');
  for (const [sid, q] of [['francois-boucher', 'Q11092366'], ['rogier-van-der-weyden', 'Q286096'], ['hieronymus-bosch', 'Q1387483'], ['leonardo-da-vinci', 'Q993743'], ['jean-baptiste-simeon-chardin', 'Q20177902']])
    assert.equal(yilSupheliMi(liste(sid).find((e) => e.qid === q).yil, S[sid]), false, `${sid} ${q}`);
});

test('düzeltme kopya ayıklamasıyla birlikte çalışır (çıkarılanlar, kopyalar, düzeltmeler)', () => {
  const kopyalar = oku('data/kopya_eserler.json').sanatcilar;
  for (const [sid, v] of Object.entries(onbellek.sanatcilar)) {
    const l = kopyalariAyikla(sid, duzeltmeleriUygula(sid, cikarilanlariAyikla(v.eserler.map(onbellekEseri))), kopyalar);
    assert.ok(Array.isArray(l));
    for (const e of l) assert.ok(e.gorseller.length);
  }
});

test('ortak atıf: iki sanatçıda olan eser bulunur; çıkarılan atıf ortak sayılmaz', () => {
  ortakAtiflariAyarla(onbellek, new Map(sanatcilar.map((s) => [s.id, s.ad])));
  assert.deepEqual(ortakSanatcilar({ qid: 'Q500812' }, 'titian'), ['giorgione']);
  assert.deepEqual(ortakSanatcilar({ qid: 'Q500812' }, 'giorgione'), ['titian']);
  assert.deepEqual(ortakSanatcilar({ qid: 'Q15008032' }, 'giovanni-bellini'), ['titian']);
  assert.deepEqual(ortakSanatcilar({ qid: 'Q19890804' }, 'orazio-gentileschi'), ['artemisia-gentileschi']);
  assert.deepEqual(ortakSanatcilar({ qid: 'Q131675981' }, 'agnolo-bronzino'), ['jacopo-pontormo']);
  assert.deepEqual(ortakSanatcilar({ qid: 'Q3998895' }, 'robert-campin'), [], 'tek sanatçılı eser');
  assert.deepEqual(ortakSanatcilar({}, 'titian'), [], 'QID yok');
});

test('ortak atıflı eser sorulunca öteki sanatçı şık olmaz', () => {
  const sanat = sanatcilar.map((s) => ({ ...s }));
  const akimlar = oku('data/akimlar.json');
  const tiziano = sanat.find((s) => s.id === 'titian');
  for (let t = 1; t < 60; t++) {
    const c = sanatciCeldiricileri(tiziano, { sanatcilar: sanat, akimlar, rng: rastgeleYap(t), haric: ['giorgione'] });
    assert.equal(c.length, 3);
    assert.ok(!c.some((x) => x.id === 'giorgione'));
  }
  // haric verilmezse Giorgione (aynı akım) şıklarda çıkabiliyor: koruma gerçekten iş görüyor
  const goruldu = Array.from({ length: 60 }, (_, t) => sanatciCeldiricileri(tiziano, { sanatcilar: sanat, akimlar, rng: rastgeleYap(t + 1) })).some((c) => c.some((x) => x.id === 'giorgione'));
  assert.ok(goruldu);
});

test('ters soru: sorulan sanatçıya da atfedilen eser yanlış seçenek olamaz', () => {
  const e = (a, ek = {}) => ({ anahtar: a, baslik: a, gorseller: [{ k: 'commons', d: `${a}.jpg` }], ...ek });
  const venus = e('venus', { ortak: ['titian'] });
  for (let t = 1; t < 30; t++) {
    const s = tersSecenekleri({
      dogru: { id: 'titian', eser: e('urbino') },
      celdiriciler: [
        { id: 'giorgione', eserler: [venus, e('tempesta')] },
        { id: 'b', eserler: [e('b1')] },
        { id: 'c', eserler: [e('c1')] },
      ],
      rng: rastgeleYap(t),
    });
    assert.ok(s && !s.some((x) => x.eser.anahtar === 'venus'));
  }
});

test('Wikidata sorguları: yüzyıl hassasiyetli tarih ve eski koleksiyon (Führermuseum) alınmaz', () => {
  for (const q of [eserSorgusu('Q5592'), genisEserSorgusu('Q5592')]) {
    assert.match(q, /wikibase:timePrecision \?incP/);
    assert.match(q, /FILTER\(\?incP >= 9\)/);
    assert.match(q, /wikibase:BestRank/);
    assert.doesNotMatch(q, /wdt:P571/);
  }
  const g = genisEserSorgusu('Q5592');
  assert.match(g, /FILTER NOT EXISTS \{ \?kolSt pq:P582/);
  assert.match(g, /wd:Q475667/);
});
