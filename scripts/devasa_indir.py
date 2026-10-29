#!/usr/bin/env python3
"""Uygulamadaki eserlerin en büyük kopyalarını indirir (İş 58): uzun kenar en çok 4096 px, en yüksek kalite.

gorseller/b'deki 1280 px kopyaların özgün kaynaklarından (Wikimedia Commons, müzelerin CC0 açık erişim görselleri)
iner. 4096 px üst sınır iPhone'dan: daha büyük görseli Safari açamaz ya da belleği yetmez.

Müzelerin en büyük boyutları (İş 58c; adresler denenerek doğrulandı):
  The Met       /web-large/ yerine /original/ (özgün tarama, ör. 2697×3542)
  Cleveland     açık erişim API'sinin verdiği print (JPEG, ~3400 px) ya da yeterince büyük değilse full (TIFF, özgün)
  NGA           IIIF !4096,4096 (sunucunun üst sınırı 4096)
  AIC           IIIF !4096,4096 → 3000 → 1686 → 843 (müze büyük boyutu her eserde vermeyebilir)
Commons'taki özgünü küçük olan eserlerde aynı eserin müze kopyası da aranır: Wikidata'da eserin kendi kaydındaki müze
numarası (The Met P3634, AIC P4610, NGA P4683, Cleveland envanter numarası P217 + koleksiyon) ile, yalnız müzenin
kamu malı / CC0 dediği görseller. Tahmin yok: numara eşleşmezse ya da görselin en/boy oranı uygulamadakinden farklıysa
(başka görünüş, ayrıntı) alınmaz. Hangisi büyükse o kalır.

Engellenmemek için (İş 58b) temkinli: istekler arası en az 4 sn + rastgele 0–2 sn; saatte en çok 500 istek; engel (429)
gelince Retry-After'a uyulur, üst üste ret geldikçe bekleme katlanır (1 dk → … en çok 30 dk) ve bir süre yavaş kalınır.
Commons'ta doğrudan upload.wikimedia.org'un önbellekte hazır tuttuğu 3840 px küçük resim istenir; özgün daha küçükse
özgün dosya.

Çıktı: gorseller_devasa/<ad>.jpg ve gorseller_devasa/kaynaklar.json (müzeden gelenler; scripts/r2_yukle.py okur).
Ara bilgiler gorseller_devasa/.bilgi/ altında saklanır, yeniden sorulmaz. Klasör depoya girmez.

Çalıştır (depo kökünde, macOS; küçültme için hazır gelen `sips`):
  caffeinate -i python3 scripts/devasa_indir.py            # bitene dek (birkaç saat)
  caffeinate -i python3 scripts/devasa_indir.py --saat 3   # en çok 3 saat, sonra kendiliğinden durur
Yarıda kalırsa yeniden çalıştır: inmiş dosyalar atlanır.
"""
import csv
import hashlib
import io
import json
import math
import random
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import deque
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
HEDEF = KOK / 'gorseller_devasa'
BILGI = HEDEF / '.bilgi'
UA = 'SanatAtlasi/1.0 (personal study app; emreyaman0585@gmail.com)'
EN_BUYUK = 4096
COMMONS_BOY = 3840  # Wikimedia'nın standart küçük resim adımlarından biri: önbellekte hazır, daha az engel
YETERLI = 3700  # Commons'taki bundan büyükse müze kopyası aranmaz
KALITE = '92'
EN_AZ_BEKLE = 4.0  # istekler arası (sn)
SAATTE_EN_COK = 500
EN_UZUN_BEKLE = 1800  # engel sonrası en uzun bekleme (sn)
EN_COK_DENEME = 12
ORAN_PAYI = 0.08  # müze kopyasının en/boy oranı uygulamadakinden en çok %8 farklı olabilir
NGA_TABLO = 'https://github.com/NationalGalleryOfArt/opendata/raw/main/data/published_images.csv'
CLEVELAND = 'Cleveland Museum of Art'

durum = {'ret': 0, 'yavas': 0.0}
son_istekler = deque()


def nazik_bekle():
    # istekler arası bekleme (engel sonrası bir süre daha uzun) ve saatlik sınır
    time.sleep(EN_AZ_BEKLE + durum['yavas'] + random.uniform(0, 2))
    simdi = time.time()
    while son_istekler and simdi - son_istekler[0] > 3600:
        son_istekler.popleft()
    if len(son_istekler) >= SAATTE_EN_COK:
        sure = 3600 - (simdi - son_istekler[0]) + 5
        print(f'   saatlik sınır ({SAATTE_EN_COK} istek) doldu · {sure / 60:.0f} dk bekleniyor', flush=True)
        time.sleep(sure)
    son_istekler.append(time.time())


def getir(url, zaman=120):
    """İçerik ya da None (dosya yok / bu boyut yok). Engel ve sunucu hatasında bekler, yeniden dener."""
    for _ in range(EN_COK_DENEME):
        nazik_bekle()
        try:
            url = urllib.parse.quote(url, safe=":/?&=%!,~+;@$'()*")  # müze adreslerinde boşluk olabiliyor
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'Api-User-Agent': UA, 'AIC-User-Agent': UA})
            with urllib.request.urlopen(req, timeout=zaman) as y:
                veri = y.read()
            durum['ret'] = 0
            durum['yavas'] = max(0.0, durum['yavas'] - 0.25)  # başarılarla yavaş yavaş eski hıza
            return veri
        except urllib.error.HTTPError as e:
            if e.code in (400, 404, 410) or (e.code == 403 and 'wikimedia' not in url):
                return None  # bu boyut ya da dosya yok; beklemek işe yaramaz
            neden, ra = str(e.code), e.headers.get('Retry-After') if e.headers else None
        except Exception as e:  # noqa: BLE001  ağ kopması, zaman aşımı
            neden, ra = type(e).__name__, None
        durum['ret'] += 1
        durum['yavas'] = min(20.0, durum['yavas'] + 4)
        try:
            ra = int(ra) if ra else 0
        except ValueError:
            ra = 0
        sure = min(EN_UZUN_BEKLE, max(ra, 60 * 2 ** min(durum['ret'] - 1, 5)))
        print(f'   {neden} (üst üste {durum["ret"]}. ret) · {sure // 60} dk {sure % 60} sn bekleniyor', flush=True)
        time.sleep(sure)
    return None


def json_getir(url):
    veri = getir(url, 60)
    try:
        return json.loads(veri) if veri else None
    except ValueError:
        return None


def sakli(ad, uret):
    # ara bilgiyi bir kez üretir, sonra diskten okur (yarıda kalırsa kaldığı yerden: uret sozluk'ü günceller)
    yol = BILGI / f'{ad}.json'
    sozluk = json.loads(yol.read_text()) if yol.exists() else {}
    uret(sozluk, lambda: yol.write_text(json.dumps(sozluk, ensure_ascii=False)))
    yol.write_text(json.dumps(sozluk, ensure_ascii=False))
    return sozluk


# --- Commons -------------------------------------------------------------------------------------------------------

def commons_adresleri(dosya, boy=None):
    """[(adres, beklenen uzun kenar)] — boy (özgünün [g, y]) biliniyorsa yalnız doğru olanı."""
    d = dosya.replace(' ', '_')
    h = hashlib.md5(d.encode()).hexdigest()
    yol, q = f'{h[0]}/{h[:2]}', urllib.parse.quote(d)
    uz = d.rsplit('.', 1)[-1].lower()
    ek = '.jpg' if uz in ('tif', 'tiff') else ('.png' if uz == 'svg' else '')
    on = 'lossy-page1-' if uz in ('tif', 'tiff') else ''
    kucuk = f'https://upload.wikimedia.org/wikipedia/commons/thumb/{yol}/{q}/{on}{COMMONS_BOY}px-{q}{ek}'
    ozgun = f'https://upload.wikimedia.org/wikipedia/commons/{yol}/{q}'
    if not boy:
        return [(kucuk, None), (ozgun, None)]  # özgün 3840'tan darsa küçük resmi üretilmez
    g, y = boy
    if uz == 'svg' or g > COMMONS_BOY:
        return [(kucuk, round(max(COMMONS_BOY, COMMONS_BOY * y / g)) if uz != 'svg' else EN_BUYUK)]
    return [(ozgun, max(g, y))]


def commons_boylari(dosyalar):
    def uret(s, kaydet):
        eksik = [d for d in dosyalar if d not in s]
        if eksik:
            print(f'Commons: {len(eksik)} görselin özgün boyu soruluyor ({math.ceil(len(eksik) / 50)} istek)', flush=True)
        for i in range(0, len(eksik), 50):
            grup = eksik[i:i + 50]
            j = json_getir('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode({
                'action': 'query', 'format': 'json', 'prop': 'imageinfo', 'iiprop': 'size', 'redirects': 1,
                'titles': '|'.join('File:' + d for d in grup)}))
            if not j:
                continue
            q = j.get('query', {})
            ad = {}
            for n in q.get('normalized', []) + q.get('redirects', []):
                ad[n['to']] = ad.get(n['from'], n['from'])
            for p in q.get('pages', {}).values():
                ii = (p.get('imageinfo') or [{}])[0]
                kaynak = ad.get(p['title'], p['title'])
                kaynak = ad.get(kaynak, kaynak)
                d = kaynak.split(':', 1)[-1]
                for x in grup:
                    if x == d or x.replace('_', ' ') == d:
                        s[x] = [ii['width'], ii['height']] if ii.get('width') else None
            for x in grup:
                s.setdefault(x, None)
            kaydet()
    return sakli('commons_boy', uret)


# --- Wikidata: eserin müze numaraları -------------------------------------------------------------------------------

def wikidata_numaralari(qidler):
    """{qid: {'met': id, 'aic': id, 'nga': id, 'cma': envanter}} — yalnız eserin kendi kaydından."""
    def uret(s, kaydet):
        eksik = [q for q in qidler if q not in s]
        if eksik:
            print(f'Wikidata: {len(eksik)} eserin müze numaraları soruluyor ({math.ceil(len(eksik) / 50)} istek)', flush=True)
        ham = {}
        for i in range(0, len(eksik), 50):
            j = json_getir('https://www.wikidata.org/w/api.php?' + urllib.parse.urlencode({
                'action': 'wbgetentities', 'ids': '|'.join(eksik[i:i + 50]), 'props': 'claims', 'format': 'json'}))
            for q, ent in ((j or {}).get('entities') or {}).items():
                ham[q] = ent.get('claims') or {}
        # Cleveland envanter numarası: koleksiyonu adından doğrula (kimlik ezbere yazılmaz)
        koleksiyonlar = {
            (n.get('qualifiers') or {}).get('P195', [{}])[0].get('datavalue', {}).get('value', {}).get('id')
            for c in ham.values() for n in c.get('P217', [])
        } - {None}
        cleveland = set()
        kol = sorted(koleksiyonlar)
        for i in range(0, len(kol), 50):
            j = json_getir('https://www.wikidata.org/w/api.php?' + urllib.parse.urlencode({
                'action': 'wbgetentities', 'ids': '|'.join(kol[i:i + 50]), 'props': 'labels', 'languages': 'en', 'format': 'json'}))
            for q, ent in ((j or {}).get('entities') or {}).items():
                if ent.get('labels', {}).get('en', {}).get('value') == CLEVELAND:
                    cleveland.add(q)

        def deger(c, p):
            for n in c.get(p, []):
                v = n.get('mainsnak', {}).get('datavalue', {}).get('value')
                if isinstance(v, str) and v.strip():
                    return v.strip()
            return None

        for q, c in ham.items():
            r = {k: deger(c, p) for k, p in (('met', 'P3634'), ('aic', 'P4610'), ('nga', 'P4683'))}
            for n in c.get('P217', []):
                kol_q = (n.get('qualifiers') or {}).get('P195', [{}])[0].get('datavalue', {}).get('value', {}).get('id')
                v = n.get('mainsnak', {}).get('datavalue', {}).get('value')
                if kol_q in cleveland and isinstance(v, str):
                    r['cma'] = v.strip()
            s[q] = {k: v for k, v in r.items() if v}
        kaydet()
    return sakli('wikidata', uret)


# --- Müzeler --------------------------------------------------------------------------------------------------------

def met_aday(no):
    j = json_getir(f'https://collectionapi.metmuseum.org/public/collection/v1/objects/{urllib.parse.quote(str(no))}')
    if not j or j.get('isPublicDomain') is not True or not j.get('primaryImage'):
        return []
    return [{'u': j['primaryImage'], 'boy': None}]


def aic_aday(no=None, kimlik=None):
    boy = None
    if no is not None:
        j = json_getir(f'https://api.artic.edu/api/v1/artworks/{urllib.parse.quote(str(no))}?fields=id,image_id,is_public_domain,thumbnail')
        d = (j or {}).get('data') or {}
        if d.get('is_public_domain') is not True or not d.get('image_id'):
            return []
        kimlik = d['image_id']
        t = d.get('thumbnail') or {}
        if t.get('width') and t.get('height'):
            boy = max(t['width'], t['height'])
    taban = f'https://www.artic.edu/iiif/2/{kimlik}/full'
    return [{'u': f'{taban}/!{EN_BUYUK},{EN_BUYUK}/0/default.jpg', 'boy': min(EN_BUYUK, boy) if boy else EN_BUYUK}] + [
        {'u': f'{taban}/{b},/0/default.jpg', 'boy': b} for b in (3000, 1686, 843) if not boy or b < boy]


def cma_aday(envanter):
    j = json_getir(f'https://openaccess-api.clevelandart.org/api/artworks/{urllib.parse.quote(envanter)}?fields=accession_number,share_license_status,images')
    d = (j or {}).get('data') or {}
    if d.get('share_license_status') != 'CC0' or str(d.get('accession_number')) != envanter:
        return []
    adaylar = []
    for tur in ('print', 'full', 'web'):  # aynı boyda olursa JPEG önce (TIFF çok büyük)
        im = (d.get('images') or {}).get(tur) or {}
        try:
            adaylar.append({'u': im['url'], 'boy': max(int(im['width']), int(im['height']))})
        except (KeyError, TypeError, ValueError):
            pass
    return adaylar


def nga_tablosu():
    yol = BILGI / 'nga_gorseller.csv'
    if not yol.exists():
        print('NGA açık veri tablosu indiriliyor (~90 MB, bir kez)', flush=True)
        veri = getir(NGA_TABLO, 600)
        if not veri:
            return {}
        yol.write_bytes(veri)
    tablo = {}
    for r in csv.DictReader(io.StringIO(yol.read_text(encoding='utf-8'))):
        if r.get('openaccess') == '1' and r.get('viewtype') == 'primary' and r.get('iiifurl'):
            onceki = tablo.get(r['depictstmsobjectid'])
            if not onceki or int(r.get('sequence') or 0) < onceki[2]:
                tablo[r['depictstmsobjectid']] = (r['iiifurl'], max(int(r['width'] or 0), int(r['height'] or 0)), int(r.get('sequence') or 0))
    return tablo


def nga_aday(iiif, boy=None):
    return [{'u': f'{iiif}/full/!{EN_BUYUK},{EN_BUYUK}/0/default.jpg', 'boy': min(EN_BUYUK, boy) if boy else EN_BUYUK},
            {'u': f'{iiif}/full/!2048,2048/0/default.jpg', 'boy': 2048}]


def kendi_adaylari(g, commons_boy):
    """Kaydın kendi kaynağının adresleri [{u, boy}]; boy: beklenen uzun kenar (bilinmiyorsa None)."""
    k = g['k']
    if k == 'commons':
        return [{'u': u, 'boy': b} for u, b in commons_adresleri(g['d'], commons_boy.get(g['d']))]
    if k == 'aic':
        return aic_aday(kimlik=g['i'])
    if k == 'nga':
        return nga_aday(g['i'])
    if k == 'met' and g.get('u'):
        u = g['u']
        return [{'u': u.replace('/web-large/', '/original/'), 'boy': None}] + ([{'u': u, 'boy': 1000}] if '/web-large/' in u else [])
    if k == 'cma' and g.get('u'):
        m = re.search(r'clevelandart\.org/([^/]+)/', g['u'])
        return (cma_aday(urllib.parse.unquote(m.group(1))) if m else []) or [{'u': g['u'], 'boy': None}]
    return []


def muze_adaylari(numaralar, nga):
    adaylar = []
    if numaralar.get('met'):
        adaylar += [dict(a, k='met') for a in met_aday(numaralar['met'])]
    if numaralar.get('aic'):
        adaylar += [dict(a, k='aic') for a in aic_aday(no=numaralar['aic'])]
    if numaralar.get('nga') and numaralar['nga'] in nga:
        iiif, boy, _ = nga[numaralar['nga']]
        adaylar += [dict(a, k='nga') for a in nga_aday(iiif, boy)]
    if numaralar.get('cma'):
        adaylar += [dict(a, k='cma') for a in cma_aday(numaralar['cma'])]
    return adaylar


# --- İndirme --------------------------------------------------------------------------------------------------------

def boyut(yol):
    r = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(yol)], capture_output=True, text=True)
    s = dict(re.findall(r'pixel(Width|Height):\s*(\d+)', r.stdout))
    return (int(s['Width']), int(s['Height'])) if len(s) == 2 else None


def indir(aday, cikti):
    """Adresi indirir; 4096'dan büyükse küçültür, asla büyütmez. (genişlik, yükseklik) ya da None.
    `sips -Z` küçük görseli de büyütür (İş 58d): önce özgün boy okunur. JPEG zaten sınırdaysa baytlarına dokunulmaz
    (yeniden sıkıştırma da kalite kaybı)."""
    veri = getir(aday['u'], 600)
    if not veri:
        return None
    ham = cikti.with_suffix('.ham')
    ham.write_bytes(veri)
    ozgun = boyut(ham)
    if not ozgun:
        ham.unlink(missing_ok=True)
        return None
    if max(ozgun) <= EN_BUYUK and veri[:2] == b'\xff\xd8':
        ham.replace(cikti)
        return ozgun
    komut = ['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', KALITE]
    if max(ozgun) > EN_BUYUK:
        komut += ['-Z', str(EN_BUYUK)]
    r = subprocess.run(komut + [str(ham), '--out', str(cikti)], capture_output=True)
    ham.unlink(missing_ok=True)
    b = boyut(cikti) if not r.returncode and cikti.exists() else None
    if not b or max(b) > max(ozgun):
        cikti.unlink(missing_ok=True)
        return None
    return b


def oran_uyar(b, oran):
    return not oran or abs(math.log((b[0] / b[1]) / oran)) <= ORAN_PAYI


def main():
    if subprocess.run(['which', 'sips'], capture_output=True).returncode:
        sys.exit('sips bulunamadı (macOS gerekir).')
    bitis = time.time() + float(sys.argv[sys.argv.index('--saat') + 1]) * 3600 if '--saat' in sys.argv else None
    BILGI.mkdir(parents=True, exist_ok=True)
    for p in list(HEDEF.glob('*.aday')) + list(HEDEF.glob('*.ham')):
        p.unlink()  # yarıda kalmış indirmeler
    harita = json.loads((KOK / 'data/yerel_gorseller.json').read_text())['gorseller']
    oranlar = json.loads((KOK / 'data/gorsel_oranlari.json').read_text())['oranlar']
    kaynaklar_yolu = HEDEF / 'kaynaklar.json'
    kaynaklar = json.loads(kaynaklar_yolu.read_text()) if kaynaklar_yolu.exists() else {}
    # anahtar "kaynak:kimlik" → (görsel kaydı, eserin Wikidata kimliği)
    gorseller = {}
    for v in json.loads((KOK / 'data/eserler_onbellek.json').read_text())['sanatcilar'].values():
        for e in v['eserler']:
            for g in e.get('gorseller') or []:
                gorseller[f"{g['k']}:{g.get('d') or g.get('i') or g.get('u') or ''}"] = (g, e.get('qid'))
    isler = [(a, ad) for a, ad in harita.items() if a in gorseller and gorseller[a][0]['k'] in ('commons', 'met', 'aic', 'nga', 'cma')]
    # İş 58d: önceki sürüm (sips -Z) 4096'dan küçük özgünleri 4096'ya büyütmüştü. Bir kez: yalnız özgünü 4096 ve üstü
    # olduğu bilinen Commons kopyaları kalır, gerisi silinip yeniden iner (müzeden gelenler dahil; karşılaştırma bozuktu).
    isaret = BILGI / 'buyutme_duzeltildi'
    if not isaret.exists():
        var = [(a, ad) for a, ad in isler if (HEDEF / f'{ad}.jpg').exists()]
        if var:
            cb = commons_boylari(sorted({gorseller[a][0]['d'] for a, _ in var if gorseller[a][0]['k'] == 'commons'}))

            def dogru(a, ad):
                g = gorseller[a][0]
                if g['k'] != 'commons' or ad in kaynaklar:
                    return False
                (_, beklenen), = commons_adresleri(g['d'], cb.get(g['d'])) if cb.get(g['d']) else [(None, None)]
                return bool(beklenen) and beklenen >= EN_BUYUK

            sil = [ad for a, ad in var if not dogru(a, ad)]
            for ad in sil:
                (HEDEF / f'{ad}.jpg').unlink(missing_ok=True)
                kaynaklar.pop(ad, None)
            kaynaklar_yolu.write_text(json.dumps(kaynaklar, ensure_ascii=False, sort_keys=True))
            print(f'Düzeltme: büyütülmüş olabilecek {len(sil)} kopya silindi, özgün boyunda yeniden inecek', flush=True)
        isaret.write_text('1')
    kalan = [(a, ad) for a, ad in isler if not (HEDEF / f'{ad}.jpg').exists()]
    print(f'{len(isler)} görsel · {len(isler) - len(kalan)} zaten inmiş · {len(kalan)} inecek', flush=True)
    if not kalan:
        return

    # 1) Commons özgün boyları  2) küçük kalanların müze numaraları  3) NGA tablosu (gerekirse)
    commons_boy = commons_boylari(sorted({gorseller[a][0]['d'] for a, _ in kalan if gorseller[a][0]['k'] == 'commons'}))
    kucukler = {gorseller[a][1] for a, _ in kalan if gorseller[a][0]['k'] == 'commons' and gorseller[a][1]
                and (lambda b: not b or max(b) < YETERLI)(commons_boy.get(gorseller[a][0]['d']))}
    numaralar = wikidata_numaralari(sorted(kucukler))
    nga = nga_tablosu() if any(n.get('nga') for n in numaralar.values()) else {}
    muzeli = sum(1 for q in kucukler if numaralar.get(q))
    print(f'Commons\'ta küçük kalan {len(kucukler)} eserin {muzeli} tanesinin müze numarası var', flush=True)

    basarisiz = 0
    for n, (a, ad) in enumerate(kalan, 1):
        if bitis and time.time() > bitis:
            print('\nSüre doldu; kaldığın yerden devam etmek için aynı komutu yeniden çalıştır.')
            break
        g, qid = gorseller[a]
        cikti = HEDEF / f'{ad}.jpg'
        oran = oranlar.get(ad)
        kendi = [dict(x, k=g['k'], kendi=True) for x in kendi_adaylari(g, commons_boy)]
        kendi_boy = max([x['boy'] or 0 for x in kendi] or [0])
        muze = muze_adaylari(numaralar.get(qid) or {}, nga) if g['k'] == 'commons' and qid in kucukler else []
        # beklenen boya göre büyükten küçüğe (bilinmeyen: The Met özgünü genelde 3000 px üstü); eşitse kendi kaynağı önce
        adaylar = sorted(kendi + muze, key=lambda x: -(min(EN_BUYUK, x['boy']) if x['boy'] else 3000) - (0.5 if x.get('kendi') else 0))
        en_iyi, en_iyi_k = None, None
        gecici = HEDEF / f'{ad}.aday'
        reddedilen = set()
        for x in adaylar:
            if x['k'] in reddedilen:
                continue
            beklenen = min(EN_BUYUK, x['boy']) if x['boy'] else None
            if en_iyi and (max(en_iyi) >= EN_BUYUK or (beklenen and beklenen <= max(en_iyi) * 1.05) or (not beklenen and x['k'] == en_iyi_k)):
                continue  # elimizdekinden büyük olmayacak (aynı kaynağın küçük yedekleri dahil)
            b = indir(x, gecici)
            if not b:
                continue
            if not x.get('kendi') and not oran_uyar(b, oran):
                print(f'   {ad}: {x["k"]} görselinin oranı farklı ({b[0]}×{b[1]}), alınmadı', flush=True)
                gecici.unlink(missing_ok=True)
                reddedilen.add(x['k'])
                continue
            if not en_iyi or max(b) > max(en_iyi):
                gecici.replace(cikti)
                en_iyi, en_iyi_k = b, x['k']
            else:
                gecici.unlink(missing_ok=True)
        if not en_iyi:
            basarisiz += 1
            continue
        if en_iyi_k != g['k']:
            kaynaklar[ad] = en_iyi_k
            print(f'   {ad}: {en_iyi_k} kopyası daha büyük ({max(en_iyi)} px, Commons {kendi_boy or "?"} px)', flush=True)
        else:
            kaynaklar.pop(ad, None)
        kaynaklar_yolu.write_text(json.dumps(kaynaklar, ensure_ascii=False, sort_keys=True))
        if n % 25 == 0:
            gb = sum(p.stat().st_size for p in HEDEF.glob('*.jpg')) / 1e9
            print(f'{n}/{len(kalan)} · {gb:.2f} GB · başarısız {basarisiz}', flush=True)
    gb = sum(p.stat().st_size for p in HEDEF.glob('*.jpg')) / 1e9
    print(f'\n{len(list(HEDEF.glob("*.jpg")))}/{len(isler)} görsel · {gb:.2f} GB · müzeden {len(kaynaklar)} · bu tur başarısız {basarisiz} (yeniden çalıştırınca tekrar denenir)')


if __name__ == '__main__':
    main()
