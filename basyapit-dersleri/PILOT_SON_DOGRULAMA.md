# PİLOT SON DOĞRULAMA — Vermeer Q167605

**Tarih:** 13 Kasım 2026 (gece, düzeltme turu sonrası) · **Kapsam:** `basyapit-dersleri/` pilot dosyaları + doğrulama altyapısı
**Durum:** Pilot **"İnsan incelemesi bekliyor"** olarak korundu. Kalan 106 esere geçilmedi. Uygulama kodu / `data/` değiştirilmedi; commit/push/deployment yok.

Bu rapor, kullanıcının 6 maddelik son doğrulama talimatını karşılar. ** Genel ilke:** otomatik kontroller yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez.

---

## Madde 1 — Etiketsiz olgusal cümle negatif testi

`dogrula.py`'ye **heuristic** bir etiketsiz olgu tespitçisi eklendi (`etiketsiz_olgu_tespit`). `[C999]` gibi *yanlış etiket* kontrolünden **ayrıdır**: bu tespitçi, sayı/tarih/ölçüm sinyali taşıyan ama **hiç `[C###]` etiketi olmayan** cümle adaylarını bulur.

- **Sinyal:** 4 haneli yıl (1000–2099), ölçüm (cm/mm/florin/guilders/piksel/px), `N × N` boyut.
- **Eleme:** başlık, tablo (`|`), liste, soru (`?`), talimat/emir kipleri, yorum/felsefe/meta kaynak notları, kısaltma korumalı cümle bölücü (`no.`, `c.`, `J.` noktalarında bölünmez).
- **Çıktı:** UYARI (hata değil) — çünkü heuristic.

**Negatif testler (`--test`):**
| Test | Beklenen | Sonuç |
|---|---|---|
| `etiketsiz_olgu_yakalanir` — "Vermeer 1632 yılında Delft'te doğdu." | flag=True | GEÇTİ |
| `etiketli_olgu_temiz` — aynı cümle `[C002]` | flag=False | GEÇTİ |
| `yorum_temiz` — "…büyülü hissettirir." | flag=False | GEÇTİ |
| `soru_temiz` — "Işık hangi yönden geliyor?" | flag=False | GEÇTİ |
| `talimat_temiz` — "Resme bir dakika bakın…" | flag=False | GEÇTİ |
| `sayisiz_olgu_kacar_SEMANTIK_SINIR` — "Hollanda… en zengin toplumuydu." | flag=False (kaçar) | GEÇTİ |

**Gerçek pilot taraması:** tespitçi ilk çalıştırmada 2 gerçek eksik buldu → düzeltildi: (a) Orta §3 "617 florin borcu vardı…" cümlesine `[C022]` eklendi; (b) İleri §6 Europeana cümlesine `[C026]` eklendi. Sonrasında gerçek pilot **0 aday**.

**SEMANTİK SINIR (açık beyan):** Tespitçi yalnızca **sayı/tarih/ölçüm içeren** olgusal cümleleri yakalar. Sayı içermeyen olgusal prose (ör. "Hollanda Avrupa'nın en zengin toplumuydu") **kaçabilir**; yorum/talimat cümlelerinde **yanlış pozitif** verebilir. `sayisiz_olgu_kacar` testi bu sınırı bilerek belgeler. Bu bir **tuzak/uyarı** mekanizmasıdır; eksiksiz olgusal cümle denetimi **insan editör** gerektirir.

## Madde 2 — Standart jsonschema Draft 2020-12 doğrulaması

Mini yorumlayıcıya **ek olarak** standart `jsonschema` kütüphanesiyle Draft 2020-12 doğrulaması eklendi.

- **Kurulum (izole, üretim bağımlılıklarına dokunulmadı):** `python3 -m venv .qwen/tmp/venv-dogrula && .qwen/tmp/venv-dogrula/bin/python -m pip install jsonschema` → **jsonschema 4.25.1**. Uygulamanın `package.json`'ı ve üretim bağımlılıkları **değişmedi**.
- **Çalıştırma:** `.qwen/tmp/venv-dogrula/bin/python basyapit-dersleri/dogrula.py` (jsonschema otomatik etkinleşir). Sistem python'unda jsonschema yoksa mini yorumlayıcı tek başına çalışır.
- **Sonuç:** `Draft202012Validator.check_schema` her iki şemayı da geçerli buldu; `DERS.json` ve `SORULAR.json` **0 hata**. `format` Draft 2020-12 varsayılanı gereği annotation-only (uri biçimi mini katmanda ayrıca kontrol edilir).
- `dogrula.py` başlangıçta katmanın aktif olup olmadığını yazdırır.

## Madde 3 — Pilot dosyalarının yeniden çapraz doğrulaması

`DERS.json`, `SORULAR.json`, üç ders metni ve `KANIT_DOSYASI.md` yeniden çapraz doğrulandı (mini + jsonschema + çapraz tutarlılık):
- **76 iddia** (A=33, B=29, C=6, D=3, E=5), **24 kaynak** (K1–K24).
- Tüm `[C###]` etiketleri DERS.json iddiaları ve KANIT tanımlarıyla eşleşiyor; tüm `kaynak_id`/`kanit` geçerli; mükerrer kimlik yok.
- Kelime: Başlangıç 411 / Orta 1584 / İleri 2996 (3/10/20 dk hedeflerinde).
- **SONUÇ: 0 hata, 0 uyarı.**

## Madde 4 — E seviyeli beş iddia denetimi

| İddia | kullanim | Kesin cevaplı quizde? | Ders geçişi | Hepsi belirsiz işaretli? |
|---|---|---|---|---|
| C068 (melken argosu) | belirsiz | Hayır | 2 | Evet |
| C069 (Van Ruijven "ölümünde 21") | belirsiz | Hayır | 1 | Evet |
| C071 (View of Delft 200 fl) | belirsiz | Hayır | 0 (yalnız CS06 çeldirici, "doğrulanmadı" notlu) | Evet |
| C072 (Met 2009 ayrıntıları) | belirsiz | Hayır | 1 | Evet |
| C073 (eski "dikiş sepeti" adı) | belirsiz | Hayır | 2 | Evet |

**SONUÇ: TEMİZ.** Beş E iddianın hiçbiri kesin olgu olarak anlatılmıyor (hepsi belirsizlik işaretli cümlede) ve hiçbir CS/DY/GZ/TK'nın `kanit` dizisinde değil. `dogrula.py` bunu zaten **hata** olarak reddeder (negatif testler `cs_C_kanit`, `dy_D_kanit`, `tk_E_kanit`, `gz_C_kanit`).

## Madde 5 — A/B kaynak-destek matrisi (semantik)

Her A/B iddiası için **kaynağın ilgili bilgiyi gerçekten destekleyip desteklemediği** değerlendirildi (yalnızca kaynak ID'si varlığı değil). **Bu değerlendirme otomatik değildir** — yazarın ham kaynak incelemesine dayanan semantik yargısıdır; otomatik kontroller bunu güvenilir biçimde **çözemez**. Tam matris CSV olarak da verildi: `AB-kaynak-destek-matrisi.csv` (UTF-8 BOM, noktalı virgül).

**Özet:** 62 A/B iddia → **56 "Evet", 6 "Kısmen"** (C012, C017, C022, C033, C034, C036). "Kısmen" olanlar ya tek kaynak/çelişkili (C017, C022) ya da görsel teyidi kısmi (C033, C034, C036) ya da WD-ikincil (C012); derslerde uygun belirsizlikle sunuluyor.

| İddia | Sev | Kaynak | İfade (özet) | Destek | Değerlendirme notu | Güven |
|---|---|---|---|---|---|---|
| C001 | A | K1, K2 | Güncel başlık Het melkmeisje / The Milkmaid; eski başlıklar De keukenm | Evet | K2 identified_by ham: başlıklar birebir | yüksek |
| C002 | A | K1, K2, K5, K9 | Sanatçı Johannes Vermeer (1632–1675) | Evet | K2/K1/K5 ham: Vermeer 1632–1675 | yüksek |
| C003 | A | K1, K2, K5 | Rijksmuseum güncel tarihi c. 1660; WD precision 9 + circa | Evet | K1/K2/K5 ham: c.1660, precision9, circa | yüksek |
| C005 | A | K1, K2, K5 | Tuval üzerine yağlıboya | Evet | K1/K2/K5 ham: oil on canvas | yüksek |
| C006 | A | K1, K2, K5 | 45,5 × 41 cm | Evet | K1/K2/K5 ham: 45.5×41 | yüksek |
| C007 | A | K1, K2, K5 | Rijksmuseum, SK-A-2344 | Evet | K1/K2/K5 ham: SK-A-2344 | yüksek |
| C008 | A | K1, K2, K5 | 1908 satın alma; Vereniging Rembrandt; Six mirasçıları; 550.000 fl + 3 | Evet | K1 provenance ham + K24: 550.000/38/1908/VR | yüksek |
| C009 | A | K1, K2 | Onur Galerisi (Eregalerij), HG-2.30.3 | Evet | K1/K2 ham: Gallery of Honour, HG-2.30.3 | yüksek |
| C010 | B | K1, K7 | Eser imzasız | Evet | K7 "No signature" ham + K1 imza alanı yok | yüksek |
| C011 | A | K1, K5 | Tür resmi; hizmetçi/süt/ekmek/stoofje konuları | Evet | K1 subjects + K5 P136 | yüksek |
| C012 | B | K5, K7 | Yapım yeri Delft | Kısmen | K5 P1071 Delft (WD ikincil); müze yazmıyor; ders "kabul edilir" | orta |
| C013 | A | K1, K2 | Görüntü PD; veri CC0 | Evet | K1/K2 ham: PD mark, CC0 | yüksek |
| C014 | A | K1, K7 | Erken provenance zinciri müze kaydında ? ile kuşkulu | Evet | K1 provenance ham: "?" zinciri | yüksek |
| C015 | A | K1, K5 | Dissius satışı 16 Mayıs 1696, no.2, 175 fl, Rooleeuw | Evet | K1 provenance ham: 1696 no.2 175 Rooleeuw | yüksek |
| C016 | B | K7, K6 | 1696 satışında en yüksek ikinci Vermeer fiyatı (175 fl); birinci View | Evet | K7 ham + K6: sıralama (fiyat C071'de ayrıldı) | yüksek |
| C017 | B | K7, K24 | 1908 alımı kamuoyu/parlamento tartışması (VR genel kampanyayı doğrular | Kısmen | Genel kampanya K24 ham; Morgan/Bredius/de Stuers/Troelstra yalnız K7 | orta |
| C018 | B | K7, K1, K5, K9 | Van Ruijven Vermeer'in zengin Delftli hamisi; ölüm 1674 (Rijks) / 1678 | Evet | K7 ham "rich Delft patron"; ölüm 1674/1678 çelişkili; 21→C069 | orta-yüksek |
| C019 | B | K6, K7 | Reynolds övgüsü (1781 bağlamı) | Evet | K7 ham: Reynolds 1781 Burke (EV tek kaynak) | orta-yüksek |
| C020 | A | K3 | Külliyat yaklaşık 35 resim | Evet | K3 ham: about 35 paintings | yüksek |
| C021 | B | K7 | Aziz Luka Loncası; giriş ücreti sıkıntısı | Evet | K7 ham + K22 ham: lonca giriş ücreti | yüksek |
| C022 | B | K7, K22 | Van Buyten'e 617 fl borç (tutar yalnız EV); ölüm sonrası iki resim: EV | Kısmen | 617 yalnız K7; teminat(K7)/satış(K22) çelişkisi açık sunuluyor | orta |
| C023 | B | K7, K16 | Hollanda tür resmi on yıllar önce gelişti; mutfak/pazar/hizmetçi sahne | Evet | K7 ham (tür gelişimi) + K16 (Eroticism) | orta-yüksek |
| C024 | B | K7 | Vermeer'in tek emekçi figürlü eseri; temaya dönmedi | Evet | K7 ham birebir (EV tek kaynak) | orta-yüksek |
| C025 | A | K3 | 2023 Vermeer sergisi 10 Şubat–4 Haziran; en az 27/35; Frick üç eser | Evet | K3 ham: 10 Şubat–4 Haziran, ≥27/35, Frick | yüksek |
| C026 | B | K1, K6 | 2009 Met "Vermeer's Masterpiece: The Milkmaid" sergisi varlığı (Rijksm | Evet | K1 bibliyografya (NYT+Met ilanı); ayrıntı C072'de | orta-yüksek |
| C027 | A | K1, K4 | Hizmetçi süt döker; tek hareket süt akıntısı; tam dikkat | Evet | K1 curatorial ham + K4 görsel | yüksek |
| C028 | A | K1, K4 | Figür parlak odada heykel gibi; anıtsal dinginlik | Evet | K1 "statue" ham + K4 | yüksek |
| C029 | B | K7 | Anıtsal etki + kompozisyon öğeleri (çerçeve, sepet, pirinç kap) gözün | Evet | K7 ham: monumental + compositional dynamics | orta-yüksek |
| C030 | A | K4, K7 | Işık soldaki pencereden; başlık/korse/önlük/etek/kolluklar | Evet | K4 görsel (iki oturum) + K7 kolluk | yüksek |
| C031 | A | K1, K7 | Işık nesne yüzeylerinde "yüzlerce renkli nokta" (Rijksmuseum); pointil | Evet | K1 "hundreds of colourful dots" + K7 "spherical dabs" | yüksek |
| C032 | A | K1, K4 | Masada ekmek sepeti, somun/kırık parçalar, benekli stoneware, toprak k | Evet | K4 + K1 Hollandaca + K7 kapak | yüksek |
| C033 | B | K4, K6, K7 | Duvarda lekeler, çivi ve delikler (kaynak betimi + kısmi görsel) | Kısmen | K7 ham (çivi+gölge) + K6 Cant; görsel kısmi | orta |
| C034 | B | K4, K6, K7 | Delft çinileri; birinde yaylı Cupid (kaynak betimi) | Kısmen | K7 ham (Cupid cocked bow) + K6; görselde Cupid ayırt edilemedi | orta |
| C035 | A | K1, K4 | Delikli kapaklı, köz parıltılı stoofje | Evet | K4 + K1 stoofje | yüksek |
| C036 | B | K6, K7 | Çatlak pencere camı (kaynak betimi; görsel teyit yok) | Kısmen | K6 Cant + K7 ham (broken pane); görsel yakın teyit yok | orta |
| C037 | A | K1, K4 | Duvarda hasır sepet + pirinç kap; yansıma/emme farkı | Evet | K4 + K1 rieten mand/koperen pot | yüksek |
| C038 | B | K7 | Masa sekizgen katlanır masanın yarısı | Evet | K7 ham: gateleg octagonal (EV tek) | orta-yüksek |
| C039 | A | K4 | Craquelure görünür | Evet | K4 ekmek-sepet kırpmasında craquelure | orta-yüksek |
| C040 | B | K7 | Bezelyi keten; orijinal germe kenarları; 14×14,5 iplik/cm² | Evet | K7 ham: thread count (EV tek, hakemli değil) | orta |
| C041 | B | K7 | 1950 wax-reçine relining; önce paste lining | Evet | K7 ham: 1950 relining (EV tek) | orta |
| C042 | B | K7 | Ast: tebeşir + kurşun beyazı + umbra | Evet | K7 ham: ground (EV tek) | orta |
| C043 | B | K6, K7 | Doğal ultramarin (lapis); çağdaşlarda azurit; saydam glazür | Evet | K7 ham: ultramarin/azurit; hami hipotezi açık | orta |
| C044 | B | K7 | Korsede kurşun-kalay sarısı | Evet | K7 ham: lead-tin yellow (EV tek) | orta |
| C045 | B | K6, K7 | Duvar: kurşun beyazı+umbra+kömür siyahı; etek: vermilyon+siyah+madder | Evet | K7 ham: duvar/etek paleti (EV tek) | orta |
| C046 | B | K6, K7 | Kaçış noktası iğne deliği; Liedtke iğne-ip yöntemi | Evet | K7 ham (pinhole) + K6 (Liedtke ip) | orta |
| C047 | A | K3, K14 | 2022: Rijksmuseum + Mauritshuis + Antwerpen Üniversitesi (NL bülteni); | Evet | K3/K14 ham: MA-XRF/RIS/Mauritshuis/Antwerpen | yüksek |
| C048 | A | K3 | Hızlı açık/koyu alt boyama; yavaş-titiz miti revize | Evet | K3 ham: siyah alt boyama, revizyon | yüksek |
| C049 | A | K3, K14 | Baş arkasında siyah eskiz sürahi rafı (kannenbord / jug holder), geliş | Evet | K3/K14 ham: jug holder/kannenbord/Oortman | yüksek |
| C050 | A | K3 | Vuurmand (söğüt ateş sepeti); envanterde kayıtlı; üzeri stoofje+çini+z | Evet | K3/K14/K7 ham: vuurmand, envanter, üzeri boyama | yüksek |
| C052 | B | K3, K7 | Çiniler ve stoofje sonradan eklendi | Evet | K7 ham (afterthoughts) + K3 | orta-yüksek |
| C056 | A | K16 | Lucas van Leyden, The Milkmaid (1510) gravürü, Rijksmuseum; sütçü figü | Evet | K16 ham: Lucas 1510, Eroticism | yüksek |
| C059 | B | K2, K6, K7 | Figür milkmaid değil kitchen maid (keukenmeid) | Evet | K7 ham + K2 eski başlık | orta-yüksek |
| C061 | A | K8, K15 | Jan Steen, The Feast of St Nicholas: SK-A-385, 1665–1668, yağlıboya tu | Evet | K8/K15 ham: SK-A-385, 1665-68, 82×70.5, şarkı | yüksek |
| C062 | A | K3 | Vermeer, Woman Holding a Balance: NGA Washington (kurum düzeyi, 2022 b | Evet | K3 ham: NGA Washington (kurum) | yüksek |
| C063 | A | K3, K23 | Vermeer, Girl with a Pearl Earring: Mauritshuis, Lahey (kurum). | Evet | K3/K23 ham: Mauritshuis (kurum) | yüksek |
| C064 | A | K1 | 18. yy Amsterdam satış zinciri fiyatları: 1701 no.7 320 fl; 1719 no.20 | Evet | K1 provenance ham: 6 satış birebir | yüksek |
| C065 | B | K7, K6 | Cupid çinisi ve stoofje üzerinde tek kesin anlam yok; Liedtke/Wheelock | Evet | K7 ham: üç görüş farkı | orta-yüksek |
| C066 | B | K7 | Stoofje, Roemer Visscher Sinnepoppen (1614) emblemesinde Mignon des Da | Evet | K7 ham: Sinnepoppen Mignon des Dames; DBNL birincil kontrol yok | orta |
| C067 | B | K7 | 1648 barışı sonrası Hollanda ekonomisi zirveye ulaştı; Vermeer 1650'le | Evet | K7 ham: ekonomi zirve + tür geçişi | orta-yüksek |
| C070 | B | K7 | 1696 Dissius satışında 21 Vermeer satıldı (EV ham). | Evet | K7 ham: 1696 satışında 21 Vermeer | orta-yüksek |
| C075 | A | (doğrudan) | Uygulamanın yerel görsel kopyası 356×400 px JPEG; Rijksmuseum 1200px t | Evet | Doğrudan dosya incelemesi: 356×400 | yüksek |
| C076 | A | K23 | Girl with a Pearl Earring portre değil tronie (hayalî figür); Mauritsh | Evet | K23 ham: tronie/670/1665/44.5×39/IVMeer | yüksek |

## Madde 6 — Şema ↔ dogrula ↔ içerik uyum testleri

`--test` paketine uyum testleri eklendi:
| Test | Amaç | Sonuç |
|---|---|---|
| `sema_gercek_icerik_uyumu` | Gerçek DERS.json + SORULAR.json, DERS_SEMASI.json'a karşı mini + jsonschema ile doğrulanır | GEÇTİ (temiz) |
| `sema_negatif_seviye` | Geçersiz seviye "X" → enum reddi | GEÇTİ |
| `sema_negatif_kullanim` | Geçersiz kullanim "gecersiz" → enum reddi (belirsiz dahil enum) | GEÇTİ |
| `sema_negatif_durum` | Geçersiz durum "Bilinmiyor" → enum reddi | GEÇTİ |

Bu testler `DERS_SEMASI.json` enum'ları ile `dogrula.py`'nin beklediği değerlerin ve gerçek içeriğin **birbirleriyle uyumlu** olduğunu gösterir.

## Test özeti

`python3 basyapit-dersleri/dogrula.py --test` → **20/20 GEÇTİ** (jsonschema AKTİF):
- 10 yapısal negatif test (pozitif kontrol, kayıp kaynak, eksik kanıt etiketi/tanımı, mükerrer iddia/kaynak, C/D/E'ye dayalı CS/DY/TK/GZ reddi).
- 6 etiketsiz olgu tespitçi testi (5 davranış + 1 semantik sınır belgesi).
- 4 şema uyum testi (gerçek içerik + 3 enum reddi).

Gerçek pilot: `dogrula.py` → **0 hata, 0 uyarı** (hem sistem python mini hem venv mini+jsonschema).

## Kalan sınırlar (dürüstlük beyanı)

- **Otomatik ≠ semantik:** Yapısal testler olgusal doğruluğu garanti etmez. A/B destek matrisi (Madde 5) semantik yargıdır; insan/haricî model denetimi gerekir.
- **Etiketsiz olgu tespitçisi heuristic:** sayı içermeyen olgusal prose kaçabilir; yanlış pozitif olabilir.
- **Erişilemeyen birincil kaynaklar:** Met (429/Incapsula), NGA (80 MB) — C071/C072 E/belirsiz.
- **Tek kaynak/çelişkili:** C017 isimler (EV), C022 (617 EV; teminat/satış çelişkisi), teknik rapor C040–C046 (EV, hakemli değil).
- **Görsel kısmi:** C033/C034/C036 yakın kırpmayla doğrulanamadı.
- **Üçüncü taraf denetimi:** bu tur aynı asistan tarafından yapıldı; haricî insan/model denetimi hâlâ gerekli.

## Sonuç

6 maddenin tamamı karşılandı; altyapı güçlendirildi (jsonschema + etiketsiz olgu tespitçisi + 20 test), pilot yeniden çapraz doğrulandı (0 hata), E iddialar temiz, A/B destek matrisi çıkarıldı. Pilot **"İnsan incelemesi bekliyor"** durumunda; kalan 106 esere geçilmedi. Onay bekleniyor.