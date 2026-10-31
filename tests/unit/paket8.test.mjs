// Rapor 8. paket: K4 koleksiyon, İ1 takvim ve seri, İ2 rozet, İ4 grafik verileri, İ5 bildirim, T2/T3/T4
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { varsayilanIlerleme, yedekMetni, yedekCoz } from '../../js/depo.js';
import { gecmisEkle, gecmisDogrula, takvim, seri, haftalikOran, gelecekYuk, vadeSayisi, yarinVade, baskinAkim } from '../../js/gecmis.js';
import { koleksiyonDegistir, koleksiyondaMi, koleksiyonDogrula, KOLEKSIYON_SINIRI } from '../../js/koleksiyon.js';
import { eseriBildir, bildirimMetni, bildirimlerDogrula, NEDENLER } from '../../js/bildirim.js';
import { secilenGorsel, pekistirmeyeUygunMu } from '../../js/gorsel.js';
import { rozetYaz, rozetIzni, rozetDestekli } from '../../js/rozet.js';
import { gosterilecekler, yenilikYazisi, YENILIKLER } from '../../js/yenilikler.js';
import { SURUM } from '../../js/surum.js';

const oku = (y) => readFileSync(new URL(`../../${y}`, import.meta.url), 'utf8');

// ---------- İ1 · geçmiş, takvim, seri ----------
test('gecmisEkle: günün kartı, doğrusu ve akımı sayılır', () => {
  const i = varsayilanIlerleme();
  gecmisEkle(i, '2026-10-20', { dogru: true, akim: 'Barok' });
  gecmisEkle(i, '2026-10-20', { dogru: false, akim: 'Barok' });
  gecmisEkle(i, '2026-10-20', { dogru: true, akim: 'Rokoko' });
  assert.deepEqual(i.gecmis['2026-10-20'], { kart: 3, dogru: 2, akimlar: { Barok: 2, Rokoko: 1 } });
  assert.equal(baskinAkim(i.gecmis['2026-10-20']), 'Barok');
  assert.equal(baskinAkim(null), null);
});

test('baskinAkim: eşitlikte ada göre', () => {
  assert.equal(baskinAkim({ akimlar: { Rokoko: 2, Barok: 2 } }), 'Barok');
});

test('takvim: 12 hafta × 7 gün, pazartesi başlar, bugünden sonrası gelecek', () => {
  // 2026-10-22 perşembe
  const t = takvim({ '2026-10-22': { kart: 5, dogru: 4, akimlar: { Barok: 5 } } }, '2026-10-22', 12);
  assert.equal(t.length, 84);
  assert.equal(t[0].tarih, '2026-08-03'); // pazartesi
  assert.equal(new Date(2026, 7, 3).getDay(), 1);
  const bugun = t.find((x) => x.tarih === '2026-10-22');
  assert.equal(bugun.kart, 5);
  assert.equal(bugun.akim, 'Barok');
  assert.equal(bugun.gelecek, false);
  assert.equal(t[t.length - 1].tarih, '2026-10-25'); // pazar
  assert.equal(t.filter((x) => x.gelecek).length, 3);
});

test('seri: art arda günler; bugün boşsa dünden sayılır; kopunca sıfırlanır', () => {
  const g = {};
  for (const t of ['2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21']) g[t] = { kart: 1, dogru: 1, akimlar: {} };
  assert.equal(seri(g, '2026-10-22'), 5); // bugün henüz çalışılmadı
  g['2026-10-22'] = { kart: 2, dogru: 1, akimlar: {} };
  assert.equal(seri(g, '2026-10-22'), 6);
  assert.equal(seri(g, '2026-10-24'), 0); // iki gün ara
  assert.equal(seri({}, '2026-10-22'), 0);
  delete g['2026-10-19'];
  assert.equal(seri(g, '2026-10-22'), 3);
});

test('gecmisDogrula: geçersiz günler atılır, doğru ≤ kart', () => {
  const g = gecmisDogrula({
    '2026-10-20': { kart: 3, dogru: 9, akimlar: { Barok: 3, Kotu: -1 } },
    bozuk: { kart: 1, dogru: 1 },
    '2026-10-21': { kart: 'x', dogru: 1 },
    '2026-10-22': null,
  });
  assert.deepEqual(Object.keys(g), ['2026-10-20']);
  assert.equal(g['2026-10-20'].dogru, 3);
  assert.deepEqual(g['2026-10-20'].akimlar, { Barok: 3 });
  assert.deepEqual(gecmisDogrula(null), {});
  assert.deepEqual(gecmisDogrula([1]), {});
});

// ---------- İ4 · grafikler ----------
test('haftalikOran: hafta başına doğru oranı, kartsız hafta null', () => {
  const g = {
    '2026-10-19': { kart: 4, dogru: 3, akimlar: {} }, // bu hafta (pazartesi)
    '2026-10-22': { kart: 6, dogru: 3, akimlar: {} },
    '2026-10-12': { kart: 10, dogru: 10, akimlar: {} }, // geçen hafta
  };
  const h = haftalikOran(g, '2026-10-22', 12);
  assert.equal(h.length, 12);
  assert.equal(h[11].bas, '2026-10-19');
  assert.equal(h[11].kart, 10);
  assert.equal(h[11].oran, 0.6);
  assert.equal(h[10].oran, 1);
  assert.equal(h[0].oran, null);
});

test('gelecekYuk: 14 gün; vadesi geçmiş bugüne, sanatçı bir kez sayılır, görülmemişler sayılmaz', () => {
  const sk = (sonraki) => ({ kutu: 2, sonraki, dogru: 1, yanlis: 0, son: '2026-10-20' });
  const skorlar = {
    a: { sanatci: sk('2026-10-15') }, // geçmiş → bugün
    b: { sanatci: sk('2026-10-23'), akim: sk('2026-10-30') }, // en yakın vade: yarın
    c: { sanatci: sk('2026-10-22') },
    d: { akim: sk('2026-11-04') }, // 13. gün
    e: { sanatci: sk('2026-11-20') }, // 14 günün dışında
    f: { sanatci: { kutu: 0, sonraki: null, dogru: 0, yanlis: 0, son: null } },
  };
  const y = gelecekYuk(skorlar, ['a', 'b', 'c', 'd', 'e', 'f', 'yok'], '2026-10-22', 14);
  assert.equal(y.length, 14);
  assert.equal(y[0], 2); // a + c
  assert.equal(y[1], 1); // b
  assert.equal(y[13], 1); // d
  assert.equal(y.reduce((t, n) => t + n, 0), 4);
});

test('vadeSayisi ve yarinVade (rozet sayısı)', () => {
  const sk = (sonraki) => ({ kutu: 1, sonraki, dogru: 1, yanlis: 0, son: '2026-10-20' });
  const skorlar = { a: { sanatci: sk('2026-10-22') }, b: { akim: sk('2026-10-23') }, c: { sanatci: sk('2026-10-25') } };
  assert.equal(vadeSayisi(skorlar, ['a', 'b', 'c'], '2026-10-22'), 1);
  assert.equal(yarinVade(skorlar, ['a', 'b', 'c'], '2026-10-22'), 2);
  assert.equal(yarinVade(skorlar, ['c'], '2026-10-22'), 0);
});

// ---------- K4 · koleksiyon ----------
const eser = (a, sid = 'giotto') => ({ anahtar: a, sid, baslik: 'Eser ' + a, gorseller: [{ k: 'commons', d: `${a}.jpg` }, { k: 'commons', d: `${a}-2.jpg` }] });

test('koleksiyonDegistir: ekler (en yeni başta), ikinci dokunuşta çıkarır; sanatçısız eser eklenmez', () => {
  const i = varsayilanIlerleme();
  assert.equal(koleksiyonDegistir(i, eser('q:Q1'), '2026-10-22'), true);
  assert.equal(koleksiyonDegistir(i, eser('q:Q2', 'monet'), '2026-10-23'), true);
  assert.deepEqual(i.koleksiyon.map((x) => x.a), ['q:Q2', 'q:Q1']);
  assert.equal(koleksiyondaMi(i, eser('q:Q1')), true);
  assert.equal(koleksiyonDegistir(i, eser('q:Q1'), '2026-10-24'), false);
  assert.equal(koleksiyondaMi(i, eser('q:Q1')), false);
  assert.equal(koleksiyonDegistir(i, { anahtar: 'q:Q9', gorseller: [] }, '2026-10-24'), false);
  assert.equal(i.koleksiyon.length, 1);
});

test('koleksiyonDogrula: tekrarlar ve bozuk kayıtlar atılır, sınır korunur', () => {
  const k = koleksiyonDogrula([{ a: 'x', s: 'a', t: '2026-10-22' }, { a: 'x', s: 'a' }, { a: 5, s: 'a' }, null, { a: 'y', s: 'b' }]);
  assert.deepEqual(k, [{ a: 'x', s: 'a', t: '2026-10-22' }, { a: 'y', s: 'b', t: '' }]);
  assert.deepEqual(koleksiyonDogrula('x'), []);
  const cok = Array.from({ length: KOLEKSIYON_SINIRI + 20 }, (_, n) => ({ a: 'e' + n, s: 's' }));
  assert.equal(koleksiyonDogrula(cok).length, KOLEKSIYON_SINIRI);
});

// ---------- İ5 · bildirim ----------
test('eseriBildir: "Kötü görsel" yalnızca gösterilen görseli çıkarır, eser başka görselle kalır', () => {
  const i = varsayilanIlerleme();
  const e = eser('q:Q1');
  const sonraki = eseriBildir(i, e, secilenGorsel(e, i.kotuGorseller), 'Kötü görsel', '2026-10-22');
  assert.equal(sonraki.d, 'q:Q1-2.jpg');
  assert.deepEqual(i.kotuGorseller['q:Q1'], ['c:q:q1.jpg']);
  assert.equal(pekistirmeyeUygunMu(e, i.kotuGorseller), true);
  assert.equal(i.bildirimler.length, 1);
  assert.deepEqual(i.bildirimler[0], { a: 'q:Q1', s: 'giotto', baslik: 'Eser q:Q1', neden: 'Kötü görsel', g: 'c:q:q1.jpg', t: '2026-10-22' });
});

test('eseriBildir: diğer nedenlerde eserin bütün görselleri çıkar → pekiştirmeden çıkar', () => {
  for (const neden of ['Yanlış sanatçı', 'Heykel/mimari', 'Yanlış ad']) {
    const i = varsayilanIlerleme();
    const e = eser('q:Q2');
    assert.equal(pekistirmeyeUygunMu(e, i.kotuGorseller), true);
    const sonraki = eseriBildir(i, e, null, neden, '2026-10-22');
    assert.equal(sonraki, null);
    assert.equal(pekistirmeyeUygunMu(e, i.kotuGorseller), false);
    assert.equal(i.kotuGorseller['q:Q2'].length, 2);
    assert.equal(i.bildirimler[0].neden, neden);
  }
});

test('eseriBildir: aynı bildirim tekrarlanırsa tek kayıt; bilinmeyen neden hiçbir şey yazmaz', () => {
  const i = varsayilanIlerleme();
  const e = eser('q:Q3');
  eseriBildir(i, e, null, 'Yanlış ad', '2026-10-20');
  eseriBildir(i, e, null, 'Yanlış ad', '2026-10-22');
  assert.equal(i.bildirimler.length, 1);
  assert.equal(i.bildirimler[0].t, '2026-10-22');
  eseriBildir(i, e, null, 'uydurma', '2026-10-22');
  assert.equal(i.bildirimler.length, 1);
  assert.deepEqual(NEDENLER, ['Yanlış sanatçı', 'Heykel/mimari', 'Kötü görsel', 'Yanlış ad']);
});

test('bildirimMetni: kopyalanacak JSON ve doğrulama', () => {
  const i = varsayilanIlerleme();
  eseriBildir(i, eser('q:Q4'), null, 'Yanlış sanatçı', '2026-10-22');
  const j = JSON.parse(bildirimMetni(i));
  assert.equal(j.tur, 'gorsel-bildirimleri');
  assert.equal(j.bildirimler.length, 1);
  assert.equal(bildirimlerDogrula([{ a: 'x', s: 'y', neden: 'uydurma' }, { a: 'x', s: 'y', neden: 'Yanlış ad' }, 5]).length, 1);
});

// ---------- yedek gidiş-dönüşü ----------
test('yedek: geçmiş, koleksiyon, bildirimler, rozet ayarı ve son sürüm kayıpsız geri gelir', () => {
  const i = varsayilanIlerleme([1]);
  gecmisEkle(i, '2026-10-22', { dogru: true, akim: 'Barok' });
  koleksiyonDegistir(i, eser('q:Q1'), '2026-10-22');
  eseriBildir(i, eser('q:Q2'), null, 'Yanlış ad', '2026-10-22');
  i.ayarlar.rozet = true;
  i.sonSurum = '1.26.0';
  const geri = yedekCoz(yedekMetni(i));
  assert.deepEqual(geri.gecmis, i.gecmis);
  assert.deepEqual(geri.koleksiyon, i.koleksiyon);
  assert.deepEqual(geri.bildirimler, i.bildirimler);
  assert.equal(geri.ayarlar.rozet, true);
  assert.equal(geri.sonSurum, '1.26.0');
});

test('eski yedek (yeni alanlar yok) sorunsuz yüklenir', () => {
  const geri = yedekCoz(JSON.stringify({ islenen: [1], skorlar: {} }));
  assert.deepEqual(geri.gecmis, {});
  assert.deepEqual(geri.koleksiyon, []);
  assert.deepEqual(geri.bildirimler, []);
  assert.equal(geri.ayarlar.rozet, false);
  assert.equal(geri.sonSurum, null);
});

// ---------- İ2 · rozet ----------
test('rozetYaz: sayı > 0 setAppBadge, 0 clearAppBadge; destek yoksa false', async () => {
  const cagrilar = [];
  const nav = { setAppBadge: async (n) => cagrilar.push(['set', n]), clearAppBadge: async () => cagrilar.push(['temizle']) };
  assert.equal(rozetDestekli(nav), true);
  assert.equal(await rozetYaz(7, nav), true);
  assert.equal(await rozetYaz(0, nav), true);
  assert.deepEqual(cagrilar, [['set', 7], ['temizle']]);
  assert.equal(await rozetYaz(3, {}), false);
  assert.equal(await rozetYaz(3, { setAppBadge: async () => Promise.reject(new Error('x')) }), false);
});

test('rozetIzni: verilmiş → true, reddedilmiş → false, sorulunca sonuç', async () => {
  assert.equal(await rozetIzni({ permission: 'granted', requestPermission: async () => 'denied' }), true);
  assert.equal(await rozetIzni({ permission: 'denied', requestPermission: async () => 'granted' }), false);
  assert.equal(await rozetIzni({ permission: 'default', requestPermission: async () => 'granted' }), true);
  assert.equal(await rozetIzni({ permission: 'default', requestPermission: async () => 'denied' }), false);
  assert.equal(await rozetIzni(undefined), true);
});

// ---------- T4 · yenilikler ----------
test('gosterilecekler: son görülen sürümden sonrakiler; ilk kullanımda yalnızca şimdiki', () => {
  const liste = [
    { surum: '1.26.0', metin: 'c' },
    { surum: '1.25.0', metin: 'b' },
    { surum: '1.24.0', metin: 'a' },
  ];
  assert.deepEqual(gosterilecekler('1.25.2', '1.26.0', true, liste).map((x) => x.surum), ['1.26.0']);
  assert.deepEqual(gosterilecekler('1.24.0', '1.26.0', true, liste).map((x) => x.surum), ['1.26.0', '1.25.0']);
  assert.deepEqual(gosterilecekler('1.26.0', '1.26.0', true, liste), []);
  assert.deepEqual(gosterilecekler(null, '1.26.0', true, liste).map((x) => x.surum), ['1.26.0']); // eski kayıt
  assert.deepEqual(gosterilecekler(null, '1.26.0', false, liste), []); // yepyeni kullanıcı
  // şimdiki sürümden yeni satırlar (ileride yazılmış) gösterilmez
  assert.deepEqual(gosterilecekler('1.24.0', '1.25.0', true, liste).map((x) => x.surum), ['1.25.0']);
});

test('yenilikYazisi biçimi ve listenin başı şimdiki sürüm', () => {
  assert.equal(yenilikYazisi({ surum: '1.20.0', metin: 'Ters soru, arama eklendi' }), '1.20 · Ters soru, arama eklendi');
  assert.equal(yenilikYazisi({ surum: '1.21.1', metin: 'x' }), '1.21.1 · x');
  // yalnızca düzeltme olan sürümler (1.26.1 gibi) listeye girmez: baş satır şimdiki sürümün ana.ara sürümü
  assert.equal(YENILIKLER[0].surum.split('.').slice(0, 2).join('.'), SURUM.split('.').slice(0, 2).join('.'));
});

// ---------- sürüm, kabuk, T2, T3 ----------
test('sürüm: js/surum.js ile sw.js aynı, 1.56.5', () => {
  assert.equal(SURUM, '1.56.5');
  assert.match(oku('sw.js'), /const SURUM = '1\.56\.5';/);
});

test('T2: eser notları açılışta beklenmez, ilk ekrandan sonra yüklenir', () => {
  const app = oku('js/app.js');
  const bekleyen = app.slice(app.indexOf('Promise.all(['), app.indexOf(']);', app.indexOf('Promise.all([')));
  assert.doesNotMatch(bekleyen, /eser_notlari/);
  assert.match(app, /setTimeout\(notlariYukle, 0\)/);
  assert.match(app, /new Event\('atlas-notlar'\)/);
  assert.match(oku('js/goruntuleyici.js'), /'atlas-notlar'/);
});

test('T3: Playwright webkit projesi var, varsayılan e2e yalnızca chromium', () => {
  const cfg = oku('playwright.config.js');
  assert.match(cfg, /name: 'webkit'/);
  assert.match(cfg, /browserName: 'webkit'/);
  const paket = JSON.parse(oku('package.json'));
  assert.equal(paket.scripts['test:e2e'], 'playwright test --project=chromium');
  assert.equal(paket.scripts['test:webkit'], 'playwright test --project=webkit');
});
