import { test } from 'node:test';
import assert from 'node:assert/strict';
import { yelpazeHedefi, YATMA } from '../../js/deste.js';

test('deste: düz tutunca kapalı, çevirince açılır, iki yönde aynı açılır, ters yöne yatar', () => {
  assert.deepEqual(yelpazeHedefi(0), { acilim: 0, yatma: -0 });
  assert.equal(yelpazeHedefi(0.5).acilim, 0.5);
  assert.equal(yelpazeHedefi(-0.5).acilim, 0.5);
  assert.equal(yelpazeHedefi(1).yatma, -YATMA);
  assert.equal(yelpazeHedefi(-1).yatma, YATMA);
  assert.equal(yelpazeHedefi(3).acilim, 1);
});
