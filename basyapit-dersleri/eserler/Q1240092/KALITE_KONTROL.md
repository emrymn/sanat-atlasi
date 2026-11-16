# KALİTE KONTROL — Q1240092 · Papa X. Innocentius'un Portresi · Diego Velázquez

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ (birincil canlı 200 + ham cache bağımsız yeniden okuma) · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti3/Q1240092-brief.md`); üretim `.qwen/tmp/parti3/uret-Q1240092.py`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q1240092 için **0 hata**.
- **Toplam iddia:** 60 (C001–C060). **A=11, B=25, C=9, D=10, E=5.** KANIT "Sayım:" satırı DERS.json ile birebir.
- **A düzeyi:** Doria Pamphilj birincil IT+EN+I Capolavori (künye/konu/tarih/bağlam/korunma/Camerino/övgüler; Bernini+Algardi+FC 237=Lorrain).
- **B düzeyi:** Kauffmann 2009 no.185 arşiv PDF (provenans, yazıt, Titianesque, tarih hipotezleri, otograflık zinciri, kopyalar, Apsley künye/provenans/CONDITION), Art UK Wayback, WGA, wiki atıf zincirleri (zincir notuyla).
- **C düzeyi:** atıfsız wiki cümleleri (keten/yaz çıkarımı, mahremiyet, transkripsiyon, Ghost, NGA "circle", Bacon "avoided", atıfsız kırmızı betimi) — derslerde "(yorum)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B kanıtlı** (otomatik denetim doğruladı); 5 AU serbest (C/D/E dahil). Yanlış seçenek gerekçeleri bağlamsal (totoloji yok; CS02 FC 237/FC 241/WM çeldiricileri gerçek envanter bilgisiyle).
- **D/E işareti:** 10 D "(tartışma)", 5 E "(belirsiz)" — post-pass + doğal dil işaretleri; dogrula belirsizlik taraması temiz.
- **GZ TASLAK:** görsel incelenmedi → gen.py gz_taslak otomatik işaretledi.
- **12 bölüm eşlemesi** tam; durum "İnsan incelemesi bekliyor"; insan_onayi "Bekliyor".

## 2. Denetim B — Kaynağa bağımsız geri dönüş

- **Birincil IT sayfası CANLI yeniden açıldı** (2026-11-14, curl HTTP 200, 194.988 B; `.qwen/tmp/parti3/Q1240092-doria-it-recheck.html`): "141 x 119 cm; olio su tela (FC 289)", "probabilmente fra la fine del 1649 e il gennaio del 1650", "con realismo e senza nasconderne la bruttezza", Vestfalya, Reynolds/Taine, "ottimamente conservato", Camerino/Busiri Vici — **cache ile birebir**.
- **Ham cache'ler brief'ten bağımsız yeniden okundu:** S5 EN + S6 I Capolavori (FC 289; FC 237=Claude Lorrain; Bernini büstü; Algardi Olimpia); S9 Kauffmann PDF tam metni (no.185 basılı s.309–312 = PDF s.308–311; **basılı s.308 = Juan Nieto no.184; "troppo vero"/"too true" tam metinde YOK** → D5/C039 doğrulandı; ISBN 978-1-9034-7078-7, "First published 2009" künye sayfasında); S8 Art UK Wayback (c.1651, 82×71.5, WM.1590-1948, 2004 devir, Jübile notu); S7 WGA tam metin; S2/S3 wikitext; S1 WD EntityData (P571 +1700 precision 7 + P580/P582; P217 FC 289 birincil ref'li; P18 dosya adı çelişkisi); S10 Commons metadata (4 dosya PD).
- **Wayback snapshot URL'leri cache JSON'larından teyit edildi** (Art UK 20250319085900; EH PDF 20150924012007 gerçek PDF; RKD 20261011135033 boş kabuk).
- **Erişilemeyen:** RKD (403 + boş SPA kabuğu, C050); Art UK canlı 403; EH PDF canlı 404; kitap metinleri (C051) — hiçbirinden alıntı/DOI/ISBN uydurulmadı.
- **Semantik sınır:** bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir (bekliyor).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12 AKTİF): **Q1240092 için 0 hata; 7 uyarı** — tümü etiketsiz-olgu tespitçisinin **yanlış pozitifleri**:
1. ORTA "Sanatçının kariyerindeki yeri…" — başlık numarası + "IV. Felipe" kısaltması cümle bölücüyü yanıltıyor; asıl cümle [C056] etiketli.
2–3. ORTA kaynakça erişim metadata'sı ("Erişim 2026-11-14, HTTP 200…", "Art UK kaydı, Wayback 2025-03-19 (S8).") — madde imi bölünmesi; eser olgusu değil, erişim künyesi.
4. İLERI Keith/Carr cümlesi — alıntı içindeki "initial study ... or an autograph replica" üç noktası bölünme yapıyor; cümle [C017] etiketli.
5–7. İLERI kaynakça metadata'sı ("C.M." kısaltması bölünmesi; "Canlı URL 404; Wayback 2015-09-24…", "Canlı 403; Wayback 2025-03-19…") — erişim künyesi.

Gerçek bir etiketsiz cümle (WD P571 ham değer cümlesi) tespit edilip [C049] ile etiketlendi. **CJK: 0** (7 dosya + uret betiği tarandı). Global dogrula çıktısındaki 8 hata **başka eserlere** ait (Q2653851, Q3998985, Q512755, Q7731855 — eksik dosya; bu parti kapsamında değil, DOKUNULMADI).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 416 | 400–500 | 3 dk |
| Orta | 1329 | 1300–1600 | 10 dk |
| İleri | 2677 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok (yakın-tekrar ve seviyeler-arası tekrar denetimleri temiz). İleri ders gerçekten daha derin: yöntem, tarih kanıt türleri, otograflık zinciri, provenans, felsefi yorum (açıkça C), alımlama.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (4 dosya, tümü Public domain PD-art/life+100); **piksel içeriği İNCELENMEDİ (C052 E)** — vision kotası ana oturumda. Kompozisyon birincil (A) + Kauffmann/WGA/enwiki (B/C) **metninden**: üç çeyrek boy, oturur, elinde yazılı kâğıt; kırmızı tonalite. **GZ TASLAK.** Ana proje görseli 1685×2000 (gallerix credit); en yüksek çözünürlük 5613×6731 ama **dosya adı künyesi hatalı (140×120, inv.237)** — görsel seçerken dosya adına güvenilmemeli. Galeri kendi görseli indirilmedi; reproduksiyon yönetmeliği geçerli. Görsel projeye kopyalanmadı. **İnsan editör görsel teyidi ZORUNLU.**

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C052, E):** incelenmedi; GZ TASLAK; insan editör görsel teyidi zorunlu (özellikle kompozisyon ve kırmızı tonalite betimleri).
2. **Tarih (D3, C043):** birincil "probabilmente fine 1649–gennaio 1650" ↔ Pons 13 Ağustos 1650 oturma belgesi (üst sınırın dışında) ↔ Harris 26 Nisan 1649 hipotezi — çözülmedi; editör kararı.
3. **"Troppo vero" (D5/E1, C039/C038):** enwiki Kauffmann s.308 atfı doğrulanamadı (s.308 Juan Nieto; anekdot katalogda yok); rivayet olarak korundu — editör onayı.
4. **Kâğıt tarihi (D4, C044):** itwiki "1650 yazılı" ↔ Kauffmann/enwiki "now illegible, read as 1650"; transkripsiyon farkları.
5. **Apsley statüsü (D6, C045/C017):** study/otograf replika tartışması açık; Art UK c.1651 ↔ başlık 1650.
6. **Veri notları (data/ dokunulmadı):** yil=1700 artefaktı (D10); inç boyutları; "inv.237" dosya adı; "kırmızı-mor" ton ("mor" desteksiz); eser_ayrintilari nokta koordinatları görselsiz doğrulanamaz — KANIT §5, insan onayına sunulur.
7. **Erişim boşlukları (C050/C051):** RKD ve kitap metinleri erişilemedi; atıf zincirleri (Harris, Pons, López-Rey, Carr, Boschini, Palomino) ikincil aktarımla sınırlı.
8. **Felsefi yorum (İleri §7):** tamamı C, açıkça işaretli; düşünür etkisi iddia edilmedi — editör onayı.
9. **WD P18 ↔ P217 çelişkisi (D2):** ana oturum WD'den künye çekerken P217'yi esas almalı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema, çapraz tutarlılık, quiz A/B, kelime, CJK). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Birincil Doria Pamphilj AÇILDI (A) ve Denetim B'de canlı yeniden doğrulandı; görsel İNCELENMEDİ (E); 10 D + 5 E açıkça beyan edildi. **Haricî model/insan editör denetimi + görsel teyit + veri notu kararları olmadan yayımlanmaz.**
