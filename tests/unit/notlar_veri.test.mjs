import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { notlariAl } from '../../js/karsilastir.js';

const oku = (f) => JSON.parse(readFileSync(new URL(`../../data/${f}`, import.meta.url), 'utf8'));
const sanatcilar = oku('sanatcilar.json');
const idler = new Set(sanatcilar.map((s) => s.id));

test('tanima_notlari: her anahtar var olan bir sanatçı, kendi taninma alanı olmayan', () => {
  const ham = oku('tanima_notlari.json');
  const n = notlariAl(ham);
  assert.equal(Object.keys(n).length, Object.keys(ham.notlar).length);
  for (const id of Object.keys(n)) {
    assert.ok(idler.has(id), id);
    assert.ok(!sanatcilar.find((s) => s.id === id).taninma, `${id} zaten taninma alanına sahip`);
  }
});

test('eser_notlari: anahtar QID ya da "sanatçıId|başlık", metinler boş değil', () => {
  const ham = oku('eser_notlari.json');
  const n = notlariAl(ham);
  assert.ok(Object.keys(n).length > 400);
  for (const [k, v] of Object.entries(n)) {
    if (/^Q\d+$/.test(k)) continue;
    const [sid, baslik] = k.split('|');
    assert.ok(idler.has(sid) && baslik, k);
    assert.ok(v.length >= 20, k);
  }
});
