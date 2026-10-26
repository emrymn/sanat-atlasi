#!/bin/sh
# Deneme çizimlerini (yalnız kesilmiş JPG'ler ve özetler; ham/ girmez) dala gönderir.
# Kullanım: sh gonder.sh "Rönesans: GPT Image 2"
set -e
cd "$(dirname "$0")/../.."
git add -f scripts/harita/cikti/*/*.jpg scripts/harita/cikti/*/ozet_*.json
git commit -m "${1:-Harita deneme çizimleri}"
git push
