// İş 172 (Emre tuvalde "B"yi seçti): Hızlı ayarlar. Sekme çubuğunun üst kenarındaki küçük dişli dile dokununca (ya da dili
// yukarı çekince) çubuğun arkasından bir yaprak yükselir: Tema, Hareket, Günlük kart; altında bütün ayarlara bağlantı.
// Başparmağın altında, her ana ekranda; sayfa değişmeden ayarlanır. Dil sekme değildir (beşinci sekme istenmedi).
import { d, kaydet, temaUygula, TEMA_AD } from './ortak.js';
import { TEMALAR, HAREKETLER, HAREKET_AD } from '../depo.js';
import { ikon } from '../tasarim.js';

let dil = null;
let kok = null;
let acik = false;

const parca = (ad, etiket, secenekler, adlar, secili) => {
  const i = Math.max(0, secenekler.indexOf(secili));
  return `<div class="hizli-satir" style="--s:${ad === 'tema' ? 0 : 1}"><b id="hizli-${ad}-etiket" class="etiket">${etiket}</b>
    <div class="hizli-parca" role="radiogroup" aria-labelledby="hizli-${ad}-etiket" data-test="hizli-${ad}" style="--n:${secenekler.length};--i:${i}">
      <span class="hizli-parca-surgu" aria-hidden="true"></span>
      ${secenekler.map((t) => `<label><input type="radio" name="hizli-${ad}" value="${t}" ${t === secili ? 'checked' : ''}><span>${adlar[t]}</span></label>`).join('')}
    </div></div>`;
};

function icerik() {
  const a = d.ilerleme.ayarlar;
  return `<span class="hizli-tutamak" aria-hidden="true"></span>
    <h2 id="hizli-baslik" tabindex="-1">Hızlı ayarlar</h2>
    ${parca('tema', 'Tema', TEMALAR, TEMA_AD, a.tema)}
    ${parca('hareket', 'Hareket', HAREKETLER, HAREKET_AD, a.hareket || 'tam')}
    <div class="hizli-satir yan" style="--s:2">
      <span class="hizli-yazi"><b id="hizli-kart-etiket" class="etiket">Günlük kart</b><small>Bir turda kaç kart gelsin</small></span>
      <div class="hizli-adim" role="group" aria-labelledby="hizli-kart-etiket">
        <button type="button" data-hizli-kart="-5" aria-label="Azalt">${ikon('eksi', 18, 1.8)}</button>
        <output data-test="hizli-gunluk-kart">${a.gunlukKart}</output>
        <button type="button" data-hizli-kart="5" aria-label="Artır">${ikon('arti', 18, 1.8)}</button>
      </div>
    </div>
    <a class="hizli-hepsi" href="#/ayarlar" data-test="hizli-hepsi" style="--s:3"><span><b>Bütün ayarlar</b><small>Yedek, çevrimdışı görseller, yazı boyu</small></span>${ikon('ileri', 18, 1.7)}</a>`;
}

export function hizliAyarAc() {
  if (acik || !kok || !d.ilerleme) return;
  acik = true;
  const yaprak = kok.querySelector('.hizli-yaprak');
  yaprak.innerHTML = icerik();
  yaprak.style.transform = '';
  kok.hidden = false;
  // dil yaprağın üst kenarına biner: yaprağın boyu kadar yükselir
  document.documentElement.style.setProperty('--hizli-h', `${yaprak.offsetHeight}px`);
  void kok.offsetHeight;
  document.documentElement.classList.add('hizli-acik');
  dil.setAttribute('aria-expanded', 'true');
  dil.setAttribute('aria-label', 'Hızlı ayarları kapat');
  yaprak.querySelector('h2').focus({ preventScroll: true });
}

export function hizliAyarKapat({ odak = true } = {}) {
  if (!acik) return;
  acik = false;
  document.documentElement.classList.remove('hizli-acik');
  dil.setAttribute('aria-expanded', 'false');
  dil.setAttribute('aria-label', 'Hızlı ayarlar');
  const yaprak = kok.querySelector('.hizli-yaprak');
  yaprak.style.transform = '';
  const sure = parseFloat(getComputedStyle(yaprak).transitionDuration) * 1000 || 0;
  setTimeout(() => !acik && (kok.hidden = true), sure + 40);
  if (odak) dil.focus({ preventScroll: true });
}

// Dil ve yaprağın başı parmakla çekilir: kapalıyken yukarı çekince açılır, açıkken aşağı çekince kapanır
function surukleKur() {
  let b = null;
  const yaprak = () => kok.querySelector('.hizli-yaprak');
  const basla = (e) => {
    if (e.target.closest('input, label, button:not(.hizli-dil), a, output')) return;
    b = { y: e.clientY, t: performance.now(), dy: 0, kaydi: false };
  };
  const oyna = (e) => {
    if (!b) return;
    b.dy = e.clientY - b.y;
    if (Math.abs(b.dy) > 6) b.kaydi = true;
    if (acik && b.kaydi) {
      const dy = Math.max(0, b.dy);
      yaprak().style.transition = 'none';
      dil.style.transition = 'none';
      yaprak().style.transform = `translateY(${dy}px)`;
      dil.style.setProperty('--hizli-cek', `${dy}px`);
    }
  };
  const bitir = () => {
    if (!b) return;
    const { dy, kaydi, t } = b;
    b = null;
    yaprak().style.transition = '';
    dil.style.transition = '';
    dil.style.removeProperty('--hizli-cek');
    if (!kaydi) return;
    dil.dataset.yeniKaydi = '1';
    setTimeout(() => delete dil.dataset.yeniKaydi, 350);
    const hiz = dy / Math.max(1, performance.now() - t);
    if (acik) {
      if (dy > 70 || hiz > 0.5) hizliAyarKapat({ odak: false });
      else yaprak().style.transform = '';
    } else if (dy < -18) hizliAyarAc();
  };
  for (const el of [dil, kok]) {
    el.addEventListener('pointerdown', basla);
    el.addEventListener('pointermove', oyna);
    el.addEventListener('pointerup', bitir);
    el.addEventListener('pointercancel', bitir);
  }
}

// Sekme çubuğu kurulurken bir kez çağrılır
export function hizliAyarKur(nav) {
  if (dil) return;
  dil = document.createElement('button');
  dil.type = 'button';
  dil.className = 'hizli-dil';
  dil.dataset.test = 'hizli-ayar-dil';
  dil.setAttribute('aria-label', 'Hızlı ayarlar');
  dil.setAttribute('aria-haspopup', 'dialog');
  dil.setAttribute('aria-expanded', 'false');
  dil.innerHTML = `<span class="hizli-dil-ic">${ikon('ayarlar', 17, 1.5)}</span>`;
  nav.after(dil);
  kok = document.createElement('div');
  kok.className = 'hizli-ayar';
  kok.dataset.test = 'hizli-ayar';
  kok.hidden = true;
  kok.innerHTML = '<div class="hizli-perde" data-hizli-kapat></div><section class="hizli-yaprak" role="dialog" aria-modal="true" aria-labelledby="hizli-baslik"></section>';
  dil.after(kok);

  dil.addEventListener('click', () => {
    if (dil.dataset.yeniKaydi) return;
    if (acik) hizliAyarKapat();
    else hizliAyarAc();
  });
  kok.addEventListener('click', (e) => {
    if (e.target.closest('[data-hizli-kapat]')) return hizliAyarKapat();
    if (e.target.closest('.hizli-hepsi')) return hizliAyarKapat({ odak: false });
    const kb = e.target.closest('[data-hizli-kart]');
    if (!kb) return;
    const a = d.ilerleme.ayarlar;
    a.gunlukKart = Math.min(100, Math.max(5, a.gunlukKart + Number(kb.dataset.hizliKart)));
    const cikti = kok.querySelector('[data-test="hizli-gunluk-kart"]');
    cikti.textContent = a.gunlukKart;
    cikti.classList.remove('oynadi');
    void cikti.offsetWidth;
    cikti.classList.add('oynadi');
    kaydet();
  });
  kok.addEventListener('change', (e) => {
    const { name, value } = e.target;
    const a = d.ilerleme.ayarlar;
    if (name === 'hizli-tema' && TEMALAR.includes(value)) a.tema = value;
    else if (name === 'hizli-hareket' && HAREKETLER.includes(value)) a.hareket = value;
    else return;
    const grup = e.target.closest('.hizli-parca');
    grup.style.setProperty('--i', [...grup.querySelectorAll('input')].indexOf(e.target));
    kaydet();
    temaUygula();
  });
  document.addEventListener('keydown', (e) => {
    if (acik && e.key === 'Escape') hizliAyarKapat();
  });
  // sayfa değişince yaprak kapanır; Ayarlar'ın kendi ekranında dil görünmez (aynı ayarlar zaten ekranda)
  const adres = () => {
    hizliAyarKapat({ odak: false });
    dil.hidden = location.hash === '#/ayarlar';
  };
  window.addEventListener('hashchange', adres);
  dil.hidden = location.hash === '#/ayarlar';
  surukleKur();
}
