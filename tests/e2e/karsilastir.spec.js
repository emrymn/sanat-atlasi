import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { agiHazirla } from './ortak.js';

const onbellek = JSON.parse(readFileSync(new URL('../../data/eserler_onbellek.json', import.meta.url), 'utf8'));
const TANIMA = { surum: 1, notlar: { 'j-m-w-turner': 'TEST tanıma: ışık içinde eriyen buğulu sahneler.' } };
// Turner'ın bütün eserlerine aynı test notu (QID ya da "sanatçı|başlık" anahtarıyla)
const ESER = {
  surum: 1,
  notlar: Object.fromEntries(onbellek.sanatcilar['j-m-w-turner'].eserler.map((e) => [e.qid || `j-m-w-turner|${e.baslik}`, 'TEST eser notu.'])),
};

async function dogruSanatci(page) {
  return page.evaluate(async () => {
    while (!window.__atlas || !window.__atlas.oturum || !window.__atlas.oturum.kart) await new Promise((r) => setTimeout(r, 50));
    return window.__atlas.oturum.kart.id;
  });
}

async function notlariVer(context) {
  await context.route(/\/data\/tanima_notlari\.json$/, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(TANIMA) }));
  await context.route(/\/data\/eser_notlari\.json$/, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ESER) }));
}

test('karşılaştırma: iki sütun, Nasıl tanırım notları, dörder eser; görüntüleyicide eser notu', async ({ page, context }) => {
  await agiHazirla(context);
  await notlariVer(context);
  await page.goto('./#/karsilastir/j-m-w-turner/john-constable');
  const a = page.locator('[data-kars="a"]');
  const b = page.locator('[data-kars="b"]');
  await expect(a.locator('.kars-ad')).toContainText('Turner');
  await expect(b.locator('.kars-ad')).toContainText('Constable');
  // Turner kurs sanatçısı: not ek dosyadan; Constable kurs dışı: kendi notu
  await expect(a.locator('[data-test="kars-taninma"]')).toHaveText(TANIMA.notlar['j-m-w-turner']);
  await expect(b.locator('[data-test="kars-taninma"]')).not.toBeEmpty();
  await expect(a.locator('.kars-eser')).toHaveCount(4);
  await expect(b.locator('.kars-eser')).toHaveCount(4);
  // yatay taşma yok
  const tasma = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(tasma).toBeLessThanOrEqual(0);
  await a.locator('.kars-eser').first().click();
  await expect(page.locator('[data-test="eser-notu"]')).toHaveText('TEST eser notu.');
});

test('sanatçı sayfası: ek "Nasıl tanırım?" notu ve Karşılaştır seçicisi', async ({ page, context }) => {
  await agiHazirla(context);
  await notlariVer(context);
  await page.goto('./#/sanatci/j-m-w-turner');
  await expect(page.locator('[data-test="taninma"]')).toHaveText(TANIMA.notlar['j-m-w-turner']);
  const sec = page.locator('[data-test="karsilastir-sec"]');
  await sec.locator('summary').click();
  const ilk = sec.locator('.satir').first();
  await expect(sec.locator('.satir')).not.toHaveCount(0);
  expect(await sec.locator('.satir').count()).toBeLessThanOrEqual(8);
  await ilk.click();
  await expect(page).toHaveURL(/#\/karsilastir\/j-m-w-turner\//);
  await expect(page.locator('[data-test="karsilastirma"]')).toBeVisible();
});

test('pekiştir: yanlış cevaptan sonra Karşılaştır; geri dönünce kart aynı yerden sürer', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/pekistir/karisik');
  await expect(page.locator('[data-test="sanatci-secenekleri"] button')).toHaveCount(4);
  const sayac = await page.locator('[data-test="sayac"]').textContent();
  const dogruId = await dogruSanatci(page);
  await page.locator(`[data-test="sanatci-secenekleri"] button:not([data-sanatci="${dogruId}"])`).first().click();
  const bag = page.locator('[data-test="karsilastir"]');
  await expect(bag).toBeVisible();
  await expect(bag).toContainText('Karşılaştır:');
  await bag.click();
  await expect(page.locator('[data-test="karsilastirma"]')).toBeVisible();
  await expect(page.locator('[data-kars="a"]')).toBeVisible();
  await page.locator('button.geri').click();
  // aynı kart, cevaplanmış haliyle; akım sorusuna geçilebilir
  await expect(page.locator('[data-test="sayac"]')).toHaveText(sayac);
  await expect(page.locator('[data-test="sonuc"]')).toBeVisible();
  await page.locator('[data-ikinci]').click();
  await expect(page.locator('[data-test="akim-secenekleri"] button')).toHaveCount(4);
});

test('doğru cevapta Karşılaştır bağlantısı çıkmaz', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/pekistir/karisik');
  const dogruId = await dogruSanatci(page);
  await page.locator(`[data-test="sanatci-secenekleri"] button[data-sanatci="${dogruId}"]`).click();
  await expect(page.locator('[data-test="sonuc"]')).toBeVisible();
  await expect(page.locator('[data-test="karsilastir"]')).toHaveCount(0);
});

test('not dosyaları yokken uygulama sorunsuz açılır', async ({ page, context }) => {
  await agiHazirla(context);
  await context.route(/\/data\/(tanima|eser)_notlari\.json$/, (r) => r.fulfill({ status: 404, body: '' }));
  await page.goto('./#/sanatci/j-m-w-turner');
  await expect(page.locator('h1')).toContainText('Turner');
  await expect(page.locator('[data-test="taninma"]')).toHaveCount(0);
  await page.goto('./#/karsilastir/j-m-w-turner/john-constable');
  await expect(page.locator('[data-kars="b"] [data-test="kars-taninma"]')).not.toBeEmpty();
});
