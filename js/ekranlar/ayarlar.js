// Ayarlar: günlük kart, tema, çevrimdışı görsel indirme, yedekle ve geri yükle.
import { GUNLUK_YENI_SINIRI } from '../leitner.js';
import { sanatciEserleri, pekistirmeHavuzu, TEST_HAVUZU } from '../eserler.js';
import { gorselUrl, secilenGorsel } from '../gorsel.js';
import { yedekMetni, yedekCoz, yedekYarimOturum, TEMALAR } from '../depo.js';
import { idbKoy } from '../idb.js';
import { kayitGecerliMi } from '../devam.js';
import { acikListe, kotuler, d, gununRengi, ciz, ust, TEMA_AD, TAHMINI_GORSEL_KB, ekran, kaydet, temaUygula } from './ortak.js';
import { yedekTarihiYaz } from './bugun.js';
import { yarimSil } from './pekistir.js';
import { SURUM } from '../surum.js';

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
    </div>
    <p class="alt-not">Sanat Atlası ${SURUM} · Görseller: Wikimedia Commons, müze açık erişim koleksiyonları ve WikiArt · Eser listeleri: Wikidata</p>`);
  indirBilgisi();
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

  ekran.addEventListener('change', (e) => {
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
