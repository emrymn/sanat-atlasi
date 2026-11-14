# PARTİ 3 ÜRETİM RAPORU — 20 Başyapıt Akademik Mikro Ders

**Tarih:** 14 Kasım 2026 · **Branch:** `content-review` · **Standart:** `AKADEMIK_STANDART.md`
**Kapsam:** MUFREDAT sırasında sıradaki 20 eser — Veronese (M6 son) + M7 Barok (9) + M8 Hollanda/Fransa (6, Vermeer pilot atlandı) + M9 Rokoko ilk 4.
**Sonuç:** 20/20 tamam · dogrula **0 hata** · 30 uyarı (tamamı heuristic kısaltma-bölünmesi) · CJK 0 · `--test` 25/25 · **kelime hedeflerinin tamamı aralıkta**.
**Durum:** Tümü **"İnsan incelemesi bekliyor"** — hiçbir eser "Yayına aday" değil.

---

## 1. Kapsam ve sıra

| # | Anahtar | Eser | Sanatçı | Modül | Müze / Mekân |
|---|---|---|---|---|---|
| 1 | Q185255 | Kana'da Düğün | Paolo Veronese | M6 | Louvre |
| 2 | Q3998957 | Farnese Tavanı: Bakkhus ve Ariadne | Annibale Carracci | M7 | Palazzo Farnese, Roma (in situ) |
| 3 | Q318947 | Emmaus'ta Akşam Yemeği | Caravaggio | M7 | National Gallery, Londra |
| 4 | Q3769169 | Holofernes'in Kafasını Kesen Judith | Artemisia Gentileschi | M7 | Uffizi |
| 5 | Q20176925 | Lavta Çalan | Orazio Gentileschi | M7 | NGA Washington |
| 6 | Q63341 | Pezevenk Kadın | Dirck van Baburen | M7 | MFA Boston |
| 7 | Q2653851 | Çarmıhın Dikilişi | Peter Paul Rubens | M7 | Anvers Katedrali (triptik) |
| 8 | Q3998985 | I. Charles Üç Pozisyonda | Anthony van Dyck | M7 | Royal Collection |
| 9 | Q1240092 | Papa X. Innocentius | Diego Velázquez | M7 | Doria Pamphilj, Roma |
| 10 | Q4693305 | Agnus Dei | Francisco de Zurbarán | M7 | Prado |
| 11 | Q512755 | Müsrif Oğulun Dönüşü | Rembrandt | M8 | Hermitage |
| 12 | Q764831 | Aziz Nicholas Yortusu | Jan Steen | M8 | Rijksmuseum |
| 13 | Q1140358 | Arkadya'da Ben de Varım | Nicolas Poussin | M8 | Louvre |
| 14 | Q7731855 | Saba Melikesi'nin Gemiye Binişi | Claude Lorrain | M8 | National Gallery, Londra |
| 15 | Q27097122 | İskender'in Babil'e Girişi | Charles Le Brun | M8 | Louvre |
| 16 | Q3399440 | XIV. Louis'nin Portresi | Hyacinthe Rigaud | M8 | Louvre |
| 17 | Q531329 | Kythera Adası'na Yolculuk | Jean-Antoine Watteau | M9 | Louvre |
| 18 | Q1131176 | Sarışın Odalık | François Boucher | M9 | Seri: WRM Köln / Alte Pinakothek Münih |
| 19 | Q2629559 | Salıncak | Jean-Honoré Fragonard | M9 | Wallace Collection, Londra |
| 20 | Q18167078 | Kleopatra'nın Ziyafeti | G. B. Tiepolo | M9 | NGV Melbourne |

## 2. Yöntem

- **Tam agent işbölümü:** 20 araştırma brief'i `kaynak-arastirma` agent'larınca (salt-okunur, ham kaynak), 20 ders `ders-yazim` agent'larınca üretildi. **Tüm çıktıları ana oturum bağımsız doğruladı** (dogrula + CJK + 7-dosya + sayım); agent öz-raporlarına körü körüne güvenilmedi.
- Agent tanımları bu partide **parti-bağımsız** hâle getirildi: `.qwen/tmp/<PARTI>/` yol değişkeni (bu parti `.qwen/tmp/parti3`); `gen.py` + örnek `uret-Q700834.py` parti3'e kopyalandı.
- **İddia–kanıt A–E:** A=birincil/doğrudan, B=kaynaklı ikincil, C=yorum, D=tartışma, E=yetersiz/erişilemez. Quiz CS/DY/GZ/TK doğru-cevap kanıtı **yalnız A/B**; AU serbest. D/E cümlelerinde belirsizlik işareti.
- **Kaynak hiyerarşisi:** müze/kurum birincil > akademik ikincil > Wikipedia (tek başına A/B değil) > WD yardımcı. URL tahmini yok; canlı 403/404 → Wayback (arşiv tarihi beyanlı).
- **Versiyon ayrımı:** çok versiyonlu eserlerde QID'nin hangi versiyon olduğu WD/sitelink'ten netleştirildi (Caravaggio Londra↔Brera, Artemisia Uffizi↔Napoli, Poussin Louvre↔Chatsworth, Watteau Louvre↔Berlin, Boucher Köln↔Münih, Rigaud Louvre↔Versailles, Tiepolo Melbourne↔Labia↔Londra).

## 3. Metrik tablosu

| Anahtar | İddia | A/B/C/D/E | Kelime B/O/İ | dogrula H/U | Birincil erişim |
|---|---|---|---|---|---|
| Q185255 | 73 | 19/34/2/12/6 | 410/1305/2621 | 0/0 | Louvre A |
| Q3998957 | 65 | 15/26/7/7/10 | 426/1425/3107 | 0/0 | Fransa Büyükelçiliği A (in situ) |
| Q318947 | 58 | 28/12/2/8/8 | 426/1351/2748 | 0/7 | NG A |
| Q3769169 | 58 | 16/26/4/4/8 | 407/1354/2633 | 0/0 | Uffizi A |
| Q20176925 | 42 | 22/3/3/7/7 | 414/1316/2660 | 0/0 | NGA Wayback A |
| Q63341 | 36 | 16/5/5/4/6 | 413/1385/2611 | 0/0 | MFA Wayback A |
| Q2653851 | 70 | 10/36/1/10/13 | 414/1408/2727 | 0/0 | Katedral + Art in Flanders A |
| Q3998985 | 68 | 39/9/3/8/9 | 445/1419/2868 | 0/0 | RCT Wayback A |
| Q1240092 | 60 | 11/25/9/10/5 | 416/1329/2677 | 0/7 | Doria Pamphilj A |
| Q4693305 | 49 | 22/8/1/8/10 | 415/1382/2741 | 0/0 | Prado Wayback A |
| Q512755 | 41 | 13/12/4/3/9 | 433/1420/3103 | 0/0 | Hermitage yeni-format A |
| Q764831 | 59 | 30/5/3/5/16 | 423/1434/2821 | 0/0 | Rijksmuseum A |
| Q1140358 | 63 | 19/19/2/17/6 | 427/1396/2741 | 0/0 | Louvre A |
| Q7731855 | 59 | 33/7/8/6/5 | 430/1310/2633 | 0/0 | NG A |
| Q27097122 | 41 | 24/5/2/4/6 | 482/1436/2690 | 0/0 | Louvre A |
| Q3399440 | 71 | 38/5/2/15/11 | 427/1349/2765 | 0/0 | Louvre + Versailles PDF A |
| Q531329 | 60 | 17/24/8/5/6 | 416/1310/2611 | 0/0 | Louvre Wayback + Joconde A |
| Q1131176 | 61 | 21/5/9/13/13 | 421/1339/2641 | 0/16 | WRM + DHM A |
| Q2629559 | 68 | 38/9/3/10/8 | 424/1337/2724 | 0/0 | Wallace A |
| Q18167078 | 67 | 23/28/1/10/5 | 415/1368/2650 | 0/0 | NGV A |
| **TOPLAM** | **1169** | **454/303/79/166/167** | — | **0/30** | — |

Her eserde soru bankası: **10 CS + 5 DY + 5 GZ + 5 AU + 5 TK** (CS/DY/GZ/TK yalnız A/B). Kelime hedefleri B 400–500 / O 1300–1600 / İ 2600–3200 — **tamamı aralıkta**.

## 4. Birincil kaynak erişimi

**AÇILDI (güçlü A):** Louvre (Veronese, Poussin, Le Brun, Rigaud, Watteau), National Gallery Londra (Caravaggio, Claude), Uffizi (Artemisia), NGA Washington (Orazio), MFA Boston (Baburen), Anvers Katedrali + Art in Flanders (Rubens), Royal Collection (Van Dyck), Doria Pamphilj (Velázquez), Prado (Zurbarán), Hermitage yeni-format (Rembrandt), Rijksmuseum (Steen), WRM Köln + DHM (Boucher), Wallace Collection (Fragonard), NGV Melbourne (Tiepolo), Fransa Büyükelçiliği (Carracci, in situ). Çoğu canlı 403/404/429 → **Wayback arşivinden** açıldı (arşiv tarihleri KANIT dosyalarında beyanlı).

**Özel notlar:** Carracci in situ fresk (müze envanteri yok); Rubens triptik (katedral kaydı); Boucher seri öğesi (WD P195/P217 yok, Köln/Münih ayrı maddeler). Kitap/dergi metinleri (Rooses 1904 ve Met 1987 Baticle TAM METİN hariç) erişilemedi → B-zincir/E.

## 5. Görsel doğrulama sınırı (Kural 6)

**Vision köprüsü bütçesi önceki partide tükendiğinden bu 20 eserin TAMAMINDA görsel İNCELENEMEDİ** → `gorsel.dogrulama.incelenen_bolgeler=[]`, GZ soruları **"TASLAK"** önekli. Kompozisyon birincil/ikincil **METİNDEN**; kesin görsel-observation sorusu sorulmadı. **İnsan editör görsel teyidi ZORUNLU.** Görseller projeye kopyalanmadı; lisanslar (PD / PD-Art) beyanlı. Artemisia data görseli CC BY-NC-SA riski (GAP PD alternatif önerildi); Fragonard Art UK CC BY-NC-ND; Louvre/Wallace site fotoğrafları telifli (kullanılmadı).

## 6. Başlıca tartışmalar (D) ve veri uyuşmazlıkları (DEĞİŞTİRİLMEDİ)

- **Kritik düzeltmeler (ham kaynakla):** Baburen Vermeer arka planı **The Concert + Lady Seated at a Virginal** (Süt Boşaltan Kadın DEĞİL — MUFREDAT M7 "44↔52" öncülü hatalı); Rubens WD P217=10012 aslında **1747 gravür/ets** (triptik env 947); Orazio data cinsiyet "erkek"↔NGA "young woman"; Boucher data "1751 Köln" ↔ ana görsel **Münih** versiyonu; Velázquez "troppo vero" Kauffmann s.308 atfı **çürütüldü** (rivayet); Le Brun data "bir fil"↔Louvre "deux éléphants".
- **Tarih:** Caravaggio data 1933↔NG 1839; Fragonard data 1766↔about 1767–68; Poussin data 1637–39 desteksiz (Louvre vers 1638); Rigaud/Watteau/Rembrandt tarih kümeleri.
- **Boyut/teknik:** Artemisia 146.5×108↔199×162.5; Zurbarán 37.3↔38↔37.5; Claude WD 193.7↔NG 196.7; Van Dyck boyut yönü ters.
- **Versiyon/kopya:** Poussin Chatsworth↔Louvre; Watteau Berlin↔Louvre; Rigaud Versailles replika↔Prado Namur varyantı; Tiepolo Melbourne↔Labia↔Londra; Le Brun INV 2898↔2968 "D'après".
- **data/ uyuşmazlıkları** her eserin `KALITE_KONTROL.md` § veri notlarında onaya sunuldu (bu turda `data/` DEĞİŞTİRİLMEDİ).

## 7. Kalite kuralları uyumu (10 kural)

1. Müze birincil kayıt: URL tahmini yok; kurum kaydı açıldı, künye teyit edildi. ✔
2. Wikipedia tek başına güçlü A/B değil; birincil = A. ✔
3. Kaynak çekinceleri (circa/probably/peut-être/may) ders+quiz'e aynen taşındı; D/E işaretli. ✔
4. Görsel incelenmeden kesin observation sorusu yok; 20 eserde GZ TASLAK. ✔
5. İleri'de dolgu/tekrar yok; **kelime hedeflerinin tamamı aralıkta** (yakın-tekrar + seviyeler-arası tekrar kontrolleri temiz). ✔
6. Yorum ↔ olgu ayrımı; felsefi çerçeveler açıkça "(yorum)" ve ödünç. ✔
7. Yanlış şık gerekçeleri gerçek (totoloji yok). ✔
8. Eser başına 7 dosya. ✔
9. dogrula.py her eserde: 0 hata; 30 uyarı raporlandı. ✔
10. DURUM.md kaydı: 20 eser "İnsan incelemesi bekliyor"; Özet 61/46/107. ✔

## 8. dogrula.py sonuçları ve uyarılar

- **Parti 3 eserleri: 0 HATA.** Şema (jsonschema Draft 2020-12 AKTİF), 12 bölüm, KANIT↔DERS.json sayım, quiz A/B, D/E işareti, CJK temiz.
- **30 UYARI — tamamı heuristic "etiketsiz olgusal cümle" yanlış-pozitifi** (cümle bölücü kısaltmalar: "F./XV./XIV./no./pp./Hon./ss./fig./vd." vb.): Boucher 16, Velázquez 7, Caravaggio 7. Tam cümlelerin hepsinde [C###] mevcut; gerçek etiket boşlukları üretimde kapatıldı. Rigaud (5) ve Tiepolo (6) heuristic uyarıları agent'larca giderildi (0'a indi).
- **`dogrula.py --test`: 25/25 GEÇTİ.** (Yapısal reddetme; semantik/olgusal doğruluk garantisi değil.)
- **CJK taraması: 0** (20 eserin tüm md+json; üretimde karışan CJK karakterler düzeltildi).
- Üretimde yakalanıp düzeltilen gerçek hatalar: Fragonard "bilinmeyen kaynak data" (5 iddia), Zurbarán DERS_ILERI kelime tutarsızlığı (json 2407↔ölçülen 2718).

## 9. Kısıtlar (uygulandı)

- Parti 1 + Parti 2 (40 eser) ve Vermeer pilotu Q167605 **dokunulmadı**.
- Uygulama kodu ve `data/` **değiştirilmedi** (uyuşmazlıklar veri notu olarak onaya sunuldu).
- `main`'e merge **yok**; deployment/yayın **yok**. Yalnız `content-review` commit/push.
- Hiçbir eser otomatik "Yayına aday" yapılmadı.

## 10. İnsan incelemesi gerektiren noktalar (özet)

1. **Görsel teyidi (20 eser, E):** vision bütçesi tükendi; GZ TASLAK; insan editör görseli inceleyip observation sorularını kesinleştirmeli.
2. **D ihtilafları:** tarih/boyut/teknik/ikonografi/versiyon (her eser KALITE_KONTROL.md'de envanterli).
3. **Kritik veri düzeltmeleri:** §6 (Baburen Vermeer bağı, Rubens WD nesne karışıklığı, Orazio cinsiyet, Boucher versiyon etiketi, Le Brun fil sayısı) insan onayıyla `data/`'ya uygulanmalı.
4. **Lisans:** Artemisia NC riski, Fragonard Art UK NC-ND, Louvre/Wallace telifli fotoğraflar — görsel seçim politikası kararı.
5. **Felsefi yorumlar:** İleri §7 ödünç çerçeveler editör onayı.
6. **Haricî denetim:** bu tur aynı asistan + alt-agent'larca yapıldı; üçüncü taraf/insan editör denetimi ayrıca gerekli.

## 11. Kalıcı altyapı notu

- `.qwen/agents/kaynak-arastirma.md` + `.qwen/agents/ders-yazim.md` artık **parti-bağımsız** (`<PARTI>` yol değişkeni); sonraki partilerde yeniden kullanılabilir.
- `.qwen/tmp/parti3/` altında 20 brief + ham cache'ler + `gen.py` + `uret-*.py` + `metrics3.py` (üretim araçları; repo içeriğine dahil değil).
- Erotik/şiddet konuları (Baburen, Boucher, Fragonard, Artemisia) akademik ve açık ayrıntısız betimlendi; agent içerik filtresine takılmadı.

**Sonraki adım:** Parti 4 (MUFREDAT M9 kalanı #63 Chardin Vatoz + #64 Greuze + #58 Ricci + #65 Hogarth + #66 West + #67 Kauffman, ardından M10). DURUM.md "Kesintide Devam" protokolü izlenir.