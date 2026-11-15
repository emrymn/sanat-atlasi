# ÜRETİM NOTU — MİTOLOJİ (pilot batch: mit-a · MIT-001 … MIT-003)

**Üreten ajan:** `ansiklopedi-madde-yazim (mit-a)` — bu not **bağımsız denetim değildir**.
**Tarih:** 2026-11-15 · **Kategori dizini:** `resim-ansiklopedisi/mitoloji/`
**Kapsam:** MIT-001 (`medusa`), MIT-002 (`prometheus`), MIT-003 (`osiris`) — 3 madde + 3 kanıt dosyası
**Yayın durumu (üçü de):** `BAGIMSIZ_DENETIM_BEKLIYOR` · **son_guncelleme:** 2026-11-15

> Bu ajan yeni araştırma YAPMADI (web erişimi yok); tüm içerik `mit-a` brief'lerinden
> (`.qwen/tmp/ansiklopedi-pilot/mit-a/MIT-00{1,2,3}-brief.md`) üretildi. Brief'te kanıtı olmayan
> hiçbir bilgi, tarih, envanter numarası, transliterasyon, DOI veya alıntı eklenmedi.
> Claim üst sınırı (6–10) nedeniyle brief'lerdeki aday iddiaların bir bölümü maddeye taşınamadı;
> bunlar aşağıda madde madde listelendi ve ilgili `uretim_notu` / `akademik_tartismalar` /
> resim örneği `baglam`-`versiyon_notu` alanlarında kaynak atfıyla izlendi.
> **MIT-004 (`krishna`) ve MIT-005 (`amaterasu`) başka bir ajanda (mit-b) olduğu için bu not
> yalnız MIT-001..003 bölümlerini içerir; o maddelerin bölümü EK dosyasında yer alacaktır.**

---

## 0) Doğrulama sonucu

```
.qwen/tmp/venv-dogrula/bin/python resim-ansiklopedisi/dogrula.py --dosya \
  resim-ansiklopedisi/mitoloji/MIT-001-medusa.json \
  resim-ansiklopedisi/mitoloji/MIT-002-prometheus.json \
  resim-ansiklopedisi/mitoloji/MIT-003-osiris.json

→ 16 madde tarandı · 0 HATA · 15 UYARI   (yalnız bu 3 maddeye ilişkin olanlar)
```

`dogrula.py --test`: **23/23 geçti** (testler değiştirilmedi).
`DURUM.md`, `GENEL_RAPOR.md`, `kaynaklar/KAYNAK_KUTUGU.json`, `denetim/`, `data/`, diğer kategori
dizinleri ve uygulama koduna DOKUNULMADI; commit/push yapılmadı.
Not: eşzamanlı üretim nedeniyle betiğin taradığı toplam madde sayısı (16) bu ajanın kapsamından büyüktür;
`--dosya` filtresi yalnız bu 3 maddeye ait hata/uyarıları raporlar.

### 15 uyarının dökümü (hepsi bilinçli, hata değil)

**(a) "YORUM/HIPOTEZ türü iddia DOGRULANDI" — 4 uyarı.**
Brief'ler bu iddialar için DOGRULANDI önerdi; statü ajan tarafından YÜKSELTİLMEDİ (Kural 9).
Bu iddialarda DOGRULANDI'nın anlamı, **yorumun/hipotezin sahibine aidiyetinin okunan kaynaktan
doğrulanmasıdır**; yorumun içeriğinin genel kabul olduğu değildir. Hepsi metinde sahiplendirme
kalıbıyla ("…'ya göre / … savunur / küratör yorumuna göre") verildi ve karşıt görüşler yanına kondu.

| Madde | Uyarı alan iddialar | Sahiplendirme / denge |
|---|---|---|
| MIT-001 | C006 (YORUM — apotropaik okuma) | Met denemesi "en yaygın yorum" ihtiyatıyla + Lopez 2025; karşıt vurgu (Faraone, kapı/eşik muskaları) `akademik_tartismalar` 6'da |
| MIT-002 | C009 (HIPOTEZ — stilometri + Euphorion hipotezi) | Karşıt bulgu (Mtvarelidze 2014: sözcük dağarcığı Aiskhylos'a en yakın) C010'da ve metinde birlikte verildi |
| MIT-003 | C003 (YORUM — BM küratörünün yeşil/siyah renk yorumu) | Karşıt akademik görüş C005 (Kucharek: Osiris bitki örtüsü tanrısı DEĞİLDİ) zorunlu dengeleyici olarak metne işlendi |
| MIT-003 | C005 (YORUM — Kucharek'in eleştirisi) | Bu da bir görüştür; BM küratör yorumu (C003) ve OIMP 39 renk açıklaması (`akademik_tartismalar` 2) yanında verildi |

**(b) "Hiçbir iddia bu kaynağı kullanmıyor" — 11 uyarı.**
Üçü `dogrula.py` sıralama artefaktıdır: kaynak **yalnız doğrulanmış resim örneklerinde** kullanıldığında
da uyarı üretilir (örnek kaynakları `kullanilan_kaynak` kümesine uyarı basıldıktan sonra ekleniyor).
Diğerleri bilinçli negatif bulgu, kısmen okunan veya erişilemeyen bibliyografik kayıttır.

| Kaynak | Neden | Nitelik |
|---|---|---|
| MIT-001-K10 (Uffizi video, "Caravaggio, Medusa, 1595") | Caravaggio örneğinin tarih kaynağı; tarih ihtilafı `versiyon_notu` + `akademik_tartismalar` 2'de | artefakt |
| MIT-001-K13 (Met API, Boscotrecase) | 4. resim örneğinin kaynağı; brief C015 aday iddiası claim üst sınırına takıldı | artefakt |
| MIT-001-K15 (Archaeopress **örnek** PDF, Faraone ch. 1) | ERISILDI_KISMEN — gorgoneion bölüm metni yok; OAPEN tam metin HTTP 403 → C007/C008 DOGRULANDI alamaz, taşınamadı | bilinçli |
| MIT-001-K17 (ICCD/SIGECweb scheda 16218731) | **ERISILEMEDI** (bağlantı zaman aşımı) — künye + "metnine erişilmedi"; hiçbir iddiaya dayanak yapılmadı | bilinçli |
| MIT-002-K02 / K03 (Hesiodos *Theogony* 545–584 / 585–616 kartları) | Brief C004 (Pandora / "güzel kötülük") için açıldı; claim üst sınırına takıldı → içerik `akademik_tartismalar` 5'te | bilinçli |
| MIT-002-K13 (Alte Pinakothek, Münih panosu) | 3. resim örneğinin kaynağı; brief C014/C016 taşınamadı, müzenin "ilk anlatımsal betim / Boccaccio" değerlendirmesi örneğin `baglam` alanında korundu | artefakt |
| MIT-003-K04 (Met API, Nauny 30.3.31) | 3. resim örneğinin kaynağı; brief C011 claim üst sınırına takıldı | artefakt |
| MIT-003-K05 (Met API, Imhotep 35.9.20a–w) | Kayıt açıldı ama **kayıtta Osiris betimi doğrulanmıyor** → örnek listesine ALINMADI | bilinçli negatif bulgu |
| MIT-003-K10 (Stadler 2023, Oxford Handbook bölümü) | Yalnız **kayıt sayfası** okundu; PDF Anubis bot koruması → ERISILDI_KISMEN; ona dayanan **hiçbir iddia kurulmadı** | bilinçli |
| MIT-003-K11 (Griffith Institute) | Ana sayfa açıldı, Osiris'e özgü açık içerik bulunamadı → ERISILDI_KISMEN | bilinçli negatif bulgu |

---

## 1) Madde bazında özet

### MIT-001 · `medusa` · `yunan-roma-mitolojisi`
- **Dosya:** `mitoloji/MIT-001-medusa.json` + `kanit-kayitlari/MIT-001.json`
- **10 iddia:** DOGRULANDI 9 · **CELISKILI 1 (C010)** · KISMEN 0 · DOGRULANAMADI 0 · HATALI 0
- **Tür dağılımı:** GELENEKSEL_ANLATI 4 (C001, C003, C004, C016) · OLGU 2 (C009, C013) · TARIH 2 (C010, C011) · TEKNIK_TANIM 1 (C005) · YORUM 1 (C006)
- **Kaynaklar:** 17 (K01–K02 Hesiodos EN/GR Perseus · K03–K04 Ovidius EN/LAT Perseus · K05 Met Heilbrunn [Wayback 2024-12-21] · K06–K10 Uffizi · K11 Google Arts & Culture [YARDIMCI] · K12 KHM Wien · K13 Met API · K14 Lopez 2025 AJMS · K15 Archaeopress örnek PDF [ERISILDI_KISMEN] · K16 Theoi.com [YARDIMCI] · K17 ICCD/SIGECweb [**ERISILEMEDI** + künye + "metnine erişilmedi"])
- **Resim örneği:** 4 (Caravaggio rotella, Uffizi inv. 1890 n. 1351 · Rubens, KHM GG 3834 · Marseus van Schrieck panosu, Uffizi · Roma freski *Perseus and Andromeda*, Met 20.192.16). **Caravaggio'nun özel koleksiyondaki ilk versiyonu ("Medusa Murtola") teyitsiz → listelenmedi.**
- **Uygulanan dikkat noktaları:**
  - Hesiodos ↔ Ovidius versiyonları **kaynak adıyla ayrı** verildi, birleştirilmedi [C001] [C003] [C004]; Ovidius'un kendi `dicitur` ihtiyatı korundu.
  - **Caravaggio tarihi:** Uffizi video "1595" ↔ GAC "1595–1598" → madde tarihi **"y. 1595–1598"**; **armağan tarihi:** Uffizi Bacchus sayfası "1608 (Cosimo II düğünü)" ↔ GAC "1598" → **C010 CELISKILI**, metinde kesinleştirilmedi.
  - **"Leonardo'ya atfedilen Medusa":** atıf tarihçesi (18. yy'dan itibaren Leonardo → bugün Marseus van Schrieck; Shelley 1819'un geleneksel atfı izlemesi) üç Uffizi kaynağıyla verildi [C011]; müze içi ressam-kimliği farkı (K08 "16. yy anonim Felemenk" ↔ K07/K09 "17. yy Marseus") `celisen_kaynaklar` + `akademik_tartismalar` 4'te. **Vasari'nin kayıp kalkan anlatısı birincil metinden açılmadığı için kullanılmadı**; Marseus panosu ile Vasari'nin kaybının AYRI nesneler olduğu not edildi.
  - **Cellini'nin Perseus'u** bağımsız bronz heykel → kapsam dışı, yalnız yöntem notunda "örnek olarak anılmadı" biçiminde belirtildi (ek kaynak açılmadığı için içerik verilmedi).
  - Anlam otomatik atfedilmedi: gorgoneion = koruyucu imge okuması **YORUM** olarak, "en yaygın yorum" ihtiyatı ve sahibiyle yazıldı; "kötü göze karşı kötü göz" türü ek anlamlar kaynaklandırılmadan eklenmedi.
  - Brief'in C005 ifadesindeki **"Selinunte C Tapınağı alınlıkları, antefiksler"** ayrıntısı, kaydedilen pasajda geçmediği için madde metnine alınmadı (Kural 12).
  - Lopez makalesinin PDF'indeki **yer tutucu DOI** ("10.30958/ajms.X-Y-Z") kullanılmadı.
- **Taşınmayan aday iddialar (6):** C002 (Hesiodos: baş kesilince Chrysaor + Pegasus), C007 (Gela pişmiş toprak diski + "Herakles burada yaşıyor" yazıtı), C008 (İlyada: Agamemnon kalkanı 11.35–36 / Athena aigis'i 5.738–42), C012 (Uffizi silahhanesi, 1631 Caravaggio kaydı, "Pers zırhı" mankeni — tek kaynak K11, brief KISMEN diyordu), C014 (Rubens'in Stoacı/allegorik dönemsel okuması — YORUM), C015 (Met Boscotrecase freski kaydı). C007/C008 → `akademik_tartismalar` 6–7; C014 → örnek 2 `baglam` + `akademik_tartismalar` 8; C015 → örnek 4 (K13).
- **Belirsizlik koruması:** "geleneksel olarak … atfedilmiş", "olasılıkla" yerine kaynağın kendi ihtiyatı, "y. 1595–1598", "1617/18", "atfedilir (attributed to)", "tartışmalıdır".

### MIT-002 · `prometheus` · `yunan-roma-mitolojisi`
- **Dosya:** `mitoloji/MIT-002-prometheus.json` + `kanit-kayitlari/MIT-002.json`
- **10 iddia:** DOGRULANDI 9 · **CELISKILI 1 (C013)** · KISMEN 0 · DOGRULANAMADI 0 · HATALI 0
- **Tür dağılımı:** GELENEKSEL_ANLATI 5 (C001, C003, C005, C006, C008) · OLGU 3 (C011, C013, C015) · HIPOTEZ 1 (C009) · TARIH 1 (C010)
- **Kaynaklar:** 14 (K01–K03 Hesiodos *Theogony* kartları · K04 *Works and Days* 42–59 · K05–K06 [Aiskhylos] *Prometheus Bound* EN/GR · K07 Apollodoros 2.5.11 · K08 BMCR 2021.04.10 · K09 Mtvarelidze, *Phasis* 17 (2014) · K10–K11 Philadelphia Museum of Art · K12 Joconde · K13 Alte Pinakothek · K14 Prado [**Wayback 2026-04-23**])
- **Resim örneği:** 3 (Rubens+Snyders *Prometheus Bound*, PMA W1950-3-1 · Piero di Cosimo, Strasbourg MBA 354 · Piero di Cosimo, Münih inv. 8973). **Titian *Tityus* (Prado P000427) örnek listesine ALINMADI** — Prometheus betimi değil, yalnız esin kaynağı/sık karıştırılan eser olarak `versiyon_notu` + `akademik_tartismalar` 3'te.
- **Uygulanan dikkat noktaları:**
  - ***Prometheus Bound* yazarlığı:** her anılışta "**Aiskhylos'a atfedilir / atfı tartışmalı**" formu korundu; iki yönlü bulgu birlikte yazıldı: (a) Manousakis 2020 stilometrisi → Aiskhylos yazarlığı "çok yüksek olasılıkla değil", y. MÖ 440–430 tarihleme önerisi "ikna edici ama kesin değil"; West'in Euphorion hipotezi (C009, HIPOTEZ); (b) Mtvarelidze 2014'ün kendi dijital karşılaştırması PV sözcük dağarcığını Aiskhylos külliyatına **en yakın** bulur + sorun Westphal 1856'dan West 1990'a uzanır ve **"hâlâ çözülmemiştir"** (C010).
  - **Prado kavram tuzağı:** "Prado'daki Titian Prometheus'u" ifadesi **hiç kullanılmadı**; Prado kaydıyla eserin *Tityus* (P000427, Room 027, "Las Furias") olduğu ve Mary of Hungary için yapılan özgünün geç tekrarı olduğu yazıldı [C013].
  - **Tarih ihtilafı:** PMA küratöryel metni Titian'ı **"1548–49"**, Prado **"ca. 1565"** verir → **C013 CELISKILI**, iki kaynak adıyla verildi, kesinleştirilmedi. Titian'ın özgün "Furies" dizisinin Prometheus'u içerip içermediği **doğrulanamadığı için iddia kurulmadı**.
  - **Versiyon birleştirme yasağı:** Hesiodos (bağ+kartal+ciğer, Herakles kurtarışı; *WD* ateş + rezene sapı), *PV* (İskit kayalığı, adamant bağlar, sanatlar listesi), Apollodoros (Kafkas, Echidna–Typhon kartalı, zeytin bağı, Cheiron ikamesi) ayrı paragraflarda; "Kafkas kayası" şablonunun kaynakların birleştirilmesiyle oluşan bir genelleme olduğu açıkça belirtildi.
  - **Piero di Cosimo ikonografik varyantı:** Strasbourg panosunda bağlanma yeri **ağaç**, cezayı uygulayan **Merkür** → "Kafkas kayası" şablonu bu esere uygulanmadı [C015]. Müze/devlet kataloğu kayıtları esas alındı; literatürdeki farklı tarih/boyut değerleri (Strasbourg "1515", 64 × 116 cm; Münih 68 × 120 / 64 × 120 cm) **teyitsiz** olarak işaretlendi.
  - **Kaydı açılmayan örnekler eklenmedi:** Füger ve Jordaens Prometheus tabloları brief'te doğrulanmadığı için maddeye girmedi.
- **Taşınmayan aday iddialar (6):** C002 (Mekone'de öküz payları ve Zeus'un kemik-yağla aldatılması), C004 (Pandora/"güzel kötülük" + "iyiliksever Prometheus bile Zeus'un öfkesinden kaçamadı"), C007 (*PV*'de Hermes'in kartal kehaneti ve kurtuluş koşulu), C012 (PMA küratöryel okuması: Rubens'in eseri en önemlilerinden sayması, Michelangelo prototipleri, Titian Tityus esini — YORUM), C014 (Piero iki panosunun ortak kaydı), C016 (Münih panosunun "modern çağ resminde ilk anlatımsal betim" + Boccaccio değerlendirmesi — YORUM). İçerikleri `akademik_tartismalar` 5 ve 7'de, ayrıca örnek 1 ve 3'ün `baglam` alanlarında kaynak atfıyla korundu.
- **Eksik kaynak notu:** *Works and Days* 60–105 (Pandora yaratılışı) kartı açılmadığı için Pandora ayrıntısı yazılmadı; *PV* Yunanca metninin yalnız 1–35 kartı okundu; Griffith 1977 / Herington 1970 tam metinleri açılamadı → yalnız künye düzeyinde anıldı, DOGRULANDI dayanağı yapılmadı.

### MIT-003 · `osiris` · `misir-mezopotamya-mitolojisi`
- **Dosya:** `mitoloji/MIT-003-osiris.json` + `kanit-kayitlari/MIT-003.json`
- **10 iddia:** DOGRULANDI 9 · **KISMEN_DESTEKLENIYOR 1 (C004)** · CELISKILI 0 · DOGRULANAMADI 0 · HATALI 0
- **Tür dağılımı:** OLGU 4 (C001, C002, C008, C013) · YORUM 3 (C003, C004, C005) · GELENEKSEL_ANLATI 2 (C006, C007) · TEKNIK_TANIM 1 (C010)
- **Kaynaklar:** 11 (K01–K03 British Museum [üçü de **Wayback**: 2026-06-19, 2026-06-19, 2022-06-28] · K04–K05 Met API · K06 OIMP 39 (Scalf ed., 2017) OA PDF · K07 Kucharek ch. 10 · K08 Scalf ch. 1 · K09 UCL blogu [YARDIMCI] · K10 Stadler 2023 [**ERISILDI_KISMEN**] · K11 Griffith Institute [**ERISILDI_KISMEN**])
- **Resim örneği:** 3 (Ani Papirüsü çerçeve 3, EA10470,3 · çerçeve 4, EA10470,4 · Nauny papirüsü, Met 30.3.31). **BM EA20868 ahşap Osiris figürü ve OIM E17544 bronz triadı resim DEĞİL → örnek listesine alınmadı**, ikonografi/renk kanıtı olarak anıldı (Kural 11). **Met 35.9.20a–w (Imhotep papirüsü) kayıtta Osiris betimi doğrulanmadığı için alınmadı.**
- **Uygulanan dikkat noktaları:**
  - **Renk ihtilafı (zorunlu denge):** zorunlu ayrım kuruldu → görünen (yeşil yüz, bazı örnekler siyah) → tarihsel kullanım (atef taç, asa+döven, mumya biçimi) → atfedilen anlam (BM küratörü: yeşil = bitki örtüsü/yeni yaşam, siyah = toprağın bereketi) → anlamın kaynağı/savunucusu (BM küratör yorumu, Strudwick 2006 alıntılı; yardımcı düzeyde UCL yazısı) → **alternatif/karşıt yorum** (Kucharek: Osiris bitki örtüsü tanrısı DEĞİLDİ, özgün işlevi kraliyet cenaze dininin tanrılığı). "Yeşil ten = bitki tanrısı" otomatik çıkarımı **kurulmadı**.
  - C004 (UCL blogu) hiyerarşi 6 yardımcı kaynak olduğu için brief önerisiyle **KISMEN_DESTEKLENIYOR** bırakıldı; renk iddiasının taşıyıcı kanıtı müze kaydı (K03) kabul edildi.
  - **'Book of the Dead' modern adlandırma:** ilk kullanımda modern olduğu, Almanca *Totenbuch*'tan türediği ve antik adın "Book/Spells of Going Forth by Day" olduğu K08 ile verildi; **transliterasyon varyantı** açıkça not edildi (kaynak `rꜢ.w n.w prı͗.t m hrw` / `tꜢ mḏꜢ.t n.t prı͗.t m hrw` biçimlerini verir; brief/prompttaki kısaltılmış `rw nw prt m hrw` yazımı aynı adın başka bir transliterasyonudur; çeviri de aynı ciltte "Going Forth by Day" ↔ "Coming Forth by Day" olarak iki biçimde geçer) → tek "doğru" biçim iddiası kurulmadı.
  - **EA20868 menşe ihtiyatı:** kayıt "Akhmim" der ama papirüsün özgün menşei için "surely Thebes" ihtiyatını ekler → bu ihtiyat korundu. EA10470,3 ölçüsü "çerçeve ölçüsü" olarak belirtildi (BM'nin diğer kayıtlarında farklı cam/çerçeve değerleri görülebiliyor). Üç BM nesnesi snapshot'larında "Not on display" → güncel sergileme iddiası kurulmadı.
  - **Stadler (K10):** yalnız kayıt sayfası okundu (PDF Anubis bot koruması) → ERISILDI_KISMEN; **ona dayanan hiçbir iddia kurulmadı**, hiçbir DOGRULANDI'ya dayanak yapılmadı.
  - **Anlatı ≠ olgu:** Osiris miti GELENEKSEL_ANLATI; Kucharek'in tespiti (Mısır kaynaklarında süreklilikli anlatı yok; en kapsamlı Mısır kökenli sunum Louvre'daki 18. Hanedan stelası; tutarlı anlatılar Plutarkhos başta klasik yazarlara borçlu) açıkça yazıldı; Plutarkhos derlemesi Mısır belgelerinin yerine konmadı. Plutarkhos metni bu araştırmada doğrudan AÇILMADI.
  - **"Kral = çapraz kol" çıkarımı kurulmadı:** OIMP 39 (s. 174) çapraz kolların çoğu zaman kraliyet işareti sayıldığını ama özel kişilerde de görüldüğünü, Osiris'in asa+döven jestinin taklidi olduğunu yazar → `akademik_tartismalar` 6'da ihtiyat olarak verildi.
  - **`ozgun_ad` alanına Mısırca ad transliterasyonu YAZILMADI:** açılan kaynaklar Osiris adının Mısırca transliterasyonunu vermediği için uydurma yapılmadı; bunun yerine belgeli "The Osiris N." özdeşleştirme formülü kaydedildi.
- **Taşınmayan aday iddialar (4):** C009 (OIMP 39 Cat. 35, bronz Osiris–İsis–Horus triadı: atef taç, asa+döven, Abydos bağı, "Seth'in elinde cinayet / İsis'in elinde mumyalanma / Horus'un elinde kurtarılma"), C011 (Met 30.3.31 Nauny künyesi — örnek 3'te K04+K08 atfıyla korundu), C012 (OIMP 39 renk sembolizmi: yeşil = taze büyüme, altın = güneş/tanrısallık, Ptah-Sokar-Osiris'in yaldızlı yüzü, kalp skarabeleri — `akademik_tartismalar` 2'de), C014 (Met 35.9.20a–w Imhotep papirüsü kaydı — negatif bulgu olarak K05 notlarında).

---

## 2) Çapraz bağlar

**Eklenen (hedef dosyalar diskte var, glob ile doğrulandı):**

| Kaynak madde | Hedef | Gerekçe / kanıt |
|---|---|---|
| MIT-001 | **MIT-002** | Karşılıklı bağ. Ortak birincil kaynak geleneği: Hesiodos, *Theogonia* (Perseus edisyonu) — MIT-001'de 270–282 kartları (Gorgonlar), MIT-002'de 507–616 kartları (Prometheus); aynı kategori (`yunan-roma-mitolojisi`). |
| MIT-002 | **MIT-001** | Yukarıdaki bağın karşılıklı ayağı. |
| MIT-001 | **IKO-005** (`ayna`) | TAKSONOMI §5.2 (MIT → IKO): Perseus'un Athena'nın **parlak kalkanını yansıma için kullanması** [C016] ve Caravaggio'nun rotella'sında kalkan yüzeyinin resimsel işlenişi. |
| MIT-001 | **TEK-001** (`fresk`) | 4. resim örneği (Boscotrecase imparatorluk villası duvar resmi, Met 20.192.16) Met API kaydında **"Fresco"** tekniğiyle belgelidir. |
| MIT-003 | — | **Boş**: diskteki IKO-001..005, MIT-001/002, TEK-001..003, NES-001..005 ile bu maddenin içeriğini **kaynak düzeyinde** bağlayan bir kanıt yoktur. (IKO-001 `lotus`, Mısır "lotus"unu Budist lotustan ayıran ayrı-kavram maddesidir; MIT-003 brief'inde lotus kanıtı yok → bağ kurulmadı.) |

**Eklenemeyen — birleştirme turunda ANA OTURUM eklemeli:**

| Kaynak madde | Hedef | Durum / gerekçe |
|---|---|---|
| MIT-004 (`krishna`) | TEK-005 (`wasli`) | PILOT_SECIM'in planlı bağı; MIT-004 bu ajanda değil, dosyası henüz diskte yok. |
| MIT-005 (`amaterasu`) | IKO-003 (`cin-ejderhasi`) | PILOT_SECIM'in "yalnız kaynak desteklerse" koşullu planlı bağı; IKO-003 tarafında hazır kanıt var (C003 ryū/tatsu, C012 Sesson Shūkei) — MIT-005 yazıldığında değerlendirilmeli. |
| MIT-001 | NES-005 (`zirh`) | **Kurulmadı.** Gerekçe: Caravaggio rotella'sının Uffizi silahhanesinde "Pers zırhı" giydirilmiş manken üzerinde sergilendiği bilgisi yalnız K11'de (partner platform) ve ilgili aday iddia (brief C012) claim üst sınırından taşınamadı; zayıf kanıtlı bağ kurulmadı. İnsan denetimi uygun görürse ekleyebilir. |
| MIT-001, MIT-002 | `antik-ikonografi` maddesi | Pilot listesinde bu kategoriye atanmış bir ID yok; gorgoneion/apotropaik imge ve Prometheus ikonografisi için ileride açılacak maddeye bağ önerilir. |
| MIT-003 | olası "ölüm/yargı" alegorisi veya `antik-ikonografi`/Mısır ikonografisi maddesi | Pilot listesinde yok; Osiris'in ölüler yargısı ikonografisi (C001, C008) böyle bir maddeyle bağlanabilir. |

> `ilgili_maddeler` alanlarına **yalnız diskte var olan** ID'ler yazıldı (doğrulayıcı kuralı);
> MIT-004/MIT-005 dosyaları bu not yazılırken mevcut değildi.

---

## 3) Brief yetersizliği nedeniyle YAZILMAYAN bölümler / kurulmayan iddialar

1. **MIT-001:** Vasari'nin Leonardo biyografisindeki **kayıp kalkan (rotella) anlatısı** (birincil metin açılmadı) · Cellini *Perseus* bağlamı (bağımsız heykel + kaynak yok) · Caravaggio rotella'sının **boyutları** (müze kaydında yok; literatürdeki 60 × 55 cm teyitsiz) · Marseus panosunun **envanter numarası** (bulunamadı) · Moravian Gallery Brno'daki Rubens versiyonu (kayıt açılmadı) · "Medusa Murtola" (özel koleksiyon, teyitsiz) · apotropaik okumaya karşı eleştirel literatür (bu batch'te açılmadı) · Martin (2014) "Gorgon" PDF'i ve OAPEN tam kitap metni (erişilemedi).
2. **MIT-002:** *Works and Days* 60–105 (**Pandora'nın ayrıntılı yaratılış anlatısı**) · *Prometheus Bound*'un Yunanca tam metni (yalnız 1–35 kartı okundu) · Titian'ın Mary of Hungary için yaptığı **özgün "Furies" dizisinin Prometheus'u içerip içermediği** (doğrulanamadı) · Griffith 1977 / Herington 1970 (tam metin açılamadı) · Füger ve Jordaens'in Prometheus tabloları (müze kaydı açılmadı) · Strasbourg müzesinin kendi nesne sayfası (HTTP 500 → Joconde ile telafi edildi).
3. **MIT-003:** **Mezar duvar resmi (fresk) örneği** — brief'te müze kaydıyla doğrulanmadı; Met'in "tempera on paper" facsimile kayıtları 20. yüzyıl kopyası olduğu için replika uyarısı olmadan kullanılmadı → madde yalnız **boyalı papirüs vignette'leriyle** kuruldu · Stadler 2023 tam metni (metodoloji tartışması bu yüzden yazılamadı) · Griffith Institute'ın Osiris'e özgü kaynağı (bulunamadı) · Birmingham Eton Myers sanal müzesi ve Walters öğretmen kiti PDF'i (erişilemedi) · Petrie Museum UC14226 steli (müze kaydından doğrulanmadı) · Plutarkhos *De Iside et Osiride* birincil metni (açılmadı; yalnız Kucharek'in aktarımıyla anıldı) · Osiris'in Mısırca adının transliterasyonu (kaynaklarda yok → `ozgun_ad`a yazılmadı).

---

## 4) Kalan insan-incelemesi noktaları (öncelik sırasıyla)

1. **MIT-001 C010 (CELISKILI — armağan tarihi 1608 ↔ 1598):** ICCD/SIGECweb scheda 16218731 (K17) ve/veya Uffizi'nin kendi katalog kaydı açılıp karara bağlanmalı; aynı turda kalkanın **boyutları** ve eserin tarihinin (1595 / 1595–98 / y. 1597–98) müze içi tutarlılığı netleştirilmeli.
2. **MIT-001 Marseus atfı:** Uffizi sayfaları arasındaki fark (16. yy anonim Felemenk ↔ 17. yy Otto Marseus van Schrieck) müzenin güncel kataloğuyla teyit edilmeli; panonun envanter numarası eklenmeli.
3. **MIT-002 C013 (CELISKILI — Titian *Tityus* 1548–49 ↔ ca. 1565):** Prado canlı kaydı (403 nedeniyle Wayback 2026-04-23 kullanıldı) ve PMA küratöryel metni karşılaştırılmalı; ayrıca özgün "Furies" dizisinin içeriği (Prometheus dahil mi?) akademik kaynaktan doğrulanmalı.
4. **MIT-002 yazarlık:** Manousakis 2020 kitabının tam metni ve Mtvarelidze 2014'ün dijital karşılaştırma yöntemi birlikte incelenmeden "Aiskhylos'a atfedilir" ifadesinin ötesinde bir hüküm kurulmamalı (Griffith 1977, Herington 1970, Winnington-Ingram).
5. **MIT-003 renk sembolizmi:** üç farklı kaynak katmanı (BM küratör yorumu · UCL blogu · OIMP 39) ve Kucharek'in eleştirisi bir Mısır bilimci tarafından değerlendirilmeli; gerekirse renge dair ifade daha da daraltılmalı.
6. **MIT-003 resim örneği kapsamı:** madde yalnız papirüs vignette'leriyle kuruldu; mezar duvar resmi örneği (ör. Nebamun/Thebes duvar resimleri) **orijinal** müze kaydıyla doğrulanırsa eklenmeli (facsimile/replika uyarısıyla karıştırılmamalı).
7. **MIT-003 Stadler 2023:** tam metin açılırsa, *Book of the Dead*'in dinsel kaynak olarak metodolojisi ve "modern adlandırma" tartışması (C010) ikinci akademik kaynakla güçlendirilebilir.
8. **Wayback bağımlılığı:** 5 kaynak canlı erişim engeli nedeniyle arşivden okundu (MIT-001-K05 · MIT-002-K14 · MIT-003-K01/K02/K03); arşiv tarihleri `kaynaklar` ve `kanit-kayitlari` kayıtlarında beyan edildi. Yayın öncesi canlı kopyalarla karşılaştırılması önerilir (özellikle BM kayıtlarındaki "Not on display" ve ölçü alanları).
9. **Ortak kaynak kütüğü:** `kaynaklar/KAYNAK_KUTUGU.json` bu ajan tarafından oluşturulmadı/güncellenmedi (talimat gereği dokunulmadı); MIT-001..003'ün 42 kaynak kaydı birleştirme turunda ana oturum tarafından kütüğe işlenmelidir (doğrulayıcı şu an bu kaynaklar için "ortak kütükte yok" uyarısı üretmiyor çünkü kütük dosyası yok).
