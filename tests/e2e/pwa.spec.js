import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

test('manifest geçerli, ikonlar erişilebilir', async ({ page, request }) => {
  await page.goto('./');
  const href = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(href).toBe('manifest.webmanifest');
  const m = await (await request.get(href)).json();
  expect(m.display).toBe('standalone');
  expect(m.short_name).toBe('Atlas');
  for (const i of m.icons) {
    const y = await request.get(i.src);
    expect(y.status(), i.src).toBe(200);
    expect(y.headers()['content-type']).toContain('image/png');
  }
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', 'icons/apple-touch-icon.png');
  await expect(page.locator('meta[name="apple-mobile-web-app-capable"]')).toHaveAttribute('content', 'yes');
  expect((await request.get('icons/apple-touch-icon.png')).status()).toBe(200);
});

test('service worker kaydolur ve ilk açılıştan sonra çevrimdışı çalışır', async ({ page, context }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Sanat Atlası' })).toBeVisible();
  const kapsam = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope);
  expect(kapsam).toMatch(/\/sanat-atlasi\/$/);
  // sayfa SW denetimine girsin, bir sanatçı sayfası ve kart görselleri önbelleğe girsin
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await page.goto('./#/sanatci/giotto-di-bondone');
  await expect(page.locator('.eser img').first()).toBeVisible();
  await expect.poll(() => page.evaluate(async () => (await (await caches.open('atlas-resim-2')).keys()).length)).toBeGreaterThan(0);

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: /Giotto/ })).toBeVisible();
  await page.goto('./#/');
  await expect(page.getByRole('heading', { name: 'Sanat Atlası' })).toBeVisible();
  await page.locator('#sekmeler a[data-sekme="pekistir"]').click();
  await page.locator('[data-test="karisik-dugme"]').click();
  await expect(page.locator('[data-test="sanatci-secenekleri"] button')).toHaveCount(4);
  await page.locator('#sekmeler a[data-sekme="gozat"]').count(); // gezinme hatasız
  await context.setOffline(false);
});

test('önbellek dosyası olmadan da çalışır', async ({ page, context }) => {
  await context.route(/\/data\/eserler_onbellek\.json$/, (r) => r.fulfill({ status: 404, body: '' }));
  await page.goto('./#/sanatci/giotto-di-bondone');
  await expect(page.locator('.eser').first()).toBeVisible();
  await expect(page.locator('.eser', { hasText: 'Fixture' })).toHaveCount(0);
});

test('okunuş kaydı service worker üzerinden parça parça (Range → 206) gelir, çevrimdışı da', async ({ page, context }) => {
  await page.goto('./');
  await page.evaluate(async () => await navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  const parca = () =>
    page.evaluate(async () => {
      const y = await fetch('gorseller/ses/albrecht-durer.mp3', { headers: { Range: 'bytes=0-1' } });
      return { durum: y.status, aralik: y.headers.get('content-range'), boy: (await y.arrayBuffer()).byteLength };
    });
  const ilk = await parca();
  expect(ilk).toMatchObject({ durum: 206, boy: 2 });
  expect(ilk.aralik).toMatch(/^bytes 0-1\/\d+$/);
  await expect.poll(() => page.evaluate(async () => !!(await (await caches.open('atlas-resim-2')).match(new URL('gorseller/ses/albrecht-durer.mp3', location.href).href)))).toBe(true);
  await context.setOffline(true);
  expect(await parca()).toMatchObject({ durum: 206, boy: 2 });
  await context.setOffline(false);
});
