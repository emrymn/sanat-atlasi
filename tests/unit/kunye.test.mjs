import { test } from 'node:test';
import assert from 'node:assert/strict';
import { okunacakAd, sesSec } from '../../js/kunye.js';

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
