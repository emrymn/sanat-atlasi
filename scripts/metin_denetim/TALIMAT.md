# Türkçe metin denetimi — talimat (Mistral için)

Bu depo Türkçe bir sanat tarihi çalışma uygulaması (Sanat Atlası). Metinleri bir üniversite öğrencisi okuyor.
Senin işin: verilen dosyalardaki **Türkçe metinlerde gerçek hataları** bulmak. Hiçbir dosyayı değiştirme, commit'leme
ya da push'lama; sonucu yalnız JSON olarak sohbete yaz.

## Bu turda denetlenecek dosyalar

1. `data/akim_bilgi.json`
2. `data/akim_ozellikleri.json`
3. `data/tanima_notlari.json`
4. `data/konular_tr.json`

Yalnız Türkçe metin değerlerine bak (anahtar adlarına, kimliklere, sayılara, adreslere değil).

## Ne bildireceksin

| tur | örnek |
|---|---|
| `yazim` | yazım/noktalama hatası, TDK'ye aykırı yazım ("herkez", "birşey", "de/da" ayrı-bitişik hatası, kesme işareti) |
| `dilbilgisi` | çatı/ek uyumsuzluğu, eksik/yanlış ek, özne-yüklem uyumsuzluğu |
| `anlatim` | anlaşılmaz, devrik ve kafa karıştıran, çeviri kokan ya da yarım kalmış cümle |
| `olgu` | açıkça yanlış bilgi (yanlış yüzyıl, yanlış şehir, yanlış sanatçı–eser eşleşmesi). **Yalnız emin olduğunda**; emin değilsen `"emin": false` |

## Ne bildirmeyeceksin

- Üslup tercihi, "bence şöyle daha güzel olur" türü öneriler. Doğru ve anlaşılır cümleye dokunma.
- Yabancı özel adların yazımı (Caravaggio, Brueghel/Bruegel, Van Eyck vb.) ve eser adları.
- Terimlerin Türkçe karşılıkları üzerine tartışma (ör. "Maniyerizm" / "Mannerizm"), açık bir yazım hatası değilse.

## Sonuç biçimi

```json
[
 {"dosya": "data/tanima_notlari.json", "yol": "notlar.caravaggio", "mevcut": "hatalı kısmın BİREBİR alıntısı",
  "oneri": "düzeltilmiş hali", "tur": "yazim", "emin": true, "neden": "kısa açıklama"}
]
```

- `yol`: değerin JSON içindeki yeri (ör. `akimlar.Barok.aciklama` ya da `akimlar[3].ozellikler[1]`).
- `mevcut`: dosyada **harfi harfine** geçen kısa bir parça (bulunabilsin diye); bütün paragrafı değil.
- Hata yoksa boş liste `[]` yaz. Az ama gerçek bulgu, çok ama şüpheli bulgudan iyidir.

Sonuçlar dosyalara doğrudan girmez: Claude her maddeyi kontrol eder, gerçek olanları düzeltir, katılmadıklarını
gerekçesiyle söyler.
