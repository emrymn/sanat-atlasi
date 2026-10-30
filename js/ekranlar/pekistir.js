// Pekiştir: menü, oturum kurma (dönem, karışık, konu turu Ö6, hatalarım Ö5), kart çizimi ve cevaplar, yarım kalan oturum, tur özeti ve dönem seviyeleri.
import { kacis, yillarYaz } from '../yardimci.js';
import { akimDurumlari } from '../kilit.js';
import { cevapla, GUNLUK_YENI_SINIRI } from '../leitner.js';
import { sanatciSecenekleri, akimSecenekleri } from '../celdirici.js';
import { kartlariSec, Oturum, kategori, turAltYazisi } from '../oturum.js';
import { sanatciEserleri, eserSec, pekistirmeHavuzu, eserBaslik } from '../eserler.js';
import { gorselUrl, gorselYedek, secilenGorsel } from '../gorsel.js';
import { gunlukGuncelle, sonCalisilanEkle } from '../depo.js';
import { gecmisEkle } from '../gecmis.js';
import { bildirimSatiriHtml, bildirimTikla } from './bildirim.js';
import { goruntuleyiciAc } from '../goruntuleyici.js';
import { ikon } from '../tasarim.js';
import { bilinenAd } from '../adlar.js';
import { idbAl, idbKoy, idbSil } from '../idb.js';
import { kayitYap, kayitGecerliMi, kayittanKur, devamOzeti, devamKonumu } from '../devam.js';
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
  akimRenk,
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
  cizimNo,
  guncelMi,
  kucukKareleriDoldur,
  tabloDugme,
} from './ortak.js';
import { akimIstatistigi, seviyeIziHtml } from './pano.js';
import { turBilgisi, anaSayfa } from './bugun.js';
import {
  BOLUM_SORU,
  BOLUM_GECME,
  SEVIYE_NO,
  TANITIM_SEVIYE,
  bolumKartlari,
  bolumSonucuIsle,
  tanitimGoruldu,
  bolumKaydi,
  bolumAdi,
  bolumEserleri,
} from '../bolum.js';
import { akrabaMi } from '../celdirici.js';
import { bolumler as tumBolumler, durumlar as bolumDurumu } from './harita.js';
import { yonlendir } from './yonlendirme.js';
import { sallanmaBaslat } from '../sallanma.js';
import { desteBaslat } from '../deste.js';
import { cerceveTipi } from '../cerceve.js';

// ---------- İş 24 · harita bölümleri ----------
const BOLUM_SV_AD = { kolay: 'Kolay', orta: 'Orta', zor: 'Zor', tanitim: 'Tanıtım', 'tanitim-orta': 'Orta tanıtımı' };
const BOLUM_YONELME = { kolay: 'Kolay’a', orta: 'Orta’ya', zor: 'Zor’a' };
function bolumBilgi(akim) {
  const [id, sv] = String(akim || '').split('/');
  return { id, sv, b: tumBolumler().find((x) => x.id === id) || null };
}

const DONEM_SIRALARI = [
  ['sira', 'Sırayla'],
  ['tekrar', 'Tekrarı olan'],
  ['zayif', 'Zayıf önce'],
];
const HEDEFLER = [10, 20, 30];

// Bugünkü turun sahnesi: destenin ilk üç kartı, kart sayısı, türlerin oranı ve günlük hedef seçimi
function turSahnesi(karisik) {
  const b = bugun();
  const skorlar = d.ilerleme.skorlar;
  const deste = acikListe()
    .map((s) => ({ s, k: kategori(skorlar, s.id, 'karisik', b) }))
    .sort((x, y) => x.k - y.k)
    .slice(0, 3);
  const pek = karisik.zayif + karisik.diger;
  const dk = Math.max(1, Math.round((karisik.toplam * 20) / 60));
  const parca = [
    ['tekrar', karisik.tekrar, 'tekrar'],
    ['pek', pek, 'pekiştirme'],
    ['yeni', karisik.yeni, 'yeni'],
  ];
  const hedef = d.ilerleme.ayarlar.gunlukKart;
  const hedefler = [...new Set([...HEDEFLER, hedef])].sort((x, y) => x - y);
  const kapak = deste[0] ? deste[0].s : acikListe()[0];
  return `<section class="pk-sahne" aria-label="Bugünkü karışık tur">
      <div class="pk-resim" aria-hidden="true">${kapak ? `<span data-kucuk="${kacis(kapak.id)}" data-genislik="960"></span>` : ''}</div>
      <div class="pk-ust">${ust('Pekiştir', '#/', { geriYok: true, ustEtiket: 'Tekrar' })}</div>
      <div class="pk-deste${deste.length ? '' : ' bos'}" aria-hidden="true">${deste
        .map((x, i) => `<span class="pk-kart" style="--i:${i}"><span class="kucuk-kare" data-kucuk="${kacis(x.s.id)}"></span></span>`)
        .join('')}</div>
      <button class="egim-dugme" type="button" data-egim-dugme data-test="egim-dugme">${ikon('hareket', 16, 1.6)}Hareketi aç</button>
      <div class="pk-govde">
        ${etiket('Bugünkü tur', { vurgu: true })}
        <p class="pk-sayi"><b>${karisik.toplam}</b><span>kart<br>~${dk} dk</span></p>
        <span class="tur-karisim" role="img" aria-label="${parca.map(([, n, ad]) => `${n} ${ad}`).join(', ')}">${parca
          .filter(([, n]) => n)
          .map(([cls, n]) => `<i class="k-${cls}" style="flex-grow:${n}"></i>`)
          .join('')}</span>
        <ul class="tur-lejant">${parca.map(([cls, n, ad]) => `<li><i class="k-${cls}" aria-hidden="true"></i>${n} ${ad}</li>`).join('')}</ul>
        ${tabloDugme({
          href: '#/pekistir/karisik',
          test: 'karisik-dugme',
          baslik: 'Turu başlat',
          alt: turAltYazisi(karisik),
          sayi: karisik.toplam,
          sanatciId: kapak && kapak.id,
          sinif: 'pk-eser-dugme',
        })}
      </div>
    </section>
    <div class="hedef-sec pk-hedef"><span class="etiket" id="hedef-etiket">Günlük hedef</span><div class="secim-hap" role="group" aria-labelledby="hedef-etiket">${hedefler
      .map((n) => `<button type="button" data-gunluk-hedef="${n}" aria-pressed="${n === hedef}">${n}</button>`)
      .join('')}</div></div>`;
}

// Dönem salonu: dönemin temsilî eseri tam kart arka planı; ad, seviye ve doğruluk halkası üstünde
function temsilci(ad, acik) {
  const l = acik.filter((s) => s.akim === ad);
  return l.find((s) => s.kaynak === 'kurs') || l[0];
}
function oranHalkasi(oran) {
  const y = oran === null ? 0 : Math.round(100 * oran);
  return `<span class="salon-halka" role="img" aria-label="${oran === null ? 'henüz cevap yok' : `%${y} doğru`}"><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="19" pathLength="100"/><circle class="dolu" cx="22" cy="22" r="19" pathLength="100" style="--oran:${y}"/></svg><b>${oran === null ? '–' : y}</b></span>`;
}
function donemSatiri(a, turYazi, ist, i, acik) {
  const k = seviyeKaydi(d.ilerleme, a.ad);
  const s = temsilci(a.ad, acik);
  return `<li style="--i:${i}"><a class="salon donem-satir" href="#/pekistir/donem/${encodeURIComponent(a.ad)}" style="--akim:${akimRenk(a.ad)}">
      <span class="salon-resim" aria-hidden="true">${s ? `<span data-kucuk="${kacis(s.id)}" data-genislik="500"></span>` : ''}</span>
      <span class="salon-yazi">
        <span class="salon-ust">${akimNoktasi(a.ad)}${seviyeRozeti(a.ad)}</span>
        <b class="salon-ad">${kacis(a.ad)}</b>
        <span class="salon-alt">${a.acikSayisi} sanatçı · ${turYazi(turBilgisi('donem', a.ad))}</span>
        ${seviyeIziHtml(k)}
      </span>
      ${oranHalkasi(ist.oran)}
    </a></li>`;
}
function hepsiSalonu(acik, turYazi) {
  const ornek = [];
  const gorulen = new Set();
  for (const s of acik) if (!gorulen.has(s.akim) && ornek.length < 4) (gorulen.add(s.akim), ornek.push(s));
  return `<li style="--i:0"><a class="salon salon-hepsi" href="#/pekistir/donem/hepsi">
      <span class="salon-mozaik" aria-hidden="true">${ornek.map((s) => `<span data-kucuk="${kacis(s.id)}"></span>`).join('')}</span>
      <span class="salon-yazi">
        <span class="salon-ust"><span class="etiket vurgu">Bütün salonlar</span></span>
        <b class="salon-ad">Hepsi, dönem sırasıyla</b>
        <span class="salon-alt">${acik.length} sanatçı · ${turYazi(turBilgisi('donem', 'hepsi'))}</span>
      </span>
      <span class="salon-ok" aria-hidden="true">${ikon('ileri', 22, 1.5)}</span>
    </a></li>`;
}

export function pekistirMenusu() {
  const durumlar = akimDurumlari(d.akimlar, d.sanatcilar, islenen()).filter((a) => a.acik);
  // her satırda o turun kart sayısı (D1): turu açınca sayaç aynı sayıyı gösterir
  const turYazi = (t) => `${t.toplam} kart${t.tekrar ? ` · ${t.tekrar} tekrar` : ''}`;
  const karisik = turBilgisi('karisik');
  const acik = acikListe();
  const b = bugun();
  const istler = new Map(durumlar.map((a) => [a.ad, akimIstatistigi(a.ad, acik, d.ilerleme.skorlar, b)]));
  const sira = d.pekSira || 'sira';
  const sirali = durumlar.slice();
  if (sira === 'tekrar') sirali.sort((x, y) => istler.get(y.ad).vade - istler.get(x.ad).vade);
  if (sira === 'zayif')
    sirali.sort((x, y) => {
      const ox = istler.get(x.ad).oran;
      const oy = istler.get(y.ad).oran;
      return seviyeKaydi(d.ilerleme, x.ad).s - seviyeKaydi(d.ilerleme, y.ad).s || (ox ?? 2) - (oy ?? 2);
    });
  gununRengi();
  ciz(
    `${
      durumlar.length
        ? `${turSahnesi(karisik)}
    ${devamKarti()}
    ${hatalarSatiri()}
    <section class="bolum pk-salonlar">
      <div class="pk-bolum-bas"><span class="etiket vurgu">Döneme göre</span><h2 class="pk-baslik">Salonlar</h2></div>
      <p class="kucuk ikincil" style="margin:0">${seviyeAciklamasi()}</p>
      <div class="secim-hap donem-sira" role="group" aria-label="Dönemleri sırala">${DONEM_SIRALARI.map(([id, ad]) => `<button type="button" data-pek-sira="${id}" aria-pressed="${sira === id}">${ad}</button>`).join('')}</div>
      <ul class="salon-liste">
        ${hepsiSalonu(acik, turYazi)}
        ${sirali.map((a, i) => donemSatiri(a, turYazi, istler.get(a.ad), i + 1, acik)).join('')}
      </ul>
    </section>`
        : `${ust('Pekiştir', '#/', { geriYok: true, ustEtiket: 'Tekrar' })}${devamKarti()}${bosAcik()}`
    }`,
  );
  kucukKareleriDoldur();
  devamResmiDoldur();  // telefonu çevirince bugünkü turun destesi yelpaze açılır (İş 47; Ayarlar'daki hareket seçimine uyar)
  desteBaslat(ekran.querySelector('.pk-sahne'), d.ilerleme.ayarlar.egim !== false);
}

// Sıralama ve hedef değişince menü yerinde yeniden çizilir; kaydırma yeri korunur
function menuyuYenile() {
  const y = window.scrollY;
  pekistirMenusu();
  window.scrollTo(0, y);
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
  if (kip === 'bolum') {
    const { b } = bolumBilgi(akim);
    const ids = new Set(b ? b.sanatcilar : []);
    return b ? b.sanatcilar.map((id) => acik.find((s) => s.id === id)).filter((s) => s && ids.has(s.id)) : [];
  }
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
  if (kip === 'bolum') {
    // İş 24: bölümün sanatçıları sabit sayıda soruda; ilk Kolay'dan (ya da "Tanıtım"dan) önce hepsiyle tanışma
    const { id, sv } = bolumBilgi(akim);
    const idler = adaylar.map((x) => x.id);
    if (sv === 'tanitim' || sv === 'tanitim-orta') return { idler: [], tanisma: idler };
    // İş 30: Kolay'dan ve Orta'dan önce (ilk kez) o seviyenin eserleriyle tanışma
    const kayit = bolumKaydi(d.ilerleme, id);
    const ilk = (sv === 'kolay' && !kayit.tanitim) || (sv === 'orta' && !kayit.tanitimOrta);
    return { idler: bolumKartlari(idler, BOLUM_SORU[sv], d.rng), tanisma: ilk ? idler : [] };
  }
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
    seviye: kip === 'bolum' ? (SEVIYE_NO[bolumBilgi(akim).sv] ?? 0) : null, // Ö9: dönem turunda seçilen alt seviye; İş 24: bölümün seviyesi
    bolumSay: kip === 'bolum' ? { dogru: 0, toplam: 0 } : null, // İş 24: yalnız ilk denemeler sayılır
    tanisma: tur.tanisma && tur.tanisma.length ? { sira: tur.tanisma, konum: 0 } : null, // Ö6
    tanismaGorulen: {}, // tanışmada gösterilen eserler: soru bunlardan gelmesin
    kart: null,
    sonrakiKart: null,
    kimlik: `${Date.now().toString(36)}-${Math.floor(d.rng() * 1e9).toString(36)}`,
    gosterilen: [],
    gecenler: [], // bu turda seviye atlayan dönemler: [{ akim, seviye }]
  };
}

// Tur ekranlarının başlığı: kipin adı büyük, "Pekiştir" üstte küçük etiket (İş 50: "Pekiştir · Hatalarım" iki satıra taşıyordu)
function pkUst(kip, akim, yedek = '#/pekistir', ustEtiket = 'Pekiştir') {
  return ust(kipKisa(kip, akim), yedek, { ustEtiket });
}

function kipKisa(kip, akim) {
  if (kip === 'bolum') {
    const { sv, b } = bolumBilgi(akim);
    return `${b ? bolumAdi(b) : 'Bölüm'} · ${BOLUM_SV_AD[sv] || ''}`;
  }
  if (kip === 'karisik') return 'Karışık';
  if (kip === 'konu') return `Konu ${akim}`;
  if (kip === 'hatalar') return 'Hatalarım';
  return akim === 'hepsi' ? 'Hepsi' : akim;
}

// Turun adresi (yarım oturumdan dönünce)
export function turAdresi(kip, akim) {
  if (kip === 'bolum') return `#/pekistir/bolum/${akim}`;
  if (kip === 'karisik' || kip === 'hatalar') return `#/pekistir/${kip}`;
  return `#/pekistir/${kip}/${encodeURIComponent(akim)}`;
}

// Yalnızca sanatçı sorusu soran turlar (karışıkta bir de akım sorusu var)
const tekSorulu = (o) => o.kip !== 'karisik';

export async function pekistir(kip, akim, { yeni = false, onayli = false } = {}) {
  if (kip === 'bolum') {
    const { id, sv } = bolumBilgi(akim);
    const x = bolumDurumu().durumlar.find((y) => y.id === id);
    const gerekli = sv === 'tanitim' ? null : sv === 'tanitim-orta' ? 'orta' : sv;
    if (!x || !x.acik || (gerekli && !x.seviyeAcik[gerekli]))
      return ciz(
        `${pkUst(kip, akim, '#/harita')}<div class="bos-kutu" data-test="bolum-kapali"><p>Bu bölüm ya da seviye henüz açılmadı.</p><p><a class="dugme" href="#/harita">Haritaya dön</a></p></div>`,
      );
  }
  const o = d.oturum;
  if (yeni || !o || o.kip !== kip || o.akim !== akim || o.oturum.bitti) {
    // Yarım kalan oturum varken yeni oturum: önce sor (sayfa içinde)
    if (d.yarim && !onayli) return yarimSor(kip, akim);
    if (!acikListe().length) return ciz(`${pkUst(kip, akim)}${bosAcik()}`);
    ciz(`${pkUst(kip, akim)}<p class="ikincil">Kartlar hazırlanıyor…</p>`);
    const no = cizimNo();
    const yeniOturum = await oturumKur(kip, akim);
    // hazırlanırken (çevrimdışıyken sanatçı başına 6 sn sürebilir) başka ekrana geçildiyse kart çizilmez
    if (!guncelMi(no)) return;
    d.oturum = yeniOturum;
    if (!d.oturum.oturum.toplam && !(d.oturum.kip === 'bolum' && d.oturum.tanisma)) {
      d.oturum = null;
      return ciz(
        `${pkUst(kip, akim)}<div class="bos-kutu" data-test="kart-yok"><p>Bu seçim için şu an kart yok.</p><p class="kucuk ikincil">${
          kip === 'hatalar'
            ? 'Son 7 günde yanlış yaptığın sanatçı kalmadı.'
            : kip === 'konu'
              ? 'Bu konunun açık sanatçısı yok ya da görselleri bulunamadı.'
              : `Bugünkü yeni sanatçı sınırına (${GUNLUK_YENI_SINIRI}) ulaşmış olabilirsin ya da bu sanatçıların görseli bulunamadı.`
        }</p><div class="iki-dugme">${kip === 'karisik' ? '' : '<a class="dugme vurgu" href="#/pekistir/karisik">Karışık tur başlat</a>'}<a class="dugme" href="#/pekistir">Pekiştir’e dön</a></div></div>`,
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
    // Dönemin seviyesi sorunun zorluğunu belirler: eser (kolay → tipik/ünlü) ve şıklar (kolay ��� uzak dönemler).
    // Ö9: dönem turunda alt seviye seçildiyse o seviye
    const sv = o.kip === 'bolum' ? o.seviye : kartSeviyesi(seviyeKaydi(d.ilerleme, s.akim), o.seviye);
    // Ö6: tanışmada görülen eserler de sorulmaz — İş 30: bölümde tersine, soru yalnız tanıtılan eserlerden
    const bolumSv = o.kip === 'bolum' ? SEVIYELER[sv].anahtar : null;
    const katman = bolumSv ? bolumEserleri(pekistirmeHavuzu(eserler, kotuler()), bolumSv, kolaylikFn(s.id)) : null;
    const kacin = katman ? son : [...son, ...((o.tanismaGorulen || {})[s.id] || [])];
    // K4: Koleksiyonum'daki eserler iki kat sık
    const isaretli = new Set((d.ilerleme.koleksiyon || []).filter((x) => x.s === s.id).map((x) => x.a));
    const eser = katman
      ? eserSec(katman, kacin, d.rng, kotuler(), { kolaylik: null, seviye: null, isaretli })
      : eserSec(eserler, kacin, d.rng, kotuler(), { kolaylik: kolaylikFn(s.id), seviye: eserSeviyesi(sv), isaretli });
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
        // İş 30: bölümün Kolay ve Orta'sında 1 şaşırtmalı + 2 uzak şık
        seviye: katman ? 'karma' : SEVIYELER[sv].anahtar,
      }).map((x) => x.id);
    let secenekler = secici();
    // Ö5: karıştırılan ikilinin eşi şıklarda
    const es = o.esler && o.esler[s.id];
    if (es && d.harita.has(es) && !akrabaMi(s, d.harita.get(es))) secenekler = esiEkle(secenekler, s.id, es, d.rng);
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
  if (o.kip === 'bolum' && o.tanisma && !o.tanitimIsaret) {
    o.tanitimIsaret = true;
    const { id, sv } = bolumBilgi(o.akim);
    tanitimGoruldu(d.ilerleme, id, TANITIM_SEVIYE[sv]);
    kaydet();
  }
  const konum = o.oturum.konum;
  const no = cizimNo();
  if ((!o.kart || o.kart.konum !== konum) && o.bekleyenKart) {
    // Devam: kayıttaki kart aynı eserle ve aynı adımdan; sanatçı, eser ya da seçenek artık yoksa kart atlanır
    const bk = o.bekleyenKart;
    o.bekleyenKart = null;
    const geri = bk.konum === konum ? await kartiGeriKur(bk) : null;
    if (d.oturum !== o) return;
    if (!guncelMi(no)) {
      // kart kurulurken başka ekrana geçildi: kart başka ekranın üstüne çizilmez, devamda yeniden kurulur
      o.bekleyenKart = bk;
      return;
    }
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
    if (!guncelMi(no)) {
      o.sonrakiKart = Promise.resolve(hazir);
      return;
    }
    if (!hazir || !hazir.eser) {
      o.oturum.ilerle();
      return kartCiz();
    }
    // konu turunda tanışmalar turdan önce yapıldı
    hazir.tanisma = o.kip !== 'konu' && o.kip !== 'bolum' && tanismaAcik() && tanismaGerekirMi(d.ilerleme.skorlar[hazir.id]);
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
  if (!o || d.oturum !== o || o.kip === 'bolum') return;
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

// İş 85: yarım kalan tur, müzik çalardaki "şimdi çalıyor" şeridi gibi: solda kalınan sorunun tablosu, ortada tur ve
// ilerleme çizgisi, sağda yuvarlak devam düğmesi, köşede bitir (×)
export function devamKarti() {
  const y = d.yarim;
  if (!y || !kayitGecerliMi(y)) return '';
  const toplam = y.kuyruk.length;
  const konum = devamKonumu(y);
  const oran = Math.round((100 * Math.max(0, konum - 1)) / Math.max(1, toplam));
  const eser = y.kart && y.kart.eser ? `${y.kart.id}|${y.kart.eser}` : '';
  return `<section class="devam-kart" data-test="devam-kart" aria-label="Yarım kalan tur">
      <span class="devam-resim" aria-hidden="true"${eser ? ` data-devam-eser="${kacis(eser)}"` : ''}></span>
      <div class="devam-yazi">
        <span class="etiket vurgu">Yarım kalan tur</span>
        <b data-test="devam-ozet">${kacis(devamOzeti(y))}</b>
        <span class="devam-cizgi" role="img" aria-label="${toplam} karttan ${Math.max(0, konum - 1)} tanesi bitti"><i style="--oran:${oran}%"></i></span>
      </div>
      <a class="devam-oynat" href="#/pekistir/devam" data-test="devam-et" aria-label="Devam et">${ikon('ileri', 24, 2)}</a>
      <button class="devam-bitir" type="button" data-yarim-bitir aria-label="Bitir">${ikon('kapat', 15, 2)}</button>
    </section>`;
}

// devam kartındaki küçük tablo: kalınan sorunun eseri (yoksa boş zemin kalır)
function devamResmiDoldur() {
  const el = ekran.querySelector('[data-devam-eser]');
  if (!el) return;
  const [id, anahtar] = el.dataset.devamEser.split('|');
  const s = d.harita.get(id);
  if (!s) return;
  sanatciEserleri(s).then((eserler) => {
    const e = eserler.find((x) => x.anahtar === anahtar);
    const g = e && (secilenGorsel(e, kotuler()) || e.gorseller[0]);
    if (g && el.isConnected) el.innerHTML = `<img decoding="async" alt="" src="${kacis(gorselUrl(g, 400))}" data-yedek="${kacis(gorselYedek(g))}">`;
  });
}

function yarimSor(kip, akim) {
  ciz(`${pkUst(kip, akim)}
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

// Paspartulu büyük eser + küçük şerit. Şeritte başka esere dokunmak vitrini değiştirir,
// seçili olana (ya da vitrine) dokunmak görüntüleyiciyi açar.
function tanismaVitrin(eserler) {
  const bilgi = eserler.map((e) => {
    const g = secilenGorsel(e, kotuler()) || e.gorseller[0];
    return { baslik: eserBaslik(e), buyuk: gorselUrl(g, 900), kucuk: gorselUrl(g, 240), yedek: gorselYedek(g) };
  });
  const ilk = bilgi[0];
  const n = bilgi.length;
  return `<figure class="tanisma-vitrin">
      <button class="tanisma-pano" type="button" data-tanisma-eser="0" aria-label="${kacis(ilk.baslik)} — büyüt">
        <img decoding="async" alt="" src="${kacis(ilk.buyuk)}" data-yedek="${kacis(ilk.yedek)}">
      </button>
      <figcaption class="tanisma-alyazi">
        <span class="tanisma-baslik-yazi">${kacis(ilk.baslik)}</span>
        ${n > 1 ? `<span class="tanisma-sira" aria-hidden="true">1 / ${n}</span>` : ''}
      </figcaption>
    </figure>
    ${
      n > 1
        ? `<div class="tanisma-serit" role="group" aria-label="Eserler">${bilgi
            .map(
              (b, i) =>
                `<button class="tanisma-eser" type="button" data-tanisma-eser="${i}" data-buyuk="${kacis(b.buyuk)}" data-yedek-buyuk="${kacis(b.yedek)}" data-baslik="${kacis(b.baslik)}" aria-pressed="${i === 0}" aria-label="${kacis(b.baslik)}"><img decoding="async" alt="" src="${kacis(b.kucuk)}" data-yedek="${kacis(b.yedek)}"></button>`,
            )
            .join('')}</div>`
        : ''
    }`;
}

function tanismaVitrinSec(dugme) {
  const serit = dugme.closest('.tanisma-serit');
  const pano = ekran.querySelector('.tanisma-pano');
  if (!serit || !pano) return;
  const i = dugme.dataset.tanismaEser;
  const img = pano.querySelector('img');
  img.dataset.yedek = dugme.dataset.yedekBuyuk;
  img.src = dugme.dataset.buyuk;
  pano.dataset.tanismaEser = i;
  pano.setAttribute('aria-label', `${dugme.dataset.baslik} — büyüt`);
  ekran.querySelector('.tanisma-baslik-yazi').textContent = dugme.dataset.baslik;
  const sira = ekran.querySelector('.tanisma-sira');
  if (sira) sira.textContent = `${Number(i) + 1} / ${serit.children.length}`;
  for (const b of serit.children) b.setAttribute('aria-pressed', String(b === dugme));
  pano.classList.remove('degisti');
  void pano.offsetWidth;
  pano.classList.add('degisti');
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
      <div class="tanisma-kartel">
        ${etiket(etiketYazi, { vurgu: true })}
        ${isimHtml(s, { etiketAdi: 'h2', sinif: 'tanisma-ad', ek: ' tabindex="-1"' })}
        <p class="meta">${kacis(yillarYaz(s))} · ${kacis(s.akim)}</p>
      </div>
      ${eserler.length ? tanismaVitrin(eserler) : ''}
      ${ipucu ? `<div class="tanisma-ipucu"><h3 class="tanisma-ipucu-baslik">Nasıl tanırım?</h3><p class="okuma tanisma-not">${kacis(ipucu)}</p></div>` : ''}
      <p class="kucuk ikincil tanisma-sonra">${not}</p>
      <div class="tanisma-alt">${dugme}</div>
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
    dugme: gecDugme({ ozellik: 'data-tanisma-gec', ust: 'Tanıdım', ana: 'Soruya geç' }),
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
  const havuz = pekistirmeHavuzu(eserler || [], kotuler());
  // İş 30: bölümde o seviyenin BOLUM_ESER eseri (sorular yalnız bunlardan); konu turunda en bilinen 3
  const tanSv = o.kip === 'bolum' ? TANITIM_SEVIYE[bolumBilgi(o.akim).sv] : null;
  const sec = tanSv ? bolumEserleri(havuz, tanSv, kolaylikFn(id)) : tanismaEserleri(havuz, null, 3, kolaylikFn(id));
  if (!s || !sec.length) {
    t.konum++;
    return kartCiz();
  }
  t.gosterilen = sec.map((e) => e.anahtar);
  const son = t.konum + 1 >= t.sira.length;
  const bolum = o.kip === 'bolum';
  tanismaCiz(o, s, sec, {
    sayac: `Tanışma ${t.konum + 1} / ${t.sira.length}`,
    etiketYazi: bolum ? `${bolumAdi(bolumBilgi(o.akim).b)} · ${tanSv === 'orta' ? 'Orta tanıtımı' : 'tanıtım'}` : `Konu ${o.akim} · yeni sanatçı`,
    not: son
      ? bolum
        ? o.oturum.toplam
          ? `Sırada bu sanatçılardan ${o.oturum.toplam} soruluk ${BOLUM_SV_AD[tanSv]} seviye var; sorular buradaki eserlerden. Geçmek için %${Math.round(BOLUM_GECME * 100)} doğru.`
          : 'Tanıtım bitti.'
        : `Sırada bu konunun sanatçılarından ${o.oturum.toplam} kartlık kısa bir tur var.`
      : bolum
        ? 'Sonra bu bölümün öbür sanatçısı geliyor.'
        : 'Sonra bu konunun öbür yeni sanatçısı geliyor.',
    dugme: gecDugme({
      ozellik: 'data-konu-tanisma-gec data-test="konu-tanisma-gec"',
      ust: son ? (bolum && !o.oturum.toplam ? 'Tanıtım bitti' : 'Hazırsan') : 'Sıradaki sanatçı',
      ana: son
        ? bolum && !o.oturum.toplam
          ? 'Haritaya dön'
          : bolum
            ? `${BOLUM_YONELME[tanSv] || 'Kolay’a'} başla`
            : 'Tura başla'
        : d.harita.get(t.sira[t.konum + 1])?.ad || 'Sonraki sanatçı',
      adim: t.konum,
      toplam: t.sira.length,
      geri: t.gecmis && t.gecmis.length ? d.harita.get(t.sira[t.gecmis[t.gecmis.length - 1]])?.ad || 'Önceki sanatçı' : '',
    }),
  });
}

// İleri düğmesi: müze kartelası gibi; üstte küçük yön yazısı, altta sıradaki adım, sağda dönen mühürlü ok.
// toplam verilirse üstünde tanışma adımlarını gösteren çentikler çıkar; geri verilirse solda geri düğmesi.
function gecDugme({ ozellik, ust, ana, adim = 0, toplam = 0, geri = '' }) {
  const centik =
    toplam > 1
      ? `<span class="gec-centikler" aria-hidden="true">${Array.from({ length: toplam }, (_, i) => `<i class="${i < adim ? 'gecti' : i === adim ? 'simdi' : ''}"></i>`).join('')}</span>`
      : '';
  const geriDugme = geri
    ? `<button class="tanisma-geri" type="button" data-konu-tanisma-geri data-test="konu-tanisma-geri" aria-label="Önceki sanatçı: ${kacis(geri)}">${ikon('geri', 20, 1.6)}</button>`
    : '';
  return `${centik}<div class="gec-satir">${geriDugme}<button class="tanisma-gec" type="button" ${ozellik}>
    <span class="gec-dalga" aria-hidden="true"></span>
    <span class="gec-parilti" aria-hidden="true"></span>
    <span class="gec-yazi"><span class="gec-ust">${kacis(ust)}</span><span class="gec-ana">${kacis(ana)}</span></span>
    <span class="gec-ok" aria-hidden="true"><span class="gec-halka"></span>${ikon('ileri', 20, 1.6)}</span>
  </button></div>`;
}

// Basınca kartın üstüne basılan noktadan mürekkep yayılır, ok fırlar; sonra adım değişir.
function gecAnimasyonu(e, btn, sonra) {
  if (btn.classList.contains('gidiyor')) return;
  const r = btn.getBoundingClientRect();
  const klavye = e.detail === 0;
  btn.style.setProperty('--x', `${klavye ? r.width - 32 : e.clientX - r.left}px`);
  btn.style.setProperty('--y', `${klavye ? r.height / 2 : e.clientY - r.top}px`);
  btn.classList.add('gidiyor');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return sonra();
  setTimeout(sonra, 340);
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
  // kart, dokunulan yerden b��yür
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
      ${bildirimSatiriHtml(kaynakSatiri(k.eser, secilenGorsel(k.eser, kotuler())))}
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
  if (kip === 'konu' || kip === 'bolum') return;
  const g = gunlukGuncelle(d.ilerleme, bugun());
  if (kategori(d.ilerleme.skorlar, id, kip, bugun()) === 2 && !g.yeniIdler.includes(id)) {
    g.yeniIdler.push(id);
    g.yeni++;
  }
}

function kartiBitir(o, dogruMu) {
  o.kart.bitti = true;
  if (o.bolumSay && o.oturum.simdiki && !o.oturum.simdiki.tekrar) {
    o.bolumSay.toplam++;
    if (dogruMu) o.bolumSay.dogru++;
    sergiyeEkle(o, dogruMu);
  }
  o.oturum.isle(dogruMu);
  gunlukGuncelle(d.ilerleme, bugun()).kart++;
  const s = d.harita.get(o.kart.id);
  gecmisEkle(d.ilerleme, bugun(), { dogru: dogruMu, akim: s && s.akim });
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
  if (o.kip === 'bolum') k.seviyeSonuc = { akim, bolum: o.akim };
  else if (o.seviye !== null && o.seviye !== undefined && !pencereyeYazilirMi(kayit, k.seviye))
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

function sergiyeEkle(o, dogruMu) {
  const k = o.kart;
  const g = k.eser && (secilenGorsel(k.eser, kotuler()) || k.eser.gorseller?.[0]);
  if (!g) return;
  (o.sergi ||= []).push({
    g: gorselUrl(g, 240),
    y: gorselYedek(g),
    sanatci: d.harita.get(k.id)?.ad || '',
    akim: d.harita.get(k.id)?.akim || '',
    dogru: dogruMu,
  });
}

function bolumOzeti(o) {
  const { id, sv, b } = bolumBilgi(o.akim);
  if (sv === 'tanitim') {
    d.oturum = null;
    return location.replace('#/harita');
  }
  if (o.bolumSonuc === undefined) {
    o.bolumSonuc = bolumSonucuIsle(d.ilerleme, id, sv, o.bolumSay.dogru, o.bolumSay.toplam);
    kaydet();
  }
  const r = o.bolumSonuc;
  const sonraki = sv === 'kolay' ? 'orta' : sv === 'orta' ? 'zor' : null;
  const yuzde = Math.round(r.oran * 100);
  const metin = r.gecti
    ? sv === 'orta'
      ? 'Orta’yı geçtin: sıradaki bölümün yolu açıldı.'
      : sv === 'kolay'
        ? 'Kolay’ı geçtin: Orta açıldı.'
        : 'Zor’u da geçtin: bu bölümü ustaca bitirdin.'
    : `Geçmek için %${Math.round(BOLUM_GECME * 100)} gerekiyor. Yanlış yaptıkların daha sık karşına çıkacak.`;
  const yeniAcilan = r.gecti ? sonraki : null;
  const SIRA = ['kolay', 'orta', 'zor'];
  const ROMA = ['I', 'II', 'III'];
  const buradaI = Math.max(0, SIRA.indexOf(sv));
  const hedefI = yeniAcilan ? SIRA.indexOf(yeniAcilan) : buradaI;
  const duraklar = SIRA.map((x, i) => {
    const durum = i < r.yildizSonra ? 'gecti' : x === yeniAcilan ? 'acildi' : 'kilitli';
    const durumAd = durum === 'gecti' ? 'geçildi' : durum === 'acildi' ? 'yeni açıldı' : 'kilitli';
    const burada = i === buradaI;
    const alt = burada ? 'Buradasın' : durum === 'acildi' ? 'Açıldı' : durum === 'gecti' ? 'Geçildi' : 'Kapalı';
    return `<li class="durak ${durum}${burada ? ' burada' : ''}" style="--i:${i}" aria-label="${BOLUM_SV_AD[x]} salonu: ${durumAd}${burada ? ', buradasın' : ''}">
        <span class="durak-nokta" aria-hidden="true">${durum === 'kilitli' ? ikon('kilit', 11, 1.8) : ''}</span>
        <b aria-hidden="true">${ROMA[i]}</b>
        <span class="durak-ad" aria-hidden="true">${BOLUM_SV_AD[x]}</span>
        <small aria-hidden="true">${alt}</small>
      </li>`;
  }).join('');
  const etiket = b ? bolumAdi(b) : kipKisa(o.kip, o.akim);
  const yanlisSay = o.bolumSay.toplam - o.bolumSay.dogru;
  const gecis = (yazi, ad) =>
    `<span class="gecis-yazi"><small>${yazi}</small><b>${ad}</b></span>
     <span class="gecis-ok" aria-hidden="true">${ikon('ileri', 20, 1.7)}</span>`;
  const eserler = o.sergi || [];
  const izSirasi = eserler.length ? eserler.map((e) => !!e.dogru) : Array.from({ length: o.bolumSay.toplam }, (_, i) => i < o.bolumSay.dogru);
  const izler = izSirasi.map((ok, i) => `<span class="skor-iz${ok ? ' dogru' : ''}" style="--i:${i}"></span>`).join('');
  const hedefYuzde = Math.round(BOLUM_GECME * 100);
  const duvar = eserler
    .map((e, i) => {
      const egim = e.dogru ? ((i * 37) % 5) - 2 : i % 2 ? 7 : -8;
      return `<li class="asi${e.dogru ? '' : ' egri'}" style="--i:${i};--egim:${egim * 0.5}deg;--ip:${10 + ((i * 13) % 4) * 6}px" aria-label="${kacis(e.sanatci)}: ${e.dogru ? 'tanıdın' : 'tanıyamadın'}">
        <span class="asi-ip" aria-hidden="true"></span>
        <span class="asi-cerceve" data-cerceve="${cerceveTipi(e.akim)}"><img decoding="async" loading="lazy" alt="" src="${kacis(e.g)}" data-yedek="${kacis(e.y)}"></span>
        ${e.dogru ? '' : `<span class="asi-pul" aria-hidden="true">?</span>`}
      </li>`;
    })
    .join('');
  ciz(`${ust(b ? bolumAdi(b) : kipKisa(o.kip, o.akim), '#/harita', { ustEtiket: `${r.gecti ? 'Sergi açıldı' : 'Sergi hazırlanıyor'} · ${BOLUM_SV_AD[sv] || ''}` })}
    <div class="ozet bolum-sonuc" data-test="bolum-ozet" data-gecti="${r.gecti}">
      ${
        eserler.length
          ? `<section class="sergi-duvar" aria-label="Bu bölümde karşına çıkan eserler" data-sergi-duvar>
        <button class="egim-dugme" type="button" data-egim-dugme data-test="egim-dugme">${ikon('hareket', 16, 1.6)}Hareketi aç</button>
        <ul class="sergi-asilar" style="--n:${eserler.length}">${duvar}</ul>
        <span class="sergi-isik" aria-hidden="true"></span>
      </section>`
          : ''
      }
      <div class="sonuc-alt" style="--gecikme:${0.5 + eserler.length * 0.12}s">
        <section class="skor" aria-label="Sonuç" style="--oran:${yuzde}%;--hedef:${hedefYuzde}%">
          <p class="skor-ust"><b>Senin gözün</b> · ${kacis(etiket)} · ${BOLUM_SV_AD[sv] || ''}</p>
          <p class="skor-yuzde"><i class="ad">%${yuzde}</i><span class="skor-durum">${r.gecti ? 'Geçti' : 'Az kaldı'}</span></p>
          <div class="skor-cizgi" aria-hidden="true">
            <span class="skor-dolu"></span>
            <span class="skor-hedef"><small>Hedef %${hedefYuzde}</small></span>
          </div>
          <div class="skor-izler" role="img" aria-label="${o.bolumSay.dogru} doğru, ${yanlisSay} yanlış, ${o.bolumSay.toplam} eser">${izler}</div>
          <p class="skor-sayi" aria-hidden="true"><span><b>${o.bolumSay.dogru}</b> doğru</span><span><b>${yanlisSay}</b> yanlış</span><span><b>${o.bolumSay.toplam}</b> eser</span></p>
          <p class="skor-not">${metin}</p>
        </section>
        <section class="yol" aria-label="Salonlar" style="--bas:${buradaI};--son:${hedefI}">
          <ol class="yol-duraklar">${duraklar}</ol>
          <span class="yol-isik" aria-hidden="true"></span>
        </section>
        <div class="menu sonuc-menu">
          ${r.gecti && sonraki ? `<a class="gecis" href="#/pekistir/bolum/${id}/${sonraki}" data-gecis data-test="bolum-sonraki">${gecis(`${BOLUM_SV_AD[sonraki]} salonu açıldı`, `${BOLUM_SV_AD[sonraki]} salonuna geç`)}</a>` : ''}
          ${r.gecti ? '' : `<button class="gecis" type="button" data-gecis data-yeni-tur data-test="bolum-tekrar">${gecis('Eserler yeniden asılsın', 'Tekrar dene')}</button>`}
          <a class="sonuc-harita" href="#/harita" data-test="bolum-harita">${ikon('harita', 16, 1.6)}<span>Haritaya dön</span></a>
        </div>
      </div>
    </div>
    ${r.yeniGecti ? yaldizYapraklari() : ''}`);
  yuzdeSayarakYaz(ekran.querySelector('.bolum-sonuc .ad'), yuzde);
  for (const el of ekran.querySelectorAll('[data-gecis]')) el.addEventListener('click', gecisiAk);
  // telefonu eğince asılı tablolar ipinden sallanır (İş 39; Ayarlar'daki hareket seçimine uyar)
  sallanmaBaslat(ekran.querySelector('[data-sergi-duvar]'), d.ilerleme.ayarlar.egim !== false);
}

function gecisiAk(e) {
  const el = e.currentTarget;
  if (el.dataset.akti || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  e.preventDefault();
  e.stopPropagation();
  if (el.classList.contains('akiyor')) return;
  el.classList.add('akiyor');
  setTimeout(() => {
    if (!el.isConnected) return;
    el.dataset.akti = '1';
    el.click();
  }, 520);
}

function yuzdeSayarakYaz(el, hedef) {
  if (!el || !hedef || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const bas = performance.now() + 350;
  const adim = (t) => {
    if (!el.isConnected) return;
    const x = Math.max(0, Math.min(1, (t - bas) / 900));
    el.textContent = `%${Math.round(hedef * (1 - (1 - x) ** 3))}`;
    if (x < 1) requestAnimationFrame(adim);
  };
  el.textContent = '%0';
  requestAnimationFrame(adim);
}

function ozetCiz() {
  const o = d.oturum;
  if (o.kip === 'bolum') return bolumOzeti(o);
  const ot = o.oturum;
  if (d.yarim && d.yarim.kimlik === o.kimlik) yarimSil();
  const toplam = ot.dogru + ot.yanlis;
  ciz(`${pkUst(o.kip, o.akim, '#/pekistir', 'Tur bitti')}
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
  // İş 24: bölüm turunda dönem seviyesi değil bölümün geçme sınırı
  if (r.bolum) {
    const { b, sv } = bolumBilgi(r.bolum);
    const n = BOLUM_SORU[sv] || 0;
    return `<p class="seviye-satir" data-test="seviye-bolum">${kacis(`${b ? bolumAdi(b) : 'Bölüm'} · ${BOLUM_SV_AD[sv] || ''} · geçmek için ${Math.ceil(n * BOLUM_GECME)} / ${n} doğru`)}</p>`;
  }
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
    const ps = e.target.closest('[data-pek-sira]');
    if (ps) {
      d.pekSira = ps.dataset.pekSira;
      menuyuYenile();
      ekran.querySelector(`[data-pek-sira="${ps.dataset.pekSira}"]`)?.focus({ preventScroll: true });
      return;
    }
    const gh = e.target.closest('[data-gunluk-hedef]');
    if (gh) {
      d.ilerleme.ayarlar.gunlukKart = Math.min(100, Math.max(5, Number(gh.dataset.gunlukHedef)));
      kaydet();
      menuyuYenile();
      ekran.querySelector(`[data-gunluk-hedef="${gh.dataset.gunlukHedef}"]`)?.focus({ preventScroll: true });
      return;
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
    const kg = e.target.closest('[data-konu-tanisma-gec]');
    if (kg && o && o.tanisma) {
      gecAnimasyonu(e, kg, () => {
        if (d.oturum !== o) return;
        const t = o.tanisma;
        o.tanismaGorulen[t.sira[t.konum]] = t.gosterilen || [];
        t.gecmis = [...(t.gecmis || []), t.konum];
        t.konum++;
        kartCiz();
      });
      return;
    }
    if (e.target.closest('[data-konu-tanisma-geri]') && o && o.tanisma && o.tanisma.gecmis && o.tanisma.gecmis.length) {
      const t = o.tanisma;
      t.konum = t.gecmis[t.gecmis.length - 1];
      t.gecmis = t.gecmis.slice(0, -1);
      kartCiz();
      return;
    }
    const tg = e.target.closest('[data-tanisma-gec]');
    if (tg && o && o.kart) {
      gecAnimasyonu(e, tg, () => {
        if (d.oturum !== o || !o.kart) return;
        o.kart.tanisma = false;
        kartGoster(o);
        ekran.querySelector('.soru-baslik h2').focus({ preventScroll: true });
      });
      return;
    }
    const te = e.target.closest('[data-tanisma-eser]');
    if (te && o && o.tanismaEserleri) {
      if (te.classList.contains('tanisma-eser') && te.getAttribute('aria-pressed') === 'false') {
        tanismaVitrinSec(te);
        return;
      }
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
    if (o && o.kart && o.kart.eser && bildirimTikla(e, o.kart.eser)) return;
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
