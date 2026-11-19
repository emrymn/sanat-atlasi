# İş 193 · Tanıma kırpımları — nasıl üretildi, nasıl sürdürülür

Konu sayfasındaki "Resimde nasıl tanınır?" maddelerinin ve sanatçı sayfasındaki "Nasıl tanırım?" notunun yanında
eserden yakın plan kırpım. Veri: `data/tanima_kirpimlari.json` (bu klasördeki dosyalardan **üretilir**, elle düzenlenmez).

## Durum (1.90.0)

- Konular: 110 konuda 338 kırpım (371 konu, 1723 madde). Sanatçılar: 130 sanatçıda 289 kırpım (159 notlu sanatçı).
- Bütün kutular rehberli incelemenin doğrulanmış ayrıntılarından (`data/eser_ayrintilari.json`) alındı; açıklama metni
  kopyalanmaz, uygulama aynı kutuyu ayrıntı kaydında bulup görüntüleyiciyi o kayıtla açar. Yeni kutu çizilmedi.
- Her eşleşmeye kontak sayfasında bakıldı (madde metni + kırpım); maddeyi göstermeyen, bulanık ya da boş kırpımlar
  çıkarıldı (konularda 9 çıktı, 7'si başka ayrıntıyla değişti; sanatçılarda 8 çıktı).
- Kalan iş: kırpımı olmayan konular (261; çoğunun eserlerinde hazır ayrıntı yok) ve sanatçılar (29: Pissarro, Sisley,
  Canaletto, Reni, Guercino, Ribera…) için
  yeni kutu seçmek (aşağıda "Yeni kutu").

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
2. Kutuyu `yeni_*.json`'a yaz: `metin` zorunlu (2 cümle: ne görülüyor + neden o özelliğin örneği; yalnız gözle görüleni
   yaz, bellekten tarih/isim ekleme). Eser konuda (`ikonografi.json → eserler`) ya da sanatçının listesinde olmalı.
3. `donustur.py`, `kontrol.py`, test. Kurallar `scripts/ayrinti/TALIMAT.md` §3–5 ile aynı (kutu ayrıntıyı tam içine alır,
   görselin %60'ından büyük olmaz).

## Uygulamadaki davranış

- `js/tanimaKirpim.js` (saf, birim testli), `js/ekranlar/tanimaKirpim.js` (yerleştirme). Kırpım yalnız eserin ekranda
  gösterilen görseli kutunun seçildiği görselse görünür ("Görsel kötü" ile başka kopyaya geçildiyse görünmez).
- Kırpım resmi 1280'lik kopyadır; en büyük kopya (`d/`) yalnız telefona indirilmişse kullanılır (`js/keskin.js`: kırpımda
  ekran alanı kutudan ölçülür, taşan resimden değil).
