# İş 98 (Emre: "bu semboller altındaki yuvarlak taşın merkezinde değil, kaymış görünüyor; tam ortasına koy"):
# her durağın boyalı meydanının (yuvarlak taş) merkezini resimden bulur. Durak noktaları iskeletten geliyordu, model
# meydanları biraz kaydırarak boyamış (Modern 4, Post-Empresyonizm 1: ~10 pt). Yöntem: renk bölütleme ve noktayı içeren
# parçanın merkezi değil (yol kolları çekiyordu): meydanların belirgin bir taş kenarı var; noktanın çevresinde, çevresi
# boyunca kenarı en güçlü elips aranır. Kenar noktanın kendi elipsinden belirgin güçlü değilse dokunulmaz.
# Kullanım: python3 scripts/harita/meydan_ortala.py [--yaz] [--sayfa <png>]   (bir kez çalıştırıldı; yeniden çalıştırmak
#   gerekmez: ölçüm durak noktasının çevresinde arar, güncel noktalarla aynı sonucu verir)
#   --yaz: data/harita.json duraklarını günceller (yoksa yalnız ölçer ve yazdırır); --sayfa: denetim görüntüsü
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import map_coordinates
from skimage.color import rgb2lab
from skimage.filters import gaussian, sobel

KOK = Path(__file__).resolve().parents[2]
R = 130  # px (1024 genişlikte), aranan kare yarıçapı
KAY = 36  # px: merkez en çok bu kadar kayabilir (~14 pt)
EN_AZ = 1.25  # bulunan elipsin kenar gücü, noktanın kendi elipsinin en az bu katı olmalı; yoksa dokunulmaz
# Elle verilen merkezler (dönem → {durak sırası: (x, y)}); ölçümün yanlış şeyi bulduğu duraklar denetim görüntüsünden:
ELLE = {
    # 1: bir ara yolun sağındaki kol yolun sonundaki boş meydana (bazilikanın önü) taşındı; Emre önizlemede görünce
    # "eski yerine koy": yine yoldaki genişlik, sonra "sağ alt çapraza": genişliğin merkezi (ortacag_secim.json
    # yeni_meydanlar). 3: meydan yok, yolun kıvrımı (ölçüm yamaca kaydı)
    'ortacag': {0: (0.475, 0.878), 2: (0.54, 0.366)},
    # Emre önizlemede (10 pt'lik ızgarayla ölçülerek): 1 "biraz daha sola" (kavşak meydanının ortası), 3 "sol çapraza"
    # (cebin ortası); 7: kemer kapısı, meydan yok
    'ronesans': {0: (0.530, 0.924), 2: (0.4771, 0.6094), 6: (0.42, 0.105)},
    # 1: Emre "sol çapraza, biraz daha"; 2: ölçüm yoldaki küçük bir lekeye kaydı
    'barok2': {0: (0.378, 0.7455), 1: (0.504, 0.403)},
    # 2: Emre "biraz daha sola"; 4, 5: ölçüm binaya/eve kaydı, nokta zaten ortada
    'romantik': {1: (0.370, 0.6491), 3: (0.2324, 0.2878), 4: (0.2598, 0.1217)},
    'empresyonizm': {1: (0.2273, 0.42)},  # 2: elips fazla uzun çıktı; yatay kayma doğru, dikey değil
}
ACI = np.linspace(0, 2 * np.pi, 96, endpoint=False)


def kenar_gucu(G, cx, cy, a, b):
    """Elipsin çevresindeki kenar gücü: çevrenin %65'inin üstünde kalan değer (yol kollarının açtığı boşluklara dayanıklı)."""
    xs = cx[..., None] + a[..., None] * np.cos(ACI)
    ys = cy[..., None] + b[..., None] * np.sin(ACI)
    v = map_coordinates(G, [ys.ravel(), xs.ravel()], order=1, mode='nearest').reshape(xs.shape)
    return np.percentile(v, 35, axis=-1)


def merkez(im, x, y):
    """Boyalı meydanın elipsi (taş kenarı): noktanın çevresinde, çevresi boyunca kenarı en güçlü elips."""
    px, py = x * im.width, y * im.height
    l, t = int(round(px - R)), int(round(py - R))
    a_ = np.asarray(im.crop((l, t, l + 2 * R, t + 2 * R)).convert('RGB')).astype(float) / 255
    L = rgb2lab(a_)[..., 0]
    G = sobel(gaussian(L, sigma=2.0))
    ox, oy = px - l, py - t
    en = None
    for adim, aralik, aa, oran in ((3, KAY, np.arange(36, 121, 4), np.arange(0.40, 0.76, 0.05)), (1, 4, None, None)):
        if en is None:
            cxs = np.arange(ox - aralik, ox + aralik + 1, adim)
            cys = np.arange(oy - aralik, oy + aralik + 1, adim)
        else:
            _, bx, by, ba, bo = en
            cxs = np.arange(bx - aralik, bx + aralik + 1, adim)
            cys = np.arange(by - aralik, by + aralik + 1, adim)
            aa = np.arange(ba - 4, ba + 5, 1)
            oran = np.arange(bo - 0.04, bo + 0.041, 0.01)
        CX, CY, A, O = np.meshgrid(cxs, cys, aa, oran, indexing='ij')
        g = kenar_gucu(G, CX.ravel(), CY.ravel(), A.ravel(), (A * O).ravel())
        i = int(np.argmax(g))
        en = (g[i], CX.ravel()[i], CY.ravel()[i], A.ravel()[i], O.ravel()[i])
    # karşılaştırma: aynı boyda elips noktanın kendisinde
    kendi = kenar_gucu(G, np.array([ox]), np.array([oy]), np.array([en[3]]), np.array([en[3] * en[4]]))[0]
    g, bx, by, ba, bo = en
    return (l + bx) / im.width, (t + by) / im.height, (bx, by, ba, ba * bo, g / max(kendi, 1e-6))


def main():
    yaz = '--yaz' in sys.argv
    sayfa = sys.argv[sys.argv.index('--sayfa') + 1] if '--sayfa' in sys.argv else None
    veri = json.loads((KOK / 'data' / 'harita.json').read_text())
    karolar = []
    for e, b in veri['bolgeler'].items():
        im = Image.open(KOK / 'gorseller' / 'harita' / f'donem_{e}_gunduz.webp')
        for j, (x, y) in enumerate(b['duraklar']):
            if j in ELLE.get(e, {}):
                nx, ny = ELLE[e][j]
                durum = 'elle'
            else:
                nx, ny, (ex, ey, ea, eb, kat) = merkez(im, x, y)
                d = np.hypot((nx - x) * im.width, (ny - y) * im.height)
                durum = f'{d:4.1f} px, kenar {kat:.2f} kat'
                if kat < EN_AZ:
                    nx, ny, durum = x, y, durum + ': belirgin değil, dokunulmadı'
            print(f'{e:17s}{j + 1}  ({x:.4f}, {y:.4f}) → ({nx:.4f}, {ny:.4f})  {durum}')
            if sayfa:
                px, py = x * im.width, y * im.height
                c = im.crop((int(px - R), int(py - R), int(px + R), int(py + R))).convert('RGB')
                dr = ImageDraw.Draw(c)
                ox, oy = (nx * im.width - px) + R, (ny * im.height - py) + R
                dr.line((R - 9, R, R + 9, R), fill=(0, 255, 255), width=2)
                dr.line((R, R - 9, R, R + 9), fill=(0, 255, 255), width=2)
                dr.ellipse((ox - 6, oy - 6, ox + 6, oy + 6), outline=(255, 0, 0), width=3)
                if j not in ELLE.get(e, {}):
                    dr.ellipse((ex - ea, ey - eb, ex + ea, ey + eb), outline=(255, 60, 60), width=2)
                dr.text((5, 5), f'{e} {j + 1}', fill=(255, 255, 0))
                karolar.append(c)
            if yaz:
                b['duraklar'][j] = [round(nx, 4), round(ny, 4)]
    if sayfa:
        s = 8
        o = Image.new('RGB', (s * 2 * R, -(-len(karolar) // s) * 2 * R), 'white')
        for i, c in enumerate(karolar):
            o.paste(c, ((i % s) * 2 * R, (i // s) * 2 * R))
        o.save(sayfa)
    if yaz:
        (KOK / 'data' / 'harita.json').write_text(json.dumps(veri, ensure_ascii=False, separators=(',', ':')) + '\n')


if __name__ == '__main__':
    main()
