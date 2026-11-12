// 1.77.1 · Gotik çarkının kemerinde ve Başyapıtlar'da Berlinghieri'nin Aziz Francesco panosu yok (temsil dışı);
// kemerde Duccio'nun Rucellai Madonnası (AKIM_KAPAK)
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

const PANO = /San_Francesco_e_storie_della_sua_vita/;

test('Galeri: Gotik çarkında Berlinghieri panosu kullanılmaz; kemerde elle seçilen Rucellai Madonnası', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/gozat');
  const gotik = page.locator('.cark-oge').first();
  await expect(gotik.locator('b')).toHaveText('Gotik');
  const fon = gotik.locator('[data-zaman-fon] img');
  await expect(fon).toHaveCount(1);
  expect(decodeURIComponent(await fon.getAttribute('data-yedek'))).not.toMatch(PANO);
  expect(decodeURIComponent(await fon.getAttribute('data-yedek'))).toMatch(/Duccio_-_Maestà_-_Google_Art_Project/);
  // önizleme çerçeveleri de (data-yedek: Commons dosya adı; src yerel kopya olabilir)
  await expect(gotik.locator('[data-onizleme] img').first()).toBeAttached();
  for (const src of await gotik.locator('[data-onizleme] img').evaluateAll((l) => l.map((i) => i.getAttribute('data-yedek') || i.getAttribute('src')))) expect(decodeURIComponent(src)).not.toMatch(PANO);
});
