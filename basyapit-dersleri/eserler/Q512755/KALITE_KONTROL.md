# KALİTE KONTROL — Q512755 · Müsrif Oğulun Dönüşü (The Return of the Prodigal Son) · Rembrandt

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti3/Q512755-brief.md`); ham cache `.qwen/tmp/parti3/Q512755-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q512755 için temiz.
- **Toplam iddia:** 41 (C001–C041). **A=13, B=12, C=4, D=3, E=9.**
- **A düzeyi:** Hermitage birincil yeni format (K1) + eski WPS arşivi (K2): künye/konu/edinim/Room/katalog betimi. Görsel lisans metadata (K6) A.
- **B düzeyi:** enwiki satır içi akademik atıf zinciri (Durham/Sawyer/Rosenberg/Janson/Nouwen) — **kitap metnine erişilmedi**, B "atıf zinciri notlu".
- **C düzeyi:** itwiki atıfsız betim (C026/C027) + GAC atıfsız üslup/anlatı (C028/C029) → "(yorum)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B kanıtlı; 5 AU serbest (C/D/E dahil). Üretimde A/B dışı kanıt yok.
- **E/D işareti:** 3 D "(tartışma)" (C030–C032); 9 E "(belirsiz)" (C033–C041); post-pass ile tüm D/E cümlelerinde belirsizlik işareti mevcut.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak (5/5 ipucu TASLAK önekli).
- **Totoloji yok:** CS yanlış gerekçeleri bağlamsal (≤3 kelime "X değil." kalıbı yok).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (Hermitage yeni format, 200), K2 (Wayback 2024-09-13, 200), K13 (eski WPS canlı, 404), K3/K12 (WD), K4/K5 (en/it wikitext), K6 (Commons metadata), K7 (GAC) 14 Kasım 2026'da açıldı:
- Künye/konu/edinim/Room ✓ (K1/K2): circa 1668, oil on canvas, 262×205, ГЭ-742, 1766 Catherine, New Hermitage Room 254. Eski WPS canlı 404 → arşiv teyidi (Room hariç alanlar aynı).
- WD rank/ref ✓: P571 preferred 1668 (Hermitage ref) / normal 1665 (Janson ISBN 0131828959); P793 sale 1767 (GAC ref).
- en/it/GAC betim ve yorumları ✓; **üç ihtilaf D** (tarih C030, genişlik C031, edinim C032), **dokuz belirsizlik E** (C033–C041).
- **Görsel:** metadata only; vision kotası ana oturumda → İNCELENEMEDİ (C040).

**Erişilemeyen:** K13 (404→K2); K10 (SSL 000→K11, transkript yok); kitap metinleri (K8/K9 yalnız archive.org kaydı, registration) → C039/C041.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12, venv-dogrula): **Q512755 için 0 hata / 0 uyarı.** CJK: **0** (7 dosya tarandı). bolum_eslesme 12 bölüm; durum "İnsan incelemesi bekliyor"; kavram 5, kazanım 5, karşılaştırma 3; CS/DY/GZ/TK kanıt A/B; incelenen_bolgeler=[].
**Not:** dogrula genel toplamı (6 hata / 68 uyarı) tamamen başka eserlerin paralel üretimine aittir (Q2653851/Q3998985/Q7731855 hataları; diğer uyarılar). Q512755 bu sayımlarda sahip değildir; bu dosyalar bu oturumda değiştirilmedi.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 433 | 400–500 | 3 dk |
| Orta | 1420 | 1300–1600 | 10 dk |
| İleri | 3103 | 2600–3200 | 20 dk |

Üç seviye de §8 hedef aralığında; dolgu/tekrar yok (yakın-tekrar ve seviyeler-arası tekrar kontrolleri temiz). İleri düzey gerçekten daha derin: kaynak hiyerarşisi, D1/D3 yöntem analizi, yorumun anatomisi (el/fetus/kör-göz), alımlama tarihi, felsefi çerçeveler (ödünç, etki iddiası yok).

## 5. Görsel doğrulama (Kural 6)

Commons metadata: 22991×30000 px (~250 MiB), **Public domain (pd)**; WD P6216=Q19652. **Görsel İNCELENEMEDİ (C040 E)** — vision kotası ana oturumda. Kompozisyon K1/K2 (A) + K4/K5/K7 (B/C) **metninden** ("kaynakların betimlediği"). **GZ TASLAK.** Görsel projeye kopyalanmadı; URL+lisans+referans. **İnsan editör görsel teyidi ZORUNLU** (özellikle iki-el farkı C016/C034, fetus baş C035, kör gözler C036).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C040, E):** incelenemedi; GZ TASLAK; insan editör zorunlu.
2. **Tarih (D1, C030):** circa 1668 ↔ 1663–1665 ↔ 1661–1669 ↔ 1668 ↔ WD 1665/1668 ↔ data ~1665; birincil esas, circa korunur.
3. **Genişlik (D2, C031):** 205 ↔ it 206; it olası hata.
4. **Edinim (D3, C032):** 1766 Hermitage girişi ↔ 1767 Paris (GAC/WD); uzlaştırma belgesiz.
5. **Bozuk donor (C038, E):** "Duke d'Ancesuine" yalnız GAC; arşiv belgesi gerekli.
6. **Anne varsayımı (C033, E):** "likely the mother", önceki desenlere dayalı varsayım.
7. **El/fetus/kör-göz (C034/C035/C036, E):** atıfsız/hedge'li yorumlar; görsel teyit + akademik atıf gerekli.
8. **en "1868" typo (C037, E):** short-desc güvenilmez; gövde/infobox 1660s.
9. **Literatür (C039, E):** Durham/Janson/Nouwen/Sawyer/Rosenberg metinleri erişilmedi; alıntılar enwiki'den birebir.
10. **Belgesel (C041, E):** Jan Blanc (canal-educatif) SSL 000; Wayback var, transkript yok.
11. **Veri boşlukları:** muze_numaralari + kunye Q512755 yok; data tarih ~1665 (D1); data "iflas/ailevi kayıplar" + "atölye katkısı" kaynak teyitsiz (derse taşınmadı).
12. **Felsefi yorumlar (İleri §7):** Kant/Benjamin/Panofsky ödünç çerçeveler; etki iddiası yok; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + kelime + CJK + quiz A/B). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil Hermitage AÇILDI (A); görsel İNCELENEMEDİ (E); kitap metinleri erişilmedi (B atıf zinciri); insan editör görsel teyidi + literatür erişimi kritiktir.**
