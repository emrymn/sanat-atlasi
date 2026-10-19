// icons/ikon.svg'den PNG ikonlar üretir (Playwright/Chromium ile). Kullanım: node scripts/ikonlar.mjs
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const kok = new URL('../', import.meta.url);
const svg = await readFile(new URL('icons/ikon.svg', kok), 'utf8');
// maskable: motif güvenli bölgede (%80) kalsın
const maskable = svg.replace('<g id="motif">', '<g id="motif" transform="translate(51.2 51.2) scale(0.8)">');

const tarayici = await chromium.launch();
const sayfa = await tarayici.newPage();
async function uret(icerik, boyut, dosya) {
  await sayfa.setViewportSize({ width: boyut, height: boyut });
  await sayfa.setContent(`<html><body style="margin:0">${icerik.replace('<svg ', `<svg width="${boyut}" height="${boyut}" `)}</body></html>`);
  await sayfa.locator('svg').screenshot({ path: new URL(`icons/${dosya}`, kok).pathname, omitBackground: false });
  console.log(dosya);
}
await uret(svg, 180, 'apple-touch-icon.png');
await uret(svg, 192, 'icon-192.png');
await uret(svg, 512, 'icon-512.png');
await uret(maskable, 512, 'icon-maskable-512.png');
await tarayici.close();
