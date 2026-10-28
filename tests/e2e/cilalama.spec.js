// İş 50: kullanım kolaylığı ve cilalama — dokunma alanları en az 44 pt, harita durakları örtülmez, boş turdan çıkış
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

// Elemanın ortasından yukarı/aşağı yürüyerek gerçekten o elemanı yakalayan dikey boy (görünmez genişletme dahil)
async function dokunmaBoylari(page, secici) {
  return page.evaluate((sec) => {
    const out = [];
    for (const e of document.querySelectorAll(sec)) {
      e.scrollIntoView({ block: 'center' });
      const k = e.getBoundingClientRect();
      if (!k.width) continue;
      const cx = k.left + k.width / 2;
      const cy = k.top + k.height / 2;
      let ust = 0;
      let alt = 0;
      while (ust < 40 && e.contains(document.elementFromPoint(cx, cy - ust - 1))) ust++;
      while (alt < 40 && e.contains(document.elementFromPoint(cx, cy + alt + 1))) alt++;
      out.push(ust + alt + 1);
    }
    return out;
  }, secici);
}

test('dokunma alanları: Göz At sekmeleri, Pekiştir ve İlerleme hapları en az 44 pt; dört sekme ekrana sığar', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/gozat');
  await expect(page.locator('.bolumler a')).toHaveCount(4);
  for (const b of await dokunmaBoylari(page, '.bolumler a')) expect(b).toBeGreaterThanOrEqual(44);
  // "Zaman" sekmesi kenardan kesilmez
  const son = await page.locator('.bolumler a').last().boundingBox();
  expect(son.x + son.width).toBeLessThanOrEqual(390);
  await page.goto('./#/pekistir');
  await expect(page.locator('.secim-hap button').first()).toBeVisible();
  for (const b of await dokunmaBoylari(page, '.secim-hap button')) expect(b).toBeGreaterThanOrEqual(44);
  await page.goto('./#/ilerleme');
  await expect(page.locator('.kucuk-hap button').first()).toBeVisible();
  for (const b of await dokunmaBoylari(page, '.kucuk-hap button')) expect(b).toBeGreaterThanOrEqual(44);
});

test('harita: görünmez saklı motifler durakların ortasını örtmez', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/harita');
  await expect(page.locator('.harita-durak').first()).toBeAttached();
  const ortulen = await page.evaluate(() => {
    const out = [];
    for (const e of document.querySelectorAll('.harita-durak')) {
      e.scrollIntoView({ block: 'center' });
      const k = e.getBoundingClientRect();
      const ust = document.elementFromPoint(k.left + k.width / 2, k.top + k.height / 2);
      if (ust && !e.contains(ust) && ust.closest('.harita-motif')) out.push(e.dataset.bolum);
    }
    return out;
  });
  expect(ortulen).toEqual([]);
});

test('Pekiştir · Hatalarım boşken: başlık tek satır ("Pekiştir" üstte etiket), karışık tura ve Pekiştir’e dönüş düğmesi', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/pekistir/hatalar');
  await expect(page.locator('[data-test="kart-yok"]')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hatalarım');
  await expect(page.locator('.ust .ust-yazi')).toContainText('Pekiştir');
  await page.getByRole('link', { name: 'Karışık tur başlat' }).click();
  await expect(page.locator('[data-test="sanatci-secenekleri"] button')).toHaveCount(4);
});

// İş 51: geri dönünce ve sekmeye dönünce kaydırma yeri
const y = (page) => page.evaluate(() => Math.round(window.scrollY));
const gorunenAkimLinki = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('a[href^="#/akim/"]')]
      .find((a) => {
        const t = a.getBoundingClientRect().top;
        return t > 100 && t < innerHeight - 140;
      })
      .click(),
  );

test('geri düğmesiyle dönünce liste kalınan yerde açılır; ileri gidişte sayfa en baştan', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/gozat');
  await expect(page.locator('a[href^="#/akim/"]').first()).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect.poll(() => y(page)).toBe(900);
  await gorunenAkimLinki(page);
  await expect(page).toHaveURL(/#\/akim\//);
  await expect.poll(() => y(page)).toBe(0);
  await page.locator('.ust .geri, .geri').first().click();
  await expect(page).toHaveURL(/#\/gozat$/);
  await expect.poll(() => y(page)).toBe(900);
});

test('sekme çubuğu: başka sekmeden dönünce kalınan yer; açık sekmeye yeniden dokununca en başa', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/gozat');
  await expect(page.locator('a[href^="#/akim/"]').first()).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect.poll(() => y(page)).toBe(1200);
  await page.locator('#sekmeler a[data-sekme="ilerleme"]').click();
  await expect(page).toHaveURL(/#\/ilerleme$/);
  await page.locator('#sekmeler a[data-sekme="gozat"]').click();
  await expect(page).toHaveURL(/#\/gozat$/);
  await expect.poll(() => y(page)).toBe(1200);
  await page.locator('#sekmeler a[data-sekme="gozat"]').click();
  await expect.poll(() => y(page)).toBe(0);
});

// İş 52: görüntüleyicinin kendi geçmiş kaydı. iPhone'un sol kenardan geri hareketi tarayıcı geçmişinde bir adım
// geri gider (burada page.goBack); sayfa değil görüntüleyici kapanmalı.
test('görüntüleyici: geri hareketi görüntüleyiciyi kapatır, sayfada kalınır; ikinci geri önceki sayfaya', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/gozat');
  await expect(page.locator('a[href^="#/akim/"]').first()).toBeVisible();
  await page.goto('./#/sanatci/giotto-di-bondone');
  await page.locator('.eser').first().click();
  await expect(page.locator('.gor')).toBeVisible();
  await page.goBack();
  await expect(page.locator('.gor')).toHaveCount(0);
  await expect(page).toHaveURL(/#\/sanatci\/giotto-di-bondone$/);
  await page.goBack();
  await expect(page).toHaveURL(/#\/gozat$/);
});

test('görüntüleyici: X ile kapatınca geçmişte fazladan adım kalmaz; "Konu" bağlantısı konu sayfasına geçer, geri sanatçıya döner', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/gozat');
  await expect(page.locator('a[href^="#/akim/"]').first()).toBeVisible();
  await page.goto('./#/sanatci/giotto-di-bondone');
  await page.locator('.eser').first().click();
  await page.locator('.gor').getByRole('button', { name: 'Kapat' }).click();
  await expect(page.locator('.gor')).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/#\/gozat$/);
  // Konu bağlantısı
  await page.goto('./#/sanatci/giotto-di-bondone');
  await page.locator('.eser').first().click();
  const konu = page.locator('[data-test="gor-konu"]');
  await expect(konu).toBeVisible();
  await konu.click();
  await expect(page.locator('.gor')).toHaveCount(0);
  await expect(page).toHaveURL(/#\/konu\//);
  await page.goBack();
  await expect(page).toHaveURL(/#\/sanatci\/giotto-di-bondone$/);
  await expect(page.locator('.gor')).toHaveCount(0);
});
