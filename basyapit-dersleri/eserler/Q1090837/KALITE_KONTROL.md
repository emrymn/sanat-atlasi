# KALİTE KONTROL — Q1090837 · Asnières'de Yıkananlar (Une baignade à Asnières) · Georges Seurat

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti5/Q1090837-brief.md`).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q1090837 için temiz.
- **Toplam iddia:** 51 (C001–C051). A=15, B=14, C=5, D=5, E=12.
- **A düzeyi (C001–C015):** National Gallery birincil katalog (S6, canlı 200 tam metin; S7 özdeş redirect) + Art UK Wayback (S9). Künye/konu/teknik/provenance/sergi/audio.
- **B düzeyi (C016–C029):** en/it Wikipedia satır içi akademik atıf zinciri (balayé, mekân, Indépendants, eleştiriler, X-ışını, hazırlık, renk kuramı). Kitap/makale metinlerine erişilmedi (C051).
- **C düzeyi (C030–C034):** Wikidata refsiz / enwiki atıfsız; derslerde "(yorum)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B kanıtlı; 5 AU serbest (C/D/E dahil). Doğru cevaplar D/E'ye dayanmaz; yorum tek doğru cevap yapılmaz. Çeldirici gerekçeleri bağlamsal (totoloji yok).
- **D/E işareti:** 5 D "(tartışma)" (C035–C039); 12 E "(belirsiz)" (C040–C051); post-pass ile eklendi, belirsizlik işaretleri temiz.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak ipuçlarına TASLAK öneki ekledi.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

S6 (NG birincil, canlı 200 tam metin), S7 (data.ng.ac.uk → S6 redirect), S9 (Art UK Wayback 2024-07-29; canlı S8 403), S2/S3 (en/it wikitext), S1/S4 (WD), S5 (Commons metadata) 14 Kasım 2026'da açıldı/okundu:
- Künye (1884, oil on canvas, 201×300, NG3908, Room 44, Courtauld Fund 1924, imza) ✓ (S6/S9).
- Konu/teknik/provenance/sergi/audio ✓ (S6). Noktacılık DEĞİL + kısmi rötuş ✓ (S6 In-depth).
- balayé/mekân Courbevoie/Indépendants no 261/1886 New York/Alexis-Bazire-Signac/The Sun/X-ışını/de Hauke 14+9/renk kuramı ✓ (S2/S3).
- **Beş ihtilaf D:** boyut (C035), eskiz/desen sayısı (C036), baca dumanı (C037), nokta rengi (C038), komün (C039). **On iki belirsizlik E** (C040–C051); hedge'ler ("probably in 1900", "may work", "contentious theory", "forse", "It seems possible", "some 13", "13 or 14", "seemingly male") AYNEN korundu.
- **Görsel:** S5 metadata only; vision kotası ana oturumda → İNCELENEMEDİ (C050).

**Erişilemeyen:** S8 canlı (403 → S9 arşiv), S11 (ölü), S12/S13 (çekilmedi); kitap/makale metinleri (C051).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12 AKTİF): **Q1090837 için 0 hata; 0 uyarı.** Genel çıkıştaki HATA'lar öteki eşzamanlı parti eserlerinin "eksik dosya" satırlarıdır (Q1090837'ye ait değil). CJK: 0 (6 dosya tarandı). `bolum_eslesme` 12 bölüm; durum "İnsan incelemesi bekliyor".

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 441 | 400–500 | 3 dk |
| Orta | 1460 | 1300–1600 | 10 dk |
| İleri | 2695 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok, seviyeler arası birebir ortak uzun cümle yok.

## 5. Görsel doğrulama (Kural 6)

Commons File:Baigneurs a Asnieres.jpg, 6367×4226 px (~11,6 MB), **Public domain** (PD-Art / PD-old-100-expired; Copyrighted False, AttributionRequired false). Credit "National Gallery, London" → S6 URL teyidi. WD P6216 public domain. **Görsel İNCELENEMEDİ (C050 E):** vision kotası ana oturumda; yalnız metadata/lisans. Kompozisyon S6 (A) + S2/S3 (B) METNİNDEN; derslerde "kaynakların betimlediği" ifadesi. **GZ TASLAK.** Görsel projeye kopyalanmadı; URL + lisans + kaynak referans. ObjectName anomalisi (C048): eskiz başlığı ana tablo dosyasına bağlı. **İnsan editör görsel teyidi ZORUNLU.**

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C050, E):** incelenemedi; GZ TASLAK; insan editör teyidi zorunlu (özellikle D3 baca dumanı, D4 nokta rengi görsel kontrolü).
2. **Beş ihtilaf (D):** boyut 300↔301/301,5 (C035); eskiz 13/14 + desen 9/10 (C036); baca dumanı NG↔itwiki (C037); nokta rengi sarı+mavi↔mavi+turuncu (C038); komün Asnières↔Courbevoie (C039).
3. **On iki belirsizlik (E):** Fénéon "probably in 1900" (C040); Grande Jatte bağı "contentious theory" (C041); oğlanın hareketi (C042); toplumsal okuma (C043); ilk fikir 1882 (C044); son eskiz boyutu (C045); "1887" atıfsız (C046); Venturi sayfa (C047); Commons/WD başlık anomalisi (C048); Grande Jatte tarihi NG içi (C049).
4. **Veri notları (data/ dokunulmadı):** özet "yüzen" ↔ NG "yüzmüyor gibi"; konu "nu" ↔ yarı çıplak/mayolu; önbellek lisans boş "l":"" ↔ PD teyitli; rötuş "1887 turuncu+mavi" ↔ NG "sarı+mavi"; ders_kaynaklari kanit_adaylari[4] seviye yükseltme önerisi. Düzeltme önerileri ana oturuma sunulur.
5. **Literatür (C051, E):** kitap/makale metinleri erişilmedi; atıf zinciri olarak aktarıldı.
6. **Felsefi/estetik yorumlar (İleri §7):** açıkça "(yorum)" işaretli; Seurat'nın bir filozoftan etkilendiği iddia edilmez; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema, çapraz tutarlılık, quiz A/B, kelime, 12 bölüm, CJK 0). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil NG CANLI AÇILDI (A); Art UK canlı 403 → Wayback (B); görsel İNCELENEMEDİ (E); GZ TASLAK; insan editör görsel teyidi + D/E kararları + data düzeltme onayı kritiktir.**