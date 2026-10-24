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
#   beyaz_zemin: true ise maskeye beyazdan uzaklık da katılır (temiz beyaz zeminli resimlerde modelin kestiği dağınık
#   fırça darbeli çimen tabanı geri gelir; yarı saydam kenarların rengi beyazdan arındırılır, saçak kalmaz).
#   uyum: bölge kimliği (ör. romantik) verilirse sembolün renkleri o bölgenin harita resmine doğru kaydırılır
#   (gündüz gündüz resmine, gece gece resmine; YCbCr'de ortalama ve yayılım aktarımı) ve gece sürümü sabit
#   koyulaştırma yerine gece resminin ışığından türer. uyum_gunduz / uyum_gece: aktarım gücü (0–1; 0.35 / 0.6).
#   --cikti KLASOR: denemeler için gorseller/harita yerine başka klasöre yazar.
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
from rembg import new_session, remove

KOK = Path(__file__).resolve().parent.parent
HEDEF = KOK / 'gorseller' / 'harita'


def renk_aktar(rgb, alfa, bolge, tur, guc):
    # sembolün opak piksellerinin YCbCr ortalaması/yayılımı, harita resminin durakların bulunduğu orta bölümüne doğru
    harita = Image.open(HEDEF / f'{bolge}_{tur}.webp').convert('RGB')
    W, H = harita.size
    hedef_p = np.asarray(harita.crop((int(W * 0.15), int(H * 0.12), int(W * 0.85), int(H * 0.9))).convert('YCbCr'), dtype=np.float32).reshape(-1, 3)
    kaynak = np.asarray(rgb.convert('YCbCr'), dtype=np.float32)
    secili = kaynak[alfa > 128]
    mk, sk = secili.mean(axis=0), secili.std(axis=0) + 1e-3
    mh, sh = hedef_p.mean(axis=0), hedef_p.std(axis=0) + 1e-3
    yeni_m = mk + guc * (mh - mk)
    yeni_s = sk + guc * (sh - sk)
    sonuc = np.clip((kaynak - mk) / sk * yeni_s + yeni_m, 0, 255).astype(np.uint8)
    return Image.fromarray(sonuc, 'YCbCr').convert('RGB')


def hazirla(ad, kaynak, boy, kes=None, gece_renk=0.75, gece_isik=0.6, isik_koru=False, beyaz_zemin=False,
            uyum=None, uyum_gunduz=0.35, uyum_gece=0.6, olcek=3, oturum=None, hedef=HEDEF):
    im = Image.open(kaynak).convert('RGB')
    maske = remove(im, session=oturum, only_mask=True, post_process_mask=True)
    for alan in kes or []:
        if isinstance(alan[0], list):
            ImageDraw.Draw(maske).polygon([tuple(p) for p in alan], fill=0)
        else:
            ImageDraw.Draw(maske).rectangle(alan, fill=0)
    m = np.asarray(maske.filter(ImageFilter.GaussianBlur(0.8)), dtype=np.float32) / 255.0
    c = np.asarray(im, dtype=np.float32)
    if beyaz_zemin:
        aw = np.clip((255.0 - c.min(axis=2) - 22.0) / 40.0, 0, 1)
        # dağınık fırça darbeli kenar toparlanır (boşluklar kapanır), yoksa kontur bulut gibi kabarır
        kapali = Image.fromarray((aw * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(7))
        aw = np.asarray(kapali.filter(ImageFilter.GaussianBlur(1.2)), dtype=np.float32) / 255.0
        a = np.maximum(m, aw)
        with np.errstate(divide='ignore', invalid='ignore'):
            ayik = np.where(a[..., None] > 0, (c - 255.0 * (1 - a[..., None])) / a[..., None], c)
        c = np.where(m[..., None] >= 0.99, c, np.clip(ayik, 0, 255))
        m = a
    out = Image.fromarray(np.dstack([c, m * 255]).astype(np.uint8), 'RGBA')
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
    ozgun = rgb
    alfa = np.asarray(out.getchannel('A'))
    if uyum:
        gunduz_rgb = renk_aktar(rgb, alfa, uyum, 'gunduz', uyum_gunduz)
        g = np.asarray(renk_aktar(rgb, alfa, uyum, 'gece', uyum_gece), dtype=np.float32)
        rgb = gunduz_rgb
        out = Image.fromarray(np.dstack([np.asarray(rgb), alfa]).astype(np.uint8), 'RGBA')
    else:
        g = np.asarray(ImageEnhance.Color(ImageEnhance.Brightness(rgb).enhance(gece_isik)).enhance(gece_renk), dtype=np.float32)
        g[..., 0] *= 0.95
        g[..., 2] = np.minimum(255, g[..., 2] * 1.12 + 6)
    if isik_koru:
        o = np.asarray(ozgun, dtype=np.float32)
        # yalnız ışığın kendisi (camdaki parlak sarı); çimendeki sarı benekler gece yanmasın
        sicak = (o[..., 0] > 225) & (o[..., 1] > 175) & (o[..., 2] < 170) & (o[..., 0] - o[..., 2] > 70)
        g[sicak] = o[sicak] * 1.05
    gece = Image.fromarray(np.dstack([np.clip(g, 0, 255), np.asarray(out.getchannel('A'))]).astype(np.uint8), 'RGBA')
    out.save(hedef / f'nesne_{ad}_gunduz.webp', 'WEBP', quality=88, method=6)
    gece.save(hedef / f'nesne_{ad}_gece.webp', 'WEBP', quality=88, method=6)
    return {'w': round(w / olcek, 1), 'h': round(h / olcek, 1), 'ax': round(ax, 4), 'ay': round(ay, 4)}


if __name__ == '__main__':
    argumanlar = sys.argv[1:]
    hedef = HEDEF
    if '--cikti' in argumanlar:
        i = argumanlar.index('--cikti')
        hedef = Path(argumanlar[i + 1])
        del argumanlar[i : i + 2]
    oturum = new_session('isnet-general-use')
    girdi = json.loads(argumanlar[0])
    print(json.dumps({ad: hazirla(ad, oturum=oturum, hedef=hedef, **d) for ad, d in girdi.items()}, ensure_ascii=False))
