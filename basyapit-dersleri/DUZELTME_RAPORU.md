# DÜZELTME RAPORU — Vermeer Q167605 Pilotu

**Tarih:** 13 Kasım 2026 (gece) · **Esas:** `AKADEMIK_BAGIMSIZ_DENETIM.md` (D01–D12) + kullanıcı düzeltme talimatı (kurallar 1–10)
**Kapsam:** Yalnızca `basyapit-dersleri/` içi pilot araştırma dosyaları ve doğrulama araçları. Uygulama kodu / `data/` değiştirilmedi; commit/push/deployment yapılmadı.
**Durum:** Pilot "İnsan incelemesi bekliyor" olarak korundu. Kalan 106 esere geçilmedi.

Her bulgu için: **Eski ifade · Yeni ifade · Gerçek kaynak kanıtı · Değiştirilen dosya · Uygulanan test · Kalan belirsizlik.**

---

## D01 — Van Buyten borcu: teminat / satış / ödeme ayrımı (ORTA)

- **Eski ifade:** "fırıncı Hendrick van Buyten'e 617 florin borcu vardı ve borç, eşi Catharina Bolnes'in iki resim vermesiyle kapatıldı [C022]."
- **Yeni ifade:** "…617 florin borcu vardı (tutarı Essential Vermeer aktarır). Vermeer'in ölümünden sonra eşi Catharina Bolnes iki resmi Van Buyten'e verdi; Essential Vermeer bunu 'teminat olarak' aktarır, Vermeer Wikipedia maddesi ise borcu kapatan bir satış olarak anlatır. Teminat ile satışla ödeme farklı işlemlerdir; hangisinin gerçekleştiği bu dosyada kesinleştirilemez [C022]."
- **Gerçek kaynak kanıtı:** K7 ham: "his widow, Catharina Bolnes, turned over two paintings **as collateral**"; K22 ham: "The widow **sold** two more paintings to Hendrick van Buyten **to pay off** a substantial debt" + 1663 ziyareti "paintings as collateral". 617 yalnız K7'de.
- **Değiştirilen dosya:** DERS_ORTA.md (§3), KANIT_DOSYASI.md (C022), DERS.json (C022).
- **Uygulanan test:** dogrula.py çapraz (C022 B, kaynak K7+K22 geçerli); ham metin grep ile iki aktarım teyit.
- **Kalan belirsizlik:** Hangi işlem gerçekleşti (teminat mı satış mı) kesin değil; 617 tutarı tek kaynak (EV). Kural 1/2 gereği birleştirilmedi.

## D02 — View of Delft "200 florin": tek zincirli sayı (DÜŞÜK-ORTA)

- **Eski ifade:** "birinci, daha büyük boyutlu *View of Delft* idi (200 florin) [C016]" (Orta + İleri + TK04); CS06 çeldirici A "200 florin… View of Delft'in fiyatıdır".
- **Yeni ifade:** Dersler/kart: "birinci… View of Delft idi (sıralama Essential Vermeer'de doğrulanır; fiyatı bu dosyada birincil kaynakla doğrulanmadı) [C016]". CS06 çeldirici A: "Bazı ikincil kaynaklar… 200 florin anar (Wikipedia → Met 2009); birincil kaynak erişilemediği için bu sayı doğrulanmış değildir… Doğru cevap… 175 florindir."
- **Gerçek kaynak kanıtı:** K7 ham sıralamayı doğrular ("more than any of the 21 Vermeer's… except for the View of Delft") ama **200 sayısını içermez**; 200 yalnız K6→Met [2] (Met 429, erişilemedi).
- **Değiştirilen dosya:** DERS_ORTA.md, DERS_ILERI.md, SORULAR.json (CS06, TK04), KANIT (C016 revize + C071 E), DERS.json.
- **Uygulanan test:** dogrula.py (C071 E, quiz kanıtı A/B); K7 ham grep "200" → yok.
- **Kalan belirsizlik:** 200 florin muhtemelen doğru ama birincil teyit yok; E/belirsiz (C071). Kural 3/4.

## D03 — "kannenrek" terimi kaynakta yok (DÜŞÜK)

- **Eski ifade:** "sürahi rafı (kannenrek)" / KANIT "kannenrek/kannenbord".
- **Yeni ifade:** "sürahi rafı (kannenbord / jug holder)".
- **Gerçek kaynak kanıtı:** K3 (EN) "jug holder"; K14 (NL) ham "Een rek met kannen, ook wel **kannenbord** genoemd". "kannenrek" her iki sürümde de yok.
- **Değiştirilen dosya:** DERS_ORTA.md, DERS_ILERI.md, SORULAR.json (CS07-B), KANIT (C049), DERS.json, KAYNAKCA (K14).
- **Uygulanan test:** K3/K14 ham grep "kannenrek" → yok, "kannenbord" → var.
- **Kalan belirsizlik:** Yok (terim birincil NL bültenle doğrulandı). Kural 6.

## D04 — 2022 ekibi: Antwerpen Üniversitesi eksikti (DÜŞÜK)

- **Eski ifade:** "Rijksmuseum ve Mauritshuis ekibi".
- **Yeni ifade:** "Rijksmuseum, Mauritshuis ve (Hollandaca bültene göre) Antwerpen Üniversitesi ekibi".
- **Gerçek kaynak kanıtı:** K14 ham "in nauwe samenwerking met het Mauritshuis **en daarnaast de Universiteit van Antwerpen**".
- **Değiştirilen dosya:** DERS_ORTA.md, DERS_ILERI.md, SORULAR.json (CS08), KANIT (C047), DERS.json.
- **Uygulanan test:** K14 ham grep.
- **Kalan belirsizlik:** EN bülteni yalnız Mauritshuis anar; NL sürümü esas alındı (not edildi).

## D05 — Steen boyutu zayıf kaynakla verilmişti (DÜŞÜK, olumlu)

- **Eski ifade:** CS04 çeldirici A "82 × 70,5 cm… (arama kaydında bildirildi)".
- **Yeni ifade:** "…(Rijksmuseum Linked Art kaydı 2006398: 82 × 70,5 cm)".
- **Gerçek kaynak kanıtı:** K15 ham JSON dimension 82 + 70.5 cm; timespan 1665–1668. (Object sayfasında boyut alanı yoktu.)
- **Değiştirilen dosya:** SORULAR.json (CS04), KANIT (C061), DERS.json, KAYNAKCA (K15).
- **Uygulanan test:** K15 ham JSON parse.
- **Kalan belirsizlik:** Yok.

## D06 — melken argosu tek zincir; Lucas baskısı birincile yükseltildi (DÜŞÜK)

- **Eski ifade:** "melken argoda 'cinsel olarak cezbetmek'… Lucas van Leyden'in 1510 tarihli Milkmaid baskısı [C056]".
- **Yeni ifade:** Lucas 1510 baskısı ayrı ve birincil [C056, A]; melken argosu "yalnızca Wikipedia'nın Liedtke kataloguna atfıyla aktarılır… doğrulanmamıştır [C068 — belirsiz]".
- **Gerçek kaynak kanıtı:** K16 ham "The Milkmaid, Lucas van Leyden, 1510… introduced a new theme in art" + "Eroticism"; melken yalnız K6→[7] (K7'de "melken" yok).
- **Değiştirilen dosya:** DERS_ORTA.md, DERS_ILERI.md, KANIT (C056 A + C068 E), DERS.json, KAYNAKCA (K16).
- **Uygulanan test:** K16 ham grep; K7 grep "melken" → yok; dogrula (C068 E quiz'e girmez).
- **Kalan belirsizlik:** melken argosu E/belirsiz (C068); özgün katalog erişilemedi. Kural 4/7.

## D07 — "diyagonal/bilek/alçak bakış/piramidal" güncel kaynakta yok (DÜŞÜK)

- **Eski ifade:** "Alçak bir bakış açısı ve piramidal kurgu… iki diyagonal kadının sağ bileğinde buluşur [C029]".
- **Yeni ifade:** "Küçük panel… anıtsal bir etki bırakır; Essential Vermeer resmin 'görünürde anıtsal karakterini' vurgular ve çerçeve, sepet, pirinç kap gibi öğelerin gözün… süt dökme eylemine yönelmesini sağladığını belirtir [C029]".
- **Gerçek kaynak kanıtı:** K7 ham "seemingly monumental character" + "Compositional dynamics… lead the eye down towards… the pouring milk". Güncel K1 ve K7'de "diagonal/wrist/pyramid/low vantage" yok.
- **Değiştirilen dosya:** DERS_ORTA.md (§4), KANIT (C029), DERS.json.
- **Uygulanan test:** K1/K7 ham grep.
- **Kalan belirsizlik:** Bilek/diyagonal ayrıntısı tamamen çıkarıldı (kanıtsız). Kural 4/5.

## D08 — Wikipedia "localhost" notu bayattı (DÜŞÜK)

- **Eski ifade:** "bir sergi referansı bozuk (localhost) URL taşır".
- **Yeni ifade:** "…(İlk oturumda görülen bozuk 'localhost' sergi referansı, 13 Kasım 2026 gecesi kontrolünde düzeltilmiş bulundu — güncel sürümde Met referansı düzgün arşivlenmiş.)"
- **Gerçek kaynak kanıtı:** K6 ham REST HTML grep "localhost" → yok; Met referansı "Archived from the original on 2 July 2019".
- **Değiştirilen dosya:** DERS_ILERI.md (§9), KAYNAKCA.
- **Uygulanan test:** K6 ham grep.
- **Kalan belirsizlik:** Yok (güncel sürüm teyit).

## D09 — Europeana belgesi eksik/yanlış karakterize (DÜŞÜK)

- **Eski ifade:** "yüksek kaliteli dijital yayını teşvik eden bir Europeana working paper'ına ('The Problem of the Yellow Milkmaid', 2011)".
- **Yeni ifade:** "Europeana Foundation'ın 'The Problem of the Yellow Milkmaid: **A Business Model Perspective on Open Metadata**' başlıklı **White Paper No. 2**'sine (Verwayen, Arnoldus, Kaufman, Kasım 2011)… asıl odağı açık metadata ve iş modelleridir; Milkmaid'in kopya sorunu çıkış noktasıdır (… PDF bu dosyada açılmadı)".
- **Gerçek kaynak kanıtı:** K6 ham referans (tam başlık + yazarlar + Kasım 2011 + Europeana Foundation) + arama teyidi (White Paper No. 2).
- **Değiştirilen dosya:** DERS_ILERI.md (§6), KANIT, KAYNAKCA.
- **Uygulanan test:** K6 ham grep + arama.
- **Kalan belirsizlik:** PDF'in kendisi açılmadı; karakterizasyon orta-yüksek güven. İnsan editör PDF teyidi önerilir.

## D10 — Başlangıç altbilgisi bayat aralık (DÜŞÜK)

- **Eski ifade:** "`KANIT_DOSYASI.md` (C001–C064)".
- **Yeni ifade:** "`KANIT_DOSYASI.md` (C001–C076)".
- **Gerçek kaynak kanıtı:** Envanter 76 iddia (C001–C076).
- **Değiştirilen dosya:** DERS_BASLANGIC.md.
- **Uygulanan test:** dogrula.py (tüm etiketler eşleşiyor).
- **Kalan belirsizlik:** Yok.

## D11 — Etiketsiz olgusal açılış cümlesi (ORTA-DÜŞÜK, yöntemsel)

- **Eski ifade:** "17. yüzyıl Hollanda Cumhuriyeti, Avrupa'nın en zengin ve en kentli toplumlarından biriydi; sanat piyasası kilise ve saraydan çok açık pazara… dayanıyordu." (etiketsiz)
- **Yeni ifade:** "1648'de İspanya ile barışın ardından Hollanda ekonomisi kısa yıllar içinde zirveye ulaştı; tür resmi… giderek prestij kazanan bir alandı [C067]. Vermeer de 1650'lerde tarih resminden bu ev içi türlere yöneldi [C067]."
- **Gerçek kaynak kanıtı:** K7 ham "the nation's economy would reach its peak within a few short years"; "abandoning history painting in favor of… increasingly prestigious… upper-tier genre painting"; "pioneered by Dutch painters decades earlier".
- **Değiştirilen dosya:** DERS_ORTA.md (§2), KANIT (C067 B), DERS.json.
- **Uygulanan test:** dogrula.py (C067 etiketli, K7 geçerli); K7 ham grep.
- **Kalan belirsizlik:** "en zengin/en kentli" süperlatifi ve "açık pazar" genellemesi kanıtsız olduğundan çıkarıldı. Kural 5.

## D12 — A3 benzetmesi gevşek (ÇOK DÜŞÜK)

- **Eski ifade:** "yaklaşık bir A3 kâğıdından biraz büyük".
- **Yeni ifade:** "A3 kâğıdından belirgin biçimde büyük, A2'den küçük".
- **Gerçek kaynak kanıtı:** A3 = 29,7×42 cm (1247 cm²); eser 45,5×41 = 1865 cm² (~%50 büyük); A2 = 42×59,4.
- **Değiştirilen dosya:** DERS_BASLANGIC.md.
- **Uygulanan test:** Aritmetik.
- **Kalan belirsizlik:** Yok.

---

## Ek düzeltmeler (kural 4/5/8 — denetim D01–D12 dışı)

- **E01 (kural 4):** C069 "Van Ruijven ölümünde 21 Vermeer" E/belirsiz (yalnız K6→WNYC); karşılık **C070** "1696 satışında 21 Vermeer" B (K7 ham). İleri §2 yeniden yazıldı.
- **E02 (kural 4):** C072 "2009 Met tarih/küratör/1939/beş-Vermeer" E/belirsiz; serginin *varlığı* C026 B (K1 bibliyografyası). İleri §2 yeniden yazıldı.
- **E03 (kural 4/6):** C073 "eski dikiş sepeti adı" E/belirsiz (K6→eski müze sayfası; güncel K1/K7'de yok). Orta §6 + İleri §4 + CS07 + TK03 düzeltildi.
- **E04 (kural 4):** C023'ten Aertsen/Beuckelaer/Snyders/Wtewael isim listesi çıkarıldı (yalnız K6); gelenek iddiası K7 + K16 (Lucas "Eroticism") ile B'ye bağlandı.
- **E05 (kural 4):** Met "en cömert pointillé" sıfatı Orta §4 + TK02'den çıkarıldı (K6→Met, erişilemedi); C031 K1+K7 ile A.
- **E06 (kural 5):** C075 (yerel kopya 356×400, doğrudan dosya incelemesi) ve C076 (Girl tronie/670/1665/44,5×39, K23 Mauritshuis) eklendi; Orta §8 karşılaştırma betimleri yorum işaretlendi / birincil kaynağa bağlandı.
- **E07 (kural 8):** Kant (K17 SEP), Hegel (K18 SEP), Benjamin (K19 SEP), Panofsky (K20), Berger (K21) karakterizasyonları doğrulandı; **C074** eklendi. Hegel'in "pazar günü" ifadesi K18'de bulunmadığından ders bu benzetmeyi kendi yorumu olarak işaretledi; Hegel övgüsü "Lebendigkeit" ile doğru aktarıldı.
- **E08 (kural 7):** C017'de Morgan/Bredius/de Stuers/Troelstra isimlerinin yalnız EV'de olduğu, K24'te bulunmadığı not edildi; genel kampanya K24 ile B. Liedtke görüşlerinin ikincil aktarım zinciri (K6→WNYC/gazete) açıkça işaretlendi.

---

## dogrula.py — negatif testler (kural 10)

`python3 basyapit-dersleri/dogrula.py --test` → **10/10 geçti:**
1. pozitif_kontrol (temiz fixture)
2. kayip_kaynak (C001 → K99 reddedilir)
3. eksik_kanit_etiketi_metin ([C999] reddedilir)
4. eksik_kanit_tanimi (DERS'te olup KANIT'te olmayan iddia reddedilir)
5. mukerrer_iddia (aynı C001 iki kez reddedilir)
6. mukerrer_kaynak (aynı K1 iki kez reddedilir)
7. cs_C_kanit (C-seviyeli kanıta dayalı çoktan seçmeli reddedilir)
8. dy_D_kanit (D-seviyeli doğru/yanlış reddedilir)
9. tk_E_kanit (E-seviyeli tekrar kartı reddedilir)
10. gz_C_kanit (C-seviyeli gözlem sorusu reddedilir)

Yeni ana doğrulama kontrolleri: mükerrer iddia/kaynak kimliği reddi; D/E iddiaların ders metninde belirsizlik işareti olmadan kullanımına UYARI; şema kullanim enum'ına "belirsiz" eklendi.

**Önemli not:** Bu testler **yapısal** reddetmeyi doğrular; içeriğin **semantik/olgusal doğruluğunu garanti etmez**. Olgusal doğruluk ham kaynak denetimi (AKADEMIK_BAGIMSIZ_DENETIM.md) ve insan editör onayı gerektirir.

---

## Tutarlılık özeti (kural 9)

- Üç ders + KANIT + SORULAR + DERS.json + KAYNAKCA + KALITE_KONTROL + DURUM birbirleriyle hizalandı.
- İddia: **76** (A=33, B=29, C=6, D=3, E=5). Kaynak: **24** (K1–K24).
- Kelime: Başlangıç 411 (3 dk) · Orta 1584 (10 dk) · İleri 2996 (20 dk) — hedeflerde.
- `dogrula.py`: **0 hata, 0 uyarı**; `--test`: **10/10**.
- Quiz/kart kanıtları yalnız A/B; D/E iddialar belirsiz işaretli ve kesin cevaplı soruya girmiyor.

## Kalan belirsizlikler ve kısıtlar (dürüstlük beyanı)

- **Erişilemeyen birincil kaynaklar:** Met sergi sayfası/bülteni (429), Met kitapçık PDF (Incapsula+boyut), NGA PDF (80 MB). Bunlardan sayısal/olgusal ayrıntı kesin olarak verilmedi (C071, C072 E).
- **Tek kaynaklı maddeler:** 617 florin (C022, EV); Morgan/Bredius/de Stuers/Troelstra (C017, EV); teknik rapor maddeleri (C040–C046, EV — hakemli değil).
- **Belirsiz (E):** C068 melken, C069 Van Ruijven 21, C071 View of Delft fiyatı, C072 Met ayrıntıları, C073 eski sepet adı.
- **Görsel:** Cupid figürü / pointillé noktaları / çatlak cam yakın kırpmayla doğrulanamadı; kaynak betimi + kısmi teyit notu korunuyor.
- **Felsefe:** Panofsky kaynağı (K20) yazar paraphrase; Berger (K21) birincil alıntı aktarımı; özgün metinler (CJ, Aesthetics, Studies in Iconology, Ways of Seeing) bu dosyada açılmadı — SEP/akademik açıklamalar yeterli görüldü, insan editör özgün metin teyidi yapabilir.
- **Üçüncü taraf denetimi:** Bu düzeltme turu aynı asistan tarafından yapıldı; haricî model/insan editör denetimi hâlâ gerekli.

## Sonuç

D01–D12 tamamı + kural 4/5/8 ek düzeltmeleri uygulandı; pilot iç tutarlılığı ve yapısal doğrulaması temiz. Pilot **"İnsan incelemesi bekliyor"** durumunda korundu; kalan 106 esere geçilmedi. Onay bekleniyor.