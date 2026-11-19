#!/usr/bin/env python3
"""eslesme_konu.txt (Mi=Ej.n) → data/tanima_kirpimlari.json "konular" bölümü (hazır ayrıntı kutularından).

  python3 scripts/tanima_kirpim/donustur.py
Kutu ve ad data/eser_ayrintilari.json'dan kopyalanır (açıklama metni kopyalanmaz: uygulama aynı kutuyu
ayrıntı kaydında bulur ve görüntüleyiciyi o kayıtla açar); görsel adı uygulamadaki ilk görselle karşılaştırılır.
Elle seçilen kutular (yeni_konu.json, yeni_sanatci.json) ve sanatçı eşleşmeleri (eslesme_sanatci.json) de eklenir.
"""
import json
import re
from ortak import KOK, VERI, oku, ilk_gorsel, eser_bul

BURASI = KOK / 'scripts' / 'tanima_kirpim'
ay = {e['anahtar']: e for e in oku(KOK / 'data/eser_ayrintilari.json')['eserler']}
konular = {k['id']: k for k in oku(KOK / 'data/ikonografi.json')['konular']}


def kutu(e, n):
    p = ay[e]['noktalar'][n]
    return {'x': p['x'], 'y': p['y'], 'w': p['w'], 'h': p['h']}, p


def konu_eslesmeleri():
    sonuc = {}
    for satir in (BURASI / 'eslesme_konu.txt').read_text(encoding='utf-8').splitlines():
        satir = satir.strip()
        if not satir or satir.startswith('#'):
            continue
        kid, *esler = satir.split()
        k = konular[kid]
        el = [(a, s) for a, s in k['eserler'] if a in ay]
        liste = []
        for es in esler:
            m = re.fullmatch(r'M(\d+)=E(\d+)\.(\d+)', es)
            assert m, (kid, es)
            mi, ej, n = map(int, m.groups())
            assert mi < len(k['tanima']), (kid, es)
            a, s = el[ej]
            _, ad = ilk_gorsel(s, a)
            assert ad == ay[a]['gorsel'], (kid, es, ad, ay[a]['gorsel'])
            b, p = kutu(a, n)
            liste.append({'madde': mi, 'anahtar': a, 'sanatci': s, 'gorsel': ad, 'ad': p['ad'], **b})
        sonuc[kid] = sorted(liste, key=lambda x: x['madde'])
    return sonuc


def sanatci_eslesmeleri():
    sonuc = {}
    for satir in (BURASI / 'eslesme_sanatci.txt').read_text(encoding='utf-8').splitlines():
        if not satir.strip() or satir.startswith('#'):
            continue
        sid, a, n, ad = [x.strip() for x in satir.split(' | ')]
        assert a in ay and ay[a]['sanatci'] == sid, satir
        _, g = ilk_gorsel(sid, a)
        assert g == ay[a]['gorsel'], (satir, g)
        b, p = kutu(a, int(n))
        assert 2 <= len(ad) <= 34, satir
        sonuc.setdefault(sid, []).append({'ad': ad, 'anahtar': a, 'sanatci': sid, 'gorsel': g, **b})
    return sonuc


def ekle(hedef, dosya):
    yol = BURASI / dosya
    if not yol.exists():
        return
    for kid, liste in oku(yol).items():
        for x in liste:
            if 'e' in x:  # hazır kutudan: {"e": anahtar, "n": nokta, ...}
                x['anahtar'] = x['e']
                x.setdefault('sanatci', ay[x['e']]['sanatci'])
                b, p = kutu(x.pop('e'), x.pop('n'))
                x = {**x, **b}
                x.setdefault('ad', p['ad'])
            assert eser_bul(x['sanatci'], x['anahtar']), (kid, x['anahtar'])
            if 'gorsel' not in x:
                _, x['gorsel'] = ilk_gorsel(x['sanatci'], x['anahtar'])
            hedef.setdefault(kid, []).append(x)
    for l in hedef.values():
        if l and 'madde' in l[0]:
            l.sort(key=lambda x: x['madde'])


if __name__ == '__main__':
    k = konu_eslesmeleri()
    ekle(k, 'yeni_konu.json')
    s = sanatci_eslesmeleri()
    ekle(s, 'yeni_sanatci.json')
    veri = {
        'surum': 1,
        'aciklama': "Tanıma kırpımları (İş 193): konu sayfalarındaki 'Resimde nasıl tanınır?' maddelerine ve sanatçı sayfasındaki 'Nasıl tanırım?' notuna eserden yakın plan. x, y, w, h görselin en/boyuna oranla (sol üst + boy). Üretim: scripts/tanima_kirpim/.",
        'konular': dict(sorted(k.items())),
        'sanatcilar': dict(sorted(s.items())),
    }
    VERI.write_text(json.dumps(veri, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f"{sum(map(len, k.values()))} konu kırpımı ({len(k)} konu), {sum(map(len, s.values()))} sanatçı kırpımı ({len(s)} sanatçı)")
