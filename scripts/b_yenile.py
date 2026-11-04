#!/usr/bin/env python3
"""Küçük kalmış 1280 px kopyaları en büyük kopyadan yeniden üretir (İş 112).

gorseller/b/<ad>.jpg uzun kenarı 1280 olmalı; ama kaynak küçük verdiyse (The Met'in "web-large" ~600 px, Commons'ta
küçük küçük resim) o boyda kalmıştı: R2'deki 7028 kopyanın 2648'i 1216 px'ten küçük, 1560'ının en büyük kopyası
(gorseller_devasa/<ad>.jpg, scripts/devasa_indir.py) var. Bunlar en büyük kopyadan `sips` ile 1280'e küçültülür
(asla büyütülmez: en büyük kopya 1280'den küçükse olduğu gibi alınır, elimizdekinden büyük değilse hiç dokunulmaz).

Yenilenenlerin adları data/b_yenilenen.json'a yazılır. scripts/r2_yukle.py bunları kovaya sürüm ekli adla yükler
(b/<ad>-<içeriğin md5'inin ilk 8 hanesi>.jpg) ve data/gorsel_kaynagi.json'a "b_surumler" yazar: eski adres önbellekte
"hiç değişmez" ve telefonda indirilmiş olduğundan yenisi ancak yeni adresle gelir (İş 84'teki gibi).

Çalıştır (depo kökünde, macOS):  python3 scripts/b_yenile.py         (birkaç dakika; ağ gerekmez)
                                  python3 scripts/b_yenile.py --dene  (yalnız sayar, hiçbir dosyaya dokunmaz)
Sonra: python3 scripts/r2_yukle.py --10gb-ustu ve gorsel_kaynagi.json + b_yenilenen.json gönderilir (README).
"""
import json
import re
import subprocess
import sys
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
B = KOK / 'gorseller' / 'b'
DEVASA = KOK / 'gorseller_devasa'
LISTE = KOK / 'data' / 'b_yenilenen.json'
HEDEF = 1280
KUCUK = HEDEF * 0.95  # bundan küçük 1280'likler yenilenir
KALITE = '82'  # scripts/gorsel_indir.py ile aynı


def boyut(yol):
    r = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(yol)], capture_output=True, text=True)
    s = dict(re.findall(r'pixel(Width|Height):\s*(\d+)', r.stdout))
    return (int(s['Width']), int(s['Height'])) if len(s) == 2 else None


def main():
    if subprocess.run(['which', 'sips'], capture_output=True).returncode:
        sys.exit('sips bulunamadı (macOS gerekir).')
    if not DEVASA.is_dir():
        sys.exit('gorseller_devasa/ yok: önce scripts/devasa_indir.py (README).')
    dene = '--dene' in sys.argv
    B.mkdir(parents=True, exist_ok=True)
    adlar = sorted(set(json.loads((KOK / 'data' / 'yerel_gorseller.json').read_text())['gorseller'].values()))
    liste = set(json.loads(LISTE.read_text()).get('adlar', [])) if LISTE.exists() else set()
    yenilenen = atlanan = 0
    for n, ad in enumerate(adlar, 1):
        d = DEVASA / f'{ad}.jpg'
        if not d.exists():
            continue
        b = B / f'{ad}.jpg'
        bb = boyut(b) if b.exists() else None
        if bb and max(bb) >= KUCUK:
            continue
        db = boyut(d)
        if not db or (bb and max(db) <= max(bb) * 1.05):
            atlanan += 1  # en büyük kopya elimizdekinden anlamlı büyük değil
            continue
        if dene:
            yenilenen += 1
            continue
        gecici = b.with_suffix('.yeni')
        if max(db) > HEDEF:
            r = subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', KALITE, '-Z', str(HEDEF), str(d), '--out', str(gecici)], capture_output=True)
            yb = boyut(gecici) if not r.returncode and gecici.exists() else None
            if not yb or max(yb) > max(db):  # sips küçüğü de büyütür: asla büyütülmez
                gecici.unlink(missing_ok=True)
                atlanan += 1
                continue
        else:
            gecici.write_bytes(d.read_bytes())
        gecici.replace(b)
        liste.add(ad)
        yenilenen += 1
        if yenilenen % 100 == 0:
            print(f'{yenilenen} yenilendi ({n}/{len(adlar)})', flush=True)
    if not dene:
        LISTE.write_text(json.dumps({'surum': 1, 'adlar': sorted(liste)}, ensure_ascii=False, separators=(',', ':')) + '\n')
    print(f"\n{'Yenilenecek' if dene else 'Yenilendi'}: {yenilenen} · en büyük kopyası yeterince büyük olmayan: {atlanan}")
    if not dene:
        print('Sonra: python3 scripts/r2_yukle.py --10gb-ustu (README · "Küçük 1280\'likler")')


if __name__ == '__main__':
    main()
