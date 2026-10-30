// İş 90–91: haritadaki öğrencinin pozları (GPT Image 2, Vercel AI Gateway).
// İş 91 (Emre: "karakteri hiç beğenmedim, aşırı yapay zekâ ürünü duruyor, temaya uysun, daha akıcı olsun"): yeni
// karakter haritanın kendi resmi örnek alınarak çizilir: o resmin içinde boyanmış küçük bir figür gibi (gevşek fırça,
// haritanın renkleri, yüz yalnız birkaç fırça vuruşu), parlak dijital çizim değil. Yürüyüş 4 karelik adım döngüsü.
//
// 1) Taslak: node poz.mjs taslak --calistir
//    Rönesans haritasından üç ayrı karakter fikri: gezgin-a, gezgin-b, gezgin-c (cikti/ronesans/sprite/). ~0,39 $
// 2) Seçilenle bütün pozlar: node poz.mjs gezgin-a hepsi --calistir   (ya da tek dönem: node poz.mjs gezgin-a barok)
//    Rönesans dışındaki dönemlerde önce aynı kişi o dönemin kıyafetiyle ve o haritanın üslubunda çizilir, sonra pozlar:
//    <ad>-yuru-1..4 (yandan, sola yürür: 4 karelik adım), <ad>-arka-1..2 (arkadan, uzaklaşır), <ad>-eskiz (çizer).
//    Kareler birinci adımın üstünden çizilir (aynı kişi, aynı boy). Var olanın üstüne yazılmaz.
// 3) Sonra: sh gonder.sh "Gezgin pozları" (uygulamaya hazırlamayı Claude yapar: yolcu_hazirla.py --karakter <ad>).
// Eski öğrenci için de çalışır: node poz.mjs karakter ronesans
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { createGateway, generateImage } from 'ai';

const BURASI = path.dirname(fileURLToPath(import.meta.url));
const KOK = path.resolve(BURASI, '../..');
const DONEMLER = ['ortacag', 'ronesans', 'barok', 'barok2', 'aydinlanma', 'romantik', 'empresyonizm', 'postempresyonizm', 'modern'];
const FIYAT = 0.13; // $ / resim (kaba; gerçeği Vercel panosunda)
const ANA = 'ronesans'; // karakter önce burada seçilir; öbür dönemler bundan

// Üslup: haritanın içinde boyanmış bir figür (Image N: o dönemin haritası)
const stil = (n) =>
  `Paint him as a small figure that truly belongs inside the painting in Image ${n}: the same loose, visible brushwork, the same muted palette, the same soft and slightly broken edges, and the same simplified way the people in that painting are painted. It must NOT look like a glossy digital illustration: no smooth airbrushed shading, no crisp clean outline, no plastic skin, no cartoon, anime or video-game look, no big eyes, no posed smile. The face is small and only suggested with a few brushstrokes. Seen from slightly above, at the same 3/4 bird's-eye angle as the painting.`;
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

// 2) Dönem kıyafetleri (öbür dönemler: aynı kişi, aynı eşyalar)
const KIYAFET = {
  ortacag: 'clothing of 14th-century Italy: a simple belted wool tunic in muted red, a hooded short cape, hose and soft leather shoes',
  barok: '17th-century Dutch clothing: a dark doublet with a wide white falling collar, breeches, boots and a broad-brimmed felt hat',
  barok2: 'late 17th-century French clothing: a long dark blue coat with turned-back cuffs, a lace cravat, breeches, stockings, buckled shoes and a tricorne hat',
  aydinlanma: 'mid-18th-century clothing: a long pale blue frock coat, a cream waistcoat, breeches, stockings and buckled shoes, his hair tied back with a ribbon',
  romantik: 'mid-19th-century clothing: a dark green frock coat, a loosely tied red cravat, grey trousers and boots',
  empresyonizm: 'the clothes of a young Parisian of the 1870s on a summer day: a light linen jacket, light trousers and a straw boater hat',
  postempresyonizm: "the clothes of a young painter of the 1890s in the south of France: a loose blue workman painter's smock, a red neckerchief, brown corduroy trousers and boots",
  modern: 'the clothes of an art student of the 1950s: a black turtleneck sweater, trousers rolled at the ankle and canvas shoes',
};
const donemTaban = (d) =>
  `The same young man as in Image 1, with the same build, posture, accessories and the same view (from the same side, the face just as hidden or suggested), now dressed in ${KIYAFET[d]}. ${stil(2)}`;

// 3) Pozlar (Image 1: o dönemin karakteri ya da birinci adım; Image 2: o dönemin haritası)
const AYNI = 'The same figure as in Image 1, exactly the same person, clothes, size, framing and painting style';
const POZLAR = [
  { ek: 'yuru-1', grup: 'yuru', metin: `He is walking to the LEFT, seen from the side (profile, a little turned toward the viewer): first step of a walk cycle, his LEFT leg forward with the heel touching down and his right leg back, arms swinging naturally.` },
  { ek: 'arka-1', grup: 'arka', metin: 'He is seen from BEHIND (back view, a little from above), walking AWAY from the viewer up a road, mid-stride with his LEFT leg forward; we see his back and the back of his head.' },
  { ek: 'eskiz', grup: 'eskiz', metin: 'He is standing still, holding a sketchbook open in one hand and drawing in it with a pencil in the other, head bowed over his drawing, absorbed.' },
  { ek: 'yuru-2', grup: 'yuru', ornek: 'yuru-1', metin: `${AYNI}, walking to the LEFT, at the next moment of the walk cycle (passing position): his left leg is straight under his body carrying his weight and his right leg is bent, swinging forward past it, the body slightly higher, arms close to the body.` },
  { ek: 'yuru-3', grup: 'yuru', ornek: 'yuru-1', metin: `${AYNI}, walking to the LEFT, at the opposite step: now his RIGHT leg is forward with the heel touching down and his left leg back, arms swinging the other way.` },
  { ek: 'yuru-4', grup: 'yuru', ornek: 'yuru-1', metin: `${AYNI}, walking to the LEFT, passing position of the other leg: his right leg is straight under his body carrying his weight and his left leg is bent, swinging forward past it, the body slightly higher.` },
  { ek: 'arka-2', grup: 'arka', ornek: 'arka-1', metin: `${AYNI}, seen from behind walking away, but at the next step: now his RIGHT leg is forward and his left leg back.` },
];

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
async function haritaParcasi(d) {
  const secim = JSON.parse(await readFile(path.join(BURASI, `${d}_secim.json`), 'utf8'));
  return sharp(path.join(BURASI, secim.resim.replace(/^scripts\/harita\//, ''))).extract({ left: 0, top: 1024, width: 1024, height: 1024 }).jpeg({ quality: 88 }).toBuffer();
}

// yapılacak işler: { d, ad, metin, ornekler: [dosya yolu | 'harita'] }
function plan(karakter, donemler, yalniz) {
  const isler = [];
  if (karakter === 'taslak') {
    for (const t of TASLAKLAR) isler.push({ d: ANA, ad: t.ad, metin: `${t.metin}\n\n${stil(1)}`, ornekler: ['harita'] });
    return isler;
  }
  for (const d of donemler) {
    const taban = sprite(d, karakter);
    if (d !== ANA && karakter !== 'karakter') isler.push({ d, ad: karakter, metin: donemTaban(d), ornekler: [sprite(ANA, karakter), 'harita'] });
    for (const p of POZLAR) {
      if (yalniz && !yalniz.includes(p.grup)) continue;
      const kaynak = p.ornek ? sprite(d, `${karakter}-${p.ornek}`) : taban;
      isler.push({ d, ad: `${karakter}-${p.ek}`, metin: `${p.metin}\n\n${p.ornek ? '' : `Keep him exactly the same person as in Image 1. `}${stil(2)}`, ornekler: [kaynak, 'harita'] });
    }
  }
  return isler;
}

async function main() {
  const argv = process.argv.slice(2);
  const bayraklar = argv.filter((a) => a.startsWith('--'));
  const [karakter, hedef = ANA] = argv.filter((a) => !a.startsWith('--') && !(argv[argv.indexOf(a) - 1] === '--yalniz'));
  const donemler = hedef === 'hepsi' ? DONEMLER : DONEMLER.includes(hedef) ? [hedef] : null;
  if (!karakter || !donemler) throw new Error('Kullanım: node poz.mjs taslak --calistir   |   node poz.mjs <karakter> <dönem|hepsi> [--calistir] [--yalniz yuru,arka,eskiz]');
  const yalniz = bayraklar.includes('--yalniz') ? argv[argv.indexOf('--yalniz') + 1].split(',') : null;
  if (karakter !== 'taslak' && !existsSync(sprite(ANA, karakter))) throw new Error(`Önce Rönesans'ta ${karakter}.webp gerekir (node poz.mjs taslak --calistir)`);
  const isler = plan(karakter, donemler, yalniz).filter((i) => !existsSync(sprite(i.d, i.ad)));
  console.log(`${isler.length} resim, tahmini ~${(isler.length * FIYAT).toFixed(2)} $ (var olanlar atlanır)`);
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
    if (!haritalar.has(i.d)) haritalar.set(i.d, await haritaParcasi(i.d));
    process.stdout.write(`${i.d} ${i.ad} … `);
    try {
      const resimler = await Promise.all(i.ornekler.map((o) => (o === 'harita' ? haritalar.get(i.d) : ornek(o))));
      const sonuc = await generateImage({
        model: gateway.image('openai/gpt-image-2'),
        prompt: { text: `${i.metin}\n\n${ZEMIN}`, images: resimler },
        size: '1024x1024',
        providerOptions: { openai: { quality: 'high' } },
      });
      const png = await saydamYap(Buffer.from(sonuc.image.uint8Array));
      const kirpik = await sharp(png).trim().toBuffer();
      await mkdir(path.dirname(sprite(i.d, i.ad)), { recursive: true });
      await writeFile(sprite(i.d, i.ad), await sharp(kirpik).webp({ quality: 92, alphaQuality: 100 }).toBuffer());
      const m = await sharp(kirpik).metadata();
      console.log(`tamam (${m.width}×${m.height}, ${sonuc.providerMetadata?.gateway?.cost ?? '?'} $)`);
    } catch (e) {
      // kimlik hatasında altta yatan sebep (anahtarı içermez) de yazılır
      const neden = e && e.cause && e.cause.message ? ` (sebep: ${e.cause.message})` : '';
      console.log(`HATA: ${e && e.message ? e.message.split('\n')[0] : e}${neden}`);
      if (/authentication/i.test(String(e && e.message))) return;
    }
  }
  console.log(`\nSonra: sh gonder.sh "${karakter === 'taslak' ? 'Gezgin taslakları' : 'Gezgin pozları'}"`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
