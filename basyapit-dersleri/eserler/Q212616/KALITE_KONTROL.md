# KALİTE KONTROL — Q212616 · Medusa'nın Salı (Le Radeau de la Méduse) · Théodore Géricault

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti4/Q212616-brief.md`); ham cache `.qwen/tmp/parti4/`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q212616 için temiz.
- **Toplam iddia:** 81 (C001–C081). **A=30, B=36, C=2, D=10, E=3.**
- **A düzeyi:** Louvre birincil collections notice (S3 HTML + S4 JSON, güncelleme 24.04.2026) + eski FR notice (S5, Wayback 2021-02-03): künye, tam provenance, Salon 1819, Londra/Dublin, restorasyonlar, bağlı eskizler (RF 1667/2229/579/580), "manifeste du Romantisme", Salon eleştirileri, Michelet.
- **B düzeyi:** en/fr/it wikitext (S6/S7/S8) satır içi akademik atıf zinciri (Eitner, Grigsby, Riding, Christiansen, Miles, Boime, Berger & Johnson, Chenique, Clark, Fried, Elsen, Nicholas, Wellington vb.) — **metinlere erişilmedi** (C058).
- **C:** C047 (zayıf sal ölçüsü ~20×7 m, blog refs — kullanılmadı), C081 (açıkça işaretli estetik/felsefi yorum sentezi).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B kanıtlı; 5 AU serbest (C/D/E dahil). CS çeldirici gerekçeleri bağlamsal (totoloji yok). Quiz doğru cevapları D/E'ye dayanmaz; ihtilaflı nicelikler (gün/sayı/halat/yer/açılış günü/yaş) soru yapılmadı.
- **D/E işareti:** 10 D "(tartışma)", 3 E "(belirsiz)"; post-pass (build önce, yapı koruyucu) ile güvence; dogrula belirsizlik işareti uyarısı YOK.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak otomatik.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Ham cache'ler 14 Kasım 2026'da yeniden açılıp iddialarla karşılaştırıldı (taslağı yeniden okumak değil, kaynak metnine dönüş):
- **S3/S4 (Louvre birincil):** künye (1818–1819, huile sur toile, 491×716, INV 4884/C 51, Salle 700 Mollien), objectHistory (Rey tuval 440 fr, Théâtre-Italien bitiş, Salon livret 510, Bullock/Londra/Dublin, Forbin teklifleri, 1824 posthume satış 6005 fr Dedreux-Dorcy, karar 12/11/1824, C 51, 1826– oda tarihi, Villot INV, Ronjat/Guillemet kopya, I./II. DS tahliye, 1848/1948/1949/2018 restorasyon), notices liées ✓.
- **S5 (eski notice):** "manifeste du Romantisme", hazırlık (maket/balmumu/morg), "clair-obscur caravagesque", Salon alıntıları (Journal de Paris/Coupin/Jal), Michelet, Gros/Girodet ✓. **Aynı kurumun iki notice'i farklı:** 12↔13 gün, 15↔10 kurtarılan, "quatre cents hommes"↔"plus de 150 soldats" → D olarak beyan.
- **S6/S7/S8 (wikitext):** kompozisyon/figür/Jean Charles-Joseph/Delacroix-Jamar modeller, bitüm, Salon/Londra/Dublin alımlama, etki zinciri, öncüller (Copley/Goya/Prud'hon/Michelangelo), Wedgwood karşıtlığı, Cooke kopyası, Butor/Apeshit ✓. itwiki iç hataları (29/33 yaş, Salon mekânı) ve zayıf blog refs tespit → C055/C047.
- **S1 (WD):** P571 1819 precision 9 (refs ölü URL), P136 "Venel" hatası, refsiz P2048/P2049/P217/P276, P347 Joconde 000PE001303 → C059.
- **S9/S10 (Commons):** P18 5872×4008 PD "Unknown source"; WGA08630 5907×4014 PD-Art "art database"; oran 1,4716 ≈ data 1.47 ✓. Louvre foto © GrandPalaisRmn (PD değil).
- **10 ihtilaf D:** C017, C048–C056. **3 E:** C057 (görsel), C058 (metinler), C059 (WD).

**Erişilemeyen:** akademik kitap/makale metinleri (yalnız atıf zinciri, C058); eski louvre.fr notice URL'leri ölü (S13; FR arşivi S5 ile ikame); JSTOR/paywall fetch denenmedi. Uydurma DOI/ISBN/sayfa/alıntı/envanter üretilmedi.

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12): **Q212616 için 0 hata / 0 uyarı.** Genel koşudaki 4 hata başka eserlere aittir (Q1368055, Q311243 — eksik DERS/SORULAR.json; bu parti kapsamında değil, DOKUNULMADI). CJK taraması: **0**. `bolum_eslesme` 12 bölüm; `durum="İnsan incelemesi bekliyor"`; `gorsel.dogrulama.incelenen_bolgeler=[]`.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 420 | 400–500 | 3 dk |
| Orta | 1304 | 1300–1600 | 10 dk |
| İleri | 2658 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok (dogrula yakın-tekrar ve seviyeler-arası tekrar uyarısı YOK). İleri ders gerçekten daha derin: hazırlık yöntemi, kaynak eleştirisi, akademik tartışma envanteri, felsefi sentez, provenance/koruma.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (S9 P18 PD "Unknown source"; S10 WGA08630 PD-Art). **Vision kotası ana oturumda kullanıldığı için hiçbir görsel açılmadı/incelenmedi (C057 E).** Kompozisyon S3/S5 (A) + S6/S7/S8 (B) METNİNDEN; "kaynakların betimlediği" ifadesi kullanıldı. **GZ TASLAK.** Louvre'un kendi fotoğrafları © GrandPalaisRmn (PD DEĞİL) → kullanılmadı, yalnız metadata notu. Görsel projeye kopyalanmadı; URL+lisans referans verildi. **İnsan editör görsel teyidi ZORUNLU** (özellikle data'nın doğrulanmamış "kırmızı örtü"/"rüzgâr yelkeni iter" ayrıntıları).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C057, E):** incelenemedi; GZ TASLAK; insan editör zorunlu. data betimindeki "kırmızı örtü" ve "rüzgâr yelkeni iter" ayrıntıları erişilen kaynaklarda yok → görsel teyit.
2. **10 ihtilaf (D):** tarih (1818–1819↔1819), gün (12↔13), enkaz yeri (Sénégal↔Moritanya), kurtarılan (15↔10), halat (kesildi↔çözüldü↔koptu), Argus (arama↔tesadüf), Londra açılışı (12↔10 Haziran), II. DS (Sourches↔Chambord), itwiki hataları, başlık varyantı. Kesinleştirme yapılmadı; editör kararı.
3. **Birincil iç evrim (S3↔S5):** aynı kurumun güncel/eski notice'i farklı sayılar verir; hangisinin esas alınacağı editör onayı.
4. **Akademik metinler (C058, E):** Eitner/Grigsby/Riding/Christiansen/Miles/Boime/Berger & Johnson/Chenique vb. erişilmedi; B iddiaları atıf zincirine dayanır; haricî doğrulama gerekli.
5. **WD anomalileri (C059, E):** P136 "Venel", refsiz alanlar, P571 precision 9; import edilmemeli.
6. **Yorumlar (C081, C; İleri §7):** sublime/Burke çerçevesi ve "kahramansız tarih resmi" sentezi açıkça yorum; sanatçıya etki iddiası yok; editör onayı.
7. **Konu hassasiyeti:** enkaz/ölüm/yamyamlık yalnız akademik ve açık ayrıntısız (C015); ton korunmalı.
8. **data/ uyuşmazlıkları:** KANIT §5'teki 13 veri notu (tarih/gün/halat/yer/kurtarılan/figür adı/kunye eksikliği vb.) insan onayına sunulur; data DEĞİŞTİRİLMEZ.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema, çapraz tutarlılık, quiz A/B, kelime, CJK, D/E işareti). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil Louvre AÇILDI (A); görsel İNCELENEMEDİ (E); 10 ihtilaf D açık; insan editör görsel teyidi + kaynak geri dönüşü + editoryal onay kritiktir.**
