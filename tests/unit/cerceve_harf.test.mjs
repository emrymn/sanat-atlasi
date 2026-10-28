import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { AKIM_CERCEVELERI, cerceveTipi } from '../../js/cerceve.js';
import { AKIM_HARFLERI, BOLGE_HARFLERI, fontAdresi } from '../../js/harfler.js';
import { BOLGELER } from '../../js/harita.js';

const akimlar = JSON.parse(readFileSync(new URL('../../data/akimlar.json', import.meta.url), 'utf8')).map((a) => a.ad);

test('çerçeve: her akımın bir çerçevesi var, bilinmeyen akım eski altın çerçeve', () => {
  for (const a of akimlar) assert.ok(AKIM_CERCEVELERI[a], a);
  assert.equal(cerceveTipi('Gotik'), 'kemer');
  assert.equal(cerceveTipi('Hollanda Altın Çağı'), 'abanoz');
  assert.equal(cerceveTipi(undefined), 'altin');
});

test('harf: her akımın ve haritanın her döneminin bir harfi var', () => {
  for (const a of akimlar) assert.ok(AKIM_HARFLERI[a], a);
  for (const b of BOLGELER) assert.ok(BOLGE_HARFLERI[b.id], b.id);
});

test('harf: yazı tipi adresi yalnız başlığın harflerini ister, italik ve kalınlık eksenleri doğru', () => {
  const u = new URL(fontAdresi({ aile: 'EB Garamond', italik: true }, 'Venedik Rönesansı'));
  assert.equal(u.searchParams.get('family'), 'EB Garamond:ital,wght@1,400');
  const harfler = u.searchParams.get('text');
  for (const h of 'VeneikRösaı') assert.ok(harfler.includes(h), h);
  assert.equal(new Set(harfler).size, harfler.length);
  assert.equal(new URL(fontAdresi({ aile: 'Syne', kalinlik: 700 })).searchParams.get('family'), 'Syne:wght@700');
  assert.equal(new URL(fontAdresi({ aile: 'Cinzel' })).searchParams.get('family'), 'Cinzel');
});
