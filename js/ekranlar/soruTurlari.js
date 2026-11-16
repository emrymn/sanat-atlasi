// İş 105: Bölüm turu ("Bu eser hangi bölümde?") ve Konu turu ("Bu eserin konusu ne?") ekranları.
// Mantık js/soruTurlari.js'de. Sanatçı turlarının (pekistir.js) karmaşık oturumuna dokunmamak için sade, ayrı bir
// akış: aynı Leitner kutuları (cevapla), aynı "yanlışsa 3–5 kart sonra yine" kuyruğu (Oturum) ve aynı görünüm sınıfları.
import { kacis, yillarYaz, karistir } from '../yardimci.js';
import { cevapla } from '../leitner.js';
import { Oturum } from '../oturum.js';
import { sanatciEserleri, eserSec } from '../eserler.js';
import { gorselUrl, gorselYedek, secilenGorsel } from '../gorsel.js';
import { gecmisEkle } from '../gecmis.js';
import { ikon, pgDisk } from '../tasarim.js';
import { titret, tik } from '../titresim.js';
import { TUR_AD } from '../ikonografi.js';
import { d, ciz, ust, etiket, ekran, HARFLER, BILMIYORUM, eserAdi, kotuler, kaydet, bugun, acikListe, cizimNo, guncelMi, kaynakSatiri, paletHtml, ekranRengi, renkSabitle, yaprakDugmeYazisi, yaprakAyrinti } from './ortak.js';
import { bildirimSatiriHtml, bildirimTikla } from './bildirim.js';
import { ikonografiVeri, karsilastirSecimi } from './gozat.js';
import {
  kursBolumleri,
  sanatciBolumu,
  bolumSecenekleri,
  yuzyilAraligi,
  konuSecenekleri,
  turSirasi,
  bolumKisaAdi,
  konuEserleri,
  anahtarlaEser,
} from '../soruTurlari.js';

const TUR = {
  bolum: { rota: '#/pekistir/bolum', baslik: 'Bölüm turu', soru: 'Bu eser hangi bölümde?' },
  ikonografi: { rota: '#/pekistir/ikonografi', baslik: 'Konu turu', soru: 'Bu eserin konusu ne?' },
};

let st = null; // { kip, oturum, kart, say: { dogru, toplam }, bolumler, konular }

const bolumler = () => kursBolumleri(d.konular, d.konularTr);
const bolumSkoru = (id) => d.ilerleme.skorlar[id]?.bolumKart;
const konuSkoru = (id) => (d.ilerleme.skorlarKonu || {})[id];

// Bölüm turunun adayları: açık ve bir kurs bölümüne bağlı sanatçılar
function bolumAdaylari(bl) {
  return acikListe()
    .filter((s) => sanatciBolumu(s, bl))
    .map((s) => s.id);
}
// Konu turunun adayları: açık bir sanatçının eseri olan konular
function konuAdaylari(konular) {
  const acik = new Set(acikListe().map((s) => s.id));
  return konular.filter((k) => konuEserleri(k, acik).length).map((k) => k.id);
}

// Menüdeki iki satır (Pekiştir): kart sayısıyla
// İş 171 (Tasarım B): "Başka turlar" 2×2 ızgara. hatalar: Hatalarım karosu (varsa; js/ekranlar/pekistir.js verir)
export function soruTurlariHtml(hatalar = '') {
  const adet = d.ilerleme.ayarlar.gunlukKart;
  const nb = Math.min(adet, bolumAdaylari(bolumler()).length);
  if (!nb) return hatalar;
  const satir = (href, test, sayi, baslik, alt) =>
    `<a class="hatalar-satir" href="${href}" data-test="${test}"><span class="hatalar-sayi" aria-hidden="true">${sayi}</span><span class="metin"><b>${baslik}</b><span>${alt}</span></span>${ikon('ileri', 20, 1.4)}</a>`;
  // 1.76.3: Karşılaştır Galeri'den buraya taşındı (en çok karıştırılan ikili, yoksa açık ilk iki akım)
  const kars = karsilastirSecimi();
  return `<section class="bolum pk-ek-turlar" data-test="ek-turlar">
      <div class="pk-bolum-bas"><h2 class="pk-baslik">Başka turlar</h2></div>
      <div class="tur-izgara">
      ${hatalar}
      <a class="hatalar-satir" href="#/pekistir/donem" data-salonlara data-test="donem-turu"><span class="hatalar-sayi" aria-hidden="true">${ikon('sekme-harita', 18, 1.6)}</span><span class="metin"><b>Döneme göre</b><span>Salon salon çalış</span></span></a>
      ${satir(TUR.bolum.rota, 'bolum-turu', nb, 'Bölüm turu', 'Hangi bölümde?')}
      ${satir(TUR.ikonografi.rota, 'konu-turu', ikon('kitap', 18, 1.6), 'Konu turu', 'İncil, mitoloji, tarih')}
      ${kars ? satir(kars.href, 'gz-karsilastir', ikon('karsilastir', 18, 1.6), 'Karşılaştır', kars.alt) : ''}
      </div>
    </section>`;
}

async function kur(kip) {
  const no = cizimNo();
  ciz(`${ust(TUR[kip].baslik, '#/pekistir', { ustEtiket: 'Pekiştir' })}<p class="ikincil">Kartlar hazırlanıyor…</p>`);
  const adet = d.ilerleme.ayarlar.gunlukKart;
  const b = bugun();
  let kartlar;
  let konular = [];
  const bl = bolumler();
  if (kip === 'bolum') kartlar = turSirasi(bolumAdaylari(bl), bolumSkoru, { bugun: b, adet, rng: d.rng });
  else {
    konular = (await ikonografiVeri()) || [];
    kartlar = turSirasi(konuAdaylari(konular), konuSkoru, { bugun: b, adet, rng: d.rng });
  }
  if (!guncelMi(no)) return null;
  return { kip, oturum: new Oturum(kartlar, { rng: d.rng }), kart: null, say: { dogru: 0, toplam: 0 }, bolumler: bl, konular, ilk: new Set() };
}

// Bir kartın verisi: { anahtar, s (sanatçı), eser, eserler, dogru, secenekler, konu? }
async function kartHazirla(t, anahtar) {
  if (t.kip === 'bolum') {
    const s = d.harita.get(anahtar);
    const b = s && sanatciBolumu(s, t.bolumler);
    if (!b) return null;
    const eserler = await sanatciEserleri(s).catch(() => []);
    const eser = eserSec(eserler, d.ilerleme.sonEserler[s.id] || [], d.rng, kotuler());
    if (!eser) return null;
    d.ilerleme.sonEserler[s.id] = [...(d.ilerleme.sonEserler[s.id] || []).filter((x) => x !== eser.anahtar), eser.anahtar].slice(-8);
    return { anahtar, s, eser, eserler, bolum: b, dogru: b.id, secenekler: bolumSecenekleri(b.id, t.bolumler, d.rng), cevap: null };
  }
  const konu = t.konular.find((k) => k.id === anahtar);
  if (!konu) return null;
  const acik = new Set(acikListe().map((x) => x.id));
  // konunun eserlerinden görseli olan ilki (en çok 4 sanatçı denenir: çevrimdışıyken her biri bekletebilir)
  for (const [ea, sid] of karistir(konuEserleri(konu, acik), d.rng).slice(0, 4)) {
    const s = d.harita.get(sid);
    const eserler = await sanatciEserleri(s).catch(() => []);
    const eser = anahtarlaEser(eserler, ea, sid);
    if (eser && eser.pekistirme !== false && secilenGorsel(eser, kotuler()))
      return { anahtar, s, eser, eserler, konu, dogru: konu.id, secenekler: konuSecenekleri(konu, t.konular, d.rng), cevap: null };
  }
  return null;
}

// Görseli olmayan kartları atlayarak sıradaki kartı hazırlar; tur bittiyse null
async function siradaki(t) {
  while (!t.oturum.bitti) {
    const k = await kartHazirla(t, t.oturum.simdiki.id);
    if (k) return k;
    t.oturum.kuyruk.splice(t.oturum.konum, 1); // eseri bulunamayan kart turdan çıkar
  }
  return null;
}

export async function soruTuru(kip) {
  if (!st || st.kip !== kip || st.oturum.bitti) {
    const t = await kur(kip);
    if (!t) return;
    st = t;
  }
  if (!st.kart) {
    const no = cizimNo();
    const k = await siradaki(st);
    if (!guncelMi(no)) return;
    if (!k) return st.oturum.toplam ? ozet() : bos();
    st.kart = k;
  }
  cizKart();
}

function bos() {
  const kip = st.kip;
  st = null;
  ciz(
    `${ust(TUR[kip].baslik, '#/pekistir', { ustEtiket: 'Pekiştir' })}<div class="sade-soru" data-test="kart-yok"><p class="sade-soru-baslik">Bu tur için şu an kart yok.</p><p class="kucuk ikincil">${
      kip === 'bolum' ? 'Açık sanatçıların görselleri bulunamadı.' : 'Açık sanatçıların eserlerinde konusu bilinen bir resim yok; yeni konular işlendikçe gelir.'
    }</p><p><a class="dugme" href="#/pekistir">Atölye’ye dön</a></p></div>`,
  );
}

function secenekAdi(t, deger) {
  if (t.kip === 'bolum') {
    const b = t.bolumler.find((x) => x.id === deger);
    return b ? `${b.id} · ${bolumKisaAdi(b)}` : deger;
  }
  const k = t.konular.find((x) => x.id === deger);
  return k ? k.ad : deger;
}

function cizKart() {
  const t = st;
  const k = t.kart;
  const ot = t.oturum;
  const sira = Math.min(ot.konum + 1, ot.toplam);
  const yuzde = Math.round((100 * ot.konum) / ot.toplam);
  const cevaplandi = k.cevap !== null;
  const kalsin = (v) => !cevaplandi || v === k.dogru || v === k.cevap;
  const dugmeler = k.secenekler
    .map((v, i) => {
      if (!kalsin(v)) return '';
      let sinif = 'secenek';
      let isaret = '';
      if (cevaplandi) {
        if (v === k.dogru) {
          sinif += ' dogru';
          isaret = `<span role="img" aria-label="Doğru cevap">${ikon('dogru', 20, 2)}</span>`;
        } else if (v === k.cevap) {
          sinif += ' yanlis';
          isaret = `<span role="img" aria-label="Senin cevabın, yanlış">${ikon('yanlis', 20, 2)}</span>`;
        }
      }
      return `<button class="${sinif}" type="button" data-st-secim="${kacis(v)}" ${cevaplandi ? 'disabled' : ''}>${cevaplandi ? '' : tik(d.ilerleme.ayarlar.titresim !== false)}<span class="harf">${HARFLER[i]}</span><span class="ad">${kacis(secenekAdi(t, v))}</span>${isaret}</button>`;
    })
    .join('');
  const g = secilenGorsel(k.eser, kotuler()) || k.eser.gorseller[0];
  const yedek = gorselYedek(g);
  ciz(
    `<header class="soru-ust">
      <button class="kapat" type="button" data-geri="#/pekistir" aria-label="Kapat">${ikon('kapat', 22, 1.7)}</button>
      <span class="etiket">${kacis(TUR[t.kip].baslik)}</span>
      <span data-test="sayac">${sira} / ${ot.toplam}</span>
    </header>
    <div class="ince-cubuk" aria-hidden="true"><i style="width:${yuzde}%;--onceki:${yuzde}%"></i></div>
    <div class="soru-sahne">
      <div class="soru-resim">
        <img decoding="async" alt="Sorulan eser" src="${kacis(gorselUrl(g, 800))}"${yedek ? ` data-yedek="${kacis(yedek)}"` : ''} data-test="soru-resim">
      </div>
    </div>
    <div class="soru-baslik st-baslik">
      ${etiket(t.kip === 'bolum' ? 'Kursun bölümleri' : 'Resmin konusu')}
      <h2 tabindex="-1">${TUR[t.kip].soru}</h2>
    </div>
    <div class="secenekler${cevaplandi ? ' daralmis' : ''}" data-test="st-secenekler">${dugmeler}</div>
    ${cevaplandi ? '' : `<button class="bilmiyorum" type="button" data-st-secim="${BILMIYORUM}" data-test="bilmiyorum">${tik(d.ilerleme.ayarlar.titresim !== false)}Bilmiyorum</button>`}
    ${cevaplandi ? yaprak(t, k) : ''}`,
    cevaplandi ? 'cevap' : 'yeni-kart',
  );
  // Renk: sorulan eserden (ana Pekiştir gibi); palet gelince yapraktaki şerit de dolar
  if (k.palet === undefined)
    ekranRengi(k.eser, null, (p) => {
      k.palet = p;
      const kutu = ekran.querySelector('[data-yaprak-palet]');
      if (kutu) kutu.innerHTML = paletHtml(p);
    });
  else renkSabitle(k.palet);
  ipucuIsaretle();
  const y = ekran.querySelector('.alt-yaprak [data-st-sonraki]');
  if (y) y.focus({ preventScroll: true });
}

function yaprak(t, k) {
  const dogru = k.cevap === k.dogru;
  const tekrarNotu = 'bu kart 3–5 kart sonra yine gelecek';
  const sonuc = dogru ? ['Doğru', ''] : k.cevap === BILMIYORUM ? ['Bilmiyorum', tekrarNotu] : ['Yanlış', tekrarNotu];
  const eserSatiri = `${k.s.ad} (${yillarYaz(k.s)}) · ${eserAdi(k.eser)}`;
  let bilgi;
  let not = '';
  let ek = '';
  let bag = '';
  if (t.kip === 'bolum') {
    const aralik = yuzyilAraligi(k.bolum, d.sanatcilar);
    bilgi = `<p class="bilgi" data-test="st-bilgi"><b>${kacis(`${k.bolum.id} · ${k.bolum.ad}`)}</b><i>${kacis(aralik ? `${aralik} · ${eserSatiri}` : eserSatiri)}</i></p>`;
    not = `${k.s.ad} kursta ${k.s.konu}. konuda işleniyor (${k.s.akim}).`;
  } else {
    const konu = k.konu;
    bilgi = `<p class="bilgi" data-test="st-bilgi"><b>${kacis(konu.ad)}</b><i>${kacis(`${TUR_AD[konu.tur] || ''} · ${eserSatiri}`)}</i></p>`;
    not = konu.ozet || '';
    ek = konu.hikaye.length
      ? `<details class="st-hikaye" data-test="st-hikaye"><summary class="karsilastir-bag">${ikon('kitap', 18, 1.6)}<span>Hikâyesi</span>${ikon('asagi', 16, 1.8)}</summary><div class="st-hikaye-metin">${konu.hikaye.map((p) => `<p>${kacis(p)}</p>`).join('')}</div></details>`
      : '';
    bag = `<a class="karsilastir-bag" href="#/konu/${encodeURIComponent(konu.id)}" data-test="st-konu-bag">${ikon('ileri', 18, 1.6)}<span>Konu sayfası: ${kacis(konu.ad)}</span></a>`;
  }
  const son = st.oturum.konum + 1 >= st.oturum.toplam;
  // Ana Pekiştir yaprağıyla aynı düzen (pekistir.js): sonuç, bilgi, tablonun paleti, açılır ipucu, kaynak ve "hatalı mı?",
  // bağlantı satırları, altta iki düğme (Sanatçı · Sonraki kart)
  return `<section class="alt-yaprak" aria-live="polite">
      <p class="sonuc" data-test="sonuc" data-dogru="${dogru}">${ikon(dogru ? 'dogru' : 'yanlis', 18, 2)}<b>${sonuc[0]}</b>${sonuc[1] ? `<span class="sonuc-not">${kacis(sonuc[1])}</span>` : ''}</p>
      ${bilgi}
      ${not ? `<div class="ipucu-kutu" data-ipucu><p class="ipucu">${kacis(not)}</p></div>` : ''}
      ${ek}
      ${bag}
      ${yaprakAyrinti(`<div data-yaprak-palet>${paletHtml(k.palet)}</div>${bildirimSatiriHtml(kaynakSatiri(k.eser, secilenGorsel(k.eser, kotuler())))}`)}
      <div class="yaprak-dugmeler"><a class="dugme" href="#/sanatci/${encodeURIComponent(k.s.id)}" aria-label="Sanatçı sayfası">${pgDisk('portre', 'umbra')}Sanatçı</a><button class="dugme acik" type="button" data-st-sonraki data-test="st-sonraki">${yaprakDugmeYazisi(son ? 'Turu bitir' : 'Sonraki kart')}</button></div>
    </section>`;
}

// İpucu sığmıyorsa dokununca tamamı açılır (pekistir.js ipucuIsaretle ile aynı; açıp kapatmayı oradaki dinleyici yapar)
function ipucuIsaretle() {
  const p = ekran.querySelector('.alt-yaprak [data-ipucu]');
  if (!p) return;
  const metin = p.querySelector('.ipucu');
  const kesik = metin.scrollHeight > metin.clientHeight + 2;
  p.classList.toggle('kesik', kesik);
  if (kesik) {
    p.setAttribute('role', 'button');
    p.tabIndex = 0;
    p.setAttribute('aria-expanded', 'false');
  }
}

function cevapVer(deger) {
  const t = st;
  const k = t.kart;
  if (!k || k.cevap !== null) return;
  k.cevap = deger;
  const dogru = deger === k.dogru;
  titret(dogru ? 'dogru' : 'yanlis', d.ilerleme.ayarlar.titresim !== false); // İş 106
  const b = bugun();
  if (t.kip === 'bolum') {
    const s = (d.ilerleme.skorlar[k.anahtar] ||= {});
    s.bolumKart = cevapla(s.bolumKart, dogru, b);
  } else {
    const sk = (d.ilerleme.skorlarKonu ||= {});
    sk[k.anahtar] = cevapla(sk[k.anahtar], dogru, b);
  }
  // turun sonucu: her kartın ilk cevabı sayılır (tekrar gelen yanlışlar sayılmaz)
  if (!t.ilk.has(k.anahtar)) {
    t.ilk.add(k.anahtar);
    t.say.toplam++;
    if (dogru) t.say.dogru++;
  }
  gecmisEkle(d.ilerleme, b, { dogru, akim: k.s && k.s.akim });
  kaydet();
  t.oturum.isle(dogru);
  cizKart();
}

async function sonraki() {
  st.oturum.ilerle();
  st.kart = null;
  if (st.oturum.bitti) return ozet();
  await soruTuru(st.kip);
}

function ozet() {
  const t = st;
  const { dogru, toplam } = t.say;
  ciz(
    `${ust(TUR[t.kip].baslik, '#/pekistir', { ustEtiket: 'Pekiştir' })}
    <section class="sade-soru" data-test="st-ozet">
      <p class="sade-soru-baslik">Tur bitti</p>
      <p data-test="st-sonuc"><b>${dogru} / ${toplam}</b> doğru</p>
      <p class="kucuk ikincil">Yanlış bildiklerin bir sonraki turda önce gelecek.</p>
      <p><button class="dugme acik" type="button" data-st-yeni data-test="st-yeni">Yeni tur</button> <a class="dugme" href="#/pekistir">Atölye’ye dön</a></p>
    </section>`,
  );
}

ekran.addEventListener('click', (e) => {
  if (!st || location.hash !== TUR[st.kip].rota) return;
  if (st.kart && st.kart.cevap !== null && bildirimTikla(e, st.kart.eser)) return;
  const sec = e.target.closest('[data-st-secim]');
  if (sec) return cevapVer(sec.dataset.stSecim);
  if (e.target.closest('[data-st-sonraki]')) return void sonraki();
  if (e.target.closest('[data-st-yeni]')) {
    const kip = st.kip;
    st = null;
    return void soruTuru(kip);
  }
});
