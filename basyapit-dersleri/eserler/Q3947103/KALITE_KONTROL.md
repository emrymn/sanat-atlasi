# KALİTE KONTROL — Q3947103 · Assisi'li Aziz Franciscus ve Yaşamından Sahneler

**Tarih:** 14 Kasım 2026 · **Parti:** 1 (M1) · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema doğrulaması ✅ · **İnsan incelemesi: BEKLİYOR**

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Üç ders metnindeki olgusal cümleler `[C###]` ile `KANIT_DOSYASI.md` envanterine bağlandı; `dogrula.py` çapraz kontrolü (ders etiketleri ↔ DERS.json ↔ KANIT ↔ SORULAR kanit) temiz.

- **Toplam iddia:** 24 (C001–C024). Dağılım: A=3, B=20, C=0, D=1, E=0.
- **Olgusal anlatım:** A+B = 23. Yorumlar (İleri §7, Orta §5/§10) açıkça "yorum" işaretli, olgu iddiası sayılmaz.
- **Tarih ihtilafı:** C004 (D) — yazıtlı 1235 ↔ WD 1298; derslerde "tartışma" işaretli, kesin cevaplı quizde değil.
- **Quiz uyumu:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B kanıta bağlı; AU01 açık uçlu C004 (D) içerir (serbest).
- **Kaynak zinciri:** eser in situ kilise panosu; birincil müze kaydı yok. K1 (kaynaklı İtalyan Vikipedi, B) + K2 (Wikidata) + K3 (Commons görsel, A) + K4 (sanatçı Vikipedi, B). Standart §4 gereği kaynaklı Vikipedi B olarak zincir notuyla kullanıldı.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

K1 (İtalyan Vikipedi REST HTML), K2 (Wikidata wbgetentities), K3 (Commons 1280×1747 görsel) 14 Kasım 2026'da yeniden açıldı ve iddialarla karşılaştırıldı:
- 1235 imzalı/yazıtlı ✓ (K1 "firmata, datata 1235"; K3 görsel "MCCXXXV" yazıtı). WD 1298 alternatifi ✓ (C004 D).
- tempera e oro su tavola ✓; 160×123 ✓; Chiesa di San Francesco Pescia, Mainardi sunağı ✓.
- en eski Franciscus tasviri, ölümünden 9 yıl sonra ✓; 1880'ler Ridolfi/Bardelli keşfi ✓.
- altı sahne listesi ✓; üç düğüm = üç yemin ✓; iki melek madalyonu ✓; maniera greca ✓.
- 1937 katalog hale notu ✓; del Serra 1981–82 restorasyon ✓ (katalog/rapor metnine erişilmedi — B aktarımı, açıkça işaretli).
- Görsel: biçim, figür, kordon, madalyonlar, altı sahne, yazıt doğrulandı; stigmata/imza tam transkripsiyonu bu çözünürlükte net değil (sınır notu).

**Erişilemeyen birincil hedefler:** Pescia kilise envanteri, Catalogo Generale dei Beni Culturali, 1937 sergi kataloğu, del Serra raporu. Bunlardan bağımsız doğrulama yapılmadı; ilgili maddeler B (K1 aktarımı). İnsan editör bu birincil kaynakları teyit etmeli.

## 3. Şema ve biçim doğrulaması

`dogrula.py` (mini + jsonschema Draft 2020-12): **0 hata, 0 uyarı.** DERS.json ↔ DERS_SEMASI.json; SORULAR.json ↔ SORULAR şeması; çapraz tutarlılık temiz.

## 4. Kelime/süre ölçümü

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 419 | 400–500 | 3 dk ✓ |
| Orta | 1485 | 1300–1600 | 10 dk ✓ |
| İleri | ~2615 | 2600–3200 | 20 dk ✓ |

## 5. Görsel doğrulama (Kural 6)

Commons 1280×1747 tam kare vision köprüsüyle incelendi (PD; geçici kopya `.qwen/tmp/parti1/Q3947103/`, teslimata girmez). Biçim/figür/kordon/madalyon/sahne/yazıt doğrulandı. Stigmata ve imza satırı tam transkripsiyonu net değil; sahne içerikleri K1 betimiyle eşleştirildi. Görsel projeye kopyalanmadı; URL+lisans referansı verildi.

## 6. İnsan incelemesi gerektiren noktalar

1. Birincil kurum kaydı (kilise envanteri / Catalogo Generale) teyidi — mevcut B aktarımı.
2. 1937 sergi kataloğu ve del Serra restorasyon raporu metin teyidi.
3. WD 1298 alternatifinin kaynağının araştırılması (C004).
4. Felsefi yorumlar (İleri §7) kurum dışı yorumdur; editör onayı şart.
5. "alter Christus", "yakın kutsallık", "altın paradoksu" yorumları C seviyesinde; olgu değil.

## 7. Yayına adaylık durumu

Otomatik kısmı sağlandı (kimlik doğrulandı, olgusal cümleler kanıtlı, görsel doğru eserle doğrulandı, yorumlar ayrık, quiz A/B, erişim durumları kayıtlı, çelişki açık). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** İnsan editoryal onayı olmadan yayımlanmaz.

**Not:** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan tarafından yapıldı; haricî model/insan editör denetimi ayrıca gereklidir.