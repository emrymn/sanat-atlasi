# KALİTE KONTROL — Q2409245 · Genç Bir Kızın Portresi (Portrait of a Young Girl) · Petrus Christus

**Tarih:** 14 Kasım 2026 · **Parti:** 1 (M3) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 24 (C001–C024). A=8 (SMB kaydı + lisans), B=12, C=2, D=1, E=1.
- **Quiz:** 8 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU (C/D/E dahil). D/E kanıt yok. Sitter kimliği (C019, D) yalnız AU'da.
- **Kaynak zinciri:** K1 SMB recherche koleksiyon kaydı obj:870214 (BİRİNCİL, ham HTML doğrulandı) + K2 enwiki (B) + K3 WD + K4 Commons (incelenemedi).
- **E/D işareti:** C022 (E) "(belirsiz)"; C019 (D) "(tartışma)" ile işaretli; dogrula belirsizlik denetimi temiz.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (SMB recherche), K2 (enwiki REST), K3 (WD), K4 (Commons 1200px) 14 Kasım 2026'da açıldı:
- Bildnis einer jungen Dame; Petrus Christus (um 1410/20–um 1475); um 1470; Eichenholz; 29.1×22.7; Ident. Nr. 532 ✓ (K1).
- 1821 Edward Solly koleksiyonundan satın alma; Brügge; Public Domain Mark 1.0; tek kadın portresi; gri-kahve duvar + lambri; siyah kadife başlık + altın şerit ✓ (K1).
- c. 1465–1470; üslup ilerlemesi; Upton "cilalı inci"; van Eyck/Rogier mirası; göz hizasızlığı/kaş; mimari çerçeve/ters üçgen; Sterling ışık; soluk ten/badem göz ✓ (K2).
- Provenance 1492 Medici ("Fransız leydi"/Pietro Cresci, 40 florin); Fouquet/Rogier karşılaştırma ✓ (K2).
- Sitter kimliği (Waagen Talbot ↔ Scharf Grimston/Alice ↔ Ring red ↔ Upton Ankaret ↔ Campbell) → D ✓ (K2).
- **Sınır:** vision bütçesi tükendi → K4 İNCELENEMEDİ (C022 E); kompozisyon SMB (A) + enwiki (B) METNİNDEN. Boyut SMB 29.1×22.7 ↔ wiki/WD 29×22.5 (küçük fark, C003 not). Tarih SMB um 1470 ↔ wiki c. 1465–1470.

**Erişilemeyen/erişilmeyen:** K2 refs (Upton; Kemperdick; Sterling; Campbell; Ring). İnsan editör teyidi gerekli.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı.** CJK taraması: 0 (üretimde "often" karışması yakalanıp düzeltildi).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 410 | 400–500 | 3 dk ≈ (aralık içinde) |
| Orta | 1344 | 1300–1600 | 10 dk ≈ (aralık içinde) |
| İleri | 2963 | 2600–3200 | 20 dk ≈ (aralık içinde) |

## 5. Görsel doğrulama (Kural 6)

Commons Google Art Project 1200px indirildi; **vision bütçesi tükendi → incelenemedi** (C022 E). Kompozisyon/ikonografi SMB (A) ve enwiki (B) metninden doğrulandı; data betimi kullanılmadı. Görsel A iddiası yalnız lisans (C023). İnsan editör görsel teyidi ZORUNLU. Görsel projeye kopyalanmadı.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C022):** bu oturumda yapılamadı; insan editör zorunlu.
2. **Sitter kimliği (C019, D):** Waagen Talbot ↔ Scharf Grimston/Alice ↔ Ring ↔ Upton/Campbell; kayıp çerçeve yazıtı — uzman editör.
3. Tarih (SMB um 1470 ↔ wiki c. 1465–1470) ve boyut (29.1×22.7 ↔ 29×22.5) — küçük farklar, teyit.
4. Felsefi yorumlar (İleri §7: bireysellik/iç hayat, zarafet/yalıtım, sınıf/temsil) kurum dışı; editör onayı şart.
5. Aristokrat öz-sunum + psikolojik mevcudiyet (C020/C021) — eleştirel kuram; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. SMB birincil kaydı kimliği/tekniği sabitler; sitter kimliği tartışması ve görsel teyit sınırı sürer.
