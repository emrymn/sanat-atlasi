// Seviyeler dönem (akım) başına tutulur: her dönem Kolay'dan başlar; o dönemin o seviyedeki son cevaplarında
// %80 başarı olmadan bir üst seviyeye geçmez. Dönemin seviyesi o dönemin sanatçılarına sorulan her sorunun
// zorluğunu belirler: hangi eser sorulur (js/eserler.js zorlukDilimi) ve yanlış şıklar ne kadar benzer
// (js/celdirici.js). Yalnızca sanatçı sorusu sayılır. Anahtar: akım adı. Bkz. KARARLAR.md "İş 12".

export const SEVIYELER = [
  { no: 0, anahtar: 'kolay', ad: 'Kolay', aciklama: 'Tanınmış, tipik eserler; şıklar uzak dönemlerden' },
  { no: 1, anahtar: 'orta', ad: 'Orta', aciklama: 'Her türden eser; şıklar komşu akımlardan' },
  { no: 2, anahtar: 'zor', ad: 'Zor', aciklama: 'Az bilinen eserler; şıklar aynı akımdan' },
];
export const GECIS_ORANI = 0.8;
export const PENCERE = 10; // son kaç cevaba bakılır
export const EN_AZ = 5; // geçiş için o seviyede en az bu kadar cevap

export const seviyeBul = (anahtarYaNo) => SEVIYELER.find((x) => x.anahtar === anahtarYaNo || x.no === anahtarYaNo) || SEVIYELER[0];

// { s: 0–2, son: [1, 0, …] (bu seviyedeki son cevaplar, en yeni sonda) }; akim: akım adı
export function seviyeKaydi(ilerleme, akim) {
  const k = ilerleme && ilerleme.seviyeler && Object.hasOwn(ilerleme.seviyeler, akim) && ilerleme.seviyeler[akim];
  return k ? { s: k.s, son: k.son.slice() } : { s: 0, son: [] };
}

// Pencerede 1 = doğru, 0 = yanlış, 2 = "Bilmiyorum" (Ö4): yanlış sayılır ama yarım ağırlıkla
export const BILMIYORUM = 2;
const agirlik = (x) => (x === BILMIYORUM ? 0.5 : 1);
export function oran(son) {
  const payda = son.reduce((t, x) => t + agirlik(x), 0);
  return payda ? son.filter((x) => x === 1).length / payda : 0;
}

// Ustalık: Zor'da da geçiş ölçütünü sağlamak
export function ustaMi(k) {
  return k.s === 2 && k.son.length >= EN_AZ && oran(k.son) >= GECIS_ORANI;
}

// Sanatçı sorusunun cevabından sonra: yeni kayıt ve seviye atlandı mı
// dogru: true | false | 'bilmiyorum'
export function seviyeCevapla(kayit, dogru) {
  const son = [...kayit.son, dogru === 'bilmiyorum' ? BILMIYORUM : dogru ? 1 : 0].slice(-PENCERE);
  if (kayit.s < 2 && son.length >= EN_AZ && oran(son) >= GECIS_ORANI) return { kayit: { s: kayit.s + 1, son: [] }, gecti: true };
  return { kayit: { s: kayit.s, son }, gecti: false };
}

// Cevabı dönemin kaydına işler; { once, sonra, gecti } döndürür
export function seviyeIsle(ilerleme, akim, dogru) {
  const once = seviyeKaydi(ilerleme, akim);
  const { kayit, gecti } = seviyeCevapla(once, dogru);
  ilerleme.seviyeler = ilerleme.seviyeler || {};
  ilerleme.seviyeler[akim] = kayit;
  return { once: once.s, sonra: kayit.s, gecti };
}

// Ekrandaki durum: "Kolay · son 6 cevapta 5 doğru · Orta için %80 (en az 5 cevap)"
export function seviyeDurumu(k) {
  const sv = seviyeBul(k.s);
  const n = k.son.length;
  const d = k.son.filter((x) => x === 1).length;
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

// Kısa durum (menü ve rozetler): "Kolay · 3/5", "Orta · 4/7 doğru", "Zor · usta"
export function seviyeKisa(k) {
  const sv = seviyeBul(k.s);
  if (ustaMi(k)) return `${sv.ad} · usta`;
  const n = k.son.length;
  const d = k.son.filter((x) => x === 1).length;
  return n < EN_AZ ? `${sv.ad} · ${n}/${EN_AZ}` : `${sv.ad} · ${d}/${n} doğru`;
}

// Yedekten / depodan gelen kaydı doğrular; geçersiz girdiler atılır
export function seviyelerDogrula(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {};
  const sonuc = {};
  for (const [id, k] of Object.entries(v)) {
    if (!k || ![0, 1, 2].includes(k.s) || !Array.isArray(k.son)) continue;
    sonuc[id] = { s: k.s, son: k.son.filter((x) => x === 0 || x === 1 || x === BILMIYORUM).slice(-PENCERE) };
  }
  return sonuc;
}

// ---------- Ö9 · Seviye seçimi ----------
// Dönem turunda ısınmak için açılmış bir alt seviye seçilebilir; açılmamış (üst) seviye kilitli.
export function seviyeSecenekleri(kayit) {
  return SEVIYELER.map((x) => ({ no: x.no, anahtar: x.anahtar, ad: x.ad, acik: x.no <= kayit.s }));
}

// Kartın sorulacağı seviye: seçim yoksa dönemin seviyesi; seçim üst seviyeye çıkamaz
export function kartSeviyesi(kayit, secili) {
  return secili === null || secili === undefined ? kayit.s : Math.max(0, Math.min(secili, kayit.s));
}

// Alt seviyede verilen cevap dönemin (üst seviyenin) penceresine yazılmaz
export function pencereyeYazilirMi(kayit, kartSv) {
  return (kartSv ?? kayit.s) >= kayit.s;
}
