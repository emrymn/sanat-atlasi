#!/usr/bin/env python3
"""İş 189b: elle eklenen başyapıt görsellerini (gorsel_ek/) R2'ye yükler — Mac'te, r2_yukle.py'nin ortam değişkenleriyle.

  python3 scripts/basyapit_arastirma/r2_ek_yukle.py

gorsel_ek/b/<ad>.jpg → <kova>/b/<ad>.jpg (1280 px), gorsel_ek/d/<ad>.jpg → <kova>/d/<ad>.jpg (en büyük kopya).
Dosyalar gorseller/b ve gorseller_devasa'ya da kopyalanır: sonraki tam r2_yukle.py çalışması onları silmez, sayar.
Sonra data/gorsel_kaynagi.json'daki "devasa" listesine ve toplam boya eklenir. Ardından: git add/commit/push.
Gerekenler (README · "Görseller Cloudflare R2'de"): pip3 install boto3; R2_HESAP_ID, R2_ERISIM_ANAHTARI, R2_GIZLI_ANAHTAR.
"""
import json
import os
import shutil
import sys
from pathlib import Path

KOK = Path(__file__).resolve().parents[2]
EK = Path(__file__).resolve().parent / 'gorsel_ek'


def ortam(ad, varsayilan=None):
    v = os.environ.get(ad, varsayilan)
    if not v:
        sys.exit(f'{ad} ortam değişkeni yok (README · "Görseller Cloudflare R2\'de").')
    return v


def main():
    try:
        import boto3
    except ImportError:
        sys.exit('boto3 yok: pip3 install boto3')
    s3 = boto3.client('s3', endpoint_url=f"https://{ortam('R2_HESAP_ID')}.r2.cloudflarestorage.com",
                      aws_access_key_id=ortam('R2_ERISIM_ANAHTARI'), aws_secret_access_key=ortam('R2_GIZLI_ANAHTAR'), region_name='auto')
    kova = ortam('R2_KOVA', 'sanat-atlasi')
    yol = KOK / 'data/gorsel_kaynagi.json'
    k = json.loads(yol.read_text())
    devasa = set(k.get('devasa', []))
    for alt, hedef in (('b', KOK / 'gorseller/b'), ('d', KOK / 'gorseller_devasa')):
        hedef.mkdir(parents=True, exist_ok=True)
        for p in sorted((EK / alt).glob('*.jpg')):
            s3.upload_file(str(p), kova, f'{alt}/{p.name}', ExtraArgs={'ContentType': 'image/jpeg', 'CacheControl': 'public, max-age=31536000, immutable'})
            shutil.copy2(p, hedef / p.name)
            if alt == 'd' and p.stem not in devasa:
                devasa.add(p.stem)
                k['devasa_bayt'] = k.get('devasa_bayt', 0) + p.stat().st_size
            print('yüklendi', f'{alt}/{p.name}')
    k['devasa'] = sorted(devasa)
    yol.write_text(json.dumps(k, ensure_ascii=False, separators=(',', ':')) + '\n')
    print('data/gorsel_kaynagi.json güncellendi: git add data/gorsel_kaynagi.json && git commit -m "R2: ek görseller" && git push')


if __name__ == '__main__':
    main()
