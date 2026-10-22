import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kartlariSec, turOzeti, turAltYazisi } from '../../js/oturum.js';
import { rastgeleYap } from '../../js/yardimci.js';

const BUGUN = '2026-10-22';
const skor = (kutu, sonraki, dogru = 1, yanlis = 0) => ({ kutu, sonraki, dogru, yanlis, son: '2026-10-01' });

// 3 vadesi gelen, 2 zayıf (vadesi gelmemiş), 12 yeni, 4 diğer
function veri() {
  const adaylar = [];
  const skorlar = {};
  const ekle = (id, s) => {
    adaylar.push({ id, akim: 'X', dogum: 1500 });
    if (s) skorlar[id] = { sanatci: s, akim: s };
  };
  for (let i = 0; i < 3; i++) ekle(`v${i}`, skor(2, '2026-10-20'));
  for (let i = 0; i < 2; i++) ekle(`z${i}`, skor(1, '2026-10-25', 1, 3));
  for (let i = 0; i < 12; i++) ekle(`y${i}`, null);
  for (let i = 0; i < 4; i++) ekle(`d${i}`, skor(4, '2026-11-20', 5, 0));
  return { adaylar, skorlar };
}

test('D1: tur önizlemesi kartlariSec ile aynı sayıyı verir (her sıralamada)', () => {
  const { adaylar, skorlar } = veri();
  for (const adet of [5, 10, 20, 40])
    for (const yeniKota of [0, 3, 8])
      for (const [kip, sirala] of [
        ['karisik', 'agirlikli'],
        ['donem', 'oncelik'],
        ['donem', 'kronolojik'],
      ]) {
        const o = turOzeti({ adaylar, skorlar, bugun: BUGUN, adet, yeniKota, kip });
        const secilen = kartlariSec({ adaylar, skorlar, bugun: BUGUN, adet, yeniKota, kip, sirala, rng: rastgeleYap(adet * 7 + yeniKota) });
        assert.equal(o.toplam, secilen.length, `${kip}/${sirala} adet=${adet} kota=${yeniKota}`);
        assert.equal(o.tekrar + o.zayif + o.yeni + o.diger, o.toplam);
      }
});

test('D1: bileşim önce vadesi gelenler, yeni sınırı uygulanır', () => {
  const { adaylar, skorlar } = veri();
  assert.deepEqual(turOzeti({ adaylar, skorlar, bugun: BUGUN, adet: 20, yeniKota: 8, kip: 'karisik' }), { toplam: 17, tekrar: 3, zayif: 2, yeni: 8, diger: 4 });
  assert.deepEqual(turOzeti({ adaylar, skorlar, bugun: BUGUN, adet: 4, yeniKota: 8, kip: 'karisik' }), { toplam: 4, tekrar: 3, zayif: 1, yeni: 0, diger: 0 });
  // günlük yeni kotası bittiyse yeniler sayılmaz
  assert.equal(turOzeti({ adaylar, skorlar, bugun: BUGUN, adet: 20, yeniKota: 0, kip: 'karisik' }).toplam, 9);
  assert.equal(turOzeti({ adaylar: [], skorlar, bugun: BUGUN, adet: 20, yeniKota: 8 }).toplam, 0);
});

test('D1: alt yazı "0 tekrar · 8 yeni"', () => {
  assert.equal(turAltYazisi({ toplam: 8, tekrar: 0, zayif: 0, yeni: 8, diger: 0 }), '0 tekrar · 8 yeni');
  assert.equal(turAltYazisi({ toplam: 17, tekrar: 3, zayif: 2, yeni: 8, diger: 4 }), '3 tekrar · 6 pekiştirme · 8 yeni');
  assert.equal(turAltYazisi({ toplam: 0, tekrar: 0, zayif: 0, yeni: 0, diger: 0 }), 'bugünkü kartlar bitti');
});
