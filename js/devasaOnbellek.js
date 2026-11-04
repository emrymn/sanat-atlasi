// İş 124 (Emre: "yine çöküyor, indirmeyi parçalara böl"; "tek indirirken daha hızlı çöktü"): telefona indirilen en büyük
// kopyalar tek bir önbellekte değil, parça parça önbelleklerde durur (atlas-devasa-kalici-<parça>; eski sürümlerin indirdikleri
// atlas-devasa-kalici'de kalır, onlar da okunur). Görüntüleyici (sw.js) ve keskinleştirme (keskin.js) hepsine bakar.
import { hataEkle } from './hataGunlugu.js';

export const KALICI_ON = 'atlas-devasa-kalici';
export const PARCA = 200; // bir parçadaki görsel (~0,8 GB); parça bitince uygulama dinlenir (Ayarlar açıksa yenilenir)

const var_ = () => typeof caches !== 'undefined';

// telefondaki bütün en büyük kopya önbelleklerinin adları
export async function kaliciAdlari() {
  if (!var_()) return [];
  try {
    return (await caches.keys()).filter((a) => a === KALICI_ON || a.startsWith(`${KALICI_ON}-`));
  } catch (e) {
    hataEkle({ m: `Önbellek adları okunamadı: ${(e && e.message) || e}`, k: 'devasaOnbellek', a: globalThis.location?.hash || '' });
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

// telefondaki bütün en büyük kopyaların adresleri; gecerli verilirse listede olmayanlar silinir (kopya, çıkarılan, eski
// sürüm). İş 127 (Emre: "her seferinde baştan indiriyor"): liste bir sebeple yanlış hesaplanırsa temizlik inenlerin hepsini
// silebilirdi: listede olmayanlar telefondakilerin %20'sinden fazlaysa hiçbiri silinmez (sonuç: { adresler, silinen, korundu })
export async function kaliciAdresler(gecerli = null) {
  const adresler = new Set();
  const disarida = [];
  for (const a of await kaliciAdlari()) {
    try {
      const c = await caches.open(a);
      for (const r of await c.keys()) {
        if (!gecerli || !gecerli.size || gecerli.has(r.url)) adresler.add(r.url);
        else disarida.push([c, r]);
      }
    } catch (e) {
      hataEkle({ m: `${a} okunamadı: ${(e && e.message) || e}`, k: 'devasaOnbellek', a: globalThis.location?.hash || '' });
    }
  }
  const toplam = adresler.size + disarida.length;
  const korundu = disarida.length > Math.max(20, toplam * 0.2);
  if (!korundu) for (const [c, r] of disarida) await c.delete(r).catch(() => {});
  return { adresler, silinen: korundu ? 0 : disarida.length, korundu: korundu ? disarida.length : 0 };
}

export async function kaliciSil() {
  for (const a of await kaliciAdlari()) await caches.delete(a).catch(() => {});
}

// İş 128 (Emre: "üstteki yazıda da sıfırlıyor"): inenlerin kendi defteri (localStorage; yalnız adlar). Önbellek telefonda
// okunamaz ya da eksik okunursa indirme baştan başlamasın: defterdekiler birkaç örnekle doğrulanır, tutuyorsa inmiş sayılır.
const DEFTER = 'sanat-atlasi:devasa-inen';
const adOf = (u) => (String(u).match(/\/d\/([0-9a-f]{12,}(?:-[0-9a-f]{4,16})?)\.jpg/) || [])[1];
export function defterOku() {
  try {
    const l = JSON.parse(globalThis.localStorage.getItem(DEFTER) || '[]');
    return new Set(Array.isArray(l) ? l : []);
  } catch {
    return new Set();
  }
}
export function defterYaz(adlar) {
  try {
    globalThis.localStorage.setItem(DEFTER, JSON.stringify([...adlar]));
  } catch {
    /* depo dolu ya da kapalı */
  }
}
export function defterSil() {
  try {
    globalThis.localStorage.removeItem(DEFTER);
  } catch {
    /* depo kapalı */
  }
}
export const defterAdi = adOf;

// telefondakiler: önbellekte sayılanlar + defterde olup sayılmayanlar (örnekle doğrulanırsa). Dönen: adres kümesi
export async function telefondaOlanlar(gecerli) {
  const s = await kaliciAdresler(gecerli);
  const defter = defterOku();
  const sayilan = new Set([...s.adresler].map(adOf));
  const eksik = (gecerli ? [...gecerli] : []).filter((u) => defter.has(adOf(u)) && !s.adresler.has(u));
  let ek = 0;
  if (eksik.length) {
    // en çok 12 örnek: çoğu bulunursa sayım eksik demektir (önbellek okunamadı), defter doğru
    const ornek = eksik.filter((_, i) => i % Math.max(1, Math.floor(eksik.length / 12)) === 0).slice(0, 12);
    let bulunan = 0;
    for (const u of ornek) if (await kalicidaMi(u)) bulunan++;
    if (bulunan >= ornek.length * 0.75) {
      for (const u of eksik) s.adresler.add(u);
      ek = eksik.length;
      hataEkle({ m: `Önbellek sayımı eksik: ${sayilan.size} sayıldı, defterde ${eksik.length} daha var (örnek ${bulunan}/${ornek.length} bulundu)`, k: 'devasaOnbellek', a: globalThis.location?.hash || '' });
    } else {
      hataEkle({ m: `İnen en büyük kopyalar telefondan silinmiş: defterde ${eksik.length}, örnek ${bulunan}/${ornek.length} bulundu`, k: 'devasaOnbellek', a: globalThis.location?.hash || '' });
      for (const u of eksik) defter.delete(adOf(u));
    }
  }
  for (const u of s.adresler) defter.add(adOf(u));
  defterYaz(defter);
  return { ...s, ek };
}
