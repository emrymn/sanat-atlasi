# Sanat Atlası

Kenney Mencher'in *Art History: Renaissance to 20th Century* kursuyla birlikte büyüyen, kişisel sanat tarihi çalışma uygulaması. iPhone'da ana ekrana eklenen bir **PWA**; sunucu, hesap ya da analiz yok — yalnızca statik dosyalar.

Görünüm: **“Gece galerisi”** (`tasarim-A/TASARIM.md`) — koyu duvar, spot ışığında çerçeveli eserler, altın vurgular. Alttaki sekme çubuğu: **Bugün · Göz At · Pekiştir · İlerleme**.

- **Bugün:** tarih, bekleyen tekrar sayısı, Günün sanatçısı (spot ışığında en bilinen eseri ve duvar etiketi), Pekiştir düğmeleri, son çalıştığın sanatçılar.
- **Göz At:** akımlar kronolojik sırada → sanatçılar → sanatçı sayfası (kenardan kenara eser, notların, “Nasıl tanırım?”, dönem çizelgesi, eser şeridi / “Hepsini gör” galerisi) → tam ekran görüntüleyici (iki parmakla yakınlaştır, kaydırarak eserler arasında geç; resim hiç kırpılmaz).
- **Pekiştir · Döneme göre:** bir akım (ya da “Hepsi, dönem sırasıyla”) seç; “Bu eser kimin?”
- **Pekiştir · Karışık:** tüm açık sanatçılar; her kartta önce “Bu eser kimin?”, sonra “Hangi akım?”. Cevaptan sonra alttan bir yaprak sonucu, kısa bilgiyi ve ipucunu gösterir.
- **İlerleme:** işlediğin konuları “işlendi” yap → o konunun sanatçıları açılır. Akımlara göre doğruluk, en zayıf sanatçılar. Sağ üstteki dişliyle **Ayarlar**.
- **Ayarlar:** günlük kart sayısı, tema (**Gece** varsayılan / Sepya / Açık), görselleri çevrimdışı indirme, yedekle / geri yükle.

Yanlış yaptığın sanatçılar aynı turda 3–5 kart sonra tekrar gelir; sonra Leitner kutularıyla (1, 3, 7, 14, 30 gün) aralıklı tekrar edilir.

## GitHub Pages'te yayına alma

1. GitHub'da depo → **Settings → Pages**.
2. **Source:** *Deploy from a branch* → **Branch:** `main`, klasör **`/ (root)`** → **Save**.
3. 1–2 dakika sonra adres çıkar: `https://<kullanıcı-adın>.github.io/sanat-atlasi/`

Derleme adımı yok; GitHub Pages depo kökünü olduğu gibi sunar. (`.nojekyll` dosyası Jekyll işlemesini kapatır.)

## iPhone'da ana ekrana ekleme

1. iPhone'da **Safari** ile yukarıdaki adresi aç.
2. **Paylaş** düğmesi → **Ana Ekrana Ekle** → **Ekle**.
3. Uygulamayı ana ekrandaki **Atlas** simgesinden aç. İlk açılışta İlerleme'de 1–6, 9, 10, 11. konular işaretli gelir.
4. İnternetteyken bir kez açıp birkaç ekranı gezmen yeterli; uygulama kabuğu ve veriler çevrimdışı da çalışır. Görselleri de çevrimdışı istersen **Ayarlar → Görselleri çevrimdışı indir**.

**Yedek:** Ayarlar → **Yedekle** ilerlemeni panoya kopyalar; Notlar'a yapıştırıp sakla. Geri yüklemek için metni **Yedeği geri yükle** kutusuna yapıştır.

**Güncelleme:** Yeni bir sürüm yayınlandığında uygulama “Uygulamanın yeni sürümü hazır” der; **Yenile**'ye dokun.
(1.5.0'dan itibaren üstteki saat/pil çubuğu da koyu sayfanın üstünde durur. iOS bu ayarı ana ekrana eklerken okuduğu için, çubuk hâlâ açık renkli görünürse simgeyi silip yeniden **Ana Ekrana Ekle** yap. Simgeyi silmek ilerlemeyi de siler: önce **Ayarlar → Yedekle**, yeniden ekledikten sonra **Yedeği geri yükle**.)

## Geliştirme

```bash
npm ci                         # yalnızca testler için (@playwright/test)
npm run serve                  # http://localhost:4173/sanat-atlasi/  (Pages alt yolunu taklit eder)
npm run test:unit              # node:test — çeldirici, Leitner, kilit, Wikidata, yedek
npm run test:e2e               # Playwright, 390×844 (iPhone 13); dış istekler fikstürle
node scripts/onbellek.mjs      # data/eserler_onbellek.json'u tüm kaynaklardan yeniden üretir (aşağıya bak)
node scripts/ikonlar.mjs       # icons/ikon.svg'den PNG ikonlar
```

### Eser önbelleği ve kaynaklar

`scripts/onbellek.mjs` her sanatçı için şu açık kaynakları birleştirir (hiçbiri anahtar istemez):

- **Kurs eserleri:** `data/sanatcilar.json`; yalnızca resim olanlar, `data/eser_turleri.json`'a göre.
- **Wikidata:** yaratıcı (P170) ve resim türleri (P31/P279*).
- **The Met:** `isPublicDomain`.
- **Art Institute of Chicago:** `is_public_domain`, IIIF.
- **Cleveland Museum of Art:** CC0.
- **National Gallery of Art:** açık veri CSV'leri, IIIF.
- **Wikimedia Commons:** “Paintings by …” kategorileri, yalnızca müze/Google Art Project taramaları.

Ham yanıtlar `scripts/.ham/` altında saklanır (git'e girmez); yeniden çalıştırmada ağa gidilmez (`TAZE=1` ile yenilenir). NGA CSV'leri bir kez indirilmeli:

```bash
mkdir -p scripts/.ham/nga && cd scripts/.ham/nga
for f in objects objects_constituents constituents published_images; do
  curl -sSO https://raw.githubusercontent.com/NationalGalleryOfArt/opendata/main/data/$f.csv
done
```

Elle verilen görsel kararları (`data/gorsel_kararlari.json`) önbellek üretilirken uygulanır.

Vekil sunucu arkasında `onbellek.mjs` için: `NODE_USE_ENV_PROXY=1 node scripts/onbellek.mjs`. Yalnızca bazı sanatçıları yenilemek için id'lerini argüman olarak ver; tümünü baştan almak için `YENIDEN=1`.

**Sürüm çıkarırken:** `sw.js` içindeki `SURUM` değerini artır (yoksa telefondaki önbellek eski dosyaları vermeye devam eder). Yeni bir `js/` dosyası eklersen `sw.js`'deki listeye de ekle (birim testi bunu denetler).

### Dosyalar

| Yol | Ne |
| --- | --- |
| `index.html`, `css/app.css`, `js/*.js` | Uygulama (ES modülleri, derleme yok) |
| `sw.js`, `manifest.webmanifest`, `icons/` | PWA |
| `data/*.json` | İçerik (sanatçılar, akımlar, konular, başlangıç ilerlemesi) |
| `data/eserler_onbellek.json` | Wikidata QID'leri ve eser listeleri (derleme zamanı önbelleği; olmasa da çalışır) |
| `scripts/` | Önbellek, ikon üretimi, yerel sunucu |
| `tests/` | Birim (`unit/`), uçtan uca (`e2e/`), fikstürler |
| `tools/` | Qwen inceleme betikleri (dokunulmaz) |
| `KARARLAR.md` | Tarifte belirsiz kalan yerlerde verilen kararlar |

Görseller Wikimedia Commons'tan, ek eser listeleri Wikidata'dan gelir. Bir eser yalnızca kursta geçiyorsa ya da Wikidata'da doğrulanmış sanatçıya “yaratıcı” (P170) / “mimar” (P84) olarak bağlıysa gösterilir.
