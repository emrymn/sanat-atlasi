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
import { takvimHtml, egriHtml, koleksiyonBagi } from './calisma.js';
import { d, etiket, islenen, bugun, akimNoktasi, ust, gununRengi, ciz, ekran, kucukKareleriDoldur, kaydet, bildir, acikListe, akimRenk, tabloDugme } from './ortak.js';
import { kutuDagilimi, akimIstatistigi, seviyeIziHtml, halkaHtml, kutuPipHtml } from './pano.js';
import { hatalarBilgisi } from './pekistir.js';
import { gorselUrl, gorselYedek } from '../gorsel.js';

// İş 28: kitaplıkta yalnız kapağı (resmi) olan kurs konuları; heykel, mimari ve eseri olmayan dersler gösterilmez
const kurs = () => d.kursKonulari || d.konular;
const islenmis = (k) => kurs().filter((x) => k.has(x.no)).length;

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
  const x = kurs().find((y) => !k.has(y.no));
  if (!x) return '<p class="siradaki-bitti" data-test="siradaki-konu">Bütün konular işlendi.</p>';
  const n = sayi(x.no);
  const onizleme = konuSanatcilari(x.no).slice(0, 4);
  return `<section class="siradaki${d.siradakiGecti ? ' gecti' : ''}${onizleme.length ? ' resimli' : ''}" data-test="siradaki-konu" aria-label="Sıradaki konu">
      ${
        onizleme.length
          ? `<div class="siradaki-onizleme" aria-hidden="true">${onizleme.map((s, i) => `<span class="kilitli-kare" style="--i:${i}"><span data-kucuk="${kacis(s.id)}"></span></span>`).join('')}<span class="kilit-ikon">${ikon('kilit', 18, 1.6)}</span></div>`
          : ''
      }
      <span class="siradaki-no" aria-hidden="true">${x.no}</span>
      <div class="siradaki-yazi">
        ${etiket('Sıradaki konu')}
        <b>${kacis(konuBasligi(x))}</b>
        <small>${n ? `${n} sanatçı açılacak` : 'yeni sanatçı açılmaz'} · Konu ${x.no}</small>
      </div>
      <button class="dugme siradaki-dugme isle-ince" type="button" data-konu-isle="${x.no}"><span class="isle-halka" aria-hidden="true">${ikon('dogru', 14, 2.2)}</span><span class="isle-yazi">İşlendi yap</span></button>
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
  const oncekiAcik = kurs().some((y) => y.no <= x.no && !k.has(y.no));
  const portre = (s, i) =>
    acik
      ? `<a class="konu-portre" href="#/sanatci/${encodeURIComponent(s.id)}" style="--i:${i}"><span class="konu-portre-resim" data-kucuk="${kacis(s.id)}"></span><span>${kacis(bilinenAd(s.ad, d.kisaAdlar[s.id]))}</span></a>`
      : `<span class="konu-portre kapali" style="--i:${i}"><span class="konu-portre-resim" data-kucuk="${kacis(s.id)}"></span><span>${kacis(bilinenAd(s.ad, d.kisaAdlar[s.id]))}</span></span>`;
  return `<div class="konu-karti${d.kartDurgun ? ' durgun' : ''}${acik ? ' acik' : ''}" data-test="konu-karti">
      <span class="konu-karti-no">${x.no}</span>
      <div class="konu-karti-yazi">
        <b>${kacis(konuBasligi(x))}</b>
        ${konuBasligi(x) !== x.baslik ? `<span class="ozgun-konu" lang="en">${kacis(x.baslik)}</span>` : ''}
        <span class="konu-karti-adlar">${l.length ? l.map(portre).join('') : '<em>Bu konuda yeni sanatçı yok</em>'}</span>
      </div>
      <label class="konu konu-karti-anahtar"><span class="metin">İşlendi</span><input class="anahtar" type="checkbox" role="switch" data-konu="${x.no}" ${acik ? 'checked' : ''} aria-label="Konu ${x.no} işlendi"></label>
      ${oncekiAcik ? `<button class="konu-kadar" type="button" data-konu-kadar="${x.no}" data-test="konu-kadar">1–${x.no} arası hepsi işlendi</button>` : ''}
    </div>`;
}
// Kapak: konunun sanatçısının en bilinen eseri; sanatçısı yoksa o derste işlenen resim (js/kurs.js)
function kitapKapagi(x, l) {
  const kp = x.kapak;
  if (kp && kp.dosya) {
    const g = { k: 'commons', d: kp.dosya };
    return `<img loading="lazy" decoding="async" alt="" src="${kacis(gorselUrl(g, 400))}" data-yedek="${kacis(gorselYedek(g))}">`;
  }
  const id = l.length ? l[0].id : kp && kp.sanatci;
  return id ? `<span data-kucuk="${kacis(id)}"></span>` : '';
}
function kursBolumleriHtml(bolumler, k) {
  const siradaki = (kurs().find((x) => !k.has(x.no)) || {}).no;
  const durum = (x) => (k.has(x.no) ? ' islendi' : x.no === siradaki ? ' sira' : '');
  // her konu bir tablo: kapağı konunun ilk sanatçısının en bilinen eseri; işlenmemişler soluk ve kilitli
  const kitap = (x, i) => {
    const l = konuSanatcilari(x.no);
    const isl = k.has(x.no);
    const isaret = isl ? ikon('dogru', 14, 2) : x.no === siradaki ? '' : ikon('kilit', 13, 1.8);
    return `<button type="button" class="kitap${durum(x)}${d.kursSecili === x.no ? ' secili' : ''}${l.length || x.kapak ? '' : ' bos'}" data-kurs-konu="${x.no}" style="--i:${i}" aria-label="Konu ${x.no}: ${kacis(konuBasligi(x))}${isl ? ', işlendi' : ''}" aria-pressed="${d.kursSecili === x.no}">
      <span class="kitap-resim" aria-hidden="true">${kitapKapagi(x, l)}</span>
      <span class="kitap-no">${x.no}</span>
      ${isaret ? `<span class="kitap-isaret" aria-hidden="true">${isaret}</span>` : ''}
      ${x.no === siradaki ? '<span class="kitap-sira-etiket">Sıradaki</span>' : ''}
      <span class="kitap-ad">${kacis(konuBasligi(x))}</span>
      ${l.length ? `<small class="kitap-alt">${l.length} sanatçı</small>` : '<small class="kitap-alt" aria-hidden="true"></small>'}
    </button>`;
  };
  // bölümler galeri salonları: her biri yatay kayan bir duvar; seçili konunun kartı o salonun altında
  const secili = kurs().find((x) => x.no === d.kursSecili);
  let i = 0;
  // İşaretle kipinde kitaba dokunmak konuyu doğrudan işlendi / işlenmedi yapar (kart açılmaz)
  const kip = (ad, deger, yazi) =>
    `<button type="button" class="kip-dugme${!!d.kursHizli === deger ? ' secili' : ''}" data-kurs-kip="${ad}" aria-pressed="${!!d.kursHizli === deger}">${yazi}</button>`;
  return `<div class="kurs-bolumleri"><div class="kurs-kip" role="group" aria-label="Kitaba dokununca" data-test="kurs-kip">${kip('bilgi', false, 'Dokununca bilgi')}${kip('isaretle', true, 'Dokununca işaretle')}</div>
    <div class="kitaplik${d.kitaplikDurgun ? ' durgun' : ''}${d.kursHizli ? ' hizli' : ''}">${bolumler
      .map((bl, bi) => {
        const bitti = bl.konular.filter((x) => k.has(x.no)).length;
        const y = Math.round((100 * bitti) / bl.konular.length);
        const kartBurada = secili && !d.kursHizli && bl.konular.includes(secili);
        return `<section class="salon-raf${bitti === bl.konular.length ? ' tam' : ''}" style="--b:${bi}" aria-label="Bölüm ${bolumNo(bl)}: ${kacis(bolumAdi(bl))}">
          <header class="salon-raf-bas">
            <span class="destek${bitti === bl.konular.length ? ' tam' : ''}"><b>${bolumNo(bl)}</b></span>
            <span class="salon-raf-yazi"><b>${kacis(bolumAdi(bl))}</b><small>${bitti}/${bl.konular.length} konu</small></span>
            <span class="salon-raf-halka" role="img" aria-label="%${y}" style="--y:${y}"><i>${y}</i></span>
          </header>
          <div class="kitap-serit" data-serit="${bi}">${bl.konular.map((x) => kitap(x, i++)).join('')}</div>
          ${kartBurada ? konuKarti(secili, k) : ''}
        </section>`;
      })
      .join('')}</div></div>`;
}

// Sayfanın parçaları: değişiklikte yalnızca ilgili parçalar yerinde değişir (sayfa baştan çizilmez)
function parcalar() {
  const k = islenen();
  const b = bugun();
  const acik = acikListe();
  const skorlar = d.ilerleme.skorlar;
  // akım doğrulukları: kronolojik ya da en zayıftan güçlüye; satıra dokununca o dönemin turu
  const akimlar = akimDurumlari(d.akimlar, d.sanatcilar, k)
    .filter((a) => a.acik)
    .map((a) => ({ a, ist: akimIstatistigi(a.ad, acik, skorlar, b), kayit: seviyeKaydi(d.ilerleme, a.ad) }));
  if (d.ilrSira === 'zayif') akimlar.sort((x, y) => (x.ist.oran ?? 2) - (y.ist.oran ?? 2));
  // İş 56: cevap verilmemiş akımlar kart olarak tek tek "henüz cevap yok" diye dizilmez (29 satır, ~2,5 ekran);
  // altta tek bölümde küçük haplar: dokununca o dönemin turu
  const cevapsizlar = akimlar.filter(({ ist }) => !ist.tp);
  const akimSatirlari = akimlar.filter(({ ist }) => ist.tp).map(({ a, ist, kayit }) => {
    const y = ist.oran === null ? null : Math.round(100 * ist.oran);
    const sv = SEVIYELER[kayit.s];
    const alt = [ist.tp ? `${ist.dg}/${ist.tp} doğru` : 'henüz cevap yok', `${ist.n} sanatçı`, ist.vade ? `${ist.vade} tekrar` : '', ist.kalici ? `${ist.kalici} kalıcı` : '']
      .filter(Boolean)
      .join(' · ');
    const tl = acik.filter((s) => s.akim === a.ad);
    const tm = tl.find((s) => s.kaynak === 'kurs') || tl[0];
    return `<li><a class="akim-kart" href="#/pekistir/donem/${encodeURIComponent(a.ad)}" style="--akim:${akimRenk(a.ad)}">
        <span class="akim-kart-resim" aria-hidden="true">${tm ? `<span data-kucuk="${kacis(tm.id)}" data-genislik="500"></span>` : ''}</span>
        <span class="akim-kart-ust">${akimNoktasi(a.ad)}<b>${kacis(a.ad)}</b><span class="seviye-etiket sv-${sv.anahtar}" data-test="seviye-ozet">${sv.ad}</span><span class="akim-kart-yuzde">${y === null ? '–' : `%${y}`}</span></span>
        <span class="cubuk akim-cubuk" role="img" aria-label="${y === null ? 'veri yok' : `%${y} doğru`}"><i style="width:${y ?? 0}%"></i></span>
        <span class="akim-kart-alt"><small>${alt}</small>${seviyeIziHtml(kayit)}</span>
      </a></li>`;
  });
  const siraDugme = (id, ad) => `<button type="button" data-ilr-sira="${id}" aria-pressed="${(d.ilrSira || 'kron') === id}">${ad}</button>`;
  const dagilim = kutuDagilimi(acik, skorlar);
  const hatalar = hatalarBilgisi();
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
  for (const konu of kurs()) {
    let bl = bolumler.find((x) => x.bolum === konu.bolum);
    if (!bl) bolumler.push((bl = { bolum: konu.bolum, ad: konu.bolum_ad, konular: [] }));
    bl.konular.push(konu);
  }
  const sayi = (no) => d.sanatcilar.filter((s) => s.konu === no).length;
  const vade = acikSanatcilar(d.sanatcilar, k).filter((s) => kategori(d.ilerleme.skorlar, s.id, 'karisik', b) === 0).length;
  const yuzde = Math.round((100 * islenmis(k)) / (kurs().length || 1));
  return {
    ozet: `<p class="ozet-satir ekran-disi" data-parca="ozet">${islenmis(k)} / ${kurs().length} konu işlendi · ${acikSanatcilar(d.sanatcilar, k).length} sanatçı açık · ${vade} tekrar bekliyor</p>`,
    pano: `<div class="ilr-govde" data-parca="pano" aria-label="Genel durum">
      <span class="etiket vurgu">Kursun neresindesin</span>
      <p class="ilr-buyuk"><b>${islenmis(k)}</b><span>/ ${kurs().length}<small>konu işlendi</small></span></p>
      <span class="ilr-cizgi" role="img" aria-label="%${yuzde} tamamlandı"><i style="--y:${yuzde}%"></i></span>
      <dl class="ilr-sayilar">
        <div><dt>Sanatçı</dt><dd>${acik.length}<small>/${d.sanatcilar.length}</small></dd></div>
        <div><dt>Kalıcı</dt><dd>${dagilim.kalici}<small>${acik.length ? ` %${Math.round((100 * dagilim.kalici) / acik.length)}` : ''}</small></dd></div>
        <div><dt>Tekrar</dt><dd>${vade}</dd></div>
      </dl>
      ${vade ? tabloDugme({ href: '#/pekistir/karisik', baslik: 'Tekrar bekliyor', alt: 'karışık turu başlat', sayi: vade, sinif: 'ilr-baslat', sanatciId: d.ilerleme.sonCalisilanlar?.[0] || '' }) : ''}
    </div>`,
    calisma: `<div data-parca="calisma">${takvimHtml(d.calismaGir)}${egriHtml(d.calismaGir)}${koleksiyonBagi()}</div>`,
    siradaki: `<div data-parca="siradaki">${siradakiKonuHtml(k, sayi)}</div>`,
    kurs: `<div data-parca="kurs">${kursBolumleriHtml(bolumler, k)}</div>`,
    tanis: `<div data-parca="tanis">${tanisKartiHtml()}</div>`,
    alt: `<div data-parca="alt">
    <div class="bolum-baslik baslik-sira"><h2 class="etiket">Akımlara göre doğruluk</h2>${
      akimSatirlari.length > 1 ? `<div class="secim-hap kucuk-hap" role="group" aria-label="Akımları sırala">${siraDugme('kron', 'Sırayla')}${siraDugme('zayif', 'Zayıf önce')}</div>` : ''
    }</div>
    ${akimSatirlari.length ? `<ul class="akim-kartlar">${akimSatirlari.join('')}</ul>` : ''}
    ${
      cevapsizlar.length
        ? `<div class="cevapsiz-akimlar" data-test="cevapsiz-akimlar"><p class="ikincil kucuk">${akimSatirlari.length ? `Henüz cevap vermediğin ${cevapsizlar.length} akım` : `${cevapsizlar.length} açık akımda henüz cevap yok`} · dokun, o dönemin turu başlasın</p><ul>${cevapsizlar
            .map(({ a }) => `<li><a href="#/pekistir/donem/${encodeURIComponent(a.ad)}" style="--akim:${akimRenk(a.ad)}">${akimNoktasi(a.ad)}${kacis(a.ad)}</a></li>`)
            .join('')}</ul></div>`
        : ''
    }
    ${!akimSatirlari.length && !cevapsizlar.length ? '<p class="ikincil">Henüz açık akım yok.</p>' : ''}
    ${karisanlarBolumu()}
    <h2 class="etiket bolum-baslik">En zayıf sanatçılar</h2>
    ${hatalar.idler.length ? `<a class="hatalar-satir zayif-cagri" href="#/pekistir/hatalar"><span class="hatalar-sayi" aria-hidden="true">${hatalar.idler.length}</span><span class="metin"><b>Hatalarım turu</b><span>son 7 günün yanlışları tek turda</span></span>${ikon('ileri', 20, 1.4)}</a>` : ''}
    ${
      zayiflar.length
        ? `<ul class="liste zayif-liste">${zayiflar
            .map(
              (x) =>
                `<li><a class="satir" href="#/sanatci/${encodeURIComponent(x.s.id)}"><span class="kucuk-kare" data-kucuk="${kacis(x.s.id)}"></span><span class="metin"><b>${kacis(x.s.ad)}</b><span>%${Math.round(100 * x.oran)} doğru · ${x.dg}/${x.tp}</span><span class="zayif-olcu"><span class="cubuk" role="img" aria-label="%${Math.round(100 * x.oran)} doğru"><i style="width:${Math.round(100 * x.oran)}%"></i></span>${kutuPipHtml(x.kutu)}</span></span>${ikon('ileri', 20, 1.4)}</a></li>`,
            )
            .join('')}</ul>`
        : '<p class="ikincil kucuk">Henüz zayıf sanatçı yok — biraz pekiştir.</p>'
    }</div>`,
  };
}

// Açık sanatçıların eserlerinden üç sütunlu, ters yönlere süzülen duvar (sonsuz döngü için her s��tun iki kez)
function eserDuvari() {
  const acik = acikListe();
  let l = acik.length ? acik.slice() : d.sanatcilar.slice(0, 9);
  l = [...l.filter((s) => s.kaynak === 'kurs'), ...l.filter((s) => s.kaynak !== 'kurs')].slice(0, 12);
  while (l.length && l.length < 9) l = l.concat(l).slice(0, 9);
  const sutunlar = [[], [], []];
  l.forEach((s, i) => sutunlar[i % 3].push(s));
  const kare = (s) => `<span class="duvar-kare"><span data-kucuk="${kacis(s.id)}"></span></span>`;
  return `<div class="duvar${acik.length ? '' : ' kilitli'}" aria-hidden="true">${sutunlar
    .map((c, i) => `<div class="duvar-sutun" style="--i:${i}"><div class="duvar-serit">${c.map(kare).join('')}${c.map(kare).join('')}</div></div>`)
    .join('')}</div>`;
}

export function ilerlemeSayfasi() {
  d.tanisKarti = null;
  d.kitaplikDurgun = false;
  d.kartDurgun = false;
  d.calismaGir = true; // takvim ve grafikler yalnızca sayfa ilk açılınca çizilerek gelir
  const p = parcalar();
  d.calismaGir = false;
  gununRengi();
  ciz(`<section class="ilr-sahne">
      ${eserDuvari()}
      <div class="pk-ust">${ust('İlerleme', '#/', {
        geriYok: true,
        ustEtiket: 'Kurs',
        sag: `<a class="ust-dugme" href="#/ayarlar" aria-label="Ayarlar">${ikon('ayarlar', 22, 1.4)}</a>`,
      })}</div>
      ${p.pano}
    </section>
    ${p.ozet}
    ${p.calisma}
    ${p.siradaki}
    <h2 class="etiket bolum-baslik">Kurs konuları</h2>
    <p class="kucuk ikincil" style="margin:-4px 0 10px">Bir konuya dokun, bitirdiysen “işlendi” yap; o konunun sanatçıları açılır.</p>
    ${p.kurs}
    ${p.alt}
    ${p.tanis}`);
  // kitaplar yalnızca sayfa ilk açılınca rafa dizilerek gelir; sonraki değişikliklerde yerinde durur
  d.kitaplikDurgun = true;
  // sıradaki konunun salonunda şerit o tabloya kayar
  const sira = ekran.querySelector('.kitap.sira');
  if (sira) sira.parentElement.scrollLeft = Math.max(0, sira.offsetLeft - sira.parentElement.offsetLeft - 16);
  kucukKareleriDoldur();
}

// Yerinde güncelleme: ad listesindeki parçalar yeniden yazılır, kaydırma yeri korunur
// kartAcildi: konu kartı yeni açıldıysa kayarak gelir; işaretlemeden sonra yerinde durur
function yenile(adlar = ['kurs'], kartAcildi = false) {
  d.kartDurgun = !kartAcildi;
  const p = parcalar();
  const kaydirma = window.scrollY;
  // salon şeritlerinin yatay konumu yeniden çizimde korunur
  const seritler = new Map([...ekran.querySelectorAll('[data-serit]')].map((s) => [s.dataset.serit, s.scrollLeft]));
  for (const ad of adlar) {
    const el = ekran.querySelector(`[data-parca="${ad}"]`);
    if (el) el.outerHTML = p[ad];
  }
  for (const s of ekran.querySelectorAll('[data-serit]')) if (seritler.has(s.dataset.serit)) s.scrollLeft = seritler.get(s.dataset.serit);
  window.scrollTo(0, kaydirma);
  if (adlar.some((a) => a === 'alt' || a === 'tanis' || a === 'kurs' || a === 'siradaki')) kucukKareleriDoldur();
}
const HEPSI = ['ozet', 'pano', 'calisma', 'siradaki', 'kurs', 'alt', 'tanis'];

// Ö6 · Konu işlenince alttan kart: "4 yeni sanatçı açıldı · Tanış" → #/pekistir/konu/<no>
function tanisKartiHtml() {
  const t = d.tanisKarti;
  if (!t) return '';
  const l = t.idler.map((id) => d.harita.get(id)).filter(Boolean);
  if (!l.length) return '';
  // yalnızca ilk çizimde alttan kayarak gelir; yerinde güncellemelerde durur
  const gir = t.anahtar !== d.tanisCizilen;
  d.tanisCizilen = t.anahtar;
  return `<aside class="tanis-karti${gir ? ' gir' : ''}" data-test="tanis-karti" aria-label="Yeni açılan sanatçılar">
      <div class="tanis-kareler" aria-hidden="true">${l
        .slice(0, 4)
        .map((s) => `<span class="kucuk-kare" data-kucuk="${kacis(s.id)}"></span>`)
        .join('')}</div>
      <div class="tanis-yazi"><b>${l.length} yeni sanatçı açıldı</b><span>Konu ${t.no} · ${kacis(l.map((s) => bilinenAd(s.ad, d.kisaAdlar[s.id])).join(', '))}</span></div>
      <a class="dugme tanis-dugme" href="#/pekistir/konu/${t.no}" data-test="tanis-dugme">Tanış</a>
      <button class="tanis-kapat" type="button" data-tanis-kapat aria-label="Kapat">${ikon('kapat', 18, 1.7)}</button>
    </aside>`;
}

// Tek konu işlendiyse ve yeni sanatçı açıldıysa kart (bildirim yerine)
function tanisKartiAc(no, yeni) {
  d.tanisKarti = yeni.length ? { no, idler: yeni.map((s) => s.id), anahtar: Date.now() } : null;
}

// Konuları işlendi / işlenmedi yapar; yeni açılan sanatçıları bildirir
function konuIsaretle(nolar, islendi, { kartla = false } = {}) {
  const once = d.ilerleme.islenen.slice();
  const s = new Set(once);
  for (const no of [].concat(nolar)) islendi ? s.add(no) : s.delete(no);
  d.ilerleme.islenen = [...s].sort((a, b) => a - b);
  kaydet();
  d.oturum = null;
  const yeni = yeniAcilanlar(d.sanatcilar, once, d.ilerleme.islenen);
  if (kartla) tanisKartiAc(nolar, islendi ? yeni : []);
  if (kartla && islendi && yeni.length) return yeni;
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
    konuIsaretle(no, kutu.checked, { kartla: true });
    yenile(HEPSI);
    odakla(`[data-konu="${no}"]`);
  });

  ekran.addEventListener('click', (e) => {
    if (e.target.closest('[data-tanis-kapat]')) {
      d.tanisKarti = null;
      yenile(['tanis']);
      return;
    }
    const is = e.target.closest('[data-ilr-sira]');
    if (is) {
      d.ilrSira = is.dataset.ilrSira;
      yenile(['alt']);
      odakla(`[data-ilr-sira="${is.dataset.ilrSira}"]`);
      return;
    }
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
      d.tanisKarti = null;
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
      konuIsaretle(no, !islenen().has(no), { kartla: true });
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
    if (!b || b.classList.contains('doldu')) return;
    const no = Number(b.dataset.konuIsle);
    const isle = () => {
      konuIsaretle(no, true, { kartla: true });
      d.siradakiGecti = true; // yeni sıradaki konu kayarak gelir
      yenile(HEPSI);
      d.siradakiGecti = false;
      odakla('[data-konu-isle]');
    };
    // düğme önce soldan sağa dolar ve "İşlendi" olur, sonra sıradaki konu gelir (hareket azaltma açıksa beklemeden)
    if (!b.classList.contains('isle-ince') || matchMedia('(prefers-reduced-motion: reduce)').matches) return isle();
    b.classList.add('doldu');
    b.querySelector('.isle-yazi').textContent = 'İşlendi';
    setTimeout(() => {
      if (b.isConnected) isle();
    }, 520);
  });
}
