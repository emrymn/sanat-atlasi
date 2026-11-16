#!/usr/bin/env python3
"""Ortak kaynak kütüğü üretici.

Kullanım: python3 resim-ansiklopedisi/kaynaklar/kutuk_uret.py
Tüm madde JSON'larındaki `kaynaklar` dizilerini tarar; kaynaklar/KAYNAK_KUTUGU.json yazar.
Aynı kaynağın (normalize URL veya künye) birden çok maddede kullanımını raporlar.
Salt-okunur üreteçtir: madde dosyalarını değiştirmez.
"""
import json, os, re, sys
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # resim-ansiklopedisi/
DIZINLER = ['ikonografi', 'mitoloji', 'resim-teknikleri', 'resimlerdeki-nesneler']

def norm_url(u):
    if not u:
        return None
    u = re.sub(r'^https?://(www\.)?', '', u.strip()).rstrip('/').lower()
    u = re.sub(r'#.*$', '', u)  # yalnız fragment atılır; sorgu parametreleri kimliğin parçasıdır (ör. Perseus docId)
    return u or None

def main():
    kayitlar = []
    gruplar = defaultdict(list)  # anahtar → [(madde_id, kaynak_id)]
    for d in DIZINLER:
        dp = os.path.join(ROOT, d)
        if not os.path.isdir(dp):
            continue
        for fn in sorted(os.listdir(dp)):
            if not fn.endswith('.json'):
                continue
            with open(os.path.join(dp, fn), encoding='utf-8') as f:
                m = json.load(f)
            mid = m.get('id', '?')
            for k in m.get('kaynaklar', []):
                kid = k.get('kaynak_id')
                rec = dict(k)
                rec['madde_id'] = mid
                kayitlar.append(rec)
                kunye = str(k.get('kunye', '')).strip().lower()
                anahtar = norm_url(k.get('url')) or (
                    ('kunye:' + kunye) if kunye else ('baslik:' + str(k.get('baslik', '')).strip().lower())
                )
                gruplar[anahtar].append((mid, kid))
    cift = [{'anahtar': a, 'kullanimlar': v} for a, v in sorted(gruplar.items())
            if len({mid for mid, _ in v}) > 1]
    kutuk = {
        'aciklama': 'Ortak kaynak kütüğü — madde JSON’larındaki kaynak kayıtlarının birleşik dizini. '
                    'kutuk_uret.py ile üretilir; elle düzenlenmez. Aynı URL/künyenin birden çok '
                    'maddede kullanımı "cift_kullanim" alanında listelenir (Kaynakların yeniden '
                    'kullanımı için tek referans).',
        'uretim_tarihi': None,  # main doldurur
        'toplam_kaynak_kaydi': len(kayitlar),
        'kaynaklar': kayitlar,
        'cift_kullanim': cift,
    }
    import datetime
    kutuk['uretim_tarihi'] = datetime.date.today().isoformat()
    out = os.path.join(ROOT, 'kaynaklar', 'KAYNAK_KUTUGU.json')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(kutuk, f, ensure_ascii=False, indent=2)
    print(f'yazıldı: {out}')
    print(f'{len(kayitlar)} kaynak kaydı · {len(cift)} kaynak birden çok maddede kullanılıyor')
    return 0

if __name__ == '__main__':
    sys.exit(main())
