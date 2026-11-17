#!/usr/bin/env python3
"""İş 189 · Başyapıt araştırması, 1. adım: kaynak metinleri indirir. Model KULLANMAZ; Emre'nin Mac'inde çalışır.

secim.json'daki her eser için scripts/basyapit_arastirma/kaynak/<QID>/ altına yazar:
  wikidata.txt   eserin Wikidata kaydından künye satırları (satır başına bir olgu; "yaklaşık", "atfedilen" nitelemeleriyle)
  enwiki.txt     İngilizce Wikipedia maddesinin düz metni (varsa)
  trwiki.txt     Türkçe Wikipedia maddesinin düz metni (varsa)
  KAYNAK.json    adres, sürüm numarası (revid), indirme tarihi, sha256
Araştırmayı yapan model yalnız bu dosyaları okur; dogrula.py her alıntıyı bu dosyalarda arar ve sha256 ile dosyaların
değişmediğini denetler.

Çalıştır (depo kökünde):
  python3 scripts/basyapit_arastirma/kaynak_indir.py            # hepsi (110 eser, ~10 dk)
  python3 scripts/basyapit_arastirma/kaynak_indir.py --parti 1  # yalnız 1. parti (10 eser)
İnmiş eser atlanır; yeniden indirmek için klasörünü sil. İstekler arası 1,5 sn; 429'da Retry-After'a uyar.
Kullanıcı aracısı: ATLAS_UA ortam değişkeni (Wikimedia iletişim bilgisi ister; ör. "SanatAtlasi/1.0 (e-posta)").
"""
import datetime
import hashlib
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

BURASI = Path(__file__).resolve().parent
HEDEF = BURASI / 'kaynak'
UA = os.environ.get('ATLAS_UA', 'SanatAtlasi/1.0 (personal study app)')
BEKLE = 1.5
OZELLIK = {
    'P1476': 'title', 'P170': 'creator', 'P571': 'inception', 'P186': 'made from material', 'P2048': 'height',
    'P2049': 'width', 'P276': 'location', 'P195': 'collection', 'P217': 'inventory number', 'P136': 'genre',
    'P135': 'movement', 'P180': 'depicts', 'P921': 'main subject', 'P88': 'commissioned by', 'P144': 'based on',
    'P179': 'part of the series', 'P361': 'part of', 'P127': 'owned by',
}
NITELEME = {'P1480': 'sourcing circumstances', 'P5102': 'nature of statement', 'P580': 'start time', 'P582': 'end time'}
son = [0.0]


def al(url):
    for deneme in range(6):
        time.sleep(max(0.0, son[0] + BEKLE - time.time()))
        son[0] = time.time()
        try:
            ist = urllib.request.Request(url, headers={'User-Agent': UA, 'Api-User-Agent': UA})
            return json.loads(urllib.request.urlopen(ist, timeout=60).read())
        except urllib.error.HTTPError as h:
            if h.code not in (429, 500, 502, 503):
                raise
            sure = int(h.headers.get('Retry-After') or 0) or 20 * (deneme + 1)
            print(f'  {h.code}: {sure} sn bekleniyor', file=sys.stderr)
            time.sleep(sure)
        except (urllib.error.URLError, TimeoutError) as h:
            print(f'  ağ hatası ({h}); yeniden', file=sys.stderr)
            time.sleep(10 * (deneme + 1))
    raise SystemExit(f'İndirilemedi: {url}')


def zaman(v):
    t, k = v['time'], v['precision']
    yil = int(t[0:5])
    if k >= 11:
        return f'{yil}-{t[6:8]}-{t[9:11]}'
    if k == 10:
        return f'{yil}-{t[6:8]}'
    if k == 9:
        return str(yil)
    return f'{yil} (precision: {"decade" if k == 8 else "century" if k == 7 else k})'


def deger(snak, ad):
    if snak.get('snaktype') != 'value':
        return 'unknown value' if snak.get('snaktype') == 'somevalue' else 'no value'
    v, tur = snak['datavalue']['value'], snak['datavalue']['type']
    if tur == 'wikibase-entityid':
        return f"{ad.get(v['id'], '?')} ({v['id']})"
    if tur == 'time':
        return zaman(v)
    if tur == 'quantity':
        b = v.get('unit', '').rsplit('/', 1)[-1]
        return f"{v['amount'].lstrip('+')} {ad.get(b, '') if b.startswith('Q') else ''}".strip()
    if tur == 'monolingualtext':
        return f"{v['text']} [{v['language']}]"
    return str(v)


def kimlikler(kayit):
    q = set()
    for p, l in kayit.get('claims', {}).items():
        if p not in OZELLIK:
            continue
        for c in l:
            for s in [c['mainsnak']] + [x for n in NITELEME for x in c.get('qualifiers', {}).get(n, [])]:
                v = s.get('datavalue', {}).get('value')
                if isinstance(v, dict) and 'id' in v:
                    q.add(v['id'])
                if isinstance(v, dict) and str(v.get('unit', '')).rsplit('/', 1)[-1].startswith('Q'):
                    q.add(v['unit'].rsplit('/', 1)[-1])
    return sorted(q)


def adlar(qler):
    ad = {}
    for i in range(0, len(qler), 50):
        u = 'https://www.wikidata.org/w/api.php?' + urllib.parse.urlencode(
            {'action': 'wbgetentities', 'ids': '|'.join(qler[i:i + 50]), 'props': 'labels', 'languages': 'en', 'format': 'json'})
        for k, e in al(u).get('entities', {}).items():
            ad[k] = e.get('labels', {}).get('en', {}).get('value', '?')
    return ad


def wikidata_metni(qid, kayit):
    ad = adlar(kimlikler(kayit))
    s = [f'Wikidata item {qid}']
    for dil in ('en', 'tr'):
        if dil in kayit.get('labels', {}):
            s.append(f"label ({dil}): {kayit['labels'][dil]['value']}")
        if dil in kayit.get('descriptions', {}):
            s.append(f"description ({dil}): {kayit['descriptions'][dil]['value']}")
    for p, ozellik in OZELLIK.items():
        for c in kayit.get('claims', {}).get(p, []):
            if c.get('rank') == 'deprecated':
                continue
            satir = f"{ozellik} ({p}): {deger(c['mainsnak'], ad)}"
            ek = [f"{NITELEME[n]}: {deger(x, ad)}" for n in NITELEME for x in c.get('qualifiers', {}).get(n, [])]
            s.append(satir + (f" [{'; '.join(ek)}]" if ek else ''))
    return '\n'.join(s) + '\n'


def wikipedia(dil, baslik):
    u = f'https://{dil}.wikipedia.org/w/api.php?' + urllib.parse.urlencode({
        'action': 'query', 'prop': 'extracts|revisions', 'explaintext': 1, 'exsectionformat': 'wiki',
        'rvprop': 'ids|timestamp', 'titles': baslik, 'redirects': 1, 'format': 'json', 'formatversion': 2})
    s = (al(u).get('query', {}).get('pages') or [{}])[0]
    if not s.get('extract'):
        return None
    r = (s.get('revisions') or [{}])[0]
    adres = f"https://{dil}.wikipedia.org/w/index.php?title={urllib.parse.quote(s['title'].replace(' ', '_'))}&oldid={r.get('revid', '')}"
    return s['extract'].strip() + '\n', {'url': adres, 'baslik': s['title'], 'revid': r.get('revid'), 'surum_tarihi': r.get('timestamp')}


def eser(qid):
    klasor = HEDEF / qid
    if (klasor / 'KAYNAK.json').exists():
        return 'atlandı'
    kayit = al(f'https://www.wikidata.org/wiki/Special:EntityData/{qid}.json')['entities']
    kayit = kayit.get(qid) or next(iter(kayit.values()))  # yönlendirilen kayıt
    dosyalar = {'wikidata.txt': (wikidata_metni(qid, kayit), {
        'url': f'https://www.wikidata.org/wiki/Special:EntityData/{qid}.json', 'revid': kayit.get('lastrevid')})}
    for dil in ('en', 'tr'):
        b = kayit.get('sitelinks', {}).get(f'{dil}wiki', {}).get('title')
        w = wikipedia(dil, b) if b else None
        if w:
            dosyalar[f'{dil}wiki.txt'] = w
    klasor.mkdir(parents=True, exist_ok=True)
    ozet = {'anahtar': qid, 'indirme': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'), 'dosyalar': {}}
    for ad, (metin, bilgi) in dosyalar.items():
        (klasor / ad).write_text(metin, encoding='utf-8')
        ozet['dosyalar'][ad] = {**bilgi, 'sha256': hashlib.sha256(metin.encode('utf-8')).hexdigest(), 'karakter': len(metin)}
    (klasor / 'KAYNAK.json').write_text(json.dumps(ozet, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    return ' + '.join(f"{a} ({b['karakter']})" for a, b in ozet['dosyalar'].items())


def main():
    secim = json.loads((BURASI / 'secim.json').read_text(encoding='utf-8'))['eserler']
    a = sys.argv[1:]
    if '--parti' in a:
        n = int(a[a.index('--parti') + 1])
        secim = [e for e in secim if e['parti'] == n]
    elif a:
        secim = [e for e in secim if e['anahtar'] in a]
    for e in secim:
        print(f"{e['sira']:>3} {e['anahtar']:<10} {e['baslik'][:40]:<40} {eser(e['anahtar'])}")


if __name__ == '__main__':
    main()
