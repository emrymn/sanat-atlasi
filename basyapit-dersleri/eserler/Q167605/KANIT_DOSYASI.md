# KANIT DOSYASI — Q167605 · Süt Boşaltan Kadın (Het melkmeisje)

**Sanatçı:** Johannes Vermeer (1632–1675) · **Müze:** Rijksmuseum, Amsterdam · **Envanter:** SK-A-2344
**Hazırlanma:** 13 Kasım 2026 · **Düzeltme turu:** 13 Kasım 2026 gece (D01–D12) · **Hakem revizyonu:** 14 Kasım 2026 (AKADEMIK_HAKEM_RAPORU.md — Claude; ham kaynaklarla bağımsız doğrulama, kararlar `../../HAKEM_REVIZYON_RAPORU.md`) · **Standart:** `../../AKADEMIK_STANDART.md`
**Seviyeler:** A = birincil/doğrudan kanıt · B = güvenilir ikincil · C = yorum/çıkarım · D = ihtilaf · E = yetersiz/erişilemedi. Etiketler yazar değerlendirmesidir; bağımsız garanti değildir.
**Kural 4 (uygulama):** Wikipedia/Wikidata tek başına A/B kanıt sayılmaz. Özgün kaynağa erişilemeyen Wikipedia-zincirli iddialar E'ye düşürüldü ve "belirsiz" işaretlendi (C068, C069, C071, C072, C073). Hakem turunda C012 de E'ye düşürüldü (tek açık dayanak Wikidata P1071 + çıkarım; müze kaydında yapım yeri alanı yok).

---

## 0. Pilot Seçim Gerekçesi

1. **Kaynak erişimi güçlü:** Rijksmuseum resmî koleksiyon sayfası ve Linked Art kaydı tam erişilebilir (HTTP 200); Aşama 3 denetiminde de teyit edilmişti.
2. **Atıf net:** Vermeer atfı tartışmasız (müze kaydı + Wikidata P170, niteleyicisiz). Eser imzasızdır ama atıf sorunu yoktur (C010).
3. **Görsel doğrulanabilir:** Rijksmuseum taraması kamu malı (Public Domain Mark 1.0); görüntü indirilip birden çok oturumda incelendi (§3). (Not: önceki "veri CC0" ifadesi erişilen kaynaklarda doğrulanamadı; hakem turunda çıkarıldı — B20.)
4. **Telif temiz:** Vermeer ö. 1675 → TR/AB/ABD kamu malı; görsel PD mark.
5. **Pedagojik zenginlik:** Tarih belirsizliği (c. 1660 ↔ literatür c. 1657–1661), 2022 birincil kaynaklı teknik araştırma, yorum tartışmaları.
6. **Müfredat bağı:** M8 Hollanda Altın Çağı modülünde Jan Steen (#53) ve Baburen (#44) ile karşılaştırma.

## 1. Kaynak Kütüğü ve Erişim Günlüğü

| ID | Kurum / Belge | URL | Erişim | Tür |
|---|---|---|---|---|
| K1 | Rijksmuseum — The Milkmaid koleksiyon sayfası (SK-A-2344) | https://www.rijksmuseum.nl/en/collection/SK-A-2344 | 200 (ham HTML indirildi) | birincil |
| K2 | Rijksmuseum — Linked Art JSON-LD | https://id.rijksmuseum.nl/200108369 | 200 (ham JSON; PD mark 1.0 — CC0 ifadesi yok) | birincil |
| K3 | Rijksmuseum — basın bülteni (EN, 8 Eylül 2022) | https://www.rijksmuseum.nl/en/press/press-releases/rijksmuseum-reveals-major-discoveries-on-vermeer-s-painting-the-milkmaid | 200 (ham HTML) | birincil |
| K4 | Rijksmuseum — IIIF görüntü (PD) | https://iiif.micr.io/QkOGy/full/max/0/default.jpg | 200; 1200px + 4649×5177 tam kare bölge kırpmaları incelendi | görsel |
| K5 | Wikidata — Q167605 | https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q167605&props=labels|claims|sitelinks&languages=en|tr|nl&format=json | 200 (ham JSON) | yardımcı |
| K6 | Wikipedia (EN) — The Milkmaid (Vermeer) | https://en.wikipedia.org/wiki/The_Milkmaid_(Vermeer) | 200 (ham REST HTML + 14 Kasım 2026 action=raw wikitext). 2009 sergi cümlesinin referansı hâlâ bozuk (localhost:5000); düzgün Met arşiv referansı başka cümlede | ikincil (tek başına A/B değil) |
| K7 | Essential Vermeer 5.0 — The Milkmaid katalog maddesi | https://www.essentialvermeer.com/catalogue/milkmaid.html | 200 (ham HTML). "Technical report" → 1995 NGA/Mauritshuis kataloğu (ed. Wheelock); pigment yorumları EV denemeleri | ikincil |
| K8 | Rijksmuseum — Jan Steen, The Feast of St Nicholas (SK-A-385) | https://www.rijksmuseum.nl/en/collection/object/The-Feast-of-St-Nicholas--b61f0c4c7cf5a503a2246ecde104fd28 | 200 (ham HTML) | birincil |
| K9 | Wikidata — Q2615527 / Q41264 | https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q2615527|Q41264&props=labels|claims|descriptions&languages=en&format=json | 200; 14 Kasım 2026: Q2615527 = Pieter van Ruijven, P570 = 1674 (K1/K7 ile uyumlu; açıklama metni bayat "1678") | yardımcı |
| K10 | Met — 2009 sergi sayfası | https://www.metmuseum.org/exhibitions/listings/2009/vermeer | **429 — ERİŞİLEMEDİ** | birincil (erişilemedi) |
| K11 | Met — sergi kitapçığı PDF (Liedtke) | https://resources.metmuseum.org/resources/metpublications/pdf/The_Milkmaid_by_Johannes_Vermeer.pdf | Incapsula + 10 MB sınır — **ERİŞİLEMEDİ** | birincil (erişilemedi) |
| K12 | NGA — Vermeer yayını PDF | https://www.nga.gov/sites/default/files/migrate_images/content/dam/ngaweb/research/publications/pdfs/johannes-vermeer.pdf | 80 MB sınır — **ERİŞİLEMEDİ** | ikincil (erişilemedi) |
| K13 | Web araması (2022 haberleri; Met teyidi; Europeana) | arama ajanı raporları | tek başına kanıt değil | yardımcı |
| K14 | Rijksmuseum — basın bülteni (NL, 8 Eylül 2022) | https://www.rijksmuseum.nl/nl/pers/persberichten/ontdekkingen-op-melkmeisje-onthullen-werkwijze-johannes-vermeer | 200 (ham HTML; 14 Kasım 2026 yeniden indirildi — bayt aynı). Dibbits "meer rust en verstilling" alıntısı BURADA | birincil |
| K15 | Rijksmuseum — Steen Linked Art (2006398) | https://id.rijksmuseum.nl/2006398 | 200 (ham JSON; 82 × 70,5 cm) | birincil |
| K16 | Rijksmuseum — Lucas van Leyden hikâye sayfası | https://www.rijksmuseum.nl/en/stories/dutch-masters/story/lucas-leyden-10 | 200 (ham HTML; 14 Kasım 2026 yeniden indirildi — bayt aynı). Bölüm JSON: "Everyday scenes" → The Milkmaid 1510; "Eroticism" → Worship of the Golden Calf c. 1530 | birincil |
| K17 | SEP — "Aesthetic Judgment" (N. Zangwill) | https://plato.stanford.edu/entries/aesthetic-judgment/ | 200 | ikincil (akademik; genel estetik — Kant'a özgü değil) |
| K18 | SEP — "Hegel's Aesthetics" | https://plato.stanford.edu/entries/hegel-aesthetics/ | 200 (14 Kasım 2026 yeniden indirildi) | ikincil (akademik) |
| K19 | SEP — "Walter Benjamin" | https://plato.stanford.edu/entries/benjamin/ | 200 (14 Kasım 2026 yeniden indirildi) | ikincil (akademik) |
| K20 | Citaliarestauro — "Panofsky, the 3 phases of the iconological method" | https://en.citaliarestauro.com/art-analysis-panofsky-method/ | 200. **Restorasyon şirketi blogu — popüler aktarım; akademik doğrulama kaynağı değil.** Özgün hedef: Panofsky, Studies in Iconology (1939) / Meaning in the Visual Arts (1955) — erişilmedi | ikincil (popüler aktarım) |
| K21 | The Marginalian — Berger, Ways of Seeing (1972) alıntıları | https://www.themarginalian.org/2012/09/28/ways-of-seeing-john-berger/ | 200. Kişisel blog; birincil alıntı aktarımı — hakemli değil | ikincil (alıntı aktarımı) |
| K22 | Wikipedia (EN) — Johannes Vermeer | https://en.wikipedia.org/wiki/Johannes_Vermeer | 200 (ham REST HTML) | yardımcı (tek başına A/B değil) |
| K23 | Mauritshuis — Girl with a Pearl Earring (no. 670) | https://www.mauritshuis.nl/en/our-collection/artworks/670-girl-with-a-pearl-earring | 200 (web_fetch; curl JS-engelli) | birincil |
| K24 | Vereniging Rembrandt — Het melkmeisje | https://www.verenigingrembrandt.nl/nl/kunst/het-melkmeisje | 200 | ikincil (kurum) |
| K25 | Rijksmuseum — "Extraordinary Ordinary" hikâye sayfası | https://www.rijksmuseum.nl/en/story/extraordinary-ordinary | 200 (14 Kasım 2026, ham HTML). "The crack in the window and the mould on the wall make the painting seem very real." | birincil |
| K26 | SEP — "Kant's Aesthetics and Teleology" | https://plato.stanford.edu/entries/kant-aesthetics/ | 200 (14 Kasım 2026, ham HTML). Çıkarsızlık; bağımlı/serbest güzellik §16; yücelik §28 (doğa) | ikincil (akademik) |
| K27 | Rijksmuseum — "A sexual or lesbian symbol" (Queer stories) | https://www.rijksmuseum.nl/en/stories/themes/queer/story/pride-milkmaid | 200 (14 Kasım 2026). Yalnız giriş metni sunucu tarafında; gövde istemci tarafında yükleniyor — OKUNAMADI | birincil (kısmi) |

**Erişilemeyen kaynakların sonuçları:** K10/K11/K12'den iddia üretilmedi. 2009 Met sergisinin *varlığı* K1 bibliyografyası (NYT + Met ilanı) ile B (C026); tarih/küratör/1939 ayrıntıları Wikipedia→Met zincirinde olduğundan E'ye düşürüldü (C072). Basılı kataloglar (Blankert, Wheelock, Liedtke, Franits, Montias, **1995 NGA/Mauritshuis sergi kataloğu**, Cant 2009) metnine erişilmedi; EV/Wikipedia aktarımları B veya E. 1995 kataloğu C040–C046'nın hedef birincil kaynağıdır (EV yıldızlı notu); katalog açılmadığı için bu maddeler B'de tutuldu.

## 2. İddia Envanteri

### Kimlik (Bölüm 1)

**C001** — Güncel başlıklar "Het melkmeisje" (nl) / "The Milkmaid" (en); eski başlıklar "De keukenmeid", "De melkmeid". Kaynak: K2 (identified_by), K1. Doğrudan. **A.**

**C002** — Sanatçı Johannes Vermeer (1632–1675). Kaynak: K2 ("Johannes Vermeer (1632–1675), olieverf op doek, ca. 1660"), K1, K5 (P170 Q41264 niteleyicisiz), K9. **A.**

**C003** — Rijksmuseum güncel tarihi c. 1660 (yaklaşık, yıl). WD P571 +1660 precision 9, P1480 Q5727902 (circa). Kaynak: K1, K2 (TimeSpan), K5. **A.**

**C004** — Kesin yıl bilinmez; literatür: Blankert 1975: 1660–1661; Wheelock 2000: c. 1658–1660; Liedtke 2008: c. 1657–1658; Franits 2015: c. 1658–1659 (dördü de K7 ham metninde birebir). Met 2009: c. 1657–58 (K6). Bülten girişi "(1657-58)" ↔ alt yazı "c. 1660" (K3); object sayfasında "1657" yok. **D.**

**C005** — Yağlıboya, tuval. Kaynak: K1, K2, K5 (P186). **A.**

**C006** — 45,5 × 41 cm. Kaynak: K1, K2, K5 (P2048/P2049). **A.**

**C007** — SK-A-2344; Rijksmuseum, Amsterdam. Kaynak: K1, K2, K5 (P217+P195). **A.**

**C008** — 1908 satın alma; Vereniging Rembrandt desteği; Six mirasçılarından 38 resimle birlikte 550.000 florin. Kaynak: K1 provenance (birebir), K2, K5; K24 (package deal 38 resim, 1907 anlaşma/1908 alım — fiyat vermez). **A.**

**C009** — Gallery of Honour (Eregalerij), HG-2.30.3. Kaynak: K1, K2. **A.**

**C010** — Eser imzasız ("No signature appears on this work", K7); K1'de imza alanı yok. (Not: "IVMeer" imzası Girl with a Pearl Earring'dedir — K23; Milkmaid'de değil.) **B.**

**C011** — Tür resmi; hizmetçi/süt/ekmek/stoofje. Kaynak: K1 subjects, K5 (P136). **A.**

**C012** — Yapım yeri Delft kabul edilir; **müze kaydında yapım yeri alanı yok**, EV'de "painted in Delft" ifadesi yok (ham tarama). Tek açık dayanak K5 P1071 (Q690 Delft) + Vermeer'in Delft kariyerine dayalı çıkarım (lonca C021, hami C018). Kural 4 gereği WD tek başına A/B sayılmaz. (Hakem turu: K7 kaynak listesinden çıkarıldı; B→E.) Kaynak: K5. **E — belirsiz.**

**C013** — Görüntü Public Domain Mark 1.0 (K1 "Copyright Public domain"; K2 referred_to_by → creativecommons.org/publicdomain/mark/1.0/). **"Veri CC0" iddiası K1/K2/veri politikası sayfasında bulunamadı; hakem turunda çıkarıldı (B20).** Kaynak: K1, K2. **A.**

### Provenance ve eser tarihi

**C014** — Erken zincir müze kaydında "?" ile kuşkulu: Van Ruijven → De Knuijt → Magdalena → Dissius. Kaynak: K1 (birebir), K7. **A** (zincirin kendisi kesin değil).

**C015** — Dissius satışı, Amsterdam, 16 Mayıs 1696, no. 2, 175 florin, Isaac Rooleeuw. Kaynak: K1 provenance (Hoet & Terwesten 1752; Montias 1989 doc. 439), K5 (P793). **A.**

**C016** — 175 florin, satıştaki en yüksek ikinci Vermeer fiyatı; birinci View of Delft (daha büyük). Sıralama K7 ham ("more than any of the 21 Vermeer's… except for the View of Delft") + K6 ile doğrulanır. **View of Delft'in fiyatı (200 fl) bu iddiaya dahil DEĞİLDİR** → C071 (E). Kaynak: K7, K6. **B.**

**C017** — 1908 alımı kamuoyu/parlamento tartışmasıyla gerçekleşti. K24 ham: Six ailesi 1907'de 38 resimlik paketi devlete satmaya hazır; "felle discussies in de kranten en in de politiek"; VR "substantieel deel van de koopsom" ödedi + hükümeti ikna etti. **Morgan korkusu Bredius'un kanaati** (K7: "Bredius was convinced that… J.Pierpont Morgan desired the painting"); Troelstra modern sanat alımını savundu, de Stuers ülkede kalma savunusu (K7). İsimler yalnız K7'de (K24'te yok) — tek kaynak. (Hakem turu: K24 ayrıntıları eklendi; Morgan atfı netleştirildi.) Kaynak: K7, K24. **B.**

**C018** — Pieter van Ruijven, Vermeer'in zengin Delftli hamisi (K7 "Vermeer's rich Delft patron"). Ölüm yılı **1674**: K1 "(1624-1674)", K7 provenance "(d. 1674)", K5/Q2615527 P570 = 1674 (14 Kasım 2026). WD **açıklama metni** hâlâ "1624-1678" der (bayat metin alanı; yapılandırılmış claim 1674). Önceki "1674 ↔ 1678 ihtilafı" hakem turunda giderildi (B10). "Ölümünde 21 Vermeer" → C069 (E). Kaynak: K7, K1, K5, K9. **B.**

**C019** — Reynolds 1781'de Hollanda'da eseri gördü ve etkilendi; Burke'e yazdı. Kaynak: K7 ham ("in Holland in 1781… Reynolds saw The Milkmaid and was impressed… wrote (to Edmund Burke)"). Alıntı genel Hollanda resimleri üzerinedir. **B.**

**C064** — 18. yy satış zinciri: 1701 no.7 320 fl; 1719 no.20 126 fl; 1765 no.65 560 fl (Yver); 1768 no.10 925 fl (Van Diemen); 1798 no.32 1.550 fl (Spaan); 1813 no.96 2.125 fl (Van Winter). Kaynak: K1 provenance (altısı da ham metinde birebir). Nominal fiyatlar; enflasyon düzeltmesi yok. **A.**

### Tarihsel bağlam ve kariyer

**C020** — Külliyat yaklaşık 35 resim. Kaynak: K3 ("about 35 paintings"). **A.**

**C021** — **Delft** Aziz Luka Loncası (K7 ham: "the Saint Luke Guild, the trade organization of Delft's artists and artisans"); Milkmaid'den birkaç yıl önce giriş ücretini tam ödeyemedi. K22 ham (29 Aralık 1653). Vermeer'in Delft'te yaşadığı/çalıştığı buradan da desteklenir (Başlangıç dersi bu iddiaya bağlanır). Kaynak: K7, K22. **B.**

**C022** — Fırıncı Hendrick van Buyten'e ekmek borcu: **617 florin, K7'de iki ayrı yerde** ("owed the considerable sum of 617 guilders"; "the significant amount owed to the baker was 617 guilders"). Ölüm sonrası resim/resimler verildi; **K7 kendi içinde tutarsız**: (1) "his widow… turned over two paintings as collateral"; (2) "he received two more paintings… as a security for the debt… of more than 600 guilders"; (3) "Catharina… settled this debt with Van Buyten by giving him a painting" (bir resim). K22: 1663'te (Vermeer hayattayken) fırıncıda "a couple of Vermeer's paintings as collateral" + "The widow sold two more paintings… to pay off a substantial debt". Nitelik (teminat/güvenlik/satışla ödeme) ve sayı (bir/iki) kesinleştirilemez; Montias 1989 birincil hedef (erişilmedi). (Hakem turu B04/C022: "EV=teminat, Wiki=satış" ikiliği yerine EV iç çelişkisi açıklandı.) Kaynak: K7, K22. **B.**

**C023** — Hollanda'da tür resmi Vermeer'den önceki on yıllarda gelişti; mutfak/pazar/ev içi sahneleri ve hizmetçi figürleri yaygındı; sütçü/mutfak hizmetçisi figürü erotik çağrışım taşıyabiliyordu. Kaynak: K7 ham ("a new artistic style pioneered by Dutch painters decades earlier"; "upper-tier genre painting"; **"Kitchen maids, and especially milkmaids, were known for being sexually available"** + Liedtke "sexual availability" alıntısı). **Lucas 1510 baskısı bu iddianın kanıtı DEĞİL** (C056 "Everyday scenes"; hakem turu B01). Kaynak: K7. **B.**

**C024** — K7 ham: "After The Milkmaid, Vermeer never again turned his attention to a **working-class theme**." Tema düzeyinde iddia; "tek emekçi figürlü eser" ifadesi kaynağı aşıyordu (hakem turu B05: kaldırıldı). K7 ayrıca: hizmetçinin onurlu, tek başına konu alınması "stands almost alone" (Sweerts istisnasıyla). Kaynak: K7. **B.**

**C025** — 2023 Vermeer sergisi 10 Şubat–4 Haziran; duyuruda ≥27/35, en büyük; Frick üç Vermeer; öne çıkanlar Mauritshuis/Städel/NGI/NGA. Kaynak: K3 ham. **A.**

**C026** — 2009'da Met'te "Vermeer's Masterpiece: The Milkmaid" sergisi açıldı. Varlık, K1 bibliyografyasındaki çağdaş NYT incelemesi (11 Eylül 2009) + Met ilanı (13 Eylül 2009) ile belgeli. Tarih/küratör/1939/beş-Vermeer ayrıntıları → C072 (E). Kaynak: K1 (bibliyografya), K6. **B.**

**C067** — 1648 İspanya barışı sonrası Hollanda ekonomisi kısa yıllarda zirveye ulaştı; Vermeer 1650'lerde tarih resminden, giderek prestij kazanan üst-düzey tür resmine yöneldi; tür resmi on yıllar önce geliştirilmişti. Kaynak: K7 ham. **B.**

### Biçimsel analiz — görsel doğrulama §3

**C027** — Hizmetçi süt döker; işine odaklı; süt akıntısı dışında her şey dingin. Kaynak: K1 ham ("entirely absorbed… Except for the stream of milk, everything else is still"), K4. **A.**

**C028** — Figür parlak odada "heykel gibi"; anıtsal dinginlik. Kaynak: K1 ham ("stands like a statue"), K4. **A.**

**C029** — Küçük panel anıtsal etki bırakır; kompozisyon öğeleri (çerçeve, sepet, pirinç kap) gözün süt dökme eylemine yönelmesini sağlar. Kaynak: K7 ham ("seemingly monumental character"; "Compositional dynamics… lead the eye down towards… the pouring milk"). **B.**

**C030** — Işık soldaki kurşun çerçeveli pencereden; beyaz başlık, sarı korse, mavi önlük, kırmızı etek, yeşilimsi kolluklar. Kaynak: K4 (görsel), K7 (çivi gölgesi: "It casts a small shadow on the plaster to the right, **signaling the light originates from the left**"; kolluk "greenish tint"), K1 (NL betim yalnız "links een venster" — pencere konumu; ışık yönü çıkarımı EV+görsel). (Hakem turu B21: K1 NL betiminin söylediğinden fazlası atfedilmedi.) **A.**

**C031** — Işık nesne yüzeylerinde "yüzlerce renkli nokta" (K1); pointillé = kalın opak küresel dokunuşlar (K7 "spherical dabs of thick opaque paint"). Kaynak: K1 ham, K7 ham. **A.**

**C032** — Masada hasır sepette somun/kırık ekmek, benekli mavi-gri stoneware sürahi (kapaklı), sütü alan toprak kap; koyu yeşil örtü + mavi kumaş. Kaynak: K4, K1 Hollandaca betim, K7 ("studded beer jug with a pewter lid"). **A.**

**C033** — Duvarda küf/lekeler, çivi(ler) ve çivi delikleri. **Müze birincil betimi: K25 "the mould on the wall make the painting seem very real"** (hakem turunda yeni kaynak; B→A). K7 ham: "A humble nail—another large nail is above the hanging bread basket… casts a small shadow… To the right of the figure's head appear a few nail holes." K6 (Cant): "stains, shadowing, nail and nail hole". Görsel: duvar dokusu kısmi teyit; çivi yakın kırpmayla bu oturumda netleştirilemedi (vision bütçesi). Kaynak: K25, K7, K4. **A.**

**C034** — Duvar dibinde Delft çinileri; birinde yaylı Cupid (kaynak betimi). K7 ham: "One of the tiles which Vermeer added displays a fairly recognizable Cupid with a cocked bow trapped midway between the milkmaid's voluminous skirt and the footwarmer" ("which Vermeer added" → C052'yi de destekler). K6 aynı yerleşimi verir. Görsel: çini figürleri kısmi; yay ayırt edilemedi. Kaynak: K7, K6, K4. **B.**

**C035** — Delikli kapaklı ahşap stoofje (K1 "stoofje"/"foot-stove"; K4 görsel). Görselde kutu içinde **kırmızımsı bir alan** görünür; köz/kap ayrımı net değil (14 Kasım 2026 IIIF kırpması + vision transkripsiyonu). **"Köz parıltılı" A seviyesinde görsel iddia olarak kaldırıldı (B13).** Köz kabı bilgisi K7'nin genel stoof betimi: "a receptacle of pottery or metal filled with hot coals" (B); K7 Rand bölümünde bu eser için "smoldering embers" ifadesi de geçer (ikincil betim). Kaynak: K1, K4, K7. **A** (kutu + delikli kapak); iç betim B notlu.

**C036** — Pencere camlarından biri çatlak. **Müze birincil betimi: K25 "The crack in the window"** (hakem turunda yeni kaynak; B→A). K7 ham: "a broken piece of one of the panes". K6 (Cant) konum: "fourth row from the bottom, far right"; ayrıca çizik ve içe itik cam. Görsel yakın teyit bu oturumda yapılamadı (vision bütçesi pencere kırpmasında tükendi); müze birincil betimi esas. Kaynak: K25, K7, K6. **A.**

**C037** — Duvarda asılı hasır sepet + pirinç/bakır kap; yansıma/emme farkı. Kaynak: K4, K1 ("rieten mand en een koperen pot"). **A.**

**C038** — Masa, açıldığında sekizgen olan katlanır (gateleg) masanın yarısı. **Kaynak: geometrik rekonstrüksiyon, teknik görüntüleme DEĞİL** (hakem turu B07). K7 ham: "Based on **Keith Cardnell's geometric reconstruction** of the tabletop's surface, various 17th-century Dutch art experts now concur that what we observe is actually half of the top of a 17th-century gateleg drop-leaf table, which, when opened, has an octagonal top." K7 ayrıca Vermeer envanterindeki "oak octagonal table, called a gateleg" ile eşleştirir. 2022 bulgularından ayrı tutulur. Kaynak: K7. **B.**

**C039** — Craquelure görünür. Kaynak: K4 kırpmaları (14 Kasım 2026 stoofje/duvar kırpmalarında da açık). **A.**

### Teknik ve malzeme

**C040–C046 kaynak notu (hakem turu B03):** Essential Vermeer'in "Technical report" bölümü yıldızlı notla biter: "* **Johannes Vermeer (exh. cat., National Gallery of Art and Royal Cabinet of Paintings Mauritshuis - Washington and The Hague, 1995, edited by Arthur K. Wheelock Jr.)**". Yani teknik rapor 1995 sergi kataloğu aktarımıdır — **Rijksmuseum araştırması DEĞİL** (önceki Orta §6 atfı yanlıştı; düzeltildi). Pigment yorumları EV'nin kendi deneme metinlerindendir. 1995 kataloğu bu dosyada açılmadı; maddeler B'de tutuldu.

**C040** — Bezelyi keten; orijinal germe kenarları; iplik 14 × 14,5 /cm². Kaynak: K7 ham ("The closed, plain-weave linen still has its original tacking edges. The thread count is 14 x 14.5" per cm²"). **B.**

**C041** — 1950 wax-reçine relining; önce paste lining. Kaynak: K7 ham ("relined with wax/resin in 1950 over an existing paste lining"). **B.**

**C042** — Ast: tebeşir + kurşun beyazı + umbra; soluk kahve/gri. Kaynak: K7 ham ("pale brown/gray, containing chalk, lead white and umber"). **B.**

**C043** — Doğal ultramarin (Afgan lapis); çağdaşlar **genellikle** azurit (K7 "contemporary painters, instead, **usually employed** the cheaper blue called azurite"); saydam glazür. Hami Van Ruijven hipotezi: K7 "Some scholars have speculated" (hipotez, olgu değil). Kaynak: K7 ham, K6. **B.**

**C044** — Korsede kurşun-kalay sarısı (dönemin en parlak sarısı). Kaynak: K7 ham ("lead-tin yellow, the brightest yellow pigment available in Vermeer's time"). **B.**

**C045** — Duvar: kurşun beyazı + umbra + kömür siyahı; etek: vermilyon + siyah, **büyük olasılıkla** madder glazür (K7 "Madder was **most likely** the dye used to give color to the red petticoat" — hakem turunda kesinlik düşürüldü); kolluk: kahve monokrom + beyaz/ultramarin + sarı glazür. Kaynak: K7 ham, K6. **B.**

**C046** — Kaçış noktası sağ elin üstünde iğne deliği: K7 ham ("A pinhole with which Vermeer marked the vanishing point of the composition is visible in the paint layer above the right hand of the maid"). **Liedtke iğne-ip yöntemi yalnız K6→2009 röportaj zincirinde** ("The pin in the canvas would have been tied to a string with chalk on it… Liedtke said in a 2009 interview"); özgün kayıt erişilemedi. Kaynak: K7 ham, K6. **B.**

**C047** — 2022: Rijksmuseum + Mauritshuis + (NL bülteni) Antwerpen Üniversitesi; Macro-XRF + RIS (Night Watch); SWIR; alt yazıda Macro-XRPD. Kaynak: K3 ham, K14 ham ("naast de Universiteit van Antwerpen"). **A.**

**C048** — Sol kol altında acele siyah alt boyama; "yavaş/titiz" varsayımı revize. Kaynak: K3 ham. **A.**

**C049** — Baş arkasında siyah eskiz sürahi rafı (**kannenbord** / jug holder), geliştirilmemiş; Vermeer kilerinde benzeri; Oortman bebek evi c. 1690 (gövde) / c. 1686–1710 (alt yazı). Kaynak: K3 ("jug holder"), K14 ("rek met kannen, ook wel kannenbord genoemd"). **A.**

**C050** — Sağ altta üzeri boyanmış nesne = ateş sepeti (vuurmand): söğüt örülü; **içine közlü bir kap (vuurtest/kom) konurdu** (K3 "A fire bowl containing glowing coals was placed in the basket"; K14 "In een vuurmand werd een vuurtest of kom met gloeiende kolen geplaatst"); bebek ısıtma/beze kurutma; Vermeer envanterinde kayıtlı; üzeri stoofje + çini + zemin. **Sepet daha önce biliniyordu** (K3 "the previously discovered basket, at the lower right"; K14 "die al eerder was ontdekt"); 2022'nin katkısı tanımlama (B14). **Dibbits "meer rust en verstilling" alıntısı K14'te VAR ve Dibbits'e atfedilir; K3'te YOK** (hakem turu B02: önceki Denetim B "DÜZELTME 1" geri alındı). Alıntı niyet yorumudur (C). "Tranquil atmosphere" K3 girişinde isimsiz. Kaynak: K3, K14, K7. **A.**

**C051** — Gizli sepet terminolojisi: eski çamaşır/giysi sepeti yorumu (C078, B) ↔ "dikiş sepeti" adı (C073, E) ↔ 2022 vuurmand (C050, A). EV konumu "lower-left" (figüre göre?), K3 "lower right". **D.**

**C052** — Çiniler ve stoofje sonradan eklendi. Kaynak: K7 ham ("The Delft wall tiles and the footwarmer were, instead, afterthoughts"; "One of the tiles which Vermeer added"), K3. **B.**

**C053** — Camera obscura tartışması. **EV çıkarımı kendisi yapar** (hakem turu B09): K7 ham "The famous pointillés… suggest nothing more than light as it flickers off the fractured topography of the bread, stoneware and basket. **Their presence implies that the artist used a camera obscura as an aid to the painting process.**" — hakemsiz ikincilin tartışmalı çıkarımı; "yalnızca ima" değil. **Cant'in argümanı pointillé değil, mesafe tutarsızlığıdır**: K6 "The discrepancy between objects at various distances from the viewer may indicate Vermeer used a camera obscura, according to Cant.[9]" (→ C079). Liedtke karşı argümanları (iğne deliği, ~10 sn izdüşüm, iğne-ip) yalnız K6→WNYC/gazete zincirinde; özgün kayıt erişilemedi. **D.**

### İkonografi ve yorum

**C054** — Cupid yorumları: Liedtke "discreet object of desire"; Wheelock "an ideal of human dignity" / "madonna of the cow-meadows"; Dibbits kuşkucu (yaygın çini). Kaynak: K7 ham (üçü de birebir). Görüşlerin varlığı B; içeriği **C.**

**C055** — Stoofje yorumu — **Liedtke**: cinsel ima / iç sıcaklık (K7 ham: "it may allude to the maid's inner warmth or even have a sexual implication since the warmth of the coals moved upwards under the skirt"). Emblem → C066. **Cant okumaları bu iddiadan ayrıldı → C079** (hakem turu B06: EV'de "Cant" adı kelime olarak geçmez — 0 eşleşme; önceki K7 atfı yanlıştı). Kaynak: K7. **C.**

**C065** — Cupid/stoofje üzerinde tek kesin anlam yok; Liedtke/Wheelock/Dibbits/Cant arasında belgeli yorum farkları. Kaynak: K7, K6. **B.**

**C066** — Stoofje, Roemer Visscher Sinnepoppen (1614) "Mignon des Dames" emblemi. Kaynak: K7 ham ("'Mignon des Dames' from Sinnepoppen Roemer Visscher 1614 Engraving Universiteits-Bibliotheek, Amsterdam"). DBNL birincil kontrolü yapılmadı. **B.**

**C056** — Lucas van Leyden, The Milkmaid (1510) gravürü, Rijksmuseum. **Müze baskıyı "Everyday scenes" bölümünde, erken tür sanatına yeni tema olarak sunar** (K16 bölüm JSON + gövde: "Lucas made an important contribution to the early development of genre art… With this milkmaid, farmer and cows, Lucas introduced a new theme in art."). **"Eroticism" bölümü Worship of the Golden Calf (c. 1530) üzerinedir** (van Mander'in "impure desire" yorumu); sütçü baskısıyla ilgisi yoktur. Önceki "erotik gelenek örneği" okuması yanlıştı (hakem turu B01; D06'nın bu kısmı geri alındı). Erotik gelenek iddiası C023'te EV'ye bağlandı. Kaynak: K16. **A** (yalnız bu içerik için).

**C057** — Harry Rand: ekmek pudingi hipotezi ("not universally accepted", K7); EV'nin kendi alternatifi "pap for young children". Künye: Rand, "Wat maakte de 'Keukenmeid' van Vermeer?", *Bulletin van het Rijksmuseum* 46 (1998) no. 2–3, s. 275–278 — K1 bibliyografyası başlığı listeler, K6 tam künyeyi verir (ISSN 0165-9510); makale bu dosyada açılmadı (B18). Kaynak: K1, K6, K7. **C.**

**C058** — Emeğin onuru / ev içi erdem okumaları. **Wheelock**: "insan onuru ideali" (K7). **Schama**: ev içi erdem geleneği — K6'da genel bağlam ("an alternative convention of painting women at work in the home as exemplars of Dutch domestic virtue, dealt with at length by Simon Schama"); bu esere özgü okuma değil; EV'de Schama yalnız Hollanda feminizmi bağlamında. **Laneri**: Raquel Laneri, *Forbes*, 12 Eylül 2009 sergi yazısı (K6) — gazeteci metni, akademik ekol değil. "Ekol" yalnız Liedtke/Wheelock için. **"Mona Lisa etkisi" (Liedtke) yalnız K6→NYT (Karen Rosenberg, 2009) zincirinde**; özgün röportaj erişilemedi. Kaynak: K6, K7. **C.**

**C059** — Figür milkmaid değil kitchen maid (keukenmeid). Kaynak: K7 ham, K2 eski başlık. **B.**

**C060** — Felsefi okumalar (Kant, Hegel, Benjamin, Berger, Panofsky) yorumdur; Vermeer'in etkilendiği iddia edilmez. Düşünür karakterizasyonları K17–K21 + K26 ile kontrol edildi (C074); K20/K21 blog aktarımları açıkça işaretli. **C.**

**C074** — Felsefi çerçeve doğrulaması (hakem turunda güncellendi): **Kant** çıkarsızlık ("does not depend on the subject's having a desire for the object") + evrensellik (K26 SEP Kant's Aesthetics; K17 genel); temsilî sanatta **bağımlı güzellik** (§16: "all judgments of beauty about representational art are judgments of adherent rather than of free beauty"); **yücelik doğaya ilişkindir** (§28, matematiksel/dinamik; "nature as fearful… in a position of safety") — küçük düzenli esere doğrudan uygulanmaz; önceki "Kantçı yücelik/dinginlik" cümlesi kaldırıldı (F1). **Hegel** sanat = özgür tinin duyusal ifadesi + Hollanda övgüsü "Lebendigkeit" + Hollandalıların **kendi özgürlük, "comfort", "contentment" duygularının ifadesi** (K18; Aesthetics 1:599). "Pazar günü" K18'de YOK — ders kendi yorumu olarak işaretler. **Benjamin** aura = "the unique appearance or semblance of distance, no matter how close it may be" (K19, Little History of Photography SW 2,518); teknik yeniden üretimle **geriler**; "emancipation of object from aura" olumlu, "salutary estrangement", siyasal potansiyel (K19). Önceki "aurayı demokratikleştirme" ifadesi Benjamin'e ters aktarımdı; düzeltildi, kendi yorumumuz olarak açıkça işaretlendi (F3). **Panofsky** üç katman (K20 — restorasyon şirketi blogu, popüler aktarım; özgün Studies in Iconology 1939 / Meaning in the Visual Arts 1955 erişilmedi; insan editör teyidi gerekli) (F5). **Berger** "men act and women appear" (K21 blog alıntı aktarımı); giyimli çalışan figüre uygulama genişletmedir; 5. bölüm (yağlıboya/mülkiyet) emek eleştirisi için daha doğrudan dayanaktır (F4). Kaynak: K17, K18, K19, K20, K21, K26. **C.**

### Karşılaştırma

**C061** — Jan Steen, The Feast of St Nicholas: SK-A-385, 1665–1668, yağlıboya tuval, **82 × 70,5 cm**; kalabalık anlatı (hediye, değnek, şömine başında sinterklaas şarkısı). Kaynak: K8 ham, K15 (boyut). **A.**

**C062** — Vermeer, Woman Holding a Balance: NGA Washington (kurum düzeyi). Kaynak: K3. **A** (kurum).

**C063** — Vermeer, Girl with a Pearl Earring: Mauritshuis, Lahey (kurum). Kaynak: K3, K23. **A** (kurum).

**C076** — Girl with a Pearl Earring bir portre değil **tronie**; Mauritshuis no. 670, y. 1665, yağlıboya tuval, 44,5 × 39 cm, imzalı "IVMeer". Kaynak: K23 ham. **A.**

### Belirsiz (E) — yetersiz/erişilemeyen kaynak (kural 4)

**C068** — "Melken" argosu "cinsel olarak cezbetmek". Yalnız K6→Liedtke/Plomp/Rüger 2001 [7]; özgün katalog erişilemedi; K7'de "melken" yok. **E.**

**C069** — Van Ruijven ölümünde 21 Vermeer sahibiydi. Yalnız K6→WNYC/Liedtke [12]; doğrulanamadı. (Karşılık: 1696 satışında 21 Vermeer → C070, B.) **E.**

**C070** — 1696 Dissius satışında 21 Vermeer satıldı. Kaynak: K7 ham. **B.**

**C071** — View of Delft'in 1696 fiyatı 200 florin. Yalnız K6→Met 2009 [2]; K7 bu sayıyı içermez; Met erişilemedi. Derslerde kesin sayı olarak verilmez; **hakem turunda CS06 çeldiricisinden de çıkarıldı** (yerine doğrulanmış 1719 fiyatı 126 fl kondu; Q6). **E.**

**C072** — 2009 Met sergisi kesin tarih (10 Eylül–29 Kasım), küratör Liedtke, "1939'dan beri ilk", "Met'in beş Vermeer'i". K6→Met; Met 429. Varlık C026 (B); bu ayrıntılar belirsiz. **E.**

**C073** — Gizli sepetin eski adı **"dikiş sepeti" (sewing basket)**. Yalnız K6→eski Rijksmuseum sayfası [1] ("the Rijksmuseum web page calls it a 'sewing basket'"); güncel K1/K7'de yok; doğrulanamadı. **Çamaşır/giysi sepeti yorumu ayrı iddia: C078 (B, EV)** — hakem turu B04 split. **E.**

### Hakem turunda eklenen iddialar (14 Kasım 2026)

**C077** — Rijksmuseum'un "Queer stories" serisinde "A sexual or lesbian symbol" başlıklı Milkmaid yorum sayfası var (K1 "Stories" bölümünden bağlantılı). Giriş metni (sunucu tarafında): "There she stands with rolled up sleeves, silent and alone, pouring milk. What do we know about the milkmaid? What do the attributes around her say about her? And what might they say about Vermeer or the person for whom he made this painting?" **Gövde istemci tarafında yükleniyor; bu dosyada okunamadı** (K27). Müzenin kendi ikonografi yorumu — insan editör incelemeli (B17). Kaynak: K1, K27. **A** (varlık + giriş).

**C078** — Gizli sepet için eski **çamaşır/giysi sepeti yorumu** EV'de belgeli: "In the lower-left behind the maid's skirt there once stood a large, open clothes basket with laundry issuing from it" + Taylor alıntısı ("The maid would have to be a rather heedless person if she gathered all the laundry of the house…"); EV "A missing clothes basket" bölümü ve 2022 vuurmand tanımı aktarımı ("what was formerly understood as a clothes basket was, in fact… a vuurmand"). Konum: EV "lower-left", K3 "lower right" (figüre göre fark olabilir). Kaynak: K7. **B.**

**C079** — **Cant okumaları** (yalnız K6→Serena Cant, *Vermeer and His World 1632–1675*, Quercus 2009, ISBN 978-1-849-16005-6; kitap erişilmedi): beyaz duvarlı "cool kitchen" + stoofje pratik amaç/çalışkanlık ("hardworking nature"); camera obscura argümanı = nesneler arası mesafe tutarsızlığı. EV'de "Cant" kelime olarak 0 eşleşme (önceki C055 K7 atfı yanlıştı). Kaynak: K6. **C — yorum** (zincir notlu).

**C080** — Baş arkasında kapatılan nesne için **eski yorumlar**: duvar haritası (K6: "One was a large wall map (a Rijksmuseum web page calls it a painting) behind the upper part of the woman's body"); EV "mantelpiece" olasılığı ("A large rectangular object whose horizontal form suggests that it may have been a mantelpiece once stood behind the maid"). 2022'de bölgedeki eskiz kannenbord olarak tanımlandı (C049). Yorum tarihi. Kaynak: K6, K7, K3. **D.**

### Proje içi gözlem

**C075** — Uygulamanın yerel görsel kopyası `gorseller/k/7ad9f577dbcabf65.jpg` 356×400 px JPEG; Rijksmuseum taramasıyla aynı eser (birden çok oturumda vision köprüsüyle karşılaştırıldı; hakem de dosyayı açıp doğruladı). Kaynak: doğrudan dosya incelemesi. **A.**

## 3. Görsel Doğrulama Kaydı (Kural 6)

- **İncelenen görüntü:** K4 Rijksmuseum IIIF taraması. 13 Kasım: 1200×1336 px + PIL bölge kırpmaları (ekmek-sepet, ayak-isitici-cini, duvar-civi, pencere, yüz-baslik, sut-akisi). 14 Kasım (hakem turu): tam kare 4649×5177'den IIIF bölge kırpmaları — stoofje+çini (2900,4050,1749,1127), sol duvar (0,1300,1600,2000), pencere (0,400,1000,2600). Geçici: `.qwen/tmp/pilot/` ve `.qwen/tmp/hakem/` (projeye kopyalanmadı).
- **14 Kasım bulguları:** stoofje kutusu delikli kapaklı ahşap; içinde kırmızımsı alan (vision transkripsiyonu "reddish-orange interior"; köz/kap ayrımı net değil — B13 ile uyumlu). Duvar kırpmasında hasır sepet + metal kap + duvar dokusu; çivi/delikler transkripsiyonda net değil. Pencere kırpmasında vision bütçesi tükendi — çatlak cam yakın teyit YOK; K25 müze betimi esas alındı.
- **Çapraz kontrol:** yerel uygulama görseli 356×400 (C075) aynı eser.
- **Sınırlar:** pointillé noktaları tek tek ve Cupid yayı yakın kırpmayla doğrulanamadı; çivi/delikler ve çatlak cam için müze/EV betimleri + kısmi görsel. Bu ayrıntılar kesin gözlem olarak yazılmaz.
- **İmza:** görüntüde imza yok; K7 "imzasız" der (C010).

## 4. İddia Sayıları (hakem revizyonu sonrası)

| Seviye | Adet | İddialar |
|---|---|---|
| A | 36 | C001, C002, C003, C005, C006, C007, C008, C009, C011, C013, C014, C015, C020, C025, C027, C028, C030, C031, C032, C033, C035, C036, C037, C039, C047, C048, C049, C050, C056, C061, C062, C063, C064, C075, C076, C077 |
| B | 27 | C010, C016, C017, C018, C019, C021, C022, C023, C024, C026, C029, C034, C038, C040, C041, C042, C043, C044, C045, C046, C052, C059, C065, C066, C067, C070, C078 |
| C | 7 | C054, C055, C057, C058, C060, C074, C079 |
| D | 4 | C004, C051, C053, C080 |
| E | 6 | C012, C068, C069, C071, C072, C073 |
| **Toplam** | **80** | C001–C080 |

**Hakem turunda çıkarılan/düşürülen içerik:** "veri CC0" (C013, kaynakta yok — B20); "köz parıltılı" A-seviyesi görsel iddia (C035 — B13); "tek emekçi figürlü eser" (C024 — B05); Lucas baskısının "Eroticism" örneği olduğu (C056 — B01); "EV=teminat, Wiki=satış" basitleştirmesi (C022 — EV iç çelişkisi açıklandı); C055'ten Cant atfı (C079'a ayrıldı — B06); "Rijksmuseum araştırması" teknik rapor atfı (1995 kataloğu — B03); "teknik araştırma gösterdi" masa ifadesi (geometrik rekonstrüksiyon — B07); Kantçı yücelik cümlesi (F1); "aurayı demokratikleştirme" (F3); CS02'deki kanıtsız RF 926/NK2334 atıfları (Q2); CS06'daki doğrulanmamış 200 fl çeldiricisi (Q6); C012 B→E (WD tek dayanak).

**Geri alınan önceki "düzeltmeler":** Denetim B DÜZELTME 1 (Dibbits alıntısı "haberlerde" — yanlıştı; NL bültende var, B02); D08 (localhost "düzeltilmiş" — yanlıştı; wikitext'te hâlâ bozuk, B12); D06'nın Lucas/Eroticism kısmı (B01).

## 5. Mevcut Uygulama Verisiyle Uyuşmazlıklar (veri DEĞİŞTİRİLMEDİ)

1. `basyapitlar.json` Q167605 `tarih: "1660"` → müze "c. 1660"; öneri "y. 1660".
2. `eser_ayrintilari.json` Cupid/kırık cam noktaları kaynaklarla uyumlu (kırık cam artık A — K25); camera obscura benzetmesi D; "azize ciddiyeti" yorum.
3. Q764831 (Steen) uygulama "1665" → müze "1665–1668"; aralık önerisi.
4. Vermeer doğum/ölüm (1632/1675) müzeyle uyumlu.
5. **EV güvenilirlik notu (B19):** EV, Isaac Rooleeuw için "(c. 1600-1710)" verir; K1 "(1663-1701)" der — EV biyografik tarihi hatalı. Dersler K1'i kullanır. EV içi tutarsızlıklar: Van Buyten (teminat/güvenlik/kapatma; bir/iki resim), sepet konumu (lower-left ↔ lower right). EV B seviyesinde tutulmaya devam eder.