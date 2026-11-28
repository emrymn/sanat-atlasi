# Denetim Raporu: `dueller-caravaggio-baglione`

## 1. Tarih ve Yaş Doğrulaması
- **Caravaggio (d. 29 Eylül 1571 – ö. Temmuz 1610):** 13 Eylül 1603 sorgusunda 31 yaşındaydı (29 Eylül'de 32 yaşına basacaktı). 1606'da 34 yaşında Roma'dan kaçtı, 1610'da 38 yaşında öldü. Doğrulandı.
- **Giovanni Baglione (d. y. 1566 – ö. 1643):** 1603 davasında yaklaşık 37 yaşındaydı (`1603 - 1566 = 37`); 1642'de *Le Vite*'yi yayımladığında yaklaşık 76 yaşındaydı. Doğrulandı.
- **Artemisia Gentileschi (d. 1593):** 1603 davasında 10 yaşındaydı (`1603 - 1593 = 10`). Doğrulandı.
- **Dava tarihleri:** 28 Ağustos 1603 Baglione'nin şikâyeti ve Salini'nin tanıklığı, 11 Eylül 1603 Caravaggio'nun tutuklanması, 13 Eylül 1603 Caravaggio'nun ve Trisegni'nin sorguları, 14 Eylül 1603 Orazio Gentileschi'nin sorgusu, 25 Eylül 1603 Fransız elçisi Philippe de Béthune ve Fra' Ainolfo Bardi aracılığıyla tahliye. Tümü doğrulandı.

## 2. Alıntı, İddia ve Çerçeveleme Denetimi
- **Şiirlerin yazarlığı:** Roma Devlet Arşivi'ndeki 1603 dosyasında iki hiciv şiiri korunsa da Caravaggio ve Trisegni suçlamayı reddettiğinden şiirlerin kesin olarak Caravaggio tarafından yazıldığı ileri sürülmedi; yazarlığın kesinleşmediği açıkça belirtildi.
- **13 Eylül 1603 ifadesi:** "İyi ressam" (*valenthuomo*) tanımı ("iyi boyamayı ve doğal şeyleri iyi taklit etmeyi bilen kişi"), övdüğü beş usta (Cavalier d'Arpino, Federico Zuccari, Cristoforo Roncalli, Annibale Carracci, Antonio Tempesta) ve Baglione'nin Il Gesù'daki *Diriliş* tablosuna "beceriksiz" (*goffa*) demesi arşiv kaynaklarına bağlı kalınarak aktarıldı.
- **Baglione'nin 1602 *İlahi Aşk* tablosu:** Şeytan yüzünün Caravaggio'ya benzediği ve görsel bir suçlama içerdiği, kesin belge değil sanat tarihçilerinin yorumu olarak çerçevelendi.
- **Baglione'nin 1642 *Le Vite* biyografisi:** Tek yanlı karalama gibi sunulmadı; Britannica ve modern tarihçilerin değerlendirmesi doğrultusunda hem yer yer iğneleyici hem de temel olgularda dengeli ve vazgeçilmez bir ilk kaynak olduğu belirtildi.

## 3. Eser ve Biçim Denetimi
- `data/sanatcilar.json` içinde Baglione bulunmadığından `sanatcilar` alanında yalnız `"caravaggio"` yer aldı; Baglione'nin *İlahi Aşk* ve *Diriliş* tabloları yalnızca metinde anıldı.
- Tüm görsel eserler (`Q969377`, `Q474024`, `Q2337873`, `Q102852946`, `Q318947`, `Q2713203`, `Q597114`) `data/eserler_onbellek.json` kataloğundan doğrulandı ve metinde Türkçe adları (`Aziz Matta'nın Çağrılışı`, `Muzaffer Aşk`, `Aziz Matta'nın İlhamı`, `İsa'nın Yakalanması`, `Emmaus'ta Akşam Yemeği`, `Loreto Meryemi`, `Meryem'in Ölümü`) kullanıldı.
- Parantez, dipnot, kısaltma ve yasaklı sıfat ("dahi", "eşsiz", "büyüleyici") bulunmadığı kontrol edildi.
- İlk taslak 932 kelime çıkmıştı; iki tarafın riske attıkları, Caravaggio'nun Roma hamileri, mahkeme tutanağının bağlamı ve 1604–1605 dönemi eklenerek 1000+ kelime eşiğini geçip uyarısız geçmesi sağlandı.
