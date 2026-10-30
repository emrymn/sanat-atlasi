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

// İş 75: uygulamanın kenardan geri kaydırması (parmak sol kenardan sağa)
async function kenarKaydir(page, context) {
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 6, y: 420 }] });
  for (let i = 1; i <= 12; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 6 + i * 25, y: 422 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(500);
}

test('dokunma alanları: Göz At sekmeleri, Pekiştir ve İlerleme hapları en az 44 pt; dört sekme ekrana sığar', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/gozat');
  await expect(page.locator('.bolumler a')).toHaveCount(4);
  for (const b of await dokunmaBoylari(page, '.bolumler a')) expect(b).toBeGreaterThanOrEqual(44);
  // "Zaman" sekmesi kenardan kesilmez
  const son = await page.locator('.bolumler a').last().boundingBox();
  expect(son.x + son.width).toBeLessThanOrEqual(390.5); // piksel altı (yazı tipi çizimi makineden makineye)
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

// İş 52 → İş 75: görüntüleyici iPhone'un geçmişine kayıt eklemez; kenardan kaydırma (uygulamanın kendi hareketi)
// görüntüleyiciyi kapatır, sayfada kalınır; ikinci kaydırma önceki sayfaya döner
test.describe('görüntüleyici ve kenardan kaydırma', () => {
  test.use({ hasTouch: true, isMobile: true });

  test('kenardan kaydırma görüntüleyiciyi kapatır, sayfada kalınır; ikinci kaydırma önceki sayfaya', async ({ page, context }) => {
    await agiHazirla(context);
    await page.goto('./#/gozat');
    await expect(page.locator('a[href^="#/akim/"]').first()).toBeVisible();
    const once = await page.evaluate(() => history.length);
    await page.evaluate(() => (location.hash = '#/sanatci/giotto-di-bondone'));
    await page.locator('.eser').first().click();
    await expect(page.locator('.gor')).toBeVisible();
    expect(await page.evaluate(() => history.length)).toBeLessThanOrEqual(once + 1);
    await kenarKaydir(page, context);
    await expect(page.locator('.gor')).toHaveCount(0);
    await expect(page).toHaveURL(/#\/sanatci\/giotto-di-bondone$/);
    await kenarKaydir(page, context);
    await expect(page).toHaveURL(/#\/gozat$/);
  });

  test('X ile kapatınca geçmişe kayıt kalmaz; "Konu" bağlantısı konu sayfasına geçer, geri oku sanatçıya döner', async ({ page, context }) => {
    await agiHazirla(context);
    await page.goto('./#/sanatci/giotto-di-bondone');
    await page.locator('.eser').first().waitFor();
    // konular (Konu bağlantısı) ilk ekrandan 1,5 sn sonra yüklenir
    await page.waitForTimeout(2000);
    const once = await page.evaluate(() => history.length);
    await page.locator('.eser').first().click();
    await page.locator('.gor').getByRole('button', { name: 'Kapat' }).click();
    await expect(page.locator('.gor')).toHaveCount(0);
    expect(await page.evaluate(() => history.length)).toBe(once);
    // Konu bağlantısı
    await page.locator('.eser').first().click();
    const konu = page.locator('[data-test="gor-konu"]');
    await expect(konu).toBeVisible();
    await konu.click();
    await expect(page.locator('.gor')).toHaveCount(0);
    await expect(page).toHaveURL(/#\/konu\//);
    expect(await page.evaluate(() => history.length)).toBe(once);
    await page.locator('[data-geri]').first().click();
    await expect(page).toHaveURL(/#\/sanatci\/giotto-di-bondone$/);
    await expect(page.locator('.gor')).toHaveCount(0);
  });

  // İş 57: görüntüleyiciyi açıp kapatınca sayfa en başa zıplamaz (X ile de kenardan kaydırmayla da)
  test('görüntüleyici kapanınca sayfa kaldığı yerde: X ile ve kenardan kaydırmayla', async ({ page, context }) => {
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
    await kenarKaydir(page, context);
    await expect(page.locator('.gor')).toHaveCount(0);
    await expect.poll(() => y(page)).toBe(once);
  });
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
    // çift dokunuş: yakınlaşır, arayüz kalır. İki dokunuş CDP ile art arda gönderilir (makine yüklüyken
    // touchscreen.tap'ler arası 320 ms'yi aşıp iki ayrı tek dokunuş sayılabiliyordu)
    const cdp = await context.newCDPSession(page);
    const ciftDokun = async () => {
      for (let i = 0; i < 2; i++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      }
    };
    await ciftDokun();
    await page.waitForTimeout(600);
    await expect(gor).not.toHaveClass(/sade/);
    // İş 81: yakınlaştırma parmak kalkınca kutunun boyutuna işlenir (transform'da yalnız kaydırma): tam çözünürlükte çizilir
    await expect
      .poll(() => page.locator('.gor-resim').evaluate((e) => e.getBoundingClientRect().width / e.closest('.gor-sahne').getBoundingClientRect().width))
      .toBeGreaterThan(1.5);
    await expect.poll(() => page.locator('.gor-resim').evaluate((e) => [e.style.transform.includes('scale(1)'), /px$/.test(e.style.width)])).toEqual([true, true]);
    // ikinci çift dokunuş: eski boyuta döner
    await ciftDokun();
    await page.waitForTimeout(600);
    expect(await page.locator('.gor-resim').evaluate((e) => [e.style.width, e.getBoundingClientRect().width <= e.closest('.gor-sahne').getBoundingClientRect().width + 1])).toEqual(['', true]);
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
    expect(await page.locator('.gor-resim').evaluate((e) => e.getBoundingClientRect().width > e.closest('.gor-sahne').getBoundingClientRect().width * 1.2)).toBe(true);
    // iki kez üst üste büyütmek de (çift dokunuş sayılıp) yakınlaştırmayı sıfırlamaz
    await dokun('touchStart', [[x - 30, y]]);
    await dokun('touchStart', [[x - 30, y], [x + 30, y]]);
    await dokun('touchMove', [[x - 40, y], [x + 40, y]]);
    await dokun('touchEnd', [[x - 40, y]]);
    await dokun('touchEnd', []);
    await page.waitForTimeout(600);
    await expect(gor).toHaveClass(/sade/);
    expect(await page.locator('.gor-resim').evaluate((e) => e.getBoundingClientRect().width > e.closest('.gor-sahne').getBoundingClientRect().width * 1.2)).toBe(true);
  });

  // İş 64: iPhone'da "Yenile"ye dokunulamıyordu (Tuval'deki 3B dönen tablo dokunuşu alıyordu)
  test('güncelleme bildiriminin her yeri dokunulabilir; Tuval tablosu dokunuş almaz', async ({ page, context }) => {
    await agiHazirla(context);
    await page.goto('./#/');
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 15000 }).toBe(true);
    await page.reload();
    await expect(page.locator('.bugun-kahraman > img')).toHaveCSS('pointer-events', 'none');
    await page.evaluate(() => (window.__eskiSayfa = true));
    await page.evaluate(() => navigator.serviceWorker.dispatchEvent(new Event('controllerchange')));
    const b = page.locator('#bildirim');
    await expect(b).toContainText('yeni sürümü hazır');
    const k = await b.boundingBox();
    // düğmeye değil, yazının üstüne dokunulur
    await Promise.all([page.waitForEvent('load'), page.touchscreen.tap(k.x + 24, k.y + k.height / 2)]);
    expect(await page.evaluate(() => window.__eskiSayfa === undefined)).toBe(true);
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

// İş 58: görüntüleyici önce 1280'lik kopyayı gösterir, en büyük kopya (Cloudflare R2) gelince yerine geçer
test('görüntüleyici: en büyük kopya R2\'den arkada iner ve yerine geçer; yalnız açılan eser için', async ({ page, context }) => {
  await agiHazirla(context);
  const yerel = JSON.parse(readFileSync(new URL('../../data/yerel_gorseller.json', import.meta.url), 'utf8')).gorseller;
  const adlar = Object.values(yerel);
  await context.route(/\/data\/gorsel_kaynagi\.json(\?.*)?$/, (r) =>
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
  await context.route(/\/data\/gorsel_kaynagi\.json(\?.*)?$/, (r) =>
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
  await context.route(/\/data\/gorsel_kaynagi\.json(\?.*)?$/, (r) =>
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

// İş 65: ara sunucu (GitHub Pages/Fastly) eski dosya verirse yeni sürüm yarım kurulmaz; dosyalar sürüm sorgusuyla istenir
test('service worker kabuğu sürüm sorgusuyla indirir; sürüm dosyası eskiyse kurulmaz', async ({ page, context }) => {
  await agiHazirla(context);
  const istenen = [];
  let eski = true;
  await context.route(/\/js\/surum\.js(\?.*)?$/, async (r) => {
    istenen.push(new URL(r.request().url()).search);
    if (eski && r.request().url().includes('?v=')) return r.fulfill({ status: 200, contentType: 'text/javascript', body: "export const SURUM = '0.0.1';\n" });
    return r.continue();
  });
  await page.goto('./#/');
  await page.waitForTimeout(3000);
  expect(istenen.some((q) => /^\?v=\d+\.\d+\.\d+$/.test(q))).toBe(true);
  // eski sürüm dosyası geldi: kurulum başarısız, sayfayı service worker yönetmiyor
  expect(await page.evaluate(async () => !!(await navigator.serviceWorker.getRegistration())?.active)).toBe(false);
  // ara sunucu tazelenince bir sonraki açılışta kurulur
  eski = false;
  await page.reload();
  await expect.poll(() => page.evaluate(async () => !!(await navigator.serviceWorker.getRegistration())?.active), { timeout: 15000 }).toBe(true);
});

// İş 66: cilalama turu
test('İş 66: durum hapı portrenin üstünde; cevapsız ilerlemede boş grafikler yerine kısa satır; bölüm adı kesilmez', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/gunun');
  expect(await page.locator('.sanatci-ust').evaluate((e) => getComputedStyle(e).zIndex)).toBe('1');
  await page.goto('./#/ilerleme');
  await expect(page.locator('[data-test="yuk-ozet"]')).toHaveText('Tekrarı gelen sanatçı yok');
  await expect(page.locator('[data-test="yuk"] svg')).toHaveCount(0);
  await expect(page.locator('[data-test="egri"] svg')).toHaveCount(0);
  const b = page.locator('.salon-raf-yazi b').first();
  expect(await b.evaluate((e) => getComputedStyle(e).whiteSpace)).toBe('normal');
});

// İş 68: cevap verilince tablo da tepki verir (doğruda yaldız ışığı, yanlışta sarsılma)
test('İş 68: doğru/yanlış anında tablonun animasyonu', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/pekistir/karisik');
  await page.locator('.soru-resim img.yuklendi').waitFor();
  await page.locator('.secenek').first().click();
  const dogru = await page.locator('.sonuc').first().getAttribute('data-dogru');
  const ad = await page.locator('.soru-resim img').evaluate((i) => getComputedStyle(i).animationName);
  expect(ad).toBe(dogru === 'true' ? 'tablo-yaldiz' : 'tablo-sars, tablo-sol');
});

// İş 69: tablonun ışığı; görüntüleyicide tablonun küçük kopyası bulanık olarak arkasında, yüklenince yanar
test('İş 69: görüntüleyicide tablonun ışığı', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/sanatci/giotto-di-bondone');
  await page.locator('.eser').first().click();
  const sahne = page.locator('.gor-sahne');
  await expect.poll(() => sahne.evaluate((e) => e.style.getPropertyValue('--isik-op'))).toBe('1');
  expect(await sahne.evaluate((e) => e.style.getPropertyValue('--isik-resim'))).toMatch(/^url\(".*gorseller\/k\/[0-9a-f]+\.jpg"\)$/);
  const once = await sahne.evaluate((e) => getComputedStyle(e, '::before').filter);
  expect(once).toContain('blur');
});

// İş 70: iPhone tarzı geçişler (testlerde kapalı; burada açılır). Geçişten sonra kopya kalmaz, sayfa doğru, taşma yok
test.describe('İş 70: geçişler açıkken akış bozulmaz', () => {
  test.use({ hasTouch: true, isMobile: true });

  test('sayfa kayması, geri, kart büyümesi, görüntüleyici açılış/kapanış ve aşağı çekme', async ({ page, context }) => {
    await agiHazirla(context);
    await context.addInitScript(() => (window.__atlasGecis = true));
    const hatalar = [];
    page.on('pageerror', (e) => hatalar.push(e.message));
    const temiz = async () => {
      await expect(page.locator('.gecis-kopya, .gor-ucan')).toHaveCount(0, { timeout: 4000 });
      await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('gecis-suruyor'))).toBe(false);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    };
    await page.goto('./#/gozat');
    await page.locator('a[href^="#/akim/"]').first().waitFor();
    // ileri: kayarak gelir
    await page.locator('a[href^="#/akim/"]').first().tap();
    await expect(page).toHaveURL(/#\/akim\//);
    // İş 70b: kopyasız (uzun sayfada kopya iPhone'u kasıyordu)
    expect(await page.locator('.gecis-kopya').count()).toBe(0);
    await temiz();
    expect(await page.locator('#uygulama').evaluate((e) => getComputedStyle(e).transform)).toBe('none');
    // geri düğmesi: eski sayfa sağa çekilir
    await page.locator('[data-geri]').first().tap();
    await expect(page).toHaveURL(/#\/gozat$/);
    await temiz();
    // kart büyüyerek açılır
    await page.goto('./#/basyapitlar');
    const kart = page.locator('.vitrin-kart').first();
    await kart.waitFor();
    await kart.tap();
    await expect(page.locator('.gecis-kopya')).toHaveCount(1);
    await expect(page.locator('[data-test="basyapit"]')).toBeVisible();
    await temiz();
    // görüntüleyici: küçük resimden açılır ve yerine döner
    await page.goto('./#/sanatci/giotto-di-bondone');
    const eser = page.locator('.eser img.yuklendi, .eser img').first();
    await eser.waitFor();
    await page.waitForTimeout(500);
    await page.locator('.eser').first().tap();
    await expect(page.locator('.gor')).toHaveCount(1);
    await temiz();
    await expect(page.locator('.gor-resim')).toBeVisible();
    // aşağı çekme: zemin şeffaflaşır, bırakınca kapanır
    const cdp = await context.newCDPSession(page);
    const s = await page.locator('.gor-sahne').boundingBox();
    const x = s.x + s.width / 2;
    const y = s.y + s.height / 3;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let i = 1; i <= 6; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + i * 40 }] });
    await expect(page.locator('.gor')).toHaveClass(/cekiliyor/);
    const zemin = await page.locator('.gor').evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(zemin).toMatch(/rgba\(.*, 0\.\d+\)/);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect(page.locator('.gor')).toHaveCount(0, { timeout: 4000 });
    await temiz();
    await expect(page.locator('.eser').first()).toBeVisible();
    expect(await page.locator('.eser img').first().evaluate((e) => e.style.visibility)).toBe('');
    expect(hatalar).toEqual([]);
  });

  test('görüntüleyicinin zemini çekmeden önce tam koyu; açılırken sonraki esere geçince uçan kopya kalmaz', async ({ page, context }) => {
    await agiHazirla(context);
    await context.addInitScript(() => (window.__atlasGecis = true));
    await page.goto('./#/sanatci/giotto-di-bondone');
    await page.locator('.eser img').first().waitFor();
    await page.waitForTimeout(500);
    await page.locator('.eser').first().tap();
    await page.locator('.gor-sonraki').click();
    await expect(page.locator('.gor-ucan')).toHaveCount(0, { timeout: 3000 }); // makine yüklüyken açılış uçuşu gecikebiliyor
    const zemin = await page.locator('.gor').evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(zemin).toBe('rgb(11, 10, 11)');
  });
});

// İş 71: sekme çubuğunda sekmelerin arasına, kenar boşluğuna ya da parmak çubuktan taşarak yapılan dokunuş da algılanır
test.describe('İş 71: sekme çubuğu dokunuşları', () => {
  test.use({ hasTouch: true, isMobile: true });

  test('kenar boşluğuna ve sekme arasına dokunuş en yakın sekmeyi açar; açık sekmeye dokunmak başa döner', async ({ page, context }) => {
    await agiHazirla(context);
    await page.goto('./#/');
    const nav = page.locator('#sekmeler');
    await nav.waitFor();
    const r = await nav.boundingBox();
    const linkler = page.locator('#sekmeler a');
    const kutu = async (i) => linkler.nth(i).boundingBox();
    // Galeri (3.) sekmesinin hizasında, çubuğun üst kenar boşluğuna (bağlantının dışı)
    const g = await kutu(2);
    await page.touchscreen.tap(g.x + g.width / 2, r.y + 2);
    await expect(page).toHaveURL(/#\/gozat$/);
    // 4. ile 5. sekmenin tam arasına yakın, alt kenar boşluğuna: en yakını
    const a4 = await kutu(3);
    await page.touchscreen.tap(a4.x + a4.width - 3, r.y + r.height - 2);
    await expect(linkler.nth(3)).toHaveAttribute('aria-current', 'page');
    // tek dokunuş tek gezinme (ardından gelen tıklama ikinci kez gezinmez); İş 75: sekmeler geçmişe yazılmaz
    const once = await page.evaluate(() => history.length);
    await page.touchscreen.tap((await kutu(0)).x + 20, r.y + r.height / 2);
    await expect(page).toHaveURL(/#\/$/);
    expect(await page.evaluate(() => history.length)).toBe(once);
  });
});

// İş 73: iPhone dokunuşu tıklamaya çevirmezse (Göz At'ta dönem kartı iki dokunuşla açılıyordu) uygulama tamamlar
test.describe('İş 73: yutulan dokunuş', () => {
  test.use({ hasTouch: true, isMobile: true });

  test('tıklaması yutulan dokunuş yine de dönemi açar; tıklama gelirse ikinci kez gezinilmez', async ({ page, context }) => {
    await agiHazirla(context);
    await page.goto('./#/gozat');
    const kart = page.locator('a.zaman-kart').first();
    await kart.waitFor();
    // Safari'nin ilk tıklamayı yutmasının taklidi
    await page.evaluate(() => {
      window.__yutuldu = 0;
      window.addEventListener('click', (e) => {
        if (!window.__yutuldu && e.target.closest('a.zaman-kart')) {
          window.__yutuldu = 1;
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }, true);
    });
    const b = await kart.boundingBox();
    await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
    await expect(page).toHaveURL(/#\/akim\//);
    expect(await page.evaluate(() => window.__yutuldu)).toBe(1);
    // normal dokunuş: tek gezinme
    await page.goto('./#/gozat');
    await kart.waitFor();
    const once = await page.evaluate(() => history.length);
    const b2 = await kart.boundingBox();
    await page.touchscreen.tap(b2.x + b2.width / 2, b2.y + b2.height / 2);
    await expect(page).toHaveURL(/#\/akim\//);
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => history.length)).toBe(once);
  });

  test('kaydırma (kıpırdayan parmak) tıklama sayılmaz', async ({ page, context }) => {
    await agiHazirla(context);
    await page.goto('./#/gozat');
    const kart = page.locator('a.zaman-kart').first();
    await kart.waitFor();
    const b = await kart.boundingBox();
    const cdp = await context.newCDPSession(page);
    const x = b.x + b.width / 2;
    const y = b.y + b.height / 2;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let i = 1; i <= 5; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - i * 12 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/#\/gozat$/);
  });
});

// İş 75: kenardan kaydırarak geri: önceki sayfa altta gerçek hâliyle görünür, bırakınca yeniden çizilmeden
// (bellekten) kaldığı yerde gelir; geri oku da bellekten; uygulama içi gezinme iPhone'un geçmişine yazılmaz
test.describe('İş 75: kenardan kaydırma ve sayfa belleği', () => {
  test.use({ hasTouch: true, isMobile: true });

  test('önceki sayfa altta görünür; bırakınca aynı düğümlerle ve kaydırma yerinde döner; geçmiş büyümez', async ({ page, context }) => {
    await agiHazirla(context);
    await context.addInitScript(() => (window.__atlasGecis = true));
    await page.goto('./#/gozat');
    const kart = page.locator('a.zaman-kart').first();
    await kart.waitFor();
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(200);
    const yer = await page.evaluate(() => window.scrollY);
    // sayfanın bir düğümünü işaretle: geri dönünce aynı düğüm (yeniden çizilmedi) olmalı
    await page.evaluate(() => (document.querySelector('a.zaman-kart').dataset.iz = 'evet'));
    const once = await page.evaluate(() => history.length);
    await page.locator('a.zaman-kart').nth(1).tap();
    await expect(page).toHaveURL(/#\/akim\//);
    await expect(page.locator('#uygulama .ust h1')).toBeVisible();
    await page.waitForTimeout(700);
    expect(await page.evaluate(() => history.length)).toBe(once);
    // kaydırmanın ortasında önceki sayfa altta
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 6, y: 400 }] });
    for (let i = 1; i <= 6; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 6 + i * 25, y: 402 }] });
    await expect(page.locator('.sayfa-katman a.zaman-kart[data-iz="evet"]')).toHaveCount(1);
    // yeniden konan düğümlerde giriş animasyonları baştan oynamaz (önceki sayfa bir an boş/siyah görünüyordu)
    const oynayan = await page.evaluate(() =>
      document.querySelector('.sayfa-katman').getAnimations({ subtree: true }).filter((a) => a.playState === 'running' && a.effect.getTiming().iterations !== Infinity && a.effect.target.closest('.sayfa-katman-ic')).length,
    );
    expect(oynayan).toBe(0);
    // İş 86e: sayfa parmakla birlikte açıldığı öğenin şekline daralır (clip-path); kutusu bilinmiyorsa kayar (transform)
    await expect.poll(() => page.locator('#uygulama').evaluate((e) => !!(e.style.clipPath || e.style.transform))).toBe(true);
    for (let i = 7; i <= 12; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 6 + i * 25, y: 402 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect(page).toHaveURL(/#\/gozat$/);
    await expect(page.locator('#uygulama a.zaman-kart[data-iz="evet"]')).toHaveCount(1);
    await expect(page.locator('.sayfa-katman')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(yer);
    expect(await page.locator('#uygulama').evaluate((e) => e.style.transform + e.style.clipPath)).toBe('');
    // az kaydırıp bırakınca sayfada kalınır
    await page.locator('a.zaman-kart').nth(1).tap();
    await expect(page).toHaveURL(/#\/akim\//);
    await page.waitForTimeout(700);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 6, y: 400 }] });
    for (let i = 1; i <= 3; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 6 + i * 15, y: 401 }] });
    await page.waitForTimeout(100);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(600);
    await expect(page).toHaveURL(/#\/akim\//);
    await expect(page.locator('.sayfa-katman')).toHaveCount(0);
    // geri oku da bellekten
    await page.locator('[data-geri]').first().tap();
    await expect(page).toHaveURL(/#\/gozat$/);
    await expect(page.locator('#uygulama a.zaman-kart[data-iz="evet"]')).toHaveCount(1);
    await expect(page.locator('.sayfa-katman')).toHaveCount(0, { timeout: 3000 });
  });
});
// İş 76/79: sekmelerin ana sayfalarında geri yok (kenardan kaydırma hiçbir şey yapmaz; sekmeler arası kaydırma
// iPhone'da kastığı için kaldırıldı); alt sayfalarda kenardan geri kaydırma çalışır
test.describe('İş 76: ana sayfalarda geri yok', () => {
  test.use({ hasTouch: true, isMobile: true });

  async function surukle(page, cdp, x0, x1, { y = 420, adim = 12 } = {}) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y }] });
    for (let i = 1; i <= adim; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + ((x1 - x0) * i) / adim, y: y + 1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(600);
  }

  test('ana sayfada kenardan ve yatay kaydırma sayfayı değiştirmez; alt sayfada geri çalışır; eski önizleme kaydı silinir', async ({ page, context }) => {
    await agiHazirla(context);
    await context.addInitScript(() => {
      if (!sessionStorage.getItem('eskiKayit')) {
        sessionStorage.setItem('eskiKayit', '1');
        localStorage.setItem('sanat-atlasi:sekme-onizleme', '{"surum":"1.54.2","sayfalar":{}}');
      }
    });
    await page.goto('./#/gozat');
    await page.locator('a.zaman-kart').first().waitFor();
    expect(await page.evaluate(() => localStorage.getItem('sanat-atlasi:sekme-onizleme'))).toBeNull();
    await page.locator('a.zaman-kart').first().click();
    await expect(page).toHaveURL(/#\/akim\//);
    // alt sayfadan sekme çubuğuyla Yolculuk'a
    await page.locator('#sekmeler a[data-sekme="harita"]').click();
    await expect(page).toHaveURL(/#\/harita$/);
    expect(await page.evaluate(() => window.__atlas.yigin)).toEqual(['#/harita']);
    await page.waitForTimeout(500);
    const cdp = await context.newCDPSession(page);
    await surukle(page, cdp, 6, 320);
    await expect(page).toHaveURL(/#\/harita$/);
    await surukle(page, cdp, 330, 40);
    await expect(page).toHaveURL(/#\/harita$/);
    await expect(page.locator('.sayfa-katman')).toHaveCount(0);
    expect(await page.locator('#uygulama').evaluate((e) => e.style.transform)).toBe('');
    // alt sayfada kenardan kaydırma yine geri
    await page.goto('./#/gozat');
    await page.locator('a.zaman-kart').first().waitFor();
    await page.locator('a.zaman-kart').first().click();
    await expect(page).toHaveURL(/#\/akim\//);
    await page.waitForTimeout(400);
    await surukle(page, cdp, 6, 320);
    await expect(page).toHaveURL(/#\/gozat$/);
  });
});

// İş 77: bellekten geri konan sayfada kaydırmaya bağlı animasyonlar (Tuval'de adın kaydırdıkça solması) sonlarına
// atlatılmaz: Tuval'e sekmeden dönünce ad ve yazılar solmuş kalıyordu
test.describe('İş 77: bellekten dönen Tuval', () => {
  test.use({ hasTouch: true, isMobile: true });

  test('sekmeden dönünce ad görünür', async ({ page, context }) => {
    await agiHazirla(context);
    await page.goto('./#/');
    const ad = page.locator('#uygulama .sahne-isim');
    await expect(ad).toBeVisible();
    await page.waitForTimeout(800);
    const opak = () => ad.evaluate((e) => getComputedStyle(e).opacity);
    expect(await opak()).toBe('1');
    await page.evaluate(() => (document.querySelector('#uygulama .sahne-isim').dataset.iz = 'evet'));
    await page.locator('#sekmeler a[data-sekme="gozat"]').click();
    await expect(page).toHaveURL(/#\/gozat$/);
    await page.locator('#sekmeler a[data-sekme="bugun"]').click();
    await expect(page).toHaveURL(/#\/$/);
    // bellekten (aynı düğüm) ve görünür
    await expect(page.locator('#uygulama .sahne-isim[data-iz="evet"]')).toHaveCount(1);
    await page.waitForTimeout(300);
    expect(await opak()).toBe('1');
    // Yolculuk'a gidip dönünce
    await page.locator('#sekmeler a[data-sekme="harita"]').click();
    await expect(page).toHaveURL(/#\/harita$/);
    await page.waitForTimeout(500);
    await page.locator('#sekmeler a[data-sekme="bugun"]').click();
    await expect(page).toHaveURL(/#\/$/);
    await expect(ad).toBeVisible();
    await page.waitForTimeout(300);
    expect(await opak()).toBe('1');
  });
});

// İş 80: iPhone'un yoğun ekranında (3 kat) küçük kopyalar büyütülüp bulanıklaşıyordu: yetmeyen görsel bir üst
// kopyayla değişir (400 → 1280 px); ekranı büyük ölçüde kaplayan tablo en büyük kopyayla
test.describe('İş 80: keskin görseller', () => {
  test.use({ deviceScaleFactor: 3, hasTouch: true, isMobile: true });

  test('sanatçı sayfasındaki eserler 1280 px kopyaya geçer, keskin; Tuval\'in büyük tablosu en büyük kopyayı alır', async ({ page, context }) => {
    await agiHazirla(context);
    const yerel = JSON.parse(readFileSync(new URL('../../data/yerel_gorseller.json', import.meta.url), 'utf8')).gorseller;
    const adlar = Object.values(yerel);
    await context.route(/\/data\/gorsel_kaynagi\.json(\?.*)?$/, (r) =>
      r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ surum: 1, adres: 'https://pub-deneme.r2.dev', buyuk: false, devasa: adlar, muze: {} }) }),
    );
    const istenen = [];
    await context.route(/pub-deneme\.r2\.dev\/d\//, (r) => {
      istenen.push(r.request().url());
      r.fulfill({ status: 200, contentType: 'image/png', body: readFileSync(new URL('../fixtures/eser.png', import.meta.url)), headers: { 'access-control-allow-origin': '*' } });
    });
    await page.goto('./#/sanatci/jan-van-eyck');
    const ilk = page.locator('#uygulama .eserler img').first();
    await expect(ilk).toHaveAttribute('src', /gorseller\/b\/[0-9a-f]+\.jpg$/, { timeout: 10000 });
    // ekrandaki eserlerin en bulanığı bile keskin (yükseltmeler birer birer biter)
    await expect
      .poll(() =>
        page.evaluate(() => {
          const l = [...document.querySelectorAll('#uygulama .eserler img')]
            .filter((i) => i.naturalWidth && i.getBoundingClientRect().top < innerHeight)
            .map((i) => {
              const r = i.getBoundingClientRect();
              return 1 / (Math.max(r.width / i.naturalWidth, r.height / i.naturalHeight) * devicePixelRatio);
            });
          return l.length ? Math.min(...l) : 0;
        }),
      )
      .toBeGreaterThanOrEqual(0.8);
    // küçük kartlar (dönem çizelgesi) 400 px'te kalır: gereksiz indirme yok
    await page.goto('./#/gozat');
    await page.locator('a.zaman-kart').first().waitFor();
    await page.waitForTimeout(1500);
    expect(await page.locator('#uygulama .zaman-kart .onizleme img[src*="gorseller/k/"]').count()).toBeGreaterThan(0);
    // sanatçı sayfasının eserleri için en büyük kopya istenmedi (yalnız büyük tablo)
    expect(istenen).toEqual([]);
    // Tuval'in büyük tablosu ekranı kaplıyor: en büyük kopya
    await page.goto('./#/');
    await expect(page.locator('#uygulama [data-gunun-gorsel] img')).toHaveAttribute('src', /pub-deneme\.r2\.dev\/d\/[0-9a-f]+\.jpg$/, { timeout: 10000 });
  });
});

// İş 82: Günün sanatçısı bölümünde önce en kaliteli görselli eserler; salon fotoğrafı gibi düşük kaliteliler
// (kalite puanı < 20 ya da soru için uygun değil) gösterilmez; Wikimedia küçük resmi gerekirse büyüğüyle değişir
test.describe('İş 82: günün sanatçısının görselleri', () => {
  test.use({ deviceScaleFactor: 3, hasTouch: true, isMobile: true });

  test('şeritte düşük kaliteli görsel yok, yerel kopyalılar önce', async ({ page, context }) => {
    await agiHazirla(context);
    // Lorenzetti: en bilinen eseri bir salon fotoğrafı (kalite puanı 5)
    await page.goto('./#/gunun/ambrogio-lorenzetti');
    await expect(page.locator('[data-galeri] img').first()).toBeAttached({ timeout: 10000 });
    await page.waitForTimeout(1500);
    const srcler = await page.locator('[data-galeri] img').evaluateAll((l) => l.map((i) => i.getAttribute('src')));
    expect(srcler.some((s) => /Sala_amb_frescos/.test(s))).toBe(false);
    expect(srcler[0]).toMatch(/gorseller\/[kb]\//);
  });
});

// İş 83: Tuval'in tablosu ekranı kaplar: ekranın oranına en yakın, en büyük kopyası olan tablo (David'de Marat'nın
// Ölümü iki yanından %40 kırpılıyordu; yerine Çalışma Odasında Napolyon)
test('İş 83: günün tablosu ekrana en iyi oturan, en büyük kopyalı tablo', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/ayarlar');
  await page.locator('#sekmeler a').first().waitFor();
  await page.evaluate(async () => {
    const { bugun, kaydet } = await import('./js/ekranlar/ortak.js');
    window.__atlas.ilerleme.gununDegisim = { tarih: bugun(), id: 'jacques-louis-david' };
    kaydet();
  });
  await page.goto('./#/');
  await expect(page.locator('[data-gunun-gorsel] > img')).toHaveAttribute('alt', /Napolyon/, { timeout: 10000 });
});
