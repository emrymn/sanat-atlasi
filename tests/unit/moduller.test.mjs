// T1: app.js ekranlara bölündü. Her JS dosyası service worker kabuğunda olmalı (çevrimdışı açılış),
// her içe aktarılan ad gerçekten dışa aktarılmalı ve ortak.js ekran modüllerine bağımlı olmamalı.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const kok = new URL('../../', import.meta.url);
const oku = (y) => readFileSync(new URL(y, kok), 'utf8');
const jsDosyalari = [...readdirSync(new URL('js/', kok)).filter((f) => f.endsWith('.js')).map((f) => `js/${f}`), ...readdirSync(new URL('js/ekranlar/', kok)).map((f) => `js/ekranlar/${f}`)];

test('her JS dosyası service worker kabuk listesinde', () => {
  const sw = oku('sw.js');
  for (const f of jsDosyalari) assert.ok(sw.includes(`'${f}'`), `${f} sw.js KABUK_DOSYALARI'nda yok`);
});

test('içe aktarılan her ad kaynağında dışa aktarılır', () => {
  for (const f of jsDosyalari) {
    const metin = oku(f);
    for (const m of metin.matchAll(/import \{([^}]+)\} from '([^']+)'/g)) {
      const hedef = new URL(m[2], new URL(f, kok));
      const kaynak = readFileSync(hedef, 'utf8');
      for (const parca of m[1].split(',')) {
        const ad = parca.trim().split(/\s+as\s+/)[0];
        if (!ad) continue;
        assert.match(kaynak, new RegExp(`export (async )?(function|const|let|class) ${ad}\\b`), `${f}: ${ad} ${m[2]}'den dışa aktarılmıyor`);
      }
    }
  }
});

test('ortak.js ekran modüllerini içe aktarmaz (döngü yok, ilk o değerlendirilir)', () => {
  assert.doesNotMatch(oku('js/ekranlar/ortak.js'), /from '\.\/(bugun|gozat|pekistir|ilerleme|ayarlar|yonlendirme)\.js'/);
});

test('app.js yalnızca giriş: ekran kodu ekranlar/ altında', () => {
  assert.ok(oku('js/app.js').split('\n').length < 150);
});
