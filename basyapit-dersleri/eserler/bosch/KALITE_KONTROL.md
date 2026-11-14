# KALİTE KONTROL — hieronymus-bosch|Garden of Earthly Delights · Dünyevi Zevkler Bahçesi · Hieronymus Bosch

**Tarih:** 14 Kasım 2026 · **Parti:** 1 (M3) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 24 (C001–C024). A=1 (yalnız lisans), B=16, C=2, D=3, E=2.
- **Quiz:** 8 CS + 5 DY + 5 GZ + 5 TK yalnız A/B (bu eserde B); 5 AU (C/D/E dahil). D/E kanıt yok. Merkez yorum/işaret eden adam/tarihleme (D) yalnız AU'da.
- **Kaynak zinciri:** K1 enwiki (B, ana kaynak) + K2 WD (yardımcı) + K3 Commons (incelenemedi) + K4 Prado (403, açılamadı).
- **E/D işareti:** C020/C021 (E) "(belirsiz)"; C015/C016/C017 (D) "(tartışma)" ile işaretli; dogrula belirsizlik denetimi temiz.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (enwiki REST), K2 (WD), K3 (Commons 1200px) 14 Kasım 2026'da açıldı; K4 (Prado) 403:
- The Garden of Earthly Delights (De tuin der lusten); Bosch; five-panel triptych; oil on oak; 205.5×384.9; 1490–1510; Prado since 1939; P002823 ✓ (K1/K2).
- Dış grisaille Third Day; sol Tanrı/Eden; merkez Tanrı yok/özgür irade/çilek/baykuş; sağ Cehennem/ağaç-adam ✓ (K1).
- Üç triptik (Last Judgment/Haywain); sunak belirsiz; müzik erotik; fil/zürafa Reuwich/Cyriac ✓ (K1).
- Provenance Henry III → William Silent → Alba 1568 → Philip II 1591 → El Escorial 1593 (Del Madroño) → Prado 1939 ✓ (K1).
- Merkez yorum (uyarı ↔ cennet; Gombrich; Fraenger 2016 eleştiri); işaret eden adam (Fraenger/Bax/Mateo Gómez/otoportre); tarihleme (Baldass/De Tolnay) → D ✓ (K1).
- **Sınır:** **Prado birincil katalog 403 AÇILAMADI (C020 E)** → A düzeyi yalnız lisans; vision bütçesi tükendi → K3 İNCELENEMEDİ (C021 E); kompozisyon enwiki (B) METNİNDEN. WD 220×390 boyut alternatifi (çerçeve?) not.

**Erişilemeyen/erişilmeyen:** K4 Prado katalog (403); K1 refs (Belting; Gombrich; Fraenger; Bax; De Tolnay; Baldass). İnsan editör teyidi ZORUNLU.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı.** CJK taraması: 0. (Üretimde "II. Philip" nokta kısaltması cümle bölünmesi uyarısı verdi → "Philip II" olarak düzeltildi.)

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 409 | 400–500 | 3 dk ≈ (aralık içinde) |
| Orta | 1318 | 1300–1600 | 10 dk ≈ (aralık içinde) |
| İleri | 2870 | 2600–3200 | 20 dk ≈ (aralık içinde) |

## 5. Görsel doğrulama (Kural 6)

Commons 1200px indirildi; **vision bütçesi tükendi → incelenemedi** (C021 E). Kompozisyon/ikonografi enwiki (B) metninden doğrulandı; data betimi kullanılmadı. **Birincil Prado katalog açılamadı (403, C020 E).** Görsel A iddiası yalnız lisans (C022). İnsan editör görsel + birincil katalog teyidi ZORUNLU. Görsel projeye kopyalanmadı.

## 6. İnsan incelemesi gerektiren noktalar

1. **Birincil katalog (C020, E):** Prado 403 açılamadı; insan editör resmî katalog teyidi ZORUNLU (bu eserde A düzeyi yalnız lisans).
2. **Görsel teyit (C021, E):** bu oturumda yapılamadı; insan editör zorunlu.
3. **Merkez yorum (C015, D):** uyarı ↔ cennet ↔ Fraenger ezoterik ↔ Belting masumiyet — uzman editör.
4. **İşaret eden adam (C016, D):** Fraenger/Bax/Mateo Gómez/otoportre — uzman editör.
5. **Tarihleme (C017, D):** Baldass/De Tolnay — uzman editör.
6. Felsefi yorumlar (İleri §7: özgür irade/günah, masumiyet/Düşüş, grotesk/beden) kurum dışı; editör onayı şart.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Bu eserde birincil katalog erişimi yoktur; kanıt konumu önceki Uffizi/Met/NG/SMB eserlerinden zayıftır; yorum tartışmaları yoğundur; insan editör teyidi özellikle kritiktir.**
