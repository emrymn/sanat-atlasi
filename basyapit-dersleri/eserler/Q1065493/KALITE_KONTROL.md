# KALİTE KONTROL — Q1065493 · Ophelia · Sir John Everett Millais, Bt

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti5/Q1065493-brief.md`); ham cache `.qwen/tmp/parti5/Q1065493-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q1065493 için temiz.
- **Toplam iddia:** 55 (C001–C055). **A=28, B=6, C=5, D=12, E=4.** KANIT "Sayım:" satırı DERS.json ile birebir uyumlu.
- **A düzeyi:** Tate birincil S5 (canlı story) + S6 (Wayback künye/summary/caption) + S4 (canlı meta): künye, konu, iki aşamalı üretim, PRB manzara önceliği, model/küvet, elbise, Roberson tuvali, astar, pigment, konservasyon, sembolizm, provenance, sergi tarihi, tarihsel NG mülkiyeti, eskizler, "Other Ophelias", Beata Beatrix listesi, görsel PD.
- **B düzeyi:** çağdaş/modern eleştiri (C025), Ruskin (C026), Dalí (C027), su sıçanı painted-out (C032), Sōseki/Japonya (C036), film/video/kapak alımlaması (C055) — atıf zincirli ikincil.
- **C düzeyi (yorum):** refsiz etki listesi (C028), WD depicts zayıf ref (C030), itwiki hayvan/kafatası betimi (C033), değerleme tahmini (C035), intihar/kaza (C052).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B** kanıta dayanır (doğrulandı: A/B dışı kanıt YOK). 5 AU serbest (C/D/E dahil). Yanlış seçenek gerekçeleri gerçek/bağlamsal (totoloji yok).
- **D/E işareti:** 12 D "(tartışma)", 4 E "(belirsiz)" — post-pass ile tüm D/E atıflarında belirsizlik işareti sağlandı; C yorumlar "(yorum)" etiketli.
- **GZ TASLAK:** görsel incelenemedi → gen.py `gz_taslak` otomatik işaretledi (5/5).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda ham cache'ler yeniden açılıp parse edildi (14 Kasım 2026):
- **S5 (Tate canlı story, 200)** ve **S6 (Wayback 2022-05-12, 200)** tam metin okundu: künye (Oil paint on canvas; Support 762×1118 mm; frame 1105×1458×145; Tate; N01506; Presented by Sir Henry Tate 1894), konu (Hamlet IV.vii), üretim (Hogsmill/Ewell + Gower Street; Temmuz 1851), model (Siddall/Siddal; küvet/lamba), elbise (4 sterlin, Combe mektubu), Roberson tuvali (7 Haz 1851, 15 şilin), astar (lead white + zinc white), pigment listesi, konservasyon (raking/IR/UV/X-ray; 1967 relining), sembolizm, provenance (Farrer→Windus→Graves→Gambart→Fuller Maitland→Henry Tate), sergi tarihi, NG mülkiyeti ✓.
- **S4 (canlı meta):** "on display at Tate Britain" ✓; katalog gövdesi JS kabuğunda yok → S6 arşivi esas.
- **S1 (WD) yeniden parse:** P2048=111.8 (height) / P2049=76.2 (width) **TERS** (D1); P571=1851 precision 9, ref DBpedia (D2); P195=Q430682 Tate + Q180788 NG (D9); P217 N01506 + NG1506; P170=Q159606 ref blog (E11); P180 25 kalem, suicide Q10737 refsiz, bazıları yalnız Twitter (E12) ✓.
- **S2/S3 wikitext yeniden okundu:** enwiki "then 22 years old" (D3) + editör notu "Siddall→Siddal 1853" (E10); water vole painted-out + çerçeve altı eskiz (D4); Ruskin "exquisite"/Surrey doubt (James 1947 p.176); Dalí Minotaure 8/1936 "flagrant surrealism"; £30m tahmini (Telegraph); refsiz etki listesi; Olivier 1948 / Nick Cave-Kylie Minogue / Melancholia 2011 / Taylor Swift 2025 (basın ref); Tolworth + Webb Six Acre Meadow (D8); £50 talep/daha düşük kabul (D6). itwiki teschio/pettirosso/ratto d'acqua (ADO ref); candele (D5); baldacchino + smussati (atıfsız, E2); feroce bronchite (D7); cinquanta sterline (D6); Sōseki 1906 (Peterson/Williams) ✓.
- **S7 (Commons metadata):** 7087×4820, PD-old-100-expired/PD-Art/CC-PD-Mark, AttributionRequired false, DateTimeOriginal "circa 1851" (P1480 Q5727902), credit Tate Images N01506 ✓. **Görsel İNCELENEMEDİ** (vision kotası ana oturumda).
- **12 ihtilaf D olarak açık** (C037–C048); kuşku ifadeleri (circa / "is thought to" / "may signify" / "so the tale goes" / "It is possible") AYNEN korundu.

**Erişilemeyen (C050):** kitap/dergi metinleri (J.G. Millais 1899; Parris 1984/1994; Webb 1997; Peterson/Williams 2012; Murray 2013; Hawksley 2006; James 1947; Radenburg 2008; Hudson 1856; Minotaure 1936; Telegraph 2007) — yalnız erişilen kayıtların bibliyografyasında anıldı; DOI/ISBN/alıntı uydurulmadı. S9 canlı learn URL ölü → Wayback dizin (2017-08-24).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **Q1065493 için 0 hata; 0 uyarı.** CJK: 0 (6 dosya tarandı). `bolum_eslesme` 12 bölüm; `durum`="İnsan incelemesi bekliyor"; `gorsel.dogrulama.incelenen_bolgeler`=[]; künye boyut yönü birincil esaslı (Y 76,2 × G 111,8). Üretim betiği: `.qwen/tmp/parti5/uret-Q1065493.py` (gen.build + post-pass D/E).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 419 | 400–500 ✓ | 3 dk |
| Orta | 1326 | 1300–1600 ✓ | 10 dk |
| İleri | 2859 | 2600–3200 ✓ | 20 dk |

**Not:** Kelime hedefleri §8 gereği tahmindir; üç seviye de aralık içinde, dolgu/tekrar yok. İleri düzey gerçek derinlik katar: birincil erişim metodolojisi, provenance zinciri, üretim/model ihtilafları, konservasyon bilimi, alımlama tarihi (Ruskin/Dalı/McEwan/Marsh/film), felsefi yorum (açıkça etiketli), 12 ihtilaf envanteri.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (S7): 7087×4820 px, PD (PD-old-100-expired; PD-Art; CC-PD-Mark), attribution gerekmez; credit Tate Images N01506 birincili doğrular. **Görsel İNCELENEMEDİ (C049 E)** — vision kotası ana oturumda; bu oturumda yalnız metadata + lisans + çözünürlük. Kompozisyon "kaynakların betimlediği" (S5/S6 + data S10); doğrudan görsel teyit YOK. **GZ TASLAK (5/5).** Görsel projeye kopyalanmadı; URL + lisans + kaynak referans verildi. Yerel eşleme dd3b9c967e239aa0 doğru. **İnsan editör görsel teyidi ZORUNLU** (özellikle kafatası C051, kemerli üst C034, su sıçanı C040).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C049, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi zorunlu.
2. **12 ihtilaf (D, C037–C048):** boyut yönü (WD ters), tarih (WD 1851), model yaşı (19↔22), su sıçanı (var↔painted-out), küvet ısıtma (lamba↔mum), tazminat (50 sterlin belirsiz), hastalık (cold↔bronşit↔zatürre), manzara noktası (Ewell↔Tolworth↔Six Acre Meadow), müze (data NG↔Tate Britain), pansy sahnesi (IV.iv↔IV.v), teşhir (bayat 2019 notu), Tate etiket dili (caption↔summary).
3. **Belirsizlikler (E):** kafatası (C051), kemerli üst/baldacchino (C034) — birincil doğrulamıyor; görsel teyit + data düzeltme önerisi.
4. **Veri notları (data/ dokunulmadı):** tarih "1851"→1851–2; müze "National Gallery"→Tate Britain (tarihsel NG katmanı C023); WD boyut ters; "kemerli üst" (E2); kafatası zaten kuşkulu işaretli. Düzeltme önerileri insan onayına sunulur.
5. **Etik okuma (C052, C):** intihar/kaza + kadın-ölüm imgesi + Viktorya evlilik eleştirisi (caption); tarihsel↔modern çerçeve; editör onayı.
6. **Literatür (C050, E):** kitap/dergi metinleri erişilmedi; atıf zincirleri (Ruskin/Dalí/Sōseki) birincil metinden teyit edilmeli.
7. **Felsefi yorumlar (İleri §7):** Kant/Benjamin/Panofsky ödünç çerçeve; Millais'nin etkilendiği iddiası YOK; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + quiz A/B + D/E işareti + kelime + CJK). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil Tate AÇILDI (A); görsel İNCELENEMEDİ (E); 12 ihtilaf D olarak beyan edildi; insan editör görsel teyidi + ihtilaf çözümü + data düzeltme onayı kritiktir.**