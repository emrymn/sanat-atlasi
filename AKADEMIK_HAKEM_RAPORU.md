# AKADEMİK HAKEM RAPORU — Q167605 · *Süt Boşaltan Kadın* (Vermeer, Rijksmuseum SK-A-2344)

**Denetim tarihi:** 13 Kasım 2026
**İncelenen dosyalar:** `DERS_BASLANGIC.md`, `DERS_ORTA.md`, `DERS_ILERI.md`, `DERS.json` (C001–C076, K1–K24), `SORULAR.json` (10 CS, 5 DY, 5 AU, 5 GZ, 5 TK), `KALITE_KONTROL.md`
**KANIT_DOSYASI.md:** Denetimin sonunda iletildi. Bulgular onunla çapraz kontrol edildi (§10).
**Denetçi:** Bağımsız hakem rolünde bir yapay zekâ modeli (Claude). Önceki modelin A–E derecelerini doğru varsaymadım. Her iddia için kaynağın kendisini bu oturumda yeniden açıp metnin içinde aradım. **Bu rapor da bir modelin raporudur. İnsan editör onayının yerini tutmaz.**
**Ders dosyalarında hiçbir değişiklik yapılmadı.**

---

## 0. Yöntem ve kaynak erişim tablosu

Kaynaklar bu oturumda `curl` ile indirildi ve HTML/JSON metinleri tarandı. Bir iddia ancak ilgili ifade kaynak metninde gerçekten bulunduysa "doğrulandı" sayıldı. Bir URL'nin açılması yeterli kabul edilmedi.

| Kaynak | URL | Bu denetimde sonuç | Kullanım |
|---|---|---|---|
| K1 Rijksmuseum kaydı | https://www.rijksmuseum.nl/en/collection/SK-A-2344 | **200, tam metin okundu** | Kimlik, provenance, küratör metni, bibliyografya |
| K2 Linked Art | https://id.rijksmuseum.nl/200108369 | **200, JSON tarandı** | Eski başlıklar, konum HG-2.30.3, PD işareti |
| K3 Basın bülteni (EN, 8 Eyl 2022) | https://www.rijksmuseum.nl/en/press/press-releases/rijksmuseum-reveals-major-discoveries-on-vermeer-s-painting-the-milkmaid | **200, tam metin + indirme alt yazıları** | 2022 bulguları |
| K14 Basın bülteni (NL) | https://www.rijksmuseum.nl/nl/pers/persberichten/ontdekkingen-op-melkmeisje-onthullen-werkwijze-johannes-vermeer | **200, tam metin** | Antwerpen Üniv., **Dibbits alıntısı** |
| Rijksmuseum hikâye: "Extraordinary ordinary" | https://www.rijksmuseum.nl/en/story/extraordinary-ordinary | **200** (dosyada kullanılmamış yeni birincil kaynak) | C033, C036 |
| Rijksmuseum hikâye: "A sexual or lesbian symbol" | https://www.rijksmuseum.nl/en/stories/themes/queer/story/pride-milkmaid | 200, **ama yalnız giriş paragrafı okunabildi** (gövde istemci tarafında yükleniyor) | İkonografi (bkz. B24) |
| K16 Lucas van Leyden hikâyesi | https://www.rijksmuseum.nl/en/stories/dutch-masters/story/lucas-leyden-10 | **200, bölüm yapısı JSON'dan doğrulandı** | C056 (**yanlış okuma**) |
| K8 / K15 Steen | https://id.rijksmuseum.nl/2006398 | **200** | C061 |
| K4 IIIF görüntü | https://iiif.micr.io/QkOGy/ (4649×5177) | **200**; tam kare + 3 bölge kırpması incelendi | C030, C033, C034, C035, C036, C039 |
| K7 Essential Vermeer | https://www.essentialvermeer.com/catalogue/milkmaid.html | **200, ~36.500 kelime tarandı** | Teknik rapor, tarihler, ikonografi |
| K6 Wikipedia "The Milkmaid (Vermeer)" | `action=raw` wikitext | **200** | Yalnız zincir kontrolü (tek başına kanıt sayılmadı) |
| K22 Wikipedia "Johannes Vermeer" | `action=raw` | **200** | C022 |
| K24 Vereniging Rembrandt | https://www.verenigingrembrandt.nl/nl/kunst/het-melkmeisje | **200** | C017 |
| K5 Wikidata Q167605 | wbgetentities | **200** (ikinci istekte hız sınırı) | C003, C012, C018 |
| SEP "Hegel's Aesthetics" | https://plato.stanford.edu/entries/hegel-aesthetics/ | **200** | Felsefe denetimi |
| SEP "Kant's Aesthetics and Teleology" | https://plato.stanford.edu/entries/kant-aesthetics/ | **200** (K17 Zangwill maddesi yerine bu madde açıldı) | Felsefe denetimi |
| SEP "Walter Benjamin" | https://plato.stanford.edu/entries/benjamin/ | **200** | Felsefe denetimi |
| K10 Met 2009 sergi sayfası | https://www.metmuseum.org/exhibitions/listings/2009/vermeer | **429 — ERİŞİLEMEDİ** | — |
| K23 Mauritshuis no. 670 | https://www.mauritshuis.nl/en/our-collection/artworks/670-girl-with-a-pearl-earring | **403 (iki farklı istemciyle) — ERİŞİLEMEDİ** | — |
| NGA *Woman Holding a Balance* | nga.gov nesne sayfası | **403 — ERİŞİLEMEDİ** | — |
| K11 Met kitapçığı PDF, K12 NGA PDF, K13 haberler, K20 Citaliarestauro, K21 Marginalian, Europeana White Paper | — | **Bu denetimde açılmadı / denenmedi** | Bunlara dayanan hiçbir ifadeyi "doğrulandı" olarak işaretlemedim |

---

## 1. Özet sonuç

| Ölçüt | Sayı |
|---|---|
| **Toplam incelenen iddia** (DERS.json C001–C076) | **76** |
| **Tam doğrulanan** (kaynak metninde ifade bulundu) | **55** |
| **Kısmen doğrulanan** (çekirdek doğru; kapsam, atıf veya ifade sorunlu) | **13** |
| **Yanlış** | **1** (C056) ve **ayrıca kimliksiz 3 yanlış ifade** (B02, B03, B12) |
| **Doğrulanamayan** (kaynağa erişilemedi veya yalnız Wikipedia zinciri) | **5** |
| Ayrı değerlendirilen yorum/meta iddiaları (C060, C074) | 2 |
| **Akademik yorum (felsefe) sorunları** | 6 (2 orta, 4 düşük) |
| **Quiz sorunları** | 11 (1 yüksek, 3 orta, 7 düşük). **Tüm kesin cevaplı soruların doğru şıkkı doğrudur.** |
| **Önem dağılımı (B-bulguları)** | Yüksek 2 · Orta 9 · Düşük 15 |

**Yayına uygunluk kararı:** **Şu haliyle yayına uygun değil. Küçük-orta revizyonla uygun hale gelir.** Gerekçe ve koşullar §8'de.

**Genel değerlendirme:** Kimlik, provenance ve 2022 bulguları birincil kaynaklarla çok iyi örtüşüyor. Sorunlar yorum katmanında ve özellikle **"düzeltme turu" sırasında yapılan bazı düzeltmelerde** yoğunlaşıyor: iki "düzeltme" yanlış bir sonucu dersin içine metodoloji dersi olarak yerleştirmiş (B02, B12). Ayrıca bir birincil kaynak yanlış okunmuş ve A seviyesine yükseltilmiş (B01).

---

## 2. Yüksek önemli bulgular

### B01 — C056: Lucas van Leyden baskısı Rijksmuseum'da "Eroticism" örneği olarak sunulmuyor

- **İddia kimliği:** C056 (DERS.json: seviye A). C023 de etkileniyor.
- **Mevcut ifade:**
  - Orta §2: "Rijksmuseum, Lucas van Leyden'in 1510 tarihli sütçü baskısını bu geleneğin ve 'Eroticism' temasının örneği olarak sunar [C023][C056]."
  - İleri §5: "Lucas van Leyden'in 1510 tarihli sütçü baskısı (Rijksmuseum) geleneğin yükünü gösterir [C056]."
  - İleri §6 (Berger): "Hizmetçi figürünün erotik gelenekte nesneleştirildiği [C023][C056]…"
- **Denetim sonucu:** **YANLIŞ (kaynak yanlış okunmuş).**
- **Gerçek kaynak ve bağlantı:** K16 — https://www.rijksmuseum.nl/en/stories/dutch-masters/story/lucas-leyden-10
- **Kaynağın ilgili bölümü:** Sayfa numaralı bölümlerden oluşuyor. Sayfa verisinde bölüm–görsel eşleşmesi açıkça şöyle:
  - `title: "Everyday scenes"` → `caption: "The Milkmaid, Lucas van Leyden, 1510"`. Bölüm metni: "Lucas made an important contribution to the early development of genre art… With this milkmaid, farmer and cows, Lucas introduced a new theme in art."
  - `title: "Eroticism"` → `caption: "Worship of the Golden Calf, Lucas van Leyden, c. 1530 (detail)"`. Bölüm metni Karel van Mander'in *Altın Buzağı* hakkındaki yorumundan söz ediyor.
- **Olası hata:** Düz metne çevrilmiş sayfada *Milkmaid* alt yazısı hemen "Eroticism" başlığından önce geliyor. Önceki model bunu "Eroticism" bölümüne ait sanmış. Müze baskıyı **tür resminin yeni bir teması** olarak sunuyor, erotik geleneğin örneği olarak değil.
- **Önerilen düzeltme:**
  - C056'yı şöyle yeniden yazın: "Lucas van Leyden, *The Milkmaid* (1510), Rijksmuseum; müze baskıyı erken tür sanatında yeni bir tema ('Everyday scenes') olarak sunar." Seviye A kalabilir, ama yalnız bu içerik için.
  - Sütçü figürünün erotik çağrışımı için C023'ün EV dayanağını kullanın. EV satır: "Kitchen maids, and especially milkmaids, were known for being sexually available." Bu, B seviyesinde ikincil bir kaynaktır.
  - Orta §2, İleri §5 ve İleri §6'daki C056 atıflarını buna göre düzeltin.
- **Önem:** **Yüksek.** Birincil kaynak hatası A seviyesinde etiketlenmiş ve üç seviyede tekrarlanmış.

### B02 — Dibbits'in "rust en verstilling" alıntısı resmî bültende **var**. Dersin "düzeltmesi" yanlış.

- **İddia kimliği:** Kimliksiz ifade. C050 notu, İleri §4, SORULAR AU03 ve KALITE_KONTROL "Denetim B — DÜZELTME 1" etkileniyor.
- **Mevcut ifade:**
  - İleri §4: "Dibbits'e atfedilen 'sakinlik ve dinginlik' alıntısı haber kaynaklarında dolaşır [K13]; bültenin kendisindeki tek Dibbits alıntısı teknoloji ve sergi üzerinedir. Bu ayrım Denetim B'de yakalandı ve düzeltildi…"
  - AU03: "Dibbits'e atfedilen 'sakinlik' alıntısı haber kaynaklarındadır; bültenin kendisinde isimsiz geçer."
- **Denetim sonucu:** **YANLIŞ.** İfade yalnız İngilizce bülten için doğrudur.
- **Gerçek kaynak ve bağlantı:** K14 (Rijksmuseum'un Hollandaca resmî bülteni, 8 Eylül 2022) — https://www.rijksmuseum.nl/nl/pers/persberichten/ontdekkingen-op-melkmeisje-onthullen-werkwijze-johannes-vermeer
- **Kaynağın ilgili bölümü:** Bültenin ikinci paragrafı alıntı olarak verilip altına "Taco Dibbits, hoofddirecteur Rijksmuseum" yazılmış: "Het geeft een verrassend beeld van zijn artistieke beslissingen. Zo zorgt het overschilderen van het rek met kannen en de vuurmand tot meer rust en verstilling in de kamer van Het melkmeisje. Niets leidt meer af van haar geconcentreerde bezigheid." İngilizce bültende (K3) bu paragraf yok. Oradaki Dibbits alıntısı gerçekten teknoloji ve sergi üzerinedir.
- **Olası hata:** Denetim B yalnız İngilizce sürümü kontrol etmiş, oysa Hollandaca sürüm (K14) dosyada zaten kayıtlıydı. Sonuçta doğru bir atıf "hata" diye silinmiş. Daha kötüsü, ders bu yanlış ayrımı öğrencilere **kaynak eleştirisi örneği** olarak öğretiyor.
- **Önerilen düzeltme:**
  - İleri §4'teki "Dikkat…" cümlelerini şöyle değiştirin: "Dibbits'in 'meer rust en verstilling' (daha fazla sakinlik ve dinginlik) alıntısı Rijksmuseum'un Hollandaca bülteninde (K14) yer alır; İngilizce bültende (K3) yoktur. Aynı kurumun iki dildeki bülteni farklı içerik taşıyabilir."
  - Bu ifade bile iyi bir metodoloji örneğidir.
  - AU03 notunu düzeltin. KALITE_KONTROL'deki "DÜZELTME 1"i geri alınmış olarak işaretleyin.
  - Not: Alıntı bir müdürün niyet yorumudur. Yorum (C) olarak etiketlenmesi doğrudur.
- **Önem:** **Yüksek.**

---

## 3. Öncelikli iddialar (C012, C017, C022, C033, C034, C036 ve tek kaynaklı teknik iddialar)

### C012 — Yapım yeri Delft
- **Mevcut ifade:** "Yapım yeri Delft olarak kabul edilir [C012]" (Orta §1). DERS.json'da kaynaklar K5 ve K7.
- **Denetim sonucu:** **Kısmen doğrulandı.**
- **Kaynak:** Wikidata Q167605 P1071 = Q690 (Delft), bu denetimde okundu. K1 ve K2'de yapım yeri alanı **yok**. K7 (EV) metninde "painted in Delft" türünden açık bir ifade **bulunamadı**. EV yalnızca Van Ruijven'i "Vermeer's rich Delft patron" olarak anıyor.
- **Olası hata:** Tek açık dayanak Wikidata. Kural 5 gereği tek başına yeterli değil. K7'nin kaynak olarak listelenmesi desteklenmiyor.
- **Önerilen düzeltme:** Dersteki "kabul edilir" ifadesi doğru ölçüdedir, korunsun. DERS.json'da K7'yi kaynak listesinden çıkarın ve şu notu ekleyin: "Müze kaydında yapım yeri alanı yok; Vermeer'in Delft'te çalıştığı bilgisine dayalı çıkarım + Wikidata P1071."
- **Önem:** Düşük.

### C017 — 1908 alımı: kamuoyu ve parlamento; Morgan, Bredius, de Stuers, Troelstra
- **Denetim sonucu:** **Doğrulandı** (ikincil düzeyde; B seviyesi uygun).
- **Kaynaklar:**
  - **K24 Vereniging Rembrandt:** "Toen de familie Six in 1907 bereid bleek Het melkmeisje te verkopen aan de Nederlandse staat… package deal met 38 andere schilderijen… De voorgenomen aankoop leidde tot felle discussies in de kranten en in de politiek… De Vereniging betaalde niet alleen een substantieel deel van de koopsom, maar overtuigde ook de overheid om bij te springen."
  - **K7 EV:** "Bredius was convinced that the American magnate-art collector J.Pierpont Morgan desired the painting… The opposition, led by socialist Troelstra, advocated for modern art acquisition, while Victor de Stuers… advocated maintaining the painting in the Netherlands, at any cost." EV ayrıca Frits Lugt'un broşürünü anıyor. 13 Ocak 1908'de "thirty-nine artworks" sergilenmiş.
- **Olası hata:** Orta §2'deki "eserin… Morgan'a gitmesinden korkuluyordu" ifadesi genel bir kamu korkusu gibi okunuyor. EV'ye göre bu, **Bredius'un kanaatidir**. Troelstra'nın muhalefetinin içeriği (modern sanat alımını savunması) derslerde yok.
- **Önerilen düzeltme:** "Bredius, eserin Amerikalı koleksiyoner J. P. Morgan'a gidebileceğine inanıyordu (EV)." VR'nin 1907 satış teklifi ve VR'nin "koopsomun önemli bir kısmını ödediği" bilgisi K24'le eklenebilir. Bu, alım bağlamını tek kaynaktan çıkarır.
- **Önem:** Düşük.

### C022 — Van Buyten borcu ve resimlerin teslimi
- **Mevcut ifade (Orta §3):** "Essential Vermeer bunu 'teminat olarak' aktarır, Vermeer Wikipedia maddesi ise borcu kapatan bir satış olarak anlatır."
- **Denetim sonucu:** **Kısmen doğrulandı.** Sonuçta varılan "kesinleştirilemez" doğru. Ama kaynakların karakterizasyonu eksik.
- **Kaynak (K7 EV), üç ayrı pasaj:**
  1. "he owed the considerable sum of 617 guilders to the baker… his widow, Catharina Bolnes, turned over **two paintings as collateral**"
  2. "he received **two more paintings** from Vermeer's wife… **as a security** for the debt for bread of more than 600 guilders"
  3. "Catharina… **settled this debt** with Van Buyten **by giving him a painting**… the significant amount owed to the baker was 617 guilders"
- **Kaynak (K22 Vermeer Wikipedia):** Bir yerde Van Buyten'in 1663'te, yani Vermeer hayattayken, "a couple of Vermeer's paintings **as collateral**" tuttuğu yazıyor. Başka bir yerde "The widow **sold** two more paintings to Hendrick van Buyten" deniyor.
- **Olası hata:** "EV = teminat, Wikipedia = satış" ikiliği yanlış bir basitleştirme. **EV kendi içinde çelişkili** (teminat ↔ borcun kapatılması; iki resim ↔ bir resim). Wikipedia da iki farklı işlemden söz ediyor. 617 florin rakamı EV'de iki kez geçiyor. Bu rakam EV'ye özgü değil, ama Montias'a giden birincil zincir bu denetimde görülmedi.
- **Önerilen düzeltme:** "Vermeer öldüğünde fırıncı Van Buyten'e büyük bir ekmek borcu vardı (EV: 617 florin). Dul eşi Catharina Bolnes'in Van Buyten'e resim/resimler verdiği aktarılır; ancak işlemin niteliği (teminat mı, borcun kapatılması mı) ve resim sayısı (bir mi, iki mi) erişilen ikincil kaynaklarda, hatta aynı kaynağın (EV) içinde tutarsızdır." Montias (1989) birincil kaynak olarak hedeflenmeli.
- **Önem:** Orta.

### C033 — Duvarda lekeler, çivi ve çivi delikleri
- **Denetim sonucu:** **Doğrulandı.** Önceki dosyadaki "kısmi görsel" notu artık gereksiz.
- **Kaynaklar:**
  - **Rijksmuseum hikâyesi "Extraordinary ordinary"** (https://www.rijksmuseum.nl/en/story/extraordinary-ordinary): "The crack in the window and **the mould on the wall** make the painting seem very real."
  - **K7 EV:** "A humble nail… This nail—another large nail is above the hanging bread basket… It casts a small shadow on the plaster to the right, signaling the light originates from the left. To the right of the figure's head appear a few nail holes."
  - **K4 görsel:** Pencere ve duvar kırpmasında asılı sepetin sağında çivi ve küçük delikler seçilebiliyor.
- **Önerilen düzeltme:** Bu hikâye sayfasını yeni birincil kaynak (K25) olarak ekleyin. "Lekeler" yerine müzenin ifadesi olan "küf" (mould) kullanılabilir. Seviye A'ya yükseltilebilir.
- **Önem:** Düşük (iyileştirme).

### C034 — Delft çinileri; birinde yaylı Cupid
- **Denetim sonucu:** **Doğrulandı** (ikincil kaynak açık; görsel teyit kısmi).
- **Kaynak (K7 EV):** "One of the tiles which Vermeer added displays a fairly recognizable Cupid with a cocked bow trapped midway between the milkmaid's voluminous skirt and the footwarmer." K6 de aynı yerleşimi veriyor ("tiles of Cupid and a man with a pole on either side of it").
- **Görsel (K4, sağ alt bölge kırpması):** Ayak ısıtıcısının solunda mavi, kanatlı küçük bir figür, sağında sırıklı bir figür görülüyor. Yayın kendisi bu çözünürlükte (yaklaşık 1200 px bölge) ayırt edilemedi.
- **Not:** EV'nin "One of the tiles which Vermeer added" ifadesi C052'yi de destekliyor.
- **Önem:** Yok, iddia sağlam.

### C036 — Çatlak pencere camı
- **Mevcut ifade:** "Kaynaklar, pencere camlarından birinin çatlak olduğunu betimler [C036 — görsel teyit yapılamadı]" (Orta §4).
- **Denetim sonucu:** **Doğrulandı** (müze kaynağıyla).
- **Kaynaklar:**
  - **Rijksmuseum "Extraordinary ordinary":** "**The crack in the window** and the mould on the wall…"
  - **K7 EV:** "Slight interplays of light and texture, like **a broken piece of one of the panes**, are captured with exceptional precision…"
- **Önerilen düzeltme:** "Görsel teyit yapılamadı" notunu kaldırın ve müze kaynağını ekleyin. Seviye A uygun. (Kendi kırpmamda üst sıradaki camlardan birinde açık tonlu bir kırılma alanı seçiliyor, ama kesin teşhis için müze ifadesi esas alınmalı.)
- **Önem:** Düşük (iyileştirme).

### Tek kaynağa (EV) dayanan teknik iddialar: C038, C040–C046, C052

| İddia | EV'de bulundu mu? | Bulgu |
|---|---|---|
| C040 keten, germe kenarları, 14×14,5 iplik/cm² | ✓ "The closed, plain-weave linen still has its original tacking edges. The thread count is 14 x 14.5" per cm²." | Doğrulandı |
| C041 1950 wax/resin, önce paste lining | ✓ "relined with wax/resin in 1950 over an existing paste lining" | Doğrulandı |
| C042 ast | ✓ "pale brown/gray, containing chalk, lead white and umber" | Doğrulandı |
| C043 ultramarin/azurit/glazür; Van Ruijven hipotezi | ✓ "costly natural ultramarine (made of crushed lapis lazuli imported from Afghanistan)… contemporary painters, instead, usually employed the cheaper blue called azurite… Some scholars have speculated…" | Doğrulandı (hipotez olarak sunulması doğru) |
| C044 kurşun-kalay sarısı | ✓ "lead-tin yellow, the brightest yellow pigment available in Vermeer's time" | Doğrulandı |
| C045 duvar ve etek pigmentleri | Duvar ✓ "white lead, umber and charcoal black". Etek: "vermilion… and black… glazed with… red madder" ✓, ama EV "Madder was **most likely** the dye…" diyor | **Doğrulandı.** Derste madder kesin olarak veriliyor; "büyük olasılıkla" eklenmeli (Düşük) |
| C046 iğne deliği | ✓ "A pinhole with which Vermeer marked the vanishing point of the composition is visible in the paint layer above the right hand of the maid." | Delik **doğrulandı**. "Liedtke iğne-ip yöntemi" yalnız K6 (2009 röportajı) üzerinden → **Kısmen** |
| C038 sekizgen katlanır masa | EV: "Based on **Keith Cardnell's geometric reconstruction**… various 17th-century Dutch art experts now concur that what we observe is actually half of the top of a 17th-century **gateleg drop-leaf table**…" | **Kısmen.** Bkz. B07 |
| C052 çiniler ve stoofje sonradan | ✓ EV: "The Delft wall tiles and the footwarmer were, instead, afterthoughts." K3: "Vermeer later covered over the fire basket with the foot stove, Delftware tiles, and the floor." | Doğrulandı (iki bağımsız kaynak) |

**B03 — Teknik raporun kaynağı yanlış tanıtılıyor (Orta).**
- **Mevcut ifade (Orta §6):** "Teknik rapor (Essential Vermeer üzerinden aktarılan **Rijksmuseum araştırması**) şunları bildirir [C040–C046]."
- **Denetim sonucu:** **Yanlış atıf.** EV'nin "Technical report" bölümü, yıldızlı bir kaynak notuyla bitiyor: "* Johannes Vermeer (exh. cat., National Gallery of Art and Royal Cabinet of Paintings Mauritshuis - Washington and The Hague, 1995, edited by Arthur K. Wheelock Jr.)". Pigment bilgileri ise EV'nin kendi deneme metinlerinden geliyor. Hiçbiri Rijksmuseum araştırması olarak tanıtılmıyor.
- **Önerilen düzeltme:** "Teknik rapor (Essential Vermeer'in 1995 Washington/Lahey sergi kataloğuna — ed. Wheelock — dayanarak aktardığı)…" Bu, C040–C046 için hedef birincil kaynağı da gösterir (1995 kataloğu bu denetimde görülmedi).
- **Önem:** Orta.

**B07 — C038 masa: "teknik araştırma gösterdi" ifadesi aşırı.**
- **Mevcut ifade:** "teknik araştırma bunun sekizgen katlanır bir masanın yarısı olduğunu gösterdi — perspektif hatası değil, doğru gözlem" (Orta §4). İleri §4 bunu 2022 bulgularıyla aynı paragrafta "mit düzeltme" örneği olarak kullanıyor.
- **Denetim sonucu:** **Kısmen.** Kaynak bir teknik görüntüleme değil, **geometrik rekonstrüksiyondur** (Keith Cardnell). EV bunu uzmanların "artık hemfikir olduğu" bir yorum olarak sunuyor. 2022 araştırmasıyla ilgisi yok.
- **Önerilen düzeltme:** "Keith Cardnell'in geometrik rekonstrüksiyonuna göre masa, açıldığında sekizgen olan katlanır (gateleg) bir masanın yarısıdır; EV bu yorumun uzmanlarca benimsendiğini belirtir." İleri §4'te bu bulguyu 2022 teknik bulgularından ayırın.
- **Önem:** Orta.

---

## 4. Diğer bulgular

### B04 — C051 / C073: "Dikiş/çamaşır sepeti" adı EV'de **var** (kısmen)
- **Mevcut ifade:** C073: "güncel sayfada **ve EV'de yok**; doğrulanamadı (E)". CS07-A gerekçesi ve Orta §6: "Eski betimlerdeki 'dikiş sepeti' adı doğrulanamadı."
- **Denetim sonucu:** **Kısmen yanlış sınıflama.**
  - **K7 EV:** "In the lower-left behind the maid's skirt there once stood **a large, open clothes basket with laundry issuing from it**." EV ayrıca Taylor'dan alıntı yapıyor: "The maid would have to be a rather heedless person if she gathered all the laundry of the house… and then left it on the floor…"
  - **K3:** "identify **the previously discovered basket**… as a so-called 'fire basket'"
  - **K14:** "de mand rechtsonder… **die al eerder was ontdekt**"
  - **"Sewing basket" (dikiş sepeti)** ifadesi yalnız K6'nın eski Rijksmuseum sayfasına yaptığı atıfta geçiyor; doğrulanamadı.
- **Olası hata:** "Çamaşır/giysi sepeti" yorumu ikincil kaynakla (EV, Taylor alıntısıyla) **belgeli**. Belgelenemeyen yalnız "dikiş sepeti" adı. Ayrıca EV nesneyi "lower-left" diye konumluyor; K3 ise "lower right" diyor. EV'nin konum ifadesi hatalı veya figüre göre yazılmış olabilir.
- **Önerilen düzeltme:** C073'ü ikiye ayırın: "çamaşır/giysi sepeti yorumu" (B, K7) ve "dikiş sepeti adı" (E, K6). Orta §6'ya şunu ekleyin: "Sepet daha önce de biliniyordu; eski literatür onu çamaşır sepeti olarak yorumluyordu (EV); 2022'de vuurmand olarak tanımlandı." CS07-A gerekçesini buna göre düzeltin.
- **Önem:** Orta.

### B05 — C024: "Emekçi sınıfından bir figüre adadığı tek eser"
- **Mevcut ifade (Orta §3):** "*Süt Boşaltan Kadın*, Vermeer'in emekçi sınıfından bir figüre adadığı tek eserdir; bu temaya bir daha dönmedi [C024]." DERS.json'daki ifade daha da güçlü: "Vermeer'in tek emekçi figürlü eseri."
- **Denetim sonucu:** **Kısmen.** EV yalnızca şunu söylüyor: "After The Milkmaid, Vermeer never again turned his attention to a **working-class theme**."
- **Olası hata:** "Tek emekçi figürlü eser" ifadesi kaynağın söylediğinden fazlası. Vermeer'in başka eserlerinde de hizmetçi figürleri bulunduğu genel literatür bilgisidir; örneğin K1 sayfasında "more by Johannes Vermeer" altında listelenen *The Love Letter*. Bu sayfayı bu denetimde ayrıca açmadım. EV'nin ifadesi "tema" düzeyindedir.
- **Önerilen düzeltme:** "Essential Vermeer'e göre Vermeer, bu eserden sonra emekçi sınıfına ait bir temaya bir daha dönmedi; bir hizmetçinin tek başına ve kendi işiyle resmin ana konusu olduğu tek eseridir." DERS.json'daki "tek emekçi figürlü eser" ifadesini kaldırın.
- **Önem:** Orta.

### B06 — C055: Cant'e ait iddialar EV'de yok
- **Mevcut ifade:** C055 kaynakları: yalnız K7. Orta §5: "Cant'e göre beyaz duvarlı, sütlü 'serin mutfak'ta stoofjenin… çalışkanlık işareti olması mümkündür." İleri §4: "Cant bu zinciri destekler."
- **Denetim sonucu:** **Kısmen (kaynak atfı hatalı).** EV metninin tamamında "Cant" adı **hiç geçmiyor**. Cant'in "cool kitchen" ve "hardworking nature" okumaları ile camera obscura argümanı ("discrepancy between objects at various distances") **yalnız K6'da** bulunuyor. K6 bunları Serena Cant, *Vermeer and His World* (Quercus, 2009) kitabına atfediyor. Bu, popüler okura yönelik bir yayın. Liedtke'nin stoofje ve cinsel ima okuması ise EV'de bulunuyor ("it may allude to the maid's inner warmth or even have a sexual implication").
- **Önerilen düzeltme:** C055'i ikiye ayırın: Liedtke stoofje (C, K7) ve Cant okumaları (C, **yalnız K6 → Cant 2009**, özgün kitap görülmedi). İleri §4'te Cant'in camera obscura argümanını doğru içerikle verin: nesneler arası mesafe tutarsızlığı, pointillé değil.
- **Önem:** Orta.

### B08 — C058: "Erdem/onur hattı (Wheelock, Schama, Laneri)" ekol olarak abartılı
- **Denetim sonucu:** **Kısmen.**
  - **Wheelock:** ✓ EV: Wheelock "celebrated the milkmaid as a madonna of the cow-meadows… 'an ideal of human dignity'…"
  - **Schama:** K6 yalnızca şunu söylüyor: "an alternative convention of painting women at work in the home as exemplars of Dutch domestic virtue, dealt with at length by Simon Schama." Bu genel bir gelenek tespitidir, **bu esere özgü bir okuma değildir**. EV'de Schama yalnız Hollanda feminizmi bağlamında geçiyor.
  - **Laneri:** Raquel Laneri'nin *Forbes* dergisinde 12 Eylül 2009'da yayımlanan sergi yazısı (K6). Bir gazeteci metni; akademik bir "ekol" temsilcisi değil.
- **Önerilen düzeltme:** "Wheelock (onur ideali); Schama'nın betimlediği 'ev içi erdem' geleneği (genel bağlam); bir 2009 basın değerlendirmesi (Laneri, *Forbes*)." "Ekol" ifadesi yalnız Wheelock ve Liedtke için kullanılsın.
- **Önem:** Orta.

### B09 — C053: Camera obscura zincirinde kaynakların konumu
- **Denetim sonucu:** **Kısmen.** EV pointillé'leri yalnızca bir "ima" olarak geçmiyor, çıkarımı kendisi yapıyor: "The famous pointillés… suggest nothing more than light as it flickers off the fractured topography of the bread, stoneware and basket. **Their presence implies that the artist used a camera obscura** as an aid to the painting process." Dersteki "(kanıt değil)" kaydı hakemin doğru bir uyarısıdır, ama EV'nin pozisyonunu olduğundan zayıf gösteriyor. Liedtke'nin üç karşı argümanı K6'da birebir bulundu: pinhole "has really punctured the theory", "the light lasts maybe 10 seconds, but the painting took at least months to paint", iğne ve tebeşirli ip. Kaynak "a 2009 interview" (WNYC) olarak verilmiş. Özgün kayıt erişilmediği için **E/D olarak bırakılması doğru**. Ek not: EV, Reynolds'un 1781'de bu eseri gördükten sonra Hollanda resimlerini camera obscura görüntüsüne benzettiğini aktarıyor. Bu da tartışmanın resepsiyon tarihine eklenebilir.
- **Önerilen düzeltme:** "Essential Vermeer pointillé'lerin camera obscura kullanımına işaret ettiğini savunur (tartışmalı bir çıkarım)." Cant'in argümanını B06'daki gibi düzeltin.
- **Önem:** Düşük-Orta.

### B10 — C018 ve İleri §8: Van Ruijven ölüm yılı "ihtilafı" artık yok
- **Mevcut ifade:** "Van Ruijven ölüm yılı: Rijksmuseum 1674 ↔ Wikidata 1678 — Açık."
- **Denetim sonucu:** **Güncel değil.** Wikidata Q2615527 bu denetimde P570 = 1674 döndürdü (doğum P569 = 1624). Bu öğenin Van Ruijven olduğu DERS.json K9 eşlemesine dayanıyor; etiket sorgusu hız sınırına takıldı. K1: "Pieter Claesz van Ruijven (1624-1674)". K6: "(1624–1674)". EV: Van Ruijven'in "rich Delft patron" olduğu ✓.
- **Önerilen düzeltme:** Tablodaki satırı kaldırın veya "2026-11-13 itibarıyla Wikidata da 1674; ihtilaf giderilmiş" diye not düşün.
- **Önem:** Düşük.

### B12 — İleri §9: Wikipedia "localhost" referansı **düzeltilmemiş**
- **Mevcut ifade:** "(İlk oturumda görülen bozuk 'localhost' sergi referansı, 13 Kasım 2026 gecesi kontrolünde düzeltilmiş bulundu — güncel sürümde Met referansı düzgün arşivlenmiş.)" KALITE D08 aynı şeyi söylüyor.
- **Denetim sonucu:** **Yanlış.** Bugün indirilen ham wikitext'te 2009 sergi cümlesinin referansı hâlâ şöyle: `{{Cite web |title=Vermeer's Masterpiece |url=https://localhost:5000/exhibitions/listings/2009/vermeer |access-date=2025-08-22 |website=The Metropolitan Museum of Art}}`. Makalenin başka yerlerinde Met sayfası düzgün bir arşiv bağlantısıyla da kaynak gösteriliyor (`MetMuseum-Exhibition-2009`, archive 2019). Önceki model büyük olasılıkla bu ikisini karıştırmış.
- **Önerilen düzeltme:** Cümleyi şöyle değiştirin: "Wikipedia'da 2009 sergisini anlatan cümlenin referansı bozuk (localhost) bir URL'dir; Met sayfası aynı maddenin başka yerlerinde arşiv bağlantısıyla verilmiştir."
- **Önem:** Düşük (içerik değil, süreç dürüstlüğü).

### B13 — C035 / Başlangıç ve Orta: "köz parlayan" ayak ısıtıcısı
- **Denetim sonucu:** **Kısmen.** K1 yalnız "stoofje" ve "foot-stove" diyor. EV genel olarak stoofun içinde "a receptacle of pottery or metal filled with hot coals" bulunduğunu yazıyor. Görselde (K4 kırpması) kutunun içinde **kırmızı bir toprak kap** (köz kabı) görülüyor. Parıltı veya köz açıkça seçilmiyor.
- **Önerilen düzeltme:** "içinde kırmızı bir köz kabı görülen delikli ahşap kutu". DERS.json'daki "köz parıltılı" ifadesi A seviyesinde tutulmamalı.
- **Önem:** Düşük.

### B14 — C050 / TK03: Vuurmandın işlevi
- **Denetim sonucu:** **Doğrulandı, küçük bir kesinlik sorunu var.** K3: "A fire bowl containing glowing coals was placed in the basket to keep new-borns warm and to dry nappies." K14: "In een vuurmand werd een vuurtest of kom met gloeiende kolen geplaatst." Közün kendisi değil, közlü bir kap sepete konuyordu. K3 ayrıca sepetin "previously discovered" olduğunu söylüyor: 2022'nin katkısı sepetin **tanımlanmasıdır**, keşfi değil.
- **Önerilen düzeltme:** "içine közlü bir kap (vuurtest) konan söğüt sepeti; daha önce röntgenle bilinen sepet, 2022'de vuurmand olarak tanımlandı."
- **Önem:** Düşük.

### B15 — İleri §4: "Sahne kusursuz bir perspektif kurgusudur" miti
- Bu paragraf 2022 teknik bulgularını (C048–C050) ve geometrik bir rekonstrüksiyonu (C038, bkz. B07) aynı "mit düzeltme" kalıbına koyuyor. Ayrıca "kusursuz perspektif" mitinin kime ait olduğu kaynaklanmıyor. **Önerilen düzeltme:** Ayırın ve mitin sahibini kaynaksız bırakmayın. **Önem:** Düşük.

### B16 — Bindirilmiş nesnelerin yorum tarihi eksik (CS07-B ile bağlantılı)
- K6: "One was a large **wall map** (a Rijksmuseum web page calls it a painting) behind the upper part of the woman's body." EV başka bir pasajda baş arkasındaki nesnenin "a mantelpiece" olabileceğini, başka bir pasajda ise 2022 bulgusunu "a shelf… with hanging lidded jugs" olarak anıyor. 2022 bülteni bunu **kannenbord** olarak tanımlıyor. Derste bu yorum tarihi yok. CS07'de "Duvar haritası" bir çeldirici olarak kullanılıyor. Soru sağ alt nesneyi sorduğu için cevap yine yanlış, ama gerekçe bunun **baş arkasındaki nesne için eski bir yorum** olduğunu söylemeli.
- **Önem:** Düşük.

### B17 — Rijksmuseum'un kendi ikonografi hikâyesi kullanılmamış
- K1 sayfası, eser için Rijksmuseum'un "A sexual or lesbian symbol" başlıklı bir hikâyesine bağlantı veriyor. Giriş metni: "What do the attributes around her say about her? And what might they say about Vermeer or the person for whom he made this painting?" Gövde metnini bu denetimde okuyamadım (sayfa istemci tarafında yükleniyor). İkonografi bölümü (Orta §5, İleri §5) müzenin bu kendi yorum metnini hiç anmıyor. Bir insan editör okuyup hatlara eklenip eklenmeyeceğine karar vermeli. **Önem:** Düşük (eksiklik).

### B18 — C057 Rand hipotezi daha güçlü kaynaklanabilir
- K1 bibliyografyası "Wat maakte de 'Keukenmeid' van Vermeer?" başlıklı yayını listeliyor. K6 bunu Rand, *Bulletin van het Rijksmuseum* 46 (1998), no. 2–3, s. 275–278 olarak veriyor. EV de hipotezi ayrıntılı aktarıyor ve bir alternatif öneriyor: "pap for young children". Rand'ın hakemli müze bülteninde yayımlanmış makalesi künye olarak eklenebilir; makaleyi ben görmedim. Hipotez yorum (C) olarak kalmalı. **Önem:** Düşük (iyileştirme).

### B19 — EV güvenilirliği hakkında ek not
- EV, provenance bölümünde Isaac Rooleeuw için "(c. 1600-1710)" veriyor. K1 ise "(1663-1701)". EV'deki tarih açıkça hatalı. Bu ve B04/B05'teki iç çelişkiler, EV'nin **B (ikincil, hakemsiz)** seviyesinde tutulmasının doğru olduğunu gösteriyor. Dersler burada K1'i kullanmış, doğru. **Önem:** Bilgi.

### B20 — C013: "Veri CC0"
- K1 ve K2'de görüntü için "Public domain" ve Public Domain Mark 1.0 ✓. Metadatanın CC0 lisansı bu denetimde kaynakta görülmedi → **Kısmen**. **Önem:** Düşük.

### B21 — C030 ve CS09: Işık soldan
- Cevap doğru. EV: "It casts a small shadow on the plaster to the right, **signaling the light originates from the left**." K1 Hollandaca betim yalnızca "links een venster" (solda bir pencere) diyor; ışığın oradan girdiğini söylemiyor. CS09 gerekçesindeki "müzenin Hollandaca betimi: ışık soldaki… pencereden girer" ifadesi kaynağı aşıyor. **Önem:** Düşük.

---

## 5. İddia bazında sınıflandırma (C001–C076)

**T** = tam doğrulandı · **K** = kısmen · **Y** = yanlış · **D** = doğrulanamadı · **Yo** = yorum/meta (ayrı değerlendirildi). "Kaynak ✓" sütunu, ifadenin **bu denetimde metinde bulunduğu** kaynakları gösterir.

| ID | Sonuç | Kaynak ✓ | Not |
|---|---|---|---|
| C001 | T | K2 (former title: De keukenmeid, De melkmeid; Het melkmeisje) | |
| C002 | T | K2 "Johannes Vermeer (1632–1675)" | |
| C003 | T | K1, K2 "c. 1660 / ca. 1660"; WD P571 1660, precision 9, P1480 | |
| C004 | T | K7 "Dates" tablosu (dört öneri birebir); K3 giriş "(1657-58)" ↔ alt yazı "c. 1660" | |
| C005–C007 | T | K1, K2 | |
| C008 | T | K1 provenance son halka: "fl. 550,000, with 38 other paintings, with the support of the Vereniging Rembrandt, to the museum, 1908" | |
| C009 | T | K1 "Gallery of Honour"; K2 HG-2.30.3 / Eregalerij | |
| C010 | T | K7 "No signature appears on this work."; K1'de imza alanı yok | |
| C011 | T | K1 "Has subject genre painting"; konu terimleri | |
| C012 | K | Yalnız WD P1071 | B: §3 |
| C013 | K | K1, K2 PD ✓; CC0 görülmedi | B20 |
| C014 | T | K1 "?" işaretleri, Montias 1989 dipnotu | |
| C015 | T | K1 "16 May 1696, no. 2, fl. 175, to Isaac Rooleeuw" | |
| C016 | T | K7 "more than any of the 21 Vermeer's at the same auction, except for the View of Delft" | |
| C017 | T | K7 + K24 | B: §3 |
| C018 | K | Hami ✓ (K7); 1674/1678 ihtilafı güncel değil | B10 |
| C019 | T | K7 (1781 Reynolds); K1 provenance "Reynolds 1996" dipnotu | |
| C020 | T | K3 "very small oeuvre of about 35 paintings" | |
| C021 | T | K7 "did not have enough money to pay in full the entrance fee to the Saint Luke Guild" | |
| C022 | K | K7 iç çelişkili; K22 iki işlem | B: §3 |
| C023 | T | K7 "Kitchen maids, and especially milkmaids, were known for being sexually available." | C056'ya dayandırılmamalı |
| C024 | K | K7 "never again turned his attention to a working-class theme" | B05 |
| C025 | T | K3 | |
| C026 | T | K1 bibliyografya: NYT 11 Eyl 2009 inceleme + 13 Eyl 2009 Met ilanı | Europeana belgesi açılmadı |
| C027, C028 | T | K1, K2 küratör metni (birebir) | |
| C029 | T | K7 "The cascade of the black frame, the basket and the brass marketing pale all lead the eye down towards the thematic center…"; "seemingly monumental character" | |
| C030 | T | K7 (çivi gölgesi → ışık soldan); K1 "links een venster"; K4 | B21 |
| C031 | T | K1 "hundreds of colourful dots"; K7 "spherical dabs of thick opaque paint" | |
| C032 | T | K1 NL betim; K4 | |
| C033 | T | Rijksmuseum hikâyesi "mould on the wall"; K7 çivi ve delikler; K4 | Seviye A'ya yükseltilebilir |
| C034 | T | K7; K6; K4 kısmi | |
| C035 | K | K1 stoofje ✓; "köz parıltılı" görselle uyuşmuyor | B13 |
| C036 | T | Rijksmuseum hikâyesi "crack in the window"; K7 | Seviye A'ya yükseltilebilir |
| C037 | T | K1 "rieten mand en een koperen pot"; K7 "brass… pail"; K4 | |
| C038 | K | K7: geometrik rekonstrüksiyon | B07 |
| C039 | T | K4 (craquelure kırpmalarda açık) | |
| C040–C044 | T | K7 (kaynağı 1995 NGA/Mauritshuis kataloğu) | B03 |
| C045 | T | K7 | Madder "most likely" |
| C046 | K | Delik ✓ K7; Liedtke yöntemi yalnız K6 | |
| C047 | T | K3 (Mauritshuis, MA-XRF, RIS, Night Watch; SWIR ve XRPD alt yazılarda); K14 Antwerpen | |
| C048 | T | K3 "hastily applied thick line of black paint… beneath the milkmaid's left arm" | |
| C049 | T | K3 jug holder; K14 "rek met kannen, ook wel kannenbord genoemd"; Oortman c. 1690 gövde / c. 1686–1710 alt yazı | |
| C050 | T | K3, K14 | B14 nüansı |
| C051 | K | Bkz. C073 | B04 |
| C052 | T | K7 + K3 | |
| C053 | K | K7, K6 | B09 |
| C054 | T | K7 (Liedtke "discreet object of desire"; Wheelock; Dibbits) | |
| C055 | K | Liedtke ✓ K7; Cant yalnız K6 | B06 |
| C056 | **Y** | K16 yanlış okunmuş | **B01** |
| C057 | T | K7, K6, K1 bibliyografya | B18 |
| C058 | K | Wheelock ✓; Schama genel; Laneri gazeteci | B08 |
| C059 | T | K2 eski başlık "De keukenmeid"; K6 "domestic kitchen maid" | |
| C060 | Yo | §6 | |
| C061 | T | K15: SK-A-385, 1665–1668, 82 × 70,5; NL betim "roe in zijn schoen", "sinterklaaslied" | |
| C062 | T | K3 "Woman Holding a Balance (The National Gallery of Art, Washington DC)" | NGA 403 |
| C063 | T | K3 "The Girl with a Pearl Earring (Mauritshuis, The Hague)" | |
| C064 | T | K1 (altı satış birebir) | |
| C065 | T | K7 | |
| C066 | T | K7 "'Mignon des Dames' from Sinnepoppen · Roemer Visscher · 1614 · Engraving" | |
| C067 | T | K7 "The Dutch economy virtually flourished after the cessation of hostilities with Spain in 1648…"; tarih resminden türe geçiş | |
| C068 | D | K6: "the slang term *melken*, defined as 'to sexually attract or lure'" var; Liedtke kataloğu görülmedi | E kalmalı |
| C069 | D | Yalnız K6 | E kalmalı |
| C070 | T | K7 | |
| C071 | D | Yalnız K6 (200 guilders) | E kalmalı |
| C072 | D | K10 429; K6 başlığı "(September 10–November 29, 2009)" | E kalmalı |
| C073 | K | "Çamaşır/giysi sepeti" K7'de var; "dikiş sepeti" yalnız K6 | B04 |
| C074 | Yo | §6 | |
| C075 | T | `gorseller/k/7ad9f577dbcabf65.jpg` dosyası bu depoda açıldı: JPEG, 356×400 px; görsel olarak aynı eser | |
| C076 | D | K23 403 | Mauritshuis bilgileri genel literatürle tutarlı görünüyor, ama bu denetimde **doğrulanmadı** |

**Toplam:** T 55 · K 13 · Y 1 · D 5 · Yo 2 = **76**

---

## 6. Akademik yorum (felsefe) denetimi — İleri §5–§6, C060, C074

Genel değerlendirme: Bölüm baştan "açıkça yorum" olarak etiketlenmiş. Vermeer'e herhangi bir düşünürden etki atfedilmemiş. Bu iki tercih doğru ve önemli. Aşağıdakiler, düşünürlerin görüşlerinin **temsil doğruluğuna** dair bulgular.

| # | Düşünür | Sonuç | Kaynak / gerekçe | Önem |
|---|---|---|---|---|
| F1 | **Kant (çıkarsızlık)** | Kısmen doğru | SEP "Kant's Aesthetics": beğeni hazzı "is disinterested, which means that it does not depend on the subject's having a desire for the object" ✓. Ancak: (a) Kant figüratif sanat eserlerinin değerlendirmesini çoğunlukla bir kavrama bağlı "bağımlı güzellik" (KdU §16) alanına koyar. "Dikkat salt görünüşe yönelir" ifadesi, bir hizmetçi ve süt kavramını içeren bir resim için Kant'ı fazla saf "serbest güzellik" okumasına çekiyor. (b) **"Estetik yargı" paragrafındaki yücelik cümlesi** ("Yücelik… dehşet değil, dinginlik ezici bir güçle sunulur") Kantçı değildir. Yüceliği dehşetle tanımlamak Burke'e yakındır. Kant'ta yüce asıl olarak biçimsiz, ölçüsüz *doğaya* ilişkindir ve küçük, düzenli bir sanat eseri bu kategoriye kötü oturur. | **Orta** |
| F2 | **Hegel** | Doğru (yorum olarak kabul edilebilir) | SEP "Hegel's Aesthetics": Hollanda ustaları prosaik nesneleri "the fullness of life" ile donatıp gerçek sanat eserine dönüştürür; "*Lebendigkeit*" ✓. Nüans: SEP'e göre Hegel bu resimlerde Hollandalıların **kendi özgürlük, "comfort" ve "contentment" duygularının** ifadesini görür. Bu, tek bir jestte "tinin kendine gelişi"nden daha toplumsal-tarihsel bir okumadır. "Pazar günü" ifadesinin kaynakta olmadığının dersin kendisinde belirtilmesi takdire değer. | Düşük |
| F3 | **Benjamin (aura)** | **Kavram tersine çevrilmiş** | SEP "Walter Benjamin": aura, teknik yeniden üretilebilirlik çağında **geriler** ("the historical decline of the 'aura'"). Benjamin'de aura, özgün eserin *şimdi ve buradaki* biricik varlığına bağlıdır; kopyada tanım gereği bulunmaz. Dersin "aura burada tekil nesneden çok, doğru ışık bilgisinin dolaşımıyla ilgilidir" ve "PD yayını aurayı demokratikleştirme girişimi" ifadeleri bu tanımla çelişir. Benjamin'e göre çoğaltma aurayı "demokratikleştirmez", çözer. Benjamin bunun özgürleştirici siyasal potansiyelini de vurgular. | **Orta** |
| F4 | **Berger** | Büyük ölçüde doğru; uygulama genişletilmiş | "Men act and women appear" (*Ways of Seeing*, 3. bölüm) bilinen bir ifadedir. K21 (The Marginalian) **bu denetimde açılmadı**. Berger'in bakış eleştirisi esas olarak çıplak kadın ve yağlıboya geleneği üzerinedir. Giyimli, çalışan bir figüre uygulanması meşru bir genişletmedir, ama öyle olduğu söylenmeli. Emeğin görünmezliği eleştirisi için Berger'in yağlıboya ve mülkiyet bölümü (5. bölüm) daha doğrudan bir dayanaktır. | Düşük |
| F5 | **Panofsky** | Doğru | Üç katman (ön-ikonografik betim, ikonografik analiz, ikonolojik yorum) standart tanıma uygun. Ancak **K20 (Citaliarestauro) bir restorasyon şirketinin blog sayfasıdır** ve akademik doğrulama kaynağı sayılmamalı. Panofsky, *Studies in Iconology* (1939) "Introductory" bölümü veya *Meaning in the Visual Arts* (1955) kaynak gösterilmeli. K20 bu denetimde açılmadı. | Düşük |
| F6 | **C074 / KALITE "SEP + akademik açıklamalar"** | Kısmen | Beş kaynaktan üçü SEP (iyi). İkisi (K20 şirket blogu, K21 kişisel blog) "güvenilir akademik açıklama" ölçütünü karşılamıyor. Ayrıca K17 (Zangwill, "Aesthetic Judgment") Kant'a özgü bir madde değil; Kant için SEP "Kant's Aesthetics and Teleology" daha uygun. | Düşük |

Ek olarak:
- **İleri §6 Berger paragrafındaki [C056] atfı** B01 gereği kaldırılmalı.
- **"Mona Lisa etkisi"** (Liedtke) yalnız K6 → *Connecticut Post* 2009 zincirine dayanıyor. Etiketsiz olarak C058'e bağlanmış; "K6 zinciri" notu eklenmeli.

---

## 7. Quiz denetimi (SORULAR.json)

**Doğru cevaplar:** CS01–CS10'un işaretli doğru şıkları ve DY01–DY05'in doğru/yanlış değerleri **tümüyle doğru**. Çeldiriciler makul ve zorluk dengeli.

| # | Soru | Sorun | Önerilen düzeltme | Önem |
|---|---|---|---|---|
| Q1 | **AU03** | Not hatalı: Dibbits'in "rust en verstilling" alıntısı resmî NL bülteninde var (B02). | "Dibbits'in alıntısı Hollandaca bültende vardır, İngilizce bültende yoktur." İki dil sürümünü karşılaştırmayı öğrenme öğesi yapın. | **Yüksek** |
| Q2 | **CS02** B ve D gerekçeleri | "RF 926, Louvre'daki bir Boucher eserinin numarasıdır" ve "NK2334, … Bulgarini Madonna of Humility kaydının numarasıdır" iddiaları kanıt dosyasında yok ve bu denetimde doğrulanmadı. Kanıtsız olgu iddiası, olası uydurma riski taşıyor. | Gerekçe: "Bu numara SK-A-2344 değildir; Rijksmuseum resimleri SK-A- önekli numaralar taşır." Ya da doğrulanmış numaralar kullanın (ör. SK-A-385 zaten var). | **Orta** |
| Q3 | **CS07** A gerekçesi | "Dikiş/çamaşır sepeti… doğrulanamadı" ifadesi eksik. "Çamaşır sepeti" yorumu EV'de belgeli (B04). | "Eski literatür bu nesneyi çamaşır/giysi sepeti olarak yorumluyordu (EV); 2022 araştırması onu vuurmand olarak tanımladı." Şıkkı "Çamaşır sepeti (eski yorum)" yapmak daha öğretici olur. | **Orta** |
| Q4 | **CS07** B gerekçesi | "Duvar haritası" baş arkasındaki nesne için tarihsel bir yorumdur (K6). Gerekçe bunu söylemiyor (B16). | "Duvar haritası, baş arkasında boyanıp kapatılan nesne için öne sürülmüş eski bir yorumdur; 2022'de bu bölgedeki eskiz kannenbord olarak tanımlandı. Soru sağ alttaki nesneyi soruyor." | **Orta** |
| Q5 | CS09 gerekçesi | Hollandaca betimin söylediğinden fazlası aktarılmış (B21). | Gerekçeye EV'nin çivi gölgesi cümlesini ekleyin. | Düşük |
| Q6 | CS06 A çeldiricisi | E seviyeli (doğrulanmamış) 200 florin rakamı bir şıkta ve gerekçede yeniden dolaşıma giriyor. Gerekçe dürüst, ama öğrenci belleğine doğrulanmamış bir sayı yerleşebilir. | İsteğe bağlı: başka bir provenance rakamı kullanın (ör. 1719'daki 126 fl). | Düşük |
| Q7 | CS10 gerekçesi | "Atıf yine de tartışmasız Vermeer'dir" ifadesinin kanıt kimliği yok. Olgu olarak doğru, ama etiketsiz. | C002'ye bağlayın veya çıkarın. | Düşük |
| Q8 | DY03 | "çağdaşlarının kullandığı ucuz azurit" mutlak bir ifade; EV "usually employed" diyor. | "çağdaşlarının genellikle kullandığı…" | Düşük |
| Q9 | TK03 | "içine köz konur" ifadesi kesin değil. | "içine közlü bir kap (vuurtest) konurdu" (K3, K14). | Düşük |
| Q10 | TK05, DY04 | Cant okuması yalnız K6'ya dayanıyor (B06). TK05'te kaynak belirtilmiyor. | "(Cant 2009, Wikipedia aracılığıyla)" notu ekleyin. | Düşük |
| Q11 | GZ04 | "içindeki parıltının işlevini düşünün" ifadesi görselle tam uyuşmuyor (B13). | "kutunun içindeki kırmızı kabın işlevini düşünün" | Düşük |

Sorunsuz bulunanlar: CS01, CS03, CS04, CS05, CS08, DY01, DY02, DY05, AU01, AU02, AU04, AU05, GZ01, GZ02, GZ03, GZ05, TK01, TK02, TK04. AU05'teki "Wikipedia üzerinden aktarılan, özgün kayıt erişilemedi" notu örnek bir dürüstlük uygulamasıdır.

---

## 8. Yayına uygunluk kararı

**Karar: ŞU HALİYLE YAYINA UYGUN DEĞİL — revizyon sonrası uygun.**

**Yayından önce zorunlu düzeltmeler:**
1. **B01 / C056:** Lucas van Leyden baskısının "Eroticism" örneği olarak sunulduğu ifadeyi üç dersten kaldırın ve C056'yı yeniden yazın.
2. **B02 / AU03:** Dibbits alıntısıyla ilgili yanlış "düzeltmeyi" geri alın. NL bülteni (K14) kaynak olarak eklenmeli.
3. **Q2 / CS02:** Kanıtsız envanter numarası iddialarını gerekçelerden çıkarın.
4. **B03:** Teknik raporun kaynağını düzeltin (1995 sergi kataloğu, Rijksmuseum değil).

**Güçlü biçimde önerilen düzeltmeler:** B04 (C073 ve CS07), B05 (C024), B06 (C055 Cant), B07 (C038 masa), B08 (C058), C022 yeniden yazımı, F1 (Kant–yücelik), F3 (Benjamin–aura).

**İyileştirmeler:** C033 ve C036 için Rijksmuseum hikâye sayfasını (K25) ekleyip A'ya yükseltin. B10 ve B12'deki güncel olmayan süreç notlarını düzeltin. Felsefe kaynaklarında blogları birincil metinlerle değiştirin.

**Güçlü yönler:** Kimlik ve provenance verileri K1 ile birebir uyuşuyor (altı satış fiyatı, numaralar, alıcılar). 2022 bulguları doğru ve dengeli aktarılmış. Tarih tartışması tablosu EV ile birebir uyuşuyor. Tarih hiçbir yerde tek kesin yıl olarak verilmemiş. Wikipedia zincirine dayanan beş iddia E olarak doğru işaretlenmiş ve kesin cevaplı sorulara sokulmamış. Yorum ile olgu ayrımı genel olarak açık.

---

## 9. Sınırlar ve dürüstlük beyanı

- **Erişilemeyen kaynaklar:** Met (K10, 429), Mauritshuis (K23, 403), NGA nesne sayfası (403). K11, K12, K13, K20, K21, Europeana White Paper ve Montias (1989) **açılmadı veya denenmedi**. Bunlara dayanan hiçbir ifade bu raporda "doğrulandı" olarak işaretlenmedi.
- **Okunamayan içerik:** Rijksmuseum "A sexual or lesbian symbol" hikâyesinin yalnız giriş paragrafı okunabildi.
- **Görsel inceleme:** Görsel inceleme 4649×5177'lik IIIF taramasından alınan üç bölge kırpması ve tam karenin küçük boyutuyla sınırlı. Pointillé noktaları ayrıca yakın kırpmayla incelenmedi.
- **Genel bilgi:** Bazı noktalarda genel akademik bilgi kullandım: Kant §16 ve yücelik, Benjamin'in aura tanımı, Vermeer'in başka eserlerindeki hizmetçi figürleri. Bunlar raporda **"genel literatür bilgisi, bu denetimde kaynağı açılmadı"** olarak işaretlendi.
- **Hakem olarak sınırım:** Bu rapor da bir yapay zekâ modelinin çıktısıdır. Bir insan sanat tarihçisinin editoryal onayının yerine geçmez. Özellikle F1–F5 ve B17 bir uzman okumasını gerektirir.
- **İndirilen kaynaklar:** Bu denetimde indirilen kaynak metinleri oturumun geçici çalışma klasöründedir ve depoya eklenmedi.

---

## 10. KANIT_DOSYASI.md ile çapraz kontrol (sonradan eklendi)

KANIT_DOSYASI.md denetimin sonunda iletildi. Yukarıdaki bulgular onun kayıtlarıyla karşılaştırıldı. Hiçbir bulgu geri çekilmedi. Aşağıdakiler bulguları **teyit eden veya ayrıntılandıran** noktalar.

| İddia | KANIT_DOSYASI kaydı | Bu denetimin sonucu |
|---|---|---|
| C056 | "K16 ham ('…introduced a new theme in art'; 'Eroticism' bölümü). **A.**" | KANIT dosyası iki ayrı bölümü birleştirmiş: *Milkmaid* baskısı "Everyday scenes" bölümünde, "Eroticism" bölümü ise *Altın Buzağı* üzerine. **B01 teyit edildi.** C023'ün kaynak listesindeki "K16 (Lucas 1510 + 'Eroticism')" de aynı hatayı taşıyor. |
| C050 | "'Tranquil atmosphere' gerekçesi bülten girişinde isimsiz; **Dibbits alıntısı değil**." K14 bu iddianın kaynakları arasında listelenmiş. | K14'te Dibbits'e atfedilmiş "meer rust en verstilling" alıntısı bulunuyor. Kaynak kayıtlı olduğu halde bu paragraf gözden kaçmış. **B02 teyit edildi.** |
| C055 | "Liedtke cinsel ima ↔ Cant pratik/çalışkanlık. Kaynak: **K7 ham**." | EV'de "Cant" adı hiç geçmiyor. **B06 teyit edildi.** C033, C036 ve C053 kayıtlarında Cant doğru biçimde K6'ya atfedilmiş; tutarsızlık yalnız C055'te. |
| C073 | "K7'de 'sewing basket' yok … Eski ad belirsiz. **E.**" | "Sewing basket" ifadesi için doğru. Ama EV'de "a large, open clothes basket with laundry issuing from it" ifadesi var. Bu "çamaşır sepeti" yorumunu belgeliyor. **B04 teyit edildi:** C073 ikiye ayrılmalı. |
| C024 | "Milkmaid, Vermeer'in **tek emekçi figürlü eseri**; … K7 ham ('…never again turned his attention to a working-class theme.')" | Alıntı ile iddia arasındaki kapsam farkını kayıt kendisi gösteriyor. **B05 teyit edildi.** |
| C038 | "K7 ham ('half of the top of a 17th-century gateleg drop-leaf table…')" | Aynı EV cümlesinin "Based on Keith Cardnell's geometric reconstruction" diye başlayan kısmı kayda alınmamış. Bu yüzden derslere "teknik araştırma gösterdi" ifadesi girmiş. **B07 teyit edildi.** |
| C022 | "K7 'teminat olarak' der; K22 'borcu ödemek için sattı' der." | EV'nin "settled this debt … by giving him a painting" pasajı kayda alınmamış. EV kendi içinde çelişkili. §3'teki C022 değerlendirmesi geçerli. |
| C033, C036 | Kaynak K6 (Cant) + K7. "Görsel yakın teyit yok." | K6'daki ifadeler ("its stains, shadowing, nail and nail hole"; "a crack in one (fourth row from the bottom, far …") bu denetimde birebir bulundu. Ek olarak Rijksmuseum'un kendi hikâye sayfası ("The crack in the window and the mould on the wall") birincil destek sağlıyor. Seviye A'ya yükseltme önerisi geçerli. |
| C012 | "K5 (P1071 Q690); müze sayfası yazmıyor, ders 'kabul edilir' der. **B.**" | KANIT kaydı dürüst. Ancak DERS.json'da kaynak olarak K7 de listelenmiş ve EV'de karşılığı yok. Tek açık dayanak Wikidata olduğundan **B yerine B-/kısmen** (kural 5). |
| C075 | `gorseller/k/7ad9f577dbcabf65.jpg`, 356×400 | Bu denetimde dosya açıldı: 356×400 px JPEG ve aynı eser. **Doğrulandı** (yukarıda D→T düzeltildi). |
| §3 Görsel kayıt | Cupid, çatlak cam, çivi ve pointillé "yakın kırpmayla doğrulanamadı" | Bu denetimde 4649 px'lik taramadan bölge kırpmaları alındı. Çivi ve delikler ile Cupid konumundaki figür görüldü; yay ayırt edilemedi. Stoofjenin içinde **kırmızı bir toprak kap** görülüyor; "köz parıltısı" net değil (B13). |
| §4 Seviye tablosu | C056 = A; C035 = A | Bu denetime göre C056 **yanlış**. C035'in "köz parıltılı" kısmı görselle desteklenmiyor, bu yüzden A seviyesi uygun değil. |

**Sonuç:** KANIT_DOSYASI erişim günlüğü ve ayrıntı düzeyi bakımından özenli. Hataların çoğu **kaynak açıldığı halde ilgili cümlenin yanlış okunması veya eksik alıntılanması**ndan kaynaklanıyor (C056, C050/K14, C055, C073, C038), erişimsizlikten değil. Bu, üçüncü taraf okumanın neden gerekli olduğunu gösteriyor. §8'deki yayına uygunluk kararı değişmedi.
