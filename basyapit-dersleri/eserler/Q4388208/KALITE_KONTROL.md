# KALİTE KONTROL — Q4388208 · Kırık Testi (La Cruche cassée.) · Jean-Baptiste Greuze

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti4/Q4388208-brief.md`).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q4388208 için temiz (0 hata / 0 uyarı)**.
- **Toplam iddia:** 42 (C001–C042). **A=19, B=6, C=7, D=3, E=7.**
- **A düzeyi:** Louvre birincil fr/en HTML+JSON (S7/S8/S9) + bağlı kayıtlar MNR 861 (S10) / RF 3801 (S11): künye, tarih "vers", teknik, oval, boyut, envanter, konum, provenans, iki versiyon, Massard 1773, 1777 atölye, eskiz/kopya zinciri, sergi listesi, kaynakça anılması.
- **B düzeyi:** ikincil betim (testi/çeşme, C016), sembolizm serisi (C019), MNR WWII aktarımı (C020), FC katılımcıları (C026), sembolizmin çekinceli sunumu + birincil sessizlik (C027), tür (C042).
- **C düzeyi (yorum):** bekâret okuması (C017), çeşme erkek imgesi (C018), Diderot (C021), blog biyografi (C024/C032), FC çerçevesi (C031), adult gaze (C033).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU serbest (C/D/E dahil). Sembolizm yorumu doğru cevap YAPILMADI; CS10/DY04/TK05 "kaynakların durumu"nu sorar (C027 B), yorumun kendisini değil.
- **E/D işareti:** 3 D "(tartışma)"; 7 E "(belirsiz)"; post-pass ile tüm D/E etiketleri işaretli, temiz.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak (GZ01–05 TASLAK).
- **Brief seviye sapmaları (gerekçeli):** C017 B→C (kullanıcı talimatı + §4; sembolizm yorum); C026 C→B (erişilen sayfada doğrudan beyan). D/E aynen korundu.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Louvre birincil **S7/S8/S9 + S10 (MNR 861) + S11 (RF 3801) 14 Kasım 2026'da CANLI yeniden açıldı (HTTP 200)**; cache ile alan alan karşılaştırıldı (`denetimB-*.json`):
- title / displayDateCreated "vers 1771 - 1772" / dateCreated (imprecision "vers") / materialsAndTechniques "huile sur toile" / currentLocation Salle 932 / ownedBy "Etat" / objectNumber INV 5036+MR 1779 / dimension 1,09×0,87 m → **AYNI**.
- objectHistory (du Barry 1794, iki versiyon Verri, Massard 1773, 1777 atölye "fort admiré", eskiz 1922 Rothschild) → **AYNI**. description (beyaz elbise/balon kol/gül/kurdele+3 çiçek/écharpe) → **AYNI**; **testi/çeşme betimlemede YOK** (C016 B doğrulandı).
- MNR 861: "Copie… inv. 5036", "D'après", 111,5×85, "non exposé", Dorotheum/Wiesbaden 7990/26 juin 1950/1951 OBIP/1959–1989 Mobilier → **AYNI**.
- RF 3801: başlık "Copie ou esquisse originale…", 43×37, legs 1922, Rothschild (1843–1922), R 1551, 1927 CNAM, Salle 932 → **AYNI**.
- bibliography **13 kayıt**, exhibition **11 kayıt** → C025/C030 doğrulandı.
- en/it/fr wikitext + FC (2025) + Plume d'Art arşivi (2024-02-15) yeniden okundu; sembolizm hedged ("presume/on peut imaginer/si può immaginare/que l'on devine") + birincil sessiz (C027).

**Erişilemeyen (C034 E):** Barker 2005 (S15), Barker 2012 Representations 117 (S14 kaynakça), S16 katalog metinleri, S17 Louvre 2023 arşivi (429×3). S12 canlı 404 → S13 arşivi kullanıldı.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft2020-12 **AKTİF**): **Q4388208 → 0 hata; 0 uyarı.** CJK: **0**. 12 bölüm eşlemesi tam; durum "İnsan incelemesi bekliyor"; gorsel.dogrulama.incelenen_bolgeler=[] (incelenmedi).
**Not:** Global koşudaki 10 hata / 85 uyarı başka eserlere aittir (Q212616/Q219344/Q2324840/Q311243 eksik dosya; çeşitli kelime/tekrar uyarıları). Bu esere ve öteki eserlere dokunulmadı.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 438 | 400–500 | 3 dk |
| Orta | 1319 | 1300–1600 | 10 dk |
| İleri | 2786 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok (yakın tekrar ve seviyeler arası ortak cümle uyarısı üretilmedi). Kanıt yetersiz olan alt başlıklar (ör. görsel kompozisyon/ışık/renk) kısa bırakıldı, uydurma yapılmadı (§8).

## 5. Görsel doğrulama (Kural 6)

Commons File:Jean-Baptiste Greuze 001.jpg metadata: 2908×3638 px, PD (PD-Art Yorck Project; PD-old-100-expired; AttributionRequired false). **Görsel İNCELENEMEDİ (vision kotası ana oturumda) → C035 E; GZ TASLAK.** Kompozisyon S9 (A) + S2/S3/S4/S13 (B) METNİNDEN; "kaynakların betimlediği" ibaresi kullanıldı. Louvre resmî fotoğrafları **TELİFLİ** (© GrandPalaisRmn / Michel Urtado, Angèle Dequier) — kullanılmaz/yeniden yayımlanmaz; ders Commons PD taramasını URL+lisans olarak referans verir. Commons ImageDescription sembolizmi olgu gibi sunar → C038/D3. Görsel projeye kopyalanmadı. **İnsan editör görsel teyidi ZORUNLU** (çeşme yönü C039 + data detayları C040).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C035, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi zorunlu.
2. **Sembolizm (C017/C027/C038):** bekâret okuması YORUM; data/eser_notlari + Commons kesin sunuyor → D3 düzeltme adayı; editör onayı.
3. **Tarih (C036, D):** data/WD "1771" ↔ birincil "vers 1771–1772"; WD P1480 yok; "vers" korunmalı.
4. **Boyut (C037, D):** WD 110×85 ↔ birincil 109×87.
5. **Çeşme yönü (C039, E):** data "sağda" ↔ wiki "figürün solu"; perspektif farkı olabilir; görsel teyit.
6. **data görsel detayları (C040, E):** "saten"/"ezilmiş gül"/"şaşkın bakış" metinlerde desteklenmez; doğrulanmadı.
7. **Etik okuma (C031/C033):** "abusée ou violée" + "adult gaze" çerçevesi; anakronizm riski; editör onayı.
8. **Literatür (C034, E):** Barker 2005/2012 + S16 katalogları + S17 arşivi erişilemedi; atıf zinciri "anıldı ama okunmadı".
9. **RF 3801 statüsü (C029, E6):** "copie ou esquisse originale" belirsizliği; teknik analiz gerekir.
10. **Alımlama notları (C022/C023, E):** Dagonet mezar heykeli / Tournus sokağı atıfsız; doğrulanmadı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + Denetim A/B). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil Louvre AÇILDI ve canlı yeniden teyit edildi (A); görsel İNCELENEMEDİ (E); sembolizm yorum olarak işaretli; insan editör görsel teyidi + veri düzeltme kararları kritiktir.**
