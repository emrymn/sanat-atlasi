// Çalış · Ders düzeni (1.79.0): her akım bir ders, üç adım: Gör → Öğren → Ayırt et; sonra "Haritaya geç".
// Bu dosya ekranlar: Çalış'ın girişi (bugünün dersi, günlük tekrar, dersler, başka turlar), ders sayfası ve adımlar.
// İş 191: Sına adımı kalktı; dönemin sınavı haritadaki duraklardır ve duraklar ders bitince açılır (js/bolum.js).
// Kayıt: js/ders.js; içerik seçimi: js/dersIcerik.js.
// Tasarım: https://claude.ai/artifact/VFJEDsgn6e7278NmuBgsYF
//
// Doğruluk: bu dosya yeni olgu yazmaz. Gör'ün metinleri data/yuruyus.json'dan, Öğren'in maddeleri ve cümleleri
// data/ders_kaynaklari.json'dan (yalnız doğrulanmışlar; seçim js/dersIcerik.js), Ayırt et'in madde listeleri iki akımın
// "Nasıl tanınır?" maddelerinden gelir. Eserler sanatçının doğrulanmış eser listesinden bulunur (sanatciEserleri).
import { kacis, bulunmaEki } from '../yardimci.js';
import { akimDurumlari } from '../kilit.js';
import { sanatciEserleri, eserBaslik } from '../eserler.js';
import { gorselUrl, gorselYedek, secilenGorsel, yuruyusAdresleri } from '../gorsel.js';
import { goruntuleyiciAc } from '../goruntuleyici.js';
import { gezin, hareketAz } from '../gecis.js';
import { kameraYolu, kameraKareleri, donusum, donusumOku, gorusAlani, durusa } from '../kamera.js';
import { ikon, roma } from '../tasarim.js';
import { bilinenAd } from '../adlar.js';
import { turAltYazisi } from '../oturum.js';
import { akimKarsilastirmaAdresi } from '../akim.js';
import { DERS_ADIMLARI, ADIM_ADLARI, dersKaydi, adimIsle, dersDurumu, bugununDersi } from '../ders.js';
import { dersBul, gorPlani, ogrenPlani, ayirtPlani, dersAdimlari, eserEslestir, adimOrani, kalinanYer, dersHali } from '../dersIcerik.js';
import { kilitMetni } from '../bolum.js';
import {
  d,
  ekran,
  ciz,
  ust,
  islenen,
  acikListe,
  bugun,
  kaydet,
  kotuler,
  jsonGetir,
  cizimNo,
  guncelMi,
  kucukGorsel,
  odakliGorsel,
  kucukKareleriDoldur,
  enBilinen,
  notuIcin,
  gorselTercihi,
  yuruyusEserAdi,
  hataGoster,
  ekranRengi,
  akimRenk,
  sayfaZemini,
  akiminDonemi,
  simdikiDonem,
} from './ortak.js';
import { turBilgisi } from './bugun.js';
import { durumlar as bolumDurumu, bolumler as tumBolumler } from './harita.js';
import { devamKarti, devamResmiDoldur, hatalarSatiri } from './pekistir.js';
import { soruTurlariHtml } from './soruTurlari.js';
import { dersKaynagi, dersAdresi } from './dersVerisi.js';

export { dersKaynagi };

// ---------- veri ----------
const yuruyus = () => d.yuruyus || {};
const kisaAd = (id) => {
  const s = d.harita.get(id);
  return s ? bilinenAd(s.ad, d.kisaAdlar[id]) : '';
};
const eserYili = (e) => (e && e.tarih ? String(e.tarih) : '');

// Kaynaktaki eser kaydı → uygulamanın eser nesnesi (sanatçının doğrulanmış listesinden); bulunamazsa null
async function eseriBul(ref) {
  const sid = ref.sanatci;
  const s = d.harita.get(sid);
  if (!s) return null;
  const liste = await sanatciEserleri(s).catch(() => []);
  return eserEslestir(liste, sid, ref);
}
// Listedeki ilk bulunabilen eser (Ayırt et: birinci eser, olmazsa yedekleri)
async function ilkEser(liste) {
  for (const r of liste || []) {
    const e = await eseriBul(r);
    if (e) return { e, sid: r.sanatci };
  }
  return null;
}

// Dersin bütün hesabı: adımları, planları, kaydı ve durumu
function dersBilgisi(kaynak, akim) {
  const ders = dersBul(kaynak, akim);
  if (!ders) return null;
  const adimlar = dersAdimlari(ders, yuruyus());
  const gor = gorPlani(ders, yuruyus());
  const ogren = ogrenPlani(ders);
  const gorunur = new Set(d.akimlar.map((a) => a.ad));
  const acikAkimlar = new Set(
    akimDurumlari(d.akimlar, d.sanatcilar, islenen())
      .filter((a) => a.acik)
      .map((a) => a.ad),
  );
  const maddeler = (ad) => ((dersBul(kaynak, ad) || {}).ogren || []).map((m) => m.madde);
  const ayirt = ayirtPlani(ders, { gorunur, acik: acikAkimlar, maddeler });
  const acik = acikListe().filter((s) => s.akim === akim);
  const kayit = dersKaydi(d.ilerleme, akim);
  const durum = dersDurumu(kayit, adimlar);
  return { ders, akim, adimlar, gor, ogren, ayirt, acik, kayit, durum };
}

// İş 191 · dersin sonu: dönemin harita durakları. Dönen: { durak: duraklarının sayısı, kilit: ilk
// durak kapalıysa nedeni (ders bittiyse kurs ya da önceki dönem) }
function haritaBilgisi(b) {
  const l = bolumDurumu().durumlar.filter((x) => x.akim === b.akim);
  const ilk = l[0];
  return { durak: l.length, kilit: ilk && !ilk.acik && b.durum.bitti ? kilitMetni(ilk, tumBolumler()) : '' };
}

// Bir adımın toplamı ve görülen sayısı (halkadaki "3/7")
function adimSayisi(b, adim) {
  const i = b.kayit[adim].i;
  const toplam = adim === 'gor' ? b.gor.toplam : adim === 'ogren' ? b.ogren.length : b.ayirt.length;
  const gorulen = Math.round(i * toplam);
  return { toplam, gorulen, yazi: i > 0 && toplam ? `${gorulen}/${toplam}` : '' };
}

const adimAciklamasi = (b, adim) =>
  adim === 'gor'
    ? `${b.gor.eserler.length} eserde ${b.gor.toplam} ayrıntı`
    : adim === 'ogren'
      ? `Nasıl tanınır? ${b.ogren.length} özellik`
      : `Komşu dönemlerle ${b.ayirt.length} ikili`;

// Adım halkaları (bugünün dersi kartı): biten yeşil ✓, süren altın halka ve "3/7", bekleyen sıra numarası; sonda harita
// (ders bitince açılır)
function adimHalkalari(b) {
  const harita = b.durum.bitti
    ? `<li><a class="ders-adim haritaya" href="#/harita" data-test="adim-harita" aria-label="Haritaya geç"><span class="ders-halka" aria-hidden="true">${ikon('harita', 16, 1.7)}</span><span class="ders-adim-ad" aria-hidden="true">Harita</span></a></li>`
    : `<li><span class="ders-adim haritaya kapali" data-test="adim-harita" aria-label="Harita: ders bitince açılır"><span class="ders-halka" aria-hidden="true">${ikon('harita', 16, 1.7)}</span><span class="ders-adim-ad" aria-hidden="true">Harita</span></span></li>`;
  return `<ol class="ders-adimlar" aria-label="Dersin adımları" style="--n:${b.adimlar.length + 1}">${b.durum.adimlar
    .map((x, i) => {
      const say = adimSayisi(b, x.adim);
      const hal = x.bitti ? 'bitti' : x.adim === b.durum.siradaki ? 'simdi' : '';
      const ic = x.bitti ? ikon('dogru', 16, 2.2) : say.yazi && hal === 'simdi' ? say.yazi : String(i + 1);
      const okunus = x.bitti ? 'tamam' : say.yazi ? `sürüyor, ${say.yazi}` : 'bekliyor';
      const oran = hal === 'simdi' ? ` style="--oran:${Math.max(6, Math.round((say.toplam ? say.gorulen / say.toplam : 0) * 100))}%"` : '';
      return `<li><a class="ders-adim ${hal}" href="${dersAdresi(b.akim, x.adim)}" data-test="adim-${x.adim}" aria-label="${x.ad}: ${okunus}"><span class="ders-halka" aria-hidden="true"${oran}>${ic}</span><span class="ders-adim-ad" aria-hidden="true">${x.ad}</span></a></li>`;
    })
    .join('')}${harita}</ol>`;
}

// Üç (ya da iki) ince çizgi: dersler listesinde ve adım ekranlarının başında
function adimCizgileri(b, simdiki = null) {
  const okunus = b.durum.adimlar.map((x) => `${x.ad} ${x.bitti ? 'tamam' : x.i > 0 ? 'sürüyor' : 'bekliyor'}`).join(', ');
  return `<span class="ders-cizgiler" role="img" aria-label="${okunus}">${b.durum.adimlar
    .map((x) => `<i class="${x.bitti ? 'bitti' : ''}${x.adim === simdiki ? ' simdi' : ''}" style="--oran:${Math.round(x.i * 100)}%"></i>`)
    .join('')}</span>`;
}

// Sıradaki adımın tek cümlelik daveti (yalnız veriden: madde adı, sayılar, komşu adları)
function davet(b) {
  const a = b.durum.siradaki;
  if (!a) {
    const h = haritaBilgisi(b);
    if (h.kilit) return `Ders tamam. Haritadaki durakları: ${kacis(h.kilit)}`;
    return h.durak ? `Ders tamam. Haritada ${kacis(b.akim)} durakları seni bekliyor; sınavın orada.` : 'Ders tamam.';
  }
  if (a === 'gor') return `Önce bak: ${adimAciklamasi(b, 'gor')}.`;
  if (a === 'ogren') {
    const m = b.ogren[kalinanYer(b.kayit.ogren.i, b.ogren.length)];
    if (!m) return '';
    const n = m.kanitlar.length;
    return `Sıradaki özellik: <i>${kacis(m.madde)}</i>.${n ? ` ${n} eserde göreceksin.` : ''}`;
  }
  return `Komşularından ayır: ${b.ayirt.map((x) => kacis(x.komsu)).join(', ')}.`;
}

// Devam satırının alt yazısı: başlanmış adımda "9 / 17 ayrıntı · 3 eser", başlanmamışta adımın açıklaması
function devamAltYazisi(b, a, say) {
  if (!say || !say.yazi) return adimAciklamasi(b, a);
  const birim = a === 'gor' ? 'ayrıntı' : a === 'ogren' ? 'özellik' : 'ikili';
  return `${say.gorulen} / ${say.toplam} ${birim}${a === 'gor' ? ` · ${b.gor.eserler.length} eser` : ''}`;
}

function devamDugmesi(b, test = 'ders-devam', sahne = false) {
  // İş 191: ders bittiyse düğme haritaya götürür (Sına'nın yerine)
  if (!b.durum.siradaki && !sahne)
    return `<a class="ders-dugme dolu" href="#/harita" data-test="${test}" data-adim="harita"><span>Haritaya geç</span>${ikon('harita', 18, 1.7)}</a>`;
  const a = b.durum.siradaki || b.adimlar[0];
  const suruyor = b.kayit[a].i > 0 && !b.durum.adimlar.find((x) => x.adim === a).bitti;
  const yazi = !b.durum.siradaki ? 'Dersi yeniden aç' : suruyor ? `${ADIM_ADLARI[a]} adımına devam` : `${ADIM_ADLARI[a]} adımını aç`;
  const say = b.durum.siradaki ? adimSayisi(b, a) : null;
  // 1.89.2 (Emre tuvalde "B"yi seçti): Çalış'ta devam, bugünün dersi kartının son satırı: adımın adı, altında sayısı
  if (sahne) {
    const alt = b.durum.siradaki ? devamAltYazisi(b, a, say) : '';
    return `<a class="ders-devam-satir" href="${dersAdresi(b.akim, a)}" data-test="${test}" data-adim="${a}">
        <span class="ders-devam-yazi"><b>${yazi}</b>${alt ? `<small>${kacis(alt)}</small>` : ''}</span>
        <span class="ders-devam-ok" aria-hidden="true">${ikon('ileri', 18, 2)}</span>
      </a>`;
  }
  return `<a class="ders-dugme dolu" href="${dersAdresi(b.akim, a)}" data-test="${test}" data-adim="${a}"><span>${yazi}</span>${say && say.yazi ? `<small>${say.yazi}</small>` : ikon('ileri', 18, 1.8)}</a>`;
}

const konuAraligi = (b) => {
  const k = [...new Set(b.acik.map((s) => s.konu))].sort((x, y) => x - y);
  if (!k.length) return '';
  return k.length > 1 ? `Konu ${k[0]}–${k[k.length - 1]}` : `Konu ${k[0]}`;
};
const dersKunyesi = (b) => [`${b.acik.length} sanatçı`, konuAraligi(b)].filter(Boolean).join(' · ');

// ---------- Çalış'ın girişi ----------
function bugunKarti(b) {
  return `<section class="ders-bugun" data-test="bugunun-dersi" data-akim="${kacis(b.akim)}" aria-label="Bugünün dersi">
      <a class="ders-bugun-kapak" href="${dersAdresi(b.akim)}" data-test="bugunun-dersi-ac">
        <span class="ders-kapak-resim" data-ders-kapak="${kacis(b.akim)}" data-genislik="960" aria-hidden="true"></span>
        <span class="ders-bugun-yazi"><span class="ders-etiket">Bugünün dersi</span><b>${kacis(b.akim)}</b><small>${kacis(dersKunyesi(b))}</small></span>
      </a>
      ${adimHalkalari(b)}
      <div class="ders-bugun-alt">
        ${b.durum.siradaki === 'gor' ? '' : `<p class="ders-davet">${davet(b)}</p>`}
        ${devamDugmesi(b, 'ders-devam', true)}
      </div>
    </section>`;
}

function tekrarKarti(tur, dersler = []) {
  // 1.81.0: solda açık derslerin kapaklarından küçük bir deste; yelpaze gibi açılıp kapanır
  const deste = dersler
    .slice(0, 3)
    .map((x) => `<i data-ders-kapak="${kacis(x.akim)}"></i>`)
    .join('');
  const pek = tur.zayif + tur.diger;
  const dk = Math.max(1, Math.round((tur.toplam * 20) / 60));
  const parca = [
    ['tekrar', tur.tekrar],
    ['pek', pek],
    ['yeni', tur.yeni],
  ].filter(([, n]) => n);
  return `<a class="ders-tekrar tek-satir" href="#/pekistir/karisik" data-test="karisik-dugme" aria-label="Günlük tekrar: ${tur.toplam} kart, başlat">
      <span class="ders-tekrar-govde">
        ${deste ? `<span class="ders-deste" aria-hidden="true">${deste}</span>` : ''}
        <span class="ders-tekrar-yazi"><span class="ders-tekrar-etiket">Günlük tekrar</span><span class="ders-tekrar-sayi"><b data-test="tur-sayi">${tur.toplam}</b> kart</span><small>${tur.toplam ? `<span>Yaklaşık ${dk} dk</span>` : ''}<span data-test="tur-alt">${kacis(turAltYazisi(tur))}</span></small></span>
        <span class="ders-tekrar-git" aria-hidden="true">${ikon('ileri', 20, 1.8)}</span>
      </span>
      ${parca.length ? `<span class="ders-tekrar-cubuk" aria-hidden="true">${parca.map(([cls, n]) => `<i class="k-${cls}" style="flex-grow:${n}"></i>`).join('')}</span>` : ''}
    </a>`;
}

const HAL_AD = { bitti: 'Bitti', suruyor: 'Sürüyor', sirada: 'Sırada' };
function dersSatiri(b, bugunku = null) {
  const hal = dersHali(b.durum);
  const bugun = b.akim === bugunku && hal !== 'bitti';
  return `<li class="calis-belir"><a class="ders-satir ${hal}${bugun ? ' bugunku' : ''}" href="${dersAdresi(b.akim)}" data-test="ders-satir" data-akim="${kacis(b.akim)}">
      <span class="calis-eser"><span class="ders-satir-resim" data-ders-kapak="${kacis(b.akim)}" data-genislik="640" aria-hidden="true"></span><span class="ders-satir-hal${bugun ? ' bugun' : ''}">${bugun ? 'Bugünün dersi' : HAL_AD[hal]}</span><span class="calis-satir-ok" aria-hidden="true">${ikon('ileri', 18, 1.6)}</span></span>
      <span class="ders-satir-yazi"><b>${kacis(b.akim)}</b><small>${b.acik.length} sanatçı · ${b.adimlar.length} adım</small>${adimCizgileri(b, bugun ? b.durum.siradaki : null)}</span>
    </a></li>`;
}
function kilitliSatir(a) {
  return `<li><div class="ders-satir kilitli" data-test="ders-kilitli">
      <span class="ders-satir-resim" aria-hidden="true">${ikon('kilit', 20, 1.6)}</span>
      <span class="ders-satir-yazi"><b>${kacis(a.ad)}</b><small>${a.acilacagiKonu ? `Konu ${bulunmaEki(a.acilacagiKonu)} açılır` : 'Henüz açılmadı'}</small></span>
    </div></li>`;
}

// "Konu 11'desin": en son işlenen konu
function konumYazisi() {
  const k = [...islenen()];
  if (!k.length) return '';
  const ek = bulunmaEki(Math.max(...k));
  return `Konu ${ek}${/[aı]$/.test(ek) ? 'sın' : 'sin'}`;
}

// Haritanın beklediği ders: durağı yalnız dersi yüzünden kapalı olan dönem (İş 191); yoksa "Buradasın" durağının dönemi
function yolculukAkimi() {
  const y = bolumDurumu();
  const bekleyen = y.durumlar.find((z) => z.neden && z.neden.tur === 'ders');
  if (bekleyen) return bekleyen.akim;
  const x = y.simdiki && y.durumlar.find((z) => z.id === y.simdiki);
  return x ? x.akim : null;
}

export async function dersMenusu() {
  const no = cizimNo();
  const kaynak = await dersKaynagi();
  if (!guncelMi(no)) return;
  const akimlar = akimDurumlari(d.akimlar, d.sanatcilar, islenen());
  const sirali = akimlar.filter((a) => dersBul(kaynak, a.ad));
  const aciklar = sirali.filter((a) => a.acik).map((a) => dersBilgisi(kaynak, a.ad));
  const kilitliler = sirali.filter((a) => !a.acik);
  const bugunku = bugununDersi({
    acikAkimlar: aciklar.map((b) => b.akim),
    ilerleme: d.ilerleme,
    yolculukAkimi: yolculukAkimi(),
    adimlar: (ad) => aciklar.find((b) => b.akim === ad).adimlar,
  });
  const b = aciklar.find((x) => x.akim === bugunku);
  const baslik = `${sayfaZemini(b ? akiminDonemi(b.akim) : simdikiDonem())}<header class="ders-bas"><h1 tabindex="-1">Çalış</h1><span class="ders-konum" data-test="ders-konum">${kacis(konumYazisi())}</span></header>`;
  if (!acikListe().length) {
    ciz(`${baslik}${devamKarti()}<div class="bos-kutu"><p>Henüz açık sanatçı yok.</p><p class="kucuk ikincil"><a href="#/ilerleme">Ben</a> sayfasında işlediğin konuları işaretle.</p></div>`);
    return devamResmiDoldur();
  }
  const dersler = aciklar.length
    ? `<section class="ders-liste-bolum" aria-label="Dersler">
        <p class="calis-panel-not">${aciklar.length} açık ders · Her döneme bir eserden başla.</p>
        <ul class="ders-liste" data-test="ders-liste">${aciklar.map((x) => dersSatiri(x, bugunku)).join('')}${kilitliler.length ? kilitliSatir(kilitliler[0]) : ''}</ul>
        ${kilitliler.length > 1 ? `<p class="ders-kalan">${kilitliler.length - 1} ders daha, konular işlendikçe açılacak.</p>` : ''}
      </section>`
    : `<p class="ders-kalan" data-test="ders-yok">${kaynak ? 'Açık dönemlerin dersi henüz yok.' : 'Dersler yüklenemedi; bağlantı gelince yeniden dene.'}</p>`;
  ciz(`${baslik}
    ${devamKarti()}
    ${b ? bugunKarti(b) : aciklar.length ? `<section class="ders-bugun bitti" data-test="bugunun-dersi" data-akim=""><div class="ders-bugun-alt"><span class="ders-etiket">Bugünün dersi</span><p class="ders-davet">Açık derslerin hepsi tamam. Aşağıdan istediğini yeniden açabilir ya da günlük tekrarı yapabilirsin.</p></div></section>` : ''}
    <div class="calis-atolye" data-test="calis-atolye">
      ${tekrarKarti(turBilgisi('karisik'), aciklar)}
      <header class="calis-masa-bas"><h2>Çalışma masan</h2><p>Önce keşfet. Sonra kendini dene.</p></header>
      <div class="calis-sekmeler" role="tablist" aria-label="Çalışma biçimi">
        <button type="button" role="tab" id="calis-dersler-sekme" aria-controls="calis-dersler-panel" aria-selected="true" data-calis-sekme="dersler">${ikon('kitap', 18, 1.6)}<span>Dersler</span></button>
        <button type="button" role="tab" id="calis-turlar-sekme" aria-controls="calis-turlar-panel" aria-selected="false" tabindex="-1" data-calis-sekme="turlar">${ikon('karsilastir', 18, 1.6)}<span>Başka turlar</span></button>
      </div>
      <div role="tabpanel" id="calis-dersler-panel" aria-labelledby="calis-dersler-sekme">${dersler}</div>
      <div role="tabpanel" id="calis-turlar-panel" aria-labelledby="calis-turlar-sekme" hidden>${soruTurlariHtml(hatalarSatiri(), true)}</div>
      <a class="calis-yolculuk" href="#/harita"><span>${ikon('harita', 20, 1.6)}</span><span><b>Bir sonraki durağın seni bekliyor.</b><small>Yolculuğunu haritada gör</small></span>${ikon('ileri', 18, 1.6)}</a>
    </div>`);
  calisSekmeleri();
  calisCubugu();
  kapaklariDoldur(kaynak);
  kucukKareleriDoldur();
  devamResmiDoldur();
}

function calisSekmeleri() {
  const liste = ekran.querySelector('.calis-sekmeler');
  const sekmeler = [...liste.querySelectorAll('[role="tab"]')];
  const sec = (hedef) => {
    for (const sekme of sekmeler) {
      const secili = sekme === hedef;
      sekme.setAttribute('aria-selected', String(secili));
      sekme.tabIndex = secili ? 0 : -1;
      ekran.querySelector(`#${sekme.getAttribute('aria-controls')}`).hidden = !secili;
    }
  };
  liste.addEventListener('click', (e) => {
    const hedef = e.target.closest('[role="tab"]');
    if (hedef) sec(hedef);
  });
  liste.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const i = sekmeler.indexOf(document.activeElement);
    const hedef = e.key === 'Home' ? 0 : e.key === 'End' ? sekmeler.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + sekmeler.length) % sekmeler.length;
    sec(sekmeler[hedef]);
    sekmeler[hedef].focus();
  });
}

// İş 189: başlık ekrandan çıkınca üstte cam çubuk ("Çalış"); başyapıt sayfasındakiyle aynı (.bsy-cubuk)
function calisCubugu() {
  const h1 = ekran.querySelector('.ders-bas h1');
  if (!h1 || !('IntersectionObserver' in window)) return;
  ekran.insertAdjacentHTML('beforeend', '<div class="bsy-cubuk calis-cubuk" data-calis-cubuk aria-hidden="true"><span></span><b>Çalış</b><span></span></div>');
  const cubuk = ekran.querySelector('[data-calis-cubuk]');
  const goz = new IntersectionObserver(([g]) => {
    if (!cubuk.isConnected) return goz.disconnect();
    cubuk.classList.toggle('acik', !g.isIntersecting && g.boundingClientRect.top < 0);
  });
  goz.observe(h1);
}

// [data-ders-kapak="<akım>"]: dersin temsilci eseri (Ayırt et için elle seçilen birinci eser); olmazsa açık ilk sanatçının
// en bilinen eseri
function kapaklariDoldur(kaynak) {
  const buyukKapak = ekran.querySelector('[data-ders-kapak][data-genislik="960"]');
  for (const el of ekran.querySelectorAll('[data-ders-kapak]')) {
    const ders = dersBul(kaynak, el.dataset.dersKapak);
    if (!ders) continue;
    const genislik = Number(el.dataset.genislik) || 400;
    const adaylar = (ders.ayirt[0] && ders.ayirt[0].eserler.kendi) || [];
    ilkEser(adaylar)
      .then(async (x) => {
        if (x) return x.e;
        const s = acikListe().find((y) => y.akim === ders.akim);
        return s ? enBilinen(await sanatciEserleri(s)) : null;
      })
      .then((e) => {
        if (e && e.gorseller && e.gorseller.length) odakliGorsel(el, e, genislik);
        // 1.80.0: dolu düğmeler dersin kapak tablosunun rengini alır (büyük kapak: Çalış'ta bugünün dersi, ders sayfası)
        if (e && el === buyukKapak) ekranRengi(e, akimRenk(ders.akim));
      })
      .catch(() => {});
  }
}

// ---------- ders sayfası ----------
async function dersiAl(akim, no) {
  const kaynak = await dersKaynagi();
  if (!guncelMi(no)) return null;
  const b = kaynak && dersBilgisi(kaynak, akim);
  if (!b) {
    ciz(`${ust(akim, '#/pekistir', { ustEtiket: 'Ders' })}<div class="bos-kutu" data-test="ders-yok"><p>${kaynak ? 'Bu dönemin dersi yok.' : 'Ders yüklenemedi; bağlantı gelince yeniden dene.'}</p><p><a class="ders-dugme" href="#/pekistir">Çalış’a dön</a></p></div>`);
    return null;
  }
  if (!b.acik.length) {
    const a = akimDurumlari(d.akimlar, d.sanatcilar, islenen()).find((x) => x.ad === akim);
    ciz(`${ust(akim, '#/pekistir', { ustEtiket: 'Ders' })}<div class="bos-kutu" data-test="ders-kilitli"><p>${a && a.acilacagiKonu ? `Bu ders Konu ${bulunmaEki(a.acilacagiKonu)} açılır.` : 'Bu ders henüz açılmadı.'}</p><p><a class="ders-dugme" href="#/pekistir">Çalış’a dön</a></p></div>`);
    return null;
  }
  return { b, kaynak };
}

export async function dersSayfasi(akim) {
  const x = await dersiAl(akim, cizimNo());
  if (!x) return;
  const { b, kaynak } = x;
  const satir = (s, i) => {
    const say = adimSayisi(b, s.adim);
    const hal = s.bitti ? 'bitti' : s.adim === b.durum.siradaki ? 'simdi' : '';
    return `<li><a class="ders-adim-satir ${hal}" href="${dersAdresi(akim, s.adim)}" data-test="ders-adim" data-adim="${s.adim}">
        <span class="ders-halka" aria-hidden="true">${s.bitti ? ikon('dogru', 16, 2.2) : i + 1}</span>
        <span class="ders-adim-yazi"><b>${s.ad}</b><span>${kacis(adimAciklamasi(b, s.adim))}</span></span>
        <span class="ders-adim-hal" data-test="adim-hal">${s.bitti ? 'Tamam' : say.yazi || ''}</span>
      </a></li>`;
  };
  ciz(`${ust(akim, '#/pekistir', { ustEtiket: 'Ders' })}
    <div class="ders-sayfa-kapak"><span class="ders-kapak-resim" data-ders-kapak="${kacis(akim)}" data-genislik="960" aria-hidden="true"></span></div>
    <p class="ders-kunye">${kacis(dersKunyesi(b))} · <a href="#/akim/${encodeURIComponent(akim)}">Dönem sayfası</a></p>
    <ol class="ders-adim-liste" data-test="ders-adimlar" data-adim-sayisi="${b.adimlar.length}">${b.durum.adimlar.map(satir).join('')}${haritaSatiri(b)}</ol>
    ${b.adimlar.includes('gor') ? '' : `<p class="ders-not" data-test="gor-yok">Bu dönemin Gör adımı henüz yazılmadı; ders iki adımla ilerler.</p>`}
    <p class="ders-davet">${davet(b)}</p>
    ${devamDugmesi(b)}
    <p class="metin-bag"><a href="#/pekistir/donem/${encodeURIComponent(akim)}">Bu dönemin tekrar turu</a></p>`);
  kapaklariDoldur(kaynak);
}

// İş 191 · Sına'nın yerinde: haritaya geçiş. Ders bitmeden kapalı; bitince dönemin durakları haritada açılır.
function haritaSatiri(b) {
  const ic = (acik, alt, hal) => `<span class="ders-halka" aria-hidden="true">${ikon(acik ? 'harita' : 'kilit', 16, 1.7)}</span>
        <span class="ders-adim-yazi"><b>Haritaya geç</b><span>${kacis(alt)}</span></span>
        <span class="ders-adim-hal">${hal}</span>`;
  if (!b.durum.bitti)
    return `<li><div class="ders-adim-satir haritaya kapali" data-test="ders-harita" data-acik="false">${ic(false, `${b.adimlar.length === 3 ? 'Üç' : 'İki'} adımı bitirince dönemin durakları açılır`, '')}</div></li>`;
  const h = haritaBilgisi(b);
  const alt = h.kilit || (h.durak ? `${h.durak} durak · sınavın orada` : 'Dönemin durakları');
  return `<li><a class="ders-adim-satir haritaya simdi" href="#/harita" data-test="ders-harita" data-acik="true">${ic(true, alt, ikon('ileri', 18, 1.6))}</a></li>`;
}

// ---------- adım ekranlarının ortak parçaları ----------
let st = null; // açık adımın durumu: { akim, adim, b, … }

function adimUst(b, adim, baslik) {
  const sira = b.adimlar.indexOf(adim) + 1;
  return `<header class="ders-ust">
      <button class="ders-geri" type="button" data-geri="${dersAdresi(b.akim)}" aria-label="Derse dön">${ikon('geri', 20, 1.8)}</button>
      <span class="ders-ust-yazi"><span class="ders-etiket">${kacis(b.akim)} dersi · ${sira}. adım</span><h1 tabindex="-1" data-test="ders-adim-baslik">${baslik}</h1></span>
      ${adimCizgileri(b, adim)}
    </header>`;
}

function ilerlemeYaz(adim, gorulen, toplam) {
  const r = adimIsle(d.ilerleme, st.akim, adim, adimOrani(gorulen, toplam), bugun());
  st.b.kayit = r.sonra;
  st.b.durum = dersDurumu(r.sonra, st.b.adimlar);
  kaydet();
  return r;
}

// Adım bitti: kısa kapanış ve sıradaki adıma geçiş (geri okunda bu adım değil ders sayfası kalsın diye yer değiştirerek)
const SON_YAZI = {
  gor: (b) => `${b.gor.eserler.length} eserde ${b.gor.toplam} ayrıntıya baktın.`,
  ogren: (b) => `${b.ogren.length} özelliğin hepsini gördün.`,
  ayirt: (b) => `${b.ayirt.length} komşu dönemle yan yana baktın.`,
};
function adimSonu(adim) {
  const b = st.b;
  const sonraki = b.durum.bitti ? null : b.adimlar.slice(b.adimlar.indexOf(adim) + 1).find((a) => !b.durum.adimlar.find((x) => x.adim === a).bitti) || b.durum.siradaki;
  const harita = b.durum.bitti ? haritaBilgisi(b) : null;
  st.bitti = true;
  ciz(
    `${adimUst(b, adim, ADIM_ADLARI[adim])}
    <div class="ders-son" data-test="ders-adim-son" data-adim="${adim}">
      <span class="ders-son-isaret" aria-hidden="true">${ikon('dogru', 26, 2)}</span>
      <h2 tabindex="-1">${ADIM_ADLARI[adim]} tamam</h2>
      <p>${kacis(SON_YAZI[adim](b))}</p>
      ${harita ? `<p data-test="ders-bitti">${kacis(harita.kilit ? `Ders tamam. Haritadaki durakları: ${harita.kilit}` : `Ders tamam. Haritada ${b.akim} durakları seni bekliyor; sınavın orada.`)}</p>` : ''}
      <div class="ders-son-dugmeler">
        ${sonraki ? `<a class="ders-dugme dolu" href="${dersAdresi(b.akim, sonraki)}" data-ders-gec data-test="ders-sonraki-adim"><span>Sıradaki adım: ${ADIM_ADLARI[sonraki]}</span>${ikon('ileri', 18, 1.8)}</a>` : ''}
        ${harita ? `<a class="ders-dugme dolu" href="#/harita" data-ders-gec data-test="ders-haritaya-gec"><span>Haritaya geç</span>${ikon('harita', 18, 1.7)}</a>` : ''}
        <a class="ders-dugme" href="${dersAdresi(b.akim)}" data-ders-gec data-test="ders-derse-don">Derse dön</a>
      </div>
    </div>`,
    'giris',
  );
  ekran.querySelector('.ders-son h2').focus({ preventScroll: true });
}

const altCubuk = (ic) => `<div class="ders-alt-cubuk">${ic}</div>`;

// ---------- 1. adım · Gör ----------
// Dersin ilk eserlerinde yürüyüş: önce eserin tamamı, sonra ayrıntıdan ayrıntıya. Kamera aynı resmin içinde kayar ve
// yakınlaşır (CSS geçişi; Hareket "Kapalı"yken anında). Sahne her temada koyu (görüntüleyici gibi).
export async function gorAdimi(akim) {
  const x = await dersiAl(akim, cizimNo());
  if (!x) return;
  const { b } = x;
  if (!b.gor.eserler.length) {
    // Gör verisi yok (Dada, Sürrealizm, Savaş sonrası figürasyon): yürüyüş uydurulmaz, adım atlanır
    ciz(`${adimUst({ ...b, adimlar: DERS_ADIMLARI }, 'gor', 'Gör')}
      <div class="ders-son" data-test="gor-yok"><h2 tabindex="-1">Gör adımı yakında</h2><p>Bu dönemin eserleri için yürüyüş henüz yazılmadı. Ders Öğren adımıyla başlar.</p>
      <div class="ders-son-dugmeler"><a class="ders-dugme dolu" href="${dersAdresi(akim, 'ogren')}" data-ders-gec><span>Öğren adımını aç</span>${ikon('ileri', 18, 1.8)}</a></div></div>`);
    return;
  }
  // kareler: her eser için önce giriş (resmin tamamı), sonra ayrıntıları
  const kareler = [];
  let sayac = 0;
  b.gor.eserler.forEach((es, ei) => {
    kareler.push({ ei, ni: -1, sira: sayac });
    es.kayit.noktalar.forEach((_, ni) => kareler.push({ ei, ni, sira: ++sayac }));
  });
  const kalinan = kalinanYer(b.kayit.gor.i, b.gor.toplam); // sıradaki ayrıntının sırası (0'dan)
  let konum = kareler.findIndex((k) => k.ni >= 0 && k.sira === kalinan + 1);
  if (konum > 0 && kareler[konum].ni === 0) konum--; // eserin ilk ayrıntısındaysa önce eserin tamamı
  st = { akim, adim: 'gor', b, kareler, konum: Math.max(0, konum), gorulen: Math.round(b.kayit.gor.i * b.gor.toplam), yuklenen: -1, boyut: null };
  ciz(`<section class="ders-gor" data-test="ders-gor">
      <div class="ders-gor-sahne" data-gor-sahne></div>
      <span class="ders-gor-perde" aria-hidden="true"></span>
      ${adimUst(b, 'gor', 'Gör')}
      <div class="ders-gor-panel" data-gor-panel>
        <span class="ders-gor-eser" data-gor-eser></span>
        <h2 tabindex="-1" data-gor-baslik></h2>
        <p class="ders-gor-metin" data-gor-metin></p>
        <div class="ders-gor-alt">
          <span class="ders-noktalar" role="img" data-gor-noktalar></span>
          <button class="ders-dugme koyu" type="button" data-gor-geri data-test="gor-geri">Geri</button>
          <button class="ders-dugme dolu" type="button" data-gor-ileri data-test="gor-ileri"></button>
        </div>
      </div>
    </section>`);
  gorKare();
}

function gorKare() {
  const kok = ekran.querySelector('.ders-gor');
  if (!kok || !st || st.adim !== 'gor') return;
  const k = st.kareler[st.konum];
  const es = st.b.gor.eserler[k.ei];
  const kayit = es.kayit;
  const eserAdi = [kisaAd(es.sanatci), yuruyusEserAdi(es.sanatci, kayit), kayit.yil].filter(Boolean).join(' · ');
  const ilk = st.yuklenen < 0;
  if (st.yuklenen !== k.ei) gorResmiYukle(kok, k.ei, eserAdi);
  const n = k.ni >= 0 ? kayit.noktalar[k.ni] : null;
  const adet = kayit.noktalar.length;
  kok.dataset.kare = String(st.konum);
  kok.dataset.nokta = String(k.ni);
  const yaz = () => {
    // eserin tamamında ad başlıkta; üst satırda yalnız sanatçı ve yıl
    const ustSatir = n ? eserAdi : [kisaAd(es.sanatci), kayit.yil].filter(Boolean).join(' · ');
    kok.querySelector('[data-gor-eser]').textContent = `${ustSatir}${st.b.gor.eserler.length > 1 ? ` · eser ${k.ei + 1} / ${st.b.gor.eserler.length}` : ''}`;
    kok.querySelector('[data-gor-baslik]').textContent = n ? n.ad : yuruyusEserAdi(es.sanatci, kayit);
    kok.querySelector('[data-gor-metin]').textContent = n ? n.metin : `Önce resmin bütününe bak. Sonra ${adet} ayrıntıya tek tek yaklaşacağız.`;
    kok.querySelector('[data-gor-metin]').scrollTop = 0;
    const noktalar = kok.querySelector('[data-gor-noktalar]');
    noktalar.setAttribute('aria-label', n ? `Ayrıntı ${k.ni + 1} / ${adet}` : `${adet} ayrıntı`);
    noktalar.innerHTML = kayit.noktalar.map((_, i) => `<i class="${i < k.ni ? 'gecti' : i === k.ni ? 'simdi' : ''}"></i>`).join('');
    const son = st.konum === st.kareler.length - 1;
    const eserSonu = !son && st.kareler[st.konum + 1].ei !== k.ei;
    kok.querySelector('[data-gor-ileri]').textContent = son ? 'Gör’ü bitir' : !n ? 'Ayrıntılara bak' : eserSonu ? 'Sıradaki eser' : 'Sonraki ayrıntı';
    kok.querySelector('[data-gor-geri]').hidden = st.konum === 0;
  };
  gorMetniDegistir(kok, yaz, ilk);
}

// Metin geçişi (1.89.1): eski yazı kısa bir solmayla çekilir, kamera yola çıkar, yeni yazı hafifçe yükselerek gelir
// (önce üst satır, sonra başlık, sonra metin). Panelin boyu yeni metne göre değiştiği için kamera, yazı değiştikten
// sonra yeni boya göre kurulur. Hareket kapalıyken (ya da ilk karede) her şey anında.
const GOR_PARCALAR = '[data-gor-eser], [data-gor-baslik], [data-gor-metin]';
function gorMetniDegistir(kok, yaz, ilk) {
  const parcalar = [...kok.querySelectorAll(GOR_PARCALAR)];
  const no = (st.metinNo = (st.metinNo || 0) + 1);
  parcalar.forEach((p) => p.getAnimations().forEach((a) => a.cancel()));
  if (ilk || hareketAz() || typeof Element.prototype.animate !== 'function') {
    yaz();
    gorKamera(ilk || hareketAz());
    return;
  }
  const cikis = parcalar.map((p) => p.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }));
  const devam = () => {
    if (!st || st.adim !== 'gor' || st.metinNo !== no || !kok.isConnected) return;
    yaz();
    gorKamera(false);
    cikis.forEach((a) => a.cancel());
    parcalar.forEach((p, i) =>
      p.animate(
        [
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 520, delay: 120 + i * 70, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'backwards' },
      ),
    );
  };
  Promise.all(cikis.map((a) => a.finished)).then(devam, () => {});
}

// Yeni eser: resim ayrı bir katmanda yüklenir; eski resim yeni resim gelene dek yerinde kalır, sonra ikisi çapraz
// solar (arada karanlık bir boşluk ya da ani kesme olmaz). Yeni resim yerine hafifçe yaklaşarak oturur.
function gorResmiYukle(kok, ei, eserAdi) {
  const kayit = st.b.gor.eserler[ei].kayit;
  st.yuklenen = ei;
  st.boyut = null;
  const sahne = kok.querySelector('[data-gor-sahne]');
  const eski = sahne.querySelector('[data-gor-resim]');
  if (eski && !eski.classList.contains('acik')) eski.remove(); // hiç görünmemiş katman beklemez
  else if (eski) eski.removeAttribute('data-gor-resim');
  const img = document.createElement('img');
  img.alt = eserAdi;
  img.decoding = 'async';
  img.setAttribute('data-gor-resim', '');
  sahne.appendChild(img);
  // 1280'lik kopya (js/gorsel.js yuruyusAdresleri; Bugün'deki yürüyüşle aynı yol), varsa en büyüğü arkadan
  const adres = yuruyusAdresleri(kayit.gorsel, kayit.buyuk);
  img.onload = () => {
    img.onload = null; // büyük kopya gelince yeniden çalışmasın: ölçü ilk kopyanınki kalır, kamera kesilmez
    if (!st || st.adim !== 'gor' || st.yuklenen !== ei || !img.isConnected) return;
    st.boyut = { w: img.naturalWidth, h: img.naturalHeight };
    // resmin CSS boyu sabit: büyük kopya aynı alanı daha keskin doldurur
    img.style.width = `${st.boyut.w}px`;
    img.style.height = `${st.boyut.h}px`;
    const hedef = gorHedef(kok);
    if (hedef && !hareketAz() && typeof img.animate === 'function') {
      // yerine oturma: biraz yakından başlar, yavaşça geri çekilir
      const g = gorusAlani(hedef.p, hedef.W, hedef.orta);
      const bas = durusa({ ...g, w: g.w / 1.06 }, hedef.W, hedef.orta);
      img.style.transform = donusum(hedef.p);
      img.animate([{ transform: donusum(bas) }, { transform: donusum(hedef.p) }], { duration: 1600, easing: 'cubic-bezier(0.15, 0.6, 0.25, 1)' });
      kok.dataset.olcek = hedef.olcek;
    } else gorKamera(true);
    kok.classList.remove('resimsiz');
    kok.classList.add('hazir');
    img.classList.add('acik');
    for (const e of sahne.querySelectorAll('img:not([data-gor-resim])')) {
      e.classList.add('gidiyor');
      setTimeout(() => e.remove(), hareketAz() ? 0 : 1100);
    }
    if (adres.buyuk) {
      const b = new Image();
      b.onload = () => {
        if (!img.isConnected) return;
        img.dataset.buyuk = adres.buyuk;
        img.src = adres.buyuk;
      };
      b.src = adres.buyuk;
    }
  };
  img.onerror = () => {
    if (st && st.yuklenen === ei) kok.classList.add('hazir', 'resimsiz');
  };
  img.src = adres.kucuk;
}

// Kameranın hedefi: ayrıntı (ya da resmin tamamı) üst çubukla panel arasındaki alana oturur; resim o alanı hep kaplar
function gorHedef(kok) {
  if (!st || !st.boyut) return null;
  const k = st.kareler[st.konum];
  const kayit = st.b.gor.eserler[k.ei].kayit;
  const sahne = kok.querySelector('[data-gor-sahne]').getBoundingClientRect();
  const W = sahne.width;
  const ust = kok.querySelector('.ders-ust').getBoundingClientRect().bottom - sahne.top + 8;
  const alt = kok.querySelector('[data-gor-panel]').getBoundingClientRect().top - sahne.top - 8;
  const { w: IW, h: IH } = st.boyut;
  const alanH = Math.max(120, alt - ust);
  const sigdir = Math.min(W / IW, alanH / IH); // resmin tamamı alana sığar
  let s;
  let cx;
  let cy;
  if (k.ni < 0) {
    s = sigdir;
    cx = IW / 2;
    cy = IH / 2;
  } else {
    const n = kayit.noktalar[k.ni];
    // ayrıntı alanın %88'ine sığar; resmin tamamından daha uzak olmaz, 6 kattan fazla yaklaşmaz
    s = Math.min(sigdir * 6, Math.max(sigdir, Math.min((W * 0.88) / (n.w * IW), (alanH * 0.88) / (n.h * IH))));
    cx = (n.x + n.w / 2) * IW;
    cy = (n.y + n.h / 2) * IH;
  }
  // resmin kenarı alanın içine girmesin (resim alandan küçükse ortalanır)
  const sinirla = (v, en, enCok) => (en > enCok ? (en + enCok) / 2 : Math.min(enCok, Math.max(en, v)));
  const tx = sinirla(W / 2 - cx * s, W - IW * s, 0);
  const ty = sinirla((ust + alt) / 2 - cy * s, alt - IH * s, ust);
  return { p: { tx, ty, s }, W, orta: (ust + alt) / 2, olcek: (s / sigdir).toFixed(2) };
}

// Kamera hedefe gider: anında ya da o an bulunduğu yerden yumuşak yolla (js/kamera.js)
function gorKamera(aninda) {
  const kok = ekran.querySelector('.ders-gor');
  if (!kok) return;
  const hedef = gorHedef(kok);
  if (!hedef) return;
  const img = kok.querySelector('[data-gor-resim]');
  kok.dataset.olcek = hedef.olcek;
  const simdi = donusumOku(getComputedStyle(img).transform);
  img.getAnimations().forEach((a) => a.cancel());
  if (aninda || !simdi || hareketAz() || typeof img.animate !== 'function') {
    img.style.transform = donusum(hedef.p);
    return;
  }
  const yol = kameraYolu(simdi, hedef.p, hedef.W, hedef.orta);
  img.style.transform = donusum(hedef.p);
  if (yol.uzunluk < 0.002) return;
  img.animate(kameraKareleri(yol), { duration: yol.sure, easing: 'linear' });
}

function gorIleri() {
  const k = st.kareler[st.konum];
  if (k.ni >= 0 && k.sira > st.gorulen) {
    st.gorulen = k.sira;
    ilerlemeYaz('gor', st.gorulen, st.b.gor.toplam);
  }
  if (st.konum >= st.kareler.length - 1) return adimSonu('gor');
  st.konum++;
  gorKare();
  ekran.querySelector('[data-gor-baslik]').focus({ preventScroll: true });
}

// ---------- 2. adım · Öğren ----------
// Her "Nasıl tanınır?" maddesi bir sayfa: doğrulanmış kanıtın eseri ve cümlesi, altında maddeyi açıklayan cümleler.
// Doğrulanmış kanıtı olmayan madde eser göstermeden, yalnız metinle anlatılır.
export async function ogrenAdimi(akim) {
  const x = await dersiAl(akim, cizimNo());
  if (!x) return;
  const { b } = x;
  st = { akim, adim: 'ogren', b, konum: kalinanYer(b.kayit.ogren.i, b.ogren.length), gorulen: Math.round(b.kayit.ogren.i * b.ogren.length), secili: 0, eserler: [] };
  if (!b.ogren.length) return adimSonu('ogren');
  return ogrenCiz('giris');
}

async function ogrenCiz(hareket = '') {
  const s = st;
  const b = s.b;
  const m = b.ogren[s.konum];
  const no = cizimNo();
  // kanıtların eserleri (bulunamayan eserin cümlesi yine de gösterilir: doğrulanmış kanıttır, yalnız görseli çıkmaz)
  const eserler = await Promise.all(m.kanitlar.map((k) => eseriBul(k).catch(() => null)));
  if (!guncelMi(no) || st !== s) return;
  s.eserler = eserler;
  s.secili = Math.min(s.secili, Math.max(0, m.kanitlar.length - 1));
  const toplam = b.ogren.length;
  const kanit = m.kanitlar[s.secili] || null;
  const eser = kanit ? eserler[s.secili] : null;
  const g = eser && (secilenGorsel(eser, kotuler()) || eser.gorseller[0]);
  const altyazi = (k, e) => [kisaAd(k.sanatci), e ? eserBaslik(e) : k.eser, e ? eserYili(e) : ''].filter(Boolean).join(' · ');
  const buyuk = kanit
    ? `<figure class="ders-kanit-buyuk" data-test="ders-kanit-eser">${
        g
          ? `<button type="button" data-ogren-buyut aria-label="${kacis(altyazi(kanit, eser))} · büyüt"><img decoding="async" alt="${kacis(altyazi(kanit, eser))}" src="${kacis(gorselUrl(g, 960))}" data-yedek="${kacis(gorselYedek(g))}"></button>`
          : ''
      }<figcaption>${kacis(altyazi(kanit, eser))}</figcaption></figure>`
    : '';
  const serit =
    m.kanitlar.length > 1
      ? `<div class="ders-kanit-serit" role="group" aria-label="Aynı özellik başka eserlerde">${m.kanitlar
          .map(
            (k, i) =>
              `<button type="button" data-ogren-kanit="${i}" aria-pressed="${i === s.secili}" aria-label="${kacis(altyazi(k, eserler[i]))}">${eserler[i] ? kucukGorsel(eserler[i], 330) : ''}<span>${kacis(kisaAd(k.sanatci))}</span></button>`,
          )
          .join('')}</div>`
      : '';
  const aciklama = m.aciklamalar.length
    ? `<section class="ders-aciklama" data-test="ders-aciklama" aria-label="Açıklama"><span class="ders-etiket soluk">Açıklama</span>${m.aciklamalar
        .map((a) => `<p data-aciklama-id="${kacis(a.id)}">${a.sanatci && kisaAd(a.sanatci) ? `<b>${kacis(kisaAd(a.sanatci))}:</b> ` : ''}${kacis(a.cumle)}</p>`)
        .join('')}</section>`
    : '';
  const son = s.konum >= toplam - 1;
  ciz(
    `${adimUst(b, 'ogren', `Öğren · ${roma(s.konum + 1)} / ${roma(toplam)}`)}
    <article class="ders-ogren" data-test="ders-ogren" data-madde="${m.no}" data-kanit-sayisi="${m.kanitlar.length}">
      ${buyuk}
      <h2 class="ders-madde" tabindex="-1" data-test="ders-madde">${kacis(m.madde)}</h2>
      ${
        kanit
          ? `<blockquote class="ders-kanit" data-test="ders-kanit" data-kanit-id="${kacis(kanit.id)}"><span class="ders-etiket">Bu eserde</span><p>${kacis(kanit.cumle)}</p></blockquote>`
          : `<p class="ders-kanit-yok" data-test="ders-kanit-yok">Bu özellik için doğrulanmış bir eser örneği henüz yok; şimdilik yalnız metinle.</p>`
      }
      ${serit}
      ${aciklama}
    </article>
    ${altCubuk(`${s.konum > 0 ? `<button class="ders-dugme" type="button" data-ogren-geri data-test="ogren-geri">Geri</button>` : ''}<button class="ders-dugme dolu" type="button" data-ogren-ileri data-test="ogren-ileri"><span>${son ? 'Anladım · Öğren’i bitir' : `Anladım · ${roma(s.konum + 2)}. özellik`}</span></button>`)}`,
    hareket,
  );
  ekran.querySelector('.ders-madde').focus({ preventScroll: true });
}

function ogrenIleri() {
  const toplam = st.b.ogren.length;
  if (st.konum + 1 > st.gorulen) {
    st.gorulen = st.konum + 1;
    ilerlemeYaz('ogren', st.gorulen, toplam);
  }
  if (st.konum >= toplam - 1) return adimSonu('ogren');
  st.konum++;
  st.secili = 0;
  ogrenCiz('giris').catch(hataGoster);
}

// ---------- 3. adım · Ayırt et ----------
// Her komşu dönemle bir ikili: iki akımın birinci eserleri yan yana ("Hangisi …?"). Cevaptan sonra iki akımın
// "Nasıl tanınır?" maddeleri iki sütunda ve (varsa) dönem metinlerindeki karşılaştırma cümleleri. Yeni cümle yazılmaz.
export async function ayirtAdimi(akim) {
  const x = await dersiAl(akim, cizimNo());
  if (!x) return;
  const { b } = x;
  st = { akim, adim: 'ayirt', b, konum: kalinanYer(b.kayit.ayirt.i, b.ayirt.length), gorulen: Math.round(b.kayit.ayirt.i * b.ayirt.length), ikili: null };
  if (!b.ayirt.length) return adimSonu('ayirt');
  return ayirtCiz('giris');
}

async function ayirtCiz(hareket = '') {
  const s = st;
  const b = s.b;
  const c = b.ayirt[s.konum];
  if (!s.ikili || s.ikili.konum !== s.konum) {
    const no = cizimNo();
    const [kendi, karsi] = await Promise.all([ilkEser(c.kendi), ilkEser(c.karsi)]);
    if (!guncelMi(no) || st !== s) return;
    // hangi eserin solda duracağı rastgele; cevap: null | 0 | 1
    const kendiSolda = d.rng() < 0.5;
    s.ikili = { konum: s.konum, yanlar: kendiSolda ? [kendi, karsi] : [karsi, kendi], dogru: kendiSolda ? 0 : 1, cevap: null };
  }
  const ik = s.ikili;
  const toplam = b.ayirt.length;
  const cevapli = ik.cevap !== null;
  const yan = (x, i) => {
    const kendiMi = i === ik.dogru;
    const akim = kendiMi ? b.akim : c.komsu;
    const g = x && (secilenGorsel(x.e, kotuler()) || x.e.gorseller[0]);
    const sinif = cevapli ? (kendiMi ? ' dogru' : ik.cevap === i ? ' yanlis' : '') : '';
    const ad = x ? [kisaAd(x.sid), eserBaslik(x.e), eserYili(x.e)].filter(Boolean).join(' · ') : '';
    return `<button class="ders-ikili-eser${sinif}" type="button" data-ayirt-sec="${i}" data-akim="${cevapli ? kacis(akim) : ''}" aria-pressed="${ik.cevap === i}" aria-label="${cevapli ? `${kacis(akim)}: ${kacis(ad)} · büyüt` : i === 0 ? 'Soldaki eser' : 'Sağdaki eser'}">
        <span class="ders-ikili-resim">${g ? `<img decoding="async" alt="" src="${kacis(gorselUrl(g, 500))}" data-yedek="${kacis(gorselYedek(g))}">` : ''}</span>
        ${cevapli ? `<span class="ders-ikili-ad">${kendiMi ? ikon('dogru', 14, 2.4) : ''}<b>${kacis(akim)}</b><small>${kacis(ad)}</small></span>` : `<span class="ders-ikili-ad bos">${i === 0 ? 'Soldaki' : 'Sağdaki'}</span>`}
      </button>`;
  };
  const liste = (ad, l) => `<div><b>${kacis(ad)}</b><ul>${l.map((x) => `<li>${kacis(x)}</li>`).join('')}</ul></div>`;
  const fark = cevapli
    ? `<section class="ders-fark" data-test="ders-fark" aria-live="polite">
        <span class="ders-etiket ${ik.cevap === ik.dogru ? 'dogru' : 'yanlis'}" data-test="ayirt-sonuc" data-dogru="${ik.cevap === ik.dogru}">${ik.cevap === ik.dogru ? 'Doğru · farkı gör' : 'Öbürüydü · farkı gör'}</span>
        <div class="ders-fark-sutunlar">${liste(b.akim, c.maddeler.kendi)}${liste(c.komsu, c.maddeler.komsu)}</div>
        ${c.cumleler.map((x) => `<blockquote class="ders-fark-cumle" data-test="ayirt-cumle"><p>${kacis(x.cumle)}</p><small>Dönem metni · ${kacis(String(x.kaynak).split('·').pop().trim())}</small></blockquote>`).join('')}
        <a class="ders-fark-bag" href="${akimKarsilastirmaAdresi(b.akim, c.komsu)}">${ikon('karsilastir', 16, 1.6)}<span>İki dönemi ayrıntılı karşılaştır</span></a>
      </section>`
    : '';
  const son = s.konum >= toplam - 1;
  ciz(
    `${adimUst(b, 'ayirt', `Ayırt et · ${s.konum + 1} / ${toplam}`)}
    <div class="ders-ayirt" data-test="ders-ayirt" data-komsu="${kacis(c.komsu)}">
      <h2 class="ders-soru" tabindex="-1">Hangisi ${kacis(b.akim)}?</h2>
      <p class="ders-soru-alt">Komşu dönem: ${kacis(c.komsu)}${c.acik ? '' : ' (henüz açılmadı)'}</p>
      <div class="ders-ikili" data-test="ders-ikili">${ik.yanlar.map(yan).join('')}</div>
      ${fark}
    </div>
    ${cevapli ? altCubuk(`${s.konum > 0 ? `<button class="ders-dugme" type="button" data-ayirt-geri data-test="ayirt-geri">Geri</button>` : ''}<button class="ders-dugme dolu" type="button" data-ayirt-ileri data-test="ayirt-ileri"><span>${son ? 'Ayırt et’i bitir' : 'Sonraki ikili'}</span></button>`) : ''}`,
    hareket,
  );
  ekran.querySelector(cevapli ? '[data-ayirt-ileri]' : '.ders-soru').focus({ preventScroll: true });
}

function ayirtSec(i) {
  const ik = st.ikili;
  if (!ik) return;
  if (ik.cevap !== null) {
    // cevaptan sonra esere dokununca tam ekran (iki eser yan yana gezilir)
    const eserler = ik.yanlar.filter(Boolean).map((x) => x.e);
    const hedef = ik.yanlar[i];
    if (hedef) goruntuleyiciAc({ eserler, baslangic: eserler.indexOf(hedef.e), notu: notuIcin(hedef.sid), ...gorselTercihi() });
    return;
  }
  ik.cevap = i;
  if (st.konum + 1 > st.gorulen) {
    st.gorulen = st.konum + 1;
    ilerlemeYaz('ayirt', st.gorulen, st.b.ayirt.length);
  }
  ayirtCiz('').catch(hataGoster);
}

// ---------- olaylar ----------
export function olaylariBagla() {
  ekran.addEventListener('click', (e) => {
    // adımdan adıma geçiş: yığında yer değiştirir (geri okunda ders sayfası)
    const gec = e.target.closest('[data-ders-gec]');
    if (gec) {
      e.preventDefault();
      gezin(gec.getAttribute('href'), 'bolum');
      return;
    }
    if (!st || st.bitti || !ekran.querySelector('.ders-gor, .ders-ogren, .ders-ayirt')) return;
    if (st.adim === 'gor') {
      if (e.target.closest('[data-gor-ileri]')) return gorIleri();
      if (e.target.closest('[data-gor-geri]') && st.konum > 0) {
        st.konum--;
        gorKare();
      }
      return;
    }
    if (st.adim === 'ogren') {
      if (e.target.closest('[data-ogren-ileri]')) return ogrenIleri();
      if (e.target.closest('[data-ogren-geri]') && st.konum > 0) {
        st.konum--;
        st.secili = 0;
        ogrenCiz('giris').catch(hataGoster);
        return;
      }
      const kn = e.target.closest('[data-ogren-kanit]');
      if (kn) {
        st.secili = Number(kn.dataset.ogrenKanit);
        const y = window.scrollY;
        ogrenCiz('')
          .then(() => window.scrollTo(0, y))
          .catch(hataGoster);
        return;
      }
      if (e.target.closest('[data-ogren-buyut]')) {
        const m = st.b.ogren[st.konum];
        const cift = m.kanitlar.map((k, i) => ({ k, e: st.eserler[i] })).filter((x) => x.e);
        const secili = st.eserler[st.secili];
        if (secili) goruntuleyiciAc({ eserler: cift.map((x) => x.e), baslangic: cift.findIndex((x) => x.e === secili), notu: notuIcin(m.kanitlar[st.secili].sanatci), ...gorselTercihi() });
      }
      return;
    }
    if (st.adim === 'ayirt') {
      const sec = e.target.closest('[data-ayirt-sec]');
      if (sec) return ayirtSec(Number(sec.dataset.ayirtSec));
      if (e.target.closest('[data-ayirt-ileri]')) {
        if (st.konum >= st.b.ayirt.length - 1) return adimSonu('ayirt');
        st.konum++;
        ayirtCiz('giris').catch(hataGoster);
        return;
      }
      if (e.target.closest('[data-ayirt-geri]') && st.konum > 0) {
        st.konum--;
        ayirtCiz('giris').catch(hataGoster);
      }
    }
  });
  // Gör: ekran dönünce ya da boyu değişince kamera yeniden kurulur
  window.addEventListener('resize', () => {
    if (st && st.adim === 'gor' && !st.bitti) gorKamera(true);
  });
}
