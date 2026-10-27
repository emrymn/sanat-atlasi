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
  "Painted in the same light, bright storybook style as the map in Image 1 (same palette, soft daylight from the upper left, visible brushwork), and at the same scale and feel as the existing game piece in Image 2. Seen from slightly above, at the same 3/4 bird's-eye angle as the map. Centred, filling about 80% of the image height. On a flat, solid, pure magenta background (#FF00FF) with no gradient, texture or shadow; never use magenta in the object itself. No cast shadow beyond the base, no text, no frame.";

// Barok haritası koyu (karanlık-aydınlık, Emre): ortak "açık masal üslubu" yerine dönemin ışığı istenir
const ORTAK_BAROK =
  "Painted in the same Baroque oil-painting style as the map in Image 1: glossy oil paint, warm golden theatrical light falling from the upper left, soft deep shadows on the far side, in the manner of Caravaggio and Rembrandt. The object itself is well lit so it reads clearly. At the same scale and feel as the existing game piece in Image 2. Seen from slightly above, at the same 3/4 bird's-eye angle as the map. Centred, filling about 80% of the image height. On a flat, solid, pure magenta background (#FF00FF) with no gradient, texture or shadow; never use magenta in the object itself. No cast shadow beyond the base, no text, no frame.";

// Romantizm haritası tek ortak altın akşamüstü ışığında (Emre); güneş sağ üstte
const ORTAK_ROMANTIK =
  "Painted in the same glowing oil-painting style as the map in Image 1 (same warm palette, visible brushwork), lit by the same warm golden late-afternoon sunlight falling from the upper right, with soft blue-violet shadows on the far side. The object itself is well lit so it reads clearly. At the same scale and feel as the existing game piece in Image 2. Seen from slightly above, at the same 3/4 bird's-eye angle as the map. Centred, filling about 80% of the image height. On a flat, solid, pure magenta background (#FF00FF) with no gradient, texture or shadow; never use magenta in the object itself. No cast shadow beyond the base, no text, no frame.";

const ISLER = {
  // Romantizmden Realizme (Emre onayladı): Blake'in altın pergeli, Medusa'nın Salı maketi (figürsüz), Rossetti'nin narı,
  // Opera'nın altın liri, oraklı buğday demeti; karakter aynı öğrenci, 19. yüzyıl ortası ressam kıyafetiyle.
  romantik: {
    harita: 'cikti/romantik/romantik-secilen.jpg',
    ornekNesne: 'cikti/ortacag/sprite/sembol-1.webp',
    ornekYolcu: 'cikti/aydinlanma/sprite/karakter.webp',
    ortak: ORTAK_ROMANTIK,
    isler: [
      { ad: 'sembol-1', metin: "A large golden drawing compass (a pair of dividers), as held down from the clouds in William Blake's The Ancient of Days, standing upright and open on a small round paved stone base, with a few soft golden rays glowing around it." },
      { ad: 'sembol-2', metin: "A small wooden model of Géricault's Raft of the Medusa: a rough raft of lashed planks and beams with a makeshift mast and a billowing, tattered sail, set on a few carved, painted waves on a small round paved stone base. No people on it." },
      { ad: 'sembol-3', metin: "A ripe red pomegranate split open to show its glowing jewel-like seeds, as held in Rossetti's Proserpine, resting on a small dark green velvet cushion with a sprig of ivy, on a little carved Gothic Revival wooden stand, on a small round paved stone base." },
      { ad: 'sembol-4', metin: 'A gilded, ornate golden lyre like the one raised by Apollo on the roof of the Paris Opéra (Palais Garnier), standing on a short creamy marble pedestal with gilded mouldings, on a small round paved stone base.' },
      { ad: 'sembol-5', metin: "A tied sheaf of golden wheat with a curved iron sickle with a wooden handle leaning against it, as in Millet's paintings of peasants, standing on a small round paved stone base with a few loose ears of wheat." },
      {
        ad: 'karakter',
        yolcu: true,
        metin:
          'The same young male art student as in Image 2 (same face, age, satchel and sketchbook), now dressed as a mid-19th-century young painter: a dark green frock coat, a patterned waistcoat, a loosely tied red cravat, grey trousers and brown boots, his hair a little tousled, no hat. Full body, walking forward, friendly face. Same scale and feel as the traveller figure in Image 2.',
      },
    ],
  },
  // Rokoko ve Neoklasisizm (Emre onayladı; 2. sembol sabun köpüğü yerine Gainsborough'nun şapkası): salıncak, Mavi Oğlan'ın
  // şapkası, defne çelenkli İyon başlık; karakter aynı öğrenci, 18. yüzyıl kıyafetiyle. Harita açık renkli: ortak açık üslup.
  aydinlanma: {
    harita: 'cikti/aydinlanma/aydinlanma-secilen.jpg',
    ornekNesne: 'cikti/ortacag/sprite/sembol-1.webp',
    ornekYolcu: 'cikti/barok2/sprite/karakter.webp',
    isler: [
      { ad: 'sembol-1', metin: "A small Rococo garden swing, as in Fragonard's The Swing: a little wooden seat with pink silk cushions hanging by two ropes wound with pink ribbons and roses from a curved, leafy branch on a short carved post, standing on a small round paved stone base." },
      { ad: 'sembol-2', metin: "The wide-brimmed black hat with a large curling white ostrich feather from Gainsborough's The Blue Boy, resting on a small blue silk cushion on a little carved wooden stool, standing on a small round paved stone base." },
      { ad: 'sembol-3', metin: 'A white marble Ionic column capital with elegant volutes, as on the portico of the Panthéon in Paris, with a green laurel wreath hanging from it, standing on a short fluted column stump on a small round paved stone base.' },
      {
        ad: 'karakter',
        yolcu: true,
        metin:
          'The same young male art student as in Image 2 (same face, age, satchel and sketchbook), now dressed in mid-18th-century clothing: a long pale blue silk frock coat with embroidered cuffs, a cream waistcoat, a white lace jabot, breeches, white stockings and buckled shoes, his hair tied back with a black ribbon, no hat. Full body, walking forward, friendly face. Same scale and feel as the traveller figure in Image 2.',
      },
    ],
  },
  // Klasisizm ve Geç Barok (Emre onayladı): Güneş Kral'ın altın güneş amblemi, bulut üstünde yaldızlı putto; karakter aynı
  // öğrenci, 17. yüzyıl sonu Fransız kıyafetiyle. Harita açık renkli (alt Lorrain, üst tavan freski): ortak açık üslup.
  barok2: {
    harita: 'cikti/barok2/barok2-secilen.jpg',
    ornekNesne: 'cikti/ortacag/sprite/sembol-1.webp',
    ornekYolcu: 'cikti/barok/sprite/karakter.webp',
    isler: [
      { ad: 'sembol-1', metin: "The golden sun emblem of Louis XIV, the Sun King: a gilded sun with a calm human face and straight and wavy rays, mounted upright on a small carved and gilded pedestal, standing on a small round paved stone base." },
      { ad: 'sembol-2', metin: 'A small gilded Baroque putto (a winged child angel, wearing a fluttering pale rose drape) sitting on a little white cloud and holding up a laurel wreath, as in a Roman ceiling fresco by Gaulli or Pozzo, the cloud resting on a small round paved stone base.' },
      {
        ad: 'karakter',
        yolcu: true,
        metin:
          'The same young male art student as in Image 2 (same face, hair, age, satchel and sketchbook), now dressed in late 17th-century French clothing: a long dark blue justaucorps coat with turned-back cuffs, a lace cravat, breeches, white stockings, buckled shoes and a tricorne hat. Full body, walking forward, friendly face. Same scale and feel as the traveller figure in Image 2.',
      },
    ],
  },
  // Barok (Emre onayladı): Bernini'nin Davut'u, Caravaggio'nun Meyve Sepeti, Velázquez'in paleti, Rubens'in şapkası,
  // Vermeer'in süt testisi; karakter aynı öğrenci, 17. yüzyıl Flaman/Hollanda kıyafetiyle.
  barok: {
    harita: 'cikti/barok/barok-secilen.jpg',
    ortak: ORTAK_BAROK,
    ornekNesne: 'cikti/ortacag/sprite/sembol-1.webp',
    ornekYolcu: 'cikti/ortacag/sprite/karakter.webp',
    isler: [
      { ad: 'sembol-1', metin: "A small white marble statue of Bernini's David: the young David twisting his body, about to throw the stone from his sling, wearing a loincloth with a flowing drape over one shoulder, standing on a small round paved stone base." },
      { ad: 'sembol-2', metin: "Caravaggio's Basket of Fruit: a small woven wicker basket full of grapes, apples, figs and a pear, with vine leaves curling over the rim, standing on a small round paved stone base." },
      { ad: 'sembol-3', metin: "A painter's wooden palette with dabs of oil paint and a few long brushes, as Velázquez holds in Las Meninas, leaning against a small wooden easel, standing on a small round paved stone base." },
      { ad: 'sembol-4', metin: 'A wide-brimmed black Flemish hat with a curling ostrich feather, as Rubens wears in his portraits, resting on a small carved wooden stand, standing on a small round paved stone base.' },
      { ad: 'sembol-5', metin: "The brown earthenware milk jug from Vermeer's The Milkmaid, pouring a thin stream of milk into a small bowl, beside a little loaf of bread, standing on a small round paved stone base." },
      {
        ad: 'karakter',
        yolcu: true,
        metin:
          'The same young male art student as in Image 2 (same face, hair, age, satchel and sketchbook), now dressed in 17th-century Dutch clothing: a dark doublet with a wide white falling collar, breeches, boots and a broad-brimmed felt hat. Full body, walking forward, friendly face. Same scale and feel as the traveller figure in Image 2.',
      },
    ],
  },
  // Orta Çağ (Emre onayladı): ikona, Siena kalkanı, Saatler Kitabı; karakter aynı öğrenci, Orta Çağ kıyafetiyle.
  // Örnek olarak Rönesans'ın yeni sembolü ve karakteri gider: bütün haritada aynı oyun taşı görünümü ve aynı yüz.
  ortacag: {
    harita: 'cikti/ortacag/ortacag-secilen.jpg',
    ornekNesne: 'cikti/ronesans/sprite/sembol-1.webp',
    ornekYolcu: 'cikti/ronesans/sprite/karakter.webp',
    isler: [
      { ad: 'sembol-1', metin: 'A small Byzantine-style icon panel of the Virgin and Child with a burnished gold background and a gilded arched frame, standing upright on a small round paved stone base, as painted by Cimabue or Berlinghieri.' },
      { ad: 'sembol-2', metin: 'A heraldic shield of Siena, the Balzana, split horizontally: white on top and black below, with a gilded rim, standing upright on a small round paved stone base.' },
      { ad: 'sembol-3', metin: 'An open illuminated Book of Hours on a small carved wooden lectern, its pages showing tiny jewel-coloured miniatures, a deep blue page with gold stars, and gilded initials, as made by the Limbourg brothers, standing on a small round paved stone base.' },
      {
        ad: 'karakter',
        yolcu: true,
        metin:
          'The same young male art student as in Image 2 (same face, hair, age, satchel and sketchbook), now dressed in clothing of 14th-century Italy: a simple belted wool tunic in muted red, a hooded short cape, hose and soft leather shoes. Full body, walking forward, friendly face. Same scale and feel as the traveller figure in Image 2.',
      },
    ],
  },
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

// Saydam değilse: köşelerden başlayıp arka plana benzer pikselleri sil (taşma dolgusu); sonra kenardaki mor
// sızıntıyı (yarı mor kenar pikselleri) iki tur temizle
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
  const morumsu = (i) => (data[i] + data[i + 2]) / 2 - data[i + 1] > 70;
  // kapalı boşluklar (terazi zincirleri arası, çemberin içi): köşeden ulaşılamaz; mora çok yakın her piksel silinir
  // (istem nesnede mor kullanmamayı söylüyor)
  for (let i = 0; i < data.length; i += 4) if (data[i] > 200 && data[i + 2] > 200 && data[i + 1] < 90) data[i + 3] = 0;
  for (let tur = 0; tur < 2; tur++) {
    const sil = [];
    for (let y = 1; y < h - 1; y++)
      for (let x = 1; x < w - 1; x++) {
        const i = o(x, y);
        if (data[i + 3] && morumsu(i) && (!data[o(x + 1, y) + 3] || !data[o(x - 1, y) + 3] || !data[o(x, y + 1) + 3] || !data[o(x, y - 1) + 3])) sil.push(i);
      }
    for (const i of sil) data[i + 3] = 0;
  }
  return { png: await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer(), yontem: 'mor zemin silindi' };
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
        prompt: { text: `${is.metin}\n\n${tanim.ortak || ORTAK}`, images: [harita, is.yolcu ? ornekYolcu : ornekNesne] },
        size: '1024x1024',
        // GPT Image 2 saydam arka plan desteklemiyor ('Transparent background is not supported'): düz mor zemin istenir,
        // saydamYap köşelerden siler. Mor seçildi: fildişi şah, beyaz vazo gibi açık nesneler beyaz zeminle karışırdı.
        providerOptions: { openai: { quality: 'high' } },
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
