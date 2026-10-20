// Zor yanlış seçenekler (çeldiriciler).
import { karistir } from './yardimci.js';

const VARSAYILAN_OMUR = 60;

// Akımların ortalama orta yılı: tarihi bilinmeyen sanatçılar için tahmin
export function akimOrtaYillari(sanatcilar) {
  const top = {};
  for (const s of sanatcilar) {
    const a = yasamAraligi(s, null);
    if (!a) continue;
    (top[s.akim] ||= []).push((a[0] + a[1]) / 2);
  }
  const sonuc = {};
  for (const [ad, ys] of Object.entries(top)) sonuc[ad] = ys.reduce((x, y) => x + y, 0) / ys.length;
  return sonuc;
}

// [başlangıç, bitiş] yaşam aralığı; eksik uçlar tahmin edilir.
export function yasamAraligi(s, ortaYillar) {
  let d = s.dogum ?? null;
  let o = s.olum ?? null;
  if (d === null && o === null) {
    const m = ortaYillar && ortaYillar[s.akim];
    if (m === undefined || m === null) return null;
    return [m - VARSAYILAN_OMUR / 2, m + VARSAYILAN_OMUR / 2];
  }
  if (d === null) d = o - VARSAYILAN_OMUR;
  if (o === null) o = d + VARSAYILAN_OMUR;
  return [d, o];
}

function ortusur(a, b, pay) {
  if (!a || !b) return false;
  return b[0] <= a[1] + pay && b[1] >= a[0] - pay;
}

function ortaNokta(a) {
  return a ? (a[0] + a[1]) / 2 : 0;
}

// Sanatçı sorusu için 3 çeldirici.
// Sıra: 1) aynı akım (önce açık, sonra kapalı), 2) komşu akımlar ±50 yıl örtüşen,
// 3) ±100 yıl içindeki herkes, 4) (yedek) zamanca en yakınlar.
export function sanatciCeldiricileri(hedef, { sanatcilar, akimlar, acikIdler = new Set(), rng = Math.random, adet = 3, ortaYillar = null }) {
  const oy = ortaYillar || akimOrtaYillari(sanatcilar);
  const hedefAralik = yasamAraligi(hedef, oy);
  const akim = akimlar.find((a) => a.ad === hedef.akim);
  const komsular = new Set((akim && akim.komsular) || []);
  const secilen = [];
  const kullanilan = new Set([hedef.id]);
  const kullanilanAd = new Set([hedef.ad]);

  const acikOnce = (liste) => {
    const k = karistir(liste, rng);
    return [...k.filter((s) => acikIdler.has(s.id)), ...k.filter((s) => !acikIdler.has(s.id))];
  };
  const ekle = (liste) => {
    for (const s of liste) {
      if (secilen.length >= adet) return;
      if (kullanilan.has(s.id) || kullanilanAd.has(s.ad)) continue;
      kullanilan.add(s.id);
      kullanilanAd.add(s.ad);
      secilen.push(s);
    }
  };

  ekle(acikOnce(sanatcilar.filter((s) => s.akim === hedef.akim)));
  ekle(acikOnce(sanatcilar.filter((s) => komsular.has(s.akim) && ortusur(hedefAralik, yasamAraligi(s, oy), 50))));
  ekle(acikOnce(sanatcilar.filter((s) => ortusur(hedefAralik, yasamAraligi(s, oy), 100))));
  if (secilen.length < adet) {
    const m = ortaNokta(hedefAralik);
    ekle(sanatcilar.slice().sort((a, b) => Math.abs(ortaNokta(yasamAraligi(a, oy)) - m) - Math.abs(ortaNokta(yasamAraligi(b, oy)) - m)));
  }
  return secilen;
}

// Dört seçenek (doğru + 3 çeldirici), karıştırılmış.
export function sanatciSecenekleri(hedef, baglam) {
  const rng = baglam.rng || Math.random;
  return karistir([hedef, ...sanatciCeldiricileri(hedef, baglam)], rng);
}

// Akım sorusu: doğru akım + en fazla 3 komşu, sonra kronolojik olarak en yakınlar.
export function akimSecenekleri(akimAdi, akimlar, rng = Math.random, adet = 4) {
  const akim = akimlar.find((a) => a.ad === akimAdi);
  if (!akim) return [akimAdi];
  const secilen = [akimAdi];
  for (const k of karistir(akim.komsular || [], rng)) {
    if (secilen.length >= adet) break;
    if (!secilen.includes(k) && akimlar.some((a) => a.ad === k)) secilen.push(k);
  }
  const yakinlar = akimlar
    .filter((a) => !secilen.includes(a.ad))
    .sort((a, b) => Math.abs(a.sira - akim.sira) - Math.abs(b.sira - akim.sira) || a.sira - b.sira);
  for (const a of yakinlar) {
    if (secilen.length >= adet) break;
    secilen.push(a.ad);
  }
  return karistir(secilen, rng);
}
