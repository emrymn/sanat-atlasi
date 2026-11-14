# KANIT DOSYASI — Q1065493 · Ophelia · Sir John Everett Millais, Bt

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md`
**Durum:** İnsan incelemesi bekliyor.
**Araştırma brief'i:** `.qwen/tmp/parti5/Q1065493-brief.md` (kaynak-arastirma agent; ham cache `.qwen/tmp/parti5/Q1065493-*`).

---

## 0. Yöntem ve kaynak hiyerarşisi

Eser bir tuval üzerine yağlı boyadır (Tate Britain, Londra; envanter N01506). **Birincil Tate kaydı AÇILDI:** "The Story of Ophelia" sayfası canlı tam metin (S5, HTTP 200) ve katalog künyesi Wayback arşivi (S6, 2022-05-12, HTTP 200) üzerinden doğrulandı. Canlı katalog sayfası (S4) JS kabuğu döndürür (yalnız title/meta sunucu tarafında; Medium/Dimensions/Reference/Acquisition alanları HTML'de yok) → tam künye S6 arşivinden alındı. URL tahmin edilmedi: S4/S5 adresi S2 satır içi ref'inden ve S1 P854/P973 alanlarından bulundu; S7 Commons credit alanı Tate Images N01506'yı doğruluyor.

**Birincil Tate (S5/S6) → A:** sanatçı/başlık/tarih 1851–2, teknik, boyut, koleksiyon/envanter, edinim (Henry Tate Gift 1894), konu (Hamlet IV.vii), iki aşamalı üretim (Hogsmill/Ewell + Gower Street), manzaranın önce boyanması, model Elizabeth Siddal, küvet/lamba, elbise (4 sterlin, Combe mektubu), Roberson tuvali (7 Haziran 1851, 15 şilin), astar (kurşun beyaz + çinko beyaz), pigment listesi, konservasyon (raking/IR/UV/X-ray, 1967 relining), çiçek sembolizmi, provenance (Farrer→Windus→Graves→Gambart→Fuller Maitland→Henry Tate), sergileme tarihi, tarihsel National Gallery mülkiyeti, hazırlık eskizleri.

**İkincil (S2 enwiki / S3 itwiki) → B/C:** Ruskin (James 1947 p.176 atıf zinciri), Dalí (Minotaure 8, 1936 atıf zinciri), alımlama (film/video/kapak, basın atıf zincirli), su sıçanı (Telegraph), değerleme (2007 Telegraph), Sōseki (Peterson/Williams kitap atıf zinciri). Refsiz giriş/WD kalemleri → C. **Görsel İNCELENEMEDİ** (vision kotası ana oturumda); yalnız metadata + lisans + çözünürlük (S7); GZ TASLAK.

**12 ihtilaf (D, C037–C048)** ve **belirsizlikler (E)** brief'teki D1–D12 / E1–E12'den korunmuştur; circa / "is thought to" / "may signify" / "so the tale goes" / "It is possible" gibi kuşku ifadeleri AYNEN taşınır, kesinleştirilmez.

## 1. Kaynak envanteri

| ID | Kurum | Belge | URL | Erişim (14 Kas 2026) | Tür |
|---|---|---|---|---|---|
| S1 | Wikidata | EntityData Q1065493 | https://www.wikidata.org/wiki/Special:EntityData/Q1065493.json | 200 | yardımcı |
| S2 | Wikipedia EN | "Ophelia (Millais)" wikitext (pageid 1375780) | https://en.wikipedia.org/w/api.php?action=parse&page=Ophelia%20(Millais)&prop=wikitext&formatversion=2&redirects=1 | 200 (wikitext) | ikincil |
| S3 | Wikipedia IT | "Ophelia (Millais)" wikitext (pageid 3582983) | https://it.wikipedia.org/w/api.php?action=parse&page=Ophelia%20(Millais)&prop=wikitext&formatversion=2&redirects=1 | 429 → ~60 sn backoff → 200 | ikincil |
| S4 | Tate | Katalog sayfası (CANLI; JS kabuğu, yalnız meta) | https://www.tate.org.uk/art/artworks/millais-ophelia-n01506 | 200; katalog gövdesi yok | birincil (kısmi) |
| S5 | Tate | "The Story of Ophelia" (CANLI, tam metin) | https://www.tate.org.uk/art/artworks/millais-ophelia-n01506/story-ophelia | 200 | birincil |
| S6 | Tate (Wayback) | Katalog arşivi — tam künye + summary (Terry Riggs, Feb 1998) + display caption (Mar 2022) | https://web.archive.org/web/20220512143540/https://www.tate.org.uk/art/artworks/millais-ophelia-n01506 | 200; ARŞİV 2022-05-12 14:35:40 | birincil (arşiv) |
| S7 | Commons | imageinfo (url/size/extmetadata) | https://commons.wikimedia.org/w/api.php?action=query&titles=File%3AJohn%20Everett%20Millais%20-%20Ophelia%20-%20Google%20Art%20Project.jpg&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata | 200 | görsel |
| S8 | Wikidata | wbgetentities labels (42 QID, en/tr) | https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q1065493&props=labels&languages=en%7Ctr | 200 | yardımcı |
| S9 | Tate (Wayback) | "Ophelia learning resource" dizin arşivi (canlı URL ölü) | https://web.archive.org/web/20170824043836/http://www.tate.org.uk/learn/online-resources/ophelia | 200; ARŞİV 2017-08-24 (dizin) | birincil (arşiv) |
| S10 | yerel | data/*.json (salt-okunur tarama; DEĞİŞTİRİLMEDİ) | yerel: data/basyapitlar.json, data/harita.json, data/eserler_onbellek.json, data/eser_ayrintilari.json | salt-okunur | yardımcı |

**S5/S6 (Tate birincil) doğrulanan künye:** "Sir John Everett Millais, Bt 1829–1896 / Ophelia / 1851–2"; Medium "Oil paint on canvas"; Dimensions "Support: 762 × 1118 mm / frame: 1105 × 1458 × 145 mm"; Collection "Tate"; Acquisition "Presented by Sir Henry Tate 1894"; Reference "N01506"; S4 canlı meta "on display at Tate Britain"; S6 (2022) "In Tate Britain / Walk Through British Art: 1840".
**S1 (WD) sorunlu alanlar:** P2048=111.8 (height) / P2049=76.2 (width) → TERS (D1); P571=1851 precision 9, ref P143=DBpedia (D2); P195 iki değerli Q430682 Tate + Q180788 National Gallery (D9); P217 N01506 + NG1506; P170=Q159606 ref blog (E11); P180 25 kalem, bir kısmı yalnız Twitter (Sunkensie) ref'li, suicide Q10737 refsiz (E12).
**Erişilemeyen (C050):** kitaplar/dergi metinleri (J.G. Millais 1899; Parris 1984/1994; Webb 1997; Peterson/Williams 2012; Murray 2013; Hawksley 2006; James 1947; Radenburg 2008; Hudson 1856; Minotaure 1936; Telegraph 2007) — yalnız erişilen kayıtların bibliyografyasında anıldı; DOI/ISBN/alıntı uydurulmadı. S9 canlı learn URL ölü; Wayback dizin çekildi (alt sayfalar değil; içerik S5'te mevcut).

## 2. İddia envanteri (A–E)

**C001** — Eser: Ophelia, Sir John Everett Millais, Bt (1829–1896), 1851–2. **A.** S5, S6. "Sir John Everett Millais, Bt / Ophelia / 1851–2".
**C002** — Malzeme: tuval üzerine yağlı boya (Oil paint on canvas). **A.** S6, S1. "Medium: Oil paint on canvas"; WD P186 oil paint + canvas (Art UK ref).
**C003** — Boyut: destek 762 × 1118 mm (76,2 × 111,8 cm); çerçeve 1105 × 1458 × 145 mm. **A.** S6. "Support: 762 × 1118 mm / frame: 1105 × 1458 × 145 mm".
**C004** — Koleksiyon Tate; envanter N01506. **A.** S6, S1. "Collection: Tate"; "Reference: N01506".
**C005** — Sir Henry Tate tarafından 1894'te ulusa sunuldu (Henry Tate Gift). **A.** S6, S5. "Presented by Sir Henry Tate 1894"; "part of the original Henry Tate Gift in 1894".
**C006** — Tate Britain'da (Londra) sergileniyor. **A.** S4, S6, S1. S4 canlı meta (2026) "on display at Tate Britain"; S6 (2022) "In Tate Britain / Walk Through British Art: 1840"; WD P276=Q195436.
**C007** — Konu: Hamlet IV.vii — Ophelia, babası Polonius'u sevdiği Hamlet'in öldürmesi üzerine aklını yitirip dereye düşer ve boğulur. **A.** S6, S5. "from Shakespeare's Hamlet, Act IV, Scene vii ... falls into a stream and drowns".
**C008** — Sahne oyunda sahnelenmez; Gertrude'un Laertes'e anlatımıyla bilinir. **A.** S5. "not actually seen on stage ... referred to in a conversation between Queen Gertrude and Ophelia's brother Laertes".
**C009** — İki aşamalı üretim: manzara açık havada Hogsmill Nehri kıyısında (Ewell, Surrey); figür Londra'daki Gower Street atölyesinde. **A.** S5, S6. "painted the landscape ... by the Hogsmill River at Ewell in Surrey; ... the figure ... in his Gower Street studio"; S6 "began the background in July 1851, at Ewell, Surrey".
**C010** — PRB ilkesi gereği manzara ÖNCE boyandı (figür kadar önemli görüldü). **A.** S5. "the landscape was of equal importance to the figure, and so for Ophelia, it was painted first".
**C011** — Manzara ~5 ayda, doğrudan doğadan boyandı (enwiki: günde 11 saate kadar, haftada 6 gün — B ayrıntı). **A.** S5, S2. S5 "over a period of five months"; S2 "up to 11 hours a day, six days a week, over a five-month period in 1851".
**C012** — Model: Elizabeth Siddal (Tate yazımı "Siddall"); Walter Deverell tarafından şapka dükkânında keşfedildi; 1860'ta Rossetti ile evlendi. **A.** S5, S6. "a young woman aged nineteen called Elizabeth Siddall" (yaş → C039); "later married ... Rossetti, in 1860"; S6 "Elizabeth Siddal ... later married Rossetti". Yazım varyantı E10 (1853'ten sonra "Siddal").
**C013** — Siddal, altındaki lambalarla ısıtılan su dolu küvette ~4 ay poz verdi; lambalar söndü, ağır üşüttü; babası hukuki tehditle doktor masraflarını ödetmeyi kabul ettirdi. **A.** S6, S5. "pose over a four month period in a bath full of water kept warm by lamps underneath. The lamps went out ... severe cold. Her father threatened the artist with legal action until he agreed to pay the doctor's bills." (tutar/hastalık → C042/C043).
**C014** — Elbise: ikinci elden 4 sterline alınmış gümüş işlemeli antik elbise; Millais'nin Mart 1852'de Thomas Combe'a mektubu. **A.** S6, S5. "a really splendid lady's ancient dress - all flowered over in silver embroidery ... it cost me, old and dirty as it is, four pounds" (J.G. Millais I, p.162).
**C015** — PRB tekniği: doğrudan doğadan, olağanüstü ayrıntı; ölü/kırık yapraklar da çiçekler kadar işlendi; botanik profesörü öğrencilerini tablodaki çiçeklere götürdü (oğlu John'un aktarımı). **A.** S5. "painted directly from nature ... shows the dead and broken leaves as well as the flowers in full bloom"; botany professor anecdote.
**C016** — Tuval: 7 Haziran 1851'de Charles Roberson'dan 15 şiline iki parça ("double canvas"); ikinci tuval arka yüzü koruyor. **A.** S5. "bought two pieces of canvas ... from ... Charles Roberson on 7 June 1851 for 15 shillings ... double canvas".
**C017** — Astar: kurşun beyaz zemin üzerine çinko beyaz kat; UV kesiti doğrular; günlük "ıslak beyaz zemin" üzerine bölüm bölüm bitirme OLASILIĞI ("It is possible", E6). **A.** S5. "a layer of lead white underneath a layer of zinc white"; "It is possible that at the beginning of each day Millais would mark out the area ...".
**C018** — Pigmentler: lead white, zinc white, ultramarine ash, vermilion, chromium oxide, zinc yellow, chrome yellow, cobalt blue, Prussian blue, burnt sienna, Naples yellow, madder lake, ivory black, bone black; yeşiller = chrome yellow + Prussian blue. **A.** S5. "He used: lead white, zinc white, ultramarine ash, vermilion ...".
**C019** — Konservasyon: raking light'ta az kompozisyon değişikliği; IR'de söğüt konumunda hafif kayma; X-ray'de tuval yeniden kullanımı yok; 1967'de relining (arka tuval kaldırılıp kaydedildi). **A.** S5. "relatively few changes to the composition"; "a slight shift in the position of the weeping willow"; "The back canvas layer ... was removed when the painting was lined in 1967".
**C020** — Çiçek sembolizmi: söğüt=terk edilmiş aşk; ısırgan=acı; papatya=masumiyet; gelincik=ölüm; menekşe=sadakat/iffet/genç ölümü; hercai menekşe=boşuna aşk/düşünce; gül="rose of May"; unutma beni; mor loosestrife="long purples" (Shakespeare aslında mor orkideyi kastetmişti); crowflower≈düğün çiçeği=nankörlük/çocukluk; pheasant's eye + fritillary=keder; meadowsweet "may signify the futility" (E7). **A.** S5, S6. "The weeping willow ... forsaken love"; "The poppy signifies death"; "Violets ... faithfulness, chastity or death of the young, any of which meanings could apply here"; "Shakespeare actually meant the purple orchid".
**C021** — Farklı mevsimlerde açan çiçekler yan yana görünür (5 aylık çalışma nedeniyle). **A.** S5. "flowers that bloom at different times of the year appear next to each other".
**C022** — Provenance: 10 Aralık 1851'de dealer Henry Farrer, Millais'den 300 gineye aldı → B.G. Windus → 1862'de Mr Graves'e 748 → Gambart 1864 → W. Fuller Maitland 1872 ve yine 1892 → Sir Henry Tate Eylül 1892'de satın aldı → 1894 Henry Tate Gift. **A.** S5. "bought from Millais on 10 December 1851 by ... Henry Farrer for 300 guineas ... sold it in 1862 to a Mr Graves for 748 ... Sir Henry Tate bought it in September 1892".
**C023** — Eser tarihsel olarak National Gallery mülkiyetindeydi; Tate Gallery başlangıçta National Gallery'nin parçasıydı (Millbank'ta ayrı bina) → WD'deki NG1506/Q180788 kaydı bununla açıklanır. **A.** S5. "it used to be the property of the National Gallery. The Tate Gallery was originally part of the National Gallery although in a separate building at Millbank."
**C024** — Sergileme tarihi (seçme): 1852 Royal Academy + Birmingham Society of Artists; 1853 Royal Scottish Academy; 1855 Exposition Universelle Paris; 1898 RA Winter/Memorial; 1967 RA retrospektifi → Walker Art Gallery Liverpool; 1987 National Gallery'ye ödünç; 1997–98 Washington NGA + Tokyo Metropolitan + Hyogo Kobe; 2007–8 Millais (Tate → Van Gogh Museum Amsterdam → Kitakyushu → Bunkamura Tokyo); 2012–13 Pre-Raphaelites: Victorian Avant-Garde (Tate → Washington → Moskova Puşkin → Tokyo Mori). **A.** S5. Exhibition list.
**C025** — Çağdaş/modern eleştiri: Morning Chronicle (1852) olumlu ("startling in its originality"); The Times (1 Mayıs 1852) olumsuz ("weedy ditch", Telegraph ref); John McEwan (tarih bilinmiyor) resmin fotoğrafı "out-records" ettiği, "ressamın görsel hakikatin tek bekçisi olarak son direnişi" (kızılgerdan örneği); Jan Marsh (Literary Review, Haziran 1998) eserin Tate'in en popüler eseri olduğu, Avustralyalı ziyaretçinin Japonya turnesi nedeniyle göremeyince ağladığı. **B.** S5, S2. S5 Chronicle/McEwan/Marsh (A); S2 The Times (B). Marsh zatürre "so the tale goes" → C043.
**C026** — Ruskin tekniği "exquisite" buldu ama Surrey manzarası seçimini sorguladı ("Why the mischief ... wirefenced garden-rolled-nursery-maid's paradise?"). **B.** S2, S3. William James (ed.) 1947, p.176 atıf zinciri (kitaba erişilmedi).
**C027** — Dalí, Minotaure 8 (15 Haziran 1936, ss.46–9) makalesinde Pre-Rafaelitleri "flagrant surrealism" diye övdü. **B.** S2, S3. Dergi atıf zinciri (metne erişilmedi).
**C028** — Etki (refsiz giriş): Waterhouse, Peter Blake, Ed Ruscha, Friedrich Heyser. **C.** S2. "The work has influenced artists such as ..." (ref yok). (yorum)
**C029** — Hazırlık eskizleri (1852): Head of Ophelia (with Wreath) — "current whereabouts are unknown" (E8); Study for the head of Elizabeth Siddal (Birmingham); Study for Ophelia (Plymouth); Slight Sketch (Pierpont Morgan Library, 1973.15 verso). **A.** S5. "An oil study Head of Ophelia (with Wreath) was produced in 1852, but its current whereabouts are unknown."
**C030** — WD P180 (depicts) 25 kalem: Ophelia, drowning, dress, watercourse, willow, Urtica dioica, Papaver rhoeas, daisy, rose, pansy, Viola, Lythrum salicaria, Rosa rubiginosa, Dipsacus fullonum, Ranunculus, Carex, Elizabeth Siddal, suicide (Q10737, refsiz → C052). Bir kısmı Tate ref'li (B), bir kısmı yalnız Twitter/refsiz (C, E12). **C.** S1, S8. (yorum)
**C031** — Görsel kamu malı: PD-old-100-expired (yazar ölümünden 100+ yıl); attribution gerekmez. **A.** S7, S1. "LicenseShortName: Public domain"; "AttributionRequired: false"; WD P6216=Q19652.
**C032** — Su sıçanı (water vole) erken aşamada boyandı, sonradan ÜZERİ BOYANDI; çerçevenin gizlediği üst köşede kaba eskiz kaldı (Telegraph 2007 atıf zinciri; → C040 D4). **B.** S2. "Millais painted the water vole out of the final picture, although a rough sketch of it still exists in an upper corner of the canvas, hidden by its frame."
**C033** — itwiki: sahnede kızılgerdan (pettirosso), su sıçanı (ratto d'acqua) ve "bir kafatası" (teschio) bulunduğu yazılı (ADO web atıf zinciri; Tate ile çelişki → C040; kafatası → C051). **C.** S3. "alcuni animali, tra cui un pettirosso ed un ratto d'acqua, e persino un teschio". (yorum)
**C034** — itwiki: eser lüks bir imparator baldacchino'sunun üst kısmı için düşünüldü; bu yüzden yatay format ve üst köşeler "smussati" (pahlanmış). Satır içi atıf YOK; Tate dikdörtgen destek ölçüsü veriyor, kemerli üstten söz etmiyor → doğrulanmadı (E2). **E.** S3. "i due angoli superiori smussati". (belirsiz)
**C035** — Değerleme: "en az £30 milyon" (2007 Telegraph); 300 gine ≈ 2020'de ~£40.000 (enflasyon hesaplayıcı, zayıf). **C.** S2. "valued by experts as worth at least £30 million". (yorum)
**C036** — Natsume Sōseki 1906'da bir romanında tabloyu övdü; Japonya'da popüler; Tokyo'da 1998 ve 2008'de sergilendi (sergi tarihleri S5/C024 ile A örtüşür; Sōseki kitap atıf zinciri Peterson/Williams, erişilmedi). **B.** S3, S5. "Nel 1906 ... Natsume Sōseki spese parole di ammirazione".
**C037** — D1 BOYUT YÖNÜ: WD P2048=111.8 cm (height) / P2049=76.2 cm (width) TERS ↔ Tate S6 "762 × 1118 mm" (Y×G); enwiki infobox 76.2×111.8; itwiki altezza 76,2 / larghezza 111,8. Birincil esas: Y 76,2 × G 111,8 cm. **D.** S1, S6, S2, S3. (tartışma)
**C038** — D2 TARİH: WD P571=1851 (precision 9, DBpedia) ↔ Tate 1851–2; enwiki infobox 1851–1852 ama short desc "1852 painting"; itwiki 1851-1852. Birincil: 1851–2. **D.** S1, S5, S6, S2. (tartışma)
**C039** — D3 MODELİN YAŞI: Tate S5 "aged nineteen" (19) ↔ enwiki "then 22 years old". Çözüm üretilmedi. **D.** S5, S2. (tartışma)
**C040** — D4 SU SIÇANI: itwiki sahnede VAR (ADO ref) ↔ enwiki son resimde ÜZERİ BOYANDI, yalnız çerçeve altı eskiz (Telegraph) ↔ birincil S5/S6 sessiz. **D.** S3, S2, S5. (tartışma)
**C041** — D5 KÜVET ISITMA: itwiki "candele" (mum) ↔ Tate S5 "oil lamps" / S6 "lamps underneath" / enwiki "oil lamps". Birincil lamba diyor. **D.** S3, S5, S6. (tartışma)
**C042** — D6 TAZMİNAT: itwiki 50 sterlin ÖDENDİ ↔ enwiki baba £50 TALEP etti, oğluna göre daha düşük tutar kabul ↔ S6 tutar yok "doctor's bills" ↔ S5 "pay the fifty medical bills ... settled". Tutar/ödeme kesin değil. **D.** S3, S2, S6, S5. (tartışma)
**C043** — D7 HASTALIK: S6/enwiki "severe cold" ↔ itwiki "feroce bronchite" ↔ S5 (Jan Marsh 1998) "pneumonia ... so the tale goes". Marsh zaten kuşkulu aktarıyor. **D.** S6, S2, S3, S5. (tartışma)
**C044** — D8 MANZARA NOKTASI: S5/S6 "Ewell, Surrey" ↔ enwiki "near Tolworth" + Barbara Webb "Six Acre Meadow, Church Road, Old Malden" (Webb 1997). Aynı nehir (Hogsmill) boyunca farklı noktalar; S5 "is thought to have painted" (E5). **D.** S5, S6, S2. (tartışma)
**C045** — D9 MÜZE: data "National Gallery" ↔ Tate (bugün Tate Britain); WD P195 iki değerli (Tate + NG); S5 tarihsel NG mülkiyetini açıklıyor (C023). Güncel: Tate Britain. **D.** S10, S4, S5, S6, S1. (tartışma)
**C046** — D10 PANSY SAHNESİ: itwiki "Atto IV, scena IV" ↔ S5 "Act IV, Scene V" ('that's for thoughts'). itwiki iç hatası; birincil IV.v. **D.** S3, S5. (tartışma)
**C047** — D11 TEŞHİR DURUMU: S5 bayat not "touring ... not on display until October 2019" ↔ S4 canlı meta (2026) "on display at Tate Britain" ↔ S6 (2022) "In Tate Britain". Canlı meta esas. **D.** S5, S4, S6. (tartışma)
**C048** — D12 TATE ETİKET DİLİ: S6 caption (Mar 2022) "posed in a wedding dress" / "accidentally kills her father" / "she allows herself to fall" ↔ S5/S6 summary "ancient dress ... silver embroidery"; oyun metni: Hamlet Polonius'u bilinçli bıçaklar. Caption yorumlayıcı. **D.** S6, S5. (tartışma)
**C049** — Görsel bu oturumda İNCELENEMEDİ (vision kotası ana oturumda); yalnız Commons metadata + lisans + çözünürlük (7087×4820); GZ TASLAK; kompozisyon "kaynakların betimlediği". **E.** S7. (belirsiz)
**C050** — Kitap/dergi/refs metinlerine ERİŞİLMEDİ (J.G. Millais 1899; Parris 1984/1994; Webb 1997; Peterson/Williams 2012; Murray 2013; Hawksley 2006; James 1947; Radenburg 2008; Hudson 1856; Minotaure 1936; Telegraph 2007); yalnız erişilen kayıtların bibliyografyasında anıldı. **E.** S2, S3, S6, S9. (belirsiz)
**C051** — E1 YAPRAKLARDA KAFATASI: itwiki "e persino un teschio" (ADO ref); data "öne sürülür, ancak bu tartışmalıdır"; birincil S5/S6 sessiz → doğrulanmadı. **E.** S3, S10, S5. (belirsiz)
**C052** — E3 İNTİHAR MI KAZA MI: WD P180 suicide (Q10737, refsiz); S6 caption "she allows herself to fall into a stream and drown"; S2 "loses her sanity and drowns" → yorum meselesi, kesinleştirilmedi. **C.** S1, S6, S2. (yorum)
**C053** — "Other Ophelias" (Tate): Arthur Hughes Ophelia (Manchester City Art Gallery; RA 1852 aynı yıl; Ophelia'yı dereye düşmeden ÖNCE gösterir); J.W. Waterhouse üç Ophelia (ikincisi 1894; dalda oturur, saçına gelincik/papatya takar); ayrıca Reg Butler (1955), S.W. Hayter (1936), Daniel Maclise "The Play Scene in Hamlet" (1842). **A.** S5, S6. "Arthur Hughes's work ... shows Ophelia before she slips into the river"; "Waterhouse produced three paintings of Ophelia ... second painting of 1894".
**C054** — Rossetti "Beata Beatrix" (c.1864–70, Tate) S6 "You might like" listesinde; Ophelia'nın modeli Siddal, Rossetti'nin eşi (C012) → aynı model çevresinde okuma (yorum). **A.** S6. "Dante Gabriel Rossetti / Beata Beatrix / c.1864–70".
**C055** — Alımlama (basın atıf zincirli): Laurence Olivier'nin 1948 Hamlet'i; Nick Cave "Where the Wild Roses Grow" videosu (Kylie Minogue pozu); Lars von Trier Melancholia (2011) prologu (Kirsten Dunst); Taylor Swift "The Life of a Showgirl" (2025) kapağı. **B.** S2. Guardian/Parade/Radenburg ref'li.

**Sayım:** 55 iddia · A=28 · B=6 · C=5 · D=12 · E=4.

## 3. Görsel doğrulama kaydı (Kural 6)

- S7 metadata: `File:John Everett Millais - Ophelia - Google Art Project.jpg` (Commons pageid 13455290); 7087 × 4820 px · 23.500.402 bayt (~23,5 MB); DateTimeOriginal "circa 1851" (P571 precision 9 + P1480 Q5727902 — circa korundu, E4); yükleme 2011-02-20.
- Lisans: Public domain — PD-old-100-expired, PD-Art (PD-old-100-expired), CC-PD-Mark; AttributionRequired: false; Restrictions: boş. Credit: "Google Arts & Culture — -wGU6cT4JixtPA Tate Images (...image=N01506...)" → birincil Tate bağlantısını doğrular. WD P4701=-wGU6cT4JixtPA.
- Yerel eşleme (S10): data/yerel_gorseller.json `commons:John_Everett_Millais_-_Ophelia_-_Google_Art_Project.jpg` → `dd3b9c967e239aa0`; data/eser_ayrintilari.json[79].gorsel = dd3b9c967e239aa0 ✓.
- **GÖRSEL İNCELENEMEDİ (C049 E):** vision kotası ana oturumda; bu oturumda yalnız metadata + lisans + çözünürlük çekildi. Kompozisyon S5/S6 (A) + data S10 betiminden ("kaynakların betimlediği"); doğrudan görsel teyit YOK. **GZ TASLAK.** Görsel projeye kopyalanmadı; URL + lisans + kaynak referans verildi.

## 4. Kelime/süre sayımı

| Seviye | Hedef | Ölçülen |
|---|---|---|
| Başlangıç | 400–500 | 419 ✓ |
| Orta | 1300–1600 | 1326 ✓ |
| İleri | 2600–3200 | 2859 ✓ |

dogrula.py (Q1065493): **0 hata / 0 uyarı** · CJK: 0 · iddia 55 (A28/B6/C5/D12/E4) · CS10 DY5 AU5 GZ5 TK5 (CS/DY/GZ/TK kanıt yalnız A/B; GZ TASLAK). Birincil Tate AÇILDI (A); görsel İNCELENEMEDİ (E). Not: parti5 eşzamanlı batch; dogrula genel toplamı öteki eserleri içerir, Q1065493 izole edildi.

## 5. Veri notları (data/ dokunulmadı; insan onayına sunulur)

1. **Tarih (D2/C038):** data/basyapitlar.json[77] + data/harita.json + data/eserler_onbellek.json "1851" ↔ Tate birincil "1851–2". WD P571=1851 (DBpedia) miras alınmış.
2. **Müze (D9/C045):** data "National Gallery" ↔ Tate (bugün Tate Britain). WD P195 iki değerli; S5 tarihsel NG mülkiyetini açıklıyor (C023). Ders gövdesi zaten düzeltiyor ("eser National Gallery'de değil, bugün ... Tate Britain'dadır") → alan-gövde tutarsızlığı.
3. **Boyut (D1/C037):** WD P2048/P2049 yükseklik-genişlik TERS; birincil Tate 762×1118 mm esas.
4. **Kemerli üst (E2/C034):** data/basyapitlar.json[77].bolumler[0] "Tablonun üstü kemerli biçimdedir" ↔ S6 dikdörtgen destek; itwiki atıfsız "smussati". Birincille doğrulanmadı.
5. **Kafatası (E1/C051):** data/basyapitlar.json[77].bolumler[2] "öne sürülür, ancak bu tartışmalıdır" — veri zaten kuşkulu işaretlemiş (uygun); birincil sessiz.
6. **Görsel (C049):** İNCELENEMEDİ; GZ TASLAK; insan editör görsel teyidi zorunlu. Görsel eşlemesi (dd3b9c967e239aa0) doğru.
7. **Model yaşı (D3/C039), su sıçanı (D4/C040), küvet ısıtma (D5/C041), tazminat (D6/C042), hastalık (D7/C043), manzara noktası (D8/C044):** kaynaklar arası; ders tek değer dayatmaz.