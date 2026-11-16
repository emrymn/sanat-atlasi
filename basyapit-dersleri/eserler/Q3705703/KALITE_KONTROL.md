# KALİTE KONTROL — Q3705703 · Pontormo, *trasporto di Cristo al sepolcro* (Capponi Şapeli, Santa Felicita, Floransa)

**Tarih:** 14 Kasım 2026 · **Parti:** 2 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ (aynı asistan; haricî denetim ayrı) · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i `.qwen/tmp/parti2/Q3705703-brief.md`; ham cache `.qwen/tmp/parti2/Q3705703-*`.
**Üretim:** `.qwen/tmp/parti2/uret-Q3705703.py` → `DERS.json` + `SORULAR.json` (gen.build; cs_gerekce_iyileştir + gz_taslak otomatik).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

- **Toplam iddia:** 90 (C001–C090). **A=8 · B=48 · C=5 · D=14 · E=15.** KANIT §2'deki her `**C###**` tanımı DERS.json `iddialar` ile birebir eşleşir; dogrula.py çapraz kontrolü temiz (tanımsız etiket / bilinmeyen kaynak / mükerrer kimlik yok).
- **A düzeyi yalnız birincil katalogdan:** Polo Museale Fiorentino scheda'sı (N. Cat. 00156026) → yazar, resmî başlık, envanter, boyut, "Firenze", hami/1525 satın alma notu, Vasari'nin "üç yıl" ifadesi, fotoğraf arşivi künyeleri (C001–C008).
- **Birincilin sessizliği açıkça beyan edildi:** scheda'da tarih ve teknik/destek alanı yok; şapel/sunak/çerçeve ayrıntısı yok. Bu yüzden tarih B+D (C011/C062), teknik B+D+E (C020/C063/C084). Tam storico-critico metin erişilemedi (C083, E).
- **Olgusal cümleler `[C###]` ile bağlandı;** yorum cümleleri "(yorum)" + C düzeyi (C057–C061; ayrıca kaynakta raporlanan hipotezler C051–C053 "yorum" kullanımıyla). D cümleleri "(tartışma)", E cümleleri "(belirsiz)" işaretli — post-pass ile otomatik, dogrula belirsizlik denetimi temiz.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B kanıtlı** (otomatik tarama: A/B dışı kanıt 0). 5 AU serbest (C/D/E dahil). Doğru şıklar dengeli dağıtıldı: A, D, C, B, A, D, C, B, A, D. Her yanlış seçeneğin **bağlamsal gerekçesi** var (totoloji yok; çeldiriciler aynı şapelin gerçek kişi/numara/tarihlerinden seçildi: SBAS FI/Alinari/Brogi fotoğraf künyeleri, Brunelleschi/Stagi/Marcillat, 1525/1528/1736–39).
- **Quiz doğru cevapları D/E'ye dayanmıyor:** ad/konu (D3), tarih (D1), teknik (D2), otoportre (E1), taşıyıcı kimliği (E2) soru konusu yapılmadı; CS04 tekniği **bültenin açık ifadesine** (B) dayandırır, CS08 vitray tarihini **Waldman'ın belgeli ifadesine** (B) dayandırır ve ihtilaf yalnızca çeldirici gerekçesinde anılır.
- **Kelime tutarlılığı:** DERS.json `kelime_sayisi` = dosyadan ölçülen (486 / 1411 / 3158); `bolum_eslesme` 12 bölüm, tüm çapa hedefleri gerçek başlıklarla eşleşiyor.
- **GZ TASLAK:** `incelenen_bolgeler = []` → gen.gz_taslak beş sorunun ipucuna "TASLAK (görsel bu oturumda incelenemedi…)" ön ekini ekledi.
- **§8 dolgu/tekrar:** yakın tekrar ve seviyeler arası birebir cümle denetimleri temiz (0 uyarı); üç seviye farklı derinlikte kurgulandı (başlangıç kimlik+betim, orta analiz+teknik, ileri yöntem+ihtilaf envanteri+felsefi yorum).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Brief'teki ham cache'ler yeniden okundu **ve iki kaynak ders turunda canlı olarak yeniden çekildi** (yalnız taslağı okumakla yetinilmedi):

| Kaynak | Yeniden erişim (2026-11-14) | Karşılaştırılan alan | Sonuç |
|---|---|---|---|
| S4 birincil scheda (Wayback 20240214175157) | **HTTP 200, 22.662 bayt** (`.qwen/tmp/parti2/Q3705703-dogrulaB-scheda.html`) | `N. Cat. 00156026`, `Pontormo`, `trasporto di Cristo al sepolcro`, `dipinto`, `Firenze`, `(Altezza per Larghezza) 313 x 192`, fotoğraf künyeleri, `nscTroncato` | Birebir doğrulandı; tarih/teknik alanı **yok** (E10 teyit); `&#242;a cappella` entity artefaktı [sic] not edildi |
| S7 FoF Deposition proje sayfası | **HTTP 200, 234.428 bayt** (`…-dogrulaB-fof-deposition.html`) | "six poplarwood planks … three original (probably) larchwood cross-pieces", "stage set hill", "strongly vertical … gazing upwards", "It is not clear whether…", "supposed self-portrait … turban and a simple scarf", "1936 … Paris … Vermeghen … 1935", tondolar "2013" | Birebir doğrulandı; D9 (2013 ↔ 2010) ve D11 (turban ↔ bere) teyit |
| S9/S10 PDF metinleri | cache'ten yeniden okundu (pypdf) | Rapino'nun 1526 siparişi, 1528 bitiş, Pietà adanışı, Baccio d'Agnolo çerçeve, 1766 kubbe + Stagi c.1780, 1966 seli + fiberglass, "tempera mixed with egg whites, not with oils", pentimenti, 28 Mart 2018 açılış, ~105.000 €, Brunelleschi kubbe kaidesi bulgusu | Doğrulandı; D8 (27 Şubat ↔ Mart) açık |
| S11 Waldman (2006 arşivi) | cache'ten yeniden okundu; **yalnız 1/15 sayfa** | 1487/1525 + 200 florin, Annunciation→Pietà, vakfiye, 30 Temmuz 1527 vasiyetname, Vespucci, vitray "Eylül 1526 … only securely dated work", paliotto, Balocchi tartışması | Doğrulandı; devam sayfaları + App. 1 doc. 5/7 görülmedi (C088, E) |
| S2/S3 wikitext | cache'ten yeniden okundu | circa 1525–1528 ↔ "1526-1528 circa", "No cross is visible", "undici personaggi" + Venturi, "forse" otoportre, "(la Maddalena?)", Natali aktarımı, Cianchi'nin Maniyerizm daraltması, citation-needed kümesi | Doğrulandı; D1/D3/D5/D6 ve E1/E3/E7/E8 açık |
| S1 EntityData / S5 Commons imageinfo | cache'ten yeniden okundu | P571 precision 9 + P1319/P1326; P186 oil paint + canvas (P518); P2242 "00156026"; P2048/P2049; P6216 PD; 3 dosya çözünürlük/bayt/lisans/credit | Doğrulandı; D2 ve E11 (zayıf referanslar) açık |
| S14 kilise sitesi / S4b tam metin | brief erişim kayıtları | park sayfası / boş kabuk; 404 + snapshot yok | İçerik yok → birincil aday değil (C089), tam metin E (C083) |

**Sonuç:** künye çekirdeği A; anlatı/teknik/ikonografi B; 14 ihtilaf D ve 15 belirsizlik E olarak korundu, hiçbiri kesinleştirilmedi. **Sınır:** bu tur aynı asistan + agent araştırmasıyla yapıldı; AKADEMIK_STANDART §11'in istediği **haricî model/insan editör denetimi ayrıca gereklidir** ve "bekliyor" olarak işaretlidir.

## 3. Şema ve biçim

- `dogrula.py` (mini yorumlayıcı + **jsonschema Draft 2020-12 AKTİF**, izole `.qwen/tmp/venv-dogrula`): **Q3705703 → 0 hata, 0 uyarı.**
- Üretim sırasında düzeltilenler: (1) ILERI'de "S. Giovanni" kısaltmasının cümle bölücüyü tetikleyip oluşturduğu **etiketsiz olgu uyarısı** → ifade "evangelist Yuhanna" olarak yazıldı, uyarı giderildi; (2) doğru şıkların tamamının A'da toplanması → seçenek döndürme ile A/D/C/B dağılımı; (3) post-pass sonrası kelime sayılarının yeniden ölçülmesi (build ikinci kez çalıştırıldı).
- **CJK taraması: 0** (6 dosyanın tamamı; U+3000–30FF, U+3400–4DBF, U+4E00–9FFF, U+F900–FAFF, U+FF00–FFEF, U+AC00–D7AF).
- Repo genelindeki hatalar **bu esere ait değil**: Q1863885 (2), Q23008305 (209), Q94802 (2) — eksik dosya/üretim devam ediyor; bu turda o dizinlere dokunulmadı. `data/`, uygulama kodu, main, Vermeer pilotu (Q167605) ve öteki eserler değiştirilmedi; commit/push/deploy yapılmadı.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef (§8) | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 486 | 400–500 | 3 dk | ✅ aralık içinde |
| Orta | 1411 | 1300–1600 | 10 dk | ✅ aralık içinde |
| İleri | 3158 | 2600–3200 | 20 dk | ✅ aralık içinde |

Ölçüm `gen.py → kelime()` ile (etiketler ve biçim işaretleri hariç). Hedeflere ulaşmak için bilgi eklenmedi; ileri dersin derinliği kaynak zenginliğinden (kurumsal restorasyon belgeleri + Waldman + iki wikitext) geliyor. Kanıtı olmayan başlıklar (ör. sanatçının psikolojisi, kesin tarih, kesin teknik A düzeyi) boş/şartlı bırakıldı.

## 5. Görsel doğrulama sınırı (§6)

- **Görseller İNCELENMEDİ.** Yalnız Commons imageinfo (url/size/extmetadata) kullanıldı; `gorsel.dogrulama.incelenen_bolgeler = []`.
- Dosyalar: `Kreuzabnahme Christi.jpg` 3014×4834 (12.204.713 bayt; Taschen 2007 kitap taraması) · `WGA18113.jpg` 900×1480 (741.170) · `WGA18113 (cropped).jpg` 843×1392 (812.675; data'nın ana görseli). Üçü de **Public domain** (PD-Art; AttributionRequired false); gerekçe: yazar ölümü 1557, 100 yıl pma veya kısa (S1 P6216 + P1001/P459).
- **Reproduksiyon farkı beyan edildi:** kitap taraması ↔ WGA fotoğrafı ↔ kırpılmış dosya farklıdır; hangisinin restorasyon sonrası durumu gösterdiği metadata'dan kesinleştirilemedi. FoF fotoğrafları (Antonio Quattrone, 2017–18) ayrı bir katmandır ve bu derste kullanılmadı.
- Kompozisyon/ikonografi/renk cümleleri **"kaynakların betimlediği"** biçiminde ve S2/S3/S7/S9/S10 metnine dayanır; doğrudan gözlem iddiası yoktur. Görsel projeye kopyalanmadı, derslerde URL + lisans + kaynak referansı verildi.
- **GZ TASLAK** (5/5). PD-Art notu: Commons, iki boyutlu PD eser reproduksiyonlarının PD olduğunu belirtir; diğer yargı bölgelerinde yeniden kullanım kısıtlı olabilir (Commons "Reuse of PD-Art photographs") — yayın kararı insan editöre aittir.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C086, E):** hiçbir görsel incelenmedi; GZ TASLAK. Özellikle D6 (zemin/bulut: data "yalnızca sol üstte tek bulut" ↔ S2 "gölgeli zemin parçası + kırışık örtü" ↔ S7/S10 yapay tepe) ve E6 (data hotspot "kemerli çerçeve", bakış yönleri, renkler) görselle çözülmeli.
2. **Teknik ihtilafı (C063, D2):** "oil on panel"/"canvas" (Smarthistory 2014 + WD Commons importu) ↔ yumurta temperası + kavak tabla (2018 kurumsal belgeler). Birincil katalogda teknik alanı yok → A düzeyi yok (C084). Bilimsel analiz raporunun kendisi istenmeli; data'ya teknik alanı eklenecekse bu ihtilaf notla girilmeli.
3. **Ad/konu (C064, D3):** resmî "trasporto di Cristo al sepolcro" ↔ "Deposizione (erroneamente)" ↔ "Deposition" ↔ "Entombment" ↔ "Pieta". data başlığı "Çarmıhtan İndiriliş" tartışmanın tarafı; başlık/ozgun alanı kararı editöre.
4. **Tarih (C062, D1) ve sipariş yılı (C065, D4):** c.1525–1528 ↔ "1526-1528 circa" ↔ "completed in 1528" ↔ data "1525"; sipariş 1525 ↔ 1526. data'nın tek yıl alanı aralığa çevrilmeli (veri notu 1).
5. **Otoportre (C076, E1 + C072, D11):** "forse"/"Legend has it"/"supposed" ↔ bültenin kesin ifadesi; alternatif İsa ve S. Giovanni hipotezleri (S. Rossi 2012, erişilmedi); betimler (turban ↔ bere ↔ yeşil başlık ↔ data "kahverengi") uzlaştırılmadı. Görsel + literatür teyidi gerekli.
6. **Taşıyıcıların kimliği (C077, E2) ve Maddalena (C078, E3):** "perhaps angels" / "interpretati come angeli" / "(la Maddalena?)" — kesinleştirilmedi.
7. **Maniyerizm etiketi (C066, D5) ve alımlama (C068, D7):** kurumsal "primo manierismo" ↔ Cianchi'nin "capolavoro eccentrico a sé stante" tezi; 19. yy ↔ 20. yy vurgusu. data'nın "Maniyerizm başyapıtı" çerçevesi tartışmalı olarak sunulmalı.
8. **Birincil kaydın tamamlanması (C083/C089, E):** canlı katalog 522, `NscCompleto` 404, kilise sitesi park sayfası. Kurumdan güncel scheda/tam metin istenmesi önerilir; kilisenin kendi kaydı bulunamadı.
9. **Literatür (C087/C088, E):** Cianchi, Marchetti Letta, De Vecchi, Natali, S. Rossi, Smyth/Cheney, Vasari, Steinberg metinlerine erişilmedi; Waldman'ın 15 sayfasının yalnız 1'i okundu. Alıntılar yalnız erişilen kayıtların aktarımlarıdır; doğrudan alıntı/sayfa uydurulmadı.
10. **Küçük ihtilaflar (D8–D14):** restorasyon başlangıcı (27 Şubat ↔ Mart 2017), tondo restorasyonu (2013 ↔ 2010), vitray (c.1525 ↔ belgeli Eylül 1526), Capponi'nin mimari müdahalesinin kapsamı, sanatçı ölüm yılı (1557 ↔ yetke kaydında 1556), Ruggieri (1735 ↔ 1736–39).
11. **Felsefi yorumlar (C061, C):** İleri §7'deki Kant/Benjamin ödünç çerçeveleri kurum dışıdır; sanatçıya etki iddiası yoktur; editör onayı gerekir.
12. **Veri notları (KANIT §5, 11 madde):** data dosyaları değiştirilmedi; tarih alanı, boş lisans alanı, "kemerli çerçeve" hotspot'u, kaynak zincirine birincil katalog eklenmesi önerileri insan onayına sunulur.

## 7. Yayına adaylık (§12)

| Ölçüt | Durum |
|---|---|
| Temel kimlik ve atıf doğrulanmış | ✅ birincil scheda (A) yeniden açıldı; tarih/teknik birincilde yok → B/D/E beyanlı |
| Tüm olgusal cümleler kanıt kayıtlı | ✅ Denetim A + dogrula çapraz kontrolü temiz |
| Görsel analiz doğru eser/görselle yapılmış | ❌ **görsel incelenmedi** → GZ TASLAK; insan teyidi zorunlu |
| Yorumlar olgulardan ayrılmış | ✅ C düzeyi + "(yorum)"; D "(tartışma)", E "(belirsiz)" |
| Quiz cevapları doğrulanmış iddialara dayanıyor | ✅ CS/DY/GZ/TK yalnız A/B; D/E'ye dayalı doğru cevap yok |
| Kaynak bağlantıları erişim durumlarıyla kayıtlı | ✅ 18 kaynak; HTTP kodu + arşiv tarihi + erişilemeyenler |
| Ciddi çelişkiler açıkça belirtilmiş | ✅ 14 D + 15 E; oil↔tempera ve ad/konu öne çıkarıldı |
| Denetim A + B tamamlanmış | ✅ (B aynı asistan; **haricî model/insan editör denetimi BEKLİYOR**) |

**Durum: "İnsan incelemesi bekliyor" — "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler, olgusal/semantik doğruluğu garanti etmez. Görsel inceleme (vision kotası ana oturumda) ve haricî editoryal onay tamamlanmadan yayın kararı verilmemelidir.
