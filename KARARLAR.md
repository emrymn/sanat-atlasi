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
