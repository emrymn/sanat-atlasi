import { test } from 'node:test';
import assert from 'node:assert/strict';
import { okunacakAd, sesSec } from '../../js/kunye.js';
import { readFileSync } from 'node:fs';

test('okunuş: Türkçe ekler ve açıklamalar atılır', () => {
  assert.equal(okunacakAd('Pieter Bruegel (Yaşlı)'), 'Pieter Bruegel');
  assert.equal(okunacakAd('Limbourg kardeşler'), 'Limbourg');
  assert.equal(okunacakAd('Charles Barry ve Augustus Pugin'), 'Charles Barry, Augustus Pugin');
  assert.equal(okunacakAd('Giovanni Battista Gaulli (Baciccio)'), 'Giovanni Battista Gaulli');
  assert.equal(okunacakAd('Vermeer'), 'Vermeer');
});

test('okunuş: sanatçının dilindeki ses seçilir, varsayılan önce; yoksa null', () => {
  const sesler = [
    { lang: 'en-US', default: true },
    { lang: 'nl-BE' },
    { lang: 'nl-NL', default: true },
    { lang: 'it_IT', localService: true },
  ];
  assert.equal(sesSec(sesler, 'nl').lang, 'nl-NL');
  assert.equal(sesSec(sesler, 'it').lang, 'it_IT');
  assert.equal(sesSec(sesler, 'fr'), null);
  assert.equal(sesSec(sesler, null), null);
});

// sw.js'teki parcala(): Safari sesi Range ile ister, 206 bekler (İş 49c)
const swKaynak = readFileSync(new URL('../../sw.js', import.meta.url), 'utf8');
const parcalaKaynak = swKaynak.slice(swKaynak.indexOf('async function parcala'), swKaynak.indexOf('async function resim'));
const parcala = new Function(`${parcalaKaynak}; return parcala;`)();
const ses = () => new Response(new Uint8Array([...Array(10).keys()]), { headers: { 'Content-Type': 'audio/mpeg' } });

test('parcala: Range yoksa yanıt aynen', async () => {
  const y = ses();
  assert.equal(await parcala(y, null), y);
});

test('parcala: bytes=0-1 → 206, iki bayt, Content-Range', async () => {
  const y = await parcala(ses(), 'bytes=0-1');
  assert.equal(y.status, 206);
  assert.equal(y.headers.get('content-range'), 'bytes 0-1/10');
  assert.equal(y.headers.get('content-type'), 'audio/mpeg');
  assert.deepEqual([...new Uint8Array(await y.arrayBuffer())], [0, 1]);
});

test('parcala: açık uçlu ve sondan aralık; taşan aralık 416', async () => {
  const a = await parcala(ses(), 'bytes=7-');
  assert.equal(a.headers.get('content-range'), 'bytes 7-9/10');
  const b = await parcala(ses(), 'bytes=-3');
  assert.deepEqual([...new Uint8Array(await b.arrayBuffer())], [7, 8, 9]);
  assert.equal((await parcala(ses(), 'bytes=20-')).status, 416);
});
