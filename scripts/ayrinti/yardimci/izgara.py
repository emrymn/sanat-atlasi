#!/usr/bin/env python3
"""Seçim aşaması (TALIMAT.md §2, adım 4): 1280 px kopyayı 0,1 adımlı kırmızı ızgarayla 1000 px genişliğe küçültür.
Kullanım: python3 scripts/ayrinti/yardimci/izgara.py <girdi.jpg> <çıktı.jpg>"""
# 1280'lik kopyayı 0–1 oranlı ızgarayla (0.1 adım) küçültülmüş göster
import sys
from PIL import Image, ImageDraw
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
W = 1000
im = im.resize((W, round(im.height * W / im.width)))
d = ImageDraw.Draw(im)
for i in range(1, 10):
    x = round(im.width * i / 10); y = round(im.height * i / 10)
    d.line([(x, 0), (x, im.height)], fill=(255, 0, 0), width=1)
    d.line([(0, y), (im.width, y)], fill=(255, 0, 0), width=1)
    d.text((x + 2, 2), f'{i/10:.1f}', fill=(255, 255, 0))
    d.text((2, y + 2), f'{i/10:.1f}', fill=(255, 255, 0))
im.save(dst, quality=85)
