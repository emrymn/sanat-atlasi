import { test, expect } from '@playwright/test';
import { agiHazirla, ilerleme } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

test('ana sayfa → Göz At → sanatçı → eser tam ekran', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Sanat Atlası' })).toBeVisible();
  await expect(page.getByText('açık sanatçı')).toBeVisible();
  await page.getByRole('link', { name: /Göz At/ }).click();
  await expect(page.getByRole('heading', { name: 'Göz At' })).toBeVisible();
  // kilitli akım gri ve "Konu N'de açılır" yazar
  await expect(page.getByText(/Konu \d+'(de|da|te|ta) açılır/).first()).toBeVisible();
  await page.getByRole('link', { name: /Proto-Rönesans/ }).click();
  await page.getByRole('link', { name: /Giotto/ }).click();
  await expect(page.getByRole('heading', { name: /Giotto/ })).toBeVisible();
  await expect(page.locator('.eser').first()).toBeVisible();
  const sayi = await page.locator('.eser').count();
  expect(sayi).toBeGreaterThan(1);
  // Wikidata (fikstür) eserleri kurs eserlerinden sonra gelir
  await expect(page.locator('.eser').last()).toContainText('Fixture');
  await page.locator('.eser').first().click();
  const gor = page.locator('.gor');
  await expect(gor).toBeVisible();
  await expect(gor.locator('.gor-baslik')).not.toBeEmpty();
  await expect(gor.locator('.gor-kaynak')).toContainText('Wikimedia Commons');
  await expect(gor.locator('.gor-kaynak')).toContainText(`1 / ${sayi}`);
  // sonraki esere geç (düğme) ve kaydırma jesti
  await gor.getByRole('button', { name: 'Sonraki eser' }).click();
  await expect(gor.locator('.gor-kaynak')).toContainText(`2 / ${sayi}`);
  const kutu = await gor.locator('.gor-sahne').boundingBox();
  const y = kutu.y + kutu.height / 2;
  await page.mouse.move(kutu.x + kutu.width - 40, y);
  await page.mouse.down();
  await page.mouse.move(kutu.x + 60, y, { steps: 8 });
  await page.mouse.up();
  await expect(gor.locator('.gor-kaynak')).toContainText(`3 / ${sayi}`);
  await gor.getByRole('button', { name: 'Kapat' }).click();
  await expect(gor).toHaveCount(0);
});

test('Görsel kötü: sıradaki görsele geçer ve tercih saklanır', async ({ page }) => {
  await page.goto('./#/sanatci/giotto-di-bondone');
  await expect(page.locator('.eser').first()).toBeVisible();
  // birden fazla görseli olan ilk eser
  const i = await page.evaluate(() => window.__atlas.sonEserListesi.findIndex((e) => e.gorseller.length > 1));
  expect(i).toBeGreaterThanOrEqual(0);
  await page.locator('.eser').nth(i).click();
  const gor = page.locator('.gor');
  const ilk = await gor.locator('.gor-resim').getAttribute('src');
  await gor.getByRole('button', { name: 'Görsel kötü' }).click();
  await expect(gor.locator('.gor-mesaj')).toContainText('Başka bir görsele');
  await expect(gor.locator('.gor-resim')).not.toHaveAttribute('src', ilk);
  const ilerleme = await page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme')));
  expect(Object.values(ilerleme.kotuGorseller).flat().length).toBe(1);
  // yeniden açınca aynı tercih geçerli
  await gor.getByRole('button', { name: 'Kapat' }).click();
  await page.reload();
  await page.locator('.eser').nth(i).click();
  await expect(page.locator('.gor .gor-resim')).not.toHaveAttribute('src', ilk);
});

test('Pekiştir · Karışık: 5 kart cevapla', async ({ page }) => {
  await page.goto('./#/pekistir/karisik');
  for (let i = 0; i < 5; i++) {
    const sanatci = page.locator('[data-test="sanatci-secenekleri"] button');
    await expect(sanatci).toHaveCount(4);
    await expect(page.getByText('Bu eser kimin?')).toBeVisible();
    await expect(page.getByText('Soru 1 / 2')).toBeVisible();
    await sanatci.nth(i % 4).click();
    // 1. sorudan sonra: sonuç yaprağı, doğru seçenek yeşil; akım henüz söylenmez
    await expect(page.locator('[data-test="sonuc"]')).toBeVisible();
    await expect(page.locator('[data-test="sanatci-secenekleri"] .dogru')).toHaveCount(1);
    await page.locator('[data-ikinci]').click();
    const akim = page.locator('[data-test="akim-secenekleri"] button');
    await expect(page.getByText('Hangi akım?')).toBeVisible();
    await expect(page.getByText('Soru 2 / 2')).toBeVisible();
    await expect(akim).toHaveCount(4);
    await akim.nth((i + 1) % 4).click();
    await expect(page.locator('[data-test="sonuc"]')).toBeVisible();
    await expect(page.getByRole('link', { name: /Sanatçı sayfası/ })).toBeVisible();
    await expect(page.locator('[data-test="akim-secenekleri"] .dogru')).toHaveCount(1);
    await expect(page.locator('.alt-yaprak')).toContainText('Komşu akımlar');
    const sonraki = page.locator('[data-sonraki]');
    await expect(sonraki).toBeInViewport();
    await sonraki.click();
  }
  const i = await ilerleme(page);
  expect(i.gunluk.kart).toBe(5);
  const skorlu = Object.values(i.skorlar).filter((s) => s.sanatci && s.akim);
  expect(skorlu.length).toBeGreaterThan(0);
  expect(i.gunluk.yeni).toBeLessThanOrEqual(8);
});

test('Pekiştir · Döneme göre: bir akım seç ve cevapla', async ({ page }) => {
  await page.goto('./#/pekistir/donem');
  await expect(page.getByRole('link', { name: /Hepsi, dönem sırasıyla/ })).toBeVisible();
  await page.getByRole('link', { name: /^Gotik/ }).click();
  const secenekler = page.locator('[data-test="sanatci-secenekleri"] button');
  await expect(secenekler).toHaveCount(4);
  await secenekler.first().click();
  await expect(page.locator('[data-test="sonuc"]')).toBeVisible();
  await expect(page.locator('[data-test="akim-secenekleri"]')).toHaveCount(0);
});

test('İlerleme: konu işaretlenince yeni sanatçı açılır', async ({ page }) => {
  await page.goto('./');
  const once = Number(await page.locator('[data-test="acik-sayi"]').textContent());
  // henüz işlenmemiş ve (resmi olan) sanatçısı bulunan ilk konu
  const { no, ad, akim } = await page.evaluate(() => {
    const d = window.__atlas;
    const s = d.sanatcilar.filter((x) => !d.ilerleme.islenen.includes(x.konu)).sort((a, b) => a.konu - b.konu)[0];
    return { no: s.konu, ad: s.ad, akim: s.akim };
  });
  await page.goto('./#/ilerleme');
  await expect(page.getByRole('heading', { name: 'İlerleme' })).toBeVisible();
  const anahtar = page.getByRole('switch', { name: `Konu ${no} işlendi` });
  if (!(await anahtar.isVisible())) await page.locator(`details[data-bolum]:has(input[data-konu="${no}"]) > summary`).click();
  await expect(anahtar).not.toBeChecked();
  await anahtar.check();
  await expect(page.locator('#bildirim')).toContainText('Açıldı:');
  await expect(anahtar).toBeChecked();
  await page.goto('./');
  const sonra = Number(await page.locator('[data-test="acik-sayi"]').textContent());
  expect(sonra).toBeGreaterThan(once);
  // Göz At'ta yeni sanatçı görünür
  await page.goto('./#/gozat');
  await page.getByRole('link').filter({ hasText: akim }).first().click();
  await expect(page.getByRole('link').filter({ hasText: ad })).toBeVisible();
});

test('yalnızca resim: heykeltıraş ve mimarlar ile resimsiz akımlar görünmez', async ({ page }) => {
  await page.goto('./#/gozat');
  await expect(page.getByRole('heading', { name: 'Göz At' })).toBeVisible();
  await expect(page.getByText('Antik Yunan ve Roma')).toHaveCount(0);
  await expect(page.getByText('Romanesk', { exact: true })).toHaveCount(0);
  await page.getByRole('link').filter({ hasText: 'Erken Rönesans' }).click();
  await expect(page.getByText('Masaccio')).toBeVisible();
  await expect(page.getByText('Brunelleschi')).toHaveCount(0);
  await expect(page.getByText('Donatello')).toHaveCount(0);
  // Michelangelo'nun sayfasında heykelleri yok
  await page.goto('./#/sanatci/michelangelo');
  await expect(page.locator('.eser').first()).toBeVisible();
  await expect(page.locator('.eser', { hasText: 'Pietà' })).toHaveCount(0);
  await expect(page.locator('.eser', { hasText: /^\s*David/ })).toHaveCount(0);
  await expect(page.locator('.eser', { hasText: 'Creation of Adam' })).toHaveCount(1);
});

test('Ayarlar: yedekle → geri yükle gidiş-dönüşü', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('./#/pekistir/karisik');
  const s = page.locator('[data-test="sanatci-secenekleri"] button');
  await s.first().click();
  await page.locator('[data-ikinci]').click();
  await page.locator('[data-test="akim-secenekleri"] button').first().click();
  await page.goto('./#/ayarlar');
  await page.getByRole('button', { name: 'Artır' }).click();
  // varsayılan tema Gece; Sepya seçilir
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'gece');
  await page.getByRole('radio', { name: 'Sepya' }).check();
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'sepya');
  const asil = await ilerleme(page);
  await page.getByRole('button', { name: 'Yedekle', exact: true }).click();
  await expect(page.locator('#yedek-mesaj')).not.toBeEmpty();
  const yedek = await page.locator('#yedek-cikti').inputValue();
  expect(JSON.parse(yedek).ilerleme.islenen).toEqual(asil.islenen);
  // yarım kalan oturum da yedekte
  expect(JSON.parse(yedek).yarimOturum.kip).toBe('karisik');
  const pano = await page.evaluate(() => navigator.clipboard.readText());
  expect(pano).toBe(yedek);

  // her şeyi sil, uygulamayı yeniden aç
  await page.evaluate(async () => {
    localStorage.clear();
    await new Promise((r) => {
      const q = indexedDB.deleteDatabase('sanat-atlasi');
      q.onsuccess = q.onerror = q.onblocked = r;
    });
  });
  await page.reload();
  await page.goto('./#/ayarlar');
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'gece');
  expect(Object.keys((await ilerleme(page)).skorlar)).toHaveLength(0);

  page.once('dialog', (d) => d.accept());
  await page.locator('#yedek-girdi').fill(yedek);
  await page.getByRole('button', { name: 'Geri yükle' }).click();
  await expect(page.locator('#geri-mesaj')).toContainText('Yedek yüklendi');
  const geri = await ilerleme(page);
  expect(geri.skorlar).toEqual(asil.skorlar);
  expect(geri.islenen).toEqual(asil.islenen);
  expect(geri.ayarlar).toEqual(asil.ayarlar);
  expect(geri.sonCalisilanlar).toEqual(asil.sonCalisilanlar);
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'sepya');
  await page.goto('./#/');
  await expect(page.locator('[data-test="devam-ozet"]')).toHaveText(/^Karışık · 2 \//);
  await page.goto('./#/ayarlar');

  // bozuk yedek reddedilir
  await page.locator('#yedek-girdi').fill('{bozuk');
  await page.getByRole('button', { name: 'Geri yükle' }).click();
  await expect(page.locator('#geri-mesaj')).toContainText('JSON');
});

test('yatay kaydırma yok (390 px)', async ({ page }) => {
  for (const r of ['./', './#/gozat', './#/sanatci/giotto-di-bondone', './#/pekistir/karisik', './#/ilerleme', './#/ayarlar']) {
    await page.goto(r);
    await page.waitForTimeout(300);
    const genis = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(genis, r).toBeLessThanOrEqual(390);
  }
});

test('resim rengi: Bugün paleti çıkarılır, vurgu renkleri yazılır ve IndexedDB önbelleğine girer', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-palet] .palet span').first()).toBeAttached();
  const vurgu = await page.evaluate(() => document.documentElement.style.getPropertyValue('--vurgu-acik'));
  expect(vurgu).toMatch(/^#[0-9a-f]{6}$/);
  const kayit = await page.evaluate(
    () =>
      new Promise((coz) => {
        const r = indexedDB.open('sanat-atlasi');
        r.onsuccess = () => {
          const q = r.result.transaction('palet').objectStore('palet').count();
          q.onsuccess = () => coz(q.result);
        };
      }),
  );
  expect(kayit).toBeGreaterThan(0);
  // Pekiştir kartında renk sorulan eserden gelir; cevaptan sonra yaprakta paleti görünür
  await page.goto('./#/pekistir/karisik');
  await page.locator('[data-test="sanatci-secenekleri"] button').first().click();
  await expect(page.locator('.alt-yaprak .palet span').first()).toBeAttached();
});

test('Sanatçı: bilinen ad büyük satırda; galerinin sonundaki "Tümü (N)" ızgarayı açar', async ({ page }) => {
  await page.goto('./#/sanatci/rembrandt-van-rijn');
  await expect(page.locator('h1 .ad-son')).toHaveText('Rembrandt');
  await expect(page.locator('h1 .ad-ilk')).toHaveText('van Rijn');
  await expect(page.getByRole('heading', { name: 'Rembrandt van Rijn' })).toBeVisible();
  const n = await page.locator('.eserler .eser').count();
  expect(n).toBeGreaterThan(1);
  const tumu = page.locator('[data-test="tumu"]');
  await expect(tumu).toHaveText(`Tümü (${n})`);
  await tumu.click();
  await expect(page.locator('.izgara .eser')).toHaveCount(n);
  await page.locator('.izgara .eser').nth(1).click();
  await expect(page.locator('.gor .gor-kaynak')).toContainText(`2 / ${n}`);
});

test("Pekiştir: soru 390 px'te tek satır", async ({ page }) => {
  await page.goto('./#/pekistir/karisik');
  const h = page.locator('.soru-baslik h2');
  await expect(h).toHaveText('Bu eser kimin?');
  const tek = await h.evaluate(
    (el) => el.scrollWidth <= el.clientWidth + 1 && el.getBoundingClientRect().height < parseFloat(getComputedStyle(el).fontSize) * 1.6,
  );
  expect(tek).toBe(true);
});
