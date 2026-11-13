# Qwen master denetim raporunun doğrulanması

Kaynak: `SANAT_ATLASI_MASTER_RAPOR.md` (Qwen, 13 Kasım 2026, taban `bb0c254`, 1.78.2).
Doğrulama: 13 Kasım 2026, `main` 1.78.3 (`b054f69`). İddialar kodla ve veriyle tek tek karşılaştırıldı; çalışma zamanı
davranışı `js/eserler.js` fonksiyonları (`onbellekEseri`, `cikarilanlariAyikla`, `kopyalariAyikla`, `yilSupheliMi`)
gerçek verilerle çalıştırılarak denendi. Bu belgeyle birlikte kodda hiçbir değişiklik yapılmadı.

Durum sütunu: **açık** = düzeltilmedi.

## 1. Doğrulanan gerçek sorunlar (önem sırasına göre)

### Yüksek

| # | Sorun | Kanıt | Rapor kodu | Durum |
|---|---|---|---|---|
| 1 | **Ortak atıflı 4 eser iki sanatçıda.** Uyuyan Venüs (Tiziano/Giorgione, Q500812), Tanrıların Ziyafeti (Tiziano/Bellini, Q15008032), On Bin Şehit (Pontormo/Bronzino, Q131675981), Kleopatra'nın Ölümü (Artemisia/Orazio, Q19890804). Sanatçılar aynı akımda olduğundan quizde doğru cevabın diğer adı **çeldirici olarak çıkabilir**; yani "yanlış" sayılan cevap da doğru olabilir. Rapor bunu yalnız etiket sorunu sanmış. | `data/eserler_onbellek.json` | A3-7 | açık |
| 2 | **Hatalı atıflar veride:** Cimabue listesinde Courtauld "Virgin and Child" (Q119086004, raporun kaynağına göre 19. yy sahtesi); Leonardo listesinde "Medusa" (Q3492887); Ambrogio Lorenzetti'ye 1353 tarihli "Madonna of Humility" (Q17335819; sanatçı 1348'de öldü, iç tutarsızlık kendini kanıtlıyor). Wikidata P170'ten geldikleri için kurala uygun alınmışlar; düzeltme için bir dışlama listesi (yeni veri dosyası) gerekir. Dış kaynak teyidi (Art UK, Uffizi, Rijks) bu doğrulamada yapılmadı. | `data/eserler_onbellek.json` | A3-1/2/3 | açık |
| 3 | **"Führermuseum" müze adı 13 kayıtta** (rapor 12 diyor; Fragonard "The See-Saw" eksik). Kök neden: sorgu P195'ten `SAMPLE(?kolL)` ile rastgele bir koleksiyon seçiyor. | `scripts/kaynaklar/wikidata.mjs:12` | A3-4 | açık |
| 4 | **Miró'nun 3 eseri görsel yerine QRpedia ziyaretçi fotoğrafı** ("Portrait of Vincent Nubiola", "Barcelona Series", "Head of a Catalan Peasant"; dosyalar `QRpedia codes at Fundació Joan Miró …`). `cikarilan_gorseller.json`'da yok, hâlâ gösteriliyor. | `data/eserler_onbellek.json`, `data/cikarilan_gorseller.json` | A4-8 | açık |
| 5 | **Görsel bulaşması:** Campin "The Trinity" kaydında "Madonna and child" görseli; Hogarth "Before" ile "After" birbirinin görsellerini içeriyor. Çalışma zamanında iki ayrı kaydın aynı görseli paylaştığı yalnız bu iki durum var. | `data/eserler_onbellek.json` | A3-15 | açık |

### Orta

| # | Sorun | Kanıt | Rapor kodu | Durum |
|---|---|---|---|---|
| 6 | Service worker'da `agdan()` zaman aşımı yok; asılı kalan bir istek Wikimedia'ya ayrılan 4 eşzamanlı yuvadan birini süresiz tutar. | `sw.js` `agdan`, `sinirli` | A6-4 / P5 | açık |
| 7 | Hata ekranı ham teknik mesaj gösteriyor ("Failed to fetch"); Türkçe açıklama ve "Yeniden dene" yok. | `js/ekranlar/ortak.js:681-685` | B3 / A5-13 | açık |
| 8 | Bozuk hash'te `decodeURIComponent` try dışında: `#/sanatci/%ZZ` → yakalanmamış URIError, ekran değişmez. | `js/ekranlar/yonlendirme.js:81` | Y2 | açık |
| 9 | Erişilebilirlik: geri/sekme dönüşünde odak ayarlanmıyor (ileri çizimde h1 odaklanıyor); görüntüleyicide `aria-modal` var ama Tab tuzağı yok; Yolculuk `<h1>` `tabindex`'siz; Ayarlar'da 12 ayrı `aria-live` bölgesi. | `ortak.js:656-679` ↔ `:784`; `goruntuleyici.js:106`; `harita.js:161`; `ayarlar.js` | A5-1/2/3/5 | açık |
| 10 | Yürüyüşte şüpheli yıl süzmesi yok. 145 yürüyüş eserinden yalnız Solimena "The Glorification of Saint Dominic" 1750 etkileniyor (sanatçı 1747'de öldü). | `js/ekranlar/bugun.js:97,125`; `data/yuruyus.json` | A3-16 | açık |
| 11 | Wikidata yılı kök nedeni: `MIN(?inc)` en erken tarihi seçiyor, P571 hassasiyeti ("15. yüzyıl") okunmuyor. Uygulama bu yılları gizleyerek telafi ediyor (bkz. 2. bölüm, madde 5) ama veri hattı düzeltilmedi. | `scripts/kaynaklar/wikidata.mjs:10,18` | A3-5 | açık |
| 12 | Telif riski: 11 sanatçının (Picasso, Dalí, Magritte, Miró, Ernst, Bacon, Arp, Man Ray, Höch, Duchamp, Nolde) eserleri TR/AB'de hâlâ korumalı; görselleri depo herkese açıksa depoda ve R2'de yeniden dağıtılıyor. Hukuki değerlendirme yapılmadı; ürün kararı. | `data/eserler_onbellek.json`, `gorseller/k/` | A4-1/2 | karar bekliyor |

### Düşük

| # | Sorun | Kanıt | Rapor kodu | Durum |
|---|---|---|---|---|
| 13 | Yayına fazladan dosya gidiyor: `deneme/` sayfaları ve (raporun kaçırdığı) `research_notes/zayif_eserler.csv` — rsync yalnız `*.md`'yi dışlıyor. | `.github/workflows/yayinla.yml:28-33` | Y1 | açık |
| 14 | Yerel sunucu: async işleyicide `decodeURIComponent` → kötü URL Node sürecini düşürür; `listen()` host'suz, tüm arayüzlerde dinliyor. Yalnız geliştirme aracı. | `scripts/sunucu.mjs:32,70` | Y3 | açık |
| 15 | Belge kayması: README GitHub Pages'i anlatıyor (yayın Cloudflare Pages); README:125 ve `js/wikidata.js:3` yorumu P84'ten söz ediyor (kullanılmıyor, KARARLAR 8/40). | `README.md:16-22,125`; `js/wikidata.js:3` | D5 / C5 | açık |
| 16 | `idb.js` bağlantı olaylarını dinlemiyor (`onversionchange`/`onclose`/`onblocked`); risk düşük. | `js/idb.js:9-22` | Y7 | açık |
| 17 | `index.html`'de `Document.prototype.querySelector` yaması (gömülü önizleme ortamı için, bilinçli). | `index.html:38-45` | S8 | bilinçli |

## 2. Raporda yanlış ya da abartılı bulunan iddialar

1. **Taban eski.** Rapor 1.78.2'yi denetliyor; sonraki commitler (`008ed16`, `16c7b3d`) test zamanlama yarışlarının bir kısmını giderdi ve kullanılmayan CSS'i sildi. B2 (kararsız testler) ve ölü CSS sayıları güncel değil.
2. **A3-17 "2 kırık kopya kararı" yanlış.** Uygulamanın kendi `kopyalariAyikla` mantığıyla 96 çiftin 96'sı da çalışıyor; "2 inert" de yok. Dürer kaydının anahtarı `q:Q1755464` değil, kurs kaydı olduğu için `met:…DP815738`; Caillebotte'nin `aic:` anahtarı önbellekte var.
3. **A3-6 mükerrerler abartılı.** "Aynı QID iki kayıt" 4 örneğin 3'ü (Mantegna, Anguissola, Caillebotte) kopya kararlarıyla zaten ayıklanıyor; kalan Michelangelo kurstaki "Sistine tavanı ve Son Yargı" birleşik slaytı (tartışmalı). "Aynı görsel" (D1) gruplarının çoğu (Hunt, Baldung, Cassatt) aynı baskının farklı müzelerdeki nüshaları — görsel dosyaları farklı; Hunt'ta 3 değil 4 kayıt var.
4. **Führermuseum 12 değil 13 kayıt** (Fragonard "The See-Saw").
5. **Tarih bulgularının önemi abartılı.** Cimabue 1870, Medusa 1597, Rogier 1490, Boucher 173, Bosch 1450, Leonardo 1569, Chardin 1799, Giulio Romano 1557, Lorenzetti 1353 — dokuzu da `yilSupheliMi` (`js/eserler.js:279`) tarafından boşaltılıyor; ekranda yanlış yıl görünmüyor. Gerçek sorun atıf ve müze adı (1. bölüm, 2–3).
6. **Performans rakamları sıkıştırmasız sunucuyla ölçülmüş.** `scripts/sunucu.mjs` gzip/brotli yapmıyor, Cloudflare yapıyor. Kritik JSON ~4,3 MB → gzip ile ~1,1 MB (`eserler_onbellek` 2,06 MB → 377 KB; `app.css` 477 KB → 97 KB). "LCP 41 sn" ve "Slow3G açılmıyor" gerçek siteyi yansıtmıyor; A6-1 "Kritik" seviyesi abartılı. Veri yükünü azaltma önerisi yön olarak hâlâ makul.
7. **B1 yanlış teşhis.** `yarimKaydet` her adımda IndexedDB'ye hemen yazıyor (`js/ekranlar/pekistir.js:586-592`), tampon yok; önerilen `pagehide` flush'ı hiçbir şey değiştirmez. `devam:45` yarışı test tarafında.
8. **A5-14 (dosya ile yedek) reddedildi.** CLAUDE.md §4: "No file downloads (iOS PWA makes those awkward)".
9. **Kapsam dışı maddeler.** A5-12 başlangıç ilerlemesi ve kurs kilidi şartnamenin çekirdeği (CLAUDE.md §1, §2). Onboarding, App Store, Capacitor, Xcode, disk, gizlilik politikası, 1024 px ikon, yaş derecesi tek kullanıcılı kişisel PWA'yı ilgilendirmiyor; herkese açık yayın ya da App Store hedeflenirse geçerli olur.
10. **A5-15 yanlış anlatılmış.** İzin istemi kendiliğinden çıkmıyor; yalnız "Hareketi aç" düğmesi görünüyor, iOS izni dokununca isteniyor (`js/egim.js:98`).
11. **Küçük yanlışlar:** `testler.yml` yalnız PR'da değil, `workflow_dispatch` ile elle de çalışıyor; font önbelleğinin "sınırsız" olması (P6) birkaç dosya olduğu için pratikte önemsiz; P7'yi rapor kendi ölçümüyle çürütmüş.

## 3. Doğrulanmayanlar

Emülasyonla ölçülen değerler (44 px altı dokunma hedefleri, ekran geçiş süreleri, Lighthouse puanları), dış müze kataloğu teyitleri ve hukuki değerlendirmeler yeniden ölçülmedi / doğrulanmadı.
