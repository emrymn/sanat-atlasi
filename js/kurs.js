// İlerleme kitaplığındaki kurs konuları ve kapakları (İş 28).
// Kapak sırası:
//  1) konunun görünür (resim yapan) sanatçısı → onun en bilinen eseri
//  2) o derste işlenen bir kurs resmi (başlıkta adı geçen sanatçınınki önce)
//  3) başlık bir sanatçının adıyla başlıyorsa onun en bilinen eseri ("Michelangelo and the Last Judgment")
//  4) o derste işlenen ve başlıkta adı geçen sanatçının eserinin fotoğrafı: heykel ya da yapı da olabilir
//     (Emre'nin isteği; sorularda ve galeride yine yalnız resimler var)
//  5) o dersteki herhangi bir resim, 6) o dersteki herhangi bir eserin fotoğrafı
// Hiç eseri olmayan konu kitaplıkta gösterilmez; veri silinmez, "işlendi" kaydı durur.
import { kursResimleri } from './resim.js';

const kelimeler = (x) => String(x || '').toLocaleLowerCase('en').split(/[^a-zà-ÿ]+/).filter(Boolean);
const soyadi = (s) => kelimeler(s.ad_arama || s.ad).pop() || '';
// sanatçının soyadı başlıkta ayrı bir kelime olarak geçiyor mu
const baslikta = (s, baslik) => kelimeler(baslik).includes(soyadi(s));
// başlık sanatçının adıyla mı başlıyor ("Donatello David …" Jacques-Louis David değil)
const baslikIlk = (s, baslik) => kelimeler(baslik)[0] === soyadi(s);

function dersEserleri(no, sanatcilar, sec) {
  const l = [];
  for (const s of sanatcilar) for (const e of sec(s)) if (e.konu === no && e.commons_dosya) l.push({ s, e });
  return l;
}
// başlıktaki sanatçının eserleri arasından konu başlığıyla en çok ortak kelimesi olan ("Gates of Paradise")
function enUygun(l, baslik) {
  const b = new Set(kelimeler(baslik).filter((w) => w.length >= 4));
  const puan = (x) => kelimeler(x.e.baslik).filter((w) => b.has(w)).length;
  const adli = l.filter((x) => baslikta(x.s, baslik));
  return adli.length ? adli.reduce((a, x) => (puan(x) > puan(a) ? x : a)) : null;
}
const eserKapagi = (x) => ({ sanatci: x.s.id, dosya: x.e.commons_dosya, baslik: x.e.baslik });

// sanatcilar: görünür sanatçılar; tumSanatcilar: heykeltıraş ve mimarlar dahil hepsi (4. adım için)
export function konuKapagi(konu, sanatcilar, turler, tumSanatcilar = sanatcilar) {
  const no = konu.no;
  const l = sanatcilar.filter((s) => s.konu === no);
  if (l.length) return { sanatci: (l.find((s) => s.kaynak === 'kurs') || l[0]).id };
  const resimler = dersEserleri(no, sanatcilar, (s) => kursResimleri(s, turler));
  const adli = enUygun(resimler, konu.baslik);
  if (adli) return eserKapagi(adli);
  const adi = sanatcilar.find((s) => baslikIlk(s, konu.baslik));
  if (adi) return { sanatci: adi.id };
  const hepsi = dersEserleri(no, tumSanatcilar, (s) => s.kurs_eserleri || []);
  const adliFoto = enUygun(hepsi, konu.baslik);
  const resimMi = (x) => resimler.some((r) => r.e === x.e);
  if (adliFoto) return { ...eserKapagi(adliFoto), ...(resimMi(adliFoto) ? {} : { resimDegil: true }) };
  if (resimler.length) return eserKapagi(resimler[0]);
  return hepsi.length ? { ...eserKapagi(hepsi[0]), resimDegil: true } : null;
}

export function kursKonulari(konular, sanatcilar, turler, tumSanatcilar = sanatcilar) {
  return konular.map((k) => ({ ...k, kapak: konuKapagi(k, sanatcilar, turler, tumSanatcilar) })).filter((k) => k.kapak);
}
