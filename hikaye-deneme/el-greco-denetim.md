# El Greco — Denetim Raporu

## 1. Tarih ve Yaş Hesapları Kontrolü
Doğum yılı `1541` temel alınarak hikâyedeki tüm tarih ve yaş hesapları `el-greco-arastirma.md` kronoloji tablosuyla karşılaştırıldı:
- **1565–1566:** *Meryem'in Uykuya Dalışı* (1 Nisan 1983'te Syros adasında Georgios Mastoropoulos tarafından keşfedildi) — doğrulandı.
- **1567:** Venedik'e gidiş — `1567 - 1541 = 26` ("yirmi altı yaşındayken") — doğrulandı.
- **Kasım 1570:** Roma'ya varış — `1570 - 1541 = 29` ("yirmi dokuz yaşındayken") — doğrulandı.
- **Temmuz 1572:** Palazzo Farnese'den ayrılış — `1572 - 1541 = 31` ("otuz bir yaşındayken") — doğrulandı.
- **1577:** İspanya'ya geliş — `1577 - 1541 = 36` ("otuz altı yaşındayken") — doğrulandı.
- **1578:** Oğlu Jorge Manuel'in doğumu (`1578 - 1541 = 37`) — doğrulandı.
- **18 Mart 1586:** *Orgaz Kontu'nun Gömülmesi* sözleşmesi — `1586 - 1541 = 45` ("kırk beş yaşındaki") — doğrulandı.
- **1586–1588:** Tabloda oğlu Jorge Manuel'in yaşı — `1586 - 1578 = 8`, `1588 - 1578 = 10` — ilk taslaktaki "sekiz yaşındaki" ifadesi **"tablonun yapıldığı yıllarda sekiz ile on yaşları arasında olan"** şeklinde düzeltildi.
- **1609:** Şair dostu *Fray Hortensio Félix Paravicino* (d. 1580) — `1609 - 1580 = 29` ("yirmi dokuz yaşındaki") — araştırma dosyasına `1580` doğum yılı eklendi ve doğrulandı.
- **1611:** Francisco Pacheco'nun ziyareti — `1611 - 1541 = 70` ("yetmiş yaşındaki") — doğrulandı.
- **7 Nisan 1614:** Toledo'da ölüm — `1614 - 1541 = 73` ("yetmiş üç yaşında") — doğrulandı.

## 2. Tablo İçi Yön (Sol/Sağ) Doğrulaması
- **Bölüm 3, Paragraf 2 (*Orgaz Kontu'nun Gömülmesi*):** "Sol alt köşede parmağıyla mucizeyi işaret eden küçük çocuk" — Khan Academy / Smarthistory kaynak sayfasında ("lower left-hand side of the painting") doğrulandığı için korundu.
- Hikâyedeki diğer tüm sahnelerde yön belirtimi kullanılmadı.

## 3. Araştırma Dosyasına Sadakat ve Düzeltilen Hatalar
Hikâyedeki her cümle `el-greco-arastirma.md` ile satır satır karşılaştırıldı ve şu düzeltmeler yapıldı:
1. **Kısaltma temizliği (TTS):** `Dr. Francisco de Pisa'nın Portresi` ifadesi `Doktor Francisco de Pisa'nın Portresi` olarak, `Met'teki` ifadesi `Metropolitan Sanat Müzesi'ndeki` olarak açıldı. Metinde 0 parantez, 0 dipnot, 0 kısaltma kaldı.
2. **İkonografi düzeltmesi (*Kutsal Üçleme*, B2.P1):** İlk taslakta geçen "meleklerin kollarında göğe taşınır" ifadesi araştırma dosyasında yer almadığı ve ikonografik olarak hatalı olduğu için çıkarıldı; metin araştırma dosyasındaki renk ve Michelangelo vurgusuna sadık biçimde yeniden yazıldı.
3. **Desteksiz ayrıntıların ayıklanması:**
   - B2.P3'te araştırma dosyasında geçmeyen "hapis tehdidi" ve "kendi bilirkişileri" ifadeleri çıkarıldı.
   - B2.P4'te araştırma dosyasında geçmeyen "altın kılıç kabzası" ayrıntısı çıkarıldı.
   - B3.P4 (*Bahçedeki Istırap*), B4.P2 (*Aziz Martin ve Dilenci*, *Diriliş*), B4.P3 (*Kardinal Fernando Niño de Guevara*), B5.P3 (*Fray Hortensio Félix Paravicino*), B5.P4 (*Toledo Görünümü ve Planı*), B6.P1 (*Meleklerin Konseri*), B6.P2 (*Beşinci Mührün Açılışı*), B6.P3 (*Laokoon*) ve B6.P4 (*Çobanların Tapınması*) paragraflarında araştırma dosyasında açıkça belgelenmemiş renk, giysi veya yan ayrıntılar ("yeşil pelerin", "beyaz dantel", "siyah-beyaz tarikat giysisi", "yanardöner sarı, yeşil ve mavi", "sarı-yeşil kumaşlar", "1506'da bulunan", "çıplak ayaklı", "altına gömüldü") temizlenip birebir araştırma dosyasındaki doğrulanmış bulgulara çekildi.
4. **Rivayet ve tek kaynaklı alıntıların kaynaklandırılması:**
   - Michelangelo'nun *Son Yargı* freski hakkındaki sözleri **"Hekim ve sanat yazarı Giulio Mancini'nin aktardığına göre"** biçiminde kaynaklandırıldı.
   - Yemeklerde müzisyen tutması **"biyografi yazarı Jusepe Martínez'in aktardığına göre"** biçiminde kaynaklandırıldı.
   - 1611 ziyareti, kil modeller ve renk üzerine yanıt **"Francisco Pacheco"** kaynağıyla verildi.
   - Met'teki *Otoportre* (`Q5712837`) kimliğinin kesin belgelenmediği açıkça belirtildi.
5. **Paragraf uzunluğu ve akış:** 70 kelimenin altında kalan üç bölüm paragrafı (`B1.P3`, `B6.P1`, `B6.P3`) araştırma dosyasındaki doğrulanmış bilgilerle 70–140 kelime aralığına getirildi.

## 4. Doğrulama ve Teknik Kontrol (`hikaye_ekle.py`)
- Toplam kelime sayısı: `2,250` (2200–3000 aralığında).
- Tüm bölüm paragrafları: 70–140 kelime aralığında.
- Tüm `eserler` QID'leri `data/eserler_onbellek.json` (20 eser) ve `data/eser_adlari_tr.json` Türkçe adlarıyla doğrulandı; listede olmayan hiçbir El Greco tablosu adıyla anılmadı (El Escorial sunak resmi adlandırılmadan genel ifadeyle geçildi).
- Tüm `baglantilar` (7/7) `data/sanatcilar.json` ile tam eşleşti.
- Tüm `kaynaklar` (22) gerçek müze ve akademik URL'lerdir (`vertexaisearch` yönlendirmesi yok).
- `python3 scripts/hikaye_ekle.py hikaye-deneme/el-greco.json --sanatci el-greco`: 0 hata, 0 uyarı.
