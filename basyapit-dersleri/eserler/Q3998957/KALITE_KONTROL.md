# KALİTE KONTROL — Q3998957 · Bakkhus ve Ariadne'nin Zaferi (Trionfo di Bacco e Arianna) · Annibale Carracci

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti3/Q3998957-brief.md`); ham cache `.qwen/tmp/parti3/cache/Q3998957-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q3998957 için temiz (0 hata / 0 uyarı)**.
- **Toplam iddia:** 65 (C001–C065). **A=15, B=26, C=7, D=7, E=10.**
- **A düzeyi:** birincil koruyucu kurum Fransa Büyükelçiliği S6/S7 (canlı 200) + S8 (Wayback 2015) → künye, kronoloji (döngü 1597–1608; volta açılışı 2 Haziran 1601), teknik (fresk), in situ/envanter yok, oda ölçüsü, trompe-l'oeil sistemi, restorasyonlar, 1994 deneme şeridi, işeyen putto, saray inşaatı. Kurumun epitalamik yorumu KOŞULLU kip olarak A (C013); yorumun kendisi E (C018).
- **B düzeyi:** akademik atıf zincirli ikincil (S2 Ginzburg/Posner/Martin/Dempsey/Bellori-Borea/Panofsky/Montanari/Colonna; S4 Prater; S5 Wittkower/Hoving/Wohl). Kitap metinlerine erişilmedi → zincir notlu.
- **C düzeyi (yorum):** atıfsız ayrıntılar — sfondato betimi (C027), Giambologna (C031), Perin del Vaga (C033), Urbino/NG kartonları (C034), a secco/spolvero/modelletti (C036), Lorenzo şarkısı (C048), atölye adları (C058).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU serbest (C/D/E dahil). Çeldirici gerekçeleri bağlamsal (totoloji yok). Doğru cevaplar D/E'ye dayanmaz; epitalamik yorum tek doğru cevap yapılmadı.
- **D/E işareti:** 7 D "(tartışma)", 10 E "(belirsiz)" — post-pass ile tümünde; cümle içi belirsizlik işareti denetimi temiz.
- **GZ TASLAK:** görsel incelenmedi → gen.py gz_taslak (5/5 ipucu "TASLAK" önekli).
- **Kelime tutarlılığı:** DERS.json ↔ ders dosyaları birebir (426/1425/3090); 12 bölüm eşlemesi tam.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda ham cache'ler yeniden açılıp iddialarla karşılaştırıldı (2026-11-14):
- **S6/S7 (Fransa Büyükelçiliği, canlı 200):** "1597-1608", "inaugurazione della volta ... 2 giugno 1601", "audacia ... stupisce nella Roma della Controriforma", "lunga 20 metri e larga 7", "atlanti monocromi ... marmo; medaglioni ... bronzo; quadri riportati", "decorata principalmente da Annibale ... il suo capolavoro", "la più perfetta conclusione di un secolo e mezzo d'innovazioni pittoriche in Europa", "Amori degli Dei ... Metamorfosi d'Ovidio", "celebrerebbe l'unione di Ranuccio Farnese e Margherita Aldobrandini" ✓. S7 koşullu kip ("sarebbe stata commissionata") AYNEN korundu.
- **S8 (Wayback 2015-02-26):** "Pare che ... matrimonio", "a fresco" teknik notu, "striscia chiara ... affresco centrale" (1994), "olio e cera", "Dal 15 marzo 2014 ... 12 e i 18 mesi", "Hercule et Onphale", "putto che urina ... irriverente" ✓.
- **S2 (itwiki wikitext):** "il Trionfo non è un quadro riportato ... sfondamento ... elefante ... solo la testa" (D1), "due arieti" ↔ S5 "goats" (D2), "Sileno ebbro ... mulo" ↔ S5 "ass" (D3), "puntinata" (Ginzburg s.35), "Con ogni probabilità ... Nasso" (Albertina), "Incerto è invece se ... sarcofagi" + BM 1805,0703.130, "1594 ... chiamato a Roma" (Posner) ↔ S6 "1592" (D5), infobox "1597 - 1606/1607" (D4) ✓.
- **S4 (eswiki):** "Se ejecutó entre 1597 y 1600 ... in situ" + Prater/Taschen 2005 s.227 atfı ✓ (B, metne erişilmedi).
- **S5 (enwiki):** "chariots drawn by tigers and goats", "Silenus ... rides an ass", "Metamorphoses (VIII; lines 160–182)" → trionfi.com (S17'de satır no YOK, E5), "Human Love Governed by Celestial Love" (Wohl 2005 s.84), Wittkower 1985 s.57, Hoving ✓.
- **S1 (WD):** P571 normal=1586 (ref Q465 DBpedia) ↔ preferred P1319=1597/P1326=1608 (refsiz) → D6 anomalisi doğrulandı; P217/P2048/P2049 YOK ✓.
- **S9/S10 (Commons/WGA):** 3448×1753, PD, AttributionRequired false, Credit WGA, DateTimeOriginal "between 1597 and 1608" ✓; görsel İNCELENMEDİ.
- **S11 (BM arşiv 2019):** "sarcophagus" + museum number 1805,0703.130 (KISMİ); S12 detay 404 ✓.
- **S17 (trionfi):** "indestinct ... about 1475"; VIII.160–182 satır numarası YOK ✓ (E5).

**Erişilemeyen / zayıf:** kitap tam metinleri (C054); BM detay (C046); WMF JS kabuğu (C053, kanıt olarak kullanılmadı); trionfi.com akademik değil (C048).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12, izole venv): **Q3998957 → 0 hata; 0 uyarı.** CJK: **0** (6 dosya). DERS.json + SORULAR.json şema geçerli; ek alan yok; durum enum "İnsan incelemesi bekliyor".
> Not: dogrula.py tüm `eserler/` dizinini tarar. Çıktıdaki öteki hata/uyarılar (Q1240092, Q3998985, Q512755, Q63341, Q7731855 vb.) **öteki partilerin devam eden eserlerine** aittir; bu eser kapsamında DOKUNULMADI.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 426 | 400–500 | 3 dk |
| Orta | 1425 | 1300–1600 | 10 dk |
| İleri | 3090 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok (dogrula yakın-tekrar + seviyeler-arası tekrar denetimi temiz). İleri düzey gerçekten daha derin: kanıt metodolojisi, kronoloji ihtilafları, üç şema sentezi, yorum ekolleri (Bellori/Panofsky/Dempsey/Ginzburg), alımlama tarihi (gravür kampanyaları, Tuileries, düşüş/toparlanma), açıkça işaretli felsefi yorum.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (S9): 3448×1753 px, PD (PD-Art/PD-old-100-expired), AttributionRequired false, Credit WGA (S10 HEAD). **Görsel bu oturumda İNCELENMEDİ (C055 E)** — vision kotası ana oturumda. Kompozisyon "kaynakların betimlediği" biçimde S6/S7/S8 (A) + S2/S4/S5 (B) metninden. **GZ TASLAK (5/5).** Görsel projeye kopyalanmadı; URL + lisans + kaynak referans. **İnsan editör görsel teyidi ZORUNLU** — özellikle D1 (quadro reported / sfondato), D2 (koç/keçi), D3 (katır/eşek) ve C050 görsel-bağımlı ayrıntılar (putto taç, tefli menad, koşan çocuk, altın sarısı örtü, çatlaklar).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C055, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi zorunlu.
2. **D1 quadro reported (C028, en güçlü ihtilaf):** data "quadro reported" ↔ S2 "non è un quadro riportato"; S2 paragrafı atıfsız → Ginzburg 2008 + görsel teyit ile çözülmalı.
3. **D2/D3 hayvanlar (C025/C026):** koç↔keçi, katır↔eşek; data "beyaz" metinlerde yok; görsel teyit.
4. **D4/D5/D6 kronoloji (C062/C064/C063):** panel tarihi tek ikincil (Prater); komisyon 1592↔1594; WD P571=1586 anomalisi (desteksiz).
5. **Epitalamik yorum (C013/C017/C018):** kurum koşullu kip; akademik tez tartışmalı (kronoloji, arma, Martin alternatifi); tek doğru cevap yapılmadı.
6. **Ovid satır (C047, E):** VIII.160–182 doğrulanamadı (trionfi.com zayıf zincir).
7. **data üstünlüğü (C051, E):** "Sistina'dan sonra en etkili tavan" formülü erişilen kaynaklarda yok; kurum/Wittkower formülleri tercih edildi.
8. **Literatür (C054, E):** kitap metinleri erişilmedi; atıf zincirleri notlu.
9. **Felsefi yorumlar (İleri §7):** Kant/Benjamin ödünç çerçeve; sanatçı etkilenmesi iddiası YOK; editör onayı.
10. **Küçük fark:** itwiki oda genişliği ~6 m ↔ S7/S8 7 m (C009 not); Ercole panel adı D7 (C060).

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + quiz A/B + D/E işareti + kelime + CJK). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir.** Birincil koruyucu kurum AÇILDI (A); görsel İNCELENMEDİ (E); D1–D7 ihtilafları ve E belirsizlikleri açıkça beyan edildi. data/ dosyalarına, uygulama koduna, main'e, pilot'a (Q167605) ve öteki eserlere DOKUNULMADI; commit/push/deploy YAPILMADI.
