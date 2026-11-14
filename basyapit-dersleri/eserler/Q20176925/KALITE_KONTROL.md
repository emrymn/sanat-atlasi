# KALİTE KONTROL — Q20176925 · Lavta Çalan (The Lute Player / Suonatrice di liuto) · Orazio Gentileschi

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ (arşiv yeniden açıldı) · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti3/Q20176925-brief.md`); ham cache `.qwen/tmp/parti3/Q20176925-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Üç dersin olgusal cümleleri `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 42 (C001–C042). **A=22, B=3, C=3, D=7, E=7.** KANIT "Sayım:" satırı DERS.json ile birebir uyumlu.
- **A düzeyi:** NGA Wayback 2017-03-09 (S6) + 2025-01-09 (S8) tam kayıtları (künye, provenance, atıf tarihi, Overview, Image Description, Technical Summary, Exhibition History, Bibliography) + Met MetPublications Wayback 2016-01-16 (S12, yayıncı kaydı: C040/C041).
- **B düzeyi:** C017/C018/C019 — en/it wiki'nin Christiansen & Mann 2002 (p. VII/113/114) atıf zinciri; kitap metnine erişilmedi ("out of print"), zincir notuyla kullanıldı.
- **C düzeyi (yorum):** C028 (WD P180 refsiz), C029 (proje TR adı), C042 (estetik okuma) — derslerde "(yorum)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK kanıtları YALNIZ A/B (otomatik kontrol: A/B dışı kanıt YOK). 5 AU serbest (C/D/E dahil). Çeldirici gerekçeleri bağlamsal (totoloji yok; dogrula totoloji_kontrol temiz).
- **D/E işareti:** 7 D "(tartışma)", 7 E "(belirsiz)" — post-pass + doğal dil; cümle düzeyi belirsizlik işareti taraması: eksik YOK.
- **GZ TASLAK:** görsel incelenmedi → gen.py gz_taslak otomatik (5/5 ipucu TASLAK önekli).
- **İhtiyat koruma:** circa / may / presumably / possibly / most likely / suggesting / probably / tentatively aynen taşındı; quiz doğru cevapları ihtiyatlı iddiaların kesinleştirilmesine dayanmaz (CS07/DY02 akort olasılığını test eder, burgu çevirmeyi değil).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Yazım turunda (14 Kasım 2026) ham cache'ler yeniden okundu ve iki NGA arşiv kopyası **canlı olarak yeniden açıldı (HTTP 200)**:
- S6 `web.archive.org/web/20170309103749/…46434.html` → 200; S8 `web.archive.org/web/20250109082451/…46434.html` → 200. Künye ("c. 1612/1620", "oil on canvas", "143.5 x 129 cm", "1962.8.1", "Ailsa Mellon Bruce Fund"), provenance (Cavazza → 3 June 1697 Franceschini → Johann Adam Andreas → Franz Josef II → 1962 Feilchenfeldt → NGA), atıf ("always as Caravaggio"; Marangoni 1922; Voss 1923 "tentatively Artemisia"), Technical Summary ve Exhibition History iddialarla karşılaştırıldı ✓.
- S3/S4 wikitext cache: enwiki infobox 1612–1626 ↔ giriş 1612–1615 iç tutarsızlığı, itwiki 100×74 hatası, "diciannove corde", refsiz alegori/optik illüzyon/burgu iddiaları doğrulandı ✓.
- S1 WD cache: P571 precision=7 + P1319/P1326 + P1480=circa; P217=1962.8.1; P180 refsiz; P6216 PD ✓. S9 Commons: 3385×4000, PD-Art, Credit→NGA güncel URL ✓. S12 Met 2016: "(2001)", "out of print", ForeWord ödülü, Roma–NY–StLouis, dönemlendirme başlıkları ✓.
- S15 data/ salt-okunur tarama: eser_notlari "Genç bir erkek" (D004), basyapitlar "burgularını çeviriyor" (D003), eserler_onbellek "CC0" (E012), gorsel_oranlari 0.87 (E013) doğrulandı ✓.
- **Erişilemeyenler (E, C039):** NGA canlı S5/S7 (403 Cloudflare); Met canlı S10 (429); Met 2024 arşivi S11 (Incapsula); sistematik katalog PDF S14 (~82 MB, indirilmedi); C&M kitap metni; Getty/NGL/ArtIC ref'leri.

**Not:** Bu tur aynı asistan + agent araştırmasıyla yapıldı; yapısal testler olgusal doğruluğu garanti etmez. Haricî model/insan editör denetimi ayrıca gereklidir (bekliyor).

## 3. Şema ve biçim

`dogrula.py` (`.qwen/tmp/venv-dogrula`, mini + jsonschema Draft 2020-12 AKTİF): **Q20176925 için 0 hata / 0 uyarı.**
- İlk turda 5 heuristic "etiketsiz olgusal cümle adayı" UYARISI çıktı (cümle bölücü kısaltmaları: "s.", "p.", "K.", "100."). Yanlış pozitifler doğal yeniden yazımla giderildi (sayfa 96–101; sayfa 113; Schönbauer; yüzyıl sergisi) — içerik kaybı yok.
- Genel dogrula çıktısındaki öteki eser hata/uyarıları (Q185255, Q3769169, Q3998957, …) paralel partilerin devam eden işleridir; bu parti onlara DOKUNMADI.
- **CJK taraması: 0** (7 dosyanın tümü). Üretim sırasında İleri §5'e bir Çince sözcük sızıntısı yakalanıp "sürecinde" olarak düzeltildi.
- Şema: DERS + SORULAR Draft 2020-12 geçerli; 12 bölüm eşlemesi tam; durum "İnsan incelemesi bekliyor"; `gorsel.dogrulama.incelenen_bolgeler=[]`.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 414 | 400–500 | 3 dk |
| Orta | 1316 | 1300–1600 | 10 dk |
| İleri | 2660 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/yakın tekrar yok (dogrula yakın tekrar + seviyeler arası tekrar kontrolleri temiz). İleri düzey gerçekten daha derin: arşiv metodolojisi, provenance belge eleştirisi, atıf dosyası, teknik ihtiyat analizi, kanon tartışması.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (S9): 3385×4000 px, PD-Art (PD-old-100), UsageTerms "Public domain", AttributionRequired=false. **Görsel İNCELENMEDİ (C038 E)** — vision kotası ana oturumda. Kompozisyon "kaynakların betimlediği" formülüyle NGA 2025 Image Description + Overview metninden; **GZ TASLAK**. Görsel projeye kopyalanmadı; URL + lisans + kaynak referans. Oran farkı (yerel 0.87 ↔ Commons 0.846 ↔ tablo 0.899) ve C011/C015/C037 ayrıntıları görsel teyit bekler. **İnsan editör görsel teyidi ZORUNLU.**

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C038, E):** incelenmedi; GZ TASLAK; oran farkı (E013); ana oturumda vision incelemesi + insan editör teyidi.
2. **data cinsiyet hatası (D004, C033):** eser_notlari "Genç bir ERKEK" ↔ NGA "young woman" + dişi "Suonatrice"; düzeltme önerisi KANIT §5'te (data değiştirilmedi).
3. **data burgu/akort hatası (D003, C032):** "burgularını çeviriyor / çalmıyor, akort ediyor" (kesin) ↔ NGA "fingers pressing the strings" + "may be tuning"; basyapitlar + yuruyus + eser_ayrintilari düzeltme önerisi.
4. **Tarih ihtilafı (D001, C030):** enwiki iç tutarsız (1612–1626 / 1612–1615); NGA "c. 1612/1620" esas; prompt "1610" başlangıcı desteksiz; data tek yıl "1612".
5. **itwiki boyut hatası (D002, C031):** 100×74 ↔ 143,5×129.
6. **Sergilenme durumu (D005, C034):** canlı NGA 403; güncel Gallery 29 teyidi insan editöre (2025 arşivi beyan edildi).
7. **Refsiz ikonografi (C023–C026, E):** alegori/Harmonia, optik illüzyon, burgulara erişememe, 19 tel — kesin anlatıma/quiz'e girmedi; literatür + görsel analizle seviye yükseltilebilir.
8. **data doğrulanmamış ayrıntılar (C037, E):** nota okunaklılığı, "cilalı tahta", ışık yönü kesinleştirilmesi (E008/E015).
9. **Lisans etiketi (E012, C039):** data "CC0" ↔ NGA "public domain" + Open Access; eşdeğerlik varsayımı doğrulanmadı.
10. **Erişilemeyen literatür (C039, E):** sistematik katalog PDF (s. 96–101 madde metni), C&M kitap metni, Miller 1991, Wheelock 2021 — ana oturum isterse Wayback URL'leri hazır.
11. **Okul etiketi vs doğum yeri (E014):** NGA "Florentine" ↔ data "Pisa"; ders doğum yeri iddiası kurmadı; editör kararı.
12. **Aynı adlı eser karışıklığı:** Met "The Lute Player" = Valentin de Boulogne (Q19911949, Met 439933); bu eser NGA Q20176925.
13. **C&M yıl nüansı (D007, C036):** Met kaydı 2001 ↔ wiki atıf 2002; iki form beyan edildi.
14. **Estetik yorumlar (C042, İleri §7):** açıkça yorum; kurum dışı; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı: künye/atıf birincil arşivle doğrulanmış · olgusal cümleler kanıt kayıtlı · yorumlar olgulardan ayrılmış · quiz cevapları A/B iddialara dayanıyor · kaynak bağlantıları erişim durumlarıyla kayıtlı · ciddi çelişkiler açıkça belirtilmiş · Denetim A + B (arşiv yeniden açma) tamamlanmış. **ANCAK görsel analiz doğru eser/görselle YAPILMADI (C038) ve haricî insan/model denetimi BEKLİYOR.**

**Durum: "İnsan incelemesi bekliyor" — "Yayına aday" DEĞİL.** Birincil NGA arşivden AÇILDI (A); görsel İNCELENMEDİ (E); data hataları (cinsiyet, burgu) düzeltme önerisi olarak raporlandı (data'ya dokunulmadı). commit/push/deploy yapılmadı.
