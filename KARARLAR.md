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

8. **Doğum yılı doğrulaması:** tarifteki ±3 yıl kuralı yıl hassasiyetindeki tarihler için aynen uygulanır. Ancak antik ve ortaçağ sanatçılarında Wikidata tarihleri çoğu zaman “yaklaşık” ya da yüzyıl hassasiyetinde. Bu yüzden: tarih “yaklaşık” nitelendirmeliyse (P1480) ya da on yıl hassasiyetindeyse ±10 yıl, yüzyıl hassasiyetindeyse ±100 yıl. Bu genişletme yalnızca sanatçının kendisini doğrulamak için. Eser atfı kuralı değişmedi: eser yalnızca doğrulanmış QID'e P170/P84 ile bağlıysa alınır. Bu kurallarla bile doğrulanamayan sanatçılar tahmin edilmez; listesi aşağıda.
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

`scripts/onbellek.mjs` çalıştırıldığında QID'i doğrulanamayan, bu yüzden yalnızca kurs eserleriyle görünen sanatçılar:

- **Phidias:** Wikidata'da doğum tarihi MÖ 490 (yıl hassasiyetinde, “yaklaşık” nitelendirmesi yok), veride MÖ 480. Fark 10 yıl olduğu için eşleşmedi. 4 kurs eseriyle görünür.
- **Tintoretto:** “Tintoretto” aramasının ilk 7 sonucunda asıl ressam (Jacopo Tintoretto) çıkmıyor, yalnızca oğlu Domenico gibi adaşlar var. Doğum yılları tutmadığı için hiçbiri kabul edilmedi. 2 kurs eseriyle görünür. (`ad_arama` içerik alanı olduğu için değiştirmedim. İstenirse içerik tarafında “Jacopo Tintoretto” yapılabilir.)
- **Laokoon heykeltıraşları (Hagesandros, Athenodoros, Polydoros):** Wikidata'da arama sonucu yok ve kurs eseri de yok. Bu yüzden görseli yok, pekiştirmeye girmez; yalnızca Göz At'ta metniyle görünür.

Ayrıca **Francis Bacon** doğru QID'e (Q154340) bağlandı, ama eserleri telif kapsamında olduğu için Wikidata'da görseli (P18) olan eseri yok. Kurs eseri de olmadığından pekiştirmeye girmez.

Önbellek: 169 sanatçı, 5431 Wikidata eseri (sanatçı başına en fazla 40), üretim tarihi 2026-10-20.
