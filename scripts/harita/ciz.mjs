// Yeni harita (İş 41): bir dönemin resmini Vercel AI Gateway üzerinden birkaç modelle çizer.
// Model, yol iskeletini (iskelet/<dönem>_iskelet.png) kesin yerleşim rehberi olarak alır; seviye noktaları
// iskeletten bilindiği için çizimden sonra işaretlenmez. Uygulamaya dokunmaz: çıktılar cikti/<dönem>/ altına.
//
// Emre'nin Mac'inde çalışır (bu oturumdan Vercel'e erişilemiyor):
//   cd scripts/harita && npm ci
//   export AI_GATEWAY_API_KEY=...
//   node ciz.mjs ronesans              → yalnız plan ve tahmini maliyet (hiçbir şey harcanmaz)
//   node ciz.mjs ronesans --calistir   → çizer
//   node ciz.mjs ronesans --calistir --yalniz gpt-image-2-yalin   → tek iş
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { gateway, generateImage, generateText } from 'ai';

const BURASI = path.dirname(fileURLToPath(import.meta.url));
const KOK = path.resolve(BURASI, '../..');
const W = 1024;
const H = 3072;
const DOLGU = { r: 214, g: 210, b: 198 }; // taslağın dışına eklenen düz kenar (modelden doldurması istenir)

// Deneme turu (Emre'nin seçimi): GPT Image 2 ve Nano Banana Pro hem referanssız hem referanslı;
// ötekiler yalnız referanssız. oran: modelden istenen en-boy; 1:3 tek parçada çizilemiyorsa taslak o orana
// düz kenarla genişletilir, çıktıdan ortadaki 1:3 kesilir. fiyat: kaba tahmin ($), yalnız planda gösterilir.
const ISLER = [
  { ad: 'gpt-image-2-yalin', model: 'openai/gpt-image-2', tur: 'gorsel', oran: '1:3', boyut: '1024x3072', ref: false, fiyat: 0.3 },
  { ad: 'gpt-image-2-ref', model: 'openai/gpt-image-2', tur: 'gorsel', oran: '1:3', boyut: '1024x3072', ref: true, fiyat: 0.35 },
  { ad: 'nano-banana-pro-yalin', model: 'google/gemini-3-pro-image', tur: 'gemini', oran: '9:16', ref: false, fiyat: 0.24 },
  { ad: 'nano-banana-pro-ref', model: 'google/gemini-3-pro-image', tur: 'gemini', oran: '9:16', ref: true, fiyat: 0.26 },
  { ad: 'nano-banana-2-yalin', model: 'google/gemini-3.1-flash-image', tur: 'gemini', oran: '1:4', ref: false, fiyat: 0.1 },
  { ad: 'flux-2-pro-yalin', model: 'bfl/flux-2-pro', tur: 'gorsel', oran: '1:3', boyut: '1024x3072', ref: false, fiyat: 0.08 },
  { ad: 'seedream-5-pro-yalin', model: 'bytedance/seedream-5.0-pro', tur: 'gorsel', oran: '1:3', boyut: '1024x3072', ref: false, fiyat: 0.05 },
  { ad: 'grok-imagine-2-yalin', model: 'spacexai/grok-imagine-image-2.0', tur: 'gorsel', oran: '1:2', ref: false, fiyat: 0.04 },
];

const oranSayi = (o) => {
  const [a, b] = o.split(':').map(Number);
  return a / b;
};

// Taslağı istenen orana getirir: daha uzun oran (1:4) → üstüne ve altına, daha geniş oran (9:16, 1:2) → iki yanına kenar.
// Dönen kutu: taslağın genişletilmiş tuvaldeki yeri (oranla); çıktıdan aynı kutu kesilir.
export async function tuvaleYerlestir(png, oran) {
  const r = oranSayi(oran);
  if (Math.abs(r - W / H) < 1e-6) return { resim: png, kutu: { x: 0, y: 0, w: 1, h: 1 }, dolgu: false };
  const tw = r > W / H ? Math.round(H * r) : W;
  const th = r > W / H ? H : Math.round(W / r);
  const sol = Math.round((tw - W) / 2);
  const ust = Math.round((th - H) / 2);
  const resim = await sharp({ create: { width: tw, height: th, channels: 3, background: DOLGU } })
    .composite([{ input: png, left: sol, top: ust }])
    .png()
    .toBuffer();
  return { resim, kutu: { x: sol / tw, y: ust / th, w: W / tw, h: H / th }, dolgu: true };
}

export async function kes(cikti, kutu) {
  const m = await sharp(cikti).metadata();
  const alan = {
    left: Math.round(kutu.x * m.width),
    top: Math.round(kutu.y * m.height),
    width: Math.round(kutu.w * m.width),
    height: Math.round(kutu.h * m.height),
  };
  return { png: await sharp(cikti).extract(alan).resize(W, H, { fit: 'fill' }).png().toBuffer(), ham: m, alan };
}

function istemKur(temel, is, dolgu, referanslar) {
  let metin = temel.trim();
  if (dolgu) {
    metin +=
      '\n\nThe flat grey margins around the sketch are not part of the layout: fill them with the same scenery continuing naturally. The road and the 7 ovals inside the sketch area must stay exactly where they are.';
  }
  if (is.ref) {
    const liste = referanslar.map((t, i) => `Image ${i + 2}: ${t.sanatci}, ${t.eser} (for level ${t.seviye}).`).join('\n');
    metin +=
      `\n\nImage 1 is the layout sketch. The other images are the original paintings for the hidden details; use them only as references so those details look like the real works. Blend them into the landscape; never paste them as framed pictures.\n${liste}`;
  }
  return metin;
}

async function ciz(is, istem, gorseller, oran) {
  if (is.tur === 'gemini') {
    const sonuc = await generateText({
      model: gateway(is.model),
      messages: [
        {
          role: 'user',
          content: [{ type: 'text', text: istem }, ...gorseller.map((g) => ({ type: 'image', image: g, mediaType: 'image/png' }))],
        },
      ],
      providerOptions: { google: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: oran, imageSize: '2K' } } },
    });
    const dosya = sonuc.files.find((f) => f.mediaType.startsWith('image/'));
    if (!dosya) throw new Error(`görsel dönmedi; metin: ${sonuc.text.slice(0, 200)}`);
    return { veri: Buffer.from(dosya.uint8Array), ek: { usage: sonuc.usage, providerMetadata: sonuc.providerMetadata } };
  }
  const sonuc = await generateImage({
    model: gateway.image(is.model),
    prompt: { text: istem, images: gorseller },
    ...(is.boyut ? { size: is.boyut } : { aspectRatio: oran }),
    providerOptions: is.model.startsWith('openai/') ? { openai: { quality: 'high' } } : undefined,
  });
  return { veri: Buffer.from(sonuc.image.uint8Array), ek: { providerMetadata: sonuc.providerMetadata, warnings: sonuc.warnings } };
}

async function main() {
  const [donem, ...bayraklar] = process.argv.slice(2);
  if (!donem) throw new Error('Kullanım: node ciz.mjs <dönem> [--calistir] [--yalniz <iş adı>]');
  const calistir = bayraklar.includes('--calistir');
  const yalniz = bayraklar.includes('--yalniz') ? bayraklar[bayraklar.indexOf('--yalniz') + 1] : null;
  const isler = ISLER.filter((x) => !yalniz || x.ad === yalniz);
  if (!isler.length) throw new Error(`iş bulunamadı: ${yalniz}`);

  const taslak = await readFile(path.join(BURASI, 'iskelet', `${donem}_iskelet.png`));
  const temel = await readFile(path.join(BURASI, 'istemler', `${donem}_gunduz.txt`), 'utf8');
  const refBilgi = JSON.parse(await readFile(path.join(BURASI, `${donem}_referanslar.json`), 'utf8')).tablolar;
  // referansları 1024 px'e küçült (istek boyutu ve jeton maliyeti); PNG olarak gönder
  const refler = await Promise.all(refBilgi.map((t) => readFile(path.join(KOK, t.dosya)).then((b) => sharp(b).resize(1024, 1024, { fit: 'inside' }).png().toBuffer())));

  console.log(`${donem}: ${isler.length} çizim, tahmini toplam ~${isler.reduce((t, x) => t + x.fiyat, 0).toFixed(2)} $`);
  for (const is of isler) console.log(`  ${is.ad.padEnd(26)} ${is.model.padEnd(34)} oran ${is.oran.padEnd(5)} ${is.ref ? `taslak + ${refler.length} tablo` : 'yalnız taslak'}  ~${is.fiyat} $`);
  if (!calistir) {
    console.log('\nPlan bu. Çizmek için: node ciz.mjs ' + donem + ' --calistir');
    return;
  }
  if (!process.env.AI_GATEWAY_API_KEY) throw new Error('AI_GATEWAY_API_KEY tanımlı değil');

  const klasor = path.join(BURASI, 'cikti', donem);
  await mkdir(path.join(klasor, 'ham'), { recursive: true });
  const ozet = [];
  for (const is of isler) {
    const { resim, kutu, dolgu } = await tuvaleYerlestir(taslak, is.oran);
    const istem = istemKur(temel, is, dolgu, refBilgi);
    const gorseller = is.ref ? [resim, ...refler] : [resim];
    const bas = Date.now();
    process.stdout.write(`${is.ad} … `);
    try {
      const { veri, ek } = await ciz(is, istem, gorseller, is.oran);
      await writeFile(path.join(klasor, 'ham', `${is.ad}.png`), veri);
      const { png, ham, alan } = await kes(veri, kutu);
      await writeFile(path.join(klasor, `${is.ad}.png`), png);
      const beklenen = oranSayi(is.oran);
      const gelen = ham.width / ham.height;
      const uyari = Math.abs(gelen - beklenen) / beklenen > 0.03 ? `istenen oran ${is.oran}, gelen ${ham.width}×${ham.height}` : null;
      ozet.push({ ...is, sure: Math.round((Date.now() - bas) / 1000), ham: [ham.width, ham.height], kesilen: alan, uyari, istemOzeti: createHash('sha1').update(istem).digest('hex').slice(0, 10), ek });
      console.log(`tamam (${ham.width}×${ham.height}${uyari ? ', UYARI: ' + uyari : ''})`);
    } catch (e) {
      ozet.push({ ...is, hata: String(e && e.message ? e.message : e).slice(0, 500) });
      console.log(`HATA: ${e && e.message ? e.message : e}`);
    }
  }
  await writeFile(path.join(klasor, `ozet_${new Date().toISOString().replace(/[:.]/g, '-')}.json`), JSON.stringify(ozet, null, 2));
  console.log(`\nÇıktılar: ${path.relative(KOK, klasor)}/  (ham/ = modelin döndürdüğü, üstteki = 1024×3072'ye kesilmiş)`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e.message || e);
    process.exit(1);
  });
}
