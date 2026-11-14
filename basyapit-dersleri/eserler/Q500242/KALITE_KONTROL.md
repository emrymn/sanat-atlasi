# KALİTE KONTROL — Q500242 · Âdem'in Yaratılışı (Creazione di Adamo) · Michelangelo

**Tarih:** 14 Kasım 2026 · **Parti:** 2 (M5) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti2/Q500242-brief.md`); ana oturum dersleri yazdı.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 28 (C001–C028). A=5, B=8, C=9, D=4, E=2.
- **A düzeyi:** Vatikan katalog (konu/yer/ikonografi) + arşiv scheda/volta + BM eskiz. Birincilde tarih/boyut/sanatçı/envanter YOK → bu alanlar B/C (C002).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU (C/D/E dahil). Üretimde 6 C/D-kanıt hatası düzeltildi (CS09/CS10/DY05/GZ03/TK01/TK03/TK04/TK05 → A/B).
- **E/D işareti:** C012/C024/C025/C026 "(tartışma)"; C027/C028 "(belirsiz)"; temiz.
- **Hipotezler C:** beyin/rahim/kaburga/cameo (C013–C016) olgu değil yorum; quiz doğru cevabı olarak kullanılmadı.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak.
- **Vasari alıntısı:** itwiki bakım etiketli/şüpheli → KULLANILMADI (C028).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (Vatikan de, 200), K2/K3 (arşiv 2003/2017), K6 (BM arşiv 2020), K4/K5 (en/it wikitext), K7 (WD), K8 (Commons metadata) 14 Kasım 2026'da açıldı:
- Konu Genesis 1:26–27; yer Sistina volta; ikonografi süzülen Tanrı/dinlenen atlet ✓ (K1/K2).
- Dokuz sahne 4. ✓ (K3/K4). BM eskiz 1926,1009.1 c.1511 kırmızı tebeşir 193×259 ✓ (K6).
- Boyut 280×570; tavan 1508–12; II. Julius + 12 Havari→şema; Âdem inert; parmak gap; göz rialzando; hipotezler ✓ (K4/K5).
- **Dört ihtilaf D:** tarih (C024), parmak (C025), sayım (C026), Tanrı figürü (C012).
- **Görsel:** metadata only; vision bütçesi tükendi → İNCELENEMEDİ (C027); P18 perspektif türevi.

**Erişilemeyen:** canlı mv.vatican.va (000), canlı BM (403); refs monografi/makale metinleri (C028).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata; 1 uyarı (İleri kelime 2485, hedef 2600–3200, ~%4,4 alt — §8 tahmini, dolgu yok).** CJK: 0 (üretimde CJKCJK karışması yakalanıp düzeltildi).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 411 | 400–500 | 3 dk (aralık içinde) |
| Orta | 1300 | 1300–1600 | 10 dk (aralık içinde) |
| İleri | 2485 | 2600–3200 | 20 dk (~%4,4 alt; §8 tahmini) |

## 5. Görsel doğrulama (Kural 6)

Commons metadata; **vision bütçesi tükendi → İNCELENEMEDİ (C027 E).** P18 perspektif düzeltmeli TÜREV ("laser mapping olmadan doğru reproduksiyon imkânsız"). Kompozisyon K1/K2 (A) + K4/K5 (B) METNİNDEN. **GZ TASLAK.** Görsel PD. Görsel projeye kopyalanmadı. **İnsan editör görsel teyidi ZORUNLU.**

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C027, E):** incelenemedi; P18 türev; GZ TASLAK; insan editör zorunlu.
2. **Dört ihtilaf (D):** tarih (C024), parmak (C025), sayım (C026), Tanrı figürü (C012).
3. **Hipotezler (C):** beyin/rahim/kaburga/cameo — olgu değil; editör onayı.
4. **Birincil sınır (C002):** tarih/boyut/sanatçı birincilde yok; B/C.
5. **Literatür (C028, E):** refs metinleri erişilmedi; Vasari alıntısı şüpheli.
6. Felsefi yorumlar (İleri §7: Aristoteles/Kant/Hegel/Benjamin ödünç) kurum dışı; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil Vatikan + arşivler AÇILDI (A); görsel İNCELENEMEDİ (E); dört ihtilaf + dört hipotez açık; insan editör teyidi kritiktir.**
