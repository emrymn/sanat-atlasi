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
  expect(wikimedia).toBe(0);
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
