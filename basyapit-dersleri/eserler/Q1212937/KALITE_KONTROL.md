# KALİTE KONTROL — Q1212937 · Elçiler (The Ambassadors) · Hans Holbein (genç)

**Tarih:** 14 Kasım 2026 · **Parti:** 2 (M4) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 33 (C001–C033). A=12, B=12, C=2, D=5, E=2.
- **A düzeyi:** NG birincil (künye/malzeme oak/sitter/bağlam/imza/nesne/provenance/çerçeve) + görsel lisans (C032).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU (C/D/E dahil). Üretimde 1 C-kanıt hatası yakalanıp düzeltildi (TK04→C006). KANIT Sayım B=12 eşitlendi.
- **E/D işareti:** C023–C027 "(tartışma)"; C030/C031 "(belirsiz)" cümle içinde; temiz.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (NG ham HTML), K2 (enwiki wikitext), K3 (WD), K4 (Commons) 14 Kasım 2026'da yeniden açıldı:
- Künye: 1533; oil on Baltic/Polish oak; 207×209,5; NG1314; Room 4; Bought 1890 ✓ (K1).
- Sitter/bağlam/imza/nesne/kafatası/haç/provenance/çerçeve ✓ (K1).
- enwiki: enstrümanlar (Dekker&Lippincott), Cosmati/Ives, discord↔harmony (Gardner/Bertoglio), Walter 1524 ilahi, kafatası yan↔optik (Samuel/Foister/Sharp), 1997 restorasyon (Wylde/Sharp), sitter Colvin/Hervey/Hudson, küre Schöner/Hartmann + Rome/12 July/Good Friday/11 May ✓ (K2).
- **Beş ihtilaf D:** C023–C027. **Görsel:** indirildi (30000px) ama vision bütçesi tükendi → İNCELENEMEDİ (C030).

**Erişilemeyen/erişilmeyen:** K2 refs monografi/makale metinleri (C031).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata; 1 uyarı (İleri kelime 2551, hedef 2600–3200, ~%1,9 alt — §8 tahmini, dolgu yok).** CJK: 0.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 405 | 400–500 | 3 dk (aralık içinde) |
| Orta | 1311 | 1300–1600 | 10 dk (aralık içinde) |
| İleri | 2551 | 2600–3200 | 20 dk (~%1,9 alt; §8 tahmini) |

## 5. Görsel doğrulama (Kural 6)

Commons Google Art Project özgün 30000×29560 indirildi; **vision bütçesi tükendi → İNCELENEMEDİ (C030 E).** Kompozisyon NG (A) + enwiki (B) METNİNDEN. **GZ TASLAK.** Görsel A yalnız lisans (C032). Büyük dosya geçici .qwen/tmp/parti2/img/ (teslimata girmez). **İnsan editör görsel teyidi ZORUNLU** (özellikle anamorfik kafatası + nesne ayrıntıları).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C030, E):** incelenemedi; GZ TASLAK; insan editör zorunlu.
2. **Beş ihtilaf (D):** sağ sitter (C023), kafatası görüş (C024), ilahi kitabı (C025), küre tarih (C026), küre yapımcısı (C027) — uzman/hakem editör.
3. **Restorasyon (C012):** 1997 kafatası yeniden-inşa; Sharp kanıt kaybı eleştirisi.
4. **Literatür (C031, E):** refs metinleri erişilmedi.
5. Felsefi yorumlar (İleri §7: Kant/Benjamin ödünç) kurum dışı; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Bu eserde birincil NG AÇILDI (A, çok zengin) ama görsel İNCELENEMEDİ (E); beş akademik ihtilaf açık; kanıt konumu güçlü-orta; görsel + monografi teyidi insan editöre kritiktir.**
