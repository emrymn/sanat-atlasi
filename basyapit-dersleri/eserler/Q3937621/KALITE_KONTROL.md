# KALİTE KONTROL — Q3937621 · Marie Antoinette ve Çocukları · Élisabeth Vigée Le Brun

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ (bu oturumda canlı/arşiv yeniden açıldı) · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** `.qwen/tmp/parti4/Q3937621-brief.md` · **Kanıt:** `KANIT_DOSYASI.md` (67 iddia, 15 kaynak) · **Üretim:** `.qwen/tmp/parti4/uret-Q3937621.py`

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Üç dersin bütün olgusal cümleleri `[C###]` ile KANIT envanterine bağlandı; `dogrula.py` çapraz kontrolü **temiz**.

- **Toplam iddia:** 67 (C001–C067). **A=20 · B=18 · C=5 · D=8 · E=16.** KANIT "Sayım:" satırı ↔ DERS.json birebir uyumlu.
- **A düzeyi (birincil):** POP/Joconde 000PE008060 (S4) + GAP Versailles partner içeriği (S5) + arşiv Met (S7) + arşiv müze (S10) → künye, ölçü, imza, envanter, statü, konu, sipariş yılı, Salon, provenance, güncel salon, ödünç kimliği, PD lisans, notice kimliği/RMN fotoğraf izni, birincil ölçü, GAP Salon eleştirileri.
- **B düzeyi (kurum yayını/atıf zincirli ikincil):** NGC Magazine (S8, küratör Firmin/Lang alıntılı), Histoire par l'image (S9, Cornette), enwiki GA (S2, satır içi POP/Met/NGC/GAP/Mobilier national atıflı), itwiki (S3, Fraser/*Souvenirs* atıflı) → amaç, ikonografi, kostüm, kariyer, kopyalar/tapestry, Wertmüller öncülü, d'Angiviller alıntısı, yapım süreci, 1789 sonrası biyografi.
- **C düzeyi (yorum/atıfsız):** C019 taç (itwiki, satır içi atıf yok — **brief B idi, C'ye indirildi**, gerekçe KANIT'te), C027 "propaganda/devlet portresi" niteliği, C030 ağlama anekdotu + 4 Haziran 1789 (Fraser s.305, kitaba erişilmedi), C042 Commons atıfsız betimleri, C067 müfredat içi karşılaştırma künyeleri (data/ kaynaklı, haricî doğrulama yok). Hepsi derslerde "(yorum)" ile işaretli.
- **D düzeyi (8, brief D1–D8 aynen):** C044 boyut · C045 Salon 1787 · C046 siparişveren · C047 model · C048 mekân · C049 anekdot · C050 Met kimliği · C051 kürk/renk. Hiçbiri kesin cevaplı soruya girmedi.
- **E düzeyi (16, brief E1–E13 + görsel/erişim):** C028, C052–C066. Kuşku/olasılık dili aynen korundu: **"sans doute"** (S10), **"Peut-être"** (S9), **"suggests"** (S8), "yaklaşık" (müfredat kaydı).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK → kanıtların **tamamı A/B** (otomatik denetim: 0 ihlal). 5 AU serbest (C/D/E dahil). Her CS'de dört seçeneğin gerçek gerekçesi var; totolojik ("X değil.") çeldirici gerekçesi **yok** (dogrula totoloji katmanı temiz).
- **Quiz tasarım notu:** Siparişverenin kimliği (D3) ve boyut (D1) doğru cevap yapılmadı; CS05 yalnız **sipariş yılını** (1785, A) sorar. CS06'nın doğru şıkkı model adını (Raffaello/Giulio Romano, D4) içermez, yalnız şema + David tavsiyesini (B) içerir. DY04 birincil POP ölçüsünü (A) sorar, ihtilafı açıklamada not eder.
- **İşaret denetimi:** üç derste D/E/C etiketi taşıyan **her cümlede** ilgili işaret var (cümle bazlı öz-denetim: 0 eksik). Post-pass (`uret-Q3937621.py`) cümle bazında çalışır, mevcut işaretleri tekrarlamaz.
- **Kullanım:** 67 iddianın tamamı derslerde veya quiz'de kullanıldı; atıl iddia yok. Dolgu/tekrar yok: yakın tekrar ve seviyeler arası birebir cümle tekrar katmanları **temiz**.

## 2. Denetim B — Kaynağa bağımsız geri dönüş (bu oturumda YENİDEN AÇILDI)

Taslak yeniden okunmadı; kaynaklar fiilen yeniden açıldı ve pasajlar karşılaştırıldı. Kanıt: `.qwen/tmp/parti4/denetim-*.html|json`.

| Kaynak | Bu oturumdaki sonuç | Doğrulanan çekirdek |
|---|---|---|
| S4 POP/Joconde 000PE008060 | **canlı 200** (308→200, pop.culture.gouv.fr) | "commandé par Louis XVI en 1785"; "275 H ; 215 L"; "MV 4520 ; INV 3059 ; AC 1945"; "L.VIGEE-LE BRUN 1787"; "propriété de l'Etat"; "Louis XVI ; Couronne de France"; "Salon des artistes français, Paris, 1787"; "deux copies réduites ; traduit en tapisserie en 1814"; güncelleme 2 Kasım 2026; RMN fotoğraf kredisi "utilisation soumise à autorisation" |
| S5 GAP RQE3s9ANo6GnTg | **canlı 200** | "w1950 x h2710 mm"; "Antechamber of the Grand Couvert"; "Commissioned in September 1785 by the Director General of the King's Buildings"; Mars Room → June 1789 → storage → Revolution → Louis-Philippe; "Here's the Deficit!"; "eleven months"; "Queen Marie-Antoinette commissioned" (viewing notes ↔ provenance çelişkisi, D3); External Link → Versailles UUID |
| S9 histoire-image (Cornette) | **canlı 200** | Wertmüller öncülü; David → "Sainte Famille de Raphaël"; iki yıl; "Son regard est tranquille"; "Peut-être" Lambert/Phocion; başlık 275,2×216,5 ↔ editör (2015) "2,75 m sur 2,15 m"; d'Angiviller alıntısı; Mayıs 1783 Akademi; 1789 sonrası biyografi |
| S7 Met 656654 | **Wayback 200** (20250720043430; canlı HTML **429**) | "Returned to lender"; "Not on view"; "275 × 216.5 cm" + çerçeve "372 × 269.5 × 24 cm"; Credit Line "…Versailles et de Trianon (MV 4520)"; "by order of Louis XVI, the office of royal households"; "the first woman to attain the rank of painter to the king"; "Signed and dated (lower left)"; 2015–16 üç sergi durağı |
| S7b Met Open Access API | **404** `{"message":"Not a valid object"}` (yeniden denendi) | canlı doğrulama başarısız → arşiv beyanı zorunlu (C050/C066) |
| S8 NGC Magazine | canlı **403**; Wayback snapshot **20260209120740** availability API ile teyit | Stauble metni (brief cache'inden birebir): sable-lined red velvet; David tavsiyesi; Nattier kırmızısı; Cornelia; Hall of Mirrors; "Bâtiments du Roi"; Lang alıntıları; "largest ever created" |
| S10 eski müze sitesi | canlı timeout; Wayback snapshot **20160303231430** teyit | "salon de la Paix" (D5 sapması); Sophie 9 Temmuz 1786 – 19 Haziran 1787; "sans doute"; "fut contrainte de présenter"; "275x215 cm"; "Localisation : Antichambre du Grand Couvert" |
| S1/S12 Wikidata | EntityData 200; wbgetentities **200** (yeniden çekildi) | P2048/P2049 = 271/210; P571 precision 9; P217 refsiz; P180 **deprecated Q430775 = Louis Joseph, Prince of Condé (1736–1818)** → yanlış figür; Q3329787 "museum in the Palace of Versailles"; Q2853149 "Antichambre du Grand Couvert"; Q473506 (1781–1789) |
| S2/S3 wiki | 429→backoff→200 (brief); wikitext bu oturumda yeniden okundu | enwiki 275×216.5, Salon, Mars Room, tapestry 1814/1822/1897 + GMTT-347-000; itwiki 275×210, d'Angiviller, Temmuz 1786, tubercolosi, cornice vuota, «Guardate il Deficit!», damla küpe, taç, 4 Haziran 1789, Rusya/Avusturya tapestry |
| S6/S13 Versailles | 200 **SPA kabuğu**; `cc.js` uçları görüldü | nesne verisi çözülemedi → birincil künye POP+GAP+arşiv ile doğrulandı (C032) |
| S11 Commons | 200 metadata | 23427×30000 px, 253.409.946 bayt, PD-Art/PD-old-100-expired, Tile set, dimensions 271×195, atıfsız açıklama (Giulio Romano, velours puce/marte, crêpe noir, 9 juillet 1786), **"Remastered color" SMALLFXD varyantı** |
| S14 data/ | salt-okunur | basyapitlar[68], eser_ayrintilari[71], yuruyus, eser_notlari, muze_numaralari (31c5fe2dce1fcddf → met:656654), eserler_onbellek (l:"" boş), eser_adlari_tr, eser_konulari, eser_zorluk |

**Erişilemeyenler (E):** Met canlı HTML/API, NGC canlı, P973 canlı, Versailles SPA nesne verisi, **kitap metinleri** (Fraser 2002 s.282/284/305; Vigée Le Brun *Souvenirs* İt. çev. 2004 s.16; Constans/Soulié; Mobilier national GMTT-347-000). Künyeler yalnızca erişilen kayıtların bibliyografyasında göründüğü biçimde aktarıldı; **DOI/ISBN/sayfa/alıntı uydurulmadı** (C064).

**Semantik sınır:** Bu geri dönüş kaynakların *ne dediğini* doğrular; iddiaların *gerçek dünyada doğru olduğunu* garanti etmez. Birincil kayıtlar da yanılabilir (S10 "salon de la Paix" sapması bunun örneğidir). Haricî model/insan editör denetimi ayrıca gereklidir.

## 3. Şema ve biçim

- `dogrula.py` (mini yorumlayıcı + **jsonschema Draft 2020-12 AKTİF**, `.qwen/tmp/venv-dogrula`): **Q3937621 → 0 hata / 0 uyarı.**
- Genel koşu: hata/uyarıların **tamamı başka eserlerin sürmekte olan dizinlerine ait** (eksik DERS/SORULAR/KANIT dosyaları; öteki uyarılar kelime/tekrar). Bu parti o dizinlere **dokunmadı**; sayılar parti ilerledikçe değişir.
- `DERS.json` / `SORULAR.json` şema uygun; `bolum_eslesme` **12/12**; `durum = "İnsan incelemesi bekliyor"`; `kalite_kontrol.insan_onayi = "Bekliyor …"`.
- **CJK taraması: 0** (DERS.json, SORULAR.json, KANIT_DOSYASI.md, üç ders, KALITE_KONTROL.md).
- Üretim yeniden çalıştırılabilir (idempotent): `gen.build` kelimeyi dosyadan ölçer, post-pass ikinci koşuda 0 ekleme yapar.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef (§8) | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | **444** | 400–500 | 3 dk | ✅ aralıkta |
| Orta | **1476** | 1300–1600 | 10 dk | ✅ aralıkta |
| İleri | **2966** | 2600–3200 | 20 dk | ✅ aralıkta |

Kelime hedefleri tutturuldu; **dolgu yapılmadı** — hacim, birincil kayıtların alan zenginliği (POP notice + GAP provenance/viewing notes + iki kurum yayını + arşiv müze) ve sekiz ihtilafın kaynak eleştirisiyle geldi. Yakın tekrar / seviyeler arası birebir cümle tekrar katmanları temiz.

## 5. Görsel doğrulama sınırı (§6)

- **Görsel İNCELENMEDİ.** `gorsel.dogrulama.incelenen_bolgeler = []`; yalnız metadata/lisans/çözünürlük çekildi (vision kotası ana oturumda).
- Kompozisyon, renk, kürk, örtü, jest ve taç betimleri **"kaynakların betimlediği"** çerçevesinde verilir; piksel düzeyinde teyit yoktur (C065).
- **GZ 5/5 TASLAK** (`gen.gz_taslak` otomatik işaretledi); ipuçları kaynak betimine dayanır.
- Lisans: **Public domain** (PD-Art / PD-old-100-expired; sanatçı ö. 1842; WD P6216 Q19652). Görsel projeye kopyalanmadı, URL + lisans + kaynak olarak referans verildi.
- **Kullanım sınırı:** POP/RMN fotoğraf kredileri "utilisation soumise à autorisation" (C031); S10/S9 görselleri RMN/Gérard Blot kredili; Met ödünç görüntüsü PD/Open Access etiketli ama görüntüleyicide büyütme/indirme kapalı. Eserin PD olması her fotoğrafın serbest yeniden yayımı anlamına gelmez.
- **Versiyon farkı:** Commons'ta ana GAP gigapixel yanında "…SMALLFXD.jpg — Remastered color" varyantı var. Renk/kürk (C051) ve örtü (C060) tartışması versiyona duyarlıdır; insan editör hangi versiyonu inceleyeceğini kaydetmelidir.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C065, E) — ZORUNLU.** Hiçbir bölge incelenmedi; GZ TASLAK. Kürk türü (samur/sansar), kumaş rengi (kırmızı/puce), beşik örtüsü (yeşil/siyah krep), veliahtın jesti (gösterme/sarma/örtü kaldırma), taç ayrıntısı ve bakış piksel düzeyinde doğrulanmalı.
2. **Boyut (C044, D1).** Birincil envanter 275×215 (POP + arşiv müze) ↔ Met/NGC 275×216.5 ↔ GAP 195×271 ↔ WD/Commons 271×195/210 ↔ itwiki 275×210 ↔ histoire-image başlık 275,2×216,5 (editör 2,75×2,15 der). Konservasyon ölçüm raporu gerekli; `kunye.boyut_cm` şimdilik **275×215** (birincil) yazıldı.
3. **Siparişveren (C046, D3).** POP "Louis XVI" / Met "office of royal households" / NGC-GAP "Bâtiments du Roi (d'Angiviller)" ↔ GAP viewing notes + itwiki "kraliçe". Sipariş belgesine erişilmedi; quiz'de doğru cevap yapılmadı.
4. **Salon 1787 (C045, D2).** Açılışta yokluk ortak; "sonradan sergilendi" birincil kaynaklarda var, itwiki'de yok. data/ "sergilenmiştir" ifadesi nüansla destekli; Salon broşürleri birincil değil.
5. **Model (C047, D4) ve mekân (C048, D5).** Raffaello ↔ Giulio Romano (*Madonna della Gatta*, atıfsız Commons); Aynalı Salon ↔ Salon de la Paix (tekil birincil arşiv sapması). Görsel + *Souvenirs* metni gerekli.
6. **Anekdot (C049, D6).** Cornelia (NGC/enwiki) ↔ Lambert / Phocion annesi (S9, "Peut-être"). Hangi antik örneğin kastedildiği belirsiz.
7. **Met kimliği / veri riski (C050, D7; C025).** `data/muze_numaralari.json` "met":"656654" eşlemesi **ödünç/sergi** kaydıdır, Met mülkiyeti değil; canlı API 404, canlı HTML 429. Eşlemenin "Met koleksiyonu" gibi sunulmaması için insan kararı gerekir (data DEĞİŞTİRİLMEDİ).
8. **Rousseau atfı (C055, E4).** data/ basyapitlar + hotspot "Rousseau'nun doğal annelik ideali" der; erişilen hiçbir kaynakta Rousseau adı yok. Derslerde atıf **kurulmadı**, yalnızca GAP'in "childhood interest" bağlamı kullanıldı; data düzeltmesi insan onayına sunulur.
9. **Takı (C054, E3) ve örtü (C060, E9).** "Hiç takı yok" ve "koyu yeşil örtü" kesinleştirmeleri kaynaklarla gerilimli (damla küpe; crêpe noir). Görsel teyit + data notu.
10. **Sophie'nin ölüm nedeni (C052, E1) ve çıkarılma anlatısı (C053, E2).** "tubercolosi" yalnız itwiki; "çıkarıldı" ↔ "boş bırakıldı" farkı görsel/arsiv kanıtı ister.
11. **Unvan (C057, E6) ve küratör yargıları (C061, E10).** Met "painter to the king" ↔ "peintre de la reine"; Lang'ın "tek devlet portresi / politik başarısız" sözleri olgu değil değerlendirme olarak işaretlendi.
12. **Kitap literatürü (C064, E13).** Fraser, *Souvenirs*, Constans, Soulié, Mobilier national kaydına metne erişilmedi; sayfa/ISBN künyeleri doğrulanmadı. Haricî editör bu kaynaklara erişip C029/C030/C036/C038/C040'ı yükseltebilir veya düşürebilir.
13. **Karşılaştırma künyeleri (C067, C).** Kauffman *Cornelia* ve David *Horatii* müfredat kaydından alındı, haricî doğrulama yok; `karsilastirma_onerileri` insan onayına sunulur.
14. **Felsefi yorumlar (İleri §7).** Benjamin'in kült/sergi değeri çifti ve "erdem retoriği" okuması açıkça yorumdur; sanatçıya etki atfı yapılmadı (§7). Rousseau/*Émile* bağlantısı kanıtsız kurulmadı.
15. **WD gürültüsü (C058/C059, E7–E8).** deprecated Q430775 (yanlış figür) ve refsiz P217; data'ya yansımamış, yine de editör bilgisine sunulur.

## 7. Yayına adaylık

**Durum: "İnsan incelemesi bekliyor" — "Yayına aday" DEĞİL.**

§12 koşullarının durumu: temel kimlik ve atıf birincil kaynakla doğrulandı ✅ · tüm olgusal cümleler kanıt kayıtlı ✅ · yorumlar olgulardan ayrıldı ✅ · quiz cevapları A/B iddialara dayanıyor ✅ · kaynak bağlantıları erişim durumlarıyla (canlı/arşiv/HTTP) kayıtlı ✅ · ciddi çelişkiler (8 D) açıkça belirtildi ✅ · Denetim A + B tamamlandı ✅ · **görsel analiz doğru eser/görselle YAPILMADI ❌ (C065, GZ TASLAK)**.

Bu nedenle yayına adaylık **beklemede**: görsel inceleme (ana oturum vision kotası) + haricî model/insan editör denetimi zorunludur. Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; bağımsız insan onayı ayrıdır.

**Yayın öncesi asgari liste:** (1) GAP gigapixel veya PD bir görüntüde §6'daki 1–2–9–10 maddelerinin piksel teyidi ve GZ ipuçlarının TASLAK'tan çıkarılması; (2) boyut için konservasyon/sergi ölçüm raporu; (3) sipariş belgesi (Bâtiments du Roi / Maison du Roi) veya kabul edilmiş uzlaşma metni; (4) Fraser/*Souvenirs* metnine erişim; (5) data/ düzeltme önerilerinin (Met eşlemesi, Rousseau, örtü, takı, lisans alanı) insan onayı.
