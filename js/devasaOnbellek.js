// İş 124 (Emre: "yine çöküyor, indirmeyi parçalara böl"; "tek indirirken daha hızlı çöktü"): telefona indirilen en büyük
// kopyalar tek bir önbellekte değil, parça parça önbelleklerde durur (atlas-devasa-kalici-<parça>; eski sürümlerin indirdikleri
// atlas-devasa-kalici'de kalır, onlar da okunur). Görüntüleyici (sw.js) ve keskinleştirme (keskin.js) hepsine bakar.
export const KALICI_ON = 'atlas-devasa-kalici';
export const PARCA = 100; // bir parçadaki görsel; parça bitince uygulama dinlenir (Ayarlar açıksa yenilenir)

const var_ = () => typeof caches !== 'undefined';

// telefondaki bütün en büyük kopya önbelleklerinin adları
export async function kaliciAdlari() {
  if (!var_()) return [];
  try {
    return (await caches.keys()).filter((a) => a === KALICI_ON || a.startsWith(`${KALICI_ON}-`));
  } catch {
    return [];
  }
}

export const parcaAdi = (n) => `${KALICI_ON}-${n}`;

// adres telefonda mı (herhangi bir parçada)
export async function kalicidaMi(url) {
  for (const a of await kaliciAdlari()) {
    try {
      if (await (await caches.open(a)).match(url)) return true;
    } catch {
      /* okunamadı */
    }
  }
  return false;
}

// telefondaki bütün en büyük kopyaların adresleri; gecerli verilirse listede olmayanlar silinir (kopya, çıkarılan, eski sürüm)
export async function kaliciAdresler(gecerli = null) {
  const var2 = new Set();
  for (const a of await kaliciAdlari()) {
    try {
      const c = await caches.open(a);
      for (const r of await c.keys()) {
        if (!gecerli || !gecerli.size || gecerli.has(r.url)) var2.add(r.url);
        else await c.delete(r).catch(() => {});
      }
    } catch {
      /* okunamadı */
    }
  }
  return var2;
}

export async function kaliciSil() {
  for (const a of await kaliciAdlari()) await caches.delete(a).catch(() => {});
}
