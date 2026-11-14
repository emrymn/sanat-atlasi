# AKADEMİK BAĞIMSIZ DENETİM — Q167605 · Süt Boşaltan Kadın Pilotu

**Denetim tarihi:** 13 Kasım 2026 (gece oturumu)
**Denetlenen sürüm:** `basyapit-dersleri/eserler/Q167605/` (KANIT_DOSYASI.md, DERS_BASLANGIC.md, DERS_ORTA.md, DERS_ILERI.md, SORULAR.json, DERS.json, KALITE_KONTROL.md)
**Yöntem:** Önceki oturumun AI aracılı kaynak özetlerine **güvenilmedi**. Birincil ve ikincil kaynaklar `curl` ile **ham HTML/JSON** olarak yeniden indirildi (`.qwen/tmp/denetim/`) ve betikle mekanik olarak ayrıştırılıp iddia iddia karşılaştırıldı. Görsel, bu oturumda vision köprüsüyle **yeniden** incelendi. Ders dosyaları **değiştirilmedi**; yalnızca bu rapor ve düzeltme önerileri üretildi.
**Bağımsızlık notu:** Bu denetim aynı asistan tarafından ayrı bir turda, ham kaynaklara dayanarak yapıldı; önceki turun özetlerinden bağımsızdır, ancak **üçüncü taraf insan/haricî model denetimi değildir**. AKADEMIK_STANDART §11'in gerektirdiği üçüncü taraf denetimi hâlâ gereklidir.

---

## 0. Genel değerlendirme

Pilot **büyük ölçüde sağlam**. Kimlik, provenance ve 2022 teknik araştırma iddiaları ham birincil kaynaklarla birebir doğrulandı (aşağıda matris). Uydurma bibliyografik bilgiye, kesinleştirilmiş tartışmalı tarihe veya etki iddiasına rastlanmadı. Quiz cevapları A/B kuralına uyuyor; felsefe bölümü açıkça yorum etiketli.

Buna karşılık **12 bulgu** tespit edildi: 1 orta önemde tarihsel nüans hatası (D01), 1 yöntemsel eksik (D11, etiketsiz olgusal cümle), 10 düşük önemde atıf/terminoloji/güncellik sorunu. Hiçbiri dersin ana omurgasını sarsmıyor; ancak kamuya açık akademik yayın hedefi için D01 ve D11 mutlaka, diğerleri tercihen düzeltilmelidir.

**Önem dağılımı:** orta 1 · orta-düşük 2 · düşük 8 · çok düşük 1.

---

## 1. Ham kaynak doğrulama matrisi (özet)

İndirilen ham dosyalar: `rijks-object.html`, `rijks-linkedart.json`, `rijks-press.html` (EN), `rijks-press-nl.html` (NL), `rijks-steen.html`, `steen-linkedart.json`, `wikidata-q167605.json`, `ev-milkmaid.html`, `wiki-milkmaid.html`, `wiki-vermeer.html`, `rijks-lucas.html`.

| İddia kümesi | Ham kaynak | Sonuç |
|---|---|---|
| C001 başlıklar (Het melkmeisje / The Milkmaid / De keukenmeid / De melkmeid) | Linked Art `identified_by` | ✅ birebir |
| C002 Vermeer (1632–1675) | Linked Art LinguisticObject "Johannes Vermeer (1632–1675), olieverf op doek, ca. 1660"; WD P170 Q41264 niteleyicisiz | ✅ |
| C003 c. 1660 | object "Dating c. 1660"; TimeSpan 1660-01-01…1660-12-31 + "c. 1660/ca. 1660"; WD P571 precision 9 + P1480 Q5727902 | ✅ |
| C004 dört tarih önerisi | EV ham: "1660–1661 Albert Blankert… 1975 / c. 1658–1660 Arthur K. Wheelock Jr.… 2000 / c. 1657–1658 Walter Liedtke… 2008 / c.1658–1659 Wayne Franits… 2015"; bülten girişi "(1657-58)" ↔ alt yazı "c. 1660"; object sayfasında "1657" YOK | ✅ (D etiketi doğru) |
| C005–C007 teknik/boyut/envanter | object "height 45.5 cm x width 41 cm", "oil on canvas", "SK-A-2344"; WD P186/P2048/P2049/P217 | ✅ |
| C008 1908 alımı | object provenance "from whose heirs, fl. 550,000, with 38 other paintings, with the support of the Vereniging Rembrandt, to the museum, 1908" | ✅ birebir |
| C009 Gallery of Honour / HG-2.30.3 | object + Linked Art | ✅ |
| C010 imzasız | EV "No signature appears on this work."; object sayfasında "signature"/"inscription" alanı YOK | ✅ |
| C011 tür resmi | object subjects; WD P136 Q1047337 | ✅ |
| C012 Delft | WD P1071 Q690 (müze sayfası yazmıyor; ders "kabul edilir" diyor) | ✅ uygun hedge |
| C013 PD/CC0 | object "Copyright Public domain"; Linked Art creativecommons.org/publicdomain/mark/1.0 | ✅ |
| C014 "?" zinciri | object "? Pieter Claesz van Ruijven (1624-1674) and Maria Simonsdr de Knuijt (1623-1681)… ?… Magdalena… ?… Dissius" | ✅ birebir |
| C015 1696 satışı | object "16 May 1696, no. 2, fl. 175, to Isaac Rooleeuw (1663-1701)" | ✅ birebir |
| C016 sıralama + 200 fl | EV ham: "more than any of the 21 Vermeer's at the same auction, except for the View of Delft" (200 YOK); Wiki ham: "exceeded only by the 200 guilders paid for… View of Delft [2][3]" | ⚠️ sıralama ✅; **200 tek zincir → D02** |
| C017 1908 politikası | EV (Morgan/Bredius/de Stuers/Troelstra) — bu turda yalnız EV; VR sayfası açılmadı | ⚠️ tek kaynak (B korunur) |
| C018 Van Ruijven 21 Vermeer | Wiki ham "at his death, the owner of twenty-one of the painter's works"; EV ham "21 Vermeer's at the same auction" (farklı olgu, ikisi de 21) | ✅ |
| C019 Reynolds 1781 | EV ham "in Holland in 1781… Reynolds saw The Milkmaid and was impressed… wrote (to Edmund Burke)" | ✅ (alıntı genel Hollanda resimleri üzerine; ders yalnız "övdü" diyor — uygun) |
| C064 altı satış fiyatı | object provenance: 1701 no.7 fl.320 · 1719 no.20 fl.126 · 1765 no.65 fl.560 Yver · 1768 no.10 fl.925 Van Diemen · 1798 no.32 fl.1,550 Spaan · 1813 no.96 fl.2,125 Van Winter | ✅ altısı da birebir |
| C020 ~35 resim | bülten "about 35 paintings" | ✅ |
| C021 lonca ücreti | EV ham "only a few years before The Milkmaid was painted… not… enough money to pay in full the entrance fee to the Saint Luke Guild"; Vermeer-Wiki ham "29 December 1653… did not pay the usual admission fee" | ✅ iki kaynak |
| C022 617 fl + iki resim | EV ham "owed… 617 guilders to… Hendrick van Buyten… widow… turned over **two paintings as collateral**"; Vermeer-Wiki ham "The widow **sold** two more paintings to Hendrick van Buyten **to pay off** a substantial debt" + 1663 ziyareti "paintings as collateral"; 617 yalnız EV'de | ⚠️ **nüans/kaynak farkı → D01** |
| C023 tür geleneği | Wiki ham (Aertsen/Beuckelaer/Snyders/Wtewael; Maes) | ✅ |
| C024 tek emekçi tema | EV ham "After The Milkmaid, Vermeer never again turned his attention to a working-class theme." | ✅ birebir |
| C025 2023 sergisi | bülten ham "10 February – 4 June 2023", "at least 27… about 35", "largest… ever", Frick "all three", Mauritshuis/Städel/NGI/NGA | ✅ |
| C026 2009 Met | Wiki ham referans başlığı "Vermeer's Masterpiece The Milkmaid (September 10–November 29, 2009). Metropolitan Museum of Art" + "1939 World's Fair [15]" + Liedtke küratör; Met sayfası/bülteni **429 (bu turda da)** | ⚠️ B zinciri geçerli; birincil erişim yok |
| C027–C028 küratöryel | object ham "entirely absorbed… Except for the stream of milk, everything else is still… stands like a statue" + bu tur görsel teyit | ✅ |
| C029 diyagonal/bilek | object ham: diagonal/wrist/pyramid YOK; EV: YOK; yalnız Wiki'nin Rijksmuseum/Met atfı | ⚠️ **→ D07** (ders hedge'li) |
| C030 ışık/giysi | görsel (bu tur) + EV kolluk betimi "greenish tint" | ✅ (kolluk hue'su mavi-yeşil arası; transkripsiyonlar "blue"/"blue-green" — EV ile uyumlu) |
| C031 noktalar | object ham "hundreds of colourful dots"; EV pointillé; Met "most effusive" Wiki [2] üzerinden | ✅ müze betimi A; Met sıfatı B zinciri |
| C032 masa nesneleri | görsel (bu tur: sepet, somun, kırık parçalar, **kapaklı** mavi stoneware, toprak kap, mavi kumaş) + object Hollandaca betim | ✅ (EV "studded beer jug with a pewter lid" ile kapak ayrıntısı da uyumlu) |
| C033 duvar çivisi | EV ham "A humble nail—another large nail is above the hanging bread basket… casts a small shadow"; Wiki/Cant "nail and nail hole"; görsel "small marks" | ✅ (görsel kısmi; kaynak tam) |
| C034 Cupid çinisi | EV ham "Cupid with a cocked bow… between… skirt and the footwarmer"; görsel: çiniler VAR, Cupid figürü ayırt edilemedi | ✅ kaynak; görsel kısmi (beyan edilmiş) |
| C035 stoofje | görsel (bu tur: delikli kutu, kızıl köz) + object "stoofje"/"foot-stove" | ✅ |
| C036 çatlak cam | Wiki ham Cant "a crack in one (fourth row from the bottom, far right)… another has a scratch"; **EV ham da destekliyor**: "a broken piece of one of the panes" | ✅ (önceki "tek kaynak" notundan daha güçlü) |
| C037 asılı sepet/kap | görsel + object "rieten mand en een koperen pot" | ✅ |
| C038 gateleg masa | EV ham "half of the top of a 17th-century gateleg drop-leaf table… octagonal top" | ✅ |
| C039 craquelure | önceki kırpmada gözlendi; bu tur tam karede belirgin değil | ✅ (kırpma kanıtı geçerli) |
| C040–C046 teknik rapor | EV ham: "thread count is 14 x 14.5 per cm²", "relined with wax/resin in 1950 over an existing paste lining", ground "chalk, lead white and umber", ultramarin/azurit, "lead-tin yellow, the brightest yellow…", duvar "white lead, umber and charcoal black", vermilyon+siyah+madder, "pinhole… above the right hand" | ✅ yedisi de birebir |
| C043 hami hipotezi | EV ham "**Some scholars have speculated** that it was… Pieter van Ruijven who supplied… costly pigment" | ✅ ders "hipotez" diyor — doğru |
| C047 yöntemler | bülten EN ham "Macro-XRF and RIS… Operation Night Watch… collaborating… Mauritshuis"; SWIR ✓; XRPD alt yazı ✓; **NL bülteni ek: "Universiteit van Antwerpen"** | ⚠️ **→ D04** |
| C048 alt boyama | bülten ham "hastily applied thick line of black paint… beneath… left arm… This view is now being revised" | ✅ birebir |
| C049 kannenrek | EN "jug holder"; NL "Een rek met kannen, ook wel **kannenbord** genoemd"; Oortman c. 1690 (gövde) / c. 1686–c. 1710 (alt yazı) | ⚠️ **terim → D03** |
| C050 vuurmand | bülten ham "fire basket… willow stems, or withies… estate inventory… covered over… with the foot stove, Delftware tiles, and the floor"; NL "vuurmand"; EV "vuurmand (fire basket)" | ✅ içerik; "tranquil atmosphere" isimsiz girişte (Dibbits alıntısı değil — önceki düzeltme doğru) |
| C051 terminoloji tarihi | Wiki ham "(the Rijksmuseum web page calls it a 'sewing basket')[1]"; EV vuurmand; bülten fire basket | ✅ D etiketi uygun |
| C052 sonradan ekleme | bülten "covered over" + EV afterthoughts | ✅ |
| C053 camera obscura | Wiki ham Liedtke WNYC: "the light lasts maybe 10 seconds, but the painting took at least months… pin… tied to a string with chalk"; EV ham "Their presence **implies**… camera obscura" | ✅ D etiketi ve atıf zinciri doğru |
| C054/C065 yorum ekolleri | EV ham: Liedtke "discreet object of desire", Wheelock "an ideal of human dignity", Dibbits "similar Cupids… all over Dutch houses… merely coincid[ental]" | ✅ üçü de birebir |
| C055/C066 stoofje emblem | EV ham "'Mignon des Dames' from Sinnepoppen Roemer Visscher 1614 Engraving Universiteits-Bibliotheek, Amsterdam" | ✅ (DBNL birincil kontrolü yapılmadı — gelecek iş) |
| C056 melken + Lucas 1510 | Wiki ham "slang term melken, defined as 'to sexually attract or lure'… Lucas van Leyden's engraving The Milkmaid (1510) [7]"; **Rijksmuseum hikâye sayfası ham: "The Milkmaid, Lucas van Leyden, 1510… introduced a new theme in art"** | ⚠️ argo tek zincir; baskı artık birincil → **D06** |
| C057 Rand | EV ham "Harry Rand… although not universally accepted… bread pudding" | ✅ hipotez olarak sunulmuş |
| C058 onur okuması | Wiki ham (Schama/Laneri) + EV Wheelock | ✅ yorum etiketli |
| C059 kitchen maid | EV ham + eski başlık "De keukenmeid" | ✅ |
| C060 felsefe | derslerde etki iddiası YOK; bölüm "açıkça yorum" etiketli; Kant/Hegel/Benjamin/Berger/Panofsky çerçeve olarak | ✅ uyumlu |
| C061 Steen | object ham "SK-A-385… 1665 - 1668… oil on canvas… Jan Havicksz. Steen… Public domain"; **Linked Art 2006398: 82 × 70.5 cm** | ✅ + boyut artık birincil → **D05** |
| C062/C063 kurumlar | bülten ham NGA Washington / Mauritshuis | ✅ |

---

## 2. Bulgular ve düzeltme önerileri

### D01 — Van Buyten borcu: "kapatıldı" ifadesi kaynakları birleştiriyor (ORTA)
- **İddia:** C022 (DERS_ORTA §3; KANIT_DOSYASI C022).
- **Mevcut ifade:** "fırıncı Hendrick van Buyten'e 617 florin borcu vardı ve borç, eşi Catharina Bolnes'in iki resim vermesiyle kapatıldı."
- **Kaynakta gerçekten bulunan:** Essential Vermeer (ham): "After the painter's untimely death, his widow, Catharina Bolnes, turned over two paintings **as collateral**." Vermeer Wikipedia (ham): "The widow **sold** two more paintings to Hendrick van Buyten **to pay off** a substantial debt." Ayrıca 1663 ziyareti: fırıncı "had a couple of Vermeer's paintings **as collateral**". **617 florin tutarı yalnızca Essential Vermeer'de** görülüyor (Wikipedia'da yok).
- **Hata türü:** Nüans kaybı + kaynak uyuşmazlığının sessizce birleştirilmesi (teminat ≠ satışla kapatma); tek kaynaklı sayının kaynaksız sunulması.
- **Önerilen düzeltme:** "Vermeer'in fırıncı Hendrick van Buyten'e 617 florin borcu vardı (tutar Essential Vermeer'in aktardığıdır). Ölümünden sonra Catharina Bolnes iki resmi Van Buyten'e verdi; Essential Vermeer bunu 'teminat olarak' aktarır, Vermeer Wikipedia maddesi ise borcu kapatan bir satış olarak anlatır. İki aktarım arasındaki fark kesin değildir." KANIT C022'ye çelişen görüşler alanı eklenmeli; seviye B korunmalı.
- **Güven düzeyi:** Yüksek (iki ham metin doğrudan okundu).

### D02 — "View of Delft 200 florin": sayı tek zincirde, atıf eşleşmiyor (DÜŞÜK-ORTA)
- **İddia:** C016 (DERS_ORTA §2; DERS_ILERI §2; CS06 gerekçe/yanlış-A; TK04).
- **Mevcut ifade:** "birinci, daha büyük boyutlu View of Delft idi (200 florin)".
- **Kaynakta gerçekten bulunan:** Wikipedia (ham): "exceeded only by the 200 guilders paid for… View of Delft **[2][3]**". Ancak [3] olan Essential Vermeer (ham) **200 sayısını içermiyor** — yalnızca "more than any of the 21 Vermeer's… except for the View of Delft" diyor. Sayı fiilen yalnızca [2] (Met 2009, erişilemedi) üzerinden geliyor.
- **Hata türü:** Tek zincirli sayısal ayrıntı; Wikipedia'nın [3] atfının bu sayıyı desteklememesi.
- **Önerilen düzeltme:** Sıralama iddiası korunmalı (EV + Wiki hemfikir). 200 florin açıkça "Met 2009 sergi kataloğuna atfen (Wikipedia üzerinden); Essential Vermeer yalnızca sıralamayı doğrular" diye çerçevelenmeli veya Met erişimi sağlanana dek sayı çıkarılmalı. CS06/TK04'te de aynı not.
- **Güven düzeyi:** Yüksek (ham EV'de sayının yokluğu mekanik grep ile teyit).

### D03 — "kannenrek" terimi bültenlerde yok; doğru terim "kannenbord" (DÜŞÜK)
- **İddia:** C049 (DERS_ORTA §6; DERS_ILERI §4; KANIT C049 "kannenrek/kannenbord"; KAYNAKCA).
- **Mevcut ifade:** "sürahi rafı (kannenrek)" / "kannenrek/kannenbord".
- **Kaynakta gerçekten bulunan:** EN bülteni (ham): "jug holder". NL bülteni (ham): "Een rek met kannen, ook wel **kannenbord** genoemd". "kannenrek" her iki dilde de YOK.
- **Hata türü:** Kaynaksız terim varyantı; KANIT'ın "K3 (verbatim)" atfı Hollanda terim için yanlış dil sürümüne işaret ediyor.
- **Önerilen düzeltme:** "kannenbord (jug holder)" kullanılsın; Hollanda terimi için NL bülteni (K3-NL) ayrı kaynak olarak kütüğe eklenmeli. İçerik doğru, yalnızca terim/atıf düzeltmesi.
- **Güven düzeyi:** Yüksek.

### D04 — 2022 ekibi eksik: Antwerpen Üniversitesi de var (DÜŞÜK)
- **İddia:** C047 (DERS_ORTA §6; DERS_ILERI §4; CS08).
- **Mevcut ifade:** "Rijksmuseum ve Mauritshuis ekibi".
- **Kaynakta gerçekten bulunan:** NL bülteni (ham): "…in nauwe samenwerking met het Mauritshuis **en daarnaast de Universiteit van Antwerpen**…". EN bülteni yalnız Mauritshuis'i anıyor.
- **Hata türü:** Eksiklik (yanlış değil); tek dil sürümüne dayanma.
- **Önerilen düzeltme:** "Rijksmuseum, Mauritshuis ve (NL bültenine göre) Antwerpen Üniversitesi" olarak tamamlansın; KANIT C047'ye NL notu.
- **Güven düzeyi:** Yüksek.

### D05 — CS04 çeldirici boyutu artık birincil kaynakla doğrulandı; atıf yükseltilmeli (DÜŞÜK, olumlu)
- **İddia:** CS04 yanlış-A gerekçesi ("82 × 70,5 cm… arama kaydında bildirildi").
- **Mevcut ifade:** Boyutlar "arama kaydında bildirildi" diye zayıf kaynakla veriliyor; oysa Steen object sayfasında boyut alanı YOK (ham grep).
- **Kaynakta gerçekten bulunan:** Steen Linked Art (id.rijksmuseum.nl/2006398, ham): dimension **82** ve **70.5** cm; timespan 1665–1668.
- **Hata türü:** Doğru olgunun zayıf kaynakla sunulması (bu denetimde birincil kaynakla doğrulandı).
- **Önerilen düzeltme:** Gerekçe "Rijksmuseum Linked Art kaydı 2006398: 82 × 70,5 cm" olarak güncellensin; "arama kaydında" ifadesi kaldırılsın. KANIT C061'e boyut + kaynak eklensin.
- **Güven düzeyi:** Yüksek.

### D06 — "melken" argosu tek zincir; Lucas baskısı artık birincil (DÜŞÜK)
- **İddia:** C056 (DERS_ORTA §2; DERS_ILERI §5).
- **Mevcut ifade:** "melken argoda 'cinsel olarak cezbetmek'… Lucas van Leyden'in 1510 tarihli Milkmaid baskısı".
- **Kaynakta gerçekten bulunan:** Argó tanımı yalnız Wikipedia (ham) → Liedtke/Plomp/Rüger 2001 [7] zincirinde; Essential Vermeer'de "melken" YOK. Lucas baskısı ise Rijksmuseum hikâye sayfasında (ham) birincil olarak doğrulandı: "The Milkmaid, Lucas van Leyden, 1510… introduced a new theme in art" (+ "Eroticism" bölümü).
- **Hata türü:** Argó kısmı için tek ikincil zincir; baskı kısmı için kaynak yükseltme fırsatı.
- **Önerilen düzeltme:** Argó iddiası "Liedtke'nin katalogda aktardığına göre (Wikipedia üzerinden)" diye açıkça atfedilsin; Lucas baskısına Rijksmuseum hikâye sayfası kaynağı eklensin (K14). Mevcut "geleneğin varlığı B / esere uygulanması C" ayrımı korunmalı.
- **Güven düzeyi:** Yüksek.

### D07 — "İki diyagonal sağ bilekte buluşur": güncel müze metninde yok (DÜŞÜK)
- **İddia:** C029 (DERS_ORTA §4).
- **Mevcut ifade:** "kaynakların betimlediğine göre iki diyagonal kadının sağ bileğinde buluşur".
- **Kaynakta gerçekten bulunan:** Güncel Rijksmuseum object sayfasında (ham) "diagonal/wrist/pyramid" YOK; Essential Vermeer'de de YOK. İfade yalnız Wikipedia'nın Rijksmuseum/Met atfında yaşıyor.
- **Hata türü:** Zayıf atıf zinciri (ders zaten hedge'li — bu doğru davranış).
- **Önerilen düzeltme:** Hedge korunsun; KANIT C029'a "güncel müze metninde bulunamadı, yalnızca Wikipedia atfı" notu zaten var — ders dipnotunda da "eski müze betimlemesine atfen" denmesi daha dürüst olur. Alternatif: bilek ayrıntısı çıkarılıp yalnızca "alçak bakış + piramidal kurgu" (Met/Wiki) bırakılabilir.
- **Güven düzeyi:** Yüksek.

### D08 — Wikipedia "localhost" notu bayat (DÜŞÜK)
- **İddia:** K6 kaynak eleştirisi (DERS_ILERI §9; KALITE_KONTROL §2; KANIT K6 notu).
- **Mevcut ifade:** "bir sergi referansı bozuk (localhost) URL taşır".
- **Kaynakta gerçekten bulunan:** Güncel Wikipedia ham HTML'sinde "localhost" YOK; Met referansı düzgün arşivlenmiş ("Archived from the original on 2 July 2019"). İlk oturumda görülen bozuk referans sonradan düzeltilmiş.
- **Hata türü:** Bayat meta-iddia (eser hakkında değil, kaynak kalitesi hakkında).
- **Önerilen düzeltme:** Not "önceki sürümde bozuk referans vardı; 13 Kasım 2026 gecesi kontrolünde düzeltilmiş görüldü" şeklinde güncellensin. Kaynak eleştirisinin diğer maddeleri (radyo röportajı zinciri, kaynaksız betimler) hâlâ geçerli.
- **Güven düzeyi:** Yüksek.

### D09 — Europeana belgesinin adı ve odağı eksik aktarılmış (DÜŞÜK)
- **İddia:** C026 bağlamı / DERS_ILERI §6 (Benjamin).
- **Mevcut ifade:** "bir Europeana working paper'ına ('The Problem of the Yellow Milkmaid', 2011) konu oldu… yüksek kaliteli dijital yayını teşvik eden".
- **Kaynakta gerçekten bulunan:** Belge var: **"The Problem of the Yellow Milkmaid: A Business Model Perspective on Open Metadata"**, Harry Verwayen, Martijn Arnoldus, Peter B. Kaufman, Kasım 2011, **Europeana White Paper No. 2** (arama + Wikipedia ham referansı). Odağı **açık metadata ve iş modelleri**; Milkmaid'in sararmış kopya sorunu çerçeve vaka. "Working paper" değil "white paper".
- **Hata türü:** Eksik/kısmen yanıltıcı karakterizasyon + tür terminolojisi.
- **Önerilen düzeltme:** Tam başlık + "White Paper No. 2" verilsin; "Belgenin asıl odağı açık metadata iş modelleridir; sararmış kopya sorunu çıkış noktasıdır" notu eklensin. PDF'in kendisi bu turda açılmadı (arama özeti + Wiki referansı) — güven orta-yüksek; insan editör PDF'i teyit etmeli.
- **Güven düzeyi:** Orta-yüksek.

### D10 — Başlangıç dersi altbilgisindeki iddia aralığı bayat (DÜŞÜK)
- **İddia:** DERS_BASLANGIC.md altbilgi.
- **Mevcut ifade:** "`KANIT_DOSYASI.md` (C001–C064)".
- **Kaynakta gerçekten bulunan:** Envanter C001–C066 (66 iddia; C065/C066 sonradan eklendi).
- **Hata türü:** İç tutarsızlık.
- **Önerilen düzeltme:** "(C001–C066)".
- **Güven düzeyi:** Yüksek.

### D11 — Orta ders §2'nin ilk cümlesi etiketsiz olgusal iddia (ORTA-DÜŞÜK, yöntemsel)
- **İddia:** DERS_ORTA §2 açılış: "17. yüzyıl Hollanda Cumhuriyeti, Avrupa'nın en zengin ve en kentli toplumlarından biriydi; sanat piyasası kilise ve saraydan çok açık pazara, tüccar evlerine dayanıyordu." — **[C###] etiketi yok.**
- **Kaynakta gerçekten bulunan:** EV ham bağlamı kısmen destekliyor ("the nation's economy would reach its peak within a few short years", 1648 sonrası; tür resmi pazarı anlatısı), ancak cümle kanıt dosyasında kayıtlı değil.
- **Hata türü:** Denetim A kuralı ihlali (her olgusal cümle kanıt kaydına bağlanmalı) — içerik büyük ölçüde standart literatür ama izlenemez.
- **Önerilen düzeltme:** Yeni iddia (C067) olarak kayda alınsın (kaynak: EV bağlam + genel literatür; B) veya cümle "genel bağlam" olarak açıkça işaretlenip EV'nin ilgili pasajına bağlansın.
- **Güven düzeyi:** Yüksek (etiket yokluğu mekanik olarak teyit).

### D12 — "A3'ten biraz büyük" benzetmesi gevşek (ÇOK DÜŞÜK)
- **İddia:** DERS_BASLANGIC "Bir bakışta kimlik".
- **Mevcut ifade:** "45,5 × 41 cm, yani yaklaşık bir A3 kâğıdından biraz büyük".
- **Kaynakta gerçekten bulunan:** A3 = 29,7 × 42 cm (1247 cm²); eser 1865 cm² (~%50 büyük) ve bir kenarı A3'ten uzun, diğeri kısa. "Biraz büyük" yerine "A3 ile A2 arasında" daha doğru.
- **Hata türü:** Hassas olmayan pedagojik benzetme.
- **Önerilen düzeltme:** "A3'ten belirgin biçimde büyük, A2'den küçük (yaklaşık 45 × 41 cm)".
- **Güven düzeyi:** Yüksek (aritmetik).

---

## 3. Olumlu doğrulamalar ve yükseltmeler

1. **Provenance zinciri kusursuz:** 1696–1813 altı satışın tarihi, lot numarası, fiyatı ve alıcısı ham müze metniyle birebir (C015, C064). "?" kuşku işaretleri korunmuş (C014).
2. **2022 bulguları birebir:** alt boyama, jug holder, fire basket, envanter kaydı, üzeri boyama sırası (C048–C050). Önceki turda düzeltilen Dibbits alıntı sorunu bu turda da doğru bulundu ("tranquil atmosphere" isimsiz girişte).
3. **Teknik raporun yedi maddesi** EV ham metniyle birebir (C040–C046); ultramarin hami hipotezi doğru biçimde "hipotez" olarak sunulmuş.
4. **Steen boyutları** (82 × 70,5) artık birincil Linked Art kaydıyla doğrulandı (D05).
5. **Lucas van Leyden, The Milkmaid (1510)** Rijksmuseum'un kendi sayfasıyla doğrulandı (D06).
6. **Çatlak cam (C036)** artık iki kaynakta: Wikipedia/Cant + EV ham ("a broken piece of one of the panes") — önceki "tek kaynak" durumundan güçlü.
7. **Duvar çivisi (C033)** EV ham'de açıkça betimli ("A humble nail… casts a small shadow").
8. **Görsel yeniden teyit:** bu oturumda 1200px tarama vision köprüsüyle tekrar incelendi; kompozisyon, soldan ışık, giysi renkleri, masa nesneleri (kapaklı stoneware dahil), stoofje+köz, çini sırası doğrulandı. Cupid figürü ve pointillé noktaları hâlâ tek tek ayırt edilemedi (beyan edilen sınır geçerli).
9. **Uyumluluk:** quiz/kart kanıtları yalnız A/B (dogrula.py 0 hata); felsefe bölümünde etki iddiası yok; tarih hiçbir yerde kesinleştirilmemiş; uydurma DOI/ISBN/sayfa/envanter yok; erişilemeyen Met/NGA kaynaklarından iddia üretilmemiş.

## 4. Süregelen kısıtlar (dürüstlük beyanı)

- **Met:** sergi sayfası ve basın bülteni bu turda da **429**; kitapçık PDF'i Incapsula + boyut sınırı. C026 B zinciri geçerli ama birincil teyit açık.
- **NGA Vermeer PDF:** 80 MB, fetch sınırı aşıyor; okunamadı.
- **Basılı kataloglar** (Blankert, Wheelock, Liedtke 2001/2008, Franits, Montias): metinlerine erişilmedi; EV/Wikipedia aktarımları B.
- **Sinnepoppen (1614):** EV'deki emblem atfı doğrulandı; DBNL gibi birincil dijital nüsha kontrolü yapılmadı (gelecek iş).
- **Europeana PDF:** açılmadı; başlık/odak arama + Wiki referansından (D09).
- **Görsel:** Cupid figürü, pointillé noktaları, çatlak cam yakın kırpmayla bu turda da doğrulanamadı (tam kare + kaynak betimleri yeterli; sınır beyan edildi).
- **Üçüncü taraf denetimi:** bu rapor aynı asistanın bağımsız ham-kaynak turudur; haricî model/insan editör denetimi hâlâ gerekli.

## 5. Sonuç ve öneri

Pilot, kamuya açık akademik yayın hedefi için **güçlü bir temel** sunuyor: birincil kaynak omurgası birebir doğrulandı, belirsizlikler korunmuş, yorum/olgu ayrımı kurulmuş. Yayın öncesi **D01 (Van Buyten nüansı) ve D11 (etiketsiz cümle) mutlaka**, D02–D10 ve D12 tercihen düzeltilmelidir. Düzeltmeler küçük ve hedefli; derslerin yeniden yazılmasını gerektirmez. Bu denetim ders dosyalarında **hiçbir değişiklik yapmamıştır**; tüm öneriler onaya sunulmuştur.

**Önerilen durum:** "İnsan incelemesi bekliyor" korunmalı; bu rapor insan editörün inceleme paketine eklenmelidir.

## 6. Denetimde kullanılan kaynaklar (erişim durumlarıyla)

Ham indirilenler (13 Kasım 2026 gecesi, `.qwen/tmp/denetim/`):
- https://www.rijksmuseum.nl/en/collection/SK-A-2344 (200)
- https://id.rijksmuseum.nl/200108369 (200)
- https://www.rijksmuseum.nl/en/press/press-releases/rijksmuseum-reveals-major-discoveries-on-vermeer-s-painting-the-milkmaid (200)
- https://www.rijksmuseum.nl/nl/pers/persberichten/ontdekkingen-op-melkmeisje-onthullen-werkwijze-johannes-vermeer (200)
- https://www.rijksmuseum.nl/en/collection/object/The-Feast-of-St-Nicholas--b61f0c4c7cf5a503a2246ecde104fd28 (200)
- https://id.rijksmuseum.nl/2006398 (200, Steen Linked Art)
- https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q167605… (200)
- https://www.essentialvermeer.com/catalogue/milkmaid.html (200)
- https://en.wikipedia.org/api/rest_v1/page/html/The_Milkmaid_(Vermeer) (200)
- https://en.wikipedia.org/api/rest_v1/page/html/Johannes_Vermeer (200)
- https://www.rijksmuseum.nl/en/stories/dutch-masters/story/lucas-leyden-10 (200)
- Görsel: https://iiif.micr.io/QkOGy/full/1200,/0/default.jpg (önceki oturumda indirilmiş kopya bu turda yeniden incelendi)

Erişilemeyen: Met sergi sayfası + basın bülteni (429), Met kitapçık PDF (bot+boyut), NGA PDF (boyut). Arama ile teyit: Europeana White Paper No. 2 (PDF açılmadı).