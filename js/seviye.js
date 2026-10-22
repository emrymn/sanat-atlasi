// Seviyeler: her sanatçı Kolay'dan başlar; o seviyedeki son cevaplarında %80 başarı olmadan bir üst seviyeye geçmez.
// Seviye sorunun zorluğunu belirler: hangi eser sorulur (js/eserler.js zorlukDilimi) ve yanlış şıklar ne kadar
// benzer (js/celdirici.js). Yalnızca sanatçı sorusu sayılır. Bkz. KARARLAR.md "İş 12".

export const SEVIYELER = [
  { no: 0, anahtar: 'kolay', ad: 'Kolay', aciklama: 'Tanınmış, tipik eserler; şıklar uzak dönemlerden' },
  { no: 1, anahtar: 'orta', ad: 'Orta', aciklama: 'Her türden eser; şıklar komşu akımlardan' },
  { no: 2, anahtar: 'zor', ad: 'Zor', aciklama: 'Az bilinen eserler; şıklar aynı akımdan' },
];
export const GECIS_ORANI = 0.8;
export const PENCERE = 10; // son kaç cevaba bakılır
export const EN_AZ = 5; // geçiş için o seviyede en az bu kadar cevap

export const seviyeBul = (anahtarYaNo) => SEVIYELER.find((x) => x.anahtar === anahtarYaNo || x.no === anahtarYaNo) || SEVIYELER[0];

// { s: 0–2, son: [1, 0, …] (bu seviyedeki son cevaplar, en yeni sonda) }
export function seviyeKaydi(ilerleme, id) {
  const k = ilerleme && ilerleme.seviyeler && ilerleme.seviyeler[id];
  return k ? { s: k.s, son: k.son.slice() } : { s: 0, son: [] };
}

export function oran(son) {
  return son.length ? son.filter(Boolean).length / son.length : 0;
}

// Ustalık: Zor'da da geçiş ölçütünü sağlamak
export function ustaMi(k) {
  return k.s === 2 && k.son.length >= EN_AZ && oran(k.son) >= GECIS_ORANI;
}

// Sanatçı sorusunun cevabından sonra: yeni kayıt ve seviye atlandı mı
export function seviyeCevapla(kayit, dogru) {
  const son = [...kayit.son, dogru ? 1 : 0].slice(-PENCERE);
  if (kayit.s < 2 && son.length >= EN_AZ && oran(son) >= GECIS_ORANI) return { kayit: { s: kayit.s + 1, son: [] }, gecti: true };
  return { kayit: { s: kayit.s, son }, gecti: false };
}

// Cevabı ilerleme nesnesine işler; { once, sonra, gecti } döndürür
export function seviyeIsle(ilerleme, id, dogru) {
  const once = seviyeKaydi(ilerleme, id);
  const { kayit, gecti } = seviyeCevapla(once, dogru);
  ilerleme.seviyeler = ilerleme.seviyeler || {};
  ilerleme.seviyeler[id] = kayit;
  return { once: once.s, sonra: kayit.s, gecti };
}

// Ekrandaki durum: "Kolay · son 6 cevapta 5 doğru · Orta için %80 (en az 5 cevap)"
export function seviyeDurumu(k) {
  const sv = seviyeBul(k.s);
  const n = k.son.length;
  const d = k.son.filter(Boolean).length;
  const sonraki = SEVIYELER[k.s + 1];
  const sayi = n ? `son ${n} cevapta ${d} doğru` : 'henüz cevap yok';
  if (!sonraki) return `${sv.ad} · ${sayi}${ustaMi(k) ? ' · ustalaştın' : ''}`;
  const kalan = Math.max(0, EN_AZ - n);
  return `${sv.ad} · ${sayi} · ${sonraki.ad} için %${Math.round(GECIS_ORANI * 100)}${kalan ? ` (en az ${kalan} cevap daha)` : ''}`;
}

// js/eserler.js zorlukDilimi'nin beklediği değer: 0–1 en kolay yarı, 2–3 hepsi, 4–5 en zor yarı
export function eserSeviyesi(s) {
  return s === 0 ? 0 : s === 1 ? 2 : 5;
}

// Seviyelere göre sayım: [{ ...seviye, sayi, usta }]
export function seviyeSayilari(ilerleme, idler) {
  const sonuc = SEVIYELER.map((x) => ({ ...x, sayi: 0, usta: 0 }));
  for (const id of idler) {
    const k = seviyeKaydi(ilerleme, id);
    sonuc[k.s].sayi++;
    if (ustaMi(k)) sonuc[k.s].usta++;
  }
  return sonuc;
}

// Yedekten / depodan gelen kaydı doğrular; geçersiz girdiler atılır
export function seviyelerDogrula(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {};
  const sonuc = {};
  for (const [id, k] of Object.entries(v)) {
    if (!k || ![0, 1, 2].includes(k.s) || !Array.isArray(k.son)) continue;
    sonuc[id] = { s: k.s, son: k.son.filter((x) => x === 0 || x === 1).slice(-PENCERE) };
  }
  return sonuc;
}
