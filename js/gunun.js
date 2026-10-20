// Günün sanatçısı: kurs ilerlemesinden bağımsız, tarihe göre deterministik seçim.
// Aynı gün hep aynı sanatçı gelir; son 30 günde seçilmiş olan tekrar seçilmez.
export const TEKRAR_YOK_GUN = 30;
// Seçim geçmişinin başladığı gün (bu tarihten itibaren gün gün hesaplanır)
export const BASLANGIC = '2026-01-01';

function gunSayisi(tarih) {
  const [y, a, g] = tarih.split('-').map(Number);
  const [by, ba, bg] = BASLANGIC.split('-').map(Number);
  return Math.round((Date.UTC(y, a - 1, g) - Date.UTC(by, ba - 1, bg)) / 864e5);
}

// Tamsayıdan karışık bir sayı (deterministik)
function karistir32(n) {
  let x = (n + 0x9e3779b9) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b) >>> 0;
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35) >>> 0;
  return (x ^ (x >>> 16)) >>> 0;
}

// havuz: sanatçı kimlikleri (sırası önemsiz; içeride sıralanır). tarih: "YYYY-MM-DD"
export function gununSanatcisi(havuz, tarih) {
  const liste = [...new Set(havuz)].sort();
  if (!liste.length) return null;
  const n = Math.max(0, gunSayisi(tarih));
  const pencere = Math.min(TEKRAR_YOK_GUN, liste.length - 1);
  const gecmis = [];
  let secilen = null;
  for (let gun = 0; gun <= n; gun++) {
    const yasak = new Set(pencere ? gecmis.slice(-pencere) : []);
    const adaylar = liste.filter((id) => !yasak.has(id));
    secilen = adaylar[karistir32(gun) % adaylar.length];
    gecmis.push(secilen);
  }
  return secilen;
}

// "Başka bir sanatçı": bugünkünden farklı, rastgele
export function baskaSanatci(havuz, haric, rng = Math.random) {
  const adaylar = havuz.filter((id) => id !== haric);
  return adaylar.length ? adaylar[Math.floor(rng() * adaylar.length)] : haric;
}
