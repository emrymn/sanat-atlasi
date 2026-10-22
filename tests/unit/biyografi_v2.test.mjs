// Rapor V2/V3: eksik biyografiler ve akım metni denetimi (KARARLAR "İş 20")
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const oku = (yol) => JSON.parse(readFileSync(new URL(`../../data/${yol}`, import.meta.url), 'utf8'));
const EKSIKLER = ['guido-reni', 'guercino', 'bartolomeo-manfredi', 'hendrick-ter-brugghen', 'gerrit-van-honthorst', 'dirck-van-baburen', 'valentin-de-boulogne', 'jusepe-de-ribera', 'salvator-rosa', 'mattia-preti', 'luca-giordano', 'giovanni-battista-gaulli', 'andrea-pozzo', 'francesco-solimena', 'giuseppe-maria-crespi', 'sebastiano-ricci', 'giovanni-battista-piazzetta', 'alessandro-magnasco', 'francis-bacon'];

test('V2: raporda eksik olan 19 sanatçının biyografisi var', () => {
  const b = oku('biyografiler.json').sanatcilar;
  const idler = new Set(oku('sanatcilar.json').map((s) => s.id));
  for (const id of EKSIKLER) {
    assert.ok(idler.has(id), `${id} sanatçı listesinde`);
    const x = b[id];
    assert.ok(x, `${id} biyografisi`);
    assert.equal(x.dil, 'claude');
    assert.match(x.kaynak.url, /^https:\/\/en\.wikipedia\.org\/wiki\//);
    const n = x.metin.split(/\s+/).length;
    assert.ok(n >= 50 && n <= 130, `${id}: ${n} kelime`);
  }
});

test('V3: akım metinlerinin hepsi denetlendi; Gotik metninde Proto-Rönesans tek geçişle bağlanır', () => {
  const a = oku('akim_bilgi.json').akimlar;
  for (const [ad, x] of Object.entries(a)) assert.doesNotMatch(x.kaynak || '', /henüz denetlenmedi/, ad);
  assert.doesNotMatch(a.Gotik.metin, /başlatacaktır\. Proto-Rönesans,/);
});
