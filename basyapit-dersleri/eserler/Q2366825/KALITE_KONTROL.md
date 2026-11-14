# KALİTE KONTROL — Q2366825 · Saman Arabası (The Hay Wain) · John Constable

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti4/Q2366825-brief.md`) + bu oturumun Denetim B canlı erişimleri.
**Üretici:** `.qwen/tmp/parti4/uret-Q2366825.py` (gen.build; cs_gerekce_iyileştir + gz_taslak otomatik).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Üç dersteki olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 94 (C001–C094). **A=35, B=22, C=10, D=14, E=13.** KANIT "Sayım:" satırı ↔ DERS.json tutarlı.
- **A düzeyi (35):** NG katalog sayfası S4 (künye, konu betimi, audio transcript, eskiz zinciri, RA 1821, 1824 Salonu + Charles X madalyası, provenans/Egerton, çerçeve, sergi geçmişi, Flaman/Hollanda ford geleneği) + **güncel V&A Collections API** S18 (eskiz O81405 / 987-1900) ve S19 (Kennard E.859-1994).
- **B düzeyi (22):** NGA Washington 2006 (S7), V&A Kauffmann 1976/2006 (S8), BBC News 2005/2013 (S9/S11), BBC Culture 2024 (S10), CNN 2022 (S12); enwiki'nin kaynaklı maddeleri (atıf zincirleri notlu).
- **C düzeyi (10, yorum):** C041 Barbizon/İzlenimci etkisi, C043 Morante tekniği, C044 tekerlek/jant mekanizması, C045 AHIS Georgic/altın oran, C047 Clark 1949, C049 Fisher mektupları (1909), C091 AHIS tarihsel bağlam, C092 AHIS teknik, C093 "dots and dabs" (Tate atıflı), C094 1909 ek adlar. **Tüm C cümleleri "(yorum)" işaretli.**
- **D düzeyi (14, tartışma):** C050–C063. Brief'in D001–D012'si birebir korundu (C050–C061); **Denetim B'de iki yeni ihtilaf eklendi**: C062 (V&A eskiz envanteri 987-1900 ↔ 987-1888) ve C063 (Kennard 1980 ↔ 1983).
- **E düzeyi (13, belirsiz):** C032, C035, C036, C038 (brief) + C064–C072. Brief'in E001–E019 belirsizlik ifadeleri AYNEN korundu ("reputedly", "possibly", "probably", "may owe something", "was said", "forse… o magari", "must be between June and August", "as new research suggests", "are believed to have been", "ca. 1821", "estimate").
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B** kanıtlı (dogrula A/B kontrolü temiz; ek manuel tarama da 0 ihlal). 5 AU serbest (C/D/E dahil). Hiçbir doğru cevap D/E'ye dayanmıyor; yorum tek doğru cevap yapılmadı.
- **Çeldirici gerekçeleri:** 10×3 = 30 gerçek bağlamsal gerekçe (totoloji yok). Çeldiriciler gerçek nesnelerden seçildi: 987-1900 (V&A eskizi), 986-1900 (Leaping Horse eskizi), 589-1888 (Gardner portresi), Stratford Mill / The White Horse (dizi halkaları), Arrowsmith / Fisher / Vaughan / Higginson / Rought (provenans aktörleri). dogrula totoloji kontrolü temiz.
- **D/E işareti:** 14 D "(tartışma)", 13 E "(belirsiz)"; post-pass (negatif lookbehind ile çift işaret önlenir) + inline işaretler. Manuel cümle taraması: **işaretsiz D/E cümle 0**.
- **GZ TASLAK:** görsel incelenemedi → `gen.gz_taslak` beş GZ ipucunun tümüne "TASLAK (görsel bu oturumda incelenemedi; betim kaynak metni): " önekini ekledi.
- **Ek Denetim A düzeltmeleri (bu tur):** sayı içermeyen üç etiketsiz olgusal/yorum cümlesi manuel taramayla bulunup bağlandı (Orta §5 Georgic; İleri §2 D.T. White; İleri §8 "ortak motif araba"). Heuristic tespitçinin bilinen semantik sınırı (sayısız prose'u kaçırması) böylece kapatıldı.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda kaynaklar **yeniden açıldı** (14 Kasım 2026); yalnızca taslağı yeniden okumak bağımsız doğrulama sayılmaz.

**Canlı yeniden erişim (bu oturum):**
- **S4 NG katalog (HTTP 200, 105.576 bayt):** anahtar dizgiler tek tek teyit edildi — NG1207 · 130.2 · 185.4 · Room 40 · Henry Vaughan · "Signed; Dated" · 1776 · 1821 · "empty wagon" · "leased and operated" · "upper third" · "Landscape: Noon" · £250 · Charles X · "National Gallery Archives" · T. Fielder · bicentenary · Willy Lott · Yale Center · Victoria and Albert · Rubens · Het Steen · Return from the Harvest · "Constable's snow" · "probably painted in 1802" · "reputedly" · Boursault · Higginson · Rought · D.T. White · George Young · Cox · Stratford Mill · Géricault · Nodier · Examiner · Christchurch Mansion · Discover Constable · Edmund Higginson · "Oil on canvas". **40/40 dizgi bulundu.**
- **S10 BBC Culture 2024 (HTTP 200):** Riding/Carver/Rylance-Watson alıntıları, "1742", "Whitestone", "skying", Dunthorne, Peterloo, Enclosure, "barrel", "Romanticism than Realism", Stendhal, "evocation", "position of privilege", Kennard **1983** — tümü teyit.
- **S18 V&A Collections API O81405 (HTTP 200, İLK KEZ):** accessionNumber **987-1900**, accessionYear 1900, "Oil study for 'The Hay-wain'", productionDates **ca. 1821** (1816–1825), Height 137 / Width 188 cm (**part: "estimate**), frame 155×214×12, 99 kg, gallery 87; Reynolds cat. 209 pl. 159; **RA 1821 sergi no. 339 "Landscape : Noon"**; objectHistory (Leslie, D.T. White, 24 Ekim 1862 ödünç listesi, 1862 Sheepshanks yan yana, 1874/1886 ödünç, Vaughan ö. 1900 → vasiyet).
- **S19 V&A Collections API O220382 (HTTP 200, İLK KEZ):** Kennard, E.859-1994, Photograph, "photographic collage, London, **1980**"; betim: arabada üç nükleer başlık + el bombalı askeri figür.

**Cache yeniden okuma:** S7 NGA 2006, S8 V&A 2009, S9 BBC 2005, S11 BBC 2013, S12 CNN 2022, S13 AHIS PDF, S14 Morante, S15 oldandsold 1909, S1/S16 Wikidata, S2/S3 wikitext, S5 NG 2009 Key facts, S6 Commons imageinfo — iddialarla karşılaştırıldı.

**Denetim B'nin somut bulguları (brief'te yoktu):**
1. **C062 (D):** Görev talimatı ve brief "V&A tam boy eskiz 987-1888" diyordu; **güncel V&A kaydı 987-1900** veriyor (accessionYear 1900, Vaughan'ın 1900'deki vasiyetiyle uyumlu). 2009 arşiv değeri D olarak işaretlendi, güncel kayıt esas alındı. **Eser karıştırma riski doğrudan bu kayıtla kapatıldı.**
2. **C063 (D):** Kennard tarihi V&A'da 1980, BBC'de 1983.
3. **C074 (A):** enwiki "Vaughan vasiyeti" iddiasının atıf verdiği 1909 sayfasında bu ifade **yok**; buna karşılık güncel V&A kaydı vasiyeti doğruluyor → **iddia doğru, atıf zinciri yanlış** (C071 E + veri notu 12).
4. **C067 (E) ek:** itwiki "Lascia andare il tuo Carro da fieno a Parigi…" alıntısını **Arrowsmith**'a atfeder; 1909 kitap aynı sözleri **Fisher**'ın mektubu olarak verir. Bravi 403 olduğu için çözülemedi.
5. **C025 nüansı:** NG Frame "bicentenary celebrations of the **National Gallery** in 2024" der — bu NG'nin 1824→2024 ikiyüzüncü yılıdır; BBC fotoğraf altındaki tablonun 1821→2021 ikiyüzüncü yılı (C032 E) ile karıştırılmamalı.
6. **C073 ölçü nüansı:** "full-scale" eskiz (137×188, estimate) bitmiş tablodan (130.2×185.4) **büyüktür**; terim birebir ölçü eşitliği değil yaklaşık eşleşme anlatır.

**Erişilemeyen (C071):** Bravi academia.edu **403** (itwiki'nin ana anlatı kaynağı → itwiki ayrıntıları E/C). Kitap/makaleler yalnızca erişilen kayıtların bibliyografyasında: Egerton 2000, Kay 1933 (JSTOR 865555), Parris & Fleming-Williams 1991 (ISBN 1854370707, s. 203), Reynolds 1960/1973/1984, Wilcox 2007, Thornes 1999, Barrell, Bermingham 1987, Bishop 1995, Lyles 2006, *Rubens and his legacy* 2014, Feaver 2003, NG 2024 sergi kataloğu, Cumming 1995, Gombrich 1950, Honour & Fleming 1982. Art UK / RKDimages kimlikleri WD'den doğrulandı, sayfalar açılmadı; Met *Constable's England*, NG eski CGI, gallerix credit URL, Telegraph/Country Life/Independent/bloglar erişilmedi. **Uydurma bibliyografya/URL/envanter yok.**

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12 AKTİF, `.qwen/tmp/venv-dogrula`): **Q2366825 için 0 hata, 0 uyarı.**
- `bolum_eslesme` 12 bölüm; anchor'lar gerçek başlıklardan türetildi (betik içinde slugify) → **boş anchor 0**.
- `durum="İnsan incelemesi bekliyor"`; `kalite_kontrol.insan_onayi="Bekliyor…"`.
- `gorsel.dogrulama.incelenen_bolgeler=[]` → GZ TASLAK otomatik.
- `kavramlar` 5, `ogrenme_kazanimlari` 5, `karsilastirma_onerileri` 3, `veri_notlari` 14.
- **CJK: 0** (7 dosya tarandı: KANIT_DOSYASI.md, KALITE_KONTROL.md, DERS_BASLANGIC.md, DERS_ORTA.md, DERS_ILERI.md, DERS.json, SORULAR.json). Üretim sırasında iki CJK sızıntısı (taslakta Çince karakter karışması) tespit edilip Türkçe karşılıklarıyla değiştirildi; son tarama temiz. Bu raporda da sızıntı dizgileri alıntılanmamıştır.
- **Not (eşzamanlı parti):** dogrula.py tüm `eserler/` dizinini tarar. Son turdaki global **120 hata / 108 uyarı**nın tamamı başka eserlere aittir (Q2317837: 118, kauffman: 2 — eksik/kısmi dosyalar; kelime uyarıları Q700834, bosch, duccio vb.). **Bu eserlere dokunulmadı.** Global sayı bu eserin kalitesini göstermez.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef (§8) | Süre |
|---|---|---|---|
| Başlangıç | 430 | 400–500 | 3 dk |
| Orta | 1427 | 1300–1600 | 10 dk |
| İleri | 3093 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok (dogrula yakın-tekrar ve seviyeler-arası birebir tekrar kontrolleri temiz). İleri düzey gerçekten daha derin: kaynak eleştirisi, provenans halka analizi, eskiz–final ölçü/estetik karşıtlığı, sadakat–kurgu metodolojisi, alımlama tarihi, 27 satırlık D/E envanteri, açıkça işaretli felsefi yorum. Aynı metin uzatılarak seviye üretilmedi.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (S6): File:John Constable - The Hay Wain (1821).jpg · pageid 29779372 · **6128 × 4226 px** · 8.334.977 bayt · yükleme 2013-11-22.
**Lisans:** Public domain — PD-Art (PD-old-auto-expired), PD-old-100-expired, CC-PD-Mark; AttributionRequired false; Copyrighted False; Restrictions boş. Constable ö. 1837 → TR/AB ölüm+70 ve 100 yıl kuralı karşılanır.
**Credit (AYNEN):** "National Gallery, London via gallerix.ru" → **aggregator üzerinden, doğrudan NG taraması değil**; NG'nin kendi görüntü lisansı bu turda ayrıca çekilmedi (C070 E).
**vision kotası ana oturumda → bu oturumda İNCELENMEDİ.** Kompozisyon/renk/ışık/ikonografi betimleri "kaynakların betimlediği" çerçevesinde S4 (A) + S7/S8/S10 (B) + S13/S14/S15 (C) **metninden**. **GZ TASLAK.** Görsel projeye kopyalanmadı; URL + lisans + kaynak olarak referans verildi.
**Görselle doğrulanmamış noktalar:** bulut oranı (C055 D), araba durma/geçme (C064 E), figür pozisyonları (C065 E), silinen binicinin kimliği (C066 E), bulut yönü/konumu (C072 E), yüklü/boş (C056 D — NG metni A, görsel teyit yok). itwiki infobox farklı dosya kullanır (metadata çekilmedi).
**data görsel zinciri tutarlı:** hash 34f36f95092ecbb1 ↔ gorsel_oranlari 1.45 ≈ 6128/4226. `eserler_onbellek.gorseller[0].l` (lisans) boş → doldurma adayı.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C070, E):** incelenemedi; GZ TASLAK; **insan editör görsel teyidi ZORUNLU** (özellikle C055 bulut oranı, C064 araba durma/geçme, C065 figür pozisyonları, C072 bulut yönü).
2. **V&A eskiz envanteri (C062, D):** güncel API **987-1900** ↔ 2009 arşiv **987-1888**. Görev talimatındaki 987-1888 değeri arşiv kaynaklı; editör güncel V&A kaydını teyit etmeli. **NG1207 ile karıştırma riski.**
3. **Kennard tarihi (C063, D):** V&A 1980 ↔ BBC 1983 (üretim ↔ protesto yılı ayrımı olabilir).
4. **data uyuşmazlıkları (C055/C056/C057/C059/C041):** eser_notlari "saman yüklü"; basyapitlar/ayrintilar "bulutlar neredeyse yarısı"; biyografiler "natüralist" ↔ sanatcilar "Romantik"; "Londra'da büyük ilgi görmedi" nüansı; Barbizon/İzlenimci etkisi yalnız C. **data/ değiştirilmedi**; düzeltme önerileri KANIT §5'te onaya sunulur.
5. **Mülkiyet ihtilafları (C050/C051, D):** Willy Lott evi ve Flatford Mill "leased" ↔ "owned since 1742". Derslerde "sahibi" kalıbı kullanılmadı; editör kararı gerekir.
6. **Provenans (C054, D) + atıf zinciri hatası (C071, E):** NG/Egerton ↔ enwiki/Kay 1933 ↔ itwiki; "reputedly/possibly" korunmalı. enwiki'nin Vaughan vasiyeti atfı yanlış kaynakta.
7. **£250 ↔ 250 gine (C053, D) ve itwiki/Bravi ayrıntıları (C067, E):** Bravi 403; para birimi, sözleşme tarihi, galeri adresi, Salon açılış tarihi, Pichot/Nodier alıntıları ve Arrowsmith↔Fisher alıntı atfı çözülemedi.
8. **Erişilemeyen kitaplar (C071, E):** Egerton 2000 (NG Provenance'ın beyan edilen kaynağı), Kay 1933, Parris 1991, Reynolds, Wilcox 2007, Thornes 1999, Barrell/Bermingham/Bishop — argümanları kullanılmadı, yalnızca araştırma yönü olarak işaretlendi.
9. **Felsefi yorumlar (İleri §7, C):** yücelik/dinginlik, sadakat ikiliği, nostalji/ideoloji, aura/protesto — ödünç çerçeveler; **Constable'ın bu düşünürlerden etkilendiği iddia edilmedi**; editör onayı.
10. **Romantizm sınıflaması (C040 B / C057 D):** WD/enwiki referansları blog (zayıf); B desteği BBC röportajından. "natüralist" üslup tanımı olarak ayrılmalı.
11. **Çerçeve "original frame" nüansı (C048, A):** NG Key facts ↔ Frame bölümü (1831–1854); tablo 1821. NG içi nüans korundu, tek taraflı düzeltilmedi.
12. **Görsel credit aggregator (C070, E):** gallerix.ru üzerinden; NG'nin kendi görüntü lisansı/IIIF koşulları yayına hazırlıkta ayrıca çekilmeli.

## 7. Yayına adaylık

Otomatik kısım sağlandı: şema (mini + Draft 2020-12) · çapraz tutarlılık · kelime aralıkları · CJK 0 · quiz A/B · 12 bölüm · anchor bütünlüğü · D/E işaretleri · GZ TASLAK.
**Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler, olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir.**
Birincil NG katalogu AÇILDI ve Denetim B'de canlı yeniden açıldı (A); güncel V&A API kayıtları ilk kez çekildi (A); BBC/NGA/CNN/ V&A arşivleri erişildi (B); **Bravi 403 (E)**; **görsel İNCELENMEDİ (E) → insan editör görsel teyidi + 14 D / 13 E noktasının editoryal kararı kritiktir.**
