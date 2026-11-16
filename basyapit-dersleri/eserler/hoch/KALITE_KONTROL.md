# KALİTE KONTROL — hoch · Hannah Höch, "Schnitt mit dem Küchenmesser Dada…" · Neue Nationalgalerie / SMB

**Tarih:** 15 Kasım 2026 · **Parti:** 7 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**eser_id:** `hannah-hoch|Cut with the Kitchen Knife Through the Beer-Belly of the Weimar Republic` (bileşik anahtar; QID YOK) · **dizin:** `hoch`
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** `.qwen/tmp/parti7/hoch-brief.md` (ham cache `.qwen/tmp/parti7/hoch-*`).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Derslerin bütün olgusal cümleleri `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **temiz (0 hata / 0 uyarı)**.
- **Toplam iddia:** 55 (C001–C055). **A=15, B=24, C=2, D=5, E=9.** KANIT "Sayım:" satırı DERS.json ile birebir eşit.
- **A düzeyi (15):** SMB birincil kaydı (sanatçı, 1919, Papier auf Karton-Collage, 114×90, NG 57/61, Neue Nationalgalerie, 1961 Nierendorf-BASF, Dada-Messe 1920, üst/alt bölge + cinsiyet değişimi ikonografisi, Wollin doğuş alıntısı, VG Bild-Kunst fotoğraf künyesi).
- **B düzeyi (24):** fuar ayrıntıları/katalog (S7), figür listesi + biçimsel betim (S8), tek kadın/öncülük (S5/S6), Grosz/Heartfield muhalefeti + Hausmann "kulüp" + Richter "sandviç" (S5/S6), mutfak bıçağı metaforu (Makholm), akwarel/kübist kolaj (Foster/Grzych zinciri), çift WD, yorum ekolleri (Buchloh/Grzych/Lavin/Richter/Hudson), Dech alımlama, fuar taraması metadata. Hepsi kaynak zinciri notuyla.
- **C düzeyi (2):** C020 (harita + otoportre okuması), C054 (estetik-felsefi okuma) — açıkça "(yorum)" işaretli; olgu/quiz cevabı değil.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B** kanıta dayanır; 5 AU serbest (C/D/E dahil). Doğru cevaplar D/E'ye veya yoruma dayanmaz. Yanlış seçenek gerekçeleri gerçek/bağlamsal (totoloji yok; çeldirici envanterler SMB sayfasındaki öteki eserlerden: NG 74/81, B 68/5, A II 183).
- **D/E işareti:** 5 D "(tartışma)" (C029–C033); 9 E "(belirsiz)" (C027, C028, C034, C035, C036, C038, C039, C040, C046). Post-pass + metin içi işaretler temiz.
- **GZ TASLAK:** görsel incelenmedi → gen.py `gz_taslak` 5/5 soruyu TASLAK işaretledi.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda ham cache'ler yeniden açılıp iddialarla karşılaştırıldı:
- **S1 SMB birincil (canlı 200, obj-961048, güncelleme 14.11.2026):** künye + edinim + proveniens + ikonografi (Einstein/II. Wilhelm üst yarı; Hindenburg Bauchtänzerin / Grosz Ballerina; "Foto-De-Montage"; Dada-Messe 1920 "besondere Beachtung") ✓. Wollin/Militärgedenkblatt + Höch/Hausmann alıntıları SMB metni içinden (A) ✓.
- **S2/S3 WD:** Q107450751 (P8923=961048, 114×90, collage, 1919, NG 57/61) ↔ Q126126939 (89,8, P31 watercolor, P6216 copyrighted) çift kayıt ✓; ikisinde P18 yok ✓.
- **S5/S6/S7/S8 wikitext:** figür listesi, biçimsel betim, fuar katalog/174-27, Makholm/Lavin/Hemus alıntıları, Grzych/Buchloh/Richter okumaları, Dech ✓.
- **S15/S16/S17/S18 görsel metadata:** enwiki 715×900 PD-US (Copyrighted:True), Commons "missing", fuar taraması 2790×3880 CC BY-SA 4.0 (2024), WikiArt 375×471 ✓.
- **5 ihtilaf D** (tarih/akwarel/genişlik/hatalı alt yazı/harita yönü) ve **belirsizlikler E** açıkça ayrıldı; hiçbir D/E kesinleştirilmedi.

**Erişilemeyen (E):** Smarthistory Barber 2020 (canlı 403; Wayback 429/bot), Grzych 2016 PDF (SSL expired), Foster et al. 2023 / Hemus 2009 / Makholm 1997 / Lavin 1990/1993 / Neuheuser 1995 / Berlinische Galerie 2007 / Dech 1993 (kitap/JSTOR/PDF). Kaynakçada anıldı, metne erişilemedi; B/zincir veya E olarak kullanıldı (C040).

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12, izole `.qwen/tmp/venv-dogrula`): **hoch 0 hata / 0 uyarı.** DERS.json + SORULAR.json şema geçerli; bolum_eslesme 12 bölüm; durum "İnsan incelemesi bekliyor"; ek alan yok. **CJK: 0** (tüm dosyalar tarandı). Not: dogrula genel SONUÇ sayısı eşzamanlı öteki parti eserlerinden dolayı dalgalanabilir; hoch temizliği kendi satırlarıyla doğrulandı (boş).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 448 | 400–500 | 3 dk | ✓ |
| Orta | 1304 | 1300–1600 | 10 dk | ✓ |
| İleri | 2757 | 2600–3200 | 20 dk | ✓ |

Kelime sayıları DERS.json `seviyeler` ile eşit (gen.build dosyadan ölçer). Dolgu/tekrar yok; seviyeler arası birebir uzun cümle tekrarı yok. İçerik kanıtla sınırlı; görsel incelenemediği için biçimsel analiz "kaynakların betimlediği" çerçevesinde verildi (§6/§8).

## 5. Görsel doğrulama sınırı (Kural 6)

**Görsel bu oturumda İNCELENMEDİ (C039, E)** — vision kotası ana oturumda; yalnız metadata/lisans/çözünürlük çekildi. `gorsel.dogrulama.incelenen_bolgeler=[]` → **GZ 5/5 TASLAK**. Kompozisyon/ikonografi S1 (A) + S8/S6 (B) metninden; renk/palet/biçim betimleri "görsel teyit yok" notuyla. Görsel projeye kopyalanmadı/yeniden yayımlanmadı. **İnsan editör görsel teyidi ZORUNLU:** Einstein konumu (C034), harita yönü (C033), HH monogramı (C021), otoportre (C035), palet/biçim (C042).

## 6. Telif / adil kullanım + PD-US ayrımı (ZORUNLU)

- **Eser TR/AB'de telifli:** Höch ö. 31.5.1978 → 70 yıl p.m.a. → **1.1.2049**'a kadar korumalı. Hak sahibi **© VG Bild-Kunst, Bonn**. `kunye.telif_durumu` dolduruldu.
- **SMB fotoğrafı:** © VG Bild-Kunst, Bonn 2021; fotoğrafçı Jörg P. Anders (C025). Yeniden yayımlanmaz.
- **PD-US ayrı:** enwiki dosyası yalnız **ABD'de** kamu malı (PD-US, `Copyrighted:True` — kaynak ülkede telifli). **TR/AB dersinde "kamu malı" DENMEZ.** Commons fuar taramasının CC BY-SA 4.0 lisansı yalnız 2024 taramasını kapsar; altta yatan 1920 fotoğrafını/eseri serbest bırakmaz (C053).
- **Adil kullanım (kullanıcı kararı, eğitim/eleştiri):** görsel yeniden yayımlanmaz/kopyalanmaz; derslerde yalnız **URL + lisans + kaynak** referansı; atıf zorunlu. Derslere (Başlangıç "Telif ve görsel kullanım notu", İleri §10) ve KANIT §0'a not işlendi. **Bu hukuki tavsiye değildir.**

## 7. İki Wikidata item (veri notu)

Aynı fiziksel eser için **çift kayıt**: **Q107450751** (SMB objID 961048 ile birebir; 114×90, kağıt+karton, collage, 1919, NG 57/61; sitelink yok) → künye için **ESAS**. **Q126126939** (plwiki sitelink; 89,8 cm + P31 "watercolor painting" + P6216 "copyrighted") → ikiz; birincille tam örtüşmez (D002/D003). İkisinde de P18 (görsel) yok. data'da QID yok (bileşik anahtar); `veri_notlari`'na işlendi. data/ DEĞİŞTİRİLMEDİ.

## 8. İnsan incelemesi gerektiren noktalar

1. **Görsel (C039, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi zorunlu (Einstein konumu, harita yönü, HH, otoportre, palet/biçim).
2. **5 ihtilaf (D):** tarih 1919↔1919–1920 (C029); akwarel birincilde yok (C030); genişlik 90↔89,8 (C031); enwiki "90×144" hatalı (C032); harita yönü (C033).
3. **Harita + otoportre (C020/C033/C035):** yön ihtilaflı, hakem Smarthistory erişilemedi; otoportre E. Kesinleştirilmedi.
4. **E iddialar:** Kollwitz "ilk kadın profesör" (C027), Alman oy hakkı 1918 (C028) — tarihsel olarak doğru olabilir ama erişilen zincirle doğrulanmadı; quiz/kesin anlatım dışı. Bağımsız doğrulama önerilir.
5. **HH monogramı (C021):** B/zincir; birincil SMB metninde imza alanı yok; A'ya yükseltilmedi.
6. **Erişilemeyen literatür (C040):** Barber/Grzych/Foster/Hemus/Makholm/Lavin/Neuheuser/Berlinische Galerie/Dech — metne erişilemedi; B/zincir veya E. Haricî editör bu kaynaklara erişip doğrulamalı.
7. **Telif/adil kullanım:** TR/AB 2049 + PD-US ayrımı + VG Bild-Kunst; görsel yeniden yayımlanmadı; hak politikası kararıyla birlikte düşünülmeli (hukuki tavsiye değil).
8. **Felsefi yorumlar (C054, İleri §7):** açıkça yorum; filozof etkisi iddiası yok; editör onayı.
9. **data uyuşmazlıkları:** muze BOŞ (A ile doğrulandı), ozet/sanatcilar "1919–1920" + "of Germany", WikiArt düşük çözünürlük — `veri_notlari`/KANIT §5'te; data düzeltme kararı ana oturuma.

## 9. Yayına adaylık

Otomatik kısım sağlandı (şema, çapraz tutarlılık, quiz A/B, kelime, CJK, D/E işaretleri). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir.** Birincil SMB AÇILDI (A); görsel İNCELENMEDİ (E); 5 D + 9 E açık; telif/adil-kullanım çerçevesi uygulandı. Görsel teyidi + erişilemeyen literatürün doğrulanması + telif hak politikası onayı olmadan yayımlanmamalıdır.
