// İş 174: Qwen denetimi doğrulamasından çıkan düzeltmeler (referans/qwen_denetim_dogrulama.md)
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
  // bütün konular işlenmiş: sanatçı sayfaları açık
  await context.addInitScript(() => {
    if (localStorage.getItem('sanat-atlasi:ilerleme')) return;
    localStorage.setItem('sanat-atlasi:ilerleme', JSON.stringify({ surum: 2, islenen: Array.from({ length: 61 }, (_, i) => i + 1), ayarlar: { gunlukKart: 20, tema: 'gece' } }));
  });
});

test('bozuk adres (#/sanatci/%ZZ) Türkçe hata ekranı ve "Yeniden dene" gösterir', async ({ page }) => {
  const hatalar = [];
  page.on('pageerror', (e) => hatalar.push(e.message));
  await page.goto('./#/');
  await expect(page.locator('h1').first()).toBeVisible();
  await page.evaluate(() => (location.hash = '#/sanatci/%ZZ'));
  await expect(page.locator('[data-test="hata-metni"]')).toHaveText('Bu adres bozuk; açılamadı.');
  await expect(page.locator('[data-test="hata-yeniden"]')).toBeVisible();
  expect(hatalar.filter((m) => /URI/.test(m))).toEqual([]);
});

test('veri dosyası inemezse ham "Failed to fetch" yerine Türkçe bağlantı iletisi', async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  await agiHazirla(context);
  await context.route(/data\/sanatcilar\.json/, (r) => r.abort());
  const page = await context.newPage();
  await page.goto('./#/');
  await expect(page.locator('[data-test="hata-metni"]')).toContainText('Bağlantı kurulamadı');
  await expect(page.locator('[data-test="hata-metni"]')).not.toContainText('Failed to fetch');
  await expect(page.locator('[data-test="hata-yeniden"]')).toBeVisible();
  await context.close();
});

test('geri dönüşte (sayfa bellekten gelir) odak başlıkta, BODY değil', async ({ page }) => {
  await page.goto('./#/gozat');
  await expect(page.locator('h1').first()).toBeVisible();
  await page.goto('./#/sanatci/j-m-w-turner');
  await expect(page.locator('#eserler [data-eser]').first()).toBeVisible();
  await page.locator('button.geri').first().click();
  await expect(page).toHaveURL(/#\/gozat/);
  await expect.poll(() => page.evaluate(() => document.activeElement && document.activeElement.tagName)).toBe('H1');
});

test('görüntüleyicide Tab arka plana kaçmaz; kapanınca arka plan yeniden etkin', async ({ page }) => {
  await page.goto('./#/sanatci/j-m-w-turner');
  const eserler = page.locator('#eserler [data-eser]');
  await expect(eserler.first()).toBeVisible();
  await eserler.first().click();
  await expect(page.locator('.gor')).toBeVisible();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement.closest('.gor'))).toBe(true);
  }
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => !!document.activeElement.closest('.gor'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('.gor')).toHaveCount(0);
  expect(await page.evaluate(() => [...document.body.children].some((x) => x.inert))).toBe(false);
});

test('iki sanatçıya atfedilen eserin künyesinde öteki sanatçı yazar', async ({ page }) => {
  await page.goto('./#/sanatci/giorgione');
  const venus = page.locator('#eserler [data-eser]').filter({ hasText: /Venüs|Venus/ }).first();
  await expect(venus).toBeVisible();
  await venus.click();
  await expect(page.locator('.gor-yazi')).toContainText('Ayrıca atfedilir:');
});

test('yanlış atıflar sanatçı sayfasında yok (Leonardo: Medusa)', async ({ page }) => {
  await page.goto('./#/sanatci/leonardo-da-vinci/eserler');
  await expect(page.locator('[data-eser]').first()).toBeVisible();
  await expect(page.locator('[data-eser]').filter({ hasText: /^Medusa$|Medusa\b/ })).toHaveCount(0);
});
