# KANIT DOSYASI — Q28797801 · Horas Kardeşlerin Yemini (The Oath of the Horatii) · Toledo replikası

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md`
**Durum:** İnsan incelemesi bekliyor.
**Araştırma brief'i:** `.qwen/tmp/parti4/Q28797801-brief.md` (kaynak-arastirma agent; ham cache `.qwen/tmp/parti4/`).
**KRİTİK KİMLİK:** Q28797801 = Toledo Museum of Art 1786 replikası (1950.308); Louvre orijinali AYRI öğe Q476458 (INV 3692 / MR 1432). data/ QID eşlemesi hatalı → veri notu (§5), data DEĞİŞTİRİLMEDİ.

---

## 0. Yöntem ve kaynak hiyerarşisi

Görev QID'si Q28797801, Wikidata'ya göre Louvre'daki David orijinali DEĞİL, Toledo Museum of Art'taki 1786 tarihli küçültülmüş replikadır (P195=Q1743116 Toledo, P217=1950.308, P571=1786, P170=Girodet + P1877 "after a work by" David). Louvre orijinalinin QID'si Q476458'dir (enwiki pageprops wikibase_item; Louvre kaydıyla doğrulandı). Her iki varlık da araştırıldı; ders, Horas kompozisyonu/ikonografisi/Neoklasisizm manifestosunu öğretir (her iki versiyonda aynı), AMA künyede Q28797801'in Toledo replikası olduğunu açıkça beyan eder ve Louvre orijinalini karşılaştırma/not olarak verir.

**Birincil kaynaklar AÇILDI:** Louvre collections notice cl010062239 (HTML S10 + JSON S11, 200); Toledo eMuseum Wayback 2025-09-01 (S9, 200; canlı S8 Cloudflare 403); Toledo Provenance Report PDF Wayback 2012-12-24 (S15, 200; s.13, 1950.308 girişi). Bu üç birincil kayıt künye/provenance/sipariş/imza/boyut için A düzeyi kanıt sağlar. Wikidata (S1/S2/S3/S4) yardımcı/ikincil; en/it Vikipedi (S6/S7) ikincil; Commons imageinfo (S13/S14) görsel metadata.

**Görsel İNCELENMEDİ (vision kotası ana oturumda); yalnızca metadata + lisans + çözünürlük kullanıldı; GZ TASLAK.** Kompozisyon betimi kaynak metinlerinden (S6/S7/S9); doğrudan görsel teyit yok.

**Yedi ihtilaf (D):** D1 kimlik (C037), D2 atıf (C038), D3 tarih (C039), D4 boyut (C040), D5 görsel kimliği (C041), D6 metadata (C042), D7 ikonografi (C043). **Belirsizlikler (E) aynen korundu:** "reportedly" (E1/C033), "probablement" (E2/C025), "perhaps" (E3/C020), {{Citation needed}} (E4/C027+C044), site banner (E5/C045), kaynaksız lead (E6/C046), ham PDF çıkarımı (E7/C047), zayıf WD ref (E8/C048), erişilmeyen kitaplar (E9/C049), WD eksik alanlar (E10/C050), Toledo lisans (E11/C051).

## 1. Kaynak envanteri (tüm erişimler 2026-11-14)

| ID | Kurum | Belge | URL | Erişim | Tür |
|---|---|---|---|---|---|
| S1 | Wikidata | Q28797801 EntityData | https://www.wikidata.org/wiki/Special:EntityData/Q28797801.json | 200 | yardımcı |
| S2 | Wikidata | Q83155 EntityData (David'in kendisi) | https://www.wikidata.org/wiki/Special:EntityData/Q83155.json | 200 | yardımcı |
| S3 | Wikidata | Q476458 EntityData (Louvre orijinali) | https://www.wikidata.org/wiki/Special:EntityData/Q476458.json | 200 (30 sn backoff) | yardımcı |
| S4 | Wikidata | wbgetentities etiketler (18 QID + P1877) | https://www.wikidata.org/w/api.php?action=wbgetentities&ids=… | 429→backoff→200 | yardımcı |
| S5 | Wikipedia EN | pageprops "Oath of the Horatii" (wikibase_item=Q476458) | https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&titles=Oath%20of%20the%20Horatii | 429→200 | yardımcı |
| S6 | Wikipedia EN | "Oath of the Horatii" wikitext (Q476458; Q28797801 sitelink YOK) | https://en.wikipedia.org/w/api.php?action=parse&page=Oath%20of%20the%20Horatii&prop=wikitext&formatversion=2&redirects=1 | 429×2→backoff→200 | ikincil |
| S7 | Wikipedia IT | "Il giuramento degli Orazi" wikitext (Q476458) | https://it.wikipedia.org/w/api.php?action=parse&page=Il%20giuramento%20degli%20Orazi&prop=wikitext&formatversion=2&redirects=1 | 200 | ikincil |
| S8 | Toledo Museum of Art | eMuseum canlı sayfa | https://emuseum.toledomuseum.org/objects/55069/the-oath-of-the-horatii | **403** (Cloudflare challenge) | birincil (ERİŞİLEMEDİ) |
| S9 | Toledo Museum of Art | eMuseum Wayback kopyası (arşiv 2025-09-01, ts 20250901121209) | http://web.archive.org/web/20250901121209/https://emuseum.toledomuseum.org/objects/55069/the-oath-of-the-horatii | 200 | **birincil (arşiv)** |
| S10 | Musée du Louvre | Collections notice HTML (WD S3 referansından bulundu) | https://collections.louvre.fr/ark:/53355/cl010062239 | 200 | **birincil** |
| S11 | Musée du Louvre | Notice JSON (S10 sayfa içi bağlantı) | https://collections.louvre.fr/ark:/53355/cl010062239.json | 200 | **birincil** |
| S12 | Musée du Louvre | Eski oeuvre-notices URL'si | https://www.louvre.fr/en/oeuvre-notices/oath-horatii | 200 ama → /en/explore/the-palace/think-big (notice ÖLÜ) | birincil (yönlendirme) |
| S13 | Commons | imageinfo: GAP dosyası (Q28797801 P18) | https://commons.wikimedia.org/w/api.php?action=query&titles=File:Jacques-Louis%20David%20-%20Oath%20of%20the%20Horatii%20-%20Google%20Art%20Project.jpg&prop=imageinfo&iiprop=url|size|extmetadata | 429→backoff→200 | görsel |
| S14 | Commons | imageinfo: INV 3692 dosyası (Q476458 P18) | https://commons.wikimedia.org/w/api.php?action=query&titles=File:Le%20Serment%20des%20Horaces%20-%20…%20INV%203692%20;%20MR%201432.jpg&prop=imageinfo&iiprop=url|size|extmetadata | 200 | görsel |
| S15 | Toledo Museum of Art | "Provenance Report" PDF, Wayback (arşiv 2012-12-24, ts 20121224083005; s.13) | https://web.archive.org/web/20121224083005if_/http://www.toledomuseum.org:80/wordpress/wp-content/uploads/Provenance-Research-lowres.pdf | 200 (1.903.464 bayt) | **birincil (arşiv)** |
| S16 | archive.org | Wayback availability API (eMuseum + IIIF) | https://archive.org/wayback/available?url=… | 200×2 | yardımcı |
| S17 | Toledo Museum of Art | IIIF manifest (S9 sayfa içinden) | https://emuseum.toledomuseum.org/apis/iiif/presentation/v2/1-objects-55069/manifest | arşiv kopyası YOK; canlı Cloudflare | görsel (ERİŞİLEMEDİ) |

**Erişilemeyenler:** S8 canlı eMuseum 403 (Cloudflare); S12 eski Louvre notice ölü yönlendirme; S17 IIIF arşivde yok, canlı host Cloudflare. WMF API'leri 429 → backoff (25–90 sn) + tanımlayıcı UA ile 200. S15 PDF metni zlib ile ham çıkarıldı (pdftotext/pypdf yok); kritik giriş iki varyanttan çapraz okundu, görsel doğrulama yapılmadı (E7). Kitap/makale tam metinleri erişilmedi; yalnızca bibliyografya/ref zinciri (E9).

## 2. İddia envanteri (A–E)

**C001** — Q28797801 = Toledo'daki 1786 replika (1950.308); Louvre orijinali değil. WD desc "painting by Anne-Louis Girodet…"; P195 Q1743116; P217 "1950.308"; S9 "Object number 1950.308". **A.** S1, S9.
**C002** — Louvre orijinali Q476458; başlık "Le serment des Horaces, entre les mains de leur père"; David; INV 3692 / MR 1432; ilgili eskiz RF 47 (1784, relatedWork cl010066868). **A.** S5, S10, S11.
**C003** — Toledo kaydı: Artist "Jacques-Louis David (French, 1748-1825)", 1786, oil on canvas, Painting 130.2 × 166.7 cm (51 1/4 × 65 5/8 in.), Frame 165.1 × 201.3 × 10.8 cm, "Not on View"; Credit Line "Purchased with funds from the Libbey Endowment, Gift of Edward Drummond Libbey". **A.** S9.
**C004** — Louvre: Hauteur 3,3 m / Largeur 4,25 m (avec accessoire 3,85 × 4,7 m); huile sur toile; imza sol altta "L. David faciebat/ ROMAE anno/ MDCCLXXXIV."; David (Paris 1748 – Bruxelles 1825). **A.** S10, S11.
**C005** — Toledo replikası sol altta "J.L. David faciebat / Parisiis / anno MDCCLXXXVI" imzalı (Paris, 1786) — ham zlib çıkarımı (E7). **A.** S15.
**C006** — Louvre: Salle 702 (Salle Daru, néoclassicisme), Denon, Niveau 1; Propriétaire Etat; affectataire Musée du Louvre Département des Peintures; edinim "entrée - Collection de Louis XVI". **A.** S10, S11.
**C007** — WD Q28797801: P170 Girodet (Q433434) + P1877 "after a work by" David (Q83155); P571 1786 (ref eMuseum, P813 2019-12-16); P127 Wildenstein & Company (Q10288082) P585=1937; P195 P580=1950. **B.** S1, S4.
**C008** — WD Q476458: P195=Q3044768 (Department of Paintings of the Louvre), P217=INV 3692 / MR 1432, P276=Q4032340 (Room 702), P127=French State → Louvre kaydıyla birebir uyumlu. **A.** S3, S10.
**C009** — Konu: Roma–Alba Longa savaşında üç Horatii kardeşin üç Curiatii ile düellosu; Tullus Hostilius dönemi, MÖ 7. yy anlatısı. **B.** S6, S7, S9.
**C010** — Yazınsal kaynaklar: Livius I.24–26; Dionysios Halikarnassos, Roman Antiquities III (S6 ← Marvin & Thomas 2006, Ashgate, s.102–103, ISBN 9780754650980; kitaba erişilmedi). **B.** S6.
**C011** — Corneille'in Horace trajedisi + Poussin etkisi; David'e atfedilen söz "Se devo il tema a Corneille, devo il quadro a Poussin" (S7 ← Sarpe 1984 s.836–837, ISBN 84-7291-594-8 + Sansoni 1964 s.68; erişilmedi). **B.** S7.
**C012** — Yemin anı David'in kendi icadı (antik kaynaklarda bu sahne yok) (S6 ← Winkler 2009, The Roman Salute, s.42–56, ISBN 9780814208649 + Crow 1985 s.213–214; erişilmedi). **B.** S6.
**C013** — Toledo Label Text: kardeşler babaları önünde ölümüne dövüş yemini eder; "rhythmic composition inspired by classical relief sculpture"; erkeklerin gergin duruşu ↔ kadınların yaslı çöküşü ("slumped in grief and resignation"); Devrim öncesi "restrained emotion, order, and the sacrifice of the individual for the good of the state". **A.** S9.
**C014** — Aile bağları: Sabina (Horatius'un eşi, Curiatii kız kardeşi), Camilla (Horatii kız kardeşi, Curiatii nişanlısı); sağ kalan kardeş Camilla'yı öldürür (resimde DEĞİL, anlatının devamı); David başlangıçta bu sahneyi düşünmüş, vazgeçmiş; Brutus (1789, kraliyet siparişi) benzer tema; Voltaire Brutus trajedisi. **B.** S6, S7, S9.
**C015** — Toledo replikası orijinalden farkı: kadınların ayakları dibinde iplik sarılı distaff (kirmen); PDF "a detail to establish the originality of the picture"; "close to the original, except…". **A.** S9, S15.
**C016** — Kompozisyon: solda üç kardeş, ortada üç kılıç tutan baba, sağda üç kadın + iki çocuk; kaçış noktası kılıçların tutulduğu elin önünde; erkekler düz/sert, kadınlar eğri çizgiler (S6 ← Boston College web + S7 ← A. Cocchi, geometriefluide.com). **C.** S6, S7. (yorum)
**C017** — itwiki: baba "O Roma o morte" der (kaynak gösterilmemiş). **C.** S7. (yorum)
**C018** — Uzatılmış kol jesti (avuç içi aşağı) → Roman selamı → faşist İtalya ve Nazi Partisi sahiplenmesi (S6 ← Winkler 2009). **B.** S6.
**C019** — Neoklasisizmin "manifesto"/paragonu sayılması: itwiki lead (kaynaksız), enwiki "paragon" (BC web); akademik çıpa Crow 1978 (Art History, s.424–471) + Crow 1985 — Louvre bibliyografyasında ve enwiki ref'lerinde ANILDI, metne erişilmedi (zincir). **B.** S6, S7, S9, S10.
**C020** — Teknik okumalar: görünmez fırça izleri, donuk renkler, üç sayısı simgesi, "dondurulmuş" an; iki eğri bir düz kılıç "perhaps foreshadowing that only one brother would survive" (E3 korundu). **C.** S6. (yorum)
**C021** — itwiki: diyagonaller babanın sol yumruğunda birleşir; Caravaggio dersi ışık/gölge; soğuk ön plan ışığı; Rococo reddi; sütunlar Tuscan ("non doriche come potrebbe sembrare"); kahverengi/gri palet + kırmızı/azur/beyaz/sarı notalar; baba pelerini kırmızı (S7 ← Cocchi + Morante, ölü→arşiv 2016-05-18). **C.** S7. (yorum)
**C022** — Kraliyet siparişi (ORİJİNAL): Louis XVI, d'Angiviller (1730–1809, directeur des Bâtiments du roi) aracılığıyla, 1781 sonu/1782 başı; özgün konu "Horace vainqueur" 330×330 cm, 25 Ağustos 1783 Salonu için; David erteler (Andromaque kabul parçası, 1783); Temmuz 1784 Roma izni; konu+boyut değiştirilir. **A.** S10.
**C023** — Toledo replikası kraliyet siparişi DEĞİL: "a reduced replica ordered from David by the high-ranking courtier Comte de Vaudreuil"; PDF "Painted for the Comte de Vaudreuil, 1786". **A.** S9, S15.
**C024** — enwiki: sipariş "allegory about loyalty to the state and therefore to the king" niyetiyle; David agreed-upon scene'den ayrıldı (paragraf sonu {{Citation needed|date=April 2025}}). **C.** S6. (yorum)
**C025** — İcra: Roma'da "probablement durant le premier semestre de l'année 1785 et achevé en juillet 1785" (E2 korundu); Roma atölyesinde (Piazza del Popolo yakını) Ağustos 1785 ilk yarısı sergileme; Ağustos sonu/Eylül başı Paris'e nakil; Salon 1785 (Eylül ortasından), Salon carré, livret no.103: "Ce tableau de 13 pieds de long, sur 10 de haut, est pour le Roi". **A.** S10.
**C026** — Roma'da ilk sergilemede Papa da izleme talebi; Salon 1785'e geç teslim (S6 ← Crow 1985, Painters and Public Life, s.213–214, Yale UP; erişilmedi). **B.** S6.
**C027** — Salon'da önce kötü konuma asıldı, halk tepkisiyle taşındı (S6 {{Citation needed|date=February 2024}}). **E.** S6. (belirsiz)
**C028** — Louvre kaydı Toledo replikasını doğrular: "repris par l'artiste à l'issue de l'exposition pour en faire une répétition (Toledo Museum of Art)". **A.** S10.
**C029** — Orijinalin sonraki hayatı: David'in Louvre atölyesinde 1785 sonbahar–Ağustos 1791; Salon 1791 no.134; "Brutus" (INV 3693) ile birlikte; Muséum talepleri (1797, 1801×2, 1802, 1803); Lüksemburg'da 29 Ocak 1804'ten; musée royal du Luxembourg (24 Nisan 1818); Louvre'a 7 Ocak 1826 nakil, Mart 1826'dan sergide; Temmuz 1948 Michel Zezzos restorasyonu (allégement du vernis). **A.** S10.
**C030** — Toledo provenans zinciri (PDF s.13): Vaudreuil 1786 → Lebrun açık artırma Paris 26 Kasım 1787 lot 107 ("as by David") → satıcı Lebrun → "sold to Didot" (1794'e dek) → Firmin-Didot ailesi → 1880 Hyacinthe Didot → 1913'e dek Louis Delamarre → Baronne Eugène d'Huart → Paul Roux et al satışı Paris 14 Aralık 1936 (lot no çıkarımda eksik, E7) → 1937 Wildenstein Paris/New York → 1950 Toledo. **A.** S1, S15.
**C031** — Toledo sergileme tarihi: 1826 Galerie Lebrun no.40 ("as by David, entirely retouched by him five years after 1786"); 1913 Petit Palais "David et ses élèves" no.25 ("as by Girodet, retouched by David"); 1937 Chefs d'Oeuvres no.293; 1964 Cleveland no.114 (as by David); 1968 Royal Academy no.179 (as by David); 2005–06 Girodet sergisi cat.3; 2010–11 Antiquity Revived cat.89 (yalnız Houston). **A.** S9.
**C032** — Toledo'nun listelediği atıf literatürü ikiye bölünmüş: Landon 1814 "excellent copy by Girodet"; Chaussard 1824 "as by David"; Bellier de la Chavignerie 1868 "as nearly wholly by Girodet"; Jules David 1880 "as by Girodet, retouched by David"; Cantinelli 1930 "as by Girodet"; Holma 1940 "as by David"; Hautecoeur 1954 "as by Girodet"; Crow 1995 Emulation "(as Girodet)"; 1785 Dialogues sur le Salon "une réduction du 'Serment des Horaces' peinte par Girodet"; Burlington Magazine 1965 Wittmann–Rosenblum mektuplaşması. Comparative References: Johnson 1989 (Art Bulletin), Crow 1985, Wind 1940–41, Rosenblum 1970, Stewart 2001 (liste; metne erişilmedi). **A.** S9, S10.
**C033** — Toledo label: Girodet katılımı "reportedly assisted" (kesin değil, E1 korundu): "David's pupil Anne-Louis Girodet (1767–1824) reportedly assisted in making this version." **A.** S9.
**C034** — GAP Commons dosyası Toledo kopyasının taraması: ObjectName "Copy of the Oath of the Horatii - made by Girodet"; ImageDescription "Copy of the painting now in the Louvre made in 1786 to the Comte de Vaudreuil"; Artist "Anne-Louis Girodet / After Jacques-Louis David"; 6156×4800; PD (PD-old-100-expired / PD-Art); Credit "KwHkqyZxc2i04A at Google Cultural Institute". **A.** S13.
**C035** — INV 3692 Commons dosyası Louvre orijinalinin fotoğrafı: "photo Shonagon 2025-03-15"; 10051×7794; PD-Art (PD-old-auto-expired); DateTimeOriginal "between 1784 and 1785" (P1319=1784, P1326=1785). **A.** S14.
**C036** — Louvre'nun kendi site görselleri TELİFLİ: "© 2018 GrandPalaisRmn (musée du Louvre) / Michel Urtado" (+ © 2002 Angèle Dequier, © 1988 Blot/Jean). **A.** S11.
**C037** — D1 KİMLİK ihtilafı: görev öncülü + data/ Q28797801'i "David, 1784, Louvre" kullanıyor ↔ S1/S9 Q28797801 = Toledo replikası (1786, 1950.308, WD Girodet); Louvre orijinali Q476458 (S5/S10); data'da iki QID aynı Türkçe başlıkla çift kayıtlı. **D.** S1, S5, S9, S10. (tartışma)
**C038** — D2 ATIF ihtilafı (Toledo tuvali): S9 Artist="David" + label "Girodet reportedly assisted" ↔ S1 P170=Girodet (tek yaratıcı, "after a work by" David) ↔ S13 "Anne-Louis Girodet / After Jacques-Louis David" ↔ S6 altyazı "painted in 1786 by David and his pupil Girodet" ↔ S10 "répétition"ı David'e atfeder ↔ S15 Artist="DAVID, JACQUES-LOUIS" (Girodet yok) ↔ S9 literatür ikiye bölünmüş (C032). Çözüm önerisi YOK; müze kaydı birincil, WD tek-atıf Girodet tartışmalı. **D.** S1, S6, S9, S10, S13, S15. (tartışma)
**C039** — D3 TARİH ihtilafı (orijinal): imza/resmî 1784 (S10 "4e quart du XVIIIe siècle (1784)", S11 startYear=1784, S7 "realizzato nel 1784") ↔ S10 Historique "peint à Rome probablement … 1785 … achevé en juillet 1785"; S6 lead "painted in 1784 and 1785"; S14 "between 1784 and 1785". data "1784'te Roma'da tamamlayıp" Louvre historique ile çelişir. **D.** S6, S7, S10, S11, S14. (tartışma)
**C040** — D4 BOYUT ihtilafı: Louvre S10 3,3×4,25 m ↔ S6 infobox 329.8×424.8 cm (~2 mm yuvarlama); Toledo S9 130.2×166.7 cm ↔ S15 (2012) 130.2×166.2 cm; inç her ikisinde 51 1/4 × 65 5/8 (=166.69 cm → 166.7 tutarlı; PDF olası dizgi hatası). **D.** S6, S9, S10, S15. (tartışma)
**C041** — D5 GÖRSEL KİMLİĞİ ihtilafı: "Jacques-Louis David - Oath of the Horatii - Google Art Project.jpg" dosya adı David/Louvre izlenimi verir ↔ S13 metadata Toledo/Girodet kopyası (ObjectName, ImageDescription, "Google Art Project works in The Toledo Museum of Art" kategorisi); data/ bu dosyayı Louvre orijinali girişi için kullanıyor (eserler_onbellek/yerel_gorseller hash da3c66750a298310/eser_ayrintilari/eser_turleri) → uygulamanın "Louvre başyapıtı" görseli fiilen Toledo replikası. **D.** S1, S13. (tartışma)
**C042** — D6 METADATA ihtilafı: S10 HTML "Dernière mise à jour le 23.02.2026" ↔ S11 JSON "modified: 2026-08-11". **D.** S10, S11. (tartışma)
**C043** — D7 İKONOGRAFİ ihtilafı (küçük): S7 "non piangono neppure" (kadınlar ağlamaz bile) ↔ S6 "weeping and mourning" / "three women are weeping" ↔ S9 "slumped in grief and resignation". İkincil kaynaklar arası yorum farkı. **D.** S6, S7, S9. (tartışma)
**C044** — E4: enwiki {{Citation needed}} (a) Enlightenment/Devrim gerilimi yorumu (April 2025), (b) David'in National Assembly'de XVI. Louis'nün idamına oy verdiği (April 2025) — kanıt yetersiz. **E.** S6. (belirsiz)
**C045** — E5: S10 site banner "les informations … notamment leur localisation en salle … susceptibles de ne pas être à jour"; altbilgi "Le contenu de cette notice ne reflète pas nécessairement le dernier état des connaissances". Salle 702 bilgisi bu uyarıyla verilmeli. **E.** S10. (belirsiz)
**C046** — E6: S7 lead "manifesto importante del Neoclassicismo" satır içi kaynaksız; "O Roma o morte" kaynaksız; S6 "paragon" yalnızca Boston College web'ine dayanır (üçüncül). **E.** S6, S7. (belirsiz)
**C047** — E7: S15 metni zlib ile ham çıkarıldı; imza "MDC - CLXXXVI" gibi bölünmüş; 14 Aralık 1936 Paul Roux satışının lot numarası çıkarımda boş; PDF görsel olarak doğrulanmadı. **E.** S15. (belirsiz)
**C048** — E8: S3 Q476458 P571 referansı zayıf: beckchris.wordpress.com (blog) + Q97309629 (etiketi çözülemedi); P135 referansı da aynı blog. Tarih için S10 birincil alınmalı. **E.** S3. (belirsiz)
**C049** — E9: Kitap/makaleler yalnızca erişilen kayıtların bibliyografya/ref'lerinde ANILDI, metne erişilmedi: Crow 1978 (Art History), Crow 1985 (Yale UP), Crow 1995 (Emulation), Winkler 2009, Marvin & Thomas 2006, Sarpe 1984, Sansoni 1964, Wind 1941, Johnson 1989, Stewart 2001, Rosenblum 1970. **E.** S6, S7, S9, S10. (belirsiz)
**C050** — E10: S1 Q28797801'de P186/P2048/P2049 yok; S13 kategorileri "Artworks with Wikidata item missing dimensions/medium/genre"; WD'den boyut/teknik çekilemez, birincil S9 kullanılmalı. **E.** S1, S13. (belirsiz)
**C051** — E11: S9 görselinin lisansı sayfada belirtilmemiş ("Rights and Reproductions" bağlantısı var); IIIF manifest (S17) arşivde yok, canlı host Cloudflare; Toledo görselinin kullanım hakkı doğrulanamadı. **E.** S9, S16, S17. (belirsiz)
**C052** — Görseller bu oturumda İNCELENMEDİ (vision kotası); iki Commons dosyası PD metadata only; GZ TASLAK; kompozisyon kaynak metinlerinden. **E.** S13, S14. (belirsiz)
**C053** — Erişim engelleri: S8 canlı eMuseum 403 (Cloudflare); S12 eski Louvre notice ölü yönlendirme (→ think-big); S17 IIIF arşivde yok; S9/S10/S11/S15 birincil arşiv/kayıt ile aşıldı. **E.** S8, S12, S16, S17. (belirsiz)
**C054** — enwiki "Comparisons" galerisi yemin/kabartma öncüllerini listeler: Gavin Hamilton "The Oath of Brutus" (1763–64), Füssli "Rütlischwur" (1780), Parthenon frizi, Asur okçu kabartması (~MÖ 728), Lille PdBA David çizimi, Carnavalet saat versiyonu. **B.** S6.
**C055** — Felsefi yorum (ödünç lens): Kantçı ödev↔eğilim çerçevesiyle kamusal görev ↔ özel duygu okuması; toplumsal cinsiyet lensiyle eril/dişil alan kodlanması; David'in bu düşünürlerden etkilendiği iddiası YOK. **C.** S6, S9. (yorum)
**C056** — Felsefi yorum (ödünç lens): Benjamin "aura" kavramıyla orijinal↔replika ilişkisi; kirmen detayının "originality" iddiası (C015) üzerinden kopyanın aura iddiası; Benjamin bu eser hakkında yazmamıştır, lens ödünç. **C.** S9, S15. (yorum)
**C057** — David kariyeri: 1774 Prix de Rome; 1775–1780 Roma'da Fransız hükümeti öğrencisi; Paris dönüşü Diderot beğenisi; Louis XVI Louvre'da konut ayrıcalığı; Pecoul'un kızıyla evlilik; Roma'da Drouais ziyareti; Oath'ın başarısı ününü artırdı, kendi öğrencilerini alabildi (Girodet bu atölyenin öğrencisi). **B.** S6, S9, S2.

**Sayım:** 57 iddia · A=21 · B=11 · C=7 · D=7 · E=11.

## 3. Görsel doğrulama kaydı (Kural 6)

- **S13 GAP dosyası (Q28797801 P18):** "Jacques-Louis David - Oath of the Horatii - Google Art Project.jpg"; 6156×4800 px, 5.772.683 bayt; PD (PD-old-100-expired / PD-Art; Copyrighted=False; AttributionRequired=false); ObjectName "Copy of the Oath of the Horatii - made by Girodet"; Artist "Anne-Louis Girodet / After Jacques-Louis David"; Credit "KwHkqyZxc2i04A at Google Cultural Institute". **Dosya adı yanıltıcı (D5); metadata Toledo replikasını işaret eder.**
- **S14 INV 3692 dosyası (Q476458 P18):** "Le Serment des Horaces - Jacques-Louis David - Musée du Louvre Peintures INV 3692 ; MR 1432.jpg"; 10051×7794 px, 13.509.855 bayt; PD-Art; "photo Shonagon 2025-03-15"; DateTimeOriginal "between 1784 and 1785". Louvre orijinalinin fotoğrafı.
- **S11 Louvre site görselleri:** TELİFLİ (© 2018 GrandPalaisRmn / Michel Urtado; © 2002 Angèle Dequier; © 1988 Blot/Jean) → PD değil; Commons PD tercih edilmeli (C036).
- **S9 Toledo eMuseum görseli:** "1950_308 primary.jpeg" (Original 2000×2000); lisans sayfada yok (E11/C051); IIIF (S17) erişilemedi.
- **Vision kotası ana oturumda → görseller İNCELENMEDİ (C052 E).** Kompozisyon S6/S7/S9 METNİNDEN. **GZ TASLAK.** Görsel projeye kopyalanmadı; URL+lisans+kaynak referans verildi. İnsan editör görsel teyidi ZORUNLU (özellikle D5 görsel kimliği ve kirmen detayı).

## 4. Kelime/süre sayımı

| Seviye | Hedef | Ölçülen |
|---|---|---|
| Başlangıç | 400–500 | 427 |
| Orta | 1300–1600 | 1327 |
| İleri | 2600–3200 | 3100 |

dogrula.py: **Q28797801 için 0 hata / 0 uyarı** (global 10 hata başka eserlerin — Q1978815/Q29530/Q4388208/Q956541 — eksik dosyaları; bu esere ait değil, dokunulmadı) · CJK: 0 · iddia 57 (A21/B11/C7/D7/E11) · CS10 DY5 AU5 GZ5 TK5 (CS/DY/GZ/TK kanıt yalnız A/B) · GZ TASLAK (incelenen_bolgeler=[]) · durum "İnsan incelemesi bekliyor". Birincil Louvre (S10/S11) + Toledo Wayback (S9) + Provenance PDF (S15) AÇILDI (A); görsel İNCELENMEDİ (E).

## 5. Veri notları (data/ SALT-OKUNUR; hiçbir dosya değiştirilmedi; insan onayına sunulur)

1. **QID yanlış eşleme (D1/C037):** `basyapitlar.json` (anahtar Q28797801), `harita.json` + `harita_motifler.json` ("jacques-louis-david:Q28797801"), `ders_ayirt_eserleri.json`, `ders_kaynaklari.json`, `eserler_onbellek.json` → hepsi Louvre orijinalini anlatırken Q28797801'i kullanıyor. Doğru QID: **Q476458**. Öneri: anahtarların Q476458'e taşınması VEYA Q28797801 kaydının Toledo replikası olarak yeniden yazılması (karar ana oturumun).
2. **Çift kayıt:** `eser_adlari_tr.json` hem Q28797801 hem Q476458 → "Horas Kardeşlerin Yemini (Le Serment des Horaces)"; `eser_konulari.json` ikisi de {"t":"tarih","k":"oath-of-the-horatii"}; `eser_zorluk.json` ikisi de 10; `ikonografi.json` aynı motife iki QID.
3. **Görsel yanlış esere bağlı (D5/C041):** `yerel_gorseller.json` "commons:Jacques-Louis_David_-_Oath_of_the_Horatii_-_Google_Art_Project.jpg" → hash `da3c66750a298310`; `eser_ayrintilari.json` Q28797801 gorsel=`da3c66750a298310`; `eser_turleri.json` aynı dosya → Q28797801. Bu dosya Commons metadata'sına göre **Toledo replikası**; Louvre orijinali girişi için INV 3692 dosyası (10051×7794, PD) kullanılmalı.
4. **Tarih ifadesi (D3/C039):** `basyapitlar.json`/`harita*.json` "1784'te Roma'da tamamlayıp 1785 Salonu'nda sergilediği" → Louvre historique "probablement … juillet 1785"; imza 1784. "yaklaşık 1784" kabul edilebilir ama "1784'te tamamlandı" birincil kayıtla çelişir.
5. **Konum:** `harita_motifler.json` "Louvre'dadır" → Q476458 için doğru (Salle 702, E5/C045 uyarısıyla); Q28797801 için yanlış (Toledo, "Not on View").
6. **Önceki doğrulama güvenilmez:** `ders_kaynaklari.json` kanit_adaylari id `5fd8ca5471` durum="dogrulandi" — QID eşleşmesi hatalı olduğundan bu doğrulama bayrağı geçersiz aday (bağımsız denetim kuralı gereği yeniden kanıtlandı).
7. **Eksik künye:** `kunye.json`, `muze_numaralari.json`, `gorsel_kaynagi.json`, `ders_dogrulama.json`, `eser_duzeltmeleri.json` dosyalarında Q28797801/Q476458/INV 3692/1950.308 için kayıt YOK.
8. **Sipariş ayrımı (C022/C023):** "kraliyet siparişi" yalnızca orijinal (Q476458) için geçerli (Louis XVI/d'Angiviller); Q28797801 Vaudreuil siparişi. Derslerde karıştırılmamalı.
9. **WD eksik alanlar (E10/C050):** WD Q28797801'de boyut/teknik yok; data bu alanları birincil Toledo kaydından (S9) almalı.
10. **data "bak" hotspot'u kirmeni tarif ediyor:** `basyapitlar.json` Q28797801 "bak" alanında "Yere bırakılmış yün eğirme aleti" (distaff) geçer — bu, Toledo replikasına özgü detaydır (C015); Louvre orijinalinde yoktur. Yani data'nın görsel hotspot'u fiilen replikayı tarif ederken künye Louvre orijinalini iddia ediyor (D1/D5 ile tutarlı ek kanıt).
