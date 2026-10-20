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
