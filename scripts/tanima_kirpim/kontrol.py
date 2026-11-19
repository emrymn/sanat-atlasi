#!/usr/bin/env python3
"""Görsel denetim: her kırpımı madde/özellik metniyle yan yana gösteren kontak sayfaları.

  python3 scripts/tanima_kirpim/kontrol.py konu [konuId ...]
  python3 scripts/tanima_kirpim/kontrol.py sanatci [id ...]
  python3 scripts/tanima_kirpim/kontrol.py izgara <sanatci> <anahtar>     (1280'liği 0,1 ızgarayla: kutu seçmek için)
  python3 scripts/tanima_kirpim/kontrol.py yakin <sanatci> <anahtar> x0 y0 x1 y1
Görseller ATLAS_GORSEL (varsayılan /tmp/tk) altına iner; sayfalar <ATLAS_GORSEL>/s/ altına yazılır (9 kırpım / sayfa).
"""
import hashlib
import os
import subprocess
import sys
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from ortak import KOK, VERI, oku, ilk_gorsel

HED = Path(os.environ.get('ATLAS_GORSEL', '/tmp/tk'))
FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
KAYNAK = oku(KOK / 'data/gorsel_kaynagi.json')


def gorsel_yolu(ad):
    (HED / 'b').mkdir(parents=True, exist_ok=True)
    uzak = ad.split(':', 1)[1] if ':' in ad else None  # yerel kopyası olmayan (WikiArt) görsel: kaynak adresinden
    yol = HED / 'b' / (f"{hashlib.md5(ad.encode()).hexdigest()[:16]}.jpg" if uzak else f'{ad}.jpg')
    if not yol.exists():
        b = KAYNAK['b_surumler'].get(ad)
        adres = uzak or f"{KAYNAK['adres']}/b/{ad}{'-' + b if b else ''}.jpg"
        subprocess.run(['curl', '-sS', '-f', '-L', '-o', str(yol), adres], check=True)
    return yol


def karo(k, yazi, W=380):
    im = Image.open(gorsel_yolu(k['gorsel'])).convert('RGB')
    iw, ih = im.size
    x, y, w, h = k['x'], k['y'], k['w'], k['h']
    a0, b0, a1, b1 = max(0, x - w * .3), max(0, y - h * .3), min(1, x + w * 1.3), min(1, y + h * 1.3)
    c = im.crop((int(a0 * iw), int(b0 * ih), int(a1 * iw), int(b1 * ih)))
    s = min(W / c.width, 300 / c.height)
    c = c.resize((max(1, int(c.width * s)), max(1, int(c.height * s))))
    sx, sy = c.width / (a1 - a0), c.height / (b1 - b0)
    satirlar = []
    for p in yazi:
        satirlar += textwrap.wrap(p, 44)
    satirlar = satirlar[:7]
    t = Image.new('RGB', (W, 300 + 8 + 19 * len(satirlar)), (30, 30, 30))
    t.paste(c, ((W - c.width) // 2, 0))
    d = ImageDraw.Draw(t)
    ox = (W - c.width) // 2
    d.rectangle([ox + (x - a0) * sx, (y - b0) * sy, ox + (x + w - a0) * sx, (y + h - b0) * sy], outline=(255, 40, 40), width=3)
    for i, s_ in enumerate(satirlar):
        d.text((4, 306 + 19 * i), s_, font=FONT, fill=(255, 230, 120) if i == 0 else (230, 230, 230))
    return t


def sayfala(karolar, ad):
    (HED / 's').mkdir(parents=True, exist_ok=True)
    yollar = []
    for i in range(0, len(karolar), 9):
        grup = karolar[i:i + 9]
        H = max(k.height for k in grup)
        sayfa = Image.new('RGB', (3 * 390, ((len(grup) + 2) // 3) * (H + 10)), (60, 60, 60))
        for j, k in enumerate(grup):
            sayfa.paste(k, ((j % 3) * 390, (j // 3) * (H + 10)))
        yol = HED / 's' / f'{ad}_{i // 9 + 1:02d}.jpg'
        sayfa.save(yol, quality=82)
        yollar.append(yol)
    return yollar


if __name__ == '__main__':
    kip, *a = sys.argv[1:]
    v = oku(VERI)
    if kip == 'konu':
        konular = {k['id']: k for k in oku(KOK / 'data/ikonografi.json')['konular']}
        karolar = []
        for kid, l in v['konular'].items():
            if a and kid not in a:
                continue
            for k in l:
                karolar.append(karo(k, [f"{kid} M{k['madde']} · {k['ad']}", konular[kid]['tanima'][k['madde']]]))
        print('\n'.join(map(str, sayfala(karolar, 'konu'))))
    elif kip == 'sanatci':
        karolar = []
        for sid, l in v['sanatcilar'].items():
            if a and sid not in a:
                continue
            for k in l:
                karolar.append(karo(k, [f"{sid} · {k['ad']}", k.get('metin', '')]))
        print('\n'.join(map(str, sayfala(karolar, 'sanatci'))))
    elif kip == 'coklu':  # coklu sanatçı|anahtar sanatçı|anahtar … → ikişer ikişer ızgaralı sayfa
        ciftler = [x.split('::') for x in a]
        (HED / 's').mkdir(parents=True, exist_ok=True)
        for i in range(0, len(ciftler), 2):
            parcalar = []
            for s, anahtar in ciftler[i:i + 2]:
                _, ad = ilk_gorsel(s, anahtar)
                im = Image.open(gorsel_yolu(ad)).convert('RGB')
                W = 580
                im = im.resize((W, round(im.height * W / im.width)))
                d = ImageDraw.Draw(im)
                for j in range(1, 10):
                    x, y = round(im.width * j / 10), round(im.height * j / 10)
                    d.line([(x, 0), (x, im.height)], fill=(255, 0, 0))
                    d.line([(0, y), (im.width, y)], fill=(255, 0, 0))
                    d.text((x + 2, 2), f'.{j}', font=FONT, fill=(255, 255, 0))
                    d.text((2, y + 2), f'.{j}', font=FONT, fill=(255, 255, 0))
                d.text((4, im.height - 20), s, font=FONT, fill=(0, 255, 255))
                parcalar.append(im)
            H = max(x.height for x in parcalar)
            sayfa = Image.new('RGB', (1170, H), (40, 40, 40))
            for j, x in enumerate(parcalar):
                sayfa.paste(x, (j * 590, 0))
            yol = HED / 's' / f'coklu_{i // 2 + 1:02d}.jpg'
            sayfa.save(yol, quality=82)
            print(yol)
    elif kip in ('izgara', 'yakin'):
        s, anahtar, *k = a
        _, ad = ilk_gorsel(s, anahtar)
        im = Image.open(gorsel_yolu(ad)).convert('RGB')
        x0, y0, x1, y1 = map(float, k) if k else (0, 0, 1, 1)
        iw, ih = im.size
        im = im.crop((int(x0 * iw), int(y0 * ih), int(x1 * iw), int(y1 * ih)))
        W = 1000 if kip == 'izgara' else 900
        im = im.resize((W, round(im.height * W / im.width)))
        d = ImageDraw.Draw(im)
        for i in range(1, 10):
            x, y = round(im.width * i / 10), round(im.height * i / 10)
            d.line([(x, 0), (x, im.height)], fill=(255, 0, 0))
            d.line([(0, y), (im.width, y)], fill=(255, 0, 0))
            d.text((x + 2, 2), f'{x0 + (x1 - x0) * i / 10:.2f}', font=FONT, fill=(255, 255, 0))
            d.text((2, y + 2), f'{y0 + (y1 - y0) * i / 10:.2f}', font=FONT, fill=(255, 255, 0))
        (HED / 's').mkdir(parents=True, exist_ok=True)
        yol = HED / 's' / f"{kip}_{anahtar.replace('|', '_').replace(' ', '_')[:40]}.jpg"
        im.save(yol, quality=85)
        print(yol, ad, im.size)
