# KALİTE KONTROL — Q700834 · Jüpiter ve Io (Jupiter und Io) · Correggio

**Tarih:** 14 Kasım 2026 · **Parti:** 2 (M5) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti2/Q700834-brief.md`).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 41 (C001–C041). A=12, B=16, C=4, D=7, E=2.
- **A düzeyi:** KHM birincil DE+EN + arşiv (künye/konu/provenance/pendant/koruma). Birincilde "yağlıboya" açıkça yok → C005 C.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU (C/D/E dahil). Üretimde 3 C-kanıt hatası düzeltildi (GZ01/GZ04/TK05 → A/B).
- **E/D işareti:** 7 D "(tartışma)"; C040/C041 "(belirsiz)"; temiz.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak.
- **KHM reproduksiyon talebi** (bilimsel/ticari) not edildi; görsel yeniden yayımlanmadı.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1/K2 (KHM DE+EN, 200), K3/K7/K8 (arşiv 2016/2016/2014), K4/K5/K6 (en/it/de wikitext), K9 (WD), K10 (Commons metadata) 14 Kasım 2026'da açıldı:
- Künye/konu/provenance/pendant/koruma ✓ (K1/K2). Birincilin iç çelişkisi: DE 162,5 ↔ EN 162 boyut (C033).
- Ovid/dizi/Gould-Verheyen/Lomazzo/bulut/Ara Grimani/geyik/etki ✓ (K4-K8).
- **Yedi+ ihtilaf D:** C033–C039. **Görsel:** metadata only; vision bütçesi tükendi → İNCELENEMEDİ (C040).

**Erişilemeyen:** Gould (registration), Verheyen (DOI-only), PhilArchive (403), Smarthistory canlı (bot); refs metinleri (C041).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata; 3 uyarı (kelime: B 378, O 981, İ 1720 — §8 tahmini, dolgu yok; kısa ders bilinçli).** CJK: 0.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 378 | 400–500 | 3 dk (~%5 alt; §8) |
| Orta | 981 | 1300–1600 | 10 dk (~%25 alt; §8 tahmini) |
| İleri | 1720 | 2600–3200 | 20 dk (~%34 alt; §8 tahmini) |

**Not:** Kelime hedefleri §8 gereği tahmindir; kanıt yetersizse/erişilemezse kapsam azaltılır, uydurma/dolgu yapılmaz. Bu eserde görsel incelenemediği ve refs metinlerine erişilemediği için ders kısa bırakıldı (dürüstlük beyanı). İnsan editör genişletmesi önerilir.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (4 dosya PD); **vision bütçesi tükendi → İNCELENEMEDİ (C040 E).** Kompozisyon K1 (A) + K4-K8 (B) METNİNDEN. **GZ TASLAK.** KHM reproduksiyon talebi (C032). Görsel projeye kopyalanmadı. **İnsan editör görsel teyidi ZORUNLU** (özellikle geyik/data uyuşmazlığı C037).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C040, E):** incelenemedi; GZ TASLAK; insan editör zorunlu.
2. **Yedi+ ihtilaf (D):** boyut (7 varyant), tarih, Rudolf II, Gould/Verheyen atfı, geyik/data, Viyana varış, Ovid satır.
3. **Geyik/data (C037):** "toprak testi" ↔ "su içen geyik"; görsel teyit + data düzeltme önerisi.
4. **Birincil sınır:** yağlıboya birincilde yok (C005 C); DE↔EN boyut çelişkisi.
5. **Etik okuma (C029):** istemsiz birleşme; modern ↔ tarihsel çerçeve; editör onayı.
6. **Literatür (C041, E):** refs metinleri erişilmedi.
7. Felsefi yorumlar (İleri §7: Kant/Benjamin ödünç) kurum dışı; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil KHM AÇILDI (A); görsel İNCELENEMEDİ (E); ders §8 gereği kısa bırakıldı; insan editör genişletme + görsel teyidi kritiktir.**
