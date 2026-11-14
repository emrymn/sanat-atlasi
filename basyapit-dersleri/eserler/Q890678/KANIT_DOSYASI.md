# KANIT DOSYASI — Q890678 · Nereden Geliyoruz? Neyiz? Nereye Gidiyoruz? (D'où venons-nous ? Que sommes-nous ? Où allons-nous ?) · Paul Gauguin

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md` §1–15
**Durum:** İnsan incelemesi bekliyor.
**Araştırma brief'i:** `.qwen/tmp/parti5/Q890678-brief.md` (kaynak-arastirma agent; ham cache'ler `.qwen/tmp/parti5/Q890678-*`).

---

## 0. Yöntem ve kaynak hiyerarşisi

Eser bir tuvaldir (Museum of Fine Arts, Boston; envanter 36.270). **Birincil MFA koleksiyon kaydı TAM AÇILDI — ama canlı değil, arşivden:** `collections.mfa.org/objects/32558` canlı istekte SSL sertifika süresi dolmuş (curl 60, HTTP 000), eski `www.mfa.org/collections/object/…-32558` canlı istekte 403 verdi. **Wayback snapshot 20250719053357 (19 Temmuz 2025) 200 döndü ve katalog alanlarının tamamı + küratöryal metin + provenance + 5 not okundu (S9).** Bu nedenle künye, teknik, boyut, yazıtlar, provenance, sergileme ve küratöryal betim **A** düzeyindedir; arşiv tarihi her kullanımda beyan edilir. Birincil URL'ler tahminle değil, WD P127 referansındaki P856 ve P276 referansındaki P854 + Commons dosya credit'inden bulundu.

İkincil zincir: enwiki (S3) ve itwiki (S4) wikitext'i satır içi akademik atıflarla okundu; **atıf verilen kitap/makalelerin metnine erişilmedi** → bu iddialar **B** (kaynak zinciri notuyla), atıfsız wiki pasajları **E**. Wikidata (S1) yalnız yardımcı; P571 precision 8 + P1319/P1326 aralık niteleyicileri aynen korundu. Commons (S5) iki dosyanın metadata + lisansını verdi; **görsel İNCELENMEDİ** (vision kotası ana oturumda) → kompozisyon "kaynakların betimlediği" kalıbıyla verilir, GZ soruları TASLAK.

**Dokuz ihtilaf D olarak açık tutuldu (C063–C071):** tarih (1897 ↔ 1897–98), katalog "Oil on canvas" ↔ küratöryal "burlap", genişlik (374.6 ↔ 374.5 ↔ 375), merkez figürün kimliği (androjen ↔ Eve ↔ giovinetto ↔ data "Âdem"), idolün kimliği ("the Beyond" ↔ Hina ↔ data "uydurma put"), boya uygulaması (smooth ↔ thick), Vollard'a giden zincir (Monfreid konsinye ↔ doğrudan gönderim), akım etiketi (Post-Impressionism ↔ data "Sentetizm"), Stang sahipliğinin başlangıcı (before 1920 ↔ WD 1920). MFA provenance'ındaki **"probably 1913"** ve **"sold or consigned"** kuşku ifadeleri AYNEN korundu; hiçbir ihtilaf tek doğru cevaba bağlanmadı.

**Brief'e göre seviye düzeltmeleri (Denetim B bulgusu):** (1) Brief C027'yi "A (S9 alıntı)" olarak işaretliyordu; ham MFA metninde yalnız *"the huddled figure of 'an old woman nearing death'"* var — *"reconciled and resigned to her thoughts"* ifadesi MFA'da YOK, enwiki'de Boime 2008 p.140 atfıyla ve itwiki'de Gauguin betimlemesi olarak geçiyor → **C027 B'ye indirildi**. (2) Brief C016 "A (S9 ima) + B" karışık; 1891 yılı yalnız enwiki'de açık, MFA "six years prior" der → **C016 B**. (3) Brief C005/C041/C045/C052 karışık seviyeliydi; A bileşen birincil metinle, B/E bileşen ayrı iddiayla ayrıştırıldı (C005 A; C041 A; C044/C045 E; C052 A + C073 B). (4) Brief'in D1–D9 ihtilafları ayrı D iddiaları olarak numaralandırıldı → C063–C071.

## 1. Kaynak envanteri

| ID | Kurum | Belge | URL | Erişim (14 Kas 2026, UTC) | Tür |
|---|---|---|---|---|---|
| S1 | Wikidata | EntityData Q890678 (P1476/P170/P571/P186/P2048/P2049/P195/P217/P276/P18/P6216/P136/P135/P1071/P127) | https://www.wikidata.org/wiki/Special:EntityData/Q890678.json | 200 | yardımcı |
| S2 | Wikidata | wbgetentities etiketler (14 QID) | https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q37693%7CQ296955%7C… | 200 | yardımcı |
| S3 | Wikipedia EN | wikitext (action=parse, redirects=1) | https://en.wikipedia.org/w/api.php?action=parse&page=Where%20Do%20We%20Come%20From%3F%20What%20Are%20We%3F%20Where%20Are%20We%20Going%3F&prop=wikitext&formatversion=2&redirects=1 | 200 | ikincil |
| S4 | Wikipedia IT | wikitext (Da dove veniamo? Chi siamo? Dove andiamo?) | https://it.wikipedia.org/w/api.php?action=parse&page=Da%20dove%20veniamo%3F%20Chi%20siamo%3F%20Dove%20andiamo%3F&prop=wikitext&formatversion=2&redirects=1 | 200 | ikincil |
| S5 | Wikimedia Commons | imageinfo (2 dosya: P18 + boyut ref'li dosya) | https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&titles=File%3AGauguin%20-%20Where%20Do%20We%20Come%20From%3F… | 200 (metadata; görsel İNCELENMEDİ) | görsel |
| S6 | MFA (canlı) | collections.mfa.org/objects/32558 | https://collections.mfa.org/objects/32558 | **SSL expired (curl 60), HTTP 000**, 19:04:35Z — ERİŞİLEMEDİ | birincil (erişilemedi) |
| S7 | MFA (canlı, eski URL) | www.mfa.org/collections/object/…-32558 | http://www.mfa.org/collections/object/where-do-we-come-from-what-are-we-where-are-we-going-32558 | **403**, 19:04:47Z — ERİŞİLEMEDİ | birincil (erişilemedi) |
| S8 | Internet Archive | wayback/available | https://archive.org/wayback/available?url=collections.mfa.org/objects/32558 | 200 (closest: 20250719053357) | yardımcı |
| S9 | **MFA (Wayback kopyası)** | nesne kaydı, snapshot **20250719053357 (19 Temmuz 2025)** | https://web.archive.org/web/20250719053357/https://collections.mfa.org/objects/32558 | **200**, ~19:05Z, 31630 bayt; katalog + metin + provenance + 5 not TAM | **birincil (arşiv kopyası)** |
| S10 | Wildenstein Plattner Institute | dijital katalog (Commons credit) | https://digitalprojects.wpi.art/gauguin/artworks/detail?a=71734 | 200 ama Angular JS kabuğu, **0 görünür metin**, 19:05:45Z — ERİŞİLEMEDİ | birincil (erişilemedi) |
| S11 | Internet Archive | WPI için wayback/available | https://archive.org/wayback/available?url=digitalprojects.wpi.art/gauguin/artworks/detail%3Fa%3D71734 | 200, **snapshot YOK**, 19:06:23Z | yardımcı |
| S12 | yerel `data/` | 10 JSON'da Q890678 taraması (salt-okunur; 17 eşleşme) | data/basyapitlar.json vb. | yerel, 2026-11-14 | yardımcı |

**S9'da (birincil) doğrulanan alanlar:** başlık; "Paul Gauguin (French, 1848–1903)"; "1897–98"; Medium/Technique "Oil on canvas"; Dimensions "139.1 x 374.6 cm (54 3/4 x 147 1/2 in.)"; Credit Line "Tompkins Collection—Arthur Gordon Tompkins Fund"; Accession Number "36.270"; "ON VIEW Sidney and Esther Rabb Gallery (Gallery 255)"; Collections Europe / Classifications Paintings; Catalogue Raisonné "Wildenstein 561"; Inscriptions (sol üst Fransız başlık, sağ üst "P. Gauguin / 1897"); küratöryal metin (1897 kışı krizi, "six years prior", "the largest he ever attempted", sağdan sola okuma, "androgynous standing figure", "blue idol … indicates the Beyond", "look like a mural" + beyaz çerçeve, sarı köşeler + fresk/altın duvar benzetmesi, "smooth paint application" + "coarse and heavy burlap support", "resists easy interpretation and singular narrative", Natanson alıntıları); Provenance (1898 Monfreid → Vollard konsinye; 1901 Frizeau; **probably 1913** Barbazanges; **before 1920** Stang; 1935 **sold or consigned** Gold; Harriman Gallery; 1936 MFA **$80,000**, Accession Date **April 16, 1936**) + notlar 1–5 (Vollard sergisi 17 Kas–10 Ara 1898; Frèches-Thory 1989; Barbazanges 1914 sergisi + 1920 geri alma; 1 Şub 1935 Seligmann mektubu AAA kutu 426 + Brüksel 15 Haz–29 Eyl 1935 kat.28 + Kunsthaus Zürih 20 Şub–20 Mar 1932; Harriman 22 Nis–9 May 1936 + NYT 14 Nis 1936).

**S3/S4'te okunan ikincil zincir:** Boime 2008 p.140; Andersen 1967 p.238 (satır içi "Anderson" — E17); Dorra 2007 p.256; Gayford 2006 pp.99–100; Stuckey 2001 p.129; Gibson 1993 p.23; Boyle-Turner 2007 pp.175,177; Shackelford 2004 p.183; Thomson 1987 pp.198–200; Rousseau 1959 p.22; itwiki'de Gauguin'in Monfreid mektubundan betim (loescher/De Rosa + Cricco-Di Teodoro 2012 pp.1652–1653) ve Fontainas'ın tam eleştirisi (Messina 2006 FUP). **Bu yayınların hiçbirinin metnine erişilmedi** (C079).

**Erişilemeyenler:** S6 (SSL), S7 (403), S10 (JS kabuğu + arşiv yok), S11 (snapshot yok), tüm kitap/makale metinleri, NYT 14 Nis 1936, AAA Seligmann mektubu, Frèches-Thory 1989, Messina PDF (urlmorto), Loescher PDF, francescomorante.it (urlmorto).

## 2. İddia envanteri (A–E)

Seviye: **A** = birincil MFA kaydı (S9, arşiv) / Commons dosya kaydı (S5); **B** = satır içi akademik atıf zinciri (metne erişilmedi); **C** = yorum; **D** = kaynaklar arası ihtilaf; **E** = atıfsız / yetersiz / erişilemedi. Pasajlar kaynaklardan AYNEN.

**C001** — Eserin adı: EN "Where Do We Come From? What Are We? Where Are We Going?"; FR "D'où venons-nous ? Que sommes-nous ? Où allons-nous ?"; TR "Nereden Geliyoruz? Neyiz? Nereye Gidiyoruz?". **A.** S9, S1 (P1476 fr/en: "D’où venons nous? Que sommes nous? Où allons nous?" — tire/soru işareti biçimi WD'de farklı).
**C002** — Sanatçı: Paul Gauguin (French, 1848–1903). **A.** S9, S1 P170=Q37693.
**C003** — Tarih: "1897–98" (MFA); WD P571 precision 8 + P1319 +1897 / P1326 +1898. **A.** S9, S1. (→ C063 D)
**C004** — Katalog medium alanı: "Oil on canvas". **A.** S9 Medium/Technique. (→ C064 D)
**C005** — Küratöryal metin: "choice of a coarse and heavy burlap support" (kaba/ağır çuval bezi destek). **A.** S9. (Jüt alıntısı ayrı: C044 E.)
**C006** — Boyut: 139.1 × 374.6 cm (54 3/4 × 147 1/2 in.). **A.** S9; S1 P2048/P2049 (ref: Commons, 2018-06-27). (→ C065 D)
**C007** — Müze: Museum of Fine Arts, Boston. **A.** S9; S1 P195/P276=Q49133.
**C008** — Envanter: 36.270. **A.** S9 Accession Number; S1 P217.
**C009** — Credit line: "Tompkins Collection—Arthur Gordon Tompkins Fund". **A.** S9.
**C010** — Sergileme: "ON VIEW Sidney and Esther Rabb Gallery (Gallery 255)" — **2025-07-19 arşiv durumu**. **A.** S9. (Güncel durum: C080 E.)
**C011** — Collections: Europe; Classifications: Paintings. **A.** S9.
**C012** — Catalogue raisonné: Wildenstein 561. **A.** S9.
**C013** — Yazıtlar: sol üst "D'ou Venons Nous / Que Sommes Nous / Où Allons Nous"; sağ üst "P. Gauguin / 1897". Soru işareti/tire yok, tüm sözcükler büyük harfli (MFA yazıt dizgisinden doğrudan görülür; enwiki ref :2 de aynı). **A.** S9 Inscriptions; S3.
**C014** — Sarı köşeler; Gauguin'in benzetmesi: "like a fresco whose corners are spoiled with age, and which is attached to a golden wall". **A.** S9. ("giallo cromo"/krom sarısı ayrıntısı: C032 B.)
**C015** — Yapım yeri: Tahiti. **A.** S9 metni; S1 P1071=Q42000; S3; S4.
**C016** — Gauguin 1891'de Tahiti'ye gitti (enwiki açık; MFA "six years prior" ile uyumlu ima). **B.** S3; S9.
**C017** — Gauguin'in denediği en büyük eser: "this monumental painting—the largest he ever attempted". **A.** S9; S4 ("la più grande del suo opus", atıfsız ama S9 teyitli).
**C018** — Akım etiketi "Post-Impressionism": WD P135=Q166713 (ref: beckchris.wordpress.com blogu, Q97309629); enwiki infobox atıfsız. Yaygın sınıflama ama akademik zincir yok. **E.** S1, S3. (→ C070 D)
**C019** — Tür sınıflaması çelişkili: WD P136 "genre art" (Q1047337) ↔ data "alegori" ↔ itwiki kategorisi "Dipinti a soggetto simbolico" ↔ Gauguin "non ha alcuna allegoria" (C039). Çözüm dayatılmadı. **E.** S1, S12, S4.
**C020** — Görsel dosyaları Public domain; AttributionRequired=false. **A.** S5; S1 P6216=Q19652, P1001=Q60332278, P459=Q29940705.
**C021** — Kompozisyon sağdan sola: uyuyan bebekten "an old woman nearing death"ın büzülmüş figürüne. **A.** S9 ("the composition proceeding from right to left…"); S3; S4.
**C022** — Üç ana grup başlıktaki üç soruyu yansıtır. **B.** S3 (Boime 2008 p.140 bağlamı); S4.
**C023** — Sağda uyuyan bebek + üç çömelmiş/oturmuş kadın = yaşamın başlangıcı. **B.** S3 (Boime 2008 p.140); S4 (Gauguin betimi: "un bambino addormentato e tre donne sedute").
**C024** — Merkeze yakın **androjen** ayakta figür meyveye uzanır: "Near center, an androgynous standing figure reaches for a piece of fruit." **A.** S9. (→ C066 D)
**C025** — Meyve koparan figür için Eve/günah allegorisi yorumu (Gauguin'in niyeti olarak aktarılır). **B.** S3 (Andersen 1967 p.238); S4 (loescher). (→ C066 D)
**C026** — Kolları simetrik açık mavi idol, kaide üstünde; Gauguin'e göre "indicates the Beyond". **A.** S9; S3. (→ C067 D)
**C027** — Yaşlı kadın ölüme yaklaşırken "reconciled and resigned to her thoughts" (uzlaşmış, düşüncelerine boyun eğmiş). **B.** S3 (Boime 2008 p.140); S4 (Gauguin betimi: "placata e presa dai suoi pensieri"). **DÜZELTME:** brief A diyordu; bu ifade ham MFA metninde YOK (MFA yalnız "huddled figure of 'an old woman nearing death'" der → C021 A).
**C028** — Tuhaf beyaz kuş "sözlerin boşunalığı"nı temsil eder; pençelerinde kertenkele tutar. **B.** S3 (Boime 2008 p.140); S4 (Gauguin: "che tiene una lucertola con gli artigli, rappresenta la vanità delle parole").
**C029** — Sağdan sola "birth-sin-death" (doğum–günah–ölüm) döngüsü. **B.** S3 (Andersen 1967 p.238).
**C030** — Mor giysili iki figür birbirine düşüncelerini açar; ağaç yanında iki kederli kadın + kolunu kaldıran çömelmiş figür; "aydınlanma ↔ batıl/irrasyonel gelenek" karşıtlığı yorumu. **B.** S3 (Dorra 2007 p.256); S4 (Gauguin: "Due figure vestite di porpora si confidano i propri pensieri").
**C031** — Kedilerle çevrili kız = "girlhood" saflığı; annelik grubu; olgun kadının bileziği + beyaz keçi = "domestic submission". **B.** S3 (Andersen 1967 p.238). (Kedi sayısı/cinsiyet nüansı: E13.)
**C032** — Gauguin betimi: dere, ağaçlar, deniz, yakın ada tepeleri; "il tono del paesaggio è tutto blu e verde veronese"; nüdler "in vivo arancione"; köşeler "giallo cromo" (krom sarısı). **B.** S4 (Gauguin alıntısı, ref loescher + Cricco-Di Teodoro 2012 pp.1652–1653).
**C033** — Model zinciri: Parthenon frizleri, pre-Kolomb Peru mumyaları, Manet, Puvis de Chavannes, Borobudur rölyefleri. **B.** S4 (loescher/cdt ders kitabı zinciri; metne erişilmedi).
**C034** — "Yaşlı kadının duruşu Peru mumyalarından alınmıştır" (data iddiası): çekilen metinlerde bu ÖZGÜ duruş iddiası yok; yalnız genel model listesi (C033) + Andersen 1967 başlığı ("Gauguin and a Peruvian Mummy"). **E.** S12, S4, S3.
**C035** — Antinaturalistik palet ("una tavolozza clamorosamente antinaturalistica"); friz gibi yatay dizilim, perspektif derinliği yok; büyük çömelmiş figür "perspektif yasalarını kasten atlatır" ("che elude volutamente le leggi della prospettiva"). **B.** S4 (loescher; Gauguin alıntısı cdt).
**C036** — Belirli bir mimariye entegre planlanmadı; "look like a mural" istendi; basit beyaz çerçeve talep edildi. **A.** S9.
**C037** — "His smooth paint application and choice of a coarse and heavy burlap support further emphasized the painting's fresco-like effect." **A.** S9. (→ C068 D)
**C038** — "a philosophical work comparable to the themes of the Gospels" olarak görülür. **B.** S3 (Andersen 1967 p.238); S4 (Vangelo benzetmesi, atıfsız).
**C039** — Gauguin: "il mio sogno non si lascia catturare, non ha alcuna allegoria; è un poema musicale e fa a meno di qualsiasi libretto" (rüyam yakalanamaz, hiçbir allegorisi yoktur; müzikal bir şiirdir, librettosuzdur). **B.** S4 (Gauguin alıntısı, ref loescher).
**C040** — Üç sorunun kökeni: Dupanloup'un kateşizmi; Orléans yakınlarındaki Petit Séminaire (La Chapelle-Saint-Mesmin), 11–16 yaş; "where does humanity come from? / where is it going to? / how does humanity proceed?". **B.** S3 (Gayford 2006 pp.99–100; Stuckey 2001 p.129).
**C041** — 1897 kışı psikolojik kriz: "In the winter of 1897, Gauguin experienced a psychological crisis."; modernite hayal kırıklığı, Fransız sömürge otoriteleriyle kavga, mali zorluk, "steep mental and physical decline". **A.** S9. (Hastalık listeleri ayrı: C074 B / C044 E.)
**C042** — Kızının ölüm haberi Kopenhag'dan geldi. **B.** S3 (Andersen 1967). ("Aline" adı yalnız itwiki'de, atıfsız → C044 E.)
**C043** — Aralık 1897'de Monfreid'e mektupta intihar planını açıkladı; eseri bitirdikten sonra arsenikle intihar girişimi. **B.** S3 (Andersen 1967; Gibson 1993 p.23, ISBN 0-8478-1737-7). (Doz/kusma ayrıntısı atıfsız → C044 E.)
**C044** — itwiki'nin satır içi atıfsız ayrıntıları: "~bir ay gece gündüz" çalışma, "au premier coup", "tela di Juta di sacchi piena di nodi e di rugosità" (jüt çuval bezi), arsenik dozunun kusturarak etkisizleşmesi, "seri problemi al cuore" (kalp), kızın adı "Aline". Mektup metnine erişilmedi. **E.** S4.
**C045** — "Ruhsal vasiyet" ("un testamento spirituale") çerçevesi: itwiki'de atıfsız. **E.** S4. (MFA'nın miras ifadesi ayrı: C072 A.)
**C046** — 1898'de sanatçıdan Tahiti'den Georges Daniel de Monfreid'e (Paris) gönderildi; Monfreid ve acentesi Ambroise Vollard'a konsinye etti. **A.** S9 Provenance. (→ C069 D)
**C047** — Galerie Ambroise Vollard sergisi: 17 Kasım – 10 Aralık 1898; MFA "alongside a suite of related paintings" der. **A.** S9 note 1 + metin; S3 (Boyle-Turner 2007 p.175). ("Sekiz" sayısı ayrı: C081 B.)
**C048** — İlk gösterimde karışık eleştiriler; Natanson: "obscure", "difficult to grasp", "invites us to meditate upon the mystery of our destiny"; MFA: eser "resists easy interpretation and singular narrative"; başlıktaki sorular "origins, identity, purpose, and destiny". **A.** S9; S3 (Boyle-Turner 2007 p.177).
**C049** — Fontainas (Mercure de France): yazıt olmadan allegori anlaşılmazdı; Puvis de Chavannes'ın "Inter artes et naturam (Between Art and Nature)" eserine benzetti. **B.** S3 (Shackelford 2004 p.183 bağlamı); S4 (tam alıntı, ref Messina 2006 FUP, ISBN 97888-6453-110-6).
**C050** — Gauguin'in yanıtı: kendi işi "pictorial language of feelings"; soyut/açıklanamaz nitelikler edebî terimlerle ifade edilemez; Puvis'in "great master of decorative painting" olarak anılmasından ayrışmak istedi. **B.** S3 (Shackelford 2004 p.183; ayrışma cümlesi {{citation needed}}).
**C051** — Charles Morice'in Fransa adına satın alma abonelik girişimi başarısız oldu. **E.** S3 (satır içi atıf yok); S4 (atıfsız anlatı); S9'da yok.
**C052** — 1901'de Vollard → Gabriel Frizeau (b.1870–d.1938), Bordeaux. **A.** S9 Provenance. (Fiyat ayrı: C073 B.)
**C053** — "**probably 1913**" Frizeau → Galérie Barbazanges, Paris; Barbazanges 1914'te sergiledi. ("probably" AYNEN korundu.) **A.** S9 + note 2. (enwiki "around 1913" → E12.)
**C054** — "**before 1920**" Barbazanges → J. B. Stang, Oslo; Barbazanges 1920'de geri almaya çalıştı. **A.** S9 + note 3; S1 P127. (→ C071 D)
**C055** — 1935'te Stang → Alfred Gold (Berlin/Paris): "**sold or consigned**" (satıldı veya konsinye edildi — kesin değil). **A.** S9 + note 4. (enwiki "He sold … via Alfred Gold" kesinleştirir → E11.)
**C056** — 1932 Kunsthaus Zürih ödünç (20 Şub–20 Mar, Gold Stang'ın temsilcisi); 1935 Brüksel "L'impressionisme", Palais de Beaux-Arts (15 Haz–29 Eyl, kat.28); 1 Şub 1935 Seligmann mektubu (AAA, Seligmann papers kutu 426): "la grand Gauguin était toujours la proprieté de Stang"; yazarı tanımlanmamış. **A.** S9 note 4.
**C057** — Gold → Marie Harriman Gallery (New York); galeri sergisi 22 Nisan – 9 Mayıs 1936; NYT 14 Nisan 1936 "Gauguin Canvas is Brought Here" (kaynakçada anıldı, metne erişilmedi). **A.** S9 + note 5.
**C058** — 1936'da Harriman Gallery → MFA, **80.000 $**; edinim tarihi **16 Nisan 1936**. **A.** S9; S1 P195 P580; S3; S4.
**C059** — MFA note 2, Frizeau üzerine Claire Frèches-Thory bildirisini anar: "Le premier acheteur d'Où venons-nous? Le collectionneur bordelais, Gabriel Frizeau (1870–1938) et ses rapports avec Gauguin", Rencontres Gauguin à Tahiti (Papeete, 20–21 Haziran 1989), pp.48–56. **A** (atfın birincil kayıtta varlığı); metne erişilmedi.
**C060** — Commons dosya 1 (WD P18): "Gauguin - Where Do We Come From? … (1897-98).jpg", 5400×1987 px, 3.362.814 bayt, PD, credit Wildenstein Plattner Institute; DateTimeOriginal "between 1897 and 1898". **A.** S5.
**C061** — Commons dosya 2: "Paul Gauguin - D'ou venons-nous.jpg", 3090×1175 px, 1.570.473 bayt, PD, credit Museum of Fine Arts Boston (eski URL); DateTimeOriginal "1897". **A.** S5. (→ C063 D)
**C062** — Muammalı konu/atmosfer bazı araştırmacılarca Gauguin'in kişisel çatışmalarına bağlanır. **B.** S3 (Rousseau 1959 p.22).
**C063** — **D1 Tarih ihtilafı:** MFA "1897–98" + WD aralık + enwiki lead "1897–1898" ↔ itwiki infobox/lead "1897" ↔ data "1897" ↔ enwiki Background "completed this painting in 1897" ↔ enwiki kategorisi "1898 paintings" ↔ imza "1897" ↔ Commons dosya 2 "1897". Birincil aralık esas; tek-yıl ifadeleri kesinleştirme sayılır. **D.** S9, S1, S3, S4, S5, S12. (tartışma)
**C064** — **D2 Medium/destek gerilimi:** MFA katalog alanı "Oil on canvas" ↔ aynı kaydın küratöryal metni "coarse and heavy burlap support" ↔ itwiki "olio su tela" + Gauguin alıntısı "tela di Juta di sacchi" ↔ WD P186 oil paint + canvas (P518 painting support). MFA kaydı İÇİNDE gerilim; ikisi birlikte beyan edilir. **D.** S9, S1, S3, S4. (tartışma)
**C065** — **D3 Boyut:** MFA/WD 139.1 × 374.6 ↔ itwiki 139,1 × 374,5 ↔ enwiki infobox 139 × 375 (yuvarlanmış). Birincil 139.1 × 374.6 esas. **D.** S9, S1, S3, S4. (tartışma)
**C066** — **D4 Merkez figür:** MFA "androgynous standing figure" ↔ enwiki kadın/Eve ("this woman … allegory of Eve", Andersen 1967) ↔ itwiki "giovinetto" (erkek genç; procreazione yorumu) ↔ Gauguin betimi cinsiyetsiz "una figura coglie frutti" ↔ data "Cennet'teki Âdem'i … çağrıştırır". Data'nın "Âdem"i hiçbir çekilen kaynakla desteklenmiyor. **D.** S9, S3, S4, S12. (tartışma)
**C067** — **D5 İdolün kimliği:** MFA/Gauguin "indicates the Beyond" ↔ itwiki "statua blu della dea lunare Hina" + "Hina te Fatou" bağlantısı (Cricco-Di Teodoro) ↔ data "Gauguin'in uydurduğu … gerçek bir Polinezya putu değildir". "Uydurma/gerçek değil" yargısı çekilen hiçbir kaynakta yok. **D.** S9, S3, S4, S12. (tartışma)
**C068** — **D6 Boya uygulaması:** MFA "smooth paint application" (bu esere özgü) ↔ enwiki Style "thick brushstrokes" (sanatçının genel üslubu, atıfsız) ↔ itwiki "carica grezza e veemente delle sue pennellate". Genel–özel farkı olabilir; bu eserde birincil "düzgün uygulama" der. **D.** S9, S3, S4. (tartışma)
**C069** — **D7 Vollard'a giden yol:** MFA/enwiki "Monfreid'e gönderildi → Monfreid + acentesi Vollard'a konsinye" ↔ itwiki "arrotolato e spedito a Parigi al mercante d'arte Ambroise Vollard" (Monfreid aracıları atlanmış). Birincil zincir esas. **D.** S9, S3, S4. (tartışma)
**C070** — **D8 Akım etiketi:** data eser_notlari "Sentetizm'in en görkemli örneğidir" ↔ WD P135 / enwiki "Post-Impressionism" (E1: blog ref + atıfsız infobox). Çekilen hiçbir kaynak "Sentetizm/Synthetism" demiyor; data iddiası kaynaksız. **D.** S12, S1, S3. (tartışma)
**C071** — **D9 Stang başlangıcı:** WD P127 P580 "1920" (precision 9) ↔ MFA "before 1920". WD'nin kesin yılı birincilin kuşkulu ifadesinden daha kesin; birincil esas. **D.** S1, S9. (tartışma)
**C072** — MFA küratöryal değerlendirmesi: "an ambitious effort in decorative mural painting, **no doubt** made with an eye to his artistic legacy" (kuşku ifadesi korundu). **A.** S9.
**C073** — Frizeau'nun 1901'de Vollard'dan alış fiyatı: 2.500 frank. **B.** S3 (Thomson 1987 pp.198–200); S4 ("duemilacinquecento franchi", atıfsız).
**C074** — enwiki'nin hastalık listesi: "eczema, syphilis, and conjunctivitis" (egzama, frengi, konjonktivit). itwiki farklı listeler ("seri problemi al cuore … sifilitico", atıfsız → C044); kesinleştirme yok (E2). **B.** S3 (Andersen 1967).
**C075** — Yorum: başlıktaki üç sorunun yanıtlanmamış bırakılması, izleyiciyi anlam üretimine ortak eden bir estetik strateji olarak okunabilir; MFA'nın "resists easy interpretation" ifadesiyle uyumlu. **C.** S9, S3, S4. (yorum)
**C076** — Yorum: Gauguin'in "librettosuz müzikal şiir" beyanı ile Fontainas'ın "yazıt olmadan allegori anlaşılmaz" eleştirisi, eserin anlam kuramı açısından bir gerilim oluşturur; sanatçı ↔ eleştirmen çatışması olarak okunabilir. **C.** S3, S4. (yorum)
**C077** — Yorum: "bozulmamış tropik cennet" beklentisi ile karşılaşılan sömürge modernitesi arasındaki hayal kırıklığı, eserin melankolik tonunu açıklayan bir çerçeve olarak önerilir; nedensel iddia değildir. **C.** S9, S3. (yorum)
**C078** — Görsel bu oturumda İNCELENMEDİ (vision kotası ana oturumda); yalnız API metadata'sı çekildi; iki Commons dosyası PD; GZ TASLAK. **E.** S5. (belirsiz)
**C079** — Literatür metinlerine erişilmedi: Andersen 1967, Boime 2008, Boyle-Turner 2007, Dorra 2007, Gayford 2006, Gibson 1993, Rousseau 1959, Shackelford 2004, Stuckey 2001, Thomson 1987, Mathews 2001, Messina 2006 (urlmorto), Cricco-Di Teodoro 2012, De Rosa/Loescher PDF, Frèches-Thory 1989, NYT 14 Nis 1936, AAA Seligmann kutu 426; WPI JS kabuğu + arşiv yok; canlı MFA SSL/403. Kaynakçada anıldı, metne erişilmedi. **E.** S3, S4, S9, S10, S11. (belirsiz)
**C080** — Gallery 255 / "ON VIEW" bilgisi 2025-07-19 arşivine aittir; güncel sergileme durumu doğrulanmadı (canlı site engelli). **E.** S9, S6, S7. (belirsiz)
**C081** — enwiki: Monfreid eseri, daha önce gönderilmiş sekiz tematik ilişkili resimle birlikte Vollard'a iletti. **B.** S3 (Boyle-Turner 2007 p.175).

**Sayım:** 81 iddia · A=37 · B=23 · C=3 · D=9 · E=9.

## 3. Görsel doğrulama kaydı (Kural 6)

- **İncelenen bölge: YOK.** Görsel bu oturumda açılmadı/incelemedi (vision kotası ana oturumda). S5 yalnız metadata verdi: dosya 1 (P18) **5400×1987**, PD, credit WPI; dosya 2 **3090×1175**, PD, credit MFA (eski URL). `gorsel.dogrulama.incelenen_bolgeler = []` → `gen.py gz_taslak` GZ sorularını otomatik TASLAK işaretler.
- Kompozisyon/renk/ikonografi betimi **S9 (A) + S3/S4 (B) METNİNDEN**; derslerde "kaynakların betimlediği" kalıbı kullanılır. Doğrudan görsel teyit yapılmadığı not edilir (C078).
- İki dosyanın en-boy oranı farklı (5400/1987 ≈ 2.72 ↔ 3090/1175 ≈ 2.63) ve DateTimeOriginal alanları farklı ("between 1897 and 1898" ↔ "1897"); kadraj/versiyon farkı olabilir, çözülmedi (C060, C061, C063).
- Lisans: **Public domain** (Gauguin ö. 1903; 100+ yıl pma). Görsel projeye kopyalanmadı; derslerde URL + lisans + kaynak referans verilir. Konu Tahiti figürleri ve kısmi nü içerir; betimleme akademik ve açık ayrıntısızdır.

## 4. Kelime/süre sayımı

| Seviye | Hedef (§8) | Ölçülen | Süre |
|---|---|---|---|
| Başlangıç | 400–500 | 438 | 3 dk |
| Orta | 1300–1600 | 1535 | 10 dk |
| İleri | 2600–3200 | 3189 | 20 dk |

`dogrula.py`: bu eser için **0 hata / 0 uyarı** (ayrıntı `KALITE_KONTROL.md`). CJK taraması: **0**. İddia 81 (A37/B23/C3/D9/E9). Birincil MFA **arşivden TAM açıldı (A)**; görsel **İNCELENMEDİ (E)**.

## 5. Veri notları (data/ DEĞİŞTİRİLMEDİ; insan onayına sunulur)

1. **Tarih:** `basyapitlar.json` "1897" + `ders_kaynaklari.json` yil 1897 + `eserler_onbellek.json` yil 1897 ↔ birincil **1897–98** (C003/C063 D). Tek-yıl kesinleştirmesi önerilir.
2. **"Âdem":** `eser_ayrintilari.json` + `yuruyus.json` nokta metni "Cennet'teki Âdem'i ve bilgiyi alma anını çağrıştırır" ↔ MFA "**androgynous**", enwiki **Eve**, itwiki **giovinetto** (C066 D). Data'nın "Âdem"i hiçbir çekilen kaynakla desteklenmiyor; nokta adı "Meyve koparan figür" cinsiyetsiz.
3. **"Sentetizm":** `eser_notlari.json` "Sentetizm'in en görkemli örneğidir" ↔ WD/enwiki Post-Impressionism (C070 D); çekilen kaynaklarda Sentetizm geçmiyor → kaynaksız.
4. **"alegori":** `eser_konulari.json` ↔ WD P136 "genre art" ↔ Gauguin "non ha alcuna allegoria" (C019 E / C039 B). Sınıflama gerilimi; çözüm dayatılmadı.
5. **"uydurma put":** `eser_ayrintilari.json`/`yuruyus.json` "Gauguin'in uydurduğu … Gerçek bir Polinezya putu değildir" → çekilen kaynaklarda destek YOK (C067 D); itwiki Hina der (ders kitabı zinciri), MFA "Beyond" der.
6. **Peru mumyası duruşu:** aynı nokta metni "Yaşlı kadın … Peru mumyalarının duruşundan alınmıştır" → özgül iddia çekilen metinlerde yok (C034 E); Andersen 1967 başlığı + itwiki genel model listesi var. "Beyaz kuş kertenkele tutar / sözlerin boşluğu" kısmı Gauguin alıntısıyla uyumlu (C028 B).
7. **Medium:** `basyapitlar.json` "bir tuval" ↔ MFA katalog "Oil on canvas" + küratöryal "burlap" (C064 D); "yaklaşık 1,4 × 3,7 metre" birincil 139.1 × 374.6 ile uyumlu (yuvarlama).
8. **"üç soruyu yanıtsız bırakır":** `basyapitlar.json` ↔ MFA "resists easy interpretation and singular narrative" ile uyumlu (yorum payı, ihtilaf değil; C048/C075).
9. **Lisans:** `eserler_onbellek.json` `gorsel.l` **boş** → Commons PD teyitli (C020/C060/C061); `gorsel.d` P18 dosyasıyla birebir aynı.
10. **TR ad:** `eser_adlari_tr.json` "Nereden Geliyoruz? Neyiz? Nereye Gidiyoruz?" WD tr etiketiyle uyumlu (C001).
11. **Diğer:** `ders_ayirt_eserleri.json` Post-Empresyonizm akımında listeliyor (WD P135 ile uyumlu ama E1 zinciri zayıf); `eser_zorluk.json` kolaylik 10 (içerik kararı); `muze_numaralari.json`'da Q890678/36.270 kaydı YOK (Gauguin girişi "Fatata te Miti"/NGA) → envanter boşluğu.
