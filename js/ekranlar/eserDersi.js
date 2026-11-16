// Eser dersi ekranı (#/basyapit/<anahtar>/ders): kısa + ayrıntılı okuma ve tekrar kartları. Bkz. KARARLAR.md "İş 185".
// Dersler basyapit-dersleri/ klasöründen isteğe bağlı yüklenir; kapı data/ders_yayin.json.
import { kacis } from '../yardimci.js';
import { basyapitBul, eserEslestir } from '../basyapit.js';
import { yayinAl, dersDurumu, dersGorunurMu, dersKlasoru, dersYolu, mdHtml, temizle, kartlariAl } from '../eserDersi.js';
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
  const [kisa, uzun, sorular] = await Promise.all([
    metinGetir(dersYolu(klasor, 'DERS_BASLANGIC.md')).then(temizle),
    metinGetir(dersYolu(klasor, 'DERS_ORTA.md')).then(temizle).catch(() => ''),
    jsonGetir(dersYolu(klasor, 'SORULAR.json')).catch(() => ({})),
  ]);
  if (!guncelMi(no)) return;
  const kartlar = kartlariAl(sorular);
  const kunye = [kacis(s.ad), b.tarih && kacis(b.tarih), b.muze && kacis(b.muze)].filter(Boolean).join(' · ');
  ciz(`<div class="drsx" data-test="eser-dersi">
    <header class="drsx-ust">${geriDugmesi(basyapitAdresi(anahtar))}</header>
    <div class="drsx-sekmeler" role="tablist">
      <button type="button" role="tab" class="drsx-sekme" data-sekme="okuma" aria-selected="true">Okuma</button>
      ${kartlar.length ? `<button type="button" role="tab" class="drsx-sekme" data-sekme="kart" aria-selected="false">Kartlar · ${kartlar.length}</button>` : ''}
    </div>
    <section class="drsx-okuma" data-panel="okuma">
      <button type="button" class="drsx-gorsel" data-gorsel aria-label="${kacis(b.baslik)} — görsel"><span class="ikincil kucuk">Görsel yükleniyor…</span></button>
      <h1 class="drsx-baslik" tabindex="-1">${kacis(b.baslik)}</h1>
      <p class="drsx-kunye">${kunye}</p>
      <div class="drsx-bas"><span>KISA ANLATIM</span><span>yaklaşık ${dakika(kisa)} dk</span></div>
      <div class="drsx-metin" data-test="ders-metni">${mdHtml(kisa)}</div>
      ${uzun ? `<button type="button" class="drsx-fazla" data-fazla aria-expanded="false"><span><b>Daha fazlası</b><span>Ayrıntılı anlatım · yaklaşık ${dakika(uzun)} dk</span></span>${ok('asagi')}</button>
      <div class="drsx-uzun" data-uzun hidden><div class="drsx-bas"><span>AYRINTILI ANLATIM</span><span>yaklaşık ${dakika(uzun)} dk</span></div><div class="drsx-metin">${mdHtml(uzun)}</div>
      <button type="button" class="drsx-az" data-az>Daha az göster ${ok('yukari')}</button></div>` : ''}
      ${kartlar.length ? `<button type="button" class="drsx-ana" data-kartlara>Tekrar kartlarına geç <span>· ${kartlar.length} kart</span></button>` : ''}
    </section>
    <section class="drsx-kartlar" data-panel="kart" hidden></section>
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
  // kartlar
  const st = { i: 0, arka: false, bitti: false };
  const panel = kok.querySelector('[data-panel="kart"]');
  const kartCiz = () => {
    const n = kartlar.length;
    const noktalar = kartlar.map((_, j) => `<span class="drsx-nokta${!st.bitti && j === st.i ? ' simdi' : j < st.i || st.bitti ? ' gorulen' : ''}"></span>`).join('');
    const ust = `<div class="drsx-kart-ust"><b>${st.bitti ? 'Tur bitti' : `Kart ${st.i + 1} / ${n}`}</b><span aria-hidden="true">${noktalar}</span></div>`;
    const k = kartlar[st.i];
    let govde;
    let alt;
    if (st.bitti) {
      govde = `<div class="drsx-kart"><span class="drsx-kucukbas">TUR BİTTİ</span><h2 class="drsx-kart-soru">${n} kartın hepsini gördün.</h2></div>`;
      alt = `<button type="button" class="drsx-ana" data-bastan>Baştan başla</button><div class="drsx-gezin orta"><button type="button" class="drsx-bag" data-okumaya>Okumaya dön</button></div>`;
    } else if (!st.arka) {
      govde = `<button type="button" class="drsx-kart" data-cevir aria-label="Cevabı göster"><span class="drsx-kucukbas">SORU</span><span class="drsx-kart-orta"><span class="drsx-kart-soru">${kacis(k.soru)}</span></span><span class="drsx-ipucu">Cevap için karta dokun</span></button>`;
      alt = `<button type="button" class="drsx-ana" data-cevir>Cevabı göster</button>`;
    } else {
      govde = `<button type="button" class="drsx-kart" data-cevir aria-label="Soruya dön"><span class="drsx-kucukbas">CEVAP</span><span class="drsx-kart-kucuksoru">${kacis(k.soru)}</span><span class="drsx-cizgi"></span><span class="drsx-kart-cevap" data-test="kart-cevap">${kacis(k.cevap)}</span></button>`;
      alt = `<button type="button" class="drsx-ana" data-sonraki>${st.i < n - 1 ? 'Sonraki kart' : 'Turu bitir'}</button>`;
    }
    if (!st.bitti) alt += `<div class="drsx-gezin"><button type="button" class="drsx-bag" data-onceki ${st.i ? '' : 'aria-disabled="true"'}>${ok('sol')} Önceki</button>${st.arka ? '' : `<button type="button" class="drsx-bag" data-sonraki>Sonraki kart ${ok('sag')}</button>`}</div>`;
    panel.innerHTML = `${ust}<div class="drsx-kart-alan" data-test="ders-kart">${govde}</div><div class="drsx-alt">${alt}</div>`;
  };
  const ilerle = () => {
    if (st.i >= kartlar.length - 1) st.bitti = true;
    else st.i++;
    st.arka = false;
    kartCiz();
  };
  const sekme = (ad) => {
    for (const el of kok.querySelectorAll('[data-sekme]')) el.setAttribute('aria-selected', String(el.dataset.sekme === ad));
    for (const el of kok.querySelectorAll('[data-panel]')) el.hidden = el.dataset.panel !== ad;
    if (ad === 'kart') kartCiz();
    window.scrollTo(0, 0);
  };
  kok.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.sekme) sekme(t.dataset.sekme);
    else if ('kartlara' in t.dataset) sekme('kart');
    else if ('okumaya' in t.dataset) sekme('okuma');
    else if ('fazla' in t.dataset) { t.hidden = true; kok.querySelector('[data-uzun]').hidden = false; }
    else if ('az' in t.dataset) { kok.querySelector('[data-uzun]').hidden = true; kok.querySelector('[data-fazla]').hidden = false; }
    else if ('cevir' in t.dataset) { st.arka = !st.arka; kartCiz(); }
    else if ('sonraki' in t.dataset) ilerle();
    else if ('onceki' in t.dataset && st.i > 0) { st.i--; st.arka = false; kartCiz(); }
    else if ('bastan' in t.dataset) { Object.assign(st, { i: 0, arka: false, bitti: false }); kartCiz(); }
  });
}
