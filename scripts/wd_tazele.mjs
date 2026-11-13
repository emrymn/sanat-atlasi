// İş 174: data/eserler_onbellek.json'daki Wikidata kökenli YIL ve MÜZE alanlarını, müzelere hiç gitmeden yeni
// kurallarla tazeler. Eser eklemez, silmez, görsellere dokunmaz.
//   - Yıl: yalnız en iyi sıradaki (BestRank) ve on yıl ya da daha ince hassasiyetteki P571 ("1490'lar" 1490 kalır; "15. yüzyıl" 1500 sayılmaz);
//     tarih kabaysa "en erken tarih" niteleyicisi (P1319) on yıl ya da daha inceyse o.
//   - Müze: bitiş tarihi olmayan P195 koleksiyonları; Führermuseum ve Münih Toplama Noktası hariç.
// Kurallar:
//   - Yeni yıl varsa yazılır. Yoksa ve eser yalnız Wikidata'dan geliyorsa (müze kaynağı yok) eski yıl silinir
//     (o yıl Wikidata'nın kaba tarihiydi). Müze kaynağı da varsa eski yıl kalır (müzeden gelmiş olabilir).
//   - Eski müze bugünkü koleksiyonlardan biriyse dokunulmaz; değilse bugünkülerden biri yazılır; hiç yoksa ve eski
//     değer tarihsel bir yerse silinir. Kurs eserlerinin müzesine (slayttaki yer) dokunulmaz.
// Kullanım: node scripts/wd_tazele.mjs [sanatçı-id …]   (KURU=1: dosyaya yazmaz, yalnız sayar)
import { readFile, writeFile } from 'node:fs/promises';

const KOK = new URL('../', import.meta.url);
const HEDEF = new URL('data/eserler_onbellek.json', KOK);
const SPARQL = 'https://query.wikidata.org/sparql';
const AJAN = 'SanatAtlasi/1.0 (personal study app; https://github.com/emrymn/sanat-atlasi)';
const TARIHSEL = /Führermuseum|Munich Central Collecting Point|Sonderauftrag Linz/i;
const KOLEKSIYON = /collection|Récupération|heirs|Sammlung|Kunstbesitz|Kunstsammlung des Bundes/i;
const MUZE_KAYNAKLARI = ['met', 'aic', 'cma', 'nga'];
const AYIRAC = '¦¦'; // müze adlarında "|" geçebiliyor (Kunst Museum Winterthur | Reinhart am Stadtgarten)
const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

export function sorgu(qid) {
  if (!/^Q\d+$/.test(qid)) throw new Error('geçersiz QID');
  return `SELECT ?item (GROUP_CONCAT(DISTINCT ?yilS; separator="¦¦") AS ?yillar) (GROUP_CONCAT(DISTINCT ?kolL; separator="¦¦") AS ?muzeler) WHERE {
  ?item wdt:P170 wd:${qid} .
  OPTIONAL { ?item p:P571 ?st . ?st a wikibase:BestRank ; psv:P571 ?d . ?d wikibase:timeValue ?inc0 ; wikibase:timePrecision ?p .
    OPTIONAL { ?st pqv:P1319 ?ed . ?ed wikibase:timeValue ?en ; wikibase:timePrecision ?ep . FILTER(?ep >= 8) }
    BIND(STR(YEAR(IF(?p >= 8, ?inc0, ?en))) AS ?yilS) }
  OPTIONAL { ?item p:P195 ?ks . ?ks ps:P195 ?kol ; wikibase:rank ?kr . FILTER(?kr != wikibase:DeprecatedRank)
    FILTER NOT EXISTS { ?ks pq:P582 ?bitis } FILTER(?kol NOT IN (wd:Q475667, wd:Q1053735))
    ?kol rdfs:label ?kolL . FILTER(LANG(?kolL) = "en") }
} GROUP BY ?item`;
}

async function sor(qid) {
  for (let deneme = 0; deneme < 6; deneme++) {
    const y = await fetch(`${SPARQL}?format=json&query=${encodeURIComponent(sorgu(qid))}`, {
      headers: { Accept: 'application/sparql-results+json', 'User-Agent': AJAN },
    }).catch(() => null);
    if (y && y.ok) return y.json();
    const ra = y ? parseInt(y.headers.get('retry-after') || '', 10) : NaN;
    await bekle((Number.isFinite(ra) ? ra : 5 * (deneme + 1)) * 1000);
  }
  throw new Error(`${qid}: Wikidata yanıt vermedi`);
}

// Bir eserin tazelenmiş alanları (saf fonksiyon; birim testli)
export function tazele(e, wd) {
  const sonuc = { ...e };
  const degisim = [];
  const muzeKaynagi = (e.kaynaklar || []).some((k) => MUZE_KAYNAKLARI.includes(k));
  const yil = wd.yillar.length ? Math.min(...wd.yillar) : null;
  if (yil != null && yil !== e.yil) {
    sonuc.yil = yil;
    degisim.push('yil');
  } else if (yil == null && e.yil != null && !muzeKaynagi) {
    delete sonuc.yil;
    degisim.push('yil-sil');
  }
  if (!e.kurs) {
    const eski = e.muze || '';
    // müze adı gibi olanlar önce; yalnız "… collection" türü adaylar varken müze adı gibi eski değer korunur
    // (Alba Meryemi: "Andrew W. Mellon collection" değil; Signac: Orsay, "Musées Nationaux Récupération" değil)
    const muzeGibi = wd.muzeler.filter((m) => !KOLEKSIYON.test(m)).sort();
    const aday = muzeGibi[0] || (TARIHSEL.test(eski) || !eski || KOLEKSIYON.test(eski) ? wd.muzeler.slice().sort()[0] : null);
    if (aday && !wd.muzeler.includes(eski)) {
      sonuc.muze = aday;
      degisim.push('muze');
    } else if (!wd.muzeler.length && TARIHSEL.test(eski)) {
      delete sonuc.muze;
      degisim.push('muze-sil');
    }
  }
  return { eser: sonuc, degisim };
}

async function calis() {
  const onbellek = JSON.parse(await readFile(HEDEF, 'utf8'));
  const secili = process.argv.slice(2);
  const sayac = {};
  const ornekler = [];
  for (const [sid, v] of Object.entries(onbellek.sanatcilar)) {
    if (secili.length && !secili.includes(sid)) continue;
    if (!v.qid || !(v.eserler || []).some((e) => e.qid && (e.kaynaklar || []).includes('wikidata'))) continue;
    let j;
    try {
      j = await sor(v.qid);
    } catch (err) {
      console.log(`${sid}: atlandı (${err.message})`);
      continue;
    }
    const harita = new Map();
    for (const b of j.results.bindings) {
      const q = b.item.value.split('/').pop();
      harita.set(q, {
        yillar: (b.yillar ? b.yillar.value : '').split(AYIRAC).filter(Boolean).map(Number).filter(Number.isFinite),
        muzeler: (b.muzeler ? b.muzeler.value : '').split(AYIRAC).filter(Boolean),
      });
    }
    let n = 0;
    v.eserler = v.eserler.map((e) => {
      const wd = e.qid && (e.kaynaklar || []).includes('wikidata') ? harita.get(e.qid) : null;
      if (!wd) return e;
      const { eser, degisim } = tazele(e, wd);
      for (const d of degisim) sayac[d] = (sayac[d] || 0) + 1;
      if (degisim.length) {
        n++;
        if (ornekler.length < 400) ornekler.push(`${sid} | ${e.baslik} | ${degisim.join(',')} | yıl ${e.yil ?? '-'} → ${eser.yil ?? '-'} | müze ${e.muze || '-'} → ${eser.muze || '-'}`);
      }
      return eser;
    });
    console.log(`${sid}: ${n} eser değişti`);
    await bekle(1200);
  }
  console.log('\nToplam:', JSON.stringify(sayac));
  await writeFile(new URL('scripts/.ham/wd_tazele_rapor.txt', KOK), ornekler.join('\n') + '\n').catch(() => {});
  if (process.env.KURU === '1') return console.log('KURU=1: dosya yazılmadı');
  onbellek.olusturma = new Date().toISOString();
  await writeFile(HEDEF, JSON.stringify(onbellek));
  console.log('data/eserler_onbellek.json yazıldı');
}

if (import.meta.url === `file://${process.argv[1]}`) await calis();
