// Pekiştir: menü, oturum kurma (dönem, karışık, konu turu Ö6, hatalarım Ö5), kart çizimi ve cevaplar, yarım kalan oturum, tur özeti ve dönem seviyeleri.
import { kacis, yillarYaz } from '../yardimci.js';
import { akimDurumlari } from '../kilit.js';
import { cevapla, GUNLUK_YENI_SINIRI } from '../leitner.js';
import { sanatciSecenekleri, akimSecenekleri } from '../celdirici.js';
import { kartlariSec, Oturum, kategori, turAltYazisi } from '../oturum.js';
import { sanatciEserleri, eserSec, pekistirmeHavuzu, eserBaslik } from '../eserler.js';
import { gorselUrl, gorselYedek, secilenGorsel } from '../gorsel.js';
import { gunlukGuncelle, sonCalisilanEkle } from '../depo.js';
import { goruntuleyiciAc } from '../goruntuleyici.js';
import { ikon } from '../tasarim.js';
import { bilinenAd } from '../adlar.js';
import { idbAl, idbKoy, idbSil } from '../idb.js';
import { kayitYap, kayitGecerliMi, kayittanKur, devamOzeti } from '../devam.js';
import { karsilastirmaAdresi } from '../karsilastir.js';
import { akimKarsilastirmaAdresi } from '../akim.js';
import { tanismaGerekirMi, tanismaEserleri, karisanEkle, KARISAN_ESIGI } from '../ogrenme.js';
import { tersSorulurMu, tersSecenekleri } from '../ters.js';
import { konuTuru, konuTanismalari, hatalarTuru, esiEkle } from '../turlar.js';
import { eserKonusu } from '../ikonografi.js';
import {
  SEVIYELER,
  seviyeKaydi,
  seviyeIsle,
  seviyeDurumu,
  seviyeKisa,
  eserSeviyesi,
  GECIS_ORANI,
  seviyeSecenekleri,
  kartSeviyesi,
  pencereyeYazilirMi,
} from '../seviye.js';
import {
  d,
  islenen,
  gununRengi,
  ciz,
  ust,
  etiket,
  acikListe,
  akimNoktasi,
  bugun,
  kotuler,
  geri,
  HARFLER,
  taninma,
  ekran,
  bilinirlikSirasi,
  kucukGorsel,
  isimHtml,
  BILMIYORUM,
  eserAdi,
  paletHtml,
  kaynakSatiri,
  ekranRengi,
  renkSabitle,
  kaydet,
  skor,
  hataGoster,
  notuIcin,
  gorselTercihi,
} from './ortak.js';
import { turBilgisi, anaSayfa } from './bugun.js';
import { yonlendir } from './yonlendirme.js';

export function pekistirMenusu() {
  const durumlar = akimDurumlari(d.akimlar, d.sanatcilar, islenen()).filter((a) => a.acik);
  // her satırda o turun kart sayısı (D1): turu açınca sayaç aynı sayıyı gösterir
  const turYazi = (t) => `${t.toplam} kart${t.tekrar ? ` · ${t.tekrar} tekrar` : ''}`;
  const karisik = turBilgisi('karisik');
  gununRengi();
  ciz(`${ust('Pekiştir', '#/', { geriYok: true, ustEtiket: 'Tekrar' })}
    ${devamKarti()}
    ${
      durumlar.length
        ? `<a class="dugme vurgu karisik-dugme" href="#/pekistir/karisik" data-test="karisik-dugme"><span>Pekiştir · Karışık · <b data-test="tur-sayi">${karisik.toplam}</b> kart</span><small data-test="tur-alt">${kacis(turAltYazisi(karisik))}</small></a>
    ${hatalarSatiri()}
    <section class="bolum">${etiket('Döneme göre')}
    <p class="kucuk ikincil" style="margin:0">${seviyeAciklamasi()}</p>
    <ul class="liste">
      <li><a class="satir" href="#/pekistir/donem/hepsi"><span class="metin"><b>Hepsi, dönem sırasıyla</b><span>${acikListe().length} sanatçı · ${turYazi(turBilgisi('donem', 'hepsi'))}</span></span>${ikon('ileri', 20, 1.4)}</a></li>
      ${durumlar.map((a) => `<li><a class="satir" href="#/pekistir/donem/${encodeURIComponent(a.ad)}"><span class="metin"><b>${kacis(a.ad)} ${akimNoktasi(a.ad)}</b><span>${a.acikSayisi} sanatçı · ${turYazi(turBilgisi('donem', a.ad))}</span></span>${seviyeRozeti(a.ad)}${ikon('ileri', 20, 1.4)}</a></li>`).join('')}
    </ul></section>`
        : bosAcik()
    }`);
}

// Ö5 · Hatalarım: son 7 günde yanlış yapılan sanatçılar ve karıştırılan ikililer (yoksa satır görünmez)
export function hatalarBilgisi() {
  return hatalarTuru({ adaylar: acikListe(), skorlar: d.ilerleme.skorlar, karisanlar: d.ilerleme.karisanlar, bugun: bugun(), rng: () => 0.5 });
}
function hatalarSatiri() {
  const h = hatalarBilgisi();
  if (!h.idler.length) return '';
  const ad = (id) => kacis(bilinenAd(d.harita.get(id).ad, d.kisaAdlar[id]));
  const alt = [`${h.hatalilar.length} sanatçı`, h.ikililer.length ? `${h.ikililer.length} karıştırılan ikili` : ''].filter(Boolean).join(' · ');
  return `<a class="hatalar-satir" href="#/pekistir/hatalar" data-test="hatalar-satir">
      <span class="hatalar-sayi" aria-hidden="true">${h.idler.length}</span>
      <span class="metin"><b>Hatalarım</b><span>${alt} · son 7 gün</span>${
        h.ikililer.length ? `<small class="hatalar-ikili">${h.ikililer.map((x) => `${ad(x.a)} ↔ ${ad(x.b)}`).join(' · ')}</small>` : ''
      }</span>${ikon('ileri', 20, 1.4)}</a>`;
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

// Turun adayları: dönem → o akımın, konu → o konunun açık sanatçıları; hatalarım → yalnızca hatalı olanlar
function turAdaylari(kip, akim) {
  const acik = acikListe();
  if (kip === 'donem' && akim !== 'hepsi') return acik.filter((s) => s.akim === akim);
  if (kip === 'konu') return acik.filter((s) => s.konu === Number(akim));
  if (kip === 'hatalar') {
    const h = hatalarBilgisi();
    const ids = new Set([...h.idler, ...h.hatalilar]);
    return acik.filter((s) => ids.has(s.id));
  }
  return acik;
}

// Turun kart sırası (sanatçı kimlikleri) ve kipin ek bilgileri
function turSec(kip, akim, adaylar) {
  const skorlar = d.ilerleme.skorlar;
  if (kip === 'konu')
    // Ö6: günlük yeni sınırı yok; tanışmalar turdan önce arka arkaya
    return { idler: konuTuru(adaylar, skorlar, d.rng), tanisma: tanismaAcik() ? konuTanismalari(adaylar, skorlar) : [] };
  if (kip === 'hatalar') {
    const h = hatalarTuru({ adaylar, skorlar, karisanlar: d.ilerleme.karisanlar, bugun: bugun(), rng: d.rng });
    return { idler: h.idler, esler: h.esler };
  }
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
  return { idler: secilen.map((s) => s.id) };
}

async function oturumKur(kip, akim) {
  let adaylar = turAdaylari(kip, akim);
  const varMi = await Promise.all(adaylar.map(eserVarMi));
  adaylar = adaylar.filter((_, i) => varMi[i]);
  const tur = turSec(kip, akim, adaylar);
  return {
    kip,
    akim,
    rota: location.hash,
    oturum: new Oturum(tur.idler, { rng: d.rng }),
    esler: tur.esler || null, // Ö5: ikilinin eşi çeldirici olur
    seviye: null, // Ö9: dönem turunda seçilen alt seviye (null: dönemin seviyesi)
    tanisma: tur.tanisma && tur.tanisma.length ? { sira: tur.tanisma, konum: 0 } : null, // Ö6
    tanismaGorulen: {}, // tanışmada gösterilen eserler: soru bunlardan gelmesin
    kart: null,
    sonrakiKart: null,
    kimlik: `${Date.now().toString(36)}-${Math.floor(d.rng() * 1e9).toString(36)}`,
    gosterilen: [],
    gecenler: [], // bu turda seviye atlayan dönemler: [{ akim, seviye }]
  };
}

function kipAdi(kip, akim) {
  return `Pekiştir · ${kipKisa(kip, akim)}`;
}

function kipKisa(kip, akim) {
  if (kip === 'karisik') return 'Karışık';
  if (kip === 'konu') return `Konu ${akim}`;
  if (kip === 'hatalar') return 'Hatalarım';
  return akim === 'hepsi' ? 'Hepsi' : akim;
}

// Turun adresi (yarım oturumdan dönünce)
export function turAdresi(kip, akim) {
  if (kip === 'karisik' || kip === 'hatalar') return `#/pekistir/${kip}`;
  return `#/pekistir/${kip}/${encodeURIComponent(akim)}`;
}

// Yalnızca sanatçı sorusu soran turlar (karışıkta bir de akım sorusu var)
const tekSorulu = (o) => o.kip !== 'karisik';

export async function pekistir(kip, akim, { yeni = false, onayli = false } = {}) {
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
        `${ust(baslik, '#/pekistir')}<div class="bos-kutu"><p>Bu seçim için şu an kart yok.</p><p class="kucuk ikincil">${
          kip === 'hatalar'
            ? 'Son 7 günde yanlış yaptığın sanatçı kalmadı.'
            : kip === 'konu'
              ? 'Bu konunun açık sanatçısı yok ya da görselleri bulunamadı.'
              : `Bugünkü yeni sanatçı sınırına (${GUNLUK_YENI_SINIRI}) ulaşmış olabilirsin ya da bu sanatçıların görseli bulunamadı.`
        }</p></div>`,
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
    // Dönemin seviyesi sorunun zorluğunu belirler: eser (kolay → tipik/ünlü) ve şıklar (kolay → uzak dönemler).
    // Ö9: dönem turunda alt seviye seçildiyse o seviye
    const sv = kartSeviyesi(seviyeKaydi(d.ilerleme, s.akim), o.seviye);
    // Ö6: tanışmada görülen eserler de sorulmaz
    const kacin = [...son, ...((o.tanismaGorulen || {})[s.id] || [])];
    const eser = eserSec(eserler, kacin, d.rng, kotuler(), { kolaylik: kolaylikFn(s.id), seviye: eserSeviyesi(sv) });
    if (!eser) return { konum, id: s.id, eser: null };
    d.ilerleme.sonEserler[s.id] = [...son.filter((x) => x !== eser.anahtar), eser.anahtar].slice(-8);
    const acikIdler = new Set(acikListe().map((x) => x.id));
    const secici = () =>
      sanatciSecenekleri(s, {
        sanatcilar: d.sanatcilar,
        akimlar: d.akimlar,
        acikIdler,
        rng: d.rng,
        ortaYillar: d.ortaYillar,
        seviye: SEVIYELER[sv].anahtar,
      }).map((x) => x.id);
    let secenekler = secici();
    // Ö5: karıştırılan ikilinin eşi şıklarda
    const es = o.esler && o.esler[s.id];
    if (es && d.harita.has(es)) secenekler = esiEkle(secenekler, s.id, es, d.rng);
    const kart = {
      konum,
      id: s.id,
      eser,
      eserler,
      seviye: sv,
      secenekler,
      akimSecenekleri: o.kip === 'karisik' ? akimSecenekleri(s.akim, d.akimlar, d.rng, 4, SEVIYELER[sv].anahtar) : null,
      adim: 1,
      cevapSanatci: null,
      cevapAkim: null,
      bitti: false,
    };
    // d.tersOrani: testler için (window.__atlas); yoksa TERS_ORANI
    if (!tersSorulurMu({ kip: o.kip, seviye: sv, rng: d.rng, oran: d.tersOrani })) return kart;
    // Ö1 ters soru: aynı çeldiricilerin eserleri (eseri olmayan sanatçının yerine ikinci seçimden biri)
    const adaylar = [...new Set([...secenekler, ...secici()])].filter((id) => id !== s.id && d.harita.has(id));
    return Promise.all(
      adaylar.map((id) =>
        sanatciEserleri(d.harita.get(id)).then(
          (l) => ({ id, eserler: l }),
          () => ({ id, eserler: [] }),
        ),
      ),
    ).then((celdiriciler) => {
      const ters = tersSecenekleri({ dogru: { id: s.id, eser }, celdiriciler, rng: d.rng, kotuler: kotuler(), konusu: eserKonusu });
      if (!ters) return kart;
      return { ...kart, tur: 'ters', ters, secenekler: ters.map((x) => x.id), akimSecenekleri: null };
    });
  });
}

async function kartCiz() {
  const o = d.oturum;
  if (!o) return anaSayfa();
  if (o.oturum.bitti) return ozetCiz();
  if (o.tanisma && o.tanisma.konum < o.tanisma.sira.length) return konuTanismaGoster(o);
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
    // konu turunda tanışmalar turdan önce yapıldı
    hazir.tanisma = o.kip !== 'konu' && tanismaAcik() && tanismaGerekirMi(d.ilerleme.skorlar[hazir.id]);
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

export function yarimSil() {
  d.yarim = null;
  idbSil('oturum', 'yarim');
}

export async function yarimYukle() {
  const k = await idbAl('oturum', 'yarim');
  if (kayitGecerliMi(k)) return k;
  if (k) idbSil('oturum', 'yarim'); // bozuk ya da 7 günden eski: sessizce silinir
  return null;
}

export function devamKarti() {
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
  if (bk.tur === 'ters') {
    // ters sorunun dört eseri: biri bile artık yoksa kart atlanır
    const ters = await Promise.all(
      (bk.ters || []).map(async (x) => {
        if (x.id === s.id) return { id: x.id, eser };
        const e = (await sanatciEserleri(d.harita.get(x.id))).find((y) => y.anahtar === x.eser);
        return e ? { id: x.id, eser: e } : null;
      }),
    );
    if (ters.length !== 4 || ters.some((x) => !x)) return null;
    return { ...bk, eser, eserler, ters, bitti: false };
  }
  return { ...bk, eser, eserler, bitti: false };
}

export async function devamEt() {
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
    rota: turAdresi(y.kip, y.akim),
    seviye: Number.isInteger(y.seviye) ? y.seviye : null,
    esler: y.esler && typeof y.esler === 'object' ? { ...y.esler } : null,
    tanisma: null,
    tanismaGorulen: {},
    oturum: kur.oturum,
    kart: null,
    sonrakiKart: null,
    bekleyenKart: kur.kart,
    kimlik: y.kimlik,
    gosterilen: (y.gosterilen || []).slice(),
    gecenler: (y.gecenler || []).slice(),
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

// Ayarlardan kapatılabilir (testler window.__atlasTanismaYok ile kapatır)
function tanismaAcik() {
  return d.ilerleme.ayarlar.tanisma !== false && !window.__atlasTanismaYok;
}

// Tanışma ekranı: sanatçının en bilinen 3 eseri ve "Nasıl tanırım?"
// sayac: sağ üstteki yazı; not: alttaki açıklama; dugme: ileri düğmesinin HTML'i
function tanismaCiz(o, s, eserler, { sayac, not, dugme, etiketYazi = 'Yeni sanatçı · önce tanış' }) {
  o.tanismaEserleri = eserler;
  const ipucu = ipucuMetni(s);
  ciz(
    `<header class="soru-ust">
      <button class="kapat" type="button" data-geri="#/pekistir" aria-label="Kapat">${ikon('kapat', 22, 1.7)}</button>
      <span class="etiket">${kacis(kipKisa(o.kip, o.akim))}</span>
      <span data-test="sayac">${sayac}</span>
    </header>
    <section class="tanisma" data-test="tanisma">
      ${etiket(etiketYazi, { vurgu: true })}
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
      <p class="kucuk ikincil">${not}</p>
      ${dugme}
    </section>`,
    'yeni-kart',
  );
  ekran.querySelector('.tanisma-ad').focus({ preventScroll: true });
}

// Yeni sanatçı: sorudan önce en bilinen 3 eseri (sorulacak eser hariç)
function tanismaGoster(o) {
  const k = o.kart;
  const s = d.harita.get(k.id);
  const ot = o.oturum;
  const eserler = tanismaEserleri(pekistirmeHavuzu(k.eserler || [], kotuler()), k.eser.anahtar, 3, kolaylikFn(k.id));
  k.tanismaEserleri = eserler;
  o.sonCizim = { konum: ot.konum, adim: 0, cevap: false, yuzde: Math.round((100 * ot.konum) / ot.toplam) };
  tanismaCiz(o, s, eserler, {
    sayac: `${Math.min(ot.konum + 1, ot.toplam)} / ${ot.toplam}`,
    not: 'Birazdan bu sanatçının burada görmediğin bir eseri sorulacak.',
    dugme: '<button class="dugme vurgu tanisma-gec" type="button" data-tanisma-gec>Tanıdım, soruya geç →</button>',
  });
}

// Ö6 · Konu turu: konunun yeni sanatçılarıyla arka arkaya tanışma, sonra kısa tur.
// Tanışmada görülen eserler turda sorulmaz.
async function konuTanismaGoster(o) {
  const t = o.tanisma;
  const id = t.sira[t.konum];
  const s = d.harita.get(id);
  const eserler = s ? await sanatciEserleri(s) : [];
  if (d.oturum !== o) return;
  const sec = tanismaEserleri(pekistirmeHavuzu(eserler || [], kotuler()), null, 3, kolaylikFn(id));
  if (!s || !sec.length) {
    t.konum++;
    return kartCiz();
  }
  t.gosterilen = sec.map((e) => e.anahtar);
  const son = t.konum + 1 >= t.sira.length;
  tanismaCiz(o, s, sec, {
    sayac: `Tanışma ${t.konum + 1} / ${t.sira.length}`,
    etiketYazi: `Konu ${o.akim} · yeni sanatçı`,
    not: son ? `Sırada bu konunun sanatçılarından ${o.oturum.toplam} kartlık kısa bir tur var.` : 'Sonra bu konunun öbür yeni sanatçısı geliyor.',
    dugme: `<button class="dugme vurgu tanisma-gec" type="button" data-konu-tanisma-gec data-test="konu-tanisma-gec">${son ? 'Tura başla →' : 'Sonraki sanatçı →'}</button>`,
  });
}

// Cevap yaprağı (D3): eser ve kalan iki seçenek yaprağın üstünde, kaydırmadan görünür.
// Görselin yüksekliği yaprağa göre küçülür; yer yetmezse (çok uzun ipucu) sayfa kaydırılabilir kalır.
function yaprakYerlestir() {
  const y = ekran.querySelector('.alt-yaprak');
  const sahne = ekran.querySelector('.soru-sahne');
  if (!y || !sahne) return;
  ekran.style.paddingBottom = `${y.offsetHeight + 16}px`;
  const img = sahne.querySelector('img');
  const ustu = sahne.getBoundingClientRect().top + window.scrollY;
  const resimH = img ? img.getBoundingClientRect().height : 0;
  // görselin altındaki her şey (başlık, iki seçenek) + yaprak
  // son öğe: seçenekler ya da ters sorunun eser şeridi
  const son = ekran.querySelector('[data-yaprak-son]') || ekran.querySelector('.secenekler');
  const alti = son.getBoundingClientRect().bottom - sahne.getBoundingClientRect().bottom;
  const bos = window.innerHeight - y.offsetHeight - 14 - ustu - alti;
  const hedef = Math.max(140, Math.min(bos, resimH || bos));
  sahne.style.setProperty('--soru-resim-h', `${Math.round(hedef)}px`);
  const tasma = son.getBoundingClientRect().bottom - (window.innerHeight - y.offsetHeight) + 12;
  if (tasma > 0) window.scrollBy(0, tasma);
}

// İpucu sığmıyorsa dokununca tamamı açılır ("Devamı ↓" / "Kısalt ↑", Bugün'deki etiketlerle aynı desen)
function ipucuIsaretle(y) {
  const p = y.querySelector('[data-ipucu]');
  if (!p) return;
  const metin = p.querySelector('.ipucu');
  const kesik = metin.scrollHeight > metin.clientHeight + 2;
  p.classList.toggle('kesik', kesik);
  if (kesik) {
    p.setAttribute('role', 'button');
    p.tabIndex = 0;
    p.setAttribute('aria-expanded', 'false');
  }
}
function ipucuCevir(p) {
  const acik = p.classList.toggle('acik');
  p.setAttribute('aria-expanded', String(acik));
  yaprakYerlestir();
}

// Ters soru (Ö1): ad bir isim levhasında verilir, dört eser masaya dağılmış kartpostallar. Karta dokununca kart
// büyür (yana kaydırarak diğerleri), "Bu eser" ile cevaplanır. Cevaptan sonra doğru eser sahneye çıkar, dört kart
// küçülüp sırayla ters döner ve arkalarında sanatçının adı görünür. Tek soru (karışıkta akım sorusu yok).
function tersGoster(o) {
  const k = o.kart;
  const s = d.harita.get(k.id);
  const ot = o.oturum;
  const sira = Math.min(ot.konum + 1, ot.toplam);
  const yuzde = Math.round((100 * ot.konum) / ot.toplam);
  const cevap = k.cevapSanatci;
  const gorsel = (x) => secilenGorsel(x.eser, kotuler()) || x.eser.gorseller[0];
  const resim = (x, w) => `<img decoding="async" alt="" src="${kacis(gorselUrl(gorsel(x), w))}" data-yedek="${kacis(gorselYedek(gorsel(x)))}">`;
  const adi = (id) => kacis(bilinenAd(d.harita.get(id).ad, d.kisaAdlar[id]));
  let govde;
  if (cevap === null) {
    const kartlar = k.ters
      .map(
        (x, i) =>
          `<button class="ters-eser kartpostal" type="button" data-kp-ac="${i}" data-kp-id="${kacis(x.id)}" style="--i:${i}" aria-label="${HARFLER[i]} eserini büyüt"><span class="kp-on"><span class="ters-cerceve">${resim(x, 400)}</span><span class="kp-pul">${HARFLER[i]}</span></span></button>`,
      )
      .join('');
    govde = `<div class="ters-izgara masa" data-test="ters-secenekleri">${kartlar}</div>
      <button class="bilmiyorum" type="button" data-bilmiyorum data-test="bilmiyorum">Bilmiyorum</button>`;
  } else {
    // doğru eser sahnede; dördü altında küçük kartlar: kartpostalda ters dönüp sanatçının adını gösterir
    const dogruI = k.ters.findIndex((x) => x.id === k.id);
    const serit = k.ters
      .map((x, i) => {
        const sinif = x.id === k.id ? ' dogru' : x.id === cevap ? ' yanlis' : ' soluk';
        const isaret = x.id === k.id ? ikon('dogru', 14, 2.4) : x.id === cevap ? ikon('yanlis', 14, 2.4) : '';
        return `<button class="ters-mini kartpostal doner${sinif}" type="button" data-ters-eser="${i}" style="--i:${i}" aria-label="${kacis(d.harita.get(x.id).ad)}"><span class="kp-ic"><span class="kp-on"><span class="ters-cerceve">${resim(x, 400)}</span></span><span class="kp-arka"><span class="kp-isaret">${isaret}</span><b>${adi(x.id)}</b><small>${kacis(yillarYaz(d.harita.get(x.id)))}</small></span></span></button>`;
      })
      .join('');
    govde = `<div class="soru-sahne ters-sahne">
        <button class="soru-resim" type="button" data-ters-eser="${dogruI}" aria-label="Görseli büyüt"><img decoding="async" alt="${kacis(eserAdi(k.eser))}" src="${kacis(gorselUrl(gorsel(k.ters[dogruI]), 800))}"></button>
      </div>
      <div class="ters-serit" data-test="ters-secenekleri" data-yaprak-son>${serit}</div>`;
  }
  let yaprak = '';
  if (cevap !== null) {
    const dogru = cevap === k.id;
    const tekrarNotu = 'bu kart 3–5 kart sonra yine gelecek';
    const sonuc = dogru ? ['Doğru', ''] : cevap === BILMIYORUM ? ['Bilmiyorum', tekrarNotu] : ['Yanlış', tekrarNotu];
    const secilen = !dogru && cevap !== BILMIYORUM ? k.ters.find((x) => x.id === cevap) : null;
    let karsilastirBag = '';
    if (secilen && d.harita.has(cevap)) {
      if ((k.karisanSayi || 0) >= KARISAN_ESIGI) karsilastirBag = karsiSeritHtml(s, d.harita.get(cevap), k.karisanSayi);
      karsilastirBag += `<a class="karsilastir-bag" href="${karsilastirmaAdresi(s.id, cevap)}" data-test="karsilastir">${ikon('karsilastir', 18, 1.6)}<span>Karşılaştır: ${kacis(bilinenAd(s.ad, d.kisaAdlar[s.id]))} ↔ ${adi(cevap)}</span></a>`;
    }
    const sonrakiYazi = ot.konum + 1 >= ot.toplam ? 'Turu bitir' : 'Sonraki kart →';
    const ipucu = ipucuMetni(s);
    yaprak = `<section class="alt-yaprak" aria-live="polite">
      <p class="sonuc" data-test="sonuc" data-dogru="${dogru}">${ikon(dogru ? 'dogru' : 'yanlis', 18, 2)}<b>${sonuc[0]}</b>${sonuc[1] ? `<span class="sonuc-not">${kacis(sonuc[1])}</span>` : ''}</p>
      <p class="bilgi"><b>${kacis(eserAdi(k.eser))}</b><i>${kacis(`${s.ad} · ${s.akim}`)}</i></p>
      ${secilen ? `<p class="ters-secilen" data-test="ters-secilen">Seçtiğin: ${kacis(eserAdi(secilen.eser))} · ${kacis(d.harita.get(cevap).ad)}</p>` : ''}
      ${seviyeSatiri(k)}
      ${ipucu ? `<div class="ipucu-kutu" data-ipucu><p class="ipucu">${kacis(ipucu)}</p></div>` : ''}
      <p class="kaynak-satir">${kaynakSatiri(k.eser, secilenGorsel(k.eser, kotuler()))}</p>
      ${karsilastirBag}
      <div class="yaprak-dugmeler"><a class="dugme" href="#/sanatci/${encodeURIComponent(s.id)}" aria-label="Sanatçı sayfası">Sanatçı</a><button class="dugme acik" type="button" data-sonraki>${sonrakiYazi}</button></div>
    </section>`;
  }
  const onceki = o.sonCizim;
  const hareket = !onceki || onceki.konum !== ot.konum ? 'yeni-kart' : cevap !== null && !onceki.cevap ? 'cevap' : '';
  const oncekiYuzde = onceki && onceki.konum !== ot.konum ? onceki.yuzde : yuzde;
  o.sonCizim = { konum: ot.konum, adim: 1, cevap: cevap !== null, yuzde };
  ciz(
    `<header class="soru-ust">
      <button class="kapat" type="button" data-geri="#/pekistir" aria-label="Kapat">${ikon('kapat', 22, 1.7)}</button>
      <span class="etiket">${kacis(kipKisa(o.kip, o.akim))}</span>
      <span data-test="sayac">${sira} / ${ot.toplam}</span>
    </header>
    <div class="ince-cubuk" aria-hidden="true"><i style="width:${yuzde}%;--onceki:${oncekiYuzde}%"></i></div>
    <div class="ters-levha${cevap !== null ? ' kucuk' : ''}" data-test="ters-soru">
      <span class="ters-ust">${etiket(`Ters soru · ${SEVIYELER[k.seviye ?? 0].ad}`)}<span class="ters-yil">${kacis(yillarYaz(s))}</span></span>
      <span class="ters-sor">Hangisi bir</span>
      <h2 tabindex="-1" class="ters-isim">${kacis(s.ad)}</h2>
      <span class="ters-sor sag">eseri?</span>
    </div>
    ${govde}
    ${yaprak}`,
    hareket,
  );
  renkSabitle(null);
  karsiSeritDoldur();
  const y = ekran.querySelector('.alt-yaprak');
  if (y) {
    y.querySelector('[data-sonraki]').focus({ preventScroll: true });
    ipucuIsaretle(y);
    yaprakYerlestir();
    // ekranın rengi doğru eserden (cevaptan sonra artık ipucu değil)
    if (k.palet === undefined) ekranRengi(k.eser, null, (p) => (k.palet = p));
    else renkSabitle(k.palet);
  }
  if (!o.sonrakiKart && ot.konum + 1 < ot.toplam) {
    o.sonrakiKart = kartHazirla(o, ot.konum + 1).then((h) => {
      if (h && h.eser) new Image().src = gorselUrl(secilenGorsel(h.eser, kotuler()), 800);
      return h;
    });
  }
}

// Kartpostalı büyüt: kart masadan kalkıp ekranı kaplar; yana kaydırarak diğer kartlar, "Bu eser" ile cevap
function kartpostalAc(o, i, kaynak) {
  const k = o.kart;
  const gorsel = (x) => secilenGorsel(x.eser, kotuler()) || x.eser.gorseller[0];
  const el = document.createElement('div');
  el.className = 'kp-buyuk';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Eserler büyük');
  el.dataset.test = 'kp-buyuk';
  el.innerHTML = `<div class="kp-kaydir" data-kp-kaydir>${k.ters
    .map(
      (x, j) =>
        `<figure class="kp-slayt"><span class="kp-on"><span class="ters-cerceve"><img decoding="async" alt="${HARFLER[j]} eseri" src="${kacis(gorselUrl(gorsel(x), 800))}" data-yedek="${kacis(gorselYedek(gorsel(x)))}"></span><span class="kp-pul">${HARFLER[j]}</span></span></figure>`,
    )
    .join('')}</div>
    <div class="kp-noktalar" aria-hidden="true">${k.ters.map((x, j) => `<i data-kp-nokta="${j}"></i>`).join('')}</div>
    <div class="kp-dugmeler"><button class="dugme" type="button" data-kp-kapat>Masaya bırak</button><button class="dugme acik kp-bu" type="button" data-sanatci="${kacis(k.ters[i].id)}" data-test="kp-bu">Bu eser · ${HARFLER[i]}</button></div>`;
  // kart, dokunulan yerden büyür
  if (kaynak) {
    const r = kaynak.getBoundingClientRect();
    el.style.setProperty('--kaynak-x', `${r.left + r.width / 2}px`);
    el.style.setProperty('--kaynak-y', `${r.top + r.height / 2}px`);
  }
  ekran.appendChild(el);
  const kay = el.querySelector('[data-kp-kaydir]');
  kay.scrollLeft = i * kay.clientWidth;
  const bu = el.querySelector('.kp-bu');
  const isaretle = () => {
    const j = Math.max(0, Math.min(3, Math.round(kay.scrollLeft / kay.clientWidth)));
    bu.dataset.sanatci = k.ters[j].id;
    bu.textContent = `Bu eser · ${HARFLER[j]}`;
    el.querySelectorAll('[data-kp-nokta]').forEach((n) => n.classList.toggle('etkin', Number(n.dataset.kpNokta) === j));
  };
  isaretle();
  kay.addEventListener('scroll', isaretle, { passive: true });
  bu.focus({ preventScroll: true });
}

function kartpostalKapat() {
  const el = ekran.querySelector('.kp-buyuk');
  if (!el) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return el.remove();
  el.classList.add('kapaniyor');
  el.addEventListener('animationend', () => el.remove(), { once: true });
  setTimeout(() => el.remove(), 400); // animasyon çalışmazsa da kalksın
}

function kartGoster(o) {
  const k = o.kart;
  if (k.tanisma) return tanismaGoster(o);
  if (k.tur === 'ters') return tersGoster(o);
  const s = d.harita.get(k.id);
  const ot = o.oturum;
  const karisik = o.kip === 'karisik';
  const ikinci = karisik && k.adim === 2;
  const sira = Math.min(ot.konum + 1, ot.toplam);
  const yuzde = Math.round((100 * ot.konum) / ot.toplam);
  const cevap = ikinci ? k.cevapAkim : k.cevapSanatci;
  // Cevaptan sonra (D3) yalnızca doğru ve seçilen seçenek kalır; eser ekranın üstünde görünür kalsın
  const kalsin = (deger, dogruDeger) => cevap === null || deger === dogruDeger || deger === cevap;
  const sinif = `secenekler${cevap !== null ? ' daralmis' : ''}`;
  const secenekler = ikinci
    ? `<div class="${sinif}" data-test="akim-secenekleri">${k.akimSecenekleri
        .map((a, i) => (kalsin(a, s.akim) ? secenekDugmesi(a, a, i, k.cevapAkim, s.akim, 'akim') : ''))
        .join('')}</div>`
    : `<div class="${sinif}" data-test="sanatci-secenekleri">${k.secenekler
        .map((id, i) => (kalsin(id, k.id) ? secenekDugmesi(id, d.harita.get(id).ad, i, k.cevapSanatci, k.id, 'sanatci') : ''))
        .join('')}</div>`;
  const bilmiyorum = cevap === null ? `<button class="bilmiyorum" type="button" data-bilmiyorum data-test="bilmiyorum">Bilmiyorum</button>` : '';

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
      sonuc = dogru ? ['Doğru', ''] : k.cevapSanatci === BILMIYORUM ? ['Bilmiyorum', tekrarNotu] : ['Yanlış', tekrarNotu];
      bilgi = [s.ad, eserAdi(k.eser)];
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
      sonuc = dogru
        ? sanatciDogru
          ? ['Doğru', '']
          : ['Doğru', `sanatçı yanlıştı, ${tekrarNotu}`]
        : k.cevapAkim === BILMIYORUM
          ? ['Bilmiyorum', tekrarNotu]
          : ['Yanlış', tekrarNotu];
      bilgi = [s.akim, `${s.ad} (${yillarYaz(s)})`];
      const gorunur = new Set(d.akimlar.map((a) => a.ad));
      const komsular = ((d.akimlar.find((a) => a.ad === s.akim) || {}).komsular || []).filter((x) => gorunur.has(x));
      const ilkteGizlenen = akimiAciklarMi(ipucu, s.akim) ? ipucu : '';
      // K3: akım yanlışsa iki akımın karşılaştırması
      if (!dogru && k.cevapAkim && k.cevapAkim !== BILMIYORUM && d.akimlar.some((a) => a.ad === k.cevapAkim))
        karsilastirBag = `<a class="karsilastir-bag" href="${akimKarsilastirmaAdresi(s.akim, k.cevapAkim)}" data-test="akim-karsilastir">${ikon('karsilastir', 18, 1.6)}<span>Karşılaştır: ${kacis(s.akim)} ↔ ${kacis(k.cevapAkim)}</span></a>`;
      not = [komsular.length ? `Komşu akımlar: ${komsular.join(', ')}.` : '', ilkteGizlenen].filter(Boolean).join(' ');
      ileri = `<button class="dugme acik" type="button" data-sonraki>${sonrakiYazi}</button>`;
    }
    const tumDogru = ikinci ? sanatciDogru && k.cevapAkim === s.akim : sanatciDogru;
    yaprak = `<section class="alt-yaprak" aria-live="polite">
      <p class="sonuc" data-test="sonuc" data-dogru="${ikinci || !karisik ? tumDogru : dogru}">${ikon(dogru ? 'dogru' : 'yanlis', 18, 2)}<b>${sonuc[0]}</b>${sonuc[1] ? `<span class="sonuc-not">${kacis(sonuc[1])}</span>` : ''}</p>
      <p class="bilgi"><b>${kacis(bilgi[0])}</b><i>${kacis(bilgi[1])}</i></p>
      ${seviyeSatiri(k)}
      <div data-yaprak-palet>${paletHtml(k.palet)}</div>
      ${not ? `<div class="ipucu-kutu" data-ipucu><p class="ipucu">${kacis(not)}</p></div>` : ''}
      <p class="kaynak-satir">${kaynakSatiri(k.eser, secilenGorsel(k.eser, kotuler()))}</p>
      ${karsilastirBag}
      <div class="yaprak-dugmeler"><a class="dugme" href="#/sanatci/${encodeURIComponent(s.id)}" aria-label="Sanatçı sayfası">Sanatçı</a>${ileri}</div>
    </section>`;
  }

  // Hareket: yeni kartta tablo belirir; karışıkta 2. soruda yalnızca seçenekler; cevapta doğru parlar, yanlış sarsılır
  const onceki = o.sonCizim;
  const adim = ikinci ? 2 : 1;
  const hareket = !onceki || onceki.konum !== ot.konum ? 'yeni-kart' : onceki.adim !== adim ? 'yeni-soru' : cevap !== null && !onceki.cevap ? 'cevap' : '';
  const oncekiYuzde = onceki && onceki.konum !== ot.konum ? onceki.yuzde : yuzde;
  o.sonCizim = { konum: ot.konum, adim, cevap: cevap !== null, yuzde };
  const g = secilenGorsel(k.eser, kotuler()) || k.eser.gorseller[0];
  ciz(
    `<header class="soru-ust">
      <button class="kapat" type="button" data-geri="#/pekistir" aria-label="Kapat">${ikon('kapat', 22, 1.7)}</button>
      <span class="etiket">${kacis(kipKisa(o.kip, o.akim))}</span>
      <span data-test="sayac">${sira} / ${ot.toplam}</span>
    </header>
    <div class="ince-cubuk" aria-hidden="true"><i style="width:${yuzde}%;--onceki:${oncekiYuzde}%"></i></div>
    ${seviyeHaplari(o)}
    <div class="soru-sahne">
      <span class="hale-nefes" aria-hidden="true"></span>
      <button class="soru-resim" type="button" data-buyut aria-label="Görseli büyüt">
        <img decoding="async" alt="Sorulan eser" src="${kacis(gorselUrl(g, 800))}" data-test="soru-resim">
        <span class="durum" data-durum>Yükleniyor…</span>
      </button>
    </div>
    <div class="soru-baslik">
      <h2 tabindex="-1">${ikinci ? 'Hangi akım?' : 'Bu eser kimin?'}</h2>
      ${etiket(`${karisik ? `Soru ${ikinci ? 2 : 1} / 2` : 'Soru 1 / 1'} · ${SEVIYELER[k.seviye ?? 0].ad}`)}
    </div>
    ${secenekler}
    ${bilmiyorum}
    ${yaprak}`,
    hareket,
  );

  // Renk: sorulan eserden. Cevaptan önce akım rengine düşülmez (ipucu olurdu): palet yoksa nötr kalır.
  if (k.palet === undefined)
    ekranRengi(k.eser, null, (p) => {
      k.palet = p;
      const kutu = ekran.querySelector('[data-yaprak-palet]');
      if (kutu) kutu.innerHTML = paletHtml(p);
    });
  else renkSabitle(k.palet);

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
    y.querySelector('[data-sonraki],[data-ikinci]').focus({ preventScroll: true });
    ipucuIsaretle(y);
    yaprakYerlestir();
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
  // Ö6: konu turunda günlük yeni sınırı uygulanmaz, bu tanışmalar sayılmaz
  if (kip === 'konu') return;
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

// Sanatçı sorusunun cevabı; deger: sanatçı kimliği ya da BILMIYORUM (Ö4: yanlış sayılır, kutu 0;
// karıştırılan ikililere yazılmaz, dönem seviyesinin penceresine yarım ağırlıkla girer)
function sanatciCevapla(o, deger) {
  const k = o.kart;
  yeniSanatciSay(k.id, o.kip);
  k.cevapSanatci = deger;
  const dogru = deger === k.id;
  const bilmiyor = deger === BILMIYORUM;
  k.karisanSayi = dogru || bilmiyor ? 0 : karisanEkle(d.ilerleme, k.id, deger, bugun());
  skor(k.id).sanatci = cevapla(skor(k.id).sanatci, dogru, bugun());
  const akim = d.harita.get(k.id).akim;
  const kayit = seviyeKaydi(d.ilerleme, akim);
  // Ö9: ısınma için seçilen alt seviyedeki cevap dönemin penceresine yazılmaz
  if (o.seviye !== null && o.seviye !== undefined && !pencereyeYazilirMi(kayit, k.seviye))
    k.seviyeSonuc = { akim, isinma: true, once: kayit.s, sonra: kayit.s, gecti: false };
  else k.seviyeSonuc = { akim, ...seviyeIsle(d.ilerleme, akim, bilmiyor ? 'bilmiyorum' : dogru) };
  if (k.seviyeSonuc.gecti) (o.gecenler ||= []).push({ akim, seviye: k.seviyeSonuc.sonra });
  sonCalisilanEkle(d.ilerleme, k.id);
  baskaDeneme = 0;
  if (tekSorulu(o) || k.tur === 'ters') kartiBitir(o, dogru);
  else kaydet();
  yarimKaydet(o);
  kartGoster(o);
}

function akimCevapla(o, deger) {
  const k = o.kart;
  const s = d.harita.get(k.id);
  k.cevapAkim = deger;
  const dogru = deger === s.akim;
  skor(k.id).akim = cevapla(skor(k.id).akim, dogru, bugun());
  kartiBitir(o, dogru && k.cevapSanatci === k.id);
  yarimKaydet(o);
  kartGoster(o);
}

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
    ${gecenlerHtml(o.gecenler || [])}
    <div class="menu"><button class="dugme vurgu" type="button" data-yeni-tur>Bir tur daha</button><a class="dugme" href="#/">Bugün</a></div>
    ${toplam && !ot.yanlis ? yaldizYapraklari() : ''}`);
  sayarakYaz(ekran.querySelector('.ozet .ad'), ot.dogru, toplam);
}

// Sonuç sayısı sıfırdan sayarak gelir (hareket azaltma açıksa doğrudan yazılır)
function sayarakYaz(el, hedef, toplam) {
  if (!el || !hedef || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const bas = performance.now();
  const sure = Math.min(1200, 300 + hedef * 60);
  const adim = (t) => {
    if (!el.isConnected) return;
    const x = Math.min(1, (t - bas) / sure);
    el.textContent = `${Math.round(hedef * (1 - (1 - x) ** 3))} / ${toplam}`;
    if (x < 1) requestAnimationFrame(adim);
  };
  el.textContent = `0 / ${toplam}`;
  requestAnimationFrame(adim);
}

// Hepsi doğruysa ekranın üstünden süzülen yaldız yaprakları (dekoratif)
function yaldizYapraklari() {
  let h = '';
  for (let i = 0; i < 18; i++) {
    const r = (n) => (((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1;
    h += `<i style="--x:${(r(1) * 100).toFixed(1)}%;--g:${(r(2) * 1.6).toFixed(2)}s;--s:${(2.6 + r(3) * 2).toFixed(2)}s;--d:${Math.round(r(4) * 360)}deg;--b:${(6 + r(5) * 8).toFixed(1)}px"></i>`;
  }
  return `<div class="yaldiz-yapraklar" aria-hidden="true">${h}</div>`;
}

// ---------- Seviyeler (dönem başına) ----------
// Cevap yaprağında: dönemin seviyesi ve bu seviyedeki ilerleme; dönem seviye atladıysa kutlama
function seviyeSatiri(k) {
  const r = k.seviyeSonuc;
  if (!r) return '';
  const akim = r.akim || d.harita.get(k.id).akim;
  if (r.isinma)
    return `<p class="seviye-satir" data-test="seviye-isinma">${kacis(`Isınma · ${SEVIYELER[k.seviye ?? 0].ad} · ${akim} ${SEVIYELER[r.once].ad} penceresine yazılmadı`)}</p>`;
  if (r.gecti)
    return `<p class="seviye-satir gecti" data-test="seviye-gecti">${ikon('dogru', 16, 2)} ${kacis(akim)} ${kacis(SEVIYELER[r.sonra].ad)} seviyeye geçti</p>`;
  return `<p class="seviye-satir" data-test="seviye">${kacis(`${akim} · ${seviyeDurumu(seviyeKaydi(d.ilerleme, akim))}`)}</p>`;
}

function gecenlerHtml(gecenler) {
  const liste = gecenler.filter((x) => x.akim && d.akimlar.some((a) => a.ad === x.akim));
  if (!liste.length) return '';
  return `<section class="bolum" data-test="gecenler">${etiket('Seviye atlayan dönemler')}<ul class="liste">${liste
    .map(
      (x) =>
        `<li><a class="satir" href="#/pekistir/donem/${encodeURIComponent(x.akim)}"><span class="metin"><b>${kacis(x.akim)}</b><span>${kacis(SEVIYELER[x.seviye].ad)} seviyeye geçti</span></span>${ikon('ileri', 20, 1.4)}</a></li>`,
    )
    .join('')}</ul></section>`;
}

// Ö9 · Dönem turunun üstünde üç hap: Kolay · Orta · Zor. Açılmamış seviye kilitli; alt seviye ısınma içindir.
// Yalnızca tek dönemlik turda ve dönem Kolay'ı geçtiyse görünür.
function seviyeHaplari(o) {
  if (o.kip !== 'donem' || o.akim === 'hepsi') return '';
  const kayit = seviyeKaydi(d.ilerleme, o.akim);
  if (kayit.s < 1) return '';
  const simdiki = kartSeviyesi(kayit, o.seviye);
  return `<div class="seviye-haplar" role="group" aria-label="Seviye" data-test="seviye-haplar">${seviyeSecenekleri(kayit)
    .map((x) =>
      x.acik
        ? `<button type="button" class="seviye-hap sv-${x.anahtar}${x.no === simdiki ? ' secili' : ''}" data-seviye-sec="${x.no}" aria-pressed="${x.no === simdiki}">${x.ad}${x.no < kayit.s && x.no === simdiki ? '<small>ısınma</small>' : ''}</button>`
        : `<span class="seviye-hap kilitli" aria-label="${x.ad}, kilitli">${ikon('kilit', 13, 1.6)}${x.ad}</span>`,
    )
    .join('')}</div>`;
}

// Hap seçilince: cevaplanmamış kart yeni seviyeyle yeniden hazırlanır, önceden hazırlanan sonraki kart atılır
function seviyeSec(o, no) {
  const kayit = seviyeKaydi(d.ilerleme, o.akim);
  const yeni = no >= kayit.s ? null : no;
  if (yeni === o.seviye) return;
  o.seviye = yeni;
  o.sonrakiKart = null;
  if (o.kart && o.kart.cevapSanatci === null && !o.kart.bitti) o.kart = null;
  yarimKaydet(o);
  kartCiz();
}

function seviyeAciklamasi() {
  return `Her dönem Kolay'dan başlar; o dönemde son cevaplarının %${Math.round(GECIS_ORANI * 100)}'i doğru olmadan Orta'ya, sonra Zor'a geçmez.`;
}

// Dönem satırlarında seviye rozeti: "Kolay · 3/5"
function seviyeRozeti(akim) {
  const k = seviyeKaydi(d.ilerleme, akim);
  return `<span class="seviye-rozet sv-${SEVIYELER[k.s].anahtar}" data-test="seviye-rozet">${kacis(seviyeKisa(k))}</span>`;
}

// Ekranın olay dinleyicileri; app.js özgün sırayla bir kez bağlar
export function olaylariBagla() {
  ekran.addEventListener('click', (e) => {
    const p = e.target.closest('[data-ipucu].kesik');
    if (p) ipucuCevir(p);
  });

  ekran.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ekran.querySelector('.kp-buyuk')) return kartpostalKapat();
    const p = (e.key === 'Enter' || e.key === ' ') && e.target.closest?.('[data-ipucu].kesik');
    if (p) {
      e.preventDefault();
      ipucuCevir(p);
    }
  });

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
      pekistir(ys.dataset.kip, ys.dataset.akim || null, { yeni: true, onayli: true }).catch(hataGoster);
      return;
    }
    const o = d.oturum;
    const sv = e.target.closest('[data-seviye-sec]');
    if (sv && o && o.kip === 'donem') {
      seviyeSec(o, Number(sv.dataset.seviyeSec));
      return;
    }
    if (e.target.closest('[data-konu-tanisma-gec]') && o && o.tanisma) {
      const t = o.tanisma;
      o.tanismaGorulen[t.sira[t.konum]] = t.gosterilen || [];
      t.konum++;
      kartCiz();
      return;
    }
    if (e.target.closest('[data-tanisma-gec]') && o && o.kart) {
      o.kart.tanisma = false;
      kartGoster(o);
      ekran.querySelector('.soru-baslik h2').focus({ preventScroll: true });
      return;
    }
    const te = e.target.closest('[data-tanisma-eser]');
    if (te && o && o.tanismaEserleri) {
      const id = o.tanisma && o.tanisma.konum < o.tanisma.sira.length ? o.tanisma.sira[o.tanisma.konum] : o.kart && o.kart.id;
      goruntuleyiciAc({ eserler: o.tanismaEserleri, baslangic: Number(te.dataset.tanismaEser), notu: notuIcin(id), ...gorselTercihi() });
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
    const kpa = e.target.closest('[data-kp-ac]');
    if (kpa && o && o.kart && o.kart.ters && o.kart.cevapSanatci === null) {
      kartpostalAc(o, Number(kpa.dataset.kpAc), kpa);
      return;
    }
    if (e.target.closest('[data-kp-kapat]')) {
      kartpostalKapat();
      return;
    }
    const tb = e.target.closest('[data-ters-eser]');
    if (tb && o && o.kart && o.kart.ters) {
      const sira = o.kart.ters;
      goruntuleyiciAc({ eserler: sira.map((x) => x.eser), baslangic: Number(tb.dataset.tersEser), ...gorselTercihi() });
      return;
    }
    const bil = e.target.closest('[data-bilmiyorum]');
    if (bil && o && o.kart && !o.kart.bitti) {
      if (o.kart.cevapSanatci === null) sanatciCevapla(o, BILMIYORUM);
      else if (o.kip === 'karisik' && o.kart.adim === 2 && o.kart.cevapAkim === null) akimCevapla(o, BILMIYORUM);
      return;
    }
    if (sb && o && o.kart && o.kart.cevapSanatci === null) {
      sanatciCevapla(o, sb.dataset.sanatci);
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
      akimCevapla(o, ab.dataset.akim);
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
}
