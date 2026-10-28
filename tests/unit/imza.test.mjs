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
