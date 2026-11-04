// İş 124/127: parça parça en büyük kopya önbellekleri; temizlik listede olmayanlar azsa siler, çoksa hiç silmez
import { test } from 'node:test';
import assert from 'node:assert/strict';

function sahteCaches(icerik) {
  const depo = new Map(Object.entries(icerik).map(([a, l]) => [a, new Map(l.map((u) => [u, true]))]));
  return {
    depo,
    keys: async () => [...depo.keys()],
    open: async (a) => {
      if (!depo.has(a)) depo.set(a, new Map());
      const m = depo.get(a);
      return { keys: async () => [...m.keys()].map((url) => ({ url })), delete: async (r) => m.delete(r.url), match: async (u) => (m.has(u) ? {} : undefined) };
    },
    delete: async (a) => depo.delete(a),
  };
}

test('İş 124/127: parçalardaki kopyalar okunur; listede olmayan az ise silinir, çok ise korunur', async () => {
  const { kaliciAdresler, kalicidaMi, kaliciSil } = await import('../../js/devasaOnbellek.js');
  const u = (i) => `https://r2/d/${i}.jpg`;
  const parca1 = Array.from({ length: 60 }, (_, i) => u(i));
  const parca2 = Array.from({ length: 40 }, (_, i) => u(60 + i));
  globalThis.caches = sahteCaches({ 'atlas-devasa-kalici': [u(500)], 'atlas-devasa-kalici-1': parca1, 'atlas-devasa-kalici-2': parca2, 'atlas-resim': [u(900)] });
  assert.equal(await kalicidaMi(u(70)), true);
  assert.equal(await kalicidaMi(u(500)), true);
  assert.equal(await kalicidaMi(u(900)), false); // başka önbellek sayılmaz
  // listede olmayan 3 (eski sürüm, kopya): silinir
  const gecerli = new Set([...parca1, ...parca2.slice(0, 38)]);
  let s = await kaliciAdresler(gecerli);
  assert.equal(s.adresler.size, 98);
  assert.equal(s.silinen, 3);
  assert.equal(s.korundu, 0);
  // liste yanlış hesaplanırsa (çoğu listede yok) hiçbiri silinmez
  s = await kaliciAdresler(new Set(parca1.slice(0, 10)));
  assert.equal(s.adresler.size, 10);
  assert.equal(s.korundu, 88);
  assert.equal((await kaliciAdresler()).adresler.size, 98);
  await kaliciSil();
  assert.deepEqual([...globalThis.caches.depo.keys()], ['atlas-resim']);
  delete globalThis.caches;
});

test('İş 128: önbellek eksik okunursa defterdekiler (örnekle doğrulanıp) inmiş sayılır; gerçekten silinmişse defter düzelir', async () => {
  const { telefondaOlanlar, defterOku } = await import('../../js/devasaOnbellek.js');
  const depo = new Map();
  globalThis.localStorage = { getItem: (k) => (depo.has(k) ? depo.get(k) : null), setItem: (k, v) => depo.set(k, String(v)), removeItem: (k) => depo.delete(k) };
  const u = (i) => `https://r2/d/${String(i).padStart(16, '0')}.jpg`;
  const hepsi = Array.from({ length: 50 }, (_, i) => u(i));
  const gecerli = new Set(hepsi);
  // önbellekte 40 var; keys() okuma hatası veriyor ama match çalışıyor (telefonda görülebilecek durum)
  const icerik = new Map(hepsi.slice(0, 40).map((x) => [x, true]));
  let keysBozuk = false;
  globalThis.caches = {
    keys: async () => ['atlas-devasa-kalici-1'],
    open: async () => ({
      keys: async () => {
        if (keysBozuk) throw new Error('okunamadı');
        return [...icerik.keys()].map((url) => ({ url }));
      },
      match: async (x) => (icerik.has(x) ? {} : undefined),
      delete: async (r) => icerik.delete(r.url),
    }),
  };
  let s = await telefondaOlanlar(gecerli);
  assert.equal(s.adresler.size, 40);
  assert.equal(defterOku().size, 40);
  keysBozuk = true;
  s = await telefondaOlanlar(gecerli);
  assert.equal(s.adresler.size, 40); // baştan başlamaz
  assert.equal(s.ek, 40);
  // gerçekten silinmiş: defter düzelir
  keysBozuk = false;
  icerik.clear();
  s = await telefondaOlanlar(gecerli);
  assert.equal(s.adresler.size, 0);
  assert.equal(defterOku().size, 0);
  assert.match(depo.get('sanat-atlasi:hatalar') || '', /okunamadı|silinmiş/);
  delete globalThis.caches;
  delete globalThis.localStorage;
});
