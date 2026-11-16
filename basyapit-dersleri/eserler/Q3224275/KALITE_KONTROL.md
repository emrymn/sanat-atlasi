# KALİTE KONTROL — Q3224275 · Köle Pazarı (The Slave Market / Le Marché d'esclaves) · Jean-Léon Gérôme

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** `.qwen/tmp/parti5/Q3224275-brief.md` (ham cache `Q3224275-` önekli).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q3224275 için temiz**.
- **Toplam iddia:** 47 (C001–C047). **A=32, B=4, C=1, D=5, E=5.**
- **A düzeyi:** Clark birincil Wayback (S7 2025-11-02 + S8 2016-05-22) + Lees 2012 akademik katalog PDF (S9, cat. 152 pp. 359–363). Künye/konu/provenance/resepsiyon/teknik rapor.
- **B düzeyi:** AfD 2019 (S12 DW + S13 Art Newspaper, doğrudan erişildi); versiyon QID'leri (S14); Cham parodisi (S4, metne erişilmedi); Strahan model hipotezi (S9 aktarımı).
- **C düzeyi:** Tanzimat (C038, arteworld.it erişilmedi) — derslerde kullanılmadı.
- **D düzeyi (5):** boyut (C041), tarih hassasiyeti (C042), başlık (C043), versiyon karışıklığı (C044), yorum kutuplaşması (C045). Hepsi "(tartışma)" işaretli.
- **E düzeyi (5):** Berlin 1868 (C030), Commons açıklaması (C039), itwiki {{cn}} (C040), görsel incelenemedi (C046), erişilemeyen özgün metinler (C047). C039/C040 kullanılmadı; C030/C046/C047 "(belirsiz)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU (C/D/E dahil, serbest). Doğru cevaplar D/E'ye dayanmaz; yorum tek doğru cevap yapılmaz (CS10 "abolitionist okumayı kim savunur" = tartışmanın olgusu, A).
- **E/D işareti:** tüm D/E cümlelerinde belirsizlik işareti var (0 işaretsiz); post-pass çift işaretleme yapmadı.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak (5/5 ipucu TASLAK önekli).
- **Konu hassasiyeti:** köle pazarı / çıplak figür akademik ve açık ayrıntısız betimlendi; WD P180 anatomi etiketleri açılmadı.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

S7/S8 (Clark Wayback), S9 (Lees 2012 PDF), S12/S13 (DW/Art Newspaper), S1/S14 (WD), S3/S4/S5 (en/it/ru wikitext), S10/S11 (Commons metadata) 14 Kasım 2026'da açıldı:
- Künye/konu/provenance/resepsiyon/teknik ✓ (S7/S8/S9). Boyut Clark 84,6×63,3 ↔ WD/it/ru 84,8×63,5 (C041). Tarih "probably" (C003/C042). Versiyon ayrımı + Belmont hatası (C034/C037/C044).
- Nochlin↔Ackerman kutuplaşması S9 not 1'de belgeli (C018/C045); her iki okuma kaynaklı verildi.
- AfD 2019 doğrudan S12+S13'ten (C036); Meslay kınama + kamu malı sınırı.
- **Görsel:** metadata only; vision kotası ana oturumda → İNCELENEMEDİ (C046). Kompozisyon S9+S7/S8 metninden, "kaynakların betimlediği" çerçevesi.
- **Erişilemeyen (C047):** Nochlin 1983, Mantz 1867, Du Camp 1867, Strahan 1881, Cham 1867, Nerval 1851, Beaudan 1994, Ackerman 1986a/b/c özgün metinleri (alıntılar erişilen S9/S13'ten doğrulandı); arteworld.it; Haaretz (dead). Canlı Clark S6 403 (Cloudflare).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **Q3224275 için 0 hata / 0 uyarı.** DERS.json + SORULAR.json şema geçerli; bolum_eslesme 12 bölüm; durum "İnsan incelemesi bekliyor". **CJK: 0.**
**Not:** Genel sayımdaki 4 hata (Q328523/Q5826309 eksik DERS/SORULAR.json) ve 104 uyarının büyük kısmı öteki agent'ların eşzamanlı ürettiği/üretmediği eserlere aittir; Q3224275'e değil (bkz. proje belleği "eşzamanlı parti üretiminde dogrula genel sayısı yanıltır").

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 433 | 400–500 | 3 dk |
| Orta | 1303 | 1300–1600 | 10 dk |
| İleri | 2606 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok (yakın-tekrar ve seviyeler-arası ortak-cümle kontrolleri temiz). İçerik birincil katalogdan genuinely genişletildi.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (S10/S11): `File:Jean-Léon Gérôme - Le Marché d'esclaves.jpg`, 4674×6265 px, **Public domain** (PD-Art/PD-old-100; WD P6216=Q19652). **Görsel İNCELENEMEDİ (C046 E)** — vision kotası ana oturumda. Kompozisyon S9 (A) + S7/S8 (A) METNİNDEN; **GZ TASLAK.** Görsel projeye kopyalanmadı; URL + lisans + kaynak referans. **İnsan editör görsel teyidi ZORUNLU** (özellikle data hotspot'ları: değnek / giysi yığını / yatan köpek erişilen metinlerde yok).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C046, E):** incelenemedi; GZ TASLAK; insan editör teyidi zorunlu. data hotspot'larından değnek/giysi/köpek doğrulanmadı.
2. **Boyut (C041, D):** Clark 84,6×63,3 ↔ WD/it/ru 84,8×63,5; birincil esas alındı, editör onayı.
3. **Tarih (C042, D):** "probably/intorno/ориентировочно"; ders "1866 (muhtemelen)" kullanır; data "1866" circa'sız.
4. **Versiyon (C044, D):** Clark/Cincinnati/Hermitage/Walters ayrımı + Belmont hatası; data/eser_adlari_tr'de iki eser aynı "Köle Pazarı" başlığında — karışıklık riski.
5. **Yorum kutuplaşması (C045, D):** Nochlin↔Ackerman; her iki okuma kaynaklı, tek doğru okuma dayatılmadı; editör onayı.
6. **Konu hassasiyeti:** kölelik + çıplak figür temsili; akademik çerçeve ve Oryantalizm/kölelik eleştirisi editör onayına.
7. **Erişilemeyen literatür (C047, E):** özgün metinler erişilmedi; alıntılar S9/S13 aktarımı.
8. Felsefi yorumlar (İleri §7: Kant/Benjamin/Berger/Said ödünç) kurum dışı, "(yorum)" işaretli; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + quiz A/B + kelime + CJK). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil Clark Wayback + Lees 2012 PDF AÇILDI (A); görsel İNCELENEMEDİ (E); insan editör görsel teyidi + ihtilaf onayı kritiktir.**