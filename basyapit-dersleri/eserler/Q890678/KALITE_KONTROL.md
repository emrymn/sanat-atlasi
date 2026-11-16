# KALİTE KONTROL — Q890678 · Nereden Geliyoruz? Neyiz? Nereye Gidiyoruz? · Paul Gauguin

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ (birincil arşiv kaydı CANLI yeniden açıldı) · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti5/Q890678-brief.md`); ham cache'ler `.qwen/tmp/parti5/Q890678-*`.
**Üretim:** `.qwen/tmp/parti5/uret-Q890678.py` (gen.build) → `DERS.json` + `SORULAR.json`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

- **Toplam iddia:** 81 (C001–C081). **A=37 · B=23 · C=3 · D=9 · E=9.** KANIT §2 "Sayım" satırı ile DERS.json birebir uyumlu (dogrula `sayim_kontrol` temiz).
- **A düzeyi (37):** tamamı S9 (MFA nesne kaydı, Wayback 19 Temmuz 2025) ve S5 (Commons dosya kaydı). Künye, teknik/destek, boyut, yazıtlar, küratöryal betim, provenance + notlar 1–5, edinim fiyatı/tarihi, PD lisans.
- **B düzeyi (23):** S3/S4'ün satır içi akademik atıf taşıyan pasajları (Andersen 1967, Boime 2008, Dorra 2007, Gayford 2006, Stuckey 2001, Gibson 1993, Boyle-Turner 2007, Shackelford 2004, Thomson 1987, Rousseau 1959; itwiki'de Gauguin betimi → loescher/De Rosa + Cricco-Di Teodoro 2012; Fontainas tam alıntı → Messina 2006). **Metinlerine erişilmedi** → B, A yapılmadı.
- **C düzeyi (3):** C075/C076/C077 — dersin kendi estetik/felsefi sentezleri; metinde "(yorum)" ile işaretli, olgusal iddia sayılmadı.
- **D düzeyi (9):** C063–C071 (tarih, medium/destek, boyut, merkez figür, idol, boya uygulaması, Vollard zinciri, akım etiketi, Stang başlangıcı). Hepsi "(tartışma)" ile işaretli; **hiçbiri quiz doğru cevabı değil**.
- **E düzeyi (9):** C018, C019, C034, C044, C045, C051, C078, C079, C080. Hepsi "(belirsiz)" ile işaretli; kesin anlatıya ve doğru cevaplı soruya girmedi.
- **Olgusal cümle kapsama:** üç dersteki bütün olgusal cümleler `[C###]` ile bağlandı; dogrula'nın etiketsiz-olgu tespitçisi **0 aday** döndürdü (ilk turdaki 3 heuristic uyarı, baş harf/kısaltma kaynaklı cümle bölünmesi nedeniyle yeniden düzenlenerek giderildi).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK → kanıtların **tamamı A/B** (otomatik kontrol: A/B dışı 0). 5 AU serbest (C/D/E dahil). Her CS'de dört seçenek + doğru gerekçesi + **üç yanlış seçeneğin gerçek gerekçesi** (totoloji yok; `cs_gerekce_iyileştir` müdahalesi gerekmedi).
- **Yorum/olgu ayrımı:** Gauguin'in "librettosuz müzikal şiir" beyanı (B) ile allegorik okumalar (B) ayrı sunuldu; dersin kendi sentezi C olarak işaretlendi. Kant/Benjamin gibi dış düşünür atfı yapılmadı; alegori↔sembol ayrımı "ödünç çerçeve" olarak yorum bölümünde verildi.
- **Görsel sınırı:** `incelenen_bolgeler=[]` → `gen.gz_taslak` beş GZ sorusunu da "TASLAK (görsel bu oturumda incelenemedi; betim kaynak metni)" ile işaretledi. Kompozisyon "kaynakların betimlediği" kalıbıyla verildi.
- **12 bölüm:** `bolum_eslesme` 1–12 tam; bütün dosya#anchor eşlemeleri başlıkların GitHub slug'ı ile doğrulandı (12/12, eşleşmeyen 0). Bölüm 7 ve 9 yalnız İleri'de (kanıt derinliği orada).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

**Birincil kayıt bu turda CANLI olarak yeniden açıldı** (yalnızca taslağı yeniden okumak sayılmaz):

- `https://web.archive.org/web/20250719053357/https://collections.mfa.org/objects/32558` → **HTTP 200, 31621 bayt** (14 Kasım 2026). Kanıt: `.qwen/tmp/parti5/Q890678-denetimb-mfa-wayback.html`.
- 27 anahtar dize üzerinde bağımsız kontrol: **26 VAR, 1 YOK**.
  - VAR: `36.270`, `1897–98`, `Oil on canvas`, `139.1 x 374.6`, `Tompkins`, `Gallery 255`, `Wildenstein 561`, `androgynous`, `burlap`, `the Beyond`, `probably 1913`, `before 1920`, `sold or consigned`, `$80,000`, `April 16, 1936`, `November 17 - December 10, 1898`, `smooth paint application`, `look like a mural`, `largest he ever attempted`, `no doubt`, `proprieté de Stang`, `L'impressionisme`, `Kunsthaus`, `April 22 - May 9, 1936`, `D'ou Venons Nous`, `P. Gauguin / 1897`.
  - **YOK: `reconciled and resigned`** → brief'in C027'yi "A (S9 alıntı)" olarak işaretlemesi **yanlış**; ifade birincil kayıtta geçmiyor. enwiki'de Boime 2008 p.140 atfıyla, itwiki'de Gauguin betimlemesi ("placata e presa dai suoi pensieri") olarak var → **C027 A→B indirildi**. MFA'nın gerçek ifadesi "the huddled figure of 'an old woman nearing death'" (C021, A).
- **Diğer seviye düzeltmeleri:** C016 (1891 Tahiti) birincilde yalnız ima ("six years prior"), açık yıl enwiki'de → **B**. Brief'in karışık seviyeli iddiaları ayrıştırıldı: C005 A (burlap) / C044 E (jüt alıntısı); C041 A (kriz) / C074 B (hastalık listesi); C045 E (testamento spirituale) / C072 A ("no doubt … artistic legacy"); C052 A (1901 satış) / C073 B (2.500 frank); C047 A (sergi tarihleri) / C081 B (sekiz ilişkili resim).
- **Kuşku ifadeleri AYNEN korundu:** "probably 1913", "before 1920", "sold or consigned", "no doubt", WD P571 precision 8 + P1319/P1326, P1480 yok. enwiki'nin kesinleştirmeleri ("around 1913", "sold … via Alfred Gold", WD P127 "1920") birincilin yerine geçirilmedi; D/E olarak beyan edildi.
- **S3/S4 wikitext yeniden okundu:** Gauguin betimi, Fontainas alıntısı, Dupanloup kateşizmi, hastalık listeleri, Morice aboneliği (atıfsız), Style bölümü (atıfsız) ve kategori/infobox tarih çelişkileri doğrulandı. Atıf adı tutarsızlığı teyit: satır içi "Anderson (1967)" ↔ Sources "Andersen, Wayne V." (E17 → C079 notu).
- **S1/S5 yeniden okundu:** WD P217 "36.270", P195 P580 1936-04-16, P127 P580 1920 (precision 9), P135 ref blog (Q97309629), P136 "genre art", P6216 PD; Commons iki dosya (5400×1987 WPI credit / 3090×1175 MFA credit), PD + AttributionRequired=false, DateTimeOriginal farkı.
- **Erişilemeyenler yeniden teyit:** S6 canlı MFA SSL expired (curl 60, HTTP 000), S7 eski URL 403, S10 WPI JS kabuğu (0 görünür metin; cache dosyası boş), S11 arşiv snapshot yok. Kitap/makale metinleri, NYT 14 Nisan 1936, AAA Seligmann kutu 426, Frèches-Thory 1989 → **kaynakçada anıldı, metne erişilmedi** (C079). Uydurma DOI/ISBN/sayfa/envanter/URL üretilmedi; S12 yerel dosya olduğu için URL alanına yerel yol yazıldı.
- **Sınır:** Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir** ve "bekliyor" olarak işaretlidir.

## 3. Şema ve biçim

- `dogrula.py` (mini yorumlayıcı + **jsonschema Draft 2020-12 AKTİF**, izole `.qwen/tmp/venv-dogrula`): **Q890678 için 0 HATA / 0 UYARI.**
- Genel SONUÇ eşzamanlı başka parti eserleri nedeniyle dalgalanıyor (bu turda 221 hata / 105 uyarı; hataların 214'ü Q17026577'de, 7'si başka eserlerin eksik dosyaları). **Q890678'e ait HATA/UYARI satırı yok** — temizlik genel sayıyla değil, kendi satırlarıyla değerlendirildi. Kapsam gereği başka eserlerin dosyalarına **dokunulmadı**.
- Kelime tutarlılığı: DERS.json `seviyeler.kelime_sayisi` ↔ dosyadan ölçülen birebir (438/1535/3189).
- **CJK taraması: 0** (7 dosyanın tamamı: DERS.json, SORULAR.json, KANIT_DOSYASI.md, KALITE_KONTROL.md, üç ders). Üretim sırasında iki kez yanlışlıkla giren CJK karakter derhal düzeltildi ve son tarama temiz.
- `durum = "İnsan incelemesi bekliyor"`; `kalite_kontrol.insan_onayi = "Bekliyor …"`. "Yayına aday" işaretlenmedi.
- Dosya kapsamı: yalnız `basyapit-dersleri/eserler/Q890678/` + `.qwen/tmp/parti5/`. `data/`, uygulama kodu, `main`, Vermeer pilotu (Q167605) ve öteki eserler **değiştirilmedi**; commit/push/deploy **yapılmadı**.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef (§8) | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 438 | 400–500 | 3 dk | ✅ aralıkta |
| Orta | 1535 | 1300–1600 | 10 dk | ✅ aralıkta |
| İleri | 3189 | 2600–3200 | 20 dk | ✅ aralıkta |

Dolgu/tekrar yok: `yakin_tekrar_kontrol` ve `seviye_tekrar_kontrol` temiz (ardışık yakın-kopya paragraf 0; seviyeler arası birebir ortak uzun cümle 0). İleri düzey gerçekten daha derin: provenance notlarının belge zinciri, birincilin iç gerilimi, anlam kuramı tartışması, D/E envanteri ve metodoloji yalnız orada.

## 5. Görsel doğrulama sınırı (Kural 6)

- **Görsel İNCELENMEDİ** (vision kotası ana oturumda). Yalnız S5 API metadata'sı kullanıldı: dosya 1 (WD P18) 5400×1987, PD, credit Wildenstein Plattner Institute; dosya 2 3090×1175, PD, credit MFA Boston (eski URL).
- İki dosyanın en-boy oranları farklı (≈2.72 ↔ ≈2.63) ve DateTimeOriginal alanları ayrışıyor ("between 1897 and 1898" ↔ "1897") → kadraj/kenar kırpma/sürüm farkı olabilir; **çözülmedi**, insan editöre bırakıldı (C060/C061/C063/C078).
- Kompozisyon, renk ve ikonografi betimi **S9 (A) + S3/S4 (B) metninden**; derslerde "kaynakların betimlediği" kalıbı kullanıldı, doğrudan gözlem iddia edilmedi. Beş GZ sorusu **TASLAK**.
- Lisans: **Public domain** (Gauguin ö. 1903; 100+ yıl pma; AttributionRequired=false). Görsel projeye **kopyalanmadı**; URL + lisans + kaynak referans verildi. PD lisans, görsel teyit zorunluluğunu ortadan kaldırmaz.
- Konu Tahiti figürleri ve **kısmi nü** içerir; betimleme akademik ve açık ayrıntısız tutuldu (itwiki'nin ayrıntılı beden betimlemeleri derslere alınmadı).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C078, E):** incelenmedi; GZ TASLAK; iki dosyanın oran/sürüm farkı; kompozisyon betiminin görselle karşılaştırılması **zorunlu**.
2. **Dokuz ihtilaf (C063–C071, D):** tarih 1897↔1897–98; "Oil on canvas"↔burlap; 374.6↔374.5↔375; merkez figür androjen↔Eve↔giovinetto↔"Âdem"; idol "Beyond"↔Hina↔"uydurma"; smooth↔thick; Monfreid zinciri; Post-Impressionism↔"Sentetizm"; before 1920↔1920. Editör kararı: hangi varyant etikette esas alınacak?
3. **data/ uyuşmazlıkları (12 veri notu):** "Âdem", "Sentetizm", "uydurma put", tek-yıl "1897", "Peru mumyası duruşu", "alegori" sınıflaması, `gorsel.l` boş, `muze_numaralari.json`'da 36.270 kaydı yok. **data/ değiştirilmedi**; düzeltme önerileri onaya sunulur.
4. **Birincilin arşiv tarihi (C010/C080):** Gallery 255 / "ON VIEW" bilgisi 19 Temmuz 2025 snapshot'ına ait; güncel sergileme doğrulanmadı. Canlı MFA SSL/403 engeli nedeniyle kurum teyidi gerekir.
5. **Literatür (C079, E):** 17+ kitap/makale/belge yalnız kaynakçada anıldı; B düzeyi iddiaların metin teyidi (özellikle Andersen 1967, Boime 2008, Dorra 2007, Shackelford 2004, Frèches-Thory 1989, NYT 1936, AAA Seligmann mektubu) insan editör/haricî model denetimine bağlı.
6. **Hassas içerik:** intihar planı/girişimi (C043 B; itwiki doz ayrıntıları E → alınmadı), kısmi nü, sömürgeci/egzotikleştirici bakış tartışması (C077 yorum). Pedagojik çerçeve ve yaş grubu uygunluğu editör onayı ister.
7. **Felsefi/estetik yorumlar (C075–C077, C):** İleri §7'nin tamamı yorum; alegori↔sembol çerçevesi ödünçtür, sanatçıya etki iddiası yoktur. Editör onayı gerekir.
8. **Karşılaştırma önerileri:** Puvis "Inter artes et naturam", Gauguin "Hina te Fatou" (idol kimliği tartışmalı), Borobudur rölyefleri — metinsel düzeyde; görsel karşılaştırma yapılmadı. "Hina te Fatou" önerisi D ihtilafına dayanmaz, yalnızca karşılaştırma sorusudur.

## 7. Yayına adaylık

**Durum: "İnsan incelemesi bekliyor" — "Yayına aday" DEĞİL.**

§12 koşullarının otomatik denetlenebilen kısmı sağlandı: temel kimlik ve atıf birincil kayıtla doğrulandı (arşiv tarihi beyanlı) · bütün olgusal cümleler kanıt kayıtlı · yorumlar olgulardan ayrıldı · quiz cevapları yalnız A/B · kaynak bağlantıları erişim durumlarıyla kayıtlı · ciddi çelişkiler açıkça belirtildi · Denetim A + B tamamlandı.

**Sağlanmayan / insan gerektiren:** görsel analiz doğru eser/görselle yapılmadı (C078) · literatür metinlerine erişilmedi (C079) · dokuz D ihtilafı ve 12 veri notu editör kararı bekliyor · haricî model/insan editör denetimi yapılmadı. Otomatik testler yapısal tutarlılığı denetler; **olgusal/semantik doğruluğun garantisi değildir.**

## 8. Dosyalar ve yeniden üretim

```
basyapit-dersleri/eserler/Q890678/
  KANIT_DOSYASI.md   (81 iddia, 12 kaynak, 9 D, 12 veri notu)
  DERS_BASLANGIC.md  (438 kelime)
  DERS_ORTA.md       (1535 kelime)
  DERS_ILERI.md      (3189 kelime)
  DERS.json          (durum: İnsan incelemesi bekliyor)
  SORULAR.json       (10 CS · 5 DY · 5 AU · 5 GZ[TASLAK] · 5 TK)
  KALITE_KONTROL.md  (bu dosya)
```

```bash
.qwen/tmp/venv-dogrula/bin/python .qwen/tmp/parti5/uret-Q890678.py
.qwen/tmp/venv-dogrula/bin/python basyapit-dersleri/dogrula.py   # Q890678: 0 hata / 0 uyarı
```

Denetim B kanıtı: `.qwen/tmp/parti5/Q890678-denetimb-mfa-wayback.html` (HTTP 200, 31621 bayt) · dogrula çıktısı: `.qwen/tmp/parti5/Q890678-dogrula-cikti.txt`.
