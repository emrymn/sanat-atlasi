# Tasarım B · Öneriler (Aşama 1, Fable)

Uygulamanın bütün ana ekranlarını 390×844'te gezdim (Bugün, Yolculuk ve durak penceresi, Galeri, Başyapıtlar, Atölye, Defter, Ayarlar, günün sanatçısı, zaman çizelgesi, konular, soru ve cevap ekranları, `deneme/yuruyus.html`). Bu dosya öneriyi anlatır; kod yazılmadı.

**Çizimler:** `tasarim-B/oneri-01 … 11` (her birinin `.html` ve `.jpg` hali var). Telefonda `.jpg`'lere bak; `.html`'leri açarsan animasyonları da görürsün ve düğmelerle çizimler arasında gezebilirsin. Sayılar ve rozetler temsilîdir.

| Çizim | Ekran |
|---|---|
| `oneri-01-bugun` | Bugün, açılış |
| `oneri-02-yuruyus` | Resmin içinde yürüyüş |
| `oneri-03-yuruyus-sonu` | Yürüyüşün sonu: Hayatı ve bugünkü tur |
| `oneri-04-yolculuk` | Harita, yeni duraklar ve kurs rozeti |
| `oneri-05-durak` | Durak penceresi, seviyeler |
| `oneri-06-seviye-tamam` | Seviye tamamlandı (ödül anı) |
| `oneri-07-galeri` | Galeri |
| `oneri-08-soru` | Soru |
| `oneri-09-cevap` | Cevap anı |
| `oneri-10-calis` | Çalış |
| `oneri-11-tasarim-dili` | Yazı, renk, boşluk, hareket, ikonlar |

## 1. Özet

Uygulama bugün de özenli görünüyor; eksik olan "pahalı" his üç yerden geliyor:

1. **Her ekranda çok fazla küçük şey var.** Büyük harfli küçük etiketler, ince çerçeveli kutular, üst üste bilgi satırları. Müze duvarı gibi olmalı: bir resim, bir başlık, bir iş.
2. **Okuma metni Bodoni ile yazılı.** Bodoni büyük başlıkta çok güzel, 17 px'te ince çizgileri kayboluyor ve yoruyor (yürüyüş kartları, Hayatı, notlar).
3. **Hareket parça parça.** Güzel anlar var ama ekranlar birbirine bağlanmıyor; ödül anı (seviye bitti, doğru cevap) sönük.

Önerinin özü: **resim her zaman sahne, arayüz onun önünde sessiz bir vitrin.** Tek sabit vurgu rengi (pirinç), iki rollü yazı, her ekranda tek ana iş, ekranları birbirine bağlayan yavaş ve yumuşak hareket.

## 2. Tasarım dili (`oneri-11-tasarim-dili`)

- **Yazı.** Bodoni Moda yalnız 24 px ve üstünde (sanatçı adı, ekran başlığı, büyük sayılar). Okuma metni için yeni bir yazı: **Newsreader** (Türkçe harfleri tam, küçük boyda rahat okunur; eser adları italik). Düğme, şık ve listeler Archivo'da kalır. Büyük harfli küçük etiket ekran başına en çok bir iki tane.
- **Renk ve ışık.** Zemin ve yazı renkleri aynı kalır. Yeni olan: **tek sabit vurgu, pirinç (#C9A45C)**: ilerleme, yıldız, mühür ve ana düğme hep bu renk. Tablodan alınan renk artık düğme rengi olmaz; onun yerine her ekranın arkasında o anki eserin bulanık ışığı durur (soru, cevap, ödül, Çalış kartı). Böylece renk yine tablodan gelir ama arayüz her tabloda aynı kalır. Gündüz temasında pirincin koyusu kullanılır.
- **Boşluk.** 4'ün katları (4, 8, 12, 16, 24, 32, 48); kenar boşluğu 24. Listeler kutusuz, satır arası tek ince çizgi; kart yalnız dokunulabilen büyük şeylere.
- **Köşe.** Kart 16, alttan açılan pencere 28, düğmeler tam yuvarlak ve 58 px yüksek (başparmak için).
- **İkonlar.** Tek aile, 1,6 kalınlıkta çizgi; etkin olan pirinç.
- **Dokunuş.** Her düğme basınca hafifçe küçülür (0,97), bırakınca döner; doğru cevapta tek kısa, yanlışta çift titreşim (mevcut titreşim ayarına uyar).

## 3. Gezinme: 4 sekme + Ben

**Önerim 5 değil 4 sekme: Bugün · Yolculuk · Galeri · Çalış.** Ben, Bugün'ün sağ üstünde kalır.

Başyapıt'ı ayrı sekme yapmamamın nedeni: Başyapıtlar da "bakılacak resimler"; Galeri'den ayrı durunca iki sekme aynı işi görüyor ve Emre her seferinde "hangisindeydi" diye düşünecek. Onun yerine Başyapıtlar **Galeri'nin en üstündeki büyük raf** oluyor (`oneri-07`), hikâyesi ve incelemesi olanlar üstlerinde adıyla rozet taşıyor. Hikâye ve inceleme ayrıca her gün Bugün'de zaten öne çıkıyor. 4 sekmede dokunma alanları büyür, çubuk sakinleşir. (5 sekme istersen bu madde tek başına "hayır" denebilir; diğerleri etkilenmez.)

Gizli kalan özellikler nerede çıkıyor:

| Özellik | Yeni yeri |
|---|---|
| Hikâye, rehberli inceleme | Bugün'ün düğmeleri; Galeri'de Başyapıtlar rafı ve bütün küçük resimlerde rozet |
| Karşılaştır | Galeri'deki dörtlü kısayol; yanlış ya da doğru her cevaptan sonra "Karşılaştır: A ↔ B" satırı |
| Sesli telaffuz | Yürüyüşün sonundaki "Adını dinle"; sanatçı sayfasının başı |
| Koleksiyon, Konular, Zaman çizelgesi | Galeri'de dörtlü kısayol (tek dokunuş) |
| Konu turu, bölüm turu, hatalar | Çalış'ta "Başka turlar" 2×2 |
| Kurs ilerlemesi, "İşlendi yap" | Yolculuk'un üstündeki rozet |
| İstatistik, ayarlar, yedek | Ben |

## 4. Ekran ekran

### 4.1 Bugün (`oneri-01`, `02`, `03`)
- **Açılış** onayladığın C1 ile aynı düzen: kenardan kenara resim, altta ad, eser, yıl, üç tek kelimelik düğme, küçük ok. Fark: eser adı Newsreader italik; düğme ikonları pirinç; tarihin yanında gün adı.
- **Yürüyüş** prototipteki davranış aynen. Farklar: kart metni Newsreader 18; sağda ince pirinç çizgilerle nerede olduğun (yazı yok, sayı yok); **yürürken sekme çubuğu aşağı kayıp kaybolur**, yukarı kaydırınca ya da sonda geri gelir. Böylece resim gerçekten bütün ekranı kaplar.
- **Yürüyüşün sonu = günün işi.** Hayatı bittikten sonra sayfa boşlukta bitmez: "Vermeer'i gezdin." ve hemen altında pirinç **Bugünkü tur · 8 kart** düğmesi; altında sanatçının eserleri, "Nasıl tanırım?" ve "Adını dinle". Tur yine Çalış sekmesindeki rozetten de açılır; ama doğal akış "bak, oku, sonra çalış" olur. Açılış ekranına tur düğmesi koymuyorum (kararın duruyor).

### 4.2 Yolculuk (`oneri-04`, `05`, `06`)
Harita, patika ve gezginler aynen kalır. Değişen seviye tasarımı:
- **Duraklar yuvarlak madalyon** olur: çevresindeki pirinç halka o durağın ne kadarının bittiğini gösterir, altında üç küçük yıldız. Biten durak dolu pirinç ve tik; sıradaki durağın halkası yavaşça nabız gibi atar ve yanında gezgin durur; kilitli durak soluk ve kilitli.
- **Sıradaki durağın altında küçük bir etiket**: "Gotik · 2. bölüm · Kolay · 8 soru seni bekliyor". Haritaya girince ne yapacağın yazılı.
- **Üstte kurs rozeti**: "9 / 57 konu · Sıradaki: Konu 12" ve yanında "İşlendi yap". Dokununca konu listesi alttan açılır (DUZEN 4.4 ile aynı).
- **Durak penceresi** bir merdiven: Tanış → Kolay (I) → Orta (II) → Zor (III), aralarında dikey çizgi. Bitenler pirinç, sıradaki vurgulu, kilitliler neden kilitli olduğunu söyler. Altta tek büyük düğme: "Kolay'a başla". Her seviye bir yıldız verir.
- **Seviye tamamlandı ekranı** (yeni): halka çizilir, seviyenin Roma rakamlı pirinç mührü "basılır", yıldızlar sırayla gelir, sayılar sıfırdan sayarak yükselir, "Orta seviye açıldı" satırı belirir. Düğmeler: Harita / Orta'ya geç. Haritaya dönünce gezgin patikadan bir sonraki durağa yürür ve madalyon halkası dolar.
- **Dönem bitince** (bütün duraklar üç yıldız): haritanın o bölümü üzerinde aynı mühür büyük halde ve bir sonraki döneme kamera kayışı.

### 4.3 Galeri (`oneri-07`)
İlk görünen alan: arama, **Başyapıtlar** rafı (büyük kartlar, rozetli), **Akımlar** şeridi (kilitliler soluk, "Konu N'de açılır"), altında dört kısayol: Konular, Zaman, Karşılaştır, Koleksiyon. Bugünkü dört haplı (Akımlar/Başyapıtlar/Konular/Zaman) üst menü kalkar; hepsi aynı sayfada görünür.

### 4.4 Soru ve cevap (`oneri-08`, `09`)
Öğrenme mantığı ve soru türleri aynı; yalnız görünüm.
- **Soru:** arka planda eserin bulanık ışığı, resim ortada gölgeli bir tablo gibi; üstte parça parça ilerleme çizgisi; şıklar 72 px yüksek, başparmak bölgesinde; "Bilmiyorum" en altta.
- **Cevap:** resim küçülüp sola çekilir, sağında sonuç (tik çizilir), sanatçı, eser, akım. Altında **Leitner kutuları altı nokta** olarak görünür; kazanılan kutu "pıt" diye dolar ve "3. kutu · 7 gün sonra tekrar" yazar (bugün bu bilgi küçük bir yazıda kayboluyor). Sonra "Nasıl tanırım?" (Newsreader), "Karşılaştır" satırı; altta Sanatçı / sıradaki soru.
- **Yanlış cevapta** aynı düzen, kırmızı çarpı, kutular boşalır, "3–5 kart sonra yine gelecek"; ekran sallanmaz, yalnız seçilen şık bir kez hafifçe titrer.

### 4.5 Çalış (`oneri-10`)
Tek odak: **bugünkü tur kartı** (büyük sayı, yelpaze gibi açılan üç kart, tekrar / pekiştirme / yeni oranını gösteren çizgi, "Turu başlat"). Altında günlük hedef, sonra "Başka turlar" 2×2. Salonlar listesi aşağıda kalır.

### 4.6 Ben, sanatçı sayfası, başyapıt sayfası, ayarlar
Çizmedim; aynı dille yeniden giydirilir: başlık Bodoni, metin Newsreader, kutular yerine çizgili satırlar, ana düğme pirinç. Ben'in ilk alanı: üç büyük sayı (sanatçı, kalıcı, tekrar) ve 12 haftalık ızgara; altında Koleksiyon ve Ayarlar satırları. İçerik ve sıra DUZEN 4.5'teki gibi.

## 5. Hareket (her biri Tam / Sade / Kapalı ayarına ve sistemin "hareketi azalt"ına uyar)

| An | Ne olur | Süre |
|---|---|---|
| Uygulama açılışı | Resim hafif yakından uzaklaşarak yerine oturur; ad, eser ve düğmeler alttan sırayla gelir | 2,6 sn resim, 0,9 sn yazılar |
| Yürüyüş | Kamera ayrıntıya kayar ve yakınlaşır; kart kamera durmak üzereyken belirir | 1,8–2,8 sn |
| Sekme değişimi | Eski ekran solar, yenisinin öğeleri 16 px aşağıdan sırayla gelir | 0,45 sn |
| Resme dokunma (ızgara → eser) | Küçük resim büyüyerek yeni ekranın resmi olur | 0,45 sn |
| Alttan pencere (durak, kurs) | Aşağıdan kalkar, satırlar sırayla gelir; aşağı çekince kapanır | 0,7 sn |
| Soru gelişi | Resim sağdan bir kart gibi kayar, şıklar sırayla | 0,7 sn |
| Cevap | Resim küçülür; tik çizilir; Leitner noktası dolar | 0,7 sn |
| Seviye tamam | Halka çizilir, mühür basılır, yıldızlar tek tek, sayılar sayar | 2,5 sn toplam |
| Harita | Gezgin patikadan yürür; sıradaki durak nabız gibi atar | 2,6 sn yürüyüş |
| Sayılar | Çalış'taki 8, Ben'deki sayılar sıfırdan sayarak gelir | 0,8 sn |

Hepsi yalnız kaydırma, ölçek ve saydamlıkla yapılır (iPhone'da takılmaz). **Sade:** geçişler ve cevap anı kalır; sürekli atan, yaylanan, sayan her şey durur. **Kapalı:** yalnız 0,15 sn'lik solma.

## 6. iPhone hissi
- Ana iş her ekranda alttaki 58 px'lik düğmede; kapatma ve Ben üstte (seyrek kullanılır).
- Sekme çubuğu yüzen, yarı saydam; yürüyüşte, soruda ve ödül ekranında yok.
- Alttan açılan pencereler aşağı çekilerek kapanır; ekranın sol kenarından kaydırma geri götürür (mevcut davranış korunur).
- Güvenli alanlar: üstte tarih ve Ben çentiğin altında, altta düğmeler ana ekran çizgisinin üstünde.
- Gece varsayılan; Gündüz'de aynı düzen, kâğıt zemin, koyu pirinç. Tam ekran resimli ekranlar (Bugün, yürüyüş, görüntüleyici) her temada koyu kalır.

## 7. Senin beğendiklerinden değiştirdiklerim ve nedeni
- **5 sekme yerine 4** (bölüm 3). Tek gerçek ayrılık bu.
- **Yürüyüşte sekme çubuğunun gizlenmesi**: prototipte çubuk duruyor; resmin alt kısmındaki ayrıntıları (Vermeer'deki meyve tabağı gibi) kapatıyor.
- **Yürüyüşün sonuna tur düğmesi**: açılışa koymadım, kararın duruyor; yalnız sonda.
- Geri kalan (C1 açılışı, yürüyüş davranışı, etiketsiz kartlar, ok, Hayatı, harita, Ben, 145 sanatçı kuralı, elle odaklar) aynen.

## 8. Maddeler, önem sırasıyla

Maliyet: küçük (yarım gün) · orta (1–2 gün) · büyük (3+ gün).

| # | Madde | Maliyet | Onay? |
|---|---|---|---|
| 1 | Bugün yürüyüşü uygulamaya taşınır (prototip davranışı, Newsreader kartlar, sağda konum çizgileri) | büyük | evet / hayır |
| 2 | Yürüyüşte sekme çubuğu gizlenir | küçük | evet / hayır |
| 3 | Yürüyüşün sonu: "gezdin" + Bugünkü tur + eserler, nasıl tanırım, dinle | orta | evet / hayır |
| 4 | Günün ressamı 145 sanatçıyla sınırlanır | küçük | evet / hayır |
| 5 | Tasarım dili: Newsreader okuma yazısı, pirinç tek vurgu, boşluk ve köşe ölçüleri, kutu yerine çizgi (bütün ekranlar) | büyük | evet / hayır |
| 6 | 4 sekme (Bugün, Yolculuk, Galeri, Çalış) + Ben düğmesi + Çalış rozeti | orta | evet / hayır (hayır = 5 sekme, Başyapıt ayrı) |
| 7 | Soru ve cevap ekranlarının yeni görünümü, Leitner noktaları | orta | evet / hayır |
| 8 | Harita: madalyon duraklar, yıldızlar, sıradaki durak etiketi | orta | evet / hayır |
| 9 | Durak penceresi: seviye merdiveni | orta | evet / hayır |
| 10 | Seviye tamamlandı ekranı ve haritada gezginin yürüyüşü | orta | evet / hayır |
| 11 | Çalış: tek odaklı tur kartı + Başka turlar 2×2 | orta | evet / hayır |
| 12 | Galeri: Başyapıtlar rafı, Akımlar şeridi, dörtlü kısayol | orta | evet / hayır |
| 13 | Yolculuk'ta kurs rozeti ve konu paneli ("İşlendi yap" buraya) | orta | evet / hayır |
| 14 | Hikâye / inceleme rozetleri bütün küçük resimlerde; görüntüleyicide adlı düğmeler | küçük | evet / hayır |
| 15 | Ortak hareket: sekme geçişi, resmin büyüyerek açılması, alttan pencereler, sayıların sayması, dokunuş tepkisi | büyük | evet / hayır |
| 16 | Ben, sanatçı, başyapıt ve ayarlar sayfalarının yeni dille giydirilmesi | orta | evet / hayır |
| 17 | Dönem tamamlandı kutlaması (haritada büyük mühür, sonraki döneme kayış) | küçük | evet / hayır |

Hepsine evet dersen sıra: 1–4 (Bugün), 5–6 (dil ve sekmeler), 7, 8–10 (harita), 11–13, 14–17. Her grup ayrı commit; her grupta Vercel önizlemesinden deneyebileceğin bir ara durum olur.

## 9. Bilmen gerekenler
- Çizimlerdeki büyük resimler uygulamanın kullandığı 1280'lik kopyalardan (`gorsel.noracloud.ai/b/…`) geliyor; `gorseller/k/` içindekiler 400 px olduğu için tam ekranda bulanık kalıyordu. İnternetsiz açarsan `.html`'lerde resim görünmez, `.jpg`'ler her zaman çalışır.
- Çizimlerdeki sayılar (8 kart, 7/8 doğru, 9/57 konu), "Siena'nın zarif çizgisi…" cümlesi ve Hayatı'nın son cümlesi yer tutucudur; uygulamada metinler veri dosyalarından gelir, hiçbirini değiştirmeyeceğim.
- Newsreader yeni bir yazı tipi dosyası demek (Google Fonts'tan, mevcut ikisiyle aynı yoldan; çevrimdışı önbelleğe eklenir). Paket ya da derleme adımı eklenmez.
