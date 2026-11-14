# KALİTE KONTROL — Q3212142 · Vatoz (The Ray / La Raie) · Jean-Baptiste-Siméon Chardin

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti4/Q3212142-brief.md`); ham cache `.qwen/tmp/parti4/`.
**Üretim:** `.qwen/tmp/parti4/uret-Q3212142.py` (gen.build; D/E işaretleri build'den önce, idempotent).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Derslerin bütün olgusal cümleleri `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q3212142 için temiz (0 hata / 0 uyarı)**.
- **Toplam iddia:** 43 (C001–C043). **A=16, B=10, C=2, D=6, E=9.**
- **A düzeyi (birincil):** Louvre güncel notice HTML+JSON (S2/S3) + Joconde/POP (S4) + Louvre 2014 arşiv (S7) → künye, teknik, boyut, envanter, mülkiyet, konum, tür, kabul parçası, provenance, restorasyon, konu listesi, Rembrandt/Flaman karşılaştırma, modern sergiler, bibliyografya.
- **B düzeyi (atıf zincirli ikincil):** enwiki (S5) satır içi → Rosenberg 1979, Lajer-Burcharth 2022, Cottom 1999, Cohen 2004, Mulligan 2020; frwiki (S6) → Diderot 1763, Proust, Matisse. Tam metinlere erişilmedi (C038 E); DOI/ISBN/sayfa wikitext'ten aynen alındı, uydurulmadı.
- **C (yorum):** C025 telif çıkarımı (pma), C035 frwiki atıfsız betim/sembolizm. Derslerde "(yorum)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B** kanıtlı (programatik denetim: A/B dışı kanıt YOK). 5 AU serbest (A/B/D/E). Çeldirici gerekçeleri bağlamsal; totolojik (≤3 kelime "…değil") gerekçe YOK. Doğru cevaplar D/E'ye dayanmaz; yorum tek doğru cevap yapılmadı.
- **D/E işareti:** 6 D "(tartışma)" (C027–C032); 9 E "(belirsiz)" (C026, C036–C043). dogrula belirsizlik-işareti denetimi temiz.
- **GZ TASLAK:** görsel incelenmedi → gen.py `gz_taslak` 5 GZ sorusunu "TASLAK (görsel bu oturumda incelenemedi…)" ile işaretledi.
- **Etiketsiz olgu tespitçisi:** başlangıçta 20 sezgisel uyarı vardı; 4 gerçek etiketsiz cümle etiketlendi (ORTA §2 ×2, İLERİ §1 tarih kümeleri ×2), kaynakça kısaltma boşlukları ("s.", "ill.", "éd.", "C.P.I.", "kat.") sıkılaştırılarak yanlış pozitifler giderildi → **0 uyarı**.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda ham cache'ler **yeniden açıldı** (yalnız taslağı okumak sayılmaz):
- **S2/S3 Louvre (cl010065938 .txt/.json):** titre/autre titre, sanatçı (1699–1779), INV 3197/MR 1323, Salle 919 Sully Niveau 2, H 1,145/L 1,46/aksesuarlı, "huile sur toile", "2e quart du XVIIIe siècle (1728)", Historique (kabul 1728 / saisie / juin 1796 / Michau 1798 / Lepage 1952 / Goulinat 1953), Propriétaire Etat, Expositions (1979/1999/2000/2011), Bibliographie, HTML "14.10.2025" ↔ JSON "modified 2026-07-22" ✓.
- **S4 Joconde/POP 000PE000411 (.txt):** Millésime "1727 vers", genèse/historique "morceau de réception (en 1728)", "114.5 H ; 146 L", sujet "nature morte (raie, chat, poireau, poisson, huître, marmite : cuivre, bouteille, pot)", "Saisie révolutionnaire", "Date de dépôt 1851 Entrée matérielle", "place Dauphine, Paris, 1728", "WILDENSTEIN 46 ; C.P.I. 122", © Arnaudet/RMN ✓.
- **S7 Wayback 2014-03-04 (.txt):** Pomarède metni (Flaman modeller Snyders/Fyt; Proust "cathédrale polychrome"; cruche/chaudron sağ ↔ chat hérissé sol; "raie écorchée évoquant Le Boeuf écorché de Rembrandt"; "jusqu'à Matisse"; "fausse nature morte"); cartel "Vers 1725 - 1726 / H. 1,14 / Salle 38"; pendant Le Buffet; "en 1793 au Muséum central des arts" ✓.
- **S5/S6 en/fr wikitext:** Rosenberg/Lajer-Burcharth/Cottom/Cohen/Mulligan atıfları + sayfa/DOI; Diderot 3 blok + Pascal; Proust "vers 1895"/1954/éd.1971; Matisse alıntısı; atıfsız kompozisyon/sembolizm + 1896 kopya/pastiş ✓.
- **S1 Wikidata:** P571 preferred 1727 (ref Joconde) + normal 1725–1726 "circa" (P1480, base Atlas); P31 reception piece P585=1728-09-25 **referanssız**; P195 Louvre (P580=1796) + Académie (Q337579); P276 Room 919 (ref cartelfr 2016); P2048=114.5; P6216 PD; itwiki sitelink YOK ✓.
- **S16 data/ (salt-okunur):** basyapitlar[62] tarih 1727 / muze Académie; "pırasalar"+"bakır tencere" ✓, "kevgir/kepçe/sırlı testi/ışık soldan" doğrulanmadı; eser_notlari "salon izleyicisi"; onbellek lisans alanı boş ✓.

**Cache çakışması (önemli):** Parti4 ortak tmp dizininde `commons-imageinfo.json` başka bir agent'ın **Ingres (Q1978815)** çekimiyle üzerine yazılmıştı. La Raie imageinfo'su Denetim B'de Commons API'den **yeniden çekildi** → `Q3212142-commons-imageinfo.json` (200, 2026-11-14): 3565×2782, 3.496.414 bayt, PD, credit "photo Shonagon 2022-06-21", DateTimeOriginal 1727 — brief S8 değerleri **birebir teyit**. `commons-filepage.json` (S9) Q3212142'ye aitti, sağlamdı (Licensed-PD-Art|PD-old-auto-expired|deathyear=1779|cc-zero). `qid-labels.json` çakışmalıydı → `qid-labels-2.json` (S10) kullanıldı.

**Erişilemeyen (C038 E):** Cohen 2004 (MUSE verify duvarı), Cottom 1999 (403), Mulligan 2020 (403); Rosenberg 1979 / Lajer-Burcharth 2022 / Denham 2010 kitapları; Diderot 1966 / Proust 1971 / Matisse 1972 / notice bibliyografyası kitapları; S12 eski louvre.fr (404 → S7). Bu turda DOI duvarları yeniden aşılmadı (erişim durumu brief'ten kayıtlı).

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + **jsonschema Draft2020-12 AKTİF**): **Q3212142 → 0 hata, 0 uyarı.** DERS.json + SORULAR.json şema geçerli; `bolum_eslesme` 12 bölüm; `durum="İnsan incelemesi bekliyor"`; `gorsel.dogrulama.incelenen_bolgeler=[]`; kelime sayıları JSON ↔ dosya tutarlı.
**CJK taraması:** 6 teslim dosyasının tümünde **0** CJK karakteri.
**Not (global):** dogrula.py tüm `eserler/` dizinini tarar; bu paylaşımlı partide başka agent'ların **eksik** eserleri (Q1978815, Q212616, Q219344, Q29530, Q3937621, Q4388208) global "eksik dosya" hataları üretir. Bunlar Q3212142'ye ait DEĞİLDİR ve bu görevde **dokunulmamıştır**.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 414 | 400–500 | 3 dk | aralıkta |
| Orta | 1450 | 1300–1600 | 10 dk | aralıkta |
| İleri | 2861 | 2600–3200 | 20 dk | aralıkta |

Üç seviye de §8 hedef aralığında; dolgu/tekrar yok (yakın-tekrar ve seviyeler-arası ortak-cümle denetimi temiz). İleri düzey gerçekten daha derin: birincilin iç çelişkisi, provenance kilometre taşları, kurum tarihi, "mortified geometry", dokunsal boya, Diderot↔Pascal estetik gerilimi, cinsiyetli okuma, karşılaştırmalı metodoloji, tartışma envanteri.

## 5. Görsel doğrulama (Kural 6)

- **Commons (WD P18 / data onbellek):** 3565×2782 px, 3.496.414 bayt JPEG; **Public domain** `PD-old-auto-expired|deathyear=1779|cc-zero`; AttributionRequired false; credit "photo Shonagon 2022-06-21"; DateTimeOriginal 1727 (D001 notu). **İnceleme YOK** (vision kotası ana oturumda) → C043 E.
- **Louvre/RMN (S3 image dizisi) — PD DEĞİL:** © 2010 GrandPalaisRmn/Stéphane Maréchalle; © 2007/2003 Musée du Louvre Dist. GrandPalaisRmn/Angèle Dequier; Joconde © Arnaudet/RMN (utilisation soumise à autorisation); 2014 © Musée du Louvre/Angèle Dequier.
- Kompozisyon **S4/S7 (A) + S5/S6 (B) metninden**; derslerde "kaynakların betimlediği" + "(belirsiz)" işaretli. **GZ TASLAK.** Görsel projeye kopyalanmadı; URL+lisans+kaynak referansı verildi. **Commons PD ile RMN © lisansları karıştırılmadı.**

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C043, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi ZORUNLU (özellikle C026 data ayrıntıları ve C035 frwiki atıfsız betim).
2. **Tarih ihtilafı (D001/C027):** Louvre güncel 1728 ↔ Joconde "1727 vers" ↔ 2014 "Vers 1725 - 1726" ↔ WD preferred 1727/circa 1725–1726 ↔ data 1727. "vers/circa/avant" korundu; tek yıl dayatılmadı. Editör hangi ifadenin künyeye esas alınacağına karar vermeli.
3. **Boyut (D002/C028):** 114,5 ↔ 114 cm; genişlik 146 ortak.
4. **Provenance kilometre taşları (D003/C029):** 1793 giriş / 1796 sergileme / 1851 maddi kayıt; tek tarih dayatılmadı.
5. **Salon (D004/C030):** 919 ↔ 38; site uyarısı (C042/E001) konumun güncel olmayabileceğini söylüyor.
6. **data/ müze alanı (D005/C031):** "Académie royale" (tarihsel sahip) ↔ güncel Louvre. **data düzeltme önerisi insan onayına** (data DEĞİŞTİRİLMEDİ).
7. **Notice metadata (D006/C032):** HTML 14.10.2025 ↔ JSON 2026-07-22.
8. **data/ doğrulanmamış ayrıntılar (E003/C026, E009/C039, E010/C040):** kevgir/kepçe/sırlı testi/ışık yönü; "salon izleyicisi"; Cézanne öncülük / kedi-Flaman / türler hiyerarşisi. Görsel teyit + kaynak gerekli.
9. **frwiki atıfsız alımlama (E004/C041):** Matisse 1896 kopyası (Cateau-Cambrésis) + Boudin/Soutine pastişleri doğrulanmadı.
10. **Wildenstein numaralama (E006/C036):** "WILDENSTEIN 46" ↔ "1933 ill.74 n°678"; açıklanamadı.
11. **Literatür (C038, E):** akademik tam metinler erişilmedi; B iddiaları atıf zincirli. Haricî editör tam metin teyidi yapmalı.
12. **Yorumlar (C022 B, C035/C025 C):** cinsiyetli okuma, frwiki betimi, telif çıkarımı, İleri §7 Diderot↔Pascal estetik yorumu — olgulardan ayrıldı; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı: temel kimlik/atıf birincil kaynakla doğrulandı · tüm olgusal cümleler kanıt kayıtlı · yorumlar olgulardan ayrıldı · quiz cevapları A/B'ye dayanıyor · kaynak bağlantıları erişim durumlarıyla kayıtlı · ciddi çelişkiler (6 D) açıkça belirtildi · Denetim A + B tamamlandı.
**ANCAK görsel analiz doğru eser/görselle YAPILMADI (İNCELENMEDİ) ve haricî model/insan editör denetimi eksik.** Bu nedenle **durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî denetim ayrıca gereklidir.
**Birincil Louvre + Joconde AÇILDI (A); görsel İNCELENMEDİ (E); insan editör görsel teyidi + data düzeltme onayı + literatür tam metin teyidi kritiktir.**
