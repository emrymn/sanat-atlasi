# Yeni harita çizimi (İş 41, sürüyor)

Uygulamaya henüz dokunulmadı. Bu klasör yalnız yeni harita resimlerini denemek için.

## Şimdiye kadarki seçimler (Emre)

- Önce iskelet, sonra boya: yol ve seviye noktaları önceden belli (`iskelet.py`), model bu taslağın üstüne boyar. Noktalar çizimden sonra işaretlenmez.
- Yol: yılankavi. Uzunluk: 1:3 (1024×3072; bugünkü 2:3 resmin 2 katı). Bütün dönemler aynı boy.
- Seviyeler arası aynı aralık (resmin %14'ü ≈ 164 pt); az seviyeli dönemde kalan alan gizli eserlere.
- Her seviyenin yanında döneme ait bir yapı; üslup tek ressama bağlı değil, dönemin ünlü resimleri iç içe.
- Gizli eserler o seviyenin sanatçılarından.
- Gece: gündüz resminden düzenlenecek (yol ve seviyeler kaymasın).
- İki iskelet denenecek: yılankavi ve "ana yol ve cepler" (`--iskelet cep`).
- Yol bölgeye göre değişir (yeri ve genişliği aynı); seviye yerleri boş, küçük yuvarlak meydan; manzara kenardan kenara tek parça.
- İlk Seedream denemesinde (tablosuz) eserler uydurma çıktı, "AI generated" filigranı vardı: Seedream de tablolarla denenecek, filigran kapatıldı.
- Rönesans'ta gizli eserler 17'den 9'a indi ("çok kalabalık"); üslup Nano Banana'nın açık renkleri.
- "GPT + maske": `maske.py` iskeletten maske üretir; GPT yalnız yolun çevresini boyar, ardından kaynak yol geri konur (`-birlesik.jpg`).
- Çıktılar hiçbir zaman üstüne yazılmaz (aynı ad varsa `-v2`).
- İlk deneme: Rönesans. GPT Image 2 ve Nano Banana Pro hem referanssız hem depodaki tablolarla (modelin sınırı kadar); FLUX.2 Pro, Seedream 5 Pro, Nano Banana 2, Grok Imagine 2.0 yalnız referanssız.

## Uygulamaya bağlama kararları (Emre, Rönesans bittikten sonra)

- Önce bütün dönemler bitecek, uygulamaya en son hep birlikte bağlanacak.
- Sepya renklenme (alttan yukarı, açık son seviyeye kadar renkli) bütün dönemlerde.
- Gizli eserler eski haritadaki gibi: dokununca künye, hikâye ve sanatçı sayfası bağlantısı (`data/harita.json` `eserler`).
- Her dönemin resmi 1:3; harita kurulumu (`js/harita.js` `haritaKur`) dönem başına yükseklik alacak. Her seviyenin kendi sembolü; karakter bütün haritada aynı genç sanat öğrencisi, dönem kıyafetiyle.
- Rönesans tamam: `ronesans_secim.json` (gündüz, gece, 7 seviye noktası, semboller, karakter).

## Çalıştırma (Mac)

```sh
cd scripts/harita
npm ci
echo 'AI_GATEWAY_API_KEY=...' > .env   # bir kez; Vercel → AI Gateway → API Keys (.env git'e girmez)
node ciz.mjs ronesans                  # plan ve tahmini maliyet; hiçbir şey harcanmaz
node ciz.mjs ronesans --calistir       # 8 çizim, ~1,5 $
node ciz.mjs ronesans --calistir --yalniz flux-2-pro-yalin   # tek iş (virgülle birkaç iş)
node ciz.mjs ronesans --iskelet cep --istem                # cep iskeletiyle gidecek istemi göster
```

Çıktılar `cikti/ronesans/` altında (`ham/` modelin döndürdüğü, üstteki 1024×3072'ye kesilmiş) ve bir `ozet_….json`. Klasör git'e girmez; sonuçları göstermek için:

```sh
sh gonder.sh "Rönesans: deneme"   # yalnız JPG'ler ve özetler; ham/ girmez
```

## Notlar

- 1:3'ü tek parçada çizemeyen modellerde (Nano Banana 2 → 1:4, Nano Banana Pro → 9:16, Grok → 1:2) taslak düz kenarla o orana genişletilir; çıktıdan ortadaki 1:3 kesilir. Model istenen orandan farklı bir resim döndürürse betik uyarır.
- Referans tablolar depodaki yerel kopyalar, indirme yok (`ronesans_referanslar.json`, 16 tablo, az bilinen önce). Her modele sınırı kadar gider: GPT Image 2 → taslak + 9, Nano Banana Pro → taslak + 13. Dürer'in Genç Tavşan'ı depoda yok, yalnız tarifle.
- Fiyatlar kaba tahmin; gerçek harcama Vercel panosunda.
