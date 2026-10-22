// Rapor 6. paket: K1 genel arama, K2 zaman şeridi, K3 akım kimlik kartı ve akım karşılaştırması
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

test('K2: Zaman şeridi; akım bantları ve sanatçı çizgileri, kilitliler soluk, dokununca kart, yakınlaştırma', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#/gozat');
  await hazir(page);
  await page.locator('[data-test="zaman-giris"]').click();
  await expect(page).toHaveURL(/#\/zaman$/);
  const tuval = page.locator('[data-test="zaman-tuval"]');
  await expect(tuval).toBeVisible();
  const say = await page.evaluate(() => window.__atlas.sanatcilar.filter((s) => s.dogum != null || s.olum != null).length);
  expect(await page.locator('.zaman-cubuk').count()).toBeGreaterThan(say - 8);
  expect(await page.locator('.zaman-bant').count()).toBeGreaterThan(10);
  expect(await page.locator('.zaman-cubuk.kilitli').count()).toBeGreaterThan(0);
  const genislik = await tuval.evaluate((el) => el.offsetWidth);
  await page.locator('[data-zaman-yakin="1"]').click();
  await expect.poll(() => tuval.evaluate((el) => el.offsetWidth)).toBeGreaterThan(genislik * 1.3);
  // açık bir sanatçının çizgisine dokun
  const id = await page.evaluate(() => {
    const isl = new Set(window.__atlas.ilerleme.islenen);
    return window.__atlas.sanatcilar.find((s) => isl.has(s.konu) && s.dogum).id;
  });
  const cubuk = page.locator(`[data-zaman-sanatci="${id}"]`);
  await cubuk.scrollIntoViewIfNeeded();
  await cubuk.click();
  const kart = page.locator('[data-test="zaman-kart"]');
  await expect(kart).toBeVisible();
  await expect(kart.locator(`a[href="#/sanatci/${encodeURIComponent(id)}"]`)).toBeVisible();
  // sayfa yatay kaymaz (şerit kendi içinde kayar)
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
