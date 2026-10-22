// Akım kimlik kartı ve akım karşılaştırması (K3). Saf fonksiyonlar (birim testli). Bkz. KARARLAR.md "İş 19".
import { hexten, hexe } from './renk.js';

// Akımın ortalama paleti: eserlerin paletleri birleştirilir, birbirine yakın renkler tek renkte toplanır.
// paletler: [[{ renk: '#rrggbb', pay }], …] (her eser kendi içinde pay toplamı ~1); dönen: en ağır `adet` renk
export function paletBirlestir(paletler, { adet = 6, esik = 38 } = {}) {
  const l = paletler.filter((p) => Array.isArray(p) && p.length);
  if (!l.length) return [];
  const kume = [];
  for (const p of l)
    for (const { renk, pay } of p) {
      const c = hexten(renk);
      const w = (pay || 0) / l.length;
      const yakin = kume.find((k) => Math.hypot(k.c[0] - c[0], k.c[1] - c[1], k.c[2] - c[2]) < esik);
      if (yakin) {
        const t = yakin.w + w;
        yakin.c = yakin.c.map((x, i) => (x * yakin.w + c[i] * w) / (t || 1));
        yakin.w = t;
      } else kume.push({ c, w });
    }
  const secilen = kume.sort((a, b) => b.w - a.w).slice(0, adet);
  const toplam = secilen.reduce((t, k) => t + k.w, 0) || 1;
  return secilen.map((k) => ({ renk: hexe(k.c.map(Math.round)), pay: k.w / toplam }));
}

// Akımın tipik konuları: ikonografi konularında akımın sanatçılarına ait eser sayısı (çok olan önce)
export function tipikKonular(konular, uyeIdler, adet = 4) {
  const uye = new Set(uyeIdler);
  return konular
    .map((k) => ({ id: k.id, ad: k.ad, n: (k.eserler || []).filter(([, sid]) => uye.has(sid)).length }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n || a.ad.localeCompare(b.ad, 'tr'))
    .slice(0, adet);
}

// En bilinen eserler: her sanatçıdan en çok bir (çeşitlilik), sonra bilinirliğe (sl) göre; en çok `adet`
// listeler: [{ s, eserler }]
export function enBilinenEserler(listeler, adet = 4) {
  const ilk = [];
  for (const { s, eserler } of listeler) {
    const e = (eserler || []).filter((x) => x.gorseller && x.gorseller.length).sort((a, b) => (b.sl || 0) - (a.sl || 0))[0];
    if (e) ilk.push({ s, e });
  }
  return ilk.sort((a, b) => (b.e.sl || 0) - (a.e.sl || 0)).slice(0, adet);
}

// Akım karşılaştırma adresi (sıra korunur: soru sorulan akım solda)
export function akimKarsilastirmaAdresi(a, b) {
  return `#/akim-karsilastir/${encodeURIComponent(a)}/${encodeURIComponent(b)}`;
}

// Bir akımın karşılaştırılmaya en uygun komşuları (akimlar.json komsular sırasıyla, görünür olanlar)
export function karsilastirmaKomsulari(akim, akimlar) {
  const a = akimlar.find((x) => x.ad === akim);
  const gorunur = new Set(akimlar.map((x) => x.ad));
  return ((a && a.komsular) || []).filter((x) => gorunur.has(x) && x !== akim);
}
