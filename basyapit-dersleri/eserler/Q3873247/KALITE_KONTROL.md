# KALİTE KONTROL — Q3873247 · Meryem'in Doğumu (Pietro Lorenzetti)

**Tarih:** 14 Kasım 2026 · **Parti:** 1 (M1) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 27 (C001–C027). A=6 (görsel doğrudan + PD), B=21, D=0, E=0.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU. D/E kanıt yok.
- **Kaynak zinciri:** Siena Opera del Duomo. Birincil müze kataloğu yok → K1 (enwiki B) + K2 (WD) + K3 (Commons görsel A).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (enwiki REST HTML), K2 (WD), K3 (Commons 1275×1300) 14 Kasım 2026'da yeniden açıldı:
- Pietro Lorenzetti, c.1335–1342 ✓; tempera pano ✓; 187×182 ✓; Siena Opera del Duomo ✓.
- St. Sabinus sunağı ✓; dört sunaklık döngü (Ansanus/Sabinus/Crescentius/Victor, 1330–1350) ✓; Martini/Memmi + Ambrogio + Bulgarini ✓; Maestà taç ✓.
- Triptik tek mekân (olağandışı) ✓; iki beyaz ayak ✓; kaba geometrik perspektif ✓; yıldızlı kubbe ✓.
- Sahneler: Joachim solda, Anna yatakta + bebek yıkama, sağda kadınlar ✓.
- Görsel: tek mekân sürekliliği (yatak/zemin/kubbe), Gotik kemer/madalyon, geometrik zemin, mavi leğen/yeşil sürahi, taban yazıt bandı ✓.
- **Sınır:** yazıt tam transkripsiyonu/yüzler net değil; kakmalı nesne kimliği belirsiz (K1 "perhaps").

**Erişilemeyen birincil hedefler:** Opera del Duomo resmî kataloğu/envanter, De Vecchi & Cerchiari (1999) metni. İnsan editör teyidi gerekli.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı.**

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 412 | 400–500 | 3 dk ✓ |
| Orta | 1313 | 1300–1600 | 10 dk ✓ |
| İleri | 2568 | 2600–3200 | 20 dk ≈ (32 kelime alt; standart §8 tahmini) |

## 5. Görsel doğrulama (Kural 6)

Commons 1275×1300, vision köprüsü (PD; geçici `.qwen/tmp/parti1/Q3873247/`). Tek mekân sürekliliği, Anna/bebek yıkama, Joachim, yıldızlı kubbe, geometrik zemin, yazıt bandı doğrulandı. Yazıt tam okunamıyor; kakmalı nesne belirsiz. Görsel projeye kopyalanmadı.

## 6. İnsan incelemesi gerektiren noktalar

1. Birincil Opera del Duomo kataloğu + envanter teyidi (mevcut B/görsel).
2. De Vecchi & Cerchiari (1999) metin teyidi.
3. Kakmalı nesnenin kimliği (sancak/çalgı) — belirsiz, yorum.
4. "Tek mekân" okuması görsel süreklilikten çıkarım; sanatçı niyeti belgesi yok (B/C).
5. Felsefi yorumlar (İleri §7) kurum dışı; editör onayı şart.
6. data tarih "1342" → c.1335–1342 aralığı önerisi (veri notu, onaya sunulur).

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir.