# KANIT DOSYASI — Q23008305 · Satranç Oynayan Kız Kardeşler (Gra w szachy / Partita a scacchi / The Chess Game) · Sofonisba Anguissola

**Tarih:** 14 Kasım 2026 · **Parti:** 2 · **Standart:** `../../AKADEMIK_STANDART.md`
**Durum:** İnsan incelemesi bekliyor.
**Araştırma brief'i:** `.qwen/tmp/parti2/Q23008305-brief.md` (kaynak-arastirma agent; ham cache `.qwen/tmp/parti2/Q23008305-*`).

---

## 0. Yöntem ve kaynak hiyerarşisi

Eser bir tuvaldir (Muzeum Narodowe w Poznaniu). **Birincil müze sayfası (S6, mnp.art.pl) AÇILDI: HTTP 200, 78.578 bayt, canlı.** URL tahmin edilmedi; Wikidata P571 referansındaki P854/P973 alanından bulundu (en/it/pl wiki refs'lerinde ve Commons credit/source alanında müze katalog URL'si YOK; Commons source = fotoğrafçı kredisi). Bulgu yolu brief'te açıkça beyan edildi.

S6'dan **A** düzeyinde doğrulananlar: sanatçı/imza, 1555 + yazıt MDLV, teknik "olej i tempera na płótnie", 72 × 97 cm, MNP konumu, Raczyński Vakfı mülkiyeti, yazıtın "ex vera effigie" içeriği, Vasari'nin Cremona baba evinde görüşü ve övgüsü, konservasyon (rentgen + stratigrafi) bulguları, meşe sembolü, **biyografi (1532 Cremona – 1625 Palermo; Campi eğitimi; Michelangelo/Leonardo etkileri; II. Felipe sarayı; Van Dyck ziyareti; unutulma; Polonya'da iki eser)**.

**Görsel İNCELENMEDİ** (vision kotası ana oturumda); yalnız metadata/lisans/çözünürlük çekildi (S7/S8/S9). Kompozisyon/jest/renk betimleri kaynak metinlerine dayanır ("kaynakların betimlediği"); **GZ TASLAK**.

**11 D ihtilaf (C032–C042) + 16 E belirsizlik (C022, C043–C057)** brief'ten AYNEN korundu (circa/forse/vielleicht/perhaps/zapewne/być może/mogłoby). Kritik D'ler: Vasari 1556↔1566; yazıt 3+ transkripsiyon (MDLV↔MDVL, ANCILLAM↔ANCILAM); teknik "oil on canvas"↔"oil+tempera"; 1823 Berlin↔Paris; hizmetçinin ilk yeri sol↔orta; WD "checkmate"↔imkânsız diziliş.

**Denetim B (bağımsız geri dönüş):** Ham cache'ler 14 Kasım 2026'da yeniden açıldı — S6 (mnp.txt), S3/S4/S5 (en/it/pl wikitext), S7/S8/S9 (Commons imageinfo + filepage), S10/S11/S12 (bastek/niezlasztuka/burke txt). Künye/yazıt/konservasyon/mülkiyet/biyografi S6'dan teyit; wiki/blog iddiaları ilgili pasajlarla karşılaştırıldı. **Ek bulgu:** itwiki, plwiki ve Niezła Sztuka yazıtta "ANCILAM" (tek L), enwiki "ANCILLAM" (çift L) yazıyor → D004'e ek varyant notu (brief D004 tablosu S3/S4/S5/S11 için "ANCILLAM" der; ham metin tek L gösterir). Burke gövdede "panel" der (D002); S6 birincil "tuval" der.

## 1. Kaynak envanteri

| ID | Kurum | Belge | URL | Erişim (14 Kas 2026) | Tür |
|---|---|---|---|---|---|
| S1 | Wikidata | EntityData Q23008305 JSON | https://www.wikidata.org/wiki/Special:EntityData/Q23008305.json | 200 | yardımcı |
| S2 | Wikidata | wbgetentities labels (iddia değer QID'leri) | https://www.wikidata.org/w/api.php?action=wbgetentities | 200 | yardımcı |
| S3 | Wikipedia (en) | The Game of Chess wikitext (action=parse, redirects=1) | https://en.wikipedia.org/w/api.php | 200 (wikitext) | ikincil |
| S4 | Wikipedia (it) | Partita a scacchi wikitext | https://it.wikipedia.org/w/api.php | 200 (wikitext) | ikincil |
| S5 | Wikipedia (pl) | Gra w szachy wikitext | https://pl.wikipedia.org/w/api.php | 200 (wikitext) | ikincil |
| S6 | Muzeum Narodowe w Poznaniu | "Sofonisba Anguissola, Gra w szachy, 1555" (eğitim 18; haz. K. Drozdowska-Sawińska) | https://mnp.art.pl/sofonisba-anguissola-gra-w-szachy-1555 | 200 (78.578 bayt, canlı; URL P854/P973'ten) | **birincil** |
| S7 | Wikimedia Commons | imageinfo P18 dosyası | https://commons.wikimedia.org/w/api.php | ilk 429 → backoff 200; metadata, İNCELENEMEDİ | görsel |
| S8 | Wikimedia Commons | Dosya sayfası wikitext (Artwork + lisans) | https://commons.wikimedia.org/wiki/File:The_Chess_Game_(Sofonisba_Anguissola)_1555_(4096x3236px).jpg | 200; metadata, İNCELENEMEDİ | görsel |
| S9 | Wikimedia Commons | imageinfo WGA00697 (data p70) | https://commons.wikimedia.org/w/api.php | 200; metadata, İNCELENEMEDİ | görsel |
| S10 | Grażyna Bastek (Polskie Radio) | "Gra w szachy", 1555 (sayfa 27/03/2023) | https://www.grazynabastek.pl/sofonisba-anguissola-%E2%80%9Egra-w-szachy%E2%80%9D-1555-%E2%80%93-w-audycji-%E2%80%9Ejest-taki-obraz%E2%80%9D | 200 | ikincil (hakemli değil) |
| S11 | Niezła Sztuka (M. Peruga) | "Gra w szachy" (6 czerwca 2022) | https://niezlasztuka.net/o-sztuce/sofonisba-anguissola-gra-w-szachy/ | 200 | ikincil (hakemli değil) |
| S12 | Jill Burke (blog) | Overlooking Women's Labour… (28 June 2020) | https://renresearch.wordpress.com/2020/06/28/overlooking-womens-labour-in-sofonisba-anguissolas-chess-game/ | 200 | ikincil (hakemli değil) |

**Not:** Brief'teki S13 (yerel repo data/) formal kaynak envanterine alınmadı (kitable dışı iç veri; sahte URL üretilmemesi için). data/ uyuşmazlıkları §5 veri notlarında raporlanır; C040/C050/C057'de data tarafı "veri notu" olarak anılır.

**Erişilemeyenler (brief §6):** Commons ilk imageinfo 429 → backoff 200. Studia Muzealne XXIII (2018, konservasyon), Garrard 1994 (JSTOR/Cambridge abonelik), Simons 1993 (abonelik), Cole 2020, Miller & Yavneh 2006, Chadwick 2007, Perlingieri 1992, Sofonisba 1994 (Leonardo Arte), Vida 1550, Severino 1690, Oczko 2024, Pizzagalli 2005, Vasari Żywoty çev. 1987, Baird 2020, Broomhall 2017, Statucka wpoznaniu.pl 2025 — **"kaynakçada anıldı, metne erişilmedi"**. DOI/ISBN/SBN/sayfa bilgileri erişilen wikitext/kaynakça alanlarından transkribedir; bağımsız doğrulanmadı, alıntı yapılmadı.

## 2. İddia envanteri (A–E)

**C001** — Sanatçı Sofonisba Anguissola; eser imzalı. **A.** S6, S1.
**C002** — 1555; tarih tahta kenarı yazıtında MDLV (enwiki circa → C032/C043). **A.** S6, S3, S4.
**C003** — Tuval üzerine yağlıboya VE tempera (olej i tempera na płótnie); en/it "oil on canvas" → C033. **A.** S6, S5, S11, S1.
**C004** — Boyut 72 × 97 cm (y 72, g 97); tüm kaynaklar mutabık. **A.** S6, S3, S4, S5, S11, S12, S1.
**C005** — Eser Poznań Ulusal Müzesi'nde. **A.** S6, S1.
**C006** — Mülkiyet MNP bünyesindeki Raczyński Vakfı (Fundacja im. Raczyńskich przy MNP); müzenin değil. **A.** S6, S10, S11.
**C007** — Envanter FR 434 (Commons Artwork + WD P217); birincil S6'da görünmüyor → C048. **C.** S8, S1. (belirsiz)
**C008** — Yazıt: üç kız kardeş + bir hizmetçiyi (ancilla) "ex vera effigie" (gerçek suretten) resmettiğini bildirir; transkripsiyon → C035. **A.** S6, S3, S4.
**C009** — Lucia solda, Europa ortada, Minerva sağda; yaşlı hizmetçi sağ üstte. **B.** S3, S4, S5, S8, S11.
**C010** — Doğum sırası: Lucia 3., Minerva 4., Europa 5. çocuk; en büyük Lucia, en küçük Europa. **B.** S3, S4, S6.
**C011** — Yaşlar: Lucia 15, Minerva 13, Europa 10 (atıf zinciri: Studia Muzealne 2018, Oczko 2024, Pizzagalli 2005; erişilmedi). **B.** S5.
**C012** — "23 yaşında yaptı" (atıfsız/çelişkili; birincilde bu eser için yaş beyanı yok → C047). **C.** S3, S5, S11, S6. (belirsiz)
**C013** — Vasari, Cremona'da Amilcare'nin evinde eseri gördü ve övdü (S6); görüş yılı → C034. **A.** S6.
**C014** — Vasari alıntısı (İtalyanca): "…che paiono vive, e che non manchi loro altro che la parola" (ref Sofonisba 1994 s.190; erişilmedi). **B.** S4.
**C015** — Proveniens: muhtemelen Asdrubale satışı → Roma (Orsini → Farnese 1653/1662 → Parma → Napoli/Borboni) → Lucien Bonaparte (1815 satış) → 1823 Raczyński → 1884–1903 Berlin Nationalgalerie → 1903 Poznań; 1823 A (S6), yer → C036, zincir → C039. **B.** S5, S6, S3, S4.
**C016** — Belirgin ridipinture; durum "precarious"; üç bilinen gravür. **B.** S3, S4.
**C017** — Poznań konservatörleri (rentgen + stratigrafi): solda karanlık ağaçta başlıklı kadın silueti üzerine boyanmış; görünen hizmetçi bitmiş manzaraya sonradan eklendi; ilk yer → C037. **A.** S6.
**C018** — Tahta dizilişi gerçek oyunda ulaşılamaz; yön yanlış (büyük kardeş tarafında köşe beyaz olmalı); yenmiş taşlar görünür (WD checkmate → C038). **B.** S5, S10, S11.
**C019** — Lucia elinde yenmiş vezir (królowa/hetman) tutar; "zapewne" belirleyici hamle (yorum). **C.** S5, S10, S12. (yorum)
**C020** — Minerva elini kaldırmıştır: itiraz VEYA teslimiyet (yorum; → C040). **C.** S3, S5, S11. (yorum)
**C021** — Europa gülerek/heyecanla izler. **B.** S3, S4, S5, S11, S12.
**C022** — Hizmetçinin adı bilinmez; "zapewne ukochanej niani"; aynı yüz başka eserlerde (spinet/Althorp) → C044/C055. **E.** S6, S4, S5, S12. (belirsiz)
**C023** — Minerva'nın kolyesi annesi Bianca Ponzoni'nin (Berlin) portresindekiyle aynı; 1557 atıfsız → C051. **B.** S3, S4, S5.
**C024** — Meşe/ağaçlar aile sürekliliği + büyük hanedan sembolü; baba Amilcare'nin hanedan saydırma arayışı (S6); dağlık manzara + belirgin meşeler. **A.** S6.
**C025** — Rönesans'ta satranç eril/entelektüel uğraş; tümü kadın sahne istisna; feminist okumaların merkezinde (Garrard/Simons/Cole/Chadwick/Perlingieri zinciri; erişilmedi). **B.** S3, S10, S11.
**C026** — Vida Scacchia Ludus (1550): vezir virgo/amazon; beyaz vezir ölür-dirilir; siyah mat eder; Amazon alegorisi; "być może" ilham → C045; yenmiş taşlar vanitas. **B.** S3, S4, S5.
**C027** — Sofonisba en büyük; 5 kız + 1 erkek (Asdrubale); erkek resimde yok; Elena (Mantova tarikatta) + Anna Maria (doğmamış) yok. **B.** S5, S11, S3.
**C028** — Manzara düş ürünü; "alla fiamminga" mavimsi; Cremona gerçek yapılarından esinli binalar. **B.** S5, S11, S3, S4.
**C029** — Brescia/MNW Varşova geçici sergisi (Commons notu, atıfsız → C052). **C.** S8. (belirsiz)
**C030** — Kamu malı (PD-art / PD-old-100-expired). **B.** S7, S8, S1.
**C031** — Vasari sözleri eserden söz eden en eski belge; eser Anguissola evinde uzun yıllar asılı kaldı (ref Sofonisba 1994 s.190; erişilmedi). **B.** S3, S4.
**C032** — D001 Tarih: enwiki {{circa|1555}}/"around 1555" ↔ S6/S4/S5/S1 "1555" + MDLV; circa korundu. **D.** S3, S6, S4, S5, S1. (tartışma)
**C033** — D002 Teknik: en/it "oil on canvas" ↔ S6/S5/S11/S1 yağ+tempera+tuval; S12 "panel". **D.** S3, S4, S6, S5, S11, S1, S12. (tartışma)
**C034** — D003 Vasari yılı: S6/S3 1556 ↔ S5/S11 1566; S4 "quest'anno". **D.** S6, S3, S5, S11, S4. (tartışma)
**C035** — D004 Yazıt transkripsiyonu: SOPHONISBA/SEPHONISBA, ANGUSSOLA/ANGVSSOLA, AMILCARIS/AMICLARIS, EFFIGIE/EFIGIE, MDLV/MDVL, ANCILLAM/ANCILAM; S6 yalnız paraphrase. **D.** S3, S4, S5, S11, S6. (tartışma)
**C036** — D005 1823 yeri: S6/S5 Berlin ↔ S8 Paris. **D.** S6, S5, S8. (tartışma)
**C037** — D006 İlk hizmetçi yeri: S6 SOLDA ↔ S5 ORTADA (üzerine meşe); sonradan eklemede mutabık. **D.** S6, S5. (tartışma)
**C038** — D007 Satranç: WD P180 "checkmate" (ref'siz) ↔ S5/S10 imkânsız diziliş + yanlış yön; S6 "rastgele". **D.** S1, S5, S10, S6, S12. (tartışma)
**C039** — D008 Proveniens: S3 eksik ↔ S5 tam ↔ S6 vakıf mülkiyeti; S4 "1823'te bir kez daha". **D.** S3, S5, S6, S4. (tartışma)
**C040** — D009 Minerva jesti: S3 protest ↔ S5 teslimiyet/protest ↔ S11 sprzeciw ↔ data şaşkınlık/itiraz (veri notu). **D.** S3, S5, S11. (tartışma)
**C041** — D010 Bastek tarihi: S5 ref 2023-02-27 ↔ S10 sayfa 27/03/2023. **D.** S5, S10. (tartışma)
**C042** — D011 Miller & Yavneh: S3 Ashgate 2006 s.173 ↔ S11 NY 2016 s.175. **D.** S3, S11. (tartışma)
**C043** — E001 "circa 1555"/"around 1555" (S3). **E.** S3. (belirsiz)
**C044** — E002 Hizmetçi kimliği/rolü kesin değil; "zapewne ukochanej niani". **E.** S6. (belirsiz)
**C045** — E003 Lehçe hedge'ler: prawdopodobnie/zapewne/przypuszczać/być może/mogłoby. **E.** S5. (belirsiz)
**C046** — E004 İtalyanca hedge'ler: "forse" (Europa portresi), "ventenne". **E.** S4. (belirsiz)
**C047** — E005 Yaş/doğum: 23 ↔ ventenne ↔ S6 1532; birincilde bu eser için yaş beyanı yok. **E.** S3, S5, S11, S6, S12. (belirsiz)
**C048** — E006 FR 434 birincil S6'da doğrulanamadı (tam metin tarandı). **E.** S8, S1, S6. (belirsiz)
**C049** — E007 WD "checkmate" ref'siz (P180 Q20819848). **E.** S1. (belirsiz)
**C050** — E008 Hizmetçi "gülümsüyor" (data, veri notu) ↔ S5 sıkılganlık ↔ S11 merak; görsel incelenmedi. **E.** S5, S11. (belirsiz)
**C051** — E009 Bianca Ponzoni "1557" S3'de atıfsız; S4/S5 tarih vermez. **E.** S3, S4, S5. (belirsiz)
**C052** — E010 Brescia/MNW notu atıfsız; wpoznaniu.pl 2025 erişilmedi. **E.** S8, S5. (belirsiz)
**C053** — E011 Yaş alegorisi: S6 "nasuwają skojarzenia", S11 "jak sugeruje"; kesin program değil. **E.** S6, S11, S5. (belirsiz)
**C054** — E012 Bastek: kızlar satrancı "taklit ediyor" (udają); yorum, olgu değil. **E.** S10. (belirsiz)
**C055** — E013 Hizmetçi = spinet/Althorp (1561) kadını; S4 atıfsız + S12 blog; birincil doğrulama yok. **E.** S4, S12. (belirsiz)
**C056** — Görsel bu oturumda İNCELENMEDİ (vision kotası ana oturumda); metadata/lisans; GZ TASLAK. **E.** S7, S8, S9. (belirsiz)
**C057** — data "Anadolu halısı" özgülüğü (veri notu) erişilen kaynaklarda yok; "Doğu halısı" (S5). **E.** S5. (belirsiz)
**C058** — Sofonisba 1532 Cremona doğdu, 1625 Palermo öldü (S6). **A.** S6.
**C059** — Baba Amilcare istisnai sanat eğitimi sağladı; Sofonisba + Elena Bernardino Campi'den ders aldı (S6). **A.** S6.
**C060** — Müze: babanın çabasıyla Michelangelo takdir etti; eserlerde Michelangelo + Leonardo etkileri (S6). **A.** S6.
**C061** — İspanya II. Felipe sarayı; Elisabeth de Valois ressamı/nedimesi; 14 yaşındaki kraliçeye ders (S6). **A.** S6.
**C062** — Palermo son 10 yıl; ölümünden bir yıl önce Van Dyck (Rubens öğrencisi) ziyareti; 92 yaş, görme kaybı (S6). **A.** S6.
**C063** — Ölümünden sonra uzun süre unutuldu; imzasız eserler başkalarına atfedildi (Elena portresi Titian sanıldı) (S6). **A.** S6.
**C064** — Polonya'da iki eser: Satranç (MNP) + 1554 Otoportre (Łańcut) (S6). **A.** S6.
**C065** — Tümü kadın kadro, Giulio Campi / Lucas van Leyden satranç sahnelerinden farklı (enwiki, ref Garrard 2005; erişilmedi). **B.** S3.
**C066** — 15. yy sonu vezir en güçlü taş; "kadın satrancı"/"çılgın satranç" (Simons 1993 zinciri; erişilmedi). **B.** S3, S5.
**C067** — Hizmetçi kısmen kırpılmış; sararmış ten, kırışık alın, bembeyaz giysi karşıtlığı; oynamaz, izler (enwiki + Miller&Yavneh; Burke). **B.** S3, S12.
**C068** — Roma'ya "Spinet Otoportresi" + "Istakoz Isıran Çocuk" çizimiyle geldi; Orsini koleksiyonu (S3/S4). **B.** S3, S4.
**C069** — Kızların eğitimi: şövale resim, klavsen, Latince/İtalyanca şiir, dokuma/nakış; Cremona entelektüel çekirdeği (S4). **B.** S4.
**C070** — Figür yönelimleri: Europa en face, Minerva profil, Lucia yarım profil, hizmetçi çapraz; Lucia izleyiciye bakar (S5, ref Pizzagalli 2005). **B.** S5.
**C071** — itwiki: Minerva "Aile Portresi"nde ergen döner; Europa Uffizi "Alfabe öğrenen yaşlı kadın…" çiziminde (S4). **B.** S4.
**C072** — Burke: Sofonisba ~40'a dek evlenmedi, iki kardeş evlenince resmi bıraktı; Moderata Fonte evlilik eleştirisi (S12; yorum). **C.** S12. (yorum)

**Sayım:** 72 iddia · A=17 · B=22 · C=6 · D=11 · E=16.

## 3. Görsel doğrulama kaydı (Kural 6)

- **Dosya 1 (P18 / data p50):** `The Chess Game (Sofonisba Anguissola) 1555 (4096x3236px).jpg`, **4096 × 3236**, 5.961.229 bayt. Lisans başlığı `{{PD-art|PD-old-100-expired}}`; API LicenseShortName "Public domain", AttributionRequired false. Source: "{{own photograph}} by Mortendrak, 2021-04-26, cc-by-sa-4.0" (fotoğrafçı beyanı source alanında; dosya lisansı PD-art). Artwork: institution National Museum Poznań; **accession FR 434**; object history 1823 purchase Raczyński **Paris** (D005); notes Brescia/MNW (E010). VI "Valued images" 11 October 2024.
- **Dosya 2 (data p70):** `…WGA00697.jpg`, **3214 × 2436**, 5.073.569 bayt; Public domain (S9); credit Web Gallery of Art + Athenaeum.
- **Her iki görsel İNCELENMEDİ (C056 E).** Kompozisyon S6 (A) + S3/S4/S5/S10/S11/S12 (B/C) METNİNDEN. **GZ TASLAK** (gen.py gz_taslak). Görsel projeye kopyalanmadı; URL + lisans + kaynak referans. **İnsan editör görsel teyidi ZORUNLU** (özellikle jestler, halı deseni, hizmetçi ifadesi, tahta yönü).

## 4. Kelime/süre sayımı

| Seviye | Hedef | Ölçülen | Süre |
|---|---|---|---|
| Başlangıç | 400–500 | 420 | 3 dk |
| Orta | 1300–1600 | 1353 | 10 dk |
| İleri | 2600–3200 | 2630 | 20 dk |

dogrula.py ölçümü gen.kelime ile aynıdır (post-pass sonrası nihai). Kanıt bol (birincil biyografi + 3 wiki + 3 blog); hedef aralıklar anlamlı içerikle karşılandı, dolgu/tekrar yok.

## 5. Veri notları (data/ dokunulmadı; insan onayına sunulur)

1. **Tarih:** data "1555" ↔ enwiki {{circa|1555}} nüansı data'da yok (D001/E001); circa korunmalı.
2. **Özet:** data "üç kız kardeşini ve bir hizmetçiyi satranç oynarken resmettiği" — hizmetçi OYNAMAZ, izler (S12 "She's not playing chess"; S3; S5 "przygląda się grze"). İfade yanlış okumaya açık.
3. **Van Dyck yaşı:** harita_motifler "yüz yaşına yaklaşırken" ↔ S6 "92 yaşında" + "ölümünden bir yıl önce"; birincille uyuşmuyor.
4. **Hizmetçi ifadesi:** eser_ayrintilari "gülümsüyor" ↔ S5 "zakłopotanie niani" (sıkılganlık) / S11 "merak"; görsel incelenmedi (E008/C050).
5. **Halı:** "Anadolu halısı olduğu sıkça öne sürülür" ↔ erişilen kaynaklar "Doğu halısı" (S5 wzorzystym wschodnim kobiercem); "Anadolu" özgülüğü doğrulanmadı (C057).
6. **Minerva jesti:** data "şaşkınlık ya da itiraz" ↔ S5 belirsizliğiyle uyumlu; S3 yalnız "protest" (D009/C040).
7. **Lisans:** eserler_onbellek 4096px `"l":""` boş; Commons "Public domain" (PD-art/PD-old-100-expired) raporlar (S7/S8). WGA `"l":"Public domain"` S9 ile uyumlu.
8. **Terminoloji:** eser_notlari "mürebbiye" ↔ kaynaklar ancilla/housemaid/piastunka/domownica; "mürebbiye" (governess) birincilde geçmez (E002).
9. **Yazıt varyantı (Denetim B):** itwiki/plwiki/niezla "ANCILAM" (tek L), enwiki "ANCILLAM" (çift L); brief D004 tablosuna ek not.
10. data/ dosyalarına HİÇBİR yazma/değişiklik yapılmadı; repo kodu, dersler, `main`, pilot (Q167605) ve öteki eserler dokunulmadı; commit/push/deploy yok.
