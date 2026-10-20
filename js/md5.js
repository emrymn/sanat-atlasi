// MD5 (RFC 1321), UTF-8 metin için. Yalnızca Commons küçük resim yolunu (…/thumb/a/ab/…) bulmakta kullanılır.
const S = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16,
  23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
];
const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0);

export function md5(metin) {
  const veri = new TextEncoder().encode(String(metin));
  const uzunluk = veri.length;
  const blok = ((uzunluk + 8) >> 6) + 1;
  const kelime = new Uint32Array(blok * 16);
  for (let i = 0; i < uzunluk; i++) kelime[i >> 2] |= veri[i] << ((i % 4) * 8);
  kelime[uzunluk >> 2] |= 0x80 << ((uzunluk % 4) * 8);
  kelime[blok * 16 - 2] = (uzunluk * 8) >>> 0;
  kelime[blok * 16 - 1] = Math.floor((uzunluk * 8) / 2 ** 32);
  let [a0, b0, c0, d0] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
  for (let j = 0; j < kelime.length; j += 16) {
    let [a, b, c, d] = [a0, b0, c0, d0];
    for (let i = 0; i < 64; i++) {
      let f;
      let g;
      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }
      const t = d;
      d = c;
      c = b;
      const x = (a + f + K[i] + kelime[j + g]) >>> 0;
      b = (b + ((x << S[i]) | (x >>> (32 - S[i])))) >>> 0;
      a = t;
    }
    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }
  return [a0, b0, c0, d0].map((v) => Array.from({ length: 4 }, (_, i) => ((v >>> (i * 8)) & 0xff).toString(16).padStart(2, '0')).join('')).join('');
}
