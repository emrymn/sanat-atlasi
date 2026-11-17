# İş 189 · Başyapıtlara 110 eser: araştırma planı

Amaç: `data/basyapitlar.json`'a (154 eser) 110 yakın okuma daha eklemek. Araştırmayı Qwen yapar; uydurmayı
modelin dürüstlüğü değil, betik engeller.

## Sayılar (17 Kasım 2026 ölçümü)

| | Eser |
|---|---|
| Uygulamadaki eser | 7414 |
| Konusunun hikâyesi olan (`eser_konulari.json` `k` → `ikonografi.json` `hikaye`) | 2771 |
| … ve R2'de en büyük kopyası olan | 2138 |
| … ve en büyük kopyanın uzun kenarı ≥ 3000 px (**hikâyeli + yüksek çözünürlüklü**) | **1546** |
| … bunlardan başyapıtlarda olmayan | 1496 |
| Seçilen | **110** (`secim.json`) |

Boyutlar R2'deki `d/<ad>.jpg` dosyalarının başlığından okundu (2508 dosya). Eşik değişirse: ≥ 2000 px 1961, ≥ 3800 px 1040,
4000 px ve üstü 650 eser. Seçilen 110'un 77'si ≥ 3800 px.

Seçim ölçütü: QID'li, başyapıtlarda yok, bilinirlik (Wikipedia dil sayısı) + tipiklik puanı; sanatçı başına en çok 3,
konu başına en çok 3 (Meryem ve Çocuk 5), akım başına en çok 13. 53 sanatçı, 20 akım. Elle çıkarılanlar: Bosch · Zevk Bahçesi ve
David · Horas Kardeşlerin Yemini (başka anahtarla zaten başyapıt), dizi kayıtları (Goya · Kaprisler ve Kara Resimler, Dürer · Kıyamet,
Blake · Kızıl Ejderha, Fragonard · Aşkın İlerleyişi), Michelangelo · iki Sibyl (tek kayıtta iki fresk), Gérôme · Pygmalion (müzesiz kayıt).

## Uydurmayı engelleyen düzen

1. **Kaynak metni modelden önce gelir.** `kaynak_indir.py` (model kullanmaz) her eserin Wikidata künyesini ve İngilizce/Türkçe
   Wikipedia maddesini `kaynak/<QID>/` altına yazar; sürüm numarası ve sha256 `KAYNAK.json`'da.
2. **Model internete çıkmaz, belleğinden yazmaz.** Yalnız o dosyaları okur; her olguyu kaynaktan birebir kopyalanmış bir alıntıya bağlar.
3. **Betik denetler** (`dogrula.py`): alıntı kaynakta birebir geçiyor mu, iddiadaki her sayı alıntıda var mı, kaynağın "probably /
   attributed / circa" sözü Türkçede korunmuş mu, kaynak dosyası değiştirilmiş mi. Geçmeyen eser kabul edilmez.
4. **Betiğin göremediği tek şey** Türkçe cümlenin alıntıyla aynı şeyi söyleyip söylemediğidir. Onu başka bir model (Gemini) denetler:
   kaynağa gerek yok, iddia ve alıntı aynı satırda.
5. **Yakın okumayı araştıran model yazmaz.** Claude, görsele bakarak ve yalnız geçmiş iddialara dayanarak yazar.

## Adımlar

| # | İş | Kim | Çıktı |
|---|---|---|---|
| 1 | Seçim | Claude (bitti) | `secim.json` |
| 2 | Kaynakları indir | betik (Claude buluttan indirdi; eksik kalan olursa Emre'nin Mac'i) | `kaynak/<QID>/` |
| 3 | Araştırma, parti parti (11 parti × 10 eser) | **Qwen Code**, `qwen3.8-max · Medium`, her parti yeni oturum | `eserler/<QID>/ARASTIRMA.json` |
| 4 | Mekanik denetim | `dogrula.py` (Qwen oturum içinde çalıştırır; Claude birleştirmeden önce yeniden çalıştırır) | GEÇTİ / KALDI |
| 5 | Anlam denetimi (iddia = alıntı mı?) | **Gemini**, parti başına tek sohbet | bulgu listesi; Claude doğrular, düzeltir |
| 6 | Yakın okuma + "Yakından bak" + ayrıntı noktaları, görsele bakarak | Claude | `data/basyapitlar.json`, `data/eser_ayrintilari.json` |
| 7 | Son okuma örneklemi (en ünlü 20 eser; müze sayfasıyla karşılaştırma) | **ChatGPT** (isteğe bağlı) | bulgu listesi |
| 8 | Testler, sürüm, yayın | Claude | PR |

Sıra: önce yalnız **parti 1** (pilot). Emre kota yüzdesini önce/sonra söyler; 4. ve 5. adımın sonucuna göre komut gerekirse
düzeltilir, sonra kalan 10 parti (paralel sekmelerde çalıştırılabilir; partiler ayrı klasörlere yazar).
Parti 1'de `Q2470123` (Caravaggio · Yudit) örnek olarak elle yazıldı: o partide yazılacak dosya sayısı 9, ötekilerde 10.

## Qwen komutu (parti numarasını değiştirip yapıştır)

```text
GÖREV: Sanat Atlası deposunda "başyapıt araştırması" · PARTİ <N>

Depo: emrymn/sanat-atlasi · Dal: claude/sharp-goodall-rxd1wk (önce: git fetch origin && git checkout claude/sharp-goodall-rxd1wk && git pull)
Çalışma klasörü: scripts/basyapit_arastirma/

NE YAPACAKSIN
scripts/basyapit_arastirma/secim.json içinde "parti": <N> olan eserlerin her biri için
scripts/basyapit_arastirma/eserler/<anahtar>/ARASTIRMA.json dosyasını yazacaksın (dosyası zaten olan eseri atla).
Bu bir YAZARLIK görevi değil, bir ÇIKARIM görevidir: kaynak dosyalarında yazan olguları, kaynaktaki cümlesiyle birlikte listelersin.

KAYNAK (tek kaynak budur)
Her eser için scripts/basyapit_arastirma/kaynak/<anahtar>/ klasöründeki dosyalar: wikidata.txt, enwiki.txt, trwiki.txt (bazıları olmayabilir).
- İnternete ÇIKMA. Web araması, curl, tarayıcı, MCP kullanma.
- Kendi bilgini KULLANMA. Bu eserler ünlü; çoğu hakkında bir şeyler "bildiğini" sanacaksın. Kaynak dosyasında yazmayan hiçbir şey
  dosyaya giremez. Doğru olduğundan emin olman yetmez; alıntısı yoksa yazılmaz.
- kaynak/ altındaki hiçbir dosyayı değiştirme (sha256 ile denetleniyor).
- Bir bilgi kaynakta yoksa onu "bulunamadi" listesine yaz. Boş bırakmak başarıdır; doldurmak için tahmin etmek başarısızlıktır.

ÖRNEK
scripts/basyapit_arastirma/eserler/Q2470123/ARASTIRMA.json dosyasını ve onun kaynak klasörünü önce oku. Biçim birebir odur.

ARASTIRMA.json BİÇİMİ
{
 "anahtar": "<QID>",
 "baslik_tr": "<secim.json'daki baslik, değiştirmeden>",
 "kunye": {
   "sanatci": {"deger": "...", "kaynak": "wikidata.txt", "alinti": "..."},
   "tarih":   {"deger": "...", "kaynak": "...", "alinti": "...", "ihtiyat": true|false},
   "teknik":  {...}, "olcu": {...}, "yer": {...}
 },
 "iddialar": [
   {"id": "C01", "bolum": "hikaye|gorunen|kompozisyon|anlam|onem", "iddia": "Türkçe tek cümle", "kaynak": "enwiki.txt", "alinti": "...", "ihtiyat": false}
 ],
 "celiskiler": [ {"konu": "...", "a": {"kaynak": "...", "alinti": "..."}, "b": {"kaynak": "...", "alinti": "..."}} ],
 "bulunamadi": ["anlam: kaynakta simge yorumu yok", "olcu: hiçbir kaynakta yok"]
}

BÖLÜMLER (en az sayı)
- hikaye (2): resmin anlattığı olay; kim, ne yapıyor, öncesi/sonrası, hangi metinden (İncil bölümü, Ovidius, Dante …).
- gorunen (3): resimde ne görülüyor; figürler, nesneler, yazıtlar, kim nerede duruyor.
- kompozisyon (1): düzen, ışık, renk, teknik, boyut, alt çizim, restorasyonda görülenler.
- anlam (2): simgeler, yorumlar, modelin kimliği, sipariş amacı.
- onem (2): sipariş, tarihleme, sahiplik ve yer değiştirme, etkisi, tartışmalar, tepkiler.
Eser başına en az 14 iddia; kaynak zenginse 20–30 iddia çıkar. Kaynak bir bölüm için yeterli değilse az yaz ve
"bulunamadi" listesine "<bolum>: neden" diye not düş. Sayıyı tutturmak için iddia uydurma ya da aynı olguyu bölme.

HER İDDİA İÇİN KURALLAR
1. Tek cümle, tek olgu, Türkçe, 20–300 karakter.
2. "alinti": kaynak dosyasından KOPYALA-YAPIŞTIR. Tek bir dosyadan, kesintisiz tek parça, 15–400 karakter. Kelime atlama, "…" ile birleştirme,
   düzeltme, çevirme, yazım iyileştirme yok. Alıntıyı yazmadan önce dosyada o satırı yeniden aç ve oradan kopyala; bellekten yazma.
3. İddia, alıntının söylediğinden FAZLASINI söyleyemez. Alıntıda olmayan isim, yer, tarih, sebep, sıfat ekleme.
   Alıntı "one of the earliest" diyorsa "en erken" yazma. Alıntı tek bir eser için konuşuyorsa genelleme yapma.
4. İddiadaki her sayı (yıl, ölçü, adet) alıntıda rakamla aynen bulunmalı. Alıntıda "sixteenth century" yazıyorsa iddiada rakam kullanma
   ("on altıncı yüzyıl" yaz). Yüzyıl hesaplama, yaş hesaplama, cm–inç çevirme yok.
5. İHTİYAT: alıntıda probably, possibly, perhaps, may, might, thought to, believed to, attributed, traditionally, according to, suggests,
   appears, circa/c., disputed, uncertain gibi bir söz varsa "ihtiyat": true yaz ve Türkçe cümlede de karşılığını kullan
   (muhtemelen, olabilir, düşünülür, atfedilir, …'e göre, yaklaşık, tartışmalıdır). Kaynağın ihtiyatını asla kesinliğe çevirme.
6. Yalnız BU eser hakkında yaz. Madde başka versiyonlardan, kopyalardan, aynı konunun başka ressamlarca yapılmış resimlerinden ya da
   sanatçının hayatından söz ediyorsa onları bu esere mal etme. Hangi versiyon olduğundan emin değilsen iddiayı yazma.
7a. trwiki.txt yalnız enwiki.txt'de olmayan bir bilgi için kullanılır; trwiki'deki yorum cümlelerini ("aynıdır", "anlatmaya çalışır")
   olgu gibi aktarma, "Türkçe Vikipedi'ye göre" diye ihtiyatlı yaz ve "ihtiyat": true işaretle.
7. "See also", "References", "External links", "Notes", "Kaynakça" bölümlerinden alıntı yapma.
8. İngilizce "by 1879" = "1879'a gelindiğinde / en geç 1879'da" (o yılda değil). "left/right" kimin solu-sağı ise öyle aktar; çevirme.
9. Yorum, övgü, kendi gözlemin yok ("etkileyici", "ustaca", "dikkat çeker" gibi sözler kaynakta yoksa yazılmaz). Görsele bakma; görsel bu görevin kaynağı değil.

KÜNYE
- Önce wikidata.txt satırlarını kullan (alıntı olarak satırın kendisi). Ölçü için yükseklik ve genişlik satırları art arda ise ikisini tek alıntı yapabilirsin.
- wikidata.txt ile Wikipedia farklı tarih, ölçü, yer ya da atıf veriyorsa: birini seçip geçme, ikisini "celiskiler" listesine alıntılarıyla yaz.
- Kaynakta yoksa "deger": null yaz ve "bulunamadi" listesine "<alan>: hiçbir kaynakta yok" ekle.

ÇALIŞMA DÜZENİ
- Her eser için AYRI bir alt ajan kullan (bir eserin maddesi ötekine karışmasın). Alt ajana bu kuralların tamamını ver.
- Her eser bitince çalıştır:  python3 scripts/basyapit_arastirma/dogrula.py <anahtar>
  KALDI derse: alıntıyı kaynak dosyasından yeniden kopyalayarak düzelt ya da iddiayı SİL. Betiği geçmek için kaynağı değiştirmek,
  dogrula.py'yi değiştirmek, alıntıyı kaynağa uydurmak için iddiayı anlamsızlaştırmak yasak.
- Parti bitince çalıştır:  python3 scripts/basyapit_arastirma/dogrula.py --parti <N>   (hepsi GEÇTİ olmalı)

YASAKLAR
- scripts/basyapit_arastirma/eserler/ dışında hiçbir dosyayı değiştirme, oluşturma, silme. data/, js/, css/, tools/, kaynak/, secim.json, dogrula.py dokunulmaz.
- Değişecek dosya sayısı: bu partide dosyası olmayan eser sayısı kadar yeni ARASTIRMA.json (parti 1'de 9, öteki partilerde 10). Başka dosya yok.
- Yakın okuma, ders, özet, soru YAZMA. Yalnız ARASTIRMA.json.

BİTİRİRKEN
1. git add scripts/basyapit_arastirma/eserler && git commit -m "İş 189: başyapıt araştırması, parti <N>" && git push origin claude/sharp-goodall-rxd1wk
2. Şu raporu yaz (başka bir şey yazma):
   - commit kimliği
   - dogrula.py --parti <N> çıktısının son satırı
   - eser başına: anahtar · iddia sayısı · ihtiyatlı iddia sayısı · çelişki sayısı · bulunamadi sayısı
   - kaynak dosyası olmayan ya da çok kısa olduğu için zayıf kalan eserler
   "Doğrulandı", "kontrol ettim" gibi beyan yazma; yalnız betiğin çıktısını aktar.
```

## Gemini komutu (5. adım; partinin ARASTIRMA.json dosyalarını ekleyip yapıştır)

```text
Ekteki JSON dosyalarında "iddialar" listesinin her öğesi bir Türkçe "iddia" ve onun dayandığı İngilizce ya da Türkçe "alinti"dir.
Alıntıların kaynakta birebir geçtiği ayrıca doğrulandı; onu denetleme. Kendi sanat tarihi bilgini KULLANMA: iddia gerçekte doğru olsa bile,
alıntıdan çıkmıyorsa bulgudur; iddia gerçekte yanlış olsa bile alıntı aynısını söylüyorsa bulgu değildir.

Yalnız şu durumları bildir:
A. FAZLA: iddia alıntıda olmayan bir isim, yer, tarih, sebep ya da nitelik içeriyor.
B. TERS / YANLIŞ ÇEVİRİ: iddia alıntının söylediğinin tersini ya da başka bir şeyi söylüyor (sol-sağ, önce-sonra, by/in, kim-kime).
C. KESİNLEŞTİRME: alıntıdaki ihtiyat (probably, attributed, may, circa …) iddiada kaybolmuş ya da zayıflamış.
D. YANLIŞ ESER: alıntı açıkça başka bir versiyon, kopya, eser ya da kişi hakkında.
E. BÖLÜM: iddia yanlış bölümde (hikaye / gorunen / kompozisyon / anlam / onem).
Üslup, yazım, "daha iyi çeviri" önerme. Bulgu yoksa o eser için "temiz" yaz.

Çıktı yalnız şu JSON olsun:
[{"anahtar": "Q…", "id": "C07", "tur": "A|B|C|D|E", "aciklama": "en çok 25 kelime", "oneri": "düzeltilmiş Türkçe iddia ya da SİL"}]
Ardından tek satır: incelenen eser sayısı, incelenen iddia sayısı, bulgu sayısı.
```

Claude her bulguyu iddia–alıntı çiftine bakarak doğrular; gerçek olanları düzeltir, `dogrula.py`'yi yeniden çalıştırır.
