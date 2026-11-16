# KALİTE KONTROL — Q500985 · Karda Avcılar (The Hunters in the Snow) · Pieter Bruegel (yaşlı)

**Tarih:** 14 Kasım 2026 · **Parti:** 1 (M3) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 21 (C001–C021). A=1 (yalnız lisans), B=15, C=2, D=1, E=2.
- **Quiz:** 8 CS + 5 DY + 5 GZ + 5 TK yalnız A/B (bu eserde B); 5 AU (C/D/E dahil). D/E kanıt yok. Aziz kimliği (C021, D) yalnız AU'da.
- **Kaynak zinciri:** K1 enwiki (B, ana kaynak) + K2 WD (yardımcı) + K3 Commons (incelenemedi) + K4 KHM (JS, çıkarılamadı).
- **E/D işareti:** C018/C019 (E) "(belirsiz)"; C021 (D) "(tartışma)" ile işaretli; dogrula belirsizlik denetimi temiz.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (enwiki REST), K2 (WD), K3 (Commons 1200px) 14 Kasım 2026'da açıldı; K4 (KHM) JS kabuğu:
- The Hunters in the Snow (Jagers in de Sneeuw) / Return of the Hunters; Bruegel; 1565; oil on wood; 117×162; KHM Vienna; GG_1838 ✓ (K1/K2).
- Altı aylık seri (beşi extant); Ara/Oca; Labours of the Months; Küçük Buzul Çağı ✓ (K1).
- Üç avcı + zayıf köpekler + tilki leşi + tavşan izleri; soluk palet + odun dumanı + handa domuz yakma; Altın Geyik tabela ✓ (K1).
- Kargalar/saksağan uğursuzluk; Alp zirveleri (Low Countries'da yok); donmuş değirmen; buz pateni/kolf/eisstock; seri listesi; BBC 100 ✓ (K1).
- Aziz kimliği (Hubertus ↔ Eustace) → D ✓ (K1).
- **Sınır:** **KHM birincil katalog JS kabuğu → veri çıkarılamadı (C018 E)** → A düzeyi yalnız lisans; vision bütçesi tükendi → K3 İNCELENEMEDİ (C019 E); kompozisyon enwiki (B) METNİNDEN.

**Erişilemeyen/erişilmeyen:** K4 KHM catalog verisi (JS); K1 refs. İnsan editör teyidi ZORUNLU.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı.** CJK taraması: 0.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 427 | 400–500 | 3 dk ≈ (aralık içinde) |
| Orta | 1295 | 1300–1600 | 10 dk ≈ (5 alt, ~%0,4; tolerans) |
| İleri | 2900 | 2600–3200 | 20 dk ≈ (aralık içinde) |

## 5. Görsel doğrulama (Kural 6)

Commons Google Art Project 1200px indirildi; **vision bütçesi tükendi → incelenemedi** (C019 E). Kompozisyon/ikonografi enwiki (B) metninden doğrulandı; data betimi kullanılmadı. **Birincil KHM katalog JS kabuğu → çıkarılamadı (C018 E).** Görsel A iddiası yalnız lisans (C020). İnsan editör görsel + birincil katalog teyidi ZORUNLU. Görsel projeye kopyalanmadı.

## 6. İnsan incelemesi gerektiren noktalar

1. **Birincil katalog (C018, E):** KHM objectdb JS kabuğu, veri çıkarılamadı; insan editör resmî katalog teyidi ZORUNLU (bu eserde A düzeyi yalnız lisans).
2. **Görsel teyit (C019, E):** bu oturumda yapılamadı; insan editör zorunlu.
3. **Aziz kimliği (C021, D):** Hubertus ↔ Eustace — uzman editör.
4. Hayali coğrafya (Alp zirveleri) + ruh hâli yorumu (C016/C017) — eleştirel kuram; editör onayı.
5. Felsefi yorumlar (İleri §7: melankoli/doğa, insan/doğa, gerçek/ideal) kurum dışı; editör onayı şart.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Bu eserde birincil katalog verisi çıkarılamadı; kanıt konumu önceki Uffizi/Met/NG/SMB eserlerinden zayıftır; insan editör teyidi özellikle kritiktir.**
