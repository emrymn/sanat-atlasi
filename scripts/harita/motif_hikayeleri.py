#!/usr/bin/env python3
"""Haritadaki saklı motiflerin hikâyeleri ve eserleri (İş 111).

Emre: "haritadaki gizli resimler ... ordaki her resmin hikayesini yazalım bir de tıklayınca resmin kendisi de çıksın".
motif_hikayeleri_1.json ve _2.json (Claude'un yazdığı): {motif anahtarı (data/harita.json eserler): {eser: [sanatçıId,
eser anahtarı (QID ya da "sanatçı|başlık")] ya da null (eser uygulamada yok), hikaye: [paragraf], haritada?}}.
Çıktı data/harita_motifler.json; uygulama motif penceresinde uzun hikâyeyi ve eserin resmini gösterir.
data/harita.json (uygulama_hazirla.py çıktısı) değiştirilmez.

  python3 scripts/harita/motif_hikayeleri.py"""
import json
from pathlib import Path

KOK = Path(__file__).resolve().parents[2]
BURASI = Path(__file__).resolve().parent


def main():
    motifler = json.loads((KOK / 'data/harita.json').read_text())['eserler']
    ob = json.loads((KOK / 'data/eserler_onbellek.json').read_text())['sanatcilar']
    yazilan = {}
    for p in sorted(BURASI.glob('motif_hikayeleri_[0-9].json')):
        for a, v in json.loads(p.read_text(encoding='utf-8')).items():
            if a in yazilan:
                raise SystemExit(f'{p.name}: iki kez yazılmış {a}')
            yazilan[a] = v
    eksik = set(motifler) - set(yazilan)
    fazla = set(yazilan) - set(motifler)
    if eksik or fazla:
        raise SystemExit(f'eksik {sorted(eksik)} · fazla {sorted(fazla)}')
    cikti = {}
    for a in motifler:  # harita.json'daki sıra
        v = yazilan[a]
        if not (isinstance(v['hikaye'], list) and len(v['hikaye']) >= 2 and all(isinstance(x, str) and x.strip() for x in v['hikaye'])):
            raise SystemExit(f'hikâye eksik: {a}')
        k = {'hikaye': v['hikaye']}
        if v.get('eser'):
            sid, anahtar = v['eser']
            eserler = ob.get(sid, {}).get('eserler', [])
            if not any((e.get('qid') or f"{sid}|{e['baslik']}") == anahtar for e in eserler):
                raise SystemExit(f'eser bulunamadı: {a} → {sid} {anahtar}')
            k['sid'], k['eser'] = sid, anahtar
        if v.get('haritada'):
            k['haritada'] = v['haritada']
        cikti[a] = k
    veri = {'surum': 1, 'aciklama': 'Haritadaki saklı motiflerin uzun hikâyesi ve uygulamadaki eseri (sid + eser anahtarı: QID ya da "sanatçı|başlık"). Kaynak: scripts/harita/motif_hikayeleri_*.json.', 'motifler': cikti}
    (KOK / 'data/harita_motifler.json').write_text(json.dumps(veri, ensure_ascii=False, indent=1) + '\n')
    print(f'{len(cikti)} motif · eseri olan {sum("eser" in k for k in cikti.values())}')


if __name__ == '__main__':
    main()
