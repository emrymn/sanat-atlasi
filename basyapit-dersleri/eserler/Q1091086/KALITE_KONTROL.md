# KALİTE KONTROL — Q1091086 · 3 Mayıs 1808 (El 3 de mayo en Madrid) · Francisco de Goya

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** ana oturum brief'i (`.qwen/tmp/parti4/Q1091086-brief.md`); ham cache `.qwen/tmp/parti4/Q1091086-*`.
**İçerik notu:** Konu infaz/şiddet; ders AKADEMİK ve açık ayrıntısız betimler (kan/şiddet ayrıntısı büyütülmez).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q1091086 için temiz.
- **Toplam iddia:** 41 (C001–C041). A=11, B=19, C=4, D=4, E=3.
- **A düzeyi (11):** Prado birincil Wayback 2012 (künye, provenance, sipariş belgeleri, ödeme, çerçeve faturaları, iki↔dört düzeltmesi, manga üniforması, 2008 restorasyon, kardeş P00748).
- **B düzeyi (19):** enwiki (satır içi atıflı) + WD + Commons metadata. Kitap/makale metinlerine erişilmedi → atıf zinciri (C040 E).
- **C düzeyi (4, yorum):** çarmıh/şehitlik (C013), ışığın tersine çevrilmesi (C029), anonimlik/boşunalık (C030), Danto niyet (C035). Ders metninde "(yorum)" işaretli.
- **D düzeyi (4, tartışma):** sipariş kökeni (C010), mekân (C018), erken görülme tarihleri (C022), WD P195 niteleyicileri (C039). "(tartışma)" işaretli; quiz doğru cevabına girmez.
- **E düzeyi (3, belirsiz):** görsel incelenemedi (C011), Prado canlı 403 (C012), akademik metinler erişilmedi (C040). "(belirsiz)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B kanıtlı (dogrula: A/B dışı kanıt YOK); 5 AU serbest (C/D/E dahil). Çeldirici gerekçeleri bağlamsal (totoloji yok).
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak ipucu öneki uygulandı.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

14 Kasım 2026'da yeniden açıldı / doğrulandı:
- **K1 Prado Wayback 2012-10-15** (arşiv 200): künye (P00749, 1814, óleo/lienzo, 268×347, Escuela Española, Tema Historia, Expuesto Sí) ✓; tam provenance ✓; sipariş belgeleri (Regency, Álvarez Guerra 24 Şubat 1814, 1500 reales/ay, Quarto del rey, 29 Kasım 1814) ✓; **iki↔dört + sokak↔Palacio düzeltmeleri** ✓; mekân analizi (Puerta de la Vega, hedged) ✓; 2008 restorasyon ✓.
- **K4 Prado canlı** (EN): 403 Cloudflare → ERİŞİLEMEDİ (C012). Birincil, arşivden.
- **K2 enwiki wikitext** (200): savaş bağlamı, kompozisyon betimi, etki (Manet/Picasso/Rockwell/Holtom), Disasters, ikonografi (Licht/Spivey/Boime), alımlama, İç Savaş kazası, Google Earth ✓. **Sipariş kökeni "Goya's own suggestion" ↔ Prado Regency → C010 D.** **Gautier 1845/1858 ↔ Prado 1840/1850 → C022 D.**
- **K3 WD EntityData** (200): P170/P571/P186/P2048/P2049/P195/P217/P136/P135/P6216 ✓. **P195 yüzyıl precision (Palacio 1814–1900 / Prado 1900–) ↔ birincil "1834 öncesi" → C039 D.** P217 "P000749" format farkı not.
- **K7 Commons metadata** (API 200): 2 dosya PD (Google Earth 30000×23131; Los fusilamientos 1814 3051×2328) ✓. **Görsel İNCELENEMEDİ** (vision kotası ana oturumda) → C011 E.
- **K5/K6 it/de wiki:** yalnız WD sitelink; metin çekilmedi (C040).
- **Erişilemeyen:** akademik kitap/makale metinleri (Licht, Clark, Tomlinson, Boime, Connell, Hughes, Gudiol, Spivey, Stoichita, Bareau, Cowans, Baines, Ford, Honour, Brombert, Danto) — yalnız enwiki atıf zinciri (C040 E).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **Q1091086 için 0 hata / 0 uyarı.** DERS.json + SORULAR.json şema geçerli; bolum_eslesme 12 bölüm; durum "İnsan incelemesi bekliyor"; gorsel.dogrulama.incelenen_bolgeler=[].
**Not:** Genel SONUÇ (2 hata / 105 uyarı) eşzamanlı başka parti eserlerinden (hogarth uyarıları, kauffman eksik DERS.json/SORULAR.json) kaynaklanır; Q1091086'nın kendi satırı temizdir. Kapsam: yalnız kendi QID dizini + .qwen/tmp; başka eserlere dokunulmadı.
**CJK:** 0 (6 dosya tarandı: KANIT, 3 ders, DERS.json, SORULAR.json).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 413 | 400–500 ✓ | 3 dk |
| Orta | 1312 | 1300–1600 ✓ | 10 dk |
| İleri | 2618 | 2600–3200 ✓ | 20 dk |

**Not:** Kelime hedefleri §8 gereği tahmindir; üç seviye de aralıkta. İleri düzey gerçek derinlik soruları sorar (belge eleştirisi, mekân tartışması, ışık ikonografisi, felsefi yorum); aynı metin uzatılarak seviye üretilmedi. Dolgu/yakın tekrar yok (dogrula yakın-tekrar ve seviyeler-arası tekrar kontrolleri temiz).

## 5. Görsel doğrulama (Kural 6)

Commons metadata (2 dosya PD); **vision kotası ana oturumda → İNCELENEMEDİ (C011 E).** Kompozisyon K1 (A: manga üniforması/gri palto) + K2 (B: genel betim) METNİNDEN; "kaynakların betimlediği" ibaresi kullanıldı. **GZ TASLAK.** Görsel projeye kopyalanmadı; URL+lisans referans. En-boy oranı metadata (≈1,297) ↔ Prado 347/268 (≈1,295) tutarlı (yatay format) — bu metadata notudur, görsel inceleme DEĞİL. **İnsan editör görsel teyidi ZORUNLU.**

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C011, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi zorunlu (kompozisyon, fener, stigmata izi, manga).
2. **Birincil erişim (C012, E):** Prado canlı 403; ders Wayback 2012 arşivine dayanır — güncel kayıtla fark olabilir, editör canlı kaydı teyit etmeli.
3. **Sipariş kökeni (C010, D):** Goya önerisi (enwiki/Clark) ↔ Regency (Prado); öneri mektubu bulunamadı. Editör birincil belgeyi (Archivo Palacio) teyit etmeli.
4. **Mekân (C018, D):** Príncipe Pío ↔ Moncloa ↔ Puerta de la Vega; Prado analizi hedged. Eski başlık ↔ güncel başlık farkı.
5. **Erken görülme tarihleri (C022, D):** Prado 1840/1850 ↔ enwiki 1845/1858.
6. **WD niteleyicileri (C039, D):** yüzyıl precision ↔ birincil "1834 öncesi"; birincil esas.
7. **Literatür (C040, E):** akademik metinlere erişilmedi; B iddialar atıf zinciri — özgün metin teyidi gerekli.
8. **İçerik politikası:** data `bak` hotspot'u kan ayrıntısı büyütüyor; ders akademik ayrıntısız. data hotspot'u ve "fenerin aydınlanmaya ironik göndermesi" yorumu (erişilen kaynaklarda yok) editoryal inceleme adayı.
9. **Veri notları (KANIT §5):** data özgün başlık İngilizce ↔ Prado İspanyolca; envanter/boyut/teknik/lisans alanları eksik → düzeltme/ekleme adayları (data DEĞİŞTİRİLMEDİ).
10. **Felsefi yorumlar (İleri §7):** Kant/Benjamin/Licht ödünç çerçeveler; Goya'ya etki iddiası YOK; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema, çapraz tutarlılık, quiz A/B, kelime, CJK, 12 bölüm). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + ana oturum araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil Prado Wayback AÇILDI (A); canlı 403 (E); görsel İNCELENEMEDİ (E); dört ihtilaf D açık.** İnsan editör görsel teyidi + birincil belge teyidi + içerik politikası kararı kritiktir.