# KANIT DOSYASI — Q212616 · Medusa'nın Salı (Le Radeau de la Méduse / The Raft of the Medusa) · Théodore Géricault

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md`
**Durum:** İnsan incelemesi bekliyor.
**Araştırma brief'i:** `.qwen/tmp/parti4/Q212616-brief.md` (kaynak-arastirma agent; ham cache `.qwen/tmp/parti4/`).

---

## 0. Yöntem ve kaynak hiyerarşisi

Eser bir tuvaldir (Musée du Louvre, Paris). **Birincil Louvre koleksiyon notice'i AÇILDI (S3 HTML + S4 JSON, HTTP 200; URL WD P31/P186 refs + enwiki dış bağlantısından bulundu, tahmin değil; notice son güncelleme 24.04.2026)** → sanatçı/tarih 1818–1819/huile sur toile/491×716/INV 4884 + C 51/Salle 700 Mollien/tam provenance (1824 posthume satış 6005 fr → Dedreux-Dorcy/Forbin → 1826 Louvre)/Salon 1819/Londra-Dublin/restorasyonlar **A**. **Eski FR notice (S5, Wayback 2021-02-03, yazar Séverine Laborie)** birincil arşiv kopyası: "manifeste du Romantisme", hazırlık yöntemi, Caravaggesque ışık, Salon eleştirileri, Michelet **A**. Canlı eski louvre.fr notice URL'leri ölü (genel sayfaya yönleniyor); FR arşivi alındı (429→25 sn backoff→200). en/fr/it wikitext (S6/S7/S8) satır içi akademik atıf zinciriyle **B** (atıf hedefi metinlere ERİŞİLMEDİ). **Görsel İNCELENEMEDİ (vision kotası ana oturumda); yalnız metadata; GZ TASLAK.** Louvre'un kendi fotoğrafları © GrandPalaisRmn (PD DEĞİL); Commons kopyaları PD.

**10 ihtilaf D (C017, C048–C056):** tarih, salda gün, enkaz yeri, kurtarılan sayısı, halatlar, Argus'un gelişi, Londra açılışı, II. DS güzergâhı, itwiki iç hataları, başlık varyantı. **Aynı kurumun iki notice'i bile farklı** (güncel S3 "12 gün/15 kurtarıldı" ↔ eski S5 "13 gün/10 vies") → kesinleştirme YOK, hedge'ler korundu. **3 E (C057–C059):** görsel incelenemedi; akademik metinler erişilmedi; WD anomalileri. Brief'teki D/E belirsizlik ifadeleri (probablement/Soit que…soit/douze ou treize/may be/has speculated/probably) AYNEN korundu.

## 1. Kaynak envanteri

| ID | Kurum | Belge | URL | Erişim (14 Kas 2026) | Tür |
|---|---|---|---|---|---|
| S1 | Wikidata | Q212616 EntityData JSON | https://www.wikidata.org/wiki/Special:EntityData/Q212616.json | 200 | yardımcı |
| S2 | Wikidata | wbgetentities etiketler | https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q212616 | 200 | yardımcı |
| S3 | Louvre (birincil) | Collections notice HTML, cl010059199 (güncelleme 24.04.2026) | https://collections.louvre.fr/ark:/53355/cl010059199 | 200 | birincil |
| S4 | Louvre (birincil) | Notice JSON | https://collections.louvre.fr/ark:/53355/cl010059199.json | 200 | birincil |
| S5 | Louvre (birincil, arşiv) | Eski FR notice (Séverine Laborie), Wayback 2021-02-03 | http://web.archive.org/web/20210203075446/https://www.louvre.fr/oeuvre-notices/le-radeau-de-la-meduse | canlı ölü (yönlendirme); arşiv 200 (429→backoff) | birincil |
| S6 | Wikipedia en | "The Raft of the Medusa" wikitext (featured article) | https://en.wikipedia.org/w/api.php?action=parse&page=The%20Raft%20of%20the%20Medusa&prop=wikitext&formatversion=2 | 200 | ikincil |
| S7 | Wikipedia it | "La zattera della Medusa" wikitext | https://it.wikipedia.org/w/api.php?action=parse&page=La%20zattera%20della%20Medusa&prop=wikitext&formatversion=2 | 200 | ikincil |
| S8 | Wikipedia fr | "Le Radeau de la Méduse" wikitext (AdQ 2014) | https://fr.wikipedia.org/w/api.php?action=parse&page=Le%20Radeau%20de%20la%20M%C3%A9duse&prop=wikitext&formatversion=2 | 200 | ikincil |
| S9 | Commons | P18 dosyası imageinfo | https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|size|extmetadata&titles=File:JEAN%20LOUIS%20TH%C3%89ODORE%20G%C3%89RICAULT%20-%20La%20Balsa%20de%20la%20Medusa%20(Museo%20del%20Louvre,%201818-19).jpg | 200; metadata; İNCELENEMEDİ | görsel |
| S10 | Commons | Uygulama görseli WGA08630 imageinfo | https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|size|extmetadata&titles=File:Th%C3%A9odore%20G%C3%A9ricault%20-%20The%20Raft%20of%20the%20Medusa%20-%20WGA08630.jpg | 200; metadata; İNCELENEMEDİ | görsel |
| S11 | Internet Archive | Wayback availability (eski FR notice) | http://archive.org/wayback/available?url=www.louvre.fr/oeuvre-notices/le-radeau-de-la-meduse | 200 | yardımcı |
| S12 | Yerel data/ | basyapitlar, eser_hikayeleri, ikonografi, kunye, muze_numaralari, ders_dogrulama vb. (salt-okunur) | data/ (proje içi) | yerel | yardımcı |
| S13 | Louvre (eski EN notice) | itwiki refs URL — canlıda genel sayfaya yönleniyor | http://www.louvre.fr/en/oeuvre-notices/raft-medusa | 200 (yönlendirme, içerik yok); ÖLÜ | birincil (ölü) |

**S3/S4 (Louvre) doğrulanan:** Le radeau de la Méduse; Ancien titre « Scène de naufrage » (Salon 1819); Géricault Théodore (Rouen 1791 – Paris 1824), France École de; 1e quart XIXe (1818–1819); huile sur toile; H 4,91 m × L 7,16 m; INV 4884 / C 51; Département des Peintures; propriétaire Etat; Denon Niveau 1 Salle 700 – Salle Mollien romantisme ("Actuellement visible"); entrée Collection de Charles X, karar 12/11/1824. objectHistory: 80 rue du Faubourg-du-Roule; tuval 15×22 pieds (487×715) Étienne Rey 24.02.1818, 440 fr; Théâtre-Italien fuayesi Temmuz 1819 bitiş; Ağustos 1819 Louvre (Rey germe+vernik); Salon 1819 livret 510, Salon carré 25.08–30.11, önce kapı üstü sonra Ekim sonu ilk sıra; Bullock sözleşme Nisan 1820; Londra Egyptian Hall 12.06–30.12.1820; Dublin New Rotunda Şubat–Mart 1821; Forbin 03.02.1822 6000 fr + "5 ou 6 000 fr" teklifleri sonuçsuz; ölüm 28.01.1824; posthume satış hôtel de Bullion 02.11.1824 lot 1, 6005 fr Dedreux-Dorcy (Forbin talimatı, Maison du roi); La Rochefoucauld mektubu 12.11.1824; C 51; 1826'dan beri Louvre (Salon Carré→Grande Galerie→Sept-Cheminées→Mollien 1949–69→Daru 1969–94→Mollien 1995–); 1848 merdiven yırtığı; 21.09.1870 rulolandı, ~1871–72 yeniden gerildi; Villot INV 4884 (1852–60); Ronjat & Guillemet kopya Haziran 1859–Eylül 1860 (Amiens Picardie); I. DS Toulouse Jacobins; II. DS Eylül 1939–Temmuz 1946 Versailles Orangerie→Louvigny→Sourches, dönüş 11.07.1946; 1948 şasi; 1949 René Longa vernik; Kasım–Aralık 2018 Viala & Hurter gergi bandı. Notices liées: RF 1667 + RF 2229 (esquisse 1818), RF 579 (kol/bacak, lamba ışığı), RF 580 (sırt etüdü). Banner E001 + alt bilgi "ne reflète pas nécessairement le dernier état des connaissances".
**S5 (eski notice) doğrulanan:** "manifeste du Romantisme"; "officier d'Ancien Régime qui n'avait pas navigué depuis plus de vingt ans"; "13 jours … n'épargna que 10 vies"; "règlements de comptes et l'abomination du cannibalisme"; "le bateau … apparaît à l'horizon mais s'éloigne sans les voir"; "mouvement ascendant vers la droite … l'homme noir, figure de proue"; "interrogea des rescapés … maquette et figurines de cire … cadavres morcelés dans son atelier … deux esquisses du Louvre (RF 2229, RF 1667)"; "clair-obscur caravagesque"; "l'un pleurant son fils"; Gros (Jaffa) hayranlığı; Girodet Galatée aynı yıl zaferi; « Il frappe et attire tous les regards » (Journal de Paris); "amas de cadavres"; Coupin « Le but de la peinture est de parler à l'âme et aux yeux, et non pas de repousser »; Jal liberal övgü; Michelet « c'est notre société toute entière qui embarqua sur ce radeau de la Méduse ».
**Erişilemeyen (C058 E):** Eitner, Grigsby, Riding, Christiansen, Miles, Berger & Johnson (JSTOR 25087857), Boime, Noon, Wrigley, Chenique 2006, Savigny & Corréard 1817/1818, Wellington, Clark, Fried, Elsen, Nicholas, Borias filmi, Bazin, Grunchec, Le Modèle noir vb. — yalnız satır içi atıf zinciri; metne erişilmedi; uydurma DOI/ISBN/sayfa/alıntı ÜRETİLMEDİ.

## 2. İddia envanteri (A–E)

**C001** — Eserin adı Le Radeau de la Méduse; Salon 1819'daki özgün adı « Scène de naufrage » (Louvre "Ancien titre"). **A.** S3, S4.
**C002** — Théodore Géricault (Rouen 1791 – Paris 1824), Fransız okulu. **A.** S3, S4.
**C003** — 1818–1819'da yapıldı (XIX. yy ilk çeyreği); Louvre aralığı (WD/data tek yıl 1819 → C048). **A.** S3.
**C004** — Tuval üzerine yağlı boya (huile sur toile); 491 × 716 cm. **A.** S3, S4.
**C005** — Envanter INV 4884 (ana); C 51 (Charles X kayıt no); Département des Peintures; sahibi Devlet (Etat). **A.** S3, S4.
**C006** — Şu an Louvre'da görünür: Denon, 1. kat, Salle 700 – Salle Mollien (romantisme); site banner'ı konumun güncel olmayabileceğini not eder (E001). **A.** S3.
**C007** — Kamu malı (ölüm 1824 + 100 yıl pma); Commons kopyaları PD. **A.** S1 (P6216), S9, S10.
**C008** — Méduse firkateyni 2 Temmuz 1816'da Arguin sığlığında karaya oturdu; hedef Saint-Louis du Sénégal; gemide ~400 kişi (ülke adı ihtilaflı → C050). **A.** S3.
**C009** — Karaya oturma yeri bugünkü Moritanya açıklarıdır (Arguin bankı; ~60 km / ~30 mil). **B.** S6, S8.
**C010** — Kaptan Hugues Duroy de Chaumareys, Bourbon Restorasyonu'nun siyasi kayırmasıyla atanmış, 20 yıldan fazla denize çıkmamış bir émigré royalistti (itwiki ~25 der, E012). **B.** S5, S6.
**C011** — Filikalar yetmeyince ~150 kişi (Louvre "Cent-cinquante"; enwiki en az 146 erkek+1 kadın, frwiki en az 147 / gövde 149) derme çatma sala bindirildi; 17 kişi gemide kaldı (aralık korunur, E005). **A.** S3, S6, S8.
**C012** — Güncel Louvre notice'i halatların kesildiğini (coupés) ve salın terk edildiğini söyler (diğer kaynaklar farklı → C052). **A.** S3.
**C013** — Güncel Louvre notice'ine göre sal 12 gün sürüklendi; 17 Temmuz 1816'da Argus briki tarafından bulundu (gün sayısı ihtilaflı → C049). **A.** S3.
**C014** — 15 kişi canlı kurtarıldı (S3/S6); 4–5'i Argus'ta/yolda öldü (S6/S8) (eski notice "10 vies" → C051). **A.** S3, S6, S8.
**C015** — Salda isyan, şiddet, açlık, susuzluk ve yamyamlık yaşandı (akademik betimleme; ayrıntı yok). **A.** S5, S6.
**C016** — Resim, kazazedelerin ufukta Argus'u ilk görüp işaret ettiği anı gösterir; gemi onları görmeden geçti; rivayete göre ~2 saat sonra geri döndü (E006). **B.** S5, S6.
**C017** — Argus'un gelişi ihtilaflı: Louvre "envoyé à sa recherche" (aramaya gönderildi) ↔ enwiki (Borias) "by chance—no particular search effort" (tesadüf) ↔ frwiki "brick revenu en direction de l'épave" + "dépêché par Chaumareys … récupérer des biens" (enkaza doğru geri dönen / eşya için gönderilmiş). **D.** S3, S6, S8. (tartışma)
**C018** — Kurtulanlar cerrah Henri Savigny ile mühendis Alexandre Corréard'ın 1817'de yayımlanan anlatısı (ilk baskı 22 Kasım 1817) olayı skandala çevirdi; Géricault bunu keşfetti. **B.** S8, S6, S12.
**C019** — Kompozisyonun tepesinde, fıçı üstünde duran ve bez sallayan siyahi figür Jean Charles olarak tanımlanır; model Haitili Joseph'tir. **B.** S6, S8.
**C020** — Siyahi figürün umudun zirvesine yerleştirilmesi kölelik karşıtı bir tavır olarak yorumlanır (Géricault abolitionist); Riding Londra sergisinin anti-slavery ajitasyonuna denk getirildiğini "has speculated" (spekülatif, E004). **B.** S6, S8.
**C021** — Solda yaşlı adam ölü oğlunun bedenini kucağında tutar; umuda kayıtsızdır (yas karşıtı); başka bir figür saçını yolur. **B.** S5, S6.
**C022** — Yaşlı adam figürü Dante'nin Ugolino'suna gönderme OLABİLİR ("may be a reference"); Fuseli'nin 1806 Ugolino'sundan esinlenme ("may have known from prints") (E004). **B.** S6.
**C023** — Delacroix, yüzü aşağı dönük ve kolu uzanmış ön plan figürüne poz verdi; Jamar suya kayan ölü gence (+2 figür) poz verdi; Corréard, Savigny, Lavillette canlı model olarak direğin dibinde resmedildi. **B.** S6, S8.
**C024** — Kompozisyon piramidal yapı + çapraz hatlar üzerine kurulu: ölülerden (sol alt) umuda (tepe) yükseliş; biri direk+armalar→dalga, öteki uzanan figürler→Argus silueti; sağa yükselen hareket siyahi figürde doruklanır (enwiki iki çapraz, frwiki üç piramit sayar). **B.** S5, S6, S8.
**C025** — Figürler açlığa rağmen kaslı/kahramanca (Michelangelo ve klasik gelenek etkisi); Muther: "still something academic … not sufficiently weakened by privation". **B.** S6.
**C026** — Işık "Caravaggesque" chiaroscuro (tenebrizm); palet kasvetli kahve/okra/yeşilimsi; deniz koyu yeşil; kurtarma gemisi yönünden parlak ışık. **B.** S5, S6.
**C027** — Géricault kurtulanlarla görüştü ve onları çizdi, maket ve balmumu figürlerle çalıştı, atölyesinde ceset/uzuv inceledi, arkadaşlarına poz verdi, konular arasında kararsız kaldı; iki Louvre eskizi (RF 2229, RF 1667) (ayrıntı → C061). **A.** S5.
**C028** — Palette bitüm (bitume de Judée) vardı; zamanla geri döndürülemez kararma ve buruşuk yüzey; ayrıntılar bugün zor seçilir (frwiki alternatif: kurşun oksit+bal mumu ile aşırı siccatif yağ, E003). **B.** S6, S8.
**C029** — Beyaz tuval üzerine doğrudan, figür figür çalıştı (Montfort anısı); küçük fırçalar, viskoz yağlar; boyama ~8 ay, proje ~18 ay (Kasım 1818–Temmuz 1819 disiplinli dönem). **B.** S6.
**C030** — Paris'te 80 rue du Faubourg-du-Roule atölyesinde başladı; tuval 15×22 pieds (487×715) Étienne Rey 24.02.1818, 440 fr; Temmuz 1819 Théâtre-Italien fuayesinde bitirdi; Ağustos 1819 Louvre'a taşındı (Rey germe+vernik). **A.** S3.
**C031** — Salon 1819: livret no 510, « Scène de naufrage »; Salon carré'da 25 Ağustos–30 Kasım 1819; önce kapı üstünde, Ekim sonu ilk sıraya indirildi. **A.** S3.
**C032** — Salon'da altın madalya aldı ama ulusal koleksiyona seçilmedi; Sacred Heart siparişi gizlice Delacroix'ya verildi (Géricault imzaladı). **B.** S6.
**C033** — Londra Egyptian Hall (Bullock), 12 Haziran–30 Aralık 1820 (Bullock sözleşmesi Nisan 1820); açılış günü ihtilaflı → C053; sayılar → C062. **A.** S3.
**C034** — Dublin New Rotunda, Şubat–Mart 1821 (neden → C063). **A.** S3.
**C035** — Yaşamında satış gerçekleşmedi: Forbin'in 1822'de 6000 fr ve sonra "5 ou 6 000 frank" teklifleri sonuçsuz; Louvre "probablement" ve "Soit que le prix … soit parce que le ministère est embarrassé par le sujet" ile belirsiz bırakır (E002). **A.** S3.
**C036** — Géricault 28 Ocak 1824'te öldü; 2 Kasım 1824 posthume satış (hôtel de Bullion, lot 1), 6005 frank'a Dedreux-Dorcy tarafından Forbin talimatıyla Maison du roi için alındı; karar 12 Kasım 1824; Charles X koleksiyonu, C 51. **A.** S3, S4, S8.
**C037** — 1826'dan beri Louvre'da sürekli sergilenir (savaş dönemleri hariç); Salon Carré → Grande Galerie → Sept-Cheminées → Mollien (1949–69) → Daru (1969–94) → Mollien (1995–). **A.** S3.
**C038** — I. DS: Toulouse Jacobins kilisesi; II. DS: Eylül 1939–Temmuz 1946 Versailles Orangerie → Louvigny → Sourches; 11 Temmuz 1946 dönüş (enwiki/frwiki Chambord der → C054). **A.** S3.
**C039** — Restorasyonlar: 1848 (merdiven yırtığı), 1948 (şasi değişimi), 1949 (René Longa, kısmi vernik temizliği), Kasım–Aralık 2018 (Viala & Hurter, gergi bandı yenileme). **A.** S3.
**C040** — 1859–60'ta Ronjat & Guillemet birebir kopya yaptı (Haziran 1859–Eylül 1860); kopya bugün Amiens, Musée de Picardie'de; 493×717 cm + sipariş nedeni bozulma (S6 Smith). **A.** S3, S6.
**C041** — INV 4884 numarası 1852–1860 arasında konservatör Frédéric Villot tarafından verildi. **A.** S3.
**C042** — Salon eleştirileri ikiye bölündü: klasikçiler "amas de cadavres" (ceset yığını); Jal liberal/siyasi övgü; Journal de Paris « Il frappe et attire tous les regards »; Coupin « …non pas de repousser »; Louis XVIII'nin "naufrage qui n'en est pas un pour vous" sözü (Gérard üzerinden, Wrigley 1995 s.76, S6). **A.** S5, S6.
**C043** — Michelet: "c'est notre société toute entière qui embarqua sur ce radeau de la Méduse" (bütün toplumumuz Medusa'nın salına bindi). **A.** S5.
**C044** — Fransız Romantizmi'nin manifestosu/kurucu ikonu (Louvre S5 "manifeste du Romantisme"); Neoklasik düzenle kopuş; güncel olayın tarih resmi ölçeğinde sunulması (etki zinciri → C080). **A.** S5, S6.
**C045** — Resimde kurtarma anındaki gerçek sayıdan fazla figür var; kurtarma gününün güneşli/sakin denizi yerine fırtına ve karanlık deniz betimlendi (Christiansen tespiti). **B.** S6.
**C046** — Olay uluslararası skandal oldu; sorumluluk kaptanın liyakatsizliğine ve Bourbon kayırmacılığına yüklendi; ancak atamadan Louis XVIII'yi şahsen sorumlu tutmak hatalıydı (rutin Deniz Bakanlığı ataması, E010). **B.** S6.
**C047** — Salın ölçüsü ~20 × 7 m idi (itwiki blog refs; frwiki de yazar; doğrulanmadı, zayıf). **C.** S7, S8. (kullanılmadı)
**C048** — Tarih ihtilaflı: Louvre 1818–1819 (S3/S4) + enwiki/frwiki ↔ WD P571 "1819" (precision 9, yıl; refs eski Louvre URL) + data/basyapitlar "1819" (tamamlanma yılı). **D.** S1, S3, S6, S8, S12. (tartışma)
**C049** — Salda geçen gün ihtilaflı: güncel Louvre "douze jours" (12) ↔ eski notice "13 jours" + enwiki 13 + data 13 ↔ frwiki "douze ou treize jours" (açık belirsizlik); 5→17 Temmuz sayım farkı olası ama DOĞRULANMADI. **D.** S3, S5, S6, S8, S12. (tartışma)
**C050** — Enkaz yeri ihtilaflı: Louvre (S3+S5) "côtes sénégalaises" / "près des côtes du Sénégal" ↔ enwiki/frwiki/data bugünkü Moritanya açıkları (Arguin bankı Moritanya kıyısında). **D.** S3, S5, S6, S8, S12. (tartışma)
**C051** — Kurtarılan sayısı ihtilaflı: S3/S6/data 15 ↔ eski notice "n'épargna que 10 vies" (10) ↔ itwiki "15 fecero ritorno a casa" (15 eve döndü); 4–5'i sonra öldü; 15−5=10 uzlaştırması olası hipotez (kaynakta açıkça yazılı değil). **D.** S3, S5, S6, S7, S8, S12. (tartışma)
**C052** — Halatlar ihtilaflı: Louvre "coupés" (kesildi) ↔ enwiki "turned loose" (bırakıldı) ↔ frwiki "larguer les aussières" (çözüldü/bırakıldı, Bordonove) ↔ itwiki "la cima si ruppe" (koptu) ↔ data "kesip" / "çözüldü" (iç tutarsızlık). **D.** S3, S6, S7, S8, S12. (tartışma)
**C053** — Londra açılışı ihtilaflı: Louvre 12 Haziran 1820 ↔ enwiki (Riding 72) 10 Haziran 1820 (iki gün fark). **D.** S3, S6. (tartışma)
**C054** — II. DS güzergâhı ihtilaflı: Louvre Versailles Orangerie → Louvigny → Sourches ↔ enwiki/frwiki (Nicholas, Rape of Europa) "Château de Chambord". **D.** S3, S6, S8. (tartışma)
**C055** — itwiki iç hataları: yapım sırasında "29 anni", ölümde "trentatré" (33) ↔ enwiki/frwiki/data 27 ve 32 (S3 1791–1824); itwiki Salon "foyer del Teatro italiano" ↔ S3/S6 Salon carré (Louvre); Théâtre-Italien yalnız bitirme mekânı. **D.** S3, S6, S7, S8. (tartışma)
**C056** — Özgün başlık varyantı: S3 "Scène de naufrage" ↔ S6 "Scène de Naufrage" ↔ S8 "Scène d'un naufrage" (küçük yazım farkı; birincil S3 esas). **D.** S3, S6, S8. (tartışma)
**C057** — Görsel bu oturumda İNCELENEMEDİ (vision kotası ana oturumda); P18 5872×4008 PD "Unknown source" (E011); uygulama WGA08630 5907×4014 PD-Art "art database"; Louvre fotoğrafları © GrandPalaisRmn (PD değil); GZ TASLAK. **E.** S9, S10, S4, S5. (belirsiz)
**C058** — Akademik kitap/makale metinleri erişilmedi (Eitner, Grigsby, Riding, Christiansen, Miles, Berger & Johnson, Boime, Noon, Wrigley, Chenique, Savigny & Corréard, Wellington, Clark, Fried, Elsen, Nicholas, Borias, Bazin, Grunchec vb.); yalnız satır içi atıf zinciri (B); uydurma DOI/ISBN/sayfa/alıntı yok. **E.** S6, S7, S8. (belirsiz)
**C059** — WD anomalileri: P136 (tür) = Q21450211 "Venel" (bir soyadı, hatalı; KULLANILMADI, E007); P2048/P2049/P217/P276 refsiz (Louvre A ile teyitli, E008); P571 precision 9 (yalnız yıl), P1480 yok; P195 refs yalnız enwiki (P143); P347 Joconde 000PE001303 (refsiz). **E.** S1. (belirsiz)
**C060** — Louvre bağlı kayıtları: RF 1667 + RF 2229 (esquisse, 1818), RF 579 (kol/bacak etüdü, lamba ışığı), RF 580 (sırt etüdü); S5 "deux esquisses du Louvre (RF 2229, RF 1667)". **A.** S3, S5.
**C061** — Hazırlık ayrıntıları: Beaujon hastanesi morgunda ceset çizimleri, ölmek üzere olan hastaların yüzleri, atölyeye getirilen kesik uzuvlar, tımarhaneden ödünç alınıp çatıda 2 hafta çizilen kesik baş; Corréard/Savigny/Lavillette ile ayrıntılı sal maketi (tahta aralıkları bile tuvale aktarıldı); Le Havre'da deniz/gökyüzü etüdü, fırtına gözlemi, İngiltere/Manş geçişi. **B.** S6.
**C062** — Londra'da ~40.000 ziyaretçi; Géricault payı ~20.000 frank (devletin satın alması halinde alacağından fazla). **B.** S6, S7.
**C063** — Dublin daha az başarılı; rakip hareketli panorama "The Wreck of the Medusa" (Marshall kardeşler), bir kazazedenin yönetiminde yapıldığı söylenir. **B.** S6, S7.
**C064** — Londra'da eser zemine yakın asıldı (monumental etki) ↔ Salon Carré'da yüksekte; Londra alımlaması daha olumlu; "national self-congratulation", sansasyonel eğlence ve eserden beslenen iki tiyatro gösterisi. **B.** S6, S7.
**C065** — Polis bakanı Decazes sansürü gevşetip Savigny raporunun basına sızmasına izin verdi; ultra Deniz bakanı du Bouchage'yi zayıflattı; skandal siyasi bir silaha dönüştü. **B.** S8.
**C066** — Delacroix anısı: Sal'ı yapım aşamasında gördü, "deli gibi koşarak" odasına döndü; Géricault'nun ölümünden sonra Fransız Romantizmi'nin bayraktarı oldu. **B.** S6.
**C067** — Joseph'in silueti Belvedere Torso'dan esinli; sırtı izleyiciye dönük; kompozisyonun sağ yarısındaki piramidin tepesinde; koyu kırmızı mendil; direğin sağında halatla birlikte ikinci bir Joseph yüzü izleyiciye bakar. **B.** S6.
**C068** — Berger & Johnson 1969: siyahi figür "focal point of the drama … 'hero of the scene'"; son dakika kararı değil (erken eskizler + Joseph portre etüdü); Wedgwood "Am I Not a Man and a Brother?" diz çökmüş embleminin tersine aktif kahraman (Libby & Childs 2014). **B.** S6.
**C069** — Öncüller: Copley Watson and the Shark 1778 (siyahi figür merkezde), Death of Major Pierson 1783, Scene of a Shipwreck (benzer kompozisyon); Goya Disasters of War 1810–12 + Third of May 1814 (siyasi); Goya'nın Shipwreck'ini görmüş olması olası değil. **B.** S6.
**C070** — Prud'hon Justice and Divine Vengeance Pursuing Crime 1808 (Getty): bunaltıcı karanlık + serilmiş çıplak ceset tabanı Géricault'yu etkiledi; gençliğinde Prud'hon kopyaları yaptı. **B.** S6.
**C071** — Michelangelo Son Yargı + Sistina tavanı, Raphael Transfiguration (Clark 269); Géricault "Michelangelo sent shivers up my spine…" (Borias 10:11); David ölçek/heykelsi gerginlik/"fruitful moment" (Novotny 85); Gros Jaffa 1804 öncül (Eitner); Marat 1793 güncel olay emsali. **B.** S6.
**C072** — Boime 141: tarih resmi jestleri/ölçeği ama kahraman değil sıradan insanlar, hayatta kalmadan öte bir dava yok; Riding: "the fallacy of hope and pointless suffering … civilised man into barbarism" (yorum olarak aktarılır). **B.** S6.
**C073** — frwiki biçimsel: üçler kuralı; yüksek ufuk; uzakta sakin deniz ↔ sal çevresinde agitation; kırılan dalga (Le Havre modeli) Moritanya kıyısı için "hata" sayılır (Salem 2000, 55). **B.** S8.
**C074** — Maillot 1831 "Raft of the Medusa shown in Salon Carré" (Louvre): eser Poussin, Claude Lorrain, Rembrandt, Caravaggio alongside asılı gösterilir. **B.** S6.
**C075** — George Cooke kopyası 1826–30 (130,5×196,2 cm), ABD turnesi (Boston/Philadelphia/NY/Washington); Uriah Phillips 1862'de New-York Historical Society'ye bıraktı; Gilbert Stuart diye yanlış kataloglandı; 2006'da Athanassoglou-Kallmyer sorgusuyla ortaya çıktı; Delaware Üniversitesi restorasyonu. **B.** S6.
**C076** — Çağdaş alımlama: Michel Butor Musée imaginaire (105 belirleyici eser, 2015/2019); Beyoncé & Jay-Z "Apeshit" videosunda (2018, Louvre) görünür. **B.** S8.
**C077** — Chenique & Lecoq-Ramond 2006 (143): "Batı resminin isimsiz ve arkadan görünen ilk kahramanı"; Joseph modeli (France Culture 2019; musees-occitanie, Adolphe Brune "Joseph, le nègre"). **B.** S8.
**C078** — Salda erzak: bir torba peksimet (ilk gün tüketildi), iki fıçı su (kavgada denize düştü), altı fıçı şarap. **B.** S6, S8.
**C079** — 21 Eylül 1870'te indirilip rulolandı ve Louvre zemin katına taşındı; ~1871–72'de yeniden gerilip sergilendi. **A.** S3.
**C080** — Etki zinciri: Delacroix (Dante'nin Kayığı 1822; Özgürlük 1830 "springs directly" Wellington; Don Juan'ın Enkazı 1840), Turner (1820 Londra'da görmüş olabilir "probably"; A Disaster at Sea ~1835; Köle Gemisi 1840), Courbet (Ornans'da Cenaze / Atölye, ölçek+sıradan insanlar, T.J. Clark 84), Manet (Fried: Angels at the Tomb of Christ baba-oğul figürü), Rodin (Elsen: Cehennem Kapıları). **B.** S6.
**C081** — (yorum) Eserin estetik/felsefi sentezi: umut ↔ umutsuzluk gerilimi, "kahramansız" tarih resmi, dehşetin estetize edilmesi ve yücelik (sublime); izleyicinin sahneye fiziksel katılımı. Bu bir yorumdur, olgu değildir; Boime/Riding/Clark/Chenique okumalarının sentezi. **C.** S5, S6, S8. (yorum)

**Sayım:** 81 iddia · A=30 · B=36 · C=2 · D=10 · E=3.

## 3. Görsel doğrulama kaydı (Kural 6)

- S9 (P18) metadata: 5872×4008, ~16,9 MB, Public domain, Credit "Unknown source" (E011), Artist Géricault, DateTimeOriginal 1819 (WD'den). S10 (uygulama WGA08630): 5907×4014, ~4,4 MB, PD-Art ("faithful photographic reproduction of a two-dimensional, public domain work of art"), Credit "art database" (Web Gallery of Art). Oran 5907/4014 = 1,4716 ≈ data gorsel_oranlari 1.47 ✓.
- Louvre kendi fotoğrafları (S4 image): © 2015 GrandPalaisRmn (musée du Louvre) / Michel Urtado; S5: © 2010 Musée du Louvre / Angèle Dequier → **PD DEĞİL, kullanılmadı** (yalnız metadata notu).
- **Vision kotası ana oturumda kullanıldığı için hiçbir görsel açılmadı/incelenmedi (C057 E).** Kompozisyon S3/S5 (A) + S6/S7/S8 (B) METNİNDEN; "kaynakların betimlediği" ifadesi kullanıldı. **GZ TASLAK** (gen.py gz_taslak). Görsel projeye kopyalanmadı; URL+lisans referans verildi.
- data/basyapitlar "Ne görüyoruz" betimindeki bazı ayrıntılar (yaşlı adamın "kırmızı örtüsü", "rüzgârın yelkeni salı kurtarıcıdan uzağa itmesi") erişilen kaynaklarda DOĞRULANMADI → görsel inceleme + insan teyidi gerekir (veri notu).

## 4. Kelime/süre sayımı

| Seviye | Hedef | Ölçülen | Süre |
|---|---|---|---|
| Başlangıç | 400–500 | 420 | 3 dk |
| Orta | 1300–1600 | 1304 | 10 dk |
| İleri | 2600–3200 | 2658 | 20 dk |

dogrula.py (mini + jsonschema Draft 2020-12): **Q212616 için 0 hata / 0 uyarı** (genel koşuda 4 hata başka eserlere ait: Q1368055/Q311243 eksik dosya — dokunulmadı). CJK: 0. iddia 81 (A30/B36/C2/D10/E3). CS10/DY5/AU5/GZ5/TK5; CS/DY/GZ/TK kanıt yalnız A/B. Birincil Louvre AÇILDI (A); görsel İNCELENEMEDİ (E); GZ TASLAK.

## 5. Veri notları (data/ dokunulmadı; insan onayına sunulur)

1. **Tarih:** data/basyapitlar "1819" ↔ birincil Louvre 1818–1819 (D001/C048); WD P571 de 1819 (precision 9). Ders 1818–1819 aralığını kullanır.
2. **Gün:** data/eser_hikayeleri + ikonografi "on üç gün" ↔ güncel Louvre "12", eski notice "13", frwiki "12 ya da 13" (D002/C049); kesinleştirme yok.
3. **Halat:** data hikaye "ipleri kesip bırakıyor" ↔ data ikonografi "halatları çözüldü" (iç tutarsızlık) + kaynak farkı (D005/C052); Louvre "coupés".
4. **Enkaz yeri:** data "Moritanya açıklarında" enwiki/frwiki ile uyumlu; Louvre "Sénégal kıyıları" der (D003/C050).
5. **Kurtarılan:** data "15 kişi canlı kurtarılıyor" doğru; kurtarma sonrası 4–5 ölüm yalnız ikonografi'de ("birkaçı kısa süre içinde öldü"); eski notice "10 vies" (D004/C051).
6. **Geri dönüş:** data "Rivayete göre … saatler sonra geri dönmüştü" ↔ enwiki "two hours later" (E006); "rivayete göre" hedge'i korundu.
7. **Figür adı:** data "bez sallayan adam" → kaynaklar figürü Jean Charles, model Haitili Joseph olarak adlandırır (C019); data figür adını eksik bırakır (uyuşmazlık değil, eksiklik).
8. **kunye/muze_numaralari/ders_dogrulama:** Q212616/Medusa kaydı YOK (INV 4884 / C 51 birincil kaynaktan hazır).
9. **Görsel betim:** data "kırmızı örtü" + "rüzgâr yelkeni iter" ayrıntıları erişilen kaynaklarda yok; görsel inceleme gerekir (C057).
10. **Bitüm:** data "bitüm … karardı" kesin; frwiki alternatif açıklama (kurşun oksit+bal mumu siccatif yağ) not edilmeli (E003/C028).
11. **WD anomalileri:** P136 "Venel" (E007) ve itwiki yaş/mekân hataları (D009/C055) data'ya yansımamış; import EDİLMEMELİ. P347 Joconde 000PE001303 refsiz.
12. **Birincil iç evrim:** eski S5 firkateyn için "plus de 150 soldats" derken güncel S3 "quatre cents hommes" der; frwiki "salle 700 depuis 1945" derken S3 ayrıntılı oda tarihi verir (Mollien 1949–69/Daru 1969–94/Mollien 1995–). Aynı kurumun metni zamanla değişmiş → D olarak beyan.
13. **Konu hassasiyeti:** gemi enkazı + ölüm/yamyamlık teması yalnız akademik ve açık ayrıntısız betimlendi (C015); derslerde aynı ton korundu.
