// T3: iPhone'a özgü davranış. Hem Chromium'da hem gerçek WebKit'te çalışır:
//   npx playwright install webkit && npm run test:webkit
// Sahne ve mozaik animation-timeline: scroll() / view() kullanır; tarayıcı bunu desteklemiyorsa sayfa
// animasyonsuz ama kullanılabilir kalmalıdır (@supports ile korunur). Bu testler iki durumda da taşma,
// kaydırma ve temel gezinmenin bozulmadığını doğrular.
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

const tasma = (page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

test('zaman çizgisi desteği rapora yazılır; Bugün ve ana ekranlarda yatay taşma yok', async ({ page, browserName }, info) => {
  await page.goto('./');
  await expect(page.locator('[data-test="gunun-kart"], [data-test="pekistir"]').first()).toBeVisible();
  const destek = await page.evaluate(() => ({ scroll: CSS.supports('animation-timeline: scroll()'), view: CSS.supports('animation-timeline: view()') }));
  info.annotations.push({ type: 'tarayıcı', description: `${browserName}: scroll()=${destek.scroll} view()=${destek.view}` });
  for (const adres of ['./', './#/gozat', './#/zaman', './#/ilerleme', './#/pekistir', './#/ayarlar', './#/koleksiyon']) {
    await page.goto(adres);
    await page.waitForFunction(() => window.__atlas && window.__atlas.ilerleme);
    await page.waitForTimeout(300);
    expect(await tasma(page), `${adres} yatay taşıyor`).toBeLessThanOrEqual(0);
  }
});

test('Bugün sahnesi: sayfa kaydırılabilir ve pekiştir düğmesi kaydırırken ekranda kalır', async ({ page }) => {
  await page.goto('./');
  const dugme = page.locator('.sahne-dugme').first();
  if (!(await dugme.count())) test.skip(true, 'bu veride Günün sanatçısı sahnesi yok');
  await expect(dugme).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  await expect(dugme).toBeInViewport();
  // desteklenen tarayıcıda zaman çizgisi gerçekten bağlanmış mı: yalnızca bilgi (destek yoksa test başarısız olmaz)
  const baglanti = await page.evaluate(() => {
    const el = document.querySelector('.sahne-yapiskan, .sahne');
    return el ? getComputedStyle(el).animationTimeline : '';
  });
  test.info().annotations.push({ type: 'animation-timeline', description: baglanti || '(yok)' });
});

test('görüntüleyici: iPhone ekranında düğmeler dokunma hedefi ≥ 44 px ve taşmaz', async ({ page }) => {
  await page.goto('./#/sanatci/giotto-di-bondone');
  await expect(page.locator('.eser').first()).toBeVisible();
  await page.locator('.eser').first().click();
  const gor = page.locator('.gor');
  await expect(gor).toBeVisible();
  for (const secici of ['.gor-kapat', '.gor-isaret', '.gor-daha', '.gor-kotu']) {
    const kutu = await gor.locator(secici).boundingBox();
    expect(kutu, secici).not.toBeNull();
    expect(kutu.height, secici).toBeGreaterThanOrEqual(44);
    expect(kutu.x + kutu.width, secici).toBeLessThanOrEqual(390);
    expect(kutu.x, secici).toBeGreaterThanOrEqual(0);
  }
});
