import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gorselUrl, paletUrl, yerelGorselleriAyarla, yerelAnahtar } from '../../js/gorsel.js';

test('yerel kopya varsa uygulamanın kendi adresi, yoksa kaynak adresi', () => {
  const c = { k: 'commons', d: 'Örnek dosya.jpg' };
  const m = { k: 'met', u: 'https://images.metmuseum.org/x.jpg' };
  yerelGorselleriAyarla({ [yerelAnahtar(c)]: 'abc123' });
  assert.equal(gorselUrl(c, 800), 'gorseller/b/abc123.jpg');
  assert.equal(gorselUrl(c, 1200), 'gorseller/b/abc123.jpg');
  assert.equal(gorselUrl(c, 400), 'gorseller/k/abc123.jpg');
  assert.equal(paletUrl(c), 'gorseller/k/abc123.jpg');
  assert.equal(gorselUrl(m, 800), 'https://images.metmuseum.org/x.jpg');
  yerelGorselleriAyarla({ [yerelAnahtar(c)]: 'abc123' }, [yerelAnahtar(c)]);
  assert.equal(gorselUrl(c, 1200), 'gorseller/b/abc123.jpg');
  assert.equal(gorselUrl(c, 800), 'gorseller/b/abc123.jpg');
  yerelGorselleriAyarla(null);
  assert.match(gorselUrl(c, 800), /^https:\/\/upload\.wikimedia\.org\//);
});

test('İş 58: Cloudflare R2 — en büyük kopya yalnız listede olana; 1280\'likler R2\'de yalnız buyuk: true iken; küçük ve palet hep yerel', async () => {
  const { uzakGorselleriAyarla, devasaUrl } = await import('../../js/gorsel.js');
  const c = { k: 'commons', d: 'Örnek dosya.jpg' };
  const r = 'https://pub-ornek.r2.dev';
  yerelGorselleriAyarla({ [yerelAnahtar(c)]: 'abc123' });
  uzakGorselleriAyarla(null);
  assert.equal(devasaUrl(c), '');
  uzakGorselleriAyarla({ adres: r + '/', buyuk: false, devasa: ['abc123'] });
  assert.equal(devasaUrl(c), `${r}/d/abc123.jpg`);
  assert.equal(gorselUrl(c, 800), 'gorseller/b/abc123.jpg');
  uzakGorselleriAyarla({ adres: r, buyuk: true, devasa: [] });
  assert.equal(devasaUrl(c), '');
  assert.equal(gorselUrl(c, 800), `${r}/b/abc123.jpg`);
  assert.equal(gorselUrl(c, 400), 'gorseller/k/abc123.jpg');
  assert.equal(paletUrl(c), 'gorseller/k/abc123.jpg');
  // İş 58c: en büyük kopya müzeden geldiyse kaynağı; kaydın kendi kaynağıysa, listede yoksa ya da bilinmeyen kaynaksa ''
  const { devasaKaynagi } = await import('../../js/gorsel.js');
  uzakGorselleriAyarla({ adres: r, devasa: ['abc123'], muze: { abc123: 'met' } });
  assert.equal(devasaKaynagi(c), 'The Met');
  assert.equal(devasaKaynagi({ k: 'met', u: 'x' }), '');
  uzakGorselleriAyarla({ adres: r, devasa: [], muze: { abc123: 'met' } });
  assert.equal(devasaKaynagi(c), '');
  // İş 119: Rijksmuseum ve Yale de en büyük kopyanın kaynağı olabilir
  uzakGorselleriAyarla({ adres: r, devasa: ['abc123'], muze: { abc123: 'rijks' } });
  assert.equal(devasaKaynagi(c), 'Rijksmuseum');
  uzakGorselleriAyarla({ adres: r, devasa: ['abc123'], muze: { abc123: 'bilinmeyen' } });
  assert.equal(devasaKaynagi(c), '');
  // İş 60: Ayarlar'daki indirme için adresler ve toplam boy
  const { devasaAdresleri, devasaToplamBayt } = await import('../../js/gorsel.js');
  uzakGorselleriAyarla({ adres: r, devasa: ['abc123', 'def456'], devasa_bayt: 5e9 });
  assert.deepEqual(devasaAdresleri(), [`${r}/d/abc123.jpg`, `${r}/d/def456.jpg`]);
  assert.equal(devasaToplamBayt(), 5e9);
  uzakGorselleriAyarla({ adres: r, devasa: ['abc123'], devasa_bayt: 'bozuk' });
  assert.equal(devasaToplamBayt(), 0);
  uzakGorselleriAyarla(null);
  assert.deepEqual(devasaAdresleri(), []);
  // https olmayan ya da bozuk adres yok sayılır
  uzakGorselleriAyarla({ adres: 'http://kotu', buyuk: true, devasa: ['abc123'] });
  assert.equal(devasaUrl(c), '');
  assert.equal(gorselUrl(c, 800), 'gorseller/b/abc123.jpg');
  uzakGorselleriAyarla(null);
  yerelGorselleriAyarla(null);
});

test('İş 84: daha büyük dosyasıyla yenilenen en büyük kopya sürüm ekli adreste; geçersiz sürüm yok sayılır', async () => {
  const { uzakGorselleriAyarla, devasaUrl, devasaAdresleri, ustKopya } = await import('../../js/gorsel.js');
  const c = { k: 'commons', d: 'Örnek dosya.jpg' };
  const r = 'https://gorsel.ornek.ai';
  yerelGorselleriAyarla({ [yerelAnahtar(c)]: 'abc123abc123abc1' });
  uzakGorselleriAyarla({ adres: r, devasa: ['abc123abc123abc1', 'def456def456def4'], surumler: { abc123abc123abc1: '0a1b2c3d', def456def456def4: '../kotu' } });
  assert.equal(devasaUrl(c), `${r}/d/abc123abc123abc1-0a1b2c3d.jpg`);
  assert.deepEqual(devasaAdresleri(), [`${r}/d/abc123abc123abc1-0a1b2c3d.jpg`, `${r}/d/def456def456def4.jpg`]);
  assert.equal(ustKopya('gorseller/b/abc123abc123abc1.jpg', { buyuk: true }), `${r}/d/abc123abc123abc1-0a1b2c3d.jpg`);
  uzakGorselleriAyarla(null);
});

test('İş 118: en büyük kopyadan yeniden üretilen 1280\'lik sürüm ekli adreste; zinciri bozulmaz', async () => {
  const { uzakGorselleriAyarla, ustKopya } = await import('../../js/gorsel.js');
  const c = { k: 'commons', d: 'Örnek dosya.jpg' };
  const r = 'https://gorsel.ornek.ai';
  yerelGorselleriAyarla({ [yerelAnahtar(c)]: 'abc123abc123abc1' });
  uzakGorselleriAyarla({ adres: r, buyuk: true, devasa: ['abc123abc123abc1'], b_surumler: { abc123abc123abc1: '1a2b3c4d', def456def456def4: '<kotu>' } });
  assert.equal(gorselUrl(c, 800), `${r}/b/abc123abc123abc1-1a2b3c4d.jpg`);
  assert.equal(gorselUrl(c, 400), 'gorseller/k/abc123abc123abc1.jpg');
  // 400 → yeni 1280'lik → en büyük kopya
  assert.equal(ustKopya('gorseller/k/abc123abc123abc1.jpg'), `${r}/b/abc123abc123abc1-1a2b3c4d.jpg`);
  assert.equal(ustKopya(`${r}/b/abc123abc123abc1-1a2b3c4d.jpg`, { buyuk: true }), `${r}/d/abc123abc123abc1.jpg`);
  // sürümü olmayan ya da geçersiz sürümlü: eski adres
  assert.equal(ustKopya('gorseller/k/def456def456def4.jpg'), `${r}/b/def456def456def4.jpg`);
  uzakGorselleriAyarla(null);
  yerelGorselleriAyarla(null);
});

// İş 121: en büyük kopyalar yalnız uygulamada gösterilen görseller için iner (kopya kaydın ikinci dosyası ve çıkarılan
// görseller inmez); gerçek verilerle
test('İş 121: indirme listesi gösterilen görsellerle süzülür; aynı tablo iki kez inmez', async () => {
  const { readFileSync } = await import('node:fs');
  const oku = (f) => JSON.parse(readFileSync(new URL(`../../${f}`, import.meta.url)));
  const { uzakGorselleriAyarla, devasaSuz, devasaAdresleri, devasaToplamBayt } = await import('../../js/gorsel.js');
  const { onbellekEseri, kopyalariAyikla, kopyalariAyarla, cikarilanlariAyikla, cikarilanlariAyarla } = await import('../../js/eserler.js');
  const yer = oku('data/yerel_gorseller.json');
  const kaynak = oku('data/gorsel_kaynagi.json');
  yerelGorselleriAyarla(yer.gorseller, yer.buyuk);
  uzakGorselleriAyarla(kaynak);
  kopyalariAyarla(oku('data/kopya_eserler.json'));
  cikarilanlariAyarla(oku('data/cikarilan_gorseller.json'));
  const ob = oku('data/eserler_onbellek.json').sanatcilar;
  // js/eserler.js gosterilenGorseller ile aynı hesap (o, önbelleği fetch ile okur)
  const gosterilen = new Set();
  for (const [sid, v] of Object.entries(ob))
    for (const e of kopyalariAyikla(sid, cikarilanlariAyikla(v.eserler.map(onbellekEseri)))) for (const g of e.gorseller) gosterilen.add(`${g.k}:${g.d || g.i || g.u || ''}`);
  const hepsi = devasaAdresleri().length;
  devasaSuz(gosterilen);
  const suzulmus = devasaAdresleri();
  assert.ok(suzulmus.length < hepsi && suzulmus.length > hepsi * 0.9, `${suzulmus.length} / ${hepsi}`);
  assert.equal(new Set(suzulmus).size, suzulmus.length);
  assert.ok(devasaToplamBayt() < kaynak.devasa_bayt);
  // gizlenen kopya kaydın görseli listede yok (kalan kaydınki varsa o iner)
  const adlar = new Set(suzulmus.map((u) => u.match(/\/d\/([0-9a-f]{16})/)[1]));
  const yerelAd = (g) => yer.gorseller[`${g.k}:${g.d || g.i || g.u || ''}`];
  let denetlenen = 0;
  for (const [sid, ciftler] of Object.entries(oku('data/kopya_eserler.json').sanatcilar)) {
    const es = new Map((ob[sid]?.eserler || []).map((e) => [onbellekEseri(e).anahtar, e]));
    for (const c of ciftler) {
      const sil = es.get(c.sil);
      const kal = es.get(c.kalan);
      if (!sil || !kal) continue;
      const kalanAdlar = new Set(kal.gorseller.map(yerelAd));
      for (const g of sil.gorseller) if (yerelAd(g) && !kalanAdlar.has(yerelAd(g))) (assert.ok(!adlar.has(yerelAd(g)), c.sil_baslik), denetlenen++);
    }
  }
  assert.ok(denetlenen > 50, String(denetlenen));
  devasaSuz(null);
  assert.equal(devasaAdresleri().length, hepsi);
  uzakGorselleriAyarla(null);
  yerelGorselleriAyarla(null);
  kopyalariAyarla(null);
  cikarilanlariAyarla(null);
});
