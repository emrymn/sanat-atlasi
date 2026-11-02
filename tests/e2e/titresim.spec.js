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
  // anahtar değişirken titretmez (iPhone'da anahtarı geri çeviriyordu); "Titreşimi dene" düğmesi titretir
  const once = await page.evaluate(() => window.__titresim.length);
  await anahtar.click({ force: true });
  await expect(anahtar).toBeChecked();
  expect(await page.evaluate(() => window.__titresim.length)).toBe(once);
  await page.locator('[data-test="titresim-dene"]').click();
  expect(await page.evaluate(() => window.__titresim.length)).toBe(once + 1);
  await anahtar.click({ force: true });
  await expect(anahtar).not.toBeChecked();
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

// iPhone yolu (vibrate yok): gizli anahtara kodla tıklama, dokunuş korumasına (js/dokunus.js) "son tıklama" diye
// yazılıp asıl düğmenin 180 ms sonra ikinci kez tıklanmasına yol açıyordu (Ayarlar'daki anahtar geri kapanıyordu)
test.describe('dokunmatik', () => {
  test.use({ hasTouch: true, isMobile: true });
  test('İş 106: iPhone yolunda dokunuş tek tıklama sayılır; Titreşim anahtarı açık kalır', async ({ page, context }) => {
    await agiHazirla(context);
    await context.addInitScript(() => {
      delete Navigator.prototype.vibrate;
    });
    await page.goto('./#/ayarlar');
    const dene = page.locator('[data-test="titresim-dene"]');
    await dene.waitFor();
    await page.evaluate(() => {
      window.__tik = 0;
      document.querySelector('[data-test="titresim-dene"]').addEventListener('click', () => window.__tik++);
    });
    await dene.tap();
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => window.__tik)).toBe(1);
    // anahtar: kapat, aç; açık kalır
    const anahtar = page.locator('[data-test="ayar-titresim"]');
    const satir = page.locator('label.konu', { has: anahtar });
    await satir.tap();
    await page.waitForTimeout(500);
    await expect(anahtar).not.toBeChecked();
    await satir.tap();
    await page.waitForTimeout(500);
    await expect(anahtar).toBeChecked();
  });
});
