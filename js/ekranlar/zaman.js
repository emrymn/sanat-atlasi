// Zaman (K2): yatay kayan yaşam çizgisi şeridi. Üstte akım bantları (keskin akım renkleri), altta her sanatçı
// doğumundan ölümüne akım renginde ince çubuk. İki parmakla (ya da +/− ile) yakınlaştırılır; çubuğa dokununca
// sanatçının küçük kartı. Kilitli sanatçılar soluk.
import { kacis, yillarYaz, bulunmaEki } from '../yardimci.js';
import { sanatciEserleri } from '../eserler.js';
import { ikon } from '../tasarim.js';
import { bilinenAd } from '../adlar.js';
import { BAS, SON, yilX, sanatciSeritleri, akimBantlari, centikler, pxSinirla } from '../zaman.js';
import { d, ekran, gununRengi, ciz, islenen, akimRenk, kucukGorsel, enBilinen } from './ortak.js';
import { gozAtUst } from './gozat.js';

const SERIT_H = 30; // sanatçı şeridi yüksekliği
const BANT_H = 22; // akım bandı yüksekliği
const adi = (s) => bilinenAd(s.ad, d.kisaAdlar[s.id]);

function seritHtml(px) {
  const k = islenen();
  const bantlar = akimBantlari(d.akimlar, d.sanatcilar, px);
  const cubuklar = sanatciSeritleri(d.sanatcilar, px, { adFn: adi });
  const bantH = (Math.max(0, ...bantlar.map((b) => b.serit)) + 1) * BANT_H;
  const cubukH = (Math.max(0, ...cubuklar.map((c) => c.serit)) + 1) * SERIT_H;
  const genislik = yilX(SON, px) + 24;
  return `<div class="zaman-tuval" style="width:${genislik}px;--bant-h:${bantH}px;height:${bantH + cubukH + 40}px" data-test="zaman-tuval">
      <div class="zaman-eksen">${centikler(px)
        .map((c) => `<span class="centik${c.buyuk ? ' buyuk' : ''}" style="left:${yilX(c.yil, px)}px">${c.buyuk || px >= 3 ? c.yil : ''}</span>`)
        .join('')}</div>
      ${bantlar
        .map(
          (b) =>
            `<a class="zaman-bant" href="#/akim/${encodeURIComponent(b.ad)}" style="left:${b.x}px;width:${b.w}px;top:${26 + b.serit * BANT_H}px;--renk:${b.renk || akimRenk(b.ad)}"><span>${kacis(b.ad)}</span></a>`,
        )
        .join('')}
      ${cubuklar
        .map(
          (c, i) =>
            `<button type="button" class="zaman-cubuk${k.has(c.s.konu) ? '' : ' kilitli'}" data-zaman-sanatci="${kacis(c.s.id)}" style="left:${c.x}px;width:${c.w}px;top:${34 + bantH + c.serit * SERIT_H}px;--renk:${akimRenk(c.s.akim)};--i:${i}" aria-label="${kacis(`${c.s.ad}, ${yillarYaz(c.s)}`)}"><i></i><span>${kacis(adi(c.s))}</span></button>`,
        )
        .join('')}
    </div>`;
}

export function zamanSayfasi() {
  gununRengi();
  if (!d.zamanPx) d.zamanPx = 2.4;
  ciz(`${gozAtUst('zaman')}
    <div class="zaman-pano">
      <p class="zaman-yil" aria-live="polite"><b data-zaman-yil>—</b><span><span data-zaman-canli>0</span> sanatçı aynı anda yaşıyor</span></p>
      <div class="zaman-araclar" role="group" aria-label="Yakınlaştırma"><button type="button" class="zaman-yakin" data-zaman-yakin="-1" aria-label="Uzaklaştır">${ikon('eksi', 16, 1.8)}</button><button type="button" class="zaman-yakin" data-zaman-yakin="1" aria-label="Yakınlaştır">${ikon('arti', 16, 1.8)}</button></div>
    </div>
    <div class="zaman-pencere">
      <div class="zaman-kaydir" data-zaman-kaydir>${seritHtml(d.zamanPx)}</div>
      <span class="zaman-imlec" aria-hidden="true"></span>
    </div>
    <p class="zaman-ipucu">Kaydır: ortadaki çizgi yılı okur, o yılda yaşayanlar parlar. Çizgiye dokun, sanatçıyı aç.</p>
    <div data-zaman-kart></div>`);
  const k = ekran.querySelector('[data-zaman-kaydir]');
  // ilk açılışta açık sanatçıların ortasına kaydır
  if (d.zamanKaydirma != null) k.scrollLeft = d.zamanKaydirma;
  else {
    const acik = d.sanatcilar.filter((s) => islenen().has(s.konu) && s.dogum != null);
    const orta = acik.length ? acik.reduce((t, s) => t + s.dogum, 0) / acik.length : 1500;
    k.scrollLeft = yilX(orta, d.zamanPx) - k.clientWidth / 2;
  }
  let kare = 0;
  k.addEventListener(
    'scroll',
    () => {
      d.zamanKaydirma = k.scrollLeft;
      if (!kare) kare = requestAnimationFrame(() => ((kare = 0), imleciGuncelle(k)));
    },
    { passive: true },
  );
  imleciGuncelle(k);
  yakinlastirmaBagla(k);
}

// Ortadaki imleç: o yılı yazar ve o yılda yaşayan sanatçıların çizgilerini parlatır
const TUVAL_PAY = 12;
function imleciGuncelle(k) {
  const x = k.scrollLeft + k.clientWidth / 2 - TUVAL_PAY;
  const yil = Math.round(BAS + x / d.zamanPx);
  let n = 0;
  for (const c of k.querySelectorAll('.zaman-cubuk')) {
    const sol = c.offsetLeft;
    const canli = x >= sol && x <= sol + c.offsetWidth;
    c.classList.toggle('canli', canli);
    if (canli) n++;
  }
  const y = ekran.querySelector('[data-zaman-yil]');
  const s = ekran.querySelector('[data-zaman-canli]');
  if (y) y.textContent = Math.min(SON, Math.max(BAS, yil));
  if (s) s.textContent = n;
}

// Yakınlaştırma: merkezdeki (ya da parmakların ortasındaki) yıl yerinde kalır
function yakinlastir(k, yeniPx, merkezX = k.clientWidth / 2) {
  const eski = d.zamanPx;
  const px = pxSinirla(yeniPx);
  if (Math.abs(px - eski) < 0.01) return;
  const yil = BAS + (k.scrollLeft + merkezX) / eski;
  d.zamanPx = px;
  k.innerHTML = seritHtml(px);
  k.querySelector('.zaman-tuval').classList.add('durgun');
  k.scrollLeft = (yil - BAS) * px - merkezX;
  d.zamanKaydirma = k.scrollLeft;
  imleciGuncelle(k);
}

function yakinlastirmaBagla(k) {
  let bas = null;
  const uzaklik = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  k.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length === 2)
        bas = { u: uzaklik(e.touches), px: d.zamanPx, x: (e.touches[0].clientX + e.touches[1].clientX) / 2 - k.getBoundingClientRect().left };
    },
    { passive: true },
  );
  k.addEventListener(
    'touchmove',
    (e) => {
      if (!bas || e.touches.length !== 2) return;
      e.preventDefault();
      yakinlastir(k, bas.px * (uzaklik(e.touches) / bas.u), bas.x);
    },
    { passive: false },
  );
  k.addEventListener('touchend', () => (bas = null));
  // iOS Safari sayfa yakınlaştırmasını şeritte durdur
  k.addEventListener('gesturestart', (e) => e.preventDefault());
}

function kartGoster(s) {
  const kutu = ekran.querySelector('[data-zaman-kart]');
  if (!kutu) return;
  const acik = islenen().has(s.konu);
  for (const b of ekran.querySelectorAll('.zaman-cubuk.secili')) b.classList.remove('secili');
  const b = ekran.querySelector(`[data-zaman-sanatci="${CSS.escape(s.id)}"]`);
  if (b) b.classList.add('secili');
  kutu.innerHTML = `<aside class="zaman-sanatci" data-test="zaman-kart" style="--renk:${akimRenk(s.akim)}">
      <span class="kucuk-kare" data-zaman-kare></span>
      <div class="zaman-sanatci-yazi"><b>${kacis(s.ad)}</b><span>${kacis(yillarYaz(s))} · ${kacis(s.akim)}</span>${
        acik ? '' : `<small>${ikon('kilit', 12)} Konu ${bulunmaEki(s.konu)} açılır</small>`
      }</div>
      ${acik ? `<a class="dugme zaman-sanatci-dugme" href="#/sanatci/${encodeURIComponent(s.id)}">Sayfası</a>` : ''}
      <button class="zaman-sanatci-kapat" type="button" data-zaman-kapat aria-label="Kapat">${ikon('kapat', 18, 1.7)}</button>
    </aside>`;
  if (acik)
    sanatciEserleri(s).then((l) => {
      const kare = kutu.querySelector('[data-zaman-kare]');
      const e = enBilinen(l || []);
      if (kare && e) kare.innerHTML = kucukGorsel(e, 400);
    });
}

// Ekranın olay dinleyicileri; app.js bir kez bağlar
export function olaylariBagla() {
  ekran.addEventListener('click', (e) => {
    const c = e.target.closest('[data-zaman-sanatci]');
    if (c) {
      const s = d.harita.get(c.dataset.zamanSanatci);
      if (s) kartGoster(s);
      return;
    }
    if (e.target.closest('[data-zaman-kapat]')) {
      ekran.querySelector('[data-zaman-kart]').innerHTML = '';
      for (const b of ekran.querySelectorAll('.zaman-cubuk.secili')) b.classList.remove('secili');
      return;
    }
    const y = e.target.closest('[data-zaman-yakin]');
    if (y) {
      const k = ekran.querySelector('[data-zaman-kaydir]');
      yakinlastir(k, d.zamanPx * (y.dataset.zamanYakin === '1' ? 1.5 : 1 / 1.5));
    }
  });
}
