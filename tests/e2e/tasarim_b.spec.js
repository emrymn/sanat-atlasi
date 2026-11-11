// İş 171 (Tasarım B, Fable): soru ve cevap ekranlarının yeni görünümü
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

test('soru: parça parça ilerleme, şıklar başparmak bölgesinde ve en az 56 px; cevapta Leitner kutuları altı nokta', async ({ page }) => {
  await page.goto('./#/pekistir/karisik');
  const sayac = await page.locator('[data-test="sayac"]').textContent();
  const toplam = Number(sayac.split('/')[1]);
  // her kart bir parça; şimdiki işaretli
  await expect(page.locator('.ince-cubuk.parcali span')).toHaveCount(toplam);
  await expect(page.locator('.ince-cubuk.parcali span.simdi')).toHaveCount(1);
  expect((await page.locator('.ince-cubuk.parcali span').first().boundingBox()).height).toBeLessThanOrEqual(4);
  const siklar = page.locator('[data-test="sanatci-secenekleri"] .secenek');
  await expect(siklar).toHaveCount(4);
  for (const s of await siklar.all()) {
    const k = await s.boundingBox();
    expect(k.height).toBeGreaterThanOrEqual(56);
    expect(k.y).toBeGreaterThan(844 * 0.45); // ekranın alt yarısı
  }
  // doğru cevap: kutu ilerler, son nokta dolar; yazıda ne zaman tekrar edileceği
  const dogru = await page.evaluate(() => window.__atlas.oturum.kart.id);
  await page.locator(`[data-sanatci="${dogru}"]`).click();
  const satir = page.locator('[data-test="kutu-satir"]');
  await expect(satir).toBeVisible();
  await expect(satir.locator('.kutu-noktalar i')).toHaveCount(6);
  await expect(satir.locator('.kutu-noktalar i.dolu')).toHaveCount(1);
  await expect(satir).toContainText('1. kutu · 1 gün sonra tekrar');
  // ana düğme başparmak bölgesinde, en az 56 px
  await expect.poll(async () => (await page.locator('[data-ikinci]').boundingBox()).height).toBeGreaterThanOrEqual(56); // giriş animasyonu bitince
  // akım sorusunda yanlış cevap: kutu boşalır
  await page.locator('[data-ikinci]').click();
  const akim = await page.evaluate(() => window.__atlas.harita.get(window.__atlas.oturum.kart.id).akim);
  await page.locator(`[data-test="akim-secenekleri"] .secenek:not([data-akim="${akim}"])`).first().click();
  await expect(page.locator('[data-test="kutu-satir"] .kutu-noktalar i.dolu')).toHaveCount(0);
  await expect(page.locator('[data-test="kutu-satir"]')).toContainText('Baştan');
  expect(await page.evaluate(() => document.scrollingElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
});

test('harita: sembol aynen kalır, çevresinde madalyon; sıradaki durakta nabız ve etiket, kilitlide kilit; pencerede seviye merdiveni', async ({ page }) => {
  await page.goto('./#/harita');
  const duraklar = page.locator('[data-test="harita-durak"]');
  await expect(duraklar.first()).toBeVisible();
  const n = await duraklar.count();
  // her durakta sembolün kendisi (aynı çizim dosyası) ve çevresinde halka
  await expect(page.locator('[data-test="harita-durak"] > img[src*="sembol_"]')).toHaveCount(n);
  await expect(page.locator('[data-test="harita-durak"] .durak-halka')).toHaveCount(n);
  const simdiki = page.locator('.harita-durak.simdiki');
  await expect(simdiki.locator('.durak-nabiz')).toHaveCount(1);
  await expect(simdiki.locator('.durak-yildizlar .yildiz-sekil')).toHaveCount(3);
  await expect(simdiki.locator('.durak-etiket')).toContainText('Kolay · 8 soru seni bekliyor');
  await expect(page.locator('.harita-durak.kilit .durak-kilit').first()).toBeAttached();
  // etiket ekranın içinde ve sekme çubuğunun üstünde
  const e = await simdiki.locator('.durak-etiket').boundingBox();
  const cubuk = await page.locator('#sekmeler').boundingBox();
  expect(e.x).toBeGreaterThanOrEqual(0);
  expect(e.x + e.width).toBeLessThanOrEqual(390);
  expect(e.y + e.height).toBeLessThanOrEqual(cubuk.y);
  // pencere: başlıkta aynı sembol; Tanış → Kolay → Orta → Zor; altta sıradaki seviyeye götüren büyük düğme
  await simdiki.click({ force: true });
  const pencere = page.locator('.harita-pencere-ic');
  await expect(pencere).toBeVisible();
  await expect(pencere.locator('.hp-madalyon img[src*="sembol_"]')).toHaveCount(1);
  const satirlar = pencere.locator('.harita-seviyeler.merdiven .harita-seviye');
  await expect(satirlar).toHaveCount(4);
  await expect(satirlar.nth(0)).toHaveAttribute('data-test', 'harita-tanitim');
  await expect(satirlar.nth(1)).toHaveClass(/siradaki/);
  await expect(satirlar.nth(2)).toHaveClass(/kapali/);
  const basla = pencere.locator('[data-test="harita-basla"]');
  await expect(basla).toContainText('Kolay’a başla');
  expect((await basla.boundingBox()).height).toBeGreaterThanOrEqual(56);
  await expect(basla).toHaveAttribute('href', /#\/pekistir\/bolum\/\d+-\d+\/kolay$/);
});

test('Galeri: Başyapıtlar rafı rozetli, Karşılaştır ve Koleksiyon kısayolları; Çalış: Başka turlar ızgarası', async ({ page }) => {
  await page.goto('./#/gozat');
  const raf = page.locator('[data-test="gz-raf"]');
  await expect(raf).toBeVisible();
  const kartlar = raf.locator('[data-test="gz-raf-kart"]');
  await expect(kartlar.first()).toBeVisible();
  expect(await kartlar.count()).toBeGreaterThan(3);
  // hikâyesi ya da incelemesi olanlar önde ve rozetli
  await expect(kartlar.first().locator('[data-test="eser-rozetler"] .eser-rozet').first()).toBeVisible();
  await expect(raf.locator('[data-gz-raf-sayi]')).toHaveText(/\d+ eser/);
  for (const t of ['gz-karsilastir', 'gz-koleksiyon']) {
    const k = await page.locator(`[data-test="${t}"]`).boundingBox();
    expect(k.height).toBeGreaterThanOrEqual(44);
  }
  await kartlar.first().click();
  await expect(page).toHaveURL(/#\/basyapit\//);
  expect(await page.evaluate(() => document.scrollingElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  // Çalış
  await page.goto('./#/pekistir');
  const izgara = page.locator('[data-test="ek-turlar"] .tur-izgara');
  await expect(izgara.locator('[data-test="donem-turu"]')).toBeVisible();
  await expect(izgara.locator('[data-test="bolum-turu"]')).toBeVisible();
  await expect(izgara.locator('[data-test="konu-turu"]')).toBeVisible();
  await izgara.locator('[data-test="donem-turu"]').click();
  await expect(page.locator('.pk-salonlar')).toBeInViewport();
});

test('Yolculuk: kurs rozeti; panelde sıradaki konu "İşlendi yap" ile işlenir ve sayı artar', async ({ page }) => {
  await page.goto('./#/harita');
  const rozet = page.locator('[data-test="kurs-rozet"]');
  await expect(rozet).toBeVisible();
  const [once, toplam] = (await rozet.locator('b').textContent()).match(/\d+/g).map(Number);
  expect(toplam).toBeGreaterThan(once);
  expect((await rozet.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await rozet.click();
  const panel = page.locator('[data-test="kurs-pencere"]');
  await expect(panel).toBeVisible();
  await expect(panel.locator('[data-test="kurs-siradaki"]')).toContainText('Sıradaki · Konu');
  const acikOnce = await page.evaluate(() => window.__atlas.ilerleme.islenen.length);
  await panel.locator('[data-test="kurs-isle"]').click();
  await expect.poll(() => page.evaluate(() => window.__atlas.ilerleme.islenen.length)).toBe(acikOnce + 1);
  await expect(page.locator('[data-test="kurs-rozet"] b')).toHaveText(`${once + 1} / ${toplam} konu`);
  await expect(page.locator('[data-test="kurs-pencere"]')).toBeVisible();
  // bütün konular Ben sayfasında
  await page.locator('[data-test="kurs-hepsi"]').click();
  await expect(page.getByRole('heading', { name: 'Ben' })).toBeVisible();
});
