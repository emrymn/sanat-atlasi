# ÜRETİM NOTU — İKONOGRAFİ (pilot batch: iko-a + iko-b)

**Üreten ajan:** `ansiklopedi-madde-yazim (iko)` — bu not **bağımsız denetim değildir**.
**Tarih:** 2026-11-15 · **Kategori dizini:** `resim-ansiklopedisi/ikonografi/`
**Kapsam:** IKO-001 … IKO-005 (5 madde + 5 kanıt dosyası)
**Yayın durumu (hepsi):** `BAGIMSIZ_DENETIM_BEKLIYOR` · **son_guncelleme:** 2026-11-15

> Bu ajan yeni araştırma YAPMADI (web erişimi yok); tüm içerik `iko-a` ve `iko-b` brief'lerinden
> üretildi. Brief'te kanıtı olmayan hiçbir bilgi, tarih, envanter numarası veya alıntı eklenmedi.
> Claim üst sınırı (6–10) nedeniyle brief'lerdeki bazı aday iddialar maddeye taşınamadı; bunlar
> aşağıda madde madde listelendi ve ilgili `uretim_notu` / `akademik_tartismalar` alanlarında da izlendi.

---

## 0) Doğrulama sonucu

```
.qwen/tmp/venv-dogrula/bin/python resim-ansiklopedisi/dogrula.py --dosya \
  resim-ansiklopedisi/ikonografi/IKO-001-lotus.json \
  resim-ansiklopedisi/ikonografi/IKO-002-nimbus.json \
  resim-ansiklopedisi/ikonografi/IKO-003-cin-ejderhasi.json \
  resim-ansiklopedisi/ikonografi/IKO-004-vanitas-sembolleri.json \
  resim-ansiklopedisi/ikonografi/IKO-005-ayna.json

→ 5 madde tarandı · 0 HATA · 22 UYARI
```

`dogrula.py --test`: **23/23 geçti** (testler değiştirilmedi).
`DURUM.md`, `GENEL_RAPOR.md`, `kaynaklar/KAYNAK_KUTUGU.json`, `denetim/`, `data/`,
diğer kategori dizinleri ve uygulama koduna DOKUNULMADI; commit/push yapılmadı.

### 22 uyarının dökümü (hepsi bilinçli, hata değil)

**(a) "YORUM/HIPOTEZ türü iddia DOGRULANDI" — 14 uyarı.**
Brief'ler bu iddialar için DOGRULANDI önerdi; statü ajan tarafından yükseltilmedi (Kural 9).
Bu iddialarda DOGRULANDI'nın anlamı **yorumun/hipotezin sahibine aidiyetinin okunan kaynaktan
doğrulanmasıdır**, yorumun içeriğinin genel kabul olduğu değildir. Hepsi madde metninde
"…'ya göre / … savunur / … yorumlar" kalıbıyla sahiplendirildi ve kanıt kayıtlarının `notlar`
alanında ayrıca açıklandı.

| Madde | Uyarı alan iddialar |
|---|---|
| IKO-001 | C003 (YORUM — A. Menon'un saflık yorumu) |
| IKO-002 | C008, C009 (HIPOTEZ — Ramsden 1941; Chumak 2020) |
| IKO-004 | C003, C004, C005, C007, C011, C014 (YORUM — kurum/küratoryal ve akademik okumalar) |
| IKO-005 | C004, C006, C009, C011 (YORUM — Campbell/NG, Met, NGA küratoryal okumaları) |

**(b) "Hiçbir iddia bu kaynağı kullanmıyor" — 8 uyarı.**
Bunların 3'ü `dogrula.py`'deki sıralama artefaktıdır: kaynak, **yalnız doğrulanmış resim
örneklerinde** kullanıldığında da uyarı üretilir (örnek kaynakları `kullanilan_kaynak` kümesine
uyarı basıldıktan sonra ekleniyor). Diğerleri bilinçli negatif bulgu / bibliyografik kayıttır.

| Kaynak | Neden | Nitelik |
|---|---|---|
| IKO-001-K06 (Met API) | 4 doğrulanmış resim örneğinin kaynağı; brief'in C009 aday iddiası claim üst sınırına takıldı | artefakt |
| IKO-002-K07 (Met API) | Kayıtlar açıldı ama **halo/nimbus öğesi API metninde belgelenmiyor**; görsel inceleme yapılamadığı için iki Met eseri (2020.401, 14.40.628) örnek olarak KULLANILMADI | bilinçli negatif bulgu |
| IKO-003-K06 (Iranica AŽDAHĀ) | İran karşılaştırması okundu; C005 aday iddiası claim üst sınırına takıldı, karşılaştırma `akademik_tartismalar` 1'de kaynak atfıyla duruyor | bilinçli |
| IKO-004-K03 / K04 | Claesz 1628 (Met) ve Claesz 1630 (Mauritshuis) örneklerinin kaynağı; C006/C008 aday iddiaları üst sınıra takıldı | artefakt |
| IKO-004-K13 (Rijksmuseum) | Canlı 200 ama **JS kabuğu** → içerik kullanılmadı | bilinçli negatif bulgu |
| IKO-004-K14 (Bergström/De Jongh/Lammertse) | **ERISILEMEDI**, yalnız künye; hiçbir iddiaya dayanak yapılmadı | bilinçli |
| IKO-005-K07 (NGA Titian) | Titian örneğinin kaynağı; C010 aday iddiası üst sınıra takıldı, içerik örneğin `baglam`/`versiyon_notu` alanında NGA kaydına atıfla belgelendi | artefakt |
| IKO-005-K10 (NG NG222) | Kayıt açıldı; eserde **fiziksel ayna nesnesi yok**, yalnız "aynaya bakıyormuş gibi" benzetmesi → C014 (KISMEN) ve örnek taşınamadı | bilinçli negatif bulgu |

---

## 1) Madde bazında özet

### IKO-001 · `lotus` · `bitki-hayvan-sembolizmi`
- **Dosya:** `ikonografi/IKO-001-lotus.json` + `kanit-kayitlari/IKO-001.json`
- **10 iddia:** DOGRULANDI 10 · KISMEN 0 · DOGRULANAMADI 0 · CELISKILI 0 · HATALI 0
- **Tür dağılımı:** OLGU 5 · TEKNIK_TANIM 3 · TARIH 1 · YORUM 1
- **Kaynaklar:** 7 (K01 Met/Heilbrunn–Dehejia · K02 Smarthistory–Menon · K03 Britannica "Sacred lotus" · K04 Britannica "Blue lotus" · K05 Britannica "Lotus Sutra" · K06 Met API · K07 V&A API). Erişim: 5 WAYBACK_OKUNDU (canlı 429/403), 2 ERISILDI_OKUNDU (API). Erişilemeyen kaynak YOK.
- **Resim örneği:** 7 (Ajanta Cave 1 duvar resmi; Met 52.198 / 18.146.3 / 1970.298.3 / 1994.207; V&A IS.20-1970 ve 1479-1902). Gill kopyası (V&A IS.52-1885) **örnek olarak listelenmedi**, versiyon uyarısı olarak işlendi.
- **Uygulanan dikkat noktaları:** Mısır "lotus"u (Nymphaea caerulea) ile Budist lotus (Nelumbo nucifera) AYRI kavram olarak yazıldı ve birleştirilmedi [C010]; Padmapani çiçeğinin tür kimliği (Smarthistory "lotus" ↔ V&A Gill kaydı "blue lily") kesinleştirilmedi, ihtilaf olarak kaydedildi; Hindu/Budist ilişkisi yalnız **paylaşılan motif** düzeyinde yazıldı (tek-kaynak sınırı), Budist kullanıma özgü ayrışan bir anlam iddiası KURULMADI; Lakşmi-lotus ilişkisi kaynaksız olduğundan hiç yazılmadı.
- **Taşınmayan aday iddia:** C009 (Met'teki Lotus Sutra yazmaları: Kore y. 1340 acc. 1994.207; Japonya y. 1667 acc. 2015.300.5a,b) — içerik doğrulanmış resim örnekleri alanında K06 ile korundu.
- **Belirsizlik koruması:** "terk edilmiş görünmektedir / y. 480 civarı" (C004), "olasılıkla zamk veya tutkal", "genellikle secco diye tanımlanır" (C005), "suggest → izlenimi verir" (C003), "y./ca." tarihler (örnekler).

### IKO-002 · `nimbus` · `hristiyan-ikonografisi`
- **Dosya:** `ikonografi/IKO-002-nimbus.json` + `kanit-kayitlari/IKO-002.json`
- **10 iddia:** DOGRULANDI 10 · diğerleri 0 (2'si HIPOTEZ türü — içerik değil **atıf** doğrulandı)
- **Tür dağılımı:** TARIH 3 · OLGU 3 · TEKNIK_TANIM 2 · HIPOTEZ 2
- **Kaynaklar:** 8 (K01 Catholic Encyclopedia 1911 · K02 NG Glossary · K03 Britannica "Halo" · K04 Ramsden 1941/CAIS · K05 Chumak 2020 PDF · K06 NG Wilton Diptych kataloğu · K07 Met API [kullanılmadı] · K08 V&A API). Erişilemeyen: Cambridge UP "Wearing the Hat of Loyalty" (2019) — brief'te ERISILEMEDI, madde kaynak listesine alınmadı, hiçbir iddiaya dayanak yapılmadı.
- **Resim örneği:** 2 (Wilton Diptych NG4451; V&A 1479-1902 thangka "double halo"). **SINIRLILIK:** Hristiyan tarafında tek eser örneği; Met'in iki adayı (2020.401, 14.40.628) halo öğesi kayıtta belgelenmediği ve görsel doğrulama yapılamadığı için dışarıda bırakıldı (Kural 4).
- **Uygulanan dikkat noktaları:** Köken/aktarım yönü ihtilafı dört görüşle ve sahipleriyle `akademik_tartismalar` 1'e işlendi (Britannica "Yunan istilacılarla" ↔ Ramsden'in Pers/hvarenah ortak-kaynak hipotezi ↔ Chumak'ın Gandhara→Bizans hattı ↔ CathEnc/Stephani "Helen icadı"); HIPOTEZ türü iddialar olgu gibi yazılmadı; kare nimbus tarihi (Britannica 5. yy ↔ CathEnc y. 600) ihtilaflı olarak verildi ve CathEnc'nin "yalnızca bir varyant gibi görünüyor" ihtiyatı düşürülmedi.
- **Taşınmayan aday iddialar:** C006 (Britannica: ışınlu taç pagan kökeni nedeniyle erken Hristiyan sanatında kaçınıldı), C007 (CathEnc 1911: erken dönemde İsa'nın nimbusu tanrısallıktan çok öğretmen-kral onurunu belirtir) — her ikisi `akademik_tartismalar` 5'te kaynak atfıyla not edildi.
- **Künye eksiği beyanı:** Ramsden 1941'in orijinal dergi/sayfa bilgisi CAIS yeniden yayın sayfasında yok; uydurma künye üretilmedi (K04 notları).

### IKO-003 · `cin-ejderhasi` · `dogu-asya-ikonografisi`
- **Dosya:** `ikonografi/IKO-003-cin-ejderhasi.json` + `kanit-kayitlari/IKO-003.json`
- **10 iddia:** DOGRULANDI 9 · KISMEN_DESTEKLENIYOR 1 (C010) · CELISKILI 0
- **Tür dağılımı:** OLGU 5 · TARIH 4 · TEKNIK_TANIM 1
- **Kaynaklar:** 10 (K01 MFA Boston [Wayback] · K02 Met/Heilbrunn–Kim [Wayback] · K03 Britannica "Dragon" [Wayback] · K04 Cleveland API · K05 Iranica JADE iii · K06 Iranica AŽDAHĀ [iddiasız] · K07 Denver Art Museum · K08 Met API · K09 UChicago DSPP · K10 Wikipedia/YARDIMCI [ERISILDI_KISMEN]). Erişilemeyen (kaynak listesine alınmadı, brief'te beyanlı): davidpublisher.com PDF (zaman aşımı), Cambridge UP (2019), Wu Tung 1997, Silbergeld & Wang 2016, Tseng 1957.
- **Resim örneği:** 5 (MFA 17.1697 Chen Rong; Cleveland 1958.427.1 Muqi; Met 1986.345.2; Met 29.100.531; Cleveland 1959.136.1 Sesson). Qing ejder kaftanları (Met 56.210.6 / 52.126.23 / 69.55, Denver 1977.191) **tekstil olduğu için örnek listelenmedi** (Kural 11) — yalnız bağlam notu.
- **Uygulanan dikkat noktaları:** Çin longu ≠ Avrupa ejderi ayrımı metinde açıkça kuruldu [C001][C004], **var olmayan bir Avrupa ejderi ID'si `ilgili_maddeler`'e konmadı**; Muqi atıf/tarih farkı müze müze yazıldı (Cleveland "1220–1280" ↔ Met denemesi "ca. 1210–after 1269" ↔ Met API 16.–17. yy "Korea or possibly Japan") ve hangi rulodan söz edildiği envanterle belirtildi; popüler **"pençe merdiveni" DOGRULANAMADI → yazılmadı** (yalnız doğrulanan iki ayak: Qing kaftan düzeni + Yuan beş-pençe kanonu); **mang terminolojisi kaynaksız olduğu için yazılmadı**; Qianlong kopyası KISMEN düzeyde ve "aktarılır" ihtiyatıyla verildi; mürekkep-sıçratma = yağmur/yağmur çağırma yorumu (Silbergeld & Wang, kitap açılmadı) yazılmadı.
- **CJK politikası:** `龍` yalnız `ozgun_ad` alanında; `alternatif_adlar` Latin harfli (lung, ryū, tatsu). Türkçe anlatı alanlarında, iddia metinlerinde ve eser künyelerinde CJK karakter YOK (eser adları müze kayıtlarındaki İngilizce başlıklarla verildi). Kanıt kayıtlarındaki `pasaj` alanlarında özgün alıntı korunmuştur (bu alan CJK taramasına tabi değildir).
- **Taşınmayan aday iddialar:** C005 (İran aždahā), C009 (nāga çevirisi — tek kaynak/KISMEN), C013 (Yuan/Ming ejder ruloları + Qing kaftan dökümü), C014 (mürekkep sıçratma = yağmur okuması). Hepsi `akademik_tartismalar` içinde kaynak atfıyla izlendi.

### IKO-004 · `vanitas-sembolleri` · `vanitas-naturmort-sembolleri`
- **Dosya:** `ikonografi/IKO-004-vanitas-sembolleri.json` + `kanit-kayitlari/IKO-004.json`
- **10 iddia:** DOGRULANDI 10 · diğerleri 0
- **Tür dağılımı:** YORUM 6 · TEKNIK_TANIM 2 · TARIH 1 · OLGU 1 (simgesel anlam iddialarının çoğu YORUM — brief'in öngördüğü gibi, hepsi kurum/araştırmacı adıyla sahiplendirildi)
- **Kaynaklar:** 14 (K01 Met/Heilbrunn–Liedtke · K02 Met De Gheyn · K03 Met Claesz 1628 · K04 Mauritshuis Claesz 1630 · K05 NG Steenwyck · K06 ARTIC Collier · K07 Britannica · K08 Tate · K09 Smarthistory · K10 JHNA/Grootenboer · K11 Met La Tour · K12 Met portre API · K13 Rijksmuseum [JS_KABUGU] · K14 Bergström/De Jongh/Lammertse [ERISILEMEDI + künye + "metnine erişilmedi"]). Erişilemeyen ayrıca: Amsterdam Museum (404), Cleveland API sorguları (0 sonuç), UvA tezi (konu dışı).
- **Resim örneği:** 7 (Met 1974.1; Met 49.107; Mauritshuis 943; NG1256; ARTIC 2020.317; Met 1978.517; Met 437158). Tate glossary'nin örneği Collier 1696 **envanteri yalnız URL slug'ından alınabildiği için teyitsiz sayıldı ve örnek listesine ALINMADI**.
- **Uygulanan dikkat noktaları:** **Kum saatinin nesne tarihine girilmedi** (mekanizma/üretim/kullanım → NES-002); brief'in negatif bulgusu korundu: incelenen kurumsal tür tanımlarının (Britannica, Tate, NG, Met Heilbrunn) listelerinde kum saati YOK, yalnız Collier 1662 başlığı/metni ve Met portre etiketlerinde var → "kum saati vanitasın standart atribüsüdür" genellemesi KURULMADI [C013][C004]. Nesne-anlam çözümüne karşı tüketim/virtuozite okuması (Harris & Zucker / Grootenboer) `akademik_tartismalar` 1'e ihtilaf olarak işlendi; NG'nin "nesne seçiminin gerekçesinden emin olunamaz" ihtiyatı ve Liedtke'nin "didaktik ↔ conceit" ton farkı da aynı alanda kaynak atfıyla verildi. "Kurukafa = ölüm" türü tür-düzeyi otomatik eşleme yapılmadı; her okuma eser kaydıyla sınırlandırıldı.
- **Taşınmayan aday iddialar:** C006 (Claesz 1628), C008 (Claesz 1630), C009 (Liedtke: didaktik/conceit), C010 (Leiden'lı sanatçılar: genç De Heem, Bailly), C012 (NG yöntem ihtiyatı). C006/C008 içeriği resim örneklerinin `baglam` alanında müze atfıyla; C009/C012 içeriği `akademik_tartismalar` 2–3'te korundu.

### IKO-005 · `ayna` · `kavram-alegorileri`
- **Dosya:** `ikonografi/IKO-005-ayna.json` + `kanit-kayitlari/IKO-005.json`
- **10 iddia:** DOGRULANDI 8 · KISMEN_DESTEKLENIYOR 1 (C016) · **CELISKILI 1 (C003)** · DOGRULANAMADI 0 · HATALI 0
- **Tür dağılımı:** YORUM 6 · OLGU 2 · GELENEKSEL_ANLATI 2 (Ripa)
- **Kaynaklar:** 11 (K01 NG NG186 · K02 Campbell 1998/2021 · K03 NG Technical Bulletin 16 özet · K04 Panofsky 1934 tarama [ERISILDI_KISMEN] · K05 Smarthistory [Wayback] · K06 Met Christus · K07 NGA Titian · K08 Met La Tour · K09 Ripa Iconologia 1603 · K10 NG NG222 [iddiasız] · K11 **ERISILEMEDI** bibliyografik künyeler: Seidel 1989, Carroll 1993, Bedaux 1986, Baldwin 1984, Hall 1994, Schabacker 1972, Dhanens 1980).
- **Resim örneği:** 4 (NG186; Met 1975.1.110; NGA 1937.1.34; Met 1978.517). Prado Werl kanadı (1438) kaydı açılmadığı için **teyitsiz** sayıldı ve örnek listesine alınmadı; NG222 eserde fiziksel ayna olmadığı için alınmadı.
- **Uygulanan dikkat noktaları:** **CELISKILI iddia var → `akademik_tartismalar` dolu ve 40 karakterin çok üzerinde** (7 başlık: Panofsky↔Campbell, aynadaki figürlerin kimliği, aynanın gerçekliği, anlam katmanları, hakikat/sahtelik çok anlamlılığı, teknik bulgu–yorum ayrımı, "Steinberg" düzeltmesi). Bibliyografik-metinsiz kaynaklar (K11) ERISILEMEDI + künye + "metnine erişilmedi" olarak işaretlendi ve hiçbir iddiaya DOGRULANDI desteği vermedi; ilgili adlar metinde yalnız "öne sürmüştür (metnine erişilmedi)" kaydıyla anıldı. **Brief düzeltmeleri uygulandı:** "Steinberg" adı kullanılmadı (doğru ad Linda Seidel, Critical Inquiry 1989); Titian envanteri **1937.1.34 (Andrew W. Mellon Collection)** olarak yazıldı, "Widener" bilgisi hatalı diye işaretlendi. Titian için "en az 30 varyantın en iyi korunmuşu" versiyon uyarısı korundu. Panofsky 1934 yalnız ss. 123–127 görsel okuma ile kullanıldı (ERISILDI_KISMEN) ve hiçbir DOGRULANDI statüsüne dayanak yapılmadı.
- **Taşınmayan aday iddialar:** C002 (van Eyck'in aynadaki figür olduğu iması + imzanın hukuki tanıklık beyanı olmadığı — özü YÖNTEM NOTU'nda), C007 (dışbükey ayna üretimi ve Bruges loncası — kanıt kaydının notlarında belgelendi), C008 (Aziz Bernard: Mesih'in acısı ruhun aynası — `akademik_tartismalar` 4), C010 (Titian — örneğin `baglam`/`versiyon_notu` alanında), C014 (NG222 — KISMEN, K10 negatif bulgu notunda), C015 (Smarthistory durum tespiti — C003 kanıtında ikincil destek).

---

## 2) Çapraz bağlar

**Eklenen (kategori içi, hedef dosyalar diskte var):**
- `IKO-001 ↔ IKO-002` — ortak kanıt: V&A 1479-1902 işlemeli ipek Avalokiteşvara thangkapı; kayıtta lotus kaideleri **ve** "double halo" birlikte belgeli (IKO-001 C011 / IKO-002 C012).
- `IKO-004 ↔ IKO-005` — ortak kanıt: Georges de La Tour, *The Penitent Magdalen* (Met 1978.517); ayna = gösteriş/vanitas, kurukafa = ölümlülük (IKO-004 C014 / IKO-005 C011). Aynı kaynak iki maddede IKO-004-K11 ve IKO-005-K08 kimlikleriyle kayıtlı.

**Eklenemeyen — birleştirme turunda ANA OTURUM eklemeli (hedef dosyalar henüz diskte yok):**

| Kaynak madde | Hedef | Gerekçe / hazır kanıt |
|---|---|---|
| IKO-003 | MIT-005 (`amaterasu`, cin-japon-mitolojisi) | Japon ejder alımlanması: ryū/tatsu (C003) + Sesson Shūkei paravanı (C012). PILOT_SECIM "yalnız kaynak desteklerse" koşulu bu iki kanıtla karşılanıyor. |
| IKO-004 | NES-002 (`kum-saati`) | Kum saatinin nesne tarihi ↔ sembolik anlamı (IKO-004 C004, C013). Nesne tarihi bu maddeye bilinçli olarak alınmadı. |
| IKO-001 | TEK-001 (`fresk`) | Ajanta secco fresk karşılaştırması (IKO-001 C005). |
| IKO-001, IKO-003 | TEK-004 (`murekkep-resmi`) | İpek/kâğıt üzerine mürekkep rulolar (IKO-001 C011 Çin/Japon örnekleri; IKO-003 C011/C012). |
| IKO-002 | `antik-ikonografi` maddesi (henüz planlı ID yok) | Helios/Apollo ışınları ve Roma imparator nimbosu bağlamı (C005, C009). |
| IKO-003 | Avrupa ejderi maddesi (**pilot listesinde yok**) | TAKSONOMI §5.5 gereği ayrı madde; fark açıklaması şimdilik IKO-003 gövdesinde (C001, C004) verildi. |
| IKO-005 | aynanın nesne tarihi maddesi (NES, bu partide yok) | Dışbükey ayna üretimi + Bruges aynacılar loncası (Campbell; brief C007). |

> Not: `ilgili_maddeler` alanlarına YALNIZ diskte var olan ID'ler yazıldı (doğrulayıcı kuralı).
> IKO-003'ün `ilgili_maddeler` listesi bu nedenle şu an **boş**.

---

## 3) Brief yetersizliği nedeniyle YAZILMAYAN bölümler / iddialar

1. **IKO-001:** Lakşmi ile lotus ilişkisi (hiçbir kaynak açılmadı) · Lotus Sutra metnindeki lotus metaforunun birincil kullanımı · Amitabha/Saf Diyar resminde "lotus üzerinde yeniden doğuş" motifi (Met 40448 kaydı doğrulama vermedi) · Budist kullanıma özgü ayrışan anlam farkı (ikinci bağımsız kaynak yok).
2. **IKO-002:** Gotik/Rönesans'ta hâlenin "sönükleşmesi/atlanması" iddiası (okunan pasajlarda birebir alıntılanamadı) · Bizans'ta 6. yy sonrası genelleşme iddiasının ayrıntısı (yalnız CathEnc) · Ravenna/erken mozaik örnekleri (kapsam dışı) · Cambridge UP 2019 bölümü (ücretli duvar).
3. **IKO-003:** Mang/dört pençeli "python" terminolojisi ve Ming/Qing ferman ayrıntıları · "dokuz" sayısının sembolizmi (dokuz oğul vb.) · Chen Rong yazıtının birincil çevirisi · "ejder yağmur getirir/yağmur çağırma ritüeli" okuması · Avrupa ejderi ile karşılaştırmalı ayrı madde.
4. **IKO-004:** Leiden okulu (Bailly, genç De Heem) için müze kayıtlı örnek (Rijksmuseum JS kabuğu) · De Jongh'un emblematik yöntemi ve eleştirisi (birincil metin yok) · kum saatinin Felemenk resmindeki yaygınlığına dair nicel veri (nicel iddia kurulmadı).
5. **IKO-005:** Parmigianino'nun dışbükey ayna otoportresi (KHM Viyana) · Velázquez *Las Meninas* aynası · Ripa dışında ikinci bağımsız "speculum prudentiae" çalışması · Panofsky 1934 ss. 117–122 · NG Technical Bulletin 16 tam metni · Prado Werl kanadı kaydı.

---

## 4) Kalan insan-incelemesi noktaları (öncelik sırasıyla)

1. **IKO-002 resim örneği sayısı (2):** Hristiyan nimbus için ek panel/ikon örneği gerekiyor. Met'in iki adayı (2020.401 Bizans/Haçlı ikonu; 14.40.628 Fra Angelico *The Crucifixion*) API kaydında halo öğesi belgelenmediğinden dışarıda bırakıldı; insan denetimi görselden teyit ederse eklenebilir (künyeler hazır).
2. **IKO-005 C003 (CELISKILI):** Panofsky 1934'ün tam metni (özellikle ss. 117–122) ve Seidel/Carroll/Bedaux/Baldwin/Hall/Schabacker/Dhanens metinleri okunmadan bu ihtilaf "karara bağlanmış" sayılmamalıdır.
3. **IKO-003 Muqi atıf karmaşası:** Cleveland ↔ Met ↔ Met denemesi arasındaki atıf/tarih farkları için ek akademik kaynak (örn. Wu Tung 1997) incelenmeli.
4. **IKO-001 Padmapani çiçeğinin türü:** "lotus" mu "blue lily/utpala" mı — Ajanta üzerine birincil/akademik kaynakla netleştirilmeli.
5. **IKO-004 kum saati:** Tür-düzeyi liste kaynaklarında geçmemesi (negatif bulgu) insan editör tarafından görülmeli; gerekirse madde başlığı/kapsamı ("kurukafa ve kum saati") yeniden değerlendirilmelidir.
6. **Kaynak künyesi eksikleri:** Ramsden 1941 orijinal dergi/sayfa bilgisi; IKO-004-K14 künyelerinin sayfa/baskı ayrıntıları.
7. **Wayback bağımlılığı:** 8 kaynak (IKO-001 K01–K05, IKO-002 K03, IKO-003 K01–K03, IKO-004 K01–K04/K07/K09/K11, IKO-005 K05/K06/K08) canlı erişim 403/429/SSL hatası verdiği için arşiv kopyasından okundu; arşiv tarihleri ilgili `kaynaklar` ve `kanit-kayitlari` kayıtlarında beyan edildi. Yayın öncesi canlı kopyalarla karşılaştırılması önerilir.
8. **Ortak kaynak kütüğü:** `kaynaklar/KAYNAK_KUTUGU.json` bu ajan tarafından oluşturulmadı/güncellenmedi (talimat gereği dokunulmadı); birleştirme turunda ana oturum tarafından üretilmelidir.
