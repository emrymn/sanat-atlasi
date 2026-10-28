// Yolculuk haritası (İş 24, yeni harita İş 41): 9 dönem resmi alttan (Orta Çağ) yukarıya (Modern) dizilir, aralarında
// iki resmin birbirine aktığı köprü ve yeni dönemin adı (v0, 1.40); son açık durağın üstü sepya. Dönem değişince sağ
// üstteki gösterge değişir (ortadaki bölüm kartı Emre'nin isteğiyle kalktı, ad köprüde).
// Her bölüm yolun kenarındaki meydanda kendi sembolüyle bir durak; açık durakların altında yumuşak bir ışık yanıp
// söner, "buradasın" durağında dönemin kıyafetiyle öğrenci ve yukarıdan inen ışık. Durağa dokununca küçük pencere
// (seviyeler, yıldızlar, sanatçılar, akım sayfası); resimdeki saklı motife dokununca eserin hikâyesi.
import { kacis } from '../yardimci.js';
import { ikon } from '../tasarim.js';
import { bolumleriKur, bolumDurumlari, bolumAdi, kilitMetni, BOLUM_SORU, BOLUM_GECME, BOLUM_SEVIYELER } from '../bolum.js';
import { haritaKur, sepyaSiniri, vakit, resimAdresi, nesneAdresi, yolcuAdresi, gorulenDogrula, bolgeBul, BOLGELER, W, H, SEPYA_GECIS, ARA } from '../harita.js';
import { d, ekran, ciz, ust, islenen, kaydet, gununRengi, cizimNo, guncelMi, jsonGetir, kucukKareleriDoldur, kucukGorsel, enBilinen } from './ortak.js';
import { sanatciEserleri } from '../eserler.js';
import { harfUygula, BOLGE_HARFLERI } from '../harfler.js';

// Öğrenci durağın yanında durur: sağdaki meydanlarda sembolün solunda, soldakilerde sağında (haritanın içine doğru)
const YOLCU_ARA = 34;
let veriSozu = null;
export function haritaVerisi() {
  veriSozu ||= jsonGetir('data/harita.json').catch(() => ({ bolgeler: {}, eserler: {} }));
  return veriSozu;
}

export function bolumler() {
  d.bolumler ||= bolumleriKur(d.akimlar, d.sanatcilar);
  return d.bolumler;
}

export function durumlar() {
  return bolumDurumlari(bolumler(), d.ilerleme, islenen(), d.harita);
}

const SEVIYE_AD = { kolay: 'Kolay', orta: 'Orta', zor: 'Zor' };
// Yıldız yazı tipinden bağımsız çizilir (Bodoni'de ★ glifi yok, kutu görünüyordu)
const YILDIZ = '<i class="yildiz-sekil" aria-hidden="true"></i>';
const yildizHtml = (n) =>
  `<span class="harita-yildiz" role="img" aria-label="${n} / 3 yıldız">${[0, 1, 2].map((i) => `<i class="yildiz-sekil${i < n ? ' dolu' : ''}" style="--i:${i}"></i>`).join('')}</span>`;

function durakHtml(b, x, h, tur, simdiki, yeni) {
  const n = x.nesne;
  const ustY = (b.ust + x.y) * H; // tabanın haritadaki yüksekliği (pt, harita yüksekliği h*H)
  const toplamY = h * H;
  const sol = ((x.x * W - n.ax * n.w) / W) * 100;
  const ustYuzde = ((ustY - n.ay * n.h) / toplamY) * 100;
  const durum = x.acik ? (x.id === simdiki ? 'simdiki' : 'acik') : 'kilit';
  const etiketi = `${bolumAdi(x)}${x.acik ? `, ${x.yildiz} yıldız` : ', kilitli'}${x.id === simdiki ? ', buradasın' : ''}`;
  let parca = `<button type="button" class="harita-durak ${durum}${yeni ? ' yeni' : ''}" data-test="harita-durak" data-bolum="${x.id}" data-donem="${b.id}" data-acik="${x.acik}"
      style="left:${sol.toFixed(3)}%;top:${ustYuzde.toFixed(3)}%;width:${((n.w / W) * 100).toFixed(3)}%"
      aria-label="${kacis(etiketi)}"><img alt="" decoding="async" src="${nesneAdresi(b.id, x.sembolNo, tur)}"></button>`;
  const taban = `left:${((x.x * W) / W) * 100}%;top:${((ustY + 2) / toplamY) * 100}%`;
  if (x.acik) parca = `<span class="harita-isik" aria-hidden="true" style="${taban};animation-delay:${((x.no * 0.37) % 2.8).toFixed(2)}s"></span>` + parca;
  if (x.id === simdiki && b.yolcu) {
    const y = b.yolcu;
    const yw = y.w;
    const yh = y.h;
    const hx = Math.min(W - 18, Math.max(18, x.x * W + (x.x > 0.5 ? -YOLCU_ARA : YOLCU_ARA)));
    const hy = ustY + 4;
    parca += `<span class="harita-sutun" aria-hidden="true" style="left:${(hx / W) * 100}%;top:${((hy - 170) / toplamY) * 100}%;height:${(174 / toplamY) * 100}%"></span>
      <span class="harita-yer" aria-hidden="true" style="left:${(hx / W) * 100}%;top:${((hy - 2) / toplamY) * 100}%"></span>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<span class="harita-kivilcim" aria-hidden="true" style="left:${((hx - 12 + ((i * 37) % 24)) / W) * 100}%;top:${((hy - 6 - ((i * 13) % 10)) / toplamY) * 100}%;animation-delay:${i * 0.4}s"></span>`).join('')}
      <span class="harita-yolcu-hale" aria-hidden="true" style="left:${(hx / W) * 100}%;top:${((hy - yh * 0.5) / toplamY) * 100}%"></span>
      <img class="harita-yolcu" data-test="harita-yolcu" alt="" decoding="async" src="${yolcuAdresi(b.id, tur)}"
        style="left:${((hx - y.ax * yw) / W) * 100}%;top:${((hy - y.ay * yh) / toplamY) * 100}%;width:${(yw / W) * 100}%">
      <span class="harita-yolcu-ok" aria-hidden="true" style="left:${(hx / W) * 100}%;top:${((hy - yh - 6) / toplamY) * 100}%"></span>`;
  }
  return parca;
}

function motifHtml(b, m, i, h) {
  const [x0, y0, x1, y1] = m.kutu;
  const toplamY = h * H;
  return `<button type="button" class="harita-motif" data-test="harita-motif" data-motif="${kacis(m.eser)}"
      style="left:${x0 * 100}%;top:${(((b.ust + y0) * H) / toplamY) * 100}%;width:${(x1 - x0) * 100}%;height:${(((y1 - y0) * H) / toplamY) * 100}%"
      aria-label="Saklı motif ${i + 1}"></button>`;
}

// konumuKoru: gündüz/gece değişince harita yeniden çizilir ama sayfa "buradasın"a zıplamaz, olduğu yerde kalır
export async function haritaSayfasi({ konumuKoru = false } = {}) {
  const eskiY = window.scrollY;
  const no = cizimNo();
  const [veri, bilgi] = await Promise.all([haritaVerisi(), d.akimBilgi ? null : jsonGetir('data/akim_bilgi.json').catch(() => null)]);
  if (bilgi) d.akimBilgi = bilgi;
  if (!guncelMi(no)) return;
  const tur = d.haritaVakti || vakit();
  const { durumlar: liste, simdiki } = durumlar();
  const harita = haritaKur(liste, veri);
  const sinir = sepyaSiniri(harita);
  const gorulen = new Set(d.ilerleme.haritaGorulen || []);
  const yeniler = new Set(liste.filter((x) => x.acik && !gorulen.has(x.id)).map((x) => x.id));
  const acikSayi = liste.filter((x) => x.acik).length;
  const yildiz = liste.reduce((t, x) => t + x.yildiz, 0);
  d.haritaDurum = { liste, simdiki, veri, tur };
  gununRengi();
  const h = harita.yukseklik;
  const katman = harita.bolgeler
    .map((b) => b.duraklar.map((x) => durakHtml(b, x, h, tur, simdiki, yeniler.has(x.id))).join('') + b.motifler.map((m, i) => motifHtml(b, m, i, h)).join(''))
    .join('');
  ciz(`<div class="harita-ust">
      <h1>Yolculuk</h1>
      <p class="harita-ozet" data-test="harita-ozet"><b>${acikSayi}</b>/${liste.length} bölüm · <b>${yildiz}</b> ${YILDIZ.replace('yildiz-sekil', 'yildiz-sekil dolu')}<span class="ekran-disi">yıldız</span></p>
    </div>
    <button type="button" class="harita-vakit" data-harita-vakit aria-label="${tur === 'gece' ? 'Gündüze geç' : 'Geceye geç'}">${ikon(tur === 'gece' ? 'gunes' : 'ay', 20, 1.6)}</button>
    <p class="harita-zaman" data-harita-zaman data-test="harita-zaman"><span class="harita-zaman-ic"><b></b><span></span></span></p>
    <div class="harita-perde" data-harita-perde aria-hidden="true"></div>
    <div class="harita ${tur}" data-test="harita" data-vakit="${tur}" style="aspect-ratio:${W}/${(H * h).toFixed(1)}">
      ${harita.bolgeler.map((b, i) => resimHtml(b, i, h, tur, sinir)).join('')}
      ${harita.bolgeler
        .slice(0, -1)
        .map((b, i) => gecisHtml(b, harita.bolgeler[i + 1], h, tur, sinir, liste))
        .join('')}
      <svg class="harita-filtre" width="0" height="0" aria-hidden="true" focusable="false"><filter id="durak-kontur" color-interpolation-filters="sRGB"><feComponentTransfer in="SourceAlpha" result="m"><feFuncA type="discrete" tableValues="0 0 0 1 1 1"/></feComponentTransfer><feComposite in="SourceGraphic" in2="m" operator="in" result="g"/><feMorphology in="m" operator="dilate" radius="1.4" result="k"/><feFlood flood-color="#fff4dc"/><feComposite in2="k" operator="in" result="krem"/><feMorphology in="m" operator="dilate" radius="2.4" result="d"/><feFlood flood-color="#24170c"/><feComposite in2="d" operator="in" result="koyu"/><feMerge><feMergeNode in="koyu"/><feMergeNode in="krem"/><feMergeNode in="g"/></feMerge></filter><filter id="durak-kontur-ince" color-interpolation-filters="sRGB"><feComponentTransfer in="SourceAlpha" result="m"><feFuncA type="discrete" tableValues="0 0 0 1 1 1"/></feComponentTransfer><feComposite in="SourceGraphic" in2="m" operator="in" result="g"/><feMorphology in="m" operator="dilate" radius="1" result="d"/><feFlood flood-color="#24170c"/><feComposite in2="d" operator="in" result="koyu"/><feMerge><feMergeNode in="koyu"/><feMergeNode in="g"/></feMerge></filter></svg>
      <div class="harita-katman">${katman}</div>
    </div>
    ${simdiki ? `<button type="button" class="harita-konum" data-harita-konum data-test="harita-konum" hidden><span class="harita-konum-nokta" aria-hidden="true"></span>Buradasın<span class="harita-konum-ok" aria-hidden="true">${ikon('ileri', 14, 2)}</span></button>` : ''}
    <div class="harita-pencere" data-harita-pencere hidden></div>`);
  const hedef = ekran.querySelector('.harita-durak.simdiki') || ekran.querySelector('.harita-resim');
  if (konumuKoru) window.scrollTo(0, eskiY);
  else if (hedef) {
    konumaKaydir();
    requestAnimationFrame(() => konumaKaydir());
  }
  // köprülerdeki dönem adı o dönemin harfiyle (İş 48)
  for (const g of ekran.querySelectorAll('[data-gecis]')) harfUygula(g.querySelector('.harita-gecis-yazi b'), BOLGE_HARFLERI[g.dataset.gecis]);
  konumIzle();
  gecisleriIzle();
  kaydirmaIzle();
  requestAnimationFrame(kaydirmaIzle);
  for (const img of ekran.querySelectorAll('.harita-durak img')) ayagaYerlestir(img);
  if (yeniler.size) {
    d.ilerleme.haritaGorulen = gorulenDogrula([...gorulen, ...yeniler]);
    kaydet();
  }
}

  // Sembollerin ayağı (bayrak direği, kaide…) görselden görsele değişir; halkayı tam oraya koymak için
  // en alttaki opak satırın ortasını ölçeriz. Gölgeler yarı saydam olduğundan eşiğin altında kalır.
  const ayakOnbellek = new Map();
  function ayakOlc(img) {
    const w = 96;
    const h = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * w));
    const tuval = document.createElement('canvas');
    tuval.width = w;
    tuval.height = h;
    const c = tuval.getContext('2d', { willReadFrequently: true });
    c.drawImage(img, 0, 0, w, h);
    const veri = c.getImageData(0, 0, w, h).data;
    for (let y = h - 1; y >= 0; y--) {
      let top = 0;
      let say = 0;
      for (let x = 0; x < w; x++) {
        if (veri[(y * w + x) * 4 + 3] > 200) {
          top += x;
          say++;
        }
      }
      if (say) return { x: ((top / say + 0.5) / w) * 100, y: ((y + 0.5) / h) * 100 };
    }
    return { x: 50, y: 92 };
  }
  function ayagaYerlestir(img) {
    const uygula = () => {
      if (!img.naturalWidth) return;
      let ayak = ayakOnbellek.get(img.src);
      if (!ayak) {
        try {
          ayak = ayakOlc(img);
        } catch {
          ayak = { x: 50, y: 92 };
        }
        ayakOnbellek.set(img.src, ayak);
      }
      const durak = img.parentElement;
      durak.style.setProperty('--ayak-x', `${ayak.x.toFixed(1)}%`);
      durak.style.setProperty('--ayak-y', `${ayak.y.toFixed(1)}%`);
    };
    if (img.complete) uygula();
    else img.addEventListener('load', uygula, { once: true });
  }

  // ---------- "Buradasın" ----------
// Dönem resmi; son açık durağın üstündeki kısmı sepya: tamamen üstte kalan resim sepya, sınırın geçtiği resmin üstüne
// sepya bir kopyası konur, kopya sınırda yumuşakça silinir (saklı motifler ve duraklar üstte, dokunulabilir kalır)
function resimHtml(b, i, h, tur, sinir) {
  const yer = `top:${((b.ust / h) * 100).toFixed(3)}%;height:${((1 / h) * 100).toFixed(3)}%`;
  const tamSepya = b.ust + 1 <= sinir;
  let html = `<img class="harita-resim${tamSepya ? ' sepya' : ''}" data-test="harita-bolge" data-bolge="${b.id}" alt="${kacis(b.ad)}" decoding="async" ${i < 2 ? '' : 'loading="lazy"'}
      src="${resimAdresi(b.id, tur)}" style="${yer};z-index:${i + 1}">`;
  if (!tamSepya && sinir > b.ust) {
    const yerel = (sinir - b.ust) * 100;
    const maske = `linear-gradient(to bottom, #000 ${Math.max(0, yerel - SEPYA_GECIS * 100).toFixed(2)}%, transparent ${yerel.toFixed(2)}%)`;
    html += `<img class="harita-resim sepya ust-kat" data-test="harita-sepya" aria-hidden="true" alt="" decoding="async" src="${resimAdresi(b.id, tur)}"
      style="${yer};z-index:${i + 1};-webkit-mask-image:${maske};mask-image:${maske}">`;
  }
  return html;
}

// ---------- dönem araları ----------
// İki dönem resminin arasında ARA boyunda bir köprü (resimleri örtmez). Üstteki resmin alt kenarı aşağı, alttakinin
// üst kenarı yukarı aynalanıp gittikçe bulanıklaşarak ortada birbirine karışır: iki dönem kesintisiz akar. Ortada
// ince bir sis tülü ve içinden sızan ışık; ışığın önünde yeni (yukarıdaki) dönemin adı. Ad yapışkandır (sticky).
// Hareketler kaydırmaya bağlıdır ama yumuşatılarak izler (js: kaydirmaIzle → hedef, yumusat → --p, --k).
function gecisHtml(alt, ustB, h, tur, sinir, liste) {
  const bas = ustB.ust + 1; // üstteki resmin alt kenarı (haritanın üstünden, resim boyu cinsinden); ara alt.ust'te biter
  const bolum = liste.filter((x) => bolgeBul(x.sira).id === ustB.id);
  const acik = bolum.filter((x) => x.acik).length;
  const sepya = alt.ust <= sinir;
  const yer = `top:${((bas / h) * 100).toFixed(3)}%;height:${((ARA / h) * 100).toFixed(3)}%`;
  const serit = `background-size:100% ${(100 / ARA).toFixed(1)}%`;
  const ustResim = `${serit};background-image:url('${resimAdresi(ustB.id, tur)}')`;
  const altResim = `${serit};background-image:url('${resimAdresi(alt.id, tur)}')`;
  return `<div class="harita-gecis${sepya ? ' sepya' : ''}${acik ? '' : ' kilitli'}" data-test="harita-gecis" data-gecis="${ustB.id}" style="${yer}">
      <span class="harita-gecis-renk ust yumusak" aria-hidden="true" style="${ustResim}"></span>
      <span class="harita-gecis-renk alt yumusak" aria-hidden="true" style="${altResim}"></span>
      <span class="harita-gecis-renk ust net" aria-hidden="true" style="${ustResim}"></span>
      <span class="harita-gecis-renk alt net" aria-hidden="true" style="${altResim}"></span>
      <span class="harita-gecis-sis" aria-hidden="true"></span>
      <span class="harita-gecis-bulut a" aria-hidden="true"></span>
      <span class="harita-gecis-bulut b" aria-hidden="true"></span>
      <span class="harita-gecis-yarik" aria-hidden="true"></span>
      <span class="harita-gecis-bulut c" aria-hidden="true"></span>
      <p class="harita-gecis-yazi">
        <span class="harita-gecis-yuzyil">${kacis(ustB.yuzyil)}</span>
        <span class="harita-gecis-cizgi" aria-hidden="true"><i class="sol"></i><i class="elmas"></i><i class="sag"></i></span>
        <b>${kacis(ustB.ad)}</b>
        <span class="harita-gecis-bilgi">${bolum.length} bölüm · ${acik ? `${acik} açık` : 'kilitli'}</span>
      </p>
    </div>`;
}

function konumaKaydir(yumusak = false) {
  const el = ekran.querySelector('.harita-durak.simdiki');
  if (!el) return window.scrollTo(0, document.documentElement.scrollHeight);
  const r = el.getBoundingClientRect();
  window.scrollTo({ top: Math.max(0, r.top + window.scrollY - window.innerHeight * 0.55), behavior: yumusak ? 'smooth' : 'auto' });
}

// Şimdiki durak görüş alanından çıkınca üstte küçük bir konum hapı belirir; ok durağın yönünü gösterir
let konumGozcu = null;
function konumIzle() {
  if (konumGozcu) konumGozcu.disconnect();
  const durak = ekran.querySelector('.harita-durak.simdiki');
  const dugme = ekran.querySelector('[data-harita-konum]');
  if (!durak || !dugme || typeof IntersectionObserver !== 'function') return;
  konumGozcu = new IntersectionObserver(([g]) => {
    if (!dugme.isConnected) return konumGozcu.disconnect();
    dugme.hidden = g.isIntersecting;
    dugme.classList.toggle('asagi', g.boundingClientRect.top > 0);
  });
  konumGozcu.observe(durak);
}

// ---------- durakların yere konması ----------
// Durak ilk kez ekrana girince "kondu" + "inis" (yere konma animasyonu); açılışta zaten görünenler animasyonsuz.
let gecisGozcu = null;
function gecisleriIzle() {
  if (gecisGozcu) gecisGozcu.disconnect();
  const kap = ekran.querySelector('[data-test="harita"]');
  if (!kap) return;
  if (typeof IntersectionObserver !== 'function') return;
  kap.classList.add('izleniyor');
  let ilk = true;
  gecisGozcu = new IntersectionObserver(
    (girdiler) => {
      if (!kap.isConnected) return gecisGozcu.disconnect();
      let konan = 0;
      for (const g of girdiler) {
        const el = g.target;
        if (el.classList.contains('harita-durak')) {
          // ekrana giren durak yerine konar; açılışta zaten görünenler animasyonsuz
          if (!g.isIntersecting || el.classList.contains('kondu')) continue;
          el.classList.add('kondu');
          if (kap.classList.contains('hazir')) {
            el.style.setProperty('--kon-gecikme', `${(konan++ * 0.09).toFixed(2)}s`);
            el.classList.add('inis');
          }
        }
      }
      if (ilk) {
        ilk = false;
        requestAnimationFrame(() => requestAnimationFrame(() => kap.classList.add('hazir')));
      }
    },
    { threshold: [0] },
  );
  for (const el of kap.querySelectorAll('.harita-durak')) gecisGozcu.observe(el);
  ekGozcu?.disconnect();
  // ek ekranın orta bölgesine girdikçe animasyon baştan oynar, çıkınca geri sarılır
  ekGozcu = new IntersectionObserver(
    (girdiler) => {
      if (!kap.isConnected) return ekGozcu.disconnect();
      for (const g of girdiler) {
        if (!g.isIntersecting) g.target.classList.remove('gorundu');
        else if (!geriGidiyor) g.target.classList.add('gorundu');
      }
    },
    { rootMargin: '-18% 0px -18% 0px', threshold: [0] },
  );
  for (const el of kap.querySelectorAll('.harita-gecis')) ekGozcu.observe(el);
}
let ekGozcu = null;

// ---------- kaydırma: derinlik ve zaman göstergesi ----------
// Geçiş şeritlerinde sis ve yazı haritadan farklı hızda kayar (--p: şeridin ekran ortasına uzaklığı, ekran boyu
// cinsinden). Sağ üstteki gösterge ekranın ortasına en yakın dönemi yazar; dönem değişince kayarak değişir.
const azHareket = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
let kaydirmaBekliyor = false;
// Köprü değerleri hedefe her karede bir miktar yaklaşır (ataletli izleme): ani kaydırmada bile geçiş süzülür.
let yumusatiyor = false;
function yumusat() {
  const kap = ekran.querySelector('[data-test="harita"]');
  if (!kap || !kap.isConnected) return (yumusatiyor = false);
  let devam = false;
  let enK = 0;
  for (const ek of kap.querySelectorAll('.harita-gecis')) {
    const h = ek._hedef;
    const s = ek._su;
    if (!h || !s) continue;
    s.p += (h.p - s.p) * 0.16;
    s.k += (h.k - s.k) * 0.09;
    if (Math.abs(h.p - s.p) < 0.001 && Math.abs(h.k - s.k) < 0.001) {
      s.p = h.p;
      s.k = h.k;
    } else devam = true;
    if (s.k > enK) enK = s.k;
    ek.style.setProperty('--p', s.p.toFixed(4));
    ek.style.setProperty('--k', s.k.toFixed(4));
  }
  const perde = ekran.querySelector('[data-harita-perde]');
  if (perde) perde.style.opacity = (enK * 0.35).toFixed(3);
  if (devam) requestAnimationFrame(yumusat);
  else yumusatiyor = false;
}
function kaydirmaIzle() {
  const kap = ekran.querySelector('[data-test="harita"]');
  if (!kap) return;
  const boy = window.innerHeight;
  // zaman yarığı: animasyon kaydırmaya bağlıdır, beklemez. --p: ekin ekran ortasına uzaklığı (ekran boyu
  // cinsinden, -1…1); --k: ortaya yakınlık (0…1, yumuşatılmış). Ek ortaya geldikçe yarık açılır, çizgi uzar,
  // elmas döner, kıvılcımlar farklı hızlarda kayar, ekran kenarları kararır; uzaklaştıkça hepsi geri sarılır.
  if (!azHareket()) {
    for (const ek of kap.querySelectorAll('.harita-gecis')) {
      const r = ek.getBoundingClientRect();
      if (r.bottom < -boy || r.top > boy * 2) continue;
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - boy * 0.5) / boy));
      const t = Math.max(0, 1 - Math.abs(p) / 0.75);
      let k = t * t * (3 - 2 * t);
      // geri giderken hiçbir şey oynamaz: köprü olduğu gibi kalır; hiç görülmemişse açık hâliyle durur
      if (geriGidiyor) k = ek._hedef ? ek._hedef.k : 1;
      ek._hedef = { p, k };
      if (!ek._su) ek._su = { p, k: geriGidiyor ? k : 0 };
    }
    if (!yumusatiyor) {
      yumusatiyor = true;
      requestAnimationFrame(yumusat);
    }
  }
  const gosterge = ekran.querySelector('[data-harita-zaman]');
  if (!gosterge) return;
  let en = null;
  let enUzak = Infinity;
  for (const img of kap.querySelectorAll('.harita-resim[data-bolge]')) {
    const r = img.getBoundingClientRect();
    const uzak = Math.abs(r.top + r.height / 2 - boy * 0.5);
    if (uzak < enUzak) {
      enUzak = uzak;
      en = img.dataset.bolge;
    }
  }
  const b = BOLGELER.find((x) => x.id === en);
  if (!b || gosterge.dataset.bolge === en) return;
  const ilk = !gosterge.dataset.bolge;
  gosterge.dataset.bolge = en;
  gosterge.querySelector('b').textContent = b.ad;
  gosterge.querySelector('b + span').textContent = b.yuzyil;
  gosterge.classList.add('gorunur');
  if (ilk || geriGidiyor) return;
  const ic = gosterge.querySelector('.harita-zaman-ic');
  ic.classList.remove('degisti');
  void ic.offsetWidth; // animasyonu baştan oynatmak için
  ic.classList.add('degisti');
}
// Yolculuk alttan başlar, yeni dönemler yukarıdadır: ilerlemek = yukarı kaydırmak. Geçiş animasyonları yalnızca
// ilerlerken oynar; aşağı (eski dönemlere) dönüşte sessiz kalır.
let sonKaydirmaY = typeof window !== 'undefined' ? window.scrollY : 0;
let geriGidiyor = false;
function kaydirmaSirasi() {
  const y = window.scrollY;
  if (y !== sonKaydirmaY) geriGidiyor = y > sonKaydirmaY;
  sonKaydirmaY = y;
  if (kaydirmaBekliyor) return;
  kaydirmaBekliyor = true;
  requestAnimationFrame(() => {
    kaydirmaBekliyor = false;
    kaydirmaIzle();
  });
}

// ---------- küçük pencereler ----------
function akimOzeti(ad) {
  const m = (d.akimBilgi && d.akimBilgi.akimlar && d.akimBilgi.akimlar[ad]) || null;
  if (!m || !m.metin) return '';
  const cumleler = m.metin.match(/[^.!?]+[.!?]+/g) || [m.metin];
  return cumleler.slice(0, 2).join(' ').trim();
}

function durakPenceresi(id) {
  const h = d.haritaDurum;
  const x = h && h.liste.find((y) => y.id === id);
  if (!x) return '';
  const bolge = bolgeBul(x.sira);
  const sanatcilar = x.sanatcilar.map((s) => d.harita.get(s)).filter(Boolean);
  const satirlar = BOLUM_SEVIYELER.map((sv) => {
    const acik = x.seviyeAcik[sv];
    const en = x.kayit[sv];
    const gecti = (en ?? 0) >= BOLUM_GECME;
    const bilgi = en === undefined ? `${BOLUM_SORU[sv]} soru` : `en iyi %${Math.round(en * 100)}`;
    const ad = `${SEVIYE_AD[sv]}${sv === 'zor' ? ' · isteğe bağlı' : ''}`;
    const cizgi = `<span class="harita-seviye-cizgi" aria-hidden="true" style="--gec:${Math.round(BOLUM_GECME * 100)}%"><i style="--o:${Math.round((en ?? 0) * 100)}%"></i></span>`;
    return acik
      ? `<a class="harita-seviye${gecti ? ' gecti' : ''}" href="#/pekistir/bolum/${x.id}/${sv}" data-test="harita-seviye" data-seviye="${sv}">
          <b>${ad}</b><span>${bilgi}${gecti ? ' · geçti' : ''}</span>${gecti ? YILDIZ.replace('yildiz-sekil', 'yildiz-sekil dolu') : ikon('ileri', 18, 1.5)}${cizgi}</a>`
      : `<span class="harita-seviye kapali" data-test="harita-seviye" data-seviye="${sv}"><b>${ad}</b><span>${sv === 'orta' ? 'Kolay’ı geçince' : 'Orta’yı geçince'}</span>${ikon('kilit', 16, 1.7)}</span>`;
  }).join('');
  const govde = x.acik
    ? `${yildizHtml(x.yildiz)}
      ${x.no === 1 && akimOzeti(x.akim) ? `<p class="harita-pencere-akim">${kacis(akimOzeti(x.akim))}</p>` : ''}
      <div class="harita-seviyeler">${satirlar}</div>
      <p class="harita-pencere-alt">Geçmek için %${Math.round(BOLUM_GECME * 100)} doğru</p>`
    : `<p class="harita-pencere-durum" data-test="harita-kilit">${kacis(kilitMetni(x, bolumler()))}</p>`;
  return `<div class="harita-pencere-ic${x.acik ? '' : ' kilitli'}" role="dialog" aria-label="${kacis(bolumAdi(x))}">
      ${sanatcilar.length ? `<span class="hp-kapak" aria-hidden="true" data-kapak="${kacis(sanatcilar.map((s) => s.id).join(','))}"></span>` : ''}
      <button class="harita-pencere-kapat" type="button" data-harita-kapat aria-label="Kapat">${ikon('kapat', 20, 1.7)}</button>
      <header class="hp-baslik">
        <span class="etiket">${kacis(bolge.ad)}</span>
        <h2>${kacis(bolumAdi(x))}</h2>
      </header>
      ${govde}
      <div class="harita-pencere-sanatcilar">${sanatcilar
        .map((s, i) => {
          const ic = `<span class="harita-yuz" style="--i:${i}" data-kucuk="${kacis(s.id)}" data-genislik="200"></span><span class="harita-yuz-ad">${kacis(s.ad)}</span>`;
          return x.acik ? `<a href="#/sanatci/${encodeURIComponent(s.id)}">${ic}</a>` : `<span class="kilitli">${ic}</span>`;
        })
        .join('')}</div>
      <div class="harita-pencere-dugmeler"><a class="dugme" href="#/akim/${encodeURIComponent(x.akim)}" data-test="harita-akim">Akım sayfası</a>${
        x.acik ? `<a class="dugme" href="#/pekistir/bolum/${x.id}/tanitim" data-test="harita-tanitim">Tanıtım</a>` : ''
      }${
        x.acik && x.seviyeAcik.orta ? `<a class="dugme" href="#/pekistir/bolum/${x.id}/tanitim-orta" data-test="harita-tanitim-orta">Orta tanıtımı</a>` : ''
      }</div>
    </div>`;
}

function motifPenceresi(eser) {
  const h = d.haritaDurum;
  const m = h && h.veri.eserler && h.veri.eserler[eser];
  if (!m) return '';
  const s =
    (m.sanatci_id && d.harita.get(m.sanatci_id)) ||
    d.sanatcilar.find((x) => m.sanatci && (x.ad === m.sanatci || (x.ad_arama && m.sanatci.includes(x.ad_arama)) || m.sanatci.includes(x.ad)));
  const kunye = [m.sanatci, m.yil, m.yer, m.teknik].filter(Boolean).map(kacis).join(' · ');
  return `<div class="harita-pencere-ic motif" role="dialog" aria-label="${kacis(m.eser_tr || eser)}" data-test="harita-motif-pencere">
      <button class="harita-pencere-kapat" type="button" data-harita-kapat aria-label="Kapat">${ikon('kapat', 20, 1.7)}</button>
      <span class="etiket">Saklı motif</span>
      <h2>${kacis(m.eser_tr || eser)}</h2>
      ${kunye ? `<p class="harita-pencere-eser">${kunye}</p>` : ''}
      ${m.hikaye ? `<p class="okuma">${kacis(m.hikaye)}</p>` : ''}
      ${m.haritada ? `<p class="harita-pencere-alt italik">${kacis(m.haritada)}</p>` : ''}
      ${s ? `<div class="harita-pencere-dugmeler"><a class="dugme" href="#/sanatci/${encodeURIComponent(s.id)}">${kacis(s.ad)} sayfası</a></div>` : ''}
    </div>`;
}

function pencereAc(html) {
  const kutu = ekran.querySelector('[data-harita-pencere]');
  if (!kutu || !html) return;
  kutu.innerHTML = html;
  kutu.hidden = false;
  requestAnimationFrame(() => kutu.classList.add('acik'));
  kutu.querySelector('[data-harita-kapat]').focus({ preventScroll: true, focusVisible: false });
  kucukKareleriDoldur();
  kapakDoldur(kutu.querySelector('[data-kapak]'));
}

function gorselBoyutu(src) {
  return new Promise((coz) => {
    const img = new Image();
    img.onload = () => coz(img.naturalWidth / img.naturalHeight || 0);
    img.onerror = () => coz(0);
    img.src = src;
  });
}

// Bölümün sanatçılarının en bilinen eserleri arasından kapağa en yatay olanı seçilir; eser kırpılmadan ortalanır,
// boşluğu kendi bulanık kopyası doldurur.
async function kapakDoldur(el) {
  if (!el) return;
  const ids = el.dataset.kapak.split(',').slice(0, 6);
  const adaylar = (
    await Promise.all(ids.map((id) => d.harita.get(id)).filter(Boolean).map((s) => sanatciEserleri(s).then(enBilinen).catch(() => null)))
  ).filter(Boolean);
  const kalip = document.createElement('template');
  const olcumler = await Promise.all(
    adaylar.map(async (e) => {
      kalip.innerHTML = kucukGorsel(e, 640);
      const src = kalip.content.querySelector('img')?.getAttribute('src');
      return { html: kalip.innerHTML, oran: src ? await gorselBoyutu(src) : 0, ad: e.baslik || e.ad || '' };
    }),
  );
  const sirali = olcumler.filter((o) => o.oran).sort((a, b) => b.oran - a.oran);
  const en = sirali[0];
  if (!en || !el.isConnected) return;
  const yanlar = sirali.slice(1, 3);
  const yan = (o, taraf) => (o ? `<span class="hp-kapak-yan ${taraf}">${o.html}</span>` : '');
  const toz = Array.from({ length: 9 }, (_, i) => `<i style="--x:${(18 + ((i * 41) % 64)).toFixed(0)}%;--g:${((i * 0.83) % 6).toFixed(2)}s;--s:${(5 + (i % 4)).toFixed(0)}s"></i>`).join('');
  const ad = en.ad;
  el.innerHTML = `<span class="hp-kapak-isik" aria-hidden="true"></span><span class="hp-kapak-toz" aria-hidden="true">${toz}</span>
    <span class="hp-kapak-duvar">${yan(yanlar[0], 'sol')}<span class="hp-kapak-eser">${en.html}</span>${yan(yanlar[1], 'sag')}</span>
    ${ad ? `<span class="hp-kapak-kunye">${kacis(ad)}</span>` : ''}`;
  el.classList.add('dolu');
}

function pencereKapat() {
  const kutu = ekran.querySelector('[data-harita-pencere]');
  if (!kutu || kutu.hidden) return false;
  kutu.classList.remove('acik');
  kutu.hidden = true;
  for (const el of ekran.querySelectorAll('.harita-durak.secili')) el.classList.remove('secili');
  return true;
}

export function olaylariBagla() {
  ekran.addEventListener('click', (e) => {
    if (!ekran.querySelector('[data-test="harita"]')) return;
    const durak = e.target.closest('[data-bolum]');
    if (durak) {
      for (const el of ekran.querySelectorAll('.harita-durak.secili')) el.classList.remove('secili');
      durak.classList.add('secili');
      pencereAc(durakPenceresi(durak.dataset.bolum));
      return;
    }
    const motif = e.target.closest('[data-motif]');
    if (motif) {
      pencereAc(motifPenceresi(motif.dataset.motif));
      return;
    }
    if (e.target.closest('[data-harita-konum]')) {
      pencereKapat();
      konumaKaydir(true);
      return;
    }
    if (e.target.closest('[data-harita-vakit]')) {
      d.haritaVakti = (d.haritaVakti || vakit()) === 'gece' ? 'gunduz' : 'gece';
      const cevir = () => haritaSayfasi({ konumuKoru: true });
      // destekleyen tarayıcıda gündüz ve gece birbirine yumuşakça geçer
      if (typeof document.startViewTransition === 'function' && !azHareket()) document.startViewTransition(cevir);
      else cevir();
      return;
    }
    if (e.target.closest('[data-harita-kapat]')) {
      pencereKapat();
      return;
    }
    if (!e.target.closest('[data-harita-pencere]')) pencereKapat();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') pencereKapat();
  });
  window.addEventListener('scroll', kaydirmaSirasi, { passive: true });
  window.addEventListener('resize', kaydirmaSirasi, { passive: true });
}

// İlerleme'nin başındaki giriş: haritanın küçük özeti
export function haritaBagi() {
  const { durumlar: liste, simdiki } = durumlar();
  const acik = liste.filter((x) => x.acik).length;
  const yildiz = liste.reduce((t, x) => t + x.yildiz, 0);
  const s = liste.find((x) => x.id === simdiki);
  const b = s ? bolgeBul(s.sira) : bolgeBul(0);
  return `<a class="harita-bag" href="#/harita" data-test="harita-bag">
      <span class="harita-bag-resim" aria-hidden="true"><img alt="" loading="lazy" src="${resimAdresi(b.id, vakit())}"></span>
      <span class="metin"><b>Yolculuk haritası</b><span>${s ? `Buradasın: ${kacis(bolumAdi(s))}` : 'Yolculuk başlamadı'}</span><span>${acik}/${liste.length} bölüm · ${yildiz} yıldız</span></span>
      ${ikon('ileri', 20, 1.4)}
    </a>`;
}
