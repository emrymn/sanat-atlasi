# KANIT DOSYASI — Q311243 · Sis Denizi Üzerinde Gezgin (Der Wanderer über dem Nebelmeer) · Caspar David Friedrich

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md`
**Durum:** İnsan incelemesi bekliyor.
**Araştırma brief'i:** `.qwen/tmp/parti4/Q311243-brief.md` (kaynak-arastirma agent; ham cache `.qwen/tmp/parti4/cache/`).

---

## 0. Yöntem ve kaynak hiyerarşisi

Eser bir tuvaldir (Hamburger Kunsthalle). **Birincil müze kaydı canlıda Anubis proof-of-work bot engeliyle karşılaştı (S5: HTTP 200 ama içerik yok; S7 eski sayfa: HTTP 404). Engel aşılmaya çalışılmadı; Wayback arşiv kopyaları AÇILDI: S6 (2026-11-03, snapshot 20261103204829) ve S8 (2023-10-03, snapshot 20231003143751).** Bu iki arşiv kopyası birincil kabul edildi → sanatçı/başlık+"um 1817"/Öl auf Leinwand/94,8×74,8/HK-5161/Dauerleihgabe-Stiftung-1970/imzasız-tarihsiz/Wvz 250/provenance/Grave+Bertsch denemeleri **A**. URL'ler tahmin edilmedi; WD P571/P217 referanslarından, enwiki satır içi ref/external link'ten ve Commons credit alanından bulundu (üçü aynı iki URL'ye işaret ediyor).

**Görsel İNCELENEMEDİ** (vision kotası ana oturuma ayrılmış); yalnız metadata + lisans + çözünürlük çekildi. İki Commons dosyası **Public domain**. Görselle çözülebilecek ihtilaflar (saç rengi D004) açık bırakıldı; **GZ TASLAK**.

**On üç ihtilaf (D)** ve **sekiz belirsizlik (E)** açık tutuldu. Denetim B sırasında brief'e ek bir ihtilaf bulundu: **ilk kamusal gösterim** — müze provenance not 4 "Nisan 1946 Marburg Masterpieces, erstmals öffentlich gezeigt" derken dewiki "yaz 1959 Tate" der (C071). Kitap/makale metinlerine erişilmedi; B iddiaları "atıf zinciri" notuyla verildi. transfer (Bauer/Haug 2024) yalnız landing+abstract erişildi (S13), tam metin Anubis engelli/snapshot yok.

## 1. Kaynak envanteri

| ID | Kurum | Belge | URL | Erişim (14 Kas 2026) | Tür |
|---|---|---|---|---|---|
| K1 | Hamburger Kunsthalle (Wayback) | Online-Sammlung objekt HK-5161, snapshot 2026-11-03 (20261103204829); künye + Grave/Bertsch + provenance (Stand 29.02.2024) | https://web.archive.org/web/20261103204829id_/https://online-sammlung.hamburger-kunsthalle.de/de/objekt/HK-5161 | arşiv 200 (28.243 bayt, --compressed) | birincil (arşiv) — AÇILDI |
| K2 | Hamburger Kunsthalle (Wayback) | eski sammlung-online, snapshot 2023-10-03 (20231003143751); künye + provenance (Stand 2019/2020 Haug) | https://web.archive.org/web/20231003143751id_/https://www.hamburger-kunsthalle.de/sammlung-online/caspar-david-friedrich/wanderer-ueber-dem-nebelmeer | arşiv 200 (53.900 bayt) | birincil (arşiv) — AÇILDI |
| K3 | İngilizce Vikipedi | "Wanderer Above the Sea of Fog" wikitext (action=parse, redirects=1) | https://en.wikipedia.org/w/api.php?action=parse&page=Wanderer%20Above%20the%20Sea%20of%20Fog&prop=wikitext&formatversion=2&redirects=1&format=json | 200 | ikincil |
| K4 | İtalyanca Vikipedi | "Viandante sul mare di nebbia" wikitext | https://it.wikipedia.org/w/api.php?action=parse&page=Viandante%20sul%20mare%20di%20nebbia&prop=wikitext&formatversion=2&redirects=1&format=json | 200 | ikincil |
| K5 | Almanca Vikipedi | "Der Wanderer über dem Nebelmeer" wikitext | https://de.wikipedia.org/w/api.php?action=parse&page=Der%20Wanderer%20%C3%BCber%20dem%20Nebelmeer&prop=wikitext&formatversion=2&redirects=1&format=json | 200 | ikincil |
| K6 | Wikidata | EntityData Q311243 JSON + wbgetentities labels (29 QID) | https://www.wikidata.org/wiki/Special:EntityData/Q311243.json | 200 (labels ilk 429→backoff→200) | yardımcı |
| K7 | transfer / Heidelberg UB (Wayback) | Bauer/Haug 2024 makale landing+abstract, snapshot 2026-04-14 (20260414115619); DOI + lisans | https://web.archive.org/web/20260414115619id_/https://ahnp.ub.uni-heidelberg.de/journals/transfer/article/view/108892 | arşiv 200 (6.849 bayt) | ikincil (abstract) — AÇILDI |
| K8 | Wikimedia Commons | imageinfo: File:Friedrich, Caspar David - Wanderer über dem Nebelmeer.jpg (WD P18) | https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|size|extmetadata&titles=File:Friedrich,%20Caspar%20David%20-%20Wanderer%20%C3%BCber%20dem%20Nebelmeer.jpg&format=json&formatversion=2 | 200 (Denetim B'de yeniden çekildi) | görsel metadata |
| K9 | Wikimedia Commons | imageinfo: File:Caspar David Friedrich - Wanderer above the Sea of Fog.jpeg (enwiki infobox) | https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|size|extmetadata&titles=File:Caspar%20David%20Friedrich%20-%20Wanderer%20above%20the%20Sea%20of%20Fog.jpeg&format=json&formatversion=2 | 200 (ilk 429→backoff→200) | görsel metadata |
| K10 | Hamburger Kunsthalle | Online-Sammlung HK-5161 (CANLI) | https://online-sammlung.hamburger-kunsthalle.de/de/objekt/HK-5161 | 200 ama Anubis PoW bot challenge (v1.25.0, difficulty 2); içerik yok | birincil — ENGELLİ |
| K11 | transfer / Heidelberg UB | Bauer/Haug 2024 PDF galley (CANLI) | https://ahnp.ub.uni-heidelberg.de/journals/transfer/article/view/108892/105405 | 200 ama Anubis challenge (v1.26.0, difficulty 4); tam metin yok | ikincil — ENGELLİ |

**Erişilemeyenler / notlar:** S7 canlı eski sammlung-online = **404** (ölü URL; K2 arşivi kullanıldı). transfer HTML galley (105433) Wayback'te snapshot YOK. Kitap/makale metinleri (Hofmann 2000, Koerner 1995, Grave 2012, BS/J 1973, Grote 1950, Leppien 1993, Grummt 2011, Hoch 1987/1996, Macfarlane 2003, Schmied 1995, Wolf 2012, Bertsch/Grave 2023, Met 2025, Bahners 2025, Illies 2023, Bode 2024, Jensen 1974, Hinz 1974, Prause 1968, Sumowski 1970, Geismeier 1966, Gorra 2004, Gaddis 2004, Cricco/Di Teodoro 2017, Gärtner/Ehringhaus 2011, Arts Council 1959) **kaynakçada anıldı, metne erişilmedi**; ISBN/DOI/sayfa yalnız erişilen wikitext/katalog metinlerinden alındı, bağımsız doğrulanmadı. enwiki Scholastic ref URL bozuk (E006). Nietzsche-Studien DOI (Idrobo 2012) yorum satırında, kullanılmadı (E011). K1 ilk id_ indirmesi sıkıştırılmış gövde döndürdü; `--compressed` ile geçerli HTML alındı (cache'te -rw.html yedek).

## 2. İddia envanteri (A–E)

### A — birincil müze kaydı (K1/K2; arşivden erişildi)

**C001** — Sanatçı Caspar David Friedrich (Greifswald 1774 – 1840 Dresden). **A.** K1, K2.
**C002** — Müze kataloğundaki başlık ve tarih: "Wanderer über dem Nebelmeer, um 1817". **A.** K1, K2.
**C003** — Malzeme: Öl auf Leinwand (tuval üzerine yağlıboya). **A.** K1, K2.
**C004** — Boyut: 94,8 × 74,8 cm (Bild); çerçeve 119,5 × 99,5 cm (Rahmen). **A.** K1, K2.
**C005** — Envanter numarası HK-5161. **A.** K1, K2.
**C006** — Sammlung: 19. Jahrhundert; Standort: "Ausgestellt in der Sammlung" (sergileniyor). **A.** K1.
**C007** — Mülkiyet Stiftung Hamburger Kunstsammlungen'da; Aralık 1970'te edinildi; Kunsthalle'de Dauerleihgabe (sürekli ödünç). **A.** K1, K2.
**C008** — Eser imzasız ve tarihsiz; "Die Datierung ist nicht gesichert." **A.** K1.
**C009** — Werkverzeichnis: Börsch-Supan/Jähnig 250. **A.** K1.
**C010** — Provenance zinciri 1938–1970 (muğlaklıklar korunarak): Galerie Dr. Wilhelm August Luz, Berlin "spätestens Juli 1938 bis vermutl. Oktober 1938"; Ernst Henke, Essen "vermutl. Oktober 1938"; Müttefiklerce el koyma 1945; CCP Marburg 4.6.1945 (MAR 1024, "German about 1810 C. D. Friedrich?"); Nisan 1946 Marburg "Masterpieces" sergisi; CCP Wiesbaden 6.6.1946; İngiliz MFA&A Düsseldorf 9.9.1947; Henke'ye iade "vermutlich August 1948"; Luz 1949; "Privatsammlung Bielefeld, spätestens 1957"; Paul Herzogenrath (†1961); Hugo Oberwelland (Storck), Halle (Westf.) ?–1970; Kunsthaus Bühler Stuttgart Aralık 1970 (Oberwelland için aracılık); Stiftung satınalma Aralık 1970. Jähnig 16.7.1938 mektubu "eigenhändige bedeutende Arbeit von C. D. Friedrich"; Friedrich↔Carus atıf tartışması. Henke: hukukçu, RWE direktörü, Folkwang-Museums-Verein başkanı 1959–1969, Nolde/Beckmann koleksiyoncusu. **A.** K1.
**C011** — 1947'de CCP Wiesbaden "Deutsche Malerei des 19. Jahrhunderts" sergisinde eser Nr. 9 olarak **Carl Gustav Carus** adına, "Wanderer am Abgrund" başlığıyla listelendi. **A.** K1.
**C012** — Provenance araştırma durumu: "in Bearbeitung (die mit # markierten Stellen sind noch zu ergänzen), ungeklärt, bedenklich" (Bauer/Haug, son güncelleme 29.02.2024); Deutsches Zentrum Kulturgutverluste Magdeburg destekli proje. **A.** K1, K2.
**C013** — 1970 satınalma bedeli 600.000 DM; Bühler faturası (9.12.1970) "im Namen und für Rechnung von Herrn Hugo Oberwelland, Halle (Westfalen)". **A.** K1, K2.
**C014** — BS/J 1973'ün "1950, Bielefeld, Slg. Dr. Oetker" iddiası müzenin 2011 araştırmasında doğrulanamadı (Dr. Monika Bachtler, Kunstsammlung Rudolf-August Oetker GmbH). **A.** K1, K2.
**C015** — Müze: eser bugün Romantizm'in simgesi (Inbegriff der Romantik); Friedrich'in en çok reproduksiyonlanan eseri; sosyal ağlar çağında yeni boyut. **A.** K1.
**C016** — Grave: Friedrich'in az sayıdaki dikey formatından (Hochformat) biri; tek figürün bu denli büyük ve merkezde olması nadir; özdeşleşmeden çok "Reflexion des Sehens" (görme eyleminin refleksi); figürün durduğu yer izleyici için kolay ulaşılır değil, neye baktığı saklı; iki katmanlı kurgu, Gegenlicht, Goldener Schnitt göz hizası. **A.** K1.
**C017** — Bertsch: figürün kimliği için "hiçbir güvenilir işaret yok"; Friedrich'in en prominent Rückenfigur'ü; giysi "Städter" (kentli); romantik topoi: Gipfelerlebnis, doğayla bir olma, yalnızlık, görmenin öznel koşulları; Mittelsenkrechte figürle vurgulanır, iki yandan merkeze alçalan yamaçlar figüre yönelir. (in: Ausst.-Kat. Hamburger Kunsthalle, Berlin 2023, S. 196f.) **A.** K1.
**C018** — Manzara kurgusal montaj: kaya kaidesi 3 Haziran 1813 Kaiserkrone çıkışı çiziminden; sol arka koni dağ Mayıs 1808 Rosenberg etüdünden; sol orta plan Gamrig (Rathen doğusu) 1808 çiziminden ("geringfügig modifizierte"); çizim kenar notu "so hoch über die höchste Spitze des Steines ist der Horizont". **A.** K1.
**C019** — Müze fotoğraf kredisi: Elke Walford; SHK/Hamburger Kunsthalle/ARTOTHEK (eski sayfada bpk). **A.** K1, K2.

### B — ikincil / satır içi akademik atıf zinciri (kitap/makale metinlerine ERİŞİLMEDİ; K7 abstract hariç)

**C020** — Literatürde tarih genellikle 1818 (circa); bazı kaynaklar 1817 der. **B.** K3, K5, K6.
**C021** — Tarihleme tarihi: Grote 1950 "1815"; Geismeier 1966 "um 1820"; Sumowski 1970 "vor 1818"; BS/J 1973 "am ehesten um 1818"; Leppien 1993 Kunsthalle için "um 1817" (Carus'un atölyede 1817/1818'de görmesi argümanı); 2006/07 "Die Erfindung der Romantik" sergisi "um 1818"; Stiftung "um 1817" (Mart 2015), 1970 alımı "um 1815" temelinde. **B.** K5.
**C022** — "Der Wanderer über dem Nebelmeer" başlığı ancak 1950'de, resmin yeniden keşfinden sonra oluştu (Grote 1950; Leppien 1993). **B.** K5.
**C023** — dewiki'ye göre ilk kamusal gösterim: Yaz 1959 Tate Gallery, "Lent from a private collection", "Mountaineer in a misty Landscape" başlığıyla (→ C071 ihtilafı). **B.** K5, K3.
**C024** — Rückenfigur: Friedrich bu motifi sık ve ısrarla kullandı (ör. Der Mönch am Meer 1810, Frau vor der untergehenden Sonne 1817, Woman at a Window, Two Men by the Sea at Moonrise, Neubrandenburg; 1807'den beri sistemli gelişim); Wanderer "perhaps the most famous Rückenfigur in art" / "die bekannteste Rückenfigur des Malers" ("perhaps" korunur; A desteği C017). **B.** K3, K5.
**C025** — Peyzaj "sublime" (yüce) olarak yorumlanır (müze denemelerinde "sublime" geçmez; C017 topoi listesi A düzeyinde). **B.** K3, K4.
**C026** — Öz-refleksiyon / hayat yolunu tefekkür amblemi yorumu (Gorra 2004; Gaddis 2004). **B.** K3, K4.
**C027** — Kimlik hipotezleri (hepsi muğlak): itwiki "vi sarebbe" Saksonyalı Oberst Friedrich Gotthard von den Brinken (ölmüş dost, anma resmi); Grote Goethe olabilir ("könnte") / freiwilliger Jäger üniforması, Befreiungskriege (1813–15) falleni; Jähnig notu "Herr von Brincken" → Friedrich Ernst (†1797) / Friedrich Gotthard (†1802); Bode 2024 Julius von den Brinken (1789–1846) "vermutet"; De Rycke FAZ 2023 portre tarihsiz/imzasız; BS/J Gedächtnisbild + Gottebenbildlichkeit; Neidhardt kimlik arayışı "müßig und indezent" + "zirvedeki insan = uçurumdaki insan" (A karşıtı: C017). **B.** K3, K4, K5.
**C028** — Giysi yorumları: Altdeutsche Tracht (politik okuma, Wolf/Koerner) / Jäger üniforması (Koerner) / "urbanite" (Bertsch, Met 2025) / Forstrock (Bode 2024). (A: C017 "Städter"; → C055.) **B.** K3, K5.
**C029** — Eser, Friedrich'in Alman liberal-milliyetçi duygusunun ifadesi olarak yorumlanır; Hofmann, Wanderer'i Delacroix "Halka Yol Gösteren Özgürlük" ile karşılaştırır (Wanderer açık uçlu/sorgulayıcı, Delacroix eylemde emin; Alman↔Fransız milliyetçiliği farkı). **B.** K3.
**C030** — 1817: Carus ve Dahl ile dostluk; Ocak 1818: Caroline Brommer ile evlilik; Greifswald balayı. **B.** K3.
**C031** — Carus'un "Ruhe des Pilgers" (1818) tablosu Wanderer'in parafrazı (Prause 1968, Nr.415). **B.** K5.
**C032** — Topografya: sağda Zirkelstein; solda "could be either the Rosenberg or the Kaltenberg"; Gamrig (Rathen); Kaiserkrone; Wolfsberg (Krippen) bakışı (A: C018). **B.** K3, K5.
**C033** — Üç ana eskiz: "Felsige Kuppe" 3.6.1813 (Krippener Skizzenbuch; defter dağıtılmış, cilt yok); "Felsformation im Elbsandsteingebirge" 13.5.1808 (Gamrig/Rathen); "Landschaftsstudien" 9./12.5.1808 (dördüncü etüd; Rosenberg/Prebischtor platosu). Grummt 2011 + Hoch referanslı. **B.** K5.
**C034** — Friedrich sözü: "Schließe dein leibliches Auge, damit du mit dem geistigen Auge zuerst siehest dein Bild. …" (Hinz 1974, S.92). **B.** K5.
**C035** — Friedrich sis sözü: "When a region cloaks itself in mist, it appears larger and more sublime, elevating the imagination, and rousing the expectations like a veiled girl." (Hofmann 2000 s.33). **B.** K3.
**C036** — Börsch-Supan: "It is harder to imagine this landscape without a figure than it is in any other painting." (çift zincir: BS 2005 s.116 → Grave 2012 s.203). **B.** K3.
**C037** — Macfarlane: "archetypical image of the mountain-climbing visionary"; dağcılık vizyonerliğinin arketipi (2003, s.157). **B.** K3.
**C038** — Schmied: Wanderer, Magritte sürrealizminin öncüsü (ince uyumsuzluklar, olanaksız perspektifler; arka plan ön plana "dalıyor", derinlik belirsiz — Hofmann) (1995, s.41). **B.** K3.
**C039** — Resepsiyon: hemen başyapıt sayılmadı; 20. yy'da itibar arttı (Clark, Brion); Jensen 1974 olumsuz: "muss als künstlerisch misslungen angesehen werden" (figür doğayla "tuhaf yanlış anlaşılmada", açık-koyu kontrastı yerinden edilmiş gösterir). **B.** K3, K5.
**C040** — Atıf eleştirisi: Bahners (Kunstchronik 78/2025, s.541–560) atıf ve tarihlemeyi "problematisch" değerlendirir; kunsttechnologische Untersuchung henüz yapılmadı; Illies 2023 s.227; Piegsa ZEIT 45/2023; çoğunluk görüşü hâlâ Friedrich ("gilt … weiterhin überwiegend als Werk von C. D. Friedrich"). DOI 10.11588/kc.2025.8.112261 wikitext'ten, bağımsız doğrulanmadı. **B.** K5.
**C041** — Bauer/Haug 2024 (peer-review, transfer 3, S.19–35): provenance boşluğu ~120 yıl, "from 1813/1817 to 1938"; eser "undated and unsigned … attributed to Caspar David Friedrich"; atıf sorunu araştırmanın merkezinde. DOI 10.48640/tf.2024.1.108892 (K1+K7). Lisans CC BY-SA 4.0. **Yalnız landing+abstract erişildi (K7); tam metin erişilmedi.** **B.** K7.
**C042** — NS bağlamı: Luz, 1937'den itibaren Reichskammer der bildenden Künste'de Yahudi mülkü sanat eserleri bilirkişisi (Judenvermögensabgabe); Gärtner/Ehringhaus 2011 araştırması (A desteği: C012 "bedenklich" + DZK projesi). **B.** K5.
**C043** — 1970 alımında "buchhalterisch" aracı: Kurt A. Körber satın aldı, Stiftung borç senedini yıllar sonra devraldı (Hamburger Abendblatt 9.12.1970, 3.1.2011; DIE ZEIT 19.3.1971). **B.** K5.
**C044** — Popüler kültür (ref'li örnekler): Dover Frankenstein kapağı; Stewart Lee "Content Provider" (2019); Spiegel 19/1995 (kentli dağcı + felaket imgeleri, "trivial-ikone"); DG 1974 Wanderer-Fantasie kapağı; 2011 55-cent "Deutsche Malerei" pulu; Minecraft tablo bloğu; Vik Muniz "Wanderer Above The Sea of Ashes" (1999, NGA); Stern 8.10.2015 kapağı; 2025 müzikal (Silbermond, Comödie Dresden). **B.** K3, K5.
**C068** — Kayıp "Der Adler über dem Nebelmeer" yağlıboya: Schubert 1806'da Friedrich atölyesinde gördü, 1855 anılarında "o zamanın vatan tarihinin bir imgesi" diye andı; Nemitz 1938'de anar; sonraki başlık seçimine olası ilham ("möglicherweise"). **B.** K5.
**C069** — dewiki "Kritik der Echtheit" bağlamı: resim atfedilen tarihinden ~120 yıl sonra, Nemitz 1938'in kayıp "Der Adler"i anmasından kısa süre sonra başlıksız piyasaya çıktı ("marktfrisch"); 1931 Glaspalast yangını (3000+ resim) + 1937 "Entartete Kunst" el koymaları völkisch-romantik nesnelere talebi arzdan büyük hale getirdi. **B.** K5.
**C070** — Koerner Genesis 2:6 sis hipotezi: Carus, Luther İncili "Aber ein Nebel ging auf von der Erde und feuchtete alles Land" ifadesinde sisin Yaratılış'ta Tanrı'nın yardımcısı olduğunu savunur; Koerner, Carus ile Friedrich'in bunu tartışmış olabileceğini ve Wanderer'in Yaratılış benzeri bir sahne olabileceğini hipotez eder. (yorum) **B.** K3.

### C — yorum / zayıf web kaynağı

**C045** — itwiki palet/teknik betimi: sis için "mavi, gri, pembe, sarı" ışıldayan karışım; kayalar için opak tonlar; "pennellata molto liquida, quasi vaporosa"; ışık kayaları alttan aydınlatır gibi (Artble.com web ref — zayıf). **C.** K4. (yorum)
**C046** — enwiki: figürün self-portre olabileceği önerisi, "red hair" benzerliği (drawpaintacademy.com — zayıf web; → C051). **C.** K3. (yorum)
**C047** — itwiki "homo viator" / ruhsal hac yolculuğu okuması; Castellotti alıntısı (Leotta s.86; academia.edu Lunaria s.8–9 — zayıf/zincir); "humilitas"/Sonsuz okuması. **C.** K4. (yorum)

### D — kaynaklar arası ihtilaflar

**C048** — Tarih ihtilafı (D001): müze "um 1817" + "Die Datierung ist nicht gesichert" ↔ WD P571=1818 (precision=yıl, P1480=circa) ↔ enwiki c.1818 ("some sources indicate 1817") ↔ itwiki 1818 (muğlaklıksız) ↔ dewiki um 1818 ↔ data 1818. WD'nin P571 referansı "um 1817" başlıklı müze sayfasına işaret eder → kendi kaynağıyla çelişir. Literatür aralığı 1815–um 1820. **D.** K1, K2, K3, K4, K5, K6. (tartışma)
**C049** — Yükseklik ihtilafı (D002): WD P2048=67 cm ↔ müze/en/de 94,8 cm ↔ itwiki 98,4 cm (Cricco/Di Teodoro 2017 s.79; kitaba erişilmedi, olası basım hatası kesin değil). Genişlik 74,8 cm tümünde aynı. BÜYÜK fark, çözülmedi. **D.** K1, K2, K3, K4, K5, K6. (tartışma)
**C050** — Envanter ihtilafı (D003): WD P217="HK-516167" ↔ müze "HK-5161"; WD'nin kendi P217 ref URL'si de HK-5161. **D.** K1, K2, K6. (tartışma)
**C051** — Saç rengi ihtilafı (D004): WD P180 "blond hair" + dewiki "lockiges, blondes Haar" ↔ enwiki "red hair" + itwiki "capelli rossi e scompigliati al vento". Görsel İNCELENMEDİ; çözülmedi. data "açık renkli saçlar" (blond tarafı). **D.** K3, K4, K5, K6. (tartışma)
**C052** — Provenance başlangıcı ihtilafı (D005): enwiki "by 1939 … Luz" ↔ müze "spätestens Juli 1938 bis vermutl. Oktober 1938". Satış bedeli/tarihi müze içinde de çelişkili: Henke kartı "Oktober 1938 für 60.000 Reichsmark" ↔ Luz anısı "1939 für 80.000 Reichsmark" (31.03.1948 mektubu). **D.** K1, K3. (tartışma)
**C053** — Mülkiyet ifadesi ihtilafı (D006): enwiki "acquired by the Hamburger Kunsthalle in 1970" ↔ müze Stiftung satın aldı/Dauerleihgabe ↔ Körber köprüsü ↔ Bühler faturası Oberwelland "adına ve hesabına". **D.** K1, K2, K3, K5. (tartışma)
**C054** — Oetker sahipliği ihtilafı (D007): dewiki "dann in der Familiensammlung Oetker, Bielefeld" (kesin) ↔ müze 2011 araştırması doğrulayamadı (C014). **D.** K2, K5. (tartışma)
**C055** — Giysi ihtilafı (D008): Altdeutsche Tracht ↔ Jäger üniforması ↔ Städter (A) ↔ Forstrock. Yorum ihtilafı; kesinleştirme yok. **D.** K1, K3, K5. (tartışma)
**C056** — Hoch 1987 bibliyografya ihtilafı (D009): enwiki "Kohlhammer Verlag" ISBN 978-3-17-009406-2 ↔ itwiki ISBN 978-3-364-00029-9 ↔ dewiki "Verlag der Kunst, Dresden 1987"; Hoch 1996 ayrı eser (ISBN 978-3-364-00368-9). Kitaplara erişilmedi; hangisi doğru çözülemedi. **D.** K3, K4, K5. (tartışma)
**C057** — enwiki 2006 katalog atfı bozuk (D010): "Die Underling der Romantic in Essen ind Hamburg, Firmer Verlag, München (December 2006), page 267" ↔ dewiki "Caspar David Friedrich Die Erfindung der Romantik … Hirmer Verlag, München (Dezember 2006), S. 267". Aynı sayfa; enwiki künyesi yazım bozuk. Katalog metnine erişilmedi. **D.** K3, K5. (tartışma)
**C058** — Resepsiyon zamanlaması ihtilafı (D011, enwiki içi): lead "early 20th century, and in particular during the 1970s" ↔ Reception "mid-20th century". **D.** K3. (tartışma)
**C059** — İzleyici özdeşleşmesi ihtilafı (D012): data/eser_notlari + itwiki "l'osservatore si immedesima" ↔ Grave (müze) "dürfte es Friedrich nicht vorrangig um eine solche Identifikation gegangen sein … Reflexion des Sehens". Yaygın yorum ↔ müze yayını nüansı; kesinleştirilmez. **D.** K1, K4. (tartışma)
**C071** — İlk kamusal gösterim ihtilafı (Denetim B'de yeni bulundu): dewiki "yaz 1959 Tate, erstmals der Öffentlichkeit präsentiert" ↔ müze provenance not 4 "Nisan 1946 Marburg Hessisches Staatsarchiv 'Masterpieces', erstmals öffentlich gezeigt". **D.** K1, K5. (tartışma)

### E — belirsizlikler (kaynaktaki muğlaklık AYNEN korunur)

**C060** — WD P180 depicts refsiz öğeler (E008): man, mountain, rock, trousers, frock coat, walking stick, gaze, back, blond hair, hiking, sea of clouds, sky, aerial perspective, mist, Wanderlust, strolling — S1'de referans yok; "Wanderlust"/"strolling"/"gaze" müze metinlerinde yok; "blond hair" → C051. **E.** K6. (belirsiz)
**C061** — Atıf (authorship) belirsiz (E002): imzasız/tarihsiz; 1947 CCP'de Carus olarak sergilendi; "attributed to Caspar David Friedrich"; Bahners "problematisch" + kunsttechnologische Untersuchung ausstehend; çoğunluk görüşü hâlâ Friedrich. **E.** K1, K5, K7. (belirsiz)
**C062** — Figürün kimliği bilinmiyor (E003): "Es existieren keinerlei verlässliche Indizien…" (Bertsch); hipotezler muğlak: "vi sarebbe", "könnte", "vermutet", "some have suggested". **E.** K1, K3, K4, K5. (belirsiz)
**C063** — Provenance boşlukları (E004): 1813/1817–1938 arası bilinmiyor; "Bislang unbekannte Provenienz/en"; "angeblich kurz vor 1.9.1939", "spätestens", "vermutl.", "?" işaretleri; durum "ungeklärt, bedenklich". **E.** K1, K2, K7. (belirsiz)
**C064** — Sol arka dağ belirsiz (E005): "could be either the Rosenberg or the Kaltenberg"; müze Bertsch Mayıs 1808 Rosenberg etüdünü kaynak gösterir (daha spesifik, yine de montaj). **E.** K1, K3, K5. (belirsiz)
**C065** — enwiki Friedrich alıntısı doğrulanamadı (E006): "The artist should paint not only what he has in front of him but also what he sees inside himself." — ref URL bozuk ("http://www/art.scholastic.com/…", malformed; çekilmedi). **E.** K3. (belirsiz)
**C066** — Görsel bu oturumda İNCELENEMEDİ (vision kotası ana oturumda); iki Commons dosyası Public domain; GZ TASLAK; kompozisyon "kaynakların betimlediği". **E.** K8, K9. (belirsiz)
**C067** — Kitap/makale metinlerine erişilmedi (atıf zinciri); transfer tam metni erişilmedi (yalnız landing+abstract, K7); Bahners DOI bağımsız doğrulanmadı; Nietzsche-Studien DOI (Idrobo 2012) yorum satırında, kullanılmadı (E010/E011). **E.** K3, K4, K5, K7, K11. (belirsiz)

**Sayım:** 71 iddia · A=19 · B=28 · C=3 · D=13 · E=8.

## 3. Görsel doğrulama kaydı (Kural 6)

- **Görsel İNCELENEMEDİ** (vision kotası ana oturuma ayrılmış); yalnız metadata + lisans + çözünürlük. **C066 (E); GZ TASLAK.**
- **Dosya 1 (K8, WD P18):** `File:Friedrich, Caspar David - Wanderer über dem Nebelmeer.jpg` — **1962 × 2500 px**, 1.633.600 bayt; **Public domain** (LicenseShortName + UsageTerms; AttributionRequired false); Artist Caspar David Friedrich; Credit = müze URL'si (https://online-sammlung.hamburger-kunsthalle.de/de/objekt/HK-5161, birincil zincir); DateTimeOriginal "1818" (müze "um 1817" → C048); ImageDescription: "The hiker stands as a back figure in the center of the composition. He looks down on an almost impenetrable sea of fog in the midst of a rocky landscape - a metaphor for life as an ominous journey into the unknown." URL: https://upload.wikimedia.org/wikipedia/commons/1/1e/Friedrich%2C_Caspar_David_-_Wanderer_%C3%BCber_dem_Nebelmeer.jpg
- **Dosya 2 (K9, enwiki infobox):** `File:Caspar David Friedrich - Wanderer above the Sea of Fog.jpeg` — **5256 × 6742 px**, 31.235.405 bayt; **Public domain**; DateTimeOriginal "1818"; Credit = **tiqets.com ticari bilet sitesi (zayıf kredi zinciri)** → Dosya 1'in müze kredisi tercih edilir.
- **WD lisans (K6):** P6216=Q19652 (public domain); P459=Q29940705 ("100 years or more after death of author(s)"); P1001=Q60332278 ("countries with 100 years pma or shorter"). Friedrich 1840'ta öldü (>100 yıl).
- **Müze fotoğraf kredisi (K1/K2):** Elke Walford; SHK/Hamburger Kunsthalle/ARTOTHEK (eski: bpk). Müze sayfası fotoğraf için telif beyan eder; Commons reproduksiyonu PD işaretli — fark olgusal not olarak kaydedildi (hukuki yorum yapılmadı).
- **data:** eser_ayrintilari.json `gorsel: "849127cc0c76ca35"` (yerel asset hash; Commons dosyalarıyla eşleşmesi doğrulanmadı).
- Görsel projeye kopyalanmadı; derslerde URL + lisans + kaynak referans. Saç rengi (C051) gibi görselle çözülebilecek ihtilaflar açık.

## 4. Kelime/süre sayımı

| Seviye | Hedef | Ölçülen |
|---|---|---|
| Başlangıç | 400–500 | 412 |
| Orta | 1300–1600 | 1355 |
| İleri | 2600–3200 | 2681 |

dogrula.py: Q311243 için **0 hata / 0 uyarı** (kelime aralıkta, quiz kanıt A/B, 12 bölüm, sayım tutarlı, CJK 0) · iddia 71 (A19/B28/C3/D13/E8). Birincil müze kaydı arşivden AÇILDI (A); canlı Anubis/404 engelli; görsel İNCELENEMEDİ (E). (Genel dogrula çıktısındaki öteki hata/uyarılar başka, eksik dosyalı eserlere aittir; Q311243 kapsamı dışıdır.)

## 5. Veri notları (data/ DEĞİŞTİRİLMEDİ — salt-okunur; insan onayına sunulur)

1. **Tarih:** harita.json `yil` / basyapitlar.json `tarih` / ders_kaynaklari.json `gor[0].yil` = "1818" (muğlaklıksız) ↔ müze "um 1817" + "Die Datierung ist nicht gesichert" (C048/E). data'da kesin yıl gösterimi birincil kayıtla uyuşmuyor; circa korunmalı.
2. **Özgün ad:** harita.json `eser_ozgun` / basyapitlar.json `ozgun` = "Bulutların Üzerinde Yolculuk" — bu **trwiki başlığı** (WD trwiki sitelink); özgün Almanca başlık "Der Wanderer über dem Nebelmeer". "Özgün ad" alanı semantik olarak hatalı doldurulmuş (çeviri başlık özgün ad yerinde). Düzeltme önerilmez; yalnızca not.
3. **Yükseklik:** data/wiki 94,8 ↔ WD 67 ↔ itwiki 98,4 (C049); müze birincil 94,8 esas. BÜYÜK fark, çözülmedi.
4. **Envanter:** WD "HK-516167" ↔ müze/data "HK-5161" (C050).
5. **İzleyici özdeşleşmesi:** eser_notlari.json "Rückenfigur tekniğiyle izleyiciyi manzaraya ortak eder" ↔ Grave "Reflexion des Sehens" (C059); nüans notu.
6. **Uyumlu alanlar:** harita_motifler.json "manzara gerçek bir yer değildir … farklı tepeleri bir araya getirmiştir" (C018 ✓); "giysisi … üniformasına benzediği için anma resmi olduğu da düşünülmüştür" (C027/C028, muğlak ✓); eser_ayrintilari "açık renkli saçlar" (C051 blond tarafı), "Figürün gerçek bir kişi olup olmadığı tartışmalıdır" (C062 ✓); eser_adlari_tr "Sis Denizi Üzerinde Gezgin (Der Wanderer über dem Nebelmeer)" ✓; sanatcilar.json 1774/1840 ✓.
7. **Görsel:** İNCELENEMEDİ (C066); GZ TASLAK; yerel hash `849127cc0c76ca35` Commons eşleşmesi doğrulanmadı; insan editör zorunlu.
8. **Yeni ihtilaf (Denetim B):** ilk kamusal gösterim — müze not 4 Nisan 1946 Marburg ↔ dewiki yaz 1959 Tate (C071). data'da bu alan yok; insan incelemesine not.
