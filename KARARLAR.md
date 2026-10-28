# Kararlar

Tarifte (CLAUDE.md) açık bırakılan ya da yorum gerektiren yerlerde verdiğim kararlar.

## Mimari

1. **Derleme adımı yok.** Düz HTML/CSS ve ES modülleri; GitHub Pages depo kökünü olduğu gibi sunar. Yayın için GitHub Actions gerekmez. `.github/workflows/testler.yml` yalnızca testleri çalıştırır, yayın yapmaz.
2. **Yönlendirme `#/…` (hash) ile.** Pages'te alt yol ve 404 sorunu çıkmaz; tüm yollar göreli. Yerel sunucu (`scripts/sunucu.mjs`) uygulamayı `/sanat-atlasi/` alt yolunda sunar, böylece testler göreli yolları da sınar.
3. **Geri düğmesi** uygulamanın kendi gezinme yığınını kullanır (iOS ana ekran uygulamasında tarayıcı geri düğmesi yok). Yığın boşsa üst sayfaya gider.
4. **Bağımlılık:** çalışma zamanında hiç yok. Testler için yalnızca `@playwright/test` 1.56.1 (sabit sürüm). Birim testleri Node'un yerleşik `node:test`'i ile.
5. **Yazı tipi:** başlık ve okuma metinleri için Google Fonts'tan Literata (service worker önbelleğe alır), yoksa Iowan Old Style / Georgia. Arayüz için sistem sans-serif'i (iPhone'da San Francisco).
6. **Açık tema** renkleri tarifte yoktu: zemin `#FBFAF7`, yüzey `#FFFFFF`, mürekkep `#24201B`, vurgu `#8A5A12`. Koyu temada tarifte olmayan ikincil mürekkep/çizgi/doğru/yanlış renklerini koyu zemine göre açtım.
7. **İkon** özgün: kemerli bir pencere içinde güneş ve tepeler (sepya paleti). `icons/ikon.svg` kaynak, PNG'ler `scripts/ikonlar.mjs` ile üretilir. Maskable sürüm de var.

## Wikidata ve görseller

8. **Doğum yılı doğrulaması:** tarifteki ±3 yıl kuralı yıl hassasiyetindeki tarihler için aynen uygulanır. Ancak antik ve ortaçağ sanatçılarında Wikidata tarihleri çoğu zaman “yaklaşık” ya da yüzyıl hassasiyetinde. Bu yüzden:
   - tarih “yaklaşık” nitelendirmeliyse (P1480) ya da on yıl hassasiyetindeyse ±10 yıl,
   - yüzyıl hassasiyetindeyse ±100 yıl,
   - doğum yılı MÖ olan (antik) sanatçılarda en az ±15 yıl (Emre'nin isteği; Phidias böylece eşleşir).

   Bu genişletme yalnızca sanatçının kendisini doğrulamak için. Eser atfı kuralı değişmedi: eser yalnızca doğrulanmış QID'e P170 ile bağlıysa alınır (P84 “mimar” Aşama 1'de bırakıldı, bkz. 40). Bu kurallarla bile doğrulanamayan sanatçılar tahmin edilmez; listesi aşağıda.
9. **Grup sanatçılar** (Limbourg kardeşler gibi): P31 değeri insan grubu, kardeş grubu, ikili ya da üçlü ise kabul edilir. `dogum` boşsa doğum yılı denetimi yapılmaz.
10. **Kuşkulu atıflar elenir:** yaratıcı iddiasında P5102 (ifadenin niteliği) varsa ve değeri “atıf” (Q230768) değilse (ör. “muhtemelen”, “tartışmalı”) eser alınmaz. Yalnızca en iyi sıradaki (`wdt:`) iddialar kullanılır.
11. **Eser başlığı** sırasıyla `tr`, `en`, `mul` etiketinden. Üçü de yoksa eser atlanır. Yıl P571'in en erkeni.
12. **Önbellek sırası:** IndexedDB kaydı 30 günden yeniyse o kullanılır. Değilse `data/eserler_onbellek.json`'daki kayıt (dosya 30 günden yeniyse) kullanılır. O da yoksa ya da eskiyse canlı sorgu yapılır. Eski bir veri varsa hemen o gösterilir, yenilemesi arka planda yapılır (açılış hiç beklemez). Çevrimdışıyken hiç sorgu yapılmaz.
13. **`data/eserler_onbellek.json`** bu ortamdan Wikidata'ya erişilebildiği için `scripts/onbellek.mjs` ile üretildi ve depoya eklendi. Dosya yoksa uygulama yine çalışır (testi var).
14. **Pekiştirme havuzu:** her sanatçı için ilk 12 eser kullanılır (önce kurs eserleri, sonra Wikidata'da en çok site bağlantısı olanlar). Göz At'ta 40'a kadar Wikidata eseri ve tüm kurs eserleri görünür. Az bilinen eserler soruları gereksiz zorlaştırmasın diye.
15. **Görsel URL'leri:** veride bazı Commons dosya adları zaten `%xx` kodlu (ör. `Hostinn%C3%A9`). İki kez kodlanmasınlar diye önce çözülüp sonra `encodeURIComponent` ile kodlanır.
16. **Görsel açılmazsa** (soru kartında, cevaptan önce) aynı sanatçının başka bir eseri otomatik denenir. Izgarada 400 px küçük görsel açılmazsa 800 px sürümü denenir (çevrimdışı indirme yalnızca 800 px'leri saklar).
17. **Görsel önbelleği ve boyut:** Commons'ın `Special:FilePath` yönlendirmeleri CORS başlığı göndermiyor. Bu yüzden görseller service worker'da “opak” yanıt olarak saklanır ve gerçek boyutları okunamaz. 300 MB sınırı ve LRU silme, görsel başına tahmini boyutla çalışır (400 px ≈ 60 KB, 800 px ≈ 180 KB). Ayarlar ekranı ayrıca tarayıcının bildirdiği toplam kullanımı gösterir.
18. **“Bayatken yeniden doğrula”** görseller için 30 günle sınırlı. Commons dosyaları pratikte değişmediği için her gösterimde yeniden indirilmez, 30 günden eskiyse arka planda yenilenir. Böylece kota ve veri kullanımı korunur.
19. **Çevrimdışı indirme** yalnızca açık sanatçıların pekiştirme havuzundaki görselleri (sanatçı başına ≤12, 800 px) indirir. Hepsi açıkken ≈170 × 12 × 180 KB ≈ 360 MB yapar. Bu 300 MB sınırını aşar; o zaman en eski kullanılanlar silinir.

## Tekrar sistemi ve oturumlar

20. **Oturum uzunluğu** = “günlük kart sayısı”. Tur bitince “Bir tur daha” sunulur; günlük sayı katı bir üst sınır değil, ana sayfada “Bugün X / 20 kart” olarak görünür.
21. **Yeni sanatçı sınırı (günde 8)**, bir sanatçı ilk kez cevaplandığında sayılır. Hazırlanıp gösterilmeyen kartlar sayılmaz.
22. **Kart seçim önceliği:** (1) vadesi gelmiş (küçük kutu önce), (2) zayıf (kutu ≤1 ya da isabet <%60), (3) yeni (doğum yılı sırasıyla, günlük sınır içinde), (4) diğerleri (en uzun süredir görülmeyen önce). Böylece vadesi gelen kart olmasa da pratik yapılabilir.
23. **Vadesi gelmemiş bir kartta doğru cevap** kutuyu ilerletmez (ek pratik, aralıkları bozmasın). Yanlış cevap her zaman kutuyu 0'a indirir.
24. **Yanlış cevap:** sanatçı 3–5 kart sonra aynı oturumda tekrar gelir (başka bir eserle). Bir sanatçı bir oturumda en çok 3 kez tekrar eklenir (sonsuz döngü olmasın).
25. **Karışık kip:** iki ayrı skor tutulur (`sanatci`, `akim`). Kart, iki skordan biri vadeliyse vadeli sayılır. Herhangi bir soru yanlışsa kart oturumda tekrar gelir. Seçim ağırlıkları: vadeli 6, zayıf 4, yeni 3, diğer 1.
26. **“Hepsi, dönem sırasıyla”:** kartlar önce önceliğe göre seçilir, sonra akımların kronolojik sırasına dizilir. Böylece tur yalnızca ilk akımlarda takılı kalmaz.
27. **Görselleri olmayan sanatçılar** (kurs eseri yok, Wikidata doğrulanamadı) pekiştirmeye girmez. Göz At'ta “doğrulanmış görsel bulunamadı” yazar.
28. **Cevap sonrası:** karışık kipte ilk sorunun cevabı hemen renklenir ve altında “Hangi akım?” açılır. Tam geri bildirim ikinci sorudan sonra gelir. Cevaptan sonra seçeneklerde sanatçıların yılları da görünür (karşılaştırarak öğrenmek için). “Nasıl tanırım?” için `taninma` yoksa (kurs sanatçıları) `kurs_notu` gösterilir.
29. **Soru görseli** büyütülebilir. Cevaptan önce görüntüleyicide başlık ve kaynak gizlidir (cevabı ele vermesin).

## Çeldiriciler

30. Tarifteki üç kademeye ek olarak, 3 seçenek hâlâ dolmazsa **zamanca en yakın sanatçılar** yedek olarak kullanılır (her zaman 4 seçenek olsun). Her kademede açık sanatçılar önce gelir. Aynı ada sahip iki kayıt aynı soruda yer almaz.
31. **Tarihi bilinmeyen sanatçılar:** yalnızca ölüm yılı biliniyorsa yaşam 60 yıl varsayılır, yalnızca doğum yılı biliniyorsa da öyle. İkisi de yoksa akımın ortalama orta yılı ±30 alınır.
32. **Akım sorusu:** komşular karışık sırayla alınır (en fazla 3). Kalan seçenekler `sira` farkı en küçük akımlardır.

## Kilit, ilerleme, depolama

33. **Kilitli sanatçılar**, açık bir akımın listesinde gri ve tıklanamaz görünür (“Konu N'de açılır”; ek, sayıya göre: 3'te, 9'da…). Bağlantıyla açılırsa sayfası görünür, ama “Konu N işlenince pekiştirmeye girer” notu çıkar.
34. **İlerleme** localStorage'da (`sanat-atlasi:ilerleme`) tutulur ve IndexedDB'ye yansıtılır. localStorage boşalırsa IndexedDB'den geri gelir. Ayrıca `navigator.storage.persist()` istenir.
35. **Yedek biçimi:** `{uygulama, surum, tarih, ilerleme}` JSON. Geri yüklemede doğrulanır, bozuksa anlaşılır bir Türkçe hata verir, onay ister.
36. **Güncellemeler:** yeni service worker hemen etkinleşir, ama sayfa kendiliğinden yenilenmez (yarım kalan tur kaybolmasın). Bunun yerine “Yeni sürüm hazır · Yenile” bildirimi çıkar. Sürüm çıkarırken `sw.js` içindeki `SURUM` artırılmalı.
37. **Konu 47 ve 61** (“PDF yok”) ile sanatçısı olmayan konular da İlerleme'de işaretlenebilir. Hiçbir şey açmazlar, “sanatçı yok” yazar.

## Testler

38. Uçtan uca testler dış servislere gitmez: Commons görselleri, Wikidata API/SPARQL, Google Fonts ve `eserler_onbellek.json` fikstürlerle yanıtlanır (`tests/fixtures/`). Service worker'ın isteklerini de yakalamak için `PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS=1` kullanılır. Tarayıcı Chromium; iPhone 13 görünüm alanı, dokunma ve kullanıcı ajanı taklit edilir (bu ortamda WebKit yok).

## Wikidata'da doğrulanamayan sanatçılar

`scripts/onbellek.mjs` çalıştırıldığında QID'i doğrulanamayan sanatçılar (tahmin edilmez; varsa yalnızca kurs eserleriyle görünürler):

- **Laokoon heykeltıraşları (Hagesandros, Athenodoros, Polydoros):** Wikidata'da arama sonucu yok ve kurs eseri de yok. Bu yüzden görseli yok, pekiştirmeye girmez; yalnızca Göz At'ta metniyle görünür.

Ayrıca **Francis Bacon** doğru QID'e (Q154340) bağlandı, ama eserleri telif kapsamında olduğu için Wikidata'da görseli (P18) olan eseri yok. Kurs eseri de olmadığından pekiştirmeye girmez.

Daha önce doğrulanamayan iki sanatçı Emre'nin isteğiyle düzeltildi (2026-10-20):
- **Phidias:** Wikidata'da doğum MÖ 490, veride MÖ 480. Antik toleransı (±15) ile eşleşti (Q177302, 12 eser).
- **Tintoretto:** `ad_arama` “Tintoretto” → “Jacopo Tintoretto” yapıldı (veride tek içerik değişikliği; Emre istedi). Asıl ressam bulundu (Q9319, 40 eser).

Önbellek: 169 sanatçı, 5483 Wikidata eseri (sanatçı başına en fazla 40), üretim tarihi 2026-10-20.

## Aşama 1 · Yalnızca resim (2026-10-20)

39. **Ne resim sayılır:** resim (tuval/pano), fresk ve duvar resmi, sunak resmi, panel resmi, triptik/poliptik/diptik, minyatür ve el yazması süslemesi, desen/çizim/karton, gravür/baskı/ahşap baskı/litografi/poster, pastel ve suluboya. Heykel, rölyef, mimari (bina, mimari öğe, mimari plan), mobilya, mozaik, vitray, duvar halısı, sikke çıkarılır. Mozaik, vitray ve duvar halısı listede olmadığı için çıkarıldı.
40. **Wikidata eserleri:** tür, P31'in alt sınıf zinciriyle (P279*) belirlenir. Kurallar `js/wikidata.js` içinde (`RESIM_KOKLERI`, `RESIM_TURLERI`, `RESIM_DISI_KOKLER`):
    - Eser, P31'lerinden biri bir resim kökünün alt sınıfıysa ya da doğrudan bir resim türüyse alınır. Doğrudan resim türleri: resim dizisi, fresk döngüsü, predella, desco da parto, poster…
    - P31'lerinden biri resim kökü taşımayan bir resim dışı türse eser çıkarılır. Örneğin hem sunak hem heykel olan oyma bir sunak çıkar.
    - Bu kökler önbellekteki 5483 eserin 379 farklı P31 sınıfı tek tek incelenerek seçildi. Örneğin “altarpiece” Wikidata'da mobilyanın da alt sınıfı; bu yüzden mobilya yalnızca resim kökü taşımayan sınıflarda eleyici sayılır.
    - Mimar ilişkisi (P84) artık kullanılmıyor. Yalnızca sınıfı bilinmeyen “sanat eseri” gibi genel türler de alınmaz.
41. **Kurs eserleri:** Commons dosyasının Wikidata öğesi iki yoldan arandı:
    - P18 (221 dosyadan 97'si eşleşti),
    - Commons yapılandırılmış verisi “digital representation of” (P6243; 57 dosya daha).
    
    Eşleşen öğe resim türündeyse karar “resim” oldu (122 eser). Eşleşmeyen ya da yanlış öğeye giden dosyalara başlıktan karar verdim. Örneğin Garden of Earthly Delights'ın P6243'ü bir filme, Impression Sunrise'ınki “19. yüzyıl” öğesine gidiyordu. Bu kararlar aşağıdaki tabloda; tamamı `data/eser_turleri.json`'da. `sanatcilar.json` değişmedi; süzgeç uygulama tarafında (`js/resim.js`). Tabloda olmayan yeni bir kurs eseri varsayılan olarak gösterilir.
42. **Gösterilmeyen sanatçılar:** hiç resmi kalmayanlar, Göz At'tan, pekiştirmeden ve yanlış şıklardan otomatik çıkar. Örnekler: Phidias, Donatello, Brunelleschi, Alberti, Michelozzo, Pisano'lar, Arnolfo, Giambologna, Maderno, Soufflot, Jefferson, Garnier, Jean Arp, Max Ernst (resimleri telifli olduğundan Wikidata'da görseli yok), Francis Bacon.
43. **Ana uğraşı heykel ya da mimari olan sanatçılar:** Bernini, Canova ve Rodin'in Wikidata'da birkaç tuval resmi ya da çok sayıda heykel etüdü/deseni var. Palladio, Le Vau, Le Nôtre, Hardouin-Mansart ve Barry & Pugin'de kalanlar mimari çizim. Ghiberti, Cellini ve Greenough'da birer desen ya da vitray tasarımı kalıyor.
    - Bu sanatçıları üslupla tanımak resimden olmaz; Emre de örnek olarak istemişti. Bu yüzden `data/eser_turleri.json` → `ana_ugras_disi` listesiyle gizlendiler.
    - **Bramante kaldı:** Brera'daki *Kolondaki İsa* ve *Herakleitos ile Demokritos* gibi gerçek resimleri var.
44. **Gizlenen akımlar:** resim sanatçısı kalmayan *Antik Yunan ve Roma* ve *Romanesk* Göz At'ta, akım şıklarında ve akım çubuklarında görünmez. Komşu listelerinde geçseler de şık olarak seçilmezler.
45. **Eski önbellekler:** önbellek dosyası `surum: 2` taşır; IndexedDB kayıtları da sürümlüdür. Heykel ve mimari içerebilen eski kayıtlar kullanılmaz, yeniden sorgulanır.
46. **Önbellek** kayıtlı QID'lerle yalnızca resimler için yeniden üretildi (`ESERLER=1 node scripts/onbellek.mjs`): 4862 eser.

### Başlığa göre karar verilen kurs eserleri

| Eser | Karar | Neden |
| --- | --- | --- |
| Phidias · Three Goddesses, Parthenon alınlığı | çıkarıldı | alınlık heykeli |
| Phidias · Parthenon alınlık heykelleri ve “Üç Tanrıça” (Elgin Marbles) | çıkarıldı | alınlık heykelleri |
| Phidias · Parthenon frizi (Panathenaia Alayı) ve metoplar (Lapitler ve Kentaurlar) | çıkarıldı | friz ve metop rölyefleri |
| Phidias · Olympia'daki Zeus heykeli | çıkarıldı | heykel (görsel bir canlandırma) |
| Polykleitos · Canon (Kanōn) – inceleme | çıkarıldı | heykel (Doryphoros) |
| Diotisalvi · Pisa Baptistry (Pisa Vaftizhanesi) | çıkarıldı | mimari |
| Nicola Pisano · Pulpit (Kürsü) – Annunciation and Nativity panosu | çıkarıldı | mermer kürsü, rölyef |
| Nicola Pisano · Pisa Vaftizhanesi kürsüsü (pulpit) | çıkarıldı | mermer kürsü, rölyef |
| Cimabue · Crucifix | resim | boyalı haç (ahşap pano resmi) |
| Duccio di Buoninsegna · Christ's Entry into Jerusalem (Maestà arka yüzü) | resim | Maestà pano resmi (Wikidata eşleşmesi yanlış öğeye gidiyor) |
| Duccio di Buoninsegna · Last Supper (Maestà arka yüzü) | resim | Maestà pano resmi |
| Giotto di Bondone · Lamentation | resim | fresk |
| Giotto di Bondone · Scrovegni Şapeli'ndeki çalışmalar | resim | fresk döngüsü |
| Giotto di Bondone · Last Judgment | resim | fresk |
| Giotto di Bondone · Arena Şapeli (Scrovegni Chapel) freskleri | resim | fresk döngüsü |
| Giotto di Bondone · The Expulsion of the Money Changers | resim | fresk |
| Domenico di Michelino · Dante'yi Divine Comedy ile gösteren resim | resim | pano resmi (Wikidata eşleşmesi sanatçının kendisine gidiyor) |
| Lorenzo Ghiberti · Baptistery of San Giovanni bronz kapıları; Gates of Paradise | çıkarıldı | bronz kapı rölyefleri |
| Lorenzo Ghiberti · Competition Panel, Abraham (İshak'ın Kurban Edilmesi yarışma paneli) | çıkarıldı | bronz rölyef |
| Lorenzo Ghiberti · Competition Panel – Abraham and Isaac (Sacrifice of Isaac) | çıkarıldı | bronz rölyef |
| Lorenzo Ghiberti · The Gates of Paradise (Porta del Paradiso) – Eastern Door | çıkarıldı | bronz kapı rölyefleri |
| Lorenzo Ghiberti · The Story of Jacob and Esau (Gates of Paradise panosu) | çıkarıldı | bronz rölyef |
| Masaccio · The Holy Trinity (fresk) | resim | fresk |
| Donatello · David | çıkarıldı | bronz heykel |
| Donatello · Feast of Herod (vaftiz kurnası rölyefi) | çıkarıldı | bronz rölyef |
| Andrea Mantegna · Camera Picta (Camera degli Sposi) | resim | fresk (Wikidata eşleşmesi bir üslup öğesine gidiyor) |
| Leon Battista Alberti · Palazzo Rucellai | çıkarıldı | mimari |
| Filippo Brunelleschi · Competition Panel, Abraham (İshak'ın Kurban Edilmesi yarışma paneli) | çıkarıldı | bronz rölyef |
| Pietro Perugino · Christ Giving the Keys to Saint Peter | resim | fresk |
| Albrecht Dürer · Adam and Eve (Adem ile Havva) | resim | gravür (Wikidata eşleşmesi bir çevrim içi sergiye gidiyor) |
| Albrecht Dürer · Alberti's Veil / perspektif aletleri diyagramları | resim | ahşap baskı |
| Quentin Metsys · The Moneylender and His Wife | resim | pano resmi |
| Hans Baldung Grien · Aristotle and Phyllis | resim | ahşap baskı (Wikidata eşleşmesi bir edebî konuya gidiyor) |
| Hans Baldung Grien · The Bewitched Groom (Büyülenmiş Seyis) | resim | ahşap baskı |
| Hieronymus Bosch · Garden of Earthly Delights | resim | triptik (Wikidata eşleşmesi bir filme gidiyor) |
| Leonardo da Vinci · Vitruvian Man | resim | desen |
| Leonardo da Vinci · The Virgin and Child with Saint Anne | resim | pano resmi |
| Leonardo da Vinci · Anatomi çalışmaları (defter sayfaları) | resim | desen |
| Leonardo da Vinci · Uçan makine ve paraşüt çizimleri | resim | desen |
| Leonardo da Vinci · The Virgin and Child with Saint Anne için cartoon (hazırlık çizimi) | resim | pano resmi |
| Michelangelo · Sistine Şapeli tavanı | resim | fresk |
| Michelangelo · Aziz Petrus kubbesi | çıkarıldı | mimari |
| Michelangelo · San Lorenzo kütüphane girişi (vestibül) ve merdiveni | çıkarıldı | mimari |
| Michelangelo · Medici mezarları için heykeller | çıkarıldı | heykel |
| Michelangelo · Sistine Şapeli tavanı ve The Last Judgment (Son Yargı) | resim | fresk |
| Michelangelo · San Lorenzo kütüphanesi ve New Sacristy | çıkarıldı | mimari |
| Michelangelo · David | çıkarıldı | mermer heykel |
| Michelangelo · San Lorenzo kütüphanesi merdiveni | çıkarıldı | mimari |
| Michelangelo · Pietà | çıkarıldı | mermer heykel |
| Michelangelo · Tomb of Julius II (II. Julius'un Mezarı) | çıkarıldı | mezar anıtı, heykel |
| Michelangelo · Moses (Musa) | çıkarıldı | mermer heykel |
| Michelangelo · Ignudi | resim | fresk figürleri |
| Michelangelo · San Lorenzo Kütüphanesi | çıkarıldı | mimari |
| Raphael · The School of Athens (Atina Okulu) | resim | fresk |
| Donato Bramante · Tempietto | çıkarıldı | mimari / mimari plan |
| Donato Bramante · Yeni Aziz Petrus Bazilikası (St. Peter's Basilica) | çıkarıldı | mimari / mimari plan |
| Donato Bramante · St. Peter's Basilica | çıkarıldı | mimari / mimari plan |
| Donato Bramante · St. Peter's için özgün central plan (merkezî plan) | çıkarıldı | mimari / mimari plan |
| Marcantonio Raimondi · The Judgment of Paris (baskı) | resim | gravür |
| Daniele da Volterra · Bust of Michelangelo | çıkarıldı | büst |
| Andrea Palladio · Teatro Olimpico (Olympic Theatre) | çıkarıldı | mimari |
| Andrea Palladio · Villa Rotonda (Villa Capra) | çıkarıldı | mimari |
| Andrea Palladio · San Giorgio Maggiore | çıkarıldı | mimari |
| Carlo Maderno · Uzatılmış nef ve Barok ön cephe | çıkarıldı | mimari |
| Gian Lorenzo Bernini · Baldacchino | çıkarıldı | heykel / mimari |
| Gian Lorenzo Bernini · Aziz Petrus Meydanı'nın kavisli sütun dizileri (colonnades) | çıkarıldı | heykel / mimari |
| Gian Lorenzo Bernini · Ecstasy of St Teresa | çıkarıldı | heykel / mimari |
| Gian Lorenzo Bernini · Cardinal Scipione Borghese portresi | çıkarıldı | heykel / mimari |
| Gian Lorenzo Bernini · Louis XIV'ün atlı heykeli için kil model | çıkarıldı | heykel / mimari |
| Gian Lorenzo Bernini · David | çıkarıldı | heykel / mimari |
| Gian Lorenzo Bernini · Self Portrait | çıkarıldı | heykel / mimari |
| Gian Lorenzo Bernini · Cornaro Chapel | çıkarıldı | heykel / mimari |
| Gian Lorenzo Bernini · Ecstasy of Saint Teresa | çıkarıldı | heykel / mimari |
| Gian Lorenzo Bernini · St. Peter's kolonadı ve St. Peter's Square (Piazza San Pietro) | çıkarıldı | heykel / mimari |
| Gian Lorenzo Bernini · Cathedra Petri (Chair of St. Peter) | çıkarıldı | heykel / mimari |
| Artemisia Gentileschi · Judith Slaying Holofernes | resim | tuval resmi |
| André Le Nôtre · Versailles bahçeleri ve South parterre | çıkarıldı | bahçe düzenlemesi |
| Nicolas Poussin · Bacchanal Before a Statue of Pan | resim | tuval resmi |
| Jean-Baptiste-Siméon Chardin · Self Portrait at the Easel (pastel otoportre) | resim | pastel |
| William Hogarth · Gin Lane | resim | gravür (Wikidata eşleşmesi bir salgın öğesine gidiyor) |
| William Hogarth · A Harlot's Progress (baskı serisi) | resim | baskı serisi (Wikidata eşleşmesi bir kişiye gidiyor) |
| William Hogarth · A Rake's Progress | resim | baskı serisi |
| Jacques-Louis David · The Death of Socrates | resim | tuval resmi (Wikidata eşleşmesi akım/yıl öğelerine gidiyor) |
| Jacques-Louis David · Madame Récamier | resim | tuval resmi |
| Angelica Kauffman · Cornelia, Mother of the Gracchi (slaytta: Cornelia Pointing to Her Children as Her Treasures) | resim | tuval resmi |
| Thomas Jefferson · Monticello | çıkarıldı | mimari |
| Horatio Greenough · George Washington | çıkarıldı | heykel |
| William Blake · Europe: A Prophecy, frontispiece (slaytta: God as the Divine Geometer) | resim | el boyaması kabartma baskı |
| Henry Fuseli · The Nightmare (iki versiyon) | resim | tuval resmi |
| Francisco de Goya · The Sleep of Reason Produces Monsters (El Sueño de la Razon Produce Monstruos), Los Caprichos 43. levha | resim | gravür |
| Francisco de Goya · The Disasters of War (baskı serisi) | resim | gravür serisi |
| Francisco de Goya · The Third of May, 1808 | resim | tuval resmi |
| Jean-Auguste-Dominique Ingres · Jupiter and Thetis | resim | tuval resmi |
| Jean-Auguste-Dominique Ingres · Portrait of Paganini | resim | desen |
| Charles Garnier · Paris Opéra (Palais Garnier) | çıkarıldı | mimari |
| Charles Garnier · Paris Opéra'nın büyük merdiveni (Grand Staircase) | çıkarıldı | mimari |
| Edgar Degas · The Morning Bath | resim | pastel |
| Claude Monet · Impression, Sunrise (Impression, Soleil Levant) | resim | tuval resmi (Wikidata eşleşmesi yüzyıl/sergi öğelerine gidiyor) |
| Claude Monet · Giverny'deki bahçe, nilüferli havuz ve Japon tarzı köprü | resim | tuval resmi (Japon köprüsü) |
| Claude Monet · Water Lilies (Nymphéas) serisi | resim | tuval resmi |
| Pablo Picasso · Guernica | resim | tuval resmi |

## Aşama 2 · Yeni kaynaklar ve daha iyi görseller (2026-10-20)

47. **Kaynaklar (anahtarsız, açık lisanslı):**
    - **The Met Collection API:** `isPublicDomain`; arama uç noktası v1.1, 2026-10-01'de v1'in yerini aldı.
    - **Art Institute of Chicago API:** `is_public_domain`, görsel IIIF.
    - **Cleveland Museum of Art Open Access:** CC0.
    - **National Gallery of Art açık verisi:** GitHub'daki CSV'ler, görsel IIIF.
    - **Wikimedia Commons “Paintings by …” kategorileri.**
    
    Toplama derleme zamanında yapılır (`scripts/onbellek.mjs`, `scripts/kaynaklar/`). Telefon müze API'lerine hiç gitmez, yalnızca görselleri indirir.
48. **Sanatçı eşleşmesi:**
    - Met ve NGA kayıtları sanatçının Wikidata QID'ini taşıyor; doğrudan QID ile eşlenir.
    - AIC ve Cleveland ad ile doğum yılı (±3) üzerinden eşlenir. Ad olarak `ad`, `ad_arama` ve Wikidata'daki İngilizce etiket ile diğer adlar kullanılır. Doğum yılı bilinmiyorsa eşleşme yapılmaz.
49. **Yalnızca doğrudan atıf:** yaratıcı satırında “Workshop of, Circle of, Follower(s) of, Attributed to, Copy (after), after, School of, Manner/Style of, Imitator, Pupil, Assistant, possibly, probably, formerly, or” geçen eserler alınmaz.
    - Met'te `artistPrefix` dolu, NGA'da `prefix` dolu ya da Cleveland'da `qualifier` dolu olanlar da alınmaz.
    - Eser yılı sanatçının çalışma hayatı dışında kalıyorsa (doğum+10'dan önce, ölüm+5'ten sonra) alınmaz. Örneğin Raffaello'dan 1787 tarihli bir röprodüksiyon gravürü bu yüzden elendi.
    - Yalnızca resim, desen, baskı, minyatür, pastel ve suluboya sınıfları alınır.
50. **Kopyaların birleştirilmesi:** önce Wikidata'daki müze kimlikleriyle eşleştirilir (Met P3634, AIC P4610, Cleveland P11110, NGA P4683). Sonra başlık, tarih (±5 yıl) ve müze birlikte karşılaştırılır.
    - Başlık İngilizce etiket ya da parantez içi/dışı biçimlerden biriyle tutmalı.
    - Bilinmeyen tarih ya da müze eşleşmeye engel değildir.
    - Wikidata öğesi bilinmeyen kurs eserleri de bu yolla Wikidata eseriyle birleşir. Leonardo'nun *Azize Anna*'sı ile Raffaello'nun *Atina Okulu* böylece tek kayda indi ve daha iyi görsellerini aldı.
51. **Görsel önceliği:**
    - müzenin resmi taraması (Met, AIC, Cleveland, NGA) > Commons'ta Google Art Project (80) > müze kaynaklı Commons (WGA, Met DP, Rijksmuseum, Yorck…; 70) > diğer Commons (50) > “fotoğraf gibi” (10) > elle “kötü” (5).
    - Dosya adında *frame, framed, in situ, exhibition, taken at, panoramio, DSC/IMG* geçenler ya da kurum adı olmayan bir *gallery/galleria* geçenler otomatik olarak “fotoğraf gibi” sayılır ve sona atılır.
52. **Sanatçı başına en fazla 60 eser:** kurs eserleri önce, sonra bilinirlik sırası (Wikidata site bağlantısı, müzenin öne çıkardıkları, birden çok kaynakta bulunma). Bir müzeden sanatçı başına en çok 25 yeni eser eklenir. Commons kategorilerine yalnızca 12'den az eseri olan sanatçılarda bakılır, ve yalnızca müze/Google Art Project taramaları alınır; kategorilerde kartpostal ve sergi fotoğrafı çok.
53. **Gözle denetim:** kurs eserleri ve her sanatçının ilk 15 eserinde, en iyi görseli müze taraması ya da Google Art Project olmayan 1795 Commons görseli temas sayfalarında tek tek incelendi.
    - 87'si “kötü” işaretlendi: pekiştirmede kullanılmaz, galeride sona iner.
    - 15'i “çıkar” işaretlendi: hiç gösterilmez.
    - Kararlar `data/gorsel_kararlari.json`'da, liste aşağıda.
    - 7 görsel indirilemediği için gözle denetlenemedi. Bunlar: Uccello *Aziz Yorgi*, van der Weyden 013.1, La Tour 038, Hals 042, Hiroshige *Ani sağanak*, Puvis *Umut*, Kirchner *Veda*.
54. **20. yüzyıl sanatçıları:** Dalí, Miró, Magritte, Duchamp, Höch, Man Ray, Picasso ve Nolde'nin eserlerinin çoğu hâlâ telifli. Bu yüzden açık kaynaklarda düz taramaları yok; Commons'ta yalnızca sergi, duvar ve bina fotoğrafları var. Bunların çoğu “kötü” ya da “çıkar” oldu.
    - Dalí ile Miró'nun pekiştirmeye uygun görseli kalmadı. Göz At'ta görünürler ama kartlara girmezler.
    - **İleride:** bu sanatçılar için telifli ama eğitim amaçlı gösterime izin veren bir kaynak (ör. WikiArt) eklenebilir. Lisans koşulları ayrıca incelenmeli.
55. **“Görsel kötü” düğmesi** tam ekran görüntüleyicide. Basınca eserin sıradaki en iyi görseline geçilir.
    - Tercih cihazda ilerleme nesnesinde (`kotuGorseller`) saklanır ve yedeğe girer.
    - Başka görsel kalmadıysa eser pekiştirmeden çıkar ve bu bir mesajla söylenir.
    - Soru kartında görsel reddedilirse kart yeni görselle yeniden çizilir.
56. **Lisans gösterimi:** müze görsellerinde “CC0” ve kaynak sayfası bağlantısı, Commons'ta dosya sayfası bağlantısı gösterilir. Kurs eserlerinin lisansı veriden gelir.
57. **Anahtar isteyen kaynaklar (ileride):** Rijksmuseum, Harvard Art Museums, Smithsonian Open Access (api.data.gov anahtarı), Europeana ve Brooklyn Museum. Bunlar eklenmedi.
58. **Ham yanıt önbelleği** `scripts/.ham/` altında tutulur (git'e girmez). Yeniden üretim birkaç dakikada, ağa gitmeden biter.
59. **Giambologna ve Soufflot** müzelerden yalnızca birer çizim kaldığı için (bir heykel etüdü ve bir kilise çizimi) “ana uğraşı resim değil” listesine eklendi.

Toplam: 134 görünür sanatçıda 6380 eser. Kaynaklar: Wikidata 4712, kurs 171, Met 1013, AIC 396, Cleveland 186, NGA 341, Commons kategorisi 6; bir eser birden çok kaynakta olabilir.

### Sanatçı başına eser sayısı

- **Gotik:** Bonaventura Berlinghieri 5 · Cimabue 33 · Duccio di Buoninsegna 41 · Simone Martini 40 · Pietro Lorenzetti 43 · Ambrogio Lorenzetti 38
- **Proto-Rönesans:** Giotto di Bondone 50
- **Uluslararası Gotik:** Limbourg kardeşler 26 · Gentile da Fabriano 40
- **Erken Rönesans:** Domenico di Michelino 14 (11 pekiştirmede) · Masaccio 32 · Andrea Mantegna 60 · Piero della Francesca 39 · Fra Angelico 43 · Paolo Uccello 36 · Sandro Botticelli 44 · Pietro Perugino 51
- **Kuzey Rönesansı:** Albrecht Dürer 60 · Robert Campin 29 · Jan van Eyck 39 · Petrus Christus 33 · Quentin Metsys 36 · Rogier van der Weyden 41 · Hans Baldung Grien 60 · Lucas Cranach (Yaşlı) 60 · Hans Holbein (Genç) 60 · Hieronymus Bosch 41 · Pieter Bruegel (Yaşlı) 53
- **Yüksek Rönesans:** Leonardo da Vinci 49 · Michelangelo 48 · Raphael 48 · Donato Bramante 5 · Correggio 47 · Marcantonio Raimondi 60
- **Venedik Rönesansı:** Titian 50 · Giovanni Bellini 51 · Giorgione 38 · Tintoretto 53 · Paolo Veronese 50
- **Maniyerizm:** Jacopo Pontormo 41 · Francesco Salviati 50 · Sofonisba Anguissola 40 · Daniele da Volterra 17 · Parmigianino 60 · Agnolo Bronzino 45 · El Greco 46 · Rosso Fiorentino 33 · Giulio Romano 51
- **İtalyan Barok ve Caravaggizm:** Annibale Carracci 60 · Caravaggio 45 · Georges de La Tour 38 · Artemisia Gentileschi 41 · Orazio Gentileschi 40
- **İspanyol Barok:** Diego Velázquez 47 · Francisco de Zurbarán 43
- **Flaman Barok:** Peter Paul Rubens 60 · Anthony van Dyck 60
- **Hollanda Altın Çağı:** Rembrandt van Rijn 60 · Frans Hals 56 · Johannes Vermeer 36 · Jan Steen 40 · Jacob van Ruisdael 60
- **Fransız Klasisizmi:** Charles Le Brun 48 · Hyacinthe Rigaud 41 · Nicolas Poussin 59 · Claude Lorrain 60
- **Rokoko:** Jean-Antoine Watteau 60 · François Boucher 60 · Jean-Honoré Fragonard 60 · Giovanni Battista Tiepolo 60 · Jean-Baptiste-Siméon Chardin 38 · Jean-Baptiste Greuze 60 · William Hogarth 60 · Canaletto 60 · Thomas Gainsborough 60
- **Neoklasisizm:** Benjamin West 60 · Jacques-Louis David 60 · Angelica Kauffman 57 · Élisabeth Vigée Le Brun 45
- **Romantizm:** William Blake 60 · Henry Fuseli 60 · Caspar David Friedrich 51 · John Constable 60 · Eugène Delacroix 60 · Francisco de Goya 60 · J. M. W. Turner 60 · Théodore Géricault 60
- **Prerafaelitler:** Dante Gabriel Rossetti 52 · John Everett Millais 57 · William Holman Hunt 50
- **Akademizm ve Oryantalizm:** Jean-Auguste-Dominique Ingres 60 · Jean-Léon Gérôme 60 · William-Adolphe Bouguereau 50 · Alexandre Cabanel 47
- **Barbizon ve Realizm:** Honoré Daumier 60 · Gustave Courbet 60 · Camille Corot 60 · Jean-François Millet 60 · Théodore Rousseau 60
- **Empresyonizm:** Gustave Caillebotte 46 · Édouard Manet 60 · Edgar Degas 60 · Mary Cassatt 60 · Berthe Morisot 60 · Claude Monet 60 · Pierre-Auguste Renoir 60 · Camille Pissarro 60 · Alfred Sisley 60
- **Ukiyo-e (Japon baskısı):** Utagawa Hiroshige 60 · Katsushika Hokusai 60
- **Post-Empresyonizm:** Paul Cézanne 60 · Georges Seurat 60 · Paul Signac 60 · Vincent van Gogh 60 · Henri de Toulouse-Lautrec 60 · Paul Gauguin 60
- **Sembolizm:** Gustave Moreau 47 · Odilon Redon 60 · Pierre Puvis de Chavannes 60 · Arnold Böcklin 40 · Fernand Khnopff 38
- **Art Nouveau ve Viyana Secession:** Gustav Klimt 60
- **Ekspresyonizm:** Edvard Munch 60 · Ernst Ludwig Kirchner 60 · Emil Nolde 1 · Wassily Kandinsky 46 · Franz Marc 53
- **Kübizm:** Pablo Picasso 16
- **Dada:** Marcel Duchamp 6 (2 pekiştirmede) · Hannah Höch 5 (2 pekiştirmede) · Man Ray 2
- **Sürrealizm:** Salvador Dalí 5 (0 pekiştirmede) · René Magritte 1 (0 pekiştirmede) · Joan Miró 4 (0 pekiştirmede)

### Gözle denetlenen görseller

| Sanatçı · eser | Dosya | Karar | Neden |
| --- | --- | --- | --- |
| Duccio di Buoninsegna · The Virgin and Child with Saints Dominic and Aurea | `Duccio_di_buoninsegna,_madonna_col_bambino_tra_i_ss._domenico_e_aurea,_1315_ca._01.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Simone Martini · Commemoration of Guidoriccio Da Fogliano at the Siege of Montemassi | `1western-wall-in-palazzo-publico-siena-235.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Pietro Lorenzetti · Mary with child and saints | `Pietro_lorenzetti,_pala_del_carmine,_1328,_01.JPG` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Ambrogio Lorenzetti · İyi ve Kötü Hükümet Alegorisi | `Sala_amb_frescos_d'Ambrogio_Lorenzetti,_Palazzo_Pubblico_de_Siena.JPG` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Ambrogio Lorenzetti · Stories of Saint Nicholas | `Uffizi_bild_57.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Ambrogio Lorenzetti · Maestà of Sant'Agostino | `Ambrogio_lorenzetti,_madonna_in_trono_col_bambino_e_santi,_1335-38,_01.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Giotto di Bondone · Arena Chapel (Arena Şapeli) | `Left_wall_(1.1)_-_Capella_degli_Scrovegni_-_Padua_2016.JPG` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Giotto di Bondone · Scrovegni Şapeli'ndeki çalışmalar | `View_looking_towards_the_rear_-_Capella_degli_Scrovegni_-_Padua_2016_(2).jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Giotto di Bondone · Arena Şapeli (Scrovegni Chapel) freskleri | `Padova_Cappella_degli_Scrovegni_Innen_Fresken_1.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Giotto di Bondone · Scenes of the life of Saint Francis | `Assisis_Basilica_superiore.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Domenico di Michelino · The Virgin and Child Enthroned with St. Francis of Assisi and St. Jerome | `Zuschreibung_unsicher,_Domenico_di_Michelino_(1417_-_18.4.1491)_-_The_Virgin_and_Child_Enthroned_with_St._Francis_of_Assisi_and_St._Jerome_-_1345_-_Gemäldegalerie.jpg` | çıkarıldı | atfı belirsiz (dosya adı: “Zuschreibung unsicher”) · başka görseli yok |
| Domenico di Michelino · St. Jerome, Penitent | `Domenico_Di_Michelino_-_St._Jerome,_Penitent_-_1933.2_-_Dallas_Museum_of_Art.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Domenico di Michelino · St. Francis of Assisi receives the miraculous stigmata while in prayer on a mountainous retreat Florence | `Domenico_Di_Michelino_-_St._Francis_of_Assisi_receives_the_miraculous_stigmata_while_in_prayer_on_a_mountainous_retreat_Florence_-_1933.1_-_Dallas_Museum_of_Art.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Domenico di Michelino · Saint Vinzenz Ferrer | `Domenico_di_michelino,_san_vincenzo_ferrer,_1455-70_ca.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Domenico di Michelino · Processional Cross. Recto: Suffering Christ with Virgin, a Pelican Feeding her Young, and Saint John the Evangelist in the terminals. Verso: Christ Triumphant  with Saint Francis, God, Saint Louis of | `Domenico_di_Michelino_-_Processional_Cross._Recto,_Suffering_Christ_with_Virgin,_a_Pelican_Feeding_her_Young,_and_Saint_John_-_1962.281_-_Fogg_Museum.jpg` | çıkarıldı | resim değil, metal tören haçı · başka görseli yok |
| Masaccio · Expulsion from the Garden of Eden | `03_2015_Basilica_di_Santa_Maria_del_Carmine_(Firenze)-Cappella_Brancacci-Adamo_Eva_Cacciata_Paradiso_terrestre-Masaccio-_Photo_Paolo_Villa_FOTO9202bis.JPG` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Masaccio · Pisa Çokkanatlısı | `Poliptico_de_Pisa_Masaccio_reconstruccion.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Masaccio · San Giovenale Üçkanatlısı | `Masaccio,_trittico_di_san_giovenale,_1422,_01.JPG` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Masaccio · Raising of the Son of Teophilus and St. Peter Enthroned | `Cappella_brancacci,_Resurrezione_del_figlio_di_Teofilo_e_San_Pietro_in_cattedra_(restaurato),_Masaccio.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Andrea Mantegna · Camera Picta tavanı | `Andrea_mantegna,_camera_degli_sposi,_1465-74,_volta,_03.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Andrea Mantegna · San Zeno Altar Panosu | `Verone_-_San_Zeno_-_Retable_de_Mantegna..jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Andrea Mantegna · İsa'nın Tapınağa Götürülüşü | `Andrea_Mantegna_(um_1431_-_1506)_-_The_Presentation_at_the_Temple_-_29_-_Gemäldegalerie.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Piero della Francesca · The History of the True Cross | `VeraCrocePiero.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Fra Angelico · Coronation of the Virgin | `Le_Couronnement_de_la_Vierge_-_Fra_Angelico_-_Musée_du_Louvre_Peintures_INV_314_;_MR_220.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Fra Angelico · Armadio degli Argenti | `Santissima_annunziata,_cappella_degli_ex-voto,_luogo_armadio_degli_argenti_dell'angelico_03b.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · sıradaki görsele geçildi |
| Pietro Perugino · Christ Giving the Keys to Saint Peter | `Perugino,_Consegna_delle_chiavi,_Cappella_Sistina_(Roma)_-_panoramio.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Pietro Perugino · Son Akşam Yemeği | `Cenacolo_di_Fuligno_di_Pietro_Perugino.JPG` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Robert Campin · Diptych of the Trinity and Mary with Jesus by a fireplace | `Robert_campin,_dittico_della_trinità_e_la_vergine_del_focolare.JPG` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Jan van Eyck · Dresden Üçkanatlısı | `Gemäldegalerie_Alte_Meister_(Dresden)_Galeriewerk_Braun_1836a.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · sıradaki görsele geçildi |
| Hans Baldung Grien · High altar of Freiburg Minster | `Freiburg_Münster_Hochaltar_01.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · sıradaki görsele geçildi |
| Hans Baldung Grien · High altar of Freiburg Minster | `Freiburg_Minster_2008_(15).jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · sıradaki görsele geçildi |
| Leonardo da Vinci · The Virgin and Child with Saint Anne | `The_Virgin_and_Child_with_Saint_Anne_by_Leonardo_da_Vinci,_taken_at_the_Louvre_on_July_26,_2026.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Michelangelo · Sistine Şapeli tavanı | `'Sistine_Chapel_ceiling'_by_Michelangelo_JBU21.JPG` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Raphael · Raffaello Odaları | `Raffael_Stanza_della_Segnatura.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Raphael · Disputation of the Holy Sacrament | `Raphaels_Disputation_of_the_Holy_Sacrament.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Titian · Pesaro Meryemi | `Frari_(Venice)_nave_left_-_Altar_of_Madona_di_Ca'Pesaro.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Giovanni Bellini · San Zaccaria Altar Panosu | `Pala_di_San_Zaccaria_(Venezia).jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Giovanni Bellini · San Giobbe Altar Panosu | `Accademia_-_Pala_di_San_Giobbe_by_Giovanni_Bellini.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Giovanni Bellini · Başkalaşım | `Paris_1er_-_Musée_du_Louvre_-_Exposition_Naples_à_Paris_-_La_Transfiguration_(Giovanni_Bellini).jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Francesco Salviati · The Three Fates | `Francesco_Salviati,_Tre_Parche,_circa_1550,_02.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Francesco Salviati · Stories of Furio Camillo | `Palazzo_vecchio,_sala_del_trionfo_00.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Daniele da Volterra · David and Goliath | `David_et_Goliath_-_Daniele_da_Volterra_-_Musée_du_Louvre_Peintures_INV_566_-_recto.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Daniele da Volterra · Portrait of a Young Man | `Daniele_da_volterra,_ritratto_di_giovane,_1540-60_ca.,_Q752.JPG` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Daniele da Volterra · Madonna enthroned with Child and Sts Peter and Paul | `Daniele_da_volterra,_madonna_in_trono_col_bambino_tra_i_ss._pietro_e_paolo,_1545,_dai_ss._pietro_e_paolo_a_ulignano_di_volterra_01.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Daniele da Volterra · Moses on Mt. Sinai | `Dresden,_Gemäldegalerie_Alte_Meister,_Daniele_da_Volterra,_Moses_am_Berg_Sinai.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Giulio Romano · Sala dei Giganti (Gigantomachy freski) | `Giulio-romano-fall-of-the-giants-fresco-in-the-sala-dei-giganti-palazzo-del-te-1530-1532.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Giulio Romano · Madonna of the cat | `Giulio_romano,_madonna_della_gatta,_1519-20,_Q140,_01.JPG` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Giulio Romano · Altarpiece Fugger | `Giulio_romano,_Sacra_Famiglia_coi_santi_Giacomo,_Giovanni_Battista_e_Marco,_1522,_01.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · sıradaki görsele geçildi |
| Giulio Romano · Altarpiece Fugger | `Giulio_romano,_Sacra_Famiglia_coi_santi_Giacomo,_Giovanni_Battista_e_Marco,_1522,_03.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · sıradaki görsele geçildi |
| Annibale Carracci · The Flight into Egypt | `Annibale_Carracci_-_The_Flight_into_Egypt_-_WGA04437.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · sıradaki görsele geçildi |
| Artemisia Gentileschi · Judith Slaying Holofernes | `Judith_Slaying_Holofernes_by_Artemisia_Gentileschi.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Francisco de Zurbarán · Saint Agatha | `Francisco_de_Zurbarán_031.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Peter Paul Rubens · Masumların Katli | `0_Le_Massacre_des_Innocents_d'après_P.P._Rubens_-_Musées_royaux_des_beaux-arts_de_Belgique_(2).JPG` | çıkarıldı | başkasının Rubens kopyası (d’après) · başka görseli yok |
| Jean-Antoine Watteau · Nymph and Satyr | `Nymphe_et_satyre_-_Jean-Antoine_Watteau_-_Musée_du_Louvre_Peintures_MI_1129.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| François Boucher · Girl Reclining (Louise O'Murphy) | `Resting_Girl_by_François_Boucher_(1753)_-_Alte_Pinakothek_-_Munich_-_Germany_2017_(crop).jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · sıradaki görsele geçildi |
| Jean-Honoré Fragonard · Blind Man's Bluff | `Jean_Honoré_Fragonard_(1732-1806)_-_Das_Blindekuhspiel_-_3220_-_Führermuseum.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · sıradaki görsele geçildi |
| Jean-Honoré Fragonard · The See-Saw | `Jean_Honoré_Fragonard_(1732-1806)_-_Die_Schaukel_-_3223_-_Führermuseum.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · sıradaki görsele geçildi |
| Giovanni Battista Tiepolo · Deposition | `Deposicao_Cristo_Tumulo-Tie.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Jean-Baptiste Greuze · The Dairy | `J-B_Greuze_la_laitière_07244.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Angelica Kauffman · The Sorrow of Telemachus | `Angelica_kauffmann,_il_dolore_di_telemaco,_1783_(nyc,_met).jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · sıradaki görsele geçildi |
| Eugène Delacroix · Medea | `Lille_PdBA_delacroix_medee.JPG` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Francisco de Goya · Kara Resimler | `Quintasordo.svg` | çıkarıldı | resim değil, evin şeması · başka görseli yok |
| Dante Gabriel Rossetti · Beata Beatrix | `Dante_gabriel_rossetti,_beata_beatrix,_1864-0_ca.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · sıradaki görsele geçildi |
| Dante Gabriel Rossetti · Mnemosyne | `Gabriel_Dante_Rosetti,_Mnemosyne.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Camille Pissarro · The House of the Deaf Woman and the Belfry at Eragny | `The_House_of_the_Deaf_Woman_and_the_Belfry_at_Eragny,_Pissarro_-_Indianapolis_Museum_of_Art_-_DSC00657.JPG` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Gustave Moreau · The Unicorns | `Gustave_Moreau_Les_Licornes.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Pierre Puvis de Chavannes · The Sleep | `Lille_PdBA_puvis_de_chavanne_sommeil.JPG` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Fernand Khnopff · Secret-Reflet | `Secret-Reflet_(Geheim-Weerspiegeling),_1902,_Groeningemuseum,_0040174000.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Gustav Klimt · Beethoven Frieze | `Beethovenfires_total.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · sıradaki görsele geçildi |
| Gustav Klimt · Beethoven Frieze | `Gustav_Klimt_-_Beethovenfries,_"Die_Sehnsucht_nach_dem_Glück"_(nach_Richard_Wagners_Interpretation_der_IX._Sinfonie_von_Ludwig_van_Beethoven)_-_5987_-_Österreichische_Galerie_Belvedere.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · sıradaki görsele geçildi |
| Pablo Picasso · Guernica | `"Guernica"_by_Picasso_at_MOMA,_NYC.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Pablo Picasso · Guernica | `Mural_del_"Guernica"_de_Picasso.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Pablo Picasso · Suite Vollard | `Vollard_Suite.2869.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Pablo Picasso · The Fall of Icarus | `Culture_of_peace,_Paris,_Maison_de_l'UNESCO_-_UNESCO_-_PHOTO0000003622_0001.tiff` | çıkarıldı | sergi fotoğrafı, eser seçilemiyor · başka görseli yok |
| Pablo Picasso · Mountains of Málaga | `Montes_de_Málaga.jpg` | çıkarıldı | dağ manzarası fotoğrafı, eserle ilgisiz · başka görseli yok |
| Pablo Picasso · Syrenka | `Syrenka_Picassa_mural.jpg` | çıkarıldı | duvardaki röprodüksiyon · başka görseli yok |
| Pablo Picasso · Women of Algiers, O version | `Women_of_Algiers_in_Lagunillas.jpg` | çıkarıldı | sokak duvarındaki röprodüksiyon · başka görseli yok |
| Pablo Picasso · Personnage cueillant des fleurs | `Strasbourg_Musée_d'art_moderne_et_contemporain_février_2014_07.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Marcel Duchamp · Chocolate Grinder (No. 1) | `Chocolate_Grinder_(No._1).jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Marcel Duchamp · Nude (Study), Sad Young Man on a Train | `Aerrapc_Guggenheim_art_photo_(145).png` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Marcel Duchamp · Passage from Virgin to Bride | `Aerrapc_Guggenheim_art_photo_(140).png` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Marcel Duchamp · The Bride | `Aerrapc_Guggenheim_art_photo_(142).png` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Hannah Höch · Creatures | `Creatures_by_Hannah_Hoch,_1926-1929,_oil_on_canvas_-_Germanisches_Nationalmuseum_-_Nuremberg,_Germany_-_DSC02365.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Hannah Höch · Dancing into the Dark | `Dancing_into_the_Dark,_by_Hannah_Hoch,_1919,_oil_on_cardboard_-_Germanisches_Nationalmuseum_-_Nuremberg,_Germany_-_DSC02374.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Hannah Höch · Birth | `Birth_by_Hannah_Hoch,_1924,_oil_on_canvas_-_Germanisches_Nationalmuseum_-_Nuremberg,_Germany_-_DSC02359.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Salvador Dalí · The Great Masturbator | `El_gran_masturbador.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Salvador Dalí · The Face of War | `Dalí_en_el_palacio_de_BA_02.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Salvador Dalí · Portrait of Luis Buñuel | `Madrid_(49191190833).jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Salvador Dalí · The Spectre of Sex-Appeal | `Salvador_Dali_-_Le_spectre_du_sex-appeal.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Salvador Dalí · The Rainbow | `Salvador_Dali_The_Rainbow_1972.jpg` | çıkarıldı | resim değil, kabartma · başka görseli yok |
| Salvador Dalí · Corpus Hypercubus at the Metropolitan Museum of Art in New York | `Corpus_Hypercubus_at_the_Metropolitan_Museum_of_Art_in_New_York.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| René Magritte · İmgelerin İhaneti | `Magritte_treachery.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| René Magritte · The Human Condition | `Http://www.wikidata.org/.well-known/genid/bc27e616b2eec2b9a6eefda6ab7a3a7c` | çıkarıldı | Wikidata’da görsel “bilinmiyor” (geçersiz dosya) · başka görseli yok |
| René Magritte · Les barricades mystérieuses | `Les_barricades_mystérieuses,_Brussels.jpg` | çıkarıldı | bina fotoğrafı · başka görseli yok |
| Joan Miró · Portrait of Vincent Nubiola | `1_visitor_scaning_QRPedia_codes_at_Fundació_Joan_Miró_(8).JPG` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Joan Miró · Barcelona Series | `QRpedia_codes_at_Fundació_Joan_Miró_19.JPG` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Joan Miró · Miró Wall | `Hack-Museum_Fassade.jpg` | çıkarıldı | bina cephesi fotoğrafı · başka görseli yok |
| Joan Miró · Head of a Catalan Peasant | `QRpedia_codes_at_Fundació_Joan_Miró_22.JPG` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Joan Miró · Wall of the Barcelona Airport | `Terminal_B.JPG` | çıkarıldı | terminal binası fotoğrafı · başka görseli yok |
| Joan Miró · Wall of the Conferences and Exhibitions Palace of Madrid | `Palacio_de_Congresos_y_Exposiciones_(Madrid)_01_Kopie.jpg` | çıkarıldı | bina fotoğrafı · başka görseli yok |
| Joan Miró · Mural for IBM | `Presentació_Mural_per_a_IBM.jpg` | pekiştirmede kullanılmaz | fotoğraf gibi: çerçeve, salon, eğik açı ya da siyah-beyaz · başka görseli yok |
| Joan Miró · Dona | `Interior_Palau_del_Parlament_de_Catalunya_1.JPG` | çıkarıldı | salon fotoğrafı · başka görseli yok |

## Aşama 3 · Günün sanatçısı (2026-10-20)

60. **Seçim:** `js/gunun.js`. Havuz, resmi olan bütün sanatçılardır (kilitliler dahil, kurs ilerlemesinden bağımsız; şu an 134). Seçim deterministiktir:
    - 2026-01-01'den bugüne kadar her gün için sabit bir karıştırma fonksiyonu, son 30 günde seçilmemiş adaylardan birini seçer.
    - Aynı gün her cihazda ve her açılışta aynı sanatçı gelir; 30 gün içinde tekrar yoktur.
    - Havuz değişirse (konu, sanatçı ya da görsel değişimi) dizilim de değişebilir. Bu, tek kullanıcılı uygulamada kabul edilebilir.
61. **“Başka bir sanatçı”** rastgele, bugünkünden farklı bir sanatçının bölümünü (`#/gunun/<id>`) açar. Bu seçim kaydedilmez; ertesi gün yine takvime göre seçilen gelir.
62. **Kurs durumu:** `kaynak: "ek"` ise “Kurs dışı”; konu işlendiyse “Kursta: Konu N”; değilse “Henüz kursta yok”.
63. **Biyografiler** (`data/biyografiler.json`, `scripts/biyografi.mjs`): Wikidata site bağlantısından Türkçe Vikipedi bulunur.
    - Önce maddenin giriş bölümü alınır. 120 kelimeden kısaysa maddenin devamından cümleler eklenir; kaynakça, dış bağlantılar ve notlar kesilir, bölüm başlıkları atılır.
    - Metin 180 kelimede, cümle sonunda kısaltılır.
    - 105 sanatçıda Türkçe madde kullanıldı. 29 sanatçıda Türkçe madde yoktu ya da 40 kelimeden kısaydı; bunlarda İngilizce girişi ben sade Türkçeye çevirdim (`dil: "en→tr"`). Kaynak çok kısaysa yalnızca kesin bilinen birkaç bilgi ekledim.
    - Betik bu çevirileri korur; yeniden çalıştırınca silinmez.
    - Tarifteki “REST page/summary” yerine MediaWiki `extracts` kullanıldı. Özet uç noktası yalnızca ilk paragrafı veriyor ve bu ortamda sık sık 429 döndürüyordu.
    - Türkçe maddesi kısa olduğu için 120 kelimenin altında kalanlar: Angelica Kauffman (53), Jan van Eyck (58), William Hogarth (82), Duccio di Buoninsegna (83), Jean-Auguste-Dominique Ingres (87), Rogier van der Weyden (92), John Constable (96), Jacques-Louis David (100), Rosso Fiorentino (112). Türkçe kaynak tercih edildiği için bunlar çevriyle değiştirilmedi.
    - Türkçe Vikipedi metinleri olduğu gibi alındı; kalitesi maddeye göre değişir. Qwen içerik denetimi bunlara da bakabilir.
64. **Dönem bilgisi** (`data/akim_bilgi.json`): görünür 28 akımın her biri için 150–175 kelimelik metin yazdım. Her metin zaman ve yer, ana özellikler, önemli temsilciler ve önceki/sonraki akımla farkı kapsar. Emin olmadığım ayrıntıları yazmadım. Her kayıt `"kaynak": "Claude taslağı · Qwen denetimi bekliyor"` taşır ve bu ibare uygulamada da görünür.
65. **Galeri:** sanatçının eserleri Wikidata site bağlantısına göre (en bilinenler önce) yatay kaydırılan büyük kartlarda gösterilir; her biri tam ekran açılır ve yakınlaştırılabilir. Başta en bilinen eser büyük gösterilir.
66. **“Bu sanatçıyı pekiştirmeye ekle”:** sanatçı `ilerleme.ekSanatcilar` listesine girer, bu yüzden konusu işlenmemiş olsa da pekiştirmede açık sayılır.
    - Sanatçı ve akım skorları kutu 0, bugün vadeli olarak başlatılır. Böylece günlük yeni sanatçı sınırına takılmadan bugünkü tekrarlara girer.
    - Göz At'taki kilit durumu değişmez (o, kursu izler).
    - Liste yedeğe girer.
67. **Çevrimdışı:** iki yeni veri dosyası service worker'ın kabuk önbelleğinde. SW 1.3.0.

## Aşama 4 · “Müze kataloğu” tasarımı (2026-10-20)

İşlevler değişmedi; yalnızca görünüm, yerleşim ve birkaç görüntü hatası düzeltildi.

68. **Akım renkleri:** `data/akimlar.json` kayıtlarına `renk` alanı eklendi (istenen renkler; istekte adı geçmeyen akımlara aynı aileden, komşu akımlardan ayrışan tonlar verdim). Renk; zaman çizelgesi bandında, rozet noktasında ve kenarında, not/dönem kutusu kenarında, doğruluk çubuklarında ve görsel yüklenirken paspartu zemininde kullanılır.
69. **Metinde renk yalnızca yeterli kontrastla:** `js/tasarim.js` WCAG kontrast oranını hesaplar. Akım rengi bir başlıkta ancak temanın yüzeyine karşı ≥ 4,5 ise kullanılır; değilse metin mürekkep rengindedir (koyu temada koyu akım renkleri bu yüzden metne hiç geçmez). Rozet yazısı her zaman mürekkep rengidir; renk yalnızca noktada ve kenarda.
70. **Kâğıt dokusu:** dışarıdan görsel indirmemek için SVG `feTurbulence` gürültüsü veri URI'si olarak CSS'te; çok düşük opaklıkta, her temada ayrı ton.
71. **Yazı tipleri:** başlıklar Cormorant Garamond 600/700, gövde Literata 17,5 px, küçük etiketler sistem sans, büyük harf ve harf aralıklı. Google Fonts `media=print onload` ile engellemeden yüklenir; yoksa Georgia/Iowan Old Style'a düşer.
72. **Paspartu:** her eser 10 px açık paspartu, 1 px koyu çerçeve ve yumuşak gölge içinde. Koyu temada (“akşam müzesi”) paspartu koyu gri (#3a3530). Görsel yüklenene kadar zemin akım rengindedir.
73. **Müze etiketi içeriği bağlama göre:** sanatçı sayfasında ad zaten başlıkta olduğu için etikette “yıl · müze”; pekiştirmede cevaptan sonra “sanatçı · yıl · akım”. Pekiştirmede cevap verilmeden önce kart kenarı ve yükleme zemini nötrdür; akım rengi ipucu vermesin diye renk ancak cevaptan sonra görünür.
74. **Cevap sonrası:** kart 0,24 sn hafifçe döner ve müze etiketi belirir; seçeneklerde doğru yeşil, yanlış kırmızı, ikisi de ince çizgili ✓/× SVG simgesiyle (yalnızca renge dayanılmasın diye). Üstte ince ilerleme çizgisi.
75. **Simgeler:** ‹ › ✕ ✓ ✗ karakterleri ince çizgili SVG simgelerle değiştirildi (`ikon()`); emoji yok.
76. **Hareket:** geçişler 150–250 ms; `prefers-reduced-motion` açıkken tüm animasyon ve geçişler kapanır.
77. **Göz At:** dikey zaman çizelgesi; her akımda sol renk bandı, yüzyıl aralığı (açık sanatçıların doğum+20 … ölüm yıllarından), sayı ve 3 küçük önizleme. Kilitli akımlar soluk ve “Konu N'de açılır”.

### Ekran görüntüleriyle öz-eleştiri (390×844, sepya ve koyu)

Her ekranın görüntüsü alındı (ana sayfa, Günün sanatçısı, Göz At, akım, sanatçı, pekiştirme soru/cevap, İlerleme, Ayarlar, görüntüleyici). Birinci turda bulunan ve düzeltilenler:

78. Ana sayfadaki “Bugün tekrar yok; yeni sanatçılarla devam et” cümlesi tek kelimeyi alt satıra bırakıyordu → metin kısaltıldı ve başlıklarla birlikte `text-wrap: balance` eklendi.
79. Göz At önizlemelerinde boş renkli kareler: önizleme ilk 3 sanatçıdan seçiliyordu, eseri olmayan mimar/heykeltıraşlar (Ghiberti, Donatello…) boş kalıyordu → eseri olan ilk 3 sanatçı alınıyor.
80. Miró'nun temsilî görseli bir QR kod sergi fotoğrafıydı. `enBilinen` artık yalnızca uygun görseli olan eserlerden seçer; hiçbiri uygun değilse temsilî görsel (kahraman, küçük kare, önizleme) gösterilmez. Galeri ve eser listesi değişmedi.
81. Magritte'in “The Human Condition” eseri boş dosya adlı bir görselle önbellekte kalmıştı (Wikidata'da görsel “bilinmeyen değer”); pekiştirmede kırık görsel çıkabilirdi. Birleştirme betiği boş dosya adlarını artık almıyor; önbellekten bu eser silindi (6380 eser).
82. Günün sanatçısı biyografilerinde Vikipedi şablon kırıntıları vardı (Kandinsky “U. 4 Aralık] 1866…”, van Gogh “(telaffuz:”, Munch/Rembrandt IPA, El Greco “,,”, Zurbarán “) hakkında”, Bronzino'da eser listesi). `scripts/kaynaklar/biyografi_duzelt.mjs` elle düzeltmeleri tutar ve `biyografi.mjs` her çalıştırmada uygular; 11 biyografi düzeltildi.
83. İlerleme'de uzun bölüm başlıklarında (x/y) sayacı sağ sütuna kayıyordu → başlıkla aynı satır akışına alındı.
84. İkinci turda bu sorunlar görülmedi. Bilinen küçük nokta: Limbourg “March” eserinin yılı Wikidata'da 1440 (sonradan tamamlanan minyatür); veri olduğu gibi bırakıldı.
85. SW 1.4.0.

## Tasarım A · “Gece galerisi” (2026-10-20)

Kaynak: `tasarim-A/TASARIM.md` ve üç mockup (`A-Bugun`, `A-Sanatci`, `A-Pekistir`). İstekte `referans/tasarim-A/` yazıyordu; dosyalar deponun kökünde, `tasarim-A/` altında bulundu ve oradan okundu. `referans/v0/` içindeki TabBar, ArtistScreen ve MovementTimeline yalnızca yapı için örnek alındı. Renk, yazı tipi ve görünüm tamamen TASARIM.md'den geliyor. Bu bölüm, Aşama 4'teki görünüm kararlarının (68–77) yerine geçer. İşlevler, veri ve depolama aynı kaldı.

86. **Tema token'ları:** Bütün renkler `:root[data-tema=…]` altında CSS değişkeni olarak tanımlı (`--bg`, `--raised`, `--ink`, `--ink-2`, `--ink-3`, `--gold`, `--gold-hi`, `--frame`, `--hair*`, `--right*`, `--wrong*`). Mockup'ta tek seferlik geçen tonlar da token oldu: etiket yazısı `#D9CDB8`, okuma metni `#E3D8C4`, soluk seçenek `#7A6F60`.
87. **Gece varsayılan tema.** Sepya ve Açık, Ayarlar'da seçenek olarak kaldı ve aynı yerleşimi kullanıyor. Bu temalarda spot ışığı yerine yumuşak kâğıt gölgesi var; renkler eski paletten. Koyu tema kaldırıldı, çünkü Gece onun yerini alıyor. İlerleme nesnesi sürüm 2 oldu: sürüm 1 kayıtlarında Sepya (eski varsayılan) ve Koyu **bir kez** Gece'ye geçer. Açık seçimi korunur, geçişten sonra Sepya'ya dönmek de kalıcıdır. Aynı kural ilk boyamadan önce `index.html` içinde de uygulanır, böylece tema yanıp sönmez.
88. **Yazı tipleri:** Cormorant Garamond (500, 600, italik 500) ve Figtree (400, 500, 600) kullanılıyor; Literata kaldırıldı. Okuma metinleri (biyografi, dönem, “Nasıl tanırım?”) Cormorant 19 px, “Notlarımdan” bunun italiği. CLAUDE.md'deki “gövde ≥ 17 px” kuralı okuma metinlerinde korunuyor. Arayüz etiketleri ise mockup ölçülerinde (10,5–16 px).
89. **Durum çubuğu:** `apple-mobile-web-app-status-bar-style` artık `black-translucent`. Sayfa saat/pil çubuğunun altına uzanır ve her yerde `env(safe-area-inset-*)` kullanılır; sahte durum çubuğu yok. Sepya ve Açık'ta durum çubuğunun beyaz yazısı okunsun diye üstte, güvenli alan yüksekliğinde koyu bir şerit var. iOS bu ayarı ana ekrana eklerken okuduğu için README'ye yeniden ekleme notu yazıldı (önce yedek alınmalı).
90. **Akım renkleri** artık yalnızca küçük bir noktada kullanılıyor: Göz At, Pekiştir listesi, İlerleme doğruluk satırları. Bantlar, rozet kenarları ve çubuklar altın rengi. TASARIM.md “yeni görsel fikir yok, altın vurgular” diyor.
91. **Sekme çubuğu** (Bugün / Göz At / Pekiştir / İlerleme), v0'daki gibi 58 px + güvenli alan yüksekliğinde. Arka plan `--bg` .92, üstte saç çizgisi; mockup'taki çizgi ikonlar kullanıldı, etkin sekme altın ve 1,6 çizgili. Pekiştir kartında gizlenir.
    - Göz At'ın alt ekranları (akım, sanatçı) Göz At sekmesinde, Günün sanatçısı Bugün sekmesinde, Ayarlar İlerleme sekmesinde görünür.
    - Ayarlar'a İlerleme başlığındaki dişliden ve Bugün'ün alt satırındaki bağlantıdan gidilir.
    - Pekiştir sekmesi yeni bir **Pekiştir** ekranını (`#/pekistir`) açar: üstte Karışık düğmesi, altında “Döneme göre” listesi. `#/pekistir/donem` de aynı ekranı açar.
92. **Bugün:**
    - Üstte “Bugün” etiketi ve “20 Ekim, Salı” tarihi; sağdaki hap “N tekrar bekliyor” ya da “Bugün tekrar yok” der.
    - Spot ışıklı sahnede Günün sanatçısının en bilinen eseri, altında duvar etiketi: yıllar · akım · Konu N (kurs dışı sanatçıda “Kurs dışı”) ve eserin adı. Kart dokununca Günün sanatçısı bölümünü açar.
    - **Son çalıştıkların** için yeni bir alan eklendi: `ilerleme.sonCalisilanlar`. En yeni başta, en fazla 12 kayıt tutulur. Bir kartın ilk sorusu cevaplanınca güncellenir ve yedeğe girer.
    - Kısa sanatçı adı verisi olmadığı için tam ad yazılıyor; ad, resmin genişliğinde iki satıra kırılır. “Tümü” Göz At'ı açar.
    - CLAUDE.md'deki sayılar (açık sanatçı, doğru oranı, bugünkü kart) altta sakin bir satırda kalıyor. Ekranda görünmeyen bir “Sanat Atlası” başlığı erişilebilirlik için duruyor.
93. **Geniş resim kuralı:** çerçevedeki resmin genişliği `min(kullanılabilir genişlik, sahne yüksekliği × oran)`. Bunu CSS sağlıyor: `max-width` + `max-height`, `width/height: auto`, `object-fit: contain`. Pekiştir'de ve görüntüleyicide resim **hiç kırpılmaz**. Kahraman görseli ve küçük resimler mockup'taki gibi kırpılabilir. Görsel yüklenene kadar çerçeve sabit boyutlu bir kutu tutar, yüklenince resim 0,2 sn'de görünür.
94. **Sanatçı sayfası:**
    - Kenardan kenara 350 px kahraman (dokununca görüntüleyici açılır); ad bunun 46 px üstüne biner.
    - Künye: yıllar · akım (bağlantı) · altın renkli “Konu N”.
    - “Notlarımdan” bölümü `kurs_notu` gösterir, ek sanatçıda `anlatim`. Varsa “Nasıl tanırım?”, ardından “Dönemi” çizelgesi.
    - Kursun İngilizce konu başlığı satırı mockup'ta olmadığı için kaldırıldı.
    - “Eserleri” çerçeveli küçük resimlerden oluşan yatay bir şerit. **Hepsini gör (N)** aynı eserleri iki sütunlu galeriye çevirir (bu kırpmasız, var olan galeri), tekrar dokununca şeride döner. Her eser tam ekran görüntüleyicide açılır.
95. **Dönem çizelgesi** (v0'daki MovementTimeline): önceki ← bu akım → sonraki. Komşular Göz At'ta görünen akımların zaman sırasından gelir (`akimlar.json` `sira`). Ortadaki parça kalın altın çizgi, yanlar saç çizgisi. Adlar ilgili akımın sayfasına bağlanır. Sanatçı, Günün sanatçısı ve akım sayfalarında kullanılır.
96. **Pekiştir kartı:**
    - Sekme çubuğu yok. Üstte kapat düğmesi, “Pekiştir · Karışık · i / n” ve 2 px altın ilerleme çizgisi; ardından spot ışıklı resim, “Soru 1 / 2” etiketi, Cormorant 32 px soru ve A–D harfli dört seçenek.
    - Karışık kartta iki soru artık **sırayla** geliyor (önceden aynı ekrandaydı). Cevaptan sonra doğru seçenek yeşil ✓, seçilen yanlış kırmızı ×, kalanlar soluk görünür.
    - Alttan gelen yaprakta sonuç satırı, bilgi, ipucu ve kaynak satırı, altında “Sanatçı sayfası” ve “Hangi akım? →” / “Sonraki kart →” düğmeleri var. Yanlışta sonuç satırı “Yanlış · bu kart 3–5 kart sonra yine gelecek” der.
    - **Spoiler kuralı:**
      - 1. sorudan sonra yalnızca sanatçı ve eser gösterilir.
      - İpucu (`taninma` / `kurs_notu` / `anlatim`) akımın adını ya da kökünü içeriyorsa (ör. “klasik” → Fransız Klasisizmi, “Hollandalı” → Hollanda Altın Çağı) 1. soruda gizlenir, 2. soruda gösterilir.
      - 2. sorudan sonra akım, sanatçının yılları ve “Komşu akımlar: …” gösterilir.
    - Akım doğru ama sanatçı yanlışsa sonuç “Doğru · sanatçı yanlıştı, bu kart 3–5 kart sonra yine gelecek” olur, çünkü Leitner kartı yine geri getirir.
    - Döneme göre kartında tek soru var (“Soru 1 / 1”).
    - Seçeneklerdeki yıllar mockup'a uymak için kaldırıldı; yıllar yaprakta görünüyor. Kaynak/lisans satırı CLAUDE.md gereği yaprakta duruyor.
    - Yaprak açıkken sayfanın altına yaprak kadar boşluk eklenir ve işaretli seçenekler yaprağın üstünde kalacak şekilde sayfa kaydırılır. Aşama 4'teki kart çevirme animasyonu kaldırıldı.
97. **Çizilmemiş ekranlar** (Göz At, akım, Pekiştir menüsü, İlerleme, Ayarlar, görüntüleyici) aynı parçalarla yapıldı: altın etiketler, Cormorant başlıklar, saç çizgisi ayraçlar, çerçeveli küçük resimler, altın anahtar ve çubuklar, 12 px köşeli düğmeler. **Görüntüleyici** her temada Gece renklerini kullanır; eser karanlık zeminde en iyi görünüyor.
98. **Testler:**
    - Karışık test artık iki adımı izliyor: 1. soruyu cevapla, `[data-ikinci]` ile geç, 2. soruyu cevapla. Yedek testi Koyu yerine Sepya seçiyor ve ilk açılışta Gece'yi bekliyor.
    - Yeni birim testleri: tema geçişi ve “son çalışılanlar”.
    - Yeni `tests/e2e/ekran.spec.js`: 390×844'te Bugün, Sanatçı, Pekiştir (soru, 1. cevap, 2. cevap) ve çizilmemiş ekranların görüntülerini `test-results/ekran/` altına yazar. CI'da fikstürle çalışır; `EKRAN_GERCEK=1` ile gerçek görseller ve yazı tipleri yüklenir.
99. **Mockup karşılaştırması** (gerçek görsellerle 390×844). Mockup'ın satır içi stilleriyle aynı olanlar:
    - Kenar boşluğu 22 px.
    - Sahne 300/290 px, resim yüksekliği 236/242 px.
    - Çerçeve 6 px ve küçük resim çerçevesi 4 px; altın halka .45/.35.
    - Etiketler 10,5–11 px, harf aralığı .18–.22em.
    - Ad 38/44 px, soru 32 px, seçenek 50 px ve 12 px köşe.
    - Yaprak `--raised` ve .3 saç çizgisi; düğmeler 46 px.
    - Sekme çubuğu 58 px + güvenli alan.

    Bilinçli farklar:
    - Mockup 47 px'lik durum çubuğunu da çiziyor. Playwright'ta güvenli alan 0 olduğu için görüntülerde içerik ~46 px daha yukarıda; telefonda aynı hizaya gelir.
    - Örnek sayılar (12 tekrar, 4 / 20) gerçek durumdan geliyor.
    - Mockup'taki sabit resim boyutları yerine gerçek en-boy oranı kullanılıyor: geniş Kandinsky daha alçak bir çerçevede.
100. **Öz-eleştiri turunda düzeltilenler:**
    - Son çalışılanlar ve eser şeridindeki çerçeveler resimden genişti (esnek kutu esnemesi) → çerçeve resmi sarıyor, yazı resim genişliğinde kırılıyor.
    - Günün sanatçısında “Kurs dışı” iki kez yazıyordu → yalnızca hapta.
    - Sanatçı sayfasındaki İngilizce konu başlığı satırı kaldırıldı.
    - Cevap yaprağı işaretli seçenekleri örtüyordu → otomatik kaydırma eklendi.
101. SW 1.5.0; manifest `theme_color` / `background_color` #15120F.

## Tasarım E · “Kadife ve resim rengi” (2026-10-20)

“Gece galerisi” yerine bu tasarım uygulandı. Tema/token altyapısı, sekme çubuğu ve ekran iskeleti korundu; renkler, yazı tipleri ve Bugün, Sanatçı, Pekiştir düzenleri değişti. Bu bölüm 86–101'deki görünüm kararlarının yerine geçer (tema geçişi, sekme çubuğu, spoiler kuralı, kırpmama kuralı ve testler aynen geçerli).

102. **Renkler (Gece):** `--bg #0B0A0B`, `--surface #171517`, `--border #2A272A`, `--ink #F4EFE6`, `--ink-2 #ABA39A`, `--ink-3 #827A72`; doğru `#6FB487` (ikon `#8FD0A2`), yanlış `#D66854` (ikon `#F09A86`). Altın vurgu kaldırıldı. Zemin dokusu: `radial-gradient(rgba(255,255,255,.035) 1px, transparent 1px)`, 3 px ızgara. Sepya ve Açık aynı yerleşimi kullanır; doku orada koyu noktalıdır.
103. **Yazı tipleri:** başlık, isim ve okuma metinleri Bodoni Moda (400, 500, italik 400), arayüz Archivo (400–700). Cormorant ve Figtree kaldırıldı. Okuma metinleri Bodoni 19 px, böylece CLAUDE.md'nin “gövde ≥ 17 px” kuralı korunuyor.
104. **Resim rengi** (`js/renk.js`):
    - Görsel `crossOrigin="anonymous"` ile 64 px'lik bir canvas'a çizilir. Median-cut ile en fazla 6 renk ve her rengin payı çıkarılır.
    - `--vurgu`: payı en az %4 olan renkler arasında açıklığı .25–.72 olan en doygun ton.
    - `--vurgu-acik`: aynı tonun zeminde okunan hali. Gece'de açılarak, Sepya ve Açık'ta koyulaşarak zemine karşı en az 4,5:1'e getirilir.
    - Dolu düğmeler: yazı rengi (koyu ya da beyaz) zeminle en az 4,5:1 olacak şekilde seçilir; yetmezse düğme renginin açıklığı ayarlanır.
    - `--vurgu-koyu`: vurgunun zeminle karışmış çok koyu tonu (cevap yaprağının gradyanı). `--vurgu-rgb`: hale ve gölgeler için.
    - Bütün kurallar birim testlerinde.
105. **Kaynak eser:** Bugün'de ve Günün sanatçısı bölümünde günün eseri, Sanatçı'da sanatçının listedeki ilk eseri, Pekiştir'de sorulan eser. Sekme ekranları (Göz At, akım, İlerleme, Ayarlar, Pekiştir menüsü) Günün sanatçısının rengini taşır. Ekran değişince, geç gelen bir paletin yeni ekranın rengini ezmemesi için istek sırası tutulur.
106. **CORS:** Commons'un `Special:FilePath` yönlendirmesi `Access-Control-Allow-Origin` göndermiyor (denendi); böyle bir görselden palet okunamaz.
    - Palet için dosyanın MD5 yolundan doğrudan `upload.wikimedia.org` küçük resmi alınır (`js/md5.js`, `paletUrl`).
    - Genişlik 330 px, çünkü Wikimedia artık yalnızca standart küçük resim genişliklerini veriyor (200 ve 400 px 400/429 döndü, 330 ve 500 px 200).
    - Müze görselleri kendi adresleriyle denenir; Met ve AIC CORS'a açık.
    - Service worker, CORS kipindeki görsel isteklerine karışmaz; önbellekteki opak yanıtlar CORS isteğini bozardı.
107. **Yedek renk:** palet çıkarılamazsa (CORS, çevrimdışı, 429) istenen şekilde akımın sabit rengi (`akimlar.json` `renk`) tek renkli palet olarak kullanılır. **Pekiştir'de cevaptan önce akım rengi kullanılmaz**, çünkü cevabı ele verir; orada nötr vurguda kalınır. Başarılı paletler IndexedDB'de (`palet` deposu, veritabanı sürümü 2) görsel adresiyle saklanır, başarısızlar saklanmaz.
108. **Bugün:**
    - Günün eseri ekranın üst 520 px'ini (+ güvenli alan) kenardan kenara kaplar (`object-position` üstten); 14 sn'de 1,08'den 1'e yakınlaşır, altta zemine erir.
    - Üstte “GÜNÜN SANATÇISI” (11,5 px, .2em, `--vurgu-acik`) ve sağda “tarih · N tekrar” hapı. Etiket parlak resimlerde okunsun diye hafif gölgeli; üst kenardaki karartma biraz artırıldı.
    - İsim resmin altına biner: ad italik 22 px, soyad Bodoni 400, 64 px; ardından “yıllar · akım · Konu N”.
    - **Ad bölme:** son kelime soyaddır; van/de/da/di/der… ekleri soyada katılır (“Jan / van Eyck”). Tek kelimelik adlar (Caravaggio) yalnızca soyad satırında; parantez içi (Yaşlı) soyada eklenir; “Limbourg kardeşler” bölünmez. Uzun soyadlar satıra sığana kadar 34 px'e kadar küçülür.
    - Altında “RESMİN RENKLERİ” şeridi: 12 px, renk payına göre genişlik, açılışta soldan uzar.
    - Düğmeler: “Pekiştir” ve sayı (bekleyen tekrar; yoksa bugün kalan kart) `--vurgu` dolu, radius 16, yükseklik 54, renkli gölge; “Döneme göre” surface + border.
    - “SON” satırı: üst üste binen yuvarlak küçük resimler + “İsim, İsim +N”. Resimler 40 px ve 2 px zemin çerçevesiyle 44 px dokunma hedefi; adlar soyad kısmı.
    - Sayılar ve Ayarlar bağlantısı altta sakin bir satırda.
109. **Sanatçı:**
    - Üstte geri düğmesi ve akım adı (büyük harf, `--vurgu-acik`, akım sayfasına bağlantı). İsim (ad italik 22, soyad 60) ve “yıllar · Kursta Konu N”.
    - Eserler yatay kaydırmalı galeride: yükseklik 236 px, genişlik oranına göre, kırpma yok, radius 6, altında italik başlık. Dokununca mevcut görüntüleyici açılır. Önceki “Hepsini gör” iki sütunlu galerisi yeni tasarımda olmadığı için kaldırıldı.
    - Sonra Notlarımdan (Bodoni italik 19; ek sanatçıda `anlatim`), varsa “Nasıl tanırım?”, ardından üç sütunlu dönem (4 px çizgiler, ortadaki `--vurgu`). Sol üstte vurgu renginde yumuşak hale var.
    - Günün sanatçısı bölümü aynı düzeni kullanır; üstüne biyografi, dönem metni ve iki düğme eklenir.
110. **Pekiştir:**
    - Üstte kapat, “KARIŞIK” (ya da akım adı / “HEPSİ”) ve “i / n”; altında 3 px `--vurgu-acik` ilerleme çubuğu.
    - Eser yanlarda 12 px boşlukla, radius 10, hiç kırpılmadan gösterilir. Yüksekliği ekrana göre: `clamp(190px, 100dvh − 470px − güvenli alanlar, 430px)`. Arkasında eserin renginde 7 sn'de nefes alan bir hale var.
    - Soru Bodoni 500, 40 px; sağda “SORU 1 / 2”. 390 px'te “Bu eser kimin?” iki satıra kırılıyor; boyut tarifteki gibi bırakıldı.
    - Seçenekler 50 px, radius 14, surface + border. Doğru/yanlış/soluk durumları ve spoiler kuralı aynı.
    - Cevap yaprağı: üst köşeler 24 px, `--vurgu-koyu`'dan `--bg`'ye gradyan; sonuç satırı, Bodoni 25 px bilgi, 8 px palet şeridi, ipucu, kaynak satırı, “Sanatçı” (erişilebilir adı “Sanatçı sayfası”) ve `--vurgu-acik` dolu “sonraki” düğmesi.
111. **Sekme çubuğu** aynı; etkin sekme `--vurgu-acik`. Göz At, İlerleme, Ayarlar ve görüntüleyici aynı token ve yazı tiplerine geçti. Küçük resimler çerçevesiz, 6 px köşeli; anahtarlar ve çubuklar `--vurgu-acik`.
112. **Hareket:** yakınlaşma, şeridin uzaması, hale nefesi, yaprak ve geçişler `prefers-reduced-motion` açıkken kapanır.
113. **Kırık görseller:** yedek boyut da açılmazsa görsel gizlenir, tarayıcının kırık resim simgesi görünmez.
114. **Testler:**
    - Ana sayfa düğmesi artık yalnızca “Pekiştir” yazdığı için testler onu `data-test="pekistir"` ile buluyor.
    - Yeni birim testleri: palet, vurgu seçimi, kontrast, MD5 ve palet adresi.
    - Yeni e2e testi: Bugün paleti çıkarılıyor, `--vurgu-acik` yazılıyor, IndexedDB'ye kaydediliyor ve Pekiştir yaprağında palet görünüyor.
    - Ekran testi Bugün'ün tam sayfa görüntüsünü de alıyor.
115. **Ekran görüntüsü kontrolü** (gerçek görsellerle, 390×844):
    - Bugün'de Kandinsky'nin 6 renkli paleti ve resimden gelen turuncu vurgu çalıştı, Sepya'da da.
    - Bu ortamdan Wikimedia aralıklı 429 (hız sınırı) döndürdüğü için bazı Sanatçı ve Pekiştir görüntülerinde yedek renk görüldü. Adresler ve CORS başlıkları ayrıca doğrulandı; telefonda tek kullanıcıyla bu sınıra takılması beklenmez, takılırsa bir sonraki açılışta yeniden denenir.
116. SW 1.6.0 (yeni `js/renk.js`, `js/md5.js` kabukta); manifest renkleri `#0B0A0B`.

### Birleştirmeden önceki düzeltmeler

117. **Bilinen adlar** (`data/kisa_adlar.json`, `js/adlar.js`): ilk adıyla ya da başka bir kısa adla tanınan sanatçılarda büyük satıra bilinen ad, küçük satıra adın geri kalanı yazılıyor. `sanatcilar.json` taranarak çıkarılan 20 kayıt:
    - **İlk adıyla tanınanlar:** Giotto (di Bondone), Duccio (di Buoninsegna), Arnolfo (di Cambio), Gentile (da Fabriano), Domenico (di Michelino), Piero (della Francesca), Leonardo (da Vinci), Michelangelo (Buonarroti), Daniele (da Volterra), Rosso (Fiorentino), Artemisia (Gentileschi), Rembrandt (van Rijn).
    - **Soyadın bir kısmıyla ya da birleşik adla tanınanlar:** Zurbarán (Francisco de), Goya (Francisco de), Vigée Le Brun (Élisabeth), Baldung Grien (Hans), Holman Hunt (William), Toulouse-Lautrec (Henri de), Puvis de Chavannes (Pierre), Man Ray.
    - Raphael ve Titian listede yok: büyük satırda da verideki adları (Raphael, Titian) görünür; böylece seçeneklerle aynıdır (Emre'nin isteği, ilk sürümdeki Raffaello/Tiziano kaldırıldı). Artemisia, babası Orazio ile “Gentileschi” olarak karışmasın diye ilk adıyla.
    - Listede olmayanlarda eski kural geçerli: son kelime büyük satıra gelir ve van/de/da ekleri ona katılır (Jan / van Eyck, Georges / de La Tour, Vincent / van Gogh).
    - Bilinen ad büyük isim satırlarında (Bugün, Sanatçı, Günün sanatçısı), “SON” satırında ve tüm eserler sayfasının başlığında kullanılıyor. Seçeneklerde, listelerde ve bilgi satırlarında tam ad kalıyor. Ekran okuyucu için isim öğesinin erişilebilir adı her zaman tam ad.
118. **Pekiştir sorusu** 34 px ve tek satır. Sığmazsa JS en fazla 24 px'e kadar küçültür (`sigdir`). 390 px'te “Bu eser kimin?” ve “Hangi akım?” 34 px'te sığıyor.
119. **“Tümü (N)”:** Sanatçı sayfasındaki yatay galerinin sonunda, galeriyle aynı yükseklikte bir kutu. Yeni `#/sanatci/<id>/eserler` ekranını açar: bütün eserler iki sütunlu ızgarada, kırpılmadan, başlık ve yılıyla; dokununca görüntüleyici açılır. Önceki yerinde açılan “Hepsini gör” düzeni yerine ayrı bir ekran seçildi; geri düğmesi sanatçıya döner.
120. Testler: kısa ad birim testleri, “Tümü (N)” → ızgara → görüntüleyici ve sorunun tek satırda kaldığını kontrol eden e2e testleri eklendi. SW 1.6.0'da kaldı (henüz yayınlanmadı); yeni dosyalar kabuk listesinde.
121. Raphael ve Titian `kisa_adlar.json`'dan çıkarıldı (büyük satırda verideki ad). Veri dosyası kabuk önbelleğinde olduğu için telefona ulaşsın diye SW 1.6.1.

## Yarım kalan pekiştirmeye devam (2026-10-20)

122. **Kayıt** (`js/devam.js`): cevap verilmiş bir oturum her adımda IndexedDB'ye (`oturum` deposu, `yarim` anahtarı; veritabanı sürümü 3) yazılır. Yazılan anlar: sanatçı cevabı, “Hangi akım? →”, akım cevabı, “Sonraki kart →” ve yeni kartın gösterilmesi. Kaydedilenler:
    - kip, akım (`hepsi` dahil),
    - kart sırası (tekrar kuyruğuyla birlikte), konum, sanatçı başına tekrar sayacı, doğru/yanlış sayıları,
    - şu anki kart: eser anahtarı, dört seçenek, akım seçenekleri, adım, verilen cevaplar,
    - gösterilen eserler (son 200).
    
    Hiç cevap verilmemiş oturum kaydedilmez; böylece Pekiştir'i açıp çıkmak yarım oturum bırakmaz. IndexedDB yeni sürümde, uygulama kapanınca ya da telefon kilitlenince silinmez.
123. **Devam kartı:** Bugün ekranının en üstünde (Günün sanatçısının üstünde), Pekiştir menüsünde ve Döneme göre ekranında aynı kart görünür: “Kaldığın yerden devam et”, altında “Döneme göre · Gotik · 7 / 20” ya da “Karışık · 3 / 20”, yanında **Devam et** ve **Bitir**. Kart varken Bugün'deki büyük resim üst kenara taşmaz, 460 px'e iner.
124. **Sıra numarası:** şu anki kart tamamlanmışsa (iki soru da cevaplıysa) sıradaki kart gösterilir. 5 kart cevaplanıp yenilenirse devam 6. karttan sürer.
125. **Aynı kart, aynı eser, aynı adım:** yarım kart, kayıttaki eser anahtarıyla bulunur. Seçenekler, adım ve verilen cevaplar aynen geri gelir.
    - Örneğin sanatçı cevaplanmış ama akım cevaplanmamışsa “Soru 2 / 2”den sürer.
    - Yeni kart gösterildiği anda da kayıt yazılır. Böylece cevaplanmamış kart da aynı eserle döner.
126. **Leitner:** verilen cevaplar kayıtta olduğu için yeniden sayılmaz. Cevaplanmış soruların düğmeleri kapalı gelir. Günlük kart sayısı ve yeni sanatçı sayacı da bir kez artar. Devam edilen oturum aynı oturumdur:
    - Yanlışların tekrar kuyruğu ve tekrar sınırı (3) sürer.
    - Tur sonundaki doğru/yanlış özeti bütün oturumu kapsar.
127. **Atlanan kartlar:** sanatçı veride yoksa ya da artık açık değilse (konu işaretinin kaldırılması) kart kuyruktan çıkar. Kayıttaki eser bulunamazsa ya da seçeneklerden biri veride yoksa yarım kart atlanır. Hiç kart kalmazsa kayıt silinir.
128. **Çakışma:** yarım oturum varken yeni bir oturum başlatılırsa sayfa içinde “Yarım kalan oturum silinsin mi?” sorusu çıkar (`confirm()` yok). Düğmeler: “Sil, yeni başla” ve “Hayır, devam et”. Uygulama yarım oturum varken bir oturum adresinde açılırsa (yenileme, yeni sürüm) Bugün'e döner; bu, devam kartını gösterir ve yanlışlıkla soru ekranına düşmeyi önler.
129. **Silme:** “Bitir”e basılınca ya da tur bitince kayıt silinir. 7 günden eski ya da bozuk kayıt açılışta sessizce silinir.
130. **Yedek:** yedek JSON'una `yarimOturum` alanı eklendi (varsa). Geri yüklemede doğrulanır; geçersizse ya da yedekte yoksa mevcut yarım oturum silinir. Yedek biçiminin sürümü değişmedi, eski yedekler aynen yüklenir.
131. **Testler:** `tests/unit/devam.test.mjs` (kayıt, 7 gün, aynı kart/adım, atlama, sayaçlar, özet, yedek) ve `tests/e2e/devam.spec.js`. Uçtan uca testler:
    - 5 kart cevapla, yenile, Devam et ile 6. karttan aynı eserle sür; skor ve günlük sayı değişmesin.
    - Akım sorusundan devam et.
    - Yeni oturumda sayfa içi soru çıksın.
    - Bitir kaydı silsin.
    - 7 günlük kayıt silinsin.
    
    Yedek testi yarım oturumun gidiş-dönüşünü de denetler. SW 1.7.0.

## WikiArt · yedek görsel kaynağı (2026-10-20)

132. **Yalnızca derleme zamanı:** WikiArt'ı yalnızca `scripts/kaynaklar/wikiart.mjs` kullanır. Telefon WikiArt API'sine hiç gitmez, yalnızca `uploads*.wikiart.org` görsellerini indirir; service worker bunları diğer görseller gibi önbelleğe alır.
    - Anahtarlar yalnızca `WIKIART_ACCESS_KEY` ve `WIKIART_SECRET_KEY` ortam değişkenlerinden okunur. Depoya, önbelleğe ve günlüğe yazılmaz; günlüğe giden her metinden silinir.
    - Oturum anahtarı yalnızca bellekte tutulur.
133. **Canlı denenen API** (belge eski):
    - **Çalışanlar:**
      - v2 `GET /en/Api/2/login?accessCode=…&secretCode=…` → `SessionKey`; hesap sınırı saatte 400 istek ve 10 oturum.
      - v2 `GET /en/api/2/Painting?id=…&imageFormat=HalfHD&authSessionKey=…` → tür (`genres`), üslup, malzeme (`media`), müze, eser adresi ve görsel. Görsel adresi HalfHD varsa `…!HalfHD.jpg`, yoksa özgün dosyadır.
      - v2 `PaintingSearch?term=…` (sanatçı adresi tahmini tutmazsa yedek olarak).
      - v2 `PaintingsByArtist?id=<v2 sanatçı kimliği>`: çalışıyor ama kronolojik sıralı ve v2 sanatçı kimliği isteyen bir uç nokta. Belgedeki `artistUrl=` ve `id=<adres>` biçimleri 404 “Artist not found” döndürüyor.
    - **v2'de olmadığı için sitenin eski JSON uç noktaları:**
      - Sanatçı ayrıntısı (v2 belgesinde “TODO”): `GET /en/<adres>?json=2` → ad, özgün ad, doğum ve ölüm.
      - Öne çıkanlar (bilinirlik sırası): `/en/<adres>/mode/featured?json=2&layout=new&page=1&resultType=masonry`.
      - Tam liste: `/en/<adres>/mode/all-paintings?json=2&…&page=N` (kronolojik, görsel boyutlarıyla). Bu listelerdeki eser kimlikleri v2 kimlikleri.
      - `mode/popular` ve `mode/most-viewed` 302 döndürüyor, yok.
    - **Kullanılmayan:** eski `App/Painting/ImageJson/<id>` çalışıyor, ama görsel adresini her zaman `!Large.jpg` veriyor. Özgünü 750×600'den küçük eserlerde bu adres 404 (denendi).
134. **Görsel adresi:** veride v2'nin verdiği adres saklanır (HalfHD ya da küçükse özgün dosya). Uygulama 400 px ve altındaki küçük resimlerde `!HalfHD.jpg` yerine `!Large.jpg` ister. HalfHD varsa Large da vardır, çünkü küçük resimler yalnızca özgün dosya daha büyükse üretilir. WikiArt görselleri CORS'a açık (`*`), bu yüzden resim rengi paleti de çıkarılabiliyor.
135. **Sınırlar:**
    - En çok 3 istek/sn: ardışık istekler arasında ≥ 354 ms.
    - En çok 350 istek/saat ve 8 oturum/saat: kayan pencereyle. Zaman damgaları `scripts/.ham/wikiart/gunluk.json`'da tutulduğu için betik yeniden başlasa da geçerli.
    - Sınır dolunca betik bekler.
    - 429 alınca 60 sn beklenir. 5xx'te üstel geri çekilme yapılır; v2'de 5xx alınırsa oturum bir kez yenilenir. Süresi dolan oturum 500 döndürdü (gözlendi), Magritte/Miró/Bacon ilk çalıştırmada bu yüzden düştü.
    - Ham yanıtlar `scripts/.ham/wikiart/yanit/` altında (git'e girmez). Kesilen çalıştırma aynı komutla kaldığı yerden sürer.
    - Bu iş toplam ≈ 660 istek tuttu.
136. **Hangi sanatçılar:**
    - Pekiştirmede kullanılabilir eseri (WikiArt katkısı çıkarılarak sayılır) 12'den az olanlar.
    - 20. yüzyıl akımları. Veride Fütürizm ve Pop ayrı akım olarak yok; “Fütürizm'den Savaş sonrası/Pop'a” aralığını Kübizm, Dada, Sürrealizm ve Savaş sonrası figürasyon olarak aldım. Kübizm, Fütürizm'in komşusu ve aynı yıllarda.
    - Ekspresyonizm'in kalabalık sanatçıları (Munch, Kirchner, Kandinsky, Marc) dışarıda kaldı. Nolde az eseri olduğu için girdi.
    - `ana_ugras_disi` listesindekiler ve doğum yılı bilinmeyenler (eşleştirilemez) hiç sorgulanmadı.
137. **Eşleştirme:** WikiArt'taki ad, özgün ad ya da “soyad ad” biçimi bizim `ad`/`ad_arama`/Wikidata İngilizce adlarından biriyle aynı olmalı ve doğum yılı ±3 tutmalı.
    - Ölüm yılı da biliniyorsa ±3 tutmalı; tutmazsa eşleşme **şüpheli** sayılır. Yalnızca soyad tutuyorsa ya da antik sanatçıda doğum ±15 ise de şüpheli sayılır.
    - Şüpheli eşleşmenin görselleri puan 5 alır: Göz At'ta görünür, pekiştirmeye girmez.
    - Eşleşmeyen sanatçıdan hiçbir şey alınmaz.
    - Bu çalıştırmada şüpheli eşleşme çıkmadı.
138. **Yalnızca resim:**
    - WikiArt tür sözlüğünden (grup 3) şu türler çıkarılır: heykel, mimari, fotoğraf, enstalasyon, tasarım, performans, video, animasyon, mobil/stabil, takı, süs, eşya, nesne, mobilya, dijital, seramik, mozaik, duvar halısı, reklam, sahte/kopya.
    - Malzemesi yalnızca heykel ya da nesne malzemesi olanlar (mermer, bronz, taş, alçı, cam, metal…) çıkarılır.
    - Fotoğraf malzemesi olanlar (gelatin silver, photogram…) her durumda çıkarılır.
    - Başlığında “film still / photograph / rayograph / readymade” geçenler de çıkarılır.
    - Eser yılı sanatçının çalışma hayatı dışındaysa alınmaz (müzelerdeki kuralın aynısı). Görselin uzun kenarı 400 px'ten kısaysa da alınmaz. Telifli eserlerin WikiArt görselleri çoğunlukla ~350×470 olduğu için ilk düşünülen 500 px sınırı Höch'ü neredeyse boşaltıyordu.
139. **Hangi 40 eser:** önce WikiArt'ın öne çıkardıkları (bilinirlik sırası), sonra tam listeden on yıllara göre sırayla birer eser (her on yılda büyük görsel önce). Böylece 40 eser kariyerin tamamına yayılır.
    - Uzun listelerde en çok 8 sayfa, eşit aralıkla okunur.
    - Sanatçı başına en çok 60 eser ayrıntısı istenir.
    - Kabul edilenler: öne çıkanlar, sonra üslubu akımına uyanlar (ör. Sürrealizm → Surrealism), sonra diğerleri.
140. **Veri:** `data/wikiart.json` sanatçı başına durum ve eser listesi tutar. Her eserde yalnızca başlık, yıl, eser sayfası ve görsel URL'si var; depoda görsel dosyası yok. `data/eserler_onbellek.json`'a ağa gitmeden uygulanır (`UYGULA=1 node scripts/kaynaklar/wikiart.mjs`). Uygulama önce eski WikiArt katkısını siler, bu yüzden tekrar uygulamak sonucu değiştirmez. `scripts/onbellek.mjs` de tam yeniden üretimin sonunda `data/wikiart.json`'ı aynı fonksiyonla (`wikiartiUygula`) ekler.
141. **Kopyalar:** WikiArt eseri mevcut bir eserle başlık + yıl (±5) tutarsa (Türkçe başlık + İngilizce başlık dahil) yeni eser açılmaz, görsel o esere eklenir.
    - İki yıl da bilinmeli. “Self-Portrait”, “Landscape” gibi genel başlıklar yılsız birleşmesin diye.
    - Bir esere en çok bir WikiArt eseri katılır.
    - Aynı başlık ve yılı taşıyan iki WikiArt kaydı da tek esere iner (ör. Arp *The Sun Recircled*). Bu yüzden “alınan” ile “yeni + birleşen” sayısı birkaç farklı olabilir.
142. **Görsel önceliği:** müze taraması (100) > Google Art Project (80) > müze kaynaklı Commons (70) > diğer Commons (50) > **WikiArt (40)** > fotoğraf gibi (10) > elle kötü / şüpheli WikiArt (5). Dalí'nin *Büyük Mastürbatör*'ünde (1929) Commons'taki elle “kötü” işaretli fotoğrafın yerine WikiArt görseli ilk görsel oldu ve eser pekiştirmeye girdi.
143. **Altyazı:** görüntüleyicide “Kaynak: WikiArt · eser sayfası” (WikiArt sayfasına bağlantı), pekiştirme cevap yaprağında da aynı satır. Ayarlar'daki künyeye “WikiArt” eklendi.
    - Lisans: WikiArt'taki 20. yüzyıl eserleri telifli. Kişisel, ticari olmayan çalışma için kullanılıyor; görseller depoya konmuyor, yalnızca bağlantıları var.
144. **Ana uğraşı resim olmayanlar:** Alberti'nin WikiArt'taki tek eseri bronz otoportre kabartması, Brunelleschi'ninki bir makine çizimi. İkisi `ana_ugras_disi` listesine eklendi (Ghiberti ve Cellini için verilen 43. kararla aynı gerekçe). Donatello WikiArt'ta eşleşti ama tür süzgecinden resim çıkmadı.
145. **Bilinen sınır:** Arp'ın ve birkaç Man Ray eserinin WikiArt'ta malzemesi boş. Bunlar arasında boyalı ahşap kabartma ya da asamblaj olabilir, tür alanı “abstract/figurative” dediği için ayıklanamadı. Görüntüleyicideki “Görsel kötü” düğmesiyle tek tek çıkarılabilir.
146. Testler: `tests/unit/wikiart.test.mjs` aşağıdakileri sınar. Uçtan uca testler WikiArt görsellerini fikstürle yanıtlar. SW 1.8.0.
    - adres üretimi, yıl çözme, eşleşme (kesin/şüpheli/eşleşmez),
    - resim süzgeci, aday sırası, sayfa seçimi, hedef seçimi, istek sınırlayıcı,
    - birleştirme (kopya, yeniden uygulama, şüpheli), puan sırası ve uygulamadaki adres ve altyazı.

### WikiArt: sanatçı başına sonuç

Toplam: 13 sanatçıya 388 WikiArt eseri (yeni ya da mevcut esere katılan). Önbellekte artık 6762 eser var. “Pekiştirmede kullanılabilir” sütunu, WikiArt dahil toplam kullanılabilir eser sayısıdır (uygulama pekiştirmede bunların ilk 12'sini kullanır).

| Sanatçı | Akım | WikiArt | Alınan | Yeni eser | Birleşen | Pekiştirmede kullanılabilir (toplam) | Not |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Phidias | Antik Yunan ve Roma | eşleşmedi | 0 | 0 | 0 | 0 | WikiArt’ta ad + doğum yılı (±3) tutan sanatçı yok |
| Polykleitos | Antik Yunan ve Roma | eşleşmedi | 0 | 0 | 0 | 0 | WikiArt’ta ad + doğum yılı (±3) tutan sanatçı yok |
| Myron | Antik Yunan ve Roma | eşleşmedi | 0 | 0 | 0 | 0 | WikiArt’ta ad + doğum yılı (±3) tutan sanatçı yok |
| Hagesandros, Athenodoros ve Polydoros (Laokoon heykeltıraşları) | Antik Yunan ve Roma | atlandı | 0 | 0 | 0 | 0 | doğum yılı bilinmiyor, eşleştirilemez |
| Praxiteles | Antik Yunan ve Roma | eşleşmedi | 0 | 0 | 0 | 0 | WikiArt’ta ad + doğum yılı (±3) tutan sanatçı yok |
| Gislebertus | Romanesk | atlandı | 0 | 0 | 0 | 0 | doğum yılı bilinmiyor, eşleştirilemez |
| Diotisalvi | Romanesk | atlandı | 0 | 0 | 0 | 0 | doğum yılı bilinmiyor, eşleştirilemez |
| Nicola Pisano | Gotik | eşleşmedi | 0 | 0 | 0 | 0 | WikiArt’ta ad + doğum yılı (±3) tutan sanatçı yok |
| Giovanni Pisano | Gotik | eşleşmedi | 0 | 0 | 0 | 0 | WikiArt’ta ad + doğum yılı (±3) tutan sanatçı yok |
| Arnolfo di Cambio | Gotik | eşleşmedi | 0 | 0 | 0 | 0 | WikiArt’ta ad + doğum yılı (±3) tutan sanatçı yok |
| Bonaventura Berlinghieri | Gotik | eşleşmedi | 0 | 0 | 0 | 5 | WikiArt’ta ad + doğum yılı (±3) tutan sanatçı yok |
| Domenico di Michelino | Erken Rönesans | eşleşmedi | 0 | 0 | 0 | 11 | WikiArt’ta ad + doğum yılı (±3) tutan sanatçı yok |
| Lorenzo Ghiberti | Erken Rönesans | atlandı | 0 | 0 | 0 | 0 | ana uğraşı resim değil (eser_turleri.json) |
| Donatello | Erken Rönesans | eşleşti (`donatello`) | 0 | 0 | 0 | 0 | resim türünde eser kalmadı |
| Michelozzo | Erken Rönesans | eşleşmedi | 0 | 0 | 0 | 0 | WikiArt’ta ad + doğum yılı (±3) tutan sanatçı yok |
| Leon Battista Alberti | Erken Rönesans | atlandı | 0 | 0 | 0 | 0 | ana uğraşı resim değil (eser_turleri.json) |
| Filippo Brunelleschi | Erken Rönesans | atlandı | 0 | 0 | 0 | 0 | ana uğraşı resim değil (eser_turleri.json) |
| Donato Bramante | Yüksek Rönesans | eşleşti (`donato-bramante`) | 9 | 9 | 0 | 14 |  |
| Giambologna | Maniyerizm | atlandı | 0 | 0 | 0 | 0 | ana uğraşı resim değil (eser_turleri.json) |
| Benvenuto Cellini | Maniyerizm | atlandı | 0 | 0 | 0 | 0 | ana uğraşı resim değil (eser_turleri.json) |
| Andrea Palladio | Maniyerizm | atlandı | 0 | 0 | 0 | 0 | ana uğraşı resim değil (eser_turleri.json) |
| Carlo Maderno | İtalyan Barok ve Caravaggizm | eşleşmedi | 0 | 0 | 0 | 0 | WikiArt’ta ad + doğum yılı (±3) tutan sanatçı yok |
| Gian Lorenzo Bernini | İtalyan Barok ve Caravaggizm | atlandı | 0 | 0 | 0 | 0 | ana uğraşı resim değil (eser_turleri.json) |
| Louis Le Vau | Fransız Klasisizmi | atlandı | 0 | 0 | 0 | 0 | ana uğraşı resim değil (eser_turleri.json) |
| André Le Nôtre | Fransız Klasisizmi | atlandı | 0 | 0 | 0 | 0 | ana uğraşı resim değil (eser_turleri.json) |
| Jules Hardouin-Mansart | Fransız Klasisizmi | atlandı | 0 | 0 | 0 | 0 | ana uğraşı resim değil (eser_turleri.json) |
| André-Charles Boulle | Fransız Klasisizmi | eşleşmedi | 0 | 0 | 0 | 0 | WikiArt’ta ad + doğum yılı (±3) tutan sanatçı yok |
| Jacques-Germain Soufflot | Neoklasisizm | atlandı | 0 | 0 | 0 | 0 | ana uğraşı resim değil (eser_turleri.json) |
| Lord Burlington | Neoklasisizm | eşleşmedi | 0 | 0 | 0 | 0 | WikiArt’ta ad + doğum yılı (±3) tutan sanatçı yok |
| Thomas Jefferson | Neoklasisizm | eşleşmedi | 0 | 0 | 0 | 0 | WikiArt’ta ad + doğum yılı (±3) tutan sanatçı yok |
| Horatio Greenough | Neoklasisizm | atlandı | 0 | 0 | 0 | 0 | ana uğraşı resim değil (eser_turleri.json) |
| Antonio Canova | Neoklasisizm | atlandı | 0 | 0 | 0 | 0 | ana uğraşı resim değil (eser_turleri.json) |
| Charles Barry ve Augustus Pugin | Romantizm | atlandı | 0 | 0 | 0 | 0 | ana uğraşı resim değil (eser_turleri.json) |
| Charles Garnier | Akademizm ve Oryantalizm | eşleşmedi | 0 | 0 | 0 | 0 | WikiArt’ta ad + doğum yılı (±3) tutan sanatçı yok |
| Auguste Rodin | Post-Empresyonizm | atlandı | 0 | 0 | 0 | 0 | ana uğraşı resim değil (eser_turleri.json) |
| Emil Nolde | Ekspresyonizm | eşleşti (`emil-nolde`) | 24 | 24 | 0 | 25 |  |
| Pablo Picasso | Kübizm | eşleşti (`pablo-picasso`) | 40 | 33 | 4 | 50 |  |
| Marcel Duchamp | Dada | eşleşti (`marcel-duchamp`) | 40 | 36 | 3 | 40 |  |
| Hannah Höch | Dada | eşleşti (`hannah-hoch`) | 12 | 12 | 0 | 14 |  |
| Jean Arp | Dada | eşleşti (`jean-arp`) | 40 | 36 | 2 | 38 |  |
| Man Ray | Dada | eşleşti (`man-ray`) | 33 | 32 | 1 | 34 |  |
| Salvador Dalí | Sürrealizm | eşleşti (`salvador-dali`) | 40 | 39 | 1 | 40 |  |
| Max Ernst | Sürrealizm | eşleşti (`max-ernst`) | 40 | 40 | 0 | 40 |  |
| René Magritte | Sürrealizm | eşleşti (`rene-magritte`) | 40 | 37 | 2 | 39 |  |
| Joan Miró | Sürrealizm | eşleşti (`joan-miro`) | 40 | 38 | 1 | 39 |  |
| Francis Bacon | Savaş sonrası figürasyon | eşleşti (`francis-bacon`) | 40 | 36 | 2 | 38 |  |

## İş 1 · Ek notlar ve yan yana karşılaştırma (2026-10-20)

1. **İki isteğe bağlı veri dosyası:** `data/tanima_notlari.json` (`{"surum":1,"notlar":{"<sanatciId>":"metin"}}`) ve `data/eser_notlari.json` (anahtar eserin QID'i, QID yoksa `"<sanatciId>|<eser başlığı>"`). Açılışta diğer veri dosyalarıyla aynı anda istenir; yoksa ya da bozuksa boş kabul edilir (`js/karsilastir.js` → `notlariAl`). Service worker bunları isteğe bağlı kabuk dosyası olarak önbelleğe alır. İçerikleri (Kimi K3 ve Qwen taslakları) denetimden sonra ayrıca eklenecek.
2. **"Nasıl tanırım?":** önce sanatçının kendi `taninma` alanı, yoksa `tanima_notlari.json`'daki not. Aynı kural pekiştirmedeki ipucu satırında da kullanılır (karışık kartta akımı ele veren ipucu kuralı değişmedi).
3. **Eser notu:** tam ekran görüntüleyicide başlığın altında. Pekiştirmede cevaptan önce görüntüleyici gizli kipte açıldığı için not da görünmez.
4. **Yan yana karşılaştırma:** `#/karsilastir/<a>/<b>`; sekme çubuğu yok, geri düğmesi tarayıcı geçmişine döner. İki sütun: ad (kısa ad kuralı), yıllar, akım, "Nasıl tanırım?", bilinirlik sırasına göre 4 eser alt alta, kırpılmadan; esere dokununca görüntüleyici (notuyla). Kilitli sanatçıda "Henüz kursta yok" rozeti.
5. **Girişler:** (a) sanatçı sorusunda yanlış cevapta cevap yaprağında "Karşılaştır: Doğru ↔ Seçtiğin" bağlantısı; oturum bellekte kaldığı için geri dönünce kart aynı (cevaplanmış) halde sürer, yarım oturum kaydı değişmez. (b) Sanatçı sayfasında "Karşılaştır" açılır listesi: aynı akım önce, sonra komşu akımlar, doğum yılı farkı ≤ 50, en çok 8 sanatçı.
6. **Test yarışı:** `smoke.spec.js` yedekle/geri yükle testinde, sayfa yenilendikten hemen sonra ilerleme okunuyordu; yük altında uygulama ilerlemeyi henüz yazmamış olabiliyordu. Okumadan önce kaydın oluşması bekleniyor.
7. Sürüm 1.9.0.

## İş 2 · Notların içeriği ve içerik denetimi (2026-10-20)

1. **`data/tanima_notlari.json`:** kursta olup kendi `taninma` alanı olmayan 83 sanatçı için "Nasıl tanırım?" notu. Taslak Kimi K3'ten; Claude her notu okudu, meta cümleleri ("listede…") çıkardı, yanlış ya da belirsiz olanları yeniden yazdı (ör. Domenico di Michelino, Bramante), yabancı adlardan sonraki ekleri düzeltti (Renoir'ın, Ingres'in…).
2. **`data/eser_notlari.json`:** 513 eser notu (sanatçı başına en çok 4 eser, kurs eserleri önce). Taslak Qwen 3.8'den; model "emin değilim" dediği ya da boş bıraktığı 21 not ve Claude'un doğrulayamadığı 1 not (Höch, *Man and Machine*) atıldı; yaklaşık 30 not düzeltildi (ör. Darmstadt Madonnası'ndaki figürler azizler değil Meyer ailesi; Puvis de Chavannes'ın *Yoksul Balıkçı*'sı ağ atmıyor; Ernst'in *Arkadaşlar Buluşması* kolaj değil yağlıboya grup portresi). Anahtar: eserin QID'i, yoksa `sanatçıId|başlık`.
3. **İçerik denetimi:** üç modelin raporları birleştirildi, her iddia Claude tarafından kontrol edildi: 261 düzeltme uygulandı, 198 iddia reddedildi. Tam liste (gerekçeleriyle): `referans/icerik_denetimi_2026-10.md`. Brief §12 `sanatcilar.json`'daki içerik alanlarına dokunmamayı söylüyor; bu düzeltmeler Emre'nin açık isteğiyle yapıldı ve yalnızca açık hatalarla sınırlı tutuldu. `akim`, `konu`, `kaynak`, görsel alanları değişmedi.
4. **En önemli bulgu:** bazı `kurs_notu` alanları ders notlarındaki adaşından kaymıştı (Charles Le Brun/Garnier/Barry ← aktör Charles Laughton; Louis Le Vau ← XV. Louis; Henry Fuseli ← IV. Henri; Thomas Jefferson ← Thomas Aquinas; Francis Bacon ← I. François; Goya ← Francisco Herrera; Blake ← Hogarth; Caillebotte ← Courbet; Pietro Lorenzetti ← Perugino; Orazio ← Artemisia; Ghiberti ← Lorenzo de' Medici). Bu 13 kayıttaki not artık ders notundan değil, Claude'un yazdığı kısa tanımdan oluşuyor.
5. **Wikidata vandalizmi:** Rembrandt'ın *Savurgan Oğlun Dönüşü* kaydının İngilizce etiketi Wikidata'da bozulmuştu; önbellekteki `baslikEn` silindi (uygulamada gösterilmiyordu). `scripts/onbellek.mjs` yeniden çalıştırılırsa Wikidata düzelmediyse geri gelebilir.
6. Sürüm 1.9.1.

## İş 3 · Caravaggio takipçileri (2026-10-20)

1. **Yedi yeni kurs dışı sanatçı**, "İtalyan Barok ve Caravaggizm" akımında, Konu 31 (Caravaggio) ile açılır: Bartolomeo Manfredi, Hendrick ter Brugghen, Gerrit van Honthorst, Dirck van Baburen, Valentin de Boulogne, Jusepe de Ribera, Alessandro Magnasco. Amaç Caravaggio için gerçekten zor yanlış şıklar. Metinleri (anlatim, taninma, önemli eserler) Claude yazdı; emin olunmayan noktalar `emin_degil` alanında.
2. **Ribera** İspanyol Barok'a da konabilirdi; Caravaggio takipçisi olarak tanındığı için Caravaggizm'de tutuldu.
3. **Magnasco** Caravaggio'dan yaklaşık bir asır sonra yaşamış geç Barok bir ressam; Emre'nin isteğiyle eklendi, ayrı bir geç İtalyan Barok akımı olmadığı için bu akıma kondu. Üslubu (küçük, titrek figürler) çok farklı olduğu için onun için zor çeldirici olmaz.
4. **Eser listeleri:** derleme zamanı önbelleğe (`eserler_onbellek.json`) henüz eklenmedi; uygulama bu sanatçıların eserlerini ilk açılışta canlı Wikidata'dan çeker (internet gerekir) ve IndexedDB'de saklar. Önbellek sonraki pakette `node scripts/onbellek.mjs <id…>` ile eklenecek. Biyografi ("Hayatı") bölümü bu sanatçılarda henüz yok.
5. **Caravaggio'nun kurs notu** Degas dersinden kaymıştı ("Gölgelerde kahverengi ve koyu tonlar kullanan eski ressamlar…"); Claude'un yazdığı kısa tanımla değiştirildi.
6. Kısa adlar: Ribera ve Valentin. Sürüm 1.10.0.

## İş 4 · Geç İtalyan Barok ve Bolonya ekolü (2026-10-20)

1. **Yeni akım "Geç İtalyan Barok"** (y. 1640–1750; sıra 15, Fransız Klasisizmi ile Rokoko arasında; komşular: İtalyan Barok ve Caravaggizm, Rokoko, Fransız Klasisizmi; renk #3E7A7A). Sonraki akımların `sira` değeri birer arttı. Akım bilgisi metni Claude taslağı.
2. **Dokuz kurs dışı sanatçı**, Konu 38 (Fransız Barok ve Rokoko) ile, yani Tiepolo ile birlikte açılır: Salvator Rosa, Mattia Preti, Luca Giordano, Giovanni Battista Gaulli (Baciccio), Andrea Pozzo, Francesco Solimena, Giuseppe Maria Crespi, Sebastiano Ricci, Giovanni Battista Piazzetta. Magnasco İş 3'teki geçici yerinden bu akıma taşındı. Ricci, Piazzetta ve Giordano Tiepolo için zor çeldirici olur.
3. **Bolonya ekolü:** Guido Reni ve Guercino, "İtalyan Barok ve Caravaggizm" akımına, Konu 30 (Carracci) ile açılacak şekilde eklendi.
4. **Hata düzeltmesi:** derleme zamanı önbelleği (`eserler_onbellek.json`) varken, önbellekte kaydı olmayan sanatçılar gizleniyordu; İş 3'te eklenen sanatçılar bu yüzden uygulamada görünmeyecekti. Artık önbellekte hiç kaydı olmayan (sonradan eklenmiş) sanatçı "bilinmiyor" sayılıp gösteriliyor ve eserleri canlı Wikidata'dan geliyor; önbellekte boş kaydı olan (heykel, mimari) sanatçılar eskisi gibi gizli.
5. **Günün sanatçısı havuzu:** eser önbelleği varken yalnızca önbellekte kaydı olan sanatçılardan seçilir (görseli çevrimdışı da hazır olsun). Yeni eklenen 16 sanatçı önbellek yenilenince havuza girer. Havuz değiştiği için günün sanatçısı sırası da değişti.
6. **Akım bilgisi kaynak satırı:** denetimden geçen 28 akımda "Qwen denetimi bekliyor" yerine "Qwen ve Kimi ile denetlendi"; yeni akımda "henüz denetlenmedi".
7. Tavan freskleri (Gaulli, Pozzo, Giordano) telefonda küçük görünebilir; görsel denetiminde bakılacak. Sürüm 1.11.0.

## İş 5 · Öğrenme yöntemi: tanışma ve karşıtlık (2026-10-21)

Dayanak: aralıklı tekrar ve karışık (interleaved) çalışma zaten vardı. Eksik iki şey eklendi: yeni sanatçıyla ilk karşılaşmadan önce kısa bir tanışma ve sık karıştırılan ikilileri yan yana görme (Kang ve Pashler 2012, ressam üsluplarının yan yana gösterildiğinde daha iyi ayırt edildiğini bulmuştu).

1. **Tanışma:** Bir sanatçı hiç sorulmamışsa (ne sanatçı ne akım skoru var) ilk kartından önce tanışma ekranı gelir: ad, yıllar, akım, en bilinen 3 uygun eser (dokununca görüntüleyici, eser notuyla) ve "Nasıl tanırım?" metni. Soru, tanışmada gösterilmeyen bir eserle gelir. Yarım oturumdan dönülen kartta tanışma tekrarlanmaz. Ayarlar'da "Yeni sanatçıyla önce tanış" anahtarıyla kapatılabilir (`ayarlar.tanisma`, varsayılan açık). Testlerde `window.__atlasTanismaYok` ile kapalıdır; `tests/e2e/ogrenme.spec.js` açar.
2. **Karıştırılan ikililer:** Sanatçı sorusunda her yanlış cevap `ilerleme.karisanlar` içinde ikili olarak sayılır (`"a|b": { n, son }`, yedeğe dahil). Aynı ikili 2. kez (ve sonrasında) karıştırılınca cevap yaprağında iki sanatçının en bilinen ikişer eseri yan yana gösterilir (sorulan eser hariç); tam karşılaştırma bağlantısı da durur.
3. **İlerleme:** "En çok karıştırdıkların" bölümü: en az 2 kez karıştırılan en fazla 5 ikili, yan yana karşılaştırma ekranına bağlantıyla.
4. Mantık `js/ogrenme.js`'de (birim testli). Sürüm 1.12.0.

## İş 6 · Türkçe eser adları (2026-10-21)

1. **`data/eser_adlari_tr.json`** (`{"surum":1,"adlar":{"<QID ya da sanatçıId|başlık>":"Türkçe ad"}}`): yaklaşık 7.450 eser adı Claude API (Sonnet 5.5, Batch) ile Türkçeleştirildi. Betikler Emre'nin Mac'inde çalışır (`icerik/claude_adlar.py`, `icerik/adlar_uygula.py`); anahtar `~/.claude_api_key`'de, repoda değil. Yerleşik Türkçe adlar tercih edildi; katalog gürültüsü (envanter no, müze adı) atıldı; şüpheli görülenler (çok kısa/uzun, biçim bozuk) dosyaya alınmadı.
2. **Uygulamada:** eser nesnesine `ad` alanı eklenir; galeriler, karşılaştırma, tanışma, cevap yaprağı ve görüntüleyici Türkçe adı gösterir. Görüntüleyicide Türkçe ad özgünden farklıysa özgün ad altında küçük satırda durur (yanlış çeviri fark edilsin diye). `baslik` değişmez: eser notları, yinelenen eser ayıklama ve kayıtlar onu kullanmaya devam eder.
3. Dosya yoksa uygulama özgün adları gösterir. Sürüm 1.13.0.

## İş 7 · Zorluk sıralaması (2026-10-21)

1. **`data/eser_zorluk.json`** (`{"surum":1,"kolaylik":{"<QID ya da sanatçıId|başlık>": 2–10}}`): her sanatçının pekiştirme havuzundaki (en fazla 12) eser, Claude API'ye (Opus 5.5, Batch) görselleriyle birlikte sanatçı başına tek istekte gönderildi. Claude her eseri "üslubu ne kadar tipik gösteriyor" (1–5) ve "ne kadar ünlü" (1–5) diye, aynı sanatçının eserleri arasında karşılaştırarak puanladı. Kolaylık = tipiklik + ünlülük. Betik: `icerik/claude_zorluk.py` (Emre'nin Mac'inde; görseller 512 px'e küçültülüp gönderilir).
2. **Kullanım (öğrenme sırası):** pekiştirmede eser seçilirken sanatçının sanatçı sorusundaki Leitner kutusu seviye sayılır. Kutu 0–1 (yeni ya da yanlış yapılan): puanlı adayların en kolay yarısından. Kutu 2–3: hepsinden. Kutu 4–5: en zor yarısından. Önce tipik ve ünlü eserlerle üslup oturur, sonra az bilinen ve alışılmadık eserlerle sınanır. "Son gösterilenlerden kaçın" kuralı önce uygulanır. Puansız eserler yalnızca orta seviyede gelir; puanlı aday 2'den azsa süzme yapılmaz.
3. **Tanışma** ekranındaki 3 eser artık en kolaylar (en tipik + ünlü); puan yoksa eskisi gibi bilinirlik.
4. Dosya yoksa davranış eskisi gibi (rastgele). Sürüm 1.14.0.

## İş 8 · Başyapıt yakın okumaları (2026-10-21)

1. **Seçim (107 eser):** her kurs sanatçısının en ünlü ve en tipik eseri (İş 7'deki puanlarla; 83 eser) ve her akımdan en ünlü bir kurs dışı eser (24). Liste `icerik/basyapit_secim.json`.
2. **Üretim:** Claude Opus 5.5, görseli (1024 px) ve künyesiyle eser başına iki istek: (a) yazım: "Ne görüyoruz?", "Kompozisyon, ışık ve renk", "Anlam ve semboller", "Neden önemli?" (toplam 250–350 kelime), "Yakından bak" (3 ayrıntı). Emre'nin isteğiyle soru yok: bölüm yalnızca okuma ve bilgi; (b) denetim: aynı görsel ve metin ayrı istekte olgu, tartışmalı yorum ve Türkçe açısından kontrol edilir, düzeltilmiş metin kullanılır. Betik `icerik/claude_okuma.py`.
3. **`data/basyapitlar.json`** (isteğe bağlı; yoksa sayfa "Henüz yakın okuma yok" der). Yalnızca açılınca indirilir.
4. **Ekranlar:** Göz At'ın başında "Başyapıt okumaları" girişi → akımlara göre zaman sıralı liste (`#/basyapitlar`; kursta henüz işlenmemiş sanatçılarda "henüz kursta yok" rozeti, ama okunabilir) → okuma sayfası (`#/basyapit/<anahtar>`; büyük görsel, dokununca görüntüleyici). Sanatçı sayfasında o sanatçının okumasına "Yakın okuma" bağlantısı.
5. Sürüm 1.15.0.

## İş 9 · Konular ve hikâyeleri (2026-10-21)

1. **Neden:** Avrupa resminin büyük kısmı aynı İncil, aziz ve mitoloji hikâyelerini anlatır; hikâyeyi bilmeden resim okunmaz. Aynı konunun farklı ressamlardaki hâlini yan yana görmek üslubu da öğretir.
2. **Üretim** (`icerik/claude_konular.py`): (a) 7.450 eserin konusu adlarından bulundu (Sonnet 5.5, Batch); yerleşik İngilizce konu adlarına indirgendi (ör. "Descent from the Cross" → Deposition). (b) En az 3 eserde geçen en çok 120 konu için Opus 5.5 Türkçe hikâye (kaynağıyla), tek cümlelik özet ve "resimde nasıl tanınır" işaretleri yazdı; ayrı bir istekte denetlendi.
3. **`data/ikonografi.json`** (isteğe bağlı): konular ve her konunun eserleri (`[anahtar, sanatçıId]`, zaman sırasıyla).
4. **Ekranlar:** Göz At'ta "Konular ve hikâyeleri" → türe göre liste (Eski Ahit, Yeni Ahit, Azizler, Mitoloji, Tarih ve edebiyat) → konu sayfası: hikâye, tanıma işaretleri, bu konuyu işleyen bütün eserler (ızgara; dokununca görüntüleyicide aralarında geçiş). Görüntüleyicide eserin konusu varsa "Konu: … →" bağlantısı (cevaptan önceki gizli kipte gösterilmez). Konu verisi açılıştan 1,5 sn sonra arka planda yüklenir.
5. Eser nesnelerine `sid` (sanatçı kimliği) eklendi. Sürüm 1.16.0.

## İş 10 · Hata denetimi (Claude Code)

Kaynak: dış bir hata denetimi raporu ("bazen resimler yüklenmiyor") ve görsel adreslerinin ölçümü. Her madde kodda doğrulandı; düzeltilenler aşağıda. Playwright bu bilgisayarda çalışmadığı için e2e yalnızca güncel tutuldu (`pwa.spec.js` yeni önbellek adını okur); birim testleri geçti (`tests/unit/hata_denetimi.test.mjs`, 146/146). Sürüm 1.17.0.

### Düzeltilenler

1. **Opak hata yanıtları önbelleğe giriyordu (rapor 1).** Doğrulandı: `getir` her `no-cors` yanıtını (`y.type === 'opaque'`) 30 gün saklıyordu; 429/403 de buna dahildi. Şimdi `sw.js` CORS'a açık sunucuları (upload/thumb.wikimedia.org, api.nga.gov, www.artic.edu) `cors` kipiyle ister ve yalnızca `ok` + `image/*` yanıtı saklar; CORS yoksa `no-cors`'a düşer (opak, doğrulanamaz). Opak kaynaklar (WikiArt, Met, Cleveland) için sayfa yüklenemeyen görseli `resim-sil` iletisiyle bildirir, service worker kaydı siler. Eski `atlas-resim` önbelleği yeni ad `atlas-resim-2`'ye geçilerek ve `activate`'te silinerek temizlenir (meta kayıtları da). Bayatlayan kaydı yeniden doğrulama kaldırıldı: görseller değişmeyen dosyalardır, sağlam kaydın üstüne hata yazılamaz. Rapordaki "opak kaynakları da cors dene" önerisini yalnızca CORS'u bilinen dört sunucuyla sınırladım; Met/Cleveland/WikiArt'ın CORS başlığı doğrulanmadı.
2. **Commons standart dışı genişlik (rapor 2).** Doğrulandı (`Special:FilePath?width=400/800/1200`). `gorselUrl` artık doğrudan `upload.wikimedia.org/.../thumb/` adresi üretir, genişlik 330/500/960/1280/1920 basamağına yuvarlanır (400→500, 800→960, 1200→1280); TIFF/PDF/DjVu önekleri ve `paletUrl` aynı işlevi (`commonsKucuk`) kullanır. Özgünden büyük genişlikte bu adres hata verebildiğinden `data-yedek` Commons için eski `Special:FilePath?width=800` adresidir (`gorselYedek`); görüntüleyici de aynı yedeğe düşer. `tahminiBoyut` değişmedi: `width` parametresi olmayan adreslerde 180 KB varsayar, bu kabul edilebilir bir tahmin. Rapordaki "özgün genişliği veriye yaz" önerisi yapılmadı (`data/` değişmez).
3. **İstek yığılması (rapor 3, kısmen).** Service worker'da Wikimedia için eşzamanlılık sınırı (4) ve 429'da (cors kipinde görülebildiğinden) `Retry-After`'a (en çok 5 sn) uyan tek tekrar eklendi. "Çevrimdışı indir" 4 yerine 2 işçi kullanır, `cors` ile istediği için 429/hata artık "indirilemedi" sayılır. Yapılmadı: tüm boyutları iki boyuta indirme (1200/800/400/330 birleştirme); tasarım ve görünüm değişirdi, sorunun asıl kaynakları (2. ve 1. madde) giderildi.
4. **Kota hatası görseli düşürüyordu (rapor 4, 8).** Doğrulandı: `await c.put` fırlatırsa `return y` çalışmıyordu ve yanıt, önbellek ile IndexedDB yazımı bitene kadar bekliyordu. `sakla()` yazımı `e.waitUntil` ile arka plana aldı; yanıt hemen döner. `put` başarısızsa zorla budanıp bir kez daha denenir, yine olmazsa sessizce vazgeçilir. Gerçek boyut yalnızca `content-length` varsa (cors) kullanılır; opak boyutlar tahmin kalır. (Rapordaki `blob()` ile boyut ölçme, görseli belleğe okutacağı için yapılmadı.)
5. **IndexedDB takılması ve sahipsiz girdiler (rapor 5).** Doğrulandı: `tx()` `abort` dinlemiyordu, `dbAc()` reddedilen/kapanan bağlantıyı sıfırlamıyordu, `budama` yalnızca meta listesine bakıyordu. `t.onabort` eklendi, bağlantı kapanınca/reddedilince `db` sıfırlanır, `budama` önbellek anahtarlarından yürür (meta kaydı olmayan girdi `erisim: 0` ile en eski sayılır) ve `budama(true)` önbelleği %10 küçültür.
6. **Görüntüleyicide `kirik` sınıfı kalıyordu (rapor 6).** Doğrulandı: `load` dinleyicisi `kirik`'i kaldırmıyordu, görüntüleyici `goster()` de sıfırlamıyordu. İkisi de düzeltildi; görüntüleyiciye Commons yedek adresi eklendi (madde 2).
7. **`onbellekEseri` `sl` alanını düşürüyordu (rapor 12).** Doğrulandı (`data/eserler_onbellek.json`'da `sl` var, kopyalanmıyordu). `sl: e.sl || 0` eklendi.
8. **Yakalanmayan söz hataları (rapor 13), yalnızca service worker.** `kabuk`, `oncePaket`, `onceAg` içindeki `c.put(...)` çağrılarına `.catch(() => {})` eklendi; görsel yolundaki `budama()` zaten yakalanıyor.

### Düzeltilmeyen / reddedilen

- **Rapor 7 (AIC 403, otomatik görsel geçişi):** Ölçümde AIC 403'ü doğru, ama bunun bir kısmı ölçüm ortamından (Cloudflare bot koruması) olabilir; iPhone'da doğrulanmadı. Yedek zinciri (eserin diğer kaynaklarına geçiş) kartlar, ızgaralar ve pekiştirme mantığına dokunan daha büyük bir değişiklik; bu işte yapılmadı. AIC'yi veride geriye almak `data/` değişikliği olurdu. Önerim: önce iPhone'da Safari Web Denetçisi ile gerçek durum kodu bakılsın. (İlk adım olarak AIC artık `cors` ile istenir; 403 görülür ve önbelleğe girmez.)
- **Rapor 9 (asenkron yarış durumları):** Mantıklı bir örüntü ama `app.js`'in yönlendirme akışına yayılan bir değişiklik; e2e bu bilgisayarda çalıştırılamadığından doğrulayamadan yapmak riskli. Yapılmadı.
- **Rapor 10 (eser listesi geçici hata, bayat dosya):** Kod okunarak mantık doğru görünüyor, ama senaryo (30 günü aşan dosya) henüz gerçekleşmedi ve düzeltme `eserler.js` önbellek akışını değiştirir. Yapılmadı.
- **Rapor 11 (Met/CMA özgün dosya):** "Olası" olarak işaretlenmişti; `data/`'daki adreslerin biçimi kontrol edilmedi ve içeriğe dokunmak istemedim, URL yeniden yazmak ise kırık adres riski taşır. Yapılmadı.
- **Rapor 13 (uygulama tarafı `.then` zincirleri):** Görsel yüklemeyi etkilemiyor; tek tek çağrı yerlerine dokunmak yerine bırakıldı.
- **Rapor "Olası sorunlar":** Ölçüm ortamı ve WebKit opak yanıt dolgusu koddan gösterilemez; yalnızca cihazda doğrulanabilir.
## İş 11 · Görsellerin uygulamayla birlikte yayınlanması (2026-10-21)

1. **Neden:** Görsel ölçümünde (`denetim/hata/gorsel_rapor.json`) Wikimedia isteklerinin yaklaşık %60'ı 429 (hız sınırı), Art Institute of Chicago'nun hepsi 403 döndü. "Bazen resimler yüklenmiyor" şikâyetinin ana kaynağı bu.
2. **`scripts/gorsel_indir.py`** (Mac'te, `sips` ile): pekiştirme havuzundaki (sanatçı başına 12) ve başyapıt okumalarındaki eserlerin ilk görselini kaynağın 1280 px'lik standart küçük resminden indirir (Wikimedia önbellekte tuttuğu için 429 daha az), kendisi küçültür: `gorseller/b/<ad>.jpg` (1280 px; iPhone 13 ekranı 1170 gerçek piksel genişliğinde, bu yüzden 800 px görseller bulanık kalıyordu ve yakınlaştırmada bozuluyordu) ve `gorseller/k/<ad>.jpg` (400 px, ızgara). Toplam ≈ 650–700 MB (GitHub Pages sınırı 1 GB). `data/yerel_gorseller.json` = `{ "gorseller": { "kaynak:kimlik": "ad" }, "buyuk": [anahtar] }`. Yalnızca özgür lisanslı kaynaklar (Commons, müzelerin CC0 görselleri); WikiArt alınmaz. Wikimedia'ya istekler arası en az 1,5 sn bekleme. Engel (429) ya da sunucu hatasında görsel atlanmaz: üst üste her retle bekleme katlanır (30 sn → … en çok 15 dk; Retry-After daha uzunsa o) ve temel bekleme 10 sn'ye kadar artar, başarılarla geri iner; yalnızca 404/410 ya da müze 403'ünde atlanır.
3. **Uygulama:** `gorselUrl` ve `paletUrl` yerel kopya varsa onu döndürür (1200 px istekleri de 800'lük kopyaya gider). Service worker `gorseller/` yolunu sürümden bağımsız görsel önbelleğine (LRU) alır. Galerilerdeki diğer eserler ve konu sayfaları eskisi gibi kaynaktan gelir. Kaynak ve lisans yazısı değişmez.
4. 1280 px kopyalar daha büyük olduğu için service worker'ın görsel önbellek sınırı 300 MB'tan 700 MB'a çıkarıldı (LRU); Ayarlar'daki indirme tahmini görsel başına 300 KB. İş 10'un (hata denetimi) üstüne uygulandı; yerel kopya varsa Commons küçük resim adresinden önce gelir. Sürüm 1.17.1.

## İş 12 · Seviyeler: Kolay, Orta, Zor (2026-10-22)

Emre'nin isteği: “Kolay, orta, zor diye bölümler; birinde %80 başarı olmadan öbürüne geçilmesin ki sanatçılar tam anlaşılsın.” Bu iş önce Emre'nin Mac'indeki bir oturumda başlamıştı, ama o oturumun değişiklikleri GitHub'a gönderilmemişti. Özellik güncel main üzerine baştan yazıldı (`js/seviye.js`, birim testli).

1. **Seviye sanatçı başına tutulur** (`ilerleme.seviyeler[id] = { s: 0–2, son: [1,0,…] }`, yedeğe dahil). Her sanatçı Kolay'dan başlar. Yalnızca sanatçı sorusu sayılır.
2. **Geçiş:** o seviyedeki son 10 cevabın en az %80'i doğru ve en az 5 cevap varsa üst seviyeye geçilir; yeni seviyede sayaç sıfırlanır. Kayan pencere sayesinde erken yanlışlar zamanla düşer. Seviye düşürme yok. Zor'da aynı ölçüt “ustalaştın” olarak gösterilir.
3. **Seviye sorunun zorluğunu belirler:**
   - **Eser:** Kolay'da sanatçının en tipik ve ünlü yarısından, Orta'da hepsinden, Zor'da en az bilinen yarısından (İş 7'deki kolaylık puanları). İş 7'de bu dilim Leitner kutusuna bağlıydı; artık seviyeye bağlı.
   - **Sanatçı şıkları:** Kolay'da aynı ve komşu akımlar yok, dönem sırasında en az 3 akım uzak sanatçılar. Orta'da aynı akım yok, komşu akımlar (±50 yıl). Zor'da eski kural (aynı akım önce; CLAUDE.md §5). Aday yetmezse bir alt kurala düşülür, her zaman 4 şık olur.
   - **Akım şıkları (Karışık):** Kolay'da en az 3 akım uzak akımlar; Orta ve Zor'da eski kural (komşular).
   - CLAUDE.md §5'teki “yanlış şıklar zor olmalı” kuralı bu yüzden yalnızca Zor seviyede birebir geçerli; alt seviyeler Emre'nin yeni isteğiyle kasıtlı olarak daha kolay.
4. **Kilit:** Karışık ve Döneme göre her sanatçıyı kendi seviyesinde sorar; böylece %80 olmadan hiçbir sanatçı zor şıklarla karşılaşmaz. Pekiştir menüsüne “Seviyeye göre” bölümü eklendi: her seviyedeki açık sanatçı sayısı. Seviyede sanatçı yoksa satır kilitli görünür (“bir sanatçı Kolay'da %80 başarınca açılır”). Seviye oturumu (`#/pekistir/seviye/<kolay|orta|zor>`) yalnızca o seviyedeki sanatçıları tek soruyla (sanatçı) sorar.
5. **Geri bildirim:**
   - Soru etiketi “Soru 1 / 1 · Kolay”.
   - Cevap yaprağında “Kolay · son 6 cevapta 5 doğru · Orta için %80”; geçişte “… Orta seviyeye geçti”.
   - Tur özetinde “Seviye atlayanlar”.
   - Sanatçı sayfasında seviye durumu, İlerleme'de seviyelere göre sayılar.
6. **Yarım oturum:** seviye kipi, kartın seviyesi ve seviye sonucu kayda girer (İş “Yarım kalan pekiştirmeye devam”); aynı yerden döner.
7. Testler: `tests/unit/seviye.test.mjs`, `tests/e2e/seviye.spec.js` (Orta kilitli → Kolay'da %80 → geçiş → Orta açılır ve Orta şıklarında aynı akım yok; yanlış cevapta geçilmez). Sürüm 1.18.0.

## İş 13 · Hareket ve yüzen sekme çubuğu (2026-10-22)

1. **Sekme çubuğu:** Emre'nin seçtiği “A · Yüzen hap”. Çubuk ekranın altında havada duran yuvarlak bir hap; seçili sekmenin arkasında resim renginde (vurgu) bir hap kayar. Çubuk bir kez kurulur, sekme değişince yalnızca `--i` ve `aria-current` güncellenir (kayma animasyonu bu yüzden çalışır). Ana içeriğin alt boşluğu ve bildirim konumu `--sekme-alt` ile çubuğa göre ayarlandı.
2. **Ekran geçişi:** `ciz(html, hareket)`. Adres değişince `main[data-hareket='giris']`: doğrudan çocuklar sırayla 12 px yükselerek belirir. Aynı ekranın yeniden çizimi (konu işaretleme, palet) hareketsiz. View Transitions API kullanılmadı: geri çağrısı eşzamansız, `ciz` sonrası DOM'a hemen erişen kodu bozardı.
3. **Pekiştir:** yeni kartta tablo ölçeklenerek belirir, seçenekler sırayla gelir; karışıkta 2. soruda yalnızca başlık ve seçenekler. Cevapta doğru seçenek yaldız ışığıyla parlar ve hafifçe büyür, yanlış seçilen sarsılır. İlerleme çubuğu önceki karttaki değerden dolar (`--onceki`).
4. **Göz At:** zaman çizelgesi solda yaldız bir çizgi, her akım üzerinde bir düğüm (akım rengi). Yüzyıllar Roma rakamıyla (“XIII–XIV. yüzyıl”; `yuzyilAraligi(…, { roma: true })`). Liste öğeleri kaydırdıkça belirir (CSS `animation-timeline: view()`, desteklemeyen tarayıcıda hareketsiz).
5. Hareket azaltma açıkken tüm animasyonlar kapalı (mevcut `prefers-reduced-motion` kuralı). Sürüm 1.19.0.
6. **Emre'nin 2. tur geri bildirimi** ("kaba" bulduğu üç yer):
   - **Bugün:** "Pekiştir" ve "Döneme göre" düğmeleri ile alt satır kalktı. Yerine tek bir "Bugünün turu" bileti var: solda bugünkü kart ilerlemesini gösteren halka, ortasında kalan kart sayısı (`data-test="pekistir"`, karışık tura gider). Döneme göre artık yalnızca Pekiştir sekmesinde. Altında üç küçük sayı (açık sanatçı, doğru oranı, bugün). Kaydırdıkça günün sanatçısı anlatılmaya devam eder: eserleri, Nasıl tanırım?, notlar (5 satıra kısaltılmış), resmin renkleri ve "Hayatı ve dönemi" bağlantısı. Kaydırınca kahraman resim yavaşça aşağı kayar ve kararır, isim yukarı süzülür (`animation-timeline: scroll()`). Ayarlar sayfanın en altında küçük bir bağlantı.
   - **Göz At:** üstteki iki büyük kutu (Başyapıt okumaları, Konular) kalktı. Göz At'ın üstünde üç bölüm var: Akımlar · Başyapıtlar · Konular. Seçili bölümün altındaki elmas işaret önceki bölümden kayarak gelir. Başyapıtlar ve Konular listeleri artık bu bölümlerin içinde, geri düğmesi yok.
   - **Cevap yaprağı:** ekran genişliğindeki koyu kahverengi blok yerine kenarlardan 10 px içeride yüzen, buzlu cam bir "duvar etiketi". Sonuç büyük harfli renkli yazı yerine ikonlu italik serif ("Doğru" / "Yanlış" + küçük not); sonucun rengi yalnızca üst kenarda ince bir ışık. Sanatçı adı ve eser iki satır, palet 4 px, düğmeler yuvarlak.
7. **3. tur:** Emre "Bugünün turu" kartını ve sayıları beğenmedi ("kaydırmayı daha etkili kullan"). Ana sayfa artık bir **sahne**: günün tablosu ekranı kaplar ve kaydırırken yerinde kalır (`position: sticky`). Kaydırdıkça tabloya yaklaşılır (`scale` 1 → 1.35, kararır; `animation-timeline: scroll(root)`), isim silinir, üstünden iki müze duvar etiketi geçer ("Nasıl tanırım?", "Notlarımdan"; `view()` ile alttan belirip yukarıda silinir). Pekiştir düğmesi sekme çubuğunun hemen üstünde, sahne boyunca duran cam bir hap (`position: sticky; bottom`). Sahneden sonra eserler, renkler, "Hayatı ve dönemi" ve en altta tek satırlık sayılar + Ayarlar. Kart ve sayı ızgarası kaldırıldı (`turKarti` yalnızca günün sanatçısı yokken). Desteklemeyen tarayıcıda sahne hareketsiz ama düzen aynı.
8. **Tümünü göster:** yatay eser şeritlerinin (ana sayfa, sanatçı sayfası, Günün sanatçısı) üstünde "Eserleri · N" başlığı ve sağda "Tümünü göster" (`data-test="tumunu-goster"`, `#/sanatci/<id>/eserler` ızgarasına gider). Sanatçı sayfasında şeridin sonundaki "Tümü (N)" kartı da duruyor.
9. **4. tur:** ortalanmış, kırpılmayan tablo denemesi Emre'ye kötü göründü; geri alındı. Onun yerine **Günün sanatçısı dikey eserlerden seçilir**: `scripts/oranlar.mjs` (`npm run oranlar`) uygulamayla gelen küçük kopyaların JPEG başlığından en/boy oranlarını çıkarır ve `data/gorsel_oranlari.json`'a yazar (`oranlar` + dikey eseri olan sanatçılar `dikeyler`, eşik 0,85). Günün sanatçısı havuzu dikey eseri olanlarla sınırlanır (145/187); sahne tablosu o sanatçının en bilinen dikey eseri, yoksa en bilinen eseri. Dosya yoksa eski davranış. Görseller yeniden indirilince betik yeniden çalıştırılmalı.
10. **Tablonun devamı:** tablo altın bir çizgiyle keskin biter (alt kenarda silinme yok). Altındaki bölümün zemini resmin paletinden keskin kenarlı bir mozaik (`paletZemini`, Emre "B · Mozaik"i seçti): dört satır, her satırda iki blok, bölünme yeri iki rengin resimdeki paylarının oranı. Renkler koyu temada %18–38 açıklığa, açık temada en az %80'e çekilip zeminle karıştırılır, böylece yazı okunur kalır. (Önceki denemeler, resmin aynalanmış bulanık kopyası ve yumuşak renk lekeleri, Emre'ye bulanık göründü.) Kaydırırken tablo büyür ama eskisi kadar kararmaz. İlk duvar etiketi "Hayatı" (data/biyografiler.json; yoksa görünmez), sonra "Nasıl tanırım?" ve "Notlarımdan". Sekme ekranlarının rengi de artık sahnedeki eserden (`gununEseri`), ana sayfayla aynı.
11. **Hareket · 2. tur** (Emre: "animasyonlar genel kullanımı çok etkiliyor"):
   - **Açılış perdesi:** uygulama açılınca bir kez (`main.perde`), tablo galeri ışıkları yanar gibi aşağıdan yukarı açılır; ilk ad, soyadı (harf aralığı daralarak netleşir), künye ve Pekiştir hapı sırayla gelir. Sonraki Bugün ziyaretlerinde yalnızca olağan giriş.
   - **Sekme yönü:** sağdaki sekmeye geçince ekran sağdan, soldakine geçince soldan kayar (`main[data-yon]`).
   - **Pekiştir hapı:** 6 saniyede bir üstünden yaldız ışığı geçer.
   - **Mozaik:** kaydırdıkça yukarıdan aşağı açılır (`clip-path`, `view-timeline: --mozaik`).
   - **Pekiştir kartı:** yeni tablo sağdan kayarak gelir (bir sonraki tabloya geçiyormuş gibi).
   - **Tur özeti:** doğru sayısı sıfırdan sayarak gelir; hepsi doğruysa ekranın üstünden yaldız yaprakları süzülür (dekoratif, sabit tohumlu).
   - **İlerleme:** akım çubukları sıfırdan dolar; seviye atlama satırı parlar. Küçük resimler yüklenince hafifçe yerine oturur.
   - Hepsi `prefers-reduced-motion` ile kapanır (sayaç doğrudan yazılır).
12. **Yarım kalan duvar etiketleri (Emre'nin isteği):** Hayatı / Nasıl tanırım / Notlarımdan etiketleri 9 satırda kesilir; metin sığmıyorsa etiket dokunulabilir olur, altında "Devamı ↓" yazar, dokununca tamamı açılır ("Kısalt ↑" ile geri kapanır). Klavyeyle Enter/Boşluk da çalışır.
13. **Mozaik sayfanın sonuna kadar:** "Son" satırı ve küçük sayılar mozaik bölümünün içine alındı; zemin sekme çubuğunun arkasından ekranın en altına kadar iner (`display: flow-root` ile son satırın boşluğu dışarı taşmaz).

## İş 12b · Seviye dönem başına, Giotto Gotik'te (2026-10-22)

Emre'nin geri bildirimi: “kolay orta zor kısımlarını döneme göre yap, rastgele yapma”, ardından seçenekler arasından **dönem başına seviye**yi seçti. Ayrıca “Giotto'yu önceki akımla birleştir, tek başına saçma oldu”. Bu bölüm İş 12'nin 1., 4. ve 5. maddelerinin yerine geçer; geçiş ölçütü, eser ve şık zorluğu (İş 12 madde 2–3) aynı kaldı.

1. **Seviye dönem (akım) başına tutulur:** `ilerleme.seviyeler[akım adı] = { s, son }`. Her dönem Kolay'dan başlar. O dönemin herhangi bir sanatçısına verilen sanatçı cevabı (Döneme göre, Hepsi ya da Karışık fark etmez) o dönemin penceresine yazılır. Son 10 cevabın %80'i doğruysa (en az 5) dönem Orta'ya, sonra Zor'a geçer. Dönemin seviyesi o dönemdeki her sanatçının sorusunu belirler: eser ve şıklar.
2. **Ayrı “Seviyeye göre” bölümü ve `#/pekistir/seviye/…` kaldırıldı.** Seviye artık dönemin bir özelliği: Pekiştir · Döneme göre listesinde her dönemin yanında rozet var (“Kolay · 3/5”, “Orta · 4/6 doğru”, “Zor · usta”). Dönemi seçince tur o dönemin seviyesinde açılır. Alt seviyelere dönüp tekrar seçeneği yok (gerekirse sonra eklenir).
3. **Geri bildirim:** cevap yaprağında “Gotik · Kolay · son 6 cevapta 5 doğru · Orta için %80”; geçişte “Gotik Orta seviyeye geçti”; tur özetinde “Seviye atlayan dönemler”; sanatçı sayfasında “Gotik dönemi: Kolay …”; İlerleme'deki akım doğruluk çubuklarında dönemin seviyesi.
4. PR #21 henüz merge edilmediği için sanatçı başına kayıtlardan geçiş yazılmadı; eski biçimdeki anahtarlar (sanatçı kimlikleri) hiçbir döneme denk gelmez ve kullanılmaz.
5. **Proto-Rönesans kaldırıldı, Giotto Gotik'e taşındı:** tek sanatçılı akım ayrı bir pekiştirme ve şık kaynağı olarak anlamsızdı. `sanatcilar.json`'da yalnızca Giotto'nun `akim` alanı değişti (Emre'nin açık isteği). `akimlar.json`'da akım silindi, `sira` yeniden numaralandı; Gotik'in komşularına Erken Rönesans eklendi, Erken Rönesans'ın komşusu Gotik oldu. `akim_bilgi.json`'da Proto-Rönesans metni Gotik metninin sonuna eklendi (içerik değişmedi). Skorlar sanatçı kimliğiyle tutulduğu için ilerleme kaybolmaz.
6. Veri dosyaları önce-önbellek olduğu için sürüm 1.19.2 (İş 13'ün 1.19.1'inin üstüne).

## İş 14 · Rapor düzeltme paketi: D1, D4, D7, D8 (2026-10-22)

Kaynak: “Sanat Atlası · Yenilik ve kullanılabilirlik raporu”. Emre bu rapordan V1, K5, K6, K7, Ö2, Ö3, Ö7 ve Ö8'i istemedi; geri kalanlar paketler hâlinde yapılıyor. Bu ilk paket.

1. **D1 · Tek kart sayısı.** Bugün'deki Pekiştir hapı, Pekiştir menüsündeki Karışık düğmesi, dönem satırları ve turun sayacı artık aynı sayıyı gösterir: “bu turda kaç kart gelecek”. `turOzeti` (js/oturum.js) `kartlariSec` ile aynı kuralı (günlük kart sayısı, günlük 8 yeni sınırı, aday sanatçılar) kullanır ve türlerini verir; hapta “Pekiştir · 8 kart”, altında “0 tekrar · 8 yeni” (zayıf ve vadesi gelmemiş kartlar “pekiştirme” sayılır). Dönem satırları “7 sanatçı · 5 kart · 2 tekrar”. Sağ üstteki tarih hapındaki tekrar sayısı da aynı hesaptan. Bileşim öncelik sırasına göre hesaplanır; Karışık turda kartlar ağırlıklı rastgele seçildiği için toplam aynı, türlerin dağılımı küçük farklar gösterebilir. Önbellekte ya da kursta eseri olmayan bir sanatçının görseli bulunamazsa tur bir kart kısalabilir (seyrek).
2. **D4 · Büyük soru görseli.** Görsel kalan yüksekliği doldurur (`--soru-resim-h: calc(100dvh − 330px)`, en çok 720 px): dikey resim tam yükseklik, yatay resim tam genişlik. Seçenekler 2×2 ızgara; uzun ad iki satıra kırılır, harf küçük satırda üstte, doğru/yanlış işareti köşede.
3. **D7 · Ad sırası.** `kisa_adlar.json`'daki bilinen ad tam adın başındaysa (Giotto di Bondone, Leonardo da Vinci, Rembrandt van Rijn, Michelangelo Buonarroti…) büyük satır bilinen ad, altında küçük satırda tam ad (“Giotto” / “Giotto di Bondone”). Bilinen ad sonda olanlarda (“Francisco de / Goya”) eski düzen kalır. Karşılaştırma sayfası da aynı.
4. **D8 · Ders notu artıkları.** `notTemizle` (js/yardimci.js) yalnızca gösterimde “slayt/metin/künye/altyazı” notlarını atar: parantez içleri (“1401 (slayt yazısı)” → “1401”), önekler (“Slayta göre Uffizi” → “Uffizi”) ve ders metninin tarihi varken slayttaki tarih (“metinde 1520'ler; slaytta c1500” → “1520'ler”). Eser başlığı (`eserBaslik`), tarihi, müzesi ve başyapıt okumalarının tarih/müze/özgün adı temizlenir. `sanatcilar.json` değişmedi; eşleştirme anahtarları (`sanatçı|başlık`, kolaylık puanı) özgün başlıkla kalır. Birim testi verideki tüm kurs eserlerinde “slayt” kalmadığını ve hiçbir alanın boşalmadığını denetler.
5. **D2 ve D5 yapılmadı (Emre'nin kararı).** D5 için iki seçenek gösterildi: buzlu cam etiketler, Pekiştir hapı ve cevap yaprağı yerine resmin paletinden opak “karton” (koyu ton) ya da “paspartu” (açık ton) yüzeyler; D2 için parlak resimlerde adın altına resmin koyu tonundan keskin bir şerit. Emre ikisini de beğenmedi (“temayı bozmuş, önceki güzeldi”); hepsi geri alındı, mevcut cam görünüm kaldı.
6. **Hata düzeltmesi:** Bugün sahnesinde duvar etiketlerinin sütunu (üst boşluğu ekranın %20'si) bazı günlerde sanatçının adının üstüne biniyor ve ada dokunmayı engelliyordu (Günün sanatçısı testi tarihe göre kırılıyordu). Sütun artık dokunmaları geçirir, yalnızca etiketler dokunulur.
7. Testler: `tests/unit/tur.test.mjs` (önizleme `kartlariSec` ile her kipte aynı sayı), `tests/unit/not_temizle.test.mjs`, `tests/unit/adlar.test.mjs` (D7), `tests/e2e/duzeltmeler.spec.js` (hap = menü = sayaç, 2×2 ve görsel yüksekliği, Giotto adı, slayt notu yok). Sürüm 1.20.0.

## İş 15 · Rapor 2. paket: D3, D6, Ö4, İ3 (2026-10-22)

1. **D3 · Cevap yaprağı eseri kapatmaz.** Cevaptan sonra seçeneklerden yalnızca doğru olan ve senin seçtiğin kalır (ikisi aynıysa tek, tam genişlikte; harfleri A–D korunur). Soru görselinin yüksekliği yaprağa göre yeniden hesaplanır (`yaprakYerlestir`): eser, iki seçenek ve “Sonraki” düğmesi kaydırmadan aynı ekranda; eser en az 140 px. Yaprak en çok ekran − 120 px, sığmazsa kendi içinde kayar. “Nasıl tanırım?” ipucu yaprakta 3 satır; sığmıyorsa altında “Devamı ↓”, dokununca tamamı açılır (“Kısalt ↑”), görsel yeniden yerleşir. Bugün'deki duvar etiketleriyle aynı desen. Cevap yaprağının cam görünümü değişmedi (İş 14 madde 5).
2. **D6 · Türkçe konu adları ve Sıradaki konu.** Yeni `data/konular_tr.json`: 61 konunun kısa Türkçe başlığı ve 9 bölümün Türkçe adı. İlerleme listesinde “Konu 12 · Medici ve Rucellai sarayları”, altında küçük italik satırda özgün İngilizce ad (kursla eşleştirmek için). Dosya yoksa özgün adlar görünür. Sayfanın başında **Sıradaki konu**: kurs sırasında işlenmemiş ilk konu (sanatçısı olmasa da; kurs sırası esas), büyük konu numarası, Türkçe başlık, “N sanatçı açılacak” ve “İşlendi yap” düğmesi. Kutu yok: üstte vurgu renginde, altta ince çizgi. İşlendi yapınca yeni numara alttan kayarak gelir, açılan sanatçılar bildirimde. Bütün konular işlendiyse tek satır.
3. **Ö4 · “Bilmiyorum”.** Seçeneklerin altında metin gibi küçük bir düğme (sanatçı ve akım sorusunda). Yanlış sayılır (Leitner kutu 0, kart 3–5 kart sonra yine gelir), ama `karisanlar`'a yazılmaz ve Karşılaştır bağlantısı çıkmaz. Dönemin seviye penceresine `2` olarak yazılır ve yarım ağırlıkla sayılır: oran = doğru / (doğru + yanlış + ½·bilmiyorum). Böylece “4 doğru + 1 bilmiyorum” %89 olur ve tahmin etmek yerine dürüst cevap cezalandırılmaz, ama hiç bilmeden geçilmez. Cevap yaprağında sonuç “Bilmiyorum”; yalnızca doğru seçenek kalır.
4. **İ3 · Yedek hatırlatması.** `ilerleme.sonYedek` (“YYYY-MM-DD”, yedeğe dahil, doğrulanır) Ayarlar'daki Yedekle ya da hatırlatmadaki düğmeyle yazılır (yedek metni bu tarihi içerir). Son yedekten (hiç yoksa ilk kullanımdan) 14 gün geçtiyse ve en az bir skor varsa Bugün'ün altında, sayı satırının üstünde: “Son yedek 16 gün önce · Yedekle · Paylaş”. Yedekle panoya kopyalar; Paylaş yalnızca `navigator.share` varsa görünür (iOS'ta Notlar'a ya da kendine mesaj). Pano izni yoksa Ayarlar açılır. Dosya indirme yok.
5. Testler: `tests/unit/paket2.test.mjs` (Türkçe başlıklar eksiksiz, hatırlatma günleri, sonYedek doğrulaması), `tests/unit/seviye.test.mjs` (yarım ağırlık), `tests/e2e/yaprak_ilerleme.spec.js` (iki seçenek kalır ve eser yaprağın üstünde, ipucu açılır, Bilmiyorum'un kayıtları, Sıradaki konu, hatırlatma ve pano). Sürüm 1.21.0.

## İş 15b · İlerleme: kitaplık (2026-10-22)

Emre'nin geri bildirimi: “ilerleme kısmındaki neon yazı olmamış, çok parlak, temayı bozuyor; kurs ilerleme kısmı da çok düz kalmış”. Dört öneri gösterildi (zaman çizgisi, kurs haritası, kitaplık, galeri duvarı) ve bir de kitaplık ile galeri duvarının karışımı (işlenen kitabın sırtında eser). Emre düz **kitaplığı** seçti.

1. **Parlak gün rengi İlerleme'den kalktı.** “Sıradaki konu” etiketi, büyük numara, üst çizgi ve “İşlendi yap” düğmesi mürekkep renginde. Düğme çerçeveli, parlamıyor; basınca dolar. Gün rengi (resmin paletinden) diğer ekranlarda olduğu gibi duruyor.
2. **Kurs konuları tek bir kitaplık.** 61 konunun her biri bir kitap sırtı: üstte konu numarası, dikey yazılmış Türkçe kısa başlık. Kitabın boyu konudaki sanatçı sayısına göre değişir (sanatçısız konu en kısa). İşlenen kitap konunun (ilk kurs sanatçısının) akım renginde dolu, iki ince sırt çizgisiyle. İşlenmemiş kitap kâğıt renginde boş sırt. Sıradaki kitap raftan yarı çekilmiş ve eğik duruyor, çizgili. Bölümleri Roma rakamlı eğik kitap destekleri ayırıyor (“IV · 3/7”); bölüm tamamsa destek dolu. Raf tahtaları her 186 px'de bir; kitaplar rafa oturacak şekilde hizalanır. Açılışta kitaplar sırayla rafa kayar (azaltılmış harekette yok).
3. **Konu kartı.** Bir kitaba dokununca kitaplığın altında kart açılır ve görünür alana kayar: büyük numara, Türkçe başlık, özgün İngilizce ad, konunun sanatçıları (açıksa sanatçı sayfasına bağlantı) ve “İşlendi” anahtarı (mürekkep renginde). Aynı kitaba tekrar dokununca kapanır. Kutu yok; iki ince çizgi arasında.
4. Eski açılır bölüm listesi (`details`) ve onun açık bölüm durumu kaldırıldı. Testler: `yaprak_ilerleme.spec.js` (kitap ve destek sayısı, işlenen ve sıradaki kitap, parlak renk yok, karttan işlendi yapma, kartın kapanması), smoke testi ve D6 testi kitaplığa göre güncellendi. Sürüm 1.21.1.

## İş 16 · Rapor 3. paket: T1 · app.js ekranlara bölündü (2026-10-22)

1. **Davranış değişmedi; yalnızca dosyalar.** 2.470 satırlık `js/app.js` yedi modüle ayrıldı: `js/ekranlar/ortak.js` (uygulama durumu `d`, `ekran`, küçük yardımcılar, resim rengi, bildirim, sekme çubuğu, başlık ve `ciz`, Günün sanatçısı seçimi), `bugun.js` (sayımlar, ana sayfa, yedek hatırlatması, Günün sanatçısı sayfası), `gozat.js` (akımlar, sanatçı sayfası, başyapıtlar, konular, karşılaştırma), `pekistir.js` (menü, oturum, kart, cevaplar, yarım oturum, özet, seviyeler), `ilerleme.js`, `ayarlar.js` ve `yonlendirme.js` (adres → ekran). `js/app.js` artık yalnızca giriş: veriyi yükler, dinleyicileri bağlar, yönlendirmeyi başlatır (~95 satır). Sürüm `js/surum.js`'de.
2. Bölme elle değil, bir betikle yapıldı (acorn ile üst düzey tanımlar ve kullanımlar çıkarıldı; her modül yalnızca kullandığı adları içe, başka modülün kullandığı adları dışa aktarır), sonra Prettier ile biçimlendi. Gövdelerin metni değişmedi. İki küçük önhazırlık: `renkIstegi` sayacını başka modülden artırmak mümkün olmadığı için `renkSabitle(palet)` eklendi; Günün sanatçısı seçimi (`gununHavuzu`, `gununEseri`, `gununId`, `enBilinen`, `bilinirlikSirasi`) her ekranın rengi için gerektiğinden `ortak.js`'e taşındı.
3. **Dinleyici sırası korunur.** Ekranların `ekran.addEventListener` çağrıları her modülde `olaylariBagla()` içinde; `app.js` bunları eski dosyadaki sırayla çağırır (ortak, bugün, pekiştir, ilerleme, ayarlar). Modüller arası döngüler (ör. bugün ↔ pekiştir) yalnızca çağrı anında kullanılan fonksiyonlar üzerinden; `ortak.js` hiçbir ekranı içe aktarmaz, böylece ilk o değerlendirilir.
4. Yeni dosyalar service worker kabuğuna eklendi (çevrimdışı açılış). Test: `tests/unit/moduller.test.mjs` (her JS dosyası kabukta, içe aktarılan her ad gerçekten dışa aktarılıyor, `ortak.js` ekran içe aktarmıyor, `app.js` küçük kaldı); sürüm testi `js/surum.js`'i okur. Bütün e2e testleri değişmeden geçti. Sürüm 1.22.0.

## İş 17 · Rapor 4. paket: Ö1 · Ters soru (2026-10-22)

1. **Ne:** “Hangisi bir Paolo Veronese eseri?” Sanatçının adı verilir, dört eserden biri onun. Neden: sınavda ve müzede gereken “bu sanatçının eseri nasıl görünür” bilgisini sınar; eserden sanatçıya giden soru bunu sınamaz.
2. **Ne zaman:** yalnızca Karışık turda, sanatçının dönemi Orta ya da Zor seviyedeyse, kartların yaklaşık dörtte biri (`TERS_ORANI = 0.25`, `js/ters.js`). Kolay seviyede ve Döneme göre turda hiç gelmez. Testler oranı `window.__atlas.tersOrani` ile 1 yapar.
3. **Eserler:** sorulan eser her zamanki gibi seçilir (seviyeye göre zorluk). Üç yanlış eser, normal sorunun şıklarını seçen çeldirici seçicinin (`sanatciSecenekleri`, dönemin seviyesine göre) seçtiği sanatçılardan gelir. Böylece Zor'da aynı akımdan dört resim karşılaşır. Eseri olmayan bir sanatçının yerine seçicinin ikinci turundan biri alınır. Mümkünse çeldiricinin eseri doğru eserle aynı ikonografi konusunu işler (`eserKonusu`, ör. dört Müjde sahnesi), böylece konu ipucu vermez. Konu verisi henüz yüklenmediyse ya da aynı konuda eser yoksa herhangi bir uygun eser seçilir. Üç çeldirici eser bulunamazsa kart normal soru olarak sorulur. Doğruluk kuralı korunur: her eser, gösterilen sanatçının kendi eser listesinden gelir.
4. **Puanlama:** tek soru. Sanatçı skoru (Leitner) ve dönemin seviye penceresi normal soru gibi işlenir; akım sorusu sorulmaz, akım skoru değişmez. Yanlışta seçilen eserin sanatçısı “karıştırılanlar”a yazılır ve Karşılaştır bağlantısı çıkar. “Bilmiyorum” da var (Ö4 kuralları).
5. **Tasarım (Emre'nin seçimi, 6 öneriden):** üstte isim levhası (kalın çizgi, “Hangisi bir”, büyük serif ad, yıllar, “eseri?”), soldan sağa açılarak gelir. Dört eser masaya dağılmış **kartpostallar**: krem kenar, hafif eğik, köşede pul gibi kesik çizgili harf; masaya sırayla düşerler. Küçük görsel sorununa çözüm: karta dokununca kart dokunulan yerden büyüyüp ekranı kaplar, yana kaydırarak dört eser arasında gezilir (noktalar), cevap yalnızca “Bu eser · B” düğmesiyle verilir (yanlışlıkla dokunmak cevap sayılmaz); “Masaya bırak” ya da Esc kapatır. Cevaptan sonra doğru eser büyüyerek sahneye çıkar (yeşil çerçeve), dört kart küçülüp sırayla ters döner, arkalarında sanatçının adı ve yılları (doğru yeşil, seçilen yanlış kırmızı çerçeveli); dokununca eser büyük açılır. Reddedilen öneriler: kare ızgara, salon çerçeveleri, galeri duvarı + renk çizgileri, palet şeritli kareler (“paletler yakışmamış”), kaydırmalı büyük eserler.
6. **Yarım oturum:** ters kartın dört eseri (sanatçı + eser anahtarı) kayda girer; geri yüklenirken biri bile bulunamazsa kart atlanır.
7. Testler: `tests/unit/ters.test.mjs` (ne zaman, dört seçenek, aynı konu tercihi, null durumu, kayıt), `tests/e2e/ters.spec.js` (doğru cevap ve tek soru, yanlış cevapta seçilen sanatçı ve karşılaştır, büyütme ve kapatma, Kolay'da yok, yarım oturum). Sürüm 1.23.0.

## İş 17b · İlerleme kitaplığı: hızlı ve renksiz (2026-10-22)

Emre'nin geri bildirimi: “kurs ilerleme kısmı çok kullanışsız olmuş, her yaptığım değişiklikte sayfa yenileniyor, çok fazla dersi açıp kapamak aşırı uzun sürüyor, kitaplar çok renkli, renksiz bile yapılabilir”. İki renk seçeneği gösterildi (A tam renksiz, B bölümler sırayla koyu ve açık mürekkep); Emre **A**'yı seçti.

1. **Yerinde güncelleme.** Sayfa dört parçadan oluşuyor (`data-parca`: özet satırı, Sıradaki konu, kitaplık, alttaki doğruluk ve zayıflar). Kitaba dokununca yalnızca kitaplık, işaretleyince dört parça yerinde yeniden yazılıyor; sayfanın başı, kaydırma yeri ve odak korunuyor. Kitapların rafa dizilme hareketi yalnızca sayfa ilk açılınca oynuyor (`.kitaplik.durgun`); konu kartı yalnızca açılırken kayıyor, işaretledikten sonra yerinde duruyor.
2. **Toplu işaretleme.** Konu kartında, önceki konulardan işlenmemiş varsa “1–N arası hepsi işlendi” düğmesi. Bildirim 6'dan çok sanatçı açıldıysa ad listesi yerine “N sanatçı açıldı”.
3. **İşaretle kipi.** Kitaplığın üstünde iki sekme: “Dokununca bilgi” (eskisi gibi kart açılır) ve “Dokununca işaretle” (kart açılmaz, her dokunuş konuyu işlendi / işlenmedi yapar). Kip oturum boyunca hatırlanır, kalıcı değildir.
4. **Renksiz kitaplar.** İşlenen kitap mürekkep renginde, yazısı kâğıt renginde; akım renkleri kalktı. İşlenmemiş kâğıt renginde, sıradaki çekili ve çizgili (değişmedi).
5. Test: `yaprak_ilerleme.spec.js` (sayfanın başına konan işaret değişiklikten sonra duruyor, “buraya kadar hepsi”, işlenen kitabın rengi mürekkep, işaretle kipinde kart açılmadan aç/kapa). Sürüm 1.23.1.

## İş 18 · Rapor 5. paket: Ö6 konu turu, Ö5 Hatalarım, Ö9 seviye seçimi (2026-10-22)

1. **Ö6 · Konu işlenince mini ders.** İlerleme'de tek bir konu işlendi yapılınca (kart anahtarı, “İşlendi yap” ya da işaretle kipi) ve yeni sanatçı açıldıysa, bildirim yerine sekme çubuğunun üstünde alttan kayan bir kart çıkar: koyu mürekkep şerit, açılan sanatçıların küçük eserleri yelpaze gibi açılır, “3 yeni sanatçı açıldı · Konu 12 · adlar”, **Tanış** düğmesi ve kapatma. İki seçenekten (A şerit, B kâğıt yaprak) Emre A'yı seçti. “1–N arası hepsi” ile toplu işaretlemede kart çıkmaz (bildirim). Kart sayfadan çıkınca kaybolur.
   - Tanış → yeni kip `#/pekistir/konu/<no>`. Önce konunun hiç sorulmamış sanatçılarıyla tanışma ekranları arka arkaya (kurs sanatçıları önce; mevcut tanışma ekranı yeniden kullanılır, sayaç “Tanışma 2 / 4”, düğme “Sonraki sanatçı →” / “Tura başla →”). Sonra yalnız o konunun açık sanatçılarından kısa tur: en çok 8 kart, hiç görülmemişler önce; 6'dan az sanatçı varsa aynı sanatçılar ikinci kez (başka eserle) gelir ama arka arkaya gelmez (`konuTuru`, `js/turlar.js`). Tanışmada gösterilen eserler turda sorulmaz.
   - Bu kipte günlük yeni sanatçı sınırı (8) uygulanmaz ve bu tanışmalar günlük sayaca yazılmaz. Sorular yalnızca sanatçı sorusu (dönem turu gibi); Leitner ve seviye penceresi normal işler. Tanışma ayarı kapalıysa tanışmalar atlanır.
2. **Ö5 · Hatalarım.** Pekiştir menüsünde Karışık'ın altında, kutusuz bir satır: solda büyük kırmızı sayı (turdaki kart sayısı), “Hatalarım · 5 sanatçı · 2 karıştırılan ikili · son 7 gün”, altında italik ikililer. Hata yoksa satır görünmez. `#/pekistir/hatalar`.
   - **Hatalı sanatçı:** sanatçı sorusu skoru kutu 0, en az bir yanlış ve son görülme son 7 gün içinde (`hataliMi`). Sonra doğru yapılan (kutu ≥ 1) artık hatalı değil. Akım sorusu sayılmaz (tur yalnızca sanatçı sorar).
   - **İkililer:** `ilerleme.karisanlar`'dan son 7 günde karıştırılan, iki sanatçısı da açık olan ikililer; çok karıştırılan önce, en çok 4 ikili, bir sanatçı tek ikilide. İkilinin iki sanatçısı ardışık kartlarda gelir ve her biri ötekinin kartında şıktır (`esiEkle`: eş şıklarda yoksa doğru olmayan bir şıkkın yerine konur). Sonra kalan hatalı sanatçılar; en çok 20 kart. Yanlışlar her turdaki gibi 3–5 kart sonra yine gelir.
3. **Ö9 · Seviye seçimi.** Tek dönemlik turda (Hepsi değil), dönem Kolay'ı geçtiyse soru ekranının üstünde üç hap: Kolay · Orta · Zor. Açılmamış seviye kesik çizgili ve kilitli. Alt seviyeye geçince hapta “ısınma” yazar; cevaplanmamış kart yeni seviyeyle yeniden hazırlanır. Alt seviyede verilen cevap dönemin seviye penceresine yazılmaz (yaprakta “Isınma · Kolay · Gotik Orta penceresine yazılmadı”); Leitner skoru normal işler. Seçim oturuma aittir, yarım oturum kaydına girer; dönemin kendi seviyesine dönünce cevaplar yine sayılır. Menüdeki rozete uzun basma seçeneği yapılmadı (tek yer yeterli).
4. **Yarım oturum:** kipler `donem`, `karisik`, `konu` (akim alanında konu numarası), `hatalar`; kayda seçilen seviye ve ikili eşleri girer. Devam kartı “Konu 12 · 2 / 8”, “Hatalarım · 4 / 9”.
5. Testler: `tests/unit/turlar.test.mjs` (konu turu uzunluğu ve sırası, tanışma sırası, hatalı tanımı, ikililer ve eşler, eş ekleme, seviye seçenekleri ve pencere kuralı, yarım kayıt), `tests/e2e/turlar.spec.js` (konu işlenince kart, kapatma, tanışmalar ve tur; Hatalarım satırı ve ikilinin ardışık gelişi; seviye hapları, ısınma ve pencere). Smoke testi bildirim yerine Tanış kartını bekler. Sürüm 1.24.0.

## İş 19 · Rapor 6. paket: K1 arama, K2 zaman şeridi, K3 akım kimlik kartı (2026-10-22)

1. **K1 · Genel arama.** Göz At'ın başında ince çizgili bir hap: “Sanatçı, eser, konu ara” → `#/ara`. Arama sayfasında kutusuz, alt çizgili büyük serif bir girdi ve temizle düğmesi var. Yazdıkça sonuçlar dört grupta çıkar: Sanatçılar · Eserler · Konular · Başyapıtlar. Her grupta en çok 8 sonuç ve “ve N sonuç daha” notu.
   - **Dizin** (`js/arama.js`, bağımlılık yok): `normallestir` küçük harfe çevirir, Türkçe harfleri sadeleştirir (ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u), aksanları atar (é→e) ve noktalamayı boşluk yapar. Sanatçıda tam ad, kısa ad ve `ad_arama`; eserde Türkçe ad ve özgün başlık (“Gece Devriyesi” ve “Night Watch”); konuda Türkçe ve özgün ad; başyapıtta başlık ve özgün ad aranır.
   - **Eşleşme:** her sorgu kelimesi geçmeli. Tam kelime 3, kelime başı 2, kelime içinde (en az 3 harf) 1 puan; bütün sorgu metnin başındaysa ek puan. Eşitlikte bilinen eser (site bağlantısı) önce gelir. Sorgu 2 harften kısaysa sonuç gösterilmez.
   - **Kilitli sanatçılar** bağlantısız ve soluk görünür: “Konu N'de açılır”. Eserler yalnızca açık sanatçılardan gelir. Dizin ilk açılışta kurulur ve işlenen konular değişince yenilenir. Esere dokununca görüntüleyici açılır.
2. **K2 · Zaman şeridi.** Göz At'ta dördüncü bölüm “Zaman” (`#/zaman`).
   - **Görünüm:** yatay kayan tuval, 1250–2000. Üstte eksen var; çentikler yakınlaştıkça 50, 25 ya da 10 yılda bir. Altında akım bantları keskin akım renginde: üyelerin çalışma hayatı, doğum + 20 ile ölüm arası. En altta her sanatçı doğumundan ölümüne akım renginde ince bir çizgi, adı çizginin üstünde.
   - **Yerleşim:** bantlar ve çizgiler, adlarıyla birlikte üst üste binmeyecek şekilde şeritlere açgözlü yerleşir (`js/zaman.js` `seritle`). Antik çağ sanatçıları (1250 öncesi bitenler) şeritte yok. Yılı tek tarafı bilinen sanatçı 60 yıllık ömürle tahmin edilir.
   - **Etkileşim:** iki parmakla yakınlaştırılır (merkezdeki yıl yerinde kalır), + / − düğmeleri de var; ölçek yılda 1,2–14 px arası. Çizgiye dokununca alttan sanatçının küçük kartı açılır: eser, yıllar, akım, “Sayfası”. Kilitli sanatçılar soluk ve kartlarında “Konu N'de açılır” yazar.
   - **Açılış:** şerit açık sanatçıların ortalama doğum yılına kayarak başlar. Kaydırma yeri ve ölçek oturum boyunca hatırlanır. Bantlar ve çizgiler açılırken soldan sağa çizilir (azaltılmış harekette yok).
   - Göz At bölüm çubuğu dört sütun oldu.
   - Emre görünüşü beğenmedi (“çok çirkin”) ama kredisi az olduğu için şimdilik böyle kalmasını istedi; sonra yeniden tasarlanacak.
3. **K3 · Akım kimlik kartı ve akım karşılaştırması.** Akım sayfasında “Dönemi”nin altında kimlik kartı:
   - Akımın ortalama paletinden keskin bir şerit: en bilinen 4 eserin paletleri birleştirilir (`paletBirlestir`, yakın renkler toplanır). Palet derleme anında değil, eserlerin zaten önbelleğe alınan paletlerinden çalışırken hesaplanır. Görsel indirmeye dayalı bir betik gerekmedi.
   - “Nasıl tanınır?”: 3–4 numaralı madde. Yeni veri dosyası `data/akim_ozellikleri.json` (31 akımın hepsi; Claude yazdı, ders kitabı düzeyinde genel bilgi).
   - “Tipik konular”: ikonografi verisinde akımın açık sanatçılarına ait eser sayısı en çok olan 4 konu, sayısıyla.
   - “En bilinen eserler”: her sanatçıdan en çok bir eser, bilinirliğe göre 4 tane; dokununca görüntüleyici.
   - “Karıştırma”: komşu akımlarla (`komsular`) karşılaştırma bağlantıları.
   - **Karşılaştırma sayfası** `#/akim-karsilastir/<a>/<b>`: iki sütun. Her sütunda akımın rengiyle üst çizgi, ad, yüzyıllar, palet, iki eser, özellikler ve tipik konular.
   - **Karışık turda** akım sorusu yanlış cevaplanınca cevap yaprağında “Karşılaştır: Barok ↔ Rokoko” bağlantısı çıkar. “Bilmiyorum”da çıkmaz.
4. **Hata ve düzeltme:** zaman şeridinin sanatçı kartına önce `.zaman-kart` adı verilmişti. Bu ad Göz At'taki akım kartlarıyla çakıştı: sabit konumlu kartlar sayfanın üstüne binip arama hapına dokunmayı engelledi. Ad `.zaman-sanatci` olarak değiştirildi; e2e testi hapa gerçekten dokunuyor. Ayrıca rastgele başarısız olan bir Ö1 testi düzeltildi: kısa ad kaydı nesne olabiliyordu.
5. Testler: `tests/unit/kesif.test.mjs` (normalleştirme, gruplu arama, puan, şerit yerleşimi, palet birleştirme, tipik konular, en bilinen eserler, komşular, özellik dosyası eksiksiz) ve `tests/e2e/kesif.spec.js` (arama hapı, harfsiz arama, kilitli sanatçı, eser görüntüleyici, sonuç yok; zaman şeridi, yakınlaştırma, sanatçı kartı, yatay taşma yok; kimlik kartı, karşılaştırma sayfası, akım sorusunda bağlantı). Sürüm 1.25.0.

## İş 20 — Rapor V2 (eksik biyografiler) ve V3 (akım metni denetimi) · v1.25.1

- **V2:** Raporda biyografisi eksik görünen 18 sanatçı (Reni, Guercino, Utrecht ve Roma Caravaggistleri, Ribera, Geç İtalyan Barok ressamları) ve Francis Bacon için kısa Türkçe biyografi yazıldı. Bulut ortamından Vikipedi API'si 429 verdiği için `scripts/biyografi.mjs` çalıştırılamadı. Metinler Claude tarafından yazıldı (Vikipedi'deki bilinen bilgilere dayanan özet, çeviri değil). Bu yüzden yeni bir `dil: "claude"` değeri eklendi; sayfada "(bilgilerinden Claude özeti)" notu çıkar. Betik bu kayıtları da korur.
- V2'nin geri kalanı (yaklaşık 1.370 eser notu, 374 Türkçe eser adı, 232 zorluk puanı) kredi sınırı yüzünden yapılmadı. Bunlar Emre'nin Mac'inde API ile çalışan bir oturuma bırakıldı.
- **V3:** Geç İtalyan Barok metni denetlendi. Solimena'nın Ribera'dan doğrudan "yola çıktığı" ifadesi yumuşatıldı, kaynak etiketi "denetlendi" oldu. Gotik metninde Proto-Rönesans paragrafının başındaki tekrar ("…başlatacaktır. Proto-Rönesans, … bir dönemdir.") tek bir geçiş cümlesine indirildi.
- Testler: `tests/unit/biyografi_v2.test.mjs` ve `gunun.spec.js` içinde V2 testi.

## İş V2b · V2'nin kalanı (API ile, 2026-10-22)

1. Eksik Türkçe eser adları, eksik zorluk puanları ve eksik eser notları yalnızca eksik olanlar için üretildi; var olan kayıtlara dokunulmadı (`icerik/v2_kalan.py`).
2. Adlar: Claude Sonnet 5.5, önceki kurallarla. Zorluk: Claude Opus 5.5, görselle (sanatçının bütün havuzu birlikte, kolaylık = tipiklik + ünlülük). Notlar: Claude Sonnet 5.5, yalnızca başlık ve künyeye dayanır, eseri kesin tanımadığı yerde boş bırakır; görselle denetlenmedi (kaynak etiketinde belirtildi).
3. Sürüm 1.25.2 (data/ dosyaları sürümlü önbellekte olduğu için yükseltildi).

## İş 21 · Rapor 8. paket: K4, İ1, İ2, İ4, İ5, T2, T3, T4 (2026-10-22 · sürüm 1.26.0)

Sekiz maddenin hepsinin tanımı raporda bulundu. Bu bilgisayarda Playwright çalışmadığı için e2e testleri (`tests/e2e/paket8.spec.js`, `safari.spec.js`) yazıldı ama çalıştırılmadı; GitHub CI çalıştıracak. Birim testleri (`tests/unit/paket8.test.mjs`) geçti. Yeni veri alanları yedeğe dahil; eski yedekler sorunsuz yüklenir (`ilerlemeDogrula` eksikleri tamamlar). **Tasarım onayı bekliyor:** İ1 takvim, İ4 grafikler, K4 işaret ve duvar, İ5 menü ve T4 not için tek seçenek (rapordaki A/B yok) uygulamanın diline uyularak seçildi; ekran görüntüsü gösterilemedi.

1. **K4 · Koleksiyonum.** Görüntüleyicide sol üstte yer imi simgesi (`.gor-isaret`, `aria-pressed`); dokununca eser koleksiyona girer/çıkar, altta “Koleksiyonuna eklendi” yazar. Veri: `ilerleme.koleksiyon = [{a: eser anahtarı, s: sanatçı id, t: tarih}]`, en yeni başta, en çok 500 (`js/koleksiyon.js`). Sanatçısı bilinmeyen eserde (`sid` yok) düğme çıkmaz. **Duvar:** `#/koleksiyon` (`js/ekranlar/koleksiyon.js`), Göz At'ın dört sütunlu bölüm çubuğunu bozmamak için Göz At'a değil **İlerleme'nin başına** bağlandı (“Koleksiyonum · N eser işaretli”). Duvar, sanatçı sayfasındaki eser ızgarasının aynısıdır; görüntüleyiciden işaret kaldırılıp kapatılınca duvar yenilenir. Düğme `goruntuleyiciAc({ koleksiyon })` seçeneğidir; `gorselTercihi()` her çağrıya otomatik ekler, böylece her görüntüleyicide (Göz At, arama, cevap yaprağı, tanışma…) çıkar. **Yapılmadı:** “işaretli eserler tekrar turunda biraz daha sık çıkabilir” (raporda “çıkabilir”, zorunlu değil): eser seçimi sanatçı başına yapılıyor ve Leitner'ı bozma riski var; ayrı bir iş olarak bırakıldı.
2. **İ1 · Çalışma takvimi ve seri.** İlerleme'nin başında, özet satırının altında: son 12 hafta, sütun = hafta (pazartesi başlar), satır = gün; kare rengi o günün en çok çalışılan akımının rengi (parlaklık günlük kart sayısıyla hafifçe artar), boş gün ince çerçeve, gelecek gün kesik çizgi, bugün mürekkep çerçeveli. Yanında “6 günlük seri”. Kutu/bulanıklık yok; karelerin sütun sütun belirme hareketi yalnızca sayfa ilk açılışında (`prefers-reduced-motion` açıkken yok). **Rapordan sapma:** raporda `ilerleme.gunluk["2026-10-22"]` yazıyordu, ama `ilerleme.gunluk` zaten bugünün sayaçlarını (`tarih`, `yeni`, `kart`, `yeniIdler`) tutuyor ve her gün sıfırlanıyor. Çakışmamak için geçmiş **`ilerleme.gecmis["2026-10-22"] = { kart, dogru, akimlar: { Barok: 3 } }`** olarak ayrı alanda (`js/gecmis.js`); kayıt `kartiBitir`de yazılır (tek soruluda cevapta, karışıkta ikinci sorudan sonra; ters soru dahil), eski yedeklerde boş. Seri kuralı: bugün henüz çalışılmadıysa dünden geriye sayılır (gün bitmeden sıfırlanmaz); bir gün atlanırsa sayı sıfırlanır, ceza yok.
3. **İ2 · Simge rozeti.** Ayarlar'da “Simge rozeti” anahtarı (varsayılan kapalı). Açarken `Notification.requestPermission()` istenir (iOS bunu şart koşar); izin verilmezse anahtar geri kapanır ve nedeni yazılır. Tarayıcı `navigator.setAppBadge` desteklemiyorsa anahtar devre dışıdır ve nedeni yazılır. Sayı: uygulama açılınca ve öne gelince **bugünün** vadeli sanatçı sayısı (Bugün'deki “tekrar bekliyor” ile aynı sayım, `vadeSayisi`); uygulama gizlenirken (`visibilitychange: hidden`, `pagehide`) **yarına kadar** vadesi gelenler (`yarinVade`) yazılır. 0 ise rozet temizlenir. Sunucu olmadığı için kapalıyken sayı kendiliğinden değişmez; yalnızca son yazılan kalır (rapordaki sınır). Ayar yedeğe dahil. Gerçek iPhone'da denenmedi (iOS 16.4+ ve ana ekran uygulaması gerekir).
4. **İ4 · Öğrenme eğrisi ve gelecek yük.** İlerleme'de takvimin altında iki el yapımı SVG: (a) son 12 haftanın haftalık doğru oranı çizgisi (0/50/100 çizgileri; kartsız haftada çizgi kopar; son nokta vurgulu; başlıkta “Son hafta: %78”), (b) önümüzdeki 14 gün için günlük vadeli sanatçı çubukları (bugün vurgulu; vadesi geçmişler bugüne yazılır; her sanatçı sanatçı ve akım sorularının en yakın vadesiyle bir kez sayılır; başlıkta “Bugün N · yarın N · 14 günde N sanatçı”). (a) günlük kayıttan, (b) doğrudan Leitner tarihlerinden (`haftalikOran`, `gelecekYuk`). Çizgi çizilerek, çubuklar yükselerek gelir (yalnızca ilk açılışta, azaltılmış harekette yok). Eski kullanıcının geçmişi bu sürümden başlar; ilk haftalarda grafik doludur denemez (raporda da böyle).
5. **İ5 · “Bu görsel hatalı” bildirimi.** Görüntüleyicide “Görsel kötü”nün yanında “⋯” düğmesi; açılan menü: Yanlış sanatçı · Heykel/mimari · Kötü görsel · Yanlış ad. Cevap yaprağında kaynak satırının sağında aynı “⋯” (yaprağı uzatmamak için ayrı satır açılmadı; 44 px hedef). Kutusuz, ince çizgili metin menüsü; seçenekler kırmızı altçizgili. **Davranış** (`js/bildirim.js`): “Kötü görsel” bilinen akıştır: yalnızca gösterilen görsel çıkar, eser başka görselle sürer (eski “Görsel kötü” düğmesi aynen duruyor ve artık aynı kaydı düşüyor; e2e testleri bozulmasın diye kaldırılmadı). Diğer üç neden eserin **bütün görsellerini** `ilerleme.kotuGorseller`e yazar: eser hemen pekiştirmeden çıkar (rapordaki “kotuler” listesi bu; yeni bir dışlama mekanizması icat edilmedi), galeri ve ızgarada görünmeye devam eder. Kayıt `ilerleme.bildirimler = [{a, s, baslik, neden, g, t}]` (aynı eser+neden+görsel tekrarında kayıt tazelenir, en çok 300). **Ayarlar → “Bildirdiğim görseller”:** son 8 bildirim, “JSON olarak kopyala” (`{uygulama, tur: "gorsel-bildirimleri", bildirimler}`; pano reddederse metin kutusunda gösterilir) ve “Listeyi temizle” (dışlamalar kalır). Bildirilen JSON'un `gorsel_kararlari.json`'a işlenmesi Claude oturumuna bırakıldı (raporda böyle); `data/` dosyasına dokunulmadı.
6. **T2 · Açılış yükü.** **Yapıldı:** `data/eser_notlari.json` (~100 KB) artık açılışta beklenmiyor; ilk ekran çizildikten sonra `setTimeout(…, 0)` ile yüklenir (`notlariYukle`). Not yalnızca görüntüleyicide kullanıldığından, görüntüleyici notlardan önce açıldıysa `atlas-notlar` olayıyla başlık yazısını yeniler (`d.eserNotlariHazir` bayrağı). **Yapılmadı:** Türkçe eser adları (`eser_adlari_tr.json`, ~400 KB) ertelenmedi: ilk ekranda (Günün sanatçısı, kartlar) eser adı gösteriliyor, ertelemek adların sonradan değişmesi için ekranı yeniden çizmeyi gerektirir ve oturum ortasında kartı bozabilir; raporun “bu bölümü yapamıyorsan yalnızca yüklemeyi ertele” notuna uyularak yalnızca eser notları ertelendi. Görsel listesi (`yerel_gorseller.json`) ve eser önbelleği (açık sanatçı süzmesi için gerekli) de beklenmeye devam ediyor. **Ölçülmedi:** iPhone'da Safari Web Denetçisi ile açılış kaydı alınmadı; kazanç tahminidir, ölçülmeden iyileşme iddia edilmiyor.
7. **T3 · Gerçek Safari.** `playwright.config.js`'e `projects` eklendi: `chromium` (varsayılan; `npm run test:e2e` artık `--project=chromium`, CI komutu değişmedi) ve `webkit` (`npm run test:webkit`; Mac'te önce `npx playwright install webkit`). WebKit projesi bütün takımı değil yalnızca `tests/e2e/safari.spec.js`'i çalıştırır: service worker ve ağ fikstürü ayrıntıları WebKit'te farklı olduğundan bütün takımı orada koşturmak yanlış alarm üretirdi. Spec: `animation-timeline: scroll()/view()` desteğini rapora yazar, yedi ekranda yatay taşma yok, Bugün sahnesinde kaydırma ve Pekiştir düğmesinin ekranda kalması, görüntüleyici düğmelerinin ≥ 44 px olması. Chromium'da da çalışır. Bu bilgisayarda WebKit çalıştırılmadı.
8. **T4 · Yenilikler.** `js/yenilikler.js` listesi (`YENILIKLER`, en yeni başta; yalnızca düzeltme olan sürümler girmez; yeni sürümde başa satır eklenir — bu sürümün satırı: “1.26 · Koleksiyonum, çalışma takvimi ve seri, …”). Bugün'de, sayfanın altındaki yedek hatırlatmasının üstünde ince çizgili not: kullanıcının son gördüğü sürümden bugünküne kadar olan satırlar; kapatma düğmesi var. `ilerleme.sonSurum` ilk gösterimde hemen yazılır (not o oturumda kapatılana kadar durur, sonraki açılışta yok). Yepyeni kullanıcıya (skor ve geçmiş yok) gösterilmez; bu özellikten önceki kaydı olan kullanıcıya (sonSurum yok) yalnızca bugünün sürümü gösterilir. Ayarlar'ın altında “Yenilikler” listesi her zaman. Önceki sürümlerin satırları (1.21.1, 1.23.0, 1.24.0, 1.25.0) bu KARARLAR kayıtlarından yazıldı.
9. **Dosyalar ve sürüm.** Yeni: `js/gecmis.js`, `koleksiyon.js`, `bildirim.js`, `rozet.js`, `yenilikler.js`, `js/ekranlar/calisma.js` (takvim ve grafikler), `koleksiyon.js`, `bildirim.js` (cevap yaprağı menüsü); hepsi `sw.js` kabuğunda. İki yeni ikon (`daha`, `isaret`). CSS app.css sonunda “Rapor 8. paket” bölümü. Sürüm 1.26.0 (`js/surum.js`, `sw.js`). `tests/unit/depo.test.mjs` yeni `ayarlar.rozet` alanı için güncellendi.

## İş 18 · Pekiştir'de neon sarı vurgu (2026-10-22, v1.26.1)

Emre: "pekiştir sekmesinde yine rengi neon sarı". Sebep bir gerileme değil: vurgu rengi Günün sanatçısının resminden seçiliyor (bugün Hogarth'ın sarı göğü → `#d0c766`), ve paletin en doygun orta tonu seçildiği için sarı-yeşil resimlerde düğmeler neon görünüyordu. `renk.js` içine `yumusat` eklendi. İlk sürümde (altın tonu) Emre "daha yumuşak, yağlı boya renkleri olsun" dedi; son hali: 45–75° arası sarılar okra (≈36–40°) kayar, doygunluk en çok 0,4 (yeşillerde 0,28), açıklık 0,30–0,46 arasında. Böylece vurgu her resimde okr, siena, toprak yeşili, koyu lacivert gibi yağlı boya tonlarında kalır; dolu düğmenin yazı kontrastı (≥ 4.5:1) korunur. Fırça izi dokusu denendi, Emre beğenmedi ("çok kötü"), geri alındı. Onun yerine dolu düğmelerin yazısı nazik bir serif oldu (Bodoni Moda italik 400, 19 px) ve parlama gölgesi kaldırıldı. Test: `tests/unit/renk.test.mjs`.

## İş 22 · Yarım kalanlar: tasarım kontrolü, K4 ve T2'nin eksikleri, hata denetiminin son üç maddesi (2026-10-23, v1.27.0)

1. **8. paketin ekranları 390 px'te çekilip Emre'ye gösterildi** (takvim, iki grafik, Koleksiyonum, görüntüleyicide ⋯ menüsü, cevap yaprağı, Yenilikler notu). Bulunan hata: **gelecek yük grafiğinin çubukları görünmüyordu**. SVG `<rect class="cubuk">`, İlerleme'deki eski 4 px ilerleme çubuğunun `.cubuk { height: 4px }` kuralına takılıyordu (CSS `height`, SVG2'de `rect`in yükseklik özniteliğini ezer); çubuklar 4 px'lik çizgi olarak üstte kalıyordu. Sınıf `yuk-cubuk` oldu; `paket8.spec.js`'e çubuğun gerçekten 20 px'ten yüksek çizildiğini sınayan satır eklendi.
2. **K4 · Koleksiyondaki eserler tekrar turunda iki kat sık.** `eserSec(…, { isaretli })` (js/eserler.js): son gösterilenlerden kaçınma ve seviye dilimi önce uygulanır; kalan adaylar arasında koleksiyondaki eser iki kat ağırlıkla seçilir (`KOLEKSIYON_AGIRLIGI`). Koleksiyonda eser yoksa ya da adaylar arasında değilse seçim eskisiyle aynıdır (aynı rastgele dizi, aynı sonuç; birim testli). Koleksiyondaki eser sanatçının pekiştirme havuzunda (ilk 12) değilse soruya girmez: havuz görsel kalitesi için sınırlı, Leitner sanatçı başına işliyor.
3. **T2 · Açılış.** Ölçüldü (Chromium, Node): `eser_adlari_tr.json` ayrıştırması ~2 ms, `eserler_onbellek.json` ~8 ms. Türkçe adları ertelemek bu yüzden değmez ve ilk ekranda özgün addan Türkçeye sıçrama yaratırdı; yapılmadı. Asıl gecikme sıralı beklemeydi: eser önbelleği (2 MB), kısa adlar, Türkçe konu adları, ilerleme ve yarım oturum, ilk dokuz dosya bitene kadar hiç istenmiyordu. Artık hepsi aynı anda istenir. Ölçüm (4× yavaşlatılmış işlemci, 60 ms gecikme, Playwright): ilk açılış ~2.6 s → ~2.2 s; önbellekten açılışta fark küçük (~1.4 s). iPhone'da ölçülmedi.
4. **Hata denetimi #9 · Yarış durumları.** `ortak.js`'e çizim sayacı (`cizimBaslat` her yönlendirmede, `cizimNo`, `guncelMi`). Beklemeden sonra eski ekranın çizmesi engellendi: Günün sanatçısı (iki bekleme; galeri dinleyicisi artık `onclick`, ikinci dinleyici eklenmez), başyapıt okuması, konu sayfası, Tüm eserler, Pekiştir'de oturum hazırlığı (çevrimdışıyken sanatçı başına 6 sn sürebiliyordu) ve kart hazırlığı (hazırlanan kart kaybolmaz, devamda kullanılır). Sanatçı sayfası, karşılaştırma, akım karşılaştırması, arama ve Koleksiyonum'da adres ya da `isConnected` denetimi zaten vardı. Yeni `tests/e2e/yaris.spec.js` (iki senaryo) eski kodda kırılıyor, yenisinde geçiyor.
5. **Hata denetimi #10 · Eser listesi.** (a) Önbellek dosyası ağ hatasında artık kalıcı `null` kalmaz, sonraki çağrı yeniden dener. (b) Wikidata'ya ulaşılamayınca (çevrimdışı, 429) sanatçının listesi belleğe yazılmaz; 60 sn aynı liste verilir, sonra yeniden denenir (`GECICI_SURE`). (c) Önbellek dosyası 30 günü geçince (bu dosya 2026-10-21'de üretildi, yani 20 Kasım'da) her sanatçı için aynı anda Wikidata yenilemesi başlıyordu; artık arka plan yenilemeleri sırayla, aralarında 1,5 sn ile ve oturum başına en çok 24 sanatçı (`ARKA_PLAN_SINIRI`). Birim testi: `tests/unit/hata_denetimi2.test.mjs` (üçü de eski kodda kırılıyor).
6. **Hata denetimi #11 · Met/CMA özgün dosya.** Veriye bakıldı: 1.218 Met görselinin hepsi `web-large`, 265 CMA görselinin hepsi `_web.jpg`; `original`/`_print` yok. Sorun yok, değişiklik yapılmadı. (Pekiştirme havuzundaki eserlerin küçük resimleri zaten yerel `gorseller/k/` kopyalarından geliyor.)
7. Sürüm 1.27.0; Yenilikler'e satır eklendi.

## İş 22b · Eksik verinin son turu (API, 2026-10-23, v1.27.1)

1. `icerik/v3_kalan.py`; yalnızca eksikler, var olan kayıtlara dokunulmadı. Sağlayıcı: önce Vercel AI Gateway (anthropic/claude-…-5.5), kredi bitince Anthropic.
2. Türkçe adlar: v2'de yalnızca köşeli parantez yüzünden alınmayan 4 Lorenzetti panel adı ([sol panel] → (sol panel)).
3. Zorluk: AIC 403 yüzünden puansız kalan havuz eserleri, depodaki yerel kopyalarla (Opus 5.5, sanatçının bütün havuzu birlikte).
4. Eser notları: v2'de boş kalanlar bu kez görselle (Sonnet 5.5); görselde açıkça görüneni ve başlıkla uyumlu olanı yazar, uymuyorsa boş bırakır.
5. Konular: en az 2 eserde geçen yeni konular (Opus 5.5 hikâye + ayrı istekte denetim, önceki 149 konunun yöntemiyle); var olan konular değişmedi.

## İş 23 · Yolculuk haritası (2026-10-23, v1.28.0)

1. **Neden:** Emre, Mario oyunlarındaki gibi kuş bakışı bir ilerleme haritası istedi: ilerledikçe açılan duraklar, her durakta o dönemden bir resim ya da dönemin temsili. Örnek olarak bir oyun haritası gösterdi; o resim kullanılmadı, haritanın bütün resimleri özgün.
2. **Resimler:** sekiz ada, her biri bir dönem (Orta Çağ · Rönesans · Barok · Klasisizm ve Geç Barok · Rokoko ve Neoklasisizm · Romantizmden Realizme · Empresyonizm ve sonrası · Modern sanat). OpenAI GPT Image 2 ile, Vercel AI Gateway üzerinden çizildi (`icerik/harita_cizim*.py`, Emre'nin Mac'inde): guaj-suluboya hikâye kitabı haritası, kuş bakışı tek ada, üstte ve altta aynı turkuaz deniz (adalar alt alta eklenebilsin), ortada zikzak toprak yol, yazı/insan/karakter yok. İlk ada sonrakilere üslup örneği olarak verildi. Her adada o dönemi temsil eden yapılar: gotik katedral ve surlu kasaba; kubbeli tepe kasabası ve kanal şehri; saray bahçeleri, yel değirmenleri ve liman; Fransız şatosu ve yanardağlı güney kıyısı; Rokoko köşkü, labirent ve Neoklasik tapınak; kayalıklar, yıkık manastır, akademi ve oryantal çarşı; demir köprü, tren, gelincik tarlasında şövaleler ve nilüferli göl; kübist kasaba, modernist kule ve soyut heykeller. `gorseller/harita/<bölge>.webp` (1024×1536, toplam ~2,3 MB; Orta Çağ dışındakiler tembel yüklenir).
3. **Yerleşim:** bir adada en çok 5 durak sığdığı için Barok ve XIX. yüzyıl ikişer adaya bölündü (`js/harita.js` `BOLGELER`). Her adanın boyalı yolunun noktaları elle işaretlendi (`yol`, resmin genişliğine/yüksekliğine oranla); duraklar bu yol boyunca eşit aralıkla (%12–%86) dizilir, levhalar yolun boş tarafına. Yolculuk alttan yukarı: Orta Çağ en altta, Modern en üstte. Adalar birbirinin denizine biner; üst kenar saydamlıkla geçer (bulanıklık yok).
4. **Durum:** açık durak = dönemin açık sanatçısı var (Göz At ile aynı kural, `akimDurumlari`). Durakta dönemin başyapıtı (yakın okuması olan eser, yoksa bir kurs sanatçısının en bilinen eseri), levhada yıldızlar: ★ Orta'ya, ★★ Zor'a geçince, ★★★ Zor'da da %80 (dönem seviyesinden). Kilitli durak gri ve kilitli, levhada açılacağı konu; hiçbir durağı açık olmayan ada gri ("kilitli"). Kursta açılmış en ileri durakta "Buradasın". Geçilen yol boyalı yolun üstünde altın noktalarla akar. Yeni açılan durak (son bakıştan beri; `ilerleme.haritaGorulen`, yedeğe dahil) büyüyerek gelir, yeni açılan ada griden renklenir. Hareketler `prefers-reduced-motion`a uyar.
5. **Küçük pencere** (Emre'nin seçimi): durağa dokununca altta, opak, keskin kenarlı bir levha: başyapıt, eser ve sanatçı, yıldızlar, seviye durumu, açık sanatçı sayısı, "Tura başla" (`#/pekistir/donem/<akım>`) ve "Akım sayfası". Kilitli durakta "Konu N işlenince açılır" ve "İlerleme'ye git". Dışına dokununca ya da Esc ile kapanır.
6. **Giriş:** İlerleme'nin başında "Yolculuk haritası · Buradasın: … · N/29 durak · ★" satırı (`#/harita`). Dikey düzen Emre'nin seçimi; yatay taslak kaldırıldı.
7. Testler: `tests/unit/harita.test.mjs`, `tests/e2e/harita.spec.js`. Yerel test sunucusuna `.webp` türü eklendi. Sürüm 1.28.0.

## İş 24 · Yeni yolculuk haritası ve bölümler (2026-10-24, v1.29.0)

1. **Neden:** Emre İş 23'ün ada haritasını beğenmedi. Her şeyi o seçti; burada yalnızca uygulamaya giren kararlar yazılı. Ayrıntılı seçim günlüğü: `icerik/harita_oyun_kararlari.md`.
2. **Resimler:** sekiz dönem, her biri kendi döneminin üslubunda bir resim (Orta Çağ Grok; Rönesans, Aydınlanma, Romantizm FLUX.2 Pro; Barok, Barok II, Modern GPT Image 2; XIX. yüzyıl Seedream), her birinin gecesi aynı resimden düzenlenerek. Seçim `icerik/harita_secim.json`. Bölgeler sisle birbirine geçer (%12 biner). Gündüz/gece saate göre (07–19), başlıktaki düğmeyle değişir. `gorseller/harita/{bölge}_{gunduz|gece}.webp` 780×1170; durak nesneleri ve yolcular ayrı küçük resimler.
3. **Bölüm:** bir akımın içinde kurs konusuna göre küme (3 sanatçıdan azsa sonraki konuyla birleşir; `js/bolum.js`). Yalnız görünen (resmi olan) sanatçılar: 155 sanatçı, 37 bölüm. Akış: tanıtım (bölümün sanatçılarıyla tanışma) → Kolay 8 soru → Orta 10 soru → isteğe bağlı Zor 10 soru; geçme %75, yalnız ilk denemeler sayılır (yanlış kart Leitner gereği turda yeniden gelir ama puana girmez). Orta geçilince sonraki bölüm açılır; sonraki akım, akımın bölümlerinin ⌈%60⌉'ında Orta geçilince ve kursta konusu işlenince. Kayıt `ilerleme.bolumler[id] = {kolay, orta, zor, tanitim}` (en iyi oran), yedeğe dahil. Bölüm turu dönem seviyesine yazmaz.
4. **Harita:** her bölüm o dönemin boyalı bir nesnesi (Orta Çağ flama, Rönesans kaide, Barok vb.). Kilitli = gri ve soluk; açık durağın altında yalnız yanıp sönen yumuşak ışık; "buradasın" durağında dönemin yolcusu (zıt renk), ışık sütunu, kıvılcımlar ve yer ışığı. Geçilen yol işaretlenmez; yıldızlar yalnız durak penceresinde. Saklı motifler: resimlerdeki 54 görünür motif görünmez düğme; dokununca eserin künyesi ve hikâyesi (`data/harita.json` `eserler`, metinler Claude API ile yazıldı).
5. **Sekmeler:** Bugün · Harita · Pekiştir · İlerleme. Göz At sekmesi haritaya katıldı (durak penceresinden sanatçılara ve akım sayfasına); akım listesi `#/gozat` adresinde durur. Harita sekmesi büyük ve yükseltilmiş. Sekme çubuğu parmağı izler, bırakınca o sekmeye geçer (bağlantı sürükleme ve iOS önizlemesi kapalı).
6. Ekran denetiminde bulunan iki hata: kilitli durağın saydamlığı genel `img.yuklendi { opacity: 1 !important }` kuralına takılıyordu (saydamlık düğmeye taşındı); ışık sütununun yanları köşeliydi (elips + maske).
7. Testler: `tests/unit/harita.test.mjs`, `tests/e2e/harita.spec.js` (bölüm turu baştan sona). Sürüm 1.29.0.

## İş 24b · Göz At sekmesi geri (2026-10-24, v1.29.1)

1. 1.29.0'da Göz At sekmesi haritaya katılmıştı; akım listesi ve sanatçı sayfaları duruyordu ama onlara açılan düğme kalmamıştı. Emre sekmenin geri gelmesini istedi, sırayı o seçti: Bugün · Harita · Göz At · Pekiştir · İlerleme. Harita büyük kalır.
2. Akım, sanatçı, başyapıt, konu, arama ve zaman şeridi sayfaları yine Göz At sekmesinde görünür (1.28.0'daki gibi). Sekme çubuğu 5 sütun (`--sekme-n`).
3. Yenilikler'e satır eklenmedi (yama sürümü).

## İş 25 · Konular kart ızgarası (2026-10-24, v1.29.2)

1. Emre'nin isteği: Konular listesi yazı yazı değil; her konu başlığı ve o konunun en ünlü resmiyle bir kart, dokununca konunun sayfası (hikâye ve öbür resimler). Düzeni o seçti: iki sütun, resim üstte (4:5, kırpılmış), ad altında; Eski Ahit · Yeni Ahit · Mitoloji başlıkları kalır. Kartta özet ve eser sayısı yok; ikisi konu sayfasında.
2. "En ünlü": konunun görseli olan eserleri arasında Wikipedia'da maddesi olan dil sayısı (`sl`) en büyük olan; eşitse kurs eseri, o da eşitse listedeki ilk (`kapakSec`, js/ikonografi.js, birim testli). "Görsel kötü" denen görsel kapakta da kullanılmaz.
3. Sanatçıların eser listeleri sayfa açılınca bir kez yüklenir; kapaklar tembel yüklenir.

## İş 26 · v0 önizlemesi için `npm run dev` (2026-10-24)

1. Emre projeyi v0'a bağladı; v0 önizleme için package.json'da `dev` betiği arıyor ("No Dev Script Found"). `npm run dev` = `node scripts/sunucu.mjs --sw-yok`: uygulamayı yine /sanat-atlasi/ altında sunar, portu `PORT` ortam değişkeninden alır.
2. `--sw-yok`: sw.js 404 döner, service worker kurulmaz. Uygulama kabuğu önbellekten (cache-first) geldiği için, aksi hâlde v0'ın yaptığı değişiklikler önizlemede sürüm değişene kadar görünmezdi. Uygulamanın kendisi ve yayın değişmedi; testler ve `npm run serve` eskisi gibi service worker'lı.
3. v0'da ilk denemede sunucu açılmadı: `PORT` verilmemişti, 4173 doluydu (EADDRINUSE). Artık `npm run dev` portu verilmezse 3000'den başlar, doluysa sıradaki boş portu dener (en çok 20). Port elle ya da `PORT` ile verilmişse eskisi gibi o porttan şaşmaz (testler 4173'te).
4. Sonra önizleme ERR_TOO_MANY_REDIRECTS verdi: v0'ın vekil sunucusu adresi kendi düzenliyor, kökten /sanat-atlasi/'ye yönlendirme döngüye giriyordu. `npm run dev` artık yönlendirmez; uygulamayı kökte (ve /sanat-atlasi/ altında) sunar. `npm run serve` ve testler eskisi gibi.

## İş 27 · v0 tasarımı içeri alındı (2026-10-24, v1.30.0)

1. Emre v0'da (Claude Opus tabanlı, sanat-atlasi-t0 projesi) Pekiştir, İlerleme ve başka ekranları yeniden tasarlattı; v0 değişiklikleri `v0/pekistir-ilerleme-redesign` dalına yazdı. Emre önizlemede beğendi ("güzel oldu"). Ne istendiği v0 sohbetinde; buradaki kontrol yalnız dalın kodu üzerinden.
2. v0'ın getirdikleri (dalın kayıtlarından): Pekiştir ve İlerleme yeni panolar (hafıza merdiveni sonra kaldırıldı, eser yelpazeli düğmeler, halkalar), yeni sekme adları ve simgeleri (Tuval · Yolculuk · Galeri · Atölye · Defter), Bugün'de tablonun önündeki Pekiştir düğmesi kaldırıldı (alttaki günün defteri), Galeri'de başyapıt vitrinleri, konular mozaiği, zaman okuyucu; harita durak penceresi ve sembolleri. index.html'e önizleme ortamının `querySelector('#/…')` hatasını susturan küçük bir koruma.
3. Kontrolde bulunan ve düzeltilen: yeni `js/ekranlar/pano.js` service worker kabuk listesinde yoktu (çevrimdışıyken Pekiştir/İlerleme açılmazdı). Sürüm 1.30.0, Yenilikler satırı.
4. Eski arayüze bağlı 8 uçtan uca test yeni arayüze göre güncellendi (Bugün'deki düğme yerine Pekiştir menüsü; dönem satırları adresiyle; kitaplar renksiz kontrolü renk doygunluğuyla). Testlerin anlamı korundu.

## İş 28 · İlerleme kitaplığında boş kapaklar (2026-10-24, v1.30.1)

1. Emre: kitaplıkta bazı konuların kapağı boş (çizgili). Sebep: kapak, konuya bağlı sanatçının en bilinen eseriydi; 15 konunun görünür (resim yapan) sanatçısı yok. Kimi o sanatçıyı başka konuda anlatan dersler (Leonardo, Raffaello, Michelangelo), kimi heykel/mimari (Ghiberti, Donatello, Bernini, Vatikan), kimi hiç eseri olmayan dersler.
2. Emre'nin kararı: resim yoksa o eserin ya da sanatçının fotoğrafı; hiçbiri yoksa konu kaldırılsın. `js/kurs.js` (`konuKapagi`, `kursKonulari`, birim testli) sırayla: konunun sanatçısı → o dersteki kurs resmi (başlıktaki sanatçınınki önce) → başlığın ilk kelimesi olan sanatçının en bilinen eseri → o dersteki, başlıkta adı geçen sanatçının eserinin fotoğrafı (heykel/yapı olabilir; sorularda ve galeride yine yalnız resim) → herhangi bir ders eseri. Ad eşleşmesi tam kelime (soyadı): "Bernini, David" Jacques-Louis David'e, "Brunelleschi" Le Brun'a gitmez.
3. Kapağı olmayan 4 konu kitaplıkta ve sayılarda gösterilmez: 47 Doğrusal perspektif, 55 Rodin (veride ne eseri ne fotoğrafı var), 60 Teknoloji ve mimari, 61 Amerikan ressamlar. Veri silinmedi; "işlendi" kayıtları durur. Kitaplık 57 konu.
4. Bu kapakların çoğunun yerel kopyası yok, Wikimedia'dan gelir (ilk görülüşten sonra önbellekte).
5. Emre: kapaklar da indirilsin. `scripts/kapaklar.mjs` kitaplıktaki 57 kapağın görselini uygulamanın kendi seçimiyle (js/kurs.js, enBilinen) listeler; `scripts/gorsel_indir.py --kapaklar` yalnız bunları indirir (normal çalıştırma da artık kapakları içerir). Kapak dosya adları çözülmüş biçimde tutulur (`dosyaNormal`), yerel kopya anahtarı tutsun diye. WikiArt'tan gelen 4 kapak (konu 63–66: Picasso, Duchamp, Dalí, Bacon) eski karar gereği indirilmez (telifli olabilir), çevrimiçi kalır.
6. Emre: "boş kalmasın, çirkin duruyor". Kapak görseli yüklenemezse (çevrimdışı ilk açılış ya da çevrimiçi kalan WikiArt kapakları) artık kara kutu değil, yaldız ışıklı bir pano görünür; numara ve konu adı üstünde kalır.

## İş 29 · Kitaplıkta okunmayan yazılar (2026-10-24, v1.30.2)

1. Sebep: kitapların yazı rengi temanın zemin rengiydi (`color: var(--bg)`); koyu temada kararmış resmin üstüne kara yazı düşüyordu. Yazı artık her temada açık renk.
2. Emre: "arka plan daha önemli, büyük ve baskın yazılar olmasın". Numara 30 → 21 px, konu adı 14 → 13 px ve en çok 2 satır, alt satır 9 px; yazının arkasında yalnız altta yumuşak gölge, üstteki karartma azaltıldı; işlenmemiş kapaklar biraz daha aydınlık (parlaklık 0.55 → 0.68).
3. Sanatçısı olmayan (kapağı ders eserinden gelen) konularda yanıltıcı "sanatçı yok" yazısı kaldırıldı.

## İş 30 · Haritada katmanlar (2026-10-24, v1.31.0)

Emre'nin istekleri ve seçimleri:
1. **Kolay:** tanıtımda her sanatçının 5 eseri (eskiden 3) ve Kolay'ın soruları yalnız bu eserlerden; "rastgele başka eser" yok.
2. **Orta:** ilk Orta'dan önce kendi tanıtımı (`tanitimOrta` kaydı; haritadaki pencerede "Orta tanıtımı" bağlantısı, `#/pekistir/bolum/<id>/tanitim-orta`). Kolay'da görülmeyen, orta zorlukta yeni 5 eser; Orta soruları yalnız onlardan.
   Seçim (`bolumEserleri`, js/bolum.js): sanatçının pekiştirme havuzu kolaydan zora (zorluk puanı, yoksa Wikipedia dil sayısı) sıralanır; Kolay = ilk 5, Orta = sonraki 5. Sanatçının 5'ten fazla eseri yoksa Orta, Kolay'ın eserlerini sorar. Seçim belirlenimli: aynı bölüm her açılışta aynı eserleri tanıtır (bir görsel "kötü" işaretlenirse sıradaki gelir). Zor sınırlanmaz.
3. **Şıklar (Kolay ve Orta):** 1 şaşırtmalı (aynı akım, yoksa komşu akım ±50 yıl) + 2 uzak dönemden (`seviye: 'karma'`, js/celdirici.js). Zor eskisi gibi (aynı akım).
4. **Akrabalar her yerde:** aynı soyadlı sanatçılar hiçbir soruda (bütün kipler ve seviyeler, karıştırılan ikili eşi dahil) hedefin şıkkı olmaz, şıklar da birbirinin akrabası olmaz. Soyadı adın son kelimesi ("the Elder/Younger", "il Giovane" atılır). Görünür veride üç çift: Pietro/Ambrogio Lorenzetti, Orazio/Artemisia Gentileschi, Charles Le Brun/Élisabeth Vigée Le Brun (son ikisi akraba değil ama aynı soyad, kural onları da ayırır). Aday yetmezse şıklar birbirinin akrabası olabilir, hedefinki asla (4 şık kalsın diye).
5. Bölüm turunda ayrıca yeni sanatçı tanışması açılmaz (bölümün tanıtımı zaten yapıldı).
6. Testlerde iki eski fikstürün sanatçı adları aynı son kelimeyi paylaşıyordu ("B yakın", "D yakın"); yeni kural yüzünden benzersiz adlar verildi, testlerin anlamı aynı.

## İş 31 · Harita: dönem geçişleri, yolcu, düzenli duraklar, kaydırma (2026-10-24, v1.33.0)

Emre'nin istekleri ve seçimleri:
1. **Dönem geçişi:** dönem resimleri artık üst üste binmiyor; aralarında yarım resim boyu bir geçiş şeridi var (`ARA = 0.5`, js/harita.js; `haritaKur`'un `ara` parametresi, varsayılanı 0 olduğu için eski yerleşim testi geçerli). Şeritte iki resmin kenar renkleri bulanıkça birbirine akar (yüklenen resimden, ek istek yok), ortada sis ve yeni dönemin yüzyılı, adı, bölüm sayısı. Şerit görüş alanının ~%45'ine girince sis iki yana aralanır, ışık süzülür, ad bulanıktan netleşir; şerit ekrandan çıkınca sıfırlanır, her geçişte yeniden oynar. Görülmemiş dönem resmi soluk durur, görülünce renklenir. Hareket azaltma açıksa hepsi durağan.
2. **Yolcu:** 1,6 kat büyük; duraklardaki krem + koyu kontur, altın ışık, arkasında beyaz hale, başının üstünde zıplayan altın ok, hafif yürüme salınımı. Durağın soluna 40 pt aralıkla konur (semboller sağa açılır). "Buradasın" durağının sembolü artık parlamaz ve zıplamaz: parıltı yalnız yolcuda.
3. **Düzenli duraklar:** Rönesans'ta üç durak uzaktaki yolda üst üste, XIX. yüzyılda yedi durak resmin alt yarısındaki kısa yolda dip dipeydi. Bu iki bölgeye `DURAK_DUZENI` (js/harita.js) ile elle noktalar verildi: yolun kenarında, alttan üste kabaca eşit aralıkla, bir sağına bir soluna (Modern'deki gibi). XIX. yüzyıl sembolleri %72 boyutta. data/harita.json değişmedi; öteki bölgeler oradan okunur.
4. **Uçlar:** haritanın altında ve üstünde birer şerit (`UC = 0.42`, `haritaKur`'un `uc` parametresi): altta "Orta Çağ · Yolculuk buradan başlar", üstte "Yolun sonu"; şerit resmin kenar rengiyle başlayıp sayfanın zeminine söner (eskiden resim siyah zeminde keskin kenarla bitiyordu). Haritanın kendi koyu zemini kaldırıldı.
5. **Gündüz/gece:** düğme başlıktan çıkıp sağ üstte yüzüyor (geniş ekranda 620 px'lik sütunun içinde); basınca harita "buradasın"a zıplamaz, olduğu yerde kalır; destekleyen tarayıcıda iki hâl birbirine yumuşakça geçer (View Transitions).
6. **Kaydırma (Emre seçti: konma, derinlik, zaman göstergesi):** duraklar ilk kez ekrana girince yukarıdan küçük gelip sekerek yere konar (açılışta görünenler animasyonsuz); geçiş şeritlerinde sis haritadan hızlı, dönem yazısı yavaş kayar; sağ üstteki gösterge ekranın ortasına en yakın dönemin adını ve yüzyılını yazar, dönem değişince kayarak değişir. Hareket azaltma açıksa konma ve derinlik yok, gösterge durağan.
7. Sürüm önizlemede 1.32.0 olarak görülmüştü; yeni değişiklikler önbellekten gelmesin diye 1.33.0 (1.32.0 yayımlanmadığı için Yenilikler'de tek satır).
8. **Yeni semboller (v1.33.1):** Rönesans'ta düz beyaz kaide yerine mermer büst, Romantizmden Realizme'de yol tabelası yerine kayaya yaslanmış ressam paleti. Resimleri Emre üretti (beyaz zeminli suluboya); Emre büstü ve paleti seçti (kubbe ve fener de denendi). `scripts/sembol_hazirla.py` (rembg): nesne opak, zemin ve suluboya gölge şeffaf (kontur filtresi yarı opak gölgeyi nesne sanıp çevresine çizgi çekiyordu; büstle fenerde model gölgeyi nesneye kattığı için o alan elle kesildi), 3 kat çözünürlük, ayak noktası ölçüsü `DURAK_DUZENI.<bölge>.nesne`'ye. Yeni dosya adları (`nesne_ronesans_bust_*`, `nesne_romantik_palet_*`, `DURAK_DUZENI.<bölge>.dosya`): gorseller/ önbelleği sürümden bağımsız olduğundan aynı adla değişen resim telefonda yenilenmezdi; eski kaide ve tabela dosyaları silindi. Boylar Emre'nin "kaba duruyor" uyarısıyla küçük: büst 46 pt, palet 34 pt. Büst krem rengi olduğu için krem kontur arkasında beyaz leke gibi duruyordu: yalnız ince koyu kontur (`#durak-kontur-ince`); dar olduğundan dokunma alanı iki yana açık. Gece paleti Emre'nin isteğiyle kilitliyken de renkli ve parlayıp sönmez (gece sürümünde doygunluk korunur).
9. **İkinci deneme (v1.33.2):** ilk büst ve palet "olmamış" (beyaz zeminli suluboya eskiz, ötekilerin boyalı oyun taşı görünümüne uymuyordu). Emre yeni istemlerle (mevcut bir sembol stil örneği olarak verildi; dik duran nesne, küçük çimen tabanı) yeniden çizdirdi. Rönesans'ta kaide üstünde yeni büst (52 pt); Romantizmden Realizme'de palet yerine Emre'nin seçtiği sarmaşıklı direkte fener (50 pt; gece sürümünde camdaki ışık yanık kalır, kilitliyken de renkli ve parlayıp sönmez). Betik: `beyaz_zemin` (modelin kestiği dağınık çimen tabanı beyazdan uzaklıkla geri gelir, kenarı toparlanır), `uyum` (renkler bölgenin harita resmine doğru kaydırılır; gece sürümü gece resminin ışığından türer) — Emre'nin "arka planla uyumlu olmuyor" uyarısıyla. Yeni semboller ince koyu konturlu (krem kontur çıkartma gibi gösteriyordu).

## İş 32 · Telefonu eğince Bugün'ün tablosu (2026-10-24, v1.34.0)

Emre'nin isteği: telefonu sağa sola çevirince Bugün'deki ana ekran da dönsün.
1. `js/egim.js`: `deviceorientation` (gamma sağ-sol, beta ön-arka). Sıfır noktası tutuş açısı: ilk ölçüme oturur, sonra yavaşça yeni tutuşa kayar (sabit tutunca tablo ortalanır). 22° eğim tam etki; tablo en çok 5° döner (eğilen kenar geriye gider), 14/10 px kayar; kenarı görünmesin diye resim 28 px taşar. Işık (yumuşak parlama) eğim yönüne kayar. Değerler yumuşatılır (her karede %18). Saf hesap birim testli.
2. Resmin kendi animasyonları (açılış yakınlaşması, kaydırınca yaklaşma) `transform` ve `scale` kullandığından eğim `translate` ve `rotate` ile, adda (animasyonu `translate`) `transform` ile uygulanır: çakışmaz.
3. İzin: iOS hareket verisini yalnız dokunuşun içinden istenen izinle verir. Ayar açıksa (varsayılan açık) Bugün'de ilk dokunuşta istenir (v1.34.6'da değişti, aşağıda 9.); reddedilirse o oturumda bir daha sorulmaz. Ayarlar'da "Telefonu eğince tablo oynasın" anahtarı (açarken izin ister). Hareket azaltma açıksa çalışmaz. Sayfadan çıkınca dinleme biter.
4. **Adın derinliği (v1.34.1, Emre: "ismi de güncelleyelim, derinliği artıralım"):** ad tek parça değil, katman katman ters yöne kayar: alt satır (yıllar · akım) 4/3 px, ilk ad 10/6 px, büyük soyad 18/11 px; tablodan "uzaklaştıkça" daha çok. Soyadın ve ilk adın gölgesi eğim yönüne gider, yazı ile gölgesi arasında boşluk açılır (yazı tablonun üstünde yükselmiş gibi). Açılış animasyonları transform kullandığından katmanlarda translate.
5. **Kesik harf kuyrukları (v1.34.2):** büyük soyadın satır yüksekliği 0.98 ve tek satıra sığdırma için `overflow: hidden` olduğundan g, y, ş gibi harflerin alt kuyruğu kesiliyordu (Emre fark etti). Altta 0.22em, üstte 0.06em iç boşluk ve aynı kadar negatif kenar boşluğu: kuyruk görünür, düzen değişmez; bütün ekranlardaki adlar için.
6. **Kasma ve rastgele zıplama (v1.34.3, Emre fark etti):** (a) Cihaz açıları (beta/gamma) telefon dik tutulunca kararsızlaşıyor (gimbal kilidi; gamma 180° sıçrıyor), ad rastgele yerlere gidiyordu. Kaynak artık jiroskop (`devicemotion` → `rotationRate`, °/sn): dönüş hızı toplanır, 1,6 sn'lik sönümle bırakınca ortaya döner (iPhone duvar kâğıdındaki gibi); her tutuşta aynı çalışır, sağa sola çevirmeyi (dik tutuşta da) algılar. İzin `DeviceMotionEvent.requestPermission` (iOS'ta hareket ve yön tek izin). Jiroskop yoksa açılar yedek olarak, yerçekimi yönünden takla atmayan biçimde kullanılır; titreme süzülür, sıfır noktası 4 kat yavaş izlenir (hızlıyken kısa bir eğimden sonra ad ters yöne fırlıyordu). (b) Gölge her karede değişen text-shadow'du (iPhone'da her karede yazı yeniden çiziliyordu): artık soyadın bir kez çizilen bulanık kopyası (`::before`, `data-ad`), yalnız kaydırılır; kayan katmanlarda `will-change`.
7. **iPhone'da yalnız yukarı aşağı (v1.34.4, Emre fark etti):** `rotationRate` eksenleri standartta beta = yatay eksen, gamma = dikey eksen; iOS Safari kaydırır (alpha = yatay, beta = dikey). Sağa sola çevirme iPhone'da beta'da geldiği için tablo yukarı aşağı oynuyordu. iOS'ta (iPhone/iPad, masaüstü kimlikli iPad dahil) eksenler ona göre okunur (`hizEksenleri`).
8. **Ad yavaş izler (v1.34.5, Emre: "metin çok hızlı kayıyor"):** tablo eğimi her karede %20 yaklaşarak izler, ad ayrı değişkenlerle (`--yzx`, `--yzy`) %6 yaklaşarak: ad tablonun gerisinden ağır ağır gelir; gecikme derinliği de artırır.
9. **"Hareketi aç" düğmesi (v1.34.6, Emre: "bazen izin istiyor bazen istemiyor"):** iOS hareket iznini kalıcı tutmaz (uygulama kapanıp açılınca çoğu zaman unutur) ve web uygulamasının bunu kalıcı yapmasının yolu yok. Eskiden izin Bugün'de ekranın herhangi bir yerine ilk dokunuşta isteniyordu, kutu beklenmedik anda çıkıyordu. Artık açılışta izin dokunuşsuz sorulur: iOS hatırlıyorsa evet der, hareket kutusuz başlar; hatırlamıyorsa (dokunuş gerektiği için reddeder, kutu açılmaz) tablonun sağ üstünde "Hareketi aç" düğmesi belirir, izin yalnız ona dokununca istenir (Emre'nin seçimi). Ayarlar'da hareket anahtarının altında da "Hareket iznini ver" düğmesi (aynı koşulla görünür). Ayrıca soyadın gölge kopyası ekran okuyucuda adı iki kez okutuyordu: `content: attr(data-ad) / ''`.

## İş 33 · Bugün'ün duvar etiketleri tuvalle bütünleşir (2026-10-25, v1.34.7)

Emre'nin isteği: Bugün sahnesindeki yazı kutuları (Hayatı, Nasıl tanırım?, Notlarımdan) "sonradan eklenti gibi" duruyordu. Tasarım tuvalinde üç yön denendi (doğrudan tuvalde, müze etiketi, eriyen cam); Emre A'yı, "doğrudan tuvalde"yi seçti ve sahnedeki bütün etiketlere uygulanmasını istedi.
1. Kutu, kenar çizgisi, altın üst çizgi, gölge ve cam bulanıklığı kalktı; yazı doğrudan tablonun üstünde durur. Okunurluk için arkada kenarı olmayan, ortadan dışa doğru sönen eliptik bir karanlık (`::before`, temanın zemin renginden; Sepya/Açık'ta krem bir sis olur) ve harflerde hafif gölge var.
2. Başlığın (HAYATI vb.) yanından sağa doğru sönen ince altın bir çizgi uzanır; okuma metni 19 px; ilk harf altın renkte ve büyük. "Devamını oku →" artık çizgisiz, 44 px dokunma yüksekliğinde.
3. Kaydırınca tablo biraz daha kararır (parlaklık 0.62 → 0.52): ışıklı tablolarda da yazı okunsun.
4. **Metinler tam açık, Notlarımdan kalktı (v1.34.8, Emre'nin isteği):** sahnedeki etiketler kesilmez, "Devamını oku" ve dokununca açma kalktı (ilgili JS ve CSS silindi). "Notlarımdan" sahneden kaldırıldı (Günün sanatçısı sayfasındaki not yerinde). Uzun biyografi ekrandan uzun olabildiğinden: arkadaki karartma boydan bağımsız (üstte ve altta 90 px'te söner, yanlarda maske), belirip silinme animasyonu da kenarlara bağlı (üst kenar ilk 300 px'te netleşir, alt kenar son 220 px'te silinir) — okunurken solmaz.

## İş 34 · Harita: her dönem geçişinde bölüm kartı (2026-10-25, v1.35.0)

Emre: "harita kısmında kaydırma çok hızlı geçiyor, her dönem geçişinde bir animasyon olsun".
1. Sağ üstteki zaman göstergesinin dönem değişimini algılayan yer (ekranın ortasına en yakın dönem resmi) aynı anda ekranın ortasında **bölüm kartı** oynatır (`bolumKarti`, js/ekranlar/harita.js): kısa süre kararan yumuşak bir hale (kenarsız), açılan iki altın çizgi arasında yüzyıl, dönemin adı (bulanıktan netleşir) ve "N bölüm · M açık / henüz kilitli"; 1,9 sn sonra yukarı doğru silinir. Kart sabit (fixed) olduğu için şerit hızla geçse de ekranda kalır; geçişi yavaşlatma hissi buradan gelir. Kaydırma kilidi ya da yakalama (scroll-snap) eklenmedi: "Buradasın"a kaydırmayı bozar, parmağı tutar.
2. Hızlı kaydırınca her yeni dönemde kart baştan oynar. Kart oynarken şeritlerin kendi dönem yazısı gizlenir (aynı ad iki kez üst üste görünüyordu). Dokunmayı engellemez (`pointer-events: none`).
3. Uygulamanın kendi kaydırması (açılışta "buradasın"a, "Buradasın" düğmesi) kart oynatmaz. Hareket azaltma açıksa kart yok (gösterge yeterli). İlk açılışta da yok.
4. Test: `tests/e2e/harita.spec.js` (Rönesans'a kaydırınca kart Rönesans'ı duyurur, kendiliğinden kapanır).

## İş 35 · v0 dalı içeri alındı: dönem düğmesi, akım sayfası, harita perdesi (2026-10-25, v1.36.0)

Emre v0'da (`v0/donem-gecis-firca-akim`, 7 kayıt, güncel main'in üstünde) değişiklik yaptı ve birleştirilmesini istedi ("sorun varsa diğer dallara da bak").
1. v0'ın getirdikleri: akım sayfası önem sırasına göre (tanıma → eserler → sanatçılar → pekiştir → dönem → karşılaştırma → tipik konular), bölüm başlıkları, ipuçlarının yanında eserden yakın plan "büyüteç"; "Bu dönemi pekiştir" düğmesinde dönemin en bilinen eseri, dönemin tekniğiyle sahnede kurulur (`akimUslubu`, `TEKNIKLER`: vitray, mozaik, perspektif, chiaroscuro…); haritadaki bölüm kartının arkasında dönemin renginde üç katlı perde (ileri giderken alttan, geri dönerken üstten); İlerleme'de fırça izli "İşlendi yap".
2. Denetim: bütün akımların bir üslubu var (`akimlar.json`'daki her ad `USLUPLAR`'da); yeni dosya yok (çevrimdışı kabuk listesi değişmedi); birim 244/244, e2e 82/82; akım sayfası, harita ve İlerleme tarayıcıda açılıp bakıldı, konsolda hata yok.
3. Eksik olan tek şey sürümdü: v0 sürümü artırmamıştı, service worker kabuğu önbellekten verdiği için değişiklikler telefona gelmezdi. 1.36.0 + Yenilikler satırı eklendi.
4. Öteki dallar: birleşmemiş görünen kayıtları olan eski dallar (`claude/pekistirme-devam`, `claude/project-thread-qufexy`, `-vejy41`, `claude/seviyeler`) incelendi; işleri main'e squash ile girmiş (KARARLAR İş 18, devam kartı), alınacak bir şey yok.
5. Not: İş 18'de fırça izi dokusu düğmelerde denenmiş, Emre beğenmemişti; v0'daki fırça izli "İşlendi yap" Emre'nin kendi v0 çalışması olduğu için olduğu gibi alındı.

## İş 36 · Akım sayfasında dönemin hikâyesi (2026-10-25, v1.36.1)

Emre: "dönem açıklamalarını yazdırmıştık, onları dönemin içine ekleyelim ama uzayıp gitmesin, devamını oku şeklinde kısalt".
1. `data/akim_bilgi.json`'daki metin (28 akım, 150–175 kelime; şimdiye kadar akım sayfasında yalnız ilk cümlesi pekiştir düğmesindeydi, tamamı Günün sanatçısı sayfasında) akım sayfasının başına, palet şeridinin altına "Kısaca · Dönemin hikâyesi" bölümü olarak girdi; üstünde dönem ve yer.
2. 6 satırla kısaltılır, alt kenarı söner; altında "Devamını oku ↓" (44 px), açılınca "Kısalt ↑" (`aria-expanded`). Metin 6 satıra sığarsa düğme hiç görünmez. Metin değişmedi.
3. Sürüm 1.36.1 (yalnız ekleme; Yenilikler listesine düzeltme sürümleri girmez). Test: `tests/e2e/kesif.spec.js`.

## İş 37 · Defter: "İşlendi yap" ince çerçeveli hap (2026-10-26, v1.36.2)

Emre v0'daki fırça izli "İşlendi yap" için alternatif istedi; tasarım tuvalinde dört seçenek (mühür, ince çerçeve, kaydırarak onayla, defter işareti) gösterildi, Emre **B · ince çerçeve**yi seçti.
1. Düğme boşken ince vurgu çerçeveli bir hap, solunda boş halka. Dokununca soldan sağa vurgu rengiyle dolar, halka tike döner, yazı "İşlendi" olur; 0,52 sn sonra konu işlenir ve sıradaki konu eskisi gibi kayarak gelir. Dolarken ikinci dokunuş yok sayılır. Hareket azaltma açıksa beklemeden işlenir.
2. Renk sabit altın değil, uygulamanın o günkü vurgusu (`--vurgu-acik`, dolunca yazı `--vurgu-acik-yazi`): üç temada da okunur.
3. Fırça darbesi kaldırıldı (`.firca-iz`, `.firca-yazi` ve onların `@keyframes firca-sur`/`firca-yazi` kuralları). İkinci `firca-sur` tanımı Günün tablosundaki altı çizili yazının aynı adlı animasyonunu eziyordu; o da düzeldi.

## İş 38 · v0 değişiklikleri telefona gelmiyordu: sürüm artırıldı (2026-10-26, v1.36.3)

Emre: "son güncelleme uygulamaya gelmiyor". Sebep: PR #60 (v0: sanatçı tanıtımı, bölüm sonucu) Pages'e doğru yayınlandı (pages build #60 başarılı) ama `sw.js` `SURUM` 1.36.2'de kalmıştı (v0 sürümü artırmamış; İş 35'teki aynı durum). Uygulama kabuğu önbellekten (cache-first, `atlas-kabuk-<SURUM>`) verildiği için sürüm değişmeyince telefon yeni css/js'i hiç çekmez. 1.36.3'e çıkarıldı (`sw.js`, `js/surum.js`, sürüm testleri). Kural: kabuk dosyalarında (css/js/html/data) her değişiklik sürüm artırmalı; v0 dalına her değişiklikten sonra "sürümü artır" denmeli.

## İş 39 · Bölüm sonucunda asılı tablolar eğimle sallanır (2026-10-26, v1.37.0)

Emre (ekran görüntüsüyle): "sallanma efektini bu üstteki resimler için de yap, sağa sola gitsin telefonu eğince". Bölüm sonucunun sergi duvarındaki tablolar (v0'ın PR #60'ı) asılırken bir kez sallanıyordu.
1. `js/sallanma.js`: her tablo yaylı bir sarkaç. Telefon sağa dönünce hedef açı −9°'ye kadar (yerçekimi yerinde kalır, tablo ekrana göre ters yöne salınır); hedef değişince tablo hedefi aşar, birkaç kez gidip gelerek durulur (sürtünme 2,4). Sertlik ip boyuyla ters orantılı (`ipSertligi`): uzun ipli tablo daha ağır sallanır, tablolar aynı anda değil, hafif farklı ritimde salınır. Durulunca döngü durur (pil).
2. Algılayıcı, izin ve "Hareketi aç" Bugün'dekiyle aynı (`egimBaslat`'a isteğe bağlı `degisince` geri çağırması eklendi). iOS izni hatırlamıyorsa duvarın sağ üstünde "Hareketi aç" düğmesi; duvar ona yer açar. Ayarlar'daki hareket anahtarına ve hareket azaltmaya uyar.
3. Salınım `transform: rotate(var(--sal))` olarak tablonun asılış eğimine (`rotate: --egim`) eklenir; asılış animasyonu `rotate`'i tuttuğu için ayrı özellik. Dönme noktası çivi (ipin üstü).
4. Test: `tests/unit/sallanma.test.mjs` (aşma, durulma, ortaya dönüş, ip boyu, büyük adımda kararlılık), `tests/e2e/harita.spec.js` (jiroskop olayıyla tablolar sola salınır). Sürüm 1.37.0 + Yenilikler satırı.

## İş 40 · Haritadaki karakterler netleşti (2026-10-26, v1.37.1)

Emre: "haritadaki karakterler çok bulanık". Sebep: yolcular ekranda ~74 pt boyunda ama dosyaları 92 px'ti (1,25 px/pt); iPhone 13'ün 3 kat ekranında 2,4 kat büyütülüp bulanıklaşıyordu. Orta Çağ, Barok, Barok II, Aydınlanma ve Modern sembolleri 2 px/pt'ydi (1,5 kat büyütülüyordu); Rönesans büstü, Romantizm feneri ve XIX. yüzyıl sembolü zaten ~3 px/pt.
1. Orijinal büyük çizimler depoda olmadığı için mevcut sprite'lar Emre'nin Mac'inde Real-ESRGAN (realesrgan-ncnn-vulkan, `realesrgan-x4plus-anime`) ile 4 kat büyütüldü ve 3 px/pt'ye (yolcu 222 px boy) Lanczos ile indirildi (bu oturumda dış model ağırlığı çalıştırmak izin sistemine takıldığı için Emre kendi bilgisayarında çalıştırdı; komutlar sohbette). Emre `harita-3x` dalına itti; en-boy oranları ve saydamlık korunmuş, ayak noktası oranla ölçüldüğü için `data/harita.json` değişmedi.
2. Yeni adlar `_3x` sonekli (`js/harita.js` `yolcuAdresi`, `nesneAdresi` + `NESNE_3X`): gorseller/ önbelleği sürümden bağımsız, aynı adla değişen resim telefonda yenilenmezdi. Eski 26 dosya silindi.
3. Harita arka plan resimleri 2 px/pt (780×1170); onlardaki küçük boyalı figürler ayrı iş.

## İş 41 · Yolculuk haritası baştan boyandı (2026-10-27, v1.38.0)

Emre: "harita kısmını baştan yapmak istiyorum… seviyelerin duruşu düzeni bozmasın"; her adım onunla seçildi (tuvaller claude.ai'de). Çizimler Vercel AI Gateway üzerinden GPT Image 2 ve Nano Banana Pro ile; betikler `scripts/harita/` (ciz.mjs, bolge.mjs, sprite.mjs, birlestir.py; anahtar `.env`'de, depoya girmez).
1. 9 dönem: Empresyonizm ile Post-Empresyonizm ve Sembolizm ayrıldı (7 seviye tek resme sığınca kalabalık oldu). Her dönem 1024×3072 tek resim; seviye sayısı kadar boş meydan, yol iki kenara kadar kesintisiz. Gece hâlleri aynı resmin Nano düzenlemesi (meydanların kayması ≤4 px ölçüldü).
2. Dönemler aralarında şerit ya da sis olmadan bitişik dizilir (Emre: "direkt ekle, sis de ekleme"). Altın çerçeve, kitap sayfası, fırça darbesi, zaman kapısı, boyanmış geçiş ve köprü denendi, beğenilmedi. Dönemin adı sağ üstteki göstergede ve bölüm kartında.
3. Her seviyenin kendi sembolü (o seviyenin sanatçılarından bir nesne); bulunulan durakta o dönemin kıyafetiyle aynı öğrenci. İkisi de 3 px/pt. Gece sembolleri sıcak fener tonunda, Orta Çağ ve Rönesans'ta serin ay ışığı tonunda.
4. Son açık durağın %7 üstünden yukarısı sepya (CSS filter); sınırın geçtiği resmin üstüne maskeli sepya kopya konur. Duraklar ve saklı motifler sepyada da dokunulabilir. Eski "görülmemiş dönem soluk" kuralı ve sis maskeleri kaldırıldı.
5. Saklı motifler yeni resimlere göre elle kutulandı (40 eser). Hikâye başyapıtlardan (`data/basyapitlar.json` özeti), eski haritadan ya da kısa yeni metinlerden; motif penceresi sanatçıya `sanatci_id` ile bağlanır.
6. `scripts/harita/uygulama_hazirla.py` resimleri, sembolleri ve `data/harita.json`'ı (sürüm 2) üretir. Yeni dosya adları (`donem_`, `sembol_`, `ogrenci_`), çünkü gorseller/ önbelleği sürümden bağımsız. Eski harita silinmedi: `gorseller/harita_eski/` (eski harita.json dahil).
7. Seviye sayısı uygulamanın gösterdiği (görseli olan) sanatçılardan kurulur: Orta Çağ 3, Rönesans 7… Bir ara bütün sanatçılarla sayıp iki döneme fazladan meydan ekledim; yanlıştı, geri alındı.
8. Test: `tests/unit/harita.test.mjs` (meydan ve sembol sayıları, dosyalar, motif hikâyeleri, bitişik yerleşim, sepya sınırı), `tests/e2e/harita.spec.js` (9 dönem, sepya). Bölüm sonucundaki sallanma testi bu ortamda (Playwright 1.63) değişiklikten önce de başarısızdı.

## İş 42 · Geliştirici modu (2026-10-27, v1.39.0)

Emre: "geliştirici butonu ekle her şeyi açsın kapanınca en son haline geri dönsün".
1. Ayarlar'da "Geliştirici modu" anahtarı. Açılınca o anki ilerleme (ve yarım kalan oturum) `ilerleme.gelistirici.yedek` içine kopyalanır; bütün konular işlenmiş, bütün harita bölümlerinin Kolay'ı ve Orta'sı geçilmiş sayılır (Zor da açılır, tanıtımlar ilk girişte yine gösterilir).
2. Kapanınca yedek olduğu gibi geri gelir: mod açıkken verilen cevaplar, bölüm sonuçları, işaretlenen konular atılır. Yalnız ayarlar (tema, kart sayısı…) güncel hâliyle kalır, çünkü onlar ilerleme değil.
3. Yedek ayrı bir anahtarda değil ilerlemenin içinde tutulur: uygulama kapanıp açılınca, IndexedDB yansısında ve "Yedekle" metninde de korunur; bozuk yedek kaydı modu kapatır (asıl ilerlemeye dokunmaz).
4. Test: `tests/unit/depo.test.mjs` (aç → yedek metni → kapat gidiş-dönüşü), `tests/e2e/gelistirici.spec.js` (harita: 1 açık durak → hepsi açık → yeniden açılışta mod sürer → kapatınca yine 1).

## İş 43 · v0 dönem köprüleri denetlendi, bölüm kartı kalktı (2026-10-28, v1.40.1)

Emre v0'da dönemler arasına köprü ekledi (PR #66, v1.40.0): iki resmin kenarı aynalanıp birbirine akar, ortada yeni dönemin adı; köprü yalnız ileri (yukarı) kaydırırken canlanır, ekran kenarları hafifçe kararır (`harita-perde`, renkli değil, koyu hale). Birleşince main'de 3 test kırıldı:
1. `tests/e2e/paket8.spec.js` hâlâ 1.39.0 bekliyordu (v0 yalnız birim testindeki sürümü değiştirmiş): güncellendi.
2. v0 ortadaki bölüm kartını çağırmayı bırakmıştı, adı köprüde yazıyor. Daha önce "kart dursun" dendiği için soruldu; Emre: "Kart kalksın". `bolumKarti`, kart HTML'i ve CSS'i silindi; harita testi köprüyü denetleyecek biçimde yeniden yazıldı (8 köprü, adı, ileri kaydırınca `gorundu`).
3. Kabuk dosyaları değiştiği için sürüm 1.40.1 (düzeltme: Yenilikler'e satır yok).

## İş 44 · v0: köprü kenarındaki dik şerit ve akan bulutlar (2026-10-28, v1.40.2)

Emre v0'da (`v0/harita-bulut-duzeltme`) köprülerin iOS Safari'de kenarında görünen mor dik şeridi düzeltti (bulanık katmanlar yanlardan taşar, köprü `isolation`/`contain: paint` ile kendi içinde boyanır, `mix-blend-mode` kaldırıldı) ve köprüye yavaşça süzülen üç bulut tutamı ile nefes alan ışık ekledi (köprü görününce oynar, hareket azaltmada durur). v0 sürümü artırmadığı için 1.40.2 yapıldı; yoksa telefon yeni css'i çekmezdi (İş 38).

## İş 45 · Köprülerde dönem adının yanındaki macenta çizgi (2026-10-28, v1.40.3)

Emre (iPhone ekran görüntüleriyle): Klasizm ve Geç Barok, Romantizmden Realizme köprülerinde kaydırınca ince pembe dik bir çizgi. Çizgi her köprüde dönem adı bloğunun sağında, blok boyundaydı. Sebep: v0'ın ad animasyonundaki `filter: blur(calc((1 - --k) * 4px))`; --k kaydırmayla her karede değiştiği için iOS Safari bulanık katmanı sürekli yeniden çiziyor ve katman kenarında macenta şerit bırakıyordu (Chromium'da görünmüyor). Ayrıca köprü tam ortada değilken ad yarı bulanık, zor okunur kalıyordu. Bulanıklık kaldırıldı; ad saydamlık ve ölçekle belirir. Köprülerdeki öteki bulanıklıklar sabit (kaydırmayla değişmiyor), dokunulmadı.

## İş 46 · Koleksiyonum duvarı eğimle sallanır (2026-10-28, v1.41.0)

Emre: telefonu hareket ettirince çıkan animasyon (Bugün'ün tablosu, bölüm sonucunun sergi duvarı) daha fazla yerde olsun; önerilen yerlerden ilki seçildi.
1. Koleksiyonum (`js/ekranlar/koleksiyon.js`) iki sütunlu ızgara yerine sergi duvarı görünümünde (`.sergi-duvar.koleksiyon-duvar`): her eser kendi çivisine iple asılı, ip boyu (12–33 px) ve hafif eğrilik (±0,8°) sıradan gelir; her açılışta aynı, el yapımı bir duvar gibi. Resimler kırpılmaz (en çok 240 px boy), etiket çerçevenin altında duvarda sabit; sallanan yalnız ip ve çerçeve (`.asi`).
2. Hareket `js/sallanma.js` ile aynen (sarkaç, uzun ipli daha ağır; izin, "Hareketi aç" düğmesi, Ayarlar'daki anahtar ve hareket azaltma aynı). Dönme noktası çivi (`.asi`'nin üstü). Çerçeveler sergi duvarındakilerin iki katından büyük olduğu için tam eğimde 9° yerine 5° (`sallanmaBaslat`'a isteğe bağlı açı): 9°'de aşmayla alt köşeler duvarın kenarından taşıyordu. Asılış animasyonu var; çok eserde son eser beklemesin diye gecikme 8. eserde sabitlenir.
3. Test: `tests/e2e/paket8.spec.js` K4 testine jiroskop olayıyla tablonun salınması eklendi. Sürüm 1.41.0 + Yenilikler satırı.

