# KALİTE KONTROL — Q3998985 · I. Charles'ın Üç Pozisyonda Portresi · Anthony van Dyck

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ (arşiv katmanları genişletildi) · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** `.qwen/tmp/parti3/Q3998985-brief.md` + bu oturumda açılan ek birincil arşivler (S18/S19/S20/S21).
**Üretim betiği:** `.qwen/tmp/parti3/uret-Q3998985.py` (gen.build; post-pass build'dan ÖNCE → kelime sayıları birebir).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Üç dersteki bütün olgusal cümleler `[C###]` ile `KANIT_DOSYASI.md` envanterine bağlandı; dogrula.py çapraz kontrolü **Q3998985 için 0 hata / 0 uyarı**.

- **Toplam iddia:** 68 (C001–C068). **A=39 · B=9 · C=3 · D=8 · E=9.** KANIT "Sayım:" satırı DERS.json ile birebir uyumlu.
- **A düzeyi:** RCT arşiv kayıtları 2015/2017/2024 (künye, Bernini belgesi, provenance, teknik, betim, konum, Featured in), V&A canlı kopya kaydı, BM 2015 gravür kaydı, Prado 2024 kopya kaydı, Commons dosya lisansı.
- **B düzeyi:** enwiki/itwiki'nin kaynaklı maddeleri (yaygın ad, üç bakış, büst satış/geri alma, eş büst, Buchanan zinciri, kopya hipotezleri, WD katalog numaraları, gravür atıf tarihi).
- **C (yorum, 3):** C038 akım sınıflaması, C039 itwiki Bernini seyahati (atıfsız), C068 "Bernini kralı hiç görmedi" çıkarımı. Derslerde "(yorum)" ile işaretli.
- **D (8):** C037 WD P17, C041 konum, C042 boyut/yön, C043 provenance + RCT içi tarih, C044 Richelieu tarihi, C045 türev kopya tarihi, C046 Lotto başlığı, **C064 RCT 2024 Carlton House kronoloji anomalisı**. Hepsi "(tartışma)" işaretli; hiçbirinin doğru cevaplı sorusu yok.
- **E (9):** C033 Blommendael, C040 data hotspot, C047 görsel incelenmedi, C048 erişilemeyenler, C049 büst kronoloji nüansı, C054 itwiki kraliçe portreleri, C055 WD import/refsiz, C056 WD ref/etiket tutarsızlığı, C060 data ek iddiaları. Hepsi "(belirsiz)" işaretli; kesin anlatıma ve doğru cevaba girmez.
- **Belirsizlik korunması:** "probably begun in the second half of 1635", "presumably" (Lotto), "probably … (or another sculptor)" (Champaigne), "possibly/It is possible/may have been" (kopyalar), "attributed" (van Voerst), "possible copy" (Blommendael), "circa 1802", "Siglo XVII", "hopes were entertained" — hiçbiri kesinleştirilmedi.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B** kanıtlı; 5 AU serbest (C/D/E dahil). Çeldirici gerekçeleri bağlamsal (totoloji yok; dogrula totoloji kontrolü temiz). Doğru cevapların hiçbiri D/E'ye dayanmıyor; yorum tek doğru cevap yapılmadı.
- **GZ TASLAK:** `incelenen_bolgeler=[]` → gen.py `gz_taslak` beş sorunun ipucunu "TASLAK (görsel bu oturumda incelenemedi…)" ile başlattı.
- **Kelime/tekrar:** üç seviye hedef aralıkta; yakın tekrar ve seviyeler arası birebir cümle tekrarı uyarısı YOK (dolgu yok).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda **ham cache'ler yeniden açıldı** (yalnız taslağı okumak sayılmaz): S8 (RCT 2017 tam kayıt), S13 (V&A canlı), S12 (BM 2015), S15 (Prado 2024), S3/S4 (en/it wikitext), S1/S16 (WD EntityData), S2/S17 (etiketler), S5 (Commons imageinfo), S10 (JSTOR başlık), S6/S7 (403 + kabuk).

**Bu oturumda eklenen birincil kanıt (brief'in ötesinde):**
1. Canlı RCT yeniden denendi → **yine 403** (üçüncü deneme, farklı UA).
2. Wayback CDX (S21) tarandı: royalcollection.org.uk 6, rct.uk 8 snapshot. İlk http CDX denemesi zaman aşımına uğradı, https ile 200 alındı.
3. **S18 (2015-02-03) TAM kayıt açıldı:** aynı künye/description/provenance + ek Reference(s) kodları (XQG 1968 Stuart 11, XQG 1962 Treas 7, XQG 1999 CI 5, XQG 1988 Treas 11) → C061/C066.
4. **S19 (2024-05-18) TAM kayıt açıldı:** konum **"Queen's Drawing Room, Windsor Castle"** (C062), **"glazed"** (C065), provenance'a **Carlton House 1816 (no 570) / 1819 (no 548) + Windsor "Van Dyck Room"** (C063) ve **1822 ↔ 1816/1819 kronoloji anomalisı** (C064, D). "Featured in" → "Charles I: King and Collector" (C067).
5. **S20 (2025-01-20)** açıldı: SPA kabuğu (nesne verisi yok; yalnız "Featured in"); gzip nedeniyle `--compressed` ile yeniden çekildi.
6. 2015/2017/2024 karşılaştırması: künye + Description + Provenance çekirdeği **aynı**; 2024'te "costume"→"clothing" gibi küçük sözcük farkları (C061).

**Sonuç:** D001 (konum) ÇÖZÜLMEDİ ama birincil arşiv lehine ağırlık kazandı: RCT 2024 Windsor der, enwiki 2025 Holyroodhouse der, canlı kayıt 403 → D olarak kaldı. D003 (provenance) çözülemedi; ayrıca birincilin kendi içinde yeni bir anomali (C064) bulundu. **Erişilemeyenler değişmedi:** JSTOR Cust 1909 tam metni (yalnız başlık), BM/Prado canlı, RKD, Google Arts; kitapların hiçbirinin metni (Millar 1963, Cust 1909, Sharpe 1992, Barnes 2004, Griffiths 1998, Bellori/Bodart/Müller Hofstede, Larsen/Schaeffer) okunamadı → C048 (E).

**Semantik sınır:** bu tur aynı asistan tarafından yapıldı; yapısal testler olgusal doğruluğu garanti etmez. Haricî model/insan editör denetimi ayrı ve zorunludur.

## 3. Şema ve biçim

- `DERS_SEMASI.json` Draft 2020-12: **mini yorumlayıcı + jsonschema AKTİF**, Q3998985 için hata yok.
- `dogrula.py --test`: **25/25 geçti**.
- Global çalıştırmada **4 hata başka eserlerde** (Q2653851, Q7731855: eksik DERS.json/SORULAR.json) — bu oturumda o dizinlere **dokunulmadı**; parti sorumlusuna bildirilir.
- `bolum_eslesme`: 12 bölüm; tüm dosya#anchor referansları gerçek başlıklarla karşılaştırıldı → **sorunsuz**.
- **CJK taraması: 0** (KANIT + 3 ders + DERS.json + SORULAR.json + uret betiği).
- `durum`: **"İnsan incelemesi bekliyor"**; `kalite_kontrol.insan_onayi`: "Bekliyor".

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef (§8) | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | **445** | 400–500 | 3 dk | aralıkta |
| Orta | **1419** | 1300–1600 | 10 dk | aralıkta |
| İleri | **2868** | 2600–3200 | 20 dk | aralıkta |

DERS.json `kelime_sayisi` = ölçülen (post-pass build'dan önce uygulandığı için fark yok). Dolgu/tekrar yok; ileri seviye gerçekten daha derin sorular sorar (arşiv katmanları, belge zinciri, provenance anomalisi, epistemoloji, atıf dili).

## 5. Görsel doğrulama (Kural 6)

- Commons dosyası `Sir Anthony Van Dyck - Charles I (1600-49) - Google Art Project.jpg`, **5076 × 4252 px**, ~12,4 MB, Google Cultural Institute credit `BQHR9te2WWtyOA`.
- Lisans **Public domain** (PD-old-100-expired / PD-Art / CC-PD-Mark; Copyrighted False, AttributionRequired false). WD P6216=Q19652.
- **İncelenen bölge: YOK** (`incelenen_bolgeler=[]`); vision kotası ana oturumda. Görsel indirilmedi, projeye kopyalanmadı; derslerde URL + lisans + kaynak olarak referans verildi.
- Kompozisyon/ikonografi cümleleri RCT (A) + V&A (A) + enwiki (B) **metninden**; "kaynakların betimlediği" ibaresiyle sunuldu. **GZ TASLAK.**
- RCT arşiv görsel credit satırları ("© Her Majesty Queen Elizabeth II") ve V&A'nın ticari olmayan kullanım koşulları (A5/4000 tiraj; 768 px/5 yıl) not edildi — PD statüsü Commons dosyası içindir, kurumların kendi görsel politikaları ayrıdır.
- **İnsan editör görsel teyidi ZORUNLU:** özellikle inci küpe / Jartiyer yıldızı / altın madalyon / "bulutlu gök" (C040) ve boyut-yön (C042).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C047, E):** incelenmedi; GZ TASLAK; görsel teyit + hotspot doğrulaması zorunlu.
2. **Konum (C041, D):** RCT 2024 arşivi "Queen's Drawing Room, Windsor Castle" ↔ enwiki 2025 "The King's Gallery, Palace of Holyroodhouse" ↔ WD/itwiki Windsor. Canlı RCT 403; 2025/2026 arşivleri kabuk. **Güncel konum için kurum teyidi gerekir.**
3. **RCT 2024 provenance anomalisı (C064, D):** 1822 satın alma ↔ Carlton House 1816 (570)/1819 (548). Birincil kaynağın kendi içindeki tutarsızlık; kurumdan açıklama istenmeli.
4. **Provenance zincirleri (C043, D):** Wells/Irvine/Porter ↔ Buchanan/British Gallery 1821 ↔ V&A 1802/1822; ayrıca RCT içi "Painted for Bernini about 1637" ↔ "1635-before June 1636".
5. **Boyut/yön (C042, D):** RCT 84,4 × 99,4 ↔ enwiki ters ↔ itwiki 84,5 × 99,7 (atıfsız). DERS.json birincili esas aldı (yukseklik 84.4, genislik 99.4).
6. **Büst kronolojisi (C049, E):** Oatlands 17 Temmuz 1637 + 1638 yüzük ↔ Sharpe 1992'ye atfen 1638 papalık gönderimi; "January 1698" ve satış/geri alma yalnız enwiki'de (B). Sharpe 1992 metnine erişilmedi.
7. **Richelieu tarihi (C044, D) ve Lotto başlığı (C046, D):** 1642 ↔ 1641/1640 circa; "Portrait of a Man in Three Positions" ↔ "Triple Portrait of a Goldsmith". KHM/NG kataloglarından teyit önerilir.
8. **Türev kopya tarihi (C045, D):** WD Q59718167 P571=1636 ↔ Prado "Siglo XVII"; V&A 598-1882 "ca. 1750" ayrı nesne — karıştırma riski yüksek.
9. **Blommendael (C033, E):** itwiki "possible copy" iddiası ölü referanslı; BM Windsor kopyasını Dieussart'a bağlıyor. Windsor/RCT teyidi gerekir.
10. **data/ uyuşmazlıkları (C040/C060/C068):** hotspot'lar, "bulutlu gök", "kabul edilir", "Gainsborough/Reynolds etkisi", "1649 idamı gölgesi", "Bernini kralı hiç görmeden". **data/ DEĞİŞTİRİLMEDİ**; düzeltme önerileri KANIT §5'te.
11. **WD veri kalitesi (C037/C055/C056):** P17=Netherlands (D), refsiz alanlar, DBpedia/frwiki/Commons importu, P528 "50" ref uyumsuzluğu, 1899/1889 etiket tutarsızlığı.
12. **Eksik data kayıtları:** kunye.json, muze_numaralari.json (RCIN 404420), ders_kaynaklari.json, ikonografi.json, eser_hikayeleri.json, tanima_notlari.json, ders_dogrulama.json; önbellette lisans alanı boş; kısa ad varyantı ("Üç Açıdan I. Charles").
13. **Felsefi yorumlar (İleri §7):** Panofsky/Benjamin çerçeveleri ödünç; sanatçı etkisi iddiası YOK; editör onayı gerekir.
14. **Literatür (C048, E):** Cust 1909, Sharpe 1992, Millar 1963, Barnes 2004, Griffiths 1998, Bellori/Bodart/Müller Hofstede, Larsen/Schaeffer — metinlerine erişilmedi; yalnız kayıt/başlık düzeyinde anıldı.

## 7. Yayına adaylık

**Durum: "İnsan incelemesi bekliyor" — "Yayına aday" DEĞİL.**

§12 koşullarının durumu: temel kimlik/atıf birincil arşivle doğrulandı ✅ · olgusal cümleler kanıt kayıtlı ✅ · yorumlar olgulardan ayrıldı ✅ · quiz cevapları A/B'ye dayanıyor ✅ · kaynak bağlantıları erişim durumlarıyla kayıtlı ✅ · ciddi çelişkiler açıkça belirtildi ✅ · Denetim A ✅ · Denetim B ✅ (arşiv katmanlarıyla) · **görsel analiz doğru eser/görselle YAPILMADI ❌ (C047)** · **güncel konum/provenance ihtilafları çözülmedi ❌ (C041/C043/C064)** · **haricî model/insan editör denetimi BEKLİYOR ❌**.

Bu nedenle ders yayına aday gösterilmez. İnsan editör için asgari iş listesi: (a) görseli inceleyip GZ TASLAK'ları çözmek ve hotspot'ları doğrulamak, (b) RCT'den güncel konum + provenance anomalisı teyidi istemek, (c) KHM/NG/Windsor kataloglarıyla Lotto–Champaigne–Blommendael halkalarını teyit etmek, (d) erişilemeyen literatürü (özellikle Cust 1909 ve Sharpe 1992) temin etmek, (e) data/ düzeltme önerilerini onaylamak.
