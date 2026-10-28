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

let calan = null;
// iOS'ta okuma dokunuşun içinde, beklemeden başlamalı: önce bekleyip (await) sonra speak() çağrılırsa ses çıkmaz
function oku(s, k, dugme) {
  if (calan) {
    calan.durdur();
    if (calan.dugme === dugme) return (calan = null);
  }
  const bitince = () => {
    dugme.classList.remove('caliyor');
    if (calan && calan.dugme === dugme) calan = null;
  };
  dugme.classList.add('caliyor');
  oynatmaOturumu();
  if (k.ses) {
    const a = new Audio(`gorseller/ses/${encodeURIComponent(s.id)}.mp3`);
    a.addEventListener('ended', bitince);
    a.addEventListener('error', () => (bitince(), sesGelmedi()));
    a.play().catch(() => (bitince(), sesGelmedi()));
    calan = { dugme, durdur: () => (a.pause(), bitince()) };
    return;
  }
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

const HOPARLOR =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path class="dalga" d="M15.5 8.5a5 5 0 0 1 0 7"/><path class="dalga uzak" d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';

// kutu: isim bloğu (.isim-blok). Portre bloğun arkasına, "Dinle" adın hemen altına (.isim-ek).
export async function kunyeGoster(s, kutu) {
  if (!kutu) return;
  const k = (await kunyeVeri())[s.id];
  if (!k || !kutu.isConnected || kutu.querySelector('.isim-ek')) return;
  const okunur = !!k.ses || (!!k.dil && !!sentez());
  if (!k.ses && okunur) sesleriIsit();
  if (!k.portre && !okunur) return;
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
  if (!okunur) return;
  const ek = document.createElement('div');
  ek.className = 'isim-ek';
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
  ek.append(b);
  const ad = kutu.querySelector('.isim');
  if (ad) ad.after(ek);
  else kutu.prepend(ek);
  // imza bu satırın altına gelir (önce yerleştiyse taşınır)
  const imza = kutu.querySelector('.imza-kap');
  if (imza) ek.after(imza);
}
