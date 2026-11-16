import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { agiHazirla } from './ortak.js';

// İş 175: eser dersi yayın kapısı. Gerçek başyapıt verisi ve gerçek ders dosyaları (Mantegna, Ölü İsa) kullanılır;
// yalnız kapı dosyası (data/ders_yayin.json) testte değiştirilir.
const K = 'Q546297';
const kapi = JSON.parse(readFileSync(new URL('../../data/ders_yayin.json', import.meta.url), 'utf8'));
const kapiVer = (context, onayli) =>
  context.route(/\/data\/ders_yayin\.json(\?.*)?$/, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ...kapi, onayli }) }));

test('onaylanmamış ders görünmez: başyapıt sayfasında giriş yok, adres de açılmaz', async ({ page, context }) => {
  await agiHazirla(context);
  await kapiVer(context, []);
  await page.goto(`./#/basyapit/${K}`);
  await expect(page.locator('[data-test="basyapit"] h1')).toBeVisible();
  await expect(page.locator('[data-basyapit-gorsel] img')).toBeAttached();
  await expect(page.locator('[data-test="basyapit-ders"]')).toHaveCount(0);
  await page.goto(`./#/basyapit/${K}/ders`);
  await expect(page.locator('#uygulama')).toContainText('henüz yayında değil');
  await expect(page.locator('[data-test="eser-dersi"]')).toHaveCount(0);
});

test('ders: giriş → kısa okuma (etiketsiz) → daha fazlası → kartlar; künye kartı ve Bildim/Bilemedim yok', async ({ page, context }) => {
  await agiHazirla(context);
  await kapiVer(context, [K]);
  await page.goto(`./#/basyapit/${K}`);
  await page.locator('[data-test="basyapit-ders"]').click();
  const ders = page.locator('[data-test="eser-dersi"]');
  const metin = ders.locator('[data-test="ders-metni"]');
  await expect(metin).toBeVisible();
  await expect(metin).not.toContainText('[C0');
  await expect(metin).not.toContainText('(belirsiz)');
  await expect(metin).not.toContainText('bu oturumda');
  await expect(ders.locator('[data-uzun]')).toBeHidden();
  await ders.locator('[data-fazla]').click();
  await expect(ders.locator('[data-uzun]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await ders.locator('[data-sekme="kart"]').click();
  const kart = ders.locator('[data-test="ders-kart"]');
  await expect(kart).toBeVisible();
  await expect(ders.locator('.drsx-kart-ust')).toContainText('Kart 1 /');
  await expect(kart).not.toContainText('Künye');
  await ders.locator('.drsx-alt [data-cevir]').click();
  await expect(ders.locator('[data-test="kart-cevap"]')).toBeVisible();
  await expect(ders.getByRole('button', { name: /Bildim|Bilemedim/ })).toHaveCount(0);
  await ders.locator('.drsx-alt [data-sonraki]').first().click();
  await expect(ders.locator('.drsx-kart-ust')).toContainText('Kart 2 /');
  // geri: başyapıt sayfası
  await page.locator('[data-geri]').click();
  await expect(page.locator('[data-test="basyapit"]')).toBeVisible();
});
