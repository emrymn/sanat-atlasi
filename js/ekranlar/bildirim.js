// "Bu görsel hatalı" menüsü, cevap yaprağı için (İ5). Görüntüleyicideki menü js/goruntuleyici.js'de; ikisi de js/bildirim.js'i kullanır.
import { NEDENLER, eseriBildir } from '../bildirim.js';
import { secilenGorsel } from '../gorsel.js';
import { ikon } from '../tasarim.js';
import { d, bugun, kaydet } from './ortak.js';

// Kaynak satırının sağında "⋯" düğmesi (yaprağı uzatmaz); açılınca dört neden altta sıralanır
export function bildirimSatiriHtml(kaynak) {
  return `<div class="bildir-satir" data-bildir>
      <div class="bildir-ust"><p class="kaynak-satir">${kaynak}</p><button class="bildir-ac" type="button" data-bildir-ac aria-expanded="false" aria-label="Bu görsel hatalı mı?">${ikon('daha', 20, 1.8)}</button></div>
      <div class="bildir-secenekler" data-test="bildir-secenekler" hidden>${NEDENLER.map((n) => `<button type="button" data-bildir-neden="${n}">${n}</button>`).join('')}</div>
      <p class="bildir-mesaj" role="status" aria-live="polite" data-test="bildir-mesaj"></p>
    </div>`;
}

// Tıklama bu menüye aitse işler ve true döner; eser: şu an gösterilen eser
export function bildirimTikla(e, eser) {
  const kok = e.target.closest('[data-bildir]');
  if (!kok || !eser) return false;
  const neden = e.target.closest('[data-bildir-neden]');
  if (neden) {
    eseriBildir(d.ilerleme, eser, secilenGorsel(eser, d.ilerleme.kotuGorseller), neden.dataset.bildirNeden, bugun());
    kaydet();
    kok.querySelector('.bildir-secenekler').hidden = true;
    kok.querySelector('.bildir-ac').setAttribute('aria-expanded', 'false');
    kok.querySelector('.bildir-mesaj').textContent =
      neden.dataset.bildirNeden === 'Kötü görsel' ? 'Bildirildi: bu görsel bir daha gösterilmeyecek.' : 'Bildirildi: bu eser artık pekiştirmede çıkmayacak.';
    return true;
  }
  const ac = e.target.closest('[data-bildir-ac]');
  if (ac) {
    const liste = kok.querySelector('.bildir-secenekler');
    liste.hidden = !liste.hidden;
    ac.setAttribute('aria-expanded', String(!liste.hidden));
    return true;
  }
  return false;
}
