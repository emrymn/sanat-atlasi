# KALİTE KONTROL — Q531329 · Kythera Adası'na Yolculuk (Pèlerinage à l'île de Cythère) · Jean-Antoine Watteau

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti3/Q531329-brief.md`).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q531329 için temiz (0 hata / 0 uyarı)**.
- **Toplam iddia:** 60 (C001–C060). **A=17, B=24, C=8, D=5, E=6.**
- **A düzeyi:** Louvre EN/FR bildirisi + Joconde (künye/provenans/ikonografi/Rodin/terim icadı) + Commons PD. Birincil kanıt Wayback arşivinden (canlı 404).
- **B düzeyi:** Eidelberg *A Watteau Abecedario* (kronoloji/yorum/çizim/etki) + en/fr/it Vikipedi + WD versiyon maddeleri.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU serbest (C/D/E dahil). Üretimde A/B dışı kanıt yok; totolojik çeldirici gerekçesi yok (her yanlış seçeneğin gerçek gerekçesi yazıldı).
- **D/E işareti:** 5 D "(tartışma)" (C040–C044); 6 E "(belirsiz)" (C045–C050); C yorumlar "(yorum)". Post-pass ölçümden ÖNCE çalışır (kelime tutarlılığı).
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak otomatik (5/5 TASLAK).
- **Quiz doğru cevabı D/E'ye dayanmaz;** yön/kabul unvanı gibi ihtilaflar kesin cevaplı soruya girmedi (CS10 doğru cevabı "soru açık" olgusudur, A).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda ham cache'ler yeniden açılıp iddialarla karşılaştırıldı (2026-11-14):
- **S5 Louvre EN (Wayback 2015-11-28)** + **S6 Louvre FR (Wayback 2019/2020)** + **S7 Joconde 000PE002934 (Wayback 2017-10-06):** künye (1717, tuval/yağlıboya, 129×194, INV 8525, Salle 917), provenans (Académie→1793 Muséum central, saisie révolutionnaire), ikonografi (Joconde sujet), Rodin alıntısı, "fête galante" icadı, Rubens+Leonardo, gidiş/dönüş açık soru ✓.
- **S10 Eidelberg Abecedario (Wayback 2021-07-05):** kabul günü 28 Ağustos 1717 + başlık değişikliği; Akademi kronolojisi; kabul unvanı "peintre d'histoire" + "factually incorrect legend"; Levey/Rosenberg/Ferraton/Glorieux; Ostrowski/Sloan; Plax/Cowart; Venedik/Rubens etkisi; çizimler/karşı-provalar; Chaplin; La Caze 1869 ✓.
- **S1 WD + S11/S12/S13 etiket/versiyon batch'leri + S2/S3/S4 wikitext + S8 Commons metadata:** yeniden açıldı; versiyon ayrımı (Q531329/Q41637000/Q19820267) teyit ✓.
- **Beş ihtilaf D olarak açık:** C040 kabul unvanı, C041 agrément, C042 süre, C043 Louvre'a giriş, C044 yön. Birincil Louvre ↔ akademik Eidelberg kabul unvanında doğrudan çelişir; çözümlenmedi.
- **Görsel:** S8 metadata only; vision kotası korundu → İNCELENEMEDİ (C045); GZ TASLAK.
- **Erişilemeyen (C048/C049):** Levey 1961, Grasselli 1984, Coypel INHA metni (JS), Grove, Cowart 2001 vb. refs metinleri; güncel collections.louvre.fr URL (tahmin edilmedi).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft2020-12 AKTİF): **Q531329 için 0 hata / 0 uyarı.** CJK: **0**.
- Not: dogrula.py tüm `eserler/` dizinini tarar; parti 3'te eşzamanlı üretilen **öteki eserlerin** (Q1131176, Q18167078, Q2629559, Q3399440, Q4693305 vb.) eksik-dosya hataları bu esere ait değildir ve dokunulmadı.
- 12 bölüm eşlemesi tam; durum "İnsan incelemesi bekliyor"; `gorsel.dogrulama.incelenen_bolgeler=[]`.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 416 | 400–500 | 3 dk |
| Orta | 1310 | 1300–1600 | 10 dk |
| İleri | 2611 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok (yakın-tekrar ve seviyeler-arası ortak-cümle uyarısı yok). İleri düzey gerçekten daha derin: kaynak eleştirisi, kanıt hiyerarşisi yöntemi, beş ihtilafın envanteri, yorum ekolleri, alımlama tarihi, connoisseurship.

## 5. Görsel doğrulama (Kural 6)

Commons C2RMF retouched dosyası metadata (19842×13013 px, ~93,6 MB, **Public domain**, atıf zorunluluğu yok); **vision kotası korundu → İNCELENEMEDİ (C045 E).** Kompozisyon S5/S6/S7 (A) + S10 (B) METNİNDEN; derslerde "kaynakların betimlediği" ifadesi kullanıldı. **GZ TASLAK.** Görsel projeye kopyalanmadı (URL + lisans + kaynak referans). C2RMF credit kaynak site ölü (2012 arşiv linki). **İnsan editör görsel teyidi ZORUNLU.**

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C045, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi zorunlu (özellikle data hotspot'ları: Venüs hermi, Eros, geriye bakış, yaldızlı kayık, buğulu uzaklık).
2. **Beş ihtilaf (D, C040–C044):** kabul unvanı (birincil Louvre ↔ Eidelberg), agrément 1712↔1714, süre "beş yıl"↔"sekiz ay", Louvre'a giriş 1793↔1795, yön gidiş↔dönüş. Çözümlenmedi; editör kararına sunulur.
3. **Birincil sınır (C049, E):** canlı louvre.fr 404, Joconde err=1201; güncel collections.louvre.fr URL kanıtta yok (tahmin edilmedi). Birincil kanıt arşiv kopyaları; insan editör güncel kaydı teyit etmeli.
4. **Veri notları:** "karlı dağlar" kaynaksız (C046); "Rubens+Venedik" ↔ birincil "Rubens+Leonardo" (C015/C022); "Rodin simultaneite" çerçevesi yalnız frwiki (C036); "MR 2726" referanssız (C032); coğrafi Ege↔Ionian (C050). data/ düzeltilmedi; onaya sunulur.
5. **Literatür (C048, E):** Levey 1961, Grasselli 1984, Coypel INHA metni, Grove, Cowart 2001 vb. refs metinlerine erişilmedi; yalnız bibliyografyada anıldı. Coypel alıntısı (C031) metin doğrulanamadı; quiz'e girmedi.
6. **Felsefi/estetik yorumlar (İleri §7, C058/C059):** frwiki/Baridon/de Piles çerçevesi C düzeyi yorum; olgusal iddia değil; editör onayı.
7. **Versiyon ayrımı:** Louvre Q531329 ↔ Berlin Q41637000 (GK 1198) ↔ Frankfurt Q19820267; Berlin tarihi belirsiz (C047). Karşılaştırma önerileri ve quiz bu ayrımı korur.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + kelime + quiz A/B + CJK 0). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil Louvre/Joconde AÇILDI (A, arşiv); görsel İNCELENEMEDİ (E); beş ihtilaf D açık; insan editör görsel teyidi + güncel kayıt teyidi + ihtilaf kararları kritiktir.**
