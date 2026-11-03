# Sanat Atlası

Kenney Mencher'in *Art History: Renaissance to 20th Century* kursuyla birlikte büyüyen, kişisel sanat tarihi çalışma uygulaması. iPhone'da ana ekrana eklenen bir **PWA**; sunucu, hesap ya da analiz yok — yalnızca statik dosyalar.

Görünüm: **“Kadife ve resim rengi”** — kadife gibi koyu zemin, Bodoni Moda başlıklar; her ekranın vurgu rengi o an gösterilen eserin kendi renklerinden çıkarılır. Alttaki sekme çubuğu: **Bugün · Göz At · Pekiştir · İlerleme**.

- **Bugün:** Günün sanatçısının en bilinen eseri ekranın üstünü kaplar; adı, “Resmin renkleri” şeridi, Pekiştir düğmeleri, son çalıştığın sanatçılar.
- **Göz At:** akımlar kronolojik sırada → sanatçılar → sanatçı sayfası (eserlerin kırpılmadan yatay galerisi, notların, “Nasıl tanırım?”, dönem çizelgesi) → tam ekran görüntüleyici (iki parmakla yakınlaştır, kaydırarak eserler arasında geç; resim hiç kırpılmaz).
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

### Sanatçının portresi ve adının okunuşu

`data/kunye.json`, `gorseller/portre/` ve `gorseller/ses/` için Mac'te depo kökünde (Pillow gerekir):

```
python3 scripts/kunye.py
git add data/kunye.json gorseller/portre gorseller/ses && git commit -m "Portreler ve okunuşlar" && git push
```

Wikidata'nın sorgu servisi bazen dakikada bir isteğe izin verir; betik bekleyip yeniden dener. Yarıda kalırsa yeniden çalıştır.

### Ressamların imzaları

Sanatçı sayfasında adın altındaki altın imza, Wikidata'daki imza görselinden (P109) yapılır.
`data/imzalar.json` hangi ressamın imzası olduğunu söyler (`node scripts/imzalar.mjs` üretir), `gorseller/imza/<id>.png`
de uygulamayla gelen hazır mürekkep maskeleridir. Maskeleri üretmek ya da yenilemek için Mac'te depo kökünde:

```
pip3 install pillow
python3 scripts/imza_maske.py        # olmayanları indirir (istekler arası bekleme var, birkaç dakika)
git add gorseller/imza && git commit -m "İmza maskeleri" && git push
```

Maskesi olmayan ressamın imzası, sayfası açılınca canlı Wikimedia'dan yapılmaya çalışılır; olmazsa imza görünmez.

**WikiArt (yedek görsel kaynağı, anahtar ister):** az eserli sanatçılar ve 20. yüzyıl akımları için `scripts/kaynaklar/wikiart.mjs` çalışır. Anahtarlar yalnızca ortam değişkeninden okunur; dosyaya yazma:

```sh
WIKIART_ACCESS_KEY=… WIKIART_SECRET_KEY=… node scripts/kaynaklar/wikiart.mjs   # saatte en çok 350 istek; kesilirse aynı komutla sürer
UYGULA=1 node scripts/kaynaklar/wikiart.mjs                                      # ağa gitmeden data/wikiart.json'ı önbelleğe uygular
```

**Sürüm çıkarırken:** `sw.js` içindeki `SURUM` değerini artır (yoksa telefondaki önbellek eski dosyaları vermeye devam eder). Yeni bir `js/` dosyası eklersen `sw.js`'deki listeye de ekle (birim testi bunu denetler).

### Dosyalar

| Yol | Ne |
| --- | --- |
| `index.html`, `css/app.css`, `js/*.js` | Uygulama (ES modülleri, derleme yok) |
| `sw.js`, `manifest.webmanifest`, `icons/` | PWA |
| `data/*.json` | İçerik (sanatçılar, akımlar, konular, başlangıç ilerlemesi) |
| `data/eserler_onbellek.json` | Wikidata QID'leri ve eser listeleri (derleme zamanı önbelleği; olmasa da çalışır) |
| `data/wikiart.json` | WikiArt'tan derleme zamanında alınan eserler (başlık, yıl, eser sayfası, görsel adresi) |
| `scripts/` | Önbellek, ikon üretimi, yerel sunucu |
| `tests/` | Birim (`unit/`), uçtan uca (`e2e/`), fikstürler |
| `tools/` | Qwen inceleme betikleri (dokunulmaz) |
| `KARARLAR.md` | Tarifte belirsiz kalan yerlerde verilen kararlar |

Görseller Wikimedia Commons'tan, ek eser listeleri Wikidata'dan gelir. Bir eser yalnızca kursta geçiyorsa ya da Wikidata'da doğrulanmış sanatçıya “yaratıcı” (P170) / “mimar” (P84) olarak bağlıysa gösterilir.

## Görseller Cloudflare R2'de (en büyük kopyalar)

GitHub Pages sitesi en çok 1 GB olabilir; görsel kopyaları bu sınırın çoğunu dolduruyordu. Eserlerin **en büyük kopyaları** (uzun kenar 4096 px, en yüksek kalite) ve 1280 px'lik kopyalar Cloudflare R2'de durur (ücretsiz katman: 10 GB, indirme ücreti yok). Uygulama görüntüleyicide önce 1280'lik kopyayı gösterir, en büyük kopya arkada iner ve gelince yerine geçer.

Kurulum (bir kez, Cloudflare panelinde): R2'de `sanat-atlasi` kovası → Settings → **Public Development URL** açık; R2 → **Manage API tokens** → **Create Account API token** (Object Read & Write, yalnız `sanat-atlasi`). Bu jeton kova ayarını değiştiremediği için CORS iznini elle ver: kova → Settings → **CORS Policy** → Add → şunu yapıştır → Save:

```
[{"AllowedOrigins":["https://emrymn.github.io","http://localhost:4173"],"AllowedMethods":["GET","HEAD"],"AllowedHeaders":["*"],"MaxAgeSeconds":86400}]
```

Mac'te (depo kökünde):

```
git pull
python3 -m pip install --user boto3
caffeinate -i python3 scripts/devasa_indir.py      # en büyük kopyaları indirir; birkaç saat sürebilir (--saat 3: en çok 3 saat), yarıda kalırsa yeniden çalıştır
export R2_HESAP_ID=934af0e562e2812c13464d2d4dbbb4e4
export R2_ERISIM_ANAHTARI='…'                     # Access Key ID
export R2_GIZLI_ANAHTAR='…'                       # Secret Access Key (kimseyle paylaşma)
export R2_GENEL_ADRES=https://gorsel.noracloud.ai   # kendi alan adın (r2.dev mobil operatörde engelli)
python3 scripts/r2_yukle.py                       # yükler, kovaya CORS izni verir, data/gorsel_kaynagi.json yazar
git add data/gorsel_kaynagi.json && git commit -m "Görseller R2'de" && git push
```

İndirme betiği engellenmemek için yavaş gider (istekler arası 4–6 sn, saatte en çok 500 istek; engel gelince 1 dakikadan 30 dakikaya kadar katlanarak bekler). `--saat 3` gibi bir süre verirsen o kadar sonra durur; aynı komut kaldığı yerden sürer. Görsel Commons'ta küçükse aynı eserin The Met, Art Institute of Chicago, National Gallery of Art ya da Cleveland Museum of Art'taki açık erişim (CC0) görseline de bakar (eserin Wikidata kaydındaki müze numarasıyla); hangisi büyükse onu alır.

### Geri kalan bütün eserler de R2'ye (İş 102)

Uygulamadaki 7494 eserin yalnız ~1730'unun kopyası R2'deydi; gerisi (~5300, WikiArt hariç) her açılışta Wikimedia'dan ve müzelerden geliyordu. Hepsini en büyük kalitede R2'ye almak için Mac'te (depo kökünde):

```
git pull
caffeinate -i python3 scripts/gorsel_indir.py --hepsi   # 1280 ve 400 px kopyalar (~3 saat; yarıda kalırsa yeniden çalıştır)
node scripts/oranlar.mjs                               # yeni görsellerin en/boy oranları (Günün eseri dikey seçer)
caffeinate -i python3 scripts/devasa_indir.py --saat 8   # en büyük kopyalar (4096 px); yavaş gider, birkaç gece sürebilir, aynı komut kaldığı yerden sürer
python3 scripts/r2_yukle.py --10gb-ustu                 # kovaya yükler (ücretsiz 10 GB aşılır: ~25 GB, ayda ~0,25 $)
git add data/yerel_gorseller.json data/gorsel_oranlari.json data/gorsel_kaynagi.json gorseller/k && git commit -m "Bütün eserler R2'de" && git push
```

1280 px kopyalar artık depoya girmez (`.gitignore`: `gorseller/b/`), yalnız R2'den gelir; depoda yalnız ızgara için 400 px kopyalar kalır (GitHub Pages'in 1 GB sınırı). Sonra Claude'a söyle: kopya eser taraması (`scripts/kopya_bul.py`) bütün eserlerle yeniden yapılır.

### Zayıf görseller için daha büyük dosya (İş 84)

Bazı eserlerin elimizdeki en büyük kopyası küçük (2500 px altı ~620 görsel): Wikidata'nın verdiği dosya küçük. Aynı eserin Commons'ta daha büyük taraması varsa (eserin kendi Wikidata kaydındaki görsel ya da Commons kategorisi; oranı aynı ve küçük hâli bizimkiyle örtüşen) şu adımlarla gelir:

```
git pull
python3 scripts/kalite_tara.py --dene 10          # önce 10 görselle dene; sonra --dene olmadan hepsi (yarım saat kadar)
# sonunda inceleme sayfası açılır: beğenmediklerini işaretle, kopyalanan --reddet komutunu çalıştır, taramayı yeniden çalıştır
caffeinate -i python3 scripts/devasa_indir.py      # bulunanları indirir (elimizdeki küçük kopya yenisi inince değişir)
python3 scripts/r2_yukle.py                       # yenilenenler kovaya yeni adla yüklenir
git add data/gorsel_iyilestirme.json data/gorsel_kaynagi.json && git commit -m "Daha büyük görseller" && git push
```

Telefonda: Ayarlar → **En büyük kopyaları telefona indir** → yenilenenler yeniden iner, eskileri kendiliğinden silinir.

`gorseller_devasa/` depoya girmez (`.gitignore`). `data/gorsel_kaynagi.json` service worker'da önce ağdan gelir: gönderince telefona sürüm beklemeden iner.

## Sırada bekleyen işler (2026-11-03 itibarıyla)

Kredi bitince bırakılanlar; sırası önemli değil. Her biri bitince KARARLAR.md'ye yazılır.

1. **Görsel denetiminin kalan partileri.** `scripts/gorsel_denetim/` altında 35 partinin sonucu yok:
   062, 063, 065, 066, 069, 071, 072, 074, 075, 077, 078, 080, 081, 083, 084, 086, 087, 089–106.
   - Yapan (Gemini ya da Antigravity'de Claude Sonnet): `TALIMAT.md`'yi okuyup bu partilerin `sonuc_NNN.json` dosyalarını yazar.
   - Emre: `git pull`, `git add scripts/gorsel_denetim/sonuc_*.json`, commit, `git push` (dal: `claude/brave-mendel-h2rm3b`).
   - Claude: kötü/çıkar/"emin değil" denenlerin hepsine ve uygunlardan bir örnekleme bakar, katılmadıklarını `isle.py` `DUZELTME`'ye yazar, `python3 scripts/gorsel_denetim/isle.py`, testler, sorulmadan yayınlar (Emre'nin kalıcı talimatı).
2. **Mac'teki büyük indirme bittikten sonra** — ayrıntılı adımlar aşağıda, "Büyük indirmeden sonra (adım adım)" bölümünde. 1–5. adımları Emre tek başına yapabilir; 6. adım için Claude betik yazar.
3. **Tek eserli konular (isteğe bağlı).** `data/eser_konulari.json`'da 315 konu yalnız bir eserde geçiyor (adı var, hikâye sayfası yok). İstenirse önemlileri seçilip `scripts/konu_etiket/yeni_konular_NN.json` biçiminde sayfaları yazılır, `python3 scripts/konu_etiket/uret.py` ile eklenir.
4. **iPhone titreşimi (isteğe bağlı).** Emre: "zayıf, sonra bakarız". iPhone'da tık gücü iOS'ta sabit; doğru/yanlış ayrımı yok (bkz. KARARLAR İş 106).
5. **Harita penceresini aşağı çekme (geri bildirim bekliyor).** Kapanma mesafesi 90 pt; iPhone'da ağır/hafif gelirse `js/surukleKapat.js` `KAPAT_MESAFE`.
6. **Hata günlüğü.** Bir şey bozulursa Ayarlar → Hata günlüğü → Kopyala, Claude'a yapıştır.

### Büyük indirmeden sonra (adım adım)

Hepsi Mac'te, Terminal'de, depo klasöründe (`cd` ile sanat-atlasi klasörüne gir). Her komutun çıktısını okumak yeter; bir yerde takılırsan çıktıyı kopyalayıp Claude'a gönder.

**1. İndirmenin gerçekten bittiğini doğrula.** Aynı komutu bir kez daha çalıştır:

```
caffeinate -i python3 scripts/devasa_indir.py
```

Başta `… görsel · … zaten inmiş · 0 inecek` yazıyorsa bitmiştir. `0` değilse kalanları indirir; bitince yeniden çalıştır. En sonda `bu tur başarısız N` yazar: birkaç tane kalabilir (sunucu vermiyor), sorun değil.

**2. Kaç GB tuttuğuna bak** (R2'nin ücretsiz katmanı 10 GB; aşan kısım ayda GB başına ~0,015 $):

```
du -sh gorseller_devasa
```

**3. Birkaç görseli gözle kontrol et** (isteğe bağlı ama iyi olur). Klasörü aç, rastgele 10–20 dosyaya bak: tablonun tamamı mı, yamuk/çerçeveli/siyah-beyaz mı? Müzeden gelenlerin listesi `gorseller_devasa/kaynaklar.json`'da. Kötü olanın dosya adını (`abcd1234….jpg`) not al, sonra Claude'a gönder.

```
open gorseller_devasa
```

**4. R2'ye yükle.** Önce Cloudflare anahtarlarını gir (yukarıdaki R2 bölümündeki gibi; değerler Cloudflare panelinde, kimseyle paylaşma):

```
python3 -m pip install --user boto3
export R2_HESAP_ID=934af0e562e2812c13464d2d4dbbb4e4
export R2_ERISIM_ANAHTARI='…'
export R2_GIZLI_ANAHTAR='…'
export R2_GENEL_ADRES=https://gorsel.noracloud.ai
python3 scripts/r2_yukle.py --10gb-ustu
```

Önce dosya sayısını ve toplam GB'ı, 10 GB'ı aşıyorsa aylık tahmini ücreti yazar, sonra yükler (`n/toplam · hata 0` diye ilerler). Yarıda kesilirse aynı komutu yeniden çalıştır: yüklenmiş olanları atlar. Sonunda `Bitti · en büyük … · 1280'lik … · hata 0` yazmalı. `HATA` satırları çıkarsa komutu bir kez daha çalıştır; yine çıkarsa çıktıyı Claude'a gönder.

**5. Uygulamaya bildir ve gönder:**

```
git pull origin claude/brave-mendel-h2rm3b
git add data/gorsel_kaynagi.json data/gorsel_iyilestirme.json
git commit -m "En büyük kopyalar R2'de"
git push origin HEAD:claude/brave-mendel-h2rm3b
```

Sonra Claude'a "gönderdim" de: testleri çalıştırıp yayınlar. Telefonda: Ayarlar → **En büyük kopyaları telefona indir** (Wi-Fi'de; birkaç GB).

**6. Claude'un yapacakları** (yeni betik gerekiyor, Emre'nin kredisi yetince):

- **Müze kopyasını tercih et:** şu an müze kopyası yalnız Commons'taki görsel küçükse alınıyor (`devasa_indir.py`). Müzenin kendi taraması genelde daha temiz (çerçevesiz, renkleri doğru). Met, NGA, AIC, Cleveland'da ~150, Getty, Rijksmuseum, Yale, Walters'ta ~150 eser için müze kopyası her durumda tercih edilecek; Claude betiği yazar, Emre çalıştırır, sonra yukarıdaki 4–5. adımlar.
- **Küçük 1280'likleri yeniden üret:** bazı eserlerin 1280 px kopyası aslında daha küçük (ör. Met'in "web-large" dosyası ~620 px). Büyük kopya indiyse 1280'lik ondan küçültülerek yeniden yapılır (Mac'te `sips`), sonra 4–5. adımlar.
- **Kopya eser taraması:** bütün eserlerin büyük kopyaları inince `scripts/kopya_bul.py` yeniden çalıştırılır (aynı tablonun iki kaydı).
