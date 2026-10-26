# Yeni harita (İş 41): maskeyle düzenlenen resmi kaynakla birleştirir. GPT maskede kilitli yerlere de dokunabiliyor
# (Rönesans'ta yeni meydan eklerken 6. seviyenin meydanını silip yola başka bir meydan çizdi). Sonuç: açık alanlar
# (maskede saydam) GPT çıktısından, geri kalan her yer kaynaktan; kenarlar yumuşak geçişli.
# GPT bir meydanı açık alanın biraz dışına çizdiyse onun yeri --ek x,y ile eklenir (orandan; 1. seviyede gerekti).
# Kullanım: python3 scripts/harita/birlestir.py <kaynak.jpg> <gpt.jpg> <maske.png> <çıktı.jpg> [--ek x,y ...]
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFilter

kaynak, gpt, maske, cikti = sys.argv[1:5]
a = Image.open(kaynak).convert('RGB')
b = Image.open(gpt).convert('RGB').resize(a.size)
acik = ImageChops.invert(Image.open(maske).getchannel('A')).resize(a.size)
d = ImageDraw.Draw(acik)
for i, arg in enumerate(sys.argv):
    if arg == '--ek':
        x, y = (float(v) for v in sys.argv[i + 1].split(','))
        cx, cy = x * a.width, y * a.height
        d.ellipse([cx - 100, cy - 66, cx + 100, cy + 66], fill=255)
acik = acik.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(10))  # biraz taşsın, yumuşak kenar
Image.composite(b, a, acik).save(cikti, quality=90, optimize=True)
