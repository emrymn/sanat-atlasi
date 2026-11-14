# KALİTE KONTROL — Q1368055 · Başak Toplayanlar (Des glaneuses / The Gleaners) · Jean-François Millet

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti4/Q1368055-brief.md`); ham cache `.qwen/tmp/parti4/`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q1368055 için temiz (0 hata).
- **Toplam iddia:** 59 (C001–C059). **A=23, B=15, C=6, D=7, E=8.** KANIT "Sayım:" satırı DERS.json ile birebir uyumlu.
- **A düzeyi (23):** Orsay birincil (Wayback FR/EN/IT) + Salon livret + Joconde/POP (canlı) → künye, imza, provenance, sergi listesi, ikonografi, kamu malı, müze betimi (üç evre/ışık/karşıtlık/onur).
- **B düzeyi (15):** Smarthistory (erişildi) + en/fr/it wiki atıf zinciri (Fratello, Vardi, Kleiner, Rosenblum, Pollock, Sensier, Moreau-Nélaton, Montout-Richard, Balzac) → alımlama, etki, market, modernleşme bağlamı.
- **C düzeyi (6):** 1914 propaganda (zayıf ikincil), akım etiketleri, sağ/sol basın spliti, "tre grazie" yakıştırması, kuş betimi, Breton "karşıt kutup" — hepsi "(yorum)" işaretli.
- **D düzeyi (7):** boyut, salon, Bischoffsheim, satış fiyatı, Pommery bağış/ölüm, öncül/etching, bibliyografya — hepsi "(tartışma)" işaretli.
- **E düzeyi (8):** Ruth/Boaz hipotezi, Varda/Animal Crossing/Grenadier (atıfsız), About tarih anomalisi, 31 Haziran, AGNSW açılmadı, WD refsiz, görsel incelenemedi, akademik metinler erişilmedi — hepsi "(belirsiz)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU serbest (C/D/E dahil). A/B dışı kanıt YOK; totolojik çeldirici YOK (her yanlış seçeneğin bağlamsal gerekçesi var).
- **GZ TASLAK:** görsel incelenemedi → gen.py `gz_taslak` otomatik uygulandı (5/5 ipucu "TASLAK" önekli).
- **RMN fotoğraf ayrımı:** eser kamu malı (PD-Art); RMN-Grand Palais fotoğrafları izin şartlı; Commons PD taramalar ayrı dosya. Görsel yeniden yayımlanmadı, URL+lisans referans.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Ham cache'ler bu oturumda yeniden açılıp iddialarla karşılaştırıldı (yalnız taslak okuması değil):
- **S1 Orsay FR (Wayback 2026-10-15):** künye/provenance/sergi/Sources/Indexation + katalog yorumu (on yıl, üç evre, ışık, régisseur "vraisemblablement", "pauvres sans doute ... misérabilisme") ✓. Genişlik **110**.
- **S2 Orsay EN (Wayback 2021-05-13):** aynı künye; **Salle 4** (2021) ↔ S1 **Salle 5** (2026) → C041 ✓.
- **S3 Joconde/POP (canlı 200, gömülü JSON):** REF 000PE002031, INV RF 592, **DIMS "H. 83.5, l. 111"** → C040 ✓; APTN "Bischoffsheim (1889)" → C042; BIBL p.230/n°65 → C045; REPR "Seine-et-Marne d" → C038; PHOT izin şartlı ✓.
- **S4 Salon livret (Wayback 2026-09-13):** Peinture n°1936, Delaroche öğrencisi, "à Barbison", 1853 2e classe madalya ✓.
- **S11 Orsay IT (Wayback 2016-08-18):** "Alcune spigolatrici", "Cm 83,5 x 110", İtalyanca yorum ✓ (E4 çözüldü: showUid=341=IT).
- **S12 Smarthistory (Wayback 2025-11-22):** transkript + details; "rural beggars", "mixed message", "not in rags", "below the horizon", 1848 korkusu, "Realism" ✓.
- **S6/S7/S8 wikitext:** satış 3.000/4.000 (Fratello/Moreau-Nélaton) ↔ 2.000 (Sensier) → C043; 1889 300.000 fr; Pommery 1891 ölüm/vasiyet (en) ↔ 1890 usufruit (Orsay) → C044; Saint-Victor/About alıntıları; Balzac; Ruth/Boaz "a pu"; etching 1854/1855 ↔ après 1857 → C034; Banksy; 1914 propaganda; Varda/Animal Crossing/Grenadier (atıfsız) → C036 ✓.
- **S5 Wikidata:** P571 (1857, ref S1), P195/P276 (Orsay), P217 (RF 592), P347, P4701, P6216 (PD); P186/P2048/P2049/P127 refsiz → C049; P127 zinciri S1 ile örtüşüyor ✓.
- **S9/S10 Commons metadata:** 5356×4008 / 5354×4006, PD, GAP credit ✓; **görsel İNCELENEMEDİ**.
- **Yeni tespit (C058):** itwiki'nin Orsay IT'ye atfettiği "eller kızarmış/şişmiş, giysiler yıpranmış, ten yanmış" ayrıntıları S11 metninde YOK → atıf boşluğu, B olarak not edildi.

**Erişilemeyen:** Orsay/Salon/Smarthistory canlı (403 → Wayback); akademik metinler (Fratello, Vardi, Kleiner, Rosenblum, Pollock, Moreau-Nélaton, Sensier, Montout-Richard, Balzac, Kimmelman, AGNSW) — yalnız atıf zinciri (C051). Uydurma bibliyografya/URL/envanter YOK.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12 AKTİF): **Q1368055 için 0 hata.** DERS.json + SORULAR.json şema geçerli; ek alan yok; 12 bölüm eşlemesi tam; durum "İnsan incelemesi bekliyor".
- **Toplam parti sonucu** (tüm eserler): 9 hata / 93 uyarı — hataların tamamı başka eserlerden (Q2366825, Q3228340, Q540488 eksik dosya); Q1368055'e ait HATA YOK.
- **CJK taraması:** 0 (tüm Q1368055 dosyaları).
- **Kelime tutarlılığı:** DERS.json `kelime_sayisi` ↔ ölçülen birebir (438/1469/2634).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 438 | 400–500 | 3 dk | ✓ aralıkta |
| Orta | 1469 | 1300–1600 | 10 dk | ✓ aralıkta |
| İleri | 2634 | 2600–3200 | 20 dk | ✓ aralıkta |

**Not:** Üç seviye de §8 hedef aralığında; dolgu/tekrar yok. §8 "seviyeler arası birebir ortak uzun cümle" uyarısı, İleri §3 prose cümlesi paraphrase edilip İleri §12 kaynakçası farklı wording ile yeniden yazılarak giderildi (6 ortak → 0). "2. sınıf" → "ikinci sınıf" yapılarak kısaltma kaynaklı 2 yanlış pozitif daha azaltıldı.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (2 dosya PD: S9 5356×4008, S10 5354×4006; GAP asset GgHsT2RumWxbtw). **Vision kotası ana oturumda → İNCELENEMEDİ (C050 E).** Kompozisyon Orsay (A) + Smarthistory (B) + wiki (B) METNİNDEN; "kaynakların betimlediği" çerçevesi. **GZ TASLAK (5/5).** RMN fotoğrafları izin şartlı (C010); Commons PD taramalar ayrı. Görsel projeye kopyalanmadı. **İnsan editör görsel teyidi ZORUNLU** — özellikle data "noktalar" betimleri (el toprağa değiyor, pembe kolluk, yüksek ufuk, mavi/kırmızı/sarı başlıklar) ve itwiki atıf boşluğu (C058).

## 6. Kalan uyarılar (heuristic yanlış pozitif)

Q1368055'in 9 uyarısının tamamı `etiketsiz_olgu_tespit` heuristic'inin **katalog kısaltması bölünmesinden** kaynaklanır: cümle bölücü "H.", "L.", "p.", "vol.", "n°", "ISBN ... p." noktalarında cümleyi parçalar; parça, [C###] etiketi tam cümlenin sonunda olduğu için etiketsiz görünür. Oysa ilgili tam cümlelerin tümünde kanıt etiketi mevcuttur:
- İleri §1: boyut (C005/C040) ve bibliyografya (C045) alıntıları — "H. 83.5", "p. 230", "vol. 2".
- İleri §6: boyut varyantları (C005/C040), bibliyografya (C045), About tarih anomalisi (C046) — "p. 103".
- İleri §12: erişilmeyen refs künyeleri (C051) — "p. 857/90/48/13", ISBN.
Bu, dogrula.py'nin belgelenmiş sınırıdır ("yanlış pozitif verebilir"); içerik hatası DEĞİLDİR. Akademik künye özgün biçimi (§15) korunduğu için kısaltmalar değiştirilmedi. İnsan editör bu 9 adayın yanlış pozitif olduğunu teyit edebilir.

## 7. İnsan incelemesi gerektiren noktalar

1. **Görsel (C050, E):** incelenemedi; GZ TASLAK; data "noktalar" + itwiki atıf boşluğu (C058) vision teyidi bekliyor.
2. **Yedi ihtilaf (D):** boyut (Orsay 110 ↔ Joconde 111 ↔ wiki), salon (4→5), Bischoffsheim (1867–1889 ↔ 1889), satış fiyatı (2.000 ↔ 3.000 fr), Pommery (1890 usufruit ↔ 1891 vasiyet; ölüm yılı), öncül/etching (1854/1855 ↔ après 1857), bibliyografya (p.230/n°65 ↔ vol.2 p.320-321/n°8).
3. **Birincil sınır:** iki birincil devlet kaydı (Orsay ↔ Joconde) boyut/bibliyografyada çelişiyor; ders Orsay'ı esas aldı, farkı not etti — editör tercihi onaylamalı.
4. **E kaynaklar:** About "Salon de 1887" anomalisi (C046), Orsay "31/06/1883" geçersiz tarihi (C047), AGNSW açılmadı (C048), WD refsiz (C049), akademik metinler erişilmedi (C051), Varda/Animal Crossing/Grenadier atıfsız (C036).
5. **Ruth/Boaz (C022, E):** hipotez "a pu" korundu; "İncil dindarlığı değil" (C052, B) ile gerilim — editör onayı.
6. **Felsefi yorumlar (İleri §7):** Kant/Benjamin ödünç çerçeve; etki iddiası YOK (anakronizm beyanı); kurum dışı yorum, editör onayı.
7. **data uyuşmazlıkları:** "Realizm'in simge eseri" (C037/E7 ikincil yorum); teknik alanı eksik; veri notları KANIT §5'te — data DEĞİŞTİRİLMEDİ, onaya sunuldu.

## 8. Yayına adaylık

Otomatik kısım sağlandı (0 hata, şema geçerli, quiz A/B, kelime aralıkta, CJK 0, GZ TASLAK). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil Orsay (Wayback) + Joconde (canlı) AÇILDI (A); görsel İNCELENEMEDİ (E); yedi ihtilaf D olarak açık; insan editör görsel teyidi + ihtilaf çözümü + haricî denetim kritiktir.**