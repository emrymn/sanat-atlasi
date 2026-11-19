#!/usr/bin/env python3
"""Aday dökümü: hangi tanıma maddesine hangi hazır ayrıntı kutusu (data/eser_ayrintilari.json) uyabilir?

  python3 scripts/tanima_kirpim/aday.py konu [konuId ...]     konu maddeleri + konunun eserlerindeki kutular
  python3 scripts/tanima_kirpim/aday.py sanatci [id ...]      "Nasıl tanırım?" metni + sanatçının başyapıt kutuları
Çıktıdaki "E3.2" = 3. eserin 2. kutusu (eşleştirme dosyasında {"e": "<anahtar>", "n": 2} olarak yazılır).
"""
import sys
from ortak import KOK, oku, eser_adi

ay = {e['anahtar']: e for e in oku(KOK / 'data/eser_ayrintilari.json')['eserler']}


def konu(secilen):
    for k in oku(KOK / 'data/ikonografi.json')['konular']:
        if secilen and k['id'] not in secilen:
            continue
        el = [(a, s) for a, s in k['eserler'] if a in ay]
        if not el:
            continue
        print(f"\n## {k['id']} · {k['ad']} ({len(k['eserler'])} eser)")
        for i, m in enumerate(k['tanima']):
            print(f"  M{i}: {m}")
        for j, (a, s) in enumerate(el):
            print(f"  E{j} {a} {s} · {ay[a]['baslik']}: " + ' | '.join(f"{n}.{p['ad']}" for n, p in enumerate(ay[a]['noktalar'])))


def sanatci(secilen):
    sl = oku(KOK / 'data/sanatcilar.json')
    sl = sl if isinstance(sl, list) else sl['sanatcilar']
    tn = oku(KOK / 'data/tanima_notlari.json')['notlar']
    for s in sl:
        if secilen and s['id'] not in secilen:
            continue
        t = s.get('taninma') or tn.get(s['id'])
        el = [e for e in ay.values() if e['sanatci'] == s['id']]
        if not t:
            continue
        print(f"\n## {s['id']} · {s['ad']} · {s['akim']}")
        print('  T: ' + t)
        for e in el:
            print(f"  {e['anahtar']} · {e['baslik']}: " + ' | '.join(f"{n}.{p['ad']}" for n, p in enumerate(e['noktalar'])))


if __name__ == '__main__':
    kip, *sec = sys.argv[1:]
    (konu if kip == 'konu' else sanatci)(set(sec))
