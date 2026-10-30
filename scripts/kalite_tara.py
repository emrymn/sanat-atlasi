#!/usr/bin/env python3
"""Zayıf görseller için Wikimedia Commons'ta aynı eserin daha büyük dosyasını arar (İş 84).

Uygulamadaki 1731 görselin 622'sinin en büyük kopyası 2500 px'in altındaydı: Wikidata'nın eser kaydındaki (P18) ya da
kursun verdiği dosya küçük. Aynı eserin Commons'ta çoğu zaman daha büyük taramaları var (ör. Google Art Project
yüklemeleri). Bu betik yalnız keşfeder, indirmez: sonucu data/gorsel_iyilestirme.json'a yazar; scripts/devasa_indir.py
oradaki dosyaları indirir, scripts/r2_yukle.py yeni adla (sürüm ekiyle) yükler, telefon yenisini indirir.

Doğruluk (CLAUDE.md "Accuracy rule"): eser ve sanatçı değişmez, yalnız aynı eserin başka bir fotoğrafı seçilir. Adaylar
yalnız eserin kendi Wikidata kaydından gelir (P18 görseli ve P373 Commons kategorisi). Bir aday ancak şu üçü tutarsa
alınır: (1) en/boy oranı uygulamadaki görselinkinden en çok %5 farklı (ayrıntı, çerçeveli fotoğraf, salon görünüşü
elenir), (2) uzun kenarı elimizdekinden en az %25 ve en az 2000 px, (3) küçük hâli bizim görselimizle görsel olarak
örtüşüyor (fark karması, 64 bitte en çok 12 bit farklı: başka bir kopya ya da başka bir eser elenir).

Çalıştır (depo kökünde, macOS; görsel karşılaştırma için hazır gelen `sips`):
  python3 scripts/kalite_tara.py              # hepsi (yarım saat kadar)
  python3 scripts/kalite_tara.py --dene 10    # yalnız ilk 10 zayıf görsel (önce böyle denemek iyi olur)
Sonra:
  caffeinate -i python3 scripts/devasa_indir.py
  python3 scripts/r2_yukle.py
  git add data/gorsel_iyilestirme.json data/gorsel_kaynagi.json && git commit -m "Daha büyük görseller" && git push
Yarıda kalırsa yeniden çalıştır: sorulan bilgiler gorseller_devasa/.bilgi/ altında saklanır, yeniden sorulmaz.
"""
import hashlib
import json
import re
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
HEDEF = KOK / 'gorseller_devasa'
BILGI = HEDEF / '.bilgi'
CIKTI = KOK / 'data/gorsel_iyilestirme.json'
UA = 'SanatAtlasi/1.0 (personal study app; emreyaman0585@gmail.com)'
ZAYIF = 3000  # bundan küçük en büyük kopyası olanlar aranır
EN_AZ = 2000  # aday en az bu kadar
KAT = 1.25  # ve elimizdekinden en az bu kat büyük
ORAN_PAYI = 0.05
EN_COK_FARK = 12  # fark karması (64 bit)
KUCUK = 120  # karşılaştırma için Wikimedia küçük resmi (standart boy)
ARA = 1.0  # istekler arası en az (sn)
UZANTILAR = ('jpg', 'jpeg', 'png', 'tif', 'tiff')

_son = [0.0]


def getir(url, ikili=False):
    """Nazik GET: istekler arası en az ARA sn; 429'da Retry-After kadar (en az 30 sn) bekler. Bulunamazsa None."""
    for deneme in range(6):
        bekle = ARA - (time.time() - _son[0])
        if bekle > 0:
            time.sleep(bekle)
        _son[0] = time.time()
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60) as r:
                b = r.read()
            return b if ikili else b.decode('utf-8', 'replace')
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            if e.code in (429, 503):
                ra = e.headers.get('Retry-After') or ''
                time.sleep(max(30, int(ra) if ra.isdigit() else 0) * (deneme + 1))
                continue
            time.sleep(5)
        except (urllib.error.URLError, TimeoutError, OSError):
            time.sleep(5)
    return None


def api(parametreler):
    t = getir('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(dict(parametreler, format='json')))
    try:
        return json.loads(t) if t else {}
    except ValueError:
        return {}


def sakli(ad):
    yol = BILGI / f'{ad}.json'
    return yol, (json.loads(yol.read_text()) if yol.exists() else {})


# --- görsel karşılaştırma (fark karması) ----------------------------------------------------------------------------

def bmp_gri(veri):
    """24/32 bit sıkıştırmasız BMP → satır satır gri değerler (üstten alta)."""
    off = int.from_bytes(veri[10:14], 'little')
    g = int.from_bytes(veri[18:22], 'little', signed=True)
    y = int.from_bytes(veri[22:26], 'little', signed=True)
    bpp = int.from_bytes(veri[28:30], 'little')
    if bpp not in (24, 32):
        raise ValueError(f'BMP {bpp} bit')
    adim = bpp // 8
    satir = ((g * bpp + 31) // 32) * 4
    satirlar = []
    for j in range(abs(y)):
        s = veri[off + j * satir: off + j * satir + g * adim]
        satirlar.append([(s[i * adim + 2] * 299 + s[i * adim + 1] * 587 + s[i * adim] * 114) // 1000 for i in range(g)])
    if y > 0:
        satirlar.reverse()  # BMP alttan üste yazılır
    return satirlar


def karma(satirlar):
    """9×8 gri → 64 bitlik fark karması (her satırda soldaki sağdakinden parlak mı)."""
    k = 0
    for j, s in enumerate(satirlar[:8]):
        for i in range(8):
            if s[i] > s[i + 1]:
                k |= 1 << (j * 8 + i)
    return k


def fark(a, b):
    return bin(a ^ b).count('1')


def dosya_karmasi(yol):
    """Görsel dosyasının fark karması: macOS'ta sips ile 9×8 BMP'ye küçültülür (PIL varsa o da olur)."""
    try:
        from PIL import Image  # noqa: PLC0415 — Mac'te genelde yok; varsa kullanılır
        with Image.open(yol) as im:
            g = im.convert('L').resize((9, 8), Image.LANCZOS)
            p = list(g.getdata())
        return karma([p[j * 9:(j + 1) * 9] for j in range(8)])
    except ImportError:
        pass
    with tempfile.TemporaryDirectory() as t:
        bmp = Path(t) / 'k.bmp'
        r = subprocess.run(['sips', '-s', 'format', 'bmp', '-z', '8', '9', str(yol), '--out', str(bmp)], capture_output=True)
        if r.returncode or not bmp.exists():
            raise ValueError('sips küçültemedi')
        return karma(bmp_gri(bmp.read_bytes()))


def veri_karmasi(veri):
    with tempfile.TemporaryDirectory() as t:
        p = Path(t) / 'g.jpg'
        p.write_bytes(veri)
        return dosya_karmasi(p)


# --- aday seçimi ----------------------------------------------------------------------------------------------------

def norm(d):
    return d.replace(' ', '_')


def uygun_adaylar(adaylar, oran, mevcut):
    """adaylar: {dosya: [g, y, küçük_url]} → büyükten küçüğe [(uzun, dosya, g, y, küçük_url)] (oran ve boy süzgeci)."""
    l = []
    for d, (g, y, kucuk) in adaylar.items():
        if not g or not y or d.rsplit('.', 1)[-1].lower() not in UZANTILAR:
            continue
        if oran and abs((g / y) / oran - 1) > ORAN_PAYI:
            continue
        if max(g, y) < max(EN_AZ, mevcut * KAT):
            continue
        l.append((max(g, y), d, g, y, kucuk))
    return sorted(l, reverse=True)


def mevcut_boy(ad):
    """Elimizdeki en büyük kopyanın uzun kenarı (gorseller_devasa; yoksa 1280'lik kopya)."""
    for yol in (HEDEF / f'{ad}.jpg', KOK / f'gorseller/b/{ad}.jpg'):
        if yol.exists():
            r = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(yol)], capture_output=True, text=True)
            s = [int(x) for x in re.findall(r'pixel(?:Width|Height):\s*(\d+)', r.stdout)]
            if len(s) == 2:
                return max(s)
    return 0


def wikidata(qidler, bellek, kaydet):
    eksik = [q for q in qidler if q not in bellek]
    for i in range(0, len(eksik), 50):
        grup = eksik[i:i + 50]
        t = getir('https://www.wikidata.org/w/api.php?' + urllib.parse.urlencode(
            {'action': 'wbgetentities', 'ids': '|'.join(grup), 'props': 'claims', 'format': 'json'}))
        try:
            varliklar = json.loads(t).get('entities', {}) if t else {}
        except ValueError:
            varliklar = {}
        for q in grup:
            c = (varliklar.get(q) or {}).get('claims', {})
            deger = lambda p: [x['mainsnak']['datavalue']['value'] for x in c.get(p, []) if x.get('mainsnak', {}).get('datavalue')]  # noqa: E731
            bellek[q] = {'p18': deger('P18'), 'p373': deger('P373')} if q in varliklar else None
        kaydet()
        print(f'Wikidata: {min(i + 50, len(eksik))}/{len(eksik)}', flush=True)


def dosya_bilgileri(dosyalar, bellek, kaydet):
    eksik = [d for d in dict.fromkeys(dosyalar) if d not in bellek]
    for i in range(0, len(eksik), 50):
        grup = eksik[i:i + 50]
        j = api({'action': 'query', 'prop': 'imageinfo', 'iiprop': 'size|url', 'iiurlwidth': KUCUK, 'redirects': 1,
                 'titles': '|'.join('File:' + d for d in grup)})
        q = j.get('query', {})
        kaynak = {}
        for n in q.get('normalized', []) + q.get('redirects', []):
            kaynak[n['to']] = kaynak.get(n['from'], n['from'])
        bilgi = {}
        for p in q.get('pages', {}).values():
            ii = (p.get('imageinfo') or [{}])[0]
            t = kaynak.get(p['title'], p['title'])
            bilgi[norm(kaynak.get(t, t).split(':', 1)[-1])] = [ii.get('width'), ii.get('height'), ii.get('thumburl')]
        for d in grup:
            bellek[d] = bilgi.get(norm(d))
        kaydet()


def kategori(ad, bellek, kaydet):
    if ad not in bellek:
        j = api({'action': 'query', 'generator': 'categorymembers', 'gcmtitle': 'Category:' + ad, 'gcmtype': 'file',
                 'gcmlimit': 200, 'prop': 'imageinfo', 'iiprop': 'size|url', 'iiurlwidth': KUCUK})
        bellek[ad] = {norm(p['title'].split(':', 1)[-1]): [ii.get('width'), ii.get('height'), ii.get('thumburl')]
                      for p in j.get('query', {}).get('pages', {}).values() for ii in (p.get('imageinfo') or [])[:1]}
        kaydet()
    return bellek[ad]


def main():
    if subprocess.run(['which', 'sips'], capture_output=True).returncode:
        sys.exit('sips bulunamadı (macOS gerekir).')
    sinir = int(sys.argv[sys.argv.index('--dene') + 1]) if '--dene' in sys.argv else None
    BILGI.mkdir(parents=True, exist_ok=True)
    harita = json.loads((KOK / 'data/yerel_gorseller.json').read_text())['gorseller']
    oranlar = json.loads((KOK / 'data/gorsel_oranlari.json').read_text())['oranlar']
    eser = {}
    for v in json.loads((KOK / 'data/eserler_onbellek.json').read_text())['sanatcilar'].values():
        for e in v['eserler']:
            for g in (e.get('gorseller') or [])[:1]:
                if g['k'] == 'commons':
                    a = f"commons:{g['d']}"
                    if a in harita and e.get('qid'):
                        eser[harita[a]] = (norm(g['d']), e['qid'], e.get('baslik') or '')
    sonuc = json.loads(CIKTI.read_text())['gorseller'] if CIKTI.exists() else {}
    yol_m, mevcutlar = sakli('kalite_mevcut')
    zayiflar = []
    for ad in sorted(eser):
        if ad not in mevcutlar:
            mevcutlar[ad] = mevcut_boy(ad)
        if mevcutlar[ad] and mevcutlar[ad] < ZAYIF:
            zayiflar.append(ad)
    yol_m.write_text(json.dumps(mevcutlar))
    print(f'{len(eser)} Commons görselinden {len(zayiflar)} tanesinin en büyük kopyası {ZAYIF} px altında', flush=True)
    if sinir:
        zayiflar = zayiflar[:sinir]

    yol_w, wd = sakli('kalite_wikidata')
    wikidata(sorted({eser[ad][1] for ad in zayiflar}), wd, lambda: yol_w.write_text(json.dumps(wd)))
    yol_d, dosyalar = sakli('kalite_dosya')
    gerekli = [eser[ad][0] for ad in zayiflar] + [norm(d) for ad in zayiflar for d in ((wd.get(eser[ad][1]) or {}).get('p18') or [])]
    dosya_bilgileri(gerekli, dosyalar, lambda: yol_d.write_text(json.dumps(dosyalar)))
    yol_k, kategoriler = sakli('kalite_kategori')
    yol_h, karmalar = sakli('kalite_karma')

    bulunan = 0
    for n, ad in enumerate(zayiflar, 1):
        d, qid, baslik = eser[ad]
        mevcut = mevcutlar[ad]
        w = wd.get(qid) or {}
        adaylar = {}
        for k in (w.get('p373') or [])[:2]:
            adaylar.update(kategori(k, kategoriler, lambda: yol_k.write_text(json.dumps(kategoriler))))
        for x in [d] + [norm(p) for p in (w.get('p18') or [])]:
            if dosyalar.get(x):
                adaylar.setdefault(x, dosyalar[x])
        secilen = None
        liste = uygun_adaylar(adaylar, oranlar.get(ad), mevcut)
        if liste:
            try:
                biz = dosya_karmasi(KOK / f'gorseller/k/{ad}.jpg')
            except (OSError, ValueError):
                biz = None
            for uzun, x, g, y, kucuk in liste[:4]:
                if biz is None or not kucuk:
                    break
                if kucuk not in karmalar:
                    veri = getir(kucuk, ikili=True)
                    try:
                        karmalar[kucuk] = veri_karmasi(veri) if veri else None
                    except (OSError, ValueError):
                        karmalar[kucuk] = None
                    yol_h.write_text(json.dumps(karmalar))
                if karmalar[kucuk] is not None and fark(biz, karmalar[kucuk]) <= EN_COK_FARK:
                    secilen = {'dosya': x, 'g': g, 'y': y, 'onceki': mevcut}
                    break
        if secilen:
            sonuc[ad] = secilen
            bulunan += 1
            print(f'  {baslik[:40]:40} {mevcut:>5} → {max(secilen["g"], secilen["y"])} px  {secilen["dosya"][:60]}', flush=True)
        if n % 25 == 0:
            print(f'{n}/{len(zayiflar)} · bulunan {bulunan}', flush=True)
        CIKTI.write_text(json.dumps({'surum': 1, 'gorseller': dict(sorted(sonuc.items()))}, ensure_ascii=False, indent=0) + '\n')
    CIKTI.write_text(json.dumps({'surum': 1, 'gorseller': dict(sorted(sonuc.items()))}, ensure_ascii=False, indent=0) + '\n')
    print(f'\nBitti: {len(zayiflar)} zayıf görselin {bulunan} tanesi için daha büyük dosya bulundu (toplam {len(sonuc)}).')
    print('Sırada: caffeinate -i python3 scripts/devasa_indir.py  →  python3 scripts/r2_yukle.py  →  git add/commit/push')


if __name__ == '__main__':
    main()
