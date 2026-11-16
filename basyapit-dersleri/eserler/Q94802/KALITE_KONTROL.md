# KALİTE KONTROL — Q94802 · Orgaz Kontu'nun Gömülmesi (El entierro del señor/conde de Orgaz) · El Greco

**Tarih:** 14 Kasım 2026 · **Parti:** 2 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ (ham cache üzerinden bağımsız geri dönüş) · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti2/Q94802-brief.md`); üretim betiği `.qwen/tmp/parti2/uret-Q94802.py`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Üç dersteki olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 82 (C001–C082). **A=15, B=27, C=12, D=11, E=17.** Brief'in C001–C037'si ile D01–D11/E01–E15'i AYNEN korundu (C038–C048 = D, C049–C063 = E; circa/[sic]/probablemente/presumably/sarebbe/Se cree/pudiera ser dahil). C064–C082 ders yazımında ham cache'lerden doğrulanan yeni iddialar.
- **A düzeyi:** Santo Tomé birincil kaydı (S7/S6): başlık, sözleşme, teslim, takdir/ödeme, mucizenin tanınması, epitaf, vasiyet, dava, 1975 restorasyonu, iki dünya betimi, mucize anlatısı, kariyer, tuval desteği, envanter yokluğu + Commons dosya lisansı (S5).
- **B düzeyi:** DBE/RAH biyografisi (S9, Wayback 2024-12-25), en/it/es wikitext (S2/S3/S4), WGA (S11); akademik atıf zinciri "kaynakçada anıldı, metne erişilmedi" notuyla (C079).
- **C düzeyi:** Wikidata/infobox türevi künye alanları + yorum okumaları; derslerde "(yorum)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B kanıtlı** (spot-check: 0 ihlal); 5 AU serbest (C/D/E dahil). Yanlış seçenek gerekçeleri bağlamsal (totoloji yok; dogrula totoloji kontrolü temiz). CS02/CS03/CS06 kaynak-atıflı sorulardır ("birincil siteye göre", "enwiki'ye göre") — D ihtilaflarının kendisi doğru cevap yapılmadı.
- **D/E işareti:** 11 D "(tartışma)", 17 E "(belirsiz)" post-pass ile her kullanımda işaretli; dogrula belirsizlik kontrolü temiz.
- **GZ TASLAK:** görsel incelenemedi → gen.py `gz_taslak` 5 sorunun ipucunu TASLAK ön ekiyle işaretledi.
- **Kelime/tekrar:** üç seviye hedef aralıkta; yakın tekrar ve seviyeler arası birebir cümle tekrarı uyarısı yok (§8 dolgu yok).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Brief'e güvenilmedi; ham cache'ler 2026-11-14'te ders yazımı sırasında **yeniden açılıp** iddialarla karşılaştırıldı:
- **S7/S6 (birincil, 200):** sözleşme "15 de Marzo de 1586 ... Don Alonso", teslim "primavera de 1588", takdir "1.200 ducados ... Luis de Velasco y Hernando de Nunciva", Consejo kararı, mucize 1583, epitaf Alvar Gómez de Castro, vasiyet "2 carneros, 16 gallinas, 2 pellejos de vinos, 2 cargas de leña y 800 maravedíes", dava 1564/1569, 1975 I.C.R.O.A. + yer değişikliği, iki dünya + ışık/renk betimi, kariyer (Kreta→Venedik/Tiziano→Roma→Toledo 1577), mucize anlatısı + "tal galardón..." sesi ✓. Ana sayfa "Parroquia del Greco" ✓.
- **S2/S3/S4 (wikitext):** 18 Mart 1586 + Noel 1587 (enwiki); 13.200 reales; Jorge Manuel + 1578; Deesis; II. Felipe; Dormition/Wethey/Schroth/Philipp; Einstein/Pisa 1612; 1940 banknot; itwiki Yunanca imza [sic] + "sarebbe"; eswiki sözleşme alıntısı, 1513 vasiyeti, 1700 duka retakdir, 30 Mayıs/20 Haziran 1588 + 1590, koruma tarihi, teşhis gradyanı, türevler (Jorge Manuel/Meléndez/Calleja/Renau/Picasso) ✓.
- **S9 (DBE Wayback 2024-12-25):** "Toledo, c. 1260 – 9.XII.1323", görevler, Esteban Illán/Pedro Paleólogo "emparentado", 1220 satın alma, vakıf/vaız geleneği, "Que no toquen manos de la tierra...", 1551/1569 kararları, Real Ejecutoria (legajo 32), 1570 epitaf, "5 x 3,5 m ... (1586)", kaynakçada "18 de marzo de 1586" protokol, 2001 mezar, 19. yy sonu yeniden keşif ✓.
- **S11 (WGA):** "1586-88, Oil on canvas, 480 x 360 cm", "presumably", real/super-real sentezi, Gibbons Te Deum önerisi ✓. **S13 (belediye Wayback 2026-08-09):** "no fue conde, sino IV Señor", 1520 (17 Mayıs) Carlos V, 1220 merced anlatısı, ideolojik ton ✓. **S1 (Wikidata):** P571=1586 prec.9 ref DBpedia; P217 yok; P136/P180/P6216 ✓. **S5 (Commons):** 2 dosya PD, AttributionRequired false, boyut/oranlar ✓.

**Denetim B bulguları (brief düzeltmeleri/ekleri):**
1. **Şapel adı atfı:** brief künyesi "capilla de la Concepción"ı S7'ye (A) atfediyordu; S7 yalnız "capilla del señor de Orgaz" der. Concepción adı S9 (DBE) + S4'te → **B** olarak düzeltildi (KANIT §5.4).
2. **Takdirci gerilimi (yeni):** S7 "Velasco + Nunciva 1.200" ↔ S4 "Greco kendi değerlemesi 1200; iki ressam 1700 retakdir". Sonuç aynı; ders her iki anlatıyı atıfla verir (KANIT §5.3).
3. **Señorío kökeni (yeni):** S9 satın alma ↔ S13 kraliyet merced'i (ikisi de 1220); atıfla verildi, tek versiyon dayatılmadı (KANIT §5.9).
4. **Alt bölge ışığı (yeni nüans):** S7 "altı meşale" (E07) ↔ S4 "ışık giysilerden"; betim farkı beyan edildi (KANIT §5.10).
5. **Yeni iddialar:** 1513 öncül tablo vasiyeti, ödeme kronolojisi (1590), Pisa 1612, Einstein, türevler, koruma tarihi, Mudéjar kule, 2001 mezar açılımı — hepsi erişilen cache'lerde pasaj düzeyinde doğrulandı (C064–C082).

**Erişilemeyen:** DBE canlı (JS kabuğu) → Wayback; belediye canlı (429) → Wayback; akademik refs metinleri (Kagan/Schroth/Davies/Philipp/Byron/Lambraki-Plaka/Wethey/San Román/Álvarez Lopera vb.) — "kaynakçada anıldı, metne erişilmedi" (C079 E); DOI/ISBN doğrulanmadı. Arşiv tarihleri (2024-12-25 / 2026-08-09) künyelerde beyanlı.

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12 **AKTİF**, `.qwen/tmp/venv-dogrula`): **Q94802 için 0 hata / 0 uyarı.** (Toplam koşudaki 54 uyarı öteki eserlere aittir; bu çalışmada dokunulmadı.) CJK taraması (7 dosya): **0**. DERS.json + SORULAR.json şema geçerli; bolum_eslesme 12/12; durum "İnsan incelemesi bekliyor"; `gorsel.dogrulama.incelenen_bolgeler=[]`.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 416 | 400–500 | 3 dk |
| Orta | 1329 | 1300–1600 | 10 dk |
| İleri | 3119 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok. İleri ders gerçekten daha derin: belge zinciri, kaynak eleştirisi, kompozisyon modelleri münazarası, teşhis gradyanı, küratöryel vaka.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (2 dosya: 2504×3117 + 1316×1612; PD-Art/PD-old-100-expired; atıf zorunlu değil). **Görseller İNCELENEMEDİ (C080 E)** — vision kotası ana oturumda. Renk/biçim/ışık/kompozisyon hakkında doğrudan gözlem yazılmadı; tüm betimler "kaynakların betimlediği" çerçevesiyle S7 (A) + S2/S3/S4/S9/S11 (B/C) metnine atıflı. **GZ TASLAK** (5/5). Dosya en-boy oranları (≈0,803/0,816) kayıtlı 0,75 ile uyuşmuyor (C060/E12) — çerçeve/kırpma olabilir; görsel incelemede kontrol edilmeli. Görsel projeye kopyalanmadı; URL + lisans + kaynak referansı verildi.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C080, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi ZORUNLU (özellikle E11 okuyan rahip, E14 Vaftizci çıplaklığı, D08 otoportre konumu, E12 dosya oranları).
2. **11 ihtilaf (D, C038–C048):** tarih (1586↔1586–1588), sözleşme günü (15↔18 Mart), teslim şartı (Noel 1586↔1587), boyut (480×360↔5×3,5 m), mucize tarihi (1323↔1327), görevler, kontalık yılı (1520↔1522), otoportre, imza okunuşu, kompozisyon modelleri, aziz giysileri. Hiçbiri quiz doğru cevabı yapılmadı.
3. **15+2 belirsizlik (E):** "Don Alonso" kimliği (E02), koşullu teşhisler (E03/E04), Quiroga kesinliği (E05), P180 Assisi desteksiz (E06), birincil-only detaylar (E07: altı meşale, zırhta yüz yansıması, "ilk empresyonist"), ruh çerçevesi (E09), Palaiologos soy↔akrabalık (E10), şapel mimarı "probablemente" (E13).
4. **Takdirci gerilimi (yeni):** S7 ↔ S4 takdir süreci anlatıları; editör birincil site ile eswiki'yi karşılaştırmalı (KANIT §5.3).
5. **data/ uyuşmazlıkları (salt-okunur notlar):** data içi tarih tutarsızlığı (1586 ↔ 1586–1588); imza/otoportre/giysi/rahip/Vaftizci betimleri (KANIT §5.1–2, 5–8); iki farklı Commons dosyası kullanımı (hata değil). Data dosyalarına YAZILMADI; düzeltme önerileri insan onayına sunulur.
6. **Literatür (C079, E):** akademik refs metinleri erişilmedi; B iddiaları atıf zinciri üzerinden (Kagan/Schroth/Davies/Philipp/Byron/Wethey/Lambraki-Plaka). Haricî denetimde özgün metinlerle teyit önerilir.
7. **Felsefi/estetik yorumlar (İleri §7):** "ölümün doğum olarak kurgulanması", merhametli yargı, didaktik estetik — açıkça "(yorum)" etiketli; sanatçı-etkilenimi iddiası yok (§7). Einstein alıntısı B (kaynakçada anıldı).
8. **Belediye kaynağı (S13):** ideolojik tonlu; yalnız genealojik/hukuki bilgi atıfla kullanıldı — editör uygunluğu onaylamalı.

## 7. Yayına adaylık

Otomatik kısım sağlandı: kimlik/atıf birincil kayıtla doğrulanmış · tüm olgusal cümleler kanıt kayıtlı · yorumlar olgulardan ayrılmış · quiz cevapları A/B iddialara dayanıyor · kaynak bağlantıları erişim durumlarıyla kayıtlı · ciddi çelişkiler açıkça belirtilmiş · Denetim A + B (cache üzerinden) tamamlanmış. **ANCAK görsel analiz doğru eser görseliyle YAPILMADI (C080) ve refs metinlerine erişilmedi (C079); bu yüzden §12'nin "görsel analiz doğru eser/görselle yapılmış" koşulu sağlanmıyor.**

**Durum: "İnsan incelemesi bekliyor" — "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. Yayın öncesi zorunlu: (a) görsel inceleme + GZ TASLAK'ların kesinleştirilmesi, (b) D/E noktalarının editör kararı, (c) refs metinleriyle B iddialarının teyidi, (d) data/ uyuşmazlıklarının onaya sunulması.
