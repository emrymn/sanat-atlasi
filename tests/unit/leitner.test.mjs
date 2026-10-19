import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cevapla, yeniSkor, vadesiGeldiMi, gunEkle, ARALIKLAR, tekrarAraligi, zayifMi } from '../../js/leitner.js';
import { kartlariSec, Oturum, kategori } from '../../js/oturum.js';
import { rastgeleYap } from '../../js/yardimci.js';

const B = '2026-10-19';

test('gün ekleme ay/yıl sınırında doğru', () => {
  assert.equal(gunEkle('2026-12-30', 3), '2027-01-02');
  assert.equal(gunEkle('2026-02-27', 2), '2026-03-01');
});

test('doğru cevaplar kutuyu ilerletir, aralıklar [0,1,3,7,14,30]', () => {
  assert.deepEqual(ARALIKLAR, [0, 1, 3, 7, 14, 30]);
  let s = yeniSkor();
  let gun = B;
  const beklenen = [1, 3, 7, 14, 30, 30];
  for (let i = 0; i < 6; i++) {
    s = cevapla(s, true, gun);
    assert.equal(s.kutu, Math.min(5, i + 1));
    assert.equal(s.sonraki, gunEkle(gun, beklenen[i]));
    gun = s.sonraki;
  }
  assert.equal(s.dogru, 6);
});

test('yanlış cevap kutuyu 0 yapar ve bugün tekrar vadesi verir', () => {
  let s = cevapla(yeniSkor(), true, B);
  s = cevapla(s, true, gunEkle(B, 1));
  assert.equal(s.kutu, 2);
  const g = gunEkle(B, 4);
  s = cevapla(s, false, g);
  assert.equal(s.kutu, 0);
  assert.equal(s.sonraki, g);
  assert.ok(vadesiGeldiMi(s, g));
  assert.equal(s.yanlis, 1);
  // aynı oturumda tekrar doğru → kutu 1, yarın
  s = cevapla(s, true, g);
  assert.equal(s.kutu, 1);
  assert.equal(s.sonraki, gunEkle(g, 1));
});

test('vadesi gelmemiş kartta doğru cevap kutuyu ilerletmez', () => {
  let s = cevapla(yeniSkor(), true, B); // kutu 1, yarın
  const once = { ...s };
  s = cevapla(s, true, B); // aynı gün ek pratik
  assert.equal(s.kutu, once.kutu);
  assert.equal(s.sonraki, once.sonraki);
  assert.equal(s.dogru, 2);
});

test('girdi nesnesi değiştirilmez', () => {
  const s = cevapla(yeniSkor(), true, B);
  const kopya = JSON.stringify(s);
  cevapla(s, false, B);
  assert.equal(JSON.stringify(s), kopya);
});

test('vade: tarih ≤ bugün', () => {
  const s = { ...yeniSkor(), son: B, sonraki: '2026-10-20', kutu: 1 };
  assert.equal(vadesiGeldiMi(s, B), false);
  assert.equal(vadesiGeldiMi(s, '2026-10-20'), true);
  assert.equal(vadesiGeldiMi(s, '2026-10-21'), true);
  assert.equal(vadesiGeldiMi(yeniSkor(), B), false);
});

test('tekrar aralığı 3–5', () => {
  const rng = rastgeleYap(7);
  const goruldu = new Set();
  for (let i = 0; i < 200; i++) goruldu.add(tekrarAraligi(rng));
  assert.deepEqual([...goruldu].sort(), [3, 4, 5]);
});

test('yanlış cevaplanan sanatçı 3–5 kart sonra aynı oturumda geri gelir', () => {
  for (let t = 1; t < 30; t++) {
    const o = new Oturum(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], { rng: rastgeleYap(t) });
    o.isle(false); // 'a' yanlış
    o.ilerle();
    const ids = o.kuyruk.map((k) => k.id);
    const yer = ids.indexOf('a', 1);
    assert.ok(yer >= 4 && yer <= 6, `aradaki kart sayısı 3–5 olmalı, konum ${yer}`);
    assert.equal(o.kuyruk[yer].tekrar, true);
    assert.equal(o.toplam, 9);
  }
});

test('kısa kuyrukta tekrar sona eklenir; sınırsız tekrar yok', () => {
  const o = new Oturum(['a', 'b'], { rng: rastgeleYap(1), enFazlaTekrar: 2 });
  let n = 0;
  while (!o.bitti && n < 50) {
    if (o.simdiki.id === 'a') o.isle(false);
    else o.isle(true);
    o.ilerle();
    n++;
  }
  assert.equal(o.kuyruk.filter((k) => k.id === 'a').length, 3);
  assert.ok(o.bitti);
});

const sanatci = (id, akim = 'X', dogum = 1500) => ({ id, akim, dogum });

test('kart seçimi: önce vadesi gelen/zayıf, sonra yeni; yeni sınırı uygulanır', () => {
  const adaylar = ['v1', 'v2', 'z1', 'n1', 'n2', 'n3', 'd1'].map((id) => sanatci(id));
  const skorlar = {
    v1: { sanatci: { kutu: 3, sonraki: B, dogru: 3, yanlis: 0, son: '2026-10-12' } },
    v2: { sanatci: { kutu: 1, sonraki: '2026-10-10', dogru: 1, yanlis: 1, son: '2026-10-09' } },
    z1: { sanatci: { kutu: 1, sonraki: '2026-10-25', dogru: 1, yanlis: 3, son: '2026-10-18' } },
    d1: { sanatci: { kutu: 4, sonraki: '2026-11-01', dogru: 4, yanlis: 0, son: '2026-10-18' } },
  };
  const sec = kartlariSec({ adaylar, skorlar, bugun: B, adet: 20, yeniKota: 2, rng: rastgeleYap(1) }).map((s) => s.id);
  assert.deepEqual(sec.slice(0, 2), ['v2', 'v1'], 'vadesi gelenler, küçük kutu önce');
  assert.equal(sec[2], 'z1');
  assert.equal(sec.filter((x) => x.startsWith('n')).length, 2, 'yeni sınırı');
  assert.equal(sec[sec.length - 1], 'd1', 'geri kalanlar en sonda');
  assert.equal(kategori(skorlar, 'n1', 'donem', B), 2);
});

test('yeni kota 0 iken yeni sanatçı gelmez', () => {
  const sec = kartlariSec({ adaylar: [sanatci('n1'), sanatci('n2')], skorlar: {}, bugun: B, adet: 20, yeniKota: 0 });
  assert.equal(sec.length, 0);
});

test('karışık kip: ağırlıklı seçim yine de yeni sınırına uyar ve tekrar etmez', () => {
  const adaylar = Array.from({ length: 30 }, (_, i) => sanatci('s' + i));
  const sec = kartlariSec({ adaylar, skorlar: {}, bugun: B, adet: 20, yeniKota: 8, kip: 'karisik', sirala: 'agirlikli', rng: rastgeleYap(3) });
  assert.equal(sec.length, 8);
  assert.equal(new Set(sec.map((s) => s.id)).size, 8);
});

test('karışık kipte akım skoru vadesi gelince kart vadeli sayılır', () => {
  const skorlar = {
    a: { sanatci: { kutu: 3, sonraki: '2026-11-01', dogru: 3, yanlis: 0, son: B }, akim: { kutu: 0, sonraki: B, dogru: 0, yanlis: 1, son: B } },
  };
  assert.equal(kategori(skorlar, 'a', 'karisik', B), 0);
  assert.equal(kategori(skorlar, 'a', 'donem', B), 3);
});

test('kronolojik sıralama: seçilenler akım sırasına göre dizilir', () => {
  const adaylar = [sanatci('geç', 'Y', 1800), sanatci('erken', 'X', 1400)];
  const sec = kartlariSec({ adaylar, skorlar: {}, bugun: B, adet: 5, yeniKota: 8, sirala: 'kronolojik', akimSira: { X: 0, Y: 5 } });
  assert.deepEqual(
    sec.map((s) => s.id),
    ['erken', 'geç'],
  );
});

test('zayıf: düşük kutu ya da düşük isabet', () => {
  assert.equal(zayifMi({ kutu: 3, dogru: 1, yanlis: 3, son: B }), true);
  assert.equal(zayifMi({ kutu: 3, dogru: 5, yanlis: 1, son: B }), false);
  assert.equal(zayifMi(yeniSkor()), false);
});
