// Rapor 8. paket: K4 Koleksiyonum, İ1 takvim ve seri, İ2 rozet, İ4 grafikler, İ5 hatalı görsel bildirimi, T2 geç yüklenen notlar, T4 yenilikler
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { agiHazirla, ilerleme } from './ortak.js';

const hazir = (page) => page.waitForFunction(() => window.__atlas && window.__atlas.ilerleme);
const onbellek = JSON.parse(readFileSync(new URL('../../data/eserler_onbellek.json', import.meta.url), 'utf8'));
const NOTLAR = {
  surum: 1,
  notlar: Object.fromEntries(onbellek.sanatcilar['j-m-w-turner'].eserler.map((e) => [e.qid || `j-m-w-turner|${e.baslik}`, 'TEST eser notu.'])),
};

// Sayfanın kendi saatine göre "YYYY-MM-DD" (n gün önce)
const gunStr = (page, n = 0) =>
  page.evaluate((n) => {
    const x = new Date();
    x.setDate(x.getDate() - n);
    return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
  }, n);

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

test('K4: görüntüleyicide işaretle → İlerleme bağlantısı → duvar → işareti kaldır', async ({ page }) => {
  await page.goto('./#/sanatci/giotto-di-bondone');
  await expect(page.locator('.eser').first()).toBeVisible();
  await page.locator('.eser').first().click();
  const gor = page.locator('.gor');
  const isaret = gor.locator('.gor-isaret');
  await expect(isaret).toBeVisible();
  await expect(isaret).toHaveAttribute('aria-pressed', 'false');
  await isaret.click();
  await expect(isaret).toHaveAttribute('aria-pressed', 'true');
  await expect(gor.locator('.gor-mesaj')).toContainText('Koleksiyonuna eklendi');
  let i = await ilerleme(page);
  expect(i.koleksiyon).toHaveLength(1);
  expect(i.koleksiyon[0].s).toBe('giotto-di-bondone');
  await gor.getByRole('button', { name: 'Kapat' }).click();

  await page.goto('./#/ilerleme');
  await expect(page.locator('[data-test="koleksiyon-bag"]')).toContainText('1 eser işaretli');
  await page.locator('[data-test="koleksiyon-bag"]').click();
  await expect(page).toHaveURL(/#\/koleksiyon$/);
  const izgara = page.locator('[data-test="koleksiyon-izgara"] .eser');
  await expect(izgara).toHaveCount(1);
  // yeniden yükleyince de durur (yedeğe dahil olduğu birim testinde)
  await page.reload();
  await expect(izgara).toHaveCount(1);
  // İş 46: duvarda iple asılı; telefonu sağa çevirince (jiroskop olayı elle) tablo ipinden sola salınır
  await expect(page.locator('.koleksiyon-duvar .asi')).toHaveCount(1);
  await page.evaluate(async () => {
    for (let i = 0; i < 30; i++) {
      window.dispatchEvent(new DeviceMotionEvent('devicemotion', { rotationRate: { alpha: 0, beta: 120, gamma: 120 }, interval: 16 }));
      await new Promise((r) => setTimeout(r, 16));
    }
  });
  await expect
    .poll(() => page.locator('.koleksiyon-duvar .asi').first().evaluate((e) => parseFloat(e.style.getPropertyValue('--sal')) || 0))
    .toBeLessThan(-1);
  await izgara.first().click();
  await expect(page.locator('.gor .gor-isaret')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.gor .gor-isaret').click();
  await expect(page.locator('.gor .gor-isaret')).toHaveAttribute('aria-pressed', 'false');
  await page.locator('.gor').getByRole('button', { name: 'Kapat' }).click();
  await expect(page.locator('[data-test="koleksiyon-bos"]')).toBeVisible();
  i = await ilerleme(page);
  expect(i.koleksiyon).toHaveLength(0);
});

test('İ5: görüntüleyici ⋯ menüsü: "Yanlış sanatçı" eseri pekiştirmeden çıkarır; Ayarlar listesi kopyalanır', async ({ page }) => {
  await page.goto('./#/sanatci/giotto-di-bondone');
  await expect(page.locator('.eser').first()).toBeVisible();
  await page.locator('.eser').first().click();
  const gor = page.locator('.gor');
  await gor.getByRole('button', { name: 'Bu görsel hatalı mı?' }).click();
  const menu = gor.locator('[data-test="gor-bildir-menu"]');
  await expect(menu).toBeVisible();
  await expect(menu.locator('button')).toHaveText(['Yanlış sanatçı', 'Heykel/mimari', 'Kötü görsel', 'Yanlış ad']);
  await menu.getByRole('button', { name: 'Yanlış sanatçı' }).click();
  await expect(gor.locator('.gor-mesaj')).toContainText('Bildirildi');
  const i = await ilerleme(page);
  expect(i.bildirimler).toHaveLength(1);
  expect(i.bildirimler[0].neden).toBe('Yanlış sanatçı');
  expect(i.bildirimler[0].s).toBe('giotto-di-bondone');
  const eser = await page.evaluate(() => window.__atlas.sonEserListesi[0]);
  expect(i.kotuGorseller[eser.anahtar].length).toBe(eser.gorseller.length);
  await gor.getByRole('button', { name: 'Kapat' }).click();

  await page.goto('./#/ayarlar');
  const bolum = page.locator('[data-test="bildirimler"]');
  await expect(bolum).toContainText('1 bildirim');
  await expect(bolum.locator('.bildir-liste li')).toHaveCount(1);
  await bolum.locator('[data-bildirim-kopyala]').click();
  await expect(page.locator('#bildirim-cikti')).toHaveValue(/"tur": "gorsel-bildirimleri"/);
});

test('İ5: "Kötü görsel" menüden de çalışır (bilinen akış) ve kayıt düşer', async ({ page }) => {
  await page.goto('./#/sanatci/giotto-di-bondone');
  await expect(page.locator('.eser').first()).toBeVisible();
  const k = await page.evaluate(() => window.__atlas.sonEserListesi.findIndex((e) => e.gorseller.length > 1));
  expect(k).toBeGreaterThanOrEqual(0);
  await page.locator('.eser').nth(k).click();
  const gor = page.locator('.gor');
  const ilk = await gor.locator('.gor-resim').getAttribute('src');
  await gor.getByRole('button', { name: 'Bu görsel hatalı mı?' }).click();
  await gor.locator('[data-test="gor-bildir-menu"]').getByRole('button', { name: 'Kötü görsel' }).click();
  await expect(gor.locator('.gor-mesaj')).toContainText('Başka bir görsele');
  await expect(gor.locator('.gor-resim')).not.toHaveAttribute('src', ilk);
  const i = await ilerleme(page);
  expect(i.bildirimler[0].neden).toBe('Kötü görsel');
  expect(Object.values(i.kotuGorseller).flat()).toHaveLength(1);
});

test('İ5: cevap yaprağında ⋯ → "Heykel/mimari" bildirimi', async ({ page }) => {
  await page.goto('./#/pekistir/donem/hepsi');
  await page.locator('[data-test="sanatci-secenekleri"] button').first().click();
  await expect(page.locator('[data-test="sonuc"]')).toBeVisible();
  const ac = page.locator('[data-bildir-ac]');
  await expect(ac).toBeVisible();
  // yaprak açılırken hafifçe ölçeklenir; giriş hareketi bitince ölçülür
  await expect.poll(async () => (await ac.boundingBox()).width).toBeGreaterThanOrEqual(44);
  await expect.poll(async () => (await ac.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await ac.click();
  await page.locator('[data-test="bildir-secenekler"]').getByRole('button', { name: 'Heykel/mimari' }).click();
  await expect(page.locator('[data-test="bildir-mesaj"]')).toContainText('pekiştirmede çıkmayacak');
  const i = await ilerleme(page);
  expect(i.bildirimler).toHaveLength(1);
  expect(i.bildirimler[0].neden).toBe('Heykel/mimari');
  // yaprak yerinde kaldı: sonraki düğmesi erişilebilir
  await expect(page.locator('[data-sonraki]')).toBeInViewport();
});

test('İ1/İ4: biten kart günün kaydına yazılır; takvim, seri ve iki grafik İlerleme’de', async ({ page }) => {
  await page.goto('./#/pekistir/donem/hepsi');
  await page.locator('[data-test="sanatci-secenekleri"] button').first().click();
  await expect(page.locator('[data-test="sonuc"]')).toBeVisible();
  const bugun = await gunStr(page, 0);
  let i = await ilerleme(page);
  expect(i.gecmis[bugun].kart).toBe(1);
  expect(Object.keys(i.gecmis[bugun].akimlar)).toHaveLength(1);

  // geçmiş iki gün ekle (bugünle 3 günlük seri)
  const [d1, d2] = [await gunStr(page, 1), await gunStr(page, 2)];
  await page.evaluate(
    ([a, b]) => {
      const g = window.__atlas.ilerleme.gecmis;
      g[a] = { kart: 4, dogru: 3, akimlar: { Gotik: 4 } };
      g[b] = { kart: 6, dogru: 5, akimlar: { Gotik: 6 } };
    },
    [d1, d2],
  );
  await page.goto('./#/ilerleme');
  await expect(page.locator('[data-test="seri"]')).toHaveAttribute('data-seri', '3');
  await expect(page.locator('[data-test="seri"]')).toContainText('3 günlük seri');
  await expect(page.locator('[data-test="takvim"] .tk')).toHaveCount(84);
  await expect(page.locator('[data-test="takvim"] .tk.dolu')).toHaveCount(3);
  await expect(page.locator(`[data-test="takvim"] .tk.bugun`)).toHaveAttribute('data-tarih', bugun);
  const renk = await page.locator('[data-test="takvim"] .tk.dolu').first().evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(renk).not.toBe('rgba(0, 0, 0, 0)');
  // öğrenme eğrisi ve gelecek yük
  await expect(page.locator('[data-test="egri"] path.cizgi')).toHaveCount(1);
  await expect(page.locator('[data-test="egri"] circle.nokta.son')).toHaveCount(1);
  await expect(page.locator('[data-test="egri-ozet"]')).toContainText('Son hafta: %');
  await expect(page.locator('[data-test="yuk"] g[data-gun]')).toHaveCount(14);
  await expect(page.locator('[data-test="yuk-ozet"]')).toContainText('yarın');
  // yatay taşma yok
  const tasma = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(tasma).toBeLessThanOrEqual(0);
  // sayfanın başı: takvim Sıradaki konu'dan önce
  const t = await page.locator('[data-test="takvim"]').boundingBox();
  const s = await page.locator('[data-test="siradaki-konu"]').boundingBox();
  expect(t.y).toBeLessThan(s.y);
});

test('İ4: vadesi gelen sanatçı gelecek yük grafiğinde bugüne yazılır', async ({ page }) => {
  await page.goto('./');
  await hazir(page);
  const bugun = await gunStr(page, 0);
  const dun = await gunStr(page, 1);
  const id = await page.evaluate(
    ([b, dn]) => {
      const d = window.__atlas;
      const s = d.sanatcilar.find((x) => x.kaynak === 'kurs' && d.ilerleme.islenen.includes(x.konu));
      d.ilerleme.skorlar[s.id] = { sanatci: { kutu: 2, sonraki: b, dogru: 1, yanlis: 0, son: dn } };
      return s.id;
    },
    [bugun, dun],
  );
  expect(id).toBeTruthy();
  await page.goto('./#/ilerleme');
  await expect(page.locator('[data-test="yuk"] g[data-gun="0"]')).toHaveAttribute('data-sayi', /^[1-9]\d*$/);
  // çubuk gerçekten çizilir: genel .cubuk (4 px ilerleme çubuğu) kuralı SVG çubuğunun yüksekliğini ezmiyor (İş 22)
  await page.waitForTimeout(1200);
  const yukseklik = await page.locator('[data-test="yuk"] g[data-gun="0"] rect').evaluate((r) => r.getBoundingClientRect().height);
  expect(yukseklik).toBeGreaterThan(20);
});

test('İ2: rozet ayarı izin ister, sayıyı yazar; gizlenirken yarının sayısı; kapatınca temizlenir', async ({ page }) => {
  await page.addInitScript(() => {
    window.__rozet = [];
    navigator.setAppBadge = async (n) => void window.__rozet.push(n);
    navigator.clearAppBadge = async () => void window.__rozet.push(0);
    Object.defineProperty(window, 'Notification', { value: { permission: 'default', requestPermission: async () => 'granted' }, configurable: true });
  });
  await page.goto('./');
  await hazir(page);
  const [bugun, dun] = [await gunStr(page, 0), await gunStr(page, 1)];
  await page.evaluate(
    ([b, dn]) => {
      const d = window.__atlas;
      const s = d.sanatcilar.find((x) => x.kaynak === 'kurs' && d.ilerleme.islenen.includes(x.konu));
      d.ilerleme.skorlar[s.id] = { sanatci: { kutu: 2, sonraki: b, dogru: 1, yanlis: 0, son: dn } };
    },
    [bugun, dun],
  );
  await page.goto('./#/ayarlar');
  const anahtar = page.getByRole('switch', { name: 'Simge rozeti' });
  await expect(anahtar).toBeEnabled();
  await anahtar.check();
  await expect(page.locator('#rozet-mesaj')).toContainText('Rozet açıldı');
  expect((await ilerleme(page)).ayarlar.rozet).toBe(true);
  expect(await page.evaluate(() => window.__rozet.at(-1))).toBeGreaterThanOrEqual(1);
  // uygulama gizlenirken yarının vadeli sayısı
  await page.evaluate(() => {
    window.__rozet.length = 0;
    Object.defineProperty(document, 'visibilityState', { get: () => 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(() => page.evaluate(() => window.__rozet.at(-1))).toBeGreaterThanOrEqual(1);
  // kapat
  await anahtar.uncheck();
  await expect(page.locator('#rozet-mesaj')).toContainText('Rozet kapatıldı');
  expect(await page.evaluate(() => window.__rozet.at(-1))).toBe(0);
  expect((await ilerleme(page)).ayarlar.rozet).toBe(false);
});

test('İ2: izin verilmezse anahtar açılmaz', async ({ page }) => {
  await page.addInitScript(() => {
    navigator.setAppBadge = async () => {};
    Object.defineProperty(window, 'Notification', { value: { permission: 'denied', requestPermission: async () => 'denied' }, configurable: true });
  });
  await page.goto('./#/ayarlar');
  const anahtar = page.getByRole('switch', { name: 'Simge rozeti' });
  await anahtar.check({ force: true }).catch(() => {});
  await expect(page.locator('#rozet-mesaj')).toContainText('izni verilmedi');
  await expect(anahtar).not.toBeChecked();
  expect((await ilerleme(page)).ayarlar.rozet).toBe(false);
});

test('T4: sürüm değişince Bugün’de bir kez “Yenilikler”; Ayarlar’da liste', async ({ page }) => {
  await page.goto('./');
  await hazir(page);
  // çalışmış kullanıcı, eski sürümden güncelleme
  await page.evaluate(() => {
    const i = JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme'));
    i.sonSurum = '1.25.2';
    i.gecmis = { '2026-01-01': { kart: 1, dogru: 1, akimlar: {} } };
    localStorage.setItem('sanat-atlasi:ilerleme', JSON.stringify(i));
  });
  await page.reload();
  const not = page.locator('[data-test="yenilik-not"]');
  await expect(not).toBeVisible();
  await expect(not).toContainText('1.26 ·');
  await expect(not).toContainText('Koleksiyonum');
  expect((await ilerleme(page)).sonSurum).toBe('1.55.0');
  // aynı oturumda ana sayfaya dönünce durur; kapatılınca gider; sonraki açılışta yok
  await not.getByRole('button', { name: 'Yenilikler notunu kapat' }).click();
  await expect(not).toHaveCount(0);
  await page.reload();
  await expect(page.locator('[data-test="gunun-kart"], [data-test="pekistir"]').first()).toBeVisible();
  await expect(page.locator('[data-test="yenilik-not"]')).toHaveCount(0);
  await page.goto('./#/ayarlar');
  await expect(page.locator('[data-test="yenilikler"] li').first()).toContainText('1.55 ·');
  await expect(page.locator('[data-test="yenilikler"] li').nth(22)).toContainText('1.33 ·');
});

test('T4: yepyeni kullanıcıya Yenilikler notu gösterilmez', async ({ page }) => {
  await page.goto('./');
  await hazir(page);
  await expect(page.locator('[data-test="yenilik-not"]')).toHaveCount(0);
  expect((await ilerleme(page)).sonSurum).toBe('1.55.0');
});

test('T2: eser notları ilk ekrandan sonra yüklenir; önce açılan görüntüleyici not gelince yenilenir', async ({ page, context }) => {
  await context.route(/\/data\/eser_notlari\.json(\?.*)?$/, async (r) => {
    await new Promise((x) => setTimeout(x, 1500));
    await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(NOTLAR) });
  });
  await page.goto('./#/sanatci/j-m-w-turner');
  await hazir(page);
  // not dosyası gelmeden ekran çizilmiş olmalı
  expect(await page.evaluate(() => !!window.__atlas.eserNotlariHazir)).toBe(false);
  await expect(page.locator('.eser').first()).toBeVisible();
  await page.locator('.eser').first().click();
  await expect(page.locator('.gor')).toBeVisible();
  await expect(page.locator('[data-test="eser-notu"]')).toHaveCount(0);
  await expect(page.locator('[data-test="eser-notu"]')).toHaveText('TEST eser notu.', { timeout: 8000 });
  expect(await page.evaluate(() => window.__atlas.eserNotlariHazir)).toBe(true);
});
