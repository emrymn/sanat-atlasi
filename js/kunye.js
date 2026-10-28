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

function sesleriAl() {
  const s = sentez();
  if (!s) return Promise.resolve([]);
  const v = s.getVoices();
  if (v.length) return Promise.resolve(v);
  // iOS sesleri geç yükler
  return new Promise((coz) => {
    const bitti = () => coz(s.getVoices());
    s.addEventListener('voiceschanged', bitti, { once: true });
    setTimeout(bitti, 800);
  });
}

let calan = null;
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
  if (k.ses) {
    const a = new Audio(`gorseller/ses/${encodeURIComponent(s.id)}.mp3`);
    a.addEventListener('ended', bitince);
    a.addEventListener('error', bitince);
    a.play().catch(bitince);
    calan = { dugme, durdur: () => (a.pause(), bitince()) };
    return;
  }
  const sz = sentez();
  if (!sz) return bitince();
  sesleriAl().then((sesler) => {
    const u = new SpeechSynthesisUtterance(okunacakAd(s.ad));
    u.lang = k.dil;
    const v = sesSec(sesler, k.dil);
    if (v) u.voice = v;
    u.rate = 0.85;
    u.onend = bitince;
    u.onerror = bitince;
    sz.cancel();
    sz.speak(u);
    calan = { dugme, durdur: () => (sz.cancel(), bitince()) };
  });
}

const HOPARLOR =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path class="dalga" d="M15.5 8.5a5 5 0 0 1 0 7"/><path class="dalga uzak" d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';

// kutu: isim bloğu (.isim-blok). Portre bloğun arkasına, "Dinle" adın hemen altına (.isim-ek).
export async function kunyeGoster(s, kutu) {
  if (!kutu) return;
  const k = (await kunyeVeri())[s.id];
  if (!k || !kutu.isConnected || kutu.querySelector('.isim-ek')) return;
  const okunur = !!k.ses || (!!k.dil && !!sentez());
  if (!k.portre && !okunur) return;
  // portre adın arkasında, sağ üstte büyük ve silik (İş 49b: Emre'nin seçimi); ad ve imza üstünde durur
  if (k.portre) {
    const img = document.createElement('img');
    img.className = 'portre-arka';
    img.alt = `${s.ad} portresi`;
    img.title = 'Portre: Wikimedia Commons';
    img.decoding = 'async';
    img.src = `gorseller/portre/${encodeURIComponent(s.id)}.jpg`;
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
