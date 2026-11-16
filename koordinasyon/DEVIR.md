# Sanat Atlası · içerik denetimi — devir ve plan

**Tarih:** 16 Kasım 2026 · **Dal:** `content-review` · **Bu belge yazılırken dalın ucu:** `95b4d72` (son güncelleme `59055f6` sonrası)

Bu belge koordinasyonu devralan oturum içindir. Önceki sohbetlere erişimin yok; bilmen gereken her şey burada.
Emre'ye kısa yaz, her turda **tek** sonraki adım ver, kredi harcamasına dikkat et.

## 1. Durum özeti

Emre, kotası bol olduğu için Qwen'e iki büyük iş ürettirdi; denetim üretime yetişmedi:

| İş | Yer | Boyut | Denetim durumu |
|---|---|---|---|
| Başyapıt dersleri | `basyapit-dersleri/eserler/<id>/` | 107 eser × 7 dosya | 10 eser ChatGPT tarafından kısmen okundu (25 bulgu); 97 eser okunmadı |
| Resim ansiklopedisi pilotu | `resim-ansiklopedisi/` | 20 madde, 65 dosya | Hiç denetlenmedi |

Her eser klasörü: `DERS.json` (künye, iddialar C###, kaynaklar K#), `DERS_BASLANGIC.md` / `DERS_ORTA.md` / `DERS_ILERI.md`,
`SORULAR.json` (10 çoktan seçmeli, 5 doğru-yanlış, 5 açık uçlu, 5 gözlem, 5 tekrar kartı), `KANIT_DOSYASI.md`, `KALITE_KONTROL.md`.
8 klasör QID değil kısa ad taşır (`duccio`, `bosch`, `dali`, `bacon`, `hoch`, `hogarth`, `kauffman`, `domenico-di-michelino`).

**Varılan teşhis:** dersler uydurma değil; Qwen Wikipedia/Wikidata/Commons'tan çalıştı ve iddia–kaynak eşlemesi tuttu.
Sorun *özensiz aktarım*: kaynağın "muhtemelen/atfedilen" dediğini kesinleştirme, tek eser için söyleneni genelleme,
şablonla üretilmiş soru gerekçeleri, tekil dikkatsizlikler. ChatGPT, Qwen'in kendi denetimlerinden sonra bile eser başına ~2,5 hata buldu.

**Kabul edilen standart:** kişisel çalışma uygulaması için Wikipedia kaynağı yeterli. Hedef: (a) dersin kendi içinde tutarlı olması,
(b) kaynağın ihtiyat ifadelerinin korunması, (c) soruların geçerli olması. Müze kataloğuyla tek tek doğrulama hedefi **bırakıldı**.
Dersleri kaynaklardan yeniden kurma fikri de **geri çekildi**; "önce kaynak metni, sonra birebir alıntıya bağlı yazım" yöntemi
yalnız ileride üretilecek yeni içerik için saklı (§8).

## 2. Roller ve değişmez kurallar

- **Koordinatör (sen):** öncelik, yöntem, görev dağılımı, tek ilerleme listesi (§4). Bulguları kendin doğrularsın.
- **Qwen (Qwen Code, Emre'nin Mac'i, Token Plan):** yalnız kesinleşmiş düzeltme listesini uygular; denetim taramalarını *farklı model* seçilerek yapar.
- **ChatGPT:** dış erişim gerektiren denetim (Commons vb.). Şu an açık görevi yok.
- **Emre:** komutları ve raporları taşır; yayın kararını o verir.

Kurallar:
1. Hiçbir modelin "doğrulandı" beyanı kanıt değildir. Her bulgunun alıntısını depoda ara; her düzeltme commit'inin farkını satır satır oku.
2. Modeller birbirinin sohbetini görmez: her komut kendi başına anlaşılır olmalı (depo, dal, commit, kapsam, yasaklar, çıktı biçimi, beklenen dosya sayısı).
3. Her görev **yeni oturumda** verilir (kota + eski bağlamın etkisi). Aynı görevin düzeltmesi aynı oturumda istenir.
4. Qwen'e yeni içerik ürettirme. Aynı işi iki modele yaptırma.
5. Komutlarda değişecek dosya sayısını **sayarak** yaz. (Liste 01'de 6 yazıldı, doğrusu 9'du; Qwen durup sordu.)
6. `tools/` ve `data/sanatcilar.json` içerik alanlarına dokunulmaz (CLAUDE.md).
7. **Uygulamaya ekleme en sonda** (Emre'nin açık talimatı). O zamana kadar `js/`, `css/`, `data/`, `sw.js`, `tests/` değişmez.
8. Mekanik (düzenli ifadeyle yapılabilen) düzeltmeleri modele verme; betikle yap, farkı Emre'ye özetle.

## 3. Araçlar ve ortam notları

- Qwen Code model listesi (Token Plan): `qwen3.8-max`, `qwen3.7-plus`, `qwen3.8-flash`, `deepseek-v4-pro-0813`, `deepseek-v4.1-flash`, `glm-5.3`, `qwen4-max-preview`.
  Düzeltme uygulama: `qwen3.8-max · Medium`. Denetim: dersleri yazan modelden farklı bir model (pilot: `deepseek-v4-pro · Medium`). Extra High kullanma.
- Kota: 16 Kasım'da %57,4 kalmıştı; 13 Aralık 2026'da sıfırlanır. Liste 01 (17 satır) ~800K token harcadı (%87 önbellek). Her görevde Emre'den önce/sonra yüzdeyi iste.
  Ayrıca Qwen 4 API için 1M bedava token var (ayrı kalem; küçük; son kullanma tarihi bilinmiyor).
- Koordinatörün bulut ortamından Commons/Wikipedia'ya erişim **yok**; dış kontrol gerekiyorsa ChatGPT'ye ya da Emre'nin Mac'ine gider.
- Commons API'de dosya başına istek 429 verir; `titles=` ile 50'li toplu sorgu kullanılır.
- Testler: `npm run test:unit` çalışır. E2E için `@playwright/test` kurulu değil; ortamdaki Playwright'a `node_modules/@playwright/test` altında
  küçük bir köprü paket (`export * from '/opt/node-tools/node_modules/playwright/test.mjs'`) yazmak yetiyor.

## 4. Tek ilerleme listesi

### 4.1 ChatGPT'nin 25 bulgusu (ASTRA-001…025)

Alıntıların 22'si depoda yerinde bulundu. Dosyalar depoda değil; Emre'de (`ASTRA_DENETIM/BULGULAR.json`). Özetleri aşağıda.

| Bulgu | Eser | Konu | Durum |
|---|---|---|---|
| 001 | Q3947103 | "kitap (İncil)": kaynak "muhtemelen" diyor | **Kapandı** (Liste 02a) |
| 002 | Q3698260 | Santa Croce c.1265 ile Arezzo c.1268–71 "daha erken" çelişkisi; SORULAR CS09 | **Kapandı** (Liste 02a) |
| 003 | duccio | 213×396 merkez panel ölçüsü "bütün sunak" diye geçiyor | **Kapandı** (Liste 02a) |
| 004 | Q3873247 | 187×182 / 182×187 sıra farkı "uyumlu" denmiş (DERS.json, KANIT, İLERİ) | **Kapandı** (Liste 02a) |
| 005 | duccio | CS09 "neden ağaca tırmanır" yorumu tek doğru cevap | **Kapandı** (Liste 02a) |
| 006 | Q3873247 | "Bulgarini'nin" → "Bulgarini'ye atfedilen" (DERS.json, İLERİ §2) | **Kapandı** (Liste 02a) |
| 007 | Q3873247 | CS09 gerekçesi eser/sanatçı karışıklığı | **Kapandı** (95b4d72) |
| 008 | Q3873247 | İLERİ §7 "sağda yıkama"; yıkama orta panelde | Açık; görsel teyit gerek (ChatGPT beyanı) |
| 009 | Q3873247 | C024/C025 için gösterilen kaynak iddiayı içermiyor | Açık; düşük öncelik |
| 010 | Q979440 | İLERİ §10 "sarayda… vitriniydi" provenans gibi okunuyor | **Kapandı** (Liste 02a) |
| 011 | Q979440 | ORTA §6 "şehrin en pahalı görsel yatırımı" | **Kapandı** (Liste 02a) |
| 012 | Q979440 | atıf ve "kaynaksız" nitelemeleri düşmüş | Açık → Liste 02 |
| 013 | Q2067212 | Lisans PD mi CC BY-SA mı | **Düştü**: ChatGPT'nin iki çıktısı çelişiyor (API "Public domain") |
| 014 | Q2067212 | "geriye doğru eğilir": geriye olan kollar | **Kapandı** (Liste 02a) |
| 015 | Q2067212 | CS10 çeldirici açıklaması belirsiz ölçüyü kesinleştiriyor | Açık → Liste 02 |
| 016 | Q1759631 | Ana görsel orta sahne detayı; gözlem soruları tam kompozisyon istiyor | Entegrasyonda: uygulama kendi görselini gösterir, orada kontrol et |
| 017 | Q1759631 | İLERİ §7 "Roma (memur)" dersin kendi C024'üyle çelişiyor | **Kapandı** (Liste 02a) |
| 018 | Q2378534 | "WD 1500 güvenilmez": aslında "15. yy, 1438–1450" | **Kapandı** (Liste 02a) |
| 019 | Q2378534 | iki ayrı yazıt tek konuma birleştirilmiş (C019, GZ01) | Açık → Liste 02 |
| 020 | domenico | "iki yüzyıl sonra" → 144 yıl | **Kapandı** |
| 021 | domenico | soru gerekçelerinde rol karışıklığı; 1484 üyelik iması | **Kapandı** |
| 022 | domenico | BAŞLANGIÇ sıralaması **kapandı**; İLERİ §7'deki tekrar paragrafları açık (düşük öncelik) | Kısmen |
| 023 | Q546297 | CS08 C "Gözler kapalı değildir" (kapalı) | **Kapandı** (Liste 02a) |
| 024 | Q546297 | CS05 D "Azizler değil" | **Kapandı** |
| 025 | Q546297 | İLERİ §4 "Brera'da göz hizasında asılıdır" (kaynak koşullu) | Açık → Liste 02 |

"Liste 02" adaylarının çoğu ihtiyat ifadesi geri koymak ya da aşırı iddiayı daraltmaktır; ChatGPT'nin kaynak okumasına dayansalar da
düzeltmenin yönü güvenlidir (iddiayı zayıflatır, yeni olgu eklemez). Listeyi yazmadan önce her alıntıyı güncel dosyada bul ve eski→yeni metni birebir ver.

### 4.2 Koordinatörün saydığı sistematik örüntüler (107 eserin tamamı, 8cd236c üzerinde)

| Örüntü | Yaygınlık | Plan |
|---|---|---|
| `SORULAR.json` yanlis_gerekceleri: "X bu soruda doğru değildir; kaynakların doğruladığı yanıt Y." | 18 eser, 183 satır | Betik: "X doğru yanıt değildir; doğru yanıt Y." (asılsız "kaynakların doğruladığı" çıkar) |
| "X bu eserin sanatçısı değildir; doğru sanatçı Y." (soru sanatçı sormasa da) | 8 eser, 22 satır (8'i düzeltildi) | Betik: aynı nötr kalıp |
| `KANIT_DOSYASI.md` içinde "uyumlu" | 6 eser, 10 satır | Taramada tek tek bak (004 türü) |

### 4.3 Lisans taraması (ChatGPT, Commons API; kapandı)

88 uyumlu · 3 uyumsuz (**düzeltildi**: Q3947103 CC BY-SA 4.0 Sailko; Q979440 ve Q1755464 CC0) · 4 kırpık/detay (Q1759631, duccio, Q3705703, Q500242;
yalnız sözcük taraması) · 3 dosya Commons'ta yok (Q1140358, Q1452762, Q185255: `gorsel.url` bozuk) · 9 Commons dışı.
Emre'nin kararını bekleyen: telifli Q175036 (Picasso), dali, bacon, Q1061035 (LACMA) ve yalnız ABD'de kamu malı hoch.
Uygulama ders görsellerini kullanmayacağı için bunlar entegrasyonu engellemez.

### 4.4 Görev günlüğü

| # | Görev | Kim | Sonuç |
|---|---|---|---|
| 1 | Lisans taraması (2 tur) | ChatGPT | Tamam (§4.3) |
| 2 | Düzeltme Listesi 01 (7 madde, 9 dosya) | Qwen 3.8-max | `95b4d72`, farkı satır satır doğrulandı |
| 3 | İç tutarlılık pilotu 01 (10 eser) | deepseek-v4-pro | `59055f6`, tek dosya. 6 bulgu; 12/12 alıntı birebir, 6/6 gerçek (iddia metinleriyle karşılaştırıldı). Yakalama zayıf: bilinen 9'dan yalnız 006 kısmen (İLERİ'deki hâli); iç okumayla bulunabilecek 004 (KANIT C005 "K1 (182×187)" + "uyumlu") kaçtı; diğerleri kaynak/görsel gerektiriyor. 10 eserin 6'sında 0 bulgu. Maliyet: Emre'den bekleniyor |
| 4 | Kalibrasyon: pilot 01'in aynı 10 eseri | glm-5.3 | `180171f`, tek dosya. 10 bulgu, 20/20 alıntı birebir, hepsi gerçek. 004'ü ve 006'yı (DERS.json + İLERİ) yakaladı; deepseek'in 3 D bulgusunu (Q3873247 C010, Q1065493 C020, Q1091086 C007) kaçırdı, deepseek'in kaçırdığı 7'yi buldu. **Kazanan: glm-5.3.** (%44,2 kota değil, oturumun bağlam doluluğuydu) |
| 5 | İç tutarlılık 02 (Q1061035…Q167605, 10 eser) | glm-5.3 | `169ba46`, tek dosya. 76 bulgu, 152/152 alıntı birebir. 68'i D; 6'lık örneklem: teknik olarak doğru ama iddialar sıkıştırılmış not olduğundan "iddiada olmayan ayrıntı" çoğu kez kaynaktan gelen meşru ayrıntı → düşük değer, ayrı ayıklanacak. D dışı 8 bulgu okundu; 7'si gerçek (Liste 02 adayı: #18, 25, 42, 52, 73, 74, 75), #9 önemsiz (E numaralandırması). Kota 53,2 → 49,5 (%3,7/10 eser; GLM alt ajan kullandı) |
| 6 | İç tutarlılık 03 (Q17026577…Q1863885) | glm-5.3 | `6e20967`, tek dosya. 2 bulgu (Q1759631, B), 4/4 alıntı birebir, gerçek. **Yakalama düşük:** bilinen ASTRA-017 (İLERİ:71 "Roma (memur)" ↔ C024 "Romalı değil") daraltılmış D(2) tanımına girdiği hâlde kaçtı; 8 eser 0. Fark: 02'de eser başına alt ajan kullanılmıştı, 03'te kullanılmadı. Aynı oturumda eser başına alt ajanla yeniden tarama istendi | → `b103323` (ek): +6 bulgu, alıntılar birebir (biri yalnız JSON kaçış farkı), okunanlar gerçek (Q1759631 CS10 gerekçesi, "tek duvarda", Q185255 dipnot karışıklığı). Ama commit 5 alt ajan bitmeden atıldı: bulgular yalnız 4 eserden; ASTRA-017 hâlâ yok. Ajanların bitmesi ve ikinci ek commit beklendi | Sonuç: ek 2'de yeni bulgu yok; 03 toplam 8 bulgu, 017'yi koordinatör Liste 02'ye kendisi ekler |
| 7 | İç tutarlılık 04 (Q186953…Q23008305) | glm-5.3 | `fb0d84b`, tek dosya. 16 bulgu, 32/32 alıntı birebir; 14'ü gerçek ve öğrenciye dönük (2 YÜKSEK: "bu eserin sanatçısı değildir" şablonu Raphael ve van Eyck'i kendi eserlerinin sanatçısı değil diye yazıyor), #6 kelime sayısı ve #13 KANIT/KALITE iç notu önemsiz. **Tarama duraklatıldı** (kota planı) |
| 8 | Faz 3 betikli şablon düzeltmesi | koordinatör | Emre onayladı; uygulandı (bu commit): 26 SORULAR.json, 237 satır (222 + 15) → "X doğru yanıt değildir; doğru yanıt Y."; tüm JSON'lar ayrıştı; kalan tek "sanatçısı değildir" (Q4693305 B) meşru, dokunulmadı. Liste 02'ye not: Q186953 CS10 B "Raphael'in kendi doğru yanıt değildir; doğru yanıt Raphael'in değil…" anlamca bozuk, elle yeniden yazılmalı; Q220859 CS06/CS08 ve Q1759631 CS10'da Y kısmı (doğru yanıt) yanlış/ilgisiz olabilir, kontrol et. Kota: 04 sonrası %40,2 (04 = %3,4) |
| 9 | Liste 02a: birebir metin düzeltmeleri (betikle) | koordinatör | Bu commit. Kapanan: ASTRA 001, 002 (CS09 yer sorusuna çevrildi, "daha erken" K1'e bağlandı), 003, 004, 005, 006 (+ aynı hata Q979440'ta), 010, 011, 014, 017, 018, 023. Faz 3 sayesinde kapanan: tarama 04 #0, #8, #9 ve tarama 03 Q1759631 CS10. Açık kalan ASTRA: 008, 009, 012, 015, 016, 019, 022, 025 (ayrıntı Emre'deki BULGULAR.json'da; 025 alıntısı artık bulunamıyor). Sıradaki: Liste 02b (tarama 02–04'ün kalan gerçek bulguları) |
| 10 | Liste 02b: tarama bulguları (betikle) | koordinatör | Bu commit. Düzeltilen: pilot (Q979440 1342, Q2067212 orta-alt, Q1055117 üçüncü sahne), 02 (#18 Madrid sergisi, #25 üç metre, #52 Caillebotte'un, #73–75 nitelemeler), 03 (tek şapelde, 1424 çıkarım, restorasyon aralığı, Hanson dipnot atfı kaldırıldı), 04 (#1 "tek figür" ×3, #2, #3, #4, #5, #7, #11, #14). **Reddedilen:** 02 #42 (Uffizi'deki Daniele Strage'ı ile şapeldeki Alberti Strage'ı ayrı eserler, çelişki yok). **Bırakılan (iç bilgiyle çözülemez/önemsiz):** Q1212937 Samuel 1962↔1963 (kaynak alıntısı 1962, kaynakça 1963), 04 #12 (Q227494 katalog no.), #15, #6, #13; tüm D (etiket) bulguları; Q220859 CS02 "meşe" şıkkı. Açık ASTRA: 008, 009, 012, 015, 016, 019, 022, 025 |
| 11 | İç tutarlılık 05 (kalan listenin 31–40'ı) | glm-5.3 | Komut verildi. **Emre kararı (16 Kasım):** küçük sayı/yıl/ölçü farkları ve niteleme kayıpları artık bulgu değil; tarama yalnız C (soru hataları, TK dahil) + E (farklı kişi/yer/sahne/olay) arar. Düzeltmeleri koordinatör betikle yapar, Qwen kotası yalnız taramaya gider | → `e89ed1e`: 3 bulgu (E), 6/6 alıntı birebir, 3'ü gerçek ve düzeltildi (Q2317837 "by 1879" → "1879'a kadar" yanlış çevirisi ×2; Q2472983 yakın/uzak etkisi ters). 9 eser temiz |
| 12 | İç tutarlılık 06 (kalan listenin 41–50'si) | glm-5.3 | Komut verildi (daraltılmış kapsam) | Kota: 05 sonrası %38,5 (daraltılmış tarama = %1,7/10 eser; kalan 57 eser ≈ %10) |
| 13 | İç tutarlılık 07–11 (son 47 eser) | glm-5.3 × 5 paralel oturum | Komutlar `koordinasyon/TARAMA_KOMUTLARI.md`'de; Emre 06 ile birlikte 6 sekmede paralel çalıştırıyor |
| 14 | Parti 06–08 (paralel, 3 sekme) | glm-5.3 | `3de65c0`, `ad08cc6`, `c04a64c`; 11 bulgu, 22/22 alıntı birebir. Düzeltilen 6: Q285392 CS02 C (Bosch tarihi uydurma), "uyumuna dayanır" ×2; Q3399440 asa konumu (İLERİ + CS06 B); Q3476580 Folkwang gerekçesi; Q3998957 Ariadne'yi terk eden Theseus. Bırakılan 5: düşük/iç not (06#0, 07#3, 08#0, #2, #3). Kota 38,4 → 34,1 (%4,3/30 eser; paralel çalıştırma maliyeti artırmadı) |
| 15 | Parti 09–11 (son 27 eser) | glm-5.3 | `d4ee458`, `ec6e64f`, `9011402`; 19 bulgu, 38/38 alıntı birebir. Yeni şablon ailesi bulundu ve betikle nötrlendi: "bu eserin tekniği/desteği değildir" (42), "bu eserin bulunduğu kurum değildir; doğru yer" (37), "<tarih>, <başka eser>'in tarihidir; bu eserle karıştırılmamalıdır" (10 + Q1755464; uydurma "Bosch 1600" ×5 dahil). Elle düzeltilen: Q512755 "ölümünden itibaren" → "önceki" (YÜKSEK, ×2), Q500985 Spring, Q727875 DY03, Q764831 1809 yönü ×2, bacon CS08 C, domenico Cennet konumu, duccio 43 sahne, hoch Luxemburg. Bırakılan: 09#0, #3, #6, 10#1, #4. Kota 34,1 → 29,7. **Tarama bitti: 107 eserin hepsi tarandı** |

## 5. Plan (baştan sona)

### Faz 1 — Pilotu değerlendir (sıradaki iş)

Emre commit kimliğini getirince: `git fetch`, farkın tek dosya olduğunu doğrula, sonra:
1. **İsabet:** her bulgunun iki alıntısını ilgili dosyada birebir ara (betikle). Bulunmayan alıntı = geçersiz bulgu. Bulunanları oku: gerçekten çelişki mi?
2. **Yakalama:** kalibrasyon eserlerinde ChatGPT'nin bilinen bulgularını buldu mu? Q3873247: 004, 006, 008, 009 · Q979440: 010, 011, 012 · Q2067212: 014, 015. (Bunlar denetçiye söylenmedi.)
3. **Karar:**
   - Alıntıların ≥ %90'ı birebir ve bulguların ≥ %70'i gerçek → Faz 2'ye geç.
   - Altındaysa: komutu daralt ya da modeli değiştir (`glm-5.3`, `qwen4-max-preview`) ve aynı 10 eserde bir kez daha dene.
   - Eser başına gerçek bulgu > 5 ise Emre'ye söyle: yamamak yerine o eserleri elden geçirmek gerekebilir.
4. Maliyeti kaydet (kota yüzdesi farkı / 10 eser) ve 97 eser için tahmini Emre'ye söyle.

Pilot komutunda aranan türler: A sayı/tarih · B kesinleşme · C soru geçerliliği · D kanıt eşlemesi · E iç çelişki. Çıktı biçimi:
`[{eser_id, tur, dosya_1, alinti_1, dosya_2, alinti_2, aciklama, onem}]`; alıntılar tek satırdan, ≤200 karakter, birebir.

### Faz 2 — Taramayı 107 esere yay

- **Maliyet (16 Kasım ölçümü):** iki pilot (deepseek + GLM, 2×10 eser) birlikte kotanın ~%4,2'si (57,4 → 53,2; günlük 28,8M token, %83 önbellek) → ~%0,2/eser; 97 eser ≈ %20. Kota yeter. **Düzeltme:** tarama 02 %3,7/10 eser tuttu → kalan 87 eser ≈ %32; Liste uygulamaları için pay kalsın diye D daraltıldı.
- **Gerçek maliyet (alt ajanlı):** tarama 03 + iki ek turu 49,5 → 43,6 = %5,9/10 eser. 04'ten sonra kalan 67 eser ≈ %27–40 → kota bitmeden hepsi sığmaz. **Karar önerisi:** 04'ten sonra taramayı duraklat, kalan kotayla Liste 02'yi uygulat (en az %15 ayır), kalan taramaları 13 Aralık sıfırlamasından sonra sürdür.
- **Bağlam sınırı:** GLM 10 eserde bağlamın %44'ünü doldurdu; bu yüzden parti boyu **10 eser** (10 oturum).
- Kalan 97 eser, `ls basyapit-dersleri/eserler` sırasıyla (pilot 10 hariç), oturum başına ~20 eserlik partiler (5 oturum; 02: Q1061035…Q1863885); çıktılar `basyapit-dersleri/denetim/IC_TUTARLILIK_02…06.json`.
- Her partiyi Faz 1'deki betikle doğrula; geçersiz alıntı oranı yükselirse parti boyunu küçült.
- Partiler arasında örnekleme: her partiden 3 eserde, taramanın hiçbir şey bulmadığı bir dosyayı kendin oku (kaçırma oranı için).

### Faz 3 — Mekanik düzeltmeler (koordinatör, betikle)

- §4.2'deki iki şablonu tek betikle değiştir; değişen satır sayısını beklenenle (183 + kalan 14) karşılaştır; JSON'ların ayrıştığını doğrula; tek commit.
- Bu, Emre'nin "içerik değiştirme" çekincesine girer: yapmadan önce tek cümleyle haber ver.

### Faz 4 — Düzeltme listeleri (Qwen uygular)

- Liste 02: §4.1'deki açık bulgular. Sonraki listeler: Faz 2'nin doğrulanmış bulguları, eser eser gruplanmış, liste başına ≤ 30 madde.
- Her madde: dosya, yer, **eski metin → yeni metin** birebir. Yeniden yazım gerekiyorsa sınırı ver ("yalnız şu cümle; yeni olgu ekleme; nitelemeyi koru").
- Kapanış kuralları Liste 01'deki gibi: tek commit, push, madde madde UYGULANDI/UYGULANMADI, `git diff --stat`, beklenen dosya sayısı (sayarak yaz).
- Her commit'i satır satır doğrula; ilerleme listesini güncelle.

### Faz 5 — Onay

Bir eser şu üçü sağlanınca "onaya hazır": tarandı · açık YÜKSEK/ORTA bulgusu yok · düzeltme commit'leri doğrulandı.
Hazır eserleri partiler halinde Emre'ye sun; **onay kararı Emre'nin**. Onaylananlar entegrasyonda `data/ders_yayin.json → onayli` listesine girer.

### Faz 6 — Uygulamaya ekleme (en son; Emre "şimdi" diyene kadar başlama)

Altyapı yazıldı ve yama olarak saklandı: `koordinasyon/ders-altyapisi.patch` (95b4d72 üzerine temiz uygulanır: `git apply`). İçeriği:
- `data/ders_yayin.json`: `dersler` (başyapıt anahtarı → ders klasörü, 107 kayıt; 8 kısa adlı klasör `data/basyapitlar.json` anahtarlarına eşlendi) ve `onayli: []`.
- `js/eserDersi.js`: yayın kapısı (`onayli` / geliştirici modunda `taslak` / `kapali` / `yok`), bağımlılıksız Markdown→HTML, soru doğrulama.
- `js/ekranlar/eserDersi.js`: `#/basyapit/<anahtar>/ders` — Başlangıç / Orta / İleri / Sorular sekmeleri, taslak uyarısı, kanıt etiketine dokununca iddia.
- Başyapıt sayfasına "Ders" girişi (yalnız dersi görünür olanlarda), `sw.js`'de dersler için önce-ağ kuralı, sürüm 1.78.5, CSS (`.drs-` öneki), birim + e2e testleri.

Yamayı uyguladıktan sonra yapılacaklar:
1. Testleri **yeniden çalıştır**: sınıf öneki `ed-` → `drs-` değişikliğinden sonra testler koşturulmadı (eski `ed-` öneki mevcut bir bileşenle çakışıyordu);
   tam e2e takımı da yarıda kesildi. Önekten önce 368 birim testi ve 3 yeni e2e testi geçiyordu.
2. `KARARLAR.md`'ye "İş 175" girişi yaz (yamada yok).
3. `.github/workflows/yayinla.yml`: `basyapit-dersleri/` yayına gitmeli (dersler oradan yüklenir) ama içindeki raporlar, `denetim/`, `koordinasyon/`
   ve `resim-ansiklopedisi/` gitmemeli; hariç tutma listesini güncelle.
4. ASTRA-016: gözlem soruları uygulamanın gösterdiği görselle yapılabiliyor mu, 4 "kırpık/detay" eserde kontrol et.
**Emre kararı (16 Kasım):** ders ekranında yalnız **Başlangıç** (varsayılan) + "Daha fazlası" ile **Orta**; İleri çıkarılır (büyük kısmı model çalışma notu). Sorulardan yalnız **tekrar kartları** (TK); çoktan seçmeli, doğru-yanlış, açık uçlu ve gözlem soruları gösterilmez. `[C###]` etiketleri ve "(belirsiz)/(tartışma)/(yorum)" gibi iç notlar ekranda gizlenir. Yamadaki ekran buna göre uyarlanacak.
5. Ertelenen kararlar (Emre'ye sor): dersler konu işlendikçe mi açılsın; `SORULAR.json` aralıklı tekrara bağlansın mı (öneri: ayrı skor anahtarı, mevcut kutulara karışmasın).
6. `main`'e birleştirme ve yayın Emre'nin kararı.

### Faz 7 — Ansiklopedi pilotu (derslerden sonra)

Başlangıç belgeleri: `resim-ansiklopedisi/denetim/ASTRA_PAKETI.md` (540 KB; parça parça oku), `DENETIM_SABLONU.md`, `PILOT_KALITE_RAPORU.md`.
Aynı çapraz model taraması → düzeltme listesi → Emre'nin kararı: 20 maddenin ötesine geçilecek mi?

## 6. Emre'yi bekleyen kararlar

1. Telifli 4 eser + Höch (§4.3): dersleri yayınlansın mı? (Ders ekranı görsel göstermiyor; uygulamanın mevcut telif politikası KARARLAR.md'de.)
2. Faz 3'teki betikli toplu düzeltmeye onay.
3. Faz 6'daki iki tasarım kararı.

## 7. Komut şablonu (her göreve uyarlanır)

```
GÖREV: <ad>. <tek cümle amaç>. <Yasaklar: yeni içerik yok, liste dışına dokunma, internet yok vb.>
Depo: emrymn/sanat-atlasi, dal content-review, başlangıç commit <kimlik>.
Kapsam: <dosyalar / klasörler>
<Maddeler ya da aranacak türler; birebir eski → yeni metin>
Kurallar: <alıntı biçimi, emin değilsen yazma, uygulayamıyorsan uygulama ve nedenini yaz>
Bitince: tek commit ("<ad>"), push; commit kimliği, madde madde durum, `git diff --stat <kimlik>`. Değişen dosya sayısı <N> olmalı; farklıysa commit atma, bildir.
```

## 8. Yeni içerik için saklı yöntem (şimdi uygulanmıyor)

Önce kaynak metinleri (müze sayfası, güvenilir yazı) adres ve tarihle depoya kaydedilir; model yalnız bu dosyalardan yazar; her olgu cümlesine
kaynaktaki özgün cümle birebir alıntı olarak eklenir; bir betik alıntının kaynak dosyasında geçtiğini doğrular; yorum cümleleri ayrı etiketlenir.
