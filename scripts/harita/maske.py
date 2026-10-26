# Yeni harita (İş 41): "GPT + maske" yöntemi için iskeletten maske üretir (Emre'nin seçimi).
# Yol, kollar ve meydanlar biraz genişletilip kilitlenir; GPT Image 2 yalnız geri kalanı boyar.
#   iskelet/<dönem>_iskelet_<biçim>_maske.png    OpenAI maskesi: saydam = boyanacak, opak = kilitli
#   iskelet/<dönem>_iskelet_<biçim>_yumusak.png  gri: çizimden sonra kaynak resmin yolunu yumuşak kenarla geri koymak için
#   iskelet/<dönem>_iskelet_<biçim>_maske_meydan.png  yalnız 7 meydan kilitli; yolu ve kolları da GPT boyar
#   (Emre: tüm yol kilitliyken yolun iki yanında yeşil bir şerit kalıyordu, yol yapıştırılmış gibi duruyordu)
# Kullanım: python3 scripts/harita/maske.py ronesans cep
import json
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

PAY = 41  # kilitli alanın taslaktaki yoldan taşması (px, tek sayı): model yolu birkaç piksel kaydırabiliyor
YUMUSAK = 14  # geri koyarken kenar yumuşatma (px)
DAR = 7  # dar maskenin payı (px, tek sayı)
SERIT_YOL = 5  # şerit maskesinde yolun kendisi (biraz payla) kilitli kalır
ORTA = 21  # orta maske: GPT dar maskeyi yok saydı (Adım 14), geniş (41) yeşil şerit bıraktı (Adım 12)


def maske(donem, bicim):
    klasor = Path(__file__).parent / 'iskelet'
    ek = '' if bicim == 'yilankavi' else f'_{bicim}'
    sk = Image.open(klasor / f'{donem}_iskelet{ek}.png').convert('RGB')
    yol = sk.split()[0].point(lambda v: 255 if v < 205 else 0)  # yol, kol ve meydanlar zeminden koyu
    kilit = yol.filter(ImageFilter.MaxFilter(PAY))
    m = Image.new('RGBA', sk.size, (0, 0, 0, 0))
    m.putalpha(kilit)
    m.save(klasor / f'{donem}_iskelet{ek}_maske.png')
    kilit.filter(ImageFilter.GaussianBlur(YUMUSAK)).save(klasor / f'{donem}_iskelet{ek}_yumusak.png')
    # yalnız meydanlar: iskeletteki oval (yarıçap 70×43 px) biraz payla
    duraklar = json.loads((klasor / f'{donem}_iskelet{ek}.json').read_text())['duraklar']
    w, h = sk.size
    yalniz = Image.new('L', sk.size, 0)
    d = ImageDraw.Draw(yalniz)
    for x, y in duraklar:
        cx, cy = x * w, y * h
        d.ellipse([cx - 82, cy - 54, cx + 82, cy + 54], fill=255)
    m2 = Image.new('RGBA', sk.size, (0, 0, 0, 0))
    m2.putalpha(yalniz)
    m2.save(klasor / f'{donem}_iskelet{ek}_maske_meydan.png')
    # dar: yol, kol ve meydanlar yalnız birkaç piksel payla (geniş payda yolun iki yanında yeşil şerit kalıyordu,
    # yalnız meydanlar kilitliyken de GPT yolu baştan çizip yerleşimi bozdu)
    m3 = Image.new('RGBA', sk.size, (0, 0, 0, 0))
    m3.putalpha(yol.filter(ImageFilter.MaxFilter(DAR)))
    m3.save(klasor / f'{donem}_iskelet{ek}_maske_dar.png')
    m4 = Image.new('RGBA', sk.size, (0, 0, 0, 0))
    m4.putalpha(yol.filter(ImageFilter.MaxFilter(ORTA)))
    m4.save(klasor / f'{donem}_iskelet{ek}_maske_orta.png')
    # şerit (iki geçişin ikincisi): yalnız yolun iki yanındaki bant açık (geniş kilit ile yolun kendisi arası), geri
    # kalan her yer kilitli. Geniş maskeyle çizilen resimde kalan yeşil şeridi GPT çevreyle kaynaştırsın diye.
    yol_dar = yol.filter(ImageFilter.MaxFilter(SERIT_YOL))
    bant = ImageChops.subtract(kilit, yol_dar)
    m5 = Image.new('RGBA', sk.size, (0, 0, 0, 0))
    m5.putalpha(ImageChops.invert(bant))
    m5.save(klasor / f'{donem}_iskelet{ek}_maske_serit.png')


if __name__ == '__main__':
    maske(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else 'yilankavi')
