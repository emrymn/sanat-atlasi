# GENEL KALİTE RAPORU — 107 Başyapıt Üretim Kapanışı ve Bağımsız Denetim Hazırlığı

**Tarih:** 15 Kasım 2026 · **Branch:** `content-review` · **Standart:** `AKADEMIK_STANDART.md`
**Kapsam:** `data/basyapitlar.json` içindeki 107 başyapıtın tamamı (pilot Q167605 + Parti 1–7).
**Amaç:** Üretimi tek seferde doğrulamak ve haricî hakem (Claude Opus) derin denetimine hazırlamak. Yeni içerik üretilmedi.
**Sonuç:** **107/107 tamam · dogrula 0 hata / 111 uyarı · `--test` 25/25 · CJK 0 · quiz A/B ihlali 0.**
**Durum:** Tümü **"İnsan incelemesi bekliyor"** — hiçbir eser "Yayına aday" değil.

> **Dürüstlük beyanı:** Bu rapordaki yapısal/otomatik kontroller (şema, kimlik, çapraz tutarlılık, kelime, quiz A/B, CJK) **olgusal/semantik doğruluğu KANITLAMAZ**. Bir kaynak URL'sinin açılması, o kaynağın iddiayı gerçekten desteklediğini göstermez. Her A/B iddiasının kaynak-desteği ve her quiz cevabının olgusal doğruluğu için **insan/haricî model (Claude Opus) denetimi** gerekir (§14). Bu rapor o denetimin hedeflerini belirler.

---

## 1. Yönetici özeti

| Gösterge | Değer |
|---|---|
| Kanonik eser (MUFREDAT / data) | 107 |
| Üretilen eser dizini | **107** (eksik 0, fazla 0, mükerrer 0) |
| Eser başına dosya | 7/7 tam (3 ders + DERS.json + SORULAR.json + KANIT_DOSYASI.md + KALITE_KONTROL.md) — **eksik dosya 0** |
| Toplam iddia | **5428** (A=1897, B=1694, C=398, D=681, E=758) |
| dogrula.py | **0 hata / 111 uyarı** (jsonschema Draft2020-12 AKTİF) |
| dogrula.py --test | **25/25** |
| CJK karakter (107 eser, 7 dosya) | **0** |
| Quiz A/B kanıt ihlali | **0** · totolojik çeldirici **0** · mükerrer seçenek **0** |
| Görseli incelenmeyen eser | **98** (vision bütçesi tükendi) → GZ **%100 TASLAK** |
| Bu denetimde düzeltilen | 3 CJK kalıntısı + 2 A-wiki etiketi (C017, C056) |
| Opus derin denetimi için seçilen | **15 eser** (§10) |

## 2. Kapsam ve yöntem

12 adımlık kapanış denetimi uygulandı. Araçlar (`.qwen/tmp/kapanis/`, salt-okunur):
- `scan.py` — envanter, dosya varlığı, iddia/kaynak sınıflama, Wikipedia-tek A/B, erişim durumu, kelime, quiz A/B, görsel inceleme, CJK, tekrar, risk.
- `verify_work.py` — eser bazlı bağımsız doğrulama (7 dosya, kelime, CJK, quiz, telif notu, 12 bölüm).
- `quiz_scan.py` — quiz semantik aday taraması (yorum-olgu, ihtilaflı cevap, mükerrer seçenek).
- `risk.py` — risk skoru + Opus-15 kürasyonu.
- `basyapit-dersleri/dogrula.py` — yapısal doğrulayıcı (mevcut, değiştirilmedi).

**Bağımsızlık:** Parti 7'de 5 araştırma + 5 yazım agent'ının çıktıları ana oturumda **ham kaynaklarla bağımsız doğrulandı** (agent öz-raporuna güvenilmedi). Önceki parti bulguları DURUM.md günlüklerinden ve KANIT dosyalarından teyit edildi. Eşzamanlı üretimde dogrula genel sayısının yanıltıcılığı bilindiğinden her eser **kendi satırlarıyla** değerlendirildi.

## 3. Adım 1–2 — Envanter ve dosya varlığı

- MUFREDAT/data 107 anahtar ↔ `eserler/` 107 dizin: **birebir eşleşme**. Eksik **0**, fazla **0**, mükerrer eser_id **0**, kanonik mükerrer **0**.
- Bileşik anahtarlar (QID'siz) doğru dizinlere çözümlendi: `bosch, domenico-di-michelino, duccio, hogarth, kauffman, hoch, dali, bacon` (DERS.json `eser_id` tam bileşik anahtar).
- Her eserde 7 dosya mevcut; **eksik dosya 0**, JSON parse hatası **0**.
- Parti 7 ile #103–107 (Picasso/Höch/Dalí/Magritte/Bacon) tamamlandı; "Araştırılmadı" **0**.

## 4. Adım 3 — dogrula.py (107 eser)

**SONUÇ: 0 hata, 111 uyarı.** `--test` 25/25 (jsonschema AKTİF). Uyarı dağılımı:

| Tür | Adet | Değerlendirme |
|---|---|---|
| Etiketsiz olgusal cümle adayı (heuristic) | 63 | **Yanlış-pozitif:** cümle bölücü baş harf kısaltmalarını (Hon./ss./F./XV./no./pp./A. Liebmann vb.) cümle sonu sanıyor; tam cümleler [C###] etiketli. Bilinen sınır. |
| Kelime hedef aralık dışı (§8) | 43 | **Bilinçli kısa ders** (kanıt yetersizse dolgu yok, §8). Çoğu İleri 2600'ün hafif altında; birkaçı belirgin kısa (Giulio Romano 363/769/1247, Mantegna, Correggio) — kanıt sınırı. |
| Seviyeler arası ortak uzun cümle (≥5) | 5 | Kısmi tekrar; müfredat-içi bağ / kimlik cümleleri (§5). |
| D/E belirsizlik işareti eksik | **0** | Tüm D/E cümlelerde işaret var. |
| Yakın-tekrar paragraf / Sayım tutarsızlığı / totoloji | **0** | Temiz. |

Hiçbir uyarı HATA değildir; 63 heuristic yanlış-pozitif ve 43 §8 kısa ders bilinçli/belgeli. **Otomatik testlerin geçmesi akademik doğruluk kanıtı olarak sunulmaz** (§14).

## 5. Adım 4 — Tekrar / dolgu / seviyeler arası kopya

- **Ciddi dolgu/tekrar YOK.** dogrula yakın-tekrar (difflib>0.6) ardışık paragraf taraması 0.
- Seviyeler arası birebir paragraf: kimlik başlığı (`**Eser:** …`) 20 eserde ortak — **zararsız** (her seviyenin kimlik bloğu). Bunun dışında yalnız **3 eserde** (Q186953 Raphael, Q19966572 Giulio, Q500242 Michelangelo) Orta↔İleri arasında 1 kısa "Müfredat içi bağ … görsel karşılaştırma yapılmadı (belirsiz)" notu ortak — **küçük çapraz-referans, dolgu değil**.
- 5 eserde ≥5 ortak uzun cümle (dogrula UYARI) — kimlik/müfredat-bağ cümleleri; seviye derinliği korunmuş.
- Kelime hedefleri için bilgi uydurulmadı; kısa dersler §8 gereği bilinçli.

## 6. Adım 5 — Kaynak doğrulama

- **Birincil müze katalogları:** 107 eserin büyük çoğunluğunda birincil kayıt erişildi (canlı veya Wayback arşiv). Parti 7'de 5/5 birincil AÇILDI (Reina Sofía, SMB, MoMA Wayback, LACMA, Tate).
- **Erişim durumu sınıflaması (scan.py):** "canlı 403/404/429 → Wayback 200", "429→backoff 200", "wikitext cache (HTTP kodu kaydedilmedi ama içerik okundu)" gibi durumlar **erişildi** sayıldı; yalnız "ERİŞİLEMEDİ / SSL / JS kabuğu gövde yok / metne erişilmedi" **erişilemedi**. Bu kalibrasyonla **erişilemeyen-tek A/B iddia = 0** (ilk taramadaki 16 adayın tamamı Wayback/backoff/cache yanlış-pozitifiydi).
- **İçeriksiz kaynak (HTTP 200 ama JS kabuğu/boş gövde): 21 eser** (ör. KHM Q500985, Kunsthalle Q311243 canlı, World Monuments Fund Q3998957, RKD, Academia.edu). Bu kaynaklar açıldı ama içerik çıkarılamadı; ilgili iddialar başka birincil/ikincil kaynaklarla desteklendi veya E/belirsiz işaretlendi. **Bir bağlantının açılması tek başına iddiayı doğrulamaz** — bu 21 eserin içeriksiz kaynaklarına dayalı iddiaları Opus öncelikli kontrol etmeli.
- **URL → doğru eser eşleşmesi:** Kritik kimlik bulguları (§13) derslerde beyan edildi (David Toledo replikası, Hokusai Red Fuji, Guernica P18 reproduksiyon vb.). Ancak **her birincil URL'nin gerçekten doğru esere ait olduğunun tam doğrulaması** (envanter/başlık/sanatçı birebir) 107 eser için otomatik yapılamaz; Opus örneklem + tam kontrol yapmalı.
- **Uydurma bibliyografya yok:** erişilemeyen kitap/makaleler "kaynakçada anıldı, metne erişilmedi" (B atıf zinciri notu); doğrulanmamış DOI/ISBN/sayfa/alıntı üretilmedi.

## 7. Adım 6 — Wikipedia'ya tek başına dayanan A/B iddialar

- **A-yalnız-Wiki: 2 adet bulundu → DÜZELTİLDİ** (§11): Q2990634 C017 (WD metadata; birincil teyit kaynakları S4/S5/S8 kaynak_id'ye eklendi, A korundu) ve Q764831 C056 (WD yapısal gözlem; standart gereği WD yardımcı → **B'ye düşürüldü**). Düzeltme sonrası **A-yalnız-Wiki = 0**.
- **Wiki-tek B iddia: 1078** (100 eser). Standart §4 B, "Wikipedia'nın **kaynaklı** maddesi"ni kabul eder (satır içi akademik atıf zinciri notuyla). Üretim brief'leri atıfsız wiki cümlelerini E/C'ye çekti. **Ancak** her wiki-tek B iddianın atıf zincirinin gerçekten var olduğu ve kaynağın iddiayı desteklediği **otomatik doğrulanamaz** → Opus için öncelikli semantik kontrol alanı (§15). Atıfsız veya zinciri kırık wiki-tek B iddialar E'ye düşürülmeli.
- **Kırık atıf zinciri örneği (Parti 7 Dalí):** enwiki "$250/1932" iddiası MoMA'ya atıf verir ama MoMA kaydında bu bilgi YOK → D1/D2 olarak işaretlendi, quiz cevabı yapılmadı. Bu, "atıf vermek ≠ doğrulamak" ilkesinin somut uygulamasıdır.

## 8. Adım 7 — Quiz denetimi

- **Yapısal:** CS/DY/GZ/TK doğru cevapları **yalnız A/B** (ihlal **0**); boş kanıt **0**; totolojik çeldirici **0**; mükerrer seçenek **0**; her yanlış seçeneğin bağlamsal gerekçesi var. AU serbest (C/D/E dahil).
- **Semantik (quiz_scan.py 103 aday → inceleme):** adayların büyük çoğunluğu **zararsız** — flashcard arka yüzleri ve DY açıklamaları belirsizliği doğru koruyor ("S anlamı tartışmalı", "Doğru… kimliği ise tartışmalıdır"); tarih cevapları A-seviyeli birincil değeri kullanırken D iddia ihtilafı belgeliyor. Örnekler doğrulandı: Blake DY03 ("muhtemelen 1821" ifadenin içinde korunmuş, True doğru), Goya CS03 (1814 = Prado A değeri).
- **Tek gerçek doğrulama adayı:** Q311243 Friedrich **C041** (B, Bauer/Haug 2024) — yalnız landing+abstract erişildi, tam metin Anubis engelli; TK04/AU02'de kullanıldı. "~120 yıl provenance boşluğu" ifadesi birincil provenance (C011/C012, A) ile kısmen örtüşür ama spesifik alıntılar abstract'tan. **Opus abstract'ın alıntıları gerçekten içerdiğini teyit etmeli** (bu oturumda Wayback bot engeli nedeniyle yeniden açılamadı). Kesin hata değil; doğrulama adayı.
- Yorumlar kesin olgu gibi sunulmadı; D/E quiz doğru cevabına girmedi.

## 9. Adım 8 — Görsel inceleme eksikleri

- **98 eserde görsel İNCELENEMEDİ** (vision bridge bütçesi Parti 1 #7'den sonra tükendi). `gorsel.dogrulama.incelenen_bolgeler=[]`.
- **GZ TASLAK kapsama %100:** görseli incelenmeyen 98 eserin tamamında GZ soruları "TASLAK (görsel bu oturumda incelenemedi; betim kaynak metni)" önekli. Görsel teyidi olmadan kesin gözlem sorusu **yok**.
- Kompozisyon/biçim betimleri birincil (A) + ikincil (B) **metinlerinden** ("kaynakların betimlediği"); data hotspot betimleri doğrulanmadı (E).
- **Görsel kimlik riskleri (§13):** Guernica P18 = Gernika seramik reproduksiyonu; Hokusai gösterilen baskı Red Fuji (~1930 reproduksiyon); Höch PD-US yalnız ABD; Magritte Commons silme talebi; Dalí/Bacon serbest dosya yok. **İnsan editör görsel teyidi ZORUNLU.**

## 10. Adım 9 — Risk değerlendirmesi ve Opus için 15 eser

**Risk modeli (eser bazlı):** belirsizlik oranı (D+E)/toplam · A-yalnız-wiki · erişilemeyen-tek A/B · birincil erişimi · görsel inceleme · quiz ihlali · CJK · tekrar · kelime · KALITE kritik bulgu sayısı. Tam sıralama `.qwen/tmp/kapanis/risk-output.txt` ve `scan-result.json`'da.

**Kürasyon ilkesi:** en yüksek otomatik skor tek başına yeterli değil (görsel-inceleme +6 tüm eserlerde ortak; D+E oranı yüksek ama kimlik hatası olmayan eserleri öne çıkarabilir). **Kritik bulgular** (kimlik/versiyon hatası, zayıf birincil, telif/adil-kullanım, abstract-tek kanıt) + **dönem/teknik çeşitliliği** birlikte gözetildi.

### Opus derin denetimi için 15 eser

| # | Eser | Dönem / Teknik | Risk skoru* | Seçim gerekçesi (kritik bulgu) |
|---|---|---|---|---|
| 1 | Q311243 Friedrich · Sis Denizi Üzerinde Gezgin | Romantizm / yağlıboya | 57.0 | C041 (B) yalnız abstract erişildi, quizde kullanıldı; 13 D; ~120 yıl provenance boşluğu; canlı Kunsthalle Anubis engelli |
| 2 | Q175036 Picasso · Guernica | Modernizm / yağlıboya (telif) | 51.2 | P18/Commons görseli Gernika seramik REPRODÜKSİYONU; şiddet konusu; D4 ödeme 150.000 frank↔300.000 peseta; adil kullanım |
| 3 | Q2378534 Fra Angelico · Müjde (San Marco) | Erken Rönesans / fresk | 56.6 | Zayıf birincil (resmî föy erişilemedi); boyut WD297↔K3 321; vision yok; in situ |
| 4 | Q3769169 Artemisia · Judith | Barok / yağlıboya | 47.5 | Boyut D (146.5×108↔199×162.5); şiddet konusu; data görseli CC BY-NC-SA; Napoli versiyonu ayrı |
| 5 | bosch · Dünyevi Zevkler Bahçesi | Kuzey Rönesansı / pano | 46.0 | Prado 403 → A yalnız lisans (zayıf birincil); merkez yorum tartışmalı (Gombrich/Fraenger/Belting); vision yok |
| 6 | Q19966572 Giulio Romano · Aşk Sahnesi | Maniyerizm / yağlıboya | 45.1 | Hermitage birincil URL BULUNAMADI; çok kısa ders (363/769/1247); erotik konu; Berlin kayıp versiyon |
| 7 | Q1131176 Boucher · Sarışın Odalık | Rokoko / yağlıboya | 29.0 | Kimlik: ana görsel Münih versiyonu ↔ data "1751 Köln"; Louvre'da Sarışın Odalık YOK; seri |
| 8 | Q28797801 David · Horas Kardeşlerin Yemini | Neoklasizm / yağlıboya | 34.0 | Kimlik: Q28797801 = Toledo 1786 REPLİKASI (Girodet after David); Louvre orijinali Q476458 ayrı |
| 9 | Q227494 Hokusai · Fuji 36 Manzara | Japon baskı / ukiyo-e | 37.4 | Kimlik: gösterilen baskı Red Fuji (~1930 reproduksiyon), Büyük Dalga değil; kurum teyitsiz; kanji romanize |
| 10 | Q471379 Munch · Çığlık | Sembolizm / tempera | 36.7 | Kimlik: resim grubu (4 versiyon), ders 1893 NM (Q18891156); teknik tempera/fettstift↔oil/pastel |
| 11 | Q17277950 Cézanne · Kâğıt Oynayanlar | Post-İzlenimcilik / yağlıboya | 25.9 | Kimlik: seri maddesi, Courtauld versiyonu (Q17277953); WD seri kimliği karışık; "beş figürlü" hatalı |
| 12 | Q18579333 Raimondi · Paris'in Hükmü | Rönesans / gravür | 20.9 | Birincil Stuttgart BULUNAMADI; B=0 (dewiki atıfsız); gösterilen nüsha Met ↔ data Stuttgart; çok nüsha |
| 13 | Q1245354 Manet · Folies-Bergère | İzlenimcilik / yağlıboya | 38.1 | Ayna "bilerek bozuk"↔optik tutarlı tartışması; Bass sağ/sol; WD P18 CC BY 2.0; Courtauld |
| 14 | Q1061035 Magritte · İmgelerin İhaneti | Sürrealizm / yağlıboya (telif) | 34.9 | "1948" yalnız WikiArt slug (doğrulanmadı); ABD PD belirsiz (Duke); Commons silme talebi; adil kullanım |
| 15 | bacon · Üç Çalışma (Çarmıha Geriliş) | Modernizm / yağlıboya triptik (telif) | 25.4 | Envanter N06171 (T05858=1988 Second Version); c.1943-4↔1942-4; şiddet; "iki hafta"↔protracted work; adil kullanım |

\* Temel otomatik risk skoru (kritik-bulgu bonusu hariç; tam refined sıralama risk-output.txt). Çeşitlilik: 13 farklı dönem/teknik; 3 telif/adil-kullanım eseri (Guernica, Magritte, Bacon); kimlik/versiyon hatası olan 6 eser (Boucher, David, Hokusai, Munch, Cézanne, Raimondi); zayıf birincil 4 eser (Fra Angelico, Bosch, Giulio, Raimondi).

**Kapsam dışı bırakılan yüksek-skorlular (çeşitlilik):** Q219344 Turner (61.0), Q212616 Géricault (57.4), Q2620028 Perugino (54.4), Q94802 El Greco (52.4) — yüksek D+E oranı ama kritik kimlik hatası yok ve dönemleri seçilenlerle örtüşüyor; tam risk tablosunda izlenebilir. Höch (45.2) ve Dalí (telif) da yüksek riskli; 15'lik çeşitlilik kotası nedeniyle listede değil, §15 öncelikli alanlarında.

## 11. Adım 10 — Düzeltilenler ve düzeltilmeyenler

**Güvenle düzeltilenler (bu denetimde, dogrula 0 hata korundu):**
1. **3 CJK kalıntısı** (KALITE notlarında yakalanmış karışma örnekleri): Q2378534 ("方法的"), Q2620028 ("格子"), Q285392 ("潘ofsky") → romanize/açıklamalı değiştirildi. **CJK 0** doğrulandı.
2. **Q2990634 C017** (A, yalnız WD kaynak_id): ifadenin açıkça atfettiği birincil teyit kaynakları **S4/S5/S8 kaynak_id'ye eklendi** (DERS.json + KANIT). A korundu (değerler birincil teyitli).
3. **Q764831 C056** (WD yapısal gözlem, "A (yapısal)"): standart §4 WD yardımcı kaynak → **B'ye düşürüldü** (DERS.json + KANIT seviye + Sayım A=29/B=6 + KALITE düzey listeleri). Quiz hâlâ A/B-uygun.

**Düzeltilmeyenler (bilinçli, gerekçeli):**
- **63 heuristic yanlış-pozitif + 43 §8 kısa ders uyarısı:** gerçek hata değil; dogrula.py değiştirilmedi (üretim aracı). Kısa dersler kanıt sınırı (§8), dolgu yok.
- **Q311243 C041 (abstract-tek B):** kesin hata kanıtlanmadı; Wayback bu oturumda bot engelli. Tahminle düzeltme yapılmadı (§10 "tahmin ederek düzeltme yasağı"); Opus doğrulamasına bırakıldı.
- **1078 wiki-tek B iddia:** atıf zinciri semantik doğrulaması otomatik yapılamaz; toplu düşürme tahmin olurdu. Opus örneklem denetimine bırakıldı.
- **21 içeriksiz kaynak + 98 görsel incelenmemiş:** erişim/inceleme yapılamadı; gizlenmedi, açıkça işaretlendi.

## 12. Adım 11–12 — Rapor, DURUM, commit

- Bu rapor (`GENEL_KALITE_RAPORU.md`) oluşturuldu.
- `DURUM.md` güncellendi: Parti 7 (107/0/107) + kapanış denetimi bölümü.
- Yalnız `content-review` branch'ine commit/push. `main`'e merge/deployment/yayın **yok**. Uygulama kodu ve `data/` **değişmedi**. Pilot Q167605 ve Parti 1–6 ders içerikleri **dokunulmadı** (yalnız 3 KALITE CJK notu + 2 iddia etiketi düzeltmesi).
- Commit kimlikleri: Parti 7 `98462e90`; kapanış denetimi (bu rapor + düzeltmeler) `content-review`'da izleyen commit (kimlik git log / oturum kapanış bildiriminde).

## 13. Kritik kimlik / versiyon bulguları (tüm partiler — Opus öncelikli)

| Eser | Bulgu | Durum |
|---|---|---|
| Q28797801 David | Toledo 1786 replikası (Girodet after David); Louvre orijinali Q476458 | Ders kimliği D olarak beyan etti |
| Q227494 Hokusai | Gösterilen baskı Red Fuji (~1930 reproduksiyon); Büyük Dalga değil; kurum teyitsiz | Beyan edildi |
| Q175036 Guernica | WD P18/Commons = Gernika seramik reproduksiyonu; orijinal enwiki non-free | Beyan edildi |
| Q17277950 Cézanne | Seri maddesi; Courtauld versiyonu Q17277953; WD seri karışık | Beyan edildi |
| Q471379 Munch | 4 versiyonlu grup; ders 1893 NM Q18891156 | Beyan edildi |
| Q5826309 Hiroshige | Gösterilen nüsha LoC (data British Museum diyor) | D005 |
| Q1131176 Boucher | Ana görsel Münih versiyonu (data 1751 Köln); Louvre'da yok | D1 |
| Q17026577 Toulouse-Lautrec | Gösterilen nüsha Met ↔ WD P18 Bertarelli Milano | Beyan edildi |
| hogarth | Slayt görseli Davenport kopyası; state sayımı | D |
| Q19863024 Ricci | Berlin um 1725 (c.1720 değil); Budapeşte ayrı | Beyan edildi |
| bacon | Envanter N06171 (T05858=1988 Second Version; Gale T03073) | D1 (kritik) |
| Q1061035 Magritte | "1948" yalnız WikiArt slug; LACMA 1929 esas | D2/E4 |
| hoch | Çift WD kaydı Q107450751/Q126126939 | Beyan edildi |
| dali | Disintegration (1952–54) + Wrocław "Profile of Time" ayrı eser | Beyan edildi |
| Q2653851 Rubens | WD P217=10012 aslında 1747 gravür/ets (triptik değil) | Beyan edildi |
| Q63341 Baburen | MUFREDAT öncülü hatalı: Vermeer arka planı The Concert (Süt Boşaltan Kadın değil) | Düzeltildi |

## 14. Otomasyonun semantik sınırı (dürüstlük)

- Yapısal testler (şema/kimlik/çapraz/kelime/quiz A/B/CJK) **olgusal doğruluğu kanıtlamaz**.
- Etiketsiz-olgu tespitçisi heuristic'tir: sayı içermeyen olgusal prose'u kaçırır, kısaltma bölünmesinde yanlış-pozitif verir (63 uyarı).
- Kaynağın bir iddiayı **gerçekten destekleyip desteklemediği** otomatik çözülemez. Her A/B iddiası için semantik kaynak-destek değerlendirmesi (insan/Opus) gerekir.
- "URL açıldı" ≠ "iddia doğrulandı". İçeriksiz kaynak (21 eser) ve wiki-tek B atıf zinciri (1078) bu sınırın somut alanlarıdır.
- Bu rapordaki A–E etiketleri yazarın (modelin) değerlendirmesidir; bağımsız garanti değildir.

## 15. Claude Opus için öncelikli denetim alanları

1. **Kimlik/versiyon doğrulama (§13):** 16 kritik bulgunun birincil kayıtla birebir teyidi (envanter/başlık/sanatçı/versiyon). Özellikle David-Toledo, Hokusai-Red Fuji, Guernica-reproduksiyon, Bacon-N06171, Boucher-Münih, Cézanne-Courtauld, Munch-1893.
2. **Wiki-tek B atıf zinciri (1078 iddia):** satır içi akademik atıf gerçekten var mı, kaynak iddiayı destekliyor mu; atıfsız/kırık zincir → E'ye düşür. Örneklem: yüksek D+E'li eserler (Boucher, Munch, Cézanne, Gauguin, El Greco).
3. **İçeriksiz kaynak iddiaları (21 eser):** JS kabuğu/boş gövde kaynaklarına dayalı iddialar başka kanıtla destekli mi.
4. **Abstract-tek kanıt:** Q311243 C041 (Friedrich) — abstract alıntıları gerçekten içeriyor mu (TK04/AU02).
5. **Görsel teyit (98 eser):** GZ TASLAK soruları + kompozisyon betimleri doğru eser/görselle doğrulanmalı; data hotspot koordinatları.
6. **Telif/adil kullanım (5 eser):** Guernica/Höch/Dalí/Magritte/Bacon — görsel referansları adil-kullanım çerçevesine uygun mu; TR/AB bitiş tarihleri; Magritte ABD PD belirsizliği; Höch PD-US ayrımı. **Hukuki onay insan editöre ait.**
7. **Quiz semantik:** doğru cevapların olgusal doğruluğu + çeldirici gerekçeleri (yapısal temiz; semantik örneklem).
8. **Felsefi yorum ayrımı (§7):** Kant/Hegel/Benjamin/Berger/Panofsky/Deleuze yorumları C olarak işaretli mi; sanatçının etkilendiği iddiası kanıtsız yapılmış mı.

## 16. Kısıtlar ve sonraki adım

- `main`'e dokunulmadı; uygulama kodu ve `data/` değişmedi; deployment/yayın yok; insan onayı olmadan "Yayına aday" yok.
- **Sonraki adım:** (a) Claude Opus derin denetimi (§10'daki 15 eser + §15 alanları), (b) insan editoryal onayı (görsel + birincil + telif/hak politikası). Onay gelmeden hiçbir eser yayımlanmaz. DURUM.md "Kesintide Devam" protokolü izlenir.

**Ekler:** `.qwen/tmp/kapanis/scan-result.json` (107 eser tam metrik), `risk-output.txt` (risk sıralaması), `dogrula-final.txt` (0 hata/111 uyarı), `verify_work.py`/`scan.py`/`quiz_scan.py`/`risk.py` (yeniden çalıştırılabilir denetim araçları).
