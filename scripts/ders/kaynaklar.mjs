// Çalış · Ders düzeni için kaynak haritası (1.79.0 hazırlığı). YENİ İÇERİK YAZMAZ: her akımın dört adımının
// (Gör, Öğren, Ayırt et, Sına) depoda zaten bulunan, denetlenmiş verilerden hangileriyle beslenebileceğini çıkarır.
//   node scripts/ders/kaynaklar.mjs
// Çıktı: data/ders_kaynaklari.json (uygulama ve ders ekranları için) ve referans/ders_eksikler.md (eksik raporu).
//
// Öğren'deki "kanıt"lar ADAYDIR: bir "Nasıl tanınır?" maddesinin anahtar sözcükleri bir eser metninde (yürüyüş
// noktası, rehberli inceleme noktası, başyapıt yazısı) birlikte geçiyorsa o cümle aday olarak yazılır. Bir eserde
// o özelliğin gerçekten görüldüğünü göstermek için ekrana çıkmadan önce gözle doğrulanmalıdır (bkz. KARARLAR.md).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { sanatcilariBirlestir, akimlariBirlestir, ozellikleriBirlestir, akimBilgisiBirlestir } from '../../js/birlesme.js';
import { gorunurSanatcilar, gorunurAkimlar } from '../../js/resim.js';

const KOK = new URL('../../', import.meta.url);
const oku = (f) => JSON.parse(readFileSync(new URL(f, KOK), 'utf8'));

const sanatcilarHam = oku('data/sanatcilar.json');
const turler = oku('data/eser_turleri.json');
const onbellek = oku('data/eserler_onbellek.json');
const tumSanatcilar = sanatcilariBirlestir(sanatcilarHam);
const sanatcilar = gorunurSanatcilar(tumSanatcilar, turler, onbellek);
const akimlar = gorunurAkimlar(akimlariBirlestir(oku('data/akimlar.json')).sort((a, b) => a.sira - b.sira), sanatcilar);
const ozellikler = ozellikleriBirlestir(oku('data/akim_ozellikleri.json').akimlar);
const akimBilgi = akimBilgisiBirlestir(oku('data/akim_bilgi.json')).akimlar;
const yuruyus = oku('data/yuruyus.json').eserler;
const ayrintilar = oku('data/eser_ayrintilari.json').eserler;
const basyapitlar = oku('data/basyapitlar.json').eserler;
const tanimaNotlari = oku('data/tanima_notlari.json').notlar;
const eserNotlari = oku('data/eser_notlari.json').notlar;
// Ayırt et'te akımı temsil eden eserler (elle seçildi, görseline bakıldı): data/ders_ayirt_eserleri.json
const ayirtEserleri = oku('data/ders_ayirt_eserleri.json').akimlar;
// Doğrulama kararları (elle; data/ders_dogrulama.json): { kararlar: { '<akım>|<madde no>|<aday id>': { d: 'dogru'|'yanlis'|'belirsiz', n?: not } } }
// (aynı cümle iki maddeye aday olabilir; karar maddeye göre)
const dogrulama = existsSync(new URL('data/ders_dogrulama.json', KOK)) ? oku('data/ders_dogrulama.json').kararlar || {} : {};
const adayId = (a) => createHash('sha1').update(`${a.kaynak}|${a.sanatci || ''}|${a.eser || ''}|${a.cumle}`).digest('hex').slice(0, 10);
const DURUM = { dogru: 'dogrulandi', yanlis: 'yanlis', belirsiz: 'belirsiz' };

// ---------- metin yardımcıları ----------
const kucuk = (s) => s.toLocaleLowerCase('tr');
const cumleler = (metin) =>
  String(metin || '')
    .split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜ"“(])/u)
    .map((x) => x.trim())
    .filter(Boolean);
const DOLGU = new Set(
  've ile bir gibi için daha çok olan olarak üzerine üzerinde biraz sık sıkça genellikle her bu şu kadar değil yerine çoğu çoğunlukla sonra önce hem ya da veya ama fakat ancak ise de da en az'.split(' '),
);
// Türkçe ekler yüzünden sözcüğün ilk beş harfi kök sayılır ("figürler", "figürleri" → "figür")
function kokler(madde) {
  const s = new Set();
  for (const w of kucuk(madde).match(/[\p{L}]+/gu) || []) if (w.length >= 4 && !DOLGU.has(w)) s.add(w.slice(0, 5));
  return [...s];
}
function eslesme(kokL, cumle) {
  const sozler = kucuk(cumle).match(/[\p{L}]+/gu) || [];
  const bulunan = kokL.filter((k) => sozler.some((w) => w.startsWith(k)));
  return bulunan.length;
}

// ---------- her akımın sanatçılarına ait metinler ----------
function sanatciMetinleri(s) {
  const l = [];
  const y = yuruyus[s.id];
  if (y)
    for (const n of y.noktalar || [])
      l.push({ kaynak: 'yuruyus.json', sanatci: s.id, eser: y.eser, qid: y.qid || null, yer: n.ad, metin: n.metin });
  for (const a of ayrintilar.filter((x) => x.sanatci === s.id))
    for (const n of a.noktalar || []) l.push({ kaynak: 'eser_ayrintilari.json', sanatci: s.id, eser: a.baslik, anahtar: a.anahtar, yer: n.ad, metin: n.metin });
  // eser notları (data/eser_notlari.json): anahtar eserin QID'i (ya da 'sanatçı|başlık'); yalnız sanatçının doğrulanmış eser listesindekiler
  for (const e of (onbellek.sanatcilar[s.id] || {}).eserler || []) {
    const not = (e.qid && eserNotlari[e.qid]) || eserNotlari[`${s.id}|${e.baslik}`];
    if (not) l.push({ kaynak: 'eser_notlari.json', sanatci: s.id, eser: e.baslik, qid: e.qid || null, yer: 'eser notu', metin: not });
  }
  for (const b of basyapitlar.filter((x) => x.sanatci === s.id)) {
    l.push({ kaynak: 'basyapitlar.json', sanatci: s.id, eser: b.baslik, anahtar: b.anahtar, yer: 'özet', metin: b.ozet });
    for (const bl of b.bolumler || []) l.push({ kaynak: 'basyapitlar.json', sanatci: s.id, eser: b.baslik, anahtar: b.anahtar, yer: bl.baslik, metin: bl.metin });
  }
  return l;
}

// ---------- adımlar ----------
const basyapitAnahtarlari = new Set(basyapitlar.map((b) => b.anahtar));
function gorAdaylari(uyeler) {
  return uyeler
    .filter((s) => yuruyus[s.id])
    .map((s) => {
      const y = yuruyus[s.id];
      return { sanatci: s.id, eser: y.eser, yil: y.yil ?? null, qid: y.qid || null, nokta: (y.noktalar || []).length, kurs: s.kaynak === 'kurs', rehberli: !!(y.qid && basyapitAnahtarlari.has(y.qid)) };
    })
    .sort((a, b) => b.kurs - a.kurs || b.rehberli - a.rehberli || b.nokta - a.nokta);
}

// Esere bağlı olmayan metinler: sanatçının tanıma metinleri ve akımın dönem metni (kanıt değil, açıklama adayı)
function genelMetinler(ad, uyeler) {
  const l = [];
  for (const s of uyeler) {
    if (s.taninma) l.push({ kaynak: 'sanatcilar.json · taninma', sanatci: s.id, yer: 'Nasıl tanırım?', metin: s.taninma });
    if (tanimaNotlari[s.id]) l.push({ kaynak: 'tanima_notlari.json', sanatci: s.id, yer: 'tanıma notu', metin: tanimaNotlari[s.id] });
    if (s.kurs_notu) l.push({ kaynak: 'sanatcilar.json · kurs_notu', sanatci: s.id, yer: 'kurs notu', metin: s.kurs_notu });
  }
  if (akimBilgi[ad]) l.push({ kaynak: 'akim_bilgi.json', sanatci: null, yer: 'dönemin hikâyesi', metin: akimBilgi[ad].metin });
  return l;
}
function adaylariBul(metinler, kl, esik, adet, eserBasina, onek) {
  const adaylar = [];
  for (const m of metinler)
    for (const c of cumleler(m.metin)) {
      const n = eslesme(kl, c);
      if (n < esik) continue;
      const { metin, ...k } = m;
      adaylar.push({ puan: Math.round((100 * n) / kl.length) / 100, ...k, cumle: c });
    }
  adaylar.sort((a, b) => b.puan - a.puan);
  const secilen = [];
  const gorulen = new Set();
  for (const a of adaylar) {
    const anahtar = eserBasina ? `${a.sanatci}|${a.eser}` : a.cumle;
    if (gorulen.has(anahtar) || secilen.length >= adet) continue;
    gorulen.add(anahtar);
    a.id = adayId(a);
    const k = dogrulama[`${onek}|${a.id}`];
    a.durum = (k && DURUM[k.d]) || 'bakilmadi';
    if (k && k.n) a.not = k.n;
    secilen.push(a);
  }
  return secilen;
}

function ogrenMaddeleri(ad, uyeler) {
  const metinler = uyeler.flatMap(sanatciMetinleri);
  const genel = genelMetinler(ad, uyeler);
  return (ozellikler[ad] || []).map((madde, no) => {
    const kl = kokler(madde.replace(/\s*\([^)]*\)\s*$/, '')); // "(Uluslararası Gotik)" eki aranmaz
    const esik = Math.min(kl.length, Math.max(2, Math.ceil(kl.length * 0.4))); // en az 2 ve sözcüklerin %40'ı
    const kanit = adaylariBul(metinler, kl, esik, 6, true, `${ad}|${no + 1}`);
    const genelAday = adaylariBul(genel, kl, esik, 3, false, `${ad}|${no + 1}`);
    return { no, madde, kokler: kl, kanit_adaylari: kanit, genel_adaylar: genelAday };
  });
}

const adDeseni = (ad) => new RegExp(ad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'iu');
function karsilastirmaCumleleri(a, b) {
  const l = [];
  for (const [kim, karsi] of [
    [a, b],
    [b, a],
  ]) {
    const m = akimBilgi[kim] && akimBilgi[kim].metin;
    for (const c of cumleler(m)) if (adDeseni(karsi).test(c)) l.push({ kaynak: `akim_bilgi.json · ${kim}`, cumle: c });
  }
  return l;
}
function ayirtCiftleri(akim, gorunurAdlar, uyelerAl) {
  return (akim.komsular || [])
    .filter((k) => gorunurAdlar.has(k))
    .map((k) => ({
      komsu: k,
      ozellikler: { kendi: (ozellikler[akim.ad] || []).length, komsu: (ozellikler[k] || []).length },
      karsilastirma_cumleleri: karsilastirmaCumleleri(akim.ad, k),
      eserler: { kendi: ayirtEserleri[akim.ad] || [], komsu: ayirtEserleri[k] || [] },
    }));
}

function sinaKaynaklari(uyeler) {
  return uyeler.map((s) => {
    const k = { id: s.id, taninma: !!s.taninma, kurs_notu: !!s.kurs_notu, tanima_notu: !!tanimaNotlari[s.id], yuruyus: !!yuruyus[s.id] };
    k.neden_kaynagi = s.taninma ? 'sanatcilar.json · taninma' : tanimaNotlari[s.id] ? 'tanima_notlari.json' : s.kurs_notu ? 'sanatcilar.json · kurs_notu' : null;
    return k;
  });
}

// ---------- kur ----------
const gorunurAdlar = new Set(akimlar.map((a) => a.ad));
const uyelerAl = (ad) => sanatcilar.filter((s) => s.akim === ad).sort((a, b) => (a.dogum ?? 0) - (b.dogum ?? 0));
const dersler = akimlar.map((a) => {
  const uyeler = uyelerAl(a.ad);
  return {
    akim: a.ad,
    sira: a.sira,
    sanatcilar: uyeler.map((s) => s.id),
    konular: [...new Set(uyeler.map((s) => s.konu))].sort((x, y) => x - y),
    gor: gorAdaylari(uyeler),
    ogren: ogrenMaddeleri(a.ad, uyeler),
    ayirt: ayirtCiftleri(a, gorunurAdlar, uyelerAl),
    sina: sinaKaynaklari(uyeler),
  };
});

const cikti = {
  surum: 1,
  aciklama:
    'Çalış · Ders düzeni için kaynak haritası (scripts/ders/kaynaklar.mjs üretir; elle düzenlenmez). Yeni içerik yoktur: her alan depodaki bir veri dosyasına işaret eder. ogren[].kanit_adaylari ADAYDIR (anahtar sözcük eşleşmesi); ekranda "bu özellik bu eserde" diye gösterilmeden önce doğrulanmalıdır. ayirt[].karsilastirma_cumleleri akim_bilgi.json metinlerinde öteki akımın adının geçtiği cümlelerdir.',
  dersler,
};
writeFileSync(new URL('data/ders_kaynaklari.json', KOK), JSON.stringify(cikti, null, 1) + '\n');

// ---------- eksik raporu ----------
const satir = [];
satir.push('# Çalış · Ders düzeni: kaynak ve eksik raporu', '');
satir.push('`scripts/ders/kaynaklar.mjs` üretir (elle düzenlenmez). Kaynak haritası: `data/ders_kaynaklari.json`.', '');
satir.push(
  '- **Gör:** dönemin yürüyüşü yazılmış eserleri (`yuruyus.json`).',
  '- **Öğren:** "Nasıl tanınır?" maddeleri (`akim_ozellikleri.json`). "Kanıt adayı": maddenin anahtar sözcüklerinin bir eser metninde birlikte geçtiği cümle. Adaylar `data/ders_dogrulama.json`\'da elle doğrulandı (cümleye göre; görsel ayrıca açılmadı). Ekranda yalnız `durum: dogrulandi` olanlar "bu özellik bu eserde" diye gösterilir; "Genel" adaylar esere bağlı değildir (sanatçının tanıma metni ya da dönem metni), açıklama olarak kullanılabilir.',
  '- **Ayırt et:** komşu akımlar (`akimlar.json`). Fark tablosu yeni metin yazmadan iki akımın "Nasıl tanınır?" maddeleriyle yan yana kurulabilir (uygulamadaki akım karşılaştırma sayfası da böyle). Karşılaştırma cümlesi: `akim_bilgi.json`\'da öteki akımın adının geçtiği cümle.',
  '- **Sına · "Neden?":** sanatçının `taninma`, tanıma notu ya da `kurs_notu` metni.',
  '',
);
const toplam = { gorYok: [], kanitsiz: 0, durum: {}, madde: 0, ciftCumlesiz: 0, cift: 0, nedensiz: [] };
satir.push('## Özet', '');
satir.push('| Akım | Sanatçı | Gör (yürüyüş) | Öğren (doğrulanmış eser kanıtı olan / madde) | Ayırt et (cümlesi olan / komşu) | Sına ("Neden?" kaynağı olmayan) |');
satir.push('|---|---|---|---|---|---|');
for (const d of dersler) {
  const kanitli = d.ogren.filter((m) => m.kanit_adaylari.some((k) => k.durum === 'dogrulandi')).length;
  const cumleli = d.ayirt.filter((c) => c.karsilastirma_cumleleri.length).length;
  const nedensiz = d.sina.filter((x) => !x.neden_kaynagi).map((x) => x.id);
  if (!d.gor.length) toplam.gorYok.push(d.akim);
  toplam.madde += d.ogren.length;
  for (const m of d.ogren) for (const k of [...m.kanit_adaylari, ...m.genel_adaylar]) toplam.durum[k.durum] = (toplam.durum[k.durum] || 0) + 1;
  toplam.kanitsiz += d.ogren.length - kanitli;
  toplam.cift += d.ayirt.length;
  toplam.ciftCumlesiz += d.ayirt.length - cumleli;
  toplam.nedensiz.push(...nedensiz);
  satir.push(
    `| ${d.akim} | ${d.sanatcilar.length} | ${d.gor.length ? `${d.gor.length} eser` : '**yok**'} | ${kanitli} / ${d.ogren.length} | ${cumleli} / ${d.ayirt.length} | ${nedensiz.length ? nedensiz.join(', ') : '–'} |`,
  );
}
satir.push('');
satir.push(
  `Toplam: ${dersler.length} ders. Gör verisi olmayan akım: ${toplam.gorYok.length ? toplam.gorYok.join(', ') : 'yok'}. Doğrulanmış eser kanıtı olmayan "Nasıl tanınır?" maddesi: ${toplam.kanitsiz} / ${toplam.madde}. Adayların doğrulaması: ${Object.entries(toplam.durum).map(([k, n]) => `${k} ${n}`).join(', ')}. Karşılaştırma cümlesi olmayan komşu çifti: ${toplam.ciftCumlesiz} / ${toplam.cift}. "Neden?" kaynağı olmayan sanatçı: ${toplam.nedensiz.length}.`,
  '',
);
satir.push('## Ayrıntı', '');
for (const d of dersler) {
  satir.push(`### ${d.akim}`, '');
  satir.push(`- Gör: ${d.gor.length ? d.gor.slice(0, 3).map((g) => `${g.eser} (${g.sanatci}${g.yil ? `, ${g.yil}` : ''}; ${g.nokta} nokta${g.rehberli ? ', rehberli inceleme de var' : ''})`).join(' · ') : '**yürüyüş yok**'}`);
  for (const m of d.ogren) {
    const dogru = m.kanit_adaylari.filter((k) => k.durum === 'dogrulandi');
    const genel = m.genel_adaylar.filter((k) => k.durum === 'dogrulandi').length;
    satir.push(`- Öğren ${m.no + 1}. "${m.madde}": ${dogru.length ? dogru.map((k) => `${k.eser} (${k.kaynak}, ${k.yer})`).join(' · ') : '**doğrulanmış eser kanıtı yok**'}${genel ? ` · genel açıklama ${genel}` : ''}`);
  }
  for (const c of d.ayirt) satir.push(`- Ayırt et ↔ ${c.komsu}: ${c.eserler.kendi[0] ? c.eserler.kendi[0].baslik : '–'} ↔ ${c.eserler.komsu[0] ? c.eserler.komsu[0].baslik : '–'}; ${c.karsilastirma_cumleleri.length} karşılaştırma cümlesi; özellik maddeleri ${c.ozellikler.kendi} / ${c.ozellikler.komsu}`);
  satir.push('');
}
writeFileSync(new URL('referans/ders_eksikler.md', KOK), satir.join('\n'));
console.log(`${dersler.length} ders · madde ${toplam.madde} (doğrulanmış kanıtsız ${toplam.kanitsiz}; ${JSON.stringify(toplam.durum)}) · komşu çifti ${toplam.cift} (cümlesiz ${toplam.ciftCumlesiz}) · Gör'süz ${toplam.gorYok.length} · Neden'siz ${toplam.nedensiz.length}`);
