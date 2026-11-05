// İş 151: rehberli eser incelemesi — başyapıt sayfasından görüntüleyiciye, noktalar, yakınlaşma, gezinme, bitiş
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { agiHazirla } from './ortak.js';

const onbellek = JSON.parse(readFileSync(new URL('../../data/eserler_onbellek.json', import.meta.url), 'utf8'));
const ilk = onbellek.sanatcilar['j-m-w-turner'].eserler[0];
const K = ilk.qid || `j-m-w-turner|${ilk.baslik}`;
const BASYAPIT = {
  surum: 1,
  eserler: [{ anahtar: K, sanatci: 'j-m-w-turner', baslik: 'TEST Başyapıt', ozgun: ilk.baslik, tarih: '1840', muze: 'TEST', ozet: 'Özet.', bolumler: [{ baslik: 'Ne görüyoruz?', metin: 'TEST.' }], bak: [] }],
};
const nokta = (ad, x, y, metin) => ({ ad, x, y, w: 0.2, h: 0.2, metin });
const AYRINTI = {
  surum: 1,
  eserler: [
    {
      anahtar: K,
      sanatci: 'j-m-w-turner',
      baslik: 'TEST Başyapıt',
      gorsel: 'x',
      noktalar: [
        nokta('Sol üst', 0.0, 0.0, 'TEST birinci nokta açıklaması burada. İkinci cümle de burada.'),
        nokta('Orta', 0.4, 0.4, 'TEST ortadaki nokta açıklaması burada. İkinci cümle de burada.'),
        nokta('Sağ alt', 0.8, 0.8, 'TEST üçüncü nokta açıklaması burada. İkinci cümle de burada.'),
        nokta('Sağ üst', 0.8, 0.0, 'TEST dördüncü nokta açıklaması burada. İkinci cümle de burada.'),
      ],
    },
  ],
};
const olcek = (page) => page.evaluate(() => new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.gor-resim')).transform).a);

async function hazirla(context, ayrinti = AYRINTI) {
  await agiHazirla(context);
  await context.route(/\/data\/basyapitlar\.json(\?.*)?$/, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(BASYAPIT) }));
  await context.route(/\/data\/eser_ayrintilari\.json(\?.*)?$/, (r) =>
    ayrinti ? r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ayrinti) }) : r.fulfill({ status: 404, body: '' }),
  );
}

test('başyapıt sayfası → Rehberli inceleme: noktalar, dokununca yakınlaşma ve açıklama, Sonraki/Önceki, Bitir', async ({ page, context }) => {
  await hazirla(context);
  await page.goto(`./#/basyapit/${encodeURIComponent(K)}`);
  const giris = page.locator('[data-test="basyapit-incele"]');
  await expect(giris).toBeVisible();
  await expect(giris).toContainText('4 nokta');
  const kutu = await giris.boundingBox();
  expect(kutu.height).toBeGreaterThanOrEqual(44);
  await giris.click();
  const gor = page.locator('.gor');
  await expect(gor).toBeVisible();
  await expect(gor).toHaveClass(/inceleme/);
  const panel = page.locator('[data-test="gor-inceleme"]');
  await expect(panel).toBeVisible();
  await expect(page.locator('[data-test="gor-inc-no"]')).toHaveText('4 ayrıntı');
  const noktalar = page.locator('.gor-nokta');
  await expect(noktalar).toHaveCount(4);
  // noktalar resmin kutusunun içinde (yüzde konum), dokunma alanı 44 px
  const resim = await page.locator('.gor-resim').boundingBox();
  for (let i = 0; i < 4; i++) {
    const b = await noktalar.nth(i).boundingBox();
    expect(b.width).toBeGreaterThanOrEqual(44);
    expect(b.x + b.width / 2).toBeGreaterThanOrEqual(resim.x - 1);
    expect(b.x + b.width / 2).toBeLessThanOrEqual(resim.x + resim.width + 1);
  }
  expect(await olcek(page)).toBeCloseTo(1, 1);
  await expect(page.locator('[data-test="gor-inc-onceki"]')).toBeDisabled();
  // noktaya dokun: yakınlaşır, açıklama gelir, nokta "aktif"
  await noktalar.nth(1).click();
  await expect(page.locator('[data-test="gor-inc-no"]')).toHaveText('2 / 4');
  await expect(page.locator('[data-test="gor-inc-ad"]')).toHaveText('Orta');
  await expect(page.locator('[data-test="gor-inc-metin"]')).toContainText('TEST ortadaki nokta');
  await expect(noktalar.nth(1)).toHaveClass(/aktif/);
  await page.waitForTimeout(900); // 560 ms yakınlaşma + kutunun büyütülmesi (netleştirme)
  // büyütme kutuya işlenir: resim gerçekten büyür (İş 81), transform'da ölçek 1'e döner
  const buyuk = await page.locator('.gor-resim').boundingBox();
  expect(buyuk.width).toBeGreaterThan(resim.width * 1.3);
  // nokta katmanı resimle aynı kutuda
  const katman = await page.locator('[data-test="gor-noktalar"]').boundingBox();
  expect(Math.abs(katman.width - buyuk.width)).toBeLessThan(2);
  expect(Math.abs(katman.x - buyuk.x)).toBeLessThan(2);
  // dokunma alanı yakınlaşınca da 44 px (ters ölçek)
  const b1 = await noktalar.nth(1).boundingBox();
  expect(b1.width).toBeGreaterThan(40);
  expect(b1.width).toBeLessThan(50);
  // Sonraki / Önceki
  await page.locator('[data-test="gor-inc-sonraki"]').click();
  await expect(page.locator('[data-test="gor-inc-no"]')).toHaveText('3 / 4');
  await page.locator('[data-test="gor-inc-sonraki"]').click();
  await expect(page.locator('[data-test="gor-inc-no"]')).toHaveText('4 / 4');
  await expect(page.locator('[data-test="gor-inc-sonraki"]')).toBeDisabled();
  await page.locator('[data-test="gor-inc-onceki"]').click();
  await expect(page.locator('[data-test="gor-inc-ad"]')).toHaveText('Sağ alt');
  // düğmeler başparmak alanında: ekranın alt üçte birinde
  const sonraki = await page.locator('[data-test="gor-inc-sonraki"]').boundingBox();
  expect(sonraki.y).toBeGreaterThan(844 * 0.6);
  expect(sonraki.height).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  // Bitir: panel kapanır, noktalar kalkar, tablo ölçek 1'e döner, eser yazısı geri gelir
  await page.locator('[data-test="gor-inc-bitir"]').click();
  await expect(panel).toBeHidden();
  await expect(noktalar).toHaveCount(0);
  await expect(gor).not.toHaveClass(/inceleme/);
  await expect(page.locator('.gor-yazi')).toBeVisible();
  await page.waitForTimeout(700);
  const geri = await page.locator('.gor-resim').boundingBox();
  expect(Math.abs(geri.width - resim.width)).toBeLessThan(3);
  await expect(page.locator('[data-test="gor-incele"]')).toHaveText('İncele · 4 nokta');
  await page.locator('[data-test="gor-incele"]').click();
  await expect(panel).toBeVisible();
  await page.locator('.gor').getByRole('button', { name: 'Kapat' }).click();
  await expect(gor).toHaveCount(0);
});

test('kayıt yoksa: başyapıt sayfasında giriş yok, görüntüleyicide İncele düğmesi yok; veri dosyası 404 olsa da sayfa çalışır', async ({ page, context }) => {
  await hazirla(context, null);
  await page.goto(`./#/basyapit/${encodeURIComponent(K)}`);
  await expect(page.locator('[data-basyapit-gorsel] img')).toBeAttached();
  await expect(page.locator('[data-test="basyapit-incele"]')).toHaveCount(0);
  await page.locator('[data-basyapit-buyut]').click();
  await expect(page.locator('.gor')).toBeVisible();
  await expect(page.locator('[data-test="gor-incele"]')).toHaveCount(0);
  await expect(page.locator('[data-test="gor-inceleme"]')).toHaveCount(0);
});

test('sanatçı sayfasındaki eser ızgarasından açılan görüntüleyicide de İncele var; başka esere geçince kapanır', async ({ page, context }) => {
  await hazirla(context);
  await page.goto('./#/sanatci/j-m-w-turner');
  const eserler = page.locator('#eserler [data-eser]');
  await expect(eserler.first()).toBeVisible();
  await eserler.first().click();
  const incele = page.locator('[data-test="gor-incele"]');
  await expect(incele).toBeVisible();
  await incele.click();
  await expect(page.locator('.gor-nokta')).toHaveCount(4);
  await page.locator('.gor-nokta').nth(2).click();
  await expect(page.locator('[data-test="gor-inc-no"]')).toHaveText('3 / 4');
  await page.locator('.gor').getByRole('button', { name: 'Sonraki eser' }).click();
  await expect(page.locator('[data-test="gor-inceleme"]')).toBeHidden();
  await expect(page.locator('.gor-nokta')).toHaveCount(0);
  await expect(incele).toBeHidden();
  expect(await olcek(page)).toBeCloseTo(1, 1);
});
