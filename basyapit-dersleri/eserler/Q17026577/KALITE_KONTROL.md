# KALİTE KONTROL — Q17026577 · Moulin Rouge: La Goulue · Henri de Toulouse-Lautrec

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ (canlı geri dönüş) · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** `.qwen/tmp/parti5/Q17026577-brief.md` · **Üretim:** `.qwen/tmp/parti5/uret-Q17026577.py` · **Kanıt:** `KANIT_DOSYASI.md`
**Gösterilen nüsha:** Metropolitan Museum of Art, 32.88.12 (Harris Brisbane Dick Fund, 1932) · çok nüshalı litografi poster, 1891.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

- **Toplam iddia:** 75 (C001–C075) · **A=24 · B=18 · C=12 · D=7 · E=14** · **Kaynak:** 17 (K1–K17).
- Üç dersteki bütün olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; `dogrula.py` çapraz kontrolü **Q17026577 için 0 hata / 0 uyarı** (bilinmeyen etiket, mükerrer kimlik, bilinmeyen kaynak, KANIT'ta tanımsız iddia yok).
- **A düzeyi** Met birincil (API canlı 200 + Wayback 2026-06-07 tam render) ve IMA birincil (canlı 200): künye, teknik, matbaa, boyut, envanter/credit line, provenance, sergiler, raisonné/references alanları, gallery label'lar.
- **B düzeyi** NGA müze sergi yayını (arşiv 2016) + atıflı İngilizce Vikipedi maddeleri (Larousse 1999, Sorrell 1953, Rey 1959, Pessis/Crépineau 1990, Jarrett 1997, Souvais 2008, IMA kitabı 2005). Kaynak zincirinin zayıf halkaları (ticari kitaplar, web/blog düzeyi refs) KANIT'ta açıkça not edildi; **C025'in 1928/1925 ayrıntıları quiz'e alınmadı**.
- **C düzeyi (12)** yalnız "(yorum)" olarak sunuldu: nüsha çıkarımı (C040), Chaix küçültmesi (C042), mekân/maskeli balo (C043), akım sınıflandırması (C044), iç tutarlılık çıkarımı (C066), üç tabaka ↔ şerit kaybı (C067), Benjamin/Kant/Berger/Panofsky/etik okumalar (C068–C072), küratöryel çerçeve (C075). **Felsefi bölümlerde etkilenme iddiası yok** (§7); okumaların geriye dönük olduğu açıkça yazıldı.
- **D düzeyi (7)** brief D1–D7 aynen korundu ve "(tartışma)" ile işaretlendi; **E düzeyi (14)** "(belirsiz)" ile işaretlendi. Hedge'ler aynen taşındı: "probably", "about", "remains unclear", "may have… or may have", "uncertain", "often mentioned as a possibility", "it is thought that", "it is believed that", "souvent".
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B kanıtlı**; 5 AU serbest (C/D/E dahil). Doğru cevapların hiçbiri D/E'ye dayanmıyor; yorum tek doğru cevap yapılmadı. Çeldirici gerekçeleri bağlamsal (totoloji taraması 0). Not: CS03'ün "Imprimerie Chaix" çeldiricisi C düzeyi bir bilgiye dayanır ve gerekçede düzeyi açıkça belirtilir; **doğru cevap A** (Met Printer alanı).
- **GZ TASLAK:** `gorsel.dogrulama.incelenen_bolgeler=[]` → `gen.py → gz_taslak` beş sorunun tamamını "TASLAK (görsel bu oturumda incelenemedi…)" ile işaretledi.
- **12 bölüm (§9):** `bolum_eslesme` 1–12 tam; anchor'lar ders dosyalarındaki gerçek başlıklardan türetildi ve betikte doğrulandı (uyuşmazlık yok). Bölüm 7 yalnız İleri'de (felsefi analiz), bölüm 9 yalnız İleri'de (tartışma envanteri) — §8 seviye derinliği gereği.
- **Kelime tutarlılığı:** `DERS.json` değerleri dosyalardan ölçüldü (post-pass build'dan ÖNCE çalışır) → json ↔ ölçülen farkı 0.

## 2. Denetim B — Kaynağa bağımsız geri dönüş (14 Kasım 2026, canlı)

İlk metinden bağımsız turda kaynaklar **yeniden açıldı** ve iddialarla alan alan karşılaştırıldı (cache: `.qwen/tmp/parti5/Q17026577-denB-*`):

| Kaynak | URL türü | HTTP | Doğrulanan |
|---|---|---|---|
| K5 Met public API 333990 | canlı | **200** (2.666 bayt) | title, artistDisplayBio, objectDate 1891, medium, dimensions (Height 190/Width 116.5), Printer, creditLine, accessionNumber/Year, department, classification, country, isPublicDomain, GalleryNumber "", metadataDate 2026-04-24 → C001–C009, C014–C016 |
| K7 Met Wayback 2026-06-07 | arşiv | **200** (267.402 bayt) | "Maurice Le Garrec", "Affiches Américaines, Charles Lévy", "W.PI.B", "Colta Ives", "Helen Burnham", Denver/Power of Prints/Toulouse-Lautrec on Stage, "six-foot-tall", "made him famous overnight", "boneless", "the glutton", "chahut", "boulevard de Clichy in 1889", "Not on view", "Posters" → C010–C013, C017, C026, C028, C032 |
| K6 Met canlı katalog | canlı | **429** (24.738 bayt) | engel sürüyor → birincil erişim K5 + K7 ile sağlandı (kanıt düzeyi A korundu) |
| K10 IMA/Newfields 44070 | canlı | **200** (202.198 bayt) | 36.4, 67 x 46-3/4 in, "ink on paper, color lithograph", "Gift of the Gamboliers", 1932 Sullivan → 1936 John Herron, dipnot (IMA Archives + Schlagenhauff 2009), Gallery Labels ("for his first poster…", "within days… within a year…"), 4 sergi → C030–C033, C038, C039 |
| K11 NGA Wayback 2016-09-05 | arşiv | **200** (10.454 bayt) | "One evening in December 1891", "three thousand", "genesis remains unclear", "may have approached", "may have won a competition", "uncertain who first introduced", "Pierre Bonnard", "repeated three times", "Louise Weber (1870–1929)", "silhouette", "zinc cutouts", "chérettes", "Bal du Moulin Rouge", "Zidler… Joseph Oller in late 1889", "voracious appetite", "initial foray into lithography" → C004, C027, C029, C031, C034–C036, C050, C073 |
| K3 enwiki madde | canlı parse API | **200** | "probably printed in about 3,000 copies", "triple repetition", "stark white of her petticoats", infobox 67 / 46.75, Yaneff ref → C031, C035, C037, C046 |
| K4 frwiki madde | canlı parse API | **200** | `{{À sourcer|date=avril 2024}}`, "Section vide ou incomplète", "crachis", "écrit deux fois", "Étienne Renaudin", "licenciée en 1894", "bande supérieure de {{unité|27|cm}}", "concours d’affiches… Pierre Bonnard", "5 octobre 1889" → C047–C051, C053–C060 (E korundu) |
| K14 enwiki "Valentin le Désossé" | canlı parse API | **200** | "Jacques Renaudin", 26 February 1843 / 4 March 1907, "may have been the son of a notary", "it is thought that", "black suit and a top hat", "83,112" + `{{clarify}}`, "retired from the stage in 1895", "Le Chahut", "Bar aux Folies-Bergère" → C021, C022, C045, C049, C061 |
| K15 enwiki "La Goulue" | canlı parse API | **200** | "Louise Weber", 12 July 1866 / 29 January 1929, "it is believed that", "part company with the Moulin Rouge in 1895", "at age 62", "Queen of Montmartre" → C018–C020, C024, C025, C045, C050, C064, C066, C074 |
| K9 Commons 2 dosya sayfası | canlı API | **200** | Yorck dosyası: institution "Bertarelli", 191×117, `{{PD-Art-YorckProject}}`, "object type=painting"; Met dosyası: 32.88.12, "Harris Brisbane Dick Fund, 1932", `{{cc-zero}}`, `{{PD-Art|PD-old-auto-expired|deathyear=1901}}`, "Prints in the Indianapolis Museum of Art" kategorisi → C015, C040, C046, C052 |
| K1 WD EntityData / K17 data | yeniden okuma | — | P195 (Q160236 ref'li, Q1117704 ref'siz), P217 32.88.12 ref'li, P276 Met, P2048/P2049 191/117 ref'siz, P18 Yorck, P135 Q34636, P6216 Q19652, P2014 188979, P571 precision 9; `eserler_onbellek` gorseller[1] `l=""`; piksel 252×400 ↔ 394×624 ↔ 2536×3668 → C041, C044, C046, C052, C065 |

**Denetim B notları / sınırları:**
1. Met canlı sayfası 429 verdiği için birincil katalog **arşiv snapshot'ı + canlı API** ile doğrulandı; ikisi alan alan birebir aynı. Arşiv tarihi (2026-06-07) ve API metadataDate (2026-04-24) kaydedildi.
2. frwiki alıntıları canlıda tipografik kesme (`d’affiches`) ve şablon (`{{unité|27|cm}}`) içeriyor; içerik aynı, biçim farkı not edildi. İngilizce "Valentin le désossé" (küçük d) başlığı redirect çıktığı için doğru başlıkla ("Valentin le Désossé") yeniden çekildi.
3. **Erişilemeyenler (E, C062):** Met 1996 CONTENTdm (JS kabuğu, Wayback snapshot yok, CDX "Temporarily Offline"), Lee & Robinson 2005 IMA kitabı, frwiki bibliyografyası, Schlagenhauff 2009 rehberi, raisonné kısaltmalarının açılımı, Yaneff'in SDMA/"Wine Spectator 40" atıfları, MoMA nüsha kaydı (URL refs'te yok → tahmin edilmedi). Hiçbirinin metnine erişilmiş gibi davranılmadı; bibliyografya uydurulmadı.
4. **Görsel inceleme yapılmadı** (vision kotası ana oturumda): Denetim B görsel içeriğini değil, metadata/lisans/oran alanlarını doğrular.

## 3. Şema ve biçim

- `dogrula.py` (mini yorumlayıcı + **jsonschema Draft 2020-12 AKTİF**, `.qwen/tmp/venv-dogrula`): **Q17026577 → 0 hata / 0 uyarı.**
- Genel parti çıktısı (`Q17026577-dogrula-cikti.txt`): "SONUÇ: 2 hata, 112 uyarı" — **bu sayılar Q17026577'ye ait değil**: hatalar `Q698487: eksik dosya DERS.json / SORULAR.json` (eşzamanlı başka agent'ın devam eden işi), uyarılar `hogarth` vb. başka eserlerin etiketsiz olgu/heuristic bulguları. QID-bazlı filtrede Q17026577 satırı yok.
- **CJK taraması: 0** (üç ders + KANIT + DERS.json + SORULAR.json; U+2E80–9FFF, U+F900–FAFF, U+3000–303F, U+FF00–FFEF).
- `durum="İnsan incelemesi bekliyor"`; `kalite_kontrol.insan_onayi="Bekliyor"`; `bolum_eslesme` 12; `gorsel.dogrulama.incelenen_bolgeler=[]`; GZ×5 TASLAK.
- Üretim yalnız kendi dizinine ve `.qwen/tmp/parti5/Q17026577-*` dosyalarına yazdı. **`data/`, uygulama kodu, `main`, Vermeer pilotu (Q167605) ve öteki eserlere dokunulmadı; commit/push/deploy yapılmadı.**

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef (§8) | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | **422** | 400–500 | 3 dk | aralıkta |
| Orta | **1419** | 1300–1600 | 10 dk | aralıkta |
| İleri | **3134** | 2600–3200 | 20 dk | aralıkta |

Ölçüm `gen.py → kelime()` (dogrula ile aynı). Yakın tekrar / seviyeler arası birebir cümle tekrarı taraması: **0 uyarı**. Dolgu yok; kanıtı olmayan ayrıntılar (görsel detaylar, frwiki iddiaları) E olarak kısa bırakıldı, uydurma ile genişletilmedi.

## 5. Görsel doğrulama sınırı (Kural 6)

- **Hiçbir görsel incelenmedi.** G1 Yorck/Bertarelli 2536×3668 (PD-Art-YorckProject; credit Yorck Project 2002 / DIRECTMEDIA / ISBN 3936122202), G2 Commons Met 2314×3722 (CC0 + PD-Art), G3 Met web-large 394×624 (Open Access), G4 yerel küçük görsel 252×400.
- Kompozisyon yalnız "**kaynakların betimlediği**" biçiminde verildi (Met küratoryal metni A, IMA etiketi A, NGA B, enwiki B). **GZ×5 TASLAK.**
- **D7 (C052):** WD P18 görseli Bertarelli nüshası; data'nın birincil/küçük görseli Met nüshasıyla **oran eşleşmesi** veriyor (0,63 ↔ 0,6314; Yorck 0,6914). Bu bir **metadata çıkarımıdır**, görsel teyit değildir.
- **Lisans riski:** data'da Commons görselinin lisans alanı boş (`l=""`) ve kurum notu yok; gerçek lisans kamu malı (PD-Art-YorckProject). Görseller projeye kopyalanmadı, derslerde URL + lisans + kaynak olarak referans verildi. Met/IMA kamu malı + Open Access/CC0 → yeniden yayım açısından engel yok, ancak **nüsha doğru eşleştirilmeden yayımlanmamalı**.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C063, E — ZORUNLU):** kompozisyon, renk ayrıntıları (sarı topuz, puantiyeli bluz, gri silindir şapka, sarı lamba biçimi), imza/matbaa konumu, "ortak büyük kırmızı M", kesik kadraj, döşeme çizgileri. GZ soruları TASLAK; insan editör görseli açıp bölge koordinatlarını doğrulamalı.
2. **Adın tekrar sayısı (C047, D2):** NGA/enwiki "üç kez" ↔ frwiki "iki kez". Görsel sayım yapılmalı; data "üç kez" ve "ortak M" iddiası buna bağlı.
3. **Nüsha–görsel eşleştirme (C052, D7):** WD P18 Bertarelli nüshası; data'da lisans alanı boş + kurum notu yok. Hangi görselin hangi nüshayı gösterdiği editör kararıyla netleştirilmeli; lisans/credit alanı doldurulmalı (data düzeltmesi ayrı onay gerektirir).
4. **Boyut (C046, D1):** Met 190×116,5 (A) ↔ IMA 67×46-3/4 in (A) ↔ WD/Bertarelli 191×117 (referanssız) ↔ enwiki infobox 67×46.75 in (Met görseli + IMA boyutu). Tek boyut dayatılmamalı; WD P2048/P2049'un nüshası belirsiz.
5. **Sipariş hikâyesi (C048, D3):** NGA'nın "remains unclear / may have… or may have" belirsizliği esas; frwiki yarışma-Bonnard anlatısı (E) ve Yaneff doğrudan teklif (C) kesinleştirilmemeli.
6. **La Goulue doğum yılı (C050, D5):** 1866 (Larousse atıflı enwiki) ↔ 1870 (NGA). İki B kaynağı çelişiyor; "62 yaşında öldü" iç tutarlılık çıkarımı (C066) kesinleştirme sayılmaz. Nüfus/ölüm kaydı teyidi gerekir.
7. **Ayrılış yılı (C051, D6):** 1895 (Rey 1959) ↔ 1894 (frwiki, kendi içinde çelişkili).
8. **Valentin'in adı (C049, D4):** Jacques Renaudin (Larousse 1999) ↔ Étienne Renaudin (frwiki, E); noter "oğlu" ↔ "kardeşi" ve hedge'ler korunmalı.
9. **Erişilemeyen literatür (C062, E):** Met 1996 Ives kataloğu (CONTENTdm), IMA kitabı 2005, Schlagenhauff 2009, frwiki bibliyografyası, raisonné kısaltmaları ("W.PI.B; Adr.I.II"), Yaneff atıfları, MoMA nüshası. Editör bunlara erişip iddiaları güçlendirmeli; kısaltmalar açılmadan bibliyografya yazılmamalı.
10. **Zayıf kaynak zinciri (C025, C074, B):** La Goulue'nun düşüş anlatısı ve "Queen of Montmartre"/en yüksek ücretli iddiaları web/blog düzeyi refs içeriyor; 1928/1925 ayrıntıları quiz'e alınmadı, editör teyidi bekler.
11. **frwiki'nin tümü (C053–C060, E):** crachis, 1892 sergileri, 26 Aralık 1891 mektubu, üç etüt, 27 cm üst şerit, Foire du Trône barakası, "5 octobre 1889", "Bal tous les soirs", 1881 basın yasası bağlamı — hiçbiri kesin anlatıma/quiz'e girmedi; akademik kaynakla teyit edilirse düzey yükseltilebilir.
12. **Felsefi yorumlar (C068–C072, C):** Benjamin/Kant/Berger/Panofsky okumaları kurum dışı yorumdur; etkilenme iddiası yok. Editör onayı gerekir.
13. **Akım sınıflandırması (C044, C):** data "Post-Empresyonizm" ↔ WD P135 Art Nouveau ↔ enwiki "See also: Post-Impressionism" (atıfsız). Doğrudan çelişki değil; ders her iki bağlamı kaynaklandırıyor, editör tek etiket dayatmamalı.
14. **Küratöryel yorum (C075, C):** "Not on view" açıklaması (ışık/rotasyon) ve 1932 paralelliği yorumdur; kayıtta açıkça yazmıyor.

## 7. Yayına adaylık (§12)

| Koşul | Durum |
|---|---|
| Temel kimlik ve atıf doğrulanmış | ✅ Met birincil (API canlı + Wayback) + IMA birincil; Denetim B canlı |
| Tüm olgusal cümleler kanıt kayıtlı | ✅ 75 iddia; dogrula QID-bazlı 0 hata/0 uyarı |
| Görsel analiz doğru eser/görselle yapılmış | ❌ **Görsel İNCELENMEDİ** → GZ TASLAK; insan teyidi zorunlu |
| Yorumlar olgulardan ayrılmış | ✅ C=12 "(yorum)"; D=7 "(tartışma)"; E=14 "(belirsiz)" |
| Quiz cevapları doğrulanmış iddialara dayanıyor | ✅ CS/DY/GZ/TK yalnız A/B; AU serbest |
| Kaynak bağlantıları erişim durumlarıyla kayıtlı | ✅ 17 kaynak; HTTP kodu + tarih + arşiv tarihi |
| Ciddi çelişkiler açıkça belirtilmiş | ✅ D1–D7 + E envanteri derslerde ve KANIT'ta |
| Denetim A + B tamamlanmış | ✅ A tamam; B canlı geri dönüş tamam (erişilemeyenler E olarak beyanlı) |

**Durum: "İnsan incelemesi bekliyor" — "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğun garantisi değildir. Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir**. Görsel inceleme (vision) ana oturumda yapılmalı; D7 nüsha–görsel eşleştirmesi ve data lisans alanı düzeltmesi insan onayına sunulmuştur (data değiştirilmedi).
