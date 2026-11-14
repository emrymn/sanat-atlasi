# KALİTE KONTROL — Q1245354 · Folies-Bergère'de Bir Bar (A Bar at the Folies-Bergère) · Édouard Manet

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti5/Q1245354-brief.md`); ham cache `.qwen/tmp/parti5/Q1245354-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q1245354 için temiz.
- **Toplam iddia:** 60 (C001–C060). A=18, B=18, C=2, D=8, E=14.
- **A düzeyi (18):** Courtauld birincil canlı (S4) + Wayback 2021 (S5) + A&A Wayback 2022 (S6) + Art UK (S8) + WD (S1): künye, boyut, envanter, imza, edinme, ilk sergileme, model, röntgen, kariyer, teknik.
- **B düzeyi (18):** Getty/Park (S7), en/it wiki atıf zinciri (S2/S3), Commons metadata (S10), PD (S1). Kitap/makale metinlerine erişilmedi; ISBN/sayfa wikitext'ten aynen.
- **C (2):** Courtauld "cazip dizi" yorumu (C056); felsefi sentez (C057) — "(yorum)" işaretli.
- **D (8):** C036–C043 (tarih, ayna, edinme, Bass yorumu, tür, Bass konumu, meyve, aksesuar) — "(tartışma)" işaretli.
- **E (14):** Chabrier, Suzon soyadı, cameo, tür/akım zayıf, erken eleştiri, salon, elektrik, sarı eldiven, Olympia/gül, görsel, refs, ayna geleneği — "(belirsiz)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B kanıtlı (doğrulandı: A/B dışı kanıt YOK); 5 AU serbest (C/D/E dahil). Yanlış seçenek gerekçeleri bağlamsal (totoloji yok).
- **GZ TASLAK:** görsel incelenmedi → gen.py `gz_taslak` otomatik uygulandı (5/5 ipucu "TASLAK" ile başlıyor).
- **D/E belirsizlik işareti:** post-pass ile etiket sonrasına "(tartışma)"/"(belirsiz)" eklendi; etiket öncesi çiftler temizlendi. dogrula D/E işareti uyarısı yok.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Ham cache'ler 14 Kasım 2026'da yeniden okunup iddialarla karşılaştırıldı (yalnız taslak yeniden okunmadı):
- **S4 Courtauld canlı** (301→200): "last major painting… a year before he died", "exhibited in 1882 at the Salon", "Ignoring normal perspective… shifted… to the right", "bottles on the left… misaligned", "wine, champagne, peppermint liqueur and British Bass beer… red triangle", "trapeze artist in green boots", salon çift etiketi (LVMH Great Room L3 ↔ Blavatnik Room 5) ✓.
- **S5 Wayback 2021-04-15:** "opened in 1869", Maupassant "vendors of drink and of love", "set up a bar… Suzon", "In the Making" röntgen (arms crossed across waist, right hand clasping left arm above wrist, glovelessness/protection, opera glasses late addition), "very ill and almost invalid… still in his studio when Manet died in 1883", kariyer (Couture, Déjeuner 1863 reddi, Olympia 1865 skandal, Titian Urbino Venüsü 1538) ✓.
- **S6 A&A Wayback 2022-02-14** (canlı 404): "Signed, on bottom wine label, bottom left & recto, Manet / 1882", canvas 96×130 / frame 137.3×171.6×17, "Courtauld, Samuel; gift; 1934", "P.1934.SC.234", "Paris's first music hall", keyword "oranges" ✓.
- **S7 Getty canlı** (200): Park "one-point perspective", "viewpoint… to the right", "man stands outside the painter's field of vision, to the left… looks away", "slightly askance", "visual decoy", tez UNSW 2001, rekonstrüksiyon 2000 ✓.
- **S8 Art UK Wayback 2025-09-14** (canlı 403): "H 96 x W 130 cm", "P.1934.SC.234", "gift from Samuel Courtauld, 1934", Somerset House adresi ✓.
- **S2/S3 wikitext, S9 VAC, S1 WD, S10 Commons** yeniden doğrulandı: WD P571 precision=9 (1882), P195 preferred Q12110695 + P580=1934, P217 P.1934.SC.234 (ref'siz), P6216 Q19652, P4701 NQE8B0Mjo2nq2g, P135 blog ref, P136 ref'siz; Commons IMG1 CC BY 2.0 (AttrReq true, FLV caption "Don de Courtauld, 1932"), IMG2 PD 12580×9236 (Google Art Camera), IMG3 PD 3419×2553 (DateTimeOriginal "1881-1882") ✓.
- **Sekiz ihtilaf D** açıkça karşılaştırıldı; birincil katalog 1882/1934'ü destekler, ikincil varyantlar not edildi. **Görsel:** yalnız metadata; İNCELENMEDİ (C049).
- **Erişilemeyen:** FLV (S11); kitap/makale metinleri (C050) — atıf zinciri notuyla.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **Q1245354 için 0 hata, 0 uyarı.** CJK: 0. `bolum_eslesme` 12 bölüm; `durum="İnsan incelemesi bekliyor"`; `gorsel.dogrulama.incelenen_bolgeler=[]`. Kavram 5, kazanım 5, CS 10, DY 5, AU 5, GZ 5, TK 5. KANIT "Sayım:" satırı DERS.json ile tutarlı (60; A18/B18/C2/D8/E14).
- **Not:** dogrula genel SONUÇ'undaki hata/uyarılar eşzamanlı başka parti eserlerine aittir; Q1245354'ün kendi satırı temizdir (bellek: concurrent-batch-dogrula-aggregate).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 406 | 400–500 | 3 dk |
| Orta | 1321 | 1300–1600 | 10 dk |
| İleri | 2615 | 2600–3200 | 20 dk |

Üçü de hedef aralıkta; dolgu/tekrar yok (yakın tekrar ve seviyeler arası birebir cümle uyarısı yok). İleri düzey gerçekten daha derin: birincilin iç çelişkisi, provenance hipotez zinciri, ayna metodolojisi, röntgen, ikonografi envanteri, felsefi okuma, akademik tartışma haritası.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (3 dosya): IMG1 CC BY 2.0 (4330×3221, FLV 2019 fotoğrafı, atıf zorunlu), IMG2 PD (12580×9236, Google Art Camera), IMG3 PD (3419×2553, uygulamanın kullandığı). **Görseller İNCELENMEDİ (C049 E)** — vision kotası ana oturumda. Kompozisyon S4/S5/S6 (A) + S2/S3 (B) METNİNDEN ("kaynakların betimlediği"). **GZ TASLAK.** Görsel projeye kopyalanmadı.
- **Lisans riski:** data/eserler_onbellek.json IMG1 lisans alanı BOŞ ↔ CC BY 2.0 (atıf zorunlu). IMG2 daha yüksek çözünürlüklü PD alternatif. Art UK görseli ayrı hak rejimi (non-commercial), kullanılmadı. S6 "© The Samuel Courtauld Trust" kurum beyanıdır (eser PD, C051).
- **İnsan editör görsel teyidi ZORUNLU** (özellikle Bass sağ/sol C041, meyve C042, aksesuar C043, elektrik C045, sarı eldiven C046 hotspotları).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C049, E):** incelenmedi; GZ TASLAK; insan editör zorunlu.
2. **Sekiz ihtilaf (D, C036–C043):** tarih 1882↔1881-1882; ayna Courtauld↔Park; edinme 1934↔1932; Bass anti-Alman↔realizm; tür; Bass konumu (data sağ↔sol); meyve (mandalina↔portakal); aksesuar (madalyon↔cameo).
3. **data/ düzeltme önerileri:** Bass "sağ uç"→sol (C041); "mandalina"→portakal (C042); "madalyon"↔cameo (C043); "Perspektif bilerek bozulmuştur"→iki okuma (C037); IMG1 lisans alanı boş→CC BY 2.0 (C052). (data/ DEĞİŞTİRİLMEDİ; ana oturum kararı.)
4. **E belirsizlikler:** salon çelişkisi (C044), Chabrier provenance atıfsız (C028), "Suzon Tonnerre" şüpheli kaynak (C029), elektrik lambaları (C045), sarı eldiven (C046), "Olympia'yı hatırlatır" (C047), "iki gül" (C048), erken eleştiri atıfsız (C033), zayıf WD tür/akım (C031/C032), ayna geleneği atıfsız (C055).
5. **Literatür (C050, E):** kitap/makale metinleri erişilmedi; atıf zinciri teyidi gerekli (Lanier, Bendiner, Meyers, Collins, de Duve, Park tezi, Rambert, Campany, Rizzoli, Cricco-Di Teodoro, Abate-Rocchi, Adorno, Giordano, Odifreddi, Tinterow).
6. **Felsefi yorumlar (İleri §7, C057):** Merleau-Ponty/Foucault/Baudelaire çerçeveleri ödünç; etki iddiası yok; editör onayı.
7. **Karşılaştırma:** Las Meninas paralelliği atıfsız (C055); Olympia/Las Meninas müfredatta bağımsız eser değil (mufredat_ici=false).

## 7. Yayına adaylık

Otomatik kısım sağlandı (Denetim A + B, şema, kelime, quiz A/B, CJK 0). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil Courtauld AÇILDI (A); görsel İNCELENMEDİ (E); sekiz ihtilaf (D) ve çok sayıda belirsizlik (E) açık; insan editör görsel teyidi + data düzeltme kararları + literatür teyidi kritiktir.**
