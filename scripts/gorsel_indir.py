#!/usr/bin/env python3
"""Pekiştirme havuzundaki ve başyapıt okumalarındaki eserlerin görsellerini uygulamayla birlikte yayınlamak için indirir.
Böylece Wikimedia'nın hız sınırı (429) ve müze engelleri (403) bu görselleri etkilemez.

Çalıştır (depo kökünde, macOS; küçültme için hazır gelen `sips` kullanılır):
  python3 scripts/gorsel_indir.py
Yarıda kalırsa yeniden çalıştır: inmiş dosyalar atlanır. Wikimedia'yı yormamak için istekler arası bekleme var (~1 saat).

Kaynak 1280 px istenir (Wikimedia'nın standart küçük resim boyutu: önbellekte hazır durduğu için 429 daha az) ve burada küçültülür.
Çıktı: gorseller/b/<ad>.jpg (en uzun kenar 1280: iPhone ekranının gerçek piksel genişliğine yakın, yakınlaştırmada daha net),
gorseller/k/<ad>.jpg (400, ızgara küçük resmi) ve data/yerel_gorseller.json
Yalnızca özgür lisanslı kaynaklar: Wikimedia Commons ve müzelerin CC0 açık erişim görselleri. WikiArt (telifli olabilir) alınmaz."""
import hashlib, json, subprocess, sys, time, urllib.parse, urllib.request, urllib.error
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
HEDEF = KOK / 'gorseller'
UA = 'SanatAtlasi/1.0 (personal study app; emreyaman1024@gmail.com)'
HAVUZ = 12
BEKLE = 1.5


def anahtar(g):
    return f"{g['k']}:{g.get('d') or g.get('i') or g.get('u') or ''}"


def kaynak_url(g):
    k = g['k']
    if k == 'commons':
        return 'https://commons.wikimedia.org/wiki/Special:FilePath/' + urllib.parse.quote(g['d'].replace(' ', '_')) + '?width=1280'
    if k == 'aic':
        return f"https://www.artic.edu/iiif/2/{g['i']}/full/843,/0/default.jpg"
    if k == 'nga':
        return f"{g['i']}/full/!1280,1280/0/default.jpg"
    if k in ('met', 'cma'):
        return g.get('u', '')
    return ''  # wikiart ve bilinmeyenler alınmaz


def secilecekler():
    ob = json.loads((KOK / 'data/eserler_onbellek.json').read_text())['sanatcilar']
    secim, buyuk = {}, set()
    for sid, v in ob.items():
        n = 0
        for e in v['eserler']:
            g = (e.get('gorseller') or [None])[0]
            if not g or e.get('pekistirme') is False or (g.get('p') is not None and g['p'] <= 5):
                continue
            secim[anahtar(g)] = g
            n += 1
            if n >= HAVUZ:
                break
    try:
        bas = json.loads((KOK / 'data/basyapitlar.json').read_text())['eserler']
        for b in bas:
            for e in ob.get(b['sanatci'], {}).get('eserler', []):
                if e.get('qid') == b['anahtar'] or f"{b['sanatci']}|{e['baslik']}" == b['anahtar']:
                    if e.get('gorseller'):
                        secim[anahtar(e['gorseller'][0])] = e['gorseller'][0]
                        buyuk.add(anahtar(e['gorseller'][0]))
    except FileNotFoundError:
        pass
    return {a: g for a, g in secim.items() if kaynak_url(g)}, buyuk


# Engel (429) ya da sunucu hatası gelince görsel atlanmaz: beklenir ve yeniden denenir.
# Üst üste ret geldikçe bekleme katlanarak uzar (30 sn → 1 → 2 → 4 … en çok 15 dk) ve istekler arası
# temel bekleme de artar; başarılı indirmelerden sonra yavaş yavaş eski hızına döner.
DURUM = {'ardisik_ret': 0, 'bekle': BEKLE}
EN_UZUN = 900
EN_COK_DENEME = 40  # ≈ birkaç saat; bundan sonra bile inmiyorsa görsel bu tur atlanır, sonraki çalıştırmada yeniden denenir


def indir(url):
    for deneme in range(EN_COK_DENEME):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'AIC-User-Agent': UA})
            with urllib.request.urlopen(req, timeout=90) as y:
                veri = y.read()
            DURUM['ardisik_ret'] = 0
            DURUM['bekle'] = max(BEKLE, DURUM['bekle'] * 0.95)
            return veri
        except urllib.error.HTTPError as e:
            if e.code in (403, 404, 410) and not (e.code == 403 and 'wikimedia' in url):
                return None  # dosya yok ya da kalıcı engel: beklemek işe yaramaz
            neden = str(e.code)
            ra = e.headers.get('Retry-After') if e.headers else None
        except Exception as e:
            neden, ra = type(e).__name__, None
        DURUM['ardisik_ret'] += 1
        DURUM['bekle'] = min(10.0, DURUM['bekle'] + 0.5)
        try:
            ra = int(ra) if ra else 0
        except ValueError:
            ra = 0
        sure = min(EN_UZUN, max(ra, 30 * 2 ** min(DURUM['ardisik_ret'] - 1, 5)))
        print(f'   {neden} (üst üste {DURUM["ardisik_ret"]}. ret) · {sure} sn bekleniyor, sonra aynı görsel yeniden denenecek', flush=True)
        time.sleep(sure)
    return None


def main():
    if subprocess.run(['which', 'sips'], capture_output=True).returncode:
        sys.exit('sips bulunamadı (macOS gerekir).')
    (HEDEF / 'k').mkdir(parents=True, exist_ok=True)
    (HEDEF / 'b').mkdir(parents=True, exist_ok=True)
    harita_yolu = KOK / 'data/yerel_gorseller.json'
    eski = json.loads(harita_yolu.read_text()) if harita_yolu.exists() else {}
    harita, buyukler = eski.get('gorseller', {}), set(eski.get('buyuk', []))
    secim, buyuk_secim = secilecekler()

    def yaz():
        harita_yolu.write_text(json.dumps({'surum': 1, 'gorseller': harita, 'buyuk': sorted(buyukler)}, ensure_ascii=False, separators=(',', ':')))

    print(f'{len(secim)} görsel seçildi · {len([a for a in secim if a in harita])} zaten inmiş', flush=True)
    basarisiz = 0
    for n, (a, g) in enumerate(secim.items(), 1):
        ad = hashlib.sha1(a.encode()).hexdigest()[:16]
        kucuk, enbuyuk = HEDEF / 'k' / f'{ad}.jpg', HEDEF / 'b' / f'{ad}.jpg'
        if a in harita and kucuk.exists() and enbuyuk.exists():
            continue
        veri = indir(kaynak_url(g))
        time.sleep(DURUM['bekle'])
        if not veri:
            basarisiz += 1
            continue
        ham = HEDEF / f'{ad}.ham'
        ham.write_bytes(veri)
        r1 = subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '82', '-Z', '1280', str(ham), '--out', str(enbuyuk)], capture_output=True)
        r2 = subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '75', '-Z', '400', str(ham), '--out', str(kucuk)], capture_output=True)
        ham.unlink(missing_ok=True)
        if r1.returncode or r2.returncode:
            basarisiz += 1
            continue
        harita[a] = ad
        buyukler.add(a)
        if n % 25 == 0:
            yaz()
            print(f'{n}/{len(secim)} · inen {len(harita)} · başarısız {basarisiz}', flush=True)
    yaz()
    boyut = sum(p.stat().st_size for p in HEDEF.rglob('*.jpg')) / 1e6
    print(f'\nBitti · {len(harita)} görsel · {boyut:.0f} MB · başarısız {basarisiz} (yeniden çalıştırınca tekrar denenir)')


if __name__ == '__main__':
    main()
