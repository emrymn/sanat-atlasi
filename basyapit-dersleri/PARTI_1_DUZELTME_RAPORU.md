# PARTİ 1 — TOPLU DÜZELTME RAPORU

**Tarih:** 14 Kasım 2026 · **Depo/dal:** `emrymn/sanat-atlasi` · `content-review`
**Girdi:** `PARTI_1_CLAUDE_DENETIM.md` (Claude bağımsız akademik denetim, 3 derin + 20 yapısal)
**Kapsam:** Parti 1'in 20 eseri (Vermeer pilotu Q167605 **değiştirilmedi**). Uygulama kodu ve `data/` **değiştirilmedi**.
**Yöntem ilkesi:** Claude bulguları **kör kabul edilmedi**; her kritik/yüksek bulgu ham kaynakla (Met API, Brera, Uffizi, en/it Wikipedia wikitext, Nietzsche birincil metin) yeniden doğrulandı. Doğrulanamayan içerik uydurulmadı; gerekirse ders kısa bırakıldı / quiz maddesi çıkarıldı.

---

## 1. Düzeltilen KRİTİK (P0) bulgular

| Bulgu | Eser | Doğrulama | Düzeltme |
|---|---|---|---|
| **K-1** yanlış Met nesne URL'si | Q1755464 Dürer | Met API `objects/336420` = "A Death Scene", anonim 17. yy İspanyol çizimi (80.3.507) — Dürer DEĞİL. Doğru nesne `objects/336223` = "Knight, Death, and the Devil", 43.106.2, 1513, engraving, levha 24.3×18.8 / kâğıt 25×19.6 (200). | K4 URL düzeltildi; birincil künye **C003 A**. "Birincil katalog erişimi yok / A yalnız lisans" ifadeleri kaldırıldı. Nüsha boyut farkları (377282: 24.5×19; 391255: 24.7×18.9; WD 24.8×19) levha/kâğıt ayrımıyla açıklandı. |
| **K-2** Mantegna "Brera 404" yanlış negatif | Q546297 Mantegna | Hedef URL `opere/cristo-morto` uydurma yol; doğru kayıt `collezioni/collezione-on-line/cristo-morto-nel-sepolcro-e-tre-dolenti/` **200**. "1483 circa", 68×81, Inv.352, tempera su tela, Sala VI + provenance metni. | C003–C007, C028 **A**. Tarih "Brera c.1483"; **"data 1483→aralık" önerisi geri çekildi**. |
| **K-2/C023** provenance belirsizlik silinmesi | Q546297 Mantegna | Brera: 1628 Carlo I + Mazarin "**non risolutive ipotesi**"/"sarebbe poi passato"; 1806/1824 "**indizi sicuri**". itwiki: Aldobrandini 1603 "**sdoppiarsi**" (diğer versiyon). | Belgeli 1806/1824 **A (C023)**; bottega/Gonzaga/1628/Mazarin **D (C031)**; Aldobrandini Brera zincirinden çıkarıldı. TK05/CS10 düzeltildi. |
| **C011** 1799 anakronizmi | Q979440 Martini | enwiki "Peter Leopold" ↔ itwiki "Ferdinando III". Pietro Leopoldo 1790'da Toskana'dan ayrıldı, 1792'de öldü → 1799'da emir veremez. | Grandük kimliği **D (C034)**; taşıma olgusu (1799, iki Giordano tuvali) B (C011). TK04 düzeltildi; itwiki K5 eklendi. |
| **S-4** İleri dolgu | 8 eser | difflib ardışık paragraf benzerliği >0.6 (Claude %22–36 ölçümü). | **45 yakın-kopya paragraf kaldırıldı** (Q1755464, bosch, Q2409245, Q500985, Q220859, Q285392, Q3697588, Q5856992, Q1055117). Kelime hedefi tutmadıysa **kısa bırakıldı** (uydurma yok). |

## 2. Düzeltilen YÜKSEK (P1) bulgular

- **Dürer C020 yanlış çerçeve:** anlam tartışması (akademik yorumlar) ile alımlama tarihi (Nietzsche/Nazi) ayrıldı. Karşıt okumalar eklendi (**C025 B**, enwiki satır içi kaynaklı): **Thausing** (dört mizaç/sanguineus), **Karling 1970 + Ursula Meyer** (Raubritter, mızrakta tilki kuyruğu, Physiologus), **Getlein** (obsolescence/teslimiyetçi). "S" anlamı **D (C024**: Salus ↔ sanguineus). **Nietzsche GT §20 birincil metin** (Gutenberg #7206) okundu → şövalye = Schopenhauer'un "umutsuz ama hakikat arayan" tutumu (**C026 A**); "pesimizm örneği" indirgemesi düzeltildi.
- **Dürer quiz:** CS07 → "Panofsky'ye göre köpek…" (atıf zorunlu); CS09/CS10 karşıt okuma soruları; DY03 olgusal bakış yönüne çevrildi (yorum dışı); TK05 Schopenhauer bağlamı.
- **Mantegna:** C022 "yenilgi simgesi" B→**C** (enwiki zayıf); tekrarlanan paragraflar teke indirildi. C021 Steinberg atfı daraltıldı (bu tabloya özgü genital-merkez okuması **Eisler**'in; Steinberg genel tez). DY04 Magdalene "büyük olasılıkla" (itwiki "in tutta probabilità"). CS06 ışık yönü atfı K3 (itwiki "proveniente da destra") olarak düzeltildi.
- **Martini:** C027 "Kuzey üslup → Avignon daveti" nedenselliği enwiki'de `{{Citation needed}}` → **C (C035)**; "belgeli halka"/"davetin nedeni" yoruma çevrildi. C005 "orta panel" niteliği kaldırıldı (Uffizi yalnız "Size 184×168", panel niteliği yok). C004 oranı enwiki "double" ↔ itwiki "triplo" → **D (C036)**. C013 "lak" → "lacca" (lake pigmenti; terim birincil teyit yok, not edildi).
- **Perugino Q2620028 anahtar çelişkisi (S-8):** kaynakla çözüldü — enwiki "silver and gold" + itwiki betimi "chiavi d'oro e d'argento" (gümüş) ↔ itwiki'nin **Marco Rizzi** kaynaklı yorumu "una d'oro… e una di ferro" (demir). Altın ortak; ikinci anahtar malzemesi **D (C023)**. DY04 malzeme iddiası kaldırıldı (→ "İsa diz çökmüş Petrus'a anahtarları verir", C008 B); TK02 kanit C023 çıkarıldı; §9 envanterine tartışma eklendi.

## 3. Sistematik kontroller (20 eser)

| Kod | Kontrol | Sonuç |
|---|---|---|
| S-1 | Yanlış/eşleşmeyen müze URL'si | Dürer + Mantegna'da doğrulanıp düzeltildi. Diğer eserlerin birincil URL'leri bu turda **tek tek yeniden açılmadı** (aşağıda sınır). |
| S-2 | Kaynaksız Wikipedia cümlesine B | Martini C027→C uygulandı. Cümle-düzeyi tam Wikipedia denetimi yalnız öncelikli eserlerde yapıldı. |
| S-3 | Belirsizlik ifadelerinin silinmesi | Mantegna/Dürer/Martini/Perugino'da kaynağın kendi kesinlik ifadesi ("non risolutive", "in tutta probabilità", "some art historians", "often seen as") korundu/yorum yapıldı. |
| S-4 | Tekrar/dolgu | 45 yakın-kopya paragraf kaldırıldı; `dogrula.py`'ye yakın tekrar + seviyeler arası tekrar kontrolü eklendi. |
| S-5 | Görsel incelenmeden görsel soru | Görseli incelenmeyen **14 eserde GZ soruları "TASLAK (görsel teyit bekliyor)"** işaretlendi (gen.py kalıcı). İncelenen eserlerde (örn. Martini) işaret yok. |
| S-6 | Yorumun tek doğru cevap olması | Dürer CS07 atıf zorunlu; karşıt okumalar bilinen iddialar DY'den çıkarıldı. |
| S-7 | Totolojik çeldirici gerekçesi | **295 "X değil." gerekçesi** bağlamsal gerçek gerekçeye çevrildi (tarih/sanatçı/kurum/teknik bilgi tabanı; gen.py kalıcı). Kalan 0. |
| S-8 | İç tutarsızlık / sayım | Perugino anahtar çelişkisi çözüldü; **KANIT "Sayım" satırları DERS.json ile eşitlendi** (domenico B=9→10/E=9→8; 4 esere Sayım satırı eklendi). |
| S-9 | Erişilebilir birincil kaynak kullanımı | Dürer Met API + Mantegna Brera arama ile açıldı ("tek deneme→E" kapatıldı). |

## 4. Düzeltilmeyen / kısmi kalan sorunlar ve nedenleri

1. **Diğer 16 eserin birincil URL + cümle-düzeyi Wikipedia denetimi (S-1/S-2):** Bu turda 4 öncelikli eser derin doğrulandı; kalan 16 eserde aynı risk profili **muhtemel** ama tek tek kanıtlanmadı. Tam denetim insan/haricî model turu gerektirir (otomatik çözülmez).
2. **Seviyeler arası kısmi tekrar (5 eser: Q1755464, Q2409245, Q285392, Q500985, bosch):** Orta↔İleri birebir uzun cümleler (5–13). Bir kısmı anahtar olguların levels-arası meşru tekrarı; tam paraphrase insan editör turuna bırakıldı. `dogrula.py` UYARI olarak raporlar.
3. **Kelime aralığı (30 uyarı):** Dolgu kaldırılınca İleri/Orta hedefin altında kaldı. Kullanıcı talimatı 6 + standart §8 gereği **uydurma yapılmadı, kısa ders kabul edildi**. Q5856992 Başlangıç 533→499 (tek over-max düzeltildi).
4. **Görsel CS soruları:** GZ taslak işaretlendi; konum/yön soran bazı CS'ler görsel teyit olmadan duruyor (insan editör görsel teyidi ZORUNLU).
5. **Düşünür özgün metinleri (Panofsky, Vasari, von Einem, Schrade, Steinberg, Kristeller, Thausing, Karling, Meyer, Getlein):** erişilmedi; okumalar enwiki'nin satır içi kaynaklı aktarımıyla karşılaştırıldı (C016/C029). Tek istisna Nietzsche GT §20 (birincil okundu).
6. **Y-7 eksik atıf:** `AKADEMIK_HAKEM_RAPORU.md` depoda yok (haricî Claude eki); DURUM/KAYNAKCA/HAKEM_REVIZYON_RAPORU atıfları bu dış dosyaya. Dosya uydurulmadı; atıfın dış kaynak olduğu not edildi.
7. **Kalıcı sınır:** Vision bütçesi #7'den sonra tükendi → 14 eserde görsel indirildi ama İNCELENEMEDİ (E). Birincil katalog erişilemeyen eserlerde (Prado 403, KHM JS, Condé, Met web 429) A yalnız lisans. **İnsan editör görsel + birincil katalog teyidi ZORUNLU.**

## 5. Tüm 20 eser — güncel test sonuçları

`dogrula.py` (jsonschema Draft2020-12 AKTİF): **0 hata, 35 uyarı** · testler **25/25** · içerik CJK **0**.
Uyarıların 30'u kelime aralığı (kısa ders, §8), 5'i seviyeler arası kısmi tekrar. Hiçbir eser "Yayına aday" değil; tümü "İnsan incelemesi bekliyor".

| # | Eser | İddia | A/B/C/D/E | Kelime (B/O/İ) |
|---|---|---|---|---|
| 1 | Q3947103 Berlinghieri | 24 | 3/20/0/1/0 | 419/1485/2606 |
| 2 | Q3698260 Cimabue | 27 | 1/23/0/3/0 | 412/1305/2594 |
| 3 | duccio Kudüs'e Giriş | 25 | 8/17/0/0/0 | 402/1290/2572 |
| 4 | Q3873247 P. Lorenzetti | 27 | 6/21/0/0/0 | 412/1313/2568 |
| 5 | Q979440 Martini Müjde | 36 | 20/10/1/4/1 | 435/1365/2723 |
| 6 | Q2067212 Giotto Ağıt | 30 | 7/20/0/2/1 | 420/1307/2565 |
| 7 | Q1759631 Masaccio | 31 | 3/24/0/2/2 | 406/1300/2564 |
| 8 | Q2378534 Fra Angelico | 29 | 1/25/0/0/3 | 411/1292/2522 |
| 9 | domenico di Michelino | 22 | 1/10/2/1/8 | 392/1292/2554 |
| 10 | Q546297 Mantegna | 31 | 8/16/2/4/1 | 410/957/1552 |
| 11 | Q2620028 Perugino | 27 | 1/22/0/2/2 | 379/1276/2526 |
| 12 | Q3697588 Bramante | 19 | 1/15/0/1/2 | 392/1271/2349 |
| 13 | Q5856992 Limbourg Şubat | 21 | 1/11/2/0/7 | 499/983/1936 |
| 14 | Q1055117 Gentile | 28 | 13/11/2/1/1 | 401/1341/2404 |
| 15 | Q285392 Campin Mérode | 28 | 7/15/2/3/1 | 435/1318/2262 |
| 16 | Q220859 Van Eyck Arnolfini | 26 | 9/12/2/2/1 | 419/1330/2057 |
| 17 | Q2409245 Christus | 24 | 8/12/2/1/1 | 410/1344/1937 |
| 18 | bosch Dünyevi Zevkler | 24 | 1/16/2/3/2 | 409/1318/1922 |
| 19 | Q500985 Bruegel Karda Avcılar | 21 | 1/15/2/1/2 | 427/1295/1907 |
| 20 | Q1755464 Dürer | 26 | 3/16/3/2/2 | 447/1071/1992 |

**Toplam 526 iddia** (A=103, B=331, C=22, D=33, E=37). Pilot Q167605 (80 iddia) bu tabloya dahil değil, değiştirilmedi.

## 6. Yeni kalite kuralları (`dogrula.py`)

1. **§8 kelime aralığı uyarısı:** Başlangıç 400–500, Orta 1300–1600, İleri 2600–3200 dışı → UYARI (kısa ders bilinçli tercih olabilir).
2. **Yakın tekrar kontrolü:** ardışık paragraf difflib benzerliği >0.6 → UYARI (§8 dolgu); seviyeler arası ≥5 birebir uzun cümle → UYARI.
3. **Boş quiz kanıtı:** CS/DY/GZ/TK `kanit` dizisi boş → HATA.
4. **Sayım tutarlılığı:** KANIT "Sayım:" satırı ↔ DERS.json seviye sayıları → UYARI (pilot muaf).
5. **Totoloji tespiti:** ≤3 kelimelik "X değil." çeldirici gerekçesi → UYARI (§10).
6. **Üretim hattı (gen.py):** totolojik gerekçeler otomatik bağlamsal gerekçeye çevrilir; görsel incelenmediyse GZ otomatik "TASLAK" işaretlenir.
7. Testler 20 → **25/25** (5 yeni negatif/uyum testi).

**Semantik sınır (korundu):** `dogrula.py` YAPISAL tutarlılığı denetler; olgusal/semantik doğruluğu GARANTİ ETMEZ. "0 hata" akademik doğruluk göstergesi değildir; insan/haricî model denetimi + ham kaynak kontrolü gerekir.

## 7. Sonuç ve teslim

- P0 kritik (4) + P1 yüksek (6) bulguların tamamı ham kaynakla doğrulanıp düzeltildi; sistematik S-1…S-9 uygulandı (kalanlar §4'te dürüstçe listelendi).
- `DURUM.md` (Özet Sayılar 21/86/107 + Düzeltme Turu günlüğü), 4 öncelikli eserin `KANIT_DOSYASI.md` + `KALITE_KONTROL.md` güncellendi.
- Değişiklikler yalnız `content-review` branch'ine commit/push edildi; **main'e merge yok, deploy/yayın yok**; uygulama kodu + `data/` değişmedi; Vermeer pilotu değişmedi.
- **Durum: "İnsan incelemesi bekliyor"** — hiçbir eser otomatik yayına alınmadı.
