# KALİTE KONTROL — Q175036 · Guernica · Pablo Picasso

**Tarih:** 15 Kasım 2026 · **Parti:** 7 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ (aynı asistan; haricî denetim BEKLİYOR) · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti7/Q175036-brief.md`); ham cache `.qwen/tmp/parti7/Q175036-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; `dogrula.py` çapraz kontrolü temiz.
- **Toplam iddia:** 66 (C001–C066). **A=20, B=24, C=2, D=8, E=12.**
- **A düzeyi:** S1 birincil kayıt + deneme, S2 araştırma sitesi (künye/sipariş/bombardıman/provenans/ikonografi Blunt/grisaille/piramidal/Minotauromaquia/salon tarihi/telif/gigapixel).
- **B düzeyi:** S3/S4 kaynaklı (Richardson, Maar, Sandberg, Becht-Jördens, Preston, Richthofen, Greenberg, alımlama, UN halı, Shafrazi, provenans ayrıntıları) — atıf zinciri notuyla (C053).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU serbest (C/D/E dahil). A/B dışı kanıt: 0. Yanlış gerekçeleri bağlamsal (totoloji yok).
- **D/E işareti:** 8 D "(tartışma)" (C032–C039); E "(belirsiz)" (C040–C042, C046, C048–C049, C052–C053); C "(yorum)" (C050–C051). Post-pass build'den önce; dogrula D/E belirsizlik işareti uyarısı: 0.
- **GZ TASLAK:** görsel incelenemedi → `gen.gz_taslak` 5/5 TASLAK.
- **Kullanılmayan E:** C043 (Arnheim bozuk atıf), C044 (gizli imgeler zayıf web), C045 (bombilla kaynaksız), C047 (Tusell atıfsız) → ders çekirdeğine alınmadı; KANIT'ta kayıtlı.
- **Etiketsiz olgu uyarısı:** 0 (4 heuristic aday düzeltildi: telif cümlesine [C019]; Picasso alıntısında [C064] bölünen parçaya taşındı; "75. yaş" ordinal noktası kaldırıldı).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

- **S1/S2 birincil URL'ler bu oturumda yeniden yoklandı:** S1 `https://www.museoreinasofia.es/colecciones/obra/guernica/` → **200** (301→200); S2 `https://guernica.museoreinasofia.es/en` → **200** (2026-11-15).
- Ham cache'ler (S1 ES kayıt+deneme, S2 EN giriş, S3/S4 wikitext, S5 EntityData, S6/S7/S8 imageinfo, S9 etiketler) **ders metninden bağımsız yeniden okundu** ve iddialarla karşılaştırıldı: künye (1937/1 Mayıs–4 Haziran; óleo/lienzo; 349,3×776,6; DE00050; Sala 205.10; giriş 1992), provenans, Blunt envanteri, grisaille, Minotauromaquia, telif footer ✓.
- **İhtilaflar D olarak açık:** itwiki "Tempera su tela" hatası (C032; birincil óleo kazanır); boyut 776,5↔776,6 (C033) + yuvarlama 349/776 (C034); ödeme 150.000 frank↔300.000 peseta (C035); süre 3 saat 15 dk↔~2 saat (C037); fail kapsamı (C038); gün düzeyi (C036/C039).
- **Görsel:** metadata only; vision kotası tükendi → **İNCELENMEDİ** (C052). **S3/S4 refs metinlerine erişilmedi** (C053); kitap/dergiler yalnız kaynakçada anıldı.
- **Sınır:** Bu tur aynı asistan + agent araştırmasıyla yapıldı; §11 gereği **haricî model/insan editör denetimi ayrıca gereklidir** ve "bekliyor" olarak işaretlidir. Otomatik doğrulama olgusal doğruluğu garanti etmez.

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + **jsonschema Draft2020-12 AKTİF**): **Q175036 → 0 hata / 0 uyarı.**
Genel SONUÇ: 0 hata / 118 uyarı — **118 uyarı eşzamanlı diğer parti eserlerine aittir** (Q1055117, Q1131176, Q1240092, Q1368055, Q1755464 vb.); Q175036'ya ait HATA/UYARI satırı yoktur. **CJK/Kiril: 0** (7 dosya tarandı). `bolum_eslesme` 12 bölüm; `durum="İnsan incelemesi bekliyor"`; `incelenen_bolgeler=[]`.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 443 | 400–500 | 3 dk |
| Orta | 1351 | 1300–1600 | 10 dk |
| İleri | 2714 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta (§8). Dolgu/tekrar yok; yakın tekrar ve seviyeler arası birebir ortak cümle uyarısı: 0. Kanıt yetersiz alanlar (görsel, refs) kısa bırakıldı; uydurma yok.

## 5. Görsel doğrulama (Kural 6)

- **S7 (enwiki File:PicassoGuernica.jpg):** non-free **fair use** (NFUR; `NonFree:true`, `Copyrighted:True`); 464×211 px; orijinalin düşük çözünürlüklü reprodüksiyonu. `gorsel.url` bu dosyanın açıklama sayfası (upload URL'si değil; yeniden yayımlama yok).
- **S6 (Commons File:Mural del "Guernica" de Picasso.jpg):** CC BY-SA 4.0 (**yalnız fotoğraf**); 4520×2060; **Gernika seramik karo REPRODÜKSİYONU — orijinal DEĞİL.**
- **S8:** Commons'ta orijinalin serbest dosyası **YOK** (`missing:true`). **S5 P18 = reproduksiyon** → uygulama P18'den beslenirse orijinal yerine Gernika kopyası gösterilir (**Q227494 Red Fuji örüntüsü**); künye/görsel eşleşmesi kontrol edilmeli.
- **İNCELENMEDİ** (vision kotası); `incelenen_bolgeler=[]` → **GZ 5/5 TASLAK**; kompozisyon "kaynakların betimlediği" (S1/A + S3/B). Görsel projeye kopyalanmadı. **İnsan editör görsel teyidi ZORUNLU.**

## 6. Telif / adil kullanım notu (ZORUNLU)

- **Hak sahibi:** © Sucesión Pablo Picasso, **VEGAP**, Madrid, 2026 (S2 footer, A). Picasso ö. 1973 → **TR/AB (70 yıl pma) 2044-01-01'e dek; İspanya (80 yıl pma) 2053-12-31'e dek** korumalı (S5 P6216/P3893).
- **Kullanıcı çerçevesi:** **adil kullanım** (eğitim/eleştiri; atıf + telif notu). **Görsel yeniden yayımlanmaz/kopyalanmaz**; derslerde yalnız **URL + lisans + kaynak referansı**. `kunye.telif_durumu` dolduruldu; üç derste de telif notu var.
- Commons fotoğrafının **CC BY-SA 4.0 lisansı yalnız fotoğrafı kapsar**; alttaki Picasso eseri hâlâ teliflidir — "CC" etiketi eseri serbest bırakmaz.
- **Bu not hukuki tavsiye değildir.** Yayın öncesi hak politikası kararı + hukuki inceleme gerekir.

## 7. İnsan incelemesi gerektiren noktalar

1. **Görsel (C052, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi zorunlu (özellikle P18 reproduksiyon ↔ orijinal ayrımı).
2. **8 D ihtilaf:** teknik (itwiki tempera), boyut (776,5/776,6 + yuvarlama), ödeme (150.000 frank↔300.000 peseta), süre (3s15dk↔~2s), gün/fail kapsamı. **Ödeme ve süre kesinleştirilmedi**; editör kararı.
3. **E alanları:** sembolizm (sabit okuma yok; tek anlam dayatılmadı), Joselito marjinal tez, genez anlatıları, ham jüt desteği, Alman subay anekdotu.
4. **Kullanılmayan E:** Arnheim (sayfa yer tutucu/bozuk atıf), gizli imgeler (zayıf web), bombilla/bomba (kaynaksız), Tusell (atıfsız) — kaynak bulunmadan kullanılmamalı.
5. **data/ (değiştirilmedi):** tarih "20. yüzyıl" → 1937 netleştirme önerisi; P18 reproduksiyon riski; bombilla kaynağı gerekli; "tapınak alınlıkları" benzetmesi yorum.
6. **Telif/adil kullanım:** hak politikası kararı + hukuki inceleme (bu not hukuki tavsiye değil).
7. **Felsefi yorumlar (İleri §7):** Kant/Benjamin çerçeveleri ödünç; etki iddiası yok; kurum dışı editör onayı.
8. **Literatür (C053, E):** S3/S4 refs metinleri erişilmedi; B düzeyi atıf zinciri; haricî denetim.

## 8. Yayına adaylık

Otomatik kısım sağlandı: **0 hata / 0 uyarı (Q175036)**, şema (Draft2020-12) ✓, CJK 0, quiz A/B ✓, 12 bölüm ✓, kelime hedefleri ✓. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. **Birincil S1/S2 AÇILDI (A); görsel İNCELENMEDİ (E); refs erişilmedi (C053).** Haricî model/insan editör denetimi + görsel teyit + telif/hak politikası onayı kritiktir.