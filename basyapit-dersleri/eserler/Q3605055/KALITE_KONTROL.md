# KALİTE KONTROL — Q3605055 · Âdem ile Havva (Adamo ed Eva) · Lucas Cranach (yaşlı)

**Tarih:** 14 Kasım 2026 · **Parti:** 2 (M4) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 25 (C001–C025). A=5, B=13, C=3, D=2, E=2.
- **A düzeyi:** resmî katalog arşiv kopyası (künye/envanter/boyut/atıf/marka) + görsel lisans (C018).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU (C/D/E dahil). Üretimde 2 C/E-kanıt hatası yakalanıp düzeltildi (TK03→C008, TK05→C012/C015).
- **E/D işareti:** C006/C025 "(tartışma)"; C017/C023 "(belirsiz)" cümle içinde; temiz.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak otomatik işaretledi.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (resmî katalog arşiv 2022-01-16, iki scheda), K2/K3 (itwiki/enwiki wikitext), K4 (WD), K5 (Commons) 14 Kasım 2026'da yeniden açıldı:
- Künye: Adamo inv.1459 / Eva inv.1458; her iki 167×61; Cranach Lucas il Vecchio; Uffizi ✓ (K1).
- Atıf: Baldinucci/eski envanter Dürer → 1784 Cranach; kanatlı yılan markası + tarih Âdem panelinde ✓ (K1).
- itwiki: 1528 siglato; granducali ≥1688; 1999 restorasyon; Dürer 1507 Prado + Baldung kopya aynı salon; Viyana 1501–03; 1510 Varşova; betim (elma/yılan/dallar/disinvoltura) ✓ (K2).
- **İki ihtilaf D:** boyut (C006), ağaç adı (C025). **Veri hatası:** WD tr / data ozgun "Haffs" (C022).
- **Görsel:** K5 indirildi ama vision bütçesi tükendi → İNCELENEMEDİ (C017); kompozisyon kaynak metninden.

**Erişilemeyen/erişilmeyen:** canlı polomuseale URL (ölü); güncel Uffizi kaydı (C023); Fossi 2004 / Zuffi 2005 metinleri (C016).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata; 1 uyarı (İleri kelime 2539, hedef 2600–3200, ~%2,3 alt — §8 tahmini, dolgu yok).** CJK: 0.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 405 | 400–500 | 3 dk (aralık içinde) |
| Orta | 1302 | 1300–1600 | 10 dk (aralık içinde) |
| İleri | 2539 | 2600–3200 | 20 dk (~%2,3 alt; §8 tahmini, bilinçli kısa) |

## 5. Görsel doğrulama (Kural 6)

Commons özgün 1100×1525 (WGA credit) indirildi; **vision köprüsü bütçesi bu eserde tükendi → İNCELENEMEDİ (C017 E).** Kompozisyon/ikonografi itwiki+enwiki METNİNDEN ("kaynakların betimlediği"); data betimi kullanılmadı. **GZ soruları TASLAK.** Görsel A iddiası yalnız lisans (C018). Görsel projeye kopyalanmadı; geçici .qwen/tmp/parti2/img/. **İnsan editör görsel teyidi ZORUNLU.**

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C017, E):** incelenemedi; GZ TASLAK; insan editör zorunlu.
2. **Birincil erişim (C023, E):** canlı URL ölü; arşiv 2022; güncel Uffizi kaydı teyidi.
3. **Boyut (C006, D):** resmî 167×61 ↔ itwiki 172×63 ↔ enwiki 172×124.
4. **Ağaç adı (C025, D):** albero della vita ↔ tree of knowledge.
5. **Veri hatası (C022):** ozgun "Haffs" → "Adamo ed Eva (Adam and Eve)" önerisi.
6. **Jest okuması (E sınırı):** enwiki kaşıma ↔ itwiki dayanma; görsel teyit yok.
7. Felsefi yorumlar (İleri §7: Kant/Hegel ödünç) kurum dışı; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Bu eserde birincil katalog arşivden AÇILDI (A) ama görsel İNCELENEMEDİ (E); kanıt konumu orta; görsel + güncel katalog teyidi insan editöre kritiktir.**
