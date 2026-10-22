// Sanatçı adını iki satıra böler: küçük satır (italik) ve büyük satır (bilinen ad); bilinen ad tam adın
// başındaysa küçük satır büyük satırın altında tam adı verir (tam).
// data/kisa_adlar.json'daki kayıt varsa o kullanılır (Rembrandt, Leonardo, Giotto…);
// yoksa son kelime büyük satıra gelir, van/de/da… ekleri ona katılır ("Jan / van Eyck"),
// tek kelimelik adlar yalnızca büyük satırda, parantez içi (Yaşlı) büyük satıra eklenir.
const AD_EKLERI = new Set(['van', 'von', 'de', 'der', 'den', 'da', 'di', 'del', 'della', 'du', 'la', 'le', 'ter', 'el']);

export function adParcala(ad, kisa = null) {
  if (kisa && kisa.buyuk) {
    // Bilinen ad tam adın başındaysa (Giotto di Bondone) küçük satır üstte okununca ters düşer ("di Bondone / Giotto"):
    // büyük satır bilinen ad, altında küçük satırda tam ad (D7)
    const tam = [kisa.buyuk, kisa.kucuk].filter(Boolean).join(' ');
    if (String(ad || '').startsWith(kisa.buyuk)) return kisa.kucuk ? { ilk: '', son: kisa.buyuk, tam } : { ilk: '', son: kisa.buyuk };
    return { ilk: kisa.kucuk || '', son: kisa.buyuk };
  }
  const m = /^(.*?)(\s*\([^)]*\))?$/.exec(String(ad || '').trim());
  const ana = m[1].trim();
  const parantez = (m[2] || '').trim();
  const k = ana.split(/\s+/);
  let i = k.length - 1;
  // "Limbourg kardeşler" gibi küçük harfle biten adlar bölünmez
  if (k.length === 2 && k[1] === k[1].toLocaleLowerCase('tr')) i = 0;
  while (i > 0 && AD_EKLERI.has(k[i - 1].toLocaleLowerCase('tr'))) i--;
  return { ilk: k.slice(0, i).join(' '), son: [k.slice(i).join(' '), parantez].filter(Boolean).join(' ') };
}

// Kısa listelerde ("SON" satırı) kullanılan bilinen ad
export function bilinenAd(ad, kisa = null) {
  return adParcala(ad, kisa).son;
}
