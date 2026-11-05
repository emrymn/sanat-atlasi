#!/usr/bin/env python3
"""Başyapıt anahtarlarından görsel adlarını ve R2 adreslerini çıkarır (TALIMAT.md §2, adım 1–3).
Kullanım: python3 scripts/ayrinti/yardimci/coz.py <çıktı.json> [anahtar ...]
Anahtar verilmezse ayrıntısı henüz olmayan bütün başyapıtlar listelenir. Çıktı: [{anahtar, sanatci, baslik, ad, b, d}]
(b: 1280 px kopya adresi; d: 4096 px kopya adresi ya da null)."""
import json
import sys
from pathlib import Path

KOK = Path(__file__).resolve().parents[3]
oku = lambda p: json.load(open(KOK / p, encoding='utf-8'))


def main():
    cikti = sys.argv[1]
    istenen = set(sys.argv[2:])
    bs = oku('data/basyapitlar.json')['eserler']
    ob = oku('data/eserler_onbellek.json')['sanatcilar']
    yerel = oku('data/yerel_gorseller.json')['gorseller']
    kay = oku('data/gorsel_kaynagi.json')
    dev = set(kay['devasa'])
    try:
        var = {e['anahtar'] for e in oku('data/eser_ayrintilari.json')['eserler']}
    except (OSError, ValueError, KeyError):
        var = set()
    out = []
    for b in bs:
        if istenen and b['anahtar'] not in istenen:
            continue
        if not istenen and b['anahtar'] in var:
            continue
        es = ob.get(b['sanatci'], {}).get('eserler', [])
        e = next((x for x in es if (x.get('qid') and x['qid'] == b['anahtar']) or f"{b['sanatci']}|{x.get('baslik')}" == b['anahtar']), None)
        if not e or not e.get('gorseller'):
            print('görsel yok:', b['anahtar'])
            continue
        g = e['gorseller'][0]
        ad = yerel.get(f"{g['k']}:{g.get('d') or g.get('i') or g.get('u') or ''}")
        if not ad:
            print('yerel kopya yok:', b['anahtar'])
            continue
        sur = kay.get('surumler', {}).get(ad)
        bsur = kay.get('b_surumler', {}).get(ad)
        out.append({
            'anahtar': b['anahtar'], 'sanatci': b['sanatci'], 'baslik': b['baslik'], 'ad': ad,
            'b': f"{kay['adres']}/b/{ad}{'-' + bsur if bsur else ''}.jpg",
            'd': f"{kay['adres']}/d/{ad}{'-' + sur if sur else ''}.jpg" if ad in dev else None,
        })
        print(b['anahtar'], '|', b['baslik'][:40], '|', ad, '| 4096 var' if ad in dev else '| yalnız 1280')
    json.dump(out, open(cikti, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(out), 'eser →', cikti)


if __name__ == '__main__':
    main()
