# KALİTE KONTROL — Q45585 · Yıldızlı Gece (The Starry Night / De sterrennacht) · Vincent van Gogh

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti5/Q45585-brief.md`); ham cache'ler `.qwen/tmp/parti5/Q45585-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q45585 için temiz (0 hata / 0 uyarı)**.
- **Toplam iddia:** 56 (C001–C056). **A=17, B=18, C=3, D=9, E=9.**
- **A düzeyi (birincil):** MoMA Wayback 2026-11-07 (S5) künye/küratoryal/provenance/terimler + mektup 782 bilimsel edisyon Wayback 2023-10-14 (S9). C025 (F612/JH1731) brief'te B idi; S9 not 8 birincil teyidiyle A'ya yükseltildi (KANIT'te gerekçeli).
- **B düzeyi (ikincil, atıflı):** en/it wikitext (S2/S3) satır içi akademik atıfları (Pickvance, Naifeh-Smith, Boime, Whitney, Loevgren, Soth, Hulsker, Zhao ve ark.); VGM (S10). Hipotez/yorum bayraklı (C016, C022, C023, C024, C031).
- **C düzeyi (yorum):** C028 (takas eserleri, doğrulanmadı), C032 (servi sembolik okuma), C056 (estetik/felsefi; Kant/Benjamin ödünç, etki iddiası YOK). Derslerde "(yorum)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU serbest (C/D/E dahil). Doğru cevaplar D/E'ye dayanmaz; yorum tek doğru cevap yapılmaz. Yanlış seçene gerekçeleri bağlamsal (totoloji yok; gen.cs_gerekce_iyileştir temiz).
- **D/E işareti:** 9 D "(tartışma)", 9 E "(belirsiz)" — post-pass ile tam; dogrula belirsizlik işareti denetimi 0 eksik. C054 (itwiki intihar ifadesi) kullanılmadı.
- **GZ TASLAK:** görsel incelenemedi → gen.gz_taslak 5 soruyu işaretledi.
- **Etiketsiz olgu adayları:** kısaltma kaynaklı heuristic yanlış-pozitifler ("Lillie P.", "Georgette P.", "Proc.", "ark.") cümle bölünmesini tetikliyordu; kredi ayrı cümleye alındı, provenance zinciri madde listesine çevrildi, bibliyografya açılımı yapıldı → 0 aday.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda ham cache'ler yeniden açılıp iddialarla karşılaştırıldı:
- **S5 (MoMA Wayback 2026-11-07, arşiv 200):** künye (The Starry Night / Dutch 1853–1890 / Saint Rémy June 1889 / Oil on canvas / 73.7×92.1 / 472.1941 / Bliss Bequest by exchange / Painting and Sculpture / Floor 5 501) ✓; küratoryal metin (mid-June; observation+departure; day sessions; village not visible; cypress closer; 3/4 sky; crescent right / Venus left of center; nebulae match; thickly applied paint; night "more alive") ✓; Provenance Research Project tam zincir + "work in progress" + [Oldenzeel] ✓; Impasto/Post-Impressionism (Fry 1910) tanımları ✓; Licensing (Art Resource/Scala) ✓.
- **S9 (mektup 782 Wayback 2023-10-14, arşiv 200):** "a new study of a starry sky" ✓; "not a return to the romantic or to religious ideas" ✓; ~18 June 1889 ✓; not 8 "Starry night (F 612 / JH 1731)" ✓; el yazması b643 V/1962 ✓; konkordans "782 (784, 595)" ✓.
- **S2/S3 (en/it wikitext) + S10 (VGM) + S1 (WD):** yeniden okundu. **Dokuz ihtilaf D (C043–C051)** açık: tarihleme (astroarte 19 Haziran/23 Mayıs ↔ mid-June/~18 June; itwiki iç tutarsızlık 30 maggio/2 giugno, 593↔777), itwiki provenance kronoloji (1907→1906 imkânsız), "oleografia" terimi, "spessore minimo"↔impasto, servi görünürlüğü (Pickvance↔Boime/Jirat↔Naifeh-Smith), köy kimliği, VGM basitleştirmesi, F1540 çizimi yeri/medyumu (ayrı eser), WD P127 Schuffenecker P582=1900<P580=1901.
- **Görsel (S6/S7):** metadata only; vision kotası ana oturumda → **İNCELENEMEDİ (C040)**; GZ TASLAK.
- **Erişilemeyen:** S4 MoMA canlı (403 Cloudflare), S8 vangoghletters canlı (JS kabuğu); refs metinleri (Boime PDF ölü, Zhao SPIE subscription, kitaplar, astroarte.it, francescomorante.it urlmorto, podcast, ColourLex) → C042 (E). Kimlikler wikitext kaynakçalarından AYNEN; uydurma bibliyografya/URL/envanter YOK.

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12, `.qwen/tmp/venv-dogrula`): **Q45585 → 0 hata; 0 uyarı.** DERS.json + SORULAR.json şema-uyumlu; ek alan yok; iddia/kaynak kimlikleri eşleşiyor; mükerrer kimlik yok; bolum_eslesme 12 bölüm; durum "İnsan incelemesi bekliyor" (insan_onayi "Bekliyor" ile tutarlı). **CJK taraması: 0** (tüm .md + .json). Genel dogrula çıktısındaki 17 hata / 108 uyarı **öteki eserlere** aittir (eşzamanlı parti5 üretimi: Q17026577/Q227494/Q3793426/Q698487/Q890678 eksik dosya, Q17277950 tutarsızlık vb.); Q45585'e ait HATA/UYARI satırı yok.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 465 | 400–500 | 3 dk |
| Orta | 1330 | 1300–1600 | 10 dk |
| İleri | 2781 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok (yakın-tekrar ve seviyeler-arası ortak-cümle denetimi 0). İleri düzey gerçekten daha derin: tarihleme/provenance ihtilafları, abstraction/stil tartışması, astronomi ve dini yorum ekolleri, teknik çelişki, felsefi analiz, karşılaştırmalı metodoloji. Kelime sayıları nihai (post-pass sonrası) dosyalardan ölçüldü; DERS.json ile birebir.

## 5. Görsel doğrulama (Kural 6)

Commons `File:Van Gogh - Starry Night - Google Art Project.jpg` (pageid 25498286; WD P18 aynı); GAP gigapixel taraması **44567 × 35291 px (~664 MiB)**; lisans **Public domain** (PD-Art / PD-old-100-expired; Copyrighted False; AttributionRequired false). **Bu oturumda İNCELENEMEDİ** (vision kotası ana oturumda); incelenen_bolgeler=[]. Kompozisyon "kaynakların betimlediği" çerçevesinde S5 (A) + S2/S3 (B) metninden; **GZ TASLAK**. Görsel projeye kopyalanmadı; derslerde URL + lisans + kaynak referansı. **Ayrım:** eserin PD statüsü ≠ MoMA'nın kendi fotoğraf/instalasyon görselleri için istediği izin (S5 Licensing: Art Resource / Scala Archives). **İnsan editör görsel teyidi ZORUNLU** (özellikle yıldız sayısı C029, ay evresi C053, "sağda zeytinler" C055, servi görünürlüğü C047).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C040, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi zorunlu. Yıldız sayısı (10↔11, C029), ay evresi (C053), itwiki "sağda zeytinler" (C055) görsel sayım/inceleme bekler.
2. **Dokuz ihtilaf (D, C043–C051):** tarihleme; itwiki provenance kronolojisi; "oleografia"; "spessore minimo"↔impasto; servi görünürlüğü; köy kimliği; VGM basitleştirmesi; F1540 çizimi (ayrı eser, Baldin↔Shchusev); WD P127 anomali. Birincil kayıt esas alındı; ihtilaflar beyan edildi.
3. **Veri notları (data/ dokunulmadı):** basyapitlar[94] "bellekten" hatası (C014) derslerde düzeltildi; ozgun TR doldurulmuş; muze_numaralari 472.1941 eksik; ad karışıklığı (Q47430923 Millet / Q1464531 Rhône / Q18209775); eser_notlari "doğuş öncesi" ifade hatası adayı. İnsan onayına sunulur.
4. **WD P127 anomali (C051):** Schuffenecker P582=1900<P580=1901; WD değiştirilmedi; düzeltme önerisi insan onayına.
5. **Yorumlar (C):** servi sembolizmi (C032), dini okumalar (C023 B-atıflı ama yorum), estetik/felsefi (C056; Kant/Benjamin ödünç, etki iddiası yok), takas eserleri (C028 doğrulanmadı). Editör onayı.
6. **Literatür (C042, E):** refs metinlerine erişilmedi; hipotezler (Boime/Whitney/Naifeh-Smith) ikincil aktarımla sınırlı; birincil makale/kitap teyidi insan editöre.
7. **Birincil sınır:** MoMA canlı 403 → Wayback snapshot (2026-11-07) kullanıldı; salon/teşhir güncelliği ve "work in progress" provenance çekincesi beyan edildi. Mektup 782 canlı JS kabuğu → Wayback (2023-10-14).

## 7. Yayına adaylık

Otomatik kısım sağlandı: künye/atıf birincil doğrulanmış · tüm olgusal cümleler kanıt kayıtlı · yorumlar olgulardan ayrılmış (C) · quiz cevapları A/B'ye dayanıyor · kaynak bağlantıları erişim durumlarıyla kayıtlı · ciddi çelişkiler (9 D) açıkça belirtilmiş · Denetim A + B tamamlandı. **Ancak görsel analiz doğru eser/görselle YAPILMADI (C040) ve insan editoryal onay BEKLİYOR.** Bu nedenle durum **"İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil MoMA + mektup 782 AÇILDI (A); görsel İNCELENEMEDİ (E); insan editör görsel teyidi + veri notu onayı kritiktir.**
