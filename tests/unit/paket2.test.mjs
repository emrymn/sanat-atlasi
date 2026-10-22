import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { yedekHatirlatmasi, ilerlemeDogrula, YEDEK_ARALIGI } from '../../js/depo.js';
import { konular } from './yardimci.mjs';

const tr = JSON.parse(readFileSync(new URL('../../data/konular_tr.json', import.meta.url), 'utf8'));

test('D6: her kurs konusunun ve bölümün kısa Türkçe başlığı var', () => {
  for (const k of konular) {
    const t = tr.konular[String(k.no)];
    assert.ok(t && t.trim(), `Konu ${k.no}`);
    assert.ok(t.length <= 60, `Konu ${k.no} kısa olmalı: ${t}`);
    assert.ok(!/PDF yok/.test(t));
    assert.ok(tr.bolumler[k.bolum], k.bolum);
  }
  assert.deepEqual(Object.keys(tr.konular).map(Number).sort((a, b) => a - b), konular.map((k) => k.no).sort((a, b) => a - b));
});

test('İ3: yedek hatırlatması 14 gün sonra; hiç yedek yoksa ilk kullanımdan sayılır', () => {
  const skorlar = { a: { sanatci: { kutu: 1, sonraki: null, dogru: 1, yanlis: 0, son: '2026-10-01' } } };
  assert.equal(YEDEK_ARALIGI, 14);
  assert.equal(yedekHatirlatmasi({ skorlar, sonYedek: '2026-10-09' }, '2026-10-22'), null);
  assert.deepEqual(yedekHatirlatmasi({ skorlar, sonYedek: '2026-10-08' }, '2026-10-22'), { gun: 14, metin: 'Son yedek 14 gün önce' });
  assert.deepEqual(yedekHatirlatmasi({ skorlar, sonYedek: null, olusturma: '2026-09-01T08:00:00.000Z' }, '2026-10-22'), { gun: 51, metin: 'Henüz yedek almadın' });
  assert.equal(yedekHatirlatmasi({ skorlar, sonYedek: null, olusturma: '2026-10-20T08:00:00.000Z' }, '2026-10-22'), null);
  // kaydedilecek ilerleme yoksa hatırlatma yok
  assert.equal(yedekHatirlatmasi({ skorlar: {}, sonYedek: '2020-01-01' }, '2026-10-22'), null);
});

test('İ3: son yedek günü yedeğe girer ve doğrulanır', () => {
  assert.equal(ilerlemeDogrula({ islenen: [1], sonYedek: '2026-10-01' }).sonYedek, '2026-10-01');
  assert.equal(ilerlemeDogrula({ islenen: [1], sonYedek: 'dün' }).sonYedek, null);
  assert.equal(ilerlemeDogrula({ islenen: [1] }).sonYedek, null);
});
