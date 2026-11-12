import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

// 1.76.4 · Galeri'de Başyapıtlar ("Vitrin") ve Konular ("Sekmeli ızgara"). Emre tasarım tuvalinde seçti.
const tasma = (page) => page.evaluate(() => document.scrollingElement.scrollWidth - innerWidth);
const boylar = (page, secici) => page.locator(secici).evaluateAll((l) => l.map((e) => Math.round(e.getBoundingClientRect().height)));

test('Başyapıtlar: dönem hapları, sahne ve duvar; dönem seçilince o dönemin bütün eserleri akımlarına göre', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/basyapitlar');
  const haplar = page.locator('[data-test="by-donemler"] button');
  await expect(haplar.first()).toHaveText(/Hepsi\s*\d+/);
  await expect(haplar.first()).toHaveAttribute('aria-pressed', 'true');
  const toplam = Number(await haplar.first().locator('small').innerText());
  const sayilar = await haplar.locator('small').evaluateAll((l) => l.slice(1).map((e) => Number(e.textContent)));
  expect(sayilar.reduce((a, b) => a + b, 0)).toBe(toplam);
  for (const b of await boylar(page, '[data-test="by-donemler"] button')) expect(b).toBeGreaterThanOrEqual(44);
  // "Hepsi": her dönemden en çok iki eser ve hepsi düğmesi; üst bölüm (haplar) yerinde
  await expect(page.locator('[data-test="gz-bolumler"] a[aria-current="page"]')).toHaveAttribute('data-test', 'basyapit-giris');
  const listeler = page.locator('[data-test="basyapit-listesi"]');
  expect(await listeler.count()).toBe(sayilar.length);
  for (const n of await listeler.evaluateAll((l) => l.map((u) => u.children.length))) expect(n).toBeLessThanOrEqual(2);
  await expect(page.locator('[data-test="basyapit-listesi"] [data-basyapit-kucuk] img').first()).toBeAttached();
  expect(await tasma(page)).toBeLessThanOrEqual(0);
  // dönem: "… eserin hepsi" düğmesi o dönemin hapını seçer, sayfa değişmez
  const hepsi = page.locator('[data-test="by-hepsi"]').first();
  const n = Number((await hepsi.innerText()).match(/(\d+) eserin hepsi/)[1]);
  await hepsi.click();
  await expect(page).toHaveURL(/#\/basyapitlar$/);
  await expect(haplar.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(haplar.first()).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.vitrin-kart')).toHaveCount(n);
  await expect(page.locator('.by-akim').first()).toBeVisible();
  await expect(page.locator('[data-test="by-hepsi"]')).toHaveCount(0);
  expect(await tasma(page)).toBeLessThanOrEqual(0);
  // seçim hatırlanır: başka bölüme gidip dönünce aynı dönem
  await page.locator('[data-test="gz-bolumler"] [data-test="zaman-giris"]').click();
  await page.locator('[data-test="gz-bolumler"] [data-test="basyapit-giris"]').click();
  await expect(page.locator('[data-test="by-donemler"] button').nth(1)).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-test="by-donemler"] button').first().click();
  await expect(page.locator('[data-test="by-hepsi"]').first()).toBeVisible();
});

test('Başyapıtlar sahnesi: hikâyesi olan eser başta ve rozetli; noktalar 44 pt, noktayla eser değişir, karta dokununca okuma açılır', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/basyapitlar');
  const sahne = page.locator('[data-test="by-sahne"]');
  await expect(sahne).toBeVisible();
  const kartlar = sahne.locator('[data-by-slayt]');
  await expect(kartlar).toHaveCount(4);
  // otomatik testte hareket yok: sahne elle, ilk eser görünür, ötekiler gizli
  await expect(sahne).toHaveClass(/elle/);
  await expect(kartlar.nth(0)).toBeVisible();
  await expect(kartlar.nth(1)).toBeHidden();
  await expect(kartlar.nth(0).locator('[data-by-sahne-resim] img')).toBeAttached();
  await expect(kartlar.nth(0).locator('[data-test="eser-rozetler"] [aria-label="Hikâyesi var"]')).toHaveCount(1);
  await expect(kartlar.nth(0).locator('[data-test="eser-rozetler"] [aria-label="Rehberli incelemesi var"]')).toHaveCount(1);
  for (const b of await boylar(page, '[data-by-nokta]')) expect(b).toBeGreaterThanOrEqual(44);
  await sahne.locator('[data-by-nokta="2"]').click();
  await expect(kartlar.nth(2)).toBeVisible();
  await expect(kartlar.nth(0)).toBeHidden();
  await expect(page).toHaveURL(/#\/basyapitlar$/);
  const ad = await kartlar.nth(2).locator('b').innerText();
  await kartlar.nth(2).click();
  await expect(page).toHaveURL(/#\/basyapit\//);
  await expect(page.locator('[data-test="basyapit"] h1')).toHaveText(ad);
});

test('Konular: sekmeler ve kartlar 44 pt; karttaki sayı konunun bütün resimlerini açar; yana kaydırınca grup değişir', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/konular');
  const sekmeler = page.locator('[data-test="konu-grup-serit"] a');
  await expect(sekmeler.first()).toHaveAttribute('aria-current', 'page');
  for (const b of await boylar(page, '[data-test="konu-grup-serit"] a')) expect(b).toBeGreaterThanOrEqual(44);
  for (const b of await boylar(page, '[data-test="kn-resimler"]')) expect(b).toBeGreaterThanOrEqual(44);
  expect(await tasma(page)).toBeLessThanOrEqual(0);
  await expect(page.locator('.kn-one')).toHaveCount(1);
  await expect(page.locator('.kn-one')).toContainText('En çok işlenen');
  await expect(page.locator('.kn-one [data-konu-kapak] img')).toBeAttached();
  // sayı düğmesi: konu sayfasına girmeden "Bütün resimler"
  const dugme = page.locator('[data-test="kn-resimler"]').nth(1);
  const ad = await page.locator('.konu-kart').nth(1).locator('b').innerText();
  await dugme.click();
  const galeri = page.locator('[data-test="konu-galeri"]');
  await expect(galeri).toBeVisible();
  await expect(galeri.locator('h2')).toHaveText(ad);
  expect(await galeri.locator('[data-galeri-eser]').count()).toBeGreaterThan(0);
  await expect(page).toHaveURL(/#\/konular$/);
  await galeri.locator('[data-galeri-eser]').first().click();
  await expect(page.locator('.gor')).toBeVisible();
  await page.locator('.gor').getByRole('button', { name: 'Kapat' }).click();
  await galeri.getByRole('button', { name: 'Kapat' }).click();
  await expect(galeri).toHaveCount(0);
  // karta dokununca konunun sayfası
  // yana kaydırma (sola): sıradaki grup; sağa: geri
  const ikinci = await sekmeler.nth(1).getAttribute('href');
  const cdp = await context.newCDPSession(page);
  const kaydir = async (x0, x1) => {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y: 500 }] });
    for (let i = 1; i <= 6; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + ((x1 - x0) * i) / 6, y: 500 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  await kaydir(300, 120);
  await expect.poll(() => page.evaluate(() => location.hash)).toBe(ikinci);
  await expect(page.locator('[data-test="konu-grup-serit"] a[aria-current="page"]')).toHaveAttribute('href', ikinci);
  expect(await page.evaluate(() => window.__atlas.yigin)).toEqual([ikinci]);
  await kaydir(120, 300);
  await expect(page.locator('[data-test="konu-grup-serit"] a').first()).toHaveAttribute('aria-current', 'page');
  await page.locator('.konu-kart').first().click();
  await expect(page.locator('[data-test="konu"] h1')).toBeVisible();
});

test('Hareket: Kapalı\'da Başyapıtlar ve Konular\'da süren animasyon yok; Sade\'de sahne kendi kendine değişmez', async ({ page, context }) => {
  await agiHazirla(context);
  await context.addInitScript(() => (window.__atlasGecis = true)); // otomatik testin hareket kısıtını kaldır: ayar denensin
  const suren = () => page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && a.effect && a.effect.getComputedTiming().iterations === Infinity).length);
  // Tam: sahne kendi kendine döner (sonsuz animasyon var)
  await page.goto('./#/basyapitlar');
  await expect(page.locator('[data-test="by-sahne"]')).toBeVisible();
  await expect(page.locator('[data-test="by-sahne"]')).not.toHaveClass(/elle/);
  await expect.poll(suren).toBeGreaterThan(0);
  for (const h of ['sade', 'kapali']) {
    await page.evaluate((x) => (document.documentElement.dataset.hareket = x), h);
    await page.locator('[data-test="by-donemler"] button').nth(1).click();
    await expect(page.locator('[data-test="by-sahne"]')).toHaveClass(/elle/);
    await expect(page.locator('[data-test="by-sahne"] [data-by-slayt]').first()).toBeVisible();
    await expect.poll(suren).toBe(0);
    await page.locator('[data-test="by-donemler"] button').first().click();
  }
  await page.evaluate(() => (location.hash = '#/konular'));
  await expect(page.locator('.kn-one [data-konu-kapak] img')).toBeAttached();
  await expect.poll(suren).toBe(0);
});
