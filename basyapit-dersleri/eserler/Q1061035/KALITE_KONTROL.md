# KALİTE KONTROL — Q1061035 · İmgelerin İhaneti (La trahison des images) · René Magritte · LACMA

**Tarih:** 15 Kasım 2026 · **Parti:** 7 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ (canlı recheck) · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti7/Q1061035-brief.md`); ham cache `.qwen/tmp/parti7/Q1061035-*`.
**Üretim betiği:** `.qwen/tmp/parti7/uret-Q1061035.py` (gen.build). **Versiyon:** LACMA 1929 tablosu.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q1061035 için temiz (0 hata / 0 uyarı)**.
- **Toplam iddia:** 50 (C001–C050). **A=19, B=14, C=3, D=6, E=8.** KANIT "Sayım:" satırı DERS.json ile birebir eşit.
- **A düzeyi (C001–C019):** LACMA birincil katalog (canlı 200 + recheck) — künye, provenance, edinim, BCAM, yazıt, Wall label 2021, imge-nesne-dil tezi, afiş üslubu, etki listesi, Sürrealizm, telif, **müze alt-metin betimi (C019)**.
- **B düzeyi (C020–C033):** Foucault 1973 (itwiki→SE 1988), Magritte açıklamaları (Torczyner/Negri/Scritti — metne erişilmedi), diğer adlar, Éluard/Breton 1929, motif devamı, Duke ABD PD kuralı, Variétés versiyonu, TR/AB 2038, meta-mesaj, Foucault betimi, aynı sayı yayınları, itwiki monokrom zemin, 2026 forma. Hepsi kaynak zinciri notuyla.
- **C düzeyi (C034–C036):** felsefi temsil okuması, afiş ironisi, kavramsal/Pop öncülüğü — açıkça "(yorum)" işaretli; olgu değil.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B** kanıtlı; 5 AU serbest (C/D/E dahil). Yanlış seçenek gerekçeleri bağlamsal (totoloji yok; dogrula totoloji_kontrol temiz). Doğru cevaplar D/E'ye dayanmaz.
- **D/E işareti:** 6 D "(tartışma)", 7 E "(belirsiz)" post-pass ile uygulandı; C050 (Benda anomalisi, E6) **ders içeriğine taşınmadı** (kullanim=kullanilmadi).
- **GZ TASLAK:** görsel incelenmedi → gen.py gz_taslak 5/5 uyguladı.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

- **LACMA birincil (S1) 15 Kasım 2026 canlı YENİDEN çekildi:** HTTP 200, 98.364 B (`Q1061035-lacma-recheck.html`). Künye/provenance/Wall label 2021/telif alanları ve schema.org JSON-LD (dateCreated 1929, artMedium "Oil on canvas", identifier 78.7, contentLocation "Broad Contemporary Art Museum, floor 3") teyit edildi. **Yeni kanıt:** müzenin görsel alt metni ("brown smoking pipe against a beige background, with cursive French text... below") → C019 (A) eklendi. Bu, vision olmadan birincil betim sağlar.
- **Ham cache'ler yeniden okundu:** S2 WD (P276 normal Ahmanson refsiz / preferred LACMA; P571 precision 9; P2048/2049 60.3/81.12), S3/S4 wikitext (Torczyner/Foucault/Negri/Scritti/Éluard-Breton ref zincirleri), S5/S6/S7 görsel metadata (PD çelişkisi + 15 Mayıs 2026 silme talebi), S8 WikiArt ("-1948" slug ↔ "1928–1929" içerik; 63.5×93.98; Art Story "likely"/"may also"), S9/S10 Bowman (DOI 302→301→403; özet; basılı 1985/çevrimiçi 2014), S11 Monoskop HEAD 200, S13 Duke PD2025 (Magritte pasajı verbatim), S15 Duke PD2026 (**Magritte/Treachery 0 eşleşme — negatif teyit**).
- **Erişilemeyenler (C048, E):** Foucault özgün 1973 + İngilizce 1983 + İtalyanca 1988 SE metinleri; Torczyner 1977; Negri 1984; Scritti 2005; Bowman tam metni; JSTOR 776809; Sylvester & Whitfield Catalogue Raisonné 1992; LACMA ~40 künye. Duke canlı 2025/2026 (S12/S14) DB hata. Hepsi "kaynakçada anıldı, metne erişilmedi".
- **Semantik sınır:** dogrula.py YAPISAL tutarlılığı denetler; olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; **haricî model/insan editör denetimi ayrıca gereklidir.**

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12): **Q1061035 → 0 hata / 0 uyarı.** DERS.json + SORULAR.json şema geçerli; bolum_eslesme 12; iddia/kaynak kimlikleri tutarlı; mükerrer kimlik yok; quiz kanıt A/B; kelime json↔ölçüm tutarlı.
- **Genel dogrula çıktısı (364 hata / 136 uyarı) Q1061035'e AİT DEĞİLDİR:** eşzamanlı parti üretiminde öteki eserlerin (ör. Q175036 eksik KANIT, "hoch" tamamlanmamış) hatalarıdır. Q1061035 katkısı 0/0'dır (bkz. proje belleği: "eşzamanlı parti üretiminde dogrula genel sayısı yanıltır").
- **CJK taraması:** 7 dosyanın tamamında **0** (Japonca/Çince/Korece karakter yok; özgün başlık/yazıt Fransızca, Latin).
- İlk turda 6 heuristic "etiketsiz olgu adayı" UYARISI vardı; tümü cümle bölücünün kısaltma/baş-harf/alıntı-içi nokta yanlış-pozitifleriydi ("in.", "çev.", "E. L. T.", "Ünlü pipo."). Kaynak alıntıları bozulmadan güvenli etiket yerleşimi/kısaltma açılımıyla giderildi → 0 uyarı.

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef (§8) | Süre | Durum |
|---|---|---|---|---|
| Başlangıç | 424 | 400–500 | 3 dk | ✅ hedefte |
| Orta | 1303 | 1300–1600 | 10 dk | ✅ hedefte |
| İleri | 2613 | 2600–3200 | 20 dk | ✅ hedefte |

Ölçüm gen.py/dogrula.py ile aynı yöntem (`[C###]` ve `#*`|-` atılır). Dolgu/tekrar yok; seviyeler arası birebir uzun cümle tekrarı yok (dogrula seviye_tekrar_kontrol temiz). Kanıt yetersiz bölümler (teknik/konservasyon §6) §8 gereği kısa bırakıldı, uydurma yapılmadı.

## 5. Görsel doğrulama (Kural 6)

- **İncelenmedi:** hiçbir görsel açılmadı (vision kotası ana oturumda). `gorsel.dogrulama.incelenen_bolgeler=[]` → **GZ 5/5 TASLAK.** Kompozisyon "kaynakların betimlediği": LACMA alt metni (C019, A) + itwiki monokrom zemin (C032, B) + küratoryal not (C012/C015, A).
- **Metadata:** LACMA webp çekilmedi; enwiki MagrittePipe.jpg 378×264 non-free "Fair use (Old-50)"; Commons La Trahison des images.jpg 720×480 **CC BY 2.0 (yalnız fotoğraf, Jason Eppink)**; Commons Magritte treachery.jpg 3264×2448 **PD çelişkili + silme talepli**; WikiArt max 1442×1005.
- **Lisans ayrımı:** CC BY/CC BY-SA yalnız fotoğraf hakkını kapsar; tablo © C. Herscovici/ARS (C018). Commons PD etiketleri tablo için güvenilir değil (C040, C043).
- **İnsan editör görsel teyidi ZORUNLU:** imza konumu (C045), data hotspot betimleri (ışık şeridi/altın bilezik/yazıt/imza koordinatları), hangi görselin hangi versiyonu gösterdiği (C042) doğrulanmadı.

## 6. Telif / adil-kullanım + ABD PD belirsizliği

- **Tablo:** © C. Herscovici/Artists Rights Society (ARS), New York; fotoğraf © Museum Associates/LACMA (C018, A).
- **TR/AB:** Magritte ö. 1967 → ölüm+70 ile **2038'e kadar korumalı** (C027, B; Duke AB life+70 + S7 "Out of copyright in 2038" kategorisi; TR mevzuatı cache'de yok, görev çerçevesi FSEK ölüm+70).
- **ABD: BELİRSİZ (C043, E).** Duke CSPD 2025 aynen: "we have not yet found definitive historical information"; "out of an abundance of caution". Statü, telif hukuku anlamında 1929'da "published" sayılmasına bağlı (C025); ilk yayın örn. 1933 Palais des Beaux-Arts ise 95 yıl; hiç yayımlanmamışsa ölüm+70. "published" bir term of art (kısıtlamasız sergi/izinli dolaşım/satış). **Duke 2026 sayfası Magritte'yi anmıyor → belirsizlik güncellenmedi.** Duke "not official legal advice".
- **AYRI versiyon:** Duke, Variétés'teki **ters pipolu** imgenin 2025'te ABD PD olduğunu belgeliyor (C026) — bu LACMA tablosundan AYRI bir versiyondur; karıştırılmaz. "1948 versiyonu" yalnız WikiArt slug'ında, doğrulanmadı (C049); Catalogue Raisonné tek yetkili araç, metne erişilmedi.
- **Kullanıcı kararı: ADİL KULLANIM (eğitim/eleştiri).** Görsel yeniden yayımlanmaz/kopyalanmaz/projeye indirilmez; derslerde **URL + lisans + kaynak referansı** ve atıf verilir. `kunye.telif_durumu` ve `gorsel.lisans` dolduruldu. **Bu çerçeve hukuki tavsiye değildir;** hak politikası kararı insan editöre/onaya sunulur.

## 7. İnsan incelemesi gerektiren noktalar

1. **Görsel (C047, E):** incelenmedi; GZ 5/5 TASLAK; kompozisyon müze alt metni + wiki betiminden. İnsan editör görsel teyidi zorunlu.
2. **İmza konumu (C045, E):** data "sağ alt" der; metin kaynaklarında yok, görsel incelenmedi → doğrulanmadı.
3. **data hotspot betimleri:** ışık şeridi/altın bilezik/yazıt/imza koordinatları görsel betimi; doğrulanmadı (C042, C047).
4. **ABD PD belirsizliği (C043, E):** Duke 1929 "published" sorusu çözülmedi; 2026 güncellemedi. Adil-kullanım çerçevesi + hak politikası kararı onaya sunulur.
5. **Altı D ihtilafı:** boyut (C037), tarih/slug (C038), konum BCAM↔Ahmanson (C039), Commons PD+silme (C040), Bowman yılı (C041), data görsel versiyonu (C042). Birincil esas alındı; editör teyidi.
6. **1948 versiyonu (C049, E):** doğrulanmadı; Catalogue Raisonné (Sylvester & Whitfield 1992) metne erişilmedi — versiyon sorusunun tek yetkili aracı.
7. **Erişilemeyen metinler (C048, E):** Foucault özgün/çeviriler, Torczyner, Negri, Scritti, Bowman tam metni, LACMA ~40 künye. B-seviyeli alıntı zincirleri birincil metinle teyit edilmeli.
8. **Motif kökeni (C044, E):** Le Corbusier "likely" / tabela "may also" — ihtiyat korundu; birincil doğrulama yok.
9. **Kosuth karşılaştırması (C046, E):** üçüncül/refsiz; kesin etki bağı değil, hipotez.
10. **Felsefi yorumlar (C034–C036, C):** Korzybski/Diderot çerçeveleri kurum dışı yorum; etkilenme iddiası yok; editör onayı.
11. **E6 Benda anomalisi (C050):** ders içeriğine taşınmadı; yalnız veri notu.

## 8. Veri notları (data/ DEĞİŞTİRİLMEZ — onaya sunulur)

- data/eserler_onbellek.json + eser_ayrintilari.json görselleri: WikiArt "-1948" slug'lı (D6, C042) + Commons "Magritte_treachery.jpg" silme talepli (D4, C040); lisans alanları boş.
- data kaynaklar `["wikidata","wikiart"]` — LACMA birincil yok; ders ekler (S1).
- data boyut/envanter/edinim alanı yok; brief değerleri (60.3×81.1 cm, 78.7, 1978) kullanıldı.
- data "sağ alt imza" → C045 (E); Kosuth/Pop öncülüğü ihtiyatlı → C046 (E).
- Hiçbir data dosyasına, uygulama koduna, main'e, pilot Q167605'e veya öteki eserlere yazılmadı.

## 9. Yayına adaylık

Otomatik kısım sağlandı (şema, çapraz tutarlılık, quiz A/B, kelime, 12 bölüm, CJK-0, GZ TASLAK). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** §12 koşullarından "görsel analiz doğru eser/görselle yapılmış" ve "Denetim B haricî onay" henüz karşılanmadı: görsel incelenmedi, birincil metinlerin çoğuna erişilmedi, ABD telif statüsü belirsiz. Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. **Birincil LACMA AÇILDI (A, canlı recheck); görsel İNCELENMEDİ (E); insan editör görsel teyidi + birincil metin okuması + hak politikası kararı kritiktir.**
