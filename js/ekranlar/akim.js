// Akım kimlik kartı (akım sayfasının başında) ve akım karşılaştırması #/akim-karsilastir/<a>/<b> (K3).
import { kacis } from '../yardimci.js';
import { sanatciEserleri, eserBaslik } from '../eserler.js';
import { goruntuleyiciAc } from '../goruntuleyici.js';
import { akimYuzyillari } from '../tasarim.js';
import { bilinenAd } from '../adlar.js';
import { paletBirlestir, tipikKonular, enBilinenEserler, akimKarsilastirmaAdresi, karsilastirmaKomsulari } from '../akim.js';
import {
  d,
  ekran,
  etiket,
  gununRengi,
  ciz,
  islenen,
  ust,
  cerceve,
  kucukGorsel,
  akimRenk,
  akimNoktasi,
  eserPaleti,
  notuIcin,
  gorselTercihi,
  jsonGetir,
  hataGoster,
} from './ortak.js';
import { ikonografiVeri } from './gozat.js';

let ozellikSozu = null;
function ozellikler() {
  if (!ozellikSozu)
    ozellikSozu = jsonGetir('data/akim_ozellikleri.json').then(
      (j) => (j && j.akimlar) || {},
      () => ({}),
    );
  return ozellikSozu;
}

// Akımın verisi: açık üyeleri, en bilinen 4 eseri, paleti (eser görsellerinden), özellikleri ve tipik konuları
const veriBellek = new Map();
function akimVerisi(ad) {
  const k = islenen();
  const anahtar = `${ad}|${k.size}`;
  if (veriBellek.has(anahtar)) return veriBellek.get(anahtar);
  const uyeler = d.sanatcilar.filter((s) => s.akim === ad);
  const acik = uyeler.filter((s) => k.has(s.konu));
  const soz = Promise.all([
    Promise.all(
      acik.map((s) =>
        sanatciEserleri(s).then(
          (eserler) => ({ s, eserler }),
          () => ({ s, eserler: [] }),
        ),
      ),
    ),
    ozellikler(),
    ikonografiVeri().catch(() => []),
  ]).then(async ([listeler, oz, konular]) => {
    const eserler = enBilinenEserler(listeler, 4);
    const paletler = await Promise.all(eserler.map(({ e }) => eserPaleti(e, null).catch(() => null)));
    return {
      ad,
      uyeler,
      acik,
      eserler,
      palet: paletBirlestir(paletler.filter(Boolean)),
      ozellikler: oz[ad] || [],
      konular: tipikKonular(
        konular,
        acik.map((s) => s.id),
      ),
    };
  });
  veriBellek.set(anahtar, soz);
  soz.catch(() => veriBellek.delete(anahtar));
  return soz;
}

function paletSeridi(palet) {
  if (!palet.length) return '<div class="akim-palet bos" aria-hidden="true"></div>';
  return `<div class="akim-palet" role="img" aria-label="Akımın ortalama renkleri">${palet
    .map((p, i) => `<span style="flex-grow:${p.pay.toFixed(3)};background:${p.renk};--i:${i}"></span>`)
    .join('')}</div>`;
}

function ozellikListesi(l) {
  return l.length ? `<ol class="akim-ozellik">${l.map((x) => `<li>${kacis(x)}</li>`).join('')}</ol>` : '';
}

function konuBaglari(l) {
  return l.length
    ? `<p class="akim-konular">${l.map((k) => `<a href="#/konu/${encodeURIComponent(k.id)}">${kacis(k.ad)}<small>${k.n}</small></a>`).join('')}</p>`
    : '';
}

const ROMA = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
// Uzman gözüyle ipuçları: her ipucunun yanında akımın bir eserinden yakın plan bir ayrıntı (büyüteç),
// eser yoksa paletten bir boya lekesi. Kayan bir kesit gibi sırayla belirir.
const AYRINTI_ODAK = ['30% 35%', '68% 28%', '45% 70%', '22% 60%', '75% 65%', '50% 45%'];
function tanimaNotlari(l, eserler, palet) {
  return `<ol class="akim-ozellik akim-ipucu">${l
    .map((x, i) => {
      const eser = eserler.length ? eserler[i % eserler.length].e : null;
      const gorsel = eser ? kucukGorsel(eser, 400) : '';
      const renk = palet.length ? palet[i % palet.length].renk : 'var(--renk)';
      const no = ROMA[i] || String(i + 1);
      const sol = gorsel
        ? `<span class="akim-ipucu-lens" style="--odak:${AYRINTI_ODAK[i % AYRINTI_ODAK.length]};--leke:${renk}" aria-hidden="true">${gorsel}</span>`
        : `<span class="akim-ipucu-rakam" aria-hidden="true">${no}</span>`;
      return `<li style="--i:${i}" class="${gorsel ? '' : 'yazili'}">
        ${sol}
        <span class="akim-ipucu-yazi">${gorsel ? `<span class="akim-ipucu-no">${no}</span>` : ''}${kacis(x)}</span>
      </li>`;
    })
    .join('')}</ol>`;
}

// Tipik konular: bir sergi kataloğunun dizini gibi, iri serif adlar ve üstte eser sayısı
function konuDizini(l) {
  const enCok = Math.max(...l.map((k) => k.n), 1);
  return `<p class="akim-konu-dizin">${l
    .map(
      (k) =>
        `<a href="#/konu/${encodeURIComponent(k.id)}" style="--agirlik:${(0.55 + 0.45 * (k.n / enCok)).toFixed(2)}"><span>${kacis(k.ad)}</span><sup>${k.n}</sup></a>`,
    )
    .join('<span class="akim-konu-ayrac" aria-hidden="true">·</span>')}</p>`;
}

function bolumBasligi(ust, baslik) {
  return `<header class="akim-bolum-bas"><span>${kacis(ust)}</span><h2>${kacis(baslik)}</h2></header>`;
}

function eserIzgarasi(eserler, veri) {
  return `<div class="akim-eserler">${eserler
    .map(
      ({ e, s }, i) =>
        `<button type="button" class="akim-eser" ${veri}="${i}" aria-label="${kacis(eserBaslik(e))} — büyüt">${cerceve(e, { genislik: 400, tembel: true })}<span><b>${kacis(eserBaslik(e))}</b>${kacis(bilinenAd(s.ad, d.kisaAdlar[s.id]))}</span></button>`,
    )
    .join('')}</div>`;
}

// Akım sayfasındaki kimlik kartı: yer tutucuya yazılır
let kimlikEserleri = [];
export async function kimlikDoldur(ad) {
  const kutu = ekran.querySelector('[data-akim-kimlik]');
  if (!kutu) return;
  const v = await akimVerisi(ad);
  if (!kutu.isConnected) return;
  kimlikEserleri = v.eserler;
  const komsular = karsilastirmaKomsulari(ad, d.akimlar).slice(0, 3);
  kutu.innerHTML = `<section class="akim-kimlik" data-test="akim-kimlik" style="--renk:${akimRenk(ad)}">
      ${paletSeridi(v.palet)}
      ${
        v.ozellikler.length
          ? `<div class="akim-bolum">${bolumBasligi('Göz eğitimi', 'Nasıl tanınır?')}${tanimaNotlari(v.ozellikler, v.eserler, v.palet)}</div>`
          : ''
      }
      ${
        v.konular.length
          ? `<div class="akim-bolum">${bolumBasligi('Tuvallerde en çok', 'Tipik konular')}${konuDizini(v.konular)}</div>`
          : ''
      }
      ${
        v.eserler.length
          ? `<div class="akim-bolum">${bolumBasligi('Duvardakiler', 'En bilinen eserler')}${eserIzgarasi(v.eserler, 'data-kimlik-eser')}</div>`
          : ''
      }
      ${
        komsular.length
          ? `<div class="akim-bolum">${bolumBasligi('Karıştırma', 'Yan yana koy')}<p class="akim-komsular akim-komsu-liste">${komsular
              .map(
                (k) =>
                  `<a href="${akimKarsilastirmaAdresi(ad, k)}" data-test="akim-karsilastir-bag" style="--karsi:${akimRenk(k)}"><span class="akim-komsu-nokta" aria-hidden="true"></span><span>${kacis(ad)} <i>ile</i> ${kacis(k)}</span><span class="akim-komsu-ok" aria-hidden="true">→</span></a>`,
              )
              .join('')}</p></div>`
          : ''
      }
    </section>`;
}

// ---------- Akım karşılaştırması ----------
let karsiEserler = [[], []];
export async function akimKarsilastirSayfasi(a, b) {
  const varMi = (x) => d.akimlar.some((y) => y.ad === x);
  if (!varMi(a) || !varMi(b)) return hataGoster(new Error('Akım bulunamadı.'));
  gununRengi();
  ciz(`${ust('Yan yana', `#/akim/${encodeURIComponent(a)}`, { ustEtiket: 'Akım karşılaştır' })}<p class="ikincil kucuk">Hazırlanıyor…</p>`);
  const adres = location.hash;
  const [va, vb] = await Promise.all([akimVerisi(a), akimVerisi(b)]);
  if (location.hash !== adres) return;
  karsiEserler = [va.eserler.slice(0, 2), vb.eserler.slice(0, 2)];
  const sutun = (v, i) => {
    const yillar = akimYuzyillari(v.uyeler, { roma: true });
    return `<div class="akim-karsi-sutun" style="--renk:${akimRenk(v.ad)}" data-test="akim-karsi-sutun">
      <a class="akim-karsi-ad" href="#/akim/${encodeURIComponent(v.ad)}">${akimNoktasi(v.ad)}${kacis(v.ad)}</a>
      <span class="akim-karsi-yil">${kacis(yillar)}</span>
      ${paletSeridi(v.palet)}
      ${eserIzgarasi(karsiEserler[i], `data-karsi-eser-${i}`)}
      ${ozellikListesi(v.ozellikler)}
      ${konuBaglari(v.konular.slice(0, 3))}
    </div>`;
  };
  ciz(`${ust('Yan yana', `#/akim/${encodeURIComponent(a)}`, { ustEtiket: 'Akım karşılaştır' })}
    <div class="akim-karsi" data-test="akim-karsi">${sutun(va, 0)}${sutun(vb, 1)}</div>`);
}

// Ekranın olay dinleyicileri; app.js bir kez bağlar
export function olaylariBagla() {
  ekran.addEventListener('click', (e) => {
    const k = e.target.closest('[data-kimlik-eser]');
    if (k) {
      const x = kimlikEserleri[Number(k.dataset.kimlikEser)];
      if (x)
        goruntuleyiciAc({
          eserler: kimlikEserleri.map((y) => y.e),
          baslangic: Number(k.dataset.kimlikEser),
          notu: (eser) => notuIcin(eser.sid)(eser),
          ...gorselTercihi(),
        });
      return;
    }
    for (const i of [0, 1]) {
      const b = e.target.closest(`[data-karsi-eser-${i}]`);
      if (b) {
        const l = karsiEserler[i].map((y) => y.e);
        goruntuleyiciAc({
          eserler: l,
          baslangic: Number(b.getAttribute(`data-karsi-eser-${i}`)),
          notu: (eser) => notuIcin(eser.sid)(eser),
          ...gorselTercihi(),
        });
        return;
      }
    }
  });
}
