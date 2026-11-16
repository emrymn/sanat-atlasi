# KALİTE KONTROL — Q540488 · Ornans'ta Cenaze (Un enterrement à Ornans) · Gustave Courbet

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti4/Q540488-brief.md`); ham cache `.qwen/tmp/parti4/Q540488-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 73 (C001–C073). **A=28, B=17, C=4, D=8, E=16.**
- **A düzeyi:** Orsay birincil arşivleri S7 (2016) / S8 (2018) / S9 (2026) + JocondeLab S13: künye, provenance, sergileme, ikonografi, teknik, manifesto, politik hedge, notice yazarı, görsel hakları, erişim yöntemi.
- **B düzeyi:** wiki satır içi akademik atıf zincirleri (Mack, Chu, Clark, McCarthy, Schapiro, Fried, Kselman, Brooks, Wright, Massonnaud, Brocvielle, Mayaud, Cocchi) — metinlere ERİŞİLMEDİ, zincir notuyla.
- **C düzeyi:** 4 yorum (C068–C071), derslerde "(yorum)" işaretli; felsefi çerçeveler (Hegel/Kant/Benjamin) ödünç, etki iddiası yok.
- **D düzeyi (8):** C043 genişlik, C044 figür sayısı, C045 data tarihi, C046 gaziler, C047 enwiki iç tutarsızlığı, C048 başlık varyantı, C049 köpek rengi, C063 kafatası konumu/sayısı — tümü "(tartışma)" işaretli.
- **E düzeyi (16):** atıfsız frwiki katmanı (C033–C041, C059–C061), WD anomalisi (C062), restorasyon (C042), görsel sınırı (C064), literatür (C066) — tümü "(belirsiz)" işaretli; kesin anlatıya ve doğru cevaplı soruya girmez.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK kanıtı YALNIZ A/B (otomatik kontrol: 0 ihlal); 5 AU serbest (C/D/E dahil). CS doğru şık dağılımı A=2/B=3/C=3/D=2; her yanlış seçeneğin bağlamsal gerekçesi var (totoloji yok). Quiz doğru cevapları D/E'ye dayanmaz; yorum tek doğru cevap yapılmadı.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak 5 soruyu işaretledi.
- **Hedge koruması:** "most likely" (C026), "peut-être" (C038), "probablement" (C037), "il pourrait s'agir" (C020), "entre 1849 et 1850" (C003) aynen taşındı.

## 2. Denetim B — Kaynağa bağımsız geri dönüş (bu oturum, 2026-11-14)

İlk metinden bağımsız turda kaynaklar YENİDEN AÇILDI (yalnız taslak okuma değil):
- **S9 Wayback (2026-11-08) yeniden çekildi → HTTP 200, 124878 bayt.** Alanlar tek tek doğrulandı: "entre 1849 et 1850", "H. 315 ; L. 668", "RF 325", "Salle 7", "Don Mlle Juliette Courbet, 1881", "Manifeste d'une nouvelle esthétique", "grandeur nature", "laideur vulgaire", "couteau à palette", "noirs profonds", "images d'Épinal", "Pays Bas", "identité est un mystère", "il pourrait s'agir", "Pludermarcher", "S.b.g", "1882 à 1986", "affecté", "pavillon du Réalisme", "n°661", çerçeveli 371/724, Oudot/Teste de Sagey/Sylvie Oudot. **"restauration" ve "Pasquali" YOK** → C042 E geçerli.
- **S8 Wayback (2018-03-23) → 200, 57393 bayt; S7 Wayback (2016-12-20) → 200, 30580 bayt.**
- **Canlı Orsay → 403 (5686 bayt, Cloudflare)** — brief'in engel kaydı teyit.
- S13 JocondeLab, en/fr/it wikitext, WD EntityData, Commons imageinfo cache'leri yeniden okundu; brief C001–C042 kaynak pasajlarıyla karşılaştırıldı; cache'deki ek birincil/ikincil pasajlar C050–C073 olarak envantere eklendi (İspanyol siyahları/friz/austerite; antiklerikal→intesa universale; enwiki kompozisyon/kafatası/crucifix/etki; frwiki kritik tepkileri; itwiki fotografik kesme; WD anomalisi; erişim yöntemi).
- **data/ salt-okunur yeniden tarandı:** "1840" hatası 4 dosyada teyit (basyapitlar.tarih, eserler_onbellek.yil, yuruyus.yil, ders_kaynaklari); "kırkı aşkın", "1789 kuşağı", "beyaz-kahverengi av köpeği", kafatası x=0.53, "Jura" etiketi not edildi. data DEĞİŞTİRİLMEDİ.
- **Erişilemeyen:** NYT 2026 (403 + WB bot), Le Monde 2025 (402 + WB 406/0 bayt), tüm kitap/makale metinleri (kaynakçada anıldı, C066).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12 AKTİF): **Q540488 için 0 hata, 0 uyarı.**
- DERS.json + SORULAR.json şema geçerli; 12 bölüm eşlemesi tam; durum "İnsan incelemesi bekliyor"; kelime sayıları JSON ↔ dosya tutarlı.
- CJK taraması: **0** (tüm Q540488 dosyaları + uret betiği).
- Not: dogrula.py genel çıktısındaki 9 hata / 93 uyarı ÖTEKİ eserlere aittir (Q1091086, Q2317837, Q2366825, hogarth eksik dosyaları; öteki eserlerin kelime/tekrar uyarıları). Bu parti yalnız Q540488 üretti; öteki eserlere DOKUNULMADI.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 416 | 400–500 | 3 dk | ✅ aralıkta |
| Orta | 1366 | 1300–1600 | 10 dk | ✅ aralıkta |
| İleri | 2669 | 2600–3200 | 20 dk | ✅ aralıkta |

Dolgu/tekrar yok: yakın-tekrar ve seviyeler-arası birebir cümle kontrolleri temiz. İleri düzey gerçekten daha derin: kaynak eleştirisi (üç arşiv anı, WD anomalisi, atıf zinciri), Fried/Clark/Schapiro tartışmaları, fotoğraf sorunu, ödünç felsefi çerçeveler, küratöryel etik.

## 5. Görsel doğrulama (Kural 6)

- Commons metadata (S10, 200): 2 GAP dosyası — 6045×2779 (6.394.259 bayt) ve 6042×2777 (8.193.230 bayt); **Public domain** (UsageTerms PD, AttributionRequired=false; Courbet ö. 1877, 100+ yıl pma; WD P6216).
- **Görsel İNCELENEMEDİ** (vision kotası ana oturumda) → `incelenen_bolgeler=[]`; kompozisyon "kaynakların betimlediği" formuyla Orsay (A) + wiki (B/E) metninden; **GZ TASLAK**.
- Müzenin kendi fotoğrafı © RMN-Grand Palais (Musée d'Orsay) / Hervé Lewandowski — Commons GAP'tan FARKLI; Joconde "utilisation soumise à autorisation". Ders görseli yeniden yayımlamaz; URL+lisans+kaynak referans verir. Görsel projeye kopyalanmadı.
- data nokta koordinatları (kafatası, köpek, haç, mezarcı, kadınlar) görsel üzerinden doğrulanmadı; köpek rengi (C049) ve kafatası konumu/sayısı (C063) çözümsüz D.

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel teyit (C064, E):** incelenemedi; GZ TASLAK; insan editör görsel incelemesi ZORUNLU (özellikle köpek rengi C049, kafatası konumu/sayısı C063, data koordinatları).
2. **Sekiz ihtilaf (D):** figür sayısı 27/~30/50/40+ (C044 — Orsay sayı vermez, çözümsüz); genişlik 660↔668 (C043); data 1840↔1849–50 (C045); gaziler 1789↔'93 (C046); enwiki 1850–51↔1849–50 (C047); başlık histoire↔historique (C048); köpek rengi (C049); kafatası (C063).
3. **Restorasyon (C042, E):** 2025–26 Pasquali iddiası DOĞRULANMADI; NYT/Le Monde metinleri erişilemez; güncel notice'ta iz yok. Erişim sağlanırsa yeniden değerlendirilmeli; etikete konmamalı.
4. **WD P571 anomalisi (C062, E):** preferred +1900/yüzyıl; qualifier 1849–1850 + Orsay A esas. WD düzeltmesi insan kararı.
5. **frwiki atıfsız katman (E):** grenier/rulo tuval/dikişler (C036), kurşun beyazı/bistre/"probablement bıçak" (C037), geometrik/sakrament okuması (C060), 1848 bağlamı/Le Salut public (C061), Courbet alıntıları (C040), "1847 chef de file" (C041 — kullanılmadı). Birincil/erişilebilir kaynakla teyit gerek.
6. **Literatür (C066, E):** B düzeyi atıf zincirlerinin metinleri erişilmedi (Mack, Chu, Clark, McCarthy, Schapiro, Fried, Kselman, Brooks, Wright, Massonnaud, Brocvielle, Mayaud, Cocchi + Orsay bibliyografyası). Haricî denetimde metinlere erişim önerilir.
7. **Yorumlar (C068–C071):** izleyici konumu, friz/crucifix gerilimi, "Romantizmin gömülüsü" metaforu, Hegel/Kant/Benjamin ödünç çerçeveleri — editör onayı; etki iddiası yok.
8. **data düzeltme ÖNERİLERİ (uygulanmadı):** 1840→1849–1850 (4 dosya); "1789 kuşağı"→"'93 gazileri"; köpek rengi betimi görsel teyit sonrası; "Jura"→"Loue vadisi" (kaynakta "Jura" yok); figür sayısı ifadesinin ihtilaflı olduğu notu. data/ SALT-OKUNUR kaldı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema, çapraz tutarlılık, quiz A/B, kelime, CJK, D/E işaretleri). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.**
- Yapısal testler olgusal/semantik doğruluğu GARANTİ ETMEZ; bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir.
- **Birincil erişim durumu:** Orsay canlı 403 (Cloudflare) → Wayback 2016/2018/2026 AÇILDI (A) + Denetim B canlı yeniden erişim 200; JocondeLab arşiv 200 (A). Birincil kayıt arşiv üzerinden doğrulandı; canlı müze sayfası insan editörce teyit edilmeli.
- Görsel İNCELENEMEDİ (E); GZ TASLAK; restorasyon DOĞRULANMADI (E); 8 ihtilaf açık (D). Bu sınırlar giderilmeden yayına adaylık önerilmez.
