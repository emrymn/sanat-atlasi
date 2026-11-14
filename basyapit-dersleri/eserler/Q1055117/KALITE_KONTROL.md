# KALİTE KONTROL — Q1055117 · Müneccimlerin Tapınması (Adoration of the Magi) · Gentile da Fabriano

**Tarih:** 14 Kasım 2026 · **Parti:** 1 (M3) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 28 (C001–C028). A=13 (birincil Uffizi föyü + lisans), B=11, C=2, D=1, E=1.
- **Quiz:** 8 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU (C/D/E dahil). D/E kanıt yok. Portre kimliği (D) yalnız AU'da; görsel sınırı (E) AU'da.
- **Kaynak zinciri:** K1 Uffizi resmî föyü (BİRİNCİL, ham HTML doğrulandı) + K2 enwiki (B) + K3 WD + K4 Commons (incelenemedi).
- **E/D işareti:** C027 (E) "(belirsiz)", C024 (D) "(tartışma)" ile işaretli; dogrula belirsizlik denetimi temiz.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (Uffizi föyü), K2 (enwiki REST), K3 (WD), K4 (Commons 1200px) 14 Kasım 2026'da açıldı:
- 1423; imza "OPUS GENTILIS DE FABRIANO MCCCCXXIII MENSIS MAII"; tempera-ahşap; 300×282; Uffizi envanter 1890 n. 8364; konum A7 ✓ (K1).
- Palla Strozzi siparişi; Santa Trinita sakristi aile şapeli ✓ (K1). 1420 sipariş; 300 florin; Ghiberti şapeli ✓ (K2).
- Müneccimler + Kutsal Aile; çok etnikli alay + egzotik hayvanlar; üç yolculuk sahnesi/üç kemer ✓ (K1).
- Predella (Nativity/Flight/Presentation); Presentation kopya, özgün Louvre ✓ (K1).
- Uluslararası Gotik'in İtalya'daki en önemli örneği; pastiglia rölyef; predellada mavi gök ✓ (K1).
- Pseudo-Kufic; natüralizm; katmanlama/kısaltma; ayrı çerçeve yeniliği; Altın Mahmuz; alaunt ✓ (K2).
- Portre kimliği (Baldwin ↔ diğerleri) → D ✓ (K2).
- **Sınır:** vision bütçesi tükendi → K4 İNCELENEMEDİ (C027 E); kompozisyon Uffizi (A) + enwiki (B) METNİNDEN (data betimi yok). Boyut Uffizi 300×282 ↔ WD 301.5×283 farkı (C004 not).

**Erişilemeyen/erişilmeyen:** K2 refs (Baldwin; Strehlke; Brogi). İnsan editör teyidi gerekli.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı.** CJK taraması: 0.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 401 | 400–500 | 3 dk ≈ (aralık içinde) |
| Orta | 1341 | 1300–1600 | 10 dk ≈ (aralık içinde) |
| İleri | 2628 | 2600–3200 | 20 dk ≈ (aralık içinde) |

## 5. Görsel doğrulama (Kural 6)

Commons Google Art Project 1200px indirildi; **vision bütçesi tükendi → incelenemedi** (C027 E). Kompozisyon/ikonografi Uffizi föyü (A) ve enwiki (B) metninden doğrulandı; data betimi kullanılmadı. Görsel A iddiası yalnız lisans (C028). İnsan editör görsel teyidi ZORUNLU. Görsel projeye kopyalanmadı.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C027):** bu oturumda yapılamadı; insan editör zorunlu.
2. **Portre kimliği (C024, D):** Baldwin (Palla/Onofrio) ↔ diğerleri (Palla/Lorenzo) — uzman editör.
3. Boyut farkı (Uffizi 300×282 ↔ WD 301.5×283) — birincil tercih, teyit.
4. Predella Presentation özgünü Louvre — kopya/özgün ilişkisi teyidi.
5. Felsefi yorumlar (İleri §7: lüks/kutsal, zirve/eşik, gözlem/gerçekçilik) kurum dışı; editör onayı şart.
6. "Servetin dindar transferi" + Doğu/Pseudo-Kufic yorumları (C025/C016) — eleştirel kuram; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. Birincil Uffizi föyü bu eserde kanıtı güçlendirir, ama görsel teyit ve portre kimliği sınırları sürer.
