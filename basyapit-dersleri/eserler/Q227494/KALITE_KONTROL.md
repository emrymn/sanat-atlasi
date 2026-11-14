# KALİTE KONTROL — Q227494 · Fuji Dağı'nın 36 Manzarası (Fugaku Sanjūrokkei) · Katsushika Hokusai

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR** · **Yayına aday DEĞİL**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti5/Q227494-brief.md`); ham cache'ler `.qwen/tmp/parti5/`.
**Kritik kimlik:** Gösterilen baskı **Red Fuji (Gaifū kaisei), seri no. 33** — Büyük Dalga DEĞİL (A3-18; WD P18 + data + Commons aynı dosya). Gösterilen nüsha **~1930 reprodüksiyonu** olarak beyan edilir; **kurum teyit edilemedi**; orijinal Edo baskısı gibi sunulmadı.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü bu eser için temiz.
- **Toplam iddia:** 66 (C001–C066). **A=30, B=20, C=4, D=6, E=6.** KANIT "Sayım" satırı DERS.json ile birebir.
- **A düzeyi:** Met canlı API (S22) + Met Wayback (S12), BM Wayback (S14), Fujibi canlı (S15), IMA Wayback (S17), Honolulu Wayback (S20), Commons metadata (S8/S10), WD (S1/S2). Küratör metinleri (Smith 1988, Clark 2001/2017) BM kaydı üzerinden erişildi → A.
- **B düzeyi:** Korenberg vd. 2019 (hakemli, açık erişim, S18); Calza/Day/Smith/NYT/NHK aktarımları (kitap/haber metinleri erişilmedi, ref zinciri notlu).
- **C düzeyi:** C034 (~1930 reprodüksiyon beyanı, doğrulanmadı), C064/C065/C066 (açıkça işaretli yorumlar: soyutlama↔meteoroloji, aura/Benjamin, ölümsüzlük↔yaşlanma). Düşünür etkisi iddia edilmedi (§7).
- **D düzeyi:** C036–C041 = D001 tarih, D003 kurum, D004 boyut, D005 bakış yönü, D006 numaralandırma, D007 ISBN. Hepsi "(tartışma)" işaretli; hiçbirinin doğru cevaplı sorusu yok.
- **E düzeyi:** C022 (probabilmente dalga), C025 (Rivière atıfsız), C042 (görsel incelenmedi), C043 (kitap metinleri erişilmedi), C046 (Van Gogh atıfsız), C058 (perhaps/forse ün). Hepsi "(belirsiz)" işaretli; quiz'e girmedi.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B kanıtlı**; 5 AU serbest (C/D/E dahil). Yanlış seçenek gerekçeleri bağlamsal (totoloji yok; dogrula totoloji_kontrol temiz). CS09 doğru cevabı Korenberg'in kesin bulgusuna (Pink önce) dayanır; "possibly first edition" hedge'i doğru cevap yapılmadı. CS10 numaralandırma A zincirine (WD/Commons/Meihin soroimono) dayanır; D006 çeldirici gerekçesinde açıklanır.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak 5/5 ipucuna TASLAK öneki ekledi.
- **Kelime:** B 490 / O 1543 / İ 2762 — üçü de §8 aralığında; dolgu/tekrar yok (yakın-tekrar ve seviyeler-arası tekrar kontrolleri temiz). İleri ilk taslakta 2500 idi; kanıta dayalı gerçek içerikle (Met API makine alanları, BM sergi tarihleri + York 2024, Keyes hipotezi, ışık solması notu, Clark çıkarım notu, Honolulu on-yıl notu) 2762'ye genişletildi — dolgu değil.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda ham cache'ler yeniden açıldı ve iddialarla karşılaştırıldı (14 Kasım 2026):
- **S22 Met canlı API 36490 (200):** JP9, Rogers Fund 1914, ca. 1830–32, 24.4×35.6, imza, Spaulding provenance, isPublicDomain, DP141062 ✓. Makine alanları objectBeginDate 1820/objectEndDate 1842 görünen künyeden geniş → derste not edildi (C016).
- **S12 Met Wayback 2025-01-24:** künye + provenance + sergi tarihleri + anlatı (Eijudo 46; bero-ai; Sanka hakuu karşıtlığı) ✓; kanonik link /search/36490 ✓.
- **S14 BM Wayback 2026-11-01:** 1906,1220,0.525, Morrison, 26.10×38.20, "1831 (probably late 1831)", Smith/Clark küratör metinleri, literatür (Meihin soroimono no. 33; Ukiyo-e taikei no. 2), sergiler (York 2024 Monet dahil) ✓.
- **S15 Fujibi canlı 200:** 03769, c. 1830-32 (Tenpo 1-3), 24.1×37.2, biyografi, "northern side… it is thought", cirrocumulus, GAP asset rAHsqw1x3YgtzQ, CC0/PDM ✓.
- **S17 IMA Wayback 2011-11-09:** 60.12, Lieber Fund, Nail provenance, "about 1800-1849", Cassatt 1890 mektubu, Hokusai "age of six… seventy" sözü, "in his seventies", **Monet "may have inspired"** (hedge), VAGA kısıtı ✓. Snapshot ESKİ; güncel nesne sayfası kayıp (S16 ana sayfaya yönlendi) → beyan edildi.
- **S18 Korenberg 2019 (200, açık erişim):** yöntem, aşınma, pigmentler, baskı etkileri, ekonomi, sonuç ✓. **Brief düzeltmesi:** incelenen Pink Fuji **Musée Guimet**'dir; Smith College 1968:245 yalnız Fig. 1b örnek gösterimidir (brief C015 "Smith College" diyordu → düzeltildi).
- **S20 Honolulu Wayback 2019-09-01:** Michener 500+ tam set, "Few institutions own the whole set", sergi 23 Eylül 2009–6 Ocak 2010 Henry Luce Gallery, on yılda ilk, kırılgan/ışığa duyarlı, 30.000 eser tahmini ✓.
- **S8/S9/S10 Commons metadata:** 4400×2937, PD-Art, AttributionRequired false, visipix credit (müze yok), "This edition: circa 1930", "Woodblock made ca. 1930", "only experts can distinguish… frame around the script", 26.2×38.7; MET DP141062 CC0 + GAP PD ✓. **Görsel İNCELENMEDİ.**
- **S1/S2/S3 WD:** P527=46, P1545 (Red Fuji 33 / Büyük Dalga 21), P571/P577 hassasiyet + niteleyiciler, P195 (Met JP9 eksik), P6216 yok ✓.
- **S4–S7 wiki wikitext:** itwiki 1826–1833 + probabilmente + facsimili notu; enwiki aizuri-e/nishiki-e + 100 plan + Goncourt + Rivière (atıfsız) + tablo sırası; levha maddesi Keyes/Korenberg ref'li nüsha betimleri ✓.

**Diğer Denetim B düzeltmeleri:** C033 "özgün çizim yok olur" E/C adayından B'ye yükseltildi (Korenberg yöntem bölümü doğrudan destekliyor; wiki cümlesi atıfsız kalsa da iddia akademik kaynaklı). C045 Monet: brief "atıfsız" sanıyordu → IMA 2005 metninde hedge'li dayanak bulundu (B). C003 yaş: IMA/Korenberg/Fujibi doğrudan → A. Van Gogh için atıf bulunamadı (E korundu).
**Erişilemeyenler:** S11 Met web 429, S13 BM canlı 403, S16 IMA nesne sayfası kayıp, S19 Honolulu 404 → arşiv/API çözümleri. Kitap metinleri (Calza, Smith, Day, Keyes, Nagata, Clark, Keyes & Morse, Bouquillard, Marks, Thompson, Balcou, Milone) erişilmedi; NYT/NHK/Christie's metinleri erişilmedi (ref'lerde archive-url var). DOI/ISBN/sayfa uydurulmadı; Smith 1988 ISBN uyuşmazlığı D007 olarak açık.

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12 AKTİF): **Q227494 için 0 hata / 0 uyarı.** 12 bölüm eşlemesi tam; KANIT↔DERS.json iddia/kaynak kimlikleri birebir; mükerrer kimlik yok; quiz A/B kuralı temiz; D/E belirsizlik işaretleri temiz; kelime sayıları JSON↔md tutarlı; durum "İnsan incelemesi bekliyor".
**Genel sayım notu:** dogrula genel çıktısındaki hata/uyarılar eşzamanlı üretilen başka eserlere aittir (Q17026577 üretim-aşamasında, Q471379/Q698487 dosyaları eksik; öteki parti uyarıları). Q227494'e ait değildir; bu eserler için düzeltme yapılmadı (kapsam dışı).
**CJK:** ders md (3) + DERS.json + SORULAR.json + KALITE = **0**. KANIT_DOSYASI.md'de yalnız §15 gereği özgün biçim kanji (seri/levha başlıkları, Akafuji, imza, sanatçı/yayıncı adları, kartuş "jū" karakteri — KANIT §0/§2'de) — karışma değil, bilinçli koruma; derslerde romaji kullanıldı.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 490 | 400–500 | 3 dk ✓ |
| Orta | 1543 | 1300–1600 | 10 dk ✓ |
| İleri | 2762 | 2600–3200 | 20 dk ✓ |

Üçü de aralıkta; §8 gereği bilgi eklenerek uzatma yapılmadı (İleri genişletmesi kanıta dayalı: §1'de listelenen gerçek bulgular).

## 5. Görsel doğrulama (Kural 6)

- **Gösterilen dosya:** `File:Red Fuji southern wind clear morning.jpg` (4400×2937; sha1 ad10c5bf…); **Public domain** (PD-Art / PD-old-100-expired; ABD 1931 öncesi; AttributionRequired false). Credit: visipix stok linki — **müze adı yok**.
- **İNCELENMEDİ** (vision kotası ana oturumda) → `incelenen_bolgeler=[]`; **GZ 5/5 TASLAK**; kompozisyon "kaynakların betimlediği" (BM/Met/Fujibi A + enwiki/IMA B metinlerinden).
- **Nüsha sınırı:** dosya "~1930 reprodüksiyon" olarak beyan edilir (C034 C, doğrulanmadı); kurum teyit edilemedi (C037 D). Ders görseli Edo orijinali gibi sunmaz; nüsha kimliği görselden doğrulanmaz.
- **Alternatifler (envanter, kullanılmıyor):** MET DP141062 (3865×2665, CC0, Met JP9 taraması — API primaryImage teyitli); GAP (5803×3918, PD, iwHKYC1Qfk9NCg, "about 1800-1849", WD levha P18); Fujibi GAP asset rAHsqw1x3YgtzQ (canlı link).
- Görsel projeye kopyalanmadı; URL + lisans + kaynak referansı. IMA 2011 VAGA reproduksiyon kısıtı not edildi; IMA görseli kullanılmadı. Met Open Access / Fujibi CC0-PDM / Commons PD serbest.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C042 E):** incelenmedi; GZ TASLAK; insan editör görsel incelemesi ZORUNLU. ~1930 reprodüksiyon beyanı ve nüsha durumu (kartuş çerçeve farkları) ancak uzman incelemesiyle doğrulanabilir (C034).
2. **Kurum belirsizliği (C037 D / D003):** gösterilen dosya hiçbir müze nüshasına bağlanamadı; data `muze:""` boş. Doldurulacaksa "reprodüksiyon, kurum belirsiz" notu gerekir; data değişikliği insan onayına sunulur.
3. **Tarih ihtilafı (C036 D / D001):** Met/Fujibi ca. 1830–32 ↔ itwiki 1826–1833 ↔ WD 1830/1830s (1831–1834) ↔ BM 1831 probably late 1831 ↔ IMA about 1800–1849. Tek yıl dayatılmadı.
4. **Boyut (C038 D / D004):** nüshaya göre değişir; kunye.boyut_cm bilinçli olarak boş bırakıldı.
5. **Bakış yönü (C039 D / D005):** BM eastern ↔ Fujibi northern (thought) ↔ enwiki mystery; kesinleştirilmedi.
6. **Numaralandırma (C040 D / D006):** 33 (WD/Commons/Meihin soroimono) ↔ 2 (Ukiyo-e taikei + wiki tablo sırası); ders A zincirini esas alır, farkı beyan eder.
7. **Data iddiaları:** Monet (hedge'li B, C045) / Van Gogh (E, C046) / Rivière (E, C025) — data "Neden önemli?" bölümü üçünü olgu olarak sunuyor; insan onayı gerekir.
8. **IMA snapshot 2011 (C018):** güncel nesne sayfası kayıp; künye/provenance eski arşivden; güncel IMA kaydı doğrulanamadı.
9. **Kitap metinleri (C043 E):** Calza/Smith/Day/Keyes/Nagata/Clark/Keyes & Morse vd. erişilmedi; B zincirli iddiaların kaynak metinleri insan editörce teyit edilmeli. Smith 1988 ISBN uyuşmazlığı (C041 D / D007).
10. **Yorumlar (C064–C066):** Benjamin aura / Burke-Kant yücelik / ölümsüzlük-yaşlanma okumaları açıkça yorum; düşünür etkisi iddiası yok; editör onayı.
11. **Bulut tipi adlandırması:** Fujibi cirrocumulus ↔ BM Clark 2017 "high altocumulus" — kaynaklar farklı adlandırır; ders ikisini de atfeder (C011), tek tip dayatmaz.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + quiz A/B + D/E işaretleri + kelime + CJK). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir (§11–12).
**Kanıt konumu güçlü:** Met canlı API + Fujibi canlı + BM taze arşiv (2026-11-01) + hakemli açık erişim Korenberg 2019 → A ağırlıklı; ama görsel İNCELENMEDİ (E) ve gösterilen nüshanın kurumu belirsiz (D) olduğundan insan editör görsel teyidi + kurum kararı kritiktir. data/ ve uygulama kodu değiştirilmedi; commit/push yapılmadı.
