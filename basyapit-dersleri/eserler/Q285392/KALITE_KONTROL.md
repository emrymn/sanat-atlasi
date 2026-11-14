# KALİTE KONTROL — Q285392 · Mérode Triptiği (Annunciation Triptych) · Robert Campin (ve atölyesi)

**Tarih:** 14 Kasım 2026 · **Parti:** 1 (M3) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 28 (C001–C028). A=7 (Met kaydı + lisans), B=15, C=2, D=3, E=1.
- **Quiz:** 8 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU (C/D/E dahil). D/E kanıt yok (TK04'teki kapan/rende D'si kanıttan çıkarıldı, metinde "ayrıca D" notu). Atıf/donor/kapan (D) yalnız AU'da.
- **Kaynak zinciri:** K1 Met koleksiyon API object 470304 (BİRİNCİL, doğrulandı) + K2 enwiki (B) + K3 WD + K4 Commons (incelenemedi).
- **E/D işareti:** C026 (E) "(belirsiz)"; C018/C022/C023 (D) "(tartışma)" ile işaretli; dogrula belirsizlik denetimi temiz.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (Met API objects/470304), K2 (enwiki REST), K3 (WD), K4 (Commons 1200px) 14 Kasım 2026'da açıldı:
- Annunciation Triptych (Merode Altarpiece); Robert Campin; ca. 1427–32; Oil on oak ✓ (K1).
- Boyut açık 64.5×117.8; orta 64.1×63.2; kanat 64.5×27.3; envanter 56.70a–c; Cloisters Collection 1956; isPublicDomain True ✓ (K1).
- İmzasız/tarihsiz; Campin + atölye; üç panel (donorlar/Müjde/Joseph); zambak/çeşme/ışık ✓ (K2).
- Master of Flémalle = Campin; 1422 sonrası/1432 Ghent; Brüksel versiyonu; çok el/ahşap/menteşe; yeniden işleme ✓ (K2).
- Donorlar Mechelen/Tournai 1427/arma; fare kapanı Augustinus/Schapiro/Panofsky; Liège manzarası ✓ (K2).
- Atıf (Campin/Rogier/Campbell), donor (Jan/Peter Engelbrecht), kapan/rende (Zupnick/Jacob) → D ✓ (K2).
- **Sınır:** vision bütçesi tükendi → K4 İNCELENEMEDİ (C026 E); kompozisyon Met (A) + enwiki (B) METNİNDEN. WD 1500 (yüzyıl) güvenilmez; Met c. 1427–1432 tercih (C002). Met search endpoint 410 (objects endpoint çalıştı).

**Erişilemeyen/erişilmeyen:** K2 refs (Schapiro 1970; Panofsky; Campbell; Jacobs 2002; Harbison 1995). İnsan editör teyidi gerekli.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı.** CJK taraması: 0 (üretimde "潘ofsky" karışması yakalanıp düzeltildi).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 433 | 400–500 | 3 dk ≈ (aralık içinde) |
| Orta | 1318 | 1300–1600 | 10 dk ≈ (aralık içinde) |
| İleri | 2609 | 2600–3200 | 20 dk ≈ (aralık içinde) |

## 5. Görsel doğrulama (Kural 6)

Commons Google Art Project 1200px indirildi; **vision bütçesi tükendi → incelenemedi** (C026 E). Kompozisyon/ikonografi Met (A) ve enwiki (B) metninden doğrulandı; data betimi kullanılmadı. Görsel A iddiası yalnız lisans (C027). İnsan editör görsel teyidi ZORUNLU. Görsel projeye kopyalanmadı.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C026):** bu oturumda yapılamadı; insan editör zorunlu.
2. **Atıf (C022, D):** Campin ↔ Rogier ↔ Campbell; Flémalle ilişkisi — uzman editör.
3. **Donor kimliği (C018, D):** Jan ↔ Peter Engelbrecht + Scrynmaker — uzman editör.
4. **Fare kapanı ↔ rende (C023, D):** Zupnick ↔ Jacob — sembolizm/maddi kanıt.
5. Tarih (Met c. 1427–1432 ↔ WD 1500) — WD düzeltilmeli.
6. Felsefi yorumlar (İleri §7: ev içi kutsal, gizli anlam, kilometre taşı) kurum dışı; editör onayı şart.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. Met birincil kaydı kimliği sabitler; atıf/donor/sembolizm tartışmaları ve görsel teyit sınırı sürer.
