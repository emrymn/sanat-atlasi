# Sanat Atlası · tasarım dili

Emre'nin onayladığı görünüm (Kasım 2026; İş 188 başyapıt sayfası, İş 189 Galeri ve Çalış). Yeni bir ekran ya da
yeniden tasarım bu dille yapılır. Tasarım tuvali: https://claude.ai/artifact/NkH1KK1pdMwRkY7XqZp7nz

Emre'nin yönlendirmeleri (sırasıyla): "bütüncül olsun, ayrık durmasın" · "çok robotik olmuş, daha Apple tarzı, elegant"
· "siyah arka plan çok sade; uygulamadaki arka planı koy" · "Akımlar'daki sembolleri kastettim" · "daha silik yap,
yazıyı okumayı zorlaştırıyor; hale güzel oldu" · "Galeri ve Çalış'ı da bu dille yap".

## İlke

- **Tablo önce gelir.** Ekranın kahramanı bir resimdir: kenardan kenara kapak ya da büyük yuvarlak kart. Arayüz geri
  çekilir.
- **Tek akış, numarasız.** "BÖLÜM 1 / 5", sıra numaralı halkalar, Roma rakamlı başlıklar yok. Okuma hikâye gibi akar;
  ayrıntılar metnin anlattığı yerde araya girer.
- **Ekranda tek dolu düğme.** Asıl eylem açık renkli (Gece'de krem, Gündüz'de koyu) hap düğmedir: "Salona gir",
  "Gör adımını aç", "Okumayı sürdür". Diğer eylemler cam ya da düz yazıdır.
- **Büyük harfli, harf aralıklı etiket yok.** Üst yazılar küçük ve cümle düzeninde: 13 px, yarı kalın, pirinç
  ("Bugünün dersi", "XIII–XV. yüzyıl", "Öne çıkan · Kuzey Rönesansı").
- **Az şey, çok boşluk.** Bölümler arası 36–44 px. Bilgi tekrarı yok (ör. sayaç zaten varsa "4 / 28 salon açık" etiketi
  kalkar).

## Zemin

Her sayfada aynı üç katman (`sayfaZemini(donem)`, `js/ekranlar/ortak.js`; başyapıt sayfası kendi kurar):

1. **Kömür zemin ve ince nokta dokusu** (tema değişkenleri: `--bg`, `--doku`).
2. **Hale:** tablonun rengi (`--vurgu-rgb`), sol üstte güçlü, sağ altta soluk; sayfayla kaymaz (`.hale.bsy-hale`,
   `position: fixed`). Emre: "hale güzel oldu".
3. **Dönemin sembolleri:** Akımlar çarkının 96×96 desen karoları (Orta Çağ dörtyaprak, Rönesans daire içinde kare ve
   zambak, Barok akantus…), **çok silik**: Gece %4, Gündüz %4,5 (`.bsy-desen[data-donem]`). Daha belirgini okumayı
   zorlaştırdı. Dönem eserden ya da akımdan gelir (`akiminDonemi`), sayfa içinde değişince yumuşakça geçer
   (`zeminDonemi`).

## Yazı

| Rol | Yazı tipi | Boy |
|---|---|---|
| Sayfa ve kart başlığı | Bodoni Moda (`--serif`), 500, harf aralığı −0,01 em | 34–40 px (kapak), 28 px (bölüm), 22–24 px (kart) |
| Okuma metni | Newsreader (`--okuma`) | 18 px / 28–29 px satır |
| Arayüz, üst yazı, açıklama | Archivo (`--sans`) | 13–16 px |

Açıklama ve ikincil yazı `--ink-2`. Sistem yazı tipine (SF, New York) geçilmedi: uygulamanın üçlüsü korunur.

## Renk

Yalnız tema değişkenleri (`css/app.css` başı): `--bg`, `--surface`, `--border`, `--ink`, `--ink-2`, `--overlay-btn`,
`--tab-bg`, `--pirinc` (tek sabit vurgu), `--right`, `--wrong`. Kod içine renk yazılmaz; iki tema (Gece, Gündüz)
birlikte denetlenir. Gündüz'de gölgeler hafif (`rgba(var(--golge-rgb), 0.12)`).

## Bileşenler

- **Cam öğe** (üstteki geri/kalp, arama, sekme kabı, alttaki "Yakından bak", sözlük kartı): `border: 1px solid
  var(--border)`, `background: var(--overlay-btn)` ya da `var(--tab-bg)`, `backdrop-filter: blur(24px) saturate(1.6)`,
  tam yuvarlak.
- **Bölüm sekmeleri:** tek cam kap içinde yazılı sekmeler; seçili olan dolu (`--ink` zemin, `--bg` yazı). İkon hapı yok.
- **Alt seçimler** (dönemler): alt çizgili yazı sekmeleri, seçili olanın altında 2 px pirinç çizgi.
- **Kart:** `--surface`, köşe 24–28 px, ince kenar; kapak kartında resim üstte, alta doğru zemine eriyen gölge.
- **Gruplu liste:** satırlar tek kart içinde, aralarında ince çizgi (ayrı ayrı kutular değil). Sağda durum yazısı
  ("Bugün" pirinç, "Sırada" soluk).
- **İlerleme:** halka ve numara yerine ince (3 px) çizgiler; süren pirinç, biten yeşil.
- **Kırpım:** ayrıntı görselleri köşesi 18–22 px kutularda, resim kutuyu boşluksuz doldurur; sağ altta küçük cam
  büyüteç.
- **Cam çubuk:** sayfa başlığı ekrandan çıkınca üstte belirir (ortada başlık; `.bsy-cubuk`).
- Dokunma hedefi en az 44 px; telefon genişliği 390 px, yatay kaydırma yok.

## Yapma

Bölüm numaraları ve "1 / 5" sayaçları; büyük harfli harf aralıklı etiketler; aynı ekranda birden çok dolu düğme;
sol kenarlı renkli kutular; emoji; renk geçişli büyük zeminler; belirgin desen.
