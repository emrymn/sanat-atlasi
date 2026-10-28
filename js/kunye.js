// Sanatçının yüzü ve adının okunuşu (İş 49): sanatçı sayfasında adın arkasında büyük, silik portresi (Wikidata P18)
// ve adın altında "Dinle" düğmesi. Okunuş, varsa adın gerçek ses kaydı (Wikidata P443, sanatçının kendi dilinde),
// yoksa telefonun o dildeki sesi (speechSynthesis). Veriler data/kunye.json'da (scripts/kunye.py üretir); ses ve portre
// dosyaları uygulamayla gelir (gorseller/ses, gorseller/portre). Doğruluk: yalnız doğrulanmış QID'lerin kayıtları.

let veriSozu = null;
function kunyeVeri() {
  if (!veriSozu)
    veriSozu = fetch('data/kunye.json')
      .then((y) => (y.ok ? y.json() : null))
      .then((j) => (j && j.kunye) || {})
      .catch(() => ({}));
  return veriSozu;
}

// Telefonun okuyacağı ad: Türkçe ekler ve açıklamalar atılır ("Pieter Bruegel (Yaşlı)" → "Pieter Bruegel",
// "Limbourg kardeşler" → "Limbourg", "Charles Barry ve Augustus Pugin" → "Charles Barry, Augustus Pugin")
export function okunacakAd(ad) {
  return String(ad || '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s+kardeşler\b/gi, '')
    .replace(/\s+ve\s+/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Dil koduna ("nl") uyan ses ("nl-NL", "nl-BE"); varsayılan ya da yerel (çevrimdışı) olan önce. Yoksa null.
export function sesSec(sesler, dil) {
  if (!dil) return null;
  const uyan = (sesler || []).filter((v) => (v.lang || '').toLowerCase().replace('_', '-').split('-')[0] === dil);
  return uyan.find((v) => v.default) || uyan.find((v) => v.localService) || uyan[0] || null;
}

const sentez = () => (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null);

// sesler erken istenir: iOS listeyi geç doldurur, okuma ise dokunuşun içinde hemen başlamalı
function sesleriIsit() {
  const s = sentez();
  if (s && !s.getVoices().length) s.addEventListener('voiceschanged', () => s.getVoices(), { once: true });
}

// iOS 17+: ses "oynatma" türünde çalsın (sessiz moddayken de duyulsun)
function oynatmaOturumu() {
  try {
    if (navigator.audioSession && navigator.audioSession.type !== 'playback') navigator.audioSession.type = 'playback';
  } catch {
    /* desteklenmiyor */
  }
}

function sesGelmedi() {
  import('./ekranlar/ortak.js').then(({ bildir }) => bildir('Ses çıkmadı: telefonun sesi açık mı, sessiz mod kapalı mı? Bir daha dene.')).catch(() => {});
}

// Okunuş dosyası: gerçek kayıt (mp3) ya da Mac'te üretilmiş okunuş (m4a, İş 49d); yoksa null (telefon okur)
export function sesDosyasi(s, k) {
  if (k.ses) return `gorseller/ses/${encodeURIComponent(s.id)}.mp3`;
  if (k.okunus) return `gorseller/ses/${encodeURIComponent(s.id)}.m4a`;
  return null;
}

// Dosya Web Audio ile çalınır (İş 49d): indirilir, çözülür, çalınır. iPhone'da ses öğesi (Audio) service worker
// ve parça (Range) istekleriyle sessiz kalabiliyor; Web Audio'da bu yok. Bağlam dokunuşun içinde açılır (iOS kilidi).
let baglam = null;
function sesBaglami() {
  const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
  if (!AC) return null;
  if (!baglam || baglam.state === 'closed') baglam = new AC();
  if (baglam.state !== 'running') baglam.resume().catch(() => {});
  // iOS: dokunuşta boş bir ses çalmak bağlamın kilidini açar
  try {
    const bos = baglam.createBufferSource();
    bos.buffer = baglam.createBuffer(1, 1, 22050);
    bos.connect(baglam.destination);
    bos.start(0);
  } catch {
    /* önemsiz */
  }
  return baglam;
}

const cozulmus = new Map();
function dosyayiCal(url, dugme, bitince) {
  const ctx = sesBaglami();
  let durdu = false;
  let kaynak = null;
  let yedek = null;
  calan = {
    dugme,
    durdur: () => {
      durdu = true;
      try {
        kaynak && kaynak.stop();
      } catch {
        /* zaten bitti */
      }
      if (yedek) yedek.pause();
      bitince();
    },
  };
  // Web Audio yoksa ya da çözülemezse ses öğesiyle dene
  const ogeyleCal = () => {
    if (durdu) return;
    yedek = new Audio(url);
    yedek.addEventListener('ended', bitince);
    yedek.addEventListener('error', () => (bitince(), sesGelmedi()));
    yedek.play().catch(() => (bitince(), sesGelmedi()));
  };
  if (!ctx) return ogeyleCal();
  const tampon =
    cozulmus.get(url) ||
    fetch(url)
      .then((y) => {
        if (!y.ok) throw new Error(String(y.status));
        return y.arrayBuffer();
      })
      .then((b) => new Promise((coz, red) => ctx.decodeAudioData(b, coz, red)));
  cozulmus.set(url, tampon);
  tampon
    .then((b) => {
      if (durdu) return;
      if (ctx.state !== 'running') ctx.resume().catch(() => {});
      kaynak = ctx.createBufferSource();
      kaynak.buffer = b;
      kaynak.connect(ctx.destination);
      kaynak.onended = bitince;
      kaynak.start(0);
    })
    .catch(() => {
      cozulmus.delete(url);
      ogeyleCal();
    });
}

let calan = null;
// iOS'ta okuma dokunuşun içinde, beklemeden başlamalı: önce bekleyip (await) sonra speak() çağrılırsa ses çıkmaz
function oku(s, k, dugme) {
  // durdur() calan'ı sıfırlar: önce hangi düğme olduğu alınır (aynı düğmeye ikinci dokunuş = durdur)
  const onceki = calan;
  if (onceki) {
    onceki.durdur();
    calan = null;
    if (onceki.dugme === dugme) return;
  }
  const bitince = () => {
    dugme.classList.remove('caliyor');
    if (calan && calan.dugme === dugme) calan = null;
  };
  dugme.classList.add('caliyor');
  oynatmaOturumu();
  const dosya = sesDosyasi(s, k);
  if (dosya) return dosyayiCal(dosya, dugme, bitince);
  const sz = sentez();
  if (!sz) return bitince();
  const u = new SpeechSynthesisUtterance(okunacakAd(s.ad));
  u.lang = k.dil;
  const v = sesSec(sz.getVoices(), k.dil);
  if (v) u.voice = v;
  u.rate = 0.85;
  let basladi = false;
  u.onstart = () => (basladi = true);
  u.onend = bitince;
  u.onerror = bitince;
  // cancel() hemen ardından speak() iOS'ta okumayı yutabilir: yalnız gerçekten okuyorsa durdur
  if (sz.speaking || sz.pending) sz.cancel();
  sz.speak(u);
  if (sz.paused) sz.resume();
  // u calan'da tutulur: Safari başlamadan çöpe atılan sözceyi okumaz
  calan = { dugme, u, durdur: () => (sz.cancel(), bitince()) };
  setTimeout(() => {
    if (!basladi && calan && calan.u === u) {
      sz.cancel();
      bitince();
      sesGelmedi();
    }
  }, 3000);
}

// IPA'nın dili (sanatçının adının okunduğu dilden farklıysa yanında yazılır)
const DIL_ADI = {
  de: 'Almanca', nl: 'Felemenkçe', fr: 'Fransızca', it: 'İtalyanca', es: 'İspanyolca', en: 'İngilizce', ca: 'Katalanca',
  no: 'Norveççe', nb: 'Norveççe', ru: 'Rusça', el: 'Yunanca', grc: 'Eski Yunanca', ja: 'Japonca', pl: 'Lehçe',
  cs: 'Çekçe', hu: 'Macarca', pt: 'Portekizce', sv: 'İsveççe', da: 'Danca', fi: 'Fince', la: 'Latince',
};

// "Evrensel okunuş": IPA (Uluslararası Fonetik Alfabe) yazımı, Vikipedi'den (İş 49e)
export function ipaHtml(ipa, okunusDili) {
  if (!ipa || !ipa.yazi) return '';
  const kac = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const ayni = (a, b) => a === b || ((a === 'no' || a === 'nb') && (b === 'no' || b === 'nb'));
  const dil = ipa.dil && !ayni(ipa.dil, okunusDili) && DIL_ADI[ipa.dil] ? `<span class="ipa-dil">${DIL_ADI[ipa.dil]}</span>` : '';
  return `<span class="ipa" data-test="ipa" title="Uluslararası Fonetik Alfabe ile okunuşu (Vikipedi)"><abbr class="ipa-etiket" title="Uluslararası Fonetik Alfabe">IPA</abbr><span class="ipa-yazi" lang="${kac(ipa.dil || 'und')}-fonipa">${kac(ipa.yazi)}</span>${dil}</span>`;
}

const HOPARLOR =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path class="dalga" d="M15.5 8.5a5 5 0 0 1 0 7"/><path class="dalga uzak" d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';

// kutu: isim bloğu (.isim-blok). Portre bloğun arkasına, "Dinle" adın hemen altına (.isim-ek).
export async function kunyeGoster(s, kutu) {
  if (!kutu) return;
  const k = (await kunyeVeri())[s.id];
  if (!k || !kutu.isConnected || kutu.querySelector('.isim-ek')) return;
  const okunur = !!sesDosyasi(s, k) || (!!k.dil && !!sentez());
  if (!sesDosyasi(s, k) && okunur) sesleriIsit();
  if (!k.portre && !okunur && !k.ipa) return;
  // portre adın arkasında, sağ üstte büyük ve silik (İş 49b: Emre'nin seçimi); ad ve imza üstünde durur
  if (k.portre) {
    const img = document.createElement('img');
    img.className = 'portre-arka';
    img.alt = `${s.ad} portresi`;
    img.title = 'Portre: Wikimedia Commons';
    img.decoding = 'async';
    // genişlik adreste: büyük portre gelince görsel önbelleğindeki eski küçük kopya kullanılmaz
    img.src = `gorseller/portre/${encodeURIComponent(s.id)}.jpg?en=${k.portre_en || 0}`;
    img.addEventListener('load', () => img.classList.add('yuklendi'));
    img.addEventListener('error', () => img.remove());
    kutu.classList.add('portreli');
    kutu.prepend(img);
  }
  if (!okunur && !k.ipa) return;
  const ek = document.createElement('div');
  ek.className = 'isim-ek';
  if (okunur) ek.append(dinleDugmesi(s, k));
  if (k.ipa) ek.insertAdjacentHTML('beforeend', ipaHtml(k.ipa, k.dil));
  const ad = kutu.querySelector('.isim');
  if (ad) ad.after(ek);
  else kutu.prepend(ek);
  // imza bu satırın altına gelir (önce yerleştiyse taşınır)
  const imza = kutu.querySelector('.imza-kap');
  if (imza) ek.after(imza);
}

function dinleDugmesi(s, k) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'dinle';
  b.dataset.test = 'dinle';
  b.setAttribute('aria-label', `${s.ad}: adı nasıl okunur, dinle`);
  b.innerHTML = `${HOPARLOR}<span>Dinle</span>`;
  b.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    oku(s, k, b);
  });
  return b;
}
