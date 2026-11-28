# Diziler (Hikâyeler'in ikinci rafı)

Emre'nin seçimi (2026-11-27). Sanatçı hikâyeleri tek bir hayatı anlatır; diziler birden çok sanatçıyı bir tema ya da
çatışma üzerinden bağlar. Her bölüm 8–10 dakikalık (1100–1500 kelime), okunur ve dinlenir; aynı oynatıcı ve okuma ekranı.

## Diziler ve ilk bölümler

| # | Dizi (`id`) | İlk üç bölüm |
|---|---|---|
| 1 | Düellolar (`dueller`) | Leonardo ile Michelangelo: Palazzo Vecchio'nun iki duvarı (1504) · Ghiberti ile Brunelleschi: vaftizhane kapısı (1401) · Caravaggio ile Baglione: 1603 hakaret davası |
| 2 | Dostluklar ve Kopuşlar (`dostluklar`) | Van Gogh ile Gauguin: Arles'daki dokuz hafta (1888) · Manet ile Degas: kesilen portre · Cézanne ile Zola: bir romanla biten dostluk (1886) |
| 3 | Aynı Konu, İki Usta (`ayni-konu`) | Caravaggio ile Artemisia: Yudit · Perugino ile Raphael: Meryem'in Evliliği · Tiziano ile Manet: Urbino Venüsü ve Olympia |
| 4 | Skandal Tablolar (`skandallar`) | Çimende Kahvaltı ve Reddedilenler Salonu (1863) · Veronese ve Engizisyon (1573) · Caravaggio'nun Meryem'in Ölümü (1606) |
| 5 | Hastalık ve Delilik (`hastalik`) | Goya'nın sağırlığı ve Kara Resimler · Van Gogh'un Saint-Rémy yılı · Monet'nin kataraktı |
| 6 | Para (`para`) | Rubens: ressam, girişimci, diplomat · Vermeer'in fırıncıya borcu · Dürer, baskılar ve ilk telif kavgası |
| 7 | İnanç Krizi (`inanc`) | Botticelli ve Savonarola · Cranach: Luther'in dostu, kardinalin ressamı · Michelangelo'nun son yılları |
| 8 | Ölümler (`olumler`) | Raphael (1520) · Caravaggio (1610) · Van Gogh (1890) |
| 9 | Kıskançlık (`kiskanclik`) | Michelangelo ile Raphael · Manet ile Monet: karıştırılan iki ad (1865) · Vasari'nin kalemi |
| 10 | Yalanlar ve Efsaneler (`efsaneler`) | Van Gogh'un kulağı · Sistine tavanı sırtüstü mü boyandı · Leonardo kralın kollarında mı öldü |
| 11 | İntikam (`intikam`) | Son Yargı'da eşek kulaklı tören ustası · Caravaggio'nun düşmanları · Goya ve IV. Carlos'un ailesi |
| 12 | Çöküşler (`cokusler`) | Rembrandt'ın iflası (1656) · Botticelli'nin son yılları · David'in sürgünü |

Bölüm listesi taslak; yazarken belgesi zayıf çıkan bölüm başkasıyla değişir.

## Veri: `data/diziler.json`

```
{ "surum": 1,
  "diziler": [ { "id": "dueller", "ad": "Düellolar", "aciklama": "1–2 cümle", "bolumler": ["dueller-leonardo-michelangelo", …] } ],
  "bolumler": { "<bolum-id>": {
      "dizi": "dueller", "baslik": "", "alt_baslik": "", "sanatcilar": ["leonardo-da-vinci", "michelangelo"],
      "giris": ["paragraf"],
      "bolumler": [ { "baslik": "", "yillar": "1503–1506", "paragraflar": ["…"],
                      "eserler": [ { "sanatci": "<id>", "qid": "Q…", "bag": "1–2 cümle" } ] } ],
      "kapanis": ["paragraf"],
      "kaynaklar": [ { "baslik": "", "adres": "https://…" } ],
      "kelime": 0, "model": "", "denetci": "", "olusturma": "YYYY-MM-DD" } } }
```

Sanatçı hikâyesiyle aynı biçim (giriş, bölümler, kapanış), yalnız `sanatcilar` çoğul ve eser her sanatçının kendi
listesinden (`eserler_onbellek.json`). Listede eseri olmayan heykeltıraş/mimar için eser yerine `"commons": "<dosya adı>"`
(`sanatcilar.json` → `kurs_eserleri[].commons_dosya`).

## Akış

1. Yazım: Gemini (Görev modu), `diziler/istem.md`. Çıktı `diziler/taslak/<bolum-id>.json` + `-arastirma.md` + `-denetim.md`.
2. Denetim: Claude okur, olguları düzeltir; `scripts/dizi_ekle.py` biçimi denetler ve `data/diziler.json`'a ekler.
3. Ses: `ses_uret.py` dizi bölümlerini de okutur (eklenecek).
4. Uygulama (nora-sanat): Hikâyeler'de "Diziler" rafı, dizi sayfası; tasarım önce Neon'da, ekran görüntüsü Emre'ye.
