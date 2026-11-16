# KALİTE KONTROL — Q764831 · Aziz Nicholas Yortusu (Het Sint-Nicolaasfeest) · Jan Steen

**Tarih:** 14 Kasım 2026 · **Parti:** 3 (M8) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti3/Q764831-brief.md`).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 59 (C001–C059). **A=29, B=6, C=3, D=5, E=16.**
- **A düzeyi:** Rijksmuseum güncel S5 + 2012 ARIA S6 + 1909 katalog S7 (künye/konu/provenans/imza/gravürler/biyografi başlığı) + müze kısa açıklaması (C053) + ARIA başlık varlığı (C054).
- **B düzeyi:** Kleiner atıf zinciri (C028, C040) + Cole 1893 betim/biyografi/Hogarth karşı-nüansı (C050, C051, C052) + WD yapısal gözlem (C056). Kitap metinlerine erişilmedi; zincir notuyla.
- **C düzeyi (yorum):** C057 (ahlak pedagojisi), C058 (jest dramaturjisi), C059 (Hegel/Benjamin ödünç). Olgusal anlatımdan ayrı, "(yorum)" işaretli.
- **D düzeyi (tartışma):** C041 (D001 tarih), C042 (D002 ayakkabı), C043 (D003 versiyon), C044 (D004 saat), C045 (D006 inç). "(tartışma)" işaretli; kesin quiz cevabına girmez.
- **E düzeyi (belirsiz):** 16 iddia (atıfsız betimler, erişilemeyen kaynaklar, görsel, literatür). "(belirsiz)" işaretli; kesin anlatıma ve doğru cevaba girmez.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU serbest (C/D/E dahil). dogrula: A/B dışı quiz kanıtı YOK.
- **Çeldirici gerekçeleri:** totoloji yok; her yanlış seçeneğin bağlamsal gerekçesi var (dogrula totoloji kontrolü temiz).
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak otomatik (5/5 ipucu "TASLAK" önekli).
- **D005 (Türkçe başlık)** iddia üretilmeden veri notu olarak bırakıldı (§5).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Ham cache'ler bu oturumda YENİDEN açılıp iddialarla karşılaştırıldı (yalnız taslak okuma değil):
- **S5** (Rijksmuseum güncel, `Q764831-rijks-text.txt` + NUXT): sanatçı/başlık/"1665 - 1668"/"olieverf op doek"/SK-A-385/Eregalerij + "HasMuseumLocation","2.30"/"signatuur, JSteen"/Beschrijving/konu "Eve (December 5)"/"genrestuk"/Verwerving (1809+1975)/"Publiek domein"/kalıcı URL/Documentatie/"geboren verteller" ✓. **Güncel sayfada boyut alanı YOK** teyit.
- **S6** (2012 ARIA, `Q764831-aria-2012-text.txt`): "c. 1663-65"/"Oil on canvas"/"82 x 70,5 cm"/"Room 11: Jan Steen"/"found the cane in his shoe"/"holds the shoe up triumphantly"/"Perhaps… hidden behind the curtain"/10 bölüm başlığı ✓.
- **S7** (1909 katalog, djvu.txt): no. 2237 "D. 82 X 70,5… gem. rechts beneden op den grond… Réveil/de Mare/Boland/Cole sc… Verk. Seger Tierens 's Gravenhage 1743. Kabinet van Heteren 1809"; giriş "voor één ton gouds… A. L. Gevers… 137… schilderijen"; biyografi "omstr. 1626… 3 Febr. 1679… Knupfer… Jan v. Goyen"; no. 2232 "De Schilder zelf" ✓.
- **S2/S3/S4** (en/nl/fr wikitext): "left empty" (S2) + "chaussure vide" (S4) ↔ "roe" (S3); Kleiner ref'leri; "copy… for a Catholic" (S2) ↔ "tweede, afwijkende versie… 1660" (S3); "is said to" değil S2'de yok, S14'te ✓.
- **S14** (Cole 1893): "33½ inches… 27 inches"/"is said to represent the family"/"a rod in pickle"/renk betimi/"compared to Hogarth… no affectation of moralizing"/biyografi ✓.
- **S1** (WD): P571 precision 8 + P1319 1665/P1326 1668, P1480 YOK; P217 SK-A-385; P195 Q190804 (P580 1809) + Q105062070 (P585 1809, ref n358); P186 oil paint+canvas; P1343/P304 "195" ✓.
- **S8** (Commons): 4000×4690, PD, DateTimeOriginal "circa 1663-1665", credit HQH272DWHOl8aA ✓.

**Denetim B bulgusu (brief'e ekleme):** brief D002'de "S2 tek aykırı kaynak" der; frwiki (S4) de "la chaussure vide" (boş ayakkabı) der → C042 aykırı kanadı **S2+S4** olarak genişletildi. Birincil+tarihsel (S5/S6/S7/S3/S14) "roe/gard" konusunda oybirliği.
**İkinci bulgu:** 1909 katalog dizininde "Steen, Jan … 2237, **2237a**, 2238…" girdisi var; "2237a"nın metin karşılığı OCR'de bulunamadı → D003 için araştırma boşluğu (iddia üretilmedi, insan incelemesine not).
**Erişilemeyen (teyit):** S11 RKD 403, S12 Europeana 403, S13 ARIA alt sayfaları 404; kitap metinleri erişilmedi (C049).

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12, `.qwen/tmp/venv-dogrula`): **Q764831 için 0 hata / 0 uyarı.** CJK: 0.
- DERS.json + SORULAR.json şema geçerli; `additionalProperties:false` alanlar temiz.
- `bolum_eslesme` 12 bölüm (1–12) ✓; `durum="İnsan incelemesi bekliyor"` ✓; `gorsel.dogrulama.incelenen_bolgeler=[]` ✓.
- Kelime tutarlılığı: DERS.json `kelime_sayisi` = dosya ölçümü (gen.build post-pass sonrası ölçer) ✓.
- NOT: dogrula.py tüm `eserler/` dizinini tarar; başka partilerin eserlerinden (ör. Q531329) gelen hata/uyarılar BU esere ait değildir ve dokunulmamıştır.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 423 | 400–500 | 3 dk | ✓ aralıkta |
| Orta | 1434 | 1300–1600 | 10 dk | ✓ aralıkta |
| İleri | 2821 | 2600–3200 | 20 dk | ✓ aralıkta |

**Not:** Kelime hedefleri §8 gereği tahmindir; bu eserde birincil kaynaklar güçlü ve yeterli olduğundan üç seviye de hedef aralığa dolduruldu (dolgu/tekrar yok; yakın-tekrar ve seviyeler-arası tekrar kontrolleri temiz). İleri düzey gerçekten daha derin sorular sorar: birincilin katmanları, belge zinciri, kaynak-eleştirel yöntem, felsefi ödünçler, akademik tartışma envanteri.

## 5. Görsel doğrulama (Kural 6)

Commons GAP metadata (4000×4690 px, ~7,8 MB, **Public domain**, AttributionRequired false, credit Google Arts & Culture HQH272DWHOl8aA); **vision kotası ana oturumda → İNCELENEMEDİ (C048 E).** Kompozisyon S5 (A) + S6 (A arşiv) + S7 (A tarihsel) + S14 (B) METNİNDEN; "kaynakların betimlediği" ibaresi kullanıldı. **GZ TASLAK** (5/5). Görsel projeye kopyalanmadı; URL + lisans + kaynak referansı verildi. Dosya oranı (h/w≈1,1725) eser oranıyla (82/70,5≈1,163) uyumlu — metadata tutarlılık işareti, görsel teyit değil. **İnsan editör görsel teyidi ZORUNLU** (imza konumu C010, roe C017/C042, pencere/ışık C046, kompozisyon C058, bebek/şekerleme C015).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C048, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi zorunlu.
2. **Beş ihtilaf (D):** D001 tarih (güncel ↔ 2012 ↔ GAP ↔ WD precision), D002 ayakkabı (en+fr wiki "boş" ↔ birincil "roe"), D003 versiyon/kopya statüsü, D004 günün saati (data "sabah" ↔ arife/akşam), D006 inç ölçüleri.
3. **D003 + "2237a":** Utrecht Catharijneconvent versiyonunun özgün/kopya statüsü çözülmedi; 1909 dizinindeki "2237a" girdisinin metin karşılığı bulunamadı → ek katalog/kurum kaydı gerekli.
4. **Verwerving 1975 (C035, E):** "aankoop 1975"/"interne vervaardiging" girdilerinin anlamı ve boş Herkomst/Credit line alanları çözülmedi; müze iç kaydı gerekebilir.
5. **Data uyuşmazlıkları (veri notları):** D004 "sabah", D005 "Aziz Nikolaos" ↔ "Aziz Nicholas", E010 pencere/ışık (zaten "yanlis" işaretli), E011 "Jan Steen evi" deyimi (destek yok). data DEĞİŞTİRİLMEDİ; insan onayına sunulur.
6. **Literatür (C049, E):** Kleiner/Westermann/Kloek/Braun/Kirschenbaum/1956 kataloğu + 11 kütüphane öğesi metne erişilmedi; Kleiner ISBN doğrulanmadı.
7. **Erişilemeyen birincil yan kaynaklar:** RKD 403, Europeana 403, ARIA alt sayfaları 404 (müzenin kendi ikonografi programı içeriksiz).
8. **Felsefi yorumlar (İleri §7, C059):** Hegel/Benjamin ödünç çerçeveler kurum dışı; etki iddiası YOK; editör onayı.
9. **Biyografi hedge'leri (C051):** "is supposed to" van Ostade halkası, "omstr. 1626" doğum — kesinleştirilmedi.

## 7. Yayına adaylık

Otomatik kısım sağlandı (0 hata/0 uyarı, şema geçerli, quiz A/B, GZ TASLAK, CJK 0, kelime aralıkta). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu GARANTİ ETMEZ. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir (AKADEMIK_STANDART §11–12). **Birincil Rijksmuseum AÇILDI (A, üç katman: güncel + 2012 arşiv + 1909 katalog); görsel İNCELENEMEDİ (E); beş ihtilaf D olarak açık; insan editör görsel teyidi + ihtilaf yönetimi + data notları onayı kritiktir.**
