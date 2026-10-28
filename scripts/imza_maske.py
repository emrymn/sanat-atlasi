#!/usr/bin/env python3
"""Ressamların imzalarını (data/imzalar.json, scripts/imzalar.mjs üretir) indirip mürekkep maskesine çevirir (İş 48).
Çıktı: gorseller/imza/<sanatçı id>.png — yalnız saydamlık: mürekkep opak, kâğıt zemini saydam, boş kenarlar kırpılmış,
240 px boy (iPhone'un 3 kat ekranında 52 pt boy = 156 piksel: büyütülmez, piksel piksel görünmez), kenarlar yumuşak.
Uygulama bu maskeyi altınla boyar; imza her temada aynı (Klimt'inki gibi) görünür ve Wikimedia'ya, hız sınırına (429)
ya da internete bağlı kalmaz.

Çalıştır (depo kökünde; Pillow gerekir: pip3 install pillow):
  python3 scripts/imza_maske.py          # olmayanlar
  python3 scripts/imza_maske.py --hepsi  # hepsini yeniden
  python3 scripts/imza_maske.py --buyut  # indirmeden: var olan küçük maskeleri büyüt
Hesap js/imza.js'teki murekkepMaskesi ile aynı (canlı yedek yol için)."""
import io, json, sys, time, urllib.parse, urllib.request, urllib.error
from pathlib import Path
from PIL import Image, ImageFilter

KOK = Path(__file__).resolve().parent.parent
HEDEF = KOK / 'gorseller' / 'imza'
UA = 'SanatAtlasi/1.0 (personal study app; emreyaman1024@gmail.com)'
BOY = 240
BEKLE = 1.5


def indir(dosya):
    # Wikimedia'nın standart büyük boyutu (önbellekte hazır; SVG'ler PNG olarak gelir): geniş imzalar da 240 px boya
    # büyütülmeden iner
    url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + urllib.parse.quote(dosya) + '?width=1920'
    for deneme in range(5):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60) as y:
                return y.read()
        except urllib.error.HTTPError as e:
            if e.code == 429 or e.code >= 500:
                time.sleep(int(e.headers.get('retry-after') or 0) or 5 * 2 ** deneme)
                continue
            raise
    raise RuntimeError('indirilemedi: ' + dosya)


def maske(veri):
    im = Image.open(io.BytesIO(veri)).convert('RGBA')
    w, h = im.size
    p = im.tobytes()
    a_kanal = bytearray(w * h)
    for i in range(w * h):
        r, g, b, a = p[4 * i], p[4 * i + 1], p[4 * i + 2], p[4 * i + 3]
        koyu = (1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255) * (a / 255)
        t = max(0.0, min(1.0, (koyu - 0.12) / 0.5))
        a_kanal[i] = round(t * t * (3 - 2 * t) * 255)  # yumuşak geçiş: mürekkep kenarı tırtıklanmaz
    m = Image.frombytes('L', (w, h), bytes(a_kanal))
    kutu = m.point(lambda v: 255 if v > 25 else 0).getbbox()
    if not kutu:
        return None
    pay = max(2, round(h * 0.01))
    kutu = (max(0, kutu[0] - pay), max(0, kutu[1] - pay), min(w, kutu[2] + pay), min(h, kutu[3] + pay))
    m = m.crop(kutu)
    if m.height > BOY:
        m = m.resize((max(1, round(m.width * BOY / m.height)), BOY), Image.LANCZOS)
    else:
        m = buyut(m)
    # yalnız saydamlık taşıyan PNG (renk siyah; uygulama maskeyi altınla boyar)
    return Image.merge('LA', (Image.new('L', m.size, 0), m))


def buyut(m):
    """Küçük özgün dosya (ör. Dürer'inki 38 px): BOY'a büyütülür, kenarlar çizim gibi pürüzsüzleşir. Büyütme bulanık
    kenar verir; hafif bulanıklaştırıp yeniden keskinleştirmek (orta eşikte yumuşak geçiş) basamakları yok eder."""
    if m.height >= BOY * 0.95:
        return m
    k = BOY / m.height
    m = m.resize((max(1, round(m.width * k)), BOY), Image.BICUBIC)
    m = m.filter(ImageFilter.GaussianBlur(k * 0.3))
    def egri(v):
        t = max(0.0, min(1.0, (v / 255 - 0.3) / 0.4))
        return round(t * t * (3 - 2 * t) * 255)
    return m.point([egri(v) for v in range(256)])


def main():
    if '--buyut' in sys.argv:
        # indirmeden: var olan küçük maskeleri büyütüp pürüzsüzleştirir
        for yol in sorted(HEDEF.glob('*.png')):
            im = Image.open(yol)
            if im.height < BOY * 0.95:
                a = buyut(im.getchannel('A'))
                Image.merge('LA', (Image.new('L', a.size, 0), a)).save(yol, optimize=True)
                print(yol.stem, im.size, '->', a.size)
        return
    hepsi = '--hepsi' in sys.argv
    imzalar = json.loads((KOK / 'data' / 'imzalar.json').read_text())['imzalar']
    HEDEF.mkdir(parents=True, exist_ok=True)
    tamam = bos = 0
    for sid, dosya in sorted(imzalar.items()):
        if not dosya:
            continue
        yol = HEDEF / f'{sid}.png'
        if yol.exists() and not hepsi:
            tamam += 1
            continue
        try:
            m = maske(indir(dosya))
        except Exception as e:
            print('HATA', sid, e)
            continue
        if m is None:
            print('mürekkep bulunamadı', sid, dosya)
            bos += 1
            continue
        m.save(yol, optimize=True)
        tamam += 1
        print(sid, m.size)
        time.sleep(BEKLE)
    print(f'{tamam} imza maskesi hazır, {bos} boş')


if __name__ == '__main__':
    main()
