// Göz At: akımlar, sanatçı sayfası, bütün eserler, başyapıt okumaları, konular (ikonografi) ve yan yana karşılaştırma.
import { kacis, yillarYaz, bulunmaEki } from '../yardimci.js';
import { akimDurumlari } from '../kilit.js';
import { sanatciEserleri, eserBaslik } from '../eserler.js';
import { gorselUrl, gorselYedek, secilenGorsel } from '../gorsel.js';
import { goruntuleyiciAc } from '../goruntuleyici.js';
import { akimYuzyillari, ikon, yuzyil, roma } from '../tasarim.js';
import { adParcala, bilinenAd } from '../adlar.js';
import { karsilastirmaAdresi, benzerSanatcilar } from '../karsilastir.js';
import { temsilOlabilir, AKIM_KAPAK } from '../temsil.js';
import { basyapitlariAl, basyapitBul, sanatcininBasyapitlari, eserEslestir, oneCikanlar, gorunenBaslik } from '../basyapit.js';
import { ayrintilariAl, eserinAyrintisi } from '../ayrinti.js';
import { enCokKarisanlar } from '../ogrenme.js';
import { akimKarsilastirmaAdresi } from '../akim.js';
import { konulariAl, konuBul, konuHaritasiniAyarla, kapakSec, TUR_AD, TUR_SIRA } from '../ikonografi.js';
import { seviyeKaydi, seviyeDurumu } from '../seviye.js';
import {
  jsonGetir,
  sayfaZemini,
  zeminDonemi,
  akiminDonemi,
  simdikiDonem,
  odakliGorsel,
  odagaKaydir,
  d,
  ekran,
  etiket,
  gununRengi,
  ciz,
  islenen,
  akimNoktasi,
  kucukGorsel,
  hataGoster,
  ekranRengi,
  akimRenk,
  geriDugmesi,
  kotuler,
  notuIcin,
  gorselTercihi,
  ust,
  enBilinen,
  cerceve,
  kucukKareleriDoldur,
  isimHtml,
  acikListe,
  taninma,
  bilinirlikSirasi,
  cizimNo,
  guncelMi,
  hikayeVeri,
  hikayeBulucu,
} from './ortak.js';
import { donemCizelgesi, pekistirmedeMi, notBolumleri, seritUst, eserSeridi } from './bugun.js';
import { kimlikDoldur, akimUslubu, pekistirDugmesi, bolumBasligi } from './akim.js';
import { harfUygula, AKIM_HARFLERI } from '../harfler.js';
import { BOLGELER, bolgeBul } from '../harita.js';
import { imzaGoster } from '../imza.js';
import { kunyeGoster } from '../kunye.js';
import { konuKirpimlari, sanatciKirpimlari } from './tanimaKirpim.js';
import { hareketAz } from '../gecis.js';

// ---------- Başyapıt yakın okumaları ----------
let basyapitSozu = null;
export function basyapitVeri() {
  if (!basyapitSozu)
    basyapitSozu = jsonGetir('data/basyapitlar.json')
      .catch(() => null)
      .then((j) => basyapitlariAl(j, (id) => d.harita.has(id)).filter(temsilOlabilir)); // 1.77.1: temsil dışı eserler Başyapıtlar'da yok
  return basyapitSozu;
}

export const basyapitAdresi = (k) => `#/basyapit/${encodeURIComponent(k)}`;

// İş 171 (Tasarım B · rozetler): hikâyesi olan esere kitap, rehberli incelemesi olana büyüteç rozeti. Küçük resimlerde
// yalnız ikon (uzun = false), büyük kartlarda adıyla. Veri gelmediyse boş; rozetleriEkle veri gelince ekler.
export function eserRozetleri(e, uzun = false) {
  const h = e && hikayeBulucu(e);
  const a = e && ayrintiBulucu(e);
  if (!h && !a) return '';
  const n = a && Array.isArray(a.noktalar) ? a.noktalar.length : 0;
  return `<span class="eser-rozetler${uzun ? ' uzun' : ''}" data-test="eser-rozetler">${
    h
      ? `<span class="eser-rozet" role="img" aria-label="Hikâyesi var">${ikon('kitap', 14, 1.8)}${uzun ? '<span aria-hidden="true">Hikâye</span>' : ''}</span>`
      : ''
  }${a ? `<span class="eser-rozet" role="img" aria-label="Rehberli incelemesi var">${ikon('ara', 14, 1.8)}${uzun ? `<span aria-hidden="true">${n ? `${n} ayrıntı` : 'İncele'}</span>` : ''}</span>` : ''}</span>`;
}
// kutular: eser başına bir öğe (sırayla); rozet öğenin içine eklenir
export async function rozetleriEkle(kutular, eserler) {
  await Promise.all([hikayeVeri(), ayrintiVeri()]);
  [...kutular].forEach((el, i) => {
    const html = eserler[i] && el.isConnected && !el.querySelector('.eser-rozetler') ? eserRozetleri(eserler[i]) : '';
    if (html) el.insertAdjacentHTML('beforeend', html);
  });
}
// İş 151: rehberli inceleme noktaları (data/eser_ayrintilari.json); yoksa boş liste. Sayfalar görüntüleyiciye
// `ayrintilar` olarak bir bulucu verir; veri henüz gelmediyse o eserde inceleme çıkmaz (sonraki açılışta çıkar).
let ayrintiSozu = null;
let ayrintiListesi = [];
export function ayrintiVeri() {
  if (!ayrintiSozu)
    ayrintiSozu = jsonGetir('data/eser_ayrintilari.json')
      .catch(() => null)
      .then((j) => (ayrintiListesi = ayrintilariAl(j)));
  return ayrintiSozu;
}
export const ayrintiBulucu = (e) => eserinAyrintisi(ayrintiListesi, e);
const AYRINTI = { veri: () => ayrintiVeri(), bulucu: (e) => ayrintiBulucu(e) };

async function basyapitBaglariniDoldur(id) {
  const liste = sanatcininBasyapitlari(await basyapitVeri(), id);
  const kutu = ekran.querySelector(`[data-basyapit-bag="${CSS.escape(id)}"]`);
  if (!kutu || !liste.length) return;
  kutu.innerHTML = `<section class="bolum">${etiket('Yakın okuma')}${liste
    .map(
      (b) =>
        `<a class="satir basyapit-bag" href="${basyapitAdresi(b.anahtar)}" data-test="basyapit-bag"><span class="metin"><b>${kacis(b.baslik)}</b><span>${kacis(b.ozet)}</span></span>${ikon('ileri', 20, 1.4)}</a>`,
    )
    .join('')}</section>`;
}

// 1.76.4 (Emre tuvalde "A · Vitrin"i seçti): üstte dönem hapları (yapışkan), altında öne çıkan eserlerin büyük sahnesi
// (hikâyesi olanlar başta; "Tam" harekette kendi kendine değişir), devamı iki sütun duvar. "Hepsi"de her dönemden iki
// eser ve "hepsi" düğmesi; bir dönem seçilince o dönemin bütün eserleri akımlarına göre. Sayfa değişmez: gövde yerinde çizilir.

// 1.88.2 (Emre: kartları gösterip "kaydırma yok hala"): "Hepsi"de her dönemin / konu grubunun altındaki kartlar yana
// kayan bir sıra; ilk SERIT_SAYI eser ve sırayı bitiren "Hepsine bak" oku (Emre: "5 6 tane olsun, sonunda ok").
// Sekmeler arası yana kaydırma kalktı.
const hepsineBak = (nitelik, id, ad, n, birim) =>
  n > SERIT_SAYI
    ? `<li class="serit-son"><button type="button" ${nitelik}="${id}" data-test="serit-hepsi" aria-label="${kacis(ad)}: ${n} ${birim}in hepsi"><span class="serit-ok">${ikon('ileri', 22, 1.6)}</span><b>Hepsine bak</b><small>${n} ${birim}</small></button></li>`
    : '';
const SERIT_SAYI = 6;

function bsyGruplari(liste) {
  const gruplar = [];
  for (const bolge of BOLGELER) {
    const akimlar = d.akimlar
      .filter((a) => bolgeBul(a.sira).id === bolge.id)
      .map((a) => ({ a, l: liste.filter((b) => d.harita.get(b.sanatci).akim === a.ad) }))
      .filter((x) => x.l.length);
    const l = akimlar.flatMap((x) => x.l);
    if (l.length) gruplar.push({ bolge, akimlar, l });
  }
  return gruplar;
}

const bsySanatci = (b) => {
  const s = d.harita.get(b.sanatci);
  return `${kacis(bilinenAd(s.ad, d.kisaAdlar[s.id]))}${b.tarih ? ` · ${kacis(b.tarih)}` : ''}`;
};

function bsySahne(one) {
  const n = one.length;
  if (!n) return '';
  return `<div class="by-sahne${n > 1 ? '' : ' tek'}" data-by-sahne data-test="by-sahne" data-n="${n}" role="group" aria-label="Öne çıkan eserler">
      ${one
        .map((b, i) => {
          const s = d.harita.get(b.sanatci);
          return `<a class="by-sahne-kart${i ? '' : ' secili'}" href="${basyapitAdresi(b.anahtar)}" style="--i:${i}" data-by-slayt="${i}"><span class="by-sahne-resim" data-by-sahne-resim="${kacis(b.anahtar)}"></span><span class="by-sahne-golge" aria-hidden="true"></span><span class="by-sahne-rozet" data-by-sahne-rozet></span><span class="by-sahne-yazi"><small>Öne çıkan · ${kacis(s.akim)}</small><b>${kacis(gorunenBaslik(b))}</b><span>${bsySanatci(b)}</span></span></a>`;
        })
        .join('')}
      ${n > 1 ? `<div class="by-noktalar">${one.map((_, i) => `<button type="button" data-by-nokta="${i}"${i ? '' : ' class="secili"'} style="--i:${i}" aria-label="${i + 1}. öne çıkan eser"><i></i></button>`).join('')}</div>` : ''}
    </div>`;
}

function bsyKart(b, i, k) {
  const s = d.harita.get(b.sanatci);
  const kilit = k.has(s.konu) ? '' : '<span class="by-kilit">henüz kursta yok</span>';
  return `<li style="--i:${i % 6}" data-gozcu><a class="vitrin-kart by-kart" href="${basyapitAdresi(b.anahtar)}" style="--akim:${akimRenk(s.akim)}"><span class="by-cerceve">${kilit}<span class="by-resim" data-basyapit-kucuk="${kacis(b.anahtar)}"></span></span><span class="by-yazi"><b>${kacis(b.baslik)}</b><span>${bsySanatci(b)}</span><small class="vitrin-akim">${kacis(s.akim)}</small></span></a></li>`;
}

function bsyGovdeCiz(liste, gruplar, hikayeli) {
  const govde = ekran.querySelector('[data-by-govde]');
  if (!govde) return;
  const k = islenen();
  const secili = gruplar.find((g) => g.bolge.id === d.bsyDonem) || null;
  if (!secili) d.bsyDonem = null;
  for (const h of ekran.querySelectorAll('[data-by-donem]'))
    if (h.closest('.by-haplar')) h.setAttribute('aria-pressed', String((h.dataset.byDonem || null) === d.bsyDonem));
  const one = oneCikanlar(secili ? secili.l : liste, hikayeli, (b) => k.has(d.harita.get(b.sanatci).konu));
  zeminDonemi(secili ? secili.bolge.id : one[0] ? akiminDonemi(d.harita.get(one[0].sanatci).akim) : '');
  const duvar = (l, sinif = '', son = '') => `<ul class="by-duvar${sinif}" data-test="basyapit-listesi">${l.map((b, i) => bsyKart(b, i, k)).join('')}${son}</ul>`;
  govde.innerHTML = `${bsySahne(one)}${
    secili
      ? `<header class="by-bas by-bas-donem"><h2><span class="by-ad">${kacis(secili.bolge.ad)}</span><small>${kacis(secili.bolge.yuzyil)}</small></h2><span class="by-say">${secili.l.length} eser</span></header>
        ${secili.akimlar.map(({ a, l }) => `<section class="by-bolum" data-gozcu><h3 class="by-akim" style="--akim:${akimRenk(a.ad)}"><span>${kacis(a.ad)}</span><small>${l.length}</small></h3>${duvar(l, ' ritim')}</section>`).join('')}`
      : gruplar
          .map(
            ({ bolge, l }) => `<section class="by-bolum" data-gozcu>
          <header class="by-bas"><h2><span class="vitrin-ad by-ad">${kacis(bolge.ad)}</span><small>${kacis(bolge.yuzyil)}</small></h2>${
            l.length > 2
              ? `<button class="by-hepsi" type="button" data-by-donem="${bolge.id}" data-test="by-hepsi" aria-label="${kacis(bolge.ad)}: ${l.length} eserin hepsi">${l.length} eser${ikon('ileri', 16, 1.8)}</button>`
              : ''
          }</header>
          ${duvar(l.slice(0, SERIT_SAYI), ' serit', hepsineBak('data-by-donem', bolge.id, bolge.ad, l.length, 'eser'))}</section>`,
          )
          .join('')
  }`;
  bsySahneBagla(govde);
  gorunceOynat();
  const eserBul = (anahtar) => {
    const b = basyapitBul(liste, anahtar);
    return sanatciEserleri(d.harita.get(b.sanatci)).then((eserler) => eserEslestir(eserler, b));
  };
  for (const el of govde.querySelectorAll('[data-basyapit-kucuk]'))
    eserBul(el.dataset.basyapitKucuk).then((e) => {
      if (!e || !el.isConnected) return;
      odakliGorsel(el, e, 500);
      rozetleriEkle([el.closest('.by-cerceve') || el], [e]);
    });
  for (const el of govde.querySelectorAll('[data-by-sahne-resim]'))
    eserBul(el.dataset.bySahneResim).then(async (e) => {
      if (!e || !el.isConnected) return;
      odakliGorsel(el, e, 900);
      const img = el.querySelector('img');
      if (img) img.loading = 'eager';
      await Promise.all([hikayeVeri(), ayrintiVeri()]);
      const rozet = el.parentElement.querySelector('[data-by-sahne-rozet]');
      if (rozet && el.isConnected) rozet.innerHTML = eserRozetleri(e, true);
    });
}

// Sahne: "Tam" harekette CSS kendi kendine döndürür; nokta ya da yana kaydırma elle seçime geçirir (.elle).
// Sade / Kapalı'da (ve otomatik testlerde) baştan elle: hiçbir şey kendiliğinden değişmez.
function bsySahneBagla(govde) {
  const sahne = govde.querySelector('[data-by-sahne]');
  const n = sahne ? Number(sahne.dataset.n) : 0;
  if (n < 2) return;
  const kartlar = [...sahne.querySelectorAll('[data-by-slayt]')];
  const noktalar = [...sahne.querySelectorAll('[data-by-nokta]')];
  const t0 = performance.now();
  let secili = 0;
  const sec = (i) => {
    secili = ((i % n) + n) % n;
    sahne.classList.add('elle');
    kartlar.forEach((x, j) => x.classList.toggle('secili', j === secili));
    noktalar.forEach((x, j) => x.classList.toggle('secili', j === secili));
  };
  const simdiki = () => (sahne.classList.contains('elle') ? secili : Math.floor((performance.now() - t0) / 6000) % n);
  if (hareketAz() || document.documentElement.dataset.hareket === 'sade') sec(0);
  let bas = null;
  let kaydi = 0;
  sahne.addEventListener('touchstart', (e) => (bas = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null), { passive: true });
  sahne.addEventListener(
    'touchend',
    (e) => {
      if (!bas) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - bas.x;
      const dy = t.clientY - bas.y;
      bas = null;
      if (Math.abs(dx) < 40 || Math.abs(dx) < 1.5 * Math.abs(dy)) return;
      kaydi = performance.now();
      sec(simdiki() + (dx < 0 ? 1 : -1));
    },
    { passive: true },
  );
  sahne.addEventListener(
    'click',
    (e) => {
      const nokta = e.target.closest('[data-by-nokta]');
      if (nokta) return sec(Number(nokta.dataset.byNokta));
      // yana kaydırmanın ardından gelen dokunuş eseri açmasın
      if (performance.now() - kaydi < 450) (e.preventDefault(), e.stopPropagation());
    },
    true,
  );
}

export async function basyapitListesi() {
  gununRengi();
  ciz(`${gozAtUst('basyapitlar')}<p class="ikincil kucuk">Yükleniyor…</p>`);
  const [liste, hikayeler] = await Promise.all([basyapitVeri(), hikayeVeri().catch(() => [])]);
  if (location.hash !== '#/basyapitlar') return;
  if (!liste.length) return ciz(`${gozAtUst('basyapitlar')}<p class="ikincil">Henüz yakın okuma yok.</p>`);
  const hikayeli = new Set((hikayeler || []).map((h) => h.anahtar));
  const gruplar = bsyGruplari(liste);
  const hap = (id, ad, n) =>
    `<button type="button" data-by-donem="${id}" aria-pressed="${String((id || null) === (d.bsyDonem || null))}">${kacis(ad)}<small>${n}</small></button>`;
  ciz(`${gozAtUst('basyapitlar')}
    <div class="by" data-by>
      <nav class="by-haplar" aria-label="Dönemler" data-test="by-donemler">${hap('', 'Hepsi', liste.length)}${gruplar.map((g) => hap(g.bolge.id, g.bolge.ad, g.l.length)).join('')}</nav>
      <div class="by-govde" data-by-govde></div>
    </div>`);
  bsyGovdeCiz(liste, gruplar, hikayeli);
  const kok = ekran.querySelector('[data-by]');
  const haplar = kok.querySelector('.by-haplar');
  const hapiGoster = () => {
    const h = haplar.querySelector('[aria-pressed="true"]');
    if (h) haplar.scrollTo({ left: h.offsetLeft - 24, behavior: hareketAz() ? 'auto' : 'smooth' });
  };
  hapiGoster();
  const sec = (id) => {
    d.bsyDonem = id || null;
    bsyGovdeCiz(liste, gruplar, hikayeli);
    hapiGoster();
    // gövde yeniden çizildi: sayfa hapların hizasına gelir (haplar yapışkan, yerinde kalır)
    const tepe = kok.getBoundingClientRect().top + scrollY;
    if (scrollY > tepe) scrollTo({ top: tepe, behavior: 'auto' });
  };
  kok.addEventListener('click', (e) => {
    const h = e.target.closest('[data-by-donem]');
    if (h) sec(h.dataset.byDonem);
  });
}

// Başyapıt sayfası: js/ekranlar/basyapit.js (İş 188)

// ---------- Konular ve hikâyeleri ----------
let ikonografiSozu = null;
export function ikonografiVeri() {
  if (!ikonografiSozu)
    ikonografiSozu = jsonGetir('data/ikonografi.json')
      .catch(() => null)
      .then((j) => {
        const l = konulariAl(j, (id) => d.harita.has(id));
        konuHaritasiniAyarla(l);
        return l;
      });
  return ikonografiSozu;
}

// 1.88 (Emre: "Konular, Başyapıtlar ile aynı olsun"): Başyapıtlar'ın yapısı. Üstte yapışkan sekmeler (Hepsi + gruplar),
// altında öne çıkan konuların büyük sahnesi, devamı iki sütun duvar. "Hepsi"de her gruptan iki konu ve "N konu" düğmesi;
// bir grup seçilince o grubun bütün konuları. Gövde yerinde çizilir; adres #/konular/<tür> olur (yığına eklenmez).
function knSahne(one) {
  const n = one.length;
  if (!n) return '';
  return `<div class="by-sahne${n > 1 ? '' : ' tek'}" data-by-sahne data-test="by-sahne" data-n="${n}" role="group" aria-label="Öne çıkan konular">
      ${one
        .map(
          (k, i) =>
            `<a class="konu-kart by-sahne-kart${i ? '' : ' secili'}" href="#/konu/${encodeURIComponent(k.id)}" style="--i:${i}" data-by-slayt="${i}" data-konu-kart="${kacis(k.id)}"><span class="by-sahne-resim" data-konu-kapak></span><span class="by-sahne-golge" aria-hidden="true"></span><span class="by-sahne-yazi"><small>Öne çıkan · ${kacis(TUR_AD[k.tur])}</small><b>${kacis(k.ad)}</b><span>${k.eserler.length} eserde bu konu</span></span></a>`,
        )
        .join('')}
      ${n > 1 ? `<div class="by-noktalar">${one.map((_, i) => `<button type="button" data-by-nokta="${i}"${i ? '' : ' class="secili"'} style="--i:${i}" aria-label="${i + 1}. öne çıkan konu"><i></i></button>`).join('')}</div>` : ''}
    </div>`;
}

function knKart(k, i) {
  return `<li style="--i:${i % 6}" data-gozcu><a class="konu-kart vitrin-kart by-kart" href="#/konu/${encodeURIComponent(k.id)}" data-konu-kart="${kacis(k.id)}"><span class="by-cerceve"><span class="by-resim" data-konu-kapak></span></span><span class="by-yazi"><b>${kacis(k.ad)}</b><span>${k.eserler.length} eser</span><small class="vitrin-akim">${kacis(TUR_AD[k.tur])}</small></span></a></li>`;
}

const knDuvar = (l, sinif = '', son = '') => `<ul class="by-duvar${sinif}" data-test="konu-listesi">${l.map(knKart).join('')}${son}</ul>`;

// Galeri sayfalarındaki giriş hareketi: [data-gozcu] öğesi ekrana girince .gorundu alır, CSS geçişleri oynar.
// Hareket azaltılmışsa (ve otomatik testlerde) hepsi hemen görünür.
function gorunceOynat() {
  const l = [...ekran.querySelectorAll('[data-gozcu]:not(.gorundu)')];
  if (hareketAz() || typeof IntersectionObserver !== 'function') return l.forEach((el) => el.classList.add('gorundu'));
  const gozcu = new IntersectionObserver(
    (girdiler) => {
      for (const g of girdiler) {
        if (!g.isIntersecting) continue;
        g.target.classList.add('gorundu');
        gozcu.unobserve(g.target);
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
  );
  l.forEach((el) => gozcu.observe(el));
}

function konuGrupSeridi(gruplar, sayi) {
  const hap = (t, ad, n) => `<button type="button" data-kn-grup="${t}" aria-pressed="false">${kacis(ad)}<small>${n}</small></button>`;
  return `<nav class="by-haplar" aria-label="Konu grupları" data-test="konu-grup-serit">${hap('', 'Hepsi', sayi)}${gruplar.map(({ t, l }) => hap(t, TUR_AD[t], l.length)).join('')}</nav>`;
}

async function konuGruplari() {
  const liste = await ikonografiVeri();
  // grup içinde en çok işlenenden aza (eşitlerde verideki sıra)
  const sirala = (l) =>
    l
      .map((k, i) => ({ k, i }))
      .sort((x, y) => y.k.eserler.length - x.k.eserler.length || x.i - y.i)
      .map((x) => x.k);
  return { liste, gruplar: TUR_SIRA.map((t) => ({ t, l: sirala(liste.filter((k) => k.tur === t)) })).filter((g) => g.l.length) };
}

function knGovdeCiz(gruplar) {
  const govde = ekran.querySelector('[data-kn-govde]');
  if (!govde) return;
  const secili = gruplar.find((g) => g.t === d.konuGrup) || null;
  if (!secili) d.konuGrup = null;
  for (const h of ekran.querySelectorAll('[data-kn-grup]'))
    if (h.closest('.by-haplar')) h.setAttribute('aria-pressed', String((h.dataset.knGrup || null) === d.konuGrup));
  const one = secili ? secili.l.slice(0, 3) : gruplar.map((g) => g.l[0]).slice(0, 5);
  govde.innerHTML = `${knSahne(one)}${
    secili
      ? `<header class="by-bas by-bas-donem"><h2><span class="by-ad">${kacis(TUR_AD[secili.t])}</span><small>En çok işlenenden aza</small></h2><span class="by-say">${secili.l.length} konu</span></header>${knDuvar(secili.l, ' ritim')}`
      : gruplar
          .map(
            ({ t, l }) => `<section class="by-bolum" data-gozcu>
          <header class="by-bas"><h2><span class="vitrin-ad by-ad">${kacis(TUR_AD[t])}</span></h2>${
            l.length > 2
              ? `<button class="by-hepsi" type="button" data-kn-grup="${t}" data-test="by-hepsi" aria-label="${kacis(TUR_AD[t])}: ${l.length} konunun hepsi">${l.length} konu${ikon('ileri', 16, 1.8)}</button>`
              : ''
          }</header>
          ${knDuvar(l.slice(0, SERIT_SAYI), ' serit', hepsineBak('data-kn-grup', t, TUR_AD[t], l.length, 'konu'))}</section>`,
          )
          .join('')
  }`;
  bsySahneBagla(govde);
  gorunceOynat();
  konuKapaklariniDoldur(secili ? secili.l : gruplar.flatMap((g) => g.l.slice(0, SERIT_SAYI)).concat(one));
}

async function konularCiz(t) {
  gununRengi();
  const adres = location.hash;
  ciz(`${gozAtUst('konular')}<p class="ikincil kucuk">Yükleniyor…</p>`);
  const { liste, gruplar } = await konuGruplari();
  if (location.hash !== adres) return;
  if (!liste.length) return ciz(`${gozAtUst('konular')}<p class="ikincil">Henüz konu yok.</p>`);
  d.konuGrup = gruplar.some((g) => g.t === t) ? t : null;
  ciz(`${gozAtUst('konular')}
    <div class="by" data-by>
      ${konuGrupSeridi(gruplar, liste.length)}
      <div class="by-govde" data-kn-govde></div>
    </div>`);
  knGovdeCiz(gruplar);
  const kok = ekran.querySelector('[data-by]');
  const haplar = kok.querySelector('.by-haplar');
  const hapiGoster = () => {
    const h = haplar.querySelector('[aria-pressed="true"]');
    if (h) haplar.scrollTo({ left: h.offsetLeft - 24, behavior: hareketAz() ? 'auto' : 'smooth' });
  };
  hapiGoster();
  const sec = (grup) => {
    d.konuGrup = grup || null;
    history.replaceState(history.state, '', d.konuGrup ? `#/konular/${d.konuGrup}` : '#/konular');
    knGovdeCiz(gruplar);
    hapiGoster();
    const tepe = kok.getBoundingClientRect().top + scrollY;
    if (scrollY > tepe) scrollTo({ top: tepe, behavior: 'auto' });
  };
  kok.addEventListener('click', (e) => {
    const h = e.target.closest('[data-kn-grup]');
    if (h) sec(h.dataset.knGrup);
  });
}

export function konuListesi() {
  return konularCiz(null);
}

// Bir grubun bütün konuları (İş 55; 1.76.4'ten beri Konular'ın kendisi, o grubun sekmesi açık)
export function konuGrubu(t) {
  if (!TUR_AD[t]) return hataGoster(new Error('Bu konu grubu bulunamadı.'));
  return konularCiz(t);
}

// Kapaklar: her konunun eserleri arasında en ünlüsü (kapakSec). Sanatçıların eser listeleri bir kez yüklenir.
async function konuKapaklariniDoldur(liste) {
  const no = cizimNo();
  const sanatcilar = [...new Set(liste.flatMap((k) => k.eserler.map((x) => x[1])))];
  const listeler = new Map(await Promise.all(sanatcilar.map(async (sid) => [sid, await sanatciEserleri(d.harita.get(sid)).catch(() => [])])));
  if (!guncelMi(no)) return;
  const kotu = kotuler();
  for (const k of liste) {
    for (const kart of ekran.querySelectorAll(`[data-konu-kart="${CSS.escape(k.id)}"]`)) {
      const adaylar = k.eserler
        .map(([a, sid]) => eserEslestir(listeler.get(sid) || [], { anahtar: a, sanatci: sid }))
        .filter((e) => e && (secilenGorsel(e, kotu) || e.gorseller[0]));
      const e = kapakSec(adaylar);
      const kutu = kart.querySelector('[data-konu-kapak]');
      if (!e || !kutu) {
        kart.classList.add('kapaksiz');
        continue;
      }
      const g = secilenGorsel(e, kotu) || e.gorseller[0];
      const s = d.harita.get(e.sid);
      kutu.innerHTML = `<img loading="lazy" decoding="async" data-kapak="${kacis(e.qid || `${e.sid}|${e.baslik}`)}" alt="${kacis(`${s ? s.ad : ''}, ${eserBaslik(e)}`)}" src="${kacis(gorselUrl(g, kart.closest('.by-sahne') ? 800 : 400))}" data-yedek="${kacis(gorselYedek(g))}">`;
      odagaKaydir(kutu, g); // İş 143: kapak da yüzün çevresinden kırpılır (Astra'nın önerisi)
    }
  }
}

export async function konuSayfasi(kodlu) {
  const no = cizimNo();
  const k = konuBul(await ikonografiVeri(), decodeURIComponent(kodlu));
  if (!guncelMi(no)) return;
  if (!k) return hataGoster(new Error('Bu konu bulunamadı.'));
  // eserler: sanatçı başına bir kez yüklenir; kapak resmi sayfanın rengini de verir
  const sanatcilar = [...new Set(k.eserler.map((x) => x[1]))];
  const eserSozu = Promise.all(sanatcilar.map(async (sid) => [sid, await sanatciEserleri(d.harita.get(sid)).catch(() => [])])).then((l) => {
    const listeler = new Map(l);
    const kotu = kotuler();
    return k.eserler
      .map(([a, sid]) => eserEslestir(listeler.get(sid) || [], { anahtar: a, sanatci: sid }))
      .filter((e) => e && (secilenGorsel(e, kotu) || e.gorseller[0]));
  });
  const kapakSozu = eserSozu.then((l) => kapakSec(l) || null);
  ekranRengi(kapakSozu, '#8A827A');
  const ilkParagraf = k.hikaye[0] || '';
  ciz(`<div class="hale" aria-hidden="true"></div>
    <header class="sanatci-ust">${geriDugmesi('#/konular')}<a class="etiket vurgu" href="#/konular/${k.tur}">${kacis(TUR_AD[k.tur])}</a></header>
    <article class="konu-sayfa" data-test="konu">
      <figure class="konu-sahne" data-konu-sahne><span class="konu-sahne-resim" data-konu-sahne-resim></span><figcaption class="konu-sahne-yazi" data-konu-sahne-yazi></figcaption>
        <button class="konu-sahne-buyut" type="button" data-konu-sahne-buyut aria-label="Resmi büyüt" hidden>${ikon('buyut', 18, 1.6)}</button></figure>
      <div class="konu-baslik">
        <p class="konu-ust"><span>${kacis(TUR_AD[k.tur])}</span><span aria-hidden="true">·</span><span>${k.eserler.length} eser</span></p>
        <h1 class="konu-ad" tabindex="-1">${kacis(k.ad)}</h1>
        ${k.kaynak ? `<p class="konu-kaynak">${kacis(k.kaynak)}</p>` : ''}
        <button class="konu-galeri-ac" type="button" data-konu-galeri-ac data-test="konu-galeri-ac" disabled>${ikon('izgara', 18, 1.6)}<span>Bütün resimler</span><small data-konu-sayi>${k.eserler.length}</small></button>
      </div>
      ${k.ozet ? `<p class="konu-ozet">${kacis(k.ozet)}</p>` : ''}
      <section class="konu-bolum konu-hikaye" data-gozcu>${etiket('Hikâye')}
        <div class="konu-metin" id="konu-metin" data-konu-metin>${ilkParagraf ? `<p class="okuma konu-ilk">${kacis(ilkParagraf)}</p>` : ''}${k.hikaye
          .slice(1)
          .map((p, i) => `<p class="okuma" style="--i:${Math.min(i, 6)}">${kacis(p)}</p>`)
          .join('')}</div>
        <button class="konu-uzat" type="button" data-konu-uzat aria-expanded="false" aria-controls="konu-metin" hidden><span>Devamını oku</span>${ikon('asagi', 18, 1.8)}</button></section>
      ${k.tanima.length ? `<section class="konu-bolum" data-gozcu>${etiket('Resimde nasıl tanınır?', { vurgu: true })}<ul class="konu-ipuclari" data-konu-ipuclari>${k.tanima.map((x, i) => `<li style="--i:${i}" data-tanima-madde="${i}">${ikon('ara', 18, 1.6)}<span>${kacis(x)}</span></li>`).join('')}</ul></section>` : ''}
      <section class="konu-bolum konu-yol" data-gozcu><div class="konu-yol-ust">${etiket(`Aynı hikâye, ${k.eserler.length} kez`)}<button class="tumunu-goster" type="button" data-konu-tumu data-test="konu-tumu" hidden>Tümünü göster ${ikon('ileri', 15, 1.7)}</button></div><p class="konu-yol-not">Zaman sırasıyla; kaydır, dokunup büyüt.</p>
        <div class="konu-serit" data-konu-eserler><p class="ikincil kucuk">Eserler yükleniyor…</p></div></section>
      <p class="konu-dipnot">Metni Claude yazdı, ikinci bir istekte denetledi. Konu, eserlerin adından çıkarıldı; arada yanlış eşleşme olabilir.</p>
    </article>`);
  gorunceOynat();
  metniKatla();
  const [eserler, kapak] = await Promise.all([eserSozu, kapakSozu]);
  if (!guncelMi(no)) return;
  konuSahnesiniDoldur(kapak);
  const kutu = ekran.querySelector('[data-konu-eserler]');
  if (!kutu) return;
  if (!eserler.length) {
    kutu.innerHTML = '<p class="ikincil kucuk">Bu konudaki eserlerin görseli bulunamadı.</p>';
    return;
  }
  ayrintiVeri();
  // İş 193: tanıma maddelerinin yanında eserden kırpım
  konuKirpimlari(k, ekran.querySelector('[data-konu-ipuclari]'), eserler, AYRINTI).catch(() => {});
  const gorAc = (i) => goruntuleyiciAc({ eserler, baslangic: i, notu: (e) => notuIcin(e.sid)(e), ayrintilar: ayrintiBulucu, ...gorselTercihi() });
  const galeriDugme = ekran.querySelector('[data-konu-galeri-ac]');
  if (galeriDugme) {
    galeriDugme.disabled = false;
    galeriDugme.querySelector('[data-konu-sayi]').textContent = eserler.length;
    galeriDugme.addEventListener('click', () => konuGalerisiAc(k.ad, eserler, gorAc, galeriDugme));
  }
  // 1.88.3 (Emre: "buraya tümünü göster tuşu ekle"): şeridin başlığında da aynı galeri
  const tumu = ekran.querySelector('[data-konu-tumu]');
  if (tumu) {
    tumu.hidden = false;
    tumu.addEventListener('click', () => konuGalerisiAc(k.ad, eserler, gorAc, tumu));
  }
  const buyut = ekran.querySelector('[data-konu-sahne-buyut]');
  const kapakSira = Math.max(0, eserler.indexOf(kapak));
  if (buyut && kapak) {
    buyut.hidden = false;
    ekran.querySelector('[data-konu-sahne]').addEventListener('click', () => gorAc(kapakSira));
  }
  const kotu = kotuler();
  kutu.innerHTML = `<ol class="konu-duraklar">${eserler
    .map((e, i) => {
      const g = secilenGorsel(e, kotu) || e.gorseller[0];
      const s = d.harita.get(e.sid);
      return `<li style="--i:${Math.min(i, 8)}"><span class="konu-yil">${e.tarih ? kacis(e.tarih) : '—'}</span><button class="konu-durak" type="button" data-konu-eser="${i}" aria-label="${kacis(`${s.ad}, ${eserBaslik(e)}`)} — büyüt">
        <span class="konu-durak-resim"><img ${i > 3 ? 'loading="lazy" ' : ''}decoding="async" alt="" src="${kacis(gorselUrl(g, 500))}" data-yedek="${kacis(gorselYedek(g))}"></span><span class="konu-durak-yazi"><b>${kacis(bilinenAd(s.ad, d.kisaAdlar[s.id]))}</b><span>${kacis(eserBaslik(e))}</span></span></button></li>`;
    })
    .join('')}</ol>`;
  const yol = kutu.closest('[data-gozcu]');
  if (yol) yol.classList.add('dolu');
  kutu.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-konu-eser]');
    if (b) goruntuleyiciAc({ eserler, baslangic: Number(b.dataset.konuEser), notu: (e) => notuIcin(e.sid)(e), ayrintilar: ayrintiBulucu, ...gorselTercihi() });
  });
}

// Hikâye uzunsa ilk satırlar görünür, gerisi solar; "Devamını oku" metni yumuşakça açar (yükseklik geçişi)
function metniKatla() {
  const metin = ekran.querySelector('[data-konu-metin]');
  const dugme = ekran.querySelector('[data-konu-uzat]');
  if (!metin || !dugme) return;
  metin.classList.add('katli');
  if (metin.scrollHeight <= metin.clientHeight + 24) return metin.classList.remove('katli');
  dugme.hidden = false;
  dugme.addEventListener('click', () => {
    const acik = dugme.getAttribute('aria-expanded') === 'true';
    const bas = metin.getBoundingClientRect().height;
    metin.classList.toggle('katli', acik);
    metin.classList.toggle('acildi', !acik);
    const son = metin.getBoundingClientRect().height;
    dugme.setAttribute('aria-expanded', String(!acik));
    dugme.querySelector('span').textContent = acik ? 'Devamını oku' : 'Daha az göster';
    if (hareketAz()) return;
    metin.animate([{ height: `${bas}px` }, { height: `${son}px` }], { duration: 520, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' });
    if (acik) metin.closest('section').scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
}

// "Bütün resimler": konunun bütün eserleri kırpılmadan, iki sütunlu bir duvarda; dokununca görüntüleyici açılır
function konuGalerisiAc(baslik, eserler, gorAc, acan) {
  const kotu = kotuler();
  const kok = document.createElement('div');
  kok.className = 'konu-galeri';
  kok.setAttribute('role', 'dialog');
  kok.setAttribute('aria-modal', 'true');
  kok.setAttribute('aria-label', `${baslik}: bütün resimler`);
  kok.dataset.test = 'konu-galeri';
  kok.innerHTML = `<header class="konu-galeri-ust"><div><p>Bütün resimler · ${eserler.length}</p><h2>${kacis(baslik)}</h2></div>
      <button class="konu-galeri-kapat" type="button" aria-label="Kapat">${ikon('kapat', 22)}</button></header>
    <ul class="konu-galeri-duvar">${eserler
      .map((e, i) => {
        const g = secilenGorsel(e, kotu) || e.gorseller[0];
        const s = d.harita.get(e.sid);
        return `<li style="--i:${Math.min(i, 12)}"><button type="button" data-galeri-eser="${i}" aria-label="${kacis(`${s ? s.ad : ''}, ${eserBaslik(e)}`)} — büyüt">
          <img ${i > 5 ? 'loading="lazy" ' : ''}decoding="async" alt="" src="${kacis(gorselUrl(g, 500))}" data-yedek="${kacis(gorselYedek(g))}">
          <span><b>${kacis(s ? bilinenAd(s.ad, d.kisaAdlar[s.id]) : '')}</b>${e.tarih ? `<small>${kacis(e.tarih)}</small>` : ''}</span></button></li>`;
      })
      .join('')}</ul>`;
  document.body.appendChild(kok);
  document.documentElement.classList.add('konu-galeri-acik');
  requestAnimationFrame(() => kok.classList.add('acik'));
  const kapatDugme = kok.querySelector('.konu-galeri-kapat');
  kapatDugme.focus({ preventScroll: true });
  let kapandi = false;
  const kapat = () => {
    if (kapandi) return;
    kapandi = true;
    removeEventListener('hashchange', kapat);
    document.removeEventListener('keydown', tus);
    document.documentElement.classList.remove('konu-galeri-acik');
    kok.classList.remove('acik');
    const sil = () => kok.remove();
    if (hareketAz()) sil();
    else setTimeout(sil, 380);
    if (acan && acan.isConnected) acan.focus({ preventScroll: true });
  };
  const tus = (ev) => {
    if (ev.key === 'Escape' && !document.querySelector('.gor')) kapat();
  };
  addEventListener('hashchange', kapat);
  document.addEventListener('keydown', tus);
  kapatDugme.addEventListener('click', kapat);
  kok.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-galeri-eser]');
    if (b) gorAc(Number(b.dataset.galeriEser));
  });
}

// Konu sayfasının başındaki büyük resim: hikâyenin en ünlü tablosu, yavaşça belirir
function konuSahnesiniDoldur(e) {
  const sahne = ekran.querySelector('[data-konu-sahne]');
  if (!sahne) return;
  const g = e && (secilenGorsel(e, kotuler()) || e.gorseller[0]);
  if (!g) return sahne.classList.add('bos');
  const s = d.harita.get(e.sid);
  sahne.querySelector('[data-konu-sahne-resim]').innerHTML =
    `<img decoding="async" alt="${kacis(`${s ? s.ad : ''}, ${eserBaslik(e)}`)}" src="${kacis(gorselUrl(g, 1000))}" data-yedek="${kacis(gorselYedek(g))}">`;
  sahne.querySelector('[data-konu-sahne-yazi]').textContent =
    `${s ? bilinenAd(s.ad, d.kisaAdlar[s.id]) : ''} · ${eserBaslik(e)}${e.tarih ? `, ${e.tarih}` : ''}`;
  const img = sahne.querySelector('img');
  const ac = () => sahne.classList.add('acik');
  if (img.complete && img.naturalWidth) ac();
  else (img.addEventListener('load', ac, { once: true }), img.addEventListener('error', () => sahne.classList.add('bos'), { once: true }));
}

// ---------- Göz At: akımlar zaman sırasıyla ----------
// Göz At'ın dört bölümü; sayfa değişince elmas işaret önceki bölümden kayarak gelir
const GOZAT_BOLUMLERI = [
  ['akimlar', 'Akımlar', '#/gozat', 'akimlar-giris', 'kemer', 'salon salon'],
  ['basyapitlar', 'Başyapıtlar', '#/basyapitlar', 'basyapit-giris', 'sekme-bugun', 'akılda kalanlar'],
  ['konular', 'Konular', '#/konular', 'konu-giris', 'kitap', 'hikâyeler, temalar'],
  ['zaman', 'Zaman', '#/zaman', 'zaman-giris', 'zaman-cizgi', 'kim kiminle çağdaş'],
];
const HAP_GECIS_MS = 520; // CSS'teki hap-ac / hap-kapan süresinden biraz uzun
let hapGecis = { i: -1, j: -1, t: 0 };
let sonGozAtBolumu = -1; // -1: Galeri'nin ana ekranından (ya da dışarıdan) gelindi; hap kayarak değil, belirerek açılır
// 1.76.3 (Emre tuvalde "C · Açılan hap"ı seçti): alt sayfalarda başlık ile arama aynı satırda; altında dört ikon hapı.
// Etkin hap genişleyip adını ve alt yazısını gösterir; bölüm değişince eski hap kapanır, yenisi açılır (CSS: hap-ac / hap-kapan).
// Aramanın yanındaki kalp Koleksiyon'a (beğenilen eserler) götürür.
export function gozAtUst(etkin, donem = simdikiDonem()) {
  const kol = (d.ilerleme.koleksiyon || []).length;
  const arama = `<a class="arama-hapi" href="#/ara" data-test="arama-hapi" aria-label="Sanatçı, eser, konu ara">${ikon('ara', 18, 1.6)}<span>Sanatçı, eser ara</span></a>
    <a class="arama-kalp${kol ? ' dolu' : ''}" href="#/koleksiyon" data-test="gz-koleksiyon" aria-label="Beğendiklerin${kol ? ` (${kol} eser)` : ''}">${ikon('kalp', 20, 1.6)}</a>`;
  const i = GOZAT_BOLUMLERI.findIndex(([id]) => id === etkin);
  // Aynı bölüm yeniden çizilirse ("Yükleniyor…" → içerik) süren geçiş kaldığı yerden devam eder (eksi gecikme);
  // bitmişse haplar hareketsiz çizilir.
  const simdi = performance.now();
  if (sonGozAtBolumu !== i) hapGecis = { i, j: sonGozAtBolumu, t: simdi };
  sonGozAtBolumu = i;
  const gecen = Math.round(simdi - hapGecis.t);
  const suruyor = hapGecis.i === i && gecen < HAP_GECIS_MS;
  const j = suruyor ? hapGecis.j : i;
  const sinif = !suruyor ? ' sabit' : j < 0 ? ' ilk' : '';
  return `${sayfaZemini(donem)}<div class="gz-ust" data-test="gz-ust">${ust('Galeri', '#/', { geriYok: true, sag: arama })}
    <nav class="bolumler${sinif}" aria-label="Galeri bölümleri" data-test="gz-bolumler"${suruyor && gecen > 0 ? ` style="--gec:-${gecen}ms"` : ''}>${GOZAT_BOLUMLERI.map(
      ([id, ad, hash, test, ik, alt], n) =>
        `<a href="${hash}" data-test="${test}"${id === etkin ? ' aria-current="page"' : ''}${n === j && j !== i ? ' class="kapanan"' : ''}>${ikon(ik, 20, 1.6)}<span class="bolum-yazi"><b>${ad}</b><small>${alt}</small></span></a>`,
    ).join('')}</nav></div>`;
}

// 1.76.3 (Emre): Galeri'nin ana ekranı = yeni üst bölüm (haplar) + Akımlar çarkı + bütün akımların dizini.
// Başyapıtlar rafı ve Müze planı kalktı: Başyapıtlar, Konular ve Zaman haplarda; Koleksiyon aramanın yanındaki kalpte;
// Karşılaştır Çalış'ta (Başka turlar).
// İş 190 ("Işık", Emre tuvalde B'yi seçti): çark neredeyse düz bir ufuk çizgisi; yarıçap 700, komşu adlar ekranın
// köşelerinde (700 · sin 12° ≈ 145 px). CSS'teki .cark-disk / .cark-halka / .cark-ad ölçüleri bu iki sayıya bağlı.
const CARK_ADIM = 12; // çarkta iki akım arası açı (derece)
const CARK_R = 700; // çarkın yarıçapı (px)
let carkSon = 0;
let dizinAcik = false; // Galeri'de "Bütün akımlar" dizini açık mı (Bütün akımlar / Gizle; İş 190: çarkın altında) // son bakılan akım: Galeri'ye dönünce çark orada durur

// Sanatçıların çalışma yıllarından yüzyıllar: [{ y, acik }] (açık: o yüzyılda açık bir sanatçı var)
function carkHtml(durumlar, acikSayi) {
  return `<section class="cark" data-cark data-test="gz-akimlar" aria-label="Akımlar" data-gozcu>
      <div class="cark-bas"><span class="etiket vurgu">Akımlar çarkı</span><small>${acikSayi} / ${durumlar.length} salon açık</small></div>
      <ol class="cark-serit" data-cark-serit>${durumlar
        .map((a, i) => {
          const uyeler = d.sanatcilar.filter((x) => x.akim === a.ad);
          const ic = `<span class="cark-kemer"><span class="zaman-fon" data-zaman-fon aria-hidden="true"></span></span>
          <span class="cark-yazi">
            <span class="etiket vurgu"><span aria-hidden="true">${String(i + 1).padStart(2, '0')} · </span>${kacis(akimYuzyillari(uyeler, { roma: true }))}</span><b>${kacis(a.ad)}</b>
            <span class="sayi">${a.acik ? (a.acikSayisi === a.toplam ? `${a.toplam} sanatçının hepsi açık` : `${a.acikSayisi} / ${a.toplam} sanatçı açık`) : `<span class="kilit-notu">${ikon('kilit', 14)}Konu ${bulunmaEki(a.acilacagiKonu)} açılır</span>`}</span>
            <span class="onizleme" data-onizleme="${kacis(a.ad)}"></span>
            ${a.acik ? `<span class="cark-gir" aria-hidden="true">Salona gir${ikon('ileri', 16, 1.8)}</span>` : ''}
          </span>`;
          return `<li class="cark-oge${a.acik ? '' : ' kilitli'}" style="--i:${i};--akim:${akimRenk(a.ad)}" data-donem="${bolgeBul(d.akimSira[a.ad] ?? i).id}">${
            a.acik ? `<a class="zaman-kart" href="#/akim/${encodeURIComponent(a.ad)}">${ic}</a>` : `<div class="zaman-kart" aria-disabled="true">${ic}</div>`
          }</li>`;
        })
        .join('')}</ol>
      <div class="cark-teker" data-cark-teker aria-hidden="true">
        <span class="cark-disk"></span>
        <span class="cark-halka" data-cark-halka></span>
        <span class="cark-ibre"></span>
        ${durumlar.map((a, i) => `<span class="cark-ad${a.acik ? '' : ' kilitli'}" data-cark-ad="${i}">${kacis(a.ad)}</span>`).join('')}
        <span class="cark-sayac"><b data-cark-no>01</b><span>/ ${durumlar.length}</span><small>Çarkı parmağınla çevir</small></span>
      </div>
    </section>`;
}

// Galeri'nin ana ekranı ("Akımlar" hapı da buraya gelir): çark ve altında bütün akımların zaman sırasıyla dizini.
export function gozAt() {
  const durumlar = akimDurumlari(d.akimlar, d.sanatcilar, islenen());
  gununRengi();
  const acikSayi = durumlar.filter((a) => a.acik).length;
  ciz(`${gozAtUst('akimlar')}
    ${carkHtml(durumlar, acikSayi)}
    <section class="akim-dizin" data-test="akim-dizin" aria-label="Bütün akımlar">
      <div class="gz-plan-bas"><button type="button" class="akim-dizin-ac" data-dizin-ac data-test="akim-dizin-ac" aria-expanded="${dizinAcik}" aria-controls="akim-dizin-liste"><span data-dizin-yazi>${dizinAcik ? 'Gizle' : 'Bütün akımlar'}</span>${ikon('asagi', 16, 1.8)}</button></div>
      <ol id="akim-dizin-liste"${dizinAcik ? '' : ' hidden'}>${durumlar
        .map((a, i) => {
          const yy = akimYuzyillari(
            d.sanatcilar.filter((x) => x.akim === a.ad),
            { roma: true },
          );
          const ic = `<span class="akim-dizin-no" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
            <span class="akim-dizin-yazi"><b>${kacis(a.ad)}</b><small>${kacis(yy)} · ${a.acik ? `${a.acikSayisi} / ${a.toplam} sanatçı açık` : `Konu ${bulunmaEki(a.acilacagiKonu)} açılır`}</small></span>
            ${ikon(a.acik ? 'ileri' : 'kilit', 16, 1.8)}`;
          return `<li style="--i:${i};--akim:${akimRenk(a.ad)}">${
            a.acik
              ? `<a class="akim-dizin-satir" href="#/akim/${encodeURIComponent(a.ad)}" data-test="akim-dizin-satir">${ic}</a>`
              : `<div class="akim-dizin-satir kilitli" aria-disabled="true" data-test="akim-dizin-satir">${ic}</div>`
          }</li>`;
        })
        .join('')}</ol>
    </section>`);
  onizlemeleriDoldur();
  carkKur();
  gorunceOynat();
  // 1.81.0 (Emre): ekranda yalnız çark öne çıkar; dizin çarkın altındaki "Bütün akımlar" ile açılır (oturum boyunca hatırlanır)
  const ac = ekran.querySelector('[data-dizin-ac]');
  if (ac)
    ac.addEventListener('click', () => {
      dizinAcik = !dizinAcik;
      ac.setAttribute('aria-expanded', String(dizinAcik));
      ac.querySelector('[data-dizin-yazi]').textContent = dizinAcik ? 'Gizle' : 'Bütün akımlar';
      ekran.querySelector('#akim-dizin-liste').hidden = !dizinAcik;
    });
}

// İş 171: Karşılaştır kısayolu. En çok karıştırılan iki sanatçı varsa onlar; yoksa açık ilk iki akım.
// Dönen: { href, alt, eserler: () => Promise<[eser, eser]> }. Çalış'taki "Karşılaştır" karosu kullanır (soruTurlari.js).
export function karsilastirSecimi() {
  const [ilk] = enCokKarisanlar(d.ilerleme.karisanlar || {}, { adet: 1, esik: 1, varMi: (id) => d.harita.has(id) });
  const ad = (id) => kacis(bilinenAd(d.harita.get(id).ad, d.kisaAdlar[id]));
  const sanatcininki = (s) =>
    sanatciEserleri(s)
      .then(enBilinen)
      .catch(() => null);
  if (ilk) {
    return {
      href: karsilastirmaAdresi(ilk.a, ilk.b),
      alt: `${ad(ilk.a)} ↔ ${ad(ilk.b)}`,
      eserler: () => Promise.all([ilk.a, ilk.b].map((id) => sanatcininki(d.harita.get(id)))),
    };
  }
  const k = islenen();
  const acik = akimDurumlari(d.akimlar, d.sanatcilar, k).filter((a) => a.acik);
  if (acik.length < 2) return null;
  const akiminki = async (akim) => {
    for (const s of d.sanatcilar.filter((x) => x.akim === akim && k.has(x.konu)).slice(0, 5)) {
      const e = await sanatcininki(s);
      if (e) return e;
    }
    return null;
  };
  return {
    href: akimKarsilastirmaAdresi(acik[0].ad, acik[1].ad),
    alt: `${kacis(acik[0].ad)} ↔ ${kacis(acik[1].ad)}`,
    eserler: () => Promise.all([akiminki(acik[0].ad), akiminki(acik[1].ad)]),
  };
}

// Çark: kartlar yatay kayan bir şerit (parmakla doğal kaydırma, ortaya oturur); alttaki çark şeridin konumunu izler ve
// parmakla çevrilince şeridi kaydırır. Ortadaki kart büyük, komşuları iki yanda soluk; adlar çarkın kenarında döner.
function carkKur() {
  const kok = ekran.querySelector('[data-cark]');
  if (!kok) return;
  const serit = kok.querySelector('[data-cark-serit]');
  const teker = kok.querySelector('[data-cark-teker]');
  const halka = kok.querySelector('[data-cark-halka]');
  const no = kok.querySelector('[data-cark-no]');
  const ogeler = [...serit.children];
  const adlar = [...teker.querySelectorAll('[data-cark-ad]')];
  const n = ogeler.length;
  if (!n) return;
  const adim = () => (n > 1 ? ogeler[1].offsetLeft - ogeler[0].offsetLeft : ogeler[0].offsetWidth) || 1;
  const konum = () => Math.max(0, Math.min(n - 1, serit.scrollLeft / adim()));
  let sonNo = -1;
  const guncelle = () => {
    const p = konum();
    ogeler.forEach((li, i) => {
      const u = Math.min(1, Math.abs(i - p));
      li.style.setProperty('--k', u.toFixed(3));
    });
    adlar.forEach((el, i) => {
      const a = (i - p) * CARK_ADIM;
      const gorunur = Math.abs(a) <= 24;
      el.style.visibility = gorunur ? 'visible' : 'hidden';
      if (!gorunur) return;
      el.style.transform = `rotate(${a.toFixed(2)}deg) translateY(${-(CARK_R + 40)}px)`;
      el.style.opacity = (1 - Math.max(0, Math.abs(a) - 10) / 12).toFixed(2);
      el.classList.toggle('secili', Math.abs(i - p) < 0.5);
    });
    halka.style.transform = `rotate(${(-(p * CARK_ADIM)).toFixed(2)}deg)`;
    const sira = Math.round(p);
    if (sira !== sonNo) {
      sonNo = sira;
      carkSon = sira;
      no.textContent = String(sira + 1).padStart(2, '0');
      // 1.77.0: arka plandaki desen seçili akımın döneminin sembolleri (Emre: "her dönemin kendine uygun sembolleriyle")
      const donem = ogeler[sira] && ogeler[sira].dataset.donem;
      zeminDonemi(donem);
      if (donem && kok.dataset.donem !== donem) {
        kok.dataset.donem = donem;
        kok.classList.remove('desen-gel');
        void kok.offsetWidth;
        kok.classList.add('desen-gel');
      }
    }
  };
  const git = (i, yumusak = true) => {
    const hedef = Math.max(0, Math.min(n - 1, i)) * adim();
    serit.scrollTo({ left: hedef, behavior: yumusak && !hareketAz() ? 'smooth' : 'auto' });
  };
  let kare = 0;
  serit.addEventListener(
    'scroll',
    () => {
      if (kare) return;
      kare = requestAnimationFrame(() => {
        kare = 0;
        guncelle();
      });
    },
    { passive: true },
  );
  // çarkı çevirmek: parmağın altındaki ad parmakla birlikte gider; bırakınca en yakın akıma oturur (hızlı fırlatma ilerletir)
  let b = null;
  const oran = () => adim() / ((CARK_R * CARK_ADIM * Math.PI) / 180);
  teker.addEventListener('pointerdown', (e) => {
    b = { x: e.clientX, sl: serit.scrollLeft, t: performance.now(), sonX: e.clientX, sonT: performance.now(), hiz: 0, kaydi: false };
    try {
      teker.setPointerCapture(e.pointerId);
    } catch (err) {
      /* desteklenmiyor */
    }
  });
  teker.addEventListener('pointermove', (e) => {
    if (!b) return;
    const dx = e.clientX - b.x;
    if (!b.kaydi && Math.abs(dx) < 6) return;
    if (!b.kaydi) {
      b.kaydi = true;
      serit.classList.add('elde');
    }
    const simdi = performance.now();
    b.hiz = (e.clientX - b.sonX) / Math.max(1, simdi - b.sonT);
    b.sonX = e.clientX;
    b.sonT = simdi;
    serit.scrollLeft = b.sl - dx * oran();
  });
  const birak = (e) => {
    if (!b) return;
    const { kaydi, hiz } = b;
    b = null;
    if (kaydi) {
      const hedef = Math.round(konum() - hiz * 2.2);
      requestAnimationFrame(() => {
        serit.classList.remove('elde');
        git(hedef);
      });
      return;
    }
    // dokunuş: dokunulan ad ortaya gelir
    const r = teker.getBoundingClientRect();
    const sin = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (CARK_R + 30)));
    const kayma = Math.round((Math.asin(sin) * 180) / Math.PI / CARK_ADIM);
    if (kayma) git(Math.round(konum()) + kayma);
  };
  teker.addEventListener('pointerup', birak);
  teker.addEventListener('pointercancel', () => {
    b = null;
    serit.classList.remove('elde');
    git(Math.round(konum()));
  });
  // sayfa bellekten geri konunca (sekme değişimi) şeridin yatay konumu sıfırlanır: son bakılan akıma döner
  const yerles = () => {
    if (!serit.isConnected || !serit.offsetWidth) return;
    if (carkSon > 0 && serit.scrollLeft < 2) serit.scrollLeft = Math.min(carkSon, n - 1) * adim();
    guncelle();
  };
  if (typeof IntersectionObserver === 'function') new IntersectionObserver((g) => g.some((x) => x.isIntersecting) && yerles()).observe(serit);
  yerles();
}

// Her akıma 3 çerçeveli küçük eser (açık sanatçılar önce); ilk eser kartın kemerini doldurur
function onizlemeleriDoldur() {
  const k = islenen();
  for (const el of ekran.querySelectorAll('[data-onizleme]')) {
    // Eseri olmayan (ör. mimar/heykeltıraş) sanatçılar atlanır; ilk 3 eserli sanatçı gösterilir
    const hepsi = d.sanatcilar.filter((x) => x.akim === el.dataset.onizleme);
    const uyeler = [...hepsi].sort((a, b) => Number(k.has(b.konu)) - Number(k.has(a.konu)) || (a.dogum ?? 0) - (b.dogum ?? 0)).slice(0, 8);
    // 1.77.1: kemer resmi elle seçildiyse (AKIM_KAPAK) o eser başa geçer; sanatçısı ilk 8'de değilse de yüklenir
    const kapakQid = AKIM_KAPAK[el.dataset.onizleme];
    const kapakSozu = kapakQid
      ? Promise.all(hepsi.map((x) => sanatciEserleri(x).catch(() => []))).then((l) => l.flat().find((e) => e.qid === kapakQid) || null)
      : Promise.resolve(null);
    // İş 143: sayfa belleğe alınmış olsa da (yükleme sürerken başka sekmeye geçildi) doldurulur; dönünce boş kalmasın
    Promise.all([Promise.all(uyeler.map((x) => sanatciEserleri(x).catch(() => []))), kapakSozu]).then(([listeler, kapak]) => {
      let eserler = listeler.map(enBilinen).filter(Boolean);
      if (kapak) eserler = [kapak, ...eserler.filter((e) => e.sid !== kapak.sid)];
      eserler = eserler.slice(0, 3);
      el.innerHTML = eserler.map((e, i) => cerceve(e, { genislik: 400, tembel: true }).replace('class="cerceve"', `class="cerceve" style="--j:${i}"`)).join('');
      const fon = el.closest('.zaman-kart')?.querySelector('[data-zaman-fon]');
      // İş 137: kartı kaplayan tablo yüzün çevresinden kırpılır (önce hep ortadan: dikey tablolarda baş kesiliyordu)
      if (fon && eserler[0]) odakliGorsel(fon, eserler[0], 800);
    });
  }
}

function sanatciSatiri(s, acik) {
  const rozetler = `${s.kaynak === 'ek' ? ' <span class="rozet">kurs dışı</span>' : ''}${s.not_cikarilmadi ? ' <span class="rozet">taslak</span>' : ''}`;
  if (!acik)
    return `<li><div class="satir kilitli" aria-disabled="true"><span class="metin"><b>${kacis(s.ad)}${rozetler}</b><span>${kacis(yillarYaz(s))} · Konu ${bulunmaEki(s.konu)} açılır</span></span></div></li>`;
  return `<li><a class="satir" href="#/sanatci/${encodeURIComponent(s.id)}"><span class="kucuk-kare" data-kucuk="${kacis(s.id)}"></span><span class="metin"><b>${kacis(s.ad)}${rozetler}</b><span>${kacis(yillarYaz(s))}</span></span>${ikon('ileri', 20, 1.4)}</a></li>`;
}

export function akimSayfasi(ad) {
  const k = islenen();
  const uyeler = d.sanatcilar.filter((s) => s.akim === ad).sort((a, b) => (a.dogum ?? a.olum ?? 0) - (b.dogum ?? b.olum ?? 0));
  if (!uyeler.length) return hataGoster(new Error('Akım bulunamadı.'));
  const acik = uyeler.filter((s) => k.has(s.konu));
  const kapali = uyeler.filter((s) => !k.has(s.konu));
  gununRengi();
  const uslup = akimUslubu(ad);
  // Sıra en önemliden en az önemliye: tanıma → eserler → sanatçılar → pekiştir → dönem → karşılaştırma → tipik konular
  // 1.81.0 (Emre): sayfa dönemin en bilinen eseriyle açılır; görsel kimlikDoldur'da gelir (yoksa sahne kapanır)
  ciz(`<div class="akim-sahne${acik.length ? ' dolu' : ''}" data-akim-sahne><span class="akim-sahne-resim" data-akim-sahne-resim aria-hidden="true"></span>${ust(ad, '#/gozat', { ustEtiket: akimYuzyillari(uyeler, { roma: true }) })}</div>
    <section class="akim-kimlik" data-test="akim-kimlik" data-uslup="${uslup}" style="--renk:${akimRenk(ad)}">
      <div data-kimlik-ust><div class="akim-palet bos" aria-hidden="true"></div></div>
      <section class="akim-bolum">${bolumBasligi('Ustalar', 'Sanatçılar')}
        <ul class="liste">${acik.map((s) => sanatciSatiri(s, true)).join('')}${kapali.map((s) => sanatciSatiri(s, false)).join('')}</ul>
      </section>
      ${acik.length ? pekistirDugmesi(ad, uslup, acik.length) : ''}
      <section class="akim-bolum">${bolumBasligi('Zaman çizgisi', 'Dönemi')}${donemCizelgesi(ad)}</section>
      <div data-kimlik-alt></div>
    </section>`);
  // başlık akımın kendi harfiyle (İş 48)
  harfUygula(ekran.querySelector('.ust h1'), AKIM_HARFLERI[ad]);
  kucukKareleriDoldur();
  // K3: kimlik bölümleri (palet, özellikler, eserler, karşılaştırma, tipik konular) arka planda dolar
  kimlikDoldur(ad).catch(() => {});
}

export async function sanatciSayfasi(id) {
  const s = d.harita.get(id);
  if (!s) return hataGoster(new Error('Sanatçı bulunamadı.'));
  const acik = islenen().has(s.konu);
  const eserSozu = sanatciEserleri(s);
  // renk: sanatçının ilk eserinden
  ekranRengi(
    eserSozu.then((l) => l[0] || null),
    akimRenk(s.akim),
  );
  const onemli = (s.onemli_eserler || []).length
    ? `<section class="bolum">${etiket('Önemli eserler')}<ul class="okuma" style="padding-left:20px;margin:0">${s.onemli_eserler.map((e) => `<li>${kacis(e.tr || e.baslik)}${e.yil ? ` <span class="ikincil">(${kacis(e.yil)})</span>` : ''}</li>`).join('')}</ul></section>`
    : '';
  const emin = (s.emin_degil || []).length
    ? `<details class="bolum"><summary class="etiket">Kesin olmayan bilgiler</summary><ul class="kucuk ikincil" style="margin:0;padding-left:20px">${s.emin_degil.map((x) => `<li>${kacis(x)}</li>`).join('')}</ul></details>`
    : '';
  const akimYolu = `#/akim/${encodeURIComponent(s.akim)}`;
  ciz(`<div class="hale" aria-hidden="true"></div>
    <header class="sanatci-ust">${geriDugmesi(akimYolu)}<a class="etiket vurgu" href="${akimYolu}">${kacis(s.akim)}</a></header>
    <article>
    <div class="isim-blok">
      ${isimHtml(s, { etiketAdi: 'h1', ek: ' tabindex="-1"' })}
      <p class="meta">${kacis(yillarYaz(s))} · <span class="vurgu-yazi">${s.kaynak === 'ek' ? 'Kurs dışı' : `Kursta Konu ${s.konu}`}</span>${s.not_cikarilmadi ? ' <span class="rozet">taslak</span>' : ''}</p>
      ${acik || pekistirmedeMi(s) ? `<p class="seviye-satir" data-test="sanatci-seviye">${kacis(`${s.akim} dönemi: ${seviyeDurumu(seviyeKaydi(d.ilerleme, s.akim))}`)}</p>` : `<p class="mesaj-not">Bu sanatçı Konu ${s.konu} işlenince pekiştirmeye girer.</p>`}
    </div>
    <div class="eserler" id="eserler"><p class="ikincil kucuk">Eserler yükleniyor…</p></div>
    ${notBolumleri(s)}
    <div data-basyapit-bag="${kacis(s.id)}"></div>
    <section class="bolum">${etiket('Dönemi')}${donemCizelgesi(s.akim)}</section>
    ${karsilastirSecici(s)}
    ${onemli}${emin}
    </article>`);
  basyapitBaglariniDoldur(s.id);
  imzaGoster(s, ekran.querySelector('.isim-blok')); // İş 48: varsa ressamın gerçek imzası
  kunyeGoster(s, ekran.querySelector('.isim-blok')); // İş 49: portresi ve adının okunuşu
  const eserler = await eserSozu;
  d.sonEserListesi = eserler; // testler ve hata ayıklama için
  const kutu = document.getElementById('eserler');
  if (!kutu || location.hash !== `#/sanatci/${encodeURIComponent(id)}`) return;
  if (!eserler.length) {
    kutu.innerHTML = '<p class="ikincil kucuk">Bu sanatçı için doğrulanmış görsel bulunamadı.</p>';
    return;
  }
  // üstte "Tümünü göster", galerinin sonunda "Tümü (N)": bütün eserlerin ızgara görünümü
  kutu.insertAdjacentHTML('beforebegin', seritUst(s, eserler.length));
  kutu.innerHTML = `${eserSeridi(eserler, 'eser', 'data-eser')}<a class="tumu" href="#/sanatci/${encodeURIComponent(s.id)}/eserler" data-test="tumu">Tümü (${eserler.length})</a>`;
  ayrintiVeri();
  // İş 193: "Nasıl tanırım?" notunun altında eserlerden kırpımlar
  sanatciKirpimlari(s, ekran.querySelector('[data-tanima-kirp]'), eserler, AYRINTI).catch(() => {});
  kutu.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-eser]');
    if (b) goruntuleyiciAc({ eserler, baslangic: Number(b.dataset.eser), notu: notuIcin(s.id), ayrintilar: ayrintiBulucu, ...gorselTercihi() });
  });
}

// Bir sanatçının bütün eserleri: iki sütunlu ızgara, kırpma yok; dokununca görüntüleyici
export async function tumEserler(id) {
  const s = d.harita.get(id);
  if (!s) return hataGoster(new Error('Sanatçı bulunamadı.'));
  const eserSozu = sanatciEserleri(s);
  ekranRengi(
    eserSozu.then((l) => l[0] || null),
    akimRenk(s.akim),
  );
  const no = cizimNo();
  const eserler = await eserSozu;
  if (!guncelMi(no)) return;
  ciz(`<div class="hale" aria-hidden="true"></div>
    ${ust(bilinenAd(s.ad, d.kisaAdlar[s.id]), `#/sanatci/${encodeURIComponent(s.id)}`, { ustEtiket: `Tüm eserler · ${eserler.length}` })}
    ${eserler.length ? `<div class="izgara" data-izgara>${eserSeridi(eserler, 'eser', 'data-eser')}</div>` : '<p class="ikincil kucuk">Bu sanatçı için doğrulanmış görsel bulunamadı.</p>'}`);
  const kutu = ekran.querySelector('[data-izgara]');
  if (kutu)
    kutu.addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-eser]');
      if (b) goruntuleyiciAc({ eserler, baslangic: Number(b.dataset.eser), notu: notuIcin(s.id), ...gorselTercihi() });
    });
}

// ---------- yan yana karşılaştırma ----------
function kilitliMi(s) {
  return !acikListe().some((x) => x.id === s.id);
}

// Sanatçı sayfasında "Karşılaştır": aynı/komşu akımdan, ±50 yıl içindeki en çok 8 sanatçı
function karsilastirSecici(s) {
  const benzer = benzerSanatcilar(s, d.sanatcilar, d.akimlar, 8);
  if (!benzer.length) return '';
  return `<details class="bolum karsilastir-sec" data-test="karsilastir-sec">
      <summary class="dugme">${ikon('karsilastir', 18, 1.6)}<span>Karşılaştır</span></summary>
      <p class="kucuk ikincil" style="margin:0">Benzer bir sanatçıyla yan yana gör:</p>
      <ul class="liste">${benzer
        .map(
          (x) =>
            `<li><a class="satir" href="${karsilastirmaAdresi(s.id, x.id)}"><span class="metin"><b>${kacis(x.ad)}${kilitliMi(x) ? ' <span class="rozet">Henüz kursta yok</span>' : ''}</b><span>${kacis(yillarYaz(x))} · ${kacis(x.akim)}</span></span>${ikon('ileri', 20, 1.4)}</a></li>`,
        )
        .join('')}</ul>
    </details>`;
}

function karsilastirmaSutunu(s, k) {
  const p = adParcala(s.ad, d.kisaAdlar[s.id]);
  const t = taninma(s);
  return `<section class="kars-sutun" data-kars="${k}" aria-label="${kacis(s.ad)}">
      <a class="kars-ad" href="#/sanatci/${encodeURIComponent(s.id)}" aria-label="${kacis(s.ad)} — sanatçı sayfası">${p.ilk ? `<span class="ad-ilk">${kacis(p.ilk)}</span>` : ''}<b>${kacis(p.son)}</b>${p.tam ? `<span class="ad-ilk ad-tam">${kacis(p.tam)}</span>` : ''}</a>
      <p class="kars-meta">${kacis(yillarYaz(s))}<br>${akimNoktasi(s.akim)}${kacis(s.akim)}</p>
      ${kilitliMi(s) ? '<span class="rozet">Henüz kursta yok</span>' : ''}
      ${t ? `<div class="kars-tanima">${etiket('Nasıl tanırım?')}<p class="kars-not" data-test="kars-taninma">${kacis(t)}</p></div>` : '<p class="kucuk ikincil" style="margin:0">Bu sanatçı için “Nasıl tanırım?” notu henüz yok.</p>'}
      <div class="kars-eserler" data-kars-eserler="${k}"><p class="ikincil kucuk">Eserler yükleniyor…</p></div>
    </section>`;
}

export async function karsilastirSayfasi(a, b) {
  const sa = d.harita.get(a);
  const sb = d.harita.get(b);
  if (!sa || !sb || a === b) return hataGoster(new Error('Karşılaştırılacak sanatçı bulunamadı.'));
  const adres = location.hash;
  const sozler = [sanatciEserleri(sa), sanatciEserleri(sb)];
  ekranRengi(
    sozler[0].then((l) => l[0] || null),
    akimRenk(sa.akim),
  );
  ciz(`<div class="hale" aria-hidden="true"></div>
    ${ust('Karşılaştır', `#/sanatci/${encodeURIComponent(a)}`, { ustEtiket: 'Yan yana' })}
    <div class="kars" data-test="karsilastirma">${karsilastirmaSutunu(sa, 'a')}${karsilastirmaSutunu(sb, 'b')}</div>`);
  const listeler = await Promise.all(sozler);
  if (location.hash !== adres) return;
  [sa, sb].forEach((s, i) => {
    const kutu = ekran.querySelector(`[data-kars-eserler="${i ? 'b' : 'a'}"]`);
    if (!kutu) return;
    const eserler = bilinirlikSirasi(listeler[i]).slice(0, 4);
    if (!eserler.length) {
      kutu.innerHTML = '<p class="ikincil kucuk">Doğrulanmış görsel yok.</p>';
      return;
    }
    kutu.innerHTML = eserler
      .map((e, j) => {
        const g = secilenGorsel(e, kotuler()) || e.gorseller[0];
        if (!g) return '';
        return `<button class="kars-eser" type="button" data-kars-eser="${j}" aria-label="${kacis(eserBaslik(e))} — büyüt"><img decoding="async" alt="" src="${kacis(gorselUrl(g, 400))}" data-yedek="${kacis(gorselYedek(g))}"><span class="eser-yazi"><span class="eser-ad">${kacis(eserBaslik(e))}</span>${e.tarih ? `<small>${kacis(e.tarih)}</small>` : ''}</span></button>`;
      })
      .join('');
    kutu.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-kars-eser]');
      if (btn) goruntuleyiciAc({ eserler, baslangic: Number(btn.dataset.karsEser), notu: notuIcin(s.id), ...gorselTercihi() });
    });
  });
}
