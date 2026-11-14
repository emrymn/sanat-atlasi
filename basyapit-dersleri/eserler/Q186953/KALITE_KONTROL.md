# KALİTE KONTROL — Q186953 · Atina Okulu (Scuola di Atene) · Raphael

**Tarih:** 14 Kasım 2026 · **Parti:** 2 (M5) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti2/Q186953-brief.md`).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 33 (C001–C033). A=10, B=10, C=2, D=9, E=2.
- **A düzeyi:** Vatikan arşiv scheda + oda (yer/bağlam/figür betimleri). Birincilde tekil tarih/boyut/envanter YOK → B/C/D.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU (C/D/E dahil). Üretimde 6 D/C-kanıt hatası düzeltildi (DY05/GZ04/TK01/TK02/TK04 → A/B).
- **E/D işareti:** 9 D "(tartışma)"; C030/C031 "(belirsiz)"; temiz.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak.
- **WD P217 "6306a."** Ambrosiana KARTONU envanteri; fresk envanteri olarak KULLANILMADI.
- **Ipazia:** WD koşulsuz depicts ↔ itwiki "medya yayılımı, akademik destek yok" → D; quiz doğru cevabı yapılmadı.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1/K2 (Vatikan arşiv 2016/2015), K3/K4 (en/it wikitext), K5 (Britannica arşiv 2020), K6 (WD), K7 (Commons metadata) 14 Kasım 2026'da açıldı:
- Yer/bağlam/figür betimleri (Platon/Aristoteles/Herakleitos/Diogenes/Öklid/Zoroastro/Tolomeo/Raphael) ✓ (K1/K2).
- Kimlik tartışmaları, Herakleitos ekleme, karton eksikleri, tarih/boyut/sayı ✓ (K3/K4/K6).
- **Dokuz+ ihtilaf D:** C009/C014/C018/C019/C022/C023/C027/C028/C029.
- **Görsel:** metadata only; vision bütçesi tükendi → İNCELENEMEDİ (C030); PD + CC BY-SA 4.0 (Ank Kumar, data görseli hash eşleşti).

**Erişilemeyen:** canlı mv.vatican.va (000), canlı Britannica (403), güncel museivaticani.va URL (bulunamadı); refs monografi metinleri (C031).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata; 2 uyarı (Orta 1257 ~%3 alt, İleri 2339 ~%10 alt — §8 tahmini, dolgu yok).** CJK: 0 (üretimde CJKCJK karışması yakalanıp düzeltildi).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 411 | 400–500 | 3 dk (aralık içinde) |
| Orta | 1257 | 1300–1600 | 10 dk (~%3 alt; §8) |
| İleri | 2339 | 2600–3200 | 20 dk (~%10 alt; §8 tahmini) |

## 5. Görsel doğrulama (Kural 6)

Commons metadata; **vision bütçesi tükendi → İNCELENEMEDİ (C030 E).** PD dosya "stitched together from vatican.va"; Ank Kumar CC BY-SA 4.0. Kompozisyon K1/K2 (A) + K3/K4 (B) METNİNDEN. **GZ TASLAK.** Görsel projeye kopyalanmadı. **İnsan editör görsel teyidi ZORUNLU.**

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C030, E):** incelenemedi; GZ TASLAK; insan editör zorunlu.
2. **Dokuz+ ihtilaf (D):** tarih/boyut/beyaz figür/Herakleitos nedeni/Öklid-Arşimet/Protogenes/Plotino-Carneades/sıra/sayı.
3. **Ipazia (C019):** WD koşulsuz ↔ itwiki reddi; medya yayılımı; kesin kimlik yok.
4. **Birincil sınır:** tekil tarih/boyut/envanter birincilde yok; WD 6306a karton envanteri.
5. **Literatür (C031, E):** refs metinleri erişilmedi; Sistina anekdotu efsanevi → kullanılmadı.
6. Felsefi yorumlar (İleri §7: Kant/Hegel/Benjamin ödünç) kurum dışı; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil arşiv AÇILDI (A); görsel İNCELENEMEDİ (E); kimlik enflasyonu D olarak açık; insan editör teyidi kritiktir.**
