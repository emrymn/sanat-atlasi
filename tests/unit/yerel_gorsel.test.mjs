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
