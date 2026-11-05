#!/usr/bin/env python3
"""Doğrulama kontak sayfası (TALIMAT.md §2, adım 5): bir başyapıtın her noktasını en büyük kopyadan payla kırpar,
kutuyu kırmızı çizer, 3 sütunlu tek bir JPEG'e dizer.
Kullanım: python3 scripts/ayrinti/yardimci/kirp.py <anahtar> <görsel.jpg> <çıktı.jpg> [pay=0.3]
Görsel: o eserin 4096'lık (yoksa 1280'lik) kopyası (coz.py'nin verdiği adresten indirilmiş)."""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw

KOK = Path(__file__).resolve().parents[3]


def main():
    anahtar, kaynak, cikti = sys.argv[1:4]
    pay = float(sys.argv[4]) if len(sys.argv) > 4 else 0.3
    veri = json.load(open(KOK / 'data/eser_ayrintilari.json', encoding='utf-8'))['eserler']
    e = next(x for x in veri if x['anahtar'] == anahtar)
    im = Image.open(kaynak).convert('RGB')
    W, H = im.size
    hucre = []
    for n in e['noktalar']:
        x0, y0, x1, y1 = n['x'] * W, n['y'] * H, (n['x'] + n['w']) * W, (n['y'] + n['h']) * H
        px, py = (x1 - x0) * pay, (y1 - y0) * pay
        cx0, cy0, cx1, cy1 = max(0, x0 - px), max(0, y0 - py), min(W, x1 + px), min(H, y1 + py)
        k = im.crop((int(cx0), int(cy0), int(cx1), int(cy1)))
        d = ImageDraw.Draw(k)
        d.rectangle([x0 - cx0, y0 - cy0, x1 - cx0, y1 - cy0], outline=(255, 0, 0), width=max(2, W // 800))
        s = 600 / max(k.size)
        k = k.resize((max(1, round(k.width * s)), max(1, round(k.height * s))))
        d = ImageDraw.Draw(k)
        d.rectangle([0, 0, k.width - 1, 18], fill=(0, 0, 0))
        d.text((3, 3), n['ad'], fill=(255, 255, 0))
        hucre.append(k)
    cols = 3
    rows = (len(hucre) + cols - 1) // cols
    sayfa = Image.new('RGB', (cols * 610, rows * 610), (40, 40, 40))
    for j, k in enumerate(hucre):
        sayfa.paste(k, ((j % cols) * 610 + 5, (j // cols) * 610 + 5))
    sayfa.save(cikti, quality=80)
    print(e['baslik'], f'{W}×{H}', '→', cikti)


if __name__ == '__main__':
    main()
