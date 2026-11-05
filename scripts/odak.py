#!/usr/bin/env python3
"""Her görselin odak noktası: tablodaki yüzler (İş 137).

Galeri'deki dönem kartlarının arkasındaki tablo kartı kaplayacak biçimde kırpılır (object-fit: cover). Kırpma hep
ortadan yapılınca dikey tablolarda baş kesiliyordu (Emre: "resimde mesela adamın kafası görünmüyor, önemli noktayı
vurgulayacak şekilde ortala"). Bu betik gorseller/k/<ad>.jpg (400 px kopyalar) üzerinde YuNet yüz bulucusunu
(OpenCV) çalıştırır; yüz bulunan görsellerin odağını data/gorsel_odak.json'a yazar:

    { "surum": 1, "odak": { "<ad>": [x, y], ... } }     x, y: görselin genişliğine/yüksekliğine göre yüzde (0–100)

Odak, bulunan yüzlerin (güven ≥ ESIK) alan × güvenle ağırlıklı ortası; en büyük yüzün yarısından küçük yüzler
(kalabalıktaki uzak figürler) sayılmaz. Yüz bulunmayan görsel dosyaya girmez: uygulama onda varsayılan kırpmayı
kullanır. Uygulama bu yüzdeleri doğrudan CSS object-position olarak verir (yüz kırpılan kutuda görünür kalır).

Gerekenler: pip install opencv-python-headless (numpy ile gelir). Model (230 KB) ilk çalıştırmada indirilir:
scripts/.ham/yunet.onnx (git'e girmez).

Çalıştır (depo kökünde):  python3 scripts/odak.py             (7000 görsel ~1–2 dk; ağ yalnız model için)
                          python3 scripts/odak.py --dene <ad> (tek görselin yüzlerini yazar)
"""
import json
import os
import sys
import urllib.request

import cv2

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KUCUK = os.path.join(KOK, 'gorseller', 'k')
CIKTI = os.path.join(KOK, 'data', 'gorsel_odak.json')
MODEL = os.path.join(KOK, 'scripts', '.ham', 'yunet.onnx')
MODEL_URL = 'https://media.githubusercontent.com/media/opencv/opencv_zoo/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx'
ESIK = 0.75  # yüz güveni (resimlerde yanlış yüz az olsun)
OLCEK = 2  # 400 px küçük; küçük yüzler için iki kat büyütülerek aranır


def model_hazirla():
    if os.path.exists(MODEL) and os.path.getsize(MODEL) > 100_000:
        return
    os.makedirs(os.path.dirname(MODEL), exist_ok=True)
    print('YuNet modeli indiriliyor…')
    urllib.request.urlretrieve(MODEL_URL, MODEL)


def yuzler(bulucu, yol):
    img = cv2.imread(yol)
    if img is None:
        return None, []
    h, w = img.shape[:2]
    buyuk = cv2.resize(img, (w * OLCEK, h * OLCEK), interpolation=cv2.INTER_CUBIC)
    bulucu.setInputSize((w * OLCEK, h * OLCEK))
    _, sonuc = bulucu.detect(buyuk)
    l = []
    for r in sonuc if sonuc is not None else []:
        x, y, fw, fh, guven = r[0] / OLCEK, r[1] / OLCEK, r[2] / OLCEK, r[3] / OLCEK, float(r[14])
        if guven >= ESIK:
            l.append((x, y, fw, fh, guven))
    return (w, h), l


def odak(boyut, l):
    if not l:
        return None
    w, h = boyut
    en_buyuk = max(fw * fh for _, _, fw, fh, _ in l)
    secilen = [f for f in l if f[2] * f[3] >= en_buyuk * 0.5]
    toplam = sum(fw * fh * g for _, _, fw, fh, g in secilen)
    cx = sum((x + fw / 2) * fw * fh * g for x, _, fw, fh, g in secilen) / toplam
    cy = sum((y + fh / 2) * fw * fh * g for _, y, fw, fh, g in secilen) / toplam
    return [max(0, min(100, round(100 * cx / w))), max(0, min(100, round(100 * cy / h)))]


def main():
    model_hazirla()
    bulucu = cv2.FaceDetectorYN.create(MODEL, '', (320, 320), ESIK, 0.3, 5000)
    if len(sys.argv) > 2 and sys.argv[1] == '--dene':
        boyut, l = yuzler(bulucu, os.path.join(KUCUK, sys.argv[2] + '.jpg'))
        print(boyut, l, odak(boyut, l))
        return
    adlar = sorted(a[:-4] for a in os.listdir(KUCUK) if a.endswith('.jpg'))
    sonuc = {}
    for i, ad in enumerate(adlar):
        boyut, l = yuzler(bulucu, os.path.join(KUCUK, ad + '.jpg'))
        o = boyut and odak(boyut, l)
        if o:
            sonuc[ad] = o
        if (i + 1) % 1000 == 0:
            print(f'{i + 1} / {len(adlar)} · yüzlü {len(sonuc)}')
    with open(CIKTI, 'w', encoding='utf-8') as f:
        json.dump({'surum': 1, 'odak': sonuc}, f, ensure_ascii=False, separators=(',', ':'), sort_keys=True)
        f.write('\n')
    print(f'{len(adlar)} görsel, {len(sonuc)} yüzlü → {os.path.relpath(CIKTI, KOK)}')


if __name__ == '__main__':
    main()
