#!/usr/bin/env python3
"""Antigravity'de (Gemini 4 Neon, abonelik kotası) yazılan sanatçı hikâyesini denetler ve data/sanatci_hikayeleri.json'a ekler.

Akış: Antigravity'de scripts/hikaye_antigravity.md'deki istem (SANATCI yerine kimlik) → Neon ayrı bir çalışma ağacında
hikaye-deneme/<id>.json, -arastirma.md, -denetim.md yazar, dalını push eder → Claude dosyayı okur, olgu hatalarını
düzeltir → bu betik biçimi denetler ve ekler.

Denetim (kod): yapı, bölüm ve kelime sayıları, eserler yalnız bizim listemizden (qid; değilse atılır), bağlantılar
bizdeki sanatçılarla eşlenir, kaynaklar gerçek https adresi. Olgu doğruluğunu kod denetleyemez.

Kullanım:
  python3 scripts/hikaye_ekle.py hikaye-deneme/vermeer.json --sanatci johannes-vermeer          # yalnız denetle
  python3 scripts/hikaye_ekle.py hikaye-deneme/vermeer.json --sanatci johannes-vermeer --ekle   # denetle + ekle
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


def denetle(h, sid, sanatcilar, onbellek):
    sorunlar, uyarilar = [], []
    for alan in ('baslik', 'alt_baslik', 'giris', 'bolumler', 'kapanis', 'baglantilar', 'kaynaklar'):
        if alan not in h:
            sorunlar.append(f'"{alan}" yok')
    if sorunlar:
        return sorunlar, uyarilar, []
    for i, b in enumerate(h['bolumler'], 1):
        for alan in ('baslik', 'yillar', 'paragraflar', 'eserler'):
            if alan not in b:
                sorunlar.append(f'{i}. bölümde "{alan}" yok')
    if not 4 <= len(h['bolumler']) <= 7:
        uyarilar.append(f"{len(h['bolumler'])} bölüm (4–7 bekleniyor)")
    eserler = hu.eser_listesi(sid, onbellek)
    atilan = hu.temizle(h, eserler, sanatcilar, sid)
    if atilan:
        uyarilar.append(f"listede olmayan {len(atilan)} eser atıldı: {', '.join(e['qid'] for e in atilan)}")
    if not 1800 <= h['kelime'] <= 3400:
        uyarilar.append(f"{h['kelime']} kelime (2200–3000 bekleniyor)")
    uzun = [p for b in h['bolumler'] for p in b['paragraflar'] if len(p.split()) > 170]
    if uzun:
        uyarilar.append(f'{len(uzun)} paragraf 170 kelimeden uzun')
    kotu = [k for k in h['kaynaklar'] if not str(k.get('adres', '')).startswith('https://')]
    if kotu:
        sorunlar.append(f'{len(kotu)} kaynağın adresi https değil')
    if len(h['kaynaklar']) < 10:
        uyarilar.append(f"yalnız {len(h['kaynaklar'])} kaynak")
    bos = [b['baslik'] for b in h['bolumler'] if not b['eserler']]
    if bos:
        uyarilar.append(f'eseri olmayan bölümler: {", ".join(bos)}')
    return sorunlar, uyarilar, atilan


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('dosya')
    ap.add_argument('--sanatci', required=True)
    ap.add_argument('--ekle', action='store_true', help='denetimden geçerse data/sanatci_hikayeleri.json\'a yaz')
    g = ap.parse_args()

    sanatcilar, onbellek = hu.katalog()
    if g.sanatci not in sanatcilar:
        sys.exit(f'Sanatçı yok: {g.sanatci}')
    h = json.loads(Path(g.dosya).read_text(encoding='utf-8'))
    sorunlar, uyarilar, _ = denetle(h, g.sanatci, sanatcilar, onbellek)
    print(f"{sanatcilar[g.sanatci]['ad']}: {h.get('kelime', 0):,} kelime, {len(h.get('bolumler', []))} bölüm, "
          f"{sum(len(b.get('eserler', [])) for b in h.get('bolumler', []))} eser, {len(h.get('kaynaklar', []))} kaynak, "
          f"{sum(1 for b in h.get('baglantilar', []) if b.get('id'))}/{len(h.get('baglantilar', []))} bağlantı eşlendi")
    for u in uyarilar:
        print('  uyarı:', u)
    for s in sorunlar:
        print('  SORUN:', s)
    if sorunlar:
        sys.exit('Denetimden geçmedi.')
    if g.ekle:
        cikti = hu.oku(hu.CIKTI) if hu.CIKTI.exists() else {'surum': 1, 'sanatcilar': {}}
        h['kaynaklar'] = hu.kaynak_ayikla(h['kaynaklar'])
        cikti['sanatcilar'][g.sanatci] = {**h, 'model': 'gemini-4-neon (Antigravity)', 'denetci': 'Antigravity + Claude',
                                          'duzeltilen': None, 'olusturma': time.strftime('%Y-%m-%d')}
        hu.yaz(hu.CIKTI, cikti)
        print(f'Eklendi: {hu.CIKTI.relative_to(KOK)}')


if __name__ == '__main__':
    main()
