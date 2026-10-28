import { test } from 'node:test';
import assert from 'node:assert/strict';
import { imzaDosyasi } from '../../js/imza.js';

const iddia = (v, rank = 'normal') => ({ rank, mainsnak: { snaktype: 'value', datavalue: { value: v } } });

test('imza: P109 yoksa null, varsa dosya adı; tercih edilen önce, kullanımdan kalkmış sayılmaz', () => {
  assert.equal(imzaDosyasi(undefined), null);
  assert.equal(imzaDosyasi({ claims: {} }), null);
  assert.equal(imzaDosyasi({ claims: { P109: [iddia('Giotto imza.svg')] } }), 'Giotto imza.svg');
  assert.equal(imzaDosyasi({ claims: { P109: [iddia('eski.png'), iddia('yeni.svg', 'preferred')] } }), 'yeni.svg');
  assert.equal(imzaDosyasi({ claims: { P109: [iddia('yanlis.png', 'deprecated')] } }), null);
  assert.equal(imzaDosyasi({ claims: { P109: [{ rank: 'normal', mainsnak: { snaktype: 'novalue' } }] } }), null);
});

import { seritlerden, yazmaZamanlari } from '../../js/imza.js';

test('kalem yolu: şeritte mürekkebin yüksekliği, boşlukta kalem aynı yükseklikte ilerler', () => {
  // 3 şerit × 4 satır: 1. şeritte mürekkep altta, 2. boş, 3. üstte
  const w = 3;
  const h = 4;
  const veri = new Uint8ClampedArray(w * h * 4);
  const koy = (x, y) => (veri[(y * w + x) * 4 + 3] = 255);
  koy(0, 3);
  koy(2, 0);
  const yol = seritlerden(veri, w, h);
  assert.equal(yol[0].y, 1);
  assert.equal(yol[1].y, 1);
  assert.equal(yol[1].m, 0);
  assert.equal(yol[2].y, 0);
});

test('kalem zamanı: mürekkepli şerit uzun, boş şerit kısa sürer; son an 1', () => {
  const z = yazmaZamanlari([{ m: 1 }, { m: 0 }, { m: 1 }]);
  assert.ok(Math.abs(z[2] - 1) < 1e-9);
  assert.ok(z[0] > z[1] - z[0]);
});
