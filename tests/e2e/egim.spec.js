// Telefonu eğince Bugün'ün tablosu hareket eder (İş 32). Eğim olayı elle gönderilir; izin isteyen tarayıcıda önce dokunulur.
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

const egim = (page, beta, gamma) =>
  page.evaluate(([b, g]) => window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: b, gamma: g, alpha: 0 })), [beta, gamma]);

test('Bugün: telefon sağa eğilince tablo döner, Ayarlar’dan kapatılınca durur', async ({ page, context }) => {
  await agiHazirla(context);
  await context.grantPermissions(['accelerometer', 'gyroscope']);
  await page.goto('./#/');
  const kutu = page.locator('[data-gunun-gorsel]');
  await expect(kutu).toBeVisible();
  // iPhone gibi izin isteyen tarayıcıda dinleme ilk dokunuşta başlar (izin dokunuşun içinden istenir)
  const izinli = await page.evaluate(() => typeof DeviceOrientationEvent.requestPermission === 'function');
  if (izinli) {
    await expect(kutu).not.toHaveClass(/egimli/);
    await page.locator('.bugun-ust .etiket').click();
  }
  await expect(kutu).toHaveClass(/egimli/);
  await egim(page, 40, 0); // tutuş açısı
  await egim(page, 40, 20); // sağa eğ
  await expect.poll(() => kutu.evaluate((el) => parseFloat(getComputedStyle(el).getPropertyValue('--egx')) || 0)).toBeGreaterThan(0.5);
  const eksen = await kutu.evaluate((el) => el.style.getPropertyValue('--egim-eksen'));
  expect(eksen).toMatch(/deg$/);
  await expect(page.locator('.egim-isik')).toBeVisible();

  await page.goto('./#/ayarlar');
  const anahtar = page.locator('[data-ayar-egim]');
  await expect(anahtar).toBeChecked();
  await anahtar.click();
  await expect(anahtar).not.toBeChecked();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme')).ayarlar.egim)).toBe(false);
  await page.goto('./#/');
  await expect(page.locator('[data-gunun-gorsel]')).toBeVisible();
  await expect(page.locator('[data-gunun-gorsel]')).not.toHaveClass(/egimli/);
});
