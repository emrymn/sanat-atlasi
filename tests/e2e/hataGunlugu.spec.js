// İş 115: yakalanmayan hata telefonda günlüğe düşer; Ayarlar'dan kopyalanır ve temizlenir
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

test('hata günlüğü: yakalanmayan hata ve reddedilen söz Ayarlar’da görünür, kopyalanır, temizlenir', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/ayarlar');
  await expect(page.locator('[data-test="hata-gunlugu"]')).toContainText('Kayıtlı hata yok');
  await page.evaluate(() => {
    setTimeout(() => {
      throw new Error('deneme hatası');
    });
    Promise.reject(new Error('deneme sözü'));
  });
  await page.waitForTimeout(300);
  await page.reload();
  const b = page.locator('[data-test="hata-gunlugu"]');
  await expect(b).toContainText('2 kayıt');
  await b.getByRole('button', { name: 'Kopyala' }).click();
  await expect(page.locator('#hata-cikti')).toHaveValue(/deneme hatası[\s\S]*Söz reddedildi: deneme sözü/);
  await b.getByRole('button', { name: 'Temizle' }).click();
  await expect(page.locator('[data-test="hata-gunlugu"]')).toContainText('Kayıtlı hata yok');
});
