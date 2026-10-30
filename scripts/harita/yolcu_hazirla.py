# İş 90 (Emre: "haritadaki karakter net değil, çok hareketsiz"): öğrencinin pozlarını uygulamaya hazırlar.
# Girdi: cikti/<dönem>/sprite/ altındaki saydam çizimler (sprite.mjs üretir):
#   karakter.webp (duruş), karakter-yuru-1..N.webp (yana yürüme adımları, sola bakar),
#   karakter-arka-1..N.webp (arkadan, yolda uzaklaşırken), karakter-eskiz.webp (durakta eskiz yaparken).
# Yalnız duruş zorunlu; öbürleri varsa eklenir, yoksa uygulama duruşu sallayarak yürütür.
# Çıktı: gorseller/harita/yolcu_<dönem>_<poz>_<tur>.webp (YOLCU_PT yüksekliğinde, 3 kat) ve data/harita_yolcu.json.
# Eski ogrenci_*.webp'lerden büyük ve keskin (kaynak ~900 px); ad yeni: gorseller/ önbelleği sürümden bağımsız.
# Kullanım: python3 scripts/harita/yolcu_hazirla.py
import json
import re
from pathlib import Path

from PIL import Image

from uygulama_hazirla import DONEMLER, OLCEK, SERIN, ayak, kucuk, tonla

BURASI = Path(__file__).resolve().parent
KOK = BURASI.parents[1]
HEDEF = KOK / 'gorseller' / 'harita'
YOLCU_PT = 80  # ekrandaki yükseklik (eskisi 72)
POZ = re.compile(r'^karakter(?:-(yuru|arka)-(\d+)|-(eskiz))?\.webp$')


def pozAdi(dosya):
    m = POZ.match(dosya)
    if not m:
        return None
    if m.group(1):
        return f'{m.group(1)}{m.group(2)}'
    return m.group(3) or 'dur'


def main():
    veri = {'surum': 1, 'h': YOLCU_PT, 'bolgeler': {}}
    for d in DONEMLER:
        sec = json.loads((BURASI / f'{d}_secim.json').read_text())
        ton = SERIN if d in ('ortacag', 'ronesans') else tuple(sec.get('gece_sembol_tonu', (0.88, 0.70, 0.48)))
        pozlar = {}
        for f in sorted((BURASI / 'cikti' / d / 'sprite').glob('karakter*.webp')):
            ad = pozAdi(f.name)
            if not ad:
                continue
            sp = kucuk(Image.open(f).convert('RGBA'), YOLCU_PT)
            sp.save(HEDEF / f'yolcu_{d}_{ad}_gunduz.webp', quality=92, method=6)
            tonla(sp, ton).save(HEDEF / f'yolcu_{d}_{ad}_gece.webp', quality=92, method=6)
            _, ay = ayak(sp)
            pozlar[ad] = {'w': round(sp.width / OLCEK, 1), 'ay': round(ay, 4)}
        veri['bolgeler'][d] = {'pozlar': pozlar}
        print(d, ', '.join(pozlar))
    (KOK / 'data' / 'harita_yolcu.json').write_text(json.dumps(veri, ensure_ascii=False, separators=(',', ':')) + '\n')


if __name__ == '__main__':
    main()
