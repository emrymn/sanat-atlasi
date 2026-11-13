// Çalış · Ders düzeni için kaynak haritası (1.79.0 hazırlığı). YENİ İÇERİK YAZMAZ: her akımın dört adımının
// (Gör, Öğren, Ayırt et, Sına) depoda zaten bulunan, denetlenmiş verilerden hangileriyle beslenebileceğini çıkarır.
//   node scripts/ders/kaynaklar.mjs
// Çıktı: data/ders_kaynaklari.json (uygulama ve ders ekranları için) ve referans/ders_eksikler.md (eksik raporu).
//
// Öğren'deki "kanıt"lar ADAYDIR: bir "Nasıl tanınır?" maddesinin anahtar sözcükleri bir eser metninde (yürüyüş
// noktası, rehberli inceleme noktası, başyapıt yazısı) birlikte geçiyorsa o cümle aday olarak yazılır. Bir eserde
// o özelliğin gerçekten görüldüğünü göstermek için ekrana çıkmadan önce gözle doğrulanmalıdır (bkz. KARARLAR.md).
import { readFileSync, writeFileSync } from 'node:fs';
import { sanatcilariBirlestir, akimlariBirlestir, ozellikleriBirlestir, akimBilgisiBirlestir } from '../../js/birlesme.js';
import { gorunurSanatcilar, gorunurAkimlar } from '../../js/resim.js';
import { temsilOlabilir } from '../../js/temsil.js';

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

function ogrenMaddeleri(ad, uyeler) {
  const metinler = uyeler.flatMap(sanatciMetinleri);
  return (ozellikler[ad] || []).map((madde, no) => {
    const kl = kokler(madde.replace(/\s*\([^)]*\)\s*$/, '')); // "(Uluslararası Gotik)" eki aranmaz
    const esik = Math.min(kl.length, Math.max(2, Math.ceil(kl.length * 0.4))); // en az 2 ve sözcüklerin %40'ı
    const adaylar = [];
    const gorulen = new Set();
    for (const m of metinler)
      for (const c of cumleler(m.metin)) {
        const n = eslesme(kl, c);
        if (n < esik) continue;
        const anahtar = `${m.sanatci}|${m.eser}`;
        adaylar.push({ puan: Math.round((100 * n) / kl.length) / 100, anahtar, ...m, metin: undefined, cumle: c });
      }
    adaylar.sort((a, b) => b.puan - a.puan);
    const secilen = [];
    for (const a of adaylar) {
      if (gorulen.has(a.anahtar) || secilen.length >= 4) continue;
      gorulen.add(a.anahtar);
      delete a.anahtar;
      delete a.metin;
      secilen.push(a);
    }
    return { no, madde, kokler: kl, kanit_adaylari: secilen };
  });
}

function enBilinenler(uyeler, adet) {
  const l = [];
  for (const s of uyeler) {
    const eserler = ((onbellek.sanatcilar[s.id] || {}).eserler || []).filter(
      (e) => e.gorseller && e.gorseller.length && e.pekistirme !== false && temsilOlabilir(e),
    );
    const e = eserler.sort((a, b) => (b.sl || 0) - (a.sl || 0))[0];
    if (e) l.push({ sanatci: s.id, baslik: e.baslik, yil: e.yil ?? null, qid: e.qid || null, sl: e.sl || 0 });
  }
  return l.sort((a, b) => b.sl - a.sl).slice(0, adet);
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
      eser_adaylari: { kendi: enBilinenler(uyelerAl(akim.ad), 3), komsu: enBilinenler(uyelerAl(k), 3) },
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
  '- **Öğren:** "Nasıl tanınır?" maddeleri (`akim_ozellikleri.json`). "Kanıt adayı": maddenin anahtar sözcüklerinin bir eser metninde birlikte geçtiği cümle; **gözle doğrulanmadan** "bu özellik bu eserde" denmez.',
  '- **Ayırt et:** komşu akımlar (`akimlar.json`). Fark tablosu yeni metin yazmadan iki akımın "Nasıl tanınır?" maddeleriyle yan yana kurulabilir (uygulamadaki akım karşılaştırma sayfası da böyle). Karşılaştırma cümlesi: `akim_bilgi.json`\'da öteki akımın adının geçtiği cümle.',
  '- **Sına · "Neden?":** sanatçının `taninma`, tanıma notu ya da `kurs_notu` metni.',
  '',
);
const toplam = { gorYok: [], kanitsiz: 0, madde: 0, ciftCumlesiz: 0, cift: 0, nedensiz: [] };
satir.push('## Özet', '');
satir.push('| Akım | Sanatçı | Gör (yürüyüş) | Öğren (kanıt adayı olan / madde) | Ayırt et (cümlesi olan / komşu) | Sına ("Neden?" kaynağı olmayan) |');
satir.push('|---|---|---|---|---|---|');
for (const d of dersler) {
  const kanitli = d.ogren.filter((m) => m.kanit_adaylari.length).length;
  const cumleli = d.ayirt.filter((c) => c.karsilastirma_cumleleri.length).length;
  const nedensiz = d.sina.filter((x) => !x.neden_kaynagi).map((x) => x.id);
  if (!d.gor.length) toplam.gorYok.push(d.akim);
  toplam.madde += d.ogren.length;
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
  `Toplam: ${dersler.length} ders. Gör verisi olmayan akım: ${toplam.gorYok.length ? toplam.gorYok.join(', ') : 'yok'}. Kanıt adayı bulunamayan "Nasıl tanınır?" maddesi: ${toplam.kanitsiz} / ${toplam.madde}. Karşılaştırma cümlesi olmayan komşu çifti: ${toplam.ciftCumlesiz} / ${toplam.cift}. "Neden?" kaynağı olmayan sanatçı: ${toplam.nedensiz.length}.`,
  '',
);
satir.push('## Ayrıntı', '');
for (const d of dersler) {
  satir.push(`### ${d.akim}`, '');
  satir.push(`- Gör: ${d.gor.length ? d.gor.slice(0, 3).map((g) => `${g.eser} (${g.sanatci}${g.yil ? `, ${g.yil}` : ''}; ${g.nokta} nokta${g.rehberli ? ', rehberli inceleme de var' : ''})`).join(' · ') : '**yürüyüş yok**'}`);
  for (const m of d.ogren) {
    satir.push(`- Öğren ${m.no + 1}. "${m.madde}": ${m.kanit_adaylari.length ? m.kanit_adaylari.map((k) => `${k.eser} (${k.kaynak}, ${k.yer})`).join(' · ') : '**kanıt adayı yok**'}`);
  }
  for (const c of d.ayirt) satir.push(`- Ayırt et ↔ ${c.komsu}: ${c.karsilastirma_cumleleri.length} karşılaştırma cümlesi; özellik maddeleri ${c.ozellikler.kendi} / ${c.ozellikler.komsu}`);
  satir.push('');
}
writeFileSync(new URL('referans/ders_eksikler.md', KOK), satir.join('\n'));
console.log(`${dersler.length} ders · madde ${toplam.madde} (kanıt adaysız ${toplam.kanitsiz}) · komşu çifti ${toplam.cift} (cümlesiz ${toplam.ciftCumlesiz}) · Gör'süz ${toplam.gorYok.length} · Neden'siz ${toplam.nedensiz.length}`);
