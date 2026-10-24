// Yolculuk haritası ve bölümleri (İş 24)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { BOLGELER, BINME, bolgeBul, haritaKur, vakit, gorulenDogrula, resimAdresi, nesneAdresi, yolcuAdresi } from '../../js/harita.js';
import {
  bolumleriKur,
  bolumDurumlari,
  bolumKartlari,
  bolumSonucuIsle,
  bolumlerDogrula,
  akimGecmeSayisi,
  kilitMetni,
  tanitimGoruldu,
  BOLUM_SORU,
  KUME_EN_AZ,
} from '../../js/bolum.js';
import { ilerlemeDogrula } from '../../js/depo.js';
import { gorunurSanatcilar, gorunurAkimlar } from '../../js/resim.js';

const oku = (p) => JSON.parse(readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8'));
// uygulama yalnız resmi olan sanatçıları ve akımlarını gösterir (js/app.js): bölümler bunlardan kurulur
const sanatcilar = gorunurSanatcilar(oku('data/sanatcilar.json'), oku('data/eser_turleri.json'), oku('data/eserler_onbellek.json'));
const akimlar = gorunurAkimlar(oku('data/akimlar.json').sort((a, b) => a.sira - b.sira), sanatcilar);
const veri = oku('data/harita.json');
const harita = new Map(sanatcilar.map((s) => [s.id, s]));
const bolumler = bolumleriKur(akimlar, sanatcilar);
const tumKonular = [...new Set(sanatcilar.map((s) => s.konu))];

test('bölümler: her sanatçı tam bir bölümde, küçük konular birleşir, akım sırası korunur', () => {
  const hepsi = bolumler.flatMap((b) => b.sanatcilar);
  assert.equal(hepsi.length, sanatcilar.length);
  assert.equal(new Set(hepsi).size, sanatcilar.length);
  for (const b of bolumler) {
    const akiminSanatcisi = sanatcilar.filter((s) => s.akim === b.akim).length;
    // tek bölümlü küçük akımlar dışında her bölümde en az 3 sanatçı
    assert.ok(b.sanatcilar.length >= KUME_EN_AZ || akiminSanatcisi < KUME_EN_AZ * 2, b.id);
    assert.match(b.id, /^\d+-\d+$/);
  }
  const siralar = bolumler.map((b) => b.sira);
  assert.deepEqual(siralar, siralar.slice().sort((a, b) => a - b));
});

test('harita verisi: her bölgenin gündüz ve gece durak sayısı bölüm sayısıyla aynı, görseller var', () => {
  for (const b of BOLGELER) {
    const n = bolumler.filter((x) => bolgeBul(x.sira).id === b.id).length;
    for (const tur of ['gunduz', 'gece']) {
      const v = veri.bolgeler[b.id][tur];
      assert.equal(v.duraklar.length, n, `${b.id} ${tur}`);
      for (const [x, y] of v.duraklar) assert.ok(x > 0 && x < 1 && y > 0 && y < 1, `${b.id} ${tur} ${x},${y}`);
      for (const yol of [resimAdresi(b.id, tur), nesneAdresi(b.id, tur), yolcuAdresi(b.id, tur)])
        assert.ok(existsSync(new URL(`../../${yol}`, import.meta.url)), yol);
      for (const m of v.motifler) {
        assert.ok(veri.eserler[m.eser], m.eser);
        assert.equal(m.kutu.length, 4);
      }
    }
  }
});

test('kilit: ilk bölüm açık, Orta geçilmeden sonraki kapalı; akımda %60 Orta geçilince sonraki akım', () => {
  const il = { bolumler: {} };
  let { durumlar, simdiki } = bolumDurumlari(bolumler, il, tumKonular, harita);
  assert.equal(durumlar[0].acik, true);
  assert.equal(durumlar[1].acik, false);
  assert.equal(simdiki, bolumler[0].id);
  assert.equal(durumlar[0].seviyeAcik.orta, false);
  // Kolay geçilince Orta açılır, sonraki bölüm hâlâ kapalı
  bolumSonucuIsle(il, bolumler[0].id, 'kolay', 7, 8);
  ({ durumlar } = bolumDurumlari(bolumler, il, tumKonular, harita));
  assert.equal(durumlar[0].seviyeAcik.orta, true);
  assert.equal(durumlar[1].acik, false);
  assert.match(kilitMetni(durumlar[1], bolumler), /Orta/);
  // Orta geçilince sonraki
  bolumSonucuIsle(il, bolumler[0].id, 'orta', 8, 10);
  ({ durumlar, simdiki } = bolumDurumlari(bolumler, il, tumKonular, harita));
  assert.equal(durumlar[1].acik, true);
  assert.equal(simdiki, bolumler[1].id);
  assert.equal(durumlar[0].yildiz, 2);
  // çok bölümlü bir akım: %60'ı geçilmeden sonraki akım kapalı
  const gotik = bolumler.filter((b) => b.akim === 'Gotik');
  assert.ok(gotik.length >= 2);
  const sonrakiIlk = bolumler[bolumler.indexOf(gotik[gotik.length - 1]) + 1];
  for (const b of bolumler.slice(0, bolumler.indexOf(gotik[0]))) bolumSonucuIsle(il, b.id, 'orta', 10, 10);
  const gereken = akimGecmeSayisi(gotik.length);
  for (const b of gotik.slice(0, gereken - 1)) bolumSonucuIsle(il, b.id, 'orta', 10, 10);
  ({ durumlar } = bolumDurumlari(bolumler, il, tumKonular, harita));
  assert.equal(durumlar.find((x) => x.id === sonrakiIlk.id).acik, false);
  bolumSonucuIsle(il, gotik[gereken - 1].id, 'orta', 10, 10);
  ({ durumlar } = bolumDurumlari(bolumler, il, tumKonular, harita));
  assert.equal(durumlar.find((x) => x.id === sonrakiIlk.id).acik, true);
});

test('kilit: kursta konusu işlenmemiş bölüm kapalı ve nedeni konu', () => {
  const { durumlar, simdiki } = bolumDurumlari(bolumler, {}, [], harita);
  assert.equal(durumlar[0].acik, false);
  assert.equal(durumlar[0].neden.tur, 'kurs');
  assert.match(kilitMetni(durumlar[0], bolumler), /^Konu \d+ işlenince açılır\.$/);
  assert.equal(simdiki, null);
});

test('akım geçme sayısı: 5 bölümde 3, 3 bölümde 2, 1 bölümde 1', () => {
  assert.equal(akimGecmeSayisi(5), 3);
  assert.equal(akimGecmeSayisi(3), 2);
  assert.equal(akimGecmeSayisi(2), 2);
  assert.equal(akimGecmeSayisi(1), 1);
});

test('tur kartları: tam sayı, aynı sanatçı arka arkaya gelmez', () => {
  let r = 0.3;
  const rng = () => ((r = (r * 9301 + 49297) % 233280), r / 233280);
  const k = bolumKartlari(['a', 'b', 'c'], BOLUM_SORU.orta, rng);
  assert.equal(k.length, 10);
  for (let i = 1; i < k.length; i++) assert.notEqual(k[i], k[i - 1]);
  assert.equal(bolumKartlari(['a'], 8, rng).length, 8);
  assert.deepEqual(bolumKartlari([], 8, rng), []);
});

test('sonuç: en iyi oran tutulur, %75 sınırı', () => {
  const il = {};
  const r1 = bolumSonucuIsle(il, '2-1', 'kolay', 5, 8);
  assert.equal(r1.gecti, false);
  const r2 = bolumSonucuIsle(il, '2-1', 'kolay', 6, 8);
  assert.equal(r2.gecti, true);
  assert.equal(r2.yeniGecti, true);
  const r3 = bolumSonucuIsle(il, '2-1', 'kolay', 2, 8);
  assert.equal(il.bolumler['2-1'].kolay, 0.75);
  assert.equal(r3.yeniGecti, false);
  tanitimGoruldu(il, '2-1');
  assert.equal(il.bolumler['2-1'].tanitim, true);
});

test('doğrulama: bozuk bölüm kayıtları atılır; depo alanları', () => {
  assert.deepEqual(bolumlerDogrula({ '1-1': { kolay: 0.8, orta: 2, tanitim: true }, x: { kolay: 1 }, '2-1': null }), { '1-1': { kolay: 0.8, tanitim: true } });
  assert.deepEqual(bolumlerDogrula([]), {});
  assert.deepEqual(ilerlemeDogrula({ islenen: [1], bolumler: { '0-1': { orta: 0.9 } } }).bolumler, { '0-1': { orta: 0.9 } });
  assert.deepEqual(ilerlemeDogrula({ islenen: [1], haritaGorulen: ['0-1', 5] }).haritaGorulen, ['0-1']);
  assert.deepEqual(gorulenDogrula('x'), []);
});

test('harita yerleşimi: Orta Çağ en altta, Modern en üstte, bölgeler sisle biner', () => {
  const { durumlar } = bolumDurumlari(bolumler, {}, tumKonular, harita);
  const h = haritaKur(durumlar, veri, 'gunduz');
  assert.equal(h.bolgeler.length, 8);
  assert.ok(Math.abs(h.yukseklik - (8 - 7 * BINME)) < 1e-9);
  assert.equal(h.bolgeler[0].id, 'ortacag');
  assert.ok(Math.abs(h.bolgeler[0].ust - (h.yukseklik - 1)) < 1e-9);
  assert.ok(Math.abs(h.bolgeler[7].ust) < 1e-9);
  assert.equal(h.bolgeler.reduce((t, b) => t + b.duraklar.length, 0), bolumler.length);
});

test('vakit: 07–19 gündüz, gerisi gece', () => {
  assert.equal(vakit(new Date(2026, 0, 1, 6, 59)), 'gece');
  assert.equal(vakit(new Date(2026, 0, 1, 7, 0)), 'gunduz');
  assert.equal(vakit(new Date(2026, 0, 1, 18, 59)), 'gunduz');
  assert.equal(vakit(new Date(2026, 0, 1, 19, 0)), 'gece');
});
