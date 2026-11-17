GÖREV: Sanat Atlası deposunda "başyapıt araştırması" · PARTİ 2

Depo: emrymn/sanat-atlasi · Dal: claude/sharp-goodall-rxd1wk (zaten bu daldasın; dal değiştirme)
Çalışma klasörü: scripts/basyapit_arastirma/

NE YAPACAKSIN
scripts/basyapit_arastirma/secim.json içinde "parti": 2 olan eserlerin her biri için
scripts/basyapit_arastirma/eserler/<anahtar>/ARASTIRMA.json dosyasını yazacaksın (dosyası zaten olan eseri atla)
Bu partinin eserleri: Q500951 (Sarı İsa), Q1362177 (Melencolia I), Q275349 (Aynadaki Venüs (Rokeby Venüs'ü)), Q568847 (Çarmıhtan İndiriliş), Q351300 (Âdem ile Havva), Q2344505 (Saka Kuşlu Meryem), Q2293905 (Medusa), Q2246489 (Celile Denizi'ndeki Fırtına), Q2293953 (Venüs ve Mars), Q2273517 (Aziz Pavlus'un Din Değiştirmesi).
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
- Parti bitince çalıştır:  python3 scripts/basyapit_arastirma/dogrula.py --parti 2   (hepsi GEÇTİ olmalı)

YASAKLAR
- scripts/basyapit_arastirma/eserler/ dışında hiçbir dosyayı değiştirme, oluşturma, silme. data/, js/, css/, tools/, kaynak/, secim.json, dogrula.py dokunulmaz.
- Değişecek dosya sayısı: 10 yeni ARASTIRMA.json (Q500951, Q1362177, Q275349, Q568847, Q351300, Q2344505, Q2293905, Q2246489, Q2293953, Q2273517). Başka dosya yok.
- Aynı klasörde başka partiler de PARALEL çalışıyor: başka partilerin eserler/ klasörlerine dokunma, onları commit'e katma, git stash/reset/checkout/clean çalıştırma.
- Yakın okuma, ders, özet, soru YAZMA. Yalnız ARASTIRMA.json.

BİTİRİRKEN
1. YALNIZ kendi dosyalarını commit'le (index.lock hatası alırsan 10 sn bekleyip yeniden dene):
   git add scripts/basyapit_arastirma/eserler/Q500951 scripts/basyapit_arastirma/eserler/Q1362177 scripts/basyapit_arastirma/eserler/Q275349 scripts/basyapit_arastirma/eserler/Q568847 scripts/basyapit_arastirma/eserler/Q351300 scripts/basyapit_arastirma/eserler/Q2344505 scripts/basyapit_arastirma/eserler/Q2293905 scripts/basyapit_arastirma/eserler/Q2246489 scripts/basyapit_arastirma/eserler/Q2293953 scripts/basyapit_arastirma/eserler/Q2273517
   git commit -m "İş 189: başyapıt araştırması, parti 2" -- scripts/basyapit_arastirma/eserler/Q500951 scripts/basyapit_arastirma/eserler/Q1362177 scripts/basyapit_arastirma/eserler/Q275349 scripts/basyapit_arastirma/eserler/Q568847 scripts/basyapit_arastirma/eserler/Q351300 scripts/basyapit_arastirma/eserler/Q2344505 scripts/basyapit_arastirma/eserler/Q2293905 scripts/basyapit_arastirma/eserler/Q2246489 scripts/basyapit_arastirma/eserler/Q2293953 scripts/basyapit_arastirma/eserler/Q2273517
   git pull --rebase origin claude/sharp-goodall-rxd1wk && git push origin claude/sharp-goodall-rxd1wk
   (push reddedilirse pull --rebase ve push'u yeniden dene; force push yasak)
2. Şu raporu yaz (başka bir şey yazma):
   - commit kimliği
   - dogrula.py --parti 2 çıktısının son satırı
   - eser başına: anahtar · iddia sayısı · ihtiyatlı iddia sayısı · çelişki sayısı · bulunamadi sayısı
   - kaynak dosyası olmayan ya da çok kısa olduğu için zayıf kalan eserler
   "Doğrulandı", "kontrol ettim" gibi beyan yazma; yalnız betiğin çıktısını aktar.
