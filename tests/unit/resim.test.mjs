import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { kursEseriResimMi, kursResimleri, resimSanatcisiMi, gorunurSanatcilar, gorunurAkimlar } from '../../js/resim.js';
import { RESIM_KOKLERI, RESIM_DISI_KOKLER, eserSorgusu } from '../../js/wikidata.js';
import { dosyaNormal } from '../../js/yardimci.js';
import { sanatcilar, akimlar } from './yardimci.mjs';

const oku = (yol) => JSON.parse(readFileSync(new URL(`../../${yol}`, import.meta.url), 'utf8'));
const turler = oku('data/eser_turleri.json');
const onbellek = oku('data/eserler_onbellek.json');

test('her kurs eseri için tabloda bir karar var', () => {
  for (const s of sanatcilar)
    for (const e of s.kurs_eserleri || []) {
      const k = turler.kurs[dosyaNormal(e.commons_dosya).toLowerCase()];
      assert.ok(k, `${s.id}: ${e.baslik}`);
      assert.ok(['resim', 'degil'].includes(k.karar));
      assert.ok(k.neden);
    }
});

test('kurs eseri kararı: heykel/mimari elenir, resim kalır', () => {
  const ara = (id, b) => sanatcilar.find((s) => s.id === id).kurs_eserleri.find((e) => e.baslik.startsWith(b));
  assert.equal(kursEseriResimMi(ara('michelangelo', 'David'), turler), false);
  assert.equal(kursEseriResimMi(ara('michelangelo', 'The Creation of Adam'), turler), true);
  assert.equal(kursEseriResimMi(ara('leonardo-da-vinci', 'Vitruvian'), turler), true, 'desen');
  assert.equal(kursEseriResimMi(ara('albrecht-durer', 'Knight'), turler), true, 'gravür');
  assert.equal(kursEseriResimMi(ara('donatello', 'Feast of Herod'), turler), false, 'rölyef');
  // tabloda olmayan eser varsayılan olarak gösterilir
  assert.equal(kursEseriResimMi({ commons_dosya: 'Yeni_dosya.jpg' }, turler), true);
});

test('hiç resmi olmayan ya da ana uğraşı heykel/mimari olan sanatçılar gizlenir', () => {
  const gor = new Set(gorunurSanatcilar(sanatcilar, turler, onbellek).map((s) => s.id));
  for (const id of ['gian-lorenzo-bernini', 'filippo-brunelleschi', 'andrea-palladio', 'antonio-canova', 'auguste-rodin', 'donatello', 'phidias'])
    assert.equal(gor.has(id), false, id);
  for (const id of ['giotto-di-bondone', 'michelangelo', 'leonardo-da-vinci', 'donato-bramante', 'claude-monet']) assert.equal(gor.has(id), true, id);
});

test('görünür her sanatçının en az bir resmi var', () => {
  for (const s of gorunurSanatcilar(sanatcilar, turler, onbellek)) {
    const k = onbellek.sanatcilar[s.id];
    if (!k) continue; // önbellekte henüz yok: eserleri canlı Wikidata'dan gelir (aşağıdaki test)
    const n = kursResimleri(s, turler).length + k.eserler.length;
    assert.ok(n > 0, s.id);
  }
});

test('resim sanatçısı kalmayan akımlar gizlenir', () => {
  const gor = gorunurAkimlar(akimlar, gorunurSanatcilar(sanatcilar, turler, onbellek)).map((a) => a.ad);
  assert.ok(!gor.includes('Antik Yunan ve Roma'));
  assert.ok(!gor.includes('Romanesk'));
  assert.ok(gor.includes('Proto-Rönesans'));
  assert.deepEqual(
    gor,
    akimlar.filter((a) => gor.includes(a.ad)).map((a) => a.ad),
    'sıra korunur',
  );
});

test('önbellek yokken: kurs eseri olmayan sanatçı bilinmediği için gösterilir', () => {
  assert.equal(resimSanatcisiMi({ id: 'x', kurs_eserleri: [] }, turler, null), true);
  assert.equal(resimSanatcisiMi({ id: 'x', kurs_eserleri: [{ commons_dosya: "Michelangelo's_David_2015.jpg" }] }, turler, null), false);
});

test('Wikidata sorgusu resim süzgecini içerir, mimar (P84) kullanmaz', () => {
  const q = eserSorgusu('Q5592');
  for (const k of [...RESIM_KOKLERI, ...RESIM_DISI_KOKLER]) assert.ok(q.includes('wd:' + k), k);
  assert.ok(!q.includes('P84'));
  assert.ok(onbellek.surum >= 2);
});

test('önbellekten sonra eklenen sanatçı: kaydı yoksa gösterilir, boş kaydı varsa gizlenir', () => {
  const ob = { sanatcilar: { bos: { qid: 'Q1', eserler: [] } } };
  assert.equal(resimSanatcisiMi({ id: 'yeni', kurs_eserleri: [] }, turler, ob), true);
  assert.equal(resimSanatcisiMi({ id: 'bos', kurs_eserleri: [] }, turler, ob), false);
});
