# KANIT DOSYASI — Q3228340 · Üçüncü Mevki Vagon (The Third-Class Carriage / Le Wagon de troisième classe) · Honoré Daumier

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md`
**Durum:** İnsan incelemesi bekliyor.
**Araştırma brief'i:** `.qwen/tmp/parti4/Q3228340-brief.md` (kaynak-arastirma agent; ham cache `.qwen/tmp/parti4/Q3228340-*`).

---

## 0. Yöntem ve kaynak hiyerarşisi

Eser bir tuvaldir (Metropolitan Museum of Art, New York, envanter 29.100.129). **Versiyon netleştirme (TEYİT):** Q3228340 = **Met** versiyonu (WD P195/P276=Q160236, P217="29.100.129", Met API objectID 436095). Ottawa (NGC 4633) ve San Francisco (FAMSF) versiyonları **AYRI** eserlerdir; bu QID onları kapsamaz. enwiki maddesi üç versiyonu birlikte anlatır → karıştırma riski (D2/C038).

**Birincil Met resmî API canlı 200** (metadataDate 2026-10-10) → künye (ad/sanatçı/teknik/boyut/envanter/edinim/galeri/sınıflama/konu etiketleri/telif) **A**. **Met TOAH canlı 429** (Vercel Security Checkpoint) → **Wayback 2014-08-18 AÇILDI** (web_fetch AI aracılı; sayfa Citation tarihi December 2008) → galeri etiketi (bitmemiş/kareleme/Walters denkliği/Ottawa reworked/demiryolu 1840'lar/Realizm) **A**. **NGC canlı 403** (Cloudflare) → **Wayback 2026-09-07** (Ottawa versiyonu; künye + işçi sınıfı yorumu) **A**. enwiki satır içi akademik atıf içermez → anlatı iddiaları **C**; WD'nin Met referanslı claim'leri **B**.

**Dört ihtilaf D:** tarih (D1/C037), versiyon karışması (D2/C038), galeri 802↔812 (D3/C039), data/ tek yıl "1862" (D4/C040). **Görsel İNCELENMEDİ** (vision kotası ana oturumda; yalnız metadata + lisans + çözünürlük) → kompozisyon "kaynakların betimlediği" + **GZ TASLAK** (C041 E).

**Yöntem sınırları:** (1) TOAH/NGC arşiv metinleri web_fetch (AI aracılı) ile çıkarıldı; curl archive.org'a IP düzeyinde 429 verdiği için ham HTML cache'lenemedi; birebir aktarım istendi. (2) Wayback availability en yakın 2022-12-08 snapshot'ını gösterdi ama o kopya Incapsula engel sayfasıydı; CDX ile sağlam 2014-08-18 seçildi. (3) Birincil URL'ler TAHMİN EDİLMEDİ: Met TOAH/NGC/FAMSF/Walters URL'leri enwiki refs'ten; Met objectURL API yanıtından; objectID 436095 WD P3634'ten. (4) S2/S7/S13 URL'leri brief'te kısaltılmıştı; cache parametrelerinden (QID listesi / dosya başlıkları) yeniden kuruldu, uydurma yok. (5) it/de/fr WD sitelink'i YOK (yalnız etiket); enwiki ile yetinildi.

## 1. Kaynak envanteri

| ID | Kurum | Belge | URL | Erişim (14 Kas 2026, UTC) | Tür |
|---|---|---|---|---|---|
| S1 | Wikidata | EntityData Q3228340 | https://www.wikidata.org/wiki/Special:EntityData/Q3228340.json | 200 · 17:35:14Z | yardımcı |
| S2 | Wikidata | wbgetentities labels (21 QID) | https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q187506%7CQ296955%7CQ12321255%7CQ861259%7CQ29188408%7CQ539280%7CQ1047337%7CQ2642826%7CQ467%7CQ7569%7CQ8441%7CQ174876%7CQ870%7CQ19652%7CQ60332278%7CQ29940705%7CQ106429444%7CQ465%7CQ97309629%7CQ160236%7CQ565&props=labels&format=json | 200 · 17:35:57Z | yardımcı |
| S3 | Wikipedia (en) | "The Third-Class Carriage" wikitext (action=parse, redirects=1) | https://en.wikipedia.org/w/api.php?action=parse&page=The%20Third-Class%20Carriage&prop=wikitext&formatversion=2&redirects=1&format=json | 200 · 17:35:58Z | ikincil (satır içi atıf YOK) |
| S4 | Met (resmî API) | object 436095 (metadataDate 2026-10-10) | https://collectionapi.metmuseum.org/public/collection/v1/objects/436095 | 200 · 17:36:57Z; Denetim B yeniden 200 (birebir aynı) | **birincil** |
| S5 | Met (TOAH, canlı) | works-of-art/29.100.129 | http://www.metmuseum.org/toah/works-of-art/29.100.129 | 429 · 17:36:57/17:39:44Z; Denetim B 429 | birincil (ERİŞİLEMEDİ) |
| S6 | Met (TOAH, arşiv) | Wayback 2014-08-18; Citation December 2008 | http://web.archive.org/web/20140818030707/http://www.metmuseum.org/toah/works-of-art/29.100.129 | web_fetch 200 · ~17:43Z (62.376 bayt); AI aracılı | **birincil (arşiv)** |
| S7 | Commons | imageinfo (3 dosya: Met bağışlı / GAP / Yorck) | https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&titles=File:Honor%C3%A9%20Daumier%2C%20The%20Third-Class%20Carriage%20-%20The%20Metropolitan%20Museum%20of%20Art.jpg%7CFile:Honor%C3%A9%20Daumier%20(French%2C%20Marseilles%201808%E2%80%931879%20Valmondois)%20-%20The%20Third-Class%20Carriage%20-%20Google%20Art%20Project.jpg%7CFile:Honor%C3%A9%20Daumier%20001.jpg&format=json | 200 · 17:36:57Z | görsel metadata + birincil etiket |
| S8 | NGC (canlı) | collection/artwork/the-third-class-carriage | https://www.gallery.ca/collection/artwork/the-third-class-carriage | 403 · 17:37:48Z (Cloudflare) | birincil (ERİŞİLEMEDİ) |
| S9 | NGC (arşiv) | Wayback 2026-09-07 (Ottawa versiyonu) | http://web.archive.org/web/20260907162928/https://www.gallery.ca/collection/artwork/the-third-class-carriage | web_fetch 200 · ~17:42Z (70.696 bayt); AI aracılı | **birincil (arşiv)** |
| S10 | Wayback | availability + CDX (TOAH 96 kayıt; NGC) | https://archive.org/wayback/available?url=metmuseum.org/toah/works-of-art/29.100.129 | 200 · 17:37:48/17:39:16Z; CDX web_fetch 200 | yardımcı |
| S11 | Met (koleksiyon, canlı) | objectURL (S4'ten) | https://www.metmuseum.org/art/collection/search/436095 | 429 · 17:44:31Z (Vercel) | birincil (ERİŞİLEMEDİ) |
| S12 | Met (resmî API) | v1 search 410 (retired) → v1.1 q=29.100.200 → object 333915 "The Connoisseur" | https://collectionapi.metmuseum.org/public/collection/v1.1/search?q=29.100.200 | 410 · 17:43:45Z; 200 · 17:44:47Z | yardımcı (data notu) |
| S13 | Wikidata | Q97309629 (S1'de P248 referansı) | https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q97309629&format=json | 200 · 17:40:44Z; yanıt `"missing":""`; Denetim B yeniden missing | yardımcı (referans öğesi YOK) |
| S14 | Proje | data/*.json (salt-okunur tarama) | — (yerel dosya; URL yok) | yerel · 2026-11-14 | iç veri (kaynak değil) |

**S4 (Met API) doğrulanan:** title "The Third-Class Carriage"; artistDisplayName "Honoré Daumier" / artistDisplayBio "French, Marseilles 1808–1879 Valmondois"; medium "Oil on canvas"; dimensions "25 3/4 x 35 1/2 in. (65.4 x 90.2 cm)"; accessionNumber "29.100.129"; accessionYear 1929; creditLine "H. O. Havemeyer Collection, Bequest of Mrs. H. O. Havemeyer, 1929"; repository "Metropolitan Museum of Art, New York, NY"; classification "Paintings"; GalleryNumber "812"; isPublicDomain true; objectDate "1864"; tags Children/Men/Women/Trains/Nursing; primaryImage DP-21027-001.jpg.
**S6/S7 (TOAH + Commons Met etiketi) doğrulanan:** "The Third–Class Carriage, ca. 1862–64"; "unfinished and squared for transfer"; "closely corresponds to a watercolor of 1864 (Walters Art Museum, Baltimore)"; "another oil version … which he finished but extensively reworked (National Gallery of Canada, Ottawa)"; "Images of railway travel first appeared in his art in the 1840s."; Index Terms "Realism in Nineteenth–Century European Art" / "Genre Scenes; Secular Figure"; "On view: Gallery 802" (2014).
**S9 (NGC) doğrulanan (OTTAWA):** Date "c. 1863-1865"; Materials "oil on canvas"; Dimensions "65.4 x 90.2 cm"; Credit line "Purchased 1946"; Accession number "4633"; yorum "reflects Daumier's sympathy for the working class … withdrawn, impoverished and isolated passengers … dimly lit carriage … absorbed in their thoughts."
**Erişilemeyen/açılmayan:** S5/S8/S11 canlı (429/403); FAMSF, Walters (3 kayıt), NGC magazine, Kleiner Google Books (URL'ler S3 refs'te bulundu, açılmadı → C042); it/de/fr wikitext (WD sitelink yok).

## 2. İddia envanteri (A–E)

**C001** — Ad (en): "The Third-Class Carriage" (Met resmî başlığı). **A.** S4, S3, S1.
**C002** — Sanatçı: Honoré Daumier (French, Marseilles 1808–1879 Valmondois). **A.** S4, S1.
**C003** — Bu QID Met versiyonudur; envanter 29.100.129; Metropolitan Museum of Art, New York, NY; Met API objectID 436095. **A.** S4, S1.
**C004** — Yağlıboya, tuval (oil on canvas; WD P186 oil paint + canvas, P518 painting support). **A.** S4, S6, S1.
**C005** — 65,4 × 90,2 cm (25 3/4 × 35 1/2 in.). **A.** S4, S6, S1.
**C006** — 1929; "H. O. Havemeyer Collection, Bequest of Mrs. H. O. Havemeyer, 1929". **A.** S4, S6, S1.
**C007** — Güncel galeri 812 (API 2026; metadataDate 2026-10-10). **A.** S4.
**C008** — Müze yayını tarihi "ca. 1862–64" (TOAH December 2008 metni, 2014 arşiv; Commons "circa 1862–64" P1480=circa; enwiki circa 1862–1864); API objectDate "1864" (→ C037 D1). TOAH erişimi: canlı 429 → Wayback 2014-08-18 (web_fetch AI aracılı; 2022-12-08 kopyası Incapsula engel sayfası, CDX ile seçildi). **A.** S6, S7, S3, S4.
**C009** — Tablo tamamlanmamış ve kareleme (squared for transfer) izli. **A.** S6, S7.
**C010** — 1864 tarihli Walters suluboyasıyla (Walters Art Museum, Baltimore) yakın denklik ("closely corresponds"). **A.** S6, S7.
**C011** — Diğer yağlıboya versiyon (Ottawa, NGC) bitmiş ama yoğun biçimde yeniden işlenmiş (extensively reworked). **A.** S6, S7, S9.
**C012** — Daumier modern kent hayatının kronikçisi; 19. yy ortası Paris'inde sanayileşmenin etkilerini resmetti; demiryolu imgeleri sanatında ilk kez 1840'larda. **A.** S6, S7.
**C013** — Konu etiketleri: Women, Men, Children, Nursing, Trains (WD P180 woman/child/man/breastfeeding/train). **A.** S4, S1.
**C014** — Realism in Nineteenth–Century European Art; Genre Scenes; Secular Figure; classification Paintings. **A.** S6, S1.
**C015** — Kamu malı (Met Open Access isPublicDomain=true; WD P6216=Q19652, P1001 100 yıl pma, P459 ölümden ≥100 yıl; Commons PD/CC0). **A.** S4, S1, S7.
**C016** — Ottawa versiyonu: NGC 4633, "Purchased 1946", c. 1863–1865, oil on canvas, 65,4 × 90,2 cm. **A.** S9.
**C017** — NGC yorumu: işçi sınıfına sempati; burjuva/politikacı karikatürlerinde sert (caustic), burada duyarlı; içine kapanık, yoksul, izole yolcular; loş vagon; düşüncelerine dalmış. **A.** S9.
**C018** — Louisine Havemeyer mülkiyetindeydi (WD P127=Q539280; ref P248=Q160236 + P3634=436095). **B.** S1.
**C019** — Met koleksiyonuna giriş 1929 (WD P195 qual P580=1929; S4 ile uyumlu). **B.** S1.
**C020** — Provenance zinciri (enwiki, satır içi atıf yok): J. Duz (1888 École des Beaux-Arts sergisi) → Durand-Ruel Paris 1892 → NY şubesi 1893 → M.C.D. Borden 1896 → 1912 ölümü sonrası estate satışı 1913 (40.000 $) → Louisine Havemeyer; son halka 1929 Met C006 ile A. **C.** S3. (yorum)
**C021** — Daumier illüstratör olarak tanınıyordu; resimleri 1878 Durand-Ruel Paris sergisine dek bilinmiyordu (ölümünden bir yıl önce). **C.** S3. (yorum)
**C022** — Daumier 1840'lardan beri demiryolu imgeleri çizdi/resmetti, odak araçlarda değil yolculardaydı; "Les Chemins de Fer" litografi serisi Le Charivari'de 1843–1858; Aralık 1856 üçüncü mevki baskıları ("Voyageurs appréciant de moins en moins les wagons de troisième classe, pendant l'hiver"; "Intérieur d'un wagon de troisième classe pendent l'hiver"). **C.** S3. (yorum)
**C023** — Walters suluboyaları (üç: birinci/ikinci/üçüncü mevki) 1864'te George A. Lucas aracılığıyla William Thompson Walters için sipariş edildi; 1864 suluboyanın varlığı C010 ile A. **C.** S3. (yorum)
**C024** — Üçüncü mevki vagonları: dar, kirli, sert ahşap banklı açık bölmeler; ikinci/birinci mevki bileti alamayanlar için. **C.** S3. (yorum)
**C025** — Ön sıra betimi (enwiki): izleyiciye dönük ahşap bankta soldan emziren kadın, sepet üstünde elleri kenetli yaşlı kadın, uyuyan oğlan; arkada anonim erkek/kadın sıraları; konu etiketleri C013 ile A; görsel inceleme YOK. **C.** S3. (yorum)
**C026** — Ottawa: sağ altta bagaj üstünde imzalı; Hector Brame sahipliği; 1878 Durand-Ruel sergisi; 1946'da Gordon Cameron Edwards'tan alım ("Purchased 1946" C016 ile A). **C.** S3. (yorum)
**C027** — San Francisco versiyonu: oil on panel, 26 × 33,9 cm, c. 1856–1858, 1996 alımı (FAMSF, bağış fonları); ana üç figür farklı düzeni (gözleri kapalı yaşlı kadın, şapkasını kucağında tutan sakallı adam, önündeki çocuğa bakan genç kadın); FAMSF birincil URL refs'te var, açılmadı. **C.** S3. (yorum)
**C028** — NY–Ottawa küçük farkları: silindir şapkalı adamın (sol pencere) ve uyuyan çocuğun (orta-sağ) konumu; başörtülü kadın Ottawa'da daha yaşlı; mavi başlıklı adam (en sağ) Ottawa'da daha genç; arka plan figürleri farklı. **C.** S3. (yorum)
**C029** — Üç working drawing günümüze ulaşmış; "perhaps tracings"; biri BnF'de. **E.** S3. (belirsiz)
**C030** — "It seems two of the oil paintings were worked on concurrently, but the sequence of the paintings is not clear"; NY bitmemiş bırakılmış. **E.** S3. (belirsiz)
**C031** — NY karelemesi "possibly from the Walters watercolor or another earlier work"; siyah konturlu alanlar. **E.** S3. (belirsiz)
**C032** — "The figures may be intended to be peasants, influenced by Jean-François Millet". **E.** S3. (belirsiz)
**C033** — WD tarih anomalileri: P571 1868 (ref P143=Q465 DBpedia import) ve 1862 (qual P1319 en erken 1862 / P1326 en geç 2001; ref beckchris.wordpress.com blog + P248=Q97309629); referans öğesi Q97309629 "missing". **E.** S1, S13. (belirsiz)
**C034** — Kleiner, Gardner's Art Through the Ages: The Western Perspective (Cengage Learning, 2010), PA634 Google Books linki enwiki refs'te; kaynakçada anıldı, metne ERİŞİLMEDİ. **C.** S3. (yorum)
**C035** — data/ "yorgun işçi aileleri" / "üç kuşak" yorumu: akrabalık belirsiz (data zaten not eder); NGC "working class" der, enwiki "may be … peasants" — sınıf/köylü okuması kaynaklar arasında farklı. **E.** S14, S9, S3. (belirsiz)
**C036** — data/ "Van Gogh mektuplarında Daumier'ye hayranlık" iddiası bu brief'te erişilen hiçbir kaynakta desteklenmiyor. **E.** S14. (belirsiz)
**C037** — D1 tarih ihtilafı: API objectDate "1864" ↔ TOAH/Commons/enwiki "ca. 1862–64" ↔ WD 1862 (P1326=2001 anomali) ve 1868 (DBpedia). Ders "c. 1862–1864" + not kullanır; kesinleştirme YOK. **D.** S4, S6, S7, S3, S1. (tartışma)
**C038** — D2 versiyon karışması riski: enwiki üç versiyonu tek maddede anlatır (Met bitmemiş / Ottawa bitmiş-imzalı / SF panel); WD Q3228340 yalnız Met; data/ görsel hash'i (585ff6078a75a57a) doğru Met versiyonuna (DP-21027-001) işaret eder; aynı sanatçı cache'inde Ottawa görseli (Honoré_Daumier_034.jpg) ve Walters suluboyası da var; gunun_resimleri "The Connoisseur" (333915) farklı eser. **D.** S3, S1, S4, S14. (tartışma)
**C039** — D3 galeri: TOAH 2014 arşiv "Gallery 802" ↔ API 2026 "812"; zaman içi değişim; güncel değer 812. **D.** S6, S4. (tartışma)
**C040** — D4 data/ yılı: basyapitlar[81] tarih "1862" ve eserler_onbellek yil 1862 (tek yıl) ↔ kaynaklar "ca. 1862–64" / API "1864"; terminoloji Mevki ↔ Sınıf tutarsızlığı; data DEĞİŞTİRİLMEDİ; düzeltme önerisi ana oturuma. **D.** S14, S6, S4. (tartışma)
**C041** — Görsel bu oturumda İNCELENMEDİ (yalnız metadata + lisans); data/ görsel içerik betimleri ("Ne görüyoruz?", "ışık soldaki pencerelerden süzülür", hotspot koordinatları) doğrulanmadı; GZ TASLAK. **E.** S7, S4, S14. (belirsiz)
**C042** — FAMSF, Walters (3 kayıt), NGC magazine, Kleiner Google Books açılmadı (URL'ler enwiki refs'te BULUNDU, tahmin edilmedi); ilgili ayrıntılar C/E'de; it/de/fr WD sitelink yok (yalnız etiket), enwiki ile yetinildi. **E.** S3. (belirsiz)
**C043** — Fransızca başlık "Le Wagon de troisième classe" (WD P1476, Commons referanslı; enwiki). **B.** S1, S3, S7.

**Sayım:** 43 iddia · A=17 · B=3 · C=10 · D=4 · E=9.

## 3. Görsel doğrulama kaydı (Kural 6)

- **Hiçbir görsel İNCELENMEDİ** (vision kotası ana oturumda); yalnızca metadata + lisans + çözünürlük çekildi (C041 E).
- Commons 3 dosya: Met bağışlı "Honoré Daumier, The Third-Class Carriage - The Metropolitan Museum of Art.jpg" 3811×2756 (3.488.500 bayt, PD/CC0, ImageDescription = Met galeri etiketi); GAP "…Google Art Project.jpg" (WD P18) 3812×2757 (4.780.293 bayt, PD, asset dwGeegIEDB5Fcg); Yorck "Honoré Daumier 001.jpg" 2024×1463 (360.899 bayt, PD, "circa 1862").
- Met API primaryImage: images.metmuseum.org/CRDImages/ep/original/DP-21027-001.jpg (+ web-large); isPublicDomain=true.
- WD P6216=Q19652 (public domain), P1001=Q60332278 (100 yıl pma), P459=Q29940705 (ölümden ≥100 yıl). Daumier ö. 1879 → kamu malı.
- Kompozisyon "kaynakların betimlediği" (S6/S7 Met etiketi A + S9 NGC A + S3 enwiki C) metninden; doğrudan görsel teyit YOK. **GZ TASLAK.** Görsel projeye kopyalanmadı; URL + lisans + kaynak referans.
- data/ görsel hash'i 585ff6078a75a57a = Met DP-21027-001 web-large → doğru versiyon (C038); gorsel_oranlari 1.37 ≈ 90.2/65.4=1.379 ✓.

## 4. Kelime/süre sayımı

| Seviye | Hedef | Ölçülen | Süre |
|---|---|---|---|
| Başlangıç | 400–500 | 440 | 3 dk |
| Orta | 1300–1600 | 1378 | 10 dk |
| İleri | 2600–3200 | 2741 | 20 dk |

dogrula.py (Q3228340): **0 hata / 0 uyarı**; CJK: **0**. Kelime sayıları DERS.json ile birebir (post-pass build'den önce). Ayrıntı: `KALITE_KONTROL.md`. Kelime hedefleri §8 gereği tahmindir; dolgu/tekrar yok, kanıt yetersizse kapsam azaltıldı (görsel betimi kaynak metniyle sınırlı).

## 5. Veri notları (data/ salt-okunur incelendi; DEĞİŞTİRİLMEDİ)

1. **Tarih (D4):** basyapitlar[81] `tarih:"1862"` tek yıl + eserler_onbellek `yil:1862` ↔ kaynaklar "ca. 1862–64" / API "1864" (C040). Özet "1862–64 … tamamlanmamış" ✓ (S6/S7). Düzeltme önerisi ana oturuma.
2. **Versiyon (D2):** data/ görseli Met (DP-21027-001) → doğru; aynı sanatçı cache'inde Ottawa görseli (Honoré_Daumier_034.jpg) + Walters suluboyası → karıştırma riski (C038).
3. **Terminoloji:** eser_adlari_tr.json "Üçüncü **Mevki** Vagon" ↔ eser_konulari.json "Üçüncü **Sınıf** Vagon" — küçük tutarsızlık; ders "Mevki"yi esas alır (C040).
4. **Yorumlar:** basyapitlar "üç kuşak/aile" belirsizlik notuyla ✓ (C035); eser_notlari "yorgun işçi aileleri" → NGC "working class" ↔ enwiki "may be … peasants" okuma farkı (C035). "Van Gogh mektupları" bu brief'te kaynaksız (C036).
5. **Görsel içerik (E8):** "Ne görüyoruz?", "ışık soldaki pencerelerden süzülür", hotspot koordinat/metinleri görsel incelenmeden doğrulanamaz (C041).
6. **imzalar.json** honore-daumier=null — Met versiyonunun bitmemiş/imzasız olmasıyla uyumlu (Ottawa imzalı, C026).
7. **gunun_resimleri.json / yuruyus.json** honore-daumier seçimi "The Connoisseur" (Met objectID 333915, 29.100.200; S12 ile teyit) — farklı eser; Q3228340 için hata değil, not (C038).
8. **muze_numaralari.json** bu eser için Met 29.100.129 kaydı YOK; **muze_tercih.json** Daumier yok — veri boşluğu (C003).
9. **WD anomalileri (E5):** P571 1868 (DBpedia) + P1326=2001; P248 Q97309629 "missing"; blog zayıf (C033).
10. **gorsel_oranlari.json** 585ff…=1.37 ≈ 90.2/65.4=1.379 ✓; eserler_onbellek kaynak URL …/art/collection/search/436095 = S4 objectURL ✓; lisans "CC0" ✓ (Met Open Access).