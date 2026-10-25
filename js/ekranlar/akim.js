// Akım kimlik kartı (akım sayfasının başında) ve akım karşılaştırması #/akim-karsilastir/<a>/<b> (K3).
import { kacis } from '../yardimci.js';
import { sanatciEserleri, eserBaslik } from '../eserler.js';
import { goruntuleyiciAc } from '../goruntuleyici.js';
import { akimYuzyillari } from '../tasarim.js';
import { bilinenAd } from '../adlar.js';
import { paletBirlestir, tipikKonular, enBilinenEserler, akimKarsilastirmaAdresi, karsilastirmaKomsulari } from '../akim.js';
import {
  d,
  ekran,
  etiket,
  gununRengi,
  ciz,
  islenen,
  ust,
  cerceve,
  kucukGorsel,
  akimRenk,
  akimNoktasi,
  eserPaleti,
  notuIcin,
  gorselTercihi,
  jsonGetir,
  hataGoster,
} from './ortak.js';
import { ikonografiVeri } from './gozat.js';

let ozellikSozu = null;
function ozellikler() {
  if (!ozellikSozu)
    ozellikSozu = jsonGetir('data/akim_ozellikleri.json').then(
      (j) => (j && j.akimlar) || {},
      () => ({}),
    );
  return ozellikSozu;
}

// Akımın verisi: açık üyeleri, en bilinen 4 eseri, paleti (eser görsellerinden), özellikleri ve tipik konuları
const veriBellek = new Map();
function akimVerisi(ad) {
  const k = islenen();
  const anahtar = `${ad}|${k.size}`;
  if (veriBellek.has(anahtar)) return veriBellek.get(anahtar);
  const uyeler = d.sanatcilar.filter((s) => s.akim === ad);
  const acik = uyeler.filter((s) => k.has(s.konu));
  const soz = Promise.all([
    Promise.all(
      acik.map((s) =>
        sanatciEserleri(s).then(
          (eserler) => ({ s, eserler }),
          () => ({ s, eserler: [] }),
        ),
      ),
    ),
    ozellikler(),
    ikonografiVeri().catch(() => []),
  ]).then(async ([listeler, oz, konular]) => {
    const eserler = enBilinenEserler(listeler, 4);
    const paletler = await Promise.all(eserler.map(({ e }) => eserPaleti(e, null).catch(() => null)));
    return {
      ad,
      uyeler,
      acik,
      eserler,
      palet: paletBirlestir(paletler.filter(Boolean)),
      ozellikler: oz[ad] || [],
      konular: tipikKonular(
        konular,
        acik.map((s) => s.id),
      ),
    };
  });
  veriBellek.set(anahtar, soz);
  soz.catch(() => veriBellek.delete(anahtar));
  return soz;
}

function paletSeridi(palet) {
  if (!palet.length) return '<div class="akim-palet bos" aria-hidden="true"></div>';
  return `<div class="akim-palet" role="img" aria-label="Akımın ortalama renkleri">${palet
    .map((p, i) => `<span style="flex-grow:${p.pay.toFixed(3)};background:${p.renk};--i:${i}"></span>`)
    .join('')}</div>`;
}

function ozellikListesi(l) {
  return l.length ? `<ol class="akim-ozellik">${l.map((x) => `<li>${kacis(x)}</li>`).join('')}</ol>` : '';
}

function konuBaglari(l) {
  return l.length
    ? `<p class="akim-konular">${l.map((k) => `<a href="#/konu/${encodeURIComponent(k.id)}">${kacis(k.ad)}<small>${k.n}</small></a>`).join('')}</p>`
    : '';
}

const ROMA = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
// Uzman gözüyle ipuçları: her ipucunun yanında akımın bir eserinden yakın plan bir ayrıntı (büyüteç),
// eser yoksa paletten bir boya lekesi. Kayan bir kesit gibi sırayla belirir.
const AYRINTI_ODAK = ['30% 35%', '68% 28%', '45% 70%', '22% 60%', '75% 65%', '50% 45%'];
function tanimaNotlari(l, eserler, palet) {
  return `<ol class="akim-ozellik akim-ipucu">${l
    .map((x, i) => {
      const eser = eserler.length ? eserler[i % eserler.length].e : null;
      const gorsel = eser ? kucukGorsel(eser, 400) : '';
      const renk = palet.length ? palet[i % palet.length].renk : 'var(--renk)';
      const no = ROMA[i] || String(i + 1);
      const sol = gorsel
        ? `<span class="akim-ipucu-lens" style="--odak:${AYRINTI_ODAK[i % AYRINTI_ODAK.length]};--leke:${renk}" aria-hidden="true">${gorsel}</span>`
        : `<span class="akim-ipucu-rakam" aria-hidden="true">${no}</span>`;
      return `<li style="--i:${i}" class="${gorsel ? '' : 'yazili'}">
        ${sol}
        <span class="akim-ipucu-yazi">${gorsel ? `<span class="akim-ipucu-no">${no}</span>` : ''}${kacis(x)}</span>
      </li>`;
    })
    .join('')}</ol>`;
}

// Tipik konular: bir sergi kataloğunun dizini gibi, iri serif adlar ve üstte eser sayısı
function konuDizini(l) {
  const enCok = Math.max(...l.map((k) => k.n), 1);
  return `<p class="akim-konu-dizin">${l
    .map(
      (k) =>
        `<a href="#/konu/${encodeURIComponent(k.id)}" style="--agirlik:${(0.55 + 0.45 * (k.n / enCok)).toFixed(2)}"><span>${kacis(k.ad)}</span><sup>${k.n}</sup></a>`,
    )
    .join('<span class="akim-konu-ayrac" aria-hidden="true">·</span>')}</p>`;
}

function bolumBasligi(ust, baslik) {
  return `<header class="akim-bolum-bas"><span>${kacis(ust)}</span><h2>${kacis(baslik)}</h2></header>`;
}

function eserIzgarasi(eserler, veri) {
  return `<div class="akim-eserler">${eserler
    .map(
      ({ e, s }, i) =>
        `<button type="button" class="akim-eser" ${veri}="${i}" aria-label="${kacis(eserBaslik(e))} — büyüt">${cerceve(e, { genislik: 400, tembel: true })}<span><b>${kacis(eserBaslik(e))}</b>${kacis(bilinenAd(s.ad, d.kisaAdlar[s.id]))}</span></button>`,
    )
    .join('')}</div>`;
}

// Her akım sayfası kendi döneminin üslubuyla giyinir (pekiştir düğmesi ve bölüm başlıkları)
const USLUPLAR = {
  antik: ['Antik Yunan ve Roma'],
  ortacag: ['Romanesk', 'Gotik', 'Uluslararası Gotik'],
  ronesans: ['Erken Rönesans', 'Kuzey Rönesansı', 'Yüksek Rönesans', 'Venedik Rönesansı', 'Maniyerizm', 'Fransız Klasisizmi'],
  barok: ['İtalyan Barok ve Caravaggizm', 'İspanyol Barok', 'Flaman Barok', 'Hollanda Altın Çağı', 'Geç İtalyan Barok'],
  rokoko: ['Rokoko'],
  neoklasik: ['Neoklasisizm', 'Akademizm ve Oryantalizm'],
  romantik: ['Romantizm', 'Prerafaelitler', 'Sembolizm'],
  realizm: ['Barbizon ve Realizm'],
  empresyonizm: ['Empresyonizm', 'Post-Empresyonizm'],
  ukiyoe: ['Ukiyo-e (Japon baskısı)'],
  artnouveau: ['Art Nouveau ve Viyana Secession'],
  ekspresyonizm: ['Ekspresyonizm', 'Savaş sonrası figürasyon'],
  kubizm: ['Kübizm'],
  dada: ['Dada'],
  surrealizm: ['Sürrealizm'],
};
const USLUP_HARITA = new Map(Object.entries(USLUPLAR).flatMap(([u, l]) => l.map((a) => [a, u])));
export function akimUslubu(ad) {
  return USLUP_HARITA.get(ad) || 'ronesans';
}

// Dada'da düğme adı fidye mektubu gibi harf harf karışık kesilir
function dugmeAdi(ad, uslup) {
  if (uslup !== 'dada') return kacis(ad);
  return [...ad].map((c, i) => (c === ' ' ? ' ' : `<span class="kesik" style="--k:${i % 4}">${kacis(c)}</span>`)).join('');
}

let bilgiSozu = null;
function akimBilgisi() {
  if (d.akimBilgi) return Promise.resolve(d.akimBilgi);
  if (!bilgiSozu)
    bilgiSozu = jsonGetir('data/akim_bilgi.json').then(
      (j) => (d.akimBilgi = j || { akimlar: {} }),
      () => {
        bilgiSozu = null;
        return { akimlar: {} };
      },
    );
  return bilgiSozu;
}

const ILK_CUMLE = /^(.+?[.!?])(?=\s+[A-ZÇĞİÖŞÜ])/s;
// Düğmedeki dönem bilgisi: "y. 1400–1490 · Floransa merkezli" ve açıklamanın ilk cümlesi; veri yoksa boş
function dugmeBilgisi(ad) {
  const b = d.akimBilgi && d.akimBilgi.akimlar && d.akimBilgi.akimlar[ad];
  if (!b) return '';
  const yer = (b.yer || '').split(';')[0].trim();
  const kunye = [b.donem, yer].filter(Boolean).map(kacis).join(' · ');
  const metin = (b.metin || '').trim();
  const cumle = (metin.match(ILK_CUMLE) || [null, metin])[1];
  return `${kunye ? `<span class="donem-dugme-kunye">${kunye}</span>` : ''}${cumle ? `<span class="donem-dugme-soz">${kacis(cumle)}</span>` : ''}`;
}

// Düğmedeki tablo, dönemin kendi tekniğiyle sahnede yeniden kurulur
const TEKNIKLER = {
  antik: 'Mozaik — taş taş döşenir',
  ortacag: 'Vitray — ışık camdan süzülür',
  ronesans: 'Perspektif — kaçış noktasından kurulur',
  barok: 'Chiaroscuro — karanlıktan ışığa',
  rokoko: 'Yelpaze — zarafetle açılır',
  neoklasik: 'Sütunlar — düzen ve simetri',
  romantik: 'Fırtına — sisin ardından şimşek',
  realizm: 'Örtü — olduğu gibi, süssüz',
  empresyonizm: 'Fırça lekeleri — ışığın izlenimi',
  ukiyoe: 'Kalıp baskı — önce çizgi, sonra renk',
  artnouveau: 'Kamçı çizgisi — doğadan doğan biçim',
  ekspresyonizm: 'Bıçak darbesi — ham duygu',
  kubizm: 'Yüzeyler — aynı anda her açıdan',
  dada: 'Kolaj — yırt, yapıştır, karıştır',
  surrealizm: 'Rüya — akar, süzülür',
};

export function pekistirDugmesi(ad, uslup, adet) {
  return `<div class="donem-cta"><a class="donem-dugme" data-teknik="${uslup}" href="#/pekistir/donem/${encodeURIComponent(ad)}" aria-label="${kacis(ad)} dönemini pekiştir">
    <span class="donem-sahne" aria-hidden="true" data-dugme-tablo></span>
    <span class="donem-dugme-etiket">
      <span class="donem-dugme-ust"><span>Bu dönemi pekiştir</span><span class="donem-dugme-sayi">${adet} sanatçı</span></span>
      <span class="donem-dugme-ad">${dugmeAdi(ad, uslup)}</span>
      <span class="donem-dugme-teknik">${kacis(TEKNIKLER[uslup] || '')}</span>
      <span class="donem-dugme-bilgi" data-dugme-bilgi>${dugmeBilgisi(ad)}</span>
      <span class="donem-dugme-eser" data-dugme-eser></span>
      <span class="donem-dugme-ok">Tura başla <span aria-hidden="true">&rarr;</span></span>
    </span>
  </a></div>`;
}

// Dönem adından türeyen tohumlu rastgele: her ziyarette aynı kompozisyon
function tohumlu(metin) {
  let h = 2166136261;
  for (const c of metin) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const yuzde = (n) => `${n.toFixed(2)}%`;
const parca = (sinif, stil) => `<span class="${sinif}" style="${stil}"></span>`;

// Titreşimli ızgara: komşu hücreler köşe paylaşır, böylece parçalar kusursuz birleşir
function titrekIzgara(sutun, satir, oynama, r) {
  const n = [];
  for (let y = 0; y <= satir; y++)
    for (let x = 0; x <= sutun; x++) {
      const kenarX = x === 0 || x === sutun;
      const kenarY = y === 0 || y === satir;
      n.push([
        (x / sutun) * 100 + (kenarX ? 0 : (r() - 0.5) * oynama),
        (y / satir) * 100 + (kenarY ? 0 : (r() - 0.5) * oynama),
      ]);
    }
  const nokta = (x, y) => n[y * (sutun + 1) + x];
  const hucreler = [];
  for (let y = 0; y < satir; y++)
    for (let x = 0; x < sutun; x++) hucreler.push({ x, y, k: [nokta(x, y), nokta(x + 1, y), nokta(x + 1, y + 1), nokta(x, y + 1)] });
  return hucreler;
}

// Çokgeni ağırlık merkezine doğru büzer: aradaki boşluk kurşun/derz çizgisi olur
function cokgen(koseler, buzme) {
  const mx = koseler.reduce((s, k) => s + k[0], 0) / koseler.length;
  const my = koseler.reduce((s, k) => s + k[1], 0) / koseler.length;
  const yol = koseler.map(([x, y]) => `${yuzde(x + (mx - x) * buzme)} ${yuzde(y + (my - y) * buzme)}`).join(',');
  return { yol: `polygon(${yol})`, mx, my };
}

function sahneParcalari(uslup, r) {
  const p = [];
  if (uslup === 'antik') {
    const S = 9;
    const Y = 7;
    for (let y = 0; y < Y; y++)
      for (let x = 0; x < S; x++) {
        const g = 0.35;
        const ins = `inset(${yuzde((y / Y) * 100 + g)} ${yuzde(100 - ((x + 1) / S) * 100 + g)} ${yuzde(100 - ((y + 1) / Y) * 100 + g)} ${yuzde((x / S) * 100 + g)})`;
        p.push(parca('tas', `clip-path:${ins};--g:${(r() * 0.9 + (x + y) * 0.06).toFixed(2)}s;--p:${(0.9 + r() * 0.2).toFixed(2)}`));
      }
  } else if (uslup === 'ortacag' || uslup === 'kubizm') {
    const kubik = uslup === 'kubizm';
    const hucreler = titrekIzgara(kubik ? 4 : 4, kubik ? 3 : 5, kubik ? 34 : 14, r);
    hucreler.forEach(({ x, y, k }) => {
      const parcalar = kubik ? (r() > 0.5 ? [[k[0], k[1], k[2]], [k[0], k[2], k[3]]] : [[k[0], k[1], k[3]], [k[1], k[2], k[3]]]) : [k];
      parcalar.forEach((kose, i) => {
        const c = cokgen(kose, kubik ? 0.02 : 0.05);
        const gecikme = kubik ? r() * 0.8 : y * 0.22 + r() * 0.25;
        const stil = [
          `clip-path:${c.yol}`,
          `transform-origin:${yuzde(c.mx)} ${yuzde(c.my)}`,
          `--g:${gecikme.toFixed(2)}s`,
          `--p:${(kubik ? (i ? 0.86 : 1.08) - r() * 0.06 : 0.96 + r() * 0.1).toFixed(2)}`,
          `--dx:${((r() - 0.5) * 70).toFixed(1)}px`,
          `--dy:${((r() - 0.5) * 50).toFixed(1)}px`,
          `--dr:${((r() - 0.5) * 24).toFixed(1)}deg`,
          `--kx:${((r() - 0.5) * 4).toFixed(1)}px`,
          `--ky:${((r() - 0.5) * 4).toFixed(1)}px`,
          `--kr:${((r() - 0.5) * 2.4).toFixed(2)}deg`,
        ].join(';');
        p.push(parca(kubik ? 'yuzey' : 'cam', stil));
      });
      if (!kubik && x === 0 && y === 0) p.push('<span class="cam-isik"></span>');
    });
  } else if (uslup === 'dada') {
    titrekIzgara(3, 2, 26, r).forEach(({ k }, i) => {
      const kenar = [];
      k.forEach((a, j) => {
        const b = k[(j + 1) % 4];
        kenar.push(a);
        for (let t = 1; t < 4; t++) kenar.push([a[0] + (b[0] - a[0]) * (t / 4) + (r() - 0.5) * 3, a[1] + (b[1] - a[1]) * (t / 4) + (r() - 0.5) * 3]);
      });
      const c = cokgen(kenar, 0.04);
      p.push(
        parca(
          'kupur',
          `clip-path:${c.yol};transform-origin:${yuzde(c.mx)} ${yuzde(c.my)};--g:${(i * 0.16).toFixed(2)}s;--dx:${((r() - 0.5) * 260).toFixed(0)}px;--dy:${(-120 - r() * 120).toFixed(0)}px;--dr:${((r() - 0.5) * 90).toFixed(0)}deg;--kx:${((r() - 0.5) * 8).toFixed(1)}px;--ky:${((r() - 0.5) * 8).toFixed(1)}px;--kr:${((r() - 0.5) * 7).toFixed(1)}deg`,
        ),
      );
    });
    p.push('<span class="bant bant-1"></span><span class="bant bant-2"></span>');
  } else if (uslup === 'ekspresyonizm') {
    const B = 5;
    for (let i = 0; i < B; i++) {
      const ust = (i / B) * 100;
      const alt = ((i + 1) / B) * 100;
      const egim = 14;
      const yol = `polygon(-5% ${yuzde(ust + egim + (r() - 0.5) * 4)}, 105% ${yuzde(ust - egim + (r() - 0.5) * 4)}, 105% ${yuzde(alt - egim + (r() - 0.5) * 4 - 0.8)}, -5% ${yuzde(alt + egim + (r() - 0.5) * 4 - 0.8)})`;
      p.push(parca('kesik-serit', `clip-path:${yol};--g:${(i * 0.13).toFixed(2)}s;--yon:${i % 2 ? 1 : -1}`));
    }
  } else if (uslup === 'neoklasik') {
    const S = 7;
    for (let i = 0; i < S; i++) {
      const sol = (i / S) * 100 + 0.6;
      const sag = 100 - ((i + 1) / S) * 100 + 0.6;
      p.push(parca('sutun', `clip-path:inset(0 ${yuzde(sag)} 0 ${yuzde(sol)});--g:${(Math.abs(i - (S - 1) / 2) * 0.14).toFixed(2)}s`));
    }
  } else if (uslup === 'empresyonizm') {
    for (let i = 0; i < 46; i++) {
      const x = r() * 100;
      const y = r() * 100;
      p.push(parca('leke', `--x:${yuzde(x)};--y:${yuzde(y)};--rx:${(9 + r() * 10).toFixed(1)}%;--ry:${(6 + r() * 7).toFixed(1)}%;--g:${(r() * 1.3).toFixed(2)}s`));
    }
  } else if (uslup === 'ronesans') {
    const cizgi = [];
    const kx = 50;
    const ky = 46;
    for (let i = 0; i <= 10; i++) {
      cizgi.push(`<line pathLength="1" x1="${kx}" y1="${ky}" x2="${i * 10}" y2="100" style="--g:${(i * 0.05).toFixed(2)}s"/>`);
      cizgi.push(`<line pathLength="1" x1="${kx}" y1="${ky}" x2="${i * 10}" y2="0" style="--g:${(0.3 + i * 0.05).toFixed(2)}s"/>`);
    }
    [62, 74, 88].forEach((y, i) => cizgi.push(`<line pathLength="1" x1="0" y1="${y}" x2="100" y2="${y}" style="--g:${(0.7 + i * 0.1).toFixed(2)}s"/>`));
    p.push(`<svg class="perspektif" viewBox="0 0 100 100" preserveAspectRatio="none">${cizgi.join('')}<circle cx="${kx}" cy="${ky}" r="1.2"/></svg>`);
  } else if (uslup === 'artnouveau') {
    p.push(
      `<svg class="kamci" viewBox="0 0 100 100" preserveAspectRatio="none"><path pathLength="1" d="M8 98 C2 90 14 84 10 76 L8 40 C8 14 30 4 50 4 C70 4 92 14 92 40 L90 76 C86 84 98 90 92 98"/><path pathLength="1" d="M4 96 C10 92 14 98 8 100 M96 96 C90 92 86 98 92 100"/></svg>`,
    );
  } else if (uslup === 'ukiyoe') {
    p.push('<span class="hanko"></span>');
  } else if (uslup === 'surrealizm') {
    p.push('<span class="golge"></span>');
  }
  return p.join('');
}

// Sürrealizm perdesi: üstte dolu, ortada damlalı kenar, altta boş — aşağı kaydıkça resim "akar"
function damlaMaskesi(r) {
  let yol = 'M0 0 H100 V100';
  for (let x = 100; x > 0; x -= 10) {
    const boy = 8 + r() * 22;
    yol += ` L${x - 2} 100 C${x - 2} ${100 + boy} ${x - 7} ${100 + boy} ${x - 7} 100 L${x - 10} 100`;
  }
  yol += ' Z';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 300" preserveAspectRatio="none"><path d="${yol}" fill="black"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// Kimlik verisi gelince düğmeye dönemin en bilinen eseri yerleşir; görününce dönemin tekniğiyle kurulur
function dugmeyiGiydir(ad, eserler) {
  const dugme = ekran.querySelector('.donem-dugme');
  if (!dugme) return;
  const bilgi = dugme.querySelector('[data-dugme-bilgi]');
  if (bilgi && !bilgi.innerHTML.trim()) bilgi.innerHTML = dugmeBilgisi(ad);
  const ilk = eserler[0];
  const sahne = dugme.querySelector('[data-dugme-tablo]');
  if (!ilk || !sahne || sahne.firstChild) return;
  sahne.innerHTML = kucukGorsel(ilk.e, 800);
  const img = sahne.querySelector('img');
  if (!img) return;
  img.loading = 'eager';
  const eserYazi = dugme.querySelector('[data-dugme-eser]');
  const goster = () => {
    if (img.naturalWidth === 0 || dugme.classList.contains('tablolu')) return;
    const kaynak = (img.currentSrc || img.src).replace(/["\\\n]/g, (c) => `\\${c === '\n' ? 'a ' : c}`);
    const uslup = dugme.dataset.teknik;
    const r = tohumlu(ad);
    sahne.style.setProperty('--resim', `url("${kaynak}")`);
    if (uslup === 'surrealizm') sahne.style.setProperty('--damla', damlaMaskesi(r));
    sahne.insertAdjacentHTML('beforeend', `<span class="tuval"></span>${sahneParcalari(uslup, r)}`);
    dugme.classList.add('tablolu');
    if (eserYazi) eserYazi.textContent = `${eserBaslik(ilk.e)} — ${bilinenAd(ilk.s.ad, d.kisaAdlar[ilk.s.id])}`;
    sahneyiBaslat(dugme);
  };
  if (img.complete) goster();
  else img.addEventListener('load', goster);
}

// Gösteri düğme ekrana girince başlar; parça katmanları iş bitince kaldırılır ki sayfa hafiflesin
function sahneyiBaslat(dugme) {
  const baslat = () => {
    dugme.classList.add('oynuyor');
    setTimeout(() => dugme.classList.add('kuruldu'), 3600);
  };
  if (!('IntersectionObserver' in window)) return baslat();
  const gozcu = new IntersectionObserver(
    (girdiler) => {
      if (!girdiler.some((g) => g.isIntersecting)) return;
      gozcu.disconnect();
      baslat();
    },
    { threshold: 0.35 },
  );
  gozcu.observe(dugme);
}

export { bolumBasligi };

// Akım sayfasındaki kimlik bölümleri iki yer tutucuya yazılır: üstte en önemliler (tanıma, eserler),
// altta tamamlayıcılar (karşılaştırma, tipik konular). Sanatçılar ve dönem çizelgesi aradadır.
let kimlikEserleri = [];
export async function kimlikDoldur(ad) {
  const ustKutu = ekran.querySelector('[data-kimlik-ust]');
  const altKutu = ekran.querySelector('[data-kimlik-alt]');
  if (!ustKutu) return;
  const [v] = await Promise.all([akimVerisi(ad), akimBilgisi()]);
  if (!ustKutu.isConnected) return;
  kimlikEserleri = v.eserler;
  dugmeyiGiydir(ad, v.eserler);
  const komsular = karsilastirmaKomsulari(ad, d.akimlar).slice(0, 3);
  ustKutu.innerHTML = `${paletSeridi(v.palet)}
      ${
        v.ozellikler.length
          ? `<div class="akim-bolum">${bolumBasligi('Göz eğitimi', 'Nasıl tanınır?')}${tanimaNotlari(v.ozellikler, v.eserler, v.palet)}</div>`
          : ''
      }
      ${
        v.eserler.length
          ? `<div class="akim-bolum">${bolumBasligi('Duvardakiler', 'En bilinen eserler')}${eserIzgarasi(v.eserler, 'data-kimlik-eser')}</div>`
          : ''
      }`;
  if (!altKutu) return;
  altKutu.innerHTML = `${
    komsular.length
      ? `<div class="akim-bolum">${bolumBasligi('Karıştırma', 'Yan yana koy')}<p class="akim-komsular akim-komsu-liste">${komsular
          .map(
            (k) =>
              `<a href="${akimKarsilastirmaAdresi(ad, k)}" data-test="akim-karsilastir-bag" style="--karsi:${akimRenk(k)}"><span class="akim-komsu-nokta" aria-hidden="true"></span><span>${kacis(ad)} <i>ile</i> ${kacis(k)}</span><span class="akim-komsu-ok" aria-hidden="true">→</span></a>`,
          )
          .join('')}</p></div>`
      : ''
  }
      ${
        v.konular.length
          ? `<div class="akim-bolum">${bolumBasligi('Tuvallerde en çok', 'Tipik konular')}${konuDizini(v.konular)}</div>`
          : ''
      }`;
}

// ---------- Akım karşılaştırması ----------
let karsiEserler = [[], []];
export async function akimKarsilastirSayfasi(a, b) {
  const varMi = (x) => d.akimlar.some((y) => y.ad === x);
  if (!varMi(a) || !varMi(b)) return hataGoster(new Error('Akım bulunamadı.'));
  gununRengi();
  ciz(`${ust('Yan yana', `#/akim/${encodeURIComponent(a)}`, { ustEtiket: 'Akım karşılaştır' })}<p class="ikincil kucuk">Hazırlanıyor…</p>`);
  const adres = location.hash;
  const [va, vb] = await Promise.all([akimVerisi(a), akimVerisi(b)]);
  if (location.hash !== adres) return;
  karsiEserler = [va.eserler.slice(0, 2), vb.eserler.slice(0, 2)];
  const sutun = (v, i) => {
    const yillar = akimYuzyillari(v.uyeler, { roma: true });
    return `<div class="akim-karsi-sutun" style="--renk:${akimRenk(v.ad)}" data-test="akim-karsi-sutun">
      <a class="akim-karsi-ad" href="#/akim/${encodeURIComponent(v.ad)}">${akimNoktasi(v.ad)}${kacis(v.ad)}</a>
      <span class="akim-karsi-yil">${kacis(yillar)}</span>
      ${paletSeridi(v.palet)}
      ${eserIzgarasi(karsiEserler[i], `data-karsi-eser-${i}`)}
      ${ozellikListesi(v.ozellikler)}
      ${konuBaglari(v.konular.slice(0, 3))}
    </div>`;
  };
  ciz(`${ust('Yan yana', `#/akim/${encodeURIComponent(a)}`, { ustEtiket: 'Akım karşılaştır' })}
    <div class="akim-karsi" data-test="akim-karsi">${sutun(va, 0)}${sutun(vb, 1)}</div>`);
}

// Ekranın olay dinleyicileri; app.js bir kez bağlar
export function olaylariBagla() {
  ekran.addEventListener('click', (e) => {
    const k = e.target.closest('[data-kimlik-eser]');
    if (k) {
      const x = kimlikEserleri[Number(k.dataset.kimlikEser)];
      if (x)
        goruntuleyiciAc({
          eserler: kimlikEserleri.map((y) => y.e),
          baslangic: Number(k.dataset.kimlikEser),
          notu: (eser) => notuIcin(eser.sid)(eser),
          ...gorselTercihi(),
        });
      return;
    }
    for (const i of [0, 1]) {
      const b = e.target.closest(`[data-karsi-eser-${i}]`);
      if (b) {
        const l = karsiEserler[i].map((y) => y.e);
        goruntuleyiciAc({
          eserler: l,
          baslangic: Number(b.getAttribute(`data-karsi-eser-${i}`)),
          notu: (eser) => notuIcin(eser.sid)(eser),
          ...gorselTercihi(),
        });
        return;
      }
    }
  });
}
