# KALİTE KONTROL — Q27097122 · İskender'in Babil'e Girişi (Entrée d'Alexandre dans Babylone) · Charles Le Brun

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti3/Q27097122-brief.md`).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q27097122 için temiz.
- **Toplam iddia:** 41 (C001–C041). **A=24, B=5, C=2, D=4, E=6.** KANIT "Sayım:" satırı DERS.json ile birebir uyumlu.
- **A düzeyi:** Louvre birincil HTML+JSON (S4/S5) + ilgili INV 2968 (S6) + Commons metadata (S8): künye/konu/kompozisyon betimi/biçimsel kaynaklar/eser tarihi/lisans.
- **B düzeyi:** WD (S1/S2) atıf zincirli (Joconde "stated in", erişilmedi); frwiki çekirdek (S3, tek ref → Louvre); WD P276 (S1/S7).
- **C düzeyi (yorum):** C030 ("sans doute le chef-d'œuvre"), C031 (frwiki alegorik "dört okuma", hedge'ler AYNEN).
- **D düzeyi (tartışma):** C032 (D3 Rubens↔Mantegna), C035 (D1 fil), C036 (D2 tarih), C037 (D4 başlık/asa).
- **E düzeyi (belirsiz):** C033 (data görsel detay), C034 (data biyografi/üslup), C038 (görsel incelenmedi), C039 (literatür erişilmedi), C040 (Joconde), C041 (enwiki/itwiki yok).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B kanıtlı; 5 AU serbest (C/D/E dahil). CS doğru şıkları çeşitli (A/B/C/D). Yanlış gerekçeleri gerçek/bağlamsal (totoloji yok).
- **D/E işareti:** her D alıntısı "(tartışma)", her E alıntısı "(belirsiz)" — cümle düzeyinde belirsizlik işareti mevcut; post-pass idempotent.
- **GZ TASLAK:** görsel incelenmedi → gen.py `gz_taslak` otomatik (5/5 ipucu "TASLAK" ile başlar).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

S4/S5 (Louvre birincil HTML+JSON, 200), S6 (INV 2968, 200), S7 (cartelfr yönlendirme, 200), S3 (frwiki wikitext), S1/S2 (WD), S8/S9 (Commons metadata) 14 Kasım 2026'da açıldı ve ham cache'lerden yeniden okundu:
- Künye: Titre/Autre titre, Le Brun "Attribution actuelle", "vers 1664 - 1665" (imprecision "vers"), huile sur toile, 4,5×7,07 m (aksesuar 7,52), INV 2898/MR 1919, Salle 914 Sully, Collection de Louis XIV ✓ (S4/S5).
- Kompozisyon/konu: "Alexandre couronné … deux éléphants", Sémiramis (sceptre+grenade, "unité de l'État", "probablement" Pudicité Mattei), Asma Bahçeler (Quinte-Curce), Bagophanès "serait", tripodlar+çiçekler, Mantegna/Amour et Psyché/Polydore ✓ (S4).
- Eser tarihi: Bernini 1665 Gobelins (Chantelou), Salon 1673 (Loire), 29 çizim (Beauvais), Audran 1676, transposé+Paulet 1963, suite INV 2894/2895/2897 ✓ (S4). INV 2968 "D'après" halı modeli ✓ (S6).
- **Dört ihtilaf D:** fil (data tekil↔Louvre iki), tarih (data 1664↔vers), Rubens (frwiki↔Louvre yok), başlık/asa (couronné↔tüylü miğfer+asa; asa Sémiramis'te).
- **Görsel:** S8 metadata only (10842×6854 px, PD-Art, Shonagon 2024-04-05); vision kotası ana oturumda → İNCELENMEDİ (C038). Louvre sitesi 8 fotoğraf © GrandPalaisRmn telifli (C023), kullanılmadı.

**Erişilemeyen:** Joconde Q809825 (URL yok, C040); Louvre kaynakçasındaki basılı eserler + Quinte-Curce/Nivelon metinleri (yalnız alıntı, C039); enwiki/itwiki (sitelink yok, C041). Wayback kullanılmadı (ölü URL yok).

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12, izole `.qwen/tmp/venv-dogrula`): **Q27097122 için 0 hata / 0 uyarı.** DERS.json + SORULAR.json şemaya uygun; `additionalProperties:false` alanlar temiz; `bolum_eslesme` 12 bölüm; `durum="İnsan incelemesi bekliyor"`; `gorsel.dogrulama.incelenen_bolgeler=[]`.
- **Not (kapsam):** Tam `dogrula.py` koşusu başka eserlerde (Q1131176/Q2629559/Q3399440/Q531329 eksik dosya; Q1140358 kelime tutarsız; Q764831/bosch/duccio vb. kelime/tekrar) hata/uyarı verir; bunlar ÖTEKİ eserlerdir, bu agent dokunmaz. Q27097122 paketi bağımsız olarak temizdir.
- **CJK:** 0 (tüm teslim dosyaları tarandı).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 482 | 400–500 | 3 dk | aralıkta ✅ |
| Orta | 1436 | 1300–1600 | 10 dk | aralıkta ✅ |
| İleri | 2690 | 2600–3200 | 20 dk | aralıkta ✅ |

**Not:** Kelime hedefleri §8 gereği tahmindir; bu eserde birincil Louvre kaydı zengin olduğundan üç seviye de hedef aralıkta, dolgu/tekrar olmadan üretildi (yakın tekrar 0, seviyeler arası birebir ortak uzun cümle 0). Görsel incelenemediği ve literatüre erişilemediği için ilgili alanlar kısa/şerhli bırakıldı (dürüstlük beyanı).

## 5. Görsel doğrulama (Kural 6)

Commons metadata (S8): 10842×6854 px, 28.603.094 bayt, PD (PD-Art), "photo Shonagon 2024-04-05", AttributionRequired false. **GÖRSEL İNCELENMEDİ (C038 E)** — vision kotası ana oturumda; `incelenen_bolgeler=[]`. Kompozisyon Louvre birincil METNİNDEN (C012/C014/C013/C016/C017); "kaynakların betimlediği" dili kullanıldı. **GZ TASLAK (5/5).** Louvre sitesi fotoğrafları TELİFLİ © GrandPalaisRmn (C023) — projeye kopyalanmadı, kullanılmadı; ders yalnız Commons PD dosyasını URL+lisans referans verir. **İnsan editör görsel teyidi ZORUNLU** (özellikle D1 fil sayısı ve D4 başlık/asa).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C038, E):** incelenemedi; GZ TASLAK; insan editör zorunlu. data hotspot/renk/konum detayları (C033) doğrulanmadı.
2. **D1 fil sayısı (C035):** data "bir fil" ↔ Louvre "deux éléphants"; görsel sayım + data düzeltme önerisi.
3. **D2 tarih (C036):** data "1664" ↔ Louvre "vers 1664 - 1665"; "y. 1664–1665" önerisi (circa korunmalı).
4. **D3 biçimsel kaynak (C032):** frwiki Rubens "il semble que" ↔ Louvre Mantegna/antik/Polidoro; Rubens A yapılmadı.
5. **D4 İskender başlığı/asa (C037):** Louvre "couronné" ↔ data "tüylü miğfer + asa"; asa Sémiramis heykelinde; görsel teyit çözer.
6. **Biyografi/üslup (C034, E):** Le Brun "baş ressam/Akademi yöneticisi", "Poussin+Barok", halıların "Avrupa'ya yayılması" bu partide doğrulanmadı; ayrı kaynak gerekir.
7. **Literatür (C039, E) + Joconde (C040, E):** Louvre kaynakçası metinleri ve Joconde kaydı erişilmedi; DOI/ISBN üretilmedi.
8. **Lisans alanı boş (data):** Commons PD (C024) → doldurulabilir; Louvre fotoğrafları telifli (C023). Ana oturum kararı.
9. **Başlık/envanter ayrımı:** INV 2898 (birincil) ↔ INV 2968 ("D'après" halı modeli) ↔ Q18683143 (Pers Kraliçeleri, ayrı eser); etikette netleştirilmeli.
10. **Felsefi yorumlar (İleri §7: Kant/Benjamin/Panofsky ödünç)** kurum dışı çerçevedir; Le Brun'ün bu düşünürlerden etkilendiği iddia edilmez; editör onayı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + kelime + quiz A/B + CJK 0). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir (AKADEMIK_STANDART §11–12). **Birincil Louvre AÇILDI (A); görsel İNCELENMEDİ (E); dört ihtilaf D açık; insan editör görsel teyidi + data düzeltme kararları kritiktir.**