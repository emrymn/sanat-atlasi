# KALİTE KONTROL — hogarth · Cin Sokağı (Gin Lane) · William Hogarth

**Eser anahtarı:** `william-hogarth|Gin Lane` (bileşik; QID yok) · **Dizin:** `hogarth`
**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Üretim notu:** Yazım agent'ı içerik filtresine takıldı (sosyal hiciv/infanticide konusu); KANIT + 3 ders agent'tan, DERS.json/SORULAR.json (uret-hogarth.py) + KALITE + İleri genişletmesi ana oturumda tamamlandı.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 55 (C001–C055). A=16, B=15, C=9, D=6, E=9.
- **A düzeyi:** NGA/MET/RA birincil katalogları (Wayback) + OBO tarihsel belge + IIIF UUID nüsha teyidi.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU serbest. GZ 5/5 TASLAK.
- **D işareti:** C040–C045 "(tartışma)"; **E işareti:** C046–C054 "(belirsiz)"; C'ler "(yorum)". Temiz.
- **Konu hassasiyeti:** infanticide/alkolizm/yoksulluk akademik ve açık ayrıntısız; şiddet/ölüm detayı büyütülmedi.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

NGA/MET/RA canlı 403/429 → Wayback (2025-04-07 / 2026-02-17 / 2025-11-03 / 2025-09-28) + OBO (2017-12-01 v7.2 tam metin) + Warner 2001 PMC yeniden açıldı:
- Künye/tarih/teknik/nüsha/state/dizeler/levhalar/mekân/Gin Royal yazıtı/Defour davası ✓.
- **Altı ihtilaf D:** state sayımı (C040), broşür başlığı (C041), Gin Act başarısı (C042), kompozit görsel tarihi (C043), slayt≠nüsha (C044), Four Stages zamanlaması (C045).
- **Görsel:** NGA IIIF 3544×4247 PD + Commons NGA 3338×4000 CC0; metadata + IIIF UUID teyidi; vision bütçesi tükendi → İNCELENEMEDİ (C046).
- **Birincil sınır:** BM Gin Lane katalog URL bulunamadı (C047); WD V&A "imported" zayıf (C048); NGA boyut alanı yok (C051).

**Erişilemeyen:** NGA/MET/RA/OBO canlı (arşivle çözüldü); kitap metinleri (Paulson, Uglow, Dillon, George, Clerk, Hallett & Riding, Bindman, Hogarth 1833, Lamb, Hazlitt) — C049; Warner 2001 istisna (PMC özeti).

## 3. Şema ve biçim

`dogrula.py`: **0 hata**; 5 uyarı (heuristic kısaltma-bölünmesi yanlış-pozitifi: "Gin Craze", "Price 1 s.", "1759 3.", "24 Geo.", "1825 Baker"; tam cümleler [C###] etiketli). CJK: 0. Kelime B 431 / O 1339 / İ 2612 (tümü aralıkta; İleri ana oturumda gerçek içerikle genişletildi, dolgu yok).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 431 | 400–500 | 3 dk |
| Orta | 1339 | 1300–1600 | 10 dk |
| İleri | 2612 | 2600–3200 | 20 dk |

## 5. Görsel doğrulama (Kural 6)

NGA IIIF + Commons metadata; **vision bütçesi tükendi → İNCELENEMEDİ (C046 E).** Kompozisyon RA (A) + enwiki (B) METNİNDEN. **GZ TASLAK.** Görsel PD/CC0. Görsel projeye kopyalanmadı. **Slayt görseli Davenport kopyası (c.1806–09/reprint c.1880), gösterilen NGA orijinali değil (C044 D).** **İnsan editör görsel teyidi ZORUNLU.**

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C046, E):** incelenemedi; GZ TASLAK; insan editör zorunlu.
2. **Slayt ≠ nüsha (C044, D):** Davenport kopyası ↔ NGA orijinali; düzeltilmeli.
3. **Altı ihtilaf (D):** state sayımı, broşür başlığı, Gin Act başarısı, kompozit tarihi, slayt, Four Stages.
4. **BM URL (C047, E) + WD V&A (C048, E):** doğrulanmadı; data NGA alanı doğru, korunmalı.
5. **data tabela metinleri (C052, E):** "kral heykeli"/"S. Gripe"/"Kilman Distiller" doğrulanmadı.
6. **Künye/numara eksik:** kunye.json + muze_numaralari.json'da hogarth kaydı yok; 1944.5.87 eklenmeli.
7. Felsefi yorumlar (İleri §7: Kant/Benjamin ödünç) kurum dışı; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + alt-agent tarafından yapıldı (agent içerik filtresine takıldığı için ana oturum tamamladı); haricî model/insan editör denetimi ayrıca gereklidir. **Görsel + slayt/nüsha teyidi kritiktir.**