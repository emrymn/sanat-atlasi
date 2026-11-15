# ÜRETİM NOTU — TARİHSEL NESNE (pilot batch: nes-a, NES-001 … NES-003)

**Üreten ajan:** `ansiklopedi-madde-yazim (nes-a)` — bu not **bağımsız denetim değildir**.
**Tarih:** 2026-11-15 · **Kategori dizini:** `resim-ansiklopedisi/resimlerdeki-nesneler/`
**Kapsam:** NES-001 (lavta), NES-002 (kum saati), NES-003 (hokka-fırça) — 3 madde + 3 kanıt dosyası.
**Yayın durumu (üçü de):** `BAGIMSIZ_DENETIM_BEKLIYOR` · **son_guncelleme:** 2026-11-15
**Not:** NES-004 (sark-halisi) ve NES-005 (zirh) başka bir ajandadır; bu not YALNIZ NES-001..003'ü kapsar (onlar için ayrı EK dosyası kendi ajanında).

> Bu ajan yeni araştırma YAPMADI (web erişimi yok); tüm içerik `.qwen/tmp/ansiklopedi-pilot/nes-a/` altındaki
> üç brief'ten üretildi. Brief'te kanıtı olmayan hiçbir olgu, tarih, envanter numarası, URL veya alıntı eklenmedi.
> Claim üst sınırı (6–10) nedeniyle brief'lerdeki bazı aday iddialar taşınamadı; hepsi aşağıda listelendi ve ilgili
> `uretim_notu` / `akademik_tartismalar` alanlarında da izlendi.

---

## 0) Doğrulama sonucu

```
.qwen/tmp/venv-dogrula/bin/python resim-ansiklopedisi/dogrula.py --dosya \
  resim-ansiklopedisi/resimlerdeki-nesneler/NES-001-lavta.json \
  resim-ansiklopedisi/resimlerdeki-nesneler/NES-002-kum-saati.json \
  resim-ansiklopedisi/resimlerdeki-nesneler/NES-003-hokka-firca.json

→ 0 HATA · 11 UYARI (üçü de kendi maddelerim; başka batch'lerin eksikleri yok sayıldı)
```

`dogrula.py --test`: **23/23 geçti** (testler değiştirilmedi).
`DURUM.md`, `GENEL_RAPOR.md`, `kaynaklar/KAYNAK_KUTUGU.json` (dosya zaten mevcut değil), `denetim/`, `data/`,
diğer kategori dizinleri, uygulama kodu ve `basyapit-dersleri/` DOKUNULMADI; commit/push/deploy yapılmadı.
Yeni oluşturulan tek dizin: `resim-ansiklopedisi/resimlerdeki-nesneler/` (kategori dizini, TAKSONOMI §0).

### 11 uyarının dökümü (hepsi bilinçli, hata değil)

**(a) "Hiçbir iddia bu kaynağı kullanmıyor" — 9 uyarı.**

| Kaynak | Neden | Nitelik |
|---|---|---|
| NES-001-K12 (Met Wayback, Valentin) | yalnız doğrulanmış resim örneğinde kullanılıyor | `dogrula.py` sıralama artefaktı (örnek kaynakları uyarıdan sonra sayılıyor) |
| NES-001-K15 (Liedtke, *Vermeer and the Delft School*, 2001) | `ERISILEMEDI`, bibliyografik künye; alıntılar K10 üzerinden | bilinçli |
| NES-001-K16 (Oxford Bate Collection) | `ERISILEMEDI` (curl HTTP 000/timeout); negatif bulgu | bilinçli |
| NES-002-K10 (academia.edu makalesi) | `ERISILEMEDI` (HTTP 403), yazar/künye doğrulanamadı | bilinçli |
| NES-002-K11 (Library of Congress, Everyday Mysteries) | `ERISILEMEDI` (HTTP 403) | bilinçli |
| NES-002-K12 (National Galleries of Scotland, El Greco NG 1873) | `ERISILEMEDI` (HTTP 403) → örnek listesine ALINMADI | bilinçli negatif bulgu |
| NES-002-K13 (Matthew Champion, *The Fullness of Time*, 2017) | `ERISILEMEDI`, yalnız künye | bilinçli |
| NES-003-K10 (Zhang Wei, *The Four Treasures*, 2004) | `ERISILEMEDI`, Wikipedia atıf zinciri künyesi | bilinçli |
| NES-003-K11 (Dorothy Ko, *The Social Life of Inkstones*, 2017) | `ERISILEMEDI`, yalnız bibliyografik | bilinçli |

**(b) "YORUM türü iddia DOGRULANDI" — 1 uyarı (NES-001-C010).**
Brief bu iddia için DOGRULANDI önerdi; statü ajan tarafından yükseltilmedi (Kural 9). Buradaki DOGRULANDI,
söz konusu okumaların **adı geçen kaynaklara/sahiplerine aidiyetinin** okunan kaynaklardan doğrulanmasıdır
(Hermitage küratöryel metni, Met küratöryel metni, Liedtke→Janson aktarımı, Gowing); içeriğin genel kabul olduğu
değildir. Metinde her okuma sahibine atıfla verildi, kanıt kaydının `notlar` alanında ayrıca açıklandı.
(NES-002 ve NES-003'te yorum ağırlıklı iddialar brief önerisine uygun olarak `KISMEN_DESTEKLENIYOR` ya da
OLGU türünde tutulduğu için bu uyarı oluşmadı.)

**(c) "Etiketsiz olgusal cümle adayı (sezgisel)" — 1 uyarı (NES-002, DENİZCİLİK bölümü).**
Yanlış pozitif: cümle `[C004]` etiketini taşıyor, ancak `cumleler()` bölücüsü "III. Edward" içindeki
"III. " kısaltma noktasında cümleyi ikiye ayırıyor (`ABBR` listesinde Roma rakamı yok). Etiket eklemek
yerine içerik değiştirilmedi; etiketleme kuralı ihlali YOKTUR.

---

## 1) NES-001 'lavta' (`muzik-aletleri`)

**Dosyalar:** `resimlerdeki-nesneler/NES-001-lavta.json` · `kanit-kayitlari/NES-001.json`
**İddia:** 10 · **Tür dağılımı:** OLGU 4 · TARIH 3 · TEKNIK_TANIM 1 · HIPOTEZ 1 · YORUM 1
**Statü dağılımı:** DOGRULANDI 8 · KISMEN_DESTEKLENIYOR 1 · CELISKILI 1 · DOGRULANAMADI 0 · HATALI 0
**Kaynaklar:** 16 kayıt → 14 okundu (9 canlı/API: Met API ×3, Hermitage, V&A, Wikipedia ×2, Essential Vermeer, JHNA; 5 Wayback: Met ×3, NGA, Britannica) · 2 `ERISILEMEDI` (Liedtke 2001 kataloğu; Oxford Bate Collection)
**Doğrulanmış resim örneği:** 6 (Vermeer; Caravaggio *Lute-Player* — **Hermitage versiyonu**; Orazio Gentileschi; Valentin de Boulogne; Caravaggio *The Musicians*; Titian *Venus and the Lute Player* — "Met'teki versiyon" ihtiyatıyla)

**Brief'ten taşınan/taşınmayan iddialar (brief C### → madde C###):**
- brief C001→C001 · brief C003→C002 · brief C005+C007→C003 (birleştirildi: aynı tür/statü/kaynak çifti) · brief C008+C009→C004 (müze **çalgı** koleksiyonları tek OLGU iddiasında) · brief C010→C005 · brief C011 (kayıt+betim kısmı)→C006 · brief C013→C007 · brief C012→C008 (**CELISKILI**) + C009 (**HIPOTEZ**) olarak ikiye ayrıldı · brief C016 + C017'nin negatif bulgu cümlesi→C010.
- **TAŞINMAYAN:** brief C002 (rib tekniği, ~90° burguluk açısı), brief C004 (Endülüs 711 sonrası / Sicilya ve II. Roger'ın 1140 Cappella Palatina tavan resimleri), brief C006 (katgut tel, katgut perde halkaları, chanterelle, 8 koroluda 15 tel) → hepsi **tek YARDIMCI kaynak** (Wikipedia "Lute"); claim üst sınırı ve tek-kaynak durumu gerekçesiyle `akademik_tartismalar` 7–8'e kaydedildi. Rib/malzeme bilgisi kısmen C004 içinde (V&A: 11 figürlü-akçaağaç rib; Met kayıtlarının malzeme alanları) korundu.
- brief C014 (Valentin) ve C015 (*The Musicians*) ayrı claim yapılmadı (üst sınır); içerikleri doğrulanmış resim örneklerinin `baglam`/`versiyon_notu` alanlarında ve C008'in son cümlesinde belgelendi.

**Brief yetersizliği/kapsam nedeniyle YAZILMAYAN bölümler:**
- Genel "müzik-uyum sembolizmi" bölümü **yok** — bağımsız akademik kaynak açılamadı (brief C017). Yalnız üç kaynaklı, eser-özel okuma yazıldı: konser hazırlığı/düet (NGA, Met), kur/flört (Met, Liedtke), çatlak lavta = başarısız aşk (Hermitage).
- Lavta **natürmortu** bölümü yok: Rijksmuseum Claesz *Vanitas Still Life with the Spinario* (SK-A-3930, 1628) brief'te "kayıt metninde lavta betimi doğrulanmadı (teyitsiz)" olduğu için ne örnek ne iddia olarak kullanıldı.
- Grove Music Online (paywall), Oxford Bate Collection (HTTP 000) ve Encyclopaedia Iranica "Barbat"/"ʿŪD" (ikinci kaynak ihtiyacı) açılamadı.

**Çapraz bağ:** `ilgili_maddeler` **BOŞ** — PILOT_SECIM'de NES-001 için planlı bağ yok; ikonografi listesinde lavta/müzik maddesi bulunmuyor; diskte var olan IKO-001..005 ile kaynakla doğrulanmış bir bağ kurulmadı (uydurma bağ yok).

**İnsan incelemesi bekleyen noktalar:** (a) Whitfield'ın *Paragone* 2008 makalesi ve pentimenti kanıtı okunmadı — brief bu gerekçeyi aktarıyor ama alıntılanan pasajda yok, bu yüzden madde metnine olgu olarak yazılmadı; (b) Baglione 1642 birincil kaydı okunmadı (del Monte siparişi "aktarılır" düzeyinde); (c) Caravaggio model kimliği (Montoya ↔ Minniti) kesinleştirilmedi; (d) Vermeer tarihlemesi dört kaynakta dört farklı aralık (Met/Liedtke 1662–63; Wheelock y. 1664; Franits y. 1662–65; Waiboer y. 1662–64, JHNA 9:1, 2017); (e) Waiboer'ın Van Mieris *Woman Playing a Theorbo-Lute* (1663) kompozisyon-kaynağı önerisi HIPOTEZ olarak not edildi, metne alınmadı; (f) Titian'ın Kenwood versiyonu doğrulanmadı; (g) Met API'deki Tieffenbrucker kaydında `objectDate` "late 16th century" ↔ begin/end 1650–1700 iç tutarsızlığı maddeye olduğu gibi yazıldı.

---

## 2) NES-002 'kum-saati' (`bilimsel-aletler`)

**Dosyalar:** `resimlerdeki-nesneler/NES-002-kum-saati.json` · `kanit-kayitlari/NES-002.json`
**İddia:** 10 · **Tür dağılımı:** OLGU 5 · TARIH 2 · TEKNIK_TANIM 1 · HIPOTEZ 1 · YORUM 1
**Statü dağılımı:** DOGRULANDI 8 · KISMEN_DESTEKLENIYOR 1 · DOGRULANAMADI 1 · CELISKILI 0 · HATALI 0
**Kaynaklar:** 13 kayıt → 9 okundu (8 canlı/API: AHS, Gale, Wikipedia ×2, Met API, Rijksmuseum, DIA, Walters, V&A; 1 Wayback: Met küratöryel metin) · 4 `ERISILEMEDI` (academia.edu 403; LoC 403; National Galleries of Scotland 403; Champion 2017 bibliyografik)
**Doğrulanmış resim örneği:** 5 (Moretto da Brescia; Stevers *Vanitas Still Life*; DIA *Saint Jerome in His Study*; Walters *Saint Jerome in His Study*; Lorenzetti *Allegory of Good Government* freski)

**Brief'ten taşınan/taşınmayan iddialar:**
- brief C001+C002→C001 (tanım + imalat tek TEKNIK_TANIM iddiasında; kaynakları örtüşüyor) · brief C004→C002 (ilk belge/köken) **ve** C003 (antikçağ iddiaları, HIPOTEZ/**DOGRULANAMADI**) olarak ikiye ayrıldı · brief C005→C004 · brief C006→C005 · brief C007→C006 · brief C008→C007 · brief C009→C008 · brief C010+C011+C013→C009 · brief C012→C010 (**KISMEN**, teyitsiz özdeşleştirme).
- **TAŞINMAYAN:** brief C003 (dolgu malzemeleri: mermer tozu, kayaç tozu/unu, yuvarlak nehir kumu, ballotini 40–160 mikron cam boncuk; çerçeve malzemeleri: ince ahşap, bambu, reçine, pirinç/bronz/kalay) → **tek kaynak** (Gale) ve modern üretim ağırlıklı; gerekçe `akademik_tartismalar` 10'da. Malzeme bilgisi bunun yerine teyitli müze nesnesi üzerinden verildi (V&A 83-1880: fildişi çerçeve, cam ampuller, ipek sarım).
- Brief C006'nın **çip-log ile hız ölçümü** alt-detayı alınmadı (Wikipedia'da "[citation needed]").

**Dikkat noktalarının işlenişi (brief talimatları):**
- Antikçağ için "yoktu" **DENMEDİ**; kullanılan biçim: "antikçağ kullanımına dair iddialar belgelenememiştir / bunları destekleyen arkeolojik-kayıtsal kanıt ortaya konamamıştır" (C003, HIPOTEZ + DOGRULANAMADI).
- İlk betim tarihi ihtiyatlı: "1338 ya da 1337–1339" birlikte verildi (C002; örnek kaydında "1337–1339 (yaygın tarih: 1338)").
- **SK-A-3930 (Claesz) TUZAĞI:** nesne (cep saati ≠ kum saati) ve koleksiyon karıştırılmadı; Claesz örneği ne örnek listesinde ne metinde kullanıldı, tuzak `versiyon_notu` ve `akademik_tartismalar` 4'te belgelendi (Claesz'ın kum saatli natürmortu Nürnberg/Germanisches Nationalmuseum'dadır).
- **Temperantia özdeşleştirmesi TEYİTSİZ:** figür adlandırılmadı ("kum saati tutan bir figür"); C010 KISMEN_DESTEKLENIYOR.
- **Vanitas sembolizmine girilmedi:** yalnız nesne düzeyinde betim + kurum yorumlarının sahiplendirilmesi; genel çerçeve IKO-004'e bırakıldı.
- Envanter disiplini: Rijksmuseum SK-A-2358 kaydında boyut verilmediği için boyut **eklenmedi**; DIA medyum tanımı birebir korundu ("meşe panel üzerine ketin kâğıtta yağlıboya").

**Brief yetersizliği/kapsam nedeniyle YAZILMAYAN bölümler:** vanitas sembolizminin genel çözümlemesi (IKO-004'ün konusu); Osmanlı/İslam coğrafyasında kum saati (brief'te araştırılmadı → kapsam Avrupa olarak korundu); El Greco *Saint Jerome in Penitence* (NG 1873) örneği (kaynak 403); Lorenzetti freskinin envanter/konum numarası (doğrulanmadı → örnek kaydında `envanter_no` alanı boş bırakıldı).

**Çapraz bağ:** `ilgili_maddeler: ["IKO-004"]` **EKLENDİ** (dosya diskte mevcut: `ikonografi/IKO-004-vanitas-sembolleri.json`; PILOT_SECIM planı IKO-004 ↔ NES-002). **TERS BAĞ (IKO-004 → NES-002) bu ajanın yetkisi dışında** — birleştirme turunda ana oturum eklemelidir (IKO-004 dosyasına dokunulmadı).

**İnsan incelemesi bekleyen noktalar:** (a) Lorenzetti figürü için birincil/kurumsal kaynak (C. Frugoni 1988 veya Palazzo Pubblico kataloğu) — "Temperantia" adı ancak o zaman kullanılabilir; (b) 1345 La George makbuzunun birincil belgesi (Nicolas 1847 / Turner 1993 açılmadı); (c) "sermon glass" ve cep kum saatiyle nabız ölçümü için K02 dışında ikinci kaynak; (d) Balmer (Endeavour 1979 / Technology and Culture 1978) ve Mills-Day-Parkes (EJP 1996) metinleri açılmadı; (e) Rijksmuseum kaydında sanatçı "Stevers" için yaşam tarihi yok, tarih aralığı geniş (1630–1660); (f) V&A O119999 (82-1880) kaydı ayrıca açılmadı → teyitsiz, kullanılmadı; (g) Dürer'in 1514 bakır baskısı kapsam dışı bırakıldı (§11) — baskı sanatı maddesi açılırsa orada işlenmeli.

---

## 3) NES-003 'hokka-firca' (`kitap-yazi-araclari`)

**Dosyalar:** `resimlerdeki-nesneler/NES-003-hokka-firca.json` · `kanit-kayitlari/NES-003.json`
**İddia:** 10 · **Tür dağılımı:** OLGU 4 · TEKNIK_TANIM 3 · TARIH 2 · GELENEKSEL_ANLATI 1
**Statü dağılımı:** DOGRULANDI 7 · KISMEN_DESTEKLENIYOR 3 · DOGRULANAMADI 0 · CELISKILI 0 · HATALI 0
**Kaynaklar:** 11 kayıt → 9 okundu (5 canlı/API: Smithsonian, Wikipedia, Met API ×2, V&A; 4 Wayback: Heilbrunn ×3 + Met küratöryel sayfalar) · 2 `ERISILEMEDI` (Zhang Wei 2004; Dorothy Ko 2017 — ikisi de yalnız bibliyografik künye)
**Doğrulanmış resim örneği:** 3 (Qi Baishi *Scholar's Tools* 1947; Yu Ming *Portrait of Qian Lou* 1932; kimliği belirsiz Japon sanatçı, *Interior Scene with Books and Writing Implements*)

**Brief'ten taşınan/taşınmayan iddialar:**
- brief C001+C003→C001 (hokka + fırça tanımı tek TEKNIK_TANIM iddiasında) · brief C002→C002 · brief C004→C003 · brief C005→C004 (**KISMEN**, tek yardımcı kaynak) · brief C006→C005 (**KISMEN**; brief "DOGRULANDI (duan)/KISMEN (she)" diyordu — dört taşı kapsayan TEK iddia olduğu için en ihtiyatlı düzeye ayarlandı) · brief C007 + İhtilaflar 1 (Ouyang Xiu derecelendirmesi)→C006 (**GELENEKSEL_ANLATI**) · brief C008+C014→C007 · brief C009→C008 · brief C010→C009 · brief C011+C012+C013→C010.
- **TAŞINMAYAN ayrı madde yok**; ancak brief'in aday listesinde olmayan "Kore literati (yangban)" bölümü yazılmadı (Heilbrunn "Yangban" denemesi açılmamıştı) — Kore tarafı yalnız teyitli Met kaydı (19. yy lake hokka kutusu, 2024.337a,b) ve "byeoru" terimiyle sınırlı.

**Dikkat noktalarının işlenişi (brief talimatları):**
- "wenfang sishu / Four Treasures" **iki bağımsız kurumsal kaynakla** doğrulandı (Heilbrunn *Japanese Writing Boxes* + Smithsonian Freer|Sackler) → C003 DOGRULANDI.
- Song dönemi duan/she derecelendirmesi **GELENEKSEL_ANLATI** olarak işaretlendi; özgün metne (Ouyang Xiu) erişilmediği için kesin sıralama cümlesi **kurulmadı**; Baidu Baike kaynaklı jeolojik ayrıntılar kullanılmadı.
- **Xie Huan atıf nüansı korundu:** API (`artistDisplayName: Xie Huan`, `ca. 1437`) ↔ küratöryel metin ("After Xie Huan"; "probably… executed by one of Xie Huan's associates"). **Apricot Garden örneği TEYİTSİZ → KULLANILMADI** (küratöryel metinde hokka/fırça birebir geçmiyor); yalnız `akademik_tartismalar` 3 ve kanıt notlarında belgelendi.
- **CJK politikası:** Çince/Japonca/Korece özgün yazı biçimleri YALNIZ `ozgun_ad` ve `alternatif_adlar` alanlarında; bütün Türkçe anlatı alanlarında (akademik_tartismalar ve kanıt `notlar` dahil) Latin harfli okunuşlar kullanıldı (yan, bi, wenfang sishu, duan, she, suzuri, byeoru). Kanıt `pasaj` alanındaki İngilizce alıntılarda Çince terimlerin geçtiği yerler eliptik (…) olarak kısaltıldı.
- "Hokka" terminoloji tuzağı ilk bölümde açıklandı: Doğu Asya yan/suzuri nesnesi öğütme yüzeyli **taş havan**dır; Avrupa inkwell + tüy kalem geleneği **ayrı kavram** ve kapsam dışıdır.
- Nesne ↔ resim ayrımı korundu: müze nesne kayıtları (Met 7 kayıt + V&A FE.25-1976) ayrı bölüm/iddia (C009), resim örnekleri ayrı (C010).
- Otomatik anlam atfı yapılmadı: Qi Baishi örneğinde yazı araçları **konudur**, sembolik okuma eklenmedi; literati bağlamı yalnız K05 kaynağıyla sınırlı tutuldu.

**Brief yetersizliği nedeniyle YAZILMAYAN bölümler:** klasik dönem (Song-Ming) Çin bilgin portresi örneği (Met dışı bir müzeden teyitli üçüncü tarihsel örnek bulunamadı; mevcut üç örneğin ikisi 20. yy, biri 17. yy Japon ekranı); mürekkep çubuğu üretim/mürekkep hazırlama süreç ayrıntıları (TEK-004'e bırakıldı, C002 düzeyinde tutuldu); National Palace Museum Taipei (Qianlong *Xiqing yanpu* kataloğu, She/Duan hokkaları) birincil doğrulaması.

**Çapraz bağ:** `ilgili_maddeler` **BOŞ bırakıldı** — PILOT_SECIM planı **TEK-004 ↔ NES-003** bağını öngörüyor, ancak `TEK-004` dosyası bu yazım anında **diskte yok** (`resim-teknikleri/` altında yalnız TEK-001 ve TEK-002 mevcut). Kural gereği (ilgili_maddeler yalnız gerçekten var olan ID'ler) bağ EKLENMEDİ; **birleştirme turunda ana oturum iki yönlü olarak eklemelidir** (NES-003 → TEK-004 ve TEK-004 → NES-003). Madde metninde TEK-004'e yönlendirme cümlesi kaynak atfıyla yer alıyor.

**İnsan incelemesi bekleyen noktalar:** (a) Ouyang Xiu'nun özgün metni ve Song derecelendirme geleneği; (b) Zhang Wei (2004) ile Dorothy Ko (2017) metinleri (Ko'nun alt başlığı atıf zincirinde verilmediği için künyede ihtiyat notu düşüldü); (c) she/taohe/chengni taşları için hiyerarşi 1–2 ikinci kaynak (duan Met API kayıtlarıyla teyitli); (d) hokkanın köken derinliği için iki iddia düzeyinin (MÖ 3. yy kazılı örnek ↔ 6.000–7.000 yıl evrim önerisi) arkeolojik kaynakla ayrıştırılması; (e) Kore yangban kültürü için ek kaynak; (f) Met API 1981.120.2a,b kaydında tarih alanı boş / begin-end 1693–1765 iç tutarsızlığı; (g) Japon ekranı için hokkanın görünürlüğü küratöryel metinle teyit edilmedi (yalnız API etiketi "Writing Implements").

---

## 4) Toplu özet

| Madde | İddia | DOGRULANDI | KISMEN | DOGRULANAMADI | CELISKILI | HATALI | Kaynak (okundu/erişilemedi) | Resim örneği |
|---|---|---|---|---|---|---|---|---|
| NES-001 lavta | 10 | 8 | 1 | 0 | 1 | 0 | 14 / 2 | 6 |
| NES-002 kum-saati | 10 | 8 | 1 | 1 | 0 | 0 | 9 / 4 | 5 |
| NES-003 hokka-firca | 10 | 7 | 3 | 0 | 0 | 0 | 9 / 2 | 3 |
| **Toplam** | **30** | **23** | **5** | **1** | **1** | **0** | **32 / 8** | **14** |

**Tür dağılımı (toplam 30):** OLGU 13 · TARIH 7 · TEKNIK_TANIM 5 · HIPOTEZ 2 · YORUM 2 · GELENEKSEL_ANLATI 1.

**Ana oturuma devredilen işler (birleştirme turu):**
1. `IKO-004 → NES-002` ters çapraz bağı ekle (NES-002 tarafı hazır).
2. `TEK-004 ↔ NES-003` çapraz bağını iki yönlü ekle (TEK-004 dosyası oluştuğunda).
3. `kaynaklar/KAYNAK_KUTUGU.json` üretilince bu üç maddenin 40 kaynak kaydını kütüğe işle (şu an dosya yok; `kaynaklar/kutuk_uret.py` mevcut).
4. `DURUM.md` ve `GENEL_RAPOR.md` güncellemesi (bu ajan DOKUNMADI).
5. NES-001 için lavta/müzik ikonografisi maddesi açılırsa (`IKO-`) `ilgili_maddeler` bağı sonradan eklenebilir; şu an kaynakla doğrulanmış bir bağ yok.
