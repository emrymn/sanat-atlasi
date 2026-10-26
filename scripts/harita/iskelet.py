# Yeni harita (İş 41): bir dönemin yol iskeleti. Model resmi bu taslağın üstüne boyar; seviye noktaları
# çizimden sonra elle işaretlenmez, buradan okunur (iskelet/<dönem>_iskelet.json).
# Emre'nin seçimleri: yılankavi yol, 1:3 (1024×3072), seviyeler arası aynı aralık (resmin %14'ü),
# yol altta ve üstte ortadan girip çıkar (komşu dönemlerle birleşsin).
# Kullanım: python3 scripts/harita/iskelet.py ronesans 7
import json
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw

W, H = 1024, 3072
AMP, TUR = 0.28, 2.0  # yolun yana açılması (genişliğe oranla) ve tam kıvrım sayısı
ALT, ARALIK = 0.92, 0.14  # 1. seviyenin yüksekliği ve seviyeler arası (yüksekliğe oranla)
ZEMIN, YOL, MEYDAN, KENAR = (226, 222, 208), (168, 140, 100), (196, 170, 128), (140, 112, 76)


def yol_x(t):
    return 0.5 + AMP * math.sin(2 * math.pi * TUR * t)


def iskelet(donem, n):
    duraklar = [[round(yol_x(1 - y), 4), round(y, 4)] for y in (ALT - ARALIK * i for i in range(n))]
    im = Image.new('RGB', (W, H), ZEMIN)
    d = ImageDraw.Draw(im)
    gen = 64
    for k in range(6001):  # yoğun daireler: düz çizgi kalın uçlarda tırtıklı çıkıyordu
        t = k / 6000
        px, py = yol_x(t) * W, (1 - t) * H
        d.ellipse([px - gen / 2, py - gen / 2, px + gen / 2, py + gen / 2], fill=YOL)
    for x, y in duraklar:
        cx, cy, r = x * W, y * H, 70
        d.ellipse([cx - r, cy - r * 0.62, cx + r, cy + r * 0.62], fill=MEYDAN, outline=KENAR, width=6)
    klasor = Path(__file__).parent / 'iskelet'
    klasor.mkdir(exist_ok=True)
    im.save(klasor / f'{donem}_iskelet.png')
    bilgi = {'boyut': [W, H], 'duraklar': duraklar, 'yol': {'amp': AMP, 'tur': TUR, 'alt': ALT, 'aralik': ARALIK}}
    (klasor / f'{donem}_iskelet.json').write_text(json.dumps(bilgi))
    return duraklar


if __name__ == '__main__':
    print(iskelet(sys.argv[1], int(sys.argv[2])))
