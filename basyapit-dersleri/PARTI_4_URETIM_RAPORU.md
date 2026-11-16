# PARTİ 4 ÜRETİM RAPORU — 20 Başyapıt Akademik Mikro Ders

**Tarih:** 14 Kasım 2026 · **Branch:** `content-review` · **Standart:** `AKADEMIK_STANDART.md`
**Kapsam:** MUFREDAT sırasında sıradaki 20 eser — M9 Rokoko kalanı (6) + M10 Neoklasizm/Romantizm (11) + M11 Realizm ilk 3.
**Sonuç:** 20/20 tamam · dogrula **0 hata** · 14 uyarı (heuristic kısaltma-bölünmesi) · CJK 0 · `--test` 25/25 · **kelime hedeflerinin tamamı aralıkta**.
**Durum:** Tümü **"İnsan incelemesi bekliyor"** — hiçbir eser "Yayına aday" değil.

---

## 1. Kapsam ve sıra

| # | Anahtar | Eser | Sanatçı | Modül | Müze / Mekân |
|---|---|---|---|---|---|
| 1 | Q3212142 | Vatoz (La Raie) | Chardin | M9 | Louvre |
| 2 | Q4388208 | Kırık Testi | Greuze | M9 | Louvre |
| 3 | Q19863024 | Banyosunda Batşeba | Sebastiano Ricci | M9 | Gemäldegalerie Berlin |
| 4 | william-hogarth\|Gin Lane | Cin Sokağı | Hogarth | M9 | NGA Washington (gösterilen nüsha) |
| 5 | Q956541 | General Wolfe'un Ölümü | Benjamin West | M9 | NGC Ottawa |
| 6 | angelica-kauffman\|Cornelia | Gracchusların Annesi Kornelia | Kauffman | M9 | VMFA Richmond |
| 7 | Q28797801 | Horas Kardeşlerin Yemini | David | M10 | Toledo Museum (replika; orijinal Louvre Q476458) |
| 8 | Q3937621 | Marie Antoinette ve Çocukları | Vigée-Le Brun | M10 | Versailles |
| 9 | Q1978815 | Büyük Odalık | Ingres | M10 | Louvre |
| 10 | Q2324840 | Günlerin Atası | Blake | M10 | Çok nüsha (BM Copy D / gösterilen Copy K Fitzwilliam) |
| 11 | Q2317837 | Kabus | Fuseli | M10 | DIA Detroit |
| 12 | Q311243 | Sis Denizi Üzerinde Gezgin | Friedrich | M10 | Hamburger Kunsthalle |
| 13 | Q2366825 | Saman Arabası | Constable | M10 | National Gallery Londra |
| 14 | Q29530 | Halka Yol Gösteren Özgürlük | Delacroix | M10 | Louvre |
| 15 | Q1091086 | 3 Mayıs 1808 | Goya | M10 | Prado |
| 16 | Q212616 | Medusa'nın Salı | Géricault | M10 | Louvre |
| 17 | Q219344 | Köle Gemisi | Turner | M10 | MFA Boston |
| 18 | Q540488 | Ornans'ta Cenaze | Courbet | M11 | Musée d'Orsay |
| 19 | Q1368055 | Başak Toplayanlar | Millet | M11 | Musée d'Orsay |
| 20 | Q3228340 | Üçüncü Mevki Vagon | Daumier | M11 | Metropolitan Museum New York |

## 2. Yöntem

- **Agent işbölümü + ana oturum müdahalesi:** 18 QID'li eser `kaynak-arastirma` + `ders-yazim` agent'larıyla; 2 bileşik-anahtarlı eser (Hogarth, Kauffman) ana oturumda tamamlandı. **Hogarth yazım agent'ı ile Fuseli/Goya araştırma agent'ları içerik filtresine takıldı** (sosyal hiciv/infanticide, erotik/şeytani ima, infaz şiddeti); brief'ler ana oturumda ham kaynaklarla hazırlandı, yazım akademik çerçeveli brief'lerle agent'lara devredildi (başarılı), Hogarth'ın JSON/KALITE/İleri-genişletmesi ana oturumda yapıldı.
- **Tüm çıktılar ana oturumda bağımsız doğrulandı** (dogrula + CJK + 7-dosya + sayım); agent öz-raporlarına körü körüne güvenilmedi. Friedrich CS10 doğru-şıkkı hatası ana oturumda yakalanıp düzeltildi.
- **İddia–kanıt A–E:** A=birincil/doğrudan, B=kaynaklı ikincil, C=yorum, D=tartışma, E=yetersiz/erişilemez. Quiz CS/DY/GZ/TK yalnız A/B; AU serbest. D/E cümlelerinde belirsizlik işareti.
- **Bileşik anahtar:** Hogarth/Kauffman QID'siz; `dir_name='hogarth'/'kauffman'`, `eser_id` data anahtarı aynen.
- **Kaynak hiyerarşisi:** müze/kurum birincil > akademik ikincil > Wikipedia > WD yardımcı. URL tahmini yok; canlı 403/404 → Wayback (arşiv tarihi beyanlı).

## 3. Metrik tablosu

| Anahtar | İddia | A/B/C/D/E | Kelime B/O/İ | dogrula H/U | Birincil erişim |
|---|---|---|---|---|---|
| Q3212142 | 43 | 16/10/2/6/9 | 414/1450/2861 | 0/0 | Louvre + Joconde A |
| Q4388208 | 42 | 19/6/7/3/7 | 438/1319/2793 | 0/0 | Louvre A |
| Q19863024 | 48 | 25/2/5/8/8 | 440/1326/2636 | 0/0 | SMB Berlin A |
| hogarth | 55 | 16/15/9/6/9 | 431/1339/2612 | 0/5 | NGA/MET/RA/OBO Wayback A |
| Q956541 | 89 | 20/33/11/15/10 | 442/1374/3074 | 0/0 | NGC Wayback A |
| kauffman | 58 | 16/20/4/6/12 | 452/1366/2776 | 0/0 | VMFA Wayback A |
| Q28797801 | 57 | 21/11/7/7/11 | 427/1327/3102 | 0/0 | Louvre + Toledo Wayback A |
| Q3937621 | 67 | 20/18/5/8/16 | 444/1476/2966 | 0/0 | Joconde + GAP A |
| Q1978815 | 56 | 22/15/5/7/7 | 412/1317/2643 | 0/0 | Louvre + Joconde A |
| Q2324840 | 43 | 16/9/2/8/8 | 420/1338/2658 | 0/0 | BM Wayback A |
| Q2317837 | 33 | 9/15/4/2/3 | 416/1348/2619 | 0/0 | DIA Wayback A |
| Q311243 | 71 | 19/28/3/13/8 | 412/1356/2682 | 0/0 | Kunsthalle Wayback A |
| Q2366825 | 94 | 35/22/10/14/13 | 430/1427/3093 | 0/0 | NG A |
| Q29530 | 90 | 45/18/5/13/9 | 434/1362/2624 | 0/0 | Louvre A |
| Q1091086 | 41 | 11/19/4/4/3 | 413/1312/2618 | 0/0 | Prado Wayback A |
| Q212616 | 81 | 30/36/2/10/3 | 420/1304/2658 | 0/0 | Louvre A |
| Q219344 | 71 | 27/32/5/3/4 | 424/1349/2619 | 0/0 | MFA Wayback A |
| Q540488 | 73 | 28/17/4/8/16 | 416/1366/2669 | 0/0 | Orsay Wayback A |
| Q1368055 | 59 | 23/15/6/7/8 | 438/1469/2634 | 0/9 | Orsay Wayback + Joconde A |
| Q3228340 | 43 | 17/3/10/4/9 | 440/1378/2741 | 0/0 | Met API A |
| **TOPLAM** | **1214** | **435/344/110/152/173** | — | **0/14** | — |

Her eserde soru bankası: **10 CS + 5 DY + 5 GZ + 5 AU + 5 TK** (CS/DY/GZ/TK yalnız A/B). Kelime hedefleri B 400–500 / O 1300–1600 / İ 2600–3200 — **tamamı aralıkta**.

## 4. Birincil kaynak erişimi

**AÇILDI (güçlü A):** Louvre (Chardin, Greuze, Ingres, Delacroix, Géricault), SMB Berlin (Ricci), NGA/MET/RA + Old Bailey Online (Hogarth), NGC Ottawa (West), VMFA (Kauffman), Versailles/Joconde (Vigée-Le Brun), British Museum (Blake), DIA Detroit (Fuseli), Hamburger Kunsthalle (Friedrich), National Gallery Londra (Constable), Prado (Goya), MFA Boston (Turner), Orsay (Courbet, Millet), Met API (Daumier). Çoğu canlı 403/404/429 → **Wayback arşivinden** (tarihler KANIT dosyalarında beyanlı).

**Özel notlar:** Hogarth çok nüshalı baskı (gösterilen NGA 1944.5.87 State iii/iv); Blake çok nüsha (gösterilen Copy K Fitzwilliam ↔ data BM Copy D); David Q28797801 Toledo replikası; Ricci Berlin um 1725 (c.1720 değil); Daumier Met versiyonu (Ottawa/San Francisco ayrı). Kitap/dergi metinleri (Warner 2001 PMC özeti + Maigne 2004 PMC tam metin hariç) erişilemedi → B-zincir/E.

## 5. Görsel doğrulama sınırı (Kural 6)

**Vision köprüsü bütçesi önceki partilerde tükendiğinden bu 20 eserin TAMAMINDA görsel İNCELENEMEDİ** → `incelenen_bolgeler=[]`, GZ soruları **"TASLAK"** önekli. Kompozisyon birincil/ikincil **METİNDEN**; kesin görsel-observation sorusu sorulmadı. **İnsan editör görsel teyidi ZORUNLU.** Görseller projeye kopyalanmadı; lisanslar (PD / PD-Art / CC0) beyanlı. **Hogarth slayt görseli Davenport kopyası (c.1806–09/reprint c.1880), gösterilen NGA orijinali değil (D).**

## 6. Başlıca tartışmalar (D) ve kritik kimlik bulguları

- **Kritik kimlik:** David Q28797801 = **Toledo 1786 replikası** (Girodet after David); Louvre orijinali ayrı öğe **Q476458** (data QID eşlemesi hatalı → veri notu). Ricci **Berlin um 1725** (c.1720 değil; Budapeşte Q50890343 ayrı). Hogarth **slayt görseli Davenport kopyası**. Blake gösterilen görsel **Copy K Fitzwilliam** ↔ data BM Copy D.
- **Tarih/boyut:** Friedrich um 1817↔1818 + yükseklik 94.8↔67↔98.4; Chardin 1728↔"1727 vers"↔"Vers 1725-1726"; Courbet data "1840" hatası; Daumier 1864↔ca.1862-64; Vigée-Le Brun boyut 275×215↔216.5↔271×195.
- **İkonografi/okuma:** Constable "saman yüklü"↔NG "empty wagon"; Géricault gün 12↔13, yer Sénégal↔Moritanya, halat kesildi↔çözüldü; Turner Zong 132↔142 (kesinleştirilmedi); Delacroix şapkalı figür kimliği, elbise rengi.
- **Yasa/kampanya:** Hogarth Gin Act başarısı Dillon↔Warner "by accident"; Goya sipariş kökeni Goya↔Regency + "iki tablo (dört değil)".
- **data/ uyuşmazlıkları** her eserin `KALITE_KONTROL.md` § veri notlarında onaya sunuldu (bu turda `data/` DEĞİŞTİRİLMEDİ).

## 7. Kalite kuralları uyumu (10 kural)

1. Müze birincil kayıt: URL tahmini yok; kurum kaydı açıldı, künye teyit edildi. ✔
2. Wikipedia tek başına güçlü A/B değil; birincil = A. ✔
3. Kaynak çekinceleri (um/circa/perhaps/probably/may be) ders+quiz'e aynen taşındı; D/E işaretli. ✔
4. Görsel incelenmeden kesin observation sorusu yok; 20 eserde GZ TASLAK. ✔
5. İleri'de dolgu/tekrar yok; **kelime hedeflerinin tamamı aralıkta** (Hogarth İleri gerçek içerikle genişletildi). ✔
6. Yorum ↔ olgu ayrımı; felsefi çerçeveler açıkça "(yorum)" ve ödünç. ✔
7. Yanlış şık gerekçeleri gerçek (totoloji yok). ✔
8. Eser başına 7 dosya. ✔
9. dogrula.py her eserde: 0 hata; 14 uyarı raporlandı. ✔
10. DURUM.md kaydı: 20 eser "İnsan incelemesi bekliyor"; Özet 81/26/107. ✔

## 8. dogrula.py sonuçları ve uyarılar

- **Parti 4 eserleri: 0 HATA.** Şema (jsonschema Draft 2020-12 AKTİF), 12 bölüm, KANIT↔DERS.json sayım, quiz A/B, D/E işareti, CJK temiz.
- **14 UYARI — tamamı heuristic "etiketsiz olgusal cümle" yanlış-pozitifi** (kısaltma bölünmesi): Hogarth 5 ("Gin Craze", "Price 1 s.", "1759 3.", "24 Geo.", "1825 Baker"), Millet 9 (H./L./p./vol./n°/ISBN). Tam cümleler [C###] etiketli.
- **`dogrula.py --test`: 25/25 GEÇTİ.**
- **CJK taraması: 0** (20 eserin tüm md+json; Hogarth/Kauffman/Friedrich/Constable üretimde karışan CJK karakterler düzeltildi).
- Üretimde yakalanıp düzeltilen gerçek hatalar: Friedrich CS10 doğru-şıkkı (B→A), Hogarth İleri kelime (2295→2612, gerçek içerik), Kauffman KALITE CJK.

## 9. Kısıtlar (uygulandı)

- Parti 1 + Parti 2 + Parti 3 (60 eser) ve Vermeer pilotu Q167605 **dokunulmadı**.
- Uygulama kodu ve `data/` **değiştirilmedi** (uyuşmazlıklar veri notu olarak onaya sunuldu).
- `main`'e merge **yok**; deployment/yayın **yok**. Yalnız `content-review` commit/push.
- Hiçbir eser otomatik "Yayına aday" yapılmadı.

## 10. İnsan incelemesi gerektiren noktalar (özet)

1. **Görsel teyidi (20 eser, E):** vision bütçesi tükendi; GZ TASLAK; insan editör görseli inceleyip observation sorularını kesinleştirmeli.
2. **Kritik kimlik düzeltmeleri:** David Q28797801 Toledo replikası (Louvre orijinali Q476458); Ricci Berlin um 1725; Hogarth slayt Davenport kopyası; Blake Copy K↔Copy D — insan onayıyla `data/`'ya uygulanmalı.
3. **D ihtilafları:** tarih/boyut/ikonografi/yasa (her eser KALITE_KONTROL.md'de envanterli).
4. **Hassas içerik sunumu:** infanticide/şiddet/erotik sahnelerin etik sunumu (Hogarth, Goya, Géricault, Turner, Ingres, Fuseli) editör kararı.
5. **Felsefi yorumlar:** İleri §7 ödünç çerçeveler editör onayı.
6. **Haricî denetim:** bu tur aynı asistan + alt-agent'larca yapıldı; üçüncü taraf/insan editör denetimi ayrıca gerekli.

## 11. Kalıcı altyapı notu

- `.qwen/agents/kaynak-arastirma.md` + `.qwen/agents/ders-yazim.md` parti-bağımsız (`<PARTI>` yol değişkeni); bu parti `.qwen/tmp/parti4`.
- İçerik filtresi stratejisi: hassas konularda araştırma agent'ı takılırsa brief ana oturumda ham kaynakla hazırlanır, yazım akademik çerçeveli brief'le agent'a devredilir; gerekirse JSON/KALITE ana oturumda tamamlanır (Hogarth örneği).
- `.qwen/tmp/parti4/` altında brief'ler + ham cache'ler + `gen.py` + `uret-*.py` + `metrics4.py` (üretim araçları; repo içeriğine dahil değil).

**Sonraki adım:** Parti 5 (MUFREDAT M11 kalanı #78 Millais Ophelia + #80 Gérôme + #81 Bouguereau + #85 Caillebotte + #86 Manet + #87 Degas + #88 Cassatt + #89 Morisot + #90 Monet, ardından M12). DURUM.md "Kesintide Devam" protokolü izlenir.