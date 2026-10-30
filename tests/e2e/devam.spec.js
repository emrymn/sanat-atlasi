import { test, expect } from '@playwright/test';
import { agiHazirla, ilerleme } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

async function karisikCevapla(page) {
  await page.locator('[data-test="sanatci-secenekleri"] button').first().click();
  await page.locator('[data-ikinci]').click();
  await page.locator('[data-test="akim-secenekleri"] button').first().click();
}

test('yarım oturum: 5 kart cevapla, yenile, devam et → 6. karttan sürer', async ({ page }) => {
  await page.goto('./#/pekistir/karisik');
  for (let i = 0; i < 5; i++) {
    await expect(page.locator('[data-test="sayac"]')).toHaveText(new RegExp(`^${i + 1} / `));
    await karisikCevapla(page);
    await page.locator('[data-sonraki]').click();
  }
  await expect(page.locator('[data-test="sayac"]')).toHaveText(/^6 \//);
  const toplam = (await page.locator('[data-test="sayac"]').textContent()).split('/')[1].trim();
  const eser = await page.locator('[data-test="soru-resim"]').getAttribute('src');
  const once = await ilerleme(page);

  await page.reload();
  const kart = page.locator('[data-test="devam-kart"]');
  await expect(kart).toBeVisible();
  await expect(kart).toContainText('Yarım kalan tur');
  await expect(page.locator('[data-test="devam-ozet"]')).toHaveText(`Karışık · 6 / ${toplam}`);
  // İş 85: yenileyince Atölye'deki kart (Tuval'de kart yok)
  await expect(page).toHaveURL(/#\/pekistir$/);
  await page.goto('./#/');
  await expect(page.locator('[data-test="gunun-kart"]')).toBeAttached();
  await expect(page.locator('[data-test="devam-kart"]')).toHaveCount(0);
  await page.goto('./#/pekistir');
  await page.locator('[data-test="devam-et"]').click();
  await expect(page.locator('[data-test="sayac"]')).toHaveText(`6 / ${toplam}`);
  await expect(page.locator('[data-test="soru-resim"]')).toHaveAttribute('src', eser);
  // önceki cevaplar yeniden sayılmadı
  const sonra = await ilerleme(page);
  expect(sonra.gunluk.kart).toBe(once.gunluk.kart);
  expect(sonra.skorlar).toEqual(once.skorlar);
});

test('yarım oturum: akım sorusundan devam, Bitir ve yeni oturum sorusu', async ({ page }) => {
  await page.goto('./#/pekistir/karisik');
  await page.locator('[data-test="sanatci-secenekleri"] button').first().click();
  await page.locator('[data-ikinci]').click();
  await expect(page.getByText('Soru 2 / 2')).toBeVisible();
  await page.reload();
  await page.goto('./#/pekistir');
  await expect(page.locator('[data-test="devam-kart"]')).toBeVisible();
  await page.locator('[data-test="devam-et"]').click();
  await expect(page.getByText('Soru 2 / 2')).toBeVisible();
  await expect(page.locator('[data-test="akim-secenekleri"] button')).toHaveCount(4);

  // yarım varken yeni oturum → sayfa içi soru
  await page.goto('./#/pekistir/donem');
  await expect(page.locator('[data-test="devam-kart"]')).toBeVisible();
  await page.locator('a[href="#/pekistir/donem/Gotik"]').click();
  await expect(page.locator('[data-test="yarim-soru"]')).toContainText('Yarım kalan oturum silinsin mi?');
  await page.getByRole('button', { name: 'Sil, yeni başla' }).click();
  await expect(page.locator('[data-test="sanatci-secenekleri"] button')).toHaveCount(4);
  await page.locator('[data-test="sanatci-secenekleri"] button').first().click();
  await page.goto('./#/pekistir');
  await expect(page.locator('[data-test="devam-ozet"]')).toHaveText(/^Döneme göre · Gotik · 2 \//);
  await page.getByRole('button', { name: 'Bitir' }).click();
  await expect(page.locator('[data-test="devam-kart"]')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('[data-test="devam-kart"]')).toHaveCount(0);
});

test('yarım oturum: 7 günden eski kayıt sessizce silinir', async ({ page }) => {
  await page.goto('./#/pekistir/karisik');
  await karisikCevapla(page);
  await page.goto('./#/pekistir');
  await expect(page.locator('[data-test="devam-kart"]')).toBeVisible();
  await page.evaluate(async () => {
    const db = await new Promise((r) => {
      const q = indexedDB.open('sanat-atlasi');
      q.onsuccess = () => r(q.result);
    });
    await new Promise((r) => {
      const tx = db.transaction('oturum', 'readwrite');
      const s = tx.objectStore('oturum');
      const g = s.get('yarim');
      g.onsuccess = () => s.put({ ...g.result, zaman: Date.now() - 8 * 24 * 3600 * 1000 }, 'yarim');
      tx.oncomplete = r;
    });
    db.close();
  });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Pekiştir' })).toBeVisible();
  await expect(page.locator('[data-test="devam-kart"]')).toHaveCount(0);
});
