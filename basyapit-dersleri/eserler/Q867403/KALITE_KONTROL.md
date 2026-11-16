# KALİTE KONTROL — Q867403 · Uzun Boyunlu Meryem (Madonna with the Long Neck) · Parmigianino

**Tarih:** 14 Kasım 2026 · **Parti:** 2 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti2/Q867403-brief.md`).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q867403 için temiz.
- **Toplam iddia:** 54 (C001–C054). **A=18, B=17, C=2, D=7, E=10.**
- **A düzeyi:** Uffizi birincil (S4) + Polo Museale arşiv (S6): künye, sipariş, bitmemişlik, yazıt, ikonografi, provenance.
- **B düzeyi:** en/it wikitext (S2/S3) satır içi akademik atıflı + Smarthistory arşiv (S9); kitap metinlerine erişilmedi (atıf zinciri notuyla).
- **C (yorum):** C032 (Fagiolo dell'Arco simya/Immacolata), C037 (Marfan hipotezi) — "(yorum)" işaretli, quiz'e girmez.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B (CS kanıtı tümü A); 5 AU serbest (C/D/E dahil). Yanlış gerekçeleri bağlamsal (totoloji yok).
- **D/E işareti:** 7 D "(tartışma)"; 10 E "(belirsiz)"; post-pass ile uygulandı, temiz.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak (5/5 TASLAK önekli).
- **Sayım tutarlılığı:** KANIT "Sayım: 54 · A=18 · B=17 · C=2 · D=7 · E=10" ↔ DERS.json birebir.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda ham cache'ler yeniden açılıp iddialarla karşılaştırıldı (14 Kasım 2026):
- **S4 Uffizi (200):** künye (1534–1540, oil on panel, 216.5×132.5, D4, Palatina n. 230), yazıt MAZZOLI, Elena Baiardi Tagliaferri siparişi, 5 ay/1540 ölüm/1542 yerleştirme, uyuyan Çocuk + urn Crucifixion, sütun "could also be" Collum tuum ut columna, St Jerome + bitmemiş St Francis (bir ayak), St Francis "could be" Immaculate Conception, "subtle eroticism", 1698 Ferdinando + mektup övgüsü ✓.
- **S6 Polo Wayback 2025-01-20 (200):** 219×135, Palatina 230 (1912), N. Cat. 00287693, Elena Bajardi, sözleşme 23.12.1534 / Pentecost 1535, 1542, 1674 Ranuzzi ✓. "Notizie" ">>" kesik → Paris bölümü birincilden doğrulanamadı (C024/C054).
- **S9 Smarthistory Wayback 2025-11-30 (200):** 1534–40 / 216.5×132.5, "the prophet in the lower right corner", colonnade "wall or a single column" + bitmemiş, Pietà/Giuliano de' Medici referansları, "art taken from art", "learned audience" ✓.
- **S2/S3 en/it wikitext (200):** Gombrich "swan"/"prophet"/"perhaps modern", 100 Masterpieces (~2 kat, ayak düzlem ötesi), sözleşme 33 scudi, Affò 1784 lapide, Dalla Torre 1564, Calvi/Farnese/Cerati, Paris 1799–1815, hazırlık çizimleri, "sui sei anni", altı melek/efebi (Hauser), sütunlar "forse" Süleyman, "forse profeta o forse Girolamo", Freedberg "Collum tuum ut colonna", Cooper/Vitruvius + Béguin/Pseudo-Bonaventura, Fagiolo simya, Paola Gonzaga kuşkusu, Marfan (Guardian), Grove "Francesco Tagliaferri", cn span restorasyon, san-zaccaria slug ✓.
- **S10 Commons (200):** 1490×2336 px, Public domain, Credit = S4 URL ✓. **Görsel İNCELENEMEDİ** (vision kotası ana oturumda).

**Yedi ihtilaf D:** boyut (C046), siparişveren (C047), tomarlı figür (C048), yazıt spelling (C049), tarih (C050), salon (C051), boyun imgesi + sütun sayısı (C052). **"İşaya (Isaiah)" adı hiçbir çekilen kaynakta yok — yalnız repo data'sında** (C048). **Erişilemeyen:** S5 canlı 522, S8 canlı 403, S11 Grove abonelik; kitaplar kaynakçada anıldı, metne erişilmedi (C054).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft2020-12 **AKTİF**): **Q867403 için 0 hata; 0 uyarı.** CJK: **0**. 12 bölüm eşlemesi tam; durum "İnsan incelemesi bekliyor"; mükerrer kimlik yok; quiz A/B kuralı temiz. (Genel çıktıda görülen HATA'lar öteki eşzamanlı parti eserlerine aittir — Q140161127, Q1430990, Q18572249, Q18579333, Q1863885, Q23008305, Q2472983, Q3705703; bu esere dokunulmadı.)

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 423 | 400–500 | 3 dk |
| Orta | 1325 | 1300–1600 | 10 dk |
| İleri | 2720 | 2600–3200 | 20 dk |

Üç seviye de §8 hedef aralığında; dolgu/tekrar yok (yakın tekrar ve seviyeler arası birebir cümle uyarısı yok). İleri düzey gerçekten daha derin: yorum ekolleri (Cooper/Béguin/Fagiolo/Hauser), belge zinciri, metodoloji, felsefi çerçeve (ödünç, C).

## 5. Görsel doğrulama (Kural 6)

Commons P18 dosyası metadata (1490×2336 px, Public domain, Credit=Uffizi); **vision kotası ana oturumda → İNCELENEMEDİ (C053 E).** Kompozisyon S4 (A) + S3/S9 (B) METNİNDEN ("kaynakların betimlediği"). **GZ TASLAK (5/5).** Görsel projeye kopyalanmadı; URL+lisans referans. **İnsan editör görsel teyidi ZORUNLU** (özellikle tomarlı figür C048, restorasyon betimleri C040, sütun dizisi C052).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C053, E):** incelenemedi; GZ TASLAK; insan editör zorunlu.
2. **Tomarlı figür (C048, D):** Jerome+Francis (müze) ↔ peygamber (Gombrich/Smarthistory) ↔ itwiki "forse"; **data'daki "İşaya" kaynaklandırılmamış** — düzeltme önerisi.
3. **Siparişveren (C047, D):** Elena Baiardi Tagliaferri ↔ Francesco Tagliaferri (Grove, erişilemedi) ↔ Bajardi yazımı.
4. **Boyut (C046, D):** 216.5×132.5 (güncel) ↔ 219×135 (eski) ↔ 216×132 (wiki) ↔ WD melez.
5. **Boyun imgesi + sütun (C052, D):** data "fildişi kule"/"tek sütun" ↔ kaynaklar "sütun ilahisi"/tabanda çok sütun — data düzeltme önerisi.
6. **Tarih (C050, D) + WD temsil (C042, E):** 1534–1540 ↔ c.1535–1540; repo yil:1600 hatası.
7. **Yazıt spelling (C049, D):** MAZZOLI ↔ MATTOLI; salon (C051, D) D4 ↔ Room 29.
8. **Atıfsız/erişilemez iddialar (E):** Jerome gerekliliği (C039), restorasyon (C040), Paola Gonzaga (C041), Marfan (C037 yorum), Grove (C038), link anomalisi (C043), doğum yılı varyantı (C044), zayıf WD ref (C045), kitap metinleri (C054).
9. Felsefi yorumlar (İleri §7: Kant/Benjamin ödünç) kurum dışı; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (Denetim A + B, şema, kelime, quiz A/B, CJK 0). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil Uffizi (S4) + Polo arşiv (S6) AÇILDI (A); görsel İNCELENEMEDİ (E); yedi ihtilaf D ve data notları (İşaya, fildişi kule, tek sütun, yil:1600) insan onayına sunulur.**