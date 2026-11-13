# Qwen master denetim raporunun doğrulanması

Kaynak: `SANAT_ATLASI_MASTER_RAPOR.md` (Qwen, 13 Kasım 2026, taban `bb0c254`, 1.78.2).
Doğrulama: 13 Kasım 2026, `main` 1.78.3 (`b054f69`). İddialar kodla ve veriyle tek tek karşılaştırıldı; çalışma zamanı
davranışı `js/eserler.js` fonksiyonları (`onbellekEseri`, `cikarilanlariAyikla`, `kopyalariAyikla`, `yilSupheliMi`)
gerçek verilerle çalıştırılarak denendi.

**Güncelleme (sürüm 1.78.4, İş 174):** 1. bölümdeki maddeler düzeltildi; ayrıntı ve gerekçeler `KARARLAR.md` İş 174'te.
Durum sütunu: **düzeltildi** / **kısmen** / **bilerek bırakıldı** / **karar bekliyor**.

## 1. Doğrulanan gerçek sorunlar (önem sırasına göre)

### Yüksek

| # | Sorun | Kanıt | Rapor kodu | Durum |
|---|---|---|---|---|
| 1 | **Ortak atıflı 4 eser iki sanatçıda.** Uyuyan Venüs (Tiziano/Giorgione, Q500812), Tanrıların Ziyafeti (Tiziano/Bellini, Q15008032), On Bin Şehit (Pontormo/Bronzino, Q131675981), Kleopatra'nın Ölümü (Artemisia/Orazio, Q19890804). Sanatçılar aynı akımda olduğundan quizde doğru cevabın öteki adı çeldirici olarak çıkabiliyordu. Rapor bunu yalnız etiket sorunu sanmış. | `data/eserler_onbellek.json` | A3-7 | **düzeltildi:** eser sorulunca öteki sanatçı şık olmaz (`js/celdirici.js` `haric`), ters soruda öteki sanatçının yanlış eseri olmaz (`js/ters.js`), künyede "Ayrıca atfedilir: …". Genel kural: önbellekte iki sanatçıda olan her QID. |
| 2 | **Hatalı atıflar:** Cimabue listesinde Courtauld "Virgin and Child" (Q119086004; Wikidata yılı da 1870, Art UK "forgery of Cimabue"); Leonardo listesinde Uffizi "Medusa" (Q3492887); Ambrogio Lorenzetti'ye 1353 tarihli "Madonna of Humility" (Q17335819; sanatçı 1348'de öldü, Rijksmuseum Bulgarini'ye veriyor). Raporun A3-11'i de: Giulio Romano listesindeki Niobe (Q98207179), Philip Galle'nin Giulio'dan sonra yaptığı gravür. | `data/eserler_onbellek.json` | A3-1/2/3/11 | **düzeltildi:** `data/eser_duzeltmeleri.json` → `cikar` |
| 3 | **Tarihsel koleksiyon müze gibi gösteriliyor:** 12 kayıtta "Führermuseum" (rapor doğru saymış), ayrıca raporun kaçırdığı 1 kayıtta "Munich Central Collecting Point" (Rigaud, "Self-Portrait in a Turban", Q71828472). Kök neden: sorgu P195'ten `SAMPLE(?kolL)` ile rastgele koleksiyon seçiyor. | `scripts/kaynaklar/wikidata.mjs` | A3-4 | **düzeltildi:** Wikidata'daki koleksiyon geçmişinden bugünkü kurum (`muze`); bilinmeyen 3 eserde boş. Sorgu artık bitiş tarihli koleksiyonları ve bu iki yeri almıyor. |
| 4 | **Miró'nun 3 eseri görsel yerine QRpedia ziyaretçi fotoğrafı** ("Portrait of Vincent Nubiola", "Barcelona Series", "Head of a Catalan Peasant"). | `data/eserler_onbellek.json` | A4-8 | **düzeltildi:** `gorsel_cikar`; görseli kalmayan 3 kayıt düştü |
| 5 | **Görsel bulaşması:** Campin "The Trinity" kaydında "Madonna and child" ve Veronica görselleri; Hogarth "Before" kaydında "After" görselleri. | `data/eserler_onbellek.json` | A3-15 | **düzeltildi:** `gorsel_cikar` (görseller kendi kayıtlarında kalır) |

### Orta

| # | Sorun | Kanıt | Rapor kodu | Durum |
|---|---|---|---|---|
| 6 | Service worker'da `agdan()` zaman aşımı yok; asılı istek Wikimedia'ya ayrılan 4 yuvadan birini süresiz tutar. | `sw.js` | A6-4 / P5 | **düzeltildi:** başlıklar 30 sn'de gelmezse iptal; gövde inerken kesilmez; zaman aşımında hata döner, sayfa yedeğe düşer |
| 7 | Hata ekranı ham teknik ileti gösteriyor ("Failed to fetch"), "Yeniden dene" yok. | `js/ekranlar/ortak.js` `hataGoster` | B3 / A5-13 | **düzeltildi:** Türkçe açıklama + "Yeniden dene"; teknik ayrıntı katlanmış |
| 8 | Bozuk hash'te `decodeURIComponent` try dışında: `#/sanatci/%ZZ` → yakalanmamış URIError. | `js/ekranlar/yonlendirme.js` | Y2 | **düzeltildi:** "Bu adres bozuk" hata ekranı |
| 9 | Erişilebilirlik: geri/sekme dönüşünde odak BODY'ye düşüyor; görüntüleyicide Tab arka plana kaçıyor; Yolculuk `<h1>` odaklanamıyor; Ayarlar'da 12 `aria-live` bölgesi. | `ortak.js` `bellektenGeriKoy`; `goruntuleyici.js`; `harita.js:161`; `ayarlar.js` | A5-1/2/3/5 | **düzeltildi** (ilk üçü). `aria-live`: **kısmen** — indirme sayacı sürerken okunmuyor; öteki 11 bölge bilerek kaldı (boşken okunmaz, her biri yalnız kendi düğmesinin sonucunu okutur) |
| 10 | Yürüyüşte şüpheli yıl süzmesi yok (Solimena 1750; sanatçı 1747'de öldü). | `js/ekranlar/bugun.js` | A3-16 | **düzeltildi** |
| 11 | Wikidata yılı kök nedeni: `MIN(?inc)`, P571 hassasiyeti okunmuyor. | `scripts/kaynaklar/wikidata.mjs`, `js/wikidata.js` | A3-5 | **kısmen:** sorgular artık yalnız en iyi sıradaki, yıl hassasiyetindeki tarihi alıyor; önbellek yeniden üretilmedi (bir sonraki üretimde geçerli). Aynı sıradaki iki tarihten erken olanı seçme (Bosch) sürüyor. Müze kataloğundan 5 tarih elle düzeltildi (`tarih`: Boucher 1739, Rogier y. 1435–1440, Bosch y. 1490–1505, Leonardo y. 1512, Chardin 1738). |
| 12 | Telif riski: 11 sanatçının (Picasso, Dalí, Magritte, Miró, Ernst, Bacon, Arp, Man Ray, Höch, Duchamp, Nolde) eserleri TR/AB'de hâlâ korumalı; depo herkese açıksa görselleri depoda ve R2'de yeniden dağıtılıyor. Hukuki değerlendirme yapılmadı. | `data/eserler_onbellek.json`, `gorseller/k/` | A4-1/2 | **karar bekliyor** (Emre) |

### Düşük

| # | Sorun | Kanıt | Rapor kodu | Durum |
|---|---|---|---|---|
| 13 | Yayına fazladan dosya gidiyor: `research_notes/zayif_eserler.csv` (raporun kaçırdığı) ve `deneme/` sayfaları. | `.github/workflows/yayinla.yml` | Y1 | **düzeltildi:** `research_notes/`, `reports/` dışlandı. `deneme/` **bilerek bırakıldı:** telefonda deneme sayfaları, bir test bunlara bakıyor. |
| 14 | Yerel sunucu: kötü URL Node sürecini düşürüyor; `listen()` host'suz. | `scripts/sunucu.mjs` | Y3 | **düzeltildi** (bozuk adres → 400). Tüm arayüzlerde dinleme **bilerek bırakıldı** (iPhone'dan aynı ağda deneme). |
| 15 | Belge kayması: README GitHub Pages'i anlatıyor (yayın Cloudflare Pages); README ve `js/wikidata.js:3` P84'ten söz ediyor. | `README.md`; `js/wikidata.js` | D5 / C5 | **düzeltildi** |
| 16 | `idb.js` bağlantı olaylarını dinlemiyor. | `js/idb.js` | Y7 | **düzeltildi:** `onversionchange` kapatır, `onclose` sonraki işlemde yeniden açtırır |
| 17 | `index.html`'de `Document.prototype.querySelector` yaması (gömülü önizleme için). | `index.html` | S8 | **bilerek bırakıldı** |

Testler: `tests/unit/duzeltmeler.test.mjs`, `tests/e2e/denetim_dogrulama.spec.js`. Tam takım: birim 360/360, uçtan uca (Chromium, iPhone 13) 195/195.

## 2. Raporda yanlış ya da abartılı bulunan iddialar

1. **Taban eski.** Rapor 1.78.2'yi denetliyor; sonraki commitler (`008ed16`, `16c7b3d`) test zamanlama yarışlarının bir kısmını giderdi ve kullanılmayan CSS'i sildi. B2 (kararsız testler) ve ölü CSS sayıları güncel değil.
2. **A3-17 "2 kırık kopya kararı" yanlış.** Uygulamanın kendi `kopyalariAyikla` mantığıyla 96 çiftin 96'sı da çalışıyor; "2 inert" de yok. Dürer kaydının anahtarı `q:Q1755464` değil, kurs kaydı olduğu için `met:…DP815738`; Caillebotte'nin `aic:` anahtarı önbellekte var.
3. **A3-6 mükerrerler abartılı.** "Aynı QID iki kayıt" 4 örneğin 3'ü (Mantegna, Anguissola, Caillebotte) kopya kararlarıyla zaten ayıklanıyor; kalan Michelangelo kurstaki "Sistine tavanı ve Son Yargı" birleşik slaytı (tartışmalı). "Aynı görsel" (D1) gruplarının çoğu (Hunt, Baldung, Cassatt) aynı baskının farklı müzelerdeki nüshaları — görsel dosyaları farklı; Hunt'ta 3 değil 4 kayıt var.
4. **Führermuseum sayısı doğru (12), ama eksik.** İlk doğrulamada 13 dendi ve Fragonard "The See-Saw" eksik sayıldı; bu **benim hatamdı**: o eserin müzesi doğru (Thyssen-Bornemisza), "Führermuseum" yalnız görselin dosya adında geçiyor. Raporun gerçekten kaçırdığı kayıt Rigaud'nun "Munich Central Collecting Point" yazan otoportresi.
5. **Tarih bulgularının önemi abartılı.** Cimabue 1870, Medusa 1597, Rogier 1490, Boucher 173, Bosch 1450, Leonardo 1569, Chardin 1799, Giulio Romano 1557, Lorenzetti 1353 — dokuzu da `yilSupheliMi` (`js/eserler.js`) tarafından boşaltılıyordu; ekranda yanlış yıl görünmüyordu. Gerçek sorun atıf ve müze adıydı.
6. **Performans rakamları sıkıştırmasız sunucuyla ölçülmüş.** `scripts/sunucu.mjs` gzip/brotli yapmıyor, Cloudflare yapıyor. Kritik JSON ~4,3 MB → gzip ile ~1,1 MB (`eserler_onbellek` 2,06 MB → 377 KB; `app.css` 477 KB → 97 KB). "LCP 41 sn" ve "Slow3G açılmıyor" gerçek siteyi yansıtmıyor; A6-1 "Kritik" seviyesi abartılı. Veri yükünü azaltma önerisi yön olarak hâlâ makul.
7. **B1 yanlış teşhis.** `yarimKaydet` her adımda IndexedDB'ye hemen yazıyor (`js/ekranlar/pekistir.js`), tampon yok; önerilen `pagehide` flush'ı hiçbir şey değiştirmez. `devam:45` yarışı test tarafında.
8. **A5-14 (dosya ile yedek) reddedildi.** CLAUDE.md §4: "No file downloads (iOS PWA makes those awkward)".
9. **Kapsam dışı maddeler.** A5-12 başlangıç ilerlemesi ve kurs kilidi şartnamenin çekirdeği (CLAUDE.md §1, §2). Onboarding, App Store, Capacitor, Xcode, disk, gizlilik politikası, 1024 px ikon, yaş derecesi tek kullanıcılı kişisel PWA'yı ilgilendirmiyor; herkese açık yayın ya da App Store hedeflenirse geçerli olur.
10. **A5-15 yanlış anlatılmış.** İzin istemi kendiliğinden çıkmıyor; yalnız "Hareketi aç" düğmesi görünüyor, iOS izni dokununca isteniyor (`js/egim.js`).
11. **A5-5 abartılı.** 12 `aria-live` bölgesi boşken hiçbir şey okutmaz; gürültü yalnız her görselde değişen indirme sayacından geliyordu.
12. **Küçük yanlışlar:** `testler.yml` yalnız PR'da değil, `workflow_dispatch` ile elle de çalışıyor; font önbelleğinin "sınırsız" olması (P6) birkaç dosya olduğu için pratikte önemsiz; P7'yi rapor kendi ölçümüyle çürütmüş.

## 3. Doğrulanmayanlar

Emülasyonla ölçülen değerler (44 px altı dokunma hedefleri, ekran geçiş süreleri, Lighthouse puanları) yeniden ölçülmedi. Atıf ve tarih düzeltmeleri raporun kaynaklarına ve Wikidata'nın kendi verisine (yıl, P170, P31, P195 geçmişi) dayanıyor; müze sayfaları bu çalışmada ayrıca açılmadı. Hukuki değerlendirme yapılmadı.
