#!/usr/bin/env python3
"""İş 189b: yakın okuma partisi için görsel yardımcısı (TALIMAT.md §2'deki iki aşamalı yol).

  python3 scripts/basyapit_arastirma/gorsel.py indir N
      Parti N'in 1280 px ve 4096 px kopyalarını /tmp/by/{b,d}/<QID>.jpg'ye indirir, 1280'liği ızgaralar: /tmp/by/g/<QID>.jpg
  python3 scripts/basyapit_arastirma/gorsel.py kirp okumalar/parti_NN.json [QID ...]
      Okuma dosyasındaki her noktayı 4096'lıktan %30 payla kırpar, kutuyu kırmızıyla çizer: /tmp/by/k/<QID>.jpg (kontak sayfası)
  python3 scripts/basyapit_arastirma/gorsel.py yakin QID x0 y0 x1 y1
      Bölgeyi 4096'lıktan ince ızgarayla büyütür (/tmp/by/k/<QID>_yakin.jpg): bir ayrıntının yerini bulmak için.
Klasör ATLAS_GORSEL ortam değişkeniyle değiştirilebilir. PIL gerekir (pip install pillow).
"""
import json
import os
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw

KOK = Path(__file__).resolve().parents[2]
BURASI = Path(__file__).resolve().parent
HED = Path(os.environ.get('ATLAS_GORSEL', '/tmp/by'))
oku = lambda p: json.loads(Path(p).read_text(encoding='utf-8'))


def adresler(n):
    k = oku(KOK / 'data/gorsel_kaynagi.json')
    dev = set(k['devasa'])
    for e in oku(BURASI / 'secim.json')['eserler']:
        if e['parti'] != n:
            continue
        ad = e['gorsel']
        b, d = k['b_surumler'].get(ad), k['surumler'].get(ad)
        yield e, f"{k['adres']}/b/{ad}{'-' + b if b else ''}.jpg", (f"{k['adres']}/d/{ad}{'-' + d if d else ''}.jpg" if ad in dev else None)


def izgara(src, dst, x0=0, y0=0, x1=1, y1=1, W=1000):
    im = Image.open(src).convert('RGB')
    Wi, Hi = im.size
    im = im.crop((int(x0 * Wi), int(y0 * Hi), int(x1 * Wi), int(y1 * Hi)))
    im = im.resize((W, round(im.height * W / im.width)))
    d = ImageDraw.Draw(im)
    for i in range(1, 10):
        x, y = round(im.width * i / 10), round(im.height * i / 10)
        d.line([(x, 0), (x, im.height)], fill=(255, 0, 0))
        d.line([(0, y), (im.width, y)], fill=(255, 0, 0))
        d.text((x + 2, 2), f'{x0 + (x1 - x0) * i / 10:.2f}', fill=(255, 255, 0))
        d.text((2, y + 2), f'{y0 + (y1 - y0) * i / 10:.2f}', fill=(255, 255, 0))
    im.save(dst, quality=85)


def indir(n):
    for alt in 'bdgk':
        (HED / alt).mkdir(parents=True, exist_ok=True)
    for e, b, d in adresler(n):
        q = e['anahtar']
        subprocess.run(['curl', '-sS', '-o', str(HED / 'b' / f'{q}.jpg'), b], check=True)
        if d:
            subprocess.run(['curl', '-sS', '-o', str(HED / 'd' / f'{q}.jpg'), d], check=True)
        izgara(HED / 'b' / f'{q}.jpg', HED / 'g' / f'{q}.jpg')
        print(q, e['baslik'], '' if d else '(4096 yok; doğrulama 1280\'den)')


def kirp(dosya, secilen):
    for e in oku(dosya):
        q = e['anahtar']
        if secilen and q not in secilen:
            continue
        src = HED / 'd' / f'{q}.jpg'
        im = Image.open(src if src.exists() else HED / 'b' / f'{q}.jpg').convert('RGB')
        W, H = im.size
        kare = []
        for p in e['noktalar']:
            x, y, w, h = p['x'], p['y'], p['w'], p['h']
            a0, b0, a1, b1 = max(0, x - w * .3), max(0, y - h * .3), min(1, x + w * 1.3), min(1, y + h * 1.3)
            c = im.crop((int(a0 * W), int(b0 * H), int(a1 * W), int(b1 * H)))
            s = 400 / max(c.size)
            c = c.resize((max(1, int(c.width * s)), max(1, int(c.height * s))))
            sx, sy = c.width / (a1 - a0), c.height / (b1 - b0)
            dr = ImageDraw.Draw(c)
            dr.rectangle([((x - a0) * sx, (y - b0) * sy), ((x + w - a0) * sx, (y + h - b0) * sy)], outline=(255, 0, 0), width=3)
            dr.text((5, 5), p['ad'], fill=(255, 255, 0))
            kare.append(c)
        sayfa = Image.new('RGB', (3 * 410, ((len(kare) + 2) // 3) * 410), (40, 40, 40))
        for i, c in enumerate(kare):
            sayfa.paste(c, ((i % 3) * 410, (i // 3) * 410))
        sayfa.save(HED / 'k' / f'{q}.jpg', quality=85)
        print(HED / 'k' / f'{q}.jpg')


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == 'indir':
        indir(int(a[1]))
    elif a[0] == 'kirp':
        kirp(a[1], set(a[2:]))
    elif a[0] == 'yakin':
        q, *k = a[1:]
        src = HED / 'd' / f'{q}.jpg'
        izgara(src if src.exists() else HED / 'b' / f'{q}.jpg', HED / 'k' / f'{q}_yakin.jpg', *map(float, k), W=900)
        print(HED / 'k' / f'{q}_yakin.jpg')
