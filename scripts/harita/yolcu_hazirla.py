# İş 90–91: haritadaki yolcunun pozlarını uygulamaya hazırlar.
# Girdi: cikti/<dönem>/sprite/ altındaki saydam çizimler (poz.mjs üretir); <ad> karakterin adı (eski öğrenci: karakter,
# İş 91'in gezgini: gezgin-a …):
#   <ad>.webp (duruş), <ad>-yuru-1..N.webp (yana yürüme adımları, sola bakar),
#   <ad>-arka-1..N.webp (arkadan, yolda uzaklaşırken), <ad>-on.webp (önden, yolda aşağı inerken; İş 93),
#   <ad>-eskiz.webp (durakta eskiz yaparken). İş 95: isaret.webp (dönemin işareti; gezginin başında, uygulama oynatır).
# Yalnız duruş zorunlu; öbürleri varsa eklenir, yoksa uygulama duruşu sallayarak yürütür. Bir dönemde <ad> yoksa
# o dönemde eski öğrenci (karakter) kalır.
# İş 91: renkler haritaya biraz yaklaştırılır (Lab ortalama/sapma aktarımı, UYUM oranında): figür resmin içinde
# boyanmış gibi dursun.
# Çıktı: gorseller/harita/<önek>_<dönem>_<poz>_<tur>.webp (YOLCU_PT yüksekliğinde, 3 kat; önek: karakter → yolcu,
# öbürleri kendi adı: aynı adla değişen resim telefonda yenilenmez) ve data/harita_yolcu.json.
# Kullanım: python3 scripts/harita/yolcu_hazirla.py [--karakter gezgin-a]  (birkaç ad: --karakter gezgin-i,gezgin-a)
import json
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image

from uygulama_hazirla import DONEMLER, OLCEK, SERIN, ayak, kucuk, tonla

BURASI = Path(__file__).resolve().parent
KOK = BURASI.parents[1]
HEDEF = KOK / 'gorseller' / 'harita'
YOLCU_PT = 80  # ekrandaki yükseklik (eskisi 72)
UYUM = 0.3  # renklerin haritaya yaklaşma oranı (0: hiç, 1: haritanın renk dağılımı)
# İş 95: dönemin işaretinin ekrandaki genişliği (pt; cikti/<dönem>/sprite/isaret.webp, poz.mjs isaret)
ISARET_EN = {'ortacag': 22, 'ronesans': 26, 'barok': 30, 'barok2': 26, 'aydinlanma': 28, 'romantik': 18, 'empresyonizm': 22,
             'postempresyonizm': 28, 'modern': 22}


def pozAdi(ad, dosya):
    m = re.match(rf'^{re.escape(ad)}(?:-(yuru|arka)-(\d+)|-(eskiz|on))?\.webp$', dosya)
    if not m:
        return None
    if m.group(1):
        return f'{m.group(1)}{m.group(2)}'
    return m.group(3) or 'dur'


def uyumla(sp, harita_lab):
    """Figürün opak piksellerinin Lab ortalama ve sapmasını UYUM oranında haritanınkine yaklaştırır."""
    if not UYUM:
        return sp
    from skimage.color import lab2rgb, rgb2lab
    a = np.asarray(sp).astype(float) / 255
    opak = a[..., 3] > 0.5
    lab = rgb2lab(a[..., :3])
    m_s, s_s = lab[opak].mean(0), lab[opak].std(0) + 1e-6
    m_h, s_h = harita_lab
    hedef_m = m_s + (m_h - m_s) * UYUM
    hedef_s = s_s + (s_h - s_s) * UYUM
    yeni = (lab - m_s) / s_s * hedef_s + hedef_m
    rgb = np.clip(lab2rgb(yeni), 0, 1)
    out = np.concatenate([rgb, a[..., 3:]], axis=2)
    return Image.fromarray((out * 255).round().astype('uint8'), 'RGBA')


def haritaRengi(d):
    from skimage.color import rgb2lab
    im = Image.open(HEDEF / f'donem_{d}_gunduz.webp').convert('RGB').resize((256, 768))
    lab = rgb2lab(np.asarray(im).astype(float) / 255).reshape(-1, 3)
    return lab.mean(0), lab.std(0)


def main():
    karakter = sys.argv[sys.argv.index('--karakter') + 1] if '--karakter' in sys.argv else 'karakter'
    veri = {'surum': 2, 'h': YOLCU_PT, 'bolgeler': {}}
    for d in DONEMLER:
        sec = json.loads((BURASI / f'{d}_secim.json').read_text())
        ton = SERIN if d in ('ortacag', 'ronesans') else tuple(sec.get('gece_sembol_tonu', (0.88, 0.70, 0.48)))
        klasor = BURASI / 'cikti' / d / 'sprite'
        # İş 96: virgülle birkaç ad verilebilir (gezgin-i,gezgin-a): dönemde ilk bulunan
        ad = next((a for a in karakter.split(',') if (klasor / f'{a}.webp').exists()), 'karakter')
        onek = 'yolcu' if ad == 'karakter' else ad
        renk = haritaRengi(d) if ad != 'karakter' else None
        pozlar = {}
        for f in sorted(klasor.glob(f'{ad}*.webp')):
            poz = pozAdi(ad, f.name)
            if not poz:
                continue
            sp = kucuk(Image.open(f).convert('RGBA'), YOLCU_PT)
            if renk:
                sp = uyumla(sp, renk)
            sp.save(HEDEF / f'{onek}_{d}_{poz}_gunduz.webp', quality=92, method=6)
            tonla(sp, ton).save(HEDEF / f'{onek}_{d}_{poz}_gece.webp', quality=92, method=6)
            _, ay = ayak(sp)
            pozlar[poz] = {'w': round(sp.width / OLCEK, 1), 'ay': round(ay, 4)}
        veri['bolgeler'][d] = {'ad': onek, 'pozlar': pozlar}
        isaret = klasor / 'isaret.webp'
        if isaret.exists():
            sp = Image.open(isaret).convert('RGBA')
            sp = sp.crop(sp.getchannel('A').getbbox())
            w = ISARET_EN[d] * OLCEK
            sp = sp.resize((w, max(1, round(sp.height * w / sp.width))), Image.LANCZOS)
            sp.save(HEDEF / f'isaret_{d}_gunduz.webp', quality=92, method=6)
            tonla(sp, ton).save(HEDEF / f'isaret_{d}_gece.webp', quality=92, method=6)
            veri['bolgeler'][d]['isaret'] = {'w': ISARET_EN[d], 'h': round(sp.height / OLCEK, 1)}
        print(d, onek, ', '.join(pozlar))
    (KOK / 'data' / 'harita_yolcu.json').write_text(json.dumps(veri, ensure_ascii=False, separators=(',', ':')) + '\n')


if __name__ == '__main__':
    main()
