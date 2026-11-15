# ÜRETİM NOTU — MİTOLOJİ EK3 (tek madde: MIT-005)

**Tarih:** 2026-11-15 · **Üreten:** `ansiklopedi-madde-yazim` (MIT-005 tek madde görevi) · **Brief:** `.qwen/tmp/ansiklopedi-pilot/mit-b/MIT-005-brief.md`
**Dosyalar:** `resim-ansiklopedisi/mitoloji/MIT-005-amaterasu.json` · `resim-ansiklopedisi/kanit-kayitlari/MIT-005.json`
**Doğrulama:** `dogrula.py --dosya resim-ansiklopedisi/mitoloji/MIT-005-amaterasu.json` → **0 HATA**, 5 UYARI (bkz. aşağı). `--test` 23/23 geçiyor (dogrula.py değiştirilmedi).

## 1. MIT-005 · amaterasu — iddia dağılımı

| Ölçüt | Değer |
|---|---|
| Claim sayısı | **8** (şema alt sınırı 5, batch üst sınırı 8) |
| Tür dağılımı | GELENEKSEL_ANLATI 6 (C005, C007, C010, C013, C015, C018) · OLGU 2 (C028, C036) |
| Statü dağılımı | DOGRULANDI **7** · KISMEN_DESTEKLENIYOR **1** (C018) · DOGRULANAMADI 0 · CELISKILI 0 · HATALI 0 |
| Kanıt kaydı | 8/8 birebir (iddia metinleri madde ile aynı) |
| Resim örneği | 7 kayıt: 6 resim (painting) + 1 baskı (surimono, kapsam notuyla) |
| Kaynak | 12 kayıt (K01, K05–K09, K11–K16) — hepsi brief envanterinden, erişim alanları AYNEN |

**Kaynak statü kararı (insan incelemesine açık):**
- **C018** brief'te DOGRULANDI öneriliyordu; birincil kaynağı K06 (Aston 1896) erişim durumu `ERISILDI_KISMEN` (OCR düzensiz) olduğu için Kural 9 gereği **KISMEN_DESTEKLENIYOR**'a düşürüldü. Ayrıca "Nihongi ana metninde ayna sahnesi yer almaz" kısmı bir *yokluk gözlemidir*; tek kaynakla desteklenir.
- **C007** için brief K06'yı birincil gösteriyordu; K06 `ERISILDI_KISMEN` olduğundan birincil kaynak olarak tam okunan **K01 (Kokugakuin EOS)** alındı, Aston pasajı kanıt kaydında `ikincil_kaynak_ids` + notlar içinde verildi. Statü brief önerisiyle (DOGRULANDI) korundu — yükseltme yapılmadı.

## 2. Açılan / erişilemeyen kaynaklar

- **Açılıp okunan ve maddede kullanılan:** K01 (EOS, canlı 200), K05 (Chamberlain/Wikisource, API 200), K06 (Aston/archive.org düz metin, **kısmen**), K07 (Britannica → Wayback 2023-11-28), K08 (Met API), K09 (Freer → Wayback 2025-09-07 / 2024-08-11), K11 (CMA API, CC0), K12 (Brooklyn → Wayback 2025-04-28), K13 (Jingū Chōkokan duyurusu, canlı), K14 (Ōtsu Rekihaku, canlı, Shift_JIS), K15 (Bunkachō, canlı).
- **Erişilemedi / engelli (kayıt altına alındı):** **K16** TNM eMuseum (`/en/` 403, `/en/search` 404) + NICH ColBase (200 ama JS kabuğu) → "Japon ulusal müzelerinde örnek var/yok" **genellemesi yapılmadı**, yalnız erişim notu yazıldı.
- **Brief envanterinde olup maddeye alınmayan kaynaklar:** K02 (Amenouzume), K03 (Ise Shinkō), K04 (ad yazımları), K10 (MFA baskıları), K17 (Ryūkoku, `ERISILEMEDI` — brief "DOGRULANDI dayanağı yapılamaz" diyor), K18 (tnm.jp, nesne kaydı bulunamadı). "Metnine erişilmedi" notu brief'te kayıtlı; bu sürümde bu kaynaklara dayanan hiçbir cümle yazılmadı.

## 3. Brief yetersizliği / iddia sınırı nedeniyle YAZILMAYAN bölümler

- **İmparatorluk soyu ve erken imparator tarihleri:** C030 ("claims descent / considered the ancestor"), C031 (Sujin, "legendary reign 97–30 B.C.E."), C034 (1869 / 1915 ziyaretleri) claim olarak taşınmadı; politik-duyarlı ve ihtiyat dili zorunlu bu içerik, 8 iddia sınırında omurga sayılmadığı için **madde metnine alınmadı** (kısmen yazmak yerine hiç yazmamak tercih edildi).
- **Ise inancının toplumsal tarihi** (C033 shihei kindan, C035 oshi/oharai-taima) ve **tenshon kōrin / Ninigi** anlatısı (C027, C032): claim yok → yazılmadı.
- **Metin tarihlendirmesi** (C024 Kojiki 712, C025 Nihongi 720): iddia sınırında yer bulamadı; bu yüzden `tarihsel_baglam` içinde **kesin yıl verilmemiş**, yalnız "saray çevresinde derlenen iki kronik" ve kullanılan çeviriler (Chamberlain / Aston) anılmıştır. İnsan denetiminde C024/C025 eklenerek tarihlerin yazılması önerilir.
- **Etimoloji ve cinsiyet ihtilafları** (C003 CELISKILI, C009): `akademik_tartismalar` alanında "claim düzeyinde belgelendirilemedi" notuyla anıldı, kesin anlatıya dayanak yapılmadı. (Sonuç: maddede CELISKILI iddia yok; `akademik_tartismalar` yine de 5 başlıkla dolu.)
- **Ortaçağ honji-suijaku katmanı:** yalnız Ōtsu-e örneğinin `baglam`/`versiyon_notu` alanında, kurum kaydının ihtiyat diliyle ("aktarılır", "söylenir") verildi; ikinci bağımsız akademik kaynak olmadığı için ayrı bir bölüm açılmadı.
- **"tori-ate" terimi KULLANILMADI** (kaynaklarda yok). Üç aday sahne ayrı ayrı belgelendi: uzun ötüşlü kuşlar + hazırlık dizisi (C013, Kojiki/Chamberlain), aynanın gösterilmesi ve yansıma (C015, Kojiki + Britannica + CMA kaydı), ukehi (C010, EOS + Kojiki + Britannica).
- **Kojiki ↔ Nihon Shoki birleştirilmedi:** her anlatı "Kojiki'nin metnine göre" / "Nihon Shoki'nin ana metnine göre" formunda; Britannica'nın kaynaştırılmış özeti "Kojiki temelli" etiketiyle kullanılmadı.
- **CJK:** kanji/kana yalnız `ozgun_ad` ve `alternatif_adlar` alanlarında (doğrulayıcı CJK uyarısı 0). Kaynak künyelerinde ve resim örneklerinde özgün başlıklar Latin harfli okunuşla verildi.

## 4. Planlanıp eklenemeyen çapraz bağlar

- **MIT-005 ↔ IKO-005 (ayna): EKLENDİ** — diskte var; ayna hem Kojiki mağara sahnesinde [C015] hem Ise/regalia bağlamında [C028] belgeli.
- **MIT-005 ↔ IKO-003 (Japon resminde ejder motifi): EKLENMEDİ** (PILOT_SECIM.md satırı "yalnız kaynak desteklerse" koşullu). Gerekçe: ejderha epizoduna ilişkin iddia (C042, Freer F1997.10) 8-iddia sınırında taşınmadı; ayrıca IKO-003 Çin longu/Japon ryū ikonografisini ele alırken buradaki anlatı Susanoo'nun ejderhasıdır — TAKSONOMİ §5.5 kavram-birleştirme yasağı riski. **Ana oturumun birleştirme turuna bırakıldı** (Kimura Ritsugaku kaydı `dogrulanmis_resim_ornekleri` içinde duruyor).
- **MIT-005 ↔ MIT-004 (krishna):** üretim anında MIT-004 diskte yoktu → eklenmedi (birleştirme turunda değerlendirilebilir; kategori bağı yok, önerilmez).
- Karşılıklı bağ (IKO-005 tarafında MIT-005) bu ajan tarafından **eklenmedi** (başka maddeye dokunma yasağı) → ana oturum eklemeli.

## 5. Kalan insan-inceleme noktaları

1. **C018'in statüsü:** Aston metni tam okunabilir bir nüshadan (ör. basılı 1896 ya da temiz OCR) doğrulanırsa DOGRULANDI'ya yükseltilebilir; şu anki hâli bilinçli olarak temkinlidir.
2. **K09 arşiv tarihi:** Freer kaynağında iki farklı Wayback tarihi var (F1997.20 → 2025-09-07, F1997.10 → 2024-08-11); şema tek `arsiv_tarihi` alanı olduğu için 2025-09-07 yazıldı, diğeri `notlar`da beyan edildi.
3. **Envanteri teyitsiz eserler:** Itō Ryūgai (K13, duyuru sayfası) ve Matsumoto Fūko (K15, Bunkachō kaydı; müzenin kendi kaydı açılamadı) → `envanter_no` alanına "kaynakta verilmiyor" yazıldı.
4. **Met API iç tutarsızlığı:** Kōno Bairei kaydı iki konulu ÇİFT rulo; `versiyon_notu`nda belirtildi, tek Amaterasu resmi gibi sunulmadı.
5. **Baskı örnekleri:** CMA Hokkei surimono dizisi Kural 11 gereği "resim örneği değil, bağlam kaydı" olarak işaretlendi; MFA baskıları (K10: Kunisada triptik, Gakutei surimono) maddeye alınmadı — gerekirse "bağımsız baskı" kapsam kararıyla eklenebilir.
6. **Doğrulayıcı uyarıları (5):** K08, K09, K14, K15 "hiçbir iddia bu kaynağı kullanmıyor" — bu kaynaklar `dogrulanmis_resim_ornekleri.kaynak_id` üzerinden kullanılıyor; dogrula.py'nin `kullanilan_kaynak` kümesi kaynak döngüsünden *sonra* resim örnekleriyle güncellendiği için uyarı yapısal olarak kaçınılmaz (içerik hatası değil). K16 ise bilerek iddiasız bırakıldı (erişim-engeli kaydı).

## 6. Kullanılmayan aday iddialar (brief'ten; 8-iddia sınırı nedeniyle alınmadı)

C001, C002, C003, C004, C006, C008, C009, C011, C012, C014, C016, C017, C019, C020, C021, C022, C023, C024, C025, C026, C027, C029, C030, C031, C032, C033, C034, C035, C037, C038, C039, C040, C041, C042, C043, C044, C045, C046, C047, C048 — bunlardan C039, C041, C042, C043, C048'in olgusal içeriği claim olarak değil, `dogrulanmis_resim_ornekleri` kayıtları (kendi `kaynak_id`leriyle) olarak taşınmıştır.

**Not:** Bu not ve üretilen dosyalar bağımsız denetim değildir; `yayin_durumu = BAGIMSIZ_DENETIM_BEKLIYOR`.
