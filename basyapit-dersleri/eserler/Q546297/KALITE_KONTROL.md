# KALİTE KONTROL — Q546297 · Ölü İsa (Cristo morto) · Andrea Mantegna

**Tarih:** 14 Kasım 2026 · **Parti:** 1 (M2) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 0. PARTİ 1 DÜZELTME NOTU (14 Kasım 2026 — PARTI_1_CLAUDE_DENETIM)

Bu dosya Claude bağımsız denetimi sonrası revize edildi; aşağıdaki §1–§7'deki eski sayı/atıflar bu notla güncellenir.
- **K-2 düzeltildi:** yanlış Brera URL (`opere/cristo-morto`, 404) → doğru kayıt `collezioni/collezione-on-line/cristo-morto-nel-sepolcro-e-tre-dolenti/` (200). Teknik/boyut/yer/envanter/Sala VI → **A (C003–C007, C028)**. "Brera föyü erişilemedi / envanter yalnız WD" ifadeleri kaldırıldı.
- **Tarih:** Brera birincil "1483 circa" (C003 A); literatür tartışması D (C030). **"data 1483→aralık" önerisi GERİ ÇEKİLDİ** (Brera c.1483 ile data uyumlu).
- **Provenance:** belgeli 1806 Bossi/Canova → 1824 Brera (A, C023); bottega/Gonzaga "en kabul gören hipotez", 1628 Carlo I + Mazarin "non risolutive ipotesi" (D, C031). **Aldobrandini 1603 diğer versiyon** (itwiki "sdoppiarsi") — Brera zincirinden çıkarıldı. TK05/CS10 düzeltildi.
- **S-3:** Magdalene "in tutta probabilità" → büyük olasılıkla (DY04); ışık sağdan itwiki K3 (CS06 atfı); Eisler/Steinberg atfı daraltıldı (C021); yenilgi/zafer C (C022). **S-4:** İleri dolgu (34 "Seminer sorusu" tekrarı) temizlendi.
- **Güncel:** 31 iddia (A8/B16/C2/D4/E1), 5 kaynak. Kelime 410/957/1552 (Orta/İleri hedef altı — dolgu kaldırıldı, §8). dogrula 0 hata; CJK 0. Durum "İnsan incelemesi bekliyor".

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 29 (C001–C029). A=1 (lisans), B=22, C=1, D=2, E=3.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU. D/E kanıt yok (TK05 D-kanıt hatası düzeltildi).
- **Kaynak zinciri:** K2 enwiki (B) + K3 itwiki (B) + K4 WD + K5 Commons + K6 Brera (404).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K2 (enwiki REST), K3 (itwiki REST), K4 (WD), K5 (Commons 1400px), K6 (Brera) 14 Kasım 2026'da açıldı:
- tempera-tuval 68×81; Brera; scorcio ayaklardan; yüz takip; üç yasçı; merhem kavanozu; sağdan ışık ✓ (K2/K3).
- Orantı "hatası" (ayak küçük/bacak kısa) + teoriler (Kristeller/Ward/Jantzen/Manca) ✓ (K2/K3) → D.
- provenance (1506 bottega→1507 Gonzaga→1628 Carlo I→Mazarino→1824 Brera) ✓ (K3).
- İki versiyon hipotezi (Glenn Head, British Museum drawing) → D ✓.
- von Einem "spooky", Schrade paradoks, Eisler/Steinberg İnsanlık ✓ (K2).
- **Sınır:** K6 Brera föyü 404 (C028 E); envanter 352 yalnız WD (C007 E); vision bütçesi tükendi → K5 İNCELENEMEDİ (C027 E). Tarih tartışmalı (D/B).

**Erişilemeyen/erişilmeyen:** Brera föyü; K2/K3 refs. İnsan editör teyidi gerekli.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı.**

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 401 | 400–500 | 3 dk ✓ |
| Orta | 1281 | 1300–1600 | 10 dk ≈ (19 alt) |
| İleri | 2503 | 2600–3200 | 20 dk ≈ (97 alt; standart §8 tahmini) |

## 5. Görsel doğrulama (Kural 6)

Commons 1400px indirildi; **vision bütçesi tükendi → incelenemedi.** Görsel A iddiası yok (C027 E); betim K2/K3 kaynaklı. İnsan editör görsel teyidi ZORUNLU. Görsel projeye kopyalanmadı.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C027):** bu oturumda yapılamadı; insan editör zorunlu.
2. Brera föyü (404) → envanter/teknik teyidi (C007/C028 E).
3. Tarih aralığı (1475–1501); data "1483" → aralık önerisi.
4. Orantı teorileri + iki versiyon hipotezi (D); İnsanlık vurgusu (C).
5. Felsefi yorumlar (İleri §7: compassio, beden-hakikat, yenilgi-zafer) kurum dışı; editör onayı şart.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir.