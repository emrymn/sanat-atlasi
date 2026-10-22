import { test, expect } from '@playwright/test';
import { agiHazirla, ilerleme } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

async function simdikiKartId(page) {
  return page.evaluate(async () => {
    while (!window.__atlas || !window.__atlas.oturum || !window.__atlas.oturum.kart) await new Promise((r) => setTimeout(r, 50));
    return window.__atlas.oturum.kart.id;
  });
}

test('seviyeler: Orta kilitli; Kolay’da %80 olunca geçer ve Orta açılır', async ({ page }) => {
  await page.goto('./#/pekistir');
  await page.waitForFunction(() => localStorage.getItem('sanat-atlasi:ilerleme'));
  const bolum = page.locator('[data-test="seviyeler"]');
  await expect(bolum).toBeVisible();
  await expect(bolum.locator('[data-seviye-sec="kolay"]')).toBeVisible();
  await expect(bolum.locator('[data-seviye-kilit="orta"]')).toContainText('Kilitli');
  await expect(bolum.locator('[data-seviye-kilit="zor"]')).toBeVisible();

  // Bütün açık sanatçılar Kolay'da 4 doğru cevaplı olsun: bir doğru daha → %100 ve 5 cevap → Orta
  await page.evaluate(() => {
    const d = window.__atlas;
    const i = JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme'));
    i.seviyeler = {};
    for (const s of d.sanatcilar) i.seviyeler[s.id] = { s: 0, son: [1, 1, 1, 1] };
    localStorage.setItem('sanat-atlasi:ilerleme', JSON.stringify(i));
  });
  await page.reload();
  await page.goto('./#/pekistir/seviye/kolay');
  await expect(page.locator('.soru-baslik, [data-test="sanatci-secenekleri"]').first()).toBeVisible();
  await expect(page.getByText('Soru 1 / 1 · Kolay')).toBeVisible();

  // 5. cevap doğru: 5/5 → Orta
  const id = await simdikiKartId(page);
  await page.locator(`[data-test="sanatci-secenekleri"] button[data-sanatci="${id}"]`).click();
  await expect(page.locator('[data-test="seviye-gecti"]')).toContainText('Orta seviyeye geçti');
  const i = await ilerleme(page);
  expect(i.seviyeler[id]).toEqual({ s: 1, son: [] });

  // Orta artık açık
  await page.goto('./#/pekistir');
  await expect(page.locator('[data-seviye-sec="orta"]')).toContainText('1 sanatçı');
  await page.getByRole('button', { name: 'Bitir' }).click();
  await page.locator('[data-seviye-sec="orta"]').click();
  await expect(page.getByText('Soru 1 / 1 · Orta')).toBeVisible();
  expect(await simdikiKartId(page)).toBe(id);
  // Orta'da şıklarda sanatçının kendi akımından kimse yok
  const akimlar = await page.evaluate(() => {
    const d = window.__atlas;
    return d.oturum.kart.secenekler.map((x) => d.harita.get(x).akim);
  });
  const kendi = akimlar[(await page.evaluate(() => window.__atlas.oturum.kart.secenekler)).indexOf(id)];
  expect(akimlar.filter((a) => a === kendi)).toHaveLength(1);
});

test('seviyeler: yanlış cevapta seviye atlanmaz; ilerleme satırı görünür', async ({ page }) => {
  await page.goto('./#/');
  await expect(page.getByRole('heading', { name: 'Sanat Atlası' })).toBeAttached();
  await page.waitForFunction(() => localStorage.getItem('sanat-atlasi:ilerleme'));
  await page.evaluate(() => {
    const d = window.__atlas;
    const i = JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme'));
    i.seviyeler = {};
    for (const s of d.sanatcilar) i.seviyeler[s.id] = { s: 0, son: [1, 1, 1, 0] };
    localStorage.setItem('sanat-atlasi:ilerleme', JSON.stringify(i));
  });
  await page.reload();
  await page.goto('./#/pekistir/seviye/kolay');
  const id = await simdikiKartId(page);
  await page.locator(`[data-test="sanatci-secenekleri"] button:not([data-sanatci="${id}"])`).first().click();
  await expect(page.locator('[data-test="seviye"]')).toContainText('Kolay · son 5 cevapta 3 doğru · Orta için %80');
  expect((await ilerleme(page)).seviyeler[id].s).toBe(0);
  // sanatçı sayfasında seviye durumu
  await page.goto(`./#/sanatci/${encodeURIComponent(id)}`);
  await expect(page.locator('[data-test="sanatci-seviye"]')).toContainText('Kolay');
  // İlerleme ekranında özet
  await page.goto('./#/ilerleme');
  await expect(page.locator('[data-test="seviye-ozet"]')).toContainText('Kolay');
});
