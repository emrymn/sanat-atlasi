# ÜRETİM NOTU — RESİM TEKNİKLERİ EK2 (tek-b)

**Tarih:** 2026-11-15 · **Üreten ajan:** `ansiklopedi-madde-yazim` (bağımsız denetim değildir)
**Kapsam:** YALNIZ TEK-004. TEK-005 (`wasli`) başka bir ajanda; bu dosyaya yazılmadı.

---

## TEK-004 · murekkep-resmi (`resim-teknikleri/TEK-004-murekkep-resmi.json`)

**Konu:** Doğu Asya mürekkep resmi — Çin shuimohua / Japon suibokuga (kategori: `murekkep-teknikleri`).

### İddia sayıları ve dağılım
- Toplam claim: **8** (brief'teki 22 aday iddiadan omurga seçildi; üst sınır 8).
- Tür dağılımı: TEKNIK_TANIM 6 (C001–C006) · TARIH 2 (C007, C008) · OLGU/YORUM/HIPOTEZ/GELENEKSEL_ANLATI 0.
  - Not: YORUM ve GELENEKSEL_ANLATI niteliğindeki brief adayları (Hearn'ın "renk reddi" genellemesi, Wang Wei "ilk ressam" anlatısı, "ma/yohaku" kavramı) iddiaya dönüştürülmedi; `akademik_tartismalar` içinde **sahibine atıfla** bırakıldı.
- Doğrulama durumu: **DOGRULANDI 6 · KISMEN_DESTEKLENIYOR 0 · DOGRULANAMADI 0 · CELISKILI 2 (C004 "beş renk" listesi, C008 dönem/sanatçı tarihleri) · HATALI 0.**
- `dogrulama_durumu` özeti claims sayımıyla birebir; `yayin_durumu`: `BAGIMSIZ_DENETIM_BEKLIYOR`; `son_guncelleme`: `2026-11-15`.

### Kaynaklar
- Madde kaynak listesi: **16 kayıt** (brief envanteri K01–K13 + 3 erişilemeyen/bibliyografik kayıt K14–K16).
- Okunan ve iddiaya dayanak olanlar: K01, K11 (Wayback — Met canlı 429), K02, K03, K04 (Wayback — Britannica canlı 403), K08 (Wayback — Smithsonian canlı 403), K05 (e-Museum, canlı), K06 (Taipei NPM, canlı), K07 (Pekin Palace Museum, canlı), K09 (Asian Art Museum PDF, canlı), K10 (Met Collection API, canlı), K12 (JAANUS, canlı).
- **Erişilemeyen / dayanak yapılmayan:** K13 Hasanova 2026 (okundu ama tek + düşük profilli kaynak → hiçbir iddiaya dayanak yapılmadı, yalnız `akademik_tartismalar` 7'de YORUM olarak anıldı); K14 Smithsonian pigment çalışması PDF (301→403); K15 Stanley-Baker 2004 (403; Wayback yalnız künye); K16 bibliyografik kitap kümesi (Silbergeld 1982 · Barnhart vd. 1997 · Hearn 2008 — metinlerine erişilmedi).
- Brief'te erişilemediği bildirilen ama ayrı kaynak kaydı açılmayanlar (madde `akademik_tartismalar` 8'de anıldı): Chou 2011 Lingnan tezi, Kyoto National Museum İngilizce koleksiyon sayfaları, Taipei NPM tema mikrositeleri, Ma Yuan/Xia Gui eser kayıtları.
- Wikipedia (brief K14 satırı) kanıt olarak kullanılmadı; kaynak listesine alınmadı.

### Brief yetersizliği nedeniyle YAZILMAYAN bölümler
1. **Xuan / washi kâğıt türleri** — birincil/akademik kaynak açılamadı; madde "emici el yapımı kâğıt" düzeyinde kaldı.
2. **İpek hazırlığı (astarlama/sizing)** — kaynak setinde bilgi yok.
3. **Kore geleneği** — yalnız aktarım zinciri (Çin → Kore → Japonya) doğrulandı; ayrı bölüm/örnek açılmadı.
4. **"Beş renk"in sabit listesi** — K07 açıkça "görüşler farklı" der; tek liste YAZILMADI (C004 CELISKILI).
5. **Wang Wei "ilk mürekkep ressamı" iddiası** — K09 ile K12 çeliştiği için anlatı düzeyinde bırakıldı, kesin anlatıya dayanak yapılmadı.
6. **"ma / yohaku" kavramı** — kurum kayıtlarında terim yok; tek kaynak (K13) → olgu gibi yazılmadı, `akademik_tartismalar` 7'de yazar atfı + tarih yazımı ihtiyatıyla duruyor.
7. **Ma Yuan örneği** — birincil müze kaydı açılamadı → doğrulanmış örnek listesine alınmadı.
8. **Mürekkep çubuğu üretim reçeteleri (çam isi/tutkal oranı)** ve bölgesel üslup ayrıntıları — kaynak yok.
9. Sembolik okumalar (çam = dayanıklılık, nergis = sadakat vb.) teknik maddesine alınmadı; IKO maddelerinin konusu.

### Doğrulanmış resim örnekleri (4 — farklı gelenek/format)
Fan Kuan, *Travelers Among Mountains and Streams* (Taipei NPM, ipek + asılı tomar, cunfa: yudian cun) · Sesshū Tōyō, *Haboku Sansui* (TNM A-282, kâğıt + tomar, haboku/hatsuboku) · Liang Kai, *Poet strolling by a marshy bank* (Met 1989.363.14, ipek + yelpaze/albüm yaprağı) · Sesson Shūkei, *Gibbons in a Landscape* (Met 1992.8.1,.2, kâğıt + altı panelli çift paravan). Brief'teki 14 adaydan seçildi; hepsi birincil kurum kaydına bağlı (`kaynak_id` + `baglam` dolu).

### Çapraz bağlar
- **Eklenen:** `NES-003` (hokka-fırça) — diskte var (glob ile doğrulandı), bağ brief §7/15 ve malzeme zinciri kanıtıyla destekli.
- **Eklenmeyen (planlı):** `TEK-005` — yazım başlarken diskte yoktu (doğrulama koşusu sırasında başka ajanın dosyası belirdi); brief §7/15 farklı gelenek ve farklı malzeme zinciri olduğu için doğrudan bağ kurulmamasını önerdiğinden bağ EKLENMEDİ. **Birleştirme turunda ana oturum karar verebilir** (üst bağlam: minyatür/el yazması resimleme teknikleri).
- **Eklenmeyen (kaynak desteği yok):** `TEK-001`, `TEK-002`, `TEK-003` diskte var ama brief'te bu maddelerle bağ kuracak kaynak yok; `IKO-003` (Çin ejderhası) için ejder konulu mürekkep resmi örneği doğrulanmadı.

### dogrula.py sonucu
```
.qwen/tmp/venv-dogrula/bin/python resim-ansiklopedisi/dogrula.py --dosya resim-ansiklopedisi/resim-teknikleri/TEK-004-murekkep-resmi.json
→ 0 HATA · 4 UYARI (exit 0)
```
- Uyarıların 4'ü de "hiçbir iddia bu kaynağı kullanmıyor": **K13** (okundu, kanıt düzeyi yetersiz → yalnız tartışma alanında), **K14/K15/K16** (ERISILEMEDI / bibliyografik). Bilinçli; şeffaflık için listede tutuldular.
- CJK uyarısı yok (Çin/Japon karakterleri yalnız `ozgun_ad` ve `alternatif_adlar` alanında); "etiketsiz olgusal cümle" uyarısı yok.
- `dogrula.py --test`: **23/23 geçti** (betik ve testler değiştirilmedi).

### Kalan insan-inceleme noktaları
1. "Beş renk" için ikinci kurumsal/akademik kaynak (K14 erişilemedi).
2. "ma/yohaku" kavramının tarih yazımı için bağımsız akademik kaynak (K13 tek ve düşük profilli).
3. Wang Wei önceliği iddiasının erken dönem eser/kanıtıyla sınanması.
4. Met kaynaklarının (K01, K11) aynı kurum olması → Çin tarafı için Met dışı ikinci uzman kaynağının güçlendirilmesi.
5. Atıf dili: Met API düz sanatçı adı verirken küratoryal metinler "Attributed to" diyor — yayın öncesi her örnek kaydının en ihtiyatlı dille yazıldığı insan gözüyle kontrol edilmeli.
6. `kaynaklar/KAYNAK_KUTUGU.json` kayıtlarının ana oturumda eklenmesi (bu ajan kütüğe, DURUM.md'ye ve GENEL_RAPOR'a dokunmadı).
