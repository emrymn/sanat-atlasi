// Eser dersleri: yayın kapısı (data/ders_yayin.json) ve ders adresi. Dersin kendisi başyapıt sayfasında, "Daha derine in"
// ile açılır (js/ekranlar/basyapit.js; İş 188). Bkz. KARARLAR.md "İş 175", "İş 185", "İş 188".
import { yayinAl, dersDurumu } from '../eserDersi.js';
import { d, jsonGetir } from './ortak.js';
import { basyapitAdresi } from './gozat.js';

let yayinSozu = null;
export function dersYayini() {
  if (!yayinSozu)
    yayinSozu = jsonGetir('data/ders_yayin.json').then(yayinAl, () => {
      yayinSozu = null;
      return yayinAl(null);
    });
  return yayinSozu;
}
export const dersAdresi = (anahtar) => `${basyapitAdresi(anahtar)}/ders`;
export const dersinDurumu = (yayin, anahtar) => dersDurumu(yayin, anahtar, Boolean(d.ilerleme.gelistirici));
