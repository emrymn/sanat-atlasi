import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { yayinAl, dersDurumu, dersGorunurMu, dersKlasoru, dersYolu, mdHtml, satirIci, kanitDizini, sorulariAl, temizle } from '../../js/eserDersi.js';

const oku = (yol) => JSON.parse(readFileSync(new URL(`../../${yol}`, import.meta.url), 'utf8'));
const KLASORLER = readdirSync(new URL('../../basyapit-dersleri/eserler/', import.meta.url));

test('yayın kapısı: onaylı olmayan ders kapalı; geliştirici modunda taslak; dersi olmayan eser "yok"', () => {
  const y = yayinAl({ dersler: { Q1: 'Q1', 'x|Bir Eser': 'x', Q3: '../kotu' }, onayli: ['x', 'bilinmeyen'] });
  assert.equal(dersDurumu(y, 'Q1'), 'kapali');
  assert.equal(dersDurumu(y, 'Q1', true), 'taslak');
  assert.equal(dersDurumu(y, 'x|Bir Eser'), 'onayli');
  assert.equal(dersDurumu(y, 'Q9', true), 'yok');
  assert.equal(dersDurumu(y, 'Q3', true), 'yok'); // güvensiz klasör adı atılır
  assert.equal(y.onayli.has('bilinmeyen'), false);
  assert.equal(dersKlasoru(y, 'x|Bir Eser'), 'x');
  assert.deepEqual(['onayli', 'taslak', 'kapali', 'yok'].map(dersGorunurMu), [true, true, false, false]);
  assert.equal(dersDurumu(yayinAl(null), 'Q1', true), 'yok');
});

test('data/ders_yayin.json: 107 ders klasörünün hepsi bir başyapıta bağlı; onaylılar bilinen klasörler', () => {
  const ham = oku('data/ders_yayin.json');
  const y = yayinAl(ham);
  const anahtarlar = new Set(oku('data/basyapitlar.json').eserler.map((e) => e.anahtar));
  assert.equal(y.dersler.size, KLASORLER.length);
  assert.deepEqual([...y.dersler.values()].sort(), [...KLASORLER].sort());
  for (const a of y.dersler.keys()) assert.ok(anahtarlar.has(a), a);
  assert.equal(y.onayli.size, ham.onayli.length);
});

test('ders yolu: yalnız güvenli klasör ve dosya adları', () => {
  assert.equal(dersYolu('Q546297', 'DERS_ORTA.md'), 'basyapit-dersleri/eserler/Q546297/DERS_ORTA.md');
  assert.throws(() => dersYolu('..', 'DERS.json'));
  assert.throws(() => dersYolu('Q1', '../x.md'));
});

test('Markdown: başlık, paragraf, listeler, tablo, kanıt etiketi; HTML kaçışlı, ilk başlık atılır', () => {
  const h = mdHtml('# Eser — Ders\n\n**Eser:** *Ad* [C001][K2]\n\n## Bölüm <b>\n\n- bir\n- iki\n\n1. a\n2) b\n\n| A | B |\n|---|---|\n| x | y |\n\n---\n> alıntı\nsatır <script>');
  assert.doesNotMatch(h, /Eser — Ders/);
  assert.match(h, /<p><b>Eser:<\/b> <i>Ad<\/i> <sup class="drs-kanit" data-kanit="C001">C001<\/sup><sup class="drs-kanit" data-kanit="K2">K2<\/sup><\/p>/);
  assert.match(h, /<h3>Bölüm &lt;b&gt;<\/h3>/);
  assert.match(h, /<ul><li>bir<\/li><li>iki<\/li><\/ul>/);
  assert.match(h, /<ol><li>a<\/li><li>b<\/li><\/ol>/);
  assert.match(h, /<thead><tr><th>A<\/th><th>B<\/th><\/tr><\/thead><tbody><tr><td>x<\/td><td>y<\/td><\/tr><\/tbody>/);
  assert.match(h, /<hr>/);
  assert.match(h, /<blockquote>alıntı<\/blockquote>/);
  assert.match(h, /satır &lt;script&gt;/);
  assert.equal(satirIci('2 * 3 * 4 ve [Hokusai]'), '2 * 3 * 4 ve [Hokusai]');
});

test('gerçek dersler: her klasörün üç seviyesi çevrilir, ham HTML sızmaz; sorular biçimce sağlam', () => {
  for (const k of KLASORLER) {
    const kok = new URL(`../../basyapit-dersleri/eserler/${k}/`, import.meta.url);
    for (const d of ['DERS_BASLANGIC.md', 'DERS_ORTA.md', 'DERS_ILERI.md']) {
      const h = mdHtml(readFileSync(new URL(d, kok), 'utf8'));
      assert.ok(h.length > 200, `${k}/${d}`);
      assert.doesNotMatch(h.replace(/<\/?(p|b|i|h[2-4]|ul|ol|li|hr|code|blockquote|table|thead|tbody|tr|th|td|div class="drs-tablo"|div|sup class="drs-kanit" data-kanit="[CKS]\d+"|sup)>/g, ''), /<[a-z/]/i, `${k}/${d}`);
    }
    const s = sorulariAl(JSON.parse(readFileSync(new URL('SORULAR.json', kok), 'utf8')));
    assert.ok(s.length >= 5, `${k}: ${s.length} soru`);
    assert.ok(kanitDizini(JSON.parse(readFileSync(new URL('DERS.json', kok), 'utf8'))).size > 0, k);
  }
});

test('sorular: doğru harfi seçeneklerde olmayan ya da yinelenen harfli soru atılır', () => {
  const sec = [{ harf: 'A', metin: 'a' }, { harf: 'B', metin: 'b' }];
  const l = sorulariAl({ coktan_secmeli: [{ id: 'CS01', soru: 's', secenekler: sec, dogru: 'B', gerekce: 'g', yanlis_gerekceleri: { A: 'x' } }, { soru: 's', secenekler: sec, dogru: 'C' }, { soru: 's', secenekler: [sec[0], sec[0]], dogru: 'A' }, null] });
  assert.equal(l.length, 1);
  assert.equal(l[0].yanlis.A, 'x');
  assert.deepEqual(sorulariAl(null), []);
});

test('kanıt dizini: iddia ve kaynak adları', () => {
  const k = kanitDizini({ iddialar: [{ id: 'C001', ifade: 'İfade', kaynak_id: ['K1', 'K9'] }], kaynaklar: [{ id: 'K1', kurum: 'Brera', belge: 'Künye' }] });
  assert.deepEqual(k.get('C001'), { ifade: 'İfade', kaynaklar: ['Brera · Künye'] });
});

test('temizle: kanıt etiketi, (belirsiz)/(yorum), "bu oturumda" cümlesi, künye satırı ve kimlik listesi gider', () => {
  const md = '# Başlık\n**Eser:** x\n## Bir bakışta kimlik\n- **Tarih:** 1434 [C001]\nBu pano ünlüdür [C011].\n## 2. Ne görüyoruz\nBir cümle [C005] (belirsiz). Görsel bu oturumda incelenemedi. Son (yorum).';
  const t = temizle(md);
  assert.ok(!/\[C\d/.test(t) && !/belirsiz|yorum|oturum|Tarih|Eser:/.test(t), t);
  assert.match(t, /Bu pano ünlüdür\./);
  assert.match(t, /## Ne görüyoruz/);
  assert.match(t, /Bir cümle\. Son\./);
});

test('temizle: kaynak/katalog cümleleri, "betimlediği gibi" kalıbı, kod ve standart satırı gider; 107 derste iz kalmaz', () => {
  const t = temizle('**Ön koşul:** Başlangıç dersi. **Standart:** `../../AKADEMIK_STANDART.md` §8-9.\n## Ne görüyoruz (NG betimi)\nNational Gallery föyünün betimlediği gibi: zengin giysili bir adam durur. NG kaydı eseri 1533 olarak verir. WD P18 dosyası farklıdır. Resim simetriktir.');
  assert.ok(!/Ön koşul|Standart|AKADEMIK|NG|WD|föy|`/.test(t), t);
  assert.match(t, /## Ne görüyoruz\n/);
  assert.match(t, /^Zengin giysili bir adam durur\. Resim simetriktir\.$/m);
  const iz = /\b(NG|WD|wiki|föy\w*|Commons|Wikidata)\b|\.md\b|§|`/;
  for (const k of KLASORLER)
    for (const f of ['DERS_BASLANGIC.md', 'DERS_ORTA.md']) {
      const md = readFileSync(new URL(`../../basyapit-dersleri/eserler/${k}/${f}`, import.meta.url), 'utf8');
      assert.ok(!iz.test(temizle(md)), `${k}/${f}`);
    }
});
