// Kaynakları tek eser listesinde birleştirir: kopyaları tek esere indirir, görselleri kaliteye göre
// sıralar, eserleri bilinirliğe göre dizer. Saf fonksiyonlar (birim testli).
import { baslikNormal, dosyaNormal } from '../../js/yardimci.js';

export const ESER_SINIRI = 60; // sanatçı başına en fazla eser
export const MUZE_SINIRI = 25; // bir müze kaynağından sanatçı başına en fazla yeni eser

// "Fotoğraf gibi" görseller (çerçeve, galeri ortamı, sergi, yerinde çekim…) sona atılır.
// "National Gallery", "Art Gallery" gibi kurum adlarındaki "gallery" sayılmaz.
const FOTO = /\b(frame|framed|in[ _]situ|exhibition|ausstellung|taken[ _]at|panoramio|dsc[ _]?\d|img[ _]?\d|p\d{7})\b/i;
const GALERI = /gallery|galleria|galerie/i;
const KURUM_GALERI = /(national|art|portrait|corcoran|walker|dulwich|tate|uffizi|borghese|nazionale|dell'accademia|accademia|staatsgalerie|gemäldegalerie|gemaldegalerie)[ _]+(gallery|galleria|galerie)|(gallery|galleria|galerie)[ _]+(of[ _]+art|nazionale|borghese|dell)/i;
const GAP = /google[ _]art[ _]project/i;
const MUZE_TARAMASI = /\bwga\d+|\bmet[ _]d[pt]\d|\bdp\d{5,}|metropolitan[ _]museum|rijksmuseum|nationalmuseum|mauritshuis|the[ _]yorck[ _]project|national[ _]gallery[ _]of[ _]art|\bnga[ _]\d/i;

// Dosya adlarında "_" sözcük ayırıcıdır; düzenli ifadeler boşluklu hâl üzerinde çalışır
const bosluklu = (d) => String(d || '').replace(/_/g, ' ');

export function fotoGibiMi(dosya) {
  const d = bosluklu(dosya);
  if (FOTO.test(d)) return true;
  return GALERI.test(d) && !KURUM_GALERI.test(d);
}

// Görsel kalitesi: müzenin resmi taraması > Commons'ta Google Art Project / müze kaynaklı > diğer Commons.
// Elle "kötü" işaretlenenler en sona (5) iner.
export function gorselPuani(g, kararlar = {}) {
  if (g.k !== 'commons') return 100;
  const dosya = dosyaNormal(g.d);
  if (kararlar[dosya.toLowerCase()] === 'kotu') return 5;
  const d = bosluklu(dosya);
  if (fotoGibiMi(d)) return 10;
  if (GAP.test(d)) return 80;
  if (MUZE_TARAMASI.test(d)) return 70;
  return 50;
}

// Eser yılı sanatçının çalışma hayatıyla uyuşuyor mu? (doğum+10 … ölüm+5; bilinmeyen yıl engel değil)
export function makulYilMi(sanatci, yil) {
  if (yil == null) return true;
  return (sanatci.dogum == null || yil >= sanatci.dogum + 10) && (sanatci.olum == null || yil <= sanatci.olum + 5);
}

export function gorselAnahtari(g) {
  return g.k === 'commons' ? 'c:' + dosyaNormal(g.d).toLowerCase() : `${g.k}:${g.i || g.u}`;
}

// Müze adını karşılaştırılabilir bir anahtara indirger (kaynakların yazımları farklı)
export function muzeNormal(m) {
  const n = baslikNormal(m);
  if (/metropolitan museum|^the met\b|^met$/.test(n)) return 'met';
  if (/art institute of chicago/.test(n)) return 'aic';
  if (/cleveland museum of art/.test(n)) return 'cma';
  if (/national gallery of art/.test(n)) return 'nga';
  return n
    .replace(/\b(the|museum|museo|musee|of|new york|washington|london|paris)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Aynı eser mi? başlık + tarih ±5 + müze (bilinmeyen alan engel değil; başlık şart)
export function ayniEserMi(a, b) {
  const ab = [a.baslik, a.baslikEn].filter(Boolean).map(baslikNormal);
  const bb = [b.baslik, b.baslikEn].filter(Boolean).map(baslikNormal);
  if (!ab.some((x) => x && bb.includes(x))) return false;
  if (a.yil != null && b.yil != null && Math.abs(a.yil - b.yil) > 5) return false;
  const am = a.muze ? muzeNormal(a.muze) : '';
  const bm = b.muze ? muzeNormal(b.muze) : '';
  if (am && bm && am !== bm) return false;
  return true;
}

function gorselEkle(eser, g) {
  const a = gorselAnahtari(g);
  if (!eser.gorseller.some((x) => gorselAnahtari(x) === a)) eser.gorseller.push(g);
}

/**
 * kurs: [{ baslik, tarih, yer, lisans, konu, dosya, qid? }]  (yalnızca resim olanlar)
 * wd:   [{ qid, baslik, baslikEn, yil, dosyalar, sl, muze, muzeIdler }]
 * muzeler: [{ kaynak, kimlik, baslik, yil, muze, tur, populer, gorsel }]
 * commons: aynı biçim (kaynak: 'commons')
 * kararlar: { 'dosya_adi.jpg': 'kotu' }  — elle görsel kararları
 */
export function birlestir({ kurs = [], wd = [], muzeler = [], commons = [], kararlar = {} }) {
  const eserler = [];
  // 1) kurs eserleri
  for (const k of kurs) {
    eserler.push({
      kurs: true,
      baslik: k.baslik,
      tarih: k.tarih || '',
      yer: k.yer || '',
      kursKonu: k.konu ?? null,
      qid: k.qid || null,
      muze: '', // kurs eserinde yer bilgisi ayrı (k.yer)
      yil: null,
      sl: 0,
      kaynaklar: ['kurs'],
      muzeIdler: {},
      gorseller: [{ k: 'commons', d: dosyaNormal(k.dosya), l: k.lisans || '' }],
      populer: 0,
    });
  }
  // 2) Wikidata: kurs eseriyle aynı öğe (ya da aynı dosya) ise ona katılır
  for (const w of wd) {
    const dosyalar = w.dosyalar.map((d) => dosyaNormal(d).toLowerCase());
    const hedef = eserler.find((e) => (e.qid && e.qid === w.qid) || e.gorseller.some((g) => g.k === 'commons' && dosyalar.includes(dosyaNormal(g.d).toLowerCase())));
    const gorseller = w.dosyalar.map((d) => ({ k: 'commons', d: dosyaNormal(d), l: '' }));
    if (hedef) {
      hedef.qid = hedef.qid || w.qid;
      hedef.baslikEn = hedef.baslikEn || w.baslikEn;
      hedef.yil = hedef.yil ?? w.yil;
      hedef.sl = Math.max(hedef.sl, w.sl);
      hedef.muze = hedef.muze || w.muze;
      hedef.muzeIdler = { ...w.muzeIdler, ...hedef.muzeIdler };
      if (!hedef.kaynaklar.includes('wikidata')) hedef.kaynaklar.push('wikidata');
      for (const g of gorseller) gorselEkle(hedef, g);
    } else {
      eserler.push({
        kurs: false,
        baslik: w.baslik,
        baslikEn: w.baslikEn,
        tarih: '',
        yer: '',
        qid: w.qid,
        muze: w.muze || '',
        yil: w.yil,
        sl: w.sl,
        kaynaklar: ['wikidata'],
        muzeIdler: w.muzeIdler || {},
        gorseller,
        populer: 0,
      });
    }
  }
  // 3) müze kaynakları: önce Wikidata'daki müze kimliğiyle, sonra başlık+tarih+müze ile eşleşir
  const yeniSayisi = {};
  for (const m of [...muzeler, ...commons]) {
    const hedef =
      eserler.find((e) => e.muzeIdler && e.muzeIdler[m.kaynak] && String(e.muzeIdler[m.kaynak]) === String(m.kimlik)) ||
      eserler.find((e) => ayniEserMi(e, m)) ||
      (m.kaynak === 'commons' ? eserler.find((e) => e.gorseller.some((g) => gorselAnahtari(g) === gorselAnahtari(m.gorsel))) : null);
    if (hedef) {
      gorselEkle(hedef, m.gorsel);
      if (!hedef.kaynaklar.includes(m.kaynak)) hedef.kaynaklar.push(m.kaynak);
      if (m.kaynak !== 'commons') {
        hedef.muze = hedef.muze || m.muze;
        hedef.muzeIdler = { ...hedef.muzeIdler, [m.kaynak]: m.kimlik };
      }
      hedef.yil = hedef.yil ?? m.yil;
      hedef.populer = Math.max(hedef.populer, m.populer || 0);
      continue;
    }
    if ((yeniSayisi[m.kaynak] || 0) >= MUZE_SINIRI) continue;
    yeniSayisi[m.kaynak] = (yeniSayisi[m.kaynak] || 0) + 1;
    eserler.push({
      kurs: false,
      baslik: m.baslik,
      baslikEn: m.baslik,
      tarih: '',
      yer: '',
      qid: null,
      muze: m.muze || '',
      yil: m.yil,
      sl: 0,
      kaynaklar: [m.kaynak],
      muzeIdler: m.kaynak === 'commons' ? {} : { [m.kaynak]: m.kimlik },
      gorseller: [m.gorsel],
      populer: m.populer || 0,
    });
  }
  // 4) görselleri kaliteye göre sırala; en iyi görsel elle “kötü” ise ve başka yoksa pekiştirmede kullanma
  for (const e of eserler) {
    e.gorseller = e.gorseller
      .map((g, i) => ({ g, i, p: gorselPuani(g, kararlar) }))
      .sort((a, b) => b.p - a.p || a.i - b.i)
      .map((x) => ({ ...x.g, p: x.p }));
    e.pekistirme = e.gorseller.some((g) => g.p > 5);
  }
  // 5) sıralama: kurs eserleri (kendi sırasında), sonra bilinirlik (Wikidata site bağlantısı, müze öne çıkarması)
  const puan = (e) => e.sl * 10 + e.populer * 5 + (e.kaynaklar.length - 1) * 3 + (e.kaynaklar.includes('commons') && e.kaynaklar.length === 1 ? -20 : 0);
  const kursLar = eserler.filter((e) => e.kurs);
  const digerleri = eserler
    .filter((e) => !e.kurs)
    .map((e, i) => ({ e, i }))
    .sort((a, b) => puan(b.e) - puan(a.e) || a.i - b.i)
    .map((x) => x.e);
  return [...kursLar, ...digerleri].slice(0, ESER_SINIRI);
}
