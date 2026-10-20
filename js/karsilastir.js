// Yan yana karşılaştırma ve ek notlar için saf yardımcılar (DOM'a dokunmaz; birim testleri tests/unit/karsilastir.test.mjs).

// "Nasıl tanırım?" metni: sanatçının kendi notu, yoksa data/tanima_notlari.json'daki not
export function taninmaMetni(s, tanimaNotlari = {}) {
  if (!s) return '';
  return s.taninma || tanimaNotlari[s.id] || '';
}

// Eser notu: önce QID, yoksa "<sanatciId>|<eser başlığı>"
export function eserNotu(sanatciId, eser, eserNotlari = {}) {
  if (!eser) return '';
  return (eser.qid && eserNotlari[eser.qid]) || eserNotlari[`${sanatciId}|${eser.baslik}`] || '';
}

// Veri dosyasının "notlar" alanını güvenle okur (dosya yok / bozuk → {})
export function notlariAl(json) {
  const n = json && typeof json === 'object' ? json.notlar : null;
  if (!n || typeof n !== 'object' || Array.isArray(n)) return {};
  const sonuc = {};
  for (const [k, v] of Object.entries(n)) if (typeof v === 'string' && v.trim()) sonuc[k] = v.trim();
  return sonuc;
}

export function karsilastirmaAdresi(a, b) {
  return `#/karsilastir/${encodeURIComponent(a)}/${encodeURIComponent(b)}`;
}

// "#/karsilastir/a/b" → ['a', 'b']; geçersizse null
export function karsilastirmaRotasi(hash) {
  const m = /^#\/karsilastir\/([^/]+)\/([^/]+)$/.exec(hash || '');
  if (!m) return null;
  try {
    const a = decodeURIComponent(m[1]);
    const b = decodeURIComponent(m[2]);
    return a && b && a !== b ? [a, b] : null;
  } catch {
    return null;
  }
}

function yil(s) {
  return s.dogum ?? s.olum ?? null;
}

// Karşılaştırılabilecek benzer sanatçılar: aynı ya da komşu akım, doğum yılı farkı ≤ 50.
// Önce aynı akım, sonra yaşça en yakınlar; en çok `adet` kişi.
export function benzerSanatcilar(s, sanatcilar, akimlar, adet = 8) {
  if (!s) return [];
  const komsu = new Set(((akimlar.find((a) => a.ad === s.akim) || {}).komsular || []).concat(s.akim));
  const y = yil(s);
  return sanatcilar
    .filter((x) => x.id !== s.id && komsu.has(x.akim))
    .filter((x) => y === null || yil(x) === null || Math.abs(yil(x) - y) <= 50)
    .map((x) => ({ x, ayni: x.akim === s.akim ? 0 : 1, fark: y === null || yil(x) === null ? 999 : Math.abs(yil(x) - y) }))
    .sort((a, b) => a.ayni - b.ayni || a.fark - b.fark || a.x.ad.localeCompare(b.x.ad, 'tr'))
    .slice(0, adet)
    .map((o) => o.x);
}
