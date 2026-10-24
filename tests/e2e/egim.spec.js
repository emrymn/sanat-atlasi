// Telefonu eğince Bugün'ün tablosu hareket eder (İş 32). Jiroskop olayı elle gönderilir; izin isteyen tarayıcıda önce dokunulur.
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

// jiroskop: sn saniye boyunca saniyede gamma derece sağa dönüş (60 olay/sn). Dikey eksen etrafındaki dönüş
// standartta gamma'da, iOS'ta beta'da gelir (test iPhone kimliğiyle çalışır): ikisine de yazılır.
const donus = (page, gamma, sn) =>
  page.evaluate(
    async ([g, t]) => {
      for (let i = 0; i < t * 60; i++) {
        window.dispatchEvent(new DeviceMotionEvent('devicemotion', { rotationRate: { alpha: 0, beta: g, gamma: g }, interval: 16 }));
        await new Promise((r) => setTimeout(r, 16));
      }
    },
    [gamma, sn],
  );

test('Bugün: telefon sağa çevrilince tablo döner, Ayarlar’dan kapatılınca durur', async ({ page, context }) => {
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
  await donus(page, 80, 0.4); // sağa çevir
  await expect.poll(() => kutu.evaluate((el) => parseFloat(getComputedStyle(el).getPropertyValue('--egx')) || 0)).toBeGreaterThan(0.5);
  // soyadın gölgesi ayrı katman (her karede yeniden çizilen text-shadow değil)
  const golge = await page.locator('.sahne-isim .ad-son').evaluate((el) => ({ kopya: getComputedStyle(el, '::before').content, ts: getComputedStyle(el).textShadow }));
  expect(golge.kopya).not.toBe('none');
  expect(golge.ts).toBe('none');
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
