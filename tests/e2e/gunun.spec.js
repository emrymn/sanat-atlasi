import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

test('Günün sanatçısı: ana sayfada kart, bölüm içeriği, aynı gün aynı sanatçı', async ({ page }) => {
  await page.goto('./');
  const kart = page.locator('[data-test="gunun-kart"]');
  await expect(kart).toBeVisible();
  const ad = (await kart.locator('b.isim').textContent()).trim();
  await kart.locator('.sahne-isim').click();
  await expect(page.getByRole('heading', { name: 'Günün sanatçısı' })).toBeVisible();
  await expect(page.locator('.gunun-ad')).toHaveText(ad);
  // İş 67: sağ üstteki durum hapı kalktı; kurs bilgisi künye satırında
  await expect(page.locator('[data-test="kurs-durumu"]')).toHaveCount(0);
  await expect(page.locator('.gunun .meta')).toContainText(/Konu \d+|Kurs dışı/);
  await expect(page.locator('[data-test="donem"]')).not.toBeEmpty();
  await expect(page.getByText(/^Claude taslağı · /)).toBeVisible();
  await expect(page.locator('.galeri-eser').first()).toBeVisible();
  // galeri eseri tam ekran açılır
  await page.locator('.galeri-eser').first().click();
  await expect(page.locator('.gor')).toBeVisible();
  await page.locator('.gor').getByRole('button', { name: 'Kapat' }).click();
  // aynı gün yeniden açınca aynı sanatçı
  await page.reload();
  await expect(page.locator('.gunun-ad')).toHaveText(ad);
  // başka bir sanatçı
  await page.locator('[data-test="baska"]').click();
  await expect(page.locator('.gunun-ad')).not.toHaveText(ad);
});

test('kilitli sanatçı pekiştirmeye eklenir', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-test="gunun-kart"]')).toBeVisible();
  const id = await page.evaluate(() => {
    const d = window.__atlas;
    return d.sanatcilar.find((s) => !d.ilerleme.islenen.includes(s.konu) && s.konu > 40).id;
  });
  await page.goto(`./#/gunun/${id}`);
  await expect(page.locator('.gunun .meta')).toContainText(/Konu \d+|Kurs dışı/);
  await page.getByRole('button', { name: 'Bu sanatçıyı pekiştirmeye ekle' }).click();
  // İş 97: kart "Pekiştirmede" kartına döner, Atölye'ye götürür
  const eklendi = page.locator('[data-test="pekistirmede"]');
  await expect(eklendi).toBeVisible();
  await expect(eklendi).toContainText('Pekiştirmede');
  await expect(eklendi).toHaveAttribute('href', '#/pekistir');
  await expect(page.getByRole('button', { name: 'Bu sanatçıyı pekiştirmeye ekle' })).toHaveCount(0);
  const i = await page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme')));
  expect(i.ekSanatcilar).toContain(id);
  expect(i.skorlar[id].sanatci.sonraki).toBe(i.gunluk.tarih);
  // karışık turda vadeli kart olarak gelir
  const secildi = await page.evaluate(async (id) => {
    location.hash = '#/pekistir/karisik';
    await new Promise((r) => setTimeout(r, 1500));
    return window.__atlas.oturum.oturum.kuyruk.some((k) => k.id === id);
  }, id);
  expect(secildi).toBe(true);
});

test('biyografi ve dönem bilgisi çevrimdışı açılır', async ({ page, context }) => {
  await page.goto('./');
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await context.setOffline(true);
  await page.goto('./#/gunun');
  await expect(page.locator('[data-test="donem"]')).not.toBeEmpty();
  await context.setOffline(false);
});

test('Bugün (Tasarım B · 4.1): tek ekran; ad, eser ve yıl, tek kelimelik düğmeler; açıklama, tur ve kaydırma yok', async ({ page }) => {
  await page.goto('./');
  const kart = page.locator('[data-test="gunun-kart"]');
  await expect(kart.locator('[data-gunun-gorsel] > img')).toBeVisible();
  // eserin adı ve yılı adın altında
  await expect(kart.locator('[data-bugun-eser]')).toBeVisible();
  await expect(kart.locator('[data-bugun-eser]')).not.toBeEmpty();
  // açıklama yazısı ve tur düğmesi yok
  await expect(page.locator('.duvar-etiketi, .sahne-paneller, [data-test="tur-sayi"], .kaydir-ipucu')).toHaveCount(0);
  // sayfa kaymaz: içerik ekrandan uzun değil
  const tasma = await page.evaluate(() => {
    window.scrollTo(0, 500);
    return { y: window.scrollY, h: document.scrollingElement.scrollHeight - innerHeight };
  });
  expect(tasma.y).toBe(0);
  // düğmeler tek kelime (sanatçının bilinen adı); görünenler en az 44 px
  const ad = (await kart.locator('.bugun-dugmeler a.bugun-dugme').textContent()).trim();
  expect(ad.length).toBeGreaterThan(0);
  const gorunen = kart.locator('.bugun-dugme:visible');
  for (const b of await gorunen.all()) {
    const k = await b.boundingBox();
    expect(k.height).toBeGreaterThanOrEqual(44);
  }
  // Hikâyesi / İncele yalnız eserin kaydı varsa görünür
  const kayit = await page.evaluate(async () => {
    await new Promise((r) => setTimeout(r, 1500));
    return {
      hikaye: !document.querySelector('[data-bugun-hikaye]').hidden,
      incele: !document.querySelector('[data-bugun-incele]').hidden,
    };
  });
  if (kayit.hikaye) {
    await kart.locator('[data-bugun-hikaye]').click();
    await expect(page.locator('[data-test="gor-hikaye-panel"]')).toBeVisible();
    await page.locator('[data-test="gor-hikaye-kapat"]').click();
    await page.locator('.gor').getByRole('button', { name: 'Kapat' }).click();
  }
  // sanatçının adı Günün sanatçısı sayfasına götürür
  await kart.locator('.bugun-dugmeler a.bugun-dugme').click();
  await expect(page.getByRole('heading', { name: 'Günün sanatçısı' })).toBeVisible();
});

test('V2: elle yazılmış biyografi (Guido Reni) kaynak notuyla görünür', async ({ page }) => {
  await page.goto('./#/gunun/guido-reni');
  await expect(page.locator('[data-test="biyografi"]')).toContainText('Bologna');
  await expect(page.getByText('(bilgilerinden Claude özeti)')).toBeVisible();
});
