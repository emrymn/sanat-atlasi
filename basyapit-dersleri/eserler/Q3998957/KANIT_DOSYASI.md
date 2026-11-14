# KANIT DOSYASI — Q3998957 · Bakkhus ve Ariadne'nin Zaferi (Trionfo di Bacco e Arianna) · Annibale Carracci

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md`
**Durum:** İnsan incelemesi bekliyor.
**Araştırma brief'i:** `.qwen/tmp/parti3/Q3998957-brief.md` (kaynak-arastirma agent; ham cache `.qwen/tmp/parti3/cache/Q3998957-*`).

---

## 0. Yöntem ve kaynak hiyerarşisi

Eser bir **in situ tavan freskidir** (Galleria Farnese, Palazzo Farnese, Roma); müze nesnesi değildir, tek müze koleksiyon kaydı ve envanter numarası YOKTUR (WD P217 bulunmaz). **Birincil kaynak = binanın koruyucusu Fransa Büyükelçiliği sayfaları:** S6 "Palazzo Farnese" + S7 "Galleria dei Carracci" **canlı AÇILDI (200, 2026-11-14)**; S8 eski site schedası **Wayback 2015-02-26 arşivinden** erişildi (canlı alan adı DNS ölü). Bu sayfalar künye/kronoloji/teknik/restorasyon için **A** sağlar; ancak müze kataloğu hassasiyeti (panel ölçüsü, envanter, provenance) sunmaz → panel boyutu **E**.

İkincil akademik atıf zincirli maddeler: S2 itwiki "Affreschi della Galleria Farnese" (Ginzburg 2000/2008, Posner 1971, Martin 1965, Dempsey 1995, Bellori/Borea 2009, Panofsky, Montanari 2012, Colonna 2007 satır içi atıflı), S4 eswiki (Prater/Taschen 2005), S5 enwiki "The Loves of the Gods" (Wittkower 1985, Dempsey, Bellori/Wohl 2005, Hoving; kısmen trionfi.com). **Kitap tam metinlerine ERİŞİLMEDİ** → atıf zincirleri "metne erişilmedi" notlu (**B**, kayıt doğrulama S13–S15). Wikidata/Commons yardımcı/metadata.

**Görsel İNCELENMEDİ** (vision kotası ana oturumda); yalnız metadata + lisans + çözünürlük → kompozisyon "kaynakların betimlediği", **GZ TASLAK**.

**İhtilaflar (D):** D1 quadro reported (data ↔ S2, en güçlü), D2 koç/keçi, D3 katır/eşek, D4 tarih, D5 komisyon yılı, D6 WD P571=1586 anomalisi, D7 Ercole panel adı. **Belirsizlikler (E):** epitalamik yorum, Ovid satır, panel boyutu, görsel ayrıntılar, data üstünlüğü, ikonografi ekleri, WMF, BM detay, kitaplar, görsel. Brief'teki koşullu kip ve kuşku işaretleri AYNEN korundu: "celebrerebbe", "sarebbe stata commissionata", "Pare che", "Con ogni probabilità", "Incerto è invece se", "molto disputato", "(supposto)", "indestinct", "about 1475", "non ha avuto seguito".

## 1. Kaynak envanteri (tüm erişimler 2026-11-14)

| ID | Kurum | Belge | URL | Erişim + tarih | Tür |
|---|---|---|---|---|---|
| S1 | Wikidata | Q3998957 EntityData JSON | https://www.wikidata.org/wiki/Special:EntityData/Q3998957.json | 200 | yardımcı |
| S1b | Wikidata | wbgetentities etiketler (Q7824, Q848386, Q25631150, Q123907, Q3374376, Q19652, Q60332278, Q29940705, Q11920, Q465, Q565) | https://www.wikidata.org/w/api.php?action=wbgetentities | 200 | yardımcı |
| S2 | it.wikipedia | "Affreschi della Galleria Farnese" wikitext (115.257 kr) | https://it.wikipedia.org/w/api.php?action=parse&page=Affreschi%20della%20Galleria%20Farnese | ilk 429 → backoff 200 | ikincil (akademik atıflı) |
| S3 | it.wikipedia | "Trionfo di Bacco e Arianna" (WD sitelink = disambigua; asıl madde S2) | https://it.wikipedia.org/w/api.php?action=parse&page=Trionfo%20di%20Bacco%20e%20Arianna | 200 | yardımcı |
| S4 | es.wikipedia | "Triunfo de Baco y Ariadna" wikitext | https://es.wikipedia.org/w/api.php?action=parse&page=Triunfo%20de%20Baco%20y%20Ariadna | ilk 429 → backoff 200 | ikincil (Prater/Taschen atıflı) |
| S5 | en.wikipedia | "The Loves of the Gods" wikitext (27.721 kr; WD sitelink YOK, arama ile) | https://en.wikipedia.org/w/api.php?action=parse&page=The%20Loves%20of%20the%20Gods | 200 | ikincil (Wittkower/Dempsey/Bellori-Wohl; kısmen trionfi.com) |
| S6 | Ambasciata di Francia in Italia | "Palazzo Farnese" + kronoloji; "Publié le 20 January 2026"; etalab-2.0 | https://it.diplomatie.gouv.fr/it/node/6/palazzo-farnese | 200 (canlı) | BİRİNCİL |
| S7 | Ambasciata di Francia in Italia | "Galleria dei Carracci"; "Publié le 16 January 2026" (S6 linkinden) | https://it.diplomatie.gouv.fr/it/node/116/galleria-dei-carracci | 200 (canlı) | BİRİNCİL |
| S8 | Ambasciata di Francia (eski site) | "Galleria dei Carracci" scheda + foto galeri | canlı http://www.ambafrance-it.org/Galleria-dei-Carracci → DNS (curl 6, HTTP 000); arşiv https://web.archive.org/web/20150226062755/http://www.ambafrance-it.org/Galleria-dei-Carracci | arşiv 200 (2015-02-26) | BİRİNCİL (arşiv) |
| S9 | Wikimedia Commons | File:Rome Palazzo Farnese ceiling Carracci frescos 04.jpg imageinfo | https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo | 429,429 → 75s backoff 200 | görsel metadata |
| S10 | Web Gallery of Art | Commons credit orijinal görsel URL (yalnız HEAD) | https://www.wga.hu/art/c/carracci/annibale/farnese/farnes08.jpg | 301→https 200; image/jpeg 196.167 B; last-mod 2017-04-07 | görsel kaynak zinciri |
| S11 | British Museum | sarcophagus image gallery, objectid=1655882, museum number 1805,0703.130 | canlı 403; arşiv http://web.archive.org/web/20190717070824/http://www.britishmuseum.org/research/collection_online/collection_object_details/collection_image_gallery.aspx?partid=1&assetid=975819&objectid=1655882 | canlı 403; arşiv 200 (2019-07-17), KISMİ | birincil (arşiv, kısmi) |
| S12 | British Museum | beta_collection_object_details (S11 arşiv linki) | http://web.archive.org/web/20190717070824/https://www.britishmuseum.org/system_pages/beta_collection_introduction/beta_collection_object_details.aspx?assetId=975819001&objectId=1655882&partId=1 | 404 (arşivde yok) | erişilemedi |
| S13 | archive.org | Dempsey 1995 metadata (George Braziller) | https://archive.org/metadata/annibalecarracci0000char_h7c5 | 200 | yardımcı (kayıt doğrulama) |
| S14 | archive.org | Posner 1971 metadata (Phaidon, ISBN 0714814717) | https://archive.org/metadata/annibalecarracci0000posn | 200 | yardımcı |
| S15 | archive.org | Martin 1965 metadata (Princeton UP) | https://archive.org/metadata/farnesegallery00mart | 200 | yardımcı |
| S16 | trionfi.com | "Io Triumpe – Greeting a God" (S5 ref; akademik DEĞİL) | http://trionfi.com/0/t/01/index.php | 200 | yardımcı (hobi) |
| S17 | trionfi.com | "Lorenzo de Medici's Bacchus and Ariadne" (S5 ref; Ovid satır no YOK) | http://trionfi.com/0/gg/103/t.html | 200 | yardımcı (akademik değil) |
| S18 | World Monuments Fund | "Conserving the Carracci Gallery" proje sayfası | https://www.wmf.org/projects/carracci-gallery-palazzo-farnese ; arşiv http://web.archive.org/web/20260414191147/ | canlı+arşiv 200 ama JS kabuğu (gövde YOK) | birincil (içerik alınamadı) |

**Kaynakçada anılan, metne erişilmeyen kitaplar (uydurma yok):** Bellori *Vite* 1672 / *Argomento* 1657; Scaramuccia 1674; Lanzi 1796; Montanari *Il Barocco* 2012 (ISBN 978-88-06-20341-2); Ginzburg *La Galleria Farnese* 2008 (ISBN 978-88-370-4915-7); Colonna 2007 (ISBN 978-88-492-1259-4); Ginzburg Carignani *Annibale Carracci a Roma* 2000 (ISBN 88-7989-561-3); Dempsey 1995 (ISBN 0807613169; S13); Zapperi 1988; Briganti/Chastel/Zapperi *Gli amori degli dei* 1987; Posner 1971 (S14); Martin 1965 (S15); Wittkower 1958/1985; Mahon 1947; Bellori/Wohl çev. CUP 2005 (ISBN 0521781876, s.84); Prater "El Barroco" Taschen 2005 (ISBN 3-8228-4744-5, s.227); Cajano/Settimi 2015 (ISBN 978-2-87844-211-3).

## 2. İddia envanteri (A–E)

**C001** — Eser, Galleria Farnese tavanının merkez panosudur: Trionfo di Bacco e Arianna / The Triumph of Bacchus and Ariadne; Bakkhus-Ariadne zafer/düğün alayı. **A.** S7, S1, S5.
**C002** — Ana sanatçı Annibale Carracci (1560–1609); döngü kardeşi Agostino ile; "decorata principalmente da Annibale"; "il suo capolavoro"; S7: uzmanlar için "la più perfetta conclusione di un secolo e mezzo d'innovazioni pittoriche in Europa". **A.** S7, S8, S1, S9.
**C003** — Duvarlar büyük ölçüde allievi işi; Domenichino "Vergine con l'unicorno" freskinin yazarı. **A.** S7, S8.
**C004** — Döngü 1597–1608 (S6 kronoloji; S7; S5 infobox; WD preferred P571 P1319=1597/P1326=1608). **A.** S6, S7, S5, S1.
**C005** — Volta açılışı 2 Haziran 1601; "l'audacia degli affreschi stupisce nella Roma della Controriforma". **A.** S6.
**C006** — Teknik fresk (affresco); kurum "a fresco" açıklar. **A.** S1 (P186=Q25631150), S8, S2.
**C007** — In situ: Galleria, Palazzo Farnese, Roma; bina Fransa Büyükelçiliği + École française de Rome; müze envanter no YOK (P217 yok; müze nesnesi değil). **A.** S6, S7, S1.
**C008** — Döngü teması "Amori degli Dei"; konular Ovidius Metamorphoses'inden. **A.** S7, S8.
**C009** — Galeri dar: ~20 m uzun × 7 m geniş (S7/S8; itwiki ~6 m genişlik der, küçük fark); beşik tonoz; trompe-l'oeil sahte mimari: monokrom atlanti mermer görünür, madalyonlar bronz taklidi, "quadri riportati" tonoz üzerine yerleştirilmiş izlenimi; Raffaello (Galatea) + Michelangelo/Sistina (ignudi) homajları. **A.** S7, S8.
**C010** — Restorasyonlar: 1994 yapısal; 2013–2015 Galleria; 15 Mart 2014'ten itibaren ziyarete kapalı (12–18 ay öngörü). **A.** S6, S8.
**C011** — 1994 deneme izleri görünür: merkez freskte açık şerit (striscia chiara); giriş sağ duvar pilaster başlıklarında temizlik dereceleri; duvarlar "yaşlı" görünüm için yağ + mumla kaplı. **A.** S8.
**C012** — Komisyon: Kardinal Odoardo Farnese; S6 kronoloji 1592'de Carracci kardeşlere Bologna'dan çağrı. **A.** S6.
**C013** — Kurum epitalamik yorumu KOŞULLU kiple aktarır: S7 "sarebbe stata commissionata in vista del matrimonio di Ranuccio Farnese con Margherita Aldobrandini, nipote di papa Clemente VIII" + "celebrerebbe l'unione"; S8 "Pare che". Sembolik katman: Amore terrestre (sağ altta uzanan kadın) + Amore celeste (Ariadne/Venere). Yorumun kendisi tartışmalı (→ C018). **A (kurum sunumu).** S7, S8.
**C014** — Panel 1597–1600 arasında yapıldı, in situ (S4; Prater "El Barroco", Taschen 2005, s.227 atfı; metne erişilmedi). **B.** S4.
**C015** — Konu: corteo nuziale; çift iki arabada — Bakkhus altın araba + iki kaplan; Ariadne gümüşi araba (hayvan → C025 D); eroti, menadi, satiri, Pan, Sileno; müzik aletleri, kaplar, yiyecek sepetleri; Dionysos tiasosu (Ginzburg 2008 s.38-59 atfı). **B.** S2, S5.
**C016** — Sarhoş Silenos alayın önünde bir binek üzerinde (S5 "At the fore ... rides an ass"; S2 "Sileno ebbro ... a dorso di mulo"; binek → C026 D). **B.** S2, S5.
**C017** — Epitalamik tezin akademik tarihi: ilk Tietze 1906–07; Dempsey kararlı, Posner destekler; Ginzburg 2000 + Colonna 2007 yeniden argümante; düğün 7 Mayıs 1600; müzakereler Eylül 1599; Bellori/antik kaynaklarda iz yok. **B.** S2.
**C018** — Epitalamik yorum kesin değil: "molto disputato"/"(supposto)"; kronoloji itirazı (dekorasyon evlilik kararından önce başlamış — Briganti 1987); galeride açık Aldobrandini arması yok (Marzik 1986); Martin alternatifi (Alessandro Farnese–Maria d'Aviz 1565) "non ha avuto seguito da parte di altri studiosi"; kurum koşullu kip. **E.** S2, S7, S8. (belirsiz)
**C019** — Bellori ahlakçı okuma (Vite 1672): "il vulgare e il celeste amore" mücadelesi; anahtar dört köşe Eros/Anteros (amor profano/sacro); Anteros zafer taçlı; Trionfo = "ebbrezza, madre di ogni vizio"; S5/Wohl "Human Love Governed by Celestial Love" (Wohl çev. CUP 2005 s.84; Borea 2009 vol.I s.57-77 atfı). **B.** S2, S5.
**C020** — Panofsky: Rönesans Anteros'u ahlakileştirdi; klasik mitte Anteros = karşılıklı aşk (Eros'un tamamlayıcısı, karşıtı değil); iki kavrayış bir arada; bazı modern tarihçiler (Panofsky dahil) köşe puttolarını klasik, ahlaksız Eros/Anteros okur. **B.** S2 (Panofsky, Studi di Iconologia 1999, s.177-183).
**C021** — Dempsey (1968'den; 1995 monografi) + Posner 1971: gizli ahlak dersi yok; aşkın hedonistik/erotik kutlaması; Martin 1965 esasen Bellori'yi sürdürür; Hoving (memoir): eğlenceli Olympus kutlaması + Odoardo antikalarına homaj. **B.** S2, S5.
**C022** — Ginzburg 2000 sentezi: ruhsal/duyusal aşkın antagonizması → concordia (complementarità, ahlaki üstünlük değil); Trionfo odak: Venere Celeste (Ariadne) + Venere Terrena (sağ altta yarı çıplak uzanan kadın) aynı alayda; mutlu evlilik dileği. **B.** S2 (Ginzburg Carignani 2000 s.140-141).
**C023** — Ariadne yıldız diademi: Corona Borealis miti + Aldobrandini armasındaki yıldızlara gönderme; epitalamik metinler Margherita=Ariadne — Onorio Longhi Canzone 1600 (Colonna 2007 s.87-88 atfı). **B.** S2.
**C024** — Albertina (Viyana) hazırlık çizimi: "Con ogni probabilità" ilk proje farklı — Naxos'ta Hindistan'dan dönen Bakkhus + Theseus'un terk ettiği uyuyan Ariadne buluşması; değişim evlilik planlarıyla ilişkili olabilir (Ginzburg 2000 s.154). **B (belirsizlik ifadeleri korunarak).** S2.
**C025** — D2: Ariadne arabasını çeken hayvan: S2 "due arieti" (koç) ↔ S5 "goats" (keçi); data "keçiler/beyaz keçiler"; "beyaz" hiçbir erişilen metinde yok (görsel incelenmedi). **D.** S2, S5. (tartışma)
**C026** — D3: Silenos bineği: S2 "mulo" (katır; fresk + karton) ↔ S5 "ass" (eşek); data "eşek"; S2 BM rölyefi için de "mulo" der. **D.** S2, S5. (tartışma)
**C027** — Merkez pano quadro reported DEĞİL (S2, atıfsız paragraf): sahte mimari çerçeve tavanın ışıklı dış mekâna açılmasını (sfondamento) simüle eder; illüzyonistik pencere; alay kenarlardan "kesilir" (filin yalnız başı görünür); izleyici fragman görür. **C.** S2. (yorum; Ginzburg 2008 ile teyit gerekli)
**C028** — D1: data/basyapitlar.json merkez pano "quadro reported ... tekniğiyle yapılmış" ↔ S2 "il Trionfo non è un quadro riportato"; S6/S7 quadri riportati'yi GENEL sistem olarak anlatır, merkez pano için demez; S2 paragrafı atıfsız → Ginzburg 2008 + görsel teyit önerilir. **D.** S2, S6, S7. (tartışma)
**C029** — Modeller: Tiziano (Bacco e Arianna, Baccanale degli Andrii) + Dosso Dossi (Trionfo di Bacco in India, şimdi Mumbai); Camerini d'alabastro (Alfonso I d'Este); 1598 Ferrara devri → Pietro Aldobrandini koleksiyonu; Agucchi dostluğuyla erişim (Ginzburg 2000 s.83). **B.** S2.
**C030** — Garofalo Trionfo di Bacco (Raffaello fikrinden, 1540, Dresden Gemäldegalerie Alte Meister) — Dempsey 1995 s.44 atfı. **B.** S2.
**C031** — Giambologna rölyefi (Cosimo I atlı heykeli kaidesi; Siena'ya zafer girişi) olası kaynak — atıfsız. **C.** S2. (yorum)
**C032** — Antik lahit modeli kesin değil ("Incerto è invece se..."): Bellori tanıklığı + BM mermer mezar rölyefi (1805,0703.130) Bakkhus-Ariadne alayı; sarhoş Silenos freske çok yakın (Rausa 2002 vol.II s.243); BM detay kısmi (→ C046). **B.** S2, S11.
**C033** — Perin del Vaga çizimi (Giovanni Bernardi kaya kristali ovali, Cassetta Farnese) Silenos grubu için olası model ("potrebbe essersi rifatto") — atıfsız. **C.** S2. (yorum)
**C034** — Günümüze ulaşan tek kartonlar: Trionfo Silenos grubu parçası (Urbino, Galleria nazionale delle Marche) + Agostino kartonları (Londra National Gallery) — atıfsız. **C.** S2. (yorum)
**C035** — "Puntinata" renk serimi (ışık/gölge güçlendirir) + sık taramalar (chiaroscuro); gravür pratiğinden ödünç (iki kardeş gravür ustası) — Ginzburg Carignani 2000 s.35 atfı. **B.** S2.
**C036** — Atıfsız teknik ayrıntıları: "non poche rifiniture a secco"; spolvero/cartoni aktarımı; çok sayıda hazırlık çizimi (Louvre + Windsor en büyük); "prestezza" reddi; Bellori kil modelletti (ışık etkisi için). **C.** S2. (yorum)
**C037** — Tonoz sistemi: üç şema (friz + mimari + quadri riportati) özgün bileşimi; başlangıç friz şeması beşik tonoza yetersiz; modeller: Sistina (sahte mimari, erme-telamoni, ignudi, sahte bronz), Tibaldi Palazzo Poggi (quadri riportati + merkez sfondato + köşe Eros/Anteros en plein air), Farnesina Psike Loggia; Correggio + Venedik; olası Giulio Romano Palazzo Te (Mantova ziyareti bilinmez); quadreria → "müzeumsu" hava, antik heykellerle diyalog (Posner 1971 s.93-108; Martin 1965 s.69-82). **B.** S2.
**C038** — 13 anlatı sahnesi + sahte bronz madalyonlar (S5: 12 madalyon); merkez sıra: Pan e Diana (Trionfo solu), Trionfo, Mercurio e Paride (sağı); sahne betimleri Ginzburg 2008'den. **B.** S2, S5.
**C039** — Galeri ortamı: Via Giulia/Tiber tarafı kapalı loggia; Vignola tasarımından Giacomo Della Porta; ışık tek uzun kenar (3 pencere); nişlerde Farnese antik heykelleri (çoğu Napoli MANN); muhtemelen müzik odası (envanterlerde çalgı; Annibale gravicembali panelleri Londra NG; tematik akrabalık) — Martin 1965 s.69-82. **B.** S2.
**C040** — Kariyer dizisi: Annibale 1594 Roma'ya çağrı (Posner 1971 vol.I s.77-79); 1595 kesin hizmet; ilk plan Sala Grande (Alessandro Farnese Flanders zaferleri 1577–79) askıya → terk; ilk bezeme Camerino Farnese (Storie di Ercole + Ercole al bivio tuval); Galleria 1597 "secondo l'ipotesi più seguita". **B.** S2.
**C041** — Hoving: fresk ↔ Farnese antik heykel koleksiyonu eşleşmeleri (genel kabul); koleksiyon sarayda tematik dizili; çoğu bugün Capodimonte + Napoli MANN; S2: antik heykel alıntıları bol. **B.** S5, S2.
**C042** — Etki: geçmiş/gelecek köprüsü — Rönesans geleneği geri kazanımı + Barok dil temeli (Montanari 2012); Cortona Palazzo Barberini borçlu (Posner 1971 vol.I s.101); Bernini homajları (Wittkower 2005 s.129 n.3, s.163); S5: yeni grand manner; 17. yy Roma tuval+fresk üzerinde güçlü biçimlendirici etki (Wittkower 1985 s.57); klasisizm/Barok ikili eğilim → Sacchi↔Cortona tartışması (Accademia di San Luca, figür sayısı); kompozisyon/ifade → Sacchi, Poussin; coşkulu anlatım → Cortona. **B.** S2, S5.
**C043** — Agucchi formülü: İtalyan resim dilinin birliği — "il finissimo disegno romano con la bellezza del colorito lombardo" (Ginzburg 2000 s.13-18). **B.** S2.
**C044** — Erken alımlama: antik kaynaklarda neredeyse oybirliği övgü (Malvasia çekincesi "statuino", muhtemelen kentçilik); Bellori "rinnovossi in te il secolo d'oro della Pittura"; gravür kampanyaları: Richelieu hamiliği 1640–50 (Fransız sanatçılar); Carlo Cesi 1657 (Bellori yorumlu); Pietro Aquila 1677 (Maratta apoteoz frontispiece); XIV. Louis → Le Brun + Poussin Tuileries tam kopya (gerçekleşmedi); ikinci Fransız ekip → Galleria di Diana/Ambasciatori (1871 yangınında yok; kurtulan kopyalar Louvre) — Borea 1988, Rudolph 2002, Fonkenell 2010. **B.** S2.
**C045** — Düşüş + toparlanma: 18. yy sonu–19. yy "eklektikçilik" suçlamasıyla şan düştü; 20. yy toparlanma: Tietze 1906–07, Mahon 1947, Martin 1965, Dempsey, Posner 1971 (tüm oeuvre üzerine ilk/tek sistematik modern monografi); İtalyan: Briganti, Zapperi, Ginzburg. **B.** S2.
**C046** — BM nesne detayı erişilemedi: canlı 403 (bot); beta detay sayfası arşivde 404; elde yalnız 2019-07-17 arşivden "sarcophagus" + museum number 1805,0703.130 (KISMİ). **E.** S11, S12. (belirsiz)
**C047** — Ovid satır lokusu doğrulanamadı: S5 "Metamorphoses (VIII; lines 160–182)" → trionfi.com (S17) atfı; S17'de satır numarası YOK; Ovid metnine erişilmedi. **E.** S5, S17. (belirsiz)
**C048** — Lorenzo de' Medici karnaval şarkısı "Quest'è Bacco ed Arïanna" ("Chi vuol esser lieto, sia / di doman non c'è certezza"); tarih "indestinct", "a likely date is about 1475"; ruh paraleli (S5 → trionfi.com akademik değil; S17 Dempsey: erken tarih ~1475, Baccio Baldini gravürü). **C.** S5, S17. (yorum)
**C049** — Panel boyutu hiçbir erişilen kaynakta YOK; WD P2048/P2049 yok; yalnız oda ölçüsü (S7 ~20×7 m; S2 infobox 2014×659×980 cm, atıfsız). **E.** S1, S7, S2. (belirsiz)
**C050** — Görsel-bağımlı ayrıntılar doğrulanmadı (görsel İNCELENMEDİ): tacı uzatan putto, tef çalan menad, koşan çıplak çocuk, uzanan figürün altın sarısı örtüsü, "sıva çatlakları" (data); S8 çatlak yerine 1994 deneme "striscia chiara" izini anlatır. **E.** S9. (belirsiz)
**C051** — data "Sistina'dan sonra Roma'nın en etkili tavan resmi" üstünlüğü erişilen kaynaklarda bu biçimde YOK; S7 farklı formül: "la più perfetta conclusione di un secolo e mezzo d'innovazioni pittoriche in Europa"; S5 "powerful formative influence". **E.** S7, S5. (belirsiz)
**C052** — data/ikonografi.json "Ovidius, Dönüşümler (ayrıca Aşk Sanatı; Heroides; Catullus)": Metamorphoses temeli A (C008); Ars Amatoria/Heroides/Catullus merkez pano için bu araştırmada doğrulanmadı (enwiki Heroides'i başka paneller için anar). **E.** S7, S5. (belirsiz)
**C053** — WMF "Conserving the Carracci Gallery" (S18): canlı + arşiv JS kabuğu, gövde metni YOK; restorasyon hamiliği yalnız arama anlatısında → kanıt olarak KULLANILMADI; restorasyon olguları S6/S8'den (A). **E.** S18. (kullanılmadı)
**C054** — Kitap tam metinleri erişilmedi (Ginzburg 2000/2008, Dempsey 1995, Posner 1971, Martin 1965, Prater 2005, Bellori 1672/1657/2005, Montanari 2012, Colonna 2007, Briganti/Chastel/Zapperi 1987, Wittkower, Mahon 1947, Cajano/Settimi 2015): erişilen bibliyografyalarda anıldı; Dempsey/Posner/Martin archive.org metadata kayıt doğrulandı (S13–S15); "kaynakçada anıldı, metne erişilmedi". **E.** S13, S14, S15. (belirsiz)
**C055** — Görsel bu oturumda İNCELENMEDİ (vision kotası ana oturumda); yalnız metadata + lisans + çözünürlük; GZ TASLAK; kompozisyon kaynak betiminden. **E.** S9, S10. (belirsiz)
**C056** — PD metadata: WD P6216=Q19652 (public domain), P1001=Q60332278 (countries with 100 years pma or shorter), P459=Q29940705 (100 years or more after death); Commons PD-Art/PD-old-100-expired; Copyrighted False; AttributionRequired false. **B (metadata).** S1, S9.
**C057** — Görsel metadata: Commons "Rome Palazzo Farnese ceiling Carracci frescos 04.jpg" 3448×1753 px, 1.344.160 B, yükleme 2014-12-18; ImageDescription "The Triumph of Bacchus and Ariadne" (Q123907); DateTimeOriginal "between 1597 and 1608"; Credit Web Gallery of Art (farnes08.jpg; HEAD 301→200, image/jpeg 196.167 B, last-mod 2017-04-07; içerik incelenmedi). **B (metadata).** S9, S10.
**C058** — Diğer atölye adları (S5, atıfsız): Lanfranco, Albani, Badalocchio; Agostino 1597–1600 katıldı. **C.** S5. (yorum)
**C059** — Ercole e Iole paneli: atribüt tersine çevrimi — Ercole kadın kıyafetiyle tef çalar, Iole sopa + Nemea aslanı postu (S5: Heroides 9 + Tasso Gerusalemme 16.3 atfı; S8 aynı betim); S8: Jupiter/Junon sadık âşık çift olarak (alışılmış sadakatsiz koca/zulmeden eş yerine) — kurum ironik okuması. **B.** S5, S8.
**C060** — D7: panel adı: S2/S5 "Ercole e Iole"/"Hercules and Iole" ↔ S8 "Hercule et Onphale"; merkez panoyla ilgisiz, yalnız not. **D.** S2, S5, S8. (tartışma)
**C061** — Kurum (arşiv) işeyen putto'yu ("Puto qui urine") tonozun genel "irreverente" tonunun göstergesi olarak sunar; kardinal sarayında Kontra-Reform sonrası profan konu çağdaşları şaşırttı, istisnai kaldı. **A.** S8 (S6 "audacia" → C005).
**C062** — D4: tarih ihtilafı: data "1597–1601 (slayt altyazısı)" (zayıf) ↔ döngü 1597–1608 (S6/S7/S5/WD preferred) ↔ itwiki 1597–1606/1607 ↔ panel 1597–1600 (S4/Prater); volta açılışı 2 Haziran 1601 (S6) data'nın 1601 bitişini kısmen açıklar; WD normal P571=1586 anomalisi (→ C063). **D.** S6, S7, S2, S4, S1. (tartışma)
**C063** — D6: WD içi tutarsızlık: P571 normal=1586 (ref Q465 DBpedia) ↔ preferred=2. binyıl (precision 6) + P1319=1597/P1326=1608 (refsiz); 1586 hiçbir erişilen kaynakla desteklenmiyor. **D.** S1. (tartışma)
**C064** — D5: komisyon yılı: S6 1592 (Carracci kardeşlere çağrı) ↔ S2 1594 (Annibale Roma'ya çağrı, Posner atfı); farklı olaylar olabilir (çağrı vs geliş); kesinleştirilmedi; S2 1595 kesin hizmet. **D.** S6, S2. (tartışma)
**C065** — Palazzo Farnese inşaatı: Kardinal Alessandro Farnese (1468–1549; 13 Ekim 1534'te III. Paulus adıyla papa) isteğiyle 1513'te başladı (kronoloji 1514 Sangallo); 76 yıl (1513–1589); Sangallo il Giovane, Michelangelo, Giacomo della Porta; 1589 Della Porta cepheyi bitirdi. **A.** S6.

**Sayım:** 65 iddia · A=15 · B=26 · C=7 · D=7 · E=10.

## 3. Görsel doğrulama kaydı (Kural 6)

- S9 metadata: `File:Rome Palazzo Farnese ceiling Carracci frescos 04.jpg`, 3448×1753 px, 1.344.160 B, yükleme 2014-12-18 15:29:22; PD (PD-Art/PD-old-100-expired), Copyrighted False, AttributionRequired false; Artist Annibale Carracci (1560–1609); Credit Web Gallery of Art → farnes08.jpg (S10 HEAD 301→200, image/jpeg 196.167 B, last-mod 2017-04-07; içerik incelenmedi).
- **Görsel İNCELENMEDİ (C055 E)** — vision kotası ana oturumda. Kompozisyon S6/S7/S8 (A) + S2/S4/S5 (B) METNİNDEN. **GZ TASLAK** (gen.py gz_taslak). Görsel projeye kopyalanmadı; URL + lisans + kaynak referans.
- Görsel-bağımlı ayrıntılar (C050 E) doğrulanmadı: putto taç, tefli menad, koşan çocuk, altın sarısı örtü, çatlaklar. İnsan editör görsel teyidi ZORUNLU (özellikle D1 quadro reported, D2/D3 hayvanlar).

## 4. Kelime/süre sayımı

| Seviye | Hedef | Ölçülen |
|---|---|---|
| Başlangıç | 400–500 | 426 |
| Orta | 1300–1600 | 1425 |
| İleri | 2600–3200 | 3090 |

dogrula.py (Q3998957): **0 hata / 0 uyarı** · CJK: 0 · iddia 65 (A15/B26/C7/D7/E10) · CS10 DY5 AU5 GZ5 TK5 (quiz kanıt tümü A/B). Birincil koruyucu kurum AÇILDI (A); görsel İNCELENMEDİ (E) → GZ TASLAK. (Not: dogrula.py tüm eserleri tarar; öteki partilerin devam eden eserlerindeki hata/uyarılar bu esere ait değildir.)

## 5. Veri notları (data/ dokunulmadı; insan onayına sunulur)

1. **Tarih (D4/C062):** data "1597–1601 (slayt altyazısı)" zayıf (C); kurum döngü 1597–1608 (A), volta açılışı 2 Haziran 1601 (A), panel 1597–1600 (B/Prater). itwiki 1597–1606/1607.
2. **quadro reported (D1/C028, en güçlü):** data merkez pano "quadro reported" ↔ S2 "non è un quadro riportato"; S2 paragrafı atıfsız → Ginzburg 2008 + görsel teyit. S6/S7 quadri riportati'yi genel sistem olarak anlatır.
3. **Hayvan (D2/C025):** data "keçiler/beyaz keçiler" ↔ S2 "arieti" (koç) / S5 "goats"; "beyaz" metinlerde yok (E3/C050).
4. **Binek (D3/C026):** data "eşek" ↔ S2 "mulo" (katır) / S5 "ass" (eşek).
5. **Görsel ayrıntılar (E3/C050):** data putto taç/tefli menad/koşan çocuk/altın sarısı örtü/çatlaklar doğrulanmadı; görsel İNCELENMEDİ; S8 1994 deneme şeridi anlatır (C011).
6. **Üstünlük (E6/C051):** data "Sistina'dan sonra Roma'nın en etkili tavan resmi" formülü erişilen kaynaklarda yok; S7 "più perfetta conclusione", S5 "formative influence".
7. **İkonografi ekleri (E11/C052):** data/ikonografi.json "Aşk Sanatı; Heroides; Catullus" doğrulanmadı; Metamorphoses A (C008).
8. **WD anomalisi (D6/C063):** P571 normal=1586 (DBpedia) desteksiz; preferred 1597–1608 refsiz.
9. **eserler_onbellek:** yil:2000 ↔ tarih "1597–1601"; kaynaklar ["kurs","wikidata"] → birincil/akademik yok; S6/S7+S2 eklenmesi önerilir (uygulanmadı).
10. **eser_turleri:** "resim" → teknik "fresk" olarak hassaslaştırılabilir (WD P186=fresco); not.
11. **Küçük fark:** itwiki oda genişliği ~6 m ↔ S7/S8 7 m; kesinleştirilmedi (C009 not).
12. **Görsel (C055):** İNCELENMEDİ; GZ TASLAK; insan editör görsel teyidi zorunlu.
