#!/usr/bin/env python3
"""Görseli daha büyük bir dosyaya geçen başyapıtların noktalarını yeni kadraja göre günceller (İş 178).

data/gorsel_iyilestirme.json'a eklenen bir dosya Mac'te scripts/devasa_indir.py ile iner, scripts/r2_yukle.py ile sürüm
ekli adla yüklenir; data/gorsel_kaynagi.json'da o görselin sürümü değişir (ya da görsel ilk kez `devasa` listesine
girer). Yeni fotoğrafın kadrajı eskisinden biraz farklı olabileceği için noktalar önceden, aynı dosyanın Commons'taki
küçük hâli üstünde dönüştürülüp doğrulandı ve scripts/ayrinti/bekleyen_koordinatlar.json'da bekletildi.

Bu betik görseli yenilenmiş olanları data/eser_ayrintilari.json'a yazar ve bekleyenlerden siler; yenilenmemiş olanlara
dokunmaz. Görsel yenilenmeden çalıştırmak zararsızdır.

Çalıştır (depo kökünde, r2_yukle.py'den sonra):  python3 scripts/ayrinti/yardimci/koordinat_uygula.py
Sonra: python3 scripts/ayrinti/denetle.py ve data/eser_ayrintilari.json + scripts/ayrinti/bekleyen_koordinatlar.json gönderilir.
"""
import json
from pathlib import Path

KOK = Path(__file__).resolve().parents[3]
BEKLEYEN = KOK / 'scripts/ayrinti/bekleyen_koordinatlar.json'
AYRINTI = KOK / 'data/eser_ayrintilari.json'
KAYNAK = KOK / 'data/gorsel_kaynagi.json'


def main():
    if not BEKLEYEN.exists():
        print('Bekleyen koordinat yok.')
        return
    bek = json.loads(BEKLEYEN.read_text(encoding='utf-8'))
    kay = json.loads(KAYNAK.read_text(encoding='utf-8'))
    dev = set(kay.get('devasa', []))
    surum = kay.get('surumler', {})
    ay = json.loads(AYRINTI.read_text(encoding='utf-8'))
    kayit = {e['anahtar']: e for e in ay['eserler']}
    yazilan = []
    for anahtar, b in list(bek['eserler'].items()):
        g = b['gorsel']
        yenilendi = surum.get(g) != b['surum_once'] or (g in dev and not b['devasa_once'])
        if not yenilendi:
            print(f'bekliyor: {anahtar} ({g}; görsel henüz yenilenmedi)')
            continue
        e = kayit.get(anahtar)
        if not e or e['gorsel'] != g:
            print(f'atlandı: {anahtar} (ayrıntı kaydı yok ya da görseli değişmiş)')
            continue
        yeni = {n['ad']: n for n in b['noktalar']}
        for n in e['noktalar']:
            if n['ad'] in yeni:
                n.update({k: yeni[n['ad']][k] for k in ('x', 'y', 'w', 'h')})
        del bek['eserler'][anahtar]
        yazilan.append(anahtar)
    if yazilan:
        AYRINTI.write_text(json.dumps(ay, ensure_ascii=False, indent=1), encoding='utf-8')
        BEKLEYEN.write_text(json.dumps(bek, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'{len(yazilan)} başyapıtın noktaları yeni görsele göre güncellendi; {len(bek["eserler"])} bekliyor.')


if __name__ == '__main__':
    main()
