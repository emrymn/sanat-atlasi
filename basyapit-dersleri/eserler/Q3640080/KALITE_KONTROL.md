# KALİTE KONTROL — Q3640080 · Mavi Koltukta Küçük Kız (Little Girl in a Blue Armchair) · Mary Cassatt

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti5/Q3640080-brief.md`).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 52 (C001–C052). A=13, B=21, C=2, D=10, E=6.
- **A düzeyi:** NGA birincil katalog (Wayback 2026-11-03, tam metin) + AAA Vollard mektubu kaydı (Wayback 2014-01-09). Künye/provenance/sergi/inscriptions/Visual Description + mektup katalog kaydı.
- **B düzeyi:** en/it wikitext, Smarthistory, ARTnews, Cassatt maddesi (Weinberg/Met atıfı) — satır içi akademik atıf zinciriyle; kitap/makale metinlerine erişilmedi (C040).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU (C/D/E dahil). Üretimde A/B-dışı kanıt yok (izole doğrulama teyit etti).
- **E/D işareti:** 10 D "(tartışma)"; 6 E "(belirsiz)"; post-pass ile etiket sonrasına standardize edildi; temiz.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak (5/5 TASLAK).
- **Yorumlar:** C044/C045 "(yorum)" işaretli; felsefi çerçeve (Pollock/Chessman/Benjamin) ödünç, etki iddiası değil.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Ham cache tam metinleri bu oturumda bağımsız yeniden okundu ve iddialarla çapraz doğrulandı (canlı NGA/AAA 403 olduğundan erişilen kaynak = arşiv tam metni):
- **S5 NGA Wayback 2026-11-03 (.txt):** künye (1878, oil on canvas, 89.5×129.8, 1983.1.18, Mellon), provenance (Vollard→Brame→Mellon Nov 1963→gift 1983), Exhibition History (1879 Possibly…no.47 + 1912–2018), Inscriptions (sol alt imza + şasi "M. Vollard / 6 Rue Lafitte"), Visual Description + Look Closer 1–5, "Not on view", Open Access ✓.
- **S7 AAA Wayback 2014-01-09 (.txt):** ca. 1903, Fransızca, el yazısı 18×27 cm, Degas + mavi koltukta küçük kız, Mary Cassatt letters 1892-1925, U.S. public domain, Digital ID 14775, Vollard (1867-1939) ✓.
- **S2 en wikitext:** Vollard mektubu alıntısı (Bullard 1972 s.24 / Mathews 1994 s.125–6), 1877 Salon redleri, 1879 "likely", Dünya Fuarı reddi, Bullard/Barter/Pollock/Greer/Chessman yorumları, köpek "probably" ✓. **S3 it wikitext:** Salon reddi atıfsız (E) ✓. **S11 Cassatt:** "only American officially associated" + Weinberg/Met ✓.
- **S9 Smarthistory / S10 ARTnews (.txt):** L'Absinthe diyagonalleri, nursery/drawing room, Correggio, Havemeyer, Degas müdahalesi IR, tempera/metalik/s-curve, 1877 Montmartre tanışma ✓.
- **S1 WD / S8 Commons imageinfo:** P571 precision=9, P186 oil+canvas (NGA ref), P217 1983.1.18, P6216 PD, P6108 IIIF; dosya 22206×14876 PD ✓.
- **On ihtilaf D (C029–C038) + altı E (C027, C039–C043)** açıkça beyan; hedge'ler (probably/likely/Possibly/ca./perhaps) aynen korundu.

**Erişilemeyen:** canlı NGA (S4) + canlı AAA (S6) 403; kitap/makale metinleri (C040); mektup özgün Fransızcası (C041). **Görsel:** metadata-only, İNCELENEMEDİ (C039).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12), **Q3640080 izole: 0 hata / 0 uyarı.** CJK: 0 (tüm çıktılar). 12 bölüm eşlemesi tam; durum "İnsan incelemesi bekliyor".
**Not:** Genel dogrula çıktısındaki 6 hata / 110 uyarı, eşzamanlı parti üretimindeki DİĞER eserlerin eksik dosya/kelime bulgularıdır (Q3224275/Q328523/Q5826309 vb.); Q3640080'a ait değildir.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 471 | 400–500 | 3 dk |
| Orta | 1314 | 1300–1600 | 10 dk |
| İleri | 2679 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok (yakın tekrar + seviyeler arası tekrar kontrolleri temiz). İleri, Orta'dan gerçekten daha derin: kaynak eleştirisi, yorum ekolleri, provenance/mektup belgesel analizi, feminist çerçeve, metodoloji.

## 5. Görsel doğrulama (Kural 6)

Commons imageinfo: `File:Cassat - Blue Armchair NGA.jpg`, 22206×14876 px (~139 MiB), **Public domain** (PD-Art/PD-old-95-expired; NGA Open Access). **Görsel bu oturumda İNCELENEMEDİ (vision kotası ana oturumda) → C039 E.** Kompozisyon NGA Visual Description (A) + Smarthistory/ARTnews (B) METNİNDEN; "kaynakların betimlediği" ibaresi kullanıldı. **GZ TASLAK (5/5).** Görsel projeye kopyalanmadı; URL+lisans+IIIF referans. **İnsan editör görsel teyidi ZORUNLU** (özellikle D4 zemin / D5 pencere / D6 köpek / D10 kuşak).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C039, E):** incelenemedi; GZ TASLAK; insan editör zorunlu.
2. **On ihtilaf (D):** 1879 kesinliği, red yeri, genişlik, zemin rengi, pencere sayısı, köpek rengi, köpek kimliği, Vollard doğum yılı, Degas müdahalesi yeri/kesinliği, kuşak renkleri.
3. **Data uyuşmazlıkları:** zemin "gri"↔"peanut-brown" (C032); köpek "kahverengi"↔"siyah tüy/pas kahvesi yüz" (C034); kuşak renkleri (C038) — görsel teyit + data düzeltme önerisi (data değiştirilmedi).
4. **Mevcut data bayrağı:** ders_kaynaklari.json "siyah ayakkabı: tersini gösteriyor" (yanlis) ↔ NGA "black shoes with silver buckles" (C005); insan incelemesine sunulur.
5. **Birincil sınır:** canlı NGA/AAA 403 (arşivden erişildi); mektup transkripsiyonu + özgün Fransızca erişilmedi (C041); kitap/makale metinleri erişilmedi (C040).
6. **Model adı (C042, E):** hiçbir kaynakta yok; quiz doğru cevabı buna dayanmaz.
7. **Felsefi yorumlar (İleri §7):** Pollock/Chessman/Benjamin ödünç çerçeve; kurum dışı; editör onayı.
8. **Pollock sayfa anomalisi (C043, E):** sfn p=2129 doğrulanamadı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz + quiz A/B + 12 bölüm + kelime + CJK). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil NGA + AAA arşivden AÇILDI (A); görsel İNCELENEMEDİ (E); on ihtilaf + data uyuşmazlıkları için insan editör görsel teyidi kritiktir.**
