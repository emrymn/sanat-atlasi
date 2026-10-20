import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paletHesapla, vurguSec, acikHal, doluButon, renkTemasi, hsl, hsldenHex, hexten, KOYU_YAZI, BEYAZ_YAZI } from '../../js/renk.js';
import { kontrast } from '../../js/tasarim.js';

const GECE = '#0B0A0B';
const SEPYA = '#F1E8D6';

// n piksel tek renk
function piksel(renk, n) {
  const [r, g, b] = hexten(renk);
  return Array.from({ length: n }, () => [r, g, b, 255]).flat();
}

test('palet: renkler ve payları, büyükten küçüğe', () => {
  const veri = new Uint8ClampedArray([...piksel('#1a2b6d', 600), ...piksel('#d9b44a', 300), ...piksel('#f2efe6', 100)]);
  const p = paletHesapla(veri, 6);
  assert.ok(p.length >= 3 && p.length <= 6);
  assert.equal(p[0].renk, '#1a2b6d');
  assert.ok(Math.abs(p.reduce((t, x) => t + x.pay, 0) - 1) < 1e-9);
  assert.ok(p.some((x) => x.renk === '#d9b44a'));
});

test('palet: saydam pikseller sayılmaz, boş görselde boş palet', () => {
  assert.deepEqual(paletHesapla(new Uint8ClampedArray([10, 10, 10, 0])), []);
});

test('vurgu: en doygun orta ton; çok küçük lekeler ve çok koyu/açık tonlar seçilmez', () => {
  const palet = [
    { renk: '#101010', pay: 0.5 }, // çok koyu
    { renk: '#f5f5f5', pay: 0.2 }, // çok açık
    { renk: '#8a7f70', pay: 0.15 }, // soluk orta ton
    { renk: '#b8452f', pay: 0.13 }, // doygun orta ton
    { renk: '#00ff00', pay: 0.02 }, // küçük leke
  ];
  assert.equal(vurguSec(palet), '#b8452f');
  assert.equal(vurguSec([]), null);
});

test('açık hal: koyu zeminde ve açık zeminde en az 4.5:1', () => {
  for (const renk of ['#1a2b6d', '#b8452f', '#3f5b45', '#7a2230', '#c9a227', '#333333']) {
    assert.ok(kontrast(acikHal(renk, GECE), GECE) >= 4.5, `${renk} gece`);
    assert.ok(kontrast(acikHal(renk, SEPYA), SEPYA) >= 4.5, `${renk} sepya`);
    // koyu zeminde gerçekten açılır
    assert.ok(hsl(acikHal(renk, GECE))[2] >= hsl(renk)[2] - 1e-9);
  }
});

test('dolu düğme: yazı ile zemin arasında en az 4.5:1', () => {
  for (const renk of ['#1a2b6d', '#b8452f', '#808080', '#c9a227', '#5c8fb8', hsldenHex(200, 0.6, 0.5)]) {
    const { zemin, yazi } = doluButon(renk);
    assert.ok([KOYU_YAZI, BEYAZ_YAZI].includes(yazi));
    assert.ok(kontrast(zemin, yazi) >= 4.5, renk);
  }
});

test('renk teması: bütün değişkenler ve kontrast kuralları', () => {
  const t = renkTemasi(
    [
      { renk: '#2b4a9a', pay: 0.6 },
      { renk: '#e9d9b0', pay: 0.4 },
    ],
    GECE,
  );
  assert.ok(kontrast(t.vurgu, t.vurguYazi) >= 4.5);
  assert.ok(kontrast(t.vurguAcik, GECE) >= 4.5);
  assert.ok(kontrast(t.vurguAcik, t.vurguAcikYazi) >= 4.5);
  assert.match(t.vurguKoyu, /^#[0-9a-f]{6}$/);
  assert.match(t.vurguRgb, /^\d+, \d+, \d+$/);
  assert.equal(renkTemasi([], GECE), null);
});
