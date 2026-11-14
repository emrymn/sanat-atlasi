# KALİTE KONTROL — Q5966403 · Beşik (Le Berceau / The Cradle) · Berthe Morisot

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti5/Q5966403-brief.md`); ham cache `.qwen/tmp/parti5/Q5966403-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 65 (C001–C065). A=23, B=19, C=3, D=6, E=14.
- **A düzeyi (23):** Orsay FR/EN/IT birincil kayıtları + POP Joconde + JocondeLab (künye, provenance, model, 1874 sergisi, kompozisyon betimi, konu indeksleri, sergi listesi, fotoğraf künyeleri). C001–C021 + C061 + C062.
- **B düzeyi (19):** fr/en/it wiki alıntıları (Rey, Stuckey/Scott/Lindsay, Adorno, Cricco/Di Teodoro, Madeline, Lobstein, Brocvielle, Dagen) + TV5 transkripti; kitap metinlerine erişilmedi, atıf zinciri notlu (C022–C035, C056–C060).
- **C düzeyi (3):** felsefi/estetik yorumlar (tül-eşik C063, bakış-özen C064, fırça rejimleri C065); "(yorum)" işaretli; sanatçıya etki iddiası yok.
- **D düzeyi (6):** C041–C046 (genişlik, yapım yeri, W-B no, Yorck 1873, 1874 karşılama, Portillon yazımı); "(tartışma)" işaretli; quiz'e girmez.
- **E düzeyi (14):** C036–C040 + C047–C055 (800 frank, Louvre 1868, Monet beşik, alternatif başlık, ilk sahip, data çene/kurdele/Cassatt/eğilmiş, Moffett yılı, TV5 tarihi, WD P180, görsel incelenmedi, kitaplar erişilmedi); "(belirsiz)" işaretli; quiz'e girmez.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B kanıtlı (dogrula A/B dışı kanıt taraması: YOK). 5 AU serbest (C/D/E dahil). Yanlış seçenek gerekçeleri bağlamsal (totoloji yok); gen.cs_gerekce_iyileştir uygulandı.
- **GZ TASLAK:** görsel incelenemedi → gen.gz_taslak tüm GZ ipuçlarına "TASLAK" öneki ekledi.
- **D/E belirsizlik işareti:** tüm D/E kullanımları "(tartışma)"/"(belirsiz)" içerir; dogrula belirsizlik taraması temiz.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda ham kaynaklar yeniden açıldı/okundu (yalnız taslağı yeniden okumak sayılmaz):
- **POP Joconde (K4) canlı YENİDEN AÇILDI (2026-11-14, HTTP 200):** RF 2849, 1872, Maurecourt, "BATAILLE ET WILDENSTEIN 25", "56 H ; 46 L", M5060, "Le berceau" alanları cache ile birebir aynı (ham recheck: `Q5966403-pop-recheck-20261114.html`).
- **Orsay FR (K1, Wayback 2026-09-12) + EN (K2, Wayback 2026-08-11) + eski IT (K3, Wayback 2017-03-12)** metinleri yeniden okundu: künye/provenance/model/1874/kompozisyon doğrulandı. **Orsay canlı yeniden denendi → hâlâ 403 (Cloudflare);** Wayback kopyası geçerli.
- **JocondeLab (K5, Wayback 2026-02-01)** yeniden okundu: 56 H ; 46 L, Maurecourt (lieu d'exécution).
- **en/fr/it wikitext (K6/K7/K8) + TV5 (K9, Wayback 2025-04-30)** yeniden okundu; alıntı zincirleri ve D/E kaynakları teyit edildi.
- **Wikidata (K10/K11)** P571 (precision 9), P2048=56 (ref'li), P2049=46.5 (refsiz), P6216=Q19652, P127 (refsiz), P1476, P195/P276 niteleyicileri yeniden çekildi.
- **Commons (K12)** imageinfo yeniden okundu: 2 dosya PD; Yorck DateTimeOriginal 1873 (C044).

**Birincil iç çelişkileri (D):** genişlik 46↔46,5 (C041); yapım yeri Paris↔Maurecourt (C042); W-B katalog no 61↔25 (C043). **Görsel:** metadata only; vision kotası ana oturumda → İNCELENEMEDİ (C054); GZ TASLAK. **Kitap metinleri erişilmedi** (C055). **Erişim engelleri sürüyor:** Orsay canlı 403, JocondeLab canlı 502, TV5 canlı 403, enwiki API 429→200.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **Q5966403 için 0 hata; 0 uyarı.** DERS.json ve SORULAR.json şema geçerli; ek alan yok; kimlik desenleri (C###/CS##/DY##/AU##/GZ##/TK##) uygun; bolum_eslesme 12 bölüm; durum "İnsan incelemesi bekliyor". CJK: 0 (6 dosyanın tümü).
**Not:** Genel dogrula çıktısındaki 6 hata / 109 uyarı başka partilere aittir (Q3224275/Q328523/Q5826309 eksik DERS/SORULAR.json; diğer eserlerin kelime/heuristic bulguları). Bu esere ait hata/uyarı yoktur.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 451 | 400–500 | 3 dk |
| Orta | 1307 | 1300–1600 | 10 dk |
| İleri | 2780 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok (dogrula yakın-tekrar ve seviyeler-arası tekrar taraması temiz). İleri düzey gerçekten daha derin: birincil iç çelişkisi, provenance hipotez zinciri, kaynak eleştirisi envanteri, felsefi yorum katmanı.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (2 dosya PD: GAP 4104×5000; Yorck 2024×2604). **Vision kotası ana oturumda → İNCELENEMEDİ (C054 E).** Kompozisyon Orsay commentaire (A) + frwiki/itwiki/TV5 (B) METNİNDEN; "kaynakların betimlediği" kaydı. **GZ TASLAK.** Müze fotoğraf hakları ayrı (C062: © RMN / Patrice Schmidt / Michel Urtado / R.G. Ojeda; POP "utilisation soumise à autorisation"); eser PD (C035) ama müze fotoğrafları yeniden yayımlanmadı; görsel projeye kopyalanmadı, URL + lisans + kaynak referans. **İnsan editör görsel teyidi ZORUNLU** (özellikle data "çene" C047, "pembe kurdele" C048, "eğilmiş" C053, elbise deseni).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C054, E):** incelenemedi; GZ TASLAK; insan editör zorunlu. Data "çeneye dayanan el" (C047), "pembe kurdele" (C048), "eğilmiş" (C053), elbise deseni (düz↔çizgili) görsel teyit bekler.
2. **Birincil iç çelişkileri (D):** genişlik 46↔46,5 (C041; güncel Orsay 46,5 esas alındı, tercih beyanı); yapım yeri Paris↔Maurecourt (C042; çözülmedi, tek taraf kesinleştirilmedi); W-B no 61↔25 (C043; metne erişilmedi).
3. **1874 karşılama (C045, D):** Orsay "à peine remarqué" ↔ itwiki "coro indignato" + yaşlı usta anekdotu; itwiki anlatısı müze kaydıyla desteklenmiyor.
4. **Yorck metadata (C044, D):** Commons dosyası 1873 ↔ diğer kaynaklar 1872; görsel metadata hatası adayı.
5. **enwiki yazımı (C046, D):** "Portillon" ↔ birincil "Pontillon"; birincil teyitli.
6. **Zayıf/atıfsız iddialar (E):** 800 frank (C036, bozuk "Reald/Hackette" künyesi), Louvre 1868 tanışması (C037, atıfsız), Monet beşik karşılaştırması (C038, atıfsız), alternatif başlık (C039), ilk sahip kronolojisi (C040, WD refsiz), Moffett yılı (C050), TV5 atıf tarihi (C051), WD P180 (C052).
7. **Cassatt karşılaştırması (C049, E):** data "birlikte öncüler" iddiası doğrulanmadı; karşılaştırma önerisi pedagojik tercih olarak sunuldu (2008 sergi listesi A kanıtlı).
8. **Literatür (C055, E):** kitap metinlerine erişilmedi; B düzeyi iddialar wiki alıntı zinciri üzerinden; insan editör birincil literatür teyidi önerilir.
9. **Felsefi yorumlar (İleri §7, C063–C065):** tül-eşik, bakış-özen, fırça rejimleri; kurum dışı yorum, editör onayı.
10. **Kapanmışlık okuması (C033):** "sans doute" ihtiyatı korundu; yorum, olgu değil, quiz cevabı değil.

## 7. Yayına adaylık

Otomatik kısım sağlandı: temel kimlik/atıf birincil kaynakla doğrulandı (A); tüm olgusal cümleler kanıt kayıtlı; yorumlar C olarak ayrıldı; quiz cevapları A/B iddialara dayanıyor; kaynak bağlantıları erişim durumlarıyla kayıtlı; ciddi çelişkiler (6 D) ve belirsizlikler (14 E) açıkça belirtildi; Denetim A + B tamamlandı.
**Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil Orsay FR/EN/IT + POP AÇILDI (A); görsel İNCELENEMEDİ (E); insan editör görsel teyidi + birincil literatür kontrolü kritiktir.**