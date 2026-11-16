# KALİTE KONTROL — Q28797801 · Horas Kardeşlerin Yemini (The Oath of the Horatii) · Toledo replikası

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti4/Q28797801-brief.md`).
**KRİTİK KİMLİK:** Q28797801 = Toledo Museum of Art 1786 replikası (1950.308); Louvre orijinali AYRI öğe Q476458 (INV 3692 / MR 1432). data/ QID eşlemesi hatalı → veri notu olarak onaya sunuldu; data DEĞİŞTİRİLMEDİ.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q28797801 için temiz (0 hata / 0 uyarı)**.
- **Toplam iddia:** 57 (C001–C057). A=21, B=11, C=7, D=7, E=11. KANIT "Sayım:" satırı DERS.json ile birebir uyumlu.
- **A düzeyi (21):** Louvre birincil notice (S10/S11) + Toledo eMuseum Wayback (S9) + Provenance PDF (S15) + Commons imageinfo (S13/S14). Künye, sipariş, provenans, imza, boyut, sergileme tarihi, literatür listesi, görsel metadata, telif.
- **B düzeyi (11):** WD (S1/S3/S4), en/it Vikipedi (S6/S7) kaynaklı konu/yazınsal kaynaklar/jest/kariyer/galeri; Crow/Winkler zinciri (metne erişilmedi, kaynakçada anıldı).
- **C düzeyi (7):** kompozisyon/ışık/renk betimleri (C016/C020/C021), "O Roma o morte" (C017), sipariş alegorisi (C024, {{Citation needed}}), felsefi ödünç lensler (C055/C056) — tümü "(yorum)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B** kanıta dayanır (dogrula kanit_seviye_kontrol temiz); 5 AU serbest (C/D/E dahil). Yanlış seçene gerekçeleri bağlamsal (totoloji yok). Doğru cevaplar D/E'ye dayanmaz; kimlik ihtilafı (D1) quiz doğru cevabı YAPILMADI — CS01/CS10 doğru cevapları A düzeyi kayıt/metadata olgusudur.
- **D/E işareti:** 7 D "(tartışma)", 11 E "(belirsiz)" — post-pass + manuel; dogrula BELIRSIZLIK kontrolü temiz.
- **GZ TASLAK:** görsel incelenemedi (incelenen_bolgeler=[]) → gen.py gz_taslak otomatik uyguladı.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda birincil kaynaklar **yeniden açıldı** (yalnızca taslak okunmadı):
- **S10/S11 Louvre collections notice cl010062239 (HTML+JSON, 200):** başlık "Le serment des Horaces, entre les mains de leur père", INV 3692/MR 1432, 3,3×4,25 m, imza "L. David faciebat/ ROMAE anno/ MDCCLXXXIV", Salle 702 Denon, Etat, Collection de Louis XVI, historique (sipariş 1781/82, "probablement … juillet 1785", Salon 1785 no.103, "répétition (Toledo)", 1826 Louvre nakil, 1948 Zezzos) ✓. Bibliyografya Crow 1978/1985, Wind 1941, Rosenblum 1970, Stewart 2001 anıldı (metne erişilmedi).
- **S9 Toledo eMuseum Wayback 2025-09-01 (200; canlı S8 403 Cloudflare):** Artist "Jacques-Louis David", 1786, oil on canvas, 130.2×166.7 cm, Frame 165.1×201.3×10.8, 1950.308, Not on View, Libbey Endowment; Label Text (Vaudreuil siparişi, distaff, "Girodet … reportedly assisted", "restrained emotion, order, … sacrifice … state"); Published References + Exhibition History + Comparative References ✓.
- **S15 Toledo Provenance PDF Wayback 2012-12-24 (200; s.13, 1950.308):** Artist "DAVID, JACQUES-LOUIS", 1786, 130.2×166.2 cm, imza "J.L. David faciebat,/Parisiis, anno MDC-CLXXXVI", Vaudreuil→Lebrun 1787 lot 107→Didot→Firmin-Didot→1880 Hyacinthe→1913 Delamarre→d'Huart→1936 Paul Roux→1937 Wildenstein→1950 Toledo; distaff "originality" notu ✓.
- **S1/S3 WD + S5 pageprops + S6/S7 wikitext + S13/S14 imageinfo** yeniden okundu: Q28797801 P195 Toledo/P217 1950.308/P170 Girodet+P1877 David; Q476458 Louvre uyumu; GAP dosyası ObjectName "Copy … made by Girodet" (Toledo), INV 3692 dosyası Louvre orijinali ✓.

**Yedi ihtilaf (D) açıkça beyan:** D1 kimlik (C037), D2 atıf (C038), D3 tarih (C039), D4 boyut (C040), D5 görsel kimliği (C041), D6 metadata (C042), D7 ikonografi (C043). **Erişilemeyen:** S8 canlı eMuseum (403), S12 eski Louvre notice (ölü yönlendirme), S17 IIIF (arşiv yok); kitap/makale metinleri (C049). Birincil arşiv/kayıt (S9/S10/S11/S15) ile aşıldı.

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12, venv-dogrula): **Q28797801 için 0 hata; 0 uyarı.** DERS.json + SORULAR.json şema geçerli; ek alan yok; bolum_eslesme 12 bölüm; durum enum geçerli; kelime sayıları json↔ölçüm tutarlı. **CJK: 0** (tüm ders/KANIT/JSON/uret dosyaları tarandı).
- **Not:** Global dogrula çıktısındaki 10 hata başka eserlerin (Q1978815, Q29530, Q4388208, Q956541) eksik DERS/SORULAR/KANIT dosyalarıdır; bu esere ait değildir, dokunulmadı (agent kapsamı: yalnız Q28797801).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 427 | 400–500 | 3 dk | ✅ aralıkta |
| Orta | 1327 | 1300–1600 | 10 dk | ✅ aralıkta |
| İleri | 3100 | 2600–3200 | 20 dk | ✅ aralıkta |

**Not:** Kelime hedefleri §8 gereği tahmindir; bu eserde birincil kaynaklar erişildiği ve içerik zengin olduğu için hedef aralıklar dolduruldu, dolgu/tekrar yapılmadı (yakın tekrar + seviyeler arası tekrar kontrolleri temiz). İleri düzey gerçekten daha derin sorular sorar (kimlik/atıf metodolojisi, provenance zinciri, felsefi ödünç lensler, akademik tartışma envanteri).

## 5. Görsel doğrulama (Kural 6)

- **S13 GAP dosyası (Q28797801 P18):** 6156×4800, PD (PD-old-100-expired/PD-Art); ObjectName "Copy of the Oath of the Horatii - made by Girodet" → **Toledo replikasının taraması** (dosya adı yanıltıcı, D5).
- **S14 INV 3692 dosyası (Q476458 P18):** 10051×7794, PD-Art, "photo Shonagon 2025-03-15" → Louvre orijinalinin fotoğrafı.
- **S11 Louvre site görselleri:** TELİFLİ (© GrandPalaisRmn / Michel Urtado, Angèle Dequier, Blot/Jean) → PD değil; Commons PD tercih edilmeli.
- **S9 Toledo eMuseum görseli:** lisans sayfada yok (E11/C051); IIIF (S17) erişilemedi.
- **Vision kotası ana oturumda → görseller İNCELENMEDİ (C052 E).** Kompozisyon S6/S7/S9 METNİNDEN ("kaynakların betimlediği"). **GZ TASLAK.** Görsel projeye kopyalanmadı; URL+lisans+kaynak referans. **İnsan editör görsel teyidi ZORUNLU** (özellikle D5 görsel kimliği, kirmen detayı, imza okuması).

## 6. İnsan incelemesi gerektiren noktalar

1. **KİMLİK (D1/C037, kritik):** Q28797801 = Toledo replikası ↔ data "Louvre orijinali" kullanımı. Doğru orijinal QID Q476458. data eşleme düzeltmesi (QID taşıma veya yeniden yazma) ana oturum kararına sunuldu; data DEĞİŞTİRİLMEDİ.
2. **ATIF (D2/C038):** David (Toledo) ↔ Girodet (WD tek yaratıcı) ↔ "reportedly assisted" ↔ literatür ikiye bölünmüş (1965 Burlington mektuplaşması). Çözüm önerisi yok; müze kaydı birincil, WD tartışmalı.
3. **TARİH (D3/C039):** imza/resmî 1784 ↔ Louvre "probablement … juillet 1785". data "1784'te tamamlandı" ifadesi çelişkili.
4. **BOYUT (D4/C040):** Toledo 166,7 (eMuseum) ↔ 166,2 (2012 PDF); Louvre 3,3×4,25 m ↔ enwiki 329,8×424,8 cm.
5. **GÖRSEL (D5/C041 + C052):** GAP dosyası Toledo replikası, data Louvre girişi için kullanıyor; görseller incelenemedi → GZ TASLAK; insan editör görsel teyidi zorunlu. INV 3692 dosyası orijinal için önerilir.
6. **METADATA (D6/C042) + İKONOGRAFİ (D7/C043):** Louvre HTML↔JSON güncelleme farkı; kadınların yaslı durumu kaynaklar arası yorum farkı.
7. **LİSANS (C036/C051):** Louvre site görselleri telifli; Toledo eMuseum görsel lisansı doğrulanamadı. Commons PD dosyaları tercih edilmeli.
8. **ERİŞİLEMEYEN KAYNAKLAR (C049/C053):** kitap/makale metinleri (Crow, Winkler, Johnson, Wind, Stewart, Rosenblum vb.) yalnızca kaynakçada anıldı; S8/S12/S17 erişilemedi.
9. **Felsefi yorumlar (İleri §7, C055/C056):** Kant/Benjamin ödünç lens; David'in etkilendiği iddiası YOK; editör onayı.
10. **PDF ham çıkarım (C047):** imza "MDC-CLXXXVI" bölünmüş, 1936 lot no eksik; PDF görsel teyidi insan editöre.

## 7. Yayına adaylık

Otomatik kısım sağlandı: temel kimlik/atıf birincil kaynaklarla doğrulandı (ayrıca ihtilaflar beyan edildi), tüm olgusal cümleler kanıt kayıtlı, yorumlar olgulardan ayrıldı (C), quiz cevapları A/B iddialara dayanıyor, kaynak bağlantıları erişim durumlarıyla kayıtlı, ciddi çelişkiler (7 D) açıkça belirtildi, Denetim A + B tamamlandı.

**BUNA RAĞMEN durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil Louvre (S10/S11) + Toledo Wayback (S9) + Provenance PDF (S15) AÇILDI (A); görsel İNCELENMEDİ (E); kimlik/atıf/tarih/boyut/görsel ihtilafları (D1–D5) insan editör kararına bağlıdır.** data/ QID eşleme hatası ve görsel yanlış-eser bağlantısı düzeltilmeden bu dersin "Louvre başyapıtı" olarak sunulması yanıltıcı olur; ders künyesi Toledo replikasını açıkça beyan eder.
