# KALİTE KONTROL — Q318947 · Emmaus'ta Akşam Yemeği (The Supper at Emmaus) · Caravaggio

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti3/Q318947-brief.md`); ham cache `.qwen/tmp/parti3/cache/Q318947-*`.
**Versiyon:** Bu dosya **LONDRA** versiyonu (Q318947, NG172, 1601) içindir. 1606 Brera/Milano versiyonu ayrı öğe **Q2097931**; karıştırılmadı.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Bütün olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q318947 için 0 hata**.
- **Toplam iddia:** 58 (C001–C058). **A=28, B=12, C=2, D=8, E=8.** KANIT "Sayım:" satırı DERS.json ile birebir uyumlu.
- **A düzeyi (28):** NG birincil katalog (S4) — künye, konu, kompozisyon, teknik (In-depth), provenans, sergi tarihi, audio betimi (boş yer daveti C053, meyve/giysi C054, impasto C056). Hedged A'lar (C012/C016/C019/C021/C023) ihtiyat ifadeleriyle korundu.
- **B düzeyi (12):** itwiki/enwiki akademik atıf zincirli (C024/C025/C027/C029/C030/C055/C057/C058), BBC (C028/C031/C035/C036). Metne erişilmeyen kitap/makaleler yalnız "kaynakçada anıldı" notuyla, uydurma künye olmadan verildi.
- **C düzeyi (2):** C051/C052 estetik-felsefi yorum; "(yorum)" işaretli; quiz'e girmez.
- **D düzeyi (8):** C037–C044 (D1–D8); "(tartışma)" işaretli; kesin cevaplı soruya girmez.
- **E düzeyi (8):** C026, C032, C045–C050; "(belirsiz)" işaretli; kesin ders anlatımına/cevaba girmez.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B** kanıta dayanır (dogrula kanit-seviye kontrolü temiz). 5 AU serbest (C/D/E dahil). CS06 "NG kataloğunun ifadesiyle" diye sorar (kaynağın hedged ifadesi, A); kimlik kesinleştirmez. CS09 doğru şıkkı A (meyve sepeti) olarak düzeltildi. Yanlış gerekçeleri bağlamsal (totoloji yok).
- **GZ TASLAK:** görsel incelenemedi → gen.py `gz_taslak` beş soruya da TASLAK öneki ekledi.
- **D/E post-pass:** uret betiği D→"(tartışma)", E→"(belirsiz)", C→"(yorum)" işaretlerini build'den önce uyguladı; kelime sayıları nihai metinle eşleşir.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda ham cache'ler yeniden okundu ve iddialarla karşılaştırıldı (2026-11-14):
- **S4 NG birincil (HTTP 200, 125.575 bayt):** Overview/In-depth/Audio/Key facts/Provenance/Exhibition/Bibliography tam okundu. Künye (1601, Oil on canvas, 141×196.2, NG172, Room 32, 1839 Vernon), konu (Luka 24:30–31), kompozisyon (üçgen, tramlines, foreshortening, reverse halo), teknik (abbozzo, incision, pentimenti diz, impasto), provenans (Borghese→Durand→Vernon), sergi (2009–2024) ✓.
- **Birincil iç çelişki:** Details "Oil on canvas" ↔ audio "oil and tempera" (C043 D). **S5 Keith 1998 PDF** indirildi (200, 17 s.) ama gövde taranmış; yalnız sayfa başlıkları ("NATIONAL GALLERY TECHNICAL BULLETIN VOLUME 19", "Larry Keith", "Three Paintings by Caravaggio", ss. 37–51) çıkarılabildi → tempera doğrulanamadı (E). Künye NG kaynakçasıyla teyitli.
- **S1 WD:** P571=1601 (precision 9), P217=NG172, P195 P580=1839, P2048=196.2/P2049=141 (**ters**, C038), P276 preferred=Room 32 + Q490 Milano kirliliği (C041), P6216=public domain ✓.
- **S2 enwiki / S3 itwiki / S7 BBC:** havari kimliği dört hedged atıf (C040), Ichthys (C028), Brera 1606 (C031), meyve envanterleri (C035/C054), Martínez hostile okuma (C058), Levi della Torre chiasmus (C057), Bologna/Calvesi/Alpers (C051/C027) ✓. itwiki bibliyografya içi tutarsızlıklar (C044) AYNEN korundu.
- **data/ karşılaştırması (salt-okunur):** basyapitlar.json Q318947 "1933'ten beri", "şarap sürahisi", "tenebrizm", "Rembrandt'tan Velázquez'e etkiledi" doğrulandı → C037/C042/C032/C047 olarak raporlandı; data DEĞİŞTİRİLMEDİ.
- **Erişilemeyenler:** S5 gövde, S11 Wayback NG 2005, S12 Smarthistory (ölü), S13 Met kataloğu, kitap/makale metinleri (C050 E).

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12, venv-dogrula): **Q318947 için 0 hata; 7 uyarı.** DERS.json ve SORULAR.json kendi şemalarına göre geçerli; ek alan yok; durum enum doğru; bolum_eslesme 12 anahtar; gorsel.dogrulama.incelenen_bolgeler=[]; kelime_sayisi alanları ölçülenle birebir.
**7 uyarının tümü heuristic "etiketsiz olgusal cümle adayı" yanlış-pozitifidir** (cümle bölücü "Hon."/"ss." kısaltmalarını, alıntı içi "..." üç noktayı ve başlık+paragraf birleşmesini cümle sonu sanır; kaynakça satırları sayı içerir). İlgili cümlelerin tamamı [C###] etiketlidir; gerçek etiketsiz olgu yoktur. Uyarılar bilinçli olarak raporlanır, tespitçi oynanarak susturulmaz.
**CJK/Kiril taraması: 0** (altı dosyanın tümü; üretim sırasında iki istemsiz CJK/Kiril parça yakalanıp düzeltildi).
**Not:** dogrula.py tüm `eserler/` dizinini tarar; öteki eserlerde (Q185255, Q20176925, Q3769169, Q3998957 vb.) önceden var olan hata/uyarılar bu çalışmanın kapsamı dışındadır — dokunulmadı.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 426 | 400–500 | 3 dk | ✅ aralıkta |
| Orta | 1351 | 1300–1600 | 10 dk | ✅ aralıkta |
| İleri | 2748 | 2600–3200 | 20 dk | ✅ aralıkta |

Üç seviye de §8 hedef aralığında; dolgu/tekrar yok (dogrula yakın-tekrar ve seviyeler-arası birebir cümle kontrolleri temiz). İleri düzey gerçekten daha derin: birincil iç çelişkisi, provenans hipotez zinciri, kaynak eleştirisi (D8), erken alımlama (Martínez), felsefi yorum (C) ve açık araştırma boşlukları.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (3 dosya, PD-Art/PD-old-100); **görseller İNCELENMEDİ (C049 E)** — vision kotası ana oturumda, bu oturumda vision bridge kullanılmadı. Kompozisyon **S4 (A) + S3/S7 (B) METNİNDEN** ("kaynakların betimlediği"). **GZ TASLAK.** Görsel projeye kopyalanmadı; URL+lisans+kaynak referans verildi. data/’da kullanılan görsel `Supper_at_Emmaus-Caravaggio_(1601).jpg` (hash 9e546be8055846af, 11412×8117). **İnsan editör görsel teyidi ZORUNLU** — özellikle meyve envanteri (C042: incir uyuşmazlığı), balık gölgesi (C018), hacı kabuğu (C013), "ters hale" gölgesi (C016).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C049, E):** incelenemedi; GZ TASLAK; hotspot koordinatları doğrulanmadı → insan editör görsel teyidi zorunlu.
2. **Edinme yılı data hatası (C037, D1):** data "1933'ten beri" ↔ NG 1839. En net düzeltme adayı; data onaya sunulur.
3. **Meyve + sürahi (C042, D6):** data "incir"/"şarap sürahisi" ↔ NG audio elma/üzüm/armut + su sürahisi/şarap kadehi ↔ BBC nar/üzüm/russet/ayva. Görsel teyit + data düzeltme önerisi.
4. **Havari kimliği (C040, D4):** dört hedged atıf (NG Petrus/Cleophas ↔ enwiki Luke/Cleopas ↔ itwiki Cleofa/forse Giacomo ↔ BBC Cleopas/Luke); data "belki Aziz Yakup". Tek kimlik kesinleştirilmedi; NG seçeneği de anıldı.
5. **Birincil iç çelişki (C043, D7):** oil ↔ oil+tempera; Keith 1998 gövdesi taranmış → tempera doğrulanamadı. Teknik bülten OCR/insan okuması gerekli.
6. **WD veri kalitesi (C038/C041, D2/D5):** P2048/P2049 boyut yönü ters; P276=Q490 Milano kirliliği. WD'den beslenen alanlarda preferred/NG değeri kullanılmalı.
7. **Tarih (C039, D3):** 1601 ↔ 1601–1602 ↔ ödeme 7 Ocak 1602; "1601 (ödeme 7 Ocak 1602)" formülasyonu onaya.
8. **data yorum/abartı/etki (C045/C046/C047, E):** "Çile'nin simgeleri", "tek parlak renkler/sol üstten tek kaynak", "Rembrandt'tan Velázquez'e etki zinciri" erişilen kaynaklarla desteklenmiyor.
9. **Tenebrizm (C032, E):** NG "chiaroscuro" der; terim korunacaksa genel sanat tarihi kaynağı gerekir.
10. **itwiki bibliyografya tutarsızlıkları (C044, D8):** Hibbard/Grovier-Govier/Bologna/Cappelletti-Testa künyeleri AYNEN korundu; doğru baskı/yazar insan editör denetimine.
11. **Erişilemeyen literatür (C050, E):** Keith gövdesi, Smarthistory, Met kataloğu, Varriano 1986 / Pericolo 2007 / Hornik-Parsons 1999 vb. — açık araştırma boşlukları.
12. **Felsefi yorumlar (C051/C052, C):** İleri §7 açıkça yorum; kurum dışı editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı: künye/atıf birincil NG ile doğrulanmış · tüm olgusal cümleler kanıt kayıtlı · yorumlar olgulardan ayrılmış · quiz cevapları A/B iddialara dayanıyor · kaynak bağlantıları erişim durumlarıyla kayıtlı · ciddi çelişkiler (8 D) açıkça belirtilmiş · Denetim A + B tamamlanmış.
**Ancak durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** §12 gereği insan editoryal onayı ayrıdır ve bekler. Otomatik testler yapısal tutarlılığı denetler, olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir.** Görsel incelenemediğinden görsel teyit ve GZ sorularının kesinleştirilmesi yayına adaylık için ön koşuldur.