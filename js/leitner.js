// Leitner kutuları 0–5. Aralıklar gün cinsinden; kutu 0 = aynı oturum.
export const ARALIKLAR = [0, 1, 3, 7, 14, 30];
export const GUNLUK_YENI_SINIRI = 8;

function iki(n) {
  return String(n).padStart(2, '0');
}

// Yerel tarihe göre "YYYY-MM-DD"
export function bugunStr(d = new Date()) {
  return `${d.getFullYear()}-${iki(d.getMonth() + 1)}-${iki(d.getDate())}`;
}

export function gunEkle(tarih, n) {
  const [y, m, g] = tarih.split('-').map(Number);
  const d = new Date(y, m - 1, g + n, 12);
  return bugunStr(d);
}

export function yeniSkor() {
  return { kutu: 0, sonraki: null, dogru: 0, yanlis: 0, son: null };
}

export function gorulduMu(skor) {
  return !!(skor && skor.son);
}

export function vadesiGeldiMi(skor, bugun) {
  return gorulduMu(skor) && !!skor.sonraki && skor.sonraki <= bugun;
}

export function zayifMi(skor) {
  if (!gorulduMu(skor)) return false;
  const toplam = skor.dogru + skor.yanlis;
  return skor.kutu <= 1 || (toplam >= 2 && skor.dogru / toplam < 0.6);
}

// Bir cevabı işler ve yeni skor döndürür (girdiyi değiştirmez).
// Yanlış → kutu 0, bugün tekrar. Doğru → vadesi gelmiş ya da yeni kartta kutu+1 ve
// aralık kadar sonraya. Vadesi gelmemiş (ek pratik) kartta doğru cevap kutuyu ilerletmez.
export function cevapla(skor, dogruMu, bugun) {
  const s = { ...yeniSkor(), ...(skor || {}) };
  const zamaninda = !gorulduMu(s) || !s.sonraki || s.sonraki <= bugun;
  if (!dogruMu) {
    s.kutu = 0;
    s.sonraki = bugun;
    s.yanlis += 1;
  } else {
    s.dogru += 1;
    if (zamaninda) {
      s.kutu = Math.min(ARALIKLAR.length - 1, s.kutu + 1);
      s.sonraki = gunEkle(bugun, ARALIKLAR[s.kutu]);
    }
  }
  s.son = bugun;
  return s;
}

// Yanlış cevaptan sonra kaç kart sonra tekrar gelsin (3–5)
export function tekrarAraligi(rng = Math.random) {
  return 3 + Math.floor(rng() * 3);
}
