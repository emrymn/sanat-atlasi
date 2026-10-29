import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { agiHazirla } from './ortak.js';

const onbellek = JSON.parse(readFileSync(new URL('../../data/eserler_onbellek.json', import.meta.url), 'utf8'));
const ilk = onbellek.sanatcilar['j-m-w-turner'].eserler[0];
const K = ilk.qid || `j-m-w-turner|${ilk.baslik}`;
const VERI = {
  surum: 1,
  eserler: [
    {
      anahtar: K,
      sanatci: 'j-m-w-turner',
      baslik: 'TEST Başyapıt',
      ozgun: ilk.baslik,
      tarih: '1840',
      muze: 'TEST Müzesi',
      ozet: 'TEST özet cümlesi.',
      bolumler: [
        { baslik: 'Ne görüyoruz?', metin: 'TEST görünen.' },
        { baslik: 'Neden önemli?', metin: 'TEST önem.' },
      ],
      bak: ['Sol üstteki ışık.'],
    },
  ],
};

test('başyapıt: Göz At → liste → okuma; görsel ve ayrıntılar; sanatçı sayfasında bağlantı', async ({ page, context }) => {
  await agiHazirla(context);
  await context.route(/\/data\/basyapitlar\.json(\?.*)?$/, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(VERI) }));
  await page.goto('./#/gozat');
  await page.locator('[data-test="basyapit-giris"]').click();
  const liste = page.locator('[data-test="basyapit-listesi"]');
  await expect(liste).toContainText('TEST Başyapıt');
  await expect(liste.locator('[data-basyapit-kucuk] img')).toHaveCount(1);
  await liste.locator('a').first().click();
  const b = page.locator('[data-test="basyapit"]');
  await expect(b.locator('h1')).toHaveText('TEST Başyapıt');
  await expect(b).toContainText('TEST görünen.');
  await expect(b.locator('[data-basyapit-gorsel] img')).toBeAttached();
  await expect(b).toContainText('Sol üstteki ışık.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  await b.locator('[data-basyapit-buyut]').click();
  await expect(page.locator('.gor')).toBeVisible();
  await page.locator('.gor').getByRole('button', { name: 'Kapat' }).click();
  await page.goto('./#/sanatci/j-m-w-turner');
  await expect(page.locator('[data-test="basyapit-bag"]')).toContainText('TEST Başyapıt');
});

test('başyapıt verisi yoksa liste boş mesajı, sayfa hata vermez', async ({ page, context }) => {
  await agiHazirla(context);
  await context.route(/\/data\/basyapitlar\.json(\?.*)?$/, (r) => r.fulfill({ status: 404, body: '' }));
  await page.goto('./#/basyapitlar');
  await expect(page.getByText('Henüz yakın okuma yok.')).toBeVisible();
});
