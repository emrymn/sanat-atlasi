// Başyapıt sayfası (#/basyapit/<anahtar>, İş 188): tek akış. Tablo kapakta; yakın okuma bölümleri hikâye gibi akar,
// rehberli inceleme ayrıntıları metnin anlattığı yerde kırpım olarak araya girer (dokununca görüntüleyici o ayrıntıda
// açılır), ders (Orta) "Daha derine in" ile aynı sayfada açılır; sözlük terimleri metinde, künye ve sıradaki eser sonda.
// Saf mantık: js/basyapitSayfa.js. Bkz. KARARLAR.md "İş 188".
import { kacis } from '../yardimci.js';
import { sanatciEserleri } from '../eserler.js';
import { gorselUrl, gorselYedek, secilenGorsel, gorselOrani } from '../gorsel.js';
import { goruntuleyiciAc } from '../goruntuleyici.js';
import { ikon } from '../tasarim.js';
import { basyapitBul, eserEslestir } from '../basyapit.js';
import { ayrintiBul, eserinAyrintisi } from '../ayrinti.js';
import { hikayeHtml } from '../hikaye.js';
import { bolgeBul } from '../harita.js';
import { dersGorunurMu, dersKlasoru, dersYolu, mdHtml, temizle } from '../eserDersi.js';
import { noktalariYerlestir, kirpim, sozlukAl, kunyeSatirlari, karsilastirmalariAl, terimIsaretle, dersBolumleri, okumaDakikasi } from '../basyapitSayfa.js';
import { d, ekran, jsonGetir, ciz, cizimNo, guncelMi, hataGoster, geriDugmesi, akimRenk, ekranRengi, kotuler, gorselTercihi, notuIcin, hikayeVeri, hikayeBulucu, odakliGorsel } from './ortak.js';
import { basyapitVeri, basyapitAdresi, ayrintiVeri } from './gozat.js';
import { dersYayini, dersinDurumu } from './eserDersi.js';

const BUYUK_KUTU = 8 / 5; // metnin arasına giren tek ayrıntı
const KUCUK_KUTU = 4 / 3; // yana kayan şeritteki ayrıntılar

async function metinGetir(yol) {
  const y = await fetch(yol);
  if (!y.ok) throw new Error(`${yol}: ${y.status}`);
  return y.text();
}

const kirpResmi = (n, oran, kutu, src, yedek, secenek) => {
  const k = kirpim(n, oran, kutu, secenek);
  return `<img alt="" decoding="async" loading="lazy" src="${kacis(src)}" data-yedek="${kacis(yedek)}" style="width:${k.w}%;height:${k.h}%;left:${k.l}%;top:${k.t}%">`;
};

// Bir bölümün ayrıntıları: tek ayrıntı büyük kırpım ve açıklamasıyla, birden çoğu yana kayan şeritte
function ayrintiHtml(sira, noktalar, oran, src, yedek) {
  if (!sira.length) return '';
  if (sira.length === 1) {
    const i = sira[0];
    const n = noktalar[i];
    return `<figure class="bsy-ayrinti"><button type="button" class="bsy-kirp" data-bsy-nokta="${i}" data-test="bsy-ayrinti" aria-label="${kacis(n.ad)}: yakından bak">${kirpResmi(n, oran, BUYUK_KUTU, src, yedek, { pay: 1.8, enCok: 3.2 })}<span class="bsy-kirp-im" aria-hidden="true">${ikon('buyut', 16, 1.8)}</span></button><figcaption><b>${kacis(n.ad)}</b><span data-bsy-terimli>${kacis(n.metin)}</span></figcaption></figure>`;
  }
  return `<div class="bsy-serit" data-test="bsy-serit">${sira
    .map((i) => {
      const n = noktalar[i];
      return `<button type="button" class="bsy-kirp-kucuk" data-bsy-nokta="${i}" data-test="bsy-ayrinti" aria-label="${kacis(n.ad)}: yakından bak"><span class="bsy-kirp">${kirpResmi(n, oran, KUCUK_KUTU, src, yedek, { pay: 1.4 })}</span><b>${kacis(n.ad)}</b></button>`;
    })
    .join('')}</div>`;
}

const kunyeHtml = (satirlar) => (satirlar.length ? `<h3>Künye</h3><dl class="bsy-liste">${satirlar.map((x) => `<div><dt>${kacis(x.ad)}</dt><dd>${kacis(x.deger)}</dd></div>`).join('')}</dl>` : '');

// Yan yana karşılaştırma: iki eser üst üste, altta gerekçe. Görüntüleyici gibi gövdeye eklenir (sekme çubuğunun üstünde).
function yanYanaAc({ bu, oteki, k, adres }) {
  const onceOdak = document.activeElement;
  const kok = document.createElement('div');
  kok.className = 'bsy-yan';
  kok.setAttribute('role', 'dialog');
  kok.setAttribute('aria-modal', 'true');
  kok.setAttribute('aria-label', 'Yan yana karşılaştır');
  kok.dataset.test = 'bsy-yan';
  const resim = (x) => `<div class="bsy-yan-resim"><img decoding="async" alt="${kacis(x.alt)}" src="${kacis(x.src)}" data-yedek="${kacis(x.yedek)}"><span class="bsy-yan-ad">${kacis(x.ad)}</span></div>`;
  kok.innerHTML = `${resim(bu)}${resim(oteki)}
    <button type="button" class="bsy-cam bsy-yan-kapat" data-bsy-yan-kapat aria-label="Kapat">${ikon('kapat', 20, 1.8)}</button>
    <div class="bsy-yan-kart"><span class="etiket vurgu">${kacis(k.sanatci)}</span><h2>${kacis(k.eser)}</h2><p>${kacis(k.gerekce)}</p>
      <a class="bsy-dugme" href="${adres}" data-bsy-yan-kapat>Eserin sayfası${ikon('ileri', 18, 1.8)}</a></div>`;
  const kapat = () => {
    window.removeEventListener('hashchange', kapat);
    document.removeEventListener('keydown', tus);
    kok.remove();
    if (onceOdak && onceOdak.isConnected) onceOdak.focus({ preventScroll: true });
  };
  const tus = (o) => {
    if (o.key === 'Escape') kapat();
  };
  kok.addEventListener('click', (o) => {
    if (o.target.closest('[data-bsy-yan-kapat]')) kapat();
  });
  window.addEventListener('hashchange', kapat);
  document.addEventListener('keydown', tus);
  document.body.append(kok);
  kok.querySelector('.bsy-yan-kapat').focus({ preventScroll: true });
}

export async function basyapitSayfasi(kodlu, { derin = false } = {}) {
  const anahtar = decodeURIComponent(kodlu);
  const no = cizimNo();
  const liste = await basyapitVeri();
  if (!guncelMi(no)) return;
  const b = basyapitBul(liste, anahtar);
  if (!b) return hataGoster(new Error('Bu eser için yakın okuma bulunamadı.'));
  const s = d.harita.get(b.sanatci);
  const eserBul = (kayit) => sanatciEserleri(d.harita.get(kayit.sanatci)).then((l) => eserEslestir(l, kayit));
  const eserSozu = eserBul(b);
  const ayrintiSoz = ayrintiVeri();
  ekranRengi(eserSozu, akimRenk(s.akim));
  const donem = bolgeBul(d.akimSira[s.akim] ?? 0).id;
  const sonraki = liste.length > 1 ? liste[(liste.indexOf(b) + 1) % liste.length] : null;
  const sonrakiSanatci = sonraki && d.harita.get(sonraki.sanatci);
  const kunyeAlt = [s.ad, b.tarih, b.muze].filter(Boolean);
  const bolumYeri = (i) => `<div data-bsy-yer="${i}"></div>`;

  ciz(`<div data-bsy-kok><div class="hale bsy-hale" aria-hidden="true"></div><div class="bsy-desen" data-donem="${donem}" aria-hidden="true"></div>
    <article class="bsy" data-test="basyapit">
      <div class="bsy-kapak" data-basyapit-gorsel>
        <div class="bsy-kapak-ust">${geriDugmesi('#/basyapitlar')}</div>
        <p class="bsy-kapak-bos ikincil kucuk">Görsel yükleniyor…</p>
      </div>
      <header class="bsy-bas">
        <a class="etiket vurgu bsy-akim" href="#/akim/${encodeURIComponent(s.akim)}">${kacis(s.akim)}</a>
        <h1 class="bsy-ad" tabindex="-1">${kacis(b.baslik)}</h1>
        <p class="bsy-meta"><a href="#/sanatci/${encodeURIComponent(s.id)}">${kacis(s.ad)}</a>${b.tarih ? ` · ${kacis(b.tarih)}` : ''}${b.muze ? ` · ${kacis(b.muze)}` : ''}</p>
        ${b.ozgun && !b.baslik.includes(b.ozgun) ? `<p class="bsy-ozgun">${kacis(b.ozgun)}</p>` : ''}
        ${b.ozet ? `<p class="bsy-giris">${kacis(b.ozet)}</p>` : ''}
      </header>
      <div class="bsy-akis" data-bsy-akis>
        ${b.bolumler.length ? b.bolumler.map((x, i) => `<section class="bsy-bolum"><h2>${kacis(x.baslik)}</h2><p class="bsy-metin" data-bsy-terimli>${kacis(x.metin)}</p>${bolumYeri(i)}</section>`).join('') : bolumYeri(0)}
        ${b.bak.length ? `<section class="bsy-bolum" data-bsy-bak hidden><h2>Yakından bak</h2><ol class="bsy-metin bsy-bak">${b.bak.map((x) => `<li>${kacis(x)}</li>`).join('')}</ol></section>` : ''}
      </div>
      <div data-bsy-derin></div>
      <section class="bsy-son" data-bsy-kunye>${kunyeHtml(kunyeSatirlari(b, null))}</section>
      <section class="bsy-son" data-bsy-sozluk hidden></section>
      ${
        sonraki
          ? `<section class="bsy-son"><h3>Sıradaki</h3><a class="bsy-siradaki" href="${basyapitAdresi(sonraki.anahtar)}" data-test="bsy-siradaki"><span class="bsy-siradaki-resim" data-bsy-sira-resim></span><span class="bsy-siradaki-yazi"><small>${kacis([sonrakiSanatci && sonrakiSanatci.ad, sonraki.tarih].filter(Boolean).join(' · '))}</small><b>${kacis(sonraki.baslik)}</b></span></a></section>`
          : ''
      }
      <p class="bsy-not">Metni Claude yazdı, ikinci bir istekte olgu ve dil açısından denetledi. Yine de hata görürsen not al.</p>
    </article>
    <div class="bsy-cubuk" data-bsy-cubuk inert><button type="button" class="bsy-cubuk-dugme" data-bsy-geri aria-label="Geri">${ikon('geri', 22, 1.8)}</button><b>${kacis(b.baslik)}</b><button type="button" class="bsy-cubuk-dugme" data-bsy-basa aria-label="Başa dön"><span data-bsy-cubuk-resim></span></button></div>
    <div class="bsy-sozcuk" data-bsy-sozcuk role="dialog" aria-label="Sözlük" hidden><div><span class="etiket vurgu">Sözlük</span><b data-bsy-sozcuk-ad></b><p data-bsy-sozcuk-tanim></p></div><button type="button" class="bsy-sozcuk-kapat" data-bsy-sozcuk-kapat aria-label="Kapat">${ikon('kapat', 18, 1.8)}</button></div></div>`);

  const sayfa = ekran.querySelector('[data-bsy-kok]');
  const kok = sayfa.querySelector('.bsy');
  const cubuk = sayfa.querySelector('[data-bsy-cubuk]');
  const sozcuk = sayfa.querySelector('[data-bsy-sozcuk]');
  const kutu = kok.querySelector('[data-basyapit-gorsel]');
  const durum = { e: null, kayit: null, terimler: [], kiyaslar: [], src: '', yedek: '', isaretli: new Set() };
  // Sözlük terimleri: sayfadaki ilk geçtikleri yerde düğme olur. Metin sonradan da gelir (ayrıntılar, ayrıntılı anlatım)
  durum.terimleriIsle = () => {
    if (!durum.terimler.length) return;
    for (const el of kok.querySelectorAll('[data-bsy-terimli]')) {
      el.removeAttribute('data-bsy-terimli');
      el.innerHTML = terimIsaretle(el.innerHTML, durum.terimler, durum.isaretli);
    }
  };
  const ayrintilar = () => durum.kayit;
  const goruntule = (ek = {}) => durum.e && goruntuleyiciAc({ eserler: [durum.e], notu: notuIcin(s.id), ayrintilar: durum.kayit ? ayrintilar : null, ...ek, ...gorselTercihi() });

  // Üstteki cam çubuk: başlık ekrandan çıkınca belirir
  const baslik = kok.querySelector('.bsy-ad');
  if ('IntersectionObserver' in window) {
    const goz = new IntersectionObserver(([g]) => {
      if (!kok.isConnected) return goz.disconnect();
      const acik = !g.isIntersecting && g.boundingClientRect.top < 0;
      cubuk.classList.toggle('acik', acik);
      cubuk.inert = !acik;
    });
    goz.observe(baslik);
  }

  const sozcukKapat = () => {
    sozcuk.hidden = true;
    const hap = sayfa.querySelector('.bsy-hap');
    if (hap) hap.hidden = false;
  };
  sayfa.addEventListener('click', (o) => {
    const t = o.target.closest('button, a');
    if (!t) return;
    if ('bsyGeri' in t.dataset) kok.querySelector('[data-geri]').click();
    else if ('bsyBasa' in t.dataset) window.scrollTo({ top: 0, behavior: 'smooth' });
    else if ('basyapitBuyut' in t.dataset) goruntule();
    else if ('bsyIncele' in t.dataset) goruntule({ incelemeyeBasla: true });
    else if ('bsyNokta' in t.dataset) goruntule({ incelemeyeBasla: true, incelemeNokta: Number(t.dataset.bsyNokta) });
    else if ('bsyTerim' in t.dataset) {
      const terim = durum.terimler[Number(t.dataset.bsyTerim)];
      if (!terim) return;
      sozcuk.querySelector('[data-bsy-sozcuk-ad]').textContent = terim.ad;
      sozcuk.querySelector('[data-bsy-sozcuk-tanim]').textContent = terim.tanim;
      sozcuk.hidden = false;
      const hap = sayfa.querySelector('.bsy-hap');
      if (hap) hap.hidden = true;
    } else if ('bsySozcukKapat' in t.dataset) sozcukKapat();
    else if ('bsyKalp' in t.dataset) {
      const simdi = gorselTercihi().koleksiyon.degistir(durum.e);
      t.setAttribute('aria-pressed', String(!!simdi));
    } else if ('bsyKiyas' in t.dataset) {
      const k = durum.kiyaslar[Number(t.dataset.bsyKiyas)];
      const img = t.querySelector('img');
      if (!k || !k.anahtar || !img || !durum.src) return;
      yanYanaAc({
        bu: { src: durum.src, yedek: durum.yedek, alt: `${s.ad}, ${b.baslik}`, ad: [b.baslik, b.tarih].filter(Boolean).join(' · ') },
        oteki: { src: img.currentSrc || img.src, yedek: img.dataset.yedek || '', alt: `${k.sanatci}, ${k.eser}`, ad: k.eser },
        k,
        adres: basyapitAdresi(k.anahtar),
      });
    }
  });

  // Sıradaki eserin görseli
  if (sonraki)
    eserBul(sonraki).then((e2) => {
      const el = kok.querySelector('[data-bsy-sira-resim]');
      if (e2 && el && el.isConnected) odakliGorsel(el, e2, 900);
    });

  // ---------- Kapak ----------
  const e = await eserSozu;
  if (!guncelMi(no) || !kutu.isConnected) return;
  const g = e && secilenGorsel(e, kotuler());
  if (!g) {
    kutu.querySelector('.bsy-kapak-bos').textContent = 'Bu eserin görseli bulunamadı.';
  } else {
    durum.e = e;
    durum.src = gorselUrl(g, 1200);
    durum.yedek = gorselYedek(g);
    const bilinen = gorselOrani(g); // genişlik / yükseklik (yerel kopyası olanlarda)
    kutu.querySelector('.bsy-kapak-bos').remove();
    kutu.insertAdjacentHTML(
      'afterbegin',
      `<button class="bsy-kapak-resim" type="button" data-basyapit-buyut aria-label="${kacis(b.baslik)} — büyüt"><img decoding="async" alt="${kacis(`${s.ad}, ${b.baslik}`)}" src="${kacis(durum.src)}" data-yedek="${kacis(durum.yedek)}"></button>`,
    );
    kutu.querySelector('.bsy-kapak-ust').insertAdjacentHTML(
      'beforeend',
      `<button type="button" class="bsy-kalp" data-bsy-kalp aria-pressed="${gorselTercihi().koleksiyon.varMi(e) ? 'true' : 'false'}" aria-label="Koleksiyona ekle">${ikon('kalp', 21, 1.7)}</button>`,
    );
    sayfa.querySelector('[data-bsy-cubuk-resim]').innerHTML = `<img alt="" decoding="async" src="${kacis(durum.src)}" data-yedek="${kacis(durum.yedek)}">`;
    if (bilinen) kutu.classList.toggle('dik', 1 / bilinen >= 1.05);
  }
  const kapakResmi = kutu.querySelector('.bsy-kapak-resim img');
  // Resmin oranı (yükseklik / genişlik): yerel kopyada bilinir; yoksa resim inince ölçülür
  const oranSozu = !g
    ? Promise.resolve(0)
    : gorselOrani(g)
      ? Promise.resolve(1 / gorselOrani(g))
      : new Promise((coz) => {
          const olc = () => coz(kapakResmi.naturalWidth ? kapakResmi.naturalHeight / kapakResmi.naturalWidth : 0);
          if (kapakResmi.complete && kapakResmi.naturalWidth) olc();
          else {
            kapakResmi.addEventListener('load', olc, { once: true });
            kapakResmi.addEventListener('error', () => setTimeout(olc, 1500), { once: true }); // yedek adres denenir
          }
        });
  oranSozu.then((oran) => {
    if (oran && kutu.isConnected) kutu.classList.toggle('dik', oran >= 1.05);
  });

  // ---------- Ayrıntılar: metnin içinde kırpımlar ve "Yakından bak" düğmesi ----------
  const ayrintiListesi = await ayrintiSoz;
  if (!guncelMi(no) || !kok.isConnected) return;
  const kayit = g ? ayrintiBul(ayrintiListesi, b.anahtar) || eserinAyrintisi(ayrintiListesi, e) : null;
  durum.kayit = kayit;
  const bak = kok.querySelector('[data-bsy-bak]');
  if (bak && !kayit) bak.hidden = false;
  if (kayit) {
    sayfa.insertAdjacentHTML('beforeend', `<button class="bsy-hap" type="button" data-bsy-incele data-test="basyapit-incele">${ikon('ara', 20, 1.7)}Yakından bak <span>${kayit.noktalar.length} ayrıntı</span></button>`);
    oranSozu.then((oran) => {
      if (!oran || !kok.isConnected) return;
      noktalariYerlestir(b.bolumler, kayit.noktalar).forEach((sira, i) => {
        const yer = kok.querySelector(`[data-bsy-yer="${i}"]`);
        if (yer) yer.innerHTML = ayrintiHtml(sira, kayit.noktalar, oran, durum.src, durum.yedek);
      });
      durum.terimleriIsle();
    });
  }

  // ---------- Hikâyesi ----------
  hikayeVeri().then(() => {
    const h = guncelMi(no) && kok.isConnected && e && hikayeBulucu(e);
    if (h && !kok.querySelector('.bsy-hikaye')) kok.querySelector('[data-bsy-akis]').insertAdjacentHTML('beforebegin', `<section class="bsy-bolum bsy-hikaye basyapit-hikaye" data-test="basyapit-hikaye"><h2>Hikâyesi</h2><div class="bsy-metin">${hikayeHtml(h, kacis)}</div></section>`);
  });

  // ---------- Ders: sözlük, künye, karşılaştırmalar ve ayrıntılı anlatım ----------
  dersiBagla({ no, kok, b, s, liste, durum, eserBul, derin });
}

async function dersiBagla({ no, kok, b, s, liste, durum, eserBul, derin }) {
  const yayin = await dersYayini().catch(() => null);
  const dersDurum = yayin ? dersinDurumu(yayin, b.anahtar) : 'yok';
  if (!guncelMi(no) || !kok.isConnected || !dersGorunurMu(dersDurum)) return;
  const klasor = dersKlasoru(yayin, b.anahtar);
  const [ders, orta] = await Promise.all([
    jsonGetir(dersYolu(klasor, 'DERS.json')).catch(() => null),
    metinGetir(dersYolu(klasor, 'DERS_ORTA.md'))
      .then(temizle)
      .catch(() => ''),
  ]);
  if (!guncelMi(no) || !kok.isConnected) return;

  // Künye: teknik ve boyut dersten
  const kunye = kunyeSatirlari(b, ders);
  if (kunye.length) kok.querySelector('[data-bsy-kunye]').innerHTML = kunyeHtml(kunye);

  // Sözlük: terimler metinde işaretlenir (ilk geçtiği yer), hepsi sonda listelenir
  durum.terimler = sozlukAl(ders);
  if (durum.terimler.length) {
    durum.terimleriIsle();
    const sozluk = kok.querySelector('[data-bsy-sozluk]');
    sozluk.innerHTML = `<h3>Sözlük</h3><dl class="bsy-liste bsy-sozluk">${durum.terimler.map((t) => `<div><dt>${kacis(t.ad)}</dt><dd>${kacis(t.tanim)}</dd></div>`).join('')}</dl>`;
    sozluk.hidden = false;
  }

  // Ayrıntılı anlatım
  const bolumler = dersBolumleri(orta);
  if (!bolumler.length) return;
  durum.kiyaslar = karsilastirmalariAl(ders, liste, b.anahtar, (id) => (d.harita.get(id) || {}).ad || '');
  const kiyasHtml = durum.kiyaslar.length
    ? `<section class="bsy-bolum"><h2>Karşılaştırmalar</h2><div class="bsy-serit bsy-kiyaslar" data-test="bsy-kiyaslar">${durum.kiyaslar
        .map((k, i) =>
          k.anahtar
            ? `<button type="button" class="bsy-kiyas" data-bsy-kiyas="${i}" data-test="bsy-kiyas" aria-label="${kacis(k.eser)} ile yan yana aç"><span class="bsy-kiyas-resim" data-bsy-kiyas-resim="${i}"></span><small>${kacis(k.sanatci)}</small><b>${kacis(k.eser)}</b><span>${kacis(k.gerekce)}</span></button>`
            : `<div class="bsy-kiyas duz"><small>${kacis(k.sanatci)}</small><b>${kacis(k.eser)}</b><span>${kacis(k.gerekce)}</span></div>`,
        )
        .join('')}</div></section>`
    : '';
  const kap = kok.querySelector('[data-bsy-derin]');
  const dk = okumaDakikasi(orta);
  const kart = () => {
    kap.innerHTML = `<div class="bsy-derin-kart"><span class="etiket vurgu">Ayrıntılı okuma · yaklaşık ${dk} dk</span><h3>Daha derine in</h3><p>${kacis(
      bolumler
        .slice(0, 4)
        .map((x) => x.baslik)
        .join(', '),
    )}${bolumler.length > 4 ? '…' : ''}</p><button type="button" class="bsy-dugme" data-bsy-derin-ac data-test="basyapit-ders">Okumayı sürdür${ikon('asagi', 18, 1.8)}</button></div>`;
  };
  const ac = (kaydir) => {
    const kiyasYeri = bolumler.some((x) => x.karsilastirma);
    kap.innerHTML = `<div class="bsy-derin" data-test="ders-metni">${dersDurum === 'taslak' ? '<p class="bsy-not">Taslak ders: yalnız geliştirici modunda görünür.</p>' : ''}${bolumler
      .map((x) => (x.karsilastirma && kiyasHtml ? kiyasHtml : `<section class="bsy-bolum"><h2>${kacis(x.baslik)}</h2><div class="bsy-metin" data-bsy-terimli>${mdHtml(x.govde)}</div></section>`))
      .join('')}${kiyasYeri ? '' : kiyasHtml}<button type="button" class="bsy-az" data-bsy-derin-kapat>Daha az göster${ikon('cik', 18, 1.8)}</button></div>`;
    for (const el of kap.querySelectorAll('[data-bsy-kiyas-resim]')) {
      const k = durum.kiyaslar[Number(el.dataset.bsyKiyasResim)];
      const kayit = k && basyapitBul(liste, k.anahtar);
      if (kayit)
        eserBul(kayit).then((e2) => {
          if (e2 && el.isConnected) odakliGorsel(el, e2, 900);
        });
    }
    durum.terimleriIsle();
    if (kaydir) kap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  kap.addEventListener('click', (o) => {
    const t = o.target.closest('button');
    if (!t) return;
    if ('bsyDerinAc' in t.dataset) ac(false);
    else if ('bsyDerinKapat' in t.dataset) {
      kart();
      kap.scrollIntoView({ block: 'center' });
    }
  });
  if (derin) ac(true);
  else kart();
}

// #/basyapit/<anahtar>/ders: aynı sayfa, ayrıntılı anlatım açık (İş 175'teki ayrı ders ekranının yerine)
export const basyapitDersSayfasi = (kodlu) => basyapitSayfasi(kodlu, { derin: true });
