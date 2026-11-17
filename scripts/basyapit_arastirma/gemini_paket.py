#!/usr/bin/env python3
"""İş 189, 5. adım: Gemini'ye verilecek anlam denetimi paketini üretir (model kullanmaz).

Her parti için gemini/parti_NN.txt: TALIMAT.md'deki Gemini komutu + partinin iddia–alıntı çiftleri (künye ve çelişkiler hariç;
onlar betikle denetlendi). Dosyanın tamamını Gemini'ye yapıştır.
Çalıştır:  python3 scripts/basyapit_arastirma/gemini_paket.py [N …]   (sayı verilmezse yazılmış bütün partiler)
"""
import json
import re
import sys
from pathlib import Path

BURASI = Path(__file__).resolve().parent
komut = re.search(r'## Gemini komutu.*?```text\n(.*?)```', (BURASI / 'TALIMAT.md').read_text(encoding='utf-8'), re.S).group(1)
komut = komut.replace('Ekteki JSON dosyalarında "iddialar" listesinin her öğesi',
                      'Aşağıdaki listede her satır grubu')
secim = json.loads((BURASI / 'secim.json').read_text(encoding='utf-8'))['eserler']
partiler = [int(x) for x in sys.argv[1:]] or sorted({e['parti'] for e in secim})
(BURASI / 'gemini').mkdir(exist_ok=True)
for n in partiler:
    satir, say = [], 0
    for e in (e for e in secim if e['parti'] == n):
        p = BURASI / 'eserler' / e['anahtar'] / 'ARASTIRMA.json'
        if not p.exists():
            continue
        d = json.loads(p.read_text(encoding='utf-8'))
        kaynak = {f.name: re.sub(r'\s+', ' ', f.read_text(encoding='utf-8')) for f in (BURASI / 'kaynak' / e['anahtar']).glob('*.txt')}
        satir.append(f"\n### {d['anahtar']} · {d['baslik_tr']} ({e['sanatci']})")
        for c in d['iddialar']:
            say += 1
            a = re.sub(r'\s+', ' ', c['alinti']).strip()
            m = kaynak.get(c['kaynak'], '')
            i = m.find(a)
            bas = max(m.rfind('. ', 0, max(i - 150, 0)), 0) if i > 0 else 0
            son = m.find('. ', i + len(a) + 100)
            baglam = m[bas:son + 1 if son > 0 else len(m)].strip(' .') if i >= 0 else ''
            satir.append(f"{c['id']} [{c['bolum']}]{' [ihtiyat]' if c.get('ihtiyat') else ''}\n  İDDİA: {c['iddia']}\n  ALINTI: {a}"
                         + (f"\n  BAĞLAM (alıntının çevresi, yalnız kimden/neyden söz edildiğini anlamak için): …{baglam}…" if baglam and baglam != a else ''))
    if not say:
        continue
    (BURASI / 'gemini' / f'parti_{n:02d}.txt').write_text(komut + '\nLİSTE\n' + '\n'.join(satir) + '\n', encoding='utf-8')
    print(f'parti {n}: {say} iddia → gemini/parti_{n:02d}.txt')
