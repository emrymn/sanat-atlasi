// Uçtan uca testler için ağ fikstürleri: dış servislere gerçek istek gitmez.
import { readFileSync } from 'node:fs';

const fx = (ad) => readFileSync(new URL(`../fixtures/${ad}`, import.meta.url));

export async function agiHazirla(context) {
  const resim = fx('eser.png');
  // gerçek önbellek + Giotto için sabit fikstür eserleri (yerel dosya; ağa çıkılmaz)
  const gercek = JSON.parse(readFileSync(new URL('../../data/eserler_onbellek.json', import.meta.url), 'utf8'));
  const sabit = JSON.parse(fx('eserler_onbellek.json').toString('utf8'));
  const onbellek = JSON.stringify({ ...gercek, olusturma: new Date().toISOString(), sanatcilar: { ...gercek.sanatcilar, ...sabit.sanatcilar } });
  await context.route(/commons\.wikimedia\.org\/wiki\/Special:FilePath|upload\.wikimedia\.org/, (r) =>
    r.fulfill({ status: 200, contentType: 'image/png', body: resim, headers: { 'access-control-allow-origin': '*' } }),
  );
  await context.route(/www\.wikidata\.org\/w\/api\.php/, (r) =>
    r.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ search: [], entities: {} }),
      headers: { 'access-control-allow-origin': '*' },
    }),
  );
  await context.route(/query\.wikidata\.org/, (r) =>
    r.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ results: { bindings: [] } }),
      headers: { 'access-control-allow-origin': '*' },
    }),
  );
  await context.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await context.route(/\/data\/eserler_onbellek\.json$/, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: onbellek }));
}

export async function ilerleme(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme')));
}
