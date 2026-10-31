// Yolculuk haritası ve bölümleri (İş 24)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { BOLGELER, bolgeBul, haritaKur, sepyaSiniri, vakit, gorulenDogrula, resimAdresi, nesneAdresi, yolcuAdresi, yolcuYeri, yolcuYolu, yolcuPozu, cizgiUzunlugu, cizgideNokta, SEPYA_PAY, ARA, W, H } from '../../js/harita.js';
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

test('harita verisi: her bölgede bölüm sayısı kadar meydan ve sembol, görseller var, motiflerin hikâyesi var', () => {
  for (const b of BOLGELER) {
    const n = bolumler.filter((x) => bolgeBul(x.sira).id === b.id).length;
    const v = veri.bolgeler[b.id];
    assert.equal(v.duraklar.length, n, b.id);
    assert.equal(v.semboller.length, n, b.id);
    for (const [x, y] of v.duraklar) assert.ok(x > 0 && x < 1 && y > 0 && y < 1, `${b.id} ${x},${y}`);
    for (const tur of ['gunduz', 'gece']) {
      const yollar = [resimAdresi(b.id, tur), yolcuAdresi(b.id, 'dur', tur, yolcuVeri.bolgeler[b.id].ad), ...v.semboller.map((_, i) => nesneAdresi(b.id, i + 1, tur))];
      for (const yol of yollar) assert.ok(existsSync(new URL(`../../${yol}`, import.meta.url)), yol);
    }
    assert.ok(v.motifler.length > 0, b.id);
    for (const m of v.motifler) {
      assert.ok(veri.eserler[m.eser] && veri.eserler[m.eser].hikaye, m.eser);
      assert.ok(harita.has(veri.eserler[m.eser].sanatci_id) || veri.eserler[m.eser].sanatci_id, m.eser);
      assert.equal(m.kutu.length, 4);
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

test('harita yerleşimi: Orta Çağ en altta, Modern en üstte, resimler bitişik, her durağın kendi sembolü', () => {
  const { durumlar } = bolumDurumlari(bolumler, {}, tumKonular, harita);
  const h = haritaKur(durumlar, veri);
  assert.equal(h.bolgeler.length, 9);
  assert.ok(Math.abs(h.yukseklik - (9 + 8 * ARA)) < 1e-9);
  assert.equal(h.bolgeler[0].id, 'ortacag');
  assert.ok(Math.abs(h.bolgeler[0].ust - 8 * (1 + ARA)) < 1e-9);
  assert.equal(h.bolgeler[8].ust, 0);
  // her ara tam iki resmin arasında: üstteki resmin altı + ARA = alttakinin üstü
  for (let i = 0; i < 8; i++) assert.ok(Math.abs(h.bolgeler[i + 1].ust + 1 + ARA - h.bolgeler[i].ust) < 1e-9);
  assert.equal(h.bolgeler.reduce((t, b) => t + b.duraklar.length, 0), bolumler.length);
  for (const b of h.bolgeler) assert.deepEqual(b.duraklar.map((x) => x.sembolNo), b.duraklar.map((_, i) => i + 1));
  // ilk kurulumda yalnız ilk durak açık: sepya sınırı onun biraz üstünde; hiç açık yoksa bütün harita sepya
  const ilk = h.bolgeler[0].duraklar[0];
  assert.ok(Math.abs(sepyaSiniri(h) - (8 * (1 + ARA) + ilk.y - SEPYA_PAY)) < 1e-9);
  const kapali = haritaKur(durumlar.map((x) => ({ ...x, acik: false })), veri);
  assert.equal(sepyaSiniri(kapali), kapali.yukseklik);
  // meydandan fazla bölüm: son meydanın üstüne dizilir, son sembolü kullanır
  const fazla = haritaKur([...durumlar, { ...durumlar[0], id: '0-9', sira: 0 }], veri);
  const oc = fazla.bolgeler[0].duraklar;
  assert.equal(oc[oc.length - 1].sembolNo, oc.length - 1);
});

test('vakit: 07–19 gündüz, gerisi gece', () => {
  assert.equal(vakit(new Date(2026, 0, 1, 6, 59)), 'gece');
  assert.equal(vakit(new Date(2026, 0, 1, 7, 0)), 'gunduz');
  assert.equal(vakit(new Date(2026, 0, 1, 18, 59)), 'gunduz');
  assert.equal(vakit(new Date(2026, 0, 1, 19, 0)), 'gece');
});

// ---------- İş 30 · katmanlar ----------
import { bolumEserleri, BOLUM_ESER, TANITIM_SEVIYE } from '../../js/bolum.js';
import { sanatciCeldiricileri, soyadi, akrabaMi } from '../../js/celdirici.js';

test('katmanlar: Kolay ilk 5 (en kolay), Orta sonraki 5, az eserli sanatçıda Orta = Kolay; Zor sınırsız', () => {
  const h = Array.from({ length: 12 }, (_, i) => ({ anahtar: `e${i}`, sl: 100 - i }));
  const puan = { e3: 10, e7: 9 }; // en kolaylar önce
  const k = bolumEserleri(h, 'kolay', (e) => puan[e.anahtar]);
  assert.equal(k.length, BOLUM_ESER);
  assert.deepEqual(k.map((e) => e.anahtar), ['e3', 'e7', 'e0', 'e1', 'e2']);
  const o = bolumEserleri(h, 'orta', (e) => puan[e.anahtar]);
  assert.deepEqual(o.map((e) => e.anahtar), ['e4', 'e5', 'e6', 'e8', 'e9']);
  assert.ok(o.every((e) => !k.includes(e)));
  assert.deepEqual(bolumEserleri(h.slice(0, 4), 'orta').map((e) => e.anahtar), ['e0', 'e1', 'e2', 'e3']);
  assert.equal(bolumEserleri(h, 'zor'), null);
  assert.equal(TANITIM_SEVIYE['tanitim-orta'], 'orta');
});

test('katmanlar: tanıtım kayıtları (Kolay ve Orta ayrı) doğrulanır', () => {
  const il = {};
  tanitimGoruldu(il, '3-1', 'orta');
  assert.deepEqual(il.bolumler['3-1'], { tanitimOrta: true });
  tanitimGoruldu(il, '3-1');
  assert.deepEqual(bolumlerDogrula(il.bolumler), { '3-1': { tanitim: true, tanitimOrta: true } });
});

test('şıklar: karma = 1 şaşırtmalı (aynı/komşu akım) + 2 uzak; akrabalar hiçbir seviyede şık değil', () => {
  const tum = gorunurSanatcilar(oku('data/sanatcilar.json'), oku('data/eser_turleri.json'), oku('data/eserler_onbellek.json'));
  const ak = gorunurAkimlar(oku('data/akimlar.json').sort((a, b) => a.sira - b.sira), tum);
  const sira = Object.fromEntries(ak.map((a) => [a.ad, a.sira]));
  let r = 0.11;
  const rng = () => ((r = (r * 9301 + 49297) % 233280), r / 233280);
  for (const hedef of tum.slice(0, 60)) {
    const a = ak.find((x) => x.ad === hedef.akim);
    const c = sanatciCeldiricileri(hedef, { sanatcilar: tum, akimlar: ak, rng, seviye: 'karma' });
    assert.equal(c.length, 3, hedef.id);
    const benzer = c.filter((s) => s.akim === hedef.akim || (a.komsular || []).includes(s.akim));
    const uzak = c.filter((s) => Math.abs(sira[s.akim] - a.sira) >= 3 && !(a.komsular || []).includes(s.akim));
    assert.ok(benzer.length <= 1, `${hedef.id}: ${benzer.map((s) => s.id)}`);
    assert.ok(uzak.length >= 2, `${hedef.id}: ${c.map((s) => s.akim)}`);
  }
  const pietro = tum.find((s) => s.id.includes('pietro-lorenzetti'));
  const ambrogio = tum.find((s) => s.id.includes('ambrogio-lorenzetti'));
  assert.ok(pietro && ambrogio && akrabaMi(pietro, ambrogio));
  assert.equal(soyadi({ ad: 'Pieter Bruegel the Elder' }), 'bruegel');
  for (const seviye of ['kolay', 'orta', 'zor', 'karma'])
    for (let i = 0; i < 30; i++) {
      const c = sanatciCeldiricileri(pietro, { sanatcilar: tum, akimlar: ak, rng, seviye });
      assert.ok(!c.some((s) => akrabaMi(s, pietro)), seviye);
      const soy = c.map(soyadi);
      assert.equal(new Set(soy).size, soy.length);
    }
});

// İş 90: öğrenci patikada yürür (data/harita_patikalar.json: resimdeki boyalı yol)
const patikalar = JSON.parse(readFileSync(new URL('../../data/harita_patikalar.json', import.meta.url)));
const yolcuVeri = JSON.parse(readFileSync(new URL('../../data/harita_yolcu.json', import.meta.url)));

test('İş 90: her dönemde durak sayısı kadar yer, aralarında patika; pozların resmi var', () => {
  for (const b of BOLGELER) {
    const v = veri.bolgeler[b.id];
    const p = patikalar.bolgeler[b.id];
    assert.equal(p.yerler.length, v.duraklar.length, b.id);
    assert.equal(p.yollar.length, v.duraklar.length - 1, b.id);
    for (const y of p.yollar) {
      assert.ok(y.length >= 2);
      for (const [x, yy] of y) assert.ok(x >= 0 && x <= 1 && yy >= 0 && yy <= 1, b.id);
    }
    // patika öğrencinin durduğu yerden başlar ve öbüründe biter (uygulamadaki hesapla aynı)
    p.yerler.forEach(([x, y], i) => {
      const u = yolcuYeri({ x: v.duraklar[i][0], y: v.duraklar[i][1] });
      assert.ok(Math.abs(x * W - u.x) < 0.5 && Math.abs(y * H - u.y) < 0.5, `${b.id} ${i}`);
    });
    for (const poz of Object.keys(yolcuVeri.bolgeler[b.id].pozlar))
      for (const tur of ['gunduz', 'gece']) assert.ok(existsSync(new URL(`../../${yolcuAdresi(b.id, poz, tur, yolcuVeri.bolgeler[b.id].ad)}`, import.meta.url)), `${b.id} ${poz}`);
    assert.ok(yolcuVeri.bolgeler[b.id].pozlar.dur, b.id);
  }
});

test('İş 90/92: yolcuYolu — dönem içinde patikayı izler (ileri ve geri), dönem değişince söner ve belirir', () => {
  const durumlar = bolumler.map((x) => ({ ...x, acik: true }));
  const h = haritaKur(durumlar, veri);
  const sira = h.bolgeler.flatMap((b) => b.duraklar.map((x) => ({ b, x })));
  const yer = (s) => {
    const p = yolcuYeri(s.x);
    return [p.x, s.b.ust * H + p.y];
  };
  const ron = sira.filter((s) => s.b.id === 'ronesans');
  // Rönesans 1 → 3: tek parça, iki patika art arda; noktalar Rönesans resminin içinde
  const y = yolcuYolu(h, patikalar, ron[0].x.id, ron[2].x.id);
  assert.equal(y.parcalar.length, 1);
  const n = y.parcalar[0].noktalar;
  const pt = patikalar.bolgeler.ronesans.yollar;
  assert.equal(n.length, pt[0].length + pt[1].length - 1);
  const b = ron[0].b;
  for (const [, yy] of n) assert.ok(yy >= b.ust * H && yy <= (b.ust + 1) * H);
  assert.deepEqual(n[0], yer(ron[0]));
  assert.deepEqual(n[1], [pt[0][1][0] * W, (b.ust + pt[0][1][1]) * H]);
  // geri: aynı noktalar ters sırada
  const g = yolcuYolu(h, patikalar, ron[2].x.id, ron[0].x.id);
  assert.equal(g.parcalar.length, 1);
  assert.deepEqual(g.parcalar[0].noktalar, [...n].reverse());
  assert.equal(g.geri, true);
  assert.equal(y.geri, false);
  // Orta Çağ'ın son durağından Rönesans'ın ikincisine: Orta Çağ'da söner, Rönesans'ın ilk durağından yürür
  const ort = sira.filter((s) => s.b.id === 'ortacag');
  const t = yolcuYolu(h, patikalar, ort.at(-1).x.id, ron[1].x.id);
  assert.deepEqual(t.parcalar.map((p) => [p.bolge, p.noktalar.length > 1]), [['ortacag', false], ['ronesans', true]]);
  assert.deepEqual(t.parcalar[1].noktalar[0], yer(ron[0]));
  // Orta Çağ'ın sondan ikincisinden Rönesans'ın ilkine: Orta Çağ'da yürür, Rönesans'ta belirir
  const u = yolcuYolu(h, patikalar, ort.at(-2).x.id, ron[0].x.id);
  assert.deepEqual(u.parcalar.map((p) => [p.bolge, p.noktalar.length > 1]), [['ortacag', true], ['ronesans', false]]);
  // çok uzak (en çok 4 durak): bulunduğu yerde söner, hedefe 4 durak kala belirip yürür
  const v = yolcuYolu(h, patikalar, sira[0].x.id, sira[10].x.id);
  assert.deepEqual(v.parcalar[0].noktalar, [yer(sira[0])]);
  assert.deepEqual(v.parcalar.at(-1).noktalar.at(-1), yer(sira[10]));
  assert.equal(yolcuYolu(h, patikalar, null, ron[0].x.id), null);
  assert.equal(yolcuYolu(h, patikalar, ron[1].x.id, ron[1].x.id), null);
});

test('İş 90: çizgide nokta ve uzunluk', () => {
  const n = [[0, 0], [3, 4], [3, 10]];
  assert.equal(cizgiUzunlugu(n), 11);
  assert.deepEqual(cizgideNokta(n, 0), { x: 0, y: 0, dx: 3, dy: 4 });
  assert.deepEqual(cizgideNokta(n, 7), { x: 3, y: 6, dx: 0, dy: 6 });
  assert.deepEqual(cizgideNokta(n, 50), { x: 3, y: 10, dx: 0, dy: 6 });
  assert.deepEqual(cizgideNokta([[2, 2]], 5), { x: 2, y: 2, dx: 0, dy: 0 });
});

test('İş 90: haritaYolcu yedekten doğrulanır', () => {
  assert.equal(ilerlemeDogrula({ islenen: [], haritaYolcu: 'r-1' }).haritaYolcu, 'r-1');
  assert.equal(ilerlemeDogrula({ islenen: [], haritaYolcu: 5 }).haritaYolcu, null);
});

test('İş 93: yürürken poz — aşağı inerken önden, yukarı çıkarken arkadan kareleri, yoksa duruş', () => {
  const tek = { dur: {} };
  assert.equal(yolcuPozu(tek, 0, 5, 0), 'dur');
  const onlu = { dur: {}, on: {} };
  assert.equal(yolcuPozu(onlu, 1, 5, 3), 'on');
  assert.equal(yolcuPozu(onlu, 5, 1, 3), 'dur'); // yana: sırtı dönük (yönüne göre çevrilir)
  assert.equal(yolcuPozu(onlu, 0, -5, 3), 'dur');
  const tam = { dur: {}, on: {}, yuru1: {}, yuru2: {}, arka1: {}, arka2: {} };
  assert.equal(yolcuPozu(tam, 5, 0, 3), 'yuru2');
  assert.equal(yolcuPozu(tam, 0, -5, 2), 'arka1');
  assert.equal(yolcuPozu(tam, 0, 5, 2), 'on');
});
