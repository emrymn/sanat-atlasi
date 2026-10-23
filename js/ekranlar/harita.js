// Yolculuk haritası (İş 23): elle boyanmış adalardan kuş bakışı harita. Alttan (Orta Çağ) yukarıya (Modern)
// çıkılır; her akım boyalı yolun üstünde bir durak, durakta o dönemin başyapıtı. Kilitli adalar soluk,
// kurs ilerledikçe renklenir. Durağa dokununca küçük pencere: başyapıt, yıldızlar, "Tura başla", "Akım sayfası".
import { kacis } from '../yardimci.js';
import { akimDurumlari } from '../kilit.js';
import { sanatciEserleri } from '../eserler.js';
import { eserEslestir } from '../basyapit.js';
import { gorselUrl, secilenGorsel } from '../gorsel.js';
import { ikon, akimYuzyillari } from '../tasarim.js';
import { seviyeKaydi, seviyeDurumu } from '../seviye.js';
import { haritaKur, yolNoktasi, durakKonumlari, yolParcasi, yeniAcilanDuraklar } from '../harita.js';
import { basyapitVeri } from './gozat.js';
import { d, ekran, ciz, ust, islenen, akimRenk, kotuler, enBilinen, kaydet, gununRengi, cizimNo, guncelMi } from './ortak.js';

export const ADA_GORSELI = (id) => `gorseller/harita/${id}.webp`;

const yildizHtml = (n) =>
  `<span class="harita-yildiz" aria-label="${n} / 3 yıldız">${[0, 1, 2].map((i) => `<i class="${i < n ? 'dolu' : ''}">★</i>`).join('')}</span>`;

// Bir adanın durakları: yol üzerindeki konumları ve geçilen yolun ucu
function adaYerlesimi(b) {
  const t = durakKonumlari(b.duraklar.length);
  return b.duraklar.map((x, i) => {
    const [px, py] = yolNoktasi(b.yol, t[i]);
    return { x, t: t[i], px, py, i };
  });
}

function durakHtml({ x, px, py, i }, { simdiki, yeni }) {
  // levha yolun boş tarafına; yol ortadaysa sırayla sağa ve sola (üst üste binmesin)
  const sag = px < 0.42 ? true : px > 0.58 ? false : i % 2 === 0;
  const alt = x.acik ? yildizHtml(x.yildiz) : `<small>${x.acilacagiKonu ? `Konu ${x.acilacagiKonu}` : 'Kilitli'}</small>`;
  return `<button type="button" class="harita-durak${x.acik ? ' acik' : ' kilitli'}${simdiki ? ' simdiki' : ''}${yeni ? ' yeni' : ''}${sag ? ' sag' : ' sol'}"
      style="left:${(px * 100).toFixed(2)}%;top:${(py * 100).toFixed(2)}%;--renk:${akimRenk(x.ad)};--i:${x.no}"
      data-test="harita-durak" data-akim="${kacis(x.ad)}" data-acik="${x.acik}" data-harita-durak="${kacis(x.ad)}"
      aria-label="${kacis(x.ad)}${x.acik ? `, ${x.yildiz} yıldız` : ', kilitli'}${simdiki ? ', buradasın' : ''}">
      ${simdiki ? '<span class="harita-buradasin" aria-hidden="true">Buradasın</span>' : ''}
      <span class="harita-madalyon" data-harita-resim="${kacis(x.ad)}">${x.acik ? '' : `<span class="harita-kilit">${ikon('kilit', 18, 1.8)}</span>`}</span>
      <span class="harita-levha"><b>${kacis(x.ad)}</b>${alt}</span>
    </button>`;
}

function adaHtml(b, { simdiki, yeniler }) {
  const yer = adaYerlesimi(b);
  // geçilen yol: adanın başından son açık durağa (ada tamamen açıksa yolun sonuna)
  const acikSon = yer.filter((y) => y.x.acik).pop();
  const tumAcik = yer.every((y) => y.x.acik);
  const tSon = tumAcik ? 1 : acikSon ? acikSon.t : 0;
  const parca = yolParcasi(b.yol, tSon);
  const yeniAda = b.acik && b.duraklar.every((x) => !x.acik || yeniler.has(x.ad)) && b.duraklar.some((x) => yeniler.has(x.ad));
  return `<section class="harita-ada${b.acik ? '' : ' kilitli'}${yeniAda ? ' yeni-acilan' : ''}" data-test="harita-bolge" data-bolge="${b.id}" aria-label="${kacis(b.ad)}">
      <img class="harita-ada-resim" src="${ADA_GORSELI(b.id)}" alt="" decoding="async" ${b.id === 'ortacag' ? '' : 'loading="lazy"'}>
      <svg class="harita-iz" viewBox="0 0 600 900" preserveAspectRatio="none" aria-hidden="true">${parca ? `<polyline points="${parca}"/>` : ''}</svg>
      <div class="harita-ada-baslik"><b>${kacis(b.ad)}</b><span>${kacis(b.yuzyil)}${b.acik ? '' : ' · kilitli'}</span></div>
      ${yer.map((y) => durakHtml(y, { simdiki: y.x.ad === simdiki, yeni: yeniler.has(y.x.ad) })).join('')}
    </section>`;
}

export async function haritaSayfasi() {
  const durumlar = akimDurumlari(d.akimlar, d.sanatcilar, islenen());
  const h = haritaKur(durumlar, d.ilerleme);
  const yeniler = new Set(yeniAcilanDuraklar(h.duraklar, d.ilerleme.haritaGorulen));
  const acikSayi = h.duraklar.filter((x) => x.acik).length;
  const yildizToplam = h.duraklar.reduce((t, x) => t + x.yildiz, 0);
  d.haritaVerisi = h;
  gununRengi();
  // Modern en üstte, Orta Çağ en altta: yolculuk aşağıdan yukarı
  ciz(`${ust('Yolculuk', '#/ilerleme', { ustEtiket: 'Harita' })}
    <p class="harita-ozet"><b>${acikSayi}</b>/${h.duraklar.length} durak · <b>${yildizToplam}</b>/${h.duraklar.length * 3} ★ <span>· ★ Orta'ya, ★★ Zor'a geçince, ★★★ Zor'da da %80</span></p>
    <div class="harita" data-test="harita">
      ${h.bolgeler
        .slice()
        .reverse()
        .map((b) => adaHtml(b, { simdiki: h.simdiki, yeniler }))
        .join('')}
    </div>
    <div class="harita-pencere" data-harita-pencere hidden></div>`);
  // "buradasın" durağı ekranın ortasına; yoksa en alttaki ada
  const s = ekran.querySelector('.harita-durak.simdiki') || ekran.querySelector('.harita-ada:last-of-type');
  if (s) {
    const ilk = () => {
      const r = s.getBoundingClientRect();
      window.scrollTo(0, Math.max(0, r.top + window.scrollY - window.innerHeight * 0.55));
    };
    ilk();
    // resimler yüklenip yükseklik oturunca bir kez daha
    const img = ekran.querySelector('.harita-ada:last-of-type img');
    if (img && !img.complete) img.addEventListener('load', ilk, { once: true });
  }
  if (yeniler.size) {
    d.ilerleme.haritaGorulen = [...new Set([...(d.ilerleme.haritaGorulen || []), ...yeniler])];
    kaydet();
  }
  resimleriDoldur(h.duraklar);
}

// Her durağa o dönemin başyapıtı: önce yakın okuması olan eser, yoksa dönemin bir kurs sanatçısının en bilinen eseri
const durakEseri = new Map();
async function resimleriDoldur(duraklar) {
  const no = cizimNo();
  const basyapitlar = await basyapitVeri().catch(() => []);
  if (!guncelMi(no)) return;
  for (const x of duraklar) {
    const b = basyapitlar.find((y) => {
      const s = d.harita.get(y.sanatci);
      return s && s.akim === x.ad;
    });
    const sanatci = b ? d.harita.get(b.sanatci) : d.sanatcilar.find((s) => s.akim === x.ad && s.kaynak === 'kurs') || d.sanatcilar.find((s) => s.akim === x.ad);
    if (!sanatci) continue;
    sanatciEserleri(sanatci).then((liste) => {
      const e = (b && eserEslestir(liste, b)) || enBilinen(liste);
      const g = e && secilenGorsel(e, kotuler());
      if (!g) return;
      durakEseri.set(x.ad, { e, g, sanatci, basyapit: b || null });
      const kutu = ekran.querySelector(`[data-harita-resim="${CSS.escape(x.ad)}"]`);
      if (!kutu || !guncelMi(no)) return;
      kutu.insertAdjacentHTML('afterbegin', `<img alt="" decoding="async" src="${kacis(gorselUrl(g, 400))}">`);
    });
  }
}

// ---------- küçük pencere ----------
function pencereAc(ad) {
  const h = d.haritaVerisi;
  const x = h && h.duraklar.find((y) => y.ad === ad);
  const kutu = ekran.querySelector('[data-harita-pencere]');
  if (!x || !kutu) return;
  const es = durakEseri.get(ad);
  const uyeler = d.sanatcilar.filter((s) => s.akim === ad);
  const yillar = akimYuzyillari(uyeler);
  const resim = es ? `<img alt="" src="${kacis(gorselUrl(es.g, 800))}">` : '';
  const eserYazi = es ? `${kacis(es.e.ad || es.e.baslik)} · ${kacis(es.sanatci.ad)}` : '';
  const govde = x.acik
    ? `${yildizHtml(x.yildiz)}
      <p class="harita-pencere-durum">${kacis(seviyeDurumu(seviyeKaydi(d.ilerleme, ad)))}</p>
      <p class="harita-pencere-alt">${x.acikSayisi}/${x.toplam} sanatçı açık</p>
      <div class="harita-pencere-dugmeler">
        <a class="dugme vurgu" href="#/pekistir/donem/${encodeURIComponent(ad)}" data-test="harita-tur">Tura başla</a>
        <a class="dugme" href="#/akim/${encodeURIComponent(ad)}" data-test="harita-akim">Akım sayfası</a>
      </div>`
    : `<p class="harita-pencere-durum">${x.acilacagiKonu ? `Konu ${x.acilacagiKonu} işlenince açılır.` : 'Bu durak henüz kilitli.'}</p>
      <div class="harita-pencere-dugmeler"><a class="dugme" href="#/ilerleme" data-test="harita-ilerleme">İlerleme'ye git</a></div>`;
  kutu.innerHTML = `<div class="harita-pencere-ic${x.acik ? '' : ' kilitli'}" role="dialog" aria-label="${kacis(ad)}" style="--renk:${akimRenk(ad)}">
      <button class="harita-pencere-kapat" type="button" data-harita-kapat aria-label="Kapat">${ikon('kapat', 20, 1.7)}</button>
      <div class="harita-pencere-resim">${resim}</div>
      <div class="harita-pencere-yazi">
        <span class="etiket">${kacis(yillar || '')}</span>
        <h2>${kacis(ad)}</h2>
        ${eserYazi ? `<p class="harita-pencere-eser">${eserYazi}</p>` : ''}
        ${govde}
      </div>
    </div>`;
  kutu.hidden = false;
  requestAnimationFrame(() => kutu.classList.add('acik'));
  for (const el of ekran.querySelectorAll('.harita-durak.secili')) el.classList.remove('secili');
  const dugme = ekran.querySelector(`[data-harita-durak="${CSS.escape(ad)}"]`);
  if (dugme) dugme.classList.add('secili');
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
    const dugme = e.target.closest('[data-harita-durak]');
    if (dugme) {
      pencereAc(dugme.dataset.haritaDurak);
      return;
    }
    if (e.target.closest('[data-harita-kapat]')) {
      pencereKapat();
      return;
    }
    // pencerenin dışına dokununca kapanır
    if (!e.target.closest('[data-harita-pencere]')) pencereKapat();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') pencereKapat();
  });
}

// İlerleme'nin başındaki giriş: haritanın küçük özeti
export function haritaBagi() {
  const durumlar = akimDurumlari(d.akimlar, d.sanatcilar, islenen());
  const h = haritaKur(durumlar, d.ilerleme);
  const acik = h.duraklar.filter((x) => x.acik).length;
  const yildiz = h.duraklar.reduce((t, x) => t + x.yildiz, 0);
  const b = h.simdiki ? h.bolgeler.find((x) => x.duraklar.some((y) => y.ad === h.simdiki)) : h.bolgeler[0];
  return `<a class="harita-bag" href="#/harita" data-test="harita-bag">
      <span class="harita-bag-resim" aria-hidden="true"><img alt="" loading="lazy" src="${ADA_GORSELI(b ? b.id : 'ortacag')}"></span>
      <span class="metin"><b>Yolculuk haritası</b><span>${h.simdiki ? `Buradasın: ${kacis(h.simdiki)}` : 'Yolculuk başlamadı'}</span><span>${acik}/${h.duraklar.length} durak · ${yildiz} ★</span></span>
      ${ikon('ileri', 20, 1.4)}
    </a>`;
}
