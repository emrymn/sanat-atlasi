import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gorselUrl, paletUrl, yerelGorselleriAyarla, yerelAnahtar } from '../../js/gorsel.js';

test('yerel kopya varsa uygulamanın kendi adresi, yoksa kaynak adresi', () => {
  const c = { k: 'commons', d: 'Örnek dosya.jpg' };
  const m = { k: 'met', u: 'https://images.metmuseum.org/x.jpg' };
  yerelGorselleriAyarla({ [yerelAnahtar(c)]: 'abc123' });
  assert.equal(gorselUrl(c, 800), 'gorseller/b/abc123.jpg');
  assert.equal(gorselUrl(c, 1200), 'gorseller/b/abc123.jpg');
  assert.equal(gorselUrl(c, 400), 'gorseller/k/abc123.jpg');
  assert.equal(paletUrl(c), 'gorseller/k/abc123.jpg');
  assert.equal(gorselUrl(m, 800), 'https://images.metmuseum.org/x.jpg');
  yerelGorselleriAyarla({ [yerelAnahtar(c)]: 'abc123' }, [yerelAnahtar(c)]);
  assert.equal(gorselUrl(c, 1200), 'gorseller/b/abc123.jpg');
  assert.equal(gorselUrl(c, 800), 'gorseller/b/abc123.jpg');
  yerelGorselleriAyarla(null);
  assert.match(gorselUrl(c, 800), /^https:\/\/upload\.wikimedia\.org\//);
});
