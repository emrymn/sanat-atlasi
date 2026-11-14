# KANIT DOSYASI — Q27097122 · İskender'in Babil'e Girişi (Entrée d'Alexandre dans Babylone / Le Triomphe d'Alexandre) · Charles Le Brun

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md`
**Durum:** İnsan incelemesi bekliyor.
**Araştırma brief'i:** `.qwen/tmp/parti3/Q27097122-brief.md` (kaynak-arastirma agent; ham cache `.qwen/tmp/parti3/`).

---

## 0. Yöntem ve kaynak hiyerarşisi

Eser bir tuvaldir (Musée du Louvre, Département des Peintures, Paris). **Birincil Louvre katalog kaydı AÇILDI (S4 HTML + S5 JSON, 200; URL WD P571 referansından P854 ve frwiki tek satır içi ref'inden alındı, tahmin değil)** → başlık/diğer ad/sanatçı/tarih "vers 1664 - 1665"/teknik/boyut/envanter INV 2898/konum/provenance/konu/kompozisyon betimi/biçimsel kaynaklar/eser tarihi **A**. İlgili kayıt INV 2968 (S6, "D'après" Le Brun, halı modeli şeritler) karşılaştırma için birincil. Eski cartelfr URL (S7) bugün aynı Louvre kaydına canlı yönlendiriyor (Wayback gerekmedi).

**enwiki/itwiki maddesi YOK** (WD sitelinks: ar/commonswiki/ja/he/fr) → yöntem gereği fr fallback (S3) kullanıldı; frwiki "ébauche" (taslak) banner'lı ve **tek satır içi ref'li** (→ Louvre), geri kalanı atıfsız → tek başına A yapılmadı. WD (S1/S2) yardımcı; P170/P186/P195/P217/P136/P180 "stated in: Joconde" (Q809825) ama **Joconde kaydına doğrudan erişilmedi** (URL yok, tahmin edilmedi).

**Görsel İNCELENMEDİ** (vision kotası ana oturumda); yalnız metadata + lisans + çözünürlük (S8). Commons dosyası **PD (PD-Art)**; Louvre sitesi fotoğrafları **TELİFLİ © GrandPalaisRmn** (kullanılmaz). Kompozisyon Louvre birincil METNİNDEN; **GZ TASLAK**.

**Başlık netleştirme:** Bu QID'nin birincil adı "Entrée d'Alexandre dans Babylone", diğer adı "Le Triomphe d'Alexandre". **"Les Reines de Perse aux pieds d'Alexandre / Pers Kraliçeleri (Darius'un Çadırı)" AYRI eserdir (Q18683143)**; `data/eser_adlari_tr.json` ikisini doğru ayırıyor. Louvre'da aynı başlıklı **INV 2968** (cl010056823, "D'après", halı modeli) ikinci kaydı var; birincil tablo **INV 2898**'dir, karıştırılmamalı.

**Dört ihtilaf D:** fil sayısı (C035/D1), tarih düzleştirme (C036/D2), biçimsel kaynak Rubens↔Mantegna (C032/D3), İskender başlığı/asa (C037/D4). Brief D/E ifadeleri (vers/paraît/probablement/serait/sans doute/peut être/pourrait/il semble que) AYNEN korundu.

## 1. Kaynak envanteri

| ID | Kurum | Belge | URL | Erişim (14 Kas 2026) | Tür |
|---|---|---|---|---|---|
| S1 | Wikidata | EntityData Q27097122 | https://www.wikidata.org/wiki/Special:EntityData/Q27097122.json | 200 · 16:01:25Z | yardımcı |
| S2 | Wikidata | wbgetentities (27 ilgili QID label/description; ham cache `Q27097122-related-labels.json`) | https://www.wikidata.org/w/api.php?action=wbgetentities | 200 · 16:02:36Z | yardımcı |
| S3 | fr.wikipedia | "Entrée d'Alexandre dans Babylone" wikitext (action=parse, redirects=1) | https://fr.wikipedia.org/w/api.php?action=parse&page=Entrée%20d%27Alexandre%20dans%20Babylone&prop=wikitext&formatversion=2&redirects=1 | 200 · 16:02:36Z | ikincil |
| S4 | Musée du Louvre | Birincil katalog HTML (en arayüz; içerik FR/EN) | https://collections.louvre.fr/en/ark:/53355/cl010060585 | 200 · 16:02:37Z · 72.342 bayt | **birincil** |
| S5 | Musée du Louvre | Aynı kaydın JSON'u ("JSON Record") | https://collections.louvre.fr/ark:/53355/cl010060585.json | 200 · 13.590 bayt | **birincil** |
| S6 | Musée du Louvre | İlgili kayıt INV 2968 JSON (S5 relatedWork) | https://collections.louvre.fr/ark:/53355/cl010056823.json | 200 · 2.695 bayt | **birincil** (karşılaştırma) |
| S7 | Musée du Louvre (eski Atlas/cartelfr) | WD P276 ref'indeki eski notice (idNotice=8790) | http://cartelfr.louvre.fr/cartelfr/visite?srv=car_not_frame&idNotice=8790 | 200 · yönlendirme → cl010060585 | birincil (legacy) |
| S8 | Wikimedia Commons | imageinfo (url\|size\|extmetadata), P18 dosyası | https://commons.wikimedia.org/w/api.php?action=query&titles=File:Entrée%20d%27Alexandre%20dans%20Babylone%20-%20Charles%20Lebrun%20-%20Musée%20du%20Louvre%20Peintures%20INV%202898%20;%20MR%201919.jpg&prop=imageinfo&iiprop=url\|size\|extmetadata | 200 · 16:02:37Z | görsel metadata |
| S9 | Wikimedia Commons | Kategori wikitext | https://commons.wikimedia.org/w/api.php?action=parse&page=Category:Entrée%20d%27Alexandre%20dans%20Babylone%20(Louvre%20INV%202898)&prop=wikitext | 200 | görsel/yardımcı |
| S10 | yerel (salt-okunur) | data/*.json (8 dosya) + DURUM.md, MUFREDAT.md | data/basyapitlar.json (yerel) | — | iç yardımcı |

**URL provenansı:** S4 URL'si WD P571 ref (P854) + frwiki tek satır içi ref'inden; S5/S6 URL'leri S4/S5 sayfa içeriğinden. **URL tahmini yapılmadı.** S2 tam ids listesi ham cachede; endpoint URL'si verildi.
**S4/S5 doğrulanan:** Titre "Entrée d'Alexandre dans Babylone"; Autre titre "Le Triomphe d'Alexandre"; Le Brun, Charles (Paris 1619 - Paris 1690), "Attribution actuelle", doubt ""; "3e quart du XVIIe siècle (vers 1664 - 1665)" (JSON imprecision "vers"); huile sur toile; Hauteur 4,5 m / Largeur 7,07 m / Largeur avec accessoire 7,52 m; INV 2898 + MR 1919; Département des Peintures; Salle 914, Aile Sully, Niveau 2 ("Currently on display"); Collection de Louis XIV (entrée), ownedBy Etat, heldBy Louvre; Commentaire (Bernini 1665 Gobelins, Arbelles 331 av. J.-C., Quinte-Curce Vaugelas 1661, Asma Bahçeler, Bagophanès "serait", Sémiramis asa+nar "probablement" Pudicité Mattei, "Alexandre couronné … deux éléphants", Mantegna/Amour et Psyché/Polydore, Salon 1673, 29 çizim Beauvais, Audran 1676, transposé + Paulet 1963, suite INV 2894/2895/2897).
**Erişilemeyen:** Joconde (Q809825, URL yok → E8/C040); Louvre kaynakçasındaki basılı eserler + Quinte-Curce/Nivelon birincil metinleri (yalnız Louvre alıntısı → E9/C039); enwiki/itwiki (sitelink yok → E10/C041). Wayback KULLANILMADI (ölü URL yok).

## 2. İddia envanteri (A–E)

**C001** — Eserin birincil adı "Entrée d'Alexandre dans Babylone". **A.** S4, S5.
**C002** — Diğer adı "Le Triomphe d'Alexandre" ("Autre titre"; "Il est également connu sous le titre…"). **A.** S4, S5.
**C003** — Charles Le Brun (Paris 1619 – Paris 1690); "Attribution actuelle", şüphe alanı boş; ayrıca "France, École de". **A.** S5.
**C004** — Tarih: "3e quart du XVIIe siècle (vers 1664 - 1665)"; JSON imprecision "vers" (kesin yıl yok). **A.** S4, S5.
**C005** — Tuval üzerine yağlı boya (huile sur toile). **A.** S4, S5.
**C006** — Boyut: 4,5 m × 7,07 m; aksesuarla (çerçeve) genişlik 7,52 m. **A.** S4, S5.
**C007** — Envanter: INV 2898 (Numéro principal) + MR 1919 (Autre numéro); Département des Peintures. **A.** S4, S5.
**C008** — Sergide: Sully kanadı, Niveau 2, Salle 914 ("Charles Le Brun (1619-1690)" salonu) — E2 şerhiyle (güncel olmayabilir). **A.** S4, S5.
**C009** — XIV. Louis koleksiyonundan giriş (entrée); mülkiyet Etat; tasarruf Louvre. **A.** S5.
**C010** — Tablo 1665'ten önce bitmişti; Gobelins'te Bernini (Cavalier Bernin) tarafından görüldü (Chantelou, éd. 2001, p. 243). **A.** S4.
**C011** — Konu: Darius III'e karşı Arbelles zaferi (MÖ 331) sonrası Babil'e giriş; Le Brun "paraît" Quinte-Curce'u izlemiştir (Vaugelas çev. 1661, s. 256-258). **A.** S4.
**C012** — İskender taçlı ("couronné"); arabası İKİ fil tarafından çekiliyor ("char tiré par deux éléphants"). **A.** S4.
**C013** — Asma Bahçeler Quinte-Curce anlatımından hayal edilerek betimlendi (éd. 1661, p. 258). **A.** S4.
**C014** — Sur girişinde anıtsal Sémiramis heykeli: bir elde asa (sceptre), diğerinde nar (grenade, "symbole de l'unité de l'État"); model "probablement" Pudicité Mattei (Vatikan). **A.** S4.
**C015** — Önde emir veren figür "serait" Bagophanès ("gouverneur de Babylone") — Nivelon [v. 1697] éd. 2004, p. 322. **A.** S4.
**C016** — Gümüş tripodlar (tütsü dumanı) + yola serpilen çiçekler betimlendi (Quinte-Curce, éd. 1661, p. 256). **A.** S4.
**C017** — Biçimsel kaynaklar: Mantegna "Triomphe de César" (fil üstünde genç); antik kabartma Amour et Psyché / "Lit de Polyclète" (eski Ghiberti malı; solda arkadan kadın); brancard üstü anıtsal vazo → Polydore de Caravage modelleri (barok bolluk); Louvre, Le Brun'ün bu resimden kısa süre sonra ünlü gümüş mobilya (mobilier d'argent) için desenler vereceğini not eder. **A.** S4.
**C018** — Salon de 1673'te sergilendi (Loire, 1992b, p. 39). **A.** S4.
**C019** — Louvre Arts graphiques fonunda kompozisyonla ilgili 29 çizim (Lydia Beauvais envanteri, Beauvais 2000). **A.** S4.
**C020** — 1676'da Girard Audran tarafından 4 plakayla gravür edildi. **A.** S4.
**C021** — Eski bir transpozisyon (tuval aktarımı) geçirdi; 1963'te Pierre Paulet tarafından restore edildi. **A.** S4.
**C022** — "Histoire d'Alexandre" dizisinin devamı: INV 2894, 2895, 2897; ilgili kayıt INV 2968 (cl010056823): "D'après" Le Brun, halı modeli şeritler ("Plusieurs bandes ayant servi de modèle de tapisserie…"), Mobilier National/Gobelins'te. **A.** S4, S6.
**C023** — Louvre sitesi fotoğrafları TELİFLİ: © GrandPalaisRmn (musée du Louvre) / Rabeau-Didierjean-Chan-Liat 2021; Angèle Dequier 2002; René-Gabriel Ojéda 1995; Arnaudet/Blot 1989 — PD DEĞİL. **A.** S5.
**C024** — Commons dosyası: 10842×6854 px, 28.603.094 bayt, PD (PD-Art "faithful photographic reproduction"); Artist Charles Le Brun; Credit "photo Shonagon 2024-04-05"; AttributionRequired false. **A.** S8.
**C025** — WD P571: on yıl hassasiyeti (precision 8, "1660s"); P1319 en erken 1664 / P1326 en geç 1665 (precision 9); ref P854 = Louvre cl010060585 (A ile uyumlu). **B.** S1.
**C026** — WD P170 (Le Brun), P186 (oil paint; canvas), P195 (Louvre Paintings Q3044768 + INV 2898), P217 (INV 2898; MR 1919), P136 (history painting), P180 (İskender/Babil/araba/fil/at/Asma Bahçeler/heykel vb.) — "stated in: Joconde" (Q809825); Joconde'a doğrudan erişilmedi (C040). **B.** S1, S2.
**C027** — WD P276 = Room 914 (Q27097128); ref Atlas (Q7585771) + cartelfr idNotice=8790 (erişim 2016-10-05); eski URL bugün aynı Louvre kaydına yönlendiriyor; güncel konum A (C008) ile uyumlu, E2 şerhi geçerli. **B.** S1, S7.
**C028** — frwiki çekirdek olguları: 1664-1665, huile sur toile, peinture d'histoire, Darius zaferi sonrası giriş, Salon 1673 döngüsü, XIV. Louis tarafından satın alındı, Louvre'da — tek satır içi ref → Louvre (consulté le 22 février 2026); çekirdek zaten A. **B.** S3.
**C029** — WD P6216: public domain (P1001: 100 yıl pma veya kısa ülkeler; P459: yazar ölümünden 100+ yıl); Commons PD-Art (C024) ile uyumlu. **B.** S1, S2.
**C030** — frwiki değerlendirmesi: "dont c'est sans doute le chef-d'œuvre" (Le Brun'ün kuşkusuz başyapıtı) — atıfsız estetik değerlendirme; "sans doute" korunur. **C.** S3. (yorum)
**C031** — frwiki alegorik "dört okuma" (tamamı satır içi atıfsız): İskender=Louis XIV; Sémiramis heykeli="ou d'Ishtar ?" + Anne d'Autriche naibliğinin sonu; Hephaestion "peut être" Colbert; kırmızı bayraktaki couleuvre=Colbert arması; altın koç=Amon/Siwa + Séguier arması ("devrait certainement être interprété"); hazineler=Gobelins; lirli sanatçı "pourrait être" Le Brun'ün kendisi; filin gözü="admoniteur". Hedge'ler AYNEN. **C.** S3. (yorum)
**C032** — Biçimsel kaynak ihtilafı (D3): frwiki ana model olarak Rubens "Entrée triomphale d'Henri IV dans Paris" (Uffizi) önerir ("il semble que", atıfsız); Louvre (C017) Mantegna + antik kabartmalar + Polidoro de Caravage sayar, Rubens ANMAZ. **D.** S3, S4. (tartışma)
**C033** — data dersindeki görsel detaylar (E7): "altın bir vazo" (Louvre yalnız "vase monumental"; "vase d'or" yalnız atıfsız frwiki), İskender'de "elinde bir asa" + "tüylü miğfer", "kırmızı pelerinli atlı", "solda kadınlar ve çocuklar", buhurdan tekil (Louvre çoğul tripod), hotspot koordinatları — görsel incelenmedi; metinsel destek kısmi/çelişkili (C035/C037). **E.** S10, S4, S3. (belirsiz)
**C034** — data dersindeki biyografi/üslup iddiaları: "kralın baş ressamı", "Akademi'nin yöneticisi", "Poussin'in klasik düzenini Barok görkemle birleştiren üslup", halıların "Avrupa'ya yayıldı", "sonraki kuşakların akademik büyük resimlerine model teşkil etti" — bu partide ayrı kaynakla doğrulanmadı (Le Brun biyografisi için kaynak gerekir); halı modeli kısmı C022 ile kısmen destekli. **E.** S10. (belirsiz)
**C035** — Fil sayısı ihtilafı (D1): data "bir fil" (tekil; basyapitlar "Ne görüyoruz?" + eser_ayrintilari "Fildeki genç") ↔ Louvre "deux éléphants" (A, C012) + frwiki "deux éléphants". Görsel incelenmedi; karşılaştırma metinsel; birincil iki fil der. **D.** S10, S4, S3. (tartışma)
**C036** — Tarih düzleştirme ihtilafı (D2): data "tarih":"1664" + onbellek "yil":1664 (kesin tek yıl) ↔ Louvre "vers 1664 - 1665" (A, C004) + WD on yıl hassasiyeti/1664-1665 sınırları (C025). data ozeti ("1660'larda") uyumlu ama "tarih" alanı aşırı kesin. **D.** S10, S4, S1. (tartışma)
**C037** — İskender başlığı/asa ihtilafı (D4, çözümsüz): Louvre "Alexandre couronné" (taçlı, C012) ↔ WD P180 "helmet" (C026) + data "tüylü miğfer … elinde bir asa". Louvre metninde asa (sceptre) SÉMİRAMİS heykelindedir (C014); İskender'in elinde asa birincil metinde geçmez. Görsel incelenmeden çözülemez. **D.** S4, S1, S10. (tartışma)
**C038** — Görsel bu oturumda İNCELENMEDİ (vision kotası ana oturumda); yalnız metadata+lisans+çözünürlük (S8); Commons PD; kompozisyon kaynak betiminden; GZ TASLAK. **E.** S8. (belirsiz)
**C039** — Louvre kaynakçasındaki basılı eserler (Milovanovic 2021; Lambraki-Plaka/Laugier/Fabre 2021; Burchard 2016; Brassat 2013; Trésors retrouvés des Gobelins 2012; Chantelou éd. 2001; Loire 1992/1993; Compin/Roquebert 1986; Compin/Reynaud/Rosenberg 1974; Compin/Reynaud 1972; Brière 1924) ve birincil metinler (Quinte-Curce, trad. Vaugelas, éd. 1661; Nivelon [v. 1697] éd. 2004) yalnız Louvre alıntısından biliniyor; metne erişilmedi; DOI/ISBN üretilmedi. **E.** S4. (belirsiz)
**C040** — Joconde (Q809825) WD'de "stated in" olarak anılıyor; doğrudan URL verilmediği için erişilmedi (URL tahmini yasak). **E.** S1, S2. (belirsiz)
**C041** — enwiki ve itwiki maddesi YOK (WD sitelinks: ar/commonswiki/ja/he/fr); frwiki "ébauche" banner'lı ve tek satır içi ref'li, geri kalanı atıfsız → tek başına A yapılmadı. **E.** S1, S3. (belirsiz)

**Sayım:** 41 iddia · A=24 · B=5 · C=2 · D=4 · E=6.

## 3. Görsel doğrulama kaydı (Kural 6)

- S8 Commons metadata: `File:Entrée d'Alexandre dans Babylone - Charles Lebrun - Musée du Louvre Peintures INV 2898 ; MR 1919.jpg`; **10842×6854 px · 28.603.094 bayt**; PD (PD-Art); Credit "photo Shonagon 2024-04-05"; AttributionRequired false. Orijinal URL: `https://upload.wikimedia.org/wikipedia/commons/8/81/Entr%C3%A9e_d%27Alexandre_dans_Babylone_-_Charles_Lebrun_-_Mus%C3%A9e_du_Louvre_Peintures_INV_2898_%3B_MR_1919.jpg`.
- **GÖRSEL İNCELENMEDİ (C038 E)** — vision kotası ana oturumda; `incelenen_bolgeler=[]` → gen.py `gz_taslak` otomatik. Kompozisyon Louvre birincil METNİNDEN (C012/C014/C013/C016/C017). **GZ TASLAK.**
- Louvre sitesi fotoğrafları (S5, 8 görüntü) TAMAMI © GrandPalaisRmn — **PD DEĞİL, telifli (C023)**; projeye kopyalanmadı, kullanılmadı. Ders görseli Commons PD dosyasını URL+lisans olarak referans verir.
- data hotspot koordinatları ve renk/konum detayları (sarı pelerin, mavi örtü, kırmızı pelerinli atlı, çocuklar, buhurdan "sağ alt", vazo "omuzda") görselden doğrulanmadı (C033 E); Louvre vazo için "sur un brancard" der.

## 4. Kelime/süre sayımı

| Seviye | Hedef | Ölçülen | Süre |
|---|---|---|---|
| Başlangıç | 400–500 | 482 | 3 dk |
| Orta | 1300–1600 | 1436 | 10 dk |
| İleri | 2600–3200 | 2690 | 20 dk |

dogrula.py (mini + jsonschema Draft 2020-12): **Q27097122 için 0 hata / 0 uyarı** (kelime aralıkta; etiketsiz olgu 0; tekrar 0; quiz A/B; sayım tutarlı). CJK: 0. iddia 41 (A24/B5/C2/D4/E6). Birincil Louvre AÇILDI (A); görsel İNCELENMEDİ (E). Ayrıntı `KALITE_KONTROL.md`.

## 5. Veri notları (data/ dokunulmadı; insan onayına sunulur)

1. **D1 fil sayısı (C035):** data "bir fil" (tekil) ↔ Louvre "deux éléphants" (A). Öneri: ana oturumda iki fil olarak düzeltilmesi değerlendirilsin (bu agent data'ya yazmaz).
2. **D2 tarih (C036):** data "tarih":"1664" + onbellek "yil":1664 ↔ Louvre "vers 1664 - 1665". Öneri: "y. 1664–1665" / "vers 1664–1665" (circa korunmalı).
3. **D4 İskender başlığı/asa (C037):** data "tüylü miğfer + elinde asa" ↔ Louvre "couronné" (asa Sémiramis heykelinde). Görsel teyit gerekli; çözümsüz.
4. **Lisans alanı boş:** onbellek `gorseller[0].l:""` (Commons dosyası). Commons metadata PD (C024) → "PD"/"Public domain" doldurulabilir (ana oturum kararı). Louvre sitesi fotoğrafları telifli (C023), kullanılmaz.
5. **Başlık ayrımı doğru:** eser_adlari_tr Q27097122="İskender'in Babil'e Girişi", Q18683143="Pers Kraliçeleri… (Darius'un Çadırı)" — prompt varyant karışıklığı data'da YOK. Ek uyarı: Louvre INV 2968 (cl010056823) aynı başlıklı "D'après" kopya/halı modeli; INV 2898 ile karıştırılmamalı (C022).
6. **Doğrulanan data iddiaları:** eser_notlari "XIV. Louis için yapılan İskender dizisinin parçası" → A (C009/C022); eser_konulari (tarih/history-of-alexander) → A/B (C011, C026); basyapitlar ozet ("1660'larda … XIV. Louis için") → A uyumlu; "Asma Bahçeleri'ni çağrıştırdığı düşünülür" → Louvre daha kesin (C013, Quinte-Curce'dan hayal edildi); Gobelins halı dokuması → C022 kısmen destekli (model şeritler INV 2968).
7. **Doğrulanmayan data iddiaları (C033/C034):** "altın bir vazo" (Louvre "vase monumental", materyal yok); "kırmızı pelerinli atlı" (renk doğrulanmadı; figür "serait Bagophanès" C015); "solda kadınlar ve çocuklar" (Louvre yalnız "femme de dos au premier plan à gauche"); buhurdan tekil (Louvre çoğul tripod C016); Le Brun "baş ressam/Akademi yöneticisi" + "Poussin+Barok" üslup + halıların "Avrupa'ya yayıldı" (bu partide kaynak çekilmedi, C034); hotspot koordinatları (görsel incelenmedi).
8. **Kapsam boşluğu (zenginleştirme):** data ders metni Louvre'un öne çıkardığı Sémiramis heykelini (asa+nar, "unité de l'État", C014) ve Bernini'nin 1665'te Gobelins'te görmesini (C010) hiç anmıyor; Salon 1673 (C018), Audran gravürü 1676 (C020), 29 çizim (C019), Paulet restorasyonu 1963 (C021) da yok. Bu ders A seviyeli bu malzemeyi ekler.
9. **Brief D/E → bu dosya eşlemesi:** D1→C035, D2→C036, D3→C032, D4→C037; E7→C033/C038, E8→C040, E9→C039, E10→C041; C030/C031 frwiki atıfsız yorum (C). E1 (vers) C004'te, E2 (salon güncelliği) C008'de, E3 (serait) C015'te, E4 (probablement) C014'te, E5 (sans doute) C030'da, E6 (hedge'ler) C031/C032'de, E11 (güncellik) S4/S5'te, E12 (kategori tek yıl) önemsiz — AYNEN korundu.
10. **Ders durumu:** DURUM.md/MUFREDAT.md Q27097122 "Araştırılmadı"; bu dosya boşluğu doldurur. Durum güncellemesi ana oturumun işidir (bu agent yazmaz).