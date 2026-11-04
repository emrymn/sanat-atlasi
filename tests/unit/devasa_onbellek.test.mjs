// İş 124/127/128/129: en büyük kopyaların telefondaki deposu (IndexedDB; testte sahtesi), silinme koruması, defter ve
// bozuk eski önbelleklerin taşınması/silinmesi
import { test } from 'node:test';
import assert from 'node:assert/strict';

function sahteDepo(liste = []) {
  const m = new Map(liste.map((u) => [u, new Blob(['x'], { type: 'image/jpeg' })]));
  let bozuk = false;
  const d = {
    m,
    bozuk: (v) => (bozuk = v),
    anahtarlar: async () => {
      if (bozuk) throw new Error('okunamadı');
      return [...m.keys()];
    },
    al: async (u) => m.get(u),
    varMi: async (u) => m.has(u),
    koy: async (u, v) => void m.set(u, v),
    sil: async (u) => void m.delete(u),
    temizle: async () => m.clear(),
  };
  return d;
}

function sahteLocalStorage() {
  const depo = new Map();
  globalThis.localStorage = { getItem: (k) => (depo.has(k) ? depo.get(k) : null), setItem: (k, v) => depo.set(k, String(v)), removeItem: (k) => depo.delete(k) };
  return depo;
}

test('İş 127/129: depodaki kopyalar sayılır; listede olmayan az ise silinir, çok ise korunur', async () => {
  const { kaliciAdresler, kalicidaMi, kaliciSil, depoAyarla } = await import('../../js/devasaOnbellek.js');
  const u = (i) => `https://r2/d/${i}.jpg`;
  const hepsi = Array.from({ length: 100 }, (_, i) => u(i));
  const d = sahteDepo(hepsi);
  depoAyarla(d);
  assert.equal(await kalicidaMi(u(70)), true);
  assert.equal(await kalicidaMi(u(900)), false);
  // listede olmayan 2 (eski sürüm, kopya): silinir
  let s = await kaliciAdresler(new Set(hepsi.slice(0, 98)));
  assert.equal(s.adresler.size, 98);
  assert.equal(s.silinen, 2);
  assert.equal(s.korundu, 0);
  // liste yanlış hesaplanırsa (çoğu listede yok) hiçbiri silinmez
  s = await kaliciAdresler(new Set(hepsi.slice(0, 10)));
  assert.equal(s.adresler.size, 10);
  assert.equal(s.korundu, 88);
  assert.equal((await kaliciAdresler()).adresler.size, 98);
  // İş 130: sil: false iken listede olmayanlar silinmez
  s = await kaliciAdresler(new Set(hepsi.slice(0, 90)), { sil: false });
  assert.equal(s.silinen, 0);
  assert.equal(d.m.size, 98);
  await kaliciSil();
  assert.equal(d.m.size, 0);
  depoAyarla(null);
});

test('İş 129: Blob saklanamazsa ArrayBuffer olarak saklanır ve görsel olarak okunur; yer yoksa hata yukarı çıkar', async () => {
  const { kaliciYaz, kaliciOku, depoAyarla } = await import('../../js/devasaOnbellek.js');
  const d = sahteDepo();
  const koy = d.koy;
  d.koy = async (u, v) => {
    if (v instanceof Blob) throw new Error('Error preparing Blob/File data to be stored in object store');
    return koy(u, v);
  };
  depoAyarla(d);
  await kaliciYaz('https://r2/d/a.jpg', new Blob(['abc'], { type: 'image/jpeg' }));
  const b = await kaliciOku('https://r2/d/a.jpg');
  assert.equal(b.type, 'image/jpeg');
  assert.equal(await b.text(), 'abc');
  assert.equal(await kaliciOku('https://r2/d/yok.jpg'), null);
  d.koy = async () => {
    throw Object.assign(new Error('dolu'), { name: 'QuotaExceededError' });
  };
  await assert.rejects(kaliciYaz('https://r2/d/b.jpg', new Blob(['x'])), { name: 'QuotaExceededError' });
  depoAyarla(null);
});

test('İş 129: eski önbellekler okunabiliyorsa depoya taşınır, okunamıyorsa (telefondaki "Internal error") silinir', async () => {
  const { kaliciAdresler, depoAyarla } = await import('../../js/devasaOnbellek.js');
  const ls = sahteLocalStorage();
  const yanit = { ok: true, blob: async () => new Blob(['y'], { type: 'image/jpeg' }) };
  const onbellekler = new Map([
    ['atlas-devasa-kalici', { bozuk: true, m: new Map([['https://r2/d/1.jpg', yanit]]) }],
    ['atlas-devasa-kalici-1', { bozuk: false, m: new Map([['https://r2/d/2.jpg', yanit], ['https://r2/d/3.jpg', yanit]]) }],
    ['atlas-resim-2', { bozuk: false, m: new Map([['https://r2/b/9.jpg', yanit]]) }],
  ]);
  globalThis.caches = {
    keys: async () => [...onbellekler.keys()],
    open: async (a) => {
      const c = onbellekler.get(a);
      return {
        keys: async () => {
          if (c.bozuk) throw Object.assign(new Error('Internal error'), { name: 'UnknownError' });
          return [...c.m.keys()].map((url) => ({ url }));
        },
        match: async (r) => c.m.get(r.url || r),
        delete: async (r) => c.m.delete(r.url || r),
      };
    },
    delete: async (a) => onbellekler.delete(a),
  };
  const d = sahteDepo();
  depoAyarla(d);
  const s = await kaliciAdresler();
  assert.deepEqual([...s.adresler].sort(), ['https://r2/d/2.jpg', 'https://r2/d/3.jpg']);
  assert.deepEqual([...onbellekler.keys()], ['atlas-resim-2']); // başka önbelleğe dokunulmaz
  assert.match(ls.get('sanat-atlasi:hatalar') || '', /okunamadı.*siliniyor/);
  assert.match(ls.get('sanat-atlasi:hatalar') || '', /2 en büyük kopya IndexedDB'ye taşındı/);
  delete globalThis.caches;
  delete globalThis.localStorage;
  depoAyarla(null);
});

test('İş 128: depo okunamazsa defterdekiler (örnekle doğrulanıp) inmiş sayılır; gerçekten silinmişse defter düzelir', async () => {
  const { telefondaOlanlar, defterOku, depoAyarla } = await import('../../js/devasaOnbellek.js');
  const ls = sahteLocalStorage();
  const u = (i) => `https://r2/d/${String(i).padStart(16, '0')}.jpg`;
  const hepsi = Array.from({ length: 50 }, (_, i) => u(i));
  const gecerli = new Set(hepsi);
  const d = sahteDepo(hepsi.slice(0, 40));
  depoAyarla(d);
  let s = await telefondaOlanlar(gecerli);
  assert.equal(s.adresler.size, 40);
  assert.equal(defterOku().size, 40);
  d.bozuk(true); // sayım okunamıyor ama tek tek bakılabiliyor
  s = await telefondaOlanlar(gecerli);
  assert.equal(s.adresler.size, 40); // baştan başlamaz
  assert.equal(s.ek, 40);
  // gerçekten silinmiş: defter düzelir
  d.bozuk(false);
  d.m.clear();
  s = await telefondaOlanlar(gecerli);
  assert.equal(s.adresler.size, 0);
  assert.equal(defterOku().size, 0);
  assert.match(ls.get('sanat-atlasi:hatalar') || '', /okunamadı|yok/);
  delete globalThis.localStorage;
  depoAyarla(null);
});
