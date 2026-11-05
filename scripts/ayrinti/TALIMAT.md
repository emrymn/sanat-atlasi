# Rehberli eser incelemesi — talimat (devam edecek model için)

Bu depo bir sanat tarihi çalışma uygulaması (Sanat Atlası, iPhone'da PWA, bütün metinler Türkçe). Başyapıt
görüntüleyicisinde tablonun üstünde **4–6 numaralı ayrıntı noktası** var: noktaya dokununca o bölge en büyük kopyadan
(4096 px) yakınlaşır ve altta 2–3 cümlelik Türkçe açıklama çıkar. Senin işin `data/basyapitlar.json`'daki **kalan
başyapıtlar** için bu noktaları seçmek, koordinatlarını görselde doğrulamak ve açıklamaları yazmak.

Önce oku: `scripts/ayrinti/DEVIR.md` (önceki modelin raporu, plan, hazır istem), `scripts/ayrinti/DURUM.md`
(ne bitti, ne kaldı). Bitince: `python3 scripts/ayrinti/denetle.py` hatasız geçmeli, `python3 scripts/ayrinti/durum.py`
ile DURUM.md yenilenmeli, DEVIR.md'ye kendi raporunu eklemeli, KARARLAR.md'ye kısa bir "İş" notu yazmalısın.

## 1. Veri biçimi (`data/eser_ayrintilari.json`)

```json
{
 "surum": 1,
 "eserler": [
  {
   "anahtar": "Q220859",                       // data/basyapitlar.json'daki anahtarla BİREBİR aynı (QID ya da "sanatçıId|başlık")
   "sanatci": "jan-van-eyck",                  // başyapıt kaydındaki sanatci
   "baslik": "Arnolfini Portresi",             // kısa Türkçe ad (yalnız okunabilirlik için)
   "gorsel": "84d3c15e96896efe",               // noktaların seçildiği görselin yerel adı (aşağıda nasıl bulunacağı)
   "noktalar": [
    {"ad": "Ayna ve imza", "x": 0.40, "y": 0.19, "w": 0.20, "h": 0.18, "metin": "… 2–3 cümle …"}
   ]
  }
 ]
}
```

- `x, y` kutunun **sol üst köşesi**, `w, h` **boyu**; hepsi görselin genişlik/yüksekliğine oranla **0–1**. İki ondalık yeter.
- Koordinatlar **uygulamadaki görsel dosyasına** göredir, tuvale göre değil: fotoğrafta çerçeve ya da duvar varsa
  (Mérode, Giotto'nun bordürü) onlar da görselin parçasıdır.
- Uygulama kutunun **ortasına** numaralı nokta koyar ve dokununca kutuyu ekrana sığdırır (kutu ekranın ~%78'ini
  kaplayacak kadar yakınlaşır, en çok 6×). Kutu ayrıntıyı **tam içine almalı**, biraz pay bırakılabilir.
- Bir kayıt = bir başyapıt. Noktaların sırası izleme sırasıdır (önemli olandan başla; Önceki/Sonraki bu sırayla gezer).

## 2. Görseli bulma ve iki aşamalı doğrulama (zorunlu)

Bu adımların hazır kodu `scripts/ayrinti/DEVIR.md`'de ("Yardımcı betikler"). Özet:

1. Başyapıt kaydından (`anahtar`, `sanatci`) uygulamadaki eseri bul: `data/eserler_onbellek.json` →
   `sanatcilar[sanatci].eserler` içinde `qid == anahtar` ya da `"sanatci|baslik" == anahtar`. İlk `gorseller[0]` görseldir.
2. Yerel adı: `data/yerel_gorseller.json` → `gorseller["<k>:<d|i|u>"]` (ör. `commons:Dosya.jpg` → `84d3c15e96896efe`).
   Bu ad kayda `gorsel` olarak yazılır.
3. Adresler (`data/gorsel_kaynagi.json`: `adres`, `surumler`, `b_surumler`, `devasa`):
   - 1280 px kopya: `<adres>/b/<ad>[-<b_surumler[ad]>].jpg`
   - 4096 px (en büyük) kopya, yalnız `devasa` listesindeyse: `<adres>/d/<ad>[-<surumler[ad]>].jpg`
4. **Aşama 1 — seçim:** 1280'lik kopyayı 0,1 adımlı ızgarayla (kırmızı çizgiler, kenarda 0.1…0.9) küçültüp bak,
   noktaları ve kutuları orada seç. **Bütün tabloyu 4096'da inceleme** (gereksiz, pahalı).
5. **Aşama 2 — doğrulama:** her kutuyu en büyük kopyadan, çevresine kutunun %25–40'ı kadar pay bırakarak kırp,
   kutuyu kırmızı çerçeveyle çiz, bir kontak sayfasında (3 sütun) bak. Soru: *ayrıntı kutunun tamamen içinde mi, kutu
   gereksiz yere büyük mü, yanlış şeyi mi çerçeveledim?* Düzelt ve yalnız düzelttiklerini yeniden kırpıp bak.
   En büyük kopyası olmayan eserde (ör. Fra Angelico'nun Müjde'si) doğrulama 1280'likten yapılır; DEVIR.md'ye not düş.
6. Görsel sonradan değişirse (`gorsel` alanı uygulamadakiyle uyuşmazsa) `denetle.py` hata verir: koordinatlara yeniden bak.

## 3. Ayrıntı seçimi

- 4–6 nokta. Altıya zorlanma; dört iyi nokta altı zayıf noktadan iyidir.
- Seçilecekler (öncelik sırasıyla): (a) tablonun **ünlü ayrıntısı** (Arnolfini aynası, Holbein'in kurukafası, Mérode'un
  pencereden giren çocuğu, Manet'nin imzalı şişesi); (b) **anlam taşıyan nesne/jest** (sönen mum, kopuk tel, fare
  kapanı); (c) **teknik/üslup kanıtı** (Vermeer'in ışık noktaları, Masaccio'nun hava perspektifi, Giotto'nun sırtı
  dönük figürleri); (d) **otoportre, imza, tarih, yazıt**; (e) kompozisyonun kilit figürü. Kurs notlarında
  (`data/basyapitlar.json` → `bolumler`, `bak`) geçen ayrıntılar öncelikli: öğrenci onları sınavda görecek.
- Kutu küçük olmalı ama kopuk olmamalı: bir yüz + el, bir nesne + yakın çevresi. Görselin %60'ından büyük kutu
  "ayrıntı" değildir (denetle hata verir). Tablonun bütün yarısını işaretleme.
- Noktalar **örtüşmesin** (IoU ≤ 0,35, merkezler ≥ 0,04 uzak). Bir figürün iki ayrıntısı gerekiyorsa kutuları ayır
  (Bronzino: "Aldatma"nın gövdesi ile "Oyun"un üst bedeni) ya da birleştir.
- Tablonun bütününe dağıt: hepsi ortada toplanmasın; ama köşe için köşe seçme.
- Çok figürlü tablolarda (Atina Okulu, Orgaz) kimlik açık olmalı: "sağ kenarda siyah bereli genç" gibi adres ver.

## 4. Açıklama yazımı (`metin`)

- **2–3 cümle, 60–420 karakter.** Türkçe, sade müze dili: dolu cümleler, süs yok, "muhteşem/etkileyici" yok.
- Düzen: 1) **ne görülüyor** (nerede, ne); 2) **ne anlama geliyor** ya da **neden önemli**; 3) isteğe bağlı: teknik,
  tarih ya da küçük bir hatırlatıcı. Öğrencinin sınavda eseri tanımasına yarayacak şey öne.
- Olgular doğrulanmış olmalı. Tartışmalı yorumları yumuşat ("… olarak yorumlanır", "… olduğu düşünülür"). Emin
  olmadığın tarih/isim yazma; DEVIR.md'de "emin olunmayanlar"a not düş.
- Yabancı terimlerin ilk geçişinde Türkçe karşılık: "anamorfoz", "hortus conclusus (kapalı bahçe)", "pointillé".
- `ad` 2–40 karakter, kayıt içinde tekil, başlık gibi: "Tek mum", "Perdenin ardındaki çarmıh". Soru işareti yok.
- Tırnak: ASCII `"` kullanılabilir (JSON'da kaçışla). Çift boşluk ve noktalama önünde boşluk olmasın.

### İyi örnek
```json
{"ad": "Lavta ve kopuk tel", "x": 0.50, "y": 0.54, "w": 0.26, "h": 0.16,
 "metin": "Lavtanın tellerinden biri kopmuş; uyumun bozulduğunu anlatır. Yanındaki açık kitap Luther'in ilahi kitabıdır. Katolik Fransa ile Protestan Avrupa arasındaki din bölünmesine ince bir gönderme."}
```
Neden iyi: kutu lavta + ilahi kitabı + flütleri tam alır, pay az; ilk cümle görüleni, ikincisi yanındaki kanıtı, üçüncüsü
anlamı veriyor; her cümle bir olgu.

### Kötü örnek
```json
{"ad": "Figürler", "x": 0.0, "y": 0.4, "w": 0.9, "h": 0.6,
 "metin": "Bu bölümde birçok figür görülüyor. Sanatçı burada çok etkileyici bir kompozisyon kurmuş ve renkleri ustaca kullanmış."}
```
Neden kötü: kutu tablonun yarısı (ayrıntı değil); ad belirsiz; metin hiçbir şey söylemiyor ("etkileyici", "ustaca"),
hangi figür, ne anlamı var belli değil.

## 5. Kaçınılacak hatalar (önceki turda yaşananlar)

- **Yanlış nesne:** Mérode'da "pencereden gelen çocuk" ilk seçimde sağdaki pencereye konmuştu; çocuk soldaki yuvarlak
  pencereden girer. 4096'dan kırpmadan önce doğru sanılmıştı → aşama 2 atlanmaz.
- **Kutunun dışında kalan ayrıntı:** Géricault'da Argus gemisi ilk kutunun hemen solundaydı; Holbein'in kurukafası
  kutunun solundan taşıyordu. Kırpıntıda ayrıntının kenara değdiğini görürsen kutuyu büyüt.
- **Örtüşen kutular:** Bronzino'da "Aldatma" ile "Gül atan Oyun" aynı bölgeyi paylaşıyordu; kutular ayrıldı.
- **Fazla cümle:** soru işaretli başlık ("Nereden geliyoruz? Neyiz? …") 5 cümle sayılmıştı; alıntıyı tek cümleye sığdır.
- **Kısaltma noktası:** "IV. Sixtus", "S. Gripe", "y. 1440" cümle sonu değildir; denetleyici bunları tanır, ama yeni
  kısaltma türü eklersen `denetle.py`'deki `cumle_sayisi`'ni güncelle.
- **Kutu merkezinde nokta:** uygulama noktayı kutunun ortasına koyar; ayrıntı kutunun bir köşesindeyse numara boşlukta
  durur. Kutuyu ayrıntıya ortala.
- Başyapıtlar dışındaki eserlere kayıt ekleme (anahtar başyapıtlarda yoksa denetleyici hata verir; uygulama yine de
  sanatçı sayfasından gösterir ama pilotun kapsamı başyapıtlar).

## 6. Bitirmeden önce

```bash
python3 scripts/ayrinti/denetle.py     # 0 hata olmalı
python3 scripts/ayrinti/durum.py       # DURUM.md yenilenir
npm run test:unit                      # tests/unit/ayrinti.test.mjs denetleyiciyi de çalıştırır
```
`DEVIR.md`'ye: yaptıkların, emin olmadıkların, kalan plan. `KARARLAR.md`'ye kısa iş notu. `tools/` ve
`data/sanatcilar.json` içeriğine dokunma.
