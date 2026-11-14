# KALİTE KONTROL — Q2378534 · Müjde (San Marco Kuzey Koridoru) · Fra Angelico

**Tarih:** 14 Kasım 2026 · **Parti:** 1 (M2) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 29 (C001–C029). A=1 (lisans), B=25, D=0, E=3.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU. D/E kanıt yok.
- **Kaynak zinciri:** K2 enwiki (B, Hood/Damiani) + K3 itwiki (B, Pope-Hennessy/Cornini) + K4 WD + K5 Commons + K6 resmî föy (erişilemedi).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K2 (enwiki REST), K3 (itwiki REST), K4 (WD), K5 (Commons 1400px), K6 (polomuseale) 14 Kasım 2026'da açıldı:
- Cosimo de' Medici ~50 fresk; hücre sade / koridor lüks; altın+azurit Cosimo+kamusal ✓ (K2).
- Açık-hava Müjde türü; Gotik karşıtlığı; mekân/ışık devrimi ✓ (K2).
- Hortus conclusus; jest aynası; orta sütun; yazıt VIRGINIS INTACTAE... ✓ (K2/K3).
- Düşük ışık; tadilat → "otantik değil"; koyu=tefekkür ✓ (K2).
- Diyagonal; kaçış noktası portiko; İyon+Korint başlıklar; boyut 230×321 ✓ (K3).
- **Sınır:** K6 resmî föy HTTP 522 → erişilemedi (C026 E); boyut WD 297↔K3 321 uzlaşmaz (C005 E); WD tarih 1500 güvenilmez; K5 vision bütçesi tükendi → İNCELENEMEDİ (C027 E).

**Erişilemeyen/erişilmeyen:** resmî föy; Hood/Damiani/Craven/Pope-Hennessy/Cornini. İnsan editör teyidi gerekli.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı.**

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 411 | 400–500 | 3 dk ✓ |
| Orta | 1292 | 1300–1600 | 10 dk ≈ (8 alt) |
| İleri | 2522 | 2600–3200 | 20 dk ≈ (78 alt; standart §8 tahmini) |

## 5. Görsel doğrulama (Kural 6)

Commons 1400px indirildi; **vision bütçesi tükendi → incelenemedi.** Görsel A iddiası yok (C027 E); betim K2/K3 kaynaklı. İnsan editör görsel teyidi ZORUNLU. Üretimde bir CJK karışması ("方法的") yakalanıp düzeltildi. Görsel projeye kopyalanmadı.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C027):** bu oturumda yapılamadı; insan editör zorunlu.
2. Resmî föy (K6, 522) → boyut/envanter teyidi (C005/C026 E).
3. Tarih aralığı (c.1440–1445 ↔ 1450+); WD 1500 reddedildi.
4. Sütun orderi (Composite ↔ İyon+Korint) ve Alberti/Roma bağlantısı (B yorum).
5. Felsefi yorumlar (İleri §7: performatif yazıt, karşılaşma estetiği, James alımlaması) kurum dışı; editör onayı şart.
6. data tarih/boyut/müze önerileri KANIT §5'te; data/ dokunulmadı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir.