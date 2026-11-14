# AKADEMİK STANDART — Sanat Atlası Başyapıt Mikro Dersleri

**Sürüm:** 1.0 · **Tarih:** 13 Kasım 2026
**Kapsam:** `data/basyapitlar.json` içindeki 107 başyapıt için üç seviyeli mikro dersler, kanıt dosyaları, soru bankaları ve yapılandırılmış JSON çıktıları.
**Statü:** Bu klasör yalnızca yeni araştırma/ders dosyaları içerir. Mevcut kaynak kodları, uygulama verileri (`data/`) ve denetim raporları (`DENETIM_*.md`) değiştirilmez. Commit/push/deployment yapılmaz.

---

## 1. Temel İlke

Öncelik metin hacmi değil; **doğru, kaynaklarla desteklenen, akademik açıdan savunulabilir ve denetlenebilir** bir eğitim arşividir. Belirsizlik gizlenmez. Kaynağın desteklemediği hiçbir iddia kesin bilgi olarak sunulmaz. **Kanıt yoksa üretme:** eksik bölüm, uydurma bilgiden değerlidir.

## 2. Kaynak Hiyerarşisi

1. Eserin bulunduğu müzenin **resmî koleksiyon kaydı** ve envanter bilgileri (birincil).
2. Müzenin **teknik / restorasyon / konservasyon araştırmaları** (birincil).
3. **Hakemli akademik makaleler ve monografiler** (birincil/ikincil; erişim durumu kaydedilir).
4. Güvenilir **üniversite, müze ve araştırma kurumu yayınları** (ör. Met Heilbrunn, NGA sistematik katalogları, müze sergi kitapçıkları).
5. **Wikidata ve Wikipedia** — yalnızca yardımcı/ikincil kaynak. Wikidata'da tarih hassasiyeti (precision) ve niteleyiciler (P1480 vb.) aynen korunur.

Birincil kaynaklar da yanılabilir veya güncellenebilir. Çelişkiler karşılaştırılır; hangi kurumun hangi iddiayı desteklediği açıkça yazılır. Kaynağa erişilemiyorsa **erişilmiş gibi davranılmaz**; erişim durumu (HTTP kodu, engel, tarih) kaydedilir.

## 3. İddia–Kanıt Kuralları

- Her önemli olgusal iddiaya benzersiz kimlik verilir: `C001`, `C002`, … (eser bazlı, `KANIT_DOSYASI.md` içinde).
- Her iddia kaydı şu alanları taşır: iddia kimliği · açık ifade · kaynak kurumu ve belge adı · doğrudan URL · erişim tarihi ve durumu · destekleyen katalog alanı/bölüm/kısa pasaj · doğrudan kanıt / dolaylı çıkarım ayrımı · çelişen görüşler · doğrulama seviyesi.
- Ders metinlerindeki olgusal cümleler köşeli parantezle iddia kimliğine bağlanır: `[C003]`.
- Bir URL'nin var olması veya arama sonucunda görünmesi doğrulama değildir; ilgili sayfanın erişilebilirliği ve iddiayı destekleyen bölümü kontrol edilir.
- **Uydurma bibliyografik bilgi yasaktır:** doğrulanmamış DOI, ISBN, sayfa numarası, makale adı, doğrudan alıntı veya envanter numarası üretilmez. Bir kitap yalnızca erişilen bir kaydın bibliyografyasında görülüyorsa "kaynakçada anıldı, metnine erişilmedi" notuyla verilir.

## 4. Doğrulama Seviyeleri (A–E)

| Seviye | Tanım | Kullanım |
|---|---|---|
| **A** | Birincil katalog veya doğrudan akademik kanıt (erişilmiş müze kaydı, müze teknik raporu, hakemli makale). | Olgusal anlatım + sınav cevabı. |
| **B** | Güvenilir ikincil akademik kaynak (erişilmiş kurum yayını, güvenilir katalog özeti, Wikipedia'nın kaynaklı maddesi). | Olgusal anlatım + sınav cevabı (kaynak zinciri notuyla). |
| **C** | Yorum veya çıkarım; olgu olarak doğrulanmadı. | Yalnızca "yorum" olarak, açıkça işaretli. |
| **D** | Kaynaklar arasında ihtilaf. | Tartışma olarak sunulur; kesin cevaplı soruya girmez. |
| **E** | Kanıt yetersiz veya kaynağa erişilemedi. | Kesin ders anlatımına ve doğru cevaplı sorulara **girmez**. |

Bu etiketler yazarın (modelin) kendi değerlendirmesidir; doğruluğun bağımsız garantisi değildir. İnsan editoryal onayı ayrıdır.

## 5. Belirsizliğin Korunması

- Tartışmalı atıflar, yaklaşık tarihler ve kaynak uyuşmazlıkları kesinleştirilmez. "y." (yaklaşık), "c." (circa), "?" (muzenin kendi kuşku işareti) aynen taşınır.
- Tarih aralıkları kaynaklara atfedilir: "Rijksmuseum güncel kaydı c. 1660; Liedtke c. 1657–58 önerir" gibi.
- Müzenin provenance kaydındaki kuşku işaretleri silinmez.

## 6. Görsel Analiz Kuralı

- Doğru eser görseline erişmeden renk, biçim, perspektif, ışık, kompozisyon, ikonografi veya detay hakkında **kesin gözlem yazılmaz**.
- Görsel doğrulama durumu kaydedilir: hangi çözünürlükte, hangi kaynak görüntüsü, hangi bölgeler incelendi. Farklı baskı/versiyon/restorasyon/kırpma ayrımı yapılır.
- Görsel ayrıntısı yalnızca ikincil kaynağın betimlemesine dayanıyorsa bu açıkça belirtilir ("kaynakların betimlediği…") ve doğrudan görsel teyit yapılmadığı not edilir.
- Lisansı belirsiz görseller yeniden yayımlanmaz veya proje içine kopyalanmaz. Derslerde görsel **URL + lisans + kaynak** olarak referans verilir; analiz için indirilen geçici kopyalar `.qwen/tmp/` altında tutulur, teslimata girmez.

## 7. Felsefi Yorum / Tarihsel Olgu Ayrımı

- Kant, Hegel, Benjamin, Berger, Panofsky gibi düşünürlerle yorum yapılabilir; ancak doğrulanmış tarihsel kanıt olmadan **sanatçının bu düşünürlerden etkilendiği iddia edilmez**.
- Felsefi bölümler "yorum" etiketiyle sunulur ve olgusal iddia sayılmaz (C seviyesi).

## 8. Üç Seviye — Pedagojik Standart

| Seviye | Süre | Yaklaşık kelime (TR, ~140 kelime/dk) | İçerik |
|---|---|---|---|
| Başlangıç | 3 dk | 400–500 | Kimlik, temel görsel unsurlar, bağlam, neden önemli; terimler kısa tanımlı. |
| Orta | 10 dk | 1300–1600 | Yakın görsel analiz, ikonografi, teknik, karşılaştırma, kaynaklı yorum. |
| İleri | 20 dk | 2600–3200 | Akademik tartışmalar, yorum ekolleri, eser tarihi, metodoloji, gerekçeli estetik/felsefi inceleme. |

Aynı metin uzatılarak seviye üretilmez; ileri düzey gerçekten daha derin sorular sorar. Kelime sayıları tahmindir, hedef uzunluk için bilgi eklenmez.

## 9. On İki Bölümlü Eser İncelemesi

Her eser için 12 bölüm kapsanır (kanıt yetersizse kapsamı azaltılır veya gerekçeli boş bırakılır):
1 Kimlik · 2 Tarihsel bağlam · 3 Sanatçının kariyeri · 4 Biçimsel analiz · 5 İkonografi · 6 Teknik ve malzeme · 7 Felsefi ve estetik analiz · 8 Karşılaştırmalı analiz · 9 Akademik tartışmalar · 10 Küratöryel anlatı · 11 Öğrenme etkinlikleri · 12 Kaynakça.

Bölümlerin seviyelere dağılımı `DERS.json → bolum_eslesme` alanında kayıtlıdır.

## 10. Soru Bankası Standartları

Yeterli kanıt varsa eser başına: 5 öğrenme kazanımı, 5 temel kavram, 5 görsel gözlem sorusu, 10 çoktan seçmeli, 5 açıklamalı doğru/yanlış, 5 açık uçlu, 5 aralıklı tekrar kartı, 3 karşılaştırmalı eser önerisi.

- Her çoktan seçmeli soru: doğru yanıt + gerekçe + **her yanlış seçeneğin neden yanlış olduğu** + ilişkili kanıt kimlikleri.
- Doğru cevaplar yalnızca **A/B** seviyeli iddialara dayanır. D (ihtilaflı) ve E (yetersiz) iddialardan kesin cevaplı soru üretilmez.
- Kanıt yetersizse soru sayısı azaltılır; sayıya ulaşmak için uydurma bilgi kullanılmaz.

## 11. İki Kademeli Kalite Kontrol

- **Denetim A — İddia-kaynak eşleştirmesi:** dersin bütün olgusal cümleleri kanıt dosyasındaki iddialara bağlanır; desteklenmeyenler çıkarılır veya belirsizlik ifadesiyle yeniden yazılır. Sonuç `KALITE_KONTROL.md`'ye işlenir.
- **Denetim B — Kaynağa geri dönüş:** ilk metinden bağımsız bir turda ilgili müze katalogları ve akademik kaynaklar **yeniden açılır**; iddiaları gerçekten destekleyip desteklemedikleri kontrol edilir. Yalnızca taslağı yeniden okumak bağımsız doğrulama sayılmaz. Haricî model/insan editör denetimi ayrıca gereklidir ve bu klasörde "bekliyor" olarak işaretlenir.

## 12. Yayına Aday Olma Kriterleri

Bir ders ancak şu koşullarla "Yayına aday" olur: temel kimlik ve atıf doğrulanmış · tüm olgusal cümleler kanıt kayıtlı · görsel analiz doğru eser/görselle yapılmış · yorumlar olgulardan ayrılmış · quiz cevapları doğrulanmış iddialara dayanıyor · kaynak bağlantıları erişim durumlarıyla kayıtlı · ciddi çelişkiler açıkça belirtilmiş · Denetim A + B tamamlanmış.

**Bu koşullar sağlansa bile içerik doğrudan yayımlanmaz; insan editoryal onayı bekler.**

## 13. Durum Sözlüğü

`Araştırılmadı → Kaynak araştırılıyor → Kanıt envanteri hazır → Taslak hazır → Doğrulama bekliyor → İnsan incelemesi bekliyor → Yayına aday`

Parti bitimlerinde doğrulanan / ihtilaflı / doğrulanamayan iddia sayıları raporlanır. Kesintide `DURUM.md` üzerinden devam edilir; tamamlanmış çalışma yeniden üretilmez.

## 14. Önceki Denetimlerle İlişki

Aşama 1–7 denetim bulguları (özellikle A3-1…A3-18 yanlış atıf/tarih/mükerrer/müze sorunları ve A4-1…A4-14 lisans riskleri) ders üretiminde bağlam olarak kullanılır. Ders dosyaları mevcut veriyi **düzeltmez**; uyuşmazlıklar `KALITE_KONTROL.md` ve `DURUM.md`'de "veri notu" olarak raporlanır ve onaya sunulur. Telif çerçevesi: TR/AB ölüm+70 kuralı (Aşama 4); korumalı sanatçıların eserlerinde görsel yeniden yayımlanmaz, ders metni ancak hak politikası kararıyla birlikte düşünülür.

## 15. Dil

Tüm ders metinleri, raporlar ve arayüz metinleri Türkçe; eser özgün başlıkları, envanter numaraları, teknik terimler ve kaynak künyeleri özgün biçiminde korunur. Teknik terimler ilk kullanımda kısa tanımla verilir.