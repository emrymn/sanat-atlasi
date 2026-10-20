import { test } from 'node:test';
import assert from 'node:assert/strict';
import { acikMi, acikSanatcilar, akimDurumlari, yeniAcilanlar } from '../../js/kilit.js';
import { sanatcilar, akimlar } from './yardimci.mjs';
import { readFileSync } from 'node:fs';

const baslangic = JSON.parse(readFileSync(new URL('../../data/baslangic_ilerleme.json', import.meta.url), 'utf8'));

test('sanatçı yalnızca konusu işlenince açılır (ek sanatçılar dahil)', () => {
  const s = { konu: 12, kaynak: 'ek' };
  assert.equal(acikMi(s, [1, 2]), false);
  assert.equal(acikMi(s, [1, 12]), true);
  assert.equal(acikMi(s, new Set([12])), true);
});

test('başlangıç ilerlemesiyle açık sanatçılar', () => {
  const acik = acikSanatcilar(sanatcilar, baslangic.islenen);
  assert.ok(acik.length > 0);
  assert.ok(acik.every((s) => baslangic.islenen.includes(s.konu)));
  assert.ok(acik.some((s) => s.kaynak === 'ek'));
});

test('akım durumları kronolojik ve kilitli olanlar en erken konu numarasını verir', () => {
  const d = akimDurumlari(akimlar, sanatcilar, [1, 2]);
  assert.deepEqual(
    d.map((a) => a.sira),
    [...d.map((a) => a.sira)].sort((a, b) => a - b),
  );
  const antik = d.find((a) => a.ad === 'Antik Yunan ve Roma');
  assert.equal(antik.acik, true);
  const empresyonizm = d.find((a) => a.ad === 'Empresyonizm');
  assert.equal(empresyonizm.acik, false);
  const enErken = Math.min(...sanatcilar.filter((s) => s.akim === 'Empresyonizm').map((s) => s.konu));
  assert.equal(empresyonizm.acilacagiKonu, enErken);
});

test('konu işaretlenince yeni açılanlar listelenir, kaldırılınca kilitlenir', () => {
  const once = [1, 2];
  const sonra = [1, 2, 12];
  const yeni = yeniAcilanlar(sanatcilar, once, sonra);
  assert.deepEqual(
    yeni.map((s) => s.id).sort(),
    sanatcilar
      .filter((s) => s.konu === 12)
      .map((s) => s.id)
      .sort(),
  );
  assert.equal(yeniAcilanlar(sanatcilar, sonra, once).length, 0);
  assert.equal(
    acikSanatcilar(sanatcilar, once).some((s) => s.konu === 12),
    false,
  );
});

test('veri tutarlılığı: her sanatçının akımı ve komşu akımlar tanımlı', () => {
  const adlar = new Set(akimlar.map((a) => a.ad));
  for (const s of sanatcilar) assert.ok(adlar.has(s.akim), s.id);
  for (const a of akimlar) for (const k of a.komsular) assert.ok(adlar.has(k), `${a.ad} → ${k}`);
});

test('pekiştirmeye elle eklenen sanatçı, konusu işlenmemiş olsa da açık sayılır', () => {
  const kapali = sanatcilar.find((s) => s.konu === 66 || s.konu > 60);
  assert.equal(
    acikSanatcilar(sanatcilar, [1]).some((s) => s.id === kapali.id),
    false,
  );
  assert.equal(
    acikSanatcilar(sanatcilar, [1], [kapali.id]).some((s) => s.id === kapali.id),
    true,
  );
});
