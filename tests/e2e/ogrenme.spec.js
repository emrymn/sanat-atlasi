import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

async function simdikiKart(page) {
  return page.evaluate(async () => {
    while (!window.__atlas || !window.__atlas.oturum || !window.__atlas.oturum.kart) await new Promise((r) => setTimeout(r, 50));
    return { id: window.__atlas.oturum.kart.id, eser: window.__atlas.oturum.kart.eser.anahtar };
  });
}

test('tanışma: yeni sanatçıda önce eserler ve not, sonra soru (soru tanışmada gösterilmeyen eserle)', async ({ page, context }) => {
  await agiHazirla(context, { tanisma: true });
  await page.goto('./#/pekistir/karisik');
  const t = page.locator('[data-test="tanisma"]');
  await expect(t).toBeVisible();
  await expect(t).toContainText('Yeni sanatçı');
  await expect(page.locator('[data-test="sanatci-secenekleri"]')).toHaveCount(0);
  const n = await page.locator('.tanisma-eser').count();
  expect(n).toBeGreaterThan(0);
  expect(n).toBeLessThanOrEqual(3);
  const kart = await simdikiKart(page);
  const gosterilen = await page.evaluate(() => window.__atlas.oturum.kart.tanismaEserleri.map((e) => e.anahtar));
  expect(gosterilen).not.toContain(kart.eser);
  // eser büyütülür
  await page.locator('.tanisma-eser').first().click();
  await expect(page.locator('.gor')).toBeVisible();
  await page.locator('.gor').getByRole('button', { name: 'Kapat' }).click();
  // yatay taşma yok
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  await page.locator('[data-tanisma-gec]').click();
  await expect(page.locator('[data-test="sanatci-secenekleri"] button')).toHaveCount(4);
  // cevaplandıktan sonra aynı sanatçı tekrar tanıtılmaz
  await page.locator('[data-test="sanatci-secenekleri"] button').first().click();
  const tekrar = await page.evaluate(() => window.__atlas.ilerleme.skorlar[window.__atlas.oturum.kart.id]);
  expect(tekrar && tekrar.sanatci).toBeTruthy();
});

test('tanışma Ayarlar’dan kapatılır', async ({ page, context }) => {
  await agiHazirla(context, { tanisma: true });
  await page.goto('./#/ayarlar');
  const anahtar = page.locator('[data-ayar-tanisma]');
  await expect(anahtar).toBeChecked();
  await anahtar.uncheck();
  await page.goto('./#/pekistir/karisik');
  await expect(page.locator('[data-test="sanatci-secenekleri"] button')).toHaveCount(4);
  await expect(page.locator('[data-test="tanisma"]')).toHaveCount(0);
});

test('aynı ikiliyi 2. kez karıştırınca yaprakta yan yana eserler; İlerleme’de listelenir', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/pekistir/karisik');
  await expect(page.locator('[data-test="sanatci-secenekleri"] button')).toHaveCount(4);
  const kart = await simdikiKart(page);
  const yanlis = await page.evaluate((dogru) => window.__atlas.oturum.kart.secenekler.find((x) => x !== dogru), kart.id);
  // daha önce bir kez karıştırılmış gibi
  await page.evaluate(
    ([a, b]) => {
      window.__atlas.ilerleme.karisanlar = { [[a, b].sort().join('|')]: { n: 1, son: '2026-10-20' } };
    },
    [kart.id, yanlis],
  );
  await page.locator(`[data-test="sanatci-secenekleri"] [data-sanatci="${yanlis}"]`).click();
  const serit = page.locator('[data-test="karsi-serit"]');
  await expect(serit).toBeVisible();
  await expect(serit).toContainText('2. kez');
  await expect(serit.locator('[data-karsi] img').first()).toBeAttached();
  await expect(page.locator('[data-test="karsilastir"]')).toBeVisible();
  // yaprak ekrandan taşmıyor
  const kutu = await page.locator('.alt-yaprak').boundingBox();
  expect(kutu.height).toBeLessThan(844 * 0.75);
  await page.goto('./#/ilerleme');
  const liste = page.locator('[data-test="karisanlar"]');
  await expect(liste).toContainText('2 kez karıştırdın');
  await liste.locator('a').first().click();
  await expect(page.locator('[data-test="karsilastirma"]')).toBeVisible();
});
