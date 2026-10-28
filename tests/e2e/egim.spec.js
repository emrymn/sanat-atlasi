// Telefonu eğince Bugün'ün tablosu hareket eder (İş 32). Jiroskop olayı elle gönderilir; iPhone'un izin davranışı taklit edilir.
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

// jiroskop: sn saniye boyunca saniyede gamma derece sağa dönüş (60 olay/sn). Dikey eksen etrafındaki dönüş
// standartta gamma'da, iOS'ta beta'da gelir (test iPhone kimliğiyle çalışır): ikisine de yazılır.
const donus = (page, gamma, sn) =>
  page.evaluate(
    async ([g, t]) => {
      for (let i = 0; i < t * 60; i++) {
        window.dispatchEvent(new DeviceMotionEvent('devicemotion', { rotationRate: { alpha: 0, beta: g, gamma: g }, interval: 16 }));
        await new Promise((r) => setTimeout(r, 16));
      }
    },
    [gamma, sn],
  );

// iPhone'un izin davranışı: requestPermission dokunuş olmadan reddeder (iOS izni unuttuysa), dokunuşla izin verir.
// hatirliyor: iOS daha önceki izni hatırlıyormuş gibi dokunuşsuz da evet. Dokunuş, tıklama olayıyla anlaşılır
// (navigator.userActivation Playwright'ta açılışta da etkin görünebiliyor).
const iPhoneIzni = (context, hatirliyor = false) =>
  context.addInitScript((h) => {
    let dokunus = false;
    window.addEventListener('click', () => ((dokunus = true), setTimeout(() => (dokunus = false), 500)), true);
    const iste = () =>
      h || dokunus ? Promise.resolve('granted') : Promise.reject(new DOMException('dokunuş gerekli', 'NotAllowedError'));
    window.DeviceMotionEvent.requestPermission = iste;
    window.DeviceOrientationEvent.requestPermission = iste;
  }, hatirliyor);

test('Bugün: izin unutulmuşsa “Hareketi aç” düğmesi; dokununca tablo döner, ad yavaş izler; Ayarlar’dan kapatılınca durur', async ({ page, context }) => {
  await agiHazirla(context);
  await iPhoneIzni(context);
  await page.goto('./#/');
  const kutu = page.locator('[data-gunun-gorsel]');
  await expect(kutu).toBeVisible();
  // ekranın rastgele bir yerine dokunmak izin istemez; düğme görünür
  const dugme = page.locator('[data-egim-dugme]');
  await expect(dugme).toBeVisible();
  await page.locator('.bugun-ust .etiket').click();
  await expect(kutu).not.toHaveClass(/egimli/);
  await expect(dugme).toBeVisible();
  await dugme.click();
  await expect(kutu).toHaveClass(/egimli/);
  await expect(dugme).toBeHidden();
  await donus(page, 80, 0.4); // sağa çevir
  const deger = (ad) => kutu.evaluate((el, a) => parseFloat(el.style.getPropertyValue(a)) || 0, ad);
  // ad tablodan geride kalır (daha yavaş izler), ama o da sağa kayar
  const [tablo, ad] = [await deger('--egx'), await deger('--yzx')];
  expect(ad).toBeLessThan(tablo);
  await expect.poll(() => deger('--egx')).toBeGreaterThan(0.5);
  await expect.poll(() => deger('--yzx')).toBeGreaterThan(0.1);
  // soyadın gölgesi ayrı katman (her karede yeniden çizilen text-shadow değil)
  const golge = await page.locator('.sahne-isim .ad-son').evaluate((el) => ({ kopya: getComputedStyle(el, '::before').content, ts: getComputedStyle(el).textShadow }));
  expect(golge.kopya).not.toBe('none');
  expect(golge.ts).toBe('none');
  const eksen = await kutu.evaluate((el) => el.style.getPropertyValue('--egim-eksen'));
  expect(eksen).toMatch(/deg$/);
  await expect(page.locator('.egim-isik')).toBeVisible();

  // yeniden açılış (iOS izni unuttu): Ayarlar'da da "Hareket iznini ver"
  await page.goto('./#/ayarlar');
  await page.reload();
  const izinDugmesi = page.locator('[data-egim-izin]');
  await expect(izinDugmesi).toBeVisible();
  await izinDugmesi.click();
  await expect(page.locator('#egim-mesaj')).toContainText('İzin verildi');
  await expect(izinDugmesi).toBeHidden();
  const anahtar = page.locator('[data-ayar-egim]');
  await expect(anahtar).toBeChecked();
  await anahtar.click();
  await expect(anahtar).not.toBeChecked();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme')).ayarlar.egim)).toBe(false);
  await page.goto('./#/');
  await expect(page.locator('[data-gunun-gorsel]')).toBeVisible();
  await expect(page.locator('[data-gunun-gorsel]')).not.toHaveClass(/egimli/);
});

test('Bugün: iOS izni hatırlıyorsa düğme çıkmaz, hareket hemen başlar', async ({ page, context }) => {
  await agiHazirla(context);
  await iPhoneIzni(context, true);
  await page.goto('./#/');
  await expect(page.locator('[data-gunun-gorsel]')).toHaveClass(/egimli/);
  await expect(page.locator('[data-egim-dugme]')).toBeHidden();
  await page.goto('./#/ayarlar');
  await expect(page.locator('[data-ayar-egim]')).toBeChecked();
  await expect(page.locator('[data-egim-izin]')).toBeHidden();
});

test('Pekiştir: izin unutulmuşsa destenin altında “Hareketi aç”; dokununca çevirmek desteyi yelpaze açar (İş 47)', async ({ page, context }) => {
  await agiHazirla(context);
  await iPhoneIzni(context);
  await page.goto('./#/pekistir');
  const sahne = page.locator('.pk-sahne');
  await expect(sahne.locator('.pk-kart').first()).toBeVisible();
  const dugme = sahne.locator('[data-egim-dugme]');
  await expect(dugme).toBeVisible();
  await dugme.click();
  await expect(sahne).toHaveClass(/egimli/);
  await expect(dugme).toBeHidden();
  await donus(page, 120, 0.4);
  await expect.poll(() => sahne.evaluate((e) => parseFloat(e.style.getPropertyValue('--acilim')) || 0)).toBeGreaterThan(0.3);
  // sağa dönünce deste sola yatar
  await expect.poll(() => sahne.evaluate((e) => parseFloat(e.style.getPropertyValue('--yatma')) || 0)).toBeLessThan(-1);
});
