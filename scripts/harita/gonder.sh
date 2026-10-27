#!/bin/sh
# Deneme çizimlerini dala gönderir: kesilmiş JPG'ler, özetler ve saydam küçük resimler (sprite/*.webp); ham/ girmez.
# Kullanım: sh gonder.sh "Rönesans: GPT Image 2"
set -e
cd "$(dirname "$0")/../.."
for desen in 'scripts/harita/cikti/*/*.jpg' 'scripts/harita/cikti/*/ozet_*.json' 'scripts/harita/cikti/*/sprite/*.webp'; do
  git add -f $desen 2>/dev/null || true
done
git commit -m "${1:-Harita deneme çizimleri}"
git push
