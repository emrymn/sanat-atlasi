import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

test('Günün sanatçısı: ana sayfada kart, bölüm içeriği, aynı gün aynı sanatçı', async ({ page }) => {
  await page.goto('./');
  const kart = page.locator('[data-test="gunun-kart"]');
  await expect(kart).toBeVisible();
  // ana sayfada en üstteki kart
  const ilkY = await kart.boundingBox();
  const menuY = await page.locator('[data-test="pekistir"]').boundingBox();
  expect(ilkY.y).toBeLessThan(menuY.y);
  const ad = (await kart.locator('b').textContent()).trim();
  await kart.click();
  await expect(page.getByRole('heading', { name: 'Günün sanatçısı' })).toBeVisible();
  await expect(page.locator('.gunun-ad')).toHaveText(ad);
  await expect(page.locator('[data-test="kurs-durumu"]')).toHaveText(/Kursta: Konu \d+|Henüz kursta yok|Kurs dışı/);
  await expect(page.locator('[data-test="donem"]')).not.toBeEmpty();
  await expect(page.getByText(/^Claude taslağı · /)).toBeVisible();
  await expect(page.locator('.galeri-eser').first()).toBeVisible();
  // galeri eseri tam ekran açılır
  await page.locator('.galeri-eser').first().click();
  await expect(page.locator('.gor')).toBeVisible();
  await page.locator('.gor').getByRole('button', { name: 'Kapat' }).click();
  // aynı gün yeniden açınca aynı sanatçı
  await page.reload();
  await expect(page.locator('.gunun-ad')).toHaveText(ad);
  // başka bir sanatçı
  await page.locator('[data-test="baska"]').click();
  await expect(page.locator('.gunun-ad')).not.toHaveText(ad);
});

test('kilitli sanatçı pekiştirmeye eklenir', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-test="gunun-kart"]')).toBeVisible();
  const id = await page.evaluate(() => {
    const d = window.__atlas;
    return d.sanatcilar.find((s) => !d.ilerleme.islenen.includes(s.konu) && s.konu > 40).id;
  });
  await page.goto(`./#/gunun/${id}`);
  await expect(page.locator('[data-test="kurs-durumu"]')).toHaveText(/Henüz kursta yok|Kurs dışı/);
  await page.getByRole('button', { name: 'Bu sanatçıyı pekiştirmeye ekle' }).click();
  await expect(page.getByText('Eklendi: bu sanatçı bugünkü tekrarlarda.')).toBeVisible();
  const i = await page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme')));
  expect(i.ekSanatcilar).toContain(id);
  expect(i.skorlar[id].sanatci.sonraki).toBe(i.gunluk.tarih);
  // karışık turda vadeli kart olarak gelir
  const secildi = await page.evaluate(async (id) => {
    location.hash = '#/pekistir/karisik';
    await new Promise((r) => setTimeout(r, 1500));
    return window.__atlas.oturum.oturum.kuyruk.some((k) => k.id === id);
  }, id);
  expect(secildi).toBe(true);
});

test('biyografi ve dönem bilgisi çevrimdışı açılır', async ({ page, context }) => {
  await page.goto('./');
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await context.setOffline(true);
  await page.goto('./#/gunun');
  await expect(page.locator('[data-test="donem"]')).not.toBeEmpty();
  await context.setOffline(false);
});
