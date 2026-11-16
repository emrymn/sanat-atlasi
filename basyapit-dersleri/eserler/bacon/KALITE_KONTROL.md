# KALİTE KONTROL — bacon · Three Studies for Figures at the Base of a Crucifixion · Francis Bacon

**Tarih:** 15 Kasım 2026 · **Parti:** 7 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**eser_id:** `francis-bacon|Three Studies for Figures at the Base of a Crucifixion` · **sanatci_id:** `francis-bacon` · **dizin:** `bacon` · **Wikidata:** Q987711
**Sonuç:** Denetim A ✅ · Denetim B ✅ (ham cache'lerden yeniden okuma) · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** `.qwen/tmp/parti7/bacon-brief.md` + `.qwen/tmp/parti7/Q987711-*` ham cache'leri.
**Paket (7 dosya):** `KANIT_DOSYASI.md`, `DERS_BASLANGIC.md`, `DERS_ORTA.md`, `DERS_ILERI.md`, `DERS.json`, `SORULAR.json`, `KALITE_KONTROL.md`.

---

## 0. Kritik düzeltme: envanter N06171 (T05858 DEĞİL)

Görev brief'inin anahtarında geçen **T05858 bu esere ait değildir.** Tate API page 100831 (S10) T05858'i *Second Version of Triptych 1944* (**1988**, tuval üzerine yağlıboya + akrilik, her panel 1980×1475 mm, "Presented by the artist 1991") olarak kaydeder. 1944 triptiğinin envanteri **N06171**'dir (S1 `acno`, S3 katalog başı, S5 P217).

- Paketin tamamında `kunye.envanter = "N06171"`; T05858 yalnız **ayrı eser** bağlamında (karşılaştırma önerisi, CS01/CS09 çeldiricileri, DY02, D1 tartışması) geçer.
- Ek tutarsızlık: Gale'in November 1998 katalog denemesi 1988 versiyonunu **"Tate Gallery T03073"** diye anar; güncel API T05858 der. Bu, Tate içi eski/güncel numaralama farkıdır ve D1/C035'te tartışma olarak kayıtlıdır.
- İkincil katman: **NG6171** (National Gallery) yalnız Wikidata P217 + itwiki infobox'ında vardır; Tate katalog girdisinde geçmez (C010, B).
- `data/` **değiştirilmedi**; düzeltme önerisi `KANIT_DOSYASI.md` §5 ve `DERS.json → veri_notlari` ile ana oturuma/insan onayına sunuldu.

## 1. Denetim A — İddia-kaynak eşleştirmesi

Üç dersteki olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **temiz**.

- **Toplam iddia: 58** (C001–C058) · **A=28 · B=5 · C=1 · D=9 · E=15**. KANIT "Sayım:" satırı DERS.json ile birebir eşit.
- Brief'in 34 aday iddiası (28 A / 5 B / 1 C) + 9 D + 13 E **aynen** alındı; iki **süreç** iddiası eklendi: C057 (görsel incelenmedi) ve C058 (literatür metinlerine erişilmedi).
- **A düzeyi** birincil Tate metnine dayanır: API v2 page 49036 (S1), canlı sayfa (S2), Gale katalog girdisi Nov 1998 (S3), galeri etiketi Eylül 2023 (S4) ve ayrı eser kaydı page 100831 (S10).
- **B düzeyi** satır içi akademik atıf taşıyan ikincil metinlerdir (S6 enwiki refs: Sylvester, Russell, Peppiatt, Schmied, Davies/Yard, Kieran, Amishai-Maisels, Zweite; S7 itwiki Tate refs'li). **C düzeyi** yalnız atıfsız giriş nitelemesidir (C034 "Irish-born British figurative painter") ve derslerde "(yorum)" ile işaretlidir.
- **Yorum ↔ olgu ayrımı:** Bataille/Deleuze/Leiris okumaları (C033) ve Amishai-Maisels "victim/aggressor" önerisi (C032) **yorum** olarak işaretli; hiçbir yorum tek doğru sınav cevabı yapılmadı. İleri §7 başlığı açıkça "(açıkça yorum)".
- **D/E post-pass:** 9 D iddiasının her kullanımı "(tartışma)", 15 E iddiasının her kullanımı "(belirsiz)" ile işaretlendi (üretim betiği, negative-lookahead ile idempotent). D/E cümlelerinde belirsizlik işareti denetimi **0 uyarı**.
- **Quiz:** CS 10 · DY 5 · AU 5 · GZ 5 · TK 5. CS/DY/GZ/TK kanıtları **yalnız A/B** (dy/gz/tk tümü A; CS'de A+B). AU serbest (A/B/D/E). Her CS için doğru yanıt + gerekçe + **üç yanlış seçeneğin gerçek bağlamsal gerekçesi** var (totoloji yok; çeldiriciler T05858/NG6171/N06131, 1946/1949/1954 sergileri, 1988 tekniği, itwiki "truciolato" gibi gerçek karışma kaynaklarından seçildi). Doğru şıklar dağıtıldı: A, C, B, D, C, A, D, B, C, D.
- **D/E'den kesin cevap üretilmedi:** tarih (c.1943-4 ↔ 1942-4), boyut (95 cm), oda kodu, "iki hafta" süresi, Holokost/Nazi/dinsel okumalar sınav cevabı yapılmadı. DY03 yalnız katalogun **kendi ifadesini** ("c.1943-4" yazması) doğrular; DY05 yalnız A düzeyi teknik bulguyu doğrular.
- **12 bölüm:** `bolum_eslesme` 1–12 tam; tüm dosya#çapa referansları gerçek başlıklarla doğrulandı (0 hatalı çapa). Bölüm 7 (felsefi/estetik) ve 9 (akademik tartışmalar) ağırlığı İleri'de; 11'de `SORULAR.json`, 12'de `KANIT_DOSYASI.md` referanslı.
- **Şiddet çerçevesi:** çarpıtılmış, acı içindeki figürler ve çarmıha geriliş teması **sanat-tarihsel ve açık ayrıntısız** ele alındı; grafik şiddet betimi yok, kamp imgeleri tasvir edilmedi, psiko-biyografik okumalar ayrıntılandırılmadı (İleri §7 etik sınır paragrafı).

## 2. Denetim B — Kaynağa bağımsız geri dönüş (ham cache'lerden yeniden okuma)

Bu turda brief'e güvenilmekle yetinilmedi; ham cache'ler **yeniden açılıp** iddialarla karşılaştırıldı (15 Kasım 2026):

| Kaynak | Yeniden doğrulanan | Sonuç |
|---|---|---|
| S1 `Q987711-tate-api-item.json` | `acno` N06171 · `title` · `dateText` 1944 · `medium` "Oil paint on 3 boards" · `dimensions` "support, each: 940 x 737 mm / frame, each: 1162 x 960 x 80 mm" · `creditLine` "Presented by Eric Hall 1953" · `collection` Tate · `display_gallery_name` Tate Britain · `onDisplayAtTate` true · `contributors[0]` "Francis Bacon"/"1909–1992" · `location.room.code` TG33 ↔ name "Fear and Freedom 1940-1955 (Room 16)" · `master_images[0].copyright` · `masterImageCC` "" · `iiif_id` null · `subjects` (Furies/Erinyes/Eumenides, Aeschylus 'Oresteia', Eisenstein, Poussin, Bataille 'The Mouth', Crucifixion, WWII) | ✅ birebir |
| S2 `Q987711-tate-headers.txt` | HTTP/2 200; `date: Sat, 14 Nov 2026 21:01:38 GMT`; `content-length: 105556` | ✅ |
| S3 CATALOGUE_ENTRY (tam metin) | başlık "c.1943-4" · "Oil and pastel on board" · panel ölçüleri 940×737/738/734 · yazıtlar "LEFT"/"CENTER [sic]"/"RIGHT" + "F. BACOn \| PETERSFIEL[D]" + Lefevre etiketi "STUDY FOR CRUCIFIXION \| by \| FRANCIS BACON" · provenans · Exhibited (Lefevre April 1945 (2); 1946; 1949; Venice 1954; São Paulo 1959) · Sundeala/hardboard · astarsız gri wash · lean oil · fikssiz pastel · IR bulguları · "protracted work on each" · 1942-4 · 1959 mektubu [9 Jan. 1959] · ateizm/belirsiz article · Oresteia/Eliot/Stanford · Picasso/Grünewald/Guernica "extremely likely" · Mocking of Christ · Eisenstein/Poussin/La Maladie de la bouche · Amishai-Maisels "has proposed" · "does not signal … overtly" · başlık değişikliği "offence" · "isteksiz kabul" düzeltmesi · kamplar "cannot be attributed to them" · Bataille/Deleuze/Leiris · "Second Version … (Tate Gallery T03073)" · imza "Matthew Gale November 1998" | ✅ birebir |
| S4 DISPLAY_CAPTION (tam metin) | "Bacon first exhibited this painting in April 1945" · Furyalar/Aeschylus · "For some, it reflects the horror of the war and the Holocaust…" · `publication_date` 2023-09-26 | ✅ birebir |
| S5 `Q987711-wd.json` | P170 Q154340 · P1476 (Tate ref'li) · P217 **N06171** (P195 Tate) + **NG6171** (P195 Q180788) · P195/P580 1953 · P571 1944 **precision 9 (yıl), P1480 yok** · P31 Q3305213 + Q79218 · P921 Q51636 · P3931 Q195436 (Pictoright alıntısı, P813 2019-11-08) · P1679 Art UK kimliği · lastrevid 2480961559 | ✅ birebir |
| S6 enwiki wikitext | infobox 94×74 · "completed within two weeks" (Sylvester 1987, 13) · "generally considered … first mature piece" (Bragg, 9 June 1985) · "Irish-born British" (atıfsız) · orta figür "mouth … directly on its neck" (Kieran 2005, 185) · sağ figür "as if screaming … may be yawning" · Mortimer "ostrich **necks** … like Bosch without the humour" · Furst "red **[sic]** background" · "it is likely … at the request of Sutherland" · IR "Despite Bacon's claim … spontaneously conceived" | ✅ birebir (D3/D4/D5/D8 farkları teyit) |
| S7 itwiki wikitext | infobox **altezza 95**, larghezza 73,5+73,5+73,5 · tecnica "olio e pastello su **truciolato**" · inventario "N06171, NG6171" · "circa due settimane" · Tate refs | ✅ birebir (D3/D4 çelişkisi teyit) |
| S8 enwiki imageinfo | 485×206, 47.649 bayt, image/jpeg · `LicenseShortName: "Fair use"` · `NonFree: "true"` · `Copyrighted: "True"` · Credit → Tate N06171 · dosya URL'si · iistart 2026-05-04 | ✅ birebir |
| S9 Commons imageinfo | `"missing": true` → dosya Commons'ta **yok** | ✅ birebir |
| S10 T05858 API | `title` "Second Version of Triptych 1944" · `acno` T05858 · `dateText` 1988 · "Oil paint and acrylic paint on 3 canvases" · "support, each: 1980 x 1475 mm" · "Presented by the artist 1991" | ✅ birebir (D1 çözümü) |
| S12 data (salt-okunur) | /eserler/106 anahtar/sanatci/baslik/ozgun/tarih 1944/**muze ""** · eser_ayrintilari WikiArt görsel URL'si + 5 hotspot · eser_adlari_tr · eser_notlari · eser_konulari "dini/crucifixion" | ✅ birebir |

**Cache kimlik teyidi:** dosyaların hedef esere ait olduğu içerikten doğrulandı (`acno: N06171`, WD Q987711, başlık). Paylaşımlı `.qwen/tmp/parti7/` dizininde çakışma riskine karşı bu oturumun okuma kopyaları **QID önekli** adlandırıldı (`Q987711-bacon-catalogue-extract.txt`, `Q987711-bacon-caption-extract.txt`).

**Erişilemeyenler (E):** S3/S6/S7 bibliyografyalarındaki kitap/makale **metinleri** (Sylvester, Russell, Peppiatt, Schmied, Alley 1964, Davies 1978, Boxer 1975, Amishai-Maisels 1993, Deleuze 1981 vb.) — yalnız erişilen kayıtların kaynakçalarında anıldı; DOI/ISBN/sayfa/alıntı uydurulmadı (C058). Art UK (S14) açılmadı, URL tahmin edilmedi. Eski Tate servlet URL'si (S13) erişilmedi; güncel S2 kullanıldı.

**Semantik sınır:** dogrula.py yapısal tutarlılığı denetler; olgusal doğruluğu **garanti etmez**. Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir.**

## 3. Şema ve biçim

- `dogrula.py` (mini yorumlayıcı + **jsonschema Draft 2020-12 AKTİF**): **bacon için 0 hata / 0 uyarı.**
- Genel toplam (102 eser dizini, eşzamanlı parti üretimi): 0 hata / 111 uyarı — **hiçbiri bacon'a ait değil**; genel sayı bu parti için yanıltıcıdır, yalnız `bacon` filtresi esas alındı.
- `DERS.json` ve `SORULAR.json` şemaya tam uyumlu (additionalProperties=false; zorunlu alanlar; enum'lar; `C\d{3}` / `CS\d{2}` / `DY\d{2}` / `AU\d{2}` / `GZ\d{2}` / `TK\d{2}` desenleri).
- Kelime sayıları JSON ↔ dosya **birebir eşit** (post-pass, build'den önce çalıştırıldı).
- **CJK taraması: 0** (7 dosyanın tamamı; regex kendi kendine test edildi). Türkçe metin; özgün başlıklar, envanter numaraları, teknik terimler ve alıntılar özgün biçiminde korundu (§15).
- Üretim betiği: `.qwen/tmp/parti7/uret-bacon.py` (`gen.build`, `dir_name='bacon'`, bileşik `eser_id`). `data/`, uygulama kodu, main, pilot Q167605 ve öteki eserlere **dokunulmadı**; commit/push/deploy **yapılmadı**.

## 4. Kelime/süre tablosu (§8)

| Seviye | Dosya | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|---|
| Başlangıç | DERS_BASLANGIC.md | **423** | 400–500 | 3 dk | ✅ aralıkta |
| Orta | DERS_ORTA.md | **1422** | 1300–1600 | 10 dk | ✅ aralıkta |
| İleri | DERS_ILERI.md | **3126** | 2600–3200 | 20 dk | ✅ aralıkta |

Dolgu/tekrar denetimi: yakın tekrar (ardışık paragraf benzerliği) ve seviyeler arası birebir uzun cümle tekrarı **0 uyarı**. İleri düzey gerçekten daha derin sorular sorar (kaynak katmanları, envanter eleştirisi, IR ↔ hatıra gerilimi, yorum ekolleri, başlık politikası, telif); aynı metin uzatılarak seviye üretilmedi. Kanıtın yetersiz olduğu yerlerde (görsel gözlem, literatür metinleri) kapsam **daraltıldı**, uydurma yapılmadı (§1, §8).

## 5. Görsel doğrulama sınırı (Kural 6)

- **Görsel İNCELENMEDİ** (vision kotası ana oturumda): `gorsel.dogrulama.incelenen_bolgeler = []` → `gen.gz_taslak` ile **GZ 5/5 TASLAK** işaretli.
- Yalnız **metadata + lisans + çözünürlük** doğrulandı: Tate master triptik bütünü **1536×651** (128×54 / 256×108 / 730×309 / 1536×651); panel görselleri **1204×1536, 1183×1536, 1186×1536** — hangi dosyanın hangi panel olduğu API'de etiketli olmadığı için **eşleme YAPILMADI**; enwiki yerel dosya **485×206** (non-free).
- **Commons'ta dosya yok** (`missing: true`) → serbest lisanslı görsel bulunamadı.
- Biçimsel analiz **"kaynakların betimlediği"** çerçevesiyle verildi (S3/A birincil betim + S6/B kaynaklı ayrıntılar); hiçbir renk/biçim/perspektif cümlesi doğrudan gözlem olarak sunulmadı.
- Hiçbir görsel indirilmedi, kopyalanmadı, projeye gömülmedi veya yeniden yayımlanmadı; derslerde yalnız **URL + lisans + kaynak** referansı var.
- **İnsan editör görsel teyidi ZORUNLU:** özellikle (a) sağ figürün çığlık ↔ esneme ikiliği (C050/E7), (b) data hotspot koordinatları ("Sargılı baş ve dişler", "Çığlık atan ağız", "Ot öbeği", "Pastel çizgiler", "Sarkan baş"), (c) panel görseli ↔ panel eşlemesi, (d) orta paneldeki sargı/ağız betiminin görsel karşılığı.

## 6. Telif / adil kullanım (kullanıcı kararı, 2026-11-15)

- **Hak sahibi:** © Estate of Francis Bacon. All Rights Reserved, **DACS 2026** (S1 `master_images[0].copyright`, aynen). `masterImageCC` boş → **CC lisansı yok**; `status: CLEARED` yalnız Tate'in kendi yayın iznini gösterir, serbest lisans değildir.
- **Koruma süresi:** Bacon ö. 1992 → TR/AB ölüm+70: koruma 31.12.2062 sonuna dek, **2063'te sona erer**. "Kamu malı" **denmez**.
- **Çerçeve:** kullanıcı **adil kullanım**ı seçti (eğitim/eleştiri). Uygulama: görsel yeniden yayımlanmaz/kopyalanmaz; URL + lisans + kaynak referansı; **atıf ve telif notu zorunlu**; derslerde ve `kunye.telif_durumu`'nda "hukuki tavsiye değildir" ibaresi.
- **enwiki "Fair use" gerekçesi yalnız enwiki bağlamı içindir**; projeye serbest lisans **devretmez** (C029). Üçüncü taraf WikiArt URL'si (`eser_ayrintilari.json`) bu oturumda lisans açısından doğrulanmadı; tercih edilmedi.
- **Reprodüksiyon:** Wikidata P3931 = Tate Britain; Pictoright kaynaklı alıntı (P813 2019-11-08) reprodüksiyon için **Tate Picture Library** ile teması şart koşar. Herhangi bir görsel yayımlanacaksa hak sahibi/kurum izni ayrıca alınmalıdır.
- **Atıf kalıbı (İleri §10):** "Francis Bacon, Three Studies for Figures at the Base of a Crucifixion, 1944 (katalog: c.1943-4), Tate (N06171), Londra." + telif satırı aynen + görsel referansı olarak tate.org.uk N06171 sayfası.
- Bu çerçeve **hukuki tavsiye değildir**; kurum politikası ve insan editör/hak sahibi onayı bekler.

## 7. İnsan incelemesi gerektiren noktalar

1. **Envanter (D1/C035, kritik):** N06171 ↔ T05858 ayrımı ve Gale 1998'in T03073'ü; `data` anahtarındaki T05858 hatasının düzeltilmesi (data bu oturumda değiştirilmedi). NG6171'in ikincil statüsü.
2. **Görsel (C057, E):** incelenmedi → GZ 5/5 TASLAK; panel eşlemesi, hotspot koordinatları ve biçimsel betimlerin görsel teyidi.
3. **Tarih (D2/C036, E1/E3):** 1944 ↔ "c.1943-4" ↔ 1942-4 (Petersfield yazıtı) ↔ Cromwell Place geç 1943 ↔ "iki hafta, 1944"; circa ve olasılıklar korunmalı, tek yıl dayatılmamalı.
4. **Boyut (D3/C037):** itwiki 95 cm ↔ Tate 940×737/738/734 mm; `boyut_cm` tek değer istediği için 94 × 73.7 (sol panel/API özeti) yazıldı — panel bazlı farkın arayüzde nasıl gösterileceği.
5. **Teknik (D4/C038):** API "Oil paint on 3 boards" (pastel yok) ↔ katalog "Oil and pastel on board" (Sundeala) ↔ itwiki "truciolato"; "sunta/yonga levha" çevirisinin düzeltilmesi.
6. **Süre anlatısı (D8/C042, E8/C051):** Bacon'ın "iki hafta" hatırası ↔ IR "protracted work on each"; hangisinin nasıl sunulacağı (ikisi birlikte, gerilim gizlenmeden).
7. **Alıntı farkları (D5/C039):** Mortimer "mouths" ↔ "necks"; Furst "red background" ↔ "red [sic] background" — alıntıda Tate wording'i esas, fark notlu.
8. **Edinim anlatısı (D7/C041):** "isteksiz kabul" hikâyesi Gale tarafından düzeltilmiştir; olgu gibi sunulmamalı. Hall'un satın alma yolu "presumed" (E2/C045).
9. **Oda bilgisi (D9/C043):** TG33 ↔ "Fear and Freedom 1940-1955 (Room 16)"; `past_event` ↔ `onDisplayAtTate`; kesin oda numarası verilmemeli.
10. **Yorum okumaları (C032/C033, E4/E9/E10):** Holokost okuması ("cannot be attributed to them"), Nazi figürü önerisi ("has proposed"), dinsel ikonografi ("may be too literal"), Bataille/Deleuze/Leiris ve psiko-biyografik ekol — yorum etiketleri ve açık ayrıntısız şiddet çerçevesi editör onayı bekler.
11. **Telif/adil kullanım (§6):** çerçevenin kurum politikasıyla uyumu, atıf kalıbı ve olası görsel kullanım izni.
12. **Literatür (C058, E):** bibliyografya metinlerine erişilmedi; B düzeyi atıf zincirlerinin haricî denetimi (özellikle Sylvester 1987/1993, Peppiatt 1996, Amishai-Maisels 1993, Deleuze 1981).
13. **data boşlukları:** `muze: ""` → "Tate (Tate Britain), Londra" önerisi; `eser_konulari` "dini" etiketi ↔ Bacon'ın seküler okuması gerilimi; kısa başlık farkı.

## 8. Yayına adaylık

**Durum: "İnsan incelemesi bekliyor" — "Yayına aday" DEĞİL.**

Otomatik kısım sağlandı: temel kimlik ve atıf birincil kayıttan doğrulandı · tüm olgusal cümleler kanıt kayıtlı · yorumlar olgulardan ayrıldı · quiz cevapları yalnız A/B iddialara dayanıyor · kaynak bağlantıları erişim durumlarıyla kayıtlı · ciddi çelişkiler (9 D) ve belirsizlikler (15 E) açıkça belirtildi · Denetim A + B (ham cache'lerden yeniden okuma) tamamlandı · şema/kelime/CJK temiz.

**Ancak §12 gereği yayına adaylık için görsel analizin doğru eser/görselle yapılmış olması şarttır; bu oturumda görsel İNCELENMEDİ (GZ TASLAK).** Ayrıca haricî model/insan editör denetimi ve telif/adil kullanım kararının kurum onayı beklemektedir. Bu koşullar sağlansa bile içerik doğrudan yayımlanmaz; insan editoryal onayı gerekir.
