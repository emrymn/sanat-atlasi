# KANIT DOSYASI — Q4388208 · Kırık Testi (La Cruche cassée. / The Broken Pitcher) · Jean-Baptiste Greuze

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md`
**Durum:** İnsan incelemesi bekliyor.
**Araştırma brief'i:** `.qwen/tmp/parti4/Q4388208-brief.md` (kaynak-arastirma agent; ham cache `.qwen/tmp/parti4/Q4388208-*`).

---

## 0. Yöntem ve kaynak hiyerarşisi

Eser bir tuvaldir (Musée du Louvre, Département des Peintures). **Birincil Louvre notice (fr/en HTML + JSON) ve iki bağlı kayıt (MNR 861 kopya, RF 3801 eskiz) AÇILDI (200; URL enwiki satır içi ref + frwiki/itwiki ref'ten bulundu, tahmin değil; WD P973/P854 teyit eder)** → sanatçı/tarih "vers 1771 - 1772"/teknik/oval/boyut/envanter/konum/provenans/iki versiyon/Massard 1773/1777 atölye sergisi/eskiz-kopya zinciri **A**. en/it/fr Vikipedi + France Culture (2025) + Plume d'Art (Wayback 2024) ikincil; betim ve yorum katmanı **B/C**. Wikidata yardımcı. **Görsel İNCELENEMEDİ (vision kotası ana oturumda); Commons PD (Yorck) metadata + lisans çekildi; GZ TASLAK.**

**Üç yapısal uyuşmazlık D:** tarih data/WD "1771" ↔ birincil "vers 1771–1772" (C036); boyut WD 110×85 ↔ birincil 109×87 (C037); sembolizmin data/Commons'ta olgu gibi sunulması ↔ kaynakların çekincesi + birincil sessizlik (C038). **Kritik:** kırık testi = bekâret sembolizmi OLGU DEĞİL, yorumdur (C017 C); tüm yorum kaynakları hedged ("presume / on peut imaginer / si può immaginare / que l'on devine"), birincil kayıt sembolizmden söz etmez (C027 B). Louvre resmî fotoğrafları TELİFLİ (© GrandPalaisRmn) — kullanılmaz; ders Commons PD taramasını URL+lisans olarak referans verir.

**Brief seviyelerinden sapmalar (gerekçeli):** C017 brief'te "B (atıf zinciri)" idi → kullanıcı talimatı ve §4 gereği **C (yorum)** yapıldı (sembolizm okumasının kendisi); okumanın literatürdeki çekinceli sunumu ayrı bir **B** iddia olarak C027'de belgelendi. C026 brief'te C idi → erişilen sayfada doğrudan beyan (katılımcı listesi) olduğundan **B** yapıldı. D/E iddiaları aynen korundu.

## 1. Kaynak envanteri

| ID | Kurum | Belge | URL | Erişim (14 Kas 2026) | Tür |
|---|---|---|---|---|---|
| S1 | Wikidata | EntityData Q4388208.json | https://www.wikidata.org/wiki/Special:EntityData/Q4388208.json | 200 | yardımcı |
| S2 | Wikipedia en | "The Broken Vessel" wikitext | https://en.wikipedia.org/wiki/The_Broken_Vessel | 429→30s backoff→200 | ikincil |
| S3 | Wikipedia it | "La brocca rotta (Greuze)" wikitext | https://it.wikipedia.org/wiki/La_brocca_rotta_(Greuze) | 429→200 | ikincil |
| S4 | Wikipedia fr | "La Cruche cassée (Greuze)" wikitext | https://fr.wikipedia.org/wiki/La_Cruche_cass%C3%A9e_(Greuze) | 429→200 | ikincil |
| S5 | Commons | imageinfo File:Jean-Baptiste Greuze 001.jpg | https://commons.wikimedia.org/wiki/File:Jean-Baptiste_Greuze_001.jpg | 429→200; metadata, İNCELENEMEDİ | görsel |
| S6 | Wikidata | wbgetentities labels | https://www.wikidata.org/w/api.php | 429→200 | yardımcı |
| S7 | Louvre | birincil notice HTML (fr) | https://collections.louvre.fr/ark:/53355/cl010059258 | 200 | birincil |
| S8 | Louvre | birincil notice HTML (en) | https://collections.louvre.fr/en/ark:/53355/cl010059258 | 200 | birincil |
| S9 | Louvre | notice JSON | https://collections.louvre.fr/ark:/53355/cl010059258.json | 200 | birincil |
| S10 | Louvre | bağlı kayıt JSON: kopya MNR 861 | https://collections.louvre.fr/ark:/53355/cl010067159.json | 200 | birincil |
| S11 | Louvre | bağlı kayıt JSON: eskiz RF 3801 | https://collections.louvre.fr/ark:/53355/cl010061160.json | 200 | birincil |
| S12 | Plume d'Art (blog) | "La cruche cassée : l'innocence perdue selon Greuze" (canlı) | https://www.plumedart.com/post/la-cruche-cass%C3%A9e-l-innocence-perdue-selon-greuze | 404 (ölü) | ikincil |
| S13 | Plume d'Art (Wayback) | S12 arşiv kopyası | https://web.archive.org/web/20240215100232/https://www.plumedart.com/post/la-cruche-cass%C3%A9e-l-innocence-perdue-selon-greuze | 429→90s→200; ARŞİV 2024-02-15 | ikincil (arşiv) |
| S14 | France Culture | "Greuze, la cruche cassée et le désordre des familles", Allons-y voir ! (P. Boucheron), 2025-10-26 | https://www.radiofrance.fr/franceculture/podcasts/allons-y-voir/greuze-la-cruche-cassee-et-le-desordre-des-familles-6485583 | 200 | ikincil (medya; akademik konuklar) |
| S15 | Cambridge UP | Emma Barker, Greuze and the Painting of Sentiment, 2005 (enwiki satır içi ref) | https://en.wikipedia.org/wiki/The_Broken_Vessel | ERİŞİLMEDİ; yalnız atıf görüldü | ikincil (akademik) |
| S16 | Louvre kaynakçası | 13 bibliyografik kayıt (Villot 1855 … Lemoine/Jackall/Szanto 2025) | https://collections.louvre.fr/ark:/53355/cl010059258 | kayıtta anıldı; METNE ERİŞİLMEDİ | birincil kaynakça |
| S17 | Louvre (Wayback) | notice 2023 arşivi | https://web.archive.org/web/20231003042812/https://collections.louvre.fr/ark:/53355/cl010059258 | 429×3 (90s); ERİŞİLEMEDİ | birincil (arşiv) |

**S7/S8/S9 (Louvre) doğrulanan:** "La Cruche cassée."; Greuze, Jean-Baptiste (Tournus 1725 – Paris 1805), France École de, "Attribution actuelle"; "3e quart du XVIIIe siècle (vers 1771 - 1772)", dateCreated startYear 1771/endYear 1772/imprecision "vers"; "huile sur toile"; "Format : ovale"; Hauteur 1,09 m / Largeur 0,87 m (aksesuarlı 1,355×1,16 m×9 cm); INV 5036 + MR 1779; Département des Peintures; ownedBy "Etat"; "Sully, [Peint] Salle 932", "Aile Sully, Niveau 2", "Actuellement visible au Louvre"; previousOwner "Bécu, Jeanne, comtesse du Barry" (commanditaire); "saisie révolutionnaire" 1794 Louveciennes; objectHistory: iki özgün versiyon (diğeri marquis de Verri), Ekim 1777 Louvre atölye sergisi "fort admiré", "Le tableau n'est pas daté mais gravé par Massard en 1773", eskiz 1922 baronne Salomon de Rothschild legado; description: beyaz dekolteli elbise/balon kol/önlükte gül/kurdele+3 çiçek/göğüste gül/écharpe; bibliography 13 kayıt; exhibition listesi (Petit Palais 2025–26 vb.); relatedWork: Copie (cl010067159) + Esquisse (cl010061160). **Banner:** oda/localisation bilgileri güncel olmayabilir (E2).
**S10 (MNR 861):** "Copie de La Cruche cassée du Louvre (inv. 5036)"; linkType "D'après"; 111,5×85 cm; "non exposé"; ownedBy "Musées Nationaux Récupération"; Dorotheum Viyana → Wiesbaden 2. konvoy no 7990, 26 juin 1950 → 2 mars 1951 açılış → 29 mai 1951 altıncı komisyon → 1951 OBIP Louvre tahsisi → 1959–1989 Mobilier national → Louvre; inscriptions "Tampon (Colin)".
**S11 (RF 3801):** başlık "La Cruche cassée. Copie ou esquisse originale d'après le tableau original conservé au Louvre."; 43×37 cm, oval, huile sur toile; legs 1922; ancienne collection baronne Salomon de Rothschild (1843–1922); revers "R 1551"; 1927 CNAM envoi (eski not); Salle 932.
**S2/S3/S4:** betim (testi sağ kolda, aslan başlı çeşme figürün solunda, atkı dağınık/güller solmuş/bakış hésitant); sembolizm hedged; provenans (du Barry 1794, Verri, MNR 861 WWII, RF 3801); gallery (Dagonet mezar, Tournus sokağı — atıfsız).
**S13 (blog):** biyografi (Grandon/Natoire/İtalya 1755/Broken Eggs 1756 Met/Dead Bird 1765 Edinburgh/Malédiction paternelle/1769 kabul başarısızlığı/1771 du Barry); sembolizm "De là à imaginer…"; "farklı okuma düzeyleri".
**S14 (FC):** Diderot Salon 1763 alıntısı; atasözü; "que l'on devine tout juste abusée ou violée"; konuklar Faroult/Guichard/Potte-Bonneville/Challine; Mulvey "male gaze"/"adult gaze"; Barker 2012 Representations 117 kaynakçada.
**Erişilemeyen:** S12 canlı (404), S15 Barker 2005 metni, S16 katalog metinleri, S17 arşiv (429×3).

## 2. İddia envanteri (A–E)

**C001** — Eserin adı "La Cruche cassée." **A.** S7, S8, S9.
**C002** — Sanatçı Jean-Baptiste Greuze (Tournus 1725 – Paris 1805), Fransız okulu, "Attribution actuelle". **A.** S9.
**C003** — Tarih "vers 1771 - 1772" (18. yy 3. çeyreği); "vers" aynen korundu; kesin yıl değil. **A.** S7, S8, S9.
**C004** — Tuval üzerine yağlı boya (huile sur toile). **A.** S9.
**C005** — Oval format (Format : ovale). **A.** S9.
**C006** — 109 × 87 cm; aksesuarlı 135,5 × 116 × 9 cm. **A.** S9.
**C007** — Envanter INV 5036 (ana); MR 1779 (diğer). **A.** S9, S1.
**C008** — Louvre Département des Peintures; sahibi Fransız Devleti (Etat); heldBy Louvre. **A.** S9.
**C009** — Sully kanadı, Niveau 2, Salle 932 ("Jean-Baptiste Greuze 1725-1805" odası); "Actuellement visible au Louvre"; müze sitesi oda bilgisi güncel olmayabilir çekincesi (E2). **A.** S7, S9.
**C010** — Comtesse du Barry (Bécu, Jeanne) commanditaire/önceki sahip; Louveciennes'de devrimci el koyma (saisie révolutionnaire), 1794. **A.** S9.
**C011** — Kompozisyonun iki özgün versiyonu vardı; diğeri marquis de Verri'ye aitti; kayıt ikinci versiyonun akıbetini vermez. **A.** S9.
**C012** — Tablo tarihsiz; Massard tarafından 1773'te gravürlendi; Ekim 1777'de Salon kapanışından sonra Greuze'ün Louvre atölyesinde sergilendi, "fort admiré". **A.** S9.
**C013** — Eskiz Louvre'de RF 3801; 1922'de baronne Salomon de Rothschild legado'su. **A.** S9, S11.
**C014** — MNR 861 = Louvre orijinalinin (INV 5036) kopyası ("D'après" Greuze); MNR (récupération) statüsü; sergilenmiyor; 1950 Wiesbaden'den iade, 1951 Louvre'e tahsis. **A.** S10.
**C015** — Birincil betimleme: beyaz dekolteli elbise, balon kollu, önlük ucunda bir kucak gül, saçta kurdele + üç çiçek, göğüste gül, écharpe. **A.** S9.
**C016** — İkincil betim: kırık testi sağ kolda asılı; figürün solunda aslan başlı, su akan çeşme; "yakından bakınca" atkı dağınık (neredeyse göğüs açıkta), güller biraz solmuş/kalça hizasında, bakış hésitant. Güncel birincil betimleme testi/çeşmeyi açıkça saymaz; wikiler Louvre'a atıflı, S13 destekli → B. **B.** S2, S3, S4, S13.
**C017** — Kırık testi = kaybedilmiş bekâret okuması (YORUM; kaynaklar hedged; birincil sessiz). Brief B→C (kullanıcı talimatı + §4). **C.** S2, S3, S4, S13, S14. (yorum)
**C018** — Çeşme = erkek imgesi okuması (YORUM; "might be / peut être"). **C.** S2, S4. (yorum)
**C019** — Aynı sembolizm Greuze'ün Broken Eggs / Young Girl Weeping over Her Dead Bird / Le Miroir brisé eserlerinde de izlenir (kaynak aktarımı). **B.** S2, S3, S4, S13.
**C020** — MNR 861 kopyası WWII'de Almanlar tarafından çalındı, olası iade beklemek üzere Louvre'e emanet. S10 hırsızlığı literal anlatmaz; MNR/iade zinciri ima eder → B. **B.** S2, S3, S4, S10.
**C021** — Diderot, Greuze'ü ahlakçı-duygusal tür resmi için övdü (Salon 1763 bağlamı; "Fais de la morale en peinture…"); FC alıntısı, birincil metne erişilmedi. **C.** S14. (yorum)
**C022** — Ernest Dagonet'in Montmartre mezarlığındaki Greuze mezarını süsleyen eserden esinli heykel (atıfsız gallery; doğrulanmadı). **E.** S3, S4. (belirsiz)
**C023** — Tournus'da eserin adını taşıyan bir sokak (atıfsız gallery; doğrulanmadı). **E.** S3, S4. (belirsiz)
**C024** — Biyografi: 1769'da Académie'ye kabul parçası Septime Sévère/Caracalla; tarih ressamı değil "tür ressamı" olarak kabul; 1771'de du Barry siparişi (blog, atıfsız). **C.** S13. (yorum)
**C025** — Birincil kayıt kaynakçasında 13 akademik/katalog kaydı anılır (Villot 1855 … Lemoine/Jackall/Szanto 2025, cat. 79); metne erişilmedi (anılma olgusu A). **A.** S7, S9.
**C026** — FC yayınına Louvre 18. yy Fransız resimleri baş küratörü Guillaume Faroult, CNRS/ENS'den Charlotte Guichard, filozof Mathieu Potte-Bonneville, fotoğraf tarihçisi Éléonore Challine katıldı; Patrick Boucheron sundu. Brief C→B (erişilen sayfada doğrudan). **B.** S14.
**C027** — Sembolizm okuması literatürde çekinceli sunulur ("presume / on peut imaginer / si può immaginare / De là à imaginer / que l'on devine"); birincil Louvre kaydı sembolizmden SÖZ ETMEZ. **B.** S2, S3, S4, S9, S13, S14.
**C028** — MNR 861 detay: 111,5 × 85 cm, huile sur toile; Dorotheum Viyana; Wiesbaden 2. konvoy no 7990, 26 Haziran 1950; 2 Mart 1951 açılış; 29 Mayıs 1951 altıncı komisyon; 1951 OBIP Louvre tahsisi; 1959–1989 Mobilier national; "non exposé"; "Tampon (Colin)". **A.** S10.
**C029** — RF 3801 detay: başlık "Copie ou esquisse originale d'après le tableau original conservé au Louvre." (belirsizlik korunur, E6); 43 × 37 cm, oval, huile sur toile; legs 1922; Rothschild (1843–1922); revers "R 1551"; 1927 CNAM envoi (eski not); Salle 932. **A.** S11.
**C030** — Sergi listesi: Petit Palais "Peindre l'enfance" (16/09/2025–25/01/2026); "Peinture de genre" Tokyo/Kyoto 2015; "Le goût à la grecque" Atina 2009–10; "Madame du Barry" Marly 1992; "La Révolution française et l'Europe" Grand Palais 1989; Shanghai/Pékin 1982; Taipei 2001–02; Kyoto/Tokyo 1997. **A.** S9.
**C031** — FC yorum çerçevesi: atasözü "Tant va la cruche à l'eau qu'à la fin, elle se casse"; "que l'on devine tout juste abusée ou violée"; "Greuze est-il vraiment le peintre de l'enfance?" (YORUM). **C.** S14. (yorum)
**C032** — S13 biyografi/diğer eserler: Lyon Grandon 1740, Paris Natoire 1750, İtalya 1755 (Gougenot); Broken Eggs 1756 Met; Dead Bird 1765 Edinburgh; Malédiction paternelle (Fils ingrat 1777 / Fils puni 1778, Louvre); Chardin etkisi; tür hiyerarşisi; "farklı okuma düzeyleri" (blog, atıfsız). **C.** S13. (yorum)
**C033** — FC: Potte-Bonneville, Mulvey "male gaze" atıfla "adult gaze" sorgusu önerir; çocuk imgelerini "av/amblem" yapmanın etik sorunu (YORUM). **C.** S14. (yorum)
**C034** — Akademik metinlere/arşive erişilemedi: Barker 2005 (S15), Barker 2012 "Reading the Greuze Girl" Representations 117 (S14 kaynakça), S16 katalogları, S17 Louvre 2023 arşivi (429×3); kaynakçada anıldı, metne erişilmedi. **E.** S2, S14, S15, S16, S17. (belirsiz)
**C035** — Görsel bu oturumda İNCELENEMEDİ (vision kotası ana oturumda); Commons PD metadata + lisans çekildi; GZ TASLAK. **E.** S5. (belirsiz)
**C036** — Tarih ihtilafı (D1): data/basyapitlar "1771" + WD P571 +1771 prec 9 (P1480 circa yok, E9) + Commons DateTimeOriginal "1771" (E10) ↔ birincil "vers 1771 - 1772" + "n'est pas daté". **D.** S9, S1, S5. (tartışma)
**C037** — Boyut ihtilafı (D2): WD P2048/P2049 110 × 85 ↔ birincil + en/it/fr wiki 109 × 87. **D.** S9, S1, S2, S3, S4. (tartışma)
**C038** — Sembolizmin olgulaştırılması (D3): data/eser_notlari "Testi, yitirilen bekâretin alegorisidir" + Commons ImageDescription "symbolizing her lost virginity" (kesin) ↔ kaynaklar hedged + birincil sessiz. **D.** S5, S9, S2, S3, S4. (tartışma)
**C039** — Çeşme yönü (E4): data "sağda" (izleyici perspektifi) ↔ wikiler "on her left / sur sa gauche" (figür perspektifi); görsel incelenmedi, perspektif farkı olabilir, doğrulanamadı. **E.** S2, S3, S4. (belirsiz)
**C040** — data görsel detayları (E5): "saten" elbise/parıltıları, "göğüste ezilmiş gül", "şaşkın bakış" erişilen metinlerde desteklenmez (birincil "robe blanche"/"rose à la poitrine"; wiki "hésitant"); görsel incelenmedi → doğrulanmadı. **E.** S9, S2, S3, S4. (belirsiz)
**C041** — Başlık varyantları (E7): The Broken Vessel (enwiki) / The broken pitcher (WD) / Kırık Testi (data) / La brocca rotta (it) / Der zerbrochene Krug (de); birincil özgün başlık "La Cruche cassée.". **E.** S1, S2, S3. (belirsiz)
**C042** — Tür: genre art / tür resmi (WD P136 Q1047337); birincil kayıt "Peinture de genre" sergilerinde listeler. **B.** S1, S9.

**Sayım:** 42 iddia · A=19 · B=6 · C=7 · D=3 · E=7.

## 3. Görsel doğrulama kaydı (Kural 6)

- S5 metadata: File:Jean-Baptiste Greuze 001.jpg, 2908 × 3638 px, 2.461.692 bayt, oran ≈ 0,799 (data/gorsel_oranlari 0.8 ile uyumlu). Lisans: Public domain (LicenseShortName "Public domain", License "pd"; PD-old-100-expired, PD-Art (Yorck Project); AttributionRequired false; Restrictions boş). Credit: "The Yorck Project (2002) 10.000 Meisterwerke der Malerei (DVD-ROM), distributed by DIRECTMEDIA Publishing GmbH. ISBN 3936122202." + GalleriX.
- **Görsel İNCELENEMEDİ (vision kotası ana oturumda) → C035 E; GZ TASLAK (gen.py gz_taslak).** Kompozisyon S9 (A) + S2/S3/S4/S13 (B) METNİNDEN; "kaynakların betimlediği" ibaresi kullanıldı.
- Commons ImageDescription sembolizmi olgu gibi sunar ("symbolizing her lost virginity") → C038/D3 notu; metadata dışı görsel içerik incelenmedi.
- Louvre resmî fotoğrafları TELİFLİ: "© 2011 GrandPalaisRmn (musée du Louvre) / Michel Urtado"; "© 2010 … Angèle Dequier"; "© 2004 … Angèle Dequier" (S9 image). data/Commons PD taraması kullanır; Louvre fotoğrafları kullanılmaz/yeniden yayımlanmaz. Görsel projeye kopyalanmadı.

## 4. Kelime/süre sayımı

| Seviye | Hedef | Ölçülen |
|---|---|---|
| Başlangıç | 400–500 | 438 |
| Orta | 1300–1600 | 1319 |
| İleri | 2600–3200 | 2786 |

dogrula.py: **Q4388208 için 0 hata / 0 uyarı** (jsonschema Draft2020-12 AKTİF) · CJK: 0 · iddia 42 (A19/B6/C7/D3/E7). Global koşudaki 10 hata başka tamamlanmamış eserlere aittir (Q212616/Q219344/Q2324840/Q311243); bu esere dokunulmadı. Birincil Louvre AÇILDI (A); görsel İNCELENEMEDİ (E).

## 5. Veri notları (data/ dokunulmadı; insan onayına sunulur)

1. **Tarih (D1, C036):** data/basyapitlar.json "tarih": "1771" ve özet "1771 tarihli" ↔ birincil "vers 1771–1772". WD P571 prec 9, P1480 circa qualifier yok (E9); Commons DateTimeOriginal "1771" (E10). Birincil esas; "vers" korunmalı.
2. **Boyut (D2, C037):** WD P2048/P2049 110 × 85 ↔ birincil + wiki 109 × 87. Birincil esas.
3. **Sembolizm (D3, C038/C017):** data/eser_notlari.json "Testi, yitirilen bekâretin alegorisidir" (kesin) + Commons ImageDescription (kesin) ↔ kaynaklar hedged + birincil sessiz. Yorum olarak atıflandırılmalı; data cümlesi D adayı.
4. **data görsel detayları (E5, C040):** data/eser_ayrintilari.json "ezilmiş gül" (göğüs), "saten parıltıları", "şaşkın bakış" erişilen metinlerde desteklenmez; görsel incelenmedi → doğrulanmadı.
5. **Çeşme yönü (E4, C039):** data "sağda" (izleyici) ↔ wiki "figürün solu"; perspektif farkı olabilir; görsel teyit gerekli.
6. **Başlık (E7, C041):** data "Kırık Testi" / enwiki "The Broken Vessel" / WD "The broken pitcher" / birincil "La Cruche cassée." — varyant notu.
7. **MNR atıf nüansı (E8, C014/C020):** bağlı kayıt listesinde "Greuze" görünür ama JSON linkType "D'après" → kopya; WWII hırsızlığı ifadesi birincil MNR metninde literal değil (B).
8. **RF 3801 statüsü (E6, C029):** birincil başlık "Copie ou esquisse originale" belirsizliğini korur; itwiki "schizzo preliminare" tek yönde çözer; birincil belirsizlik esas.
9. **Uyumlu:** data "muze": "Department of Paintings of the Louvre" ↔ birincil/WD uyumlu; oval biçim, du Barry provenansı, aslan başlı çeşme destekli (C005/C010/C016). data/eserler_onbellek.json görsel lisans alanı "l": "" BOŞ → Commons PD teyit edildi (S5). data/gorsel_oranlari.json 0.8 ≈ 2908/3638 uyumlu.
10. **Görsel:** İNCELENEMEDİ (C035); GZ TASLAK; Louvre fotoğrafları telifli; insan editör görsel teyidi ZORUNLU.
