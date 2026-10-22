// Ters soru (Ö1): sanatçının adı verilir, dört küçük eserden hangisinin onun olduğu sorulur.
// Yanlış eserler çeldirici seçicinin (js/celdirici.js) seçtiği sanatçılardan gelir; mümkünse doğru eserle
// aynı konuyu (ikonografi) işleyen eserler seçilir ki konu ipucu vermesin. Saf fonksiyonlar (birim testli).
import { karistir } from './yardimci.js';
import { pekistirmeHavuzu } from './eserler.js';

// Karışık kipte kartların yaklaşık dörtte biri, yalnızca Orta ve Zor seviyedeki dönemlerde
export const TERS_ORANI = 0.25;

export function tersSorulurMu({ kip, seviye, rng = Math.random, oran }) {
  return kip === 'karisik' && (seviye ?? 0) >= 1 && rng() < (oran ?? TERS_ORANI);
}

/**
 * dogru: { id, eser } (kartın sorulan eseri)
 * celdiriciler: [{ id, eserler }] öncelik sırasıyla (eseri olmayan atlanır)
 * konusu(e): eserin ikonografi konusu { id, ad } ya da null
 * Dönen: karıştırılmış 4 seçenek [{ id, eser }] ya da üç çeldirici eser bulunamazsa null
 */
export function tersSecenekleri({ dogru, celdiriciler, rng = Math.random, kotuler = {}, konusu = () => null }) {
  if (!dogru || !dogru.eser) return null;
  const konu = konusu(dogru.eser);
  const secilen = [];
  const goruldu = new Set([dogru.id]);
  for (const c of celdiriciler) {
    if (secilen.length === 3) break;
    if (!c || goruldu.has(c.id)) continue;
    const havuz = pekistirmeHavuzu(c.eserler || [], kotuler);
    if (!havuz.length) continue;
    goruldu.add(c.id);
    const ayniKonu = konu ? havuz.filter((e) => (konusu(e) || {}).id === konu.id) : [];
    const liste = ayniKonu.length ? ayniKonu : havuz;
    secilen.push({ id: c.id, eser: liste[Math.floor(rng() * liste.length)] });
  }
  if (secilen.length < 3) return null;
  return karistir([{ id: dogru.id, eser: dogru.eser }, ...secilen], rng);
}
