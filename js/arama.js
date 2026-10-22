// Genel arama (K1): sanatçılar, eserler, konular ve başyapıtlar tek dizinde. Saf fonksiyonlar (birim testli).
// Türkçe karakterler ve aksanlar normalleştirilir (ç→c, ı→i, é→e); eserlerde hem Türkçe hem özgün ad aranır.
// Bkz. KARARLAR.md "İş 19".

const TR = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };

export function normallestir(s) {
  return String(s || '')
    .toLocaleLowerCase('tr')
    .replace(/[çğıöşüâîû]/g, (h) => TR[h])
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export const GRUPLAR = [
  ['sanatci', 'Sanatçılar'],
  ['eser', 'Eserler'],
  ['konu', 'Konular'],
  ['basyapit', 'Başyapıtlar'],
];

/**
 * Dizin kaydı: { tur, id, metin (normalleştirilmiş, aranan), agirlik, veri }
 * sanatcilar: [{ id, ad, akim, ... }]; eserler: [{ e, s }] (e: eser, s: sanatçı); konular: [{ id, ad, ozgun, ozet }];
 * basyapitlar: [{ anahtar, baslik, ozgun, sanatci }]; adlar: { id: { buyuk, kucuk } } (kısa adlar)
 */
export function dizinKur({ sanatcilar = [], eserler = [], konular = [], basyapitlar = [], adlar = {} }) {
  const dizin = [];
  for (const s of sanatcilar) {
    // kısa ad kaydı { buyuk, kucuk } (data/kisa_adlar.json)
    const k = adlar[s.id];
    const kisa = k && typeof k === 'object' ? [k.buyuk, k.kucuk] : [k];
    dizin.push({ tur: 'sanatci', id: s.id, metin: normallestir([s.ad, ...kisa, s.ad_arama].filter(Boolean).join(' ')), agirlik: 0, veri: s });
  }
  for (const { e, s } of eserler)
    dizin.push({
      tur: 'eser',
      id: `${s.id}|${e.anahtar}`,
      metin: normallestir([e.ad, e.baslik].filter(Boolean).join(' ')),
      // bilinen eser önce (site bağlantısı sayısı)
      agirlik: e.sl || 0,
      veri: { e, s },
    });
  for (const k of konular)
    dizin.push({ tur: 'konu', id: k.id, metin: normallestir([k.ad, k.ozgun].filter(Boolean).join(' ')), agirlik: (k.eserler || []).length, veri: k });
  for (const b of basyapitlar)
    dizin.push({ tur: 'basyapit', id: b.anahtar, metin: normallestir([b.baslik, b.ozgun].filter(Boolean).join(' ')), agirlik: 0, veri: b });
  return dizin;
}

// Kaydın sorguya uyma puanı: her sorgu kelimesi metinde geçmeli; kelime başında geçen daha iyi.
// 0 → uymaz. Tam eşleşme > hepsi kelime başı > içinde.
export function puan(metin, kelimeler) {
  if (!kelimeler.length) return 0;
  const parcalar = metin.split(' ');
  let p = 0;
  for (const k of kelimeler) {
    if (parcalar.includes(k)) p += 3;
    else if (parcalar.some((x) => x.startsWith(k))) p += 2;
    else if (k.length >= 3 && metin.includes(k)) p += 1;
    else return 0;
  }
  if (metin === kelimeler.join(' ')) p += 5;
  else if (metin.startsWith(kelimeler.join(' '))) p += 2;
  return p;
}

/**
 * Sorgu sonucu: { sanatci: [...], eser: [...], konu: [...], basyapit: [...] } (her biri dizin kaydı), toplam
 * enFazla: grup başına; sorgu 2 harften kısaysa boş.
 */
export function ara(dizin, sorgu, { enFazla = 8 } = {}) {
  const kelimeler = normallestir(sorgu).split(' ').filter(Boolean);
  const sonuc = { sanatci: [], eser: [], konu: [], basyapit: [], toplam: 0, sayilar: { sanatci: 0, eser: 0, konu: 0, basyapit: 0 } };
  if (kelimeler.join('').length < 2) return sonuc;
  const bulunan = [];
  for (const x of dizin) {
    const p = puan(x.metin, kelimeler);
    if (p) bulunan.push({ x, p });
  }
  bulunan.sort((a, b) => b.p - a.p || b.x.agirlik - a.x.agirlik || a.x.metin.localeCompare(b.x.metin));
  for (const { x } of bulunan) {
    sonuc.sayilar[x.tur]++;
    if (sonuc[x.tur].length < enFazla) sonuc[x.tur].push(x);
  }
  sonuc.toplam = bulunan.length;
  return sonuc;
}
