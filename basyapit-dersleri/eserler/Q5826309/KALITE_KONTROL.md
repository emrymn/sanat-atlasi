# KALİTE KONTROL — Q5826309 · Shin-Ōhashi Köprüsü ve Atake'de Ani Sağanak · Utagawa Hiroshige

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti5/Q5826309-brief.md`); ham cache `.qwen/tmp/parti5/Q5826309-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q5826309 için temiz**.
- **Toplam iddia:** 83 (C001–C083). **A=38, B=18, C=6, D=6, E=15.**
- **A düzeyi:** Met API (55433+36461 canlı), VGM s0114V1962 (canlı, tam provenance), Tokyo Fuji (canlı) + Brooklyn/BM/Freer/Fuji-eski/Bunka/LoC Wayback arşivleri. Künye/seri/imza/mühür/nüsha/Van Gogh kopyası/provenance A.
- **B düzeyi:** en/de/ja Vikipedi (atıf zincirli); kitap-atıflı iddialar (Bicknell/Forrer/Trede/Marks/Schlombs/Uspenski/Weisberg/Milone) zincir notuyla — metne erişilmedi (C065 E).
- **C düzeyi (yorum):** C075 (atıfsız dewiki kenar betimi), C079 (geçicilik/yücelik), C080 (kalabalık/salcı), C081 (çizgisel soyutlama), C082 (çok nüshalılık/Benjamin), C083 (kopya çerçeveleme). Felsefi mercekler ödünç; sanatçı etkisi iddia edilmez (§7).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU serbest (C/D/E dahil). Üretimde A/B dışı kanıt yok (dogrula teyit).
- **D/E işareti:** 6 D "(tartışma)", 15 E "(belirsiz)" post-pass + elle; temiz.
- **GZ TASLAK:** görsel incelenmedi → gen.py gz_taslak 5/5 uyguladı.
- **Totoloji:** CS yanlış gerekçeleri bağlamsal (kurum/seri/teknik/provenance ayrımlı); totolojik çeldirici yok.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Ham cache'ler 14 Kasım 2026'da yeniden açılıp iddialarla karşılaştırıldı (brief'e körü körüne güvenilmedi):
- **Met API 55433 + 36461** (canlı 200): iki ayrı nüsha, JP2522/JP643, 34×24.1, PD ✓ (C040/C041, D006).
- **VGM s0114V1962** (canlı 200): Paris Ekim–Kasım 1887, 73.3×53.8, F0372/JH1297, tam provenance zinciri, "colours more intense", karakter bordürü, "Van Gogh & Japan" 2018 sergisi, "Related works" ✓ (C027/C028/C032/C074).
- **Tokyo Fuji yeni URL** (canlı 200): Ansei 4 (1857), 35.7×24.7, atenashi bokashi, üçlü şemsiye grubu, sanatçı biyografisi ✓ (C044/C017/C077/C070).
- **Brooklyn Wayback 2016** ✓: No.58, 9th month 1857, sheet/image, Uo-Ei, Hiroshige-ga, **katalog betimi: 6 figür, Atakemaru (bakufu gemisi 1630'lar–1682), erken sürüm nüshası (2 ek sal), Shōno karşılaştırması, Plum Park print 30** (C039/C066/C067/C068/C069/C030).
- **BM Wayback 2016** ✓: No 52, 1948,0508,0.5, 1 of 2, mühürler, sergi geçmişi (C042/C012). **Freer Wayback 2015** ✓: F1994.29, provenance, "Copyright with museum" (C043/C060). **Bunka Wayback 2026** ✓: Ansei 3 (1856), "shohan de arō" (olasılık), Kameido Umeyashiki (C049/C051/C030). **LoC Wayback 2025×2** ✓: jpd.02950, [1857], 36.3×24.1, Nichibunken, Gajō icchō, fragile (C045/C071).
- **en/de/ja wikitext + WD + Commons** yeniden okundu; D001–D006 ve E001–E011 doğrulandı.

**Brief düzeltmeleri (kaynağa dönüşte yakalandı):**
1. **C024 kartuş yönü:** brief "3→2 renk" yazmıştı; enwiki/Forrer "three rather than two colours in **later** prints" der → **2→3** düzeltildi. Geç baskı sadeleşmesi ayrı iddia (C076).
2. **Brooklyn katalog betimi** brief'te eksikti → C066–C069 (A) eklendi (6 figür, Atakemaru etimolojisi, erken sürüm, Shōno).
3. **Fuji biyografi + LoC albüm/erişim** cache'lerden doğrulanıp C070/C071 (A) eklendi.
4. **WD P1545="53"** top-level claim değil, **P179 (seri) niteleyicisi** olarak teyit edildi (atıfsız) → C048/C062.

**Erişilemeyen:** BM yeni URL (403), Met web (429), LoC/Bunka canlı (403/502) → arşivden; kitap metinleri (C065 E); Cumming/Poole/Freiburg/MKG/MAK (C036/C037/C047 E).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12 AKTİF): **Q5826309 için 0 hata / 0 uyarı.** `--test` **25/25**. 12 bölüm eşlemesi tam; durum "İnsan incelemesi bekliyor"; `gorsel.dogrulama.incelenen_bolgeler=[]`.
**Not:** dogrula genel çıktısındaki 7 hata / 98 uyarı eşzamanlı üretilen **diğer** eserlere aittir (Q1090837, Q45585, Q698487 vb.); Q5826309 temizdir (genel sayı yanıltır — parti belleği).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 422 | 400–500 | 3 dk ✓ |
| Orta | 1411 | 1300–1600 | 10 dk ✓ |
| İleri | 2679 | 2600–3200 | 20 dk ✓ |

Tümü aralıkta; dolgu/tekrar yok. İleri, Orta'dan gerçekten daha derin (nüsha filolojisi, kaynak eleştirisi, alımlama metodolojisi, felsefi mercekler). Seviyeler arası birebir uzun cümle tekrarı yok.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (3 dosya PD); gösterilen LoC dosyası 5357×8117, PD-Japan, hash 4016e12af98da014 eşlemesi ✓. **Vision kotası ana oturumda → İNCELENMEDİ (C064 E).** Kompozisyon S5/S14/S17 (A) + S2/S3 (B) METNİNDEN; "kaynakların betimlediği" ibaresi kullanıldı. **GZ 5/5 TASLAK.** Görsel projeye kopyalanmadı; URL+lisans+kaynak referans. İkinci P18 dosyası (ticari dijital paket, müze atfı yok) ve montaj incelenmedi. **İnsan editör görsel teyidi ZORUNLU** (özellikle D003 şemsiye grubu ve E003 kartuş rengi).

**CJK politikası:** 3 ders + DERS.json + SORULAR.json + KALITE **CJK 0**. Özgün Japonca başlık (Ōhashi atake no yūdachi), mühürler (mi-kyū / aratame / Hiroshige-ga) ve Bunka alıntıları (shohan de arō / aigasa / atenashi bokashi) **yalnız KANIT_DOSYASI.md §2'de** özgün kanji biçiminde korunur (§15); yapılandırılmış JSON aynası ve dersler romaji/çeviri kullanır. Bu bir karışma değil, bilinçli kanıt-biçimi korumasıdır.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C064, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi zorunlu.
2. **D005 kurum:** data "British Museum" ↔ gösterilen hash LoC ↔ WD P195 LoC yok. Data düzeltmesi + görsel teyit.
3. **D003 figür:** data "şemsiyeli ikili" ↔ Fuji/dewiki "üç adam" ↔ Brooklyn "6 figür"; hangi grup? Görsel teyit.
4. **D002 tarih:** aynı Fuji nüshası için 1857/Ansei 4 ↔ Bunka 1856/Ansei 3; jawiki iç tutarsız. Çözümsüz.
5. **D001 seri no:** 52/58/53 numaralandırma gelenekleri; tek numara dayatılmaz.
6. **D004 ilk sürüm:** Forrer/Marks ↔ Bunka "shohan de arō" (olasılık, gönderge belirsiz); Brooklyn erken nüshası destekler ama kesinleştirilmez.
7. **D006 Met kimliği:** 55433 ↔ 36461 iki nüsha; tek "Met nüshası" sunulmamalı.
8. **E003/E005/E006:** kartuş rengi (sarı↔Braun-Grün-Beige), yayıncı okunuşu, mühür biçimi (yuvarlak↔oval) — data uyuşmazlıkları.
9. **C074 VGM "Related works":** Hiroshige baskısı Van Gogh'un kendi nüshası mı? Bu kayıtta doğrulanmaz.
10. **Literatür (C065, E):** kitap metinleri erişilmedi; B iddialar atıf zincirli.
11. **Felsefi yorumlar (İleri §7, C079–C083):** Kant/Burke/Benjamin ödünç mercekler; kurum dışı, editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema, çapraz tutarlılık, quiz A/B, kelime, 12 bölüm, CJK). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil kayıtlar AÇILDI (Met/VGM/Fuji canlı + 6 arşiv) → güçlü A; görsel İNCELENMEDİ (E); altı ihtilaf (D) açık; insan editör görsel teyidi + data düzeltme onayı kritiktir.**
