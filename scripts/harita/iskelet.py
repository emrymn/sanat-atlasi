# Yeni harita (İş 41): bir dönemin yol iskeleti. Model resmi bu taslağın üstüne boyar; seviye noktaları
# çizimden sonra elle işaretlenmez, buradan okunur (iskelet/<dönem>_iskelet.json).
# Emre'nin seçimleri: yılankavi yol, 1:3 (1024×3072), seviyeler arası aynı aralık (resmin %14'ü),
# yol altta ve üstte ortadan girip çıkar (komşu dönemlerle birleşsin).
# İki biçim (Emre ikisini de denemek istedi): yilankavi (seviyeler yolun üstünde) ve cep (ortada ince ana yol,
# seviyeler kısa bir kolla bağlanan yan meydanlarda, bir sağ bir sol).
# Kullanım: python3 scripts/harita/iskelet.py ronesans 7 [yilankavi|cep] [bolge]
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


CEP_AMP, CEP_TUR, CEP_KOL = 0.10, 2.5, 0.26  # cep: ana yolun kıvrımı, kıvrım sayısı (ortadan girip çıksın diye yarım), kolun uzunluğu


def firca(d, noktalar, gen):
    for px, py in noktalar:  # yoğun daireler: düz çizgi kalın uçlarda tırtıklı çıkıyordu
        d.ellipse([px - gen / 2, py - gen / 2, px + gen / 2, py + gen / 2], fill=YOL)


def iskelet(donem, n, bicim='yilankavi', bolge=False):
    im = Image.new('RGB', (W, H), ZEMIN)
    d = ImageDraw.Draw(im)
    # bolge (Emre, Barok'tan itibaren): resim n eşit bölgeye (ülke/akım) bölünür, her seviye kendi bölgesinin ortasında
    ys = [1 - (i + 0.5) / n for i in range(n)] if bolge else [ALT - ARALIK * i for i in range(n)]
    if bicim == 'cep':
        ana = lambda t: 0.5 + CEP_AMP * math.sin(2 * math.pi * CEP_TUR * t)
        firca(d, [(ana(k / 6000) * W, (1 - k / 6000) * H) for k in range(6001)], 52)
        duraklar = []
        for i, y in enumerate(ys):
            x0 = ana(1 - y)
            x1 = x0 + (CEP_KOL if i % 2 == 0 else -CEP_KOL)
            y1 = y - 0.02
            firca(d, [((x0 + (x1 - x0) * k / 400) * W, (y + (y1 - y) * k / 400) * H) for k in range(401)], 34)
            duraklar.append([round(x1, 4), round(y1, 4)])
    else:
        duraklar = [[round(yol_x(1 - y), 4), round(y, 4)] for y in ys]
        firca(d, [(yol_x(k / 6000) * W, (1 - k / 6000) * H) for k in range(6001)], 64)
    for x, y in duraklar:
        cx, cy, r = x * W, y * H, 70
        d.ellipse([cx - r, cy - r * 0.62, cx + r, cy + r * 0.62], fill=MEYDAN, outline=KENAR, width=6)
    klasor = Path(__file__).parent / 'iskelet'
    klasor.mkdir(exist_ok=True)
    ek = '' if bicim == 'yilankavi' else f'_{bicim}'  # yılankavi eski adıyla kalır
    im.save(klasor / f'{donem}_iskelet{ek}.png')
    yol = {'amp': AMP, 'tur': TUR} if bicim == 'yilankavi' else {'amp': CEP_AMP, 'tur': CEP_TUR, 'kol': CEP_KOL}
    bilgi = {'boyut': [W, H], 'bicim': bicim, 'duraklar': duraklar, 'yol': {**yol, **({'bolge': n} if bolge else {'alt': ALT, 'aralik': ARALIK})}}
    (klasor / f'{donem}_iskelet{ek}.json').write_text(json.dumps(bilgi))
    return duraklar


if __name__ == '__main__':
    print(iskelet(sys.argv[1], int(sys.argv[2]), sys.argv[3] if len(sys.argv) > 3 else 'yilankavi', 'bolge' in sys.argv[4:]))
