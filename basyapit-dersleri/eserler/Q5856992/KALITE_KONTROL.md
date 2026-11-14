# KALİTE KONTROL — Q5856992 · Şubat (February) · Limbourg Kardeşler (Très Riches Heures)

**Tarih:** 14 Kasım 2026 · **Parti:** 1 (M3) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 21 (C001–C021). A=1 (lisans), B=11, C=2, D=0, E=7.
- **Quiz:** 5 CS + 5 DY + 4 GZ + 5 TK yalnız A/B; 5 AU (C/E yorum dahil). D/E kanıt yok. Görsel betim (E) quiz doğru cevabında kullanılmadı; GZ/TK B düzeyli (sansür, lüks, book of hours, atıf) iddialara bağlandı.
- **Kaynak zinciri:** K2 enwiki (B) + K3 WD (yardımcı) + K4 Commons (görsel, incelenemedi) + K5 Condé (açılmadı).
- **E/D işareti:** E iddiaları (C011–C015, C019, C020) ders cümlelerinde "(belirsiz)" ile işaretli; dogrula belirsizlik işareti denetimi temiz.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K2 (enwiki REST), K3 (WD), K4 (Commons 1200px) 14 Kasım 2026'da açıldı:
- Şubat / Très Riches Heures takvim sayfası; Limbourg Kardeşler; Berry Dükü Jean; c.1412–16 ✓ (K2/K3).
- El yazması minyatürü (book of hours), parşömen; ~29×21 (WD)/30×21.5 (K2); Musée Condé MS65 f.2v ✓ (K2/K3).
- Uluslararası Gotik; pahalı pigment + altın ✓ (K2).
- Atıf tartışması (Pognon "rustic painter"; kardeşler 1416 öldü, sonra Colombe tamamladı) → B ✓.
- Alımlama (1980'ler Condé kısıtlama + faksimile; Camille reprodüksiyon) ve sansür (dergi genital retuşu) ✓ (K2).
- **Sınır:** K5 Condé katalog açılmadı (C020 E); vision bütçesi tükendi → K4 İNCELENEMEDİ (C019 E); ayrıntılı kış sahnesi (C011–C015) mevcut data betiminden → E/belirsiz (data kaynak değildir).

**Erişilemeyen/erişilmeyen:** K5 Condé katalog; K2 refs (Cazelles/Rathofer 1988; Camille; Pognon). İnsan editör teyidi gerekli.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı.** CJK taraması: 0.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 533 | 400–500 | 3 dk ≈ (33 üst; belirsizlik notu eklendi) |
| Orta | 1308 | 1300–1600 | 10 dk ≈ (aralık içinde) |
| İleri | 2533 | 2600–3200 | 20 dk ≈ (67 alt, ~%2,6; tolerans içinde) |

## 5. Görsel doğrulama (Kural 6)

Commons 1200px indirildi; **vision bütçesi tükendi → incelenemedi.** Görsel A iddiası yok (C019 E); ayrıntılı kış sahnesi betimi mevcut data'dan (C011–C015 E). İnsan editör görsel teyidi ZORUNLU. Görsel projeye kopyalanmadı; geçici .qwen/tmp/parti1/Q5856992/img.jpg.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C019):** bu oturumda yapılamadı; insan editör zorunlu.
2. **Kış sahnesi betimi (C011–C015):** mevcut data; görsel + birincil teyit bekliyor (E).
3. Birincil Condé katalog (K5) → envanter/boyut teyidi (C020 E).
4. Atıf (Limbourg / "rustic painter") B — uzman editör.
5. Felsefi yorumlar (İleri §7: soğuk deneyimi, zaman döngüsü, bakış/iktidar) kurum dışı; editör onayı şart.
6. Köylü "öteki" + sansür yorumu (C016) — eleştirel kuram; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir.
