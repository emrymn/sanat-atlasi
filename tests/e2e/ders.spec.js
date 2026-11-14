// 1.79.0 · Çalış · Ders düzeni: giriş (bugünün dersi, günlük tekrar, dersler, başka turlar), ders sayfası ve dört adım
// (Gör → Öğren → Ayırt et → Sına). 390×844 (playwright.config.js).
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { agiHazirla, ilerleme } from './ortak.js';

const kaynak = JSON.parse(readFileSync(new URL('../../data/ders_kaynaklari.json', import.meta.url), 'utf8'));
const yuruyus = JSON.parse(readFileSync(new URL('../../data/yuruyus.json', import.meta.url), 'utf8')).eserler;
const gotik = kaynak.dersler.find((x) => x.akim === 'Gotik');
const GOTIK = './#/pekistir/ders/Gotik';
const bugun = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(new Date());
const dersKaydi = async (page, akim = 'Gotik') => ((await ilerleme(page)).dersler || {})[akim] || {};
const tasma = (page) => page.evaluate(() => document.scrollingElement.scrollWidth - innerWidth);

// Kayıtlı ilerlemeyi değiştirip uygulamayı yeniden açar
async function kayitDegistir(page, fn, veri) {
  await page.waitForFunction(() => localStorage.getItem('sanat-atlasi:ilerleme'));
  await page.evaluate(
    ([kod, veri]) => {
      const i = JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme'));
      new Function('i', 'veri', kod)(i, veri);
      localStorage.setItem('sanat-atlasi:ilerleme', JSON.stringify(i));
    },
    [fn, veri],
  );
  await page.reload();
}

test.beforeEach(async ({ context }) => {
  await agiHazirla(context);
});

test('Çalış → bugünün dersi → her adım açılır; günlük tekrar ve başka turlar yerinde', async ({ page }) => {
  await page.goto('./#/pekistir');
  await expect(page.getByRole('heading', { name: 'Çalış' })).toBeVisible();
  // bugünün dersi: Yolculuk'taki "Buradasın" durağının akımı
  const buradaki = await page.evaluate(async () => {
    const m = await import('./js/ekranlar/harita.js');
    const y = m.durumlar();
    return y.durumlar.find((x) => x.id === y.simdiki).akim;
  });
  const kart = page.locator('[data-test="bugunun-dersi"]');
  await expect(kart).toHaveAttribute('data-akim', buradaki);
  expect(buradaki).toBe('Gotik');
  await expect(kart.locator('.ders-adim')).toHaveCount(4);
  await expect(kart.locator('.ders-kapak-resim img')).toBeVisible();
  await expect(page.locator('[data-test="ders-konum"]')).toHaveText('Konu 11\'desin');
  // bekleyen tekrar kartları (Leitner) görünür: sayı sekme rozetiyle aynı
  const tekrar = page.locator('[data-test="karisik-dugme"]');
  await expect(tekrar).toBeVisible();
  await expect(tekrar.locator('[data-test="tur-sayi"]')).toHaveText(await page.locator('[data-test="sekme-rozet"]').textContent());
  // dersler: açık akımlar dönem sırasıyla, her birinde dört çizgi; sonra kilitli ilk ders
  const satirlar = page.locator('[data-test="ders-satir"]');
  const acik = await page.evaluate(() => {
    const d = window.__atlas;
    const k = new Set(d.ilerleme.islenen);
    return d.akimlar.filter((a) => d.sanatcilar.some((s) => s.akim === a.ad && k.has(s.konu))).map((a) => a.ad);
  });
  await expect(satirlar).toHaveCount(acik.length);
  expect(await satirlar.evaluateAll((l) => l.map((x) => x.dataset.akim))).toEqual(acik);
  await expect(satirlar.first().locator('.ders-cizgiler i')).toHaveCount(4);
  await expect(page.locator('[data-test="ders-kilitli"]')).toContainText(/Konu \d+'[dt][ea] açılır/);
  // eski turlar "Başka turlar"da
  const izgara = page.locator('[data-test="ek-turlar"] .tur-izgara');
  for (const t of ['donem-turu', 'bolum-turu', 'konu-turu']) await expect(izgara.locator(`[data-test="${t}"]`)).toBeVisible();
  expect(await tasma(page)).toBeLessThanOrEqual(0);
  // dokunma hedefleri en az 44 px
  for (const s of ['.ders-adim', '[data-test="ders-devam"]', '.ders-tekrar-git', '[data-test="ders-satir"]']) {
    for (const b of await page.locator(s).evaluateAll((l) => l.map((e) => e.getBoundingClientRect().height))) expect(b, s).toBeGreaterThanOrEqual(44);
  }

  // sıradaki adım: Gör
  const devam = page.locator('[data-test="ders-devam"]');
  await expect(devam).toHaveAttribute('data-adim', 'gor');
  await devam.click();
  await expect(page).toHaveURL(/#\/pekistir\/ders\/Gotik\/gor$/);
  await expect(page.locator('[data-test="ders-gor"]')).toBeVisible();
  await expect(page.locator('#sekmeler')).toBeHidden();
  await page.locator('.ders-geri').click();
  await expect(page).toHaveURL(/#\/pekistir$/);

  // ders sayfası: dört adımın hepsi dokunulur (kilit yok)
  await satirlar.first().click();
  await expect(page).toHaveURL(/#\/pekistir\/ders\/Gotik$/);
  await expect(page.getByRole('heading', { name: 'Gotik', level: 1 })).toBeVisible();
  await expect(page.locator('[data-test="ders-adim"]')).toHaveCount(4);
  const ekranlar = { gor: '[data-test="ders-gor"]', ogren: '[data-test="ders-ogren"]', ayirt: '[data-test="ders-ayirt"]', sina: '[data-test="sanatci-secenekleri"]' };
  for (const [adim, secici] of Object.entries(ekranlar)) {
    await page.goto(GOTIK);
    await page.locator(`[data-test="ders-adim"][data-adim="${adim}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#/pekistir/ders/Gotik/${adim}$`));
    await expect(page.locator(secici)).toBeVisible();
    expect(await tasma(page), adim).toBeLessThanOrEqual(0);
  }
});

test('Gör: önce eserin tamamı, sonra ayrıntıdan ayrıntıya; ilerleme yazılır, yarıda kalınca kaldığı yerden', async ({ page }) => {
  const eserler = gotik.gor.slice(0, 3).map((g) => yuruyus[g.sanatci]);
  const toplam = eserler.reduce((t, e) => t + e.noktalar.length, 0);
  await page.goto(`${GOTIK}/gor`);
  const gor = page.locator('[data-test="ders-gor"]');
  await expect(gor).toHaveClass(/hazir/);
  await expect(gor).toHaveAttribute('data-nokta', '-1');
  await expect(gor).toHaveAttribute('data-olcek', '1.00'); // resmin tamamı
  const ileri = page.locator('[data-test="gor-ileri"]');
  await expect(ileri).toHaveText('Ayrıntılara bak');
  await expect(page.locator('[data-test="gor-geri"]')).toBeHidden();
  await ileri.click();
  // ilk ayrıntı: yürüyüş metni data/yuruyus.json'dan, kamera yaklaşır
  await expect(gor).toHaveAttribute('data-nokta', '0');
  await expect(page.locator('[data-gor-baslik]')).toHaveText(eserler[0].noktalar[0].ad);
  await expect(page.locator('[data-gor-metin]')).toHaveText(eserler[0].noktalar[0].metin);
  await expect.poll(() => gor.evaluate((e) => Number(e.dataset.olcek))).toBeGreaterThan(1);
  expect((await dersKaydi(page)).gor).toBeUndefined(); // ayrıntı görülmeden ilerleme yok
  await ileri.click();
  await expect(gor).toHaveAttribute('data-nokta', '1');
  await expect.poll(async () => (await dersKaydi(page)).gor?.i).toBeCloseTo(1 / toplam, 2);
  // panel, alt düğme ve üst çubuk ekranın içinde
  const dugme = await ileri.boundingBox();
  expect(dugme.y + dugme.height).toBeLessThanOrEqual(844);
  expect(dugme.height).toBeGreaterThanOrEqual(44);

  // yarıda bırak: Çalış'ta Gör sürüyor; dönünce kaldığı ayrıntıdan
  await page.goto('./#/pekistir');
  await expect(page.locator('[data-test="adim-gor"]')).toHaveClass(/simdi/);
  await expect(page.locator('[data-test="adim-gor"] .ders-halka')).toHaveText(`1/${toplam}`);
  await expect(page.locator('[data-test="ders-satir"]').first()).toHaveClass(/suruyor/);
  await page.locator('[data-test="ders-devam"]').click();
  await expect(gor).toHaveAttribute('data-nokta', '1');

  // sonuna kadar: her eserin girişi + ayrıntıları
  await expect(gor).toHaveClass(/hazir/);
  for (let i = 0; i < 60 && !(await page.locator('[data-test="ders-adim-son"]').count()); i++) await ileri.click();
  const son = page.locator('[data-test="ders-adim-son"]');
  await expect(son).toHaveAttribute('data-adim', 'gor');
  await expect(son).toContainText('Gör tamam');
  expect((await dersKaydi(page)).gor).toEqual({ i: 1, t: bugun() });
  // sıradaki adım: Öğren; geri okunda Gör değil geldiğimiz sayfa
  await page.locator('[data-test="ders-sonraki-adim"]').click();
  await expect(page).toHaveURL(/#\/pekistir\/ders\/Gotik\/ogren$/);
  await expect(page.locator('[data-test="ders-ogren"]')).toBeVisible();
  await page.locator('.ders-geri').click();
  await expect(page).toHaveURL(/#\/pekistir$/);
  await expect(page.locator('[data-test="adim-gor"]')).toHaveClass(/bitti/);
  await expect(page.locator('[data-test="ders-devam"]')).toHaveAttribute('data-adim', 'ogren');
});

test('Öğren: yalnız doğrulanmış kanıt görünür; kanıtı olmayan madde eser göstermeden anlatılır', async ({ page }) => {
  // veride bu derste "yanlış" ve "belirsiz" adaylar var (yoksa test bir şey sınamaz)
  const dogrulanmamis = gotik.ogren.flatMap((m) => [...m.kanit_adaylari, ...m.genel_adaylar].filter((a) => a.durum !== 'dogrulandi'));
  expect(dogrulanmamis.some((a) => a.durum === 'yanlis')).toBe(true);
  expect(dogrulanmamis.some((a) => a.durum === 'belirsiz')).toBe(true);

  await page.goto(`${GOTIK}/ogren`);
  const sayfa = page.locator('[data-test="ders-ogren"]');
  let kanitsiz = 0;
  for (const [i, m] of gotik.ogren.entries()) {
    await expect(sayfa).toHaveAttribute('data-madde', String(m.no));
    await expect(page.locator('[data-test="ders-madde"]')).toHaveText(m.madde);
    const dogru = new Map(m.kanit_adaylari.filter((a) => a.durum === 'dogrulandi').map((a) => [a.id, a.cumle]));
    const genel = new Map(m.genel_adaylar.filter((a) => a.durum === 'dogrulandi').map((a) => [a.id, a.cumle]));
    const gosterilen = new Set([...dogru.values(), ...genel.values()]);
    const yasak = [...m.kanit_adaylari, ...m.genel_adaylar].filter((a) => a.durum !== 'dogrulandi' && !gosterilen.has(a.cumle));
    // bu sayfada (ve şeritteki her eserde) görünen kanıt doğrulanmış olmalı
    const eserSayisi = Number(await sayfa.getAttribute('data-kanit-sayisi'));
    expect(eserSayisi).toBe(Math.min(3, new Set(m.kanit_adaylari.filter((a) => a.durum === 'dogrulandi').map((a) => `${a.sanatci}|${a.qid || a.anahtar || a.eser}`)).size));
    for (let k = 0; k < Math.max(1, eserSayisi); k++) {
      if (k > 0) {
        await page.locator(`[data-ogren-kanit="${k}"]`).click();
        await expect(page.locator(`[data-ogren-kanit="${k}"]`)).toHaveAttribute('aria-pressed', 'true');
      }
      if (eserSayisi) {
        const kanit = page.locator('[data-test="ders-kanit"]');
        const id = await kanit.getAttribute('data-kanit-id');
        expect(dogru.has(id), `${m.madde}: ${id}`).toBe(true);
        await expect(kanit.locator('p')).toHaveText(dogru.get(id));
        await expect(page.locator('[data-test="ders-kanit-eser"] img')).toBeVisible();
      }
      const metin = await sayfa.innerText();
      for (const a of yasak) expect(metin, `${m.madde}: "${a.durum}" aday göründü`).not.toContain(a.cumle);
    }
    // açıklamalar yalnız doğrulanmış genel adaylar
    for (const id of await page.locator('[data-aciklama-id]').evaluateAll((l) => l.map((e) => e.dataset.aciklamaId))) expect(genel.has(id)).toBe(true);
    if (!eserSayisi) {
      kanitsiz++;
      await expect(page.locator('[data-test="ders-kanit-yok"]')).toBeVisible();
      await expect(sayfa.locator('img')).toHaveCount(0);
      await expect(page.locator('[data-test="ders-kanit"]')).toHaveCount(0);
    }
    expect(await tasma(page)).toBeLessThanOrEqual(0);
    await page.locator('[data-test="ogren-ileri"]').click();
    if (i < gotik.ogren.length - 1) await expect.poll(async () => (await dersKaydi(page)).ogren?.i).toBeCloseTo((i + 1) / gotik.ogren.length, 2);
  }
  expect(kanitsiz).toBeGreaterThan(0); // Gotik'te doğrulanmış kanıtı olmayan madde var
  await expect(page.locator('[data-test="ders-adim-son"]')).toHaveAttribute('data-adim', 'ogren');
  expect((await dersKaydi(page)).ogren).toEqual({ i: 1, t: bugun() });
});

test('Ayırt et: iki akımın birinci eserleri yan yana; cevaptan sonra iki madde listesi ve dönem metni cümleleri', async ({ page }) => {
  await page.goto(`${GOTIK}/ayirt`);
  const c = gotik.ayirt[0];
  await expect(page.locator('[data-test="ders-ayirt"]')).toHaveAttribute('data-komsu', c.komsu);
  await expect(page.getByRole('heading', { name: 'Hangisi Gotik?' })).toBeVisible();
  const yanlar = page.locator('[data-test="ders-ikili"] [data-ayirt-sec]');
  await expect(yanlar).toHaveCount(2);
  await expect(yanlar.nth(0).locator('img')).toBeVisible();
  await expect(yanlar.nth(1).locator('img')).toBeVisible();
  // yan yana: aynı satırda, biri solda biri sağda, ekrana sığar
  // (giriş hareketi bitince ölçülür)
  await expect.poll(async () => Math.abs((await yanlar.nth(0).boundingBox()).y - (await yanlar.nth(1).boundingBox()).y)).toBeLessThan(1);
  const [a, b] = [await yanlar.nth(0).boundingBox(), await yanlar.nth(1).boundingBox()];
  expect(a.x + a.width).toBeLessThanOrEqual(b.x);
  expect(b.x + b.width).toBeLessThanOrEqual(390);
  expect(a.width).toBeGreaterThan(150);
  // cevaptan önce akım adı görünmez
  await expect(page.locator('[data-test="ders-fark"]')).toHaveCount(0);
  await expect(page.locator('[data-test="ders-ikili"]')).not.toContainText(c.komsu);
  expect((await dersKaydi(page)).ayirt).toBeUndefined();
  await yanlar.nth(0).click();
  const fark = page.locator('[data-test="ders-fark"]');
  await expect(fark).toBeVisible();
  // iki eser de adıyla: biri Gotik, öbürü komşu; doğru olan işaretli
  const akimlar = await yanlar.evaluateAll((l) => l.map((e) => e.dataset.akim));
  expect(akimlar.slice().sort()).toEqual(['Gotik', c.komsu].sort());
  await expect(page.locator('[data-test="ders-ikili"] .dogru')).toHaveAttribute('data-akim', 'Gotik');
  await expect(page.locator('[data-test="ayirt-sonuc"]')).toHaveAttribute('data-dogru', String(akimlar[0] === 'Gotik'));
  // gösterilen eserler kaynaktaki birinci eserler (eserler.kendi[0], eserler.komsu[0]): sanatçılarının adıyla
  const adlar = await page.evaluate((idler) => idler.map((id) => window.__atlas.kisaAdlar[id] || window.__atlas.harita.get(id).ad), [c.eserler.kendi[0].sanatci, c.eserler.komsu[0].sanatci]);
  await expect(page.locator('[data-test="ders-ikili"] [data-akim="Gotik"]')).toContainText(adlar[0].split(' ').pop());
  await expect(page.locator(`[data-test="ders-ikili"] [data-akim="${c.komsu}"]`)).toContainText(adlar[1].split(' ').pop());
  // fark: iki akımın "Nasıl tanınır?" maddeleri ve kaynaktaki karşılaştırma cümleleri (yeni cümle yok)
  const komsuDers = kaynak.dersler.find((x) => x.akim === c.komsu);
  for (const m of [...gotik.ogren, ...komsuDers.ogren]) await expect(fark).toContainText(m.madde);
  const cumleler = page.locator('[data-test="ayirt-cumle"] p');
  await expect(cumleler).toHaveCount(c.karsilastirma_cumleleri.length);
  expect(await cumleler.allTextContents()).toEqual(c.karsilastirma_cumleleri.map((x) => x.cumle));
  expect(await tasma(page)).toBeLessThanOrEqual(0);
  // ilerleme: görülen ikili / toplam
  await expect.poll(async () => (await dersKaydi(page)).ayirt?.i).toBeCloseTo(1 / gotik.ayirt.length, 2);
  await page.locator('[data-test="ayirt-ileri"]').click();
  if (gotik.ayirt.length === 1) {
    await expect(page.locator('[data-test="ders-adim-son"]')).toHaveAttribute('data-adim', 'ayirt');
    expect((await dersKaydi(page)).ayirt).toEqual({ i: 1, t: bugun() });
  }
});

test('Ayırt et: karşılaştırma cümlesi olmayan ikili cümlesiz, iki eser ve iki madde listesiyle gösterilir', async ({ page }) => {
  // Erken Rönesans ↔ Venedik Rönesansı: kaynakta karşılaştırma cümlesi yok
  const erken = kaynak.dersler.find((x) => x.akim === 'Erken Rönesans');
  const c = erken.ayirt.find((x) => !x.karsilastirma_cumleleri.length);
  expect(c).toBeTruthy();
  await page.goto('./#/pekistir');
  // o ikiliye gelene kadar öncekiler görülmüş sayılır (açık komşular önce gelir; sıra ekranda okunur)
  await page.goto('./#/pekistir/ders/Erken%20R%C3%B6nesans/ayirt');
  const kok = page.locator('[data-test="ders-ayirt"]');
  for (let i = 0; i < erken.ayirt.length; i++) {
    await expect(page.locator('[data-test="ders-adim-baslik"]')).toHaveText(`Ayırt et · ${i + 1} / ${erken.ayirt.length}`);
    const komsu = await kok.getAttribute('data-komsu');
    await page.locator('[data-ayirt-sec="1"]').click();
    await expect(page.locator('[data-test="ders-fark"]')).toBeVisible();
    await expect(page.locator('[data-test="ders-ikili"] img')).toHaveCount(2);
    await expect(page.locator('.ders-fark-sutunlar ul')).toHaveCount(2);
    const beklenen = erken.ayirt.find((x) => x.komsu === komsu).karsilastirma_cumleleri.length;
    await expect(page.locator('[data-test="ayirt-cumle"]')).toHaveCount(beklenen);
    if (komsu === c.komsu) return;
    await page.locator('[data-test="ayirt-ileri"]').click();
  }
  throw new Error('cümlesiz ikili ekrana gelmedi');
});

// Sına'nın bütün kartlarını cevaplar; dogruMu(sıra) → o kart doğru mu cevaplansın
async function sinayiBitir(page, dogruMu) {
  const cevaplar = [];
  for (let i = 0; i < 40; i++) {
    if (await page.locator('[data-test="ders-sina-ozet"]').count()) break;
    await expect(page.locator('[data-test="sanatci-secenekleri"] button:not([disabled])')).toHaveCount(4);
    const { id, tekrar } = await page.evaluate(() => ({ id: window.__atlas.oturum.kart.id, tekrar: window.__atlas.oturum.oturum.simdiki.tekrar }));
    const dogru = tekrar ? true : dogruMu(cevaplar.length);
    if (!tekrar) cevaplar.push({ id, dogru });
    const secici = dogru ? `[data-sanatci="${id}"]` : `[data-sanatci]:not([data-sanatci="${id}"])`;
    await page.locator(`[data-test="sanatci-secenekleri"] button${secici}`).first().click();
    await expect(page.locator('[data-test="sonuc"]')).toHaveAttribute('data-dogru', String(dogru));
    await page.locator('[data-sonraki]').click();
  }
  await expect(page.locator('[data-test="ders-sina-ozet"]')).toBeVisible();
  return cevaplar;
}

test('Sına: aynı soru motoru, en zor şıklar; bitince ilerleme yazılır ve cevaplar Leitner kutularına işlenir', async ({ page }) => {
  await page.goto(`${GOTIK}/sina`);
  await expect(page.locator('[data-test="sanatci-secenekleri"] button')).toHaveCount(4);
  await expect(page.getByRole('heading', { name: 'Bu eser kimin?' })).toBeVisible();
  const acikSayisi = await page.evaluate(() => {
    const d = window.__atlas;
    const k = new Set(d.ilerleme.islenen);
    return d.sanatcilar.filter((s) => s.akim === 'Gotik' && k.has(s.konu)).length;
  });
  const soru = Math.max(6, Math.min(12, acikSayisi));
  await expect(page.locator('[data-test="sayac"]')).toHaveText(`1 / ${soru}`);
  // şıklar en zor düzende: dördü de aynı akımdan (Gotik'te yeterince sanatçı var), tekrarsız
  const siklar = await page.evaluate(() => window.__atlas.oturum.kart.secenekler.map((id) => window.__atlas.harita.get(id).akim));
  expect(siklar).toEqual(['Gotik', 'Gotik', 'Gotik', 'Gotik']);
  expect(new Set(await page.evaluate(() => window.__atlas.oturum.kart.secenekler)).size).toBe(4);
  // ilk kart yanlış: "Neden?" ve Öğren'e dönüş; kart Leitner'de baştan
  const ilk = await page.evaluate(() => window.__atlas.oturum.kart.id);
  await page.locator(`[data-test="sanatci-secenekleri"] button:not([data-sanatci="${ilk}"])`).first().click();
  await expect(page.locator('[data-test="ders-neden"]')).toContainText('Neden?');
  await expect(page.locator('[data-test="ders-ogrene-don"]')).toHaveAttribute('href', '#/pekistir/ders/Gotik/ogren');
  await expect(page.locator('[data-test="seviye-ders"]')).toHaveText(`Gotik dersi · Sına · geçmek için ${Math.ceil(soru * 0.75)} / ${soru} doğru`);
  expect((await ilerleme(page)).skorlar[ilk].sanatci.kutu).toBe(0);
  expect((await dersKaydi(page)).sina).toBeUndefined(); // tur bitmeden ders ilerlemesi yazılmaz
  await page.locator('[data-sonraki]').click();
  // kalanların hepsi doğru
  const cevaplar = await sinayiBitir(page, () => true);
  const ozet = page.locator('[data-test="ders-sina-ozet"]');
  const oran = (soru - 1) / soru;
  await expect(ozet).toHaveAttribute('data-gecti', String(oran >= 0.75));
  expect(Number(await ozet.getAttribute('data-oran'))).toBeCloseTo(oran, 2);
  await expect(ozet).toContainText(`${soru - 1} / ${soru}`);
  // ilerleme: ilk denemelerin doğru oranı; %75'i geçtiği için adım bitti
  const kayit = (await dersKaydi(page)).sina;
  expect(kayit.i).toBeCloseTo(oran, 2);
  expect(kayit.t).toBe(bugun());
  // Leitner: doğru cevaplananların kutusu ilerledi, günün kartları sayıldı
  const il = await ilerleme(page);
  for (const c of cevaplar) expect(il.skorlar[c.id].sanatci.sonraki, c.id).toBeTruthy();
  expect(cevaplar.some((c) => c.id !== ilk && il.skorlar[c.id].sanatci.kutu >= 1)).toBe(true);
  expect(il.gunluk.kart).toBeGreaterThanOrEqual(soru);
  // yarım oturum olarak saklanmaz
  await page.locator('[data-test="ders-ozet-don"]').click();
  await expect(page).toHaveURL(/#\/pekistir\/ders\/Gotik$/);
  await expect(page.locator('[data-test="ders-adim"][data-adim="sina"]')).toHaveClass(/bitti/);
  await page.goto('./#/pekistir');
  await expect(page.locator('[data-test="devam-kart"]')).toHaveCount(0);
});

test('Sına: %75 altında adım bitmez, en iyi sonuç tutulur; tekrar denenince artar ama düşmez', async ({ page }) => {
  await page.goto(`${GOTIK}/sina`);
  // yarısı yanlış
  await sinayiBitir(page, (i) => i % 2 === 0);
  const ozet = page.locator('[data-test="ders-sina-ozet"]');
  await expect(ozet).toHaveAttribute('data-gecti', 'false');
  const ilkOran = Number(await ozet.getAttribute('data-oran'));
  expect(ilkOran).toBeLessThan(0.75);
  let kayit = (await dersKaydi(page)).sina;
  expect(kayit.i).toBeCloseTo(ilkOran, 2);
  expect(kayit.t ?? null).toBeNull(); // bitmedi: bitiş günü yok
  // tekrar: hepsi yanlış → kayıt düşmez
  await page.locator('[data-test="ders-sina-tekrar"]').click();
  await sinayiBitir(page, () => false);
  await expect(ozet).toHaveAttribute('data-oran', '0.000');
  await expect(ozet).toContainText(`en iyi sonucun %${Math.round(ilkOran * 100)}`);
  kayit = (await dersKaydi(page)).sina;
  expect(kayit.i).toBeCloseTo(ilkOran, 2);
});

test('yedekle → geri yükle: ders ilerlemesi korunur', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('./#/pekistir');
  await expect(page.locator('[data-test="bugunun-dersi"]')).toBeVisible();
  const dersler = { Gotik: { gor: { i: 1, t: '2026-11-10' }, ogren: { i: 0.429 }, sina: { i: 0.889, t: '2026-11-12' } }, 'Erken Rönesans': { ayirt: { i: 0.333 } } };
  await kayitDegistir(page, 'i.dersler = veri;', dersler);
  await page.goto('./#/pekistir');
  await expect(page.locator('[data-test="adim-gor"]')).toHaveClass(/bitti/);
  await expect(page.locator('[data-test="adim-ogren"] .ders-halka')).toHaveText('3/7');
  await expect(page.locator('[data-test="adim-sina"]')).toHaveClass(/bitti/);

  await page.goto('./#/ayarlar');
  await page.getByRole('button', { name: 'Yedekle', exact: true }).click();
  await expect(page.locator('#yedek-mesaj')).not.toBeEmpty();
  const yedek = await page.locator('#yedek-cikti').inputValue();
  expect(JSON.parse(yedek).ilerleme.dersler).toEqual(dersler);
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
  await expect.poll(async () => (await ilerleme(page)) !== null).toBe(true);
  expect((await ilerleme(page)).dersler ?? {}).toEqual({});
  page.once('dialog', (d) => d.accept());
  await page.locator('#yedek-girdi').fill(yedek);
  await page.getByRole('button', { name: 'Geri yükle' }).click();
  await expect(page.locator('#geri-mesaj')).toContainText('Yedek yüklendi');
  expect((await ilerleme(page)).dersler).toEqual(dersler);
  // ekranda da: Gör ve Sına tamam, Öğren kaldığı yerden (IV. özellik)
  await page.goto('./#/pekistir');
  await expect(page.locator('[data-test="adim-gor"]')).toHaveClass(/bitti/);
  await expect(page.locator('[data-test="adim-ogren"] .ders-halka')).toHaveText('3/7');
  await expect(page.locator('[data-test="ders-devam"]')).toHaveAttribute('data-adim', 'ogren');
  await page.locator('[data-test="ders-devam"]').click();
  await expect(page.locator('[data-test="ders-adim-baslik"]')).toHaveText('Öğren · IV / VII');
  await page.reload();
  await expect(page.locator('[data-test="ders-adim-baslik"]')).toHaveText('Öğren · IV / VII');
});

test('Gör verisi olmayan ders üç adımla gösterilir; Gör adresi yürüyüş uydurmaz', async ({ page }) => {
  await page.goto('./#/pekistir');
  await expect(page.locator('[data-test="bugunun-dersi"]')).toBeVisible();
  await kayitDegistir(page, 'i.islenen = veri;', Array.from({ length: 80 }, (_, i) => i + 1));
  await page.goto('./#/pekistir/ders/Dada');
  const adimlar = page.locator('[data-test="ders-adimlar"]');
  await expect(adimlar).toHaveAttribute('data-adim-sayisi', '3');
  expect(await page.locator('[data-test="ders-adim"]').evaluateAll((l) => l.map((e) => e.dataset.adim))).toEqual(['ogren', 'ayirt', 'sina']);
  await expect(page.locator('[data-test="gor-yok"]')).toContainText('üç adım');
  await expect(page.locator('[data-test="ders-devam"]')).toHaveAttribute('data-adim', 'ogren');
  // listede de üç çizgi
  await page.goto('./#/pekistir');
  await expect(page.locator('[data-test="ders-satir"][data-akim="Dada"] .ders-cizgiler i')).toHaveCount(3);
  await expect(page.locator('[data-test="ders-satir"][data-akim="Gotik"] .ders-cizgiler i')).toHaveCount(4);
  await expect(page.locator('[data-test="ders-kilitli"]')).toHaveCount(0);
  // Gör adresi elle açılırsa: yakında notu, yürüyüş yok
  await page.goto('./#/pekistir/ders/Dada/gor');
  await expect(page.locator('[data-test="gor-yok"]')).toContainText('Gör adımı yakında');
  await expect(page.locator('[data-test="ders-gor"]')).toHaveCount(0);
  // üç adım bitince ders biter
  await kayitDegistir(page, 'i.dersler = veri;', { Dada: { ogren: { i: 1, t: '2026-11-13' }, ayirt: { i: 1, t: '2026-11-13' }, sina: { i: 0.8, t: '2026-11-13' } } });
  await page.goto('./#/pekistir');
  await expect(page.locator('[data-test="ders-satir"][data-akim="Dada"]')).toHaveClass(/bitti/);
});

test('eski turlar “Başka turlar”da: Döneme göre sayfası karışık turu, günlük hedefi ve salonları tutar', async ({ page }) => {
  await page.goto('./#/pekistir');
  await page.locator('[data-test="ek-turlar"] [data-test="donem-turu"]').click();
  await expect(page).toHaveURL(/#\/pekistir\/donem$/);
  await expect(page.getByRole('heading', { name: 'Turlar' })).toBeVisible();
  await expect(page.locator('.pk-salonlar')).toBeInViewport();
  await expect(page.locator('a[href="#/pekistir/donem/Gotik"]')).toBeVisible();
  await expect(page.locator('[data-gunluk-hedef]').first()).toBeAttached();
  await expect(page.locator('.pk-sahne [data-test="karisik-dugme"]')).toBeAttached();
  // geri: Çalış'ın girişi
  await page.locator('.pk-ust [data-geri]').click();
  await expect(page).toHaveURL(/#\/pekistir$/);
  await expect(page.locator('[data-test="bugunun-dersi"]')).toBeVisible();
});

test('temalar ve hareket: Gündüz’de okunur; Hareket “Kapalı”yken Gör’de kamera anında yerine geçer', async ({ page }) => {
  await page.goto('./#/pekistir');
  await expect(page.locator('[data-test="bugunun-dersi"]')).toBeVisible();
  await kayitDegistir(page, 'i.ayarlar.tema = "gunduz"; i.ayarlar.hareket = "kapali";');
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'gunduz');
  await expect(page.locator('html')).toHaveAttribute('data-hareket', 'kapali');
  // dolu düğmenin yazısı zeminine göre okunur (4,5:1 üstü), Gündüz ve Gece'de
  const kontrast = () =>
    page.locator('[data-test="ders-devam"]').evaluate((el) => {
      const c = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
      const rgb = (r) => {
        c.clearRect(0, 0, 1, 1);
        c.fillStyle = r;
        c.fillRect(0, 0, 1, 1);
        return [...c.getImageData(0, 0, 1, 1).data].slice(0, 3);
      };
      const L = (r) => {
        const [x, y, z] = rgb(r).map((v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
        return 0.2126 * x + 0.7152 * y + 0.0722 * z;
      };
      const s = getComputedStyle(el);
      const [a, b] = [L(s.color), L(s.backgroundColor)].sort((x, y) => y - x);
      return (a + 0.05) / (b + 0.05);
    });
  expect(await kontrast()).toBeGreaterThanOrEqual(4.5);
  // Gör her temada koyu sahne; Hareket kapalıyken geçiş süresi yok
  await page.locator('[data-test="ders-devam"]').click();
  const gor = page.locator('[data-test="ders-gor"]');
  await expect(gor).toHaveClass(/hazir/);
  expect(await gor.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe('rgb(13, 12, 11)');
  await page.locator('[data-test="gor-ileri"]').click();
  await expect(gor).toHaveAttribute('data-nokta', '0');
  expect(await page.locator('[data-gor-resim]').evaluate((e) => parseFloat(getComputedStyle(e).transitionDuration))).toBeLessThan(0.01);
  await kayitDegistir(page, 'i.ayarlar.tema = "gece"; i.ayarlar.hareket = "tam";');
  await page.goto('./#/pekistir');
  expect(await kontrast()).toBeGreaterThanOrEqual(4.5);
});
