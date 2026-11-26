# Titian — Hikâye Denetim Raporu

## 1. Kronoloji, Tarih ve Yaş Denetimi

Doğum yılı: **yaklaşık 1488–1490** (kesin belge yok; yaşlılığında 1474 iddiası ve eski 1477 geleneği metinde açıkça anlatıldı).

| Hikâyedeki İfade | Hesap / Kontrol | Sonuç |
|---|---|---|
| "27 Ağustos 1576 ... seksenli yaşlarının sonundaki" | 1576 − (1488..1490) = 86–88 | Doğru |
| "Yaklaşık on yaşındayken Venedik'e gönderilen" | y. 1498 − (1488..1490) ≈ 8–10 | Doğru |
| "1508 ile 1509 yıllarında ... henüz yirmisine varmadığını" (Dolce) | 1508 − (1488..1490) = 18–20 | Doğru |
| "1510 sonbaharında ... henüz otuzlu yaşlarının başında ölen Giorgione" | Giorgione d. y. 1477; 1510 − 1477 = 33 | Doğru |
| "Giorgione'nin ani ölümü, yirmili yaşlarının başındaki Titian'ı" | 1510 − (1488..1490) = 20–22 | Doğru |
| "Yetmiş yılı aşkın bu uzun yolculuk" (giriş) | Aktif kariyer y. 1508–1576 (68 yıl); "Yaklaşık yetmiş yıllık bu uzun sanat yolculuğu" olarak düzeltildi. | Düzeltildi |
| "1550'lerde ... Artık altmışlı yaşlarını geride bırakan ressam" | 1553 − (1488..1490) = 63–65 (henüz altmışlarının ortası); "Artık altmışlı yaşlarında olan ressam" olarak düzeltildi. | Düzeltildi |
| "Üç yüzyıl sonra Édouard Manet, Urbino Venüsü'nün ... Olympia'sına" | 1863 − 1538 = 325 yıl; "Üç yüzyılı aşkın bir süre sonra" olarak düzeltildi. | Düzeltildi |
| "27 Ağustos 1576 ... Orazio da dört gün sonra" | 31 Ağustos − 27 Ağustos = 4 gün | Doğru |

## 2. Tablo İçi Yön (Sol / Sağ) Denetimi

- *Kutsal ve Dünyevi Aşk*: "İzleyiciye göre solda ağır beyaz ve kırmızı gelinlikli ... Sağda ise çıplak bedeni ..." — Galleria Borghese sayfasından doğrulandı.
- *Pesaro Madonnası*: "Meryem ile Çocuk İsa'yı ... izleyiciye göre sağa doğru kaydırdı ... İzleyiciye göre solda bağışçı Jacopo Pesaro ... sağda diz çöken Pesaro ailesinin içinden küçük Leonardo Pesaro" — Save Venice ve Smarthistory/Khan Academy sayfalarından doğrulandı.
- *Bacchus ve Ariadne*: "izleyiciye göre solda, uzaklaşan Theseus'un gemisine bakan terk edilmiş Ariadne ... sağda ise ... Bacchus" — National Gallery Londra sayfasından doğrulandı.
- *Basiret Alegorisi*: İlk taslaktaki "izleyiciye göre soldan sağa kurt, aslan ve köpek" yön ifadesi, doğrudan müze sayfasında sol-sağ sırası metin olarak teyit edilmediği için kaldırıldı ("kurt, aslan ve köpek başlarının üzerinde").
- *Papa III. Paulus ve Torunları*: Sol/sağ yönü belirtilmedi.

## 3. Kaynak, Efsane ve Üslup Denetimi

- **Araştırma dosyası dışı ayrıntıların çıkarılması:** İlk taslakta aramalarla doğrudan belgelenmemiş olan "ağabeyi Francesco ile" ifadesi ile Palma il Giovane'ye atfedilen "haftalarca duvara çevirip bekletme / düşmanı inceler gibi" cümlesi hem hikâyeden hem araştırma dosyasından çıkarıldı; yalnızca taranan kaynakta doğrulanmış Palma il Giovane tanıklığı bırakıldı.
- **Rivayet ve tek kaynak çerçeveleme:** Giorgio Vasari'nin Roma'daki Michelangelo ziyareti, Carlo Ridolfi'nin Augsburg'da düşen fırça ve Tintoretto'nun atölyeden uzaklaştırılması anlatıları ile Erwin Panofsky'nin *Basiret Alegorisi* yorumu kaynaklarıyla çerçevelendi.
- **Sesli okuma (TTS) ve yazım düzeltmeleri:** 4. ve 6. bölümlerdeki üç ara tire bloğu akıcı düz cümlelere çevrildi; `hakimi` yazımı `hâkimi` olarak düzeltildi. Parantez ve kısaltma sayısı 0'dır.
- **Eser listesi ve kod denetimi:** Yalnızca `data/eserler_onbellek.json` içindeki `qid`'li Titian eserleri kullanıldı; listede olmayan (*Pietà*, *Pietro Aretino Portresi*, *Perseus ve Andromeda* gibi) eserler hikâyede anılmadı. `scripts/hikaye_ekle.py` uyarısız geçti.
