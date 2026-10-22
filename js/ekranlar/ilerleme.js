// İlerleme: sıradaki konu, kurs kitaplığı, akım doğrulukları, karıştırılanlar ve en zayıf sanatçılar.
import { kacis } from '../yardimci.js';
import { acikSanatcilar, akimDurumlari, yeniAcilanlar } from '../kilit.js';
import { gorulduMu } from '../leitner.js';
import { kategori } from '../oturum.js';
import { ikon } from '../tasarim.js';
import { bilinenAd } from '../adlar.js';
import { karsilastirmaAdresi } from '../karsilastir.js';
import { enCokKarisanlar } from '../ogrenme.js';
import { SEVIYELER, seviyeKaydi } from '../seviye.js';
import { d, etiket, islenen, bugun, akimNoktasi, ust, gununRengi, ciz, ekran, kucukKareleriDoldur, kaydet, bildir } from './ortak.js';

// ---------- İlerleme ----------
// Sık karıştırılan ikililer: yan yana karşılaştırmaya bağlantı
function karisanlarBolumu() {
  const liste = enCokKarisanlar(d.ilerleme.karisanlar, { varMi: (id) => d.harita.has(id) });
  if (!liste.length) return '';
  const ad = (id) => kacis(bilinenAd(d.harita.get(id).ad, d.kisaAdlar[id]));
  return `<h2 class="etiket bolum-baslik">En çok karıştırdıkların</h2>
    <ul class="liste" data-test="karisanlar">${liste
      .map(
        (x) =>
          `<li><a class="satir" href="${karsilastirmaAdresi(x.a, x.b)}"><span class="metin"><b>${ad(x.a)} ↔ ${ad(x.b)}</b><span>${x.n} kez karıştırdın · yan yana bak</span></span>${ikon('karsilastir', 20, 1.4)}</a></li>`,
      )
      .join('')}</ul>`;
}

// Kurs konusunun kısa Türkçe başlığı (D6, data/konular_tr.json); yoksa özgün başlık
function konuBasligi(konu) {
  return (d.konularTr && d.konularTr.konular && d.konularTr.konular[String(konu.no)]) || konu.baslik;
}
function bolumAdi(bl) {
  return (d.konularTr && d.konularTr.bolumler && d.konularTr.bolumler[bl.bolum]) || bl.ad;
}

// Sıradaki konu (D6): kurs sırasında işlenmemiş ilk konu; dokununca "işlendi" olur
function siradakiKonuHtml(k, sayi) {
  const x = d.konular.find((y) => !k.has(y.no));
  if (!x) return '<p class="siradaki-bitti" data-test="siradaki-konu">Bütün konular işlendi.</p>';
  const n = sayi(x.no);
  return `<section class="siradaki${d.siradakiGecti ? ' gecti' : ''}" data-test="siradaki-konu" aria-label="Sıradaki konu">
      <span class="siradaki-no" aria-hidden="true">${x.no}</span>
      <div class="siradaki-yazi">
        ${etiket('Sıradaki konu')}
        <b>${kacis(konuBasligi(x))}</b>
        <small>${n ? `${n} sanatçı açılacak` : 'yeni sanatçı açılmaz'} · Konu ${x.no}</small>
      </div>
      <button class="dugme siradaki-dugme" type="button" data-konu-isle="${x.no}">İşlendi yap</button>
    </section>`;
}

const ROMA = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const bolumNo = (bl) => ROMA[Number(String(bl.bolum).replace(/\D/g, '')) - 1] || kacis(bl.bolum);

// Kurs konuları: tek kitaplık, her konu bir kitap sırtı (boyu sanatçı sayısı; işlenen mürekkep rengi).
// Bir konuya dokununca kitaplığın altında konu kartı açılır; "işlendi" anahtarı kartın içindedir.
function konuSanatcilari(no) {
  const l = d.sanatcilar.filter((s) => s.konu === no);
  return [...l.filter((s) => s.kaynak === 'kurs'), ...l.filter((s) => s.kaynak !== 'kurs')];
}
function konuKarti(x, k) {
  const l = konuSanatcilari(x.no);
  const acik = k.has(x.no);
  // önceki konulardan işlenmemiş varsa tek dokunuşla hepsi (çok konuyu tek tek açmak uzun sürüyordu)
  const oncekiAcik = d.konular.some((y) => y.no <= x.no && !k.has(y.no));
  return `<div class="konu-karti${d.kartDurgun ? ' durgun' : ''}" data-test="konu-karti">
      <span class="konu-karti-no">${x.no}</span>
      <div class="konu-karti-yazi">
        <b>${kacis(konuBasligi(x))}</b>
        ${konuBasligi(x) !== x.baslik ? `<span class="ozgun-konu" lang="en">${kacis(x.baslik)}</span>` : ''}
        <span class="konu-karti-adlar">${l.length ? l.map((s) => (acik ? `<a href="#/sanatci/${encodeURIComponent(s.id)}">${kacis(s.ad)}</a>` : `<span>${kacis(s.ad)}</span>`)).join('') : '<em>Bu konuda yeni sanatçı yok</em>'}</span>
      </div>
      <label class="konu konu-karti-anahtar"><span class="metin">İşlendi</span><input class="anahtar" type="checkbox" role="switch" data-konu="${x.no}" ${acik ? 'checked' : ''} aria-label="Konu ${x.no} işlendi"></label>
      ${oncekiAcik ? `<button class="konu-kadar" type="button" data-konu-kadar="${x.no}" data-test="konu-kadar">1–${x.no} arası hepsi işlendi</button>` : ''}
    </div>`;
}
function kursBolumleriHtml(bolumler, k) {
  const siradaki = (d.konular.find((x) => !k.has(x.no)) || {}).no;
  const durum = (x) => (k.has(x.no) ? ' islendi' : x.no === siradaki ? ' sira' : '');
  const kitap = (x, i) => {
    const l = konuSanatcilari(x.no);
    const boy = 104 + Math.min(l.length, 7) * 8;
    return `<button type="button" class="kitap${durum(x)}${d.kursSecili === x.no ? ' secili' : ''}" data-kurs-konu="${x.no}" style="--boy:${boy}px;--i:${i}" aria-label="Konu ${x.no}: ${kacis(konuBasligi(x))}${k.has(x.no) ? ', işlendi' : ''}"><span class="kitap-no">${x.no}</span><span class="kitap-ad">${kacis(konuBasligi(x))}</span></button>`;
  };
  // tek kitaplık: bölümler arasında Roma rakamlı kitap desteği, kart rafın altında
  const secili = d.konular.find((x) => x.no === d.kursSecili);
  let i = 0;
  // İşaretle kipinde kitaba dokunmak konuyu doğrudan işlendi / işlenmedi yapar (kart açılmaz)
  const kip = (ad, deger, yazi) =>
    `<button type="button" class="kip-dugme${!!d.kursHizli === deger ? ' secili' : ''}" data-kurs-kip="${ad}" aria-pressed="${!!d.kursHizli === deger}">${yazi}</button>`;
  return `<div class="kurs-bolumleri"><div class="kurs-kip" role="group" aria-label="Kitaba dokununca" data-test="kurs-kip">${kip('bilgi', false, 'Dokununca bilgi')}${kip('isaretle', true, 'Dokununca işaretle')}</div>
    <div class="kitaplik${d.kitaplikDurgun ? ' durgun' : ''}${d.kursHizli ? ' hizli' : ''}">${bolumler
      .map((bl) => {
        const bitti = bl.konular.filter((x) => k.has(x.no)).length;
        return `<span class="destek${bitti === bl.konular.length ? ' tam' : ''}" title="${kacis(bolumAdi(bl))}"><b>${bolumNo(bl)}</b><small>${bitti}/${bl.konular.length}</small></span>${bl.konular.map((x) => kitap(x, i++)).join('')}`;
      })
      .join('')}</div>${secili && !d.kursHizli ? konuKarti(secili, k) : ''}</div>`;
}

// Sayfanın parçaları: değişiklikte yalnızca ilgili parçalar yerinde değişir (sayfa baştan çizilmez)
function parcalar() {
  const k = islenen();
  const b = bugun();
  // akım doğrulukları
  const akimSatirlari = akimDurumlari(d.akimlar, d.sanatcilar, k)
    .filter((a) => a.acik)
    .map((a) => {
      let dg = 0;
      let tp = 0;
      for (const s of d.sanatcilar.filter((x) => x.akim === a.ad)) {
        const sk = d.ilerleme.skorlar[s.id] || {};
        for (const x of [sk.sanatci, sk.akim]) if (x) (dg += x.dogru), (tp += x.dogru + x.yanlis);
      }
      const y = tp ? Math.round((100 * dg) / tp) : null;
      return `<div class="cubuk-satir"><span>${akimNoktasi(a.ad)}${kacis(a.ad)} <span class="seviye-etiket" data-test="seviye-ozet">${SEVIYELER[seviyeKaydi(d.ilerleme, a.ad).s].ad}</span></span><span class="cubuk" role="img" aria-label="${y === null ? 'veri yok' : '%' + y}"><i style="width:${y ?? 0}%"></i></span><span class="yuzde">${y === null ? '–' : '%' + y}</span></div>`;
    });
  // en zayıf sanatçılar
  const zayiflar = acikSanatcilar(d.sanatcilar, k)
    .map((s) => {
      const sk = d.ilerleme.skorlar[s.id] || {};
      let dg = 0;
      let tp = 0;
      let kutu = 9;
      for (const x of [sk.sanatci, sk.akim]) if (gorulduMu(x)) (dg += x.dogru), (tp += x.dogru + x.yanlis), (kutu = Math.min(kutu, x.kutu));
      return { s, dg, tp, kutu, oran: tp ? dg / tp : 1 };
    })
    .filter((x) => x.tp > 0 && (x.oran < 1 || x.kutu <= 1))
    .sort((a, b2) => a.oran - b2.oran || a.kutu - b2.kutu || b2.tp - a.tp)
    .slice(0, 10);
  // konular bölümlere göre
  const bolumler = [];
  for (const konu of d.konular) {
    let bl = bolumler.find((x) => x.bolum === konu.bolum);
    if (!bl) bolumler.push((bl = { bolum: konu.bolum, ad: konu.bolum_ad, konular: [] }));
    bl.konular.push(konu);
  }
  const sayi = (no) => d.sanatcilar.filter((s) => s.konu === no).length;
  const vade = acikSanatcilar(d.sanatcilar, k).filter((s) => kategori(d.ilerleme.skorlar, s.id, 'karisik', b) === 0).length;
  return {
    ozet: `<p class="ozet-satir" data-parca="ozet">${k.size} / ${d.konular.length} konu işlendi · ${acikSanatcilar(d.sanatcilar, k).length} sanatçı açık · ${vade} tekrar bekliyor</p>`,
    siradaki: `<div data-parca="siradaki">${siradakiKonuHtml(k, sayi)}</div>`,
    kurs: `<div data-parca="kurs">${kursBolumleriHtml(bolumler, k)}</div>`,
    alt: `<div data-parca="alt">
    <h2 class="etiket bolum-baslik">Akımlara göre doğruluk</h2>
    ${akimSatirlari.length ? `<div style="border-top:1px solid var(--border)">${akimSatirlari.join('')}</div>` : '<p class="ikincil">Henüz açık akım yok.</p>'}
    ${karisanlarBolumu()}
    <h2 class="etiket bolum-baslik">En zayıf sanatçılar</h2>
    ${
      zayiflar.length
        ? `<ul class="liste">${zayiflar
            .map(
              (x) =>
                `<li><a class="satir" href="#/sanatci/${encodeURIComponent(x.s.id)}"><span class="kucuk-kare" data-kucuk="${kacis(x.s.id)}"></span><span class="metin"><b>${kacis(x.s.ad)}</b><span>%${Math.round(100 * x.oran)} doğru · ${x.dg}/${x.tp} · kutu ${x.kutu}</span></span>${ikon('ileri', 20, 1.4)}</a></li>`,
            )
            .join('')}</ul>`
        : '<p class="ikincil kucuk">Henüz zayıf sanatçı yok — biraz pekiştir.</p>'
    }</div>`,
  };
}

export function ilerlemeSayfasi() {
  d.kitaplikDurgun = false;
  d.kartDurgun = false;
  const p = parcalar();
  gununRengi();
  ciz(`${ust('İlerleme', '#/', {
    geriYok: true,
    ustEtiket: 'Kurs',
    sag: `<a class="ust-dugme" href="#/ayarlar" aria-label="Ayarlar">${ikon('ayarlar', 22, 1.4)}</a>`,
  })}
    ${p.ozet}
    ${p.siradaki}
    <h2 class="etiket bolum-baslik">Kurs konuları</h2>
    <p class="kucuk ikincil" style="margin:-4px 0 10px">Bir konuya dokun, bitirdiysen “işlendi” yap; o konunun sanatçıları açılır.</p>
    ${p.kurs}
    ${p.alt}`);
  // kitaplar yalnızca sayfa ilk açılınca rafa dizilerek gelir; sonraki değişikliklerde yerinde durur
  d.kitaplikDurgun = true;
  kucukKareleriDoldur();
}

// Yerinde güncelleme: ad listesindeki parçalar yeniden yazılır, kaydırma yeri korunur
// kartAcildi: konu kartı yeni açıldıysa kayarak gelir; işaretlemeden sonra yerinde durur
function yenile(adlar = ['kurs'], kartAcildi = false) {
  d.kartDurgun = !kartAcildi;
  const p = parcalar();
  const kaydirma = window.scrollY;
  for (const ad of adlar) {
    const el = ekran.querySelector(`[data-parca="${ad}"]`);
    if (el) el.outerHTML = p[ad];
  }
  window.scrollTo(0, kaydirma);
  if (adlar.includes('alt')) kucukKareleriDoldur();
}
const HEPSI = ['ozet', 'siradaki', 'kurs', 'alt'];

// Konuları işlendi / işlenmedi yapar; yeni açılan sanatçıları bildirir
function konuIsaretle(nolar, islendi) {
  const once = d.ilerleme.islenen.slice();
  const s = new Set(once);
  for (const no of [].concat(nolar)) islendi ? s.add(no) : s.delete(no);
  d.ilerleme.islenen = [...s].sort((a, b) => a - b);
  kaydet();
  d.oturum = null;
  const yeni = yeniAcilanlar(d.sanatcilar, once, d.ilerleme.islenen);
  if (yeni.length > 6) bildir(`${yeni.length} sanatçı açıldı.`);
  else if (yeni.length) bildir(`Açıldı: ${yeni.map((x) => x.ad).join(', ')}`);
  else if (!islendi) bildir(`Konu ${nolar} işlenmedi olarak işaretlendi.`);
  return yeni;
}

const odakla = (secici) => {
  const el = ekran.querySelector(secici);
  if (el) el.focus({ preventScroll: true });
};

// Ekranın olay dinleyicileri; app.js özgün sırayla bir kez bağlar
export function olaylariBagla() {
  ekran.addEventListener('change', (e) => {
    const kutu = e.target.closest('[data-konu]');
    if (!kutu) return;
    const no = Number(kutu.dataset.konu);
    konuIsaretle(no, kutu.checked);
    yenile(HEPSI);
    odakla(`[data-konu="${no}"]`);
  });

  ekran.addEventListener('click', (e) => {
    const kp = e.target.closest('[data-kurs-kip]');
    if (kp) {
      d.kursHizli = kp.dataset.kursKip === 'isaretle';
      yenile();
      odakla(`[data-kurs-kip="${kp.dataset.kursKip}"]`);
      return;
    }
    const kd = e.target.closest('[data-konu-kadar]');
    if (kd) {
      const son = Number(kd.dataset.konuKadar);
      konuIsaretle(
        d.konular.filter((x) => x.no <= son).map((x) => x.no),
        true,
      );
      yenile(HEPSI);
      odakla(`[data-konu="${son}"]`);
      return;
    }
    const kk = e.target.closest('[data-kurs-konu]');
    if (!kk) return;
    const no = Number(kk.dataset.kursKonu);
    if (d.kursHizli) {
      // İşaretle kipi: dokunuş doğrudan işlendi / işlenmedi
      konuIsaretle(no, !islenen().has(no));
      yenile(HEPSI);
      odakla(`[data-kurs-konu="${no}"]`);
      return;
    }
    d.kursSecili = d.kursSecili === no ? null : no;
    yenile(['kurs'], true);
    odakla(`[data-kurs-konu="${no}"]`);
    const kart = ekran.querySelector('.konu-karti');
    if (kart) kart.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  ekran.addEventListener('click', (e) => {
    const b = e.target.closest('[data-konu-isle]');
    if (!b) return;
    const no = Number(b.dataset.konuIsle);
    konuIsaretle(no, true);
    d.siradakiGecti = true; // yeni sıradaki konu kayarak gelir
    yenile(HEPSI);
    d.siradakiGecti = false;
    odakla('[data-konu-isle]');
  });
}
