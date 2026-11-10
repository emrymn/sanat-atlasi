# Tasarım B — uygulama talimatı (Fable için)

Merhaba. Bu dosya seni işe hazırlamak için yazıldı; önce baştan sona oku, sonra `CLAUDE.md`'yi (projenin genel kuralları) ve aşağıda adı geçen dosyaları oku.

## Kısaca

Sanat Atlası, Emre'nin iPhone'unda ana ekran uygulaması olarak kullandığı, Türkçe bir sanat tarihi çalışma uygulaması (PWA). Çok özelliği var ama tasarım yüzünden çoğu gizli kalıyor. Yeni düzen (Tasarım B) bunu çözüyor: önem sırasına göre görünürlük, 5 sekme, sade bir açılış ekranı ve açılış resminin içinde "yürüyüş".

İşin iki aşaması var:

1. **Önce tasarım önerileri** (kod yazmadan): Düzeni ve çizimleri incele, geliştirme önerilerini yaz, Emre onaylasın.
2. **Sonra uygulama**: Onaylanan düzeni koda geçir, test et, PR aç.

## Başlangıç noktası

- Dal: `claude/sharp-edison-7ns0r2`. Buradan kendi dalını aç (ör. `fable/tasarim-b`), işin bitince **bu dala değil `main`'e** PR aç; birleştirmeyi Emre yapacak.
- `main`'e birleşen her şey kendiliğinden yayına çıkıyor (`.github/workflows/yayinla.yml` → Cloudflare Pages). O yüzden PR'ı yarım iş bırakma; Emre "hepsi oturunca yayınlarız" dedi.
- Bu dalda hazır olanlar:
  - **Bugün ekranının ilk ekranı** (v0 yaptı, testleri uyarlandı): `js/ekranlar/bugun.js`, `css/app.css` (`.bugun-tek`, `.bugun-alt`, `.bugun-dugme` …). Tek ekran, altta ad, eser ve üç tek kelimelik düğme (Hikâyesi / İncele / sanatçının adı).
  - **Yürüyüş verisi**: `data/yuruyus.json` — 145 sanatçının her biri için bir eser ve 4–7 ayrıntı noktası (`x, y, w, h` resme oranla kutu; `kirp` müze renk şeridi gibi dış kısmı keser; `buyuk` R2'deki ayrı büyük kopya yolu). Kutular elle doğrulandı; **noktaları ve metinleri değiştirme**.
  - **Yürüyüş prototipi**: `deneme/yuruyus.html?s=<sanatçı kimliği>` — uygulamadan bağımsız tek sayfa; kamera mantığı, kart yerleşimi ve en alttaki "Hayatı" bölümü burada çalışıyor. Emre bunu telefonda denedi ve beğendi; davranışı bunun gibi olmalı.

## Okunacak dosyalar (sırasıyla)

1. `tasarim-B/DUZEN.md` — yeni düzenin tamamı: önem katmanları, 5 sekme, ekran ekran yerleşim, değişmeyecekler, teknik kurallar, iş sırası.
2. `tasarim-B/ana-c.html` (soldaki C1) — onaylanan Bugün ekranı. `tasarim-B/taslak.html` — diğer ekranların ilk çizimi (Bugün ve 4 sekme orada eski).
3. `deneme/yuruyus.html` — yürüyüş prototipi.
4. `KARARLAR.md`'nin sonu (İş 150 sonrası) — son kararların bağlamı. Dosya çok büyük (420 KB); tamamını okuma, ihtiyacın olan kısmı ara.

## Emre'nin kararları (değiştirme, önerebilirsin)

- **Bugün:** Resim öne çıksın, altında açıklama yazısı olmasın, "devam et / tur" düğmesi olmasın. İlk ekranda yalnız ad, eser ve yıl, üç tek kelimelik düğme (C1: ikon + kelime, yalnız ikon değil).
- **Aşağı kaydırınca: resmin içinde yürüyüş.** Kamera aynı resmin içinde ayrıntıdan ayrıntıya kayar ve yakınlaşır; yazılar resmin üstünde yarı saydam kartlarda. **Siyah boşluk olmasın, sayfa kopuk değil tek bir bütün olsun.** Geçişler yavaş ve yumuşak. Kartlarda "Eser", "Ayrıntı 1/6" gibi etiket yok; yalnız başlık ve metin. Açılıştaki ipucu yazı değil, küçük bir ok. Kart ayrıntıyı kapatmasın (gerekirse üste geçer). Sıra: açılış → eserin künyesi → ayrıntılar → Nasıl tanırım? → Hayatı (resim bulanıklaşıp kararır, biyografi üstünde akar).
- **Sekmeler 5:** Bugün, Yolculuk, Galeri, Başyapıt, Çalış. Çalış'ta bekleyen kart sayısı rozeti. İstatistik, koleksiyon, ayarlar sağ üstteki "Ben" düğmesinde.
- **Günün ressamı:** Yalnız `data/yuruyus.json`'da kaydı olan 145 sanatçı günün ressamı olabilir; 10 sanatçı (Arp, Man Ray, Bacon, Dalí, Magritte, Ernst, Miró, Duchamp, Höch, Nolde) olmaz ama uygulamada kalır. Günün eseri, o sanatçının yürüyüş eseri olsun (`data/gunun_resimleri.json`'daki Emre'nin elle seçimleri bununla çakışırsa yürüyüş eseri kazanır; Emre'nin elle ortaladığı odaklar `data/gorsel_odak_elle.json` açılış karesinde kullanılmaya devam eder).
- Renkler, yazı tipleri, temalar, harita, soru ekranları ve öğrenme mantığı **değişmiyor**.

## Aşama 1 · Tasarım önerileri (önce bunu yap, kod yazma)

Emre senden ayrıca tasarım önerisi istiyor: "sonuçta çok gelişmiş bir model". Düzeni bir tasarımcı gözüyle eleştir ve geliştir. Özellikle:

- **Önem sırası ve görünürlük:** `DUZEN.md`'deki 4 katman doğru mu? Gizli kalacak değerli bir özellik var mı (rehberli inceleme, hikâyeler, karşılaştır, sesli telaffuz, koleksiyon, konu turu, zaman çizelgesi)?
- **Bugün + yürüyüş:** Açılıştan yürüyüşe geçiş, yürüyüşün sonu, "Hayatı"dan sonra ne olmalı (ör. sanatçının diğer eserleri, bugünkü tur önerisi)? Yürüyüş sırasında alt sekme çubuğu ve üst çubuk ne yapmalı?
- **Galeri / Başyapıt / Çalış / Yolculuk:** Her sekmenin ilk ekranı ne göstermeli, sekmeler arasında tekrar var mı?
- **iPhone hissi:** Dokunma alanları, başparmak bölgesi, kaydırma davranışı, güvenli alanlar, karanlık/aydınlık tema.
- Bir öneri bir kararı değiştiriyorsa açıkça "Emre'nin kararını değiştirir" diye işaretle.

Çıktı: `tasarim-B/ONERILER.md` — her öneri için kısa başlık, neden, nasıl görüneceği (gerekirse küçük bir ASCII çizim ya da `tasarim-B/` altında bir HTML çizim), uygulama maliyeti (küçük / orta / büyük). **En fazla 10 öneri**, önem sırasıyla; Emre hızlı karar versin diye her birinin sonuna "Onay? evet / hayır" bırak. Bu dosyayı commit'le, push'la ve Emre'ye özetle; **onay gelmeden Aşama 2'ye geçme**.

## Aşama 2 · Uygulama

`DUZEN.md` 7. bölümdeki iş sırasıyla, onaylanan önerilerle birlikte. Önerilen sıra:

1. **Bugün yürüyüşü:** `deneme/yuruyus.html`'deki davranışı `js/ekranlar/bugun.js` içine taşı (ayrı bir modül olabilir: `js/yuruyus.js`). Veri `data/yuruyus.json`; görseller `js/gorsel.js`'deki mevcut adres mantığıyla (R2: `b/` 1280'lik, `d/` en büyük; `buyuk` alanı varsa `y/<id>.jpg` ve `y/<id>-1280.jpg`). `sw.js`'de yeni dosyaları kabuğa / isteğe bağlı listeye ekle.
2. **Günün ressamı** seçimini 145 sanatçıyla sınırla (`js/gunun.js` ve ilgili yerler).
3. **Sekme çubuğu:** 5 sekme, yeni adlar, Çalış rozeti, Ben düğmesi (`js/ekranlar/ortak.js` → `sekmeleriCiz`, `js/ekranlar/yonlendirme.js` → `rotalar`). Adresler (`#/…`) aynı kalır.
4. Galeri, Başyapıt, Çalış, Yolculuk kurs paneli, Ben, rozetler (`DUZEN.md` 4.2–4.6).

Her adım ayrı commit; mümkünse her büyük adımda Emre'ye Vercel önizlemesinden denetebileceği bir ara durum sun (aşağıya bak).

## Teknik kurallar (kesin)

- **Framework yok:** düz HTML + CSS + ES modülleri, derleme adımı yok. React, Next.js, Tailwind, npm paketi ekleme.
- `data-test="…"` özniteliklerini silme ya da adını değiştirme; öğe taşınırsa özniteliğiyle taşı. Testler (`tests/e2e`, 32 dosya) bunlara bağlı. Bir test gerçekten eski düzeni sınıyorsa testi yeni düzene **uyarla, silme ya da atlama**; ne değiştirdiğini commit mesajında yaz.
- Yollar göreli; arayüz metni Türkçe; dokunma alanı ≥ 44 px; gövde yazısı ≥ 17 px; `env(safe-area-inset-*)`; 390 px'te yatay kaydırma yok.
- `js/app.js` 150 satırı geçmez (test denetler).
- Sürüm: her yayına giden değişiklikte `js/surum.js` ve `sw.js`'deki `SURUM` birlikte artar (şu an 1.75.0; sen 1.76.0 yap), `js/yenilikler.js`'e Türkçe bir satır, `tests/unit/paket8.test.mjs` ve `tests/e2e/paket8.spec.js`'deki sürüm beklentileri.
- `KARARLAR.md`'ye "İş 171 (Tasarım B, Fable)" başlığıyla kısa notlar ekle.
- `data/sanatcilar.json`'ın içerik alanlarına ve `tools/` klasörüne dokunma (`CLAUDE.md` §12).

## Test

- `npm run test:unit` (322 test) ve `npx playwright test --project=chromium --trace off` (162 test). Bu bulut ortamında `harita.spec.js:85`, `paket8.spec.js:25` (jiroskopla salınım) ve bazen `cilalama.spec.js:35` kendiliğinden kırılıyor; GitHub'daki Testler'de geçiyorlar. Diğer her kırık senin işin.
- Yeni davranışa test ekle: Bugün'de yürüyüş adımları, kartın ayrıntıyı kapatmaması, 5 sekme, günün ressamının 145 kişiden gelmesi.
- iPhone boyutunda (390×844) ekran görüntüsü alıp kendin bak; siyah boşluk ve kesik metin olmamalı.

## Teslim

- PR başlığı ve açıklaması Türkçe. Açıklamada: ne değişti, hangi öneriler uygulandı, test sonuçları, bilinen eksikler.
- Vercel her PR'a önizleme kurar (`https://sanat-atlasi-t0-git-<dal-adı>-emrymn.vercel.app`); Emre telefonda oradan dener. Ana uygulamadaki verisi (ilerleme) önizlemede görünmez, bu normal.
- Emre'ye yazarken: Türkçe, kısa, teknik terimsiz; ne yapması gerektiğini net söyle.
