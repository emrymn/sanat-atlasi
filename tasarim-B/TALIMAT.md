# Tasarım B — uygulama talimatı (Fable için)

Merhaba. Bu dosya seni işe hazırlamak için yazıldı; önce baştan sona oku, sonra `CLAUDE.md`'yi (projenin genel kuralları) ve aşağıda adı geçen dosyaları oku.

## Kısaca

Sanat Atlası, Emre'nin iPhone'unda ana ekran uygulaması olarak kullandığı, Türkçe bir sanat tarihi çalışma uygulaması (PWA). Çok özelliği var ama tasarım yüzünden çoğu gizli kalıyor.

**Emre'nin isteği: tasarımda her şeyi değiştirebilirsin.** Yalnız üç şart var:

1. **Ana ekranda günün sanatçısının resmi olsun.**
2. **Uygulama premium hissettirsin:** özenli, sakin, pahalı bir müze uygulaması gibi. Tipografi, boşluk, hareket, geçişler, dokunuş hissi, ayrıntılar.
3. **Animasyonlar bol olsun:** ekran geçişleri, açılışlar, kartların gelişi, dokunuşa verilen tepkiler, sayıların ve ilerlemenin canlanması. Akıcı ve zarif olsun, ucuz ya da yorucu değil; iPhone'da takılmadan çalışsın (transform ve opacity, `requestAnimationFrame`). Ayarlar'daki "Hareket" seçeneğine (Tam / Sade / Kapalı) ve sistemin hareketi azalt ayarına uysun.

Aşağıdaki Tasarım B (`DUZEN.md`) ve yürüyüş prototipi bir başlangıç noktası, zorunlu değil. Daha iyisini önerebilir, tamamen farklı bir düzen kurabilirsin. Ama bunlar Emre'nin şimdiye kadar beğendiği şeyler; bir şeyi atacaksan neden daha iyi olduğunu söyle.

İşin iki aşaması var:

1. **Önce tasarım önerisi** (kod yazmadan): Bütün uygulamayı incele, yeni tasarımı öner, Emre onaylasın.
2. **Sonra uygulama**: Onaylananı koda geçir, test et, PR aç.

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

## Emre'nin şimdiye kadar beğendikleri (başlangıç noktası; değiştirebilirsin)

- **Açılış:** Günün resmi ekranı kenardan kenara kaplıyor, resim öne çıkıyor, üstünde yazı kalabalığı yok. Altta yalnız ad, eser ve yıl, tek kelimelik düğmeler (`ana-c.html`, C1).
- **Aşağı kaydırınca resmin içinde yürüyüş** (`deneme/yuruyus.html`): kamera aynı resmin içinde ayrıntıdan ayrıntıya kayar ve yakınlaşır, yazılar resmin üstünde yarı saydam kartlarda. Emre özellikle şunları istedi: siyah boşluk olmasın, sayfa kopuk değil tek bir bütün olsun; geçişler yavaş ve yumuşak; kartlarda "Ayrıntı 1/6" gibi etiketler yok; ipucu yazı değil küçük bir ok; kart ayrıntıyı kapatmasın. En sonda "Hayatı" (resim bulanıklaşır, biyografi üstünde akar).
- **Sekmeler:** 5 sekme düşünüldü (Bugün, Yolculuk, Galeri, Başyapıt, Çalış) ve sağ üstte "Ben". Emre "illaki 4 olacak diye bir şey yok" dedi; sayı ve adlar senin önerin.
- **Günün ressamı:** `data/yuruyus.json`'da kaydı olan 145 sanatçıdan biri; günün eseri o sanatçının yürüyüş eseri. 10 sanatçı (Arp, Man Ray, Bacon, Dalí, Magritte, Ernst, Miró, Duchamp, Höch, Nolde) günün ressamı olmaz ama uygulamada kalır. Emre'nin elle ortaladığı odaklar (`data/gorsel_odak_elle.json`) açılış karesinde kullanılır.
- **Yolculuk haritası kalacak.** Haritanın kendisi (çizimler, patika, gezginler) Emre'nin çok sevdiği bir şey. Ama haritanın içindeki **seviye tasarımlarını** (durakların görünümü, bölüm/seviye pencereleri, tanıtım, Kolay/Orta seviyeleri, ilerleme gösterimi, bölüm geçişleri) değiştirebilirsin; bunlar için de öneri bekleniyor.

## Dokunulmayacaklar (içerik ve öğrenme)

- Veri dosyalarının içeriği: yürüyüş noktaları ve metinleri, hikâyeler, rehberli inceleme, biyografiler, `data/sanatcilar.json`. Yeni veri dosyası ekleyebilirsin.
- Öğrenme mantığı: Leitner tekrarları, çeldiriciler, kilitler, soru türleri (soruların **görünümünü** değiştirebilirsin).
- Kullanıcının cihazdaki verisi: ilerleme, ayarlar, yedek biçimi (`js/depo.js`). Yeni sürüm eski yedeği açabilmeli.

## Aşama 1 · Tasarım önerisi (önce bunu yap, kod yazma)

Emre senden bir tasarımcı gibi düşünmeni istiyor: "sonuçta çok gelişmiş bir model". Bütün uygulamayı gez (yerelde `node scripts/sunucu.mjs 4517` → `http://localhost:4517/sanat-atlasi/`, 390×844), her ekranın görüntüsünü al, sonra:

- **Bütünlüklü bir tasarım dili öner:** tipografi ölçeği, boşluk sistemi, renk ve ışık, hareket ve geçiş ilkeleri, ikonlar, dokunuş geri bildirimi. "Premium" ne demek, bu uygulamada nasıl görünecek?
- **Bilgi mimarisi:** Hangi özellik nerede, ne kadar görünür? Gizli kalan değerli özellikler (rehberli inceleme, hikâyeler, karşılaştır, sesli telaffuz, koleksiyon, konu turu, zaman çizelgesi, harita) nasıl ortaya çıkar? Sekme sayısı ve adları.
- **Hareket ve animasyon:** Hangi anlarda ne tür animasyon (geçişler, açılış, cevap anı, seviye atlama, rozet kazanma, harita yürüyüşü)? Birkaç örneği çizimlerde göster.
- **Harita seviyeleri:** Haritadaki bölüm ve seviye deneyimini nasıl daha oyunsu ve ödüllendirici yaparsın?
- **Ana ekran ve yürüyüş:** Açılış, yürüyüş, yürüyüşün sonu, günün işi (bugünkü tur) nerede?
- **Ekran ekran:** Her ana ekranın ilk görünen alanı ne göstermeli?
- **iPhone hissi:** başparmak bölgesi, kaydırma, güvenli alanlar, karanlık/aydınlık tema.

Çıktı:
- `tasarim-B/ONERILER.md`: önerinin özeti, tasarım dili, ekran ekran değişiklikler, önem sırasıyla; her maddenin uygulama maliyeti (küçük / orta / büyük) ve sonunda "Onay? evet / hayır".
- Görsel çizimler (`tasarim-B/oneri-*.html`, 390×844 iPhone çerçevesinde, gerçek resimlerle: `gorseller/k/<kimlik>.jpg`) ve bunların ekran görüntüleri (`tasarim-B/oneri-*.jpg`), Emre telefondan baksın diye.

Commit'le, push'la, Emre'ye kısaca özetle; **onay gelmeden Aşama 2'ye geçme**.

## Aşama 2 · Uygulama

Onaylanan tasarıma göre. Tasarım B'ye yakın kalırsa önerilen sıra:

1. **Bugün yürüyüşü:** `deneme/yuruyus.html`'deki davranışı `js/ekranlar/bugun.js` içine taşı (ayrı bir modül olabilir: `js/yuruyus.js`). Veri `data/yuruyus.json`; görseller `js/gorsel.js`'deki mevcut adres mantığıyla (R2: `b/` 1280'lik, `d/` en büyük; `buyuk` alanı varsa `y/<id>.jpg` ve `y/<id>-1280.jpg`). `sw.js`'de yeni dosyaları kabuğa / isteğe bağlı listeye ekle.
2. **Günün ressamı** seçimini 145 sanatçıyla sınırla (`js/gunun.js` ve ilgili yerler).
3. **Sekme çubuğu:** 5 sekme, yeni adlar, Çalış rozeti, Ben düğmesi (`js/ekranlar/ortak.js` → `sekmeleriCiz`, `js/ekranlar/yonlendirme.js` → `rotalar`). Adresler (`#/…`) aynı kalır.
4. Galeri, Başyapıt, Çalış, Yolculuk kurs paneli, Ben, rozetler (`DUZEN.md` 4.2–4.6).

Her adım ayrı commit; mümkünse her büyük adımda Emre'ye Vercel önizlemesinden denetebileceği bir ara durum sun (aşağıya bak).

## Teknik kurallar (kesin; uygulamanın çalışması ve yayın bunlara bağlı)

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
