# KALİTE KONTROL — Q3228340 · Üçüncü Mevki Vagon (The Third-Class Carriage) · Honoré Daumier

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti4/Q3228340-brief.md`).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q3228340 için temiz.
- **Toplam iddia:** 43 (C001–C043). **A=17, B=3, C=10, D=4, E=9.**
- **A düzeyi:** Met resmî API (S4, canlı 200) + TOAH Wayback 2014-08-18 (S6) + NGC Wayback 2026-09-07 (S9) + Commons Met etiketi (S7). Künye, galeri etiketi (bitmemiş/kareleme/Walters denkliği/Ottawa reworked/demiryolu 1840'lar), konu etiketleri, Realizm sınıflaması, telif, Ottawa künyesi + NGC yorumu.
- **B düzeyi:** WD'nin Met referanslı claim'leri (C018 Louisine P127, C019 P580=1929) + Fransızca başlık (C043 P1476).
- **C düzeyi (yorum):** enwiki anlatısı (satır içi atıf yok) — provenance zinciri, 1878 keşif, Les Chemins de Fer, üçüncü mevki koşulları, ön sıra betimi, Ottawa imza/Brame/Edwards, SF versiyonu, NY–Ottawa farkları, Kleiner (yalnız anıldı). Hepsi "(yorum)" veya "enwiki'nin aktardığına göre" ile işaretli.
- **D düzeyi (tartışma):** D1 tarih (C037), D2 versiyon karışması (C038), D3 galeri 802↔812 (C039), D4 data tek yıl (C040). Hepsi "(tartışma)" işaretli; kesin cevaplı soruya girmez.
- **E düzeyi (belirsiz):** working drawings "perhaps" (C029), eşzamanlılık/sıra "not clear" (C030), kareleme kaynağı "possibly" (C031), köylü/Millet "may be" (C032), WD anomalileri + Q97309629 missing (C033), sınıf/aile okuması (C035), Van Gogh mektupları kaynaksız (C036), görsel İNCELENMEDİ (C041), erişilemeyen refs (C042). Hepsi "(belirsiz)" işaretli; kesin anlatıya ve doğru cevaba girmez.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B** kanıtlı; 5 AU serbest (C/D/E dahil). CS doğru cevapları D/E'ye dayanmaz; yorum tek doğru cevap yapılmaz (CS09 "NGC ne der" → A, C017). Çeldirici gerekçeleri gerçek/bağlamsal (totoloji yok).
- **GZ TASLAK:** görsel incelenmedi → gen.py gz_taslak otomatik uyguladı (5/5 ipucu "TASLAK …" önekli).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda kaynaklar yeniden açıldı/okundu (14 Kasım 2026):
- **S4 Met resmî API canlı yeniden 200** — cache ile **birebir aynı** (diff YOK; metadataDate 2026-10-10). Künye alanları (title/artist/medium/dimensions/accessionNumber/creditLine/repository/GalleryNumber 812/isPublicDomain/tags/primaryImage DP-21027-001) teyit.
- **S5 TOAH canlı hâlâ 429** (Vercel) → S6 Wayback 2014-08-18 cache yeniden okundu; galeri etiketi birebir ("unfinished and squared for transfer", "closely corresponds to a watercolor of 1864 (Walters…)", "another oil version … finished but extensively reworked (NGC Ottawa)", "first appeared … in the 1840s", Index Terms). Arşiv anı 2014 ↔ metin tarihi December 2008 ayrımı beyan.
- **S8 NGC canlı 403** → S9 Wayback 2026-09-07 cache yeniden okundu; Ottawa künyesi (c. 1863-1865, oil on canvas, 65.4 x 90.2 cm, Purchased 1946, 4633) + işçi sınıfı yorumu birebir. **Bu kayıt Ottawa versiyonunundur; Met'e atfedilmedi.**
- **S1 WD EntityData + S13 Q97309629 yeniden sorgulandı** → Q97309629 hâlâ `"missing":""` (referans zinciri kırık teyit); P571 1862 (P1326=2001) / 1868 (DBpedia) anomalileri doğrulandı.
- **S3 enwiki wikitext + S7 Commons imageinfo** yeniden okundu; üç versiyon ayrımı, konu etiketleri, PD/CC0 lisansları teyit.
- **D1/D2/D3/D4** ihtilafları D olarak açık; **görsel** metadata only → İNCELENMEDİ (C041); GZ TASLAK.
- **Erişilemeyen/açılmayan:** FAMSF, Walters (3 kayıt), NGC magazine, Kleiner Google Books (URL'ler refs'te bulundu, açılmadı → C042); it/de/fr WD sitelink yok.

**Semantik sınır:** Bu tur aynı asistan + agent araştırmasıyla yapıldı; yapısal testler olgusal doğruluğu garanti etmez. Haricî model/insan editör denetimi ayrıca gereklidir.

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12, AKTİF): **Q3228340 için 0 hata / 0 uyarı.** CJK taraması: **0**.
- DERS.json + SORULAR.json şemaya uygun; ek alan yok; enum'lar (seviye/kullanim/durum/tur) doğru.
- bolum_eslesme 12 bölüm (1–12) tam; her bölüm ≥1 dosya/bölüm.
- iddia/kaynak kimlikleri KANIT ile eşleşir; mükerrer kimlik yok; quiz kanit A/B; CS yanlış gerekçeleri tam (3 çeldirici); kelime sayıları DERS.json ↔ dosya birebir.
- **Not:** dogrula.py global çıktısındaki hata/uyarılar **öteki eserlere** aittir (eksik DERS.json/SORULAR.json vb.); Q3228340'a ait HATA/UYARI satırı YOK. Öteki eserlere dokunulmadı.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 440 | 400–500 | 3 dk | ✓ |
| Orta | 1378 | 1300–1600 | 10 dk | ✓ |
| İleri | 2741 | 2600–3200 | 20 dk | ✓ |

Üç seviye de hedef aralıkta; dolgu/tekrar yok (§8). İleri düzey gerçekten daha derin: birincil erişim yöntemi, D1 anatomisi, versiyon filolojisi, non-finito okuması, sınıf okuması kaynak eleştirisi, alımlama/kanıtsız iddia ayrımı, felsefi lensler (açıkça yorum), karşılaştırmalı metodoloji, D/E envanteri.

## 5. Görsel doğrulama (Kural 6)

- **Hiçbir görsel İNCELENMEDİ** (vision kotası ana oturumda); yalnız metadata + lisans + çözünürlük (C041 E).
- Commons 3 dosya PD/CC0: Met bağışlı 3811×2756, GAP (WD P18) 3812×2757, Yorck 2024×1463. Met API primaryImage DP-21027-001 (original + web-large), isPublicDomain=true.
- WD P6216=Q19652 / P1001 100 yıl pma / P459 ölümden ≥100 yıl; Daumier ö. 1879 → kamu malı.
- Kompozisyon "kaynakların betimlediği" (Met etiketi A + NGC A + enwiki C) metninden; doğrudan gözlem YOK. **GZ TASLAK.** Görsel projeye kopyalanmadı; URL + lisans + kaynak referans.
- data/ görsel hash'i 585ff6078a75a57a = Met DP-21027-001 web-large → **doğru versiyon** (C038); gorsel_oranlari 1.37 ≈ 90.2/65.4=1.379 ✓.
- **İnsan editör görsel teyidi ZORUNLU** (özellikle data/ "ışık soldaki pencerelerden süzülür", hotspot koordinatları ve ön sıra betimi — C041/E8).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C041, E):** incelenmedi; GZ TASLAK; data/ görsel içerik betimleri doğrulanmadı; insan editör teyidi zorunlu.
2. **D1 tarih (C037):** API "1864" ↔ TOAH/Commons/enwiki "ca. 1862–64" ↔ WD 1862/1868; ders "c. 1862–1864" kullanır, kesinleştirmez. Editör hangi değerin esas alınacağına karar vermeli.
3. **D2 versiyon (C038):** Met/Ottawa/SF ayrı eserler; enwiki tek maddede anlatır; cache'de Ottawa görseli + Walters suluboyası var → UI/ders karıştırma riski. Editör versiyon ayrımını teyit etmeli.
4. **D3 galeri (C039):** 802 (2014) ↔ 812 (2026); güncel 812 esas.
5. **D4 data yılı (C040):** basyapitlar/onbellek "1862" tek yıl + Mevki/Sınıf terminoloji tutarsızlığı → **data düzeltme önerisi ana oturuma** (data DEĞİŞTİRİLMEDİ).
6. **WD anomalileri (C033, E):** P1326=2001, 1868 DBpedia import, Q97309629 missing, blog zayıf → kesinleştirmede kullanılmaz.
7. **Sınıf/aile okuması (C035/C032, E):** NGC "working class" ↔ enwiki "may be peasants (Millet)" ↔ data "üç kuşak"; tek doğru okuma dayatılmaz.
8. **Van Gogh mektupları (C036, E):** data/ iddiası bu brief'in kaynaklarında yok → olgu olarak kullanılmadı; editör ek kaynak aramalı.
9. **Erişilemeyen refs (C042, E):** FAMSF/Walters/NGC magazine/Kleiner açılmadı; Kleiner yalnız "kaynakçada anıldı". İlgili ayrıntılar C/E'de.
10. **Felsefi yorumlar (İleri §7):** Benjamin/Berger lensleri açıkça yorum, anakronizm beyanlı; Daumier'ye etki iddiası YOK; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + kelime + CJK + quiz A/B). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Haricî model/insan editör denetimi ayrıca gereklidir.

**Birincil Met API canlı AÇILDI (A); TOAH/NGC arşivden AÇILDI (A, AI aracılı çıkarım notuyla); görsel İNCELENMEDİ (E); dört ihtilaf (D1–D4) açık; insan editör görsel teyidi + tarih/versiyon kararı + data düzeltme onayı kritiktir.**