// Adres (#/…) → ekran eşlemesi.
import { gecisBildir } from '../gecis.js';
import { d, sekmeleriCiz, hataGoster, cizimBaslat, geriDonusBildir, sekmedenMi } from './ortak.js';
import { anaSayfa, gununSayfasi } from './bugun.js';
import { gozAt, akimSayfasi, tumEserler, sanatciSayfasi, karsilastirSayfasi, basyapitListesi, konuListesi, konuGrubu, konuSayfasi, basyapitSayfasi } from './gozat.js';
import { pekistirMenusu, pekistir, devamEt } from './pekistir.js';
import { ilerlemeSayfasi } from './ilerleme.js';
import { ayarlarSayfasi } from './ayarlar.js';
import { aramaSayfasi } from './arama.js';
import { zamanSayfasi } from './zaman.js';
import { koleksiyonSayfasi } from './koleksiyon.js';
import { haritaSayfasi } from './harita.js';
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
  [/^#\/konular\/([^/]+)$/, konuGrubu, 'gozat'],
  [/^#\/konu\/(.+)$/, konuSayfasi, 'gozat'],
  [/^#\/basyapit\/(.+)$/, basyapitSayfasi, 'gozat'],
  [/^#\/pekistir$/, pekistirMenusu, 'pekistir'],
  [/^#\/pekistir\/donem$/, pekistirMenusu, 'pekistir'],
  [/^#\/pekistir\/donem\/(.+)$/, (ad) => pekistir('donem', ad), null],
  [/^#\/pekistir\/karisik$/, () => pekistir('karisik', null), null],
  [/^#\/pekistir\/konu\/(\d+)$/, (no) => pekistir('konu', no), null],
  [/^#\/pekistir\/hatalar$/, () => pekistir('hatalar', null), null],
  [/^#\/pekistir\/devam$/, () => devamEt(), null],
  [/^#\/pekistir\/bolum\/(\d+-\d+)\/(kolay|orta|zor|tanitim|tanitim-orta)$/, (id, sv) => pekistir('bolum', `${id}/${sv}`), null],
  [/^#\/ilerleme$/, () => ilerlemeSayfasi(), 'ilerleme'],
  [/^#\/ayarlar$/, ayarlarSayfasi, 'ilerleme'],
  [/^#\/koleksiyon$/, koleksiyonSayfasi, 'ilerleme'],
  [/^#\/harita$/, () => haritaSayfasi(), 'harita'],
  [/^#\/gunun$/, () => gununSayfasi(null), 'bugun'],
  [/^#\/gunun\/(.+)$/, (id) => gununSayfasi(id), 'bugun'],
];

export function yonlendir() {
  const h = location.hash || '#/';
  cizimBaslat();
  // tarayıcının kendi kaydırma geri yüklemesi her geçmiş kaydında kapalı (yeni kayıtlar "auto" başlayabiliyor; İş 57)
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  // geri düğmesi için basit yığın
  const geriMi = d.yigin.length > 1 && d.yigin[d.yigin.length - 2] === h;
  const ilk = !d.yigin.length;
  if (geriMi) d.yigin.pop();
  else if (d.yigin[d.yigin.length - 1] !== h) d.yigin.push(h);
  const sekmeden = sekmedenMi(h);
  // İş 70: derine inince sayfa sağdan kayarak gelir, geri düğmesiyle dönünce tersi; sekme değişiminde geçiş yok
  gecisBildir({ geriMi, sekmeden, ilk });
  // geri dönüşte ve sekme çubuğundan dönüşte ekran eski kaydırma yerine döner (İş 51); ileri gidişte en baştan
  geriDonusBildir(sekmeden || geriMi ? h : null);
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
