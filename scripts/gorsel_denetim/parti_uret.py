#!/usr/bin/env python3
"""Görsel denetimi partileri (İş 103): Mistral'in kod ajanı (ya da başka bir göz) depodaki 400 px küçük kopyalara bakıp
her eser için karar versin diye 50'şer eserlik listeler üretir. Talimat: scripts/gorsel_denetim/TALIMAT.md

  python3 scripts/gorsel_denetim/parti_uret.py            # henüz denetlenmemiş bütün yerel görseller, 50'şer
  python3 scripts/gorsel_denetim/parti_uret.py --deneme   # 40 eserlik rastgele deneme partisi (parti_000.json)

Bir eser, kararı scripts/gorsel_denetim/sonuc_*.json'da ya da data/gorsel_kararlari.json'da varsa yeniden listelenmez.
Görsel üzerine karar yalnız fotoğrafın kendisi hakkındadır; eser–sanatçı eşleşmesine dokunulmaz (CLAUDE.md doğruluk kuralı)."""
import json, random, sys
from pathlib import Path

KOK = Path(__file__).resolve().parents[2]
BURASI = Path(__file__).resolve().parent
PARTI = 50


def yerel_anahtar(g):
    return f"{g['k']}:{g.get('d') or g.get('i') or g.get('u') or ''}"


def main():
    yerel = json.loads((KOK / 'data/yerel_gorseller.json').read_text())['gorseller']
    sanatcilar = {s['id']: s for s in json.loads((KOK / 'data/sanatcilar.json').read_text())}
    ob = json.loads((KOK / 'data/eserler_onbellek.json').read_text())['sanatcilar']
    bilinen = set()
    for p in BURASI.glob('sonuc_*.json'):
        bilinen |= {s['anahtar'] for s in json.loads(p.read_text())}
    isler = []
    for sid, v in ob.items():
        for e in v.get('eserler', []):
            g = (e.get('gorseller') or [None])[0]
            a = g and yerel_anahtar(g)
            if not a or a not in yerel or a in bilinen or e.get('pekistirme') is False:
                continue
            gorsel = f'gorseller/k/{yerel[a]}.jpg'
            if not (KOK / gorsel).exists():
                continue
            s = sanatcilar.get(sid, {})
            isler.append({'anahtar': a, 'gorsel': gorsel, 'sanatci': s.get('ad', sid), 'akim': s.get('akim'),
                          'baslik': e['baslik'], 'yil': e.get('yil')})
    if '--deneme' in sys.argv:
        random.seed(103)
        parti = random.sample(isler, min(40, len(isler)))
        (BURASI / 'parti_000.json').write_text(json.dumps(parti, ensure_ascii=False, indent=1) + '\n')
        print(f'parti_000.json: {len(parti)} eser (deneme)')
        return
    eski = sorted(BURASI.glob('parti_[0-9][0-9][0-9].json'))
    no = max([int(p.stem.split('_')[1]) for p in eski] + [0]) + 1
    for i in range(0, len(isler), PARTI):
        (BURASI / f'parti_{no:03d}.json').write_text(json.dumps(isler[i:i + PARTI], ensure_ascii=False, indent=1) + '\n')
        no += 1
    print(f'{len(isler)} eser · {-(-len(isler) // PARTI)} parti')


if __name__ == '__main__':
    main()
