# KALİTE KONTROL — Q1140358 · Arkadya'da Ben de Varım (Et in Arcadia ego / Les Bergers d'Arcadie) · Nicolas Poussin · Louvre (İKİNCİ versiyon)

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti3/Q1140358-brief.md`; ham cache `.qwen/tmp/parti3/`).
**Kapsam:** TEK eser = Q1140358 (Louvre ikinci versiyon). Chatsworth ilk versiyon AYRI öğe Q11919094; karıştırılmadı.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q1140358 için temiz (0 hata / 0 uyarı)**.
- **Toplam iddia:** 63 (C001–C063). **A=19, B=19, C=2, D=17, E=6.**
- **A düzeyi (19):** Louvre birincil notice + JSON (S2/S3) ve Joconde POP (S4): künye, "vers 1638", huile sur toile, 85×121, INV 7300/MR 2339, Salle 825, tam provenance (Rospigliosi→Avice→Hérault→Louis XIV 1685→Versailles→Louvre 1816→Petit Palais 1950), teknik (toile sergée 21×10, brun-rouge, bantlar), restorasyon kronolojisi, Picart gravürü, Chateaubriand 1828, sergiler, bibliyografya kaydı, Chatsworth (Louvre commentaire).
- **B düzeyi (19):** satır içi akademik atıflı ikincil (Panofsky/Mérot commentaire Louvre'un atfı olarak; Bellori/Félibien; Brandt/Becht-Jördens–Wehmeier; Barker Cesi Juno; Verdi; Shugborough; edebi kaynak Vergilius/Sannazaro). **Metinlerine erişilmedi** → C060 E.
- **C düzeyi (2):** C010 (WD P180/JocondeLab betim), C062 (WD öğe haritası) — yardımcı gözlem, "(yorum)" işaretli.
- **D düzeyi (17):** C042–C058 (D01–D16 + E06 dilbilgisi). Her biri "(tartışma)" işaretli; kesin cevaplı soruya girmez.
- **E düzeyi (6):** C023 (atıfsız "bugün en kabul"), C025 (ezoterik anagram, fringe), C028 (itwiki Fouquet, **kullanilmadi**), C059 (görsel incelenmedi), C060 (metinler erişilmedi), C061 (kadın kimliği uzlaşımsız). "(belirsiz)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU (C/D/E dahil, serbest). Çeldirici gerekçeleri bağlamsal (totoloji yok). Doğru cevaplar D/E'ye dayanmaz; yorum tek doğru cevap yapılmadı.
- **E/D işareti:** post-pass D→"(tartışma)", E→"(belirsiz)"; tüm D/E alıntıları cümle içi belirsizlik işareti taşır (dogrula BELIRSIZLIK kontrolü temiz).
- **GZ TASLAK:** görsel incelenmedi → gen.py gz_taslak (5 GZ ipucu "TASLAK" önekli).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Ham cache 14 Kasım 2026'da yeniden okunup iddialarla karşılaştırıldı (taslağı yeniden okumak değil, kaynağa dönüş):
- **S2/S3 (Louvre notice + JSON, 200):** künye/provenance/teknik/restorasyon/Picart/sergiler/bibliyografya + **Panofsky/Mérot commentaire** ✓. Birincilin iç metadata tutarsızlığı: HTML 03.09.2025 ↔ JSON modified 2026-08-11 (C056 D).
- **S4 (Joconde POP, 200; gömülü __next_f payload decode):** künye ✓; APTN "Avice chevalier d' (?)" + Rospigliosi yok (C046 D); yıl alanı YOK (E12); PHOT RMN izinli (E14).
- **S5 (utpictura18 #000973, 200):** 1638, 85x121, yazıt annotation, bantlar (+4,5 cm sağ → C045 D), "Reproduction interdite" (E13).
- **S6/S7/S8/S9 (fr/de/en/it wikitext, 200; en 429→backoff→200):** ikonografi/yorum/resepsiyon ✓; **itwiki 122 cm hatası (C053 D) ve Fouquet provenance (C054 D) reddedildi** (A zinciri esas).
- **S1/S12/S13/S14 (WD):** P571=1638 yıl precision/P1480 yok; P195=Q3044768 (Department of Paintings); öğe parçalanması (C062).
- **S11 (Commons metadata):** 10925×7605 px, PD; **görsel İNCELENMEDİ** (C059 E).

**17 ihtilaf D açıkça beyan edildi** (C042–C058). **Erişilemeyen:** kitap/makale metinlerinin tümü (C060); Chatsworth birincil kaydı (kapsam dışı); üçüncü taraf dış linkler çekilmedi.

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12 AKTİF): **Q1140358 için 0 hata / 0 uyarı.** DERS.json + SORULAR.json şema geçerli; bolum_eslesme 12 bölüm; iddia/kaynak kimlikleri eşleşiyor; mükerrer kimlik yok; quiz A/B kuralı temiz; kelime tutarlılığı (json ↔ ölçülen) temiz. **CJK: 0.**
- Genel dogrula toplamındaki hatalar (≈186) **eşzamanlı çalışan başka parti eserlerine** aittir (Q1131176, Q18167078, Q2629559, Q3399440, Q4693305, Q531329 vb. eksik/kısmi dosyalar); Q1140358'e ait HATA/UYARI satırı YOK. Bu eserlere dokunulmadı.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 427 | 400–500 | 3 dk | aralıkta ✅ |
| Orta | 1396 | 1300–1600 | 10 dk | aralıkta ✅ |
| İleri | 2741 | 2600–3200 | 20 dk | aralıkta ✅ |

**Not:** Kelime hedefleri §8 gereği tahmindir; bu eserde birincil Louvre commentaire'i (Panofsky/Mérot/Verdi/teknik) ve zengin resepsiyon/tartışma malzemesi sayesinde hedef aralıklar **dolgu/tekrar olmadan** karşılandı. Kanıt yetersiz olan yerlerde (görsel betim, kadın kimliği, gölge-atfı) kapsam azaltıldı/belirsiz bırakıldı, uydurma yapılmadı.

## 5. Görsel doğrulama (Kural 6)

Commons PD dosyası (WD P18): 10925×7605 px, ~30,3 MB, "photo Shonagon 2024-02-15", PD-Art/PD-old-100-expired (AttributionRequired false). **Görsel bu oturumda İNCELENMEDİ** (vision kotası ana oturumda) → **C059 E; GZ TASLAK.** Kompozisyon/ikonografi betimi Louvre commentaire (S2, A) + utpictura (S5, B) + wiki (S6–S9, B) **METNİNDEN**; doğrudan gözlem değil, "kaynakların betimlediği" + "(belirsiz)" işaretli.
- **Louvre/RMN fotoğrafları PD DEĞİL, izinli** (E14; S3 image dizisi 6 adet, © GrandPalaisRmn/Stéphane Maréchalle / Angèle Dequier). Ders görseli olarak yalnız Commons PD dosyası referans verilir; Louvre/RMN fotoğrafları yeniden yayımlanmaz.
- utpictura notice metni "Reproduction interdite" (E13): yalnızca kanıt olarak kullanıldı, metin kopyalanmadı.
- Görsel projeye kopyalanmadı; URL + lisans + kaynak referans. **İnsan editör görsel teyidi ZORUNLU** (özellikle gölge-atfı C048, figür sayımı E10, renk/yüzey E15).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C059, E):** İNCELENMEDİ; GZ TASLAK; insan editör görsel teyidi zorunlu. data'nın görsel betimlemeleri (ışık soldan, renkler, jestler, "üç çoban" sayımı) doğrulanmadı.
2. **Gölge-atfı (C048, D07):** en/fr "companion" ↔ data "diz çöken çoban"; görsel + akademik metin teyidiyle çözülmeli.
3. **Tarih (C042, D01):** data "1637–39" → 1639 bitişi desteksiz; Louvre "vers 1638" esas; data düzeltme önerisi insan onayına.
4. **itwiki hataları (C053/C054, D12/D13):** 122 cm (birincil 121) ve Fouquet provenance (A zincirinde yok) reddedildi; S9'dan beslenilmedi.
5. **Kadın figürü kimliği (C061, E05):** uzlaşımsız (Cesi Juno/Pictura/Daphne-Laura/çoban kadın); tek kimlik dayatılmadı.
6. **Dilbilgisi tartışması (C058, E06):** Panofsky "şimdiki tek doğru" ↔ Brandt "geçmiş mümkün/kasıtlı"; kesinleştirilmedi.
7. **Provenance derinliği (C046, D05):** Louvre Rospigliosi ↔ Joconde "Avice (?)"; kurumlar arası fark.
8. **Literatür (C060, E):** Panofsky/Mérot/Verdi/Brandt/Barker vb. metinleri erişilmedi; atıflar erişilen kayıtların bibliyografyasından aktarıldı (ISBN/sayfa bağımsız doğrulanmadı).
9. **Felsefi yorumlar (İleri §7):** açıkça "(yorum)" etiketli, olgusal iddia sayılmaz; editör onayı.
10. **WD öğe parçalanması (C062):** Q1140358/Q11919094/Q15805858/Q111318187; en/it sitelink anomalisi; QID eşlemesi teyidi.
11. **Diğer D ihtilafları:** Chatsworth tarih/boyut (C043/C044), bantlar (C045), Guercino yeri (C047), anıt tarihi (C049), Plinius lokusu (C050), Sannazaro tarihi (C051), tür (C052), bugünkü yorum (C055), güncelleme tarihi (C056), Brandt baskı (C057).

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + kelime + CJK + quiz A/B). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu GARANTİ ETMEZ. Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir** (AKADEMIK_STANDART §11–12).
- **Birincil Louvre AÇILDI (A)** — künye/provenance/teknik/restorasyon/commentaire güçlü.
- **Görsel İNCELENMEDİ (E)** — GZ TASLAK; insan editör görsel teyidi kritik.
- **17 ihtilaf (D) + 6 belirsizlik (E) açıkça beyan edildi**; data "1637–39" ve itwiki hataları veri notu olarak insan onayına sunuldu (data DEĞİŞTİRİLMEZ).
- Kitap/makale metinleri erişilmedi (C060); yorumlar olgulardan ayrıldı.