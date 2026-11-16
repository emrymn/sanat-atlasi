# KALİTE KONTROL — Q2324840 · Günlerin Atası (The Ancient of Days) · William Blake

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti4/Q2324840-brief.md`); ham cache `.qwen/tmp/parti4/`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 43 (C001–C043). A=16, B=9, C=2, D=8, E=8. Brief'in 38 iddiası seviyeleriyle korundu; 5 iddia eklendi (C039 görsel-E, C040 kitap metinleri-E, C041/C042 yorum-C, C043 D1 nüsha/kurum-D).
- **A düzeyi:** British Museum Wayback 2026-02-17 (Copy D künye/betim/teknik/edinim/sergiler/fiziksel) + BM 6442 Wayback 2012-10-16 + Commons depo metadata'sı.
- **B düzeyi:** Blake Archive 2013/2014 arşiv (akademik edisyon; müze kaydı değil), Europeana 2016 arşiv, wiki üzerinden aktarılan kitap atıfları (Gilchrist/Smith/Kaiser — metne erişilmedi).
- **C düzeyi:** C041 (ölçme/sınırlama + rasyonalizm eleştirisi), C042 (Ulu Mimar/divine geometer) — açıkça "(yorum)" işaretli; olgu sayılmaz.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B kanıtlı; 5 AU serbest (C/D/E dahil). A/B dışı quiz kanıtı YOK (izole doğrulama).
- **E/D işareti:** 8 D "(tartışma)"; 8 E "(belirsiz)"; post-pass ile uygulandı, temiz.
- **GZ TASLAK:** görsel incelenemedi (incelenen_bolgeler=[]) → gen.py gz_taslak otomatik işaretledi.
- **Totoloji:** CS çeldirici gerekçeleri bağlamsal (kurum/nesne/tarih ayrımı); ≤3 kelimelik "X değil" yok.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Ham cache'ler 14 Kasım 2026'da brief'ten bağımsız yeniden açıldı ve iddialarla karşılaştırıldı:
- **S8 BM Wayback 2026-02-17:** "Copy D, plate 1, frontispiece"; "Print made by: William Blake"; 1794 London; 233×168 mm; "Colour relief etching and white-line etching … added hand colouring"; paper; "(probably Urizen) … measuring the surrounding darkness"; Palgrave 1859; Humphry (?)/Butts (?); Not on display; sergiler; Copy D fiziksel (1–15 numaralandırma, I TAYLOR, morocco, Cumberland) ✓.
- **S17 BM 6442 Wayback 2012-10-16:** "After William Blake"; "Watercolour, with pen and grey ink"; 296×188 mm; 1885; 1885,0509.1619; "Not included in Butlin's 1981 catalogue"; "crimson orb … immense compasses" ✓.
- **S15/S16 BA Wayback 2013/2014:** copy K 1821 Fitzwilliam; 23.4×16.9 cm; "Dates are the probable dates of printing"; 18 levha; proof a–c; B–G 1794; A/H 1795; K 1821; I/L/M posthumous c.1832; pl.3 yalnız H/K; Copy A opak suluboya "probably … other than Blake"; Continental Prophecies; Urizen/Orc/Los/Enitharmon ✓.
- **S5/S6 Commons:** Copy K Fitzwilliam; "Relief etching with hand coloring"; 30.8×24.8 cm; PD-Art deathyear=1827; 2217×3004 px, 1.494.518 bayt, upload 2010-03-27; credit Blake Archive; kompozit dosya missing=true ✓.
- **S3/S4 en/it wiki raw:** infobox "Proof copy at the British Museum"; Romanticism atıfsız; Daniel atıfsız (it Dan 7,22); Kaiser atfı; Gilchrist/Smith aktarımları; Proverbs en/it farkı; Newton "next year" atıfsız; on üç nüsha; I/L 1829, M 1832, MPI ✓.
- **S10 Europeana Wayback 2016:** BM Copy D verisi (23.3×16.8, 1794, Palgrave 1859, CC BY-NC-SA 4.0) ✓.
- **S1 WD EntityData:** P18=Copy K; P195 BM referanslı + 4 kurum referanssız; P217 1859,0625.72 (qual P195=BM); P127 P580=1885; P571 1794 precision 9; P186 ink refsiz + paper; P1684 Milton blog ref; P31 painting+etching print ✓.

**Doğrulanan kritik noktalar:** D1 nüsha/kurum (görsel Copy K ↔ kayıt Copy D), D2 boyut üçlü ayrışma, D4 P127-1885 ↔ 6442, hedge'ler ("probably Urizen" / "probable dates of printing" / "Humphry (?)-Butts (?)"). **Görsel İNCELENEMEDİ (C039); kitap metinleri erişilmedi (C040).**

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft2020-12 AKTİF), Q2324840 izole: **0 hata / 0 uyarı.** CJK: 0. bolum_eslesme 12/12. durum="İnsan incelemesi bekliyor".
*Küresel çalıştırmadaki hatalar başka partilere ait eserlerdedir (Q1368055/Q311243/Q540488 — eksik dosya/CS gerekçe; eşzamanlı üretim). Bu dosyalar Q2324840 kapsamında değildir, dokunulmadı.*

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 420 | 400–500 | 3 dk |
| Orta | 1338 | 1300–1600 | 10 dk |
| İleri | 2658 | 2600–3200 | 20 dk |

Üç seviye de §8 hedef aralığında; dolgu/tekrar yok (yakın-tekrar ve seviyeler-arası birebir cümle kontrolleri temiz). İleri ders gerçekten daha derin: nüsha filolojisi, baskı tarihçesi, kaynak eleştirisi, D1–D10 envanteri, yorum ekolleri.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (Copy K, 2217×3004 px, PD-Art deathyear=1827, credit Blake Archive); **görsel bu oturumda İNCELENEMEDİ (vision kotası ana oturumda) → C039 E.** Kompozisyon BM (A) + BA (B) + wiki betimlerinden; "kaynakların betimlediği" diliyle verildi. **GZ TASLAK.** Görsel projeye kopyalanmadı; URL + lisans + kaynak referans. **İnsan editör görsel teyidi ZORUNLU** — özellikle data'nın "sağ üstte 1 rakamı" iddiası (BM Copy D'de önispis numaralandırma dışı, C031; Copy K için doğrulanamadı) ve renk/rüzgâr ayrıntıları.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C039, E):** incelenemedi; GZ TASLAK; "1" rakamı/renk/rüzgâr data iddiaları doğrulanmadı; insan editör zorunlu.
2. **D1 nüsha/kurum (C043):** gösterilen görsel Copy K (Fitzwilliam) ↔ data/WD "British Museum" (Copy D). data muze alanı ve kunye etiketi düzeltilmeli; tek muze alanı nüsha bazlı koleksiyonları temsil edemez.
3. **D2 boyut (C008):** BM Copy D 233×168 ↔ BA Copy K 23.4×16.9 ↔ Commons Copy K 30.8×24.8. kunye boyut_cm Copy D'ye aittir; Copy K için çelişki çözülmedi.
4. **D4 edinim (C024):** WD P127 "1885" BM 6442 suluboyasına ait; Copy D 1859. WD/data düzeltmesi.
5. **Diğer ihtilaflar (D):** nüsha sayısı (C019), levha sayısı (C030), "proof copy" etiketi (C025), Butlin yılı (C026), tür (C032), posthumous tarihler (C036), a/A adlandırma (E12).
6. **Hedge koruması:** "(probably Urizen)" (C012), "probable dates of printing" (C005), "Humphry (?)/Butts (?)" (C021) — data/eser_notlari kesinleştiriyor; düzeltilmeli.
7. **Kanıtı olmayan data iddiaları (E):** "suluboya" özgüllemesi (E4/C009), Milton altın pergel (C015), Daniel başlığı (C013), Newton 1795 (C018), Ön-Raffaellocu/Sembolist etkisi (C034), Romantizm etiketi (C033), "pusula"→pergel terim hatası (E1).
8. **Literatür (C040, E):** Gilchrist/Smith/Kaiser/Raine/Bindman/Viscomi/Keynes&Wolf/Butlin metinleri erişilmedi; yalnız atıf zinciri. Fitzwilliam birincil katalog URL'si bulunamadı (E15); Copy K envanter no yok.
9. **Felsefi yorumlar (C041/C042):** ölçme/sınırlama, rasyonalizm eleştirisi, Ulu Mimar — kurum dışı yorum; editör onayı.
10. **Envanter boşluğu:** muze_numaralari.json/kunye.json/gorsel_kaynagi.json vb. Q2324840 girdisi yok (kapsam boşluğu).

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz + quiz A/B + kelime + CJK). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil BM Wayback AÇILDI (A); Blake Archive arşiv (B); görsel İNCELENEMEDİ (E); D1 nüsha/kurum uyuşmazlığı ve hedge'ler insan onayına sunulur.**
