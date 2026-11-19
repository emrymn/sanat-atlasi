# Bilgi turu: açıklamalar betimleme değil, bilgi versin

**Bunu okuyan yeni oturum:** iş yarım kaldıysa buradan devam et. Önce `python3 scripts/ayrinti/bilgi_turu.py durum`.

## Emre ne istedi (19 Kasım 2026)

> "ama sen sadece betimleme yapıyorsun ben onu istemiyorum daha çok bilgi versin"
> "dediğim şey geneldi sadece bunlar değil"

Uygulamadaki bütün ayrıntı açıklamaları için geçerli. Bu açıklamalar `data/eser_ayrintilari.json` dosyasında: 264
eser, 1497 nokta. Aynı metinler şu yerlerde görünüyor:

- rehberli inceleme,
- Başyapıt sayfasının kırpımları,
- Çalış'taki Gör adımı,
- konu ve sanatçı sayfalarındaki tanıma kırpımları.

Bu dosya düzelince hepsi düzelir.

Elle çizilen 46 sanatçı kırpımı `scripts/tanima_kirpim/yeni_sanatci.json` dosyasında; bunlar 1.90.1'de yapıldı ve
burada örnek olarak kullanılabilir.

## Kural

- **Betimleme en çok bir kısa cümle ya da yan cümle.** Yalnız neye bakılacağını söyler: "Sol üstte, kayalıkta diz
  çökmüş Franciscus". Renk, poz ve giysiyi tek tek saymak yok. Görüntüleyici zaten o ayrıntıya yakınlaşıyor, Emre
  onu görüyor.
- **Geri kalanı bilgi.** Sıra önemli değil; şunlardan biri ya da birkaçı:
  - hikâye ve kaynak: hangi metin, hangi olay, kim kimdir;
  - anlam ve simge: neden orada, ne anlatır;
  - teknik ve malzeme: nasıl yapılmış, neden yenilik;
  - bağlam: kimin için ya da nerede yapıldı, sonra kimi etkiledi;
  - **sınav ipucu:** bu ayrıntı sanatçıyı ya da akımı nasıl ele verir, kimden nasıl ayrılır.
- **Doğruluk.** Yalnız iyi bilinen olguları yaz.
  - Sanatçının `data/sanatcilar.json` notuyla (`taninma`, `anlatim`, `kurs_notu`) ve eserin `data/basyapitlar.json`
    kaydıyla (`ozet`, `bolumler`, `bak`) çelişme. `liste` komutu bu bağlamı gösterir.
  - Emin olmadığın şeyi ya "… diye yorumlanır", "… düşünülür" diye yaz ya da hiç yazma.
  - Eser atfına, kutulara (x, y, w, h) ve `ad`a dokunma.
- **Biçim.** `TALIMAT.md` §4: 60–420 karakter, 2–3 cümle (4 uyarı verir). Süs sözcüğü kullanma ("muhteşem",
  "ustaca"). Yabancı terimi ilk geçtiği yerde Türkçe açıkla.
- **Zaten bilgi veren metne dokunma.** Bu durumda `uygula` dosyasına `null` yaz. Örnek: Cimabue çarmıhının "Omza düşen
  baş" noktası, Christus patiens/triumphans bilgisini zaten veriyor. Çoğu metin karışıktır; yalnız betimleme olan
  cümleleri değiştir.

### Örnek

Önce (betimleme ağırlıklı):

> Yuhanna'nın keder jesti: Sağ kol ucunda Yuhanna yanağını eline dayamış: klasik bir keder jesti. Hemen yanında,
> İsa'nın elinden süzülen ince kan çizgisi görülür. Kan genellikle kurtuluşa gönderme olarak okunur.

Sonra:

> Yanağını eline dayamak antik çağdan gelen bir yas jestidir; Cimabue onu Bizans'ın donuk yas figürlerine insani bir
> keder katmak için kullanır. Yuhanna, İsa'nın çarmıhta annesini emanet ettiği "sevgili öğrenci"dir; bu yüzden
> çarmıhın iki ucunda hep Meryem'in karşısında durur.

## İş akışı

1. `python3 scripts/ayrinti/bilgi_turu.py liste 5` komutu sıradaki 5 eseri gösterir. Sıra `basyapitlar.json`
   sırasıdır.
2. Scratchpad'e bir JSON yaz. Biçimi `{ "<anahtar>": { "<nokta adı>": "yeni metin" | null } }`. Her noktaya karar
   ver; eksik ad kabul edilmez.
3. `python3 scripts/ayrinti/bilgi_turu.py uygula <dosya>` komutu metinleri yazar, eserleri "bitti"ye ekler
   (`bilgi_turu_durum.json`) ve `denetle.py`'yi çalıştırır. Hata 0 olmalı.
4. Her 10–20 eserde bir commit at ve push'la. Commit mesajı şöyle: `Bilgi turu: N/264 eser`. Böylece hak biterse iş
   kaybolmaz.
5. Tur bitince:
   - `npm run test:unit`;
   - sürüm artışı: `sw.js` ve `js/surum.js`, `tests/unit/paket8.test.mjs` ve `tests/e2e/paket8.spec.js`;
   - `js/yenilikler.js`'e bir satır; `tests/e2e/paket8.spec.js`'deki `nth(…)` '1.33 ·' indeksini 1 artır;
   - `KARARLAR.md`'ye bir bölüm.

   Sürümü tur bitmeden de yükseltebilirsin. Ara sürüm de olur; telefona yeni metinler ancak sürüm değişince gelir.

## Durum

`bilgi_turu_durum.json` → `bitti`. Dal: `claude/gallant-hypatia-6fkv8i`, PR emrymn/sanat-atlasi#229 (taslak).
Emre açıkça istemedikçe birleştirme (merge) yapma.
