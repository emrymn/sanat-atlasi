// Küçük IndexedDB sarmalayıcısı. IndexedDB yoksa (ör. özel tarama) sessizce başarısız olur.
const DB_ADI = 'sanat-atlasi';
// 2: resim paletleri (js/renk.js)
const DB_SURUM = 2;
export const DEPOLAR = ['eserler', 'ilerleme', 'palet'];

let dbSozu = null;

function ac() {
  if (dbSozu) return dbSozu;
  dbSozu = new Promise((coz, reddet) => {
    if (typeof indexedDB === 'undefined') return reddet(new Error('IndexedDB yok'));
    const istek = indexedDB.open(DB_ADI, DB_SURUM);
    istek.onupgradeneeded = () => {
      const db = istek.result;
      for (const d of DEPOLAR) if (!db.objectStoreNames.contains(d)) db.createObjectStore(d);
    };
    istek.onsuccess = () => coz(istek.result);
    istek.onerror = () => reddet(istek.error);
  });
  dbSozu.catch(() => (dbSozu = null));
  return dbSozu;
}

function islem(depo, kip, fn) {
  return ac().then(
    (db) =>
      new Promise((coz, reddet) => {
        const tx = db.transaction(depo, kip);
        const sonuc = fn(tx.objectStore(depo));
        tx.oncomplete = () => coz(sonuc && 'result' in sonuc ? sonuc.result : undefined);
        tx.onerror = () => reddet(tx.error);
        tx.onabort = () => reddet(tx.error);
      }),
  );
}

export function idbAl(depo, anahtar) {
  return islem(depo, 'readonly', (s) => s.get(anahtar)).catch(() => undefined);
}

export function idbKoy(depo, anahtar, deger) {
  return islem(depo, 'readwrite', (s) => s.put(deger, anahtar)).catch(() => undefined);
}

export function idbTemizle(depo) {
  return islem(depo, 'readwrite', (s) => s.clear()).catch(() => undefined);
}
