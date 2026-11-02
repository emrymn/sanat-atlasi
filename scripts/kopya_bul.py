# İş 101 (Emre: "uygulamada ismi farklı fakat kopya resimler var, onları da teke indirelim, kalitelisini seç"): bir
# sanatçının eserleri arasında aynı tablonun farklı adla iki kaydı (Wikidata'da iki madde, kurs eseriyle Wikidata
# eseri, tablonun iki neredeyse aynı versiyonu) bulunur. Eser listesi önbellekten (data/eserler_onbellek.json);
# yinelenenleri ayıklayan eski kurallar (aynı Commons dosyası, aynı başlık, aynı QID) farklı ad ve farklı fotoğrafı
# yakalamıyordu. Yöntem: her eserin ilk görselinin algısal özeti (pHash, DCT; ve dHash, komşu farkı); bir sanatçının
# iki eseri iki özette de yakınsa kopya adayı. Görsel: uygulamayla gelen küçük kopya (gorseller/k/), yoksa küçük
# boyutu indirilir (Commons, müzeler); özetler scripts/.ham/kopya_ozet.json'da saklanır, ikinci çalıştırmada inmez.
# Kalan: çözünürlüğü yüksek olan (en büyük kopyası olan > 1280 px kopyası olan > yerel küçük kopyası olan > müze
# görseli > Commons/WikiArt), eşitse daha bilinen (sl), eşitse kurs eseri. Silinen kurs eseriyse uygulama kurs bilgisini
# kalana aktarır (js/eserler.js kopyalariAyikla).
# Çıktı: data/kopya_eserler.json { surum, sanatcilar: { id: [ { sil, kalan, sil_baslik, kalan_baslik, uzaklik } ] } }
# Kullanım: python3 scripts/kopya_bul.py [--sayfa <png>] [--yaz] [--commons-yok]   (yalnız geliştirmede; ağ gerekir)
import hashlib
import io
import json
import threading
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy.fft import dct

KOK = Path(__file__).resolve().parents[1]
ONBELLEK = KOK / 'scripts' / '.ham' / 'kopya_ozet.json'
AJAN = 'SanatAtlasi/1.0 (personal study app; emreyaman1024@gmail.com)'
P_ESIK, D_ESIK = 12, 18  # 64 bitlik özetlerde en çok farklı bit
# Özetleri yakın ama ayrı eserler (denetim görüntüsünden): bir serinin ayrı tabloları, benzer kompozisyonlu ayrı tablolar
AYRI = {
    ('william-hogarth', 'Marriage à-la-Mode', 'Marriage à-la-mode'),  # Moda Evlilik serisinin iki ayrı sahnesi
    ('artemisia-gentileschi', 'Danaë', 'Death of Cleopatra'),
}


def dosya_normal(ad):
    s = urllib.parse.unquote(str(ad or '').strip()) if '%' in str(ad or '') else str(ad or '').strip()
    return s.replace(' ', '_')


def gorsel_anahtari(g):
    return 'c:' + dosya_normal(g['d']).lower() if g['k'] == 'commons' else f"{g['k']}:{g.get('i') or g.get('u')}"


def eser_anahtari(e):
    """js/eserler.js onbellekEseri ile aynı."""
    ilk = e['gorseller'][0]
    if e.get('kurs'):
        return gorsel_anahtari(ilk)
    return 'q:' + e['qid'] if e.get('qid') else gorsel_anahtari(ilk)


def yerel_anahtar(g):
    return f"{g['k']}:{g.get('d') or g.get('i') or g.get('u') or ''}"


def kucuk_adres(g):
    k = g['k']
    if k == 'commons':
        # hazır küçük resim basamağı (js/gorsel.js commonsKucuk): Special:FilePath'in istenen boyda üretimi 429'a takılıyor
        ad = dosya_normal(g['d'])
        h = hashlib.md5(ad.encode()).hexdigest()
        uz = ad.rsplit('.', 1)[-1].lower() if '.' in ad else ''
        on = 'lossy-page1-' if uz in ('tif', 'tiff') else 'page1-' if uz in ('pdf', 'djvu') else ''
        ek = '' if uz in ('jpg', 'jpeg', 'png', 'gif', 'webp') else '.png' if uz == 'svg' else '.jpg'
        kod = urllib.parse.quote(ad)
        return f'https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{kod}/{on}330px-{kod}{ek}'
    if k == 'met':
        return g['u'].replace('/web-large/', '/mobile-large/')
    if k == 'aic':
        return f"https://www.artic.edu/iiif/2/{g['i']}/full/200,/0/default.jpg"
    if k == 'nga':
        return f"{g['i']}/full/!200,200/0/default.jpg"
    if k == 'wikiart':
        return g['u'].replace('!HalfHD.JPG', '!PinterestSmall.jpg').replace('!HalfHD.jpg', '!PinterestSmall.jpg')
    return g.get('u', '')


def ozet(im):
    g = im.convert('L')
    a = np.asarray(g.resize((32, 32), Image.LANCZOS), float)
    c = dct(dct(a, axis=0, norm='ortho'), axis=1, norm='ortho')[:8, :8]
    p = (c > np.median(c)).flatten()
    b = np.asarray(g.resize((9, 8), Image.LANCZOS), float)
    dh = (b[:, 1:] > b[:, :-1]).flatten()
    return ''.join('1' if x else '0' for x in p), ''.join('1' if x else '0' for x in dh)


_kilit = threading.Lock()
_son = [0.0]
ARALIK = 0.35  # sn: iki istek arası en az (bütün iş parçacıkları için): Wikimedia'nın hız sınırına takılmasın


def indir(adres):
    for deneme in range(6):
        with _kilit:
            bekle = _son[0] + ARALIK - time.time()
            if bekle > 0:
                time.sleep(bekle)
            _son[0] = time.time()
        try:
            # müze adreslerinde boşluk olabiliyor (Met "SF Lorenzetti.jpg"): urllib geçersiz sayar
            adres = urllib.parse.quote(adres, safe=':/?&=%!,~+@')
            r = urllib.request.urlopen(urllib.request.Request(adres, headers={'User-Agent': AJAN}), timeout=30)
            return Image.open(io.BytesIO(r.read()))
        except Exception as hata:  # noqa: BLE001
            kod = getattr(hata, 'code', 0)
            if kod in (403, 404, 400, 410):
                return None
            if kod != 429 and not (500 <= kod < 600) and deneme >= 1:
                return None  # bozuk dosya, adres ya da bağlantı hatası: herkesi bekletme
            # 429: sunucunun söylediği kadar (yoksa giderek artan) bekle; herkes beklesin
            sure = float(getattr(hata, 'headers', {}).get('Retry-After', 0) or 0) if kod == 429 else 0
            with _kilit:
                _son[0] = time.time() + max(sure, 5 * (deneme + 1))
    return None


def main():
    yaz = '--yaz' in sys.argv
    sayfa = sys.argv[sys.argv.index('--sayfa') + 1] if '--sayfa' in sys.argv else None
    sanatcilar = json.loads((KOK / 'data' / 'eserler_onbellek.json').read_text())['sanatcilar']
    yerel = json.loads((KOK / 'data' / 'yerel_gorseller.json').read_text())
    yerel_ad, buyuk = yerel['gorseller'], set(yerel.get('buyuk', []))
    devasa = set(json.loads((KOK / 'data' / 'gorsel_kaynagi.json').read_text()).get('devasa', []))
    onbellek = json.loads(ONBELLEK.read_text()) if ONBELLEK.exists() else {}

    isler = []
    for v in sanatcilar.values():
        for e in v.get('eserler', []):
            g = e['gorseller'][0]
            a = yerel_anahtar(g)
            if a not in onbellek:
                isler.append((a, g))
    yerel_is = [(a, g) for a, g in isler if a in yerel_ad]
    uzak_is = [(a, g) for a, g in isler if a not in yerel_ad]
    if '--commons-yok' in sys.argv:
        # Wikimedia bulut adreslerini sıkı sınırlıyor (429, "robot policy"): Commons'tan indirmeyi atla, yalnız
        # yerel/R2 kopyaları ve müze görselleri (AIC küçük boyda 403 veriyor, o da atlanır). Commons'taki eserler
        # özetsiz kalır, onların çiftleri bulunmaz; tam tarama için betiği bu bayrak olmadan ev bağlantısında çalıştır.
        uzak_is = [(a, g) for a, g in uzak_is if g['k'] not in ('commons', 'aic')]
    for a, g in yerel_is:
        onbellek[a] = ozet(Image.open(KOK / 'gorseller' / 'k' / f'{yerel_ad[a]}.jpg'))
    print(f'yerel {len(yerel_is)}, indirilecek {len(uzak_is)}', flush=True)

    def isle(ag):
        a, g = ag
        im = indir(kucuk_adres(g))
        return a, (ozet(im) if im else None)

    with ThreadPoolExecutor(3) as havuz:
        for i, (a, o) in enumerate(havuz.map(isle, uzak_is)):
            if o:
                onbellek[a] = o
            if i % 200 == 199:
                print(f'  {i + 1}/{len(uzak_is)}', flush=True)
                ONBELLEK.parent.mkdir(parents=True, exist_ok=True)
                ONBELLEK.write_text(json.dumps(onbellek))
    ONBELLEK.parent.mkdir(parents=True, exist_ok=True)
    ONBELLEK.write_text(json.dumps(onbellek))

    def kalite(g):
        ad = yerel_ad.get(yerel_anahtar(g))
        if ad:
            return 4 if ad in devasa else 3 if yerel_anahtar(g) in buyuk else 2
        return 1.5 if g['k'] in ('met', 'aic', 'nga', 'cma') else 1

    def uzak(x, y):
        return sum(p != q for p, q in zip(x, y))

    sonuc, karolar, toplam = {}, [], 0
    for sid, v in sanatcilar.items():
        L = []
        for i, e in enumerate(v.get('eserler', [])):
            o = onbellek.get(yerel_anahtar(e['gorseller'][0]))
            if o:
                L.append((i, e, o))
        silinen = set()
        for a in range(len(L)):
            for b in range(a + 1, len(L)):
                ia, ea, oa = L[a]
                ib, eb, ob = L[b]
                dp, dd = uzak(oa[0], ob[0]), uzak(oa[1], ob[1])
                if dp > P_ESIK or dd > D_ESIK:
                    continue
                if (sid, ea['baslik'], eb['baslik']) in AYRI or (sid, eb['baslik'], ea['baslik']) in AYRI:
                    continue
                sira = lambda t: (kalite(t[1]['gorseller'][0]), t[1].get('sl', 0), bool(t[1].get('kurs')), -t[0])  # noqa: E731
                kal, sil = (L[a], L[b]) if sira(L[a]) >= sira(L[b]) else (L[b], L[a])
                if eser_anahtari(sil[1]) in silinen:
                    continue
                silinen.add(eser_anahtari(sil[1]))
                sonuc.setdefault(sid, []).append(
                    {'sil': eser_anahtari(sil[1]), 'kalan': eser_anahtari(kal[1]), 'sil_baslik': sil[1]['baslik'], 'kalan_baslik': kal[1]['baslik'], 'uzaklik': [dp, dd]}
                )
                toplam += 1
                if sayfa:
                    karolar.append((sid, kal, sil, dp, dd))
    print(f'kopya {toplam} ({len(sonuc)} sanatçı)')
    for sid, l in sonuc.items():
        for k in l:
            print(f"  {sid[:22]:22s} {k['uzaklik']} SİL {k['sil_baslik'][:40]:40s} KALAN {k['kalan_baslik'][:40]}")
    if sayfa:
        resimler = []
        for sid, kal, sil, dp, dd in karolar:
            parca = []
            for t in (kal, sil):
                g = t[1]['gorseller'][0]
                ad = yerel_ad.get(yerel_anahtar(g))
                im = Image.open(KOK / 'gorseller' / 'k' / f'{ad}.jpg') if ad else indir(kucuk_adres(g))
                parca.append(im.convert('RGB').resize((round(im.width * 150 / im.height), 150)) if im else Image.new('RGB', (100, 150), 'gray'))
            t = Image.new('RGB', (max(parca[0].width + parca[1].width + 6, 320), 178), 'white')
            t.paste(parca[0], (0, 28))
            t.paste(parca[1], (parca[0].width + 6, 28))
            ImageDraw.Draw(t).text((2, 2), f'{sid[:24]} {dp}/{dd}  KALAN | SİL', fill='black')
            ImageDraw.Draw(t).text((2, 14), f"{kal[1]['baslik'][:26]} | {sil[1]['baslik'][:26]}", fill='black')
            resimler.append(t)
        if resimler:
            s = 5
            w = max(r.width for r in resimler)
            o = Image.new('RGB', (s * (w + 8), -(-len(resimler) // s) * 186), 'white')
            for i, r in enumerate(resimler):
                o.paste(r, ((i % s) * (w + 8), (i // s) * 186))
            o.save(sayfa, quality=82)
    if yaz:
        (KOK / 'data' / 'kopya_eserler.json').write_text(
            json.dumps({'surum': 1, 'sanatcilar': sonuc}, ensure_ascii=False, separators=(',', ':')) + '\n'
        )


if __name__ == '__main__':
    main()
