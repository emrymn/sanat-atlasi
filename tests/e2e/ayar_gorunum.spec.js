// İş 144–150: Tuval yüz odağı, hareket ve yazı seçimi, elle odak
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { agiHazirla, ilerleme } from './ortak.js';

const kur = (context, ayarlar = {}, ek = {}) =>
  context.addInitScript(
    ([a, e]) => {
      if (localStorage.getItem('sanat-atlasi:ilerleme')) return;
      localStorage.setItem('sanat-atlasi:ilerleme', JSON.stringify({ surum: 2, islenen: Array.from({ length: 30 }, (_, i) => i + 1), ayarlar: { tema: 'gece', egim: false, ...a }, sonSurum: '9.9.9', ...e }));
    },
    [ayarlar, ek],
  );

test('İş 148/149: hareket ve yazı boyutu Ayarlar’dan seçilir, html’e yazılır ve kaydedilir', async ({ page, context }) => {
  await agiHazirla(context);
  await kur(context);
  await page.goto('./#/ayarlar');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-hareket', 'tam');
  await expect(html).toHaveAttribute('data-yazi', 'standart');
  const okuma = async () => page.evaluate(() => getComputedStyle(document.body).fontSize);
  expect(await okuma()).toBe('16px');
  await page.getByRole('radio', { name: 'Büyük' }).check();
  await expect(html).toHaveAttribute('data-yazi', 'buyuk');
  expect(await okuma()).toBe('17px');
  await page.getByRole('radio', { name: 'Sade' }).check();
  await expect(html).toHaveAttribute('data-hareket', 'sade');
  await page.getByRole('radio', { name: 'Kapalı' }).check();
  await expect(html).toHaveAttribute('data-hareket', 'kapali');
  const a = (await ilerleme(page)).ayarlar;
  expect([a.hareket, a.yazi]).toEqual(['kapali', 'buyuk']);
  // Sade: sürekli dönen süs hareketleri bir kez oynar
  await page.getByRole('radio', { name: 'Sade' }).check();
  await page.goto('./#/pekistir/donem'); // 1.79.0: deste Turlar sayfasında
  const kart = page.locator('.pk-kart').first();
  await kart.waitFor();
  expect(await kart.evaluate((e) => getComputedStyle(e).animationIterationCount)).not.toContain('infinite');
});

test('İş 144: Tuval’in tablosu yüz odağına göre kaydırılır', async ({ page, context }) => {
  await agiHazirla(context);
  await context.addInitScript(() => (window.__atlasYuruyusYok = true)); // İş 171: yürüyüşsüz (eski tek ekran) yol sınanır
  await kur(context);
  // bütün görsellerde odak sağ alt köşede: tablo o yöne kaymalı. Veri diskten (istek yakalanıp sunucudan yeniden
  // indirilince service worker'lı CI'da takılıyordu)
  const yerel = JSON.parse(readFileSync(new URL('../../data/yerel_gorseller.json', import.meta.url), 'utf8')).gorseller;
  const odak = Object.fromEntries(Object.values(yerel).map((ad) => [ad, [95, 95]]));
  await context.route(/data\/gorsel_odak\.json/, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ surum: 1, odak }) }));
  await page.goto('./');
  const img = page.locator('[data-gunun-gorsel] > img');
  await expect(img).toHaveAttribute('style', /object-position: -?[\d.]+px -?[\d.]+px/, { timeout: 10000 });
});

test('İş 150: geliştirici modunda görüntüleyicide odak işaretlenir, Ayarlar’da listelenir', async ({ page, context }) => {
  await agiHazirla(context);
  await kur(context, {}, { gelistirici: { tarih: '2026-11-05', yedek: { surum: 2, islenen: [1], ayarlar: {} } } });
  await page.goto('./#/sanatci/giotto-di-bondone');
  await page.locator('.eser').first().click();
  const dugme = page.locator('[data-gor-odak]');
  await expect(dugme).toBeVisible();
  await dugme.click();
  await expect(page.locator('.gor-mesaj')).toContainText('dokun');
  const r = await page.locator('.gor-resim').boundingBox();
  await page.mouse.click(r.x + r.width * 0.25, r.y + r.height * 0.2);
  await expect(page.locator('.gor-mesaj')).toContainText('Kaydedildi');
  const kayit = await page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:odak-elle') || '{}'));
  const [o] = Object.values(kayit);
  expect(Math.abs(o[0] - 25)).toBeLessThan(4);
  expect(Math.abs(o[1] - 20)).toBeLessThan(4);
  await page.goto('./#/ayarlar');
  await expect(page.locator('[data-test="elle-odak"] textarea')).toHaveValue(/"odak":\{"[0-9a-f]+":\[2\d,[12]\d\]\}/);
});

test('İş 150/171: geliştirici modu kapalıyken görüntüleyicide odak düğmesi yok; "Günün resmi" düğmesi kalktı', async ({ page, context }) => {
  await agiHazirla(context);
  await kur(context);
  await page.goto('./#/sanatci/giotto-di-bondone');
  await page.locator('.eser').first().click();
  await expect(page.locator('.gor-resim')).toBeVisible();
  await expect(page.locator('[data-gor-odak]')).toBeHidden();
  // İş 171: ana ekranın resmini yürüyüş eseri belirler; elle seçim düğmesi yok
  await expect(page.locator('[data-test="gor-gunun"]')).toHaveCount(0);
});

// İş 171: ana ekranın resmi yürüyüş eseri (data/yuruyus.json); cihazdaki eski "Günün resmi" seçimi onu değiştirmez;
// Ayarlar'daki bölümde seçim listesi yok, "Sırayla ortala" var
test('İş 171: ana ekranın resmi yürüyüş eseridir, eski elle seçim etkilemez; adı Türkçe', async ({ page, context }) => {
  await agiHazirla(context);
  await kur(context);
  await page.goto('./#/ayarlar');
  await page.locator('#sekmeler a').first().waitFor();
  const beklenen = await page.evaluate(async () => {
    const { bugun, kaydet, yuruyusEserAdi } = await import('./js/ekranlar/ortak.js');
    const d = window.__atlas;
    d.ilerleme.gununDegisim = { tarih: bugun(), id: 'leonardo-da-vinci' };
    kaydet();
    // eski sürümden kalan cihaz seçimi: başka bir eser
    localStorage.setItem('sanat-atlasi:gunun-resmi', JSON.stringify({ 'leonardo-da-vinci': 'q:Q12418' }));
    return { ad: yuruyusEserAdi('leonardo-da-vinci'), ozgun: d.yuruyus['leonardo-da-vinci'].eser };
  });
  expect(beklenen.ad.length).toBeGreaterThan(0);
  await page.goto('./');
  const tuval = page.locator('[data-gunun-gorsel] > img');
  await expect(tuval).toHaveAttribute('alt', `Leonardo da Vinci, ${beklenen.ad}`, { timeout: 10000 });
  await expect(page.locator('[data-bugun-eser]')).toContainText(beklenen.ad);
  await expect(page.locator('[data-test="yur-adim"]').nth(1).locator('h2')).toHaveText(beklenen.ad);
  await page.goto('./#/ayarlar');
  const bolum = page.locator('[data-test="gunun-resimleri"]');
  await expect(bolum).toContainText('Ana ekranın resimleri');
  await expect(bolum.locator('textarea')).toHaveCount(0);
  await expect(bolum.locator('[data-test="gunun-resmi-ac"]')).toBeVisible();
});

// İş 159/161: Ayarlar → "Sırayla ortala": günün resimleri sırayla; odak kipi kendiliğinden açık, Tuval çerçevesi görünür;
// durum satırı elle / otomatik ve kaç tanesinin ortalandığını söyler; "Otomatiğe dön" elle odağı kaldırır
test('İş 159/161/171: yürüyüş eserleri sırayla açılır, ortalananlar ve sayaç görünür', async ({ page, context }) => {
  await agiHazirla(context);
  await kur(context);
  // İş 171: "Sırayla ortala" yürüyüş eserlerini açar; iki eserlik bir yürüyüş dosyası ve boş elle odak (diskten)
  const tum = JSON.parse(readFileSync(new URL('../../data/yuruyus.json', import.meta.url), 'utf8'));
  const ikisi = { ...tum, eserler: { 'giotto-di-bondone': tum.eserler['giotto-di-bondone'], 'jan-van-eyck': tum.eserler['jan-van-eyck'] } };
  await context.route(/data\/yuruyus\.json/, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ikisi) }));
  await context.route(/data\/gorsel_odak_elle\.json/, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"surum":1,"odak":{}}' }));
  await page.goto('./#/ayarlar');
  await page.locator('[data-test="gunun-resmi-ac"]').click();
  await expect(page.locator('.gor-resim')).toBeVisible();
  await expect(page.locator('.gor-yazi')).toContainText('ana ekran resmi 1 / 2');
  const dugme = page.locator('[data-gor-odak]');
  const durum = page.locator('[data-test="gor-odak-durum"]');
  const cerceve = page.locator('[data-test="gor-tuval-cerceve"]');
  const sil = page.locator('[data-test="gor-odak-sil"]');
  // odak kipi kendiliğinden açık
  await expect(dugme).toHaveText('Bitti');
  await expect(cerceve).toBeVisible();
  await expect(durum).toContainText('Otomatik');
  await expect(durum).toContainText('ortalanan 0 / 2');
  await expect(sil).toBeHidden();
  const r = await page.locator('.gor-resim').boundingBox();
  await page.mouse.click(r.x + r.width * 0.3, r.y + r.height * 0.5);
  await expect(page.locator('.gor-mesaj')).toContainText('Kaydedildi');
  await expect(durum).toContainText('Elle ortalandı ✓');
  await expect(durum).toContainText('ortalanan 1 / 2');
  await expect(cerceve).toBeVisible();
  await expect(dugme).toHaveText('Bitti'); // kip açık: yeniden dokunup düzeltilebilir
  const c = await cerceve.boundingBox();
  expect(c.x).toBeGreaterThanOrEqual(r.x - 1);
  expect(c.x + c.width).toBeLessThanOrEqual(r.x + r.width + 1);
  expect(Object.keys(await page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:odak-elle') || '{}')))).toHaveLength(1);
  // geri al
  await expect(sil).toBeVisible();
  await sil.click();
  await expect(durum).toContainText('Otomatik');
  await expect(durum).toContainText('ortalanan 0 / 2');
  expect(Object.keys(await page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:odak-elle') || '{}')))).toHaveLength(0);
  // yeniden işaretle, sonraki esere geç: orada da kip kendiliğinden açık, sayaç korunur
  await page.mouse.click(r.x + r.width * 0.5, r.y + r.height * 0.4);
  await expect(durum).toContainText('ortalanan 1 / 2');
  await page.locator('.gor-sonraki').click();
  await expect(page.locator('.gor-yazi')).toContainText('ana ekran resmi 2 / 2');
  await expect(dugme).toHaveText('Bitti');
  await expect(durum).toContainText('Otomatik');
  await expect(durum).toContainText('ortalanan 1 / 2');
  // Bitti: kip kapanır, çerçeve gider, durum kalır
  await dugme.click();
  await expect(dugme).toHaveText('Odağı işaretle');
  await expect(cerceve).toBeHidden();
  await expect(durum).toBeVisible();
});

// İş 163: Elle odaklar → "Bu cihazdakileri sil" cihazdaki listeyi siler
test('İş 163: Ayarlar’da bu cihazdaki elle odaklar silinir', async ({ page, context }) => {
  await agiHazirla(context);
  await kur(context);
  await context.addInitScript(() => {
    if (!sessionStorage.getItem('kuruldu')) {
      localStorage.setItem('sanat-atlasi:odak-elle', JSON.stringify({ abc123: [40, 30] }));
      sessionStorage.setItem('kuruldu', '1');
    }
  });
  await page.goto('./#/ayarlar');
  const bolum = page.locator('[data-test="elle-odak"]');
  await expect(bolum).toContainText('1 tablonun');
  page.once('dialog', (d) => d.accept());
  await page.locator('[data-test="elle-odak-temizle"]').click();
  await expect(page.locator('[data-test="elle-odak"]')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('sanat-atlasi:odak-elle'))).toBeNull();
});
