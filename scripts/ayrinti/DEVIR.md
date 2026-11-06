# Rehberli eser incelemesi — devir raporu

**Tur 1 · 5 Kasım 2026 · Claude (Claude Code, pilot).** 20 başyapıt, 119 nokta. Sürüm 1.71.0, KARARLAR İş 151.
**Tur 2 · 5 Kasım 2026 · Claude (Claude Code).** Parti 1: 20 eser, 115 nokta. Sürüm 1.71.1, KARARLAR İş 152.
**Tur 3 · 5 Kasım 2026 · Claude (Claude Code).** Plan Parti 2: 20 eser, 115 nokta. Sürüm 1.71.2, KARARLAR İş 153.
**Tur 4 · 5 Kasım 2026 · Claude (Claude Code).** Plan Parti 3 (Claude Lorrain → Millais): 20 eser, 117 nokta. Sürüm 1.71.3, KARARLAR İş 154.
**Tur 5 · 5 Kasım 2026 · Claude (Claude Code).** Plan Parti 4 + Parti 5 (Ingres → Bacon): 27 eser, 153 nokta. Sürüm 1.71.4, KARARLAR İş 155. **107 / 107 bitti.**
Bir sonraki model önce `TALIMAT.md`'yi, sonra bu dosyayı, sonra `DURUM.md`'yi okur; **güncel hazır istem en altta** (Tur 5 bölümü).

## 1. Yapılanlar

- **Özellik** (`js/goruntuleyici.js`, `js/ayrinti.js`, `css/app.css` "İş 151" bölümü): görüntüleyiciye `ayrintilar`
  (eser → kayıt) ve `incelemeyeBasla` seçenekleri. Kayıt varsa alt şeritte "İncele · N nokta"; dokununca tablonun
  üstünde numaralı noktalar (`.gor-noktalar`, resmin kutusunu ve `transform`'unu birebir kopyalar, noktalar ters ölçekle
  sabit 44 px dokunma alanı), altta panel: "n / N · ad", 2–3 cümle, Önceki / Sonraki / Bitir. Noktaya dokununca
  `noktaOdagi` kutuyu ekranın %78'ine sığdıracak ölçeği (1,15–6×) ve kaymayı hesaplar; 560 ms yumuşak geçiş
  (`hareketAz` ise anında), ardından İş 81'in "netleştirme"si kutuyu gerçekten büyütür → iPhone en büyük kopyayı tam
  çözünürlükte çizer. En büyük kopya (4096) zaten görüntüleyici açılınca arkada iniyor ve gelince yerine geçiyordu;
  değişmedi. Eser değişince (kaydırma/ok) inceleme kapanır. Tek dokunuşla arayüz gizlenince panel de gizlenir, noktalar kalır.
- **Girişler:** Başyapıt sayfasında görselin altında "Rehberli inceleme · N nokta" (doğrudan inceleme kipinde açar);
  sanatçı sayfası ve konu sayfası ızgaralarından açılan görüntüleyicide de "İncele" (aynı anahtarla eşleşen eserlerde).
  Pekiştirmede (gizli) ve Tuval'de yok.
- **Veri:** `data/eser_ayrintilari.json` (biçim TALIMAT §1). 20 eser, istenen sırayla. Service worker'ın isteğe bağlı
  listesinde; dosya yoksa/404 ise uygulama eskisi gibi.
- **Devir sistemi:** `denetle.py` (kurallar + çıkış kodu; birim testi çalıştırır), `durum.py` → `DURUM.md`,
  `yardimci/coz.py` (anahtar → görsel adı + R2 adresleri), `yardimci/izgara.py` (1280'de seçim ızgarası),
  `yardimci/kirp.py` (4096'dan kutu kırpıp kontak sayfası).
- **Testler:** `tests/unit/ayrinti.test.mjs` (7: geçerlilik, anahtar, yakınlaşma hesabı, veri dosyası, denetleyici
  geçer + bozuk veriyi yakalar), `tests/e2e/ayrinti.spec.js` (3: tam akış, kayıt yokken, sanatçı sayfasından).

## 2. Tasarım kararları ve nedenleri

- **Anahtar = başyapıt anahtarı** (QID ya da `sanatçıId|başlık`), `q:`/`c:` önekli uygulama-içi anahtar değil: öteki
  editoryal dosyalarla (`basyapitlar`, `eser_notlari`, `eser_zorluk`, `eser_adlari_tr`) aynı; `ayrintiAnahtari(e)`
  eser nesnesinden türetir (`qid` yoksa `sid|baslik`).
- **Koordinat = görsel dosyasının oranı**, tuvalin değil. Uygulamada tek bir görsel var ve çerçeveli fotoğraflar da o
  görsel. `gorsel` alanı hangi dosyada seçildiğini kaydeder; görsel değişirse denetleyici hata verir (koordinatlar
  kayar). Kutu (`x,y,w,h`) tek nokta yerine: nokta kutunun ortası, yakınlaşma kutuya göre.
- **Nokta katmanı resmin kardeşi,** resmin içine değil: `<img>` çocuk alamaz; katman `offsetLeft/Top/Width/Height` ve
  `transform`'u her `uygula()`da kopyalar. Netleştirme kutuyu büyütünce de hizalı kalır (e2e bunu ölçer).
- **Sade müze dili:** noktalar koyu cam üstünde beyaz numara; yalnız seçili nokta ve "Sonraki" eserin vurgu renginde
  (görüntüleyici Gece paletinde olduğu için `--vurgu` orada sönük; bilerek). Yeni bir yüzey/çerçeve eklenmedi; panel var
  olan alt şeridin içinde.
- **4–6 nokta, 2–3 cümle, 60–420 karakter** eşikleri denetleyicide ve `js/ayrinti.js` sabitlerinde aynı.
- **Kutular örtüşmesin** (IoU ≤ 0,35): numaralar üst üste binmesin ve yakınlaşmalar birbirini tekrarlamasın diye.
- Parti büyüklüğü 20 (`durum.py` `PARTI`): 87 kalan → 5 parti. Bir model-turunda 20 eser × (1 ızgara + 1 kontak sayfası)
  yaklaşık 45 görsel bakışı; bu turda rahat sığdı.

## 3. Zorlanılan ve emin olunmayan yerler

- **Mérode:** "pencereden gelen çocuk" ilk seçimde yanlış pencereye konmuştu (düzeltildi; TALIMAT §5).
- **Géricault / Argus:** gemi 1280'de görünmüyor; 4096 kırpıntısında bulundu ve kutu kaydırıldı. Kutu (0,11 × 0,11)
  bez sallayan adamın koluna da değiyor; daha küçük yapılırsa nokta 6× sınırına takılır, bilerek bırakıldı.
- **Fra Angelico Müjde:** en büyük kopyası yok (1280 en büyüğü); doğrulama 1280'den. Yakınlaşınca biraz yumuşak kalır.
- **Olgu emin değillikleri** (metinlerde yumuşatıldı, kontrol edilebilir): Arnolfini aynasındaki iki konuktan birinin
  van Eyck olduğu; Atina Okulu'nda Eukleides/Arşimet ayrımı ve yakadaki "RVSM" imzası; Perugino'nun kendi portresinin
  tam hangi figür olduğu (siyah bereli, bize bakan: genel kabul); Orgaz'da El Greco'nun otoportresi (Aziz Stefanos'un
  elinin üstündeki yüz: yaygın görüş); Bronzino'daki "saçını yolan figür"ün frengi okuması (bir yorum); Bosch'un
  ağaç-adamının otoportre olduğu (yorum); Vermeer çinisindeki Cupido (Rijksmuseum'un kendi açıklaması); Gauguin'in
  beyaz kuş açıklaması (sanatçının mektubu); Bruegel'in tabela adı "Dit is inden Hert" (okunur, hatırlatıcı).
- **Masaccio "İsa'nın işareti":** fotoğraf eğik ve sıkışık; kutu havari başlarını da alıyor, İsa ortada. Daha dar kutu
  denenebilir.
- **Çerçeveli fotoğraflar** (Mérode, Giotto): koordinatlar çerçeveyi içeriyor; görsel ileride kırpılırsa denetleyici
  `gorsel` değişimini yakalar.
- Gece dışındaki temada görüntüleyici yine Gece renklerinde (İş 141); panel buna göre tasarlandı. Gündüz'de ayrıca
  bakılmadı.
- Gerçek iPhone'da denenmedi (Playwright iPhone 13 ölçüsü, Chromium). Pinch ile yakınlaştırıp sonra noktaya dokunma
  ve çift dokunuş birlikte denendi (e2e'de yok).

## 4. Kalan başyapıtlar: 5 partilik plan

Liste `DURUM.md`'de ("Kalanlar"), `basyapitlar.json` sırasıyla. Her parti bir model-turu:

| Parti | Eser | Dönem | Not |
|---|---|---|---|
| 1 | 1–20 | Gotik → Erken Rönesans → Kuzey Rönesansı → Yüksek Rönesans | Çok sahneli panolar (Berlinghieri, Duccio, Limbourg): sahne başına bir kutu; Michelangelo'nun Âdem'i tek figürlü, 4 nokta yeter |
| 2 | 21–40 | Venedik → Maniyerizm → Barok | Tavan/fresk fotoğrafları eğik olabilir (Carracci): kutuyu fotoğraftaki yerine göre ver |
| 3 | 41–60 | Barok → Rokoko → Neoklasik | Portrelerde (Rigaud, Velázquez) nesneler ve jestler: 4–5 nokta |
| 4 | 61–80 | Romantizm → Realizm → Empresyonizm | Manzaralarda (Constable, Turner) küçük figür ve ışık; Hokusai'nin "36 Manzara" kaydı bir dizi, görsele bak |
| 5 | 81–87 | Post-Empresyonizm → 20. yüzyıl | Guernica ve Höch çok ayrıntılı: 6 nokta; Magritte'te 4 |

Her partide sıra: `coz.py` → 1280'likleri indir → `izgara.py` → noktaları ve metinleri JSON'a yaz → 4096'lıkları indir
→ `kirp.py` → düzelt → `denetle.py` → `durum.py` → DEVIR.md'ye tur notu → KARARLAR → sürüm (veri değişimi için
`sw.js` ve `js/surum.js`'de yama sürümü yeter) → PR.

## 5. Yardımcı betikler (bu turda kullanılanlar; depoda `scripts/ayrinti/yardimci/`)

```bash
# 1) kalanlardan ilk 20'nin görselleri ve adresleri
python3 -I scripts/ayrinti/yardimci/coz.py /tmp/parti.json          # anahtar vermezsen ayrıntısı olmayan hepsi
# 2) 1280'likleri indir (b alanı), ızgarala, bak
curl -sS -o /tmp/b/00.jpg "<b adresi>" ; python3 -I scripts/ayrinti/yardimci/izgara.py /tmp/b/00.jpg /tmp/b/g00.jpg
# 3) kayıtları data/eser_ayrintilari.json'a ekle, sonra 4096'lıkları indir (d alanı) ve kırp
python3 -I scripts/ayrinti/yardimci/kirp.py Q220859 /tmp/d/00.jpg /tmp/kirp/00.jpg 0.3
# 4) denetle, durum, test
python3 scripts/ayrinti/denetle.py && python3 scripts/ayrinti/durum.py && npm run test:unit
```
İndirmeler `gorsel.noracloud.ai`'den (Cloudflare R2, herkese açık); 4096'lıklar 2–8 MB. Bütün tabloyu 4096'da
incelemek gerekmez.

## 6. Sonraki modele hazır istem (Tur 1'in; Tur 2 için en alttakini kullan)

> Sanat Atlası deposunda rehberli eser incelemesine devam et (KARARLAR İş 151). Önce `scripts/ayrinti/TALIMAT.md`,
> `scripts/ayrinti/DEVIR.md` ve `scripts/ayrinti/DURUM.md`'yi oku. `DURUM.md`'deki **Parti 1**'in 20 eseri için
> `data/eser_ayrintilari.json`'a kayıt ekle: her eserde 4–6 ayrıntı noktası, `{x, y, w, h}` 0–1 oranlı, 2–3 cümlelik
> Türkçe açıklama. İki aşamalı görsel doğrulamayı atlama: 1280 px kopyada ızgarayla seç, her kutuyu 4096 px kopyadan
> payla kırpıp doğrula ve düzelt (`scripts/ayrinti/yardimci/` betikleri). Bitince `python3 scripts/ayrinti/denetle.py`
> sıfır hata vermeli, `python3 scripts/ayrinti/durum.py` ile `DURUM.md`'yi yenile, `DEVIR.md`'ye "Tur 2" başlığıyla
> kendi raporunu (yapılanlar, emin olunmayanlar, kalan plan) ekle, `KARARLAR.md`'ye kısa not yaz, `npm run test:unit`
> geçsin, `sw.js` ve `js/surum.js`'de yama sürümünü yükselt (1.71.x), PR aç. `tools/` ve `data/sanatcilar.json`
> içeriğine dokunma. Kredi azalırsa bitirdiğin eserlerde dur; yarım eser bırakma; DEVIR ve DURUM'u mutlaka güncelle.

---

# Tur 2 · Parti 1 (Claude, Claude Code)

## Yapılanlar

- `DURUM.md`'deki Parti 1'in 20 eseri (Berlinghieri → Veronese) `data/eser_ayrintilari.json`'a eklendi: 115 nokta
  (15 eserde 6, 5 eserde 5; ortalama 5,75). Toplam 40 / 107, 234 nokta.
- Her eser: 1280'lik kopya ızgarayla seçildi, sonra 4096'lık kopyadan (%30 payla) kontak sayfası çıkarılıp kutular
  tek tek doğrulandı. 4096'lığı **olmayan** beş eser 1280'den doğrulandı: Lorenzetti (Meryem'in Doğumu), Simone Martini
  (Müjde), Michelino (Dante), Cranach (Âdem ile Havva), Tintoretto (Son Akşam Yemeği). Bunlarda yakınlaşma yumuşak kalır.
- Aşama 2'de düzeltilen 4 kutu: Simone Martini'nin altın yazısı (kutu yazının üstündeydi; aşağı ve Cebrail'in ağzına
  kaydırıldı), Duccio'da pelerini seren adam kutunun sağından taşıyordu (genişletildi), Raimondi'de Zafer'in çelengi
  kutunun solundaydı, Cranach'ta Havva'nın ayakları alttan kesiliyordu.
- Metinler eserin `bolumler`/`bak` alanlarındaki olgulara dayandı; `bak`'taki üç ayrıntı her eserde noktalara alındı
  (Berlinghieri'nin "mucize" sahnesi ve Mantegna'nın merhem kabı gibi ekler kayıttaki "Ne görüyoruz?"dan).
- Yardımcı: bu turda `r/NN.json` taslaklarını parti sırasıyla JSON'a yazan küçük bir birleştirme betiği kullanıldı
  (scratch, depoya girmedi); `coz.py` → `izgara.py` → `kirp.py` akışı değişmedi.

## Emin olunmayanlar

- **Berlinghieri "Mucize sahnesi" (sağ üst):** sunak önünde diz çöken hastalar; hangi mucize olduğu adlandırılmadı,
  metin genel tutuldu ("şifa ve cin çıkarma mucizeleri"). Yazıttaki imza satırı kısmen okunuyor.
- **Cimabue:** görsel 1966 taşkını öncesi eski bir reprodüksiyon (kayıt da öyle diyor); "Yaylanan beden" kutusu bacaklar
  ve ayakları alır.
- **Gentile:** maiyette "maymunlar" kaydın metninden; kutu tazıyı gösterir, maymunlara ayrıca bakılmadı. İmza ve tarih
  aynı satırda iki ayrı levha; kutu yalnız imzayı alır, tarih metinde.
- **Dürer:** levhada "S·1513" okunuyor; metin yalnız "1513" ve AD monogramı diyor. Şeytan "kıvrık boynuzlu" yazıldı
  (tek boynuz görünür).
- **Metsys:** aynadaki yansımada kırmızı başlıklı bir figür; kimliği yazılmadı.
- **Michelangelo "Sıva çatlakları":** gökyüzündeki ince bir çatlağı alan dar kutu; ayrıntı küçük, ama fresk yüzeyini
  göstermek için bilerek seçildi.
- **Tintoretto:** Yahuda (masanın bizim tarafında, haresiz) noktalanmadı: 1280'de figür seçilemedi.
- **Veronese:** müzisyenlerin ressam portreleri olduğu ve Correggio testisinin Inakhos'a gönderme olduğu yumuşatılarak
  yazıldı (kaydın kendi ifadesi).
- Raimondi'de sırtı dönük tanrıçanın kimliği tartışmalı bırakıldı; Venüs, Cupid'in sarıldığı cepheden figür.

## Kalan plan

Parti 2–5 değişmedi (tablo §4): 67 eser. Parti 2: Salviati → Poussin (20 eser, Maniyerizm → Fransız Klasisizmi).
Bu turda 20 eser rahat sığdı (≈ 20 ızgara + 22 kontak sayfası bakışı).

## Sonraki modele hazır istem

> Sanat Atlası deposunda rehberli eser incelemesine devam et (KARARLAR İş 151–152). Önce `scripts/ayrinti/TALIMAT.md`,
> `scripts/ayrinti/DEVIR.md` (özellikle en alttaki Tur 2 raporu) ve `scripts/ayrinti/DURUM.md`'yi oku. `DURUM.md`'deki
> **Parti 2**'nin 20 eseri için `data/eser_ayrintilari.json`'a kayıt ekle: her eserde 4–6 ayrıntı noktası,
> `{x, y, w, h}` 0–1 oranlı, 2–3 cümlelik Türkçe açıklama; eserin `data/basyapitlar.json`'daki `bak` ayrıntılarını
> noktalara al. İki aşamalı görsel doğrulamayı atlama: 1280 px kopyada ızgarayla seç, her kutuyu 4096 px kopyadan
> payla kırpıp doğrula ve düzelt (`scripts/ayrinti/yardimci/` betikleri). Bitince `python3 scripts/ayrinti/denetle.py`
> sıfır hata vermeli, `python3 scripts/ayrinti/durum.py` ile `DURUM.md`'yi yenile, `DEVIR.md`'ye "Tur 3" başlığıyla
> kendi raporunu ekle, `KARARLAR.md`'ye kısa not yaz, `npm run test:unit` geçsin, `sw.js`, `js/surum.js` ve sürüm
> testlerinde (`tests/unit/paket8.test.mjs`, `tests/e2e/paket8.spec.js`) yama sürümünü yükselt (1.71.x), PR aç. `tools/`
> ve `data/sanatcilar.json` içeriğine dokunma. Kredi azalırsa bitirdiğin eserlerde dur; yarım eser bırakma; DEVIR ve
> DURUM'u mutlaka güncelle.

---

# Tur 3 · Parti 2 (Claude, Claude Code)

Emre "sıradaki partiyi yap" dedi, sonra açıkça **Parti 2**'yi istedi. Parti 1 aynı anda başka bir oturumda yapıldı (Tur 2,
PR #172) ve önce birleşti; bu tur ona göre İş 153 / 1.71.2 olarak numaralandı. Toplam 60 / 107 eser, 349 nokta.

### Yapılanlar
- 20 başyapıt, 115 nokta (Salviati, Pontormo, Anguissola, Daniele da Volterra, Parmigianino, Rosso, Giulio Romano, Carracci,
  Baburen, Artemisia, Orazio Gentileschi, Velázquez, Zurbarán, Rubens, Van Dyck, Rembrandt, Steen, Rigaud, Le Brun, Poussin).
  Çoğunda 6 nokta; Pontormo, Volterra, Poussin 5; Zurbarán 4 (tek figürlü natürmort).
- Kurs notlarındaki "bak" ayrıntılarının hepsi bir noktaya kondu (Velázquez'in dilekçesi, Rigaud'nun adalet eli ve kırmızı
  topukları, Steen'in "JSteen" imzası, Baburen'in lavtadaki imzası, Rubens'in üç dilli levhası ve tutulmuş güneşi, Poussin'in
  yazıtı ve gölgesi, Anguissola'nın tahtadaki yazıtı vb.).
- Doğrulama: 18 eser 4096'dan; **Salviati (Aziz Thomas) ve Rosso (Musa)** yalnız 1280 kopyadan (en büyük kopyaları yok).
- Kırpıntıdan sonra düzeltilenler: Anguissola imzası sola kaydı (yazıt kutunun solundan taşıyordu); Giulio Romano bileziği
  kutunun kenarındaydı, ortalandı; Baburen "parayı isteyen eller" kutusu aşağı alındı (üstteki el yaşlı kadının değil, genç
  kadının lavta sapını tutan eli; metin düzeltildi); Artemisia kabzanın sağ kolu taşıyordu, kutu genişletildi; Zurbarán "taş
  seki" boş griydi, başın değdiği kenara kaydırıldı; Poussin diz çöken çobanın kutusu saçta kalmıştı, yüze indirildi;
  Salviati'de kitap kutunun altından taşıyordu. Giulio Romano'da terlikler kırmızı değil, içi kırmızı siyah terlik (metin düzeltildi).

### Emin olunmayanlar (metinde yumuşatıldı)
- Velázquez: papanın "fazla gerçek" (troppo vero) dediği bir rivayettir; metinde öyle yazıldı.
- Rosso: hangi figürün Musa olduğu (ortadaki siyah kumaşlı genç: yaygın görüş).
- Pontormo: sağ kenardaki adamın otoportre olduğu; Rembrandt: oturan bereli adamın kimliği; babanın "farklı elleri" yorumu.
- Artemisia: bilezikteki Artemis/Diana figürleri (bazı araştırmacılar).
- Steen: kızın kucağındaki bebeğin aziz figürü olarak okunması (kurs notundaki gibi "benzer" dendi).
- Carracci: kaplanın Bakkhus'un Hindistan dönüşünü çağrıştırması genel ikonografi bilgisidir, panoya özgü bir kaynak değil.
- Rigaud: kralın yaşı "altmışını geçmiş" diye yazıldı (1638 doğumlu, portre 1701).
- Volterra: freskin aşınmış yüzeyinde İsa'nın yüzü ve bayılan Meryem kırpıntıda bile silik; kutular figürün tamamına göre verildi.

### Kalan plan (DURUM.md'nin numaralarına dikkat)
`durum.py` partileri kalanlardan yeniden numaralar. Bu turdan sonra DURUM.md'de:
- **Parti 1** = plan Parti 3 (Claude Lorrain → Millais, 20 eser), **Parti 2** = plan Parti 4 (Ingres → Munch, 20 eser),
  **Parti 3** = plan Parti 5 (Kirchner → Bacon, 7 eser). Kalan 47 eser. §4 tablosundaki notlar geçerli.
- Emre plan Parti 3'ü başka bir oturumda başlattı: o oturum da `eser_ayrintilari.json`, DEVIR, DURUM, KARARLAR ve sürüm
  dosyalarına yazacağı için birleştirmede çakışma çıkar. Çözüm bu turdaki gibi: main'in dosyalarını al, kendi kayıtlarını
  sona ekle, İş ve sürüm numarasını bir artır, `durum.py`'yi yeniden çalıştır.

## Sonraki modele hazır istem

> Sanat Atlası deposunda rehberli eser incelemesine devam et (KARARLAR İş 151–153). Önce `scripts/ayrinti/TALIMAT.md`,
> `scripts/ayrinti/DEVIR.md` (en alttaki Tur 3 raporu) ve `scripts/ayrinti/DURUM.md`'yi oku. Önce main'i çek; `DURUM.md`'deki
> **Parti 1**'in eserleri için `data/eser_ayrintilari.json`'a kayıt ekle: her eserde 4–6 ayrıntı noktası, `{x, y, w, h}`
> 0–1 oranlı, 2–3 cümlelik Türkçe açıklama; `bak` ayrıntılarını noktalara al. İki aşamalı doğrulamayı atlama (1280 ızgara
> → 4096 kırpıntı, `scripts/ayrinti/yardimci/`). Bitince `denetle.py` sıfır hata, `durum.py` ile DURUM.md, DEVIR.md'ye yeni
> "Tur" raporu, KARARLAR'a not, `npm run test:unit` geçsin; `sw.js`, `js/surum.js` ve sürüm testlerinde
> (`tests/unit/paket8.test.mjs`, `tests/e2e/paket8.spec.js`) yama sürümünü yükselt, PR aç. `tools/` ve `data/sanatcilar.json`
> içeriğine dokunma. Yarım eser bırakma; DEVIR ve DURUM'u mutlaka güncelle.

---

# Tur 4 · Plan Parti 3 (Claude, Claude Code)

**Numaralama notu:** Bu tur, Tur 3 (plan Parti 2, İş 153) ile aynı anda başka bir oturumda yapıldı; o önce main'e
birleşti. Bu iş main'in üstüne yeniden kuruldu: kayıtlar `eser_ayrintilari.json`'un sonuna eklendi, İş 154 / 1.71.3
olarak numaralandı, `durum.py` yeniden çalıştırıldı. Anahtarlar çakışmıyor.

## Yapılanlar

- 20 eser: Claude Lorrain, S. Ricci, Watteau, Boucher, Fragonard, Tiepolo, Chardin, Greuze, B. West, A. Kauffman,
  David, Vigée Le Brun, Blake, Friedrich, Fuseli, Constable, Delacroix, Goya, Turner, Millais. 117 nokta (17 eserde 6,
  3 eserde 5). Toplam 80 / 107 eser, 466 nokta.
- Her eserde `bak`'taki üç ayrıntı noktalara alındı (Ophelia'nın "en sağdaki mor çiçekleri" hariç, aşağıda); metinler
  kaydın `bolumler` olgularına dayanır.
- 4096'lığı **olmayan** iki eser 1280'den doğrulandı: Boucher (Sarışın Odalık; 1280'lik kopya da yalnız 1100 px) ve
  Kauffman (Kornelia). Ricci (2024 px) ve Turner (2152 px) için "d" kopyası var ama küçük; yakınlaşma biraz yumuşak kalır.
- Aşama 2'de düzeltilenler (4): **Goya "Avuçtaki iz"** ilk seçimde bize göre sağdaki ele konmuştu; 4096'da iki eli yan
  yana kırpınca iz adamın **sağ** avucunda (bize göre solda, x≈0,22) çıktı, kutu oraya taşındı. **Tiepolo "Marcus
  Antonius"** kutusunun ortası yanındaki sakallı adamdaydı; miğferli figüre kaydırıldı. **Greuze aslan başı** üstten,
  **Vigée Le Brun tacı** üstten ve soldan kesiliyordu.
- Yardımcı: Tur 2'deki gibi `r/NN.json` taslaklarını birleştiren ve tek kutuyu düzelten iki küçük scratch betiği
  (depoya girmedi).

## Emin olunmayanlar

- **West "Koşan haberci":** haberci en solda çok küçük; kutu yeşil giyimli askerin işaret eden eliyle birlikte haberciyi
  alıyor, nokta elin üstüne düşüyor. Haberin Quebec zaferi olduğu genel bilgi (kayıtta yok).
- **Kauffman "Açılan el":** Kornelia'nın "Benim mücevherlerim bunlar" sözü öykünün bilinen hâli (Valerius Maximus);
  kayıtta söz geçmiyor, metne eklendi.
- **Ricci:** sağdaki genç "Davut'un habercisi olabilir" diye yumuşatıldı (kaydın ifadesi). Çeşme "hayvan başı" diye
  bırakıldı (ejder ya da yunus olabilir).
- **Watteau:** "Kalkmaya yardım" ve "Geriye son bakış" çiftleri Rodin'in okumasına göre adlandırıldı; tablo
  yönünün (varış mı ayrılış mı) tartışmalı olduğu metinde.
- **Chardin "Masadan taşan bıçak":** "sonraki natürmortlarında da kullanır" genel bilgi, kayıtta yok.
- **Delacroix:** silindir şapkalının burjuvaziyi temsil ettiği yaygın okuma; Delacroix'nın kendisi olduğu tartışmalı
  bırakıldı. İmza "Eug. Delacroix 1830" 4096'da okunuyor.
- **Millais:** `bak`'taki "en sağdaki mor çiçekler" ayrı nokta yapılmadı (7. nokta olurdu); yaban gülleri metninden de
  çıkarıldı, çünkü kutunun içinde değiller. Kafatası iddiasına (tartışmalı) yer verilmedi.
- **Blake:** görsel kâğıt kenarlı sayfa fotoğrafı; koordinatlar kâğıdı içeriyor.
- **Goya:** kurbanlar arasındaki keşiş kutusu yanındaki adamın başını da alıyor; keşiş aşağıda, elleri kavuşmuş.

## Kalan plan

27 eser. `DURUM.md` artık "Parti 1" = plan Parti 4 (Ingres → Munch, 20 eser), "Parti 2" = plan Parti 5
(Kirchner → Bacon, 7 eser) diyor. Plan Parti 5'teki 5 eserin (Guernica, Höch, Dalí, Magritte, Bacon) uygulamada yerel
görseli yok (`coz.py` "yerel kopya yok" der); görsel çözülmeden ayrıntı noktası eklenemez (telif nedeniyle büyük
olasılıkla bilerek görselsiz). §4 tablosundaki notlar geçerli.

## Sonraki modele hazır istem

> Sanat Atlası deposunda rehberli eser incelemesine devam et (KARARLAR İş 151–154). Önce `scripts/ayrinti/TALIMAT.md`,
> `scripts/ayrinti/DEVIR.md` (özellikle en alttaki Tur 4 raporu) ve `scripts/ayrinti/DURUM.md`'yi oku.
> Önce main'i çek; `DURUM.md`'deki **Parti 1**'in (Ingres → Munch) 20 eseri için `data/eser_ayrintilari.json`'a kayıt ekle: her
> eserde 4–6 ayrıntı noktası, `{x, y, w, h}` 0–1 oranlı, 2–3 cümlelik Türkçe açıklama; eserin
> `data/basyapitlar.json`'daki `bak` ayrıntılarını noktalara al. İki aşamalı görsel doğrulamayı atlama: 1280 px kopyada
> ızgarayla seç, her kutuyu 4096 px kopyadan payla kırpıp doğrula ve düzelt (`scripts/ayrinti/yardimci/` betikleri).
> Bitince `python3 scripts/ayrinti/denetle.py` sıfır hata vermeli, `python3 scripts/ayrinti/durum.py` ile `DURUM.md`'yi
> yenile, `DEVIR.md`'ye "Tur 5" başlığıyla kendi raporunu ekle, `KARARLAR.md`'ye kısa not yaz, `npm run test:unit`
> geçsin, `sw.js`, `js/surum.js` ve sürüm testlerinde (`tests/unit/paket8.test.mjs` — iki yerde, regex dahil —,
> `tests/e2e/paket8.spec.js`) yama sürümünü yükselt (1.71.x), PR aç. `tools/` ve `data/sanatcilar.json` içeriğine
> dokunma. Kredi azalırsa bitirdiğin eserlerde dur; yarım eser bırakma; DEVIR ve DURUM'u mutlaka güncelle.

---

# Tur 5 · Plan Parti 4 ve Parti 5 (Claude, Claude Code)

Emre "DEVIR.md'yi oku, 4. partiyı yap" dedi: §4 tablosundaki **plan Parti 4** (Ingres → Munch). İş sürerken "son resimleri
de yap" dedi: **plan Parti 5** (Kirchner → Bacon, 7 eser) da bu turda yapıldı. Plan Parti 3 aynı anda başka bir oturumda
yapıldı (Tur 4, İş 154, PR #174) ve önce birleşti; bu tur onun üstüne birleştirildi (İş 155, 1.71.4). Toplam **107 / 107** eser,
619 nokta: bütün başyapıtlar bitti.

### Yapılanlar
- 20 başyapıt, 115 nokta (Ingres, Gérôme, Bouguereau, Daumier, Courbet, Millet, Caillebotte, Degas, Cassatt, Morisot, Monet,
  Hiroshige, Hokusai, Cézanne, Seurat, Van Gogh, Toulouse-Lautrec, Redon, Klimt, Munch). Çoğunda 6 nokta; Morisot, Hokusai,
  Cézanne, Redon ve Munch'ta 5.
- Kayıtların `bak` ayrıntılarının hepsi bir noktada (Ingres'in imzası, Gérôme'un köpeği ve imzası, Daumier'nin kareleme izi,
  Courbet'nin kafatası ve köpeği, Millet'nin atlısı, Degas'nın sulama kabındaki imza, Cassatt'ın imzası, Monet'nin "72"si,
  Hiroshige'nin kartuşları ve mühürleri, Lautrec'in M'si ve "Ch. Levy"si, Klimt'in imzası, Munch'un kurşun kalem notu vb.).
- Doğrulama: 20 eserin hepsi en büyük kopyadan; **Cézanne'ın** "en büyük" kopyası yalnız 1683 px (yakınlaşma yumuşak kalır).
- Kırpıntıdan sonra düzeltilenler: Ingres sırtı omuz ve kalçayı almıyordu (genişletildi), imzanın "1814"ü kutunun sağında ve
  altındaydı; Daumier kareleme kutusu boş bir kasadaydı, ızgara en net çocuğun dizlerinde görüldü (kutu oraya alındı, "uyuyan
  çocuk" kutusu üst bedene daraltıldı); Millet hasatçılar kutusu sağdaki kadının başına değiyordu; Caillebotte imzası alttan
  kesiliyordu; Cassatt ayakkabısı ve imzanın "y"si alttan taşıyordu; Morisot'da çeneye dayanan el kutunun altındaydı;
  Hiroshige köprüdeki yolcular, kartuş ve imza kartuşu kenarda kalıyordu; Lautrec matbaa yazısı kutusu siyah tarama kenarına
  taşıyordu; Munch'ta sağ el kutunun dışındaydı. Metin: Ingres'te "el" aslında bacağın üstünde, yanında nargile ağızlığı;
  Bouguereau'da yunusa binen Eros değil, öndeki putto (Eros arkada ayakta); Millet'de ortadaki kadının öbür eli görünmüyor.

### Plan Parti 5 (7 eser, 38 nokta)
- Kirchner 6, Kandinsky 5, Picasso 6, Höch 6, Dalí 6, Magritte 4, Bacon 5 nokta; `bak` ayrıntılarının hepsi bir noktada.
- **WikiArt görselleri:** Picasso, Höch, Dalí, Magritte ve Bacon'ın uygulamadaki görseli R2'de değil, WikiArt'tan (telifli
  20. yüzyıl eserleri indirilmiyor). Koordinatlar uygulamanın gösterdiği WikiArt görseline (çoğunda `!HalfHD`) göre;
  `gorsel` alanı `wikiart:<adres>`. `denetle.py`'nin `gorsel_adlari` yerel kopya yoksa bu kaynak anahtarını döndürür; böylece
  görsel değişirse yine hata verir. Doğrulama aynı dosyanın ekisiz büyük kopyasından yapıldı (oranlar aynı: Guernica 3369,
  Dalí 2000, Magritte 1442, Bacon 1646 px). Höch'ün görseli yalnız 375×471: yakınlaşma bulanık kalır, nokta sayısı yine 6.
- Düzeltilenler: Guernica'da "kırık kılıç ve çiçek" kutusu çiçeği almıyordu (yukarı uzatıldı, çiçek yumruğun hemen üstünde,
  çok küçük), ampul-lamba kutusu lambayı alttan kesiyordu; Höch monogramı, Dalí ve Magritte imzaları alttan taşıyordu; Bacon'da
  sarkan başın çenesi ve ot öbeğinin altı kutu dışındaydı. Metin: Kirchner'in eldiveni altındaki imzası eklendi.
- Emin olunmayanlar: Kirchner'de sağ üstteki atın kesin sınırı (yarı soyut; kutu baş ve boyun bölgesini alır); Kandinsky'de
  "halkalı oval"in kaydın "sağ üst"teki oval olduğu (tablonun üst ortasının sağı); Höch'te bıyıklı yüzün kimliği yazılmadı,
  haritanın kadınların oy hakkını gösterdiği "düşünülür"; Guernica'da ampul/bomba ses oyunu "öne sürülür", boğa/at açıklaması
  "Picasso'ya atfedilen"; Dalí'nin uyuyan yüzü "genellikle yorumlanır"; Bacon'ın Eumenidler ve Potemkin kaynakları genel bilgi.

### Emin olunmayanlar (metinde yumuşatıldı ya da genel tutuldu)
- Munch: kurşun kalem notu 4096 kopyada bile seçilmedi; "Kızıl gökyüzü" kutusu sol üst gökyüzünü alır, metin notun ekranda
  büyük olasılıkla görünmeyeceğini söyler (kaydın kendi ifadesi).
- Millet: atlının kâhya olduğu "genellikle yorumlanır" diye yazıldı. Seurat: giysilerin Grande Jatte'la karşıtlığı "düşünülür".
- Van Gogh: en parlak yıldızın Venüs (sabah yıldızı) olduğu "düşünülür"; kulenin Hollanda kiliselerini andırdığı "sık söylenir".
- Cassatt: Degas'nın arka planda çalıştığı Cassatt'ın sonraki bir mektubuna dayanır.
- Klimt: dikdörtgen/daire = eril/dişil bir yorumdur ("yorumlanır").
- Hiroshige: yayıncı mührünün Uoya Eikichi'ye ait olduğu genel bilgi; yağmurun "iki açı" katmanı 4096'da hafif seçiliyor.
- Hokusai: levhanın adı (Gaifū kaisei, "Kırmızı Fuji") yalnız "Kırmızı Fuji" diye geçti; kaydın başlığı bütün diziyi anar.
- Gérôme imzası "J.L.GEROME" okunuyor; metinde yalnız "Gérôme'un imzası" dendi. Lautrec matbaası afişte "CH LEVY" (aksansız).

### Kalan plan
Başyapıtların hepsinde rehberli inceleme var. Yeni başyapıt eklenirse (`data/basyapitlar.json`) `durum.py` onu "kalan"
olarak gösterir; aynı kurallarla (TALIMAT.md, iki aşamalı doğrulama) kayıt eklenir. Görseli değişen eseri `denetle.py` yakalar:
koordinatlara yeni görselde yeniden bakılır.

## Sonraki modele hazır istem

> Sanat Atlası'nda rehberli eser incelemesi 107 başyapıtın hepsinde bitti (KARARLAR İş 151–155). Yeni başyapıt eklendiyse ya da
> `python3 scripts/ayrinti/denetle.py` "gorsel değişmiş" hatası veriyorsa: `scripts/ayrinti/TALIMAT.md` ve bu dosyanın Tur 5
> raporunu oku, `scripts/ayrinti/DURUM.md`'deki kalanlar ya da hatalı kayıtlar için iki aşamalı doğrulamayla (1280 ızgara → en büyük
> kopya kırpıntısı) noktaları yaz/düzelt; `denetle.py` sıfır hata, `durum.py`, DEVIR'e tur notu, KARARLAR, README sayıları,
> `npm run test:unit`, yama sürümü (`sw.js`, `js/surum.js`, sürüm testleri), PR. `tools/` ve `data/sanatcilar.json`'a dokunma.
