import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { agiHazirla } from './ortak.js';

const ob = JSON.parse(readFileSync(new URL('../../data/eserler_onbellek.json', import.meta.url), 'utf8'));
const t = ob.sanatcilar['j-m-w-turner'].eserler.slice(0, 2);
const anahtar = (e, sid) => e.qid || `${sid}|${e.baslik}`;
const VERI = {
  surum: 1,
  konular: [
    {
      id: 'test-konu',
      ad: 'TEST Konusu',
      ozgun: 'Test Subject',
      tur: 'mitoloji',
      ozet: 'TEST özet.',
      kaynak: 'Ovidius, Dönüşümler',
      hikaye: ['TEST paragraf bir.', 'TEST paragraf iki.'],
      tanima: ['TEST işaret.'],
      eserler: t.map((e) => [anahtar(e, 'j-m-w-turner'), 'j-m-w-turner']),
    },
  ],
};

test('konular: Göz At → liste → konu sayfası; eserler yan yana; görüntüleyicide Konu bağlantısı', async ({ page, context }) => {
  await agiHazirla(context);
  await context.route(/\/data\/ikonografi\.json$/, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(VERI) }));
  await page.goto('./#/gozat');
  await page.locator('[data-test="konu-giris"]').click();
  await expect(page.locator('[data-test="konu-listesi"]')).toContainText('TEST Konusu');
  await expect(page.getByRole('heading', { name: 'Mitoloji' })).toBeVisible();
  await page.locator('[data-test="konu-listesi"] a').first().click();
  const k = page.locator('[data-test="konu"]');
  await expect(k.locator('h1')).toHaveText('TEST Konusu');
  await expect(k).toContainText('TEST paragraf iki.');
  await expect(k).toContainText('TEST işaret.');
  await expect(k.locator('[data-konu-eser]')).toHaveCount(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  // sanatçı sayfasında bir eseri aç → Konu bağlantısı → konu sayfası
  await page.goto('./#/sanatci/j-m-w-turner');
  await page.locator('[data-eser]').first().click();
  const bag = page.locator('[data-test="gor-konu"]');
  await expect(bag).toHaveText('Konu: TEST Konusu →');
  await bag.click();
  await expect(page.locator('.gor')).toHaveCount(0);
  await expect(page.locator('[data-test="konu"] h1')).toHaveText('TEST Konusu');
});

test('konu verisi yoksa boş mesaj', async ({ page, context }) => {
  await agiHazirla(context);
  await context.route(/\/data\/ikonografi\.json$/, (r) => r.fulfill({ status: 404, body: '' }));
  await page.goto('./#/konular');
  await expect(page.getByText('Henüz konu yok.')).toBeVisible();
});
