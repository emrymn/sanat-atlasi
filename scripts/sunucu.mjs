// Yerel deneme sunucusu. GitHub Pages proje sitesini taklit etmek için uygulamayı
// /sanat-atlasi/ alt yolunda sunar (göreli yolların doğru çalıştığını sınar).
// Kullanım: node scripts/sunucu.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = fileURLToPath(new URL('../', import.meta.url));
const ONEK = '/sanat-atlasi/';
const port = Number(process.argv[2] || process.env.PORT || 4173);
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

createServer(async (istek, yanit) => {
  const yol = decodeURIComponent(new URL(istek.url, 'http://x').pathname);
  if (!yol.startsWith(ONEK)) {
    yanit.writeHead(302, { location: ONEK });
    return yanit.end();
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
}).listen(port, () => console.log(`http://localhost:${port}${ONEK}`));
