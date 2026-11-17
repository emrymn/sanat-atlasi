import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { agiHazirla } from './ortak.js';

// İş 175 / İş 188: eser dersi yayın kapısı. Ders ayrı ekran değil; başyapıt sayfasında "Daha derine in" ile açılır.
// Gerçek başyapıt verisi ve gerçek ders dosyaları (Mantegna, Ölü İsa) kullanılır; yalnız kapı dosyası
// (data/ders_yayin.json) testte değiştirilir.
const K = 'Q546297';
const kapi = JSON.parse(readFileSync(new URL('../../data/ders_yayin.json', import.meta.url), 'utf8'));
const kapiVer = (context, onayli) =>
  context.route(/\/data\/ders_yayin\.json(\?.*)?$/, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ...kapi, onayli }) }));

test('onaylanmamış ders görünmez: sayfada giriş, sözlük ve ders metni yok; /ders adresi de yalnız sayfayı açar', async ({ page, context }) => {
  await agiHazirla(context);
  await kapiVer(context, []);
  await page.goto(`./#/basyapit/${K}`);
  await expect(page.locator('[data-test="basyapit"] h1')).toBeVisible();
  await expect(page.locator('[data-basyapit-gorsel] img')).toBeAttached();
  await expect(page.locator('[data-test="basyapit-incele"]')).toBeVisible(); // ders bağlama adımı da geçildi
  await expect(page.locator('[data-test="basyapit-ders"]')).toHaveCount(0);
  await expect(page.locator('[data-bsy-sozluk]')).toBeHidden();
  await page.goto(`./#/basyapit/${K}/ders`);
  await expect(page.locator('[data-test="basyapit"] h1')).toBeVisible();
  await expect(page.locator('[data-test="basyapit-incele"]')).toBeVisible();
  await expect(page.locator('[data-test="ders-metni"]')).toHaveCount(0);
});

test('ders: "Daha derine in" aynı sayfada açılır (etiketsiz, temiz metin), künye ve sözlük dersten dolar, geri kapanır', async ({ page, context }) => {
  await agiHazirla(context);
  await kapiVer(context, [K]);
  await page.goto(`./#/basyapit/${K}`);
  const sayfa = page.locator('[data-test="basyapit"]');
  const giris = page.locator('[data-test="basyapit-ders"]');
  await expect(giris).toBeVisible();
  await expect(page.locator('.bsy-derin-kart')).toContainText('Ayrıntılı okuma');
  await expect(page.locator('[data-test="ders-metni"]')).toHaveCount(0);
  // künye: teknik dersten; sözlük listesi görünür
  await expect(sayfa.locator('[data-bsy-kunye]')).toContainText('Teknik');
  await expect(sayfa.locator('[data-bsy-sozluk] dt').first()).toBeVisible();
  await giris.click();
  const metin = page.locator('[data-test="ders-metni"]');
  await expect(metin).toBeVisible();
  await expect(metin.locator('.bsy-bolum h2').first()).toBeVisible();
  await expect(metin).not.toContainText('[C0');
  await expect(metin).not.toContainText('(belirsiz)');
  await expect(metin).not.toContainText('bu oturumda');
  await expect(sayfa).not.toContainText('Kart');
  await expect(giris).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  // daha az göster: kart geri gelir
  await metin.locator('[data-bsy-derin-kapat]').click();
  await expect(page.locator('[data-test="ders-metni"]')).toHaveCount(0);
  await expect(page.locator('[data-test="basyapit-ders"]')).toBeVisible();
});

test('/ders adresi: aynı sayfa, ayrıntılı anlatım açık; geri başyapıtlar listesine döner', async ({ page, context }) => {
  await agiHazirla(context);
  await kapiVer(context, [K]);
  await page.goto(`./#/basyapit/${K}/ders`);
  await expect(page.locator('[data-test="basyapit"] h1')).toBeVisible();
  await expect(page.locator('[data-test="ders-metni"]')).toBeVisible();
  await page.locator('[data-test="basyapit"] [data-geri]').click();
  await expect(page).toHaveURL(/#\/basyapitlar$/);
});
