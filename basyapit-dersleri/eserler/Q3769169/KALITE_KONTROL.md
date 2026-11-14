# KALİTE KONTROL — Q3769169 · Holofernes'in Kafasını Kesen Judith (Judith Beheading Holofernes) · Artemisia Gentileschi

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti3/Q3769169-brief.md`); ham cache'ler `.qwen/tmp/parti3/Q3769169-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q3769169 için temiz.
- **Toplam iddia:** 58 (C001–C058). A=16, B=26, C=4, D=4, E=8. KANIT "Sayım:" satırı DERS.json ile birebir.
- **A düzeyi (16):** Uffizi birincil (S2) künye/konu betimi/Roma'da tamamlanma/Galileo ödemesi/Cosimo II ölümü/varış reddi/akademi "ilk kadın"/İncil alıntısı/etki/saraylar + WD (S1) çapraz.
- **B düzeyi (26):** enwiki/itwiki/Napoli kaynaklı maddeleri (Garrard/Bal/Treves/Barker/Bailey/Lucas/Menzio/Longhi/Barthes atıf zinciri; özgün metinlere erişilmedi → C051).
- **C düzeyi (4):** C026 (WD boyut zinciri, tartışma içinde), C052 (PD çıkarımı), C057/C058 (ders yorumları) — derslerde "(yorum)" işaretli.
- **D düzeyi (4):** C029 (D001 boyut), C030 (D002 versiyon kıyası), C031 (D003 Caravaggio tarihi), C032 (D004 lisans) — "(tartışma)" işaretli, quiz'e girmez.
- **E düzeyi (8):** C027/C028/C044/C047/C048/C049/C050/C051 — "(belirsiz)" işaretli, kesin anlatıma/quiz'e girmez.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B kanıtlı; 5 AU serbest (C/D/E dahil). Yanlış seçeneğe gerekçeleri gerçek gerekçe (totoloji yok; gen.cs_gerekce_iyileştir).
- **GZ TASLAK:** görsel incelenmedi → gen.gz_taslak otomatik (5/5 ipucu "TASLAK" önekli).
- **İçerik politikası:** konu şiddet içerir; betim akademik/ayrıntısız, kan/şiddet detayı büyütülmedi; data'nın grafik "bak" listesi derslere alınmadı.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda ham cache'ler 14 Kasım 2026'da yeniden açılıp iddialarla karşılaştırıldı:
- **S2 Uffizi (birincil, 200):** ad/sanatçı "Rome 1593 - Naples 1652/53"/"1620 c."/"Oil on canvas"/"146.5 x 108 cm"/"1890 n. 1567"/"D29. Caravaggio and Artemisia" ✓; konu betimi, Roma'da yedi yıl Floransa sonrası, Galileo ödemesi, Cosimo II 1621, varış sergi reddi, akademi ilk kadın (yıl yok), "powerful and frightening", İncil alıntısı ✓.
- **S1 WD:** P571 +1620 precision 9 + P1480 circa (ref P854=S2); P186 oil paint + canvas (P518); P2048 +199 / P2049 +162.5 (ref S9, 2018-06-25); P217 "1567" + P580 1890; P195/P276 Q51252; P6216 PD; P18 preferred=Flickr dosyası ✓.
- **S3/S4 wikitext:** chiaroscuro/realism, haç kabza, Abra aynası/sıvalı kollar, 50 scudi, Cosimo II siparişi, "presumably" varyasyon, Pitti koleksiyonu, Grand Duchess, 1993 hasar ("Pitti Palace" ↔ Via dei Georgofili link belirsizliği), otoportre tartışması (Garrard ↔ Pollock/Ciletti), Longhi 1916 + Barthes alıntıları ✓.
- **S7/S8 Napoli:** c. 1612–1613, 158.8×125.5, Capodimonte; "between 1613 and 1621"; pageprops Q2247406 ✓.
- **S5/S9 Commons:** PD etiketleri; Flickr Permission CC BY-NC-SA 2.0 + "License review needed"; GAP PD (oQF3gDEYNkutBA); WGA PD; çözünürlükler ✓.
- **Dört ihtilaf D olarak açık:** D001 (146.5×108 ↔ 199×162.5, çözülmedi), D002 (itwiki "biraz daha küçük" ↔ Napoli daha büyük), D003 (c. 1598–99 ↔ 1602), D004 (PD ↔ NC fotoğraf).
- **Erişilemeyen:** Garrard/Bal/Treves/Barker/Bailey/Lucas/Gardner/rehber/Menzio/Longhi/Barthes özgün metinleri; Khan/visituffizi/umma/jwa web (C051). Ölü URL yok; Wayback gerekmedi.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **Q3769169 için 0 hata / 0 uyarı.** CJK: 0 (üç ders + KANIT + JSON). bolum_eslesme 12 bölüm; durum "İnsan incelemesi bekliyor"; gorsel.dogrulama.incelenen_bolgeler=[].
**Not:** dogrula.py tüm `eserler/` dizinini tarar; aggregate çıktıda öteki eserlere (ör. Q185255, Q3998957, Q512755, Q63341) ait mevcut hata/uyarılar görülebilir — bunlar bu parti kapsamında değildir, dokunulmamıştır.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 407 | 400–500 | 3 dk |
| Orta | 1354 | 1300–1600 | 10 dk |
| İleri | 2633 | 2600–3200 | 20 dk |

Üç seviye de §8 hedef aralığında; dolgu/tekrar yok. İleri düzey gerçekten daha derin: kaynak hiyerarşisi, D001 oran çıkarımı, okuma rejimleri, atıf zinciri durumu, metodoloji.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (3 dosya: GAP 2685×3301 PD; Flickr 3727×4116 PD-etiket/NC-izin; WGA 829×1009 PD). **Görseller vision bridge ile İNCELENMEDİ (C050 E)** — vision kotası ana oturumda. Kompozisyon S2 (A) + S3/S4 (B) **METNİNDEN**; "kaynakların betimlediği" ibaresi kullanıldı. **GZ TASLAK.** Görseller projeye kopyalanmadı. **D004:** uygulama görseli (daddc49c8e471108) PD etiketli ama fotoğraf CC BY-NC-SA 2.0 → NC riski; GAP PD alternatif önerildi, lisans kararı insan onayına sunuldu. **D001 metadata oran çıkarımı** (0.813/0.822 ≈ 0.817 ↔ 0.737) ikincil boyutu destekler ama görsel incelenmeden çözüm değildir. **İnsan editör görsel teyidi ZORUNLU.**

## 6. İnsan incelemesi gerektiren noktalar

1. **D001 boyut (C029, D):** birincil 146.5×108 ↔ WD/Commons 199×162.5; çözülmedi. Müze sitesinde hata olasılığı değerlendirilmeli; ana oturum karar vermeli. kunye birincil değeri taşır.
2. **D004 görsel lisansı (C032, D):** PD-Art ↔ fotoğraf CC BY-NC-SA 2.0 (NC riski); GAP PD alternatif; uygulama görseli kararı.
3. **Görsel (C050, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi zorunlu (özellikle üçgen düzen/kıyafet/bilezik gibi atıfsız betimler C044).
4. **D002 versiyon kıyası (C030, D)** ve **D003 Caravaggio tarihi (C031, D):** açık çelişkiler.
5. **Doğrulanmamış data iddiaları:** "1616 akademi" (E008/C047) ve "Artemis/Diana bilezik" (E007/C027) — derslerde kullanılmadı; data düzeltme önerisi.
6. **Biyografik okuma (C022):** Garrard ↔ Pollock/Ciletti tartışması; ders "tartışmalıdır" hedge'ini korur; editör onayı.
7. **Literatür (C051, E):** refs metinleri erişilmedi; B-seviye iddiaların özgün monografi teyidi.
8. **İçerik tonu:** konu şiddet; data "bak" listesi grafik — ders tonu incelemesi.
9. **Veri notları:** circa kaybı (E001), envanter gap (muze_numaralari), sanatçı ölüm 1656↔1652/53, tenebrizm↔chiaroscuro terminoloji, Napoli görsel hash riski.
10. Felsefi yorumlar (İleri §7: Kant-ödünç yücelik, emek poetics) kurum dışı "(yorum)"; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema, çapraz tutarlılık, kelime, quiz A/B, 12 bölüm, CJK 0). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil Uffizi AÇILDI (A); görsel İNCELENMEDİ (E); D001 boyut ve D004 lisans kararları ile görsel teyit insan onayı bekler.**