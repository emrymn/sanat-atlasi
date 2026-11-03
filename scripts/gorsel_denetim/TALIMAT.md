# Görsel denetimi — talimat (Gemini için)

Bu depo bir sanat tarihi çalışma uygulaması (Sanat Atlası). Uygulama eserlerin fotoğraflarını sorularda gösteriyor:
"Bu eser kimin?" Bazı fotoğraflar soru için uygun değil. Senin işin **yalnız fotoğrafa bakıp** her eser için karar vermek.

## Ne yapacaksın

1. `scripts/gorsel_denetim/parti_NNN.json` dosyasını aç (sana hangi parti verildiyse). Her satır bir eser:
   `anahtar`, `gorsel` (depodaki 400 px küçük resim), `sanatci`, `akim`, `baslik`, `yil`.
2. Her eserin `gorsel` dosyasını **aç ve bak**. Başlığa ve sanatçıya göre fotoğraf eseri düzgün gösteriyor mu?
3. Sonucu `scripts/gorsel_denetim/sonuc_NNN.json` dosyasına yaz (aynı numara). Biçim aşağıda.
4. **Yalnız `scripts/gorsel_denetim/sonuc_NNN.json` dosyalarını yaz; başka hiçbir dosyayı değiştirme ya da silme.**
   Git ya da başka komut çalıştırma (commit/push'u Emre yapar). Bir partiyi bitirince sonraki partiye geç; zaten
   `sonuc_NNN.json`'u olan partiyi atla.

## Kararlar

| karar | ne zaman | neden (birini seç) |
|---|---|---|
| `uygun` | Eser bütünüyle, düzgün ve renkleriyle görünüyor. İnce bir çerçeve kenarı sorun değil. | — |
| `kotu` | Eser var ama soruda kötü durur. | `salon` (müze duvarı, ziyaretçiler, oda görünüşü) · `cerceve` (kalın çerçeve resmin büyük bölümünü kaplıyor) · `ayrinti` (eserin yalnız bir parçası, başlık bütün eseri anlatıyor) · `siyah_beyaz` (renkli bir eserin eski siyah-beyaz fotoğrafı; gravür/desen gibi zaten renksiz eserler değil) · `egik` (yamuk/eğik çekilmiş, perspektif bozuk) · `bulanik` (çok bulanık, çok koyu, yansıma/parlama) · `arka_yuz` (tuvalin/panelin arkası) |
| `cikar` | Fotoğraf iki boyutlu bir resim/çizim/baskı değil. | `heykel` · `bina` (mimari, iç mekân) · `nesne` (eşya, mobilya, kitap kapağı) · `belge` (yazı, imza, katalog sayfası) · `baska_eser` (başlıkla açıkça ilgisiz bir görüntü) |

- Emin değilsen `"emin": false` yaz; karar yine en olası olanı olsun.
- **Eser–sanatçı eşleşmesini sorgulama.** "Bu Rembrandt'ın değil" gibi yargı yazma; yalnız fotoğrafın kendisi.
- Fresk, tavan resmi, sunak gibi yerinde fotoğraflanan eserlerde mimari çevre görünmesi olağandır: eser
  fotoğrafın çoğunu kaplıyorsa `uygun`.

## Sonuç biçimi

```json
[
 {"anahtar": "commons:Örnek.jpg", "karar": "uygun", "neden": null, "emin": true},
 {"anahtar": "met:…", "karar": "kotu", "neden": "salon", "emin": true, "not": "sağda iki ziyaretçi"}
]
```

Partideki her eser için tam bir satır; `anahtar` partideki ile birebir aynı. Alan adları tam olarak `anahtar`, `karar`,
`neden`, `emin`, `not` (ör. `karar` yerine `durum` yazma). `not` isteğe bağlı, kısa.
Sonuçlar uygulamaya doğrudan girmez: Claude örnekleyerek kontrol eder, sonra `data/gorsel_kararlari.json`'a işler.
