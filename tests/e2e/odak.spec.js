// İş 143 (Astra'nın incelemesi): odak verisi (data/gorsel_odak.json) görselleri bekletmez; Atölye'nin arka planı
// ziyaret boyunca sabit, yükleme sırasında sekme değişse de dönünce dolu; basınca küçülme tek kural.
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

const ilerlemeKur = (context) =>
  context.addInitScript(() => {
    if (localStorage.getItem('sanat-atlasi:ilerleme')) return;
    localStorage.setItem('sanat-atlasi:ilerleme', JSON.stringify({ surum: 2, islenen: Array.from({ length: 30 }, (_, i) => i + 1), ayarlar: { tema: 'gece', egim: false }, sonSurum: '9.9.9' }));
  });

test('odak verisi gecikince Galeri ve Atölye görselleri yine hemen görünür; gelince yüze kayar', async ({ page, context }) => {
  await agiHazirla(context);
  await ilerlemeKur(context);
  let birak;
  const bekleyen = new Promise((r) => (birak = r));
  await context.route(/data\/gorsel_odak\.json/, async (r) => {
    await bekleyen;
    await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ surum: 1, odak: {} }) });
  });
  await page.goto('./#/gozat');
  await expect(page.locator('.zaman-fon img').first()).toBeAttached({ timeout: 8000 });
  await page.goto('./#/pekistir');
  await expect(page.locator('.pk-resim img')).toBeAttached({ timeout: 8000 });
  birak();
});

test('odak verisi hiç gelmese de (hata) görseller görünür', async ({ page, context }) => {
  await agiHazirla(context);
  await ilerlemeKur(context);
  await context.route(/data\/gorsel_odak\.json/, (r) => r.fulfill({ status: 500, body: '' }));
  await page.goto('./#/pekistir');
  await expect(page.locator('.pk-resim img')).toBeAttached({ timeout: 8000 });
  await page.goto('./#/gozat');
  await expect(page.locator('.zaman-fon img').first()).toBeAttached({ timeout: 8000 });
});

test('Atölye arka planı hedef değişince aynı kalır; yükleme sürerken sekme değişse de dönünce dolu', async ({ page, context }) => {
  await agiHazirla(context);
  await ilerlemeKur(context);
  await page.goto('./#/pekistir');
  const resim = page.locator('.pk-resim img');
  await expect(resim).toBeAttached({ timeout: 8000 });
  const ilk = await resim.getAttribute('data-yedek'); // eserin kimliği (src keskinleşince büyük kopyaya geçebilir)
  await page.locator('[data-gunluk-hedef="10"]').click();
  await expect(page.locator('[data-gunluk-hedef="10"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.pk-resim img')).toHaveAttribute('data-yedek', ilk);
  // eser listeleri yavaş gelirken başka sekmeye geçilir, sonra Atölye'ye sekmeden dönülür (sayfa belleği)
  await page.goto('./#/');
  await page.evaluate(() => (location.hash = '#/pekistir'));
  await page.evaluate(() => (location.hash = '#/ilerleme'));
  await page.waitForTimeout(1500);
  await page.locator('#sekmeler a[href="#/pekistir"]').click();
  await expect(page.locator('#uygulama .pk-resim img')).toBeAttached({ timeout: 8000 });
});

test('basınca eser kartı yalnız bir kez küçülür (scale 0.965, transform yok)', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/sanatci/giotto-di-bondone');
  const kart = page.locator('.eser').first();
  await kart.waitFor();
  const st = await kart.evaluate((el) => {
    const r = [];
    for (const ss of document.styleSheets)
      for (const k of ss.cssRules || [])
        if (k.selectorText && /:active/.test(k.selectorText) && el.matches(k.selectorText.replace(/:active/g, ''))) r.push([k.style.scale, k.style.transform].join('|'));
    return r;
  });
  expect(st.some((x) => x.includes('scale(') )).toBe(false);
  expect(st.some((x) => x.startsWith('0.965'))).toBe(true);
});
