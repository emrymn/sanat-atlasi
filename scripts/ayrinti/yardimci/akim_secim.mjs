#!/usr/bin/env node
// Akım sayfalarındaki "En bilinen eserler" dörtlüsü: bütün konular açık sayılarak her akım için uygulamanın kendi
// seçimi (js/akim.js · enBilinenEserler) hesaplanır. data/basyapitlar.json'da yakın okuması olmayanlar
// scripts/ayrinti/akim_secim.json'a yazılır. Bkz. KARARLAR.md "İş 8" ve scripts/ayrinti/DEVIR.md "Tur 6".
//
// Kullanım: node scripts/ayrinti/yardimci/akim_secim.mjs [çıktı.json]
//
// Eser listesi uygulamanınkiyle aynı yoldan kurulur (js/eserler.js · sanatciEserleri): önbellek kaydı →
// çıkarılan görseller → elle düzeltmeler → kopyalar. Önbellek dosyası 30 günden eskiyse uygulama canlı Wikidata
// eserlerini de ekler; betik çevrimdışı çalışır ve yalnız dosyayı kullanır (taze dosyada sonuç birebir aynıdır).
// Çıktı kaydı: { anahtar (QID ya da "sanatçıId|başlık"), sanatci, akim, baslik, ad (Türkçe ad), yil, muze, sl,
//               gorsel (yerel görsel adı ya da null), devasa (4096 kopyası var mı) }
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  onbellekEseri,
  cikarilanlariAyarla,
  cikarilanlariAyikla,
  duzeltmeleriAyarla,
  duzeltmeleriUygula,
  kopyalariAyarla,
  kopyalariAyikla,
  eserAdiBul,
  adlariAl,
} from '../../../js/eserler.js';
import { enBilinenEserler } from '../../../js/akim.js';
import { sanatcilariBirlestir, akimlariBirlestir } from '../../../js/birlesme.js';
import { gorunurSanatcilar, gorunurAkimlar } from '../../../js/resim.js';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const oku = (p, yedek) => {
  try {
    return JSON.parse(readFileSync(path.join(KOK, p), 'utf8'));
  } catch (e) {
    if (yedek !== undefined) return yedek;
    throw e;
  }
};

export function hesapla() {
  const hazir = oku('data/eserler_onbellek.json');
  const turler = oku('data/eser_turleri.json', null);
  kopyalariAyarla(oku('data/kopya_eserler.json', null));
  cikarilanlariAyarla(oku('data/cikarilan_gorseller.json', null));
  duzeltmeleriAyarla(oku('data/eser_duzeltmeleri.json', null));
  const adlar = adlariAl(oku('data/eser_adlari_tr.json', null));
  const yerel = (oku('data/yerel_gorseller.json', {}).gorseller) || {};
  const kaynak = oku('data/gorsel_kaynagi.json', {});
  const devasa = new Set(kaynak.devasa || []);
  const basyapit = new Set((oku('data/basyapitlar.json', { eserler: [] }).eserler || []).map((b) => b.anahtar));

  const sanatcilar = gorunurSanatcilar(sanatcilariBirlestir(oku('data/sanatcilar.json')), turler, hazir);
  const akimlar = gorunurAkimlar(
    akimlariBirlestir(oku('data/akimlar.json')).slice().sort((a, b) => a.sira - b.sira),
    sanatcilar,
  );
  const eserleri = (s) => {
    const hk = hazir.sanatcilar && hazir.sanatcilar[s.id];
    if (!hk) return [];
    const l = kopyalariAyikla(s.id, duzeltmeleriUygula(s.id, cikarilanlariAyikla(hk.eserler.map(onbellekEseri))));
    for (const e of l) e.sid = s.id;
    return l;
  };

  const sonuc = [];
  for (const a of akimlar) {
    const listeler = sanatcilar.filter((s) => s.akim === a.ad).map((s) => ({ s, eserler: eserleri(s) }));
    enBilinenEserler(listeler, 4).forEach(({ s, e }, sira) => {
      const g = e.gorseller[0];
      const gorsel = yerel[`${g.k}:${g.d || g.i || g.u || ''}`] || null;
      sonuc.push({
        anahtar: e.qid || `${s.id}|${e.baslik}`,
        sanatci: s.id,
        akim: a.ad,
        akim_sira: a.sira,
        sira: sira + 1,
        baslik: e.baslik,
        ad: eserAdiBul(s.id, e, adlar) || '',
        yil: e.yil,
        muze: e.muze || '',
        sl: e.sl || 0,
        gorsel,
        devasa: !!(gorsel && devasa.has(gorsel)),
        // başyapıt sayfası eseri js/basyapit.js · eserEslestir ile bulur: QID ya da "sanatçı|başlık" (kopya birleşmesinde
        // kalan kayıt silinenin başlığını alır; ör. Bosch'un Zevk Bahçesi)
        basyapit: (e.qid && basyapit.has(e.qid)) || basyapit.has(`${s.id}|${e.baslik}`),
      });
    });
  }
  return sonuc;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const cikti = process.argv[2] || path.join(KOK, 'scripts/ayrinti/akim_secim.json');
  const hepsi = hesapla();
  const eksik = hepsi.filter((x) => !x.basyapit);
  const yerelli = eksik.filter((x) => x.gorsel);
  const yerelsiz = eksik.filter((x) => !x.gorsel);
  const kayit = (x) => {
    const { basyapit, akim_sira, ...k } = x;
    return k;
  };
  writeFileSync(
    cikti,
    JSON.stringify(
      {
        aciklama:
          'Akım sayfalarındaki "En bilinen eserler" dörtlüsünden data/basyapitlar.json\'da yakın okuması olmayanlar (bütün konular açık). scripts/ayrinti/yardimci/akim_secim.mjs üretir.',
        olusturma: new Date().toISOString().slice(0, 10),
        dortlu_toplam: hepsi.length,
        basyapitta_olan: hepsi.length - eksik.length,
        eserler: yerelli.map(kayit),
        yerel_gorseli_olmayan: yerelsiz.map(kayit),
      },
      null,
      1,
    ) + '\n',
  );
  let akim = '';
  for (const x of hepsi) {
    if (x.akim !== akim) console.log(`\n${(akim = x.akim)}`);
    console.log(
      `  ${x.sira}. ${x.basyapit ? '✓' : x.gorsel ? '·' : '✗'} ${x.anahtar.padEnd(12)} ${(x.ad || x.baslik).slice(0, 48).padEnd(48)} ${x.sanatci}${x.gorsel && !x.devasa ? ' (yalnız 1280)' : ''}`,
    );
  }
  console.log(`\n${hepsi.length} eser; başyapıtta ${hepsi.length - eksik.length}; eksik ${eksik.length} (yerel görselli ${yerelli.length}, yerel görselsiz ${yerelsiz.length}) → ${path.relative(KOK, cikti)}`);
  console.log('✓ başyapıtta · · eksik, yerel görselli · ✗ eksik, yerel görseli yok (dokunulmaz)');
}
