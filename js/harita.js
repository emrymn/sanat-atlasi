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
// İki dönem resminin arasındaki bulutlu ara bölümün yüksekliği (resim yüksekliğine oranla); resimleri örtmez
export const ARA = 0.34;
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
// İş 90: öğrencinin pozları (scripts/harita/yolcu_hazirla.py; data/harita_yolcu.json): dur, yuru1.., arka1.., eskiz.
// İş 91: ad, dönemin karakteri (data/harita_yolcu.json bolgeler[dönem].ad; eski öğrenci "yolcu")
export const yolcuAdresi = (bolge, poz, tur, ad = 'yolcu') => `gorseller/harita/${ad}_${bolge}_${poz}_${tur}.webp`;
// Öğrenci durağın yanında durur: sağdaki meydanlarda sembolün solunda, soldakilerde sağında (haritanın içine doğru)
export const YOLCU_ARA = 34;
// Öğrencinin durduğu yer (durak: haritaKur'un durağı; dönüş haritada pt, bölgenin resminin üstünden)
export function yolcuYeri(x) {
  return { x: Math.min(W - 18, Math.max(18, x.x * W + (x.x > 0.5 ? -YOLCU_ARA : YOLCU_ARA))), y: x.y * H + 4 };
}

/**
 * İş 90 (Emre: "yürürken patikayı kullansın, sakın dışarıdan yürütme"): öğrencinin bir duraktan ötekine yolu (ileri
 * ya da geri). patikalar: data/harita_patikalar.json (resimdeki boyalı patika, durak durak). Dönüş: parçalar; her parça
 * bir dönemin içinde, noktaları haritada pt [x, y] (haritanın üstünden). Dönem değişince yeni parça başlar: öğrenci
 * sisin içinde söner, yeni dönemin durağında belirir (dönemler arasında patika yok). Patikası bilinmeyen iki durak arası
 * (meydan sayısından fazla bölüm) düz kısa bir adım. En çok enCok durak yürünür: daha uzaksa öğrenci bulunduğu yerde
 * söner, hedefe enCok durak kala belirip oradan yürür. Yürünecek yol yoksa (bilinmeyen durak, aynı durak) null.
 */
export function yolcuYolu(harita, patikalar, eskiId, yeniId, enCok = 4) {
  const sira = harita.bolgeler.flatMap((b) => b.duraklar.map((x, j) => ({ b, x, j })));
  const i1 = sira.findIndex((s) => s.x.id === yeniId);
  const i0 = sira.findIndex((s) => s.x.id === eskiId);
  if (i0 < 0 || i1 < 0 || i1 === i0) return null;
  const adim = i1 > i0 ? 1 : -1;
  const haritada = (b, [x, y]) => [x * W, (b.ust + y) * H];
  const yer = (s) => {
    const p = yolcuYeri(s.x);
    return [p.x, s.b.ust * H + p.y];
  };
  const parcalar = [];
  // çok uzaksa hedefe enCok durak kala başlar
  const bas = Math.abs(i1 - i0) > enCok ? i1 - adim * enCok : i0;
  let parca = null;
  for (let i = bas; i !== i1; i += adim) {
    const a = sira[i];
    const c = sira[i + adim];
    if (a.b.id !== c.b.id) {
      parca = null;
      continue;
    }
    if (!parca) {
      parca = { bolge: a.b.id, noktalar: [yer(a)] };
      parcalar.push(parca);
    }
    const yollar = (patikalar && patikalar.bolgeler && patikalar.bolgeler[a.b.id] && patikalar.bolgeler[a.b.id].yollar) || [];
    const k = Math.min(a.j, c.j);
    const p = yollar[k];
    if (Math.abs(c.j - a.j) === 1 && Array.isArray(p) && p.length >= 2) {
      const ara = p.slice(1, -1).map((n) => haritada(a.b, n));
      parca.noktalar.push(...(adim > 0 ? ara : ara.reverse()));
    }
    parca.noktalar.push(yer(c));
  }
  // yol öğrencinin bulunduğu yerden başlamıyorsa (ilk adım dönem değiştiriyor ya da çok uzak): orada söner (tek noktalı
  // parça), yolun başında belirir
  const ilk = yer(sira[i0]);
  const ilkNokta = parcalar.length ? parcalar[0].noktalar[0] : null;
  if (!ilkNokta || ilkNokta[0] !== ilk[0] || ilkNokta[1] !== ilk[1]) parcalar.unshift({ bolge: sira[i0].b.id, noktalar: [ilk] });
  // son adımda dönem değiştiyse (ya da hiç yürünmediyse): yeni dönemin durağında tek noktalı parça (orada belirir)
  const hedef = yer(sira[i1]);
  const sonNokta = parcalar.length ? parcalar[parcalar.length - 1].noktalar.at(-1) : null;
  if (!sonNokta || sonNokta[0] !== hedef[0] || sonNokta[1] !== hedef[1]) parcalar.push({ bolge: sira[i1].b.id, noktalar: [hedef] });
  return { parcalar };
}

// İş 93 (Emre: "geri geri gidiş tuhaf duruyor, tersini çizip ekleyelim"): yürürken gidiş yönüne göre poz. Gezginler
// sırtı dönük çizildi (dur); patikada aşağı (önceki duraklara, izleyene doğru) inerken önden pozu (on) varsa o. Yürüme
// kareleri (yuru1.., arka1..) varsa adım adım; yoksa yöne göre tek resim. pozlar: { dur, on?, yuru1?, arka1?, ... }
export function yolcuPozu(pozlar, dx, dy, adim) {
  const adlar = Object.keys(pozlar || {});
  const dizi = (on) => adlar.filter((k) => new RegExp(`^${on}\\d+$`).test(k)).sort();
  const asagi = dy > 0 && dy > Math.abs(dx) * 0.6;
  const yukari = dy < 0 && -dy > Math.abs(dx) * 1.6;
  if (asagi && adlar.includes('on')) return 'on';
  const l = yukari && dizi('arka').length ? dizi('arka') : dizi('yuru');
  return l.length ? l[adim % l.length] : 'dur';
}

// Bir çizginin uzunluğu ve t (0–1) anındaki noktası ile yönü
export function cizgiUzunlugu(n) {
  let u = 0;
  for (let i = 1; i < n.length; i++) u += Math.hypot(n[i][0] - n[i - 1][0], n[i][1] - n[i - 1][1]);
  return u;
}
export function cizgideNokta(n, mesafe) {
  if (n.length === 1) return { x: n[0][0], y: n[0][1], dx: 0, dy: 0 };
  let kalan = Math.max(0, mesafe);
  for (let i = 1; i < n.length; i++) {
    const dx = n[i][0] - n[i - 1][0];
    const dy = n[i][1] - n[i - 1][1];
    const u = Math.hypot(dx, dy);
    if (kalan <= u || i === n.length - 1) {
      const t = u ? Math.min(1, kalan / u) : 1;
      return { x: n[i - 1][0] + dx * t, y: n[i - 1][1] + dy * t, dx, dy };
    }
    kalan -= u;
  }
  return null;
}

/**
 * durumlar: bolumDurumlari().durumlar (akım sırasıyla); veri: data/harita.json
 * Dönen: { bolgeler: [{ ...bolge, ust (resmin haritadaki üst kenarı, resim yüksekliği cinsinden), yolcu,
 *          duraklar: [{ ...durum, x, y, sembolNo, nesne: { w, h, ax, ay } }], motifler }], yukseklik }.
 * Bölgeler alttan üste (Orta Çağ ilk); haritada Modern en üstte, resimler arasında ARA boyunda bulutlu bir ara.
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
      ust: (n - 1 - i) * (1 + ARA),
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
  return { bolgeler, yukseklik: n + (n - 1) * ARA };
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
