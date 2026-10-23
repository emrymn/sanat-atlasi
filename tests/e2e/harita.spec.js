// Yolculuk haritası (İş 23)
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

const hazir = (page) => page.waitForFunction(() => window.__atlas && window.__atlas.ilerleme && window.__atlas.akimlar.length);

test('İlerleme → harita: her akım bir durak, açık ve kilitli duraklar, küçük pencere', async ({ page, context }) => {
  await agiHazirla(context);
  const resimler = [];
  page.on('response', (r) => {
    if (r.url().includes('/gorseller/harita/')) resimler.push(r.status());
  });
  await page.goto('./#/ilerleme');
  await hazir(page);
  const bag = page.locator('[data-test="harita-bag"]');
  await expect(bag).toContainText('Yolculuk haritası');
  await bag.click();
  await expect(page).toHaveURL(/#\/harita$/);
  const akimSayisi = await page.evaluate(() => window.__atlas.akimlar.length);
  await expect(page.locator('[data-test="harita-durak"]')).toHaveCount(akimSayisi);
  expect(await page.locator('[data-test="harita-bolge"]').count()).toBeGreaterThanOrEqual(6);
  // Orta Çağ en altta, Modern en üstte
  const bolgeler = await page.locator('[data-test="harita-bolge"]').evaluateAll((l) => l.map((x) => x.dataset.bolge));
  expect(bolgeler[0]).toBe('modern');
  expect(bolgeler[bolgeler.length - 1]).toBe('ortacag');
  // açık durak sayısı Göz At'taki açık akımlarla aynı
  const acik = await page.evaluate(() => {
    const d = window.__atlas;
    const k = new Set(d.ilerleme.islenen);
    return d.akimlar.filter((a) => d.sanatcilar.some((s) => s.akim === a.ad && k.has(s.konu))).length;
  });
  await expect(page.locator('[data-test="harita-durak"][data-acik="true"]')).toHaveCount(acik);
  await expect(page.locator('.harita-durak.simdiki')).toHaveCount(acik ? 1 : 0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);

  // açık durak: pencere, "Tura başla" dönemin turuna gider
  const ilkAcik = page.locator('[data-test="harita-durak"][data-acik="true"]').first();
  const ad = await ilkAcik.getAttribute('data-akim');
  await ilkAcik.scrollIntoViewIfNeeded();
  await ilkAcik.click();
  const pencere = page.locator('[data-harita-pencere]');
  await expect(pencere).toBeVisible();
  await expect(pencere.locator('h2')).toHaveText(ad);
  await expect(pencere.locator('[data-test="harita-tur"]')).toHaveAttribute('href', `#/pekistir/donem/${encodeURIComponent(ad)}`);
  await expect(pencere.locator('[data-test="harita-akim"]')).toHaveAttribute('href', `#/akim/${encodeURIComponent(ad)}`);
  await page.keyboard.press('Escape');
  await expect(pencere).toBeHidden();

  // kilitli durak: hangi konuda açılacağı ve İlerleme bağlantısı
  const kilitli = page.locator('[data-test="harita-durak"][data-acik="false"]').first();
  await kilitli.scrollIntoViewIfNeeded();
  await kilitli.click();
  await expect(pencere).toBeVisible();
  await expect(pencere).toContainText('işlenince açılır');
  await expect(pencere.locator('[data-test="harita-ilerleme"]')).toBeVisible();
  await pencere.getByRole('button', { name: 'Kapat' }).click();
  await expect(pencere).toBeHidden();

  // görülen duraklar kaydedilir (sonraki açılışta "yeni" hareketi yalnızca yeni açılanlarda)
  const gorulen = await page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme')).haritaGorulen);
  expect(gorulen.length).toBe(acik);
  expect(resimler.length).toBeGreaterThan(0);
  expect(resimler.every((s) => s === 200 || s === 304)).toBe(true);
});

test('harita: bir konu işlenince yeni durak açılır ve "yeni" olarak gelir', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/harita');
  await hazir(page);
  await expect(page.locator('[data-test="harita-durak"]').first()).toBeVisible();
  const once = await page.locator('[data-test="harita-durak"][data-acik="true"]').count();
  // kursta bir sonraki, kilitli bir akımı açan konuyu işle
  const no = await page.evaluate(() => {
    const d = window.__atlas;
    const k = new Set(d.ilerleme.islenen);
    const kilitli = d.akimlar.find((a) => !d.sanatcilar.some((s) => s.akim === a.ad && k.has(s.konu)));
    const konu = Math.min(...d.sanatcilar.filter((s) => s.akim === kilitli.ad).map((s) => s.konu));
    d.ilerleme.islenen = [...d.ilerleme.islenen, konu];
    localStorage.setItem('sanat-atlasi:ilerleme', JSON.stringify(d.ilerleme));
    return konu;
  });
  expect(no).toBeGreaterThan(0);
  await page.reload();
  await hazir(page);
  // konu birden fazla akımın sanatçısını açabilir
  await expect(page.locator('.harita-durak.yeni').first()).toBeVisible();
  const sonra = await page.locator('[data-test="harita-durak"][data-acik="true"]').count();
  expect(sonra).toBeGreaterThan(once);
  await expect(page.locator('.harita-durak.yeni')).toHaveCount(sonra - once);
});
