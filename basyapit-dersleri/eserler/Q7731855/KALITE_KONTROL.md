# KALİTE KONTROL — Q7731855 · Saba Melikesi'nin Gemiye Binişi (Seaport with the Embarkation of the Queen of Sheba) · Claude Lorrain

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti3/Q7731855-brief.md`); ham cache `.qwen/tmp/parti3/Q7731855-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q7731855 için temiz.
- **Toplam iddia:** 59 (C001–C059). **A=33, B=7, C=8, D=6, E=5.**
- **A düzeyi:** NG birincil S5 (Sheba) + S6 (Mill/NG12) + S7 (Dido/NG498) + S8 (Room 36) + S9 (2015 Wayback) → künye/konu/ışık/kompozisyon betimi/provenans/vasiyet/güncel konum/sergiler/LV varlığı/PD.
- **B düzeyi (atıf zincirli, kitap metinleri erişilmedi):** C019 Korint (Rubiés/Sureda), C022 contre-jour, C027 repoussoir, C037 Turner 1799 anekdotu (Bailey 1998), C039 Butor 105, C043 İngiliz manzara etkisi, C058 Turner chef d'oeuvre (Shanes 2004/Moorby 2025).
- **C düzeyi (yorum, açıkça işaretli):** C008 beş Claude, C014 gemi "perhaps", C023 data görsel ayrıntıları, C028 perspektif kesişimi, C040 WD katalog no, C041 LV no 114, C042 Iconclass/tür, C044 melike küçük figür.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU serbest (C/D/E dahil). kavramlar (5) kanıtı A/B. Üretimde A/B dışı kanıt hatası YOK (dogrula 0 hata).
- **D/E işareti:** 6 D "(tartışma)" (C033/C045–C049); 5 E "(belirsiz)" (C050–C053/C059); post-pass ile tüm D/E etiketleri işaretli, kaçak yok. C'ler "(yorum)".
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak tüm GZ ipuçlarını "TASLAK" ile başlattı.
- **Totoloji:** CS yanlış gerekçeleri bağlamsal (≤3 kelimelik "X değil." yok); cs_gerekce_iyileştir devrede.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda birincil NG cache'leri ve ikincil wikitext **yeniden açılıp okundu** (yalnız taslağı yeniden okumak sayılmaz):
- **S5 (Sheba, 200):** Full title / Artist dates "1604/5? - 1682" / Date made 1648 / Oil on canvas / 149.1 × 196.7 / NG14 / Room 36 / Bought 1824 / 18th-century French Frame; In-depth "dressed in red", "1 Kings 10: 1–2", "camel… by sea", "identifiable only by… inscription", "round tower… principal emblem", "He may have meant… Godefroy", "Song of Solomon"; seri "commissioned as a pair", "escaped seizure… 1794"; Turner "Sun rising through the Vapour and Dido building Carthage… in perpetuity" ✓.
- **S6 (Mill/NG12, 200):** Full title "Landscape with the Marriage of Isaac and Rebekah ('The Mill')", 152.3 × 200.6, NG12, Room 36; provenans (Wine 2001) "commissioned in 1647…", 1745/1762/1764, probably 1785, possibly 1787, probably 1801/apparently Roy, Mireur 1805 "but wrongly", Farington 3 April 1803, Fiezenger, 8000 guineas (£8400) Erard's, 1824 executors; "does not include the patron's name", Eléanor-Catherine de Bergh, Doria-Pamphilj versiyonu ✓.
- **S7 (Dido/NG498, 200):** 1815, 155.5 × 230, NG498, Room 36; "first… set out to match… Claude… Seaport"; 1831 second will "A Seaport and Landscape with the Marriage of Isaac and Rebekah"; provenans (Egerton 2000) "placed by the side of Claude's 'Seaport' and 'Mill'", 12 months, 18 December 1851, Court of Chancery 19 March 1856; "paired with The Decline of the Carthaginian Empire (Tate)" ✓.
- **S8 (Room 36, 200):** "Claude and Turner", Level 2; oda listesi Sheba + The Mill + Dido + Dutch Boats in a Gale; Claude "(1600–1682)" ✓.
- **S9 (2015 Wayback):** "149.1 x 196.7 cm", "Room 15" ✓ (konum değişimi, ihtilaf değil).
- **S3/S4/S13 wikitext yeniden okundu:** enwiki "pink tunic, royal blue cloak", "perhaps the ship…", "five works", "numbered 114", Dido+Decline bequest (Smith 2009 s.33–34); frwiki Pamphili anlatısı, "tunique rose… bleu royal", Korint, contre-jour, repoussoir, **"blanc de titane" (anakronik)**, transkripsiyon, Butor 105; enwiki Dido 1799 tears (Bailey 1998), chef d'oeuvre/burial (Shanes 2004/Moorby 2025), Room 36 "to this day" ✓.
- **S1/S2 (WD) + S10/S11/S12 (Commons):** P2049=193.7 (aykırı), P528 katalog no/etiketler (Smith 1837/Cecchi 1975/Gordon 1981/Most Famous 1976), P1257 71I336, P6216 PD; Commons {{Size|cm|149.1|196.7}}, id=NG14, location "Sainsbury Wing Exhibition", PD-Art deathyear=1682, 6000×4563 ✓.

**İhtilaflar (D) doğrulandı:** D1 genişlik (WD 193.7 ↔ NG 196.7), D2 giysi (red ↔ pink+blue), D3 vasiyet (Dido+Sun Rising ↔ Dido+Decline), D4 Pamphili (frwiki ↔ NG doğrudan Bouillon), D5 "same size" (seri ↔ key facts), D6 Dido boyutu (230 ↔ 260). **E7 anakronizm** (titanyum beyazı) ders dışı bırakıldı; **E11** katalog-yazar (Cecchi ↔ Röthlisberger) not edildi.

**Erişilemeyen:** Smith 2009 s.33–34 (S14, Access-restricted-item: true, okunamadı); Rubiés 2001 / Sureda 2001 / Butor 2019 / Wine 2001 tam katalog / Kitson 1978 / Röthlisberger / Davies / Mills/White 1980 / Wyld 1980 / Wilson 1980 — NG/frwiki kaynakçasında anıldı, metne erişilmedi (C051). WD P528 ref'li archive.org sayfaları çekilmedi. Art UK erişilmedi (NG birincil yeterli). Ölü URL yok.

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12 AKTİF): **Q7731855 için 0 hata / 0 uyarı.** DERS.json + SORULAR.json şema geçerli; bolum_eslesme 12 bölüm; durum "İnsan incelemesi bekliyor"; kelime sayıları JSON ↔ dosya tutarlı; sayım satırı (59; A33/B7/C8/D6/E5) DERS.json ile eşit. **CJK: 0** (tüm .md/.json + uret betiği tarandı). Genel koşudaki 7 hata başka eserlerin eksik dosyalarıdır (Q1140358/Q2653851/Q531329); bu agent yalnız kendi QID dizinine yazdı, onlara dokunmadı.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 430 | 400–500 | 3 dk |
| Orta | 1310 | 1300–1600 | 10 dk |
| İleri | 2633 | 2600–3200 | 20 dk |

Üç seviye de §8 hedef aralığında; dolgu/tekrar yok (yakın tekrar + seviyeler arası birebir cümle kontrolü temiz). İleri düzey gerçekten daha derin: provenans belirsizlik zinciri, kaynak hiyerarşisi, D/E envanteri, felsefi yorum (açıkça işaretli), karşılaştırmalı metodoloji.

## 5. Görsel doğrulama (Kural 6)

Commons File:Claude Lorrain 008.jpg metadata (6000×4563, 2020-04-05, ~11,4 MiB); lisans **Public domain** (PD-Art / PD-old-auto-expired, deathyear=1682; C054). **Görsel bu oturumda İNCELENEMEDİ** (vision kotası ana oturumda; C050 E). Kompozisyon NG (A) + wiki (B/C) METNİNDEN; derslerde "kaynakların betimlediği" ifadesi kullanıldı. **GZ TASLAK.** Görsel projeye kopyalanmadı; URL + lisans + kaynak olarak referans verildi. **D2 (melike giysi rengi) ve E8 (data görsel ayrıntıları) görsel teyit olmadan çözümsüz.** İnsan editör görsel incelemesi ZORUNLU.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C050, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi zorunlu (özellikle D2 giysi rengi, E8 data ayrıntıları).
2. **D2 — melike giysisi:** NG "red" ↔ wiki "pink tunic + royal blue cloak"; görsel incelemeyle çözülmeli; ders şu an renk belirtmiyor.
3. **D3 — Turner vasiyet kapsamı:** NG Dido+Sun Rising ↔ wiki Dido+Decline; çekirdek koşul A, adlandırma D. Smith 2009 (S14 kısıtlı) + Wine 2001 tam metniyle netleştirilmeli; güncel Room 36'da Sun Rising yok.
4. **D4 — Pamphili siparişi:** frwiki anlatısı NG birinciliyle çelişiyor; frwiki'nin E7 anakronizmi (titanyum beyazı) güvenilirlik kuşkusu doğuruyor; editör frwiki'ye temkinle yaklaşmalı.
5. **D1 — genişlik:** WD 193.7 ↔ NG 196.7; NG esas (2015+2026). WD ithalatında dikkat.
6. **D5/D6:** NG içi "same size" gerilimi (key facts esas) ve Dido boyutu (NG 230 ↔ enwiki 260; çevresel).
7. **E11 — katalog yazarı:** WD "Dorothy Cecchi 1975" ↔ NG "M. Röthlisberger 1975 Milano"; kitap metinleri erişilmediğinden çözülmedi.
8. **E5 — yazıt transkripsiyonu:** frwiki transkripsiyonu birebir doğrulanamadı; NG yalnız özet + adın basamakta olduğunu doğrular.
9. **E9 — bahçe tasarımı etkisi:** data/'da var, erişilen kaynaklarda kanıtsız; ders dışı bırakıldı; data düzeltme önerisi.
10. **Veri boşlukları:** kunye.json + muze_numaralari.json Q7731855 YOK (önerilen A: 149.1×196.7, oil on canvas, NG14); sanatcilar dogum 1600 ↔ NG "1604/5?"; iki farklı TR başlık; Commons location bayat ("Sainsbury Wing Exhibition").
11. **Felsefi yorumlar (İleri §7):** Kant "güzel"/Benjamin "aura" lensleri ödünç; sanatçı etkisi iddiası YOK; editör onayı.
12. **B düzeyi atıf zincirleri:** Rubiés/Sureda/Butor/Bailey/Shanes/Moorby metinleri erişilmedi; insan editör kitap teyidi yapmalı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + quiz A/B + D/E işareti + kelime + 12 bölüm + CJK 0). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler YAPISAL tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil NG AÇILDI (4 sayfa + 2015 arşiv, A); görsel İNCELENEMEDİ (E); altı ihtilaf (D) ve anakronizm (E7) açık; insan editör görsel teyidi + kitap metni erişimi + veri boşluğu doldurma kritiktir.**