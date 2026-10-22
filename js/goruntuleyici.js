// Tam ekran eser görüntüleyici: iki parmakla yakınlaştırma, kaydırma, eserler arası geçiş.
import { kacis, notTemizle } from './yardimci.js';
import { ikon } from './tasarim.js';
import { gorselUrl, gorselYedek,gorselSayfasi, gorselKaynakYazisi, secilenGorsel, kotuIsaretle } from './gorsel.js';
import { eserKonusu } from './ikonografi.js';

const EN_BUYUK = 6;

// Görsel kaynağı ve (varsa) eserin müzesi
export function kaynakYazisi(eser, gorsel) {
  const g = gorsel || (eser.gorseller || [])[0];
  return [eser.muze, g ? gorselKaynakYazisi(g) : ''].filter(Boolean).join(' · ');
}

// kotuler: { eserAnahtarı: [görsel anahtarları] } — "Görsel kötü" ile güncellenir, degisti() çağrılır
// notu: (eser) → kısa açıklama (data/eser_notlari.json); gizliyken (cevaptan önce) gösterilmez
export function goruntuleyiciAc({ eserler, baslangic = 0, gizli = false, kapaninca = null, kotuler = {}, degisti = null, notu = null }) {
  let sira = baslangic;
  let olcek = 1;
  let tx = 0;
  let ty = 0;
  const imlecler = new Map();
  let jest = null;
  let sonDokunma = 0;
  const onceOdak = document.activeElement;

  const kok = document.createElement('div');
  kok.className = 'gor';
  kok.setAttribute('role', 'dialog');
  kok.setAttribute('aria-modal', 'true');
  kok.setAttribute('aria-label', 'Eser görüntüleyici');
  kok.innerHTML = `
    <div class="gor-sahne"><img class="gor-resim" alt="" draggable="false"><p class="gor-yukleniyor">Yükleniyor…</p></div>
    <button class="gor-kapat" type="button" aria-label="Kapat">${ikon('kapat', 22)}</button>
    ${eserler.length > 1 ? `<button class="gor-ok gor-onceki" type="button" aria-label="Önceki eser">${ikon('geri', 24)}</button><button class="gor-ok gor-sonraki" type="button" aria-label="Sonraki eser">${ikon('ileri', 24)}</button>` : ''}
    <div class="gor-alt"><div class="gor-yazi" ${gizli ? 'hidden' : ''}></div>
      <button class="gor-kotu" type="button">Görsel kötü</button><p class="gor-mesaj" role="status" aria-live="polite"></p></div>`;
  document.body.appendChild(kok);
  document.documentElement.classList.add('gor-acik');

  const sahne = kok.querySelector('.gor-sahne');
  const resim = kok.querySelector('.gor-resim');
  const yukleniyor = kok.querySelector('.gor-yukleniyor');
  const alt = kok.querySelector('.gor-yazi');
  const mesaj = kok.querySelector('.gor-mesaj');

  function uygula(gecis = false) {
    resim.style.transition = gecis ? 'transform .2s ease-out' : 'none';
    resim.style.transform = `translate(${tx}px, ${ty}px) scale(${olcek})`;
  }

  function sinirla() {
    const r = sahne.getBoundingClientRect();
    const g = resim.offsetWidth * olcek;
    const y = resim.offsetHeight * olcek;
    const mx = Math.max(0, (g - r.width) / 2);
    const my = Math.max(0, (y - r.height) / 2);
    tx = Math.min(mx, Math.max(-mx, tx));
    ty = Math.min(my, Math.max(-my, ty));
  }

  function sifirla() {
    olcek = 1;
    tx = 0;
    ty = 0;
    uygula();
  }

  function goster(gorsel = null) {
    const e = eserler[sira];
    const g = gorsel || secilenGorsel(e, kotuler) || e.gorseller[0];
    sifirla();
    yukleniyor.hidden = false;
    yukleniyor.textContent = 'Yükleniyor…';
    if (!gorsel) mesaj.textContent = '';
    // Tek <img> yeniden kullanılır: önceki eserin "kirik"/"yuklendi" işareti sonrakine geçmesin
    resim.classList.remove('kirik', 'yuklendi');
    const yedek = gorselYedek(g);
    let yedekDenendi = false;
    resim.onload = () => (yukleniyor.hidden = true);
    resim.onerror = () => {
      // Birincil adres (ör. özgünden büyük küçük resim) açılmazsa bir kez yedek adres
      if (!yedekDenendi && yedek && resim.src !== yedek) {
        yedekDenendi = true;
        resim.src = yedek;
        return;
      }
      yukleniyor.textContent = 'Görsel yüklenemedi.';
    };
    resim.src = gorselUrl(g, 800);
    resim.alt = gizli ? 'Soru görseli' : e.ad || e.baslik;
    if (!gizli) {
      const sayfa = gorselSayfasi(g);
      const not = notu ? notu(e) : '';
      const konu = eserKonusu(e);
      alt.innerHTML = `<p class="gor-baslik">${kacis(notTemizle(e.ad || e.baslik))}${e.tarih ? ` <span class="ikincil">· ${kacis(e.tarih)}</span>` : ''}</p>${e.ad && e.ad !== e.baslik ? `<p class="gor-ozgun" data-test="ozgun-ad">${kacis(notTemizle(e.baslik))}</p>` : ''}
        ${not ? `<p class="gor-not" data-test="eser-notu">${kacis(not)}</p>` : ''}
        ${konu ? `<a class="gor-konu" href="#/konu/${encodeURIComponent(konu.id)}" data-gor-konu data-test="gor-konu">Konu: ${kacis(konu.ad)} →</a>` : ''}
        <p class="gor-kaynak">${kacis(kaynakYazisi(e, g))}${sayfa ? ` · <a href="${kacis(sayfa)}" target="_blank" rel="noopener">${g.k === 'wikiart' ? 'eser sayfası' : 'kaynak sayfası'}</a>` : ''}${eserler.length > 1 ? ` · ${sira + 1} / ${eserler.length}` : ''}</p>`;
    }
    // komşuları önceden yükle
    for (const k of [sira - 1, sira + 1]) if (eserler[k]) new Image().src = gorselUrl(secilenGorsel(eserler[k], kotuler) || eserler[k].gorseller[0], 800);
  }

  // "Görsel kötü": sıradaki en iyi görsele geç; tercih kotuler'e yazılır (cihazda saklanır)
  function kotuGorsel() {
    const e = eserler[sira];
    const simdiki = secilenGorsel(e, kotuler);
    if (!simdiki) return;
    const sonraki = kotuIsaretle(e, simdiki, kotuler);
    if (degisti) degisti(e);
    if (sonraki) {
      goster(sonraki);
      mesaj.textContent = 'Başka bir görsele geçildi.';
    } else {
      mesaj.textContent = 'Bu eserin başka görseli yok; pekiştirmede gösterilmeyecek.';
    }
  }

  function git(fark) {
    const yeni = sira + fark;
    if (yeni < 0 || yeni >= eserler.length) {
      tx = 0;
      uygula(true);
      return;
    }
    sira = yeni;
    goster();
  }

  function kapat() {
    document.removeEventListener('keydown', tus);
    document.documentElement.classList.remove('gor-acik');
    kok.remove();
    if (onceOdak && onceOdak.focus) onceOdak.focus();
    if (kapaninca) kapaninca(sira);
  }

  function tus(e) {
    if (e.key === 'Escape') kapat();
    else if (e.key === 'ArrowLeft') git(-1);
    else if (e.key === 'ArrowRight') git(1);
  }
  document.addEventListener('keydown', tus);

  kok.querySelector('.gor-kapat').addEventListener('click', kapat);
  // "Konu:" bağlantısı: görüntüleyici kapanır, sayfa konu ekranına geçer
  alt.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-gor-konu]')) kapat();
  });
  kok.querySelector('.gor-kotu').addEventListener('click', kotuGorsel);
  const onceki = kok.querySelector('.gor-onceki');
  const sonraki = kok.querySelector('.gor-sonraki');
  if (onceki) onceki.addEventListener('click', () => git(-1));
  if (sonraki) sonraki.addEventListener('click', () => git(1));
  // iOS Safari'nin sayfa yakınlaştırmasını engelle
  kok.addEventListener('gesturestart', (e) => e.preventDefault());

  const merkez = () => {
    const r = sahne.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  sahne.addEventListener('pointerdown', (e) => {
    sahne.setPointerCapture(e.pointerId);
    imlecler.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const n = imlecler.size;
    if (n === 2) {
      const [a, b] = [...imlecler.values()];
      const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const c = merkez();
      jest = { tur: 'kistir', mesafe: Math.hypot(a.x - b.x, a.y - b.y) || 1, olcek, px: (m.x - c.x - tx) / olcek, py: (m.y - c.y - ty) / olcek };
    } else if (n === 1) {
      jest = { tur: 'tek', x: e.clientX, y: e.clientY, tx, ty, zaman: Date.now() };
    }
  });

  sahne.addEventListener('pointermove', (e) => {
    if (!imlecler.has(e.pointerId) || !jest) return;
    imlecler.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (jest.tur === 'kistir' && imlecler.size >= 2) {
      const [a, b] = [...imlecler.values()];
      const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const c = merkez();
      olcek = Math.min(EN_BUYUK, Math.max(1, (jest.olcek * Math.hypot(a.x - b.x, a.y - b.y)) / jest.mesafe));
      tx = m.x - c.x - olcek * jest.px;
      ty = m.y - c.y - olcek * jest.py;
      uygula();
    } else if (jest.tur === 'tek') {
      const dx = e.clientX - jest.x;
      const dy = e.clientY - jest.y;
      if (olcek > 1) {
        tx = jest.tx + dx;
        ty = jest.ty + dy;
        sinirla();
      } else {
        tx = dx;
        ty = Math.max(0, dy) * 0.6;
      }
      uygula();
    }
  });

  function birak(e) {
    if (!imlecler.has(e.pointerId)) return;
    imlecler.delete(e.pointerId);
    if (!jest) return;
    if (jest.tur === 'kistir') {
      if (imlecler.size === 1) {
        const [p] = [...imlecler.values()];
        jest = { tur: 'tek', x: p.x, y: p.y, tx, ty, zaman: Date.now(), kistirmadan: true };
      } else jest = null;
      if (olcek <= 1.02) sifirla();
      return;
    }
    const dx = e.clientX - jest.x;
    const dy = e.clientY - jest.y;
    const sure = Date.now() - jest.zaman;
    const kistirmadan = jest.kistirmadan;
    jest = null;
    if (olcek > 1) {
      sinirla();
      uygula(true);
    } else if (!kistirmadan && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      git(dx < 0 ? 1 : -1);
    } else if (!kistirmadan && dy > 120 && Math.abs(dy) > Math.abs(dx)) {
      kapat();
      return;
    } else {
      tx = 0;
      ty = 0;
      uygula(true);
    }
    // çift dokunma: 2.5x ↔ 1x
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && sure < 300) {
      const simdi = Date.now();
      if (simdi - sonDokunma < 320) {
        if (olcek > 1) sifirla();
        else {
          const c = merkez();
          olcek = 2.5;
          tx = -(e.clientX - c.x) * 1.5;
          ty = -(e.clientY - c.y) * 1.5;
          sinirla();
        }
        uygula(true);
        sonDokunma = 0;
      } else sonDokunma = simdi;
    }
  }
  sahne.addEventListener('pointerup', birak);
  sahne.addEventListener('pointercancel', birak);

  goster();
  kok.querySelector('.gor-kapat').focus();
  return { kapat };
}
