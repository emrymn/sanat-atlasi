#!/usr/bin/env python3
"""Sesli rehber (uygulamada "Dinleyerek bak") için anlatımları Gemini'nin doğal Türkçe sesiyle kaydeder.

iPhone'un Türkçe sentez sesi (Yelda) robotik; Azure'un Emel/Ahmet sesleri de yapay bulundu. Emre Google AI Studio'da
Gemini 3.8 Flash TTS'in "Fola" sesini beğendi. Bu betik rehberin okuduğu her metin parçasını bir kez o sesle okutur,
MP3'ü (ffmpeg) ve kelime zamanlamalarını yazar, isterse Cloudflare R2'ye yükler. Uygulama bir parçanın sesini R2'de
bulursa onu çalar, bulamazsa telefonun sesine döner.

Parçalar (uygulamadaki DinlemePlani'nin okuduğu metinler; nora-sanat NoraCekirdek/Dinle/DinlemePlani.swift):
  - data/eser_notlari.json: eserin notu (açılışta künyeden sonra)
  - data/eser_hikayeleri.json: "olay", "ressam", "gozden" paragrafları ve "kim" noktalarının metni
  - data/eser_ayrintilari.json, data/yuruyus.json: noktaların metni
  - künye ("Başlık. Sanatçı, tarih.") uygulamada eserin görünen adından kurulur; burada kurulamaz.
  - sabit sözler: "Şimdi tablonun tamamına bir kez daha bak.", "Bir süre yalnız bak."

Sözleşme (uygulama aynısını yapmalı):
  metin  = noktala(boşlukları sadeleştir(NFC(parça)))   # sonunda .!?…"”») yoksa "." eklenir (DinlemeKurallari.noktala)
  anahtar = sha1(metin, UTF-8) onaltılık, ilk 16 hane
  ses dosyası:  <R2_GENEL_ADRES>/ses/<ses>/<anahtar>.mp3
  zamanlama:    <R2_GENEL_ADRES>/ses/<ses>/<anahtar>.json  {"metin", "sure", "kelimeler": [[başlangıç_sn, harf_başı, harf_sonu], ...], "tahmini"}
  dizin:        data/ses_dizini.json  {"model", "ses", "parcalar": {anahtar: süre_sn}}

Kelime zamanlaması: Gemini kelime sınırı vermez; süre (PCM'in boyundan, kesin) kelimelere harf sayısına, cümle ve
virgül duraklamalarına göre paylaştırılır ("tahmini": true).

Anahtar: bulut oturumunda "Sanat Atlası" ortamının ağ sırrı (generativelanguage.googleapis.com, x-goog-api-key)
isteklere kendiliğinden eklenir. Mac'te:  export GEMINI_API_KEY=...  (AI Studio → API Keys). Ücretli: aylık harcama
sınırını AI Studio → Spend'den koy. Bütün parçalar ~425 bin karakter (~10 saat ses).

Kullanım (depo kökünde; ffmpeg gerekir):
  python3 scripts/ses_uret.py --dene                 # 3 eser, birkaç parça: ses_deneme/<ses>/ (yüklemez)
  python3 scripts/ses_uret.py                        # rehberi olan bütün eserler: ses/<ses>/ ve data/ses_dizini.json
  python3 scripts/ses_uret.py --yukle                # üretileni R2'ye yükler (r2_yukle.py'nin ortam değişkenleri)
  python3 scripts/ses_uret.py --toplu               # Batch API: günlük sınır yok, yarı fiyat; bitene kadar bekler
  python3 scripts/ses_uret.py --say                  # yalnız parça ve karakter sayısı (istek göndermez)
  python3 scripts/ses_uret.py --hikaye --toplu       # sanatçı hikâyeleri (data/sanatci_hikayeleri.json), anahtar
                                                     # 'hikaye:<kimlik>'; parça sözleşmesi aynı (hikaye_parcalari)
"""
import argparse
import base64
import struct
import hashlib
import json
import os
import re
import subprocess
import sys
import time
import unicodedata
import urllib.error
import urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
MODEL = 'gemini-3.8-flash-tts'
VARSAYILAN_SES = 'Fola'  # AI Studio'da Emre'nin "nora 2" sesi bu hazır ses
SICAKLIK = 1
# AI Studio'nun kodundaki biçim. "## Director's notes" ile verilen yönerge bazen yüksek sesle okunuyordu
# ("Sakin, sıcak bir müze rehberi…"); yönerge yok, yalnız transkript.
STIL = '## Transcript:\n'
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


def hikaye_parcalari():
    """Sanatçı hikâyeleri ('hikaye:<kimlik>') ve dizi bölümleri ('dizi:<bölüm>') → okunacak parçalar, sırayla.
    Uygulama aynı sırayı kurar: başlık, alt başlık, giriş paragrafları, her bölüm için bölüm başlığı (yılsız) ve
    paragrafları, kapanış paragrafları. Eserlerin "bag" notları ve bağlantılar okunmaz (ekranda)."""
    yol = KOK / 'data' / 'sanatci_hikayeleri.json'
    yazilar = {}
    if yol.exists():
        yazilar.update({f'hikaye:{k}': v for k, v in json.loads(yol.read_text(encoding='utf-8'))['sanatcilar'].items()})
    # Dizi bölümleri (data/diziler.json, diziler/PLAN.md): biçim sanatçı hikâyesiyle aynı, uygulama da aynı sırayı kurar
    dyol = KOK / 'data' / 'diziler.json'
    if dyol.exists():
        yazilar.update({f'dizi:{k}': v for k, v in json.loads(dyol.read_text(encoding='utf-8'))['bolumler'].items()})
    sonuc = {}
    for anahtar_, h in yazilar.items():
        metinler = [h['baslik'], h['alt_baslik'], *h['giris']]
        for b in h['bolumler']:
            metinler += [b['baslik'], *b['paragraflar']]
        metinler += h['kapanis']
        liste = []
        for m in metinler:
            m = duzgun(m)
            if m and m not in liste:
                liste.append(m)
        sonuc[anahtar_] = liste
    return sonuc


def gunun_notlari():
    """Günün resimlerinden rehberi olmayanların notu ('_gunun'). Rehberi olmayan eserde "Dinleyerek bak" yalnız
    açılışı (künye + not), kapanışı ve sessiz anı okur; not kayıtlıysa açılış yalnız nottur (künye ekranda)."""
    notlar = oku('eser_notlari.json')['notlar']
    secim = oku('gunun_resimleri.json')['secim'].values()
    anahtarlar = set(secim) | {v[2:] for v in secim if v.startswith('q:')}
    return [duzgun(v) for k, v in notlar.items() if k in anahtarlar and isinstance(v, str) and duzgun(v)]


def parcalar(yalniz=None, hikaye=False, gunun=False):
    """Eser anahtarı → okunacak parçalar (sırayla). `yalniz`: yalnız bu eser anahtarları.
    `hikaye`: yalnız sanatçı hikâyeleri ('hikaye:<kimlik>' anahtarlarıyla)."""
    if gunun:
        var = {m for v in parcalar().values() for m in v}
        return {'_gunun': [m for m in dict.fromkeys(gunun_notlari()) if m not in var]}
    if hikaye:
        h = hikaye_parcalari()
        return {k: v for k, v in h.items() if yalniz is None or k in yalniz or k.split(':', 1)[1] in yalniz}
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


class GunlukKota(Exception):
    """Modelin günlük istek sınırı doldu (Tier 1'de günde 100 istek); yarın kaldığı yerden sürer."""


def api_anahtari():
    # Yapıştırırken araya giren görünmez satır ayırıcıları (U+2028 vb.) ve boşluklar atılır
    k = re.sub(r'\s', '', os.environ.get('GEMINI_API_KEY', ''))
    if k and not k.isascii():
        sys.exit('GEMINI_API_KEY\'de ASCII olmayan bir karakter var; anahtarı AI Studio\'dan yeniden kopyala.')
    return k


def istek_govdesi(metin, ses, stil=None):
    return {'contents': [{'role': 'user', 'parts': [{'text': (stil or STIL) + metin}]}],
            'generationConfig': {'temperature': SICAKLIK, 'responseModalities': ['AUDIO'],
                                 'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': ses}}}}}


def cevaptan_pcm(cevap):
    """GenerateContentResponse → (PCM, hız, bit) ya da None."""
    pcm, tur = bytearray(), ''
    for aday in cevap.get('candidates', []):
        for p in aday.get('content', {}).get('parts', []):
            v = p.get('inlineData') or p.get('inline_data')
            if v and v.get('data'):
                pcm += base64.b64decode(v['data'])
                tur = v.get('mimeType') or v.get('mime_type') or tur
    if not pcm:
        return None
    hiz = int(m.group(1)) if (m := re.search(r'rate=(\d+)', tur)) else 24000
    bit = int(m.group(1)) if (m := re.search(r'L(\d+)', tur)) else 16
    return bytes(pcm), hiz, bit


def okut_pcm(metin, ses, stil=None, deneme=5):
    """Gemini TTS → (PCM baytları, örnek hızı, bit)."""
    govde = istek_govdesi(metin, ses, stil)
    istek = urllib.request.Request(
        f'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent',
        data=json.dumps(govde).encode('utf-8'), method='POST',
        headers={'Content-Type': 'application/json', 'User-Agent': 'SanatAtlasi-ses'})
    k = api_anahtari()
    if k:
        istek.add_header('x-goog-api-key', k)
    for i in range(deneme):
        try:
            with urllib.request.urlopen(istek, timeout=180) as y:
                cevap = json.loads(y.read())
            break
        except urllib.error.HTTPError as h:
            yazi = h.read()[:600].decode('utf-8', 'replace')
            if h.code == 429 and 'per_day' in yazi.replace('PerDay', 'per_day'):
                raise GunlukKota(yazi)
            if h.code in (429, 500, 502, 503) and i < deneme - 1:
                time.sleep(2 ** i * 5)
                continue
            if h.code in (401, 403):
                sys.exit(f'Gemini {h.code}: anahtar yok ya da yanlış (GEMINI_API_KEY ya da ortamın ağ sırrı). {yazi}')
            raise SystemExit(f'Gemini {h.code}: {yazi}')
        except urllib.error.URLError as h:
            if i < deneme - 1:
                time.sleep(2 ** i * 5)
                continue
            raise SystemExit(f'Gemini\'ye ulaşılamadı: {h}')
    sonuc = cevaptan_pcm(cevap)
    if sonuc is None:
        raise SystemExit(f'Gemini ses döndürmedi: {json.dumps(cevap, ensure_ascii=False)[:400]}')
    return sonuc


# Gemini bazı seslerin sonuna ~0,2 sn'lik bir cızırtı ekliyor (Emre duydu; 9abdb6756659350b'de 19,72 sn'den sonra
# sessizliğin ardından yüksek, sıfır geçişi çok sık bir patlama). Kırpılır, ses kısa bir sönümle biter.
def temizle_pcm(pcm, hiz, bit=16):
    """Sondaki gürültü patlamasını atar ve kısa bir sönümle bitirir. Dönüş: (pcm, kırpıldı mı).
    Gürültü: son sessizlikten (≥80 ms) sonra gelen, en çok 0,5 sn süren, sesli karelerinde ortalama sıfır geçişi
    yüksek (>0,22; konuşmada ~0,05–0,15) kısa ses."""
    n = len(pcm) // 2
    s = list(struct.unpack('<%dh' % n, pcm[:n * 2]))
    c = int(0.01 * hiz)
    kare = []
    bas = max(0, n - int(0.9 * hiz))  # yalnız son 0,9 sn incelenir
    bas -= bas % c
    for i in range(bas, n - c + 1, c):
        seg = s[i:i + c]
        kare.append(((sum(x * x for x in seg) / c) ** 0.5,
                     sum(1 for a, b in zip(seg, seg[1:]) if (a < 0) != (b < 0)) / c))
    # sondan en çok 0,6 sn geride, en az 80 ms süren son sessizlik: [k, j)
    j = k = None
    i = len(kare)
    while i > 0 and len(kare) - i <= 60:
        if kare[i - 1][0] < 250:
            e = i
            while i > 0 and kare[i - 1][0] < 250:
                i -= 1
            if e - i >= 8:
                k, j = i, e
                break
        else:
            i -= 1
    kuyruk = kare[j:] if j is not None else []
    kirp = None
    sesli = [z for r, z in kuyruk if r >= 500]
    if kuyruk and len(kuyruk) <= 50 and sesli and sum(sesli) / len(sesli) > 0.22:
        kirp = bas + (k + min(j - k, 15)) * c
        s = s[:kirp]
    f = min(len(s), int(0.04 * hiz))
    for i in range(f):
        s[len(s) - f + i] = int(s[len(s) - f + i] * (1 - (i + 1) / f))
    return struct.pack('<%dh' % len(s), *s), kirp is not None


def mp3_pcm(veri):
    """MP3 → 24 kHz 16 bit tek kanal PCM."""
    return subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', 'pipe:0', '-f', 's16le', '-ac', '1', '-ar', '24000',
                           'pipe:1'], input=veri, capture_output=True, check=True).stdout


def mp3e(pcm, hiz, bit):
    """PCM → (MP3 baytları, süre sn); sondaki cızırtı atılır.
    Cızırtı ham PCM'de her zaman yakalanmıyor: grup 1–3 hikâyelerinin MP3'lerinde kalmıştı (Emre duydu; ör.
    98d01f0a86874170: sondaki ~0,18 sn, RMS ~9–16 bin, sıfır geçişi 0,27–0,46), ama aynı ölçüt MP3'ten çözülen seste
    onu buluyor. Bu yüzden MP3 yeniden çözülüp denetlenir; kırpılacak bir şey kalmayana dek (en çok 3 kez) tekrarlanır."""
    for _ in range(3):
        if bit == 16:
            pcm, _ = temizle_pcm(pcm, hiz, bit)
        sure = round(len(pcm) / (hiz * bit // 8), 3)
        mp3 = subprocess.run(['ffmpeg', '-loglevel', 'error', '-f', f's{bit}le', '-ar', str(hiz), '-ac', '1',
                              '-i', 'pipe:0', '-codec:a', 'libmp3lame', '-b:a', '64k', '-f', 'mp3', 'pipe:1'],
                             input=pcm, capture_output=True, check=True).stdout
        geri = mp3_pcm(mp3)
        if not temizle_pcm(geri, 24000)[1]:
            break
        pcm, hiz, bit = geri, 24000, 16
    return mp3, sure


def okut(metin, ses):
    return mp3e(*okut_pcm(metin, ses))


# Bir istekte birden çok parça: Tier 1'de model başına günde 100 istek var (2.446 parça 25 gün sürerdi). Parçalar
# paragraf paragraf tek istekte okutulur, araya uzun duraklama istenir; ses en uzun sessizliklerden bölünür. Bölünen
# parçaların süresi harf sayısıyla orantılı değilse (model duraklamayı atladıysa) grup tek tek okutulur.
GRUP_KARAKTER = 2400
GRUP_PARCA = 8
GRUP_STIL = STIL  # duraklama yönergesi de okunabilir; gruplar doğal paragraf aralarından bölünür, olmazsa tek tek


def sessizlikler(pcm, hiz, bit):
    """ffmpeg silencedetect: [(başlangıç, bitiş), ...] sn."""
    r = subprocess.run(['ffmpeg', '-hide_banner', '-f', f's{bit}le', '-ar', str(hiz), '-ac', '1', '-i', 'pipe:0',
                        '-af', 'silencedetect=noise=-38dB:d=0.55', '-f', 'null', '-'],
                       input=pcm, capture_output=True)
    hata = r.stderr.decode('utf-8', 'replace')
    bas = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', hata)]
    son = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', hata)]
    return list(zip(bas, son))


def grubu_bol(metinler, pcm, hiz, bit):
    """Grubun sesini parçalara böler; olmazsa None."""
    n = len(metinler)
    if n == 1:
        return [pcm]
    ornek = hiz * bit // 8
    toplam = len(pcm) / ornek
    aday = [(e - b, b, e) for b, e in sessizlikler(pcm, hiz, bit) if b > 0.3 and e < toplam - 0.3]
    if len(aday) < n - 1:
        return None
    secilen = sorted(sorted(aday, reverse=True)[:n - 1], key=lambda x: x[1])
    kesim = [0.0] + [(b + e) / 2 for _, b, e in secilen] + [toplam]
    sureler = [kesim[i + 1] - kesim[i] for i in range(n)]
    oran = toplam / sum(len(m) for m in metinler)
    for m, s in zip(metinler, sureler):
        beklenen = len(m) * oran
        if not (0.6 * beklenen <= s <= 1.6 * beklenen):
            return None
    parcalar = []
    for i in range(n):
        a, b = int(kesim[i] * hiz) * (bit // 8), int(kesim[i + 1] * hiz) * (bit // 8)
        parcalar.append(pcm[a:b])
    return parcalar


def gruplar(metinler):
    grup, uzun = [], 0
    for m in metinler:
        if grup and (uzun + len(m) > GRUP_KARAKTER or len(grup) >= GRUP_PARCA):
            yield grup
            grup, uzun = [], 0
        grup.append(m)
        uzun += len(m)
    if grup:
        yield grup


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


def parcayi_yaz(cikti, ses, k, metin, pcm, hiz, bit):
    veri, sure = mp3e(pcm, hiz, bit)
    a = anahtar(metin)
    (cikti / f'{a}.mp3').write_bytes(veri)
    (cikti / f'{a}.json').write_text(json.dumps(
        {'metin': metin, 'model': MODEL, 'ses': ses, 'sure': sure, 'tahmini': True,
         'kelimeler': kelime_zamanlari(metin, sure)}, ensure_ascii=False), encoding='utf-8')
    print(f'  {k} · {a} · {sure:.1f} sn · {metin[:50]}…')
    return sure


def uret(eserler, ses, cikti, en_cok, tek=False):
    """Eksik parçaları okutur. Dönüş: (dizin, karakter, yeni parça, bitti mi)."""
    cikti.mkdir(parents=True, exist_ok=True)
    harcanan, yeni, istek, dizin = 0, 0, 0, {}

    def yaz(k, metin, pcm, hiz, bit):
        nonlocal yeni
        dizin[anahtar(metin)] = parcayi_yaz(cikti, ses, k, metin, pcm, hiz, bit)
        yeni += 1

    try:
        for k, liste in eserler.items():
            eksik = []
            for metin in liste:
                js = cikti / f'{anahtar(metin)}.json'
                if js.exists() and (cikti / f'{anahtar(metin)}.mp3').exists():
                    dizin[anahtar(metin)] = json.loads(js.read_text(encoding='utf-8'))['sure']
                elif metin not in eksik:
                    eksik.append(metin)
            for grup in ([[m] for m in eksik] if tek else gruplar(eksik)):
                uzun = sum(len(m) for m in grup)
                if harcanan + uzun > en_cok:
                    print(f'Bütçe doldu ({harcanan} karakter); kalanlar sonraki çalıştırmada.')
                    return dizin, harcanan, yeni, False
                if len(grup) == 1:
                    pcm, hiz, bit = okut_pcm(grup[0], ses)
                    istek += 1
                    yaz(k, grup[0], pcm, hiz, bit)
                else:
                    pcm, hiz, bit = okut_pcm('\n\n'.join(grup), ses, stil=GRUP_STIL)
                    istek += 1
                    bolunmus = grubu_bol(grup, pcm, hiz, bit)
                    if bolunmus is None:
                        print(f'  {k}: {len(grup)} parçalık grup bölünemedi; tek tek okutuluyor.')
                        for m in grup:
                            p, h, b = okut_pcm(m, ses)
                            istek += 1
                            yaz(k, m, p, h, b)
                    else:
                        for m, p in zip(grup, bolunmus):
                            yaz(k, m, p, hiz, bit)
                harcanan += uzun
    except GunlukKota:
        print(f'Günlük istek sınırı doldu ({istek} istek bu çalıştırmada). Yarın aynı komutu çalıştır; '
              'kaldığı yerden sürer.')
        return dizin, harcanan, yeni, False
    print(f'{istek} istek.')
    return dizin, harcanan, yeni, True


# Toplu iş (Batch API): günlük istek sınırına takılmaz, ücreti yarı yarıya. Tier 1'de 3.8 Flash TTS için kuyrukta en çok
# 100 bin giriş jetonu durabilir; işler ~85 bin jetonluk dilimlerle sırayla gönderilir. Durum ses/<ses>/_toplu.json'da;
# betik kesilirse aynı komut bekleyen işi izlemeye devam eder.
API = 'https://generativelanguage.googleapis.com'
TOPLU_JETON = 85_000


def api(yol, govde=None, yontem=None, basliklar=None, ham=False):
    veri = None if govde is None else (govde if isinstance(govde, bytes) else json.dumps(govde).encode('utf-8'))
    istek = urllib.request.Request(yol if yol.startswith('http') else API + yol, data=veri,
                                   method=yontem or ('POST' if veri is not None else 'GET'),
                                   headers={'User-Agent': 'SanatAtlasi-ses', **(basliklar or {})})
    if veri is not None and 'Content-Type' not in (basliklar or {}):
        istek.add_header('Content-Type', 'application/json')
    k = api_anahtari()
    if k:
        istek.add_header('x-goog-api-key', k)
    for i in range(5):
        try:
            with urllib.request.urlopen(istek, timeout=300) as y:
                govde = y.read()
                return (govde, dict(y.headers)) if ham else json.loads(govde or b'{}')
        except urllib.error.HTTPError as h:
            yazi = h.read()[:600].decode('utf-8', 'replace')
            if h.code in (429, 500, 502, 503) and i < 4:
                time.sleep(2 ** i * 5)
                continue
            raise SystemExit(f'Gemini {h.code} ({yol}): {yazi}')
        except urllib.error.URLError as h:
            if i < 4:
                time.sleep(2 ** i * 5)
                continue
            raise SystemExit(f'Gemini\'ye ulaşılamadı: {h}')


def dosya_yukle(veri, ad):
    _, bas = api('/upload/v1beta/files', {'file': {'display_name': ad}}, ham=True, basliklar={
        'X-Goog-Upload-Protocol': 'resumable', 'X-Goog-Upload-Command': 'start',
        'X-Goog-Upload-Header-Content-Length': str(len(veri)),
        'X-Goog-Upload-Header-Content-Type': 'application/jsonl'})
    adres = {k.lower(): v for k, v in bas.items()}['x-goog-upload-url']
    cevap = api(adres, veri, basliklar={'Content-Type': 'application/jsonl', 'X-Goog-Upload-Offset': '0',
                                        'X-Goog-Upload-Command': 'upload, finalize'})
    return cevap['file']['name']


def jeton_tahmini(metin):
    return len(metin) // 3 + 60  # Türkçe ~3 harf/jeton + yönerge


def toplu(eserler, ses, cikti, tek=False):
    cikti.mkdir(parents=True, exist_ok=True)
    durum_yolu = cikti / '_toplu.json'
    dizin = {}
    while True:
        durum = json.loads(durum_yolu.read_text(encoding='utf-8')) if durum_yolu.exists() else None
        if durum is None:
            # eksik parçalar → gruplar → ~85 bin jetonluk dilim
            istekler, gruplar_ = [], {}
            toplam = 0
            for k, liste in eserler.items():
                eksik = [m for m in dict.fromkeys(liste)
                         if not ((cikti / f'{anahtar(m)}.mp3').exists() and (cikti / f'{anahtar(m)}.json').exists())]
                for grup in ([[m] for m in eksik] if tek or k == '_tek' else gruplar(eksik)):
                    metin = '\n\n'.join(grup)
                    j = jeton_tahmini(metin)
                    if istekler and toplam + j > TOPLU_JETON:
                        break
                    gk = anahtar('|'.join(grup))
                    gruplar_[gk] = {'eser': k, 'parcalar': grup}
                    istekler.append({'key': gk, 'request': istek_govdesi(
                        metin, ses, GRUP_STIL if len(grup) > 1 else None)})
                    toplam += j
                else:
                    continue
                break
            if not istekler:
                print('Toplu: eksik parça kalmadı.')
                return dizin, True
            jsonl = '\n'.join(json.dumps(x, ensure_ascii=False) for x in istekler).encode('utf-8')
            dosya = dosya_yukle(jsonl, f'ses-{ses}-{int(time.time())}')
            is_ = api(f'/v1beta/models/{MODEL}:batchGenerateContent',
                      {'batch': {'display_name': f'ses-{ses}', 'input_config': {'file_name': dosya}}})
            durum = {'is': is_['name'], 'gruplar': gruplar_}
            durum_yolu.write_text(json.dumps(durum, ensure_ascii=False), encoding='utf-8')
            print(f'Toplu iş gönderildi: {is_["name"]} · {len(istekler)} istek · '
                  f'{sum(len(g["parcalar"]) for g in gruplar_.values())} parça · ~{toplam} jeton')
        # izle
        while True:
            is_ = api(f'/v1beta/{durum["is"]}')
            meta = is_.get('metadata', is_)
            hal = meta.get('state', '')
            if hal.endswith(('SUCCEEDED', 'FAILED', 'CANCELLED', 'EXPIRED')):
                break
            print(f'  {time.strftime("%H:%M")} · {hal or "bekliyor"} … (Ctrl+C ile çıkabilirsin; aynı komut izlemeyi sürdürür)')
            time.sleep(60)
        if not hal.endswith('SUCCEEDED'):
            durum_yolu.unlink()
            raise SystemExit(f'Toplu iş {hal}: {json.dumps(is_, ensure_ascii=False)[:600]}')
        cikis = (meta.get('output') or is_.get('response') or {})
        dosya = cikis.get('responsesFile') or cikis.get('responses_file')
        if not dosya:
            raise SystemExit(f'Toplu işin sonuç dosyası yok: {json.dumps(is_, ensure_ascii=False)[:600]}')
        ham, _ = api(f'/download/v1beta/{dosya}:download?alt=media', ham=True)
        tek_tek = []
        for satir in ham.decode('utf-8').splitlines():
            if not satir.strip():
                continue
            x = json.loads(satir)
            g = durum['gruplar'].get(x.get('key'))
            if not g:
                continue
            sonuc = cevaptan_pcm(x.get('response') or {})
            if sonuc is None:
                tek_tek.extend(g['parcalar'])
                continue
            pcm, hiz, bit = sonuc
            bolunmus = grubu_bol(g['parcalar'], pcm, hiz, bit)
            if bolunmus is None:
                tek_tek.extend(g['parcalar'])
                continue
            for m, p in zip(g['parcalar'], bolunmus):
                dizin[anahtar(m)] = parcayi_yaz(cikti, ses, g['eser'], m, p, hiz, bit)
        durum_yolu.unlink()
        if tek_tek:
            print(f'  {len(tek_tek)} parça bölünemedi; sonraki toplu işte tek tek okutulacak.')
            for liste in eserler.values():
                liste[:] = [m for m in liste if m not in tek_tek]
            eserler['_tek'] = list(dict.fromkeys(eserler.get('_tek', []) + tek_tek))


def denetle(cikti, sil=False):
    """Süresi metnine göre aykırı parçalar: yönergeyi okumuş, fazladan konuşmuş ya da metni yarım bırakmış olabilir."""
    kayit = []
    for f in cikti.glob('*.json'):
        if f.name.startswith('_'):
            continue
        d = json.loads(f.read_text(encoding='utf-8'))
        kayit.append((d['sure'], len(d['metin']), f))
    if not kayit:
        return []
    oran = sorted(s_ / max(1, n) for s_, n, _ in kayit)[len(kayit) // 2]
    kotu = []
    for s_, n, f in kayit:
        beklenen = n * oran
        if s_ - beklenen > 6 or s_ < beklenen * 0.6:
            kotu.append((round(s_ - beklenen, 1), f))
    print(f'{len(kayit)} parça · ortanca {oran:.3f} sn/harf · aykırı {len(kotu)}')
    if sil:
        for _, f in kotu:
            f.unlink()
            f.with_suffix('.mp3').unlink(missing_ok=True)
        print(f'{len(kotu)} aykırı parça silindi; şimdi --toplu --tek ile yeniden üret.')
    return kotu


def duzelt(ses, cikti):
    """Üretilmiş MP3'lerin sonundaki cızırtıyı kırpar (Gemini'ye istek yok); değişenler _duzeltilen.json'a yazılır,
    --yukle onları kovada olsa da yeniden yükler."""
    liste_yolu = cikti / '_duzeltilen.json'
    degisen = set(json.loads(liste_yolu.read_text(encoding='utf-8'))) if liste_yolu.exists() else set()
    dosyalar = sorted(f for f in cikti.glob('*.mp3'))
    for i, f in enumerate(dosyalar, 1):
        pcm = mp3_pcm(f.read_bytes())
        _, kirpildi = temizle_pcm(pcm, 24000)
        if kirpildi:
            veri, sure = mp3e(pcm, 24000, 16)
            f.write_bytes(veri)
            js = f.with_suffix('.json')
            d = json.loads(js.read_text(encoding='utf-8'))
            d['sure'] = sure
            d['kelimeler'] = kelime_zamanlari(d['metin'], sure)
            js.write_text(json.dumps(d, ensure_ascii=False), encoding='utf-8')
            degisen.update({f.name, js.name})
        if i % 200 == 0 or i == len(dosyalar):
            print(f'  {i} / {len(dosyalar)} · cızırtısı kırpılan {len(degisen) // 2}')
    liste_yolu.write_text(json.dumps(sorted(degisen)), encoding='utf-8')
    return degisen


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
    liste_yolu = kaynak / '_duzeltilen.json'
    yeniden = set(json.loads(liste_yolu.read_text(encoding='utf-8'))) if liste_yolu.exists() else set()
    isler = [f for f in sorted(kaynak.iterdir())
             if not f.name.startswith('_') and (f'ses/{ses}/{f.name}' not in var or f.name in yeniden)]
    print(f'R2: {len(var)} dosya zaten kovada, {len(isler)} dosya yüklenecek (16 paralel).')

    def gonder(f):
        tur = 'audio/mpeg' if f.suffix == '.mp3' else 'application/json'
        s3.upload_file(str(f), kova, f'ses/{ses}/{f.name}',
                       ExtraArgs={'ContentType': tur, 'CacheControl': 'public, max-age=31536000, immutable'})

    from concurrent.futures import ThreadPoolExecutor, as_completed
    n = 0
    with ThreadPoolExecutor(16) as havuz:
        for gelecek in as_completed([havuz.submit(gonder, f) for f in isler]):
            gelecek.result()
            n += 1
            if n % 200 == 0 or n == len(isler):
                print(f'  {n} / {len(isler)}')
    print(f'R2: {n} dosya yüklendi (kova {kova}, ses/{ses}/).')
    if liste_yolu.exists():
        liste_yolu.unlink()


def klasor_sorunu(cikti, ses):
    """Dizinde kayıtlı parçaların yarısından azı bu klasörde varsa yanlış checkout'tayız (ör. ses/ klasörü boş
    bir worktree ya da klon): devam edilirse eski parçalar baştan okutulur ve kredi boşa gider."""
    yol = KOK / 'data' / 'ses_dizini.json'
    if not yol.exists():
        return None
    d = json.loads(yol.read_text(encoding='utf-8'))
    if d.get('ses') != ses:
        return None
    kayitli = d.get('parcalar', {})
    if len(kayitli) < 100:
        return None
    var = sum(1 for k in kayitli if (cikti / f'{k}.mp3').exists())
    if var >= 0.5 * len(kayitli):
        return None
    return (f'DUR: ses_dizini.json {len(kayitli)} parça diyor ama {cikti} içinde yalnız {var} tanesi var.\n'
            f'Büyük ihtimalle yanlış klasördesin ({KOK}); devam etseydin eski parçalar baştan okutulurdu.\n'
            'Seslendirmeyi mp3\'lerin olduğu ana klasörde çalıştır. Klasör bilerek boşsa --zorla ekle.')


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--ses', default=VARSAYILAN_SES, help=f'Gemini hazır sesi (varsayılan {VARSAYILAN_SES})')
    ap.add_argument('--dene', action='store_true', help='3 eser, birkaç parça: ses_deneme/<ses>/ (yüklemez)')
    ap.add_argument('--say', action='store_true', help='yalnız parça ve karakter sayısı')
    ap.add_argument('--yukle', action='store_true', help='ses/<ses>/ altındakileri R2\'ye yükle')
    ap.add_argument('--eser', action='append', help='yalnız bu eser anahtarı (QID); birden çok verilebilir')
    ap.add_argument('--gunun', action='store_true',
                    help='günün resimlerinden rehberi olmayanların notu (açılış Fola ile okunsun)')
    ap.add_argument('--hikaye', action='store_true',
                    help='yalnız sanatçı hikâyeleri (data/sanatci_hikayeleri.json); --eser ile sanatçı kimliği süzülür')
    ap.add_argument('--duzelt', action='store_true',
                    help='üretilmiş seslerin sonundaki cızırtıyı kırp (istek yok); sonra --yukle')
    ap.add_argument('--denetle', action='store_true',
                    help='süresi metnine göre aykırı parçaları bul ve sil (sonra --toplu --tek)')
    ap.add_argument('--toplu', action='store_true',
                    help='Batch API ile (günlük sınır yok, yarı fiyat); bitene kadar gönderir ve bekler')
    ap.add_argument('--tek', action='store_true', help='parçaları gruplamadan tek tek okut (istek sayısı artar)')
    ap.add_argument('--en-cok', type=int, default=450_000, help='bu çalıştırmada en çok kaç karakter okutulsun')
    ap.add_argument('--zorla', action='store_true', help='klasör denetimini atla (ses/ klasörü bilerek boşsa)')
    g = ap.parse_args()

    if g.dene:
        hepsi = parcalar()
        ayr_hik = {e['anahtar'] for f in ('eser_ayrintilari.json', 'eser_hikayeleri.json') for e in oku(f)['eserler']}
        yalniz_yuruyus = [k for k in hepsi if k not in ayr_hik and k != '_sabit'][:DENEME_YURUYUS]
        eserler = {k: hepsi[k] for k in DENEME_ESERLERI + yalniz_yuruyus + ['_sabit'] if k in hepsi}
        # deneme kısa olsun: her eserden en çok 3 parça
        eserler = {k: v[:3] for k, v in eserler.items()}
        toplam = sum(len(m) for v in eserler.values() for m in v)
        print(f'Deneme: {len(eserler) - 1} eser + sabit sözler, {toplam} karakter, ses {g.ses}.')
        dizin, harcanan, _, _ = uret(eserler, g.ses, KOK / 'ses_deneme' / g.ses, g.en_cok)
        print(f'{len(dizin)} parça, {harcanan} karakter okutuldu → ses_deneme/{g.ses}/ (metinler yanındaki .json\'da).')
        return

    eserler = parcalar(yalniz=set(g.eser) if g.eser else None, hikaye=g.hikaye, gunun=g.gunun)
    tekil = {m for v in eserler.values() for m in v}
    karakter = sum(len(m) for m in tekil)
    print(f'{len(eserler) - (0 if g.hikaye or g.gunun else 1)} {"hikâye" if g.hikaye else "eser"}, {len(tekil)} parça, '
          f'{karakter} karakter.')
    if g.say:
        return
    cikti = KOK / 'ses' / g.ses
    if not (g.yukle or g.denetle or g.zorla):
        sorun = klasor_sorunu(cikti, g.ses)
        if sorun:
            raise SystemExit(sorun)
    if g.duzelt:
        duzelt(g.ses, cikti)
        g.toplu = True  # dizini yeniden yaz (eksik parça yoksa istek gitmez)
    if g.denetle:
        denetle(cikti, sil=True)
        return
    if g.yukle:
        yukle(g.ses, cikti)
        return
    if g.toplu:
        _, bitti = toplu(eserler, g.ses, cikti, tek=g.tek)
        dizin, harcanan, yeni = {}, 0, 0
        for f in cikti.glob('*.json'):
            if not f.name.startswith('_'):
                dizin[f.stem] = json.loads(f.read_text(encoding='utf-8'))['sure']
    else:
        dizin, harcanan, yeni, bitti = uret(eserler, g.ses, cikti, g.en_cok, tek=g.tek)
    yol = KOK / 'data' / 'ses_dizini.json'
    eski = json.loads(yol.read_text(encoding='utf-8')) if yol.exists() else {}
    if eski.get('ses') == g.ses and eski.get('model') == MODEL:
        dizin = {**eski.get('parcalar', {}), **dizin}
    yol.write_text(json.dumps({'surum': 1, 'model': MODEL, 'ses': g.ses, 'klasor': f'ses/{g.ses}',
                               'aciklama': 'scripts/ses_uret.py: anahtar = sha1(metin)[:16], değer = süre (sn)',
                               'parcalar': dict(sorted(dizin.items()))}, ensure_ascii=False, indent=0) + '\n',
                   encoding='utf-8')
    print(f'{yeni} yeni parça, {harcanan} karakter; dizinde {len(dizin)} parça. '
          f'{"Bitti. Sonra: --yukle" if bitti else "Yarım kaldı; aynı komutu yeniden çalıştır."}')


if __name__ == '__main__':
    main()
