import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seviyeCevapla, seviyeIsle, seviyeKaydi, seviyeDurumu, seviyeKisa, ustaMi, seviyelerDogrula, eserSeviyesi, EN_AZ, PENCERE } from '../../js/seviye.js';
import { sanatciCeldiricileri, akimSecenekleri } from '../../js/celdirici.js';
import { zorlukDilimi } from '../../js/eserler.js';
import { ilerlemeDogrula, varsayilanIlerleme } from '../../js/depo.js';
import { kayitGecerliMi, devamOzeti } from '../../js/devam.js';

const cevapla = (kayit, dizi) => dizi.reduce((k, d) => seviyeCevapla(k, d).kayit, kayit);

test('seviye: %80 ve en az 5 cevap olmadan geçilmez', () => {
  let k = { s: 0, son: [] };
  for (let i = 0; i < EN_AZ - 1; i++) {
    const r = seviyeCevapla(k, true);
    assert.equal(r.gecti, false, `${i + 1}. doğru cevapta geçmemeli`);
    k = r.kayit;
  }
  const r = seviyeCevapla(k, true);
  assert.equal(r.gecti, true, '5/5 → Orta');
  assert.deepEqual(r.kayit, { s: 1, son: [] }, 'yeni seviyede sayaç sıfırlanır');

  // 4/5 = %80 geçer, 3/5 geçmez
  assert.equal(seviyeCevapla(cevapla({ s: 0, son: [] }, [true, false, true, true]), true).gecti, true);
  assert.equal(seviyeCevapla(cevapla({ s: 0, son: [] }, [false, false, true, true]), true).gecti, false);
});

test('seviye: kayan pencere (son 10 cevap); erken yanlışlar zamanla düşer', () => {
  let k = cevapla({ s: 1, son: [] }, [false, false, false, true, false]);
  assert.equal(k.s, 1);
  k = cevapla(k, [true, true, true, true, true, true]);
  assert.equal(k.son.length <= PENCERE, true);
  assert.equal(k.s, 1, '7/11 → pencerede 7/10, henüz değil');
  k = cevapla(k, [true, true]);
  assert.equal(k.s, 2, 'pencere 9/10 → Zor');
});

test('Zor en üst seviye; ustalık ölçütü', () => {
  const k = cevapla({ s: 2, son: [] }, [true, true, true, true, true]);
  assert.equal(k.s, 2);
  assert.equal(ustaMi(k), true);
  assert.equal(ustaMi(cevapla({ s: 2, son: [] }, [true, false, false, true, true])), false);
  assert.match(seviyeDurumu(k), /Zor · son 5 cevapta 5 doğru · ustalaştın/);
  assert.match(seviyeDurumu({ s: 0, son: [1, 1] }), /Kolay · son 2 cevapta 2 doğru · Orta için %80 \(en az 3 cevap daha\)/);
});

test('seviyeIsle dönemin kaydına yazar; kısa durum, yedek doğrulaması', () => {
  const ilerleme = varsayilanIlerleme([1]);
  for (let i = 0; i < 5; i++) seviyeIsle(ilerleme, 'Gotik', true);
  assert.equal(seviyeKaydi(ilerleme, 'Gotik').s, 1);
  assert.equal(seviyeKaydi(ilerleme, 'Rokoko').s, 0, 'hiç sorulmamış dönem → Kolay');
  assert.equal(seviyeKaydi(ilerleme, 'constructor').s, 0, 'nesne özellik adları dönem sayılmaz');
  assert.equal(seviyeKisa({ s: 0, son: [1, 0, 1] }), 'Kolay · 3/5');
  assert.equal(seviyeKisa({ s: 1, son: [1, 0, 1, 1, 0, 1] }), 'Orta · 4/6 doğru');
  assert.equal(seviyeKisa({ s: 2, son: [1, 1, 1, 1, 1] }), 'Zor · usta');
  const geri = ilerlemeDogrula(JSON.parse(JSON.stringify({ ilerleme })));
  assert.deepEqual(geri.seviyeler, ilerleme.seviyeler, 'yedekte korunur');
  assert.deepEqual(seviyelerDogrula({ x: { s: 7, son: [] }, y: { s: 1, son: [1, 2, 0] }, z: null }), { y: { s: 1, son: [1, 0] } });
});

test('eser zorluğu: Kolay en kolay yarı, Orta hepsi, Zor en zor yarı', () => {
  const eserler = [1, 2, 3, 4].map((n) => ({ anahtar: 'e' + n, p: n * 2 }));
  const kolaylik = (e) => e.p;
  assert.deepEqual(
    zorlukDilimi(eserler, kolaylik, eserSeviyesi(0)).map((e) => e.anahtar),
    ['e4', 'e3'],
  );
  assert.equal(zorlukDilimi(eserler, kolaylik, eserSeviyesi(1)).length, 4);
  assert.deepEqual(
    zorlukDilimi(eserler, kolaylik, eserSeviyesi(2))
      .map((e) => e.anahtar)
      .sort(),
    ['e1', 'e2'],
  );
});

// Küçük bir dünya: 8 akım, her birinde 3 sanatçı
const akimlar = Array.from({ length: 8 }, (_, i) => ({
  ad: 'A' + i,
  sira: i,
  komsular: ['A' + (i - 1), 'A' + (i + 1)].filter((x) => x !== 'A-1' && x !== 'A8'),
}));
const sanatcilar = akimlar.flatMap((a, i) =>
  [0, 1, 2].map((j) => ({ id: `${a.ad}-${j}`, ad: `${a.ad} ${j}`, akim: a.ad, dogum: 1300 + i * 40 + j * 5, olum: 1360 + i * 40 + j * 5 })),
);
const sira = Object.fromEntries(akimlar.map((a) => [a.ad, a.sira]));

test('çeldiriciler: Zor aynı akım, Orta komşu akım, Kolay uzak akımlar', () => {
  const hedef = sanatcilar.find((s) => s.id === 'A4-0');
  for (let t = 0; t < 20; t++) {
    const rng = (() => {
      let x = t + 1;
      return () => (x = (x * 16807) % 2147483647) / 2147483647;
    })();
    const zor = sanatciCeldiricileri(hedef, { sanatcilar, akimlar, rng, seviye: 'zor' });
    assert.equal(zor.filter((s) => s.akim === 'A4').length, 2, 'zor: aynı akımın iki sanatçısı');
    const orta = sanatciCeldiricileri(hedef, { sanatcilar, akimlar, rng, seviye: 'orta' });
    assert.ok(
      orta.every((s) => s.akim !== 'A4'),
      'orta: aynı akım yok',
    );
    assert.ok(
      orta.every((s) => ['A3', 'A5'].includes(s.akim)),
      'orta: komşu akımlar',
    );
    const kolay = sanatciCeldiricileri(hedef, { sanatcilar, akimlar, rng, seviye: 'kolay' });
    assert.equal(kolay.length, 3);
    assert.ok(
      kolay.every((s) => Math.abs(sira[s.akim] - 4) >= 3),
      'kolay: en az 3 akım uzak',
    );
    assert.equal(new Set([...kolay, hedef].map((s) => s.id)).size, 4);
  }
});

test('akım şıkları: Kolay uzak akımlar, Zor komşular', () => {
  const kolay = akimSecenekleri('A4', akimlar, Math.random, 4, 'kolay');
  assert.equal(kolay.length, 4);
  assert.ok(kolay.includes('A4'));
  assert.ok(kolay.filter((a) => a !== 'A4').every((a) => Math.abs(sira[a] - 4) >= 3));
  const zor = akimSecenekleri('A4', akimlar, Math.random, 4, 'zor');
  assert.ok(zor.includes('A3') && zor.includes('A5'));
});

test('yarım oturum: ayrı seviye kipi yok (seviye dönemin içinde)', () => {
  const k = { surum: 1, zaman: 0, kip: 'seviye', akim: 'orta', kuyruk: [{ id: 'a' }, { id: 'b' }], konum: 0, kart: null };
  assert.equal(kayitGecerliMi(k, 0), false);
  assert.equal(kayitGecerliMi({ ...k, kip: 'donem', akim: 'Gotik' }, 0), true);
  assert.equal(devamOzeti({ ...k, kip: 'donem', akim: 'Gotik' }), 'Döneme göre · Gotik · 1 / 2');
});
