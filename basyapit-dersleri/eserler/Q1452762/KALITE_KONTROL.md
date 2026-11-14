# KALİTE KONTROL — Q1452762 · Paris Sokağı, Yağmurlu Hava (Paris Street; Rainy Day) · Gustave Caillebotte

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti5/Q1452762-brief.md`); ham cache `.qwen/tmp/parti5/Q1452762-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü bu eser için temiz.
- **Toplam iddia:** 58 (C001–C058). **A=34, B=11, C=2, D=6, E=5.**
- **A düzeyi:** AIC nesne sayfası (K1) + API (K2) + Groom & Keegan 2015 akademik katalog (K3, Wayback 2019-06-20) + "Returns" sergi sayfası (K8). Künye, provenans, sergi/yayın, teknik rapor, konservasyon, başlık/yer dipnotları birincil.
- **B düzeyi:** enwiki (K4, good article; satır içi `sfn` akademik atıf zinciri) + itwiki (K5). Kitap metinlerine erişilmedi → "kaynakçada anıldı, metne erişilmedi" (C051).
- **C düzeyi:** itwiki blog yorumları (C046); WD ref'siz konu unsurları (C049). Derslerde "(yorum)" etiketli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B kanıtlı (doğrulandı: A/B dışı kanıt YOK). 5 AU serbest (C/D/E dahil). Doğru cevaplar D/E'ye dayanmaz; yorum tek doğru cevap yapılmaz. CS10 (camera lucida) A düzeyli "likely" sonucunu sorar; belirsizlik niteleyicisi seçenek metninde korunur.
- **D/E işareti:** 6 D "(tartışma)" (C020, C052–C056); 5 E "(belirsiz)" (C047, C050, C051, C057, C058). Post-pass + inline; dogrula D/E belirsizlik işareti kontrolü temiz.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak otomatik uygulandı (5/5 ipucu "TASLAK" ile başlar).
- **Çeldirici gerekçeleri:** totolojik değil; her yanlış seçenek bağlamsal gerekçeli (dogrula totoloji kontrolü temiz).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda ham cache'ler yeniden açıldı ve iddialarla karşılaştırıldı:
- **K1/K2 (AIC, 200):** title/date 1877/medium Oil on canvas/dimensions 212.2×276.2/inscriptions/credit 1964.336 Worcester/Gallery 201/is_public_domain true/image_id f8fd76e9 ✓. provenance_text (Martial→Minoret→Chardeau→Chrysler→Wildenstein 1964→AIC 1964; komite 25 Kas, mütevelli 21 Aralık 1964) ✓. exhibition_history (1877 kat.1 → 2024–25) ✓. publication_history (1877 basın; "possibly Émile Zola") ✓.
- **K3 (Groom & Keegan 2015, Wayback 2019-06-20, 200):** curatorial entry + Technical Report + Conservation History + Provenance + başlık/yer fn yeniden okundu. "painted when the artist was 28"/"his greatest work"; "frozen moment… camera's shutter"; "willfully studied and photographic"/"wide-angle"; iki kaçış noktası + iğne delikleri; "green lamppost" + 1878 adaları; "place de Dublin" Ocak 1987; başlık fn (1956/1976–77 "Paris, A Rainy Day"/AIC ilk yanlış/1991); foto-kopyalama "unlikely" + tent "poor candidate" + "likely… camera lucida" + "no documentary evidence"; Garcia Mart 2015; ~1:7 + ~%17; palet "possibly a second red lake"; spokes "red and blue"; konservasyon "unclear, but unlikely"/"lavender-hued umbrellas"/"hint of sun after the rain"; "at least twenty-four"; "perhaps that of a veteran flaneur"; Sébillot 1877 ✓.
- **K4/K5 (en/it wikitext, 200):** Haussmann ~137 km/%75; 23 etüt/54×65; "24 individuals"; işçiler; Ribeiro giysi; Morton; "restoration… from insurrection"; repoussoir/lamba bölünmesi; Piero Flagellation; Varnedoe Neo-Empresyonist; vasiyet 67→38; 1964 "most significant catalyst"; D1 fn (1960↔1964) ✓. itwiki "lampioni elettrici" (K3'te yok → C047 E); "papillon" (C054 D); Augé/Baudelaire blog (C046 C) ✓.
- **K7 (Commons metadata, 200):** GAP 5982×4531 PD; AIC 1964.336 2898×2250 PD ✓. **Görsel piksel düzeyinde İNCELENMEDİ** (vision kotası ana oturumda) → C050 E.
- **K8 (Returns, 200):** 19 Mayıs 2014 – 14 Haziran 2015, Gallery 201 ✓.

**İhtilaflar (D) açık:** C052 Wildenstein 1960↔1964; C053 foto↔camera lucida; C054 cravat↔papyon; C055 data 1876–77↔1877; C056 sokak listesi; C020 figür sayısı. **Belirsizlikler (E):** C047 elektrikli lambalar; C050 görsel; C051 kitap metinleri; C057 vernik "early 1900s"; C058 kırmızı tekerlek. A düzeyindeki niteleyiciler (likely/unlikely/may have been inspired/perhaps/possibly/unclear but unlikely) AYNEN korundu.

**Erişilemeyen:** K3 canlı reader (403 Cloudflare → Wayback 2019-06-20 ile çözüldü); K10 Smarthistory essay (JS kabuğu; Wayback video); K11 Chicagoist (ölü); kitaplar + NGA 2015 (D1 1960 tarafı) metne erişilmedi (C051).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **Q1452762 için 0 hata / 0 uyarı.** DERS.json + SORULAR.json şema geçerli; iddia/kaynak kimlikleri eşleşiyor; mükerrer kimlik yok; bolum_eslesme 12; durum "İnsan incelemesi bekliyor". **CJK: 0** (tüm dosyalar). Not: dogrula genel çıktısındaki hata/uyarı sayıları eşzamanlı üretilen diğer eserlere aittir; bu esere özgü sonuç temizdir.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 415 | 400–500 | 3 dk |
| Orta | 1436 | 1300–1600 | 10 dk |
| İleri | 2688 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok (dogrula yakın-tekrar ve seviyeler-arası tekrar kontrolleri temiz). İleri düzey gerçekten daha derin: optik tartışma + Garcia deneyi, vasiyet müzakeresi, konservasyon katmanları, metodoloji ve felsefi yorum.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (2 dosya PD) + AIC CC0; **vision kotası ana oturumda kullanılıyor → piksel düzeyinde İNCELENMEDİ (C050 E).** Kompozisyon K1/K3 (A) + K4/K5 (B/C) METNİNDEN ("kaynakların betimlediği"). **GZ TASLAK** (5/5). Görsel projeye kopyalanmadı; URL + lisans + kaynak referans (GAP Commons + AIC IIIF manifest). **İnsan editör görsel teyidi ZORUNLU** (özellikle kırmızı tekerlek C058, lamba direği bölünmesi, kesik figür).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C050, E):** incelenemedi; GZ TASLAK; insan editör piksel teyidi zorunlu.
2. **D1 Wildenstein yılı (C052):** 1960 (NGA 2015) ↔ 1964 (AIC); NGA kataloğuna erişilmedi — editör NGA metnini doğrulamalı.
3. **D2 hazırlık yöntemi (C053/C033):** foto-kopyalama ↔ camera lucida; "likely" + "no documentary evidence" korunmalı; kesinleştirilmemeli.
4. **A3-6 mükerrer (C045/C055):** "Paris, A Rainy Day" (kurs 1876–77) ayrı eser değil başlık varyantı; tekilleştirme önerisi ana oturuma; data DEĞİŞTİRİLMEDİ. İç denetim çelişkisi (DENETIM_ASAMA3.md:215 ↔ referans/qwen_denetim_dogrulama.md:50) ana oturuma.
5. **D5 boyun bağı (C054):** cravat ↔ papyon; birincil metin belirtmez; data "papyonlu" kesinleştirilmemeli.
6. **C047 elektrikli lambalar (E):** itwiki doğrulanmadı; derste kullanılmadı.
7. **C057 vernik "early 1900s" (E):** erişilen birincil metinde yok; Introduction ayrı bölüm — editör kontrolü.
8. **C058 kırmızı tekerlek (E):** data "kırmızı" ↔ K3 "red and blue"; görsel teyit.
9. **Felsefi yorumlar (İleri §7):** Benjamin aura / flâneur / restorasyon okuması ödünç çerçeveler; sanatçı etkilenimi iddiası YOK; editör onayı.
10. **Literatür (C051, E):** kitap metinleri erişilmedi; B iddiaları atıf zinciri notlu.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + quiz A/B + D/E işareti + kelime + CJK). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil AIC AÇILDI (A); görsel İNCELENMEDİ (E); insan editör görsel teyidi + D1/D2 ihtilaf çözümü + A3-6 tekilleştirme kararı kritiktir.**