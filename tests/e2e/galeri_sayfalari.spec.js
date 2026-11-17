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
  for (const n of await listeler.evaluateAll((l) => l.map((u) => u.children.length))) expect(n).toBeLessThanOrEqual(7); // 1.88.2: en çok 6 eser + "Hepsine bak"
  await expect(page.locator('[data-test="basyapit-listesi"] [data-basyapit-kucuk] img').first()).toBeAttached();
  expect(await tasma(page)).toBeLessThanOrEqual(0);
  // dönem: "… eserin hepsi" düğmesi o dönemin hapını seçer, sayfa değişmez
  const hepsi = page.locator('[data-test="by-hepsi"]').first();
  const n = Number((await hepsi.getAttribute('aria-label')).match(/(\d+) eserin hepsi/)[1]);
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

test('Konular: Başyapıtlar düzeni — Hepsi sekmesi, sahne, gruplarda iki kart ve "N konu"; grup sekmesi yerinde çizilir', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/konular');
  const haplar = page.locator('[data-test="konu-grup-serit"] button');
  await expect(haplar.first()).toHaveAttribute('aria-pressed', 'true');
  for (const b of await boylar(page, '[data-test="konu-grup-serit"] button')) expect(b).toBeGreaterThanOrEqual(44);
  expect(await tasma(page)).toBeLessThanOrEqual(0);
  await expect(page.locator('[data-test="by-sahne"]')).toBeVisible();
  await expect(page.locator('[data-test="by-sahne"]')).toContainText('Öne çıkan');
  const hepsi = page.locator('[data-test="by-hepsi"]').first();
  const n = Number((await hepsi.innerText()).match(/\d+/)[0]);
  await hepsi.click();
  await expect(page).toHaveURL(/#\/konular\/[a-z_]+$/);
  await expect(page.locator('[data-test="konu-grup-serit"] button[aria-pressed="true"]')).toHaveCount(1);
  await expect(page.locator('[data-test="konu-listesi"] .konu-kart')).toHaveCount(n);
  await haplar.first().click();
  await expect(page).toHaveURL(/#\/konular$/);
  await page.locator('[data-test="konu-listesi"] .konu-kart').first().click();
  await expect(page.locator('[data-test="konu"] h1')).toBeVisible();
});

test('Başyapıtlar ve Konular: Hepsi\'de her bölümün kartları yana kayan sıra (6 kart + Hepsine bak); sayfa yana taşmaz', async ({ page, context }) => {
  await agiHazirla(context);
  for (const adres of ['./#/basyapitlar', './#/konular']) {
    await page.goto(adres);
    const sira = page.locator('.by-duvar.serit').first();
    await expect(sira.locator('li').nth(2)).toBeAttached();
    expect(await sira.evaluate((u) => u.scrollWidth > u.clientWidth + 100)).toBe(true);
    // en çok 6 kart ve sonda "Hepsine bak"; ona dokununca o bölümün sekmesi
    expect(await sira.locator('li:not(.serit-son)').count()).toBeLessThanOrEqual(6);
    const son = sira.locator('[data-test="serit-hepsi"]');
    await expect(son).toContainText('Hepsine bak');
    expect(await tasma(page)).toBeLessThanOrEqual(0);
    await son.scrollIntoViewIfNeeded();
    await son.click();
    await expect(page.locator('[aria-pressed="true"]').first()).not.toContainText('Hepsi');
  }
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
  await expect(page.locator('.by-sahne [data-konu-kapak] img').first()).toBeAttached();
  await expect.poll(suren).toBe(0);
});
