// İş 90–91: haritadaki öğrencinin pozları (GPT Image 2, Vercel AI Gateway).
// İş 91 (Emre: "karakteri hiç beğenmedim, aşırı yapay zekâ ürünü duruyor, temaya uysun, daha akıcı olsun"): yeni
// karakter haritanın kendi resmi örnek alınarak çizilir: o resmin içinde boyanmış küçük bir figür gibi (gevşek fırça,
// haritanın renkleri, yüz yalnız birkaç fırça vuruşu), parlak dijital çizim değil. Yürüyüş 4 karelik adım döngüsü.
//
// 1) Taslak: node poz.mjs taslak --calistir
//    Rönesans haritasından üç ayrı karakter fikri: gezgin-a, gezgin-b, gezgin-c (cikti/ronesans/sprite/). ~0,39 $
// 2) Öbür dönemlerin kendi karakterleri (her dönemde başka bir genç sanatçı, aynı biçimde):
//    node poz.mjs gezgin-a hepsi --yalniz taban --calistir   (~1 $; bakıp beğenilmeyen silinip yeniden çizilir)
// 3) Bütün pozlar: node poz.mjs gezgin-a hepsi --calistir   (ya da tek dönem: node poz.mjs gezgin-a barok)
//    <ad>-yuru-1..4 (yandan, sola yürür: 4 karelik adım), <ad>-arka-1..2 (arkadan, uzaklaşır), <ad>-on (önden, yaklaşır),
//    <ad>-eskiz (çizer). Yalnız önden pozlar (İş 93): node poz.mjs gezgin-a hepsi --yalniz on --calistir
//    Kareler birinci adımın üstünden çizilir (aynı kişi, aynı boy). Var olanın üstüne yazılmaz.
// 4) Sonra: sh gonder.sh "Gezgin pozları" (uygulamaya hazırlamayı Claude yapar: yolcu_hazirla.py --karakter <ad>).
// Eski öğrenci için de çalışır: node poz.mjs karakter ronesans
// 5) İş 94 (Emre: "haritadaki karakterler daha belirgin olsun"; seçtiği: gezgin gece kendi ışığını taşısın): gece
//    pozları. Bugüne kadar gece pozu gündüzün karartılmışıydı (yolcu_hazirla.py tonla); gece haritasında fenerler
//    yanarken gezgin hiç ışık almıyordu. Var olan her poz (duruş, önden, varsa ötekiler) Nano Banana Pro ile düzenlenir:
//    aynı kişi, o dönemin gece ışığıyla (GECE_ISIK). Çıktı <ad>-gece.webp, <ad>-on-gece.webp …
//    node poz.mjs gezgin-a barok,postempresyonizm --gece --calistir   (deneme: 4 resim, ~0,60 $)
//    node poz.mjs gezgin-a hepsi --gece --calistir
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { createGateway, generateImage, generateText } from 'ai';

const BURASI = path.dirname(fileURLToPath(import.meta.url));
const KOK = path.resolve(BURASI, '../..');
const DONEMLER = ['ortacag', 'ronesans', 'barok', 'barok2', 'aydinlanma', 'romantik', 'empresyonizm', 'postempresyonizm', 'modern'];
const FIYAT = 0.13; // $ / resim (kaba; gerçeği Vercel panosunda)
const GECE_FIYAT = 0.15; // Nano Banana Pro düzenlemesi (ciz.mjs ile aynı tahmin)
const GECE_MODEL = 'google/gemini-3-pro-image';
const ANA = 'ronesans'; // karakter önce burada seçilir; öbür dönemler bundan

// Üslup: haritanın içinde boyanmış bir figür (Image N: o dönemin haritası)
const stil = (n) =>
  `Paint the figure as a small figure that truly belongs inside the painting in Image ${n}: the same loose, visible brushwork, the same muted palette, the same soft and slightly broken edges, and the same simplified way the people in that painting are painted. It must NOT look like a glossy digital illustration: no smooth airbrushed shading, no crisp clean outline, no plastic skin, no cartoon, anime or video-game look, no big eyes, no posed smile. The face is small and only suggested with a few brushstrokes. Seen from slightly above, at the same 3/4 bird's-eye angle as the painting.`;
const ZEMIN =
  'Full body, nothing cropped, feet visible. Centred, filling about 80% of the image height. On a flat, solid, pure magenta background (#FF00FF) with no gradient, texture or shadow; never use magenta on the figure. No cast shadow, no ground, no text, no frame.';

// 1) Rönesans'ta üç karakter fikri (Image 1: Rönesans haritası)
const TASLAKLAR = [
  {
    ad: 'gezgin-a',
    metin:
      "A young art student of the Italian Renaissance seen from behind and a little to the side, like the wanderer seen from the back in Caspar David Friedrich's paintings: we see his back and the side of his head, not his face. A simple dark red wool tunic, grey hose and a soft dark cap, a leather satchel across his back and a large flat portfolio of drawings under his arm. He stands calmly, looking out over the landscape.",
  },
  {
    ad: 'gezgin-b',
    metin:
      'A young travelling painter of the Renaissance in three-quarter view, walking with a tall wooden staff, a folded wooden easel strapped to his back and a cloth bag at his hip; a plain earth-coloured tunic, hose and a soft cap; his face only lightly suggested and half in shadow.',
  },
  {
    ad: 'gezgin-c',
    metin:
      'A young apprentice painter of the Renaissance seen in profile, wrapped in a plain hooded travelling cloak in muted ochre and brown, carrying a small wooden paint box and a rolled canvas under his arm, his face mostly hidden by the hood; humble, like a pilgrim on the road.',
  },
];

// 2) İş 91 (Emre: "her dönemin karakteri farklı olsun"): her dönemde o dönemin kendi genç sanatçısı, Rönesans'taki
// gezginle aynı biçimde (sırtı ya da yanı dönük, yüzü belli belirsiz, elinde sanatçı eşyası, aynı boy ve çerçeve) ama
// başka bir kişi ve o dönemin haritasının üslubunda. Kadın ressamlar da var (Leyster, Vigée Le Brun, Morisot).
const KARAKTERLER = {
  // Orta Çağ: Giotto'nun Mısır'a Kaçış'ındaki Yusuf gibi asalı genç gezgin (Emre örneklerden seçti); Barok: Rembrandt'ın
  // öğrencisi, karanlık haritada elinde fener (Emre ilk fikirleri değiştirtti: atölye çırağı, Leyster gibi kadın ressam)
  ortacag:
    "a young traveller on the road in 14th-century Italy, like Joseph in Giotto's Flight into Egypt (Scrovegni Chapel) but young: a long greenish-grey tunic, a wide rust-orange cloak wrapped over one shoulder, a tall wooden walking staff in one hand and a cloth bundle tied to it over his shoulder, soft leather shoes, a short beard",
  barok:
    "a young pupil of Rembrandt in 17th-century Amsterdam: a long dark cloak over a dark doublet with a small white collar, a broad-brimmed black hat, holding up a small lit lantern that throws warm light on him, a rolled sketch under his arm",
  barok2:
    'a young student of the French Royal Academy in the late 17th century: a long deep blue coat with turned-back red cuffs, breeches, stockings, buckled shoes and a tricorne hat, a large portfolio of drawings under his arm',
  aydinlanma:
    'a young woman portrait painter of the 18th century, like Élisabeth Vigée Le Brun: a light dress with a pale shawl, her hair loosely up with a ribbon, carrying a folding easel and a small canvas',
  romantik:
    "a young wandering painter of the early 19th century, like the wanderer in Caspar David Friedrich's Wanderer above the Sea of Fog: a long dark green coat, boots, tousled hair, a walking stick and a sketching satchel",
  empresyonizm:
    'a young woman painting outdoors in the 1870s, like Berthe Morisot: a light summer dress, a straw hat with a ribbon, carrying a folding easel, a paint box and a small canvas',
  postempresyonizm:
    "a young painter in Provence in the 1880s, like Van Gogh in The Painter on the Road to Tarascon: a wide straw hat, a blue workman's smock, carrying a canvas, an easel and a paint box on his back",
  modern: 'a young art student of the 1950s: a black turtleneck, dark trousers, canvas shoes and a scarf, a large black portfolio under the arm',
};
const donemTaban = (d) =>
  `A different person from the one in Image 1, but shown, framed, sized and painted the same way (seen from behind and a little to the side, the face hidden or barely suggested, standing calmly): ${KARAKTERLER[d]}. ${stil(2)}`;

// 3) Pozlar (Image 1: o dönemin karakteri ya da birinci adım; Image 2: o dönemin haritası)
const AYNI = 'The same figure as in Image 1, exactly the same person, clothes, belongings, size, framing and painting style';
const POZLAR = [
  { ek: 'yuru-1', grup: 'yuru', metin: 'The figure is walking to the LEFT, seen from the side (profile, a little turned toward the viewer): first step of a walk cycle, the LEFT leg forward with the heel touching down and the right leg back, arms swinging naturally.' },
  { ek: 'arka-1', grup: 'arka', metin: 'The figure is seen from BEHIND (back view, a little from above), walking AWAY from the viewer up a road, mid-stride with the LEFT leg forward; we see the back and the back of the head.' },
  // İş 93: önden (izleyene doğru, patikada aşağı inerken); sırtı dönük duruşun tersi
  { ek: 'on', grup: 'on', metin: 'The figure is now seen from the FRONT, walking TOWARD the viewer down a road, mid-stride, arms swinging naturally, the same clothes and belongings now seen from the front; the face is small, in soft shadow and only suggested with a few brushstrokes (no detailed features).' },
  { ek: 'eskiz', grup: 'eskiz', metin: 'The figure is standing still, holding a sketchbook open in one hand and drawing in it with a pencil in the other, head bowed over the drawing, absorbed.' },
  { ek: 'yuru-2', grup: 'yuru', ornek: 'yuru-1', metin: `${AYNI}, walking to the LEFT, at the next moment of the walk cycle (passing position): the left leg is straight under the body carrying the weight and the right leg is bent, swinging forward past it, the body slightly higher, arms close to the body.` },
  { ek: 'yuru-3', grup: 'yuru', ornek: 'yuru-1', metin: `${AYNI}, walking to the LEFT, at the opposite step: now the RIGHT leg is forward with the heel touching down and the left leg back, arms swinging the other way.` },
  { ek: 'yuru-4', grup: 'yuru', ornek: 'yuru-1', metin: `${AYNI}, walking to the LEFT, passing position of the other leg: the right leg is straight under the body carrying the weight and the left leg is bent, swinging forward past it, the body slightly higher.` },
  { ek: 'arka-2', grup: 'arka', ornek: 'arka-1', metin: `${AYNI}, seen from behind walking away, but at the next step: now the RIGHT leg is forward and the left leg back.` },
];

// 5) Gece (İş 94): her dönemin gezgini o döneme ait bir ışık taşır; gece haritasında en parlak sıcak nokta o olur.
// Orta Çağ ve Rönesans gecesi serin ay ışığı tonunda (uygulama_hazirla.py SERIN), ötekiler fener tonunda.
const GECE_ISIK = {
  ortacag:
    'Cool silver moonlight from above rims his hood, shoulders and staff, and he now carries a small medieval horn lantern hanging from his staff, its candle glowing warm orange; that small warm light falls on his hand, his cloak and the bundle.',
  ronesans:
    'He now holds a small lit bronze oil lamp in one hand, its little flame glowing warm orange; that light falls on his hand, the portfolio, the satchel and the side of his tunic, while cool moonlight touches the top of his cap and shoulders.',
  barok:
    'The small lantern he holds up is now lit and is the only strong light: warm candle-orange light falls on his raised hand, the side of his hat brim, his white collar and the front of his cloak, and the rest of him sinks into deep night shadow, like a figure in a Rembrandt night scene.',
  barok2:
    'He now holds a brass candlestick with one lit candle; its warm light falls on his hand, his red cuffs, the portfolio and the side of his blue coat, the rest of him in soft night shadow.',
  aydinlanma:
    'She now carries a small round paper lantern on a short stick, glowing soft warm gold like the paper lanterns in the night painting; its light falls on her hand, her shawl and the side of her dress.',
  romantik:
    "No lamp: a full moon behind him gives a thin bright silver rim of light around his hair, shoulders, coat and stick, like Caspar David Friedrich's moonlit figures; the rest of him is in cool blue night shadow.",
  empresyonizm:
    'A small glass oil lantern now hangs from the handle of her paint box, glowing warm yellow like the gas lamps in the night painting; its light falls on her hand, the paint box and the lower part of her light dress, which glows softly against the night.',
  // İlk deneme (Emre: "şapkada mum hiç olmamış"): beş büyük mum taç gibi duruyordu, alevler pembe, bütün figür koyu
  // mor-maviye dönmüştü. Şimdi az, ince, küçük alevli mumlar; önlük gündüzkü mavisinde, yalnız koyulaşır.
  postempresyonizm:
    "Like Van Gogh, who is said to have painted at night with candles fixed to the brim of his straw hat: just three small, thin, plain white candles now stand upright on the brim of his straw hat (one at the front, one at each side), each with a tiny bright yellow-white flame; the candles are small compared to the hat, it must not look like a crown or a birthday cake. Their warm yellow candlelight falls softly on the top of the hat, the back of his neck, his shoulders and the canvas he carries. The rest of him is in night shadow, but his workman's smock keeps the same light blue as in Image 1, only darker: not saturated violet or deep ultramarine. He stays clearly readable as the same painter, not a dark silhouette.",
  modern:
    'He now holds a small metal flashlight pointed at the ground ahead; its cool white light catches his hand, his scarf and the edge of the portfolio, the rest of him in dark blue night shadow.',
};
const geceMetni = (d, poz) =>
  `Image 1 shows a small painted figure on a flat magenta background. Repaint exactly the same figure at night: the same person, clothes, belongings, ${poz === 'dur' ? 'pose' : 'pose and walking direction'}, size and framing, and the same loose brushwork; only the light changes. ${GECE_ISIK[d]} The light source must be clearly visible and be the brightest, warmest point of the figure, so the figure stands out in a dark painting. Flames and lamplight are yellow-white and orange; nothing on the figure is pink or magenta. Use the night palette and brushwork of the night painting in Image 2. The face stays small and only suggested. The light falls ONLY on the figure: the background stays the same flat, solid, pure magenta (#FF00FF) everywhere, with no glow, halo, light spill, cast shadow or ground on it. Full body, nothing cropped, feet visible, no text, no frame.`;

// Saydam değilse: köşelerden başlayıp mor zemini sil, kenardaki mor sızıntıyı temizle (sprite.mjs ile aynı)
async function saydamYap(veri) {
  const { data, info } = await sharp(veri).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 250) return sharp(veri).png().toBuffer();
  const o = (x, y) => (y * w + x) * 4;
  const ref = [data[0], data[1], data[2]];
  const yakin = (i) => Math.abs(data[i] - ref[0]) + Math.abs(data[i + 1] - ref[1]) + Math.abs(data[i + 2] - ref[2]) < 60;
  const goruldu = new Uint8Array(w * h);
  const yigin = [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]];
  while (yigin.length) {
    const [x, y] = yigin.pop();
    if (x < 0 || y < 0 || x >= w || y >= h || goruldu[y * w + x]) continue;
    goruldu[y * w + x] = 1;
    if (!yakin(o(x, y))) continue;
    data[o(x, y) + 3] = 0;
    yigin.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  for (let i = 0; i < data.length; i += 4) if (data[i] > 200 && data[i + 2] > 200 && data[i + 1] < 90) data[i + 3] = 0;
  const morumsu = (i) => (data[i] + data[i + 2]) / 2 - data[i + 1] > 70;
  for (let tur = 0; tur < 2; tur++) {
    const sil = [];
    for (let y = 1; y < h - 1; y++)
      for (let x = 1; x < w - 1; x++) {
        const i = o(x, y);
        if (data[i + 3] && morumsu(i) && (!data[o(x + 1, y) + 3] || !data[o(x - 1, y) + 3] || !data[o(x, y + 1) + 3] || !data[o(x, y - 1) + 3])) sil.push(i);
      }
    for (const i of sil) data[i + 3] = 0;
  }
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

// Anahtar: kabuktaki AI_GATEWAY_API_KEY, yoksa scripts/harita/.env. Kopyalarken eklenebilen boşluk, satır sonu (\r),
// düz ya da kıvrık tırnaklar temizlenir (kütüphane geçersiz karakterli anahtarda da "No authentication provided" der).
// Anahtarın kendisi hiçbir zaman yazdırılmaz; yalnız uzunluğu ve başı (vck_) denetlenir.
function anahtarOku() {
  let ham = process.env.AI_GATEWAY_API_KEY || '';
  const env = path.join(BURASI, '.env');
  if (!ham.trim() && existsSync(env)) {
    const satir = readFileSync(env, 'utf8').split(/\r?\n/).find((l) => /^\s*(export\s+)?AI_GATEWAY_API_KEY\s*=/.test(l)) || '';
    ham = satir.replace(/^\s*(export\s+)?AI_GATEWAY_API_KEY\s*=/, '');
  }
  const anahtar = ham.replace(/[\s'"\u2018\u2019\u201C\u201D\uFEFF]/g, '');
  if (!anahtar) throw new Error('AI_GATEWAY_API_KEY bulunamadı: scripts/harita/.env dosyasına AI_GATEWAY_API_KEY=... yazın');
  const garip = [...anahtar].filter((c) => c < '!' || c > '~').length;
  console.log(`Anahtar: ${anahtar.length} karakter, "vck_" ile başlıyor: ${anahtar.startsWith('vck_') ? 'evet' : 'hayır'}${garip ? `, ${garip} geçersiz karakter (yeniden yapıştırın)` : ''}`);
  if (garip) throw new Error('Anahtarda harf/rakam dışı karakter var; .env dosyasını silip yeniden oluşturun');
  return anahtar;
}

const ornek = async (p) => sharp(p).flatten({ background: '#ffffff' }).resize(512, 512, { fit: 'contain', background: '#ffffff' }).png().toBuffer();
const sprite = (d, ad) => path.join(BURASI, 'cikti', d, 'sprite', `${ad}.webp`);
async function haritaParcasi(d, gece = false) {
  const secim = JSON.parse(await readFile(path.join(BURASI, `${d}_secim.json`), 'utf8'));
  const dosya = path.join(BURASI, (gece ? secim.resim_gece : secim.resim).replace(/^scripts\/harita\//, ''));
  // gece resimleri farklı boyda olabilir: önce 1024×3072'ye getirilir (uygulama_hazirla.py gibi), ortası kesilir
  return sharp(await sharp(dosya).resize(1024, 3072, { fit: 'fill' }).toBuffer()).extract({ left: 0, top: 1024, width: 1024, height: 1024 }).jpeg({ quality: 88 }).toBuffer();
}
// Gece düzenlemesi için: saydam poz düz mor zeminde, kare (model zemini korusun, saydamYap yine silebilsin)
const morZeminde = async (p) =>
  sharp(p).resize(900, 900, { fit: 'contain', background: '#ff00ff' }).extend({ top: 62, bottom: 62, left: 62, right: 62, background: '#ff00ff' }).flatten({ background: '#ff00ff' }).png().toBuffer();

// İş 94: o dönemde var olan gündüz pozları (gece sürümleri hariç): [{ poz, dosya }]
function gunduzPozlari(d, karakter) {
  const klasor = path.join(BURASI, 'cikti', d, 'sprite');
  const desen = new RegExp(`^${karakter.replace(/[-]/g, '\\-')}(?:-(yuru-\\d+|arka-\\d+|on|eskiz))?\\.webp$`);
  if (!existsSync(klasor)) return [];
  return readdirSync(klasor)
    .map((f) => desen.exec(f))
    .filter(Boolean)
    .map((m) => ({ poz: m[1] || 'dur', dosya: path.join(klasor, m[0]) }));
}

// yapılacak işler: { d, ad, metin, ornekler: [dosya yolu | 'harita'], gece? }
function plan(karakter, donemler, yalniz, gece) {
  const isler = [];
  if (gece) {
    // İş 94: her gündüz pozunun gece sürümü (Image 1: poz mor zeminde, Image 2: o dönemin gece haritası)
    for (const d of donemler)
      for (const { poz, dosya } of gunduzPozlari(d, karakter)) {
        if (yalniz && !yalniz.includes(poz.replace(/-\d+$/, ''))) continue;
        isler.push({ d, ad: `${path.basename(dosya, '.webp')}-gece`, metin: geceMetni(d, poz), ornekler: [dosya, 'harita'], gece: true });
      }
    return isler;
  }
  if (karakter === 'taslak') {
    for (const t of TASLAKLAR) isler.push({ d: ANA, ad: t.ad, metin: `${t.metin}\n\n${stil(1)}`, ornekler: ['harita'] });
    return isler;
  }
  for (const d of donemler) {
    const taban = sprite(d, karakter);
    if (d !== ANA && karakter !== 'karakter' && (!yalniz || yalniz.includes('taban'))) isler.push({ d, ad: karakter, metin: donemTaban(d), ornekler: [sprite(ANA, karakter), 'harita'] });
    for (const p of POZLAR) {
      if (yalniz && !yalniz.includes(p.grup)) continue;
      const kaynak = p.ornek ? sprite(d, `${karakter}-${p.ornek}`) : taban;
      isler.push({ d, ad: `${karakter}-${p.ek}`, metin: `${p.metin}\n\n${p.ornek ? '' : `Keep exactly the same person as in Image 1: same clothes, belongings and painting style. `}${stil(2)}`, ornekler: [kaynak, 'harita'] });
    }
  }
  return isler;
}

async function main() {
  const argv = process.argv.slice(2);
  const bayraklar = argv.filter((a) => a.startsWith('--'));
  const [karakter, hedef = ANA] = argv.filter((a) => !a.startsWith('--') && !(argv[argv.indexOf(a) - 1] === '--yalniz'));
  // dönem, virgülle birkaç dönem ya da hepsi
  const secilen = hedef === 'hepsi' ? DONEMLER : hedef.split(',');
  const donemler = secilen.every((d) => DONEMLER.includes(d)) ? secilen : null;
  if (!karakter || !donemler)
    throw new Error('Kullanım: node poz.mjs taslak --calistir   |   node poz.mjs <karakter> <dönem[,dönem…]|hepsi> [--gece] [--calistir] [--yalniz yuru,arka,eskiz]');
  const yalniz = bayraklar.includes('--yalniz') ? argv[argv.indexOf('--yalniz') + 1].split(',') : null;
  const gece = bayraklar.includes('--gece');
  if (karakter !== 'taslak' && !existsSync(sprite(ANA, karakter))) throw new Error(`Önce Rönesans'ta ${karakter}.webp gerekir (node poz.mjs taslak --calistir)`);
  const isler = plan(karakter, donemler, yalniz, gece).filter((i) => !existsSync(sprite(i.d, i.ad)));
  console.log(`${isler.length} resim, tahmini ~${(isler.length * (gece ? GECE_FIYAT : FIYAT)).toFixed(2)} $ (var olanlar atlanır)`);
  for (const i of isler) console.log(`  ${i.d.padEnd(17)} ${i.ad}`);
  if (!bayraklar.includes('--calistir')) {
    console.log(`\nPlan bu. Çizmek için: node poz.mjs ${argv.join(' ')} --calistir`);
    return;
  }
  const gateway = createGateway({ apiKey: anahtarOku() });
  const haritalar = new Map();
  for (const i of isler) {
    if (existsSync(sprite(i.d, i.ad))) continue;
    const eksik = i.ornekler.find((o) => o !== 'harita' && !existsSync(o));
    if (eksik) {
      console.log(`${i.d} ${i.ad}: önce ${path.basename(eksik)} gerekir, atlandı`);
      continue;
    }
    const hk = `${i.d}${i.gece ? '-gece' : ''}`;
    if (!haritalar.has(hk)) haritalar.set(hk, await haritaParcasi(i.d, i.gece));
    process.stdout.write(`${i.d} ${i.ad} … `);
    try {
      let ham;
      let maliyet;
      if (i.gece) {
        // İş 94: Nano Banana Pro düzenlemesi (gece haritaları gibi: var olan resmi yer kaydırmadan yeniden boyar)
        const resimler = await Promise.all(i.ornekler.map((o) => (o === 'harita' ? haritalar.get(hk) : morZeminde(o))));
        const sonuc = await generateText({
          model: gateway(GECE_MODEL),
          messages: [{ role: 'user', content: [{ type: 'text', text: i.metin }, ...resimler.map((r) => ({ type: 'file', data: r, mediaType: 'image/png' }))] }],
          providerOptions: { google: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '1:1', imageSize: '1K' } } },
        });
        const dosya = sonuc.files.find((f) => f.mediaType.startsWith('image/'));
        if (!dosya) throw new Error(`görsel dönmedi; metin: ${sonuc.text.slice(0, 200)}`);
        ham = Buffer.from(dosya.uint8Array);
        maliyet = sonuc.providerMetadata?.gateway?.cost;
      } else {
        const resimler = await Promise.all(i.ornekler.map((o) => (o === 'harita' ? haritalar.get(hk) : ornek(o))));
        const sonuc = await generateImage({
          model: gateway.image('openai/gpt-image-2'),
          prompt: { text: `${i.metin}\n\n${ZEMIN}`, images: resimler },
          size: '1024x1024',
          providerOptions: { openai: { quality: 'high' } },
        });
        ham = Buffer.from(sonuc.image.uint8Array);
        maliyet = sonuc.providerMetadata?.gateway?.cost;
      }
      // Nano Banana saydamlık döndürmez: mor zemin her durumda silinir (saydamYap yalnız tamamen opaksa siler)
      const png = await saydamYap(i.gece ? await sharp(ham).removeAlpha().png().toBuffer() : ham);
      const kirpik = await sharp(png).trim().toBuffer();
      await mkdir(path.dirname(sprite(i.d, i.ad)), { recursive: true });
      await writeFile(sprite(i.d, i.ad), await sharp(kirpik).webp({ quality: 92, alphaQuality: 100 }).toBuffer());
      const m = await sharp(kirpik).metadata();
      console.log(`tamam (${m.width}×${m.height}, ${maliyet ?? '?'} $)`);
    } catch (e) {
      // kimlik hatasında altta yatan sebep (anahtarı içermez) de yazılır
      const neden = e && e.cause && e.cause.message ? ` (sebep: ${e.cause.message})` : '';
      console.log(`HATA: ${e && e.message ? e.message.split('\n')[0] : e}${neden}`);
      if (/authentication/i.test(String(e && e.message))) return;
    }
  }
  console.log(`\nSonra: sh gonder.sh "${karakter === 'taslak' ? 'Gezgin taslakları' : gece ? 'Gezgin gece pozları' : 'Gezgin pozları'}"`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
