// WikiArt: yedek görsel kaynağı (yalnızca derleme zamanı; telefon WikiArt API'sine hiç gitmez).
// Sonuç data/wikiart.json'a (yalnızca başlık, yıl, eser sayfası, görsel URL'si) ve oradan
// data/eserler_onbellek.json'a yazılır.
//
// Kullanım:  WIKIART_ACCESS_KEY=… WIKIART_SECRET_KEY=… node scripts/kaynaklar/wikiart.mjs [sanatçı-id …]
//            UYGULA=1 node scripts/kaynaklar/wikiart.mjs      (ağa gitmeden data/wikiart.json'ı önbelleğe uygula)
//            TAZE=1 …                                          (ham yanıt önbelleğini atla)
// Vekil sunucu arkasındaysan: NODE_USE_ENV_PROXY=1 …
//
// Hangi sanatçılar: pekiştirmede kullanılabilir eseri 12'den az olanlar ve 20. yüzyıl akımları
// (Kübizm'den Savaş sonrası figürasyona). Sanatçı başına en çok 40 eser.
// Sınırlar: saniyede en çok 3, saatte en çok 350 istek (scripts/.ham/wikiart/gunluk.json'da tutulur,
// betik yeniden başlasa da geçerli). Ham yanıtlar scripts/.ham/wikiart/yanit/ altında (git'e girmez);
// kesilirse aynı komutla kaldığı yerden devam eder.
// Anahtarlar yalnızca ortam değişkeninden okunur; hiçbir yere yazılmaz, günlüğe basılmaz.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { adNormal, bekle } from './ortak.mjs';
import { makulYilMi, wikiartCikar, wikiartiUygula } from './birlestir.mjs';

export const ESER_SINIRI = 40;
export const AZ_ESER_ESIGI = 12;
export const SANIYE_SINIRI = 3;
export const SAAT_SINIRI = 350;
export const OTURUM_SINIRI = 8; // WikiArt: saatte 10 oturum; payı bırak
const DETAY_SINIRI = 60; // sanatçı başına en çok eser ayrıntısı isteği
const SAYFA_SINIRI = 8; // tam listeden en çok bu kadar sayfa (kronolojik; eşit aralıkla seçilir)
const KOK = 'https://www.wikiart.org/en';
const AJAN = 'SanatAtlasi/1.0 (personal study app; build script)';

// Resim sayılmayanlar: heykel, mimari, fotoğraf, enstalasyon, tasarım ve benzerleri (WikiArt tür sözlüğü, grup 3)
export const HARIC_TURLER = new Set(
  [
    'sculpture', 'architecture', 'photo', 'installation', 'design', 'performance', 'video', 'animation', 'mobile',
    'stabile', 'jewelry', 'ornament', 'utensil', 'object', 'furniture', 'digital', 'augmented reality', 'ceramic art',
    'mosaic', 'tapestry', 'advertisement', 'bronze', 'marble', 'sculptire', 'inlay', 'forgery', 'fake', 'digital art',
  ].map((x) => x.toLowerCase()),
);
// Yalnızca bunlardan oluşan malzemeler resim değildir (heykel, fotoğraf, nesne)
const HEYKEL_MALZEME =
  /^(marble|bronze|stone|limestone|sandstone|granite|terracotta|terra cotta|plaster|ceramic|porcelain|glass|stained glass|steel|iron|metal|aluminium|aluminum|brass|copper|silver|gold|wax|ivory|alabaster|concrete|plexiglas|plexiglass|neon|wood|gelatin silver print|photograph|photography|photogram|film|readymade|found object|polyester|resin|fiberglass)$/i;
const RESIM_MALZEME =
  /oil|tempera|acrylic|watercolou?r|gouache|pastel|ink|pencil|graphite|chalk|charcoal|crayon|fresco|canvas|paper|panel|board|cardboard|etching|engraving|lithograph|woodcut|linocut|print|collage|enamel paint|distemper|encaustic|vellum|parchment|silk/i;
// Fotoğraf malzemesi her durumda çıkar ("gelatin silver print" bir baskı değil, fotoğraftır)
const FOTO_MALZEME = /gelatin silver|photograph|photogram|chromogenic|cyanotype|albumen|platinum print|daguerreotype/i;
const BASLIK_HARIC = /\b(film still|photograph|photogram|rayograph|readymade)\b/i;

// Akımların WikiArt üslup adları (yalnızca sıralama için: üslubu akımına uyan eserler öne alınır)
export const AKIM_USLUPLARI = {
  Gotik: ['Gothic', 'International Gothic', 'Proto Renaissance', 'Byzantine'],
  'Erken Rönesans': ['Early Renaissance'],
  'Yüksek Rönesans': ['High Renaissance'],
  Ekspresyonizm: ['Expressionism', 'Fauvism'],
  Kübizm: ['Cubism', 'Analytical Cubism', 'Synthetic Cubism', 'Cubo-Expressionism', 'Cubo-Futurism', 'Mechanistic Cubism', 'Orphism'],
  Dada: ['Dada', 'Neo-Dada', 'Conceptual Art'],
  Sürrealizm: ['Surrealism', 'Automatic Painting', 'Magic Realism', 'Metaphysical art'],
  'Savaş sonrası figürasyon': ['Figurative Expressionism', 'Neo-Figurative Art', 'Expressionism', 'Neo-Expressionism'],
};

// ---- saf fonksiyonlar (birim testli) ----

export function slugYap(ad) {
  return String(ad || '')
    .replace(/\([^)]*\)/g, ' ')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function slugAdaylari(sanatci, ekAdlar = []) {
  return [...new Set([sanatci.ad_arama, sanatci.ad, ...ekAdlar.slice(0, 2)].map(slugYap).filter(Boolean))].slice(0, 3);
}

// "May 11, 1904" → 1904; "480 BC" → -480; boşsa "/Date(ms)/" alanından
export function yilCoz(metin, tarih) {
  const s = String(metin || '');
  const sayilar = [...s.matchAll(/\d{1,4}/g)];
  if (sayilar.length) {
    const y = Number(sayilar[sayilar.length - 1][0]);
    return /\b(BC|B\.C\.|BCE)\b/i.test(s) ? -y : y;
  }
  const m = /Date\((-?\d+)\)/.exec(String(tarih || ''));
  if (m) {
    const y = new Date(Number(m[1])).getUTCFullYear();
    return y > 0 ? y : null;
  }
  return null;
}

const soyad = (a) => a.split(' ').pop();

/**
 * Sanatçı eşleşmesi: ad + doğum yılı (±3).
 * 'kesin': ad aynı, doğum ±3, ölüm (ikisi de biliniyorsa) ±3.
 * 'supheli': doğum ±3 ama yalnızca soyad tutuyor ya da ölüm yılı tutmuyor; antik sanatçıda doğum ±15.
 * null: eşleşmez (doğum yılı bilinmiyor ya da tutmuyor) → alınmaz.
 */
export function eslesme(sanatci, wa, ekAdlar = []) {
  if (!wa || !wa.artistName) return null;
  const bizim = new Set([sanatci.ad, sanatci.ad_arama, ...ekAdlar].filter(Boolean).map(adNormal));
  const ters = String(wa.lastNameFirst || '')
    .split(/\s+/)
    .filter(Boolean);
  const onlarin = [wa.artistName, wa.OriginalArtistName, ters.length > 1 ? [...ters.slice(1), ters[0]].join(' ') : '']
    .filter(Boolean)
    .map(adNormal);
  const adTam = onlarin.some((a) => bizim.has(a));
  const adKismi = adTam || onlarin.some((a) => [...bizim].some((b) => soyad(a).length >= 3 && soyad(a) === soyad(b)));
  const dogum = yilCoz(wa.birthDayAsString, wa.birthDay);
  if (dogum == null || sanatci.dogum == null || !adKismi) return null;
  const fark = Math.abs(dogum - sanatci.dogum);
  if (fark <= 3) {
    if (!adTam) return 'supheli';
    const olum = yilCoz(wa.deathDayAsString, wa.deathDay);
    if (sanatci.olum != null && olum != null && Math.abs(olum - sanatci.olum) > 3) return 'supheli';
    return 'kesin';
  }
  if (sanatci.dogum < 0 && fark <= 15) return 'supheli';
  return null;
}

// Yalnızca resim: heykel, mimari, fotoğraf, enstalasyon, tasarım… türleri ve yalnızca heykel/fotoğraf malzemesi olanlar çıkar
export function resimMi(d) {
  if (!d || !d.image) return false;
  if (BASLIK_HARIC.test(d.title || '')) return false;
  if ((d.genres || []).some((t) => HARIC_TURLER.has(String(t).toLowerCase()))) return false;
  const media = (d.media || []).map((m) => String(m).trim()).filter(Boolean);
  if (media.some((m) => FOTO_MALZEME.test(m))) return false;
  if (media.length && media.some((m) => HEYKEL_MALZEME.test(m)) && !media.some((m) => RESIM_MALZEME.test(m))) return false;
  return true;
}

export function ilkYil(s) {
  const m = /\d{3,4}/.exec(String(s ?? ''));
  return m ? Number(m[0]) : null;
}

/**
 * Ayrıntısı istenecek eserlerin sırası: önce WikiArt'ın öne çıkardıkları (bilinirlik), sonra tam listeden
 * on yıllara göre sırayla birer eser (her on yılda büyük görsel önce). Böylece 40 eser kariyerin tamamına yayılır.
 */
export function adaySirala(oneCikan, liste, sanatci) {
  const sonuc = [];
  const gorulen = new Set();
  for (const p of oneCikan) {
    if (gorulen.has(p.id)) continue;
    gorulen.add(p.id);
    sonuc.push({ id: p.id, oneCikan: true });
  }
  const kovalar = new Map();
  for (const p of liste) {
    if (gorulen.has(p.id) || BASLIK_HARIC.test(p.title || '')) continue;
    if (Math.max(p.width || 0, p.height || 0) < 400) continue;
    const yil = ilkYil(p.year);
    if (!makulYilMi(sanatci, yil)) continue;
    gorulen.add(p.id);
    const k = yil == null ? Infinity : Math.floor(yil / 10);
    if (!kovalar.has(k)) kovalar.set(k, []);
    kovalar.get(k).push({ id: p.id, alan: (p.width || 0) * (p.height || 0) });
  }
  const sirali = [...kovalar.entries()].sort((a, b) => a[0] - b[0]).map(([, v]) => v.sort((a, b) => b.alan - a.alan));
  for (let i = 0; sirali.some((v) => i < v.length); i++) for (const v of sirali) if (i < v.length) sonuc.push({ id: v[i].id, oneCikan: false });
  return sonuc;
}

// Uzun listede eşit aralıklı sayfalar (ilk ve son dahil)
export function sayfaSec(toplam, sinir = SAYFA_SINIRI) {
  if (toplam <= sinir) return Array.from({ length: toplam }, (_, i) => i + 1);
  return [...new Set(Array.from({ length: sinir }, (_, i) => 1 + Math.round((i * (toplam - 1)) / (sinir - 1))))];
}

// Hangi sanatçılar sorgulanır? (kullanılabilir eser WikiArt katkısı çıkarılarak sayılır)
export function hedefSanatcilar({ sanatcilar, akimlar, onbellek, turler = {} }) {
  const sira = Object.fromEntries(akimlar.map((a) => [a.ad, a.sira]));
  const yirminci = sira['Kübizm'];
  const hedefler = [];
  const atlananlar = [];
  for (const s of sanatcilar) {
    const eserler = wikiartCikar(((onbellek.sanatcilar || {})[s.id] || {}).eserler || []);
    const uygun = eserler.filter((e) => e.pekistirme !== false && e.gorseller.length && !(e.gorseller[0].p !== undefined && e.gorseller[0].p <= 5)).length;
    const yy = sira[s.akim] >= yirminci;
    if (!(uygun < AZ_ESER_ESIGI || yy)) continue;
    const neden = yy ? `20. yüzyıl akımı (${uygun} kullanılabilir eser)` : `${uygun} kullanılabilir eser`;
    if ((turler.ana_ugras_disi || {})[s.id]) atlananlar.push({ s, neden: 'ana uğraşı resim değil (eser_turleri.json)' });
    else if (s.dogum == null) atlananlar.push({ s, neden: 'doğum yılı bilinmiyor, eşleştirilemez' });
    else hedefler.push({ s, neden, uygun });
  }
  return { hedefler, atlananlar };
}

// Saniyede ve saatte istek sınırı. zaman/uyku dışarıdan verilebilir (test).
export class Sinirlayici {
  constructor({ saniye = SANIYE_SINIRI, saat = SAAT_SINIRI, gecmis = [], simdi = () => Date.now(), uyu = bekle, bildir = () => {} } = {}) {
    this.aralik = Math.ceil(1000 / saniye) + 20;
    this.saat = saat;
    this.gecmis = gecmis.slice();
    this.simdi = simdi;
    this.uyu = uyu;
    this.bildir = bildir;
  }
  async sira() {
    for (;;) {
      const t = this.simdi();
      this.gecmis = this.gecmis.filter((x) => t - x < 3600_000);
      const son = this.gecmis[this.gecmis.length - 1];
      if (this.gecmis.length >= this.saat) {
        const bekleme = this.gecmis[0] + 3600_000 - t + 50;
        this.bildir(bekleme);
        await this.uyu(bekleme);
        continue;
      }
      if (son !== undefined && t - son < this.aralik) {
        await this.uyu(this.aralik - (t - son));
        continue;
      }
      this.gecmis.push(t);
      return;
    }
  }
}

// ---- ağ (yalnızca betik çalıştırılınca) ----

const HAM = new URL('../.ham/wikiart/', import.meta.url);
const GUNLUK = new URL('gunluk.json', HAM);
let oturumAnahtari = null;
let sinirlayici = null;
let oturumlar = [];
let istekSayisi = 0;

// Günlüğe giden her metinden anahtarlar silinir
function temizle(s) {
  let t = String(s);
  for (const k of [process.env.WIKIART_ACCESS_KEY, process.env.WIKIART_SECRET_KEY, oturumAnahtari]) if (k) t = t.split(k).join('***');
  return t.replace(/(authSessionKey|accessCode|secretCode)=[^&\s]*/gi, '$1=***');
}
const yaz = (...a) => console.log(temizle(a.join(' ')));

async function gunlukOku() {
  try {
    return JSON.parse(await readFile(GUNLUK, 'utf8'));
  } catch {
    return { istekler: [], oturumlar: [] };
  }
}
async function gunlukYaz() {
  await mkdir(HAM, { recursive: true });
  const t = Date.now();
  await writeFile(GUNLUK, JSON.stringify({ istekler: sinirlayici.gecmis.filter((x) => t - x < 3600_000), oturumlar: oturumlar.filter((x) => t - x < 3600_000) }));
}

async function hamIstek(url) {
  for (let deneme = 0; ; deneme++) {
    await sinirlayici.sira();
    istekSayisi++;
    let y;
    try {
      y = await fetch(url, { headers: { 'User-Agent': AJAN, Accept: 'application/json' }, redirect: 'manual', signal: AbortSignal.timeout(45000) });
    } catch (e) {
      await gunlukYaz();
      if (deneme >= 4) throw new Error(temizle(`ağ hatası: ${e.message}`));
      await bekle(2000 * 2 ** deneme);
      continue;
    }
    await gunlukYaz();
    if (y.status === 429 || y.status >= 500) {
      if (deneme >= 4) throw new Error(`HTTP ${y.status}`);
      await bekle(y.status === 429 ? 60000 : 2000 * 2 ** deneme);
      continue;
    }
    const metin = await y.text();
    let govde = null;
    try {
      govde = JSON.parse(metin);
    } catch {
      /* JSON değil (ör. yönlendirme ya da HTML) */
    }
    return { durum: y.status, govde };
  }
}

async function oturumAc() {
  const t = Date.now();
  oturumlar = oturumlar.filter((x) => t - x < 3600_000);
  if (oturumlar.length >= OTURUM_SINIRI) throw new Error('saatlik oturum sınırı doldu; bir saat sonra yeniden çalıştır');
  const { WIKIART_ACCESS_KEY: a, WIKIART_SECRET_KEY: g } = process.env;
  if (!a || !g) throw new Error('WIKIART_ACCESS_KEY ve WIKIART_SECRET_KEY ortam değişkenleri gerekli');
  oturumlar.push(t);
  const y = await hamIstek(`${KOK}/Api/2/login?accessCode=${encodeURIComponent(a)}&secretCode=${encodeURIComponent(g)}`);
  if (y.durum !== 200 || !y.govde || !y.govde.SessionKey) throw new Error(`oturum açılamadı (HTTP ${y.durum})`);
  oturumAnahtari = y.govde.SessionKey;
  yaz('WikiArt oturumu açıldı');
}

// Önbellekli istek. v2=true ise oturum anahtarı eklenir (önbellek anahtarına girmez).
async function istek(yol, { v2 = false } = {}) {
  const url = `${KOK}${yol}`;
  const dosya = new URL(`yanit/${createHash('sha1').update(url).digest('hex').slice(0, 20)}.json`, HAM);
  if (process.env.TAZE !== '1') {
    try {
      return JSON.parse(await readFile(dosya, 'utf8'));
    } catch {
      /* yok */
    }
  }
  let sonuc;
  if (v2) {
    if (!oturumAnahtari) await oturumAc();
    const ek = () => `${url.includes('?') ? '&' : '?'}authSessionKey=${encodeURIComponent(oturumAnahtari)}`;
    // Süresi dolan oturum 401/403 ya da (gözlendi) 500 döndürür: oturum bir kez yenilenir
    sonuc = await hamIstek(url + ek()).catch((e) => {
      if (/HTTP 5\d\d/.test(e.message)) return { durum: 500, govde: null };
      throw e;
    });
    if (sonuc.durum === 401 || sonuc.durum === 403 || sonuc.durum >= 500) {
      await oturumAc();
      sonuc = await hamIstek(url + ek());
    }
  } else sonuc = await hamIstek(url);
  if (sonuc.durum >= 300 && sonuc.durum < 400) sonuc = { durum: 404, govde: null }; // yönlendirme: böyle bir sayfa yok
  if (sonuc.durum !== 200 && sonuc.durum !== 404) throw new Error(`HTTP ${sonuc.durum}: ${yol}`);
  await mkdir(new URL('yanit/', HAM), { recursive: true });
  await writeFile(dosya, JSON.stringify({ url, ...sonuc }));
  return sonuc;
}

async function sanatciBul(s, ekAdlar) {
  let supheli = null;
  const dene = async (slug) => {
    const y = await istek(`/${encodeURIComponent(slug)}?json=2`);
    if (y.durum !== 200 || !y.govde || !y.govde.url) return null;
    const e = eslesme(s, y.govde, ekAdlar);
    return e ? { slug: y.govde.url, eslesme: e, ad: y.govde.artistName } : null;
  };
  const denenen = new Set();
  for (const slug of slugAdaylari(s, ekAdlar)) {
    denenen.add(slug);
    const b = await dene(slug);
    if (b && b.eslesme === 'kesin') return b;
    supheli = supheli || b;
  }
  // Ad tahmini tutmadıysa: v2 eser araması, sonuçlardaki sanatçı adresleri
  const ara = await istek(`/api/2/PaintingSearch?term=${encodeURIComponent(s.ad_arama || s.ad)}`, { v2: true });
  const adresler = [...new Set(((ara.govde && ara.govde.data) || []).map((p) => p.artistUrl).filter(Boolean))].filter((u) => !denenen.has(u)).slice(0, 3);
  for (const slug of adresler) {
    const b = await dene(slug);
    if (b && b.eslesme === 'kesin') return b;
    supheli = supheli || b;
  }
  return supheli;
}

async function sanatciIsle(s, ekAdlar) {
  const bulunan = await sanatciBul(s, ekAdlar);
  if (!bulunan) return { durum: 'eslesmedi', neden: 'WikiArt’ta ad + doğum yılı (±3) tutan sanatçı yok', eserler: [] };
  const { slug } = bulunan;
  const masonry = (mod, sayfa) => istek(`/${encodeURIComponent(slug)}/mode/${mod}?json=2&layout=new&page=${sayfa}&resultType=masonry`);
  const one = await masonry('featured', 1);
  const oneCikan = (one.govde && one.govde.Paintings) || [];
  const ilk = await masonry('all-paintings', 1);
  let liste = (ilk.govde && ilk.govde.Paintings) || [];
  const toplam = (ilk.govde && ilk.govde.AllPaintingsCount) || liste.length;
  const boyut = (ilk.govde && ilk.govde.PageSize) || 60;
  for (const p of sayfaSec(Math.ceil(toplam / boyut)).filter((p) => p > 1)) {
    const y = await masonry('all-paintings', p);
    liste = liste.concat((y.govde && y.govde.Paintings) || []);
  }
  const adaylar = adaySirala(oneCikan, liste, s).slice(0, DETAY_SINIRI);
  const usluplar = new Set((AKIM_USLUPLARI[s.akim] || []).map((x) => x.toLowerCase()));
  const alinan = [];
  let elenen = 0;
  for (const a of adaylar) {
    if (alinan.length >= ESER_SINIRI) break;
    const y = await istek(`/api/2/Painting?id=${encodeURIComponent(a.id)}&imageFormat=HalfHD`, { v2: true });
    const d = y.govde;
    if (y.durum !== 200 || !d || d.artistUrl !== slug || !resimMi(d) || !makulYilMi(s, d.completitionYear ?? null) || Math.max(d.width || 0, d.height || 0) < 400) {
      elenen++;
      continue;
    }
    alinan.push({
      eser: {
        baslik: String(d.title).trim(),
        yil: Number.isFinite(d.completitionYear) ? d.completitionYear : null,
        sayfa: `https://www.wikiart.org/en/${d.artistUrl}/${d.url}`,
        gorsel: String(d.image).replace(/^http:/, 'https:'),
      },
      sira: a.oneCikan ? 0 : (d.styles || []).some((x) => usluplar.has(String(x).toLowerCase())) ? 1 : 2,
    });
  }
  alinan.sort((x, y) => x.sira - y.sira);
  return {
    durum: bulunan.eslesme === 'kesin' ? 'eslesti' : 'supheli',
    wikiart: slug,
    ...(bulunan.eslesme === 'supheli' ? { neden: `WikiArt adı/yılları tam tutmuyor (“${bulunan.ad}”)` } : {}),
    elenen,
    eserler: alinan.map((x) => x.eser),
  };
}

async function main() {
  const kok = new URL('../../', import.meta.url);
  const oku = async (yol, yedek) => {
    try {
      return JSON.parse(await readFile(new URL(yol, kok), 'utf8'));
    } catch {
      return yedek;
    }
  };
  const sanatcilar = await oku('data/sanatcilar.json');
  const akimlar = await oku('data/akimlar.json');
  const turler = await oku('data/eser_turleri.json', {});
  const onbellek = await oku('data/eserler_onbellek.json', { sanatcilar: {} });
  const hedefYol = new URL('data/wikiart.json', kok);
  const wikiart = await oku('data/wikiart.json', { surum: 1, sanatcilar: {} });
  wikiart.kaynak = 'WikiArt (https://www.wikiart.org) · scripts/kaynaklar/wikiart.mjs';

  if (process.env.UYGULA !== '1') {
    const g = await gunlukOku();
    oturumlar = g.oturumlar || [];
    sinirlayici = new Sinirlayici({
      gecmis: g.istekler || [],
      bildir: (ms) => yaz(`saatlik sınır (${SAAT_SINIRI}) doldu, ${Math.ceil(ms / 60000)} dk bekleniyor…`),
    });
    const { hedefler, atlananlar } = hedefSanatcilar({ sanatcilar, akimlar, onbellek, turler });
    const secili = process.argv.slice(2);
    for (const { s, neden } of atlananlar) wikiart.sanatcilar[s.id] = { durum: 'atlandi', neden, eserler: [] };
    // Wikidata'daki İngilizce ad ve diğer adlar (eşleşme için; erişilemezse yalnızca veri adları)
    let bilgi = {};
    try {
      const { sanatciBilgileri } = await import('./wikidata.mjs');
      bilgi = await sanatciBilgileri(hedefler.map((h) => (onbellek.sanatcilar[h.s.id] || {}).qid).filter(Boolean));
    } catch (e) {
      yaz('Wikidata adları alınamadı:', e.message);
    }
    let i = 0;
    for (const { s, neden } of hedefler) {
      i++;
      if (secili.length && !secili.includes(s.id)) continue;
      const qid = (onbellek.sanatcilar[s.id] || {}).qid;
      const ekAdlar = ((qid && bilgi[qid]) || {}).adlar || [];
      const once = istekSayisi;
      try {
        const k = await sanatciIsle(s, ekAdlar);
        wikiart.sanatcilar[s.id] = { secim: neden, ...k };
        yaz(`${i}/${hedefler.length} ${s.id}: ${k.durum}${k.wikiart ? ' (' + k.wikiart + ')' : ''} · ${k.eserler.length} eser · ${istekSayisi - once} istek`);
      } catch (e) {
        yaz(`${i}/${hedefler.length} ${s.id}: HATA ${e.message} (yeniden çalıştırınca kaldığı yerden devam eder)`);
        if (/oturum/.test(e.message)) break;
      }
      wikiart.olusturma = new Date().toISOString();
      await writeFile(hedefYol, JSON.stringify(wikiart, null, 1) + '\n');
    }
  }
  wikiartiUygula(onbellek, wikiart);
  await writeFile(new URL('data/eserler_onbellek.json', kok), JSON.stringify(onbellek));
  yaz('data/eserler_onbellek.json güncellendi · bu çalıştırmada', istekSayisi, 'istek');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(temizle(e.stack || e.message));
    process.exit(1);
  });
}
