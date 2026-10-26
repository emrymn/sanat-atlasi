// Bölüm sonucunda asılı tablolar telefonun eğimiyle sallanır (İş 39): sarkaç adımı, ip boyu, durulma
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sarkacAdim, ipSertligi, durgunMu, EN_COK_SALINIM } from '../../js/sallanma.js';

const sur = (hedef, sn, sertlik, bas = { aci: 0, hiz: 0 }) => {
  let s = bas;
  let enUc = 0;
  for (let i = 0; i < sn * 60; i++) {
    s = sarkacAdim(s, hedef, 1 / 60, sertlik);
    enUc = Math.max(enUc, Math.abs(s.aci));
  }
  return { s, enUc };
};

test('sarkaç: hedef açıya gider, önce aşar (salınır), sonra durulur', () => {
  const hedef = -EN_COK_SALINIM;
  const { enUc } = sur(hedef, 1, ipSertligi(16));
  assert.ok(enUc > Math.abs(hedef), 'ilk salınımda hedefi aşar');
  const { s } = sur(hedef, 6, ipSertligi(16));
  assert.ok(durgunMu(s, hedef), `durulur: ${JSON.stringify(s)}`);
});

test('sarkaç: telefon bırakılınca (hedef 0) tablo ortaya döner', () => {
  const { s } = sur(0, 6, ipSertligi(28), { aci: 9, hiz: 0 });
  assert.ok(Math.abs(s.aci) < 0.05);
});

test('ip uzadıkça sarkaç ağırlaşır; büyük adımda bile patlamaz', () => {
  assert.ok(ipSertligi(10) > ipSertligi(28));
  let s = { aci: 9, hiz: 0 };
  for (let i = 0; i < 200; i++) s = sarkacAdim(s, 0, 0.04, ipSertligi(10));
  assert.ok(Number.isFinite(s.aci) && Math.abs(s.aci) < 1);
});
