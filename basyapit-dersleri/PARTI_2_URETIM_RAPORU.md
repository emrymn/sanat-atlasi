# PARTİ 2 ÜRETİM RAPORU — 20 Başyapıt Akademik Mikro Ders

**Tarih:** 14 Kasım 2026 · **Branch:** `content-review` · **Standart:** `AKADEMIK_STANDART.md`
**Kapsam:** MUFREDAT sırasında Vermeer pilotu (Q167605) + Parti 1'in 20 eseri atlandı; sıradaki **20 eser** üretildi.
**Sonuç:** 20/20 tamam · dogrula **0 hata** · 19 uyarı (bilinçli §8 kısa ders + kaynakça heuristic) · CJK 0 · `--test` 25/25.
**Durum:** Tümü **"İnsan incelemesi bekliyor"** — hiçbir eser "Yayına aday" değil.

---

## 1. Kapsam ve sıra

M4 kalanı (5) + M5 (5) + M6 ilk 10 (10) = 20. M6'nın 11.'si Veronese (Q185255) Parti 3'e kaldı.

| # | Anahtar | Eser | Sanatçı | Modül | Müze / Mekân |
|---|---|---|---|---|---|
| 1 | Q2892964 | Tefeci ve Karısı | Quentin Metsys | M4 | Louvre |
| 2 | Q27978197 | Üç Çağ ve Ölüm | Hans Baldung Grien | M4 | KHM Viyana |
| 3 | Q3605055 | Âdem ile Havva | Lucas Cranach (yaşlı) | M4 | Uffizi |
| 4 | Q1212937 | Elçiler | Hans Holbein (genç) | M4 | National Gallery Londra |
| 5 | Q18579333 | Paris'in Hükmü (baskı) | Marcantonio Raimondi | M4 | Çok nüsha (gösterilen: Met) |
| 6 | Q128910 | Son Akşam Yemeği | Leonardo da Vinci | M5 | Cenacolo, Milano |
| 7 | Q500242 | Âdem'in Yaratılışı | Michelangelo | M5 | Sistina Şapeli, Vatikan |
| 8 | Q186953 | Atina Okulu | Raphael | M5 | Vatikan Stanze |
| 9 | Q700834 | Jüpiter ve Io | Correggio | M5 | KHM Viyana |
| 10 | Q727875 | Urbino Venüsü | Titian | M5 | Uffizi |
| 11 | Q3705703 | Çarmıhtan İndiriliş | Pontormo | M6 | Santa Felicita, Floransa |
| 12 | Q1863885 | Musa, Yitro'nun Kızlarını Savunurken | Rosso Fiorentino | M6 | Uffizi |
| 13 | Q867403 | Uzun Boyunlu Meryem | Parmigianino | M6 | Uffizi |
| 14 | Q1430990 | Bir Alegori (Venüs, Cupid, Zaman, Akılsızlık) | Bronzino | M6 | National Gallery Londra |
| 15 | Q140161127 | Çarmıhtan İndiriliş | Daniele da Volterra | M6 | Trinità dei Monti, Roma |
| 16 | Q18572249 | Aziz Thomas'ın Şüphesi | Francesco Salviati | M6 | Louvre |
| 17 | Q19966572 | Aşk Sahnesi | Giulio Romano | M6 | Hermitage |
| 18 | Q23008305 | Satranç Oynayan Kız Kardeşler | Sofonisba Anguissola | M6 | Narodowe, Poznań |
| 19 | Q94802 | Orgaz Kontu'nun Gömülmesi | El Greco | M6 | Santo Tomé, Toledo |
| 20 | Q2472983 | Son Akşam Yemeği | Tintoretto | M6 | San Giorgio Maggiore, Venedik |

## 2. Yöntem

Her eser için: kaynak araştırması → `KANIT_DOSYASI.md` (A–E iddia envanteri) → 3 seviye ders (Başlangıç/Orta/İleri) → `DERS.json` + `SORULAR.json` → `KALITE_KONTROL.md` (Denetim A + Denetim B) → `dogrula.py`.

- **İşbölümü:** 10 eser ana oturumda; 10 eser `ders-yazim` alt-agent'larında yazıldı (araştırma brief'leri `kaynak-arastirma` agent'larından). **Tüm agent çıktıları ana oturumda bağımsız doğrulandı** (dogrula + CJK + sayım); agent öz-raporlarına körü körüne güvenilmedi.
- **İddia–kanıt A–E:** A=birincil/doğrudan, B=kaynaklı ikincil, C=yorum, D=tartışma, E=yetersiz/erişilemez. Quiz CS/DY/GZ/TK doğru-cevap kanıtı **yalnız A/B**; AU serbest. D/E etiketli ders cümlesi aynı cümlede belirsizlik işareti taşır ("(tartışma)"/"(belirsiz)").
- **Kaynak hiyerarşisi:** müze/kurum birincil katalog > akademik ikincil > Wikipedia (tek başına güçlü A/B kanıtı değil) > WD yardımcı. URL tahmini yok; ölü URL → Wayback (arşiv tarihi beyanlı).
- **Üretim araçları:** `.qwen/tmp/parti2/gen.py` (ortak üretici; totolojik çeldirici gerekçelerini bağlamsallaştırır, incelenmeyen görselde GZ'ye "TASLAK" öneki ekler) + eser-özel `uret-*.py` / `expand-*.py`.

## 3. Metrik tablosu

| Anahtar | İddia | A/B/C/D/E | Kelime B/O/İ | dogrula H/U | Birincil erişim |
|---|---|---|---|---|---|
| Q2892964 | 37 | 16/15/2/3/1 | 500/1325/2656 | 0/0 | Louvre A |
| Q27978197 | 25 | 10/10/2/2/1 | 439/1304/2604 | 0/0 | KHM A |
| Q3605055 | 25 | 5/13/3/2/2 | 405/1302/2539 | 0/1 | Uffizi arşiv A |
| Q1212937 | 33 | 12/12/2/5/2 | 405/1311/2551 | 0/1 | NG A |
| Q18579333 | 55 | 32/0/3/12/8 | 417/1417/2616 | 0/0 | 7 nüsha A; Stuttgart E |
| Q128910 | 22 | 3/12/3/2/2 | 411/1300/2476 | 0/1 | Cenacolo A |
| Q500242 | 28 | 5/8/9/4/2 | 411/1300/2485 | 0/1 | Vatican A |
| Q186953 | 33 | 10/10/2/9/2 | 411/1257/2339 | 0/2 | Vatican arşiv A |
| Q700834 | 41 | 12/16/4/7/2 | 378/981/1720 | 0/3 | KHM A |
| Q727875 | 25 | 3/13/2/5/2 | 402/1305/2524 | 0/1 | Uffizi arşiv A |
| Q3705703 | 90 | 8/48/5/14/15 | 486/1411/3158 | 0/0 | Polo Museale arşiv A |
| Q1863885 | 46 | 23/10/1/5/7 | 410/1317/2661 | 0/0 | Uffizi canlı+arşiv A |
| Q867403 | 54 | 18/17/2/7/10 | 423/1325/2720 | 0/0 | Uffizi canlı+arşiv A |
| Q1430990 | 56 | 28/10/4/8/6 | 466/1422/2658 | 0/0 | NG canlı A |
| Q140161127 | 48 | 12/18/6/6/6 | 441/1379/2785 | 0/6 | trinitadeimonti.net + Treccani A/B |
| Q18572249 | 40 | 18/3/7/5/7 | 424/1334/2805 | 0/0 | Louvre arşiv + Joconde A |
| Q19966572 | 19 | 1/12/2/2/2 | 363/769/1247 | 0/3 | Hermitage URL yok (E) |
| Q23008305 | 72 | 17/22/6/11/16 | 420/1353/2630 | 0/0 | mnp.art.pl canlı A |
| Q94802 | 82 | 15/27/12/11/17 | 416/1329/3119 | 0/0 | santotome.org canlı A |
| Q2472983 | 45 | 12/16/3/4/10 | 420/1303/2633 | 0/0 | ICCD arşiv A |
| **TOPLAM** | **876** | **260/292/80/124/120** | — | **0/19** | — |

Her eserde soru bankası: **10 CS + 5 DY + 5 GZ + 5 AU + 5 TK** (CS/DY/GZ/TK kanıtı yalnız A/B). Kelime hedefleri B 400–500 / O 1300–1600 / İ 2600–3200.

## 4. Birincil kaynak erişimi

**AÇILDI (güçlü A):** Louvre (Metsys, Salviati), KHM (Baldung, Correggio), Uffizi (Cranach, Titian, Rosso, Parmigianino), National Gallery (Holbein, Bronzino), Vatican/Cenacolo (Leonardo, Michelangelo, Raphael), Polo Museale (Pontormo), trinitadeimonti.net + Treccani DBI (Volterra), Joconde POP (Salviati), mnp.art.pl (Anguissola), santotome.org (El Greco), ICCD (Tintoretto), 7 baskı nüshası (Raimondi: Met/Kunsthalle/BnF/NGA/Boijmans/Uffizi/Berlin).

**ERİŞİLEMEDİ / BULUNAMADI (E):** Hermitage birincil katalog URL (Giulio — wiki refs yalnız Rusça basılı katalog veriyor; tahmin yasak); Stuttgart Raimondi kaydı (gösterilen nüsha Met ile data müze alanı uyuşmazlığı, D). Çeşitli canlı sayfalar 403/522/429 → Wayback arşivinden açıldı (arşiv tarihi beyanlı: Polo Museale 2024-02-14, ICCD 2025-01-20, Uffizi 2022/2025, Louvre, BnF). Kitap/dergi metinleri (Vasari çevirileri, monografiler, Burlington Magazine vb.) erişilemedi → ilgili iddialar B-zincir/E.

## 5. Görsel doğrulama sınırı (Kural 6)

**Vision köprüsü bütçesi #3 eserden sonra tükendi.** İlk 2 eserde (Metsys, Baldung) görsel gerçekten İNCELENDİ; sonraki **18 eserde görsel indirildi ama İNCELENEMEDİ** → `gorsel.dogrulama.incelenen_bolgeler=[]`, GZ soruları **"TASLAK (görsel bu oturumda incelenemedi; betim kaynak metni)"** önekli. Kompozisyon birincil/ikincil **METİNDEN** betimlendi; kesin görsel-observation sorusu sorulmadı. **İnsan editör görsel teyidi ZORUNLU.** Görseller projeye kopyalanmadı; lisanslar (PD / PD-Art) kaynakçada beyanlı.

## 6. Başlıca tartışmalar (D) ve belirsizlikler (E)

- **Tarih ihtilafları:** Rosso 1523↔1523–27; Giulio 1523–24↔1524–25↔1525; Salviati data/WD 1537 ↔ Joconde "2e quart 16e siècle"; El Greco 1586↔1586–88; Tintoretto 1563↔1592–94; Anguissola Vasari 1556↔1566; Volterra 1541↔c.1545↔1543.
- **Teknik/boyut:** Pontormo oil↔egg-tempera; Correggio DE↔EN boyut; Parmigianino 216.5×132.5↔219×135; Volterra boyut hiçbir kaynakta yok (E); Bronzino WD 147×117↔NG 146.1×116.2.
- **İkonografi/kimlik:** Parmigianino tomarlı figür Jerome+Francis↔peygamber↔data "İşaya" (kaynaklandırılmamış); Bronzino üst-sol Oblivion↔Verità↔data "Gece", hibrit kız elleri; Anguissola hizmetçi sol↔orta, checkmate↔imkânsız diziliş; Giulio başlık tentative (çok ad).
- **Orijinallik/atıf:** Rosso Natali "copia fedelissima e coeva"; Giulio Hermitage↔Berlin kayıp versiyon; Volterra Michelangelo çizim hipotezi reddedildi; Tintoretto otografi↔atölye.
- **data/ uyuşmazlıkları (DEĞİŞTİRİLMEDİ, onaya sunuldu):** Leonardo data 1490; Cranach "Haffs" yazımı; Raphael WD P217 Ambrosiana karton; Parmigianino "İşaya"/"fildişi kule"/"tek sütun"; Bronzino "diz çökmüş"/tekil güvercin; Raimondi müze Stuttgart↔Met; Anguissola "mürebbiye"/"Anadolu halısı"; El Greco/Tintoretto yerleşim betimleri. Her eserin `KALITE_KONTROL.md` § veri notlarında.

## 7. Kalite kuralları uyumu (10 kural)

1. **Müze birincil kayıt:** URL tahmini yok; bulunan kurum kaydı açıldı, künye (başlık/sanatçı/envanter/boyut) teyit edildi. Bulunamayan (Hermitage, Stuttgart) E olarak beyan edildi. ✔
2. **Wikipedia tek başına güçlü kanıt değil:** wiki iddiaları B (atıf-bandı notlu) veya atıfsızsa C/E; A yalnız birincil/doğrudan. ✔
3. **Kaynak çekinceleri korundu:** "muhtemelen/hipotez/yaklaşık/circa" ders + quiz'e aynen taşındı; D/E cümlelerinde belirsizlik işareti. ✔
4. **Görsel incelenmeden kesin observation sorusu yok:** 18 eserde GZ TASLAK; kompozisyon kaynak metninden. ✔
5. **İleri'de dolgu/tekrar yok:** yakın-tekrar paragraflar üretimde yakalanıp kaldırıldı; kısa dersler §8 bilinçli tercih (uydurma yok). ✔
6. **Yorum ↔ olgu ayrımı:** felsefi/estetik çerçeveler açıkça "(yorum)" ve ödünç (Kant/Benjamin vb. kurum-dışı); tarihsel olgudan ayrı. ✔
7. **Yanlış şık gerekçeleri gerçek:** totolojik çeldirici gerekçeleri gen.py ile bağlamsal gerekçeye çevrildi. ✔
8. **Eser başına 7 dosya:** 3 ders + DERS.json + SORULAR.json + KANIT_DOSYASI.md + KALITE_KONTROL.md. ✔
9. **dogrula.py her eserde:** 0 hata; 19 uyarı raporlandı (§8 kelime + kaynakça heuristic). ✔
10. **DURUM.md kaydı:** 20 eser "İnsan incelemesi bekliyor" olarak işlendi; Özet 41/66/107. ✔

## 8. dogrula.py sonuçları ve uyarılar

- **Parti 2 eserleri: 0 HATA.** Şema (jsonschema Draft 2020-12 AKTİF), 12 bölüm eşleşme, KANIT↔DERS.json sayım, quiz A/B, D/E işareti, CJK temiz.
- **19 UYARI:**
  - **13 kelime aralığı (§8):** Cranach İ2539, Holbein İ2551, Leonardo İ2476, Michelangelo İ2485, Raphael O1257+İ2339, Correggio B378+O981+İ1720, Titian İ2524, Giulio B363+O769+İ1247. Bunlar birincil/görsel sınırı nedeniyle **bilinçli kısa ders** (§8 tahmini); dolgu yok. İnsan editör genişletmesi önerilir.
  - **6 Volterra kaynakça heuristic:** DERS_ILERI §12 kaynakça maddelerindeki yıl/sayı içeren satırlar ("pp./p./M." kısaltmaları) etiketsiz-olgu tespitçisinin yanlış-pozitifi; gerçek olgusal iddia değil.
- **`dogrula.py --test`: 25/25 GEÇTİ.** (Testler yapısal reddetmeyi doğrular; semantik/olgusal doğruluğu garanti etmez.)
- **CJK taraması: 0** (20 eserin tüm md+json dosyaları; üretimde karışan CJK karakterler düzeltildi).

## 9. Kısıtlar (uygulandı)

- İlk 20 eser (Parti 1) **yeniden üretilmedi**; Vermeer pilotu Q167605 **dokunulmadı**.
- Uygulama kodu ve `data/` **değiştirilmedi** (uyuşmazlıklar veri notu olarak onaya sunuldu).
- `main`'e merge **yok**; deployment/yayın **yok**. Yalnız `content-review` branch'ine commit/push.
- Hiçbir eser otomatik "Yayına aday" yapılmadı; durum "İnsan incelemesi bekliyor".

## 10. İnsan incelemesi gerektiren noktalar (özet)

1. **Görsel teyidi (18 eser, E):** vision bütçesi tükendi; GZ TASLAK; insan editör görseli inceleyip observation sorularını kesinleştirmeli.
2. **Birincil teyidi (Hermitage, Stuttgart):** URL bulunamadı; künye B/E; insan editör birincil katalog teyidi.
3. **D ihtilafları:** tarih/teknik/boyut/ikonografi/orijinallik (her eser KALITE_KONTROL.md'de envanterli).
4. **data/ düzeltmeleri:** §6 uyuşmazlıkları insan onayıyla `data/`'ya uygulanmalı (bu turda dokunulmadı).
5. **Felsefi yorumlar:** İleri §7 ödünç çerçeveler (Kant/Benjamin vb.) editör onayı.
6. **Haricî denetim:** bu tur aynı asistan + alt-agent'larca yapıldı; üçüncü taraf/insan editör denetimi ayrıca gerekli (otomatik testler olgusal doğruluğu garanti etmez).

## 11. Kalıcı altyapı notu

- `.qwen/agents/kaynak-arastirma.md` + `.qwen/agents/ders-yazim.md` özel agent'ları bu partide kullanıldı (araştırma + yazım işbölümü).
- `.qwen/tmp/parti2/` altında brief'ler, `gen.py`, `uret-*.py`, `metrics.py` (üretim araçları; repo içeriğine dahil değil).
- Erotik konular (Titian, Correggio, Giulio) akademik ve açık ayrıntısız betimlendi; iki agent içerik filtresine takıldığı için bu eserler ana oturumda yazıldı.

**Sonraki adım:** Parti 3 (MUFREDAT #32 Veronese + M7 + M8 pilot-hariç + M9 ilk 4). DURUM.md "Kesintide Devam" protokolü izlenir.