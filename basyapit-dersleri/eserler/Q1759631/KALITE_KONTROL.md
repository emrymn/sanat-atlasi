# KALİTE KONTROL — Q1759631 · Vergi Parası (The Tribute Money) · Masaccio

**Tarih:** 14 Kasım 2026 · **Parti:** 1 (M2) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 31 (C001–C031). A=3 (kurumsal birincil K1 + lisans), B=24, D=2, E=2.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B; 5 AU. D/E kanıt yok.
- **Kaynak zinciri:** K1 Musei Civici Fiorentini/MUS.E (kurumsal birincil) + K2 itwiki (B, Vasari alıntılı) + K3 enwiki (B) + K4 WD + K5 Commons.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (musefirenze.it), K2 (itwiki REST), K3 (enwiki REST), K4 (WD), K5 (Commons 1600px) 14 Kasım 2026'da açıldı:
- Sipariş: tüccar Felice Brancacci → Masolino+Masaccio, 1420'ler ✓ (K1).
- Matta 17:24–27; üç episod; kaçış noktası İsa'nın başı; yarım daire/apsis ✓ (K2/K3).
- 32 giornata; sağdan ışık (pencere); chiaroscuro; atmosferik perspektif ✓ (K2/K3).
- 1746 Meucci overpaint; 1771 yangın; 1980'ler restorasyon; a secco kayıplar ✓ (K2/K3).
- Michelangelo kopyası (Münih) ✓ (K2); 1436 Felice sürgünü ✓ (K2).
- Baş atfı (Masolino başları ↔ "tümüyle Masaccio") ve konu teorileri (catasto/Martin V) D işaretli ✓.
- **Sınır:** K5 İNDİRİLDİ ama vision köprüsü bütçesi tükendiğinden İNCELENEMEDİ → görsel A iddiası yok (C028 E); boyut yalnız WD (C005 E). Kompozisyon betimi K2/K3 kaynaklı; insan editör görsel teyidi ZORUNLU.

**Erişilemeyen/erişilmeyen:** eser-özel birincil föy/envanter; Vasari tam metni; Smarthistory. İnsan editör teyidi gerekli.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı.**

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 406 | 400–500 | 3 dk ✓ |
| Orta | 1300 | 1300–1600 | 10 dk ✓ |
| İleri | 2564 | 2600–3200 | 20 dk ≈ (36 kelime alt; standart §8 tahmini) |

## 5. Görsel doğrulama (Kural 6)

Commons 1600px (kaynak 1920×1276) indirildi; **bu oturumda vision köprüsü bütçesi tükendi → incelenemedi.** Görsel A iddiası üretilmedi; C028 E olarak açık ve KANIT §3 + bu bölümde kayıtlı. Kompozisyon betimlemeleri K2/K3'e dayanır. İnsan editörün görselle karşılaştırması zorunludur. Görsel projeye kopyalanmadı.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C028):** bu oturumda yapılamadı; insan editör zorunlu kontrolü.
2. Eser-özel birincil föy/envanter (boyut 255×598 teyidi; C005 E).
3. Baş atfı (Masolino/Masaccio) ve konu seçimi teorileri (D) — uzman editör.
4. Vasari tam metni + Smarthistory teyidi.
5. Felsefi yorumlar (İleri §7: politik teoloji, mucize-ekonomi, Bergson anakronizmi) kurum dışı; editör onayı şart.
6. data tarih/boyut/müze önerileri KANIT §5'te; data/ dokunulmadı.

## 7. Yayına adaylık

Otomatik kısım sağlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir.