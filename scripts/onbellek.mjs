// Derleme zamanı önbelleği: her sanatçı için QID'i ve Wikidata eser listesini
// data/eserler_onbellek.json dosyasına yazar. Uygulama bu dosya olmadan da çalışır.
// Kullanım:  node scripts/onbellek.mjs            (hepsi)
//            node scripts/onbellek.mjs giotto ...   (yalnızca bu id'ler; mevcut dosyayı günceller)
// Vekil sunucu arkasındaysan: NODE_USE_ENV_PROXY=1 node scripts/onbellek.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { qidCoz, eserleriGetir, jsonGetiriciYap, KULLANICI_AJANI } from '../js/wikidata.js';

const kok = new URL('../', import.meta.url);
const hedef = new URL('data/eserler_onbellek.json', kok);
const sanatcilar = JSON.parse(await readFile(new URL('data/sanatcilar.json', kok), 'utf8'));
const secili = process.argv.slice(2);

let onbellek = { surum: 1, olusturma: null, sanatcilar: {} };
try {
  onbellek = JSON.parse(await readFile(hedef, 'utf8'));
} catch {
  /* yeni dosya */
}

const getir = jsonGetiriciYap({ basliklar: { 'User-Agent': KULLANICI_AJANI, 'Api-User-Agent': KULLANICI_AJANI }, deneme: 8 });
const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

let i = 0;
for (const s of sanatcilar) {
  i++;
  if (secili.length && !secili.includes(s.id)) continue;
  if (!secili.length && onbellek.sanatcilar[s.id] && process.env.YENIDEN !== '1') continue;
  try {
    const qid = await qidCoz(s, getir);
    const eserler = qid ? await eserleriGetir(qid, getir) : [];
    onbellek.sanatcilar[s.id] = { qid, eserler };
    console.log(`${i}/${sanatcilar.length} ${s.id}: ${qid || 'QID yok'} · ${eserler.length} eser`);
  } catch (e) {
    console.log(`${i}/${sanatcilar.length} ${s.id}: HATA ${e.message} (atlandı)`);
  }
  onbellek.olusturma = new Date().toISOString();
  await writeFile(hedef, JSON.stringify(onbellek));
  await bekle(600);
}
console.log('Bitti:', Object.keys(onbellek.sanatcilar).length, 'sanatçı');
