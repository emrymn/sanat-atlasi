// İş 169: resimlerin hikâyesi
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
  await context.addInitScript(() => {
    if (!localStorage.getItem('sanat-atlasi:ilerleme'))
      localStorage.setItem('sanat-atlasi:ilerleme', JSON.stringify({ surum: 2, islenen: Array.from({ length: 80 }, (_, i) => i + 1), ayarlar: { tema: 'gece', hareket: 'kapali' }, sonSurum: '9.9.9' }));
  });
});

test('İş 169: görüntüleyicide Hikâyesi paneli ve karakterlere yakınlaşma', async ({ page }) => {
  await page.goto('./#/sanatci/diego-velazquez');
  await expect(page.locator('.eser').first()).toBeVisible();
  const i = await page.evaluate(() => window.__atlas.sonEserListesi.findIndex((e) => e.qid === 'Q208758'));
  expect(i).toBeGreaterThanOrEqual(0);
  await page.locator('.eser').nth(i).click();
  const dugme = page.locator('[data-test="gor-hikaye"]');
  await expect(dugme).toBeVisible();
  await dugme.click();
  const panel = page.locator('[data-test="gor-hikaye-panel"]');
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('Ne oluyor?');
  await expect(panel).toContainText('Kim kimdir?');
  await expect(panel).toContainText('Ressamla bağı');
  await panel.locator('[data-test="gor-hikaye-karakterler"]').click();
  await expect(panel).toBeHidden();
  await expect(page.locator('[data-test="gor-inc-no"]')).toHaveText(/^1 \/ \d+$/);
  await expect(page.locator('[data-test="gor-inc-ad"]')).toHaveText('Velázquez');
  await page.locator('[data-test="gor-inc-sonraki"]').click();
  await expect(page.locator('[data-test="gor-inc-ad"]')).toHaveText('Infanta Margarita');
  await page.locator('[data-test="gor-inc-bitir"]').click();
  await expect(page.locator('[data-test="gor-inceleme"]')).toBeHidden();
  // panel kapat düğmesi
  await dugme.click();
  await page.locator('[data-test="gor-hikaye-kapat"]').click();
  await expect(panel).toBeHidden();
});

test('İş 169: hikâyesi olmayan eserde düğme yok', async ({ page }) => {
  await page.goto('./#/sanatci/giotto-di-bondone');
  await page.locator('.eser').first().click();
  await expect(page.locator('.gor-resim')).toBeVisible();
  await expect(page.locator('[data-test="gor-hikaye"]')).toBeHidden();
});

test('İş 169: başyapıt sayfasında hikâye bölümü', async ({ page }) => {
  await page.goto('./#/basyapit/Q1212937');
  await expect(page.locator('[data-test="basyapit-hikaye"]')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('[data-test="basyapit-hikaye"]')).toContainText('Anamorfik kurukafa');
});
