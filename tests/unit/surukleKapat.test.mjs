// İş 114: harita penceresini aşağı çekerek kapatma
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { birakmaKarari, hareketKarari, KAPAT_MESAFE } from '../../js/surukleKapat.js';

test('bırakınca: yeterince çekildiyse ya da hızlı fırlatıldıysa kapanır, yoksa geri yaylanır', () => {
  assert.equal(birakmaKarari(KAPAT_MESAFE + 1, 0), 'kapat');
  assert.equal(birakmaKarari(40, 0.1), 'geri');
  assert.equal(birakmaKarari(40, 1), 'kapat');
  assert.equal(birakmaKarari(10, 2), 'geri'); // küçük titreme kapatmaz
});

test('kayarken: içerik en üstteyse aşağı çekiş pencereyi indirir; ucunda sayfa kaymaz; arada içerik kayar', () => {
  assert.equal(hareketKarari(20, true, false), 'surukle');
  assert.equal(hareketKarari(20, false, false), 'icerik');
  assert.equal(hareketKarari(-20, false, true), 'engelle');
  assert.equal(hareketKarari(-20, true, false), 'icerik');
});
