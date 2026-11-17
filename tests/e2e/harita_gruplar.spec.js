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
  // 1.89 G2: tanışma satırları (her grubun başında küçük bir eser) ve Kolay / Orta / Zor; ayrı yüz şeridi yok
  await expect(page.locator('[data-test="hp-tanis"]')).toBeVisible();
  await expect(page.locator('[data-test="hp-sinav"] [data-test="harita-seviye"]')).toHaveCount(3);
  await expect(page.locator('.harita-pencere-ic .harita-pencere-sanatcilar')).toHaveCount(0);
  await expect(gruplar.nth(0).locator('.hp2-kucuk')).toHaveCount(1);
  // 2. grup: tanışma (yalnız o grubun sanatçıları), ardından yalnız onları soran kısa tur (kişi başı 2 soru)
  await gruplar.nth(1).click();
  await expect(page).toHaveURL(new RegExp(`#/pekistir/bolum/${id}/tanitim-2$`));
  const gec = page.locator('[data-test="konu-tanisma-gec"]');
  await expect(gec).toBeVisible();
  const tanisilan = new Set();
  for (let adim = 0; adim < 40 && (await gec.isVisible().catch(() => false)); adim++) {
    tanisilan.add(await page.evaluate(() => { const o = window.__atlas.oturum; return o.tanisma.sira[o.tanisma.konum]; }));
    await gec.click();
    await expect(page.locator('[data-test="konu-tanisma-gec"].gidiyor')).toHaveCount(0);
  }
  expect(tanisilan.size).toBeGreaterThanOrEqual(3);
  expect(tanisilan.size).toBeLessThanOrEqual(4);
  // tanışma bitti ama sorular bitmeden grup tamam sayılmaz
  expect(await page.evaluate((b) => window.__atlas.ilerleme.bolumler[b]?.tanitimGrup, id)).toBeUndefined();
  const soru = tanisilan.size * 2;
  for (let i = 0; i < soru; i++) {
    const dogru = await page.evaluate(async (j) => {
      const d = window.__atlas;
      while (!d.oturum || !d.oturum.kart || d.oturum.kart.konum !== j || !document.querySelector('[data-test="sanatci-secenekleri"]')) await new Promise((r) => setTimeout(r, 50));
      return d.oturum.kart.id;
    }, i);
    expect(tanisilan.has(dogru)).toBe(true);
    await page.locator(`[data-test="sanatci-secenekleri"] button[data-sanatci="${dogru}"]`).click();
    await page.locator('[data-sonraki]').click();
  }
  const ozet = page.locator('[data-test="grup-ozet"]');
  await expect(ozet).toBeVisible();
  await expect(ozet).toContainText(`${soru} / ${soru}`);
  await expect(page.locator('[data-test="grup-sonraki"]')).toHaveAttribute('href', `#/pekistir/bolum/${id}/tanitim-1`);
  const kayit = await page.evaluate((b) => window.__atlas.ilerleme.bolumler[b], id);
  expect(kayit.tanitimGrup).toEqual([1]);
  expect(kayit.tanitim).toBeUndefined();
  expect(kayit.kolay).toBeUndefined(); // grup turu yıldız vermez
  // durak penceresi: 2. grup işaretli, başla hâlâ 1. gruba
  await page.locator('[data-test="grup-haritaya"]').click();
  await expect(page).toHaveURL(/#\/harita$/);
  await page.locator(`[data-test="harita-durak"][data-bolum="${id}"]`).click();
  const gruplar2 = page.locator('[data-test="harita-tanitim-grup"]');
  await expect(gruplar2.nth(1).locator('xpath=..')).toHaveClass(/goruldu/);
  await expect(gruplar2.nth(0).locator('xpath=..')).not.toHaveClass(/goruldu/);
  await expect(page.locator('[data-test="harita-basla"]')).toHaveAttribute('href', `#/pekistir/bolum/${id}/tanitim-1`);
});
