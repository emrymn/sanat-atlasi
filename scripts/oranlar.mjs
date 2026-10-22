// Uygulamayla gelen görsel kopyalarının en/boy oranlarını çıkarır (JPEG başlığından, bağımlılık yok).
// Çıktı: data/gorsel_oranlari.json
//   oranlar: { "<yerel ad>": genişlik / yükseklik }
//   dikeyler: dikey (oran ≤ DIKEY) yerel görseli olan eserlere sahip sanatçı kimlikleri (Günün sanatçısı havuzu)
// Kullanım: node scripts/oranlar.mjs
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const KOK = fileURLToPath(new URL('../', import.meta.url));
export const DIKEY = 0.85;

// JPEG SOFn işaretçisinden boyut
function jpegBoyutu(b) {
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) return null;
    const m = b[i + 1];
    const uzunluk = b.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + uzunluk;
  }
  return null;
}

const anahtar = (k, d) => `${k}:${String(d).replace(/ /g, '_')}`;

const yerel = JSON.parse(await readFile(`${KOK}data/yerel_gorseller.json`, 'utf8')).gorseller;
const oranlar = {};
for (const dosya of await readdir(`${KOK}gorseller/k`)) {
  if (!dosya.endsWith('.jpg')) continue;
  const boy = jpegBoyutu(await readFile(`${KOK}gorseller/k/${dosya}`));
  if (boy && boy.h) oranlar[dosya.slice(0, -4)] = Math.round((100 * boy.w) / boy.h) / 100;
}

const yerelHarita = new Map(Object.entries(yerel).map(([a, ad]) => [a.replace(/ /g, '_'), ad]));
const oran = (k, d) => oranlar[yerelHarita.get(anahtar(k, d))];

const sanatcilar = JSON.parse(await readFile(`${KOK}data/sanatcilar.json`, 'utf8'));
const liste = Array.isArray(sanatcilar) ? sanatcilar : sanatcilar.sanatcilar;
const onbellek = JSON.parse(await readFile(`${KOK}data/eserler_onbellek.json`, 'utf8')).sanatcilar;
const dikeyler = [];
for (const s of liste) {
  const gorseller = [
    ...(s.kurs_eserleri || []).map((e) => ({ k: 'commons', d: e.commons_dosya })),
    ...((onbellek[s.id] && onbellek[s.id].eserler) || []).flatMap((e) => e.gorseller || []),
  ];
  if (gorseller.some((g) => (oran(g.k, g.d || g.i || g.u) ?? 9) <= DIKEY)) dikeyler.push(s.id);
}

await writeFile(`${KOK}data/gorsel_oranlari.json`, JSON.stringify({ surum: 1, dikey: DIKEY, oranlar, dikeyler }));
console.log(`${Object.keys(oranlar).length} oran, ${dikeyler.length} / ${liste.length} sanatçının dikey eseri var`);
