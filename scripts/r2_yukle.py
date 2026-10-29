#!/usr/bin/env python3
"""Görsel kopyalarını Cloudflare R2'ye yükler ve uygulamaya adresini bildirir (İş 58).

  gorseller_devasa/<ad>.jpg → <kova>/d/<ad>.jpg   (scripts/devasa_indir.py; en büyük, 4096 px)
  gorseller/b/<ad>.jpg      → <kova>/b/<ad>.jpg   (1280 px; kartlar ve görüntüleyicinin ilk hali)

Sonra data/gorsel_kaynagi.json yazılır: uygulama görüntüleyicide en büyük kopyayı oradan alır (müzeden gelenlerin
kaynağıyla; altyazıda yazar). GitHub Pages sitesi 1 GB
sınırına yakın (gorseller/b 703 MB) olduğundan 1280'lik kopyalar da R2'de; bunlar yüklendikten sonra gorseller/b
depodan çıkarılabilir (README). Kovaya CORS izni de verilir (uygulama tablonun renklerini çıkarabilsin).

Gerekenler: pip3 install boto3 ve Cloudflare'den (README · "Görseller Cloudflare R2'de") şu ortam değişkenleri:
  export R2_HESAP_ID=...          # Cloudflare hesap kimliği (Account ID)
  export R2_ERISIM_ANAHTARI=...   # R2 API jetonu: Access Key ID
  export R2_GIZLI_ANAHTAR=...     # R2 API jetonu: Secret Access Key
  export R2_GENEL_ADRES=https://gorsel.noracloud.ai   # kovaya bağlı alan adı (r2.dev bazı mobil operatörlerde engelli)
  export R2_KOVA=sanat-atlasi     # (isteğe bağlı; varsayılan sanat-atlasi)

Çalıştır (depo kökünde):  python3 scripts/r2_yukle.py
Yarıda kalırsa yeniden çalıştır: kovada aynı boyda olan dosyalar atlanır.
"""
import hashlib
import json
import os
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
SITE = 'https://emrymn.github.io'
EN_AZ_DEVASA = 1600  # 1280'lik kopyadan en az bu kadar büyük olmalı
R2_UCRETSIZ_GB = 10


def uzun_kenar(yol):
    try:
        r = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(yol)], capture_output=True, text=True)
    except OSError:
        return None  # sips yok (macOS değil): süzülmez
    s = [int(x) for x in re.findall(r'pixel(?:Width|Height):\s*(\d+)', r.stdout)]
    return max(s) if len(s) == 2 else None


def ortam(ad, varsayilan=None):
    v = os.environ.get(ad, varsayilan)
    if not v:
        sys.exit(f'{ad} ortam değişkeni yok (README · "Görseller Cloudflare R2\'de").')
    return v


def main():
    try:
        import boto3
        from botocore.config import Config
        from botocore.exceptions import ClientError
    except ImportError:
        sys.exit('boto3 yok: pip3 install boto3')
    kova = ortam('R2_KOVA', 'sanat-atlasi')
    adres = ortam('R2_GENEL_ADRES').rstrip('/')
    s3 = boto3.client(
        's3',
        endpoint_url=f"https://{ortam('R2_HESAP_ID')}.r2.cloudflarestorage.com",
        aws_access_key_id=ortam('R2_ERISIM_ANAHTARI'),
        aws_secret_access_key=ortam('R2_GIZLI_ANAHTAR'),
        region_name='auto',
        config=Config(retries={'max_attempts': 8, 'mode': 'adaptive'}, max_pool_connections=16),
    )
    # CORS: sitenin kendisi ve yerel deneme sunucusu okuyabilsin. "Object Read & Write" jetonu kova ayarını
    # değiştiremez (AccessDenied): o zaman uyarılır, yükleme sürer; izin Cloudflare panelinden bir kez elle verilir (README)
    cors = [{'AllowedOrigins': [SITE, 'http://localhost:4173'], 'AllowedMethods': ['GET', 'HEAD'], 'AllowedHeaders': ['*'], 'MaxAgeSeconds': 86400}]
    try:
        s3.put_bucket_cors(Bucket=kova, CORSConfiguration={'CORSRules': cors})
    except ClientError as e:
        print(f"Uyarı: kovaya CORS izni verilemedi ({e.response.get('Error', {}).get('Code')}). Yükleme sürüyor; izni panelden ver:", flush=True)
        print('  Cloudflare → R2 → sanat-atlasi → Settings → CORS Policy → Add CORS policy → şunu yapıştır → Save', flush=True)
        print('  ' + json.dumps([{'AllowedOrigins': r['AllowedOrigins'], 'AllowedMethods': r['AllowedMethods'], 'AllowedHeaders': r['AllowedHeaders'], 'MaxAgeSeconds': r['MaxAgeSeconds']} for r in cors]), flush=True)

    def yukle(yerel, uzak):
        boy = yerel.stat().st_size
        try:
            h = s3.head_object(Bucket=kova, Key=uzak)
            etag = h.get('ETag', '').strip('"')
            # aynı boy ve (tek parça yüklendiyse) aynı MD5: değişmemiş. Yeniden inen dosya aynı adla değişebilir (İş 58d)
            if h['ContentLength'] == boy and ('-' in etag or etag == hashlib.md5(yerel.read_bytes()).hexdigest()):
                return 'var'
        except ClientError:
            pass
        s3.upload_file(str(yerel), kova, uzak, ExtraArgs={'ContentType': 'image/jpeg', 'CacheControl': 'public, max-age=31536000, immutable'})
        return 'yuklendi'

    # en büyük kopya 1280'likten anlamlı büyük değilse (özgün küçük) yüklenmez: telefon aynı görseli iki kez indirmesin
    devasalar = sorted((KOK / 'gorseller_devasa').glob('*.jpg'))
    kucuk = {p for p in devasalar if (uzun_kenar(p) or EN_AZ_DEVASA) < EN_AZ_DEVASA}
    if kucuk:
        print(f'{len(kucuk)} görselin özgünü küçük ({EN_AZ_DEVASA} px altı): en büyük kopyası yok sayılıyor (1280\'liği yeter)', flush=True)
    isler = [(p, f'd/{p.name}') for p in devasalar if p not in kucuk]
    isler += [(p, f'b/{p.name}') for p in sorted((KOK / 'gorseller/b').glob('*.jpg'))]
    toplam = sum(p.stat().st_size for p, _ in isler) / 1e9
    print(f'{len(isler)} dosya ({toplam:.2f} GB)', flush=True)
    if toplam > R2_UCRETSIZ_GB * 0.95:
        sys.exit(f'Toplam {toplam:.2f} GB: R2 ücretsiz sınırına ({R2_UCRETSIZ_GB} GB) çok yakın ya da üstünde. Yükleme yapılmadı; Claude\'a bu satırı gönder.')
    tamam = {'d': set(), 'b': set()}
    hata = 0
    with ThreadPoolExecutor(8) as havuz:
        isler_f = {havuz.submit(yukle, p, u): (p, u) for p, u in isler}
        for n, f in enumerate(as_completed(isler_f), 1):
            p, u = isler_f[f]
            try:
                f.result()
                tamam[u[0]].add(p.stem)
            except Exception as e:  # noqa: BLE001
                hata += 1
                print('HATA', u, e, flush=True)
            if n % 100 == 0:
                print(f'{n}/{len(isler)} · hata {hata}', flush=True)
    # kovada kalan eski en büyük kopyalar (artık listede olmayanlar; ör. önceki sürümün büyüttükleri) silinir: yer kaplamasın
    if not hata:
        try:
            eski = [o['Key'] for sayfa in s3.get_paginator('list_objects_v2').paginate(Bucket=kova, Prefix='d/')
                    for o in sayfa.get('Contents', []) if o['Key'][2:-4] not in tamam['d']]
            for i in range(0, len(eski), 1000):
                s3.delete_objects(Bucket=kova, Delete={'Objects': [{'Key': k} for k in eski[i:i + 1000]], 'Quiet': True})
            if eski:
                print(f'Kovadan artık kullanılmayan {len(eski)} eski en büyük kopya silindi', flush=True)
        except ClientError as e:
            print(f"Uyarı: eski kopyalar silinemedi ({e.response.get('Error', {}).get('Code')}); zararı yok, yalnız yer kaplar", flush=True)
    # en büyük kopyası Commons yerine müzeden gelenler (scripts/devasa_indir.py): görüntüleyici altyazıda belirtir
    kaynaklar_yolu = KOK / 'gorseller_devasa/kaynaklar.json'
    kaynaklar = json.loads(kaynaklar_yolu.read_text()) if kaynaklar_yolu.exists() else {}
    muze = {ad: k for ad, k in sorted(kaynaklar.items()) if ad in tamam['d']}
    # Ayarlar'daki "en büyük kopyaları indir" toplam boyu gösterir
    devasa_bayt = sum(p.stat().st_size for p, u in isler if u.startswith('d/') and p.stem in tamam['d'])
    # İş 61: r2.dev bazı Türk mobil operatörlerinde engelli: 1280'likler R2'den yalnız R2_BUYUK=1 ise (ör. engelsiz
    # özel alan adına geçince); yoksa GitHub Pages'ten (depodaki gorseller/b) gelir, mobil veride de açılır
    b_hepsi = os.environ.get('R2_BUYUK') == '1' and len(tamam['b']) == len(list((KOK / 'gorseller/b').glob('*.jpg')))
    (KOK / 'data/gorsel_kaynagi.json').write_text(
        json.dumps({'surum': 1, 'adres': adres, 'buyuk': b_hepsi, 'devasa': sorted(tamam['d']), 'devasa_bayt': devasa_bayt, 'muze': muze}, ensure_ascii=False, separators=(',', ':')) + '\n'
    )
    print(f"\nBitti · en büyük {len(tamam['d'])} (müzeden {len(muze)}) · 1280'lik {len(tamam['b'])} · hata {hata}")
    print('data/gorsel_kaynagi.json yazıldı: git add data/gorsel_kaynagi.json && git commit && git push')


if __name__ == '__main__':
    main()
