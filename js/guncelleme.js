// İş 166: service worker kaydı ve güncelleme (önce js/app.js'deydi). Cloudflare Pages'e geçince iPhone ana ekran
// uygulaması yeni sürümü iki kez kendiliğinden almadı; Ayarlar'da "Yeni sürüm var mı?" sürümü elle denetler ve kurar,
// kurulum başarısız olursa nedeni hata günlüğüne yazılır (service worker kurulumda hata verirse sayfaya bildirir).
import { hataEkle } from './hataGunlugu.js';

let kayitSozu = null;

function kurulumuIzle(w) {
  if (!w) return;
  w.addEventListener('statechange', () => {
    if (w.state === 'redundant') hataEkle({ m: 'Yeni sürüm kurulamadı (service worker redundant)', a: location.hash });
  });
}

export function swKur(bildir) {
  if (!('serviceWorker' in navigator)) return;
  const ilkKontrol = !!navigator.serviceWorker.controller;
  kayitSozu = navigator.serviceWorker.register('sw.js').catch((e) => {
    hataEkle({ m: `Service worker kaydedilemedi: ${(e && e.message) || e}` });
    return null;
  });
  kayitSozu.then((r) => r && r.addEventListener('updatefound', () => kurulumuIzle(r.installing)));
  // sw.js kurulumda hata verirse (ör. bir kabuk dosyası inmedi) nedenini gönderir
  navigator.serviceWorker.addEventListener('message', (e) => {
    if (e.data && e.data.tip === 'sw-hata') hataEkle({ m: `Yeni sürüm kurulamadı: ${e.data.m}`, k: e.data.surum || '' });
  });
  let yenilendi = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!ilkKontrol || yenilendi) return;
    yenilendi = true;
    bildir('Uygulamanın yeni sürümü hazır.', { eylem: { ad: 'Yenile', fn: () => location.reload() }, sure: 0 });
  });
  // İş 63: arka plandan dönüşte yeni sürüm indiyse yenilenir (yarım oturum kayıtlı). İş 164: iOS güncellemeyi günlerce
  // denetlemeyebiliyor; öne gelişte sorulur.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    if (yenilendi) location.reload();
    else kayitSozu.then((r) => r && r.update()).catch(() => {});
  });
}

// Sitedeki sürüm: sw.js ağdan (önbelleğe bakmadan) okunur
export async function sitedekiSurum() {
  const y = await fetch(`sw.js?denetim=${Date.now()}`, { cache: 'no-store' });
  if (!y.ok) throw new Error(`sw.js ${y.status}`);
  const m = (await y.text()).match(/const SURUM = '([^']+)'/);
  return m ? m[1] : null;
}

// Yeni sürümü indirip kurar. Sonuç: 'kuruldu' | 'bulunamadi' | 'kurulamadi' | 'desteklenmiyor'
// surum: sitedeki sürüm. İş 168: öne gelişteki otomatik denetim yeni sürümü düğmeden önce kurmuş olabilir; o sürümün
// önbelleği varsa kurulmuş sayılır (önce "tarayıcı bulamadı" diye yanlış hata yazılıyordu).
const kurulmusMu = async (surum) => !!surum && (await caches.keys()).includes(`atlas-kabuk-${surum}`);
export async function guncellemeyiDene(surum = null, bekleme = 60000) {
  if (!('serviceWorker' in navigator)) return 'desteklenmiyor';
  const r = (await kayitSozu) || (await navigator.serviceWorker.getRegistration());
  if (!r) return 'desteklenmiyor';
  if (await kurulmusMu(surum)) return 'kuruldu';
  await r.update();
  const w = r.installing || r.waiting;
  if (!w) return (await kurulmusMu(surum)) ? 'kuruldu' : 'bulunamadi';
  return new Promise((coz) => {
    const bak = () => {
      if (w.state === 'activated' || w.state === 'installed') coz('kuruldu');
      else if (w.state === 'redundant') coz('kurulamadi');
    };
    w.addEventListener('statechange', bak);
    bak();
    setTimeout(() => coz('kurulamadi'), bekleme);
  });
}
