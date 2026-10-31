# İş 90–91: haritadaki yolcunun pozlarını uygulamaya hazırlar.
# Girdi: cikti/<dönem>/sprite/ altındaki saydam çizimler (poz.mjs üretir); <ad> karakterin adı (eski öğrenci: karakter,
# İş 91'in gezgini: gezgin-a …):
#   <ad>.webp (duruş), <ad>-yuru-1..N.webp (yana yürüme adımları, sola bakar),
#   <ad>-arka-1..N.webp (arkadan, yolda uzaklaşırken), <ad>-on.webp (önden, yolda aşağı inerken; İş 93),
#   <ad>-eskiz.webp (durakta eskiz yaparken).
# Yalnız duruş zorunlu; öbürleri varsa eklenir, yoksa uygulama duruşu sallayarak yürütür. Bir dönemde <ad> yoksa
# o dönemde eski öğrenci (karakter) kalır.
# İş 91: renkler haritaya biraz yaklaştırılır (Lab ortalama/sapma aktarımı, UYUM oranında): figür resmin içinde
# boyanmış gibi dursun.
# İş 94: <ad>-gece.webp, <ad>-on-gece.webp … (poz.mjs --gece; o dönemin gece ışığıyla boyanmış) varsa gece resmi
# odur, yoksa gündüz karartılır (tonla).
# Çıktı: gorseller/harita/<önek>_<dönem>_<poz>_<tur>.webp (YOLCU_PT yüksekliğinde, 3 kat; önek: karakter → yolcu,
# öbürleri kendi adı, boyu ve dosya sürümü, gezgin-a-96-2: aynı adla değişen resim telefonda yenilenmez) ve data/harita_yolcu.json.
# Kullanım: python3 scripts/harita/yolcu_hazirla.py [--karakter gezgin-a]
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
YOLCU_PT = 96  # ekrandaki yükseklik (İş 95, Emre: "karakteri biraz büyütelim"; eskisi 80, ondan önce 72)
UYUM = 0.3  # renklerin haritaya yaklaşma oranı (0: hiç, 1: haritanın renk dağılımı)
# İş 96 (Emre: "neden karakter sarı oldu"): gezginin gecesi sembollerin sıcak fener tonuyla (secim.json
# gece_sembol_tonu, ~0.88/0.70/0.48) karartılınca sarı-turuncuya dönüyordu; gezgin kendi renklerinde, hafif serin karartılır.
# Orta Çağ ve Rönesans'ın serin ay ışığı tonu (SERIN) kalır.
YOLCU_GECE_TONU = (0.66, 0.66, 0.74)
# dosya adına girer: aynı adla değişen resim telefonda yenilenmez (gorseller/ önbelleği sürümden bağımsız)
DOSYA_SURUMU = 2


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


def morSizinti(sp, pay=12):
    """İş 94: gece pozlarında ışığın (mum, fener) parıltısı mor zeminle karışıp kenarda pembe kalır; figürün dış
    kenarına yakın (pay px) açık morumsu pikseller sıcak sarıya çevrilir. Figürün içindeki renklere dokunmaz."""
    from PIL import ImageFilter
    a = np.array(sp).astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    bos = Image.fromarray(((a[..., 3] < 128) * 255).astype('uint8'))
    yakin = np.array(bos.filter(ImageFilter.MaxFilter(pay * 2 + 1))) > 0
    # parıltı açık ve pembemsi (mavi yeşilden fazla); koyu mor giysi değil, sarı alev değil
    mor = yakin & (a[..., 3] > 0) & (r > 140) & (r > g + 25) & (b > g + 5)
    yeni_g = np.minimum(255, g + (b - g) * 0.7)
    a[..., 2] = np.where(mor, g * 0.6, b)
    a[..., 1] = np.where(mor, yeni_g, g)
    return Image.fromarray(a.clip(0, 255).astype('uint8'), 'RGBA')


def geceYerlestir(gece, gunduz):
    """İş 94: boyanmış gece pozu gündüz pozunun kutusuna yerleşir (uygulama ölçüyü gündüzden alır): ayaklar aynı
    yerde, en çok gündüzün boyu kadar; ışık kaynağı figürü genişletmişse kutuya sığacak kadar küçülür."""
    gx, _ = ayak(gunduz)
    nx, _ = ayak(gece)
    fx_g, fx_n = gx * gunduz.width, nx * gece.width
    k = min(gunduz.height / gece.height, fx_g / max(fx_n, 1), (gunduz.width - fx_g) / max(gece.width - fx_n, 1))
    g = gece.resize((max(1, round(gece.width * k)), max(1, round(gece.height * k))), Image.LANCZOS)
    tuval = Image.new('RGBA', gunduz.size, (0, 0, 0, 0))
    tuval.paste(g, (round(fx_g - fx_n * k), gunduz.height - g.height), g)
    return tuval


def haritaRengi(d):
    from skimage.color import rgb2lab
    im = Image.open(HEDEF / f'donem_{d}_gunduz.webp').convert('RGB').resize((256, 768))
    lab = rgb2lab(np.asarray(im).astype(float) / 255).reshape(-1, 3)
    return lab.mean(0), lab.std(0)


def main():
    karakter = sys.argv[sys.argv.index('--karakter') + 1] if '--karakter' in sys.argv else 'karakter'
    veri = {'surum': 2, 'h': YOLCU_PT, 'bolgeler': {}}
    for d in DONEMLER:
        ton = SERIN if d in ('ortacag', 'ronesans') else YOLCU_GECE_TONU
        klasor = BURASI / 'cikti' / d / 'sprite'
        ad = karakter if (klasor / f'{karakter}.webp').exists() else 'karakter'
        # adda boy ve dosya sürümü var (gezgin-a-96-2): resim değişince yeni ad, telefon eskisini önbellekten getirmez
        onek = 'yolcu' if ad == 'karakter' else f'{ad}-{YOLCU_PT}-{DOSYA_SURUMU}'
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
            # İş 94: boyanmış gece pozu (poz.mjs --gece; zaten gece paletinde, renk uyumu yok), yoksa karartılmış gündüz
            gece = f.with_name(f'{f.stem}-gece.webp')
            gece_sp = geceYerlestir(morSizinti(kucuk(Image.open(gece).convert('RGBA'), YOLCU_PT)), sp) if gece.exists() else tonla(sp, ton)
            gece_sp.save(HEDEF / f'{onek}_{d}_{poz}_gece.webp', quality=92, method=6)
            _, ay = ayak(sp)
            pozlar[poz] = {'w': round(sp.width / OLCEK, 1), 'ay': round(ay, 4)}
        veri['bolgeler'][d] = {'ad': onek, 'pozlar': pozlar}
        print(d, onek, ', '.join(pozlar))
    (KOK / 'data' / 'harita_yolcu.json').write_text(json.dumps(veri, ensure_ascii=False, separators=(',', ':')) + '\n')


if __name__ == '__main__':
    main()
