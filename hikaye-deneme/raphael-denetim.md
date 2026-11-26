# Raphael — Hikâye Denetim Raporu

## 1. Kronoloji, Tarih ve Yaş Denetimi

Doğum yılı: **1483** (28 Mart veya 6 Nisan 1483; kesin gün belgeli değil, metinde açıkça belirtildi).

| Hikâyedeki İfade | Hesap / Kontrol | Sonuç |
|---|---|---|
| "1520 yılının 6 Nisan akşamı ... otuz yedi yaşında" | 1520 − 1483 = 37 | Doğru |
| "1 Ağustos 1494 ... on bir yaşında bir oğul" | 1494 − 1483 = 11 | Doğru |
| "Annesi Magia di Battista Ciarla yaklaşık üç yıl önce, 1491 sonbaharında" | Ekim 1491 → Ağustos 1494 (2 yıl 10 ay); ilk taslakta "üç yıl önce" idi, "yaklaşık üç yıl önce" olarak düzeltildi. | Düzeltildi |
| "On bir yaşında ... on dört yıl içinde Papa'nın özel kütüphanesini" | 1494 → 1508 = 14 yıl | Doğru |
| "1500 yılında, henüz on yedi yaşındayken" | 1500 − 1483 = 17 | Doğru |
| "1504 ... Yirmi bir yaşındaki ressam" | 1504 − 1483 = 21 | Doğru |
| "1 Ekim 1504 ... on yıl önce ölmüş babasından" | 1504 − 1494 = 10 | Doğru |
| "1507 tarihli Çarmıhtan İndiriliş ... Yirmi dört yaşındaki ressam" | 1507 − 1483 = 24 | Doğru |
| "1508 yılının sonlarına doğru yirmi beş yaşındaki Raphael" | 1508 − 1483 = 25 | Doğru |
| "Nisan 1514 ... otuz bir yaşındaki Raphael'i" | 1514 − 1483 = 31 | Doğru |
| "Bindo Altoviti'nin Portresi (1515) ... yirmi dört yaşındaki genç bankacı" | Bindo Altoviti d. 1491; 1515 − 1491 = 24 | Doğru (araştırma dosyasına 1491 doğum yılı eklendi) |
| *Mond Çarmıha Geriliş* bağ cümlesinde "On dokuz yaşındaki Raphael'in" | Eser 1502–1503'e tarihlenir (19–20 yaş); "1502 ile 1503 yıllarında" biçiminde kesinleştirildi. | Düzeltildi |

## 2. Tablo İçi Yön (Sol / Sağ) Denetimi

- *Meryem'in Evliliği*: "izleyiciye göre solda Meryem ile genç kadınlar, ortada yüzüğü takan Yusuf ve başrahip, sağda ise dalı çiçek açmadığı için dizinde kıran öfkeli talip" — Pinacoteca di Brera müze sayfasından doğrulandı.
- *Atina Okulu*: "izleyiciye göre solda ... Platon ... sağda ... Aristoteles" ve "en sağ kenarında ... Raphael'in ta kendisidir" — Vatikan Müzeleri ve Smarthistory/Khan Academy sayfalarından doğrulandı.
- *Sistina Madonnası*: İlk taslaktaki "izleyiciye göre solda Aziz Sixtus, sağda Azize Barbara" ifadesi doğrudan SKD müze sayfasından teyit edilmediği için yön kaldırıldı ve "iki yanında Aziz Sixtus ile Azize Barbara diz çöker" şeklinde düzeltildi. Ayrıca "yalınayak ayaklarıyla" anlatım bozukluğu "yalınayak" olarak düzeltildi.
- *X. Leo'nun Portresi*: İki kardinalin sol/sağ konumu belirtilmedi.
- *Fırıncı Kızı*: "sol kolundaki bileklikte" ve "sol elinin yüzük parmağında" ifadeleri figürün anatomik sol kolu ve sol eli olup The Guardian / Barberini incelemesiyle uyumludur.

## 3. Kaynak, Efsane ve Üslup Denetimi

- **Efsane / rivayet çerçeveleme:** Vasari'nin Sistina Şapeli anahtarı anlatısı, 1504 tavsiye mektubunun gerçeklik tartışması, Castiglione'ye *certa idea* mektubunun yazarlık tartışması, *Fırıncı Kızı*'ndaki üzeri boyanmış yüzüğün gizli evlilik yorumu ve Vasari'nin ölüm nedeni anlatısı hep kaynaklarıyla ve tartışmalı/rivayet vurgusuyla aktarıldı.
- **Dayanaksız veya abartılı ifade düzeltmesi:** *X. Leo'nun Portresi* paragrafında araştırma dosyasında geçmeyen "sandalye topuzundaki yansımalar" ve "Flaman ustalarını kıskandıracak" ifadeleri çıkarılarak araştırma dosyasındaki "işlemeli gümüş çan ve metal yansımalar neredeyse dokunulacak bir keskinlikle parlar" ifadesine sadık kalındı.
- **Sesli okuma (TTS) düzenlemesi:** 1. bölüm 1. paragraftaki uzun ara tire bloğu iki kısa, akıcı cümleye bölündü. Parantez ve kısaltma sayısı 0'dır.
- **Eser listesi ve kod denetimi:** Metinde anılan tüm Raphael eserleri `data/eserler_onbellek.json` içindeki `qid` listesindendir; listede olmayan Raphael eseri anılmamıştır. `scripts/hikaye_ekle.py` uyarısız geçti.
