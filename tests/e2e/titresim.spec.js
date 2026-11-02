import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

// İş 106: cevapta titreşim; Ayarlar'dan kapatılınca titremez
test('İş 106: cevap verince titreşir (doğru 1, yanlış 2 darbe); Ayarlar’dan kapatılır', async ({ page, context }) => {
  await agiHazirla(context);
  await context.addInitScript(() => {
    window.__titresim = [];
    navigator.vibrate = (x) => (window.__titresim.push(x), true);
  });
  await page.goto('./#/pekistir/karisik');
  const ilk = page.locator('[data-test="sanatci-secenekleri"] .secenek').first();
  await ilk.waitFor({ timeout: 20000 });
  const dogruMu = await page.evaluate(() => window.__atlas.oturum.kart.id);
  const secilen = await ilk.getAttribute('data-sanatci');
  await ilk.click();
  await expect.poll(() => page.evaluate(() => window.__titresim.length)).toBe(1);
  const darbe = await page.evaluate(() => window.__titresim[0]);
  expect(Array.isArray(darbe)).toBe(secilen !== dogruMu); // yanlışta dizi (iki darbe), doğruda tek sayı
  // Ayarlar'da kapat
  await page.goto('./#/ayarlar');
  const anahtar = page.locator('[data-test="ayar-titresim"]');
  await expect(anahtar).toBeChecked();
  await anahtar.click({ force: true });
  await expect(anahtar).not.toBeChecked();
  expect(await page.evaluate(() => window.__atlas.ilerleme.ayarlar.titresim)).toBe(false);
  await page.evaluate(() => (window.__titresim.length = 0));
  // yarım kalan tur: devam et, sıradaki karta geç
  await page.goto('./#/pekistir/devam');
  await page.locator('[data-ikinci]').click();
  await page.locator('[data-test="akim-secenekleri"] button').first().click();
  await expect(page.locator('[data-test="sonuc"]')).toBeVisible();
  expect(await page.evaluate(() => window.__titresim.length)).toBe(0);
  await page.locator('[data-sonraki]').click();
  const ikinci = page.locator('[data-test="sanatci-secenekleri"] .secenek').first();
  await ikinci.waitFor({ timeout: 20000 });
  await ikinci.click();
  await expect(page.locator('[data-test="sonuc"]')).toBeVisible();
  expect(await page.evaluate(() => window.__titresim.length)).toBe(0);
});
