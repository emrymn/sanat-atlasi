// İş 188: başyapıt sayfasının saf yardımcıları (js/basyapitSayfa.js)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sade, noktalariYerlestir, kirpim, sozlukAl, kunyeSatirlari, karsilastirmalariAl, terimIsaretle, dersBolumleri, okumaDakikasi } from '../../js/basyapitSayfa.js';
import { ayrintilariAl } from '../../js/ayrinti.js';
import { basyapitlariAl } from '../../js/basyapit.js';

const oku = (yol) => JSON.parse(readFileSync(new URL(`../../${yol}`, import.meta.url), 'utf8'));
const BASYAPITLAR = basyapitlariAl(oku('data/basyapitlar.json'));
const AYRINTILAR = ayrintilariAl(oku('data/eser_ayrintilari.json'));

test('sade: Türkçe harfler, büyük küçük ve noktalama karşılaştırmayı bozmaz', () => {
  assert.equal(sade('Işık, ŞÖLEN ve Çığlık!'), 'isik solen ve ciglik');
  assert.equal(sade('İmza'), 'imza');
  assert.equal(sade(null), '');
});

test('noktalariYerlestir: ayrıntı, adının geçtiği bölüme gider; eşitlikte önceki, geçmiyorsa ilk bölüm', () => {
  const bolumler = [
    { baslik: 'Ne görüyoruz?', metin: 'Önde küçük bir köpek var, pencere kenarında portakallar duruyor.' },
    { baslik: 'Anlam', metin: 'Tek bir mumun yanması ve köpek çeşitli biçimlerde yorumlanmıştır.' },
  ];
  const noktalar = [{ ad: 'Köpek' }, { ad: 'Tek mum' }, { ad: 'Pencere ve portakallar' }, { ad: 'Bambaşka şey' }];
  assert.deepEqual(noktalariYerlestir(bolumler, noktalar), [[0, 2, 3], [1]]);
  // bölüm yoksa hepsi tek grupta; nokta yoksa boş gruplar
  assert.deepEqual(noktalariYerlestir([], noktalar), [[0, 1, 2, 3]]);
  assert.deepEqual(noktalariYerlestir(bolumler, []), [[], []]);
});

test('noktalariYerlestir: gerçek veride her ayrıntı tam bir kez yerleşir', () => {
  for (const b of BASYAPITLAR) {
    const kayit = AYRINTILAR.find((a) => a.anahtar === b.anahtar);
    if (!kayit) continue;
    const g = noktalariYerlestir(b.bolumler, kayit.noktalar);
    assert.equal(g.length, Math.max(1, b.bolumler.length), b.anahtar);
    assert.deepEqual(g.flat().sort((x, y) => x - y), kayit.noktalar.map((_, i) => i), b.anahtar);
  }
});

test('kirpim: bölge kutunun içinde kalır, resim kutuyu her zaman doldurur', () => {
  const kutular = [8 / 5, 4 / 3];
  const oranlar = [0.5, 1, 1.37, 2.2]; // yatay, kare, dik, çok dik
  const noktalar = [
    { x: 0, y: 0, w: 0.2, h: 0.2 },
    { x: 0.8, y: 0.85, w: 0.2, h: 0.15 },
    { x: 0.4, y: 0.19, w: 0.2, h: 0.18 },
    { x: 0, y: 0, w: 1, h: 1 },
  ];
  for (const kutu of kutular)
    for (const oran of oranlar)
      for (const n of noktalar) {
        const k = kirpim(n, oran, kutu);
        const w = k.w / 100;
        const h = w * oran * kutu; // kutu yüksekliği cinsinden
        const l = k.l / 100;
        const t = k.t / 100;
        const ad = JSON.stringify({ kutu, oran, n, k });
        assert.ok(w >= 1 - 1e-6 && h >= 1 - 1e-6, `kutuyu doldurur: ${ad}`);
        assert.ok(l <= 1e-6 && l + w >= 1 - 1e-4, `yatayda boşluk yok: ${ad}`);
        assert.ok(t <= 1e-6 && t + h >= 1 - 1e-4, `dikeyde boşluk yok: ${ad}`);
      }
  // küçük bir bölge yakınlaşır ve kutuda ortalanır
  const k = kirpim({ x: 0.4, y: 0.4, w: 0.2, h: 0.2 }, 1, 1, { pay: 1 });
  assert.ok(k.w > 300);
  assert.ok(Math.abs(k.l + k.w / 2 - 50) < 0.5 && Math.abs(k.t + k.w / 2 - 50) < 0.5);
  // enCok sınırı
  assert.ok(kirpim({ x: 0.5, y: 0.5, w: 0.02, h: 0.02 }, 1, 1, { enCok: 3 }).w <= 300.01);
});

test('sozlukAl: dersin kavramları; kanıt etiketleri ve notlar ayıklanır, yinelenen ve bozuk kayıt atılır', () => {
  const s = sozlukAl({
    temel_kavramlar: [
      { ad: 'glazür', tanim: 'ince yarı saydam boya katmanı [C014] (belirsiz).', kanit: ['C014'] },
      { ad: 'Glazür', tanim: 'yinelenen kayıt burada.' },
      { ad: 'x', tanim: 'çok kısa ad' },
      { ad: 'tanımsız' },
      null,
    ],
  });
  assert.deepEqual(s, [{ ad: 'Glazür', tanim: 'İnce yarı saydam boya katmanı.' }]);
  assert.deepEqual(sozlukAl(null), []);
});

test('kunyeSatirlari: tarih ve yer başyapıt kaydından, teknik ve boyut dersten; boş alan satır olmaz', () => {
  const b = { tarih: '1434', muze: 'National Gallery' };
  assert.deepEqual(kunyeSatirlari(b, null), [
    { ad: 'Tarih', deger: '1434' },
    { ad: 'Yer', deger: 'National Gallery' },
  ]);
  const k = kunyeSatirlari(b, { kunye: { teknik: 'yağlıboya, meşe pano [C002]', boyut_cm: { yukseklik: 82.2, genislik: 60 }, muze: 'başka' } });
  assert.deepEqual(k.map((x) => x.deger), ['1434', 'Yağlıboya, meşe pano', '82,2 × 60 cm', 'National Gallery']);
  assert.deepEqual(kunyeSatirlari({}, { kunye: { boyut_cm: { yukseklik: 0, genislik: 60 } } }), []);
});

test('karsilastirmalariAl: uygulamadaki başyapıtla eşleşen öneri anahtar taşır, eşleşmeyen taşımaz', () => {
  const liste = [
    { anahtar: 'Q1', sanatci: 'jan-van-eyck', baslik: 'Arnolfini Portresi (Arnolfini Portrait)', ozgun: 'Arnolfini Portrait' },
    { anahtar: 'Q2', sanatci: 'robert-campin', baslik: 'Mérode Triptiği', ozgun: 'Mérode Altarpiece' },
  ];
  const adlar = (id) => ({ 'jan-van-eyck': 'Jan van Eyck', 'robert-campin': 'Robert Campin' })[id] || '';
  const ders = {
    karsilastirma_onerileri: [
      { eser: 'Mérode Triptiği', sanatci: 'Robert Campin', gerekce: 'ev içi gerçekçilik + gizli sembolizm [C011].' },
      { eser: 'Ghent Altarpiece', sanatci: 'Jan van Eyck', gerekce: 'Aynı sanatçı.' },
      { eser: 'Arnolfini Portresi', sanatci: 'Jan van Eyck', gerekce: 'Kendisiyle karşılaştırılmaz.' },
      { eser: '', gerekce: 'adsız' },
    ],
  };
  const k = karsilastirmalariAl(ders, liste, 'Q1', adlar);
  assert.deepEqual(k.map((x) => [x.eser, x.anahtar]), [
    ['Mérode Triptiği', 'Q2'],
    ['Ghent Altarpiece', null],
    ['Arnolfini Portresi', null],
  ]);
  assert.equal(k[0].gerekce, 'Ev içi gerçekçilik ve gizli sembolizm.');
  assert.deepEqual(karsilastirmalariAl(null, liste, 'Q1'), []);
});

test('terimIsaretle: terimin ilk geçtiği yer ekleriyle düğme olur; ikinci kez ve düğme/başlık içinde işaretlenmez', () => {
  const terimler = [{ ad: 'Glazür' }, { ad: 'Dışbükey ayna' }];
  const kullanilan = new Set();
  const a = terimIsaretle('Van Eyck glazürle çalıştı; glazür derinlik verir.', terimler, kullanilan);
  assert.equal(a, 'Van Eyck <button type="button" class="bsy-terim" data-bsy-terim="0">glazürle</button> çalıştı; glazür derinlik verir.');
  assert.deepEqual([...kullanilan], [0]);
  // aynı terim sonraki metinde bir daha işaretlenmez; öteki terim işaretlenir (büyük harfle başlasa da)
  const b = terimIsaretle('<h3>Dışbükey ayna</h3><p>Glazür ve Dışbükey aynada yansıma.</p>', terimler, kullanilan);
  assert.equal(b, '<h3>Dışbükey ayna</h3><p>Glazür ve <button type="button" class="bsy-terim" data-bsy-terim="1">Dışbükey aynada</button> yansıma.</p>');
  // sözcük ortasında eşleşmez
  assert.equal(terimIsaretle('sırglazür', [{ ad: 'glazür' }]), 'sırglazür');
  assert.equal(terimIsaretle('metin', []), 'metin');
});

test('dersBolumleri: başlıklara göre böler, baştaki başlıksız metni ve boş bölümü atar, karşılaştırmayı işaretler', () => {
  const b = dersBolumleri('Tanıtım cümlesi.\n## Tarihsel bağlam\nBir paragraf.\n\nİkinci paragraf.\n## Boş\n## Karşılaştırmalı analiz\n- Bir\n- İki');
  assert.deepEqual(b, [
    { baslik: 'Tarihsel bağlam', govde: 'Bir paragraf.\n\nİkinci paragraf.', karsilastirma: false },
    { baslik: 'Karşılaştırmalı analiz', govde: '- Bir\n- İki', karsilastirma: true },
  ]);
  assert.deepEqual(dersBolumleri(''), []);
  assert.equal(okumaDakikasi('bir iki üç'), 1);
  assert.equal(okumaDakikasi(Array(900).fill('söz').join(' ')), 5);
});
