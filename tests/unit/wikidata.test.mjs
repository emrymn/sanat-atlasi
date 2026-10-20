import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { adayUygunMu, yilAyikla, sparqlSonucunuCevir, eserSorgusu, qidCoz, dosyaAdiAyikla } from '../../js/wikidata.js';

const fx = (ad) => JSON.parse(readFileSync(new URL(`../fixtures/${ad}`, import.meta.url), 'utf8'));
const ent = fx('wbgetentities.json').entities;

test('yıl ayıklama MÖ dahil', () => {
  assert.equal(yilAyikla('+1267-00-00T00:00:00Z'), 1267);
  assert.equal(yilAyikla('-0479-01-01T00:00:00Z'), -479);
  assert.equal(yilAyikla('1305-01-01T00:00:00Z'), 1305);
  assert.equal(yilAyikla(null), null);
});

test('aday doğrulama: insan + doğum yılı ±3', () => {
  assert.equal(adayUygunMu(ent.Q1, { dogum: 1267 }), true);
  assert.equal(adayUygunMu(ent.Q1, { dogum: 1270 }), true);
  assert.equal(adayUygunMu(ent.Q1, { dogum: 1271 }), false);
  assert.equal(adayUygunMu(ent.Q2, { dogum: null }), false, 'insan değil');
  assert.equal(adayUygunMu(ent.Q4, { dogum: 1267 }), false, 'adaş ama yanlış yüzyıl');
  assert.equal(adayUygunMu(ent.Q5x, { dogum: null }), false, 'geçersiz sıradaki iddia sayılmaz');
  assert.equal(adayUygunMu(ent.Q6, { dogum: null }), true, 'kardeş grubu (Limbourg)');
  assert.equal(adayUygunMu(undefined, { dogum: null }), false);
});

test('“yaklaşık” nitelendirmeli doğum tarihinde tolerans ±10', () => {
  assert.equal(adayUygunMu(ent.Q3, { dogum: -480 }), true);
  // MÖ doğumlu sanatçılarda tolerans en az ±15
  assert.equal(adayUygunMu(ent.Q3, { dogum: -475 }), true);
  assert.equal(adayUygunMu(ent.Q3, { dogum: -474 }), false);
});

test('antik sanatçılar (MÖ doğum) için ±15, MS için ±3 kalır', () => {
  const kisi = (time) => ({
    claims: {
      P31: [{ rank: 'normal', mainsnak: { snaktype: 'value', datavalue: { value: { id: 'Q5' } } } }],
      P569: [{ rank: 'normal', mainsnak: { snaktype: 'value', datavalue: { value: { time, precision: 9 } } } }],
    },
  });
  // Phidias: Wikidata MÖ 490 (yıl hassasiyeti), veride MÖ 480
  assert.equal(adayUygunMu(kisi('-0490-01-01T00:00:00Z'), { dogum: -480 }), true);
  assert.equal(adayUygunMu(kisi('-0496-01-01T00:00:00Z'), { dogum: -480 }), false);
  assert.equal(adayUygunMu(kisi('+1528-01-01T00:00:00Z'), { dogum: 1518 }), false);
  assert.equal(adayUygunMu(kisi('+1520-01-01T00:00:00Z'), { dogum: 1518 }), true);
});

test('qidCoz: doğrulanamayan aday tahmin edilmez', async () => {
  const sahte = (yanitlar) => async (url) => {
    if (url.includes('wbsearchentities')) return { search: yanitlar.map((id) => ({ id })) };
    if (url.includes('wbgetentities')) return { entities: ent };
    throw new Error('beklenmeyen');
  };
  assert.equal(await qidCoz({ ad_arama: 'Giotto', dogum: 1267 }, sahte(['Q2', 'Q4', 'Q1'])), 'Q1');
  assert.equal(await qidCoz({ ad_arama: 'Giotto', dogum: 1500 }, sahte(['Q2', 'Q4', 'Q1'])), null);
  assert.equal(await qidCoz({ ad_arama: 'Kimse', dogum: 1500 }, sahte([])), null);
});

test('SPARQL sonucu: etiket tr→en→mul, etiketsiz eser atılır, dosya adı çözülür', () => {
  const e = sparqlSonucunuCevir(fx('sparql.json'));
  assert.equal(e.length, 3);
  assert.deepEqual(e[0], { qid: 'Q100', baslik: 'Ağıt', yil: 1305, dosya: 'Giotto_-_Scrovegni_-_-36-_-_Lamentation.jpg', sl: 40 });
  assert.equal(e[1].baslik, 'Ognissanti Madonna');
  assert.equal(e[1].yil, null);
  assert.equal(e[2].yil, -450);
  assert.equal(e[2].baslik, 'Antik eser');
});

test('eser sorgusu P170 ve resim süzgecini kullanır, QID doğrular', () => {
  const q = eserSorgusu('Q7814');
  assert.match(q, /wdt:P170 wd:Q7814/);
  assert.doesNotMatch(q, /P84/);
  assert.match(q, /wdt:P279\*/);
  assert.match(q, /wdt:P18/);
  assert.match(q, /LIMIT 40/);
  assert.throws(() => eserSorgusu('Q1} ?x ?y {'));
  assert.equal(dosyaAdiAyikla('Ay%C5%9Fe.jpg'), 'Ayşe.jpg');
});
