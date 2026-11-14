# KALİTE KONTROL — Q220859 · Arnolfini Portresi (The Arnolfini Portrait) · Jan van Eyck

**Tarih:** 14 Kasım 2026 · **Parti:** 1 (M3) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 26 (C001–C026). A=9 (NG kaydı + lisans), B=12, C=2, D=2, E=1.
- **Quiz:** 8 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU (C/D/E dahil). D/E kanıt yok. Yorum (C020) ve sitter (C021) D yalnız AU'da.
- **Kaynak zinciri:** K1 National Gallery resmî katalog föyü (BİRİNCİL, ham HTML doğrulandı) + K2 enwiki (B) + K3 WD + K4 Commons (incelenemedi).
- **E/D işareti:** C024 (E) "(belirsiz)"; C020/C021 (D) "(tartışma)" ile işaretli; dogrula belirsizlik denetimi temiz.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (NG katalog), K2 (enwiki REST), K3 (WD), K4 (Commons 1200px) 14 Kasım 2026'da açıldı:
- The Arnolfini Portrait; Jan van Eyck; 1434; Oil on wood (probably oak); 82.2×60; NG186; Gallery C ✓ (K1).
- İmza "Johannes de eyck fuit hic 1434" (aynanın üstünde); Bought 1842 (600 Guineas); ilk Netherlandish resim ✓ (K1).
- Probably Giovanni di Nicolao Arnolfini + eşi (Bruges İtalyan tüccar); oda tutarsızlıkları (avize/şömine); ayna iki adamı yansıtır ✓ (K1).
- Tam boy çift portre; 3 dikey tahta/panel 84.5×62.5; ortogonal perspektif + ayna mekânı; Gombrich; glazür/wet-in-wet; iki Giovanni kuzen; avize/Passion ayna; Affenpinscher ✓ (K2).
- Yorum (Panofsky evlilik ↔ Hall nişan ↔ Carroll yasal yetki ↔ memorial Costanza Trenta) + sitter kimliği → D ✓ (K2).
- **Sınır:** vision bütçesi tükendi → K4 İNCELENEMEDİ (C024 E); kompozisyon NG (A) + enwiki (B) METNİNDEN. Boyut NG 82.2×60 ↔ wiki panel 84.5×62.5 (çerçeve/panel farkı, C002/C010 not).

**Erişilemeyen/erişilmeyen:** K2 refs (Panofsky; Hall; Carroll; Gombrich). İnsan editör teyidi gerekli.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı.** CJK taraması: 0.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 419 | 400–500 | 3 dk ≈ (aralık içinde) |
| Orta | 1330 | 1300–1600 | 10 dk ≈ (aralık içinde) |
| İleri | 2848 | 2600–3200 | 20 dk ≈ (aralık içinde) |

## 5. Görsel doğrulama (Kural 6)

Commons 1200px indirildi; **vision bütçesi tükendi → incelenemedi** (C024 E). Kompozisyon/ikonografi NG (A) ve enwiki (B) metninden doğrulandı; data betimi kullanılmadı. Görsel A iddiası yalnız lisans (C025). İnsan editör görsel teyidi ZORUNLU. Görsel projeye kopyalanmadı.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C024):** bu oturumda yapılamadı; insan editör zorunlu.
2. **Yorum (C020, D):** Panofsky evlilik ↔ Hall nişan ↔ Carroll yasal yetki ↔ memorial — uzman editör.
3. **Sitter kimliği (C021, D):** hangi Giovanni + kadın (eşi/Costanza Trenta) — uzman editör.
4. Boyut farkı (NG 82.2×60 ↔ wiki panel 84.5×62.5) — çerçeve/panel ayrımı teyidi.
5. Felsefi yorumlar (İleri §7: tanıklık/kayıt, gizli anlam, temsil/statü) kurum dışı; editör onayı şart.
6. "Gizli sembolizm" + tüccar öz-temsili (C022/C023) — eleştirel kuram; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. NG birincil kaydı kimliği/tekniği sabitler; yorum ve sitter tartışmaları ile görsel teyit sınırı sürer.
