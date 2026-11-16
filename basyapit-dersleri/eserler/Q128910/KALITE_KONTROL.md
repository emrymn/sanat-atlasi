# KALİTE KONTROL — Q128910 · Son Akşam Yemeği (Il Cenacolo) · Leonardo da Vinci

**Tarih:** 14 Kasım 2026 · **Parti:** 2 (M5) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 22 (C001–C022). A=3, B=12, C=3, D=2, E=2.
- **A düzeyi:** Cenacolo kurumsal (müze/Brera/koruma) + görsel lisans (C020). In situ duvar olduğundan teknik/boyut/tarih B (enwiki atıflı).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU (C/D/E dahil). Üretimde 1 C-kanıt hatası düzeltildi (TK02→C009/C010). KANIT Sayım B=12 eşitlendi.
- **E/D işareti:** C014/C015 "(tartışma)"; C019/C021 "(belirsiz)"; temiz.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak.
- **Yakın-tekrar:** üretimde bir yinelenen paragraf yakalanıp kaldırıldı (difflib 0.80); yerine özgün içerik (palimpsest/stratigrafi) eklendi.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (Cenacolo resmî site ham HTML), K2 (enwiki wikitext), K3 (WD), K4 (Commons metadata) 14 Kasım 2026'da açıldı:
- Kurumsal: Museo del Cenacolo Vinciano; Brera yönetimi (Dec 2024); hava işleme + kontrollü erişim + rezervasyon ✓ (K1).
- enwiki: mural; c.1495–98; tempera on gesso/pitch/mastic (not fresco); 460×880; Sforza mozole; Montorfano karşı duvar; 1497 nearly complete; prior/Judas anekdotu; Lomazzo/Zenale; ihanet anı (John); apostol sırası; restorasyon 1999; largest work ✓ (K2).
- **İki ihtilaf D:** boyut WD 700×880 ↔ enwiki 460×880 (C014); teknik WD "fresco" ↔ tempera-on-plaster (C015).
- **Veri hatası:** data tarih "1490" ↔ c.1495–98 (C022).
- **Görsel:** metadata only; vision bütçesi tükendi → İNCELENEMEDİ (C019).

**Erişilemeyen/erişilmeyen:** K2 refs (King/Clark/Wallace/Hartt/Frommel/Durant/Smart History) metinleri (C021); K1 derin teknik katalog.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata; 1 uyarı (İleri kelime 2476, hedef 2600–3200, ~%4,8 alt — §8 tahmini, dolgu yok).** CJK: 0 (üretimde CJKCJK karışması yakalanıp düzeltildi).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 411 | 400–500 | 3 dk (aralık içinde) |
| Orta | 1300 | 1300–1600 | 10 dk (aralık içinde) |
| İleri | 2476 | 2600–3200 | 20 dk (~%4,8 alt; §8 tahmini) |

## 5. Görsel doğrulama (Kural 6)

Commons metadata alındı; **vision bütçesi tükendi → İNCELENEMEDİ (C019 E).** Kompozisyon enwiki (B) METNİNDEN (apostol sırası, perspektif). **GZ TASLAK.** Görsel A yalnız lisans (C020). Görsel projeye kopyalanmadı. **İnsan editör görsel teyidi ZORUNLU** (özellikle yüzey/restorasyon izleri).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C019, E):** incelenemedi; GZ TASLAK; insan editör zorunlu.
2. **Boyut (C014, D):** 460×880 ↔ 700×880.
3. **Teknik (C015, D):** "fresk" yanılgısı; tempera-on-plaster.
4. **Tarih (C022):** data 1490 → y.1495–98 önerisi.
5. **Orijinal/restorasyon (C018, C):** palimpsest; 1999 yüzey bir yorum.
6. **Literatür (C021, E):** refs metinleri erişilmedi.
7. Felsefi yorumlar (İleri §7: Kant/Benjamin/Hegel ödünç) kurum dışı; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **In situ mural: birincil kurumsal kaynak AÇILDI (A) ama teknik/boyut ikincil (B); görsel İNCELENEMEDİ (E); veri hataları (1490/fresk/700) düzeltme önerisiyle raporlandı; insan editör teyidi kritiktir.**
