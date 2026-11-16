# KALİTE KONTROL — dali · The Persistence of Memory (Belleğin Azmi) · Salvador Dalí

**eser_id:** `salvador-dali|The Persistence of Memory` · **Tarih:** 15 Kasım 2026 · **Parti:** 7
**Standart:** `../../AKADEMIK_STANDART.md` §11–12 · **Brief:** `.qwen/tmp/parti7/dali-brief.md`
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR** · Yayına aday DEĞİL.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Derslerin bütün olgusal cümleleri `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **dali için 0 hata / 0 uyarı**.
- **Toplam iddia:** 69 (C001–C069). **A=19, B=13, C=16, D=5, E=16.** KANIT "Sayım:" satırı DERS.json ile birebir eşit.
- **A düzeyi (19):** MoMA birincil (Wayback 2026-11-02) künye/provenance/küratoryal betim/telif/lisans + Sürrealizm tanımı (Breton 1924, Freud) + Dalí 1929 sahneye çıkış + Gallery 517 "A Surrealist Lens" bağlamı.
- **B düzeyi (13):** satır içi akademik atıflı wiki (Adès, Bradbury, Brook, Nicosia, Zalman, Gardner's, Tush/King, McNeese) — **kitap metinlerine erişilmedi**, zincir notlu; görsel lisans durumu (C066); Disintegration (C068).
- **C düzeyi (16):** Britannica/ARTnews yorumları + atıfsız wiki betimleri; derslerde "(yorum)" işaretli.
- **D düzeyi (5):** D1–D5 → C040–C044; "(tartışma)" işaretli; quiz doğru cevabına girmez.
- **E düzeyi (16):** E1–E11 → C045–C055 + C037/C038/C039/C062/C067; "(belirsiz)" işaretli; kesin anlatıya/quiz'e girmez.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B kanıtlı** (dogrula A/B kontrolü temiz); 5 AU serbest (C/D/E dahil). Yanlış seçenek gerekçeleri bağlamsal (totoloji yok). Doğru cevaplar D/E'ye dayanmaz; yorum tek doğru cevap yapılmaz.
- **GZ TASLAK:** görsel incelenemedi → gen.gz_taslak 5/5 TASLAK işaretledi.
- **Post-pass:** D → "(tartışma)", E → "(belirsiz)" otomatik uygulandı; idempotent.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Ham cache'ler 15 Kasım 2026'da yeniden açılıp iddialarla karşılaştırıldı (taslağı yeniden okumak değil):
- **S1 (MoMA, Wayback 2026-11-02):** künye (1931, oil on canvas, 24.1×33 cm, 162.1934, Given anonymously), provenance (Dalí→Pierre Colle→Levy→MoMA), küratoryal metin (MoMA Highlights 2019), telif © 2026, Licensing (Art Resource/Scala), Explore more (Sürrealizm/Breton 1924/Gallery 517), sanatçı biyografisi (1929) — **doğrulandı (A)**. Canlı 403 (Cloudflare) → Wayback tam snapshot.
- **S3/S4 (en/it wikitext):** Prigogine/Camembert (DVD atfı), Adès görelilik, Bosch "Paradise" (Gardner's), karınca/çocukluk (daliparis ölü + Adès 2022), "iki saat"/Vita segreta (Brook/Nicosia), "Gli orologi molli"/1932 (Brook), 350 $ (Zalman), Costa Brava/Port Lligat betimi (Zalman), sinek/"time flies" (Taylor) — **B, zincir notlu**.
- **S5 (Britannica, Wayback 2026-09-16):** 24×33 yuvarlama, Cape Creus/Mount Pani, görelilik spekülasyon, 1932/250 $, 1954 Disintegration, "halüsinasyon" ifadesi, Great Masturbator (1929), kariyer (1922 Madrid/Buñuel/Lorca) — **C**. Canlı 403 → Wayback.
- **S6 (ARTnews, canlı 200):** yöntem tanımı/"hand-painted dream photographs", 1932 grup sergisi, Cap de Creus/Puig Pení, üç+katı saat, "camembert of time and space", dijital görsel © MoMA/Scala, Miró/Breton/1939 ihraç, Tanguy — **C**.
- **S2/S9 (WD):** P571 yıl, P186 oil+canvas, P2048/2049, P217 duplike, P18 yok, P608 ref'siz, P6216/P3931 telif, P528/P6595 P 265; Q136701577 heykel (P144 türev, bronz, 385 cm, ref'siz) — **yardımcı**.
- **S7/S8 (görsel metadata):** enwiki non-free "Fair use" 371×268; Commons 5 üye, serbest reprodüksiyon yok — **doğrulandı; İNCELENEMEDİ**.
- **S10 (Disintegration):** infobox 1952–1954, metinde 1954; 25.4×33; Dalí Museum St. Petersburg; Carstairs 1954; kuantum teması — **B (ayrı eser)**.

**Denetim B bulguları (kullanılmayan/ düzeltilen iddialar):**
1. enwiki $250/1932 iddiası MoMA'ya atıf verir ama **S1'de bu bilgi yok** → kırık zincir (D1/D2/E1).
2. ARTnews "Paris'e beş yıl önce taşındı" → 1926 ima; S1 1929 ile gerilimli → **kullanılmadı**.
3. ARTnews "1934'te İspanya İç Savaşı" → anakronizm (İç Savaş 1936–39) → **kullanılmadı**.
4. itwiki "Emanuele Rinaldi" NYT atfı kuşkulu (alıntı Einstein'a ait) → **kullanılmadı**.
5. WD P217 "162.1934.0": brief "ref'siz" der; cache'te MoMA ref'li ama P195 qualifier'sız → **düzeltildi** (C053).
6. Brief Q136701577 "P4969/P1480" der; cache'te yok (P144 var, ref'siz) → **düzeltildi** (C067).

**Erişilemeyen:** kitap metinleri (Adès, Bradbury, Gardner's, Brook, Nicosia, Zalman, Liquid Desire, McNeese — kaynakçada anıldı); daliparis.com/dalidimension.com ölü; MoMA Highlights tamamı (yalnız S1 alıntısı); WikiArt sayfası (yalnız HEAD).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12 AKTİF): **dali 0 hata / 0 uyarı.** DERS.json + SORULAR.json şemaya uygun; ek alan yok; enum'lar (seviye/kullanim/durum/tur) geçerli; bolum_eslesme 12; CS/DY/GZ/TK kanıt A/B; yanlış gerekçeleri tam; totoloji yok. **CJK: 0** (6 dosya tarandı). Üretim betiği `.qwen/tmp/parti7/uret-dali.py` (gen.build, dir_name='dali', eser_id bileşik).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 486 | 400–500 | 3 dk | aralıkta |
| Orta | 1427 | 1300–1600 | 10 dk | aralıkta |
| İleri | 2714 | 2600–3200 | 20 dk | aralıkta |

Üç seviye de hedef aralıkta; dolgu/tekrar yok (dogrula yakın-tekrar ve seviyeler-arası tekrar kontrolleri temiz). İleri ders gerçekten daha derin: metodoloji, kaynak eleştirisi, D/E envanteri, felsefi yorum (§7), karşılaştırmalı metodoloji.

## 5. Görsel doğrulama (Kural 6)

- **İNCELENEMEDİ** (vision kotası ana oturumda); yalnız metadata/lisans/çözünürlük.
- enwiki dosyası non-free "Fair use" (371×268, 36.722 bayt); WD P18 yok; Commons'ta serbest reprodüksiyon yok (yalnız türevler).
- Kompozisyon **"kaynakların betimlediği"** (S1/A + S3/S4/S6 B/C); doğrudan gözlem iddiası yok.
- **GZ 5/5 TASLAK**; `gorsel.dogrulama.incelenen_bolgeler=[]`.
- Görsel projeye kopyalanmadı/yeniden yayımlanmadı. **İnsan editör doğru eser/görsel teyidi ZORUNLU.**

## 6. Telif / adil kullanım

- **Eser:** © 2026 Salvador Dalí, Gala-Salvador Dalí Foundation / Artists Rights Society (ARS), New York (S1/A, C010). Dalí ö. 1989 → **TR/AB ölüm+70: 2060'a kadar korumalı** (enwiki "Out of copyright in 2060" kategorisiyle uyumlu).
- **Dijital görsel:** © MoMA, Scala/Art Resource lisanslı (C034); yeniden üretim için Art Resource (K. Amerika) / Scala (diğer) izni gerekir (C015).
- **enwiki dosyası:** non-free fair use (NFUR); serbest değil.
- **data görseli:** WikiArt reprodüksiyonu (HEAD 200, 76.061 bayt); **lisans doğrulanmadı**; eser telifli → adil kullanım notu.
- **Kullanıcı kararı: ADİL KULLANIM** (eğitim/eleştiri). Görsel yeniden yayımlanmaz/kopyalanmaz; derslerde yalnız **URL + lisans + kaynak referansı**; **atıf zorunlu**. `kunye.telif_durumu` dolduruldu; Başlangıç/Orta/İleri'de telif notu var. **Bu not hukuki tavsiye değildir**; yayına önce insan editör/hukuk incelemesi önerilir.

## 7. İnsan incelemesi gerektiren noktalar

1. **Görsel (C066):** İNCELENEMEDİ; GZ 5/5 TASLAK; kompozisyon kaynak betimi → insan editör görsel teyidi zorunlu.
2. **D1 fiyat/edinim (C040):** $250 ↔ $350; birincilde fiyat yok; "donated" ↔ "purchased as a gift" → editör kararı.
3. **D2/E1 ilk sergi (C041/C045):** 1932 NY ↔ Paris 1931 provenance; "By 1934" → teyitsiz.
4. **D5/E2 Camembert + görelilik (C044/C046):** "halüsinasyon" ↔ "düşünme/gözlemleme"; görelilik spekülasyon + Dalí reddi birlikte.
5. **E3/E4 özportre + Bosch (C047/C048):** "an approximation"/"seems" → kesinleştirilmez.
6. **E7 yer adları (C051):** Port Lligat/Cap de Creus/Puig Pení/Mount Pani uzlaşmaz → tek ad dayatılmaz.
7. **E6 "iki saat" (C050):** tek zincir anekdot → bağımsız doğrulama yok.
8. **AYRI ESERLER (C043/C067/C068):** Disintegration (1952–54, St. Petersburg) + Wrocław "Profile of Time" heykeli bu eser değil; ad benzerliği karışıklığı riski.
9. **Veri notu:** `data/basyapitlar.json` [104] **muze BOŞ** → birincil MoMA'yı doğruluyor; data değiştirilmedi, doldurma insan onayına sunulur. WD P217 duplike (C053).
10. **Telif/adil kullanım (§6):** hukuki çerçeve insan editör/hukuk onayı bekler.
11. **Felsefi yorumlar (İleri §7):** Bergson/Freud okuması itwiki yorumu (C065); tarihsel etki iddiası değil → editör onayı.
12. **Literatür:** kitap metinleri erişilmedi (B zincir notlu); haricî model/insan editör denetimi gerekli.

## 8. Yayına adaylık

Otomatik kısım sağlandı (şema, çapraz tutarlılık, quiz A/B, kelime, CJK, D/E işaretleri). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir**. Birincil MoMA AÇILDI (Wayback, A); görsel İNCELENEMEDİ; telif/adil kullanım çerçevesi seçildi; insan editör görsel teyidi + hukuk onayı + D/E kararları kritiktir.
