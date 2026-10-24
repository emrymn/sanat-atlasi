// Yolculuk haritası ve bölümleri (İş 24)
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

const hazir = (page) => page.waitForFunction(() => window.__atlas && window.__atlas.ilerleme && window.__atlas.akimlar.length);

test('Harita sekmesi: 8 dönem resmi, her bölüm bir durak, buradasın yolcusu, küçük pencere', async ({ page, context }) => {
  await agiHazirla(context);
  const resimler = [];
  page.on('response', (r) => {
    if (r.url().includes('/gorseller/harita/')) resimler.push(r.status());
  });
  await page.goto('./#/');
  await hazir(page);
  // büyük Harita sekmesi ikinci sırada
  const sekmeler = page.locator('#sekmeler a');
  await expect(sekmeler).toHaveCount(4);
  await expect(sekmeler.nth(1)).toHaveAttribute('data-sekme', 'harita');
  await sekmeler.nth(1).click();
  await expect(page).toHaveURL(/#\/harita$/);
  await expect(page.locator('[data-test="harita-bolge"]')).toHaveCount(8);
  const bolumSayisi = await page.evaluate(() => window.__atlas.bolumler.length);
  await expect(page.locator('[data-test="harita-durak"]')).toHaveCount(bolumSayisi);
  // açık durak sayısı bölüm mantığıyla aynı; ilk kurulumda yalnız ilk bölüm
  await expect(page.locator('[data-test="harita-durak"][data-acik="true"]')).toHaveCount(1);
  await expect(page.locator('[data-test="harita-yolcu"]')).toHaveCount(1);
  await expect(page.locator('#sekmeler a[data-sekme="harita"]')).toHaveAttribute('aria-current', 'page');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);

  // açık durak: seviyeler (Kolay açık, Orta ve Zor kapalı), akım sayfası
  const acik = page.locator('[data-test="harita-durak"][data-acik="true"]').first();
  const id = await acik.getAttribute('data-bolum');
  await acik.click();
  const pencere = page.locator('[data-harita-pencere]');
  await expect(pencere).toBeVisible();
  await expect(pencere.locator('a[data-seviye="kolay"]')).toHaveAttribute('href', `#/pekistir/bolum/${id}/kolay`);
  await expect(pencere.locator('span[data-seviye="orta"]')).toContainText('Kolay’ı geçince');
  await expect(pencere.locator('[data-test="harita-akim"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(pencere).toBeHidden();

  // kilitli durak: nedeni yazar
  const kilitli = page.locator('[data-test="harita-durak"][data-acik="false"]').first();
  await kilitli.scrollIntoViewIfNeeded();
  await kilitli.click();
  await expect(pencere.locator('[data-test="harita-kilit"]')).toContainText('açılır');
  await pencere.getByRole('button', { name: 'Kapat' }).click();

  // saklı motif: dokununca eserin hikâyesi
  const motif = page.locator('[data-test="harita-motif"]').first();
  await motif.scrollIntoViewIfNeeded();
  await motif.click();
  await expect(page.locator('[data-test="harita-motif-pencere"]')).toBeVisible();
  await expect(page.locator('[data-test="harita-motif-pencere"] h2')).not.toBeEmpty();
  await page.keyboard.press('Escape');

  // gündüz / gece düğmesi
  const once = await page.locator('[data-test="harita"]').getAttribute('data-vakit');
  await page.locator('[data-harita-vakit]').click();
  await expect(page.locator('[data-test="harita"]')).toHaveAttribute('data-vakit', once === 'gece' ? 'gunduz' : 'gece');

  const gorulen = await page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme')).haritaGorulen);
  expect(gorulen).toContain(id);
  expect(resimler.length).toBeGreaterThan(0);
  expect(resimler.every((s) => s === 200 || s === 304)).toBe(true);
});

test('bölüm: tanıtım, Kolay %75 ile geçilince Orta açılır; Orta geçilince sonraki bölüm', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/harita');
  await hazir(page);
  await page.evaluate(() => (window.__atlas.tersOrani = 0));
  const id = await page.locator('[data-test="harita-durak"][data-acik="true"]').first().getAttribute('data-bolum');
  await page.goto(`./#/pekistir/bolum/${id}/kolay`);
  // ilk Kolay'dan önce bölümün sanatçılarıyla tanışma
  const gec = page.locator('[data-test="konu-tanisma-gec"]');
  await expect(gec).toBeVisible();
  while (await gec.isVisible().catch(() => false)) {
    await gec.click();
    await page.waitForTimeout(150);
  }
  // 8 sorunun hepsine doğru cevap
  for (let i = 0; i < 8; i++) {
    const dogru = await page.evaluate(async (n) => {
      const d = window.__atlas;
      while (!d.oturum || !d.oturum.kart || d.oturum.kart.konum !== n || !document.querySelector('[data-test="sanatci-secenekleri"]')) await new Promise((r) => setTimeout(r, 50));
      return d.oturum.kart.id;
    }, i);
    await page.locator(`[data-test="sanatci-secenekleri"] button[data-sanatci="${dogru}"]`).click();
    await page.locator('[data-sonraki]').click();
  }
  await expect(page.locator('[data-test="bolum-ozet"]')).toHaveAttribute('data-gecti', 'true');
  const kayit = await page.evaluate((b) => window.__atlas.ilerleme.bolumler[b], id);
  expect(kayit.kolay).toBe(1);
  expect(kayit.tanitim).toBe(true);
  await expect(page.locator('[data-test="bolum-sonraki"]')).toHaveAttribute('href', `#/pekistir/bolum/${id}/orta`);
  // Orta'yı doğrudan kayıtla geçmiş say: sonraki bölüm açılır
  await page.evaluate((b) => {
    window.__atlas.ilerleme.bolumler[b].orta = 0.9;
  }, id);
  await page.goto('./#/harita');
  await expect(page.locator('[data-test="harita-durak"][data-acik="true"]')).toHaveCount(2);
});
