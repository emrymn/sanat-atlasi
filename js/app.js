// Sanat Atlası — uygulama: yönlendirme ve ekranlar ("E · Kadife ve resim rengi" tasarımı).
import { kacis, yillarYaz, rastgeleYap, bulunmaEki } from './yardimci.js';
import { acikSanatcilar, akimDurumlari, yeniAcilanlar, islenenKume } from './kilit.js';
import { bugunStr, cevapla, vadesiGeldiMi, gorulduMu, GUNLUK_YENI_SINIRI } from './leitner.js';
import { sanatciSecenekleri, akimSecenekleri, akimOrtaYillari } from './celdirici.js';
import { kartlariSec, Oturum, kategori } from './oturum.js';
import { sanatciEserleri, eserSec, eserTurleriniAyarla, hazirOnbellek, pekistirmeHavuzu, TEST_HAVUZU, eserAdlariniAyarla, adlariAl, eserBaslik, kolaylikAl } from './eserler.js';
import { gorselUrl, gorselYedek, secilenGorsel, paletUrl, gorselSayfasi, yerelGorselleriAyarla } from './gorsel.js';
import { gorunurSanatcilar, gorunurAkimlar } from './resim.js';
import { gununSanatcisi, baskaSanatci } from './gunun.js';
import { ilerlemeYukle, ilerlemeKaydet, gunlukGuncelle, yedekMetni, yedekCoz, yedekYarimOturum, sonCalisilanEkle, TEMALAR } from './depo.js';
import { goruntuleyiciAc, kaynakYazisi } from './goruntuleyici.js';
import { akimYuzyillari, ikon } from './tasarim.js';
import { adParcala, bilinenAd } from './adlar.js';
import { paletGetir, renkTemasi } from './renk.js';
import { idbAl, idbKoy, idbSil } from './idb.js';
import { kayitYap, kayitGecerliMi, kayittanKur, devamOzeti } from './devam.js';
import { taninmaMetni, eserNotu, notlariAl, karsilastirmaAdresi, benzerSanatcilar } from './karsilastir.js';
import { tanismaGerekirMi, tanismaEserleri, karisanEkle, enCokKarisanlar, KARISAN_ESIGI } from './ogrenme.js';
import { basyapitlariAl, basyapitBul, sanatcininBasyapitlari, eserEslestir } from './basyapit.js';
import { konulariAl, konuBul, konuHaritasiniAyarla, TUR_AD, TUR_SIRA } from './ikonografi.js';

const SURUM = '1.17.1';
// tema zeminleri: theme-color ve vurgu renginin kontrast hesabı için
const TEMA_RENK = { gece: '#0B0A0B', sepya: '#F1E8D6', acik: '#FBFAF7' };
const TEMA_AD = { gece: 'Gece', sepya: 'Sepya', acik: 'Açık' };
const TAHMINI_GORSEL_KB = 300;
const HARFLER = 'ABCD';

// Cevap yaprağındaki kaynak satırı; WikiArt görselinde eser sayfasının bağlantısı da
function kaynakSatiri(eser, g) {
  const yazi = kacis(kaynakYazisi(eser, g));
  const sayfa = g && g.k === 'wikiart' ? gorselSayfasi(g) : '';
  return sayfa ? `${yazi} · <a href="${kacis(sayfa)}" target="_blank" rel="noopener">eser sayfası</a>` : yazi;
}

const d = {
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
  acikBolumler: new Set(),
  rng: rastgeleYap(Date.now() & 0xffffffff),
  indirme: null,
  onbellekIdleri: null,
  kolaylik: {},
  akimRenk: {},
  kisaAdlar: {},
  tanimaNotlari: {}, // data/tanima_notlari.json: kurs sanatçılarının "Nasıl tanırım?" notları
  eserNotlari: {}, // data/eser_notlari.json: önemli eserlere kısa açıklama
};

const ekran = document.getElementById('uygulama');

async function jsonGetir(yol) {
  const y = await fetch(yol);
  if (!y.ok) throw new Error(`${yol}: ${y.status}`);
  return y.json();
}

function kaydet() {
  ilerlemeKaydet(d.ilerleme);
}

function bugun() {
  return bugunStr();
}

function islenen() {
  return islenenKume(d.ilerleme.islenen);
}

function acikListe() {
  return acikSanatcilar(d.sanatcilar, islenen(), d.ilerleme.ekSanatcilar || []);
}

function skor(id) {
  return (d.ilerleme.skorlar[id] ||= {});
}

// "Görsel kötü" tercihleri (ilerlemeyle birlikte saklanır ve yedeklenir)
function kotuler() {
  return (d.ilerleme.kotuGorseller ||= {});
}

function gorselTercihi(sonra = null) {
  return {
    kotuler: kotuler(),
    degisti: () => {
      kaydet();
      if (sonra) sonra();
    },
  };
}

function taninma(s) {
  return taninmaMetni(s, d.tanimaNotlari);
}

// Görüntüleyicide eser notu (sanatçıya göre anahtar): goruntuleyiciAc({ notu })
function notuIcin(sanatciId) {
  return (e) => eserNotu(sanatciId, e, d.eserNotlari);
}

// Izgara küçük görseli: 400 px; açılmazsa (ör. çevrimdışı) 800 px denenir
function kucukGorsel(e, genislik = 400) {
  const g = secilenGorsel(e, kotuler()) || e.gorseller[0];
  if (!g) return '';
  return `<img loading="lazy" decoding="async" alt="" src="${kacis(gorselUrl(g, genislik))}" data-yedek="${kacis(gorselYedek(g))}">`;
}

function akimRenk(ad) {
  return d.akimRenk[ad] || '#8A827A';
}

// Akımın kendi rengi yalnızca küçük bir noktada kalır; geri kalan her şey altın/mürekkep token'larından
function akimNoktasi(ad) {
  return `<span class="akim-nokta" style="--akim:${akimRenk(ad)}" aria-hidden="true"></span>`;
}

// Küçük resim (Göz At önizlemeleri): sabit yükseklik, oranına göre genişlik, 6 px köşe
function cerceve(e, { genislik = 400, alt = '', tembel = false } = {}) {
  const g = secilenGorsel(e, kotuler()) || e.gorseller[0];
  if (!g) return '';
  const yedek = genislik < 800 ? ` data-yedek="${kacis(gorselYedek(g))}"` : '';
  return `<span class="cerceve"><img ${tembel ? 'loading="lazy" ' : ''}decoding="async" alt="${kacis(alt)}" src="${kacis(gorselUrl(g, genislik))}"${yedek}></span>`;
}

function etiket(metin, { vurgu = false } = {}) {
  return `<span class="etiket${vurgu ? ' vurgu' : ''}">${kacis(metin)}</span>`;
}

// Eserin adı ve tarihi: "İnci Küpeli Kız, y. 1665"
function eserAdi(e) {
  return `${eserBaslik(e)}${e.tarih ? `, ${e.tarih}` : ''}`;
}

// Künye: yıllar · akım · Konu N (Konu N vurgu renginde; kurs dışı sanatçıda "Kurs dışı")
function kunye(s, { bag = true, konuYok = false } = {}) {
  const akim = bag ? `<a href="#/akim/${encodeURIComponent(s.akim)}">${kacis(s.akim)}</a>` : kacis(s.akim);
  const konu = konuYok ? '' : ` · <span class="vurgu-yazi">${s.kaynak === 'ek' ? 'Kurs dışı' : `Konu ${s.konu}`}</span>`;
  return `${kacis(yillarYaz(s))} · ${akim}${konu}${s.not_cikarilmadi ? ' <span class="rozet">taslak</span>' : ''}`;
}

// Ad iki satırda: küçük satır italik Bodoni 22 px, büyük satır (bilinen ad) Bodoni 64 px — sığmazsa küçülür.
// Erişilebilir ad her zaman tam addır.
function isimHtml(sanatci, { etiketAdi = 'b', sinif = '', ek = '' } = {}) {
  const p = adParcala(sanatci.ad, d.kisaAdlar[sanatci.id]);
  return `<${etiketAdi} class="isim${sinif ? ' ' + sinif : ''}" aria-label="${kacis(sanatci.ad)}"${ek}>${p.ilk ? `<span class="ad-ilk">${kacis(p.ilk)}</span> ` : ''}<span class="ad-son">${kacis(p.son)}</span></${etiketAdi}>`;
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
function paletHtml(palet) {
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
async function eserPaleti(e, yedekRenk) {
  const g = e && (secilenGorsel(e, kotuler()) || e.gorseller[0]);
  try {
    return await paletGetir(paletUrl(g));
  } catch (err) {
    return yedekRenk ? [{ renk: yedekRenk, pay: 1 }] : null;
  }
}

// Ekranın rengini bu eserden al (eser bir söz de olabilir); bu arada başka ekrana geçildiyse yazılmaz
function ekranRengi(eser, yedekRenk, sonra = null) {
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

// Sekme ekranları (Göz At, İlerleme, Ayarlar, Pekiştir menüsü) Günün sanatçısının rengini taşır
function gununRengi() {
  const s = d.harita.get(gununId());
  if (!s) return ekranRengi(null, null);
  return ekranRengi(sanatciEserleri(s).then(enBilinen), akimRenk(s.akim));
}

// [data-kucuk="<sanatçı id>"] kutularına en bilinen eserin küçük görseli
function kucukKareleriDoldur() {
  for (const el of ekran.querySelectorAll('[data-kucuk]')) {
    const s = d.harita.get(el.dataset.kucuk);
    if (!s) continue;
    sanatciEserleri(s).then((eserler) => {
      const e = enBilinen(eserler);
      if (e && el.isConnected) el.innerHTML = kucukGorsel(e, 400);
    });
  }
}

// ---------- bildirim ----------
let bildirimZamanlayici = null;
function bildir(metin, { eylem = null, sure = 4000 } = {}) {
  const el = document.getElementById('bildirim');
  el.innerHTML = kacis(metin) + (eylem ? ` <button type="button">${kacis(eylem.ad)}</button>` : '');
  el.hidden = false;
  if (eylem) el.querySelector('button').onclick = eylem.fn;
  clearTimeout(bildirimZamanlayici);
  if (sure) bildirimZamanlayici = setTimeout(() => (el.hidden = true), sure);
}

function temaUygula() {
  const t = d.ilerleme.ayarlar.tema;
  document.documentElement.setAttribute('data-tema', t);
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute('content', TEMA_RENK[t] || TEMA_RENK.gece);
  // vurgu renginin okunur hali temanın zeminine göre yeniden hesaplanır
  if (d.palet !== undefined) renkleriYaz(d.palet);
}

// ---------- sekme çubuğu ----------
const SEKMELER = [
  ['bugun', 'Bugün', '#/'],
  ['gozat', 'Göz At', '#/gozat'],
  ['pekistir', 'Pekiştir', '#/pekistir'],
  ['ilerleme', 'İlerleme', '#/ilerleme'],
];

// etkin: sekme kimliği; null → sekme çubuğu yok (pekiştirme kartı)
function sekmeleriCiz(etkin) {
  const nav = document.getElementById('sekmeler');
  document.documentElement.classList.toggle('sekmesiz', etkin === null);
  if (etkin === null) {
    nav.hidden = true;
    return;
  }
  nav.hidden = false;
  nav.innerHTML = SEKMELER.map(
    ([id, ad, hash]) => `<a href="${hash}"${id === etkin ? ' aria-current="page"' : ''}>${ikon(id, 23, id === etkin ? 1.6 : 1.4)}<span>${ad}</span></a>`,
  ).join('');
}

// ---------- yönlendirme ----------
const rotalar = [
  [/^#?\/?$/, anaSayfa, 'bugun'],
  [/^#\/gozat$/, gozAt, 'gozat'],
  [/^#\/akim\/(.+)$/, akimSayfasi, 'gozat'],
  [/^#\/sanatci\/(.+)\/eserler$/, tumEserler, 'gozat'],
  [/^#\/sanatci\/(.+)$/, sanatciSayfasi, 'gozat'],
  [/^#\/karsilastir\/([^/]+)\/([^/]+)$/, karsilastirSayfasi, null],
  [/^#\/basyapitlar$/, basyapitListesi, 'gozat'],
  [/^#\/konular$/, konuListesi, 'gozat'],
  [/^#\/konu\/(.+)$/, konuSayfasi, 'gozat'],
  [/^#\/basyapit\/(.+)$/, basyapitSayfasi, 'gozat'],
  [/^#\/pekistir$/, pekistirMenusu, 'pekistir'],
  [/^#\/pekistir\/donem$/, pekistirMenusu, 'pekistir'],
  [/^#\/pekistir\/donem\/(.+)$/, (ad) => pekistir('donem', ad), null],
  [/^#\/pekistir\/karisik$/, () => pekistir('karisik', null), null],
  [/^#\/pekistir\/devam$/, () => devamEt(), null],
  [/^#\/ilerleme$/, () => ilerlemeSayfasi(), 'ilerleme'],
  [/^#\/ayarlar$/, ayarlarSayfasi, 'ilerleme'],
  [/^#\/gunun$/, () => gununSayfasi(null), 'bugun'],
  [/^#\/gunun\/(.+)$/, (id) => gununSayfasi(id), 'bugun'],
];

function yonlendir() {
  const h = location.hash || '#/';
  // geri düğmesi için basit yığın
  if (d.yigin.length > 1 && d.yigin[d.yigin.length - 2] === h) d.yigin.pop();
  else if (d.yigin[d.yigin.length - 1] !== h) d.yigin.push(h);
  for (const [desen, fn, sekme] of rotalar) {
    const m = desen.exec(h);
    if (m) {
      sekmeleriCiz(sekme);
      const args = m.slice(1).map((x) => decodeURIComponent(x));
      Promise.resolve(fn(...args)).catch(hataGoster);
      return;
    }
  }
  sekmeleriCiz('bugun');
  anaSayfa();
}

function git(hash) {
  location.hash = hash;
}

function geri(yedek = '#/') {
  if (d.yigin.length > 1) history.back();
  else {
    d.yigin = [];
    location.replace(yedek);
  }
}

function hataGoster(e) {
  console.error(e);
  sekmeleriCiz('bugun');
  ekran.innerHTML = `${ust('Bir sorun oldu')}<p>${kacis(e && e.message ? e.message : String(e))}</p><p><a class="dugme" href="#/">Bugün</a></p>`;
}

function geriDugmesi(yedek) {
  return `<button class="geri" type="button" data-geri="${kacis(yedek)}" aria-label="Geri">${ikon('geri', 22, 1.8)}</button>`;
}

// Başlık: isteğe bağlı geri düğmesi, vurgu renginde etiket ve Bodoni başlık; sağda isteğe bağlı öğe
function ust(baslik, yedek = '#/', { geriYok = false, sag = '', ustEtiket = '' } = {}) {
  return `<header class="ust">${geriYok ? '' : geriDugmesi(yedek)}<div class="ust-yazi">${ustEtiket ? etiket(ustEtiket, { vurgu: true }) : ''}<h1 tabindex="-1">${kacis(baslik)}</h1></div>${sag}</header>`;
}

function ciz(html) {
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

// ---------- sayımlar ----------
function istatistik() {
  const acik = acikListe();
  const b = bugun();
  let vade = 0;
  let dogru = 0;
  let toplam = 0;
  for (const s of acik) {
    const sk = d.ilerleme.skorlar[s.id] || {};
    if (vadesiGeldiMi(sk.sanatci, b) || vadesiGeldiMi(sk.akim, b)) vade++;
  }
  for (const sk of Object.values(d.ilerleme.skorlar)) {
    for (const k of [sk.sanatci, sk.akim]) {
      if (k) {
        dogru += k.dogru;
        toplam += k.dogru + k.yanlis;
      }
    }
  }
  return { acik: acik.length, vade, oran: toplam ? Math.round((100 * dogru) / toplam) : null, toplam };
}

function anaSayfa() {
  d.yigin = ['#/'];
  const ist = istatistik();
  const g = gunlukGuncelle(d.ilerleme, bugun());
  const gs = d.harita.get(gununId());
  const tarih = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
  const tekrar = `${kacis(tarih)} · ${ist.vade ? `${ist.vade} tekrar` : 'tekrar yok'}`;
  const son = (d.ilerleme.sonCalisilanlar || []).map((id) => d.harita.get(id)).filter(Boolean);
  const sayi = ist.vade || Math.max(0, d.ilerleme.ayarlar.gunlukKart - g.kart);
  const devam = devamKarti();
  ciz(`
    <h1 class="ekran-disi" tabindex="-1">Sanat Atlası</h1>
    ${devam}
    ${
      gs
        ? `<a class="gunun-kart${devam ? ' devam-alti' : ''}" href="#/gunun" data-test="gunun-kart">
      <div class="bugun-kahraman" data-gunun-gorsel>
        <div class="bugun-ust"><span class="etiket vurgu">Günün sanatçısı</span><span class="hap" data-test="tekrar">${tekrar}</span></div>
      </div>
      <div class="isim-blok">${isimHtml(gs)}<p class="meta">${kunye(gs, { bag: false })}</p></div>
    </a>
    <section class="bolum" style="gap:10px;padding-top:20px">${etiket('Resmin renkleri')}<div data-palet>${paletHtml(null)}</div></section>`
        : `<header class="ust"><div class="ust-yazi">${etiket('Bugün', { vurgu: true })}<span class="hap" data-test="tekrar">${tekrar}</span></div></header>`
    }
    <div class="iki-dugme">
      <a class="dugme vurgu" href="#/pekistir/karisik" data-test="pekistir">Pekiştir <span class="sayi" aria-label="${sayi} ${ist.vade ? 'tekrar' : 'kart'}">${sayi}</span></a>
      <a class="dugme" href="#/pekistir/donem">Döneme göre</a>
    </div>
    ${
      son.length
        ? `<div class="son-satir">${etiket('Son')}<div class="yuvarlaklar">${son
            .slice(0, 4)
            .map((s) => `<a href="#/sanatci/${encodeURIComponent(s.id)}" aria-label="${kacis(s.ad)}" data-mini="${kacis(s.id)}"></a>`)
            .join('')}</div><span class="son-adlar"><span>${kacis(
            son
              .slice(0, 2)
              .map((s) => bilinenAd(s.ad, d.kisaAdlar[s.id]))
              .join(', '),
          )}</span>${son.length > 2 ? `<span class="ek">+${son.length - 2}</span>` : ''}</span></div>`
        : ''
    }
    <p class="sakin"><span data-test="acik-sayi">${ist.acik}</span> açık sanatçı · ${ist.oran === null ? 'henüz cevap yok' : `%${ist.oran} doğru`} · bugün ${g.kart} / ${d.ilerleme.ayarlar.gunlukKart} kart · <a href="#/ayarlar">Ayarlar</a></p>`);
  if (gs) gununKartGorseli(gs);
  else ekranRengi(null, null);
  for (const el of ekran.querySelectorAll('[data-mini]')) {
    sanatciEserleri(d.harita.get(el.dataset.mini)).then((eserler) => {
      const e = enBilinen(eserler);
      if (e && el.isConnected) el.innerHTML = kucukGorsel(e, 400);
    });
  }
}

// ---------- Günün sanatçısı ----------
// Günün sanatçısı havuzu: eser önbelleği varsa yalnızca orada kaydı olanlar (görseli çevrimdışı da hazır olsun);
// önbellekten sonra eklenen sanatçılar önbellek yenilenince havuza katılır.
function gununHavuzu() {
  return d.sanatcilar.filter((s) => !d.onbellekIdleri || d.onbellekIdleri.has(s.id)).map((s) => s.id);
}

function gununId() {
  return gununSanatcisi(gununHavuzu(), bugun());
}

// Sanatçıyı temsil eden eser: uygun görseli olanlar arasında Wikidata site bağlantısı en çok olan.
// Hiçbiri uygun değilse (ör. yalnızca sergi salonu fotoğrafları) null — temsilî görsel gösterilmez.
function enBilinen(eserler) {
  const uygun = eserler.filter((e) => secilenGorsel(e, kotuler()) && e.pekistirme !== false);
  if (!uygun.length) return null;
  return uygun.reduce((en, e) => ((e.sl || 0) > (en.sl || 0) ? e : en), uygun[0]);
}

function bilinirlikSirasi(eserler) {
  return eserler
    .map((e, i) => ({ e, i }))
    .sort((a, b) => (b.e.sl || 0) - (a.e.sl || 0) || a.i - b.i)
    .map((x) => x.e);
}

// Günün eseri: ekranın üstünü kenardan kenara kaplar; renkleri ekranın vurgusu olur
async function gununKartGorseli(s) {
  const eSozu = sanatciEserleri(s).then(enBilinen);
  ekranRengi(eSozu, akimRenk(s.akim), (p) => {
    const k = ekran.querySelector('[data-palet]');
    if (k) k.innerHTML = paletHtml(p);
  });
  const e = await eSozu;
  const kutu = ekran.querySelector('[data-gunun-gorsel]');
  if (!kutu || !e) return;
  const g = secilenGorsel(e, kotuler());
  kutu.insertAdjacentHTML(
    'afterbegin',
    `<img decoding="async" alt="${kacis(`${s.ad}, ${eserBaslik(e)}`)}" src="${kacis(gorselUrl(g, 1200))}" data-yedek="${kacis(gorselYedek(g))}">`,
  );
}

let ekVeri = null;
function ekVeriYukle() {
  if (!ekVeri) {
    ekVeri = Promise.all([
      jsonGetir('data/biyografiler.json').catch(() => ({ sanatcilar: {} })),
      jsonGetir('data/akim_bilgi.json').catch(() => ({ akimlar: {} })),
    ]).then(([biyografiler, akimBilgi]) => ({ biyografiler, akimBilgi }));
  }
  return ekVeri;
}

function kursDurumu(s) {
  if (s.kaynak === 'ek') return 'Kurs dışı';
  return islenen().has(s.konu) ? `Kursta: Konu ${s.konu}` : 'Henüz kursta yok';
}

function pekistirmedeMi(s) {
  return acikListe().some((x) => x.id === s.id);
}

// Dönem: önceki ← bu akım → sonraki (Göz At'taki zaman sırası); üç sütun, ortadaki vurgu renginde
function donemCizelgesi(akim) {
  const i = d.akimlar.findIndex((a) => a.ad === akim);
  const onceki = d.akimlar[i - 1];
  const sonraki = d.akimlar[i + 1];
  const bag = (a, metin, sinif) => (a ? `<a class="${sinif}" href="#/akim/${encodeURIComponent(a.ad)}">${metin}</a>` : `<span class="${sinif}"></span>`);
  return `<nav class="donem" aria-label="Akım zaman çizelgesi">
      ${bag(onceki, `← ${kacis(onceki ? onceki.ad : '')}`, 'once')}
      <a class="simdi" href="#/akim/${encodeURIComponent(akim)}">${kacis(akim)}</a>
      ${bag(sonraki, `${kacis(sonraki ? sonraki.ad : '')} →`, 'sonra')}
    </nav>`;
}

// Yatay kaydırmalı galeri: 236 px yükseklik, oranına göre genişlik, kırpma yok; altında italik başlık
function eserSeridi(eserler, sinif, veri) {
  return eserler
    .map((e, i) => {
      const g = secilenGorsel(e, kotuler()) || e.gorseller[0];
      if (!g) return '';
      return `<button class="${sinif}" type="button" ${veri}="${i}" aria-label="${kacis(eserBaslik(e))} — büyüt">
      <img ${i > 3 ? 'loading="lazy" ' : ''}decoding="async" alt="" src="${kacis(gorselUrl(g, 400))}" data-yedek="${kacis(gorselYedek(g))}"><span class="eser-yazi">${kacis(eserBaslik(e))}${e.tarih ? ` <small>· ${kacis(e.tarih)}</small>` : ''}</span></button>`;
    })
    .join('');
}

function notBolumleri(s) {
  const not = s.kurs_notu || s.anlatim;
  return `${not ? `<section class="bolum">${etiket('Notlarımdan', { vurgu: true })}<p class="okuma italik">${kacis(not)}</p></section>` : ''}
    ${taninma(s) ? `<section class="bolum">${etiket('Nasıl tanırım?')}<p class="okuma" data-test="taninma">${kacis(taninma(s))}</p></section>` : ''}`;
}

async function gununSayfasi(id) {
  const bugunku = gununId();
  const s = d.harita.get(id || bugunku);
  if (!s) return hataGoster(new Error('Sanatçı bulunamadı.'));
  const eserSozu = sanatciEserleri(s);
  ekranRengi(eserSozu.then(enBilinen), akimRenk(s.akim));
  const { biyografiler, akimBilgi } = await ekVeriYukle();
  const bio = biyografiler.sanatcilar[s.id];
  const akim = akimBilgi.akimlar[s.akim];
  ciz(`<div class="hale" aria-hidden="true"></div>
    <header class="sanatci-ust">${geriDugmesi('#/')}<h1 class="etiket vurgu" tabindex="-1">${id && id !== bugunku ? 'Sanatçı' : 'Günün sanatçısı'}</h1>
      <span class="hap" data-test="kurs-durumu">${kacis(kursDurumu(s))}</span></header>
    <article class="gunun">
      <div class="isim-blok">${isimHtml(s, { etiketAdi: 'h2', sinif: 'gunun-ad' })}<p class="meta">${kunye(s)}</p></div>
      <div class="eserler" data-galeri><p class="ikincil kucuk">Eserler yükleniyor…</p></div>
      ${notBolumleri(s)}
      <section class="bolum">
        ${etiket('Hayatı')}
        ${
          bio
            ? `<p class="okuma" data-test="biyografi">${kacis(bio.metin)}</p>
          <p class="kucuk ikincil" style="margin:4px 0 0">Kaynak: <a href="${kacis(bio.kaynak.url)}" target="_blank" rel="noopener">${kacis(bio.kaynak.ad)}</a>${bio.dil === 'en→tr' ? ' (İngilizceden kısaltılarak çevrildi)' : ''}</p>`
            : '<p class="ikincil">Bu sanatçı için biyografi henüz yok.</p>'
        }
      </section>
      <section class="bolum">
        ${etiket('Dönemi')}
        ${donemCizelgesi(s.akim)}
        ${
          akim
            ? `<p class="kucuk ikincil" style="margin:0">${kacis(akim.donem)} · ${kacis(akim.yer)}</p>
        <p class="okuma" data-test="donem">${kacis(akim.metin)}</p>
        <p class="kucuk ikincil" style="margin:0">${kacis(akim.kaynak)}</p>`
            : ''
        }
      </section>
      <div class="menu">
        ${
          pekistirmedeMi(s)
            ? '<p class="mesaj-not">Bu sanatçı pekiştirmede.</p>'
            : `<button class="dugme vurgu" type="button" data-pekistirmeye-ekle="${kacis(s.id)}">Bu sanatçıyı pekiştirmeye ekle</button>`
        }
        <a class="dugme" href="#/gunun/${encodeURIComponent(
          baskaSanatci(gununHavuzu(), s.id, d.rng),
        )}" data-test="baska">Başka bir sanatçı</a>
      </div>
    </article>`);
  const eserler = bilinirlikSirasi(await eserSozu);
  if (!location.hash.startsWith('#/gunun')) return;
  const galeri = ekran.querySelector('[data-galeri]');
  if (!eserler.length) {
    galeri.innerHTML = '<p class="ikincil kucuk">Bu sanatçı için doğrulanmış görsel bulunamadı.</p>';
    return;
  }
  galeri.innerHTML = eserSeridi(eserler, 'galeri-eser', 'data-galeri-eser');
  galeri.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-galeri-eser]');
    if (b) goruntuleyiciAc({ eserler, baslangic: Number(b.dataset.galeriEser), notu: notuIcin(s.id), ...gorselTercihi() });
  });
}

// Kilitli olsa bile sanatçıyı tekrar sırasına al: bugün vadeli, kutu 0
ekran.addEventListener('click', (e) => {
  const b = e.target.closest('[data-pekistirmeye-ekle]');
  if (!b) return;
  const id = b.dataset.pekistirmeyeEkle;
  const ek = (d.ilerleme.ekSanatcilar ||= []);
  if (!ek.includes(id)) ek.push(id);
  const sk = skor(id);
  if (!sk.sanatci) sk.sanatci = { kutu: 0, sonraki: bugun(), dogru: 0, yanlis: 0, son: bugun() };
  if (!sk.akim) sk.akim = { kutu: 0, sonraki: bugun(), dogru: 0, yanlis: 0, son: bugun() };
  d.oturum = null;
  kaydet();
  b.replaceWith(Object.assign(document.createElement('p'), { className: 'mesaj-not', textContent: 'Eklendi: bu sanatçı bugünkü tekrarlarda.' }));
  bildir(`${d.harita.get(id).ad} pekiştirmeye eklendi.`);
});

// ---------- Başyapıt yakın okumaları ----------
let basyapitSozu = null;
function basyapitVeri() {
  if (!basyapitSozu)
    basyapitSozu = jsonGetir('data/basyapitlar.json')
      .catch(() => null)
      .then((j) => basyapitlariAl(j, (id) => d.harita.has(id)));
  return basyapitSozu;
}

const basyapitAdresi = (k) => `#/basyapit/${encodeURIComponent(k)}`;

async function basyapitBaglariniDoldur(id) {
  const liste = sanatcininBasyapitlari(await basyapitVeri(), id);
  const kutu = ekran.querySelector(`[data-basyapit-bag="${CSS.escape(id)}"]`);
  if (!kutu || !liste.length) return;
  kutu.innerHTML = `<section class="bolum">${etiket('Yakın okuma')}${liste
    .map((b) => `<a class="satir basyapit-bag" href="${basyapitAdresi(b.anahtar)}" data-test="basyapit-bag"><span class="metin"><b>${kacis(b.baslik)}</b><span>${kacis(b.ozet)}</span></span>${ikon('ileri', 20, 1.4)}</a>`)
    .join('')}</section>`;
}

async function basyapitListesi() {
  gununRengi();
  ciz(`${ust('Başyapıtlar', '#/gozat', { ustEtiket: 'Yakın okuma' })}<p class="ikincil kucuk">Yükleniyor…</p>`);
  const liste = await basyapitVeri();
  if (location.hash !== '#/basyapitlar') return;
  if (!liste.length) return ciz(`${ust('Başyapıtlar', '#/gozat', { ustEtiket: 'Yakın okuma' })}<p class="ikincil">Henüz yakın okuma yok.</p>`);
  const k = islenen();
  const gruplar = [];
  for (const a of d.akimlar) {
    const l = liste.filter((b) => d.harita.get(b.sanatci).akim === a.ad);
    if (l.length) gruplar.push({ a, l });
  }
  ciz(`${ust('Başyapıtlar', '#/gozat', { ustEtiket: `Yakın okuma · ${liste.length}` })}
    <p class="kucuk ikincil" style="margin:0 0 6px">Her eserde ne görüldüğü, kompozisyon, anlam ve önemi. Zaman sırasıyla.</p>
    ${gruplar
      .map(
        ({ a, l }) => `<h2 class="etiket bolum-baslik">${akimNoktasi(a.ad)}${kacis(a.ad)}</h2>
      <ul class="liste" data-test="basyapit-listesi">${l
        .map((b) => {
          const s = d.harita.get(b.sanatci);
          const kilit = k.has(s.konu) ? '' : ' <span class="rozet">henüz kursta yok</span>';
          return `<li><a class="satir" href="${basyapitAdresi(b.anahtar)}"><span class="kucuk-kare" data-basyapit-kucuk="${kacis(b.anahtar)}"></span><span class="metin"><b>${kacis(b.baslik)}${kilit}</b><span>${kacis(s.ad)}${b.tarih ? ` · ${kacis(b.tarih)}` : ''}</span></span>${ikon('ileri', 20, 1.4)}</a></li>`;
        })
        .join('')}</ul>`,
      )
      .join('')}`);
  for (const el of ekran.querySelectorAll('[data-basyapit-kucuk]')) {
    const b = basyapitBul(liste, el.dataset.basyapitKucuk);
    sanatciEserleri(d.harita.get(b.sanatci)).then((eserler) => {
      const e = eserEslestir(eserler, b);
      if (e && el.isConnected) el.innerHTML = kucukGorsel(e, 400);
    });
  }
}

async function basyapitSayfasi(kodlu) {
  const anahtar = decodeURIComponent(kodlu);
  const b = basyapitBul(await basyapitVeri(), anahtar);
  if (!b) return hataGoster(new Error('Bu eser için yakın okuma bulunamadı.'));
  const s = d.harita.get(b.sanatci);
  const eserSozu = sanatciEserleri(s).then((l) => eserEslestir(l, b));
  ekranRengi(eserSozu, akimRenk(s.akim));
  ciz(`<div class="hale" aria-hidden="true"></div>
    <header class="sanatci-ust">${geriDugmesi('#/basyapitlar')}<a class="etiket vurgu" href="#/akim/${encodeURIComponent(s.akim)}">${kacis(s.akim)}</a></header>
    <article class="basyapit" data-test="basyapit">
      <h1 class="basyapit-ad" tabindex="-1">${kacis(b.baslik)}</h1>
      <p class="meta"><a href="#/sanatci/${encodeURIComponent(s.id)}">${kacis(s.ad)}</a>${b.tarih ? ` · ${kacis(b.tarih)}` : ''}${b.muze ? ` · ${kacis(b.muze)}` : ''}</p>
      ${b.ozgun && b.ozgun !== b.baslik ? `<p class="gor-ozgun">${kacis(b.ozgun)}</p>` : ''}
      <div class="basyapit-gorsel" data-basyapit-gorsel><p class="ikincil kucuk">Görsel yükleniyor…</p></div>
      ${b.ozet ? `<p class="basyapit-ozet okuma">${kacis(b.ozet)}</p>` : ''}
      ${b.bolumler.map((x) => `<section class="bolum">${etiket(x.baslik)}<p class="okuma">${kacis(x.metin)}</p></section>`).join('')}
      ${b.bak.length ? `<section class="bolum">${etiket('Yakından bak', { vurgu: true })}<ol class="okuma basyapit-bak">${b.bak.map((x) => `<li>${kacis(x)}</li>`).join('')}</ol></section>` : ''}
      <p class="kucuk ikincil" style="margin-top:18px">Metni Claude yazdı, ikinci bir istekte olgu ve dil açısından denetledi. Yine de hata görürsen not al.</p>
    </article>`);
  const e = await eserSozu;
  const kutu = ekran.querySelector('[data-basyapit-gorsel]');
  if (!kutu) return;
  const g = e && secilenGorsel(e, kotuler());
  if (!g) {
    kutu.innerHTML = '<p class="ikincil kucuk">Bu eserin görseli bulunamadı.</p>';
    return;
  }
  kutu.innerHTML = `<button class="basyapit-buyut" type="button" data-basyapit-buyut aria-label="${kacis(b.baslik)} — büyüt"><img decoding="async" alt="${kacis(`${s.ad}, ${b.baslik}`)}" src="${kacis(gorselUrl(g, 1200))}" data-yedek="${kacis(gorselYedek(g))}"></button>`;
  kutu.querySelector('[data-basyapit-buyut]').addEventListener('click', () => goruntuleyiciAc({ eserler: [e], notu: notuIcin(s.id), ...gorselTercihi() }));
}

// ---------- Konular ve hikâyeleri ----------
let ikonografiSozu = null;
function ikonografiVeri() {
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

async function konuListesi() {
  gununRengi();
  ciz(`${ust('Konular', '#/gozat', { ustEtiket: 'İkonografi' })}<p class="ikincil kucuk">Yükleniyor…</p>`);
  const liste = await ikonografiVeri();
  if (location.hash !== '#/konular') return;
  if (!liste.length) return ciz(`${ust('Konular', '#/gozat', { ustEtiket: 'İkonografi' })}<p class="ikincil">Henüz konu yok.</p>`);
  const gruplar = TUR_SIRA.map((t) => ({ t, l: liste.filter((k) => k.tur === t) })).filter((g) => g.l.length);
  ciz(`${ust('Konular', '#/gozat', { ustEtiket: `İkonografi · ${liste.length}` })}
    <p class="kucuk ikincil" style="margin:0 0 6px">Resimlerde en sık işlenen hikâyeler. Her konuda hikâye, resimde nasıl tanındığı ve bu konuyu işleyen eserler.</p>
    ${gruplar
      .map(
        ({ t, l }) => `<h2 class="etiket bolum-baslik">${kacis(TUR_AD[t])}</h2>
      <ul class="liste" data-test="konu-listesi">${l
        .map(
          (k) =>
            `<li><a class="satir" href="#/konu/${encodeURIComponent(k.id)}"><span class="metin"><b>${kacis(k.ad)}</b><span>${kacis(k.ozet)} · ${k.eserler.length} eser</span></span>${ikon('ileri', 20, 1.4)}</a></li>`,
        )
        .join('')}</ul>`,
      )
      .join('')}`);
}

async function konuSayfasi(kodlu) {
  const k = konuBul(await ikonografiVeri(), decodeURIComponent(kodlu));
  if (!k) return hataGoster(new Error('Bu konu bulunamadı.'));
  gununRengi();
  ciz(`<div class="hale" aria-hidden="true"></div>
    <header class="sanatci-ust">${geriDugmesi('#/konular')}<a class="etiket vurgu" href="#/konular">${kacis(TUR_AD[k.tur])}</a></header>
    <article class="basyapit" data-test="konu">
      <h1 class="basyapit-ad" tabindex="-1">${kacis(k.ad)}</h1>
      ${k.kaynak ? `<p class="meta">Kaynak: ${kacis(k.kaynak)}</p>` : ''}
      ${k.ozet ? `<p class="basyapit-ozet okuma">${kacis(k.ozet)}</p>` : ''}
      <section class="bolum">${etiket('Hikâye')}${k.hikaye.map((p) => `<p class="okuma">${kacis(p)}</p>`).join('')}</section>
      ${k.tanima.length ? `<section class="bolum">${etiket('Resimde nasıl tanınır?', { vurgu: true })}<ul class="okuma basyapit-bak">${k.tanima.map((x) => `<li>${kacis(x)}</li>`).join('')}</ul></section>` : ''}
      <section class="bolum">${etiket(`Bu konuyu işleyen eserler · ${k.eserler.length}`)}<p class="kucuk ikincil" style="margin:0 0 8px">Zaman sırasıyla; aynı hikâyenin farklı ressamlardaki hâli.</p>
        <div class="izgara konu-eserler" data-konu-eserler><p class="ikincil kucuk">Eserler yükleniyor…</p></div></section>
      <p class="kucuk ikincil" style="margin-top:18px">Metni Claude yazdı, ikinci bir istekte denetledi. Konu, eserlerin adından çıkarıldı; arada yanlış eşleşme olabilir.</p>
    </article>`);
  // eserler: sanatçı başına bir kez yüklenir
  const sanatcilar = [...new Set(k.eserler.map((x) => x[1]))];
  const listeler = new Map(await Promise.all(sanatcilar.map(async (sid) => [sid, await sanatciEserleri(d.harita.get(sid))])));
  const eserler = k.eserler
    .map(([a, sid]) => eserEslestir(listeler.get(sid) || [], { anahtar: a, sanatci: sid }))
    .filter((e) => e && (secilenGorsel(e, kotuler()) || e.gorseller[0]));
  const kutu = ekran.querySelector('[data-konu-eserler]');
  if (!kutu) return;
  if (!eserler.length) {
    kutu.innerHTML = '<p class="ikincil kucuk">Bu konudaki eserlerin görseli bulunamadı.</p>';
    return;
  }
  kutu.innerHTML = eserler
    .map((e, i) => {
      const g = secilenGorsel(e, kotuler()) || e.gorseller[0];
      const s = d.harita.get(e.sid);
      return `<button class="eser" type="button" data-konu-eser="${i}" aria-label="${kacis(`${s.ad}, ${eserBaslik(e)}`)} — büyüt">
        <img ${i > 5 ? 'loading="lazy" ' : ''}decoding="async" alt="" src="${kacis(gorselUrl(g, 400))}" data-yedek="${kacis(gorselYedek(g))}"><span class="eser-yazi"><b>${kacis(bilinenAd(s.ad, d.kisaAdlar[s.id]))}</b> · ${kacis(eserBaslik(e))}${e.tarih ? ` <small>· ${kacis(e.tarih)}</small>` : ''}</span></button>`;
    })
    .join('');
  kutu.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-konu-eser]');
    if (b) goruntuleyiciAc({ eserler, baslangic: Number(b.dataset.konuEser), notu: (e) => notuIcin(e.sid)(e), ...gorselTercihi() });
  });
}

// ---------- Göz At: akımlar zaman sırasıyla ----------
function gozAt() {
  const durumlar = akimDurumlari(d.akimlar, d.sanatcilar, islenen());
  gununRengi();
  ciz(`${ust('Göz At', '#/', { geriYok: true, ustEtiket: 'Akımlar' })}
    <a class="basyapit-giris" href="#/basyapitlar" data-test="basyapit-giris">${ikon('kitap', 22, 1.5)}<span><b>Başyapıt okumaları</b><small>Kursun önemli eserlerine yakından bakış: ne görüyoruz, ne anlatıyor, neden önemli</small></span>${ikon('ileri', 20, 1.4)}</a>
    <a class="basyapit-giris" href="#/konular" data-test="konu-giris">${ikon('kitap', 22, 1.5)}<span><b>Konular ve hikâyeleri</b><small>İncil'den, mitolojiden ve aziz hayatlarından sahneler; resimde nasıl tanınırlar</small></span>${ikon('ileri', 20, 1.4)}</a>
    <p class="kucuk ikincil" style="margin:0 0 6px">Zaman sırasıyla. Soluk olanlar, ilgili konu işlenince açılır.</p>
    <ol class="zaman">${durumlar
      .map((a) => {
        const uyeler = d.sanatcilar.filter((x) => x.akim === a.ad);
        const ic = `<span class="etiket vurgu">${akimNoktasi(a.ad)}${kacis(akimYuzyillari(uyeler))}</span><b>${kacis(a.ad)}</b>
          <span class="sayi">${a.acik ? `${a.acikSayisi} / ${a.toplam} sanatçı açık` : `<span class="kilit-notu">${ikon('kilit', 14)}Konu ${bulunmaEki(a.acilacagiKonu)} açılır</span>`}</span>
          <span class="onizleme" data-onizleme="${kacis(a.ad)}"></span>`;
        return `<li class="zaman-oge${a.acik ? '' : ' kilitli'}">${
          a.acik ? `<a class="zaman-kart" href="#/akim/${encodeURIComponent(a.ad)}">${ic}</a>` : `<div class="zaman-kart" aria-disabled="true">${ic}</div>`
        }</li>`;
      })
      .join('')}</ol>`);
  onizlemeleriDoldur();
}

// Her akıma 3 çerçeveli küçük eser: açık sanatçılar önce
function onizlemeleriDoldur() {
  const k = islenen();
  for (const el of ekran.querySelectorAll('[data-onizleme]')) {
    // Eseri olmayan (ör. mimar/heykeltıraş) sanatçılar atlanır; ilk 3 eserli sanatçı gösterilir
    const uyeler = d.sanatcilar
      .filter((x) => x.akim === el.dataset.onizleme)
      .sort((a, b) => Number(k.has(b.konu)) - Number(k.has(a.konu)) || (a.dogum ?? 0) - (b.dogum ?? 0))
      .slice(0, 8);
    Promise.all(uyeler.map((x) => sanatciEserleri(x))).then((listeler) => {
      if (!el.isConnected) return;
      el.innerHTML = listeler
        .map(enBilinen)
        .filter(Boolean)
        .slice(0, 3)
        .map((e) => cerceve(e, { genislik: 400, tembel: true }))
        .join('');
    });
  }
}

function sanatciSatiri(s, acik) {
  const rozetler = `${s.kaynak === 'ek' ? ' <span class="rozet">kurs dışı</span>' : ''}${s.not_cikarilmadi ? ' <span class="rozet">taslak</span>' : ''}`;
  if (!acik)
    return `<li><div class="satir kilitli" aria-disabled="true"><span class="metin"><b>${kacis(s.ad)}${rozetler}</b><span>${kacis(yillarYaz(s))} · Konu ${bulunmaEki(s.konu)} açılır</span></span></div></li>`;
  return `<li><a class="satir" href="#/sanatci/${encodeURIComponent(s.id)}"><span class="kucuk-kare" data-kucuk="${kacis(s.id)}"></span><span class="metin"><b>${kacis(s.ad)}${rozetler}</b><span>${kacis(yillarYaz(s))}</span></span>${ikon('ileri', 20, 1.4)}</a></li>`;
}

function akimSayfasi(ad) {
  const k = islenen();
  const uyeler = d.sanatcilar.filter((s) => s.akim === ad).sort((a, b) => (a.dogum ?? a.olum ?? 0) - (b.dogum ?? b.olum ?? 0));
  if (!uyeler.length) return hataGoster(new Error('Akım bulunamadı.'));
  const acik = uyeler.filter((s) => k.has(s.konu));
  const kapali = uyeler.filter((s) => !k.has(s.konu));
  gununRengi();
  ciz(`${ust(ad, '#/gozat', { ustEtiket: akimYuzyillari(uyeler) })}
    <section class="bolum" style="padding-top:8px">${etiket('Dönemi')}${donemCizelgesi(ad)}</section>
    <section class="bolum">${etiket('Sanatçılar')}
    <ul class="liste">${acik.map((s) => sanatciSatiri(s, true)).join('')}${kapali.map((s) => sanatciSatiri(s, false)).join('')}</ul></section>
    ${acik.length ? `<div class="menu"><a class="dugme birincil" href="#/pekistir/donem/${encodeURIComponent(ad)}">Bu akımı pekiştir</a></div>` : ''}`);
  kucukKareleriDoldur();
}

async function sanatciSayfasi(id) {
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
      ${acik || pekistirmedeMi(s) ? '' : `<p class="mesaj-not">Bu sanatçı Konu ${s.konu} işlenince pekiştirmeye girer.</p>`}
    </div>
    <div class="eserler" id="eserler"><p class="ikincil kucuk">Eserler yükleniyor…</p></div>
    ${notBolumleri(s)}
    <div data-basyapit-bag="${kacis(s.id)}"></div>
    <section class="bolum">${etiket('Dönemi')}${donemCizelgesi(s.akim)}</section>
    ${karsilastirSecici(s)}
    ${onemli}${emin}
    </article>`);
  basyapitBaglariniDoldur(s.id);
  const eserler = await eserSozu;
  d.sonEserListesi = eserler; // testler ve hata ayıklama için
  const kutu = document.getElementById('eserler');
  if (!kutu || location.hash !== `#/sanatci/${encodeURIComponent(id)}`) return;
  if (!eserler.length) {
    kutu.innerHTML = '<p class="ikincil kucuk">Bu sanatçı için doğrulanmış görsel bulunamadı.</p>';
    return;
  }
  // galerinin sonunda "Tümü (N)": bütün eserlerin ızgara görünümü
  kutu.innerHTML = `${eserSeridi(eserler, 'eser', 'data-eser')}<a class="tumu" href="#/sanatci/${encodeURIComponent(s.id)}/eserler" data-test="tumu">Tümü (${eserler.length})</a>`;
  kutu.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-eser]');
    if (b) goruntuleyiciAc({ eserler, baslangic: Number(b.dataset.eser), notu: notuIcin(s.id), ...gorselTercihi() });
  });
}

// Bir sanatçının bütün eserleri: iki sütunlu ızgara, kırpma yok; dokununca görüntüleyici
async function tumEserler(id) {
  const s = d.harita.get(id);
  if (!s) return hataGoster(new Error('Sanatçı bulunamadı.'));
  const eserSozu = sanatciEserleri(s);
  ekranRengi(
    eserSozu.then((l) => l[0] || null),
    akimRenk(s.akim),
  );
  const eserler = await eserSozu;
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
      <a class="kars-ad" href="#/sanatci/${encodeURIComponent(s.id)}" aria-label="${kacis(s.ad)} — sanatçı sayfası">${p.ilk ? `<span class="ad-ilk">${kacis(p.ilk)}</span>` : ''}<b>${kacis(p.son)}</b></a>
      <p class="kars-meta">${kacis(yillarYaz(s))}<br>${akimNoktasi(s.akim)}${kacis(s.akim)}</p>
      ${kilitliMi(s) ? '<span class="rozet">Henüz kursta yok</span>' : ''}
      ${t ? `<div class="kars-tanima">${etiket('Nasıl tanırım?')}<p class="kars-not" data-test="kars-taninma">${kacis(t)}</p></div>` : '<p class="kucuk ikincil" style="margin:0">Bu sanatçı için “Nasıl tanırım?” notu henüz yok.</p>'}
      <div class="kars-eserler" data-kars-eserler="${k}"><p class="ikincil kucuk">Eserler yükleniyor…</p></div>
    </section>`;
}

async function karsilastirSayfasi(a, b) {
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
        return `<button class="kars-eser" type="button" data-kars-eser="${j}" aria-label="${kacis(eserBaslik(e))} — büyüt"><img decoding="async" alt="" src="${kacis(gorselUrl(g, 400))}" data-yedek="${kacis(gorselYedek(g))}"><span class="eser-yazi">${kacis(eserBaslik(e))}${e.tarih ? ` <small>· ${kacis(e.tarih)}</small>` : ''}</span></button>`;
      })
      .join('');
    kutu.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-kars-eser]');
      if (btn) goruntuleyiciAc({ eserler, baslangic: Number(btn.dataset.karsEser), notu: notuIcin(s.id), ...gorselTercihi() });
    });
  });
}

function pekistirMenusu() {
  const durumlar = akimDurumlari(d.akimlar, d.sanatcilar, islenen()).filter((a) => a.acik);
  const b = bugun();
  const vadeSay = (ad) => acikListe().filter((s) => (!ad || s.akim === ad) && kategori(d.ilerleme.skorlar, s.id, 'donem', b) === 0).length;
  gununRengi();
  ciz(`${ust('Pekiştir', '#/', { geriYok: true, ustEtiket: 'Tekrar' })}
    ${devamKarti()}
    ${
      durumlar.length
        ? `<a class="dugme vurgu" href="#/pekistir/karisik" style="margin-top:6px;min-height:54px;border-radius:16px">Pekiştir · Karışık <span class="sayi" aria-label="${istatistik().vade} tekrar">${istatistik().vade}</span></a>
    <section class="bolum">${etiket('Döneme göre')}
    <ul class="liste">
      <li><a class="satir" href="#/pekistir/donem/hepsi"><span class="metin"><b>Hepsi, dönem sırasıyla</b><span>${acikListe().length} sanatçı · ${vadeSay(null)} tekrar</span></span>${ikon('ileri', 20, 1.4)}</a></li>
      ${durumlar.map((a) => `<li><a class="satir" href="#/pekistir/donem/${encodeURIComponent(a.ad)}"><span class="metin"><b>${kacis(a.ad)} ${akimNoktasi(a.ad)}</b><span>${a.acikSayisi} sanatçı · ${vadeSay(a.ad)} tekrar</span></span>${ikon('ileri', 20, 1.4)}</a></li>`).join('')}
    </ul></section>`
        : bosAcik()
    }`);
}

function bosAcik() {
  return `<div class="bos-kutu"><p>Henüz açık sanatçı yok.</p><p class="kucuk ikincil"><a href="#/ilerleme">İlerleme</a> ekranında işlediğin konuları işaretle.</p></div>`;
}

// Bir sanatçının en az bir eseri var mı? (kurs eseri varsa beklemeden evet)
function eserVarMi(s) {
  if ((s.kurs_eserleri || []).length) {
    sanatciEserleri(s);
    return Promise.resolve(true);
  }
  const zaman = new Promise((coz) => setTimeout(() => coz(null), 6000));
  return Promise.race([sanatciEserleri(s), zaman]).then((e) => !!(e && e.length));
}

async function oturumKur(kip, akim) {
  const acik = acikListe();
  let adaylar = kip === 'donem' && akim !== 'hepsi' ? acik.filter((s) => s.akim === akim) : acik;
  const varMi = await Promise.all(adaylar.map(eserVarMi));
  adaylar = adaylar.filter((_, i) => varMi[i]);
  const g = gunlukGuncelle(d.ilerleme, bugun());
  const secilen = kartlariSec({
    adaylar,
    skorlar: d.ilerleme.skorlar,
    bugun: bugun(),
    adet: d.ilerleme.ayarlar.gunlukKart,
    yeniKota: GUNLUK_YENI_SINIRI - g.yeni,
    kip,
    sirala: kip === 'karisik' ? 'agirlikli' : akim === 'hepsi' ? 'kronolojik' : 'oncelik',
    akimSira: d.akimSira,
    rng: d.rng,
  });
  return {
    kip,
    akim,
    rota: location.hash,
    oturum: new Oturum(
      secilen.map((s) => s.id),
      { rng: d.rng },
    ),
    kart: null,
    sonrakiKart: null,
    kimlik: `${Date.now().toString(36)}-${Math.floor(d.rng() * 1e9).toString(36)}`,
    gosterilen: [],
  };
}

function kipAdi(kip, akim) {
  return kip === 'karisik' ? 'Pekiştir · Karışık' : akim === 'hepsi' ? 'Pekiştir · Hepsi' : `Pekiştir · ${akim}`;
}

function kipKisa(kip, akim) {
  return kip === 'karisik' ? 'Karışık' : akim === 'hepsi' ? 'Hepsi' : akim;
}

async function pekistir(kip, akim, { yeni = false, onayli = false } = {}) {
  const baslik = kipAdi(kip, akim);
  const o = d.oturum;
  if (yeni || !o || o.kip !== kip || o.akim !== akim || o.oturum.bitti) {
    // Yarım kalan oturum varken yeni oturum: önce sor (sayfa içinde)
    if (d.yarim && !onayli) return yarimSor(kip, akim);
    if (!acikListe().length) return ciz(`${ust(baslik, '#/pekistir')}${bosAcik()}`);
    ciz(`${ust(baslik, '#/pekistir')}<p class="ikincil">Kartlar hazırlanıyor…</p>`);
    d.oturum = await oturumKur(kip, akim);
    if (!d.oturum.oturum.toplam) {
      d.oturum = null;
      return ciz(
        `${ust(baslik, '#/pekistir')}<div class="bos-kutu"><p>Bu seçim için şu an kart yok.</p><p class="kucuk ikincil">Bugünkü yeni sanatçı sınırına (${GUNLUK_YENI_SINIRI}) ulaşmış olabilirsin ya da bu sanatçıların görseli bulunamadı.</p></div>`,
      );
    }
  }
  return kartCiz();
}

function kartHazirla(o, konum) {
  const k = o.oturum.kuyruk[konum];
  if (!k) return Promise.resolve(null);
  const s = d.harita.get(k.id);
  return sanatciEserleri(s).then((eserler) => {
    const son = d.ilerleme.sonEserler[s.id] || [];
    const eser = eserSec(eserler, son, d.rng, kotuler(), { kolaylik: kolaylikFn(s.id), seviye: sanatciSeviyesi(s.id) });
    if (!eser) return { konum, id: s.id, eser: null };
    d.ilerleme.sonEserler[s.id] = [...son.filter((x) => x !== eser.anahtar), eser.anahtar].slice(-8);
    const acikIdler = new Set(acikListe().map((x) => x.id));
    return {
      konum,
      id: s.id,
      eser,
      eserler,
      secenekler: sanatciSecenekleri(s, { sanatcilar: d.sanatcilar, akimlar: d.akimlar, acikIdler, rng: d.rng, ortaYillar: d.ortaYillar }).map((x) => x.id),
      akimSecenekleri: o.kip === 'karisik' ? akimSecenekleri(s.akim, d.akimlar, d.rng) : null,
      adim: 1,
      cevapSanatci: null,
      cevapAkim: null,
      bitti: false,
    };
  });
}

async function kartCiz() {
  const o = d.oturum;
  if (!o) return anaSayfa();
  if (o.oturum.bitti) return ozetCiz();
  const konum = o.oturum.konum;
  if ((!o.kart || o.kart.konum !== konum) && o.bekleyenKart) {
    // Devam: kayıttaki kart aynı eserle ve aynı adımdan; sanatçı, eser ya da seçenek artık yoksa kart atlanır
    const bk = o.bekleyenKart;
    o.bekleyenKart = null;
    const geri = bk.konum === konum ? await kartiGeriKur(bk) : null;
    if (d.oturum !== o) return;
    if (bk.konum === konum && !geri) {
      o.oturum.ilerle();
      yarimKaydet(o);
      return kartCiz();
    }
    if (geri) o.kart = geri;
  }
  if (!o.kart || o.kart.konum !== konum) {
    let hazir = o.sonrakiKart && (await o.sonrakiKart);
    if (!hazir || hazir.konum !== konum || hazir.id !== o.oturum.simdiki.id) hazir = await kartHazirla(o, konum);
    o.sonrakiKart = null;
    if (d.oturum !== o) return;
    if (!hazir || !hazir.eser) {
      o.oturum.ilerle();
      return kartCiz();
    }
    hazir.tanisma = tanismaAcik() && tanismaGerekirMi(d.ilerleme.skorlar[hazir.id]);
    o.kart = hazir;
    o.gosterilen.push({ id: hazir.id, eser: hazir.eser.anahtar });
    yarimKaydet(o);
  }
  kartGoster(o);
}

// ---------- yarım kalan oturum ----------
// Cevap verilmiş bir oturum her adımda IndexedDB'ye yazılır; bitince ya da "Bitir" ile silinir.
function cevapVarMi(o) {
  const ot = o.oturum;
  return ot.konum > 0 || ot.dogru + ot.yanlis > 0 || !!(o.kart && o.kart.cevapSanatci !== null);
}

function yarimKaydet(o) {
  if (!o || d.oturum !== o) return;
  if (o.oturum.bitti) return yarimSil();
  if (!cevapVarMi(o)) return;
  d.yarim = kayitYap(o);
  idbKoy('oturum', 'yarim', JSON.parse(JSON.stringify(d.yarim)));
}

function yarimSil() {
  d.yarim = null;
  idbSil('oturum', 'yarim');
}

async function yarimYukle() {
  const k = await idbAl('oturum', 'yarim');
  if (kayitGecerliMi(k)) return k;
  if (k) idbSil('oturum', 'yarim'); // bozuk ya da 7 günden eski: sessizce silinir
  return null;
}

function devamKarti() {
  const y = d.yarim;
  if (!y || !kayitGecerliMi(y)) return '';
  return `<section class="devam-kart" data-test="devam-kart" aria-label="Yarım kalan oturum">
      <div class="devam-yazi"><b>Kaldığın yerden devam et</b><span data-test="devam-ozet">${kacis(devamOzeti(y))}</span></div>
      <div class="devam-dugmeler"><a class="dugme vurgu" href="#/pekistir/devam" data-test="devam-et">Devam et</a><button class="dugme" type="button" data-yarim-bitir>Bitir</button></div>
    </section>`;
}

function yarimSor(kip, akim) {
  ciz(`${ust(kipAdi(kip, akim), '#/pekistir')}
    <div class="bos-kutu" data-test="yarim-soru">
      <p>Yarım kalan oturum silinsin mi?</p>
      <p class="kucuk ikincil">${kacis(devamOzeti(d.yarim))}</p>
      <div class="iki-dugme"><button class="dugme vurgu" type="button" data-yarim-sil data-kip="${kip}" data-akim="${kacis(akim || '')}">Sil, yeni başla</button><a class="dugme" href="#/pekistir/devam">Hayır, devam et</a></div>
    </div>`);
}

async function kartiGeriKur(bk) {
  const s = d.harita.get(bk.id);
  if (!s) return null;
  if (!bk.secenekler.every((id) => d.harita.has(id))) return null;
  const akimAdlari = new Set(d.akimlar.map((a) => a.ad));
  if (bk.akimSecenekleri && !bk.akimSecenekleri.every((a) => akimAdlari.has(a))) return null;
  const eserler = await sanatciEserleri(s);
  const eser = eserler.find((e) => e.anahtar === bk.eser);
  if (!eser) return null;
  return { ...bk, eser, eserler, bitti: false };
}

async function devamEt() {
  const y = d.yarim;
  if (d.oturum && y && d.oturum.kimlik === y.kimlik && !d.oturum.oturum.bitti) return kartCiz();
  if (!y || !kayitGecerliMi(y)) {
    yarimSil();
    return location.replace('#/pekistir');
  }
  const acik = new Set(acikListe().map((s) => s.id));
  const kur = kayittanKur(y, { varMi: (id) => d.harita.has(id) && acik.has(id), rng: d.rng });
  if (!kur) {
    yarimSil();
    return location.replace('#/pekistir');
  }
  d.oturum = {
    kip: y.kip,
    akim: y.akim,
    rota: y.kip === 'karisik' ? '#/pekistir/karisik' : `#/pekistir/donem/${encodeURIComponent(y.akim)}`,
    oturum: kur.oturum,
    kart: null,
    sonrakiKart: null,
    bekleyenKart: kur.kart,
    kimlik: y.kimlik,
    gosterilen: (y.gosterilen || []).slice(),
  };
  return kartCiz();
}

// A–D harfli seçenek; cevaptan sonra doğru yeşil ✓, seçilen yanlış kırmızı ×, kalanlar soluk
function secenekDugmesi(deger, ad, i, cevap, dogruDeger, tur) {
  let sinif = 'secenek';
  let isaret = '';
  if (cevap !== null) {
    if (deger === dogruDeger) {
      sinif += ' dogru';
      isaret = `<span role="img" aria-label="Doğru cevap">${ikon('dogru', 20, 2)}</span>`;
    } else if (deger === cevap) {
      sinif += ' yanlis';
      isaret = `<span role="img" aria-label="Senin cevabın, yanlış">${ikon('yanlis', 20, 2)}</span>`;
    } else sinif += ' soluk';
  }
  return `<button class="${sinif}" type="button" data-${tur}="${kacis(deger)}" ${cevap !== null ? 'disabled' : ''}><span class="harf">${HARFLER[i]}</span><span class="ad">${kacis(ad)}</span>${isaret}</button>`;
}

// Metin akımı ele veriyor mu? (karışık kartta 1. sorudan sonra akım gösterilmez)
function akimiAciklarMi(metin, akim) {
  const kucuk = (x) => x.toLocaleLowerCase('tr');
  const m = kucuk(metin);
  return kucuk(akim)
    .split(/[\s()]+/)
    .filter((w) => w.length >= 4)
    .some((w) => m.includes(w.slice(0, 5)));
}

function ipucuMetni(s) {
  return taninma(s) || s.kurs_notu || s.anlatim || '';
}

// Aynı ikiliyi KARISAN_ESIGI kez karıştırınca cevap yaprağında iki sanatçının ikişer eseri yan yana
function karsiSeritHtml(dogruS, secilenS, n) {
  const sutun = (x, etiketYazi) =>
    `<div class="karsi-sutun"><span class="karsi-ad">${etiketYazi} · <b>${kacis(bilinenAd(x.ad, d.kisaAdlar[x.id]))}</b></span><div class="karsi-kucukler" data-karsi="${kacis(x.id)}"><span></span><span></span></div></div>`;
  return `<div class="karsi-serit" data-test="karsi-serit">
      <p class="karsi-baslik">Bu ikisini ${n}. kez karıştırdın. Yan yana bak:</p>
      <div class="karsi-ikili">${sutun(dogruS, 'Doğrusu')}${sutun(secilenS, 'Senin cevabın')}</div>
    </div>`;
}

function karsiSeritDoldur() {
  const soruEseri = d.oturum && d.oturum.kart && d.oturum.kart.eser ? d.oturum.kart.eser.anahtar : null;
  for (const kutu of ekran.querySelectorAll('[data-karsi]')) {
    const s = d.harita.get(kutu.dataset.karsi);
    if (!s) continue;
    sanatciEserleri(s).then((eserler) => {
      if (!kutu.isConnected) return;
      const iki = bilinirlikSirasi(pekistirmeHavuzu(eserler, kotuler()).filter((e) => e.anahtar !== soruEseri)).slice(0, 2);
      kutu.innerHTML = iki.map((e) => `<span>${kucukGorsel(e, 400)}</span>`).join('') + '<span></span>'.repeat(2 - iki.length);
    });
  }
}

// Eser kolaylık puanı (data/eser_zorluk.json): 2 zor … 10 kolay; puan yoksa undefined
function kolaylikFn(sanatciId) {
  if (!d.kolaylik || !Object.keys(d.kolaylik).length) return null;
  return (e) => (e.qid && d.kolaylik[e.qid]) || d.kolaylik[`${sanatciId}|${e.baslik}`];
}

// Sanatçının seviyesi: sanatçı sorusundaki Leitner kutusu (hiç sorulmadıysa 0)
function sanatciSeviyesi(id) {
  const s = (d.ilerleme.skorlar[id] || {}).sanatci;
  return gorulduMu(s) ? s.kutu : 0;
}

// Ayarlardan kapatılabilir (testler window.__atlasTanismaYok ile kapatır)
function tanismaAcik() {
  return d.ilerleme.ayarlar.tanisma !== false && !window.__atlasTanismaYok;
}

// Yeni sanatçı: sorudan önce en bilinen 3 eseri (sorulacak eser hariç) ve "Nasıl tanırım?"
function tanismaGoster(o) {
  const k = o.kart;
  const s = d.harita.get(k.id);
  const ot = o.oturum;
  const eserler = tanismaEserleri(pekistirmeHavuzu(k.eserler || [], kotuler()), k.eser.anahtar, 3, kolaylikFn(k.id));
  k.tanismaEserleri = eserler;
  const ipucu = ipucuMetni(s);
  ciz(`<header class="soru-ust">
      <button class="kapat" type="button" data-geri="#/pekistir" aria-label="Kapat">${ikon('kapat', 22, 1.7)}</button>
      <span class="etiket">${kacis(kipKisa(o.kip, o.akim))}</span>
      <span data-test="sayac">${Math.min(ot.konum + 1, ot.toplam)} / ${ot.toplam}</span>
    </header>
    <section class="tanisma" data-test="tanisma">
      ${etiket('Yeni sanatçı · önce tanış', { vurgu: true })}
      ${isimHtml(s, { etiketAdi: 'h2', sinif: 'tanisma-ad', ek: ' tabindex="-1"' })}
      <p class="meta">${kacis(yillarYaz(s))} · ${kacis(s.akim)}</p>
      ${
        eserler.length
          ? `<div class="tanisma-eserler">${eserler
              .map((e, i) => {
                const g = secilenGorsel(e, kotuler()) || e.gorseller[0];
                return `<button class="tanisma-eser" type="button" data-tanisma-eser="${i}" aria-label="${kacis(eserBaslik(e))} — büyüt"><img decoding="async" alt="" src="${kacis(gorselUrl(g, 400))}" data-yedek="${kacis(gorselYedek(g))}"></button>`;
              })
              .join('')}</div>`
          : ''
      }
      ${ipucu ? `<p class="okuma tanisma-not">${kacis(ipucu)}</p>` : ''}
      <p class="kucuk ikincil">Birazdan bu sanatçının burada görmediğin bir eseri sorulacak.</p>
      <button class="dugme vurgu tanisma-gec" type="button" data-tanisma-gec>Tanıdım, soruya geç →</button>
    </section>`);
  ekran.querySelector('.tanisma-ad').focus({ preventScroll: true });
}

function kartGoster(o) {
  const k = o.kart;
  if (k.tanisma) return tanismaGoster(o);
  const s = d.harita.get(k.id);
  const ot = o.oturum;
  const karisik = o.kip === 'karisik';
  const ikinci = karisik && k.adim === 2;
  const sira = Math.min(ot.konum + 1, ot.toplam);
  const yuzde = Math.round((100 * ot.konum) / ot.toplam);
  const cevap = ikinci ? k.cevapAkim : k.cevapSanatci;
  const secenekler = ikinci
    ? `<div class="secenekler" data-test="akim-secenekleri">${k.akimSecenekleri.map((a, i) => secenekDugmesi(a, a, i, k.cevapAkim, s.akim, 'akim')).join('')}</div>`
    : `<div class="secenekler" data-test="sanatci-secenekleri">${k.secenekler.map((id, i) => secenekDugmesi(id, d.harita.get(id).ad, i, k.cevapSanatci, k.id, 'sanatci')).join('')}</div>`;

  // Cevaptan sonra alttan gelen yaprak
  let yaprak = '';
  if (cevap !== null) {
    const sanatciDogru = k.cevapSanatci === k.id;
    const sonrakiYazi = ot.konum + 1 >= ot.toplam ? 'Turu bitir' : 'Sonraki kart →';
    const tekrarNotu = 'bu kart 3–5 kart sonra yine gelecek';
    const ipucu = ipucuMetni(s);
    let dogru;
    let sonuc;
    let bilgi;
    let not;
    let ileri;
    let karsilastirBag = '';
    if (!ikinci) {
      // 1. soru (sanatçı): yalnızca sanatçı ve eser; karışıkta akım henüz söylenmez
      dogru = sanatciDogru;
      sonuc = dogru ? 'Doğru' : `Yanlış · ${tekrarNotu}`;
      bilgi = `${s.ad} · ${eserAdi(k.eser)}`;
      not = karisik && akimiAciklarMi(ipucu, s.akim) ? '' : ipucu;
      if (!dogru && k.cevapSanatci && d.harita.has(k.cevapSanatci) && (k.karisanSayi || 0) >= KARISAN_ESIGI)
        karsilastirBag = karsiSeritHtml(s, d.harita.get(k.cevapSanatci), k.karisanSayi);
      if (!dogru && k.cevapSanatci && d.harita.has(k.cevapSanatci))
        karsilastirBag += `<a class="karsilastir-bag" href="${karsilastirmaAdresi(s.id, k.cevapSanatci)}" data-test="karsilastir">${ikon('karsilastir', 18, 1.6)}<span>Karşılaştır: ${kacis(bilinenAd(s.ad, d.kisaAdlar[s.id]))} ↔ ${kacis(bilinenAd(d.harita.get(k.cevapSanatci).ad, d.kisaAdlar[k.cevapSanatci]))}</span></a>`;
      ileri = karisik
        ? '<button class="dugme acik" type="button" data-ikinci>Hangi akım? →</button>'
        : `<button class="dugme acik" type="button" data-sonraki>${sonrakiYazi}</button>`;
    } else {
      // 2. soru (akım): akım ve komşuları
      dogru = k.cevapAkim === s.akim;
      sonuc = dogru ? (sanatciDogru ? 'Doğru' : `Doğru · sanatçı yanlıştı, ${tekrarNotu}`) : `Yanlış · ${tekrarNotu}`;
      bilgi = `${s.akim} · ${s.ad} (${yillarYaz(s)})`;
      const gorunur = new Set(d.akimlar.map((a) => a.ad));
      const komsular = ((d.akimlar.find((a) => a.ad === s.akim) || {}).komsular || []).filter((x) => gorunur.has(x));
      const ilkteGizlenen = akimiAciklarMi(ipucu, s.akim) ? ipucu : '';
      not = [komsular.length ? `Komşu akımlar: ${komsular.join(', ')}.` : '', ilkteGizlenen].filter(Boolean).join(' ');
      ileri = `<button class="dugme acik" type="button" data-sonraki>${sonrakiYazi}</button>`;
    }
    const tumDogru = ikinci ? sanatciDogru && k.cevapAkim === s.akim : sanatciDogru;
    yaprak = `<section class="alt-yaprak" aria-live="polite">
      <p class="sonuc" data-test="sonuc" data-dogru="${ikinci || !karisik ? tumDogru : dogru}">${kacis(sonuc)}</p>
      <p class="bilgi">${kacis(bilgi)}</p>
      <div data-yaprak-palet>${paletHtml(k.palet)}</div>
      ${not ? `<p class="ipucu">${kacis(not)}</p>` : ''}
      <p class="kaynak-satir">${kaynakSatiri(k.eser, secilenGorsel(k.eser, kotuler()))}</p>
      ${karsilastirBag}
      <div class="yaprak-dugmeler"><a class="dugme" href="#/sanatci/${encodeURIComponent(s.id)}" aria-label="Sanatçı sayfası">Sanatçı</a>${ileri}</div>
    </section>`;
  }

  const g = secilenGorsel(k.eser, kotuler()) || k.eser.gorseller[0];
  ciz(`<header class="soru-ust">
      <button class="kapat" type="button" data-geri="#/pekistir" aria-label="Kapat">${ikon('kapat', 22, 1.7)}</button>
      <span class="etiket">${kacis(kipKisa(o.kip, o.akim))}</span>
      <span data-test="sayac">${sira} / ${ot.toplam}</span>
    </header>
    <div class="ince-cubuk" aria-hidden="true"><i style="width:${yuzde}%"></i></div>
    <div class="soru-sahne">
      <span class="hale-nefes" aria-hidden="true"></span>
      <button class="soru-resim" type="button" data-buyut aria-label="Görseli büyüt">
        <img decoding="async" alt="Sorulan eser" src="${kacis(gorselUrl(g, 800))}" data-test="soru-resim">
        <span class="durum" data-durum>Yükleniyor…</span>
      </button>
    </div>
    <div class="soru-baslik">
      <h2 tabindex="-1">${ikinci ? 'Hangi akım?' : 'Bu eser kimin?'}</h2>
      ${etiket(karisik ? `Soru ${ikinci ? 2 : 1} / 2` : 'Soru 1 / 1')}
    </div>
    ${secenekler}
    ${yaprak}`);

  // Renk: sorulan eserden. Cevaptan önce akım rengine düşülmez (ipucu olurdu): palet yoksa nötr kalır.
  if (k.palet === undefined)
    ekranRengi(k.eser, null, (p) => {
      k.palet = p;
      const kutu = ekran.querySelector('[data-yaprak-palet]');
      if (kutu) kutu.innerHTML = paletHtml(p);
    });
  else {
    renkIstegi++;
    renkleriYaz(k.palet);
  }

  const img = ekran.querySelector('[data-test="soru-resim"]');
  const durum = ekran.querySelector('[data-durum]');
  const yuklendi = () => (durum.hidden = true);
  if (img.complete && img.naturalWidth) yuklendi();
  img.addEventListener('load', yuklendi);
  img.addEventListener('error', () => {
    durum.innerHTML = 'Görsel yüklenemedi.';
    if (!k.bitti && k.cevapSanatci === null) baskaEser(o);
  });

  karsiSeritDoldur();
  const y = ekran.querySelector('.alt-yaprak');
  if (y) {
    // yaprak son seçeneklerin üstünü örtmesin: sayfanın altına onun kadar boşluk
    ekran.style.paddingBottom = `${y.offsetHeight + 16}px`;
    y.querySelector('[data-sonraki],[data-ikinci]').focus({ preventScroll: true });
    // işaretlenen seçenekler yaprağın üstünde görünsün
    const alt = ekran.querySelector('.secenekler').getBoundingClientRect().bottom;
    const tasma = alt - (window.innerHeight - y.offsetHeight) + 12;
    if (tasma > 0) window.scrollBy(0, tasma);
  }

  // Sonraki kartı önceden hazırla, görselini yükle
  if (!o.sonrakiKart && ot.konum + 1 < ot.toplam) {
    o.sonrakiKart = kartHazirla(o, ot.konum + 1).then((h) => {
      if (h && h.eser) new Image().src = gorselUrl(secilenGorsel(h.eser, kotuler()), 800);
      return h;
    });
  }
}

// Görsel açılmazsa aynı sanatçının başka eserini dene (cevaptan önce)
let baskaDeneme = 0;
function baskaEser(o) {
  const k = o.kart;
  if (!k.eserler || baskaDeneme > 3) return;
  baskaDeneme++;
  const diger = eserSec(
    k.eserler.filter((e) => e.anahtar !== k.eser.anahtar),
    [],
    d.rng,
    kotuler(),
  );
  if (diger) {
    k.eserler = k.eserler.filter((e) => e.anahtar !== k.eser.anahtar);
    k.eser = diger;
    k.palet = undefined;
    kartGoster(o);
  }
}

function yeniSanatciSay(id, kip) {
  const g = gunlukGuncelle(d.ilerleme, bugun());
  if (kategori(d.ilerleme.skorlar, id, kip, bugun()) === 2 && !g.yeniIdler.includes(id)) {
    g.yeniIdler.push(id);
    g.yeni++;
  }
}

function kartiBitir(o, dogruMu) {
  o.kart.bitti = true;
  o.oturum.isle(dogruMu);
  gunlukGuncelle(d.ilerleme, bugun()).kart++;
  kaydet();
}

ekran.addEventListener('click', (e) => {
  if (e.target.closest('[data-yarim-bitir]')) {
    if (d.oturum && d.yarim && d.oturum.kimlik === d.yarim.kimlik) d.oturum = null;
    yarimSil();
    yonlendir();
    return;
  }
  const ys = e.target.closest('[data-yarim-sil]');
  if (ys) {
    if (d.oturum && d.yarim && d.oturum.kimlik === d.yarim.kimlik) d.oturum = null;
    yarimSil();
    pekistir(ys.dataset.kip, ys.dataset.kip === 'karisik' ? null : ys.dataset.akim, { yeni: true, onayli: true }).catch(hataGoster);
    return;
  }
  const o = d.oturum;
  if (e.target.closest('[data-tanisma-gec]') && o && o.kart) {
    o.kart.tanisma = false;
    kartGoster(o);
    ekran.querySelector('.soru-baslik h2').focus({ preventScroll: true });
    return;
  }
  const te = e.target.closest('[data-tanisma-eser]');
  if (te && o && o.kart && o.kart.tanismaEserleri) {
    goruntuleyiciAc({ eserler: o.kart.tanismaEserleri, baslangic: Number(te.dataset.tanismaEser), notu: notuIcin(o.kart.id), ...gorselTercihi() });
    return;
  }
  const sb = e.target.closest('[data-sanatci]');
  const ab = e.target.closest('[data-akim]');
  if (e.target.closest('[data-buyut]') && o && o.kart) {
    const k = o.kart;
    goruntuleyiciAc({
      eserler: [k.eser],
      gizli: !k.bitti,
      notu: notuIcin(k.id),
      ...gorselTercihi(() => {
        // soru görseli reddedildiyse kartı yeni görselle çiz
        if (secilenGorsel(k.eser, kotuler())) {
          k.palet = undefined;
          kartGoster(o);
        } else if (!k.bitti) baskaEser(o);
      }),
    });
    return;
  }
  if (sb && o && o.kart && o.kart.cevapSanatci === null) {
    const k = o.kart;
    yeniSanatciSay(k.id, o.kip);
    k.cevapSanatci = sb.dataset.sanatci;
    const dogru = k.cevapSanatci === k.id;
    k.karisanSayi = dogru ? 0 : karisanEkle(d.ilerleme, k.id, k.cevapSanatci, bugun());
    skor(k.id).sanatci = cevapla(skor(k.id).sanatci, dogru, bugun());
    sonCalisilanEkle(d.ilerleme, k.id);
    baskaDeneme = 0;
    if (o.kip === 'donem') kartiBitir(o, dogru);
    else kaydet();
    yarimKaydet(o);
    kartGoster(o);
    return;
  }
  if (e.target.closest('[data-ikinci]') && o && o.kart && o.kart.cevapSanatci !== null) {
    o.kart.adim = 2;
    yarimKaydet(o);
    kartGoster(o);
    ekran.querySelector('.soru-baslik h2').focus({ preventScroll: true });
    return;
  }
  if (ab && o && o.kart && o.kart.cevapSanatci !== null && o.kart.cevapAkim === null) {
    const k = o.kart;
    const s = d.harita.get(k.id);
    k.cevapAkim = ab.dataset.akim;
    const dogru = k.cevapAkim === s.akim;
    skor(k.id).akim = cevapla(skor(k.id).akim, dogru, bugun());
    kartiBitir(o, dogru && k.cevapSanatci === k.id);
    yarimKaydet(o);
    kartGoster(o);
    return;
  }
  if (e.target.closest('[data-sonraki]') && o) {
    o.oturum.ilerle();
    yarimKaydet(o);
    kartCiz();
    return;
  }
  if (e.target.closest('[data-yeni-tur]') && o) {
    const { kip, akim } = o;
    d.oturum = null;
    pekistir(kip, akim, { yeni: true }).catch(hataGoster);
  }
});

function ozetCiz() {
  const o = d.oturum;
  const ot = o.oturum;
  if (d.yarim && d.yarim.kimlik === o.kimlik) yarimSil();
  const toplam = ot.dogru + ot.yanlis;
  ciz(`${ust(kipAdi(o.kip, o.akim), '#/pekistir', { ustEtiket: 'Tur bitti' })}
    <div class="ozet">
      ${etiket('Sonuç', { vurgu: true })}
      <b class="ad">${ot.dogru} / ${toplam}</b>
      <span class="meta">kart doğru</span>
      <p class="okuma italik">${ot.yanlis ? 'Yanlış yaptıkların daha sık karşına çıkacak.' : 'Hepsi doğru, harika.'}</p>
    </div>
    <div class="menu"><button class="dugme vurgu" type="button" data-yeni-tur>Bir tur daha</button><a class="dugme" href="#/">Bugün</a></div>`);
}

// ---------- İlerleme ----------
// Sık karıştırılan ikililer: yan yana karşılaştırmaya bağlantı
function karisanlarBolumu() {
  const liste = enCokKarisanlar(d.ilerleme.karisanlar, { varMi: (id) => d.harita.has(id) });
  if (!liste.length) return '';
  const ad = (id) => kacis(bilinenAd(d.harita.get(id).ad, d.kisaAdlar[id]));
  return `<h2 class="etiket bolum-baslik">En çok karıştırdıkların</h2>
    <ul class="liste" data-test="karisanlar">${liste
      .map(
        (x) =>
          `<li><a class="satir" href="${karsilastirmaAdresi(x.a, x.b)}"><span class="metin"><b>${ad(x.a)} ↔ ${ad(x.b)}</b><span>${x.n} kez karıştırdın · yan yana bak</span></span>${ikon('karsilastir', 20, 1.4)}</a></li>`,
      )
      .join('')}</ul>`;
}

function ilerlemeSayfasi(kaydirmayiKoru = false) {
  const k = islenen();
  const b = bugun();
  // akım doğrulukları
  const akimSatirlari = akimDurumlari(d.akimlar, d.sanatcilar, k)
    .filter((a) => a.acik)
    .map((a) => {
      let dg = 0;
      let tp = 0;
      for (const s of d.sanatcilar.filter((x) => x.akim === a.ad)) {
        const sk = d.ilerleme.skorlar[s.id] || {};
        for (const x of [sk.sanatci, sk.akim]) if (x) ((dg += x.dogru), (tp += x.dogru + x.yanlis));
      }
      const y = tp ? Math.round((100 * dg) / tp) : null;
      return `<div class="cubuk-satir"><span>${akimNoktasi(a.ad)}${kacis(a.ad)}</span><span class="cubuk" role="img" aria-label="${y === null ? 'veri yok' : '%' + y}"><i style="width:${y ?? 0}%"></i></span><span class="yuzde">${y === null ? '–' : '%' + y}</span></div>`;
    });
  // en zayıf sanatçılar
  const zayiflar = acikSanatcilar(d.sanatcilar, k)
    .map((s) => {
      const sk = d.ilerleme.skorlar[s.id] || {};
      let dg = 0;
      let tp = 0;
      let kutu = 9;
      for (const x of [sk.sanatci, sk.akim]) if (gorulduMu(x)) ((dg += x.dogru), (tp += x.dogru + x.yanlis), (kutu = Math.min(kutu, x.kutu)));
      return { s, dg, tp, kutu, oran: tp ? dg / tp : 1 };
    })
    .filter((x) => x.tp > 0 && (x.oran < 1 || x.kutu <= 1))
    .sort((a, b2) => a.oran - b2.oran || a.kutu - b2.kutu || b2.tp - a.tp)
    .slice(0, 10);
  // konular bölümlere göre
  const bolumler = [];
  for (const konu of d.konular) {
    let bl = bolumler.find((x) => x.bolum === konu.bolum);
    if (!bl) bolumler.push((bl = { bolum: konu.bolum, ad: konu.bolum_ad, konular: [] }));
    bl.konular.push(konu);
  }
  const sayi = (no) => d.sanatcilar.filter((s) => s.konu === no).length;
  if (!d.acikBolumler.size) {
    const sonraki = d.konular.find((x) => !k.has(x.no) && sayi(x.no) > 0);
    if (sonraki) d.acikBolumler.add(sonraki.bolum);
  }
  const vade = acikSanatcilar(d.sanatcilar, k).filter((s) => kategori(d.ilerleme.skorlar, s.id, 'karisik', b) === 0).length;
  const kaydirma = window.scrollY;
  const html = `${ust('İlerleme', '#/', {
    geriYok: true,
    ustEtiket: 'Kurs',
    sag: `<a class="ust-dugme" href="#/ayarlar" aria-label="Ayarlar">${ikon('ayarlar', 22, 1.4)}</a>`,
  })}
    <p class="ozet-satir">${k.size} / ${d.konular.length} konu işlendi · ${acikSanatcilar(d.sanatcilar, k).length} sanatçı açık · ${vade} tekrar bekliyor</p>
    <h2 class="etiket bolum-baslik">Kurs konuları</h2>
    <p class="kucuk ikincil" style="margin:-4px 0 10px">Bir konuyu bitirince “işlendi” yap; o konunun sanatçıları açılır.</p>
    ${bolumler
      .map(
        (bl) => `<details class="konu-bolum" data-bolum="${kacis(bl.bolum)}" ${d.acikBolumler.has(bl.bolum) ? 'open' : ''}>
      <summary><span>${kacis(bl.bolum)} · ${kacis(bl.ad)} <small>(${bl.konular.filter((x) => k.has(x.no)).length}/${bl.konular.length})</small></span>${ikon('ileri', 18, 1.4)}</summary>
      <ul class="liste">${bl.konular
        .map(
          (
            x,
          ) => `<li><label class="konu"><span class="metin"><b>Konu ${x.no}</b> · ${kacis(x.baslik)}<small>${sayi(x.no) ? `${sayi(x.no)} sanatçı` : 'sanatçı yok'}</small></span>
        <input class="anahtar" type="checkbox" role="switch" data-konu="${x.no}" ${k.has(x.no) ? 'checked' : ''} aria-label="Konu ${x.no} işlendi"></label></li>`,
        )
        .join('')}</ul></details>`,
      )
      .join('')}
    <h2 class="etiket bolum-baslik">Akımlara göre doğruluk</h2>
    ${akimSatirlari.length ? `<div style="border-top:1px solid var(--border)">${akimSatirlari.join('')}</div>` : '<p class="ikincil">Henüz açık akım yok.</p>'}
    ${karisanlarBolumu()}
    <h2 class="etiket bolum-baslik">En zayıf sanatçılar</h2>
    ${
      zayiflar.length
        ? `<ul class="liste">${zayiflar
            .map(
              (x) =>
                `<li><a class="satir" href="#/sanatci/${encodeURIComponent(x.s.id)}"><span class="kucuk-kare" data-kucuk="${kacis(x.s.id)}"></span><span class="metin"><b>${kacis(x.s.ad)}</b><span>%${Math.round(100 * x.oran)} doğru · ${x.dg}/${x.tp} · kutu ${x.kutu}</span></span>${ikon('ileri', 20, 1.4)}</a></li>`,
            )
            .join('')}</ul>`
        : '<p class="ikincil kucuk">Henüz zayıf sanatçı yok — biraz pekiştir.</p>'
    }`;
  if (!kaydirmayiKoru) {
    gununRengi();
    ciz(html);
  } else {
    ekran.innerHTML = html;
    window.scrollTo(0, kaydirma);
  }
  kucukKareleriDoldur();
}

ekran.addEventListener('change', (e) => {
  const kutu = e.target.closest('[data-konu]');
  if (!kutu) return;
  const no = Number(kutu.dataset.konu);
  const once = d.ilerleme.islenen.slice();
  const s = new Set(once);
  if (kutu.checked) s.add(no);
  else s.delete(no);
  d.ilerleme.islenen = [...s].sort((a, b) => a - b);
  kaydet();
  d.oturum = null;
  const yeni = yeniAcilanlar(d.sanatcilar, once, d.ilerleme.islenen);
  if (yeni.length) bildir(`Açıldı: ${yeni.map((x) => x.ad).join(', ')}`);
  else if (!kutu.checked) bildir(`Konu ${no} işlenmedi olarak işaretlendi.`);
  ilerlemeSayfasi(true);
  const ayni = ekran.querySelector(`[data-konu="${no}"]`);
  if (ayni) ayni.focus({ preventScroll: true });
});

ekran.addEventListener(
  'toggle',
  (e) => {
    const det = e.target.closest && e.target.closest('details[data-bolum]');
    if (!det) return;
    if (det.open) d.acikBolumler.add(det.dataset.bolum);
    else d.acikBolumler.delete(det.dataset.bolum);
  },
  true,
);

// ---------- Ayarlar ----------
async function indirilecekler() {
  const urller = [];
  for (const s of acikListe()) {
    const eserler = await sanatciEserleri(s);
    for (const e of pekistirmeHavuzu(eserler, kotuler())) urller.push(gorselUrl(secilenGorsel(e, kotuler()), 800));
  }
  return [...new Set(urller)];
}

async function alanYazisi() {
  try {
    const t = await navigator.storage.estimate();
    return `Kullanılan alan: ${(t.usage / 1048576).toFixed(0)} MB`;
  } catch (e) {
    return '';
  }
}

function ayarlarSayfasi() {
  const a = d.ilerleme.ayarlar;
  gununRengi();
  ciz(`${ust('Ayarlar', '#/ilerleme')}
    <div>
      <div class="ayar"><b id="kart-etiket">Günlük kart sayısı</b>
        <div class="adimlayici" role="group" aria-labelledby="kart-etiket">
          <button class="dugme" type="button" data-kart="-5" aria-label="Azalt">−</button>
          <output data-test="gunluk-kart">${a.gunlukKart}</output>
          <button class="dugme" type="button" data-kart="5" aria-label="Artır">+</button>
        </div>
        <p>Bir pekiştirme turundaki kart sayısı. Günde en fazla ${GUNLUK_YENI_SINIRI} yeni sanatçı eklenir.</p>
      </div>
      <div class="ayar"><b id="tema-etiket">Tema</b>
        <div class="parcali" role="radiogroup" aria-labelledby="tema-etiket">
          ${TEMALAR.map((t) => `<label><input type="radio" name="tema" value="${t}" ${a.tema === t ? 'checked' : ''}><span>${TEMA_AD[t]}</span></label>`).join('')}
        </div>
      </div>
      <div class="ayar"><label class="konu"><span class="metin"><b>Yeni sanatçıyla önce tanış</b><small>Bir sanatçı ilk kez sorulmadan önce en bilinen 3 eseri ve “Nasıl tanırım?” notu gösterilir.</small></span>
        <input class="anahtar" type="checkbox" role="switch" data-ayar-tanisma ${a.tanisma !== false ? 'checked' : ''} aria-label="Yeni sanatçıyla önce tanış"></label></div>
      <div class="ayar"><b>Görselleri çevrimdışı indir</b>
        <p id="indir-bilgi">Açık sanatçıların pekiştirme görselleri (sanatçı başına en fazla ${TEST_HAVUZU}) hesaplanıyor…</p>
        <button class="dugme" type="button" data-indir>İndir</button>
        <progress id="indir-cubuk" max="1" value="0" hidden></progress>
        <p class="mesaj" id="indir-mesaj" aria-live="polite"></p>
      </div>
      <div class="ayar"><b>Yedekle</b>
        <p>İlerlemen panoya kopyalanır ve aşağıda görünür. Notlar uygulamasına yapıştırıp sakla.</p>
        <button class="dugme" type="button" data-yedekle>Yedekle</button>
        <textarea id="yedek-cikti" readonly hidden aria-label="Yedek metni"></textarea>
        <p class="mesaj" id="yedek-mesaj" aria-live="polite"></p>
      </div>
      <div class="ayar"><b>Yedeği geri yükle</b>
        <p>Daha önce aldığın yedeği buraya yapıştır. Mevcut ilerlemenin yerine geçer.</p>
        <textarea id="yedek-girdi" aria-label="Geri yüklenecek yedek" placeholder='{"uygulama":"sanat-atlasi", …}'></textarea>
        <button class="dugme" type="button" data-geri-yukle>Geri yükle</button>
        <p class="mesaj" id="geri-mesaj" aria-live="polite"></p>
      </div>
    </div>
    <p class="alt-not">Sanat Atlası ${SURUM} · Görseller: Wikimedia Commons, müze açık erişim koleksiyonları ve WikiArt · Eser listeleri: Wikidata</p>`);
  indirBilgisi();
}

async function indirBilgisi() {
  const urller = await indirilecekler();
  const el = document.getElementById('indir-bilgi');
  if (!el) return;
  const mb = Math.round((urller.length * TAHMINI_GORSEL_KB) / 1024);
  el.textContent = `${urller.length} görsel · tahminen ~${mb} MB. ${await alanYazisi()}`;
  if (d.indirme) indirmeGoster();
}

function indirmeGoster() {
  const i = d.indirme;
  const cubuk = document.getElementById('indir-cubuk');
  const mesaj = document.getElementById('indir-mesaj');
  const btn = ekran.querySelector('[data-indir]');
  if (!cubuk || !i) return;
  cubuk.hidden = false;
  cubuk.max = i.toplam || 1;
  cubuk.value = i.biten;
  btn.disabled = !i.bitti;
  mesaj.className = 'mesaj' + (i.bitti ? ' tamam' : '');
  mesaj.textContent = i.bitti
    ? `Bitti: ${i.biten - i.hata} görsel indirildi${i.hata ? `, ${i.hata} indirilemedi` : ''}.`
    : `${i.biten} / ${i.toplam} · ~${Math.round((i.biten * TAHMINI_GORSEL_KB) / 1024)} MB`;
}

async function gorselleriIndir() {
  if (d.indirme && !d.indirme.bitti) return;
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    const m = document.getElementById('indir-mesaj');
    m.className = 'mesaj hata';
    m.textContent = 'Çevrimdışı önbellek henüz hazır değil. Uygulamayı kapatıp yeniden açtıktan sonra tekrar dene.';
    return;
  }
  const urller = await indirilecekler();
  d.indirme = { toplam: urller.length, biten: 0, hata: 0, bitti: false };
  indirmeGoster();
  let sira = 0;
  const isci = async () => {
    while (sira < urller.length) {
      const u = urller[sira++];
      try {
        // Commons/NGA/AIC cors ile gelir: durum kodu görülür, 429 "indirildi" sayılmaz. CORS yoksa opak (doğrulanamaz)
        const y = await fetch(u, { mode: 'cors' }).catch(() => fetch(u, { mode: 'no-cors' }));
        if (y.type !== 'opaque' && !y.ok) d.indirme.hata++;
      } catch (e) {
        d.indirme.hata++;
      }
      d.indirme.biten++;
      indirmeGoster();
    }
  };
  await Promise.all([isci(), isci()]);
  d.indirme.bitti = true;
  indirmeGoster();
}

ekran.addEventListener('click', async (e) => {
  const kb = e.target.closest('[data-kart]');
  if (kb) {
    const a = d.ilerleme.ayarlar;
    a.gunlukKart = Math.min(100, Math.max(5, a.gunlukKart + Number(kb.dataset.kart)));
    ekran.querySelector('[data-test="gunluk-kart"]').textContent = a.gunlukKart;
    kaydet();
    return;
  }
  if (e.target.closest('[data-indir]')) return gorselleriIndir();
  if (e.target.closest('[data-yedekle]')) {
    const metin = yedekMetni(d.ilerleme, d.yarim);
    const ta = document.getElementById('yedek-cikti');
    const m = document.getElementById('yedek-mesaj');
    ta.hidden = false;
    ta.value = metin;
    try {
      await navigator.clipboard.writeText(metin);
      m.className = 'mesaj tamam';
      m.textContent = 'Yedek panoya kopyalandı.';
    } catch (err) {
      ta.focus();
      ta.select();
      m.className = 'mesaj';
      m.textContent = 'Panoya otomatik kopyalanamadı; metni seçip kopyala.';
    }
    return;
  }
  if (e.target.closest('[data-geri-yukle]')) {
    const m = document.getElementById('geri-mesaj');
    try {
      const girdi = document.getElementById('yedek-girdi').value;
      const yeni = yedekCoz(girdi);
      if (!confirm('Mevcut ilerlemenin yerine bu yedek yüklensin mi?')) return;
      d.ilerleme = yeni;
      d.oturum = null;
      const yarim = yedekYarimOturum(girdi);
      if (kayitGecerliMi(yarim)) {
        d.yarim = yarim;
        idbKoy('oturum', 'yarim', yarim);
      } else yarimSil();
      kaydet();
      temaUygula();
      m.className = 'mesaj tamam';
      m.textContent = `Yedek yüklendi: ${yeni.islenen.length} konu, ${Object.keys(yeni.skorlar).length} sanatçı skoru.`;
    } catch (err) {
      m.className = 'mesaj hata';
      m.textContent = err.message;
    }
  }
});

ekran.addEventListener('change', (e) => {
  if (e.target.matches('[data-ayar-tanisma]')) {
    d.ilerleme.ayarlar.tanisma = e.target.checked;
    kaydet();
    return;
  }
  if (e.target.name === 'tema' && TEMALAR.includes(e.target.value)) {
    d.ilerleme.ayarlar.tema = e.target.value;
    kaydet();
    temaUygula();
  }
});

// ---------- service worker ----------
function swKaydet() {
  if (!('serviceWorker' in navigator)) return;
  const ilkKontrol = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js').catch((e) => console.warn('SW kaydedilemedi', e));
  let yenilendi = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!ilkKontrol || yenilendi) return;
    yenilendi = true;
    bildir('Uygulamanın yeni sürümü hazır.', { eylem: { ad: 'Yenile', fn: () => location.reload() }, sure: 0 });
  });
}

// ---------- başlangıç ----------
async function basla() {
  // İsteğe bağlı notlar (data/tanima_notlari.json, data/eser_notlari.json) aynı anda istenir; yoksa ya da bozuksa boş kalır
  const [tumSanatcilar, akimlar, konular, turler, tanima, eserNot, eserAd, zorluk, yerelG] = await Promise.all([
    jsonGetir('data/sanatcilar.json'),
    jsonGetir('data/akimlar.json'),
    jsonGetir('data/konular.json'),
    jsonGetir('data/eser_turleri.json').catch(() => null),
    jsonGetir('data/tanima_notlari.json').catch(() => null),
    jsonGetir('data/eser_notlari.json').catch(() => null),
    jsonGetir('data/eser_adlari_tr.json').catch(() => null),
    jsonGetir('data/eser_zorluk.json').catch(() => null),
    jsonGetir('data/yerel_gorseller.json').catch(() => null),
  ]);
  d.kisaAdlar = (await jsonGetir('data/kisa_adlar.json').catch(() => ({ adlar: {} }))).adlar || {};
  d.tanimaNotlari = notlariAl(tanima);
  d.eserNotlari = notlariAl(eserNot);
  eserAdlariniAyarla(adlariAl(eserAd));
  d.kolaylik = kolaylikAl(zorluk);
  yerelGorselleriAyarla(yerelG && yerelG.gorseller, yerelG && yerelG.buyuk);
  eserTurleriniAyarla(turler);
  // Yalnızca resmi olan sanatçılar ve onların akımları (veri silinmez, uygulamada süzülür)
  const hazir = await hazirOnbellek();
  d.onbellekIdleri = hazir && hazir.sanatcilar ? new Set(Object.keys(hazir.sanatcilar)) : null;
  const sanatcilar = gorunurSanatcilar(tumSanatcilar, turler, hazir);
  d.tumSanatcilar = tumSanatcilar;
  d.sanatcilar = sanatcilar;
  d.akimlar = gorunurAkimlar(
    akimlar.slice().sort((a, b) => a.sira - b.sira),
    sanatcilar,
  );
  d.konular = konular;
  d.harita = new Map(sanatcilar.map((s) => [s.id, s]));
  d.akimSira = Object.fromEntries(d.akimlar.map((a) => [a.ad, a.sira]));
  d.akimRenk = Object.fromEntries(akimlar.map((a) => [a.ad, a.renk]));
  d.ortaYillar = akimOrtaYillari(sanatcilar);
  d.ilerleme = await ilerlemeYukle(() => jsonGetir('data/baslangic_ilerleme.json'));
  d.yarim = await yarimYukle();
  // Yarım oturum varken uygulama bir oturum adresinde açıldıysa (yenileme, yeni sürüm) Bugün'deki devam kartına dön
  if (d.yarim && /^#\/pekistir\/(karisik|donem\/.+)$/.test(location.hash)) history.replaceState(null, '', '#/');
  gunlukGuncelle(d.ilerleme, bugun());
  kaydet();
  temaUygula();
  window.addEventListener('hashchange', yonlendir);
  yonlendir();
  swKaydet();
  // Konular (görüntüleyicideki "Konu:" bağlantısı için) ilk ekrandan sonra arka planda
  setTimeout(ikonografiVeri, 1500);
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  // test ve hata ayıklama için
  window.__atlas = d;
}

basla().catch(hataGoster);
