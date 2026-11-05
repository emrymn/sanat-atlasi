#!/usr/bin/env python3
"""Başyapıtlar (data/basyapitlar.json) ile ayrıntı verisini (data/eser_ayrintilari.json) karşılaştırıp
scripts/ayrinti/DURUM.md'yi yazar: akım akım (kronolojik) biten ve kalan eserler, eser başına nokta sayısı, toplam ilerleme,
sıradaki parti önerisi. Kullanım (depo kökünden): python3 scripts/ayrinti/durum.py
"""
import json
from datetime import date
from pathlib import Path

KOK = Path(__file__).resolve().parents[2]
PARTI = 20  # bir partide kaç eser: 87 kalan → 5 parti (DEVIR.md'deki plan)


def oku(yol):
    with open(yol, encoding='utf-8') as f:
        return json.load(f)


def main():
    basyapitlar = oku(KOK / 'data' / 'basyapitlar.json')['eserler']
    try:
        ayrintilar = oku(KOK / 'data' / 'eser_ayrintilari.json')['eserler']
    except (OSError, ValueError, KeyError):
        ayrintilar = []
    sanatcilar = {s['id']: s for s in oku(KOK / 'data' / 'sanatcilar.json')}
    akim_sira = {a['ad']: a['sira'] for a in oku(KOK / 'data' / 'akimlar.json')}
    biten = {e['anahtar']: len(e.get('noktalar', [])) for e in ayrintilar}

    gruplar = {}
    for b in basyapitlar:
        s = sanatcilar.get(b['sanatci'], {})
        akim = s.get('akim', '?')
        gruplar.setdefault(akim, []).append((b, s))
    sirali = sorted(gruplar.items(), key=lambda kv: akim_sira.get(kv[0], 999))

    toplam = len(basyapitlar)
    biten_sayi = sum(1 for b in basyapitlar if b['anahtar'] in biten)
    nokta_toplam = sum(biten.values())
    kalanlar = [b for b in basyapitlar if b['anahtar'] not in biten]
    yetim = [k for k in biten if k not in {b['anahtar'] for b in basyapitlar}]

    satirlar = [
        '# Rehberli inceleme · durum',
        '',
        f'Bu dosyayı `python3 scripts/ayrinti/durum.py` yazar ({date.today().isoformat()}). Elle düzenleme.',
        '',
        f'**Toplam: {biten_sayi} / {toplam} başyapıt bitti ({nokta_toplam} nokta; eser başına ortalama {nokta_toplam / biten_sayi:.1f}).** '
        f'Kalan: {len(kalanlar)}.' if biten_sayi else f'**Toplam: 0 / {toplam} başyapıt.**',
        '',
    ]
    if yetim:
        satirlar += [f'⚠️ Başyapıtlarda olmayan anahtarlar: {", ".join(yetim)}', '']
    satirlar += ['## Akım akım', '']
    for akim, liste in sirali:
        b_say = sum(1 for b, _ in liste if b['anahtar'] in biten)
        satirlar += [f'### {akim} · {b_say} / {len(liste)}', '', '| Eser | Sanatçı | Durum |', '|---|---|---|']
        for b, s in liste:
            n = biten.get(b['anahtar'])
            durum = f'✓ {n} nokta' if n else '—'
            satirlar.append(f"| {b['baslik']} | {s.get('ad', b['sanatci'])} | {durum} |")
        satirlar.append('')
    satirlar += ['## Kalanlar (basyapitlar.json sırasıyla, partiler hâlinde)', '']
    for i in range(0, len(kalanlar), PARTI):
        parti = kalanlar[i : i + PARTI]
        satirlar.append(f'- **Parti {i // PARTI + 1}:** ' + '; '.join(f"{b['baslik']} ({sanatcilar.get(b['sanatci'], {}).get('ad', b['sanatci'])}, `{b['anahtar']}`)" for b in parti))
    satirlar.append('')
    (KOK / 'scripts' / 'ayrinti' / 'DURUM.md').write_text('\n'.join(satirlar), encoding='utf-8')
    print(f'{biten_sayi} / {toplam} bitti, {nokta_toplam} nokta; DURUM.md yazıldı')


if __name__ == '__main__':
    main()
