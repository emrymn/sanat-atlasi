# ÜRETİM NOTU — RESİM TEKNİĞİ (pilot batch: tek-a · TEK-001 … TEK-003)

**Üreten ajan:** `ansiklopedi-madde-yazim (tek-a)` — bu not **bağımsız denetim değildir**.
**Tarih:** 2026-11-15 · **Kategori dizini:** `resim-ansiklopedisi/resim-teknikleri/`
**Kapsam:** TEK-001 (fresk), TEK-002 (yumurta-tempera), TEK-003 (glaze) — 3 madde + 3 kanıt dosyası
**Yayın durumu (hepsi):** `BAGIMSIZ_DENETIM_BEKLIYOR` · **son_guncelleme:** 2026-11-15

> Bu ajan yeni araştırma YAPMADI (web erişimi yok); tüm içerik `tek-a` brief'lerinden üretildi.
> Brief'te kanıtı olmayan hiçbir bilgi, tarih, envanter numarası veya alıntı eklenmedi.
> Claim üst sınırı (6–10) nedeniyle brief'lerdeki aday iddiaların bir kısmı maddeye taşınamadı;
> bunlar aşağıda madde madde listelendi ve ilgili `uretim_notu` / `akademik_tartismalar` alanlarında izlendi.
> **TEK-004 (mürekkep resmi) ve TEK-005 (wasli) başka bir ajandadır; bu ajan onlara DOKUNMADI.**

---

## 0) Doğrulama sonucu

```
.qwen/tmp/venv-dogrula/bin/python resim-ansiklopedisi/dogrula.py --dosya \
  resim-ansiklopedisi/resim-teknikleri/TEK-001-fresk.json \
  resim-ansiklopedisi/resim-teknikleri/TEK-002-yumurta-tempera.json \
  resim-ansiklopedisi/resim-teknikleri/TEK-003-glaze.json

→ 16 madde tarandı · 0 HATA · 9 UYARI
```

`dogrula.py --test`: **23/23 geçti** (testler değiştirilmedi).
`DURUM.md`, `GENEL_RAPOR.md`, `kaynaklar/KAYNAK_KUTUGU.json`, `denetim/`, `data/`, diğer kategori
dizinleri, `basyapit-dersleri/` ve uygulama koduna DOKUNULMADI; commit/push/deploy yapılmadı.

Üretim sırasında görülen ve sonra kapanan geçici hata: `ilgili_madde TEK-002 / TEK-003 mevcut değil`
— kardeş dosyalar diske yazıldıkça kendiliğinden çözüldü, son koşumda 0 hata.

### 9 uyarının dökümü (hepsi bilinçli, hata değil)

| Madde | Kaynak | Neden uyarı veriyor | Nitelik |
|---|---|---|---|
| TEK-001 | K05 (UNESCO), K08 (Smarthistory Giotto), K09 (Smarthistory Masaccio), K10 (MUS.E Brancacci) | Yalnız **doğrulanmış resim örneklerinde** kullanılıyor; `dogrula.py` örnek kaynaklarını `kullanilan_kaynak` kümesine uyarı basıldıktan SONRA ekliyor | betik sıralama artefaktı |
| TEK-001 | K13 (Mora–Philippot–Blanc) | `ERISILEMEDI`, yalnız künye; hiçbir iddiaya dayanak yapılmadı | bilinçli bibliyografik kayıt |
| TEK-002 | K08 (Opera del Duomo Siena), K09 (Britannica Maestà), K10 (Met Sienese Painting) | Yalnız Maestà örnek kaydında kullanılıyor | betik sıralama artefaktı |
| TEK-003 | K08 (Uffizi, Venus of Urbino) | Yalnız Venus of Urbino örnek kaydında kullanılıyor | betik sıralama artefaktı |

"Etiketsiz olgusal cümle adayı" ve "YORUM/HIPOTEZ türü iddia DOGRULANDI" uyarısı **yoktur**
(üç maddede de YORUM/HIPOTEZ türünde claim kurulmadı; yorum niteliğindeki brief adayları ya
atıldı ya da sahiplendirilerek `akademik_tartismalar` alanına alındı).

---

## 1) Madde başına iddia dökümü

| Madde | Claim | DOGRULANDI | KISMEN | DOGRULANAMADI | CELISKILI | HATALI | Tür dağılımı |
|---|---|---|---|---|---|---|---|
| TEK-001 fresk | 10 | 9 | 1 (C006 mezzo fresco) | 0 | 0 | 0 | TEKNIK_TANIM 8 · TARIH 2 |
| TEK-002 yumurta-tempera | 10 | 10 | 0 | 0 | 0 | 0 | TEKNIK_TANIM 3 · TARIH 2 · OLGU 4 · GELENEKSEL_ANLATI 1 |
| TEK-003 glaze | 10 | 10 | 0 | 0 | 0 | 0 | TEKNIK_TANIM 4 · OLGU 5 · GELENEKSEL_ANLATI 1 |
| **TOPLAM** | **30** | **29** | **1** | **0** | **0** | **0** | — |

Brief aday iddia sayısı: TEK-001 → 24, TEK-002 → 25, TEK-003 → 21 (toplam 70). 30'u claim olarak
taşındı; kalanlar ya **birleştirildi** (aynı kaynak/konu kümesi) ya da **atıldı** (tek yardımcı
kaynak, madde kapsamı dışında, claim üst sınırına takıldı). Atılanların tümü madde dosyalarındaki
`uretim_notu` alanında tek tek listelenmiştir.

---

## 2) TEK-001 · FRESK (`resim-teknikleri/TEK-001-fresk.json`)

**Kategori:** `baglayici-ve-medya` · **alt_kategori:** `kirec-bagli-duvar-resmi` · **ilgili_maddeler:** `TEK-002`

### Açılan kaynaklar (12)
`ERISILDI_OKUNDU` (6): K01 NG Glossary "Fresco" · K04 Cennini (Wikisource IT, Cap. LXVII+LXXII) ·
K05 UNESCO 1623 · K06 Vatican Museums (Sistine Ceiling) · K07 NG Glossary "Sistine Chapel" ·
K10 MUS.E/Comune di Firenze (Cappella Brancacci).
`WAYBACK_OKUNDU` (6): K02 Met/Meagher (2025-02-26) · K03 Britannica (2024-12-24) · K08 Smarthistory
Giotto (2026-01-06) · K09 Smarthistory Masaccio (2026-01-17) · K11 NGS Glossary (2025-09-28) ·
K12 Smarthistory technique glossary (2026-01-18).

### Erişilemeyen kaynak (1)
**TEK-001-K13 — P. Mora, P. Philippot, C. Blanc, *Conservation of Wall Paintings*:** Getty
Publications sayfası JavaScript olmadan çalışmıyor; `ERISILEMEDI` + `kunye` + "metnine erişilmedi"
notuyla **BIBLIYOGRAFIK** kaydedildi ve hiçbir iddiaya dayanak yapılmadı. Bu nedenle **modern
konservasyon kimyası / fresk bozulması bölümü YAZILMADI**; madde koruma konusunda yalnız NG
sözlüğünün "aktarma tekniği en az 16. yüzyıldan beri biliniyor" bilgisini kullanır (C009).

### Brief yetersizliği nedeniyle YAZILMAYAN içerik
- Sistina tavanı veya Scrovegni döngüsünün **bölge bazlı secco/mezzo tespitleri** — açılan
  kaynaklarda yok (Vatican resmî sayfası tekniği hiç anmıyor). "Şu bölüm secco'dur" yazılmadı.
- **Modern duvar resmi kimyası / konservasyon literatürü** — K13'e erişilemedi.
- **Sinopia'nın korunması/sökülmesi (sinopia müzeleri)** — kaynak yok.
- NG Glossary "sinopia" girdisi **404** (girdi yok); tanım Met + NGS + Cennini'den kuruldu.

### Taşınmayan/birleştirilen aday iddialar
Birleştirilen: C006→C005 (Britannica limewater nüansı secco tanımının içine), C010+C011→C008
(Cennini pigment listesi ve secco bağlayıcıları), C013+C014→C003 (kalıcılık ve nem hassasiyeti),
C015→C009 (duvardan ayırma), C016+C017→C010 (Sistina), C018+C019→örnek kaydı (Scrovegni/UNESCO).
Atılan: **C020** (Enrico Scrovegni'nin tefecilik kefareti YORUMU — tek yardımcı kaynak, "perhaps"),
**C021** (Tanrı figürü panel istisnası — tek yardımcı kaynak; örnek kaydının `baglam` alanına alındı),
**C022** (Brancacci siparişi — örnek kaydına alındı), **C023** (Masaccio sürekli anlatım/kaçış
noktası/dökme gölge YORUMU — teknik madde kapsamı dışı), **C024** (Michelangelo'nun Brancacci'de
eskiz yapması — tek yardımcı kaynak).

### Kalan insan-inceleme noktaları
(a) arriccio / intonaco / arricciato terminoloji farkının bağımsız bir konservasyon kaynağıyla
netleştirilmesi (NG+Met ↔ NGS ↔ Britannica üç ayrı kullanım); (b) mezzo fresco için **ikinci**
kurumsal kaynak (şu an tek kaynak → KISMEN); (c) Sistina/Scrovegni için secco bölge tespitleri;
(d) Cennini pigment adlarının modern pigment-kimyası karşılıkları (ayrı analiz kaynağı gerekir);
(e) Mora–Philippot–Blanc metnine erişim.

---

## 3) TEK-002 · YUMURTA-TEMPERA (`resim-teknikleri/TEK-002-yumurta-tempera.json`)

**Kategori:** `baglayici-ve-medya` · **alt_kategori:** `yumurta-bagli-emulsiyon-boya` · **ilgili_maddeler:** `TEK-001`, `TEK-003`

### Açılan kaynaklar (14/14)
`ERISILDI_OKUNDU` (10): K01 NG Glossary "Tempera" · K02 Tate "Tempera" · K03 Cennini (Cap. CXLV+LXXII) ·
**K05 NGTB 26 (2005) PDF** (landing + PDF canlı 200, pypdf ile metin çıkarıldı) · K06 NG663.1 ·
K07 NG915 · K08 Opera del Duomo Siena · K11 NG Glossary "Oil" · K13 Vasari (Gutenberg #26860 c.3) ·
K14 NG Story "How is egg tempera paint made?".
`WAYBACK_OKUNDU` (4): K04 Met/Meagher (2025-02-26) · K09 Britannica "Maestà" (2024-10-10) ·
K10 Met/Christiansen "Sienese Painting" (2025-03-18) · K12 Met/Jones "Painting in Oil…" (2025-03-18).

### Erişilemeyen / kullanılmayan kaynaklar
- **D. V. Thompson Jr. çev., *The Craftsman's Handbook* (Yale 1933 / Dover 1960)** ve
  **L. Broecke çev. (Archetype, 2015):** yalnız künye, metin açılmadı → İtalyanca tam metin (K03) ikame edildi.
- **NGTB Vol. 18 (1997) "Methods and Materials of Northern European Painting":** açılmadı →
  Kuzey Avrupa'da yumurta temperasının **dead-colouring/alt boyama rolü YAZILMADI**.
- **collectionapi.metmuseum.org:** HTTP **410 Gone** (2026-11-15) → Met nesne kayıtları bu yoldan alınamadı.
- **Cennini Cap. LXIII–LXVI (fırça yapımı):** yalnız indeks üzerinden varlığı görüldü, içerik açılmadı →
  maddede **araç/fırça tarifi YAZILMADI**.

### Brief yetersizliği nedeniyle YAZILMAYAN içerik
- **Maestà için "altın varaklı / tempera and gold" nitelemesi:** erişilen kaynaklarda birebir YOK
  (resmî Siena sayfası medyum vermiyor; Britannica yalnız "tempera on wood panel") → yazılmadı.
- **Maestà'nın müze envanter numarası:** resmî sayfada yok → yazılmadı.
- **Antik Çağ / Bizans erken örnekleri:** NG'nin "since Antiquity" ifadesi genel, örneklendirilmemiş
  → somut antik örnek verilmedi.
- **Altın-punç tekniğinin koruma analizi:** kaynak yok.
- **Van Eyck'in 1441 ölüm tarihi ve Antonello'nun Bruges seyahati:** TEK-002 kaynaklarında birebir
  geçmediği için olgu olarak yazılmadı (TEK-003 tarafında NG sanatçı sayfası başlığında geçiyor).

### Taşınmayan/birleştirilen aday iddialar
Birleştirilen: C001+C002+C004→C001 (tanım + emülsiyon tipleri + basit üretim tarifi),
C005+C006+C007+C009→C003 (Cennini: panel reçetesi, kademeli modelleme, secco bağlayıcıları, treatise tarihi),
C011+C012→C006 (NG 598 + tempera grassa), C021+C022+C023→C007 (yağın erken tarihi + yayılım +
"incorrectly credited").
Atılan: **C013** (Perugino, *Combat between Love and Chastity* — sipariş verenin isteğiyle tempera),
**C014** (metal oksalat/protein IR bantları analitik yorum tuzağı → `akademik_tartismalar` 5'te),
**C015/C016/C017** (Maestà çift yüz/sahne sayıları, medyum, 18. yy'da parçalanma → örnek kaydının
`baglam` ve `versiyon_notu` alanlarında), **C018** (Duccio'nun "Siena resminin babası" sayılması
YORUMU — teknik madde kapsamı dışı), **C025** (anlatı eleştirisi → C007 + `akademik_tartismalar` 1).

### Vasari karşıtlığının işlenişi (prompt gereği)
C008 = `GELENEKSEL_ANLATI` (Vasari, K13 birincil metin, de Vere çevirisi) — iddia metninin son
cümlesi açıkça "tarihsel olgu olarak sunulamaz" der; C007 = modern karşı-kanıt (Met "incorrectly
credited", NG "Oil" glossary, yayılımın çok kanallılığı). İki katman madde metninde **yan yana ama
karışmadan** verildi; `akademik_tartismalar` 1'de kaynak kaynak ayrıştırıldı.
**Tempera terim kapsamı** (NG dar ↔ Tate geniş) C001 içinde ve `akademik_tartismalar` 2'de açıkça ayrıldı.

### Kalan insan-inceleme noktaları
(a) Maestà için müze-envanterli medyum kaydı; (b) tempera grassa'nın Botticelli dışı atölyelerdeki
yaygınlığı ("may have employed" ihtiyatı); (c) van Eyck ölüm tarihi / Antonello Bruges iddialarının
belgeyle kontrolü; (d) NGTB Vol. 18 (1997) Kuzey Avrupa bölümü; (e) Thompson/Broecke çevirilerinin açılması.

---

## 4) TEK-003 · GLAZE (`resim-teknikleri/TEK-003-glaze.json`)

**Kategori:** `uygulama-ve-yuzey` · **alt_kategori:** `seffaf-katman-uygulamasi` · **ilgili_maddeler:** `TEK-002`

### Açılan kaynaklar (13/13)
`ERISILDI_OKUNDU` (10): K01 NG Glossary "Glaze" · K02 NG "Scumble" · K03 NG "Impasto" ·
K04 NG artist page "Jan van Eyck" · K05 NG186 Arnolfini Portrait · K09 NG221 Rembrandt ·
**K10 Noble, JHNA 17(2) 2025 (hakemli, tam metin)** · K11 NG Glossary "Oil" · K12 Vasari (Gutenberg c.3) ·
K13 NGTB 26 (2005) PDF.
`WAYBACK_OKUNDU` (2): K06 Met/Jones "Painting in Oil…" (2025-03-18) · K07 Met/Jones "Jan van Eyck"
(2025-03-18).
**K08 Uffizi (Venus of Urbino) canlı açıldı** — brief'in "engel olabilir" öngörüsünün aksine HTTP 200.

### Brief yetersizliği nedeniyle YAZILMAYAN / KULLANILMAYAN içerik
- **'velatura' ve 'wet-in-wet' tanımları:** açılan kurumsal kaynaklarda **bulunamadı** →
  UYDURULMADI, maddeye alınmadı; `alternatif_adlar` içinde "tanımlanamadı" notu ve
  `akademik_tartismalar` 4'te kaynak taraması kaydı düşüldü.
- **Venus of Urbino'ya özgü glaze katmanı iddiası:** Uffizi kaydı teknik analiz içermediği için
  **YAZILMADI**; Titian'ın genel "luce di dentro" uygulaması (Noble, tek hakemli kaynak) madde
  metnine iddia olarak alınmadı, `akademik_tartismalar` 3'te kaynak atfıyla bırakıldı.
- **Gece Devriyesi (Night Watch) örneği:** teknik bulgular Noble'da var ama Rijksmuseum katalog
  kaydı açılmadı → **TEYİTSİZ**, doğrulanmış resim örnekleri listesine ALINMADI
  (`akademik_tartismalar` 5).
- **Glaze medyum reçeteleri** (NGTB s. 90: reçine/softwood pitch + ceviz yağı, Marziale örneği) ve
  **NG Technical Bulletin "brown and black organic glazes"** makalesi: açılmadı/iddiaya dönüştürülmedi.
- **Met nesne kayıtları** (Petrus Christus 49.7.19, Memling 14.40.634): collectionapi.metmuseum.org
  HTTP 410 Gone → DOGRULANAMADI, alınmadı.
- **Merode Triptiği:** Met denemesinde glaze örneği olarak geçiyor ama ayrı müze kaydı açılmadı →
  metinde anıldı, doğrulanmış örnek listesine alınmadı.

### 'Van Eyck glaze mucidi' anlatısının dört katmanlı işlenişi (prompt gereği)
(1) Vasari anlatısı = C007 (`GELENEKSEL_ANLATI`); (2) Met "incorrectly credited" + 12. yy = C006;
(3) NG sanatçı sayfası "is credited with originating a style" = C006; (4) NG In-depth
"no technical innovation… relied on van Eyck's skill" = C005. Madde metninde hiçbir cümle
"van Eyck glazeyi icat etti" kesinliğinde değildir; Met'in "ışıldayan kırmızılar glazürlerle üretildi"
ifadesi ile NG'nin "olağandışı pigment yok" tespiti **çelişki değil farklı sorular** olarak sunuldu
(`akademik_tartismalar` 6).

### Taşınmayan/birleştirilen aday iddialar
Birleştirilen: C001+C002→C001, C003+C004+C005→C002 (glaze/scumble/impasto ayrımları),
C007+C009+C012→C006 (kurumsal van Eyck nitelendirmeleri), C016+C018+C020→C008 (Rembrandt zeminleri
+ impasto/glaze düzeni + NG221 quartz zemin).
Atılan: **C013** (Venus of Urbino provenansı → örnek kaydının `baglam`/`versiyon_notu` alanına),
**C014** (Uffizi'nin "unmatchable skill" YORUMU), **C015** (Titian "luce di dentro"),
**C017** (Gece Devriyesi — teyitsiz). Brief'in C021'i C010 olarak taşındı.

### Kalan insan-inceleme noktaları
(a) 'velatura' için İtalyanca teknik literatürden kurumsal tanım; (b) Venus of Urbino için teknik
analiz (Uffizi veya NG Titian bülteni Vol. 34); (c) Gece Devriyesi için Rijksmuseum kaydı (SK-C-5);
(d) Titian genellemesi için ikinci bağımsız kaynak; (e) organik kahverengi/siyah glazürlerin
pigment-kimyası; (f) Noble (2025) tek kaynaklı Rembrandt zemini bulgularının ikinci kaynakla teyidi.

---

## 5) Çapraz bağlar

### Eklenenler (hedef dosyalar diskte mevcut)
- **TEK-001 ↔ TEK-002** — brief açıkça destekliyor: Cennini *Il libro dell'arte* Cap. LXXII'deki secco
  bağlayıcısı ("La seconda tempera si è propio rossume d'uovo… questa tempera è universale, in muro,
  in tavole, in ferro") iki maddenin ortak birincil kanıtı (TEK-001-K04 = TEK-002-K03).
  TEK-001'de `ilgili_maddeler: ["TEK-002"]`, TEK-002'de `["TEK-001","TEK-003"]`.
- **TEK-002 ↔ TEK-003** — brief destekliyor: NGTB 26'da erken İtalyan panellerinde yağın
  "glazes over metal leaf" için ayrılması (TEK-002-K05 = TEK-003-K13) + NG Glossary "Oil"
  yağ/tempera karşılaştırması (TEK-002-K11 = TEK-003-K11). TEK-003'te `ilgili_maddeler: ["TEK-002"]`.

### Eklenmeyenler / birleştirme turuna bırakılanlar
- **TEK-001 ↔ TEK-003:** TEK-001 ve TEK-003 brief'lerinde fresk–glaze bağını destekleyen kanıt YOK →
  bağ kurulmadı (uydurma bağ riski alınmadı).
- **TEK-001/002/003 → TEK-004, TEK-005:** bu yazım sırasında diskte yoktu (başka ajan üretiyor) →
  bağ konmadı. PILOT_SECIM'deki `TEK-004 ↔ NES-003` ve `TEK-005 ↔ MIT-004` planları tek-b ajanının işidir.
- **IKO-001 → TEK-001 (Ajanta secco karşılaştırması):** IKO-001'in `uretim_notu` alanında TEK-001'e
  planlanmış bağ talebi var; TEK-001 tarafında karşılıklı bağ **eklenmedi** (TEK-001 brief'inde Ajanta
  içeriği yok, bağ kuracak kanıt bu maddede bulunmuyor). **Ana oturum birleştirme turunda** IKO-001'in
  talebini değerlendirip TEK-001'e `IKO-001` bağını ekleyebilir.
- **Kategori dışı planlı bağlar (NES/MIT/IKO ↔ TEK):** PILOT_SECIM listesinde TEK-001..003 için
  tanımlanmış kategori-dışı bağ yoktur; olası `TEK-002 → NES`/`TEK-003 → IKO` bağları için brief kanıtı yok.

---

## 6) Kategori kurallarına uyum özeti (TAKSONOMI §3)

- **Malzeme / teknik / yüzey / görsel etki ayrımı:** üç maddede de ayrı başlıklarla tutuldu.
  TEK-001'de "üç düzlem" ayrımı, TEK-002'de malzeme–süreç–görsel etki ayrımı ("brilliant, pure hue"
  etkisi teknik tanımdan ayrı cümlede), TEK-003'te "TEKNİK İLE GÖRSEL ETKİYİ AYIRMAK" başlığı ve
  "'glaze = derinlik' özdeşleştirmesi yapılmaz" uyarısı.
- **Sanatçı-teknik iddiaları yalnız kurumsal/analiz kaynaklı:** Botticelli için NG katalog kaydı
  (NG915) ve NGTB 26 (NG 598); Fra Angelico için NG663.1; Rembrandt için NG221 + hakemli Noble;
  van Eyck için NG186 In-depth + NG artist page + Met. Tek kaynaklı ve ihtiyatlı olanlar
  ("Botticelli tempera grassa kullanmış **olabilir**", Titian "luce di dentro") kesinleştirilmedi.
- **Belirsizlikler korundu:** "y. 1390", "y. 1305", "y. 1424–27", "muhtemelen kavak", "probably oak",
  "en azından 16. yüzyıldan beri", "büyük ölçüde", "kısa süreli", "kısmen", "mümkündür", "gibidir".
- **GELENEKSEL_ANLATI** türü iki maddede (TEK-002 C008, TEK-003 C007) Vasari için kullanıldı;
  DOGRULANDI statüsü **anlatının Vasari metnindeki kaydını** doğrular, içeriğini değil (kanıt
  kayıtlarının `notlar` alanında açıkça belirtildi).
- **CJK:** üç maddenin Türkçe anlatı alanlarında CJK karakter yok (dogrula.py CJK uyarısı vermedi).
- **Kapsam (§11):** üç madde de yalnız resim sanatı kapsamında; `resim_sanatiyla_iliskisi` alanları
  100 karakterin üzerinde ve resim uygulamasına özgü içerikle dolduruldu.
