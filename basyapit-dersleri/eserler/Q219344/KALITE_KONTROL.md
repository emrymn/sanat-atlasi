# KALİTE KONTROL — Q219344 · Köle Gemisi (The Slave Ship) · J. M. W. Turner

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti4/Q219344-brief.md`); ham cache'ler `.qwen/tmp/parti4/Q219344-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q219344 için temiz (0 hata / 0 uyarı)**.
- **Toplam iddia:** 71 (C001–C071). **A=27, B=32, C=5, D=3, E=4.** KANIT "Sayım:" satırı DERS.json ile birebir tutarlı.
- **A düzeyi:** MFA birincil katalog (Wayback S4/S5) — künye, tam provenans, şiir, Ruskin alıntısı, "hot churning color" betimi, detay/sesli rehber seçenekleri, erişim yöntemi.
- **B düzeyi:** enwiki/itwiki/Zong maddesi (S2/S3/S9) akademik atıf zinciri; biçimsel betim, ikonografi yorumları, alımlama, Zong hukuk/sayı.
- **C düzeyi (yorum):** WD refsiz tür/akım/conu (C049/C050), Sanayi Devrimi alegorisi (C043), miras (C051), enwiki 1844 aktarımı (C035).
- **D düzeyi (tartışma):** C056 (Ruskin 1843/1844), C057 (Zong sayısı), C058 (1872 Met).
- **E düzeyi (belirsiz):** C037 (Thackeray atıfsız), C059 (görsel incelenmedi), C060 (refs erişilmedi), C061 (empasto/habercilik doğrulanmadı).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU serbest (C/D/E dahil). Yanlış seçeneğe gerekçeleri bağlamsal (totoloji yok); doğru cevaplar D/E'ye dayanmaz, yorum tek doğru cevap yapılmaz.
- **D/E işareti:** 3 D "(tartışma)", 4 E "(belirsiz)" — post-pass ile; çift işaret temizlendi. C yorumlar "(yorum)" işaretli.
- **GZ TASLAK:** görsel incelenmedi → gen.py gz_taslak otomatik (5/5 ipucu "TASLAK" önekli).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Ham cache'ler 14 Kasım 2026'da yeniden açılıp iddialarla karşılaştırıldı (taslağı yeniden okumak değil, kaynak metnine dönüş):
- **S4/S5 (MFA Wayback 2026-08-15 + 2019-01-07):** başlık, 1840, oil on canvas, 90.8×122.6, 99.22, Pierce Fund, Gallery 251, tam provenans (Griffith→J.J. Ruskin 1843→1869 unsold→Johnston 1872→Hooper 1876→Lothrop→MFA 1899 $65.000), Fallacies of Hope 7 dize, Ruskin alıntısı ✓. İki kopya künyede aynı; 2026 terminoloji güncel ("enslaved people", "18th-century poem", Scott 2010 notu) ✓.
- **S2/S3 (en/it wikitext):** Thomson Summer, 250 gine, Clarkson/Gisborne "possibly/presumibilmente", Burke sublime, Landow/Döring alıntıları, Twain/NYT, Thomas Day, biçimsel betim ✓. Thackeray satır içi atıfsız → E ✓.
- **S9 (Zong):** 142 (Walvin), Kelsall "outside number 142" (Lewis), "number of deaths is unknown", "figures ... inaccurate", "more than 130", Zorg→Zong, 30 £ sigorta, 29 Kasım 1781, Guildhall 6 Mart 1783, 420 galon su ✓.
- **S1 (WD EntityData):** P1476/P571/P186/P2048/P2049/P195/P217/P276/P18/P180/P135/P136/P6216 ✓. **Düzeltme:** brief'in "S1 P580" atfı hatalı — cached EntityData'da P580 YOK; C010 yalnız S4/S5 (A). P276 ikinci değer Q145 (UK) muğlak → D4 notu.
- **S6/S7 (Commons):** 2152×1616, 465.140 bayt, PD-Art-100-1923, UsageTerms "Public domain", AttributionRequired false, credit MFA ✓.

**İhtilaflar D olarak açık:** D1 (C056), D2 (C057), D7 (C058). Çözümlü notlar: D3 boyut (A esas), D4 WD P276 (MFA esas), D5 Typhon/Typhoon (belgelenmiş varyant), D6 MFA sürüm farkı. **Erişilemeyen:** MFA canlı (403 + TLS), akademik refs metinleri (C060); DOI/ISBN doğrulanmadı.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12, `.qwen/tmp/venv-dogrula`): **Q219344 için 0 hata; 0 uyarı.** Genel koşudaki 7 hata / 84 uyarı **başka eserlere** aittir (Q212616/Q2324840/Q311243 eksik dizinleri + öteki eserlerin kelime uyarıları); bu esere ve diğer eserlere dokunulmadı. CJK: **0**. `bolum_eslesme` 12 bölüm; `durum="İnsan incelemesi bekliyor"`; `gorsel.dogrulama.incelenen_bolgeler=[]`.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 424 | 400–500 | 3 dk |
| Orta | 1349 | 1300–1600 | 10 dk |
| İleri | 2619 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok (yakın tekrar ve seviyeler arası birebir cümle kontrolleri temiz). İleri düzey gerçekten daha derin: kaynak eleştirisi, D1/D2/D7 envanteri, hukuk/sayı belirsizliği, estetik-etik münazara, ekfrasis.

## 5. Görsel doğrulama (Kural 6)

Commons File:Slave-ship.jpg metadata + lisans (PD-Art-100-1923; AttributionRequired false); **2152×1616 px, zayıf çözünürlük bayrağı (zayif_eserler.csv 2625).** **Görsel bu oturumda İNCELENMEDİ (C059 E)** — vision kotası ana oturumda. Kompozisyon **MFA (A: C068) + S2/S3 (B: C047/C048/C053) METNİNDEN**; derslerde "kaynakların betimlediği" ifadesi kullanıldı. **GZ TASLAK.** Görsel projeye kopyalanmadı; URL + lisans + kaynak referansı verildi. MFA canlı erişimi engelli olduğundan yüksek çözünürlüklü alternatif alınamadı. **İnsan editör görsel teyidi ZORUNLU** (özellikle data "gemi solda" ↔ S2 "gemi uzakta" uyuşmazlığı ve ön plan figürü cinsiyet varsayımı).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C059, E):** incelenmedi; GZ TASLAK; insan editör görsel teyidi zorunlu. data gemi konumu ("solda") ↔ S2 ("uzak arka plan") uyuşmazlığı görselle çözülmeli.
2. **D1 (C056):** Ruskin'e geçiş Aralık 1843 satın alma (MFA) ↔ 1844 hediye (enwiki); MFA "first owner" derken provenansta alıcı baba. Birincil tercih edildi; editör onayı.
3. **D2 (C057):** Zong kurban sayısı 132 ↔ 142 ↔ "unknown"; MFA sayı vermez. Kesin sayı kullanılmadı; quiz cevabı yapılmadı.
4. **D7 (C058):** 1872 "Met'te sergilenmek üzere satıldı" (enwiki) ↔ MFA Johnston zinciri; Met sergisi provenansta açık değil.
5. **Önceki "yanlis" bayrağı:** data/ders_kaynaklari.json (d8169c7fb8) "1840 kölelik karşıtı hareketin güçlü olduğu dönem" cümlesini yanlış işaretler; kanıt (MFA RA 1840 A + McCoubrey kongreler B) cümleyi DESTEKLİYOR. Bayrak hatalı görünüyor → data düzeltme önerisi (data değiştirilmedi).
6. **data empasto + habercilik (C061, E):** "empasto" ve "Empresyonizm/soyut resim habercisi" çekilen kaynaklarda yok; doğrulanmadı → data düzeltme önerisi.
7. **data Zong kuşkusu:** "doğrudan bu olayı resmettiği kesin değildir" MFA'nın açık ifadesinden (A) daha güçlü; veri notu.
8. **Literatür (C060, E):** akademik refs metinleri erişilmedi; DOI/ISBN doğrulanmadı; "kaynakçada anıldı" notuyla verildi.
9. **Felsefi yorumlar (İleri §7):** Kant/Benjamin ödünç çerçeveler kurum dışı, açıkça "(yorum)" ve etki iddiası değil; editör onayı.
10. **Hassas konu:** köle ticareti şiddeti akademik ve açık ayrıntısız işlendi; içerik notu eklendi; editör onayı.
11. **Birincil erişim:** MFA canlı 403 + TLS engelli; Wayback kullanıldı. Canlı katalog teyidi insan editöre.
12. **Brief düzeltmesi:** "S1 P580" atfı hatalı (WD'de P580 yok); C010 yalnız S4/S5.

## 7. Yayına adaylık

Otomatik kısım sağlandı: künye/atıf doğrulandı (A), olgusal cümleler kanıt kayıtlı, yorumlar olgulardan ayrıldı, quiz A/B'ye dayalı, kaynak bağlantıları erişim durumlarıyla kayıtlı, ciddi çelişkiler (D1/D2/D7) açık, Denetim A + B tamamlandı. **Ancak durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler, olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir.** Görsel İNCELENMEDİ (E) ve akademik refs metinleri erişilmedi (E) olduğundan, insan editör görsel teyidi + literatür erişimi + data düzeltme önerileri kritiktir.
