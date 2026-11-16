# KALİTE KONTROL — Q727875 · Urbino Venüsü (Venere di Urbino) · Titian

**Tarih:** 14 Kasım 2026 · **Parti:** 2 (M5) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 25 (C001–C025). A=3, B=13, C=2, D=5, E=2.
- **A düzeyi:** arşiv resmî katalog (künye/envanter/boyut/provenance) + görsel lisans (C024).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU (C/D/E dahil). Üretimde 2 D-kanıt hatası düzeltildi (DY05→C011, TK04→C010/C011/C012).
- **E/D işareti:** C015–C019 "(tartışma)"; C022/C023 "(belirsiz)"; temiz.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak.
- **Hassas içerik:** mahrem jest / üreme-tıbbı okuması (C014) akademik ve açık ayrıntısız, yorum olarak işaretli; courtesan/erotik tartışma sanat-tarihsel çerçevede.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (arşiv resmî katalog 2022), K2/K3 (en/it wikitext), K4 (WD), K5 (Commons metadata) 14 Kasım 2026'da açıldı:
- Künye: Tiziano/Venere/Uffizi/119×165/inv.1890,1437; provenance 1631 Vittoria della Rovere, Poggio Imperiale 1654-55, 1694 ✓ (K1).
- enwiki: süreç tarih (1532/34–1534–1538); Giorgione poz; bakış/gül/jest/köpek/cassone; Ippolito/Zaffetta ↔ Guidobaldo; Goffen/Hope/Wind/Hale ✓ (K2).
- itwiki: Guidobaldo mektup/anne/Eleonora; eğitici model Giulia Varano; Vasari kumaş/Milanesi favorita; etki Ingres/Goya/Manet; Verdi ✓ (K3).
- **Beş ihtilaf D:** C015–C019. **Görsel:** metadata only; vision bütçesi tükendi → İNCELENEMEDİ (C022).

**Erişilemeyen/erişilmeyen:** canlı polomuseale URL; refs monografi (Goffen/Hale/Hope/Wind/Gronau/Zuffi/Smarthistory) metinleri (C023).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata; 1 uyarı (İleri kelime 2524, hedef 2600–3200, ~%2,9 alt — §8 tahmini, dolgu yok).** CJK: 0 (üretimde CJKCJK karışması yakalanıp düzeltildi).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 402 | 400–500 | 3 dk (aralık içinde) |
| Orta | 1305 | 1300–1600 | 10 dk (aralık içinde) |
| İleri | 2524 | 2600–3200 | 20 dk (~%2,9 alt; §8 tahmini) |

## 5. Görsel doğrulama (Kural 6)

Commons metadata; **vision bütçesi tükendi → İNCELENEMEDİ (C022 E).** Kompozisyon enwiki/itwiki METNİNDEN. **GZ TASLAK.** Görsel A yalnız lisans (C024). Görsel projeye kopyalanmadı. **İnsan editör görsel teyidi ZORUNLU.**

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C022, E):** incelenemedi; GZ TASLAK; insan editör zorunlu.
2. **Beş ihtilaf (D):** tarih (C015), yorum (C016), köpek (C017), sipariş (C018), boyut (C019) — uzman/hakem editör.
3. **Hassas yorum (C014/C011):** üreme-tıbbı/mahrem jest okuması akademik çerçevede; editör onayı.
4. **Literatür (C023, E):** refs metinleri erişilmedi.
5. Felsefi yorumlar (İleri §7: Kant/Benjamin/Hegel ödünç) kurum dışı; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil arşiv katalog AÇILDI (A); görsel İNCELENEMEDİ (E); beş akademik ihtilaf açık; anlam istikrarsızlığı dürüstçe yönetildi; insan editör teyidi kritiktir.**
