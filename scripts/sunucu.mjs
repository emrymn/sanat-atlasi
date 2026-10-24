// Yerel deneme sunucusu. GitHub Pages proje sitesini taklit etmek için uygulamayı
// /sanat-atlasi/ alt yolunda sunar (göreli yolların doğru çalıştığını sınar).
// Kullanım: node scripts/sunucu.mjs [port] [--sw-yok]
// --sw-yok (npm run dev, v0 önizlemesi): sw.js verilmez, service worker kurulmaz; böylece her
// değişiklik önbelleğe takılmadan hemen görünür. Port verilmezse PORT ortam değişkeni, o da yoksa 4173
// (--sw-yok ile 3000). Port doluysa (yalnız port elle verilmediyse) sıradaki boş port denenir.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = fileURLToPath(new URL('../', import.meta.url));
const ONEK = '/sanat-atlasi/';
const argumanlar = process.argv.slice(2);
const SW_YOK = argumanlar.includes('--sw-yok');
const elle = argumanlar.find((x) => /^\d+$/.test(x)) || process.env.PORT;
const port = Number(elle || (SW_YOK ? 3000 : 4173));
const TURLER = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
};

const sunucu = createServer(async (istek, yanit) => {
  const yol = decodeURIComponent(new URL(istek.url, 'http://x').pathname);
  if (!yol.startsWith(ONEK)) {
    yanit.writeHead(302, { location: ONEK });
    return yanit.end();
  }
  if (SW_YOK && yol === `${ONEK}sw.js`) {
    yanit.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    return yanit.end('Önizlemede service worker kapalı');
  }
  let dosya = normalize(join(KOK, yol.slice(ONEK.length)));
  if (!dosya.startsWith(KOK) || /node_modules|\.git/.test(dosya)) {
    yanit.writeHead(403);
    return yanit.end();
  }
  try {
    if ((await stat(dosya)).isDirectory()) dosya = join(dosya, 'index.html');
    const icerik = await readFile(dosya);
    yanit.writeHead(200, { 'content-type': TURLER[extname(dosya)] || 'application/octet-stream', 'cache-control': 'no-cache' });
    yanit.end(icerik);
  } catch {
    yanit.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    yanit.end('Bulunamadı');
  }
});
let deneme = port;
sunucu.on('error', (h) => {
  if (h.code === 'EADDRINUSE' && !elle && deneme < port + 20) {
    console.log(`port ${deneme} dolu, ${deneme + 1} deneniyor`);
    sunucu.listen(++deneme);
  } else throw h;
});
sunucu.listen(deneme, () => console.log(`http://localhost:${deneme}${ONEK}${SW_YOK ? ' (service worker kapalı)' : ''}`));
