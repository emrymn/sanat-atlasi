# KALİTE KONTROL — Q311243 · Sis Denizi Üzerinde Gezgin · Caspar David Friedrich

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` (§11 iki kademeli, §12 yayına adaylık)
**Durum:** İnsan incelemesi bekliyor. **Yayına adaylık: BEKLİYOR** (§12 koşulları kısmen sağlandı; görsel inceleme + haricî denetim eksik).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

- Üç dersteki bütün olgusal cümleler KANIT_DOSYASI §2'deki C001–C071 iddialarına `[C###]` ile bağlandı. Etiket kayması (olgusal cümlede etiket yerine bir sonraki cümlede etiket) düzeltildi; sayı/tarih taşıyan her cümle kendi etiketini taşır.
- Yorumlar C olarak işaretlendi ve metinde "(yorum)" ile ayrıldı: C045 (itwiki palet betimi, zayıf web), C046 (self-portre önerisi, zayıf web), C047 (homo viator/Castellotti, zincir), C070 (Koerner Genesis hipotezi, B ama yorum). Felsefi bölüm (§7) açıkça "yorum" etiketli; Friedrich'in Burke/Kant/Carus'tan etkilendiği **iddia edilmedi** (§7).
- D iddiaları "(tartışma)", E iddiaları "(belirsiz)" ile işaretli; hiçbir D/E quiz doğru cevabı yapılmadı.
- Görsel incelenmediği için biçimsel betimler "kaynakların betimlediği" çerçevesinde verildi; doğrudan gözlem yazılmadı (§6).
- **Sonuç:** Tamam. Desteklenmeyen olgusal cümle kalmadı; kanıtı olmayan alanlar (malzeme-teknik inceleme, figür kimliği, provenance boşluğu) kısa ve belirsiz bırakıldı (§8 dolgu yok).

## 2. Denetim B — Kaynağa geri dönüş (bağımsız tur)

İlk metinden bağımsız olarak ham kaynaklar yeniden açıldı ve iddialarla karşılaştırıldı:
- **K1 (Wayback 2026-11-03)** ve **K2 (Wayback 2023-10-03)** birincil müze kayıtları yeniden okundu: sanatçı, "um 1817", Öl auf Leinwand, 94,8×74,8 (Bild) / 119,5×99,5 (Rahmen), HK-5161, Stiftung/Dauerleihgabe/1970, imzasız-tarihsiz + "Die Datierung ist nicht gesichert", Wvz BS/J 250, provenance zinciri, Grave/Bertsch denemeleri, 600.000 DM, Oetker 2011 doğrulanamadı → **A iddiaları teyit**.
- **K3/K4/K5** en/it/de wikitext yeniden okundu; **K6** WD EntityData'dan P571=1818 (precision yıl, P1480 circa), P2048=67, P2049=74,8, P217="HK-516167", P180 (16 öğe, tümü refsiz), P6216=Q19652 çıkarıldı → WD'nin **kendi referansıyla çelişkisi** (P571 ref'i "um 1817" başlıklı sayfaya işaret) teyit.
- **K8** Commons File 1 metadata Denetim B'de **yeniden çekildi** (cache başka eserle ezilmişti): 1962×2500, 1.633.600 bayt, PD, kredi=müze URL'si, DateTimeOriginal 1818 → teyit. **K9** File 2: 5256×6742, PD, kredi=tiqets (zayıf) → teyit.
- **K7** transfer landing+abstract yeniden okundu: ~120 yıl boşluk "1813/1817 to 1938", "undated and unsigned … attributed to", DOI 10.48640/tf.2024.1.108892, CC BY-SA 4.0 → teyit. Tam metin (K11) Anubis engelli, erişilmedi.
- **Yeni bulgu (Denetim B):** müze provenance not 4 "Nisan 1946 Marburg Masterpieces, erstmals öffentlich gezeigt" ↔ dewiki "yaz 1959 Tate" → **C071 (D)** olarak eklendi. Brief'te yoktu; insan incelemesine not.
- **Sonuç:** Tamam (erişilebilen kaynaklar düzeyinde). Kitap/makale metinleri erişilemediği için B iddiaları "atıf zinciri" notuyla sınırlı; bu bir sınır olarak beyan edildi (C067).

## 3. Şema ve yapı doğrulaması (dogrula.py)

- `.qwen/tmp/venv-dogrula/bin/python basyapit-dersleri/dogrula.py` → **Q311243: 0 hata / 0 uyarı.**
- DERS.json + SORULAR.json Draft 2020-12 şemasından geçti (jsonschema katmanı aktif).
- 12 bölüm eşlemesi tam; durum "İnsan incelemesi bekliyor"; sayım satırı (71; A19/B28/C3/D13/E8) DERS.json ile tutarlı.
- Quiz: CS10/DY5/GZ5/TK5 kanıtları **yalnız A/B**; AU5 serbest. CS doğru şıkları seçeneklerde, yanlış gerekçeleri tam ve bağlamsal (totoloji yok). GZ tümü **TASLAK** (görsel incelenmedi).
- Kelime: B=412 (400–500 ✓), O=1355 (1300–1600 ✓), İ=2681 (2600–3200 ✓).
- **CJK: 0** (tüm Q311243 dosyaları tarandı).
- Not: Genel dogrula çıktısındaki öteki hata/uyarılar (Q1368055, Q2366825, Q3228340, Q540488 vb. eksik dosya) **başka eserlere** aittir; bu parti kapsamında dokunulmadı.

## 4. Kelime tablosu

| Seviye | Hedef (§8) | Ölçülen | Durum |
|---|---|---|---|
| Başlangıç | 400–500 | 412 | ✓ |
| Orta | 1300–1600 | 1355 | ✓ |
| İleri | 2600–3200 | 2681 | ✓ |

Seviyeler arası birebir uzun cümle tekrarı yok; yakın tekrar paragraf yok (dolgu yok, §8).

## 5. Görsel sınırı (§6)

- **Görsel İNCELENEMEDİ** (vision kotası ana oturuma ayrılmış). Yalnız metadata + lisans + çözünürlük. `gorsel.dogrulama.incelenen_bolgeler=[]` → GZ TASLAK otomatik.
- İki Commons dosyası **Public domain** (Friedrich ö.1840, >100 yıl pma). Dosya 1 kredisi müze (tercih edilir); Dosya 2 kredisi tiqets ticari site (zayıf). Müze fotoğraf kredisi Elke Walford (SHK/ARTOTHEK); müze sayfası telif beyan eder, Commons PD — fark olgusal not (hukuki yorum yok).
- Görselle çözülebilecek **saç rengi ihtilafı (C051: blond ↔ kırmızı)** açık bırakıldı. Kompozisyon betimleri K1 (Grave/Bertsch) + K3–K5 metninden; doğrudan görsel teyit insan editöre.
- Görsel projeye kopyalanmadı; derslerde URL + lisans + kaynak referans.

## 6. İnsan-inceleme noktaları (öncelik sırası)

1. **Görsel inceleme (vision):** doğru eser/görsel teyidi; saç rengi (C051), Gegenlicht/kompozisyon, montaj detayları. GZ TASLAK → gerçek gözlem sorularına dönüştürme.
2. **Tarih (C048):** müze "um 1817" ↔ WD/literatür 1818; WD'nin kendi referansıyla çelişkisi. data "1818" muğlaklıksız → circa kararı.
3. **Yükseklik (C049):** 94,8 (müze) ↔ 67 (WD) ↔ 98,4 (itwiki). BÜYÜK fark; WD 67 ve itwiki 98,4'ün kaynağı araştırılmalı (itwiki Cricco/Di Teodoro 2017'ye erişilmedi).
4. **Envanter (C050):** WD "HK-516167" ↔ müze "HK-5161".
5. **Atıf (C061):** imzasız/tarihsiz; 1947 Carus; kunsttechnologische Untersuchung yapılmadı; Bahners "problematisch". Çoğunluk Friedrich ama maddi doğrulama eksik.
6. **Provenance (C063/C041):** ~120 yıl boşluk; NS dönemi Luz/Henke/CCP; "ungeklärt, bedenklich". transfer tam metni erişilmedi.
7. **İlk kamusal gösterim (C071, yeni):** 1946 Marburg ↔ 1959 Tate.
8. **data notları (KANIT §5):** tarih/özgun ad (trwiki başlığı "Bulutların Üzerinde Yolculuk" özgün ad yerinde)/yükseklik/envanter/özdeşleşme nüansı. data/ değiştirilmedi; onaya sunulur.
9. **Haricî model/insan editör denetimi** (§11): bu klasörde "bekliyor".

## 7. Yayına adaylık değerlendirmesi (§12)

| Koşul | Durum |
|---|---|
| Temel kimlik ve atıf doğrulanmış | Kısmen — künye A; atıf/tarih belirsiz (C048/C061) |
| Tüm olgusal cümleler kanıt kayıtlı | ✓ (Denetim A) |
| Görsel analiz doğru eser/görselle yapılmış | ✗ — İNCELENEMEDİ (C066) |
| Yorumlar olgulardan ayrılmış | ✓ |
| Quiz cevapları doğrulanmış iddialara dayanıyor | ✓ (yalnız A/B) |
| Kaynak bağlantıları erişim durumlarıyla kayıtlı | ✓ |
| Ciddi çelişkiler açıkça belirtilmiş | ✓ (13 D + 8 E) |
| Denetim A + B tamamlanmış | ✓ (erişilebilen kaynaklar düzeyinde) |

**Sonuç: YAYINA ADAY DEĞİL — BEKLİYOR.** Görsel inceleme ve haricî/insan editoryal onay zorunlu. Durum: "İnsan incelemesi bekliyor".
