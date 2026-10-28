// Ressamların imza görselleri (Wikidata P109) → data/imzalar.json (İş 48).
// Yalnız data/eserler_onbellek.json'daki doğrulanmış QID'ler kullanılır; QID'i olmayan ya da kaydında imza
// bulunmayan sanatçı null olarak yazılır (uygulama onlar için Wikidata'ya sormaz).
// Uygulama bu dosya olmadan da çalışır: imzayı sanatçı sayfası açılınca canlı Wikidata'dan alır ve saklar.
//
// Kullanım:  node scripts/imzalar.mjs
// Vekil sunucu arkasındaysan: NODE_USE_ENV_PROXY=1 node scripts/imzalar.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { API } from '../js/wikidata.js';
import { imzaDosyasi } from '../js/imza.js';
import { getir } from './kaynaklar/ortak.mjs';

const kok = new URL('../', import.meta.url);
const onbellek = JSON.parse(await readFile(new URL('data/eserler_onbellek.json', kok), 'utf8'));
const qidler = Object.entries(onbellek.sanatcilar).map(([id, k]) => [id, k.qid || null]);

const imzalar = {};
const sorulacak = qidler.filter(([, q]) => q);
for (const [id, q] of qidler) if (!q) imzalar[id] = null;
for (let i = 0; i < sorulacak.length; i += 50) {
  const parca = sorulacak.slice(i, i + 50);
  const j = await getir(`${API}?action=wbgetentities&ids=${parca.map(([, q]) => q).join('|')}&props=claims&format=json&origin=*`);
  for (const [id, q] of parca) imzalar[id] = imzaDosyasi(j?.entities?.[q]);
  console.log(`${Math.min(i + 50, sorulacak.length)}/${sorulacak.length}`);
}

const sirali = Object.fromEntries(Object.keys(imzalar).sort().map((k) => [k, imzalar[k]]));
await writeFile(new URL('data/imzalar.json', kok), JSON.stringify({ surum: 1, olusturma: new Date().toISOString(), imzalar: sirali }, null, 1) + '\n');
const var_ = Object.values(sirali).filter(Boolean).length;
console.log(`${var_} sanatçının imzası bulundu (${Object.keys(sirali).length} sanatçıdan).`);
