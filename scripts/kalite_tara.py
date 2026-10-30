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
örtüşüyor (fark karması, 64 bitte en çok 12 bit farklı: başka bir kopya ya da başka bir eser elenir) ve renkli
(bizimki renkliyken siyah-beyaz ya da belirgin soluk olan — kitap sayfası, gravür, eski fotoğraf — elenir). Sonunda
inceleme sayfası açılır: bulunanlar elimizdekiyle yan yana; beğenilmeyenler işaretlenip reddedilir (--reddet), bir daha
önerilmez, varsa sıradaki aday denenir.

Çalıştır (depo kökünde, macOS; görsel karşılaştırma için hazır gelen `sips`):
  python3 scripts/kalite_tara.py              # hepsi (yarım saat kadar)
  python3 scripts/kalite_tara.py --dene 10    # yalnız ilk 10 zayıf görsel (önce böyle denemek iyi olur)
  python3 scripts/kalite_tara.py --reddet ad1,ad2   # inceleme sayfasının kopyaladığı komut
  python3 scripts/kalite_tara.py --sayfa            # yalnız inceleme sayfasını yeniden aç (tarama yok)
İnceleme sayfasında hepsi iyiyse:
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

def bmp_rgb(veri):
    """24/32 bit sıkıştırmasız BMP → satır satır (r, g, b) (üstten alta)."""
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
        satirlar.append([(s[i * adim + 2], s[i * adim + 1], s[i * adim]) for i in range(g)])
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


def imza(rgb):
    """9×8 renkli → {'k': fark karması, 'r': renklilik (piksellerde en büyük ve en küçük kanal farkının ortalaması)}.
    Renklilik siyah-beyaz baskıyı (kitap sayfası, gravür, eski fotoğraf) ayırır: karma yalnız açık-koyu desenine bakar."""
    gri = [[(r * 299 + g * 587 + b * 114) // 1000 for r, g, b in s] for s in rgb]
    pikseller = [p for s in rgb for p in s]
    return {'k': karma(gri), 'r': round(sum(max(p) - min(p) for p in pikseller) / max(1, len(pikseller)), 1),
            'v': [c for p in pikseller for c in p]}  # 9×8 renkler (inceleme sayfasındaki karşılaştırma için)


KAMERA = re.compile(r'(^|[_\- ])(IMG|DSC|DSCF|DSCN|PXL|P\d{7}|\d{8}_\d{6})', re.I)


def supheler(biz, aday, dosya):
    """Bulunan görselin elimizdekinden şüpheli farkları: [(neden, ağırlık)]. Ağırlık toplamı 2 ve üstü şüpheli sayılır.
    Karşılaştırma 9×8 küçük hâllerde: parlaklık, renk kayması (parlaklık eşitlenince kalan fark), renklilik, desen."""
    l = []
    if not (biz.get('v') and aday.get('v')):
        return l
    gri = lambda v: [(v[i] * 299 + v[i + 1] * 587 + v[i + 2] * 114) / 1000 for i in range(0, len(v), 3)]  # noqa: E731
    go, ga = gri(biz['v']), gri(aday['v'])
    lo, la = sum(go) / len(go), sum(ga) / len(ga)
    if la < lo - 22:
        l.append(('daha karanlık', 2))
    elif la > lo + 28:
        l.append(('daha açık / soluk', 1))
    olcek = lo / la if la else 1
    sapma = sum(abs(biz['v'][i] - min(255, aday['v'][i] * olcek)) for i in range(len(biz['v']))) / len(biz['v'])
    # kanal dengesi (renk kayması: sarımsı, morumsu): ortalama R−G ve B−G farkının değişimi
    kanal = lambda v, a, b: sum(v[i + a] - v[i + b] for i in range(0, len(v), 3)) / (len(v) / 3)  # noqa: E731
    kayma = abs(kanal(biz['v'], 0, 1) - kanal(aday['v'], 0, 1)) + abs(kanal(biz['v'], 2, 1) - kanal(aday['v'], 2, 1))
    if kayma > 18:
        l.append(('renkleri kaymış (sarımsı/morumsu)', 2))
    elif sapma > 30:
        l.append(('renkleri farklı', 1))
    if biz['r'] >= 18 and aday['r'] < 0.75 * biz['r']:
        l.append(('soluk', 1))
    elif aday['r'] > 1.6 * max(biz['r'], 10):
        l.append(('aşırı doygun', 1))
    f = fark(biz['k'], aday['k'])
    if f > 8:
        l.append((f'kadraj/desen farkı {f}/64', 1))
    if KAMERA.search(dosya):
        l.append(('müzede çekilmiş fotoğraf olabilir (dosya adı)', 1))
    return l


def fark(a, b):
    return bin(a ^ b).count('1')


def renk_uyar(biz, aday):
    """Bizim görselimiz renkliyken aday belirgin soluk/siyah-beyazsa uymaz."""
    return biz['r'] < 18 or aday['r'] >= 0.55 * biz['r']


def dosya_imzasi(yol):
    """Görselin imzası: macOS'ta sips ile 9×8 BMP'ye küçültülür (PIL varsa o da olur)."""
    try:
        from PIL import Image  # noqa: PLC0415 — Mac'te genelde yok; varsa kullanılır
        with Image.open(yol) as im:
            p = list(im.convert('RGB').resize((9, 8), Image.LANCZOS).getdata())
        return imza([p[j * 9:(j + 1) * 9] for j in range(8)])
    except ImportError:
        pass
    with tempfile.TemporaryDirectory() as t:
        bmp = Path(t) / 'k.bmp'
        r = subprocess.run(['sips', '-s', 'format', 'bmp', '-z', '8', '9', str(yol), '--out', str(bmp)], capture_output=True)
        if r.returncode or not bmp.exists():
            raise ValueError('sips küçültemedi')
        return imza(bmp_rgb(bmp.read_bytes()))


def veri_imzasi(veri):
    with tempfile.TemporaryDirectory() as t:
        p = Path(t) / 'g.jpg'
        p.write_bytes(veri)
        return dosya_imzasi(p)


# --- aday seçimi ----------------------------------------------------------------------------------------------------

def norm(d):
    return d.replace(' ', '_')


def uygun_adaylar(adaylar, oran, mevcut, reddedilen=()):
    """adaylar: {dosya: [g, y, küçük_url]} → büyükten küçüğe [(uzun, dosya, g, y, küçük_url)] (oran ve boy süzgeci)."""
    l = []
    for d, (g, y, kucuk) in adaylar.items():
        if d in reddedilen or not g or not y or d.rsplit('.', 1)[-1].lower() not in UZANTILAR:
            continue
        if oran and abs((g / y) / oran - 1) > ORAN_PAYI:
            continue
        if max(g, y) < max(EN_AZ, mevcut * KAT):
            continue
        l.append((max(g, y), d, g, y, kucuk))
    return sorted(l, reverse=True)


def boyutu(yol):
    r = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(yol)], capture_output=True, text=True)
    s = [int(x) for x in re.findall(r'pixel(?:Width|Height):\s*(\d+)', r.stdout)]
    return s if len(s) == 2 else None


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


def commons_yolu(d):
    d = norm(d)
    h = hashlib.md5(d.encode()).hexdigest()
    return f'{h[0]}/{h[:2]}/{urllib.parse.quote(d)}'


def onizleme_url(d, g):
    """İnceleme sayfası için aday: 960 px küçük resim (özgünü daha darsa özgünün kendisi)."""
    yol = commons_yolu(d)
    uz = d.rsplit('.', 1)[-1].lower()
    if g and g > 960:
        on = 'lossy-page1-' if uz in ('tif', 'tiff') else ''
        ek = '.jpg' if uz in ('tif', 'tiff') else ''
        return f'https://upload.wikimedia.org/wikipedia/commons/thumb/{yol}/{on}960px-{yol.rsplit("/", 1)[-1]}{ek}'
    return f'https://upload.wikimedia.org/wikipedia/commons/{yol}'


def kaydet_cikti(sonuc, reddedilen):
    CIKTI.write_text(json.dumps({'surum': 1, 'gorseller': dict(sorted(sonuc.items())),
                                 'reddedilen': {k: sorted(v) for k, v in sorted(reddedilen.items())}}, ensure_ascii=False, indent=0) + '\n')


def oku_cikti():
    j = json.loads(CIKTI.read_text()) if CIKTI.exists() else {}
    return j.get('gorseller', {}), {k: set(v) for k, v in (j.get('reddedilen') or {}).items()}


def reddet(adlar):
    """--reddet ad1,ad2: bulunan dosya bırakılır (bir daha önerilmez); inmişse kopyası silinir, eskisi yeniden iner."""
    sonuc, reddedilen = oku_cikti()
    for ad in adlar:
        iy = sonuc.pop(ad, None)
        if not iy:
            print(f'{ad}: listede yok')
            continue
        reddedilen.setdefault(ad, set()).add(iy['dosya'])
        yol = HEDEF / f'{ad}.jpg'
        # yalnız reddedilen dosyadan inmişse silinir (boyu onunki kadar): eski kaynağından yeniden iner. Henüz inmemişse
        # elimizdeki eski kopyaya dokunulmaz (önceden hepsi siliniyor, boşuna yeniden iniyordu)
        b = boyutu(yol) if yol.exists() else None
        if b and max(b) >= 0.95 * min(4096, max(iy['g'], iy['y'])):
            yol.unlink()
        print(f'{ad}: {iy["dosya"]} reddedildi')
    kaydet_cikti(sonuc, reddedilen)
    print('Yeniden çalıştır: python3 scripts/kalite_tara.py (varsa sıradaki aday denenir, sonra inceleme sayfası açılır)')


def kucuk_url(d):
    yol = commons_yolu(d)
    uz = d.rsplit('.', 1)[-1].lower()
    on = 'lossy-page1-' if uz in ('tif', 'tiff') else ''
    ek = '.jpg' if uz in ('tif', 'tiff') else ''
    return f'https://upload.wikimedia.org/wikipedia/commons/thumb/{yol}/{on}{KUCUK}px-{yol.rsplit("/", 1)[-1]}{ek}'


def degerlendir(sonuc):
    """Her bulunan için şüpheler: elimizdekinin ve adayın 9×8 imzası (adayınki gerekirse yeniden indirilir)."""
    yol_h, imzalar = sakli('kalite_imza')
    sonuc_d = {}
    for n, (ad, iy) in enumerate(sorted(sonuc.items()), 1):
        u = kucuk_url(iy['dosya'])
        if not (imzalar.get(u) or {}).get('v'):
            veri = getir(u, ikili=True)
            try:
                imzalar[u] = veri_imzasi(veri) if veri else None
            except (OSError, ValueError):
                imzalar[u] = None
            yol_h.write_text(json.dumps(imzalar))
        try:
            biz = dosya_imzasi(KOK / f'gorseller/k/{ad}.jpg')
        except (OSError, ValueError):
            biz = None
        sonuc_d[ad] = supheler(biz, imzalar[u], iy['dosya']) if biz and imzalar.get(u) else [('karşılaştırılamadı', 2)]
        if n % 50 == 0:
            print(f'inceleme: {n}/{len(sonuc)}', flush=True)
    return sonuc_d


def inceleme_sayfasi(sonuc, eser):
    """Bulunanları elimizdekiyle yan yana gösteren sayfa. Şüpheliler (karanlık, renk kayması, soluk, müze fotoğrafı…)
    en üstte ve işaretli gelir, nedeni yazar; gözden geçirilip iyi olanların işareti kaldırılır, komut kopyalanır."""
    d = degerlendir(sonuc)
    puan = {ad: sum(a for _, a in d.get(ad, [])) for ad in sonuc}
    sira = sorted(sonuc, key=lambda ad: (-puan[ad], eser.get(ad, ('', '', ''))[2]))
    supheli = [ad for ad in sira if puan[ad] >= 2]
    satirlar = []
    for n, ad in enumerate(sira, 1):
        iy = sonuc[ad]
        baslik = eser.get(ad, ('', '', ad))[2]
        if n == 1 and supheli:
            satirlar.append(f'<h2>Şüpheli: {len(supheli)} (işaretli geldi; iyi olanların işaretini kaldır)</h2>')
        if n == len(supheli) + 1:
            satirlar.append(f'<h2>İyi görünenler: {len(sira) - len(supheli)} (hızlıca göz at; kötü olanı işaretle)</h2>')
        nedenler = ', '.join(x for x, _ in d.get(ad, []))
        satirlar.append(f"""<figure><figcaption><label><input type="checkbox" value="{ad}"{' checked' if ad in supheli else ''}> {n}. {baslik.replace('<', '&lt;')}</label>
<small>{iy['onceki']} px → {max(iy['g'], iy['y'])} px</small>{f' <em>{nedenler}</em>' if nedenler else ''}</figcaption>
<div><img loading="lazy" src="../gorseller/b/{ad}.jpg"><img loading="lazy" src="{onizleme_url(iy['dosya'], iy['g'])}"></div>
<small class="d">{iy['dosya'].replace('<', '&lt;')}</small></figure>""")
    sayfa = f"""<!doctype html><meta charset="utf-8"><title>Daha büyük görseller</title>
<style>body{{font:15px -apple-system,sans-serif;background:#1d1a17;color:#efe7da;margin:16px}}figure{{margin:0 0 28px}}
figure div{{display:flex;gap:8px}}figure img{{width:50%;height:300px;object-fit:contain;background:#000}}small{{color:#a99}}
em{{color:#f0a060;font-style:normal;margin-left:8px}}h2{{font-size:18px;margin:24px 0 12px}}
.d{{display:block;font-size:12px}}#k{{position:sticky;top:0;background:#26221e;padding:10px;z-index:2}}textarea{{width:100%}}</style>
<div id="k"><b>Solda şimdiki, sağda bulunan.</b> İşaretliler reddedilir. <button id="b">Reddetme komutunu kopyala</button>
<span id="s"></span><br><textarea id="t" rows="2" readonly></textarea></div>
{''.join(satirlar) or '<p>Bulunan yok.</p>'}
<script>const t=document.getElementById('t');const g=()=>{{const l=[...document.querySelectorAll('input:checked')].map(x=>x.value);
document.getElementById('s').textContent=l.length+' işaretli';
t.value=l.length?'python3 scripts/kalite_tara.py --reddet '+l.join(','):'';return t.value}};document.onchange=g;g();
document.getElementById('b').onclick=()=>{{navigator.clipboard.writeText(g())}};</script>"""
    yol = HEDEF / 'iyilestirme.html'
    yol.write_text(sayfa)
    return yol, len(supheli)


def eser_haritasi():
    harita = json.loads((KOK / 'data/yerel_gorseller.json').read_text())['gorseller']
    eser = {}
    for v in json.loads((KOK / 'data/eserler_onbellek.json').read_text())['sanatcilar'].values():
        for e in v['eserler']:
            for g in (e.get('gorseller') or [])[:1]:
                if g['k'] == 'commons':
                    a = f"commons:{g['d']}"
                    if a in harita and e.get('qid'):
                        eser[harita[a]] = (norm(g['d']), e['qid'], e.get('baslik') or '')
    return eser


def sayfayi_ac(sonuc, eser):
    sayfa, supheli = inceleme_sayfasi(sonuc, eser)
    subprocess.run(['open', str(sayfa)], capture_output=True)
    print(f'İnceleme sayfası açıldı ({sayfa.relative_to(KOK)}): {len(sonuc)} bulunan, {supheli} şüpheli (işaretli geldi).')
    print('İyi olanların işaretini kaldır, "Reddetme komutunu kopyala", Terminal\'e yapıştır.')


def main():
    if subprocess.run(['which', 'sips'], capture_output=True).returncode:
        sys.exit('sips bulunamadı (macOS gerekir).')
    BILGI.mkdir(parents=True, exist_ok=True)
    if '--reddet' in sys.argv:
        return reddet([x for x in sys.argv[sys.argv.index('--reddet') + 1].split(',') if x])
    if '--sayfa' in sys.argv:  # yalnız inceleme sayfasını yeniden kur (tarama yok)
        return sayfayi_ac(oku_cikti()[0], eser_haritasi())
    sinir = int(sys.argv[sys.argv.index('--dene') + 1]) if '--dene' in sys.argv else None
    oranlar = json.loads((KOK / 'data/gorsel_oranlari.json').read_text())['oranlar']
    eser = eser_haritasi()
    sonuc, reddedilen = oku_cikti()
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
    yol_h, imzalar = sakli('kalite_imza')

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
        liste = uygun_adaylar(adaylar, oranlar.get(ad), mevcut, reddedilen.get(ad, ()))
        if liste:
            try:
                biz = dosya_imzasi(KOK / f'gorseller/k/{ad}.jpg')
            except (OSError, ValueError):
                biz = None
            for uzun, x, g, y, kucuk in liste[:4]:
                if biz is None or not kucuk:
                    break
                if kucuk not in imzalar:
                    veri = getir(kucuk, ikili=True)
                    try:
                        imzalar[kucuk] = veri_imzasi(veri) if veri else None
                    except (OSError, ValueError):
                        imzalar[kucuk] = None
                    yol_h.write_text(json.dumps(imzalar))
                o = imzalar[kucuk]
                if o is not None and fark(biz['k'], o['k']) <= EN_COK_FARK and renk_uyar(biz, o):
                    secilen = {'dosya': x, 'g': g, 'y': y, 'onceki': mevcut}
                    break
        # önceki çalıştırmada bulunan artık uymuyorsa (ör. renk denetimi sonradan eklendi) listeden çıkar
        if not secilen:
            sonuc.pop(ad, None)
        if secilen:
            sonuc[ad] = secilen
            bulunan += 1
            print(f'  {baslik[:40]:40} {mevcut:>5} → {max(secilen["g"], secilen["y"])} px  {secilen["dosya"][:60]}', flush=True)
        if n % 25 == 0:
            print(f'{n}/{len(zayiflar)} · bulunan {bulunan}', flush=True)
        kaydet_cikti(sonuc, reddedilen)
    kaydet_cikti(sonuc, reddedilen)
    print(f'\nBitti: {len(zayiflar)} zayıf görselin {bulunan} tanesi için daha büyük dosya bulundu (toplam {len(sonuc)}).')
    sayfayi_ac(sonuc, eser)
    print('Sonra: caffeinate -i python3 scripts/devasa_indir.py  →  python3 scripts/r2_yukle.py  →  git add/commit/push')


if __name__ == '__main__':
    main()
