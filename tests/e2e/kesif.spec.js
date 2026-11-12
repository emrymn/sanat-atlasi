// Rapor 6. paket: K1 genel arama, K2 zaman kadranı, K3 akım kimlik kartı ve akım karşılaştırması
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

const hazir = (page) => page.waitForFunction(() => window.__atlas && window.__atlas.ilerleme);

test('K1: Göz At’taki hapla arama; Türkçe harfsiz yazılır, gruplu sonuç; kilitli sanatçı rozetli', async ({ page }) => {
  await page.goto('./#/gozat');
  await hazir(page);
  await page.locator('[data-test="arama-hapi"]').click();
  await expect(page).toHaveURL(/#\/ara$/);
  const girdi = page.locator('[data-test="arama-girdi"]');
  await expect(girdi).toBeVisible();
  // açık bir sanatçı: adını Türkçe/aksan harfleri olmadan yaz
  const { acikAd, acikId, kilitliAd, konu } = await page.evaluate(() => {
    const d = window.__atlas;
    const isl = new Set(d.ilerleme.islenen);
    const a = d.sanatcilar.find((s) => isl.has(s.konu) && /ü|ç|ş|ğ|ö|ı|é|á/.test(s.ad)) || d.sanatcilar.find((s) => isl.has(s.konu));
    const k = d.sanatcilar.find((s) => !isl.has(s.konu));
    return { acikAd: a.ad, acikId: a.id, kilitliAd: k.ad, konu: k.konu };
  });
  const sade = (x) => x.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i');
  await girdi.fill(sade(acikAd));
  const grup = page.locator('[data-arama-grup="sanatci"]');
  await expect(grup).toBeVisible();
  await expect(grup.locator(`a[href="#/sanatci/${encodeURIComponent(acikId)}"]`)).toBeVisible();
  // kilitli sanatçı bağlantısız, "Konu N'de açılır"
  await girdi.fill(kilitliAd);
  await expect(page.locator('[data-arama-grup="sanatci"] .kilitli').first()).toContainText(`Konu ${konu}`);
  // eser: Türkçe ad ve özgün ad; dokununca görüntüleyici
  const eser = await page.evaluate(() => {
    const d = window.__atlas;
    const isl = new Set(d.ilerleme.islenen);
    const s = d.sanatcilar.find((x) => isl.has(x.konu) && (x.kurs_eserleri || []).length);
    return s ? s.kurs_eserleri[0].baslik : null;
  });
  if (eser) {
    await girdi.fill(eser.split(/\s+/).slice(0, 2).join(' '));
    await expect(page.locator('[data-arama-grup="eser"] [data-arama-eser]').first()).toBeVisible();
    await page.locator('[data-arama-grup="eser"] [data-arama-eser]').first().click();
    await expect(page.locator('.gor')).toBeVisible();
    await page.keyboard.press('Escape');
  }
  await girdi.fill('qqxxzz');
  await expect(page.locator('[data-test="arama-yok"]')).toBeVisible();
  // temizle
  await page.locator('[data-arama-temizle]').click();
  await expect(girdi).toHaveValue('');
});

test('K2: Zaman yıl kadranı; cetvel yılı değiştirir, o yıl hayatta olanlar akım akım, kilitliler soluk', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/gozat');
  await hazir(page);
  await page.locator('[data-test="zaman-giris"]').click();
  await expect(page).toHaveURL(/#\/zaman$/);
  const cetvel = page.locator('[data-test="zaman-tuval"]');
  await expect(cetvel).toBeVisible();
  const yil = page.locator('[data-test="zaman-yil"]');
  // cetveli 1505'e kaydır: o yıl hayatta olanların hepsi listede
  await cetvel.evaluate((el) => (el.scrollLeft = (1505 - 1250) * 4));
  await expect(yil).toHaveText('1505');
  const beklenen = await page.evaluate(() =>
    window.__atlas.sanatcilar.filter((s) => {
      const bas = s.dogum ?? (s.olum != null ? s.olum - 60 : null);
      const son = s.olum ?? (s.dogum != null ? s.dogum + 60 : null);
      return bas != null && son != null && bas <= 1505 && 1505 <= son;
    }).length,
  );
  await expect(page.locator('[data-zaman-satir]')).toHaveCount(beklenen);
  expect(await page.locator('[data-test="zaman-grup"]').count()).toBeGreaterThan(1);
  // ‹ › on yıl
  await page.locator('[data-zaman-adim="10"]').click();
  await expect(yil).toHaveText('1515');
  // klavye: cetvelde ok tuşu bir yıl
  await cetvel.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(yil).toHaveText('1514');
  await expect(cetvel).toHaveAttribute('aria-valuenow', '1514');
  // kilitliler bağlantı değil; açık sanatçı sanatçı sayfasına götürür
  await cetvel.evaluate((el) => (el.scrollLeft = (1600 - 1250) * 4));
  await expect(yil).toHaveText('1600');
  expect(await page.locator('.zm-satir.kilitli').count()).toBeGreaterThan(0);
  const acik = page.locator('a.zm-satir').first();
  const href = await acik.getAttribute('href');
  await acik.click();
  await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'));
  // geri dönünce yıl hatırlanır; sayfa yatay kaymaz
  await page.goBack();
  await expect(yil).toHaveText('1600');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('K3: akım sayfasında kimlik kartı; karşılaştırma sayfası; akım sorusunda yanlışta bağlantı', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await hazir(page);
  const akim = await page.evaluate(() => {
    const d = window.__atlas;
    const isl = new Set(d.ilerleme.islenen);
    return d.sanatcilar.find((s) => isl.has(s.konu)).akim;
  });
  await page.evaluate((a) => (location.hash = `#/akim/${encodeURIComponent(a)}`), akim);
  const kimlik = page.locator('[data-test="akim-kimlik"]');
  await expect(kimlik).toBeVisible();
  await expect(kimlik.locator('.akim-ozellik li')).toHaveCount(
    await page.evaluate(async (a) => (await (await fetch('data/akim_ozellikleri.json')).json()).akimlar[a].length, akim),
  );
  await expect(kimlik.locator('.akim-eser').first()).toBeVisible();
  await expect(kimlik.locator('.akim-palet')).toBeVisible();
  const bag = kimlik.locator('[data-test="akim-karsilastir-bag"]').first();
  await bag.click();
  await expect(page).toHaveURL(/#\/akim-karsilastir\//);
  await expect(page.locator('[data-test="akim-karsi-sutun"]')).toHaveCount(2);

  // karışık turda akım sorusunu yanlış cevapla → yaprakta akım karşılaştırma bağlantısı
  await page.evaluate(() => (location.hash = '#/pekistir/karisik'));
  await expect(page.locator('[data-test="sanatci-secenekleri"]')).toBeVisible();
  const k = await page.evaluate(() => ({
    id: window.__atlas.oturum.kart.id,
    akim: window.__atlas.harita.get(window.__atlas.oturum.kart.id).akim,
    secenekler: window.__atlas.oturum.kart.akimSecenekleri,
  }));
  await page.locator(`[data-test="sanatci-secenekleri"] button[data-sanatci="${k.id}"]`).click();
  await page.locator('[data-ikinci]').click();
  const yanlis = k.secenekler.find((a) => a !== k.akim);
  await page.locator(`[data-test="akim-secenekleri"] button[data-akim="${yanlis}"]`).click();
  const ab = page.locator('[data-test="akim-karsilastir"]');
  await expect(ab).toContainText(`${k.akim} ↔ ${yanlis}`);
  await expect(ab).toHaveAttribute('href', `#/akim-karsilastir/${encodeURIComponent(k.akim)}/${encodeURIComponent(yanlis)}`);
});

test('Akım sayfası: dönemin hikâyesi kısaltılmış gelir, "Devamını oku" tamamını açar, "Kısalt" geri kapar', async ({ page }) => {
  await page.goto(`./#/akim/${encodeURIComponent('Empresyonizm')}`);
  await hazir(page);
  const hikaye = page.locator('[data-test="akim-hikaye"]');
  await expect(hikaye).toBeVisible();
  const beklenen = await page.evaluate(async () => (await (await fetch('data/akim_bilgi.json')).json()).akimlar.Empresyonizm.metin);
  const metin = hikaye.locator('.akim-hikaye-metin');
  await expect(metin).toHaveText(beklenen);
  const dugme = hikaye.locator('[data-hikaye-ac]');
  await expect(dugme).toBeVisible();
  await expect(dugme).toHaveAttribute('aria-expanded', 'false');
  const kisa = (await metin.boundingBox()).height;
  await dugme.click();
  await expect(dugme).toHaveText('Kısalt');
  await expect(dugme).toHaveAttribute('aria-expanded', 'true');
  expect((await metin.boundingBox()).height).toBeGreaterThan(kisa * 1.5);
  await dugme.click();
  await expect(dugme).toHaveText('Devamını oku');
  expect(Math.round((await metin.boundingBox()).height)).toBe(Math.round(kisa));
});
