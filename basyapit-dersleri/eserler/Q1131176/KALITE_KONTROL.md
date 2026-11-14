# KALİTE KONTROL — Q1131176 · Sarışın Odalık (L'Odalisque blonde / Ruhendes Mädchen) · François Boucher

**Tarih:** 14 Kasım 2026 · **Parti:** 3 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ (0 hata) · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti3/Q1131176-brief.md`); ham cache `.qwen/tmp/parti3/Q1131176-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Derslerin bütün olgusal cümleleri `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **0 hata**.
- **Toplam iddia:** 61 (C001–C061). **A=21, B=5, C=9, D=13, E=13.**
- **A düzeyi (21):** WRM canlı (K1) + KE arşiv (K3) + Pinakothek arşiv (K5) + DHM CCP (K8) + Christie's arşiv (K9) birincil kayıtları: künye, imza, boyut, envanter, köken, provenance, CCP iadesi, hazırlık çizimi, sergiler, Iconclass, PD.
- **B düzeyi (5):** Victoire önerisi (Laing/Christie's), Brown Odalisque öncül (frwiki+Faroult zinciri), Köln literatürü (KE bibliyografyası), Münih katalog no (WD+Christie's), enwiki Panofsky atfı.
- **C düzeyi (9):** yaş çıkarımı, odalık/Rokoko sınıflaması, versiyon ikonografi farkları (itwiki atıfsız), "çok sayıda kopya", KE pin-up yorumu, enwiki/itwiki renk, WRM merak okuması, fr/it süperlatif — hepsi "(yorum)" işaretli.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU serbest (C/D/E dahil). Üretimde quiz kanıtı A/B dışına taşmadı (dogrula kanit_seviye_kontrol temiz). DY05 ("sitter kesin kanıtlanmıştır" = Yanlış) doğru cevabı C013 **A** düzeyine dayanır (Pinakothek "nicht nachweisen" olgusu), E'ye değil.
- **D/E işareti:** 13 D "(tartışma)", 13 E "(belirsiz)" — post-pass (uret) + inline; dogrula BELIRSIZLIK kontrolü temiz. Hiçbir D/E kesin cevaplı quiz'e girmez.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak otomatik işaretledi.
- **Gerçek gerekçe:** CS yanlış seçenek gerekçeleri bağlamsal (totoloji yok); cs_gerekce_iyileştir + totoloji_kontrol temiz.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

İlk metinden bağımsız turda birincil kaynaklar **yeniden açıldı** (14 Kasım 2026):
- **K1 WRM canlı (200):** "Resting Girl (Louise O'Murphy), 1751, oil on canvas, 59.5 x 73.5 cm, Acquired 1941, WRM 2639"; "two versions ... other one ... Alte Pinakothek"; "although it is uncertain which ... Pompadour's brother"; sarı desenli kumaş; Casanova biyografisi ✓.
- **K3 KE Wayback 2024-06-02:** "1751 ... WRM 2639, Zugang 09.1941 ... Öl, Leinwand ... 59,5 x 73,5 ... Signatur unten rechts F. Boucher / 1751"; provenance ?Marlborough→Fairfax Murray→Charpentier→Gurlitt; "Wiederholung von ... 1166"; Iconclass; "Ancestress of the Pin-Up" ✓.
- **K5 Pinakothek Wayback 2018-05-18:** "Dating 1752 ... 1166 ... AP OG Saal XII ... 59 x 73 ... 1799 aus der Galerie Zweibrücken"; "Splitternackt ... Chaiselongue ... Kohlenbecken"; "lässt es sich nicht nachweisen"; iç hata "Ludwig XIV. 1753" ✓ (AYNEN korundu).
- **K8 DHM CCP canlı (200):** Mü-Nr 22809; 1946.03.28 Eingang / 1946.10.03 Ausgang; "Bought by W.R.M. for RM 100.000,-- from Dr. Gurlitt in autumn 1941"; "Köln (Interzonal-Exchange) ... British mission" ✓.
- **K9 Christie's Wayback 2026-05-26:** çizim 222×362 mm kara kalem+tebeşir + Demarteau baskı; "in preparation for ... Munich, dated 1752 (Laing no. 61)"; Laing atıf teyit; "Possibly Blondel d'Azincourt"; Victoire önerisi; "Dark Odalisque of 1743" ✓.
- **K15/K16 WD, K11–K14 wikitext, K18 Commons metadata** yeniden okundu; seri P31/P527, parça P195/P217/P276/P2049, P1480 "probably", P571=1752 doğrulandı.

**13 ihtilaf D** (C024, C037–C048) ve **13 belirsizlik E** (C049–C061) açık. Sitter "probably / con ogni probabilità / probablement / lässt sich nicht nachweisen" AYNEN korundu; kesinleştirme yapılmadı.

**Erişilemeyen / sınır:** Louvre RF 2140 birincil tablo katalog URL'si **bulunamadı** (C058 E); KE canlı PoW engelli → 2024 arşiv (C054); Pinakothek canlı 404 → 2018 arşiv; Christie's canlı timeout → 2026 arşiv; BStGS envanter PDF'leri çekilmedi (K20); refs kitap/makale metinleri erişilmedi (C060) — yalnız erişilen kayıtların bibliyografyasından aktarıldı, uydurma bibliyografya yok.

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12, `.qwen/tmp/venv-dogrula`): **Q1131176 için 0 HATA.** DERS.json + SORULAR.json şema geçerli; bolum_eslesme 12 bölüm; durum "İnsan incelemesi bekliyor"; kelime tutarlılığı (json ↔ ölçülen) temiz.

**16 UYARI — tamamı heuristic yanlış pozitif** ("etiketsiz olgusal cümle adayı"). dogrula.py'nin cümle bölücüsü ABBR koruma listesinde olmayan kısaltmalarda bölünüyor; sayı taşıyan parça [C###] etiketinden ayrılıyor. Oysa **tam cümlelerin hepsinde [C###] var**:
- "F." (F. Boucher imza alıntısı) → ORTA §1 Köln cümlesi [C003][C005][C006][C008].
- "XV." (Louis XV) → ORTA §3 Casanova cümlesi [C015].
- "ident. acc." → İLERİ §2 CCP cümlesi [C011].
- "## 3." başlık numarası → "Sitter kimliği" başlık parçası (başlık, etiket gerektirmez).
- "pp./p./no./fig./vd./A./J.P./L./P." (bibliyografya) → İLERİ §3/§6/§12 cümleleri [C060]/[C022]/[C032]/[C027]/[C029].
- "XIV." (Ludwig XIV) → İLERİ §9 D3 + §11 kaynak eleştirisi [C039]/[C040].

Bu, dogrula.py docstring'inde belgelenen bilinen sınırdır ("yanlış pozitif verebilir"; semantik garanti değil). İçerik düzeltmesi gerektirmez; etiketler tam cümlede mevcuttur. İki gerçek etiket boşluğu (ORTA §10 üç-katman, İLERİ §8 öncül-türev) üretimde tespit edilip [C010][C011][C009] / [C023][C001] ile kapatıldı.

**Not:** Global dogrula çalıştırmasındaki 6 HATA başka eserlere aittir (Q18167078/Q2629559/Q3399440 — eksik DERS.json/SORULAR.json, öteki parti agent'larının sürmekte olan işleri); Q1131176 ile ilgisi yok, DOKUNULMADI.

**CJK taraması:** 0 (tüm Q1131176 dosyaları; Latin + ↔/→/×/≈ sembolleri, CJK yok).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 421 | 400–500 | 3 dk | ✓ aralıkta |
| Orta | 1339 | 1300–1600 | 10 dk | ✓ aralıkta |
| İleri | 2641 | 2600–3200 | 20 dk | ✓ aralıkta |

Üç seviye de §8 hedef aralığında; dolgu/tekrar yok. İleri düzey gerçekten daha derin: metodoloji, provenance/CCP, sitter tartışması, Iconclass, çizim/baskı üretimi, felsefi yorum (C), 13 ihtilaf envanteri. seviye_tekrar_kontrol temiz (≥5 birebir ortak uzun cümle yok).

## 5. Görsel doğrulama (Kural 6)

Commons imageinfo (4 dosya, 4/4 **Public domain**); **görsel BU OTURUMDA İNCELENMEDİ** (vision kotası ana oturumda) → C059 E. Kompozisyon müze betimlerinden ("kaynakların betimlediği"); **GZ TASLAK**. Görsel projeye kopyalanmadı; URL+lisans+kaynak referans.
- **D1 (kritik):** data ana görseli O'Murphy_de_Boisfaily.jpg Commons credit'ine göre **MÜNİH** (BStGS, 1752); data müze etiketi **Köln 1751**. QID seri öğesi. Görsel-müze uyuşmazlığı insan/görsel teyidi bekler.
- **D10:** WRM "yellow fabric" ↔ data "yeşil kadife"; görsel kontrol gerekir.
- **data detayları:** "mavi kurdele"/"buhurdan" erişilen betimlerde yok; buhurdan ↔ Münih Kohlenbecken; versiyon-spesifik kontrol gerekir (C061).
- Pinakothek arşiv site metni CC BY-SA 4.0 (site içeriği; tablo PD). KE fotoğrafları Rheinisches Bildarchiv Köln.

## 6. İnsan incelemesi gerektiren noktalar

1. **D1 görsel-müze uyuşmazlığı (C037):** ana görsel Münih ↔ data etiketi Köln; hangi versiyonun gösterileceği + QID hassaslaştırma (Q95683812/Q110055074). **Görsel teyit ZORUNLU.**
2. **D10 kumaş rengi (C045):** "sarı" ↔ "yeşil kadife"; görsel inceleme ile çözülmeli.
3. **Sitter (C042/C049):** Louise ↔ Victoire ↔ "nicht nachweisen"; "probably" korunmalı; müze etiketi yumuşatma (eser_notlari kesin gibi yazıyor).
4. **Louvre birincil yok (C058):** RF 2140/53×64/salle 40 frwiki infobox atıfsız; birincil Louvre katalog URL'si bulunamadı → insan editör Louvre kaydını açmalı.
5. **Türev yönü (C024/C055):** WD ↔ KE çelişkisi; "orijinal hangisi" çözümsüz.
6. **Provenance (C041/C051):** KE ↔ WD P127 sırası; ?Marlborough kuşkusu; Charpentier konumu.
7. **Yaş/etik (C016/C031/C056):** model ≈14; KE "provocative" uyarısı; akademik/ayrıntısız dil + anakronizm riski; editör onayı.
8. **Felsefi yorumlar (İLERİ §7, C):** Berger/Kant/Benjamin/Panofsky lensleri kurum dışı yorum; Boucher etkilenimi iddia edilmedi; editör onayı.
9. **WD P528 katalog etiketi (C027):** Q113997007 etiketi cache'te doğrulanamadı (brief "Ananoff 1980"); insan teyidi.
10. **Refs metinleri (C060):** kitap/makale metinlerine erişilmedi; bibliyografya aktarımı insan editörce teyit edilmeli.
11. **Görsel (C059):** GZ TASLAK; insan editör görsel teyidi zorunlu.

## 7. Yayına adaylık

Otomatik kısım sağlandı: temel kimlik/atıf birincil kayıtla doğrulandı · olgusal cümleler kanıt kayıtlı · yorumlar C ile ayrıldı · quiz A/B · kaynak bağlantıları erişim durumlarıyla kayıtlı · 13 çelişki + 13 belirsizlik açık · Denetim A+B tamam. **ANCAK görsel incelenemedi (D1/D10 çözülmedi), Louvre birincili yok, refs metinleri erişilmedi.**

**Durum: "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler, olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir.** data/ DEĞİŞTİRİLMEDİ; uyuşmazlıklar veri notu olarak insan onayına sunulur. commit/push/deploy YAPILMADI.
