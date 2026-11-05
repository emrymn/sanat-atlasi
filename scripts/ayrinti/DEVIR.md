# Rehberli eser incelemesi — devir raporu

**Tur 1 · 5 Kasım 2026 · Claude (Claude Code, pilot).** 20 başyapıt, 119 nokta. Sürüm 1.71.0, KARARLAR İş 151.
Bir sonraki model önce `TALIMAT.md`'yi, sonra bu dosyayı, sonra `DURUM.md`'yi okur; en altta hazır istem var.

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

## 6. Sonraki modele hazır istem

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

## Tur 2 · 5 Kasım 2026 · Claude (Claude Code) · plan Parti 2

Emre "sıradaki partiyi yap" dedi, sonra açıkça **Parti 2**'yi istedi; bu yüzden plan Parti 1 (Berlinghieri → Veronese) **yapılmadı**, hâlâ açık.
Sürüm 1.71.1, KARARLAR İş 152.

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
- **Parti 1** = plan Parti 1 (Gotik → Yüksek Rönesans + Tintoretto, Veronese; 20 eser) — sıradaki iş bu.
- **Parti 2** = plan Parti 3 (Claude Lorrain → Millais), **Parti 3** = plan Parti 4, **Parti 4** = plan Parti 5 (7 eser).
Tablodaki (§4) notlar geçerli. Hazır istem (§6) aynen kullanılabilir; yalnız "Tur 2" yerine "Tur 3" başlığı ve 1.71.2 sürümü.
