#!/usr/bin/env python3
"""Sanatçının adının telaffuzu ve portresi (İş 49) → data/kunye.json, gorseller/ses/<id>.mp3, gorseller/portre/<id>.jpg

Kaynak Wikidata, yalnız data/eserler_onbellek.json'daki doğrulanmış QID'ler (imza gibi):
  P443 telaffuz kaydı (Commons ses dosyası; nitelendirici P407 kaydın dili), P18 kişinin görseli, P1412 konuştuğu diller.
Kayıt, sanatçının kendi dilinde değilse (ör. İngilizce konuşan birinin okuduğu Fransız adı) kullanılmaz: o zaman telefon adı
sanatçının dilindeki sesle okur (uygulama, speechSynthesis). Ses dosyası Commons'un MP3'e çevrilmiş kopyası (iPhone Ogg
çalamıyor); portre 330 px küçük resimden yüze yakın kare kesilir. Hepsi uygulamayla yayınlanır: Wikimedia'nın hız sınırına
ve internete bağlı kalmaz.

Çalıştır (depo kökünde; Pillow gerekir: pip3 install pillow):
  python3 scripts/kunye.py                     # sorgu + eksik dosyalar
  python3 scripts/kunye.py --sorgu yanit.json  # Wikidata sorgu yanıtı elde hazırsa (sorgu servisi dakikada bir istek)
  python3 scripts/kunye.py --indirmeden        # dosya indirmeden; yalnız var olan ses/portre dosyaları yazılır
Portre olmayan "kişi görselleri" (ör. sanatçının kendi eseri) PORTRE_DEGIL listesinde: gözle denetlenip eklenir.
"""
import hashlib, io, json, sys, time, urllib.parse, urllib.request, urllib.error
from pathlib import Path
from PIL import Image

KOK = Path(__file__).resolve().parent.parent
UA = 'SanatAtlasi/1.0 (personal study app; emreyaman1024@gmail.com)'
SES = KOK / 'gorseller' / 'ses'
PORTRE = KOK / 'gorseller' / 'portre'
BOY = 330

# Birden çok dili olan ya da dili kayıtlı olmayan sanatçılar: adının söylendiği dil (elle; KARARLAR İş 49).
# Yunanca ve Japonca ses Latin harfli adı okuyamadığı için o sanatçılar telaffuzsuz kalır (None).
DIL = {
    'valentin-de-boulogne': 'fr', 'andrea-pozzo': 'it', 'salvador-dali': 'es', 'vincent-van-gogh': 'nl',
    'pablo-picasso': 'es', 'peter-paul-rubens': 'nl', 'piero-della-francesca': 'it', 'rene-magritte': 'fr',
    'thomas-jefferson': 'en', 'georges-seurat': 'fr', 'paul-gauguin': 'fr', 'edvard-munch': 'no',
    'nicolas-poussin': 'fr', 'pieter-bruegel-yasl': 'nl', 'arnold-bocklin': 'de', 'joan-miro': 'es',
    'jean-arp': 'fr', 'max-ernst': 'de', 'frans-hals': 'nl', 'mary-cassatt': 'en', 'alfred-sisley': 'fr',
    'leon-battista-alberti': 'it', 'theodore-gericault': 'fr', 'paolo-uccello': 'it', 'giambologna': 'it',
    'hyacinthe-rigaud': 'fr', 'wassily-kandinsky': 'de',
    'phidias': None, 'polykleitos': None, 'myron': None, 'praxiteles': None,
    'diotisalvi': 'it', 'nicola-pisano': 'it', 'arnolfo-di-cambio': 'it', 'bonaventura-berlinghieri': 'it',
    'limbourg-kardesler': 'nl', 'michelozzo': 'it', 'petrus-christus': 'nl', 'rogier-van-der-weyden': 'nl',
    'giorgione': 'it', 'giuseppe-maria-crespi': 'it', 'alessandro-magnasco': 'it',
}
OKUNAMAZ = {'ja', 'el', 'ru', 'zh', 'grc'}
# Wikidata'da "kişinin görseli" (P18) olarak kayıtlı ama portre olmayanlar (sanatçının bir eseri, imzası, mezarı…):
# indirilen portreler gözle denetlenir, portre olmayanın id'si buraya yazılır (KARARLAR İş 49)
PORTRE_DEGIL = {
    'domenico-di-michelino',  # kendi Dante tablosu
    'valentin-de-boulogne',  # kendi tablosu
    'praxiteles',  # XIX. yüzyılda yapılmış hayalî kabartma; antik ustaların gerçek yüzü bilinmiyor
}


def getir(url, deneme=6):
    for i in range(deneme):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=90) as y:
                return y.read()
        except urllib.error.HTTPError as e:
            if e.code == 429 or e.code >= 500:
                time.sleep(int(e.headers.get('retry-after') or 0) or 5 * 2 ** i)
                continue
            raise
    raise RuntimeError('indirilemedi: ' + url)


def sorgula(qidler):
    vals = ' '.join('wd:' + q for q in sorted(qidler))
    sorgu = f'''SELECT ?q ?ses ?sesDil ?portre ?dilKod WHERE {{
 VALUES ?q {{ {vals} }}
 OPTIONAL {{ ?q p:P443 ?st . ?st ps:P443 ?ses . OPTIONAL {{ ?st pq:P407 ?sl . ?sl wdt:P218 ?sesDil }} }}
 OPTIONAL {{ ?q wdt:P18 ?portre }}
 OPTIONAL {{ ?q wdt:P1412 ?d . ?d wdt:P218 ?dilKod }}
}}'''
    veri = urllib.parse.urlencode({'query': sorgu, 'format': 'json'}).encode()
    for i in range(5):
        istek = urllib.request.Request('https://query.wikidata.org/sparql', data=veri, headers={'User-Agent': UA, 'Accept': 'application/sparql-results+json'})
        try:
            return json.load(urllib.request.urlopen(istek, timeout=120))
        except urllib.error.HTTPError as e:
            if e.code != 429:
                raise
            time.sleep(70)  # sorgu servisi: dakikada bir istek
    raise RuntimeError('Wikidata sorgusu yapılamadı')


def ad(url):
    return urllib.parse.unquote(url.rsplit('/', 1)[1])


def commons_yolu(dosya):
    d = dosya.replace(' ', '_')
    h = hashlib.md5(d.encode()).hexdigest()
    return d, f'{h[0]}/{h[:2]}'


def portre_indir(dosya, yol):
    d, k = commons_yolu(dosya)
    uz = d.rsplit('.', 1)[-1].lower()
    ek = '.png' if uz in ('svg',) else ('.jpg' if uz in ('tif', 'tiff') else '')
    on = 'lossy-page1-' if uz in ('tif', 'tiff') else ''
    url = f'https://upload.wikimedia.org/wikipedia/commons/thumb/{k}/{urllib.parse.quote(d)}/{on}{BOY}px-{urllib.parse.quote(d)}{ek}'
    try:
        veri = getir(url)
    except urllib.error.HTTPError:
        veri = getir('https://commons.wikimedia.org/wiki/Special:FilePath/' + urllib.parse.quote(dosya) + f'?width={BOY}')
    im = Image.open(io.BytesIO(veri)).convert('RGB')
    w, h = im.size
    # kare: yatay görselde ortadan, dikeyde yüzün olduğu üst kısımdan (portrelerde yüz çoğunlukla üst üçte birde)
    k = min(w, h)
    x = (w - k) // 2
    y = 0 if h <= w else min(h - k, round(h * 0.08))
    im = im.crop((x, y, x + k, y + k)).resize((240, 240), Image.LANCZOS)
    im.save(yol, 'JPEG', quality=84, optimize=True)


def ses_indir(dosya, yol):
    d, k = commons_yolu(dosya)
    if d.lower().endswith('.mp3'):
        url = f'https://upload.wikimedia.org/wikipedia/commons/{k}/{urllib.parse.quote(d)}'
    else:
        url = f'https://upload.wikimedia.org/wikipedia/commons/transcoded/{k}/{urllib.parse.quote(d)}/{urllib.parse.quote(d)}.mp3'
    yol.write_bytes(getir(url))


def main():
    onbellek = json.loads((KOK / 'data' / 'eserler_onbellek.json').read_text())['sanatcilar']
    qid_id = {}
    for sid, k in onbellek.items():
        if k.get('qid'):
            qid_id.setdefault(k['qid'], []).append(sid)
    if '--sorgu' in sys.argv:
        yanit = json.loads(Path(sys.argv[sys.argv.index('--sorgu') + 1]).read_text())
    else:
        yanit = sorgula(qid_id.keys())
    sesler, diller, portreler = {}, {}, {}
    for b in yanit['results']['bindings']:
        q = b['q']['value'].rsplit('/', 1)[1]
        if 'ses' in b:
            sesler.setdefault(q, set()).add((ad(b['ses']['value']), b.get('sesDil', {}).get('value')))
        if 'dilKod' in b:
            diller.setdefault(q, set()).add(b['dilKod']['value'])
        if 'portre' in b:
            portreler.setdefault(q, set()).add(ad(b['portre']['value']))
    SES.mkdir(parents=True, exist_ok=True)
    PORTRE.mkdir(parents=True, exist_ok=True)
    kunye = {}
    for q, sidler in sorted(qid_id.items()):
        for sid in sidler:
            d = diller.get(q, set())
            dil = DIL[sid] if sid in DIL else (next(iter(d)) if len(d) == 1 else None)
            if dil in OKUNAMAZ:
                dil = None
            kayit = {'dil': dil, 'ses': None, 'portre': None}
            # kaydın dili sanatçının dili olmalı (dili belirtilmemiş kayıt kabul: dosya adından anlaşılmıyor)
            uygun = sorted(f for f, l in sesler.get(q, set()) if l is None or l == dil)
            indirme = '--indirmeden' not in sys.argv
            if uygun:
                yol = SES / f'{sid}.mp3'
                try:
                    if not yol.exists() and indirme:
                        ses_indir(uygun[0], yol)
                        time.sleep(1)
                    if yol.exists():
                        kayit['ses'] = uygun[0]
                except Exception as e:
                    print('ses HATA', sid, e)
            if portreler.get(q) and sid not in PORTRE_DEGIL:
                dosya = sorted(portreler[q])[0]
                yol = PORTRE / f'{sid}.jpg'
                try:
                    if not yol.exists() and indirme:
                        portre_indir(dosya, yol)
                        time.sleep(1)
                    if yol.exists():
                        kayit['portre'] = dosya
                except Exception as e:
                    print('portre HATA', sid, e)
            kunye[sid] = kayit
    (KOK / 'data' / 'kunye.json').write_text(json.dumps({'surum': 1, 'kunye': dict(sorted(kunye.items()))}, ensure_ascii=False, indent=1) + '\n')
    print(len(kunye), 'sanatçı ·', sum(1 for k in kunye.values() if k['ses']), 'ses kaydı ·', sum(1 for k in kunye.values() if k['dil']), 'dilli ·', sum(1 for k in kunye.values() if k['portre']), 'portre')


if __name__ == '__main__':
    main()
