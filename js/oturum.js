// Pekiştirme oturumu: kart seçimi ve yanlış cevapların aynı oturumda geri dönmesi.
import { vadesiGeldiMi, zayifMi, gorulduMu, tekrarAraligi } from './leitner.js';
import { karistir } from './yardimci.js';

// kip: 'donem' (yalnızca sanatçı sorusu) | 'karisik' (sanatçı + akım)
function ilgiliSkorlar(skorlar, id, kip) {
  const s = (skorlar && skorlar[id]) || {};
  return kip === 'karisik' ? [s.sanatci, s.akim] : [s.sanatci];
}

// Kategori: 0 vadesi gelmiş, 1 zayıf, 2 yeni, 3 diğer
export function kategori(skorlar, id, kip, bugun) {
  const ss = ilgiliSkorlar(skorlar, id, kip);
  if (!ss.some(gorulduMu)) return 2;
  if (ss.some((s) => vadesiGeldiMi(s, bugun))) return 0;
  if (ss.some(zayifMi)) return 1;
  return 3;
}

function enKucukKutu(skorlar, id, kip) {
  return Math.min(...ilgiliSkorlar(skorlar, id, kip).map((s) => (gorulduMu(s) ? s.kutu : 99)));
}

function sonGorulme(skorlar, id, kip) {
  const ss = ilgiliSkorlar(skorlar, id, kip).filter(gorulduMu);
  return ss.length ? ss.map((s) => s.son).sort()[0] : '';
}

// Karta girecek sanatçı id'lerini seçer.
// adaylar: açık sanatçılar (zaten akıma göre süzülmüş olabilir)
// yeniKota: bugün daha kaç yeni sanatçı tanıtılabilir
// sirala: 'oncelik' | 'kronolojik' | 'agirlikli'
export function kartlariSec({ adaylar, skorlar, bugun, adet, yeniKota, kip = 'donem', sirala = 'oncelik', akimSira = {}, rng = Math.random }) {
  const bilgi = adaylar.map((s) => ({ s, k: kategori(skorlar, s.id, kip, bugun) }));
  let yeniKalan = Math.max(0, yeniKota);
  const uygun = (x) => x.k !== 2 || yeniKalan > 0;
  const al = (x) => {
    if (x.k === 2) yeniKalan--;
    return x.s;
  };
  let secilen = [];

  if (sirala === 'agirlikli') {
    const AGIRLIK = [6, 4, 3, 1];
    let havuz = bilgi.slice();
    while (secilen.length < adet) {
      havuz = havuz.filter(uygun);
      if (!havuz.length) break;
      const toplam = havuz.reduce((t, x) => t + AGIRLIK[x.k], 0);
      let r = rng() * toplam;
      let i = 0;
      while (i < havuz.length - 1 && (r -= AGIRLIK[havuz[i].k]) >= 0) i++;
      secilen.push(al(havuz[i]));
      havuz.splice(i, 1);
    }
    return secilen;
  }

  const sirali = karistir(bilgi, rng).sort((a, b) => {
    if (a.k !== b.k) return a.k - b.k;
    if (a.k === 0 || a.k === 1) return enKucukKutu(skorlar, a.s.id, kip) - enKucukKutu(skorlar, b.s.id, kip);
    if (a.k === 2) return (a.s.dogum ?? 0) - (b.s.dogum ?? 0);
    return sonGorulme(skorlar, a.s.id, kip).localeCompare(sonGorulme(skorlar, b.s.id, kip));
  });
  for (const x of sirali) {
    if (secilen.length >= adet) break;
    if (uygun(x)) secilen.push(al(x));
  }
  if (sirala === 'kronolojik') {
    secilen = secilen
      .map((s, i) => ({ s, i }))
      .sort((a, b) => (akimSira[a.s.akim] ?? 0) - (akimSira[b.s.akim] ?? 0) || a.i - b.i)
      .map((x) => x.s);
  }
  return secilen;
}

// Oturum kuyruğu
export class Oturum {
  constructor(idler, { rng = Math.random, enFazlaTekrar = 3 } = {}) {
    this.kuyruk = idler.map((id) => ({ id, tekrar: false }));
    this.konum = 0;
    this.rng = rng;
    this.enFazlaTekrar = enFazlaTekrar;
    this.tekrarSayisi = {};
    this.dogru = 0;
    this.yanlis = 0;
  }
  get bitti() {
    return this.konum >= this.kuyruk.length;
  }
  get simdiki() {
    return this.kuyruk[this.konum] || null;
  }
  get toplam() {
    return this.kuyruk.length;
  }
  // Cevap sonrası: yanlışsa sanatçıyı 3–5 kart sonra tekrar kuyruğa koy.
  isle(dogruMu) {
    const k = this.simdiki;
    if (!k) return;
    if (dogruMu) this.dogru++;
    else {
      this.yanlis++;
      const n = this.tekrarSayisi[k.id] || 0;
      if (n < this.enFazlaTekrar) {
        this.tekrarSayisi[k.id] = n + 1;
        const yer = Math.min(this.kuyruk.length, this.konum + 1 + tekrarAraligi(this.rng));
        this.kuyruk.splice(yer, 0, { id: k.id, tekrar: true });
      }
    }
  }
  ilerle() {
    this.konum++;
  }
}
