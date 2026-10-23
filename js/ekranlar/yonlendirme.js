// Adres (#/…) → ekran eşlemesi.
import { d, sekmeleriCiz, hataGoster, cizimBaslat } from './ortak.js';
import { anaSayfa, gununSayfasi } from './bugun.js';
import { gozAt, akimSayfasi, tumEserler, sanatciSayfasi, karsilastirSayfasi, basyapitListesi, konuListesi, konuSayfasi, basyapitSayfasi } from './gozat.js';
import { pekistirMenusu, pekistir, devamEt } from './pekistir.js';
import { ilerlemeSayfasi } from './ilerleme.js';
import { ayarlarSayfasi } from './ayarlar.js';
import { aramaSayfasi } from './arama.js';
import { zamanSayfasi } from './zaman.js';
import { koleksiyonSayfasi } from './koleksiyon.js';
import { akimKarsilastirSayfasi } from './akim.js';

// ---------- yönlendirme ----------
const rotalar = [
  [/^#?\/?$/, anaSayfa, 'bugun'],
  [/^#\/gozat$/, gozAt, 'gozat'],
  [/^#\/ara$/, aramaSayfasi, 'gozat'],
  [/^#\/zaman$/, zamanSayfasi, 'gozat'],
  [/^#\/akim-karsilastir\/([^/]+)\/([^/]+)$/, akimKarsilastirSayfasi, null],
  [/^#\/akim\/(.+)$/, akimSayfasi, 'gozat'],
  [/^#\/sanatci\/(.+)\/eserler$/, tumEserler, 'gozat'],
  [/^#\/sanatci\/(.+)$/, sanatciSayfasi, 'gozat'],
  [/^#\/karsilastir\/([^/]+)\/([^/]+)$/, karsilastirSayfasi, null],
  [/^#\/basyapitlar$/, basyapitListesi, 'gozat'],
  [/^#\/konular$/, konuListesi, 'gozat'],
  [/^#\/konu\/(.+)$/, konuSayfasi, 'gozat'],
  [/^#\/basyapit\/(.+)$/, basyapitSayfasi, 'gozat'],
  [/^#\/pekistir$/, pekistirMenusu, 'pekistir'],
  [/^#\/pekistir\/donem$/, pekistirMenusu, 'pekistir'],
  [/^#\/pekistir\/donem\/(.+)$/, (ad) => pekistir('donem', ad), null],
  [/^#\/pekistir\/karisik$/, () => pekistir('karisik', null), null],
  [/^#\/pekistir\/konu\/(\d+)$/, (no) => pekistir('konu', no), null],
  [/^#\/pekistir\/hatalar$/, () => pekistir('hatalar', null), null],
  [/^#\/pekistir\/devam$/, () => devamEt(), null],
  [/^#\/ilerleme$/, () => ilerlemeSayfasi(), 'ilerleme'],
  [/^#\/ayarlar$/, ayarlarSayfasi, 'ilerleme'],
  [/^#\/koleksiyon$/, koleksiyonSayfasi, 'ilerleme'],
  [/^#\/gunun$/, () => gununSayfasi(null), 'bugun'],
  [/^#\/gunun\/(.+)$/, (id) => gununSayfasi(id), 'bugun'],
];

export function yonlendir() {
  const h = location.hash || '#/';
  cizimBaslat();
  // geri düğmesi için basit yığın
  if (d.yigin.length > 1 && d.yigin[d.yigin.length - 2] === h) d.yigin.pop();
  else if (d.yigin[d.yigin.length - 1] !== h) d.yigin.push(h);
  for (const [desen, fn, sekme] of rotalar) {
    const m = desen.exec(h);
    if (m) {
      sekmeleriCiz(sekme);
      const args = m.slice(1).map((x) => decodeURIComponent(x));
      Promise.resolve(fn(...args)).catch(hataGoster);
      return;
    }
  }
  sekmeleriCiz('bugun');
  anaSayfa();
}
