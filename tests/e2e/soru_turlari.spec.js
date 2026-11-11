import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

// İş 105: Bölüm turu ve Konu turu
async function kartCevapla(page, n) {
  for (let i = 0; i < n; i++) {
    await expect(page.locator('[data-test="soru-resim"]')).toBeVisible({ timeout: 15000 });
    await page.locator('[data-test="st-secenekler"] [data-st-secim]').first().click();
    await expect(page.locator('[data-test="sonuc"]')).toBeVisible();
    await expect(page.locator('[data-test="st-bilgi"]')).toBeVisible();
    // cevaptan sonra yalnız doğru ve seçilen şık kalır
    expect(await page.locator('[data-test="st-secenekler"] [data-st-secim]').count()).toBeLessThanOrEqual(2);
    await page.locator('[data-test="st-sonraki"]').click();
  }
}

test('İş 105: Bölüm turu menüden açılır, 4 bölüm şıkkı; cevap bölümü ve yüzyılı söyler, skor kaydedilir', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/pekistir');
  await page.locator('[data-test="bolum-turu"]').click();
  await expect(page).toHaveURL(/#\/pekistir\/bolum$/);
  // İş 171: geçiş sürerken ayrılan Çalış sayfasının başlıkları da belgede olabilir; soru adıyla aranır
  await expect(page.getByRole('heading', { name: 'Bu eser hangi bölümde?' })).toBeVisible({ timeout: 15000 });
  await expect(page.locator('[data-test="st-secenekler"] [data-st-secim]')).toHaveCount(4);
  await expect(page.locator('[data-test="st-secenekler"]')).toContainText('Bölüm');
  // doğru şık: kartın sanatçısının bölümü
  await page.locator('[data-test="st-secenekler"] [data-st-secim]').first().click();
  await expect(page.locator('[data-test="st-bilgi"] b')).toContainText(/Bölüm \d · /);
  await expect(page.locator('[data-test="st-bilgi"] i')).toContainText('yüzyıl');
  await page.locator('[data-test="st-sonraki"]').click();
  await kartCevapla(page, 2);
  const say = await page.evaluate(() => Object.values(window.__atlas.ilerleme.skorlar).filter((s) => s.bolumKart).length);
  expect(say).toBeGreaterThan(0);
  // yeniden yüklenince (doğrulamadan geçip) skor kalır
  await page.reload();
  await page.waitForFunction(() => window.__atlas && window.__atlas.ilerleme && window.__atlas.ilerleme.skorlar);
  const kalan = await page.evaluate(() => Object.values(window.__atlas.ilerleme.skorlar).filter((s) => s.bolumKart).length);
  expect(kalan).toBe(say);
});

test('İş 105: Konu turu: aynı türden şıklar, cevapta konu özeti, hikâye ve konu sayfası bağlantısı', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/pekistir/ikonografi');
  await expect(page.locator('h2')).toHaveText('Bu eserin konusu ne?', { timeout: 20000 });
  await expect(page.locator('[data-test="st-secenekler"] [data-st-secim]')).toHaveCount(4);
  await page.locator('[data-test="bilmiyorum"]').click();
  await expect(page.locator('[data-test="sonuc"]')).toContainText('Bilmiyorum');
  await expect(page.locator('[data-test="st-hikaye"]')).toBeVisible();
  const bag = page.locator('[data-test="st-konu-bag"]');
  await expect(bag).toHaveAttribute('href', /^#\/konu\//);
  const konu = await page.evaluate(() => Object.keys(window.__atlas.ilerleme.skorlarKonu || {}));
  expect(konu.length).toBe(1);
  await page.locator('[data-test="st-sonraki"]').click();
  await kartCevapla(page, 2);
  // konu sayfasına bağlantı çalışır
  await page.locator('[data-test="st-secenekler"] [data-st-secim]').first().click();
  await page.locator('[data-test="st-konu-bag"]').click();
  await expect(page.locator('[data-test="konu"] h1')).toBeVisible({ timeout: 10000 });
});

// İş 106 ile birlikte: iPhone yolunda (vibrate yok, dokunmatik) cevap düğmelerinde titreşim anahtarı var ve
// dokunuş cevabı tam bir kez işler
test.describe('dokunmatik', () => {
  test.use({ hasTouch: true, isMobile: true });
  test('İş 105/106: Konu turunda iPhone titreşim anahtarı; dokunuş tek cevap', async ({ page, context }) => {
    await agiHazirla(context);
    await context.addInitScript(() => {
      delete Navigator.prototype.vibrate;
    });
    await page.goto('./#/pekistir/ikonografi');
    await expect(page.locator('h2')).toHaveText('Bu eserin konusu ne?', { timeout: 20000 });
    const ilk = page.locator('[data-test="st-secenekler"] [data-st-secim]').first();
    await expect(ilk.locator('.tik input[switch]')).toHaveCount(1);
    await expect(page.locator('[data-test="bilmiyorum"] .tik')).toHaveCount(1);
    await page.evaluate(() => {
      window.__secim = 0;
      document.addEventListener('click', (e) => e.target.closest('[data-st-secim]') && window.__secim++);
    });
    await ilk.tap();
    await expect(page.locator('[data-test="sonuc"]')).toBeVisible();
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => window.__secim)).toBe(1);
    expect(await page.evaluate(() => Object.keys(window.__atlas.ilerleme.skorlarKonu || {}).length)).toBe(1);
    await expect(page.locator('[data-test="st-secenekler"] .tik')).toHaveCount(0);
  });
});
