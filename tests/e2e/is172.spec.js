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

test('Galeri: ana ekranda akımlar yalnız çarkta; müze planının odaları bölümlere götürür', async ({ page }) => {
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
  // 1.76.3: Akımlar koridoru Akımlar sayfasına götürür (eskiden çarka indirirdi)
  await plan.locator('[data-test="plan-akimlar"]').click();
  await expect(page).toHaveURL(/#\/akimlar$/);
  await expect(page.locator('[data-test="gz-akimlar"]')).toHaveCount(1);
  await page.goto('./#/gozat');
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

// ---------- 1.76.3 · Galeri alt sayfalarının üstü (Açılan hap) ve Akımlar sayfası ----------
test('Akımlar sayfası: hap Galeri ana ekranına değil #/akimlar\'a götürür; çark ve bütün akımların dizini orada', async ({ page }) => {
  await page.goto('./#/basyapitlar');
  const haplar = page.locator('.bolumler a');
  await expect(haplar).toHaveCount(4);
  await expect(page.locator('.bolumler a[aria-current="page"]')).toHaveAttribute('data-test', 'basyapit-giris');
  await page.locator('.bolumler [data-test="akimlar-giris"]').click();
  await expect(page).toHaveURL(/#\/akimlar$/);
  await expect(page.locator('.bolumler a[aria-current="page"]')).toHaveAttribute('data-test', 'akimlar-giris');
  await expect(page.locator('#sekmeler a[data-sekme="gozat"]')).toHaveAttribute('aria-current', 'page');
  // çark burada da çalışır
  const cark = page.locator('[data-cark]');
  await expect(cark.locator('.cark-oge').first()).toBeVisible();
  await expect(cark.locator('[data-cark-no]')).toHaveText('01');
  // dizin: her akım bir satır; açıklar bağlantı, kilitliler "Konu N'de açılır"
  const akimSayisi = await page.evaluate(() => window.__atlas.akimlar.length);
  const satirlar = page.locator('[data-test="akim-dizin-satir"]');
  await expect(satirlar).toHaveCount(akimSayisi);
  expect(await page.locator('a[data-test="akim-dizin-satir"]').count()).toBeGreaterThan(0);
  await expect(page.locator('div[data-test="akim-dizin-satir"]').first()).toContainText(/Konu \d+.* açılır/);
  for (const k of await page.locator('a[data-test="akim-dizin-satir"]').evaluateAll((l) => l.map((e) => e.getBoundingClientRect().height))) expect(k).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.scrollingElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  const ilk = page.locator('a[data-test="akim-dizin-satir"]').first();
  const ad = await ilk.locator('b').textContent();
  await ilk.click();
  await expect(page).toHaveURL(/#\/akim\//);
  await expect(page.locator('.ust h1')).toHaveText(ad);
});

test('Açılan hap: etkin bölüm geniş ve adı görünür, ötekiler 48 pt ikon; arama başlığın yanında; ana ekranda hap yok', async ({ page }) => {
  for (const [adres, test] of [
    ['./#/akimlar', 'akimlar-giris'],
    ['./#/basyapitlar', 'basyapit-giris'],
    ['./#/konular', 'konu-giris'],
    ['./#/zaman', 'zaman-giris'],
  ]) {
    await page.goto(adres);
    const etkin = page.locator('.bolumler a[aria-current="page"]');
    await expect(etkin).toHaveAttribute('data-test', test);
    await etkin.evaluate((el) => Promise.all(el.getAnimations({ subtree: true }).map((x) => x.finished)));
    const kutular = await page.locator('.bolumler a').evaluateAll((l) => l.map((e) => ({ w: e.getBoundingClientRect().width, h: e.getBoundingClientRect().height, sag: e.getBoundingClientRect().right, etkin: e.hasAttribute('aria-current') })));
    for (const k of kutular) {
      expect(k.h).toBeGreaterThanOrEqual(44);
      expect(k.sag).toBeLessThanOrEqual(390.5);
      if (k.etkin) expect(k.w).toBeGreaterThan(150);
      else expect(Math.round(k.w)).toBe(48);
    }
    await expect(etkin.locator('.bolum-yazi')).toHaveCSS('opacity', '1');
    // arama başlıkla aynı satırda
    const h1 = await page.locator('.gz-ust .ust h1').boundingBox();
    const ara = await page.locator('.gz-ust [data-test="arama-hapi"]').boundingBox();
    expect(ara.x).toBeGreaterThan(h1.x + h1.width);
    expect(Math.abs(ara.y + ara.height / 2 - (h1.y + h1.height / 2))).toBeLessThan(12);
    expect(ara.height).toBeGreaterThanOrEqual(44);
  }
  // bölüm değişince eski hap kapanır, yenisi açılır
  await page.locator('.bolumler [data-test="konu-giris"]').click();
  await expect(page).toHaveURL(/#\/konular$/);
  const yeni = page.locator('.bolumler a[aria-current="page"]');
  await expect(yeni).toHaveAttribute('data-test', 'konu-giris');
  await expect.poll(async () => (await yeni.boundingBox()).width).toBeGreaterThan(150);
  await expect.poll(async () => Math.round((await page.locator('.bolumler [data-test="zaman-giris"]').boundingBox()).width)).toBe(48);
  await page.goto('./#/gozat');
  await expect(page.locator('.bolumler')).toHaveCount(0);
  await expect(page.locator('[data-test="arama-hapi"]')).toBeVisible();
  await expect(page.locator('[data-test="gz-akimlar"]')).toHaveCount(1);
});
