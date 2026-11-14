# KANIT DOSYASI — Q3399440 · XIV. Louis'nin Portresi (Portrait de Louis XIV en costume de sacre) · Hyacinthe Rigaud

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md`
**Durum:** İnsan incelemesi bekliyor.
**Araştırma brief'i:** `.qwen/tmp/parti3/Q3399440-brief.md` (kaynak araştırma agent; ham cache `.qwen/tmp/parti3/Q3399440-*`).

---

## 0. Yöntem ve kaynak hiyerarşisi

Eser Louvre'da bir tuvaldir (INV 7492). **Birincil Louvre katalog AÇILDI** (cl010066115, HTML + JSON, 200, 2026-11-14); URL tahmin edilmedi — WD P854 referansından bulundu ve eski cartelfr notice 8817 yönlendirmesiyle (301 → 301 → 200, S8) çapraz doğrulandı. **Versailles birincil pedagojik PDF AÇILDI** (S16, 7 s., pypdf metni); Versailles collections permalink'i (S17) 200 ama JS kabuğu — nesne verisi alınamadı. **Prado canlı 403** (bot/WAF); **Wayback 2025-04-25 arşivi AÇILDI** (S15, curl 429×2 → backoff → 200; ham HTML 191.572 B; web_fetch çapraz). en/fr/it wikitext'leri açıldı (S3/S4/S5; it/fr ilk denemede 429 → backoff → 200). Kitap/makale metinlerinin HİÇBİRİNE erişilmedi; yalnız erişilen kayıtların atıf zincirlerinde görüldüler (C060).

**Görsel İNCELENMEDİ** (vision kotası ana oturumda); yalnız metadata + lisans (S9/S10). Kompozisyon anlatımı "kaynakların betimlediği" çerçevesinde verildi; **GZ TASLAK**.

Brief'in 37 aday iddiası (C001–C037) korundu; 15 ihtilaf (D001–D015) C038–C052 olarak, belirsizlikler ve birincil metinden ek olgular C053–C071 olarak envantere eklendi. D/E ifadeleri brief'teki özgün kipleriyle (sans doute, probablement, peut-être, jamais explicitée, attributed, thought to, with no documental basis, circa) korundu.

## 1. Kaynak envanteri (tüm erişimler 2026-11-14)

| ID | Kurum | Belge | URL | Erişim | Tür |
|---|---|---|---|---|---|
| S1 | Wikidata | Q3399440 EntityData | https://www.wikidata.org/wiki/Special:EntityData/Q3399440.json | 200 | yardımcı |
| S2 | Wikidata | etiketler (wbgetentities; 2 parti: wdlabels, wdlabels2) | https://www.wikidata.org/w/api.php | 200 | yardımcı |
| S3 | Wikipedia EN | "Portrait of Louis XIV" wikitext | https://en.wikipedia.org/w/api.php?action=parse&page=Portrait%20of%20Louis%20XIV&prop=wikitext | 200 | ikincil |
| S4 | Wikipedia IT | "Ritratto di Luigi XIV" wikitext | https://it.wikipedia.org/w/api.php?action=parse&page=Ritratto%20di%20Luigi%20XIV | 429 → 200 (backoff) | ikincil |
| S5 | Wikipedia FR | "Portrait de Louis XIV en costume de sacre" wikitext | https://fr.wikipedia.org/w/api.php?action=parse&page=Portrait%20de%20Louis%20XIV%20en%20costume%20de%20sacre | 429 → 200 (backoff) | ikincil |
| S6 | Louvre | birincil katalog HTML, cl010066115 | https://collections.louvre.fr/ark:/53355/cl010066115 | 200 (83.618 B) | birincil |
| S7 | Louvre | notice JSON | https://collections.louvre.fr/ark:/53355/cl010066115.json | 200 | birincil |
| S8 | Louvre | eski cartelfr notice 8817 (yönlendirme kanıtı) | http://cartelfr.louvre.fr/cartelfr/visite?srv=car_not_frame&idNotice=8817 | 301 → 301 → 200 (S6 ile aynı) | birincil |
| S9 | Commons | imageinfo: Louvre dosyası (P18) | https://commons.wikimedia.org/wiki/File:Portrait_of_Louis_XIV_of_France_in_Coronation_Robes_(by_Hyacinthe_Rigaud)_-_Louvre_Museum.jpg | 200 (metadata) | görsel |
| S10 | Commons | imageinfo: Versailles dosyası | https://commons.wikimedia.org/wiki/File:Portrait_of_Louis_XIV_of_France_in_Coronation_Robes_(by_Hyacinthe_Rigaud)_%E2%80%93_National_Museum_of_the_Palace_of_Versailles.jpg | 200 (metadata) | görsel |
| S11 | Wikidata | Q27754874 (Prado versiyonu) EntityData | https://www.wikidata.org/wiki/Special:EntityData/Q27754874.json | 200 | yardımcı |
| S12 | Wikidata | P4969 türevleri: Q117360045 (MV 2041), Q20178194 (Getty), Q117360393 (MV 3563), Q115658142 (Fabre), Q30093788 (Münih) | https://www.wikidata.org/w/api.php?action=wbgetentities | 200 | yardımcı |
| S13 | Prado | canlı katalog sayfası | https://www.museodelprado.es/en/the-collection/art-work/louis-xiv/eb9b8bf3-4e26-4539-aff5-e368222c3f98 | **403** (bot/WAF) | birincil (ERİŞİLEMEDİ) |
| S14 | Wayback | availability API | https://archive.org/wayback/available?url=museodelprado.es/... | 200 | yardımcı |
| S15 | Prado (Wayback) | katalog kopyası, arşiv 2025-04-25 | https://web.archive.org/web/20250425061920/https://www.museodelprado.es/en/the-collection/art-work/louis-xiv/eb9b8bf3-4e26-4539-aff5-e368222c3f98 | 429×2 → 200; web_fetch çapraz | birincil (arşiv) |
| S16 | Château de Versailles | resmî pedagojik PDF, 7 s. ("commentaire d'œuvre / Portrait de Louis XIV en grand costume royal par Hyacinthe Rigaud en 1701") | https://www.chateauversailles.fr/sites/default/files/presse/documents/ressource-pedagogique_commentaire-louis_xiv_par_hyacinthe_rigaud.pdf | 200 (1.478.565 B; pypdf) | birincil |
| S17 | Versailles collections | permalink (MV 2041) | https://collections.chateauversailles.fr/?permid=permobj_87c69f37-7e46-4861-b532-8c63aba5a510 | 200 ama JS kabuğu; içerik YOK | birincil (içerik erişilemedi) |
| S18 | web_search | MV 2041 URL keşfi (PDF + permalink bulundu; tahmin değil) | (arama adımı — URL yok) | — | yardımcı |
| S19 | yerel data/ | salt-okunur tarama snapshot'ı | .qwen/tmp/parti3/Q3399440-data-snapshot.json | yerel | yerel |

**Erişilemeyenler:** Joconde (Q809825; P347 000PE002386 — WD atıf zinciri var, kayıt açılmadı; D002 için doğrudan doğrulama yok); Getty nesne URL'si (yalnız WD refs); Prado canlı (S13); Versailles permalink içeriği (S17); kitap/makale metinleri (C060).

## 2. İddia envanteri (A–E)

**C001** — Sipariş: Louis XIV, Rigaud'ya önce Philippe d'Anjou'yu (V. Felipe) resmettirdi (1700); Felipe aynı elden büyükbabasının portresini istedi; kral orijinali beğenip sakladı, İspanya'ya aynı boyda kopya sipariş etti. Rigaud'nun ünü krala Grand Dauphin'in Philippsburg portresiyle ulaştı (van Hulst 1716, wiki üzerinden). Mercure 1702: "Jamais portrait n'a été mieux peint, ni plus ressemblant". **A.** S6 (Mercure de France 1702 alıntılı), S3, S5 (Bély 2015 s.103; van Hulst 1716; Chennevières 1854 s.118). Not: Prado'nun sipariş anlatısı farklıdır → C046.
**C002** — Pozlar: Mart 1701 – Ocak 1702, Maintenon'un dairesinde, kral gutlu; yüz canlı modelden. Dangeau günlüğü (10–11 Mart 1701; 19 Ocak 1702) ve Maintenon'un 11 Mart 1701 mektubu ("La goutte est venue à notre secours"); Felipe V'in 3 Eylül 1703 teşekkür mektubu (wiki üzerinden). WD P1071 yaratım yeri Versailles (refsiz). **A.** S16 s.3; S3, S5 (Dangeau Journal 1856 t.VIII s.51, s.295; Lavallée 1866 IV s.416, s.443–444).
**C003** — 1701'de Rigaud'ya portreler için ödeme kaydı var (Livre de raison / Bâtiments); tutar ve atıf kaynaklarda farklıdır → C041. **B.** S3, S4, S5 (Roman 1919 s.83/s.85; Guiffrey 1881 s.693 — metne erişilmedi).
**C004** — Bâtiments ödemesi 16 Eylül 1702: iki büyük kral portresi + küçük eskiz + İspanya kralı portresi için 10.000 livres. **B.** S3, S5 (Guiffrey 1896 IV s.827 — metne erişilmedi).
**C005** — Tam boy, ayakta, sola üç çeyrek; baş contre-plongée, ayaklar vue plongeante; dikeyler (sütun, kral, taht) + piramidal kompozisyon; el kalçada, dirsek dışarı (güç işareti). **A.** S6; S16 s.2, s.4, s.6; S5 (da Vinha/Masson 2011 s.187 — perspektif terimleri S5'ten).
**C006** — Kral, halı kaplı sekinin ÖNÜNDE durur, üstünde DEĞİL ("et non sur l'estrade"); taht seki üstünde, mor ipek baldaken altında; baldaken altın işlemeli, püsküllü kordonla tutturulur; mor Antikçağ'dan beri iktidar rengi; taht mavi zambaklı kumaşla kaplı. **A.** S16 s.2, s.6; S6.
**C007** — Regalia taşınmaz: taç + adalet eli mavi zambaklı örtülü tabure/yastık üstünde; kral taçsız. **A.** S6; S16 s.5–6; S5 (Burke 1995 s.190).
**C008** — Taç, Charlemagne'ın taç giyme tacı değil; Fransız krallarının CENAZELERİ için yapılmış hafif, taşsız vermeil taç. Taç giyme tacı kemerlerle kapalıydı ve korunmamıştır. frwiki "peut-être" der (E003); Louvre + PDF kesin söyler. **A.** S6; S16 s.5.
**C009** — Asa: Henri IV'ün KISA asası, SAĞ elde TERS tutulur, baston/komuta batonu gibi dayanılır; zambak ucu yastığa dayanır. Anlamı → C053. **A.** S6; S16 s.5.
**C010** — Adalet eli (main de justice): fildişi; Henri IV'e ait; tacın yanında. Törende kral asayı sağ, adalet elini sol elde tutardı. **A.** S6; S16 s.5.
**C011** — Kılıç: "Charlemagne kılıcı" (Joyeuse) belde; S16 adı "à tort" (yanlış) der; kılıç Louvre'da saklanır. Görünürlük → C049. Pinoteau 2005 (wiki üzerinden): kılıcı taç giyme mantosuyla taşımak "incongruité manifeste". **A.** S6; S16 s.5; S3, S5 (Burke 1995 s.190; Pinoteau 2005 s.21), S4.
**C012** — Taç giyme manto'su (manteau du sacre) + Saint-Esprit tarikatı büyük üstat kıyafeti; tarikat kolyesi göğüste. **A.** S6 (Pinoteau 2003 atıflı); S16 s.4–5; S5.
**C013** — Manto: mavi kadife ("cramoisi" yoğunluk), altın iplikle zambak işlemeli, hermelin astar; SOL omuzda ritüel olarak sıyrılmış. Manto kralların yalnız taç giymede bir kez giydiği parçadır; mavi, Capet hanedanının zambaklı azure kalkanından gelir, Meryem'e adanmıştır; PDF: "la force de la couleur est en soi toute catholique". **A.** S16 s.4; S5 notu.
**C014** — Saray kıyafeti: dantel jabot/manşetler, Sedan brokarı rhingrave/beyaz culotte, ipek çorap + jartiyer (dizde çorabı tutup geren kurdele), elmas tokalı kırmızı topuklu ayakkabı, büyük "de majesté" peruk. **A.** S6; S16 s.3–4; S5 (Tsikounas 2008 s.57).
**C015** — Beyaz kıyafet, Saint-Esprit tarikatı çömez şövalyelerinin kıyafetidir (Henri III, 1578; 100 üye); burada yalnız beyaz brokar culotte kalmıştır. **A.** S16 s.3–4.
**C016** — Kırmızı topuk: yalnız aristokrasinin izni olan ayrıcalık; rengin nedeni AÇIKLANAMAMIŞ ("reste inexpliquée"); XV. Louis döneminde de kullanıldı, XVI. Louis'de kayboldu; ayakkabılarda "aile de moulin" düğümleri. **A.** S16 s.3.
**C017** — Sütun = güç/istikrar sembolü; kaide rölyefleri: Adalet (önde, Themis terazi + kılıç) ve Güç (yanda, zor görünür); kırmızı-turuncu draperi sahneyi teatralleştirir; perde geleneği "kral görünmez ama belirir" (S5). **A.** S6; S16 s.6; S5 (da Vinha/Masson 2011 s.187).
**C018** — Mutlakiyet temsili: kral, Güç ve Adalet erdemlerine dayanan egemenliğin cisimleşmesi ("Louis XIV en majesté incarnant la souveraineté royale"); "resmî portre"/ikon. PDF: eser "iki Louis XIV imgesi"ni birleştirir — saray kıyafetli bir insan ve bir kral. **A.** S6; S16 s.1; S5; S3.
**C019** — Yüz yaşlı ve gerçekçi; kral hatlarının "véritables"/"true" olmasını istedi ("le roi ne voulant pas qu'on idéalise les traits de son visage"); bacaklar genç. PDF: "habile compromis entre la mise en scène de la majesté du roi et son humanité". Yaş → C045. **B.** S3, S5 (Tsikounas 2008 s.57, DOI 10.3917/sr.026.0057 wikitext'te basılı, çözülmedi); S16 s.3.
**C020** — Bacaklar "yerine poz veren genç bir dansçının" bacakları (yalnız S16'da; E015); "allure efféminée" ama "royale virilité" zedelenmez, "cette somptuosité est toute politique". Dans yorumu → C044; bacak → C043. **A.** S16 s.2–3; S4; S6.
**C021** — Poz kaynağı: Desjardins'ın Place des Victoires heykeli (1686; 1792'de yıkıldı) — "sans doute" (S6) / "probablement" (S16); heykel mantolu, el kalçada, Hydra'yı ezer; resimde Hydra ayak altında değildir. Alternatifler: Namur portresi; Van Dyck Charles I (1635, Louvre) "peut faire penser". **E.** S6; S16 s.2, s.6.
**C022** — Yüz, ana tuvale eklenen küçük destek üstünde: Louvre "toile plus fine marouflé (27 × 23 cm)"; wiki'ler (Vittori 2010) "cousue à petits points" → C042. S16'nın "papier marouflé" ifadesi MV 2041 içindir (ayrı nesne). **A.** S6; S3, S4, S5 (Vittori 2010); S16 s.3, s.7.
**C023** — Tuval 12 × 14 iplik/cm²; eski tuvalden tuvale transpozisyon; restorasyon: Lucien Aubert 1967, pictural katman Lin Sourzac 1988. **A.** S6.
**C024** — İki imza: Justice rölyefi üstü banderolde "PEINT PAR HYACINTHE RIGAUD. 1701"; halı/manto birleşiminde "HYACINTUS RIG" (commentaire) — inscriptions alanı "Hyacinthe Rigaud" (kürk kıvrımı) der → C057. **A.** S6.
**C025** — Salon de 1704'te sergilendi — Louvre TEMKİNLİ: "à moins qu'il ne s'agisse de la version aujourd'hui à Versailles ; cf. Brême et Lanoë, 2013"; WD P608 ve frwiki kategorisi kesinler → C051. **E.** S6; S1; S5.
**C026** — Gravür: Pierre Drevet 1714–1716 (S6) / 1714–1715 (S3/S5; ödeme 16 Şubat 1716, 5.000 livres) → C048. Hazırlık çizimi Jean-Marc Nattier 1713 (20 Ağustos 1713 ödemesi, 500 livres); çizim Phoenix Art Museum Inv. 65-62, 63,7 × 51,4 cm; Nattier arka plan galerisini bir travée uzattı. Mariette gravürü "en önemli iş" sayar; 1733'te nadirliğini yazar (wiki üzerinden). **A.** S6; S3, S5 (Guiffrey 1881 V s.693, s.876; Mariette Notes manuscrites).
**C027** — Provenance: Louis XIV koleksiyonu → Versailles Salon d'Apollon (taht salonu) şömine üstü, ~1705 (Dezallier d'Argenville 1755; Castelluccio 2018) → Devrim'de müsadere → Louvre'a transfer 2 Mayıs 1814 (A.M.N., *P12, fol. 49). PDF yerleştirmeyi "probablement immédiatement" diye ihtiyatla verir (E008). **A.** S6/S7; S1 P580=1814-05-02; S16 s.2.
**C028** — Versailles versiyonu: MV 2041 / INV 7494 / MR 2401, Salon d'Apollon; atölyeyle yapılmış otograf replika; Louvre aslı "la seule signée et datée" → C047; boyut → C039; Louis-Philippe döneminde Versailles'a girdi (S5 notu); WD tarihi precision 8 (on yıl) + P1480 circa; Commons "between circa 1701 and circa 1702" — circa aynen korundu. **A.** S6; S16 s.1–2; S12 (Q117360045); S5 notu (Constans 1995 II s.757 no 4269); S10.
**C029** — Prado P002343 "Louis XIV of France", 1701, tuval yağlıboya, 238 × 149 cm, Oda 019 (sergide): taç giyme portresi DEĞİL, zırhlı/Namur kuşatması arka planlı martial varyant (savaş Joseph Parrocel); miğfer taş üstünde, zambaklı komuta batonu, general kuşağı, Saint-Esprit bandı; imza "Hyacinthus Rigaud pinxit 1701"; "he did not send either canvas"; Fransız kraliyet ailesi zırhlı portreler serisi (Grand Dauphin, Bourgogne, Berry; sonuncusu Largillière); provenance Felipe V → La Granja (1727; 1746 n.407; 1794; 1814–1818; 1827 nº 407). Atıf/hipotez kipleri → C055. **A (arşiv).** S15 (Wayback 2025-04-25, ham HTML doğrulandı); S11.
**C030** — itwiki: "İspanya kralı için yapılan kopya bugün hâlâ Madrid'de" — erişilen kayıtlarla DESTEKLENMİYOR → C046. **E.** S4 (S15/S6/S3 ile karşılaştırma).
**C031** — Diğer kopyalar (kaynaklı): Getty 70.PA.1 "After Rigaud" ~1750 (S12, erişilmedi); Palais Rohan Strasbourg (Pierre Legendre; Recht/Geyer 1988 s.321); Fabre Montpellier 837.1.71 (Jean Ranc, 77 × 62); Münih BSGS 3229 (kopya, 130,5 × 97,3, 1722); Versailles MV 3563 (atölye, 130 × 97, 1706); Dangeau 1702 aynı pozlu yarım boy (MV 3652, 162 × 130); Chantilly Musée Condé modello (wiki görsel notu). Livre de Raison/Bâtiments çok sayıda küçültme anar (S6); Stiémart siparişi (wiki). Atıfsız kopyalar → C056. **B.** S3, S4, S5; S12; S6.
**C032** — Etki: resmî devlet portresi kalıbı XIX. yüzyıla dek model ("jusqu'au XIXe siècle"); saraylılar pozu taklit etti (Dangeau 1702, MV 3652, 162 × 130); "en tanınır kral portresi"/"portrait officiel". **A.** S16 s.6; S6; S3; S5.
**C033** — Kral ~1,60 m boyunda; 2,77 m'lik portrede doğadan büyük resmedildi ("plus grand que nature"). **A.** S16 s.6.
**C034** — Bağlam: Charles II çocuksuz öldü, vasiyeti Philippe d'Anjou'yu (Grand Dauphin'in ikinci oğlu) işaret etti; ölüm veraset savaşına yol açtı (S3); Louis XIV vasiyeti kabul etti; Felipe V tahta 16 Aralık 1700 (S16). Ölüm tarihi → C040. **A.** S6; S16 s.1; S3, S4, S5.
**C035** — Yüz, Antoine Benoît'in balmumu kabartmasına (MV 2167, 85,3 × 71 × 12 cm) çok yakın; PDF metni "vers 1700" der → C061 (görsel altı notu "vers 1705"). **A.** S16 s.3.
**C036** — Atölye: 1716'ya dek 30+ sanatçı (bir–on yıl); iş bölümü: La Penaye, Prieur, Bayeul, Huillot, Parrocel (1696–1703); "certains aides habillent même les originaux"; Rigaud bazen yalnız başı küçük tuvale yapar, sonra "insérée, cousue"; bazı kopyalarda dikiş izi belirli ışıkta görünür. **A.** S16 s.7.
**C037** — Sergiler (Louvre kaydı): "Hyacinthe Rigaud ou le portrait Soleil" Versailles 17/11/2020–13/06/2021 (liste) vs 18/04/2021 (bibliyografya) → C057; "Louis XIV. L'Homme et le Roi" 20/10/2009–07/02/2010; "Les regalia" Richelieu 15/10/1987–11/01/1988. WD P608: Europeana 280, Salon of 1704, Sun Portrait. **A.** S6; S1.
**C038** — (D001) Mevcut konum ihtilafı: S6/S7 (2026) "non exposé", room "" ↔ S1 P276 "Room 602" (P9394 ref, 2022-12-11) + S5 "Sully, 1er étage, salle 602". S6 banner: salon bilgisi güncel olmayabilir (E016). **D.** S6, S7, S1, S5. (tartışma)
**C039** — (D002) MV 2041 boyut ihtilafı: 313 × 205 cm (S6 commentaire + S16 caption) ↔ 276 × 194 cm (S12 Joconde ref + S5 notu Constans 1995 no 4269). Aynı envanter (MV 2041/INV 7494/MR 2401); çerçeveli/çerçevesiz veya versiyon karışıklığı DOĞRULANMADI; Joconde'a erişilmedi. **D.** S6, S16, S12, S5. (tartışma)
**C040** — (D003) Charles II ölüm tarihi: S6 "1er octobre 1700" ↔ S3/S4 "18 novembre/November 1700" ↔ S5 "1er novembre 1700". Üç ayrı tarih; çözümlenmedi. **D.** S6, S3, S4, S5. (tartışma)
**C041** — (D004) 1701 ödemesi: S5 (Roman 1919 s.85) "26.000# [livres]" ↔ S3 (Roman 1919 s.83) "12,000 pounds" ↔ S4 (Guiffrey 1881 s.693) "12.000 livre". Tutar + sayfa + atıf farklı. **D.** S3, S4, S5. (tartışma)
**C042** — (D005) Yüz desteği tekniği: S6 "fragment de toile plus fine marouflé (27 × 23 cm)" ↔ S3/S4/S5 (Vittori 2010) "cousue à petits points". S16 "papier marouflé" MV 2041 içindir; S16 s.7 genel atölye pratiği "insérée, cousue" der. **D.** S6, S3, S4, S5, S16. (tartışma)
**C043** — (D006) Öndeki bacak: S4 + S16 "c'est la jambe gauche qui est en avant" (SOL) ↔ S6 heykelin "jambe droite avancée" pozunu "repris" (SAĞ ima). Görsel incelenmedi. **D.** S4, S16, S6. (tartışma)
**C044** — (D007) Dans yorumu: S6 "paraît évoquer la passion ancienne du roi pour la danse"; S5 (Tsikounas) "position de quatrième"; S4 dans adımı ↔ S16 "n'a rien à voir avec la danse, comme cela a été souvent répété". **D.** S6, S5, S4, S16. (tartışma)
**C045** — (D008) Kralın yaşı: S3 "62 years old" ↔ S5/S4 "63 ans"/"63 anni"; S16 "soixante-trois ans"; data "63 yaşındaki". Doğum 5 Eylül 1638; pozlar Mart 1701 – Ocak 1702 — iki yaş da savunulabilir. **D.** S3, S5, S4, S16, S19. (tartışma)
**C046** — (D009) İspanya kopyasının akıbeti: S4 "ancora oggi si trova a Madrid" ↔ S6 ikinci versiyon Salon d'Apollon'da (MV 2041) ↔ S3 "never did get sent to Spain" ↔ S15 "he did not send either canvas" (Prado martial varyant, taç giyme kopyası değil). Prado'nun sipariş anlatısı da Louvre'unkinden farklı ("replica... to hang at Versailles"; "may have reconsidered"). **D.** S4, S6, S3, S15. (tartışma)
**C047** — (D010) Replikanın imzası: S3/S4/S5 "also signed"/"anch'essa firmata"/"également signée" ↔ S6 Louvre aslı "la seule signée et datée". İmzalı ama tarihsiz replika ile uzlaşabilir — doğrulanmadı. **D.** S3, S4, S5, S6. (tartışma)
**C048** — (D011) Drevet gravür tarihi: S3/S5 1714–1715 (ödeme 16 Şubat 1716) ↔ S6 "entre 1714 et 1716". **D.** S3, S5, S6. (tartışma)
**C049** — (D012) Kılıcın görünürlüğü: S3/S5 "sole custody is visible"/"seule la garde est visible" ↔ S4 "appare all'interno del suo ricco fodero" ↔ S6 "l'épée de Charlemagne au côté". **D.** S3, S5, S4, S6. (tartışma)
**C050** — (D013) Seki konumu: data/basyapitlar "Kral, bir basamağın üzerinde ayakta duruyor" + S4 "il sovrano si trova su di una piattaforma rialzata" ↔ S16 "devant une estrade revêtue d'un tapis (et non sur l'estrade)" + S3 taht platformda, kral önünde. data DEĞİŞTİRİLMEDİ. **D.** S19, S4, S16, S3. (tartışma)
**C051** — (D014) Salon de 1704: S1 P608 + S5 kategorisi ("Œuvre exposée au Salon de 1704") kesin ↔ S6 "à moins qu'il ne s'agisse de la version aujourd'hui à Versailles" (hangi versiyon belirsiz). **D.** S1, S5, S6. (tartışma)
**C052** — (D015) Prado/Namur tarihi: S16 "En 1694, Rigaud peint... 'Portrait de Louis XIV devant Namur' (actuellement au musée du Prado)" ↔ S15 P002343 "Date 1701" + "Certain researchers believe, with no documental basis, that this canvas was painted earlier". **D.** S16, S15. (tartışma)
**C053** — (E004) Ters asanın anlamı: S16 "Chose surprenante jamais explicitée"; "On ne sait toutefois expliquer pourquoi le roi le tient à l'envers !" — açıklama yok. **E.** S16. (belirsiz)
**C054** — "Zahmetsiz iktidar" okuması: data "Kimi yorumculara göre asanın gelişigüzel tutulması... iktidarın zahmetsiz ve doğal olduğunu ima eder" — yorumdur; S16 açıklamasız der (C053). **C.** S19, S16. (yorum)
**C055** — (E007) Prado P002343 atıf/hipotez kipleri: "They were probably conceived..." (seri, Veraset Savaşı 1701–1713 bağlamı); "he may have reconsidered"; "The king's face is attributed to him"; "his assistants are thought to have painted the rest"; "Certain researchers believe, with no documental basis... signature may have been applied several years after its completion" (Luna 2010 s.252 üzerinden). **E.** S15. (belirsiz)
**C056** — (E009/E010) Atıfsız kopyalar: Perpignan Musée Hyacinthe-Rigaud (9 Aralık 2023 satın alma, S5 satır içi atıf YOK); Herrenchiemsee (II. Ludwig, S4 atıf YOK; S4 lead'inde başıboş "E giocava" — kalite notu); Paris Observatuvarı (Alphonse Carrière); Château de Maintenon; Hôtel Negresco; Villemonteix kopyası ve George Kilian gravürü (S4 galeri). **E.** S5, S4, S3. (belirsiz)
**C057** — (E011) Louvre içi tutarsızlıklar: güncelleme HTML "20.04.2026" ↔ JSON "modified 2026-07-22"; sergi bitişi liste 13/06/2021 ↔ bibliyografya 18/04/2021; ikinci imza inscriptions "Hyacinthe Rigaud" (kürk kıvrımı) ↔ commentaire "HYACINTUS RIG" (halı/manto birleşimi). **E.** S6, S7. (belirsiz)
**C058** — (E014) Akım sınıflaması: S1 P135 Classicist painting + Baroque painting + Grand Siècle (bir referans blog: beckchris.wordpress.com); data "Fransız Klasisizmi", konu başlığı "Baroque Art Versailles" — ikisi de kısmî. **E.** S1, S19. (belirsiz)
**C059** — Görsel bu oturumda İNCELENMEDİ (vision kotası ana oturumda); Commons P18 dosyası 2883 × 4018, PD-Art; credit Gallerix (Louvre DEĞİL); GZ TASLAK. **E.** S9. (belirsiz)
**C060** — Kitap/makale metinlerine erişilmedi; yalnız erişilen kayıtların atıf/kaynakçalarında anıldılar: Bély 2015, Roman 1919, Guiffrey 1881/1896, Chennevières 1854, van Hulst 1716, Lavallée 1866, Dangeau 1856, Mercure 1702, Burke 1995, Pinoteau 2003/2005, Tsikounas 2008 (DOI çözülmedi), Vittori 2010, da Vinha/Masson 2011, Constans 1995, Engerand 1901, Dezallier 1745/1755, Mariette, Recht/Geyer 1988, Luna 2010, Brême/Lanoë 2013, Posner 1998; Louvre bibliyografyası (James-Sarazin 2016, James-Sarazin/Salomé 2020, Milovanovic 2021, Castelluccio 2018, Compin/Roquebert 1986 vb.); S16 kaynakçası (Milovanovic 2009, Delalex/Maral/Milovanovic 2011, Arizzoli-Clémentel/Gorguet Ballesteros 2009). **E.** S3, S4, S5, S6, S15, S16. (belirsiz)
**C061** — Benoît kabartmasının tarihi: S16 metni "vers 1700" ↔ aynı PDF'in görsel altı notu "Antoine Benoist, vers 1705" (belge içi tutarsızlık; kabartma MV 2167). **E.** S16. (belirsiz)
**C062** — "Mutlakiyetçi monarşinin görsel manifestosu... Fransız saray portreciliğinin doruk noktası" (data/eser_notlari) değerlendirmesi; "manifesto" kısmı C018/C032 ile uyumlu, "doruk noktası" yorum. Kantorowicz "kralın iki bedeni" şeması anakronistik okuma aracıdır; Rigaud'nun etkilendiği iddia edilmez. **C.** S19, S6, S16. (yorum)
**C063** — Kariyer: Perpignan'da Antoine Ranc yanında çıraklık; Lyon (koşullar bilinmiyor); Paris 1681; Largillière ve de Troy ile birlikte portrede büyük başarı; bir başı iki saatte kurma hızı; malzeme dokusu ustalığı. **A.** S16 s.7.
**C064** — Atölye ekonomisi: 1690 "habillement répété" portre 150 livres ↔ 1726 Samuel Bernard "composition entièrement originale" 7200 livres; atölye üretken işletme gibi yönetilir, görevler dağıtılır. **A.** S16 s.7.
**C065** — Regalia terminolojisi/teolojisi: insignia Saint-Denis'te saklanır, Reims'deki taç giyme töreninde kullanılırdı; PDF "ornements royaux (et à tort regalia)" der; kralın Tanrı'dan aldığı üç güç (dinsel, siyasal, yargısal). **A.** S16 s.4.
**C066** — Charlemagne'ın uzun asası: 1,84 m; ucunda küre + asa tutan Charlemagne heykelciği; Charles V tarafından 1380'de Saint-Denis başrahibine bırakıldı; 1380 sonrası Charles VII ve Henri IV hariç tüm taç giymelerde kullanıldı; Belle'in XV. Louis portresinde (1723) görünür. Resimdeki asa BU DEĞİLDİR (C009). **A.** S16 s.5.
**C067** — Belle'in XV. Louis taç giyme portresi (1723, Versailles): üç tören kıyafeti (gümüş kumaş soutane; mavi saten tunique/dalmatique, altın zambaklı; mavi kadife manto); kırmızı topuklar törensel mahmuz ve mavi zambaklı çizmelerin yerini almıştır. **A.** S16 s.3–4.
**C068** — Saint-Esprit kolyesi: güvercin yüklü Malta haçı; kral tarikata büyük üstat olarak taç giymenin ertesi günü katılırdı; Reims'de manto üstünde bu kolyeyi taşımazdı. **A.** S16 s.5.
**C069** — Dantel: Points de France kralliyet imalatı (Colbert edikleri, 1666); büyük peruk modası Louis XIII (kel kalma tehdidi) ile başladı, saray taklitle yayıldı. **A.** S16 s.3.
**C070** — Çekirdek künye: "Louis XIV (1638-1715), roi de France"; Rigaud, Hyacinthe "dit aussi Rigau y Ros" (Perpignan 1659 – Paris 1743), France, École de; 1701 ("1e quart du XVIIIe siècle"); huile sur toile; H 2,77 m × L 1,94 m (çerçeveli 3,395 × 2,45 m); INV 7492 (principal) + MR 2391 (autre); Département des Peintures, musée du Louvre; propriétaire Etat; "entrée - Collection de Louis XIV". WD P571 precision 9 (yıl), P1480 yok; P2048/2049 277/194 (cartelfr 8817 ref, 2016). cartelfr 8817 → cl010066115 yönlendirme kanıtı (S8). **A.** S6, S7, S1, S8.
**C071** — Kamu malı: Rigaud ö. 1743 (100+ yıl pma); WD P6216=Q19652 (P459: 100 yıl pma); Commons PD-Art / PD-old-100-expired, CC-PD-Mark; Copyrighted False, AttributionRequired false. **B.** S1, S9.

**Sayım:** 71 iddia · A=38 · B=5 · C=2 · D=15 · E=11.

## 3. Görsel doğrulama kaydı (Kural 6)

- **Kullanılan dosya (WD P18 + data/):** `Portrait of Louis XIV of France in Coronation Robes (by Hyacinthe Rigaud) - Louvre Museum.jpg` — 2883 × 4018 px, 2.732.885 B (S9). Lisans: **Public domain** (PD-Art / PD-old-100-expired; CC-PD-Mark). Credit: **Gallerix** (`https://gallerix.org/storeroom/2719006409/N/2125244278/`) — Louvre değil. Kategorilerde "PD-Art missing SDC copyright status" / "PD-old missing SDC copyright status" (SDC eksikleri).
- **Versailles dosyası (S10):** `... – National Museum of the Palace of Versailles.jpg` — 13778 × 19481 px, 239.053.040 B; PD; credit "Musée de l'Histoire de France"; artist "Hyacinthe Rigaud and workshop"; tarih "between circa 1701 and circa 1702".
- **İNCELENMEDİ** (C059): vision kotası ana oturumda; bu oturumda yalnız metadata/lisans/çözünürlük. Kompozisyon S6 (A) + S16 (A) + S3/S4/S5 (B) METNİNDEN; derslerde "kaynakların betimlediği" çerçevesi kullanıldı. **GZ TASLAK.** Görsel projeye kopyalanmadı; URL + lisans + kaynak olarak referans verildi.
- data/ görsel hash'i 2abb7af9be90572c; onbellek lisansı "Public domain" (S9 ile uyumlu).

## 4. Kelime/süre sayımı

| Seviye | Hedef | Ölçülen |
|---|---|---|
| Başlangıç | 400–500 | 427 |
| Orta | 1300–1600 | 1349 |
| İleri | 2600–3200 | 2765 |

Ölçüm gen.kelime ile (etiketler ve markdown işaretleri düşülür); uret-Q3399440.py post-pass D/E işaretleri ekler. **dogrula.py: Q3399440 için 0 hata / 0 uyarı** (jsonschema Draft2020-12 katmanı aktif; ilk turdaki 5 heuristic "etiketsiz olgu" uyarısı, kısaltma bölünmesine karşı etiketler taşınarak giderildi). CJK: 0. Ayrıntı KALITE_KONTROL.md'de.

## 5. Veri notları (data/ dokunulmadı; insan onayına sunulur)

1. **Yaş:** data "63 yaşındaki" ↔ enwiki 62 (D008/C045); fr/it/PDF 63. İki yaş da poz aralığıyla savunulabilir; ders tek sayı dayatmaz.
2. **Seki:** data "Kral, bir basamağın üzerinde ayakta duruyor" ↔ S16 "et non sur l'estrade" (D013/C050); itwiki de "üstünde" der. Ders PDF'i esas alır, ihtilafı beyan eder.
3. **Dans:** data "bale pozunu andırır" ↔ S16 dans yorumunu reddeder (D007/C044); "genç dansçı bacakları" yalnız S16'da (E015).
4. **Ters asa yorumu:** data "kimi yorumculara göre... zahmetsiz iktidar" → C054 (C, yorum); S16 "jamais explicitée" (C053 E).
5. **Regalia nüansı:** data "taç, asa, adalet eli ve kılıç taç giyme töreninin nesneleridir" → resimdeki taç cenaze vermeil tacı (C008), asa Henri IV'ün kısa asası (C009), kılıç adı "à tort" (C011); PDF "regalia" terimini de "à tort" sayar (C065).
6. **Terminoloji:** data "adalet asası" ↔ kaynaklar "main de justice / adalet eli" (fildişi el); data'nın "ucunda küçük beyaz fildişi el" tanımı doğru, adlandırma farklı.
7. **Sanatçı notu:** sanatcilar.json "1701 civarında... atölyesiyle" → asıl 1701 imzalı-tarihli (kesin, C070); "atölyesiyle" kopyalar/replika için geçerli (E013).
8. **Akım:** "Fransız Klasisizmi" kısmî (E014/C058); WD üçlü etiket.
9. **Envanter boşluğu:** muze_numaralari.json'da Q3399440 / INV 7492 kaydı YOK (hata değil, boşluk).
10. **Görsel:** İNCELENMEDİ (C059); GZ TASLAK; credit Gallerix (Louvre değil); SDC copyright status kategorileri eksik; insan editör görsel teyidi zorunlu.
11. **Benoît kabartması:** PDF metni "vers 1700", görsel altı notu "vers 1705" (C061) — belge içi tutarsızlık, insan incelemesine.
12. **itwiki kalitesi:** lead'de başıboş "E giocava" metni (C056); Madrid iddiası desteksiz (C030).
