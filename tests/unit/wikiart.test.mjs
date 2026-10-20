import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugYap, slugAdaylari, yilCoz, eslesme, resimMi, adaySirala, sayfaSec, hedefSanatcilar, Sinirlayici } from '../../scripts/kaynaklar/wikiart.mjs';
import { wikiartEkle, wikiartCikar, wikiartiUygula, gorselPuani } from '../../scripts/kaynaklar/birlestir.mjs';
import { gorselUrl, gorselKaynakYazisi, gorselSayfasi, pekistirmeyeUygunMu } from '../../js/gorsel.js';

const dali = { id: 'salvador-dali', ad: 'Salvador Dalí', ad_arama: 'Salvador Dalí', dogum: 1904, olum: 1989, akim: 'Sürrealizm' };

test('WikiArt adresleri: aksansız, parantezsiz, tireli', () => {
  assert.equal(slugYap('Salvador Dalí'), 'salvador-dali');
  assert.equal(slugYap('Hannah Höch'), 'hannah-hoch');
  assert.equal(slugYap('Lucas Cranach (Yaşlı)'), 'lucas-cranach');
  assert.deepEqual(slugAdaylari({ ad: 'René Magritte', ad_arama: 'Rene Magritte' }), ['rene-magritte']);
});

test('WikiArt yılları: metinden, MÖ, tarih alanından', () => {
  assert.equal(yilCoz('May 11, 1904'), 1904);
  assert.equal(yilCoz('480 BC'), -480);
  assert.equal(yilCoz('', '/Date(-2071526400000)/'), 1904);
  assert.equal(yilCoz('', null), null);
});

test('sanatçı eşleşmesi: ad + doğum ±3; şüpheli; eşleşmez', () => {
  const wa = { artistName: 'Salvador Dali', lastNameFirst: 'Dali Salvador', birthDayAsString: 'May 11, 1904', deathDayAsString: 'January 23, 1989' };
  assert.equal(eslesme(dali, wa), 'kesin');
  assert.equal(eslesme(dali, { ...wa, birthDayAsString: '1906' }), 'kesin', '±3');
  assert.equal(eslesme(dali, { ...wa, birthDayAsString: '1910' }), null, 'doğum tutmuyor');
  assert.equal(eslesme(dali, { ...wa, birthDayAsString: '' , birthDay: null }), null, 'doğum yok');
  assert.equal(eslesme(dali, { ...wa, deathDayAsString: '1970' }), 'supheli', 'ölüm tutmuyor');
  assert.equal(eslesme(dali, { ...wa, artistName: 'Gala Dali', lastNameFirst: '' }), 'supheli', 'yalnızca soyad');
  assert.equal(eslesme(dali, { ...wa, artistName: 'Joan Miro', lastNameFirst: '' }), null, 'başka ad');
  const fidias = { ad: 'Phidias', ad_arama: 'Phidias', dogum: -480 };
  assert.equal(eslesme(fidias, { artistName: 'Phidias', birthDayAsString: '490 BC' }), 'supheli', 'antik ±15');
});

test('yalnızca resim: heykel, mimari, fotoğraf, enstalasyon, tasarım çıkar', () => {
  const r = (x) => ({ title: 'Eser', image: 'https://uploads.wikiart.org/a.jpg', genres: ['landscape'], media: ['oil', 'canvas'], ...x });
  assert.equal(resimMi(r({})), true);
  for (const g of ['sculpture', 'architecture', 'photo', 'installation', 'design']) assert.equal(resimMi(r({ genres: [g] })), false, g);
  assert.equal(resimMi(r({ media: ['bronze'] })), false, 'yalnızca bronz');
  assert.equal(resimMi(r({ media: ['gelatin silver print'] })), false, 'fotoğraf baskısı');
  assert.equal(resimMi(r({ media: ['collage', 'paper'] })), true, 'kolaj');
  assert.equal(resimMi(r({ title: 'Un Chien Andalou (film still)', genres: ['symbolic painting'] })), false);
  assert.equal(resimMi(r({ image: '' })), false);
});

test('aday sırası: önce öne çıkanlar, sonra on yıllara yayılmış büyük görseller', () => {
  const liste = [
    { id: 'a', title: 'A', year: '1925', width: 800, height: 600 },
    { id: 'b', title: 'B', year: '1926', width: 1600, height: 1200 },
    { id: 'c', title: 'C', year: '1935', width: 900, height: 900 },
    { id: 'k', title: 'Küçük', year: '1930', width: 200, height: 150 },
    { id: 'f', title: 'Film (film still)', year: '1929', width: 900, height: 700 },
    { id: 'x', title: 'Eski', year: '1890', width: 900, height: 700 },
  ];
  const s = adaySirala([{ id: 'c' }], liste, dali);
  assert.deepEqual(
    s.map((x) => x.id),
    ['c', 'b', 'a'],
  );
  assert.equal(s[0].oneCikan, true);
  assert.deepEqual(sayfaSec(3), [1, 2, 3]);
  assert.deepEqual(sayfaSec(20, 4), [1, 7, 14, 20]);
});

test('hedef sanatçılar: az eserli ve 20. yüzyıl; heykeltıraş ve doğum yılı bilinmeyen atlanır', () => {
  const akimlar = [
    { ad: 'Rokoko', sira: 15 },
    { ad: 'Kübizm', sira: 27 },
  ];
  const cok = Array.from({ length: 12 }, (_, i) => ({ baslik: 'E' + i, kaynaklar: ['wikidata'], gorseller: [{ k: 'commons', d: i + '.jpg', p: 50 }] }));
  const sanatcilar = [
    { id: 'a', akim: 'Rokoko', dogum: 1700 },
    { id: 'b', akim: 'Rokoko', dogum: 1700 },
    { id: 'c', akim: 'Kübizm', dogum: 1881 },
    { id: 'd', akim: 'Rokoko', dogum: null },
    { id: 'e', akim: 'Rokoko', dogum: 1700 },
  ];
  const onbellek = { sanatcilar: { a: { eserler: cok }, c: { eserler: cok } } };
  const { hedefler, atlananlar } = hedefSanatcilar({ sanatcilar, akimlar, onbellek, turler: { ana_ugras_disi: { e: true } } });
  assert.deepEqual(
    hedefler.map((h) => h.s.id),
    ['b', 'c'],
  );
  assert.deepEqual(
    atlananlar.map((h) => h.s.id),
    ['d', 'e'],
  );
});

test('istek sınırı: saniyede ≤3, saatte ≤350', async () => {
  let t = 0;
  const uyu = async (ms) => {
    t += ms;
  };
  const s = new Sinirlayici({ saniye: 3, saat: 5, simdi: () => t, uyu });
  const zamanlar = [];
  for (let i = 0; i < 7; i++) {
    await s.sira();
    zamanlar.push(t);
  }
  for (let i = 1; i < zamanlar.length; i++) assert.ok(zamanlar[i] - zamanlar[i - 1] >= 334);
  assert.ok(zamanlar[5] - zamanlar[0] >= 3600_000, 'saatlik pencere');
});

test('WikiArt birleştirme: başlık + yıl ±5, yeniden uygulanabilir, şüpheli pekiştirmeye girmez', () => {
  const mevcut = [
    { baslik: 'Belleğin Azmi', baslikEn: 'The Persistence of Memory', yil: 1931, kaynaklar: ['wikidata'], gorseller: [{ k: 'commons', d: 'foto.jpg', p: 5 }], pekistirme: false },
    { baslik: 'Self-Portrait', kaynaklar: ['wikidata'], gorseller: [{ k: 'commons', d: 'oz.jpg', p: 50 }] },
  ];
  const kayit = {
    durum: 'eslesti',
    eserler: [
      { baslik: 'The Persistence of Memory', yil: 1933, sayfa: 'https://www.wikiart.org/en/salvador-dali/p', gorsel: 'https://uploads2.wikiart.org/p.jpg!HalfHD.jpg' },
      { baslik: 'Self-Portrait', yil: 1921, sayfa: 'https://www.wikiart.org/en/salvador-dali/s', gorsel: 'https://uploads2.wikiart.org/s.jpg' },
    ],
  };
  const sonuc = wikiartEkle(mevcut, kayit);
  assert.equal(sonuc.length, 3, 'yılsız genel başlık birleşmez');
  assert.equal(sonuc[0].gorseller[0].k, 'wikiart', 'fotoğraf gibi görselin üstünde');
  assert.equal(sonuc[0].pekistirme, true);
  assert.deepEqual(sonuc[0].kaynaklar, ['wikidata', 'wikiart']);
  assert.equal(sonuc[2].baslik, 'Self-Portrait');
  assert.deepEqual(wikiartEkle(sonuc, kayit), sonuc, 'yeniden uygulama aynı sonucu verir');
  assert.deepEqual(
    wikiartCikar(sonuc).map((e) => e.baslik),
    ['Belleğin Azmi', 'Self-Portrait'],
  );
  assert.equal(wikiartCikar(sonuc)[0].pekistirme, false);

  const supheli = wikiartEkle([], { ...kayit, durum: 'supheli' });
  assert.equal(supheli.length, 2, "Göz At'ta görünür");
  assert.ok(supheli.every((e) => e.pekistirme === false), 'pekiştirmeye girmez');
  assert.equal(wikiartEkle(mevcut, { ...kayit, durum: 'eslesmedi' }).length, 2);

  // puan sırası: müze > Commons taraması > WikiArt > fotoğraf gibi
  assert.ok(gorselPuani({ k: 'commons', d: 'Vermeer_-_Google_Art_Project.jpg' }) > gorselPuani({ k: 'wikiart' }));
  assert.ok(gorselPuani({ k: 'commons', d: 'Vermeer.jpg' }) > gorselPuani({ k: 'wikiart' }));
  assert.ok(gorselPuani({ k: 'wikiart' }) > gorselPuani({ k: 'commons', d: 'Vermeer_in_frame.jpg' }));

  const ob = { sanatcilar: { 'salvador-dali': { eserler: mevcut } } };
  wikiartiUygula(ob, { sanatcilar: { 'salvador-dali': kayit } });
  assert.equal(ob.sanatcilar['salvador-dali'].eserler.length, 3);
  assert.ok(!('pekistirme' in ob.sanatcilar['salvador-dali'].eserler[0]), 'önbellek biçiminde true yazılmaz');
});

test('uygulamada WikiArt görseli: Large/HalfHD, "Kaynak: WikiArt" ve eser sayfası', () => {
  const g = { k: 'wikiart', u: 'https://uploads2.wikiart.org/p.jpg!HalfHD.jpg', s: 'https://www.wikiart.org/en/salvador-dali/p', p: 40 };
  assert.equal(gorselUrl(g, 800), g.u);
  assert.equal(gorselUrl(g, 400), 'https://uploads2.wikiart.org/p.jpg!Large.jpg');
  assert.equal(gorselUrl({ ...g, u: 'https://uploads2.wikiart.org/k.jpg' }, 400), 'https://uploads2.wikiart.org/k.jpg', 'küçük özgün dosya');
  assert.equal(gorselKaynakYazisi(g), 'Kaynak: WikiArt');
  assert.equal(gorselSayfasi(g), g.s);
  assert.equal(pekistirmeyeUygunMu({ anahtar: 'x', gorseller: [g] }), true);
  assert.equal(pekistirmeyeUygunMu({ anahtar: 'x', gorseller: [{ ...g, p: 5 }], pekistirme: false }), false);
});
