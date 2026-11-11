// Göz At: akımlar, sanatçı sayfası, bütün eserler, başyapıt okumaları, konular (ikonografi) ve yan yana karşılaştırma.
import { kacis, yillarYaz, bulunmaEki } from '../yardimci.js';
import { akimDurumlari } from '../kilit.js';
import { sanatciEserleri, eserBaslik } from '../eserler.js';
import { gorselUrl, gorselYedek, secilenGorsel } from '../gorsel.js';
import { goruntuleyiciAc } from '../goruntuleyici.js';
import { akimYuzyillari, ikon, yuzyil, roma } from '../tasarim.js';
import { adParcala, bilinenAd } from '../adlar.js';
import { karsilastirmaAdresi, benzerSanatcilar } from '../karsilastir.js';
import { basyapitlariAl, basyapitBul, sanatcininBasyapitlari, eserEslestir } from '../basyapit.js';
import { ayrintilariAl, ayrintiBul, eserinAyrintisi } from '../ayrinti.js';
import { hikayeHtml } from '../hikaye.js';
import { enCokKarisanlar } from '../ogrenme.js';
import { akimKarsilastirmaAdresi } from '../akim.js';
import { konulariAl, konuBul, konuHaritasiniAyarla, kapakSec, TUR_AD, TUR_SIRA } from '../ikonografi.js';
import { seviyeKaydi, seviyeDurumu } from '../seviye.js';
import {
  jsonGetir,
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
import { hareketAz } from '../gecis.js';

// ---------- Başyapıt yakın okumaları ----------
let basyapitSozu = null;
export function basyapitVeri() {
  if (!basyapitSozu)
    basyapitSozu = jsonGetir('data/basyapitlar.json')
      .catch(() => null)
      .then((j) => basyapitlariAl(j, (id) => d.harita.has(id)));
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
    h ? `<span class="eser-rozet" role="img" aria-label="Hikâyesi var">${ikon('kitap', 14, 1.8)}${uzun ? '<span aria-hidden="true">Hikâye</span>' : ''}</span>` : ''
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

export async function basyapitListesi() {
  gununRengi();
  ciz(`${gozAtUst('basyapitlar')}<p class="ikincil kucuk">Yükleniyor…</p>`);
  const liste = await basyapitVeri();
  if (location.hash !== '#/basyapitlar') return;
  if (!liste.length) return ciz(`${gozAtUst('basyapitlar')}<p class="ikincil">Henüz yakın okuma yok.</p>`);
  const k = islenen();
  // İş 56: 29 akım satırı (çoğunda 1–3 eser) yerine haritanın 9 dönemi; kartta akımın adı ve rengi. Sayfa ~14 ekrandan ~5'e.
  const gruplar = [];
  for (const bolge of BOLGELER) {
    const akimlar = d.akimlar.filter((a) => bolgeBul(a.sira).id === bolge.id);
    const l = akimlar.flatMap((a) => liste.filter((b) => d.harita.get(b.sanatci).akim === a.ad));
    if (l.length) gruplar.push({ bolge, a: akimlar[0], l });
  }
  ciz(`${gozAtUst('basyapitlar')}
    <p class="bolum-aciklama">${liste.length} yakın okuma: her eserde ne görüldüğü, kompozisyon, anlam ve önemi.</p>
    ${gruplar
      .map(
        ({ bolge, a, l }, gi) => `<section class="vitrin" style="--akim:${akimRenk(a.ad)};--g:${gi}" data-gozcu>
      <header class="bsy-bas"><span class="bsy-no" aria-hidden="true">${ROMA[gi] || gi + 1}</span><h2 class="vitrin-bas"><span class="vitrin-ad">${kacis(bolge.ad)}<small class="vitrin-yuzyil">${kacis(bolge.yuzyil)}</small></span><span class="vitrin-say">${l.length} eser</span></h2><span class="bsy-cizgi" aria-hidden="true"></span></header>
      <ul class="vitrin-serit" data-test="basyapit-listesi">${l
        .map((b, i) => {
          const s = d.harita.get(b.sanatci);
          const kilit = k.has(s.konu) ? '' : '<span class="vitrin-kilit">henüz kursta yok</span>';
          return `<li style="--i:${i}"><a class="vitrin-kart" href="${basyapitAdresi(b.anahtar)}" style="--akim:${akimRenk(s.akim)}"><span class="bsy-cerceve">${kilit}<span class="vitrin-resim" data-basyapit-kucuk="${kacis(b.anahtar)}"></span></span><span class="vitrin-yazi"><b>${kacis(b.baslik)}</b><span>${kacis(bilinenAd(s.ad, d.kisaAdlar[s.id]))}${b.tarih ? ` · ${kacis(b.tarih)}` : ''}</span><small class="vitrin-akim">${kacis(s.akim)}</small></span></a></li>`;
        })
        .join('')}</ul></section>`,
      )
      .join('')}`);
  gorunceOynat();
  for (const el of ekran.querySelectorAll('[data-basyapit-kucuk]')) {
    const b = basyapitBul(liste, el.dataset.basyapitKucuk);
    sanatciEserleri(d.harita.get(b.sanatci)).then((eserler) => {
      const e = eserEslestir(eserler, b);
      if (e && el.isConnected) el.innerHTML = kucukGorsel(e, 500);
      if (e) rozetleriEkle([el.closest('.bsy-cerceve') || el], [e]);
    });
  }
}

export async function basyapitSayfasi(kodlu) {
  const anahtar = decodeURIComponent(kodlu);
  const no = cizimNo();
  const b = basyapitBul(await basyapitVeri(), anahtar);
  if (!guncelMi(no)) return;
  if (!b) return hataGoster(new Error('Bu eser için yakın okuma bulunamadı.'));
  const s = d.harita.get(b.sanatci);
  const eserSozu = sanatciEserleri(s).then((l) => eserEslestir(l, b));
  const ayrintiSoz = ayrintiVeri();
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
  if (!kutu || !guncelMi(no)) return;
  const g = e && secilenGorsel(e, kotuler());
  if (!g) {
    kutu.innerHTML = '<p class="ikincil kucuk">Bu eserin görseli bulunamadı.</p>';
    return;
  }
  kutu.innerHTML = `<button class="basyapit-buyut" type="button" data-basyapit-buyut aria-label="${kacis(b.baslik)} — büyüt"><img decoding="async" alt="${kacis(`${s.ad}, ${b.baslik}`)}" src="${kacis(gorselUrl(g, 1200))}" data-yedek="${kacis(gorselYedek(g))}"></button>`;
  // İş 151: kayıt varsa görselin altında "Rehberli inceleme · N nokta" (görüntüleyici doğrudan inceleme kipinde açılır)
  const liste = await ayrintiSoz;
  if (!guncelMi(no)) return;
  const kayit = ayrintiBul(liste, b.anahtar) || eserinAyrintisi(liste, e);
  const ayrintilar = kayit ? () => kayit : null;
  kutu.querySelector('[data-basyapit-buyut]').addEventListener('click', () => goruntuleyiciAc({ eserler: [e], notu: notuIcin(s.id), ayrintilar, ...gorselTercihi() }));
  // İş 169: eserin hikâyesi varsa görselin altında sayfada da
  hikayeVeri().then(() => {
    const h = guncelMi(no) && hikayeBulucu(e);
    if (h && !ekran.querySelector('.basyapit-hikaye')) kutu.insertAdjacentHTML('afterend', `<section class="bolum basyapit-hikaye" data-test="basyapit-hikaye">${etiket('Hikâyesi', { vurgu: true })}<div class="okuma">${hikayeHtml(h, kacis)}</div></section>`);
  });
  if (kayit) {
    kutu.insertAdjacentHTML('beforeend', `<button class="basyapit-incele" type="button" data-test="basyapit-incele">${ikon('ara', 18)}Rehberli inceleme · ${kayit.noktalar.length} nokta</button>`);
    kutu.querySelector('[data-test="basyapit-incele"]').addEventListener('click', () => goruntuleyiciAc({ eserler: [e], notu: notuIcin(s.id), ayrintilar, incelemeyeBasla: true, ...gorselTercihi() }));
  }
}

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

// Konular (İş 55): 223 kart tek sayfada ~40 ekran boyuydu. Ana sayfada her grubun en çok işlenen 6 konusu ve
// "hepsi" bağlantısı; grubun bütün konuları kendi sayfasında (#/konular/<tür>). Üstte gruplar arası şerit.
const KONU_ONIZLEME = 6;

function konuKartlari(l) {
  return `<ul class="konu-izgara" data-test="konu-listesi">${l
    .map(
      (k, i) =>
        `<li style="--i:${i % 3}" data-gozcu><span class="konu-deste" aria-hidden="true" data-konu-deste></span><a class="konu-kart" href="#/konu/${encodeURIComponent(k.id)}" data-konu-kart="${kacis(k.id)}"><span class="konu-kapak" data-konu-kapak></span><span class="konu-kart-yazi"><b>${kacis(k.ad)}</b><small>${k.eserler.length} eser</small></span></a></li>`,
    )
    .join('')}</ul>`;
}

const ROMA = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

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

function konuGrupSeridi(gruplar, etkin = null) {
  return `<nav class="konu-grup-serit" aria-label="Konu grupları" data-test="konu-grup-serit">${gruplar
    .map(({ t, l }) => `<a href="#/konular/${t}"${t === etkin ? ' aria-current="page"' : ''}>${kacis(TUR_AD[t])}<small>${l.length}</small></a>`)
    .join('')}</nav>`;
}

async function konuGruplari() {
  const liste = await ikonografiVeri();
  return { liste, gruplar: TUR_SIRA.map((t) => ({ t, l: liste.filter((k) => k.tur === t) })).filter((g) => g.l.length) };
}

export async function konuListesi() {
  gununRengi();
  ciz(`${gozAtUst('konular')}<p class="ikincil kucuk">Yükleniyor…</p>`);
  const { liste, gruplar } = await konuGruplari();
  if (location.hash !== '#/konular') return;
  if (!liste.length) return ciz(`${gozAtUst('konular')}<p class="ikincil">Henüz konu yok.</p>`);
  // İş 25: yazı yerine kart: konunun adı ve en ünlü resmi; dokununca konunun sayfası (hikâye ve öbür resimler)
  ciz(`${gozAtUst('konular')}
    <p class="bolum-aciklama">Resimlerde en sık işlenen ${liste.length} hikâye.</p>
    ${konuGrupSeridi(gruplar)}
    ${gruplar
      .map(
        ({ t, l }) => `<section class="konu-grup" data-gozcu><h2 class="konu-grup-bas"><span>${kacis(TUR_AD[t])}</span><small>${l.length}</small></h2>
      ${konuKartlari(l.slice(0, KONU_ONIZLEME))}
      ${l.length > KONU_ONIZLEME ? `<a class="konu-hepsi" href="#/konular/${t}" data-test="konu-hepsi">${kacis(TUR_AD[t])} · ${l.length} konunun hepsi${ikon('ileri', 18, 1.6)}</a>` : ''}</section>`,
      )
      .join('')}`);
  gorunceOynat();
  konuKapaklariniDoldur(liste);
}

// Bir grubun bütün konuları (İş 55)
export async function konuGrubu(t) {
  gununRengi();
  if (!TUR_AD[t]) return hataGoster(new Error('Bu konu grubu bulunamadı.'));
  ciz(`${ust(TUR_AD[t], '#/konular', { ustEtiket: 'Konular' })}<p class="ikincil kucuk">Yükleniyor…</p>`);
  const adres = location.hash;
  const { liste, gruplar } = await konuGruplari();
  if (location.hash !== adres) return;
  const g = gruplar.find((x) => x.t === t);
  ciz(`${ust(TUR_AD[t], '#/konular', { ustEtiket: 'Konular' })}
    ${konuGrupSeridi(gruplar, t)}
    <p class="bolum-aciklama">${g ? `${g.l.length} konu, en çok işlenenden aza.` : 'Bu grupta konu yok.'}</p>
    ${g ? konuKartlari(g.l) : ''}`);
  gorunceOynat();
  konuKapaklariniDoldur(liste);
}

// Kapaklar: her konunun eserleri arasında en ünlüsü (kapakSec). Sanatçıların eser listeleri bir kez yüklenir.
async function konuKapaklariniDoldur(liste) {
  const no = cizimNo();
  const sanatcilar = [...new Set(liste.flatMap((k) => k.eserler.map((x) => x[1])))];
  const listeler = new Map(await Promise.all(sanatcilar.map(async (sid) => [sid, await sanatciEserleri(d.harita.get(sid)).catch(() => [])])));
  if (!guncelMi(no)) return;
  const kotu = kotuler();
  for (const k of liste) {
    const kart = ekran.querySelector(`[data-konu-kart="${CSS.escape(k.id)}"]`);
    if (!kart) continue;
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
    kutu.innerHTML = `<img loading="lazy" decoding="async" data-kapak="${kacis(e.qid || `${e.sid}|${e.baslik}`)}" alt="${kacis(`${s ? s.ad : ''}, ${eserBaslik(e)}`)}" src="${kacis(gorselUrl(g, 400))}" data-yedek="${kacis(gorselYedek(g))}">`;
    odagaKaydir(kutu, g); // İş 143: kapak da yüzün çevresinden kırpılır (Astra'nın önerisi)
    const deste = kart.parentElement && kart.parentElement.querySelector('[data-konu-deste]');
    if (deste) deste.innerHTML = desteSec(adaylar, e)
      .map((x) => {
        const xg = secilenGorsel(x, kotu) || x.gorseller[0];
        return `<i><img loading="lazy" decoding="async" alt="" src="${kacis(gorselUrl(xg, 300))}" data-yedek="${kacis(gorselYedek(xg))}"></i>`;
      })
      .join('');
  }
}

// Kapağın arkasındaki iki resim: önce başka ressamlardan, yetmezse aynı ressamın başka eserlerinden
function desteSec(adaylar, kapak) {
  const kalan = adaylar.filter((x) => x !== kapak);
  const secim = [];
  const ressamlar = new Set([kapak.sid]);
  for (const x of kalan) if (secim.length < 2 && !ressamlar.has(x.sid)) secim.push(x), ressamlar.add(x.sid);
  for (const x of kalan) if (secim.length < 2 && !secim.includes(x)) secim.push(x);
  return secim;
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
        <div class="konu-metin" id="konu-metin" data-konu-metin>${ilkParagraf ? `<p class="okuma konu-ilk">${kacis(ilkParagraf)}</p>` : ''}${k.hikaye.slice(1).map((p, i) => `<p class="okuma" style="--i:${Math.min(i, 6)}">${kacis(p)}</p>`).join('')}</div>
        <button class="konu-uzat" type="button" data-konu-uzat aria-expanded="false" aria-controls="konu-metin" hidden><span>Devamını oku</span>${ikon('asagi', 18, 1.8)}</button></section>
      ${k.tanima.length ? `<section class="konu-bolum" data-gozcu>${etiket('Resimde nasıl tanınır?', { vurgu: true })}<ul class="konu-ipuclari">${k.tanima.map((x, i) => `<li style="--i:${i}">${ikon('ara', 18, 1.6)}<span>${kacis(x)}</span></li>`).join('')}</ul></section>` : ''}
      <section class="konu-bolum konu-yol" data-gozcu>${etiket(`Aynı hikâye, ${k.eserler.length} kez`)}<p class="konu-yol-not">Zaman sırasıyla; kaydır, dokunup büyüt.</p>
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
  const gorAc = (i) => goruntuleyiciAc({ eserler, baslangic: i, notu: (e) => notuIcin(e.sid)(e), ayrintilar: ayrintiBulucu, ...gorselTercihi() });
  const galeriDugme = ekran.querySelector('[data-konu-galeri-ac]');
  if (galeriDugme) {
    galeriDugme.disabled = false;
    galeriDugme.querySelector('[data-konu-sayi]').textContent = eserler.length;
    galeriDugme.addEventListener('click', () => konuGalerisiAc(k.ad, eserler, gorAc, galeriDugme));
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
  sahne.querySelector('[data-konu-sahne-resim]').innerHTML = `<img decoding="async" alt="${kacis(`${s ? s.ad : ''}, ${eserBaslik(e)}`)}" src="${kacis(gorselUrl(g, 1000))}" data-yedek="${kacis(gorselYedek(g))}">`;
  sahne.querySelector('[data-konu-sahne-yazi]').textContent = `${s ? bilinenAd(s.ad, d.kisaAdlar[s.id]) : ''} · ${eserBaslik(e)}${e.tarih ? `, ${e.tarih}` : ''}`;
  const img = sahne.querySelector('img');
  const ac = () => sahne.classList.add('acik');
  if (img.complete && img.naturalWidth) ac();
  else img.addEventListener('load', ac, { once: true }), img.addEventListener('error', () => sahne.classList.add('bos'), { once: true });
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
export function gozAtUst(etkin) {
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
  return `<div class="gz-ust" data-test="gz-ust">${ust('Galeri', '#/', { geriYok: true, sag: arama })}
    <nav class="bolumler${sinif}" aria-label="Galeri bölümleri" data-test="gz-bolumler"${suruyor && gecen > 0 ? ` style="--gec:-${gecen}ms"` : ''}>${GOZAT_BOLUMLERI.map(
      ([id, ad, hash, test, ik, alt], n) =>
        `<a href="${hash}" data-test="${test}"${id === etkin ? ' aria-current="page"' : ''}${n === j && j !== i ? ' class="kapanan"' : ''}>${ikon(ik, 20, 1.6)}<span class="bolum-yazi"><b>${ad}</b><small>${alt}</small></span></a>`,
    ).join('')}</nav></div>`;
}

// 1.76.3 (Emre): Galeri'nin ana ekranı = yeni üst bölüm (haplar) + Akımlar çarkı + bütün akımların dizini.
// Başyapıtlar rafı ve Müze planı kalktı: Başyapıtlar, Konular ve Zaman haplarda; Koleksiyon aramanın yanındaki kalpte;
// Karşılaştır Çalış'ta (Başka turlar).
const CARK_ADIM = 21; // çarkta iki akım arası açı (derece)
const CARK_R = 320; // çarkın yarıçapı (px)
let carkSon = 0; // son bakılan akım: Galeri'ye dönünce çark orada durur

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
            <span class="sayi">${a.acik ? `${a.acikSayisi} / ${a.toplam} sanatçı açık` : `<span class="kilit-notu">${ikon('kilit', 14)}Konu ${bulunmaEki(a.acilacagiKonu)} açılır</span>`}</span>
            <span class="onizleme" data-onizleme="${kacis(a.ad)}"></span>
            ${a.acik ? `<span class="cark-gir" aria-hidden="true">Salona gir${ikon('ileri', 16, 1.8)}</span>` : ''}
          </span>`;
          return `<li class="cark-oge${a.acik ? '' : ' kilitli'}" style="--i:${i};--akim:${akimRenk(a.ad)}">${
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
      <div class="gz-plan-bas"><span class="etiket vurgu">Bütün akımlar</span><small>zaman sırasıyla</small></div>
      <ol>${durumlar
        .map((a, i) => {
          const yy = akimYuzyillari(
            d.sanatcilar.filter((x) => x.akim === a.ad),
            { roma: true },
          );
          const ic = `<span class="akim-dizin-no" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
            <span class="akim-dizin-yazi"><b>${kacis(a.ad)}</b><small>${kacis(yy)} · ${a.acik ? `${a.acikSayisi} / ${a.toplam} sanatçı açık` : `Konu ${bulunmaEki(a.acilacagiKonu)} açılır`}</small></span>
            ${ikon(a.acik ? 'ileri' : 'kilit', 16, 1.8)}`;
          return `<li style="--i:${i};--akim:${akimRenk(a.ad)}">${
            a.acik ? `<a class="akim-dizin-satir" href="#/akim/${encodeURIComponent(a.ad)}" data-test="akim-dizin-satir">${ic}</a>` : `<div class="akim-dizin-satir kilitli" aria-disabled="true" data-test="akim-dizin-satir">${ic}</div>`
          }</li>`;
        })
        .join('')}</ol>
    </section>`);
  onizlemeleriDoldur();
  carkKur();
  gorunceOynat();
}

// İş 171: Karşılaştır kısayolu. En çok karıştırılan iki sanatçı varsa onlar; yoksa açık ilk iki akım.
// Dönen: { href, alt, eserler: () => Promise<[eser, eser]> }. Çalış'taki "Karşılaştır" karosu kullanır (soruTurlari.js).
export function karsilastirSecimi() {
  const [ilk] = enCokKarisanlar(d.ilerleme.karisanlar || {}, { adet: 1, esik: 1, varMi: (id) => d.harita.has(id) });
  const ad = (id) => kacis(bilinenAd(d.harita.get(id).ad, d.kisaAdlar[id]));
  const sanatcininki = (s) => sanatciEserleri(s).then(enBilinen).catch(() => null);
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
      const gorunur = Math.abs(a) <= 66;
      el.style.visibility = gorunur ? 'visible' : 'hidden';
      if (!gorunur) return;
      el.style.transform = `rotate(${a.toFixed(2)}deg) translateY(${-(CARK_R + 40)}px)`;
      el.style.opacity = (1 - Math.max(0, Math.abs(a) - 30) / 36).toFixed(2);
      el.classList.toggle('secili', Math.abs(i - p) < 0.5);
    });
    halka.style.transform = `rotate(${(-(p * CARK_ADIM)).toFixed(2)}deg)`;
    const sira = Math.round(p);
    if (sira !== sonNo) {
      sonNo = sira;
      carkSon = sira;
      no.textContent = String(sira + 1).padStart(2, '0');
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
    const kayma = Math.round(((Math.asin(sin) * 180) / Math.PI) / CARK_ADIM);
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
    const uyeler = d.sanatcilar
      .filter((x) => x.akim === el.dataset.onizleme)
      .sort((a, b) => Number(k.has(b.konu)) - Number(k.has(a.konu)) || (a.dogum ?? 0) - (b.dogum ?? 0))
      .slice(0, 8);
    // İş 143: sayfa belleğe alınmış olsa da (yükleme sürerken başka sekmeye geçildi) doldurulur; dönünce boş kalmasın
    Promise.all(uyeler.map((x) => sanatciEserleri(x).catch(() => []))).then((listeler) => {
      const eserler = listeler.map(enBilinen).filter(Boolean).slice(0, 3);
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
  ciz(`${ust(ad, '#/gozat', { ustEtiket: akimYuzyillari(uyeler, { roma: true }) })}
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
