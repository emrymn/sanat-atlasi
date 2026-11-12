// 1.77.1 · Haritada durak penceresindeki "Tanış" tanışmayı açar (önce boş tur yüzünden haritaya geri dönüyordu);
// kilitli duraktaki küçük kilit dik durur (halkanın -90° dönüşü kilidin ikonuna da geçiyordu)
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

const hazir = (page) => page.waitForFunction(() => window.__atlas && window.__atlas.ilerleme && window.__atlas.akimlar.length);

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

test('Harita: durak penceresinde Tanış tanışmayı açar; bitince haritaya döner ve tanıtım işaretlenir', async ({ page }) => {
  await page.goto('./#/harita');
  await hazir(page);
  const durak = page.locator('[data-test="harita-durak"][data-acik="true"]').first();
  const id = await durak.getAttribute('data-bolum');
  await durak.scrollIntoViewIfNeeded();
  await durak.click();
  const tanis = page.locator('[data-test="harita-tanitim"]');
  await expect(tanis).toBeVisible();
  await tanis.click();
  await expect(page).toHaveURL(new RegExp(`#/pekistir/bolum/${id}/tanitim$`));
  const gec = page.locator('[data-test="konu-tanisma-gec"]');
  await expect(gec).toBeVisible();
  await expect(page.locator('.tanisma-eser').first()).toBeVisible();
  // hepsini geç: tur sorusuz, haritaya döner
  for (let i = 0; i < 30 && (await gec.isVisible().catch(() => false)); i++) {
    await gec.click();
    await expect(page.locator('[data-test="konu-tanisma-gec"].gidiyor')).toHaveCount(0);
  }
  await expect(page).toHaveURL(/#\/harita$/);
  expect(await page.evaluate((b) => window.__atlas.ilerleme.bolumler[b]?.tanitim, id)).toBe(true);
});

test('Harita: kilitli duraktaki kilit ikonu dönmüş değil', async ({ page }) => {
  await page.goto('./#/harita');
  await hazir(page);
  const kilit = page.locator('.durak-kilit svg').first();
  await expect(kilit).toBeAttached();
  expect(await kilit.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
});
