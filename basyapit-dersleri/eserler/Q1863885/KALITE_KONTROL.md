# KALİTE KONTROL — Q1863885 · Musa, Yitro'nun Kızlarını Savunurken (Moses Defends the Daughters of Jethro) · Rosso Fiorentino

**Tarih:** 14 Kasım 2026 · **Parti:** 2 (M6) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B (aynı asistan turu) ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti2/Q1863885-brief.md`); ham cache `.qwen/tmp/parti2/Q1863885-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q1863885 için temiz (0 hata / 0 uyarı)**.
- **Toplam iddia:** 46 (C001–C046). **A=23, B=10, C=1, D=5, E=7.** KANIT "Sayım" satırı DERS.json ile birebir uyumlu.
- **A düzeyi:** canlı Uffizi (K1) + 2022 arşiv katalog (K2) — künye, konu, provenans, kariyer, biçim betimi, Fontainebleau bağlantısı; Commons dosya lisansı (K7).
- **B düzeyi:** en/it Vikipedi (K4/K5) satır içi akademik atıflı — 1632, Casino di San Marco 1587, Milanesi, Cascina/Anghiari, Mugnaini, Filone, tripartit/komplementer, Ciardi, "forse… forse" eller, pendant, Bronzino etkisi. Atıf zinciri wiki→kitap; kitap metnine erişilmedi (C039).
- **C düzeyi:** C031 (data iddiaları: "çoğu yorumcu" niceliği + 1530 göç yılı) — "(yorum)" işaretli, olgu olarak sunulmadı.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B** kanıtlı (dogrula A/B kuralı temiz); 5 AU serbest (C/D/E dahil). Yanlış seçenek gerekçeleri bağlamsal (totoloji yok; CS02 çeldiricileri katalog no / Salviati eskiz no / fotoğraf arşiv no gibi gerçek ayrımlara dayanır).
- **D/E işareti:** 5 D "(tartışma)", 7 E "(belirsiz)" — post-pass build'den önce çalıştırıldı, kelime sayıları nihai dosyalarla birebir. D/E cümlelerinde belirsizlik işareti mevcut (dogrula cümle-düzeyi kontrolü temiz).
- **GZ TASLAK:** görsel incelenemedi → gen.gz_taslak 5 soruyu da "TASLAK (görsel bu oturumda incelenemedi…)" ile işaretledi.
- **12 bölüm:** bolum_eslesme 1–12 tam; §7 (felsefe) ve §9 (tartışma envanteri) İleri'de, §11 etkinlikler SORULAR.json + üç ders.

## 2. Denetim B — Kaynağa geri dönüş (dürüstlük beyanı)

K1 (Uffizi canlı), K2 (arşiv 2022), K4/K5 (en/it wikitext), K6 (WD EntityData), K7 (Commons metadata), K8/K9 (WD labels/P8335) ham cache'leri **yeniden okunup** iddialarla karşılaştırıldı:
- Künye (başlık/sanatçı/yaşam/teknik/boyut/envanter/katalog no/salon) ✓ K1+K2. Konu/provenans/kariyer/biçim/Fontainebleau ✓ K1. 1632/1587/Milanesi/Cascina-Anghiari/Mugnaini/Filone/pendant/Bronzino ✓ K4/K5.
- **Beş ihtilaf D olarak açık:** tarih (C033), atıf/orijinallik (C034), salon (C035), Vasari çevirisi (C036), ikonografi (C037).
- **Görsel:** yalnız metadata; vision kotası ana oturumda → İNCELENEMEDİ (C038). **Kitap metinleri:** erişilmedi (C039).

**ÖNEMLİ SINIR:** Bu tur aynı asistan + agent araştırmasıyla yapıldı; ham cache'lerin yeniden okunması **bağımsız haricî doğrulama DEĞİLDİR**. AKADEMIK_STANDART §11 gereği haricî model/insan editör denetimi ayrıca gereklidir ve "bekliyor" olarak işaretlidir. Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez.

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12, venv-dogrula): **Q1863885 0 hata; 0 uyarı.** CJK taraması: **0** (tüm .md + .json + uret betiği).
- Not: Global dogrula çalıştırmasında 2 hata **başka bir eserden** (Q94802: eksik DERS.json/SORULAR.json) ve 54 uyarı diğer eserlerin kelime/tekrar durumlarından gelir; bunlar bu görevin kapsamı dışındadır ve **dokunulmamıştır**. Q1863885 bu çalıştırmada temizdir.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 410 | 400–500 | 3 dk | aralıkta |
| Orta | 1317 | 1300–1600 | 10 dk | aralıkta |
| İleri | 2661 | 2600–3200 | 20 dk | aralıkta |

Kelime hedefleri §8 gereği tahmindir; bu eserde birincil + arşiv + iki wiki metni yeterli derinlik sağladığı için hedef aralıklar dolduruldu, dolgu/tekrar yapılmadı (seviyeler arası birebir uzun cümle tekrarı 0; ardışık yakın-kopya paragraf 0). Görsel incelenemediği için betimler "kaynakların betimlediği" çerçevesiyle verildi.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (2 dosya, ikisi de PD, AttributionRequired=false): WGA 831×1140 (data/eserler_onbellek'te kullanılan), Yorck 1576×2167 (daha yüksek çözünürlük). **Vision ile İNCELENEMEDİ (C038 E); incelenen_bolgeler=[] → GZ TASLAK.** Kompozisyon/ikonografi/renk betimleri K1 (A) + K4/K5 (B) METNİNDEN. Görsel projeye kopyalanmadı; URL + lisans + kaynak referans. WD P6216 yargı alanı qualifier'ı ("countries with 100 years pma or shorter") Commons dosya etiketinden dar; aynen kaydedildi (C029). **İnsan editör görsel teyidi ZORUNLU** — özellikle data'nın metin kaynaklarında geçmeyen görsel detayları (siyah kumaş, pembe pelerin, mavi elbiseli kadın, sarışın adam) ve WGA↔Yorck versiyon/restorasyon farkı.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C038, E):** incelenemedi; GZ TASLAK; insan editör teyidi zorunlu. data'nın görsel detayları metinlerde yok.
2. **Beş ihtilaf (D):** tarih (canlı 1523–1527 ↔ arşiv "1523 circa" ↔ wiki c. 1523–1524 ↔ WD 1523), atıf/orijinallik (Uffizi doğrudan ↔ Natali "copia fedelissima e coeva"), salon (D12 ↔ Room 27), Vasari çevirisi ("commissioned" ↔ "sent"), ikonografi (Mugnaini iki ek olay ↔ "most accredited interpretation").
3. **Atıf/orijinallik (C034):** eserin orijinal mi çağdaş kopya mı olduğu çözülmedi; data ozeti kesin ("yaptığı") — editör kararı gerekli.
4. **Literatür (C039, E):** Marchetti Letta 1994 / Fossi 2004 / Natali 2006 metinlerine erişilmedi; ISBN'ler kayıttan aynen, doğrulanmadı; Ciardi/Mugnaini/Goldschmidt/Pevsner tam künye yok.
5. **Data uyuşmazlıkları (C031 + veri notları):** 1530 göç yılı doğrulanmadı; "çoğu yorumcu" niceliği yok; doğum yılı data 1494 ↔ Uffizi 1495; "Yetro/Yitro" yazım farkı; önbellek lisans alanı boş. data DEĞİŞTİRİLMEDİ, onaya sunulur.
6. **Notasyon (C040, E):** itwiki "Esodo (I, 16-22)" ↔ enwiki "Exodus (2:16–22)"; Uffizi "an Israelite woman" ifadesi aynen korundu (düzeltilmedi) — editör değerlendirmesi.
7. **Felsefi yorumlar (İleri §7):** Benjamin aura ödünç; şiddetin estetize edilmesi / seyirlik nesne okuması — kurum dışı yorum, editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + quiz A/B + 12 bölüm + kelime + CJK). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Birincil Uffizi (K1) ve arşiv katalog (K2) AÇILDI (A); canlı katalog (K3) 522 erişilemedi; görsel İNCELENEMEDİ (E); kitap metinleri erişilmedi (E). Haricî model/insan editör denetimi + görsel teyit + beş ihtilafın editoryal yönetimi kritiktir. Bu koşullar sağlansa bile içerik doğrudan yayımlanmaz; insan editoryal onayı bekler (§12).