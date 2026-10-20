// Derleme zamanı eser önbelleği → data/eserler_onbellek.json (surum 3).
// Her sanatçı için şu kaynaklar birleştirilir:
//   kurs eserleri, Wikidata (P170 + resim süzgeci), The Met, Art Institute of Chicago, Cleveland Museum of Art,
//   National Gallery of Art ve Commons "Paintings by …" kategorisi.
// Uygulama bu dosya olmadan da çalışır (kurs eserleri + canlı Wikidata).
//
// Kullanım:  node scripts/onbellek.mjs              (hepsi; kayıtlı QID'ler kullanılır)
//            node scripts/onbellek.mjs giotto-di-bondone ...   (yalnızca bu id'ler; dosyadaki diğerleri korunur)
//            QID=1 node scripts/onbellek.mjs ...      (QID'leri Wikidata'dan yeniden çöz)
//            TAZE=1 …                                  (scripts/.ham/ altındaki ham yanıt önbelleğini atla)
// NGA verisi için önce CSV'leri indir: bkz. README (scripts/.ham/nga/).
// Vekil sunucu arkasındaysan: NODE_USE_ENV_PROXY=1 node scripts/onbellek.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { qidCoz } from '../js/wikidata.js';
import { kursResimleri } from '../js/resim.js';
import { dosyaNormal } from '../js/yardimci.js';
import { getir } from './kaynaklar/ortak.mjs';
import { wikidataEserleri, sanatciBilgileri } from './kaynaklar/wikidata.mjs';
import { metEserleri } from './kaynaklar/met.mjs';
import { aicEserleri } from './kaynaklar/aic.mjs';
import { cmaEserleri } from './kaynaklar/cma.mjs';
import { ngaEserleri } from './kaynaklar/nga.mjs';
import { commonsEserleri } from './kaynaklar/commons.mjs';
import { birlestir, makulYilMi, wikiartiUygula } from './kaynaklar/birlestir.mjs';

export const SURUM = 3;
const COMMONS_ESIGI = 12; // daha az eseri olan sanatçılar için Commons kategorisine de bakılır

const kok = new URL('../', import.meta.url);
const oku = async (yol, yedek) => {
  try {
    return JSON.parse(await readFile(new URL(yol, kok), 'utf8'));
  } catch {
    return yedek;
  }
};
const hedef = new URL('data/eserler_onbellek.json', kok);
const sanatcilar = await oku('data/sanatcilar.json');
const turler = await oku('data/eser_turleri.json', { kurs: {}, ana_ugras_disi: {} });
const kararlar = (await oku('data/gorsel_kararlari.json', { kararlar: {} })).kararlar || {};
const eski = await oku('data/eserler_onbellek.json', { sanatcilar: {} });
const secili = process.argv.slice(2);

const onbellek = { surum: SURUM, olusturma: null, sanatcilar: secili.length ? { ...(eski.surum === SURUM ? eski.sanatcilar : {}) } : {} };

// QID'ler: kayıtlı olanlar (QID=1 ile yeniden çözülür)
const qidler = {};
for (const s of sanatcilar) {
  if (secili.length && !secili.includes(s.id)) continue;
  qidler[s.id] = process.env.QID === '1' || !eski.sanatcilar[s.id] ? await qidCoz(s, getir).catch(() => null) : eski.sanatcilar[s.id].qid;
}
const bilgi = await sanatciBilgileri(Object.values(qidler).filter(Boolean));

// Uygulamanın okuduğu sade biçim
function sadelestir(e) {
  const o = { baslik: e.baslik };
  if (e.baslikEn && e.baslikEn !== e.baslik) o.baslikEn = e.baslikEn;
  if (e.yil != null) o.yil = e.yil;
  if (e.tarih) o.tarih = e.tarih;
  if (e.yer || e.muze) o.muze = e.yer || e.muze;
  if (e.kurs) {
    o.kurs = true;
    if (e.kursKonu != null) o.konu = e.kursKonu;
  }
  if (e.qid) o.qid = e.qid;
  o.kaynaklar = e.kaynaklar;
  if (e.sl) o.sl = e.sl;
  o.gorseller = e.gorseller;
  if (!e.pekistirme) o.pekistirme = false;
  return o;
}

let i = 0;
for (const s of sanatcilar) {
  i++;
  if (!(s.id in qidler)) continue;
  const qid = qidler[s.id];
  const b = (qid && bilgi[qid]) || { adlar: [] };
  const adlar = [s.ad, s.ad_arama, ...b.adlar];
  try {
    if (turler.ana_ugras_disi && turler.ana_ugras_disi[s.id]) {
      onbellek.sanatcilar[s.id] = { qid, eserler: [] };
      console.log(`${i}/${sanatcilar.length} ${s.id}: ana uğraşı resim değil, atlandı`);
      continue;
    }
    const kurs = kursResimleri(s, turler).map((e) => {
      const k = turler.kurs[dosyaNormal(e.commons_dosya).toLowerCase()] || {};
      return { baslik: e.baslik, tarih: e.tarih, yer: e.yer, lisans: e.lisans, konu: e.konu, dosya: e.commons_dosya, qid: k.qid };
    });
    // Bir müze kaynağı hata verirse (ör. 403) o kaynak atlanır, diğerleri kullanılır
    const guvenli = (ad, soz) =>
      soz.catch((e) => {
        console.log(`   ${s.id}: ${ad} atlandı (${e.message})`);
        return [];
      });
    const [wd, met, aic, cma, nga] = await Promise.all([
      wikidataEserleri(qid),
      guvenli('met', metEserleri(s, qid)),
      guvenli('aic', aicEserleri(s, b.adlar)),
      guvenli('cma', cmaEserleri(s, b.adlar)),
      guvenli('nga', ngaEserleri(qid)),
    ]);
    // Tarihi sanatçının hayatıyla uyuşmayan müze kayıtları (ölümünden sonraki röprodüksiyon baskıları,
    // doğumundan önce başlayan geniş tarih aralıkları) emin olunamadığı için alınmaz
    const muzeler = [...met, ...aic, ...cma, ...nga].filter((m) => makulYilMi(s, m.yil));
    let commons = [];
    if (kurs.length + wd.length + met.length + aic.length + cma.length + nga.length < COMMONS_ESIGI) commons = await commonsEserleri(s, b.kategori, adlar);
    const eserler = birlestir({ kurs, wd, muzeler, commons, kararlar });
    onbellek.sanatcilar[s.id] = { qid, eserler: eserler.map(sadelestir) };
    const say = (k) => eserler.filter((e) => e.kaynaklar.includes(k)).length;
    console.log(
      `${i}/${sanatcilar.length} ${s.id}: ${qid || 'QID yok'} · ${eserler.length} eser (kurs ${say('kurs')}, wd ${say('wikidata')}, met ${say('met')}, aic ${say('aic')}, cma ${say('cma')}, nga ${say('nga')}, commons ${say('commons')})`,
    );
  } catch (e) {
    console.log(`${i}/${sanatcilar.length} ${s.id}: HATA ${e.message} (atlandı)`);
  }
  onbellek.olusturma = new Date().toISOString();
  await writeFile(hedef, JSON.stringify(onbellek));
}
// WikiArt (data/wikiart.json, scripts/kaynaklar/wikiart.mjs) ağa gitmeden eklenir
wikiartiUygula(onbellek, await oku('data/wikiart.json', { sanatcilar: {} }));
await writeFile(hedef, JSON.stringify(onbellek));
console.log('Bitti:', Object.keys(onbellek.sanatcilar).length, 'sanatçı');
