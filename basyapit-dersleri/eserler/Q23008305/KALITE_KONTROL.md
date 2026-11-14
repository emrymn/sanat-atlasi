# KALİTE KONTROL — Q23008305 · Satranç Oynayan Kız Kardeşler (Gra w szachy / The Chess Game) · Sofonisba Anguissola

**Tarih:** 14 Kasım 2026 · **Parti:** 2 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti2/Q23008305-brief.md`).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q23008305 için temiz (0 hata / 0 uyarı)**.
- **Toplam iddia:** 72 (C001–C072). **A=17, B=22, C=6, D=11, E=16.** KANIT "Sayım:" satırı DERS.json ile birebir uyumlu.
- **A düzeyi:** S6 birincil müze sayfası (künye, yazıt, konservasyon, mülkiyet, meşe sembolü) + S6 biyografi (1532–1625, Campi, Michelangelo/Leonardo, İspanya sarayı, Van Dyck, unutulma, Polonya'da iki eser).
- **B düzeyi:** en/it/pl wiki + Commons + blogların kaynaklı iddiaları (figürler, yaşlar, proveniens, ikonografi, feminist okuma, Vida, karşılaştırmalar); atıf zincirleri "erişilmedi" notuyla.
- **C düzeyi (6):** C007 (FR 434), C012 (23 yaş), C019 (vezir/hamle), C020 (jest), C029 (Brescia sergisi), C072 (Burke evlilik yorumu) — "(yorum)"/"(belirsiz)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU (C/D/E dahil, serbest). A/B dışı quiz kanıtı **0**. Yanlış gerekçeleri bağlamsal (totoloji yok).
- **D/E işareti:** 11 D "(tartışma)", 16 E "(belirsiz)" — post-pass ile otomatik; belirsizlik işareti olmayan D/E cümlesi **0**.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak ipucu öneki uygulandı.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Ham cache'ler 14 Kasım 2026'da **yeniden açıldı** (taslağı yeniden okumak değil, ham metne dönüş):
- **S6 (mnp.txt, birincil):** künye "olej i tempera na płótnie, 72 x 97 cm"; mülkiyet "Własność Fundacji im. Raczyńskich przy MNP"; 1823 Berlin; yazıt paraphrase; Vasari 1556 Cremona baba evi + övgü; rentgen/stratigrafi (solda başlıklı kadın silueti üzerine boyanmış, görünen hizmetçi sonradan); meşe sembolü + baba hanedan arayışı; **biyografi 1532 Cremona – 1625 Palermo, Campi, Michelangelo/Leonardo, II. Felipe/Elisabeth de Valois, Van Dyck 92 yaş, unutulma, Łańcut 1554** → A.
- **S3/S4/S5 (en/it/pl wikitext):** circa 1555, oil on canvas, figür konumları, doğum sırası, yaşlar (15/13/10), Vasari alıntısı + en eski belge, proveniens (Orsini/Farnese 1653/1662/Parma/Napoli/Bonaparte 1815/Raczyński 1823/1884–1903/1903), ridipinture + 3 gravür, imkânsız diziliş + yanlış yön, Vida, feminist okuma, kolye, manzara → B; D001–D009 teyit.
- **S7/S8/S9 (Commons):** FR 434, 1823 **Paris** (D005), Brescia notu (E010), PD-art/PD-old-100-expired, Mortendrak 2021-04-26 CC-BY-SA-4.0 source beyanı, 4096×3236 / 3214×2436 → metadata.
- **S10/S11/S12 (blog):** Bastek "udają/taklit" + imkânsız diziliş + sayfa 27/03/2023 (D010); Niezła Sztuka 23 yaş + tempera + 1566 + yazıt; Burke "black queen" + "not playing chess" + Althorp 1561 + "panel" (D002) + evlilik/Moderata Fonte.
- **Ek bulgu:** itwiki/plwiki/niezla yazıtta **"ANCILAM" (tek L)**, enwiki **"ANCILLAM" (çift L)** → D004'e ek varyant notu (brief tablosu "ANCILLAM" der; ham metin tek L).

**Erişilemeyen:** Commons ilk 429→backoff 200; Studia Muzealne 2018 ve tüm kitap/dergi atıfları "kaynakçada anıldı, metne erişilmedi". DOI/ISBN/SBN/sayfa transkribe, bağımsız doğrulanmadı.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12 **AKTİF**): **Q23008305 için 0 hata; 0 uyarı.** CJK: **0** (tüm dosyalar + uret betiği tarandı). 12 bölüm eşlemesi tam; durum "İnsan incelemesi bekliyor"; `gorsel.dogrulama.incelenen_bolgeler=[]`.
- Not: Genel dogrula çıktısındaki 4 hata (Q1863885/Q94802 eksik DERS/SORULAR) ve öteki eser uyarıları **bu çalışmaya ait değildir**; o dosyalara dokunulmadı.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 420 | 400–500 | 3 dk |
| Orta | 1353 | 1300–1600 | 10 dk |
| İleri | 2630 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta. Kanıt bol (birincil biyografi + 3 wiki + 3 blog); içerik anlamlı, dolgu/tekrar yok (yakın-tekrar ve seviyeler-arası tekrar uyarısı yok).

## 5. Görsel doğrulama (Kural 6)

Commons metadata (2 dosya: P18 4096×3236 PD-art; WGA00697 3214×2436 PD). **Görsel bu oturumda İNCELENMEDİ (C056 E; vision kotası ana oturumda).** Kompozisyon/jest/renk S6 (A) + wiki/blog (B/C) METNİNDEN ("kaynakların betimlediği"). **GZ TASLAK.** Görsel projeye kopyalanmadı; URL+lisans+ kaynak referans. Fotoğrafçı CC-BY-SA-4.0 source beyanı not edildi (dosya lisansı PD-art). **İnsan editör görsel teyidi ZORUNLU.**

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C056, E):** incelenemedi; GZ TASLAK; jestler, halı deseni, hizmetçi ifadesi, tahta yönü için insan editör teyidi zorunlu.
2. **11 D ihtilaf:** tarih (circa), teknik (tempera/panel), Vasari yılı (1556↔1566), yazıt transkripsiyonu (MDLV/MDVL, ANCILAM/ANCILLAM), 1823 yeri (Berlin↔Paris), hizmetçi ilk yeri (sol↔orta), satranç (checkmate↔imkânsız), proveniens zinciri, Minerva jesti, Bastek tarihi, Miller&Yavneh edisyonu.
3. **16 E belirsizlik:** circa, hizmetçi kimliği/rolü, Lehçe/İtalyanca hedge'ler, yaş/doğum, FR 434 birincilde yok, WD checkmate ref'siz, hizmetçi ifadesi (data↔S5↔S11), Bianca 1557, Brescia notu, yaş alegorisi, Bastek "taklit", spinet/Althorp kimliği, görsel, "Anadolu halısı".
4. **data/ uyuşmazlıkları (veri notu, data DEĞİŞTİRİLMEZ):** özet hizmetçi oynuyor iması; Van Dyck "yüz yaşına yaklaşırken"↔92; "gülümsüyor"↔sıkılganlık/merak; "Anadolu halısı"↔"Doğu halısı"; "mürebbiye"↔ancilla/piastunka; onbellek lisans alanı boş.
5. **Literatür (E):** Studia Muzealne 2018 + Garrard/Simons/Cole/Chadwick/Perlingieri/Miller&Yavneh/Sofonisba 1994/Vida/Oczko/Pizzagalli metinleri erişilmedi; atıf zinciri.
6. **Felsefi/estetik yorumlar (İleri §7):** oyun/ciddiyet, emek, evlilik-öncesi özgürlük, paradoks — açıkça "(yorum)"; kurum dışı, editör onayı. Burke/Moderata Fonte aktarımı blog kaynaklı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + quiz A/B + D/E işareti + kelime + 12 bölüm + CJK 0). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir.** Birincil S6 AÇILDI (A); görsel İNCELENEMEDİ (E); insan editör görsel teyidi + D/E çözümü + literatür erişimi kritiktir.
