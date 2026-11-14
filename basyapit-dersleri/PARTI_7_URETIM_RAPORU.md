# PARTİ 7 ÜRETİM RAPORU — M13 Telif-Korumalı 5 Eser (adil kullanım çerçevesi)

**Tarih:** 15 Kasım 2026 · **Branch:** `content-review` · **Standart:** `AKADEMIK_STANDART.md`
**Kapsam:** MUFREDAT sırasında kalan 5 telif-korumalı eser (#103–107, M13).
**Sonuç:** 5/5 tamam · dogrula **0 hata / 0 uyarı** (5 eser) · CJK 0 · `--test` 25/25 · kelime TAMAMI aralıkta.
**Durum:** **"İnsan incelemesi bekliyor"** — "Yayına aday" değil.
**Politika:** Kullanıcının **adil kullanım** kararı (eğitim/eleştiri; atıf + telif notu; görsel yeniden yayımlanmaz).

---

## 1. Kapsam

| # | Anahtar | Eser | Sanatçı | Müze | Telif bitiş (TR/AB) |
|---|---|---|---|---|---|
| 103 | Q175036 | Guernica | Pablo Picasso | Reina Sofía, Madrid | 2044 |
| 104 | hannah-hoch\|Cut with the Kitchen Knife… | Weimar Cumhuriyeti'nin Bira Göbeğini Mutfak Bıçağıyla Kesmek | Hannah Höch | Neue Nationalgalerie / SMB, Berlin | 2049 |
| 105 | salvador-dali\|The Persistence of Memory | Belleğin Azmi | Salvador Dalí | MoMA, New York | 2060 |
| 106 | Q1061035 | İmgelerin İhaneti (La trahison des images) | René Magritte | LACMA, Los Angeles | 2038 |
| 107 | francis-bacon\|Three Studies… | Çarmıha Geriliş'in Dibindeki Figürler İçin Üç Çalışma | Francis Bacon | Tate Britain, Londra | 2063 |

## 2. Metrik

| Anahtar | İddia | A/B/C/D/E | Kelime B/O/İ | dogrula H/U | Kaynak | Birincil |
|---|---|---|---|---|---|---|
| Q175036 | 66 | 20/24/2/8/12 | 443/1351/2714 | 0/0 | 10 | Reina Sofía canlı 200 + Rethinking Guernica 200 (A) |
| hoch | 55 | 15/24/2/5/9 | 448/1304/2757 | 0/0 | 20 | SMB canlı 200, obj 961048 (A) |
| dali | 69 | 19/13/16/5/16 | 486/1427/2714 | 0/0 | 13 | MoMA canlı 403 → Wayback 2026-11-02 TAM (A) |
| Q1061035 | 50 | 19/14/3/6/8 | 424/1303/2613 | 0/0 | 16 | LACMA canlı 200 + Denetim B recheck (A) |
| bacon | 58 | 28/5/1/9/15 | 423/1422/3126 | 0/0 | 14 | Tate API v2 + canlı 200; Gale 1998 + 2023 etiket (A) |
| **TOPLAM** | **298** | **101/80/24/33/60** | — | **0/0** | 73 | 5/5 birincil AÇILDI |

Soru bankası (her eser): 10 CS + 5 DY + 5 GZ + 5 AU + 5 TK. CS/DY/GZ/TK doğru cevapları **yalnız A/B**; AU serbest. Kelime hedefleri B 400–500 / O 1300–1600 / İ 2600–3200 — **tümü aralıkta, dolgu yok**.

## 3. Birincil kaynak erişimi

5 eserin birincil müze kaydı da AÇILDI (A):
- **Reina Sofía** (Guernica): canlı 301→200 `/colecciones/obra/guernica/` + "Rethinking Guernica" araştırma sitesi 200. Künye DE00050, 349,3×776,6 cm, Sala 205.10, giriş 1992; sipariş 1937 Paris İspanyol Pavyonu; bombardıman 26 Nisan 1937; provenans MoMA emaneti→1981 dönüş→1992 Reina Sofía.
- **SMB / Neue Nationalgalerie** (Höch): canlı 200 `search.smb.museum/object/obj-961048` (permalink `id.smb.museum/object/961048`; sayfa güncelleme 14.11.2026). NG 57/61, 114×90 cm, "Papier auf Karton, Collage", 1919; 1961 Nierendorf/BASF edinimi; 1920 Dada-Messe.
- **MoMA** (Dalí): canlı 403 Cloudflare → **Wayback 2026-11-02 tam snapshot**. 162.1934, 24.1×33 cm, 1931, "Given anonymously" (1934 Julien Levy'den anonim dost hibe alımı); provenance Dalí→Pierre Colle→Julien Levy→MoMA.
- **LACMA** (Magritte): canlı 200 `collections.lacma.org/object/31931` + Denetim B canlı recheck (200, JSON-LD teyit). 78.7, ≈60.3×81.1 cm, 1929, 1978 Harrison fonları (Sotheby's Parke-Bernet 17 Mayıs 1978, Sale 4124 Lot 70); BCAM 3rd Floor.
- **Tate** (Bacon): API v2 page 49036 + canlı sayfa 200; Matthew Gale Nov 1998 katalog girdisi + Eylül 2023 galeri etiketi tam metin. **N06171**, yağlıboya+pastel Sundeala levha, paneller 940×737/738/734 mm, "Presented by Eric Hall 1953", Lefevre Gallery Nisan 1945.

URL'ler tahmin edilmedi; WD P854/P973 refs, Wikipedia satır içi ref/external links ve Commons credit alanlarından bulundu. Canlı engel olan tek kaynak (MoMA) Wayback arşiv kopyasıyla açıldı (arşiv tarihi beyanlı).

## 4. Tartışmalar (D) / belirsizlikler (E) — öne çıkanlar

- **Guernica:** D4 ödeme 150.000 frank ↔ 300.000 peseta (birincilde rakam yok, kesinleştirilmedi); D6 bombardıman süresi Steer "3 saat çeyrek" ↔ Ray "~2 saat"; D7 fail kapsamı (S1 yalnız Alman ↔ S2 Alman+İtalyan); E1 boğa/at/ampul sembolleri (Picasso sabit okumayı reddetti: "bu bir boğadır, bu bir attır"); E2 Joselito marjinal tez; E6 data "bombilla/bomba" söz oyunu kaynaksız (kullanılmadı).
- **Höch:** D001 tarih 1919 (birincil) ↔ 1919–1920 (ikincil); D002 akwarel ilavesi birincilde YOK; D003 genişlik 90 ↔ 89,8; D004 enwiki görsel alt yazısı "90×144 cm" HATALI (kullanılmadı); D005 oy hakkı haritasının yönü ihtilaflı; E002 Einstein konumu (görsel incelenmedi); E003 HH monogramı (B/zincir); E005/E006 Kollwitz "ilk kadın profesör" + Alman oy hakkı 1918 (doğrulanmadı).
- **Dalí:** D1 fiyat $250 (1932 satış?) ↔ $350 (1934 MoMA alımı) — birincilde fiyat YOK, enwiki'nin $250 atfı MoMA'da bulunmuyor (kırık zincir); D2 ilk sergi 1932 NY ↔ Paris 1931 provenance; D5 Camembert "halüsinasyon" (Britannica) ↔ "düşünme/gözlemleme" (Dalí); E2 görelilik spekülasyon + Dalí'nin reddi; E6 "iki saat" tek zincir; E7 yer adları (Port Lligat/Cap de Creus/Puig Pení) uzlaşmaz.
- **Magritte:** D1 boyut WikiArt 63.5×93.98 ↔ LACMA ≈60.3×81.1 (A kazanır); D2 tarih 1929 ↔ WikiArt "1928–1929"/"-1948" slug; D3 konum BCAM (A) ↔ WD Ahmanson (refsiz); D4 Commons PD çelişkisi + silme talebi; D5 Bowman basılı 1985 ↔ çevrimiçi 2014; E1 ABD kamu malı statüsü BELİRSİZ (Duke CSPD, aynen korundu); E4 1948 versiyonu doğrulanmadı (Catalogue Raisonné erişilmedi).
- **Bacon:** D1 envanter N06171 ↔ T05858 (KRİTİK, aşağıda); D2 tarih 1944 ↔ c.1943-4 ↔ 1942-4; D3 itwiki 95 cm hatalı; D4 pastel/Sundeala; D5 Mortimer "mouths"↔"necks"; D7 "isteksiz kabul" anlatısı (Gale düzeltmesi); D8 "iki hafta" (Bacon) ↔ "protracted work" (teknik IR); E4 Holokost okuması yorum; E7 çığlık mı esneme mi; E9/E10 dinsel/Nazi figür okumaları (öneri).

Tüm D/E ifadeleri derslere ve quizlere **aynen** taşındı; D→"(tartışma)", E→"(belirsiz)" post-pass uygulandı. Hiçbir D/E iddia kesin cevaplı quiz sorusuna temel yapılmadı.

## 5. Görsel doğrulama (Kural 6)

**Vision bütçesi tükendiğinden 5 eserin görseli de İNCELENEMEDİ** → `gorsel.dogrulama.incelenen_bolgeler=[]`, GZ 5/5 TASLAK. Kompozisyon birincil (A) + ikincil (B) **metinlerinden** ("kaynakların betimlediği"). İnsan editör görsel teyidi ZORUNLU. Görsel kimlik/lisans bulguları:
- **Guernica:** WD P18/Commons dosyası Gernika'daki **seramik karo reproduksiyonunun** fotoğrafı (CC BY-SA 4.0 yalnız fotoğrafı kapsar); orijinal tablonun Commons'ta serbest dosyası YOK; orijinal enwiki non-free fair use (464×211). (Q227494 Red Fuji örüntüsü.)
- **Höch:** enwiki dosyası **PD-US** (yalnız ABD; kaynak ülkede telifli) — TR/AB'de "kamu malı" denmedi; SMB fotoğrafı © VG Bild-Kunst 2021.
- **Dalí:** serbest Commons dosyası YOK; WD P18 YOK; enwiki non-free fair use (371×268); MoMA dijital görseli © MoMA/Scala/Art Resource.
- **Magritte:** Commons "Magritte treachery.jpg" PD iddiası çelişkili + 15 Mayıs 2026 silme talebi; enwiki non-free fair use; tablo © C. Herscovici/ARS.
- **Bacon:** Commons'ta dosya YOK; enwiki non-free fair use (485×206); Tate master © Estate of Francis Bacon/DACS (CC yok).

## 6. Telif / adil kullanım çerçevesi

Kullanıcı Parti 7 için **adil kullanım** çerçevesini seçti (eğitim/eleştiri amaçlı; atıf + telif notu). Uygulama:
- Görseller **yeniden yayımlanmadı / projeye kopyalanmadı**; derslerde yalnız **URL + lisans + kaynak** referansı verildi.
- Her eserin `kunye.telif_durumu` alanı ve üç ders + KALITE_KONTROL.md telif/adil-kullanım notu taşır ("hukuki tavsiye değildir" beyanı ile).
- TR/AB ölüm+70 bitiş tarihleri: Picasso 2044, Höch 2049, Dalí 2060, Magritte 2038, Bacon 2063. Magritte ABD PD statüsü belirsiz (Duke); Höch PD-US yalnız ABD.
- **Bu çerçeve hukuki onay yerine geçmez;** insan editör/hak politikası onayı bekleniyor.

## 7. Kritik kimlik bulguları

- **Bacon envanteri N06171 (T05858 DEĞİL):** Görev/data anahtarındaki T05858, Tate API page 100831'e göre **1988 "Second Version of Triptych 1944"** (tuval, 1980×1475 mm, 1991 sanatçı hediyesi). 1944 triptiği **N06171**. Ek: Gale 1998 kataloğu 1988 versiyonunu "T03073" diye anar (Tate içi eski/güncel numara tutarsızlığı); NG6171 (National Gallery) yalnız WD/itwiki'de ikincil katman. Ders N06171 kullanır; ayrım İleri derste metodolojik vaka olarak işlenir.
- **Guernica P18 reproduksiyonu:** Yukarıda (§5) — orijinal yerine Gernika seramik kopyası gösterilme riski.
- **Magritte versiyon:** Ders LACMA 1929 versiyonu; "1948" yalnız WikiArt URL slug'ı (sayfa içeriği 1928–1929 diyor), doğrulanmadı. Duke, Variétés'teki ters pipolu ayrı versiyonu belgeliyor (o imge ABD'de PD 2025).
- **Höch çift WD kaydı:** Q107450751 (SMB objID 961048 ile örtüşen, esas) + Q126126939 (plwiki ikizi; 89,8 cm + "watercolor" P31 sapmaları).
- **Dalí ayrı eserler:** *The Disintegration of the Persistence of Memory* (1952–54, Salvador Dalí Museum FL) ve Q136701577 Wrocław "Profile of Time" heykeli bu eser DEĞİL; brief/ders ayrımı açık.

## 8. Kısıtlar (uygulandı)

- Pilot Q167605 + Parti 1-6 (102 eser) dokunulmadı; uygulama kodu ve `data/` değişmedi; `main`'e merge/deployment/yayın yok; yalnız `content-review` commit/push.
- "Yayına aday" yapılmadı; tümü "İnsan incelemesi bekliyor".
- Şiddet/hassas konular (Guernica, Bacon) akademik ve açık ayrıntısız betimlendi; ikonografi yorum olarak işaretlendi.
- Uydurma bibliyografya/URL/envanter yok; erişilemeyen kitap/makale metinleri "kaynakçada anıldı, metne erişilmedi" (B atıf zinciri notu).

## 9. ÜRETİM SONU

**107 eserin 107'si üretildi** (pilot Q167605 + Parti 1-7). Tümü "İnsan incelemesi bekliyor"; tüm repo dogrula **0 hata**, `--test` 25/25. Parti 7 ile MUFREDAT kapsami tamamlanmıştır.

## 10. Kalıcı altyapı notu

- `.qwen/agents/kaynak-arastirma.md` + `.qwen/agents/ders-yazim.md` parti-bağımsız (`<PARTI>`); bu parti `.qwen/tmp/parti7`.
- `.qwen/tmp/parti7/` altında 5 brief + ham cache + `gen.py` + `uret-{Q175036,hoch,dali,Q1061035,bacon}.py` + `metrics7.py`.
- Bağımsız doğrulama araçları: `.qwen/tmp/kapanis/verify_work.py` (eser bazlı), `scan.py` (envanter/kanıt/görsel/quiz), `risk.py` (risk + Opus 15).

**Sonraki adım:** 107 eserin tamamı için **kapanış/kalite denetimi** (`GENEL_KALITE_RAPORU.md`) + insan editoryal incelemesi (görsel teyidi, birincil kaynak, telif/hak politikası onayı). DURUM.md "Kesintide Devam" protokolü izlenir. Hiçbir eser otomatik yayımlanmaz.
