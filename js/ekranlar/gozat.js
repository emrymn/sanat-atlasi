// Göz At: akımlar, sanatçı sayfası, bütün eserler, başyapıt okumaları, konular (ikonografi) ve yan yana karşılaştırma.
import { kacis, yillarYaz, bulunmaEki } from '../yardimci.js';
import { akimDurumlari } from '../kilit.js';
import { sanatciEserleri, eserBaslik } from '../eserler.js';
import { gorselUrl, gorselYedek, secilenGorsel } from '../gorsel.js';
import { goruntuleyiciAc } from '../goruntuleyici.js';
import { akimYuzyillari, ikon } from '../tasarim.js';
import { adParcala, bilinenAd } from '../adlar.js';
import { karsilastirmaAdresi, benzerSanatcilar } from '../karsilastir.js';
import { basyapitlariAl, basyapitBul, sanatcininBasyapitlari, eserEslestir } from '../basyapit.js';
import { konulariAl, konuBul, konuHaritasiniAyarla, kapakSec, TUR_AD, TUR_SIRA } from '../ikonografi.js';
import { seviyeKaydi, seviyeDurumu } from '../seviye.js';
import {
  jsonGetir,
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
} from './ortak.js';
import { donemCizelgesi, pekistirmedeMi, notBolumleri, seritUst, eserSeridi } from './bugun.js';
import { kimlikDoldur, akimUslubu, pekistirDugmesi, bolumBasligi } from './akim.js';
import { harfUygula, AKIM_HARFLERI } from '../harfler.js';
import { imzaGoster } from '../imza.js';
import { kunyeGoster } from '../kunye.js';

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
  const gruplar = [];
  for (const a of d.akimlar) {
    const l = liste.filter((b) => d.harita.get(b.sanatci).akim === a.ad);
    if (l.length) gruplar.push({ a, l });
  }
  ciz(`${gozAtUst('basyapitlar')}
    <p class="bolum-aciklama">${liste.length} yakın okuma: her eserde ne görüldüğü, kompozisyon, anlam ve önemi.</p>
    ${gruplar
      .map(
        ({ a, l }, gi) => `<section class="vitrin" style="--akim:${akimRenk(a.ad)};--g:${gi}">
      <h2 class="vitrin-bas"><span class="vitrin-ad">${kacis(a.ad)}</span><span class="vitrin-say">${l.length} eser</span></h2>
      <ul class="vitrin-serit" data-test="basyapit-listesi">${l
        .map((b, i) => {
          const s = d.harita.get(b.sanatci);
          const kilit = k.has(s.konu) ? '' : '<span class="vitrin-kilit">henüz kursta yok</span>';
          return `<li style="--i:${i}"><a class="vitrin-kart" href="${basyapitAdresi(b.anahtar)}"><span class="vitrin-resim" data-basyapit-kucuk="${kacis(b.anahtar)}"></span><span class="vitrin-yazi">${kilit}<b>${kacis(b.baslik)}</b><span>${kacis(bilinenAd(s.ad, d.kisaAdlar[s.id]))}${b.tarih ? ` · ${kacis(b.tarih)}` : ''}</span></span></a></li>`;
        })
        .join('')}</ul></section>`,
      )
      .join('')}`);
  for (const el of ekran.querySelectorAll('[data-basyapit-kucuk]')) {
    const b = basyapitBul(liste, el.dataset.basyapitKucuk);
    sanatciEserleri(d.harita.get(b.sanatci)).then((eserler) => {
      const e = eserEslestir(eserler, b);
      if (e && el.isConnected) el.innerHTML = kucukGorsel(e, 500);
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
  kutu.querySelector('[data-basyapit-buyut]').addEventListener('click', () => goruntuleyiciAc({ eserler: [e], notu: notuIcin(s.id), ...gorselTercihi() }));
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

export async function konuListesi() {
  gununRengi();
  ciz(`${gozAtUst('konular')}<p class="ikincil kucuk">Yükleniyor…</p>`);
  const liste = await ikonografiVeri();
  if (location.hash !== '#/konular') return;
  if (!liste.length) return ciz(`${gozAtUst('konular')}<p class="ikincil">Henüz konu yok.</p>`);
  const gruplar = TUR_SIRA.map((t) => ({ t, l: liste.filter((k) => k.tur === t) })).filter((g) => g.l.length);
  // İş 25: yazı yerine kart: konunun adı ve en ünlü resmi; dokununca konunun sayfası (hikâye ve öbür resimler)
  ciz(`${gozAtUst('konular')}
    <p class="bolum-aciklama">Resimlerde en sık işlenen ${liste.length} hikâye.</p>
    ${gruplar
      .map(
        ({ t, l }) => `<h2 class="konu-grup-bas"><span>${kacis(TUR_AD[t])}</span><small>${l.length}</small></h2>
      <ul class="konu-izgara" data-test="konu-listesi">${l
        .map(
          (k, i) =>
            `<li style="--i:${i % 8}"><a class="konu-kart" href="#/konu/${encodeURIComponent(k.id)}" data-konu-kart="${kacis(k.id)}"><span class="konu-kapak" data-konu-kapak></span><span class="konu-kart-yazi"><b>${kacis(k.ad)}</b><small>${k.eserler.length} eser</small></span></a></li>`,
        )
        .join('')}</ul>`,
      )
      .join('')}`);
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
  }
}

export async function konuSayfasi(kodlu) {
  const no = cizimNo();
  const k = konuBul(await ikonografiVeri(), decodeURIComponent(kodlu));
  if (!guncelMi(no)) return;
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
  if (!guncelMi(no)) return;
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
// Göz At'ın dört bölümü; sayfa değişince elmas işaret önceki bölümden kayarak gelir
const GOZAT_BOLUMLERI = [
  ['akimlar', 'Akımlar', '#/gozat', ''],
  ['basyapitlar', 'Başyapıtlar', '#/basyapitlar', 'basyapit-giris'],
  ['konular', 'Konular', '#/konular', 'konu-giris'],
  ['zaman', 'Zaman', '#/zaman', 'zaman-giris'],
];
let sonGozAtBolumu = 0;
export function gozAtUst(etkin) {
  const i = GOZAT_BOLUMLERI.findIndex(([id]) => id === etkin);
  const j = sonGozAtBolumu;
  sonGozAtBolumu = i;
  return `${ust('Göz At', '#/', { geriYok: true, ustEtiket: 'Galeri' })}
    <a class="arama-hapi" href="#/ara" data-test="arama-hapi">${ikon('ara', 18, 1.6)}<span>Sanatçı, eser, konu ara</span></a>
    <nav class="bolumler" aria-label="Göz At bölümleri" style="--i:${i};--j:${j}">${GOZAT_BOLUMLERI.map(
      ([id, ad, hash, test]) => `<a href="${hash}"${test ? ` data-test="${test}"` : ''}${id === etkin ? ' aria-current="page"' : ''}>${ad}</a>`,
    ).join('')}</nav>`;
}

export function gozAt() {
  const durumlar = akimDurumlari(d.akimlar, d.sanatcilar, islenen());
  gununRengi();
  const acikSayi = durumlar.filter((a) => a.acik).length;
  ciz(`${gozAtUst('akimlar')}
    <section class="gz-perde" aria-label="Galeri girişi">
      <div class="gz-serit" aria-hidden="true"><div class="gz-serit-ic" data-gz-serit></div></div>
      <div class="gz-perde-yazi">
        <span class="etiket vurgu">Sanat tarihi koridoru</span>
        <p class="gz-perde-baslik">${durumlar.length} akım, <em>yedi yüzyıl</em></p>
        <p class="gz-perde-alt">${acikSayi} salon açık · soluk olanlar ilgili konu işlenince açılır</p>
      </div>
    </section>
    <ol class="zaman">${durumlar
      .map((a, i) => {
        const uyeler = d.sanatcilar.filter((x) => x.akim === a.ad);
        const ic = `<span class="zaman-fon" data-zaman-fon aria-hidden="true"></span><span class="zaman-sira" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
          <span class="etiket vurgu">${akimNoktasi(a.ad)}${kacis(akimYuzyillari(uyeler, { roma: true }))}</span><b>${kacis(a.ad)}</b>
          <span class="sayi">${a.acik ? `${a.acikSayisi} / ${a.toplam} sanatçı açık` : `<span class="kilit-notu">${ikon('kilit', 14)}Konu ${bulunmaEki(a.acilacagiKonu)} açılır</span>`}</span>
          ${a.acik ? `<span class="zaman-doluluk" role="img" aria-label="%${Math.round((100 * a.acikSayisi) / (a.toplam || 1))} açık"><i style="--y:${Math.round((100 * a.acikSayisi) / (a.toplam || 1))}%"></i></span>` : ''}
          <span class="onizleme" data-onizleme="${kacis(a.ad)}"></span>
          ${a.acik ? `<span class="zaman-ok" aria-hidden="true">${ikon('ileri', 18, 1.6)}</span>` : ''}`;
        return `<li class="zaman-oge${a.acik ? '' : ' kilitli'}" style="--i:${i};--akim:${akimRenk(a.ad)}">${
          a.acik ? `<a class="zaman-kart" href="#/akim/${encodeURIComponent(a.ad)}">${ic}</a>` : `<div class="zaman-kart" aria-disabled="true">${ic}</div>`
        }</li>`;
      })
      .join('')}</ol>`);
  onizlemeleriDoldur();
}

// Her akıma 3 çerçeveli küçük eser (açık sanatçılar önce); ilk eser kartın arka planı olur,
// açık akımların ilk eserleri üstteki sonsuz şeride dizilir
function onizlemeleriDoldur() {
  const k = islenen();
  const no = cizimNo();
  const seritIcin = [];
  const sozler = [];
  for (const el of ekran.querySelectorAll('[data-onizleme]')) {
    // Eseri olmayan (ör. mimar/heykeltıraş) sanatçılar atlanır; ilk 3 eserli sanatçı gösterilir
    const uyeler = d.sanatcilar
      .filter((x) => x.akim === el.dataset.onizleme)
      .sort((a, b) => Number(k.has(b.konu)) - Number(k.has(a.konu)) || (a.dogum ?? 0) - (b.dogum ?? 0))
      .slice(0, 8);
    const acikMi = !el.closest('.kilitli');
    sozler.push(
      Promise.all(uyeler.map((x) => sanatciEserleri(x).catch(() => []))).then((listeler) => {
        if (!el.isConnected) return;
        const eserler = listeler.map(enBilinen).filter(Boolean).slice(0, 3);
        el.innerHTML = eserler.map((e, i) => cerceve(e, { genislik: 400, tembel: true }).replace('class="cerceve"', `class="cerceve" style="--j:${i}"`)).join('');
        const fon = el.closest('.zaman-kart')?.querySelector('[data-zaman-fon]');
        if (fon && eserler[0]) fon.innerHTML = kucukGorsel(eserler[0], 800);
        if (acikMi) seritIcin.push(...eserler.slice(0, 2));
      }),
    );
  }
  Promise.all(sozler).then(() => {
    const serit = ekran.querySelector('[data-gz-serit]');
    if (!serit || !guncelMi(no)) return;
    let l = seritIcin.length ? seritIcin : [];
    if (!l.length) return serit.closest('.gz-perde')?.classList.add('seritsiz');
    while (l.length < 8) l = l.concat(l);
    const kare = (e, i) => `<span class="gz-kare" style="--j:${i % 4}">${kucukGorsel(e, 400)}</span>`;
    serit.innerHTML = l.map(kare).join('') + l.map(kare).join('');
    serit.style.setProperty('--n', l.length);
    serit.classList.add('hazir');
  });
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
  kutu.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-eser]');
    if (b) goruntuleyiciAc({ eserler, baslangic: Number(b.dataset.eser), notu: notuIcin(s.id), ...gorselTercihi() });
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
        return `<button class="kars-eser" type="button" data-kars-eser="${j}" aria-label="${kacis(eserBaslik(e))} — büyüt"><img decoding="async" alt="" src="${kacis(gorselUrl(g, 400))}" data-yedek="${kacis(gorselYedek(g))}"><span class="eser-yazi">${kacis(eserBaslik(e))}${e.tarih ? ` <small>· ${kacis(e.tarih)}</small>` : ''}</span></button>`;
      })
      .join('');
    kutu.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-kars-eser]');
      if (btn) goruntuleyiciAc({ eserler, baslangic: Number(btn.dataset.karsEser), notu: notuIcin(s.id), ...gorselTercihi() });
    });
  });
}
