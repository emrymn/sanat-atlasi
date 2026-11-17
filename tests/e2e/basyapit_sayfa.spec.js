// İş 188: başyapıt sayfası tek akış — ayrıntı kırpımları metnin içinde, "Yakından bak", cam çubuk, sözlük,
// "Daha derine in" içinde karşılaştırmalar (yan yana) ve sıradaki eser. Gerçek veri: Arnolfini Portresi.
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

const K = 'Q220859';

test('ayrıntılar metnin içinde: tek ayrıntı büyük kırpım, birden çoğu şerit; kırpım kutuyu doldurur', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto(`./#/basyapit/${K}`);
  const sayfa = page.locator('[data-test="basyapit"]');
  await expect(sayfa.locator('h1')).toHaveText(/Arnolfini Portresi/);
  await expect(page.locator('.bsy-desen')).toHaveAttribute('data-donem', 'ronesans');
  const kirpimlar = sayfa.locator('[data-test="bsy-ayrinti"]');
  await expect(kirpimlar).toHaveCount(6);
  // "Tek mum" yalnız "Anlam ve semboller"de geçer: orada, açıklamasıyla büyük kırpım
  const anlam = sayfa.locator('.bsy-bolum', { hasText: 'Anlam ve semboller' });
  await expect(anlam.locator('.bsy-ayrinti figcaption')).toContainText('Tek mum');
  await expect(anlam.locator('.bsy-ayrinti figcaption')).toContainText('Pirinç avizede');
  // köpek, takunyalar ve pencere "Ne görüyoruz?"da: yana kayan şerit
  const gor = sayfa.locator('.bsy-bolum', { hasText: 'Ne görüyoruz?' });
  await expect(gor.locator('[data-test="bsy-serit"] [data-test="bsy-ayrinti"]')).toHaveCount(3);
  // her kırpımda resim kutuyu boşluksuz kaplar
  await kirpimlar.first().locator('img').evaluate((img) => img.decode());
  const tasma = await sayfa.locator('.bsy-kirp').evaluateAll((kutular) =>
    kutular.map((k) => {
      const a = k.getBoundingClientRect();
      const b = k.querySelector('img').getBoundingClientRect();
      return b.left <= a.left + 1 && b.top <= a.top + 1 && b.right >= a.right - 1 && b.bottom >= a.bottom - 1;
    }),
  );
  expect(tasma.length).toBe(6);
  expect(tasma.every(Boolean)).toBe(true);
  // eski "Yakından bak" listesi, ayrıntı kaydı varken görünmez
  await expect(sayfa.locator('[data-bsy-bak]')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
});

test('kırpıma dokununca görüntüleyici o ayrıntıda açılır; "Yakından bak" genel bakışla başlar', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto(`./#/basyapit/${K}`);
  const mum = page.locator('.bsy-ayrinti [data-test="bsy-ayrinti"]').first();
  await expect(mum).toBeVisible();
  const sira = Number(await mum.getAttribute('data-bsy-nokta'));
  await mum.click();
  const gor = page.locator('.gor');
  await expect(gor).toHaveClass(/inceleme/);
  await expect(page.locator('[data-test="gor-inc-no"]')).toHaveText(`${sira + 1} / 6`);
  await expect(page.locator('[data-test="gor-inc-ad"]')).toHaveText('Tek mum');
  await gor.getByRole('button', { name: 'Kapat' }).click();
  await expect(gor).toHaveCount(0);
  const hap = page.locator('[data-test="basyapit-incele"]');
  await expect(hap).toContainText('6 ayrıntı');
  expect((await hap.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await hap.click();
  await expect(page.locator('[data-test="gor-inc-no"]')).toHaveText('6 ayrıntı');
});

test('cam çubuk başlık kaybolunca belirir; koleksiyon kalbi işaretler; sıradaki esere geçilir', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto(`./#/basyapit/${K}`);
  const cubuk = page.locator('[data-bsy-cubuk]');
  await expect(page.locator('[data-basyapit-gorsel] img')).toBeAttached();
  await expect(cubuk).not.toHaveClass(/acik/);
  const kalp = page.locator('[data-bsy-kalp]');
  await expect(kalp).toHaveAttribute('aria-pressed', 'false');
  await kalp.click();
  await expect(kalp).toHaveAttribute('aria-pressed', 'true');
  const sira = page.locator('[data-test="bsy-siradaki"]');
  await sira.scrollIntoViewIfNeeded();
  await expect(cubuk).toHaveClass(/acik/);
  await expect(cubuk).toContainText('Arnolfini Portresi');
  const ad = await sira.locator('b').textContent();
  await sira.click();
  await expect(page.locator('[data-test="basyapit"] h1')).toHaveText(ad);
});

test('daha derine in: karşılaştırma kartı yan yana açılır; sözlük terimi kart açar', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto(`./#/basyapit/${K}`);
  await page.locator('[data-test="basyapit-ders"]').click();
  const metin = page.locator('[data-test="ders-metni"]');
  await expect(metin).toBeVisible();
  // karşılaştırmalar: uygulamada başyapıt kaydı olan (Mérode Triptiği) görselli ve dokunulur; olmayan düz kart
  const kiyaslar = metin.locator('[data-test="bsy-kiyaslar"]');
  await expect(kiyaslar.locator('.bsy-kiyas')).toHaveCount(2);
  const merode = kiyaslar.locator('[data-test="bsy-kiyas"]');
  await expect(merode).toHaveCount(1);
  await expect(merode).toContainText('Mérode Triptiği');
  await expect(merode.locator('img')).toBeAttached();
  await merode.click();
  const yan = page.locator('[data-test="bsy-yan"]');
  await expect(yan).toBeVisible();
  await expect(yan.locator('.bsy-yan-resim img')).toHaveCount(2);
  await expect(yan.locator('.bsy-yan-kart')).toContainText('Mérode Triptiği');
  await yan.getByRole('button', { name: 'Kapat' }).click();
  await expect(yan).toHaveCount(0);
  // sözlük: ilk işaretli terim
  const terim = page.locator('.bsy-terim').first();
  await expect(terim).toBeVisible();
  await terim.click();
  const kart = page.locator('[data-bsy-sozcuk]');
  await expect(kart).toBeVisible();
  await expect(kart.locator('[data-bsy-sozcuk-tanim]')).not.toHaveText('');
  await expect(page.locator('[data-test="basyapit-incele"]')).toBeHidden();
  await kart.getByRole('button', { name: 'Kapat' }).click();
  await expect(kart).toBeHidden();
  await expect(page.locator('[data-test="basyapit-incele"]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
});
