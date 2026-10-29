// İş 50: kullanım kolaylığı ve cilalama — dokunma alanları en az 44 pt, harita durakları örtülmez, boş turdan çıkış
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { agiHazirla } from './ortak.js';

// Elemanın ortasından yukarı/aşağı yürüyerek gerçekten o elemanı yakalayan dikey boy (görünmez genişletme dahil)
async function dokunmaBoylari(page, secici) {
  return page.evaluate((sec) => {
    const out = [];
    for (const e of document.querySelectorAll(sec)) {
      e.scrollIntoView({ block: 'center' });
      const k = e.getBoundingClientRect();
      if (!k.width) continue;
      const cx = k.left + k.width / 2;
      const cy = k.top + k.height / 2;
      let ust = 0;
      let alt = 0;
      while (ust < 40 && e.contains(document.elementFromPoint(cx, cy - ust - 1))) ust++;
      while (alt < 40 && e.contains(document.elementFromPoint(cx, cy + alt + 1))) alt++;
      out.push(ust + alt + 1);
    }
    return out;
  }, secici);
}

test('dokunma alanları: Göz At sekmeleri, Pekiştir ve İlerleme hapları en az 44 pt; dört sekme ekrana sığar', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/gozat');
  await expect(page.locator('.bolumler a')).toHaveCount(4);
  for (const b of await dokunmaBoylari(page, '.bolumler a')) expect(b).toBeGreaterThanOrEqual(44);
  // "Zaman" sekmesi kenardan kesilmez
  const son = await page.locator('.bolumler a').last().boundingBox();
  expect(son.x + son.width).toBeLessThanOrEqual(390);
  await page.goto('./#/pekistir');
  await expect(page.locator('.secim-hap button').first()).toBeVisible();
  for (const b of await dokunmaBoylari(page, '.secim-hap button')) expect(b).toBeGreaterThanOrEqual(44);
  // İlerleme'deki sıralama hapları yalnız cevap verilmiş birden çok akım varken çıkar (İş 56); varsa ölçülür
  await page.goto('./#/ilerleme');
  await expect(page.locator('[data-parca="alt"]')).toBeAttached();
  for (const b of await dokunmaBoylari(page, '.kucuk-hap button')) expect(b).toBeGreaterThanOrEqual(44);
});

test('harita: görünmez saklı motifler durakların ortasını örtmez', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/harita');
  await expect(page.locator('.harita-durak').first()).toBeAttached();
  const ortulen = await page.evaluate(() => {
    const out = [];
    for (const e of document.querySelectorAll('.harita-durak')) {
      e.scrollIntoView({ block: 'center' });
      const k = e.getBoundingClientRect();
      const ust = document.elementFromPoint(k.left + k.width / 2, k.top + k.height / 2);
      if (ust && !e.contains(ust) && ust.closest('.harita-motif')) out.push(e.dataset.bolum);
    }
    return out;
  });
  expect(ortulen).toEqual([]);
});

test('Pekiştir · Hatalarım boşken: başlık tek satır ("Pekiştir" üstte etiket), karışık tura ve Pekiştir’e dönüş düğmesi', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/pekistir/hatalar');
  await expect(page.locator('[data-test="kart-yok"]')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hatalarım');
  await expect(page.locator('.ust .ust-yazi')).toContainText('Pekiştir');
  await page.getByRole('link', { name: 'Karışık tur başlat' }).click();
  await expect(page.locator('[data-test="sanatci-secenekleri"] button')).toHaveCount(4);
});

// İş 51: geri dönünce ve sekmeye dönünce kaydırma yeri
const y = (page) => page.evaluate(() => Math.round(window.scrollY));
const gorunenAkimLinki = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('a[href^="#/akim/"]')]
      .find((a) => {
        const t = a.getBoundingClientRect().top;
        return t > 100 && t < innerHeight - 140;
      })
      .click(),
  );

test('geri düğmesiyle dönünce liste kalınan yerde açılır; ileri gidişte sayfa en baştan', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/gozat');
  await expect(page.locator('a[href^="#/akim/"]').first()).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect.poll(() => y(page)).toBe(900);
  await gorunenAkimLinki(page);
  await expect(page).toHaveURL(/#\/akim\//);
  await expect.poll(() => y(page)).toBe(0);
  await page.locator('.ust .geri, .geri').first().click();
  await expect(page).toHaveURL(/#\/gozat$/);
  await expect.poll(() => y(page)).toBe(900);
});

test('sekme çubuğu: başka sekmeden dönünce kalınan yer; açık sekmeye yeniden dokununca en başa', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/gozat');
  await expect(page.locator('a[href^="#/akim/"]').first()).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect.poll(() => y(page)).toBe(1200);
  await page.locator('#sekmeler a[data-sekme="ilerleme"]').click();
  await expect(page).toHaveURL(/#\/ilerleme$/);
  await page.locator('#sekmeler a[data-sekme="gozat"]').click();
  await expect(page).toHaveURL(/#\/gozat$/);
  await expect.poll(() => y(page)).toBe(1200);
  await page.locator('#sekmeler a[data-sekme="gozat"]').click();
  await expect.poll(() => y(page)).toBe(0);
});

// İş 52: görüntüleyicinin kendi geçmiş kaydı. iPhone'un sol kenardan geri hareketi tarayıcı geçmişinde bir adım
// geri gider (burada page.goBack); sayfa değil görüntüleyici kapanmalı.
test('görüntüleyici: geri hareketi görüntüleyiciyi kapatır, sayfada kalınır; ikinci geri önceki sayfaya', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/gozat');
  await expect(page.locator('a[href^="#/akim/"]').first()).toBeVisible();
  await page.goto('./#/sanatci/giotto-di-bondone');
  await page.locator('.eser').first().click();
  await expect(page.locator('.gor')).toBeVisible();
  await page.goBack();
  await expect(page.locator('.gor')).toHaveCount(0);
  await expect(page).toHaveURL(/#\/sanatci\/giotto-di-bondone$/);
  await page.goBack();
  await expect(page).toHaveURL(/#\/gozat$/);
});

test('görüntüleyici: X ile kapatınca geçmişte fazladan adım kalmaz; "Konu" bağlantısı konu sayfasına geçer, geri sanatçıya döner', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/gozat');
  await expect(page.locator('a[href^="#/akim/"]').first()).toBeVisible();
  await page.goto('./#/sanatci/giotto-di-bondone');
  await page.locator('.eser').first().click();
  await page.locator('.gor').getByRole('button', { name: 'Kapat' }).click();
  await expect(page.locator('.gor')).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/#\/gozat$/);
  // Konu bağlantısı
  await page.goto('./#/sanatci/giotto-di-bondone');
  await page.locator('.eser').first().click();
  const konu = page.locator('[data-test="gor-konu"]');
  await expect(konu).toBeVisible();
  await konu.click();
  await expect(page.locator('.gor')).toHaveCount(0);
  await expect(page).toHaveURL(/#\/konu\//);
  await page.goBack();
  await expect(page).toHaveURL(/#\/sanatci\/giotto-di-bondone$/);
  await expect(page.locator('.gor')).toHaveCount(0);
});

// İş 53: iPhone'a özgü dokunuşlar
test('iPhone: yazı alanları 16 pt (dokununca yakınlaşmaz); tur görsellerinde uzun basma menüsü kapalı', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/ayarlar');
  await expect(page.locator('#yedek-girdi')).toBeAttached();
  const boylar = await page.evaluate(() => [...document.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=hidden]), textarea, select')].map((e) => parseFloat(getComputedStyle(e).fontSize)));
  for (const b of boylar) expect(b).toBeGreaterThanOrEqual(16);
  await page.goto('./#/pekistir/karisik');
  const resim = page.locator('.soru-resim img');
  await expect(resim).toBeAttached();
  // Chromium -webkit-touch-callout'u tanımaz: kuralın soru görseline uyduğu seçiciden denetlenir
  const uyuyor = await resim.evaluate((img) =>
    [...document.styleSheets]
      .flatMap((s) => [...s.cssRules])
      .some((r) => r.selectorText && /sekmesiz #uygulama img/.test(r.selectorText) && img.matches(r.selectorText)),
  );
  expect(uyuyor).toBe(true);
});

test('iPhone: çift dokunma yakınlaştırması kapalı (görüntüleyici okları dahil); görüntüleyici sahnesi kendi hareketlerini korur', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/sanatci/giotto-di-bondone');
  await page.locator('.eser').first().click();
  const sonraki = page.locator('.gor .gor-sonraki');
  await expect(sonraki).toBeVisible();
  const ta = (sec) => page.locator(sec).first().evaluate((e) => getComputedStyle(e).touchAction);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).touchAction)).toBe('manipulation');
  expect(await ta('.gor .gor-sonraki')).toBe('manipulation');
  expect(await ta('.gor .gor-kapat')).toBe('manipulation');
  expect(await ta('.gor .gor-sahne')).toBe('none');
});

// İş 54: görüntüleyicide tek dokunuş arayüzü gizler; yatay ekranda resim tam ekran
test.describe('görüntüleyici dokunuş ve yatay ekran', () => {
  test.use({ hasTouch: true, isMobile: true });

  test('tek dokunuş arayüzü gizler/gösterir; çift dokunuş gizlemez, yakınlaştırır', async ({ page, context }) => {
    await agiHazirla(context);
    await page.goto('./#/sanatci/giotto-di-bondone');
    await page.locator('.eser').first().click();
    const gor = page.locator('.gor');
    const sahne = await page.locator('.gor-sahne').boundingBox();
    const x = sahne.x + sahne.width / 2;
    const y = sahne.y + sahne.height / 3;
    await page.touchscreen.tap(x, y);
    await expect(gor).toHaveClass(/sade/);
    await expect(page.locator('.gor-alt')).toHaveCSS('opacity', '0');
    await page.touchscreen.tap(x, y);
    await expect(gor).not.toHaveClass(/sade/);
    // çift dokunuş: yakınlaşır, arayüz kalır
    await page.touchscreen.tap(x, y);
    await page.waitForTimeout(80);
    await page.touchscreen.tap(x, y);
    await page.waitForTimeout(600);
    await expect(gor).not.toHaveClass(/sade/);
    expect(await page.locator('.gor-resim').evaluate((e) => e.style.transform)).toContain('scale(2.5)');
  });

  // İş 59: iki parmakla büyütüp parmakları kaldırmak dokunuş sayılıp arayüzü geri getiriyordu
  test('sade kipte iki parmakla büyütmek arayüzü geri getirmez, yakınlaştırma kalır', async ({ page, context }) => {
    await agiHazirla(context);
    await page.goto('./#/sanatci/giotto-di-bondone');
    await page.locator('.eser').first().click();
    const gor = page.locator('.gor');
    const sahne = await page.locator('.gor-sahne').boundingBox();
    const x = sahne.x + sahne.width / 2;
    const y = sahne.y + sahne.height / 2;
    await page.touchscreen.tap(x, y);
    await expect(gor).toHaveClass(/sade/);
    await page.waitForTimeout(400);
    const cdp = await context.newCDPSession(page);
    const dokun = (type, noktalar) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: noktalar.map(([px, py], id) => ({ x: px, y: py, id })) });
    await dokun('touchStart', [[x - 30, y]]);
    await dokun('touchStart', [[x - 30, y], [x + 30, y]]);
    for (let i = 1; i <= 6; i++) await dokun('touchMove', [[x - 30 - i * 15, y], [x + 30 + i * 15, y]]);
    // parmaklar art arda, hızlıca ve kıpırdamadan kalkar
    await dokun('touchEnd', [[x - 120, y]]);
    await dokun('touchEnd', []);
    await page.waitForTimeout(600);
    await expect(gor).toHaveClass(/sade/);
    expect(await page.locator('.gor-resim').evaluate((e) => e.style.transform)).not.toContain('scale(1)');
    // iki kez üst üste büyütmek de (çift dokunuş sayılıp) yakınlaştırmayı sıfırlamaz
    await dokun('touchStart', [[x - 30, y]]);
    await dokun('touchStart', [[x - 30, y], [x + 30, y]]);
    await dokun('touchMove', [[x - 40, y], [x + 40, y]]);
    await dokun('touchEnd', [[x - 40, y]]);
    await dokun('touchEnd', []);
    await page.waitForTimeout(600);
    await expect(gor).toHaveClass(/sade/);
    expect(await page.locator('.gor-resim').evaluate((e) => e.style.transform)).not.toContain('scale(1)');
  });

  test('yatay ekranda resim ekranın bütün yüksekliğini kullanır, açıklama alttan resmin üstünde', async ({ page, context }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await agiHazirla(context);
    await page.goto('./#/sanatci/giotto-di-bondone');
    await page.locator('.eser').first().click();
    const sahne = await page.locator('.gor-sahne').boundingBox();
    const alt = await page.locator('.gor-alt').boundingBox();
    expect(sahne.height).toBeGreaterThanOrEqual(388);
    expect(alt.y + alt.height).toBeLessThanOrEqual(391);
    expect(alt.height).toBeLessThanOrEqual(390 * 0.5);
  });
});

// İş 55: Konular kısaldı — her grupta en çok 6 konu ve "hepsi"; grubun bütün konuları kendi sayfasında
test('Konular: her grupta en çok 6 kart ve "hepsi" bağlantısı; grup sayfası bütün konuları gösterir, geri listeye döner', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/konular');
  const izgaralar = page.locator('[data-test="konu-listesi"]');
  await expect(izgaralar.first()).toBeVisible();
  for (const n of await izgaralar.evaluateAll((l) => l.map((u) => u.querySelectorAll('.konu-kart').length))) expect(n).toBeLessThanOrEqual(6);
  const hepsi = page.locator('[data-test="konu-hepsi"]').first();
  const toplam = Number((await hepsi.innerText()).match(/(\d+) konunun hepsi/)[1]);
  await hepsi.click();
  await expect(page).toHaveURL(/#\/konular\/[a-z_]+$/);
  await expect(page.locator('.konu-kart')).toHaveCount(toplam);
  await expect(page.locator('[data-test="konu-grup-serit"] a[aria-current="page"]')).toHaveCount(1);
  await page.locator('.ust .geri').click();
  await expect(page).toHaveURL(/#\/konular$/);
});

// İş 56: Başyapıtlar dönemlere göre; Defter'de cevap verilmemiş akımlar tek bölümde
test('Başyapıtlar haritanın dönemlerine göre gruplanır, kartta akımın adı; Defter cevapsız akımları haplarda toplar', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/basyapitlar');
  const basliklar = page.locator('.vitrin-ad');
  await expect(basliklar.first()).toContainText('Orta Çağ');
  expect(await basliklar.count()).toBeLessThanOrEqual(9);
  await expect(page.locator('.vitrin-akim').first()).not.toBeEmpty();
  await page.goto('./#/ilerleme');
  const cevapsiz = page.locator('[data-test="cevapsiz-akimlar"]');
  await expect(cevapsiz).toBeVisible();
  // yeni kullanıcı: hiç cevap yok, akım kartı yok, her açık akım bir hap
  await expect(page.locator('.akim-kart')).toHaveCount(0);
  const hap = cevapsiz.locator('a').first();
  await expect(hap).toHaveAttribute('href', /#\/pekistir\/donem\//);
});

// İş 57: görüntüleyiciyi açıp kapatınca sayfa en başa zıplamaz (X ile de geri hareketiyle de)
test('görüntüleyici kapanınca sayfa kaldığı yerde: X ile ve geri hareketiyle', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/sanatci/giotto-di-bondone');
  const eser = page.locator('.eser').nth(3);
  await expect(eser).toBeAttached();
  await eser.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  const once = await y(page);
  expect(once).toBeGreaterThan(50);
  await eser.evaluate((e) => e.click());
  await page.locator('.gor').getByRole('button', { name: 'Kapat' }).click();
  await expect(page.locator('.gor')).toHaveCount(0);
  await expect.poll(() => y(page)).toBe(once);
  await eser.evaluate((e) => e.click());
  await expect(page.locator('.gor')).toBeVisible();
  await page.goBack();
  await expect(page.locator('.gor')).toHaveCount(0);
  await expect.poll(() => y(page)).toBe(once);
});

// İş 58: görüntüleyici önce 1280'lik kopyayı gösterir, en büyük kopya (Cloudflare R2) gelince yerine geçer
test('görüntüleyici: en büyük kopya R2\'den arkada iner ve yerine geçer; yalnız açılan eser için', async ({ page, context }) => {
  await agiHazirla(context);
  const yerel = JSON.parse(readFileSync(new URL('../../data/yerel_gorseller.json', import.meta.url), 'utf8')).gorseller;
  const adlar = Object.values(yerel);
  await context.route(/\/data\/gorsel_kaynagi\.json$/, (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ surum: 1, adres: 'https://pub-deneme.r2.dev', buyuk: false, devasa: adlar, muze: Object.fromEntries(adlar.map((a) => [a, 'met'])) }) }),
  );
  const istenen = [];
  await context.route(/pub-deneme\.r2\.dev\/d\//, async (r) => {
    istenen.push(r.request().url());
    await new Promise((x) => setTimeout(x, 300));
    r.fulfill({ status: 200, contentType: 'image/png', body: readFileSync(new URL('../fixtures/eser.png', import.meta.url)), headers: { 'access-control-allow-origin': '*' } });
  });
  await page.goto('./#/sanatci/giotto-di-bondone');
  // service worker sayfayı devralmadan açılırsa büyük kopya onun önbelleğine uğramaz (aşağıdaki denetim için)
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 15000 }).toBe(true);
  await page.locator('.eser').first().click();
  const resim = page.locator('.gor-resim');
  await expect(resim).toHaveAttribute('src', /pub-deneme\.r2\.dev\/d\/[0-9a-f]+\.jpg$/);
  await expect(resim).toHaveAttribute('data-test', 'devasa');
  // İş 58c: büyük kopya Commons yerine aynı eserin müze görselinden geldiyse altyazıda yazar
  await expect(page.locator('[data-test="devasa-kaynak"]')).toHaveText('büyük kopya: The Met · CC0');
  // yalnız açılan eserin büyük kopyası; komşularınki değil (aynı adres önbellek atlanırsa iki kez istenebilir)
  expect(new Set(istenen).size).toBe(1);
  // İş 58e: en büyük kopya service worker'ın ayrı önbelleğinde (1280'lik ve küçük kopyaları itmesin)
  await expect.poll(() => page.evaluate(async () => (await (await caches.open('atlas-devasa')).keys()).map((r) => r.url))).toEqual([istenen[0]]);
  expect(await page.evaluate(async (u) => !!(await (await caches.open('atlas-resim-2')).match(u)), istenen[0])).toBe(false);
});

// İş 60: en büyük kopyalar Ayarlar'dan telefona; kalıcı önbellekte durur, internet olmadan görüntüleyicide açılır
test('Ayarlar: en büyük kopyalar telefona iner, kaldığı yerden sürer, internetsiz açılır, silinebilir', async ({ page, context }) => {
  await agiHazirla(context);
  let adlar = [];
  await context.route(/\/data\/gorsel_kaynagi\.json$/, (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ surum: 1, adres: 'https://pub-deneme.r2.dev', buyuk: false, devasa: adlar, devasa_bayt: 3e9 }) }),
  );
  let r2Acik = true;
  const istenen = [];
  await context.route(/pub-deneme\.r2\.dev\/d\//, (r) => {
    if (!r2Acik) return r.abort('internetdisconnected');
    istenen.push(r.request().url());
    return r.fulfill({ status: 200, contentType: 'image/png', body: readFileSync(new URL('../fixtures/eser.png', import.meta.url)), headers: { 'access-control-allow-origin': '*' } });
  });
  // Giotto'nun ilk üç eserinin yerel adları (ızgaradaki küçük kopyanın dosya adı)
  await page.goto('./#/sanatci/giotto-di-bondone');
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 15000 }).toBe(true);
  adlar = await page.locator('.eser img').evaluateAll((l) => l.slice(0, 3).map((i) => (i.getAttribute('src').match(/([0-9a-f]{16})\.jpg/) || [])[1]).filter(Boolean));
  expect(adlar.length).toBe(3);
  await page.goto('./#/ayarlar');
  await page.reload();
  const bolum = page.locator('[data-test="devasa-indir"]');
  await expect(bolum).toContainText('3 eserin');
  await expect(bolum).toContainText('3,0 GB');
  await expect(bolum).toContainText('Telefonda: 0 / 3');
  await bolum.locator('[data-devasa-indir]').click();
  await expect(page.locator('#devasa-mesaj')).toHaveText('Bitti: 3 görsel indirildi.');
  await expect(bolum).toContainText('Telefonda: 3 / 3');
  expect(await page.evaluate(async () => (await (await caches.open('atlas-devasa-kalici')).keys()).length)).toBe(3);
  // ikinci basış hiçbir şey indirmez
  const once = istenen.length;
  await bolum.locator('[data-devasa-indir]').click();
  await expect(page.locator('#devasa-mesaj')).toHaveText('Hepsi zaten telefonda.');
  expect(istenen.length).toBe(once);
  // internet yokken görüntüleyici en büyük kopyayı telefondan açar
  r2Acik = false;
  await page.goto('./#/sanatci/giotto-di-bondone');
  await page.locator('.eser').first().click();
  await expect(page.locator('.gor-resim')).toHaveAttribute('data-test', 'devasa');
  await page.keyboard.press('Escape');
  // silinir
  await page.goto('./#/ayarlar');
  page.once('dialog', (dl) => dl.accept());
  await bolum.locator('[data-devasa-sil]').click();
  await expect(bolum).toContainText('Telefonda: 0 / 3');
  expect(await page.evaluate(() => caches.has('atlas-devasa-kalici'))).toBe(false);
});

// İş 62: R2 Emre'nin alan adından (r2.dev mobil operatörde engelli); r2.dev adresiyle telefona inmiş büyük kopyalar taşınır
test('R2 kendi alan adından: büyük kopya ayrı önbellekte; r2.dev ile inmişler yeni adrese taşınır', async ({ page, context }) => {
  await agiHazirla(context);
  const png = readFileSync(new URL('../fixtures/eser.png', import.meta.url));
  let adlar = [];
  await context.route(/\/data\/gorsel_kaynagi\.json$/, (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ surum: 1, adres: 'https://gorsel.noracloud.ai', buyuk: false, devasa: adlar }) }),
  );
  await context.route(/gorsel\.noracloud\.ai\/d\//, (r) => r.fulfill({ status: 200, contentType: 'image/png', body: png, headers: { 'access-control-allow-origin': '*' } }));
  await page.goto('./#/sanatci/giotto-di-bondone');
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 15000 }).toBe(true);
  adlar = await page.locator('.eser img').evaluateAll((l) => l.slice(0, 2).map((i) => (i.getAttribute('src').match(/([0-9a-f]{16})\.jpg/) || [])[1]).filter(Boolean));
  // eski sürümün r2.dev adresiyle telefona indirdiği iki kopya
  await page.evaluate(
    async ({ a, bayt }) => {
      const c = await caches.open('atlas-devasa-kalici');
      for (const ad of a) await c.put(`https://pub-eski.r2.dev/d/${ad}.jpg`, new Response(new Uint8Array(bayt), { headers: { 'content-type': 'image/png' } }));
    },
    { a: adlar, bayt: [...png] },
  );
  // yeni service worker etkinleşince taşınır
  await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).unregister());
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 15000 }).toBe(true);
  await expect
    .poll(() => page.evaluate(async () => (await (await caches.open('atlas-devasa-kalici')).keys()).map((r) => r.url).sort()))
    .toEqual(adlar.map((a) => `https://gorsel.noracloud.ai/d/${a}.jpg`).sort());
  // görüntüleyici yeni adresteki büyük kopyayı açar
  await page.locator('.eser').first().click();
  await expect(page.locator('.gor-resim')).toHaveAttribute('src', /^https:\/\/gorsel\.noracloud\.ai\/d\//);
  await expect(page.locator('.gor-resim')).toHaveAttribute('data-test', 'devasa');
});

// İş 63: yeni sürüm indikten sonra uygulama arka plandan dönünce kendiliğinden yenilenir (iOS'ta "Yenile"ye basılmadan
// çıkılınca eski sayfa sürüyordu ve bildirim bir daha çıkmıyordu)
test('yeni sürüm indiyse arka plandan dönüşte sayfa kendiliğinden yenilenir', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/');
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 15000 }).toBe(true);
  await page.reload();
  await page.evaluate(() => (window.__eskiSayfa = true));
  // yeni sürüm yokken arka plandan dönüş hiçbir şey yapmaz
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.__eskiSayfa === true)).toBe(true);
  // yeni sürüm devraldı: bildirim çıkar; kullanıcı basmadan arka plana atıp döner
  await page.evaluate(() => navigator.serviceWorker.dispatchEvent(new Event('controllerchange')));
  await expect(page.locator('#bildirim')).toContainText('yeni sürümü hazır');
  await Promise.all([
    page.waitForEvent('load'),
    page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
      document.dispatchEvent(new Event('visibilitychange'));
    }),
  ]);
  expect(await page.evaluate(() => window.__eskiSayfa === undefined)).toBe(true);
});
