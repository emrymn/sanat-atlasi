// Yolculuk haritası (İş 24): 8 dönem resmi sisle birbirine geçer; alttan (Orta Çağ) yukarıya (Modern) çıkılır.
// Her bölüm yolun kenarında, o dönemin nesnesiyle bir durak; açık durakların altında yumuşak bir ışık yanıp
// söner, "buradasın" durağında dönemin yolcusu ve yukarıdan inen ışık. Durağa dokununca küçük pencere
// (seviyeler, yıldızlar, sanatçılar, akım sayfası); resimdeki saklı motife dokununca eserin hikâyesi.
import { kacis } from '../yardimci.js';
import { ikon } from '../tasarim.js';
import { bolumleriKur, bolumDurumlari, bolumAdi, kilitMetni, BOLUM_SORU, BOLUM_GECME, BOLUM_SEVIYELER } from '../bolum.js';
import { haritaKur, vakit, resimAdresi, nesneAdresi, yolcuAdresi, gorulenDogrula, bolgeBul } from '../harita.js';
import { d, ekran, ciz, ust, islenen, kaydet, gununRengi, cizimNo, guncelMi, jsonGetir, kucukKareleriDoldur, kucukGorsel, enBilinen } from './ortak.js';
import { sanatciEserleri } from '../eserler.js';

const W = 390;
const H = 585;
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
  const n = b.nesne;
  const ustY = (b.ust + x.y) * H; // tabanın haritadaki yüksekliği (pt, harita yüksekliği h*H)
  const toplamY = h * H;
  const sol = ((x.x * W - n.ax * n.w) / W) * 100;
  const ustYuzde = ((ustY - n.ay * n.h) / toplamY) * 100;
  const durum = x.acik ? (x.id === simdiki ? 'simdiki' : 'acik') : 'kilit';
  const etiketi = `${bolumAdi(x)}${x.acik ? `, ${x.yildiz} yıldız` : ', kilitli'}${x.id === simdiki ? ', buradasın' : ''}`;
  let parca = `<button type="button" class="harita-durak ${durum}${yeni ? ' yeni' : ''}" data-test="harita-durak" data-bolum="${x.id}" data-acik="${x.acik}"
      style="left:${sol.toFixed(3)}%;top:${ustYuzde.toFixed(3)}%;width:${((n.w / W) * 100).toFixed(3)}%"
      aria-label="${kacis(etiketi)}"><img alt="" decoding="async" src="${nesneAdresi(b.id, tur)}"></button>`;
  const taban = `left:${((x.x * W) / W) * 100}%;top:${((ustY + 2) / toplamY) * 100}%`;
  if (x.acik) parca = `<span class="harita-isik" aria-hidden="true" style="${taban};animation-delay:${((x.no * 0.37) % 2.8).toFixed(2)}s"></span>` + parca;
  if (x.id === simdiki && b.yolcu) {
    const y = b.yolcu;
    const hx = x.x * W + (x.x < 0.5 ? 24 : -24);
    const hy = ustY + 4;
    parca += `<span class="harita-sutun" aria-hidden="true" style="left:${(hx / W) * 100}%;top:${((hy - 170) / toplamY) * 100}%;height:${(174 / toplamY) * 100}%"></span>
      <span class="harita-yer" aria-hidden="true" style="left:${(hx / W) * 100}%;top:${((hy - 2) / toplamY) * 100}%"></span>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<span class="harita-kivilcim" aria-hidden="true" style="left:${((hx - 12 + ((i * 37) % 24)) / W) * 100}%;top:${((hy - 6 - ((i * 13) % 10)) / toplamY) * 100}%;animation-delay:${i * 0.4}s"></span>`).join('')}
      <img class="harita-yolcu" data-test="harita-yolcu" alt="" decoding="async" src="${yolcuAdresi(b.id, tur)}"
        style="left:${((hx - y.ax * y.w) / W) * 100}%;top:${((hy - y.ay * y.h) / toplamY) * 100}%;width:${(y.w / W) * 100}%">`;
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

export async function haritaSayfasi() {
  const no = cizimNo();
  const [veri, bilgi] = await Promise.all([haritaVerisi(), d.akimBilgi ? null : jsonGetir('data/akim_bilgi.json').catch(() => null)]);
  if (bilgi) d.akimBilgi = bilgi;
  if (!guncelMi(no)) return;
  const tur = d.haritaVakti || vakit();
  const { durumlar: liste, simdiki } = durumlar();
  const harita = haritaKur(liste, veri, tur);
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
      <button type="button" class="harita-vakit" data-harita-vakit aria-label="${tur === 'gece' ? 'Gündüze geç' : 'Geceye geç'}">${ikon(tur === 'gece' ? 'gunes' : 'ay', 20, 1.6)}</button>
    </div>
    <div class="harita ${tur}" data-test="harita" data-vakit="${tur}" style="aspect-ratio:${W}/${(H * h).toFixed(1)}">
      ${harita.bolgeler
        .map(
          (b, i) =>
            `<img class="harita-resim${i ? ' sisli' : ''}" data-test="harita-bolge" data-bolge="${b.id}" alt="${kacis(b.ad)}" decoding="async" ${i < 2 ? '' : 'loading="lazy"'}
              src="${resimAdresi(b.id, tur)}" style="top:${((b.ust / h) * 100).toFixed(3)}%;height:${((1 / h) * 100).toFixed(3)}%;z-index:${i + 1}">`,
        )
        .join('')}
      <svg class="harita-filtre" width="0" height="0" aria-hidden="true" focusable="false"><filter id="durak-kontur" color-interpolation-filters="sRGB"><feComponentTransfer in="SourceAlpha" result="m"><feFuncA type="discrete" tableValues="0 0 0 1 1 1"/></feComponentTransfer><feComposite in="SourceGraphic" in2="m" operator="in" result="g"/><feMorphology in="m" operator="dilate" radius="1.4" result="k"/><feFlood flood-color="#fff4dc"/><feComposite in2="k" operator="in" result="krem"/><feMorphology in="m" operator="dilate" radius="2.4" result="d"/><feFlood flood-color="#24170c"/><feComposite in2="d" operator="in" result="koyu"/><feMerge><feMergeNode in="koyu"/><feMergeNode in="krem"/><feMergeNode in="g"/></feMerge></filter></svg>
      <div class="harita-katman">${katman}</div>
    </div>
    ${simdiki ? `<button type="button" class="harita-konum" data-harita-konum data-test="harita-konum" hidden><span class="harita-konum-nokta" aria-hidden="true"></span>Buradasın<span class="harita-konum-ok" aria-hidden="true">${ikon('ileri', 14, 2)}</span></button>` : ''}
    <div class="harita-pencere" data-harita-pencere hidden></div>`);
  const hedef = ekran.querySelector('.harita-durak.simdiki') || ekran.querySelector('.harita-resim');
  if (hedef) {
    konumaKaydir();
    requestAnimationFrame(() => konumaKaydir());
  }
  konumIzle();
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
      }</div>
    </div>`;
}

function motifPenceresi(eser) {
  const h = d.haritaDurum;
  const m = h && h.veri.eserler && h.veri.eserler[eser];
  if (!m) return '';
  const s = d.sanatcilar.find((x) => m.sanatci && (x.ad === m.sanatci || (x.ad_arama && m.sanatci.includes(x.ad_arama)) || m.sanatci.includes(x.ad)));
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
      haritaSayfasi();
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
