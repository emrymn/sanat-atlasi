// Yarım kalan pekiştirme oturumu: her cevaptan sonra IndexedDB'ye yazılır, açılışta kaldığı yerden sürer.
// Kayıt: kip, akım, kart sırası (kuyruk), konum, şu anki kart (eser, seçenekler, adım, verilen cevaplar),
// yanlışların tekrar sayacı, doğru/yanlış sayıları ve gösterilen eserler. Saf fonksiyonlar (birim testli).
import { Oturum } from './oturum.js';
import { SEVIYELER } from './seviye.js';

const SEVIYE_AD = Object.fromEntries(SEVIYELER.map((x) => [x.anahtar, x.ad]));

export const KAYIT_SURUMU = 1;
export const EN_UZUN_GUN = 7;
const GUN_MS = 24 * 60 * 60 * 1000;

// Bellekteki oturumdan (app.js'deki d.oturum) saklanabilir kayıt
export function kayitYap(o, simdi = Date.now()) {
  const ot = o.oturum;
  const k = o.kart;
  return {
    surum: KAYIT_SURUMU,
    kimlik: o.kimlik,
    zaman: simdi,
    kip: o.kip,
    akim: o.akim,
    kuyruk: ot.kuyruk.map((x) => ({ id: x.id, tekrar: !!x.tekrar })),
    konum: ot.konum,
    tekrarSayisi: { ...ot.tekrarSayisi },
    dogru: ot.dogru,
    yanlis: ot.yanlis,
    gosterilen: (o.gosterilen || []).slice(-200),
    gecenler: (o.gecenler || []).slice(),
    kart:
      k && k.eser
        ? {
            konum: k.konum,
            id: k.id,
            eser: k.eser.anahtar,
            secenekler: k.secenekler.slice(),
            akimSecenekleri: k.akimSecenekleri ? k.akimSecenekleri.slice() : null,
            adim: k.adim,
            cevapSanatci: k.cevapSanatci,
            cevapAkim: k.cevapAkim,
            bitti: !!k.bitti,
            // kartın sorulduğu seviye ve (cevaplandıysa) seviye sonucu (js/seviye.js)
            seviye: k.seviye ?? 0,
            seviyeSonuc: k.seviyeSonuc || null,
          }
        : null,
  };
}

const metinMi = (x) => typeof x === 'string';

// Biçimi doğru ve 7 günden yeni mi? (yedekten gelen kayıtlar da buradan geçer)
export function kayitGecerliMi(k, simdi = Date.now()) {
  if (!k || typeof k !== 'object' || k.surum !== KAYIT_SURUMU) return false;
  if (!Number.isFinite(k.zaman) || simdi - k.zaman > EN_UZUN_GUN * GUN_MS) return false;
  if (!['donem', 'karisik', 'seviye'].includes(k.kip) || (k.kip !== 'karisik' && !metinMi(k.akim))) return false;
  if (!Array.isArray(k.kuyruk) || !k.kuyruk.every((x) => x && metinMi(x.id))) return false;
  if (!Number.isInteger(k.konum) || k.konum < 0 || k.konum > k.kuyruk.length) return false;
  if (k.kart !== null && k.kart !== undefined) {
    const c = k.kart;
    if (!Number.isInteger(c.konum) || !metinMi(c.id) || !metinMi(c.eser) || !Array.isArray(c.secenekler)) return false;
  }
  return true;
}

/**
 * Kayıttan oturum kurar. Veride artık olmayan sanatçıların kartları atlanır.
 * Şu anki kart tamamlanmışsa (iki soru da cevaplı) bir sonraki karttan başlanır.
 * varMi(id): sanatçı veride ve pekiştirmede mi?
 * Dönen: { oturum: Oturum, kart: {…} | null (eser sonra bulunur), konumKaydi } ya da null (hiç kart kalmadıysa)
 */
export function kayittanKur(k, { varMi, rng = Math.random } = {}) {
  const kuyruk = [];
  let konum = 0;
  let kartKonumu = -1;
  k.kuyruk.forEach((x, i) => {
    if (!varMi(x.id)) return;
    if (i < k.konum) konum++;
    if (k.kart && i === k.kart.konum && x.id === k.kart.id) kartKonumu = kuyruk.length;
    kuyruk.push({ id: x.id, tekrar: !!x.tekrar });
  });
  const ot = new Oturum([], { rng });
  ot.kuyruk = kuyruk;
  ot.konum = konum;
  ot.tekrarSayisi = { ...(k.tekrarSayisi || {}) };
  ot.dogru = k.dogru || 0;
  ot.yanlis = k.yanlis || 0;
  let kart = null;
  if (k.kart && kartKonumu === konum) {
    if (k.kart.bitti) ot.ilerle();
    else kart = { ...k.kart, konum, secenekler: k.kart.secenekler.slice(), akimSecenekleri: k.kart.akimSecenekleri ? k.kart.akimSecenekleri.slice() : null };
  }
  if (ot.bitti) return null;
  return { oturum: ot, kart };
}

// Gösterilecek sıra: tamamlanmış kart sayılmaz (5 kart cevaplandıysa "6 / 20")
export function devamKonumu(k) {
  const tamam = k.kart && k.kart.konum === k.konum && k.kart.bitti;
  return Math.min(k.kuyruk.length, k.konum + (tamam ? 2 : 1));
}

// "Döneme göre · Gotik · 7 / 20", "Karışık · 3 / 20"
export function devamOzeti(k) {
  const ad =
    k.kip === 'karisik'
      ? 'Karışık'
      : k.kip === 'seviye'
        ? `Seviye · ${SEVIYE_AD[k.akim] || k.akim}`
        : `Döneme göre · ${k.akim === 'hepsi' ? 'Hepsi' : k.akim}`;
  return `${ad} · ${devamKonumu(k)} / ${k.kuyruk.length}`;
}
