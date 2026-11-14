# KALİTE KONTROL — Q1430990 · Bir Alegori (An Allegory with Venus and Cupid) · Agnolo Bronzino

**Tarih:** 14 Kasım 2026 · **Parti:** 2 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** kaynak-arastirma agent brief'i (`.qwen/tmp/parti2/Q1430990-brief.md`); ham cache `.qwen/tmp/parti2/Q1430990-*`.

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü temiz.
- **Toplam iddia:** 56 (C001–C056). **A=28, B=10, C=4, D=8, E=6.**
- **A düzeyi:** NG birincil katalog (S4) — künye, merkez grup, figür betimleri (NG tereddütleriyle), provenance, üslup, pentimenti, iki okuma, Vasari/Rosso hipotezleri, "Sin" sergisi, bibliyografya listesi. Wikidata/Commons (S1/S5) künye teyidi.
- **B düzeyi:** enwiki (S2) figura serpentinata/kompozisyon/alımlama/Monty Python; Panofsky "Fraude" atıf zinciri; Zeri (S3 satır içi + S4 bib.); "no consensus"; PD statüsü; WD P180 eksiklik notu.
- **C düzeyi:** C028/C029 (atıfsız tarih/boyut varyantları, D bağlamında); C055/C056 (açıkça işaretli estetik yorum).
- **D düzeyi (8):** C033 tarih · C034 boyut · C035 çığlık figürü · C036 putto · C037 sol üst figür · C038 hibrit eller · C039 provenans/himaye · C040 başlık.
- **E düzeyi (6):** C024–C027 (itwiki atıfsız iddialar) · C041 (görsel incelenemedi) · C042 (refs metinleri erişilmedi).
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK **yalnız A/B**; 5 AU (C/D/E dahil, serbest). CS doğru cevapları figür kimliği ihtilaflarına (D) dayanmaz; künye/attribute/üslup gibi kesin A/B alanlardan seçildi. Her CS'de 3 yanlış seçeneğin bağlamsal gerekçesi var (totoloji yok).
- **D/E işareti:** 8 D "(tartışma)"; 6 E "(belirsiz)"; C055/C056 "(yorum)"; dogrula belirsizlik denetimi temiz.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak otomatik (5/5 ipucu "TASLAK" önekli).
- **Erotik içerik:** akademik çerçevede, açık ayrıntıya girilmeden yazıldı; NG'nin "sexually explicit" nitelemesi katalog karakterizasyonu olarak aktarıldı.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

S4 (NG, 200), S2/S3 (en/it wikitext, 200), S1 (Wikidata EntityData, 200), S5 (Commons imageinfo, 429→200), S7 (Art UK Wayback 2025-01-18, arşiv 200), S8/S9 (yardımcı, 200) 14 Kasım 2026'da açıldı; ham cache'ler bu oturumda yeniden okunup iddialarla karşılaştırıldı:
- **Künye ✓ (S4/S1/S7):** Bronzino 1503–1572; "An Allegory with Venus and Cupid"; "About 1545"; "Oil on wood"; 146.1×116.2; NG651; Room 2; Main Collection; "Bought, 1860" Beaucousin; 17. yy İtalyan çerçeve.
- **Konu/figürler ✓ (S4):** Venüs ok çalar + altın elma + çift güvercin + Cupid taç; maskeler; putto (diken+halhal); hibrit (petek+yılan+cangiante); çığlık (Jealousy?/Suffering/Syphilis + French disease karşı argümanı); Time (kum saati+örtü); Oblivion? — NG tereddüt ifadeleri aynen korundu.
- **Provenance ✓ (S4):** Beaucousin 1860 kesin; Althorp 1742 "Almost certainly"; Spencer 1847 "Apparently"; Gould 1987'den çıkarılmış metin; Fransız kraliyet kaydı yok.
- **Üslup/pentimenti ✓ (S4):** emaye yüzey, yapay ışık, ultramarin/lapis, rölyef mekân; kontur değişiklikleri + "may have had to make it quickly".
- **Sekiz ihtilaf D:** NG ↔ enwiki ↔ itwiki ↔ data farkları açık (C033–C040). NG Overview↔In-depth putto vurgu farkı not edildi.
- **Görsel:** S5 metadata only (3349×4226, PD); vision kotası ana oturumda → **İNCELENEMEDİ (C041)**; GZ TASLAK.

**Erişilemeyen:** S6 Art UK canlı (403 bot); kitap/makale metinleri (Gould, Panofsky, Böckh, Haraszti-Takács, Zeri, Devich, Plazzotta & Keith, Conway, Healy vb.) yalnızca erişilen kayıtların bibliyografyalarında anıldı (C042). itwiki atıfsız iddialar E (C024–C027). DOI/ISBN/sayfa doğrulanmadı; uydurma bibliyografya üretilmedi.

## 3. Şema ve biçim

`dogrula.py` (mini yorumlayıcı + jsonschema Draft 2020-12, izole venv): **Q1430990 için 0 hata / 0 uyarı.** DERS.json + SORULAR.json şema geçerli; iddia/kaynak kimlikleri eşleşiyor; mükerrer kimlik yok; quiz A/B kuralı sağlanıyor; bolum_eslesme 12 bölüm; durum "İnsan incelemesi bekliyor". **CJK taraması: 0.** (Global dogrula çıktısındaki öteki hata/uyarılar başka eserlerin eksik dizin/kelime sorunlarıdır; bu esere ait değildir, dokunulmadı.)

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 466 | 400–500 | 3 dk |
| Orta | 1422 | 1300–1600 | 10 dk |
| İleri | 2658 | 2600–3200 | 20 dk |

Üç seviye de §8 hedef aralığında. Kanıt bol olduğundan (NG In-depth + bibliyografya) dersler gerçek içerikle yazıldı; dolgu/tekrar yok. Yakın tekrar ve seviyeler arası birebir cümle denetimleri temiz.

## 5. Görsel doğrulama (Kural 6)

Commons metadata (S5): 3349×4226 px, 4.636.022 bayt, Public domain (PD-Art/PD-old-100-expired/CC-PD-Mark), Credit=NG URL. **Vision kotası ana oturumda → İNCELENEMEDİ (C041 E).** Kompozisyon/ikonografi S4 (A) + S2/S3 metninden; derslerde "kaynakların betimlediği" ifadesi kullanıldı. **GZ TASLAK.** Görsel projeye kopyalanmadı; URL + lisans + kaynak referans verildi. Art UK (S7) görsel kullanım notu UK non-commercial istisnası; Commons PD-Art fotoğrafının hukuki statüsü ayrı değerlendirilmeli. **İnsan editör görsel teyidi ZORUNLU** (özellikle figür kimliği/eller/poz data uyuşmazlıkları).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C041, E):** incelenemedi; GZ TASLAK; insan editör teyidi zorunlu.
2. **Sekiz ihtilaf (D):** tarih (C033), boyut (C034), çığlık figürü (C035), putto (C036), sol üst figür (C037), hibrit eller (C038), provenans/himaye (C039), başlık (C040).
3. **Figür kimlikleri:** Jealousy/Disperazione/Umutsuzluk; Folly/Pleasure/Gioia; Oblivion/Verità/Gece ("Gece" hiçbir kaynakta yok); sağ/sol petek-iğne ataması. NG tereddütleri korunmalı.
4. **Provenance çelişkisi (C039):** NG Althorp–Spencer–Beaucousin ↔ enwiki/itwiki Viyana 1813 Keglević; Viyana atıfları (Böckh 1821, Haraszti-Takács 1968) erişilmedi; Fransız kraliyet kaydı yok.
5. **Sansür/restorasyon (C025, E):** itwiki atıfsız; Devich 1959 metnine erişilmeli.
6. **data uyuşmazlıkları (veri notları):** "diz çökmüş Venüs" (NG "Cupid squats"), tekil güvercin ↔ çift, "Gece", "Umutsuzluk", ozgun başlık farkı, onbellek yil/tarih tutarsızlığı. data/ DEĞİŞTİRİLMEDİ; onaya sunulur.
7. **Literatür (C042, E):** refs metinleri erişilmedi; NG bibliyografyası geniş ama içerik iddiaları E.
8. **Felsefi yorumlar (İleri §7, C055/C056):** kurum dışı estetik yorum; Panofsky "ödünç çerçeve" (etki iddiası yok); editör onayı.
9. **Lisans:** Art UK UK istisnası ↔ Commons PD-Art; yeniden yayım kararı insan editöre.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema + çapraz tutarlılık + A/B quiz + D/E işaretleri + kelime + CJK). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" değil.** Otomatik testler yapısal tutarlılığı denetler; akademik/olgusal doğruluğu garanti etmez. Bu tur aynı asistan + agent araştırmasıyla yapıldı; haricî model/insan editör denetimi ayrıca gereklidir. **Birincil NG AÇILDI (A); görsel İNCELENEMEDİ (E); sekiz ihtilaf D açık; insan editör görsel teyidi + literatür erişimi + data uyuşmazlığı kararı kritiktir.**
