#!/usr/bin/env python3
# Harita sembolü hazırlama (İş 31): beyaz zeminli suluboya sembol resmini haritaya koyar.
# Nesne opak kalır (rembg maskesi), zemin ve suluboya gölge şeffaf olur (haritadaki kontur filtresi yarı opak gölgeyi
# nesne sanıp çevresine çizgi çekiyordu), resim kırpılır, verilen boya (pt) göre 3 kat çözünürlükte küçültülür,
# ayak noktası ölçülür, gece sürümü türetilir (koyu ve serin; istenirse renk korunur).
# Yazar: gorseller/harita/nesne_<ad>_gunduz.webp ve _gece.webp. Basar: js/harita.js DURAK_DUZENI için nesne ölçüsü.
# <ad> yeni bir ad olmalı (ör. ronesans_bust) ve DURAK_DUZENI.<bölge>.dosya'ya yazılmalı: gorseller/ önbelleği
# sürümden bağımsız olduğundan aynı adla değişen resim telefonda yenilenmez.
#
# Kurulum: pip install rembg   (ilk çalıştırmada isnet-general-use modeli iner, ~180 MB)
# Kullanım: python3 scripts/sembol_hazirla.py '{"ronesans_bust": {"kaynak": "bust.png", "boy": 46,
#             "kes": [[816, 475, 1376, 627], [[823, 627], [1376, 627], [1376, 768], [733, 768], [739, 728]]]}}'
#   boy: haritadaki yükseklik (pt); kes: maskenin gölgeyi nesneye kattığı alanlar (kaynak pikseliyle kutu
#   [x0, y0, x1, y1] ya da [[x, y], ...] çokgen); gece_renk / gece_isik: gece sürümünün doygunluğu / parlaklığı
#   (varsayılan 0.75 / 0.6); isik_koru: true ise sıcak ışıklı pikseller (fener gibi) gece de yanar.
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
from rembg import new_session, remove

KOK = Path(__file__).resolve().parent.parent
HEDEF = KOK / 'gorseller' / 'harita'


def hazirla(ad, kaynak, boy, kes=None, gece_renk=0.75, gece_isik=0.6, isik_koru=False, olcek=3, oturum=None):
    im = Image.open(kaynak).convert('RGB')
    maske = remove(im, session=oturum, only_mask=True, post_process_mask=True)
    for alan in kes or []:
        if isinstance(alan[0], list):
            ImageDraw.Draw(maske).polygon([tuple(p) for p in alan], fill=0)
        else:
            ImageDraw.Draw(maske).rectangle(alan, fill=0)
    m = np.asarray(maske.filter(ImageFilter.GaussianBlur(0.8)), dtype=np.float32) / 255.0
    out = Image.fromarray(np.dstack([np.asarray(im, dtype=np.float32), m * 255]).astype(np.uint8), 'RGBA')
    bb = out.getchannel('A').point(lambda v: 255 if v > 10 else 0).getbbox()
    out, maske = out.crop(bb), maske.crop(bb)
    h = round(boy * olcek)
    w = round(out.width * h / out.height)
    out, maske = out.resize((w, h), Image.LANCZOS), maske.resize((w, h), Image.LANCZOS)
    # ayak: nesnenin en alt dolu satırının ortası
    mm = np.asarray(maske) > 128
    yalt = np.where(mm.any(axis=1))[0].max()
    ax = float(np.where(mm[yalt])[0].mean() + 0.5) / w
    ay = float(yalt + 1) / h
    rgb = out.convert('RGB')
    g = np.asarray(ImageEnhance.Color(ImageEnhance.Brightness(rgb).enhance(gece_isik)).enhance(gece_renk), dtype=np.float32)
    g[..., 0] *= 0.95
    g[..., 2] = np.minimum(255, g[..., 2] * 1.12 + 6)
    if isik_koru:
        o = np.asarray(rgb, dtype=np.float32)
        sicak = (o[..., 0] > 185) & (o[..., 1] > 125) & (o[..., 2] < 175) & (o[..., 0] - o[..., 2] > 45)
        g[sicak] = o[sicak] * 1.05
    gece = Image.fromarray(np.dstack([np.clip(g, 0, 255), np.asarray(out.getchannel('A'))]).astype(np.uint8), 'RGBA')
    out.save(HEDEF / f'nesne_{ad}_gunduz.webp', 'WEBP', quality=88, method=6)
    gece.save(HEDEF / f'nesne_{ad}_gece.webp', 'WEBP', quality=88, method=6)
    return {'w': round(w / olcek, 1), 'h': round(h / olcek, 1), 'ax': round(ax, 4), 'ay': round(ay, 4)}


if __name__ == '__main__':
    oturum = new_session('isnet-general-use')
    girdi = json.loads(sys.argv[1])
    print(json.dumps({ad: hazirla(ad, oturum=oturum, **d) for ad, d in girdi.items()}, ensure_ascii=False))
