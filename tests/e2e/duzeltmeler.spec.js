// Rapor düzeltme paketi: D1 (tek kart sayısı), D4 (büyük soru görseli, 2×2 seçenek), D7 (ad sırası), D8 (slayt notları)
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

test('D1: Bugün hapı, Pekiştir menüsü ve tur sayacı aynı kart sayısını gösterir', async ({ page }) => {
  await page.goto('./');
  const hap = page.locator('.sahne-dugme [data-test="tur-sayi"]');
  await expect(hap).toBeVisible();
  const n = Number(await hap.textContent());
  expect(n).toBeGreaterThan(0);
  await expect(page.locator('.sahne-dugme [data-test="tur-alt"]')).toHaveText(/^\d+ tekrar( · \d+ pekiştirme)? · \d+ yeni$/);
  await page.goto('./#/pekistir');
  await expect(page.locator('[data-test="karisik-dugme"] [data-test="tur-sayi"]')).toHaveText(String(n));
  await page.locator('[data-test="karisik-dugme"]').click();
  await expect(page.locator('[data-test="sayac"]')).toHaveText(`1 / ${n}`);
});

test('D1: dönem satırındaki kart sayısı turun sayacıyla aynı', async ({ page }) => {
  await page.goto('./#/pekistir');
  const satir = page.getByRole('link', { name: /^Gotik / });
  const m = /(\d+) kart/.exec(await satir.textContent());
  expect(m).toBeTruthy();
  await satir.click();
  await expect(page.locator('[data-test="sayac"]')).toHaveText(`1 / ${m[1]}`);
});

test('D4: soru görseli kalan yüksekliği doldurur, seçenekler 2×2', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // seçenekler sırayla kayarak gelir; konumlar hareket bitince ölçülür
  await page.goto('./#/pekistir/karisik');
  const secenekler = page.locator('[data-test="sanatci-secenekleri"] button');
  await expect(secenekler).toHaveCount(4);
  const kutular = await Promise.all([0, 1, 2, 3].map((i) => secenekler.nth(i).boundingBox()));
  // iki sütun: A ile B aynı satırda, C ile D altında
  expect(Math.abs(kutular[0].y - kutular[1].y)).toBeLessThan(2);
  expect(kutular[2].y).toBeGreaterThan(kutular[0].y + 20);
  expect(kutular[1].x).toBeGreaterThan(kutular[0].x + 100);
  // görsel için ayrılan yükseklik ekranın yarısından fazla ve seçenekler ekranda
  const h = await page.evaluate(() => {
    const olc = document.createElement('div');
    olc.style.height = 'var(--soru-resim-h)';
    document.querySelector('.soru-sahne').append(olc);
    const y = olc.getBoundingClientRect().height;
    olc.remove();
    return y;
  });
  expect(h).toBeGreaterThan(844 * 0.5);
  await expect(secenekler.nth(3)).toBeInViewport();
});

test('D7: Giotto sayfasında büyük satır "Giotto", altında tam ad', async ({ page }) => {
  await page.goto('./#/sanatci/giotto-di-bondone');
  const son = page.locator('h1 .ad-son');
  const tam = page.locator('h1 .ad-tam');
  await expect(son).toHaveText('Giotto');
  await expect(tam).toHaveText('Giotto di Bondone');
  await expect(page.locator('h1 .ad-ilk:not(.ad-tam)')).toHaveCount(0);
  const [a, b] = [await son.boundingBox(), await tam.boundingBox()];
  expect(b.y).toBeGreaterThan(a.y);
});

test('D8: sanatçı sayfasında eser adlarında ve tarihlerinde slayt notu yok', async ({ page }) => {
  await page.goto('./#/sanatci/giotto-di-bondone');
  await expect(page.locator('.eserler .eser').first()).toBeVisible();
  const yazilar = await page.locator('.eserler').allTextContents();
  expect(yazilar.join(' ')).not.toMatch(/slayt/i);
});
