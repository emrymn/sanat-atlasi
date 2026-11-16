# KALİTE KONTROL — Q18167078 · Kleopatra'nın Ziyafeti (The Banquet of Cleopatra) · Giovanni Battista Tiepolo

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti3/Q18167078-brief.md`); ham cache `.qwen/tmp/parti3/Q18167078-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q18167078 için temiz.
- **Toplam iddia:** 67 (C001–C067). **A=23, B=28, C=1, D=10, E=5.**
- **A düzeyi:** NGV birincil S4 (work 4409: künye/About/Artwork Details/Frame essay/indirme) + S7 GAP/NGV provenance aynası + S10 NG London NG6409 (ayrı eser) + S6/S7 PD lisans. C001–C015, C022, C028, C039–C041, C055, C056, C067.
- **B düzeyi (atıf zincirli / imzalı essay; kitap metinleri erişilmedi):** C016, C017, C019–C021, C023–C027, C029–C032, C035–C038 (Tomory + Christiansen/Anderson/Martineau zinciri); C054, C057, C059–C066 (The Age + Tomory alımlama/öncül/Montagu/Labia/Reynolds + ABC).
- **C düzeyi (yorum, açıkça işaretli):** C034 (itwiki teatralite, atıfsız). Derslerde "(yorum)" elle işaretli.
- **D düzeyi (10 ihtilaf):** C042–C050 (D001–D009) + C058 (restorasyon yılı, bu turda eklendi). Hepsi "(tartışma)" post-pass işaretli.
- **E düzeyi (5):** C018 (itwiki hakem konumu), C033 (Guardi yüz), C051 (görsel incelenemedi), C052 (erişilemeyen kaynaklar), C053 (siparişçi adlandırma). Hepsi "(belirsiz)" post-pass işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU serbest (A–E). kavramlar (5) kanıtı A/B. Üretimde A/B dışı kanıt hatası YOK (dogrula 0 hata). Quiz doğru cevapları D/E'ye dayanmaz; yorum tek doğru cevap yapılmadı (CS04 sirke = NGV A; CS01 tarih = NGV A).
- **D/E işareti:** post-pass ile tüm D "(tartışma)", E "(belirsiz)" işaretli; kaçak yok. C'ler "(yorum)".
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak tüm GZ ipuçlarını "TASLAK" ile başlattı (5/5 doğrulandı).
- **Totoloji:** CS yanlış gerekçeleri bağlamsal (≤3 kelimelik "X değil." yok); cs_gerekce_iyileştir devrede.
- **İlk turdaki 6 heuristic UYARI giderildi:** 1 gerçek etiketsiz olgu (Orta §2 açılış cümlesi → [C002][C028] eklendi) + 5 kısaltma-bölünmesi yanlış pozitifi ("A.J.L." → McDonnell; "II./I." → Katerina/Pavel; "s. 175" → sayfa 175). Son koşuda Q18167078 **0 uyarı**.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda birincil NGV cache'leri ve ikincil wikitext **yeniden açılıp okundu** (yalnız taslağı yeniden okumak sayılmaz):
- **S4 (NGV work 4409, 200):** başlık "(1743-1744)"; Medium "oil on canvas"; Measurements "250.3 × 357.0 cm"; Credit "Felton Bequest, 1933"; Gallery location Level 2; Accession "103-4"; Inscription "reverse l.r.: 2608"; Movements Rococo; Subjects "History and Legend"; About "dissolves the pearl in a glass of vinegar and drinks it", Pliny "AD ٧٧", Cleopatra "٦٩–٣٠ BCE", Antony "٨٣–٣٠ BCE"; Frame essay "10 February 1744 … frame", "5 March 1744 … 300 zecchini … dispatched to Dresden", "No record … original frame", "cleaned and restored in 2002-03", Buttery 1954/5, McDonnell/Pollak/Lindsay, £350 invoice, "c.1800 to 1933"; indirme koşulları ✓.
- **S5 (Tomory essay, 200):** Pliny Loeb III 245–47 (on milyon sesterces, Plancus, Pantheon Venüs); "no vinegar that can dissolve pearls … swallowed"; Smith "now generally believed … initial commissioner"; "no documented evidence … reasonable to suspect"; "It is pure surmise"; Maria Labia "Although this is not true"; Mazzoni 1660 + Carmini 1740–44 + Hoff 1973 s.150; Dolfin 1723/1733; Montagu 1739/regatta 1740/"Penelope of your absence"/piramit; Labia altın tabaklar + de Brosses + Chigi; Bassano/Piazza/Allori/Piero di Cosimo/Cambiaso; Boccaccio Luxuria/Shakespeare/Dryden/Guercino/Batoni; Plutarkhos Cydnus/Tarsus/Venüs/Bacchus; Reynolds Kitty Fisher 1759; Forster Alexandria 1922 ✓.
- **S7 (Commons GAP, 200):** provenance aynası "Commissioned c. 1743 possibly by Consul Joseph Smith … ceded to … Algarotti, agent of Augustus III (1697–1763) … Dresden 1744 … Hubertusburg c.1746 … Amsterdam 22 May 1765 no.54 … Yver 1765 … Catherine II … before 1796 … Paul I 1796 … Michael Castle … 1801 Hermitage … 1859,1891 (1864) … Colnaghi's … by 1932 … Felton Bequest 1932 (Randall Davies) … arrived Melbourne 1933"; museum_internal_id 103-4; object_rights "Felton Bequest, 1933"; PD-Art deathyear=1770; pretty_dimensions "w3570 x h2503 cm" (E008 birim hatası) ✓.
- **S10 (NG London NG6409, 200):** "1740s", "46.3 × 66.7 cm", "Room 33", "Presented by the Misses Rachel F. and Jean I. Alexander … 1972", "may be an early oil sketch for … Palazzo Labia … completed in around 1746", "a goblet of vinegar" ✓ (AYRI eser).
- **S2/S3 wikitext yeniden okundu:** enwiki "completed in 1744" (ABC ref'li ama ABC "1743–44"), "dissolves it in her wine" (aykırı), "first of three large paintings", modelli, Cognacq-Jay, Arkhangelskoye "1747; 338 × 600", composition (loggia/steps/marble floor), Veronese Cana 1563 Louvre + Levi 1573 Accademia, black servants/slaves, Mengozzi Colonna trompe-l'œil, "acquired in 1764 by Catherine", "A£25,000", bavul/Trafalgar Square; itwiki "data=1743", "fattezze della moglie Maria Cecilia Guardi" (atıfsız), "Lucio Munazio Planco" (atıfsız), theatricality (atıfsız), {{chiarire}} ✓.
- **S11 WGA (200):** "1743-44", "249 x 346 cm" (aykırı), "in the manner of Veronese", "moors, a dwarf and a dog" ✓. **S8 ABC Wayback (2017-09-26):** "painted in 1743–44", "250.3 x 357cm", "1933 from the Soviet government, under the noses of the National Gallery in London", "King of Poland", "blonde Queen Cleopatra", "dissolved it in vinegar", Villis+Payne "a year's detailed work" ✓. **S9 The Age 2010 (200):** "from the Soviet government in 1932 for … £25,000", Villis+Payne "about 3000 hours in 2001", Finding of Moses Ricci→Tiepolo, Banquet sağa asıldı, Marriage Allegory NGA ödünç ✓.
- **S1 WD (EntityData):** P571 precision 8 + P1319=1743/P1326=1744; P2048=250.3/P2049=357.0; P217=103-4; P11807 ÇİFT WGA ID (3_1740s/04banque + 4labia/2banque3); P6216=Q19652 ✓.

**İhtilaflar (D) doğrulandı:** D001 tarih, D002 boyut (WGA 249×346), D003 edinim (1932/1933, Colnaghi's/Sovyet, A£/£), D004 sıvı (wine/vinegar), D005 Londra eskizi, D006 Katerina 1764/1765, D007 Rusya c.1800, D008 Labia fresk ~1746/1747, D009 WD versiyon. **Yeni D (C058):** restorasyon yılı NGV "2002-03" ↔ The Age "2001/~3000 saat" ↔ ABC "bir yıl" — brief'te yoktu, bu turda cache karşılaştırmasıyla eklendi.

**Brief'e karşı düzeltme (N7):** Brief "basyapitlar.json'da bu eser YOK" der; salt-okunur taramada eserin `data/basyapitlar.json` **eserler[61]**'de VAR olduğu tespit edildi (anahtar Q18167078, tarih "1743", betim bölümleri + "bak" listesi mevcut). Bu betimler proje verisidir, bu oturumda görsel doğrulanmadı (C051); ders kanıtı olarak kullanılmadı.

**Erişilemeyen:** S12 JSTOR 865464 Fry 1933 (200 ama Client Challenge bot engeli); K1 Anderson 2003, K2 Christiansen 1996, K3 Christiansen 1999, K4 Martineau & Robison 1994, K5 Hoff 1973, K6 Fry 1933, K7 Fahy 1971 — kaynakçada anıldı, metne erişilmedi (C052). The Age 1961 + Crikey 2014 çekilmedi. ABC canlı 301 → Wayback 2017-09-26 kullanıldı. Ölü URL yok (S14/S15 HEAD 301, güncel birincil S4 zaten 200).

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12 AKTİF): **Q18167078 için 0 hata / 0 uyarı.** DERS.json + SORULAR.json şema geçerli; bolum_eslesme 12 bölüm; durum "İnsan incelemesi bekliyor"; kelime sayıları JSON ↔ dosya tutarlı (415/1368/2650); sayım satırı (67; A23/B28/C1/D10/E5) DERS.json ile eşit; CS şık/gerekce bütünlüğü OK; GZ 5/5 TASLAK. **CJK: 0** (tüm .md/.json + uret betiği tarandı). Arap-Hint rakamlar yalnız KANIT E009 verbatim NGV alıntısında (10; derslerde normalize, C055). Genel koşudaki öteki eser uyarıları bu agent'ın kapsamı dışıdır; yalnız kendi QID dizinine + `.qwen/tmp`'ye yazıldı, data/kod/main/pilot/öteki eserlere DOKUNULMADI; commit/push YOK.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 415 | 400–500 | 3 dk |
| Orta | 1368 | 1300–1600 | 10 dk |
| İleri | 2650 | 2600–3200 | 20 dk |

Üç seviye de §8 hedef aralığında; dolgu/tekrar yok (yakın tekrar + seviyeler arası birebir cümle kontrolü temiz). İleri düzey gerçekten daha derin: kaynak hiyerarşisi metodolojisi, provenance hipotez zinciri (kesinlik dereceleri), Tomory alımlama/öncül çerçevesi, versiyon ailesi metodolojisi, D/E envanteri, açıkça işaretli felsefi/estetik yorum (teatralite, lüks göstergebilimi, hubris/nemesis, gösteri/yargı gerilimi).

## 5. Görsel doğrulama (Kural 6)

Commons `File:Giambattista Tiepolo - The Banquet of Cleopatra - Google Art Project.jpg` metadata (5978×4177, 13.340.496 bayt, JPEG); lisans **Public domain** (PD-Art / PD-old-100-1923, deathyear=1770; C039). **Görsel bu oturumda İNCELENEMEDİ** (vision kotası ana oturumda; C051 E). Kompozisyon NGV (A) + Christiansen/WGA/itwiki (B/C) METNİNDEN; derslerde "kaynakların betimlediği" ifadesi kullanıldı. **GZ TASLAK.** Görsel projeye kopyalanmadı; URL + lisans + kaynak olarak referans verildi. NGV indirme koşulları (C040): tam künye + kırpmasız, ticari için form. **D004 (sıvı) görsel teyit olmadan da NGV birinciliyle çözümlü (sirke); ama kompozisyon/renk/doku (C024–C026) ve data betimleri görsel teyit olmadan kesinleştirilemez.** İnsan editör görsel incelemesi ZORUNLU.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C051, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi zorunlu (kompozisyon, renk, doku, data betimleri).
2. **D003 — edinim:** yıl (1932 GAP ↔ 1933 credit/ABC), satıcı (Colnaghi's ↔ İngiliz tüccar ↔ Sovyet hükümeti), bedel (A£25,000 ↔ £25,000). NGV credit "Felton Bequest, 1933" birincil korundu; tek yıl/bedel dayatılmadı. Editör GAP aynası + NGV arşiviyle netleştirmeli.
3. **D004 — sıvı:** enwiki "wine" ↔ NGV/diğerleri "vinegar". Ders sirke der (NGV A); enwiki hatası adayı. Editör enwiki lead'ini düzeltmeyi değerlendirmeli.
4. **D006/D007 — Rusya:** Katerina 1764 ↔ 1765/before 1796; Rusya'ya giriş c.1800 ↔ ≤1796. Kesin yıl dayatılmadı.
5. **D005 — Londra NG6409:** Labia ↔ Arkhangelskoye ilişkisi belirsiz ("may be"/"more usually regarded"); Melbourne modello'su Paris'te (ayrı). Versiyon karışıklığı riski.
6. **D009 / N8 — WD P11807 çift WGA ID:** Melbourne tuvali + Labia freski tek item'da. WD düzeyinde versiyon ayrımı gerekli; derslerde ayrım korundu.
7. **C058 (yeni D) — restorasyon yılı:** NGV "2002-03" ↔ The Age "2001/~3000 saat" ↔ ABC "bir yıl". NGV esas; medya yılı nüans. NGV konservasyon essay'i ("Finding light in the shadows…", S4'te linkli, çekilmedi) ile netleştirilebilir.
8. **E001/C033 — Guardi yüz iddiası:** itwiki atıfsız; olgu gibi kullanılmadı. Tomory'nin reddettiği Maria Labia efsanesi (C036) ile ayrı.
9. **E002/C053 — siparişçi adlandırma:** enwiki "Frederick Augustus III" (link Frederick Augustus I maddesine) ↔ GAP "Augustus III (1697–1763)" ↔ ABC "King of Poland". Aynı kişi; link hatası flag'lendi.
10. **Veri boşlukları (N4/N5):** gorsel_kaynagi.json + muze_numaralari.json Q18167078 YOK; eserler_onbellek lisans "l":"" boş; envanter 103-4 data'ya girmemiş. Önerilen A: 250.3×357.0, oil on canvas, 103-4, PD.
11. **N2/N7 — tarih + basyapitlar:** data "1743" tek yıl (NGV 1743-1744, WD precision 8); eser basyapitlar.json eserler[61]'de VAR (brief N7 düzeltildi). data düzeltme önerisi (uygulanmadı).
12. **B düzeyi atıf zincirleri:** Christiansen 1996/1999, Anderson 2003, Martineau & Robison 1994, Hoff 1973, Fry 1933, Fahy 1971 metinleri erişilmedi; insan editör kitap teyidi yapmalı. Tomory yorumları (C035/C038) olgu değil.
13. **Felsefi yorumlar (İleri §7):** teatralite/lüks göstergebilimi/hubris-nemesis/gösteri-yargı lensleri ödünç; sanatçı etkisi iddiası YOK; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + quiz A/B + D/E işareti + kelime + 12 bölüm + CJK 0 + GZ TASLAK). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler YAPISAL tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil NGV AÇILDI (S4 work 4409 + S5 Tomory essay + S7 GAP aynası + S10 NG London, A); görsel İNCELENEMEDİ (E); on ihtilaf (D) ve beş belirsizlik (E) açık; insan editör görsel teyidi + kitap metni erişimi + veri boşluğu doldurma + WD versiyon ayrımı kritiktir.**
