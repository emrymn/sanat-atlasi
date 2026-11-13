// Uygulamada birleştirilen akımlar (1.78.0, Emre: "uluslararası gotikle normal gotiği birleştir, 2 sanatçı çok az
// ayrı bir sekme için"). Veri dosyaları değişmez (CLAUDE.md: içerik alanlarına dokunulmaz); birleştirme yükleme
// anında bellekte yapılır. Kaldırılan akımın sanatçıları hedef akıma geçer, komşu listelerinde adı hedefe döner,
// dönem metni ve "Nasıl tanınır?" maddeleri hedefin sonuna eklenir, seviye kaydı hedefinkiyle birleşir.
// Metinlerde (hikâyeler, notlar) "Uluslararası Gotik" üslubun adı olarak kalır; bu doğru.

import { PENCERE } from './seviye.js';

export const BIRLESEN_AKIMLAR = { 'Uluslararası Gotik': 'Gotik' };

export const akimAdi = (ad) => BIRLESEN_AKIMLAR[ad] || ad;

// Sanatçılar: akımı birleşenler yeni nesne olarak döner (gelen dizi ve nesneler değişmez)
export function sanatcilariBirlestir(sanatcilar) {
  return sanatcilar.map((s) => (Object.hasOwn(BIRLESEN_AKIMLAR, s.akim) ? { ...s, akim: BIRLESEN_AKIMLAR[s.akim] } : s));
}

// Akımlar: birleşen akım listeden çıkar; komşu adları hedefe döner, akımın kendisi ve tekrarlar atılır
export function akimlariBirlestir(akimlar) {
  return akimlar
    .filter((a) => !Object.hasOwn(BIRLESEN_AKIMLAR, a.ad))
    .map((a) => ({ ...a, komsular: [...new Set((a.komsular || []).map(akimAdi))].filter((k) => k !== a.ad) }));
}

// data/akim_bilgi.json ({ akimlar: { ad: { donem, yer, metin } } }): birleşenin metni hedefin metninin sonuna eklenir,
// dönem aralığı birleşenin bitişine uzar
const DONEM_SONU = { 'Uluslararası Gotik': '12. yüzyıl – y. 1425' };
export function akimBilgisiBirlestir(j) {
  if (!j || !j.akimlar) return j;
  const akimlar = { ...j.akimlar };
  for (const [kaynak, hedef] of Object.entries(BIRLESEN_AKIMLAR)) {
    const k = akimlar[kaynak];
    const h = akimlar[hedef];
    delete akimlar[kaynak];
    if (!k) continue;
    if (!h) {
      akimlar[hedef] = k;
      continue;
    }
    akimlar[hedef] = {
      ...h,
      donem: DONEM_SONU[kaynak] || h.donem,
      yer: [h.yer, k.yer].filter(Boolean).join('; '),
      metin: [h.metin, k.metin].filter(Boolean).join(' '),
    };
  }
  return { ...j, akimlar };
}

// data/akim_ozellikleri.json'un `akimlar` nesnesi ({ ad: [madde, …] }): birleşenin ayırt edici maddeleri hedefin
// sonuna, hangi üsluba ait oldukları belli olsun diye adıyla eklenir. Hedefle çakışan "altın ve parlak renkler"
// maddesi alınmaz (Gotik'te altın zemin zaten var).
const ALINAN_MADDELER = { 'Uluslararası Gotik': [0, 2, 3] };
export function ozellikleriBirlestir(oz) {
  if (!oz) return oz;
  const sonuc = { ...oz };
  for (const [kaynak, hedef] of Object.entries(BIRLESEN_AKIMLAR)) {
    const k = sonuc[kaynak];
    delete sonuc[kaynak];
    if (!Array.isArray(k)) continue;
    const secili = (ALINAN_MADDELER[kaynak] || k.map((_, i) => i)).map((i) => k[i]).filter(Boolean);
    sonuc[hedef] = [...(sonuc[hedef] || []), ...secili.map((x) => `${x} (${kaynak})`)];
  }
  return sonuc;
}

// İlerlemenin seviye kayıtları ({ akım: { s, son } }; js/seviye.js): birleşenin kaydı hedefinkine katılır (yüksek
// seviye kalır; eşitse son cevaplar birleşir) ve silinir. Yerinde değiştirir ve aynı nesneyi döndürür. Açılışta ve
// yedekten geri yüklemede ilerlemeDogrula (js/depo.js) çağırır; uygulama açılışta kaydettiği için bir kez kalıcı olur.
export function seviyeleriBirlestir(sv) {
  if (!sv) return sv;
  for (const [kaynak, hedef] of Object.entries(BIRLESEN_AKIMLAR)) {
    if (!Object.hasOwn(sv, kaynak)) continue;
    const k = sv[kaynak];
    const h = sv[hedef];
    if (!h || k.s > h.s) sv[hedef] = k;
    else if (k.s === h.s) sv[hedef] = { s: h.s, son: [...k.son, ...h.son].slice(-PENCERE) };
    delete sv[kaynak];
  }
  return sv;
}
