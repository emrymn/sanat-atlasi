// İş 171 (Tasarım B, Fable): soru ve cevap ekranlarının yeni görünümü
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

test('soru: parça parça ilerleme, şıklar başparmak bölgesinde ve en az 56 px; cevapta Leitner kutuları altı nokta', async ({ page }) => {
  await page.goto('./#/pekistir/karisik');
  const sayac = await page.locator('[data-test="sayac"]').textContent();
  const toplam = Number(sayac.split('/')[1]);
  // her kart bir parça; şimdiki işaretli
  await expect(page.locator('.ince-cubuk.parcali span')).toHaveCount(toplam);
  await expect(page.locator('.ince-cubuk.parcali span.simdi')).toHaveCount(1);
  expect((await page.locator('.ince-cubuk.parcali span').first().boundingBox()).height).toBeLessThanOrEqual(4);
  const siklar = page.locator('[data-test="sanatci-secenekleri"] .secenek');
  await expect(siklar).toHaveCount(4);
  for (const s of await siklar.all()) {
    const k = await s.boundingBox();
    expect(k.height).toBeGreaterThanOrEqual(56);
    expect(k.y).toBeGreaterThan(844 * 0.45); // ekranın alt yarısı
  }
  // doğru cevap: kutu ilerler, son nokta dolar; yazıda ne zaman tekrar edileceği
  const dogru = await page.evaluate(() => window.__atlas.oturum.kart.id);
  await page.locator(`[data-sanatci="${dogru}"]`).click();
  const satir = page.locator('[data-test="kutu-satir"]');
  await expect(satir).toBeVisible();
  await expect(satir.locator('.kutu-noktalar i')).toHaveCount(6);
  await expect(satir.locator('.kutu-noktalar i.dolu')).toHaveCount(1);
  await expect(satir).toContainText('1. kutu · 1 gün sonra tekrar');
  // ana düğme başparmak bölgesinde, en az 56 px
  await expect.poll(async () => (await page.locator('[data-ikinci]').boundingBox()).height).toBeGreaterThanOrEqual(56); // giriş animasyonu bitince
  // akım sorusunda yanlış cevap: kutu boşalır
  await page.locator('[data-ikinci]').click();
  const akim = await page.evaluate(() => window.__atlas.harita.get(window.__atlas.oturum.kart.id).akim);
  await page.locator(`[data-test="akim-secenekleri"] .secenek:not([data-akim="${akim}"])`).first().click();
  await expect(page.locator('[data-test="kutu-satir"] .kutu-noktalar i.dolu')).toHaveCount(0);
  await expect(page.locator('[data-test="kutu-satir"]')).toContainText('Baştan');
  expect(await page.evaluate(() => document.scrollingElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
});
