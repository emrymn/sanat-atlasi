#!/usr/bin/env python3
"""İş 189 · Başyapıt araştırması, 3. adım: modelin yazdığı ARASTIRMA.json dosyalarını mekanik olarak denetler.

Hiçbir modelin "doğrulandı" beyanı kanıt değildir; kanıt bu betiğin çıktısıdır. Denetlenenler:
  1. Kaynak dosyaları indirildiği gibi duruyor (sha256, KAYNAK.json).
  2. Her alıntı, adı verilen kaynak dosyasında BİREBİR geçiyor (yalnız boşluk farkı hoş görülür).
  3. İddiadaki her sayı (yıl, ölçü, adet) alıntıda da var.
  4. Alıntıda ihtiyat sözü varsa (probably, attributed, circa …) ihtiyat: true ve Türkçe iddiada da ihtiyat sözü var.
  5. Şema: künye alanları, bölüm başına en az iddia, kimlikler tekil, alıntı uzunluğu.

Çalıştır:  python3 scripts/basyapit_arastirma/dogrula.py [--parti N | QID …]
Çıkış kodu: hata varsa 1.
"""
import hashlib
import json
import re
import sys
import unicodedata
from pathlib import Path

BURASI = Path(__file__).resolve().parent
BOLUMLER = {'hikaye': 2, 'gorunen': 3, 'kompozisyon': 1, 'anlam': 2, 'onem': 2}
KUNYE = ('sanatci', 'tarih', 'teknik', 'olcu', 'yer')
EN_AZ_IDDIA = 14
IHTIYAT_KAYNAK = re.compile(
    r'\b(probabl[ye]|possibl[ye]|perhaps|may(?: have| be| represent| allude| refer)|might|could (?:be|have)|thought to|believed to|'
    r'attributed|ascribed|traditionally|according to|is said|reputedly|supposed|presumabl[ye]|likely|uncertain|unclear|unknown|'
    r'disputed|debated|suggest(?:s|ed|ing)?|appears? to|seems? to|circa|c\. ?\d|approximately|speculat\w+|interpret\w+|'
    r'muhtemelen|olabilir|düşünül\w+|sanıl\w+|atfedil\w+|rivayet\w*|tahmin\w*|yaklaşık|belirsiz|tartışmalı|öne sür\w+|inanıl\w+)',
    re.I)
IHTIYAT_TR = re.compile(
    r'(muhtemelen|olabilir|olasıl\w+|düşünül\w+|düşündür\w+|sanıl\w+|atfedil\w+|rivayet\w*|tahmin\w*|yaklaşık|dolay\w+|civar\w+|belirsiz|'
    r'kesin değil|tartış\w+|öne sür\w+|öner\w+|inanıl\w+|yorumlan\w+|görüş\w+|göre\b|sayıl\w+|kabul edil\w+|anlatıl\w+|söylen\w+|bilinm\w+|görün\w+)',
    re.I)
SAYI = re.compile(r'\d+(?:[.,]\d+)?')


def duz(s):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFC', s)).strip()


def sayilar(s):
    return {x.rstrip('0').rstrip('.') if '.' in x else x for x in (y.replace(',', '.') for y in SAYI.findall(s))}


def kanit(et, kayit, kaynaklar, hata, sayi_denetle=True, ihtiyat_denetle=True):
    k, a = kayit.get('kaynak'), kayit.get('alinti')
    if k not in kaynaklar:
        return hata(f'{et}: kaynak "{k}" bu eserin kaynak dosyalarında yok')
    if not isinstance(a, str) or not 15 <= len(duz(a)) <= 400:
        return hata(f'{et}: alıntı 15–400 karakter olmalı')
    if duz(a) not in kaynaklar[k]:
        return hata(f'{et}: alıntı {k} içinde birebir geçmiyor → "{duz(a)[:70]}…"')
    metin = kayit.get('iddia') or str(kayit.get('deger') or '')
    if sayi_denetle:
        eksik = sorted(sayilar(metin) - sayilar(a))
        if eksik:
            hata(f'{et}: iddiadaki sayı alıntıda yok: {", ".join(eksik)}')
    if ihtiyat_denetle and IHTIYAT_KAYNAK.search(a):
        if kayit.get('ihtiyat') is not True:
            hata(f'{et}: alıntıda ihtiyat sözü var ("{IHTIYAT_KAYNAK.search(a).group(0)}") ama ihtiyat: true değil')
        elif 'iddia' in kayit and not IHTIYAT_TR.search(metin):
            hata(f'{et}: ihtiyat: true ama Türkçe iddiada ihtiyat sözü yok')


def eser(qid):
    hatalar = []
    hata = hatalar.append
    kk, dosya = BURASI / 'kaynak' / qid, BURASI / 'eserler' / qid / 'ARASTIRMA.json'
    if not (kk / 'KAYNAK.json').exists():
        return ['kaynak indirilmemiş (kaynak_indir.py)']
    if not dosya.exists():
        return None
    kaynaklar = {}
    for ad, b in json.loads((kk / 'KAYNAK.json').read_text(encoding='utf-8'))['dosyalar'].items():
        ham = (kk / ad).read_bytes()
        if hashlib.sha256(ham).hexdigest() != b['sha256']:
            hata(f'{ad}: kaynak dosyası indirildikten sonra DEĞİŞTİRİLMİŞ (sha256 tutmuyor)')
        kaynaklar[ad] = duz(ham.decode('utf-8'))
    try:
        d = json.loads(dosya.read_text(encoding='utf-8'))
    except json.JSONDecodeError as h:
        return [f'ARASTIRMA.json ayrışmıyor: {h}']
    if d.get('anahtar') != qid:
        hata(f'anahtar "{d.get("anahtar")}" klasör adıyla aynı değil')
    for alan in KUNYE:
        v = (d.get('kunye') or {}).get(alan)
        if not isinstance(v, dict):
            hata(f'kunye.{alan} yok')
        elif v.get('deger') is None:
            if alan not in ' '.join(d.get('bulunamadi') or []):
                hata(f'kunye.{alan} boş ama bulunamadi listesinde anılmıyor')
        else:
            kanit(f'kunye.{alan}', v, kaynaklar, hata, sayi_denetle=alan in ('tarih', 'olcu'))
    iddialar = d.get('iddialar') or []
    if len(iddialar) < EN_AZ_IDDIA:
        hata(f'{len(iddialar)} iddia var; en az {EN_AZ_IDDIA} olmalı')
    kimlik, say, alintilar = set(), dict.fromkeys(BOLUMLER, 0), {}
    for c in iddialar:
        et = c.get('id', '?')
        if et in kimlik or not re.fullmatch(r'C\d{2}', str(et)):
            hata(f'{et}: kimlik tekil ve C01 biçiminde olmalı')
        kimlik.add(et)
        if c.get('bolum') not in BOLUMLER:
            hata(f'{et}: bolum "{c.get("bolum")}" geçersiz')
        else:
            say[c['bolum']] += 1
        if not isinstance(c.get('iddia'), str) or not 20 <= len(c['iddia']) <= 300 or c['iddia'].count('. ') > 1:
            hata(f'{et}: iddia 20–300 karakterlik tek cümle olmalı')
        if not isinstance(c.get('ihtiyat'), bool):
            hata(f'{et}: ihtiyat true/false olmalı')
        kanit(et, c, kaynaklar, hata)
        alintilar.setdefault(duz(str(c.get('alinti'))), []).append(et)
    for b, n in say.items():
        if n < BOLUMLER[b] and b not in ' '.join(d.get('bulunamadi') or []):
            hata(f'bolum {b}: {n} iddia (en az {BOLUMLER[b]}); kaynakta yoksa bulunamadi listesine "{b}: …" yaz')
    for a, l in alintilar.items():
        if len(l) > 2:
            hata(f'aynı alıntı {len(l)} iddiada kullanılmış ({", ".join(l)}); en çok 2')
    for i, c in enumerate(d.get('celiskiler') or []):
        for yan in ('a', 'b'):
            kanit(f'celiskiler[{i}].{yan}', c.get(yan) or {}, kaynaklar, hata, sayi_denetle=False, ihtiyat_denetle=False)
    return hatalar


def main():
    secim = json.loads((BURASI / 'secim.json').read_text(encoding='utf-8'))['eserler']
    a = sys.argv[1:]
    if '--parti' in a:
        n = int(a[a.index('--parti') + 1])
        secim = [e for e in secim if e['parti'] == n]
    elif a:
        secim = [e for e in secim if e['anahtar'] in a]
    gecti = kaldi = yok = 0
    for e in secim:
        h = eser(e['anahtar'])
        if h is None:
            yok += 1
            continue
        gecti, kaldi = gecti + (not h), kaldi + bool(h)
        print(f"{'GEÇTİ' if not h else 'KALDI'}  {e['anahtar']:<10} {e['baslik']}")
        for x in h:
            print(f'       - {x}')
    print(f'\n{gecti} geçti · {kaldi} kaldı · {yok} henüz yazılmadı')
    sys.exit(1 if kaldi else 0)


if __name__ == '__main__':
    main()
