#!/usr/bin/env python3
"""Zayıf görselleri aynı eserin daha büyük kopyasıyla değiştirir (İş 173).

Araştırma: reports/Zayıf görseller için yüksek çözünürlük.md. Üç adım, sırayla; hepsinde aday yalnız eserin kendi
kaydından gelir (CLAUDE.md "Accuracy rule": tahmin yok):

  1. aic      AIC'den gelen ve en büyük kopyası 3000 px altında kalan görseller yeniden iner. Eski kod dikey eserlerde
              AIC'nin izin vermediği bir genişlik istiyordu (403) ve 843 px'e düşüyordu. Artık yalnız izinli
              `3000,` → `1686,` → `843,` istenir (scripts/devasa_indir.py `aic_iiif_adaylari`; uzun kenar en çok 3000).
  2. smk      Commons'tan gelen zayıf görsellerden eseri SMK'de (Statens Museum for Kunst, Kopenhag) olanlar: Wikidata'da
              eserin envanter numarası (P217, koleksiyon niteleyicisi P195 = SMK) → SMK açık API'si → müzenin kamu malı
              dediği görsel (`image_native`; anahtar gerekmez).
  3. commons  scripts/kalite_tara.py çalıştırılır. Artık Commons'ta eseri temsil ettiği yazılı (P6243) dosyalara da
              bakıyor. Sonunda inceleme sayfası açılır; onaylananları scripts/devasa_indir.py indirir.

1. ve 2. adımda inen kopya gorseller_devasa/<ad>.jpg'nin yerine geçer (eskisi gorseller_devasa/.onceki/ altında
saklanır). 1280'liği 1280 px'ten küçükse yeni kopyadan yeniden üretilir (data/b_yenilenen.json). Adı
data/daha_buyuk.json'a yazılır; scripts/r2_yukle.py bunları sürüm ekli adla yükler (eski adres telefonda "hiç değişmez"
diye önbellekte durduğu için aynı ada yazmak işe yaramaz).

Güvenceler:
  - yeni kopya elimizdekinden en az 1,25 kat büyük ve en az 1600 px (r2_yukle daha küçüğünü yüklemez),
  - en/boy oranı uygulamadakinden en çok %3 farklı (ayrıntı, çerçeveli çekim alınmaz),
  - SMK'de ayrıca müze kamu malı demeli, sanatçı 1955'ten önce ölmüş olmalı ve küçük hâli bizimkiyle örtüşmeli
    (fark karması ≤ 12/64 ve renkli; scripts/kalite_tara.py'deki denetimin aynısı).

Bilerek yapılmayanlar (rapordaki gerekçelerle):
  - WikiArt özgünleri: çoğu telifli 20. yüzyıl eseri, kopyalamak politika kararı (Emre'nin kararı bekleniyor).
  - Google Arts & Culture: yalnız elle, tek tek, kamu malı eserlerde.
  - Louvre, National Gallery London, Orsay, Uffizi, Prado: toplu indirmeye açık, lisansı doğrulanmış kaynak yok.
  - AIC'de Referer taklidi: erişim denetimini aşmak olur.

Çalıştır (depo kökünde, macOS; görsel işleme için hazır gelen `sips`):
  python3 scripts/daha_buyuk.py --dene             # yalnız sayar: hangisi kaç px'e çıkar (müzelere sorar, indirmez)
  caffeinate -i python3 scripts/daha_buyuk.py      # AIC + SMK indirir, sonra kalite_tara'yı başlatır
  python3 scripts/daha_buyuk.py --yalniz aic,smk   # yalnız bu adımlar (aic, smk, commons)
Sonra:
  caffeinate -i python3 scripts/devasa_indir.py    # kalite_tara'nın bulduklarını indirir
  python3 scripts/r2_yukle.py --10gb-ustu
  git add data/daha_buyuk.json data/gorsel_kaynagi.json data/gorsel_iyilestirme.json data/b_yenilenen.json
  git commit -m "Daha büyük görseller (İş 173)" && git push
Yarıda kalırsa yeniden çalıştır: bakılanlar data/daha_buyuk.json'da, yeniden sorulmaz. Ağ hatasıyla inemeyenler
bakılmış sayılmaz, bir sonraki çalıştırmada yeniden denenir.
"""
import json
import math
import re
import shutil
import subprocess
import sys
import time
import urllib.parse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import devasa_indir as di  # noqa: E402  getir, indir, boyut, AIC adayları, nazik bekleme

KOK = di.KOK
HEDEF = di.HEDEF
ONCEKI = HEDEF / '.onceki'
B = KOK / 'gorseller' / 'b'
K = KOK / 'gorseller' / 'k'
CIKTI = KOK / 'data' / 'daha_buyuk.json'
B_LISTE = KOK / 'data' / 'b_yenilenen.json'
ADIMLAR = ('aic', 'smk', 'commons')

ZAYIF = 3000  # en büyük kopyası bundan küçük olanlara bakılır (kalite_tara ile aynı)
KAT = 1.25  # yeni kopya en az bu kat büyük olmalı
EN_AZ = 1600  # ve en az bu kadar (scripts/r2_yukle.py EN_AZ_DEVASA: daha küçüğü yüklenmez)
ORAN_PAYI = 0.03
KAMU_MALI_OLUM = 1955
EN_COK_FARK = 12  # fark karması, 64 bitte (kalite_tara ile aynı)
SMK = 'Q671384'  # Statens Museum for Kunst (Wikidata'da adıyla doğrulandı, 2026-11-13)
SMK_API = 'https://api.smk.dk/api/v1/art/?'


# --- saf yardımcılar (tests/py/test_daha_buyuk.py sınar) -----------------------------------------------------------

def gorsel_anahtari(g):
    """devasa_indir ve yerel_gorseller.json'daki anahtar: "kaynak:kimlik"."""
    return f"{g['k']}:{g.get('d') or g.get('i') or g.get('u') or ''}"


def yeterince_buyuk(yeni, mevcut):
    """Yeni uzun kenar elimizdekinden en az KAT kat ve en az EN_AZ px mi? mevcut 0/None: yalnız EN_AZ."""
    return bool(yeni) and yeni >= EN_AZ and (not mevcut or yeni >= mevcut * KAT)


def oran_uyar(boy, oran):
    """boy (g, y) uygulamadaki en/boy oranından en çok ORAN_PAYI farklı mı? Oran bilinmiyorsa kabul edilmez."""
    return bool(oran) and bool(boy) and abs(math.log((boy[0] / boy[1]) / oran)) <= ORAN_PAYI


def smk_sorgusu(qidler):
    """Eserlerin SMK envanter numaraları: P217, niteleyicisi P195 = SMK olan ifade (başka müzenin numarası karışmasın)."""
    degerler = ' '.join(f'wd:{q}' for q in qidler)
    return ('SELECT ?eser ?no WHERE { VALUES ?eser { ' + degerler + ' } '
            f'?eser p:P217 ?s . ?s ps:P217 ?no ; pq:P195 wd:{SMK} . }}')


def smk_aday_sec(yanit, envanter):
    """SMK API yanıtından aday {u, boy} ya da None: numara birebir aynı, kamu malı ve görseli var."""
    for it in (yanit or {}).get('items') or []:
        if str(it.get('object_number', '')).strip() != envanter:
            continue
        if it.get('public_domain') is not True or not it.get('has_image') or not it.get('image_native'):
            return None
        try:
            boy = max(int(it['image_width']), int(it['image_height']))
        except (KeyError, TypeError, ValueError):
            boy = None
        return {'u': it['image_native'], 'boy': boy}
    return None


# --- veri ----------------------------------------------------------------------------------------------------------

def oku(yol, varsayilan):
    return json.loads(yol.read_text()) if yol.exists() else varsayilan


def eserler():
    """{ad: (görsel kaydı, eser QID'si, sanatçı kimliği, başlık)} — yerel kopyası olan bütün görseller."""
    harita = json.loads((KOK / 'data/yerel_gorseller.json').read_text())['gorseller']
    sonuc = {}
    for sid, v in json.loads((KOK / 'data/eserler_onbellek.json').read_text())['sanatcilar'].items():
        for e in v['eserler']:
            for g in e.get('gorseller') or []:
                ad = harita.get(gorsel_anahtari(g))
                if ad and ad not in sonuc:
                    sonuc[ad] = (g, e.get('qid'), sid, e.get('baslik') or '')
    return sonuc


def mevcut_boy(ad):
    """Elimizdeki en büyük kopyanın uzun kenarı (gorseller_devasa; yoksa 1280'lik). Bilinmiyorsa 0."""
    for yol in (HEDEF / f'{ad}.jpg', B / f'{ad}.jpg'):
        if yol.exists():
            b = di.boyut(yol)
            if b:
                return max(b)
    return 0


class Kayit:
    """data/daha_buyuk.json: {adlar: {ad: kaynak}, bakildi: {ad: kaynak ya da ''}}. Her değişiklikte yazılır."""

    def __init__(self):
        j = oku(CIKTI, {})
        self.adlar = j.get('adlar', {})
        self.bakildi = j.get('bakildi', {})
        self.b_liste = set(oku(B_LISTE, {}).get('adlar', []))
        self.kaynaklar_yolu = HEDEF / 'kaynaklar.json'
        self.kaynaklar = oku(self.kaynaklar_yolu, {})

    def yaz(self):
        CIKTI.write_text(json.dumps({'surum': 1, 'adlar': dict(sorted(self.adlar.items())),
                                     'bakildi': dict(sorted(self.bakildi.items()))}, ensure_ascii=False, indent=0) + '\n')
        B_LISTE.write_text(json.dumps({'surum': 1, 'adlar': sorted(self.b_liste)}, ensure_ascii=False, separators=(',', ':')) + '\n')
        self.kaynaklar_yolu.write_text(json.dumps(self.kaynaklar, ensure_ascii=False, sort_keys=True))


# --- ortak: indir, denetle, yerine koy -----------------------------------------------------------------------------

def b_yenile(ad):
    """1280'lik 1280 px'ten küçükse yeni en büyük kopyadan yeniden üretir (asla büyütmez). Üretildiyse True."""
    yol = B / f'{ad}.jpg'
    mevcut = di.boyut(yol) if yol.exists() else None
    if mevcut and max(mevcut) >= 1280:
        return False
    B.mkdir(parents=True, exist_ok=True)
    gecici = B / f'{ad}.yeni'
    r = subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '82', '-Z', '1280',
                        str(HEDEF / f'{ad}.jpg'), '--out', str(gecici)], capture_output=True)
    yb = di.boyut(gecici) if not r.returncode and gecici.exists() else None
    if not yb or max(yb) > 1280 or (mevcut and max(yb) <= max(mevcut)):
        gecici.unlink(missing_ok=True)
        return False
    gecici.replace(yol)
    return True


def imza_uyar(ad, yol):
    """Küçük hâli uygulamadakiyle örtüşüyor mu (kalite_tara'nın fark karması ve renk denetimi)? Karşılaştırılamazsa False."""
    import kalite_tara as kt  # noqa: PLC0415
    try:
        biz = kt.dosya_imzasi(K / f'{ad}.jpg')
        o = kt.dosya_imzasi(yol)
    except (OSError, ValueError):
        return False
    return kt.fark(biz['k'], o['k']) <= EN_COK_FARK and kt.renk_uyar(biz, o)


def dene_ve_koy(ad, adaylar, kaynak, kayit, oran, mevcut, imza=False, dene=False):
    """Adayları büyükten küçüğe dener; uygun ilkini yerine koyar. Dönüş: ('degisti'|'bulunur', px) ya da
    ('yok'|'kucuk'|'oran'|'imza'|'ag', None). 'ag' (inemedi) bakılmış sayılmaz."""
    adaylar = sorted(adaylar, key=lambda x: -(x['boy'] or ZAYIF))
    neden = 'yok'
    for x in adaylar:
        if x['boy'] and not yeterince_buyuk(min(di.EN_BUYUK, x['boy']), mevcut):
            neden = 'kucuk' if neden == 'yok' else neden
            continue
        if dene:
            return 'bulunur', min(di.EN_BUYUK, x['boy']) if x['boy'] else None
        gecici = HEDEF / f'{ad}.aday'
        b = di.indir(x, gecici)
        if not b:
            neden = 'ag'
            continue
        if not yeterince_buyuk(max(b), mevcut):
            gecici.unlink(missing_ok=True)
            neden = 'kucuk' if neden in ('yok', 'ag') else neden
            continue
        if not oran_uyar(b, oran):
            print(f'   {ad}: {kaynak} görselinin oranı farklı ({b[0]}×{b[1]}), alınmadı', flush=True)
            gecici.unlink(missing_ok=True)
            return 'oran', None
        if imza and not imza_uyar(ad, gecici):
            print(f'   {ad}: {kaynak} görseli bizimkiyle örtüşmüyor, alınmadı', flush=True)
            gecici.unlink(missing_ok=True)
            return 'imza', None
        eski = HEDEF / f'{ad}.jpg'
        if eski.exists():
            ONCEKI.mkdir(parents=True, exist_ok=True)
            yedek = ONCEKI / f'{ad}.jpg'
            if not yedek.exists():
                shutil.copyfile(eski, yedek)
        gecici.replace(eski)
        if kaynak != 'aic' or kayit.kaynaklar.get(ad):
            kayit.kaynaklar[ad] = kaynak  # altyazı: en büyük kopyanın kaynağı (kendi kaynağı AIC ise yazılmaz)
        if b_yenile(ad):
            kayit.b_liste.add(ad)
        kayit.adlar[ad] = kaynak
        return 'degisti', max(b)
    return neden, None


# --- 1. AIC --------------------------------------------------------------------------------------------------------

def aic_adimi(hepsi, kayit, oranlar, dene):
    numaralar = oku(KOK / 'data/muze_numaralari.json', {}).get('eserler', {})
    wd = oku(di.BILGI / 'wikidata.json', {})
    isler = []
    for ad, (g, qid, _, baslik) in sorted(hepsi.items()):
        if ad in kayit.bakildi:
            continue
        if g['k'] == 'aic' and not kayit.kaynaklar.get(ad):
            isler.append((ad, g, None, baslik))
        elif kayit.kaynaklar.get(ad) == 'aic':
            no = (numaralar.get(ad) or {}).get('aic') or (wd.get(qid) or {}).get('aic')
            if no:
                isler.append((ad, None, no, baslik))
    zayif = [(ad, g, no, b, m) for ad, g, no, b in isler for m in [mevcut_boy(ad)] if m < ZAYIF]
    print(f'AIC: {len(isler)} görselin en büyük kopyası AIC\'den · {len(zayif)} tanesi {ZAYIF} px altında', flush=True)
    return yurut('aic', zayif, kayit, oranlar, dene,
                 lambda g, no: di.kendi_adaylari(g, {}) if g else di.aic_aday(no=no), imza=False)


# --- 2. SMK --------------------------------------------------------------------------------------------------------

def smk_numaralari(qidler):
    """{qid: envanter} — Wikidata SPARQL, 150'lik gruplar; gorseller_devasa/.bilgi/smk.json'da saklanır."""
    def uret(s, kaydet):
        eksik = [q for q in qidler if q not in s]
        for i in range(0, len(eksik), 150):
            grup = eksik[i:i + 150]
            j = di.json_getir('https://query.wikidata.org/sparql?' + urllib.parse.urlencode({'format': 'json', 'query': smk_sorgusu(grup)}))
            if j is None:
                continue  # sorulamadı: sonraki çalıştırmada yeniden
            bulunan = {}
            for r in j.get('results', {}).get('bindings', []):
                q = r['eser']['value'].rsplit('/', 1)[-1]
                bulunan.setdefault(q, set()).add(r['no']['value'].strip())
            for q in grup:
                nolar = bulunan.get(q, set())
                s[q] = next(iter(nolar)) if len(nolar) == 1 else None  # birden çok SMK numarası: belirsiz, alınmaz
            kaydet()
            print(f'   Wikidata (SMK numaraları): {min(i + 150, len(eksik))}/{len(eksik)}', flush=True)
    return di.sakli('smk', uret)


def smk_adimi(hepsi, kayit, oranlar, olumler, dene):
    adaylar = [(ad, g, qid, sid, b) for ad, (g, qid, sid, b) in sorted(hepsi.items())
               if g['k'] == 'commons' and qid and not kayit.kaynaklar.get(ad) and ad not in kayit.bakildi]
    zayif = [(ad, qid, b, m) for ad, g, qid, sid, b in adaylar
             if (olumler.get(sid) is not None and olumler[sid] < KAMU_MALI_OLUM) for m in [mevcut_boy(ad)] if m < ZAYIF]
    print(f'SMK: kamu malı ve en büyük kopyası {ZAYIF} px altında olan {len(zayif)} Commons görselinin eseri soruluyor', flush=True)
    nolar = smk_numaralari(sorted({qid for _, qid, _, _ in zayif}))
    isler = [(ad, None, nolar[qid], b, m) for ad, qid, b, m in zayif if nolar.get(qid)]
    print(f'SMK: {len(isler)} eserin SMK numarası var', flush=True)

    def aday(_, no):
        x = smk_aday_sec(di.json_getir(SMK_API + urllib.parse.urlencode({'object_number': no})), no)
        return [x] if x else []
    return yurut('smk', isler, kayit, oranlar, dene, aday, imza=True)


# --- ortak döngü ---------------------------------------------------------------------------------------------------

def yurut(kaynak, isler, kayit, oranlar, dene, aday_bul, imza):
    sayi = {}
    for n, (ad, g, no, baslik, mevcut) in enumerate(isler, 1):
        sonuc, px = dene_ve_koy(ad, aday_bul(g, no), kaynak, kayit, oranlar.get(ad), mevcut, imza=imza, dene=dene)
        sayi[sonuc] = sayi.get(sonuc, 0) + 1
        if px:
            print(f'   {baslik[:44]:44} {mevcut or "?":>5} → {px or "?"} px', flush=True)
        if not dene and sonuc != 'ag':
            kayit.bakildi[ad] = kaynak if sonuc == 'degisti' else ''
            kayit.yaz()
        if n % 25 == 0:
            print(f'   {n}/{len(isler)} · {sayi}', flush=True)
    adlar = {'degisti': 'değişti', 'bulunur': 'büyüyecek', 'yok': 'aday yok', 'kucuk': 'kaynak da küçük',
             'oran': 'oranı farklı', 'imza': 'örtüşmüyor', 'ag': 'inemedi (yeniden denenecek)'}
    print(f'{kaynak.upper()}: ' + (' · '.join(f'{adlar[k]} {v}' for k, v in sayi.items()) or 'bakılacak görsel yok'), flush=True)
    return sayi.get('degisti', 0) + sayi.get('bulunur', 0)


def main():
    if subprocess.run(['which', 'sips'], capture_output=True).returncode:
        sys.exit('sips bulunamadı (macOS gerekir).')
    dene = '--dene' in sys.argv
    adimlar = sys.argv[sys.argv.index('--yalniz') + 1].split(',') if '--yalniz' in sys.argv else list(ADIMLAR)
    if set(adimlar) - set(ADIMLAR):
        sys.exit(f'Bilinmeyen adım: {", ".join(sorted(set(adimlar) - set(ADIMLAR)))} (olanlar: {", ".join(ADIMLAR)})')
    di.BILGI.mkdir(parents=True, exist_ok=True)
    for p in HEDEF.glob('*.aday'):
        p.unlink()  # yarıda kalmış indirme
    hepsi = eserler()
    oranlar = json.loads((KOK / 'data/gorsel_oranlari.json').read_text())['oranlar']
    olumler = {s['id']: s.get('olum') for s in json.loads((KOK / 'data/sanatcilar.json').read_text())}
    kayit = Kayit()
    toplam = 0
    if 'aic' in adimlar:
        toplam += aic_adimi(hepsi, kayit, oranlar, dene)
    if 'smk' in adimlar:
        toplam += smk_adimi(hepsi, kayit, oranlar, olumler, dene)
    print(f"\n{'Büyüyecek' if dene else 'Değişen'} görsel: {toplam} (AIC + SMK)", flush=True)
    if 'commons' in adimlar:
        if dene:
            print('Commons adımı denemede çalışmaz; kendi denemesi: python3 scripts/kalite_tara.py --dene 10')
        else:
            print('\nCommons: scripts/kalite_tara.py başlıyor (eseri temsil eden P6243 dosyaları dahil)\n', flush=True)
            subprocess.run([sys.executable, str(KOK / 'scripts' / 'kalite_tara.py')], cwd=KOK)
    if not dene:
        print('\nSonra: caffeinate -i python3 scripts/devasa_indir.py  →  python3 scripts/r2_yukle.py --10gb-ustu  →  '
              'git add data/daha_buyuk.json data/gorsel_kaynagi.json data/gorsel_iyilestirme.json data/b_yenilenen.json')


if __name__ == '__main__':
    t = time.time()
    main()
    print(f'{(time.time() - t) / 60:.0f} dk')
