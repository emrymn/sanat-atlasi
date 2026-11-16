#!/usr/bin/env python3
"""Bağımsız denetim paketi üretici (DENETIM_SABLONU.md).

Kullanım: python3 resim-ansiklopedisi/denetim/paket_uret.py
Çıktı: denetim/ASTRA_PAKETI.md ve denetim/FABLE_PAKETI.md (içerik birebir aynı, hakem başlığı farklı).
Salt-okunur üreteçtir: madde JSON'larını değiştirmez.
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # resim-ansiklopedisi/
DIZINLER = ['ikonografi', 'mitoloji', 'resim-teknikleri', 'resimlerdeki-nesneler']

def yukle(yol):
    try:
        with open(yol, encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f'OKUNAMADI {yol}: {e}')
        return None

def paket_uret(hakem):
    satirlar = [
        f'# BAĞIMSIZ AKADEMİK DENETİM PAKETİ — {hakem}',
        '',
        '**Proje:** Sanat Atlası · Resim Ansiklopedisi (pilot 20 madde)',
        '**Standart:** denetim/DENETIM_SABLONU.md — iki hakem aynı standardı kullanır.',
        '**Kural:** Üretim ekibinin verdiği statülere güvenmeyin; her iddia için kaynağı KENDİNİZ açın.',
        '**Çıktı:** Bu dosyanın kopyası üzerinde, her iddia bloğunun altındaki DENETÇİ alanlarını doldurun.',
        '',
        '---',
        '',
    ]
    toplam_iddia = 0
    for d in DIZINLER:
        dp = os.path.join(ROOT, d)
        if not os.path.isdir(dp):
            continue
        for fn in sorted(os.listdir(dp)):
            if not fn.endswith('.json'):
                continue
            m = yukle(os.path.join(dp, fn))
            if not m:
                continue
            mid = m.get('id', '?')
            kanit = yukle(os.path.join(ROOT, 'kanit-kayitlari', f'{mid}.json')) or {}
            kmap = {k.get('claim_id'): k for k in kanit.get('kayitlar', []) if isinstance(k, dict)}
            ksrc = {k.get('kaynak_id'): k for k in m.get('kaynaklar', []) if isinstance(k, dict)}
            satirlar += [
                f'## Madde {mid} — {m.get("turkce_ad", "?")} (`{d}/{fn}`)',
                '',
                f'- **Tür/Kategori:** {m.get("ansiklopedi_turu")} / {m.get("kategori")} / {m.get("alt_kategori")}',
                f'- **Yayın durumu (üretim):** {m.get("yayin_durumu")}',
                f'- **Kısa tanım:** {m.get("kisa_tanim", "")}',
                '',
                '### Resim örnekleri',
                '',
            ]
            for o in m.get('dogrulanmis_resim_ornekleri', []):
                satirlar.append(f'- {o.get("sanatci")} · {o.get("eser")} · {o.get("tarih")} · {o.get("koleksiyon")} [kaynak: {o.get("kaynak_id")}] — bağlam: {o.get("baglam")}')
            satirlar += ['', '### İddialar ve kanıt kayıtları', '']
            for c in m.get('claims', []):
                cid = c.get('claim_id')
                k = kmap.get(cid, {})
                src = ksrc.get(k.get('kaynak_id') or (c.get('kaynak_ids') or [''])[0], {})
                toplam_iddia += 1
                satirlar += [
                    f'#### {mid}/{cid} · tür: {c.get("iddia_turu")} · üretim statüsü: {c.get("dogrulama_durumu")}',
                    '',
                    f'- **İddianın tam ifadesi:** {c.get("iddia")}',
                    f'- **Gösterilen kaynak(lar):** {", ".join(c.get("kaynak_ids", []))}',
                    f'- **Kanıt kaynağı:** {src.get("kurum_yazar", "?")} — {src.get("baslik", "?")} — {src.get("url") or src.get("kunye", "URL/künye yok")}',
                    f'- **Erişim (üretim beyanı):** durum={src.get("erisim_durumu")}, tarih={src.get("erisim_tarihi")}, arşiv={src.get("arsiv_tarihi", "-")}',
                    f'- **Kayıt edilen pasaj:** «{k.get("pasaj", "(pasaj kaydı yok)")}»',
                    f'- **Pasaj konumu:** {k.get("pasaj_konum", "?")} · **belirsizlik ifadeleri:** {"; ".join(k.get("belirsizlik_ifadeleri", [])) or "yok"}',
                    f'- **Destek düzeyi (üretim beyanı):** {k.get("destek_duzeyi", "?")} · **çelişen kaynaklar:** {"; ".join(k.get("celisen_kaynaklar", [])) or "yok"}',
                    '',
                    '**DENETÇİ ALANLARI (doldurun):**',
                    '',
                    '- Gerçekten incelenen kaynak + erişim tarihi: …',
                    '- Kaynak iddiayı destekliyor mu? (EVET/KISMEN/HAYIR/KONTROL EDİLEMEDİ): …',
                    '- Hata veya belirsizlik: …',
                    '- Önem düzeyi (KRİTİK/CİDDİ/KÜÇÜK/YOK): …',
                    '- Düzeltilmesi gereken ifade: …',
                    '- Bağımsız denetçinin kararı: …',
                    '',
                ]
            tart = str(m.get('akademik_tartismalar', '')).strip()
            if tart:
                satirlar += ['### Akademik tartışmalar (üretim beyanı)', '', tart, '', '### Madde geneli denetçi kararı', '', '- Madde kararı (TASLAK/BAGIMSIZ_DENETIM_BEKLIYOR/YAYIN_ONAYLI önerisi): …', '- Gerekçe: …', '', '---', '']
    satirlar.insert(6, f'**Kapsam:** {toplam_iddia} iddia.')
    return '\n'.join(satirlar)

def main():
    out = os.path.join(ROOT, 'denetim')
    for hakem, fn in (('GPT Astra', 'ASTRA_PAKETI.md'), ('Fable', 'FABLE_PAKETI.md')):
        yol = os.path.join(out, fn)
        with open(yol, 'w', encoding='utf-8') as f:
            f.write(paket_uret(hakem))
        print('yazıldı:', yol)
    return 0

if __name__ == '__main__':
    sys.exit(main())
