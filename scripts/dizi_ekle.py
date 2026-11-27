#!/usr/bin/env python3
"""Dizi bölümünü (diziler/taslak/<id>.json) denetler ve data/diziler.json'a ekler. Plan: diziler/PLAN.md.

Denetim (kod): yapı, bölüm ve kelime sayıları, sanatçılar bizde var mı, eserler yalnız o sanatçının listesinden
(qid) ya da kursun Commons görsellerinden (değilse atılır), kaynaklar gerçek https adresi. Olgu doğruluğunu kod denetleyemez.

Kullanım:
  python3 scripts/dizi_ekle.py diziler/taslak/dueller-leonardo-michelangelo.json          # yalnız denetle
  python3 scripts/dizi_ekle.py diziler/taslak/dueller-leonardo-michelangelo.json --ekle   # denetle + ekle
"""
import argparse
import importlib.util
import json
import sys
import time
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
_spec = importlib.util.spec_from_file_location('hikaye_uret', KOK / 'scripts' / 'hikaye_uret.py')
hu = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(hu)

CIKTI = KOK / 'data' / 'diziler.json'
PLAN_DIZILER = {
    'dueller': 'Düellolar', 'dostluklar': 'Dostluklar ve Kopuşlar', 'ayni-konu': 'Aynı Konu, İki Usta',
    'skandallar': 'Skandal Tablolar', 'hastalik': 'Hastalık ve Delilik', 'para': 'Para', 'inanc': 'İnanç Krizi',
    'olumler': 'Ölümler', 'kiskanclik': 'Kıskançlık', 'efsaneler': 'Yalanlar ve Efsaneler', 'intikam': 'İntikam',
    'cokusler': 'Çöküşler',
}


def kelime(h):
    metin = h['giris'] + [p for b in h['bolumler'] for p in b['paragraflar']] + h['kapanis']
    return sum(len(p.split()) for p in metin)


def denetle(h, sanatcilar, onbellek):
    sorunlar, uyarilar = [], []
    for alan in ('dizi', 'baslik', 'alt_baslik', 'sanatcilar', 'giris', 'bolumler', 'kapanis', 'kaynaklar'):
        if alan not in h:
            sorunlar.append(f'"{alan}" yok')
    if sorunlar:
        return sorunlar, uyarilar
    if h['dizi'] not in PLAN_DIZILER:
        sorunlar.append(f'bilinmeyen dizi: {h["dizi"]}')
    bilinmeyen = [s for s in h['sanatcilar'] if s not in sanatcilar]
    if bilinmeyen:
        sorunlar.append(f'bizde olmayan sanatçı: {", ".join(bilinmeyen)}')
    if not 3 <= len(h['bolumler']) <= 6:
        uyarilar.append(f"{len(h['bolumler'])} bölüm (3–5 bekleniyor)")
    commons = {s: {e.get('commons_dosya') for e in sanatcilar.get(s, {}).get('kurs_eserleri') or []} for s in h['sanatcilar']}
    for i, b in enumerate(h['bolumler'], 1):
        for alan in ('baslik', 'yillar', 'paragraflar', 'eserler'):
            if alan not in b:
                sorunlar.append(f'{i}. bölümde "{alan}" yok')
        kalan = []
        for e in b.get('eserler', []):
            s = e.get('sanatci')
            liste = {x.get('qid') for x in (onbellek.get(s) or {}).get('eserler', [])}
            if e.get('qid') and e['qid'] in liste or e.get('commons') and e['commons'] in commons.get(s, set()):
                kalan.append(e)
            else:
                uyarilar.append(f'{i}. bölüm: listede olmayan eser atıldı ({s} · {e.get("qid") or e.get("commons")})')
        b['eserler'] = kalan
    if sorunlar:
        return sorunlar, uyarilar
    h['kelime'] = kelime(h)
    if not 1000 <= h['kelime'] <= 1700:
        uyarilar.append(f"{h['kelime']} kelime (1100–1500 bekleniyor)")
    uzun = [p for b in h['bolumler'] for p in b['paragraflar'] if len(p.split()) > 170]
    if uzun:
        uyarilar.append(f'{len(uzun)} paragraf 170 kelimeden uzun')
    if [k for k in h['kaynaklar'] if not str(k.get('adres', '')).startswith('https://')]:
        sorunlar.append('https olmayan kaynak adresi var')
    if len(h['kaynaklar']) < 6:
        uyarilar.append(f"yalnız {len(h['kaynaklar'])} kaynak")
    bos = [b['baslik'] for b in h['bolumler'] if not b['eserler']]
    if bos:
        uyarilar.append(f'eseri olmayan bölümler: {", ".join(bos)}')
    return sorunlar, uyarilar


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('dosya')
    ap.add_argument('--ekle', action='store_true', help='denetimden geçerse data/diziler.json\'a yaz')
    g = ap.parse_args()
    yol = Path(g.dosya)
    bid = yol.stem
    h = json.loads(yol.read_text(encoding='utf-8'))
    sanatcilar, onbellek = hu.katalog()
    sorunlar, uyarilar = denetle(h, sanatcilar, onbellek)
    for s in sorunlar:
        print('SORUN:', s)
    for u in uyarilar:
        print('uyarı:', u)
    if sorunlar:
        sys.exit('Denetimden geçmedi.')
    eser = sum(len(b['eserler']) for b in h['bolumler'])
    print(f"{h['baslik']}: {h['kelime']} kelime, {len(h['bolumler'])} bölüm, {eser} eser, {len(h['kaynaklar'])} kaynak")
    if g.ekle:
        cikti = hu.oku(CIKTI) if CIKTI.exists() else {'surum': 1, 'diziler': [], 'bolumler': {}}
        h['kaynaklar'] = hu.kaynak_ayikla(h['kaynaklar'])
        cikti['bolumler'][bid] = {**h, 'model': 'gemini-4-neon (Gemini uygulaması, Görev)', 'denetci': 'Gemini + Claude',
                                  'olusturma': time.strftime('%Y-%m-%d')}
        dizi = next((d for d in cikti['diziler'] if d['id'] == h['dizi']), None)
        if dizi is None:
            dizi = {'id': h['dizi'], 'ad': PLAN_DIZILER[h['dizi']], 'aciklama': '', 'bolumler': []}
            cikti['diziler'].append(dizi)
            cikti['diziler'].sort(key=lambda d: list(PLAN_DIZILER).index(d['id']))
        if bid not in dizi['bolumler']:
            dizi['bolumler'].append(bid)
        hu.yaz(CIKTI, cikti)
        print(f'Eklendi: {CIKTI.relative_to(KOK)}')


if __name__ == '__main__':
    main()
