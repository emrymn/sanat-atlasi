// Bugün: sayımlar, ana sayfa (sahne), yedek hatırlatması ve Günün sanatçısı sayfası.
import { akimBilgisiBirlestir } from '../birlesme.js';
import { kacis } from '../yardimci.js';
import { GUNLUK_YENI_SINIRI } from '../leitner.js';
import { turOzeti, turAltYazisi } from '../oturum.js';
import { sanatciEserleri, eserBaslik } from '../eserler.js';
import { gorselUrl, gorselYedek, secilenGorsel, gorselOdakNoktasi, kaplamaKaymasi, adlaOdak, yuruyusAdresleri, yuruyusEki } from '../gorsel.js';
import { yuruyusAdimlari, yuruyusBaslat } from '../yuruyus.js';
import { hareketAz } from '../gecis.js';
import { baskaSanatci } from '../gunun.js';
import { gunlukGuncelle, yedekMetni, yedekHatirlatmasi } from '../depo.js';
import { goruntuleyiciAc } from '../goruntuleyici.js';
import { ikon } from '../tasarim.js';
import { bilinenAd } from '../adlar.js';
import {
  acikListe,
  bugun,
  d,
  taninma,
  etiket,
  isimHtml,
  kunye,
  kaliteSirasi,
  ekran,
  notuIcin,
  gorselTercihi,
  gununId,
  ciz,
  ekranRengi,
  gunduzRenginiUygula,
  enBilinen,
  kaydet,
  git,
  sanatcininGununEseri,
  akimRenk,
  kotuler,
  odaklariYukle,
  jsonGetir,
  hataGoster,
  geriDugmesi,
  gununHavuzu,
  skor,
  bildir,
  cizimNo,
  guncelMi,
  eserKareleriDoldur,
  hikayeVeri,
  hikayeBulucu,
  sekmeRozetiBagla,
  yuruyusEserAdi,
} from './ortak.js';
import { ayrintiVeri, ayrintiBulucu, rozetleriEkle } from './gozat.js';
import { SURUM } from '../surum.js';
import { gosterilecekler, yenilikYazisi } from '../yenilikler.js';
import { egimBaslat } from '../egim.js';
import { imzaGoster } from '../imza.js';
import { kunyeGoster, dinleEkle } from '../kunye.js';

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

// Bugün (Tasarım B · 4.1, C1): tablo kenardan kenara; üstte tarih ve Ben, altta sanatçının adı, eserin adı ve yılı,
// sonra tek kelimelik üç düğme. Hikâyesi / İncele, eserin kaydı yoksa gizli kalır.
// İş 171: sanatçının yürüyüşü varsa (kayit) sayfa aşağı kayar: resmin içinde yürüyüş, sonra Hayatı ve günün işi.
// Yürüyüşü olmayan sanatçıda (dosya yoksa) eskisi gibi tek ekran, kaydırma yok.
const ustHtml = (tekrar) =>
  `<div class="bugun-ust"><span class="etiket bugun-tarih" data-test="tekrar">${tekrar}</span><a class="bugun-ben" href="#/ilerleme" aria-label="Ben: ilerleme ve ayarlar">Ben</a></div>`;
function kapakHtml(gs, kayit) {
  const eser = kayit ? [yuruyusEserAdi(gs.id, kayit), kayit.yil].filter(Boolean).join(' · ') : '';
  return `<button class="bugun-buyut" type="button" data-bugun-buyut aria-label="Resmi tam ekran aç" disabled></button>
        <div class="bugun-notlar"><button class="egim-dugme" type="button" data-egim-dugme data-test="egim-dugme">${ikon('hareket', 18, 1.6)}Hareketi aç</button>${yenilikHtml()}${yedekHatirlatHtml()}</div>
        <div class="bugun-alt">
          <a class="sahne-isim isim-blok" href="#/gunun">${isimHtml(gs)}</a>
          <p class="bugun-eser" data-bugun-eser${eser ? '' : ' hidden'}>${kacis(eser)}</p>
          <div class="bugun-dugmeler">
            <button class="bugun-dugme" type="button" data-bugun-hikaye hidden>${ikon('kitap', 16, 1.6)}<span>Hikâyesi</span></button>
            <button class="bugun-dugme" type="button" data-bugun-incele hidden>${ikon('ara', 16, 1.6)}<span>İncele</span></button>
            ${
              // İş 172: sanatçı bağlantısı kalktı (isme dokununca aynı sayfa açılıyor); yerinde sayfanın sonundaki Hayatı'na
              // süzülen düğme. Yürüyüşü olmayan resimde Hayatı sanatçı sayfasındadır.
              kayit
                ? `<button class="bugun-dugme" type="button" data-yur-hayata data-test="bugun-hayati">${ikon('in', 16, 1.6)}<span>Hayatı</span></button>`
                : `<a class="bugun-dugme" href="#/gunun" data-test="bugun-hayati">${ikon('kitap', 16, 1.6)}<span>Hayatı</span></a>`
            }
          </div>
        </div>`;
}
function sahneHtml(gs, tekrar, kayit) {
  if (!kayit)
    return `<section class="sahne bugun-tek" data-test="gunun-kart">
      <div class="bugun-kahraman sahne-yapiskan" data-gunun-gorsel>
        <span class="egim-isik" aria-hidden="true"></span>
        ${ustHtml(tekrar)}
        ${kapakHtml(gs, null)}
      </div>
    </section>`;
  const kunyeYazi = [gs.ad, kayit.yil, gs.akim].filter(Boolean).join(' · ');
  return `<section class="sahne bugun-tek bugun-yuruyus" data-test="gunun-kart">
      <div class="bugun-kahraman sahne-yapiskan yur-sahne" data-gunun-gorsel><span class="egim-isik" aria-hidden="true"></span></div>
      <div class="yur-bulanik" aria-hidden="true"></div>
      ${ustHtml(tekrar)}
      <div class="yur-noktalar" aria-hidden="true"></div>
      <div class="yur-akis" data-yur-akis>
        <section class="yur-adim yur-kapak" data-test="yur-adim">${kapakHtml(gs, kayit)}<span class="yur-ok" aria-hidden="true">${ikon('asagi', 22, 1.5)}</span></section>
        ${yuruyusAdimlari({ kayit, kunye: kunyeYazi, taninma: taninma(gs), baslik: yuruyusEserAdi(gs.id, kayit) })}
        <section class="yur-hayat" data-test="yur-hayat">
          <div data-yur-bio></div>
          ${yuruyusSonu(gs)}
        </section>
      </div>
    </section>`;
}

// Yürüyüşün sonu = günün işi: sayfa boşlukta bitmez; bugünkü tur, sanatçının sayfası, eserleri ve adının okunuşu
function yuruyusSonu(gs) {
  const tur = turBilgisi('karisik');
  const dk = Math.max(1, Math.round((tur.toplam * 20) / 60));
  const turKart = tur.toplam
    ? `<a class="yur-tur" href="#/pekistir/karisik" data-test="yur-tur"><b class="yur-tur-sayi" data-test="tur-sayi">${tur.toplam}</b><span class="yur-tur-yazi"><span class="yur-tur-baslik">Bugünkü tur</span><small data-test="tur-alt">${tur.toplam} kart · yaklaşık ${dk} dk</small></span>${ikon('ileri', 22, 1.7)}</a>`
    : `<a class="yur-tur bitti" href="#/pekistir" data-test="yur-tur"><span class="yur-tur-yazi"><span class="yur-tur-baslik">Bugünkü kartlar bitti</span><small>Başka turlar Çalış'ta</small></span>${ikon('ileri', 22, 1.7)}</a>`;
  return `<div class="yur-son" data-test="yur-son">
      <p class="etiket yur-son-kunye">${kunye(gs, { bag: false, konuYok: true })}</p>
      <h2>Resmi gezdin.</h2>
      ${turKart}
      <nav class="yur-baglar" aria-label="Sanatçı">
        <a href="#/gunun">${kacis(bilinenAd(gs.ad, d.kisaAdlar[gs.id]))}: sanatçı sayfası${ikon('ileri', 16, 1.7)}</a>
        <a href="#/sanatci/${encodeURIComponent(gs.id)}/eserler">Bütün eserleri${ikon('ileri', 16, 1.7)}</a>
      </nav>
      <div class="yur-dinle" data-yur-dinle></div>
      <button class="yur-basa" type="button" data-yur-basa data-test="yur-basa"><span class="yur-basa-halka" aria-hidden="true">${ikon('cik', 20, 1.5)}</span><span>Başa dön</span></button>
    </div>`;
}

export function seritUst(s, n, baslik = 'Eserleri') {
  return `<div class="serit-ust">${etiket(`${baslik} · ${n}`)}<a class="tumunu-goster" href="#/sanatci/${encodeURIComponent(s.id)}/eserler" data-test="tumunu-goster">Tümünü göster ${ikon('ileri', 15, 1.7)}</a></div>`;
}

export function anaSayfa() {
  d.yigin = ['#/'];
  gunduzRenginiUygula(); // 1.77.0: otomatik Gündüz paleti günün tablosundan (sanatçı değiştiyse yeniden)
  const g = gunlukGuncelle(d.ilerleme, bugun());
  const gs = d.harita.get(gununId());
  const tekrar = kacis(new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }));
  const kayit = gs && d.yuruyus && d.yuruyus[gs.id] && d.yuruyus[gs.id].noktalar ? d.yuruyus[gs.id] : null;
  const perde = !d.perdeAcildi;
  ciz(`
    <h1 class="ekran-disi" tabindex="-1">Sanat Atlası</h1>
    ${
      gs
        ? sahneHtml(gs, tekrar, kayit)
        : `<header class="ust"><div class="ust-yazi">${etiket('Bugün', { vurgu: true })}<span class="hap" data-test="tekrar">${tekrar}</span></div></header>${turKarti(turBilgisi('karisik'), g)}${yenilikHtml()}${yedekHatirlatHtml()}`
    }`);
  // uygulama açılışında bir kez: tablo perde açılır gibi belirir, isim satır satır gelir
  ekran.classList.toggle('perde', !d.perdeAcildi);
  d.perdeAcildi = true;
  if (gs) {
    // telefonu eğince tablo döner, ışık üstünden kayar (İş 32); izin Ayarlar'dan verilir
    egimBaslat(ekran.querySelector('[data-gunun-gorsel]'), d.ilerleme.ayarlar.egim !== false);
    if (kayit) yuruyusKur(gs, kayit, perde);
    else gununKartGorseli(gs);
    imzaGoster(gs, ekran.querySelector('.sahne-isim')); // İş 48: tablonun üstünde adın altında imza
  } else ekranRengi(null, null);
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
// Günün eseri: ekranı kenardan kenara kaplar; renkleri ekranın vurgusu olur
async function gununKartGorseli(s) {
  const eSozu = sanatcininGununEseri(s);
  ekranRengi(eSozu, akimRenk(s.akim));
  const e = await eSozu;
  const kutu = ekran.querySelector('[data-gunun-gorsel]');
  if (!kutu || !e) return;
  const g = secilenGorsel(e, kotuler());
  const url = gorselUrl(g, 1200);
  kutu.insertAdjacentHTML(
    'afterbegin',
    `<img decoding="async" alt="${kacis(`${s.ad}, ${eserBaslik(e)}`)}" src="${kacis(url)}" data-yedek="${kacis(gorselYedek(g))}">`,
  );
  tuvalOdagi(kutu, kutu.querySelector('img'), g);
  bugunDugmeleri(s, e, kutu);
}

// İş 171: yürüyüşlü Bugün. Resim data/yuruyus.json'daki görselden (R2'deki 1280'lik; varsa en büyük kopya arkadan
// gelir); düğmeler ve tam ekran, eser listesi gelince bağlanır; Hayatı metni gelince sona eklenir.
async function yuruyusKur(s, kayit, perde) {
  const kok = ekran.querySelector('.bugun-yuruyus');
  const kutu = kok.querySelector('[data-gunun-gorsel]');
  const eSozu = sanatcininGununEseri(s);
  ekranRengi(eSozu, akimRenk(s.akim));
  const img = document.createElement('img');
  img.decoding = 'async';
  img.alt = `${s.ad}, ${yuruyusEserAdi(s.id, kayit)}`;
  img.dataset.keskinBekliyor = '1'; // kopyayı yürüyüş kendi seçer (js/keskin.js karışmasın)
  kutu.prepend(img);
  await odaklariYukle().catch(() => {});
  if (!kok.isConnected) return;
  const adres = yuruyusAdresleri(kayit.gorsel, kayit.buyuk);
  // denetimde eklenen kırpma ve açılış yakınlığı (data/yuruyus_odak.json); kayıttaki kirp varsa o geçerli
  const ek = yuruyusEki(kayit.gorsel);
  if (ek.kirp && !kayit.kirp) kayit = { ...kayit, kirp: ek.kirp };
  const yur = yuruyusBaslat({ kok, img, kayit, yakin: ek.yakin, odak: adlaOdak(kayit.gorsel) || [50, 40], kucukUrl: adres.kucuk, buyukUrl: adres.buyuk, hareketsiz: hareketAz(), acilis: perde });
  // İş 172: Hayatı'na ve başa süzülüş (js/yuruyus.js); Hareket kapalıysa doğrudan oraya konur
  kok.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-yur-hayata]')) yur.suzul('hayat');
    else if (ev.target.closest('[data-yur-basa]')) yur.suzul('bas');
  });
  eSozu.then((e) => e && kok.isConnected && bugunDugmeleri(s, e, kok, false));
  dinleEkle(s, kok.querySelector('[data-yur-dinle]'));
  const { biyografiler } = await ekVeriYukle();
  const bio = biyografiler.sanatcilar[s.id];
  const yer = kok.querySelector('[data-yur-bio]');
  if (!bio || !bio.metin || !yer || !kok.isConnected) return;
  yer.innerHTML = `<h2>Hayatı</h2>${bio.metin
    .split(/\n+/)
    .map((p) => `<p data-test="biyografi">${kacis(p)}</p>`)
    .join('')}<small>Kaynak: ${kacis((bio.kaynak || {}).ad || '')}</small>`;
}

// Eserin adı ve yılı; resme dokununca tam ekran görüntüleyici. Hikâyesi ve İncele, veri gelince ve eserin kaydı varsa
// görünür; dokununca görüntüleyici doğrudan hikâyeyle ya da rehberli incelemeyle açılır.
function bugunDugmeleri(s, e, kutu, eserYaz = true) {
  const yazi = kutu.querySelector('[data-bugun-eser]');
  const eserYazisi = [eserBaslik(e), e.tarih].filter(Boolean).join(' · ');
  if (eserYaz && yazi && eserYazisi) {
    yazi.textContent = eserYazisi;
    yazi.hidden = false;
  }
  const ac = (ek = {}) => goruntuleyiciAc({ eserler: [e], notu: notuIcin(s.id), ayrintilar: ayrintiBulucu, ...gorselTercihi(), ...ek });
  const buyut = kutu.querySelector('[data-bugun-buyut]');
  buyut.disabled = false;
  buyut.onclick = () => ac();
  const goster = (sec, varMi, ek) => {
    const b = kutu.querySelector(sec);
    if (!b || !kutu.isConnected || !varMi()) return;
    b.hidden = false;
    b.onclick = () => ac(ek);
  };
  hikayeVeri().then(() => goster('[data-bugun-hikaye]', () => hikayeBulucu(e), { hikayeyeBasla: true }));
  ayrintiVeri().then(() => goster('[data-bugun-incele]', () => ayrintiBulucu(e), { incelemeyeBasla: true }));
}

// İş 144 (ChatGPT'nin önerisi): Tuval'in tablosu yüz ekranın üst yarısında (adın çok üstünde) kalacak biçimde kaydırılır;
// önce hep %50 %30'dan kırpılıyordu (yüz kesilebiliyor ya da adın altında kalabiliyordu). Yüz bulunmayan tabloda eskisi gibi.
// Yakınlaşma ve eğim yüzün çevresinde olur (transform-origin).
const TUVAL_HEDEF = [0.5, 0.36];
// 1.78.0: kaydırma her yüklemede yeniden hesaplanır. js/keskin.js tabloyu yüklendikten sonra büyük kopyayla değiştirir;
// odak verisi tam o geçişte gelirse görselin boyu henüz 0'dı ve kaydırma hiç uygulanmıyordu (CI'da İş 144 testi düştü).
function tuvalOdagi(kutu, img, g) {
  if (!img) return;
  let odakHazir = false;
  const uygula = () => {
    if (!odakHazir || !img.isConnected || !img.naturalWidth) return; // boy belli değilse sıradaki load'da
    const odak = gorselOdakNoktasi(g);
    const r = kutu.getBoundingClientRect();
    const k = kaplamaKaymasi({ w: img.naturalWidth, h: img.naturalHeight }, { w: r.width, h: r.height }, odak, TUVAL_HEDEF);
    if (!k) return;
    img.style.objectPosition = `${k.x.toFixed(1)}px ${k.y.toFixed(1)}px`;
    img.style.transformOrigin = `${k.ox.toFixed(1)}px ${k.oy.toFixed(1)}px`;
  };
  img.addEventListener('load', uygula);
  odaklariYukle().then(() => {
    odakHazir = true;
    uygula();
  });
  window.addEventListener('resize', uygula);
}

let ekVeri = null;
function ekVeriYukle() {
  if (!ekVeri) {
    ekVeri = Promise.all([
      jsonGetir('data/biyografiler.json').catch(() => ({ sanatcilar: {} })),
      jsonGetir('data/akim_bilgi.json').then(akimBilgisiBirlestir).catch(() => ({ akimlar: {} })),
    ]).then(([biyografiler, akimBilgi]) => ({ biyografiler, akimBilgi }));
  }
  return ekVeri;
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
      <img ${i > 3 ? 'loading="lazy" ' : ''}decoding="async" alt="" src="${kacis(gorselUrl(g, 400))}" data-yedek="${kacis(gorselYedek(g))}"><span class="eser-yazi"><span class="eser-ad">${kacis(eserBaslik(e))}</span>${e.tarih ? `<small>${kacis(e.tarih)}</small>` : ''}</span></button>`;
    })
    .join('');
}

export function notBolumleri(s) {
  const not = s.kurs_notu || s.anlatim;
  return `${not ? `<section class="bolum">${etiket('Notlarımdan', { vurgu: true })}<p class="okuma italik">${kacis(not)}</p></section>` : ''}
    ${taninma(s) ? `<section class="bolum">${etiket('Nasıl tanırım?')}<p class="okuma" data-test="taninma">${kacis(taninma(s))}</p></section>` : ''}`;
}

// İş 97 (Emre, tasarım tuvalinde "A"): sayfanın altı Atölye'nin "Turu başlat" kartının dilinde: solda sanatçının üç
// eseri yelpaze, italik başlık, yuvarlak düğme; vurgu o an gösterilen eserin renginden (--vurgu-rgb). Eklenince yelpaze
// desteye toplanır, kart Atölye'ye götürür.
const tuvalYelpaze = (id) =>
  `<span class="te-yelpaze" aria-hidden="true">${[1, 0, 2]
    .map((sira, i) => `<span class="te-tuval" style="--i:${i}"><span data-eser-kucuk="${kacis(id)}" data-sira="${sira}"></span></span>`)
    .join('')}</span>`;
function ekleKarti(s) {
  return `<button class="tuval-ekle" type="button" data-pekistirmeye-ekle="${kacis(s.id)}" aria-label="Bu sanatçıyı pekiştirmeye ekle: ${kacis(s.ad)}">
      ${tuvalYelpaze(s.id)}
      <span class="te-yazi"><span class="te-baslik">Pekiştirmeye ekle</span><small>Atölye'deki tekrarlara girer</small></span>
      <span class="te-yuvarlak" aria-hidden="true">${ikon('arti', 18, 1.8)}</span>
    </button>`;
}
function eklendiKarti(s, yeni = false) {
  return `<a class="tuval-ekle eklendi${yeni ? ' yeni' : ''}" href="#/pekistir" data-test="pekistirmede" aria-label="Pekiştirmede: ${kacis(s.ad)}. Atölye'ye git">
      ${tuvalYelpaze(s.id)}
      <span class="te-yazi"><span class="te-baslik">${ikon('dogru', 18, 2.2)}Pekiştirmede</span><small>Atölye'de tekrarlarında</small></span>
      <span class="te-yuvarlak" aria-hidden="true">${ikon('ileri', 16, 1.8)}</span>
    </a>`;
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
    <header class="sanatci-ust">${geriDugmesi('#/')}<h1 class="etiket vurgu" tabindex="-1">${id && id !== bugunku ? 'Sanatçı' : 'Günün sanatçısı'}</h1></header>
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
        ${pekistirmedeMi(s) ? eklendiKarti(s) : ekleKarti(s)}
        <a class="tuval-baska" href="#/gunun/${encodeURIComponent(baskaSanatci(gununHavuzu(), s.id, d.rng))}" data-test="baska">${ikon('karistir', 20, 1.6)}<span>Başka bir sanatçı</span>${ikon('ileri', 14, 1.8)}</a>
      </div>
    </article>`);
  eserKareleriDoldur(); // alttaki kartın yelpazesi
  const eserler = kaliteSirasi(await eserSozu);
  if (!guncelMi(no)) return;
  imzaGoster(s, ekran.querySelector('.isim-blok')); // İş 48: varsa ressamın gerçek imzası
  kunyeGoster(s, ekran.querySelector('.isim-blok')); // İş 49: portresi ve adının okunuşu
  const galeri = ekran.querySelector('[data-galeri]');
  if (!galeri) return;
  if (!eserler.length) {
    galeri.innerHTML = '<p class="ikincil kucuk">Bu sanatçı için doğrulanmış görsel bulunamadı.</p>';
    return;
  }
  galeri.insertAdjacentHTML('beforebegin', seritUst(s, eserler.length));
  galeri.innerHTML = eserSeridi(eserler, 'galeri-eser', 'data-galeri-eser');
  rozetleriEkle(galeri.querySelectorAll('[data-galeri-eser]'), eserler); // İş 171: hikâye ve inceleme rozetleri
  // onclick: aynı galeriye ikinci dinleyici eklenmez (iki görüntüleyici üst üste açılıyordu)
  galeri.onclick = (ev) => {
    const b = ev.target.closest('[data-galeri-eser]');
    if (b) goruntuleyiciAc({ eserler, baslangic: Number(b.dataset.galeriEser), notu: notuIcin(s.id), ...gorselTercihi() });
  };
}

// Ekranın olay dinleyicileri; app.js özgün sırayla bir kez bağlar
export function olaylariBagla() {
  sekmeRozetiBagla(() => (d.ilerleme ? turBilgisi('karisik').toplam : 0));
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
    // İş 97: kart "Pekiştirmede" kartına döner, yelpaze desteye toplanır
    b.outerHTML = eklendiKarti(d.harita.get(id), true);
    eserKareleriDoldur();
    bildir(`${d.harita.get(id).ad} pekiştirmeye eklendi.`);
  });
}
