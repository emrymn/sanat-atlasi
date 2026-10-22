// Koleksiyonum (K4): görüntüleyicide işaretlenen eserlerin duvarı. İlerleme'den bağlanır (#/koleksiyon).
import { sanatciEserleri } from '../eserler.js';
import { goruntuleyiciAc } from '../goruntuleyici.js';
import { d, ekran, gununRengi, ciz, ust, notuIcin, gorselTercihi } from './ortak.js';
import { eserSeridi } from './bugun.js';

// Koleksiyondaki eserleri (en yeni işaretlenen başta) sanatçılarının eser listesinden bulur; bulunamayanlar atlanır
async function eserleriBul() {
  const sidler = [...new Set(d.ilerleme.koleksiyon.map((x) => x.s))];
  const liste = {};
  await Promise.all(
    sidler.map(async (sid) => {
      const s = d.harita.get(sid);
      liste[sid] = s ? await sanatciEserleri(s).catch(() => []) : [];
    }),
  );
  return d.ilerleme.koleksiyon.map((x) => (liste[x.s] || []).find((e) => e.anahtar === x.a)).filter(Boolean);
}

export async function koleksiyonSayfasi() {
  gununRengi();
  const eserler = await eserleriBul();
  if (location.hash !== '#/koleksiyon') return;
  ciz(`${ust('Koleksiyonum', '#/ilerleme', { ustEtiket: `${eserler.length} eser` })}
    ${
      eserler.length
        ? `<div class="izgara" data-izgara data-test="koleksiyon-izgara">${eserSeridi(eserler, 'eser', 'data-eser')}</div>`
        : '<p class="ikincil okuma" data-test="koleksiyon-bos">Henüz eser işaretlemedin. Bir eseri büyütüp sağ üstteki işarete dokun.</p>'
    }`);
  const kutu = ekran.querySelector('[data-izgara]');
  if (!kutu) return;
  kutu.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-eser]');
    if (!b) return;
    goruntuleyiciAc({
      eserler,
      baslangic: Number(b.dataset.eser),
      notu: (e) => notuIcin(e.sid)(e),
      ...gorselTercihi(),
      // işaret kaldırıldıysa duvar yenilenir
      kapaninca: () => {
        if (location.hash === '#/koleksiyon') koleksiyonSayfasi();
      },
    });
  });
}
