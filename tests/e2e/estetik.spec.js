// İş 48: ressamın imzası, akımın harfi, dönemin çerçevesi
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { agiHazirla } from './ortak.js';

test('imza: doğrulanmış QID’in kaydında imza varsa sanatçı sayfasında adın altında; yoksa hiçbir şey', async ({ page, context }) => {
  await agiHazirla(context);
  // data/imzalar.json yokmuş gibi: imza canlı Wikidata'dan
  await context.route(/\/data\/imzalar\.json$/, (r) => r.fulfill({ status: 404, body: '' }));
  // Giotto'nun QID'i (Q7814) önbellek dosyasında; Wikidata yalnız onun için imza döndürür
  await context.route(/www\.wikidata\.org\/w\/api\.php.*wbgetentities.*ids=Q7814/, (r) =>
    r.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({ entities: { Q7814: { claims: { P109: [{ rank: 'normal', mainsnak: { snaktype: 'value', datavalue: { value: 'Giotto signature.svg' } } }] } } } }),
    }),
  );
  await context.route(/Giotto_signature/, (r) => r.fulfill({ status: 200, contentType: 'image/png', body: readFileSync(new URL('../fixtures/imza-kagit.png', import.meta.url)), headers: { 'access-control-allow-origin': '*' } }));
  await page.goto('./#/sanatci/giotto-di-bondone');
  const imza = page.locator('.isim-blok [data-test="imza"]');
  await expect(imza).toBeVisible();
  await expect(imza).toHaveAttribute('aria-label', /Giotto.*imzası/);
  await expect(imza).toHaveAttribute('data-dosya', 'Giotto signature.svg');
  // imzası olmayan sanatçı: görsel yok
  await page.goto('./#/sanatci/cimabue');
  await expect(page.locator('.isim-blok h1')).toBeVisible();
  await page.waitForTimeout(500);
  await expect(page.locator('[data-test="imza"]')).toHaveCount(0);
});

test('imza: önceden hesaplanmış data/imzalar.json varsa Wikidata’ya sorulmaz', async ({ page, context }) => {
  await agiHazirla(context);
  await context.route(/\/data\/imzalar\.json$/, (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ surum: 1, imzalar: { 'giotto-di-bondone': 'Dosyadan imza.svg', cimabue: null } }) }),
  );
  let soruldu = 0;
  await context.route(/www\.wikidata\.org\/w\/api\.php.*wbgetentities.*ids=Q7814/, (r) => {
    soruldu++;
    return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"entities":{}}' });
  });
  await context.route(/Dosyadan_imza/, (r) => r.fulfill({ status: 200, contentType: 'image/png', body: readFileSync(new URL('../fixtures/imza-kagit.png', import.meta.url)), headers: { 'access-control-allow-origin': '*' } }));
  await page.goto('./#/sanatci/giotto-di-bondone');
  await expect(page.locator('[data-test="imza"]')).toHaveAttribute('data-dosya', 'Dosyadan imza.svg');
  expect(soruldu).toBe(0);
});

test('imza: uygulamayla gelen hazır maske kullanılır (Wikimedia’ya gidilmez), altın renginde', async ({ page, context }) => {
  await agiHazirla(context);
  let wikimedia = 0;
  page.on('request', (r) => {
    if (/Signatur/.test(decodeURIComponent(r.url()))) wikimedia++;
  });
  // scripts/imza_maske.py'nin ürettiği dosya yerine fikstür maske (yalnız saydamlık)
  await context.route(/\/gorseller\/imza\/albrecht-durer\.png$/, (r) => r.fulfill({ status: 200, contentType: 'image/png', body: readFileSync(new URL('../fixtures/imza.png', import.meta.url)) }));
  await page.goto('./#/sanatci/albrecht-durer');
  const imza = page.locator('[data-test="imza"]');
  await expect(imza).toBeVisible();
  expect(await imza.evaluate((e) => e.style.getPropertyValue('--imza'))).toContain('gorseller/imza/albrecht-durer.png');
  expect(await imza.evaluate((e) => getComputedStyle(e).backgroundImage)).toContain('linear-gradient');
  // genişlik oran ile açıkça verilir (Safari en-boy oranından türetmiyordu): fikstür 720×240 → 52 × 3 = 156 px
  expect(await imza.evaluate((e) => e.style.getPropertyValue('--oran'))).toBe('3.0000');
  expect(await imza.evaluate((e) => parseFloat(getComputedStyle(e).width))).toBeGreaterThan(150);
  expect(wikimedia).toBe(0);
  // kalemle yazılır: önce kısmen açık, kalem ucu görünür; bitince tamamı açık ve uç kalkar
  await expect(imza).toHaveClass(/yazildi/, { timeout: 6000 });
  expect(await imza.evaluate((e) => e.style.getPropertyValue('--yaz'))).toBe('100%');
  await expect(page.locator('.imza-uc')).toHaveCount(0, { timeout: 2000 });
});

test('imza: tablonun üstündeki imzanın fotoğrafı (mürekkep değil) gösterilmez', async ({ page, context }) => {
  await agiHazirla(context); // imza görseli olarak renkli resim fikstürü döner
  await context.route(/\/data\/imzalar\.json$/, (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ surum: 1, imzalar: { 'giotto-di-bondone': 'Tablodaki imza.jpg' } }) }),
  );
  await page.goto('./#/sanatci/giotto-di-bondone');
  await expect(page.locator('.isim-blok h1')).toBeVisible();
  await page.waitForTimeout(1500);
  await expect(page.locator('[data-test="imza"]')).toHaveCount(0);
});

test('harf: akım sayfasının başlığı ve haritadaki dönem adları dönemin yazı tipiyle', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto(`./#/akim/${encodeURIComponent('Gotik')}`);
  const h1 = page.locator('.ust h1');
  await expect(h1).toHaveClass(/donem-harfi/);
  expect(await h1.evaluate((e) => e.style.fontFamily)).toContain('Grenze Gotisch');
  // yalnız başlığın harfleri istenir
  const link = page.locator('link[href*="Grenze+Gotisch"]');
  await expect(link).toHaveCount(1);
  expect(decodeURIComponent(await link.getAttribute('href'))).toContain('text=');
  await page.goto('./#/harita');
  const ad = page.locator('[data-gecis="ronesans"] .harita-gecis-yazi b');
  await expect(ad).toHaveClass(/donem-harfi/);
  expect(await ad.evaluate((e) => e.style.fontFamily)).toContain('Cinzel');
});

test('çerçeve: Koleksiyonum’da eser döneminin çerçevesinde (Giotto → Gotik kemer)', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/sanatci/giotto-di-bondone');
  await page.locator('.eser').first().click();
  await page.locator('.gor .gor-isaret').click();
  await page.locator('.gor').getByRole('button', { name: 'Kapat' }).click();
  await page.goto('./#/koleksiyon');
  const c = page.locator('.koleksiyon-duvar .asi-cerceve').first();
  await expect(c).toHaveAttribute('data-cerceve', 'kemer');
  expect(await c.evaluate((e) => getComputedStyle(e).borderTopLeftRadius)).not.toBe('0px');
});

test('Ayarlar: "Başka bir sanatçı getir" günün sanatçısını o gün için değiştirir; ana sayfada yıllar satırı yok', async ({ page, context }) => {
  await agiHazirla(context);
  await page.goto('./#/');
  const ad = page.locator('.sahne-isim .isim');
  await expect(ad).toBeVisible();
  const once = await ad.getAttribute('aria-label');
  // imza gelince tablonun üstü kalabalıklaşıyordu: yıllar · akım satırı ana sayfadan kalktı (sanatçı sayfasında duruyor)
  await expect(page.locator('.sahne-isim .meta')).toHaveCount(0);
  await expect(page.locator('[data-test="gunun-degistir"]')).toHaveCount(0);
  await page.goto('./#/ayarlar');
  const adAyar = page.locator('[data-test="gunun-ad"]');
  const ilk = await adAyar.textContent();
  await page.locator('[data-test="gunun-degistir"]').click();
  await expect(adAyar).not.toHaveText(ilk);
  await expect(page.locator('#gunun-mesaj')).toContainText('Ana sayfada bugün');
  expect((await page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme')).gununDegisim)).id).toBeTruthy();
  await page.locator('#gunun-mesaj a').click();
  await expect(page.locator('.sahne-isim .isim')).not.toHaveAttribute('aria-label', once);
  // yeniden açılınca da kalır
  const sonra = await page.locator('.sahne-isim .isim').getAttribute('aria-label');
  await page.reload();
  await expect(page.locator('.sahne-isim .isim')).toHaveAttribute('aria-label', sonra);
});

test('künye: sanatçı sayfasında portre ve "Dinle"; imza onların altında; kayıt yoksa telefonun o dildeki sesi', async ({ page, context }) => {
  await agiHazirla(context);
  await context.route(/\/data\/kunye\.json$/, (r) =>
    r.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ surum: 1, kunye: { 'albrecht-durer': { dil: 'de', ses: null, portre: 'Durer.jpg' }, cimabue: { dil: null, ses: null, portre: null } } }),
    }),
  );
  await context.route(/\/gorseller\/portre\/albrecht-durer\.jpg$/, (r) => r.fulfill({ status: 200, contentType: 'image/png', body: readFileSync(new URL('../fixtures/eser.png', import.meta.url)) }));
  await context.route(/\/gorseller\/imza\/albrecht-durer\.png$/, (r) => r.fulfill({ status: 200, contentType: 'image/png', body: readFileSync(new URL('../fixtures/imza.png', import.meta.url)) }));
  // konuşma sentezi: okunan metin ve dil kaydedilir
  await context.addInitScript(() => {
    window.__okunan = [];
    window.speechSynthesis.speak = (u) => {
      window.__okunan.push({ metin: u.text, dil: u.lang });
      setTimeout(() => u.onend && u.onend(), 10);
    };
  });
  await page.goto('./#/sanatci/albrecht-durer');
  const ek = page.locator('.isim-blok .isim-ek');
  await expect(ek.locator('.portre')).toBeVisible();
  await expect(ek.locator('[data-test="dinle"]')).toBeVisible();
  // imza satırın altında
  await expect(page.locator('.isim-ek + .imza-kap')).toHaveCount(1);
  await ek.locator('[data-test="dinle"]').click();
  await expect.poll(() => page.evaluate(() => window.__okunan)).toEqual([{ metin: 'Albrecht Dürer', dil: 'de' }]);
  // ne portresi ne dili olan: satır yok
  await page.goto('./#/sanatci/cimabue');
  await expect(page.locator('.isim-blok h1')).toBeVisible();
  await page.waitForTimeout(500);
  await expect(page.locator('.isim-ek')).toHaveCount(0);
});
