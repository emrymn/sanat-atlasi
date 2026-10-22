import { test, expect } from '@playwright/test';
import { agiHazirla, ilerleme } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

async function simdikiKart(page) {
  return page.evaluate(async () => {
    while (!window.__atlas || !window.__atlas.oturum || !window.__atlas.oturum.kart) await new Promise((r) => setTimeout(r, 50));
    const d = window.__atlas;
    return { id: d.oturum.kart.id, akim: d.harita.get(d.oturum.kart.id).akim };
  });
}

// Yarım kalan turu Pekiştir menüsündeki devam kartından bitir
async function yarimiBitir(page) {
  await page.goto('./#/pekistir');
  await expect(page.getByRole('heading', { name: 'Pekiştir' })).toBeVisible();
  const bitir = page.locator('[data-yarim-bitir]');
  if (await bitir.count()) await bitir.click();
  await expect(page.locator('[data-test="devam-kart"]')).toHaveCount(0);
}

// Bütün dönemlerin seviye kaydını ayarla
async function seviyeleriAyarla(page, kayit) {
  await page.waitForFunction(() => localStorage.getItem('sanat-atlasi:ilerleme'));
  await page.evaluate((kayit) => {
    const d = window.__atlas;
    const i = JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme'));
    i.seviyeler = {};
    for (const a of d.akimlar) i.seviyeler[a.ad] = kayit;
    localStorage.setItem('sanat-atlasi:ilerleme', JSON.stringify(i));
  }, kayit);
  await page.reload();
}

test('seviyeler dönem başına: Kolay’da %80 olunca dönem Orta’ya geçer', async ({ page }) => {
  await page.goto('./#/pekistir/donem');
  await expect(page.locator('[data-test="seviye-rozet"]').first()).toContainText('Kolay · 0/5');
  await expect(page.getByText(/Her dönem Kolay'dan başlar/)).toBeVisible();

  // Her dönem Kolay'da 4 doğru cevaplı: bir doğru daha → 5/5 → Orta
  await seviyeleriAyarla(page, { s: 0, son: [1, 1, 1, 1] });
  await page.goto('./#/pekistir/donem/hepsi');
  await expect(page.getByText(/Soru 1 \/ 1 · Kolay/)).toBeVisible();
  const { id, akim } = await simdikiKart(page);
  await page.locator(`[data-test="sanatci-secenekleri"] button[data-sanatci="${id}"]`).click();
  await expect(page.locator('[data-test="seviye-gecti"]')).toContainText(`${akim} Orta seviyeye geçti`);
  expect((await ilerleme(page)).seviyeler[akim]).toEqual({ s: 1, son: [] });

  // Aynı dönemin sanatçıları artık Orta'da: şıklarda dönemin kendisinden kimse yok
  await yarimiBitir(page);
  await page.goto(`./#/pekistir/donem/${encodeURIComponent(akim)}`);
  await expect(page.getByText(/Soru 1 \/ 1 · Orta/)).toBeVisible();
  const akimlar = await page.evaluate(() => {
    const d = window.__atlas;
    return d.oturum.kart.secenekler.map((x) => d.harita.get(x).akim);
  });
  expect(akimlar.filter((a) => a === akim)).toHaveLength(1);
  // Pekiştir menüsünde dönemin rozeti Orta
  await yarimiBitir(page);
  await page.goto('./#/pekistir/donem');
  await expect(page.locator(`a[href="#/pekistir/donem/${encodeURIComponent(akim)}"] [data-test="seviye-rozet"]`)).toContainText('Orta');
});

test('seviyeler: yanlış cevapta dönem seviye atlamaz; ilerleme satırı görünür', async ({ page }) => {
  await page.goto('./#/');
  await expect(page.getByRole('heading', { name: 'Sanat Atlası' })).toBeAttached();
  await seviyeleriAyarla(page, { s: 0, son: [1, 1, 1, 0] });
  await page.goto('./#/pekistir/donem/hepsi');
  const { id, akim } = await simdikiKart(page);
  await page.locator(`[data-test="sanatci-secenekleri"] button:not([data-sanatci="${id}"])`).first().click();
  await expect(page.locator('[data-test="seviye"]')).toContainText(`${akim} · Kolay · son 5 cevapta 3 doğru · Orta için %80`);
  expect((await ilerleme(page)).seviyeler[akim].s).toBe(0);
  // sanatçı sayfasında dönemin seviyesi
  await yarimiBitir(page);
  await page.goto(`./#/sanatci/${encodeURIComponent(id)}`);
  await expect(page.locator('[data-test="sanatci-seviye"]')).toContainText(`${akim} dönemi: Kolay`);
  // İlerleme ekranında dönem satırlarında seviye
  await page.goto('./#/ilerleme');
  await expect(page.locator('[data-test="seviye-ozet"]').first()).toContainText('Kolay');
});
