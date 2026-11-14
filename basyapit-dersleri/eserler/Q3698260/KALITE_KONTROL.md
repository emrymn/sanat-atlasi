# KALİTE KONTROL — Q3698260 · Santa Croce Çarmıhı (Cimabue)

**Tarih:** 14 Kasım 2026 · **Parti:** 1 (M1) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 27 (C001–C027). A=1, B=23, D=3, E=0.
- **D ihtilaflar:** C003 (atıf), C004 (tarih), C006 (boyut) — derslerde "tartışma" işaretli; kesin cevaplı quizde doğru cevap olarak kullanılmaz. DY04/TK01 kanıtları B'ye çekildi (D kanıt reddi kuralı).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU (AU01 C003 D içerir, serbest).
- **Kaynak zinciri:** in situ bazilika + Opera müzesi; birincil katalog yok → K1 (kaynaklı enwiki B) + K2 (WD) + K3 (Commons görsel A).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (enwiki REST HTML), K2 (WD), K3 (Commons 960×1102) 14 Kasım 2026'da yeniden açıldı:
- c. 1265 (enwiki) / 1272, 1300 (WD) ✓; atıf Cimabue (Vasari/Albertini) ↔ Crowe & Cavalcaselle 1903 red ✓.
- distemper ahşap ✓; 448×390 (enwiki) / 433×390 (WD) ✓; Santa Croce + Museo dell'Opera (1966 sonrası) ✓.
- Franciscan siparişi ✓; 5 ana + 8 yardımcı tahta ✓; Christus patiens ✓; beyaz şeffaf peştamal ✓; kan ✓; Meryem/Yuhanna terminaller ✓.
- 1966 Arno seli ağır hasar ✓; görsel sel ÖNCESİ durum ✓ (K1 caption).
- Görsel: duruş/peştamal/kan/terminaller/hale doğrulandı; titulus yazıtı okunamıyor; görsel sel öncesi (mevcut hasarlı nesne değil) — sınır notu.

**Erişilemeyen birincil hedefler:** Museo dell'Opera di Santa Croce kataloğu/restorasyon yayınları, Crowe & Cavalcaselle 1903, Vasari özgün metin, Messina restorasyon çalışması (K1'de anıldı). İlgili maddeler B (K1 aktarımı); insan editör teyidi gerekli.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı.**

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 412 | 400–500 | 3 dk ✓ |
| Orta | 1305 | 1300–1600 | 10 dk ✓ |
| İleri | 2594 | 2600–3200 | 20 dk ≈ (hedefe ~6 kelime alt; standart §8 tahmini) |

## 5. Görsel doğrulama (Kural 6)

Commons "Cimabue 025.jpg" 960×1102, vision köprüsü (PD; geçici `.qwen/tmp/parti1/Q3698260/`). **Görsel 1966 seli öncesi durumu gösterir**, bugünkü hasarlı nesneyi değil (C022). Duruş/peştamal/kan/terminaller/hale doğrulandı; titulus okunamıyor. Görsel projeye kopyalanmadı.

## 6. İnsan incelemesi gerektiren noktalar

1. Birincil Opera müzesi kataloğu + restorasyon yayınları teyidi (mevcut B aktarımı).
2. Atıf (C003), tarih (C004), boyut (C006) ihtilaflarının birincil kaynakla çözümü.
3. Crowe & Cavalcaselle 1903 / Vasari / Messina metin teyidi.
4. Resepsiyon/etki iddiası (C025) bağımsız doğrulanmadı — kaynak aktarımı.
5. Felsefi yorumlar (İleri §7) kurum dışı; editör onayı şart.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir.