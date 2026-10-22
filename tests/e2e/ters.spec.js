// Ö1 · Ters soru: "Hangisi bir X eseri?" dört eserden biri doğru; tek soru, cevaptan sonra eserler küçülür
import { test, expect } from '@playwright/test';
import { agiHazirla, ilerleme } from './ortak.js';

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

// Bütün dönemler Orta; ters soru her kartta (test için oran 1)
async function tersHazirla(page, { oran = 1, seviye = 1 } = {}) {
  await page.goto('./');
  await page.waitForFunction(() => localStorage.getItem('sanat-atlasi:ilerleme') && window.__atlas);
  await page.evaluate((seviye) => {
    const i = JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme'));
    i.seviyeler = {};
    for (const a of window.__atlas.akimlar) i.seviyeler[a.ad] = { s: seviye, son: [] };
    localStorage.setItem('sanat-atlasi:ilerleme', JSON.stringify(i));
  }, seviye);
  await page.reload();
  await page.waitForFunction(() => window.__atlas && window.__atlas.ilerleme);
  await page.evaluate((oran) => (window.__atlas.tersOrani = oran), oran);
  await page.evaluate(() => (location.hash = '#/pekistir/karisik'));
}

// Kartpostala dokun, büyüyen görünümde o esere kaydır ve "Bu eser" ile cevapla
async function tersSec(page, id) {
  const kart = page.locator(`[data-test="ters-secenekleri"] [data-kp-id="${id}"]`);
  const i = Number(await kart.getAttribute('data-kp-ac'));
  await kart.click();
  const buyuk = page.locator('[data-test="kp-buyuk"]');
  await expect(buyuk).toBeVisible();
  await page.evaluate((i) => {
    const k = document.querySelector('[data-kp-kaydir]');
    k.scrollLeft = i * k.clientWidth;
    k.dispatchEvent(new Event('scroll'));
  }, i);
  await expect(page.locator('[data-test="kp-bu"]')).toHaveAttribute('data-sanatci', id);
  await page.locator('[data-test="kp-bu"]').click();
}

test('Ö1: ad verilir, dört eserden biri doğru; doğru cevap tek soruda kartı bitirir', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await tersHazirla(page);
  const soru = page.locator('[data-test="ters-soru"]');
  await expect(soru).toBeVisible();
  const k = await page.evaluate(() => {
    const d = window.__atlas;
    const k = d.oturum.kart;
    return { id: k.id, ad: d.harita.get(k.id).ad, ters: k.ters.map((x) => x.id), sanatcilar: k.ters.map((x) => x.eser.sid) };
  });
  await expect(soru).toContainText(k.ad);
  expect(k.ters).toHaveLength(4);
  expect(new Set(k.ters).size).toBe(4);
  expect(k.ters).toContain(k.id);
  // her eser gerçekten seçenekteki sanatçının (doğruluk kuralı)
  expect(k.sanatcilar).toEqual(k.ters);
  await expect(page.locator('[data-test="ters-secenekleri"] .ters-eser')).toHaveCount(4);
  await tersSec(page, k.id);
  await expect(page.locator('[data-test="sonuc"]')).toHaveAttribute('data-dogru', 'true');
  // akım sorusu yok, doğrudan sonraki kart; doğru eser sahnede, dördü tek sırada ve yaprağın üstünde
  await expect(page.locator('[data-ikinci]')).toHaveCount(0);
  await expect(page.locator('[data-sonraki]')).toBeVisible();
  await expect(page.locator('.ters-sahne img')).toBeVisible();
  const kutular = await page.locator('.ters-mini').evaluateAll((l) => l.map((x) => x.getBoundingClientRect()));
  expect(kutular).toHaveLength(4);
  expect(new Set(kutular.map((r) => Math.round(r.top))).size).toBe(1);
  const yaprak = await page.locator('.alt-yaprak').boundingBox();
  for (const r of kutular) expect(r.bottom).toBeLessThanOrEqual(yaprak.y + 1);
  const i = await ilerleme(page);
  expect(i.skorlar[k.id].sanatci.dogru).toBe(1);
  expect(i.skorlar[k.id].akim).toBeUndefined();
});

test('Ö1: yanlış eser seçilince seçilenin sanatçısı söylenir, karşılaştır bağlantısı çıkar', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await tersHazirla(page);
  await expect(page.locator('[data-test="ters-soru"]')).toBeVisible();
  const { id, yanlis, yanlisAd } = await page.evaluate(() => {
    const d = window.__atlas;
    const k = d.oturum.kart;
    const y = k.ters.find((x) => x.id !== k.id).id;
    return { id: k.id, yanlis: y, yanlisAd: d.harita.get(y).ad };
  });
  await tersSec(page, yanlis);
  await expect(page.locator('[data-test="sonuc"]')).toHaveAttribute('data-dogru', 'false');
  await expect(page.locator('[data-test="ters-secilen"]')).toContainText(yanlisAd);
  await expect(page.locator('[data-test="karsilastir"]')).toBeVisible();
  await expect(page.locator('.ters-mini.dogru')).toHaveCount(1);
  await expect(page.locator('.ters-mini.yanlis .kp-arka')).toContainText(await page.evaluate((y) => (window.__atlas.kisaAdlar[y] || {}).buyuk || window.__atlas.harita.get(y).ad.split(' ').pop(), yanlis));
  await expect(page.locator('.ters-mini.yanlis')).toHaveCount(1);
  const i = await ilerleme(page);
  expect(i.skorlar[id].sanatci.yanlis).toBe(1);
  expect(Object.keys(i.karisanlar)).toHaveLength(1);
});

test('Ö1: kartpostal büyür, "Masaya bırak" ile kapanır; dokunmak tek başına cevap sayılmaz', async ({ page }) => {
  await tersHazirla(page);
  await expect(page.locator('[data-test="ters-soru"]')).toBeVisible();
  await page.locator('[data-kp-ac="2"]').click();
  await expect(page.locator('[data-test="kp-buyuk"]')).toBeVisible();
  await expect(page.locator('[data-test="kp-bu"]')).toContainText('C');
  expect(await page.evaluate(() => window.__atlas.oturum.kart.cevapSanatci)).toBeNull();
  await page.locator('[data-kp-kapat]').click();
  await expect(page.locator('[data-test="kp-buyuk"]')).toHaveCount(0);
  await page.locator('[data-kp-ac="0"]').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-test="kp-buyuk"]')).toHaveCount(0);
});

test('Ö1: Kolay seviyede ters soru gelmez', async ({ page }) => {
  await tersHazirla(page, { seviye: 0 });
  await expect(page.locator('[data-test="sanatci-secenekleri"]')).toBeVisible();
  await expect(page.locator('[data-test="ters-soru"]')).toHaveCount(0);
});

test('Ö1: yarım kalan ters kart aynı dört eserle sürer', async ({ page }) => {
  await tersHazirla(page);
  await expect(page.locator('[data-test="ters-soru"]')).toBeVisible();
  // ilk kartı cevapla, ikinci karta geç (cevap verilmiş oturum kaydedilir)
  const id = await page.evaluate(() => window.__atlas.oturum.kart.id);
  await tersSec(page, id);
  await page.locator('[data-sonraki]').click();
  await expect(page.locator('[data-test="sayac"]')).toContainText('2 /');
  const once = await page.evaluate(async () => {
    while (!window.__atlas.oturum.kart || window.__atlas.oturum.kart.konum !== 1) await new Promise((r) => setTimeout(r, 50));
    const k = window.__atlas.oturum.kart;
    return { tur: k.tur || null, eserler: (k.ters || []).map((x) => x.eser.anahtar) };
  });
  await page.reload();
  await page.locator('[data-test="devam-et"]').click();
  await expect(page.locator('[data-test="sayac"]')).toContainText('2 /');
  const sonra = await page.evaluate(() => {
    const k = window.__atlas.oturum.kart;
    return { tur: k.tur || null, eserler: (k.ters || []).map((x) => x.eser.anahtar) };
  });
  expect(sonra).toEqual(once);
});
