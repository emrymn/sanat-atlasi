// Sanat Atlası — uygulamanın girişi: veriyi yükler, ekranların dinleyicilerini bağlar, yönlendirmeyi başlatır.
// Ekranlar js/ekranlar/ altında (bkz. KARARLAR.md "İş 16").
import { akimOrtaYillari } from './celdirici.js';
import { eserTurleriniAyarla, hazirOnbellek, eserAdlariniAyarla, adlariAl, kolaylikAl } from './eserler.js';
import { yerelGorselleriAyarla, oranlariAyarla } from './gorsel.js';
import { gorunurSanatcilar, gorunurAkimlar } from './resim.js';
import { ilerlemeYukle, gunlukGuncelle } from './depo.js';
import { notlariAl } from './karsilastir.js';
import { bildir, jsonGetir, d, bugun, kaydet, temaUygula, hataGoster, olaylariBagla as ortakOlaylari } from './ekranlar/ortak.js';
import { ikonografiVeri } from './ekranlar/gozat.js';
import { yarimYukle, olaylariBagla as pekistirOlaylari } from './ekranlar/pekistir.js';
import { yonlendir } from './ekranlar/yonlendirme.js';
import { olaylariBagla as bugunOlaylari } from './ekranlar/bugun.js';
import { olaylariBagla as ilerlemeOlaylari } from './ekranlar/ilerleme.js';
import { olaylariBagla as ayarlarOlaylari, rozetiGuncelle } from './ekranlar/ayarlar.js';
import { olaylariBagla as aramaOlaylari } from './ekranlar/arama.js';
import { olaylariBagla as zamanOlaylari } from './ekranlar/zaman.js';
import { olaylariBagla as akimOlaylari } from './ekranlar/akim.js';
import { olaylariBagla as haritaOlaylari } from './ekranlar/harita.js';

// Gömülü önizleme ortamları (ör. v0) her hash değişiminde document.querySelector(location.hash)
// çağırıp çapaya kaydırmaya çalışıyor; '#/gozat' gibi rota hash'leri geçerli seçici olmadığı için
// SyntaxError fırlıyor. Rota hash'lerini "eşleşen öğe yok" olarak yanıtla.
{
  const asil = Document.prototype.querySelector;
  Document.prototype.querySelector = function (secici) {
    if (typeof secici === 'string' && secici.startsWith('#/')) return null;
    return asil.call(this, secici);
  };
}

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

// T2: eser notları (~100 KB) yalnızca görüntüleyicide gerekir; ilk ekran çizildikten sonra yüklenir.
// Görüntüleyici notlardan önce açıldıysa 'atlas-notlar' olayıyla yazısını yeniler.
async function notlariYukle() {
  d.eserNotlari = notlariAl(await jsonGetir('data/eser_notlari.json').catch(() => null));
  d.eserNotlariHazir = true;
  window.dispatchEvent(new Event('atlas-notlar'));
}

// İ2: uygulama açılınca bugünün, gizlenirken (kapanırken) yarının vadeli sayısı rozete yazılır
function rozetiBagla() {
  rozetiGuncelle(false);
  document.addEventListener('visibilitychange', () => rozetiGuncelle(document.visibilityState === 'hidden'));
  window.addEventListener('pagehide', () => rozetiGuncelle(true));
}

// ---------- başlangıç ----------
async function basla() {
  // İsteğe bağlı notlar (data/tanima_notlari.json, …) aynı anda istenir; yoksa ya da bozuksa boş kalır.
  // Eser notları (T2) ilk ekran çizildikten sonra yüklenir (aşağıda notlariYukle)
  // T2: eser önbelleği (2 MB), kısa adlar, Türkçe konu adları, ilerleme ve yarım oturum da aynı anda istenir
  // (önceden ilk dokuz dosyanın bitmesini sırayla bekliyorlardı). Türkçe eser adları ertelenmedi: ayrıştırması
  // Chromium'da ~2 ms; ilk ekranda göründükleri için ertelemek özgün addan Türkçeye sıçrama yaratırdı (KARARLAR İş 22).
  const hazirSozu = hazirOnbellek();
  const kisaSozu = jsonGetir('data/kisa_adlar.json').catch(() => ({ adlar: {} }));
  const konularTrSozu = jsonGetir('data/konular_tr.json').catch(() => null);
  const ilerlemeSozu = ilerlemeYukle(() => jsonGetir('data/baslangic_ilerleme.json'));
  const yarimSozu = yarimYukle();
  const [tumSanatcilar, akimlar, konular, turler, tanima, eserAd, zorluk, yerelG, oranG] = await Promise.all([
    jsonGetir('data/sanatcilar.json'),
    jsonGetir('data/akimlar.json'),
    jsonGetir('data/konular.json'),
    jsonGetir('data/eser_turleri.json').catch(() => null),
    jsonGetir('data/tanima_notlari.json').catch(() => null),
    jsonGetir('data/eser_adlari_tr.json').catch(() => null),
    jsonGetir('data/eser_zorluk.json').catch(() => null),
    jsonGetir('data/yerel_gorseller.json').catch(() => null),
    jsonGetir('data/gorsel_oranlari.json').catch(() => null),
  ]);
  d.kisaAdlar = (await kisaSozu).adlar || {};
  d.konularTr = await konularTrSozu;
  d.tanimaNotlari = notlariAl(tanima);
  eserAdlariniAyarla(adlariAl(eserAd));
  d.kolaylik = kolaylikAl(zorluk);
  yerelGorselleriAyarla(yerelG && yerelG.gorseller, yerelG && yerelG.buyuk);
  oranlariAyarla(oranG && oranG.oranlar);
  d.dikeyler = oranG && Array.isArray(oranG.dikeyler) ? new Set(oranG.dikeyler) : null;
  eserTurleriniAyarla(turler);
  // Yalnızca resmi olan sanatçılar ve onların akımları (veri silinmez, uygulamada süzülür)
  const hazir = await hazirSozu;
  d.onbellekIdleri = hazir && hazir.sanatcilar ? new Set(Object.keys(hazir.sanatcilar)) : null;
  const sanatcilar = gorunurSanatcilar(tumSanatcilar, turler, hazir);
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
  d.ilerleme = await ilerlemeSozu;
  d.yarim = await yarimSozu;
  // Yarım oturum varken uygulama bir oturum adresinde açıldıysa (yenileme, yeni sürüm) Bugün'deki devam kartına dön
  if (d.yarim && /^#\/pekistir\/(karisik|hatalar|donem\/.+|konu\/.+)$/.test(location.hash)) history.replaceState(null, '', '#/');
  gunlukGuncelle(d.ilerleme, bugun());
  kaydet();
  temaUygula();
  window.addEventListener('hashchange', yonlendir);
  yonlendir();
  swKaydet();
  // Konular (görüntüleyicideki "Konu:" bağlantısı için) ilk ekrandan sonra arka planda
  setTimeout(ikonografiVeri, 1500);
  setTimeout(notlariYukle, 0);
  rozetiBagla();
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  // test ve hata ayıklama için
  window.__atlas = d;
}

// dinleyiciler eski tek dosyadaki sırayla bağlanır
ortakOlaylari();
bugunOlaylari();
pekistirOlaylari();
ilerlemeOlaylari();
ayarlarOlaylari();
aramaOlaylari();
zamanOlaylari();
akimOlaylari();
haritaOlaylari();

basla().catch(hataGoster);
