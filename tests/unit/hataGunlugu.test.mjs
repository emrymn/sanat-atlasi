// İş 115: yerel hata günlüğü
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hataEkle, hatalariOku, hatalariTemizle, gunlukMetni, EN_COK } from '../../js/hataGunlugu.js';

const depo = () => {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
};

test('hata günlüğü: ekler, art arda aynı hatayı sayar, son 30 kalır, temizlenir', () => {
  const d = depo();
  hataEkle({ m: 'x is undefined', k: 'harita.js:10:2' }, d);
  hataEkle({ m: 'x is undefined', k: 'harita.js:10:2' }, d);
  let l = hatalariOku(d);
  assert.equal(l.length, 1);
  assert.equal(l[0].n, 2);
  for (let i = 0; i < 40; i++) hataEkle({ m: `h${i}`, k: '' }, d);
  l = hatalariOku(d);
  assert.equal(l.length, EN_COK);
  assert.equal(l[l.length - 1].m, 'h39');
  assert.match(gunlukMetni(l, { userAgent: 'iPhone' }), /Sanat Atlası .* · iPhone\n/);
  hatalariTemizle(d);
  assert.deepEqual(hatalariOku(d), []);
});

test('hata günlüğü: bozuk ya da kapalı depo uygulamayı düşürmez', () => {
  const bozuk = { getItem: () => '{bozuk', setItem: () => { throw new Error('dolu'); }, removeItem: () => {} };
  assert.deepEqual(hatalariOku(bozuk), []);
  assert.doesNotThrow(() => hataEkle({ m: 'a' }, bozuk));
});
