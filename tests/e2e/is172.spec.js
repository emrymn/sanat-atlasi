import { test, expect } from '@playwright/test';
import { agiHazirla, ilerleme } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

test('Hızlı ayarlar: sekme çubuğundaki dişli dil yaprağı açar; tema, hareket ve günlük kart yerinde değişir', async ({ page }) => {
  await page.goto('./');
  const dil = page.locator('[data-test="hizli-ayar-dil"]');
  await expect(dil).toBeVisible();
  // dil çubuğun üst kenarında, yatayda ortada; dokunma alanı 44 pt (görünen dilden büyük)
  const k = await dil.boundingBox();
  const cubuk = await page.locator('#sekmeler').boundingBox();
  expect(Math.abs(k.x + k.width / 2 - 195)).toBeLessThanOrEqual(1);
  expect(k.y + k.height).toBeGreaterThan(cubuk.y);
  expect(await dil.evaluate((el) => parseFloat(getComputedStyle(el, '::before').height))).toBeGreaterThanOrEqual(44);
  await dil.click();
  const yaprak = page.locator('[data-test="hizli-ayar"] .hizli-yaprak');
  await expect(yaprak).toBeVisible();
  await expect(dil).toHaveAttribute('aria-expanded', 'true');
  for (const b of await yaprak.locator('label, .hizli-adim button, .hizli-hepsi').all()) expect((await b.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await yaprak.locator('[data-test="hizli-tema"] label', { hasText: 'Gündüz' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'gunduz');
  await yaprak.locator('[data-test="hizli-hareket"] label', { hasText: 'Sade' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-hareket', 'sade');
  const once = Number(await yaprak.locator('[data-test="hizli-gunluk-kart"]').textContent());
  await yaprak.getByRole('button', { name: 'Artır' }).click();
  await expect(yaprak.locator('[data-test="hizli-gunluk-kart"]')).toHaveText(String(once + 5));
  const i = await ilerleme(page);
  expect(i.ayarlar).toMatchObject({ tema: 'gunduz', hareket: 'sade', gunlukKart: once + 5 });
  // Esc kapatır; yeniden açınca seçimler yerinde
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-test="hizli-ayar"]')).toBeHidden();
  await dil.click();
  await expect(yaprak.locator('input[name="hizli-tema"][value="gunduz"]')).toBeChecked();
  // "Bütün ayarlar" Ayarlar ekranını açar; orada dil görünmez
  await yaprak.locator('[data-test="hizli-hepsi"]').click();
  await expect(page.getByRole('heading', { name: 'Ayarlar', exact: true })).toBeVisible();
  await expect(page.locator('[data-test="hizli-ayar"]')).toBeHidden();
  await expect(dil).toBeHidden();
  await expect(page.locator('[data-test="gunluk-kart"]')).toHaveText(String(once + 5));
});

test('Hızlı ayarlar: dil dört sekmede de var; perdeye dokununca kapanır; sekme çubuğu yokken dil de yok', async ({ page }) => {
  await page.goto('./');
  const dil = page.locator('[data-test="hizli-ayar-dil"]');
  for (const s of ['harita', 'gozat', 'pekistir', 'bugun']) {
    await page.locator(`#sekmeler a[data-sekme="${s}"]`).click();
    await expect(dil).toBeVisible();
  }
  await expect(page.locator('#sekmeler a')).toHaveCount(4);
  await dil.click();
  await expect(page.locator('.hizli-yaprak')).toBeVisible();
  await page.locator('.hizli-perde').click({ position: { x: 30, y: 60 } });
  await expect(page.locator('[data-test="hizli-ayar"]')).toBeHidden();
  await page.goto('./#/pekistir/karisik');
  await expect(page.locator('#sekmeler')).toBeHidden();
  await expect(dil).toBeHidden();
});

test('Galeri: Akımlar yalnız bir yerde (çark); müze planının odaları bölümlere götürür', async ({ page }) => {
  await page.goto('./#/gozat');
  await expect(page.locator('[data-test="gz-akimlar"]')).toHaveCount(1);
  await expect(page.locator('.gz-akim-serit, .gz-kisayol, ol.zaman')).toHaveCount(0);
  const plan = page.locator('[data-test="gz-plan"]');
  await expect(plan).toBeVisible();
  for (const t of ['zaman-giris', 'konu-giris', 'gz-karsilastir', 'gz-koleksiyon', 'plan-akimlar']) {
    const k = await plan.locator(`[data-test="${t}"]`).boundingBox();
    expect(k.height).toBeGreaterThanOrEqual(44);
    expect(k.x + k.width).toBeLessThanOrEqual(390.5);
  }
  // canlı içerik: yüzyıl cetvelinde açık yüzyıllar, sahne sayısı, tondo ve karşılaştırma çerçeveleri
  expect(await plan.locator('.oda-cetvel span.acik').count()).toBeGreaterThan(0);
  await expect(plan.locator('[data-plan-konu-yazi]')).toHaveText(/^\d+ sahne/);
  await expect(plan.locator('[data-plan-konu] img')).toBeAttached();
  await expect(plan.locator('[data-plan-kars] img')).toHaveCount(2);
  expect(await page.evaluate(() => document.scrollingElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  // Akımlar koridoru çarka indirir
  await plan.locator('[data-test="plan-akimlar"]').click();
  await expect(page.locator('[data-cark-teker]')).toBeInViewport();
  await page.evaluate(() => window.scrollTo(0, 0));
  await plan.locator('[data-test="konu-giris"]').click();
  await expect(page).toHaveURL(/#\/konular$/);
  await page.goto('./#/gozat');
  await page.locator('[data-test="gz-plan"] [data-test="zaman-giris"]').click();
  await expect(page).toHaveURL(/#\/zaman$/);
});

test('Akımlar çarkı: bütün akımlar tek şeritte; çark çevrilince sıradaki akım ortaya gelir, açık salona girilir', async ({ page }) => {
  await page.goto('./#/gozat');
  const cark = page.locator('[data-cark]');
  await expect(cark.locator('.cark-oge').first()).toBeVisible();
  expect(await cark.locator('.cark-oge').count()).toBeGreaterThan(10);
  expect(await cark.locator('.cark-oge.kilitli').count()).toBeGreaterThan(0);
  // liste artık uzun değil: çark bölümü bir ekrandan kısa
  expect((await cark.boundingBox()).height).toBeLessThan(760);
  await cark.scrollIntoViewIfNeeded();
  const no = cark.locator('[data-cark-no]');
  await expect(no).toHaveText('01');
  await expect(cark.locator('.cark-ad.secili')).toHaveText('Gotik');
  // çarkı sola çevir
  const teker = cark.locator('[data-cark-teker]');
  await teker.scrollIntoViewIfNeeded();
  const r = await teker.boundingBox();
  await page.mouse.move(r.x + 260, r.y + 30);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) await page.mouse.move(r.x + 260 - i * 12, r.y + 30);
  await page.mouse.up();
  await expect(no).not.toHaveText('01');
  // şerit tam bir karta oturur ve seçili ad o kartın adıdır
  await expect
    .poll(() =>
      page.evaluate(() => {
        const s = document.querySelector('[data-cark-serit]');
        const adim = s.children[1].offsetLeft - s.children[0].offsetLeft;
        return Math.abs(s.scrollLeft / adim - Math.round(s.scrollLeft / adim));
      }),
    )
    .toBeLessThan(0.02);
  await page.waitForTimeout(400); // yumuşak kaydırma bitsin
  const sira = Number(await no.textContent());
  expect(sira).toBeGreaterThan(1);
  const ad = await cark.locator('.cark-oge').nth(sira - 1).locator('b').textContent();
  await expect(cark.locator('.cark-ad.secili')).toHaveText(ad);
  // çarktaki bir ada dokununca o akım ortaya gelir
  await page.mouse.click(r.x + r.width / 2 - 115, r.y + 30);
  await expect(no).toHaveText(String(sira - 1).padStart(2, '0'));
  // başa dön ve ilk salona gir
  await page.evaluate(() => document.querySelector('[data-cark-serit]').scrollTo({ left: 0 }));
  await expect(no).toHaveText('01');
  await cark.locator('a.zaman-kart').first().click();
  await expect(page).toHaveURL(/#\/akim\//);
});
