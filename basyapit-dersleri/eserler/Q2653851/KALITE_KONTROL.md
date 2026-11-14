# KALİTE KONTROL — Q2653851 · Çarmıhın Dikilişi (De Kruisoprichting / The Elevation of the Cross) · Peter Paul Rubens

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti3/Q2653851-brief.md`); ham cache `.qwen/tmp/parti3/`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q2653851 için temiz.
- **Toplam iddia:** 70 (C001–C070). **A=10, B=36, C=1, D=10, E=13.** KANIT "Sayım:" satırı DERS.json ile birebir uyumlu.
- **A düzeyi (10):** katedral (S10) + Art in Flanders NL/EN (S08/S09) + KMSKA (S11) birincil kayıtları: ad, sanatçı, triptik, panel, boyut, in situ, env 947, katedral bakış yorumu, KMSKA 1747 baskı nesnesi, kurumsal fotoğraf lisansı.
- **B düzeyi (36):** Rooses 1904 tam metin (S14, arşiv dökümleri) + rubensonline Wayback 2016 (S06) + enwiki/nlwiki satır içi akademik atıf zinciri (Martin/Heinen/Belkin/Judson/Lawrence/Van Hout/Sutton/BAMPFA). refs metinlerinin kendisine erişilmedi (C061 E) — B zinciri notu düşüldü.
- **C (1):** WD konum zinciri sentezi (C040), "(yorum)" işaretli.
- **D (10):** C003 tarih, C022 sözleşme, C044 boyut, C045 WD 430, C046 aziz eşleştirme, C047 predella, C048 "1693", C049 yerleştirme, C050 itwiki teknik, C051 WD envanter — tümü "(tartışma)" işaretli, quiz doğru cevabı yapılmadı.
- **E (13):** C016 otoportre, C018 titulus, C032 Berlin 1914, C042 1605 tutulma, C053 meşe, C054 data görsel-içi, C055 sekiz yıl, C056 güncel konum, C057 Topstukken, C058 WD tarih zinciri, C059 WD P180, C060 görsel, C061 refs — tümü "(belirsiz)" işaretli, quiz doğru cevabı yapılmadı.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK kanıtı YALNIZ A/B (otomatik kontrol: 0 ihlal); 5 AU serbest (C/D/E dahil). Çeldirici gerekçeleri gerçek gerekçe (totoloji yok; gen.cs_gerekce_iyileştir hazır). Doğru cevaplar D/E'ye dayanmaz; yorum tek doğru cevap yapılmadı.
- **GZ TASLAK:** görsel incelenmedi → gen.gz_taslak 5 soruyu "TASLAK (görsel bu oturumda incelenemedi…)" ile işaretledi.
- **Hedge koruması:** "may be", "It is believed", "mogelijk", "waarschijnlijk vernietigd", "may perhaps", "some have suggested" aynen taşındu; circa/precision (WD prec=8) korundu.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Ham cache'ler 14 Kasım 2026'da yeniden açıldı ve iddialarla karşılaştırıldı (yalnız taslak okuma değil):
- **S10 katedral:** "1609 - 1610"; "Olieverf op paneel"; "middenpaneel: 460 x 340 cm"; "zijluiken: 460 x 150 cm"; Yedi Çarmıh Sözü (Mt 27,46 → Lc 23,46) + rol meditasyonu; "Vlaamse Meesters op hun Plek" ✓.
- **S08/S09 Art in Flanders:** Peter Paul Rubens; retabel triptiek/triptych; Inventarisnummer/Inventory number 947; Locatie O.L.-Vrouwekathedraal; topstukken/masterpiece tag; Hugo Maertens; "Contractuele beperkingen"; NL 0090013020/t43hx2z126, EN 0090013000/mk65449h8d ✓.
- **S11 KMSKA:** Datum 1747; "gravure en ets op papier"; 356 × 415 mm; Inventaris 10012; "P.P. Rubens pinxit in/ Templo Societ. Jesu Antverpiae"; Max Rooses bağışı 1900; kategori "grafiek" → **D005 nesne karışıklığı kanıtlandı** ✓.
- **S06 rubensonline Wayback 2016-12-03:** Datering "1609-10" + anlatı 1610→1610 sonu/1611 başı; 2600 gulden 1610–1613; scheepszeil; 1794→Louvre grande galerie 1815; 1816 nieuwe bestemming; Gheringh 1664; 3 predella + Baba Tanrı + 2 melek; 1735–1737 Kerrickx; 1737 beurs; Walburga→Leipzig MdbK, Engel→Flint, diğerleri "onbekend, waarschijnlijk vernietigd"; Amandus+Walburga / Catharina+Eligius ✓.
- **S14 Rooses 1904 tam metin:** 17 Mayıs 1610 koleksiyon; kaptan örtüsü; Haziran 1610 Klein Zeeland (9 fl 10 stuiver); 17 Haziran 1610 1000/2600; 12 Ağustos 1611 500; 1611–1613 2×250+600; Ekim 1627 Bruno 24 fl + rötuş; Steen→Vierschaar; Louvre ilk eskiz 6 adam; Holford/Witdoeck 1638; Christie's 1901; Rooses aziz eşleştirmesi (sapma); predella/Baba Tanrı/pelikan; 1733 izin/1737 Bourse; 1898 Valenciennes/1840 Gent/1881 Duchastel; 1797 depo/1817 yıkım; 1794 Paris/1815 kral→katedral "left part of the transept"; van Regemorter; 1847–1854 Le Roy/1849 rapor; dokuz adam + diyagonal; halat; "in whom we recognise Rubens"; köpek "curly brown and white hair"; ışık-gölge; Santa Croce 1602; Tintoretto San Rocco; Guido Reni; "hate leagued against love"; Van Dyck "caricature"; grisaille + 2 istisna; Dulwich; "dry in touch… grey-brown"; Sallaert; "first manner" ✓.
- **S02/S04/S03 wikitext + S01 WD + S13 Commons:** tüm künye/betim/provenance/tasarım/AGO/aziz/trivia alanları ve WD P217/P4905/P2048/P2049/P571/P186/P276/P6216/P180 doğrulandı; itwiki atıfsızlığı ve "1693" hatası teyit ✓.

**Erişilemeyen (E olarak kayıtlı):** S05 canlı (404), S07 Topstukken (JS), S12 RKD (JS+doğrulama), BALaT 24, Louvre INV 20188/MNR 411, Sotheby's lot 15, BAMPFA, De Standaard 2026, beckchris blog, Dunton 1896, rubensonline "4 referenties" popup.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12, venv-dogrula): **Q2653851 için 0 hata / 0 uyarı.** Genel koşudaki 9 hata bu partinin öteki (henüz tamamlanmamış) eserlerinin eksik dosyalarından: Q1140358, Q27097122, Q531329, Q764831 — dokunulmadı. 12 bölüm eşlemesi tam; bolum_eslesme anchor'ları başlıklarla uyumlu. **CJK: 0** (6 dosya tarandı). Kelime hedefleri §8 aralıklarında.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 414 | 400–500 | 3 dk |
| Orta | 1408 | 1300–1600 | 10 dk |
| İleri | 2727 | 2600–3200 | 20 dk |

**Not:** Dolgu/tekrar yok; seviyeler arası birebir uzun cümle tekrarı yok (dogrula seviye_tekrar temiz). İleri ders gerçekten daha derin: nesne karışıklığı anatomisi, arşiv dökümü kaynak eleştirisi (Rooses 18. yy kopyaları), kutsal topografya (Lawrence/Heinen), tasarım süreci, felsefi yorum (açıkça ödünç çerçeve), D/E envanteri.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (3 dosya PD: 2429×1792 / 2700×1941 / 1201×757); **görsel piksel düzeyinde İNCELENMEDİ (C060 E; vision kotası ana oturumda).** Kompozisyon/ikonografi S10 (A) + S02/S06/S14 (B) METNİNDEN; derslerde "kaynakların betimlediği" formülü. **GZ TASLAK.** Kurumsal fotoğraflar (Hugo Maertens) "Contractuele beperkingen" — serbest değil (C052 A); Commons PD reprodüksiyonları tercih edilir (C041). Görsel projeye kopyalanmadı; URL+lisans+kaynak referans. **İnsan editör görsel teyidi ZORUNLU** (özellikle titulus C018, köpek davranışı/kızıl güneş/boşluk C054).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C060, E):** incelenemedi; GZ TASLAK; insan editör teyidi zorunlu. data/ görsel-içi iddiaları (üç dilli titulus, "havlayan" köpek, "kızıl güneş", panolar arası boşluk) kaynaklarda yok/doğrulanmadı (C018/C054).
2. **KRİTİK nesne karışıklığı (C051, D005):** WD P217/P4905=10012 triptiğe bağlanmış; KMSKA birincil 10012 = 1747 gravür+ets (356×415 mm, Rooses bağışı 1900). Triptik env 947. WD düzeltmesi + data/ envanter alanı insan onayına.
3. **Tarih kümesi (C003, D001):** 1609–1610 ↔ 1610–1611 ↔ 1610 ↔ 1610'lar; tek yıl dayatılmaz. Sözleşme 1609/Haziran 1610 (C022, D007).
4. **Boyut (C044/C045, D003/D004):** 462×341 varyantı + WD 430 "center region" dayanaksız.
5. **Yerleştirme (C049, D010):** 1815 ↔ 1816; güncel katedral içi konum doğrulanamadı (C056).
6. **Predella akıbeti (C047, D008):** enwiki güncel değil; rubensonline 2016 Leipzig/Flint (ayrı kataloglar açılmadı); itwiki "tek panel" atıfsız.
7. **Aziz eşleştirmesi (C046, D006):** Rooses sapması; Eligius attribüt betim farkı (nlwiki çekiç+örs ↔ Rooses haç+kitap).
8. **Otoportre (C016, E001) + el birliği (C034, E002):** hedge korundu; kesinleştirilmedi.
9. **1914 Berlin (C032, E003) + 1605 tutulma (C042, E011):** atıfsız/erişilmeyen kaynak; doğrulanamadı.
10. **WD zayıf zincir (C058, E006) + P180 (C059, E012) + meşe (C053, E004) + Topstukken (C057, E013).**
11. **Literatür (C061, E):** refs metinleri erişilmedi; B zinciri wiki atıflarına dayanır.
12. **Felsefi yorumlar (İleri §7: Kant/Benjamin ödünç):** kurum dışı, açıkça "(yorum)"; etki iddiası yok; editör onayı.
13. **Lisans:** kurumsal fotoğraf "Contractuele beperkingen" (C052); Commons PD (C041); data/ boş lisans alanı doldurulabilir (değişiklik yapılmadı).

## 7. Yayına adaylık

Otomatik kısım sağlandı (Denetim A + B, şema, kelime, quiz A/B, CJK 0, D/E işaretleri). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil katedral + Art in Flanders + KMSKA AÇILDI (A); Rooses 1904 tam metin erişildi (B); görsel İNCELENMEDİ (E); insan editör görsel teyidi + WD nesne karışıklığı düzeltmesi kritiktir.**