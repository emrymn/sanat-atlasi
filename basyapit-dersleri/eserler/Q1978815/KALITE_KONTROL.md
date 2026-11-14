# KALİTE KONTROL — Q1978815 · Büyük Odalık (La Grande Odalisque) · Ingres

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti4/Q1978815-brief.md`).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 56 (C001–C056). **A=22, B=15, C=5, D=7, E=7.**
- **A düzeyi:** Louvre collections notice HTML+JSON (S6/S7), Joconde/POP (S8), Louvre 2008 EN arşiv (S9) — künye/konu/provenans/sipariş/Salon 1819/betim/imza yeri/gravür.
- **B düzeyi:** PMC tam metni (S10, ölçüm + Kératry aktarımı); en/it/fr wiki kaynaklı maddeleri (atıf zincirleri erişilemedi, not edildi).
- **C düzeyi (yorum):** C030 (neoklasisizm→romantizm okuması), C034 (Flandrin atıfsız), C039 (PD/lisans), C055 (itwiki-only betim), C056 (atıfsız poz/etki önerileri). Tüm C cümleleri "(yorum)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B** kanıtlı (dogrula A/B kontrolü temiz); 5 AU serbest (C/D/E dahil). Hiçbir doğru cevap D/E'ye dayanmıyor; yorum tek doğru cevap yapılmadı.
- **D/E işareti:** 7 D "(tartışma)" (C041–C047), 7 E "(belirsiz)" (C048–C054); post-pass + inline işaretler temiz.
- **GZ TASLAK:** görsel incelenemedi → gen.py `gz_taslak` tüm GZ ipuçlarına "TASLAK" öneki ekledi.
- **Çeldirici gerekçeleri:** gerçek bağlamsal gerekçe (totoloji yok); dogrula totoloji kontrolü temiz.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda ham cache'ler yeniden açıldı ve iddialarla karşılaştırıldı (14 Kasım 2026):
- **S6/S7 (Louvre HTML+JSON, 200):** titre, Ingres 1780–1867, 1814, huile sur toile, 0,91×1,62 m / aksesuarlı 1,372×2,067, RF 1158, Etat, achat 1899, Salle 702 Daru, "Peint pour Caroline Murat … Salon de 1819", betim, imza "Pxit" ✓.
- **S8 (Joconde/POP, 200):** "commandé par la reine Caroline de Naples en 1813", "Italie ; Rome", "reproduit en gravure", provenans adları, sergiler 1819/1846/1867/1874, imza "Pat", Wildenstein "93" ✓.
- **S9 (2008 Wayback, arşiv 2008-01-18):** "imaginary Orient", "most famous nude", Caroline Murat 1813, "probably … La Dormeuse de Naples, destroyed in 1815", Rome 1806/Italy 1824, David teacher, "long sinuous lines … even light … cold harmony … blue drapery … gold", "Mannerist … perhaps … Persian", Canova, imza "P. AT" ✓.
- **S10 (PMC tam metin, 200):** Kératry "three [lumbar]"; ölçüm "five, rather than three"; sırt +8,20 / pelvis +6,77 / toplam 14,97 cm; 9 model, perspektif %9.4/%4.7; eğrilik+rotasyon yeniden üretilemedi; sol kol kısa; "may well … gulf"; DOI 10.1258/jrsm.97.7.342 ✓.
- **S3/S4/S5 (en/it/fr wikitext, 200):** infobox 88,9×162,56; "first shown in 1814" ↔ "Salon of 1819" iç çelişki; "two or three"/"tre"/"trois, voire cinq"; "deliberate distortions"; Récamier/Giorgione/Titian; Rokeby/Fornarina/Parmigianino/Bronzino; "circa dieci anni"; Flandrin/Raysse/Modigliani/Guerrilla; refnec; DOI 10.1177/… + "Juillet 2024" ✓.
- **S11/S12 (Commons metadata):** RF 1158 9311×5196 PD (Shonagon 2025); önceki 2200×1225 PD (wartburg.edu) ✓. **Görsel İNCELENMEDİ.**
- **Yedi ihtilaf D (C041–C047)** ve **yedi belirsizlik E (C048–C054)** açıkça kayıtlı; hiçbiri kesin cevaplı soruya girmedi.

**Erişilemeyen (C049):** Visone 2012 (403), Met 849438 (429/Incapsula), Tate (içerik kayması), louvre.fr/oeuvre-notices + cartelen (yönlendirme); kitaplar/makaleler yalnız erişilen kayıtların bibliyografyasında (Amaury-Duval, Kératry, Weston, Benjamin, Gardner, Hautefeuille, Shelton, Mernissi, Wilder, Apolloni, Lo Jacono, Cuzin, Cuzin & Salmon, Burnod, Massonaud, Ockman, Rosenblum, Delaborde, Wildenstein).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12, `.qwen/tmp/venv-dogrula`): **Q1978815 için 0 hata, 0 uyarı.** CJK: **0** (4 dosya tarandı). `bolum_eslesme` 12 bölüm; `durum="İnsan incelemesi bekliyor"`; `gorsel.dogrulama.incelenen_bolgeler=[]`.
- Not: dogrula.py tüm `eserler/` dizinini tarar. Genel çıktadaki 12 hata / öteki uyarılar parti4'teki **başka** eserlere aittir (Q212616, Q219344, Q29530, Q3937621, Q4388208 — eksik dosyalar; Q700834 vb. kelime uyarıları). Bu eserlere **dokunulmadı**.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 412 | 400–500 | 3 dk |
| Orta | 1317 | 1300–1600 | 10 dk |
| İleri | 2643 | 2600–3200 | 20 dk |

Üç seviye de §8 hedef aralığında; dolgu/tekrar yok (dogrula yakın-tekrar ve seviyeler-arası tekrar kontrolleri temiz). İleri düzey gerçekten daha derin: kaynak eleştirisi, ölçüm yöntemi, oryantalizm/bakış kuramı, alımlama tarihi, D/E envanteri.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (S11/S12, iki dosya PD); **vision kotası ana oturumda → bu oturumda İNCELENMEDİ (C048 E).** Kompozisyon/biçim/ikonografi betimleri "kaynakların betimlediği" çerçevesinde S6/S7 (A) + S9 (A) + S4/S5 (B/C) METNİNDEN. **GZ TASLAK.** Louvre resmî fotoğrafları telifli (© GrandPalaisRmn / Franck Raux, Hervé Lewandowski) → kullanılmadı, yeniden yayımlanmadı; Commons PD dosyası URL + lisans + kaynak olarak referans. Görsel projeye kopyalanmadı. **İnsan editör görsel teyidi ZORUNLU** (özellikle imza hotspot konumu C044, "nargile"/tütsü sehpası C046/C055, kompozisyon detayları).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C048, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi zorunlu.
2. **Yedi ihtilaf (D, C041–C047):** boyut (enwiki 88,9×162,56 ↔ birincil 91×162), ilk sergileme (enwiki "1814" iç çelişkisi ↔ Salon 1819), omur sayısı (2–3/3/5), imza transkripsiyonu (Pxit/Pat/P.AT), Wildenstein no (205↔93), çubuk (nargile↔chibouk), notice güncelleme (06.09.2023↔2026-08-11).
3. **data uyuşmazlıkları:** "nargile" + "tütsü sehpası" (C046/C055), imza "divanın alt kenarında silik" + hotspot (C044), "Doğu'ya hiç gitmedi" (C050), "çizginin simgesi" + "Manet'den Picasso'ya etki" (C051). data/ değiştirilmedi; düzeltme önerisi onaya sunulur.
4. **Erişilemeyen kaynaklar (C049):** Visone/Met/Tate + kitaplar; B atıf zincirleri birincil olarak doğrulanmadı.
5. **Mernissi yorumu (C021, B):** "gerçek odalıklar giyinikti" + "distorted/lascivious bakış" — atıflı yorum, tarihsel olgu değil; editör onayı.
6. **Erotik nü betimi:** akademik ve açık ayrıntısız; cinsel detay üretilmedi; figürün sunumu oryantalizm/bakış eleştirisi bağlamında. Editör dil uygunluğunu teyit etmeli.
7. **Felsefi yorumlar (İleri §7):** Kant/Benjamin ödünç çerçeve, kurum dışı; Ingres etkilenmesi iddia edilmedi; editör onayı.
8. **Salle 702 güncelliği (C054, E):** müze bandı çekincesi korunmalı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + kelime + CJK + quiz A/B). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir.** Birincil Louvre + Joconde + 2008 arşiv AÇILDI (A); PMC tam metin ERİŞİLDİ (B); **görsel İNCELENMEDİ (E) → insan editör görsel teyidi + D/E noktalarının editoryal kararı kritiktir.**
