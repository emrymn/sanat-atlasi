// İlerleme kitaplığındaki bütün kapakların görselleri (İş 28): ders eserinden gelenler ve sanatçının en bilinen eseri.
// scripts/gorsel_indir.py bu listeyi indirir (yerel kopya: Wikimedia 429'una ve çevrimdışılığa takılmasın).
// Tek başına: node scripts/kapaklar.mjs → JSON [{k, d|i|u, konu}]
import { readFileSync } from 'node:fs';
import { gorunurSanatcilar } from '../js/resim.js';
import { kursKonulari } from '../js/kurs.js';

const oku = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const turler = oku('data/eser_turleri.json');
const tum = oku('data/sanatcilar.json');
const onbellek = oku('data/eserler_onbellek.json');
const sanatcilar = gorunurSanatcilar(tum, turler, onbellek);

// uygulamadaki enBilinen (js/ekranlar/ortak.js) ile aynı seçim: pekiştirmeye uygun, en çok Wikipedia dili
function enBilinenGorsel(id) {
  const l = ((onbellek.sanatcilar[id] || {}).eserler || []).filter((e) => e.gorseller && e.gorseller.length && e.pekistirme !== false);
  if (!l.length) return null;
  return l.reduce((en, e) => ((e.sl || 0) > (en.sl || 0) ? e : en), l[0]).gorseller[0];
}

const liste = [];
for (const k of kursKonulari(oku('data/konular.json'), sanatcilar, turler, tum)) {
  const g = k.kapak.dosya ? { k: 'commons', d: k.kapak.dosya } : enBilinenGorsel(k.kapak.sanatci);
  if (g) liste.push({ ...g, konu: k.no });
}
console.log(JSON.stringify(liste));
