// Bugün: sayımlar, ana sayfa (sahne), yedek hatırlatması ve Günün sanatçısı sayfası.
import { kacis } from '../yardimci.js';
import { vadesiGeldiMi, GUNLUK_YENI_SINIRI } from '../leitner.js';
import { turOzeti, turAltYazisi } from '../oturum.js';
import { sanatciEserleri, eserBaslik } from '../eserler.js';
import { gorselUrl, gorselYedek, secilenGorsel } from '../gorsel.js';
import { baskaSanatci } from '../gunun.js';
import { gunlukGuncelle, yedekMetni, yedekHatirlatmasi } from '../depo.js';
import { goruntuleyiciAc } from '../goruntuleyici.js';
import { ikon } from '../tasarim.js';
import { bilinenAd } from '../adlar.js';
import { karistir, hsl, hsldenHex } from '../renk.js';
import {
  acikListe,
  bugun,
  d,
  taninma,
  etiket,
  isimHtml,
  kunye,
  paletHtml,
  bilinirlikSirasi,
  ekran,
  notuIcin,
  gorselTercihi,
  gununId,
  ciz,
  ekranRengi,
  enBilinen,
  kucukGorsel,
  kaydet,
  git,
  gununEseri,
  akimRenk,
  kotuler,
  jsonGetir,
  islenen,
  hataGoster,
  geriDugmesi,
  gununHavuzu,
  skor,
  bildir,
  cizimNo,
  guncelMi,
  eserKareleriDoldur,
} from './ortak.js';
import { devamKarti } from './pekistir.js';
import { SURUM } from '../surum.js';
import { gosterilecekler, yenilikYazisi } from '../yenilikler.js';
import { egimBaslat } from '../egim.js';

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

// Turda kaç kart gelecek (D1): oturumKur'un seçeceği kartların sayısı ve türleri; her yerde bu sayı gösterilir.
// Eser listesi henüz bilinmeyen (önbellekte ve kursta eseri olmayan) sanatçılar sayılır; görselsiz çıkarlarsa tur biraz kısalır.
export function turBilgisi(kip = 'karisik', akim = null) {
  const adaylar = acikListe().filter((s) => kip !== 'donem' || !akim || akim === 'hepsi' || s.akim === akim);
  const g = gunlukGuncelle(d.ilerleme, bugun());
  return turOzeti({
    adaylar,
    skorlar: d.ilerleme.skorlar,
    bugun: bugun(),
    adet: d.ilerleme.ayarlar.gunlukKart,
    yeniKota: GUNLUK_YENI_SINIRI - g.yeni,
    kip,
  });
}

// Bugünün turu: halka bugünkü kart ilerlemesini gösterir, ortasında kalan (ya da vadesi gelen) kart sayısı
function turKarti(tur, g) {
  const hedef = d.ilerleme.ayarlar.gunlukKart || 1;
  const oran = Math.min(100, Math.round((100 * g.kart) / hedef));
  const dk = Math.max(1, Math.round((tur.toplam * 20) / 60));
  const alt = tur.toplam ? `${turAltYazisi(tur)} · ~${dk} dk` : 'Bugünkü kartlar bitti';
  return `<a class="tur" href="#/pekistir/karisik" data-test="pekistir">
      <span class="tur-halka" aria-hidden="true">
        <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" pathLength="100"/><circle class="dolu" cx="32" cy="32" r="28" pathLength="100" style="--oran:${oran}"/></svg>
        <b data-test="tur-sayi">${tur.toplam}</b>
      </span>
      <span class="tur-yazi"><span class="etiket vurgu">Bugünün turu</span><b>${tur.toplam} kart</b><small data-test="tur-alt">${kacis(alt)}</small></span>
      ${ikon('ileri', 22, 1.5)}
    </a>`;
}

// Bugün sahnesi: tablo ekranı kaplar ve kaydırırken yerinde kalır; kaydırdıkça tabloya yaklaşılır
// (büyür, kararır) ve üstünden müze duvar etiketleri geçer. Tablonun önünde düğme yok; Pekiştir alt çubukta.
function sahneHtml(gs, { tekrar, tur, devam, g }) {
  const not = gs.kurs_notu || gs.anlatim;
  const tn = taninma(gs);
  const panel = (baslik, metin, italik) =>
    `<div class="sahne-panel"><div class="duvar-etiketi">${etiket(baslik, { vurgu: true })}<p class="okuma${italik ? ' italik' : ''}">${kacis(metin)}</p></div></div>`;
  return `<section class="sahne${devam ? ' devam-alti' : ''}" data-test="gunun-kart">
      <div class="bugun-kahraman sahne-yapiskan" data-gunun-gorsel>
        <span class="egim-isik" aria-hidden="true"></span>
        <div class="bugun-ust"><span class="etiket vurgu">Günün sanatçısı</span><span class="hap" data-test="tekrar">${tekrar}</span></div>
        <a class="sahne-isim isim-blok" href="#/gunun">${isimHtml(gs)}<p class="meta">${kunye(gs, { bag: false })}</p></a>
        <span class="kaydir-ipucu" aria-hidden="true">${ikon('asagi', 22, 1.4)}</span>
      </div>
      <div class="sahne-paneller">
        <div class="sahne-panel" data-sahne-bio hidden><div class="duvar-etiketi">${etiket('Hayatı', { vurgu: true })}<p class="okuma"></p></div></div>
        ${tn ? panel('Nasıl tanırım?', tn, false) : ''}
        ${not ? panel('Notlarımdan', not, true) : ''}
      </div>
    </section>`;
}

// Sahnenin altı: eserleri (Tümünü göster), resmin renkleri, hayatı ve dönemi
function gununHikayesi(gs, alt = '') {
  return `<section class="hikaye" data-test="hikaye" data-tablo-devami>
      <div class="susleme" aria-hidden="true"><span></span><i></i><span></span></div>
      <div data-ana-galeri-kutu>${etiket('Eserleri')}<div class="eserler" data-ana-galeri><p class="ikincil kucuk">Eserler yükleniyor…</p></div></div>
      <section class="bolum">${etiket('Resmin renkleri')}<div data-palet>${paletHtml(null)}</div></section>
      <a class="dugme ince" href="#/gunun">Hayatı ve dönemi ${ikon('ileri', 18, 1.5)}</a>
      ${alt}
    </section>`;
}

// Yatay eser şeridinin üstü: başlık ve "Tümünü göster" (şeridin sonuna kadar kaydırmak gerekmesin)
export function seritUst(s, n, baslik = 'Eserleri') {
  return `<div class="serit-ust">${etiket(`${baslik} · ${n}`)}<a class="tumunu-goster" href="#/sanatci/${encodeURIComponent(s.id)}/eserler" data-test="tumunu-goster">Tümünü göster ${ikon('ileri', 15, 1.7)}</a></div>`;
}

async function anaGaleriDoldur(gs) {
  const eserler = bilinirlikSirasi(await sanatciEserleri(gs));
  const galeri = ekran.querySelector('[data-ana-galeri]');
  if (!galeri) return;
  const kutu = galeri.parentElement;
  if (!eserler.length) {
    kutu.remove();
    return;
  }
  kutu.querySelector('.etiket').outerHTML = seritUst(gs, eserler.length);
  galeri.innerHTML = eserSeridi(eserler, 'galeri-eser', 'data-ana-eser');
  galeri.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-ana-eser]');
    if (b) goruntuleyiciAc({ eserler, baslangic: Number(b.dataset.anaEser), notu: notuIcin(gs.id), ...gorselTercihi() });
  });
}

export function anaSayfa() {
  d.yigin = ['#/'];
  const ist = istatistik();
  const g = gunlukGuncelle(d.ilerleme, bugun());
  const gs = d.harita.get(gununId());
  const tarih = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
  const tur = turBilgisi('karisik');
  const tekrar = kacis(tarih);
  const son = (d.ilerleme.sonCalisilanlar || []).map((id) => d.harita.get(id)).filter(Boolean);
  const devam = devamKarti();
  // en alt satırlar sahne varsa mozaiğin içinde kalır: tablonun renkleri sayfanın sonuna kadar sürer
  const alt = `${
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
    ${yenilikHtml()}
    ${yedekHatirlatHtml()}
    ${defterHtml(ist, g)}`;
  ciz(`
    <h1 class="ekran-disi" tabindex="-1">Sanat Atlası</h1>
    ${devam}
    ${
      gs
        ? sahneHtml(gs, { tekrar, tur, devam: !!devam, g })
        : `<header class="ust"><div class="ust-yazi">${etiket('Bugün', { vurgu: true })}<span class="hap" data-test="tekrar">${tekrar}</span></div></header>${turKarti(tur, g)}`
    }
    ${gs ? gununHikayesi(gs, alt) : alt}`);
  // uygulama açılışında bir kez: tablo perde açılır gibi belirir, isim satır satır gelir
  ekran.classList.toggle('perde', !d.perdeAcildi);
  d.perdeAcildi = true;
  if (gs) {
    // telefonu eğince tablo döner, ışık üstünden kayar (İş 32)
    egimBaslat(ekran.querySelector('[data-gunun-gorsel]'), d.ilerleme.ayarlar.egim !== false);
    gununKartGorseli(gs);
    sahneBiyografisi(gs);
    anaGaleriDoldur(gs);
    eserKareleriDoldur();
    etiketleriIsaretle();
  } else ekranRengi(null, null);
  for (const el of ekran.querySelectorAll('[data-mini]')) {
    sanatciEserleri(d.harita.get(el.dataset.mini)).then((eserler) => {
      const e = enBilinen(eserler);
      if (e && el.isConnected) el.innerHTML = kucukGorsel(e, 400);
    });
  }
}

// ---------- Günün defteri ----------
// Sayfanın sonunda üç müze etiketi: açık sanatçı, doğruluk ve günlük hedef halkası
function defterHtml(ist, g) {
  const hedef = d.ilerleme.ayarlar.gunlukKart;
  const oran = hedef ? Math.min(1, g.kart / hedef) : 0;
  const cevre = 2 * Math.PI * 15;
  return `<section class="defter" aria-label="Günün defteri">
      <a class="defter-hucre" href="#/ilerleme"><b data-test="acik-sayi">${ist.acik}</b><small>açık sanatçı</small></a>
      <a class="defter-hucre" href="#/ilerleme"><b>${ist.oran === null ? '—' : `%${ist.oran}`}</b><small>${ist.oran === null ? 'cevap yok' : 'doğru'}</small></a>
      <a class="defter-hucre defter-hedef" href="#/ayarlar" aria-label="Bugün ${g.kart} / ${hedef} kart, hedefi değiştir">
        <svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" class="iz"/><circle cx="18" cy="18" r="15" class="dolu" style="stroke-dasharray:${cevre};--bos:${cevre * (1 - oran)}"/></svg>
        <span><b>${g.kart}<i>/${hedef}</i></b><small>bugün</small></span>
      </a>
    </section>`;
}

// ---------- Yedek hatırlatması (İ3) ----------
// Yedek metni ekrana ya da panoya verildiği an "son yedek" bugündür (metnin içinde de bugünün tarihi olsun diye önce yazılır)
export function yedekTarihiYaz() {
  d.ilerleme.sonYedek = bugun();
  kaydet();
}

function yedekHatirlatHtml() {
  const h = yedekHatirlatmasi(d.ilerleme, bugun());
  if (!h) return '';
  const paylas = typeof navigator.share === 'function' ? '<button type="button" data-hizli-yedek="paylas">Paylaş</button>' : '';
  return `<p class="yedek-hatirlat" data-test="yedek-hatirlat" aria-live="polite"><span>${kacis(h.metin)}</span><button type="button" data-hizli-yedek="kopyala">Yedekle</button>${paylas}</p>`;
}

// ---------- Yenilikler (T4) ----------
// Sürüm değişince Bugün'de bir kez: not o oturum boyunca (kapatılana kadar) durur, sürüm hemen "görüldü" yazılır
function yenilikHtml() {
  if (d.yenilikNot === undefined) {
    const calismis = Object.keys(d.ilerleme.skorlar).length > 0 || Object.keys(d.ilerleme.gecmis || {}).length > 0;
    d.yenilikNot = gosterilecekler(d.ilerleme.sonSurum, SURUM, calismis);
    if (d.ilerleme.sonSurum !== SURUM) {
      d.ilerleme.sonSurum = SURUM;
      kaydet();
    }
  }
  if (!d.yenilikNot.length || d.yenilikKapali) return '';
  return `<div class="yenilik-not" data-test="yenilik-not"><div class="metin"><b>Yenilikler</b>${d.yenilikNot.map((x) => `<span>${kacis(yenilikYazisi(x))}</span>`).join('<br>')}</div><button class="yenilik-kapat" type="button" data-yenilik-kapat aria-label="Yenilikler notunu kapat">${ikon('kapat', 18, 1.7)}</button></div>`;
}

// ---------- Günün sanatçısı ----------
// Günün eseri: ekranın üstünü kenardan kenara kaplar; renkleri ekranın vurgusu olur
async function gununKartGorseli(s) {
  const eSozu = sanatciEserleri(s).then(gununEseri);
  ekranRengi(eSozu, akimRenk(s.akim), (p) => {
    const k = ekran.querySelector('[data-palet]');
    if (k) k.innerHTML = paletHtml(p);
    paletZemini(p);
  });
  const e = await eSozu;
  const kutu = ekran.querySelector('[data-gunun-gorsel]');
  if (!kutu || !e) return;
  const g = secilenGorsel(e, kotuler());
  const url = gorselUrl(g, 1200);
  kutu.insertAdjacentHTML(
    'afterbegin',
    `<img decoding="async" alt="${kacis(`${s.ad}, ${eserBaslik(e)}`)}" src="${kacis(url)}" data-yedek="${kacis(gorselYedek(g))}">`,
  );
}

// Sahnenin altı tablonun devamı gibi: resmin paletinden keskin kenarlı bloklar (Mondrian'vari mozaik).
// Her satırda iki blok; bölünme yeri iki rengin resimdeki paylarının oranı. Renkler zeminle karıştırılır, yazı okunur kalsın.
const MOZAIK_SATIRLARI = [22, 30, 26, 22]; // yüzde yükseklik
function paletZemini(p) {
  const kutu = ekran.querySelector('[data-tablo-devami]');
  if (!kutu || !p || !p.length) return;
  const zemin = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#0b0a0b';
  const koyu = hsl(zemin)[2] < 0.5;
  const ayarla = (r) => {
    const [h, sa, l] = hsl(r);
    // koyu temada açıklık %18–38 arası, açık temada en az %80
    return karistir(hsldenHex(h, Math.min(sa, 0.65), koyu ? Math.max(0.18, Math.min(l, 0.38)) : Math.max(l, 0.8)), zemin, 0.85);
  };
  const n = p.length;
  let y = 0;
  const katmanlar = MOZAIK_SATIRLARI.map((boy, i) => {
    const a = p[(2 * i + 1) % n];
    const b = p[(2 * i + (i % 2 ? 0 : 2)) % n];
    const bolum = Math.round(100 * Math.min(0.75, Math.max(0.25, a.pay / (a.pay + b.pay || 1))));
    // background-position yüzdesi kaydırma değil hizalamadır: üst kenarı y%'ye koymak için y / (100 - boy)
    const konum = boy >= 100 ? 0 : (100 * y) / (100 - boy);
    const k = `linear-gradient(90deg, ${ayarla(a.renk)} 0 ${bolum}%, ${ayarla(b.renk)} ${bolum}% 100%) 0 ${konum.toFixed(2)}% / 100% ${boy + 0.2}% no-repeat`;
    y += boy;
    return k;
  });
  kutu.style.setProperty('--palet-zemin', katmanlar.join(', '));
}

// Sahnede ilk duvar etiketi: biyografinin ilk cümleleri (veri gelince doldurulur, yoksa etiket kalkar)
async function sahneBiyografisi(gs) {
  const { biyografiler } = await ekVeriYukle();
  const kutu = ekran.querySelector('[data-sahne-bio]');
  if (!kutu) return;
  const bio = biyografiler.sanatcilar[gs.id];
  if (!bio || !bio.metin) return kutu.remove();
  kutu.querySelector('.okuma').textContent = bio.metin;
  kutu.hidden = false;
  etiketleriIsaretle();
}

// Duvar etiketlerinde metin sığmıyorsa etiket dokunulabilir olur; dokununca tamamı açılır, yine dokununca kısalır
function etiketleriIsaretle() {
  for (const el of ekran.querySelectorAll('.duvar-etiketi')) {
    const p = el.querySelector('.okuma');
    if (!p || el.classList.contains('acik') || el.closest('[hidden]')) continue;
    const kesik = p.scrollHeight > p.clientHeight + 2;
    el.classList.toggle('kesik', kesik);
    if (kesik) {
      el.setAttribute('role', 'button');
      el.tabIndex = 0;
      el.setAttribute('aria-expanded', 'false');
    }
  }
}
function etiketiCevir(el) {
  const acik = el.classList.toggle('acik');
  el.setAttribute('aria-expanded', String(acik));
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

export function pekistirmedeMi(s) {
  return acikListe().some((x) => x.id === s.id);
}

// Dönem: önceki ← bu akım → sonraki (Göz At'taki zaman sırası); üç sütun, ortadaki vurgu renginde
export function donemCizelgesi(akim) {
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
export function eserSeridi(eserler, sinif, veri) {
  return eserler
    .map((e, i) => {
      const g = secilenGorsel(e, kotuler()) || e.gorseller[0];
      if (!g) return '';
      return `<button class="${sinif}" type="button" ${veri}="${i}" aria-label="${kacis(eserBaslik(e))} — büyüt">
      <img ${i > 3 ? 'loading="lazy" ' : ''}decoding="async" alt="" src="${kacis(gorselUrl(g, 400))}" data-yedek="${kacis(gorselYedek(g))}"><span class="eser-yazi">${kacis(eserBaslik(e))}${e.tarih ? ` <small>· ${kacis(e.tarih)}</small>` : ''}</span></button>`;
    })
    .join('');
}

export function notBolumleri(s) {
  const not = s.kurs_notu || s.anlatim;
  return `${not ? `<section class="bolum">${etiket('Notlarımdan', { vurgu: true })}<p class="okuma italik">${kacis(not)}</p></section>` : ''}
    ${taninma(s) ? `<section class="bolum">${etiket('Nasıl tanırım?')}<p class="okuma" data-test="taninma">${kacis(taninma(s))}</p></section>` : ''}`;
}

export async function gununSayfasi(id) {
  const bugunku = gununId();
  const s = d.harita.get(id || bugunku);
  if (!s) return hataGoster(new Error('Sanatçı bulunamadı.'));
  const no = cizimNo();
  const eserSozu = sanatciEserleri(s);
  ekranRengi(eserSozu.then(enBilinen), akimRenk(s.akim));
  const { biyografiler, akimBilgi } = await ekVeriYukle();
  if (!guncelMi(no)) return;
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
          <p class="kucuk ikincil" style="margin:4px 0 0">Kaynak: <a href="${kacis(bio.kaynak.url)}" target="_blank" rel="noopener">${kacis(bio.kaynak.ad)}</a>${bio.dil === 'en→tr' ? ' (İngilizceden kısaltılarak çevrildi)' : bio.dil === 'claude' ? ' (bilgilerinden Claude özeti)' : ''}</p>`
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
        <a class="dugme" href="#/gunun/${encodeURIComponent(baskaSanatci(gununHavuzu(), s.id, d.rng))}" data-test="baska">Başka bir sanatçı</a>
      </div>
    </article>`);
  const eserler = bilinirlikSirasi(await eserSozu);
  if (!guncelMi(no)) return;
  const galeri = ekran.querySelector('[data-galeri]');
  if (!galeri) return;
  if (!eserler.length) {
    galeri.innerHTML = '<p class="ikincil kucuk">Bu sanatçı için doğrulanmış görsel bulunamadı.</p>';
    return;
  }
  galeri.insertAdjacentHTML('beforebegin', seritUst(s, eserler.length));
  galeri.innerHTML = eserSeridi(eserler, 'galeri-eser', 'data-galeri-eser');
  // onclick: aynı galeriye ikinci dinleyici eklenmez (iki görüntüleyici üst üste açılıyordu)
  galeri.onclick = (ev) => {
    const b = ev.target.closest('[data-galeri-eser]');
    if (b) goruntuleyiciAc({ eserler, baslangic: Number(b.dataset.galeriEser), notu: notuIcin(s.id), ...gorselTercihi() });
  };
}

// Ekranın olay dinleyicileri; app.js özgün sırayla bir kez bağlar
export function olaylariBagla() {
  // Tek dokunuşla yedek: panoya kopyalar ya da paylaşım sayfasını açar (Notlar, Mesajlar); dosya indirmez
  ekran.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-hizli-yedek]');
    if (!b) return;
    const satir = b.closest('.yedek-hatirlat');
    yedekTarihiYaz();
    const metin = yedekMetni(d.ilerleme, d.yarim);
    try {
      if (b.dataset.hizliYedek === 'paylas') await navigator.share({ title: `Sanat Atlası yedeği · ${bugun()}`, text: metin });
      else await navigator.clipboard.writeText(metin);
      satir.innerHTML = `<span>${b.dataset.hizliYedek === 'paylas' ? 'Yedek paylaşıldı.' : 'Yedek panoya kopyalandı. Notlar’a yapıştırıp sakla.'}</span>`;
      satir.classList.add('tamam');
    } catch (err) {
      // pano izni yoksa ya da paylaşım iptal edildiyse Ayarlar'daki metin kutusu kalır
      if (err && err.name === 'AbortError') return;
      git('#/ayarlar');
    }
  });

  ekran.addEventListener('click', (e) => {
    const yk = e.target.closest('[data-yenilik-kapat]');
    if (yk) {
      d.yenilikKapali = true;
      yk.closest('.yenilik-not').remove();
    }
  });

  ekran.addEventListener('click', (e) => {
    const el = e.target.closest('.duvar-etiketi.kesik');
    if (el) etiketiCevir(el);
  });

  ekran.addEventListener('keydown', (e) => {
    const el = (e.key === 'Enter' || e.key === ' ') && e.target.closest?.('.duvar-etiketi.kesik');
    if (el) {
      e.preventDefault();
      etiketiCevir(el);
    }
  });

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
}
