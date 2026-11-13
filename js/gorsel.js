// Bir eserin görselleri: kaynağa göre URL, kaynak yazısı ve kullanıcının "kötü" işaretledikleri.
// Görsel biçimi: { k: 'commons'|'met'|'aic'|'cma'|'nga'|'wikiart', d?: Commons dosyası, u?: doğrudan URL,
//                  i?: IIIF kimliği/adresi, l?: lisans, s?: kaynak sayfası, p?: kalite puanı }
import { resimUrl, dosyaSayfasi, dosyaNormal } from './yardimci.js';
import { md5 } from './md5.js';

export const KAYNAK_ADI = {
  commons: 'Wikimedia Commons',
  met: 'The Met',
  aic: 'Art Institute of Chicago',
  cma: 'Cleveland Museum of Art',
  nga: 'National Gallery of Art',
  wikiart: 'WikiArt',
  // İş 119: yalnız en büyük kopyanın kaynağı olarak (scripts/muze_tercih.py)
  rijks: 'Rijksmuseum',
  yuag: 'Yale University Art Gallery',
  // İş 173: scripts/daha_buyuk.py
  smk: 'SMK – Statens Museum for Kunst',
};

export function gorselAnahtari(g) {
  return g.k === 'commons' ? 'c:' + dosyaNormal(g.d).toLowerCase() : `${g.k}:${g.i || g.u}`;
}

// Wikimedia'nın hazır küçük resim basamakları; başka genişlik istenince yeniden üretilir ve 429'a takılır
export const ADIMLAR = [330, 500, 960, 1280, 1920];

// Commons küçük resmi doğrudan upload.wikimedia.org'dan (CORS'a açık, yönlendirmesiz).
// Özgün dosyadan büyük genişlikte bu adres hata verir: o zaman gorselYedek (Special:FilePath) kullanılır.
export function commonsKucuk(dosya, genislik) {
  const ad = dosyaNormal(dosya);
  const h = md5(ad);
  const uz = ((/\.([a-z0-9]+)$/i.exec(ad) || [])[1] || '').toLowerCase();
  const w = ADIMLAR.find((a) => a >= genislik) || ADIMLAR[ADIMLAR.length - 1];
  const on = /^tiff?$/.test(uz) ? 'lossy-page1-' : /^(pdf|djvu)$/.test(uz) ? 'page1-' : '';
  const ek = /^(jpe?g|png|gif|webp)$/.test(uz) ? '' : uz === 'svg' ? '.png' : '.jpg';
  const kod = encodeURIComponent(ad);
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${h[0]}/${h.slice(0, 2)}/${kod}/${on}${w}px-${kod}${ek}`;
}

// Birincil adres açılmazsa denenecek adres (data-yedek): Commons'ta Special:FilePath, diğerlerinde 800 px
export function gorselYedek(g) {
  if (!g) return '';
  return g.k === 'commons' ? resimUrl(g.d, 800) : gorselUrl(g, 800);
}

// Uygulamayla birlikte yayınlanan görsel kopyaları (data/yerel_gorseller.json; gorseller/ klasörü).
// Wikimedia'nın hız sınırı (429) ve müze engelleri (403) bu görselleri etkilemez. Anahtar: kaynak + özgün kimlik.
let yerel = {};
let buyukYerel = new Set();
// harita: { "kaynak:kimlik": "ad" }; buyuk: 1280 px kopyası da olanların anahtarları (başyapıtlar)
export function yerelGorselleriAyarla(harita, buyuk = []) {
  yerel = harita && typeof harita === 'object' && !Array.isArray(harita) ? harita : {};
  buyukYerel = new Set(Array.isArray(buyuk) ? buyuk : []);
}
// En/boy oranları (data/gorsel_oranlari.json; scripts/oranlar.mjs): yalnızca yerel kopyası olan görseller
let oranlar = {};
export function oranlariAyarla(o) {
  oranlar = o && typeof o === 'object' ? o : {};
}
// genişlik / yükseklik; bilinmiyorsa undefined
export function gorselOrani(g) {
  const ad = g && yerel[yerelAnahtar(g)];
  return ad ? oranlar[ad] : undefined;
}
// İş 58: Cloudflare R2'deki kopyalar (data/gorsel_kaynagi.json; scripts/r2_yukle.py). adres: kovanın herkese açık
// adresi; buyuk: 1280 px kopyaların hepsi orada (GitHub Pages'in 1 GB sınırı için depodan çıkarılabilsin);
// devasa: en büyük (4096 px, en yüksek kalite) kopyası olanların adları; muze: { ad: 'met'|'aic'|'nga'|'cma' } en büyük
// kopyası Commons yerine aynı eserin müze görselinden gelenler. Dosya yoksa her şey eskisi gibi depodan.
// İş 84: surumler: { ad: sürüm } daha büyük dosyasıyla yenilenen kopyalar kovada sürüm ekli adla durur (d/<ad>-<sürüm>.jpg):
// eski adres önbellekte "hiç değişmez" ve telefonda indirilmiş olduğundan yenisi ancak yeni adresle gelir
// İş 118: b_surumler: { ad: sürüm } küçük kalmış 1280'lik kopyası en büyük kopyadan yeniden üretilenler (b/<ad>-<sürüm>.jpg;
// aynı sebeple yeni adres)
let uzak = { adres: '', buyuk: false, devasa: new Set(), muze: {}, bayt: 0, surumler: {}, bSurumler: {} };
export function uzakGorselleriAyarla(k) {
  const adres = k && typeof k.adres === 'string' && /^https:\/\//.test(k.adres) ? k.adres.replace(/\/+$/, '') : '';
  const muze = {};
  if (adres && k.muze && typeof k.muze === 'object') for (const [ad, m] of Object.entries(k.muze)) if (KAYNAK_ADI[m] && m !== 'wikiart') muze[ad] = m;
  const bayt = adres && Number.isFinite(k.devasa_bayt) && k.devasa_bayt > 0 ? k.devasa_bayt : 0;
  const surumOku = (x) => {
    const o = {};
    if (adres && x && typeof x === 'object') for (const [ad, v] of Object.entries(x)) if (/^[0-9a-f]{4,16}$/.test(String(v))) o[ad] = v;
    return o;
  };
  uzak = {
    adres,
    buyuk: !!(adres && k.buyuk === true),
    devasa: new Set(adres && Array.isArray(k.devasa) ? k.devasa : []),
    muze,
    bayt,
    surumler: surumOku(k && k.surumler),
    bSurumler: surumOku(k && k.b_surumler),
  };
}
const devasaYolu = (ad) => `${uzak.adres}/d/${ad}${uzak.surumler[ad] ? `-${uzak.surumler[ad]}` : ''}.jpg`;
const buyukYolu = (ad) => `${uzak.adres}/b/${ad}${uzak.bSurumler[ad] ? `-${uzak.bSurumler[ad]}` : ''}.jpg`;
// İş 60: Ayarlar'dan hepsini telefona indirmek için en büyük kopyaların adresleri ve toplam boyu (bayt; bilinmiyorsa 0).
// İş 121: gosterilen (yerel anahtarlar; eserler.js gosterilenGorseller) verilirse yalnız uygulamada gösterilen
// görsellerinkiler (aynı tablonun kopya kaydı ve çıkarılan görseller inmez); toplam boy da o oranda.
let suzulmus = null;
let bSuzulmus = new Set(); // en büyük kopyası olmayanlar
let gSuzulmus = new Set(); // gösterilen bütün görsellerin adları
export function devasaSuz(gosterilen) {
  bSuzulmus = new Set();
  gSuzulmus = new Set();
  if (!gosterilen) return (suzulmus = null);
  const adlar = new Set();
  for (const a of gosterilen) {
    if (!yerel[a]) continue;
    gSuzulmus.add(yerel[a]);
    if (uzak.devasa.has(yerel[a])) adlar.add(yerel[a]);
    else if (uzak.buyuk) bSuzulmus.add(yerel[a]);
  }
  suzulmus = adlar;
}
export const suzulduMu = () => suzulmus !== null;
export function devasaAdresleri() {
  return [...(suzulmus || uzak.devasa)].map(devasaYolu);
}
export function devasaToplamBayt() {
  return suzulmus && uzak.devasa.size ? Math.round((uzak.bayt * suzulmus.size) / uzak.devasa.size) : uzak.bayt;
}
// İş 130 (Emre: "7k görsel yok muydu", "ekle"): en büyük kopyası olmayan (kaynağı 1280'den büyük olmayan) gösterilen
// görsellerin en büyük hâli 1280'liğin kendisi: onlar da telefona iner. Sırada en büyük kopyalardan sonra gelir (inmekte
// olan parçaların sırası bozulmasın). 1280'lik başına ~330 KB (R2'deki örneklerin ortalaması).
// İş 131 (Emre: "resimler çok geç yükleniyor sayfalarda, halbuki indirdim hepsini"): sayfalar en büyük kopyayı değil
// 400'lük (ızgaralar, aynı sunucudan) ve 1280'lik (kartlar, görüntüleyicinin ilk hali; R2) kopyaları gösteriyor; onlar
// telefonda değildi (iPhone'da Cache Storage bozuk olduğundan önbelleğe de giremiyorlardı). Sıra: en büyükler, en büyüğü
// olmayanların 1280'likleri, bütün 400'lükler (sayfaları en çok hızlandıran, küçük), kalan 1280'likler.
// __atlasYalnizDevasa: testler yalnız en büyük kopyalarla çalışır (400'lükler binlerce dosya)
export const B_ORTALAMA_BAYT = 330 * 1024;
export const K_ORTALAMA_BAYT = 42 * 1024; // gorseller/k: 7028 dosya 290 MB
const kucukYolu = (ad) => {
  const g = `gorseller/k/${ad}.jpg`;
  try {
    return new URL(g, globalThis.location.href).href;
  } catch {
    return g;
  }
};
export function telefonAdresleri() {
  const l = [...devasaAdresleri(), ...[...bSuzulmus].map(buyukYolu)];
  if (globalThis.__atlasYalnizDevasa) return l;
  l.push(...[...gSuzulmus].map(kucukYolu));
  if (uzak.buyuk) for (const ad of gSuzulmus) if (!bSuzulmus.has(ad)) l.push(buyukYolu(ad));
  return l;
}
// adresin tahmini boyu (bayt): parçaları ve ilerlemedeki GB'ı hesaplamak için
export function tahminiBayt(u) {
  if (/\/d\/[0-9a-f]/.test(u)) return uzak.devasa.size && uzak.bayt ? uzak.bayt / uzak.devasa.size : 3.3e6;
  if (/\/k\/[0-9a-f]/.test(u)) return K_ORTALAMA_BAYT;
  return B_ORTALAMA_BAYT;
}
export function telefonToplamBayt() {
  const l = telefonAdresleri();
  return uzak.bayt || l.length > devasaAdresleri().length ? Math.round(l.reduce((t, u) => t + tahminiBayt(u), 0)) : 0;
}
// En büyük kopyanın adresi (görüntüleyici); yoksa ''
export function devasaUrl(g) {
  const ad = g && yerel[yerelAnahtar(g)];
  return ad && uzak.devasa.has(ad) ? devasaYolu(ad) : '';
}
// En büyük kopya başka kaynaktan (müzeden) geldiyse o kaynağın adı; yoksa ''
export function devasaKaynagi(g) {
  const ad = g && yerel[yerelAnahtar(g)];
  const m = ad && uzak.devasa.has(ad) && uzak.muze[ad];
  return m && m !== g.k ? KAYNAK_ADI[m] : '';
}
// İş 80: yerel kopyanın bir üst kopyası (ekranda gerçek pikselinden büyük gösterildiğinde): 400 px → 1280 px;
// 1280 px → en büyük kopya (yalnız ekranı büyük ölçüde kaplayan tabloda: devasa kopyalar 3–5 MB ve açılınca
// bellekte onlarca MB yer tutar). Bilinmeyen ya da üstü olmayan adres için ''.
export function ustKopya(src, { buyuk = false } = {}) {
  const m = /(?:^|\/)([kb])\/([0-9a-f]{12,})(?:-[0-9a-f]{4,16})?\.jpg(?:[?#]|$)/.exec(String(src || ''));
  if (!m) return '';
  const [, tur, ad] = m;
  if (tur === 'k') return uzak.buyuk ? buyukYolu(ad) : `gorseller/b/${ad}.jpg`;
  return buyuk && uzak.devasa.has(ad) ? devasaYolu(ad) : '';
}
// İş 137: görselin odak noktası (scripts/odak.py: tablodaki yüzler; data/gorsel_odak.json). Kırpılan görselde
// (object-fit: cover) yüz kutuda kalsın diye CSS object-position olarak verilir; yüz bulunmayan görselde ''.
let odaklar = null;
export function odaklariAyarla(veri) {
  odaklar = veri && veri.odak && typeof veri.odak === 'object' ? veri.odak : null;
}
// İş 150 (Astra: "elle odak düzeltmesi"): elle seçilen odak otomatik yüz odağından önce gelir. Kaynak:
// data/gorsel_odak_elle.json (depoya girenler) ve bu cihazda geliştirici modunda işaretlenenler (localStorage).
export const ELLE_ANAHTAR = 'sanat-atlasi:odak-elle';
let elleDosya = {};
const gecerliOdak = (o) => Array.isArray(o) && o.length === 2 && o.every((n) => Number.isFinite(n) && n >= 0 && n <= 100);
export function elleOdaklariAyarla(veri) {
  elleDosya = veri && veri.odak && typeof veri.odak === 'object' ? veri.odak : {};
}
export function cihazdakiElleOdaklar() {
  try {
    const v = JSON.parse(globalThis.localStorage.getItem(ELLE_ANAHTAR) || '{}');
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
  } catch {
    return {};
  }
}
export const gorselAdi = (g) => (g && yerel[yerelAnahtar(g)]) || '';
// odak: [x, y] yüzde; null → elle odak silinir (otomatiğe dönülür)
export function elleOdakKoy(g, odak) {
  const ad = gorselAdi(g);
  if (!ad) return false;
  const l = cihazdakiElleOdaklar();
  if (odak) l[ad] = odak.map((n) => Math.round(Math.min(100, Math.max(0, n))));
  else delete l[ad];
  try {
    globalThis.localStorage.setItem(ELLE_ANAHTAR, JSON.stringify(l));
  } catch {
    return false;
  }
  return true;
}
// İş 161: görselin elle odağı nereden: 'cihaz' (bu cihazda işaretlendi), 'depo' (data/gorsel_odak_elle.json) ya da null
export function elleOdakKaynagi(g) {
  const ad = gorselAdi(g);
  if (!ad) return null;
  if (gecerliOdak(cihazdakiElleOdaklar()[ad])) return 'cihaz';
  return gecerliOdak(elleDosya[ad]) ? 'depo' : null;
}
// İş 171: yerel adı bilinen görselin odağı ve R2 kopyaları (Bugün yürüyüşü görseli data/yuruyus.json'daki adla bulur)
export const adlaOdak = (ad) => odakAdla(ad);
// buyuk: kayıttaki ayrı kopya yolu (y/<id>.jpg) varsa küçüğü -1280 ekli, büyüğü kendisi; yoksa b/ ve (varsa) d/
export function yuruyusAdresleri(ad, buyuk) {
  if (!uzak.adres) return { kucuk: `gorseller/k/${ad}.jpg`, buyuk: '' };
  if (buyuk) return { kucuk: `${uzak.adres}/${buyuk.replace(/\.jpg$/, '-1280.jpg')}`, buyuk: `${uzak.adres}/${buyuk}` };
  return { kucuk: uzak.buyuk ? buyukYolu(ad) : `gorseller/k/${ad}.jpg`, buyuk: uzak.devasa.has(ad) ? devasaYolu(ad) : '' };
}
// İş 171: ana ekran denetiminde düzeltilen açılış odakları (data/yuruyus_odak.json). Emre'nin elle seçtikleri
// (cihazdaki ve data/gorsel_odak_elle.json) önceliklidir; bu dosya yalnız onların olmadığı eserde, otomatik yüz
// odağının önüne geçer.
let yuruyusOdak = {};
let yuruyusYakin = {};
let yuruyusKirp = {};
const nesne = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? x : {});
export function yuruyusOdaklariAyarla(veri) {
  yuruyusOdak = nesne(veri && veri.odak);
  yuruyusYakin = nesne(veri && veri.yakin);
  yuruyusKirp = nesne(veri && veri.kirp);
}
// Açılış karesinin ek ayarları: yakin (ekranı kaplayan ölçeğin katı, 1–2,2) ve kirp ([x, y, w, h]; yoksa null)
export function yuruyusEki(ad) {
  const y = Number(yuruyusYakin[ad]);
  const k = yuruyusKirp[ad];
  const gecerliKirp = Array.isArray(k) && k.length === 4 && k.every((n) => Number.isFinite(n) && n >= 0 && n <= 1) && k[2] > 0.3 && k[3] > 0.3;
  return { yakin: Number.isFinite(y) ? Math.min(2.2, Math.max(1, y)) : 1, kirp: gecerliKirp ? k : null };
}
function odakAdla(ad) {
  if (!ad) return null;
  const elle = cihazdakiElleOdaklar()[ad] || elleDosya[ad];
  if (gecerliOdak(elle)) return elle;
  if (gecerliOdak(yuruyusOdak[ad])) return yuruyusOdak[ad];
  const o = odaklar && odaklar[ad];
  return gecerliOdak(o) ? o : null;
}
// Ham odak [x, y] (yüzde) ya da null
export function gorselOdakNoktasi(g) {
  const ad = gorselAdi(g);
  if (!ad) return null;
  const elle = cihazdakiElleOdaklar()[ad] || elleDosya[ad];
  if (gecerliOdak(elle)) return elle;
  const o = odaklar && odaklar[ad];
  return gecerliOdak(o) ? o : null;
}
// İş 144: kutuyu kaplayan (cover) görselde odağın kutudaki hedef noktaya (hx, hy: 0–1) gelmesi için görselin kayması
// (px); kenarlar hep kutuyu kaplar. Dönen: { x, y, ox, oy } (ox/oy odağın kutudaki yeri, px) ya da null
export function kaplamaKaymasi(dogal, kutu, odak, hedef = [0.5, 0.4]) {
  if (!odak || !dogal.w || !dogal.h || !kutu.w || !kutu.h) return null;
  const k = Math.max(kutu.w / dogal.w, kutu.h / dogal.h);
  const w = dogal.w * k;
  const h = dogal.h * k;
  const sinirla = (v, en) => Math.min(0, Math.max(en, v));
  const x = sinirla(kutu.w * hedef[0] - (odak[0] / 100) * w, kutu.w - w);
  const y = sinirla(kutu.h * hedef[1] - (odak[1] / 100) * h, kutu.h - h);
  return { x, y, ox: x + (odak[0] / 100) * w, oy: y + (odak[1] / 100) * h };
}
export function gorselOdagi(g) {
  const o = gorselOdakNoktasi(g);
  return o ? `${o[0]}% ${o[1]}%` : '';
}
export function yerelAnahtar(g) {
  return `${g.k}:${g.d || g.i || g.u || ''}`;
}
export function yerelUrl(g, genislik = 800) {
  const a = g && yerelAnahtar(g);
  const ad = a && yerel[a];
  if (!ad) return '';
  if (genislik <= 400) return `gorseller/k/${ad}.jpg`;
  if (uzak.buyuk) return buyukYolu(ad);
  // 1280 px kopya (buyuk listesinde); eski biçimdeki 800'lük kopya yalnızca listede yoksa
  return buyukYerel.has(a) || !buyukYerel.size ? `gorseller/b/${ad}.jpg` : `gorseller/${ad}.jpg`;
}

export function gorselUrl(g, genislik = 800) {
  if (!g) return '';
  const y = yerelUrl(g, genislik);
  if (y) return y;
  switch (g.k) {
    case 'commons':
      return commonsKucuk(g.d, genislik);
    case 'aic':
      return `https://www.artic.edu/iiif/2/${g.i}/full/${genislik <= 400 ? 400 : 843},/0/default.jpg`;
    case 'nga':
      return `${g.i}/full/!${genislik},${genislik}/0/default.jpg`;
    case 'wikiart':
      // Veride HalfHD (1366×800) ya da daha küçük özgün dosya; küçük resimde Large (750×600) yeter
      return genislik <= 400 ? String(g.u).replace(/!HalfHD\.jpg$/i, '!Large.jpg') : g.u;
    default:
      return g.u;
  }
}

// Palet çıkarmak için CORS'a açık adres. Commons'ta Special:FilePath yönlendirmesi CORS başlığı
// göndermediği için doğrudan upload.wikimedia.org küçük resmi (standart 330 px genişlik) kullanılır.
export const PALET_GENISLIGI = 330;
export function paletUrl(g) {
  if (!g) return '';
  if (yerelUrl(g, 400)) return yerelUrl(g, 400); // aynı köken: CORS sorunu yok
  if (g.k !== 'commons') return gorselUrl(g, 400);
  return commonsKucuk(g.d, PALET_GENISLIGI);
}

// Bağlantı olarak verildiği için yalnız http(s) adresler (İş 135: verideki bozuk ya da "javascript:" adres bağlantı olmasın)
export function gorselSayfasi(g) {
  const u = g.k === 'commons' ? dosyaSayfasi(g.d) : g.s || '';
  return /^https?:\/\//i.test(u) ? u : '';
}

export function gorselKaynakYazisi(g) {
  if (g.k === 'wikiart') return 'Kaynak: WikiArt';
  return `${KAYNAK_ADI[g.k] || g.k}${g.l ? ' · ' + g.l : ''}`;
}

// Kullanıcının reddetmediği ilk (en iyi) görsel; hepsi reddedildiyse null
export function secilenGorsel(eser, kotuler = {}) {
  const red = new Set(kotuler[eser.anahtar] || []);
  return (eser.gorseller || []).find((g) => !red.has(gorselAnahtari(g))) || null;
}

// Görseli "kötü" işaretler (kotuler nesnesini değiştirir); sıradaki görseli döndürür
export function kotuIsaretle(eser, gorsel, kotuler) {
  const a = gorselAnahtari(gorsel);
  const liste = (kotuler[eser.anahtar] ||= []);
  if (!liste.includes(a)) liste.push(a);
  return secilenGorsel(eser, kotuler);
}

// Pekiştirmede kullanılabilir mi? (elle "kötü" işaretli tek görseli olanlar ve kullanıcı reddi hariç)
export function pekistirmeyeUygunMu(eser, kotuler = {}) {
  const g = secilenGorsel(eser, kotuler);
  return !!g && eser.pekistirme !== false && !(g.p !== undefined && g.p <= 5);
}

// İş 157 (Emre: "bazı sanatçıların günün resmi güzel ama bazılarınınki daha iyi olabilir; ben tek tek seçeceğim, sen
// onları o sanatçının günün resmi yap"): sanatçı başına elle seçilen günün resmi. Otomatik seçimin (ortak.js
// gununEseri) önüne geçer. Kaynak: data/gunun_resimleri.json (depoya girenler, bütün cihazlar) ve bu cihazda
// görüntüleyicideki "Günün resmi" düğmesiyle seçilenler (localStorage; dosyadakinin önüne geçer).
// Biçim: { surum: 1, secim: { <sanatçı id>: <eser anahtarı ("q:QID" ya da "c:…", js/eserler.js)> } }
export const GUNUN_RESMI_ANAHTAR = 'sanat-atlasi:gunun-resmi';
let dosya = {};

const gecerli = (v) => v && typeof v === 'object' && !Array.isArray(v);
const temiz = (v) => (gecerli(v) ? Object.fromEntries(Object.entries(v).filter(([k, a]) => typeof k === 'string' && typeof a === 'string' && a)) : {});

export function gununResimleriniAyarla(veri) {
  dosya = temiz(veri && veri.secim);
}

export function cihazdakiGununResimleri() {
  try {
    return temiz(JSON.parse(globalThis.localStorage.getItem(GUNUN_RESMI_ANAHTAR) || '{}'));
  } catch {
    return {};
  }
}

// Sanatçının seçilmiş eser anahtarı ya da null (cihazdaki seçim dosyadakinin önüne geçer)
export function gununResmiSecimi(sid) {
  if (!sid) return null;
  return cihazdakiGununResimleri()[sid] || dosya[sid] || null;
}

// anahtar: eser anahtarı; null → bu cihazdaki seçim silinir. Başarılıysa true.
export function gununResmiKoy(sid, anahtar) {
  if (!sid) return false;
  const l = cihazdakiGununResimleri();
  if (anahtar) l[sid] = anahtar;
  else delete l[sid];
  try {
    globalThis.localStorage.setItem(GUNUN_RESMI_ANAHTAR, JSON.stringify(l));
  } catch {
    return false;
  }
  return true;
}

// Eser listesinde seçilen eser (görseli olan) ya da null
export function seciliGununResmi(eserler) {
  const l = eserler || [];
  const sid = l.find((e) => e && e.sid)?.sid;
  const a = gununResmiSecimi(sid);
  return (a && l.find((e) => e.anahtar === a && e.gorseller && e.gorseller.length)) || null;
}

// İş 159: depodaki ve bu cihazdaki seçimler birlikte (cihazdaki önde)
export const tumGununResimleri = () => ({ ...dosya, ...cihazdakiGununResimleri() });
