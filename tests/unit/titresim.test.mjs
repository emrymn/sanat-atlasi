import { test } from 'node:test';
import assert from 'node:assert/strict';
import { titret } from '../../js/titresim.js';
import { ilerlemeDogrula, varsayilanIlerleme } from '../../js/depo.js';

test('İş 106 titret: kapalıysa hiçbir şey; vibrate varsa doğruda tek, yanlışta iki darbe', () => {
  const cagri = [];
  const ortam = { vibrate: (x) => (cagri.push(x), true) };
  assert.equal(titret('dogru', false, ortam), 'kapali');
  assert.equal(cagri.length, 0);
  assert.equal(titret('dogru', true, ortam), 'vibrate');
  assert.equal(titret('yanlis', true, ortam), 'vibrate');
  assert.equal(typeof cagri[0], 'number');
  assert.equal(cagri[1].filter((_, i) => i % 2 === 0).length, 2); // iki darbe, arada bekleme
});

test('İş 106 titret: vibrate yoksa (iPhone) hata vermez', () => {
  assert.doesNotThrow(() => titret('yanlis', true, {}));
  assert.doesNotThrow(() => titret('dogru', true, null));
});

test('İş 106 ayar: varsayılan açık, kapatılırsa yedekten dönüşte kapalı kalır', () => {
  assert.equal(varsayilanIlerleme().ayarlar.titresim, true);
  assert.equal(ilerlemeDogrula({ islenen: [1] }).ayarlar.titresim, true);
  assert.equal(ilerlemeDogrula({ islenen: [1], ayarlar: { titresim: false } }).ayarlar.titresim, false);
});
