#!/usr/bin/env python3
"""Sesli rehber (uygulamada "Dinleyerek bak") için anlatımları Azure'un doğal Türkçe sesiyle kaydeder.

iPhone'un Türkçe sentez sesi (Yelda) robotik; Emre beğenmedi. Bu betik rehberin okuduğu her metin parçasını bir kez
Azure Konuşma hizmetine (metin okuma) okutur, MP3'ü ve kelime zamanlamalarını yazar, isterse Cloudflare R2'ye yükler.
Uygulama bir parçanın sesini R2'de bulursa onu çalar, bulamazsa telefonun sesine döner.

Parçalar (uygulamadaki DinlemePlani'nin okuduğu metinler; nora-sanat NoraCekirdek/Dinle/DinlemePlani.swift):
  - data/eser_notlari.json: eserin notu (açılışta künyeden sonra)
  - data/eser_hikayeleri.json: "olay", "ressam", "gozden" paragrafları ve "kim" noktalarının metni
  - data/eser_ayrintilari.json, data/yuruyus.json: noktaların metni
  - künye ("Başlık. Sanatçı, tarih.") uygulamada eserin görünen adından kurulur; burada kurulamaz. Uygulama künyeyi
    telefonun sesiyle okur ya da (ileride) kendi listesini verir.
  - sabit sözler: "Şimdi tablonun tamamına bir kez daha bak.", "Bir süre yalnız bak."

Sözleşme (uygulama aynısını yapmalı):
  metin  = noktala(boşlukları sadeleştir(NFC(parça)))   # sonunda .!?…"”») yoksa "." eklenir (DinlemeKurallari.noktala)
  anahtar = sha1(metin, UTF-8) onaltılık, ilk 16 hane
  ses dosyası:  <R2_GENEL_ADRES>/ses/<ses>/<anahtar>.mp3
  zamanlama:    <R2_GENEL_ADRES>/ses/<ses>/<anahtar>.json  {"metin", "sure", "kelimeler": [[başlangıç_sn, harf_başı, harf_sonu], ...], "tahmini"}
  dizin:        data/ses_dizini.json  {"ses", "parcalar": {anahtar: süre_sn}}  (uygulama hangi parçanın kaydı olduğunu buradan bilir)

Kelime zamanlaması: Azure'un REST ucu kelime sınırlarını vermez (Speech SDK verir). Burada süre MP3'ün boyundan
(sabit 48 kbit/sn) bulunur ve kelimelere harf sayısına, cümle ve virgül duraklamalarına göre paylaştırılır
("tahmini": true). Altyazının kelime kelime aydınlanması için yeterince yakın; tam zamanlama gerekirse SDK'ya geçilir.

Anahtar: bulut oturumunda "Sanat Atlası" ortamının ağ sırrı (swedencentral.tts.speech.microsoft.com,
Ocp-Apim-Subscription-Key) isteklere kendiliğinden eklenir. Mac'te:  export AZURE_SES_ANAHTARI=...  (Azure portalı →
sanat-ses kaynağı → Anahtarlar ve Uç Nokta → KEY 1). Bölge: AZURE_SES_BOLGE (varsayılan swedencentral).

Ücretsiz katman (F0) ayda 500 bin karakter okur; betik --en-cok ile bütçeyi aşmaz, kaldığı yerden sürer.

Kullanım (depo kökünde):
  python3 scripts/ses_uret.py --dene                 # 3 eser, Emel ve Ahmet: ses_deneme/ altına (yüklemez)
  python3 scripts/ses_uret.py --ses Emel             # rehberi olan bütün eserler: ses/<ses>/ altına, dizini yazar
  python3 scripts/ses_uret.py --ses Emel --yukle     # üretileni R2'ye yükler (r2_yukle.py'nin ortam değişkenleri)
  python3 scripts/ses_uret.py --say                  # yalnız parça ve karakter sayısını yazar (istek göndermez)
"""
import argparse
import hashlib
import json
import os
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.request
from pathlib import Path
from xml.sax.saxutils import escape

KOK = Path(__file__).resolve().parent.parent
SESLER = {'Emel': 'tr-TR-EmelNeural', 'Ahmet': 'tr-TR-AhmetNeural'}
BICIM = 'audio-24khz-48kbitrate-mono-mp3'
BIT_HIZI = 48000
HIZ = '-6%'  # rehber sakin okusun (uygulamada AVSpeech 0,9 hızdaydı)
SABIT_SOZLER = ['Şimdi tablonun tamamına bir kez daha bak.', 'Bir süre yalnız bak.']
DENEME_ESERLERI = ['Q220859', 'Q2627056']  # Arnolfini Portresi (ayrıntı), Golyat'ın Başıyla Davut (hikâye)
DENEME_YURUYUS = 1  # yürüyüşü olan ilk bir eser


def noktala(s):
    t = s.strip()
    if not t:
        return ''
    return t if t[-1] in '.!?…"”»)' else t + '.'


def duzgun(s):
    return noktala(re.sub(r'\s+', ' ', unicodedata.normalize('NFC', s or '')))


def anahtar(metin):
    return hashlib.sha1(metin.encode('utf-8')).hexdigest()[:16]


def oku(ad):
    return json.loads((KOK / 'data' / ad).read_text(encoding='utf-8'))


def parcalar(yalniz=None):
    """Eser anahtarı → okunacak parçalar (sırayla). `yalniz`: yalnız bu eser anahtarları."""
    notlar = oku('eser_notlari.json')['notlar']
    eserler = {}

    def ekle(k, metin):
        m = duzgun(metin)
        if m:
            liste = eserler.setdefault(k, [])
            if m not in liste:
                liste.append(m)

    for e in oku('eser_ayrintilari.json')['eserler']:
        for n in e.get('noktalar', []):
            ekle(e['anahtar'], n.get('metin', ''))
    for e in oku('eser_hikayeleri.json')['eserler']:
        for alan in ('olay', 'ressam', 'gozden'):
            for p in e.get(alan, []) or []:
                ekle(e['anahtar'], p)
        for n in e.get('kim', []) or []:
            ekle(e['anahtar'], n.get('metin', ''))
    for y in oku('yuruyus.json')['eserler'].values():
        if not y.get('qid'):
            continue
        for n in y.get('noktalar', []):
            ekle(y['qid'], n.get('metin', ''))
    # Rehberi olan eserlerin notu (açılışta okunur); başa
    for k in eserler:
        if k in notlar and isinstance(notlar[k], str):
            m = duzgun(notlar[k])
            if m and m not in eserler[k]:
                eserler[k].insert(0, m)
    if yalniz is not None:
        eserler = {k: v for k, v in eserler.items() if k in yalniz}
    eserler['_sabit'] = [duzgun(s) for s in SABIT_SOZLER]
    return eserler


def ssml(metin, ses):
    return (f'<speak version="1.0" xml:lang="tr-TR" xmlns="http://www.w3.org/2001/10/synthesis">'
            f'<voice name="{SESLER[ses]}"><prosody rate="{HIZ}">{escape(metin)}</prosody></voice></speak>')


def okut(metin, ses, bolge, deneme=5):
    istek = urllib.request.Request(
        f'https://{bolge}.tts.speech.microsoft.com/cognitiveservices/v1',
        data=ssml(metin, ses).encode('utf-8'), method='POST',
        headers={'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': BICIM,
                 'User-Agent': 'SanatAtlasi-ses'})
    k = os.environ.get('AZURE_SES_ANAHTARI')
    if k:
        istek.add_header('Ocp-Apim-Subscription-Key', k)
    for i in range(deneme):
        try:
            with urllib.request.urlopen(istek, timeout=60) as y:
                return y.read()
        except urllib.error.HTTPError as h:
            if h.code in (429, 500, 502, 503) and i < deneme - 1:
                time.sleep(2 ** i * 3)
                continue
            govde = h.read()[:300].decode('utf-8', 'replace')
            if h.code in (401, 403):
                sys.exit(f'Azure {h.code}: anahtar yok ya da yanlış (AZURE_SES_ANAHTARI ya da ortamın ağ sırrı). {govde}')
            raise SystemExit(f'Azure {h.code}: {govde}')
        except urllib.error.URLError as h:
            if i < deneme - 1:
                time.sleep(2 ** i * 3)
                continue
            raise SystemExit(f'Azure\'a ulaşılamadı: {h}')


def kelime_zamanlari(metin, sure):
    """Kelimelere süreyi harf sayısına ve noktalama duraklamalarına göre paylaştırır."""
    kelimeler = [(m.start(), m.end()) for m in re.finditer(r'\S+', metin)]
    if not kelimeler or sure <= 0:
        return []
    agirlik = []
    for bas, son in kelimeler:
        w = son - bas + 1.5
        sonharf = metin[son - 1]
        if sonharf in '.!?…':
            w += 6
        elif sonharf in ',;:':
            w += 3
        agirlik.append(w)
    bas_bosluk, son_bosluk = 0.12, 0.25  # sesin başındaki ve sonundaki sessizlik (yaklaşık)
    olcek = max(0.0, sure - bas_bosluk - son_bosluk) / sum(agirlik)
    t, sonuc = bas_bosluk, []
    for (bas, son), w in zip(kelimeler, agirlik):
        sonuc.append([round(t, 3), bas, son])
        t += w * olcek
    return sonuc


def uret(eserler, ses, cikti, bolge, en_cok):
    cikti.mkdir(parents=True, exist_ok=True)
    harcanan, yeni, dizin = 0, 0, {}
    for k, liste in eserler.items():
        for metin in liste:
            a = anahtar(metin)
            mp3, js = cikti / f'{a}.mp3', cikti / f'{a}.json'
            if mp3.exists() and js.exists():
                dizin[a] = json.loads(js.read_text(encoding='utf-8'))['sure']
                continue
            if harcanan + len(metin) > en_cok:
                print(f'Bütçe doldu ({harcanan} karakter); kalanlar sonraki çalıştırmada.')
                return dizin, harcanan, yeni, False
            veri = okut(metin, ses, bolge)
            sure = round(len(veri) * 8 / BIT_HIZI, 3)
            mp3.write_bytes(veri)
            js.write_text(json.dumps({'metin': metin, 'ses': SESLER[ses], 'sure': sure, 'tahmini': True,
                                      'kelimeler': kelime_zamanlari(metin, sure)}, ensure_ascii=False),
                          encoding='utf-8')
            dizin[a] = sure
            harcanan += len(metin)
            yeni += 1
            print(f'  {k} · {a} · {sure:.1f} sn · {metin[:50]}…')
    return dizin, harcanan, yeni, True


def yukle(ses, kaynak):
    try:
        import boto3
    except ImportError:
        sys.exit('pip3 install boto3')

    def ortam(ad, v=None):
        d = os.environ.get(ad, v)
        if not d:
            sys.exit(f'{ad} ortam değişkeni yok (README · "Görseller Cloudflare R2\'de").')
        return d
    s3 = boto3.client('s3', endpoint_url=f'https://{ortam("R2_HESAP_ID")}.r2.cloudflarestorage.com',
                      aws_access_key_id=ortam('R2_ERISIM_ANAHTARI'), aws_secret_access_key=ortam('R2_GIZLI_ANAHTAR'),
                      region_name='auto')
    kova = ortam('R2_KOVA', 'sanat-atlasi')
    var = set()
    for sayfa in s3.get_paginator('list_objects_v2').paginate(Bucket=kova, Prefix=f'ses/{ses}/'):
        var.update(o['Key'] for o in sayfa.get('Contents', []))
    n = 0
    for f in sorted(kaynak.iterdir()):
        hedef = f'ses/{ses}/{f.name}'
        if hedef in var:
            continue
        tur = 'audio/mpeg' if f.suffix == '.mp3' else 'application/json'
        s3.upload_file(str(f), kova, hedef, ExtraArgs={'ContentType': tur,
                                                       'CacheControl': 'public, max-age=31536000, immutable'})
        n += 1
    print(f'R2: {n} dosya yüklendi (kova {kova}, ses/{ses}/).')


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--ses', choices=sorted(SESLER), default='Emel')
    ap.add_argument('--dene', action='store_true', help='3 eser, iki ses: ses_deneme/ (yüklemez, dizin yazmaz)')
    ap.add_argument('--say', action='store_true', help='yalnız parça ve karakter sayısı')
    ap.add_argument('--yukle', action='store_true', help='ses/<ses>/ altındakileri R2\'ye yükle')
    ap.add_argument('--eser', action='append', help='yalnız bu eser anahtarı (QID); birden çok verilebilir')
    ap.add_argument('--en-cok', type=int, default=450_000, help='bu çalıştırmada en çok kaç karakter okutulsun')
    g = ap.parse_args()
    bolge = os.environ.get('AZURE_SES_BOLGE', 'swedencentral')

    if g.dene:
        hepsi = parcalar()
        ayr_hik = {e['anahtar'] for f in ('eser_ayrintilari.json', 'eser_hikayeleri.json') for e in oku(f)['eserler']}
        yalniz_yuruyus = [k for k in hepsi if k not in ayr_hik and k != '_sabit'][:DENEME_YURUYUS]
        eserler = {k: hepsi[k] for k in DENEME_ESERLERI + yalniz_yuruyus + ['_sabit'] if k in hepsi}
        # deneme kısa olsun: her eserden en çok 3 parça
        eserler = {k: v[:3] for k, v in eserler.items()}
        toplam = sum(len(m) for v in eserler.values() for m in v)
        print(f'Deneme: {len(eserler) - 1} eser + sabit sözler, {toplam} karakter, iki ses ({toplam * 2} karakter).')
        for ses in SESLER:
            dizin, harcanan, _, _ = uret(eserler, ses, KOK / 'ses_deneme' / ses, bolge, g.en_cok)
            print(f'{ses}: {len(dizin)} parça, {harcanan} karakter okutuldu → ses_deneme/{ses}/')
        print('Dinle: ses_deneme/<ses>/*.mp3 (metni yanındaki .json\'da).')
        return

    eserler = parcalar(yalniz=set(g.eser) if g.eser else None)
    tekil = {m for v in eserler.values() for m in v}
    karakter = sum(len(m) for m in tekil)
    print(f'{len(eserler) - 1} eser, {len(tekil)} parça, {karakter} karakter.')
    if g.say:
        return
    cikti = KOK / 'ses' / g.ses
    if g.yukle:
        yukle(g.ses, cikti)
        return
    dizin, harcanan, yeni, bitti = uret(eserler, g.ses, cikti, bolge, g.en_cok)
    yol = KOK / 'data' / 'ses_dizini.json'
    eski = json.loads(yol.read_text(encoding='utf-8')) if yol.exists() else {}
    if eski.get('ses') == SESLER[g.ses]:
        dizin = {**eski.get('parcalar', {}), **dizin}
    yol.write_text(json.dumps({'surum': 1, 'ses': SESLER[g.ses], 'klasor': f'ses/{g.ses}',
                               'aciklama': 'scripts/ses_uret.py: anahtar = sha1(metin)[:16], değer = süre (sn)',
                               'parcalar': dict(sorted(dizin.items()))}, ensure_ascii=False, indent=0) + '\n',
                   encoding='utf-8')
    print(f'{yeni} yeni parça, {harcanan} karakter; dizinde {len(dizin)} parça. '
          f'{"Bitti." if bitti else "Bütçe doldu; yeniden çalıştır."} Sonra: --yukle')


if __name__ == '__main__':
    main()
