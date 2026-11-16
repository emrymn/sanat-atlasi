# ÜRETİM NOTU (EK) — TARİHSEL NESNE · NES-004 + NES-005

**Üreten ajan:** `ansiklopedi-madde-yazim (nes-b)` — bu not **bağımsız denetim değildir**.
**Tarih:** 2026-11-15 · **Kategori dizini:** `resim-ansiklopedisi/resimlerdeki-nesneler/`
**Kapsam:** YALNIZ NES-004 (`sark-halisi`) ve NES-005 (`zirh`). NES-001/002/003 başka bir ajandadır (`nes-a`) — bu ajan onlara DOKUNMADI.
**Yayın durumu (ikisi de):** `BAGIMSIZ_DENETIM_BEKLIYOR` · **son_guncelleme:** 2026-11-15

> Yeni araştırma YAPILMADI (web erişimi yok). Tüm içerik `.qwen/tmp/ansiklopedi-pilot/nes-b/NES-004-brief.md` ve
> `NES-005-brief.md` dosyalarından üretildi; brief'te kanıtı olmayan hiçbir olgu, tarih, envanter numarası,
> künye veya alıntı eklenmedi. Claim üst sınırı (6–10) nedeniyle brief'lerdeki aday iddiaların bir bölümü
> maddeye taşınamadı; bunlar aşağıda listelendi ve ilgili `akademik_tartismalar` / `uretim_notu` / kaynak
> `notlar` alanlarında kaynak atfıyla izlendi.
> Ana dosya `URETIM_NOTU_TARIHSEL_NESNE.md` (nes-a ajanının) bu ajan tarafından OLUŞTURULMADI/DEĞİŞTİRİLMEDİ.

---

## 0) Doğrulama sonucu

```
.qwen/tmp/venv-dogrula/bin/python resim-ansiklopedisi/dogrula.py --dosya \
  resim-ansiklopedisi/resimlerdeki-nesneler/NES-004-sark-halisi.json \
  resim-ansiklopedisi/resimlerdeki-nesneler/NES-005-zirh.json

→ 13 madde tarandı · 0 HATA · 17 UYARI   (13 = diskteki tüm pilot maddeleri; --dosya filtresi
                                          hataları/uyarıları yalnız bu iki maddeye indirgedi)
```

`dogrula.py --test`: **23/23 geçti** (testler değiştirilmedi).
`DURUM.md`, `GENEL_RAPOR.md`, `kaynaklar/KAYNAK_KUTUGU.json`, `denetim/`, `data/`, diğer kategori
dizinleri (`ikonografi/` vb.) ve uygulama koduna DOKUNULMADI; commit/push yapılmadı.
Yeni oluşturulan tek dizin: `resim-ansiklopedisi/resimlerdeki-nesneler/` (kategori dizini, daha önce yoktu).

### 17 uyarının dökümü (hepsi bilinçli)

**(a) "Hiçbir iddia bu kaynağı kullanmıyor" — 14 uyarı.**

| Kaynak | Neden | Nitelik |
|---|---|---|
| NES-004-K03 (V&A API, Uşak halısı T.71-1914) | Brief C004 claim üst sınırına takıldı; "probably made in Usak" ihtiyatı `akademik_tartismalar` 4 + kaynak notunda | bilinçli |
| NES-004-K06 (Met/Heilbrunn, Venetian Perspective) | Brief C017/C018 claim üst sınırına takıldı; içerik kaynak notunda + `akademik_tartismalar` 11'de | bilinçli |
| NES-004-K09 (Met Collections API) | 4 doğrulanmış resim örneğinin kaynağı; brief C003/C021 üst sınıra takıldı → içerik örnek `baglam` alanlarında | artefakt (dogrula.py uyarıyı örnek kaynaklarını eklemeden önce basıyor) |
| NES-004-K11 (King & Sylvester 1983; Mills 1983) | ERISILEMEDI, yalnız künye + "metnine erişilmedi" | bilinçli |
| NES-004-K12 (Mack, Raby, Rupprich, Ellis, Campbell, Westermann) | ERISILEMEDI, yalnız künye | bilinçli |
| NES-004-K13 (Britannica "rug and carpet") | ERISILEMEDI (canlı 403, Wayback snapshot yok) | negatif bulgu |
| NES-004-K14 (TIEM İstanbul) | JS_KABUGU — içerik okunamadı | negatif bulgu |
| NES-004-K15 (SMB Gemäldegalerie, Georg Gisze) | ENGELLI (503) — eser TEYİTSİZ, örnek listesine alınmadı | negatif bulgu |
| NES-005-K09 (Oakeshott, Funcken, Semper, La Rocca, Lazar) | ERISILEMEDI, yalnız künye (Lazar künyesi kaynakta kırık → tamamlanmadı) | bilinçli |
| NES-005-K10 (metmuseum.org www sayfaları) | ENGELLI (429) — küratoryal metinler okunamadı; essay Wayback'ten, nesne verisi API'den geldi | negatif bulgu |
| NES-005-K11 (Britannica "armour") | ERISILEMEDI (canlı 403, Wayback'te snapshot yok) | negatif bulgu |
| NES-005-K12 (NPG "Ditchley Portrait") | ENGELLI (403) — **zırh portresi DEĞİL**, örnek listesine alınmadı | düzeltme + negatif bulgu |
| NES-005-K13 (resources.metmuseum.org PDF'leri) | ERISILEMEDI (Incapsula bot kabuğu) | negatif bulgu |
| NES-005-K14 (Royal Armouries) | ERISILEMEDI (/collection/ 301; URL tahmini yasağı nedeniyle ilerlenmedi) | negatif bulgu |

**(b) "YORUM türü iddia DOGRULANDI" — 3 uyarı** (NES-004 C008; NES-005 C011, C014).
Brief'ler bu iddialar için DOGRULANDI önerdi; statü ajan tarafından YÜKSELTİLMEDİ (Kural 9).
Bu üç iddiada DOGRULANDI'nın anlamı **yorumun SAHİBİNE aidiyetinin okunan kaynaktan doğrulanmasıdır**
(Denny / Wallace Collection denemesi / Prado kaydında aktarıldığı biçimiyle Panofsky), yorumun içeriğinin
genel kabul olduğu değildir. Hepsi madde metninde "…'ya göre / … savunur / … yorumlar" kalıbıyla
sahiplendirildi ve kanıt kayıtlarının `notlar` alanında ayrıca açıklandı.

**Düzeltilen uyarılar:** ilk koşumda çıkan iki "etiketsiz olgusal cümle adayı (sezgisel)" uyarısı giderildi —
NES-004'te "15. ve 16. yüzyıl" yazımı (doğrulayıcının cümle bölücüsü "15." sonrası boşlukta cümle kesiyordu)
"15.–16. yüzyıl" olarak; NES-005'te "(ör. A24: …)" ve "I. Maximilian" yazımları ("ör." ve "I." kısaltmaları
bölücüde cümle kesiyordu) "(kayıt A24, …)" ve "Maximilian I" olarak düzeltildi. İçerik değişmedi.

---

## 1) NES-004 · `sark-halisi` · `gundelik-yasam-araclari`

- **Dosyalar:** `resimlerdeki-nesneler/NES-004-sark-halisi.json` + `kanit-kayitlari/NES-004.json` (10 kanıt kaydı)
- **10 iddia:** DOGRULANDI 7 · KISMEN_DESTEKLENIYOR 2 (C013, C016) · **CELISKILI 1 (C024)** · DOGRULANAMADI 0 · HATALI 0
- **Tür dağılımı:** OLGU 3 · TEKNIK_TANIM 2 · GELENEKSEL_ANLATI 2 (Holbein/Lotto tip adları) · TARIH 1 · YORUM 1 (Denny) · HIPOTEZ 1 (Gantzhorn)
- **Taşınan iddialar:** C001, C005, C006, C008, C010, C011, C013, C014, C016, C024 (brief'teki 24 adaydan 10'u)
- **Kaynaklar:** 15 — ERISILDI_OKUNDU 5 (NG K01, V&A API K03, Met API K09, Wikipedia K07/K08) · WAYBACK_OKUNDU 4 (K02 Denny arşiv 2026-07-20; K04 Iranica arşiv 2025-05-16; K05 Iranica arşiv 2026-10-23; K06 Met-Venedik arşiv 2026-03-16 — hepsi canlı 403/429) · ERISILEMEDI 4 (K10 Erdmann, K11 King & Sylvester/Mills, K12 Mack vd., K13 Britannica) · JS_KABUGU 1 (K14 TIEM) · ENGELLI 1 (K15 SMB)
- **Doğrulanmış resim örnekleri:** 5 (Holbein *The Ambassadors* NG1314; Giovanni di Paolo *Madonna and Child…* Met 41.190.16; Rubens–Brueghel *The Feast of Acheloüs* Met 45.141; Vermeer *A Maid Asleep* Met 14.40.611; Metsu *The Visit to the Nursery* Met 17.190.20)
- **Örnek listesine ALINMAYAN teyitsiz adaylar (Kural 4):** Georg Gisze (SMB 503, Wayback yok), Lotto *The Alms of St Anthony* (kilise, müze kaydı yok), *The Somerset House Conference* (kaynakta tarih 1604 ↔ 1608 ihtilaflı), Petrus Christus *Virgin and Child Enthroned…* (Städel kataloğu açılmadı). Ayrıca Vermeer *Young Woman with a Water Pitcher* (89.15.21) ve Wheatley *The Saithwaite Family* (2009.357) bu araştırmada müze kaydından doğrulanmadığı için örnek olarak kullanılmadı; içerikleri C016'da ve kaynak notlarında kaldı.
- **Uygulanan dikkat noktaları:**
  - **Adlandırma ihtilafları merkezde:** "Oriental carpet", "Holbein halısı" (tip I–IV), "Lotto halısı / Arabesque Uşak", "Uşak" terimlerinin tümü modern/Avrupalı sınıflandırma olarak yazıldı [C005][C013][C014]; "Lotto halısı"nın Lorenzo Lotto tarafından dokuma/sipariş anlamına GELMEDİĞİ ve Lotto'nun bu tipi resmeden İLK sanatçı OLMADIĞI açıkça belirtildi [C014]. Erdmann tipolojisi birincil monografiden doğrulanamadığı için GELENEKSEL_ANLATI + KISMEN.
  - **Gantzhorn hipotezi CELISKILI** [C024] → `akademik_tartismalar` 13 başlıkla dolu (5.783 karakter). Hipotez kanıt olarak kullanılmadı; aynı wiki bölümündeki atıfsız/tarafgir cümleler (Pazyryk "Ermeni" iddiaları) maddeye ALINMADI.
  - **Ambassadors düzeltmesi uygulandı:** halı ZEMİNDE değil üst rafta/masa üzerinde (NG kaydı); zemin geometrik taş döşeme [C010][C011]. Çelişki kanıt kaydının `celisen_kaynaklar` alanında da belgelendi.
  - **Anlam otomatik atfedilmedi:** servet/güç/kutsallık bağlantısı Denny'nin YORUMU olarak sahiplendirildi [C008]; "halı = zenginlik sembolü" genellemesi kurulmadı; Denny'nin portre-statü ve Ingres/öğrenme-okuryazarlık yorumları (brief C009, C022) iddiaya taşınmadı (örnek 1 `baglam` + `akademik_tartismalar`).
  - **Belirsizlikler korundu:** "olasılıkla Avrupa kopyaları" [C016], "probably made in Usak" (K03 notu + tartışma 4), "y./ca." tarihler, "to judge from paintings" (tartışma 6), "problematic" düğüm terminolojisi (tartışma 5).
  - **ERISILEMEDI kaynaklar hiçbir DOGRULANDI statüsüne dayanak yapılmadı** (Erdmann, King & Sylvester, Mills, Mack, Raby, Rupprich, Ellis, Campbell, Westermann, Britannica, TIEM, SMB).
- **Taşınmayan aday iddialar (14):** C002 (düğüm terminolojisi → tartışma 5), C003 (Met Uşak medium kaydı → K09 notu), C004 (V&A Uşak → K03 notu + tartışma 4), C007 (Giovanni di Paolo halısı → örnek 2 `baglam`), C009 (Denny portre-statü YORUMU → örnek 1 `baglam`), C012 (Ambassadors tip III → örnek 1 `versiyon_notu`), C015 (Lotto yayılım tarihleri → tartışma 6 + K11 notu), C017/C018 (Venedik kanalı, Gentile Bellini → K06 notu + tartışma 11), C019 (Selçuklu/Marco Polo → tartışma 10 + K12 notu), C020 (Dürer mektupları → tartışma 9 + K12 notu), C021 (17. yy Hollanda örnekleri → örnek 3/4/5 `baglam`), C022 (Ingres–Leblanc öğrenme/okuryazarlık → taşınmadı), C023 ("Sacred Ground" → tartışma 8).

---

## 2) NES-005 · `zirh` · `silah-ve-zirhlar`

- **Dosyalar:** `resimlerdeki-nesneler/NES-005-zirh.json` + `kanit-kayitlari/NES-005.json` (10 kanıt kaydı)
- **10 iddia:** DOGRULANDI 9 · **CELISKILI 1 (C006)** · KISMEN 0 · DOGRULANAMADI 0 · HATALI 0
- **Tür dağılımı:** OLGU 5 · TEKNIK_TANIM 2 · YORUM 2 (C011 Wallace, C014 Panofsky/Prado) · TARIH 1
- **Taşınan iddialar:** C001, C003, C006, C007, C009, C011, C013, C014, C016, C020 (brief'teki 24 adaydan 10'u)
  - **BİRLEŞTİRME NOTU:** brief'in C005 (yiv/fluting kronolojisi) ve C006 ("Maximilian zırhı" terim ihtilafı) adayları TEK iddiada (C006) birleştirildi; gerekçe: brief'in C006 metni "bu yivli moda" diyerek C005'e gönderme yaptığı için ayrı taşınsaydı iddia kendi başına anlaşılmayacaktı. Kronoloji K01'den DOGRUDAN desteklidir; ADLANDIRMA üç kaynak arasında ihtilaflı olduğundan iddianın bütününün sonucu **CELISKILI** işaretlendi (brief §5.1 + ana oturum talimatı). Birleştirme kanıt kaydının `notlar` alanında da beyan edildi.
- **Kaynaklar:** 14 — ERISILDI_OKUNDU 5 (Wallace K02/K03, NG K06, Met API K07, Wikipedia K08) · WAYBACK_OKUNDU 3 (K01 Met essay arşiv 2026-02-14; K04 Prado P000410 arşiv 2026-07-18 + sayfa güncelleme tarihi 16-07-2026; K05 Prado P003137 arşiv 2025-06-09 — Prado ve Met canlı 403/429) · ERISILEMEDI 4 (K09 monografiler, K11 Britannica, K13 Met PDF'leri, K14 Royal Armouries) · ENGELLI 2 (K10 metmuseum.org www, K12 NPG Ditchley)
- **Doğrulanmış resim örnekleri:** 4 (Titian *Emperor Charles V at Mühlberg* Prado **P000410**; Rubens *Equestrian Portrait of the Duke of Lerma* Prado **P003137**; Gaspar de Crayer *Philip IV in Parade Armor* Met **45.128.14**; Paolo Veronese *The Family of Darius before Alexander* NG **NG294**)
- **Örnek listesine ALINMAYANLAR:** **Ditchley Portrait KULLANILMADI** (I. Elizabeth'in harita üzerindeki portresi, zırh portresi DEĞİL — düzeltme K12 notu + `akademik_tartismalar` 3); Rembrandt *The Standard Bearer* (kayıt teyitli ama zırh betimi için kaynak yok → brief C018 KISMEN, `akademik_tartismalar` 12f); van Dyck *Thomas Howard, Earl of Arundel* (NPG 403, teyitsiz); Met slider nesne kayıtları (Henry VIII Greenwich garniture 1527, Negroli burgonet 1543 — bunlar resim değil nesne).
- **Uygulanan dikkat noktaları:**
  - **"Maximilian zırhı" terim ihtilafı CELISKILI** [C006]: üç kaynağın konumu ayrı ayrı yazıldı — Met/Breiding "sometimes **erroneously** referred to as 'Maximilian armor'" ↔ Wallace "Maximilian Style" (A24) ↔ ikincil literatür "modern terim, **mümkündür ki** Maximilian I için ilk kez yapılmış" (+ Funcken 1983'ün II. Maximilian'a bağlayan alternatif versiyonu, metnine erişilmedi). Terim maddede tek doğru ad gibi kullanılmadı.
  - **İşlevsel savaş zırhı ↔ tören/temsil zırhı ayrımı maddenin omurgası:** C007 (costume armor tören/şenlik turnuvasında; ama A28 "pratik bir savaş zırhı olarak kalır") + C009 (embossing metali zayıflatır; Piccinino zırhı "neredeyse hiç koruma sağlamaz") — iki bağımsız kurumla (Met + Wallace). "Süslü = işlevsiz" ters genellemesi de kurulmadı.
  - **Anakronizm iki yönlü yazıldı:** NG294 brief'teki bağlamıyla (1560'lar Venedik giysileri; Hephaestion'da y. 1560–90 İtalyan plaka zırhı; İskender'in zırhı antik heykelden türetilmiş ama zincir zırh/kılıç 16. yy) [C020] ↔ Titian'da betimlenen zırhın gerçek bir Helmschmid takımına (y. 1545) bağlanabilmesi [C013].
  - **"Zırh = güç sembolü" genellemesi YAPILMADI:** güç/otorite okuması Wallace Collection denemesinin YORUMU olarak ("belki de güç" ihtiyatıyla) [C011], miles christianus + Roma mirası ikiliği Panofsky'nin (Prado kaydında aktarılan) YORUMU olarak [C014] verildi; Prado'nun kendi düzeltmesi (dinî çağrışımlar siyasî olanlar kadar önemli değildi; 1558 envanteri siyasî terimlerle tanımlar; Aretino'nun önerisi reddedildi) aynı iddiada korunarak iç ihtilaf gizlenmedi.
  - **Brescia alt-iddiası DOGRULANAMADI → madde metnine YAZILMADI** (kaynak bulunamadı); `akademik_tartismalar` 6'da ve C004'ün taşınmama gerekçesinde açıkça belirtildi. Okunan kayıtlarda geçen merkezler (Milano, Augsburg, Innsbruck, Nürnberg, Greenwich) aynı başlıkta listelendi.
  - **Belirsizlikler korundu:** "y. 1420", "olasılıkla … bir soylu için" (A28), "yapılmış görünen / atfedilen" (Piccinino–Alfonso II), "belki de güç" (Wallace), "y. 1560–90", "probably Floris Soop" (örnek listesine alınmadı ama notlarda).
- **Taşınmayan aday iddialar (14):** C002 (malzeme kayıtları "Steel"/"Steel, gold"/"Steel, gold, silver, textile" → tartışma 12a), C004 (Milano DOGRULANDI / Brescia DOGRULANAMADI → tartışma 6 + 12b), C005 (→ C006 içine alındı), C008 (Negroli atölyesi, y. 1530–60 Milano → tartışma 8), C010 (all'antica / "heroic style", "or thought to imitate" → tartışma 7), C012 (zırhçılar "önce sanatçı" + Uccello/Botticelli/Dürer/Burgkmair/Holbein işbirliği → TEK KAYNAK, tartışma 9), C015 (atlı portre öncülleri: Marcus Aurelius, Colleoni, Dürer 1513–14, Burgkmair → tartışma 10), C017 (Crayer → örnek 3 `baglam`), C018 (Rembrandt → tartışma 12f), C019 (17. yy gerilemesi → tartışma 11), C021 (Greenwich Kraliyet Atölyeleri → tartışma 12c), C022 (greaves modern tamamlama uyarısı → tartışma 12g), C023 (Roma tören zırhı bağlamı → tartışma 12e), C024 (heraldik/kalkan sembolleri → tartışma 12d).

---

## 3) Brief yetersizliği nedeniyle YAZILMAYAN bölümler

**NES-004:** (a) Osmanlı saray dokuma atölyeleri (İstanbul) ile Anadolu taşra üretimi ayrımı — kaynak yok; (b) Selçuklu döneminden günümüze kalan halılar (Konya/Alaeddin Camii örnekleri) — TIEM JS kabuğu, kayıt okunamadı; (c) Ghiordes/simetrik düğüm için Anadolu-merkezli kurumsal ikinci kaynak — yok (Iranica + Met kayıtlarıyla yetinildi); (d) İran/Safevi halılarının Avrupa resmine girişinin ayrıntısı — yalnız Denny + ikincil zincir düzeyinde; (e) Lotto halılarının Avrupa'ya yayılım kronolojisi (1516/1526/1560'lar) — tek bibliyografik zincir, kesin anlatıya sokulmadı; (f) halı desen/motif okuması (anlam sembolizmi) — kaynak yok, bu maddenin kapsamı dışında bırakıldı.

**NES-005:** (a) Brescia üretim merkezi — kaynak bulunamadı, YAZILMADI; (b) flüt/yiv tekniğinin İŞLEVSEL açıklaması (sapmaları saptırma, mukavemet) — yalnız K08'de (ikincil, Semper atıflı), tek kaynak → yazılmadı; (c) Crayer *Philip IV in Parade Armor* küratoryal metni — Met www 429, yalnız API başlık/envanter düzeyi; (d) İngiliz portre-zırh geleneği (Greenwich garniture'lerinin portrelere yansıması) — yalnız K01 slider künyesi, derinleştirilmedi; (e) zırh üretim tekniklerinin (dövme, su verme, yemleme/etching, bluing, damascening) ayrıntılı proses anlatımı — K03 okundu ama iddiaya taşınacak kadar ayrıntılandırılmadı (claim üst sınırı); (f) antik Yunan/Roma zırhı — kapsam dışı, yalnız C023'nin taşınmayan bağlam notu olarak tartışma 12e'de.

---

## 4) Çapraz bağlar

**Eklenen:** YOK — her iki maddenin `ilgili_maddeler` alanı şu an **boş**. Sebep: doğrulayıcı kuralı gereği yalnız diskte var olan ID'ler yazılabilir; bu turun yazım aşamasında diskte yalnız IKO-001…IKO-005 (+ eşzamanlı üretilen diğer parti maddeleri) vardı ve aşağıdaki planlı bağların hedefleri henüz oluşmamıştı.

**Planlanıp eklenemeyen bağlar — birleştirme turunda ANA OTURUM eklemeli:**

| Kaynak madde | Hedef | Gerekçe / durum |
|---|---|---|
| NES-004 | IKO-004 (`vanitas-sembolleri`) | Brief'in önerdiği "17. yy Hollanda resminde halı–vanitas" bağı **KURULMADI**: IKO-004'ün diskteki metninde halı/carpet geçmiyor ve K07'nin ilgili pasajı zayıf zincirli. Bağ ancak IKO-004 tarafında halı kanıtı oluşursa (ör. Vermeer/Metsu iç mekânları) kurulmalı; aksi halde spekülatif kalır. |
| NES-004 | NES-001/002/003 (`lavta`, `kum-saati`, `hokka-firca`) | Aynı ansiklopedi; hedef dosyalar bu turun yazım anında diskte yoktu. Ortak kanıt da tespit edilmedi (bağ önerilmez). |
| NES-004 | dini-torensel-nesneler / ilgili IKO maddesi | Halının dinsel resimde "kutsal zemin" işlevi (tartışma 8, KISMEN) bir IKO maddesiyle desteklenirse bağ eklenmelidir. |
| NES-005 | `alegorik-figurler` (Mars betimleri) | Brief'in önerdiği bağ **KURULAMADI**: Velázquez *Mars* (Prado P01211) kaydı açılmadı ve diskte `alegorik-figurler` kategorisinde madde YOK. Kaynakla desteklenmeden bağ kurulmadı. |
| NES-005 | IKO-002 (`nimbus`) | Brief bu hattı ("kutsal şövalye / miles christianus") SPEKÜLATİF bulup önermedi → kurulmadı. |
| NES-005 | NES-001 (`lavta`) vb. | Ortak kanıt yok; bağ önerilmez. |
| NES-004 ↔ NES-005 | — | İki madde arasında anlamlı ortak kanıt yoktur; bağ konmadı. |

---

## 5) Kalan insan-inceleme noktaları (öncelik sırasıyla)

1. **NES-004 C013/C014 tip atıfları:** Erdmann (1965/1970), King & Sylvester (1983) ve Mills (1983) metinleri okunmadan "Holbein tipi I–IV" ve "Lotto halısı" sınıflandırmaları KISMEN düzeyde kalmalıdır; birincil monografilerle doğrulanırsa statü yükseltilebilir.
2. **NES-004 C024 (CELISKILI):** Gantzhorn'ın kendi kitabına ve karşı literatüre erişilmeden bu ihtilaf karara bağlanmış sayılmamalıdır. Kaynak listesine Gantzhorn künyesi brief'te doğrulanmadığı için ALINMADI (uydurma künye yasağı) — insan denetimi künyeyi tamamlamalıdır.
3. **NES-005 C006 (CELISKILI):** "Maximilian zırhı" terimi için hakemli/birincil bir kaynak (Oakeshott 2000 veya La Rocca 2017) incelenmeli; üç kurumun konumu şu an ayrı ayrı kayıtlı.
4. **NES-005 Brescia:** ya kaynakla desteklenmeli ya da tümüyle kapatılmalı (şu an madde metninde YOK, yalnız tartışma 6'da kayıt var).
5. **NES-005 Crayer (Met 436049) ve Rembrandt (Met 437395):** küratoryal metinler 429 nedeniyle okunamadı; resimlerdeki zırh betimi ayrıntısı doğrulanırsa C017/C018 ayrı iddia olarak eklenebilir.
6. **NES-005 Lerma atfı:** Prado'nun sanatçı LİSTESİ sayfası açılıp "Follower of Peter Paul Rubens" iddiası kontrol edilmeli (kayıt sayfası Author: Rubens, Peter Paul).
7. **Erişim engelleri yeniden denenmeli:** Britannica (403 + snapshot yok), TIEM (JS kabuğu), SMB Gemäldegalerie (503), NPG (403), resources.metmuseum.org PDF'leri (Incapsula), Royal Armouries (301 + URL bulunamadı).
8. **Wayback bağımlılığı:** NES-004 K02/K04/K05/K06 ve NES-005 K01/K04/K05 canlı 403/429 verdiği için arşiv kopyasından okundu; arşiv tarihleri `kaynaklar` ve `kanit-kayitlari` kayıtlarında beyan edildi. Yayın öncesi canlı kopyalarla karşılaştırma önerilir (Prado'da sayfa üstü güncelleme tarihi 16-07-2026 ayrıca not edildi; "Room 027/028" konum alanı ödünç durumuna göre değişebilir).
9. **Daniel Walker'a atfedilen "Lotto carpets" makalesi:** varlığı teyit edilemedi (DOGRULANAMADI); künye uydurulmadı ve kaynak listesine alınmadı — insan denetimi bibliyografik doğrulama yapabilir.
10. **Ortak kaynak kütüğü:** `kaynaklar/KAYNAK_KUTUGU.json` bu ajan tarafından oluşturulmadı/güncellenmedi (talimat gereği dokunulmadı); birleştirme turunda ana oturum üretmelidir.
