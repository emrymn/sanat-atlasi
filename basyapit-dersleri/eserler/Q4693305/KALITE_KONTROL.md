# KALİTE KONTROL — Q4693305 · Tanrı'nın Kuzusu (Agnus Dei / A lamb) · Francisco de Zurbarán

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti3/Q4693305-brief.md`); ham cache `.qwen/tmp/parti3/`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 49 (C001–C049). **A=22, B=8, C=1, D=8, E=10.**
- **A düzeyi (22):** Prado birincil EN (S1) + ES (S2) + eski galeri (S3) — künye, konu, ikonografi, provenance, mühür, konum, başlık, "en üstün versiyon", Palomino. C027 (tek ışık kaynağı) 2014 kaydından A.
- **B düzeyi (8):** C013 (PD, WD+Commons), C021 (Yuhanna 1:29, enwiki→Prado + Met), C024/C025 (diğer versiyonlar + Delenda adlandırma, atıf zinciri; Delenda metni erişilemez), C029–C032 (Met 1987 TAM METİN).
- **C düzeyi (1):** C026 — palet listesi + "tenebrizm" terimi data'ya özgü, erişilen Prado metninde yok (yorum).
- **D düzeyi (8):** C033–C040 (D1 başlık, D2 boyut, D3 konum, D4 yüzey, D5 hale-yazıt, D6 versiyon sayısı, D7 atıf sayfaları, D8 enwiki–Met).
- **E düzeyi (10):** C028 + C041–C049 (tarih, adlandırma, clientele, görsel iddialar, WD 1986, Baticle–Socorro, 1631 yeri, görsel incelenmedi, WD refsiz/metadata).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B (doğrulandı: A/B dışı kanıt yok); 5 AU serbest (C/D/E dahil). Doğru cevaplar D/E'ye dayanmaz; yorum tek doğru cevap yapılmadı.
- **D/E işareti:** 8 D "(tartışma)", 10 E "(belirsiz)" — post-pass + doğal belirsizlik dili; dogrula belirsizlik kontrolü temiz.
- **GZ TASLAK:** görsel incelenemedi → gen.py `gz_taslak` tüm GZ ipuçlarına TASLAK öneki ekledi.
- **Totoloji:** CS çeldirici gerekçeleri bağlamsal (her yanlış şıkkın neden yanlış olduğu açık); totoloji uyarısı yok.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda ham cache'ler yeniden açılıp iddialarla karşılaştırıldı (14 Kasım 2026):
- **S1 Prado EN (Wayback 2026-09-06):** "A lamb", 1635–1640, Oil on canvas, 37.3×62, P007293, Socorro→Durán 1986/giriş 1987, "Rex Ferdinandus" + Junta 3503/1, "five other versions ... probably by private clients ... 1631, 1632, 1639", Palomino 1724, "finest of the five", merino 8–12 ay, "gray table", Maderno/St Cecilia, "most specify 1635-1640", konum "Londres - National Gallery (Temporary Exhibition)" + "Zurbarán 2026-2027". ✓
- **S2 Prado ES (Wayback 2025-01-26):** "Agnus Dei", "mesa gris", "Sala 010A (Expuesto)", nimbo/yazıt YOK ("Otras, como ésta, carecen..."), Portús "resulta improbable", bodegón sınırı, "clientela probablemente privada". ✓
- **S3 eski galeri EN (Wayback 2014-04-28):** "Agnus Dei (The Lamb of God)", P07293, "windowsill", "single light source" (yön yok), "in allusion to Christ's sacrificial death". ✓
- **S11 Met 1987 (TAM METİN, PDF s.285–288/332/335/350):** cat. 52 = San Diego (ca. 1636–40, 35.6×52, TANQUAM AGNUS, Putnam); Prado "Marquesa del Soccoro, Madrid"; "two undated smaller paintings"; Jerez Adoration 1639; 1 Peter 1:29 + John 1:29 + Isaiah 53:7; 692 konsili; León 1595; Carducho 1633; Sánchez Cotán → Norton Simon 1633; San Diego provenance Oudry (?)/Kay/Christie's/Putnam. ✓
- **S7/S8/S9 wikitext:** enwiki John 1:29 + versiyon künyeleri + "contains material on this painting" (D8); eswiki "al menos siete versiones" + Delenda adlandırma + San Fernando; frwiki "six versions" + Acts 8:32/TANQUAM AGNUS/nimbe atfı (D5 versiyon karışıklığı). ✓
- **S5 Commons / S6 WD:** 2952×1750, PD (Yorck/Zenodot GFDL), ImageDescription 38cm (D2), Artist "Unknown author" (E8); WD P217=P007293, P6216 PD, P2048=37.3, P276 P580=1986 (E5), refsiz claim'ler (E6). ✓

**Sekiz ihtilaf D** ve **on belirsizlik E** açıkça beyan edildi; hiçbir D/E kesinleştirilmedi. **Erişilemeyen:** Prado canlı EN+ES (403), S4 eski ES galeri (404 içerik), S10 Delenda publitas (404, snapshot yok), diğer versiyon refs (akademi/El País/Bilbao/sdmart/Gencat).

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12, izole `.qwen/tmp/venv-dogrula`): **Q4693305 için 0 hata / 0 uyarı.** DERS.json + SORULAR.json şemaya uygun; ek alan yok; iddia/kaynak kimlikleri eşleşiyor; mükerrer kimlik yok; bolum_eslesme 12 bölüm; durum "İnsan incelemesi bekliyor". **CJK: 0** (tüm deliverable'lar + uret betiği tarandı). Not: dogrula.py'nin genel çıkışındaki HATA'lar başka eserlere (ör. Q1131176 eksik KANIT) aittir; bu çalışmada onlara DOKUNULMADI.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 415 | 400–500 | 3 dk | ✓ aralıkta |
| Orta | 1382 | 1300–1600 | 10 dk | ✓ aralıkta |
| İleri | 2741 | 2600–3200 | 20 dk | ✓ aralıkta |

**Not:** Kelime hedefleri §8 gereği tahmindir; bu eserde birincil Prado + erişilen Met kataloğu zengin içerik sağladığı için üç seviye de dolgu/tekrar olmadan hedef aralıkta yazıldı. Seviyeler arası birebir uzun cümle tekrarı ve ardışık yakın-kopya paragraf uyarısı yok.

## 5. Görsel doğrulama (Kural 6)

Commons `File:Francisco de Zurbarán 006.jpg` metadata (2952×1750; PD-old-100 + PD-Art/Yorck Project; derleme GFDL Zenodot); **vision kotası ana oturumda → bu oturumda İNCELENEMEDİ (C048 E).** Kompozisyon Prado (S1/S2/S3) + Met (S11) METNİNDEN; "kaynakların betimlediği" dili kullanıldı. **GZ TASLAK.** Görsel projeye kopyalanmadı; URL + lisans + kaynak referans. **İnsan editör görsel teyidi ZORUNLU** — özellikle C028/C044'teki görsel iddialar (yarı kapalı göz, pembe burun, kıvrık boynuz, baş sekiye yaslı, toynaklar üst üste, "ışık soldan") ve D4 yüzey/"taş seki" uyuşmazlığı.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C048, E):** incelenemedi; GZ TASLAK; insan editör görsel teyidi zorunlu. C028/C044 görsel iddiaları (E4) doğrulanmadı.
2. **Sekiz ihtilaf (D):** başlık (C033), boyut 37,3/38/37,5 (C034), konum Madrid↔Londra (C035), yüzey gri masa↔denizlik↔taş seki (C036), hale-yazıt/frwiki (C037), versiyon sayısı 6↔7 (C038), atıf sayfaları (C039), enwiki–Met notu (C040).
3. **Data uyuşmazlıkları (data DEĞİŞTİRİLMEDİ):** "taş seki" + "sunak çağrışımı" (D4), "ışık soldan" (E4), palet/"tenebrizm" terimi (C026), tek yıl "1635" (E1). Önceki "dogrulandi" işaretine (ders_kaynaklari id 87df82785e) güvenilmedi.
4. **Met kataloğu yanlış atıf riski (D8):** cat. 52 = San Diego; Prado için doğrudan künye kaynağı gösterilmemeli. Baticle San Diego'yu ca. 1636–40 tarihler (wiki 1635–1640).
5. **Provenance kayıt çelişkileri (E5/E9/E10):** WD 1986 ↔ giriş 1-IV-1987; Baticle 1987 hâlâ Socorro der; 1631 versiyon yeri GMG↔Madrid.
6. **Adlandırma tartışması (E2):** Delenda "carneros" ↔ Portús "Agnus Dei"; uzlaşma yok, iki görüş birlikte verildi.
7. **Felsefi yorumlar (İleri §7):** Kant/Benjamin ödünç çerçeve + bakış etiği; kurum dışı yorum, editör onayı. Etki iddiası YOK.
8. **Birincil erişim sınırı:** canlı Prado 403 → Wayback arşiv kopyaları (tarihli); bugünkü canlı durum doğrulanamadı. Delenda (S10) erişilemez → diğer versiyon künyeleri atıf zinciriyle B.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + kelime + CJK + quiz A/B). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez (dogrula.py semantik sınırı). Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir.** Birincil Prado Wayback'ten AÇILDI (A); Met 1987 TAM METİN (B); **görsel İNCELENEMEDİ (E) → insan editör görsel teyidi + D/E noktalarının onayı kritiktir.**