// Bölüm sonucunun sergi duvarında asılı tablolar telefonun eğimiyle ipinden sallanır (İş 39). Telefonu sağa sola
// çevirince tablolar yerçekimine uyar gibi ters yöne salınır, bırakınca birkaç kez gidip gelerek durulur; uzun ipli
// tablo daha ağır sallanır. Algılayıcı, izin ve "Hareketi aç" akışı Bugün'deki eğimle aynı (js/egim.js).
// Her tabloya --sal (derece) yazılır; CSS bunu tablonun asılış eğimine (rotate: --egim) ayrı bir transform olarak ekler.
import { egimBaslat } from './egim.js';

export const EN_COK_SALINIM = 9; // tam eğimde tablonun duracağı açı (derece)
const SONUM = 2.4; // sürtünme: büyüdükçe salınım çabuk durulur

// İp uzadıkça sarkaç ağırlaşır (sertlik ~ 1 / boy): 10 px ipte ~0,9 sn, 28 px ipte ~1,1 sn salınım
export const ipSertligi = (ip) => 1800 / (Math.max(0, ip) + 26);

// Yaylı sarkacın bir adımı (yarı örtük Euler; büyük dt'de bile patlamaz). durum { aci, hiz }, hedef açı (derece)
export function sarkacAdim(durum, hedef, dt, sertlik, sonum = SONUM) {
  const ivme = -sertlik * (durum.aci - hedef) - sonum * durum.hiz;
  const hiz = durum.hiz + ivme * dt;
  return { aci: durum.aci + hiz * dt, hiz };
}
export const durgunMu = (durum, hedef) => Math.abs(durum.aci - hedef) < 0.02 && Math.abs(durum.hiz) < 0.05;

let duvar = null;
let asilar = [];
let durumlar = [];
let hedefAci = 0;
let kare = 0;
let sonZaman = 0;

function adim(t) {
  kare = 0;
  if (!duvar || !duvar.isConnected) return sallanmaDurdur();
  const dt = sonZaman ? Math.min(0.04, (t - sonZaman) / 1000) : 1 / 60;
  sonZaman = t;
  let durgun = true;
  durumlar.forEach((s, i) => {
    Object.assign(s, sarkacAdim(s, hedefAci, dt, s.sertlik));
    asilar[i].style.setProperty('--sal', `${s.aci.toFixed(2)}deg`);
    if (!durgunMu(s, hedefAci)) durgun = false;
  });
  if (durgun) sonZaman = 0;
  else kare = requestAnimationFrame(adim);
}

// el: .sergi-duvar (içinde .asi tablolar ve [data-egim-dugme]); acik: Ayarlar'daki hareket seçimi
export function sallanmaBaslat(el, acik) {
  sallanmaDurdur();
  if (!el) return;
  duvar = el;
  asilar = [...el.querySelectorAll('.asi')];
  durumlar = asilar.map((a) => ({ aci: 0, hiz: 0, sertlik: ipSertligi(parseFloat(a.style.getPropertyValue('--ip')) || 16) }));
  egimBaslat(el, acik, (h) => {
    // telefon sağa dönünce ekrana göre tablolar sola salınır (yerçekimi yerinde kalır)
    hedefAci = -h.x * EN_COK_SALINIM;
    if (!kare && duvar === el) kare = requestAnimationFrame(adim);
  });
}

export function sallanmaDurdur() {
  if (kare) cancelAnimationFrame(kare);
  kare = 0;
  sonZaman = 0;
  hedefAci = 0;
  duvar = null;
  asilar = [];
  durumlar = [];
}
