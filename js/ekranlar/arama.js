// Ara (K1): sanatçı, eser, konu ve başyapıt araması. Dizin ilk açılışta kurulur, işlenen konular değişince yenilenir.
import { kacis, yillarYaz, bulunmaEki } from '../yardimci.js';
import { sanatciEserleri, eserBaslik } from '../eserler.js';
import { goruntuleyiciAc } from '../goruntuleyici.js';
import { ikon } from '../tasarim.js';
import { bilinenAd } from '../adlar.js';
import { dizinKur, ara, GRUPLAR } from '../arama.js';
import { d, ekran, etiket, gununRengi, ciz, islenen, acikListe, kucukGorsel, kucukKareleriDoldur, notuIcin, gorselTercihi, ust, akimNoktasi } from './ortak.js';
import { ikonografiVeri, basyapitVeri, basyapitAdresi } from './gozat.js';

let dizinSozu = null;
let dizinAnahtari = '';
let sonEserler = [];

function dizinAl() {
  const anahtar = [...islenen()].sort((a, b) => a - b).join(',');
  if (dizinSozu && anahtar === dizinAnahtari) return dizinSozu;
  dizinAnahtari = anahtar;
  // eserler yalnızca açık sanatçılardan (kilitli sanatçının eserleri gösterilmez)
  dizinSozu = Promise.all([
    Promise.all(
      acikListe().map((s) =>
        sanatciEserleri(s).then(
          (l) => (l || []).map((e) => ({ e, s })),
          () => [],
        ),
      ),
    ),
    ikonografiVeri().catch(() => []),
    basyapitVeri().catch(() => []),
  ]).then(([eserler, konular, basyapitlar]) => dizinKur({ sanatcilar: d.sanatcilar, eserler: eserler.flat(), konular, basyapitlar, adlar: d.kisaAdlar }));
  return dizinSozu;
}

export async function aramaSayfasi() {
  gununRengi();
  ciz(`${ust('Ara', '#/gozat', { ustEtiket: 'Göz At' })}
    <div class="arama-alan">${ikon('ara', 20, 1.6)}<input id="arama-girdi" type="search" inputmode="search" enterkeyhint="search" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Sanatçı, eser, konu…" aria-label="Ara" value="${kacis(d.aramaSorgu || '')}" data-test="arama-girdi"><button class="arama-temizle" type="button" data-arama-temizle aria-label="Temizle"${d.aramaSorgu ? '' : ' hidden'}>${ikon('kapat', 18, 1.7)}</button></div>
    <div data-arama-sonuc aria-live="polite"><p class="ikincil kucuk">Dizin hazırlanıyor…</p></div>`);
  const girdi = ekran.querySelector('#arama-girdi');
  girdi.focus({ preventScroll: true });
  await dizinAl();
  if (!girdi.isConnected) return;
  sonuclariCiz();
}

const eserAltYazi = (e, s) => [bilinenAd(s.ad, d.kisaAdlar[s.id]), e.yil].filter(Boolean).join(' · ');

function satirHtml(x, i) {
  if (x.tur === 'sanatci') {
    const s = x.veri;
    if (!islenen().has(s.konu))
      return `<li><div class="satir kilitli" aria-disabled="true"><span class="metin"><b>${kacis(s.ad)}</b><span>${kacis(yillarYaz(s))} · ${ikon('kilit', 13)} Konu ${bulunmaEki(s.konu)} açılır</span></span></div></li>`;
    return `<li><a class="satir" href="#/sanatci/${encodeURIComponent(s.id)}"><span class="kucuk-kare" data-kucuk="${kacis(s.id)}"></span><span class="metin"><b>${kacis(s.ad)}</b><span>${kacis(yillarYaz(s))} · ${akimNoktasi(s.akim)}${kacis(s.akim)}</span></span>${ikon('ileri', 20, 1.4)}</a></li>`;
  }
  if (x.tur === 'eser') {
    const { e, s } = x.veri;
    const ozgun = e.ad && e.ad !== e.baslik ? `<i lang="en">${kacis(e.baslik)}</i>` : '';
    return `<li><button class="satir arama-eser" type="button" data-arama-eser="${i}"><span class="kucuk-kare">${kucukGorsel(e, 400)}</span><span class="metin"><b>${kacis(eserBaslik(e))}</b>${ozgun}<span>${kacis(eserAltYazi(e, s))}</span></span>${ikon('buyut', 18, 1.4)}</button></li>`;
  }
  if (x.tur === 'konu') {
    const k = x.veri;
    return `<li><a class="satir" href="#/konu/${encodeURIComponent(k.id)}"><span class="metin"><b>${kacis(k.ad)}</b><span>${kacis(k.ozet || '')} · ${(k.eserler || []).length} eser</span></span>${ikon('ileri', 20, 1.4)}</a></li>`;
  }
  const b = x.veri;
  const s = d.harita.get(b.sanatci);
  return `<li><a class="satir" href="${basyapitAdresi(b.anahtar)}"><span class="metin"><b>${kacis(b.baslik)}</b><span>Yakın okuma${s ? ` · ${kacis(bilinenAd(s.ad, d.kisaAdlar[s.id]))}` : ''}</span></span>${ikon('ileri', 20, 1.4)}</a></li>`;
}

async function sonuclariCiz() {
  const kutu = ekran.querySelector('[data-arama-sonuc]');
  if (!kutu) return;
  const sorgu = d.aramaSorgu || '';
  const dizin = await dizinAl();
  if (!kutu.isConnected || sorgu !== (d.aramaSorgu || '')) return;
  const r = ara(dizin, sorgu);
  sonEserler = r.eser.map((x) => x.veri.e);
  if (sorgu.trim().length < 2) {
    kutu.innerHTML = `<p class="ikincil kucuk arama-ipucu">Ad yazmaya başla: “Rembrandt”, “Gece Nöbeti” ya da “Night Watch”, “Müjde”. Türkçe harfler şart değil.</p>`;
    return;
  }
  if (!r.toplam) {
    kutu.innerHTML = `<p class="ikincil arama-ipucu" data-test="arama-yok">“${kacis(sorgu)}” için sonuç yok.</p>`;
    return;
  }
  let eserSira = 0;
  kutu.innerHTML = GRUPLAR.filter(([t]) => r[t].length)
    .map(
      ([t, ad]) =>
        `<section class="bolum arama-grup" data-arama-grup="${t}">${etiket(`${ad} · ${r.sayilar[t]}`)}<ul class="liste">${r[t]
          .map((x) => satirHtml(x, x.tur === 'eser' ? eserSira++ : 0))
          .join(
            '',
          )}</ul>${r.sayilar[t] > r[t].length ? `<p class="kucuk ikincil arama-fazla">ve ${r.sayilar[t] - r[t].length} sonuç daha; aramayı daralt.</p>` : ''}</section>`,
    )
    .join('');
  kucukKareleriDoldur();
}

// Ekranın olay dinleyicileri; app.js bir kez bağlar
export function olaylariBagla() {
  ekran.addEventListener('input', (e) => {
    if (e.target.id !== 'arama-girdi') return;
    d.aramaSorgu = e.target.value;
    ekran.querySelector('[data-arama-temizle]').hidden = !d.aramaSorgu;
    sonuclariCiz();
  });
  ekran.addEventListener('click', (e) => {
    if (e.target.closest('[data-arama-temizle]')) {
      const g = ekran.querySelector('#arama-girdi');
      g.value = '';
      g.dispatchEvent(new Event('input', { bubbles: true }));
      g.focus();
      return;
    }
    const b = e.target.closest('[data-arama-eser]');
    if (!b) return;
    const i = Number(b.dataset.aramaEser);
    const eser = sonEserler[i];
    if (eser) goruntuleyiciAc({ eserler: [eser], notu: notuIcin(eser.sid), ...gorselTercihi() });
  });
}
