// İlerleme'nin çalışma bölümü: takvim ve seri (İ1), haftalık doğru oranı ve gelecek yük grafikleri (İ4).
// Grafikler el yapımı SVG; renkler akım renginden ve metin renginden, kutu ve bulanıklık yok.
import { gunEkle } from '../leitner.js';
import { takvim, seri, haftalikOran, gelecekYuk } from '../gecmis.js';
import { ikon } from '../tasarim.js';
import { d, etiket, akimRenk, acikListe, bugun } from './ortak.js';

const GUN_ADLARI = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const GUN_HARFI = ['P', 'P', 'S', 'Ç', 'P', 'C', 'C'];
const AYLAR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

function tarihYazisi(t) {
  const [y, m, g] = t.split('-').map(Number);
  return `${g} ${AYLAR[m - 1]} ${y}`;
}
function haftaGunu(t) {
  const [y, m, g] = t.split('-').map(Number);
  return new Date(y, m - 1, g, 12).getDay();
}

// İ1 · son 12 haftanın takvimi: sütun hafta, satır gün (pazartesi üstte). Kare rengi o günün baskın akımı
export function takvimHtml(gir) {
  const b = bugun();
  const gunler = takvim(d.ilerleme.gecmis, b, 12);
  const sayi = gunler.filter((x) => x.kart > 0).length;
  const n = seri(d.ilerleme.gecmis, b);
  const kareler = gunler
    .map((x, i) => {
      const sinif = x.gelecek ? 'gelecek' : x.kart ? 'dolu' : 'bos';
      const stil = x.kart ? ` style="--akim:${akimRenk(x.akim)};--yog:${Math.min(1, 0.55 + x.kart / 25).toFixed(2)};--i:${Math.floor(i / 7)}"` : ` style="--i:${Math.floor(i / 7)}"`;
      return `<i class="tk ${sinif}${x.tarih === b ? ' bugun' : ''}"${stil} data-tarih="${x.tarih}" data-kart="${x.kart}"${x.kart ? ` title="${tarihYazisi(x.tarih)} · ${x.kart} kart"` : ''}></i>`;
    })
    .join('');
  return `<section class="calisma-takvim${gir ? ' gir' : ''}" data-test="takvim" aria-label="Çalışma takvimi">
      <div class="takvim-ust">
        ${etiket('Son 12 hafta')}
        <p class="seri" data-test="seri" data-seri="${n}">${n ? `<b>${n}</b> günlük seri` : 'Seri yok · bugün bir tur çalış'}</p>
      </div>
      <div class="takvim-govde"><div class="takvim-gunler" aria-hidden="true"><span>Pzt</span><span></span><span>Çar</span><span></span><span>Cum</span><span></span><span>Paz</span></div>
        <div class="takvim-izgara" role="img" aria-label="Son 12 haftada ${sayi} gün çalıştın">${kareler}</div></div>
      <p class="kucuk ikincil takvim-not">Kare, o gün en çok çalıştığın akımın renginde.</p>
    </section>`;
}

// İ4a · haftalık doğru oranı çizgisi. Kartsız haftalarda çizgi kopar
function oranGrafigi(gir) {
  const haftalar = haftalikOran(d.ilerleme.gecmis, bugun(), 12);
  const G = 340;
  const Y = 96;
  const sol = 30;
  const x = (i) => sol + (i * (G - sol - 8)) / (haftalar.length - 1);
  const y = (o) => 6 + (1 - o) * (Y - 6);
  let yol = '';
  let acik = false;
  haftalar.forEach((h, i) => {
    if (h.oran === null) acik = false;
    else {
      yol += `${acik ? 'L' : 'M'}${x(i).toFixed(1)} ${y(h.oran).toFixed(1)}`;
      acik = true;
    }
  });
  const son = [...haftalar.keys()].reverse().find((i) => haftalar[i].oran !== null);
  const yazi = haftalar.some((h) => h.oran !== null)
    ? `Son hafta: ${haftalar[11].oran === null ? 'kart yok' : '%' + Math.round(haftalar[11].oran * 100)}`
    : 'Henüz veri yok';
  return `<figure class="grafik" data-test="egri">
      <figcaption>${etiket('Haftalık doğru oranı')}<span class="ikincil kucuk" data-test="egri-ozet">${yazi}</span></figcaption>
      <svg viewBox="0 0 ${G} ${Y + 18}" role="img" aria-label="Son 12 haftanın doğru oranı çizgisi. ${yazi}" class="grafik-svg${gir ? ' gir' : ''}">
        ${[0, 0.5, 1].map((o) => `<line class="eksen" x1="${sol}" x2="${G - 4}" y1="${y(o)}" y2="${y(o)}"/><text x="${sol - 6}" y="${y(o) + 3.5}" text-anchor="end">${o * 100}</text>`).join('')}
        ${yol ? `<path class="cizgi" d="${yol}" pathLength="1"/>` : ''}
        ${haftalar.map((h, i) => (h.oran === null ? '' : `<circle class="nokta${i === son ? ' son' : ''}" cx="${x(i).toFixed(1)}" cy="${y(h.oran).toFixed(1)}" r="${i === son ? 3.6 : 2.4}"/>`)).join('')}
        <text x="${sol}" y="${Y + 14}">12 hafta önce</text><text x="${G - 4}" y="${Y + 14}" text-anchor="end">bu hafta</text>
      </svg>
    </figure>`;
}

// İ4b · önümüzdeki 14 günün vadeli sanatçı sayısı (çubuk). Gün 0 = bugün (vadesi geçmişler dahil)
function yukGrafigi(gir) {
  const b = bugun();
  const idler = acikListe().map((s) => s.id);
  const gunluk = gelecekYuk(d.ilerleme.skorlar, idler, b, 14);
  const toplam = gunluk.reduce((t, n) => t + n, 0);
  const en = Math.max(1, ...gunluk);
  const G = 340;
  const Y = 84;
  const adim = (G - 8) / 14;
  const yarin = gunluk[1] ?? 0;
  const yazi = `Bugün ${gunluk[0]} · yarın ${yarin} · 14 günde ${toplam} sanatçı`;
  return `<figure class="grafik" data-test="yuk">
      <figcaption>${etiket('Önümüzdeki 14 gün')}<span class="ikincil kucuk" data-test="yuk-ozet">${yazi}</span></figcaption>
      <svg viewBox="0 0 ${G} ${Y + 30}" role="img" aria-label="Önümüzdeki 14 günün vadeli kart sayısı. ${yazi}" class="grafik-svg${gir ? ' gir' : ''}">
        <line class="eksen" x1="4" x2="${G - 4}" y1="${Y}" y2="${Y}"/>
        ${gunluk
          .map((n, i) => {
            const t = gunEkle(b, i);
            const h = n ? Math.max(3, (n / en) * (Y - 16)) : 0;
            const cx = 4 + i * adim + adim / 2;
            return `<g data-gun="${i}" data-sayi="${n}">
              <rect class="cubuk${i === 0 ? ' bugun' : ''}" x="${(cx - adim * 0.3).toFixed(1)}" y="${(Y - h).toFixed(1)}" width="${(adim * 0.6).toFixed(1)}" height="${h.toFixed(1)}" style="--i:${i}"/>
              ${n ? `<text x="${cx.toFixed(1)}" y="${(Y - h - 4).toFixed(1)}" text-anchor="middle">${n}</text>` : ''}
              <text class="gun" x="${cx.toFixed(1)}" y="${Y + 13}" text-anchor="middle"><title>${GUN_ADLARI[haftaGunu(t)]} ${tarihYazisi(t)}</title>${GUN_HARFI[haftaGunu(t)]}</text>
              <text class="gun-no" x="${cx.toFixed(1)}" y="${Y + 25}" text-anchor="middle">${Number(t.slice(8))}</text>
            </g>`;
          })
          .join('')}
      </svg>
    </figure>`;
}

export function egriHtml(gir) {
  return `<section class="calisma-egri" aria-label="Öğrenme eğrisi ve gelecek yük">${oranGrafigi(gir)}${yukGrafigi(gir)}</section>`;
}

export function koleksiyonBagi() {
  const n = d.ilerleme.koleksiyon.length;
  return `<a class="satir koleksiyon-bag" href="#/koleksiyon" data-test="koleksiyon-bag"><span class="metin"><b>Koleksiyonum</b><span>${n ? `${n} eser işaretli` : 'Sevdiğin eserleri işaretle'}</span></span>${ikon('isaret', 20, 1.4)}</a>`;
}
