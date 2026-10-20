// Sanat Atlası — uygulama: yönlendirme ve ekranlar ("Gece galerisi" tasarımı, tasarim-A/TASARIM.md).
import { kacis, yillarYaz, rastgeleYap, bulunmaEki } from './yardimci.js';
import { acikSanatcilar, akimDurumlari, yeniAcilanlar, islenenKume } from './kilit.js';
import { bugunStr, cevapla, vadesiGeldiMi, gorulduMu, GUNLUK_YENI_SINIRI } from './leitner.js';
import { sanatciSecenekleri, akimSecenekleri, akimOrtaYillari } from './celdirici.js';
import { kartlariSec, Oturum, kategori } from './oturum.js';
import { sanatciEserleri, eserSec, eserTurleriniAyarla, hazirOnbellek, pekistirmeHavuzu, TEST_HAVUZU } from './eserler.js';
import { gorselUrl, secilenGorsel } from './gorsel.js';
import { gorunurSanatcilar, gorunurAkimlar } from './resim.js';
import { gununSanatcisi, baskaSanatci } from './gunun.js';
import { ilerlemeYukle, ilerlemeKaydet, gunlukGuncelle, yedekMetni, yedekCoz, sonCalisilanEkle, TEMALAR } from './depo.js';
import { goruntuleyiciAc, kaynakYazisi } from './goruntuleyici.js';
import { akimYuzyillari, ikon } from './tasarim.js';

const SURUM = '1.5.0';
const TEMA_RENK = { gece: '#15120F', sepya: '#F1E8D6', acik: '#FBFAF7' };
const TEMA_AD = { gece: 'Gece', sepya: 'Sepya', acik: 'Açık' };
const TAHMINI_GORSEL_KB = 180;
const HARFLER = 'ABCD';

const d = {
  sanatcilar: [],
  akimlar: [],
  konular: [],
  harita: new Map(),
  akimSira: {},
  ortaYillar: {},
  ilerleme: null,
  oturum: null,
  yigin: [],
  acikBolumler: new Set(),
  rng: rastgeleYap(Date.now() & 0xffffffff),
  indirme: null,
  akimRenk: {},
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

// Izgara küçük görseli: 400 px; açılmazsa (ör. çevrimdışı) 800 px denenir
function kucukGorsel(e, genislik = 400) {
  const g = secilenGorsel(e, kotuler()) || e.gorseller[0];
  if (!g) return '';
  return `<img loading="lazy" decoding="async" alt="" src="${kacis(gorselUrl(g, genislik))}" data-yedek="${kacis(gorselUrl(g, 800))}">`;
}

// ---------- tasarım parçaları (TASARIM.md "Components") ----------
function akimRenk(ad) {
  return d.akimRenk[ad] || 'var(--gold)';
}

// Akımın kendi rengi yalnızca küçük bir noktada kalır; geri kalan her şey altın/mürekkep token'larından
function akimNoktasi(ad) {
  return `<span class="akim-nokta" style="--akim:${akimRenk(ad)}" aria-hidden="true"></span>`;
}

// Çerçeveli eser (6 px çerçeve, altın halka, derin gölge); kucuk: 4 px küçük resim
function cerceve(e, { genislik = 800, alt = '', ek = '', kucuk = false, tembel = false } = {}) {
  const g = secilenGorsel(e, kotuler()) || e.gorseller[0];
  if (!g) return '';
  const yedek = genislik < 800 ? ` data-yedek="${kacis(gorselUrl(g, 800))}"` : '';
  return `<span class="cerceve${kucuk ? ' kucuk' : ''}"><img ${tembel ? 'loading="lazy" ' : ''}decoding="async" alt="${kacis(alt)}" src="${kacis(gorselUrl(g, genislik))}"${yedek}${ek}></span>`;
}

// Spot ışıklı sahne: arkada sıcak ışıma, eserin altında eliptik zemin gölgesi
function sahne(icerik, sinif = '') {
  return `<div class="sahne${sinif ? ' ' + sinif : ''}"><span class="sahne-ic"><span class="zemin-golge" aria-hidden="true"></span>${icerik}</span></div>`;
}

function etiket(metin, { altin = false } = {}) {
  return `<span class="etiket${altin ? ' altin' : ''}">${kacis(metin)}</span>`;
}

// Eserin adı ve tarihi: "İnci Küpeli Kız, y. 1665"
function eserAdi(e) {
  return `${e.baslik}${e.tarih ? `, ${e.tarih}` : ''}`;
}

// Künye: yıllar · akım · Konu N (kurs dışı sanatçıda "Kurs dışı")
function kunye(s, { bag = true, konuYok = false } = {}) {
  const nokta = '<span class="nokta" aria-hidden="true"></span>';
  const akim = bag ? `<a href="#/akim/${encodeURIComponent(s.akim)}">${kacis(s.akim)}</a>` : `<span>${kacis(s.akim)}</span>`;
  const konu = konuYok ? '' : `${nokta}<span class="altin">${s.kaynak === 'ek' ? 'Kurs dışı' : `Konu ${s.konu}`}</span>`;
  return `<span>${kacis(yillarYaz(s))}</span>${nokta}${akim}${konu}${s.not_cikarilmadi ? ' <span class="rozet">taslak</span>' : ''}`;
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

// ---------- tema ----------
function temaUygula() {
  const t = d.ilerleme.ayarlar.tema;
  document.documentElement.setAttribute('data-tema', t);
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute('content', TEMA_RENK[t] || TEMA_RENK.gece);
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
  [/^#\/sanatci\/(.+)$/, sanatciSayfasi, 'gozat'],
  [/^#\/pekistir$/, pekistirMenusu, 'pekistir'],
  [/^#\/pekistir\/donem$/, pekistirMenusu, 'pekistir'],
  [/^#\/pekistir\/donem\/(.+)$/, (ad) => pekistir('donem', ad), null],
  [/^#\/pekistir\/karisik$/, () => pekistir('karisik', null), null],
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

// Başlık: isteğe bağlı geri düğmesi, altın eyebrow ve Cormorant başlık; sağda isteğe bağlı öğe
function ust(baslik, yedek = '#/', { geriYok = false, sag = '', ustEtiket = '' } = {}) {
  return `<header class="ust">${geriYok ? '' : geriDugmesi(yedek)}<div class="ust-yazi">${ustEtiket ? etiket(ustEtiket, { altin: true }) : ''}<h1 tabindex="-1">${kacis(baslik)}</h1></div>${sag}</header>`;
}

function ciz(html) {
  ekran.innerHTML = html;
  ekran.style.paddingBottom = '';
  window.scrollTo(0, 0);
  const h = ekran.querySelector('h1');
  if (h) h.focus({ preventScroll: true });
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
    if (e.target && e.target.tagName === 'IMG') e.target.classList.add('yuklendi');
  },
  true,
);

// Küçük görsel yüklenemezse (ör. çevrimdışı) büyük boyutu dene
document.addEventListener(
  'error',
  (e) => {
    const img = e.target;
    if (img && img.tagName === 'IMG' && img.dataset.yedek && img.src !== img.dataset.yedek) {
      const y = img.dataset.yedek;
      delete img.dataset.yedek;
      img.src = y;
    }
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

// ---------- Bugün (ana sayfa) ----------
function anaSayfa() {
  d.yigin = ['#/'];
  const ist = istatistik();
  const g = gunlukGuncelle(d.ilerleme, bugun());
  const gs = d.harita.get(gununId());
  const simdi = new Date();
  const tarih = `${simdi.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}, ${simdi.toLocaleDateString('tr-TR', { weekday: 'long' })}`;
  const son = (d.ilerleme.sonCalisilanlar || [])
    .map((id) => d.harita.get(id))
    .filter(Boolean)
    .slice(0, 4);
  ciz(`
    <h1 class="ekran-disi" tabindex="-1">Sanat Atlası</h1>
    <header class="bugun-ust">
      <div class="ust-yazi">${etiket('Bugün', { altin: true })}<span class="tarih">${kacis(tarih)}</span></div>
      <span class="hap" data-test="tekrar">${ist.vade ? `${ist.vade} tekrar bekliyor` : 'Bugün tekrar yok'}</span>
    </header>
    ${
      gs
        ? `<a class="gunun-kart" href="#/gunun" data-test="gunun-kart">
      ${sahne('<span class="yer-tutucu" data-gunun-gorsel></span>')}
      <span class="duvar">
        ${etiket('Günün sanatçısı', { altin: true })}
        <b class="ad">${kacis(gs.ad)}</b>
        <span class="meta">${kacis(yillarYaz(gs))} · ${kacis(gs.akim)} · ${gs.kaynak === 'ek' ? 'Kurs dışı' : `Konu ${gs.konu}`}</span>
        <span class="eser-adi" data-gunun-eser></span>
      </span></a>`
        : ''
    }
    <div class="iki-dugme">
      <a class="dugme birincil iki-satir" href="#/pekistir/karisik"><b>Pekiştir · Karışık</b><small>Sanatçı + akım</small></a>
      <a class="dugme iki-satir" href="#/pekistir/donem"><b>Döneme göre</b><small>Bir akım seç</small></a>
    </div>
    ${
      son.length
        ? `<section class="bolum" style="gap:10px;padding-top:20px">
      <div class="bolum-bas cizgili">${etiket('Son çalıştıkların')}<a href="#/gozat">Tümü</a></div>
      <div class="mini-serit">${son
        .map(
          (s) =>
            `<a class="mini" href="#/sanatci/${encodeURIComponent(s.id)}"><span class="mini-resim" data-mini="${kacis(s.id)}"></span><span>${kacis(s.ad)}</span></a>`,
        )
        .join('')}</div>
    </section>`
        : ''
    }
    <p class="sakin"><span data-test="acik-sayi">${ist.acik}</span> açık sanatçı · ${ist.oran === null ? 'henüz cevap yok' : `%${ist.oran} doğru`} · bugün ${g.kart} / ${d.ilerleme.ayarlar.gunlukKart} kart · <a href="#/ayarlar">Ayarlar</a></p>`);
  if (gs) gununKartGorseli(gs);
  for (const el of ekran.querySelectorAll('[data-mini]')) {
    sanatciEserleri(d.harita.get(el.dataset.mini)).then((eserler) => {
      const e = enBilinen(eserler);
      if (e && el.isConnected) el.innerHTML = kucukGorsel(e, 400);
    });
  }
}

// ---------- Günün sanatçısı ----------
function gununId() {
  return gununSanatcisi(
    d.sanatcilar.map((s) => s.id),
    bugun(),
  );
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

async function gununKartGorseli(s) {
  const eserler = await sanatciEserleri(s);
  const kutu = ekran.querySelector('[data-gunun-gorsel]');
  const e = enBilinen(eserler);
  if (!kutu) return;
  if (!e) return kutu.closest('.sahne').remove();
  kutu.outerHTML = cerceve(e, { alt: `${s.ad}, ${e.baslik}` });
  const ad = ekran.querySelector('[data-gunun-eser]');
  if (ad) ad.textContent = eserAdi(e);
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

// Kahraman: kenardan kenara resim, alta doğru zemine eriyen degrade; geri düğmesi üstünde
function kahraman(yedek) {
  return `<div class="kahraman" data-kahraman>${geriDugmesi(yedek)}</div>`;
}

// Kahramana en bilinen eseri koy (kırpılabilir; dokununca görüntüleyicide tamamı görünür)
function kahramaniDoldur(eserler, ac) {
  const k = ekran.querySelector('[data-kahraman]');
  if (!k) return;
  const ilk = enBilinen(eserler);
  if (!ilk) {
    k.classList.add('gorselsiz');
    return;
  }
  const g = secilenGorsel(ilk, kotuler());
  k.insertAdjacentHTML(
    'afterbegin',
    `<button class="kahraman-dugme" type="button" aria-label="${kacis(ilk.baslik)} — büyüt"><img decoding="async" alt="${kacis(ilk.baslik)}" src="${kacis(gorselUrl(g, 1200))}" data-yedek="${kacis(gorselUrl(g, 800))}"></button>`,
  );
  k.querySelector('.kahraman-dugme').addEventListener('click', () => ac(eserler.indexOf(ilk)));
}

// Önceki ← bu akım → sonraki (Göz At'taki zaman sırası)
function donemCizelgesi(akim) {
  const i = d.akimlar.findIndex((a) => a.ad === akim);
  const onceki = d.akimlar[i - 1];
  const sonraki = d.akimlar[i + 1];
  const bag = (a, metin, sinif) => (a ? `<a class="${sinif}" href="#/akim/${encodeURIComponent(a.ad)}">${metin}</a>` : `<span class="${sinif}"></span>`);
  return `<div class="donem-cizgi" aria-hidden="true"><span></span><span class="simdi"></span><span></span></div>
    <nav class="donem-adlar" aria-label="Akım zaman çizelgesi">
      ${bag(onceki, `← ${kacis(onceki ? onceki.ad : '')}`, 'once')}
      <a class="simdi" href="#/akim/${encodeURIComponent(akim)}">${kacis(akim)}</a>
      ${bag(sonraki, `${kacis(sonraki ? sonraki.ad : '')} →`, 'sonra')}
    </nav>`;
}

// Eser şeridi (çerçeveli küçük resimler); "Hepsini gör" iki sütunlu galeriye çevirir
function eserSeridi(eserler, sinif, veri) {
  return eserler
    .map(
      (e, i) => `<button class="${sinif}" type="button" ${veri}="${i}" aria-label="${kacis(e.baslik)} — büyüt">
      ${cerceve(e, { genislik: 400, kucuk: true, tembel: i > 3 })}<span class="eser-yazi">${kacis(e.baslik)}${e.tarih ? ` <small>· ${kacis(e.tarih)}</small>` : ''}</span></button>`,
    )
    .join('');
}

async function gununSayfasi(id) {
  const bugunku = gununId();
  const s = d.harita.get(id || bugunku);
  if (!s) return hataGoster(new Error('Sanatçı bulunamadı.'));
  const { biyografiler, akimBilgi } = await ekVeriYukle();
  const bio = biyografiler.sanatcilar[s.id];
  const akim = akimBilgi.akimlar[s.akim];
  const not = s.kurs_notu || s.anlatim;
  ciz(`${kahraman('#/')}
    <article class="gunun">
      <header class="kahraman-ad">
        <h1 class="etiket altin" tabindex="-1">${id && id !== bugunku ? 'Sanatçı' : 'Günün sanatçısı'}</h1>
        <h2 class="gunun-ad">${kacis(s.ad)}</h2>
        <p class="kunye" style="margin:0">${kunye(s, { konuYok: true })}</p>
        <p style="margin:6px 0 0"><span class="hap altin" data-test="kurs-durumu">${kacis(kursDurumu(s))}</span></p>
      </header>
      ${not ? `<section class="bolum">${etiket('Notlarımdan', { altin: true })}<p class="okuma italik">${kacis(not)}</p></section>` : ''}
      ${s.taninma ? `<section class="bolum">${etiket('Nasıl tanırım?')}<p class="okuma">${kacis(s.taninma)}</p></section>` : ''}
      <section class="bolum">
        ${etiket('Hayatı')}
        ${
          bio
            ? `<p class="okuma" data-test="biyografi">${kacis(bio.metin)}</p>
          <p class="kucuk ikincil" style="margin:4px 0 0">Kaynak: <a href="${kacis(bio.kaynak.url)}" target="_blank" rel="noopener">${kacis(bio.kaynak.ad)}</a>${bio.dil === 'en→tr' ? ' (İngilizceden kısaltılarak çevrildi)' : ''}</p>`
            : '<p class="ikincil">Bu sanatçı için biyografi henüz yok.</p>'
        }
      </section>
      <section class="bolum" style="gap:8px">
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
      <section class="bolum" style="gap:10px;padding-top:20px">
        <div class="bolum-bas">${etiket('Eserleri')}</div>
        <div class="eserler" data-galeri><p class="ikincil kucuk">Eserler yükleniyor…</p></div>
      </section>
      <div class="menu">
        ${
          pekistirmedeMi(s)
            ? '<p class="mesaj-not">Bu sanatçı pekiştirmede.</p>'
            : `<button class="dugme birincil" type="button" data-pekistirmeye-ekle="${kacis(s.id)}">Bu sanatçıyı pekiştirmeye ekle</button>`
        }
        <a class="dugme" href="#/gunun/${encodeURIComponent(
          baskaSanatci(
            d.sanatcilar.map((x) => x.id),
            s.id,
            d.rng,
          ),
        )}" data-test="baska">Başka bir sanatçı</a>
      </div>
    </article>`);
  const eserler = bilinirlikSirasi(await sanatciEserleri(s));
  if (!location.hash.startsWith('#/gunun')) return;
  const galeri = ekran.querySelector('[data-galeri]');
  const ac = (i) => goruntuleyiciAc({ eserler, baslangic: i, ...gorselTercihi() });
  if (!eserler.length) {
    ekran.querySelector('[data-kahraman]').classList.add('gorselsiz');
    galeri.innerHTML = '<p class="ikincil kucuk">Bu sanatçı için doğrulanmış görsel bulunamadı.</p>';
    return;
  }
  kahramaniDoldur(eserler, ac);
  galeri.innerHTML = eserSeridi(eserler, 'galeri-eser', 'data-galeri-eser');
  galeri.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-galeri-eser]');
    if (b) ac(Number(b.dataset.galeriEser));
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

// ---------- Göz At: akımlar zaman sırasıyla ----------
function gozAt() {
  const durumlar = akimDurumlari(d.akimlar, d.sanatcilar, islenen());
  ciz(`${ust('Göz At', '#/', { geriYok: true, ustEtiket: 'Akımlar' })}
    <p class="kucuk ikincil" style="margin:0 0 6px">Zaman sırasıyla. Soluk olanlar, ilgili konu işlenince açılır.</p>
    <ol class="zaman">${durumlar
      .map((a) => {
        const uyeler = d.sanatcilar.filter((x) => x.akim === a.ad);
        const ic = `<span class="etiket altin">${akimNoktasi(a.ad)}${kacis(akimYuzyillari(uyeler))}</span><b>${kacis(a.ad)}</b>
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
        .map((e) => cerceve(e, { genislik: 400, kucuk: true, tembel: true }))
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
  ciz(`${ust(ad, '#/gozat', { ustEtiket: akimYuzyillari(uyeler) })}
    <section class="bolum" style="gap:8px;padding-top:8px">${etiket('Dönemi')}${donemCizelgesi(ad)}</section>
    <section class="bolum" style="gap:8px">${etiket('Sanatçılar')}
    <ul class="liste">${acik.map((s) => sanatciSatiri(s, true)).join('')}${kapali.map((s) => sanatciSatiri(s, false)).join('')}</ul></section>
    ${acik.length ? `<div class="menu"><a class="dugme birincil" href="#/pekistir/donem/${encodeURIComponent(ad)}">Bu akımı pekiştir</a></div>` : ''}`);
  kucukKareleriDoldur();
}

async function sanatciSayfasi(id) {
  const s = d.harita.get(id);
  if (!s) return hataGoster(new Error('Sanatçı bulunamadı.'));
  const acik = islenen().has(s.konu);
  const not = s.kurs_notu || s.anlatim;
  const onemli = (s.onemli_eserler || []).length
    ? `<section class="bolum">${etiket('Önemli eserler')}<ul class="okuma" style="padding-left:20px;margin:0">${s.onemli_eserler.map((e) => `<li>${kacis(e.tr || e.baslik)}${e.yil ? ` <span class="ikincil">(${kacis(e.yil)})</span>` : ''}</li>`).join('')}</ul></section>`
    : '';
  const emin = (s.emin_degil || []).length
    ? `<details class="bolum"><summary class="etiket">Kesin olmayan bilgiler</summary><ul class="kucuk ikincil" style="margin:0;padding-left:20px">${s.emin_degil.map((x) => `<li>${kacis(x)}</li>`).join('')}</ul></details>`
    : '';
  ciz(`${kahraman(`#/akim/${encodeURIComponent(s.akim)}`)}
    <article>
    <header class="kahraman-ad">
      <h1 tabindex="-1">${kacis(s.ad)}</h1>
      <p class="kunye" style="margin:0">${kunye(s)}</p>
      ${acik || pekistirmedeMi(s) ? '' : `<p class="mesaj-not" style="margin:2px 0 0">Bu sanatçı Konu ${s.konu} işlenince pekiştirmeye girer.</p>`}
    </header>
    ${not ? `<section class="bolum">${etiket('Notlarımdan', { altin: true })}<p class="okuma italik">${kacis(not)}</p></section>` : ''}
    ${s.taninma ? `<section class="bolum">${etiket('Nasıl tanırım?')}<p class="okuma">${kacis(s.taninma)}</p></section>` : ''}
    <section class="bolum" style="gap:8px">${etiket('Dönemi')}${donemCizelgesi(s.akim)}</section>
    ${onemli}${emin}
    <section class="bolum" style="gap:10px;padding-top:20px">
      <div class="bolum-bas">${etiket('Eserleri')}<button type="button" data-hepsi hidden>Hepsini gör</button></div>
      <div class="eserler" id="eserler"><p class="ikincil kucuk">Eserler yükleniyor…</p></div>
    </section>
    </article>`);
  const eserler = await sanatciEserleri(s);
  d.sonEserListesi = eserler; // testler ve hata ayıklama için
  const kutu = document.getElementById('eserler');
  if (!kutu || location.hash !== `#/sanatci/${encodeURIComponent(id)}`) return;
  const ac = (i) => goruntuleyiciAc({ eserler, baslangic: i, ...gorselTercihi() });
  if (!eserler.length) {
    ekran.querySelector('[data-kahraman]').classList.add('gorselsiz');
    kutu.innerHTML = '<p class="ikincil kucuk">Bu sanatçı için doğrulanmış görsel bulunamadı.</p>';
    return;
  }
  kahramaniDoldur(eserler, ac);
  kutu.innerHTML = eserSeridi(eserler, 'eser', 'data-eser');
  kutu.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-eser]');
    if (b) ac(Number(b.dataset.eser));
  });
  // "Hepsini gör": şerit ↔ iki sütunlu galeri
  const hepsi = ekran.querySelector('[data-hepsi]');
  if (eserler.length > 3) {
    hepsi.hidden = false;
    hepsi.textContent = `Hepsini gör (${eserler.length})`;
    hepsi.addEventListener('click', () => {
      const izgara = kutu.classList.toggle('izgara');
      hepsi.textContent = izgara ? 'Şerit görünümü' : `Hepsini gör (${eserler.length})`;
      hepsi.setAttribute('aria-expanded', String(izgara));
    });
  }
}

// ---------- Pekiştir ----------
function pekistirMenusu() {
  const durumlar = akimDurumlari(d.akimlar, d.sanatcilar, islenen()).filter((a) => a.acik);
  const b = bugun();
  const vadeSay = (ad) => acikListe().filter((s) => (!ad || s.akim === ad) && kategori(d.ilerleme.skorlar, s.id, 'donem', b) === 0).length;
  ciz(`${ust('Pekiştir', '#/', { geriYok: true, ustEtiket: 'Tekrar' })}
    ${
      durumlar.length
        ? `<a class="dugme birincil iki-satir" href="#/pekistir/karisik" style="margin-top:6px"><b>Pekiştir · Karışık</b><small>Sanatçı + akım · ${istatistik().vade} tekrar bekliyor</small></a>
    <section class="bolum" style="gap:8px;padding-top:22px">${etiket('Döneme göre')}
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
  };
}

function kipAdi(kip, akim) {
  return kip === 'karisik' ? 'Pekiştir · Karışık' : akim === 'hepsi' ? 'Pekiştir · Hepsi' : `Pekiştir · ${akim}`;
}

async function pekistir(kip, akim, { yeni = false } = {}) {
  const baslik = kipAdi(kip, akim);
  const o = d.oturum;
  if (yeni || !o || o.kip !== kip || o.akim !== akim || o.oturum.bitti) {
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
    const eser = eserSec(eserler, son, d.rng, kotuler());
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
  if (!o.kart || o.kart.konum !== konum) {
    let hazir = o.sonrakiKart && (await o.sonrakiKart);
    if (!hazir || hazir.konum !== konum || hazir.id !== o.oturum.simdiki.id) hazir = await kartHazirla(o, konum);
    o.sonrakiKart = null;
    if (d.oturum !== o) return;
    if (!hazir || !hazir.eser) {
      o.oturum.ilerle();
      return kartCiz();
    }
    o.kart = hazir;
  }
  kartGoster(o);
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
  return s.taninma || s.kurs_notu || s.anlatim || '';
}

function kartGoster(o) {
  const k = o.kart;
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
    if (!ikinci) {
      // 1. soru (sanatçı): yalnızca sanatçı ve eser; karışıkta akım henüz söylenmez
      dogru = sanatciDogru;
      sonuc = dogru ? 'Doğru' : `Yanlış · ${tekrarNotu}`;
      bilgi = `${s.ad} · ${eserAdi(k.eser)}`;
      not = karisik && akimiAciklarMi(ipucu, s.akim) ? '' : ipucu;
      ileri = karisik
        ? '<button class="dugme birincil" type="button" data-ikinci>Hangi akım? →</button>'
        : `<button class="dugme birincil" type="button" data-sonraki>${sonrakiYazi}</button>`;
    } else {
      // 2. soru (akım): akım ve komşuları
      dogru = k.cevapAkim === s.akim;
      sonuc = dogru ? (sanatciDogru ? 'Doğru' : `Doğru · sanatçı yanlıştı, ${tekrarNotu}`) : `Yanlış · ${tekrarNotu}`;
      bilgi = `${s.akim} · ${s.ad} (${yillarYaz(s)})`;
      const gorunur = new Set(d.akimlar.map((a) => a.ad));
      const komsular = ((d.akimlar.find((a) => a.ad === s.akim) || {}).komsular || []).filter((x) => gorunur.has(x));
      const ilkteGizlenen = akimiAciklarMi(ipucu, s.akim) ? ipucu : '';
      not = [komsular.length ? `Komşu akımlar: ${komsular.join(', ')}.` : '', ilkteGizlenen].filter(Boolean).join(' ');
      ileri = `<button class="dugme birincil" type="button" data-sonraki>${sonrakiYazi}</button>`;
    }
    const tumDogru = ikinci ? sanatciDogru && k.cevapAkim === s.akim : sanatciDogru;
    yaprak = `<section class="alt-yaprak" aria-live="polite">
      <p class="sonuc" data-test="sonuc" data-dogru="${ikinci || !karisik ? tumDogru : dogru}">${kacis(sonuc)}</p>
      <p class="bilgi">${kacis(bilgi)}</p>
      ${not ? `<p class="ipucu">${kacis(not)}</p>` : ''}
      <p class="kaynak-satir">${kacis(kaynakYazisi(k.eser, secilenGorsel(k.eser, kotuler())))}</p>
      <div class="yaprak-dugmeler"><a class="dugme" href="#/sanatci/${encodeURIComponent(s.id)}">Sanatçı sayfası</a>${ileri}</div>
    </section>`;
  }

  ciz(`<header class="soru-ust">
      <button class="kapat" type="button" data-geri="#/pekistir" aria-label="Kapat">${ikon('kapat', 22, 1.7)}</button>
      <div class="soru-ilerleme">
        <div class="satir-ust"><span>${kacis(kipAdi(o.kip, o.akim))}</span><span data-test="sayac">${sira} / ${ot.toplam}</span></div>
        <div class="ince-cubuk" aria-hidden="true"><i style="width:${yuzde}%"></i></div>
      </div>
    </header>
    <div class="sahne soru-sahne">
      <button class="soru-resim" type="button" data-buyut aria-label="Görseli büyüt">
        ${cerceve(k.eser, { alt: 'Sorulan eser', ek: ' data-test="soru-resim"' })}
        <span class="durum" data-durum>Yükleniyor…</span>
      </button>
    </div>
    <div class="soru-baslik">
      ${etiket(karisik ? `Soru ${ikinci ? 2 : 1} / 2` : 'Soru 1 / 1', { altin: true })}
      <h2 tabindex="-1">${ikinci ? 'Hangi akım?' : 'Bu eser kimin?'}</h2>
    </div>
    ${secenekler}
    ${yaprak}`);

  const img = ekran.querySelector('[data-test="soru-resim"]');
  const durum = ekran.querySelector('[data-durum]');
  const yuklendi = () => (durum.hidden = true);
  if (img.complete && img.naturalWidth) yuklendi();
  img.addEventListener('load', yuklendi);
  img.addEventListener('error', () => {
    durum.innerHTML = 'Görsel yüklenemedi.';
    if (!k.bitti && k.cevapSanatci === null) baskaEser(o);
  });

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
  const o = d.oturum;
  const sb = e.target.closest('[data-sanatci]');
  const ab = e.target.closest('[data-akim]');
  if (e.target.closest('[data-buyut]') && o && o.kart) {
    const k = o.kart;
    goruntuleyiciAc({
      eserler: [k.eser],
      gizli: !k.bitti,
      ...gorselTercihi(() => {
        // soru görseli reddedildiyse kartı yeni görselle çiz
        if (secilenGorsel(k.eser, kotuler())) kartGoster(o);
        else if (!k.bitti) baskaEser(o);
      }),
    });
    return;
  }
  if (sb && o && o.kart && o.kart.cevapSanatci === null) {
    const k = o.kart;
    yeniSanatciSay(k.id, o.kip);
    k.cevapSanatci = sb.dataset.sanatci;
    const dogru = k.cevapSanatci === k.id;
    skor(k.id).sanatci = cevapla(skor(k.id).sanatci, dogru, bugun());
    sonCalisilanEkle(d.ilerleme, k.id);
    baskaDeneme = 0;
    if (o.kip === 'donem') kartiBitir(o, dogru);
    else kaydet();
    kartGoster(o);
    return;
  }
  if (e.target.closest('[data-ikinci]') && o && o.kart && o.kart.cevapSanatci !== null) {
    o.kart.adim = 2;
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
    kartGoster(o);
    return;
  }
  if (e.target.closest('[data-sonraki]') && o) {
    o.oturum.ilerle();
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
  const toplam = ot.dogru + ot.yanlis;
  ciz(`${ust(kipAdi(o.kip, o.akim), '#/pekistir', { ustEtiket: 'Tur bitti' })}
    <div class="duvar ozet">
      ${etiket('Sonuç', { altin: true })}
      <b class="ad">${ot.dogru} / ${toplam}</b>
      <span class="meta">kart doğru</span>
      <span class="eser-adi">${ot.yanlis ? 'Yanlış yaptıkların daha sık karşına çıkacak.' : 'Hepsi doğru, harika.'}</span>
    </div>
    <div class="menu"><button class="dugme birincil" type="button" data-yeni-tur>Bir tur daha</button><a class="dugme" href="#/">Bugün</a></div>`);
}

// ---------- İlerleme ----------
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
    ${akimSatirlari.length ? `<div style="border-top:1px solid var(--hair)">${akimSatirlari.join('')}</div>` : '<p class="ikincil">Henüz açık akım yok.</p>'}
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
  if (!kaydirmayiKoru) ciz(html);
  else {
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
    <p class="alt-not">Sanat Atlası ${SURUM} · Görseller: Wikimedia Commons ve müze açık erişim koleksiyonları · Eser listeleri: Wikidata</p>`);
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
        await fetch(u, { mode: 'no-cors' });
      } catch (e) {
        d.indirme.hata++;
      }
      d.indirme.biten++;
      indirmeGoster();
    }
  };
  await Promise.all([isci(), isci(), isci(), isci()]);
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
    const metin = yedekMetni(d.ilerleme);
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
      const yeni = yedekCoz(document.getElementById('yedek-girdi').value);
      if (!confirm('Mevcut ilerlemenin yerine bu yedek yüklensin mi?')) return;
      d.ilerleme = yeni;
      d.oturum = null;
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
  const [tumSanatcilar, akimlar, konular, turler] = await Promise.all([
    jsonGetir('data/sanatcilar.json'),
    jsonGetir('data/akimlar.json'),
    jsonGetir('data/konular.json'),
    jsonGetir('data/eser_turleri.json').catch(() => null),
  ]);
  eserTurleriniAyarla(turler);
  // Yalnızca resmi olan sanatçılar ve onların akımları (veri silinmez, uygulamada süzülür)
  const sanatcilar = gorunurSanatcilar(tumSanatcilar, turler, await hazirOnbellek());
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
  gunlukGuncelle(d.ilerleme, bugun());
  kaydet();
  temaUygula();
  window.addEventListener('hashchange', yonlendir);
  yonlendir();
  swKaydet();
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  // test ve hata ayıklama için
  window.__atlas = d;
}

basla().catch(hataGoster);
