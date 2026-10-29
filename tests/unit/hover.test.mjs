import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// İş 72: iPhone'da :hover ile görünüşü değişen bağlantıda ilk dokunuş yalnız "üzerine gelme" sayılıyor, bağlantı
// ikinci dokunuşta açılıyordu (galerideki dönem kartları). Bütün :hover kuralları (hover: hover) içinde olmalı.
test('her :hover kuralı yalnız fareli cihazlarda: @media (hover: hover) içinde', () => {
  const css = readFileSync(new URL('../../css/app.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const disarida = [];
  const yigin = [];
  let bas = 0;
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === '{') {
      const baslik = css.slice(bas, i).trim();
      const hoverli = baslik.startsWith('@media') && /hover:\s*hover/.test(baslik);
      if (!baslik.startsWith('@') && baslik.includes(':hover') && !yigin.some((x) => x)) disarida.push(baslik);
      yigin.push(hoverli);
      bas = i + 1;
    } else if (c === '}') {
      yigin.pop();
      bas = i + 1;
    } else if (c === ';' && !yigin.length) bas = i + 1;
  }
  assert.deepEqual(disarida, []);
});
