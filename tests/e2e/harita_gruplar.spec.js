// 1.89: 6 ve üstü sanatçılı durakta tanışma 3–4 kişilik gruplara bölünür; harita (durak sayısı, yerleri) değişmez
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

const hazir = (page) => page.waitForFunction(() => window.__atlas && window.__atlas.ilerleme && window.__atlas.haritaDurum);

test('Harita: kalabalık durakta Tanış grup grup; bir grup bitince yalnız o işaretlenir, başla sıradaki gruba götürür', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/harita');
  await hazir(page);
  const id = await page.evaluate(async () => {
    const { kaydet } = await import('./js/ekranlar/ortak.js');
    const d = window.__atlas;
    const l = d.haritaDurum.liste;
    const hedef = l.find((x) => x.sanatcilar.length >= 6);
    d.ilerleme.islenen = [...new Set([...(d.ilerleme.islenen || []), ...d.konular.map((k) => k.no)])];
    for (const x of l.slice(0, l.indexOf(hedef))) d.ilerleme.bolumler[x.id] = { kolay: 1, orta: 1, tanitim: true };
    kaydet();
    return hedef.id;
  });
  await page.goto('./#/');
  await hazir(page);
  await page.goto('./#/harita');
  await hazir(page);
  const n = await page.evaluate((b) => window.__atlas.haritaDurum.liste.find((x) => x.id === b).sanatcilar.length, id);
  const durak = page.locator(`[data-test="harita-durak"][data-bolum="${id}"]`);
  await expect(durak).toHaveAttribute('data-acik', 'true');
  await durak.scrollIntoViewIfNeeded();
  await durak.click();
  const gruplar = page.locator('[data-test="harita-tanitim-grup"]');
  await expect(gruplar.first()).toBeVisible();
  const g = await gruplar.count();
  expect(g).toBe(Math.ceil(n / 4));
  await expect(page.locator('[data-test="harita-tanitim"]')).toHaveCount(0);
  await expect(page.locator('[data-test="harita-basla"]')).toHaveText(/1\. grupla tanış/);
  // 2. grubun tanışması: yalnız o grubun sanatçıları
  await gruplar.nth(1).click();
  await expect(page).toHaveURL(new RegExp(`#/pekistir/bolum/${id}/tanitim-2$`));
  const gec = page.locator('[data-test="konu-tanisma-gec"]');
  await expect(gec).toBeVisible();
  let adim = 0;
  for (; adim < 40 && (await gec.isVisible().catch(() => false)); adim++) {
    await gec.click();
    await expect(page.locator('[data-test="konu-tanisma-gec"].gidiyor')).toHaveCount(0);
  }
  expect(adim).toBeLessThanOrEqual(4);
  await expect(page).toHaveURL(/#\/harita$/);
  const kayit = await page.evaluate((b) => window.__atlas.ilerleme.bolumler[b], id);
  expect(kayit.tanitimGrup).toEqual([1]);
  expect(kayit.tanitim).toBeUndefined();
  // durak penceresi: 2. grup işaretli, başla hâlâ 1. gruba
  await page.locator(`[data-test="harita-durak"][data-bolum="${id}"]`).click();
  await expect(gruplar.nth(1)).toHaveClass(/goruldu/);
  await expect(gruplar.nth(0)).not.toHaveClass(/goruldu/);
  await expect(page.locator('[data-test="harita-basla"]')).toHaveAttribute('href', `#/pekistir/bolum/${id}/tanitim-1`);
});
