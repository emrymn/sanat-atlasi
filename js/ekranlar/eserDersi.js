// Eser dersi ekranı (#/basyapit/<anahtar>/ders): kısa + ayrıntılı okuma. Bkz. KARARLAR.md "İş 185", "İş 186".
// Dersler basyapit-dersleri/ klasöründen isteğe bağlı yüklenir; kapı data/ders_yayin.json.
import { kacis } from '../yardimci.js';
import { basyapitBul, eserEslestir } from '../basyapit.js';
import { yayinAl, dersDurumu, dersGorunurMu, dersKlasoru, dersYolu, mdHtml, temizle } from '../eserDersi.js';
import { gorselUrl, gorselYedek, secilenGorsel } from '../gorsel.js';
import { d, ekran, jsonGetir, ciz, cizimNo, guncelMi, hataGoster, geriDugmesi, akimRenk, ekranRengi, kotuler } from './ortak.js';
import { basyapitVeri, basyapitAdresi } from './gozat.js';
import { sanatciEserleri } from '../eserler.js';

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

async function metinGetir(yol) {
  const y = await fetch(yol);
  if (!y.ok) throw new Error(`${yol}: ${y.status}`);
  return y.text();
}

const dakika = (md) => Math.max(1, Math.round(String(md).split(/\s+/).length / 180));

const ok = (yon) => `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" class="drsx-ok"><path d="${{ sol: 'M15 5l-7 7 7 7', sag: 'M9 5l7 7-7 7', asagi: 'M6 9l6 6 6-6', yukari: 'M6 15l6-6 6 6' }[yon]}"></path></svg>`;

export async function eserDersiSayfasi(kodlu) {
  const anahtar = decodeURIComponent(kodlu);
  const no = cizimNo();
  const [liste, yayin] = await Promise.all([basyapitVeri(), dersYayini()]);
  if (!guncelMi(no)) return;
  const b = basyapitBul(liste, anahtar);
  const durum = dersinDurumu(yayin, anahtar);
  if (!b || !dersGorunurMu(durum)) return hataGoster(new Error('Bu eserin dersi henüz yayında değil.'));
  const klasor = dersKlasoru(yayin, anahtar);
  const s = d.harita.get(b.sanatci);
  ekranRengi(Promise.resolve(null), akimRenk(s.akim));
  const [kisa, uzun] = await Promise.all([
    metinGetir(dersYolu(klasor, 'DERS_BASLANGIC.md')).then(temizle),
    metinGetir(dersYolu(klasor, 'DERS_ORTA.md')).then(temizle).catch(() => ''),
  ]);
  if (!guncelMi(no)) return;
  const kunye = [kacis(s.ad), b.tarih && kacis(b.tarih), b.muze && kacis(b.muze)].filter(Boolean).join(' · ');
  ciz(`<div class="drsx" data-test="eser-dersi">
    <header class="drsx-ust">${geriDugmesi(basyapitAdresi(anahtar))}</header>
    <section class="drsx-okuma">
      <button type="button" class="drsx-gorsel" data-gorsel aria-label="${kacis(b.baslik)} — görsel"><span class="ikincil kucuk">Görsel yükleniyor…</span></button>
      <h1 class="drsx-baslik" tabindex="-1">${kacis(b.baslik)}</h1>
      <p class="drsx-kunye">${kunye}</p>
      <div class="drsx-bas"><span>KISA ANLATIM</span><span>yaklaşık ${dakika(kisa)} dk</span></div>
      <div class="drsx-metin" data-test="ders-metni">${mdHtml(kisa)}</div>
      ${uzun ? `<button type="button" class="drsx-fazla" data-fazla aria-expanded="false"><span><b>Daha fazlası</b><span>Ayrıntılı anlatım · yaklaşık ${dakika(uzun)} dk</span></span>${ok('asagi')}</button>
      <div class="drsx-uzun" data-uzun hidden><div class="drsx-bas"><span>AYRINTILI ANLATIM</span><span>yaklaşık ${dakika(uzun)} dk</span></div><div class="drsx-metin">${mdHtml(uzun)}</div>
      <button type="button" class="drsx-az" data-az>Daha az göster ${ok('yukari')}</button></div>` : ''}
    </section>
  </div>`);
  const kok = ekran.querySelector('.drsx');
  // görsel
  sanatciEserleri(s).then((l) => {
    const e = eserEslestir(l, b);
    const g = e && secilenGorsel(e, kotuler());
    const k = kok.querySelector('[data-gorsel]');
    if (!guncelMi(no) || !k) return;
    k.innerHTML = g ? `<img decoding="async" alt="${kacis(`${s.ad}, ${b.baslik}`)}" src="${kacis(gorselUrl(g, 1000))}" data-yedek="${kacis(gorselYedek(g))}">` : '<span class="ikincil kucuk">Görsel bulunamadı</span>';
  });
  kok.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if ('fazla' in t.dataset) {
      t.hidden = true;
      kok.querySelector('[data-uzun]').hidden = false;
    } else if ('az' in t.dataset) {
      kok.querySelector('[data-uzun]').hidden = true;
      kok.querySelector('[data-fazla]').hidden = false;
    }
  });
}
