// Ayarlar: günlük kart, tema, çevrimdışı görsel indirme, yedekle ve geri yükle.
import { GUNLUK_YENI_SINIRI } from '../leitner.js';
import { sanatciEserleri, pekistirmeHavuzu, TEST_HAVUZU } from '../eserler.js';
import { gorselUrl, secilenGorsel } from '../gorsel.js';
import { yedekMetni, yedekCoz, yedekYarimOturum, TEMALAR, gelistiriciAc, gelistiriciKapat } from '../depo.js';
import { idbKoy } from '../idb.js';
import { kayitGecerliMi } from '../devam.js';
import { acikListe, bugun, kotuler, d, gununRengi, ciz, ust, TEMA_AD, TAHMINI_GORSEL_KB, ekran, kaydet, temaUygula } from './ortak.js';
import { yedekTarihiYaz } from './bugun.js';
import { yarimSil } from './pekistir.js';
import { SURUM } from '../surum.js';
import { egimVar, izinGerekli, egimIzni, izinVarMi } from '../egim.js';
import { ikon } from '../tasarim.js';
import { kacis } from '../yardimci.js';
import { vadeSayisi, yarinVade } from '../gecmis.js';
import { rozetDestekli, rozetYaz, rozetIzni } from '../rozet.js';
import { bildirimMetni } from '../bildirim.js';
import { YENILIKLER, yenilikYazisi } from '../yenilikler.js';
import { bolumler } from './harita.js';

// ---------- Ayarlar ----------
async function indirilecekler() {
  const urller = [];
  for (const s of acikListe()) {
    const eserler = await sanatciEserleri(s);
    for (const e of pekistirmeHavuzu(eserler, kotuler())) urller.push(gorselUrl(secilenGorsel(e, kotuler()), 800));
  }
  return [...new Set(urller)];
}

async function alanYazisi() {
  try {
    const t = await navigator.storage.estimate();
    return `Kullanılan alan: ${(t.usage / 1048576).toFixed(0)} MB`;
  } catch (e) {
    return '';
  }
}

// İ5: bildirilen görseller; JSON olarak kopyalanır (bir Claude oturumuna verilip gorsel_kararlari.json'a işletilir)
function bildirimBolumu() {
  const b = d.ilerleme.bildirimler || [];
  const ilk = b.slice(0, 8);
  return `<div class="ayar" data-test="bildirimler"><b>Bildirdiğim görseller</b>
        <p>${b.length ? `${b.length} bildirim. Bildirilen görseller ve eserler pekiştirmede çıkmaz. Listeyi kopyalayıp bir Claude oturumuna ver; görsel kararlarına işlensin.` : 'Henüz bildirdiğin görsel yok. Eser görüntüleyicide ya da cevap yaprağında “⋯” ile bildirebilirsin.'}</p>
        ${ilk.length ? `<ul class="bildir-liste">${ilk.map((x) => `<li>${kacis(x.baslik || x.a)}<small>${kacis(x.neden)} · ${kacis(x.t)}</small></li>`).join('')}${b.length > ilk.length ? `<li><small>ve ${b.length - ilk.length} bildirim daha</small></li>` : ''}</ul>` : ''}
        ${b.length ? '<button class="dugme" type="button" data-bildirim-kopyala>JSON olarak kopyala</button> <button class="dugme" type="button" data-bildirim-temizle>Listeyi temizle</button>' : ''}
        <textarea id="bildirim-cikti" readonly hidden aria-label="Bildirim listesi"></textarea>
        <p class="mesaj" id="bildirim-mesaj" aria-live="polite"></p>
      </div>`;
}

// İ2: rozet sayısı. Uygulama açıkken bugünün, gizlenirken (kapanırken) yarının vadeli sanatçı sayısı
export function rozetiGuncelle(kapaniyor = false) {
  if (!d.ilerleme || !d.ilerleme.ayarlar.rozet) return Promise.resolve(false);
  const idler = acikListe().map((s) => s.id);
  const n = kapaniyor ? yarinVade(d.ilerleme.skorlar, idler, bugun()) : vadeSayisi(d.ilerleme.skorlar, idler, bugun());
  return rozetYaz(n);
}

export function ayarlarSayfasi() {
  const a = d.ilerleme.ayarlar;
  gununRengi();
  ciz(`${ust('Ayarlar', '#/ilerleme')}
    <div>
      <div class="ayar"><b id="kart-etiket">Günlük kart sayısı</b>
        <div class="adimlayici" role="group" aria-labelledby="kart-etiket">
          <button class="dugme" type="button" data-kart="-5" aria-label="Azalt">−</button>
          <output data-test="gunluk-kart">${a.gunlukKart}</output>
          <button class="dugme" type="button" data-kart="5" aria-label="Artır">+</button>
        </div>
        <p>Bir pekiştirme turundaki kart sayısı. Günde en fazla ${GUNLUK_YENI_SINIRI} yeni sanatçı eklenir.</p>
      </div>
      <div class="ayar"><b id="tema-etiket">Tema</b>
        <div class="parcali" role="radiogroup" aria-labelledby="tema-etiket">
          ${TEMALAR.map((t) => `<label><input type="radio" name="tema" value="${t}" ${a.tema === t ? 'checked' : ''}><span>${TEMA_AD[t]}</span></label>`).join('')}
        </div>
      </div>
      <div class="ayar"><label class="konu"><span class="metin"><b>Yeni sanatçıyla önce tanış</b><small>Bir sanatçı ilk kez sorulmadan önce en bilinen 3 eseri ve “Nasıl tanırım?” notu gösterilir.</small></span>
        <input class="anahtar" type="checkbox" role="switch" data-ayar-tanisma ${a.tanisma !== false ? 'checked' : ''} aria-label="Yeni sanatçıyla önce tanış"></label></div>
      <div class="ayar"><label class="konu"><span class="metin"><b>Simge rozeti</b><small>${rozetDestekli() ? 'Ana ekrandaki Atlas simgesinde tekrarı gelen sanatçı sayısı görünür. İzin ister; sayı uygulama kapanırken yarının sayısına ayarlanır.' : 'Bu tarayıcı simge rozetini desteklemiyor (iOS 16.4+ ana ekran uygulaması gerekir).'}</small></span>
        <input class="anahtar" type="checkbox" role="switch" data-ayar-rozet ${a.rozet ? 'checked' : ''} ${rozetDestekli() ? '' : 'disabled'} aria-label="Simge rozeti"></label>
        <p class="mesaj" id="rozet-mesaj" aria-live="polite"></p></div>
      <div class="ayar"><label class="konu"><span class="metin"><b>Telefonu eğince tablo oynasın</b><small>${egimVar() ? 'Bugün’deki günün tablosu telefonu sağa sola çevirdikçe, öne arkaya eğdikçe hafifçe döner, ışık üstünden kayar; sergi duvarında ve Koleksiyonum’da tablolar ipinden sallanır, Pekiştir’deki deste yelpaze açılır.' + (izinGerekli() ? ' iPhone hareket izni ister ve uygulama kapanınca çoğu zaman unutur: o zaman Bugün’deki ya da buradaki düğmeyle yeniden ver.' : '') : 'Bu tarayıcı hareket algılayıcısını desteklemiyor.'}</small></span>
        <input class="anahtar" type="checkbox" role="switch" data-ayar-egim ${a.egim !== false ? 'checked' : ''} ${egimVar() ? '' : 'disabled'} aria-label="Telefonu eğince tablo oynasın"></label>
        <button class="dugme ince" type="button" data-egim-izin data-test="egim-izin" hidden>${ikon('hareket', 18, 1.6)} Hareket iznini ver</button>
        <p class="mesaj" id="egim-mesaj" aria-live="polite"></p></div>
      <div class="ayar"><b>Görselleri çevrimdışı indir</b>
        <p id="indir-bilgi">Açık sanatçıların pekiştirme görselleri (sanatçı başına en fazla ${TEST_HAVUZU}) hesaplanıyor…</p>
        <button class="dugme" type="button" data-indir>İndir</button>
        <progress id="indir-cubuk" max="1" value="0" hidden></progress>
        <p class="mesaj" id="indir-mesaj" aria-live="polite"></p>
      </div>
      <div class="ayar"><b>Yedekle</b>
        <p>İlerlemen panoya kopyalanır ve aşağıda görünür. Notlar uygulamasına yapıştırıp sakla.</p>
        <button class="dugme" type="button" data-yedekle>Yedekle</button>
        <textarea id="yedek-cikti" readonly hidden aria-label="Yedek metni"></textarea>
        <p class="mesaj" id="yedek-mesaj" aria-live="polite"></p>
      </div>
      <div class="ayar"><b>Yedeği geri yükle</b>
        <p>Daha önce aldığın yedeği buraya yapıştır. Mevcut ilerlemenin yerine geçer.</p>
        <textarea id="yedek-girdi" aria-label="Geri yüklenecek yedek" placeholder='{"uygulama":"sanat-atlasi", …}'></textarea>
        <button class="dugme" type="button" data-geri-yukle>Geri yükle</button>
        <p class="mesaj" id="geri-mesaj" aria-live="polite"></p>
      </div>
      ${bildirimBolumu()}
      <div class="ayar"><label class="konu"><span class="metin"><b>Geliştirici modu</b><small>Bütün konular, sanatçılar ve harita bölümleri açılır. Kapatınca açmadan önceki ilerlemen olduğu gibi geri gelir; mod açıkken çözdüklerin sayılmaz.</small></span>
        <input class="anahtar" type="checkbox" role="switch" data-ayar-gelistirici ${d.ilerleme.gelistirici ? 'checked' : ''} aria-label="Geliştirici modu"></label>
        <p class="mesaj" id="gelistirici-mesaj" aria-live="polite"></p></div>
      <div class="ayar"><b>Yenilikler</b>
        <ul class="yenilik-liste" data-test="yenilikler">${YENILIKLER.map((x) => `<li>${kacis(yenilikYazisi(x))}</li>`).join('')}</ul>
      </div>
    </div>
    <p class="alt-not">Sanat Atlası ${SURUM} · Görseller: Wikimedia Commons, müze açık erişim koleksiyonları ve WikiArt · Eser listeleri: Wikidata</p>`);
  indirBilgisi();
  egimIzinDugmesi();
}

// "Hareket iznini ver": yalnız izin isteyen tarayıcıda (iPhone), hareket açıkken ve iOS izni hatırlamıyorsa görünür
async function egimIzinDugmesi() {
  const btn = ekran.querySelector('[data-egim-izin]');
  if (!btn) return;
  btn.hidden = true;
  if (!izinGerekli() || d.ilerleme.ayarlar.egim === false) return;
  const hatirliyor = await izinVarMi();
  if (btn.isConnected) btn.hidden = hatirliyor;
}

async function indirBilgisi() {
  const urller = await indirilecekler();
  const el = document.getElementById('indir-bilgi');
  if (!el) return;
  const mb = Math.round((urller.length * TAHMINI_GORSEL_KB) / 1024);
  el.textContent = `${urller.length} görsel · tahminen ~${mb} MB. ${await alanYazisi()}`;
  if (d.indirme) indirmeGoster();
}

function indirmeGoster() {
  const i = d.indirme;
  const cubuk = document.getElementById('indir-cubuk');
  const mesaj = document.getElementById('indir-mesaj');
  const btn = ekran.querySelector('[data-indir]');
  if (!cubuk || !i) return;
  cubuk.hidden = false;
  cubuk.max = i.toplam || 1;
  cubuk.value = i.biten;
  btn.disabled = !i.bitti;
  mesaj.className = 'mesaj' + (i.bitti ? ' tamam' : '');
  mesaj.textContent = i.bitti
    ? `Bitti: ${i.biten - i.hata} görsel indirildi${i.hata ? `, ${i.hata} indirilemedi` : ''}.`
    : `${i.biten} / ${i.toplam} · ~${Math.round((i.biten * TAHMINI_GORSEL_KB) / 1024)} MB`;
}

async function gorselleriIndir() {
  if (d.indirme && !d.indirme.bitti) return;
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    const m = document.getElementById('indir-mesaj');
    m.className = 'mesaj hata';
    m.textContent = 'Çevrimdışı önbellek henüz hazır değil. Uygulamayı kapatıp yeniden açtıktan sonra tekrar dene.';
    return;
  }
  const urller = await indirilecekler();
  d.indirme = { toplam: urller.length, biten: 0, hata: 0, bitti: false };
  indirmeGoster();
  let sira = 0;
  const isci = async () => {
    while (sira < urller.length) {
      const u = urller[sira++];
      try {
        // Commons/NGA/AIC cors ile gelir: durum kodu görülür, 429 "indirildi" sayılmaz. CORS yoksa opak (doğrulanamaz)
        const y = await fetch(u, { mode: 'cors' }).catch(() => fetch(u, { mode: 'no-cors' }));
        if (y.type !== 'opaque' && !y.ok) d.indirme.hata++;
      } catch (e) {
        d.indirme.hata++;
      }
      d.indirme.biten++;
      indirmeGoster();
    }
  };
  await Promise.all([isci(), isci()]);
  d.indirme.bitti = true;
  indirmeGoster();
}

// Ekranın olay dinleyicileri; app.js özgün sırayla bir kez bağlar
export function olaylariBagla() {
  ekran.addEventListener('click', async (e) => {
    const kb = e.target.closest('[data-kart]');
    if (kb) {
      const a = d.ilerleme.ayarlar;
      a.gunlukKart = Math.min(100, Math.max(5, a.gunlukKart + Number(kb.dataset.kart)));
      ekran.querySelector('[data-test="gunluk-kart"]').textContent = a.gunlukKart;
      kaydet();
      return;
    }
    if (e.target.closest('[data-indir]')) return gorselleriIndir();
    if (e.target.closest('[data-egim-izin]')) {
      const m = document.getElementById('egim-mesaj');
      const tamam = await egimIzni();
      m.className = `mesaj ${tamam ? 'tamam' : 'hata'}`;
      m.textContent = tamam ? 'İzin verildi: Bugün’de telefonu çevir.' : 'Hareket izni verilmedi. Uygulamayı kapatıp açınca yeniden sorulur.';
      egimIzinDugmesi();
      return;
    }
    if (e.target.closest('[data-bildirim-kopyala]')) {
      const metin = bildirimMetni(d.ilerleme);
      const ta = document.getElementById('bildirim-cikti');
      const m = document.getElementById('bildirim-mesaj');
      ta.hidden = false;
      ta.value = metin;
      try {
        await navigator.clipboard.writeText(metin);
        m.className = 'mesaj tamam';
        m.textContent = 'Bildirim listesi panoya kopyalandı.';
      } catch (err) {
        ta.focus();
        ta.select();
        m.className = 'mesaj';
        m.textContent = 'Panoya otomatik kopyalanamadı; metni seçip kopyala.';
      }
      return;
    }
    if (e.target.closest('[data-bildirim-temizle]')) {
      if (!confirm('Bildirim listesi silinsin mi? (Bildirilen görseller pekiştirmeden çıkmış olarak kalır.)')) return;
      d.ilerleme.bildirimler = [];
      kaydet();
      ayarlarSayfasi();
      return;
    }
    if (e.target.closest('[data-yedekle]')) {
      yedekTarihiYaz();
      const metin = yedekMetni(d.ilerleme, d.yarim);
      const ta = document.getElementById('yedek-cikti');
      const m = document.getElementById('yedek-mesaj');
      ta.hidden = false;
      ta.value = metin;
      try {
        await navigator.clipboard.writeText(metin);
        m.className = 'mesaj tamam';
        m.textContent = 'Yedek panoya kopyalandı.';
      } catch (err) {
        ta.focus();
        ta.select();
        m.className = 'mesaj';
        m.textContent = 'Panoya otomatik kopyalanamadı; metni seçip kopyala.';
      }
      return;
    }
    if (e.target.closest('[data-geri-yukle]')) {
      const m = document.getElementById('geri-mesaj');
      try {
        const girdi = document.getElementById('yedek-girdi').value;
        const yeni = yedekCoz(girdi);
        if (!confirm('Mevcut ilerlemenin yerine bu yedek yüklensin mi?')) return;
        d.ilerleme = yeni;
        d.oturum = null;
        const yarim = yedekYarimOturum(girdi);
        if (kayitGecerliMi(yarim)) {
          d.yarim = yarim;
          idbKoy('oturum', 'yarim', yarim);
        } else yarimSil();
        kaydet();
        temaUygula();
        m.className = 'mesaj tamam';
        m.textContent = `Yedek yüklendi: ${yeni.islenen.length} konu, ${Object.keys(yeni.skorlar).length} sanatçı skoru.`;
      } catch (err) {
        m.className = 'mesaj hata';
        m.textContent = err.message;
      }
    }
  });

  ekran.addEventListener('change', async (e) => {
    if (e.target.matches('[data-ayar-rozet]')) {
      const m = document.getElementById('rozet-mesaj');
      if (e.target.checked && !(await rozetIzni())) {
        e.target.checked = false;
        m.className = 'mesaj hata';
        m.textContent = 'Bildirim izni verilmedi; rozet açılamadı. iOS Ayarlar’dan Atlas için bildirimlere izin verebilirsin.';
        return;
      }
      d.ilerleme.ayarlar.rozet = e.target.checked;
      kaydet();
      if (e.target.checked) await rozetiGuncelle();
      else await rozetYaz(0);
      m.className = 'mesaj tamam';
      m.textContent = e.target.checked ? 'Rozet açıldı.' : 'Rozet kapatıldı.';
      return;
    }
    if (e.target.matches('[data-ayar-egim]')) {
      const m = document.getElementById('egim-mesaj');
      if (e.target.checked && !(await egimIzni())) {
        e.target.checked = false;
        m.className = 'mesaj hata';
        m.textContent = 'Hareket izni verilmedi. Uygulamayı kapatıp açınca yeniden sorulur.';
        return;
      }
      d.ilerleme.ayarlar.egim = e.target.checked;
      kaydet();
      m.className = 'mesaj tamam';
      m.textContent = e.target.checked ? 'Açıldı: Bugün’de telefonu çevir.' : 'Kapatıldı.';
      egimIzinDugmesi();
      return;
    }
    if (e.target.matches('[data-ayar-gelistirici]')) {
      const m = document.getElementById('gelistirici-mesaj');
      if (e.target.checked) {
        const konular = [...new Set([...d.konular.map((k) => k.no), ...d.sanatcilar.map((s) => s.konu)])].filter(Number.isInteger);
        d.ilerleme = gelistiriciAc(d.ilerleme, konular, bolumler().map((b) => b.id), d.yarim);
        m.textContent = 'Açıldı: her şey açık. Kapatınca ilerlemen geri gelir.';
      } else {
        const { ilerleme, yarim } = gelistiriciKapat(d.ilerleme);
        d.ilerleme = ilerleme;
        if (kayitGecerliMi(yarim)) {
          d.yarim = yarim;
          idbKoy('oturum', 'yarim', yarim);
        } else yarimSil();
        m.textContent = 'Kapatıldı: ilerlemen açmadan önceki haline döndü.';
      }
      d.oturum = null;
      kaydet();
      temaUygula();
      m.className = 'mesaj tamam';
      return;
    }
    if (e.target.matches('[data-ayar-tanisma]')) {
      d.ilerleme.ayarlar.tanisma = e.target.checked;
      kaydet();
      return;
    }
    if (e.target.name === 'tema' && TEMALAR.includes(e.target.value)) {
      d.ilerleme.ayarlar.tema = e.target.value;
      kaydet();
      temaUygula();
    }
  });
}
