// İş 135 (ChatGPT incelemesi, doğrulandı): veri güvenliği. İlerleme okunamayınca boş ilerleme gerçeğinin üzerine yazılmaz;
// localStorage'a yazılamayınca bayat kopya kalmaz; iki depo da yazamazsa kullanıcıya söylenir; bozuk yedek tarihleri ve
// sayaçları düzelir; eski önbellekten taşırken depo dolarsa taşınmamış görseller silinmez; 400'lükler deftere doğru yazılır.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ilerlemeYukle, ilerlemeKaydet, ilerlemeDogrula, kayitKilitliMi, kayitKilidiniAc, varsayilanIlerleme, enYeniKayit, ANAHTAR } from '../../js/depo.js';
import { bugunStr } from '../../js/leitner.js';

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

function sahteLocalStorage({ okumaHatasi = false, yazmaHatasi = false } = {}) {
  const m = new Map();
  const ls = {
    m,
    silinen: [],
    getItem: (k) => {
      if (okumaHatasi && k === ANAHTAR) throw new Error('SecurityError');
      return m.has(k) ? m.get(k) : null;
    },
    setItem: (k, v) => {
      if (yazmaHatasi && k === ANAHTAR) throw Object.assign(new Error('dolu'), { name: 'QuotaExceededError' });
      m.set(k, String(v));
    },
    removeItem: (k) => (ls.silinen.push(k), m.delete(k)),
  };
  globalThis.localStorage = ls;
  return ls;
}
// açılamayan IndexedDB (iPhone'daki "Internal error" gibi)
function bozukIndexedDB() {
  globalThis.indexedDB = {
    open() {
      const r = {};
      setTimeout(() => ((r.error = Object.assign(new Error('Internal error'), { name: 'UnknownError' })), r.onerror && r.onerror()));
      return r;
    },
  };
}
function olaylariTopla() {
  const l = [];
  globalThis.dispatchEvent = (e) => l.push(e.detail);
  return l;
}
function temizle() {
  delete globalThis.localStorage;
  delete globalThis.indexedDB;
  delete globalThis.dispatchEvent;
  kayitKilidiniAc();
}

test('localStorage’daki geçerli ilerleme okunur, kayıt kilitlenmez', async () => {
  const ls = sahteLocalStorage();
  const i = varsayilanIlerleme([1, 2]);
  ls.m.set(ANAHTAR, JSON.stringify(i));
  const y = await ilerlemeYukle(async () => ({ islenen: [] }));
  assert.deepEqual(y.islenen, [1, 2]);
  assert.equal(kayitKilitliMi(), false);
  temizle();
});

test('iki depo da okunamazsa başlangıç ilerlemesi gelir ama kaydedilmez (gerçek kaydın üzerine yazılmasın); kullanıcıya söylenir', async () => {
  const ls = sahteLocalStorage({ okumaHatasi: true });
  bozukIndexedDB();
  const olaylar = olaylariTopla();
  const y = await ilerlemeYukle(async () => ({ islenen: [3] }));
  assert.deepEqual(y.islenen, [3]);
  assert.equal(kayitKilitliMi(), true);
  ilerlemeKaydet(y);
  assert.equal(ls.m.has(ANAHTAR), false);
  assert.deepEqual(olaylar, ['kilitli']);
  assert.match(ls.m.get('sanat-atlasi:hatalar') || '', /İlerleme okunamadı/);
  // yedek geri yüklenince kilit açılır
  kayitKilidiniAc();
  globalThis.localStorage = sahteLocalStorage();
  ilerlemeKaydet(y);
  assert.ok(globalThis.localStorage.m.has(ANAHTAR));
  await bekle(350);
  temizle();
});

test('bozuk (ayrıştırılamayan) kayıt kilitlemez: başlangıç ilerlemesiyle sürer', async () => {
  const ls = sahteLocalStorage();
  ls.m.set(ANAHTAR, '{bozuk');
  const y = await ilerlemeYukle(async () => ({ islenen: [1] }));
  assert.deepEqual(y.islenen, [1]);
  assert.equal(kayitKilitliMi(), false);
  assert.match(ls.m.get('sanat-atlasi:hatalar') || '', /bozuk/);
  temizle();
});

test('İş 143: localStorage yazamazsa eski kopya silinmez; IndexedDB de yazamazsa kullanıcıya söylenir', async () => {
  const ls = sahteLocalStorage({ yazmaHatasi: true });
  const eski = JSON.stringify(varsayilanIlerleme([1]));
  ls.m.set(ANAHTAR, eski);
  bozukIndexedDB();
  const olaylar = olaylariTopla();
  ilerlemeKaydet(varsayilanIlerleme([1, 2, 3]));
  assert.equal(ls.m.get(ANAHTAR), eski); // son geçerli kayıt korunur
  assert.deepEqual(ls.silinen, []);
  await bekle(400);
  assert.deepEqual(olaylar, ['yazilamadi']);
  temizle();
});

test('İş 143: her kayıt artan numara alır; açılışta iki depodan numarası büyük olan okunur', async () => {
  const ls = sahteLocalStorage();
  const a = varsayilanIlerleme([1]);
  ilerlemeKaydet(a);
  const n1 = a.kayitNo;
  ilerlemeKaydet(a);
  assert.equal(a.kayitNo, n1 + 1);
  ls.m.set(ANAHTAR, JSON.stringify({ ...varsayilanIlerleme([1]), kayitNo: 5 }));
  // localStorage yeni: o okunur
  let y = await ilerlemeYukle(async () => ({ islenen: [] }), { idbOku: async () => ({ ...varsayilanIlerleme([1, 2, 3]), kayitNo: 2 }) });
  assert.deepEqual(y.islenen, [1]);
  // localStorage eski (yazamamıştı), IndexedDB yeni: yeni okunur
  y = await ilerlemeYukle(async () => ({ islenen: [] }), { idbOku: async () => ({ ...varsayilanIlerleme([1, 2, 3]), kayitNo: 9 }) });
  assert.deepEqual(y.islenen, [1, 2, 3]);
  // bir sonraki kayıt ikisinden de büyük numara alır (geri yüklenen eski yedek de)
  const yedek = { ...varsayilanIlerleme([7]), kayitNo: 1 };
  ilerlemeKaydet(yedek);
  assert.ok(yedek.kayitNo > 9);
  // eski kayıtlarda numara yok: localStorage önce (eski davranış)
  assert.equal(enYeniKayit({ islenen: [1] }, { islenen: [2] }).islenen[0], 1);
  assert.equal(enYeniKayit(null, { islenen: [2] }).islenen[0], 2);
  // yedekte numara korunur, bozuksa 0
  assert.equal(ilerlemeDogrula({ islenen: [], kayitNo: 4 }).kayitNo, 4);
  assert.equal(ilerlemeDogrula({ islenen: [], kayitNo: -2 }).kayitNo, 0);
  await bekle(350);
  temizle();
});

test('yedekte bozuk tarih ve sayaçlar düzelir (tekrar sırası bozulmaz)', () => {
  const v = ilerlemeDogrula({
    islenen: [1],
    skorlar: {
      a: { sanatci: { kutu: 2, dogru: -3, yanlis: 1.7, son: '2026-01-01', sonraki: 'yarın' } },
      b: { akim: { kutu: 1, dogru: 2, yanlis: 0, son: null, sonraki: 12345 } },
      c: { sanatci: { kutu: 3, dogru: 4, yanlis: 1, son: '2026-02-01', sonraki: '2026-02-08' } },
    },
    skorlarKonu: { k: { kutu: 1, dogru: 1, yanlis: -1, son: 'dün', sonraki: '2026-01-02' } },
  });
  assert.deepEqual(v.skorlar.a.sanatci, { kutu: 2, dogru: 0, yanlis: 1, son: '2026-01-01', sonraki: bugunStr() });
  assert.deepEqual(v.skorlar.b.akim, { kutu: 1, dogru: 2, yanlis: 0, son: null, sonraki: null });
  assert.deepEqual(v.skorlar.c.sanatci, { kutu: 3, dogru: 4, yanlis: 1, son: '2026-02-01', sonraki: '2026-02-08' });
  assert.deepEqual(v.skorlarKonu.k, { kutu: 1, dogru: 1, yanlis: 0, son: bugunStr(), sonraki: '2026-01-02' });
});

function sahteDepo({ yerKalmaz = Infinity } = {}) {
  const m = new Map();
  return {
    m,
    anahtarlar: async () => [...m.keys()],
    al: async (u) => m.get(u),
    varMi: async (u) => m.has(u),
    koy: async (u, v) => {
      if (m.size >= yerKalmaz) throw Object.assign(new Error('dolu'), { name: 'QuotaExceededError' });
      m.set(u, v);
    },
    sil: async (u) => void m.delete(u),
    temizle: async () => m.clear(),
  };
}
function sahteCaches(onbellekler) {
  globalThis.caches = {
    keys: async () => [...onbellekler.keys()],
    open: async (a) => {
      const c = onbellekler.get(a);
      return {
        keys: async () => [...c.keys()].map((url) => ({ url })),
        match: async (r) => {
          const y = c.get(r.url || r);
          if (y === 'bozuk') throw new Error('Internal error');
          return y;
        },
        delete: async (r) => c.delete(r.url || r),
      };
    },
    delete: async (a) => onbellekler.delete(a),
  };
}
const yanit = () => ({ ok: true, blob: async () => new Blob(['y'], { type: 'image/jpeg' }) });

test('eski önbellekten taşırken depo dolarsa taşınmamış görseller eski önbellekte kalır (silinmez)', async () => {
  const { eskileriTasi, depoAyarla } = await import('../../js/devasaOnbellek.js');
  sahteLocalStorage();
  const eski = new Map([1, 2, 3, 4].map((n) => [`https://r2/d/${n}.jpg`, yanit()]));
  const onbellekler = new Map([['atlas-devasa-kalici', eski]]);
  sahteCaches(onbellekler);
  const d = sahteDepo({ yerKalmaz: 1 });
  depoAyarla(d);
  await eskileriTasi();
  assert.equal(d.m.size, 1);
  assert.ok(onbellekler.has('atlas-devasa-kalici'), 'önbellek silinmemeli');
  assert.equal(eski.size, 3, 'taşınmamış üç görsel durmalı');
  assert.match(globalThis.localStorage.m.get('sanat-atlasi:hatalar') || '', /kalanlar eski önbellekte/);
  // yer açılınca sonraki açılışta kalanlar taşınır, önbellek silinir
  d.koy = async (u, v) => void d.m.set(u, v);
  depoAyarla(d);
  await eskileriTasi();
  assert.equal(d.m.size, 4);
  assert.equal(onbellekler.has('atlas-devasa-kalici'), false);
  delete globalThis.caches;
  delete globalThis.localStorage;
  depoAyarla(null);
});

test('eski önbellekte tek görsel okunamazsa yalnız o atlanır; ötekiler taşınır', async () => {
  const { eskileriTasi, depoAyarla } = await import('../../js/devasaOnbellek.js');
  sahteLocalStorage();
  const eski = new Map([
    ['https://r2/d/1.jpg', yanit()],
    ['https://r2/d/2.jpg', 'bozuk'],
    ['https://r2/d/3.jpg', yanit()],
  ]);
  const onbellekler = new Map([['atlas-devasa-kalici-1', eski]]);
  sahteCaches(onbellekler);
  const d = sahteDepo();
  depoAyarla(d);
  await eskileriTasi();
  assert.deepEqual([...d.m.keys()].sort(), ['https://r2/d/1.jpg', 'https://r2/d/3.jpg']);
  assert.equal(onbellekler.size, 0);
  assert.match(globalThis.localStorage.m.get('sanat-atlasi:hatalar') || '', /1 görsel okunamadı/);
  delete globalThis.caches;
  delete globalThis.localStorage;
  depoAyarla(null);
});

test('indirme defteri 400’lükleri de tanır (önceden null yazılıyordu)', async () => {
  const { defterAdi } = await import('../../js/devasaOnbellek.js');
  const ad = '0123456789abcdef';
  assert.equal(defterAdi(`https://x.github.io/sanat-atlasi/gorseller/k/${ad}.jpg`), `k:${ad}`);
  assert.equal(defterAdi(`https://gorsel.noracloud.ai/b/${ad}.jpg`), `b:${ad}`);
  assert.equal(defterAdi(`https://gorsel.noracloud.ai/d/${ad}.jpg`), ad);
  assert.equal(new Set([`k:${ad}`, `b:${ad}`, ad]).size, 3);
});

test('İş 143: sanatçının yaşamıyla çelişen yıl şüpheli sayılır (gösterilmez)', async () => {
  const { yilSupheliMi } = await import('../../js/eserler.js');
  const s = { dogum: 1395, olum: 1455 };
  assert.equal(yilSupheliMi(1500, s), true); // "15. yüzyıl" → 1500
  assert.equal(yilSupheliMi(1440, s), false);
  assert.equal(yilSupheliMi(1457, s), false); // ölümden hemen sonra bitirilen
  assert.equal(yilSupheliMi(1400, s), true); // 5 yaşında
  assert.equal(yilSupheliMi(null, s), false);
  assert.equal(yilSupheliMi(1440, { dogum: null, olum: 1416 }), true);
  assert.equal(yilSupheliMi(1600, {}), false); // yaşam bilinmiyor: dokunulmaz
});
