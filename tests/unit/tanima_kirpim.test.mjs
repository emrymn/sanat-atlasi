// İş 193: tanıma kırpımları — js/tanimaKirpim.js ve data/tanima_kirpimlari.json
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { kirpimGecerliMi, tanimaKirpimlariAl, kirpimEseri, incelemeKaydi } from '../../js/tanimaKirpim.js';
import { ayrintilariAl } from '../../js/ayrinti.js';

const KOK = new URL('../../', import.meta.url);
const oku = (y) => JSON.parse(readFileSync(new URL(y, KOK), 'utf8'));
const kayit = (o = {}) => ({ anahtar: 'Q1', sanatci: 'a', gorsel: 'g1', ad: 'Saka kuşu', x: 0.1, y: 0.2, w: 0.2, h: 0.2, ...o });

test('kirpimGecerliMi: eksik alan, taşan ya da çok küçük kutu geçmez', () => {
  assert.ok(kirpimGecerliMi(kayit()));
  assert.ok(!kirpimGecerliMi(kayit({ gorsel: '' })));
  assert.ok(!kirpimGecerliMi(kayit({ ad: ' ' })));
  assert.ok(!kirpimGecerliMi(kayit({ x: 0.9, w: 0.2 })));
  assert.ok(!kirpimGecerliMi(kayit({ h: 0.01 })));
  assert.ok(!kirpimGecerliMi(kayit({ y: -0.1 })));
  assert.ok(!kirpimGecerliMi(null));
});

test('tanimaKirpimlariAl: bozuk kayıt atılır, konu kayıtları madde sırasında ve maddeye bir kırpım', () => {
  const v = tanimaKirpimlariAl({
    konular: { k1: [kayit({ madde: 3 }), kayit({ madde: 1 }), kayit({ madde: 1, ad: 'ikinci' }), kayit({ madde: 'x' }), kayit({ madde: 2, w: 2 })] },
    sanatcilar: { a: [kayit(), kayit({ anahtar: '' })], b: [kayit({ x: 5 })] },
  });
  assert.deepEqual(
    v.konular.get('k1').map((k) => [k.madde, k.ad]),
    [
      [1, 'Saka kuşu'],
      [3, 'Saka kuşu'],
    ],
  );
  assert.equal(v.sanatcilar.get('a').length, 1);
  assert.ok(!v.sanatcilar.has('b'));
  const bos = tanimaKirpimlariAl(null);
  assert.equal(bos.konular.size + bos.sanatcilar.size, 0);
});

test('kirpimEseri: anahtar ve sanatçı tutmalı; gösterilen görsel farklıysa kırpım yok', () => {
  const eserler = [
    { qid: 'Q0', sid: 'a', g: 'g0' },
    { qid: 'Q1', sid: 'b', g: 'g1' },
    { qid: 'Q1', sid: 'a', g: 'g1' },
  ];
  const anahtar = (e) => e.qid;
  const ad = (e) => e.g;
  assert.equal(kirpimEseri(kayit(), eserler, anahtar, ad), eserler[2]);
  assert.equal(kirpimEseri(kayit(), [{ qid: 'Q1', sid: 'a', g: 'baska' }], anahtar, ad), null);
  assert.equal(kirpimEseri(kayit({ anahtar: 'Q9' }), eserler, anahtar, ad), null);
  assert.equal(kirpimEseri(null, eserler, anahtar, ad), null);
});

test('incelemeKaydi: aynı kutu rehberli incelemede varsa o kayıt ve sırası, yoksa tek noktalı kayıt', () => {
  const mevcut = { anahtar: 'Q1', gorsel: 'g1', noktalar: [{ ad: 'Ayna', x: 0.5, y: 0.5, w: 0.1, h: 0.1, metin: 'm' }, { ad: 'Saka', x: 0.1, y: 0.2, w: 0.2, h: 0.2, metin: 'n' }] };
  assert.deepEqual(incelemeKaydi(kayit(), mevcut), { kayit: mevcut, nokta: 1 });
  // kayıt başka görselde seçilmişse kullanılmaz
  const r = incelemeKaydi(kayit(), { ...mevcut, gorsel: 'g2' }, 'Madde metni');
  assert.equal(r.nokta, 0);
  assert.equal(r.kayit.noktalar.length, 1);
  assert.equal(r.kayit.noktalar[0].metin, 'Madde metni');
  assert.equal(r.kayit.gorsel, 'g1');
  // metin yoksa ad
  assert.equal(incelemeKaydi(kayit(), null).kayit.noktalar[0].metin, 'Saka kuşu');
});

test('data/tanima_kirpimlari.json: konu ve madde var, eser konuda, kutular hazır ayrıntılarla ve görsellerle uyumlu', () => {
  const ham = oku('data/tanima_kirpimlari.json');
  const v = tanimaKirpimlariAl(ham);
  const konular = new Map(oku('data/ikonografi.json').konular.map((k) => [k.id, k]));
  const sl = oku('data/sanatcilar.json');
  const sanatcilar = new Set((Array.isArray(sl) ? sl : sl.sanatcilar).map((s) => s.id));
  const ayrinti = new Map(ayrintilariAl(oku('data/eser_ayrintilari.json')).map((e) => [e.anahtar, e]));
  // ham veride atılan kayıt olmamalı
  let hamSayi = 0;
  for (const b of ['konular', 'sanatcilar']) for (const l of Object.values(ham[b])) hamSayi += l.length;
  let sayi = 0;
  for (const [kid, l] of v.konular) {
    const k = konular.get(kid);
    assert.ok(k, `${kid} konusu yok`);
    for (const x of l) {
      sayi++;
      assert.ok(x.madde < k.tanima.length, `${kid}: ${x.madde}. madde yok`);
      assert.ok(k.eserler.some(([a, s]) => a === x.anahtar && s === x.sanatci), `${kid}: ${x.anahtar} bu konunun eseri değil`);
    }
  }
  for (const [sid, l] of v.sanatcilar) {
    assert.ok(sanatcilar.has(sid), `${sid} sanatçısı yok`);
    for (const x of l) {
      sayi++;
      assert.equal(x.sanatci, sid);
      assert.ok(x.ad.length <= 34, `${sid}: ad uzun (${x.ad})`);
    }
  }
  assert.equal(sayi, hamSayi, 'veride geçersiz kayıt var');
  assert.ok(sayi >= 500);
  // Hazır ayrıntıdan alınan kutu (metni olmayan) o ayrıntıda birebir bulunmalı; görsel adı da aynı olmalı
  for (const b of ['konular', 'sanatcilar'])
    for (const l of v[b].values())
      for (const x of l) {
        if (x.metin) continue;
        const a = ayrinti.get(x.anahtar);
        assert.ok(a, `${x.anahtar}: rehberli incelemesi yok, kutu nereden?`);
        assert.equal(a.gorsel, x.gorsel, `${x.anahtar}: görsel değişmiş, kutulara yeniden bakılmalı`);
        assert.equal(incelemeKaydi(x, a).kayit, a, `${x.anahtar} · ${x.ad}: kutu ayrıntılarda yok`);
      }
});
