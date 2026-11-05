#!/usr/bin/env python3
"""Rehberli eser incelemesi verisini (data/eser_ayrintilari.json) denetler.

Kullanım (depo kökünden):  python3 scripts/ayrinti/denetle.py [--sessiz]
Çıkış kodu 0: hata yok (uyarılar olabilir). 1: en az bir hata. Birim testi (tests/unit/ayrinti.test.mjs) bunu çalıştırır.

Denetlenenler (kurallar scripts/ayrinti/TALIMAT.md'de):
- anahtar data/basyapitlar.json'da var mı, tekrar ediyor mu; sanatci başyapıt kaydıyla aynı mı
- gorsel: noktaların seçildiği görsel uygulamadaki ilk görselle hâlâ aynı mı (değiştiyse koordinatlar bakılmalı)
- 4–6 nokta; x, y, w, h 0–1 arasında ve kutu görselin içinde; kutu en az 0,02 × 0,02, en çok görselin %60'ı
- noktalar fazla örtüşüyor mu (IoU > 0,35 hata; merkezler 0,04'ten yakınsa hata)
- ad 2–40 karakter, kayıt içinde tekrar etmiyor; metin 60–420 karakter, 2–4 cümle (3'ten çok cümle uyarı)
"""
import json
import re
import sys
from pathlib import Path

KOK = Path(__file__).resolve().parents[2]
VERI = KOK / 'data' / 'eser_ayrintilari.json'
EN_AZ_NOKTA, EN_COK_NOKTA = 4, 6
METIN_EN_AZ, METIN_EN_COK = 60, 420
KUTU_EN_KUCUK, KUTU_EN_BUYUK_ALAN = 0.02, 0.60
IOU_SINIR, MERKEZ_SINIR = 0.35, 0.04


def oku(yol):
    with open(yol, encoding='utf-8') as f:
        return json.load(f)


def cumle_sayisi(metin):
    # Cümle sonu: . ! ? … (ardından kapanan tırnak/parantez olabilir) + boşluk + büyük harf, tırnak ya da parantez.
    # Kısaltmalar sayılmaz: "y. 1440", "St. ", "IV. Sixtus", "S. Gripe" (en çok 3 büyük harf + nokta)
    m = re.sub(r'\b([A-ZÇĞİÖŞÜ]{1,3})\.(?=\s)', r'\1§', metin.strip())
    parcalar = re.split(r'(?<=[.!?…])["”»)]?\s+(?=[A-ZÇĞİÖŞÜ"“«(])', m)
    return len([p for p in parcalar if p.strip()])


def iou(a, b):
    x0, y0 = max(a['x'], b['x']), max(a['y'], b['y'])
    x1, y1 = min(a['x'] + a['w'], b['x'] + b['w']), min(a['y'] + a['h'], b['y'] + b['h'])
    kesisim = max(0.0, x1 - x0) * max(0.0, y1 - y0)
    birlesim = a['w'] * a['h'] + b['w'] * b['h'] - kesisim
    return kesisim / birlesim if birlesim > 0 else 0.0


def gorsel_adlari():
    """başyapıt anahtarı → uygulamadaki ilk görselin yerel adı (js/basyapit.js eserEslestir ve gorsel.js yerelAnahtar gibi)"""
    try:
        onbellek = oku(KOK / 'data' / 'eserler_onbellek.json')['sanatcilar']
        yerel = oku(KOK / 'data' / 'yerel_gorseller.json')['gorseller']
        basyapitlar = oku(KOK / 'data' / 'basyapitlar.json')['eserler']
    except (OSError, KeyError, ValueError):
        return {}
    sonuc = {}
    for b in basyapitlar:
        eserler = onbellek.get(b['sanatci'], {}).get('eserler', [])
        e = next((x for x in eserler if (x.get('qid') and x['qid'] == b['anahtar']) or f"{b['sanatci']}|{x.get('baslik')}" == b['anahtar']), None)
        g = (e or {}).get('gorseller', [{}])[0] if e else None
        if not g:
            continue
        anahtar = f"{g.get('k')}:{g.get('d') or g.get('i') or g.get('u') or ''}"
        sonuc[b['anahtar']] = yerel.get(anahtar, '')
    return sonuc


def denetle(veri, basyapitlar, adlar):
    hatalar, uyarilar = [], []
    if not isinstance(veri, dict) or not isinstance(veri.get('eserler'), list):
        return ['dosya biçimi: {"surum", "eserler": [...]} bekleniyor'], uyarilar, 0
    b_harita = {b['anahtar']: b for b in basyapitlar}
    gorulen = set()
    nokta_toplam = 0
    for e in veri['eserler']:
        k = e.get('anahtar')
        etiket = f"[{k}] {e.get('baslik', '')}"
        hata = lambda m: hatalar.append(f'{etiket}: {m}')
        uyar = lambda m: uyarilar.append(f'{etiket}: {m}')
        if not isinstance(k, str) or not k:
            hata('anahtar yok')
            continue
        if k in gorulen:
            hata('anahtar tekrar ediyor')
        gorulen.add(k)
        b = b_harita.get(k)
        if not b:
            hata('anahtar data/basyapitlar.json\'da yok')
        elif e.get('sanatci') != b['sanatci']:
            hata(f"sanatci başyapıt kaydıyla uyuşmuyor ({e.get('sanatci')} ≠ {b['sanatci']})")
        if adlar.get(k) and e.get('gorsel') and adlar[k] != e['gorsel']:
            hata(f"gorsel değişmiş: kayıtta {e['gorsel']}, uygulamada {adlar[k]} — koordinatlar yeni görselde yeniden bakılmalı")
        elif not e.get('gorsel'):
            uyar('gorsel alanı boş (hangi görselde seçildiği bilinmiyor)')
        noktalar = e.get('noktalar')
        if not isinstance(noktalar, list):
            hata('noktalar listesi yok')
            continue
        if not EN_AZ_NOKTA <= len(noktalar) <= EN_COK_NOKTA:
            hata(f'{len(noktalar)} nokta; {EN_AZ_NOKTA}–{EN_COK_NOKTA} olmalı')
        adlar_gorulen = set()
        gecerli = []
        for i, n in enumerate(noktalar, 1):
            on = f'nokta {i}'
            if not isinstance(n, dict):
                hata(f'{on}: nesne değil')
                continue
            ad = n.get('ad')
            if not isinstance(ad, str) or not 2 <= len(ad.strip()) <= 40:
                hata(f'{on}: ad 2–40 karakter olmalı')
            elif ad in adlar_gorulen:
                hata(f'{on}: ad tekrar ediyor ({ad})')
            else:
                adlar_gorulen.add(ad)
            kutu_tamam = True
            for alan in ('x', 'y', 'w', 'h'):
                v = n.get(alan)
                if not isinstance(v, (int, float)) or isinstance(v, bool) or not 0 <= v <= 1:
                    hata(f'{on}: {alan} 0–1 arasında bir sayı olmalı')
                    kutu_tamam = False
            if kutu_tamam:
                if n['w'] < KUTU_EN_KUCUK or n['h'] < KUTU_EN_KUCUK:
                    hata(f'{on}: kutu çok küçük (en az {KUTU_EN_KUCUK})')
                if n['x'] + n['w'] > 1.0001 or n['y'] + n['h'] > 1.0001:
                    hata(f'{on}: kutu görselin dışına taşıyor')
                if n['w'] * n['h'] > KUTU_EN_BUYUK_ALAN:
                    hata(f"{on}: kutu görselin %{round(n['w'] * n['h'] * 100)}'ini kaplıyor; ayrıntı değil")
                gecerli.append((i, n))
            metin = n.get('metin')
            if not isinstance(metin, str) or not METIN_EN_AZ <= len(metin.strip()) <= METIN_EN_COK:
                hata(f'{on}: metin {METIN_EN_AZ}–{METIN_EN_COK} karakter olmalı (şimdi {len(metin) if isinstance(metin, str) else 0})')
            else:
                c = cumle_sayisi(metin)
                if c < 2 or c > 4:
                    hata(f'{on}: {c} cümle; 2–3 cümle olmalı')
                elif c == 4:
                    uyar(f'{on}: 4 cümle; 2–3 tercih edilir')
                if re.search(r'\s{2,}|\s[.,;:]', metin):
                    uyar(f'{on}: metinde çift boşluk ya da noktalama önünde boşluk var')
        for a_i in range(len(gecerli)):
            for b_i in range(a_i + 1, len(gecerli)):
                ia, na = gecerli[a_i]
                ib, nb = gecerli[b_i]
                o = iou(na, nb)
                if o > IOU_SINIR:
                    hata(f'nokta {ia} ile {ib} fazla örtüşüyor (IoU {o:.2f} > {IOU_SINIR})')
                dx = (na['x'] + na['w'] / 2) - (nb['x'] + nb['w'] / 2)
                dy = (na['y'] + na['h'] / 2) - (nb['y'] + nb['h'] / 2)
                if (dx * dx + dy * dy) ** 0.5 < MERKEZ_SINIR:
                    hata(f'nokta {ia} ile {ib} işaretleri üst üste (merkezler {MERKEZ_SINIR}\'ten yakın)')
        nokta_toplam += len(noktalar)
    return hatalar, uyarilar, nokta_toplam


def main(argv):
    sessiz = '--sessiz' in argv
    try:
        veri = oku(VERI)
    except FileNotFoundError:
        print(f'{VERI} yok')
        return 1
    except ValueError as e:
        print(f'{VERI} JSON olarak okunamadı: {e}')
        return 1
    basyapitlar = oku(KOK / 'data' / 'basyapitlar.json')['eserler']
    hatalar, uyarilar, nokta_toplam = denetle(veri, basyapitlar, gorsel_adlari())
    if not sessiz:
        for u in uyarilar:
            print(f'UYARI  {u}')
        for h in hatalar:
            print(f'HATA   {h}')
    print(f"{len(veri.get('eserler', []))} eser, {nokta_toplam} nokta · {len(hatalar)} hata, {len(uyarilar)} uyarı")
    return 1 if hatalar else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
