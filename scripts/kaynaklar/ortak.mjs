// Kaynak betikleri için ortak araçlar: istek, ham yanıt önbelleği, atıf süzgeci.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { jsonGetiriciYap, KULLANICI_AJANI } from '../../js/wikidata.js';
import { baslikNormal } from '../../js/yardimci.js';

export const HAM = new URL('../.ham/', import.meta.url);

export const getir = jsonGetiriciYap({
  basliklar: { 'User-Agent': KULLANICI_AJANI, 'Api-User-Agent': KULLANICI_AJANI },
  deneme: 8,
  zamanAsimi: 60000,
});

// Ham yanıtları diske yazar; aynı istek yeniden çalıştırmada ağa gitmez.
// TAZE=1 ile önbellek atlanır.
export async function onbellekli(anahtar, fn) {
  const ad = createHash('sha1').update(anahtar).digest('hex').slice(0, 16);
  const yol = new URL(`yanit/${ad}.json`, HAM);
  if (process.env.TAZE !== '1') {
    try {
      return JSON.parse(await readFile(yol, 'utf8'));
    } catch {
      /* yok */
    }
  }
  const sonuc = await fn();
  await mkdir(new URL('yanit/', HAM), { recursive: true });
  await writeFile(yol, JSON.stringify(sonuc));
  return sonuc;
}

export const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

// Doğrudan atıf olmayanlar: atölye, çevre, takipçi, "atfedilen", kopya, okul, üslup…
export const ATIF_DISI = /\b(workshop|atelier|studio|circle|followers?|attributed|attribution|copy|copies|after|school|manner|style|imitators?|pupils?|assistants?|entourage|possibly|probably|perhaps|formerly|or)\b/i;

export function dogrudanAtifMi(metin) {
  return !ATIF_DISI.test(String(metin || ''));
}

// Ad karşılaştırması: aksan, tire ve büyük/küçük harf yok sayılır
export function adNormal(s) {
  return baslikNormal(s).replace(/\s+/g, ' ').trim();
}

// "Claude Monet (French, 1840–1926)" → { ad, dogum, olum }
export function tanimCoz(tanim) {
  const m = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(String(tanim || '').trim());
  const ad = m ? m[1] : String(tanim || '').trim();
  const yillar = m ? [...m[2].matchAll(/(\d{3,4})/g)].map((x) => Number(x[1])) : [];
  return { ad, dogum: yillar[0] ?? null, olum: yillar[1] ?? null };
}

// Sanatçı eşleşmesi: ad (ad, ad_arama ya da Wikidata etiketi) aynı ve doğum yılı ±3.
// Yıllardan biri bilinmiyorsa emin olunamaz → eşleşmez.
export function sanatciEslesirMi(sanatci, { ad, dogum }, ekAdlar = []) {
  const adlar = new Set([sanatci.ad, sanatci.ad_arama, ...ekAdlar].filter(Boolean).map(adNormal));
  if (!adlar.has(adNormal(ad))) return false;
  if (sanatci.dogum == null || dogum == null) return false;
  return Math.abs(Number(dogum) - sanatci.dogum) <= 3;
}

// İki boyutlu resimsel türler (müze sınıflandırmaları)
export function resimselTurMu(tur) {
  return /^(paintings?|drawings?|prints?|drawing and watercolor|miniatures?|watercolors?|pastels?|manuscripts? and illuminations|illuminations?)$/i.test(String(tur || '').trim());
}
