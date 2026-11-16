# KALİTE KONTROL — Q3476580 · Berlin Sokak Sahnesi (Berliner Straßenszene) · Ernst Ludwig Kirchner

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti5/Q3476580-brief.md`); ham cache `.qwen/tmp/parti5/Q3476580-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q3476580 için temiz.
- **Toplam iddia:** 76 (C001–C076). **A=22, B=32, C=3, D=12, E=7.**
- **A düzeyi:** Neue Galerie sergi sayfası (S6 canlı + S7 Wayback), Christie's Lot 37 (S10 Wayback), MoMA sergi sayfası (S12 Wayback), Commons lisans (S19/S20). Künye/konu/modeller/çift taraflı/imza/boyut(Christie's)/iade/satış/sergi/kamu malı.
- **B düzeyi:** dizi, bağlam, Fütürizm/Kübizm, Gordon/Roters yorumları, provenance halkaları, Welt/FR/Spiegel basın, Gutachten.
- **C düzeyi (yorum):** C074 yabancılaşma, C075 maske/meta, C076 aura/mülkiyet — açıkça "(yorum)" işaretli; felsefi çerçeve ödünç, etki iddiası yok.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU serbest (C/D/E dahil). CS/DY/GZ/TK kanıtı A/B dışına çıkmaz (dogrula kanit_seviye_kontrol temiz).
- **D/E işareti:** 12 D "(tartışma)", 7 E "(belirsiz)"; post-pass + elle işaretleme; belirsizlik işareti olmayan D/E cümlesi yok.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak otomatik "TASLAK" öneki.
- **Totoloji:** CS çeldirici gerekçeleri bağlamsal (her yanlış şıkkın neden yanlış olduğu yazılı); totolojik "X değil." yok.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Brief'ten bağımsız olarak birincil ve anahtar ikincil cache'ler 14 Kasım 2026'da yeniden açıldı ve iddialarla karşılaştırıldı:
- **S6 NG canlı (200):** "Berlin Street Scene (1913-14)", "Oil on canvas", "Neue Galerie New York and Private Collection", "a landmark of Expressionism", "founding member of… Die Brücke… Dresden in 1905. In 1911… moved to Berlin", "sisters Erna and Gerda Schilling… recognizably modeled after the sisters", "prostitutes parading down a busy avenue", sergi "July 26 through September 17, 2007", "Standing Girl, Caryatid (1909-10)" + Dix/Grosz/Schad ✓ (C001–C008, C015, C016, C051).
- **S10 Christie's Wayback 2026-02-22 (200):** "eleven paintings" Strassenbilder; "Painted in 1913-1914"; "Berliner Strassenszene (recto); Bäume (verso)"; imza ×3; "47 7/8 x 35 7/8 in. (121.6 x 91.1 cm.)"; provenance (Hess→Hans Hess circa 1933-1937→"Sold under duress"→Kölner Kunstverein→Hagemann 1937→Holzinger after 1945→Elisabeth Holzinger→Brücke Museum 1980→"Restituted… July 2006"); Pechstein Mayıs 1912 / dağılma Ocak 1913; sonbahar 1911; "number 15 tram"; "cut-off male figures… snapshot"; "no interaction… isolated and alone"; "Traditionally… second work… exactly when… unknown"; kokot kuşkusu "one can't be certain"; Gordon Cambridge 1968 p.318 no.363 ✓ (C005, C011–C013, C017, C018, C023, C025, C026, C034, C036, C039, C053, C071, C074).
- **S12 MoMA Wayback 2025-09-15 (200):** "Kirchner and the Berlin Street", "Aug 3–Nov 10, 2008"; "series of seven paintings… sixty related prints and drawings"; "created between 1913 and 1915"; "co-founder… Brücke… Dresden in 1905… moved to Berlin in 1911"; "elaborate plumed hats"; "imminent danger… eve of World War I"; Deborah Wye; katalog 138 s.; MoMA "Street, Berlin (Straße, Berlin). 1913… (120.6 × 91.1 cm)… Purchase." ✓ (C006, C016, C048, C049).
- **S13 Schnabel/Tatzkow Wayback 2014-01-09 (200):** Anita Halpin "daughter and sole heir of Hans Hess, granddaughter of Alfred Hess"; 25 Mayıs 2007 sunuldu; RM 3.000 belgesiz; piyasa 6.000–15.000 RM; "Potsdamer Platz" sigorta 15.000 RM; "end of 1936/early 1937"; Joint Declaration Aralık 1999 + Handreichung (Şubat 2001); Washington 1998 (44 ülke, 11 ilke); Hans Hess Paris Haziran 1933; Thekla kontrol düzenlemeleri; Alfred Hess ö.24.12.1931; ~4.000 eser/Ullstein/fabrikalar 1937 aryanize ✓ (C030, C037, C045, C046, C070).
- **S14 Welt (200) + S18 FR (200):** sosyal eleştiri değil/yeni kadın tipi; günlük "11-14"; Otto Mueller "möglich" selbst; Fütürizm/Kübizm; FR "knapp 25 Millionen Euro", Ronald Lauder, Förderkreis "Skandal", "Ächtung… 1938 mit 58 Jahren das Leben", ödünç Museum Ludwig/Nationalgalerie/Staatsgalerie/Kunstsammlung NRW/Von der Heydt ✓ (C009, C019, C021, C028, C042, C043, C047, C054).

**12 ihtilaf D (C056–C067)** kaynaklar arası karşılaştırmayla açık bırakıldı; hiçbiri kesinleştirilmedi. **Belirsizlikler E (C055, C068–C073)** brief'teki E1–E16'yı korur (circa/forse/vielleicht/perhaps aynen).

**Brief düzeltmesi (Denetim B bulgusu):** brief §0, Christie's fig.2 "Fünf Frauen auf der Strasse" için "Museum Folkwang" yazar; oysa S10 fig.2 listesi ve S18 FR ödünç listesi **Museum Ludwig, Köln** verir. Karşılaştırma önerisinde Museum Ludwig esas alındı; bu bir brief düzeltme notudur (data'ya yazılmadı).

**Erişilemeyen:** Christie's canlı S8/S9 (000 timeout) → S10 arşiv; MoMA canlı S11 (403) → S12 arşiv; NG nesne katalog sayfası bulunamadı (S21 landing çıkmaz sokak); refs kitap metinleri (Moeller/Gordon/Roters/Piper/Bora/Wye/Schnabel-Tatzkow/Hüneke/Lloyd/Grisebach/Simmons/Hauenstein) erişilmedi, yalnız kaynakçada anıldı (C069).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **Q3476580 için 0 hata; 0 uyarı.** CJK: **0**.
- DERS.json + SORULAR.json şemaya uygun; 12 bölüm eşlemesi tam; durum "İnsan incelemesi bekliyor".
- kavramlar 5 (≤5), kazanımlar 5, CS 10 (≤10), DY 5, AU 5, GZ 5, TK 5.
- gorsel.dogrulama.incelenen_bolgeler = [] → GZ TASLAK otomatik.
- **Not:** Genel dogrula çıktısı "12 hata / 102 uyarı" gösterir; bunların TAMAMI eşzamanlı partideki diğer eserlerin eksik dosyaları/kelime uyarılarıdır (Q17026577, Q227494, Q3793426, Q698487, Q890678 vb.). Q3476580'a ait hata/uyarı YOKTUR.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 438 | 400–500 ✓ | 3 dk |
| Orta | 1335 | 1300–1600 ✓ | 10 dk |
| İleri | 2729 | 2600–3200 ✓ | 20 dk |

**Not:** Kelime hedefleri §8 gereği tahmindir; bu eserde kanıt zenginliği (provenance + iade + biçim + yorum ihtilafları) sayesinde hedef aralıklar dolgu yapılmadan karşılandı. Görsel incelenemediği için biçimsel analiz "kaynakların betimlediği" çerçevesiyle verildi; uydurma gözlem yok.

## 5. Görsel doğrulama (Kural 6)

Commons `File:Kirchner Berlin Street Scene 1913.jpg` (pageid 6604307; WD P18; data/yerel_gorseller.json eşlemesi ✓). Çözünürlük 1948×2638 px; lisans **Public domain** (PD-Art; PD-old-auto-expired; deathyear=1938; Kirchner ö.1938 → 70 yıl pma dolmuş). Credit: MoMA 2008 katalog taraması (Wye, ISBN 9780870707414).
- **Vision kotası ana oturumda → bu oturumda İNCELENEMEDİ (C068 E).** Kompozisyon NG (S6) + Christie's (S10) + MoMA (S12) + wiki (S3/S4/S5) METNİNDEN. **GZ TASLAK.**
- Görsel projeye kopyalanmadı; URL + lisans + kaynak referans verildi.
- **Versiyon karışıklığı riski:** MoMA "Street, Berlin" (120.6×91.1, C049) ve "Five Women on the Street" AYRI eserler; data'da ayrı hash → Q3476580 eşlemesi doğru.
- **İnsan editör görsel teyidi ZORUNLU** (özellikle bakış yönü D10/C066 ve data renk/sigara ayrıntıları E9/C072).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C068, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi zorunlu.
2. **12 ihtilaf (D, C056–C067):** boyut (121×95 ↔ 121.6×91.1), tarih (1913 ↔ 1913-14 ↔ 1913-1914), sosyal eleştiri, tramvay tipi, Hagemann 1936/37, alıcı Sabarsky, euro karşılığı, hukuki temel, Halpin 2004/2006, savaş sonrası mülkiyet, bakış yönü, dizi 11/7 + 1911-14/1913-15.
3. **Bakış yönü (C066, D10):** data "sağdaki kadınlara yan gözle" ↔ dewiki "sağdaki resimden dışarı" ↔ en farklı; görsel teyit + data düzeltme önerisi.
4. **data görsel ayrıntıları (C072, E9):** sarı sigara, beyaz eldiven, kahverengi at, yeşil tekerlek, imza konumu, renk — İNCELENMEDİ; doğrulanmadı.
5. **Provenance belirsizlikleri (C070, E3–E7):** "Sold under duress" tartışmalı (Schultz karşı / S13 destekler); RM 3.000 belgesiz; "vermutlich/ungeklärten/circa" korunmalı.
6. **Kokot kimliği (C071, E8):** "one can't be certain"; figürler kesin "fahişe" etiketlenmedi.
7. **"Yozlaşmış sanat" nüansı (C047/C070):** B destekli ama bu esere özgü müsadere kaydı yok; tablo Nazi döneminde özel mülkiyette.
8. **Envanter no:** bulunamadı (WD P217 yok; NG nesne sayfası yok); insan editör NG nesne kaydını arayabilir.
9. **Brief düzeltmesi:** fig.2 "Fünf Frauen" Museum Folkwang → Museum Ludwig (Denetim B); data/brief onaya sunulur.
10. **Felsefi yorumlar (İleri §7, C074–C076):** Marx/Simmel/Benjamin ödünç; kurum dışı; editör onayı.
11. **Literatür (C069, E):** refs kitap metinleri erişilmedi; Gordon basım yeri Prestel ↔ Cambridge (E16).

## 7. Yayına adaylık

Otomatik kısım sağlandı (Denetim A + B, şema, kelime, CJK, quiz A/B). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil NG/Christie's/MoMA/iade dosyası AÇILDI (A); görsel İNCELENEMEDİ (E); 12 ihtilaf D açık; insan editör görsel teyidi + provenance/bakış yönü/data düzeltme onayı kritiktir.**