// Yolculuk haritası (İş 24): 8 dönem resmi (her biri kendi döneminin üslubunda boyanmış), alttan (Orta Çağ)
// yukarıya (Modern) sisle birbirine geçer. Her bölüm resimdeki yolun kenarında bir durak (o dönemin nesnesi),
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

export function bolgeBul(sira) {
  return BOLGELER.find((b) => sira >= b.ilk && sira <= b.son) || BOLGELER[BOLGELER.length - 1];
}

// Gündüz 07:00–19:00, gece geri kalanı (ileride sabah/öğle/ikindi/akşam eklenecek)
export function vakit(tarih = new Date()) {
  const s = tarih.getHours();
  return s >= 7 && s < 19 ? 'gunduz' : 'gece';
}

export const resimAdresi = (bolge, tur) => `gorseller/harita/${bolge}_${tur}.webp`;
export const nesneAdresi = (bolge, tur) => `gorseller/harita/nesne_${bolge}_${tur}.webp`;
export const yolcuAdresi = (bolge, tur) => `gorseller/harita/yolcu_${bolge}_${tur}.webp`;

/**
 * durumlar: bolumDurumlari().durumlar (akım sırasıyla); veri: data/harita.json; tur: 'gunduz' | 'gece'
 * Dönen: { bolgeler: [{ ...bolge, ust (resmin haritadaki üst kenarı, resim yüksekliği cinsinden), duraklar: [{ ...durum, x, y }], motifler }],
 *          yukseklik (resim yüksekliği cinsinden) }. Bölgeler alttan üste (Orta Çağ ilk); haritada Modern en üstte.
 */
export function haritaKur(durumlar, veri, tur) {
  const n = BOLGELER.length;
  const yukseklik = n - (n - 1) * BINME;
  const bolgeler = BOLGELER.map((b, i) => {
    const v = (veri && veri.bolgeler && veri.bolgeler[b.id] && veri.bolgeler[b.id][tur]) || { duraklar: [], motifler: [] };
    const bunlar = durumlar.filter((x) => bolgeBul(x.sira).id === b.id);
    return {
      ...b,
      ust: yukseklik - 1 - i * (1 - BINME),
      nesne: v.nesne,
      yolcu: v.yolcu,
      duraklar: bunlar.map((x, j) => {
        const k = v.duraklar[j] || v.duraklar[v.duraklar.length - 1] || [0.5, 0.5];
        return { ...x, x: k[0], y: k[1] };
      }),
      motifler: v.motifler || [],
    };
  });
  return { bolgeler, yukseklik };
}

// Kayıttaki "haritada görülen duraklar" listesini doğrular (yedekten gelen)
export function gorulenDogrula(g) {
  return Array.isArray(g) ? [...new Set(g.filter((x) => typeof x === 'string'))].slice(0, 300) : [];
}
