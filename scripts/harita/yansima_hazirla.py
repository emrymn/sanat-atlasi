# İş 99 (Emre: dönem geçişindeki "yansıma efekti güzel ama seviyedeki taş aşağıda görünüyor, onu kaldır"): geçiş
# köprüsü üstteki dönemin alt kenarını ve alttakinin üst kenarını aynalıyor; kenara yakın durak meydanları (boyalı
# yuvarlak taşlar) yansımada da görünüyordu (en belirgini Empresyonizm 1, resmin en dibinde). Bu betik yansıma için
# ayrı kenar şeritleri üretir: resmin ARA boyundaki üst ve alt şeridi, yarı çözünürlükte (yansıma zaten bulanık),
# meydanların yerine yanlarındaki boyalı alandan parça konmuş (doku sürsün). Durak yerleri data/harita.json'dan; meydanın boyu
# meydan_ortala.py'nin elips ölçümünden (en az orta boy).
# Çıktı: gorseller/harita/yansima_<dönem>_<alt|ust>_<gunduz|gece>.webp (alt: resmin alt kenarı, üstteki köprüde;
# ust: üst kenarı, alttaki köprüde). En alttaki dönemin alt, en üsttekinin üst kenarı köprüye girmez, üretilmez.
# Kullanım: python3 scripts/harita/yansima_hazirla.py [--goster <klasör>]   (scikit-image gerekir; yalnız geliştirmede)
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from skimage.filters import gaussian, sobel
from skimage.restoration import inpaint_biharmonic

from meydan_ortala import merkez

BURASI = Path(__file__).resolve().parent
KOK = BURASI.parents[1]
HEDEF = KOK / 'gorseller' / 'harita'
DONEMLER = ['ortacag', 'ronesans', 'barok', 'barok2', 'aydinlanma', 'romantik', 'empresyonizm', 'postempresyonizm', 'modern']
ARA = 0.34  # js/harita.js ARA: köprünün boyu, resim boyuna oranla
OLCEK = 0.5  # 1024×3072 → 512×1536
VARSAYILAN = (62, 36)  # px (1024 genişlikte): ölçülemeyen meydanın elips yarıçapları
# meydan yok (yol kıvrımı, kemer kapısı) ya da yolların yuvarlak kavşağı (Rönesans 1: yansımada yol gibi duruyor; silinince
# her doldurma kavşağı bozuyordu): dokunulmaz
MEYDANSIZ = {('ortacag', 2), ('ronesans', 6), ('ronesans', 0)}
DUZ = set()  # düz (biharmonik) doldurulacak meydanlar
PAY = 1.4  # maske meydanın kenar taşlarını da alsın (çift halkalı meydanlarda ölçüm iç halkayı bulabiliyor)


def meydanlar(e, duraklar):
    """Her durak için (x, y, a, b): resmin oranı ve 1024 genişlikteki elips yarıçapları."""
    im = Image.open(HEDEF / f'donem_{e}_gunduz.webp')
    sonuc = []
    for j, (x, y) in enumerate(duraklar):
        if (e, j) in MEYDANSIZ:
            continue
        nx, ny, (_, _, ea, eb, kat) = merkez(im, x, y)
        # durak meydanın ortasındaysa ölçülen elips noktanın kendisidir (kat ~1): boyu yine geçerli; ölçülen merkez
        # belirgin başkaysa (Rönesans 1: durak kavşak meydanının biraz solunda) maske ölçülen merkeze konur
        if kat >= 1.25:
            x, y = nx, ny
        sonuc.append((x, y, max(ea, VARSAYILAN[0]), max(eb, VARSAYILAN[1]), (e, j) in DUZ))
    return sonuc


def doldur(serit, ust_px, elipsler):
    """serit: kenar şeridi (RGB, yarı çözünürlük); ust_px: şeridin resimdeki üst kenarı (yarı çözünürlükte).
    Meydanın yerine yanındaki boyalı alandan aynı biçimde bir parça konur (fırça dokusu sürsün; düz doldurma yansımada
    leke gibi duruyordu); aday kaydırmalardan sınırı çevresine en iyi uyan seçilir, kenarı yumuşak karıştırılır."""
    a = np.asarray(serit).astype(float) / 255
    h, w = a.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    kenar = sobel(gaussian(a.mean(-1), sigma=1.0))
    yerler = [(x * w, y * 3072 * OLCEK - ust_px, ra * OLCEK * PAY, rb * OLCEK * PAY, duz) for x, y, ra, rb, duz in elipsler]
    for i, (cx, cy, ra, rb, duz) in enumerate(yerler):
        if cy + rb < 0 or cy - rb > h:
            continue
        d = ((xx - cx) / ra) ** 2 + ((yy - cy) / rb) ** 2
        maske = d <= 1
        halka = (d > 1) & (d <= 1.6)
        en = None
        for kx in () if duz else (-2.4, -1.8, 1.8, 2.4, 0):
            for ky in (-1.2, 0, 1.2) if kx else (-2.6, 2.6):
                dx, dy = int(round(kx * ra)), int(round(ky * rb))
                sx, sy = xx + dx, yy + dy
                if sx[maske | halka].min() < 0 or sx[maske | halka].max() >= w or sy[maske | halka].min() < 0 or sy[maske | halka].max() >= h:
                    continue
                # kopyalanacak parça başka bir meydanla kesişmesin (taş yine gelmesin)
                if any(((cx + dx - ox) / (ra + oa)) ** 2 + ((cy + dy - oy) / (rb + ob)) ** 2 < 1 for j, (ox, oy, oa, ob, _) in enumerate(yerler) if j != i):
                    continue
                # sınır çevresine uysun, parçanın içinde belirgin bir nesne olmasın (kenar yoğunluğu: tapınak, köprü) ve
                # ortalama rengi çevresininkine yakın olsun (Dante'nin kırmızı cüppesi gibi düz ama başka renkli bir şey)
                ic = a[sy[maske], sx[maske]]
                fark = (np.abs(a[sy[halka], sx[halka]] - a[halka]).mean() + 1.6 * kenar[sy[maske], sx[maske]].mean()
                        + 1.5 * np.abs(ic.mean(0) - a[halka].mean(0)).sum())
                if en is None or fark < en[0]:
                    en = (fark, dx, dy)
        if en is None:  # düz doldurulacak ya da uygun parça yok: yalnız meydanın çevresinde düz doldurma
            l, t = int(max(0, cx - ra - 24)), int(max(0, cy - rb - 24))
            r, bt = int(min(w, cx + ra + 24)), int(min(h, cy + rb + 24))
            a[t:bt, l:r] = inpaint_biharmonic(a[t:bt, l:r], maske[t:bt, l:r], channel_axis=-1)
            continue
        _, dx, dy = en
        kaynak = np.zeros_like(a)
        sx, sy = np.clip(xx + dx, 0, w - 1), np.clip(yy + dy, 0, h - 1)
        kaynak[:] = a[sy, sx]
        yumusak = np.clip((1.45 - np.sqrt(d)) / 0.45, 0, 1)[..., None]  # içte 1, kenarın dışına doğru 0
        a = a * (1 - yumusak) + kaynak * yumusak
    return Image.fromarray((np.clip(a, 0, 1) * 255).round().astype('uint8'))


def main():
    goster = sys.argv[sys.argv.index('--goster') + 1] if '--goster' in sys.argv else None
    veri = json.loads((KOK / 'data' / 'harita.json').read_text())
    for i, e in enumerate(DONEMLER):
        elipsler = meydanlar(e, veri['bolgeler'][e]['duraklar'])
        kenarlar = []
        if i > 0:
            kenarlar.append('alt')  # bu dönemin alt kenarı, altındaki köprüde aynalanır
        if i < len(DONEMLER) - 1:
            kenarlar.append('ust')
        for tur in ('gunduz', 'gece'):
            im = Image.open(HEDEF / f'donem_{e}_{tur}.webp').convert('RGB')
            im = im.resize((round(im.width * OLCEK), round(im.height * OLCEK)), Image.LANCZOS)
            sh = round(im.height * ARA)
            for k in kenarlar:
                ust = im.height - sh if k == 'alt' else 0
                serit = doldur(im.crop((0, ust, im.width, ust + sh)), ust, elipsler)
                serit.save(HEDEF / f'yansima_{e}_{k}_{tur}.webp', quality=78, method=6)
                if goster:
                    once = im.crop((0, ust, im.width, ust + sh))
                    yan = Image.new('RGB', (im.width * 2 + 8, sh), 'white')
                    yan.paste(once, (0, 0))
                    yan.paste(serit, (im.width + 8, 0))
                    yan.save(Path(goster) / f'yansima_{e}_{k}_{tur}.jpg', quality=80)
        print(e, ', '.join(kenarlar))


if __name__ == '__main__':
    main()
