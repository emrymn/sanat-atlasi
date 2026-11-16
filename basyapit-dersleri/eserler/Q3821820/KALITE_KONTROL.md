# KALİTE KONTROL — Q3821820 · Bale Dersi (La classe de danse / The Ballet Class) · Edgar Degas

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti5/Q3821820-brief.md`); ham cache `.qwen/tmp/parti5/Q3821820-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Üç dersteki olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q3821820 için temiz.
- **Toplam iddia:** 53 (C001–C053). A=23, B=10, C=4, D=8, E=8. KANIT "Sayım:" satırı DERS.json ile birebir uyumlu.
- **A düzeyi:** Orsay tam notice (S6, arşiv) + POP Joconde (S9, canlı) + Orsay FR/EN/IT yorumları (S7/S5/S8, arşiv) + Met karşılaştırma kaydı (S11, arşiv) + Commons/WD lisans metadata (S13/S1). Künye, imza, provenans, sergiler, ikonografi, kompozisyon betimi, Perrot kimliği, katalog numaraları.
- **B düzeyi:** enwiki atıf zincirli akademik aktarımlar (DeVonyar & Kendall, Schacherl, Armstrong, Mühlberger, Meyer, Kendall, Pickvance) + frwiki→Brocvielle alıntısı; tümünün kitap/makale metinlerine erişilmedi (C050 E, not edildi).
- **C düzeyi:** Larousse/itwiki betimleri ve bütünleşik estetik okuma (C032–C034, C053) — derslerde "(yorum)" işaretli.
- **D düzeyi:** 8 ihtilaf (C038–C045) — derslerde "(tartışma)" işaretli; hiçbir quiz doğru cevabı D'ye dayanmaz.
- **E düzeyi:** 8 belirsizlik (C036, C037, C046–C051) — "(belirsiz)" işaretli; quiz kanıtı olarak kullanılmadı.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B kanıtlı; 5 AU serbest (C/D/E dahil). Çeldirici gerekçeleri bağlamsal (totoloji yok; dogrula totoloji kontrolü temiz). CS07 çeldiricisi data'nın doğrulanmamış "kabın üstünde imza" iddiasını pedagojik olarak işler.
- **Versiyon disiplini:** Faure komisyonu hiçbir ders cümlesinde Orsay sürümüne olgu olarak atfedilmedi; yalnız D5 tartışması ve Met künyesi içinde anıldı. Met sürümü Q18758802 ayrı eser olarak her seviyede ayrıştırıldı.
- **GZ TASLAK:** görsel incelenmedi → gen.py gz_taslak otomatik uygulandı (5/5 soru TASLAK önekli).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Brief'ten bağımsız ikinci turda ham cache'ler yeniden açılıp iddialarla karşılaştırıldı (14 Kasım 2026):
- **S6 notice txt:** "entre 1873 et 1876", H. 85,5/L. 75,0, çerçeve 109,5×99,3 (2008), "S.b.g. : Degas", RF 1976, Salle 32, Historique (Deschamps 1876→Hill→Christie's 25 Mayıs 1889 n°27→Goupil→Manzi 1889→Camondo 1894–1911→1911 legs→1914 sergi→1947 Jeu de Paume→1986 Orsay), Exposition(s), bibliyografya, ikonografi "scène de la vie moderne / chien / arrosoir" ✓.
- **S9 POP txt (canlı):** "1871 vers ; 1874 ET", "85 H ; 75 L", "DEGAS (S.B.G.)", LEMOISNE 341/MINERVINO 479, "Manzi Michel (marchand, 1893)", 1911 acquisition, 1986 dépôt, sujet (miroir dahil) ✓.
- **S5/S7/S8 yorum txt:** "Entre 1871 et 1874", 85×75, dersin sonu, "portrait de Jules Perrot, authentique maître de ballet", baston, rue Le Peletier/Garnier, müzisyen arkadaş, Valéry, parquet ıslatma ✓.
- **S11 Met txt:** 1874, 83,5×77,2, 1987.47.1, Bingham 1986, Gallery 815, "singer Jean-Baptiste Faure ... commissioned the picture and lent it to the 1876 Impressionist exhibition", "imaginary scene ... old Paris Opéra ... burned", sesli rehber (pembe kuşak/attitude, yukarı eğimli perspektif, figür değişimi, müzik dizesi) ✓.
- **S12 Larousse txt:** 1873–1876, 85×75, "presque trois ans", "première grande composition", eğik duvar+ayna, "toujours identifié à un ami du peintre" ✓.
- **S2/S3/S4/S14 wikitext:** B zincirleri (Mérante "thought to be", 1872 çizimleri, yelpaze/pati, stage mothers, siyah kurdele, Pickvance/Lemoisne, ~64 yaş, ilişki "unknown", Choiseul, üç büyük tablo); frwiki "peut-être" hedge + "étoffres" alıntısı; itwiki çapraz tarihler + atıfsız rivayet alıntı ✓.
- **S13 imageinfo:** iki dosya PD (PD-old-100-expired + PD-Art), GAP 3950×4535 / infobox 4618×5300, DateTimeOriginal "(1871 - 1874)" / 1875, GAP credit fwE5p5FTjV9Ezg ✓.

**Doğrulanan ihtilaflar:** D1 tarih (Orsay içi), D2 boyut, D3 Manzi, D4 mekân, D5 Faure, D6 ilişki, D7 kesinlik, D8 itwiki. **Görsel:** yalnız metadata; İNCELENMEDİ (C049). **Erişilemeyen:** güncel Orsay sayfası (URL bulunamadı), Met Provenance/Catalogue sekmeleri (JS), JSTOR 873959 + tüm kitap metinleri (C050).

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12, `.qwen/tmp/venv-dogrula`): **Q3821820 için 0 hata / 0 uyarı.** CJK taraması: 6 dosyada 0. Üretim betiği `.qwen/tmp/parti5/uret-Q3821820.py` (gen.build; cs_gerekce_iyileştir + gz_taslak otomatik; D/E post-pass).
**Not:** dogrula.py genel sayımı (ör. 6 hata / 106 uyarı) eşzamanlı üretilen öteki eserlerin eksik dosya/kelime uyarılarını içerir; Q3821820'ye ait hata/uyarı yoktur. 12 bölüm eşlemesi tam; bolum_eslesme başlıkları gerçek dosya çapalarıyla uyumlu.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 406 | 400–500 | 3 dk |
| Orta | 1335 | 1300–1600 | 10 dk |
| İleri | 2794 | 2600–3200 | 20 dk |

Üç seviye de §8 aralığında; dolgu/tekrar yok (yakın-tekrar ve seviyeler-arası ortak cümle kontrolleri temiz). İleri düzey gerçekten daha derin: birincil içi çelişki yönetimi, tarih envanteri, provenans belge zinciri, üstüne boyama katmanları, kaynak eleştirisi (iki alıntının farklı muamelesi), kurumsal anlatı karşılaştırması.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (2 dosya PD; GAP 3950×4535 kanoni, infobox 4618×5300); **görsel İNCELENMEDİ (C049 E)** — vision kotası ana oturumda. Renk/biçim/perspektif hakkında doğrudan gözlem yazılmadı; tüm kompozisyon ifadeleri "kaynakların betimlediği" çerçevesinde ve A/B kaynaklı. **GZ TASLAK (5/5).** Müze fotoğrafı © RMN-Grand Palais (Musée d'Orsay) / Hervé Lewandowski; POP "utilisation soumise à autorisation" — tablo kamu malı, fotoğraf izne tabi; görsel projeye kopyalanmadı, URL+lisans+kaynak referans verildi. **İnsan editör görsel teyidi ZORUNLU** (özellikle imza/kab C036 ve yelpaze rengi C046).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C049, E):** incelenmedi; GZ TASLAK; kompozisyon betimlerinin görselle teyidi.
2. **D1 tarih (C038):** Orsay kendi içinde çelişiyor (yorum+POP 1871–1874 ↔ notice 1873–1876); tek yıl kurulamaz; data "1871" + ozet "1873–1876" kayıt içi çelişkisi — data düzeltme kararı.
3. **D2 boyut (C039):** 85×75 ↔ 85,5×75; kunye 85×75 (POP) esas alındı, fark not edildi.
4. **D3 Manzi (C040):** 1889 ↔ 1893.
5. **D4 mekân (C041):** rue Le Peletier (Orsay) ↔ Hôtel de Choiseul (enwiki); Met "imaginary" yalnız kendi sürümü.
6. **D5 Faure (C042):** enwiki yanlış atıf zinciri; data'ya Faure komisyonu EKLENMEMELİ.
7. **D6/D7 Perrot (C043/C044):** "ami" ↔ "unknown"; Orsay kesin ↔ frwiki "peut-être"; data hedge'i zayıf.
8. **D8 itwiki (C045/C037):** versiyon/tarih çapraz karışıklığı.
9. **Data E-notları:** kabın üstünde imza (C036), kırmızı yelpaze (C046), Japon baskısı/Toulouse-Lautrec (C047), "erken dönem" (C048) — doğrulanmadı; düzeltme onayı.
10. **Salle 32 (C010):** yalnız 2018 snapshot; güncel salon teyidi.
11. **Literatür (C050, E):** Pickvance JSTOR + kitap metinleri erişilmedi; B aktarımlarının birincil metinle teyidi.
12. **Felsefi yorumlar (İleri §8, C053):** zemin/emek, disiplin/gevşeme, bakış etiği, kurgusallık — açıkça yorum; editör onayı.
13. **RMN fotoğraf izni:** yeniden yayım kararı hak politikasıyla birlikte düşünülmeli.

## 7. Yayına adaylık

Otomatik kısım sağlandı: künye birincil doğrulanmış · olgusal cümleler kanıt kayıtlı · yorumlar olgulardan ayrılmış · quiz A/B kanıtlı · kaynak bağlantıları erişim durumlarıyla kayıtlı · çelişkiler açık. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler, olgusal doğruluğu garanti etmez; bu tur aynı asistan + agent araştırmasıyla yapıldı, haricî model/insan editör denetimi ayrıca gereklidir. Görsel incelenmediğinden ve refs metinlerine erişilemediğinden görsel teyit + literatür teyidi insan editör için kritiktir.
