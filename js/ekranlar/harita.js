// Yolculuk haritası (İş 24): 8 dönem resmi sisle birbirine geçer; alttan (Orta Çağ) yukarıya (Modern) çıkılır.
// Her bölüm yolun kenarında, o dönemin nesnesiyle bir durak; açık durakların altında yumuşak bir ışık yanıp
// söner, "buradasın" durağında dönemin yolcusu ve yukarıdan inen ışık. Durağa dokununca küçük pencere
// (seviyeler, yıldızlar, sanatçılar, akım sayfası); resimdeki saklı motife dokununca eserin hikâyesi.
import { kacis } from '../yardimci.js';
import { ikon } from '../tasarim.js';
import { bolumleriKur, bolumDurumlari, bolumAdi, kilitMetni, BOLUM_SORU, BOLUM_GECME, BOLUM_SEVIYELER } from '../bolum.js';
import { haritaKur, vakit, resimAdresi, nesneAdresi, yolcuAdresi, gorulenDogrula, bolgeBul } from '../harita.js';
import { d, ekran, ciz, ust, islenen, kaydet, gununRengi, cizimNo, guncelMi, jsonGetir } from './ortak.js';

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
const yildizHtml = (n) =>
  `<span class="harita-yildiz" aria-label="${n} / 3 yıldız">${[0, 1, 2].map((i) => `<i class="${i < n ? 'dolu' : ''}">★</i>`).join('')}</span>`;

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
      <p class="harita-ozet" data-test="harita-ozet"><b>${acikSayi}</b>/${liste.length} bölüm · <b>${yildiz}</b> ★</p>
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
      <div class="harita-katman">${katman}</div>
    </div>
    <div class="harita-pencere" data-harita-pencere hidden></div>`);
  const hedef = ekran.querySelector('.harita-durak.simdiki') || ekran.querySelector('.harita-resim');
  const kaydir = () => {
    const el = ekran.querySelector('.harita-durak.simdiki');
    if (!el) return window.scrollTo(0, document.documentElement.scrollHeight);
    const r = el.getBoundingClientRect();
    window.scrollTo(0, Math.max(0, r.top + window.scrollY - window.innerHeight * 0.55));
  };
  if (hedef) {
    kaydir();
    requestAnimationFrame(kaydir);
  }
  if (yeniler.size) {
    d.ilerleme.haritaGorulen = gorulenDogrula([...gorulen, ...yeniler]);
    kaydet();
  }
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
    return acik
      ? `<a class="harita-seviye${gecti ? ' gecti' : ''}" href="#/pekistir/bolum/${x.id}/${sv}" data-test="harita-seviye" data-seviye="${sv}">
          <b>${ad}</b><span>${bilgi}${gecti ? ' · geçti' : ''}</span>${gecti ? '<i aria-hidden="true">★</i>' : ikon('ileri', 18, 1.5)}</a>`
      : `<span class="harita-seviye kapali" data-test="harita-seviye" data-seviye="${sv}"><b>${ad}</b><span>${sv === 'orta' ? 'Kolay’ı geçince' : 'Orta’yı geçince'}</span>${ikon('kilit', 16, 1.7)}</span>`;
  }).join('');
  const govde = x.acik
    ? `${yildizHtml(x.yildiz)}
      ${x.no === 1 && akimOzeti(x.akim) ? `<p class="harita-pencere-akim">${kacis(akimOzeti(x.akim))}</p>` : ''}
      <div class="harita-seviyeler">${satirlar}</div>
      <p class="harita-pencere-alt">Geçmek için %${Math.round(BOLUM_GECME * 100)} doğru</p>`
    : `<p class="harita-pencere-durum" data-test="harita-kilit">${kacis(kilitMetni(x, bolumler()))}</p>`;
  return `<div class="harita-pencere-ic${x.acik ? '' : ' kilitli'}" role="dialog" aria-label="${kacis(bolumAdi(x))}">
      <button class="harita-pencere-kapat" type="button" data-harita-kapat aria-label="Kapat">${ikon('kapat', 20, 1.7)}</button>
      <span class="etiket">${kacis(bolge.ad)}</span>
      <h2>${kacis(bolumAdi(x))}</h2>
      ${govde}
      <p class="harita-pencere-sanatcilar">${sanatcilar
        .map((s) => (x.acik ? `<a href="#/sanatci/${encodeURIComponent(s.id)}">${kacis(s.ad)}</a>` : `<span>${kacis(s.ad)}</span>`))
        .join(' · ')}</p>
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
  kutu.querySelector('[data-harita-kapat]').focus({ preventScroll: true });
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
      <span class="metin"><b>Yolculuk haritası</b><span>${s ? `Buradasın: ${kacis(bolumAdi(s))}` : 'Yolculuk başlamadı'}</span><span>${acik}/${liste.length} bölüm · ${yildiz} ★</span></span>
      ${ikon('ileri', 20, 1.4)}
    </a>`;
}
