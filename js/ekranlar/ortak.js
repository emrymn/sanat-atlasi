// Ekranların ortak parçaları: uygulama durumu (d), ekran öğesi, küçük yardımcılar, resim rengi, bildirim, sekme çubuğu, başlık ve çizim.
import { kacis, yillarYaz, rastgeleYap } from '../yardimci.js';
import { acikSanatcilar, islenenKume } from '../kilit.js';
import { bugunStr } from '../leitner.js';
import { sanatciEserleri, eserBaslik } from '../eserler.js';
import { gorselUrl, gorselYedek, secilenGorsel, paletUrl, gorselSayfasi, gorselOrani } from '../gorsel.js';
import { gununSanatcisi } from '../gunun.js';
import { ilerlemeKaydet } from '../depo.js';
import { kaynakYazisi } from '../goruntuleyici.js';
import { ikon } from '../tasarim.js';
import { adParcala } from '../adlar.js';
import { paletGetir, renkTemasi } from '../renk.js';
import { taninmaMetni, eserNotu } from '../karsilastir.js';
import { koleksiyondaMi, koleksiyonDegistir } from '../koleksiyon.js';
import { eseriBildir } from '../bildirim.js';

// "Bilmiyorum" cevabının değeri (Ö4): hiçbir sanatçı kimliği ya da akım adıyla çakışmaz
export const BILMIYORUM = '?';
// tema zeminleri: theme-color ve vurgu renginin kontrast hesabı için
const TEMA_RENK = { gece: '#0B0A0B', sepya: '#F1E8D6', acik: '#FBFAF7' };
export const TEMA_AD = { gece: 'Gece', sepya: 'Sepya', acik: 'Açık' };
export const TAHMINI_GORSEL_KB = 300;
export const HARFLER = 'ABCD';

// Cevap yaprağındaki kaynak satırı; WikiArt görselinde eser sayfasının bağlantısı da
export function kaynakSatiri(eser, g) {
  const yazi = kacis(kaynakYazisi(eser, g));
  const sayfa = g && g.k === 'wikiart' ? gorselSayfasi(g) : '';
  return sayfa ? `${yazi} · <a href="${kacis(sayfa)}" target="_blank" rel="noopener">eser sayfası</a>` : yazi;
}

export const d = {
  sanatcilar: [],
  akimlar: [],
  konular: [],
  harita: new Map(),
  akimSira: {},
  ortaYillar: {},
  ilerleme: null,
  oturum: null,
  yarim: null, // IndexedDB'deki yarım kalan oturum kaydı (js/devam.js)
  yigin: [],
  kursSecili: null, // İlerleme: kartı açık konu
  rng: rastgeleYap(Date.now() & 0xffffffff),
  indirme: null,
  onbellekIdleri: null,
  kolaylik: {},
  akimRenk: {},
  kisaAdlar: {},
  tanimaNotlari: {}, // data/tanima_notlari.json: kurs sanatçılarının "Nasıl tanırım?" notları
  eserNotlari: {}, // data/eser_notlari.json: önemli eserlere kısa açıklama
};

export const ekran = document.getElementById('uygulama');

export async function jsonGetir(yol) {
  const y = await fetch(yol);
  if (!y.ok) throw new Error(`${yol}: ${y.status}`);
  return y.json();
}

export function kaydet() {
  ilerlemeKaydet(d.ilerleme);
}

export function bugun() {
  return bugunStr();
}

export function islenen() {
  return islenenKume(d.ilerleme.islenen);
}

export function acikListe() {
  return acikSanatcilar(d.sanatcilar, islenen(), d.ilerleme.ekSanatcilar || []);
}

export function skor(id) {
  return (d.ilerleme.skorlar[id] ||= {});
}

// "Görsel kötü" tercihleri (ilerlemeyle birlikte saklanır ve yedeklenir)
export function kotuler() {
  return (d.ilerleme.kotuGorseller ||= {});
}

export function gorselTercihi(sonra = null) {
  return {
    kotuler: kotuler(),
    // K4: işaret düğmesi; İ5: "⋯" bildirim menüsü
    koleksiyon: {
      varMi: (e) => koleksiyondaMi(d.ilerleme, e),
      degistir: (e) => {
        const simdi = koleksiyonDegistir(d.ilerleme, e, bugunStr());
        ilerlemeKaydet(d.ilerleme);
        return simdi;
      },
    },
    bildir: (e, neden, gorsel) => eseriBildir(d.ilerleme, e, gorsel, neden, bugunStr()),
    degisti: () => {
      kaydet();
      if (sonra) sonra();
    },
  };
}

export function taninma(s) {
  return taninmaMetni(s, d.tanimaNotlari);
}

// Görüntüleyicide eser notu (sanatçıya göre anahtar): goruntuleyiciAc({ notu })
export function notuIcin(sanatciId) {
  return (e) => eserNotu(sanatciId, e, d.eserNotlari);
}

// Izgara küçük görseli: 400 px; açılmazsa (ör. çevrimdışı) 800 px denenir
export function kucukGorsel(e, genislik = 400) {
  const g = secilenGorsel(e, kotuler()) || e.gorseller[0];
  if (!g) return '';
  return `<img loading="lazy" decoding="async" alt="" src="${kacis(gorselUrl(g, genislik))}" data-yedek="${kacis(gorselYedek(g))}">`;
}

export function akimRenk(ad) {
  return d.akimRenk[ad] || '#8A827A';
}

// Akımın kendi rengi yalnızca küçük bir noktada kalır; geri kalan her şey altın/mürekkep token'larından
export function akimNoktasi(ad) {
  return `<span class="akim-nokta" style="--akim:${akimRenk(ad)}" aria-hidden="true"></span>`;
}

// Küçük resim (Göz At önizlemeleri): sabit yükseklik, oranına göre genişlik, 6 px köşe
export function cerceve(e, { genislik = 400, alt = '', tembel = false } = {}) {
  const g = secilenGorsel(e, kotuler()) || e.gorseller[0];
  if (!g) return '';
  const yedek = genislik < 800 ? ` data-yedek="${kacis(gorselYedek(g))}"` : '';
  return `<span class="cerceve"><img ${tembel ? 'loading="lazy" ' : ''}decoding="async" alt="${kacis(alt)}" src="${kacis(gorselUrl(g, genislik))}"${yedek}></span>`;
}

export function etiket(metin, { vurgu = false } = {}) {
  return `<span class="etiket${vurgu ? ' vurgu' : ''}">${kacis(metin)}</span>`;
}

// Zemin, yelpazedeki üç eserden (sıra 0-2) farklı olsun ve her düğmede/her gün değişsin
let zeminSayaci = 0;
const zeminSirasi = () => 3 + ((Math.floor(Date.now() / 864e5) + zeminSayaci++ * 3) % 7);

// Eser düğmesi: tur başlatan her düğme. Bir sanatçının üç eseri düğmenin üstünden yelpaze gibi yükselir;
// gövde arkadaki resmin rengini alan buzlu camdır. ilerleme: { yapilan, hedef } → altta günlük hedef çizgisi.
export function tabloDugme({ href, baslik, alt = '', sayi, test = '', sanatciId = '', kapakId = '', sinif = '', ilerleme = null }) {
  const kaynak = sanatciId || kapakId;
  const oran = ilerleme && ilerleme.hedef ? Math.min(100, Math.round((100 * ilerleme.yapilan) / ilerleme.hedef)) : null;
  const yelpaze = kaynak
    ? `<span class="ed-yelpaze" aria-hidden="true">${[0, 1, 2]
        .map((i) => `<span class="ed-tuval" style="--i:${i}"><span data-eser-kucuk="${kacis(kaynak)}" data-sira="${i}"></span></span>`)
        .join('')}</span>`
    : '';
  return `<a class="eser-dugme${kaynak ? ' yelpazeli' : ''}${sinif ? ` ${sinif}` : ''}" href="${href}"${test ? ` data-test="${test}"` : ''}>
      ${yelpaze}
      <span class="ed-govde">
        ${kaynak ? `<span class="ed-zemin" aria-hidden="true" data-eser-kucuk="${kacis(kaynak)}" data-sira="${zeminSirasi()}"></span>` : ''}
        <span class="ed-yazi"><span class="ed-baslik">${kacis(baslik)}</span>${alt ? `<small data-test="tur-alt">${kacis(alt)}</small>` : ''}</span>
        <span class="ed-sayi"><b data-test="tur-sayi">${sayi}</b><small>kart</small></span>
        <span class="ed-ok" aria-hidden="true">${ikon('ileri', 18, 1.8)}</span>
        ${oran === null ? '' : `<span class="ed-hedef" role="img" aria-label="Bugün ${ilerleme.yapilan} / ${ilerleme.hedef} kart"><i style="--oran:${oran}%"></i></span>`}
      </span>
    </a>`;
}

// [data-eser-kucuk="<sanatçı id>"][data-sira="n"] kutularına sanatçının en bilinen n. eseri
export function eserKareleriDoldur() {
  for (const el of ekran.querySelectorAll('[data-eser-kucuk]')) {
    const s = d.harita.get(el.dataset.eserKucuk);
    if (!s) continue;
    sanatciEserleri(s).then((eserler) => {
      const sirali = bilinirlikSirasi(eserler).filter((e) => e.gorseller && e.gorseller.length);
      if (!sirali.length || !el.isConnected) return;
      const e = sirali[Number(el.dataset.sira) % sirali.length];
      el.innerHTML = kucukGorsel(e, 400);
      el.closest('.ed-tuval')?.classList.add('dolu');
    });
  }
}

// Eserin adı ve tarihi: "İnci Küpeli Kız, y. 1665"
export function eserAdi(e) {
  return `${eserBaslik(e)}${e.tarih ? `, ${e.tarih}` : ''}`;
}

// Künye: yıllar · akım · Konu N (Konu N vurgu renginde; kurs dışı sanatçıda "Kurs dışı")
export function kunye(s, { bag = true, konuYok = false } = {}) {
  const akim = bag ? `<a href="#/akim/${encodeURIComponent(s.akim)}">${kacis(s.akim)}</a>` : kacis(s.akim);
  const konu = konuYok ? '' : ` · <span class="vurgu-yazi">${s.kaynak === 'ek' ? 'Kurs dışı' : `Konu ${s.konu}`}</span>`;
  return `${kacis(yillarYaz(s))} · ${akim}${konu}${s.not_cikarilmadi ? ' <span class="rozet">taslak</span>' : ''}`;
}

// Ad iki satırda: küçük satır italik Bodoni 22 px, büyük satır (bilinen ad) Bodoni 64 px — sığmazsa küçülür.
// Erişilebilir ad her zaman tam addır.
export function isimHtml(sanatci, { etiketAdi = 'b', sinif = '', ek = '' } = {}) {
  const p = adParcala(sanatci.ad, d.kisaAdlar[sanatci.id]);
  return `<${etiketAdi} class="isim${sinif ? ' ' + sinif : ''}" aria-label="${kacis(sanatci.ad)}"${ek}>${p.ilk ? `<span class="ad-ilk">${kacis(p.ilk)}</span> ` : ''}<span class="ad-son" data-ad="${kacis(p.son)}">${kacis(p.son)}</span>${p.tam ? ` <span class="ad-ilk ad-tam">${kacis(p.tam)}</span>` : ''}</${etiketAdi}>`;
}

// Bir öğenin yazısını tek satıra sığana kadar küçültür (en küçük `enAz` px)
function sigdir(el, enAz) {
  el.style.fontSize = '';
  let boy = parseFloat(getComputedStyle(el).fontSize);
  while (el.scrollWidth > el.clientWidth + 1 && boy > enAz) {
    boy -= 1;
    el.style.fontSize = `${boy}px`;
  }
}

// Büyük ad (en az 34 px) ve Pekiştir sorusu (34 px'ten başlar, en az 24 px) tek satıra sığar
function adlariSigdir() {
  for (const el of ekran.querySelectorAll('.ad-son')) sigdir(el, 34);
  for (const el of ekran.querySelectorAll('.soru-baslik h2')) sigdir(el, 24);
}

// Resmin renkleri: genişlik renk payına göre
export function paletHtml(palet) {
  if (!palet || !palet.length) return '<div class="palet" aria-hidden="true"></div>';
  return `<div class="palet" role="img" aria-label="Resmin renkleri">${palet.map((p) => `<span style="flex-grow:${p.pay.toFixed(3)};background:${p.renk}"></span>`).join('')}</div>`;
}

// ---------- resim rengi: --vurgu değişkenleri gösterilen eserden ----------
const VURGU_DEGISKENLERI = {
  vurgu: '--vurgu',
  vurguYazi: '--vurgu-yazi',
  vurguAcik: '--vurgu-acik',
  vurguAcikYazi: '--vurgu-acik-yazi',
  vurguKoyu: '--vurgu-koyu',
  vurguRgb: '--vurgu-rgb',
};
let renkIstegi = 0;

// palet null ise temanın nötr vurgusuna dönülür
function renkleriYaz(palet) {
  d.palet = palet;
  const st = document.documentElement.style;
  const t = palet ? renkTemasi(palet, TEMA_RENK[d.ilerleme.ayarlar.tema] || TEMA_RENK.gece) : null;
  for (const [k, v] of Object.entries(VURGU_DEGISKENLERI)) {
    if (t) st.setProperty(v, t[k]);
    else st.removeProperty(v);
  }
}

// Eserin paleti; CORS ya da ağ hatasında yedek renk (tek renkli palet) ya da null
export async function eserPaleti(e, yedekRenk) {
  const g = e && (secilenGorsel(e, kotuler()) || e.gorseller[0]);
  try {
    return await paletGetir(paletUrl(g));
  } catch (err) {
    return yedekRenk ? [{ renk: yedekRenk, pay: 1 }] : null;
  }
}

// Ekranın rengini bu eserden al (eser bir söz de olabilir); bu arada başka ekrana geçildiyse yazılmaz
export function ekranRengi(eser, yedekRenk, sonra = null) {
  const sira = ++renkIstegi;
  return Promise.resolve(eser)
    .then((e) => eserPaleti(e, yedekRenk))
    .then((p) => {
      if (sira !== renkIstegi) return null;
      renkleriYaz(p);
      if (sonra) sonra(p);
      return p;
    });
}

// Bekleyen renk isteklerini geçersiz kılıp rengi hemen yazar (ör. paleti hazır kart)
export function renkSabitle(palet) {
  renkIstegi++;
  renkleriYaz(palet);
}

// Sekme ekranları (Göz At, İlerleme, Ayarlar, Pekiştir menüsü) Günün sanatçısının rengini taşır
export function gununRengi() {
  const s = d.harita.get(gununId());
  if (!s) return ekranRengi(null, null);
  return ekranRengi(sanatciEserleri(s).then(gununEseri), akimRenk(s.akim));
}

// [data-kucuk="<sanatçı id>"] kutularına en bilinen eserin küçük görseli
export function kucukKareleriDoldur() {
  eserKareleriDoldur();
  for (const el of ekran.querySelectorAll('[data-kucuk]')) {
    const s = d.harita.get(el.dataset.kucuk);
    if (!s) continue;
    sanatciEserleri(s).then((eserler) => {
      const e = enBilinen(eserler);
      if (e && el.isConnected) el.innerHTML = kucukGorsel(e, Number(el.dataset.genislik) || 400);
    });
  }
}

// ---------- bildirim ----------
let bildirimZamanlayici = null;
export function bildir(metin, { eylem = null, sure = 4000 } = {}) {
  const el = document.getElementById('bildirim');
  el.innerHTML = kacis(metin) + (eylem ? ` <button type="button">${kacis(eylem.ad)}</button>` : '');
  el.hidden = false;
  if (eylem) el.querySelector('button').onclick = eylem.fn;
  clearTimeout(bildirimZamanlayici);
  if (sure) bildirimZamanlayici = setTimeout(() => (el.hidden = true), sure);
}

export function temaUygula() {
  const t = d.ilerleme.ayarlar.tema;
  document.documentElement.setAttribute('data-tema', t);
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute('content', TEMA_RENK[t] || TEMA_RENK.gece);
  // vurgu renginin okunur hali temanın zeminine göre yeniden hesaplanır
  if (d.palet !== undefined) renkleriYaz(d.palet);
}

// ---------- sekme çubuğu ----------
// İş 24: Göz At haritaya katıldı; büyük Harita sekmesi ikinci sırada
const SEKMELER = [
  ['bugun', 'Tuval', '#/'],
  ['harita', 'Yolculuk', '#/harita'],
  ['gozat', 'Galeri', '#/gozat'],
  ['pekistir', 'Atölye', '#/pekistir'],
  ['ilerleme', 'Defter', '#/ilerleme'],
];

// etkin: sekme kimliği; null → sekme çubuğu yok (pekiştirme kartı).
// Çubuk bir kez kurulur; sonra yalnızca seçili sekme ve elmas işaret güncellenir (işaret kayarak geçer).
export function sekmeleriCiz(etkin) {
  const nav = document.getElementById('sekmeler');
  document.documentElement.classList.toggle('sekmesiz', etkin === null);
  if (etkin === null) {
    nav.hidden = true;
    return;
  }
  nav.hidden = false;
  if (!nav.querySelector('.sekme-isaret')) {
    nav.innerHTML =
      '<span class="sekme-isaret" aria-hidden="true"></span>' +
      SEKMELER.map(([id, ad, hash]) => `<a href="${hash}" draggable="false" data-sekme="${id}">${ikon('sekme-' + id, 22, 1.5)}<span>${ad}</span></a>`).join('');
    sekmeSurukle(nav);
  }
  const i = SEKMELER.findIndex(([id]) => id === etkin);
  // sekme değişince yeni ekran geldiği yönden kayar (sağdaki sekme sağdan)
  const onceki = Number(nav.style.getPropertyValue('--i'));
  ekran.dataset.yon = nav.style.getPropertyValue('--i') === '' || onceki === i ? '' : i > onceki ? 'sag' : 'sol';
  nav.style.setProperty('--i', Math.max(i, 0));
  for (const a of nav.querySelectorAll('a')) {
    if (a.dataset.sekme === etkin) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
}

// Apple tarzı sekme çubuğu: parmak çubukta gezinirken vurgu parmağı izler, bırakınca o sekmeye geçer
function sekmeSurukle(nav) {
  let basla = null;
  const sekmeAt = (x) => {
    const linkler = [...nav.querySelectorAll('a')];
    let en = 0;
    let fark = Infinity;
    linkler.forEach((a, i) => {
      const r = a.getBoundingClientRect();
      const f = Math.abs(r.left + r.width / 2 - x);
      if (f < fark) {
        fark = f;
        en = i;
      }
    });
    return en;
  };
  nav.addEventListener('pointerdown', (e) => {
    basla = { x: e.clientX, i: Number(nav.style.getPropertyValue('--i')) || 0, kaydi: false };
  });
  nav.addEventListener('pointermove', (e) => {
    if (!basla || (Math.abs(e.clientX - basla.x) < 8 && !basla.kaydi)) return;
    basla.kaydi = true;
    nav.classList.add('suruklen');
    const r = nav.getBoundingClientRect();
    const linkler = nav.querySelectorAll('a');
    // vurgu parmağın altında, sekmeler arasında serbestçe kayar
    const k = Math.max(0, Math.min(linkler.length - 1, ((e.clientX - r.left) / r.width) * linkler.length - 0.5));
    nav.style.setProperty('--surukle', k.toFixed(3));
  });
  const bitir = (e) => {
    if (!basla) return;
    const kaydi = basla.kaydi;
    basla = null;
    nav.classList.remove('suruklen');
    nav.style.removeProperty('--surukle');
    if (!kaydi) return;
    nav.dataset.yeniKaydi = '1';
    setTimeout(() => delete nav.dataset.yeniKaydi, 400);
    const a = nav.querySelectorAll('a')[sekmeAt(e.clientX)];
    if (a) {
      e.preventDefault();
      if (location.hash !== a.getAttribute('href') && !(a.getAttribute('href') === '#/' && (location.hash === '' || location.hash === '#/'))) location.hash = a.getAttribute('href');
    }
  };
  nav.addEventListener('pointerup', bitir);
  nav.addEventListener('pointercancel', () => {
    basla = null;
    nav.classList.remove('suruklen');
    nav.style.removeProperty('--surukle');
  });
  // sürüklemeden sonra gelen tıklama ikinci kez gezinmesin
  nav.addEventListener('click', (e) => {
    if (nav.dataset.yeniKaydi) {
      e.preventDefault();
      delete nav.dataset.yeniKaydi;
    }
  });
}

export function git(hash) {
  location.hash = hash;
}

export function geri(yedek = '#/') {
  if (d.yigin.length > 1) history.back();
  else {
    d.yigin = [];
    location.replace(yedek);
  }
}

export function hataGoster(e) {
  console.error(e);
  sekmeleriCiz('bugun');
  ekran.innerHTML = `${ust('Bir sorun oldu')}<p>${kacis(e && e.message ? e.message : String(e))}</p><p><a class="dugme" href="#/">Bugün</a></p>`;
}

export function geriDugmesi(yedek) {
  return `<button class="geri" type="button" data-geri="${kacis(yedek)}" aria-label="Geri">${ikon('geri', 22, 1.8)}</button>`;
}

// Başlık: isteğe bağlı geri düğmesi, vurgu renginde etiket ve Bodoni başlık; sağda isteğe bağlı öğe
export function ust(baslik, yedek = '#/', { geriYok = false, sag = '', ustEtiket = '' } = {}) {
  return `<header class="ust">${geriYok ? '' : geriDugmesi(yedek)}<div class="ust-yazi">${ustEtiket ? etiket(ustEtiket, { vurgu: true }) : ''}<h1 tabindex="-1">${kacis(baslik)}</h1></div>${sag}</header>`;
}

// hareket: 'giris' (yeni ekran, öğeler sırayla belirir), kart için 'yeni-kart' | 'yeni-soru' | 'cevap', '' (yok).
// Verilmezse adres değiştiyse 'giris', aynı ekran yeniden çiziliyorsa hareketsiz.
let sonCizilenAdres = null;
// Yarış durumu koruması (hata denetimi #9): her yönlendirmede artan sayaç. Asenkron ekranlar girişte
// cizimNo() alır, her await'ten sonra guncelMi(no) değilse çizmeden çıkar; böylece eski ekran yenisinin üstüne çizilmez.
let cizimSayaci = 0;
export function cizimBaslat() {
  return ++cizimSayaci;
}
export function cizimNo() {
  return cizimSayaci;
}
export function guncelMi(no) {
  return no === cizimSayaci;
}

export function ciz(html, hareket) {
  const adres = location.hash || '#/';
  ekran.dataset.hareket = hareket ?? (adres !== sonCizilenAdres ? 'giris' : '');
  sonCizilenAdres = adres;
  ekran.classList.remove('perde');
  ekran.innerHTML = html;
  ekran.style.paddingBottom = '';
  window.scrollTo(0, 0);
  const h = ekran.querySelector('h1');
  if (h) h.focus({ preventScroll: true });
  if (ekran.querySelector('.ad-son, .soru-baslik h2')) {
    adlariSigdir();
    if (document.fonts) document.fonts.ready.then(adlariSigdir);
  }
}

// ---------- Günün sanatçısı ve eseri (her ekranın rengi buradan) ----------
// Günün sanatçısı havuzu: eser önbelleği varsa yalnızca orada kaydı olanlar (görseli çevrimdışı da hazır olsun);
// önbellekten sonra eklenen sanatçılar önbellek yenilenince havuza katılır.
// Ana sayfa tabloyu ekran boyu gösterdiği için dikey eseri olan sanatçılar seçilir (data/gorsel_oranlari.json yoksa hepsi).
export function gununHavuzu() {
  const havuz = d.sanatcilar.filter((s) => !d.onbellekIdleri || d.onbellekIdleri.has(s.id));
  const dikey = d.dikeyler ? havuz.filter((s) => d.dikeyler.has(s.id)) : [];
  return (dikey.length ? dikey : havuz).map((s) => s.id);
}

// Günün eseri: en bilinen dikey eser (ekranı kırpılmadan doldurur); yoksa en bilinen eser
const DIKEY_ORAN = 0.85;
export function gununEseri(eserler) {
  const dikey = eserler.filter((e) => {
    const g = secilenGorsel(e, kotuler());
    return g && e.pekistirme !== false && (gorselOrani(g) ?? 9) <= DIKEY_ORAN;
  });
  return enBilinen(dikey) || enBilinen(eserler);
}

export function gununId() {
  return gununSanatcisi(gununHavuzu(), bugun());
}

// Sanatçıyı temsil eden eser: uygun görseli olanlar arasında Wikidata site bağlantısı en çok olan.
// Hiçbiri uygun değilse (ör. yalnızca sergi salonu fotoğrafları) null — temsilî görsel gösterilmez.
export function enBilinen(eserler) {
  const uygun = eserler.filter((e) => secilenGorsel(e, kotuler()) && e.pekistirme !== false);
  if (!uygun.length) return null;
  return uygun.reduce((en, e) => ((e.sl || 0) > (en.sl || 0) ? e : en), uygun[0]);
}

export function bilinirlikSirasi(eserler) {
  return eserler
    .map((e, i) => ({ e, i }))
    .sort((a, b) => (b.e.sl || 0) - (a.e.sl || 0) || a.i - b.i)
    .map((x) => x.e);
}

// Ekranın olay dinleyicileri; app.js özgün sırayla bir kez bağlar
export function olaylariBagla() {
  ekran.addEventListener('click', (e) => {
    const g = e.target.closest('[data-geri]');
    if (g) {
      e.preventDefault();
      geri(g.getAttribute('data-geri'));
    }
  });

  // Görsel yüklenince görünür olur (çerçevede yer tutan kutu kalkar)
  document.addEventListener(
    'load',
    (e) => {
      if (e.target && e.target.tagName === 'IMG') {
        e.target.classList.remove('kirik');
        e.target.classList.add('yuklendi');
      }
    },
    true,
  );

  // Küçük görsel yüklenemezse (ör. çevrimdışı) büyük boyutu dene
  document.addEventListener(
    'error',
    (e) => {
      const img = e.target;
      if (!img || img.tagName !== 'IMG') return;
      // Hata gövdesi (429/403) önbelleğe girmiş olabilir: service worker'dan sildir
      if (img.currentSrc || img.src) navigator.serviceWorker?.controller?.postMessage({ tip: 'resim-sil', url: img.currentSrc || img.src });
      if (img.dataset.yedek && img.src !== img.dataset.yedek) {
        const y = img.dataset.yedek;
        delete img.dataset.yedek;
        img.src = y;
      } else img.classList.add('kirik'); // kırık görsel simgesi görünmesin
    },
    true,
  );
}
