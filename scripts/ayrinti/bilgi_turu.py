#!/usr/bin/env python3
"""Bilgi turu (1.90.x): rehberli inceleme açıklamalarını betimlemeden bilgiye çevirme. Talimat: BILGI_TURU.md.

Kullanım (depo kökünden):
  python3 scripts/ayrinti/bilgi_turu.py durum              kaç eser bitti, kaç kaldı
  python3 scripts/ayrinti/bilgi_turu.py liste [n]          sıradaki n eser (varsayılan 5): noktalar + kurs notu bağlamı
  python3 scripts/ayrinti/bilgi_turu.py uygula <dosya>     {anahtar: {nokta adı: yeni metin | null}} uygular
        null = metin zaten bilgi veriyor, olduğu gibi kalır. Dosyadaki her eser "bitti" sayılır; dosyada
        olmayan noktası olan eser kabul edilmez (her noktaya karar verilmeli). Sonra denetle.py çalışır.
Sıra: data/basyapitlar.json'daki eser sırası. İlerleme: scripts/ayrinti/bilgi_turu_durum.json.
"""
import json
import subprocess
import sys
from pathlib import Path

KOK = Path(__file__).resolve().parents[2]
VERI = KOK / 'data' / 'eser_ayrintilari.json'
DURUM = Path(__file__).with_name('bilgi_turu_durum.json')


def oku(y):
    with open(y, encoding='utf-8') as f:
        return json.load(f)


def yaz(y, v):
    with open(y, 'w', encoding='utf-8') as f:
        json.dump(v, f, ensure_ascii=False, indent=1)
        f.write('\n')


def durum_oku():
    return oku(DURUM) if DURUM.exists() else {'bitti': []}


def sira():
    ayr = {e['anahtar']: e for e in oku(VERI)['eserler']}
    bsy = oku(KOK / 'data' / 'basyapitlar.json')['eserler']
    l = [b for b in bsy if b['anahtar'] in ayr]
    return l, ayr


def main(a):
    if not a or a[0] not in ('durum', 'liste', 'uygula'):
        print(__doc__)
        return 2
    l, ayr = sira()
    bitti = set(durum_oku()['bitti'])
    kalan = [b for b in l if b['anahtar'] not in bitti]
    if a[0] == 'durum':
        print(f'{len(l) - len(kalan)} / {len(l)} eser bitti, {len(kalan)} kaldı')
        return 0
    if a[0] == 'liste':
        n = int(a[1]) if len(a) > 1 else 5
        for b in kalan[:n]:
            e = ayr[b['anahtar']]
            print(f"## {b['anahtar']} · {b['sanatci']} · {b.get('baslik')} ({b.get('tarih')}, {b.get('muze')})")
            if b.get('ozet'):
                print('ÖZET:', b['ozet'])
            for k in ('bak', 'bolumler'):
                if b.get(k):
                    print(k.upper() + ':', json.dumps(b[k], ensure_ascii=False)[:1500])
            for p in e['noktalar']:
                print(f"  - {p['ad']}: {p['metin']}")
            print()
        return 0
    yeni = oku(a[1])
    veri = oku(VERI)
    hata = []
    for e in veri['eserler']:
        d = yeni.get(e['anahtar'])
        if d is None:
            continue
        adlar = {p['ad'] for p in e['noktalar']}
        if set(d) != adlar:
            hata.append(f"{e['anahtar']}: nokta adları tutmuyor (eksik {adlar - set(d)}, fazla {set(d) - adlar})")
            continue
        for p in e['noktalar']:
            if d[p['ad']]:
                p['metin'] = d[p['ad']]
    bilinmeyen = set(yeni) - {e['anahtar'] for e in veri['eserler']}
    if bilinmeyen:
        hata.append(f'bilinmeyen anahtar: {bilinmeyen}')
    if hata:
        print('\n'.join(hata))
        return 1
    yaz(VERI, veri)
    dur = durum_oku()
    dur['bitti'] = sorted(set(dur['bitti']) | set(yeni))
    yaz(DURUM, dur)
    r = subprocess.run([sys.executable, str(KOK / 'scripts' / 'ayrinti' / 'denetle.py')], capture_output=True, text=True)
    print(r.stdout.strip().splitlines()[-1] if r.stdout.strip() else r.stderr)
    if r.returncode:
        print(r.stdout)
    print(f"{len(dur['bitti'])} / {len(l)} eser bitti")
    return r.returncode


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
