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
  await expect.poll(() => page.evaluate(() => window.__titresim.length)).toBe(once + 1);
  await anahtar.click({ force: true });
  await expect(anahtar).not.toBeChecked();
  await page.evaluate(() => (window.__titresim.length = 0));
  await page.goto('./#/pekistir/karisik');
  await page.locator('[data-test="sanatci-secenekleri"] .secenek').first().waitFor({ timeout: 20000 });
  await expect(page.locator('.secenek .tik')).toHaveCount(0); // kapalıyken iPhone tıkı da çizilmez
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

// iPhone yolu (vibrate yok): titreşimi, düğmeyi kaplayan etiketin içindeki anahtar verir (parmak ona değer). Etiketin ve
// anahtarın tıklamaları uygulamaya ulaşmaz; düğme tam bir kez tıklanır, dokunuş koruması (js/dokunus.js) ikinciyi üretmez
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
    await expect(dene.locator('.tik input[switch]')).toHaveCount(1);
    await dene.tap();
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => window.__tik)).toBe(1);
    expect(await dene.locator('.tik input').isChecked()).toBe(true); // parmağın değdiği anahtar çevrildi
    // anahtar: kapat, aç; açık kalır
    const anahtar = page.locator('[data-test="ayar-titresim"]');
    const satir = page.locator('label.konu', { has: anahtar });
    await satir.tap();
    await page.waitForTimeout(500);
    await expect(anahtar).not.toBeChecked();
    await satir.tap();
    await page.waitForTimeout(500);
    await expect(anahtar).toBeChecked();
    // Pekiştir: cevap seçeneğine dokunmak cevabı tam bir kez işler
    await page.goto('./#/pekistir/karisik');
    const ilk = page.locator('[data-test="sanatci-secenekleri"] .secenek').first();
    await ilk.waitFor({ timeout: 20000 });
    await expect(ilk.locator('.tik input[switch]')).toHaveCount(1);
    await expect(page.locator('[data-test="bilmiyorum"] .tik')).toHaveCount(1);
    await page.evaluate(() => {
      window.__secenek = 0;
      document.addEventListener('click', (e) => e.target.closest('.secenek') && window.__secenek++);
    });
    await ilk.tap();
    await expect(page.locator('[data-test="sonuc"]')).toBeVisible();
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => window.__secenek)).toBe(1);
    await expect(page.locator('.secenek .tik')).toHaveCount(0); // cevaptan sonra düğmeler kapalı, tık yok
  });
});
