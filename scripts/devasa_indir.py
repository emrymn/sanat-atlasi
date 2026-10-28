#!/usr/bin/env python3
"""Uygulamadaki eserlerin en büyük kopyalarını indirir (İş 58): uzun kenar en çok 4096 px, en yüksek kalite.

gorseller/b'deki 1280 px kopyaların özgün kaynaklarından (Wikimedia Commons, müzelerin CC0 açık erişim görselleri;
scripts/gorsel_indir.py ile aynı kaynaklar) iner. 4096 px üst sınır iPhone'dan: daha büyük görseli Safari açamaz ya da
belleği yetmez; 4096 bile bugünkü kopyanın 3 katı çözünürlük. Özgünü daha küçük olan eser kendi boyutunda kalır.

Çıktı: gorseller_devasa/<ad>.jpg (depoya girmez; scripts/r2_yukle.py Cloudflare R2'ye yükler).

Çalıştır (depo kökünde, macOS; küçültme için hazır gelen `sips`):
  python3 scripts/devasa_indir.py
Yarıda kalırsa yeniden çalıştır: inmiş dosyalar atlanır. Wikimedia'yı yormamak için istekler arası bekleme var
(1700 küsur görsel, birkaç saat sürebilir; bilgisayar uykuya geçmesin: `caffeinate -i python3 scripts/devasa_indir.py`).
"""
import json
import subprocess
import sys
import time
import urllib.parse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gorsel_indir import DURUM, indir  # noqa: E402  aynı nazik bekleme ve yeniden deneme

KOK = Path(__file__).resolve().parent.parent
HEDEF = KOK / 'gorseller_devasa'
EN_BUYUK = 4096
KALITE = '92'


def kaynak_urlleri(g):
    # büyükten küçüğe denenir: müzeler büyük boyutu her eserde vermeyebilir
    k = g['k']
    if k == 'commons':
        # Special:FilePath özgün 4096'dan küçükse özgünü verir
        return ['https://commons.wikimedia.org/wiki/Special:FilePath/' + urllib.parse.quote(g['d'].replace(' ', '_')) + f'?width={EN_BUYUK}']
    if k == 'aic':
        return [f"https://www.artic.edu/iiif/2/{g['i']}/full/!{EN_BUYUK},{EN_BUYUK}/0/default.jpg", f"https://www.artic.edu/iiif/2/{g['i']}/full/1686,/0/default.jpg"]
    if k == 'nga':
        return [f"{g['i']}/full/!{EN_BUYUK},{EN_BUYUK}/0/default.jpg", f"{g['i']}/full/!2048,2048/0/default.jpg"]
    if k in ('met', 'cma'):
        return [g.get('u', '')] if g.get('u') else []  # müzenin kendi tam boy görseli
    return []


def main():
    if subprocess.run(['which', 'sips'], capture_output=True).returncode:
        sys.exit('sips bulunamadı (macOS gerekir).')
    HEDEF.mkdir(exist_ok=True)
    harita = json.loads((KOK / 'data/yerel_gorseller.json').read_text())['gorseller']
    # anahtar "kaynak:kimlik" → görsel kaydı (kimlik alanı kaynağa göre d/i/u)
    gorseller = {}
    for v in json.loads((KOK / 'data/eserler_onbellek.json').read_text())['sanatcilar'].values():
        for e in v['eserler']:
            for g in e.get('gorseller') or []:
                gorseller[f"{g['k']}:{g.get('d') or g.get('i') or g.get('u') or ''}"] = g
    isler = [(a, ad) for a, ad in harita.items() if a in gorseller and kaynak_urlleri(gorseller[a])]
    inmis = sum(1 for _, ad in isler if (HEDEF / f'{ad}.jpg').exists())
    print(f'{len(isler)} görsel · {inmis} zaten inmiş', flush=True)
    basarisiz = 0
    for n, (a, ad) in enumerate(isler, 1):
        cikti = HEDEF / f'{ad}.jpg'
        if cikti.exists():
            continue
        veri = None
        for url in kaynak_urlleri(gorseller[a]):
            veri = indir(url)
            time.sleep(DURUM['bekle'])
            if veri:
                break
        if not veri:
            basarisiz += 1
            continue
        ham = HEDEF / f'{ad}.ham'
        ham.write_bytes(veri)
        # yalnız küçültür (özgün 4096'dan küçükse büyütmez), en yüksek kalitede JPEG
        r = subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', KALITE, '-Z', str(EN_BUYUK), str(ham), '--out', str(cikti)], capture_output=True)
        ham.unlink(missing_ok=True)
        if r.returncode:
            cikti.unlink(missing_ok=True)
            basarisiz += 1
        if n % 25 == 0:
            boyut = sum(p.stat().st_size for p in HEDEF.glob('*.jpg')) / 1e9
            print(f'{n}/{len(isler)} · {boyut:.2f} GB · başarısız {basarisiz}', flush=True)
    boyut = sum(p.stat().st_size for p in HEDEF.glob('*.jpg')) / 1e9
    print(f'\nBitti · {len(list(HEDEF.glob("*.jpg")))} görsel · {boyut:.2f} GB · başarısız {basarisiz} (yeniden çalıştırınca tekrar denenir)')


if __name__ == '__main__':
    main()
