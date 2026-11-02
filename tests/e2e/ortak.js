// Uçtan uca testler için ağ fikstürleri: dış servislere gerçek istek gitmez.
import { existsSync, readFileSync } from 'node:fs';

const fx = (ad) => readFileSync(new URL(`../fixtures/${ad}`, import.meta.url));

export async function agiHazirla(context, { tanisma = false } = {}) {
  // Yeni sanatçı tanışma ekranı çoğu testte kapalı (doğrudan soruya geçilir); ogrenme.spec.js açar
  if (!tanisma) await context.addInitScript(() => (window.__atlasTanismaYok = true));
  const resim = fx('eser.png');
  // gerçek önbellek + Giotto'nun listesinin sonuna sabit fikstür eserleri (yerel dosya; ağa çıkılmaz)
  const gercek = JSON.parse(readFileSync(new URL('../../data/eserler_onbellek.json', import.meta.url), 'utf8'));
  const sabit = JSON.parse(fx('eserler_onbellek.json').toString('utf8'));
  const sanatcilar = { ...gercek.sanatcilar };
  for (const [id, k] of Object.entries(sabit.sanatcilar)) sanatcilar[id] = { ...k, eserler: [...((gercek.sanatcilar[id] || {}).eserler || []), ...k.eserler] };
  const onbellek = JSON.stringify({ ...gercek, olusturma: new Date().toISOString(), sanatcilar });
  await context.route(
    /commons\.wikimedia\.org\/wiki\/Special:FilePath|upload\.wikimedia\.org|images\.metmuseum\.org|www\.artic\.edu\/iiif|api\.nga\.gov\/iiif|openaccess-cdn\.clevelandart\.org|uploads\d*\.wikiart\.org|\.r2\.dev/,
    (r) => r.fulfill({ status: 200, contentType: 'image/png', body: resim, headers: { 'access-control-allow-origin': '*' } }),
  );
  // İş 102: 1280'likler R2'den (gorsel.noracloud.ai/b/<ad>.jpg); testte yerel kopyası varsa o, yoksa fikstür görsel (ağa çıkılmaz)
  await context.route(/gorsel\.noracloud\.ai\//, (r) => {
    const m = /\/[bd]\/([0-9a-f]{16})(?:-[0-9a-f]+)?\.jpg/.exec(r.request().url()); // en büyük kopya (d/) yerine de 1280'lik
    const yerel = m && new URL(`../../gorseller/b/${m[1]}.jpg`, import.meta.url);
    if (yerel && existsSync(yerel)) return r.fulfill({ status: 200, contentType: 'image/jpeg', body: readFileSync(yerel), headers: { 'access-control-allow-origin': '*' } });
    return r.fulfill({ status: 200, contentType: 'image/png', body: resim, headers: { 'access-control-allow-origin': '*' } });
  });
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
  await context.route(/\/data\/eserler_onbellek\.json(\?.*)?$/, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: onbellek }));
}

export async function ilerleme(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('sanat-atlasi:ilerleme')));
}
