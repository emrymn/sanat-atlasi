# Yeni harita (İş 41): "GPT + maske" yöntemi için iskeletten maske üretir (Emre'nin seçimi).
# Yol, kollar ve meydanlar biraz genişletilip kilitlenir; GPT Image 2 yalnız geri kalanı boyar.
#   iskelet/<dönem>_iskelet_<biçim>_maske.png    OpenAI maskesi: saydam = boyanacak, opak = kilitli
#   iskelet/<dönem>_iskelet_<biçim>_yumusak.png  gri: çizimden sonra kaynak resmin yolunu yumuşak kenarla geri koymak için
# Kullanım: python3 scripts/harita/maske.py ronesans cep
import sys
from pathlib import Path

from PIL import Image, ImageFilter

PAY = 41  # kilitli alanın taslaktaki yoldan taşması (px, tek sayı): model yolu birkaç piksel kaydırabiliyor
YUMUSAK = 14  # geri koyarken kenar yumuşatma (px)


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


if __name__ == '__main__':
    maske(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else 'yilankavi')
