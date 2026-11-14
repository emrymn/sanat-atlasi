# KALİTE KONTROL — Q2067212 · Ağıt (Ölü İsa İçin Yas) · Giotto

**Tarih:** 14 Kasım 2026 · **Parti:** 1 (M1) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 30 (C001–C030). A=7 (kurumsal birincil + doğrudan görsel), B=20, D=2, E=1.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU. D/E kanıt yok.
- **Kaynak zinciri:** K1 Padova Belediyesi resmî sayfası (kurumsal birincil) + K2 itwiki (B, Tazartes/Baccheschi/Argan atıflı) + K3 enwiki (B) + K4 WD + K5 Commons (A).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (padovanet ham HTML), K2 (itwiki REST), K3 (enwiki REST), K4 (WD), K5 (Commons 1400px) 14 Kasım 2026'da yeniden açıldı:
- Şapel Musei Civici kompleksinin parçası ✓ (K1); in situ, sol duvar orta-alt register ✓ (K2).
- 200×185 ✓ (K2/K4); c.1303–1305 / c.1305 / 1304–1306 ✓; 1305 kutsama ✓ (K3).
- Meryem başta / Magdalene ayaklarda / Yuhanna açık kollar / Nikodemus+Yusuf sağda ✓ (K3 + görsel).
- Kaya diyagonali + duygusal merkez ✓ (K2 + görsel); sırtı dönük iki figür ✓ (K2 + görsel).
- ~On yas meleği, kuru ağaç, bordür, çatlaklar ✓ (görsel); yazıt yok ✓.
- Meleagro lahiti + Assisi atfı "forse" → D işaretli ✓; otograflık K2 değerlendirmesi → B ✓.
- **Sınır:** melek sayısı yaklaşık; eser-özel birincil katalog yok (E); bibliyografya erişilmedi.

**Erişilemeyen/erişilmeyen:** eser-özel birincil föy/envanter (Şapel resmî katalog); Tazartes 2004, Baccheschi 1977, Argan metni. İnsan editör teyidi gerekli.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı.**

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 420 | 400–500 | 3 dk ✓ |
| Orta | 1307 | 1300–1600 | 10 dk ✓ |
| İleri | 2565 | 2600–3200 | 20 dk ≈ (35 kelime alt; standart §8 tahmini) |

## 5. Görsel doğrulama (Kural 6)

Commons 1400px (kaynak 1920×1806) tam kare vision köprüsü (PD; geçici `.qwen/tmp/parti1/Q2067212/`). Kompozisyon (diyagonal, figürler, melekler, ağaç, bordür) doğrulandı. Görsel projeye kopyalanmadı. Üretim sırasında iki içerik hatası yakalanıp düzeltildi: kaynak dışı Dante/Reginaldo cümlesi kaldırıldı; "Son Yargı" register iddiası kaynakla değiştirildi; "Bizyas" yazım hatası düzeltildi.

## 6. İnsan incelemesi gerektiren noktalar

1. Eser-özel birincil katalog/envanter (boyut/tarih teyidi; C030 E).
2. Meleagro lahiti aktarımı ve Assisi atfı (D) — uzman editör.
3. Otograflık iddiası (K2 B) — giornata/teknik analiz teyidi.
4. Tazartes/Baccheschi/Argan bibliyografya metinleri.
5. Felsefi yorumlar (İleri §7: compassio, pathosformel, acının temsili) kurum dışı; editör onayı şart.
6. data tarih "1305" → aralık önerisi; müze alanı önerisi KANIT §5'te; data/ dokunulmadı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir.