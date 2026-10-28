// Koleksiyonum (K4): görüntüleyicide işaretlenen eserlerin duvarı. İlerleme'den bağlanır (#/koleksiyon).
// Eserler çivilere iple asılı; telefonu sağa sola çevirince bölüm sonucundaki sergi duvarı gibi sallanır (İş 46).
import { kacis } from '../yardimci.js';
import { sanatciEserleri, eserBaslik } from '../eserler.js';
import { gorselUrl, gorselYedek, secilenGorsel } from '../gorsel.js';
import { goruntuleyiciAc } from '../goruntuleyici.js';
import { ikon } from '../tasarim.js';
import { sallanmaBaslat } from '../sallanma.js';
import { cerceveTipi } from '../cerceve.js';
import { d, ekran, gununRengi, ciz, ust, notuIcin, gorselTercihi, kotuler } from './ortak.js';

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

// Her eser kendi çivisinde; ip boyu ve hafif eğrilik sıradan gelir (her açılışta aynı, duvar el yapımı görünür).
// Sallanan yalnız .asi (ip + çerçeve); etiket duvarda sabit kalır.
function duvarHtml(eserler) {
  return eserler
    .map((e, i) => {
      const g = secilenGorsel(e, kotuler()) || e.gorseller[0];
      if (!g) return '';
      const egim = (((i * 37) % 5) - 2) * 0.4;
      const ip = 12 + ((i * 13) % 4) * 7;
      return `<li class="koleksiyon-yer">
        <div class="asi" style="--i:${Math.min(i, 8)};--egim:${egim.toFixed(1)}deg;--ip:${ip}px">
          <span class="asi-ip" aria-hidden="true"></span>
          <button class="eser koleksiyon-tablo" type="button" data-eser="${i}" aria-label="${kacis(eserBaslik(e))} — büyüt"><span class="asi-cerceve" data-cerceve="${cerceveTipi(d.harita.get(e.sid)?.akim)}"><img ${i > 3 ? 'loading="lazy" ' : ''}decoding="async" alt="" src="${kacis(gorselUrl(g, 400))}" data-yedek="${kacis(gorselYedek(g))}"></span></button>
        </div>
        <p class="eser-yazi" aria-hidden="true">${kacis(eserBaslik(e))}${e.tarih ? ` <small>· ${kacis(e.tarih)}</small>` : ''}</p>
      </li>`;
    })
    .join('');
}

export async function koleksiyonSayfasi() {
  gununRengi();
  const eserler = await eserleriBul();
  if (location.hash !== '#/koleksiyon') return;
  ciz(`${ust('Koleksiyonum', '#/ilerleme', { ustEtiket: `${eserler.length} eser` })}
    ${
      eserler.length
        ? `<section class="sergi-duvar koleksiyon-duvar" aria-label="Koleksiyonundaki eserler" data-izgara data-test="koleksiyon-izgara">
            <button class="egim-dugme" type="button" data-egim-dugme data-test="egim-dugme">${ikon('hareket', 16, 1.6)}Hareketi aç</button>
            <ul class="koleksiyon-asilar">${duvarHtml(eserler)}</ul>
            <span class="sergi-isik" aria-hidden="true"></span>
          </section>`
        : '<p class="ikincil okuma" data-test="koleksiyon-bos">Henüz eser işaretlemedin. Bir eseri büyütüp sağ üstteki işarete dokun.</p>'
    }`);
  const kutu = ekran.querySelector('[data-izgara]');
  if (!kutu) return;
  // telefonu eğince ipinden sallanır (Ayarlar'daki hareket seçimine ve hareket azaltmaya uyar); çerçeveler sergi
  // duvarındakilerden büyük olduğu için daha az (5°): yoksa alt köşeleri duvarın kenarından taşıyordu
  sallanmaBaslat(kutu, d.ilerleme.ayarlar.egim !== false, 5);
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
        if (location.hash !== '#/koleksiyon') return;
        // duvar yeniden çizilir; kaydırma yeri korunur (İş 57: en başa zıplıyordu)
        const y = window.scrollY;
        Promise.resolve(koleksiyonSayfasi()).then(() => window.scrollTo(0, y));
      },
    });
  });
}
