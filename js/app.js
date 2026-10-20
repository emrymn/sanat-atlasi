// Sanat Atlası — uygulama: yönlendirme ve ekranlar.
import { kacis, yillarYaz, resimUrl, rastgeleYap, bulunmaEki } from './yardimci.js';
import { acikSanatcilar, akimDurumlari, yeniAcilanlar, islenenKume } from './kilit.js';
import { bugunStr, cevapla, vadesiGeldiMi, gorulduMu, GUNLUK_YENI_SINIRI } from './leitner.js';
import { sanatciSecenekleri, akimSecenekleri, akimOrtaYillari } from './celdirici.js';
import { kartlariSec, Oturum, kategori } from './oturum.js';
import { sanatciEserleri, eserSec, TEST_HAVUZU, eserTurleriniAyarla, hazirOnbellek } from './eserler.js';
import { gorunurSanatcilar, gorunurAkimlar } from './resim.js';
import { ilerlemeYukle, ilerlemeKaydet, gunlukGuncelle, yedekMetni, yedekCoz, TEMALAR } from './depo.js';
import { goruntuleyiciAc, kaynakYazisi } from './goruntuleyici.js';

const SURUM = '1.1.0';
const TEMA_RENK = { sepya: '#F1E8D6', acik: '#FBFAF7', koyu: '#1D1A17' };
const TEMA_AD = { sepya: 'Sepya', acik: 'Açık', koyu: 'Koyu' };
const TAHMINI_GORSEL_KB = 180;

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
  return acikSanatcilar(d.sanatcilar, islenen());
}

function skor(id) {
  return (d.ilerleme.skorlar[id] ||= {});
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
  if (m) m.setAttribute('content', TEMA_RENK[t] || TEMA_RENK.sepya);
}

// ---------- yönlendirme ----------
const rotalar = [
  [/^#?\/?$/, anaSayfa],
  [/^#\/gozat$/, gozAt],
  [/^#\/akim\/(.+)$/, akimSayfasi],
  [/^#\/sanatci\/(.+)$/, sanatciSayfasi],
  [/^#\/pekistir\/donem$/, donemSecimi],
  [/^#\/pekistir\/donem\/(.+)$/, (ad) => pekistir('donem', ad)],
  [/^#\/pekistir\/karisik$/, () => pekistir('karisik', null)],
  [/^#\/ilerleme$/, () => ilerlemeSayfasi()],
  [/^#\/ayarlar$/, ayarlarSayfasi],
];

function yonlendir() {
  const h = location.hash || '#/';
  // geri düğmesi için basit yığın
  if (d.yigin.length > 1 && d.yigin[d.yigin.length - 2] === h) d.yigin.pop();
  else if (d.yigin[d.yigin.length - 1] !== h) d.yigin.push(h);
  for (const [desen, fn] of rotalar) {
    const m = desen.exec(h);
    if (m) {
      const args = m.slice(1).map((x) => decodeURIComponent(x));
      Promise.resolve(fn(...args)).catch(hataGoster);
      return;
    }
  }
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
  ekran.innerHTML = `${ust('Bir sorun oldu')}<p>${kacis(e && e.message ? e.message : String(e))}</p><p><a class="dugme" href="#/">Ana sayfa</a></p>`;
}

function ust(baslik, yedek = '#/', { geriYok = false, sag = '' } = {}) {
  return `<header class="ust">${geriYok ? '' : `<button class="geri" type="button" data-geri="${kacis(yedek)}" aria-label="Geri">‹ Geri</button>`}<h1 tabindex="-1">${kacis(baslik)}</h1>${sag}</header>`;
}

function ciz(html) {
  ekran.innerHTML = html;
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

// ---------- Ana sayfa ----------
function anaSayfa() {
  d.yigin = ['#/'];
  const ist = istatistik();
  const g = gunlukGuncelle(d.ilerleme, bugun());
  ciz(`
    <div class="baslik-blok"><h1 tabindex="-1">Sanat Atlası</h1>
    <p class="ikincil">Rönesans'tan 20. yüzyıla — kursla birlikte büyüyen atlas</p></div>
    <section class="sayilar" aria-label="Özet">
      <div class="sayi"><b data-test="acik-sayi">${ist.acik}</b><span>açık sanatçı</span></div>
      <div class="sayi"><b>${ist.vade}</b><span>bugün tekrarı gelen</span></div>
      <div class="sayi"><b>${ist.oran === null ? '–' : '%' + ist.oran}</b><span>toplam doğru oranı</span></div>
    </section>
    <p class="ikincil kucuk">Bugün ${g.kart} / ${d.ilerleme.ayarlar.gunlukKart} kart · yeni sanatçı ${g.yeni} / ${GUNLUK_YENI_SINIRI}</p>
    <nav class="menu" aria-label="Ana menü">
      <a class="dugme" href="#/gozat">Göz At <small>dönemler ve sanatçılar</small></a>
      <a class="dugme birincil" href="#/pekistir/donem">Pekiştir · Döneme göre</a>
      <a class="dugme birincil" href="#/pekistir/karisik">Pekiştir · Karışık</a>
      <a class="dugme" href="#/ilerleme">İlerleme <small>konular, doğruluk</small></a>
      <a class="dugme" href="#/ayarlar">Ayarlar</a>
    </nav>`);
}

// ---------- Göz At ----------
function gozAt() {
  const durumlar = akimDurumlari(d.akimlar, d.sanatcilar, islenen());
  ciz(`${ust('Göz At')}
    <p class="ikincil kucuk">Akımlar kronolojik sırada. Kilitli olanlar ilgili konu işlenince açılır.</p>
    <ul class="liste">${durumlar
      .map((a) =>
        a.acik
          ? `<li><a class="satir" href="#/akim/${encodeURIComponent(a.ad)}"><span class="metin"><b>${kacis(a.ad)}</b><span class="ikincil kucuk">${a.acikSayisi} / ${a.toplam} sanatçı açık</span></span></a></li>`
          : `<li><div class="satir kilitli" aria-disabled="true"><span class="metin"><b>${kacis(a.ad)}</b><span class="ikincil kucuk">Konu ${bulunmaEki(a.acilacagiKonu)} açılır</span></span></div></li>`,
      )
      .join('')}</ul>`);
}

function sanatciSatiri(s, acik) {
  const rozetler = `${s.kaynak === 'ek' ? ' <span class="rozet">kurs dışı</span>' : ''}${s.not_cikarilmadi ? ' <span class="rozet">taslak</span>' : ''}`;
  if (!acik)
    return `<li><div class="satir kilitli" aria-disabled="true"><span class="metin"><b>${kacis(s.ad)}${rozetler}</b><span class="ikincil kucuk">${kacis(yillarYaz(s))} · Konu ${bulunmaEki(s.konu)} açılır</span></span></div></li>`;
  return `<li><a class="satir" href="#/sanatci/${encodeURIComponent(s.id)}"><span class="metin"><b>${kacis(s.ad)}${rozetler}</b><span class="ikincil kucuk">${kacis(yillarYaz(s))}</span></span></a></li>`;
}

function akimSayfasi(ad) {
  const k = islenen();
  const uyeler = d.sanatcilar.filter((s) => s.akim === ad).sort((a, b) => (a.dogum ?? a.olum ?? 0) - (b.dogum ?? b.olum ?? 0));
  if (!uyeler.length) return hataGoster(new Error('Akım bulunamadı.'));
  const acik = uyeler.filter((s) => k.has(s.konu));
  const kapali = uyeler.filter((s) => !k.has(s.konu));
  ciz(`${ust(ad, '#/gozat')}
    <ul class="liste">${acik.map((s) => sanatciSatiri(s, true)).join('')}${kapali.map((s) => sanatciSatiri(s, false)).join('')}</ul>
    ${acik.length ? `<p style="margin-top:16px"><a class="dugme birincil" href="#/pekistir/donem/${encodeURIComponent(ad)}">Bu akımı pekiştir</a></p>` : ''}`);
}

async function sanatciSayfasi(id) {
  const s = d.harita.get(id);
  if (!s) return hataGoster(new Error('Sanatçı bulunamadı.'));
  const acik = islenen().has(s.konu);
  const konu = d.konular.find((k) => k.no === s.konu);
  const metin = s.kurs_notu
    ? `<div class="not-kutu"><p class="ikincil kucuk">Kurs notu</p><p class="okuma">${kacis(s.kurs_notu)}</p></div>`
    : s.anlatim
      ? `<p class="okuma">${kacis(s.anlatim)}</p>`
      : '';
  const onemli = (s.onemli_eserler || []).length
    ? `<h2>Önemli eserler</h2><ul class="okuma">${s.onemli_eserler.map((e) => `<li>${kacis(e.tr || e.baslik)}${e.yil ? ` <span class="ikincil">(${kacis(e.yil)})</span>` : ''}</li>`).join('')}</ul>`
    : '';
  const emin = (s.emin_degil || []).length
    ? `<details><summary>Kesin olmayan bilgiler</summary><ul class="kucuk ikincil">${s.emin_degil.map((x) => `<li>${kacis(x)}</li>`).join('')}</ul></details>`
    : '';
  ciz(`${ust(s.ad, `#/akim/${encodeURIComponent(s.akim)}`)}
    <p class="kunye">${kacis(yillarYaz(s))} · <a href="#/akim/${encodeURIComponent(s.akim)}">${kacis(s.akim)}</a></p>
    <p class="kunye kucuk">Konu ${s.konu}${konu ? ` · ${kacis(konu.baslik)}` : ''}
      ${s.kaynak === 'ek' ? ' <span class="rozet">kurs dışı</span>' : ''}${s.not_cikarilmadi ? ' <span class="rozet">taslak</span>' : ''}</p>
    ${acik ? '' : `<p class="mesaj">Bu sanatçı Konu ${s.konu} işlenince pekiştirmeye girer.</p>`}
    ${metin}
    ${s.taninma ? `<h2>Nasıl tanırım?</h2><p class="okuma">${kacis(s.taninma)}</p>` : ''}
    ${onemli}${emin}
    <h2>Eserler</h2>
    <div id="eserler"><p class="ikincil">Eserler yükleniyor…</p></div>`);
  const eserler = await sanatciEserleri(s);
  const kutu = document.getElementById('eserler');
  if (!kutu || location.hash !== `#/sanatci/${encodeURIComponent(id)}`) return;
  if (!eserler.length) {
    kutu.innerHTML = '<p class="ikincil">Bu sanatçı için doğrulanmış görsel bulunamadı.</p>';
    return;
  }
  kutu.innerHTML = `<p class="ikincil kucuk">${eserler.length} eser · önce kursta geçenler</p><div class="izgara">${eserler
    .map(
      (e, i) => `<button class="eser" type="button" data-eser="${i}" aria-label="${kacis(e.baslik)} — büyüt">
        <span class="kare"><img loading="lazy" decoding="async" alt="" src="${resimUrl(e.dosya, 400)}" data-yedek="${resimUrl(e.dosya, 800)}"></span>
        <span class="alt"><b>${kacis(e.baslik)}</b><span class="ikincil">${kacis(e.tarih || '')}${e.kaynak === 'kurs' ? `${e.tarih ? ' · ' : ''}kurs` : ''}</span></span></button>`,
    )
    .join('')}</div>`;
  kutu.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-eser]');
    if (b) goruntuleyiciAc({ eserler, baslangic: Number(b.dataset.eser) });
  });
}

// ---------- Pekiştir ----------
function donemSecimi() {
  const durumlar = akimDurumlari(d.akimlar, d.sanatcilar, islenen()).filter((a) => a.acik);
  const b = bugun();
  const vadeSay = (ad) => acikListe().filter((s) => (!ad || s.akim === ad) && kategori(d.ilerleme.skorlar, s.id, 'donem', b) === 0).length;
  ciz(`${ust('Pekiştir · Döneme göre')}
    ${
      durumlar.length
        ? `<ul class="liste">
      <li><a class="satir" href="#/pekistir/donem/hepsi"><span class="metin"><b>Hepsi, dönem sırasıyla</b><span class="ikincil kucuk">${acikListe().length} sanatçı · ${vadeSay(null)} tekrar</span></span></a></li>
      ${durumlar.map((a) => `<li><a class="satir" href="#/pekistir/donem/${encodeURIComponent(a.ad)}"><span class="metin"><b>${kacis(a.ad)}</b><span class="ikincil kucuk">${a.acikSayisi} sanatçı · ${vadeSay(a.ad)} tekrar</span></span></a></li>`).join('')}
    </ul>`
        : bosAcik()
    }`);
}

function bosAcik() {
  return `<div class="yuzey"><p>Henüz açık sanatçı yok.</p><p><a href="#/ilerleme">İlerleme</a> ekranında işlediğin konuları işaretle.</p></div>`;
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

async function pekistir(kip, akim, { yeni = false } = {}) {
  const baslik = kip === 'karisik' ? 'Pekiştir · Karışık' : akim === 'hepsi' ? 'Pekiştir · Hepsi' : `Pekiştir · ${akim}`;
  const o = d.oturum;
  if (yeni || !o || o.kip !== kip || o.akim !== akim || o.oturum.bitti) {
    if (!acikListe().length) return ciz(`${ust(baslik)}${bosAcik()}`);
    ciz(`${ust(baslik)}<p class="ikincil">Kartlar hazırlanıyor…</p>`);
    d.oturum = await oturumKur(kip, akim);
    if (!d.oturum.oturum.toplam) {
      d.oturum = null;
      return ciz(
        `${ust(baslik)}<div class="yuzey"><p>Bu seçim için şu an kart yok.</p><p class="ikincil kucuk">Bugünkü yeni sanatçı sınırına (${GUNLUK_YENI_SINIRI}) ulaşmış olabilirsin ya da bu sanatçıların görseli bulunamadı.</p></div>`,
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
    const eser = eserSec(eserler, son, d.rng);
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

function secenekDugmesi(deger, etiket, k, tur) {
  const cevap = tur === 'sanatci' ? k.cevapSanatci : k.cevapAkim;
  const dogruDeger = tur === 'sanatci' ? k.id : d.harita.get(k.id).akim;
  let sinif = 'secenek';
  if (cevap !== null) {
    if (deger === dogruDeger) sinif += ' dogru';
    else if (deger === cevap) sinif += ' yanlis';
    else sinif += ' soluk';
  }
  return `<button class="${sinif}" type="button" data-${tur}="${kacis(deger)}" ${cevap !== null ? 'disabled' : ''}>${etiket}</button>`;
}

function kartGoster(o) {
  const k = o.kart;
  const s = d.harita.get(k.id);
  const ot = o.oturum;
  const yuzde = Math.round((100 * ot.konum) / ot.toplam);
  const baslik = o.kip === 'karisik' ? 'Karışık' : o.akim === 'hepsi' ? 'Hepsi' : o.akim;
  const sanatciSecildi = k.cevapSanatci !== null;
  const ikinci = o.kip === 'karisik' && sanatciSecildi;
  const sanatciDogru = k.cevapSanatci === k.id;
  const akimDogru = k.cevapAkim === s.akim;

  let geriBildirim = '';
  if (k.bitti) {
    const tumDogru = o.kip === 'karisik' ? sanatciDogru && akimDogru : sanatciDogru;
    const sonucMetni = o.kip === 'karisik' ? `Sanatçı ${sanatciDogru ? '✓' : '✗'} · Akım ${akimDogru ? '✓' : '✗'}` : sanatciDogru ? '✓ Doğru' : '✗ Yanlış';
    const ipucu = s.taninma || s.kurs_notu || '';
    geriBildirim = `<section class="geri-bildirim yuzey" aria-live="polite">
      <p class="sonuc ${tumDogru ? 'dogru' : 'yanlis'}" data-test="sonuc">${sonucMetni}</p>
      <p><b>${kacis(s.ad)}</b> <span class="ikincil">(${kacis(yillarYaz(s))})</span><br>${kacis(s.akim)}</p>
      <p class="ikincil">${kacis(k.eser.baslik)}${k.eser.tarih ? ` · ${kacis(k.eser.tarih)}` : ''}</p>
      <p class="ikincil kucuk">${kacis(kaynakYazisi(k.eser))}</p>
      ${ipucu ? `<h3>${s.taninma ? 'Nasıl tanırım?' : 'Kurs notu'}</h3><p class="okuma">${kacis(ipucu)}</p>` : ''}
      <p><a href="#/sanatci/${encodeURIComponent(s.id)}">Sanatçı sayfası →</a></p>
    </section>`;
  }

  const sanatciEtiket = (id) => {
    const x = d.harita.get(id);
    return `${kacis(x.ad)}${sanatciSecildi ? ` <span class="ikincil kucuk">· ${kacis(yillarYaz(x))}</span>` : ''}`;
  };

  ciz(`${ust(baslik, '#/', {
    sag: `<span class="ikincil kucuk" data-test="sayac">${Math.min(ot.konum + 1, ot.toplam)} / ${ot.toplam}</span>`,
  })}
    <div class="ilerleme-cubuk" aria-hidden="true"><i style="width:${yuzde}%"></i></div>
    <button class="soru-resim" type="button" data-buyut aria-label="Görseli büyüt" style="margin-top:12px">
      <img alt="Soru görseli" src="${resimUrl(k.eser.dosya, 800)}" data-test="soru-resim">
      <span class="durum" data-durum>Yükleniyor…</span>
    </button>
    <p class="soru">Bu eser kimin?</p>
    <div class="secenekler" data-test="sanatci-secenekleri">${k.secenekler.map((id) => secenekDugmesi(id, sanatciEtiket(id), k, 'sanatci')).join('')}</div>
    ${
      ikinci
        ? `<p class="soru" id="akim-sorusu">Hangi akım?</p>
    <div class="secenekler" data-test="akim-secenekleri">${k.akimSecenekleri.map((a) => secenekDugmesi(a, kacis(a), k, 'akim')).join('')}</div>`
        : ''
    }
    ${geriBildirim}
    ${
      k.bitti
        ? `<div class="alt-cubuk"><button class="dugme birincil" type="button" data-sonraki>${ot.konum + 1 >= ot.toplam ? 'Turu bitir' : 'Sonraki kart →'}</button></div>`
        : '<div class="bosluk-alt"></div>'
    }`);

  const img = ekran.querySelector('[data-test="soru-resim"]');
  const durum = ekran.querySelector('[data-durum]');
  const yuklendi = () => (durum.hidden = true);
  if (img.complete && img.naturalWidth) yuklendi();
  img.addEventListener('load', yuklendi);
  img.addEventListener('error', () => {
    durum.innerHTML = 'Görsel yüklenemedi.';
    if (!k.bitti && k.cevapSanatci === null) baskaEser(o);
  });

  if (k.bitti) {
    const btn = ekran.querySelector('[data-sonraki]');
    btn.focus({ preventScroll: true });
    if (sanatciSecildi) ekran.querySelector('.geri-bildirim').scrollIntoView({ block: 'nearest' });
  } else if (ikinci) {
    document.getElementById('akim-sorusu').scrollIntoView({ block: 'center' });
  }

  // Sonraki kartı önceden hazırla, görselini yükle
  if (!o.sonrakiKart && ot.konum + 1 < ot.toplam) {
    o.sonrakiKart = kartHazirla(o, ot.konum + 1).then((h) => {
      if (h && h.eser) new Image().src = resimUrl(h.eser.dosya, 800);
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
    goruntuleyiciAc({ eserler: [k.eser], gizli: !k.bitti });
    return;
  }
  if (sb && o && o.kart && o.kart.cevapSanatci === null) {
    const k = o.kart;
    yeniSanatciSay(k.id, o.kip);
    k.cevapSanatci = sb.dataset.sanatci;
    const dogru = k.cevapSanatci === k.id;
    skor(k.id).sanatci = cevapla(skor(k.id).sanatci, dogru, bugun());
    baskaDeneme = 0;
    if (o.kip === 'donem') kartiBitir(o, dogru);
    else kaydet();
    kartGoster(o);
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
  ciz(`${ust('Tur bitti')}
    <div class="yuzey"><p class="sonuc ${ot.yanlis ? '' : 'dogru'}">${ot.dogru} / ${toplam} kart doğru</p>
    <p class="ikincil">${ot.yanlis ? 'Yanlış yaptıkların daha sık karşına çıkacak.' : 'Hepsi doğru — harika.'}</p></div>
    <div class="menu"><button class="dugme birincil" type="button" data-yeni-tur>Bir tur daha</button><a class="dugme" href="#/">Ana sayfa</a></div>`);
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
      return `<div class="cubuk-satir"><span>${kacis(a.ad)}</span><span class="cubuk" role="img" aria-label="${y === null ? 'veri yok' : '%' + y}"><i style="width:${y ?? 0}%"></i></span><span class="yuzde ikincil">${y === null ? '–' : '%' + y}</span></div>`;
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
  const html = `${ust('İlerleme')}
    <p class="ikincil">${k.size} / ${d.konular.length} konu işlendi · ${acikSanatcilar(d.sanatcilar, k).length} sanatçı açık · ${vade} tekrar bekliyor</p>
    <h2>Kurs konuları</h2>
    <p class="ikincil kucuk">Bir konuyu bitirince “işlendi” yap; o konunun sanatçıları açılır.</p>
    ${bolumler
      .map(
        (bl) => `<details class="bolum" data-bolum="${kacis(bl.bolum)}" ${d.acikBolumler.has(bl.bolum) ? 'open' : ''}>
      <summary>${kacis(bl.bolum)} · ${kacis(bl.ad)} <span class="ikincil kucuk">&nbsp;(${bl.konular.filter((x) => k.has(x.no)).length}/${bl.konular.length})</span></summary>
      <ul class="liste">${bl.konular
        .map(
          (
            x,
          ) => `<li><label class="konu"><span class="metin"><b>Konu ${x.no}</b> · ${kacis(x.baslik)}<br><span class="ikincil kucuk">${sayi(x.no) ? `${sayi(x.no)} sanatçı` : 'sanatçı yok'}</span></span>
        <input class="anahtar" type="checkbox" role="switch" data-konu="${x.no}" ${k.has(x.no) ? 'checked' : ''} aria-label="Konu ${x.no} işlendi"></label></li>`,
        )
        .join('')}</ul></details>`,
      )
      .join('')}
    <h2>Akımlara göre doğruluk</h2>
    ${akimSatirlari.length ? `<div class="liste">${akimSatirlari.join('')}</div>` : '<p class="ikincil">Henüz açık akım yok.</p>'}
    <h2>En zayıf sanatçılar</h2>
    ${
      zayiflar.length
        ? `<ul class="liste">${zayiflar
            .map(
              (x) =>
                `<li><a class="satir" href="#/sanatci/${encodeURIComponent(x.s.id)}"><span class="metin"><b>${kacis(x.s.ad)}</b><span class="ikincil kucuk">%${Math.round(100 * x.oran)} doğru · ${x.dg}/${x.tp} · kutu ${x.kutu}</span></span></a></li>`,
            )
            .join('')}</ul>`
        : '<p class="ikincil">Henüz zayıf sanatçı yok — biraz pekiştir.</p>'
    }`;
  if (!kaydirmayiKoru) return ciz(html);
  ekran.innerHTML = html;
  window.scrollTo(0, kaydirma);
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
    for (const e of eserler.slice(0, TEST_HAVUZU)) urller.push(resimUrl(e.dosya, 800));
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
  ciz(`${ust('Ayarlar')}
    <div class="yuzey" style="padding:0">
      <div class="ayar"><b id="kart-etiket">Günlük kart sayısı</b>
        <div class="adimlayici" role="group" aria-labelledby="kart-etiket">
          <button class="dugme" type="button" data-kart="-5" aria-label="Azalt">−</button>
          <output data-test="gunluk-kart">${a.gunlukKart}</output>
          <button class="dugme" type="button" data-kart="5" aria-label="Artır">+</button>
        </div>
        <p class="ikincil kucuk">Bir pekiştirme turundaki kart sayısı. Günde en fazla ${GUNLUK_YENI_SINIRI} yeni sanatçı eklenir.</p>
      </div>
      <div class="ayar"><b id="tema-etiket">Tema</b>
        <div class="parcali" role="radiogroup" aria-labelledby="tema-etiket">
          ${TEMALAR.map((t) => `<label><input type="radio" name="tema" value="${t}" ${a.tema === t ? 'checked' : ''}><span>${TEMA_AD[t]}</span></label>`).join('')}
        </div>
      </div>
      <div class="ayar"><b>Görselleri çevrimdışı indir</b>
        <p class="ikincil kucuk" id="indir-bilgi">Açık sanatçıların pekiştirme görselleri (sanatçı başına en fazla ${TEST_HAVUZU}) hesaplanıyor…</p>
        <button class="dugme" type="button" data-indir>İndir</button>
        <progress id="indir-cubuk" max="1" value="0" hidden></progress>
        <p class="mesaj" id="indir-mesaj" aria-live="polite"></p>
      </div>
      <div class="ayar"><b>Yedekle</b>
        <p class="ikincil kucuk">İlerlemen panoya kopyalanır ve aşağıda görünür. Notlar uygulamasına yapıştırıp sakla.</p>
        <button class="dugme" type="button" data-yedekle>Yedekle</button>
        <textarea id="yedek-cikti" readonly hidden aria-label="Yedek metni"></textarea>
        <p class="mesaj" id="yedek-mesaj" aria-live="polite"></p>
      </div>
      <div class="ayar"><b>Yedeği geri yükle</b>
        <p class="ikincil kucuk">Daha önce aldığın yedeği buraya yapıştır. Mevcut ilerlemenin yerine geçer.</p>
        <textarea id="yedek-girdi" aria-label="Geri yüklenecek yedek" placeholder='{"uygulama":"sanat-atlasi", …}'></textarea>
        <button class="dugme" type="button" data-geri-yukle>Geri yükle</button>
        <p class="mesaj" id="geri-mesaj" aria-live="polite"></p>
      </div>
    </div>
    <p class="ikincil kucuk" style="margin-top:16px">Sanat Atlası ${SURUM} · Görseller: Wikimedia Commons · Eser listeleri: Wikidata</p>`);
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
