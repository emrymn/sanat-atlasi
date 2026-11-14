# KALİTE KONTROL — Q956541 · General Wolfe'un Ölümü (The Death of General Wolfe) · Benjamin West

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ (arşiv birinciller yeniden açıldı) · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** `.qwen/tmp/parti4/Q956541-brief.md` (kaynak-arastirma agent) + bu oturumda yapılan bağımsız geri dönüş.
**Üretim:** `.qwen/tmp/parti4/uret-Q956541.py` → `DERS.json` + `SORULAR.json` (gen.build; `cs_gerekce_iyileştir` + `gz_taslak` otomatik).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

- **Toplam iddia:** 89 (C001–C089). **A=20 · B=33 · C=11 · D=15 · E=10.** KANIT §2 "Sayım" satırı ile DERS.json birebir aynı.
- Üç dersin bütün olgusal cümleleri `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **temiz** (bilinmeyen etiket yok, KANIT'ta tanımlı olup JSON'da olmayan iddia yok).
- **A düzeyi (birincil):** NGC katalog (S6 Wayback 2026-07-03) + NGC eski kayıt (S8, 2017-04-30) → başlık/1770/oil on canvas/152.6 × 214.5/env. 8007/credit line/çerçeve/NGC yorumu/eskiz. National Trust 851783 (S17) ve Royal Collection 407297 (S23) → "1770 prime version", Ickworth 1779 imza-tarih, 1956 in lieu of tax, RC 1771/300 guineas, Warm Room/Hampton Court/Spencer House, West'in kariyer verileri.
- **B düzeyi:** NGC Bulletin 7 / Stacey 1966 (S10–S12, müze kurum yayını), ROM (S19), U-M News (S21), Britannica (S26), EN/IT Vikipedi (S3/S4), WGA (S15). Kaynak zinciri notu: wiki satır içi ref'leri Fryd 1995 / Montagna 1981 / Madill 2018 / Zygmont (Smarthistory) / tfaoi / Smith 2000 / Piper 2000 → **metinlerine erişilmedi** (C080, E).
- **C (yorum) ayrı:** seküler şehitlik (C083), Benjamin "aura" ödünç (C084), Kant sublime ödünç (C085), değer ölçütü karşıtlığı (C086), noble savage politikası (C087), provenance anlam boyutu (C089), Gillray (C028), Schama (C036), WD refsiz alanlar (C045/C046), PD değerlendirmesi (C047). Hepsi ders metninde "(yorum)" ile işaretli; **sanatçının bu düşünürlerden etkilendiği iddia edilmedi** (§7).
- **D/E işareti:** 15 D "(tartışma)", 10 E "(belirsiz)"; üretim betiğindeki post-pass cümle düzeyinde denetler (build'den önce çalışır, kelime sayıları işaretleri içerir). dogrula.py D/E belirsizlik uyarısı: **0**.
- **Belirsizlik korundu:** "c. 1775–1800", "Possibly commissioned … 1802", "possibly Mohawk", "not more than four or possibly five", "probably", "I suspect", "Let us hope … not Robert … but John", "This is possible", "less convincingly", "seems impossible to say", "[in realtà nel 1759]", `{{citation needed}}`, `{{Failed verification}}`, `{{Incomplete short citation}}`.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B** kanıtlı (otomatik denetim: A/B dışı kanıt 0). 5 AU serbest (C/D/E dahil). Çeldirici gerekçeleri bağlamsal (totoloji uyarısı 0); doğru cevapların hiçbiri ihtilaflı figür kimliğine, versiyon sayısına, boyut varyantına veya "en ünlü" üstünlük iddiasına dayanmaz.
- **GZ TASLAK:** görsel incelenmedi → `gen.gz_taslak` beş sorunun ipucunu "TASLAK (görsel bu oturumda incelenemedi; betim kaynak metni)" ile işaretledi.
- **12 bölüm:** `bolum_eslesme` 1–12 tam; §7 (felsefi/estetik) yalnız İleri'de, §11 SORULAR.json'a bağlı. Kanıt yetersiz alanlar (görsel gözlem, British Museum giysi örnekleri, catalogue raisonné no) boş bırakıldı/ kısaltıldı (§8).

## 2. Denetim B — Kaynağa bağımsız geri dönüş (bu oturum)

İlk metinden bağımsız olarak **yeniden indirilen/açılan** kaynaklar:

| Kaynak | Sonuç | Teyit edilen dizgeler |
|---|---|---|
| S6 NGC katalog (Wayback 2026-07-03) | HTTP 200 | "152.6 x 214.5", "8007", "oil on canvas", "Gift of the 2nd Duke of Westminster", "carved and gilded pine", "emulate" |
| S17 National Trust 851783 (Wayback 2026-09-13) | HTTP 200 | "1779 (signed and dated)", "1525 x 2160", "prime version", "Northeast Peoples", "in lieu of tax", "Robert Adair", "William Howe" |
| S23 Royal Collection 407297 (Wayback 2025-01-20) | HTTP 200 | "300 guineas", "Spencer House", "153.5 x 245.9", "Warm Room", "1792", "Surveyor" |
| S3 EN wikitext (canlı API) | HTTP 200 | infobox 151 × 213; "fifteen minutes"; "only four of the fourteen men"; "red waistcoat"; Hinde; Johnson; "Later versions also show General Montcalm"; `{{citation needed}}`, `{{Failed verification}}`, `{{Incomplete short citation}}`; Houle/Kanata; Walton Ford |
| S4 IT wikitext (canlı API) | HTTP 200 | "appena mezzora"; "cinque copie" ↔ "totale di cinque tele"; West alıntısı + "[in realtà nel 1759]"; "rivoluzione nell'arte"; Smith/Marat; Piper 2000 ref |
| S13 Commons imageinfo (canlı API) | HTTP 200 | WGA25558 957 × 660 / 112.827 bayt / Public domain; Benjamin West 005.jpg 3456 × 2304 / 4.405.151 bayt / Public domain (Yorck Project) |
| S11/S12 Stacey s.2–3 (Wayback 2018-08-09) | HTTP 200 + başlık | URL'ler brief'te kısaltılmıştı; tam biçimleri doğrulandı |
| S28 Internet Archive (Montagna 1981 sayısı) | HTTP 200 | `access-restricted-item: true` → **metne erişilmedi** (yeni erişim kaydı) |
| S10 Stacey s.1, S8 NGC mkey, S15 WGA, S19 ROM, S21 U-M, S26 Britannica, S14 Commons dosya sayfası | cache'den yeniden okundu | brief pasajları birebir teyit (provenance, "long been exploded", 13 figür/Henry Browne, çerçeve anlatısı, eskiz 43 × 61.4, "five original versions", Waldeck 1776/1928, "Three full-scale copies", Artwork şablonu) |

**Yeni bulunan ihtilaf (Denetim B katkısı):** doğum yeri adı — NT "Swarthmore, Pennsylvania" ↔ WGA "b. 1738, Springfield" → **C072 (D)**; kesinleştirilmedi. Ayrıca IT wiki'nin kendi iç tutarsızlığı ("cinque copie" ↔ "totale di cinque tele") C064'e eklendi; kronoloji sayımları (11/12/~18 yıl) **C073 (D)** olarak ayrı kayda alındı.

**Erişilemeyenler (E):** gallery.ca canlı (403 Cloudflare), rct.uk canlı (403), rom.on.ca (404), news.umich.edu (403), britannica.com (403), jstor.org/stable/3109196 (bot kabuğu), nationaltrustcollections.org.uk canlı (200 ama SPA "Page Not Found"). Kitap/makaleler: Fryd 1995, Montagna 1981, Madill 2018, Von Erffa & Staley 1986, Laskin & Pantazzi 1987, Solkin 2015, Hubbard 1957, Galt 1820, Mitchell 1944, Webster 1930, Sligo 1922, Jones 1920, Smith 2000, Piper 2000, Marsand 1823 → yalnız erişilen kayıtların bibliyografyalarında anıldı; **DOI/ISBN/sayfa uydurulmadı**; NGC orijinalinin catalogue raisonné numarası hiçbir erişilen kayıtta görülmediği için **üretilmedi**.

**Cache dürüstlük notu:** parti dizinindeki `enwiki-wikitext.json`, `itwiki-wikitext.json`, `commons-imageinfo.json` başka bir eserin (Grande Odalisque) araştırmasıyla üzerine yazılmıştı; bu yüzden S3/S4/S13 bu oturumda canlı olarak yeniden çekildi (`Q956541-enwiki-wikitext.json`, `Q956541-itwiki-wikitext.json`, `Q956541-commons-imageinfo.json`). Yanlışlıkla üretilen iki geçici dosya silindi.

## 3. Şema ve biçim

- `dogrula.py` (mini yorumlayıcı + **jsonschema Draft 2020-12 AKTİF**): **Q956541 → 0 hata, 0 uyarı.**
- Kelime tutarlılığı (JSON ↔ dosya), 12 bölüm, durum enum'u, mükerrer kimlik, quiz kanıt seviyeleri, D/E belirsizlik işareti, totoloji, yakın tekrar, seviyeler arası tekrar, sayım tutarlılığı: **hepsi temiz**.
- **CJK taraması:** 7 dosyanın tamamında **0** (DERS.json, SORULAR.json, KANIT_DOSYASI.md, KALITE_KONTROL.md, üç ders).
- Genel koşudaki hata/uyarılar **öteki eserlere** aittir (bu turda gözlenen eksik-dosya hataları: Q1978815, Q212616, Q219344, Q29530, Q3937621, Q4388208; parti içinde eşzamanlı üretim sürdüğü için genel sayılar değişir). Bu eser dizinlerine, `data/`'ya, uygulama koduna, main'e ve Vermeer pilotuna (Q167605) **dokunulmadı**; commit/push/deploy yapılmadı.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef (§8) | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 442 | 400–500 | 3 dk | aralık içinde |
| Orta | 1374 | 1300–1600 | 10 dk | aralık içinde |
| İleri | 3074 | 2600–3200 | 20 dk | aralık içinde |

Dolgu/tekrar yok: İleri ders gerçekten daha derin sorular sorar (arşivden birincil okuma yöntemi, provenance rejimleri, "ilk" anlatısının soykütüğü, figür figür kanıt merdiveni, model atıflarının yön belirsizliği, temsil politikası, ihtilaf envanteri). Kanıt yetersiz alanlar (görsel gözlem, British Museum, catalogue raisonné) kısa bırakıldı.

## 5. Görsel doğrulama (Kural 6)

- **Görsel İNCELENMEDİ** (vision kotası ana oturumda). `gorsel.dogrulama.incelenen_bolgeler = []`.
- Kullanılan: Commons imageinfo (S13) + WGA dosya sayfası Artwork şablonu (S14) + WGA wolfe.html (S15) → çözünürlük, bayt, lisans, credit, NGC Ottawa + 152.6 × 214.5 teyidi.
- Lisans: her iki dosya **Public domain** (PD-Art / PD-old-auto-expired, deathyear=1820; Yorck Project DVD-ROM credit). Görsel projeye kopyalanmadı; derslerde URL + lisans + kaynak olarak referans verilir.
- Kompozisyon/renk/ışık ifadeleri **"kaynakların betimlediği"** kalıbıyla verildi; **GZ soruları TASLAK**.
- **Versiyon riski:** WGA25558 NGC orijinaline bağlı; Yorck dosyasının (Benjamin West 005.jpg) hangi sürümü gösterdiği metadata'da yok. NT'nin gökyüzü/üniforma betimi Ickworth sürümüne ait → betimler arası karıştırma yapılmadı (C074, C076).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C074, E):** incelenmedi; GZ TASLAK. Ana oturumda vision ile kompozisyon, bayrak apeksi, figür grupları, renk/ışık ve **yelek rengi** doğrulanmalı.
2. **D08 / C067 — "sarı yelek":** `data/eser_ayrintilari.json` + `data/basyapitlar.json` "sarı yeleğine" ↔ EN wiki "red waistcoat" ↔ Stacey "red coat, waistcoat and breeches". **data DEĞİŞTİRİLMEDİ**; düzeltme önerisi onaya sunulur.
3. **C076 — data'nın öteki betimleri:** "dövmeli", "tüylü başlık", "en güçlü ışık", "yeşil giyimli asker haberciyi gösteriyor", "sağda fırtına bulutları / solda aydınlık açıklık" erişilen kaynaklarda yok; NT gökyüzü betimi Ickworth'e ait. Görsel inceleme + versiyon ayrımı gerekli.
4. **Figür kimlikleri (C023/C024/C026, D):** cerrah Hinde ↔ Adair (Robert/John), yeşil figür Johnson ↔ Howe ↔ Ranger, Smythe geleneksel anahtar ↔ Stacey kuşkusu. Ders tek isim dayatmaz; quiz bu alanlardan soru üretmez. Editör, müze anahtarlarının geleneksel olduğunu etikette belirtmeli.
5. **Versiyon sayısı ve kurum (C064/C065/C071, D):** Stacey 4 ↔ Britannica 3 kopya ↔ ROM/UMich/wiki 5; WD Q28031178 AGO/ROM çelişkisi ve P571=1776 olası karışması. WD düzeltmesi ayrı bir iş kalemidir (bu ders data'yı değiştirmez).
6. **"İlk" iddiası (C014):** `data/eser_notlari.json` "devrimcidir" ifadesi "ilk" ima ederse düzeltilmeli; Stacey "long been exploded", Romney/Penny önceledi. Ders metni "ilk" demez.
7. **C078 — Copley/Trumbull:** data'nın "bu yolu izledi" iddiası erişilen kaynaklarda doğrulanmadı; ders metnine alınmadı. Kaynak aranması veya ifade yumuşatması önerilir.
8. **Erişilemeyen literatür (C080, E):** Fryd 1995, Montagna 1981 (Archive kısıtlı), Madill 2018, Von Erffa & Staley 1986, Laskin & Pantazzi 1987, Hubbard 1957, Galt 1820, Mitchell 1944 vb. metinleri temin edilirse iddia seviyeleri yükseltilebilir; NGC orijinalinin catalogue raisonné numarası ancak o zaman yazılabilir.
9. **Canlı birincil teyit (C075, E):** gallery.ca/rct.uk/ROM/Britannica canlı sayfaları bot engelli; arşiv tarihleri beyan edildi. İnsan editör canlı sayfaları açıp arşivle karşılaştırmalı (özellikle RC'nin güncel konumu: Spencer House loan).
10. **Yorum bölümleri (İleri §7):** Kant/Benjamin/Smith ödünç okumaları kurum dışı yorumdur; editör onayı ve "(yorum)" etiketinin korunması gerekir.
11. **Lisans alanı (C047):** `data/eserler_onbellek.json`'da Yorck dosyasının lisans alanı boş; Commons'ta PD → doldurma önerisi onaya.
12. **WD kalitesi (C077, E):** "painting by William Woollett" description hatası ve blog referansları; WD düzeltmesi ayrı iş kalemi.

## 7. Yayına adaylık

**Durum: "İnsan incelemesi bekliyor" — "Yayına aday" DEĞİL.** §12 koşullarından temel kimlik/atıf, kanıt kaydı, yorum-olgu ayrımı, quiz kanıtı, erişim durumları ve çelişkilerin beyanı sağlandı; ancak **görsel analiz doğru eser/görselle yapılmadı** (C074) ve **haricî model/insan editör denetimi** tamamlanmadı. Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğun garantisi değildir. Bu tur aynı asistan + agent araştırmasıyla yapıldı; Denetim B'de birincil arşiv kayıtları yeniden açıldı, fakat bu bağımsız insan onayı yerine geçmez.

**Teslim dosyaları:** `KANIT_DOSYASI.md`, `DERS_BASLANGIC.md`, `DERS_ORTA.md`, `DERS_ILERI.md`, `DERS.json`, `SORULAR.json`, `KALITE_KONTROL.md` (bu dosya). Üretim betiği: `.qwen/tmp/parti4/uret-Q956541.py` (teslimata girmez).
