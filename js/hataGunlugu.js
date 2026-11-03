// İş 115 · Yerel hata günlüğü (Mistral'in önerisi, Emre: "mantıklı olan varsa uygulayalım"). Sunucu yok: yakalanmayan
// hatalar ve reddedilen sözler telefonda localStorage'a yazılır (son 30), Ayarlar'da "Hata günlüğü"nden kopyalanıp
// Claude'a gönderilir. iPhone'a özgü hatalar (titreşim, dokunuş, pencere) tarayıcı konsolu olmadan görülebilsin diye.
// app.js'in ilk içe aktarımı: öteki modüller yüklenirken çıkan hatalar da yakalanır.
import { SURUM } from './surum.js';

export const ANAHTAR = 'sanat-atlasi:hatalar';
export const EN_COK = 30;

export function hatalariOku(depo = globalThis.localStorage) {
  try {
    const l = JSON.parse(depo.getItem(ANAHTAR) || '[]');
    return Array.isArray(l) ? l : [];
  } catch {
    return [];
  }
}

// Aynı hata art arda gelirse yeni satır açılmaz, sayısı artar
export function hataEkle(kayit, depo = globalThis.localStorage, simdi = new Date()) {
  try {
    const l = hatalariOku(depo);
    const son = l[l.length - 1];
    if (son && son.m === kayit.m && son.k === kayit.k) {
      son.n = (son.n || 1) + 1;
      son.z = simdi.toISOString();
    } else l.push({ z: simdi.toISOString(), s: SURUM, ...kayit });
    depo.setItem(ANAHTAR, JSON.stringify(l.slice(-EN_COK)));
  } catch {
    /* depo dolu ya da kapalı: günlük tutulmaz */
  }
}

export function hatalariTemizle(depo = globalThis.localStorage) {
  try {
    depo.removeItem(ANAHTAR);
  } catch {
    /* yok say */
  }
}

export function gunlukMetni(l, ortam = globalThis.navigator) {
  const bas = `Sanat Atlası ${SURUM} · ${(ortam && ortam.userAgent) || ''}`;
  return [bas, ...l.map((h) => `${h.z} · ${h.s}${h.n > 1 ? ` · ${h.n} kez` : ''} · ${h.a || ''}\n  ${h.m}${h.k ? `\n  ${h.k}` : ''}${h.y ? `\n  ${h.y}` : ''}`)].join('\n');
}

const kisa = (s, n) => String(s || '').slice(0, n);
const yigin = (e) => kisa(e && e.stack ? String(e.stack).split('\n').slice(0, 4).join(' | ') : '', 600);

if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    if (e.target && e.target !== window) return; // kaynak (resim) yüklenemedi: hata değil, uygulama kendisi yedeğe geçer
    hataEkle({ m: kisa(e.message, 300), k: e.filename ? `${e.filename.split('/').pop()}:${e.lineno}:${e.colno}` : '', y: yigin(e.error), a: location.hash });
  }, true);
  window.addEventListener('unhandledrejection', (e) => {
    const r = e.reason;
    hataEkle({ m: kisa(`Söz reddedildi: ${(r && r.message) || r}`, 300), k: '', y: yigin(r), a: location.hash });
  });
}
