#!/usr/bin/env python3
"""İş 189, 6. adım: okumalar/parti_NN.json'daki yakın okumaları data/basyapitlar.json'a, ayrıntı noktalarını
data/eser_ayrintilari.json'a ekler (aynı anahtar varsa yerine koyar). Görsel adı secim.json'dan gelir.
Çalıştır: python3 scripts/basyapit_arastirma/birlestir.py okumalar/parti_01.json [...]"""
import json
import sys
from pathlib import Path

KOK = Path(__file__).resolve().parents[2]
BURASI = Path(__file__).resolve().parent
oku = lambda p: json.loads(Path(p).read_text(encoding='utf-8'))
yaz = lambda p, d: Path(p).write_text(json.dumps(d, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
secim = {e['anahtar']: e for e in oku(BURASI / 'secim.json')['eserler']}
by, ay = oku(KOK / 'data/basyapitlar.json'), oku(KOK / 'data/eser_ayrintilari.json')
ALAN = ('anahtar', 'sanatci', 'baslik', 'ozgun', 'tarih', 'muze', 'ozet', 'bolumler', 'bak')
for dosya in sys.argv[1:]:
    for e in oku(BURASI / dosya if not Path(dosya).exists() else dosya):
        q = e['anahtar']
        assert q in secim and (BURASI / 'eserler' / q / 'ARASTIRMA.json').exists(), q
        kayit = {k: e[k] for k in ALAN}
        by['eserler'] = [x for x in by['eserler'] if x['anahtar'] != q] + [kayit]
        ay['eserler'] = [x for x in ay['eserler'] if x['anahtar'] != q] + [{
            'anahtar': q, 'sanatci': e['sanatci'], 'baslik': e['baslik'], 'gorsel': secim[q]['gorsel'], 'noktalar': e['noktalar']}]
        print('eklendi', q, e['baslik'])
yaz(KOK / 'data/basyapitlar.json', by)
yaz(KOK / 'data/eser_ayrintilari.json', ay)
print(len(by['eserler']), 'başyapıt ·', len(ay['eserler']), 'ayrıntılı eser')
