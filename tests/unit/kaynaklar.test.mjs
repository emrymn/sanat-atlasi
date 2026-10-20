import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dogrudanAtifMi, tanimCoz, sanatciEslesirMi, resimselTurMu } from '../../scripts/kaynaklar/ortak.mjs';
import { birlestir, ayniEserMi, gorselPuani, fotoGibiMi, makulYilMi } from '../../scripts/kaynaklar/birlestir.mjs';
import { dosyaBasligi, TARAMA } from '../../scripts/kaynaklar/commons.mjs';
import { csvAyristir } from '../../scripts/kaynaklar/nga.mjs';
import { gorselUrl, gorselAnahtari, secilenGorsel, kotuIsaretle, pekistirmeyeUygunMu } from '../../js/gorsel.js';

test('atıf süzgeci: atölye, çevre, takipçi, atfedilen, kopya, okul alınmaz', () => {
  for (const x of ['Workshop of Rembrandt', 'Circle of Titian', 'Follower of Caravaggio', 'Attributed to Giotto', 'Copy after Raphael', 'School of Fontainebleau', 'Titian and Workshop', 'Style of Boucher', 'Rembrandt Workshop (possibly Govert Flinck)'])
    assert.equal(dogrudanAtifMi(x), false, x);
  for (const x of ['Rembrandt van Rijn', 'Claude Monet (French, 1840–1926)', '', 'Jean-Honoré Fragonard', 'Théodore Géricault']) assert.equal(dogrudanAtifMi(x), true, x);
});

test('sanatçı eşleşmesi: ad + doğum yılı ±3; yıl yoksa alınmaz', () => {
  const monet = { ad: 'Claude Monet', ad_arama: 'Claude Monet', dogum: 1840 };
  assert.deepEqual(tanimCoz('Claude Monet (French, 1840–1926)'), { ad: 'Claude Monet', dogum: 1840, olum: 1926 });
  assert.equal(sanatciEslesirMi(monet, tanimCoz('Claude Monet (French, 1840–1926)')), true);
  assert.equal(sanatciEslesirMi(monet, { ad: 'claude monet', dogum: 1842 }), true);
  assert.equal(sanatciEslesirMi(monet, { ad: 'Claude Monet', dogum: 1850 }), false);
  assert.equal(sanatciEslesirMi(monet, { ad: 'Claude Monet', dogum: null }), false);
  assert.equal(sanatciEslesirMi(monet, { ad: 'Michel Monet', dogum: 1840 }), false);
  assert.equal(sanatciEslesirMi({ ad: 'Rembrandt van Rijn', ad_arama: 'Rembrandt', dogum: 1606 }, { ad: 'Rembrandt Harmensz. van Rijn', dogum: 1606 }, ['Rembrandt Harmensz. van Rijn']), true);
});

test('müze türleri: yalnızca iki boyutlu resimsel', () => {
  for (const t of ['Paintings', 'Painting', 'Drawings', 'Prints', 'Drawing and Watercolor', 'Miniature']) assert.equal(resimselTurMu(t), true, t);
  for (const t of ['Sculpture', 'Photographs', 'Decorative Arts', 'Architecture', 'Textile', '']) assert.equal(resimselTurMu(t), false, t);
});

test('aynı eser: başlık + tarih ±5 + müze', () => {
  const a = { baslik: 'Ölü İsa için yas', baslikEn: 'Lamentation', yil: 1305, muze: 'National Gallery of Art' };
  assert.equal(ayniEserMi(a, { baslik: 'Lamentation', yil: 1309, muze: 'National Gallery of Art, Washington' }), true);
  assert.equal(ayniEserMi(a, { baslik: 'Lamentation', yil: 1312, muze: 'National Gallery of Art' }), false, 'tarih farkı');
  assert.equal(ayniEserMi(a, { baslik: 'Lamentation', yil: 1305, muze: 'Art Institute of Chicago' }), false, 'başka müze');
  assert.equal(ayniEserMi(a, { baslik: 'Lamentation', yil: null, muze: '' }), true, 'bilinmeyen alan engel değil');
  assert.equal(ayniEserMi(a, { baslik: 'Pietà', yil: 1305, muze: '' }), false);
});

test('görsel puanı: müze taraması > Google Art Project > müze kaynaklı Commons > diğer > fotoğraf gibi', () => {
  const p = (d) => gorselPuani({ k: 'commons', d });
  assert.equal(gorselPuani({ k: 'aic', i: 'x' }), 100);
  assert.equal(p('Vermeer_-_The_Milkmaid_-_Google_Art_Project.jpg'), 80);
  assert.equal(p('Giotto_di_Bondone_-_Last_Judgment_-_WGA09228.jpg'), 70);
  assert.equal(p('Mona_Lisa.jpg'), 50);
  for (const d of ['Mona_Lisa_framed.jpg', 'Nightwatch_in_situ.jpg', 'Guernica_exhibition_2017.jpg', 'Louvre_gallery_view.jpg', 'Leonardo_St_Anne_taken_at_the_Louvre.jpg', 'Perugino,_Consegna_-_panoramio.jpg']) assert.equal(p(d), 10, d);
  assert.equal(fotoGibiMi('Arnolfini_National_Gallery_London.jpg'), false, 'kurum adı');
  assert.equal(gorselPuani({ k: 'commons', d: 'Kotu.jpg' }, { 'kotu.jpg': 'kotu' }), 5);
});

test('birleştirme: kurs önce; Wikidata ve müze kopyaları tek esere iner; müze taraması öne geçer', () => {
  const sonuc = birlestir({
    kurs: [{ baslik: 'Ağıt', tarih: '1305', yer: 'Padova', lisans: 'PD', konu: 4, dosya: 'Giotto_Lamentation_photo_in_situ.jpg', qid: 'Q1' }],
    wd: [
      { qid: 'Q1', baslik: 'Ağıt', baslikEn: 'Lamentation', yil: 1305, dosyalar: ['Giotto_Lamentation_GAP_-_Google_Art_Project.jpg'], sl: 20, muze: '', muzeIdler: {} },
      { qid: 'Q2', baslik: 'Madonna', baslikEn: 'Madonna', yil: 1310, dosyalar: ['Madonna.jpg'], sl: 30, muze: 'National Gallery of Art', muzeIdler: { nga: '41' } },
      { qid: 'Q3', baslik: 'Az bilinen', baslikEn: 'Obscure', yil: 1320, dosyalar: ['Obscure.jpg'], sl: 1, muze: '', muzeIdler: {} },
    ],
    muzeler: [
      { kaynak: 'nga', kimlik: '41', baslik: 'Madonna and Child', yil: 1310, muze: 'National Gallery of Art, Washington', populer: 1, gorsel: { k: 'nga', i: 'https://api.nga.gov/iiif/m' } },
      { kaynak: 'aic', kimlik: '7', baslik: 'Obscure', yil: 1322, muze: 'Art Institute of Chicago', populer: 3, gorsel: { k: 'aic', i: 'abc' } },
      { kaynak: 'met', kimlik: '9', baslik: 'Saint', yil: 1315, muze: 'The Met', populer: 0, gorsel: { k: 'met', u: 'https://images.metmuseum.org/x.jpg' } },
    ],
  });
  assert.equal(sonuc.length, 4);
  assert.equal(sonuc[0].kurs, true);
  assert.deepEqual(sonuc[0].kaynaklar, ['kurs', 'wikidata']);
  assert.equal(sonuc[0].gorseller[0].d, 'Giotto_Lamentation_GAP_-_Google_Art_Project.jpg', 'fotoğraf gibi kurs görseli sona');
  const madonna = sonuc.find((e) => e.qid === 'Q2');
  assert.equal(madonna.gorseller[0].k, 'nga', 'müze kimliğiyle eşleşti, resmi tarama önde');
  const az = sonuc.find((e) => e.qid === 'Q3');
  assert.equal(az.gorseller[0].k, 'aic', 'başlık + tarih ±5 ile eşleşti');
  assert.equal(sonuc[1].qid, 'Q2', 'bilinirlik sırası');
  assert.equal(sonuc[3].kaynaklar[0], 'met', 'yeni müze eseri eklendi');
});

test('birleştirme: elle kötü işaretli tek görseli olan eser pekiştirmeye girmez', () => {
  const [e] = birlestir({ wd: [{ qid: 'Q1', baslik: 'A', dosyalar: ['A.jpg'], sl: 1, muze: '', muzeIdler: {} }], kararlar: { 'a.jpg': 'kotu' } });
  assert.equal(e.pekistirme, false);
});

test('Commons dosya adından başlık ve yıl', () => {
  assert.deepEqual(dosyaBasligi('Johannes_Vermeer_(1632-1675)_-_The_Girl_With_The_Pearl_Earring_(1665).jpg', ['Johannes Vermeer'], [1632, 1675]), { baslik: 'The Girl With The Pearl Earring', yil: 1665 });
  assert.deepEqual(dosyaBasligi('Jan_Vermeer_van_Delft_-_The_Milkmaid_-_Google_Art_Project.jpg', ['Jan Vermeer van Delft']), { baslik: 'The Milkmaid', yil: null });
  assert.equal(TARAMA.test('Postcard_of_Dresden.jpg'), false);
  assert.equal(TARAMA.test('The_Milkmaid_-_Google_Art_Project.jpg'), true);
});

test('CSV: tırnaklı alan, satır içi yeni satır ve kaçışlı tırnak', () => {
  const r = csvAyristir('a,b,c\n1,"x, y","satır\\nbir ""iki"""\n2,,son\n'.replace('\\n', '\n'));
  assert.deepEqual(r, [
    { a: '1', b: 'x, y', c: 'satır\nbir "iki"' },
    { a: '2', b: '', c: 'son' },
  ]);
});

test('görsel URL ve "Görsel kötü" tercihi', () => {
  assert.equal(gorselUrl({ k: 'aic', i: 'abc' }, 400), 'https://www.artic.edu/iiif/2/abc/full/400,/0/default.jpg');
  assert.equal(gorselUrl({ k: 'aic', i: 'abc' }, 800), 'https://www.artic.edu/iiif/2/abc/full/843,/0/default.jpg');
  assert.equal(gorselUrl({ k: 'nga', i: 'https://api.nga.gov/iiif/u' }, 800), 'https://api.nga.gov/iiif/u/full/!800,800/0/default.jpg');
  assert.equal(gorselUrl({ k: 'met', u: 'https://images.metmuseum.org/a.jpg' }), 'https://images.metmuseum.org/a.jpg');
  assert.match(gorselUrl({ k: 'commons', d: 'A b.jpg' }, 400), /Special:FilePath\/A_b\.jpg\?width=400$/);
  const eser = { anahtar: 'q:Q1', gorseller: [{ k: 'aic', i: 'abc' }, { k: 'commons', d: 'A.jpg' }] };
  const kotuler = {};
  assert.equal(secilenGorsel(eser, kotuler).k, 'aic');
  assert.equal(kotuIsaretle(eser, eser.gorseller[0], kotuler).k, 'commons');
  assert.deepEqual(kotuler, { 'q:Q1': ['aic:abc'] });
  assert.equal(kotuIsaretle(eser, eser.gorseller[1], kotuler), null);
  assert.equal(pekistirmeyeUygunMu(eser, kotuler), false);
  assert.equal(gorselAnahtari({ k: 'commons', d: 'a b.jpg' }), 'c:a_b.jpg');
});

test('müze kaydının yılı sanatçının hayatıyla uyuşmalı', () => {
  const raffaello = { dogum: 1483, olum: 1520 };
  assert.equal(makulYilMi(raffaello, 1508), true);
  assert.equal(makulYilMi(raffaello, 1787), false, 'ölümünden sonraki röprodüksiyon');
  assert.equal(makulYilMi({ dogum: 1488, olum: 1576 }, 1485), false, 'doğumundan önce');
  assert.equal(makulYilMi(raffaello, null), true);
  assert.equal(makulYilMi({ dogum: null, olum: 1416 }, 1410), true);
});
