# KALİTE KONTROL — Q2472983 · Son Akşam Yemeği (Ultima cena / The Last Supper) · Tintoretto

**Tarih:** 14 Kasım 2026 · **Parti:** 2 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti2/Q2472983-brief.md`); ham cache'ler `.qwen/tmp/parti2/`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü Q2472983 için temiz.
- **Toplam iddia:** 45 (C001–C045). **A=12, B=16, C=3, D=4, E=10.**
- **A düzeyi (12):** ICCD birincil (arşiv) — başlık, atıf, teknik, konum, oblik masa, iki ışık, melekler, gündelik figürler, Efkaristiya döngüsü/karşı duvar, Ivanoff okuması, mülkiyet/kataloglama, yaldızlı çerçeve.
- **B düzeyi (16):** boyut, tarih (1592–94 majority), presbiterio yerleşimi, Efkaristiya konusu, Karşı Reform (Gardner zincirli), Palladio/şapel, modeller (Giulio Romano/Titian), üç ışık düzeni, teknik, Trento, Lomazzo, takma ad, "fest of the poors", manna tipolojisi, PD lisans, vizyonel karakter.
- **C düzeyi (3):** ontolojik ışık merdiveni (C043), kutsalın hayata inişi (C044), görünmezlik paradoksu (C045) — açıkça "(yorum)".
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU serbest (C/D/E dahil). Üretimde A/B-dışı kanıt hatası YOK (doğrulandı). Yanlış seçenek gerekçeleri gerçek/bağlamsal (totoloji yok; CS03 çeldiricileri aynı ICCD sayfasındaki gerçek öteki kayıtlar).
- **D/E işareti:** 4 D "(tartışma)" (C017/C035/C036/C037); 10 E "(belirsiz)" (C019–C023, C038–C042); post-pass ile eklendi, temiz.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak (5/5 ipucu "TASLAK" önekli).
- **Sayım tutarlılığı:** KANIT "Sayım: 45 · A=12 · B=16 · C=3 · D=4 · E=10" ↔ DERS.json birebir.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda ham cache'ler yeniden açılıp iddialarla karşılaştırıldı (yalnız taslağı okumak sayılmaz):
- **K5 ICCD (birincil, Wayback 2025-01-20):** ATTRIBUZIONI, MATERIA E TECNICA, LUOGO, ALTRE ATTRIBUZIONI ("...Diaiuti" [sic]), NOTIZIE (Ivanoff/LaRossi, karşı duvar Manna, "Una delle ultime opere (1594)"), CONDIZIONE GIURIDICA, CODICE 0500123375, derleme/güncelleme, CC-BY 4.0 ✓. **Kronoloji alanı YOK** ✓. Canlı 403 (Anubis) beyan edildi.
- **K6 WGA:** 1592-94, 365×568, Palladio 1566–1600, 1592 şapel üçlüsü, "certainly himself", presbiterio sağ duvarı/sunak uzantısı, "bread of angels"/transubstantiation, Giulio Romano + Titian modelleri ✓.
- **K7 FU Berlin:** üç ışık tipi, Bilddiagonale, Schrägsicht/Altars achse, hızlı eskiz/ince boya, Trento 1551 dekreti, Lomazzo 1585, "Leider weiß man wenig", Origenes AÇIKÇA hipotez, Stoichita/Lies anmaları, disegno/colorito + Sebastiano örneği, mesafe etkisi, Max Raphael, "il tintore" ✓.
- **K2/K3 wiki:** enwiki 1592–1594/365×568/Gardner ref; itwiki "intorno al", taverna, üç luminosité, mumlu kek + Amalteo 1574, Lucca "probabilmente", "rotto" diff yorumu ✓.
- **K1 Wikidata:** P571=+1563 precision 9 (ref Zeri 44056 + Guida 2019 s.88), P170/P186/P2048/P2049/P195/P276/P18/P973/P9051/P6216 ✓.
- **K8 Commons:** 1337×850, 771.329 bayt, PD-art/PD-old-100-expired, AttributionRequired=false, WGA credit, "between 1592 and 1594" ✓.
- **K11 data:** basyapitlar (tarih 1563 ↔ ozet 1592–1594; muze "arkası" ↔ ozet "yan duvar"), önbellek yil 1563, eser_ayrintilari "duman→melek", ders_kaynaklari iki "yanlis" bayrak ✓.
- **Dört ihtilaf D** (C017/C035/C036/C037) ve **on belirsizlik E** açıkça envanterlendi; brief'in D/E ifadeleri (intorno al / probabilmente / Alcuni Autori / im Bewusstsein des Hypothetischen) AYNEN korundu.

**Erişilemeyen:** SIGEC PDF (K10; arşiv 404, canlı HTTP 000); Zeri 44056 (URL yok); Guida 2019 s.88, Gardner s.494, Ivanoff 1975, LaRossi 1981, Stoichita (Kritische Berichte 4/2002), Lies 1985, Lomazzo Trattato 1585 (metinler erişilmedi, kaynakçada anıldı — C042).

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12, venv-dogrula): **Q2472983 için 0 hata; 0 uyarı.** DERS.json + SORULAR.json şemaya uygun; ek alan yok; iddia/kaynak kimlikleri eşleşiyor; mükerrer kimlik yok; quiz A/B; D/E belirsizlik işareti; 12 bölüm; durum "İnsan incelemesi bekliyor". **CJK: 0** (7 dosya + uret betiği tarandı).
**Not:** dogrula.py tüm eserler/ dizinini tarar; global SONUÇ'taki hatalar öteki eserlere aittir (parti2 eşzamanlı yazımları sırasında eksik/geçici dosyalar). Q2472983 hiçbir hata/uyarı üretmez.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 420 | 400–500 | 3 dk | aralıkta |
| Orta | 1303 | 1300–1600 | 10 dk | aralıkta |
| İleri | 2633 | 2600–3200 | 20 dk | aralıkta |

Üç seviye de §8 hedef aralığında; dolgu/tekrar yok (yakın-tekrar ve seviyeler-arası ortak cümle kontrolleri temiz). İleri düzey gerçekten daha derin: yöntem/birincil sınırları, tarih zinciri analizi, ışık metaphysik, Origenes hipotezi, kaynak eleştirisi.

## 5. Görsel doğrulama (Kural 6)

Commons metadata: WGA22649.jpg, 1337×850, **Public domain** (PD-art + PD-old-100-expired; Tintoretto ö.1594, 100+ yıl pma); data etiketi/dosya adı uyumlu. **Görsel bu oturumda İNCELENEMEDİ** (vision kotası ana oturumda; C041 E). Kompozisyon/ışık/ikonografi betimleri K5 (A) + K6/K7 (B) METNİNDEN; derslerde "kaynakların betimlediği" kaydıyla. **GZ TASLAK** (5/5). Görsel projeye kopyalanmadı; URL + lisans + kaynak referans. **İnsan editör görsel teyidi ZORUNLU** (özellikle D4 duman/ışık ve masa yönü).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C041, E):** incelenemedi; GZ TASLAK; insan editör teyidi zorunlu.
2. **Tarih (D1, C035):** 1563 ↔ 1592–94; 1563'ün dayanakları (Zeri 44056, Guida 2019 s.88) erişilemedi (C039); SIGEC PDF kronoloji alanı doğrulanamadı. Data düzeltme kararı onaya sunulur.
3. **Yerleşim (D2, C036):** data "ana sunağının arkası" ↔ presbiterio sağ duvarı; "arkası" desteklenmiyor.
4. **Otografi (D3, C017):** WGA "certainly himself" ↔ ICCD "largo intervento di aiuti" (yazarlar belirsiz).
5. **Duman/ışık (D4, C037):** data "duman→melek" ↔ kaynaklar "ışık→melek"; FU Berlin "Rauchgefäß" nüansı; görsel teyit gerekli.
6. **Yahuda teşhisi (E5, C022):** data'da var, erişilen kaynaklarda yok; derslerde kesin bilgi yapılmadı.
7. **Mumlu kek (E3, C021) + Lucca (E4, C020) + önceki versiyonlar (E9, C019):** atıfsız/çözümsüz; belirsiz bırakıldı.
8. **Origenes hipotezi (E6, C023):** açıkça hipotez; Stoichita metni erişilmedi; felsefi yorum C olarak işaretli; sanatçıya etki atfı YOK.
9. **Birincil sınır:** ICCD canlı 403 (arşiv 2025-01-20); scheda güncelliği sınırlı (C040); kronoloji alanı yok.
10. **İkincil literatür (C042, E):** Gardner/Ivanoff/LaRossi/Stoichita/Lies/Lomazzo metinleri erişilmedi.
11. **Otomatik bayrak:** ders_kaynaklari.json iki "yanlis" kayıt (olduğu gibi raporlandı; yorum eklenmedi).

## 7. Yayına adaylık

Otomatik kısım sağlandı (Denetim A + B, şema, kelime, quiz A/B, CJK 0). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil ICCD ARŞİVDEN AÇILDI (A); görsel İNCELENEMEDİ (E); dört ihtilaf D açık; insan editör görsel teyidi + ihtilaf kararı + haricî denetim kritiktir.** data/ DEĞİŞTİRİLMEDİ; uyuşmazlıklar veri notu olarak onaya sunulur.
