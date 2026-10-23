// Hata denetimi #10 (İş 22): geçici hatalar kalıcı olmasın; bayat önbellek dosyasında arka plan yenilemesi sıralı ve sınırlı.
import { test } from 'node:test';
import assert from 'node:assert/strict';

let dosyaKipi = 'hata';
let onbellek = null;
let wikidataIstek = 0;
let ayni = 0;
let enCokAyni = 0;
globalThis.fetch = async (url) => {
  const u = String(url);
  if (u.includes('eserler_onbellek.json')) {
    if (dosyaKipi === 'hata') throw new TypeError('ağ yok');
    return { ok: true, status: 200, json: async () => onbellek };
  }
  // Wikidata (wbsearchentities, SPARQL)
  wikidataIstek++;
  ayni++;
  enCokAyni = Math.max(enCokAyni, ayni);
  await new Promise((r) => setTimeout(r, 20));
  ayni--;
  throw new TypeError('429 / ağ yok');
};

const E = await import('../../js/eserler.js');

const sanatci = (id, ek = {}) => ({ id, ad: id, ad_arama: id, dogum: 1600, kurs_eserleri: [], ...ek });

test('önbellek dosyası ağ hatasında kalıcı olarak null kalmaz; sonraki çağrı yeniden dener', async () => {
  assert.equal(await E.hazirOnbellek(), null);
  onbellek = { surum: E.ONBELLEK_SURUMU, olusturma: new Date().toISOString(), sanatcilar: {} };
  dosyaKipi = 'tamam';
  const j = await E.hazirOnbellek();
  assert.ok(j && j.sanatcilar);
});

test('Wikidata’ya ulaşılamayınca liste belleğe yazılmaz: 60 sn içinde aynı sonuç, sonra yeniden denenir', async () => {
  const s = sanatci('yok-sanatci');
  const once = wikidataIstek;
  const l1 = await E.sanatciEserleri(s);
  assert.ok(Array.isArray(l1));
  const birinci = wikidataIstek - once;
  assert.ok(birinci >= 1, 'Wikidata denendi');
  await E.sanatciEserleri(s);
  assert.equal(wikidataIstek - once, birinci, '60 sn içinde yeniden istenmez');
  const gercek = Date.now;
  Date.now = () => gercek() + E.GECICI_SURE + 1000;
  try {
    await E.sanatciEserleri(s);
  } finally {
    Date.now = gercek;
  }
  assert.ok(wikidataIstek - once > birinci, 'süre dolunca yeniden denenir');
});

test('bayat önbellek dosyası: arka plan yenilemeleri aynı anda değil sırayla, oturum başına sınırlı', async () => {
  const sanatcilar = {};
  for (let i = 0; i < 40; i++)
    sanatcilar[`s${i}`] = {
      qid: `Q${i}`,
      eserler: [{ baslik: `Eser ${i}`, qid: `QE${i}`, kaynaklar: ['wikidata'], gorseller: [{ k: 'commons', d: `e${i}.jpg` }] }],
    };
  // ilk testte belleğe alınan dosya nesnesi 40 gün eski hâle getirilir; bellek temizlenir
  Object.assign(onbellek, { olusturma: new Date(Date.now() - 40 * 86400000).toISOString(), sanatcilar });
  E.eserTurleriniAyarla(null);
  enCokAyni = 0;
  const once = wikidataIstek;
  const listeler = await Promise.all(Object.keys(sanatcilar).map((id) => E.sanatciEserleri(sanatci(id))));
  assert.equal(listeler.length, 40);
  assert.ok(
    listeler.every((l) => l.length === 1),
    'önbellekteki eserler hemen döner',
  );
  await new Promise((r) => setTimeout(r, 200));
  assert.ok(enCokAyni <= 1, `aynı anda en çok bir Wikidata isteği (görülen ${enCokAyni})`);
  assert.ok(wikidataIstek - once <= 1, 'ilk 200 ms’de en çok bir istek');
  assert.ok(E.arkaPlanDurumu().istenen <= E.ARKA_PLAN_SINIRI);
});
