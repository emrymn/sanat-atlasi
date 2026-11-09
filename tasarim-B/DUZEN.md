# Tasarım B · "Önce en çok kullanılan" — yeni düzen taslağı

Bu dosya v0 (ya da başka bir uygulayıcı) için yeni bilgi mimarisinin taslağıdır. Görsel üslup (renkler, yazı tipleri, Tuval'in kenardan kenara resmi, Yolculuk haritası) **değişmiyor**. Değişen şey: neyin nerede, hangi sırayla ve ne kadar büyük göründüğü.

Güncel kararlar: Bugün için `ana-c.html`'deki C1, sekmeler için 3. bölüm. `taslak.html` (ve `taslak.jpg`) ilk taslaktır; Bugün ekranı ve 4 sekme orada eskidir, diğer ekranların yerleşimi geçerli. Bütün çizimler 390×844 tel kafestir: örnek sanatçı, sayılar ve rozetler temsilî.

## 1. Sorun

Uygulamada çok özellik var ama çoğu kaydırmanın ya da bir sayfaya girmenin arkasında:

- **Tuval** açılışta yalnız resim gösterir. Altında uzun biyografi ve 45 eser var; "bugün 0/20", açık sanatçı sayısı gibi asıl işe yarayanlar sayfanın en dibinde.
- Sekme adları (Tuval, Yolculuk, Galeri, Atölye, Defter) ne işe yaradıklarını söylemiyor.
- **Rehberli inceleme** ve **Hikâyesi** ancak başyapıt sayfasında resmi büyütünce çıkıyor; hangi resimde olduklarını önceden görmenin yolu yok.
- Karşılaştır, sesli telaffuz, koleksiyon, konu turu, hatalar turu, zaman çizelgesi birer sayfanın içine gömülü.
- **Atölye** beş çalışma türünü aynı uzun sayfada üst üste diziyor.
- **Defter** ile **Yolculuk** ikisi de "kursun neresindeyim" sorusuna cevap veriyor. Ayarlar Defter'in köşesindeki küçük dişlide.

## 2. Önem sırası (görünürlük buna göre)

Her özellik bir katmanda. Katman ne kadar üstteyse o kadar az dokunuşla ve o kadar büyük görünür.

| Katman | Ne sıklıkla | Özellikler | Nerede, nasıl |
|---|---|---|---|
| **1 · Her gün** | Her açılışta | Günün resmi · Bugünkü tur (başlat / yarım kalanı sürdür) | Resim açılışta, **0 dokunuş**. Tur: Çalış sekmesindeki sayı rozetiyle her ekranda görünür, **1 dokunuş**. |
| **2 · Her oturum** | Çoğu açılışta | Günün sanatçısını tanı · Bu resmin hikâyesi / rehberli incelemesi · Kursta sıradaki konu ("İşlendi yap") · Arama | Bugün'deki üç tek kelimelik düğme; Yolculuk'un üstündeki rozet; Galeri'nin en üstü. **1 dokunuş**. |
| **3 · Haftalık** | Arada bir | Harita · Akımlar · Başyapıtlar · Konular · Zaman çizelgesi · Akım/sanatçı karşılaştır · Diğer turlar (hatalar, bölüm, konu, dönem) · Koleksiyon | Kendi sekmelerinde, şerit ve kart olarak. **2 dokunuş**. |
| **4 · Nadir** | Ayda bir | İstatistikler (doğruluk, zayıf sanatçılar, karıştırdıkların) · Ayarlar · Yedekle/geri yükle · Günün resimleri ve elle odak · Sürüm · Hata günlüğü | Bugün'ün sağ üstündeki **"Ben"** düğmesinden açılan sayfada. |

Kural: bir şey bir katman aşağı indiğinde **kaybolmaz**, sadece küçülür ve bir dokunuş uzaklaşır.

## 3. Gezinme

Alt çubuk **5 sekme** (Emre: "illaki 4 olacak diye bir şey yok"; iPhone genişliğinde rahat sığan en çok sayı 5). Ad, ne yaptığını söyler (ikonlar mevcut ikon ailesinden).

| Sekme | Adres | Eski karşılığı | İçerik |
|---|---|---|---|
| **Bugün** | `#/` | Tuval | Günün resmi, sade (4.1) |
| **Yolculuk** | `#/harita` | Yolculuk + Defter'in kurs kısmı | Harita ve kurs ilerlemesi tek yerde (4.4) |
| **Galeri** | `#/gozat` | Galeri | Arama, akımlar, sanatçılar, konular, zaman (4.2) |
| **Başyapıt** | `#/basyapitlar` | Galeri içindeki Başyapıtlar | Hikâyeli ve rehberli resimler, karşılaştır (4.2b) |
| **Çalış** | `#/pekistir` | Atölye | Bugünkü tur + diğer turlar (4.3) |

- **Çalış sekmesinde sayı rozeti:** bugün bekleyen kart sayısı (ör. 8) sekme ikonunun sağ üstünde küçük altın daire. Tur bitince kalkar. Günün işi ana sayfadan kalktığı için görünürlüğü bu rozet sağlar.
- **Ben** (`#/ilerleme`) sekme değil; Bugün'ün sağ üstünde yuvarlak düğme. İstatistikler, koleksiyon, ayarlar burada.
- Adresler aynı kalır (testler ve ana ekran kısayolu bunlara bağlı). Yalnız sekme etiketleri ve sekme–sayfa eşlemesi değişir (`js/ekranlar/ortak.js` → `sekmeleriCiz`, `js/ekranlar/yonlendirme.js` → `rotalar`; `#/basyapitlar` ve `#/basyapit/…` artık 'basyapit' sekmesine bağlı).

## 4. Ekranlar

### 4.1 Bugün (`#/`) — en önemli ekran, en sade ekran

Emre'nin kararı: resim öne çıksın, altında açıklama yazısı olmasın, "devam et / tur" düğmesi olmasın. Çizim: `ana-c.html` / `ana-c.jpg`, **soldaki C1** (Emre seçti; sağdaki C2 uygulanmayacak).

```
┌──────────────────────────────┐
│ 9 KASIM                (Ben) │  ← Ben düğmesi (44 px)
│                              │
│      [ tablo, kenardan       │
│        kenara, bugünkü       │
│        gibi ]                │
│                              │
│   Vermeer                    │  ← ad (imza varsa bugünkü gibi)
│   İnci Küpeli Kız · 1665     │  ← eserin adı ve yılı
│ (❖ Hikâyesi)(◉ İncele)(☉ Vermeer) │  ← üç tek kelimelik düğme, alt satırsız
│ [Bugün][Yolculuk][Galeri][Başyapıt][Çalış•8] │
└──────────────────────────────┘
```

- **Üç düğme**, yarı saydam, 48 px yükseklik, ikon + tek kelime, açıklama satırı yok:
  - **Hikâyesi** → resmin hikâyesi (`js/hikaye.js`). Hikâyesi yoksa düğme hiç görünmez.
  - **İncele** → rehberli inceleme (`eser_ayrintilari.json`). Yoksa görünmez.
  - **<Sanatçının kısa adı>** → `#/gunun` (hayatı, nasıl tanırım, eserleri; bugünkü sayfa).
  - Üçü de yoksa (yalnız sanatçı düğmesi kalır) tek düğme sola yaslanır.
- **Resme dokununca** (düğmelerin dışında) resim tam ekran görüntüleyicide açılır (yakınlaştırma).
- **Aşağı kaydırma yok:** Bugün tek ekran. Biyografi, eser şeridi, özet sayılar ve "sıradaki konu" buradan kalkar:
  - biyografi ve eserler → `#/gunun` (sanatçı düğmesi),
  - özet sayılar → Ben,
  - sıradaki konu ve "İşlendi yap" → Yolculuk'taki kurs paneli (4.4).
- Hareketi aç düğmesi kalkar ya da Ben → Ayarlar'a taşınır (açılış ekranında ek düğme olmasın).
- Ekranın üstünde yalnız tarih ve Ben; "Günün sanatçısı" etiketi kalkar.

### 4.2 Galeri (`#/gozat`)

```
┌──────────────────────────────┐
│ Galeri                       │
│ [ ⌕ Sanatçı, eser, konu ara ]│  ← her zaman en üstte
│                              │
│ Akımlar (29)              → │  ← dönem sırasıyla yatay şerit
│ [■][■][■][■]                 │
│ Konular · İncil, mitoloji → │
│ [■][■][■]                    │
│ Zaman çizelgesi           → │  ← tek geniş kart
│ Koleksiyonun (n)          → │
└──────────────────────────────┘
```

- Her şerit başlığı (→) tam listeyi açar: bugünkü akım listesi, `#/konular`, `#/zaman`, `#/koleksiyon`.
- Kilitli akımlar şeritte de soluk ve "Konu N'de açılır" yazılı (bugünkü kural).

### 4.2b Başyapıt (`#/basyapitlar`) — yeni sekme

```
┌──────────────────────────────┐
│ Başyapıtlar                  │
│ (Hepsi)(Hikâyeli)(İncelemeli)│  ← süzgeç hapları
│                              │
│ Hikâyesi olan resimler    → │  ← büyük kartlı yatay şerit, ❖ rozetli
│ [■][■][■]                    │
│ Rehberli inceleme         → │  ← ◉ N rozetli
│ [■][■][■][■]                 │
│ Karşılaştır               → │  ← "İki akımı / iki sanatçıyı yan yana koy"
│ Bütün başyapıtlar (107)      │  ← bugünkü liste, dönem sırasıyla
└──────────────────────────────┘
```

- Hikâye ve rehberli inceleme şu an en gizli kalan, ama en çok emek verilen özellikler; yeni hikâyeler eklendikçe bu sekme büyür.
- Başyapıt sayfası (`#/basyapit/…`) bugünkü gibi; Hikâyesi ve İncele düğmeleri sayfanın başında, resmin hemen altında.

### 4.3 Çalış (`#/pekistir`)

```
┌──────────────────────────────┐
│ Çalış                        │
│ ┌──────────────────────────┐ │
│ │ 8 kart · ~3 dk           │ │  ← bugünkü tur kartı (bugünkü gibi ama tek odak)
│ │ 0 tekrar · 0 pekiştirme  │ │
│ │ · 8 yeni                 │ │
│ │ [ Turu başlat ]          │ │
│ └──────────────────────────┘ │
│ Günlük hedef  (10)(20)(30)   │
│                              │
│ Diğer turlar                 │  ← 2×2 küçük kart ızgarası
│ [Hatalarım n] [Döneme göre]  │
│ [Bölüm turu ] [Konu turu  ]  │
│                              │
│ Salonlar                     │  ← bugünkü dönem listesi, aşağıda
└──────────────────────────────┘
```

### 4.4 Yolculuk (`#/harita`)

- Harita aynen kalır.
- Üstte yarı saydam küçük bir **ilerleme rozeti**: "9 / 57 konu · Sıradaki: Konu 12". Dokununca alttan **kurs paneli** açılır: bugünkü Defter'deki "Kursun neresindesin" sayısı, sıradaki konu kartı ve konu listesi (işlendi düğmeleriyle).
- "İşlendi yap" artık burada (Bugün sade olduğu için orada yok); Defter sekmesine gerek kalmaz. Sıradaki konu varsa rozetin yanında küçük altın nokta.

### 4.5 Ben (`#/ilerleme`)

Bugünkü Defter sayfasının kurs dışı kısmı:

1. Özet sayılar (sanatçı, kalıcı, tekrar) ve 12 haftalık ızgara
2. Akımlara göre doğruluk · En zayıf sanatçılar · En çok karıştırdıkların
3. Koleksiyon bağlantısı
4. **Ayarlar** (bugünkü `#/ayarlar` sayfasına geçiş; içerik değişmez)

### 4.6 Eser görüntüleyici ve ızgaralar

- **Rozetler:** Hikâyesi olan esere küçük kitap ikonu, rehberli incelemesi olana nokta ikonu. Bütün ızgaralarda ve şeritlerde (sanatçı eserleri, başyapıtlar, koleksiyon) küçük resmin sol alt köşesinde.
- Görüntüleyicide **Hikâyesi** ve **İncele** düğmeleri alt çubukta, başparmak alanında, adlarıyla (yalnız ikon değil).

## 5. Değişmeyecekler

- Renk paleti, temalar (Gece / Sepya / Açık), yazı tipleri, Tuval resmi ve odak/kırpma mantığı, harita çizimleri.
- Bütün `#/…` adresleri.
- Soru ekranları (Pekiştir kartı, cevap sonrası panel) — bu taslağın kapsamı dışında.
- Veri dosyaları ve öğrenme mantığı (Leitner, çeldiriciler, kilit).

## 6. Uygulayıcı için teknik kurallar (v0 dahil)

Bu uygulama **framework'süz** bir PWA: düz HTML + CSS + ES modülleri, **derleme adımı yok**. GitHub'dan doğrudan Cloudflare Pages'e yüklenir.

1. **React, Next.js, Tailwind, npm paketi eklenmez.** Değişiklikler mevcut dosyalarda yapılır: `css/app.css`, `js/ekranlar/*.js`, `index.html`.
2. **`data-test="…"` öznitelikleri silinmez ve adı değiştirilmez.** Uçtan uca testler (`tests/e2e`, 32 dosya) bunlarla çalışır. Bir öğe taşınırsa özniteliğiyle birlikte taşınır.
3. Bütün yollar **göreli** (`./`, `js/…`), mutlak `/` yok.
4. Yeni bir dosya eklenirse `sw.js` içindeki `KABUK_DOSYALARI` listesine de eklenir. Her yayında `sw.js` ve `js/surum.js` içindeki `SURUM` birlikte artırılır, `js/yenilikler.js`'e Türkçe bir satır eklenir.
5. `js/app.js` 150 satırı geçmez (test denetler).
6. Dokunma alanları ≥ 44 px, gövde yazısı ≥ 17 px, alt sekme çubuğu ve düğmeler `env(safe-area-inset-bottom)`'a uyar, 390 px genişlikte yatay kaydırma yok.
7. Bütün arayüz metni **Türkçe**.
8. PR açıldığında GitHub'daki **Testler** çalışır; yeşil olmadan birleştirilmez. Yerelde: `npm run test:unit` ve `npm run test:e2e`.

## 7. İş sırası (her biri ayrı küçük PR)

1. **Bugün** (4.1): sade tek ekran, üç tek kelimelik düğme. Biyografi ve aşağıdaki bölümler kalkar.
2. **Sekme çubuğu** (3): 5 sekme, yeni adlar, Çalış'ta sayı rozeti, Ben düğmesi.
3. **Galeri** (4.2) ve **Başyapıt sekmesi** (4.2b).
4. **Çalış** (4.3): tek odaklı tur kartı + 2×2 diğer turlar.
5. **Yolculuk kurs paneli** (4.4) ve **Ben** (4.5).
6. **Rozetler** (4.6).
