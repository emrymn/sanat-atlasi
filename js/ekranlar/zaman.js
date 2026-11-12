// Zaman (1.76.5 · yıl kadranı): üstte yapışkan okuyucu (büyük yıl, yüzyıl evresi, kaç sanatçı hayatta) ve yatay
// kayan cetvel (her on yılın sanatçı yoğunluğu, en kalabalık akımın renginde; ortada pirinç ibre). Altında o yıl
// hayatta olanlar akımlarına göre: küçük resim, ad, o yılki yaşı ve hayatının neresinde olduğu. Kilitliler soluk.
import { kacis, yillarYaz, bulunmaEki } from '../yardimci.js';
import { sanatciEserleri } from '../eserler.js';
import { ikon } from '../tasarim.js';
import { bilinenAd } from '../adlar.js';
import { hareketAz } from '../gecis.js';
import { BAS, SON, ADIM, yilSinirla, yasayanlar, akimlaraAyir, hayatPayi, yas, yogunluk, yuzyilEvresi } from '../zaman.js';
import { d, ekran, gununRengi, ciz, islenen, akimRenk, kucukGorsel, enBilinen } from './ortak.js';
import { gozAtUst } from './gozat.js';

const PX = 4; // cetvelde bir yıl
const CUBUK_EN_YUKSEK = 30;
const adi = (s) => bilinenAd(s.ad, d.kisaAdlar[s.id]);

// Küçük resimler sayfalar arasında da saklanır: kadran çevrildikçe aynı sanatçı yeniden yüklenmez
const kareler = new Map();
function kareSozu(s) {
  if (!kareler.has(s.id))
    kareler.set(
      s.id,
      sanatciEserleri(s)
        .then((l) => {
          const e = enBilinen(l || []);
          return e ? kucukGorsel(e, 200) : '';
        })
        .catch(() => ''),
    );
  return kareler.get(s.id);
}

function cetvelHtml(acikMi) {
  const cubuklar = yogunluk(d.sanatcilar, acikMi);
  const enCok = Math.max(1, ...cubuklar.map((c) => c.n));
  const centikler = [];
  for (let y = BAS; y <= SON; y += ADIM) {
    const tur = y % 100 === 0 ? ' buyuk' : y % 50 === 0 ? ' orta' : '';
    centikler.push(`<span class="zm-centik${tur}" style="left:${(y - BAS) * PX}px">${y % 100 === 0 ? `<small>${y}</small>` : ''}</span>`);
  }
  return `<div class="zm-olcek" style="width:${(SON - BAS) * PX}px">
      <div class="zm-cubuklar">${cubuklar
        .filter((c) => c.n)
        .map(
          (c) =>
            `<i class="${c.acik ? '' : 'kilitli'}" style="left:${(c.yil - BAS) * PX + 1}px;width:${ADIM * PX - 2}px;height:${3 + Math.round((c.n / enCok) * (CUBUK_EN_YUKSEK - 3))}px;--renk:${akimRenk(c.akim)}"></i>`,
        )
        .join('')}</div>
      <div class="zm-centikler">${centikler.join('')}</div>
    </div>`;
}

export function zamanSayfasi() {
  gununRengi();
  const k = islenen();
  const acikMi = (s) => k.has(s.konu);
  if (d.zamanYil == null) {
    // ilk açılışta açık sanatçıların olgunluk çağının ortası
    const acik = d.sanatcilar.filter((s) => acikMi(s) && s.dogum != null);
    d.zamanYil = yilSinirla(acik.length ? acik.reduce((t, s) => t + s.dogum + 35, 0) / acik.length : 1500);
  }
  ciz(`${gozAtUst('zaman')}
    <section class="zm" data-test="zaman" aria-label="Zaman">
      <div class="zm-panel">
        <div class="zm-okur">
          <button type="button" class="zm-adim" data-zaman-adim="-${ADIM}" aria-label="${ADIM} yıl geri">${ikon('geri', 22, 1.6)}</button>
          <p class="zm-yil">
            <span class="etiket vurgu" data-zaman-evre></span>
            <b data-zaman-yil data-test="zaman-yil"></b>
            <small><span data-zaman-canli>0</span> sanatçı hayatta</small>
          </p>
          <button type="button" class="zm-adim" data-zaman-adim="${ADIM}" aria-label="${ADIM} yıl ileri">${ikon('ileri', 22, 1.6)}</button>
        </div>
        <div class="zm-cetvel" data-zaman-kaydir data-test="zaman-tuval" tabindex="0" role="slider" aria-label="Yıl" aria-valuemin="${BAS}" aria-valuemax="${SON}">
          <div class="zm-cetvel-ic" data-zaman-ic>${cetvelHtml(acikMi)}</div>
        </div>
        <span class="zm-ibre" aria-hidden="true"></span>
      </div>
      <p class="zm-ipucu">Cetveli kaydır ya da dokun: o yıl hayatta olanlar aşağıda.</p>
      <div class="zm-liste" data-zaman-liste data-test="zaman-liste"></div>
    </section>`);
  const kaydir = ekran.querySelector('[data-zaman-kaydir]');
  listeAnahtari = '';
  payAyarla(kaydir);
  kaydir.scrollLeft = (d.zamanYil - BAS) * PX;
  guncelle(d.zamanYil);
  let kare = 0;
  kaydir.addEventListener(
    'scroll',
    () => {
      if (kare) return;
      kare = requestAnimationFrame(() => {
        kare = 0;
        const yil = yilSinirla(BAS + kaydir.scrollLeft / PX);
        if (yil !== d.zamanYil) guncelle(yil);
      });
    },
    { passive: true },
  );
}

// Cetvelin iki yanına yarım ekran boşluk: BAS ve SON da ibrenin altına gelebilsin
function payAyarla(kaydir) {
  const ic = kaydir.querySelector('[data-zaman-ic]');
  if (ic) ic.style.paddingInline = `${Math.round(kaydir.clientWidth / 2)}px`;
}

function yilaGit(yil, { yumusak = true } = {}) {
  const kaydir = ekran.querySelector('[data-zaman-kaydir]');
  if (!kaydir) return;
  const hedef = yilSinirla(yil);
  kaydir.scrollTo({ left: (hedef - BAS) * PX, behavior: yumusak && !hareketAz() ? 'smooth' : 'auto' });
  // kaydırma olayı gelmese de (aynı yer, ya da anlık) okuyucu güncellensin
  if (!yumusak || hareketAz()) guncelle(hedef);
}

const yasYazi = (x, yil) => {
  const n = yas(x.s, yil);
  if (n == null) return 'yaşı bilinmiyor';
  if (n === 0) return 'doğduğu yıl';
  if (x.s.olum === yil) return `${n} yaşında öldü`;
  return `${n} yaşında`;
};

let listeAnahtari = '';
function guncelle(yil) {
  d.zamanYil = yil;
  const liste = yasayanlar(d.sanatcilar, yil);
  const k = islenen();
  const $ = (s) => ekran.querySelector(s);
  const yilEl = $('[data-zaman-yil]');
  if (!yilEl) return;
  yilEl.textContent = yil;
  $('[data-zaman-evre]').textContent = yuzyilEvresi(yil);
  $('[data-zaman-canli]').textContent = liste.length;
  const kaydir = $('[data-zaman-kaydir]');
  kaydir.setAttribute('aria-valuenow', yil);
  kaydir.setAttribute('aria-valuetext', `${yil}, ${liste.length} sanatçı hayatta`);
  const anahtar = liste.map((x) => x.s.id).join('|');
  const kutu = $('[data-zaman-liste]');
  if (anahtar === listeAnahtari) {
    // aynı kişiler: yalnız yaşlar ve hayat çizgileri ilerler
    for (const satir of kutu.querySelectorAll('[data-zaman-satir]')) {
      const x = liste.find((y) => y.s.id === satir.dataset.zamanSatir);
      if (!x) continue;
      satir.querySelector('[data-zaman-yas]').textContent = yasYazi(x, yil);
      satir.style.setProperty('--pay', hayatPayi(x, yil).toFixed(3));
    }
    return;
  }
  listeAnahtari = anahtar;
  if (!liste.length) {
    kutu.innerHTML = `<p class="zm-bos">Bu yıl için kayıtlı sanatçı yok. Cetveli biraz kaydır.</p>`;
    return;
  }
  kutu.innerHTML = akimlaraAyir(liste, d.akimlar)
    .map(
      (g) => `<section class="zm-grup" style="--akim:${akimRenk(g.ad)}" data-test="zaman-grup">
        <h3 class="zm-akim"><span class="zm-nokta" aria-hidden="true"></span><span>${kacis(g.ad)}</span><small>${g.l.length}</small></h3>
        <ul>${g.l.map((x) => satirHtml(x, yil, k.has(x.s.konu))).join('')}</ul>
      </section>`,
    )
    .join('');
  for (const el of kutu.querySelectorAll('[data-zaman-kare]')) {
    const s = d.harita.get(el.dataset.zamanKare);
    if (!s || el.childElementCount) continue;
    kareSozu(s).then((html) => {
      if (html && el.isConnected && !el.childElementCount) el.innerHTML = html;
    });
  }
}

function satirHtml(x, yil, acik) {
  const s = x.s;
  const alt = acik ? kacis(yillarYaz(s)) : `${ikon('kilit', 12, 1.8)}Konu ${bulunmaEki(s.konu)} açılır`;
  const ic = `<span class="zm-kare"${acik ? ` data-zaman-kare="${kacis(s.id)}"` : ''} aria-hidden="true"></span>
      <span class="zm-satir-yazi">
        <b>${kacis(adi(s))}</b>
        <small><span data-zaman-yas>${yasYazi(x, yil)}</span><span aria-hidden="true"> · </span>${alt}</small>
        <span class="zm-hayat" aria-hidden="true"><i></i></span>
      </span>
      ${acik ? ikon('ileri', 18, 1.6) : ''}`;
  const ortak = `data-zaman-satir="${kacis(s.id)}" style="--pay:${hayatPayi(x, yil).toFixed(3)}"`;
  return `<li>${
    acik
      ? `<a class="zm-satir" href="#/sanatci/${encodeURIComponent(s.id)}" ${ortak} data-zaman-sanatci="${kacis(s.id)}">${ic}</a>`
      : `<div class="zm-satir kilitli" ${ortak} aria-disabled="true">${ic}</div>`
  }</li>`;
}

// Ekranın olay dinleyicileri; app.js bir kez bağlar
export function olaylariBagla() {
  ekran.addEventListener('click', (e) => {
    const adim = e.target.closest('[data-zaman-adim]');
    if (adim) return yilaGit(d.zamanYil + Number(adim.dataset.zamanAdim));
    const kaydir = e.target.closest('[data-zaman-kaydir]');
    if (kaydir) {
      // cetvelde dokunulan yıl ibrenin altına gelir
      const kutu = kaydir.getBoundingClientRect();
      yilaGit(d.zamanYil + (e.clientX - (kutu.left + kutu.width / 2)) / PX);
    }
  });
  ekran.addEventListener('keydown', (e) => {
    if (!e.target.matches?.('[data-zaman-kaydir]')) return;
    const fark = { ArrowLeft: -1, ArrowRight: 1, ArrowDown: -1, ArrowUp: 1, PageDown: -ADIM, PageUp: ADIM }[e.key];
    if (e.key === 'Home') yilaGit(BAS, { yumusak: false });
    else if (e.key === 'End') yilaGit(SON, { yumusak: false });
    else if (fark) yilaGit(d.zamanYil + fark, { yumusak: false });
    else return;
    e.preventDefault();
  });
  addEventListener('resize', () => {
    const kaydir = ekran.querySelector('[data-zaman-kaydir]');
    if (!kaydir) return;
    payAyarla(kaydir);
    kaydir.scrollLeft = (d.zamanYil - BAS) * PX;
  });
}
