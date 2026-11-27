# Dizi bölümü istemi (Gemini, Görev modu)

Plan ve veri biçimi: `diziler/PLAN.md`. Gemini'ye işin başında git kuralı (Claude'un verdiği) ve şu blok gider;
`BOLUM` yerine bölüm kimliği ve konusu yazılır (ör. `dueller-leonardo-michelangelo: Leonardo ile Michelangelo, Palazzo Vecchio'nun iki duvarı, 1504`).

```text
Görev: "Diziler" için bir bölüm yaz: BOLUM. Dizinin adı ve öbür bölümleri diziler/PLAN.md'de.

Bu, tek bir sanatçının hayatı değil; iki (bazen üç-dört) sanatçıyı bir olay, çatışma ya da tema üzerinden bağlayan
8–10 dakikalık bir hikâye. Okunur ve sesli dinlenir.

1. ARAŞTIRMA (web araması zorunlu, en az 15 arama)
Müze siteleri, akademik kaynaklar, Smarthistory, Britannica, çağdaş belgeler (mektuplar, sözleşmeler, mahkeme tutanakları),
erken biyografiler (Vasari vb. ise "anlatılır" diye). Wikipedia yalnız başlangıç, kaynak değil.
Dosyanın başına KRONOLOJİ TABLOSU: olaya giren her tarih, yaş, yer; her satırda kaynak adresi.
BELGELİ / EFSANE / TARTIŞMALI ayrımı yap.
Çıktı: diziler/taslak/<bolum-id>-arastirma.md. Her paragrafın sonunda gerçekten açtığın sayfaların GERÇEK adresleri.

2. ESERLER (doğruluk kuralı)
Her sanatçının bizdeki eserleri: data/eserler_onbellek.json → sanatcilar.<id>.eserler (qid, baslik, yil).
Türkçe adlar: data/eser_adlari_tr.json → adlar[qid]; metinde yalnız Türkçe adı kullan.
Görsel olarak YALNIZ bu listelerdeki eserleri kullan ("sanatci" + "qid"). Listede eseri olmayan sanatçı için (heykeltıraş,
mimar) data/sanatcilar.json → kurs_eserleri[].commons_dosya: { "sanatci": "<id>", "commons": "<dosya adı>" }.
Listede olmayan eserler metinde anılabilir ama görsel olarak eklenmez.
Sanatçı kimlikleri data/sanatcilar.json'da; orada olmayan kişiler (ör. bir rakip, hami, eleştirmen) metinde anılabilir.

3. YAZIM
Yalnız araştırma dosyana dayan. Efsaneyi "anlatılır ki", "rivayete göre" diye çerçevele.
- Girişte çarpıcı bir sahne: tarih, yer, kim, ne oldu. Kuru özet değil, hikâye.
- 3–5 bölüm; her bölüm bir an ya da dönüm noktası. İki tarafı da adil anlat; okura eserlere "bak" dedirt.
- Toplam 1100–1500 kelime; paragraflar 70–140 kelime. Bölüm başına 1–3 eser.
- Sesli okunacak: kısa ve orta cümleler, parantez/dipnot/kısaltma yok, yıllar rakamla, yabancı adlar ilk geçişte tam.
- Okura adıyla seslenme. Doğal, sıcak Türkçe; "dahi, eşsiz, büyüleyici" yok; çarpıcılık olgulardan gelsin.

4. DENETİM
Her tarihi ve yaşı kronolojiyle karşılaştır, yaşları doğum yılından hesapla. Metni araştırmayla cümle cümle karşılaştır;
dayanaksız ya da abartılı cümleyi düzelt veya çıkar. Ne düzelttiğini diziler/taslak/<bolum-id>-denetim.md'ye yaz.

5. ÇIKTI: diziler/taslak/<bolum-id>.json, tam olarak:
{ "dizi": "<dizi-id>", "baslik": "", "alt_baslik": "", "sanatcilar": ["<id>", "<id>"], "giris": ["paragraf"],
  "bolumler": [{ "baslik": "", "yillar": "1503–1506", "paragraflar": ["..."],
                 "eserler": [{ "sanatci": "<id>", "qid": "Q...", "bag": "1–2 cümle" }] }],
  "kapanis": ["paragraf"], "kaynaklar": [{ "baslik": "Kurum — sayfa adı", "adres": "https://..." }] }
Sonra çalıştır ve uyarıları gider: python3 scripts/dizi_ekle.py diziler/taslak/<bolum-id>.json

6. Uygulama koduna ve data/ dosyalarına dokunma. Her bölümden sonra commit: "Dizi: <başlık>".
```
