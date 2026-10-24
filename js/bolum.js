// Yolculuk haritasının bölümleri (İş 24): her akım, kursun konu sırasıyla dizilmiş sanatçı kümelerine (bölümlere)
// ayrılır; 3 sanatçıdan küçük konu bir sonrakiyle birleşir. Haritada her bölüm bir durak.
// Bölüm akışı: (ilk kez) tanıtım → Kolay (8 soru) → Orta (10 soru) → isteğe bağlı Zor (10 soru); geçme sınırı %75.
// Orta geçilince sonraki bölüm açılır; bir akımın bölümlerinin %60'ının (yukarı yuvarlanır) Orta'sı geçilince
// sonraki akımın ilk bölümü açılır. Ayrıca bölümün bütün sanatçılarının konusu kursta işlenmiş olmalı.
// Saf mantık burada (birim testli); ekranlar js/ekranlar/harita.js ve js/ekranlar/pekistir.js.
import { islenenKume } from './kilit.js';
import { tanismaEserleri } from './ogrenme.js';

export const BOLUM_SEVIYELER = ['kolay', 'orta', 'zor'];
export const BOLUM_SORU = { kolay: 8, orta: 10, zor: 10 };
export const BOLUM_GECME = 0.75;
export const AKIM_GECME = 0.6;
export const KUME_EN_AZ = 3;
export const SEVIYE_NO = { kolay: 0, orta: 1, zor: 2 };

// akimlar: [{ad, sira}], sanatcilar: [{id, akim, konu, dogum}]
export function bolumleriKur(akimlar, sanatcilar) {
  const sonuc = [];
  for (const a of akimlar.slice().sort((x, y) => x.sira - y.sira)) {
    const konular = new Map();
    for (const s of sanatcilar) {
      if (s.akim !== a.ad) continue;
      if (!konular.has(s.konu)) konular.set(s.konu, []);
      konular.get(s.konu).push(s);
    }
    const kumeler = [];
    let kume = { konular: [], sanatcilar: [] };
    for (const k of [...konular.keys()].sort((x, y) => x - y)) {
      kume.konular.push(k);
      kume.sanatcilar.push(...konular.get(k).sort((x, y) => (x.dogum ?? 0) - (y.dogum ?? 0)).map((s) => s.id));
      if (kume.sanatcilar.length >= KUME_EN_AZ) {
        kumeler.push(kume);
        kume = { konular: [], sanatcilar: [] };
      }
    }
    if (kume.sanatcilar.length) {
      if (kumeler.length) {
        const son = kumeler[kumeler.length - 1];
        son.konular.push(...kume.konular);
        son.sanatcilar.push(...kume.sanatcilar);
      } else kumeler.push(kume);
    }
    kumeler.forEach((k, i) => sonuc.push({ id: `${a.sira}-${i + 1}`, akim: a.ad, sira: a.sira, no: i + 1, adet: kumeler.length, ...k }));
  }
  return sonuc;
}

export function bolumAdi(b) {
  return b.adet > 1 ? `${b.akim} · ${b.no}. bölüm` : b.akim;
}

// ilerleme.bolumler: { [id]: { kolay: en iyi oran 0–1, orta, zor, tanitim: true } }
export function bolumKaydi(ilerleme, id) {
  const k = ilerleme && ilerleme.bolumler && Object.hasOwn(ilerleme.bolumler, id) && ilerleme.bolumler[id];
  return k ? { ...k } : {};
}

export const gectiMi = (kayit, seviye) => (kayit[seviye] ?? 0) >= BOLUM_GECME;
export const yildizSayisi = (kayit) => BOLUM_SEVIYELER.filter((s) => gectiMi(kayit, s)).length;
export const akimGecmeSayisi = (n) => Math.ceil(n * AKIM_GECME - 1e-9);

// Her bölümün durumu ve haritadaki "buradasın" bölümü
export function bolumDurumlari(bolumler, ilerleme, islenen, harita) {
  const k = islenenKume(islenen);
  const sanatci = (id) => (harita && harita.get ? harita.get(id) : null);
  const durumlar = [];
  let oncekiAkim = null; // { akim, gecen, toplam }
  let akimDurum = null;
  for (const b of bolumler) {
    const kayit = bolumKaydi(ilerleme, b.id);
    const eksikKonular = [...new Set(b.sanatcilar.map((id) => sanatci(id)).filter((s) => s && !k.has(s.konu)).map((s) => s.konu))].sort((x, y) => x - y);
    const kursAcik = !eksikKonular.length && (!harita || b.sanatcilar.every((id) => sanatci(id)));
    if (!akimDurum || akimDurum.akim !== b.akim) {
      if (akimDurum) oncekiAkim = akimDurum;
      akimDurum = { akim: b.akim, gecen: 0, toplam: b.adet };
    }
    const onceki = durumlar[durumlar.length - 1];
    let oyunAcik;
    let neden = null;
    if (!onceki) oyunAcik = true;
    else if (b.no > 1) {
      oyunAcik = onceki.acik && onceki.ortaGecti;
      if (!oyunAcik) neden = { tur: 'bolum', bolum: onceki.id };
    } else {
      const gereken = akimGecmeSayisi(oncekiAkim.toplam);
      oyunAcik = oncekiAkim.gecen >= gereken;
      if (!oyunAcik) neden = { tur: 'akim', akim: oncekiAkim.akim, gecen: oncekiAkim.gecen, gereken };
    }
    if (!kursAcik) neden = { tur: 'kurs', konu: eksikKonular[0] ?? null };
    const acik = kursAcik && oyunAcik;
    const kolayGecti = acik && gectiMi(kayit, 'kolay');
    const ortaGecti = acik && gectiMi(kayit, 'orta');
    if (ortaGecti) akimDurum.gecen++;
    durumlar.push({
      ...b,
      kayit,
      kursAcik,
      acik,
      neden: acik ? null : neden,
      kolayGecti,
      ortaGecti,
      zorGecti: acik && gectiMi(kayit, 'zor'),
      yildiz: acik ? yildizSayisi(kayit) : 0,
      seviyeAcik: { kolay: acik, orta: kolayGecti, zor: ortaGecti },
    });
  }
  const acikler = durumlar.filter((x) => x.acik);
  const simdiki = (acikler.find((x) => !x.ortaGecti) || acikler[acikler.length - 1] || null)?.id ?? null;
  return { durumlar, simdiki };
}

// Kilitli bölümün açıklaması
export function kilitMetni(x, bolumler) {
  const n = x.neden;
  if (!n) return '';
  if (n.tur === 'kurs') return n.konu ? `Konu ${n.konu} işlenince açılır.` : 'Bu bölümün konusu henüz işlenmedi.';
  if (n.tur === 'bolum') {
    const b = bolumler.find((y) => y.id === n.bolum);
    return `${b ? bolumAdi(b) : 'Önceki bölüm'}: Orta seviyeyi geçince açılır.`;
  }
  return `${n.akim} akımında ${n.gereken} bölümün Orta'sını geçince açılır (şu an ${n.gecen}).`;
}

// Turun kart sırası: bölümün sanatçıları karışık sırayla, adet dolana kadar; aynı sanatçı arka arkaya gelmez
export function bolumKartlari(idler, adet, rng = Math.random) {
  if (!idler.length) return [];
  const sonuc = [];
  while (sonuc.length < adet) {
    const tur = idler.slice();
    for (let i = tur.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [tur[i], tur[j]] = [tur[j], tur[i]];
    }
    if (tur.length > 1 && tur[0] === sonuc[sonuc.length - 1]) [tur[0], tur[1]] = [tur[1], tur[0]];
    sonuc.push(...tur);
  }
  return sonuc.slice(0, adet);
}

// Tur sonucu: en iyi oranı tutar. Dönen: { oran, gecti, yeniGecti, yildizOnce, yildizSonra }
export function bolumSonucuIsle(ilerleme, id, seviye, dogru, toplam) {
  const once = bolumKaydi(ilerleme, id);
  const oran = toplam ? dogru / toplam : 0;
  const sonra = { ...once, [seviye]: Math.max(once[seviye] ?? 0, Math.round(oran * 1000) / 1000) };
  ilerleme.bolumler = { ...(ilerleme.bolumler || {}), [id]: sonra };
  return { oran, gecti: oran >= BOLUM_GECME, yeniGecti: oran >= BOLUM_GECME && !gectiMi(once, seviye), yildizOnce: yildizSayisi(once), yildizSonra: yildizSayisi(sonra) };
}

// seviye 'kolay' → tanitim, 'orta' → tanitimOrta (İş 30: Orta'nın da kendi tanıtımı var)
export function tanitimGoruldu(ilerleme, id, seviye = 'kolay') {
  const alan = seviye === 'orta' ? 'tanitimOrta' : 'tanitim';
  ilerleme.bolumler = { ...(ilerleme.bolumler || {}), [id]: { ...bolumKaydi(ilerleme, id), [alan]: true } };
}

// ---------- İş 30 · katmanlar: tanıtımda gösterilen eserler soruların ta kendisi ----------
// Her sanatçının pekiştirme havuzu kolaydan zora sıralanır (zorluk puanı, yoksa bilinirlik):
// Kolay = ilk BOLUM_ESER eser, Orta = sonraki BOLUM_ESER eser (sanatçının o kadar eseri yoksa Kolay'ınkiler).
// Tanıtım bu eserleri gösterir, o seviyenin soruları yalnız bunlardan gelir. Zor sınırlanmaz (havuzun hepsi).
export const BOLUM_ESER = 5;
export const TANITIM_SEVIYE = { tanitim: 'kolay', 'tanitim-orta': 'orta', kolay: 'kolay', orta: 'orta' };
export function bolumEserleri(havuz, seviye, kolaylik = null) {
  if (seviye !== 'kolay' && seviye !== 'orta') return null;
  const sirali = tanismaEserleri(havuz || [], null, Infinity, kolaylik);
  const kolay = sirali.slice(0, BOLUM_ESER);
  if (seviye === 'kolay') return kolay;
  const orta = sirali.slice(BOLUM_ESER, 2 * BOLUM_ESER);
  return orta.length ? orta : kolay;
}

// Yedekten / depodan gelen kaydı doğrular
export function bolumlerDogrula(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {};
  const sonuc = {};
  for (const [id, k] of Object.entries(v)) {
    if (!/^\d+-\d+$/.test(id) || !k || typeof k !== 'object') continue;
    const t = {};
    for (const s of BOLUM_SEVIYELER) if (typeof k[s] === 'number' && k[s] >= 0 && k[s] <= 1) t[s] = k[s];
    if (k.tanitim === true) t.tanitim = true;
    if (k.tanitimOrta === true) t.tanitimOrta = true;
    sonuc[id] = t;
  }
  return sonuc;
}
