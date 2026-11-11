// İş 171 (Tasarım B): Bugün'de resmin içinde yürüyüş. Sayfa aşağı kaydıkça (her adım bir ekran, kaydırma adıma oturur)
// kamera aynı resmin içinde ayrıntıdan ayrıntıya kayar ve yakınlaşır; yazılar resmin üstünde yarı saydam kartlarda.
// Davranış deneme/yuruyus.html'deki prototipin aynısı (Emre telefonda denedi): siyah boşluk yok (kamera hep ekranı
// kaplar), kart ayrıntıyı kapatmaz, geçişler yavaş. Veri: data/yuruyus.json (noktalar ve metinler değiştirilmez).
import { kacis } from './yardimci.js';

const yumusak = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const IZ = 0.035; // kameranın hedefe her karede yaklaşma payı (yavaş ve yumuşak)
const ACILIS_MS = 2600;
const ARA = 14;
export const SUZUL_MS = 2800; // süzülüşün bütünü
const SUZUL_CIK_MS = 820; // eski yazılar bu sürede solar; sayfa o an hedefe konur
export const ACILIS_Y = 0.36;

// Kapaktan sonraki adımlar: eserin künyesi, ayrıntılar, "Nasıl tanırım?"
export function yuruyusAdimlari({ kayit, kunye, taninma, baslik = kayit.eser }) {
  const kart = (baslik, metin) => `<section class="yur-adim" data-test="yur-adim"><div class="yur-kart"><h2>${kacis(baslik)}</h2><p>${kacis(metin)}</p></div></section>`;
  return [kart(baslik, kunye), ...kayit.noktalar.map((n) => kart(n.ad, n.metin)), taninma ? kart('Nasıl tanırım?', taninma) : ''].join('');
}

// Bir ayrıntı adımının kamerası: kartın gerçek boyu ölçülür; kart altta ve üstte denenir, ayrıntının daha çok
// göründüğü (eşitse daha az yakınlaşan) yerleşim seçilir. Dönen: { cx, cy, s, vy, kartUstte }
export function noktaAdimi(n, { W, H, IW, IH, kirp, kartH, ust, alt, kapla }) {
  const [, ky, , kh] = kirp;
  const cx = (n.x + n.w / 2) * IW;
  const cy = (n.y + n.h / 2) * IH;
  const ustKenar = ky * IH;
  const altKenar = (ky + kh) * IH;
  const dene = (kartUstte) => {
    const aTop = kartUstte ? ust + kartH + ARA : ust;
    const aBot = kartUstte ? H - alt : H - alt - kartH - ARA;
    const vy = (aTop + aBot) / 2;
    const alanH = Math.max(80, aBot - aTop);
    const sigdir = Math.min((W * 0.94) / (n.w * IW), (alanH * 0.92) / (n.h * IH));
    const sc = Math.max(kapla, Math.min(sigdir, 1.1));
    const y0 = n.y * IH;
    const y1 = (n.y + n.h) * IH;
    // ayrıntının kartın dışında görünen payı (0–1); resmin kenarı ekrana girmeyeceği için kenardaki ayrıntı her
    // zaman tam gösterilemez: o zaman en çok görünen ölçek seçilir
    const gorunen = (x) => {
      const ty = Math.min(-ustKenar * x, Math.max(H - altKenar * x, vy - cy * x));
      const a = ty + y0 * x;
      const b = ty + y1 * x;
      return Math.max(0, Math.min(b, aBot) - Math.max(a, aTop)) / Math.max(1, b - a);
    };
    let enIyi = sc;
    let enIyiG = gorunen(sc);
    for (let k = 0, x = sc; k < 25 && enIyiG < 0.97; k++) {
      x *= 1.08;
      const g = gorunen(x);
      if (g > enIyiG + 0.02) {
        enIyi = x;
        enIyiG = g;
      }
    }
    return { kartUstte, vy, sc: enIyi, gor: enIyiG };
  };
  const altta = dene(false);
  const ustte = dene(true);
  const sec = Math.abs(altta.gor - ustte.gor) < 0.05 ? (altta.sc <= ustte.sc ? altta : ustte) : altta.gor > ustte.gor ? altta : ustte;
  return { cx, cy, s: sec.sc, vy: sec.vy, kartUstte: sec.kartUstte, gor: sec.gor };
}

let etkin = null; // aynı anda tek yürüyüş (Bugün); sayfa bellekten geri konunca kaydırma olayıyla yeniden başlar

// kok: .bugun-yuruyus; img: sahnedeki resim; odak: [x, y] yüzde (açılış karesi); hareketsiz: kamera anında yerine geçer
export function yuruyusBaslat({ kok, img, kayit, odak, kucukUrl, buyukUrl, hareketsiz = false, acilis = false, yakin = 1 }) {
  const akis = kok.querySelector('[data-yur-akis]');
  const bolumler = [...akis.querySelectorAll('.yur-adim')];
  const sonAdim = bolumler.length - 1;
  const bulanik = kok.querySelector('.yur-bulanik');
  const ustCubuk = kok.querySelector('.bugun-ust');
  const noktalar = kok.querySelector('.yur-noktalar');
  noktalar.innerHTML = bolumler.map(() => '<i></i>').join('');
  const kirp = Array.isArray(kayit.kirp) && kayit.kirp.length === 4 ? kayit.kirp : [0, 0, 1, 1];
  const [kx, ky, kw, kh] = kirp;
  const kok0 = document.documentElement;
  const y = { kok, gecis: null, suzul: null, D: null, kamera: 0, sonSira: -1, kare: 0, yukari: false, sonY: 0, basladi: 0, IW: 0, IH: 0, W: 0, H: 0 };
  etkin = y;

  function durumlar() {
    const W = (y.W = window.innerWidth);
    const H = (y.H = bolumler[0].offsetHeight || window.innerHeight);
    const { IW, IH } = y;
    const kapla = Math.max(W / (kw * IW), H / (kh * IH));
    const adim = (cx, cy, vy = H / 2) => ({ cx: cx * IW, cy: cy * IH, s: kapla, vy });
    const st = getComputedStyle(bolumler[1] || bolumler[0]);
    const ust = parseFloat(st.getPropertyValue('--yur-ust')) || 64;
    const alt = parseFloat(st.paddingBottom) || 112;
    // açılış karesi: odak yatayda ortada, dikeyde ekranın %36'sında (adın çok üstünde; "Sırayla ortala" çerçevesiyle aynı)
    const ilk = adim(odak[0] / 100, odak[1] / 100, H * ACILIS_Y);
    ilk.s = kapla * yakin; // ana konu alttaysa açılışta biraz yakınlaşılır (adın arkasında kalmasın)
    const D = [ilk, adim(kx + kw / 2, ky + kh / 2)];
    kayit.noktalar.forEach((n, k) => {
      const b = bolumler[k + 2];
      const kart = b && b.querySelector('.yur-kart');
      const a = noktaAdimi(n, { W, H, IW, IH, kirp, kartH: kart ? kart.offsetHeight : H * 0.4, ust, alt, kapla });
      if (b) {
        b.classList.toggle('kart-ustte', a.kartUstte);
        b.dataset.gorunen = a.gor.toFixed(2);
      }
      D.push(a);
    });
    while (D.length < bolumler.length) D.push(adim(1 - odak[0] / 100, 0.5));
    y.D = D;
  }
  // p (kesirli adım) için kamera duruşu: { cx, cy, s, vy }
  function durus(p) {
    const D = y.D;
    const i = Math.max(0, Math.min(D.length - 2, Math.floor(p)));
    const f = yumusak(Math.max(0, Math.min(1, p - i)));
    return karistir(D[i], D[i + 1] || D[i], f);
  }
  function karistir(a, b, f) {
    return {
      s: Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * f),
      cx: a.cx + (b.cx - a.cx) * f,
      cy: a.cy + (b.cy - a.cy) * f,
      vy: a.vy + (b.vy - a.vy) * f,
    };
  }
  function boya({ cx, cy, s, vy }, buyut) {
    const sc = s * buyut;
    const tx = Math.min(-kx * y.IW * sc, Math.max(y.W - (kx + kw) * y.IW * sc, y.W / 2 - cx * sc));
    const ty = Math.min(-ky * y.IH * sc, Math.max(y.H - (ky + kh) * y.IH * sc, vy - cy * sc));
    img.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${sc.toFixed(5)})`;
  }
  const ciz = (p, buyut) => boya(durus(p), buyut);
  function adimiIsaretle(sira) {
    y.sonSira = sira;
    bolumler.forEach((b, k) => b.classList.toggle('gorunur', k === sira));
    [...noktalar.children].forEach((n, k) => n.classList.toggle('acik', k === sira));
    kok.dataset.adim = String(sira);
  }
  const perdeYaz = (asma) => {
    bulanik.style.opacity = asma.toFixed(3);
    ustCubuk.style.setProperty('--perde', asma.toFixed(3));
  };

  // ---------- Süzülüş (İş 172): kapaktan Hayatı'na ve sondan en başa tek, yavaş geçiş ----------
  // Düz kaydırma aradaki bütün adımları hızlı montaj gibi akıtıyordu. Burada sayfa kaydırılmaz: yazılar yerinde
  // solar, kamera aradaki ayrıntılara uğramadan doğrudan son duruşa süzülür (ortada hafifçe nefes alır), buğu yavaşça
  // toplanır ya da dağılır; yazılar görünmezken sayfa hedefe konur ve yeni yazılar yerine süzülerek belirir.
  function suzul(hedef) {
    if (y.gecis) return;
    const asagi = hedef === 'hayat';
    const hayat = akis.querySelector('.yur-hayat');
    const hedefY = asagi ? Math.round(hayat.getBoundingClientRect().top + window.scrollY) : 0;
    const odakla = () => {
      const el = asagi ? hayat.querySelector('h2') : kok.querySelector('.sahne-isim');
      if (!el) return;
      if (asagi) el.tabIndex = -1;
      el.focus({ preventScroll: true });
    };
    if (hareketsiz || !y.D) {
      window.scrollTo(0, hedefY);
      return odakla();
    }
    const g = (y.gecis = {
      t0: performance.now(),
      a: durus(y.kamera),
      b: y.D[asagi ? sonAdim : 0],
      bulA: parseFloat(bulanik.style.opacity) || 0,
      bulB: asagi ? 1 : 0,
      son: asagi ? sonAdim : 0,
      kondu: false,
    });
    kok0.classList.add('yur-suzulus');
    akis.style.setProperty('--suzul-cik', asagi ? '-26px' : '26px');
    akis.style.setProperty('--suzul-gir', asagi ? '40px' : '-28px');
    akis.dataset.suzul = 'cik';
    g.kon = () => {
      if (g.kondu) return;
      g.kondu = true;
      window.scrollTo(0, hedefY);
      y.sonY = hedefY;
      adimiIsaretle(g.son);
      akis.dataset.suzul = 'hazir';
      void akis.offsetHeight; // başlangıç duruşu işlensin: "gir" oradan süzülür
      akis.dataset.suzul = 'gir';
    };
    g.bitir = () => {
      if (y.gecis !== g) return;
      clearTimeout(g.z1);
      window.removeEventListener('wheel', g.bitir);
      window.removeEventListener('touchstart', g.bitir);
      g.kon();
      y.gecis = null;
      y.kamera = g.son;
      y.yukari = false;
      perdeYaz(g.bulB);
      delete akis.dataset.suzul;
      kok0.classList.remove('yur-suzulus');
      odakla();
    };
    g.z1 = setTimeout(g.kon, SUZUL_CIK_MS);
    // parmak ya da tekerlek araya girerse geçiş beklemeden yerine oturur (kaydırmayla kavga etmez)
    window.addEventListener('wheel', g.bitir, { passive: true, once: true });
    window.addEventListener('touchstart', g.bitir, { passive: true, once: true });
    if (!y.kare) y.kare = requestAnimationFrame(kare);
  }
  y.suzul = suzul;
  function birak() {
    y.kare = 0;
    kok0.classList.remove('yuruyus-icinde');
  }
  function kare(simdi) {
    if (etkin !== y || !kok.isConnected) return birak();
    const H = y.H || window.innerHeight;
    if (y.gecis) {
      const g = y.gecis;
      const t = Math.min(1, (simdi - g.t0) / SUZUL_MS);
      const e = yumusak(t);
      boya(karistir(g.a, g.b, e), 1 + 0.045 * Math.sin(Math.PI * e));
      perdeYaz(g.bulA + (g.bulB - g.bulA) * e);
      noktalar.style.opacity = 0;
      kok0.classList.remove('yuruyus-icinde');
      if (t >= 1) g.bitir();
      y.kare = requestAnimationFrame(kare);
      return;
    }
    const hedef = Math.max(0, Math.min(sonAdim, window.scrollY / H));
    const fark = hedef - y.kamera;
    y.kamera = hareketsiz || Math.abs(fark) < 0.0005 ? hedef : y.kamera + fark * IZ;
    // açılış: resim hafif yakından uzaklaşarak yerine oturur
    const t = acilis && !hareketsiz ? Math.min(1, (simdi - y.basladi) / ACILIS_MS) : 1;
    ciz(y.kamera, 1 + 0.08 * (1 - yumusak(t)));
    const sira = Math.round(y.kamera);
    if (sira !== y.sonSira && Math.abs(y.kamera - sira) < 0.18) adimiIsaretle(sira);
    const asma = Math.max(0, Math.min(1, (window.scrollY - sonAdim * H) / (H * 0.6)));
    perdeYaz(asma);
    noktalar.style.opacity = y.kamera < 0.5 || asma > 0.3 ? 0 : 1;
    // yürürken sekme çubuğu gizlenir (resim bütün ekranı kaplasın); yukarı kaydırınca, kapakta ve sonda geri gelir
    kok0.classList.toggle('yuruyus-icinde', hedef > 0.5 && asma < 0.5 && !y.yukari);
    y.kare = requestAnimationFrame(kare);
  }
  const kaydi = () => {
    if (etkin !== y) return window.removeEventListener('scroll', kaydi);
    if (!kok.isConnected) return;
    const fark = window.scrollY - y.sonY;
    if (Math.abs(fark) > 6) {
      y.yukari = fark < 0;
      y.sonY = window.scrollY;
    }
    if (!y.kare && y.D) y.kare = requestAnimationFrame(kare);
  };
  const olc = () => {
    if (etkin !== y) return window.removeEventListener('resize', olc);
    if (kok.isConnected && y.IW) durumlar();
  };
  window.addEventListener('scroll', kaydi, { passive: true });
  window.addEventListener('resize', olc);

  const hazir = () => {
    if (etkin !== y || !img.naturalWidth) return;
    // mantıksal koordinat: uzun kenar 4000 birim; hangi kopya yüklü olursa olsun CSS boyutu aynı
    const oran = img.naturalWidth / img.naturalHeight;
    y.IW = oran >= 1 ? 4000 : 4000 * oran;
    y.IH = oran >= 1 ? 4000 / oran : 4000;
    img.style.width = `${y.IW}px`;
    img.style.height = `${y.IH}px`;
    durumlar();
    y.basladi = performance.now();
    if (!y.kare) y.kare = requestAnimationFrame(kare);
    kok.classList.add('yur-hazir');
    if (buyukUrl) {
      const buyuk = new Image();
      buyuk.decoding = 'async';
      // büyük kopya önce arkada çözülür, sonra tek karede yerine geçer (çözülmeden değiştirilince resim bir an
      // kararıyordu: tarayıcı eski kopyayı bırakıp yenisini çözene kadar boş çiziyor)
      const gecir = () => {
        if (etkin !== y || !img.isConnected) return;
        img.decoding = 'sync';
        img.src = buyuk.src;
      };
      buyuk.onload = () => (buyuk.decode ? buyuk.decode().then(gecir, gecir) : gecir());
      buyuk.src = buyukUrl;
    }
    // yazı tipleri gelince kartların boyu değişir: yeniden ölç
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(olc);
  };
  img.addEventListener('load', hazir, { once: true });
  img.src = kucukUrl;
  if (img.complete && img.naturalWidth) hazir();
  return y;
}
