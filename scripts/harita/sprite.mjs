// Yeni harita (İş 41): seviye sembolleri ve karakter (yolcu), saydam arka planlı küçük resimler (GPT Image 2).
// Emre'nin seçimleri: her seviyeye kendi sembolü (o seviyenin sanatçılarından bir nesne); karakter bütün haritada
// aynı genç erkek sanat öğrencisi, her dönemde o dönemin kıyafeti, bugünkü yolcular gibi boyalı küçük figür.
// Kullanım (Mac): node sprite.mjs ronesans [--calistir] [--yalniz sembol-1,karakter]
// Çıktı: cikti/<dönem>/sprite/<ad>.webp (saydam). Model saydam vermezse düz arka plan köşelerden silinir.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { gateway, generateImage } from 'ai';

const BURASI = path.dirname(fileURLToPath(import.meta.url));
const KOK = path.resolve(BURASI, '../..');

const ORTAK =
  "Painted in the same light, bright storybook style as the map in Image 1 (same palette, soft daylight from the upper left, visible brushwork), and at the same scale and feel as the existing game piece in Image 2. Seen from slightly above, at the same 3/4 bird's-eye angle as the map. Centred, filling about 80% of the image height. Transparent background (if that is not possible, a flat pure white background). No cast shadow beyond the base, no text, no frame.";

const ISLER = {
  ronesans: {
    harita: 'cikti/ronesans/gpt-image-2-maske-cep.jpg', // Adım 12 (Emre'nin beğendiği renkler)
    ornekNesne: '../../gorseller/harita/nesne_ronesans_bust2_gunduz.webp',
    ornekYolcu: '../../gorseller/harita/yolcu_ronesans_gunduz_3x.webp',
    isler: [
      { ad: 'sembol-1', metin: "A small painted model of Brunelleschi's dome of Florence Cathedral (terracotta tiles, white ribs, lantern on top) standing on a small round paved stone base." },
      { ad: 'sembol-2', metin: 'A small pair of brass balance scales with two shallow pans and a few gold coins, as on the table in Quentin Metsys’s The Moneylender and His Wife, standing on a small round paved stone base.' }, // Arnolfini aynası yerine (Emre)
      { ad: 'sembol-3', metin: 'A celestial globe on a brass stand, as on the shelf in Holbein’s The Ambassadors, standing on a small round paved stone base.' },
      { ad: 'sembol-4', metin: 'An upright bronze ring with a square inside it, the circle and square of Leonardo’s Vitruvian Man (no human figure), standing on a small round paved stone base.' },
      { ad: 'sembol-5', metin: 'A Venetian striped mooring pole (blue and white spiral stripes) with a small iron lantern hanging from it, standing on a small round paved stone base.' },
      { ad: 'sembol-6', metin: 'A large carved chess king piece in ivory and gold, as in Sofonisba Anguissola’s The Chess Game, standing on a small round paved stone base.' },
      { ad: 'sembol-7', metin: 'A tall vase with a very long, elegant neck, as held by the angel in Parmigianino’s Madonna with the Long Neck, standing on a small round paved stone base.' },
      {
        ad: 'karakter',
        yolcu: true,
        metin:
          'A young male art student, about twenty years old, the player’s character on the map: full body, walking forward, friendly face, dressed in Italian Renaissance clothing (a fitted doublet, hose, soft beret), a leather satchel over the shoulder and a sketchbook under one arm. Same scale and feel as the traveller figure in Image 2.',
      },
    ],
  },
};

// Saydam değilse: köşelerden başlayıp arka plana benzer pikselleri sil (taşma dolgusu), kenarı 1 px yumuşat
async function saydamYap(veri) {
  const { data, info } = await sharp(veri).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  let saydamVar = false;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 250) { saydamVar = true; break; }
  if (saydamVar) return { png: await sharp(veri).png().toBuffer(), yontem: 'model' };
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
  return { png: await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer(), yontem: 'köşeden silindi' };
}

async function main() {
  const [donem, ...bayraklar] = process.argv.slice(2);
  const tanim = ISLER[donem];
  if (!tanim) throw new Error('Kullanım: node sprite.mjs <dönem> [--calistir] [--yalniz ad,ad]');
  const yalniz = bayraklar.includes('--yalniz') ? bayraklar[bayraklar.indexOf('--yalniz') + 1].split(',') : null;
  const isler = tanim.isler.filter((x) => !yalniz || yalniz.includes(x.ad));
  console.log(`${donem}: ${isler.length} küçük resim, tahmini ~${(isler.length * 0.13).toFixed(2)} $`);
  for (const is of isler) console.log(`  ${is.ad.padEnd(10)} ${is.metin.slice(0, 90)}…`);
  if (!bayraklar.includes('--calistir')) {
    console.log(`\nPlan bu. Çizmek için: node sprite.mjs ${process.argv.slice(2).join(' ')} --calistir`);
    return;
  }
  if (!process.env.AI_GATEWAY_API_KEY && existsSync(path.join(BURASI, '.env'))) process.loadEnvFile(path.join(BURASI, '.env'));
  if (!process.env.AI_GATEWAY_API_KEY) throw new Error('AI_GATEWAY_API_KEY yok: scripts/harita/.env dosyasına AI_GATEWAY_API_KEY=... yazın');

  // Image 1: haritanın ortasından bir parça (üslup ve renk); Image 2: bugünkü sembol ya da yolcu (ölçek)
  const harita = await sharp(path.join(BURASI, tanim.harita)).extract({ left: 0, top: 1024, width: 1024, height: 1024 }).jpeg({ quality: 88 }).toBuffer();
  const ornek = async (p) => sharp(path.join(BURASI, p)).flatten({ background: '#ffffff' }).resize(512, 512, { fit: 'contain', background: '#ffffff' }).png().toBuffer();
  const ornekNesne = await ornek(tanim.ornekNesne);
  const ornekYolcu = await ornek(tanim.ornekYolcu);

  const klasor = path.join(BURASI, 'cikti', donem, 'sprite');
  await mkdir(klasor, { recursive: true });
  for (const is of isler) {
    let ad = is.ad;
    for (let v = 2; existsSync(path.join(klasor, `${ad}.webp`)); v++) ad = `${is.ad}-v${v}`; // üstüne yazılmaz
    process.stdout.write(`${ad} … `);
    try {
      const sonuc = await generateImage({
        model: gateway.image('openai/gpt-image-2'),
        prompt: { text: `${is.metin}\n\n${ORTAK}`, images: [harita, is.yolcu ? ornekYolcu : ornekNesne] },
        size: '1024x1024',
        providerOptions: { openai: { quality: 'high', background: 'transparent' } },
      });
      const { png, yontem } = await saydamYap(Buffer.from(sonuc.image.uint8Array));
      const kirpik = await sharp(png).trim().toBuffer(); // saydam kenarlar kırpılır
      await writeFile(path.join(klasor, `${ad}.webp`), await sharp(kirpik).webp({ quality: 92, alphaQuality: 100 }).toBuffer());
      const m = await sharp(kirpik).metadata();
      console.log(`tamam (${m.width}×${m.height}, saydamlık: ${yontem}, ${sonuc.providerMetadata?.gateway?.cost ?? '?'} $)`);
    } catch (e) {
      console.log(`HATA: ${e && e.message ? e.message : e}`);
    }
  }
  console.log(`\nÇıktılar: ${path.relative(KOK, klasor)}/`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
