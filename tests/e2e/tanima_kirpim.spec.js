// İş 193: tanıma kırpımları — konu maddesinin yanında ve sanatçının "Nasıl tanırım?" notunun altında eserden kırpım;
// dokununca görüntüleyici o ayrıntıda açılır.
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

test('konu sayfası: maddelerin yanında kırpım ve eser adı; dokununca görüntüleyici ayrıntıda açılır', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/konu/annunciation');
  const ipuclari = page.locator('[data-konu-ipuclari]');
  await expect(ipuclari.locator('[data-test="tk-konu"]').first()).toBeVisible();
  expect(await ipuclari.locator('[data-test="tk-konu"]').count()).toBeGreaterThanOrEqual(4);
  // Simone Martini'nin zeytin dalı (Sienalı ressamlar) maddesinde eser adı yazar
  await expect(ipuclari.locator('[data-tanima-madde="2"] .tk-kaynak')).toContainText('Martini · ');
  await ipuclari.locator('[data-tanima-madde="2"] [data-test="tk-konu"]').click();
  const inc = page.locator('[data-test="gor-inceleme"]');
  await expect(inc).toBeVisible();
  await expect(inc).toContainText('Cebrail ve zeytin dalı');
});

test('sanatçı sayfası: "Nasıl tanırım?" altında kırpım şeridi; dokununca o ayrıntı', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/sanatci/johannes-vermeer');
  const serit = page.locator('[data-test="tk-serit"]');
  await expect(serit).toBeVisible();
  await expect(serit.locator('[data-test="tk-sanatci"]').first()).toContainText('Küçük ışık benekleri');
  const kutu = await serit.locator('img').first().boundingBox();
  expect(kutu.width).toBeGreaterThan(100);
  await serit.locator('[data-test="tk-sanatci"]').first().click();
  await expect(page.locator('[data-test="gor-inceleme"]')).toContainText('Ekmek ve ışık noktaları');
});
