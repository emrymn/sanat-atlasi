# KALİTE KONTROL — Q18579333 · Paris'in Hükmü · Marcantonio Raimondi (Raffaello'dan sonra)

**Tarih:** 14 Kasım 2026 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Durum:** İnsan incelemesi bekliyor · **Yayına adaylık:** BEKLİYOR (insan editoryal onayı olmadan yayımlanmaz)

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

- Üç ders dosyasındaki bütün olgusal cümleler `[C###]` etiketleriyle KANIT_DOSYASI.md §2 envanterine bağlandı; etiketsiz olgusal cümle kalmadı (dogrula.py heuristic tespitçisi: 0 uyarı).
- 55 iddia: **A=32** (yedi birincil kurum kaydından), **B=0** (dewiki satır içi atıfsız → B atanamadı; bütün olgusal anlatım birincil kaynaklı), **C=3** (C033 Commons kategori B.246; C034 MAF/Francia hipotezi; C035 dewiki atıfsız ayrıntılar — hepsi ders metninde "(yorum)" işaretli), **D=12** (C036–C047; hepsi "(tartışma)" işaretli), **E=8** (C048–C055; hepsi "(belirsiz)" işaretli).
- D/E post-pass uygulandı: işaretsiz D/E etiketi kalmadı (betikle tarandı: 0).
- Quiz kanıtları yalnız A/B: CS 10, DY 5, GZ 5, TK 5 — tamamı A seviyeli iddialara dayanır (B=0 olduğundan B kullanılmadı); AU 5 serbest kanıtlı. D/E iddialardan kesin cevaplı soru üretilmedi. CS04 ("Acquaforte e bulino" diyen kurum) ihtilafı çözmez, yalnız Uffizi kaydının ne dediğini sorar (C005 A).
- Çeldirici gerekçeleri gerçek gerekçeli (totoloji yok): yanlış şıklar ya başka nüshaların doğrulanmış envanter/ölçüleri (CS03, CS09), ya başka raisonné numaraları (CS02), ya başka sanatçıların doğrulanmış rolleri (CS01, CS06) ya da tarihleme pozisyonları (CS07) ile gerekçelendirildi.
- Yorumlar olgulardan ayrıldı: İleri §7 felsefi bölümün tamamı C düzeyi "(yorum)" etiketli; Benjamin/Kant/Panofsky çerçeveleri analitik araç olarak sunuldu, hiçbir tarihsel etki iddiası yok (§7).
- Kelime hedefleri (§8): Başlangıç 417 (400–500 ✓), Orta 1417 (1300–1600 ✓), İleri 2616 (2600–3200 ✓). Dolgu/tekrar yok: yakın tekrar ve seviyeler arası birebir cümle tekrar kontrolleri temiz.

## 2. Denetim B — Kaynağa geri dönüş (cache tabanlı bağımsız tur)

**Yöntem:** İlk metinden bağımsız olarak, aynı gün (2026-11-14) indirilmiş ham cache'ler yeniden açıldı ve metin çıkarımı yapıldı: Met wayback ham HTML (tombstone, overview, provenance/RSC payload, DP-18212-001 bağlantısı), NGA web_fetch transkripsiyonu, Boijmans 62913 + 22638 ham HTML, Uffizi ham HTML (tam metin), Kunsthalle wayback ham HTML (betim + fn1–9 + LIT + provenance), Gallica wayback DC meta, SMB Berlin 93765 (tam betim), dewiki wikitext (tam), Commons imageinfo ×3 + kategori wikitext, Wikidata EntityData (P31/P571/P170/P186/P195/P18/P2048/P2049/P6216/P1343).

**Doğrulanan ana alanlar:** yedi nüshanın envanter/tarih/teknik/boyut değerleri; Bartsch XIV.197.245 (4 kurum); Met provenance (Spencer/Colnaghi/Lugt 1532) ve "first state of two"; Vasari "amazed all of Rome" / "stupì tutta Roma"; tarihleme zinciri (Vasari→Delaborde→Shoemaker→Mason/Oberhuber); Kunsthalle fn6 teknik argümanı + "um 1515 scheint daher denkbar"; fn9 Dente Nachstich (aşınma, pürüzlendirme yok); Manet 1863 + Degas/Picasso; Villa Medici/Doria Pamphilj antik modeller; motto + RAPH VRBI INVEN + MAF/MAP varyantları; Uffizi grisaille (Leo X, Parnassus altı) ve granitura tekniği; Berlin Mittelachse betimi ve "warmtonigen, malerischen Effekten"; Boijmans 22638 = Ghisi 1555 (Bertani/Cock, BdH 3708 PK); Stuttgart dört sayfanın farklı eserler olduğu (L 1255 / A 2014/7944 / C 2017/5756,208 / A 19875); Commons lisansları (Met/NGA CC0; diğerleri PD; Kunsthalle fotoğrafı CC-BY-NC-SA 4.0).

**Denetim B'de yakalanan ve düzeltilen 2 nokta:**
1. Brief C013 "1520'lerde Marco Dente Nachstich" diyordu; Kunsthalle ana metni "Bereits im 16. Jahrhundert" der, "1520er Jahre" yalnız atıfsız dewiki'dedir → C013 tarihsiz A olarak bırakıldı, "1520'ler" C035'e (C, yorum) taşındı.
2. Brief D9'daki NGA "The third woman stands with her back to us" alıntısı cache'lerde yeniden doğrulanamadı (NGA ham HTML yok; transkripsiyon yalnız yazıt bölümünü içeriyor) → C044'ten çıkarıldı; D9 çekirdeği (data ↔ Kunsthalle/dewiki) korundu.

**Sınır (dürüstlük beyanı):** Bu tur cache tabanlıdır; canlı yeniden erişim Met 429, NGA 403, Kunsthalle Anubis, Gallica 403 nedeniyle sınırlı kaldı. Tam bağımsız canlı teyit ve haricî model/insan editör denetimi **bekliyor**. Yapısal testler olgusal doğruluğu kanıtlamaz; A/B iddialarının semantik kaynak desteği insan denetimine sunulur.

## 3. Şema ve yapı doğrulaması

- `dogrula.py` (izole venv, jsonschema Draft2020-12 AKTİF): **Q18579333 için 0 hata / 0 uyarı.**
- DERS.json + SORULAR.json şema doğrulaması: temiz (mini yorumlayıcı + standart jsonschema).
- Çapraz tutarlılık: 55 iddia KANIT ↔ DERS.json birebir; kaynak kimlikleri (26) tutarlı; mükerrer kimlik yok; quiz kanıt A/B kuralı temiz; bolum_eslesme 12 bölüm; durum "İnsan incelemesi bekliyor"; KANIT Sayım satırı (55 · A=32 · B=0 · C=3 · D=12 · E=8) DERS.json ile tutarlı.
- CJK taraması (6 dosya, md+json): **0**.
- Not: Tam koşuda başka eser dizinlerinden (Q18572249, Q1863885, Q23008305, Q2472983, Q3705703) gelen 11 "eksik dosya" hatası bu eserin kapsamında DEĞİLDİR; o dizinlere dokunulmadı (başka parti/agent işleri).

## 4. Kelime/süre tablosu

| Seviye | Hedef süre | Hedef kelime | Ölçülen | Sonuç |
|---|---|---|---|---|
| Başlangıç | 3 dk | 400–500 | 417 | ✓ |
| Orta | 10 dk | 1300–1600 | 1417 | ✓ |
| İleri | 20 dk | 2600–3200 | 2616 | ✓ |

## 5. Görsel sınırı

- **Hiçbir görsel incelenmedi** (vision kotası ana oturumda); `gorsel.dogrulama.incelenen_bolgeler=[]`; 6 Commons dosyası yalnız metadata/lisans/çözünürlük (C050 E).
- Kompozisyon betimleri "kaynakların betimlediği" çerçevesiyle birincil kurum metinlerinden (Met başlığı C032, Kunsthalle C020, Berlin C021); **GZ soruları TASLAK** işaretli (gen.gz_taslak otomatik).
- Birincil görsel: Met DP-18212-001.jpg (CC0, 3758×2545) — URL + lisans + kaynak referans olarak verildi; görsel projeye kopyalanmadı. Kunsthalle fotoğrafı CC-BY-NC-SA 4.0 (bpk/Irrgang) — yeniden yayımlanmadı.
- Nüsha/baskı durumu/kırpma farkları ve ton karşılaştırması görsel inceleme gerektirir; insan editör teyidi zorunlu.

## 6. İnsan-inceleme noktaları (öncelik sırasıyla)

1. **Müze alanı (D8/C043, C048):** data "Staatsgalerie Stuttgart" ↔ gösterilen görsel Met 19.74.1; Stuttgart birincil kaydı bulunamadı (A 85.1 yalnız Commons credit + referanssız WD). Müze alanı nüsha bağlamıyla yeniden değerlendirilmeli; data DEĞİŞTİRİLMEDİ.
2. **Görsel inceleme (C050):** vision kotası ana oturumda kullanılıp GZ TASLAK'ları teyit edilmeli; nüshalar arası ton/kesim farkları karşılaştırılmalı.
3. **Canlı kaynak teyidi (C054, C055):** Met canlı 429, NGA 403, Kunsthalle Anubis, Gallica 403 — arşiv/transkripsiyon yerine canlı kayıt teyidi; Met "Gallery 899 / On view" güncelliği.
4. **Tarih (D1/C036):** data tek yıl "1510" savunulamaz; etikette aralık + ihtilaf notu korunmalı.
5. **Teknik (D4/C039):** Uffizi "Acquaforte e bulino" ↔ diğerleri saf gravür; uzman değerlendirmesi.
6. **Yazıt varyantları (D5–D7/C040–C042):** MAF/MAP, PRAE/PAE/PRARE, konum — yüksek çözünürlüklü görselle okuma teyidi.
7. **data uyuşmazlıkları (C044, C045, C052):** sırtı dönük figür "tartışmalı" notu, sol alt levha atfı, "Frigya başlıklı Paris" — veri notu olarak onaya sunulur.
8. **Erişilemeyen literatür (C051):** Delaborde 1887, Shoemaker/Broun 1981, Raphael Invenit 1985, Massari 1989, Changing Impressions 1999-2000, Landau/Parshall 1994, Gramaccini/Meier 2009, Kopp 2017 vb. — yalnız kaynakçada anıldı; metin teyidi gerekirse insan editör.
9. **Stuttgart/MFA nüsha iddiaları (C048, C049):** birincil kayıt bulunamadı/403; kesin anlatıma alınmadı.
10. **Lisans alanları (veri notu 3):** data'daki boş lisans alanları S4/S5 metadata ile doldurulabilir (ana oturum kararı).

## 7. Yayına-adaylık değerlendirmesi (§12)

| Ölçüt | Durum |
|---|---|
| Temel kimlik ve atıf doğrulanmış | ✓ (yedi birincil kayıt; Bartsch 245) |
| Tüm olgusal cümleler kanıt kayıtlı | ✓ (Denetim A) |
| Görsel analiz doğru eser/görselle yapılmış | ✗ — görsel İNCELENEMEDİ; betimler kaynak metinli, GZ TASLAK |
| Yorumlar olgulardan ayrılmış | ✓ (C işaretli; §7 açıkça yorum) |
| Quiz cevapları doğrulanmış iddialara dayanıyor | ✓ (yalnız A) |
| Kaynak bağlantıları erişim durumlarıyla kayıtlı | ✓ (26 kaynak; arşiv/403/429 beyanlı) |
| Ciddi çelişkiler açıkça belirtilmiş | ✓ (12 D + 8 E) |
| Denetim A + B tamamlanmış | A ✓; B cache tabanlı ✓ (canlı teyit sınırlı — insan editör) |

**SONUÇ: Yayına aday DEĞİL — "İnsan incelemesi bekliyor".** Görsel inceleme ve canlı kaynak teyidi tamamlanıp insan editoryal onayı verilmeden yayımlanmaz. data/, uygulama kodu, main, Vermeer pilotu ve öteki eserlere dokunulmadı; commit/push/deploy yapılmadı.
