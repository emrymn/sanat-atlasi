// Hata denetimi #9 (İş 22): yavaş gelen veri, sonradan açılan ekranın üstüne eski ekranı çizmez.
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

const gecikmeli = (context, desen, ms) =>
  context.route(desen, async (r) => {
    await new Promise((c) => setTimeout(c, ms));
    await r.continue();
  });

test('başyapıt okuması yüklenirken Göz At’a geçilirse okuma Göz At’ın üstüne çizilmez', async ({ page, context }) => {
  await agiHazirla(context);
  await gecikmeli(context, /\/data\/basyapitlar\.json(\?.*)?$/, 1500);
  await page.goto('./#/gozat');
  await expect(page.locator('h1')).toBeVisible();
  const anahtar = await page.evaluate(async () => {
    const j = await (await fetch('data/basyapitlar.json')).json();
    return j.eserler[0].anahtar;
  });
  await page.goto(`./#/basyapit/${encodeURIComponent(anahtar)}`);
  await page.waitForTimeout(100);
  await page.evaluate(() => (location.hash = '#/gozat'));
  await page.waitForTimeout(2500);
  await expect(page.locator('[data-test="basyapit"]')).toHaveCount(0);
  expect(page.url()).toContain('#/gozat');
});

test('Günün sanatçısı → Başka bir sanatçı hızlıca: galeri yeni sanatçının, tek dokunuşta tek görüntüleyici', async ({ page, context }) => {
  await agiHazirla(context);
  await gecikmeli(context, /\/data\/biyografiler\.json(\?.*)?$/, 1200);
  await page.goto('./#/');
  await page.waitForFunction(() => window.__atlas && window.__atlas.ilerleme);
  await page.evaluate(() => (location.hash = '#/gunun'));
  await page.waitForTimeout(150);
  // ilk sayfa veri beklerken ikinci sanatçıya geç
  const ikinci = await page.evaluate(() => {
    const d = window.__atlas;
    const s = d.sanatcilar.find((x) => d.ilerleme.islenen.includes(x.konu) && x.id !== location.hash);
    location.hash = `#/gunun/${encodeURIComponent(s.id)}`;
    return s;
  });
  const galeri = page.locator('[data-galeri] [data-galeri-eser]');
  await expect(galeri.first()).toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(800);
  await expect(page.locator('.gunun-ad')).toContainText(ikinci.ad.split(' ')[0]);
  await galeri.first().click();
  await expect(page.locator('.gor')).toHaveCount(1);
});
