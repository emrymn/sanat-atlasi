# KANIT DOSYASI — Q2472983 · Son Akşam Yemeği (Ultima cena / The Last Supper) · Tintoretto

**Tarih:** 14 Kasım 2026 · **Parti:** 2 · **Standart:** `../../AKADEMIK_STANDART.md`
**Durum:** İnsan incelemesi bekliyor.
**Araştırma brief'i:** `.qwen/tmp/parti2/Q2472983-brief.md` (kaynak-arastirma agent; ham cache'ler `.qwen/tmp/parti2/`).

---

## 0. Yöntem ve kaynak hiyerarşisi

Eser bir tuvaldir; bir müze koleksiyonunda değil, **işlevsel bir kilisede** (San Giorgio Maggiore, Venedik) asılıdır. Bu nedenle "birincil katalog" = ICCD (Ministero della Cultura / Catalogo generale dei Beni Culturali) scheda'sıdır. **ICCD canlı kaydı 403 (Anubis v1.28.1 bot koruması) verdi; Wayback arşiv kopyası (2025-01-20 snapshot) 200 ile AÇILDI** → künye/atıf/teknik/konum/mülkiyet/ikonografik okuma **A** (arşiv tarihi beyan edildi). SIGEC tam scheda PDF'i (S10/K10) erişilemedi (arşiv 404, canlı zaman aşımı HTTP 000); PDF'te olabilecek kronoloji alanı doğrulanamadı. WGA (K6) + FU Berlin "fundiert" (K7) ikincil; en/it Vikipedi (K2/K3) ikincil (itwiki'de satır içi atıf YOK; enwiki'de tek ref Gardner — kitaba erişilmedi). Wikidata (K1) yardımcı; P571=1563'ün dayanakları (Zeri 44056; Guida 2019 s.88) erişilemedi → 1563 iddiası **E**, tarih **D**.

**Dört ihtilaf D:** tarih 1563 ↔ 1592–94 (C035/D1), kilise içi yerleşim "arkası" ↔ presbiterio sağ duvarı (C036/D2), otografi "certainly himself" ↔ "largo intervento di aiuti" (C017/D3), meleklerin aracı maddesi "duman" ↔ "ışık" (C037/D4). **Görsel İNCELENEMEDİ** (vision kotası ana oturumda); yalnız metadata + lisans; **GZ TASLAK**. Brief'in D/E ifadeleri (intorno al / probabilmente / Alcuni Autori / im Bewusstsein des Hypothetischen) AYNEN korunmuştur.

Bu dosyadaki iddia envanteri, brief'in C001–C024 + D1–D4 + E1–E10 listesinin genişletilmiş biçimidir: brief'in ham cache'lerinden bağımsız okuma ile doğrulanan ek olgular C025–C034 olarak eklendi; D/E ayrı kimliklere taşındı (C017=D3; C035=D1; C036=D2; C037=D4; E1→C005 içinde, E2→C017 içinde, E3→C021, E4→C020, E5→C022, E6→C023, E7→C038, E8→C039, E9→C019, E10→C040).

## 1. Kaynak envanteri

| ID | Kurum | Belge | URL | Erişim (14 Kas 2026) | Tür |
|---|---|---|---|---|---|
| K1 | Wikidata | Q2472983 EntityData JSON | https://www.wikidata.org/wiki/Special:EntityData/Q2472983.json | 200 | yardımcı |
| K2 | Wikipedia (en) | "Last Supper (Tintoretto)" wikitext | https://en.wikipedia.org/w/api.php?action=parse&page=Last%20Supper%20(Tintoretto)&prop=wikitext&formatversion=2&redirects=1&format=json | 200 | ikincil |
| K3 | Wikipedia (it) | "Ultima Cena (Tintoretto)" wikitext | https://it.wikipedia.org/w/api.php?action=parse&page=Ultima%20Cena%20(Tintoretto)&prop=wikitext&formatversion=2&redirects=1&format=json | 200 (satır içi atıf YOK) | ikincil |
| K4 | Wikipedia (it) | render edilmiş HTML ("Collegamenti esterni"; ICCD URL'si buradan bulundu) | https://it.wikipedia.org/w/api.php?action=parse&page=Ultima%20Cena%20(Tintoretto)&prop=text&formatversion=2&redirects=1&format=json | 200 | yardımcı |
| K5 | Ministero della Cultura / ICCD | Scheda 0500123375 "ultima cena" (BİRİNCİL) | Canlı: https://catalogo.beniculturali.it/detail/HistoricOrArtisticProperty/0500123375 · Arşiv: https://web.archive.org/web/20250120105358/https://catalogo.beniculturali.it/detail/HistoricOrArtisticProperty/0500123375 | canlı 403 (Anubis v1.28.1); arşiv 200 (snapshot 2025-01-20), erişim 2026-11-14 | birincil (arşiv) |
| K6 | Web Gallery of Art | Tintoretto, The Last Supper, 1592-94 | https://www.wga.hu/html/t/tintoret/5_1580s/3lastsup.html | 200 | ikincil |
| K7 | Freie Universität Berlin — "fundiert" 01/2003 | C. Bohlmann / Th. Fink / Ph. Weiß, "Das Unsichtbare sichtbar machen — Die Lichtgeister des Jacopo Tintoretto" | https://www.fu-berlin.de/presse/publikationen/fundiert/archiv/2003_01/03_01_bohlmann_fink_weiss/index.html | 200 | ikincil |
| K8 | Wikimedia Commons | File:Jacopo Tintoretto - The Last Supper - WGA22649.jpg (imageinfo + extmetadata) | https://commons.wikimedia.org/w/api.php?action=query&titles=File:Jacopo%20Tintoretto%20-%20The%20Last%20Supper%20-%20WGA22649.jpg&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&format=json | 200; metadata; İNCELENEMEDİ | görsel |
| K9 | Internet Archive | Wayback CDX (ICCD snapshot sorgusu) | http://web.archive.org/cdx/search/cdx?url=catalogo.beniculturali.it/detail/HistoricOrArtisticProperty/0500123375&output=json&limit=30 | 200 (availability API ilk denemede timeout) | yardımcı |
| K10 | ICCD / SIGEC | Tam scheda PDF (ICCD2814578) + RDF (ArCo) | https://sigecweb.beniculturali.it/sigec/item/print/ICCD2814578 | arşiv 404; canlı HTTP 000 (60 sn zaman aşımı) | birincil (ERİŞİLEMEDİ) |
| K11 | Yerel repo (salt-okunur) | data/basyapitlar.json, eserler_onbellek.json, eser_ayrintilari.json, ders_kaynaklari.json, ikonografi.json | (yerel) | yerel okuma | yardımcı (veri; doğrulama nesnesi) |

**K5 (ICCD, arşiv) doğrulanan alanlar:** başlık "ultima cena / dipinto"; ATTRIBUZIONI "Robusti Jacopo Detto Tintoretto (1518/ 1594)"; ALTRE ATTRIBUZIONI "Alcuni Autori Sostengono La Tesi Di Un Largo Intervento Diaiuti" [sic]; MATERIA E TECNICA "tela/ pittura a olio"; LUOGO DI CONSERVAZIONE "Basilica di S. Giorgio Maggiore", INDIRIZZO "Isola di San Giorgio Maggiore, Venezia (VE)"; betim "Dipinto di formato rettangolare entro cornice dorata. Il quadro è determinato dalla posizione obliqua della tavola ... luminismo determinato dalla lampada e dall'aureola del Cristo. Anche gli angeli sono raffigurati come entità puramente luminose e trasparenti."; Personaggi: Cristo; Apostoli; Comparse: Donne; Uomini; Angeli; Animali: Cane; Gatto; Oggetti: Piatti; Bicchieri; Bottiglie; Ceste; Frutta; Coppa; Tavola; Lampada; NOTIZIE STORICO CRITICHE (Efkaristiya döngüsü; LaRossi 1981 ← Ivanoff 1975; cantorie; karşı duvar "Gli Ebrei che Rifiutano la Manna nel Deserto"; Ivanoff'un manna-reddi okuması; "Una delle ultime opere di Jacopo Tintoretto (1594)"); CONDIZIONE GIURIDICA "proprietà Ente religioso cattolico"; CODICE 0500123375; ENTE COMPETENTE / SCHEDATORE Soprintendenza Venezia; DATA DI COMPILAZIONE 1990; AGGIORNAMENTO 2002, 2006; LICENZA METADATI CC-BY 4.0. **Scheda'da açık bir yaratım tarihi/kronoloji alanı YOK** ("1563"/"1592" ham HTML'de geçmez).
**K6 (WGA):** "1592-94; Oil on canvas, 365 x 568 cm; San Giorgio Maggiore, Venice"; kilise 1566–1600 Palladio tasarımı; 1590 sonrası atölye siparişleri, yardımcıya artan bağımlılık; 1592'de kutsanan şapelde üç tuval (The Jews in the Desert, The Last Supper, The Entombment) "were certainly painted by Tintoretto himself"; "fest of the poors"; oblik masa = presbiterio sağ duvarı + ana sunağın perspektif uzantısı; Christ'in rahip duruşu + küçük yan masada litürjik kaplar; Efkaristiya "bread of angels" (St Thomas Aquinas), transubstantiation; kompozisyon modeli Giulio Romano Passover duvar halısı; titrek kandil detayı Titian Crowning with Thorns (Alte Pinakothek, Münih; ustanın mirasından edinilmiş).
**K7 (FU Berlin):** üç ışık tipi (kandil ateşi → ışın/dalga → hayaletimsi melekler; İsa'nın Gloriole'si; hizmetkârların "rilievo" ile plastik dünyevi ışığı); "Bilddiagonale von links oben nach rechts unten"; masa "in der ideellen Verlängerung der Achse des Altars" + "Schrägsicht des Betrachters"; melekler "allein mit schnellen Strichen skizziert ... dünne Malerei den Untergrund durchscheinen lässt"; sahne "Beginn des Sakraments als Einbrechen des Göttlichen in die Wirklichkeit"; Trento Konsili (1545–1563), 11 Ekim 1551 13. oturum Efkaristiya dekreti (Julius III), transubstantiation, "sichtbare Form einer unsichtbaren Gnade"; Lomazzo Trattato 1585 (Aristoteles + Neoplatonik ışık metaphysik); "Leider weiß man wenig darüber, welchen kunsttheoretischen, theologischen oder philosophischen Programmen Tintoretto verpflichtet war"; Stoichita röportajı (Kritische Berichte 4/2002, yalnız anılıyor); Origenes okuması AÇIKÇA HİPOTEZ ("im Bewusstsein, uns auf dem Boden des Hypothetischen zu befinden"); Lies 1985 s.165 (Casalius — anakronizm; Henriquez 1600 Venedik); manna = typos; disegno/colorito yeni karışımı, şeffaf yağ katmanları, koyu zemin, mesafe etkisi; Max Raphael "dynamischer Substanzbegriff"; takma ad "il tintore" (babasının mesleği, boyacı).
**K2/K3 (wiki):** enwiki 1592–1594, 365×568, San Marcuola 1547 / San Felice 1559 cepheden (atıfsız), Dürer 1523 tahta baskısı örneği (atıfsız), Gardner alıntısı (Vol. II, 13th ed., s.494 — kitaba erişilmedi); itwiki "intorno al 1592-1594", taverna veneziana, üç luminosite düzeyi, "mumlu kek" bilmecesi + Amalteo 1574 Castello di Udine (atıfsız), Lucca San Martino "probabilmente completata dal figlio" (atıfsız). itwiki wikitext'inde önceki yanlış bilginin ("rotto") kaldırıldığına dair HTML yorumu (diff 30785050) — madde geçmişte hatalı içerik taşımış.
**K1 (Wikidata):** P170=Q9319; P571=+1563 (precision 9=yıl; ref P3272=44056 Zeri + P248=Q116739019 "Abbazia di San Giorgio Maggiore. Guida alla Basilica" 2019, P304=88); P186 oil paint + canvas; P2048=365 / P2049=568 cm; P195/P276=Q713558; P18=WGA22649.jpg; P973=K7 URL; P9051=HistoricOrArtisticProperty/0500123375; P6216=Q19652 (public domain; P459=100+ yıl pma).
**K8 (Commons):** 1337×850 px, 771.329 bayt; PD (PD-art + PD-old-100-expired); AttributionRequired=false; Credit "Web Gallery of Art"; DateTimeOriginal "between 1592 and 1594" (P1319/P1326); Artist "Jacopo Tintoretto (1518/1519–1594)". Orijinal: https://upload.wikimedia.org/wikipedia/commons/4/46/Jacopo_Tintoretto_-_The_Last_Supper_-_WGA22649.jpg

**Erişilemeyenler (URL tahmini YASAK; kaynakçada anıldı, metne erişilmedi):** Fondazione Zeri kaydı (P3272=44056; URL yok); "Abbazia di San Giorgio Maggiore. Guida alla Basilica" (2019), s.88 (kitap); Gardner's Art Through the Ages Vol. II, 13th ed., s.494 (kitap; yalnız enwiki alıntısı görüldü); Ivanoff 1975 / LaRossi 1981 (K5 kaynakçada anıldı); Kritische Berichte 4/2002 Stoichita röportajı; Lomazzo Trattato 1585 (özgün metin); Lies 1985 (K7 içinde anıldı); SIGEC PDF (K10).

## 2. İddia envanteri (A–E)

**C001** — Eserin adı "Ultima cena" (ICCD) / Last Supper / Son Akşam Yemeği. **A.** K5, K2.
**C002** — Sanatçı: Jacopo Robusti, detto Tintoretto (ICCD "1518/ 1594"). **A.** K5, K1.
**C003** — Teknik: tuval üzerine yağlıboya (tela/ pittura a olio). **A.** K5, K6, K1.
**C004** — Boyut: 365 × 568 cm (yükseklik × genişlik); erişilen tüm kaynaklar uyumlu. **B.** K6, K2, K3, K8, K1.
**C005** — Tarih: 1592–1594, son dönem eseri; itwiki "realizzato **intorno al** 1592-1594" (civarı belirsizliği aynen korundu); ICCD "Una delle ultime opere di Jacopo Tintoretto (1594)" (kesin yıl vermez). **B.** K6, K3, K8, K5.
**C006** — Konum: Basilica di San Giorgio Maggiore, Isola di San Giorgio Maggiore, Venedik (VE). **A.** K5, K1.
**C007** — Kilise içi yerleşim: presbiterio'nun sağ duvarı; masa, ana sunağın perspektif uzantısı olarak algılanacak şekilde (WGA); masa "in der ideellen Verlängerung der Achse des Altars" + izleyicinin oblik görüşü (FU Berlin). **B.** K6, K7.
**C008** — Masa sert bir oblik/diyagonal düzen çizer (ICCD "posizione obliqua della tavola"; Leonardo'nun cepheden kurgusundan kopuş). **A.** K5, K6, K2, K7.
**C009** — İki ışık kaynağı: tavandan sarkan yağ kandili + İsa'nın haresi (ICCD "luminismo determinato dalla lampada e dall'aureola del Cristo"). **A.** K5, K2, K7.
**C010** — Melekler salt ışıktan, yarı saydam varlıklar olarak betimlenir (ICCD "entità puramente luminose e trasparenti"; FU Berlin hızlı eskiz çizgileri, alt tabakayı gösteren ince boya). **A.** K5, K7, K3.
**C011** — Sahne ihanetin ilanını değil Efkaristiya'nın kurulmasını (transubstantiation) gösterir. **B.** K6, K7, K3.
**C012** — Karşı Reform idealleriyle uyumlu didaktik işlev: enwiki Gardner alıntısı (Vol. II, 13th ed., s.494 — kitaba erişilmedi, alıntı zinciri notuyla B); FU Berlin Trento 1551 dekreti bağlamını bağımsız verir. **B.** K2, K7.
**C013** — Gündelik figürler (hizmetkârlar, kadınlar) ve hayvanlar (köpek, kedi) kutsal sahneyle aynı mekânda; ICCD Comparse/Animali/Oggetti listeleri. **A.** K5, K2, K3.
**C014** — San Giorgio'nun Efkaristiya döngüsünün parçası; karşı duvarda "Gli Ebrei che Rifiutano la Manna nel Deserto"; cantorie ile ilişkili; LaRossi (1981) Ivanoff'u (1975) izler (ikisi de kaynakçada anıldı, metne erişilmedi). **A.** K5.
**C015** — Ivanoff okuması (ICCD aktarımı): sağ ön plandaki adam, kadının kupada sunduğu manayı reddeder; Eski/Yeni Ahit paralelliği. **A.** K5.
**C016** — Kilise 1566–1600 Palladio tasarımıyla inşa edildi; 1590 sonrası atölyeye büyük tuval siparişleri; 1592'de kutsanan şapelde üç tuval: The Jews in the Desert, The Last Supper, The Entombment. **B.** K6.
**C017** — OTOGRAFİ İHTİLAFI (D3): WGA "three surviving paintings ... were certainly painted by Tintoretto himself" ↔ ICCD ALTRE ATTRIBUZIONI "**Alcuni Autori Sostengono La Tesi Di Un Largo Intervento Diaiuti**" [sic — "Di aiuti"; hangi yazarlar olduğu belirtilmez, E2 belirsizliği aynen korundu]. **D.** K6, K5. (tartışma)
**C018** — Kompozisyon modeli: Giulio Romano'nun Passover duvar halısı; titrek kandil detayı: Titian'ın Crowning with Thorns'u (Alte Pinakothek, Münih; Tintoretto ustanın mirasından edinmişti). **B.** K6.
**C019** — Önceki Last Supper'lar: San Marcuola 1547, San Felice 1559, cepheden perspektif (enwiki, atıfsız; E9). **E.** K2. (belirsiz)
**C020** — Lucca (San Martino) versiyonu bu eserden türer; "**probabilmente** completata dal figlio" (itwiki, atıfsız; E4 belirsizliği aynen korundu). **E.** K3. (belirsiz)
**C021** — Masada "mumlu kek" benzeri nesne; "sembra una torta con delle candeline, ma **non si è riusciti a capirne il significato**" (itwiki, atıfsız; E3); Amalteo 1574 (Castello di Udine) emsali. **E.** K3. (belirsiz)
**C022** — Data'nın Yahuda teşhisi: "Haresiz, masanın bizim tarafımızda yalnız oturan figür genellikle Yahuda olarak yorumlanır" — erişilen hiçbir kaynakta (K2/K3/K5/K6/K7) Yahuda teşhisi YOK (E5). **E.** K11. (belirsiz)
**C023** — Origenes/Neoplatonik ışık okuması: FU Berlin açıkça hipotez ("**im Bewusstsein, uns auf dem Boden des Hypothetischen zu befinden**", E6); dayanak Stoichita röportajı (Kritische Berichte 4/2002) yalnız anılıyor, erişilmedi. **E.** K7. (belirsiz)
**C024** — Mülkiyet: proprietà Ente religioso cattolico; kataloglama/tutela: Soprintendenza Venezia; CODICE DI CATALOGO NAZIONALE 0500123375; derleme 1990, güncelleme 2002/2006; metadata lisansı CC-BY 4.0; scheda'da açık kronoloji alanı yok. **A.** K5.
**C025** — ICCD fiziksel betim: dikdörtgen format, yaldızlı çerçeve ("Dipinto di formato rettangolare entro cornice dorata"). **A.** K5.
**C026** — FU Berlin üç ışık düzeni: kandil (dünyevi), haleler (kutsal), ışık-melekler (ruhsal); hizmetkârlar "rilievo" ile plastik; ışık bölgeleri "Bilddiagonale von links oben nach rechts unten" boyunca okunur. **B.** K7.
**C027** — FU Berlin teknik: Rönesans'ta disegno'nun idealist önceliği (Sebastiano del Piombo kompozisyonlarını Michelangelo'ya düzelttirirdi); Tintoretto'da geniş eskiz fırça darbeleri bitmiş resme girer, çizgi darbe olur; şeffaf yağ katmanları koyu zeminin rengini harmoniye katar; yakında eskiz, uzakta bitmiş sahne (mesafe etkisi); atmosferik/geçici olgular hayaletimsi varlıklara dönüşür. **B.** K7.
**C028** — FU Berlin tarihsel bağlam: Trento Konsili (1545–1563); 11 Ekim 1551, 13. oturum Efkaristiya dekreti (Julius III); transubstantiation; sakrament "görünmez lütfun görünür biçimi". **B.** K7.
**C029** — FU Berlin: Lomazzo Trattato 1585 iki ışık geleneğini birleştirir (Aristotelesçi temsil ortamı + Neoplatonik ışık metaphysik); Tintoretto'nun hangi kuramsal/teolojik programa bağlı olduğu az bilinir ("Leider weiß man wenig..."). **B.** K7.
**C030** — Takma ad: babasının mesleği "il tintore" (boyacı) → Tintoretto (FU Berlin). **B.** K7.
**C031** — WGA: "fest of the poors" — İsa havari kalabalığına karışır; küçük yan masada litürjik kaplar; İsa'nın rahip duruşu sunak bağlantısını pekiştirir. **B.** K6.
**C032** — Manna sahnesi Son Akşam Yemeği'nin tipolojik öncülü (typos/Präfiguration) olarak okunur; sunağın diğer tarafında (FU Berlin; ICCD döngü kaydıyla uyumlu). **B.** K7, K5.
**C033** — Görsel kamu malı: PD-art + PD-old-100-expired (Tintoretto ö. 1594; 100+ yıl pma); AttributionRequired=false; Commons 1337×850; Wikidata P6216=public domain. **B.** K8, K1.
**C034** — Eser, Leonardo gibi önceki ressamların aynı konu betimlerinden "vizyonel" karakteriyle ayrılır (WGA); Maniyerist asimetri + gündelik vurgu Barok'a işaret eder (enwiki). **B.** K6, K2.
**C035** — TARİH İHTİLAFI (D1): data/basyapitlar.json "tarih":"1563" + eserler_onbellek "yil":1563 ← Wikidata P571=+1563 (precision 9; ref Zeri 44056 + Guida 2019 s.88, ikisi de erişilemedi → E8/C039) ↔ WGA "1592-94" / itwiki "intorno al 1592-1594" / Commons "between 1592 and 1594" / ICCD "Una delle ultime opere (1594)". Data içi çelişki: aynı kaydın ozet'i "(1592–1594)" diyor. ICCD'de kronoloji alanı yok; SIGEC PDF erişilemedi. ÇÖZÜLMEDİ. **D.** K11, K1, K6, K3, K8, K5, K10. (tartışma)
**C036** — YERLEŞİM İHTİLAFI (D2): data "San Giorgio Maggiore ana sunağının arkası" ↔ WGA "right wall of the presbytery" + FU Berlin sunak ekseninin ideel uzantısı. Data ozet'i "yan duvarında" diyor (data içi çelişki); "arkası" ifadesi erişilen hiçbir kaynakla desteklenmiyor. **D.** K11, K6, K7. (tartışma)
**C037** — MELEKLERİN ARACI MADDESİ İHTİLAFI (D4): data "Kandilin dumanı meleklere dönüşür" / "dumanı kıvrılarak yarı saydam meleklere dönüşür" ↔ erişilen kaynaklar "ışık": FU Berlin kandil ATEŞİ "ergießt sich in Strahlen und Wellen und formiert sich zu geisterhaften Engelsgestalten"; ICCD "entità puramente luminose"; itwiki "figure fatte solo di luce". Not: FU Berlin Origenes bölümünde kandili "Rauchgefäß" (duman kabı) olarak anar, ama dönüşüm ortamı ışık/ateş olarak betimlenir; data'nın "duman" formülasyonu erişilen kaynaklarda birebir yok. Görsel teyit yapılmadı. **D.** K11, K7, K5, K3. (tartışma)
**C038** — Doğum yılı belirsizliği (E7): Wikidata açıklaması "1518/1519–1594"; ICCD "1518/ 1594"; WGA "b. 1518". **E.** K1, K5, K6. (belirsiz)
**C039** — 1563'ün dayanakları erişilemedi (E8): Zeri 44056 (URL yok, tahmin yasak); Guida alla Basilica 2019 s.88 (kitap); SIGEC PDF (arşiv 404, canlı HTTP 000); ICCD canlı 403 (Anubis). **E.** K1, K10, K5. (belirsiz)
**C040** — Scheda güncelliği sınırlı (E10): derleme 1990, güncelleme 2002/2006; canlı katalog 403 olduğundan daha yeni güncelleme olup olmadığı bilinmiyor. **E.** K5. (belirsiz)
**C041** — Görsel bu oturumda İNCELENEMEDİ (vision kotası ana oturumda); yalnız metadata + lisans + çözünürlük; GZ TASLAK; kompozisyon kaynak metinlerinden. **E.** K8. (belirsiz)
**C042** — İkincil literatür metinleri erişilmedi: Gardner (kitap), Ivanoff 1975 / LaRossi 1981, Stoichita (Kritische Berichte 4/2002), Lies 1985, Lomazzo Trattato 1585 özgün metni; kaynakçada anıldı. **E.** K2, K5, K7. (belirsiz)
**C043** — Yorum: ışık hiyerarşisi ontolojik bir merdiven olarak okunabilir (Tanrı'nın görünmez ışığı → İsa'nın haresi → meleklerin ışık-bedenleri → insanların opak bedenleri); bu, eserin katmanlı varlık düzenine ilişkin bir yorumdur, olgu değil. **C.** K7. (yorum)
**C044** — Yorum: gündelik olanla kutsalın aynı mekânda buluşması, "kutsalın sıradan hayatın içine inişi" olarak okunabilir; WGA'nın "fest of the poors" nitelemesi bu okumayı destekler. **C.** K6, K7, K3. (yorum)
**C045** — Yorum: eser "görünmez olanı görünür kılma" paradoksunu deneyimletir — ışık varlıkları hem belirir hem de maddesiz kalır; izleyici, yakınlık/uzaklıkla değişen bu belirişi estetik olarak tamamlar. **C.** K7. (yorum)

**Sayım:** 45 iddia · A=12 · B=16 · C=3 · D=4 · E=10.

## 3. Görsel doğrulama kaydı (Kural 6)

- K8 metadata: `File:Jacopo Tintoretto - The Last Supper - WGA22649.jpg`, **1337 × 850 px**, 771.329 bayt; JPEG uzantılı (imageinfo `mime` alanı boş döndü). Orijinal URL: https://upload.wikimedia.org/wikipedia/commons/4/46/Jacopo_Tintoretto_-_The_Last_Supper_-_WGA22649.jpg · Açıklama sayfası: https://commons.wikimedia.org/wiki/File:Jacopo_Tintoretto_-_The_Last_Supper_-_WGA22649.jpg
- Lisans: **Public domain** (PD-art + PD-old-100-expired; "faithful photographic reproduction of a two-dimensional, public domain work of art"); AttributionRequired=false; Credit "Web Gallery of Art" (WGA ID 22649). Wikidata P6216=Q19652 (P459: 100+ yıl pma). data'daki "Public domain" etiketi ve dosya adı Commons ile birebir uyumlu.
- **GÖRSEL İNCELENEMEDİ** (vision kotası ana oturumda kullanılıyor; C041 E). Kompozisyon/ışık/ikonografi betimleri K5 (A) + K6/K7 (B) METNİNDEN; derslerde "kaynakların betimlediği" kaydıyla verilir. **GZ TASLAK.** Görsel projeye kopyalanmadı; URL + lisans + kaynak referans.
- Diğer sürüm: `Tintosoup.jpg` (Commons other_versions) — incelenmedi. WGA yolu "5_1580s" klasöründe ama WGA tarihi 1592-94: WGA içi dönemleme tuhaflığı, tarihe kanıt değil.
- ICCD scheda görseli (SIGEC ICCD2814579_S0069783.jpg) arşiv sayfasında referanslı; erişilmedi, incelenmedi.

## 4. Kelime/süre sayımı

| Seviye | Hedef | Ölçülen | Süre |
|---|---|---|---|
| Başlangıç | 400–500 | 420 | 3 dk |
| Orta | 1300–1600 | 1303 | 10 dk |
| İleri | 2600–3200 | 2633 | 20 dk |

dogrula.py (venv-dogrula, jsonschema Draft2020-12 AKTİF): **Q2472983 için 0 hata / 0 uyarı** (kelime üçü de hedef aralıkta; şema, çapraz tutarlılık, quiz A/B, D/E işareti, 12 bölüm, Sayım tutarlılığı temiz). Not: global SONUÇ'taki hatalar öteki eserlere aittir (parti2 eşzamanlı yazımları; Q2472983 değil). · CJK: 0 · iddia 45 (A12/B16/C3/D4/E10). ICCD birincil ARŞİVDEN AÇILDI (A); görsel İNCELENEMEDİ (E).

## 5. Veri notları (data/ DEĞİŞTİRİLMEDİ — salt-okunur tespitler; insan onayına sunulur)

1. **Tarih (D1, C035):** `basyapitlar.json` "tarih":"1563" ↔ aynı kaydın ozet'i "(1592–1594)"; `eserler_onbellek.json` "yil":1563, "kaynaklar":["kurs","wikidata"] → iz Wikidata P571=1563'e (Zeri 44056 + Guida 2019 s.88, erişilemedi) çıkıyor. Ders 1592–94'ü kaynaklı majority olarak sunar, 1563'ü D olarak beyan eder; data düzeltmesi ÖNERİLMEZ, onaya sunulur.
2. **Yerleşim (D2, C036):** data "ana sunağının arkası" ↔ ozet "yan duvarında" ↔ WGA "right wall of the presbytery". "Arkası" erişilen kaynaklarda yok.
3. **Duman/ışık (D4, C037):** `eser_ayrintilari.json` "Kandil ve duman" + `basyapitlar.json` "Kandilin dumanı meleklere dönüşür" ↔ kaynaklar "ışık→melek". Görsel teyit gerekli.
4. **Yahuda teşhisi (E5, C022):** data "Anlam ve semboller" bölümündeki teşhis erişilen kaynaklarda desteklenmiyor; derslerde kesin bilgi olarak kullanılmadı.
5. **İkonografik okuma farkı:** data "Tabak taşıyan kadın" (meyve dolu tabak) ↔ ICCD Ivanoff okuması (kadının kupada manna sunması, sağ ön plandaki adamın reddi, C015). İkisi farklı okumalar; ders ICCD'nin aktardığı Ivanoff okumasını A olarak, data betimini veri notu olarak verir. "Sepet ve hayvan" ICCD "Ceste; Cane; Gatto" ile uyumlu; "Saydam melekler", "Çapraz masa", "İsa'nın haresi" noktaları K5/K6/K7 ile uyumlu.
6. **Masa yönü:** data "sol alttan sağ üste" der; FU Berlin ışık bölgeleri için "sol üstten sağ alta" diyagonal verir. İkisi farklı eksenleri (masa ↔ ışık okuması) betimliyor olabilir; görsel incelenmediğinden derslerde yön dayatılmaz, "oblik/diyagonal" denir (C008).
7. **Otomatik bayrak:** `ders_kaynaklari.json` bu eser için iki kayıt "durum":"yanlis" + not "dinî yemek sahnesi; çıplak figür, mitoloji ya da şölen yok" ile işaretli (mevcut otomatik bayrak; olduğu gibi raporlandı, yorum eklenmedi).
8. **Görsel/lisans:** data "Public domain" + WGA22649.jpg Commons ile uyumlu (C033). `ikonografi.json` Q2472983→"tintoretto" (last-supper) uyumlu.
9. **DURUM.md satır 31** "Araştırılmadı" — bu dosya araştırma/üretim çıktısıdır; DURUM.md ve MUFREDAT.md değiştirilmedi.
