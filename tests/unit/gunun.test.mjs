import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gununSanatcisi, baskaSanatci, TEKRAR_YOK_GUN } from '../../js/gunun.js';
import { gunEkle } from '../../js/leitner.js';
import { rastgeleYap } from '../../js/yardimci.js';

const havuz = Array.from({ length: 140 }, (_, i) => 's' + String(i).padStart(3, '0'));

test('aynı gün hep aynı sanatçı; havuz sırası önemsiz', () => {
  const a = gununSanatcisi(havuz, '2026-10-20');
  assert.equal(gununSanatcisi(havuz, '2026-10-20'), a);
  assert.equal(gununSanatcisi([...havuz].reverse(), '2026-10-20'), a);
  assert.ok(havuz.includes(a));
});

test('son 30 günde seçilen tekrar seçilmez', () => {
  const secimler = [];
  let gun = '2026-06-01';
  for (let i = 0; i < 120; i++) {
    secimler.push(gununSanatcisi(havuz, gun));
    gun = gunEkle(gun, 1);
  }
  for (let i = 0; i < secimler.length; i++) {
    const onceki = secimler.slice(Math.max(0, i - TEKRAR_YOK_GUN), i);
    assert.ok(!onceki.includes(secimler[i]), `gün ${i}: ${secimler[i]}`);
  }
  assert.ok(new Set(secimler).size > 60, 'çeşitlilik');
});

test('küçük havuzda da çalışır', () => {
  assert.equal(gununSanatcisi(['tek'], '2026-10-20'), 'tek');
  const iki = [gununSanatcisi(['a', 'b'], '2026-10-20'), gununSanatcisi(['a', 'b'], '2026-10-21')];
  assert.notEqual(iki[0], iki[1]);
  assert.equal(gununSanatcisi([], '2026-10-20'), null);
});

test('başka bir sanatçı bugünküyle aynı olmaz', () => {
  const r = rastgeleYap(3);
  for (let i = 0; i < 50; i++) assert.notEqual(baskaSanatci(havuz, 's010', r), 's010');
});
