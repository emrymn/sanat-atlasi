// Ayarlar: günlük kart, tema, çevrimdışı görsel indirme, yedekle ve geri yükle.
import { GUNLUK_YENI_SINIRI } from '../leitner.js';
import { gosterilenGorseller } from '../eserler.js';
import { devasaAdresleri, devasaSuz, suzulduMu, telefonAdresleri, telefonToplamBayt, tahminiBayt } from '../gorsel.js';
import { cihazdakiElleOdaklar, ELLE_ANAHTAR, cihazdakiGununResimleri, gununResmiKoy, tumGununResimleri, seciliGununResmi } from '../gorsel.js';
import { sanatciEserleri } from '../eserler.js';
import { goruntuleyiciAc } from '../goruntuleyici.js';
import { yedekMetni, yedekCoz, yedekYarimOturum, TEMALAR, gelistiriciAc, gelistiriciKapat, kayitKilidiniAc, HAREKETLER, HAREKET_AD, YAZILAR, YAZI_AD } from '../depo.js';
import { idbKoy } from '../idb.js';
import { kayitGecerliMi } from '../devam.js';
import { acikListe, bugun, d, gununRengi, ciz, ust, TEMA_AD, ekran, kaydet, temaUygula, gununId, gununHavuzu, gununResimleriYukle, kotuler } from './ortak.js';
import { baskaSanatci } from '../gunun.js';
import { bilinenAd } from '../adlar.js';
import { yedekTarihiYaz } from './bugun.js';
import { yarimSil } from './pekistir.js';
import { SURUM } from '../surum.js';
import { egimVar, izinGerekli, egimIzni, izinVarMi } from '../egim.js';
import { titret, tik } from '../titresim.js';
import { ikon } from '../tasarim.js';
import { kacis } from '../yardimci.js';
import { vadeSayisi, yarinVade } from '../gecmis.js';
import { rozetDestekli, rozetYaz, rozetIzni } from '../rozet.js';
import { bildirimMetni } from '../bildirim.js';
import { YENILIKLER, yenilikYazisi } from '../yenilikler.js';
import { bolumler } from './harita.js';
import { hatalariOku, hatalariTemizle, gunlukMetni, hataEkle } from '../hataGunlugu.js';
import { sitedekiSurum, guncellemeyiDene } from '../guncelleme.js';
import { telefondaOlanlar, kaliciSil, kaliciYaz, eskileriTasi, PARCA, defterOku, defterYaz, defterSil, defterAdi, depoDurumu } from '../devasaOnbellek.js';

// ---------- Ayarlar ----------
// İş 126 (Emre: "küçük resmi indiri kaldırabiliriz, bir işe yaramıyor"): "Görselleri çevrimdışı indir" (pekiştirme
// görsellerinin 1280'likleri) kaldırıldı; görseller açıldıkça zaten önbelleğe girer, en büyük kopyalar ayrı indirilir.

// İ5: bildirilen görseller; JSON olarak kopyalanır (bir Claude oturumuna verilip gorsel_kararlari.json'a işletilir)
function bildirimBolumu() {
  const b = d.ilerleme.bildirimler || [];
  const ilk = b.slice(0, 8);
  return `<div class="ayar" data-test="bildirimler"><b>Bildirdiğim görseller</b>
        <p>${b.length ? `${b.length} bildirim. Bildirilen görseller ve eserler pekiştirmede çıkmaz. Listeyi kopyalayıp bir Claude oturumuna ver; görsel kararlarına işlensin.` : 'Henüz bildirdiğin görsel yok. Eser görüntüleyicide ya da cevap yaprağında “⋯” ile bildirebilirsin.'}</p>
        ${ilk.length ? `<ul class="bildir-liste">${ilk.map((x) => `<li>${kacis(x.baslik || x.a)}<small>${kacis(x.neden)} · ${kacis(x.t)}</small></li>`).join('')}${b.length > ilk.length ? `<li><small>ve ${b.length - ilk.length} bildirim daha</small></li>` : ''}</ul>` : ''}
        ${b.length ? '<button class="dugme" type="button" data-bildirim-kopyala>JSON olarak kopyala</button> <button class="dugme" type="button" data-bildirim-temizle>Listeyi temizle</button>' : ''}
        <textarea id="bildirim-cikti" readonly hidden aria-label="Bildirim listesi"></textarea>
        <p class="mesaj" id="bildirim-mesaj" aria-live="polite"></p>
      </div>`;
}

// İ2: rozet sayısı. Uygulama açıkken bugünün, gizlenirken (kapanırken) yarının vadeli sanatçı sayısı
export function rozetiGuncelle(kapaniyor = false) {
  if (!d.ilerleme || !d.ilerleme.ayarlar.rozet) return Promise.resolve(false);
  const idler = acikListe().map((s) => s.id);
  const n = kapaniyor ? yarinVade(d.ilerleme.skorlar, idler, bugun()) : vadeSayisi(d.ilerleme.skorlar, idler, bugun());
  return rozetYaz(n);
}

export function ayarlarSayfasi() {
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
      <div class="ayar"><b id="yazi-etiket">Yazı boyutu</b>
        <div class="parcali" role="radiogroup" aria-labelledby="yazi-etiket" data-test="ayar-yazi">
          ${YAZILAR.map((t) => `<label><input type="radio" name="yazi" value="${t}" ${a.yazi === t ? 'checked' : ''}><span>${YAZI_AD[t]}</span></label>`).join('')}
        </div>
        <p>Büyük: okuma metinleri, açıklamalar ve küçük yazılar bir boy büyür.</p>
      </div>
      <div class="ayar"><b id="hareket-etiket">Hareket</b>
        <div class="parcali" role="radiogroup" aria-labelledby="hareket-etiket" data-test="ayar-hareket">
          ${HAREKETLER.map((t) => `<label><input type="radio" name="hareket" value="${t}" ${a.hareket === t ? 'checked' : ''}><span>${HAREKET_AD[t]}</span></label>`).join('')}
        </div>
        <p>Sade: sayfa geçişleri ve cevap anı kalır; sürekli dönen, nefes alan, parlayan süs hareketleri durur. Kapalı: hiçbir şey hareket etmez.</p>
      </div>
      <div class="ayar"><label class="konu"><span class="metin"><b>Yeni sanatçıyla önce tanış</b><small>Bir sanatçı ilk kez sorulmadan önce en bilinen 3 eseri ve “Nasıl tanırım?” notu gösterilir.</small></span>
        <input class="anahtar" type="checkbox" role="switch" data-ayar-tanisma ${a.tanisma !== false ? 'checked' : ''} aria-label="Yeni sanatçıyla önce tanış"></label></div>
      <div class="ayar"><label class="konu"><span class="metin"><b>Simge rozeti</b><small>${rozetDestekli() ? 'Ana ekrandaki Atlas simgesinde tekrarı gelen sanatçı sayısı görünür. İzin ister; sayı uygulama kapanırken yarının sayısına ayarlanır.' : 'Bu tarayıcı simge rozetini desteklemiyor (iOS 16.4+ ana ekran uygulaması gerekir).'}</small></span>
        <input class="anahtar" type="checkbox" role="switch" data-ayar-rozet ${a.rozet ? 'checked' : ''} ${rozetDestekli() ? '' : 'disabled'} aria-label="Simge rozeti"></label>
        <p class="mesaj" id="rozet-mesaj" aria-live="polite"></p></div>
      <div class="ayar"><label class="konu"><span class="metin"><b>Titreşim</b><small>Cevaba dokununca telefon hafifçe titrer. iPhone’da iOS 18 ve sonrası gerekir; Ayarlar → Sesler ve Dokunuş → Sistem Dokunuşları açık olmalı. Android’de doğruda bir, yanlışta iki kez titrer.</small></span>
        <input class="anahtar" type="checkbox" role="switch" data-ayar-titresim data-test="ayar-titresim" ${a.titresim !== false ? 'checked' : ''} aria-label="Titreşim"></label>
        <button class="dugme ince" type="button" data-titresim-dene data-test="titresim-dene">${tik(true)}Titreşimi dene</button></div>
      <div class="ayar"><label class="konu"><span class="metin"><b>Telefonu eğince tablo oynasın</b><small>${egimVar() ? 'Tuval’deki günün tablosu telefonu sağa sola çevirdikçe, öne arkaya eğdikçe hafifçe döner, ışık üstünden kayar; sergi duvarında ve Koleksiyonum’da tablolar ipinden sallanır, Atölye’deki deste yelpaze açılır.' + (izinGerekli() ? ' iPhone hareket izni ister ve uygulama kapanınca çoğu zaman unutur: o zaman Tuval’deki ya da buradaki düğmeyle yeniden ver.' : '') : 'Bu tarayıcı hareket algılayıcısını desteklemiyor.'}</small></span>
        <input class="anahtar" type="checkbox" role="switch" data-ayar-egim ${a.egim !== false ? 'checked' : ''} ${egimVar() ? '' : 'disabled'} aria-label="Telefonu eğince tablo oynasın"></label>
        <button class="dugme ince" type="button" data-egim-izin data-test="egim-izin" hidden>${ikon('hareket', 18, 1.6)} Hareket iznini ver</button>
        <p class="mesaj" id="egim-mesaj" aria-live="polite"></p></div>
      <div class="ayar"><b>Günün sanatçısı</b>
        <p>Bugün: <span data-gunun-ad data-test="gunun-ad">${kacis(gununAdi())}</span>. Başka biriyle değiştirebilirsin; gün boyunca o kalır, yarın yeni sanatçı kendiliğinden gelir.</p>
        <button class="dugme ince" type="button" data-gunun-degistir data-test="gunun-degistir">Başka bir sanatçı getir</button>
        <p class="mesaj" id="gunun-mesaj" aria-live="polite"></p>
      </div>
      ${telefonAdresleri().length ? `<div class="ayar" data-test="devasa-indir"><b>En büyük kopyaları telefona indir</b>
        <p id="devasa-bilgi">Hesaplanıyor…</p>
        <button class="dugme" type="button" data-devasa-indir>İndir</button>
        <button class="dugme ince" type="button" data-devasa-durdur hidden>Durdur</button>
        <button class="dugme ince" type="button" data-devasa-sil hidden>Telefondan sil</button>
        <progress id="devasa-cubuk" max="1" value="0" hidden></progress>
        <p class="mesaj" id="devasa-mesaj" aria-live="polite"></p>
      </div>` : ''}
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
      ${bildirimBolumu()}
      ${hataBolumu()}
      <div class="ayar"><label class="konu"><span class="metin"><b>Geliştirici modu</b><small>Bütün konular, sanatçılar ve harita bölümleri açılır. Kapatınca açmadan önceki ilerlemen olduğu gibi geri gelir; mod açıkken çözdüklerin sayılmaz.</small></span>
        <input class="anahtar" type="checkbox" role="switch" data-ayar-gelistirici ${d.ilerleme.gelistirici ? 'checked' : ''} aria-label="Geliştirici modu"></label>
        <p class="mesaj" id="gelistirici-mesaj" aria-live="polite"></p></div>
      ${gununResmiBolumu()}
      ${elleOdakBolumu()}
      <div class="ayar" data-test="surum-denetle"><b>Sürüm</b>
        <p>Bu cihazda ${SURUM}. Yeni sürüm kendiliğinden gelmezse buradan denetle.</p>
        <button class="dugme ince" type="button" data-surum-denetle>Yeni sürüm var mı?</button>
        <p class="mesaj" id="surum-mesaj" aria-live="polite"></p>
      </div>
      <div class="ayar"><b>Yenilikler</b>
        <ul class="yenilik-liste" data-test="yenilikler">${YENILIKLER.map((x) => `<li>${kacis(yenilikYazisi(x))}</li>`).join('')}</ul>
      </div>
    </div>
    <p class="alt-not">Sanat Atlası ${SURUM} · Görseller: Wikimedia Commons, müze açık erişim koleksiyonları ve WikiArt · Eser listeleri: Wikidata</p>`);
  devasaBilgisi();
  egimIzinDugmesi();
}

// İş 115: yerel hata günlüğü (js/hataGunlugu.js); kopyalanıp Claude'a gönderilir
function hataBolumu() {
  const l = hatalariOku();
  return `<div class="ayar" data-test="hata-gunlugu"><b>Hata günlüğü</b>
        <p>${l.length ? `${l.length} kayıt (son: ${kacis(new Date(l[l.length - 1].z).toLocaleString('tr-TR'))}). Bir şey bozulursa kopyalayıp Claude’a gönder.` : 'Kayıtlı hata yok.'}</p>
        ${l.length ? '<button class="dugme" type="button" data-hata-kopyala>Kopyala</button> <button class="dugme ince" type="button" data-hata-temizle>Temizle</button>' : ''}
        <textarea id="hata-cikti" readonly hidden aria-label="Hata günlüğü"></textarea>
        <p class="mesaj" id="hata-mesaj" aria-live="polite"></p>
      </div>`;
}

// "Hareket iznini ver": yalnız izin isteyen tarayıcıda (iPhone), hareket açıkken ve iOS izni hatırlamıyorsa görünür
async function egimIzinDugmesi() {
  const btn = ekran.querySelector('[data-egim-izin]');
  if (!btn) return;
  btn.hidden = true;
  if (!izinGerekli() || d.ilerleme.ayarlar.egim === false) return;
  const hatirliyor = await izinVarMi();
  if (btn.isConnected) btn.hidden = hatirliyor;
}

// İş 60: en büyük kopyalar (4096 px) telefona; görüntüleyici önce oraya bakar, internet yokken de büyük kopya açılır.
// İş 129: telefondaki yer IndexedDB (js/devasaOnbellek.js); iPhone'da Cache Storage bozulmuştu.
const gb = (b) => (b / 1e9).toLocaleString('tr', { maximumFractionDigits: 1, minimumFractionDigits: 1 });

// İş 84: telefondaki en büyük kopyalar. Listede olmayanlar (daha büyük dosyasıyla yenilenip yeni adres alanların eski
// kopyaları ya da artık kullanılmayanlar) silinir: yer kaplamasın; yenileri "indir"le gelir
// İş 121: indirme listesi yalnız uygulamada gösterilen görsellerin en büyük kopyaları (bir kez hesaplanır); telefonda
// listede olmayan (kopya kaydın ikinci dosyası, çıkarılan görsel, eski sürüm) kopyalar telefondakiler'de silinir
let devasaSuzuldu = null;
function devasaHazirla() {
  devasaSuzuldu ||= gosterilenGorseller()
    .then(devasaSuz)
    .catch(() => {
      devasaSuzuldu = null;
    });
  return devasaSuzuldu;
}

// İş 127: telefondaki sayı bir önceki bakıştan çok azaldıysa (inenler silinmiş) hata günlüğüne yazılır: gerçek cihazda
// "baştan indiriyor"un sebebi görülsün
const SAYI = 'sanat-atlasi:devasa-sayi';
async function telefondakiler() {
  await devasaHazirla();
  try {
    // İş 130: gösterilenler hesaplanamadıysa liste 1280'likleri içermez: telefondakiler silinmesin
    const { adresler, korundu } = await telefondaOlanlar(new Set(telefonAdresleri()), { sil: suzulduMu() });
    let once = 0;
    try {
      once = Number(localStorage.getItem(SAYI)) || 0;
      localStorage.setItem(SAYI, String(adresler.size));
    } catch {
      once = 0;
    }
    if (once - adresler.size > 5) hataEkle({ m: `Telefondaki en büyük kopyalar azaldı: önce ${once}, şimdi ${adresler.size}`, k: korundu ? `listede olmayan ${korundu} korundu` : '', a: location.hash });
    if (korundu) hataEkle({ m: `En büyük kopya temizliği yapılmadı: listede olmayan ${korundu} / ${adresler.size + korundu}`, k: '', a: location.hash });
    return adresler;
  } catch (e) {
    return new Set();
  }
}

async function devasaBilgisi() {
  const el = document.getElementById('devasa-bilgi');
  if (!el) return;
  const var_ = await telefondakiler(); // önce: gösterilen görseller hesaplanır (liste ondan sonra doğru)
  const hepsi = telefonAdresleri();
  const n = hepsi.filter((u) => var_.has(u)).length;
  const toplam = telefonToplamBayt();
  const nd = devasaAdresleri().length;
  const ne = hepsi.length > nd ? `${nd} eserin 4096 piksele kadar en yüksek kalitedeki hali ve sayfalarda görünen 1280 ile 400 piksellik halleri (${hepsi.length} dosya)` : `${nd} eserin 4096 piksele kadar en yüksek kalitedeki hali`;
  // İş 130 (Emre: "hepsi indikten sonra indirme tuşu kalksın"): hepsi telefondaysa İndir düğmesi kalkar
  const hepsiVar = hepsi.length > 0 && n >= hepsi.length;
  el.textContent = hepsiVar
    ? `Hepsi telefonda: ${hepsi.length} görsel (${ne})${toplam ? ` · ${gb(toplam)} GB` : ''}. Sayfalar ve görüntüleyici internet olmadan, telefondan açılır.`
    : `${ne}${toplam ? ` · toplam ${gb(toplam)} GB` : ''}. Telefonda: ${n} / ${hepsi.length}. İnince sayfalar ve görüntüleyici internet olmadan, telefondan açılır. Wi-Fi’de indir. Telefonu yormamak için ~${gb(PARCA * 3.3e6)} GB’lık parçalar hâlinde iner; her parçadan sonra uygulama (Ayarlar açıksa) kendini yenileyip sıradakine geçer. Kapatırsan, bir dahaki açışında kaldığı yerden kendiliğinden sürer (iPhone kapalı uygulamanın indirmesine izin vermiyor).`;
  const suruyor = !!(d.devasaIndirme && !d.devasaIndirme.bitti);
  const indir = ekran.querySelector('[data-devasa-indir]');
  if (indir) indir.hidden = hepsiVar && !suruyor;
  const sil = ekran.querySelector('[data-devasa-sil]');
  if (sil) sil.hidden = !n || suruyor;
  if (d.devasaIndirme) devasaGoster();
  // İş 124: parça başka sayfadayken bittiyse Ayarlar'a dönünce yenilenip sıradaki parçaya geçilir
  if (d.devasaIndirme && d.devasaIndirme.bitti && d.devasaIndirme.parcaBitti && !d.devasaIndirme.yenileniyor) {
    d.devasaIndirme.yenileniyor = true;
    parcaArasi();
  }
}

function devasaGoster() {
  const i = d.devasaIndirme;
  const cubuk = document.getElementById('devasa-cubuk');
  const mesaj = document.getElementById('devasa-mesaj');
  if (!cubuk || !i) return;
  const suruyor = !i.bitti;
  cubuk.hidden = false;
  cubuk.max = i.toplam || 1;
  cubuk.value = i.biten;
  // İş 120: indirme sürerken başka sayfaya geçilince (ya da Ayarlar kenardan kaydırılırken katmandayken) düğmeler
  // ekranda değil: çubuğun bulunduğu sayfada aranır, yoksa atlanır (hata indirmeyi yarıda kesip "sürüyor"da bırakıyordu)
  const kok = cubuk.closest('main, .sayfa-katman') || document;
  const dugme = (s) => kok.querySelector(s) || { hidden: false, disabled: false };
  dugme('[data-devasa-indir]').disabled = suruyor;
  dugme('[data-devasa-durdur]').hidden = !suruyor;
  dugme('[data-devasa-sil]').hidden = suruyor;
  if (!mesaj) return;
  mesaj.className = 'mesaj' + (i.yerYok || i.inemedi || (i.bitti && i.hata) ? ' hata' : i.bitti ? ' tamam' : '');
  const toplam = telefonToplamBayt();
  const kac = toplam && i.hepsi ? ` · ~${gb(Math.min(toplam, i.oncedenBayt + i.bitenBayt))} / ${gb(toplam)} GB` : '';
  if (i.yerYok) mesaj.textContent = `Telefonda yer kalmadı: ${i.biten - i.hata} görsel indirildi. Yer açıp yeniden bas, kaldığı yerden sürer.`;
  else if (i.bitti && i.durduruldu) mesaj.textContent = `Durduruldu: ${i.biten - i.hata} görsel indirildi. Yeniden basınca kaldığı yerden sürer.`;
  else if (i.bitti && i.inemedi && i.yazilamadi) mesaj.textContent = `Görseller indi ama telefona kaydedilemedi (${i.sonHata || 'bilinmeyen hata'}). Hata günlüğünü kopyalayıp gönder.`;
  else if (i.bitti && i.inemedi) mesaj.textContent = 'Görseller indirilemedi. İnternet bağlantını kontrol edip yeniden bas; kaldığı yerden sürer.';
  else if (i.bitti && i.parcaBitti)
    mesaj.textContent = `Parça ${i.parca} / ${i.parcaSayisi} bitti · telefonda ${i.onceden + i.biten - i.hata} / ${i.hepsi}. ${location.hash === '#/ayarlar' ? 'Uygulama yenileniyor, sıradaki parça kendiliğinden başlayacak…' : 'Sıradaki parça Ayarlar’a dönünce ya da uygulamayı yeniden açınca başlar.'}`;
  else if (i.bitti) mesaj.textContent = i.toplam ? `Bitti: ${i.biten - i.hata} görsel indirildi${i.hata ? `, ${i.hata} indirilemedi (yeniden basınca tekrar denenir)` : ''}.` : 'Hepsi zaten telefonda.';
  // İş 126: toplam telefonda olan (parça içi sayaç her parçada sıfırdan başlıyor, baştan iniyor sanılıyordu)
  else mesaj.textContent = `Telefonda ${i.onceden + i.biten - i.hata} / ${i.hepsi} · Parça ${i.parca} / ${i.parcaSayisi}${kac}`;
}

// İş 120 (Emre: "uygulama kapalıyken de indirsin"): iPhone ana ekran uygulamalarına kapalıyken indirme izni vermiyor
// (Safari'de Background Fetch yok; uygulama kapanınca ya da arka planda kalınca iş durur). Yerine: başlatılan indirme
// yarıda kalırsa (uygulama kapandı) bir sonraki açılışta kendiliğinden kaldığı yerden sürer; başka sayfalarda gezerken
// de arkada iner. İşaret localStorage'da; indirme biter, durdurulur ya da silinirse kalkar.
const SURDUR = 'sanat-atlasi:devasa-surdur';
const surdurIsareti = (v) => {
  try {
    if (v) localStorage.setItem(SURDUR, '1');
    else localStorage.removeItem(SURDUR);
  } catch {
    /* depo kapalı */
  }
};
// İş 123: indirme izi (localStorage): bir önceki açılışta indirme sürerken uygulama kapandıysa (çöktü ya da kapatıldı)
// iz kalır; açılışta hata günlüğüne yazılır, sonra silinir
const IZ = 'sanat-atlasi:devasa-iz';
function izBirak(v) {
  try {
    if (v) localStorage.setItem(IZ, JSON.stringify(v));
    else localStorage.removeItem(IZ);
  } catch {
    /* depo kapalı */
  }
}
function iziOku() {
  try {
    const v = JSON.parse(localStorage.getItem(IZ) || 'null');
    if (v && v.n) hataEkle({ m: `En büyük kopya indirmesi yarıda kaldı (uygulama kapandı ya da çöktü): ${v.n}. / ${v.toplam} görselde`, k: String(v.u || ''), y: String(v.z || ''), a: '#/ayarlar' });
  } catch {
    /* bozuk iz */
  }
  izBirak(null);
}

export async function devasaSurdur() {
  if (!d.devasaIndirme) iziOku(); // bu açılışta indirme başladıysa iz onundur (yarıda kalmış sayılmaz)
  await eskileriTasi(); // İş 129: eski (Cache Storage) kopyalar IndexedDB'ye; okunamayanlar silinir
  await devasaHazirla();
  let var_ = false;
  try {
    var_ = localStorage.getItem(SURDUR) === '1';
  } catch {
    var_ = false;
  }
  if (var_ && telefonAdresleri().length && 'indexedDB' in window && !(d.devasaIndirme && !d.devasaIndirme.bitti)) devasaIndir({ kendiliginden: true }).catch(() => {});
}

// İş 135: tek görselin inme süresi sınırı (en büyük kopyalar 3–5 MB, ötekiler küçük)
const INDIRME_SURESI_BUYUK = 90000;
const INDIRME_SURESI = 30000;

async function devasaIndir({ kendiliginden = false } = {}) {
  if (d.devasaIndirme && !d.devasaIndirme.bitti) return;
  const m = document.getElementById('devasa-mesaj');
  if (!('indexedDB' in window)) {
    if (m) {
      m.className = 'mesaj hata';
      m.textContent = 'Bu tarayıcıda telefona kaydetme desteklenmiyor.';
    }
    return;
  }
  surdurIsareti(true);
  const var_ = await telefondakiler();
  const hepsi = telefonAdresleri();
  // İş 124: bu açılışta yalnız bir parça (PARCA görsel); bitince Ayarlar açıksa uygulama yenilenip sıradaki parça
  // kendiliğinden başlar (bellek sıfırlanır), değilse bir dahaki açılışta sürer
  const PARCA_ADET = 1000; // İş 131: bir parçada en çok bu kadar dosya (400'lükler çok küçük)
// İş 131: parça boyu bayt olarak (PARCA en büyük kopya kadar): 1280'likler ve 400'lükler küçük, bir parçaya çok sığar
  const kalan = hepsi.filter((u) => !var_.has(u));
  const ort = tahminiBayt('/d/0');
  const boy = (window.__atlasParca || PARCA) * ort; // testler küçük parça kullanır
  const urller = [];
  let parcaBayt = 0;
  for (const u of kalan) {
    if (urller.length && (parcaBayt + tahminiBayt(u) > boy + 1 || urller.length >= PARCA_ADET)) break;
    urller.push(u);
    parcaBayt += tahminiBayt(u);
  }
  const bayt = (l) => l.reduce((t, u) => t + tahminiBayt(u), 0);
  const hepsiBayt = bayt(hepsi);
  const kalanBayt = bayt(kalan);
  const parca = Math.floor((hepsiBayt - kalanBayt + 1) / boy) + 1;
  // küçük dosyalar adet sınırına takıldığından parça sayısı yaklaşık: kalanlar da hesaba katılır
  const parcaSayisi = Math.max(parca + Math.ceil((kalanBayt - parcaBayt - 1) / boy), parca, Math.ceil((hepsiBayt - 1) / boy));
  const i = (d.devasaIndirme = { toplam: urller.length, hepsi: hepsi.length, onceden: hepsi.length - kalan.length, oncedenBayt: hepsiBayt - kalanBayt, bitenBayt: 0, biten: 0, hata: 0, yazilamadi: 0, iptaller: new Set(), bitti: false, kendiliginden, parca, parcaSayisi, sonParca: urller.length >= kalan.length });
  try {
    devasaGoster();
  } catch {
    /* ekran değişti */
  }
  // iOS büyük veriyi "kalıcı" isteyince daha zor siler; ekran kararınca indirme durur: açık tutulur (destekleniyorsa;
  // kendiliğinden sürerken ekran açık tutulmaz)
  navigator.storage?.persist?.().catch(() => {});
  let kilit = null;
  try {
    kilit = kendiliginden ? null : await navigator.wakeLock?.request('screen');
  } catch (e) {
    kilit = null;
  }
  let sira = 0;
  const defter = defterOku();
  let yazilmamis = 0;
  // İş 123 (Emre: "yine indirirken çöktü", telefonda 87 GB boş): her görselden önce iz
  // bırakılır: uygulama çökerse bir sonraki açılışta hata günlüğüne kaçıncı görselde kaldığı yazılır.
  // İş 124 (Emre: "tek indirirken daha hızlı çöktü"): görseller artık service worker'dan geçmez (iOS uzun süre durmadan
  // çalışan service worker'ı kapatıyor, uygulama onunla düşüyordu): sayfa kendisi indirir.
  // İş 129: ve IndexedDB'ye yazar (Cache Storage telefonda "TypeError" / "Internal error" veriyordu)
  const isci = async () => {
    while (sira < urller.length && !i.durdur && !i.yerYok) {
      const u = urller[sira++];
      izBirak({ n: i.onceden + i.biten + 1, toplam: i.hepsi, u: u.split('/').pop(), z: new Date().toISOString() });
      // İş 135: yanıt vermeyen istek parçayı bekletmesin (zaman aşımı); "Durdur" sürmekte olan istekleri de keser
      const iptal = new AbortController();
      i.iptaller.add(iptal);
      const sure = setTimeout(() => iptal.abort(), /\/d\//.test(u) ? INDIRME_SURESI_BUYUK : INDIRME_SURESI);
      let kesildi = false;
      try {
        const y = await fetch(u, { mode: 'cors', credentials: 'omit', cache: 'no-store', signal: iptal.signal });
        if (!y.ok || !(y.headers.get('content-type') || '').startsWith('image/')) i.hata++;
        else {
          const blob = await y.blob();
          await kaliciYaz(u, blob).then(
            () => {
              defter.add(defterAdi(u));
              if (++yazilmamis >= 10) (defterYaz(defter), (yazilmamis = 0));
            },
            async (e) => {
              if (e && e.name === 'QuotaExceededError') i.yerYok = true;
              else i.hata++;
              i.yazilamadi++;
              i.sonHata = (e && (e.name && e.name !== 'Error' ? `${e.name}: ${e.message}` : e.message)) || String(e);
              // aynı hata 200 kez yazılmasın: parça başına ilk üçü (ilkinde depo durumu da)
              if (i.yazilamadi <= 3) hataEkle({ m: `Telefona kaydedilemedi: ${i.sonHata}`, k: u.split('/').pop(), y: i.yazilamadi === 1 ? await depoDurumu() : '', a: location.hash });
            },
          );
        }
      } catch (e) {
        if (i.durdur) kesildi = true; // durdurulunca kesilen istek hata da inen de sayılmaz
        else i.hata++;
      } finally {
        clearTimeout(sure);
        i.iptaller.delete(iptal);
      }
      if (kesildi) break;
      i.biten++;
      i.bitenBayt += tahminiBayt(u);
      goster();
    }
  };
  // ekranı güncellemekteki bir hata indirmeyi durdurmasın
  const goster = () => {
    try {
      devasaGoster();
    } catch (e) {
      /* ekran değişti */
    }
  };
  try {
    // İş 125 (Emre: "çok yavaş oldu, daha hızlı yapamaz mıyız"): çökme service worker'dandı (İş 124); sayfa kendisi
    // indirirken üç görsel birden, molasız
    await Promise.all([isci(), isci(), isci()]);
  } finally {
    i.durduruldu = !!i.durdur;
    // parça bitti, sıradaki parçalar var: işaret kalır (sürer). Parçada hiç görsel inemediyse (internet yok, sunucu
    // vermiyor) durur: yoksa uygulama aynı parçayı denemek için durmadan kendini yenilerdi
    i.inemedi = i.biten > 0 && i.biten === i.hata;
    i.parcaBitti = !i.durdur && !i.yerYok && !i.sonParca && !i.inemedi;
    i.bitti = true;
    defterYaz(defter);
    izBirak(null);
    if (!i.parcaBitti) surdurIsareti(false); // hepsi bitti, durduruldu ya da yer kalmadı (uygulama kapanınca işaret kalır)
    kilit?.release?.().catch(() => {});
    goster();
    devasaBilgisi().catch(() => {});
  }
  if (i.parcaBitti && location.hash === '#/ayarlar') {
    i.yenileniyor = true;
    parcaArasi();
  }
}

// İş 124: parça bitince belleği boşaltmak için Ayarlar ekrandaysa uygulama yenilenir (açılınca sıradaki parça kendiliğinden
// başlar); başka sayfadaysa kullanıcıyı bölmemek için sıradaki parça bir dahaki açılışa ya da Ayarlar'a dönüşe kalır
function parcaArasi() {
  if (location.hash === '#/ayarlar' && document.visibilityState === 'visible' && !window.__atlasYenilemeYok) setTimeout(() => location.reload(), 1000);
}

async function devasaSil() {
  if (!confirm('En büyük kopyalar telefondan silinsin mi? Görüntüleyici internet varken yine indirir.')) return;
  await kaliciSil();
  defterSil();
  try {
    localStorage.removeItem(SAYI);
  } catch {
    /* depo kapalı */
  }
  surdurIsareti(false);
  d.devasaIndirme = null;
  const m = document.getElementById('devasa-mesaj');
  const cubuk = document.getElementById('devasa-cubuk');
  if (cubuk) cubuk.hidden = true;
  if (m) {
    m.className = 'mesaj tamam';
    m.textContent = 'Silindi.';
  }
  devasaBilgisi();
}

// Ekranın olay dinleyicileri; app.js özgün sırayla bir kez bağlar
export function olaylariBagla() {
  ekran.addEventListener('click', async (e) => {
    if (e.target.closest('[data-titresim-dene]')) {
      titret('dogru'); // Android; iPhone'da düğmedeki TIK titretir
      return;
    }
    const kb = e.target.closest('[data-kart]');
    if (kb) {
      const a = d.ilerleme.ayarlar;
      a.gunlukKart = Math.min(100, Math.max(5, a.gunlukKart + Number(kb.dataset.kart)));
      ekran.querySelector('[data-test="gunluk-kart"]').textContent = a.gunlukKart;
      kaydet();
      return;
    }
    if (e.target.closest('[data-gunun-degistir]')) {
      // o gün için günün sanatçısı (ilerleme.gununDegisim; js/ekranlar/ortak.js gununId)
      d.ilerleme.gununDegisim = { tarih: bugun(), id: baskaSanatci(gununHavuzu(), gununId(), Math.random) };
      kaydet();
      d.perdeAcildi = false; // ana sayfaya dönünce sahne perdeyle açılır
      ekran.querySelector('[data-gunun-ad]').textContent = gununAdi();
      const m = document.getElementById('gunun-mesaj');
      m.className = 'mesaj tamam';
      m.innerHTML = `Ana sayfada bugün ${kacis(gununAdi())}. <a href="#/">Ana sayfaya git</a>`;
      return;
    }
    if (e.target.closest('[data-gunun-resmi-kopyala]')) {
      const m = document.getElementById('gunun-resmi-mesaj');
      const metin = ekran.querySelector('[data-gunun-resmi-metin]').value;
      navigator.clipboard?.writeText(metin).then(
        () => ((m.className = 'mesaj tamam'), (m.textContent = 'Kopyalandı.')),
        () => ((m.className = 'mesaj'), (m.textContent = 'Kopyalanamadı: metni seçip kopyala.')),
      );
      return;
    }
    if (e.target.closest('[data-gunun-resmi-ac]')) return gununResimleriniAc();
    if (e.target.closest('[data-gunun-resmi-temizle]')) {
      if (!confirm('Bu cihazda seçtiğin günün resimleri silinsin mi? (Claude’a gönderip depoya girenler kalır.)')) return;
      for (const id of Object.keys(cihazdakiGununResimleri())) gununResmiKoy(id, null);
      ekran.querySelector('[data-test="gunun-resimleri"]').outerHTML = gununResmiBolumu();
      return;
    }
    // İş 163: sitedeki data/gorsel_odak_elle.json geçerli olsun diye bu cihazdaki elle odaklar silinir
    if (e.target.closest('[data-elle-odak-temizle]')) {
      if (!confirm('Bu cihazda işaretlediğin elle odaklar silinsin mi? (Claude’a gönderip siteye girenler geçerli kalır.)')) return;
      try {
        localStorage.removeItem(ELLE_ANAHTAR);
      } catch {
        /* depo okunamıyorsa yapılacak bir şey yok */
      }
      ekran.querySelector('[data-test="elle-odak"]').outerHTML = elleOdakBolumu();
      return;
    }
    if (e.target.closest('[data-elle-odak-kopyala]')) {
      const m = document.getElementById('elle-odak-mesaj');
      const metin = ekran.querySelector('[data-elle-odak-metin]').value;
      navigator.clipboard?.writeText(metin).then(
        () => ((m.className = 'mesaj tamam'), (m.textContent = 'Kopyalandı.')),
        () => ((m.className = 'mesaj'), (m.textContent = 'Kopyalanamadı: metni seçip kopyala.')),
      );
      return;
    }
    if (e.target.closest('[data-devasa-indir]')) return devasaIndir();
    if (e.target.closest('[data-devasa-durdur]')) {
      if (d.devasaIndirme) {
        d.devasaIndirme.durdur = true;
        for (const a of d.devasaIndirme.iptaller || []) a.abort();
      }
      return;
    }
    if (e.target.closest('[data-devasa-sil]')) return devasaSil();
    if (e.target.closest('[data-egim-izin]')) {
      const m = document.getElementById('egim-mesaj');
      const tamam = await egimIzni();
      m.className = `mesaj ${tamam ? 'tamam' : 'hata'}`;
      m.textContent = tamam ? 'İzin verildi: Tuval’de telefonu çevir.' : 'Hareket izni verilmedi. Uygulamayı kapatıp açınca yeniden sorulur.';
      egimIzinDugmesi();
      return;
    }
    if (e.target.closest('[data-bildirim-kopyala]')) {
      const metin = bildirimMetni(d.ilerleme);
      const ta = document.getElementById('bildirim-cikti');
      const m = document.getElementById('bildirim-mesaj');
      ta.hidden = false;
      ta.value = metin;
      try {
        await navigator.clipboard.writeText(metin);
        m.className = 'mesaj tamam';
        m.textContent = 'Bildirim listesi panoya kopyalandı.';
      } catch (err) {
        ta.focus();
        ta.select();
        m.className = 'mesaj';
        m.textContent = 'Panoya otomatik kopyalanamadı; metni seçip kopyala.';
      }
      return;
    }
    if (e.target.closest('[data-bildirim-temizle]')) {
      if (!confirm('Bildirim listesi silinsin mi? (Bildirilen görseller pekiştirmeden çıkmış olarak kalır.)')) return;
      d.ilerleme.bildirimler = [];
      kaydet();
      ayarlarSayfasi();
      return;
    }
    if (e.target.closest('[data-hata-kopyala]')) {
      const metin = gunlukMetni(hatalariOku());
      const ta = document.getElementById('hata-cikti');
      const m = document.getElementById('hata-mesaj');
      ta.hidden = false;
      ta.value = metin;
      try {
        await navigator.clipboard.writeText(metin);
        m.className = 'mesaj tamam';
        m.textContent = 'Hata günlüğü panoya kopyalandı.';
      } catch (err) {
        ta.focus();
        ta.select();
        m.className = 'mesaj';
        m.textContent = 'Panoya otomatik kopyalanamadı; metni seçip kopyala.';
      }
      return;
    }
    if (e.target.closest('[data-hata-temizle]')) {
      hatalariTemizle();
      ayarlarSayfasi();
      return;
    }
    if (e.target.closest('[data-surum-denetle]')) return surumDenetle();
    if (e.target.closest('[data-yedekle]')) {
      yedekTarihiYaz();
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
        kayitKilidiniAc(); // açılışta ilerleme okunamadıysa da yedek kaydedilir (bilerek yüklendi)
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

  ekran.addEventListener('change', async (e) => {
    if (e.target.matches('[data-ayar-rozet]')) {
      const m = document.getElementById('rozet-mesaj');
      if (e.target.checked && !(await rozetIzni())) {
        e.target.checked = false;
        m.className = 'mesaj hata';
        m.textContent = 'Bildirim izni verilmedi; rozet açılamadı. iOS Ayarlar’dan Atlas için bildirimlere izin verebilirsin.';
        return;
      }
      d.ilerleme.ayarlar.rozet = e.target.checked;
      kaydet();
      if (e.target.checked) await rozetiGuncelle();
      else await rozetYaz(0);
      m.className = 'mesaj tamam';
      m.textContent = e.target.checked ? 'Rozet açıldı.' : 'Rozet kapatıldı.';
      return;
    }
    if (e.target.matches('[data-ayar-titresim]')) {
      // anahtarın değişme olayında titretilmez: iPhone'da gizli anahtara tıklamak bu anahtarı geri çeviriyordu
      // (Emre: "titreşim tuşuna bastığımda açılmıyor"); denemek için yanındaki düğme
      d.ilerleme.ayarlar.titresim = e.target.checked;
      kaydet();
      return;
    }
    if (e.target.matches('[data-ayar-egim]')) {
      const m = document.getElementById('egim-mesaj');
      if (e.target.checked && !(await egimIzni())) {
        e.target.checked = false;
        m.className = 'mesaj hata';
        m.textContent = 'Hareket izni verilmedi. Uygulamayı kapatıp açınca yeniden sorulur.';
        return;
      }
      d.ilerleme.ayarlar.egim = e.target.checked;
      kaydet();
      m.className = 'mesaj tamam';
      m.textContent = e.target.checked ? 'Açıldı: Tuval’de telefonu çevir.' : 'Kapatıldı.';
      egimIzinDugmesi();
      return;
    }
    if (e.target.matches('[data-ayar-gelistirici]')) {
      const m = document.getElementById('gelistirici-mesaj');
      if (e.target.checked) {
        const konular = [...new Set([...d.konular.map((k) => k.no), ...d.sanatcilar.map((s) => s.konu)])].filter(Number.isInteger);
        d.ilerleme = gelistiriciAc(d.ilerleme, konular, bolumler().map((b) => b.id), d.yarim);
        m.textContent = 'Açıldı: her şey açık. Kapatınca ilerlemen geri gelir.';
      } else {
        const { ilerleme, yarim } = gelistiriciKapat(d.ilerleme);
        d.ilerleme = ilerleme;
        if (kayitGecerliMi(yarim)) {
          d.yarim = yarim;
          idbKoy('oturum', 'yarim', yarim);
        } else yarimSil();
        m.textContent = 'Kapatıldı: ilerlemen açmadan önceki haline döndü.';
      }
      d.oturum = null;
      kaydet();
      temaUygula();
      m.className = 'mesaj tamam';
      return;
    }
    if (e.target.matches('[data-ayar-tanisma]')) {
      d.ilerleme.ayarlar.tanisma = e.target.checked;
      kaydet();
      return;
    }
    if ((e.target.name === 'hareket' && HAREKETLER.includes(e.target.value)) || (e.target.name === 'yazi' && YAZILAR.includes(e.target.value))) {
      d.ilerleme.ayarlar[e.target.name] = e.target.value;
      kaydet();
      temaUygula();
    }
    if (e.target.name === 'tema' && TEMALAR.includes(e.target.value)) {
      d.ilerleme.ayarlar.tema = e.target.value;
      kaydet();
      temaUygula();
    }
  });
}

// İş 150: geliştirici modunda görüntüleyicide işaretlenen odaklar; kopyalanıp Claude'a gönderilir, depoya
// data/gorsel_odak_elle.json olarak girer (bütün cihazlarda geçerli olur)
function elleOdakBolumu() {
  const l = cihazdakiElleOdaklar();
  const n = Object.keys(l).length;
  if (!n && !d.ilerleme.gelistirici) return '';
  return `<div class="ayar" data-test="elle-odak"><b>Elle odaklar</b>
    <p>${n ? `Bu cihazda ${n} tablonun odağı elle işaretlendi.` : 'Henüz yok.'} Günün resimlerinde (ya da geliştirici modunda) bir eseri büyütüp “Odağı işaretle”ye dokun, sonra tablonun önemli noktasına. Kırpılan görseller (Galeri, Atölye, Tuval, Konular) o noktanın çevresinden kırpılır. Kalıcı olması için listeyi kopyalayıp Claude’a gönder; sitede kalıcı olunca bu cihazdakileri silebilirsin (sitedekiler geçerli kalır).</p>
    ${n ? `<textarea readonly aria-label="Elle odaklar" data-elle-odak-metin>${kacis(JSON.stringify({ surum: 1, odak: l }))}</textarea>
    <div class="iki-dugme"><button class="dugme ince" type="button" data-elle-odak-kopyala>Kopyala</button><button class="dugme ince" type="button" data-elle-odak-temizle data-test="elle-odak-temizle">Bu cihazdakileri sil</button></div>` : ''}
    <p class="mesaj" id="elle-odak-mesaj" aria-live="polite"></p></div>`;
}

// İş 157: görüntüleyicideki "Günün resmi" ile bu cihazda seçilenler; kopyalanıp Claude'a gönderilir, depoya
// data/gunun_resimleri.json olarak girer (bütün cihazlarda geçerli olur)
function gununResmiBolumu() {
  const l = cihazdakiGununResimleri();
  const idler = Object.keys(l);
  const ad = (id) => {
    const s = d.harita.get(id);
    return s ? bilinenAd(s.ad, d.kisaAdlar[id]) : id;
  };
  // İş 159: "Sırayla ortala": seçilen bütün günün resimleri (depodaki ve bu cihazdaki) görüntüleyicide dönem sırasıyla
  return `<div class="ayar" data-test="gunun-resimleri"><b>Günün resimleri</b>
    <p>Bir eseri büyütüp “Günün resmi”ne dokununca o sanatçı Tuval’e bu tabloyla gelir. “Sırayla ortala” seçtiğin bütün günün resimlerini sırayla açar: “Odağı işaretle”ye dokun, sonra ekranın ortasına gelecek noktaya; çerçeve Tuval’de görünen alanı gösterir. Kaydırarak sonrakine geç.</p>
    <button class="dugme" type="button" data-gunun-resmi-ac data-test="gunun-resmi-ac">Sırayla ortala</button>
    ${idler.length ? `<p>Bu cihazda ${idler.length} sanatçının günün resmini seçtin${idler.length <= 12 ? `: ${idler.map((id) => kacis(ad(id))).join(', ')}` : ''}. Bütün cihazlarda kalıcı olması için listeyi kopyalayıp Claude’a gönder.</p>
    <textarea readonly aria-label="Günün resimleri" data-gunun-resmi-metin>${kacis(JSON.stringify({ surum: 1, secim: l }))}</textarea>
    <div class="iki-dugme"><button class="dugme ince" type="button" data-gunun-resmi-kopyala>Kopyala</button><button class="dugme ince" type="button" data-gunun-resmi-temizle>Bu cihazdakileri sil</button></div>` : ''}
    <p class="mesaj" id="gunun-resmi-mesaj" aria-live="polite"></p></div>`;
}

async function gununResimleriniAc() {
  const m = document.getElementById('gunun-resmi-mesaj');
  m.className = 'mesaj';
  m.textContent = 'Hazırlanıyor…';
  await gununResimleriYukle();
  const sec = tumGununResimleri();
  const sanatcilar = d.sanatcilar.filter((s) => sec[s.id]);
  const listeler = await Promise.all(sanatcilar.map((s) => sanatciEserleri(s).catch(() => [])));
  const eserler = listeler.map(seciliGununResmi).filter(Boolean);
  if (!eserler.length) {
    m.textContent = 'Henüz günün resmi seçmedin.';
    return;
  }
  m.textContent = '';
  const adi = new Map(sanatcilar.map((s) => [s.id, bilinenAd(s.ad, d.kisaAdlar[s.id])]));
  goruntuleyiciAc({ eserler, kotuler: kotuler(), ortalama: true, notu: (e) => `${adi.get(e.sid) || ''} · günün resmi ${eserler.indexOf(e) + 1} / ${eserler.length}` });
}

// İş 166: sitedeki sürümle karşılaştırır; yeniyse kurar ve sayfayı yeniler
async function surumDenetle() {
  const m = document.getElementById('surum-mesaj');
  m.className = 'mesaj';
  m.textContent = 'Bakılıyor…';
  let site;
  try {
    site = await sitedekiSurum();
  } catch {
    m.textContent = 'Siteye ulaşılamadı; internet bağlantını denetle.';
    return;
  }
  if (!site || site === SURUM) {
    m.className = 'mesaj tamam';
    m.textContent = `Güncel: ${SURUM}.`;
    return;
  }
  m.textContent = `Sitede ${site} var, indiriliyor…`;
  const sonuc = await guncellemeyiDene().catch((e) => {
    hataEkle({ m: `Güncelleme denetimi: ${(e && e.message) || e}`, k: `${SURUM} → ${site}` });
    return 'kurulamadi';
  });
  if (sonuc === 'kuruldu') {
    m.className = 'mesaj tamam';
    m.textContent = `${site} kuruldu, uygulama yenileniyor…`;
    setTimeout(() => location.reload(), 800);
    return;
  }
  if (sonuc === 'bulunamadi') hataEkle({ m: 'Sitede yeni sürüm var ama tarayıcı bulamadı', k: `${SURUM} → ${site}` });
  m.textContent = 'Yeni sürüm kurulamadı. Ayarlar → Hata günlüğü → Kopyala ile Claude’a gönder.';
}

function gununAdi() {
  const s = d.harita.get(gununId());
  return s ? bilinenAd(s.ad, d.kisaAdlar[s.id]) : '—';
}

