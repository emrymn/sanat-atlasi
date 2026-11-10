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
