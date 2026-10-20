// Derleme zamanı önbelleği: her sanatçı için QID'i ve Wikidata eser listesini
// data/eserler_onbellek.json dosyasına yazar. Uygulama bu dosya olmadan da çalışır.
// Kullanım:  node scripts/onbellek.mjs            (hepsi)
//            node scripts/onbellek.mjs giotto ...   (yalnızca bu id'ler; mevcut dosyayı günceller)
//            ESERLER=1 node scripts/onbellek.mjs    (kayıtlı QID'lerle yalnızca eser listelerini yenile)
// Vekil sunucu arkasındaysan: NODE_USE_ENV_PROXY=1 node scripts/onbellek.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { qidCoz, eserleriGetir, jsonGetiriciYap, KULLANICI_AJANI } from '../js/wikidata.js';

const kok = new URL('../', import.meta.url);
const hedef = new URL('data/eserler_onbellek.json', kok);
const sanatcilar = JSON.parse(await readFile(new URL('data/sanatcilar.json', kok), 'utf8'));
const secili = process.argv.slice(2);

// surum 2: yalnızca resimsel eserler (P31 süzgeci); eski sürüm dosyalar uygulamada yok sayılır
let onbellek = { surum: 2, olusturma: null, sanatcilar: {} };
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
  const eski = onbellek.sanatcilar[s.id];
  if (!secili.length && eski && process.env.YENIDEN !== '1' && process.env.ESERLER !== '1') continue;
  try {
    const qid = process.env.ESERLER === '1' && eski ? eski.qid : await qidCoz(s, getir);
    const eserler = qid ? await eserleriGetir(qid, getir) : [];
    onbellek.sanatcilar[s.id] = { qid, eserler };
    console.log(`${i}/${sanatcilar.length} ${s.id}: ${qid || 'QID yok'} · ${eserler.length} eser`);
  } catch (e) {
    console.log(`${i}/${sanatcilar.length} ${s.id}: HATA ${e.message} (atlandı)`);
  }
  onbellek.surum = 2;
  onbellek.olusturma = new Date().toISOString();
  await writeFile(hedef, JSON.stringify(onbellek));
  await bekle(600);
}
console.log('Bitti:', Object.keys(onbellek.sanatcilar).length, 'sanatçı');
