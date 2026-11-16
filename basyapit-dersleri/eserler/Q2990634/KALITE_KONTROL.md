# KALİTE KONTROL — Q2990634 · Kompozisyon VII (Composition VII) · Wassily Kandinsky

**Tarih:** 14 Kasım 2026 · **Parti:** 6 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti6/Q2990634-brief.md`); ham cache `.qwen/tmp/parti6/Q2990634-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 54 (C001–C054). **A=17, B=24, C=2, D=4, E=7.**
- **A düzeyi:** Tretyakov birincil canlı (S4) + Wayback 2026-01-02 (S5) → künye/tema/icra/30+ eskiz/kuram/alıntı; Pompidou (S8) → suluboya künyesi; Commons (S6) → PD/lisans/çözünürlük; WD (S1) → metadata durumu (P217/P1480 yok).
- **B düzeyi:** itwiki (S3, Vetrina, akademik kaynakçalı) → provenans/dizi/ikonografi/kuram/yorum; enwiki (S2) → suluboya tarih tartışması. S3 literatürünün metinlerine erişilmedi (C052); iddialar "kaynakçada anıldı" statüsüyle B.
- **C düzeyi (yorum):** C040 tema kombinasyonu (kandinsky.net/enwiki, zayıf zincir), C041 Kübizm/Fütürizm + öncüler (Artsy atfı). Derslerde "(yorum)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU (C/D/E dahil, serbest). Üretimde A/B dışı kanıt hatası YOK. Çeldirici gerekçeleri bağlamsal (totoloji yok); gen.cs_gerekce_iyileştir devrede.
- **D/E işareti:** 4 D "(tartışma)" (C042–C045); 7 E "(belirsiz)" (C046–C052); post-pass ile her D/E etiketli cümlede belirsizlik işareti garantilendi. C029/C043 suluboya tarihi, C022 kronoloji, C032 ikonografi, C015 inskripsiyon aynen korundu.
- **GZ TASLAK:** görsel incelenemedi → gen.gz_taslak (5 GZ sorusunun ipucu "TASLAK…" önekli).

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda ham cache'ler yeniden açılıp iddialarla karşılaştırıldı (2026-11-14):
- **S4 Tretyakov canlı (200, 9.052.680 bayt):** "Кандинский Василий (1866-1944) / Композиция VII / 1913 / Размер - 200 x 300 / Материал - холст / Техника - масло / Инвентарный номер - Инв.13230 / Поступило из Государственного музея нового западного искусства. 1929" birebir ✓. 30+ eskiz, 25–28 Kasım 1913 icrası, Apokalips teması (melekler/atlı/İlyas arabası), "kompozisyon" kuramı, "kürelerin müziği" alıntısı ✓. `__NUXT__` invnum/waydat görünür metinle örtüşür ✓.
- **S5 Wayback (arşiv 2026-01-02T11:02:01Z, 200):** aynı künye ✓. **E003 teyit:** canlı HTML'deki 4 "Мюнхен" geçişi Vereshchagin vb. başka eser kayıtlarına ait; VII katalog metninde Münih/WWII ifadesi YOK → C049 (E), C021/C033 B notla.
- **S8 Pompidou (200):** "Sans titre / Première abstraction / Date de création 1913 / Mine graphite, encre de Chine et aquarelle sur papier / 49,6 x 64,8 cm / Donation de Mme Nina Kandinsky, 1976 / AM 1976-864" ✓; inskripsiyon "KANDINSKY i9i0//Aquarelle i9i0 /(abstraite)" aynen (E008) ✓; **"Composition VII" adı kayıtta yok** → C030 bağı yalnız Dabrowski ✓.
- **S2/S3 wikitext, S1 WD, S6 Commons** yeniden okundu: infobox 200,6×302,2 (atıfsız) ↔ birincil 200×300 (D001); WD P571 precision=yıl, P1480/P217 yok; P135 ref wordpress blogu (E006); Commons 7015×4661 PD-Art, GAC kredisi ✓.
- **Dört ihtilaf D:** C042 boyut, C043 Pompidou tarih tutumu, C044 tema vurgusu, C045 icra süresi. **Yedi belirsizlik E:** C046–C052. D003 provenans boşluğu (1915→1929) belgesiz, uydurulmadı.

**Erişilemeyen:** S3 kaynakçasındaki 18 kitap/makale metni (C052); Google Art & Culture asset sayfası (görsel inceleme yasağı + kota; yalnız credit metadata). Tüm ağ istekleri HTTP 200 (S1–S9).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **Q2990634 için 0 hata / 0 uyarı.** Genel sonuç 0 hata / 111 uyarı (tümü diğer parti eserleri). Bu esere ait 10 heuristik yanlış-pozitif ("II." / "pp." / Rusça alıntı içi nokta cümle bölünmesi) biçim normalizasyonuyla giderildi: "II./I. Dünya Savaşı" → sözcük; Rusça giriş alanı ayrı etiketli cümle; §12 erişilemeyen literatür tabloya çevrildi. **CJK: 0** (Cyrillic korundu, CJK yok). İdempotency: uret yeniden çalıştırıldığında kelime/tablo sabit.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 416 | 400–500 | 3 dk |
| Orta | 1329 | 1300–1600 | 10 dk |
| İleri | 2714 | 2600–3200 | 20 dk |

Üç seviye de hedef aralıkta; dolgu/tekrar yok (yakın-tekrar ve seviyeler-arası birebir cümle kontrolleri temiz). İçerik birincil + atıf zincirli ikincil kaynaklardan derlendi; kanıt yetersiz olan yerler (görsel, provenans ara adımı, etki iddiası) kısa bırakıldı / belirsiz işaretlendi.

## 5. Görsel doğrulama (Kural 6)

Commons metadata: `File:Composition VII - Wassily Kandinsky, GAC.jpg`, 7015 × 4661 px (~22 MB), oran 1.505 ≈ 300/200; **Public domain (PD-Art)**, AttributionRequired=false; kredi **Google Art & Culture**. **Görsel bu oturumda İNCELENMEDİ (C051 E)** — vision kotası ana oturumda; yalnız metadata/lisans/çözünürlük çekildi. Kompozisyon S4 (A) + S3 (B) METNİNDEN; derslerde "kaynakların betimlediği" çerçevesi. **GZ TASLAK.** data hotspot betimleri (göz biçimli düğüm, kürekli kayık, halkalı oval, açık çapraz alan, sağdaki sarmal) DOĞRULANMADI. Görsel projeye kopyalanmadı. **İnsan editör görsel teyidi ZORUNLU.**

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C051, E):** incelenemedi; GZ TASLAK; data hotspot'ları doğrulanmadı; insan editör görsel teyidi zorunlu.
2. **Dört ihtilaf (D):** boyut (C042, birincil↔infobox), Pompidou tarih tutumu (C043), tema vurgusu (C044, Apokalips/Son Yargı/kombinasyon/data tufan), icra süresi ifadesi (C045).
3. **Atıf zinciri kırığı (C049, E003):** itwiki'nin Tretyakov'a atfettiği "Münih'te yapıldı" + "ilk üç Kompozisyon WWII'de yok oldu" ifadeleri katalog metninde yok; C021/C033 B notla; editör kararı.
4. **Provenans boşluğu (C050, D003):** 1915 satın alma ↔ 1929 GMNZI girişi arası belgesiz; ara adım uydurulmadı.
5. **Suluboya tarihi (C029/C043, E002/D002):** imza 1910 ↔ güncel kayıt 1913; Nina/Dabrowski; itwiki "1910 o 1913" ↔ canlı 1913; "i9i0" inskripsiyon rendering'i (E008) normalize edilmeden korundu.
6. **data etki iddiası (C046, E007):** "soyut ekspresyonizmi etkiledi" desteksiz; data düzeltme önerisi (salt-okunur, dokunulmadı).
7. **WD P135 (C047, E006):** hareket referansı wordpress blogu; Blaue Reiter çerçevesi tercih edildi.
8. **"İlk soyut eser" (C048, E001):** kesinleştirilmedi; "kurucu eserlerinden" çerçevesi önerildi.
9. **Felsefi yorumlar (İleri §7):** Kant "yüce" vb. ödünç kavramlar yalnız okuma merceği; etki iddiası YOK; editör onayı.
10. **Envanter boşluğu:** İnv.13230 data/muze_numaralari.json'da yok (boşluk, hata değil); WD P217 yok; brief A değeri sağlar.

## 7. Yayına adaylık

Otomatik kısım sağlandı: temel kimlik/atıf birincilden doğrulanmış · tüm olgusal cümleler kanıt kayıtlı · yorumlar C olarak ayrılmış · quiz cevapları A/B'ye dayanıyor · kaynak bağlantıları erişim durumlarıyla kayıtlı · ciddi çelişkiler açık · Denetim A + B tamamlandı. **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil Tretyakov + Pompidou AÇILDI (A); görsel İNCELENMEDİ (E); insan editör görsel teyidi + ihtilaf/atıf-zinciri kararları kritiktir.**