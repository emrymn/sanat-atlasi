# Tasarım B · "Önce en çok kullanılan" — yeni düzen taslağı

Bu dosya v0 (ya da başka bir uygulayıcı) için yeni bilgi mimarisinin taslağıdır. Görsel üslup (renkler, yazı tipleri, Tuval'in kenardan kenara resmi, Yolculuk haritası) **değişmiyor**. Değişen şey: neyin nerede, hangi sırayla ve ne kadar büyük göründüğü.

Yanındaki `taslak.html` (ve resmi `taslak.jpg`) aynı düzenin 390×844 kaba çizimleridir. Tel kafestir: örnek sanatçı, sayılar ve rozetler temsilî.

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
| **1 · Her gün** | Her açılışta | Günün resmi · Bugünkü tur (başlat / yarım kalanı sürdür) | Açılış ekranının ilk görünen alanında, **0 dokunuş / 1 dokunuş**. Büyük düğme, başparmak alanında. |
| **2 · Her oturum** | Çoğu açılışta | Günün sanatçısını tanı · Bu resmin hikâyesi / rehberli incelemesi · Kursta sıradaki konu ("İşlendi yap") · Arama | İlk ekranda ya da bir kaydırma altında; Keşfet'in en üstünde. **1 dokunuş**. |
| **3 · Haftalık** | Arada bir | Harita · Akımlar · Başyapıtlar · Konular · Zaman çizelgesi · Akım/sanatçı karşılaştır · Diğer turlar (hatalar, bölüm, konu, dönem) · Koleksiyon | Kendi sekmelerinde, şerit ve kart olarak. **2 dokunuş**. |
| **4 · Nadir** | Ayda bir | İstatistikler (doğruluk, zayıf sanatçılar, karıştırdıkların) · Ayarlar · Yedekle/geri yükle · Günün resimleri ve elle odak · Sürüm · Hata günlüğü | Bugün'ün sağ üstündeki **"Ben"** düğmesinden açılan sayfada. |

Kural: bir şey bir katman aşağı indiğinde **kaybolmaz**, sadece küçülür ve bir dokunuş uzaklaşır.

## 3. Gezinme

Alt çubuk 4 sekme. Ad, ne yaptığını söyler (ikonlar mevcut ikon ailesinden).

| Sekme | Adres | Eski karşılığı | İçerik |
|---|---|---|---|
| **Bugün** | `#/` | Tuval | Günün resmi + bugünkü iş |
| **Yolculuk** | `#/harita` | Yolculuk + Defter'in kurs kısmı | Harita ve kurs ilerlemesi tek yerde |
| **Keşfet** | `#/gozat` | Galeri | Arama + yatay şeritler |
| **Çalış** | `#/pekistir` | Atölye | Bugünkü tur + diğer turlar |

- **Ben** (`#/ilerleme`) sekme değil; Bugün'ün sağ üstünde yuvarlak düğme. İstatistikler, koleksiyon, ayarlar burada.
- Adresler aynı kalır (testler ve ana ekran kısayolu bunlara bağlı). Yalnız sekme etiketleri ve sekme–sayfa eşlemesi değişir (`js/ekranlar/ortak.js` → `sekmeleriCiz`, `js/ekranlar/yonlendirme.js` → `rotalar`).
- Alternatif (Emre seçecek): şiirsel adlar kalsın (Tuval / Yolculuk / Galeri / Atölye) ama her birinin altında küçük açıklama satırı olsun.

## 4. Ekranlar

### 4.1 Bugün (`#/`) — en önemli ekran

İlk görünen alan (kaydırmadan, 390×844):

```
┌──────────────────────────────┐
│ GÜNÜN SANATÇISI   9 Kasım (●)│  ← (●) = Ben düğmesi (44 px)
│                              │
│      [ tablo, kenardan       │
│        kenara, bugünkü       │
│        gibi ]                │
│                              │
│   Michelangelo               │  ← ad + imza (bugünkü gibi)
│   Delfi Sibili · 1509        │  ← YENİ: eserin adı ve yılı
│                              │
│ ┌──────────────────────────┐ │
│ │ ▶ Bugünkü tur    8 kart  │ │  ← Katman 1, birincil düğme
│ │   0 tekrar · 8 yeni      │ │     yarım tur varsa: "Kaldığın yerden · 5/20"
│ └──────────────────────────┘ │
│ ┌────────────┐┌────────────┐ │
│ │ Bu resmin  ││ Michelangelo│ │  ← Katman 2, iki ikincil düğme
│ │ hikâyesi   ││ 'yu tanı    │ │     sol: hikâye > rehberli inceleme > "Resme bak"
│ └────────────┘└────────────┘ │
│ [Bugün] [Yolculuk] [Keşfet] [Çalış] │
└──────────────────────────────┘
```

- Sol ikincil düğme, eldeki en zengin şeyi açar: **Hikâyesi** varsa o, yoksa **Rehberli inceleme · N nokta**, o da yoksa resmi tam ekran görüntüleyicide açar.
- Kaydırınca (ikinci ekran), sırasıyla:
  1. **Kursta sıradaki konu** kartı: "Konu 12 · Medici ve Rucellai sarayları · 3 sanatçı açılacak · [İşlendi yap]" (bugün Defter'de).
  2. **Kısa özet şeridi:** açık sanatçı · bugün n/20 · doğruluk (bugün en dipte duran üçlü).
  3. **Günün sanatçısından 6 eser** (yatay şerit) + "Tümü (45)".
- **Biyografi Bugün'den kalkar**; "Michelangelo'yu tanı" düğmesiyle açılan `#/gunun` sayfasında durur (bugünkü haliyle).
- Hareketi aç düğmesi resmin üstünde küçük ikon olarak kalır.

### 4.2 Keşfet (`#/gozat`)

```
┌──────────────────────────────┐
│ Keşfet                       │
│ [ 🔍 Sanatçı, eser, konu ara ]│  ← her zaman en üstte
│                              │
│ Hikâyesi olan resimler    → │  ← yatay şerit, büyük kartlar
│ [■][■][■]                    │
│ Rehberli inceleme         → │
│ [■][■][■]                    │
│ Akımlar (29)              → │  ← dönem sırasıyla küçük kartlar
│ [■][■][■][■]                 │
│ Konular · İncil, mitoloji → │
│ Zaman çizelgesi           → │  ← tek geniş kart
│ Karşılaştır               → │  ← "İki akımı / iki sanatçıyı yan yana koy"
│ Koleksiyonun (n)          → │
└──────────────────────────────┘
```

- Her şerit başlığı (→) tam listeyi açar: bugünkü `#/gozat` akım listesi, `#/basyapitlar`, `#/konular`, `#/zaman`, `#/koleksiyon`.
- Kilitli akımlar şeritte de soluk ve "Konu N'de açılır" yazılı (bugünkü kural).

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
- Böylece "işlendi yap" hem Bugün'de (sıradaki konu kartı) hem Yolculuk'ta olur; Defter sekmesine gerek kalmaz.

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

1. **Bugün ilk ekranı** (4.1): üç düğme + kaydırınca sıradaki konu, özet, eser şeridi. En çok kazanç burada.
2. **Sekme çubuğu** (3): 4 sekme, yeni adlar, Ben düğmesi.
3. **Keşfet** (4.2): arama + şeritler.
4. **Çalış** (4.3): tek odaklı tur kartı + 2×2 diğer turlar.
5. **Yolculuk kurs paneli** (4.4) ve **Ben** (4.5).
6. **Rozetler** (4.6).
