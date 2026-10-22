// Çalışma geçmişi (İ1, İ4): günlük kart kaydı, takvim, seri, haftalık doğru oranı ve gelecek yük.
// Kayıt: ilerleme.gecmis["2026-10-22"] = { kart, dogru, akimlar: { Barok: 3 } }
// (ilerleme.gunluk zaten bugünün sayaçlarını tuttuğu için geçmiş ayrı bir alanda: gecmis)
import { gunEkle, vadesiGeldiMi } from './leitner.js';

const TARIH = /^\d{4}-\d{2}-\d{2}$/;
const SAYI = (x) => Number.isInteger(x) && x >= 0;

// Yedekten gelen kaydı doğrular; geçersiz günler atılır
export function gecmisDogrula(g) {
  if (!g || typeof g !== 'object' || Array.isArray(g)) return {};
  const sonuc = {};
  for (const [tarih, k] of Object.entries(g)) {
    if (!TARIH.test(tarih) || !k || typeof k !== 'object' || !SAYI(k.kart) || !SAYI(k.dogru)) continue;
    const akimlar = {};
    for (const [ad, n] of Object.entries(k.akimlar && typeof k.akimlar === 'object' ? k.akimlar : {})) if (SAYI(n) && n > 0) akimlar[ad] = n;
    sonuc[tarih] = { kart: k.kart, dogru: Math.min(k.dogru, k.kart), akimlar };
  }
  return sonuc;
}

// Biten bir kartı o günün kaydına yazar
export function gecmisEkle(ilerleme, tarih, { dogru, akim }) {
  const g = (ilerleme.gecmis ||= {});
  const k = (g[tarih] ||= { kart: 0, dogru: 0, akimlar: {} });
  k.kart++;
  if (dogru) k.dogru++;
  if (akim) k.akimlar[akim] = (k.akimlar[akim] || 0) + 1;
  return k;
}

// Günün en çok çalışılan akımı (eşitlikte ada göre); kayıt ya da akım yoksa null
export function baskinAkim(kayit) {
  const l = Object.entries((kayit && kayit.akimlar) || {}).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'tr'));
  return l.length ? l[0][0] : null;
}

function haftaGunu(tarih) {
  const [y, m, g] = tarih.split('-').map(Number);
  return (new Date(y, m - 1, g, 12).getDay() + 6) % 7; // pazartesi = 0
}

// Son `hafta` haftanın takvimi, gün gün (pazartesi başlar; ilk 7 gün ilk sütun). Bugünden sonraki günler gelecek: true
export function takvim(gecmis, bugun, hafta = 12) {
  const bas = gunEkle(bugun, -(hafta - 1) * 7 - haftaGunu(bugun));
  const gunler = [];
  for (let i = 0; i < hafta * 7; i++) {
    const tarih = gunEkle(bas, i);
    const k = (gecmis || {})[tarih];
    gunler.push({ tarih, kart: k ? k.kart : 0, dogru: k ? k.dogru : 0, akim: baskinAkim(k), gelecek: tarih > bugun });
  }
  return gunler;
}

// Art arda çalışılan gün sayısı. Bugün henüz çalışılmadıysa seri dünden sayılır (gün bitmeden sıfırlanmaz)
export function seri(gecmis, bugun) {
  const var_ = (t) => ((gecmis || {})[t] || {}).kart > 0;
  let t = var_(bugun) ? bugun : gunEkle(bugun, -1);
  let n = 0;
  while (var_(t)) {
    n++;
    t = gunEkle(t, -1);
  }
  return n;
}

// Son `hafta` haftanın doğru oranı (pazartesi başlar): [{ bas, kart, dogru, oran }]; kartı olmayan haftada oran null
export function haftalikOran(gecmis, bugun, hafta = 12) {
  const gunler = takvim(gecmis, bugun, hafta);
  const sonuc = [];
  for (let h = 0; h < hafta; h++) {
    const dilim = gunler.slice(h * 7, h * 7 + 7);
    const kart = dilim.reduce((t, x) => t + x.kart, 0);
    const dogru = dilim.reduce((t, x) => t + x.dogru, 0);
    sonuc.push({ bas: dilim[0].tarih, kart, dogru, oran: kart ? dogru / kart : null });
  }
  return sonuc;
}

// Önümüzdeki `gun` günün vadeli sanatçı sayısı (0 = bugün; vadesi geçmişler bugüne yazılır).
// Bir sanatçı, sanatçı ve akım sorularından en yakın vadesiyle bir kez sayılır.
export function gelecekYuk(skorlar, idler, bugun, gun = 14) {
  const sayilar = new Array(gun).fill(0);
  for (const id of idler) {
    const sk = (skorlar || {})[id] || {};
    const tarihler = [sk.sanatci, sk.akim].filter((x) => x && x.son && x.sonraki).map((x) => x.sonraki);
    if (!tarihler.length) continue;
    const yakin = tarihler.sort()[0];
    for (let i = 0; i < gun; i++) {
      if (yakin <= gunEkle(bugun, i)) {
        sayilar[i]++;
        break;
      }
    }
  }
  return sayilar;
}

// Verilen güne kadar (o gün dahil) vadesi gelen sanatçı sayısı (Bugün'deki "tekrar bekliyor" ile aynı sayım)
export function vadeSayisi(skorlar, idler, tarih) {
  let n = 0;
  for (const id of idler) {
    const sk = (skorlar || {})[id] || {};
    if (vadesiGeldiMi(sk.sanatci, tarih) || vadesiGeldiMi(sk.akim, tarih)) n++;
  }
  return n;
}

// Rozet için: kapanırken yarının sayısı yazılır (yarına kadar vadesi gelenler)
export function yarinVade(skorlar, idler, bugun) {
  return vadeSayisi(skorlar, idler, gunEkle(bugun, 1));
}
