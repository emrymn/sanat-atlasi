# TAKSONOMİ — Resim Ansiklopedisi

**Sürüm:** 1.0 · **Tarih:** 15 Kasım 2026
**Amaç:** Dört ansiklopedinin kategori/alt-kategori sözlüğü, madde kimlik düzeni ve kavram ayrım kuralları. `dogrula.py`, `kategori` alanının bu taksonomide tanımlı olmasını denetler.

---

## 0. Kimlik ve Adlandırma Düzeni

| Ansiklopedi | ID öneki | Dizin | ansiklopedi_turu |
|---|---|---|---|
| Resimde İkonografi ve Semboller Sözlüğü | `IKO-` | `ikonografi/` | `IKONOGRAFI` |
| Resimde Mitoloji Ansiklopedisi | `MIT-` | `mitoloji/` | `MITOLOJI` |
| Resim Teknikleri Atlası | `TEK-` | `resim-teknikleri/` | `RESIM_TEKNIGI` |
| Resimlerdeki Tarihsel Nesneler Kataloğu | `NES-` | `resimlerdeki-nesneler/` | `TARIHSEL_NESNE` |

- Madde ID: `<ÖNEK><3 hane>` (ör. `IKO-001`). Kalıcıdır; silinirse yeniden kullanılmaz.
- Dosya adı: `<kategori-dizini>/<MADDE-ID>-<slug>.json` (ör. `ikonografi/IKO-001-lotus.json`).
- `slug`: yalnız `[a-z0-9-]`; Türkçe karakter yok; ID ile birebir eşleşen tek slug.
- Kanıt dosyası: `kanit-kayitlari/<MADDE-ID>.json`.
- İlgili maddeler serbest metinle değil, kalıcı ID'lerle (`ilgili_maddeler: ["NES-002"]`) bağlanır.

## 1. İKONOGRAFİ — kategori listesi

| kategori | Kapsam |
|---|---|
| `hristiyan-ikonografisi` | Hristiyan konulu resimlerde figür, nesne ve alegoriler |
| `antik-ikonografi` | Yunan ve Roma görsel gelenekleri ve sonraki alımlanmaları |
| `islam-dunyasi-ikonografisi` | İslam coğrafyasındaki resim/minyatür geleneklerinde görsel işaretler |
| `guney-asya-ikonografisi` | Hint ve Güneydoğu Asya resim/minyatür gelenekleri |
| `dogu-asya-ikonografisi` | Çin, Japon ve Kore resim geleneklerinde sembolizm |
| `osmanli-iran-minyatur-ikonografisi` | Osmanlı ve İran minyatür resmine özgü görsel dil |
| `bitki-hayvan-sembolizmi` | Flora ve fauna motiflerinin dönem/bağlama göre anlamları |
| `renk-sayi-sembolizmi` | Renk ve sayıların resimdeki sembolik kullanımları |
| `alegorik-figurler` | Kişileştirilmiş figürler (Zaman, Ölüm, Erdem, Aşk, İktidar…) |
| `vanitas-naturmort-sembolleri` | Vanitas ve natürmort geleneğinin işaret dağarcığı |
| `kavram-alegorileri` | Ölüm, zaman, erdem, aşk, iktidar gibi kavramların görselleştirilmesi |

**Zorunlu ayrım (her maddede):** görünen nesne/figür → tarihsel kullanım → atfedilen sembolik anlam → bu anlamın kaynağı/savunucusu → alternatif yorumlar. Sembol anlam otomatik atfedilmez; dönem, sanatçı, eser ve bağlamla doğrulanır.

## 2. MİTOLOJİ — kategori listesi

| kategori | Kapsam |
|---|---|
| `yunan-roma-mitolojisi` | Yunan ve Roma figür/anlatıları |
| `misir-mezopotamya-mitolojisi` | Mısır ve Mezopotamya gelenekleri |
| `iskandinav-kelt-gelenekleri` | Kuzey Avrupa ve Kelt anlatıları |
| `hint-mitolojisi` | Hint alt kıtasının mitolojik figür ve anlatıları |
| `cin-japon-mitolojisi` | Çin, Japon (ve Kore) mitolojik gelenekleri |
| `turk-orta-asya-gelenekleri` | Türk ve Orta Asya anlatıları |
| `diger-mitolojik-gelenekler` | Yukarıdakilere girmeyen, resimde görselleştirilmiş gelenekler |

**Kurallar:** Mitolojik anlatı tarihsel olgu gibi sunulmaz (`GELENEKSEL_ANLATI` türü). Farklı metinlerdeki versiyonlar tek kesin anlatıda birleştirilmez; versiyon farkları kaynaklarıyla yazılır. Her maddenin resim sanatıyla anlamlı bağlantısı zorunludur (`resim_sanatiyla_iliskisi` + doğrulanmış resim örnekleri). Birincil metinler (Hesiodos, Ovidius, Kojiki, Bhagavata Purana…) ile resim örnekleri ayrı kaynak kayıtlarıyla ayrışır.

## 3. RESİM TEKNİKLERİ — kategori listesi

| kategori | Kapsam |
|---|---|
| `baglayici-ve-medya` | Yağlıboya, tempera, fresk, suluboya, guaj, akrilik, pastel, enkaustik, mürekkep |
| `uygulama-ve-yuzey` | Impasto, glaze, grisaille, astar/underdrawing, kazıma gibi uygulama yöntemleri |
| `isik-golge-teknikleri` | Sfumato, chiaroscuro, tenebrizm |
| `renk-teknikleri` | Renk, ışık ve palet yaklaşımları |
| `kompozisyon-ve-perspektif` | Perspektif yöntemleri, kompozisyon şemaları |
| `minyatur-teknikleri` | Minyatür ve el yazması resimleme teknikleri (wasli, Osmanlı/İran/Hint yöntemleri) |
| `murekkep-teknikleri` | Doğu Asya mürekkep resmi yöntemleri |

**Kurallar:** Malzeme, üretim tekniği, resim yüzeyi, görsel etki ve kompozisyon yöntemi birbirine karıştırılmaz. Belirli bir sanatçının belirli bir yöntemi kullandığı güvenilir kaynaktan doğrulanmadan yazılmaz. Her maddede: tanım · sınıflandırma · malzemeler · araçlar · uygulama süreci · tarihsel gelişim · avantaj/sınırlılıklar · benzer yöntemlerden farklar · doğrulanmış sanatçı/resim örnekleri.

## 4. TARİHSEL NESNELER — kategori listesi

| kategori | Kapsam |
|---|---|
| `kiyafet-ve-aksesuarlar` | Giysi, takı, başlık |
| `muzik-aletleri` | Çalgılar ve resimdeki temsilleri |
| `silah-ve-zirhlar` | Silah, zırh, miğfer |
| `mobilyalar` | Oturma, depolama, masa türleri |
| `dini-torensel-nesneler` | Litürjik ve törensel objeler |
| `gundelik-yasam-araclari` | Ev ve gündelik yaşam araç gereçleri |
| `bilimsel-aletler` | Saat, ölçüm, astronomi, optik aletler |
| `kitap-yazi-araclari` | Kitap, el yazması, yazı takımı, hokka-fırça |
| `sofra-esyalari` | Yeme-içme kap kacağı |
| `ticaret-meslek-araclari` | Meslek ve ticaret nesneleri |
| `diger-nesneler` | Yukarıdakilere girmeyen nesneler |

**Kurallar:** Nesnenin tarihsel kullanımı ile bir resimde sembolik anlam taşıdığı iddiası **ayrı** değerlendirilir; sembolik iddialar ilgili ikonografi maddesine `ilgili_maddeler` ile bağlanır. Her maddede: ad · fiziksel özellikler · tarihsel kullanım · kültürel bağlam · dönemler · resimde temsil biçimi · doğrulanmış tablo örnekleri · varsa ikonografi karşılığı.

## 5. Çapraz Bağlantı ve Kavram Ayrımı Kuralları

1. Nesne → sembolik anlam: `NES-xxx → IKO-yyy` (ör. kum saati → vanitas).
2. Mitolojik figür → sembol: `MIT-xxx → IKO-yyy`.
3. Teknik → ilgili teknik: `TEK-xxx → TEK-yyy` (ör. fresk → secco; glaze → yağlıboya).
4. Teknik → nesne: `TEK-xxx → NES-yyy` (ör. mürekkep resmi → hokka/fırça).
5. Aynı ad farklı kültürlerde farklı kavramlara işaret ediyorsa (ör. "ejderha" Çin ve Avrupa geleneğinde) **tek maddede birleştirilmez**; ayrı maddeler açılır ve karşılıklı `ilgili_maddeler` + metinde fark açıklaması verilir.
6. `ilgili_maddeler` yalnız gerçekten var olan ID'leri içerir (doğrulayıcı denetler).

## 6. Kategori Dışı Durumlar

Listeye uymayan yeni bir alt alan gerekiyorsa önce bu taksonomi güncellenir (sürüm notuyla), sonra madde üretilir. Doğrulayıcı, taksonomide olmayan `kategori` değerini hata sayar.
