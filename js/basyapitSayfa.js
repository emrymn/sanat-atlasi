// Başyapıt sayfası (İş 188): yakın okuma, rehberli ayrıntılar ve ders tek akışta. Saf yardımcılar (birim testli);
// ekran: js/ekranlar/basyapit.js. Bkz. KARARLAR.md "İş 188".

// Karşılaştırma için sadeleştirilmiş yazı: Türkçe küçük harf, işaretsiz, yalnız harf ve rakam
export function sade(s) {
  return String(s || '')
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// ---------- Ayrıntıların metindeki yeri ----------
// Ayrıntı noktaları (data/eser_ayrintilari.json) hangi bölümün altında gösterilecek? Veride eşleme yok; noktanın adındaki
// sözcükler bölüm metninde aranır ("Tek mum" → "…tek bir mumun yanması…"). En çok sözcüğü geçen bölüm kazanır, eşitlikte
// önce gelen. Hiçbir bölümde geçmeyen nokta ilk bölüme gider. Dönen: bölüm başına nokta sıraları (bölüm yoksa tek grup).
const ATLANAN = new Set(['ve', 'ile', 'bir', 'tek', 'iki', 'uc', 'sol', 'sag', 'ust', 'alt', 'on', 'arka', 'kucuk', 'buyuk', 'eser', 'resim', 'tablo', 'icin', 'gibi']);
const kokler = (ad) =>
  sade(ad)
    .split(' ')
    .filter((k) => k.length >= 3 && !ATLANAN.has(k))
    .map((k) => k.slice(0, Math.max(3, Math.min(k.length, 5))));

export function noktalariYerlestir(bolumler, noktalar) {
  const n = Math.max(1, (bolumler || []).length);
  const gruplar = Array.from({ length: n }, () => []);
  const sozcukler = (bolumler || []).map((b) => sade(`${b.baslik || ''} ${b.metin || ''}`).split(' '));
  (noktalar || []).forEach((nokta, i) => {
    const k = kokler(nokta.ad);
    let en = 0;
    let yer = 0;
    sozcukler.forEach((s, j) => {
      const puan = k.filter((kok) => s.some((x) => x.startsWith(kok))).length;
      if (puan > en) {
        en = puan;
        yer = j;
      }
    });
    gruplar[yer].push(i);
  });
  return gruplar;
}

// ---------- Ayrıntı kırpımı ----------
// Bir ayrıntı bölgesini (n: x, y, w, h; resmin oranı olarak 0–1) kutuya sığdıran resim yerleşimi. oran: resmin
// yüksekliği / genişliği; kutu: kutunun genişliği / yüksekliği. Dönen yüzdeler CSS içindir: w ve l kutunun genişliğine,
// h ve t kutunun yüksekliğine göre (img: position absolute; width: w%; height: h%; left: l%; top: t%; boy resim inmeden
// de bellidir, sayfa oynamaz). Bölge bütünüyle
// görünür (pay kadar çevresiyle); resim kutuyu her zaman doldurur; enCok'tan fazla büyütülmez (bulanıklık).
export function kirpim(n, oran, kutu, { pay = 1.6, enCok = 4 } = {}) {
  const r = oran > 0 ? oran : 1;
  const k = kutu > 0 ? kutu : 1;
  const sinir = (v, alt, ust) => Math.min(ust, Math.max(alt, v));
  const doldur = Math.max(1, 1 / (r * k)); // kutuyu kaplayan en küçük genişlik (kutu genişliği = 1)
  const sigdir = Math.min(1 / (Math.max(n.w, 0.01) * pay), 1 / (Math.max(n.h, 0.01) * r * k * pay));
  const w = Math.max(doldur, Math.min(sigdir, Math.max(doldur, enCok)));
  const h = w * r * k; // resmin yüksekliği, kutu yüksekliği cinsinden
  const yuvarla = (v) => Math.round(v * 10000) / 100;
  return {
    w: yuvarla(w),
    h: yuvarla(h),
    l: yuvarla(sinir(0.5 - (n.x + n.w / 2) * w, 1 - w, 0)),
    t: yuvarla(sinir(0.5 - (n.y + n.h / 2) * h, 1 - h, 0)),
  };
}

// ---------- Ders verisi (DERS.json): sözlük, künye, karşılaştırmalar ----------
const yazi = (x) => (typeof x === 'string' ? x.trim() : '');
// Modelin çalışma izleri: kanıt etiketleri ve "(belirsiz)" türü notlar
const ayikla = (s) =>
  yazi(s)
    .replace(/\s*\[[CKSDE]\d{1,4}\]/g, '')
    .replace(/\s*\((belirsiz|tartışma|yorum)[^()]*\)/gi, '')
    .replace(/\s+\+\s+/g, ' ve ')
    .replace(/\s{2,}/g, ' ')
    .trim();
const ilkBuyuk = (s) => s.replace(/^./, (h) => h.toLocaleUpperCase('tr'));

export function sozlukAl(ders, enCok = 8) {
  const l = ders && Array.isArray(ders.temel_kavramlar) ? ders.temel_kavramlar : [];
  const gorulen = new Set();
  return l
    .map((k) => ({ ad: ayikla(k && k.ad), tanim: ayikla(k && k.tanim) }))
    .filter((k) => k.ad.length >= 3 && k.tanim.length >= 8 && !gorulen.has(sade(k.ad)) && gorulen.add(sade(k.ad)))
    .slice(0, enCok)
    .map((k) => ({ ad: ilkBuyuk(k.ad), tanim: ilkBuyuk(k.tanim) }));
}

const sayiYaz = (x) => String(x).replace('.', ',');
export function kunyeSatirlari(b, ders) {
  const k = (ders && ders.kunye && typeof ders.kunye === 'object' ? ders.kunye : null) || {};
  const boyut = k.boyut_cm && Number(k.boyut_cm.yukseklik) > 0 && Number(k.boyut_cm.genislik) > 0 ? `${sayiYaz(k.boyut_cm.yukseklik)} × ${sayiYaz(k.boyut_cm.genislik)} cm` : '';
  return [
    ['Tarih', yazi(b && b.tarih)],
    ['Teknik', ilkBuyuk(ayikla(k.teknik))],
    ['Boyut', boyut],
    ['Yer', yazi(b && b.muze) || ayikla(k.muze)],
  ]
    .filter(([, deger]) => deger)
    .map(([ad, deger]) => ({ ad, deger }));
}

// Dersin karşılaştırma önerileri; uygulamada başyapıt kaydı olan eserler anahtarıyla eşlenir (görsel yalnız onlarda:
// doğruluk kuralı gereği başka bir eser tahminle bağlanmaz). adlar: sanatçı kimliği → ad.
export function karsilastirmalariAl(ders, liste, bu, adlar = () => '') {
  const l = ders && Array.isArray(ders.karsilastirma_onerileri) ? ders.karsilastirma_onerileri : [];
  return l
    .map((k) => ({ eser: ayikla(k && k.eser), sanatci: ayikla(k && k.sanatci), gerekce: ilkBuyuk(ayikla(k && k.gerekce)) }))
    .filter((k) => k.eser && k.gerekce)
    .map((k) => {
      const ad = sade(k.eser);
      const soyad = sade(k.sanatci).split(' ').pop() || '';
      const adaylar = (liste || []).filter((b) => {
        if (b.anahtar === bu || ad.length < 5) return false;
        const basliklar = [sade(String(b.baslik || '').replace(/\s*\([^)]*\)/g, '')), sade(b.ozgun)].filter(Boolean);
        return basliklar.some((x) => x === ad || (x.length >= 8 && ad.includes(x)) || x.includes(ad));
      });
      const es = adaylar.find((b) => soyad && sade(adlar(b.sanatci)).includes(soyad)) || (adaylar.length === 1 ? adaylar[0] : null);
      return { ...k, anahtar: es ? es.anahtar : null };
    });
}

// ---------- Sözlük terimlerini metinde işaretleme ----------
// metin: HTML'e kaçırılmış yazı ya da basit HTML (paragraf, liste). Her terimin sayfadaki ilk geçtiği yer düğmeye çevrilir (Türkçe ekleriyle:
// "glazür" → "glazürle"). kullanilan: sayfa boyunca işaretlenmiş terim sıraları (aynı terim iki kez işaretlenmez).
const ozel = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function terimIsaretle(metin, terimler, kullanilan = new Set()) {
  let cikti = String(metin || '');
  (terimler || []).forEach((t, i) => {
    if (kullanilan.has(i)) return;
    const aranan = String(t.ad || '').toLocaleLowerCase('tr');
    if (aranan.length < 3) return;
    // etiketler aranmaz; düğmelerin (önceki terimler) ve başlıkların içi de
    const parcalar = cikti.split(/(<[^>]+>)/);
    let kapali = 0;
    for (let p = 0; p < parcalar.length; p++) {
      const x = parcalar[p];
      if (x.startsWith('<')) {
        if (/^<(button|h[1-6])\b/i.test(x)) kapali++;
        else if (/^<\/(button|h[1-6])\b/i.test(x)) kapali--;
        continue;
      }
      if (kapali > 0) continue;
      const m = new RegExp(`(?<![\\p{L}\\p{N}])${ozel(aranan)}[\\p{L}]*`, 'u').exec(x.toLocaleLowerCase('tr'));
      if (!m) continue;
      parcalar[p] = `${x.slice(0, m.index)}<button type="button" class="bsy-terim" data-bsy-terim="${i}">${x.slice(m.index, m.index + m[0].length)}</button>${x.slice(m.index + m[0].length)}`;
      kullanilan.add(i);
      break;
    }
    cikti = parcalar.join('');
  });
  return cikti;
}

// ---------- Ayrıntılı anlatım (Orta ders): bölümlere ayırma ----------
// md: temizle() çıktısı ("## Başlık" satırlarıyla). Başlıksız baştaki metin "Giriş" sayılmaz, atılır (eserin tanıtımı
// sayfanın başında zaten var). karsilastirma: bu bölümün yerine karşılaştırma kartları konabilir.
export function dersBolumleri(md) {
  const bolumler = [];
  let simdi = null;
  for (const s of String(md || '').split('\n')) {
    const b = /^##\s+(.*)$/.exec(s);
    if (b) {
      simdi = { baslik: b[1].trim(), govde: [] };
      bolumler.push(simdi);
    } else if (simdi) simdi.govde.push(s);
  }
  return bolumler
    .map((b) => ({ baslik: b.baslik, govde: b.govde.join('\n').trim(), karsilastirma: /karşılaştır/i.test(b.baslik) }))
    .filter((b) => b.baslik && b.govde);
}

export const okumaDakikasi = (md) => Math.max(1, Math.round(String(md || '').split(/\s+/).filter(Boolean).length / 180));
