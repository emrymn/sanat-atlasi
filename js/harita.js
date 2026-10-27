// Yolculuk haritası (İş 24, yeni harita İş 41): 9 dönem resmi (her biri kendi döneminin üslubunda boyanmış), alttan
// (Orta Çağ) yukarıya (Modern) aralarında şerit ya da sis olmadan bitişik dizilir (Emre: "direkt ekle, sis de ekleme").
// Her bölüm, resimdeki yolun kenarında boş bir meydanda bir durak; her durağın kendi sembolü var (o seviyenin
// sanatçılarından bir nesne). "Buradasın" durağında o dönemin kıyafetiyle öğrenci. Son açık durağın üstü sepya.
// Gündüz/gece saate göre. Durak yerleri, sembol ölçüleri, motif kutuları ve motif metinleri data/harita.json'da
// (scripts/harita/uygulama_hazirla.py üretir). Saf mantık burada (birim testli).

export const BOLGELER = [
  { id: 'ortacag', ad: 'Orta Çağ', yuzyil: 'Antik çağdan XV. yüzyıla', ilk: 0, son: 3 },
  { id: 'ronesans', ad: 'Rönesans', yuzyil: 'XV–XVI. yüzyıl', ilk: 4, son: 8 },
  { id: 'barok', ad: 'Barok', yuzyil: 'XVII. yüzyıl', ilk: 9, son: 12 },
  { id: 'barok2', ad: 'Klasisizm ve Geç Barok', yuzyil: 'XVII–XVIII. yüzyıl', ilk: 13, son: 14 },
  { id: 'aydinlanma', ad: 'Rokoko ve Neoklasisizm', yuzyil: 'XVIII. yüzyıl', ilk: 15, son: 16 },
  { id: 'romantik', ad: 'Romantizmden Realizme', yuzyil: 'XIX. yüzyılın ilk yarısı', ilk: 17, son: 20 },
  { id: 'empresyonizm', ad: 'Empresyonizm', yuzyil: 'XIX. yüzyılın son çeyreği', ilk: 21, son: 22 },
  { id: 'postempresyonizm', ad: 'Post-Empresyonizm ve Sembolizm', yuzyil: 'XIX. yüzyıl sonu – XX. yüzyıl başı', ilk: 23, son: 25 },
  { id: 'modern', ad: 'Modern sanat', yuzyil: 'XX. yüzyıl', ilk: 26, son: 99 },
];
// Haritanın genişliği ve bir dönem resminin yüksekliği (pt); dönem resimleri 1:3 (1024×3072)
export const W = 390;
export const H = 1170;
// Son açık durağın bu kadar üstünden (resim yüksekliğine oranla) itibaren harita sepyaya döner; geçiş yumuşak
export const SEPYA_PAY = 0.07;
export const SEPYA_GECIS = 0.04;
// data/harita.json'da ölçüsü olmayan sembol (fazladan bölüm açılırsa) için yedek ölçü
const YEDEK_SEMBOL = { w: 34, h: 56, ax: 0.5, ay: 0.85 };

export function bolgeBul(sira) {
  return BOLGELER.find((b) => sira >= b.ilk && sira <= b.son) || BOLGELER[BOLGELER.length - 1];
}

// Gündüz 07:00–19:00, gece geri kalanı (ileride sabah/öğle/ikindi/akşam eklenecek)
export function vakit(tarih = new Date()) {
  const s = tarih.getHours();
  return s >= 7 && s < 19 ? 'gunduz' : 'gece';
}

// Dosya adları eski haritanınkilerden farklı: gorseller/ önbelleği sürümden bağımsız, aynı adla değişen resim telefonda
// yenilenmez (eskileri gorseller/harita_eski/ altında yedekte)
export const resimAdresi = (bolge, tur) => `gorseller/harita/donem_${bolge}_${tur}.webp`;
export const nesneAdresi = (bolge, no, tur) => `gorseller/harita/sembol_${bolge}_${no}_${tur}.webp`;
export const yolcuAdresi = (bolge, tur) => `gorseller/harita/ogrenci_${bolge}_${tur}.webp`;

/**
 * durumlar: bolumDurumlari().durumlar (akım sırasıyla); veri: data/harita.json
 * Dönen: { bolgeler: [{ ...bolge, ust (resmin haritadaki üst kenarı, resim yüksekliği cinsinden), yolcu,
 *          duraklar: [{ ...durum, x, y, sembolNo, nesne: { w, h, ax, ay } }], motifler }], yukseklik }.
 * Bölgeler alttan üste (Orta Çağ ilk); haritada Modern en üstte, resimler arasında boşluk yok.
 */
export function haritaKur(durumlar, veri) {
  const n = BOLGELER.length;
  const bolgeler = BOLGELER.map((b, i) => {
    const v = (veri && veri.bolgeler && veri.bolgeler[b.id]) || {};
    const noktalar = v.duraklar || [];
    const semboller = v.semboller || [];
    const bunlar = durumlar.filter((x) => bolgeBul(x.sira).id === b.id);
    return {
      ...b,
      ust: n - 1 - i,
      yolcu: v.yolcu,
      duraklar: bunlar.map((x, j) => {
        // haritada meydandan fazla bölüm olursa (yeni sanatçı görselleri) fazlası son meydanın biraz üstüne dizilir
        const k = Math.max(0, Math.min(j, noktalar.length - 1));
        const p = noktalar[k] || [0.5, 0.5];
        const fazla = j - k;
        return { ...x, x: p[0], y: Math.max(0.02, p[1] - fazla * 0.05), sembolNo: k + 1, nesne: semboller[k] || YEDEK_SEMBOL };
      }),
      motifler: v.motifler || [],
    };
  });
  return { bolgeler, yukseklik: n };
}

// Haritanın bu yüksekliğinden (resim yüksekliği cinsinden, üstten) yukarısı sepya: son açık durağın SEPYA_PAY üstü.
// Hiç açık durak yoksa bütün harita sepya.
export function sepyaSiniri(harita) {
  const acik = harita.bolgeler.flatMap((b) => b.duraklar.filter((x) => x.acik).map((x) => b.ust + x.y));
  return acik.length ? Math.max(0, Math.min(...acik) - SEPYA_PAY) : harita.yukseklik;
}

// Kayıttaki "haritada görülen duraklar" listesini doğrular (yedekten gelen)
export function gorulenDogrula(g) {
  return Array.isArray(g) ? [...new Set(g.filter((x) => typeof x === 'string'))].slice(0, 300) : [];
}
