// Rapor 5. paket: Ö6 konu işlenince mini ders, Ö5 hatalarım turu, Ö9 seviye seçimi
import { test, expect } from '@playwright/test';
import { agiHazirla, ilerleme } from './ortak.js';

const hazir = (page) => page.waitForFunction(() => window.__atlas && window.__atlas.ilerleme);

async function simdikiKart(page) {
  return page.evaluate(async () => {
    while (!window.__atlas.oturum || !window.__atlas.oturum.kart) await new Promise((r) => setTimeout(r, 50));
    const k = window.__atlas.oturum.kart;
    return { id: k.id, secenekler: k.secenekler.slice(), konum: k.konum, eser: k.eser.anahtar };
  });
}

test.describe('Ö6 konu turu', () => {
  test.beforeEach(async ({ context }) => {
    await agiHazirla(context, { tanisma: true });
  });

  test('konu işlenince alttan kart; Tanış → tanışmalar arka arkaya, sonra yalnız o konudan 6–8 kart', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./#/ilerleme');
    await hazir(page);
    // sanatçısı olan ilk işlenmemiş konu
    const { no, adlar } = await page.evaluate(() => {
      const d = window.__atlas;
      const isl = new Set(d.ilerleme.islenen);
      const k = d.konular.find((x) => !isl.has(x.no) && d.sanatcilar.some((s) => s.konu === x.no));
      return { no: k.no, adlar: d.sanatcilar.filter((s) => s.konu === k.no).map((s) => s.id) };
    });
    await page.locator(`[data-kurs-konu="${no}"]`).click();
    await page.getByRole('switch', { name: `Konu ${no} işlendi` }).check();
    const kart = page.locator('[data-test="tanis-karti"]');
    await expect(kart).toBeVisible();
    await expect(kart).toContainText(`${adlar.length} yeni sanatçı açıldı`);
    await expect(kart).toContainText(`Konu ${no}`);
    // kapatılabilir; yeniden işaretleyince yine gelir
    await kart.locator('[data-tanis-kapat]').click();
    await expect(kart).toHaveCount(0);
    await page.getByRole('switch', { name: `Konu ${no} işlendi` }).uncheck();
    await page.getByRole('switch', { name: `Konu ${no} işlendi` }).check();
    await page.locator('[data-test="tanis-dugme"]').click();
    await expect(page).toHaveURL(new RegExp(`#/pekistir/konu/${no}$`));

    // tanışmalar: her yeni sanatçı bir kez
    const tanisilan = [];
    for (let i = 0; i < adlar.length; i++) {
      await expect(page.locator('[data-test="sayac"]')).toHaveText(`Tanışma ${i + 1} / ${adlar.length}`);
      await expect(page.locator('[data-test="tanisma"]')).toBeVisible();
      tanisilan.push(await page.evaluate(() => window.__atlas.oturum.tanisma.sira[window.__atlas.oturum.tanisma.konum]));
      await page.locator('[data-test="konu-tanisma-gec"]').click();
    }
    expect(new Set(tanisilan)).toEqual(new Set(adlar));

    // tur: yalnızca bu konunun sanatçıları, 6–8 kart, tanışma tekrar gösterilmez
    const toplam = await page.evaluate(() => window.__atlas.oturum.oturum.toplam);
    expect(toplam).toBeGreaterThanOrEqual(6);
    expect(toplam).toBeLessThanOrEqual(8);
    await expect(page.locator('[data-test="sayac"]')).toHaveText(`1 / ${toplam}`);
    const gorulen = await page.evaluate(() => window.__atlas.oturum.tanismaGorulen);
    for (let i = 0; i < 3; i++) {
      await expect(page.locator('[data-test="sanatci-secenekleri"]')).toBeVisible();
      const k = await simdikiKart(page);
      expect(adlar).toContain(k.id);
      expect(gorulen[k.id] || []).not.toContain(k.eser);
      await page.locator(`[data-test="sanatci-secenekleri"] button[data-sanatci="${k.id}"]`).click();
      await page.locator('[data-sonraki]').click();
    }
    // günlük yeni sanatçı sınırına sayılmaz
    expect(((await ilerleme(page)).gunluk || { yeni: 0 }).yeni).toBe(0);
  });
});

test.describe('Ö5 ve Ö9', () => {
  test.beforeEach(async ({ context }) => {
    await agiHazirla(context);
  });

  test('Ö5: Hatalarım satırı; karıştırılan ikili arka arkaya gelir ve birbirinin şıkkıdır', async ({ page }) => {
    await page.goto('./#/pekistir');
    await hazir(page);
    await expect(page.locator('[data-test="hatalar-satir"]')).toHaveCount(0);
    const { a, b, c } = await page.evaluate(() => {
      const d = window.__atlas;
      const isl = new Set(d.ilerleme.islenen);
      const acik = d.sanatcilar.filter((s) => isl.has(s.konu));
      // farklı akımlardan iki sanatçı: eş normalde şıklara girmezdi
      const a = acik[0];
      const b = acik.find((s) => s.akim !== a.akim);
      const c = acik.find((s) => s.id !== a.id && s.id !== b.id);
      return { a: a.id, b: b.id, c: c.id };
    });
    await page.evaluate(
      ({ a, b, c }) => {
        const i = JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme'));
        const t = new Date();
        const g = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
        const yanlis = { kutu: 0, sonraki: g, dogru: 0, yanlis: 1, son: g };
        i.skorlar = { [a]: { sanatci: yanlis }, [c]: { sanatci: yanlis } };
        i.karisanlar = { [[a, b].sort().join('|')]: { n: 2, son: g } };
        localStorage.setItem('sanat-atlasi:ilerleme', JSON.stringify(i));
      },
      { a, b, c },
    );
    await page.reload();
    const satir = page.locator('[data-test="hatalar-satir"]');
    await expect(satir).toBeVisible();
    await expect(satir).toContainText('Hatalarım');
    await expect(satir).toContainText('1 karıştırılan ikili');
    await expect(satir.locator('.hatalar-sayi')).toHaveText('3');
    await satir.click();
    await expect(page).toHaveURL(/#\/pekistir\/hatalar$/);
    const k1 = await simdikiKart(page);
    expect([a, b]).toContain(k1.id);
    const es1 = k1.id === a ? b : a;
    expect(k1.secenekler).toContain(es1);
    await page.locator(`[data-test="sanatci-secenekleri"] button[data-sanatci="${k1.id}"]`).click();
    await page.locator('[data-sonraki]').click();
    const k2 = await simdikiKart(page);
    expect(k2.id).toBe(es1);
    expect(k2.secenekler).toContain(k1.id);
    await page.locator(`[data-test="sanatci-secenekleri"] button[data-sanatci="${k2.id}"]`).click();
    await page.locator('[data-sonraki]').click();
    const k3 = await simdikiKart(page);
    expect(k3.id).toBe(c);
    await expect(page.locator('[data-test="sayac"]')).toHaveText('3 / 3');
  });

  test('Ö9: dönem turunda seviye hapları; alt seviye ısınma, cevap üst seviyenin penceresine yazılmaz', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    await hazir(page);
    const akim = await page.evaluate(() => {
      const d = window.__atlas;
      const isl = new Set(d.ilerleme.islenen);
      return d.sanatcilar.find((s) => isl.has(s.konu)).akim;
    });
    // Kolay'daki dönemde hap yok
    await page.evaluate((a) => (location.hash = `#/pekistir/donem/${encodeURIComponent(a)}`), akim);
    await expect(page.locator('[data-test="sanatci-secenekleri"]')).toBeVisible();
    await expect(page.locator('[data-test="seviye-haplar"]')).toHaveCount(0);

    await page.evaluate((a) => {
      const i = JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme'));
      i.seviyeler = { [a]: { s: 1, son: [1, 0] } };
      localStorage.setItem('sanat-atlasi:ilerleme', JSON.stringify(i));
    }, akim);
    await page.goto('./');
    await hazir(page);
    await page.evaluate((a) => (location.hash = `#/pekistir/donem/${encodeURIComponent(a)}`), akim);
    const haplar = page.locator('[data-test="seviye-haplar"]');
    await expect(haplar).toBeVisible();
    await expect(haplar.locator('[data-seviye-sec="1"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(haplar.locator('.kilitli')).toHaveText(/Zor/);
    await expect(haplar.locator('[data-seviye-sec="2"]')).toHaveCount(0);
    await expect(page.getByText(/Soru 1 \/ 1 · Orta/)).toBeVisible();

    await haplar.locator('[data-seviye-sec="0"]').click();
    await expect(page.getByText(/Soru 1 \/ 1 · Kolay/)).toBeVisible();
    await expect(haplar.locator('[data-seviye-sec="0"]')).toContainText('ısınma');
    const k = await simdikiKart(page);
    await page.locator(`[data-test="sanatci-secenekleri"] button[data-sanatci="${k.id}"]`).click();
    await expect(page.locator('[data-test="seviye-isinma"]')).toContainText('Orta penceresine yazılmadı');
    expect((await ilerleme(page)).seviyeler[akim]).toEqual({ s: 1, son: [1, 0] });

    // Orta'ya dönünce cevap yine pencereye yazılır
    await page.locator('[data-sonraki]').click();
    await haplar.locator('[data-seviye-sec="1"]').click();
    await expect(page.getByText(/Soru 1 \/ 1 · Orta/)).toBeVisible();
    const k2 = await simdikiKart(page);
    await page.locator(`[data-test="sanatci-secenekleri"] button[data-sanatci="${k2.id}"]`).click();
    await expect(page.locator('[data-test="seviye"]')).toBeVisible();
    expect((await ilerleme(page)).seviyeler[akim].son).toEqual([1, 0, 1]);
  });
});
