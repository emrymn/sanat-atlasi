# ÜRETİM NOTU — RESİM TEKNİĞİ EK 3 (TEK-005 'wasli')

**Üreten:** ansiklopedi-madde-yazim (tek-b, tek madde) · **Tarih:** 2026-11-15
**Kapsam:** YALNIZ `TEK-005-wasli.json` + `kanit-kayitlari/TEK-005.json`. Başka hiçbir maddeye/dosyaya dokunulmadı
(TEK-004 başka ajanda; `DURUM.md`, `GENEL_RAPOR.md`, `kaynaklar/KAYNAK_KUTUGU.json`, `denetim/` değiştirilmedi).

---

## TEK-005 · wasli (kategori: `minyatur-teknikleri`)

**Dosyalar:** `resim-ansiklopedisi/resim-teknikleri/TEK-005-wasli.json` (270 satır) · `resim-ansiklopedisi/kanit-kayitlari/TEK-005.json` (8 kayıt)
**Doğrulama:** `dogrula.py --dosya …/TEK-005-wasli.json` → **0 HATA · 0 UYARI**; `--test` → **23/23 geçti** (testler değiştirilmedi).
**Yayın durumu:** `BAGIMSIZ_DENETIM_BEKLIYOR` · `son_guncelleme: 2026-11-15`

### 1. İddia sayımı (8 iddia — brief'teki 21 adaydan omurga seçimi)

| Tür | Adet | Statü | Adet |
|---|---|---|---|
| TEKNIK_TANIM | 4 (C001, C004, C005, C006) | DOGRULANDI | 4 (C001, C002, C003, C005) |
| OLGU | 3 (C002, C003, C007) | KISMEN_DESTEKLENIYOR | 1 (C004) |
| HIPOTEZ | 1 (C008) | CELISKILI | 2 (C006, C007) |
| — | — | DOGRULANAMADI | 1 (C008) |
| — | — | HATALI | 0 |

Birleştirme haritası (brief adayları → madde iddiaları): C001→C001 · C011→C002 · C012+C013→C003 · C002+C003→C004 ·
C004+C005+C006+C007+C008(bağlayıcı kısmı)→C005 · C020→C006 · C019+C014→C007 · C016+C017→C008.

**Seçilmeyen adaylar (tek satır):** C009 (pigment hazırlığı/palet + Anita Chowdry videosu — video izlenmedi), C010 (Hint kâğıt türleri + astarlama, tek kaynak K04), C015 (Mughal–İran beyaz ön yıkama farkı, tek kaynak/Johnson 1972 erişilemedi), C018 (alan literatürü kaynak eleştirisi, YORUM), C021 (kâğıt adlandırma ihtilafı) — bunlar `akademik_tartismalar` 5, 7 ve 8'de kaynak atfıyla anıldı, kesin anlatıya dayanak yapılmadı.

### 2. Çerçeve kararı (brief'in TERİM BULGUSU)

- Madde, 'wasli'yi **boya tekniği değil, hazırlanmış kâğıt desteği** olarak tanımlar; teknik tarafı kurumsal adlandırma
  ihtilafıyla birlikte ayrı düzlemde ele alınır (C001, C002, C006).
- `turkce_ad`: "Wasli (Hint minyatüründe hazırlanmış kâğıt desteği ve üzerine uygulanan opak suluboya/guaj)"; `slug: wasli` **sabit** (PILOT_SECIM).
- Terimin kurumsal kullanımının **yalnız çağdaş** kayıtlarda (V&A IS.7:1-2003 / 2001; CMA 2021.103 / 2020) görüldüğü,
  16.–19. yy Mughal/Rajput kayıtlarında geçmediği metinde açıkça yazıldı (C002, `akademik_tartismalar` 2).
- **Hamzanama istisnası** (pamuk + kâğıt kompozit; V&A IM.5-1921 ↔ Met 23.264.1) ayrı bölüm ve ayrı iddia olarak verildi (C003).
- Farsça *vasl* etimolojisi ve "10. yy icadı" **DOGRULANAMADI** (yalnız atıfsız Wikipedia) → kesin anlatıya alınmadı, HIPOTEZ (C008).
- **Osmanlı minyatürüyle karşılaştırma YAZILMADI** (brief'te kaynak yok; kapsam dışı karıştırma yasağı). İran karşılaştırması
  yalnız JAIC (K08) + Brown (K04) ortak malzeme zinciriyle sınırlı tutuldu.

### 3. Kaynaklar

- **Yazılan kaynaklar (10, tümü brief §2 envanterinden, hepsi okundu):** K01 V&A Mughal makalesi (CANLI) · K02 V&A Collections API v2 (API) ·
  K03 Kanwal Khalid 2015, Punjab Üniversitesi (PDF) · K04 Brown University/Minassian (CANLI) · K05 Met Heilbrunn "Mughals before 1600"
  (canlı 429 → **WAYBACK_OKUNDU**, arşiv 2026-04-22) · K06 Met Collection API (API) · K07 NG Glossary "Gouache" (CANLI) ·
  K08 Purinton & Watters, JAIC 30(2) 1991 (CANLI tam metin) · K09 Cleveland Open Access API (API) · K10 Wikipedia "Wasli" (CANLI, YARDIMCI — hiçbir iddiaya dayanak yapılmadı).
- **Erişilemeyen 9 kaynak** (brief §6) `kaynaklar` dizisine **kaynak_id atanmadan** `akademik_tartismalar` 10'da künye + engel nedeni ile listelendi:
  "The Changing Skin of Indian Painting" (403, Wayback yok) · Schimmel & Welch 1983 (PDF taranmış, OCR yok → s.37/46 doğrulanmadı) ·
  Modern Art Oxford Qureshi PDF (500 / Wayback bozuk) · CAMEO "Wasli" (403) · Britannica "Indian painting" (403, Wayback yok) ·
  BM 2017,3001.6 (açılmadı) · San Diego/Binney (denenmedi) · Chandra 1949, Brown 1924, Behzad 1939, Johnson 1972 (bibliyografik).
  Bu kaynakların hiçbiri iddia dayanağı yapılmadı; `KAYNAK_KUTUGU.json`'a dokunulmadı (kütük işlemleri ana oturumda).

### 4. Doğrulanmış resim örnekleri (5 / brief'teki 11 adaydan)

Mughal: V&A IM.5-1921 (Hamzanama, 'gouache on cotton') · V&A IS.2:27-1896 (Akbarnama, La'l/Nand) — Pahari: Met 1975.412 (Guler, Kalki Avatar) —
Çağdaş: V&A IS.7:1-2003 (Imran Qureshi, 'on wasli (paper)') · CMA 2021.103 (Shahzia Sikander, 'gouache on wasli paper').
Alınmayan aday örnekler: Met 23.264.1 (Hamzanama yaprağı — C003 içinde ikinci kurumsal kanıt olarak anıldı), Met 13.228.30, Met 1983.258,
Met 2022.242 (Basohli/Mankot), Met 2008.359.35 ('Ink and wash' — C006'da anıldı), V&A IM.8-1925 (Govardhan).

### 5. Çapraz bağlar

- `ilgili_maddeler`: **MIT-004** (PILOT_SECIM'in planladığı TEK-005 ↔ MIT-004 bağı; `MIT-004-krishna.json` yazım sırasında diskte
  belirdi, glob ile doğrulandı → bağ EKLENDİ) · **TEK-002** (suda çözünen bağlayıcı / opak gövde rengi karşılaştırması) · **NES-003** (hokka-fırça).
- **Ana oturuma kalan iş:** MIT-004 tarafına karşılıklı `TEK-005` bağının eklenmesi (bu ajan MIT-004 dosyasına dokunmadı).
- TEK-004 (`murekkep-resmi`) PILOT_SECIM'de TEK-005 için planlı bir bağ değildir → eklenmedi.

### 6. Brief yetersizliği nedeniyle YAZILMAYAN bölümler

- Osmanlı minyatürüyle karşılaştırma (kaynak yok).
- Wasli'nin tarihsel (16.–19. yy) eser kayıtlarında geçtiği birincil örnek (bulunamadı → C002 ile yokluk tespiti yazıldı).
- Katman sayısı için tek değer, kâğıt türü listesi (K03 bölgesel adlar ↔ K04 hammadde adları), parlatma aracının tek tipi ve
  Mughal–İran beyaz ön yıkama farkı → kesinleştirilmedi, `akademik_tartismalar` 5, 6, 8'de kaynak atfıyla bırakıldı.
- Sembolik/kozmolojik yorum (kaynaklarda yok → otomatik anlam atfedilmedi; KAPSAM SINIRI bölümünde açıkça belirtildi).

### 7. Boyut notu (brief hedefinden sapma)

`ayrintili_aciklama` **5349 karakter** (brief/görev hedefi ~2000–3500). Nedeni: TAKSONOMI §3'ün resim teknikleri için zorunlu
bölüm listesi (tanım · sınıflandırma · malzemeler · araçlar · uygulama süreci · tarihsel gelişim · benzer yöntemlerden farklar ·
örnekler) + 8 iddianın çok kaynaklı içeriği. Hiçbir cümle kelime hedefini doldurmak için üretilmedi; tüm olgusal cümleler `[C###]`
etiketli ve kardeş maddelerle uyumlu (TEK-003 ≈ 7,5k karakter). Madde JSON'u 269 satır (sınır ~350) ve kanıt pasajları ≤2 cümle.
İnsan editör isterse İHTİLAFLAR ve DESTEĞİN HAZIRLANMASI bölümleri claims metinleriyle örtüştüğü için kısaltılabilir.

### 8. Kalan insan-inceleme noktaları

1. **Atıf ihtilafı (C007, CELISKILI):** V&A makalesi 'Farrukh Beg' ↔ güncel API 'La'l (kompozisyon) / Nand (renk)'; makale alt yazısının
   birleşik 'IS.2:27&28-1896' yazması. Madde API kaydını esas aldı; ihtilafın nedeni (farklı yaprak mı, güncellenmiş atıf mı) açılan kaynaklardan çözülemedi.
2. **Adlandırma ihtilafı (C006, CELISKILI):** opaque watercolour / opaque watercolor / gum tempera / gouache — tek terim seçilmedi; editoryal karar gerekebilir.
3. **Tek kaynaklı ayrıntılar (C004, KISMEN):** katman sayısı (4/8), maida + göztaşı tutkalı → ikinci bağımsız akademik kaynak aranmalı
   (Chandra 1949 ve Schimmel & Welch 1983'ün OCR'lı nüshası en olumlu adaylar).
4. **DOGRULANAMADI (C008):** *vasl* etimolojisi ve 10. yy icadı — iki bağımsız akademik kaynak bulunursa madde güncellenmeli.
5. **Erişim denemeleri:** CAMEO 'Wasli' maddesi, BM 2017,3001.6 (Wayback ile), San Diego/Binney kaydı, Modern Art Oxford wasli öğreticisi.
6. **Terimin tarihçesi:** 'wasli'nin çağdaş Pakistan/Hint minyatür pratiği (Lahor NCA çevresi) üzerinden müze terminolojisine girişi — kaynaklı bir çalışma yok.
7. Yapısal testlerin olgusal doğruluğu kanıtlamadığı unutulmamalı (AKADEMIK_DOGRULAMA_KURALLARI §10) → bağımsız denetim şarttır.
