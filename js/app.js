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
import { olaylariBagla as ayarlarOlaylari } from './ekranlar/ayarlar.js';
import { olaylariBagla as aramaOlaylari } from './ekranlar/arama.js';
import { olaylariBagla as zamanOlaylari } from './ekranlar/zaman.js';
import { olaylariBagla as akimOlaylari } from './ekranlar/akim.js';

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
  // İsteğe bağlı notlar (data/tanima_notlari.json, data/eser_notlari.json) aynı anda istenir; yoksa ya da bozuksa boş kalır
  const [tumSanatcilar, akimlar, konular, turler, tanima, eserNot, eserAd, zorluk, yerelG, oranG] = await Promise.all([
    jsonGetir('data/sanatcilar.json'),
    jsonGetir('data/akimlar.json'),
    jsonGetir('data/konular.json'),
    jsonGetir('data/eser_turleri.json').catch(() => null),
    jsonGetir('data/tanima_notlari.json').catch(() => null),
    jsonGetir('data/eser_notlari.json').catch(() => null),
    jsonGetir('data/eser_adlari_tr.json').catch(() => null),
    jsonGetir('data/eser_zorluk.json').catch(() => null),
    jsonGetir('data/yerel_gorseller.json').catch(() => null),
    jsonGetir('data/gorsel_oranlari.json').catch(() => null),
  ]);
  d.kisaAdlar = (await jsonGetir('data/kisa_adlar.json').catch(() => ({ adlar: {} }))).adlar || {};
  d.konularTr = await jsonGetir('data/konular_tr.json').catch(() => null);
  d.tanimaNotlari = notlariAl(tanima);
  d.eserNotlari = notlariAl(eserNot);
  eserAdlariniAyarla(adlariAl(eserAd));
  d.kolaylik = kolaylikAl(zorluk);
  yerelGorselleriAyarla(yerelG && yerelG.gorseller, yerelG && yerelG.buyuk);
  oranlariAyarla(oranG && oranG.oranlar);
  d.dikeyler = oranG && Array.isArray(oranG.dikeyler) ? new Set(oranG.dikeyler) : null;
  eserTurleriniAyarla(turler);
  // Yalnızca resmi olan sanatçılar ve onların akımları (veri silinmez, uygulamada süzülür)
  const hazir = await hazirOnbellek();
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
  d.ilerleme = await ilerlemeYukle(() => jsonGetir('data/baslangic_ilerleme.json'));
  d.yarim = await yarimYukle();
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

basla().catch(hataGoster);
