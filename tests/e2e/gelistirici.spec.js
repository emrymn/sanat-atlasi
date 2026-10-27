// İş 42: Ayarlar'daki geliştirici modu her şeyi açar, kapanınca ilerleme eski haline döner
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

const ilerleme = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme')));

test('geliştirici modu: açınca bütün harita durakları açık, kapanınca eski ilerleme geri gelir', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/harita');
  await expect(page.locator('[data-test="harita-durak"][data-acik="true"]')).toHaveCount(1);
  const once = await ilerleme(page);

  await page.goto('./#/ayarlar');
  const anahtar = page.locator('[data-ayar-gelistirici]');
  await expect(anahtar).not.toBeChecked();
  await anahtar.check();
  await expect(page.locator('#gelistirici-mesaj')).toContainText('Açıldı');
  const acik = await ilerleme(page);
  expect(acik.gelistirici.yedek.islenen).toEqual(once.islenen);
  expect(acik.islenen.length).toBeGreaterThan(once.islenen.length);

  await page.goto('./#/harita');
  const bolumSayisi = await page.evaluate(() => window.__atlas.bolumler.length);
  await expect(page.locator('[data-test="harita-durak"][data-acik="true"]')).toHaveCount(bolumSayisi);

  // uygulama yeniden açılınca mod sürer
  await page.reload();
  await page.goto('./#/ayarlar');
  await expect(page.locator('[data-ayar-gelistirici]')).toBeChecked();
  await page.locator('[data-ayar-gelistirici]').uncheck();
  await expect(page.locator('#gelistirici-mesaj')).toContainText('Kapatıldı');
  const geri = await ilerleme(page);
  expect(geri.gelistirici).toBeNull();
  expect(geri.islenen).toEqual(once.islenen);
  expect(geri.bolumler).toEqual(once.bolumler);

  await page.goto('./#/harita');
  await expect(page.locator('[data-test="harita-durak"][data-acik="true"]')).toHaveCount(1);
});
