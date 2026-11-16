# KALİTE KONTROL — Q63341 · Pezevenk Kadın (The Procuress / De koppelaarster) · Dirck van Baburen

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** `.qwen/tmp/parti3/Q63341-brief.md` (ham cache `.qwen/tmp/parti3/`).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 36 (C001–C036). **A=16, B=5, C=5, D=4, E=6.**
- **A düzeyi:** MFA Wayback birincil (S7: künye/konu/imza/provenance/notlar), NG (S10), Rijksmuseum (S11: biyografi/entry/teknik). Canlı MFA 403 → arşiv 2019-03-29, tarih beyan edildi.
- **B düzeyi:** en/fr/nl Vikipedi kaynaklı maddeleri (S3/S4/S5); Courtauld sahte tespiti (S3, BBC refs).
- **C düzeyi (yorum):** C032–C036; derslerde "(yorum)" etiketli, olgudan ayrık; sanatçı etkisi iddia edilmedi (§7).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B kanıtlı; 5 AU serbest (C/D/E dahil). Doğru cevaplar D/E'ye dayanmaz; yorum tek doğru cevap yapılmadı. Yanlış seçecek gerekçeleri gerçek gerekçe (totoloji yok).
- **D/E işareti:** 4 D "(tartışma)" (C019–C022); 6 E "(belirsiz)" (C015/C017/C018/C029/C030/C031); post-pass ile temiz, çift marker yok.
- **GZ TASLAK:** görsel incelenmedi → gen.py gz_taslak otomatik (5/5 ipucu TASLAK).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

S7 (MFA Wayback 2019-03-29; canlı S6 403), S10 (NG), S11 (Rijksmuseum) birincil katalogları 14 Kasım 2026'da yeniden açıldı; S3/S4/S5 wikitext + S12 Milkmaid negatif kontrol yeniden okundu:
- Künye (1622, oil on canvas, 101.6×107.6, 50.2721, Hopkins Fund $1960) ✓ S7.
- İkonografi (müşteri/sarıklı aracı/genç kadın; lavta=aşk, merkez; el hareketleri) ✓ S7; üç figür + Bordeeltjes ✓ S3.
- İmza "TBaburen f 16 [...]" lavta tabanı ✓ S7/S9.
- Provenance "possibly" zinciri + 1949 Christie's lot 52 Honthorst + 1950 $1960 ✓ S7.
- Vermeer arka planı **The Concert + Lady Seated at a Virginal** ✓ S7 not 2 / S10. **D1 doğrulandı.**
- Amsterdam "kopie naar… na 1623" + teknik notlar + Bikker entry ✓ S11. Courtauld Bakelite ✓ S3.
- **Negatif kontrol:** S12 Milkmaid wikitext Baburen/Procuress/Concert/Virginal = **0** → Milkmaid bağlantısı yok (C017).
- **Dört ihtilaf D:** Thins teşhisi (C019), atıf/versiyon (C020), tarih c.1622 (C021), Vermeer arka plan tarihleri (C022). Courtauld 2009↔2011 tarihsel ihtilaf BBC ile çözülmüş (C014 B).

**Erişilemeyen:** S6 canlı (403); kitap metinleri (Schneider/Montias/Cole&Pardo/Blankert/Franits/Broos) kaynakçada anıldı, erişilmedi; BBC/Telegraph/Independent linkleri çekilmedi; Boston için ayrı teknik rapor yok (C031).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12, venv-dogrula): **Q63341 için 0 hata; 0 uyarı.** CJK: **0**.
- bolum_eslesme 12 bölüm ✓; durum "İnsan incelemesi bekliyor" ✓; gorsel.dogrulama.incelenen_bolgeler=[] ✓.
- kavramlar 5, kazanimlar 5, karsilastirma 3, CS10/DY5/AU5/GZ5/TK5 ✓.
- İlk turda 14 heuristic "etiketsiz olgu" uyarısı çıktı; tümü cümle bölücünün kısaltma (M./y./cat./pp./p./F./Lt./W.) ve TV başlığı "?" bölmesinden kaynaklanan **yanlış pozitif**. Kısaltmalar Türkçe açılımla (yaklaşık/katalog/sayfa) ve özel ad baş harfleri korunarak cümle yeniden düzenlenerek giderildi; olgusal cümlelerin [C###] etiketleri zaten mevcuttu. Son tur 0 uyarı.
- Not: dogrula.py tüm eserler/ dizinini tarar; öteki eserlerin (Q1240092, Q2653851, Q512755 vb.) hata/uyarıları bu pakete ait değildir, dokunulmadı.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 413 | 400–500 | 3 dk |
| Orta | 1385 | 1300–1600 | 10 dk |
| İleri | 2611 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok. Alıntı öncesi fazla "(tartışma)/(belirsiz)" önek markerları temizlendi (post-pass alıntı sonrası markerları korur); belirsizlik işareti denetimi 0 uyarı. İleri düzey gerçekten daha derin (metodoloji, kanıt rejimleri, teşhis ihtilafı, müfredat düzeltmesi, felsefi yorum).

## 5. Görsel doğrulama (Kural 6)

Commons metadata (pageid 21997128; 5101×4826 px; PD-Art | PD-old-100-expired | deathyear=1624; Google Arts & Culture). **GÖRSEL İNCELENMEDİ** (vision kotası ana oturumda) → C030 E. Kompozisyon S7 (A) + S3/S10/S11 (B/A) **metninden** ("kaynakların betimlediği"). **GZ TASLAK.** Görsel projeye kopyalanmadı; URL + lisans + kaynak referansı. data/eser_ayrintilari hotspot ayrıntıları (tüylü şapka, sarık rengi, ışık yönü) doğrulanmadı. **İnsan editör görsel teyidi ZORUNLU.**

## 6. İnsan incelemesi gerektiren noktalar

1. **D1 (kritik) müfredat düzeltmesi:** MUFREDAT.md M7 "44↔52" bağı ve pilot karşılaştırma öncülü hatalı (Baburen tablosu Süt Boşaltan Kadın'da değil, The Concert + Lady Seated at a Virginal'de). Öneri: M7 bağı düzeltilsin; pilota bu bağlantı eklenmesin. **MUFREDAT.md/pilot/data değiştirilmedi** — onay bekliyor.
2. **Görsel (C030, E):** incelenmedi; GZ TASLAK; data hotspot ayrıntıları doğrulanmadı; insan editör görsel teyidi zorunlu.
3. **Dört ihtilaf (D):** Thins teşhisi (Blankert↔Franits), atıf/versiyon, tarih c.1622, Vermeer arka plan tarihleri.
4. **WD nesne maddesi (C015, E):** Q63341 "group of paintings"; P195/P217 Q20539079'da. Müfredat QID'si gözden geçirilmeli.
5. **MFA canlı 403 (C029, E):** Gallery 242 yalnız 2019 arşivi; güncel salon/künye teyidi gerekli.
6. **Kaynaksız data bağlantıları:** "Savurgan Oğul/meyhane geleneği" (C018 E) çıkarılmalı/etiketlenmeli; eser_notlari'na tablo adı eklenmeli; onbellek lisans alanı (gorsel.l="") doldurulmalı (C016).
7. **Literatür (C031, E):** kitap metinleri erişilmedi; birincil/ikincil zincir erişilen kayıtların aktardığıyla sınırlı.
8. **Felsefi/etik yorumlar (C032–C036):** kurum dışı yorum; editör onayı. Erotik/tür konusu akademik düzeyde, açık ayrıntısız betimlendi.

## 7. Yayına adaylık

Otomatik kısım sağlandı (0 hata/0 uyarı, şema, kelime, quiz A/B, 12 bölüm). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir.** Birincil MFA Wayback AÇILDI (A); canlı 403 (E); görsel İNCELENMEDİ (E); D1 müfredat düzeltmesi ve görsel teyit insan onayına sunulur.
