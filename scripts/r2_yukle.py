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
  export R2_GENEL_ADRES=https://pub-....r2.dev   # kovanın herkese açık adresi
  export R2_KOVA=sanat-atlasi     # (isteğe bağlı; varsayılan sanat-atlasi)

Çalıştır (depo kökünde):  python3 scripts/r2_yukle.py
Yarıda kalırsa yeniden çalıştır: kovada aynı boyda olan dosyalar atlanır.
"""
import json
import os
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
SITE = 'https://emrymn.github.io'


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
    # CORS: sitenin kendisi ve yerel deneme sunucusu okuyabilsin
    s3.put_bucket_cors(
        Bucket=kova,
        CORSConfiguration={'CORSRules': [{'AllowedOrigins': [SITE, 'http://localhost:4173'], 'AllowedMethods': ['GET', 'HEAD'], 'AllowedHeaders': ['*'], 'MaxAgeSeconds': 86400}]},
    )

    def yukle(yerel, uzak):
        boy = yerel.stat().st_size
        try:
            if s3.head_object(Bucket=kova, Key=uzak)['ContentLength'] == boy:
                return 'var'
        except ClientError:
            pass
        s3.upload_file(str(yerel), kova, uzak, ExtraArgs={'ContentType': 'image/jpeg', 'CacheControl': 'public, max-age=31536000, immutable'})
        return 'yuklendi'

    isler = [(p, f'd/{p.name}') for p in sorted((KOK / 'gorseller_devasa').glob('*.jpg'))]
    isler += [(p, f'b/{p.name}') for p in sorted((KOK / 'gorseller/b').glob('*.jpg'))]
    print(f'{len(isler)} dosya ({sum(p.stat().st_size for p, _ in isler) / 1e9:.2f} GB)', flush=True)
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
    # en büyük kopyası Commons yerine müzeden gelenler (scripts/devasa_indir.py): görüntüleyici altyazıda belirtir
    kaynaklar_yolu = KOK / 'gorseller_devasa/kaynaklar.json'
    kaynaklar = json.loads(kaynaklar_yolu.read_text()) if kaynaklar_yolu.exists() else {}
    muze = {ad: k for ad, k in sorted(kaynaklar.items()) if ad in tamam['d']}
    b_hepsi = len(tamam['b']) == len(list((KOK / 'gorseller/b').glob('*.jpg')))
    (KOK / 'data/gorsel_kaynagi.json').write_text(
        json.dumps({'surum': 1, 'adres': adres, 'buyuk': b_hepsi, 'devasa': sorted(tamam['d']), 'muze': muze}, ensure_ascii=False, separators=(',', ':')) + '\n'
    )
    print(f"\nBitti · en büyük {len(tamam['d'])} (müzeden {len(muze)}) · 1280'lik {len(tamam['b'])} · hata {hata}")
    print('data/gorsel_kaynagi.json yazıldı: git add data/gorsel_kaynagi.json && git commit && git push')


if __name__ == '__main__':
    main()
