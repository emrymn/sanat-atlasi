# KALİTE KONTROL — Q3697588 · Sütundaki İsa (Cristo alla colonna) · Bramante (atıf)

**Tarih:** 14 Kasım 2026 · **Parti:** 1 (M2) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 19 (C001–C019). A=1 (lisans), B=15, C=0, D=1, E=2.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU. D/E kanıt yok (DY03 atıf için C002 B kullanıldı).
- **Kaynak zinciri:** K2 enwiki (B) + K3 itwiki (B) + K4 WD + K5 Commons + K6 Lombardia/MiC (JS, çıkarılamadı).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K2 (enwiki REST), K3 (itwiki REST), K4 (WD), K5 (Commons 1200px), K6 (lombardiabeniculturali) 14 Kasım 2026'da açıldı:
- c.1490; yağlıboya-pano 93×62; Brera; Chiaravalle siparişi; Bramante'nin tek panosu ✓ (K2/K3).
- Atıf tartışması (Suida → Bramantino) → D ✓.
- 1915 depozito; 2017 ısıtma hasarı + restorasyon ✓ (K2/K3).
- Sütun + ip + yakın kadraj; San Satiro yöntemi; Urbino/Flaman/Leonardo etkileri; pyx=Ökaristi ✓ (K2/K3).
- **Sınır:** K6 föy JS kabuğu → çıkarılamadı (C018 E); vision bütçesi tükendi → K5 İNCELENEMEDİ (C017 E); teknik wiki "oil" ↔ WD "tempera" farkı (C004 not).

**Erişilemeyen/erişilmeyen:** K6 föy içeriği; De Vecchi/Cerchiari 1999; Brera guida 2004. İnsan editör teyidi gerekli.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı.**

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 392 | 400–500 | 3 dk ≈ (8 alt) |
| Orta | 1271 | 1300–1600 | 10 dk ≈ (29 alt) |
| İleri | 2475 | 2600–3200 | 20 dk ≈ (125 alt; standart §8 tahmini) |

## 5. Görsel doğrulama (Kural 6)

Commons 1200px indirildi; **vision bütçesi tükendi → incelenemedi.** Görsel A iddiası yok (C017 E); betim K2/K3 kaynaklı. İnsan editör görsel teyidi ZORUNLU. Görsel projeye kopyalanmadı.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C017):** bu oturumda yapılamadı; insan editör zorunlu.
2. Birincil föy (K6 JS) → envanter/teknik teyidi (C018 E); oil/tempera farkı.
3. Atıf (Bramante/Bramantino) D — uzman editör.
4. 2017 hasarı/restorasyon durumu izlenmeli.
5. Felsefi yorumlar (İleri §7: acı estetiği, mekân-sonsuzluk, Ökaristi) kurum dışı; editör onayı şart.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir.