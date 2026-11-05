// İş 129 (Emre'nin iPhone'u, 1.64.3: "Önbelleğe yazılamadı: TypeError", "atlas-devasa-kalici okunamadı: Internal error",
// ardından "WebKit encountered an internal error"): iPhone'da bu uygulamanın Cache Storage'ı bozuldu; en büyük kopyalar
// artık önbelleğe (caches) değil IndexedDB'ye (atlas-devasa · g; anahtar adres, değer Blob) yazılır. Görüntüleyici
// (sw.js) ve keskinleştirme (keskin.js) buradan okur. Eski önbellekler (atlas-devasa-kalici, -1, -2 …) okunabiliyorsa
// tek tek buraya taşınır, okunamıyorsa silinir (içleri zaten okunamıyor; yer açılır). Taşırken depoya yazılamazsa
// taşınmamışlar eski önbellekte kalır (İş 135).
import { hataEkle } from './hataGunlugu.js';

export const KALICI_ON = 'atlas-devasa-kalici';
export const PARCA = 200; // bir parçadaki görsel (~0,8 GB); parça bitince uygulama dinlenir (Ayarlar açıksa yenilenir)
export const DEPO_DB = 'atlas-devasa';
export const DEPO_AD = 'g';

const yaz_ = (m) => hataEkle({ m, k: 'devasaOnbellek', a: globalThis.location?.hash || '' });
const mesajOf = (e) => (e && (e.name && e.name !== 'Error' ? `${e.name}: ${e.message}` : e.message)) || String(e);

// ---------- IndexedDB deposu (testlerde depoAyarla ile sahtesi verilir) ----------
let dbSozu = null;
function dbAc() {
  if (dbSozu) return dbSozu;
  dbSozu = new Promise((coz, reddet) => {
    if (typeof indexedDB === 'undefined') return reddet(new Error('IndexedDB yok'));
    const r = indexedDB.open(DEPO_DB, 1);
    r.onupgradeneeded = () => {
      if (!r.result.objectStoreNames.contains(DEPO_AD)) r.result.createObjectStore(DEPO_AD);
    };
    r.onsuccess = () => {
      r.result.onversionchange = () => (r.result.close(), (dbSozu = null));
      coz(r.result);
    };
    r.onerror = () => reddet(r.error);
    r.onblocked = () => reddet(new Error('IndexedDB kilitli'));
  });
  dbSozu.catch(() => (dbSozu = null));
  return dbSozu;
}
function islem(kip, fn) {
  return dbAc().then(
    (db) =>
      new Promise((coz, reddet) => {
        const tx = db.transaction(DEPO_AD, kip);
        const r = fn(tx.objectStore(DEPO_AD));
        tx.oncomplete = () => coz(r && 'result' in r ? r.result : undefined);
        tx.onerror = () => reddet(tx.error);
        tx.onabort = () => reddet(tx.error || new Error('İşlem iptal edildi'));
      }),
  );
}
const idbDepo = {
  anahtarlar: () => islem('readonly', (s) => s.getAllKeys()).then((l) => (l || []).map(String)),
  al: (u) => islem('readonly', (s) => s.get(u)),
  varMi: (u) => islem('readonly', (s) => s.count(u)).then((n) => n > 0),
  koy: (u, v) => islem('readwrite', (s) => s.put(v, u)),
  sil: (u) => islem('readwrite', (s) => s.delete(u)),
  temizle: () => islem('readwrite', (s) => s.clear()),
};
let depo = idbDepo;
export function depoAyarla(d) {
  depo = d || idbDepo;
  tasindi = null;
}

// Blob saklanamazsa (eski WebKit hatası) ArrayBuffer olarak saklanır; okurken ikisi de görsel olur
export async function kaliciYaz(url, blob) {
  try {
    await depo.koy(url, blob);
  } catch (e) {
    if (e && e.name === 'QuotaExceededError') throw e;
    await depo.koy(url, { b: await blob.arrayBuffer(), t: blob.type || 'image/jpeg' });
  }
}
export async function kaliciOku(url) {
  const v = await depo.al(url).catch(() => undefined);
  if (!v) return null;
  return v instanceof Blob ? v : v.b ? new Blob([v.b], { type: v.t || 'image/jpeg' }) : null;
}

// ---------- eski önbelleklerden taşıma (bir kez, sayfa açılışında) ----------
const var_ = () => typeof caches !== 'undefined';
export async function kaliciAdlari() {
  if (!var_()) return [];
  try {
    return (await caches.keys()).filter((a) => a === KALICI_ON || a.startsWith(`${KALICI_ON}-`));
  } catch (e) {
    yaz_(`Önbellek adları okunamadı: ${mesajOf(e)}`);
    return [];
  }
}
let tasindi = null;
export function eskileriTasi() {
  tasindi ||= (async () => {
    let tasinan = 0;
    for (const a of await kaliciAdlari()) {
      let c;
      let istekler;
      try {
        c = await caches.open(a);
        istekler = await c.keys();
      } catch (e) {
        yaz_(`${a} okunamadı (${mesajOf(e)}): siliniyor, indirmeler artık IndexedDB'ye`);
        await caches.delete(a).catch((e2) => yaz_(`${a} silinemedi: ${mesajOf(e2)}`));
        continue;
      }
      // Bir görsel okunamazsa yalnız o silinir (içi zaten okunamıyor). Depoya yazılamazsa (yer yok, depo hatası) taşıma
      // durur ve taşınmamışlar eski önbellekte kalır: bir sonraki açılışta yeniden denenir (önceden önbelleğin tamamı
      // silinirdi; taşınabilecek görseller de giderdi)
      let okunamayan = 0;
      try {
        for (const r of istekler) {
          if (!(await depo.varMi(r.url))) {
            let blob = null;
            try {
              const y = await c.match(r);
              if (y && y.ok) blob = await y.blob();
            } catch (e) {
              okunamayan++;
            }
            if (blob) {
              await kaliciYaz(r.url, blob);
              tasinan++;
            }
          }
          await c.delete(r);
        }
        await caches.delete(a);
      } catch (e) {
        yaz_(`${a} taşınamadı (${tasinan} taşındı; kalanlar eski önbellekte duruyor, sonra yeniden denenecek): ${mesajOf(e)}`);
      }
      if (okunamayan) yaz_(`${a}: ${okunamayan} görsel okunamadı, silindi`);
    }
    if (tasinan) yaz_(`Eski önbellekten ${tasinan} en büyük kopya IndexedDB'ye taşındı`);
  })().catch((e) => yaz_(`Eski önbellekler taşınamadı: ${mesajOf(e)}`));
  return tasindi;
}

// adres telefonda mı
export async function kalicidaMi(url) {
  try {
    return await depo.varMi(url);
  } catch {
    return false;
  }
}

// telefondaki bütün en büyük kopyaların adresleri; gecerli verilirse listede olmayanlar silinir (kopya, çıkarılan, eski
// sürüm). İş 127: listede olmayanlar telefondakilerin %20'sinden fazlaysa (liste yanlış hesaplanmış olabilir) hiçbiri
// silinmez (sonuç: { adresler, silinen, korundu, okunamadi })
export async function kaliciAdresler(gecerli = null, { sil = true } = {}) {
  await eskileriTasi();
  const adresler = new Set();
  const disarida = [];
  let okunamadi = false;
  try {
    for (const u of await depo.anahtarlar()) {
      if (!gecerli || !gecerli.size || gecerli.has(u)) adresler.add(u);
      else disarida.push(u);
    }
  } catch (e) {
    okunamadi = true;
    yaz_(`İnen en büyük kopyalar okunamadı: ${mesajOf(e)}`);
  }
  const toplam = adresler.size + disarida.length;
  const korundu = disarida.length > Math.max(20, toplam * 0.2);
  if (!korundu && sil) for (const u of disarida) await depo.sil(u).catch(() => {});
  return { adresler, silinen: korundu || !sil ? 0 : disarida.length, korundu: korundu ? disarida.length : 0, okunamadi };
}

export async function kaliciSil() {
  for (const a of await kaliciAdlari()) await caches.delete(a).catch(() => {});
  await depo.temizle().catch((e) => yaz_(`İnenler silinemedi: ${mesajOf(e)}`));
}

// İş 128: inenlerin kendi defteri (localStorage; yalnız adlar). Depo okunamaz ya da eksik okunursa indirme baştan
// başlamasın: defterdekiler birkaç örnekle doğrulanır, tutuyorsa inmiş sayılır.
const DEFTER = 'sanat-atlasi:devasa-inen';
// en büyük kopyalar yalnız adla (eski defterlerle aynı), 1280'likler (İş 130) "b:", 400'lükler (İş 131) "k:" önekiyle
// (İş 135: 400'lükler önceden tanınmıyor, deftere null yazılıyordu)
const adOf = (u) => {
  const m = String(u).match(/\/([dbk])\/([0-9a-f]{12,}(?:-[0-9a-f]{4,16})?)\.jpg/);
  return m ? (m[1] === 'd' ? m[2] : `${m[1]}:${m[2]}`) : undefined;
};
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

// telefondakiler: depoda sayılanlar + defterde olup sayılmayanlar (örnekle doğrulanırsa). Dönen: adres kümesi
// sil: false iken listede olmayanlar silinmez (liste eksik hesaplandıysa: gösterilen görseller bilinmiyor)
export async function telefondaOlanlar(gecerli, { sil = true } = {}) {
  const s = await kaliciAdresler(gecerli, { sil });
  const defter = defterOku();
  const sayilan = new Set([...s.adresler].map(adOf));
  const eksik = (gecerli ? [...gecerli] : []).filter((u) => defter.has(adOf(u)) && !s.adresler.has(u));
  let ek = 0;
  if (eksik.length) {
    // en çok 12 örnek: çoğu bulunursa sayım eksik demektir (depo okunamadı), defter doğru
    const ornek = eksik.filter((_, i) => i % Math.max(1, Math.floor(eksik.length / 12)) === 0).slice(0, 12);
    let bulunan = 0;
    for (const u of ornek) if (await kalicidaMi(u)) bulunan++;
    if (bulunan >= ornek.length * 0.75) {
      for (const u of eksik) s.adresler.add(u);
      ek = eksik.length;
      yaz_(`Sayım eksik: ${sayilan.size} sayıldı, defterde ${eksik.length} daha var (örnek ${bulunan}/${ornek.length} bulundu)`);
    } else if (!s.okunamadi) {
      // eski önbelleklerdekiler (okunamadığı için silinenler) ya da gerçekten silinmişler: defter düzelir
      yaz_(`İnen en büyük kopyalar telefonda yok: defterde ${eksik.length}, örnek ${bulunan}/${ornek.length} bulundu`);
      for (const u of eksik) defter.delete(adOf(u));
    }
  }
  for (const u of s.adresler) defter.add(adOf(u));
  defterYaz(defter);
  return { ...s, ek };
}

// İş 129: depo durumu hata günlüğüne (telefonda kota mı, bozulma mı ayırt etmek için)
export async function depoDurumu() {
  try {
    const t = await globalThis.navigator?.storage?.estimate?.();
    if (!t) return '';
    const gb = (x) => (x / 1024 ** 3).toFixed(1).replace('.', ',');
    return `kullanılan ${gb(t.usage || 0)} GB / izin ${gb(t.quota || 0)} GB`;
  } catch {
    return '';
  }
}
