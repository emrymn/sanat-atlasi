// Yolculuk haritası (İş 23): elle boyanmış adalardan oluşan kuş bakışı bir harita; her akım bir durak,
// kurs ilerledikçe açılır. Saf mantık burada (birim testli); çizim js/ekranlar/harita.js'de.
import { seviyeKaydi, ustaMi } from './seviye.js';

// Bölgeler (akım sırasına göre). Her bölge bir ada resmi (gorseller/harita/<id>.webp, 2:3 dikey).
// yol: resimdeki boyalı toprak yolun noktaları, alttan yukarı; x, y resmin genişliğine/yüksekliğine oranla (0–1).
// Duraklar bu yol boyunca eşit aralıkla dizilir.
const n = (pts) => pts.map(([x, y]) => [x / 600, y / 900]);
export const BOLGELER = [
  {
    id: 'ortacag',
    ad: 'Orta Çağ',
    yuzyil: 'XI–XV. yüzyıl',
    ilk: 0,
    son: 3,
    yol: n([
      [300, 800],
      [330, 700],
      [320, 640],
      [290, 600],
      [340, 540],
      [350, 490],
      [300, 440],
      [285, 400],
      [320, 350],
      [265, 320],
      [270, 280],
      [310, 240],
      [300, 215],
      [255, 195],
    ]),
  },
  {
    id: 'ronesans',
    ad: 'Rönesans',
    yuzyil: 'XV–XVI. yüzyıl',
    ilk: 4,
    son: 8,
    yol: n([
      [300, 800],
      [320, 750],
      [290, 700],
      [300, 640],
      [280, 580],
      [320, 500],
      [330, 470],
      [290, 430],
      [300, 400],
      [330, 370],
      [280, 340],
      [270, 300],
      [300, 260],
      [290, 240],
      [320, 220],
    ]),
  },
  {
    id: 'barok',
    ad: 'Barok',
    yuzyil: 'XVII. yüzyıl',
    ilk: 9,
    son: 12,
    yol: n([
      [330, 700],
      [270, 620],
      [240, 560],
      [250, 500],
      [280, 440],
      [300, 390],
      [290, 330],
      [320, 280],
      [330, 240],
      [290, 190],
      [260, 160],
      [300, 120],
      [290, 95],
    ]),
  },
  {
    id: 'barok2',
    ad: 'Klasisizm ve Geç Barok',
    yuzyil: 'XVII–XVIII. yüzyıl',
    ilk: 13,
    son: 14,
    yol: n([
      [290, 790],
      [300, 740],
      [280, 700],
      [300, 650],
      [330, 600],
      [320, 560],
      [300, 520],
      [280, 480],
      [270, 440],
      [290, 400],
      [300, 360],
      [280, 320],
      [270, 290],
      [300, 250],
      [310, 220],
      [270, 200],
      [260, 170],
      [300, 140],
      [300, 120],
    ]),
  },
  {
    id: 'aydinlanma',
    ad: 'Rokoko ve Neoklasisizm',
    yuzyil: 'XVIII. yüzyıl',
    ilk: 15,
    son: 16,
    yol: n([
      [300, 790],
      [320, 720],
      [330, 660],
      [290, 620],
      [330, 560],
      [370, 500],
      [350, 440],
      [330, 400],
      [300, 370],
      [290, 340],
      [330, 300],
      [260, 260],
      [270, 230],
      [300, 200],
      [250, 180],
      [270, 160],
    ]),
  },
  {
    id: 'romantik',
    ad: 'Romantizmden Realizme',
    yuzyil: 'XIX. yüzyılın ilk yarısı',
    ilk: 17,
    son: 20,
    yol: n([
      [270, 790],
      [280, 740],
      [260, 700],
      [250, 650],
      [290, 610],
      [270, 570],
      [240, 540],
      [250, 490],
      [290, 460],
      [320, 420],
      [300, 380],
      [270, 360],
      [300, 330],
      [260, 300],
      [270, 250],
      [310, 220],
      [320, 170],
      [290, 130],
      [320, 95],
    ]),
  },
  {
    id: 'ondokuz',
    ad: 'Empresyonizm ve sonrası',
    yuzyil: 'XIX. yüzyılın sonu',
    ilk: 21,
    son: 25,
    yol: n([
      [330, 800],
      [300, 740],
      [270, 700],
      [240, 650],
      [300, 600],
      [330, 560],
      [300, 520],
      [330, 470],
      [300, 420],
      [290, 380],
      [310, 330],
      [300, 280],
      [320, 250],
      [280, 210],
      [310, 170],
      [310, 140],
    ]),
  },
  {
    id: 'modern',
    ad: 'Modern sanat',
    yuzyil: 'XX. yüzyıl',
    ilk: 26,
    son: 99,
    yol: n([
      [300, 790],
      [310, 720],
      [300, 660],
      [330, 620],
      [310, 560],
      [330, 500],
      [350, 450],
      [370, 400],
      [370, 370],
      [320, 330],
      [310, 290],
      [330, 270],
      [290, 230],
      [260, 210],
      [290, 180],
      [270, 160],
    ]),
  },
];

export function bolgeBul(sira) {
  return BOLGELER.find((b) => sira >= b.ilk && sira <= b.son) || BOLGELER[BOLGELER.length - 1];
}

// Durağın yıldızları: 0 = Kolay'da, 1 = Orta'ya geçti, 2 = Zor'a geçti, 3 = Zor'da da %80 (usta)
export function yildiz(ilerleme, akim) {
  const k = seviyeKaydi(ilerleme, akim);
  return ustaMi(k) ? 3 : k.s;
}

/**
 * durumlar: kilit.js akimDurumlari çıktısı (acik, acikSayisi, toplam, acilacagiKonu)
 * Dönen: { bolgeler: [{ ...bolge, duraklar, acik }], duraklar, simdiki }
 * simdiki: kursta açılmış en ileri durak ("buradasın" işareti)
 */
export function haritaKur(durumlar, ilerleme) {
  const duraklar = durumlar
    .slice()
    .sort((a, b) => a.sira - b.sira)
    .map((x, i) => ({
      ad: x.ad,
      sira: x.sira,
      no: i,
      acik: x.acik,
      acikSayisi: x.acikSayisi,
      toplam: x.toplam,
      acilacagiKonu: x.acilacagiKonu,
      yildiz: x.acik ? yildiz(ilerleme, x.ad) : 0,
      bolge: bolgeBul(x.sira).id,
    }));
  const acik = duraklar.filter((x) => x.acik);
  const simdiki = acik.length ? acik[acik.length - 1].ad : null;
  const bolgeler = BOLGELER.map((b) => {
    const d = duraklar.filter((x) => x.bolge === b.id);
    return { ...b, duraklar: d, acik: d.some((x) => x.acik) };
  }).filter((b) => b.duraklar.length);
  return { bolgeler, duraklar, simdiki };
}

// Yeni açılan duraklar ve bölgeler (son haritaya bakıştan beri): hareketle gösterilir
export function yeniAcilanDuraklar(duraklar, gorulen) {
  const g = new Set(Array.isArray(gorulen) ? gorulen : []);
  return duraklar.filter((x) => x.acik && !g.has(x.ad)).map((x) => x.ad);
}

// ---------- yol üzerinde yerleşim ----------
function uzunluklar(yol) {
  const l = [0];
  for (let i = 1; i < yol.length; i++) {
    // dikey oran 1.5 (resim 2:3): mesafe gerçek görüntüdeki gibi ölçülür
    const dx = yol[i][0] - yol[i - 1][0];
    const dy = (yol[i][1] - yol[i - 1][1]) * 1.5;
    l.push(l[i - 1] + Math.hypot(dx, dy));
  }
  return l;
}

// Yol üzerinde t (0–1, yol uzunluğuna oranla) noktası
export function yolNoktasi(yol, t) {
  const l = uzunluklar(yol);
  const hedef = Math.max(0, Math.min(1, t)) * l[l.length - 1];
  for (let i = 1; i < yol.length; i++) {
    if (l[i] >= hedef) {
      const u = l[i] === l[i - 1] ? 0 : (hedef - l[i - 1]) / (l[i] - l[i - 1]);
      return [yol[i - 1][0] + (yol[i][0] - yol[i - 1][0]) * u, yol[i - 1][1] + (yol[i][1] - yol[i - 1][1]) * u];
    }
  }
  return yol[yol.length - 1].slice();
}

// n durağın yol üzerindeki t değerleri: uçlarda kıyıya yapışmasın diye %12–%86 arası, eşit aralık
export function durakKonumlari(adet, { bas = 0.12, son = 0.86 } = {}) {
  if (adet <= 0) return [];
  if (adet === 1) return [0.5];
  if (adet === 2) return [0.3, 0.7];
  return Array.from({ length: adet }, (_, i) => bas + ((son - bas) * i) / (adet - 1));
}

// Yolun başından t'ye kadar olan kısmı (geçilen yol), SVG için 600×900 koordinatlarında "x,y x,y …"
export function yolParcasi(yol, t) {
  if (t <= 0) return '';
  const l = uzunluklar(yol);
  const hedef = Math.min(1, t) * l[l.length - 1];
  const p = [yol[0]];
  for (let i = 1; i < yol.length; i++) {
    if (l[i] < hedef) p.push(yol[i]);
    else {
      p.push(yolNoktasi(yol, hedef / l[l.length - 1]));
      break;
    }
  }
  return p.map(([x, y]) => `${(x * 600).toFixed(1)},${(y * 900).toFixed(1)}`).join(' ');
}

// Kayıttaki "haritada görülen duraklar" listesini doğrular (yedekten gelen)
export function gorulenDogrula(g) {
  return Array.isArray(g) ? [...new Set(g.filter((x) => typeof x === 'string'))].slice(0, 200) : [];
}
