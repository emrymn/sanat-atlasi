import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { md5 } from '../../js/md5.js';
import { paletUrl } from '../../js/gorsel.js';

test('md5: Node crypto ile aynı (ASCII, UTF-8, blok sınırları)', () => {
  for (const s of [
    '',
    'a',
    'abc',
    'Vassily_Kandinsky,_1913_-_Composition_7.jpg',
    'Çığlık_ğüşöç.jpg',
    'x'.repeat(55),
    'y'.repeat(56),
    'z'.repeat(64),
    'q'.repeat(200),
  ])
    assert.equal(md5(s), createHash('md5').update(s, 'utf8').digest('hex'), JSON.stringify(s));
});

test('palet adresi: Commons küçük resmi doğrudan upload.wikimedia.org yolundan', () => {
  assert.equal(
    paletUrl({ k: 'commons', d: 'Vassily Kandinsky, 1913 - Composition 7.jpg' }),
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Vassily_Kandinsky%2C_1913_-_Composition_7.jpg/330px-Vassily_Kandinsky%2C_1913_-_Composition_7.jpg',
  );
  assert.match(paletUrl({ k: 'commons', d: 'Eser.tif' }), /\/330px-Eser\.tif\.jpg$/);
  assert.match(paletUrl({ k: 'aic', i: 'abc' }), /^https:\/\/www\.artic\.edu\/iiif\//);
});
