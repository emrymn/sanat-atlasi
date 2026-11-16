# KALİTE KONTROL — Q185255 · Kana'da Düğün (Les Noces de Cana) · Paolo Veronese

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti3/Q185255-brief.md`); ham cache `.qwen/tmp/parti3/`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q185255 için temiz (0 hata / 0 uyarı)**.
- **Toplam iddia:** 73 (C001–C073). **A=19, B=34, C=2, D=12, E=6.**
- **A düzeyi (19):** Louvre birincil S5/S6 (künye/boyut/envanter/edinim/konum), S8 (en büyük resim/1815/1870-1939/Salle des États), S9 (kompozisyon/konu/sembolizm/sipariş/restorasyon), S13 (faksimile/söküm), S14 (Le Brun takas), S10/S11 (PD-Art).
- **B düzeyi (34):** Hanson 2010 (S12) sözleşme/ödeme/kompozisyon/protokol/ikonografi/yemekhane geleneği; Factum (S13) restorasyon eleştirisi/orijinallik; wiki/WD atıf zincirleri.
- **C düzeyi (2):** C024 (konuk teşhisleri, geleneksel/hipotetik), C032 (kum saati vanitas, üçüncül) — "(yorum)" işaretli.
- **D düzeyi (12):** C039–C050 (D1–D12) — "(tartışma)" işaretli.
- **E düzeyi (6):** C035 (data/ etki+Engizisyon iddiaları), C038 (Cini güncel restorasyon planı), C051 (görsel incelenmedi), C066 (optimi colori), C067 (1,591 files), C068 (güncel çerçeve/asma) — "(belirsiz)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B kanıtlı**; 5 AU serbest (C/D/E dahil). CS doğru cevapları A/B'ye dayanır; D/E değerler yalnız çeldirici (örn. CS01-B itwiki 666×990) ve yanlış gerekçeleri bağlamsal. Totolojik çeldirici yok.
- **Yorum/olgu ayrımı:** İleri §7 açıkça "yorum"; Rosand/Hanson/Factum yorumları "(yorum)" + atıfla; sanatçı-etki iddiası YOK.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak otomatik "TASLAK" öneki.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Ham cache'ler 14 Kasım 2026'da yeniden okundu (brief'ten bağımsız tur):
- **S5/S6 (Louvre HTML+JSON):** "INV 142 ; MR 384 … 6,77 m × 9,94 m … huile sur toile … Peint en 1562-1563 … prélevé en 1797 ; transporté … 1798 … conquête militaire … Etat … Salle 711" ✓.
- **S8/S9 (Louvre):** "biggest painting in the Louvre", "left end of the table", "no less than 130", "most likely … Benedetto Caliari", "1989 to 1992 … ICI France", "red to green—its original hue", 1815 Le Brun takası, 1870/1939 ✓.
- **S12 (Hanson 2010, tam metin):** sözleşme/324 dukat/Palladio 1559/U masa 4+21/mucize far right-far left/scalco-yeşil/sprezzatura/1562 sumptuary/Galenik/Rosand ekseni/SILENTIUM/Guidi 1565/yemekhane geleneği/Cervio-Messisbugo-Romoli-Scappi ✓. **Dipnot 22: 1573 Levi/Engizisyon davası + Trento 1563** ✓.
- **S13 (Factum 2008):** 11 Eylül 2007 faksimile "current condition", "horizontal cuts … strip by strip", "left hand corner", Villot/Planche/Delacroix 1853, orpiment/realgar "probably … Véronèse … 1563", 1705 kısıtı, Malraux/Cini, ~9 milyon ✓.
- **S14 (MiC Le Brun):** "intorno al 1650", 1815 Venedik, 385×316, 1962 foderato, "Luca (7, 30-50)" ✓.
- **S3/S4 (wiki wikitext):** D1 (666×990), D2 ("right wing"), D3 ("sette pezzi"), D4 (September/November), D5 (çalgılar), D6 (17th/18th), D7 (Simon 1653), D12 (NYT 17 Dec ↔ URL 17 Nov) ✓.
- **S1 (WD):** P217 INV 142+MR 384, P195 Q3044768 (1798), P186 oil+canvas, P571 prec=8, P793 1990–1992 ✓.
- **S10/S11 (Commons):** 10068×6742, PD-Art, Shonagon 2024 ✓; **görsel İNCELENMEDİ**.

**Brief güncellemesi (insan onayına):** Brief E11/C035 "1573 Engizisyon kaynaksız" der; S12 dipnot 22 davayı içerdiğinden **C052 (B)** eklendi. C035 brief'teki gibi **E** korundu (data/'nın "Rubens/Tiepolo/Delacroix etkisi" iddiası hâlâ desteksiz). C052 quiz'de KULLANILMADI; derslerde yalnız Hanson-atıflı ve ayrı-eser (Levi) vurgusuyla anıldı.

**12 ihtilaf (D) açık:** boyut, gelin/damat, kesim parça sayısı, teslim tarihi, çalgı/kadro, geleneğin yüzyılı, takas adı/tarihi, söküm yılı, yüzölçümü, manto rengi, metadata güncelleme, NYT tarihi.

**Erişilemeyenler:** Factum canlı 429 / ArtBonus canlı 404 (arşivleri açıldı); NYT Simons 1992 (registration), NYRB Uglow 2021 (abonelik); Joconde/RKD/GAC URL yok; kitap/makaleler metne erişilmedi (KANIT §1).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **Q185255 için 0 hata / 0 uyarı.** DERS.json + SORULAR.json şema geçerli; bolum_eslesme 12 bölüm; durum "İnsan incelemesi bekliyor"; kelime sayıları DERS.json ↔ dosya tutarlı. **CJK: 0** (7 dosya tarandı).
- Not: Genel dogrula çıktısındaki hatalar (Q1240092, Q512755, Q7731855, Q63341, Q3998985 vb.) **başka partilerin eşzamanlı/eksik dizinleridir**; Q185255 ile ilgisi yok, dokunulmadı.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 410 | 400–500 | 3 dk |
| Orta | 1305 | 1300–1600 | 10 dk |
| İleri | 2621 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok (§8). Seviyeler arası birebir uzun cümle tekrarı yok. İçerik derinliği seviyeyle artar (İleri: sözleşme analizi, ziyafet dili, restorasyon kimyası, orijinallik felsefesi, 12 ihtilaf envanteri).

## 5. Görsel doğrulama (Kural 6)

Commons P18 dosyası metadata + lisans (PD-Art, 10068×6742, Shonagon 2024); **görsel bu oturumda İNCELENMEDİ (vision kotası ana oturumda) → C051 E.** Kompozisyon S9 (A) + S12/S13/S4 (B) **METNİNDEN**; "kaynakların betimlediği" ifadesi kullanıldı. **GZ TASLAK.** En-boy oranı farkı (1,493↔1,468) çerçeve/kırpma olabilir, sonuç çıkarılmadı. Müze fotoğrafı ayrı (© 2010 Louvre/Dequier). Görsel projeye kopyalanmadı; URL+lisans+kaynak referans. **İnsan editör görsel teyidi ZORUNLU** (özellikle gelin/damat konumu D2, manto rengi D10, müzisyen/kum saati ekseni).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C051, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi zorunlu.
2. **12 ihtilaf (D, C039–C050):** boyut (itwiki 666×990), gelin/damat (enwiki "right wing" ↔ Louvre/Hanson/Factum "sol"), kesim (yedi parça ↔ şerit), teslim (Eylül/Ekim/Kasım 1563), çalgı/kadro, geleneğin yüzyılı, takas adı/tarihi, söküm yılı, yüzölçümü, manto rengi, metadata, NYT tarihi.
3. **Manto rengi (D10, C048):** Louvre "yeşil özgün" (A) ↔ APIAH/Factum "rouge marron Veronese" (B); orpiment/realgar kimyası; erken kopyalar kırmızı. Editör karar vermeli.
4. **Brief güncellemesi (C052/C035):** 1573 Engizisyon S12 dipnot 22'de var (B, Hanson üzerinden; Fehl 1961 erişilmedi); data/ etki iddiası (Rubens/Tiepolo/Delacroix) desteksiz (E). data/ düzeltmesi insan onayına.
5. **Teşhisler (C024 C, C022/C023 B-belirsiz):** konuk portreleri ve müzisyen geleneği kesin değil; Diego Ortiz hipotezi; Louvre "not really identifiable".
6. **data/ boşlukları:** muze_numaralari.json'da Q185255 yok; kunye.json'da eser künyesi yok; eserler_onbellek lisans alanı boş (gerçek PD-Art); tarih "1562" → "1562–1563" önerisi. data DEĞİŞTİRİLMEDİ.
7. **Restorasyon tarihi varyantı:** Louvre 1989–1992 (esas) ↔ WD 1990–1992 ↔ enwiki 1989 ↔ S13 "1989–91 cleaning".
8. **Erişilemeyen atıf zincirleri (E/B-belirsiz):** NYT/NYRB/kitaplar; C027/C025/C029/C066/C067.
9. **Felsefi yorumlar (İleri §7):** Hanson/Factum/Rosand yorumları + Bakhtin/aura karşılaştırması; etki iddiası değil; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema, çapraz tutarlılık, quiz A/B, kelime, CJK, 12 bölüm). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir.** Birincil Louvre AÇILDI (A); Hanson/Factum/MiC arşivleri erişildi (B/A); görsel İNCELENMEDİ (E) → insan editör görsel teyidi + 12 ihtilaf kararı + data/ düzeltme onayı kritiktir.