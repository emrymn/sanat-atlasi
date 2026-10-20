// 390×844 (iPhone 13) ekran görüntüleri: tasarim-A mockup'larıyla karşılaştırmak için.
// Çıktı: test-results/ekran/<ekran>.png. Varsayılan olarak ağ fikstürleriyle (tek örnek görsel) çalışır;
// EKRAN_GERCEK=1 ile gerçek görseller ve yazı tipleri yüklenir (vekil sunucu HTTPS_PROXY'den alınır).
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

const GERCEK = process.env.EKRAN_GERCEK === '1';
const DIZIN = 'test-results/ekran/';

if (GERCEK && process.env.HTTPS_PROXY) test.use({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' }, serviceWorkers: 'block' });

test.beforeEach(async ({ context }) => {
  if (!GERCEK) await agiHazirla(context);
  // Mockup'taki duruma yakın: kursun 46. konusuna kadar işlenmiş, son çalışılan dört sanatçı
  await context.addInitScript(() => {
    if (localStorage.getItem('sanat-atlasi:ilerleme')) return;
    localStorage.setItem(
      'sanat-atlasi:ilerleme',
      JSON.stringify({
        surum: 2,
        islenen: Array.from({ length: 46 }, (_, i) => i + 1),
        ayarlar: { gunlukKart: 20, tema: 'gece' },
        sonCalisilanlar: ['caravaggio', 'rembrandt-van-rijn', 'diego-velazquez', 'j-m-w-turner'],
      }),
    );
  });
});

test.setTimeout(GERCEK ? 240_000 : 60_000);

async function bekle(page) {
  await page.waitForLoadState('networkidle', { timeout: GERCEK ? 20_000 : 5_000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(GERCEK ? 1200 : 300);
}

async function al(page, ad, tam = false) {
  await page.screenshot({ path: `${DIZIN}${ad}.png`, fullPage: tam });
}

test('ekran görüntüleri: Bugün, Sanatçı, Pekiştir ve çizilmemiş ekranlar', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-test="gunun-kart"]')).toBeVisible();
  await expect(page.locator('[data-palet] .palet span').first()).toBeAttached({ timeout: 20_000 });
  await bekle(page);
  await al(page, 'bugun');
  await al(page, 'bugun-tam', true);

  await page.goto('./#/sanatci/rembrandt-van-rijn');
  await expect(page.locator('.eser').first()).toBeVisible();
  await bekle(page);
  await al(page, 'sanatci');
  await al(page, 'sanatci-tam', true);
  await page.locator('[data-test="tumu"]').click();
  await expect(page.locator('.izgara .eser').first()).toBeVisible();
  await bekle(page);
  await al(page, 'tum-eserler');

  await page.goto('./#/pekistir/karisik');
  const secenekler = page.locator('[data-test="sanatci-secenekleri"] button');
  await expect(secenekler).toHaveCount(4);
  await bekle(page);
  await al(page, 'pekistir-soru1');
  await secenekler.first().click();
  await expect(page.locator('.alt-yaprak')).toBeVisible();
  await page.waitForTimeout(800);
  await al(page, 'pekistir-cevap1');
  await page.locator('[data-ikinci]').click();
  await page.locator('[data-test="akim-secenekleri"] button').nth(1).click();
  await page.waitForTimeout(300);
  await al(page, 'pekistir-cevap2');

  for (const [ad, rota] of [
    ['gunun', './#/gunun'],
    ['gozat', './#/gozat'],
    ['akim', './#/akim/Hollanda%20Alt%C4%B1n%20%C3%87a%C4%9F%C4%B1'],
    ['pekistir-menu', './#/pekistir'],
    ['ilerleme', './#/ilerleme'],
    ['ayarlar', './#/ayarlar'],
  ]) {
    await page.goto(rota);
    await bekle(page);
    await al(page, ad);
  }

  await page.goto('./#/sanatci/rembrandt-van-rijn');
  await page.locator('.eser').first().click();
  await expect(page.locator('.gor')).toBeVisible();
  await bekle(page);
  await al(page, 'goruntuleyici');

  // Sepya ve Açık: aynı yerleşim
  for (const tema of ['sepya', 'acik']) {
    await page.evaluate((t) => {
      const i = JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme'));
      i.ayarlar.tema = t;
      localStorage.setItem('sanat-atlasi:ilerleme', JSON.stringify(i));
    }, tema);
    await page.goto('./');
    await page.reload();
    await bekle(page);
    await al(page, `bugun-${tema}`);
  }
});
