// Yeni harita (İş 41): seçilen resmin yalnız bir dikey bandını (1024×1536) GPT Image 2'ye maskeyle düzenletir.
// Neden: GPT resmin tamamı gidince yarı çıplak melek ya da figür yüzünden isteği reddediyor (Klasisizm'in tavan göğü);
// maske yalnız alt kenarı açsa da bütün resim gönderiliyordu. Bant içinde sorunlu figür yoksa istek geçer.
// Sonuç: bant GPT'den, yalnız maskenin açık alanı yumuşak kenarla kaynağa yapıştırılır (birlestir.py ile aynı mantık).
// Kullanım (Mac): node bolge.mjs <dönem> <kaynak adı> <maske adı> <istem adı> <üst px> [--calistir]
//   örn. node bolge.mjs barok2 barok2-secilen alt barok2_alt_gpt 1536 --calistir
//   kaynak: cikti/<dönem>/<kaynak>.jpg · maske: iskelet/<dönem>_iskelet_cep_maske_<maske>.png · istem: istemler/<istem>.txt
//   --ref <dosya> (tekrarlanabilir, depo köküne göre): tabloyu örnek olarak da gönderir (Modern: Çığlık aslına benzesin)
// Çıktı: cikti/<dönem>/<istem>-bant.jpg (GPT'nin bandı) ve <istem>-birlesik.jpg (tam resim); üstüne yazılmaz (-v2…)
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { gateway, generateImage } from 'ai';

const BURASI = path.dirname(fileURLToPath(import.meta.url));
const BANT_Y = 1536; // GPT Image 2'nin 1024×1536 boyutu

function bosAd(klasor, ad) {
  let a = ad;
  for (let v = 2; existsSync(path.join(klasor, `${a}-bant.jpg`)); v++) a = `${ad}-v${v}`;
  return a;
}

async function main() {
  const [donem, kaynak, maskeAdi, istemAdi, ustStr, ...bayraklar] = process.argv.slice(2);
  if (!ustStr) throw new Error('Kullanım: node bolge.mjs <dönem> <kaynak adı> <maske adı> <istem adı> <üst px> [--calistir]');
  const ust = Number(ustStr);
  const klasor = path.join(BURASI, 'cikti', donem);
  const kaynakYol = path.join(klasor, `${kaynak.replace(/\.jpg$/, '')}.jpg`);
  const maskeYol = path.join(BURASI, 'iskelet', `${donem}_iskelet_cep_maske_${maskeAdi}.png`);
  const istem = (await readFile(path.join(BURASI, 'istemler', `${istemAdi}.txt`), 'utf8')).trim();
  const { width: W, height: H } = await sharp(kaynakYol).metadata();
  if (W !== 1024 || ust < 0 || ust + BANT_Y > H) throw new Error(`bant resmin dışında (resim ${W}×${H}, üst ${ust})`);
  console.log(`${donem}: ${path.basename(kaynakYol)} · bant y ${ust}–${ust + BANT_Y} · maske ${path.basename(maskeYol)} · ~0.15 $\n\n${istem}`);
  if (!bayraklar.includes('--calistir')) {
    console.log(`\nPlan bu. Çizmek için: node bolge.mjs ${process.argv.slice(2).join(' ')} --calistir`);
    return;
  }
  if (!process.env.AI_GATEWAY_API_KEY && existsSync(path.join(BURASI, '.env'))) process.loadEnvFile(path.join(BURASI, '.env'));
  if (!process.env.AI_GATEWAY_API_KEY) throw new Error('AI_GATEWAY_API_KEY yok: scripts/harita/.env dosyasına AI_GATEWAY_API_KEY=... yazın');

  const kutu = { left: 0, top: ust, width: W, height: BANT_Y };
  const bant = await sharp(kaynakYol).extract(kutu).png().toBuffer();
  const bantMaske = await sharp(maskeYol).extract(kutu).png().toBuffer();
  const refler = [];
  bayraklar.forEach((b, i) => { if (b === '--ref') refler.push(path.resolve(BURASI, '../..', bayraklar[i + 1])); });
  const ornekler = await Promise.all(refler.map((r) => sharp(r).resize(1024, 1024, { fit: 'inside' }).png().toBuffer()));
  const sonuc = await generateImage({
    model: gateway.image('openai/gpt-image-2'),
    prompt: { text: istem, images: [bant, ...ornekler], mask: bantMaske },
    size: '1024x1536',
    providerOptions: { openai: { quality: 'high' } },
  });
  const ad = bosAd(klasor, istemAdi);
  const yeni = await sharp(Buffer.from(sonuc.image.uint8Array)).resize(W, BANT_Y).removeAlpha().raw().toBuffer();
  await writeFile(path.join(klasor, `${ad}-bant.jpg`), await sharp(yeni, { raw: { width: W, height: BANT_Y, channels: 3 } }).jpeg({ quality: 90 }).toBuffer());

  // açık alan (maskede saydam) → ağırlık; yumuşak kenar (birlestir.py'deki gibi)
  const alfa = await sharp(maskeYol).extract(kutu).ensureAlpha().extractChannel(3).negate().blur(6).raw().toBuffer();
  const eski = await sharp(kaynakYol).extract(kutu).removeAlpha().raw().toBuffer();
  const karisik = Buffer.alloc(eski.length);
  for (let i = 0, p = 0; p < alfa.length; p++, i += 3) {
    const k = alfa[p] / 255;
    for (let c = 0; c < 3; c++) karisik[i + c] = Math.round(yeni[i + c] * k + eski[i + c] * (1 - k));
  }
  const tam = await sharp(kaynakYol)
    .composite([{ input: await sharp(karisik, { raw: { width: W, height: BANT_Y, channels: 3 } }).png().toBuffer(), top: ust, left: 0 }])
    .jpeg({ quality: 90 })
    .toBuffer();
  await writeFile(path.join(klasor, `${ad}-birlesik.jpg`), tam);
  const ozet = { ad, kaynak, maske: maskeAdi, istem: istemAdi, ust, maliyet: sonuc.providerMetadata?.gateway?.cost ?? null };
  await writeFile(path.join(klasor, `ozet_bolge_${new Date().toISOString().replace(/[:.]/g, '-')}.json`), JSON.stringify(ozet, null, 2));
  console.log(`\ntamam: cikti/${donem}/${ad}-bant.jpg ve ${ad}-birlesik.jpg (${ozet.maliyet ?? '?'} $)`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
