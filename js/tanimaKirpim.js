// İş 193: tanıma kırpımları. Konu sayfasındaki "Resimde nasıl tanınır?" maddelerinin ve sanatçı sayfasındaki
// "Nasıl tanırım?" notunun yanında, o özelliği gösteren eserden yakın plan bir kırpım (data/tanima_kirpimlari.json).
// Kayıt: { anahtar (QID ya da "sanatçıId|başlık"), sanatci, gorsel (kutunun seçildiği görselin yerel adı), ad,
//          x, y, w, h (görselin en/boyuna oranla 0–1, sol üst + boy), madde? (konu maddesinin sırası), metin? }
// Kutuların çoğu rehberli incelemenin doğrulanmış ayrıntılarından (data/eser_ayrintilari.json) gelir; görüntüleyici
// o zaman aynı kayıtla, o ayrıntıda açılır. Üretim ve görsel denetim: scripts/tanima_kirpim/. Saf mantık (birim testli).

const yazi = (x) => typeof x === 'string' && x.trim().length > 0;
const oran = (n) => Number.isFinite(n) && n >= 0 && n <= 1;

export function kirpimGecerliMi(k) {
  if (!k || !yazi(k.anahtar) || !yazi(k.sanatci) || !yazi(k.gorsel) || !yazi(k.ad)) return false;
  if (![k.x, k.y, k.w, k.h].every(oran)) return false;
  if (k.w < 0.02 || k.h < 0.02 || k.x + k.w > 1.0001 || k.y + k.h > 1.0001) return false;
  return true;
}

// Veri dosyasından { konular: Map(konuId → [kayıt]), sanatcilar: Map(id → [kayıt]) }; bozuk kayıt atılır.
// Konu kayıtları madde sırasına dizilir; bir maddeye en çok bir kırpım düşer (ilki kalır).
export function tanimaKirpimlariAl(json) {
  const sonuc = { konular: new Map(), sanatcilar: new Map() };
  const bolum = (ad, hedef, konu) => {
    const v = json && json[ad];
    if (!v || typeof v !== 'object') return;
    for (const [id, l] of Object.entries(v)) {
      if (!Array.isArray(l)) continue;
      let gecerli = l.filter(kirpimGecerliMi);
      if (konu) {
        const goruldu = new Set();
        gecerli = gecerli
          .filter((k) => Number.isInteger(k.madde) && k.madde >= 0 && !goruldu.has(k.madde) && goruldu.add(k.madde))
          .sort((a, b) => a.madde - b.madde);
      }
      if (gecerli.length) hedef.set(id, gecerli);
    }
  };
  bolum('konular', sonuc.konular, true);
  bolum('sanatcilar', sonuc.sanatcilar, false);
  return sonuc;
}

// Kırpımın eseri: anahtarı ve sanatçısı tutan, ekranda gösterilen görseli kutunun seçildiği görsel olan eser.
// anahtarBul(e) eserin ayrıntı anahtarını, gorselAdiBul(e) gösterilen görselin adını verir. Görsel değiştiyse
// (ör. "Görsel kötü" ile başka bir kopyaya geçildiyse) kutu o kopyada yanlış yere düşer: kırpım gösterilmez.
export function kirpimEseri(k, eserler, anahtarBul, gorselAdiBul) {
  if (!k) return null;
  for (const e of eserler || []) {
    if (!e || anahtarBul(e) !== k.anahtar) continue;
    if (e.sid && e.sid !== k.sanatci) continue;
    return gorselAdiBul(e) === k.gorsel ? e : null;
  }
  return null;
}

const ayni = (a, b) => Math.abs(a - b) < 0.006;

// Görüntüleyiciye verilecek inceleme kaydı ve başlanacak nokta. Eserin rehberli incelemesinde aynı kutu varsa o kayıt
// (öbür ayrıntılar da gezilebilir), yoksa yalnız bu kutudan oluşan bir kayıt; açıklama verilen metin.
export function incelemeKaydi(k, mevcut, metin = '') {
  const noktalar = mevcut && Array.isArray(mevcut.noktalar) ? mevcut.noktalar : [];
  const i = mevcut && (!mevcut.gorsel || mevcut.gorsel === k.gorsel) ? noktalar.findIndex((n) => ayni(n.x, k.x) && ayni(n.y, k.y) && ayni(n.w, k.w) && ayni(n.h, k.h)) : -1;
  if (i >= 0) return { kayit: mevcut, nokta: i };
  return {
    kayit: { anahtar: k.anahtar, sanatci: k.sanatci, baslik: '', gorsel: k.gorsel, noktalar: [{ ad: k.ad, metin: k.metin || metin || k.ad, x: k.x, y: k.y, w: k.w, h: k.h }] },
    nokta: 0,
  };
}
