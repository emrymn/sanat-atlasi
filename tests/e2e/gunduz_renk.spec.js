// 1.77.0 · Renkli Gündüz: Ayarlar → Gündüz rengi; otomatikte palet günün tablosundan, saklanır; Nötr eski Gündüz
import { test, expect } from '@playwright/test';
import { agiHazirla, ilerleme } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

const kok = (page, ad) => page.evaluate((a) => document.documentElement.style.getPropertyValue(a).trim(), ad);

test('Gündüz rengi: varsayılan Günün resmi; palet günün tablosundan yazılır ve saklanır; Gece’de hiç yazılmaz', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'gece');
  await expect(page.locator('html')).not.toHaveAttribute('data-gunduz', /.*/);
  expect(await kok(page, '--band')).toBe('');
  await page.goto('./#/ayarlar');
  const secim = page.locator('[data-test="ayar-gunduz-renk"]');
  await expect(secim.locator('input[value="otomatik"]')).toBeChecked();
  for (const l of await secim.locator('label').all()) expect((await l.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await page.locator('label', { has: page.locator('input[name="tema"][value="gunduz"]') }).click();
  await expect(page.locator('html')).toHaveAttribute('data-gunduz', 'otomatik');
  // tablonun tonları gelince palet günün sanatçısıyla saklanır (sonraki açılışta beklemeden)
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:gunduz-renk') || 'null'))).not.toBeNull();
  const kayit = await page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:gunduz-renk')));
  expect(typeof kayit.id === 'string' && kayit.id.length > 0).toBe(true);
  expect(kayit.palet.bg).toMatch(/^#[0-9a-f]{6}$/);
  expect(await kok(page, '--bg')).toBe(kayit.palet.bg);
  // sekme çubuğu paletin koyu renginde
  const zemin = await page.locator('#sekmeler').evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(zemin).not.toBe('rgba(0, 0, 0, 0)');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-gunduz', 'otomatik');
  expect(await kok(page, '--bg')).toBe(kayit.palet.bg);
});

test('Gündüz rengi: sabit palet seçmek temayı Gündüz yapar ve kalıcıdır; Nötr kâğıt eski Gündüz’e döner; Gece temizler', async ({ page }) => {
  await page.goto('./#/ayarlar');
  const secim = page.locator('[data-test="ayar-gunduz-renk"]');
  await secim.locator('label', { hasText: 'Safran' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'gunduz');
  await expect(page.locator('html')).toHaveAttribute('data-gunduz', 'safran');
  await expect(page.locator('input[name="tema"][value="gunduz"]')).toBeChecked();
  expect(await kok(page, '--band')).toBe('#25306a');
  expect(await kok(page, '--bg')).toBe('#f3e1b0');
  expect(await page.locator('meta[name="theme-color"]').getAttribute('content')).toBe('#f3e1b0');
  expect((await ilerleme(page)).ayarlar).toMatchObject({ tema: 'gunduz', gunduzRenk: 'safran' });
  // çark paletin bandında
  await page.goto('./#/gozat');
  await expect(page.locator('.cark-disk')).toBeVisible();
  expect(await page.locator('.cark-disk').evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(37, 48, 106)');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-gunduz', 'safran');
  await page.goto('./#/ayarlar');
  await page.locator('[data-test="ayar-gunduz-renk"] label', { hasText: 'Nötr kâğıt' }).click();
  await expect(page.locator('html')).not.toHaveAttribute('data-gunduz', /.*/);
  expect(await kok(page, '--bg')).toBe('');
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'gunduz');
  await page.locator('[data-test="ayar-gunduz-renk"] label', { hasText: 'Lapis' }).click();
  expect(await kok(page, '--band')).toBe('#1f3768');
  await page.locator('label', { has: page.locator('input[name="tema"][value="gece"]') }).click();
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'gece');
  await expect(page.locator('html')).not.toHaveAttribute('data-gunduz', /.*/);
  expect(await kok(page, '--band')).toBe('');
  // seçim Gece'deyken de saklı: Gündüz'e dönünce Lapis gelir
  await page.locator('label', { has: page.locator('input[name="tema"][value="gunduz"]') }).click();
  await expect(page.locator('html')).toHaveAttribute('data-gunduz', 'lapis');
});

test('Bugün: Gündüz’de tarihin gölgesi kâğıt renginde değil (beyaz hale yok)', async ({ page }) => {
  await page.goto('./#/ayarlar');
  await page.locator('[data-test="ayar-gunduz-renk"] label', { hasText: 'Nötr kâğıt' }).click();
  await page.goto('./');
  const tarih = page.locator('.bugun-tarih');
  await expect(tarih).toBeVisible();
  const golge = await tarih.evaluate((el) => getComputedStyle(el).textShadow);
  // eski hale: rgba(236, 232, 225, …) (Gündüz kâğıdı)
  expect(golge).not.toContain('236, 232, 225');
});

test('Galeri: çarkın arkasında seçili akımın döneminin deseni; çark dönünce dönem değişir', async ({ page }) => {
  await page.goto('./#/gozat');
  const cark = page.locator('[data-cark]');
  await expect(cark).toHaveAttribute('data-donem', 'ortacag');
  const desen = () => cark.evaluate((el) => getComputedStyle(el, '::before').maskImage || getComputedStyle(el, '::before').webkitMaskImage);
  const ilk = await desen();
  expect(ilk).toContain('data:image/svg+xml');
  // ilk Rönesans akımına çevir
  const i = await page.evaluate(() => [...document.querySelectorAll('.cark-oge')].findIndex((e) => e.dataset.donem === 'ronesans'));
  expect(i).toBeGreaterThan(0);
  await page.evaluate((n) => {
    const sr = document.querySelector('.cark-serit');
    const o = sr.querySelectorAll('.cark-oge')[n];
    sr.scrollLeft = o.offsetLeft - (sr.clientWidth - o.offsetWidth) / 2;
  }, i);
  await expect(cark).toHaveAttribute('data-donem', 'ronesans');
  expect(await desen()).not.toBe(ilk);
});
