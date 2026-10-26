# Yeni harita (İş 41): gece resminde meydanlara konmuş figürleri temizler. Meydan, gündüz resminden alınıp gecenin o
# bölgedeki ortalama rengine (kanal kanal) uydurulur, yumuşak kenarla yapıştırılır. Yer kaymadığı için (kontrol edildi) mümkün.
# Kullanım: python3 scripts/harita/gece_duzelt.py <gündüz.jpg> <gece.jpg> <çıktı.jpg> <x,y> [x,y ...]   (oran; meydan merkezi)
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageStat

gunduz, gece, cikti = sys.argv[1:4]
a = Image.open(gunduz).convert('RGB')
g = Image.open(gece).convert('RGB').resize(a.size)
W, H = a.size
for arg in sys.argv[4:]:
    x, y = (float(v) for v in arg.split(','))
    cx, cy = int(x * W), int(y * H)
    rx, ry = 105, 120  # meydan + üstünde duran figür
    kutu = (cx - rx, cy - ry - 60, cx + rx, cy + ry // 2)
    ga, gg = a.crop(kutu), g.crop(kutu)
    # gecenin bu bölgedeki tonu: kanal başına oran
    sa, sg = ImageStat.Stat(ga).mean, ImageStat.Stat(gg).mean
    bantlar = [b.point(lambda v, k=sg[i] / max(sa[i], 1): min(255, int(v * k))) for i, b in enumerate(ga.split())]
    yama = Image.merge('RGB', bantlar)
    m = Image.new('L', ga.size, 0)
    ImageDraw.Draw(m).ellipse([10, 30, ga.width - 10, ga.height - 10], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(14))
    g.paste(yama, kutu[:2], m)
g.save(cikti, quality=90, optimize=True)
