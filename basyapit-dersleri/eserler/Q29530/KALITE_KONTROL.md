# KALİTE KONTROL — Q29530 · Halka Yol Gösteren Özgürlük (Le 28 juillet 1830. La Liberté guidant le peuple) · Eugène Delacroix

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ (ham cache üzerinden; canlı yeniden-fetch + haricî denetim BEKLİYOR) · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti4/Q29530-brief.md`); ham cache `.qwen/tmp/parti4/`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Derslerin bütün olgusal cümleleri `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q29530 için temiz.
- **Toplam iddia:** 90 (C001–C090). **A=45, B=18, C=5, D=13, E=9.**
- **Brief eşlemesi:** brief C001–C063 korundu (tek seviye atandı). Brief D1–D13 → C064–C076; brief E1–E18'den ders için gerekenler → C077, C085–C090. Karma iddialar bölündü: C026 betim (A) / Gavroche (C077 E); C033 topoğrafya (A) / ikinci bayrak (C078 B); C034 piramit (A) / Argan (C079 B); C051 restorasyon (A) / Beluga (C080 B); C052 sergiler (A) / vandalizm (C081 B); C053 tarih-kadro (A) / bulgular (C082 B); C061 Antheil (B) / pul (C084 C); C062 Olimpiyat (C) / Gazze (C083 B).
- **A düzeyi:** Louvre birincil K1/K2 (künye/konu/provenans/restorasyon/sergi) + K3 arşiv notice (bağlam/ikonografi/betim). K4 küratör analizi ikincil; K5/K6 satır içi akademik atıflı (kitap metnine erişilmedi → B, atıf zinciri notlu).
- **C düzeyi (yorum):** C016 (TR ad), C057 (banknot), C058 (zayıf miras), C062 (Olimpiyat/John Wick), C084 (pul) — derslerde "(yorum)" işaretli.
- **D düzeyi (tartışma):** C064–C076 — derslerde "(tartışma)" işaretli; hiçbir D quiz doğru cevabı değil.
- **E düzeyi (belirsiz):** C039, C063, C077, C085–C090 — "(belirsiz)" işaretli; C063 ({{cn}} atıfsız) `kullanim=kullanilmadi`, derslerde yalnızca kaynak eleştirisi örneği.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK kanıtları **yalnız A/B** (doğrulandı: A/B dışı 0). 5 AU serbest (D/E dahil, 8 D/E kanıtı). Çeldirici gerekçeleri gerçek/bağlamsal (totoloji 0).
- **GZ TASLAK:** görsel incelenmedi → gen.py gz_taslak; 5 GZ ipucu "TASLAK" ile başlıyor.
- **Belirsizlik korunması:** "au 15 (actuel n°17 ?)" (E1), "possiblement" (E2), "[sic]" (E3), "may be"/"forse" (E4/E5), "probably" (E6/E12), circa/vers korundu; D1–D13 çözülmeden beyan edildi.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Bu oturumda ham cache'ler **yeniden okunup** iddialarla karşılaştırıldı (taslağı yeniden okumak değil, kaynak metnine dönüş):
- **K1/K2 (Louvre güncel, 200):** başlık/Une Barricade, Delacroix 1798–1863, 1830, huile sur toile, 260×325 (aksesuarlı 297×365), imza "Eug. Delacroix.1830" kırmızı sağda yarı yükseklik, RF 129 (1875), Etat/Louvre Peintures, Salle 700 Mollien, achat 08/1831 3.000 frank, tam objectHistory (1831 Salon→…→2023–24 Trémolières/Mugniot), sergi listesi, bibliyografya ✓.
- **K3 (Wayback 2021-01-16, Dorbani notice):** Trois Glorieuses bağlamı, alegori/figür betimleri, "yellow dress", "Signed on the back", "Acquired in 1983 , 1831" (dizgi), mektup "October 28", Luxembourg "only entered ... 1863" ✓.
- **K4 (histoire-image, Dorbani-Bouabdellah 2011):** "habit jaune", "flanc droit sombre", "tromblon à deux canons", "à genoux", "Elle remplace d'Arcole" + editör yanıtı (Lazare 1844), "Achevé en décembre", Marianne anahtar kelimesi ✓.
- **K5/K6 (en/it wikitext):** 2023–24 bulguları (8 kat vernik, açık gri+altın, bot, beyaz bulutlar), vandalizm (AE911, <2 saat), Beluga, Bartholdi, Coldplay, İzler, Antheil, Gavroche "may have influenced", {{cn}} atıfsız cümleler, Argan/Cricco atıfları ✓.
- **K7 (Wikidata):** P571 1830 (P1319 Ekim/P1326 Aralık), P180 preferred Q325956 (Marianne) + Q200539 P462 Q1970335 (ecru) + Q1148444 (blunderbuss), P195 preferred Q3044768, P276 Q4032385 (Room 700), P6216 Q19652 ✓. **K8/K9 (Commons):** 10128×8103 PD Shonagon 2024 / 3133×2480 PD ✓.
- **D1–D13 (C064–C076)** kaynak passage'larıyla doğrulandı; **Louvre İÇİ** çelişkiler (D5, D7) ve K3 dizgi hatası (E10) açık.

**Sınır:** Canlı yeniden-fetch bu yazım oturumunda YAPILMADI (cache'ler 2026-11-14 araştırma oturumundan); kitap metinlerine erişilmedi (C086). **Haricî model/insan editör denetimi ayrıca gereklidir ve BEKLİYOR.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez.

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12): **Q29530 için 0 hata; 0 uyarı.** DERS.json + SORULAR.json şema geçerli; iddia/kaynak kimlikleri eşleşiyor; mükerrer kimlik yok; quiz A/B; D/E belirsizlik işareti; kelime tutarlılığı (json ↔ ölçülen); 12 bölüm; sayım tutarlılığı; totoloji 0. **CJK: 0** (tüm dosyalar). Durum: "İnsan incelemesi bekliyor".
*Not:* Genel dogrula koşusundaki 11 hata / 98 uyarı öteki eserlere aittir (Q212616, Q219344, Q2324840, Q3937621, Q4388208 — henüz yazılmamış parti4 işleri; Q700834 vb. kısa ders uyarıları). Q29530'a ait hata/uyarı YOK.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 434 | 400–500 | 3 dk | ✅ aralıkta |
| Orta | 1362 | 1300–1600 | 10 dk | ✅ aralıkta |
| İleri | 2624 | 2600–3200 | 20 dk | ✅ aralıkta |

Dolgu/tekrar yok: seviyeler arası birebir ortak uzun cümle uyarısı 0; yakın tekrar paragraf uyarısı 0. İleri düzey gerçekten daha derin (tam provenans, restorasyon katmanları, D envanteri, felsefi yorum, metodoloji). Kanıt yetersiz/erişilemez olan yerler (görsel, kitap metinleri) kısa bırakıldı, uydurma yapılmadı.

## 5. Görsel doğrulama (Kural 6)

- **K8 (WD P18, güncel):** 2024 restorasyonu SONRASI, Shonagon 2024-05-02, 10128×8103 px, ~31,2 MB, **Public domain** (AttributionRequired false; kredi önerilir).
- **K9 (restorasyon öncesi):** 3133×2480, PD, ticari galeri reproduksiyonu (zayıf zincir).
- **K13 (yerel):** 400×320, sürüm DOĞRULANMADI.
- **İNCELENMEDİ (C085 E):** vision kotası ana oturumda; bu oturumda yalnızca API metadata. Kompozisyon/ikonografi "kaynakların betimlediği" çerçevesinde K1/K3/K4/K5/K6 metninden. **GZ TASLAK.** Görsel projeye kopyalanmadı; URL + lisans + kaynak referans.
- **Sürüm uyarısı (D10/C073):** elbise rengi sarı (öncesi) ↔ açık gri+altın (sonrası) ↔ ecru (WD); yerel/uzak görselin hangi sürümü gösterdiği ana oturumda kontrol edilmeli. Konu devrim sahnesi; çıplak göğüslü Marianne alegorisi akademik ve açık ayrıntısız betimlendi ("erotic realism" yalnızca kanıt pasajı, tırnak içinde).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C085, E):** incelenmedi; GZ TASLAK; insan editör/ana oturum görsel teyidi ZORUNLU. Yerel görsel sürümü (restorasyon öncesi/sonrası) doğrulanmalı (D10).
2. **D1–D13 (C064–C076):** mektup tarihi (21↔28 Ekim), sanatçıya iade (1832↔vers 1839), 1855 sergi adı (Salon↔Exposition universelle), 1874 edinim↔transfer, Luxembourg ilk giriş (1863↔1832–33, Louvre içi), çerçeveli boyut (3 değer), imza yeri (ön↔arka), silindir şapkalı kimliği, diz çöken figür, elbise rengi, model kaynağı, karanlık yan yönü (FR↔EN), silah terminolojisi — editoryal karar bekliyor.
3. **Zayıf alımlama iddiaları (C057/C058/C062/C084, C):** banknot, 1944/1968/Mitterrand/Milva, Olimpiyat/John Wick, İrlanda pulu — yayına uygunluk kararı; C058 ref'i uyumsuz/ölü (E16).
4. **Erişilemeyen literatür (C086, E):** kitap metinleri erişilmedi; atıf zinciri notlu B iddiaların (Argan, Boime, Warner, Noon, Toussaint, Pool, Cricco-Di Teodoro vb.) birincil teyidi.
5. **Kaynak dizgi/şüpheli (C087/C088):** K3 "Acquired in 1983 , 1831"; K6 euro dönüşümü (KULLANILMAZ).
6. **Felsefi yorumlar (İleri §7, C):** Kantçı yüce, alegori/gerçekçilik, cinsiyetli temsil, halkın özneleşmesi — kurum dışı ödünç lensler; Delacroix etki iddiası YOK; editör onayı.
7. **Veri notları (KANIT §5):** data/ SALT-OKUNUR; "ozgun" TR tekrarı, renk (restorasyon öncesi), eksik kunye/muze_numaralari kaydı, Notre-Dame topoğrafya nüansı, diz çöken figür, silah terminolojisi — data düzeltme önerileri insan onayına sunulur (bu ders data'yı DEĞİŞTİRMEZ).
8. **Canlı yeniden-fetch + haricî model/insan denetimi:** Denetim B ham cache üzerinden yapıldı; canlı doğrulama ve bağımsız denetim BEKLİYOR.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema, çapraz tutarlılık, quiz A/B, kelime, 12 bölüm, CJK 0, D/E işaretleri). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** §12 koşullarından "görsel analiz doğru eser/görselle yapılmış" ve "Denetim A+B tamamlanmış (haricî)" henüz karşılanmadı: görsel İNCELENMEDİ, haricî denetim bekliyor. Birincil Louvre AÇILDI (A); ihtilaflar açık; yorumlar olgulardan ayrıldı. **İnsan editör görsel teyidi + D1–D13 editoryal kararı + haricî denetim olmadan yayımlanmaz.**
