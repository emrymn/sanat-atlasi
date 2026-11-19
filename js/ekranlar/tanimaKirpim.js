// İş 193: tanıma kırpımlarını sayfalara yerleştirir (saf mantık js/tanimaKirpim.js, veri data/tanima_kirpimlari.json).
//  · Konu sayfası: "Resimde nasıl tanınır?" maddesinin solundaki büyüteç simgesinin yerine o özelliğin eserden kare
//    kırpımı; maddenin altında küçük harfle sanatçı ve eser.
//  · Sanatçı sayfası: "Nasıl tanırım?" notunun altında yana kayan kırpım şeridi (Başyapıt sayfasının şeridiyle aynı).
// Kırpıma dokununca görüntüleyici o eserde, o ayrıntıya yakınlaşmış açılır.
import { kacis } from '../yardimci.js';
import { gorselUrl, gorselYedek, secilenGorsel, gorselOrani, gorselAdi, yerelAnahtar } from '../gorsel.js';
import { goruntuleyiciAc } from '../goruntuleyici.js';
import { kirpim } from '../basyapitSayfa.js';
import { ayrintiAnahtari } from '../ayrinti.js';
import { eserBaslik } from '../eserler.js';
import { bilinenAd } from '../adlar.js';
import { tanimaKirpimlariAl, kirpimEseri, incelemeKaydi } from '../tanimaKirpim.js';
import { d, jsonGetir, kotuler, gorselTercihi, notuIcin } from './ortak.js';

let soz = null;
export function tanimaKirpimVeri() {
  return (soz ||= jsonGetir('data/tanima_kirpimlari.json').then(tanimaKirpimlariAl, () => tanimaKirpimlariAl(null)));
}

const gosterilen = (e) => secilenGorsel(e, kotuler()) || (e.gorseller || [])[0] || null;
const gorselAdiBul = (e) => {
  const g = gosterilen(e);
  return g ? gorselAdi(g) || yerelAnahtar(g) : '';
};
const bul = (k, eserler) => kirpimEseri(k, eserler, ayrintiAnahtari, gorselAdiBul);

// Kırpım resmi: resmin oranı biliniyorsa hemen, bilinmiyorsa inince yerine oturur (o zamana dek görünmez)
function resim(k, e, kutu, secenek) {
  const g = gosterilen(e);
  const o = gorselOrani(g);
  const stil = (r) => {
    const c = kirpim(k, r, kutu, secenek);
    return `width:${c.w}%;height:${c.h}%;left:${c.l}%;top:${c.t}%`;
  };
  return `<img alt="" decoding="async" loading="lazy" src="${kacis(gorselUrl(g, 800))}" data-yedek="${kacis(gorselYedek(g))}" data-tk-kutu="${kutu}" data-tk-pay="${secenek.pay}" data-tk-encok="${secenek.enCok}" style="${o ? stil(1 / o) : 'opacity:0'}">`;
}
function oranlariBekle(kok, kayitlar) {
  for (const img of kok.querySelectorAll('img[data-tk-kutu]')) {
    if (!img.style.opacity) continue;
    const k = kayitlar[Number(img.closest('[data-tk]').dataset.tk)];
    const yerlestir = () => {
      if (!img.naturalWidth) return;
      const c = kirpim(k, img.naturalHeight / img.naturalWidth, Number(img.dataset.tkKutu), { pay: Number(img.dataset.tkPay), enCok: Number(img.dataset.tkEncok) });
      img.style.cssText = `width:${c.w}%;height:${c.h}%;left:${c.l}%;top:${c.t}%`;
    };
    if (img.complete) yerlestir();
    else img.addEventListener('load', yerlestir, { once: true });
  }
}

const kaynakYazisi = (e) => {
  const s = d.harita.get(e.sid);
  return [s ? bilinenAd(s.ad, d.kisaAdlar[s.id]) : '', eserBaslik(e)].filter(Boolean).join(' · ');
};

// ayrinti: { veri: () => Promise, bulucu: (eser) => kayıt|null } (gozat.js'in rehberli inceleme verisi)
async function ac(k, e, metin, ayrinti) {
  await ayrinti.veri().catch(() => null);
  const { kayit, nokta } = incelemeKaydi(k, ayrinti.bulucu(e), metin);
  goruntuleyiciAc({ eserler: [e], baslangic: 0, notu: notuIcin(e.sid), ayrintilar: () => kayit, incelemeyeBasla: true, incelemeNokta: nokta, ...gorselTercihi() });
}

// Konu sayfası: liste [data-tanima-madde] öğelerinden oluşur; eserler konunun yüklenmiş eser nesneleri
export async function konuKirpimlari(konu, liste, eserler, ayrinti) {
  const veri = await tanimaKirpimVeri();
  const kayitlar = veri.konular.get(konu.id) || [];
  if (!liste || !liste.isConnected || !kayitlar.length) return;
  kayitlar.forEach((k, i) => {
    const li = liste.querySelector(`[data-tanima-madde="${k.madde}"]`);
    const e = bul(k, eserler);
    if (!li || !e || li.querySelector('[data-tk]')) return;
    const kaynak = kaynakYazisi(e);
    const simge = li.querySelector(':scope > .ikon');
    const dugme = `<button type="button" class="tk-kirp" data-tk="${i}" data-test="tk-konu" aria-label="${kacis(`${k.ad} (${kaynak}): yakından bak`)}">${resim(k, e, 1, { pay: 1.35, enCok: 4 })}</button>`;
    if (simge) simge.outerHTML = dugme;
    else li.insertAdjacentHTML('afterbegin', dugme);
    li.classList.add('tk-li');
    li.querySelector(':scope > span').insertAdjacentHTML('beforeend', `<small class="tk-kaynak">${kacis(kaynak)}</small>`);
  });
  oranlariBekle(liste, kayitlar);
  liste.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-tk]');
    if (!b) return;
    const k = kayitlar[Number(b.dataset.tk)];
    const e = k && bul(k, eserler);
    if (e) ac(k, e, konu.tanima[k.madde] || '', ayrinti);
  });
}

// Sanatçı sayfası: kutu "Nasıl tanırım?" bölümündeki [data-tanima-kirp] yeri; eserler sanatçının eserleri
export async function sanatciKirpimlari(s, kutu, eserler, ayrinti) {
  const veri = await tanimaKirpimVeri();
  if (!kutu || !kutu.isConnected) return;
  const kayitlar = veri.sanatcilar.get(s.id) || [];
  const ogeler = kayitlar.map((k, i) => ({ k, i, e: bul(k, eserler) })).filter((x) => x.e);
  if (!ogeler.length) return;
  kutu.innerHTML = `<div class="bsy-serit tk-serit" data-test="tk-serit">${ogeler
    .map(
      ({ k, i, e }) =>
        `<button type="button" class="bsy-kirp-kucuk tk-kirp-kucuk" data-tk="${i}" data-test="tk-sanatci" aria-label="${kacis(`${k.ad} (${eserBaslik(e)}): yakından bak`)}"><span class="bsy-kirp">${resim(k, e, 4 / 3, { pay: 1.4, enCok: 4 })}</span><b>${kacis(k.ad)}</b><small>${kacis(eserBaslik(e))}</small></button>`,
    )
    .join('')}</div>`;
  oranlariBekle(kutu, kayitlar);
  kutu.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-tk]');
    if (!b) return;
    const k = kayitlar[Number(b.dataset.tk)];
    const e = k && bul(k, eserler);
    if (e) ac(k, e, k.ad, ayrinti);
  });
}
