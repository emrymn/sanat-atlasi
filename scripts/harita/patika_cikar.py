# İş 90 (Emre: "karakter yürürken patikayı kullansın, sakın dışarıdan yürütme"): dönem resimlerindeki boyalı patikayı
# bulur. Duraklar ana yolun yanındaki ceplerde olduğundan iki durak arası düz ya da yumuşak bir eğri değil: yol ceple ana
# yol arasından geçer. Yöntem: resim küçültülür, her pikselin "yol rengine" uzaklığı maliyet olur (yol rengi: durak
# meydanlarının ortanca rengi, Lab'de); öğrencinin durduğu yerden bir sonrakine en ucuz yol (Dijkstra) patikayı izler.
# Dönemler arası yol yok: resimlerin üst/alt kenarında patika her dönemde kenara varmıyor (kimi resimde yol son
# durakta biter, üstü gökyüzü); öğrenci dönem değişirken sisin içinde söner, yeni dönemin ilk durağında belirir.
# Çıktı: data/harita_patikalar.json (gündüz ve gece aynı yerde; koordinatlar resmin oranı, 4 basamak).
# Kullanım: python3 scripts/harita/patika_cikar.py [--goster <klasör>]  (scikit-image gerekir; yalnız geliştirmede)
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter
from skimage.color import rgb2lab
from skimage.graph import MCP_Geometric

BURASI = Path(__file__).resolve().parent
KOK = BURASI.parents[1]
DONEMLER = ['ortacag', 'ronesans', 'barok', 'barok2', 'aydinlanma', 'romantik', 'empresyonizm', 'postempresyonizm', 'modern']
OL = 4  # küçültme: 1024×3072 → 256×768
W_PT, H_PT = 390, 1170  # js/harita.js W, H
YOLCU_ARA, KENAR = 34, 18  # js/ekranlar/harita.js: öğrenci durağın yanında (haritanın içine doğru)


def duragi(x, y):
    """Öğrencinin durduğu yer (resmin oranı): js/ekranlar/harita.js durakHtml ile aynı hesap."""
    hx = min(W_PT - KENAR, max(KENAR, x * W_PT + (-YOLCU_ARA if x > 0.5 else YOLCU_ARA)))
    return hx / W_PT, y + 4 / H_PT


def maliyet(ad, noktalar):
    im = Image.open(KOK / 'gorseller' / 'harita' / f'donem_{ad}_gunduz.webp').convert('RGB')
    k = np.asarray(im.resize((im.width // OL, im.height // OL), Image.LANCZOS)).astype(float) / 255
    lab = rgb2lab(k)
    h, w = lab.shape[:2]
    ornek = []
    for x, y in noktalar:
        px, py = int(x * w), int(y * h)
        ornek.append(lab[max(0, py - 4):py + 5, max(0, px - 6):px + 7].reshape(-1, 3))
    med = np.median(np.concatenate(ornek), axis=0)
    sap = np.linalg.norm(lab - med, axis=2)
    # bulanıklaştırılmış sapma: yolun ortası (çevresi de yol) kenarından ucuz; yol kenara yapışmadan ortadan gider
    sap = gaussian_filter(sap, 3)
    return 1 + (sap / 5) ** 3, im


def piksel(c, p):
    h, w = c.shape
    return (min(h - 1, max(0, int(p[1] * h))), min(w - 1, max(0, int(p[0] * w))))


def yolBul(c, bas, sonlar):
    """bas'tan sonlar'ın en ucuzuna en ucuz yol: [(x, y)] piksel."""
    m = MCP_Geometric(c, fully_connected=True)
    maliyetler, _ = m.find_costs([bas], sonlar)
    son = min(sonlar, key=lambda s: maliyetler[s])
    return [(col, row) for row, col in m.traceback(son)]


def sadele(noktalar, eps):
    """Ramer–Douglas–Peucker."""
    if len(noktalar) < 3:
        return noktalar
    a, b = np.array(noktalar[0], float), np.array(noktalar[-1], float)
    ab = b - a
    n = np.linalg.norm(ab) or 1
    uz = [abs(ab[0] * (p[1] - a[1]) - ab[1] * (p[0] - a[0])) / n for p in noktalar[1:-1]]
    i = int(np.argmax(uz)) + 1
    if uz[i - 1] <= eps:
        return [noktalar[0], noktalar[-1]]
    return sadele(noktalar[:i + 1], eps)[:-1] + sadele(noktalar[i:], eps)


def yumusat(noktalar, k=2):
    a = np.array(noktalar, float)
    if len(a) < 2 * k + 1:
        return noktalar
    b = a.copy()
    for i in range(k, len(a) - k):
        b[i] = a[i - k:i + k + 1].mean(0)
    return [tuple(p) for p in b]


def oran(yol, c):
    h, w = c.shape
    yol = sadele(yumusat(yol), 0.9)
    return [[round((x + 0.5) / w, 4), round((y + 0.5) / h, 4)] for x, y in yol]


def main():
    veri = json.loads((KOK / 'data' / 'harita.json').read_text())
    sonuc = {'surum': 1, 'aciklama': 'scripts/harita/patika_cikar.py: öğrencinin durduğu yerler arası boyalı patika (resmin oranı)', 'bolgeler': {}}
    goster = sys.argv[sys.argv.index('--goster') + 1] if '--goster' in sys.argv else None
    for ad in DONEMLER:
        noktalar = veri['bolgeler'][ad]['duraklar']
        c, im = maliyet(ad, noktalar)
        yerler = [duragi(x, y) for x, y in noktalar]
        yollar = [oran(yolBul(c, piksel(c, a), [piksel(c, b)]), c) for a, b in zip(yerler, yerler[1:])]
        bol = {'yerler': [[round(x, 4), round(y, 4)] for x, y in yerler], 'yollar': yollar}
        sonuc['bolgeler'][ad] = bol
        if goster:
            dr = ImageDraw.Draw(im)
            for s in yollar:
                if len(s) > 1:
                    dr.line([(x * im.width, y * im.height) for x, y in s], fill=(255, 0, 0), width=8)
            for x, y in yerler:
                dr.ellipse([x * im.width - 12, y * im.height - 12, x * im.width + 12, y * im.height + 12], outline=(0, 255, 0), width=5)
            im.resize((im.width // 3, im.height // 3)).save(Path(goster) / f'patika_{ad}.png')
        print(ad, len(yollar), 'yol')
    (KOK / 'data' / 'harita_patikalar.json').write_text(json.dumps(sonuc, ensure_ascii=False, separators=(',', ':')) + '\n')


if __name__ == '__main__':
    main()
