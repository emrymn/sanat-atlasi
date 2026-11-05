// İş 137: görselin odak noktası (data/gorsel_odak.json) object-position olarak verilir
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { yerelGorselleriAyarla, odaklariAyarla, gorselOdagi } from '../../js/gorsel.js';

test('odak: yüzü bulunan görselde "x% y%", bulunmayanda ve bozuk kayıtta boş', () => {
  yerelGorselleriAyarla({ 'commons:a.jpg': 'aaaaaaaaaaaaaaaa', 'commons:b.jpg': 'bbbbbbbbbbbbbbbb', 'commons:c.jpg': 'cccccccccccccccc' });
  assert.equal(gorselOdagi({ k: 'commons', d: 'a.jpg' }), ''); // veri yüklenmeden
  odaklariAyarla({ surum: 1, odak: { aaaaaaaaaaaaaaaa: [42, 18], cccccccccccccccc: [140, 'x'] } });
  assert.equal(gorselOdagi({ k: 'commons', d: 'a.jpg' }), '42% 18%');
  assert.equal(gorselOdagi({ k: 'commons', d: 'b.jpg' }), '');
  assert.equal(gorselOdagi({ k: 'commons', d: 'c.jpg' }), '');
  assert.equal(gorselOdagi(null), '');
  odaklariAyarla(null);
  yerelGorselleriAyarla(null);
});

test('data/gorsel_odak.json: her kayıt 0–100 arası iki tam sayı, adlar yerel görsellerde var', () => {
  const v = JSON.parse(readFileSync(new URL('../../data/gorsel_odak.json', import.meta.url), 'utf8'));
  const yerel = new Set(Object.values(JSON.parse(readFileSync(new URL('../../data/yerel_gorseller.json', import.meta.url), 'utf8')).gorseller));
  const l = Object.entries(v.odak);
  assert.ok(l.length > 1000);
  for (const [ad, o] of l) {
    assert.ok(yerel.has(ad), ad);
    assert.ok(Array.isArray(o) && o.length === 2 && o.every((n) => Number.isInteger(n) && n >= 0 && n <= 100), ad);
  }
});
