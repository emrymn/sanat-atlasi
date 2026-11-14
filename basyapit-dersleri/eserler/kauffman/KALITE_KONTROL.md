# KALİTE KONTROL — kauffman · Gracchusların Annesi Kornelia (Cornelia, Mother of the Gracchi) · Angelica Kauffman

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** `.qwen/tmp/parti4/kauffman-brief.md` (ham cache'ler `.qwen/tmp/parti4/`).
**Eser anahtarı:** `angelica-kauffman|Cornelia, Mother of the Gracchi (slaytta: Cornelia Pointing to Her Children as Her Treasures)` (QID yok; WD Q134603748 bu araştırmada bulundu, data'ya yazılmadı).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Üç dersin bütün olgusal cümleleri `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 58 (C001–C058). **A=16, B=20, C=4, D=6, E=12.** KANIT "Sayım:" satırı DERS.json ile birebir uyumlu.
- **A düzeyi:** VMFA Wayback birincil (künye/imza/sergi geçmişi/görsel koşulu), Christie's canlı (Varşova imza-tarih/boyut/provenance/çerçeve), Zamek Wayback (2021 edinim/2022 sergisi), Valerius Maximus IV.4 Latince (anekdot/söz/ahlaki), Commons PD şablonları.
- **B düzeyi:** üç versiyon hikâyesi ve Varşova kompozisyon betimi (S14 lot essay), Neoklasik bağlam/David karşılaştırması (S14/S15), kariyer/RA/eğitim sınırı (S7), Cornelia belleği/mektuplar/heykel/modern alımlama (S6/S9), Hetsch/Suvée (S9/S6).
- **C (yorum, 4):** C024 jestin kızı kapsaması; C028 Poniatowski rezonansı; C057 Stoacı mülkiyet etiği; C058 cinsiyetli cumhuriyetçilik. Hepsi metinde "(yorum)" işaretli; etki iddiası kurulmadı (§7).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B** kanıtlı; 5 AU serbest (C/D/E dahil). Yanlış seçenek gerekçeleri bağlamsal (totoloji yok; dogrula totoloji kontrolü temiz). Doğru cevaplar D/E'ye dayanmıyor; yorum tek doğru cevap yapılmadı.
- **D/E işareti:** 6 D "(tartışma)", 12 E "(belirsiz)" post-pass ile eklendi; çift işaret yok; belirsizlik işareti kontrolü temiz.
- **GZ TASLAK:** görsel incelenmedi → gen.py gz_taslak beş soruyu da TASLAK ön ekiyle işaretledi.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda ham cache'ler yeniden açıldı ve iddialarla karşılaştırıldı (yalnız taslak okuma değil):
- **S4 VMFA Wayback (2025-06-16):** başlık/sanatçı/"ca. 1785"/oil on canvas/101.6×127/75.22/G213/Williams Fund/imza "Angelica Kauffman pinxt"/sergi listesi/CC BY-NC + PD credit koşulu ✓. Canlı S3 DNS SERVFAIL (000) — erişilemediği gibi davranılmadı, arşiv kesiti olduğu beyan edildi.
- **S14 Christie's lot 6338032 (canlı):** "signed and dated 'Angelica Kauffman / pinxit Rome / 1788' (lower right)", 110×152, Lamont & Son çerçeve, provenance (Poniatowski Ocak 1788 → İsveç → Valls by 1994 → Dickinson 1995), üç versiyon lot essay, Sempronia/distaff, Memorandum + kayıp Brutus pendant, Baumgärtel/Roworth notları ✓. **Betimin Varşova versiyonuna ait olduğu doğrulandı; VMFA'ya aktarılmadı.**
- **S15 Zamek Wayback (2023-05-20):** 2021 satın alma, devlet fonları, 8 Mart–21 Eylül 2022 Antyszambra sergisi, David karşılaştırması, Pompei/Aydınlanma bağlamı, diğer Kauffman eserleri listesi ✓.
- **S16 Valerius Maximus IV.4.init (Latince):** "cum Campana matrona … traxit eam sermone, <donec> e schola redirent liberi, et 'haec' inquit 'ornamenta sunt mea'" + "omnia nimirum habet qui nihil concupiscit" ✓. Kızın metinde olmadığı teyit (yalnız "liberi").
- **S1/S2 WD EntityData:** P571 precision=yıl + P1480=circa; P217=75.22; P2048/49=101.6/127; P6216 + P459 ✓. Varşova S2: tüm refs P143=Q565 (Commons ithal), P217 refsiz → D001 teyit.
- **S5–S10 wikitext:** S5 Cornelia satırı "History / c. 1785 / oil on canvas / VMFA + katalog linki" ✓; S6 Anthon varyantı + Hemelrijk + mektup tartışması + Ohio/Dinner Party ✓; S7 RA iki kadın kurucu + nü model sınırı + Canova cenaze ✓; S8 galeri "1785" (circa'sız, D002) ✓; S9 Varşova 1788/110×152 + Hetsch 1794 ✓; S10 "haec ornamenta mea / ecco i miei gioielli" + 189?/110 circa ✓.
- **S11/S12/S13 Commons metadata:** S11 açıklamasının dewiki Varşova maddesine bağlandığı (D001) ✓; S12 provenance şablonunda 2021-10-14 / USD 1,110,000 (S14 metninde yok → E006) ✓; S13 PD-old-70, source="wikipedia", kategorisiz ✓.

**Erişilemeyen:** VMFA canlı (DNS); Weimar birincil URL (bulunamadı, uydurulmadı); itwiki yanlış başlıkları (missingtitle → doğru başlık bulundu); kitaplar (kaynakçada anıldı, metne erişilmedi — C056).

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12, venv-dogrula): **kauffman için 0 hata / 0 uyarı.** Genel çıktıda 0 hata / 98 uyarı; uyarıların tamamı öteki eserlere ait (eşzamanlı parti üretimi; kauffman bölümü temiz). CJK taraması (md+json): **0**. Üretim sırasında iki dil hatası (CJK "CJKCJKCJK", "táiin") yakalanıp düzeltildi; bir heuristic yanlış pozitifi ("Fantham vd." cümle bölünmesi) kısaltma açılarak giderildi.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 452 | 400–500 | 3 dk | ✓ |
| Orta | 1366 | 1300–1600 | 10 dk | ✓ |
| İleri | 2776 | 2600–3200 | 20 dk | ✓ |

Üç seviye farklı derinlikte yazıldı (yakın tekrar / seviyeler arası birebir cümre tekrarı kontrolleri temiz); dolgu yok. Teknik rapor bulunmadığından teknik başlık bilinçli olarak kısa tutuldu (§8).

## 5. Görsel doğrulama (Kural 6)

Üç Commons dosyası (S11 VMFA 1538×1217 PD-old-100; S12 Varşova 3200×2355 PD-Art; S13 proje 1516×1200 PD-old-70) **yalnız metadata**; vision kotası ana oturumda olduğu için **İNCELENMEDİ (C055 E)**. Projedeki görselin VMFA versiyonu olduğu **yalnız en-boy oranı + başlık çıkarımı (C020 E)**; kesin kimlik kanıtı değil. Kompozisyon anlatımı kaynak metinlerinden; Christie's betimi **Varşova versiyonuna** ait ve açıkça etiketlendi. data/ derslerindeki betimlemeler (bulla/madalyon, tomar, kostüm renkleri, jest yönleri) **doğrulanmadı (C053 E)** ve derslere olgu olarak taşınmadı. Görseller projeye kopyalanmadı; URL + lisans + kaynak referans. VMFA PD görsel credit koşulu not edildi (C021). **GZ TASLAK; insan editör görsel teyidi ZORUNLU.**

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C020/C055, E):** üç dosya incelenmedi; proje görselinin VMFA versiyonu olduğu oran çıkarımı; GZ TASLAK. Ana oturumda vision ile doğrulanmalı.
2. **Versiyon karışıklığı (D001, C040):** S11 VMFA görseli ↔ dewiki Varşova maddesi bağlantısı; WD Varşova refs Commons ithal. Üç versiyonun boyut/tarih/yer ayrımı editörce kontrol edilmeli.
3. **data/ betimlemeleri (C053, E008):** mevcut slayt derslerindeki görsel ayrıntılar (bulla, altın zincir, kostüm, jest yönleri) kanıtsız; görsel teyit sonrası düzeltme/çıkarma önerisi insan onayına.
4. **VMFA provenance boşluğu (C049, E004):** zincir yok; 1975 edinim yılı yalnız numara çıkarımı; Bowles siparişi B düzeyi. Müzeyle teyit önerilir.
5. **Weimar versiyonu (C050, E005):** birincil URL bulunamadı; tarih/boyut yok. Schlossmuseum/Kunstsammlungen zu Weimar kataloğu aranmalı.
6. **Anekdot varyantı (D004, C043):** ders S16 Latince varyantını izliyor; Anthon tabanlı popüler varyant ve söz dizimi farkı editör onayına.
7. **VMFA iç tutarsızlıkları (D005/C044 Thyssen tarihleri; C047 RA "No. 86 or 196"; C048 kayıt uyarısı):** düzeltilmeden beyan edildi; müze teyidi önerilir.
8. **Açık artırma tarih/fiyatı (C051, E006):** yalnız Commons şablonunda; Christie's arşivinden teyit edilmeli.
9. **Cornelia yaşam tarihleri (C046, E009) ve Sempronia özdeşliği (C054, E010):** belirsiz; kesinleştirilmedi.
10. **Yorumlar (C024/C028/C057/C058):** felsefi/estetik okumalar kurum dışı yorum; etki iddiası yok; editör onayı.
11. **Erişilemeyen literatür (C056):** Roworth 2003 (pp. 202–206) ve Hemelrijk 1999 bu eser için kritik ikincil kaynaklar; metne erişilmedi, temin önerilir.
12. **Küçük oran uyuşmazlığı (C045, D006):** data 1.27 ↔ orijinal ≈1.263; yerel türev kırpma kontrolü.

## 7. Yayına adaylık

Otomatik kısım sağlandı: künye birincil (arşiv) kayıtla doğrulandı; tüm olgusal cümleler kanıt kayıtlı; yorumlar olgulardan ayrıldı; quiz cevapları A/B iddialara dayanıyor; kaynak bağlantıları erişim durumlarıyla kayıtlı; ciddi çelişkiler (6 D) açıkça belirtildi; Denetim A + B tamamlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler, olgusal doğruluğu garanti etmez; bu tur aynı asistan + agent araştırmasıyla yapıldı, haricî model/insan editör denetimi ayrıca gereklidir. **Görsel incelenmediği için görsel teyit + data betimleme düzeltmesi + Weimar birincil kaydı yayına adaylık için kritik ön koşullardır.**
