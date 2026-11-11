// İş 171 (Tasarım B): günün ressamı yürüyüşü olanlardan; yürüyüş kamerası kartı ayrıntının üstüne koymaz
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { yuruyusHavuzu, gununSanatcisi } from '../../js/gunun.js';
import { noktaAdimi, yuruyusAdimlari } from '../../js/yuruyus.js';

const veri = JSON.parse(readFileSync(new URL('../../data/yuruyus.json', import.meta.url), 'utf8')).eserler;
const sanatcilar = JSON.parse(readFileSync(new URL('../../data/sanatcilar.json', import.meta.url), 'utf8'));

test('yuruyusHavuzu: yalnız yürüyüşü olanlar; dosya yoksa ya da kesişim boşsa havuz olduğu gibi', () => {
  const y = { a: { noktalar: [{}] }, b: { noktalar: [] }, c: { noktalar: [{}] } };
  assert.deepEqual(yuruyusHavuzu(['a', 'b', 'd'], y), ['a']);
  assert.deepEqual(yuruyusHavuzu(['a', 'b'], null), ['a', 'b']);
  assert.deepEqual(yuruyusHavuzu(['d', 'e'], y), ['d', 'e']);
});

test('günün ressamı 145 yürüyüşlü sanatçıdan gelir; Dalí, Magritte gibi yürüyüşü olmayanlar seçilmez', () => {
  const idler = sanatcilar.map((s) => s.id);
  const havuz = yuruyusHavuzu(idler, veri);
  assert.equal(Object.keys(veri).length, 145);
  assert.ok(havuz.length > 100 && havuz.length <= 145);
  for (const id of havuz) assert.ok(veri[id], id);
  for (const gun of ['2026-11-10', '2026-12-01', '2027-03-15', '2027-08-30']) assert.ok(veri[gununSanatcisi(havuz, gun)]);
  for (const id of ['salvador-dali', 'rene-magritte', 'marcel-duchamp']) if (idler.includes(id)) assert.ok(!havuz.includes(id), id);
});

test('yuruyusAdimlari: künye kartı, her ayrıntı için bir kart, sonda Nasıl tanırım; metinler kaçışlı', () => {
  const kayit = { eser: 'A & B', noktalar: [{ ad: 'Bir', metin: '<b>x</b>' }, { ad: 'İki', metin: 'y' }] };
  const html = yuruyusAdimlari({ kayit, kunye: 'Ressam · 1500', taninma: 'İpucu' });
  assert.equal(html.match(/class="yur-adim"/g).length, 4);
  assert.match(html, /A &amp; B/);
  assert.match(html, /&lt;b&gt;x&lt;\/b&gt;/);
  assert.equal(yuruyusAdimlari({ kayit, kunye: '', taninma: '' }).match(/class="yur-adim"/g).length, 3);
});

// Kartın kapladığı şerit ile ayrıntının ekrandaki yeri: bütün kayıtlarda ayrıntının büyük kısmı kartın dışında kalır
test('noktaAdimi: 145 eserin her ayrıntısında kart ayrıntıyı kapatmaz, resim ekranı hep kaplar', () => {
  const W = 390;
  const H = 844;
  const ust = 68;
  const alt = 100;
  let enAz = 1;
  for (const [id, k] of Object.entries(veri)) {
    const kirp = k.kirp || [0, 0, 1, 1];
    for (const oran of [0.72, 1.4]) {
      const IW = oran >= 1 ? 4000 : 4000 * oran;
      const IH = oran >= 1 ? 4000 / oran : 4000;
      const kapla = Math.max(W / (kirp[2] * IW), H / (kirp[3] * IH));
      for (const n of k.noktalar) {
        const a = noktaAdimi(n, { W, H, IW, IH, kirp, kartH: 230, ust, alt, kapla });
        assert.ok(a.s >= kapla - 1e-9, `${id}: ölçek kaplamadan küçük`);
        assert.ok(a.gor > 0.45, `${id} · ${n.ad}: ayrıntının görünen payı ${a.gor.toFixed(2)}`);
        enAz = Math.min(enAz, a.gor);
      }
    }
  }
  assert.ok(enAz > 0.45);
});

// İş 171 · ana ekran denetimi: data/yuruyus_odak.json
import { yuruyusOdaklariAyarla, yuruyusEki, adlaOdak, elleOdaklariAyarla, odaklariAyarla } from '../../js/gorsel.js';

test('yuruyus_odak.json: anahtarlar yürüyüş görselleri; Emre’nin elle odaklarının üstüne yazmaz; değerler geçerli', () => {
  const ek = JSON.parse(readFileSync(new URL('../../data/yuruyus_odak.json', import.meta.url), 'utf8'));
  const elle = JSON.parse(readFileSync(new URL('../../data/gorsel_odak_elle.json', import.meta.url), 'utf8')).odak;
  const gorseller = new Set(Object.values(veri).map((k) => k.gorsel));
  for (const alan of ['odak', 'yakin', 'kirp']) for (const ad of Object.keys(ek[alan])) assert.ok(gorseller.has(ad), `${alan}: ${ad}`);
  for (const [ad, o] of Object.entries(ek.odak)) {
    assert.ok(!(ad in elle), `elle odak varken yürüyüş odağı: ${ad}`);
    assert.ok(o.length === 2 && o.every((n) => n >= 0 && n <= 100));
  }
  for (const y of Object.values(ek.yakin)) assert.ok(y > 1 && y <= 2.2);
  // kirp: yürüyüşte kendi kirp'i olan esere ikinci kez verilmez; noktalar kırpılan alanın içinde kalır
  for (const [ad, [x, y, w, h]] of Object.entries(ek.kirp)) {
    const k = Object.values(veri).find((v) => v.gorsel === ad);
    assert.ok(!k.kirp, ad);
    assert.ok(x >= 0 && y >= 0 && x + w <= 1.0001 && y + h <= 1.0001 && w > 0.5 && h > 0.5);
    for (const n of k.noktalar) assert.ok(Math.max(x - n.x, y - n.y, n.x + n.w - (x + w), n.y + n.h - (y + h)) < 0.06, `${ad} · ${n.ad}`);
  }
});

test('adlaOdak önceliği: elle > yürüyüş denetimi > otomatik; yuruyusEki sınırları', () => {
  odaklariAyarla({ odak: { a: [10, 10], b: [20, 20], c: [30, 30] } });
  elleOdaklariAyarla({ odak: { a: [1, 2] } });
  yuruyusOdaklariAyarla({ odak: { a: [50, 50], b: [60, 60] }, yakin: { b: 9, c: 1.4 }, kirp: { b: [0.1, 0.1, 0.8, 0.8], c: [0, 0, 0.2, 1] } });
  assert.deepEqual(adlaOdak('a'), [1, 2]);
  assert.deepEqual(adlaOdak('b'), [60, 60]);
  assert.deepEqual(adlaOdak('c'), [30, 30]);
  assert.equal(adlaOdak('yok'), null);
  assert.deepEqual(yuruyusEki('b'), { yakin: 2.2, kirp: [0.1, 0.1, 0.8, 0.8] });
  assert.deepEqual(yuruyusEki('c'), { yakin: 1.4, kirp: null }); // çok dar kırpma geçersiz
  assert.deepEqual(yuruyusEki('yok'), { yakin: 1, kirp: null });
  yuruyusOdaklariAyarla(null);
  elleOdaklariAyarla(null);
  odaklariAyarla(null);
});
