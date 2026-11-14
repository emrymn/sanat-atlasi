# KALİTE KONTROL — Q1755464 · Şövalye, Ölüm ve Şeytan (Knight, Death and the Devil) · Albrecht Dürer

**Tarih:** 14 Kasım 2026 · **Parti:** 1 (M4) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 0. PARTİ 1 DÜZELTME NOTU (14 Kasım 2026 — PARTI_1_CLAUDE_DENETIM)

Bu dosya Claude bağımsız denetimi sonrası revize edildi; aşağıdaki §1–§7'deki eski sayı/atıflar bu notla güncellenir.
- **K-1 düzeltildi:** yanlış Met nesnesi `search/336420` ("A Death Scene", anonim 17. yy İspanyol çizimi, 80.3.507) → doğru `objects/336223` (43.106.2) Met Collection API ile açıldı (200). Levha 24.3×18.8, kâğıt 25×19.6, 1513, engraving → **C003 A**. "Birincil katalog erişimi yok / A yalnız lisans" ifadeleri kaldırıldı; Met web sayfası hâlâ 429 (C021 E).
- **Karşıt okumalar eklendi (C025 B):** Thausing (dört mizaç/sanguineus), Karling 1970 + Ursula Meyer (Raubritter, tilki kuyruğu), Getlein (obsolescence) — enwiki satır içi kaynaklı. C020 anlam tartışması alımlamadan (Nietzsche/Nazi) ayrıldı.
- **Nietzsche GT §20 birincil metin (K5, Gutenberg #7206):** şövalye = Schopenhauer'un umutsuz ama hakikat arayan tutumu → **C026 A**. "S" anlamı D (C024: Salus ↔ sanguineus).
- **S-4:** İleri yakın-kopya paragraflar kaldırıldı. **Quiz:** CS07 "Panofsky'ye göre" atfı; CS09/CS10 karşıt okuma; DY03 olgusal bakış; totolojik gerekçeler gerçek gerekçeye çevrildi; GZ taslak (görsel incelenemedi).
- **Güncel:** 26 iddia (A3/B16/C3/D2/E2), 5 kaynak. Kelime 447/1071/1992 (Orta/İleri hedef altı — dolgu kaldırıldı, §8 bilinçli kısa ders). dogrula 0 hata; CJK 0. Durum "İnsan incelemesi bekliyor".

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 23 (C001–C023). A=1 (yalnız lisans), B=17, C=2, D=1, E=2.
- **Quiz:** 8 CS + 5 DY + 5 GZ + 5 TK yalnız A/B (bu eserde B); 5 AU (C/D/E dahil). D/E kanıt yok (TK04'teki C018 C kanıttan çıkarıldı). Anlam tartışması (C020, D) yalnız AU'da.
- **Kaynak zinciri:** K1 enwiki (B, ana kaynak) + K2 WD (yardımcı) + K3 Commons NGA (incelenemedi) + K4 Met (429, açılamadı).
- **E/D işareti:** C021/C022 (E) "(belirsiz)"; C020 (D) "(tartışma)" ile işaretli; dogrula belirsizlik denetimi temiz.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (enwiki REST), K2 (WD), K3 (Commons 1200px) 14 Kasım 2026'da açıldı; K4 (Met) 429:
- Knight, Death and the Devil (Ritter, Tod und Teufel); Dürer; 1513; engraving; German Renaissance; 24.3×18.8; three Meisterstiche; tablet "S. (Salus) 1513" ✓ (K1/K2).
- Zırhlı şövalye + at + köpek; keçi başlı şeytan + soluk atta Ölüm (kum saati); dosdoğru bakış; tepedeki şehir ✓ (K1).
- Üç Meisterstiche (Knight/St Jerome/Melencolia I, aynı boy, ortak semboller); Gotik + Rönesans (Leonardo at); Vasari övgüsü ✓ (K1).
- Erasmus Enchiridion; Ephesians 6/Psalm 23; Panofsky üç düşman + köpek sadakat; Maximilian (sipariş değil) ✓ (K1).
- Nietzsche Birth of Tragedy 1872 pesimizm; Nazi sahiplenmesi; çok nüsha ✓ (K1).
- Anlam tartışması (Hristiyan asker/hümanist/Nietzsche/Nazi) → D ✓ (K1).
- **Sınır:** **Met birincil katalog 429 AÇILAMADI (C021 E)** → A düzeyi yalnız lisans; vision bütçesi tükendi → K3 İNCELENEMEDİ (C022 E); kompozisyon enwiki (B) METNİNDEN. Çok nüshalı gravür; boyut wiki 24.3×18.8 ↔ WD 24.8×19.

**Erişilemeyen/erişilmeyen:** K4 Met katalog (429); K1 refs (Panofsky; Stites; Lunday; Vasari). İnsan editör teyidi ZORUNLU.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı.** CJK taraması: 0. (Üretimde TK04 C-kanıt hatası yakalanıp düzeltildi.)

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 413 | 400–500 | 3 dk ≈ (aralık içinde) |
| Orta | 1365 | 1300–1600 | 10 dk ≈ (aralık içinde) |
| İleri | 2953 | 2600–3200 | 20 dk ≈ (aralık içinde) |

## 5. Görsel doğrulama (Kural 6)

Commons NGA 1200px indirildi; **vision bütçesi tükendi → incelenemedi** (C022 E). Kompozisyon/ikonografi enwiki (B) metninden doğrulandı; data betimi kullanılmadı. **Birincil Met katalog açılamadı (429, C021 E).** Görsel A iddiası yalnız lisans (C023). İnsan editör görsel + birincil katalog teyidi ZORUNLU. Görsel projeye kopyalanmadı.

## 6. İnsan incelemesi gerektiren noktalar

1. **Birincil katalog (C021, E):** Met 429 açılamadı; çok nüshalı gravür; insan editör resmî katalog teyidi ZORUNLU (bu eserde A düzeyi yalnız lisans).
2. **Görsel teyit (C022, E):** bu oturumda yapılamadı; insan editör zorunlu.
3. **Anlam tartışması (C020, D):** Hristiyan asker ↔ hümanist ↔ Nietzsche pesimizm ↔ Nazi sahiplenmesi — uzman editör.
4. Nazi sahiplenmesi — politik/etik hassasiyet; küratöryel sunumda dikkatle ele alınmalı; özgün bağlamdan kopuk okuma.
5. Felsefi yorumlar (İleri §7: cesaret/ölümlülük, inancın direnci, anlamın değişkenliği) kurum dışı; editör onayı şart.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Bu eserde birincil katalog erişimi yoktur; gravür çok nüshalıdır; anlam tartışmaları yoğundur; insan editör teyidi özellikle kritiktir.**
