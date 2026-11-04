#!/usr/bin/env python3
"""Müzenin kendi taramasını tercih et (İş 119; README "büyük indirmeden sonra" 6. adım).

En büyük kopyalar (scripts/devasa_indir.py) çoğunlukla Wikimedia Commons'tan iner; müze kopyası yalnız Commons'taki
küçükse aranıyordu. Müzenin kendi taraması genelde daha temiz (çerçevesiz, düz, renkleri doğru). Bu betik, aynı eserin
açık erişim (CC0 / kamu malı) müze görseli varsa onu indirir ve Commons kopyasının yerine koyar:

  The Met (P3634), Art Institute of Chicago (P4610), National Gallery of Art (P4683), Cleveland (P217 + koleksiyon),
  Rijksmuseum (P217 + koleksiyon; Linked Art → IIIF) ve Yale University Art Gallery (P8583, IIIF manifesti).
  Alınmayanlar: Yale Center for British Art (Wikidata'daki P4738 eski katalog numarası, manifest numarasıyla
  eşleşmiyor: 404), Getty ve Walters (bu ortamdan doğrulanamadı; Getty'nin açık görselleri zaten Commons'ta tam boyda).

Müze numaraları eserin kendi Wikidata kaydından (data/muze_numaralari.json; Claude üretir). Tahmin yok. Güvenceler:
  - en/boy oranı uygulamadaki görselden en çok %3 farklı (başka görünüş, ayrıntı, çerçeveli çekim alınmaz),
  - uzun kenar en az 2000 px ve elimizdeki kopyanın en az %75'i (temiz ama çok küçük tarama kaliteyi düşürmesin),
  - Yale ve Rijksmuseum'da yalnız sanatçısı 1955'ten önce ölmüş eserler (kamu malı).
Değişen en büyük kopya gorseller_devasa/<ad>.jpg'nin yerine geçer (eskisi gorseller_devasa/.commons/ altında saklanır),
1280'liği ondan yeniden üretilir (gorseller/b; data/b_yenilenen.json), adı data/muze_tercih.json'a yazılır:
scripts/r2_yukle.py bunları sürüm ekli adla yükler (eski adres telefonda "hiç değişmez" diye önbellekte).

Çalıştır (depo kökünde, macOS):
  caffeinate -i python3 scripts/muze_tercih.py --dene   # yalnız sayar (müzelere sorar, indirmez)
  caffeinate -i python3 scripts/muze_tercih.py          # indirir (yavaş ve temkinli; yarıda kalırsa yeniden çalıştır)
Sonra: python3 scripts/r2_yukle.py --10gb-ustu ve gönder (README).
"""
import json
import shutil
import subprocess
import sys
import time
import urllib.parse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import devasa_indir as di  # noqa: E402  getir, indir, müze adayları, nazik bekleme

KOK = di.KOK
HEDEF = di.HEDEF
YEDEK = HEDEF / '.commons'
B = KOK / 'gorseller' / 'b'
ORAN_PAYI = 0.03
EN_AZ = 2000
EN_AZ_ORAN = 0.75
KAMU_MALI_OLUM = 1955
TERCIH = KOK / 'data' / 'muze_tercih.json'
B_LISTE = KOK / 'data' / 'b_yenilenen.json'


def rijks_aday(envanter):
    """Rijksmuseum envanter numarası → Linked Art zinciri → IIIF (iiif.micr.io). Anahtar gerekmez."""
    j = di.json_getir('https://data.rijksmuseum.nl/search/collection?' + urllib.parse.urlencode({'objectNumber': envanter}))
    nesneler = (j or {}).get('orderedItems') or []
    if len(nesneler) != 1:
        return []
    ld = di.json_getir  # id.rijksmuseum.nl düz istekte Linked Art JSON verir
    n = ld(nesneler[0]['id'])
    if not n or not any(str(i.get('content', '')).strip() == envanter for i in n.get('identified_by', []) if isinstance(i, dict)):
        return []
    for g in n.get('shows') or []:
        v = ld(g['id'])
        for dobj in (v or {}).get('digitally_shown_by') or []:
            do = ld(dobj['id'])
            for ap in (do or {}).get('access_point') or []:
                u = ap.get('id', '')
                if 'iiif.micr.io/' in u:
                    return di.iiif_adaylari(u.split('/full/')[0])
    return []


def yale_aday(tur, no):
    """Yale IIIF manifesti (ycba / yuag): ilk görselin IIIF hizmeti."""
    j = di.json_getir(f'https://manifests.collections.yale.edu/v2/{tur}/obj/{urllib.parse.quote(str(no))}')
    try:
        c = j['sequences'][0]['canvases'][0]
        servis = c['images'][0]['resource']['service']['@id']
        return di.iiif_adaylari(servis, (int(c['width']), int(c['height'])))
    except (TypeError, KeyError, IndexError, ValueError):
        return []


def adaylar(n, nga, olum):
    a = di.muze_adaylari({k: n[k] for k in ('met', 'aic', 'nga', 'cma') if k in n}, nga)
    kamu = olum is not None and olum < KAMU_MALI_OLUM
    if kamu and n.get('rijks'):
        a += [dict(x, k='rijks') for x in rijks_aday(n['rijks'])]
    if kamu and n.get('yuag'):
        a += [dict(x, k='yuag') for x in yale_aday('yuag', n['yuag'])]
    return sorted(a, key=lambda x: -(min(di.EN_BUYUK, x['boy']) if x['boy'] else 3000))


def oran_uyar(b, oran):
    import math
    return bool(oran) and abs(math.log((b[0] / b[1]) / oran)) <= ORAN_PAYI


def b_uret(ad):
    """1280'liği yeni en büyük kopyadan üretir (asla büyütmez)."""
    d = HEDEF / f'{ad}.jpg'
    db = di.boyut(d)
    if not db:
        return False
    B.mkdir(parents=True, exist_ok=True)
    gecici = B / f'{ad}.yeni'
    if max(db) > 1280:
        r = subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '82', '-Z', '1280', str(d), '--out', str(gecici)], capture_output=True)
        yb = di.boyut(gecici) if not r.returncode and gecici.exists() else None
        if not yb or max(yb) > max(db):
            gecici.unlink(missing_ok=True)
            return False
    else:
        shutil.copyfile(d, gecici)
    gecici.replace(B / f'{ad}.jpg')
    return True


def main():
    if subprocess.run(['which', 'sips'], capture_output=True).returncode:
        sys.exit('sips bulunamadı (macOS gerekir).')
    dene = '--dene' in sys.argv
    numaralar = json.loads((KOK / 'data' / 'muze_numaralari.json').read_text())['eserler']
    oranlar = json.loads((KOK / 'data' / 'gorsel_oranlari.json').read_text())['oranlar']
    olumler = {s['id']: s.get('olum') for s in json.loads((KOK / 'data' / 'sanatcilar.json').read_text())}
    kaynaklar_yolu = HEDEF / 'kaynaklar.json'
    kaynaklar = json.loads(kaynaklar_yolu.read_text()) if kaynaklar_yolu.exists() else {}
    tercih = json.loads(TERCIH.read_text()) if TERCIH.exists() else {'surum': 1, 'adlar': {}, 'bakildi': {}}
    b_liste = set(json.loads(B_LISTE.read_text()).get('adlar', [])) if B_LISTE.exists() else set()
    di.BILGI.mkdir(parents=True, exist_ok=True)
    YEDEK.mkdir(parents=True, exist_ok=True)
    # yalnız en büyük kopyası Commons'tan olanlar (müzeden gelmişse zaten müze taraması), daha önce bakılmamışlar
    isler = [(ad, n) for ad, n in sorted(numaralar.items()) if ad not in kaynaklar and ad not in tercih['bakildi'] and (HEDEF / f'{ad}.jpg').exists()]
    nga = di.nga_tablosu() if any(n.get('nga') for _, n in isler) else {}
    print(f'{len(numaralar)} eserin müze kaydı var · {len(isler)} tanesine bakılacak', flush=True)
    sayi = {'degisti': 0, 'aday_yok': 0, 'oran': 0, 'kucuk': 0}
    for i, (ad, n) in enumerate(isler, 1):
        mevcut = di.boyut(HEDEF / f'{ad}.jpg')
        uygun = None
        for x in adaylar(n, nga, olumler.get(n.get('sid'))):
            beklenen = min(di.EN_BUYUK, x['boy']) if x['boy'] else None
            if beklenen and (beklenen < EN_AZ or (mevcut and beklenen < max(mevcut) * EN_AZ_ORAN)):
                continue
            if dene:
                uygun = (x['k'], beklenen or '?')
                break
            gecici = HEDEF / f'{ad}.aday'
            b = di.indir(x, gecici)
            if not b:
                continue
            if not oran_uyar(b, oranlar.get(ad)):
                sayi['oran'] += 1
                gecici.unlink(missing_ok=True)
                continue
            if max(b) < EN_AZ or (mevcut and max(b) < max(mevcut) * EN_AZ_ORAN):
                sayi['kucuk'] += 1
                gecici.unlink(missing_ok=True)
                continue
            uygun = (x['k'], max(b))
            yedek = YEDEK / f'{ad}.jpg'
            if not yedek.exists():
                shutil.copyfile(HEDEF / f'{ad}.jpg', yedek)
            gecici.replace(HEDEF / f'{ad}.jpg')
            kaynaklar[ad] = x['k']
            kaynaklar_yolu.write_text(json.dumps(kaynaklar, ensure_ascii=False, sort_keys=True))
            if b_uret(ad):
                b_liste.add(ad)
                B_LISTE.write_text(json.dumps({'surum': 1, 'adlar': sorted(b_liste)}, ensure_ascii=False, separators=(',', ':')) + '\n')
            tercih['adlar'][ad] = x['k']
            break
        if uygun:
            sayi['degisti'] += 1
            print(f'   {ad} ({n.get("baslik", "")[:40]}): {uygun[0]} {uygun[1]} px (önceki {max(mevcut) if mevcut else "?"} px)', flush=True)
        else:
            sayi['aday_yok'] += 1
        if not dene:
            tercih['bakildi'][ad] = uygun[0] if uygun else ''
            TERCIH.write_text(json.dumps(tercih, ensure_ascii=False, sort_keys=True, indent=0) + '\n')
        if i % 25 == 0:
            print(f'{i}/{len(isler)} · {"bulunur" if dene else "değişti"} {sayi["degisti"]}', flush=True)
    print(f"\n{'Değişecek' if dene else 'Değişti'}: {sayi['degisti']} · uygun müze görseli yok: {sayi['aday_yok']} "
          f"(oranı farklı {sayi['oran']}, küçük {sayi['kucuk']})")
    if not dene and sayi['degisti']:
        print('Sonra: python3 scripts/r2_yukle.py --10gb-ustu ve git add data/gorsel_kaynagi.json data/muze_tercih.json data/b_yenilenen.json')


if __name__ == '__main__':
    t = time.time()
    main()
    print(f'{(time.time() - t) / 60:.0f} dk')
