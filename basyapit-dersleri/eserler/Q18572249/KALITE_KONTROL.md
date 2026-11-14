# KALİTE KONTROL — Q18572249 · Aziz Thomas'ın Şüphesi (L'Incrédulité de saint Thomas) · Francesco Salviati

**Tarih:** 14 Kasım 2026 · **Parti:** 2 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ (ham cache üzerinden; canlı yeniden-fetch sınırlı) · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti2/Q18572249-brief.md`); ham cache'ler `.qwen/tmp/parti2/Q18572249-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Derslerin olgusal cümleleri `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q18572249 için temiz.
- **Toplam iddia:** 40 (C001–C040). **A=18, B=3, C=7, D=5, E=7.**
- **A düzeyi:** Louvre notice HTML+JSON (S08/S09) + Joconde POP (S10) + 2016 arşiv (S16): başlık, atıf, yüzyıl/çeyrek, sipariş, teknik/transposition, boyutlar, envanter, mülkiyet, salon, köken, imza, sujet, otoportre kaydı, gravür/kopya, sergi, notice güncelleme metadata'sı.
- **B düzeyi (kaynak zinciri notuyla):** 1543–1547 (Elsig 2014 p.22), anti-Medici yorumu (Virassamynaïken 2015 p.208 + Donato 2013), Vasari/Lyon alımlaması (Elsig 2014 p.10) — kitap metinlerine erişilmedi.
- **C düzeyi "(yorum)" işaretli:** frwiki betimi (C017), Master CC (C021), popülerlik anlatısı (C022), PD (C024), WD 1537 (C025), WGA arşiv (C026), enwiki atıfsız sipariş cümlesi (C027).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B kanıtlı** (programatik kontrol: A/B dışı 0); 5 AU serbest (C/D/E dahil). Çeldirici gerekçeleri bağlamsal; totoloji yok. Doğru cevaplar D/E'ye dayanmaz; yorum tek doğru cevap yapılmadı.
- **D/E işareti:** 5 D "(tartışma)" (C029–C033), 7 E "(belirsiz)" (C034–C040) post-pass ile tüm derslerde; işaretsiz D/E kullanımı 0.
- **GZ TASLAK:** görsel incelenmedi → gen.py gz_taslak otomatik (5/5 ipucu TASLAK önekli).
- **Dolgu/tekrar:** yakın tekrar ve seviyeler arası birebir ortak uzun cümle kontrolleri temiz (eşik altı); kelime hedefleri karşılandı, bilgi eklenerek uzatma yapılmadı.

## 2. Denetim B — Kaynağa geri dönüş

Bu oturumda brief'in ham cache'leri **bağımsız turda yeniden açıldı** ve iddialarla karşılaştırıldı (2026-11-14):
- `Q18572249-louvre-ark.json` (S09): başlık, atıf, "XVIe siècle (1500 - 1600)", boyutlar (2,75/2,34 + accessoire 3,25/2,78), INV 593/MR 472, Etat, Salle 712, objectHistory (1790/1794), exhibition 1998, **description/inscriptions BOŞ**, modified 2026-08-11, RMN telifli görseller ✓.
- `Q18572249-joconde-pop.txt` (S10): "2e quart 16e siècle", "commandé vers 1547 par Tomaso Guadagni…", "transfert (bois 1806)", "daté ; signé" + "FRANCESCO SALVIATO FLO. OPUS (S.B.D.)", sujet (Apparition à Thomas… portrait, ?; autoportrait en buste de trois-quarts), "gravé par un anonyme et par Landon en 1832… attribuée à tort à Vasari… San Marcello de Rome", "1794 Entrée matérielle", clergé ✓.
- `Q18572249-enwiki.json` / `Q18572249-frwiki.json` (S02/S03): 1543–1547 (Elsig ref), Gadagne/Guadagni, anti-Medici (Virassamynaïken/Donato ref), Vasari (Elsig p.10), Master CC (BnF raf), frwiki Description + "serait" + "Notice du Louvre" ref'i ✓.
- `Q18572249-wga-wayback-20160305.txt` (S18): "1543-47", "Oil on wood transferred to canvas, 275 x 234 cm", "Tommaso Guadani", funerary chapel, altarpiece ✓.
- `Q18572249-wikidata.json` (S01): P571 "+1537" precision=7 + P1319/1326 1525/1550; P186 oil paint + canvas (support); P18 dosya; P6216/P459; P217 INV 593/MR 472; sitelinks en/es/fr/commons (it YOK) ✓.
- `Q18572249-commons-imageinfo.json` / `-others.json` (S05/S14): ana dosya 1028×1200 PD, credit WGA, DateTimeOriginal "between 1543 and 1547"; Shonagon 2765×3231 PD; Sailko 5 dosya CC BY-SA 3.0 ✓.

**Sınır beyanı:** Canlı URL'ler bu oturumda yeniden fetch edilmedi; doğrulama, araştırma agent'ının aynı gün (2026-11-14) çektiği ham cache'ler üzerinden yapıldı. Bu, §11'in "bağımsız tur" koşulunu cache düzeyinde karşılar; canlı erişim + haricî model/insan editör denetimi ayrıca gereklidir ve **bekliyor** olarak işaretlidir.
- **Beş ihtilaf D:** C029 (tarih; WD referansında 1537 yok), C030 (WD teknik eksikliği), C031 (ad varyantları), C032 (Notice du Louvre atıf zinciri kopuk), C033 (önceki denetim "uyumlu" çelişkisi).
- **Belirsizlikler aynen korundu:** "vers 1547", "serait", "portrait, ?", "daté ; signé" (tarih yok), "susceptibles de ne pas être à jour", "Le contenu de cette notice ne reflète pas nécessairement le dernier état des connaissances", WD precision uyuşmazlığı.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft2020-12 AKTİF): **Q18572249 için 0 hata / 0 uyarı.** CJK taraması: **0.**
- Not: Tam çalıştırmadaki 9 hata / 67 uyarının tamamı **öteki eserlere** aittir (Q1863885, Q23008305, Q2472983, Q3705703 eksik dosya hataları + öteki derslerin kelime/tekrar uyarıları); bu oturumda o dizinlere dokunulmadı.
- DERS.json + SORULAR.json şema geçerli; bolum_eslesme 12/12; durum "İnsan incelemesi bekliyor"; gorsel.dogrulama.incelenen_bolgeler=[] (incelenmedi).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 424 | 400–500 | 3 dk |
| Orta | 1334 | 1300–1600 | 10 dk |
| İleri | 2805 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; D/E post-pass işaretleri dahil nihai ölçüm (DERS.json ile birebir).

## 5. Görsel doğrulama (Kural 6)

- **Görsel İNCELENMEDİ (C039 E):** vision bu oturumda kullanılmadı; yalnızca metadata + lisans + çözünürlük.
- Ana dosya (Commons, WGA kredili) 1028×1200 px, PD-Art — zayıf; `zayif_eserler.csv` ile uyumlu. Alternatif: Shonagon 2765×3231 PD (önerilir); Sailko 5 dosya CC BY-SA 3.0.
- Louvre/RMN görselleri **telifli** (© 1997 GrandPalaisRmn / Daniel Arnaudet; © 2004 Musée du Louvre / Angèle Dequier); serbest değil → yeniden yayımlanmadı, projeye kopyalanmadı; URL + lisans + kaynak referans.
- Kompozisyon yalnızca **kaynak betimi**: Joconde sujet (A) + frwiki Description (C, atıfsız). data/ hotspot/renk iddiaları (E009) doğrulanmadı. **GZ TASLAK (5/5).**

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C039/C038, E):** vision incelemesi ana oturumda; özellikle data hotspot'ları (kızıl saçlı Thomas, pembe-mor örtü, cangiante, silik haleler, kitaplı figür) ve "tiyatro havası" renk cümlesi; GZ TASLAK'larının gerçek gözleme dönüştürülmesi.
2. **Tarih (C029, D001):** data/WD "1537" ↔ birincil kaynaklar; WD referans zinciri boşluğu + precision uyuşmazlığı; data düzeltme önerisi insan onayına.
3. **Otoportre (C034, E002/E006):** Joconde kesin kayıt ↔ frwiki "serait" ↔ figür kimliği eşlenmemiş; hangi havari olduğu görsel + literatürle belirlenmeli.
4. **Atıf zinciri (C032, D004):** wiki "Notice du Louvre" ref'i ↔ güncel notice'ta boş alanlar; Louvre'a bilgi talebi değerlendirilebilir.
5. **B literatürü (C006/C018/C019 + C040):** Elsig 2014, Virassamynaïken 2015, Donato 2013, Pomarède 2005, Monbeig-Goguel 1998, Miller 1998 metinlerine erişilmedi; B iddiaları kaynak zinciri notuyla sunuldu.
6. **"daté ; signé" boşluğu (C036, E005):** tarihli olduğu iddiası ↔ transkripsiyonda tarih yok; "S.B.D." açılımı bilinmiyor.
7. **Ad varyantları (C031, D003):** Gadagne/Guadagni/Guadani + şapel adı; tek ad standardı seçilirse dipnot gerekir.
8. **Salon güncelliği (C035, E003):** Salle 712 bilgisi güncel olmayabilir; Louvre sitesi uyarısı.
9. **Telif:** Louvre/RMN görselleri serbest değil; Commons PD dosya zayıf — yüksek çözünürlüklü PD alternatif (Shonagon) editör kararı.
10. **Felsefi yorumlar (İleri §7, C):** şüphe/dokunma/tanıklık okuması açıkça yorum; sanatçı-etki iddiası yok; editör onayı.
11. **Önceki denetim işaretleri (C033, D005):** denetim-asama3 "1537 … uyumlu" ve ders_kaynaklari "dogrulandi" işaretleri ham kaynakla çelişiyor; güvenilmemeli.

## 7. Yayına adaylık

Otomatik kısım sağlandı: şema ✅, çapraz tutarlılık ✅, quiz A/B ✅, kelime ✅, CJK 0, D/E işaretleri ✅. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.**
- Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez (dogrula.py semantik sınır beyanı).
- Birincil kaynaklar AÇILDI (A); ancak görsel İNCELENMEDİ (E) ve B düzeyi literatürün metinlerine erişilmedi (E). Denetim B bu oturumda ham cache üzerinden yapıldı; canlı yeniden-fetch + haricî model/insan editör denetimi **bekliyor**.
- Görsel teyit ve §6'daki noktalar tamamlanmadan yayımlanmamalıdır.
