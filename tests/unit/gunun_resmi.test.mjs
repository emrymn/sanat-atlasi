// İş 157: elle seçilen günün resmi (js/gorsel.js)
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gununResimleriniAyarla, gununResmiSecimi, gununResmiKoy, cihazdakiGununResimleri, seciliGununResmi, GUNUN_RESMI_ANAHTAR } from '../../js/gorsel.js';

const depo = new Map();
globalThis.localStorage = { getItem: (k) => (depo.has(k) ? depo.get(k) : null), setItem: (k, v) => depo.set(k, String(v)), removeItem: (k) => depo.delete(k) };
const eser = (sid, anahtar, gorsel = true) => ({ sid, anahtar, gorseller: gorsel ? [{ f: 'x.jpg' }] : [] });

beforeEach(() => {
  depo.clear();
  gununResimleriniAyarla(null);
});

test('seçim yokken null; dosyadaki seçim okunur', () => {
  assert.equal(gununResmiSecimi('a'), null);
  gununResimleriniAyarla({ surum: 1, secim: { a: 'q:Q1', b: 5 } });
  assert.equal(gununResmiSecimi('a'), 'q:Q1');
  assert.equal(gununResmiSecimi('b'), null); // bozuk değer atlanır
});

test('cihazdaki seçim dosyadakinin önüne geçer; silinince dosyadakine dönülür', () => {
  gununResimleriniAyarla({ secim: { a: 'q:Q1' } });
  assert.equal(gununResmiKoy('a', 'q:Q2'), true);
  assert.equal(gununResmiSecimi('a'), 'q:Q2');
  assert.deepEqual(JSON.parse(depo.get(GUNUN_RESMI_ANAHTAR)), { a: 'q:Q2' });
  gununResmiKoy('a', null);
  assert.deepEqual(cihazdakiGununResimleri(), {});
  assert.equal(gununResmiSecimi('a'), 'q:Q1');
});

test('bozuk localStorage kaydı boş sayılır; yazılamazsa false', () => {
  depo.set(GUNUN_RESMI_ANAHTAR, '{bozuk');
  assert.deepEqual(cihazdakiGununResimleri(), {});
  const eski = globalThis.localStorage.setItem;
  globalThis.localStorage.setItem = () => {
    throw new Error('dolu');
  };
  assert.equal(gununResmiKoy('a', 'q:Q1'), false);
  globalThis.localStorage.setItem = eski;
});

test('seciliGununResmi: seçilen eser listede ve görseli varsa döner; yoksa null', () => {
  const l = [eser('a', 'q:Q1'), eser('a', 'q:Q2'), eser('a', 'q:Q3', false)];
  assert.equal(seciliGununResmi(l), null);
  gununResmiKoy('a', 'q:Q2');
  assert.equal(seciliGununResmi(l), l[1]);
  gununResmiKoy('a', 'q:Q3'); // görseli yok
  assert.equal(seciliGununResmi(l), null);
  gununResmiKoy('a', 'q:YOK'); // veriden kalkmış eser
  assert.equal(seciliGununResmi(l), null);
  assert.equal(seciliGununResmi([]), null);
});

test('data/gunun_resimleri.json geçerli biçimde', () => {
  const j = JSON.parse(readFileSync(new URL('../../data/gunun_resimleri.json', import.meta.url), 'utf8'));
  assert.equal(j.surum, 1);
  assert.equal(typeof j.secim, 'object');
  const sanatcilar = new Set(JSON.parse(readFileSync(new URL('../../data/sanatcilar.json', import.meta.url), 'utf8')).map((s) => s.id));
  for (const [id, a] of Object.entries(j.secim)) {
    assert.ok(sanatcilar.has(id), `bilinmeyen sanatçı: ${id}`);
    assert.match(a, /^[qc]:./);
  }
});
