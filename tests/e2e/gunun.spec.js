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

test('Bugün (Tasarım B): açılış tek ekran; ad, eser ve yıl, tek kelimelik düğmeler; aşağıda resmin içinde yürüyüş', async ({ page }) => {
  await page.goto('./');
  const kart = page.locator('[data-test="gunun-kart"]');
  await expect(kart.locator('[data-gunun-gorsel] > img')).toBeVisible();
  // eserin adı ve yılı adın altında
  await expect(kart.locator('[data-bugun-eser]')).toBeVisible();
  await expect(kart.locator('[data-bugun-eser]')).not.toBeEmpty();
  // açılışta açıklama yazısı yok; tur düğmesi yalnız yürüyüşün sonunda
  await expect(page.locator('.duvar-etiketi, .sahne-paneller, .kaydir-ipucu')).toHaveCount(0);
  await expect(page.locator('[data-test="yur-tur"]')).not.toBeInViewport();
  // İş 171: günün ressamı yürüyüşü olan 145 sanatçıdan; sayfa adım adım kayar
  const durum = await page.evaluate(() => {
    const d = window.__atlas;
    const id = Object.keys(d.yuruyus).find((k) => document.querySelector('.bugun-yuruyus') && d.harita.get(k) && document.querySelector('.sahne-isim .isim').getAttribute('aria-label') === d.harita.get(k).ad);
    return { id, nokta: id ? d.yuruyus[id].noktalar.length : 0, adim: document.querySelectorAll('[data-test="yur-adim"]').length };
  });
  expect(durum.id).toBeTruthy();
  expect(durum.adim).toBeGreaterThanOrEqual(durum.nokta + 2);
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

// İş 171 (Tasarım B): resmin içinde yürüyüş
test('yürüyüş: adımlar, kart ayrıntıyı kapatmaz, siyah boşluk yok, sekme çubuğu gizlenir, sonda Hayatı ve bugünkü tur', async ({ page }) => {
  await page.goto('./');
  const kok = page.locator('.bugun-yuruyus');
  await expect(kok).toHaveClass(/yur-hazir/);
  const adimlar = page.locator('[data-test="yur-adim"]');
  const n = await adimlar.count();
  expect(n).toBeGreaterThanOrEqual(6);
  await expect(page.locator('#sekmeler')).toBeVisible();
  const h = await page.evaluate(() => innerHeight);
  for (let k = 1; k < n; k++) {
    await page.evaluate((y) => window.scrollTo(0, y), k * h);
    await expect(kok).toHaveAttribute('data-adim', String(k));
    const adim = adimlar.nth(k);
    await expect(adim).toHaveClass(/gorunur/);
    const kartKutu = await adim.locator('.yur-kart').boundingBox();
    // kart ekranın içinde ve metni kesilmiyor
    expect(kartKutu.y).toBeGreaterThanOrEqual(0);
    expect(kartKutu.y + kartKutu.height).toBeLessThanOrEqual(h);
    // resim ekranı kaplıyor (siyah boşluk yok)
    const r = await page.evaluate(() => {
      const b = document.querySelector('[data-gunun-gorsel] > img').getBoundingClientRect();
      return { sol: b.left, ust: b.top, sag: b.right, alt: b.bottom, w: innerWidth, h: innerHeight, t: document.querySelector('[data-gunun-gorsel] > img').style.transform, y: scrollY };
    });
    expect(r.alt, JSON.stringify([k, r])).toBeGreaterThanOrEqual(r.h - 0.5);
    expect(r.sol).toBeLessThanOrEqual(0.5);
    expect(r.ust).toBeLessThanOrEqual(0.5);
    expect(r.sag).toBeGreaterThanOrEqual(r.w - 0.5);
    expect(r.alt).toBeGreaterThanOrEqual(r.h - 0.5);
    // ayrıntı adımlarında ayrıntının büyük kısmı kartın dışında
    const gor = await adim.getAttribute('data-gorunen');
    if (gor !== null) expect(Number(gor)).toBeGreaterThan(0.45);
  }
  // yürürken sekme çubuğu gizli; sonda geri gelir
  await expect(page.locator('html')).toHaveClass(/yuruyus-icinde/);
  await page.evaluate(() => window.scrollTo(0, document.scrollingElement.scrollHeight));
  await expect(page.locator('html')).not.toHaveClass(/yuruyus-icinde/);
  await expect(page.locator('[data-test="yur-hayat"] [data-test="biyografi"]').first()).toBeVisible();
  const tur = page.locator('[data-test="yur-tur"]');
  await expect(tur).toBeVisible();
  expect((await tur.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await tur.click();
  await expect(page).toHaveURL(/#\/pekistir/);
  // başa dönünce kapak ve sekme çubuğu yerinde
  await page.goto('./#/');
  await expect(page.locator('[data-test="gunun-kart"]')).toBeVisible();
});

test('yürüyüş: yatay kaydırma yok', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('.bugun-yuruyus')).toHaveClass(/yur-hazir/);
  const tasma = await page.evaluate(() => document.scrollingElement.scrollWidth - innerWidth);
  expect(tasma).toBeLessThanOrEqual(0);
});
