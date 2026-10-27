// Yolculuk haritası ve bölümleri (İş 24)
import { test, expect } from '@playwright/test';
import { agiHazirla } from './ortak.js';

const hazir = (page) => page.waitForFunction(() => window.__atlas && window.__atlas.ilerleme && window.__atlas.akimlar.length);

test('Harita sekmesi: 9 dönem resmi, her bölüm bir durak, buradasın yolcusu, küçük pencere', async ({ page, context }) => {
  await agiHazirla(context);
  const resimler = [];
  page.on('response', (r) => {
    if (r.url().includes('/gorseller/harita/')) resimler.push(r.status());
  });
  await page.goto('./#/');
  await hazir(page);
  // büyük Harita sekmesi ikinci sırada
  const sekmeler = page.locator('#sekmeler a');
  await expect(sekmeler).toHaveCount(5);
  await expect(sekmeler.nth(1)).toHaveAttribute('data-sekme', 'harita');
  await expect(sekmeler.nth(2)).toHaveAttribute('data-sekme', 'gozat');
  await sekmeler.nth(1).click();
  await expect(page).toHaveURL(/#\/harita$/);
  await expect(page.locator('[data-test="harita-bolge"]')).toHaveCount(9);
  // ilk kurulumda yalnız ilk durak açık: haritanın geri kalanı sepya
  await expect(page.locator('.harita-resim.sepya[data-bolge="modern"]')).toHaveCount(1);
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
  // İş 30: tanıtımda gösterilen eserler (sanatçı başına en çok 5) ve sorular yalnız onlardan
  const tanit = async () => {
    const gosterilen = {};
    const gec = page.locator('[data-test="konu-tanisma-gec"]');
    await expect(gec).toBeVisible();
    while (await gec.isVisible().catch(() => false)) {
      const { sid, an } = await page.evaluate(() => {
        const o = window.__atlas.oturum;
        return { sid: o.tanisma.sira[o.tanisma.konum], an: o.tanismaEserleri.map((e) => e.anahtar) };
      });
      expect(an.length).toBeGreaterThan(0);
      expect(an.length).toBeLessThanOrEqual(5);
      await expect(page.locator('.tanisma-eser')).toHaveCount(an.length);
      gosterilen[sid] = an;
      await gec.click();
      await page.waitForTimeout(150);
    }
    return gosterilen;
  };
  const cevapla = async (n, gosterilen) => {
    for (let i = 0; i < n; i++) {
      const k = await page.evaluate(async (j) => {
        const d = window.__atlas;
        while (!d.oturum || !d.oturum.kart || d.oturum.kart.konum !== j || !document.querySelector('[data-test="sanatci-secenekleri"]')) await new Promise((r) => setTimeout(r, 50));
        const kart = d.oturum.kart;
        const soy = (id) => d.harita.get(id).ad.split(' ').pop();
        return { id: kart.id, eser: kart.eser.anahtar, secenekler: kart.secenekler, soyadlar: kart.secenekler.map(soy) };
      }, i);
      expect(gosterilen[k.id], `${k.id} tanıtıldı`).toBeTruthy();
      expect(gosterilen[k.id]).toContain(k.eser);
      expect(k.secenekler).toHaveLength(4);
      expect(new Set(k.soyadlar).size).toBe(4); // aynı soyadlı akraba şık yok
      await page.locator(`[data-test="sanatci-secenekleri"] button[data-sanatci="${k.id}"]`).click();
      await page.locator('[data-sonraki]').click();
    }
  };
  await page.goto(`./#/pekistir/bolum/${id}/kolay`);
  const kolayEserleri = await tanit();
  await cevapla(8, kolayEserleri);
  await expect(page.locator('[data-test="bolum-ozet"]')).toHaveAttribute('data-gecti', 'true');
  // İş 39: telefonu sağa çevirince sergi duvarındaki asılı tablolar ipinden sola salınır (jiroskop olayı elle;
  // dikey eksen etrafındaki dönüş standartta gamma'da, iOS'ta beta'da gelir: ikisine de yazılır)
  await expect(page.locator('.sergi-duvar .asi').first()).toBeVisible();
  await page.evaluate(async () => {
    for (let i = 0; i < 30; i++) {
      window.dispatchEvent(new DeviceMotionEvent('devicemotion', { rotationRate: { alpha: 0, beta: 120, gamma: 120 }, interval: 16 }));
      await new Promise((r) => setTimeout(r, 16));
    }
  });
  await expect
    .poll(() => page.locator('.sergi-duvar .asi').first().evaluate((e) => parseFloat(e.style.getPropertyValue('--sal')) || 0))
    .toBeLessThan(-1);
  const kayit = await page.evaluate((b) => window.__atlas.ilerleme.bolumler[b], id);
  expect(kayit.kolay).toBe(1);
  expect(kayit.tanitim).toBe(true);
  await expect(page.locator('[data-test="bolum-sonraki"]')).toHaveAttribute('href', `#/pekistir/bolum/${id}/orta`);
  // Orta: önce kendi tanıtımı, Kolay'da gösterilmeyen yeni eserler; sorular onlardan
  await page.locator('[data-test="bolum-sonraki"]').click();
  const ortaEserleri = await tanit();
  // sanatçının 5'ten fazla eseri yoksa Orta Kolay'ın eserlerini tekrarlar; varsa hiçbiri ortak değil
  let yeni = 0;
  for (const [sid, l] of Object.entries(ortaEserleri)) {
    const k = kolayEserleri[sid] || [];
    if (l.join() === k.join()) continue;
    yeni++;
    expect(l.some((a) => k.includes(a)), sid).toBe(false);
  }
  expect(yeni).toBeGreaterThan(0);
  await cevapla(3, ortaEserleri);
  expect(await page.evaluate((b) => window.__atlas.ilerleme.bolumler[b].tanitimOrta, id)).toBe(true);
  // haritadaki pencerede Orta tanıtımı bağlantısı
  await page.goto('./#/harita');
  await page.locator(`[data-test="harita-durak"][data-bolum="${id}"]`).click();
  await expect(page.locator('[data-test="harita-tanitim-orta"]')).toHaveAttribute('href', `#/pekistir/bolum/${id}/tanitim-orta`);
  await page.keyboard.press('Escape');
  // Orta'yı doğrudan kayıtla geçmiş say: sonraki bölüm açılır
  await page.evaluate((b) => {
    window.__atlas.ilerleme.bolumler[b].orta = 0.9;
  }, id);
  await page.goto('./#/pekistir');
  await page.goto('./#/harita');
  await expect(page.locator('[data-test="harita-durak"][data-acik="true"]')).toHaveCount(2);
});

test('Harita: dönemler arasında köprü; ileri (yukarı) kaydırınca köprü canlanır, adı yeni dönemin', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/harita');
  await hazir(page);
  await expect(page.locator('[data-test="harita-bolge"]')).toHaveCount(9);
  await expect(page.locator('[data-test="harita-gecis"]')).toHaveCount(8);
  // ilk kurulumda yalnız ilk durak açık: haritanın geri kalanı sepya
  await expect(page.locator('.harita-resim.sepya[data-bolge="modern"]')).toHaveCount(1);
  // ortadaki bölüm kartı kalktı (Emre); dönemin adı köprüde
  await expect(page.locator('[data-test="harita-kart"]')).toHaveCount(0);
  const kopru = page.locator('[data-test="harita-gecis"][data-gecis="ronesans"]');
  await expect(kopru.locator('b')).toHaveText('Rönesans');
  await expect(kopru).toContainText('bölüm');
  // açılışta Orta Çağ'dayız; Rönesans köprüsüne doğru yukarı kaydır: köprü ekranın ortasına girince canlanır
  await page.evaluate(async () => {
    const el = document.querySelector('[data-gecis="ronesans"]');
    for (let i = 0; i < 12; i++) {
      const r = el.getBoundingClientRect();
      window.scrollBy(0, (r.top + r.height / 2 - innerHeight / 2) / 3);
      await new Promise((ok) => setTimeout(ok, 60));
    }
  });
  await expect(kopru).toHaveClass(/gorundu/);
  // sağ üstteki gösterge dönemi yazar
  await expect(page.locator('[data-test="harita-zaman"] b')).not.toBeEmpty();
});
