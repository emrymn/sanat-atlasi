// 1.77.1 · Temsil dışı eserler (Emre: Gotik çarkındaki Berlinghieri panosu, "bu resmi kullanma hiçbir yerde")
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TEMSIL_DISI, temsilOlabilir } from '../../js/temsil.js';
import { kapakSec } from '../../js/ikonografi.js';
import { enBilinenEserler } from '../../js/akim.js';

const pano = { qid: 'Q3947103', anahtar: 'q:Q3947103', sl: 40, gorseller: [{ k: 'commons', d: 'a.jpg' }] };
const diptik = { qid: 'Q3711898', anahtar: 'q:Q3711898', sl: 2, gorseller: [{ k: 'commons', d: 'b.jpg' }] };

test('temsilOlabilir: Berlinghieri panosu eser ve başyapıt anahtarıyla dışarıda; ötekiler içeride', () => {
  assert.ok(TEMSIL_DISI.has('Q3947103'));
  assert.equal(temsilOlabilir(pano), false);
  assert.equal(temsilOlabilir({ anahtar: 'Q3947103', sanatci: 'bonaventura-berlinghieri' }), false);
  assert.equal(temsilOlabilir(diptik), true);
  assert.equal(temsilOlabilir(null), false);
});

test('kapakSec ve enBilinenEserler temsil dışı eseri en bilinen olsa da seçmez', () => {
  assert.equal(kapakSec([pano, diptik]), diptik);
  const s = { id: 'bonaventura-berlinghieri' };
  assert.deepEqual(enBilinenEserler([{ s, eserler: [pano, diptik] }]).map((x) => x.e), [diptik]);
});
