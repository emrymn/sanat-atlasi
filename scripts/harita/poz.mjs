// İş 90 (Emre: "karakter çok hareketsiz, haritaya bir şey katmıyor"): öğrencinin yeni pozları (GPT Image 2).
// Her dönemde o dönemin öğrencisi (cikti/<dönem>/sprite/karakter.webp) örnek alınır; aynı kişi, aynı kıyafet:
//   karakter-yuru-1, karakter-yuru-2: yandan yürüme adımları (sola doğru; biri sol, biri sağ ayak önde)
//   karakter-arka-1, karakter-arka-2: arkadan, yolda yukarı uzaklaşırken (adımlar)
//   karakter-eskiz: dururken eskiz defterine çizer
// İkinci adımlar birincinin üstünden çizilir (aynı kişi ve ışık kalsın). Var olanın üstüne yazılmaz (-v2…).
// Sonra: python3 yolcu_hazirla.py (uygulamaya hazırlar) ve sh gonder.sh "Öğrenci pozları".
// Kullanım (Mac): node poz.mjs ronesans [--calistir] [--yalniz yuru,arka,eskiz]   |   node poz.mjs hepsi --calistir
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { gateway, generateImage } from 'ai';

const BURASI = path.dirname(fileURLToPath(import.meta.url));
const KOK = path.resolve(BURASI, '../..');
const DONEMLER = ['ortacag', 'ronesans', 'barok', 'barok2', 'aydinlanma', 'romantik', 'empresyonizm', 'postempresyonizm', 'modern'];
const FIYAT = 0.13; // $ / resim (kaba; gerçeği Vercel panosunda)

const ORTAK =
  'Keep him exactly the same person as in Image 1: same face, hair, age, body proportions, the same clothes, colours, satchel and sketchbook, painted in exactly the same style, brushwork and light as Image 1, at the same 3/4 bird\'s-eye angle as the map in Image 2. Full body, nothing cropped, feet visible. Centred, filling about 80% of the image height. On a flat, solid, pure magenta background (#FF00FF) with no gradient, texture or shadow; never use magenta on the figure. No cast shadow, no ground, no text, no frame.';

// sira: önce birinciler (örnek: öğrenci), sonra ikinciler (örnek: birinci adım)
const POZLAR = [
  { ad: 'karakter-yuru-1', grup: 'yuru', metin: 'He is walking to the LEFT, seen from the side (profile, a little turned toward the viewer), mid-stride with his LEFT leg forward and right leg back, arms swinging naturally, the satchel on his shoulder.' },
  { ad: 'karakter-arka-1', grup: 'arka', metin: 'He is seen from BEHIND (back view, a little from above), walking AWAY from the viewer up a road, mid-stride with his LEFT leg forward; we see his back, the back of his head and the satchel strap.' },
  { ad: 'karakter-eskiz', grup: 'eskiz', metin: 'He is standing still, holding his sketchbook open in one hand and drawing in it with a pencil in the other, head bowed, looking down at his drawing, absorbed, the satchel at his side.' },
  { ad: 'karakter-yuru-2', grup: 'yuru', ornek: 'karakter-yuru-1', metin: 'The same figure as in Image 1, in exactly the same walk to the LEFT and the same framing and size, but at the next step: now his RIGHT leg is forward and left leg back, arms swinging the other way.' },
  { ad: 'karakter-arka-2', grup: 'arka', ornek: 'karakter-arka-1', metin: 'The same figure as in Image 1, seen from behind walking away in exactly the same framing and size, but at the next step: now his RIGHT leg is forward and left leg back.' },
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

const ornek = async (p) => sharp(p).flatten({ background: '#ffffff' }).resize(512, 512, { fit: 'contain', background: '#ffffff' }).png().toBuffer();

async function main() {
  const [hedef, ...bayraklar] = process.argv.slice(2);
  const donemler = hedef === 'hepsi' ? DONEMLER : DONEMLER.includes(hedef) ? [hedef] : null;
  if (!donemler) throw new Error('Kullanım: node poz.mjs <dönem|hepsi> [--calistir] [--yalniz yuru,arka,eskiz]');
  const yalniz = bayraklar.includes('--yalniz') ? bayraklar[bayraklar.indexOf('--yalniz') + 1].split(',') : null;
  const pozlar = POZLAR.filter((p) => !yalniz || yalniz.includes(p.grup));
  const isler = donemler.flatMap((d) => pozlar.filter((p) => !existsSync(path.join(BURASI, 'cikti', d, 'sprite', `${p.ad}.webp`))).map((p) => ({ d, p })));
  console.log(`${donemler.join(', ')}: ${isler.length} poz, tahmini ~${(isler.length * FIYAT).toFixed(2)} $ (var olanlar atlanır)`);
  for (const { d, p } of isler) console.log(`  ${d.padEnd(17)} ${p.ad}`);
  if (!bayraklar.includes('--calistir')) {
    console.log(`\nPlan bu. Çizmek için: node poz.mjs ${process.argv.slice(2).join(' ')} --calistir`);
    return;
  }
  if (!process.env.AI_GATEWAY_API_KEY && existsSync(path.join(BURASI, '.env'))) process.loadEnvFile(path.join(BURASI, '.env'));
  if (!process.env.AI_GATEWAY_API_KEY) throw new Error('AI_GATEWAY_API_KEY yok: scripts/harita/.env dosyasına AI_GATEWAY_API_KEY=... yazın');

  for (const d of donemler) {
    const klasor = path.join(BURASI, 'cikti', d, 'sprite');
    const ogrenci = path.join(klasor, 'karakter.webp');
    if (!existsSync(ogrenci)) {
      console.log(`${d}: karakter.webp yok, atlandı`);
      continue;
    }
    const secim = JSON.parse(await readFile(path.join(BURASI, `${d}_secim.json`), 'utf8'));
    const harita = await sharp(path.join(BURASI, secim.resim.replace(/^scripts\/harita\//, ''))).extract({ left: 0, top: 1024, width: 1024, height: 1024 }).jpeg({ quality: 88 }).toBuffer();
    await mkdir(klasor, { recursive: true });
    for (const p of pozlar) {
      const hedefDosya = path.join(klasor, `${p.ad}.webp`);
      if (existsSync(hedefDosya)) continue;
      const kaynak = path.join(klasor, `${p.ornek || 'karakter'}.webp`);
      if (!existsSync(kaynak)) {
        console.log(`${d} ${p.ad}: önce ${p.ornek} gerekir, atlandı`);
        continue;
      }
      process.stdout.write(`${d} ${p.ad} … `);
      try {
        const sonuc = await generateImage({
          model: gateway.image('openai/gpt-image-2'),
          prompt: { text: `${p.metin}\n\n${ORTAK}`, images: [await ornek(kaynak), harita] },
          size: '1024x1024',
          providerOptions: { openai: { quality: 'high' } },
        });
        const png = await saydamYap(Buffer.from(sonuc.image.uint8Array));
        const kirpik = await sharp(png).trim().toBuffer();
        await writeFile(hedefDosya, await sharp(kirpik).webp({ quality: 92, alphaQuality: 100 }).toBuffer());
        const m = await sharp(kirpik).metadata();
        console.log(`tamam (${m.width}×${m.height}, ${sonuc.providerMetadata?.gateway?.cost ?? '?'} $)`);
      } catch (e) {
        console.log(`HATA: ${e && e.message ? e.message : e}`);
      }
    }
  }
  console.log(`\nSonra: python3 scripts/harita/yolcu_hazirla.py ve sh scripts/harita/gonder.sh "Öğrenci pozları" (${path.relative(KOK, BURASI)})`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
