// İş 151: rehberli eser incelemesi — js/ayrinti.js yardımcıları, veri dosyası ve scripts/ayrinti/denetle.py
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { noktaGecerliMi, ayrintilariAl, ayrintiAnahtari, eserinAyrintisi, noktaOdagi, noktaYeri, EN_AZ_NOKTA, EN_COK_NOKTA } from '../../js/ayrinti.js';

const KOK = new URL('../../', import.meta.url);
const nokta = (ek = {}) => ({ ad: 'Ayna', x: 0.4, y: 0.2, w: 0.2, h: 0.2, metin: 'Birinci cümle burada. İkinci cümle de burada duruyor.', ...ek });

test('nokta geçerliliği: koordinatlar 0–1, kutu içeride, boy ve metin var', () => {
  assert.ok(noktaGecerliMi(nokta()));
  assert.ok(!noktaGecerliMi(nokta({ x: 0.9 }))); // taşar
  assert.ok(!noktaGecerliMi(nokta({ w: 0.01 })));
  assert.ok(!noktaGecerliMi(nokta({ y: -0.1 })));
  assert.ok(!noktaGecerliMi(nokta({ metin: '' })));
  assert.ok(!noktaGecerliMi(nokta({ x: '0.4' })));
  assert.ok(!noktaGecerliMi(null));
});

test('veri okuma: bozuk kayıt ve bozuk nokta atılır', () => {
  assert.deepEqual(ayrintilariAl(null), []);
  const l = ayrintilariAl({
    eserler: [
      { anahtar: 'Q1', sanatci: 'a', noktalar: [nokta(), nokta({ x: 2 })] },
      { anahtar: '', noktalar: [nokta()] },
      { anahtar: 'Q3', noktalar: [] },
      { anahtar: 'Q4' },
    ],
  });
  assert.equal(l.length, 1);
  assert.equal(l[0].noktalar.length, 1);
});

test('anahtar: QID, yoksa "sanatçıId|başlık"', () => {
  assert.equal(ayrintiAnahtari({ qid: 'Q220859', sid: 'jan-van-eyck', baslik: 'X' }), 'Q220859');
  assert.equal(ayrintiAnahtari({ qid: null, sid: 'william-hogarth', baslik: 'Gin Lane' }), 'william-hogarth|Gin Lane');
  assert.equal(ayrintiAnahtari({ baslik: 'Gin Lane' }), '');
  const l = ayrintilariAl({ eserler: [{ anahtar: 'william-hogarth|Gin Lane', noktalar: [nokta()] }] });
  assert.equal(eserinAyrintisi(l, { sid: 'william-hogarth', baslik: 'Gin Lane' }).anahtar, 'william-hogarth|Gin Lane');
  assert.equal(eserinAyrintisi(l, { qid: 'Q9' }), null);
});

test('noktaya yakınlaşma: ortadaki kutu kaymasız, köşedeki kutu kenarı aşmayacak kadar kayar, ölçek sınırlı', () => {
  const taban = { w: 390, h: 520 }; // tablo ekrana sığmış
  const sahne = { w: 390, h: 640 };
  const orta = noktaOdagi({ x: 0.4, y: 0.4, w: 0.2, h: 0.2 }, taban, sahne);
  assert.equal(orta.tx, 0);
  assert.equal(orta.ty, 0);
  assert.ok(orta.olcek > 1.5 && orta.olcek <= 6, String(orta.olcek));
  // köşe: kutunun ortası ekranın ortasına gelmek ister ama görselin kenarı sahneyi aşamaz
  const kose = noktaOdagi({ x: 0, y: 0, w: 0.2, h: 0.2 }, taban, sahne);
  assert.ok(kose.tx > 0 && kose.ty > 0);
  assert.ok(kose.tx <= (taban.w * kose.olcek - sahne.w) / 2 + 1);
  assert.ok(kose.ty <= (taban.h * kose.olcek - sahne.h) / 2 + 1);
  // çok küçük kutu en çok 6×; büyük kutu en az 1,15×
  assert.equal(noktaOdagi({ x: 0.5, y: 0.5, w: 0.02, h: 0.02 }, taban, sahne).olcek, 6);
  assert.equal(noktaOdagi({ x: 0, y: 0, w: 1, h: 1 }, taban, sahne).olcek, 1.15);
  assert.equal(noktaOdagi(null, taban, sahne), null);
  assert.equal(noktaOdagi(nokta(), { w: 0, h: 0 }, sahne), null);
  assert.deepEqual(noktaYeri({ x: 0.4, y: 0.2, w: 0.2, h: 0.2 }), { x: 50, y: 30 });
});

test('data/eser_ayrintilari.json: anahtarlar başyapıtlarda, 4–6 nokta, hepsi geçerli, görsel adı yerel listede', () => {
  const ham = JSON.parse(readFileSync(new URL('data/eser_ayrintilari.json', KOK), 'utf8'));
  const l = ayrintilariAl(ham);
  assert.equal(l.length, ham.eserler.length, 'geçersiz kayıt var');
  assert.ok(l.length >= 20);
  const basyapitlar = new Map(JSON.parse(readFileSync(new URL('data/basyapitlar.json', KOK), 'utf8')).eserler.map((b) => [b.anahtar, b]));
  const yerel = new Set(Object.values(JSON.parse(readFileSync(new URL('data/yerel_gorseller.json', KOK), 'utf8')).gorseller));
  const gorulen = new Set();
  for (const e of l) {
    assert.ok(basyapitlar.has(e.anahtar), `${e.anahtar} başyapıtlarda yok`);
    assert.equal(e.sanatci, basyapitlar.get(e.anahtar).sanatci, e.anahtar);
    assert.ok(!gorulen.has(e.anahtar), `${e.anahtar} iki kez`);
    gorulen.add(e.anahtar);
    const ham_ = ham.eserler.find((x) => x.anahtar === e.anahtar);
    assert.equal(e.noktalar.length, ham_.noktalar.length, `${e.anahtar}: geçersiz nokta var`);
    assert.ok(e.noktalar.length >= EN_AZ_NOKTA && e.noktalar.length <= EN_COK_NOKTA, `${e.anahtar}: ${e.noktalar.length} nokta`);
    assert.ok(yerel.has(e.gorsel), `${e.anahtar}: gorsel ${e.gorsel} yerel listede yok`);
  }
});

test('scripts/ayrinti/denetle.py veriyi hatasız geçer (python3 yoksa atlanır)', (t) => {
  const yol = new URL('scripts/ayrinti/denetle.py', KOK);
  assert.ok(existsSync(yol));
  const r = spawnSync('python3', [yol.pathname, '--sessiz'], { encoding: 'utf8' });
  if (r.error && r.error.code === 'ENOENT') return t.skip('python3 yok');
  assert.equal(r.status, 0, `${r.stdout}\n${r.stderr}`);
  assert.match(r.stdout, /0 hata/);
});

test('denetle.py bozuk veriyi yakalar: eksik anahtar, az nokta, taşan kutu, örtüşme, uzun metin', (t) => {
  const r = spawnSync('python3', ['-c', `
import importlib.util, json, sys
sp = importlib.util.spec_from_file_location('d', sys.argv[1]); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
n = lambda **k: {'ad': 'Ad', 'x': 0.1, 'y': 0.1, 'w': 0.2, 'h': 0.2, 'metin': 'Bir cümle var burada ve yeterince uzun sürüyor. İkinci cümle de burada duruyor.', **k}
veri = {'surum': 1, 'eserler': [
  {'anahtar': 'YOK', 'sanatci': 'x', 'gorsel': 'g', 'noktalar': [n(), n(ad='B', x=0.9), n(ad='C', x=0.12, y=0.12)]},
  {'anahtar': 'Q1', 'sanatci': 'a', 'gorsel': 'g', 'noktalar': [n(), n(ad='B', x=0.5), n(ad='C', y=0.5), n(ad='D', x=0.5, y=0.5, metin='Kısa.')]},
]}
h, u, _ = m.denetle(veri, [{'anahtar': 'Q1', 'sanatci': 'a'}], {})
print(json.dumps(h, ensure_ascii=False))
`, new URL('scripts/ayrinti/denetle.py', KOK).pathname], { encoding: 'utf8' });
  if (r.error && r.error.code === 'ENOENT') return t.skip('python3 yok');
  assert.equal(r.status, 0, r.stderr);
  const h = JSON.parse(r.stdout.trim().split('\n').pop());
  assert.ok(h.some((x) => x.includes("basyapitlar.json'da yok")));
  assert.ok(h.some((x) => x.includes('3 nokta')));
  assert.ok(h.some((x) => x.includes('dışına taşıyor')));
  assert.ok(h.some((x) => x.includes('örtüşüyor')));
  assert.ok(h.some((x) => x.includes('karakter olmalı')));
  assert.ok(!h.some((x) => x.startsWith('[Q1]') && x.includes('nokta 1:')), h.join('\n'));
});
