// Yolculuk haritası (İş 24): 8 dönem resmi (her biri kendi döneminin üslubunda boyanmış), alttan (Orta Çağ)
// yukarıya (Modern) dizilir; aralarında yeni dönemi duyuran sisli bir geçiş şeridi var. Her bölüm resimdeki yolun kenarında bir durak (o dönemin nesnesi),
// "buradasın" durağında o dönemin yolcusu. Gündüz/gece saate göre. Konumlar, motif kutuları ve motif
// metinleri data/harita.json'da (içerik klasöründeki betiklerle üretildi). Saf mantık burada (birim testli).

export const BOLGELER = [
  { id: 'ortacag', ad: 'Orta Çağ', yuzyil: 'Antik çağdan XV. yüzyıla', ilk: 0, son: 3 },
  { id: 'ronesans', ad: 'Rönesans', yuzyil: 'XV–XVI. yüzyıl', ilk: 4, son: 8 },
  { id: 'barok', ad: 'Barok', yuzyil: 'XVII. yüzyıl', ilk: 9, son: 12 },
  { id: 'barok2', ad: 'Klasisizm ve Geç Barok', yuzyil: 'XVII–XVIII. yüzyıl', ilk: 13, son: 14 },
  { id: 'aydinlanma', ad: 'Rokoko ve Neoklasisizm', yuzyil: 'XVIII. yüzyıl', ilk: 15, son: 16 },
  { id: 'romantik', ad: 'Romantizmden Realizme', yuzyil: 'XIX. yüzyılın ilk yarısı', ilk: 17, son: 20 },
  { id: 'ondokuz', ad: 'Empresyonizm ve sonrası', yuzyil: 'XIX. yüzyılın sonu', ilk: 21, son: 25 },
  { id: 'modern', ad: 'Modern sanat', yuzyil: 'XX. yüzyıl', ilk: 26, son: 99 },
];
// Resimler üst üste binerken sisli şeritler bu oranda kesişir (resim yüksekliğine oranla)
export const BINME = 0.12;
// Haritada dönemler arasına konan geçiş şeridi (resim yüksekliğine oranla); kaydırırken yeni döneme geçildiği
// hissedilsin. BINME'den büyük olunca resimler artık üst üste binmez, aradaki boşluğu geçiş şeridi doldurur.
export const ARA = 0.5;
// Haritanın iki ucundaki şerit (resim yüksekliğine oranla): altta yolculuğun başladığı Orta Çağ'ın adı, üstte
// yolun sonu; resimler sayfanın zeminine keskin kenarla değil, sisle karışarak biter.
export const UC = 0.42;

// Durak yerleşimi data/harita.json yerine burada elle verilen bölgeler: noktalar resimdeki yolun kenarında, alttan
// üste kabaca eşit aralıkla, yolun bir sağına bir soluna (Modern'deki gibi düzenli). data/harita.json'daki noktalar
// bu bölgelerde dip dipeydi (Rönesans'ta üç durak uzaktaki yolda üst üste, XIX. yüzyılda yedi durak kısa yolda).
// Gündüz ve gece resimleri aynı resimden olduğu için ikisinde de aynı noktalar. olcek: o bölgenin sembol boyutu;
// nesne: sembol resmi değiştiyse onun ölçüsü ve ayak noktası ({ w, h, ax, ay }, data/harita.json'daki gibi);
// dosya: yeni sembolün dosya adı kökü (gorseller/ önbelleği sürümden bağımsız: aynı adla değişen resim telefonda yenilenmez).
export const DURAK_DUZENI = {
  ronesans: {
    duraklar: [[0.52, 0.95], [0.3, 0.8], [0.68, 0.74], [0.28, 0.66], [0.68, 0.59], [0.44, 0.29], [0.53, 0.19]],
    nesne: { w: 24.0, h: 52.0, ax: 0.4653, ay: 1.0 }, // kaide üstünde mermer büst (eskiden düz beyaz kaide)
    dosya: 'ronesans_bust2',
  },
  romantik: {
    nesne: { w: 32.0, h: 50.0, ax: 0.6146, ay: 0.8733 }, // sarmaşıklı direkte fener (eskiden yol tabelası)
    dosya: 'romantik_fener',
  },
  ondokuz: {
    duraklar: [[0.43, 0.875], [0.32, 0.805], [0.55, 0.735], [0.43, 0.665], [0.51, 0.595], [0.34, 0.525], [0.66, 0.455]],
    olcek: 0.72,
  },
};

export function bolgeBul(sira) {
  return BOLGELER.find((b) => sira >= b.ilk && sira <= b.son) || BOLGELER[BOLGELER.length - 1];
}

// Gündüz 07:00–19:00, gece geri kalanı (ileride sabah/öğle/ikindi/akşam eklenecek)
export function vakit(tarih = new Date()) {
  const s = tarih.getHours();
  return s >= 7 && s < 19 ? 'gunduz' : 'gece';
}

export const resimAdresi = (bolge, tur) => `gorseller/harita/${bolge}_${tur}.webp`;
export const nesneAdresi = (bolge, tur) => `gorseller/harita/nesne_${(DURAK_DUZENI[bolge] && DURAK_DUZENI[bolge].dosya) || bolge}_${tur}.webp`;
export const yolcuAdresi = (bolge, tur) => `gorseller/harita/yolcu_${bolge}_${tur}.webp`;

/**
 * durumlar: bolumDurumlari().durumlar (akım sırasıyla); veri: data/harita.json; tur: 'gunduz' | 'gece'
 * ara: dönemler arası geçiş şeridi (resim yüksekliği cinsinden; 0 → resimler doğrudan sisle biner, ekran ARA verir)
 * uc: haritanın üst ve alt ucundaki şerit (aynı birimle; 0 → yok, ekran UC verir)
 * Dönen: { bolgeler: [{ ...bolge, ust (resmin haritadaki üst kenarı, resim yüksekliği cinsinden), olcek (sembol boyutu), duraklar: [{ ...durum, x, y }], motifler }],
 *          gecisler: [{ onceki, sonraki, ust, alt }] (alttaki resmin üst kenarı ile üstteki resmin alt kenarı arası),
 *          uclar: { ust: { bolge, ust, alt }, alt: { bolge, ust, alt } } (en üst resmin üstü, en alt resmin altı),
 *          yukseklik (resim yüksekliği cinsinden) }. Bölgeler alttan üste (Orta Çağ ilk); haritada Modern en üstte.
 */
export function haritaKur(durumlar, veri, tur, ara = 0, uc = 0) {
  const n = BOLGELER.length;
  const adim = 1 - BINME + ara;
  const yukseklik = 1 + (n - 1) * adim + 2 * uc;
  const bolgeler = BOLGELER.map((b, i) => {
    const v = (veri && veri.bolgeler && veri.bolgeler[b.id] && veri.bolgeler[b.id][tur]) || { duraklar: [], motifler: [] };
    const duzen = DURAK_DUZENI[b.id];
    const noktalar = (duzen && duzen.duraklar) || v.duraklar || [];
    const bunlar = durumlar.filter((x) => bolgeBul(x.sira).id === b.id);
    return {
      ...b,
      ust: yukseklik - uc - 1 - i * adim,
      nesne: (duzen && duzen.nesne) || v.nesne,
      olcek: (duzen && duzen.olcek) || 1,
      yolcu: v.yolcu,
      duraklar: bunlar.map((x, j) => {
        const k = noktalar[j] || noktalar[noktalar.length - 1] || [0.5, 0.5];
        return { ...x, x: k[0], y: k[1] };
      }),
      motifler: v.motifler || [],
    };
  });
  const gecisler = bolgeler.slice(1).map((sonraki, i) => ({ onceki: bolgeler[i], sonraki, ust: sonraki.ust + 1, alt: bolgeler[i].ust }));
  const uclar = {
    ust: { bolge: bolgeler[n - 1], ust: 0, alt: uc },
    alt: { bolge: bolgeler[0], ust: yukseklik - uc, alt: yukseklik },
  };
  return { bolgeler, gecisler, uclar, yukseklik };
}

// Kayıttaki "haritada görülen duraklar" listesini doğrular (yedekten gelen)
export function gorulenDogrula(g) {
  return Array.isArray(g) ? [...new Set(g.filter((x) => typeof x === 'string'))].slice(0, 300) : [];
}
