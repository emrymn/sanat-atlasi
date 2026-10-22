// Rapor 2. paket: D3 (cevap yaprağı eseri kapatmaz), Ö4 (Bilmiyorum), D6 (Türkçe konu adları, Sıradaki konu), İ3 (yedek hatırlatması)
import { test, expect } from '@playwright/test';
import { agiHazirla, ilerleme } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

test('D3: cevaptan sonra yalnızca doğru ve seçilen seçenek kalır, eser yaprağın üstünde görünür', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/pekistir/donem/hepsi');
  const secenekler = page.locator('[data-test="sanatci-secenekleri"] button');
  await expect(secenekler).toHaveCount(4);
  const dogruId = await page.evaluate(() => window.__atlas.oturum.kart.id);
  // yanlış bir seçenek seç: iki seçenek kalır
  const yanlis = page.locator(`[data-test="sanatci-secenekleri"] button:not([data-sanatci="${dogruId}"])`).first();
  await yanlis.click();
  await expect(page.locator('[data-test="sonuc"]')).toBeVisible();
  await expect(secenekler).toHaveCount(2);
  await expect(page.locator('[data-test="sanatci-secenekleri"] .dogru')).toHaveCount(1);
  await expect(page.locator('[data-test="sanatci-secenekleri"] .yanlis')).toHaveCount(1);
  // eser ve iki seçenek yaprağın üstünde, ekranda
  const yaprak = await page.locator('.alt-yaprak').boundingBox();
  const resim = await page.locator('[data-test="soru-resim"]').boundingBox();
  const son = await secenekler.last().boundingBox();
  expect(resim.y).toBeGreaterThanOrEqual(0);
  expect(resim.y + resim.height).toBeLessThanOrEqual(yaprak.y + 1);
  expect(resim.height).toBeGreaterThan(100);
  expect(son.y + son.height).toBeLessThanOrEqual(yaprak.y + 1);
  await expect(page.locator('[data-sonraki]')).toBeInViewport();
});

test('D3: uzun ipucu dokununca tamamen açılır', async ({ page }) => {
  await page.goto('./#/pekistir/donem/hepsi');
  // ipucu uzun olan ilk karta kadar cevapla
  for (let i = 0; i < 8; i++) {
    await page.locator('[data-test="sanatci-secenekleri"] button').first().click();
    await expect(page.locator('[data-test="sonuc"]')).toBeVisible();
    if (await page.locator('[data-ipucu].kesik').count()) break;
    await page.locator('[data-sonraki]').click();
  }
  const kutu = page.locator('[data-ipucu].kesik');
  await expect(kutu).toHaveCount(1);
  await expect(kutu).toHaveAttribute('aria-expanded', 'false');
  const once = (await kutu.boundingBox()).height;
  await kutu.click();
  await expect(kutu).toHaveAttribute('aria-expanded', 'true');
  expect((await kutu.boundingBox()).height).toBeGreaterThan(once);
});

test('Ö4: "Bilmiyorum" yanlış sayılır; karıştırılan ikiliye yazılmaz, seviyeye yarım ağırlıkla girer', async ({ page }) => {
  await page.goto('./#/pekistir/karisik');
  await expect(page.locator('[data-test="sanatci-secenekleri"] button')).toHaveCount(4);
  const { id, akim } = await page.evaluate(() => {
    const d = window.__atlas;
    return { id: d.oturum.kart.id, akim: d.harita.get(d.oturum.kart.id).akim };
  });
  await page.locator('[data-test="bilmiyorum"]').click();
  await expect(page.locator('[data-test="sonuc"]')).toHaveAttribute('data-dogru', 'false');
  await expect(page.locator('[data-test="sonuc"]')).toContainText('Bilmiyorum');
  // yalnızca doğru seçenek kalır, işaretli
  await expect(page.locator('[data-test="sanatci-secenekleri"] button')).toHaveCount(1);
  await expect(page.locator('[data-test="sanatci-secenekleri"] .dogru')).toHaveCount(1);
  await expect(page.locator('[data-test="karsilastir"]')).toHaveCount(0);
  await expect(page.locator('[data-test="bilmiyorum"]')).toHaveCount(0);
  // akım sorusunda da var
  await page.locator('[data-ikinci]').click();
  await page.locator('[data-test="bilmiyorum"]').click();
  await expect(page.locator('[data-test="akim-secenekleri"] button')).toHaveCount(1);
  const i = await ilerleme(page);
  expect(i.skorlar[id].sanatci.kutu).toBe(0);
  expect(i.skorlar[id].sanatci.yanlis).toBe(1);
  expect(i.skorlar[id].akim.yanlis).toBe(1);
  expect(Object.keys(i.karisanlar || {})).toHaveLength(0);
  expect(i.seviyeler[akim].son).toEqual([2]);
  expect(i.gunluk.kart).toBe(1);
});

test('D6: İlerleme Türkçe konu adları ve Sıradaki konu; İşlendi yap bir sonrakine geçer', async ({ page }) => {
  await page.goto('./#/ilerleme');
  const kart = page.locator('[data-test="siradaki-konu"]');
  await expect(kart).toBeVisible();
  const { no, sonraki } = await page.evaluate(() => {
    const d = window.__atlas;
    const isl = new Set(d.ilerleme.islenen);
    const bekleyen = d.konular.filter((k) => !isl.has(k.no));
    return { no: bekleyen[0].no, sonraki: bekleyen[1].no };
  });
  await expect(kart.locator('.siradaki-no')).toHaveText(String(no));
  // Türkçe kısa başlık; özgün İngilizce ad listede küçük satırda
  const tr = await page.evaluate((no) => window.__atlas.konularTr.konular[String(no)], no);
  await expect(kart).toContainText(tr);
  await kart.locator('[data-konu-isle]').click();
  await expect(kart.locator('.siradaki-no')).toHaveText(String(sonraki));
  const i = await ilerleme(page);
  expect(i.islenen).toContain(no);
  // kitaplıkta konuya dokununca konu kartı: Türkçe başlık ve özgün ad
  await page.locator('[data-kurs-konu="4"]').click();
  const konuKarti = page.locator('[data-test="konu-karti"]');
  await expect(konuKarti).toContainText('Giotto, Dante ve Arena Şapeli');
  await expect(konuKarti).toContainText('Giotto, Dante and the Arena Chapel');
});

test('İ3: 14 günden eski yedekte Bugün’de hatırlatma; Yedekle panoya kopyalar ve satır kalkar', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('./');
  await page.waitForFunction(() => localStorage.getItem('sanat-atlasi:ilerleme'));
  // henüz cevap yok: hatırlatma yok
  await expect(page.locator('[data-test="yedek-hatirlat"]')).toHaveCount(0);
  await page.evaluate(() => {
    const i = JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme'));
    i.skorlar = { 'giotto-di-bondone': { sanatci: { kutu: 1, sonraki: '2099-01-01', dogru: 1, yanlis: 0, son: '2026-01-01' } } };
    i.sonYedek = '2020-01-01';
    localStorage.setItem('sanat-atlasi:ilerleme', JSON.stringify(i));
  });
  await page.reload();
  const satir = page.locator('[data-test="yedek-hatirlat"]');
  await expect(satir).toContainText(/Son yedek \d+ gün önce/);
  await satir.getByRole('button', { name: 'Yedekle' }).click();
  await expect(satir).toContainText('panoya kopyalandı');
  const pano = await page.evaluate(() => navigator.clipboard.readText());
  expect(JSON.parse(pano).uygulama).toBe('sanat-atlasi');
  const i = await ilerleme(page);
  expect(i.sonYedek).toBe(i.gunluk.tarih);
  await page.reload();
  await expect(page.locator('[data-test="yedek-hatirlat"]')).toHaveCount(0);
});

test('İlerleme kitaplığı: her konu bir kitap, sıradaki çekili; kartta işlendi yapılır', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/ilerleme');
  await expect(page.locator('.kitaplik')).toBeVisible();
  const { konuSayisi, islenen, sira } = await page.evaluate(() => {
    const d = window.__atlas;
    const isl = new Set(d.ilerleme.islenen);
    return { konuSayisi: d.konular.length, islenen: [...isl], sira: d.konular.find((k) => !isl.has(k.no)).no };
  });
  await expect(page.locator('.kitap')).toHaveCount(konuSayisi);
  await expect(page.locator('.destek')).toHaveCount(9);
  await expect(page.locator('.kitap.islendi')).toHaveCount(islenen.length);
  await expect(page.locator('.kitap.sira')).toHaveAttribute('data-kurs-konu', String(sira));
  // parlak gün rengi kullanılmaz: sıradaki numarası ve düğmesi mürekkep renginde
  const renkler = await page.evaluate(() => {
    const cs = (s) => getComputedStyle(document.querySelector(s));
    return { no: cs('.siradaki-no').color, dugme: cs('.siradaki-dugme').backgroundColor, ink: getComputedStyle(document.body).color };
  });
  expect(renkler.no).toBe(renkler.ink);
  expect(renkler.dugme).toBe('rgba(0, 0, 0, 0)');
  // sıradaki kitaba dokun → kart açılır → işlendi yap → kitap akım rengine boyanır
  await page.locator(`[data-kurs-konu="${sira}"]`).click();
  const kart = page.locator('[data-test="konu-karti"]');
  await expect(kart).toBeVisible();
  await kart.getByRole('switch', { name: `Konu ${sira} işlendi` }).check();
  const kitap = page.locator(`[data-kurs-konu="${sira}"]`);
  await expect(kitap).toHaveClass(/islendi/);
  // aynı kitaba yeniden dokununca kart kapanır
  await kitap.click();
  await expect(kart).toHaveCount(0);
});
