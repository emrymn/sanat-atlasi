import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { agiHazirla } from './ortak.js';

const onbellek = JSON.parse(readFileSync(new URL('../../data/eserler_onbellek.json', import.meta.url), 'utf8'));

test('Türkçe eser adı galeride ve görüntüleyicide; özgün ad küçük satırda', async ({ page, context }) => {
  await agiHazirla(context);
  const ilk = onbellek.sanatcilar['j-m-w-turner'].eserler[0];
  const k = ilk.qid || `j-m-w-turner|${ilk.baslik}`;
  await context.route(/\/data\/eser_adlari_tr\.json(\?.*)?$/, (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ surum: 1, adlar: { [k]: 'TEST Türkçe Ad' } }) }),
  );
  await page.goto('./#/sanatci/j-m-w-turner');
  const eser = page.locator('[data-eser]').filter({ hasText: 'TEST Türkçe Ad' });
  await expect(eser).toHaveCount(1);
  await eser.click();
  await expect(page.locator('.gor-baslik')).toContainText('TEST Türkçe Ad');
  await expect(page.locator('[data-test="ozgun-ad"]')).toHaveText(ilk.baslik);
});
