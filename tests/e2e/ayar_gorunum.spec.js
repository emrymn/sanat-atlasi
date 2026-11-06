// İş 144–150: Tuval yüz odağı, hareket ve yazı seçimi, elle odak
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { agiHazirla, ilerleme } from './ortak.js';

const kur = (context, ayarlar = {}, ek = {}) =>
  context.addInitScript(
    ([a, e]) => {
      if (localStorage.getItem('sanat-atlasi:ilerleme')) return;
      localStorage.setItem('sanat-atlasi:ilerleme', JSON.stringify({ surum: 2, islenen: Array.from({ length: 30 }, (_, i) => i + 1), ayarlar: { tema: 'gece', egim: false, ...a }, sonSurum: '9.9.9', ...e }));
    },
    [ayarlar, ek],
  );

test('İş 148/149: hareket ve yazı boyutu Ayarlar’dan seçilir, html’e yazılır ve kaydedilir', async ({ page, context }) => {
  await agiHazirla(context);
  await kur(context);
  await page.goto('./#/ayarlar');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-hareket', 'tam');
  await expect(html).toHaveAttribute('data-yazi', 'standart');
  const okuma = async () => page.evaluate(() => getComputedStyle(document.body).fontSize);
  expect(await okuma()).toBe('16px');
  await page.getByRole('radio', { name: 'Büyük' }).check();
  await expect(html).toHaveAttribute('data-yazi', 'buyuk');
  expect(await okuma()).toBe('17px');
  await page.getByRole('radio', { name: 'Sade' }).check();
  await expect(html).toHaveAttribute('data-hareket', 'sade');
  await page.getByRole('radio', { name: 'Kapalı' }).check();
  await expect(html).toHaveAttribute('data-hareket', 'kapali');
  const a = (await ilerleme(page)).ayarlar;
  expect([a.hareket, a.yazi]).toEqual(['kapali', 'buyuk']);
  // Sade: sürekli dönen süs hareketleri bir kez oynar
  await page.getByRole('radio', { name: 'Sade' }).check();
  await page.goto('./#/pekistir');
  const kart = page.locator('.pk-kart').first();
  await kart.waitFor();
  expect(await kart.evaluate((e) => getComputedStyle(e).animationIterationCount)).not.toContain('infinite');
});

test('İş 144: Tuval’in tablosu yüz odağına göre kaydırılır', async ({ page, context }) => {
  await agiHazirla(context);
  await kur(context);
  // bütün görsellerde odak sağ alt köşede: tablo o yöne kaymalı. Veri diskten (istek yakalanıp sunucudan yeniden
  // indirilince service worker'lı CI'da takılıyordu)
  const yerel = JSON.parse(readFileSync(new URL('../../data/yerel_gorseller.json', import.meta.url), 'utf8')).gorseller;
  const odak = Object.fromEntries(Object.values(yerel).map((ad) => [ad, [95, 95]]));
  await context.route(/data\/gorsel_odak\.json/, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ surum: 1, odak }) }));
  await page.goto('./');
  const img = page.locator('[data-gunun-gorsel] > img');
  await expect(img).toHaveAttribute('style', /object-position: -?[\d.]+px -?[\d.]+px/, { timeout: 10000 });
});

test('İş 150: geliştirici modunda görüntüleyicide odak işaretlenir, Ayarlar’da listelenir', async ({ page, context }) => {
  await agiHazirla(context);
  await kur(context, {}, { gelistirici: { tarih: '2026-11-05', yedek: { surum: 2, islenen: [1], ayarlar: {} } } });
  await page.goto('./#/sanatci/giotto-di-bondone');
  await page.locator('.eser').first().click();
  const dugme = page.locator('[data-gor-odak]');
  await expect(dugme).toBeVisible();
  await dugme.click();
  await expect(page.locator('.gor-mesaj')).toContainText('dokun');
  const r = await page.locator('.gor-resim').boundingBox();
  await page.mouse.click(r.x + r.width * 0.25, r.y + r.height * 0.2);
  await expect(page.locator('.gor-mesaj')).toContainText('Odak kaydedildi');
  const kayit = await page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:odak-elle') || '{}'));
  const [o] = Object.values(kayit);
  expect(Math.abs(o[0] - 25)).toBeLessThan(4);
  expect(Math.abs(o[1] - 20)).toBeLessThan(4);
  await page.goto('./#/ayarlar');
  await expect(page.locator('[data-test="elle-odak"] textarea')).toHaveValue(/"odak":\{"[0-9a-f]+":\[2\d,[12]\d\]\}/);
});

test('İş 150/159: geliştirici modu kapalıyken odak düğmesi yalnız günün resminde', async ({ page, context }) => {
  await agiHazirla(context);
  await kur(context);
  await page.goto('./#/sanatci/giotto-di-bondone');
  await page.locator('.eser').first().click();
  await expect(page.locator('.gor-resim')).toBeVisible();
  await expect(page.locator('[data-gor-odak]')).toBeHidden();
  // İş 159: eser günün resmi seçilince odak düğmesi geliştirici modu olmadan da çıkar (Tuval kırpması için)
  await page.locator('[data-test="gor-gunun"]').click();
  await expect(page.locator('[data-gor-odak]')).toBeVisible();
  await page.locator('[data-test="gor-gunun"]').click();
  await expect(page.locator('[data-gor-odak]')).toBeHidden();
});

// İş 157: görüntüleyicide "Günün resmi" → Tuval'de o sanatçının tablosu o olur; Ayarlar'da kopyalanacak liste
test('İş 157: görüntüleyicide seçilen eser sanatçının günün resmi olur, Ayarlar’da listelenir', async ({ page, context }) => {
  await agiHazirla(context);
  // otomatik seçim sınanır: depodaki elle seçilen günün resimleri (İş 159) devre dışı
  await context.route(/data\/gunun_resimleri\.json/, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"surum":1,"secim":{}}' }));
  await kur(context);
  await page.goto('./#/ayarlar');
  await page.locator('#sekmeler a').first().waitFor();
  await page.evaluate(async () => {
    const { bugun, kaydet } = await import('./js/ekranlar/ortak.js');
    window.__atlas.ilerleme.gununDegisim = { tarih: bugun(), id: 'leonardo-da-vinci' };
    kaydet();
  });
  await page.goto('./');
  const tuval = page.locator('[data-gunun-gorsel] > img');
  await expect(tuval).toHaveAttribute('alt', /Mona Lisa/, { timeout: 10000 });
  await page.goto('./#/sanatci/leonardo-da-vinci');
  // Mona Lisa olmayan bir eser seç
  const eser = page.locator('.eser').filter({ hasNot: page.locator('img[alt*="Mona Lisa"]') }).first();
  const baslik = (await eser.locator('img').getAttribute('alt')).split(',').pop().trim();
  await eser.click();
  const dugme = page.locator('[data-test="gor-gunun"]');
  await expect(dugme).toBeVisible();
  await expect(dugme).toHaveAttribute('aria-pressed', 'false');
  await dugme.click();
  await expect(dugme).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.gor-mesaj')).toContainText('günün resmi bu oldu');
  const kayit = await page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:gunun-resmi')));
  expect(Object.keys(kayit)).toEqual(['leonardo-da-vinci']);
  await page.goto('./');
  await expect(tuval).toHaveAttribute('alt', new RegExp(baslik.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 20)), { timeout: 10000 });
  await page.goto('./#/ayarlar');
  await expect(page.locator('[data-test="gunun-resimleri"] textarea')).toHaveValue(/"secim":\{"leonardo-da-vinci":"[qc]:/);
  // kaldırınca otomatiğe döner
  await page.goto('./#/sanatci/leonardo-da-vinci');
  await eser.click();
  await page.locator('[data-test="gor-gunun"]').click();
  await expect(page.locator('[data-test="gor-gunun"]')).toHaveAttribute('aria-pressed', 'false');
  await page.goto('./');
  await expect(tuval).toHaveAttribute('alt', /Mona Lisa/, { timeout: 10000 });
});
