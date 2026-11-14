# KALİTE KONTROL — Q140161127 · Çarmıhtan İndiriliş (Deposizione dalla Croce) · Daniele da Volterra

**Tarih:** 14 Kasım 2026 · **Parti:** 2 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti2/Q140161127-brief.md`); ham cache `.qwen/tmp/parti2/Q140161127-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz (0 hata).
- **Toplam iddia:** 48 (C001–C048). **A=12, B=18, C=6, D=6, E=6.** KANIT "Sayım:" satırı DERS.json ile birebir uyumlu.
- **A düzeyi:** S9 birincil kurumsal (güncel/özgün konum, şapel programı Cespedes/Dupredo, kilise tarihi, özgün Orsini→Immacolata, Della Rovere) + S1/S3 lisans + başlık/konu.
- **B düzeyi:** S10 Treccani DBI akademik (sözleşme 1541, Elena Orsini 1545/1548, kariyer, Michelangelo ilişkisi, Son Yargı yüzleşmesi, Braghettone, ölüm döşeği, portreler, II. Henri) + S7/S8 kilise ayrıntıları.
- **C düzeyi (yorum, açıkça işaretli):** stacco/tuval aktarımı (C007, basın+atıfsız), Arbasia (C012, atıfsız), restorasyon anlatısı (C014, basın), Maniyerist zirve statüsü (C016, atıfsız), "Roma'nın en ünlü üç resmi" alımlaması (C039, EB1911/atıfsız), Barocci/Caravaggio/Poussin/Bernini etkisi (C040, basın).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU serbest (C/D/E dahil). CS doğru harfleri A/B/C/D'ye dağıtılmış; her yanlış seçeneğin gerçek gerekçesi var (totoloji yok). DY03 "1541 icra yılıdır" yanlışının kanıtı B (C005 sözleşme) — D'ye dayanmaz.
- **D/E işareti:** 6 D "(tartışma)", 6 E "(belirsiz)", 6 C "(yorum)"; otomatik marker taraması 0 sorun, 0 çift marker.
- **GZ TASLAK:** görsel incelenemedi → gen.py `gz_taslak` tüm GZ ipuçlarını "TASLAK" ile işaretledi.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Ham cache'ler 14 Kasım 2026'da yeniden açılıp brief'ten bağımsız okundu:
- **S9** (trinitadeimonti.net/it/la-chiesa, 200): Bonfil/Orsini ayrımı, Cespedes 1570–1577, Dupredo y.1820, özgün Orsini→Immacolata (Veit 1830), 17 şapel, "manierismo romano", gotik/Narbonne, 1774 Pannini, **konsekration 1594** ✓.
- **S10** (Treccani DBI 87, 200): 1509/1566, 1 Aralık 1541 sözleşme (Hirst 1967), Elena Orsini 1545 + Helena + 1548 endüljans, "destinata all'altare", "con indipendenza"/"monumentale, severa, meditata", hazırlık çalışmaları (Davidson/Hirst), stucco rölyef (Michelangelo=Sokrates), Pino/Tibaldi/Becerra, Della Rovere (Teylers A 21), Sala Regia 1547, Braghettone, ölüm döşeği, bronz portre (Casa Buonarroti 61), II. Henri, Vasari "malanimo" ✓.
- **S5/S6/S7/S8** wikitext: Deposition paragrafları ATIFSIZ doğrulandı; S6 "ipotesi oggi rigettata" (Ciardi/Moreschini 2004 p.131) ✓; S6 liste "1543 / affresco staccato" ✓.
- **S11** (arşiv 2006-05-15): Palmaroli stacco/tela, "realizzata nel 1545", Luzi/de Cesaris 3 yıl, 2002 incelemeler (Di Matteo/Negro/Vatikan), 12 Şubat 2005 dönüş, renk geri kazanımı ✓.
- **S1/S3/S4** metadata: P571=1541 precision 9 (P1480 yok, Commons import), P186=fresco, boyut yok, PD-old-100 + PD-Art-YorckProject, 2024×2997 ✓.
- **S12** arşiv: yalnız gezinme iskeleti, eser bilgisi yok ✓ (erişilemedi).

**Brief'e ek iki Denetim B bulgusu:**
1. **S7 Deposition/Arbasia cümlesi ATIFSIZ** (Macadam/TCI ref'leri sağ şapel cümlelerine ait) → Arbasia ayrı **C** iddia (C012), brief'in "A(+B)"sinden düşürüldü.
2. **S5 galeri etiketi** bu Commons dosyasını "before its 2004 restoration" diye gösterir; başlık görseli "after its restoration in 2004" → görselin hangi durumu gösterdiği **belirsiz (C045/E)**.
3. **Konsekration ihtilafı** S9 "1594" ↔ S7/S8 "1585" → yeni **D** (C022).

**Altı ihtilaf D:** C006 (icra), C008 (teknik), C010 (çizim), C015 (restorasyon), C022 (konsekration), C026 (şapel). **Erişilemeyen:** S12 + Hirst/Davidson/Barolsky/Ciardi-Moreschini/Macadam/TCI/EB1911/Alberti metinleri (C047/C048).

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12 AKTİF): **0 hata; 6 uyarı.**
- 6 uyarının tamamı `DERS_ILERI.md` §12 kaynakça maddelerinde **etiketsiz-olgu heuristic yanlış pozitifi**: "pp./p./M./ed." kısaltmaları cümle bölücüyü tetikleyip yıl içeren parçayı etiketsiz sayıyor. Bunlar bibliyografik künye (olgusal prose değil); doğru biçim korunmuştur.
- Kelime aralığı uyarısı YOK (üç seviye de §8 içinde). Seviyeler arası tekrar uyarısı YOK. Totoloji uyarısı YOK. Sayım tutarlılığı ✓. bolum_eslesme 12/12 ✓. durum "İnsan incelemesi bekliyor" ✓.
- **CJK taraması: 0** (6 dosyanın tümü; U+3000–303F / 3040–30FF / 4E00–9FFF / AC00–D7AF / FF00–FFEF).
- Not: dogrula.py çıktısındaki `HATA: Q18572249/Q18579333/Q1863885/Q23008305/Q2472983/Q3705703 eksik dosya` satırları **öteki (tamamlanmamış) eser dizinlerine** aittir; bu paket onlara DOKUNMADI.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 441 | 400–500 | 3 dk |
| Orta | 1379 | 1300–1600 | 10 dk |
| İleri | 2785 | 2600–3200 | 20 dk |

**Not:** Kelime hedefleri §8 gereği tahmindir. Bu eserde erişilen kaynaklar (özellikle DBI) zengin olduğu için dersler hedef aralıkta, dolgu/tekrar olmadan üretildi. Görsel incelenemediğinden biçimsel analiz bilinçli olarak sınırlı tutuldu; figür/renk betimi uydurulmadı.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (File:Daniele da Volterra 002.jpg, 2024×2997, PD-old-100 + PD-Art-YorckProject); **vision kotası ana oturumda → İNCELENEMEDİ (C044/E).** `gorsel.dogrulama.incelenen_bolgeler=[]`. Kompozisyon/renk/figür hakkında kesin gözlem YAZILMADI; erişilen metinler figür betimi vermez (DBI yalnız üslup niteler). Repo betimleri doğrulanmadı (C046/E). Görselin restorasyon öncesi/sonrası durumu belirsiz (C045/E). **GZ TASLAK.** Görsel projeye kopyalanmadı; derslerde URL + lisans + kaynak referans. **İnsan editör görsel teyidi ZORUNLU.**

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C044/C045, E):** incelenemedi; GZ TASLAK; hangi durum (restorasyon öncesi/sonrası) belirsiz; insan editör zorunlu.
2. **Repo betimleri (C046, E):** "yeşil zırh/pembe etek, bayılan Meryem, turuncu pelerin, aşınma" → görsel teyit + data düzeltme önerisi.
3. **Altı ihtilaf (D):** icra tarihi (C006), teknik etiketi (C008), Michelangelo çizimleri (C010), restorasyon yılı (C015), konsekration (C022), şapel/konum (C026).
4. **Michelangelo çizim tezi (C010/E3):** "rigettata" dayanağı Ciardi/Moreschini 2004 metnine erişilmedi; tez durumu belirsiz.
5. **Teknik anlatı (C007, C):** stacco/tuval/Palmaroli anlatısı basın + atıfsız liste kaynaklı; birincil teknik rapor (Sovrintendenza restorasyon dosyası) edinilmeli.
6. **Boyut (C018, E):** hiçbir erişilen kaynakta yok; birincil katalog/teknik rapor gerekli.
7. **Erişilemeyen literatür (C047/C048, E):** Hirst 1967, Davidson 1967, Barolsky 1979, Ciardi/Moreschini 2004, Macadam/TCI, EB1911, F. Alberti; S12 Polo museale rehberi.
8. **Felsefi yorumlar (İleri §7: Benjamin aura, kenosis/paradoks):** açıkça "yorum"; kurum dışı; editör onayı.
9. **Data notları (KANIT §5):** data "1541" sözleşme/icra birleşimi; özet↔"Ne görüyoruz?" teknik tutarsızlığı; önceki doğrulama işaretlerine güvenilmedi.

## 7. Yayına adaylık

Otomatik kısım sağlandı (0 hata, şema geçerli, quiz A/B, marker disiplini, CJK 0, kelime §8 içinde). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil S9 + akademik S10 AÇILDI (A/B); görsel İNCELENEMEDİ (E); altı ihtilaf D açık; insan editör görsel teyidi + literatür erişimi kritiktir.**
