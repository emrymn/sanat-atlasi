# İş 193 · Tanıma kırpımları — nasıl üretildi, nasıl sürdürülür

Konu sayfasındaki "Resimde nasıl tanınır?" maddelerinin ve sanatçı sayfasındaki "Nasıl tanırım?" notunun yanında
eserden yakın plan kırpım. Veri: `data/tanima_kirpimlari.json` (bu klasördeki dosyalardan **üretilir**, elle düzenlenmez).

## Durum (1.90.1)

- Konular: 110 konuda 338 kırpım (371 konu, 1723 madde). Sanatçılar: 154 sanatçıda 335 kırpım (159 notlu sanatçı):
  289'u hazır ayrıntılardan, 46'sı `yeni_sanatci.json`'da elle çizilen kutular (24 sanatçı).
- Eşleşen kutular rehberli incelemenin doğrulanmış ayrıntılarından (`data/eser_ayrintilari.json`) alındı; açıklama metni
  kopyalanmaz, uygulama aynı kutuyu ayrıntı kaydında bulup görüntüleyiciyi o kayıtla açar. Elle çizilen kutuların kendi
  `metin`i var: önce kısa bir "bak" cümlesi, sonra bilgi (1.90.1, Emre: "sadece betimleme yapıyorsun … daha çok
  bilgi versin").
- Her eşleşmeye kontak sayfasında bakıldı (madde metni + kırpım); maddeyi göstermeyen, bulanık ya da boş kırpımlar
  çıkarıldı (konularda 9 çıktı, 7'si başka ayrıntıyla değişti; sanatçılarda 8 çıktı).
- **Yeni kutu turu (19 Kasım 2026, sürüyor; 148 konu, 558 kutu bitti):** kırpımsız konulara en çok eseri olandan başlayarak elle kutu çiziliyor
  (`yeni_konu.json`; metin `scripts/ayrinti/BILGI_TURU.md` kuralıyla: bir "bak" cümlesi, gerisi bilgi). Maddeye uyan net bir
  ayrıntı yoksa madde boş bırakılır. Sıradaki konuyu bulmak için: kırpımı olmayan konuları eser sayısına göre sırala.
- Kalan iş: kırpımı olmayan konular (261; çoğunun eserlerinde hazır ayrıntı yok) için yeni kutu seçmek (aşağıda
  "Yeni kutu"). Sanatçılardan kalan 5: Praxiteles, Giovanni Pisano, Cellini, Canova (önbellekte eser yok), Man Ray (notu
  fotoğraflarını anlatıyor). `kontrol.py coklu s::anahtar …` ikişer eseri yan yana ızgaralı gösterir.

## Dosyalar

| Dosya | Ne |
|---|---|
| `eslesme_konu.txt` | `konuId Mi=Ej.n …`: i. madde ↔ `aday.py konu` dökümündeki j. eserin n. ayrıntısı |
| `eslesme_sanatci.txt` | `sanatçı \| eser anahtarı \| ayrıntı no \| özellik adı` (ad ≤ 34 karakter, nottaki özellikten) |
| `yeni_konu.json`, `yeni_sanatci.json` | (isteğe bağlı) elle çizilen yeni kutular: `{ "<id>": [{madde?, anahtar, sanatci, ad, metin, x, y, w, h}] }` ya da hazır ayrıntıdan `{e: anahtar, n: no, ad, madde?}` |
| `aday.py` | eşleştirme dökümü: maddeler/not + adayların ayrıntı adları |
| `donustur.py` | hepsini `data/tanima_kirpimlari.json`'a yazar; görsel adını uygulamadaki ilk görselle karşılaştırır |
| `kontrol.py` | kontak sayfaları (kırpım + metin), ızgara ve yakın görünüm |

## Akış

```bash
cd scripts/tanima_kirpim
python3 aday.py konu > /tmp/konu_aday.txt          # ya da: aday.py sanatci
# eslesme_*.txt'yi düzenle
python3 donustur.py
ATLAS_GORSEL=/tmp/tk python3 kontrol.py konu [konuId …]   # /tmp/tk/s/konu_NN.jpg sayfalarına Read ile bak
cd ../.. && node --test tests/unit/tanima_kirpim.test.mjs
```

## Yeni kutu (ayrıntısı olmayan eser)

1. `python3 kontrol.py izgara <sanatçı> <anahtar>` → 0,1 ızgaralı 1280'lik; `yakin … x0 y0 x1 y1` ile yaklaş.
2. Kutuyu `yeni_*.json`'a yaz: `metin` zorunlu, 3–4 cümle. Bir cümle neye bakıldığını söyler; gerisi bilgi verir:
   konu/hikâye, teknik, sipariş/bağlam, sanatçıyı benzerlerinden ayıran ipucu. Yalnız betimleme yazma. Bilgi
   sanatçının `taninma`/`anlatim` notuyla çelişmemeli ve iyi bilinen olgu olmalı; emin olunmayan "denir/düşünülür" ile
   yazılır ya da hiç yazılmaz. Eser konuda (`ikonografi.json → eserler`) ya da sanatçının listesinde olmalı.
3. `donustur.py`, `kontrol.py`, test. Kurallar `scripts/ayrinti/TALIMAT.md` §3–5 ile aynı (kutu ayrıntıyı tam içine alır,
   görselin %60'ından büyük olmaz).

## Uygulamadaki davranış

- `js/tanimaKirpim.js` (saf, birim testli), `js/ekranlar/tanimaKirpim.js` (yerleştirme). Kırpım yalnız eserin ekranda
  gösterilen görseli kutunun seçildiği görselse görünür ("Görsel kötü" ile başka kopyaya geçildiyse görünmez).
- Kırpım resmi 1280'lik kopyadır; en büyük kopya (`d/`) yalnız telefona indirilmişse kullanılır (`js/keskin.js`: kırpımda
  ekran alanı kutudan ölçülür, taşan resimden değil).
