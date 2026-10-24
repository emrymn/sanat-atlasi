// Pekiştir ve İlerleme ekranlarının ortak göstergeleri: hafıza merdiveni (Leitner kutuları),
// dönem istatistiği, seviye izi ve halka.
import { kacis } from '../yardimci.js';
import { gorulduMu } from '../leitner.js';
import { kategori } from '../oturum.js';
import { SEVIYELER, EN_AZ, GECIS_ORANI, oran, ustaMi } from '../seviye.js';

export const KALICI_KUTU = 4; // 2 hafta ve üstü aralık: kalıcı sayılır
const ARALIK_AD = ['bugün', '1 gün', '3 gün', '1 hafta', '2 hafta', '1 ay'];

// Sanatçının en zayıf kutusu (görülmediyse null)
export function enKucukKutu(skorlar, id) {
  const sk = skorlar[id] || {};
  let k = null;
  for (const x of [sk.sanatci, sk.akim]) if (gorulduMu(x)) k = k === null ? x.kutu : Math.min(k, x.kutu);
  return k;
}

export function kutuDagilimi(acik, skorlar) {
  const say = [0, 0, 0, 0, 0, 0];
  let yeni = 0;
  for (const s of acik) {
    const k = enKucukKutu(skorlar, s.id);
    if (k === null) yeni++;
    else say[k]++;
  }
  return { say, yeni, toplam: acik.length, kalici: say[KALICI_KUTU] + say[KALICI_KUTU + 1] };
}

// Basamaklar soldan sağa yükselir; her basamağın dolu kısmı o kutudaki sanatçı oranı
export function merdivenHtml(dg) {
  const enCok = Math.max(1, ...dg.say);
  const gorulen = dg.toplam - dg.yeni;
  return `<figure class="merdiven" data-test="merdiven">
      <div class="merdiven-basamaklar" role="list" aria-label="Hafıza kutuları">${dg.say
        .map(
          (n, i) =>
            `<div class="basamak${n ? '' : ' bos'}" role="listitem" style="--i:${i};--doluluk:${(n / enCok).toFixed(3)}" aria-label="Kutu ${i}: ${n} sanatçı, ${ARALIK_AD[i]} sonra tekrar"><b>${n}</b><span class="basamak-govde"><i></i></span><small>${ARALIK_AD[i]}</small></div>`,
        )
        .join('')}</div>
      <figcaption>${
        gorulen
          ? `Sağa çıktıkça hatıra kalıcılaşır · <b>${dg.kalici}</b> kalıcı${dg.yeni ? ` · ${dg.yeni} görülmedi` : ''}`
          : 'Henüz kart görülmedi; ilk turdan sonra basamaklar dolar.'
      }</figcaption>
    </figure>`;
}

// Dönemin açık sanatçıları üzerinden doğruluk, vadesi gelen ve kalıcı sayıları
export function akimIstatistigi(ad, acik, skorlar, bugun) {
  let dg = 0;
  let tp = 0;
  let vade = 0;
  let kalici = 0;
  let n = 0;
  for (const s of acik) {
    if (s.akim !== ad) continue;
    n++;
    const sk = skorlar[s.id] || {};
    for (const x of [sk.sanatci, sk.akim]) if (x) (dg += x.dogru || 0), (tp += (x.dogru || 0) + (x.yanlis || 0));
    const k = enKucukKutu(skorlar, s.id);
    if (k !== null && k >= KALICI_KUTU) kalici++;
    if (kategori(skorlar, s.id, 'karisik', bugun) === 0) vade++;
  }
  return { dg, tp, oran: tp ? dg / tp : null, vade, kalici, n };
}

// Kolay · Orta · Zor üç parçalı iz; geçerli seviyede bir üstüne ne kadar yaklaşıldığı dolar
export function seviyeIziHtml(k) {
  const n = k.son.length;
  const p = ustaMi(k) ? 1 : Math.min(1, n / EN_AZ) * Math.min(1, oran(k.son) / GECIS_ORANI);
  return `<span class="sv-iz" aria-hidden="true">${SEVIYELER.map((x) => `<i style="--p:${x.no < k.s ? 1 : x.no === k.s ? p.toFixed(3) : 0}"></i>`).join('')}</span>`;
}

export function halkaHtml({ deger, toplam, ad, alt = '' }) {
  const yuzde = toplam ? Math.round((100 * deger) / toplam) : 0;
  return `<div class="halka" role="img" aria-label="${kacis(ad)}: ${deger} / ${toplam}">
      <span class="halka-cember" aria-hidden="true"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="27" pathLength="100"/><circle class="dolu" cx="32" cy="32" r="27" pathLength="100" style="--oran:${yuzde}"/></svg><b>${deger}</b></span>
      <span class="halka-ad">${kacis(ad)}</span>
      <small>${alt ? kacis(alt) : `/ ${toplam}`}</small>
    </div>`;
}

// Altı noktalı kutu göstergesi
export function kutuPipHtml(kutu) {
  return `<span class="kutu-pip" aria-hidden="true">${[0, 1, 2, 3, 4, 5].map((i) => `<i${i <= kutu ? ' class="dolu"' : ''}></i>`).join('')}</span>`;
}
