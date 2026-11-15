# AKADEMİK DOĞRULAMA KURALLARI — Resim Ansiklopedisi

**Sürüm:** 1.0 · **Tarih:** 15 Kasım 2026
**Kapsam:** `resim-ansiklopedisi/` altındaki dört ansiklopedinin (ikonografi, mitoloji, resim teknikleri, tarihsel nesneler) tüm maddeleri.
**Öncelik:** Bu belge bütün diğer üretim talimatlarından önceliklidir. Akademik doğruluk, madde sayısından ve üretim hızından her zaman önemlidir.

---

## 1. Temel İlke: ÖNCE KAYNAK, SONRA MADDE

Bir madde hakkında önce kaynak araştırması yapılır; açıklama yazılmaz. Sıra:

1. Güvenilir kaynakları bul.
2. Kaynakları **gerçekten aç ve oku**.
3. İlgili pasajları belirle.
4. Doğrulanabilir iddiaları çıkar.
5. İddiaları kanıt kayıtlarına bağla.
6. Ancak bundan sonra ansiklopedi metnini yaz.

**Kanıt yoksa üretme.** Eksik madde, uydurma bilgiden değerlidir. Boşluklar modelin genel kültürüyle doldurulmaz.

## 2. Kaynak Hiyerarşisi

Öncelik sırası (her kaynak kaydında `hiyerarsi_seviyesi` olarak saklanır):

1. Müze ve resmî koleksiyon kayıtları (birincil)
2. Üniversite ve akademik kurum yayınları
3. Hakemli akademik makaleler
4. Akademik kitaplar ve kataloglar
5. Konuya özgü güvenilir uzmanlık ansiklopedileri (ör. Britannica, Met Heilbrunn, NG teknik sözlüğü, Encyclopaedia Iranica, Kokugakuin Shinto veritabanı)
6. Diğer kaynaklar

- Wikipedia araştırmaya başlamak için kullanılabilir ama **tek başına akademik doğrulama sayılmaz**. Satır içi akademik atıf zinciri varsa ikincil kaynak (B) olarak, atıf notuyla kullanılabilir.
- Erişemediğin akademik kitap/makalenin içeriğini okumuş gibi davranma. Yalnızca künyesi biliniyorsa "kaynakçada anıldı, metnine erişilmedi" notuyla `ERISILEMEDI` olarak kaydedilir; iddiaya DOGRULANDI desteği vermez.
- Aynı Wikipedia maddesini tekrarlayan iki site bağımsız kaynak sayılmaz.

## 3. Her Önemli İddia İçin Kanıt Kaydı

Her maddede `claim_id` ile izlenebilir iddialar oluşturulur (`C001`, `C002`, …; madde içinde benzersiz). Metindeki olgusal cümleler `[C003]` biçiminde iddiaya bağlanır.

Her iddia için `kanit-kayitlari/<MADDE-ID>.json` içinde ayrı bir kanıt kaydı bulunur ve şu alanları taşır:

- `claim_id` — iddia kimliği
- `iddia` — açık ve tek anlamlı iddia ifadesi (madde JSON'undaki ile birebir aynı)
- `iddia_turu` — OLGU / TARIH / TEKNIK_TANIM / YORUM / HIPOTEZ / GELENEKSEL_ANLATI
- `kaynak_id`, kaynak kurum/yazar, başlık, gerçek URL veya bibliyografik künye
- `pasaj` — doğrudan incelenen kaynak pasajı (kısa, telif sınırlarına uygun alıntı)
- `pasaj_konum` — sayfa, başlık veya bölüm konumu
- `erisim` — erişim durumu (ERISILDI_OKUNDU / WAYBACK_OKUNDU / ERISILDI_KISMEN / JS_KABUGU / ENGELLI / ERISILEMEDI), tarih, HTTP kodu, yöntem (canlı/wayback/api)
- `belirsizlik_ifadeleri` — kaynaktaki ihtiyatlı ifadeler ("possibly", "attributed to", "circa", …)
- `destek_duzeyi` — DOGRUDAN_DESTEK / DOLAYLI_DESTEK / KISMEN_DESTEK / DESTEKLEMIYOR
- `celisen_kaynaklar` — çelişen kaynaklar ve çelişkinin niteliği
- `dogrulama_sonucu` — DOGRULANDI / KISMEN_DESTEKLENIYOR / DOGRULANAMADI / CELISKILI / HATALI

**Sadece kaynakça listesi yeterli değildir.** Kaynak ID'sinin varlığı, iddianın doğrulandığı anlamına gelmez.

## 4. Bağlantı Kontrolü

Bir URL'nin açılması, iddianın doğrulandığı anlamına gelmez. Kaynağın gerçekten doğru kavramı, nesneyi, resmi, figürü veya tekniği anlattığı kontrol edilir.

Resim örneği veriliyorsa (`dogrulanmis_resim_ornekleri`) şu bilgiler erişilebilir kaynakla eşleştirilir: sanatçı · eser başlığı · yaklaşık/kesin tarih · müze veya koleksiyon · eserin doğru versiyonu · ilgili teknik/ikonografik unsur. Yanlış esere, farklı versiyona veya replikaya ait kayıt kesin kanıt olarak kullanılmaz.

## 5. Yorum ile Olguyu Ayır

Özellikle sembolizmde şu türler ayrı `iddia_turu` değerleridir:

- Doğrudan gözlem / belgelendirilmiş tarihsel bilgi → **OLGU** veya **TARIH**
- Akademik görüş, belirli bir araştırmacının yorumu → **YORUM** (kime ait olduğu metinde açıkça belirtilir; genel kabul gibi yazılmaz)
- Tartışmalı hipotez → **HIPOTEZ**
- Geleneksel anlatı → **GELENEKSEL_ANLATI** (tarihsel olgu gibi sunulmaz)

Bir nesneye sembolik anlam **otomatik olarak atfedilmez**. Örneğin bir köpeğin her resimde sadakati temsil ettiği ileri sürülemez; sembolizm dönem, sanatçı, eser ve bağlama göre kaynakla doğrulanır. Zorunlu ayrım: (1) resimde görülen nesne/figür · (2) nesnenin tarihsel kullanımı · (3) ona atfedilen sembolik anlam · (4) bu anlamı savunan kaynak/araştırmacı · (5) alternatif ve karşıt yorumlar.

## 6. Belirsizlikleri Koru

Kaynakta "possibly, probably, traditionally identified as, attributed to, circa, hypothesized, disputed, may represent" gibi ifadeler varsa Türkçe metinde anlamları korunur ("olasılıkla", "geleneksel olarak … ile özdeşleştirilir", "yaklaşık (y.)", "atfedilir", "tartışmalıdır", "temsil ediyor olabilir"). Kaynağın ihtiyatlı ifadesi kesinleştirilmez.

## 7. Bağımsız Kaynaklar

- Basit teknik tanımlar için doğrudan ilgili güvenilir bir kurumsal kaynak yeterli olabilir.
- Tartışmalı sembolik yorumlar, kesin etimolojiler, karmaşık mitolojik ilişkiler ve ihtilaflı tarihsel iddialar için mümkünse **iki bağımsız akademik kaynak** kullanılır.
- İki kaynak bulunamıyorsa eksik ikinci kaynak **uydurulmaz**; iddia KISMEN_DESTEKLENIYOR veya DOGRULANAMADI olarak işaretlenir.

## 8. Doğrulanamayan Bilgi

Kaynağa erişilemediğinde veya kanıt yetersiz olduğunda:

- İddia metinden çıkarılır, veya
- Belirsizliği açıkça belirtilerek ("kaynaklar ihtilaflıdır", "doğrulanamadı") yazılır, veya
- `DOGRULANAMADI` olarak kanıt kaydında tutulur ve kesin anlatıya dayanak yapılmaz.

Eksik kaynak başarısızlık değildir; doğrulanmamış bilgiyi gerçekmiş gibi sunmak başarısızlıktır.

## 9. Doğrulama ve Yayın Durumları

Her iddia için: `DOGRULANDI` · `KISMEN_DESTEKLENIYOR` · `DOGRULANAMADI` · `CELISKILI` · `HATALI`

- `DOGRULANDI` yalnızca ilgili kaynak gerçekten incelendiğinde (`ERISILDI_OKUNDU` veya `WAYBACK_OKUNDU`) ve iddiayı doğrudan desteklediğinde kullanılabilir.

Her madde için: `TASLAK` · `BAGIMSIZ_DENETIM_BEKLIYOR` · `YAYIN_ONAYLI`

- **Qwen kendi yazdığı maddeye YAYIN_ONAYLI statüsü VEREMEZ** (doğrulayıcı bunu hata olarak reddeder).
- Yayın onayı bağımsız akademik inceleme ve insan editoryal kararı gerektirir.
- Pilot maddeler en fazla `BAGIMSIZ_DENETIM_BEKLIYOR` olabilir.

## 10. Otomatik Kontrolün Sınırı

`dogrula.py` şema, kimlik, çapraz tutarlılık ve durum kurallarını denetler; **içeriğin olgusal/semantik doğruluğunu garanti etmez**. Bir URL'nin açılması akademik doğruluğu kanıtlamaz; metnin kaynağı doğru yorumlayıp yorumlamadığı biçimsel testle doğrulanmış sayılamaz. Her madde bağımsız denetim (haricî model + insan) bekler.

## 11. Kapsam Sınırı

Yalnızca resim sanatı: tuval/panel, duvar resmi ve fresk, el yazması minyatürleri, suluboya/guaj/mürekkep, Doğu Asya ve Osmanlı/İran/Hint resim gelenekleri, tarihsel/modern resim yöntemleri, resimlerdeki ikonografi, mitolojik anlatılar ve tarihsel nesneler. Bağımsız heykel, mimarlık, seramik, fotoğraf, sinema ve bağımsız baskı sanatları **kapsam dışıdır**; bir resimde tasvir edildikleri ölçüde bağlam olarak ele alınabilir. Her maddede `resim_sanatiyla_iliskisi` alanı doldurulur.

## 12. Uydurma Yasağı

Doğrulanmamış DOI, ISBN, sayfa numarası, makale adı, doğrudan alıntı, envanter numarası ve URL üretilmez. Erişilemeyen kaynak `ERISILEMEDI` olarak kaydedilir. Erişim engelleri (HTTP 403/429, JS kabuğu, bot koruması) tarih ve kodla raporlanır; Wayback kopyası kullanılırsa arşiv tarihi beyan edilir.

## 13. Dil

Tüm madde metinleri, raporlar ve açıklamalar Türkçe; özgün adlar, teknik terimler, envanter numaraları ve kaynak künyeleri özgün biçiminde korunur. Terimler ilk kullanımda kısaca tanımlanır.
