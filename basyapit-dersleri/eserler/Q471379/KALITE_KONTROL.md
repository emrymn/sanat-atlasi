# KALİTE KONTROL — Q471379 · Çığlık (Skrik / The Scream) · Edvard Munch

**Tarih:** 14 Kasım 2026 · **Parti:** 5 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti5/Q471379-brief.md`); ham cache `.qwen/tmp/parti5/Q471379-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q471379 için 0 hata**.
- **Toplam iddia:** 73 (C001–C073). **A=25, B=16, C=2, D=14, E=16.**
- **A düzeyi:** Nasjonalmuseet birincil nesne kaydı (S6) + "madman" makalesi (S7) + eMunch MM T 2367 (S9) canlı 200 tam metin → künye/teknik/imza/yazı/provenance/sergi/öncül/şiir/figür betimi.
- **B düzeyi:** en/it wikitext (S4/S5) + Britannica Wayback (S12) satır içi atıf zincirleri (hırsızlıklar, satış, pigment, popüler kültür, biçimsel betim).
- **C (yorum):** C072 (felsefi/estetik — itwiki Freud/Kierkegaard atıfsız; Di Stefano Pathosformel), C073 (WD refsiz yardımcı). Ders metninde "(yorum)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU serbest (C/D/E dahil). CS doğru şıkları A/B kanıtlı; her yanlış seçeneğin bağlamsal gerekçesi var (totoloji yok). D/E'den kesin cevaplı soru üretilmedi.
- **D/E işareti:** 14 D "(tartışma)", 16 E "(belirsiz)" — post-pass + metin içi işaretler; dogrula "belirsizlik işareti olmayan D/E cümlesi" uyarısı **vermedi**.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak otomatik (5/5 ipucu "TASLAK" önekli).
- **Etiketsiz olgu:** 1 gerçek cümle düzeltildi ("Provenance, 1901'e… başlar" → [C036]); kalan 13 uyarı heuristic yanlış-pozitif (§3).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Ham cache'ler 14 Kasım 2026'da yeniden açılıp iddialarla karşılaştırıldı (taslağı yeniden okumak değil, kaynağa dönüş):
- **S6** (Nasjonalmuseet NG.M.00939, canlı 200): künye/teknik "Tempera og fettstift på papplate"/imza/çift imza + arka eskiz/yazı + 2008→2020 atıf/provenance 1901 (Munthe MM K 720)/Schou 1910/öncül Despair (Woll M 264)/ilk sergi "Verzweiflung"/Przybyszewski 1894/litografi Liebmann/"Skisse til Skrik Antagelig 1893" ✓.
- **S7** ("madman", canlı 200): 1904 Kopenhag/IR+grafoloji/Guleng "no doubt"/Ford kalem boyanın üstünde/Blomqvist Ekim 1895/Grosch/Obstfelder/Scharffenberg/Laura Gaustad/1930'lar öz-savunma/2022 açılış ✓. **"canvas" ifadesi ↔ S6 karton → D2 iç tutarsızlık not edildi.**
- **S9** (eMunch MM T 2367, canlı 200): "Datert 1892. Notat."/orijinal Norveççe şiir (editoryal işaretli)/"På tegnepapir. Mål [mnglr.]" ✓.
- **S12** (Britannica Wayback 2026-11-03): "tempera and casein"/"Geschrei"/"some 30 prints"/"It is conjectured… Inca mummy"/"on a copy of the picture"/1908 kapak/"precursor to Expressionism" ✓. **"panic" GEÇMİYOR → E7 (C028) doğrulandı.**
- **S4/S5** (en/it wikitext): hırsızlıklar/satış/pigment/ikonografi/Engramma atfı ✓. **YENİ ihtilaf D15 (C059):** enwiki içi fiyat $119.922.600 (NYT, Versions) ↔ $119.922.500 (WSJ, Record sale) — brief'te yoktu, Denetim B'de bulundu; quiz kesin tutar kullanmaz (~120M$, S12).
- **S1/S2** (WD grup + 4 versiyon): P31 group/P527×4/P1480 "probably"/P9121 deprecated/envanterler ✓. **S10** (Commons): PD, 3223×4000, credit Nasjonalmuseet ✓.
- **15 ihtilaf D (C046–C059), 16 belirsizlik E** açık; hedge'ler (no earlier than / probably / may have been / conjectured / Antagelig) AYNEN korundu.

**Erişilemeyen:** Britannica canlı 403 (→ Wayback); MM tablo katalog URL'leri refs'te BULUNAMADI (tahmin edilmedi); Sotheby's lot kaydı URL'siz; kitap/makale metinleri erişilmedi (C071) — yalnız erişilen kayıtların bibliyografyasında görüldü, uydurma bibliyografya yok.

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12 AKTİF): **Q471379 için 0 hata; 13 uyarı.**
- 13 uyarının **tümü** "etiketsiz olgusal cümle adayı (heuristic)" **yanlış-pozitifi**: cümle bölücü kısaltma/başlık/alıntı/kitap adı/kaynakça URL'lerinden bölüyor ("A. Liebmann", "E. Munch", "## 2. Tarihsel bağlam", "Datert 1892.", "*Skrik.", "n. 43", "et al.", "Nov. 1, 2026", nasjonalmuseet URL). İlgili cümlelerin tümü [C###] etiketli; dogrula.py docstring'i bu yanlış-pozitifleri açıkça kabul eder.
- **Kelime hedef aralığı uyarısı YOK** (üç seviye de hedefte). **Yakın tekrar / seviyeler arası ortak cümle uyarısı YOK** (§8 dolgu/tekrar yok). **Totoloji uyarısı YOK.**
- **CJK: 0** (tüm paket: 3 ders + KANIT + KALITE + DERS.json + SORULAR.json).
- Genel dogrula çıktısındaki **2 hata Q698487'ye ait** (eksik DERS.json/SORULAR.json — başka agent'ın tamamlanmamış eseri); Q471379 ile ilgisi yok, dokunulmadı.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 462 | 400–500 | 3 dk |
| Orta | 1401 | 1300–1600 | 10 dk |
| İleri | 2725 | 2600–3200 | 20 dk |

Üç seviye de §8 hedef aralığında; dolgu/tekrar yok. İleri düzey gerçekten daha derin: kaynak hiyerarşisi, 15 ihtilaf envanteri, provenance kuşku işaretleri, ikonografi tartışması, felsefi yorum (açıkça C), metodoloji.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (S10): dosya `Edvard Munch, 1893, The Scream, oil, tempera and pastel on cardboard, 91 x 73 cm, National Gallery of Norway.jpg`; **PD** (AttributionRequired false); 3223×4000; credit Nasjonalmuseet. **GÖRSEL İNCELENEMEDİ** (vision bridge kotası ana oturumda) → **C070 E; GZ TASLAK.** Kompozisyon S6 (A) + S4/S5/S12 (B) METNİNDEN ("kaynakların betimlediği"). Dosya adı tekniği müze kaydıyla uyuşmaz (D2). Q18891156 preferred P18 farklı dosya. Görsel projeye kopyalanmadı; URL+lisans referans. **İnsan editör görsel teyidi ZORUNLU** (özellikle data "boyanmamış karton"/"iki tekne" iddiaları, E10/C066).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C070, E):** incelenemedi; GZ TASLAK; insan editör zorunlu. data görsel iddiaları ("boyanmamış karton", "iki tekne", imza okunaklılığı) S6'da açık ifade yok (C066/E10).
2. **Versiyon karışıklığı (KRİTİK):** Q471379 grup; ders 1893 NM versiyonuna (Q18891156) bağlı. data tek eser gibi işliyor; insan editör versiyon ayrımını teyit etmeli (C001/C002/C068).
3. **15 ihtilaf (D):** başlık (Verzweiflung↔Der Schrei der Natur↔Geschrei), teknik (müze↔wiki↔Britannica↔S7 "canvas"), ikonografi (figür mü doğa mı), yürüyüş tarihi, 1910 boyut/destek, 1895 pastel desteği, litografi sayısı, Ghostface, açık artırma yeri/fiyatı (D15 yeni), yazının yeri, köprü/patika, 1893 pastel malzemesi.
4. **data iç çelişkileri:** biyografiler "ilk adı Umutsuzluk" ↔ "Orijinal adı Doğanın Çığlığı" (D12); "2021'de doğrulandı" → çalışma 2020/duyuru 2021 (E4); eser_notlari "Köprüde çığlık atan figür" (D3+D13). Düzeltme önerileri ana oturuma.
5. **Birincil sınır:** MM tablo katalogları (1893 pastel/1910 boyalı) erişilemedi → envanter/boyut WD/itwiki (B/C); Sotheby's lot kaydı URL'siz → fiyat NYT/WSJ zinciri (B), kesin tutar ihtilaflı (D15).
6. **Felsefi yorum (C072):** itwiki Freud/Kierkegaard atıfsız; Di Stefano Pathosformel (Engramma atfı tutarsız E9). Kurum dışı yorum; editör onayı.
7. **Erişilemeyen literatür (C071):** Singer 2010, Ydstie 2008, Heller 1973, Woll 2008, Tøjner 2013, Aslaksby 2015, Ford 2021, Przybyszewski 1894, Fikke 2017, Prata 2018, Dolnick 2005, Hart 2004, Di Stefano, ColourLex — metne erişilmedi.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + quiz A/B + kelime + CJK 0). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler YAPISAL tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir.** Birincil S6/S7/S9 AÇILDI (A); görsel İNCELENEMEDİ (E); 15 D + 16 E açık. **İnsan editör görsel teyidi + versiyon ayrımı + data düzeltme önerileri kritiktir.**
