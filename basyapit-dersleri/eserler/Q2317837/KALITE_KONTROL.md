# KALİTE KONTROL — Q2317837 · Kabus (The Nightmare) · Henry Fuseli

**Tarih:** 14 Kasım 2026 · **Parti:** 4 · **Standart:** `../../AKADEMIK_STANDART.md` §11–12
**Sonuç:** Denetim A ✅ · Denetim B ✅ (cache temelli; canlı yeniden erişim yok) · Şema ✅ · **İnsan incelemesi: BEKLİYOR**
**Araştırma:** ana oturum brief'i (`.qwen/tmp/parti4/Q2317837-brief.md`); ham cache'ler QID önekli (`Q2317837-primary.txt`, `Q2317837-enwiki.txt`, `Q2317837-wd.json`, `Q2317837-dia-wb2.html`, `Q2317837-cdx.json`). Cache içerikleri hedef esere ait olarak doğrulandı (başlık/QID/erişim alanları); generic ad çakışması riski not edildi (parti tmp cache çakışması dersi).

---

## 1. Denetim A — İddia-kaynak eşleştirmesi

Olgusal cümleler `[C###]` ile KANIT envanterine bağlandı; dogrula.py çapraz kontrolü **Q2317837 için 0 hata / 0 uyarı**.
- **Toplam iddia:** 33 (C001–C033). A=9, B=15, C=4, D=2, E=3. KANIT "Sayım:" satırı DERS.json ile birebir.
- **A düzeyi (9):** DIA birincil arşiv kaydı — künye, boyut, envanter/konum, edinim, provenance, RA 1782 no. 64 + RA 1879 no. 15, müze betimi/anahtar sözcükler, gravür + Freud dairesi 1920'ler, bibliyografya liste olgusu.
- **B düzeyi (15):** enwiki satır içi atıflı betim/tarihçe/etki + WD metadata + PD.
- **C düzeyi (4):** psikanalitik öncülük (anakronizm), erotik okuma tartışması, Janson/Landholdt kimliklendirmesi, estetik/felsefi yorumlar — hepsi "(yorum)" işaretli; hiçbir quiz cevabı C'ye dayanmaz.
- **D düzeyi (2):** boyut (C029), data girdisi (C030) — "(tartışma)" işaretli; kesin cevaplı soru yok.
- **E düzeyi (3):** görsel inceleme (C031), DIA canlı erişim (C032), atıf zinciri metinleri (C033) — "(belirsiz)" işaretli; yalnız sınır beyanı.
- **Quiz:** 10 CS + 5 DY + 5 GZ + 5 TK yalnız A/B kanıtlı; 5 AU serbest (C/D/E dahil). Yanlış seçenek gerekçeleri bağlamsal (totoloji yok; dogrula totoloji kontrolü temiz). Doğru cevaplar yorumlara değil, A/B olgulara dayanır.
- **GZ TASLAK:** görsel incelenemedi → gen.py gz_taslak otomatik; 5/5 ipucu TASLAK önekli.
- **İçerik sınırı:** erotik/şeytani ima akademik ve açık ayrıntısız betimlendi; cinsel detay üretilmedi. Erotik tartışma yalnız başlık düzeyinde (Allentuck 1972) ve yorum statüsüyle kayıtlı; Landholdt mektubunun açık içeriği alıntılanmadı; Abildgaard versiyonunun açık betimi yapılmadı.

## 2. Denetim B — Kaynağa bağımsız geri dönüş

Ham cache'ler brief'ten bağımsız yeniden okundu (14 Kasım 2026):
- **K1 DIA (Wayback 2018-10-20):** künye/boyut/envanter/credit line/provenance/bibliyografya/müze betimi birebir doğrulandı. **Brief'e iki düzeltme:** (1) RA 1782 sergisi "Published References: Royal Academy (exhibition). London, 1782, no. 64" ile B→**A** yükseltildi (C006); (2) Freud dairesi kopyası 1920'ler DIA'da **A** (brief'te yalnız enwiki B zinciri vardı, C008).
- **K3 WD:** P571 precision 9 korundu; **P2048 = 101 cm** (brief 101,6 yazmıştı → düzeltildi), P2049 = 127; P2610 = 2,1 cm; P6216 Q19652 + P1001/P459 niteleyicileri kayıtlı.
- **K2 enwiki:** betim/sergi/gravür/versiyon/parodi/Shelley/Poe/Freud-Jones-Jung/etimoloji/kaynak önerileri/kariyer/Landholdt satır satır karşılaştırıldı; "en az üç" hedge korundu; Shepherd's Dream tarih çelişkisi (1793↔1798) derslere alınmadı (tarihsiz anıldı).
- **Sınır:** canlı yeniden erişim bu oturumda yapılamadı (DIA canlı 403 zaten kayıtlı; ağ aracı yok). Denetim B cache temellidir; **canlı teyit insan editöre** (özellikle güncel DIA kaydı ve görsel).
- **Erişilemeyen:** DIA canlı (403), eski object-info URL (Wayback 404), itwiki (çekilmedi), atıf zinciri kitap/makale metinleri (C033 E) — içerik iddiası üretilmedi, yalnız bibliyografya olguları (C009 A).

## 3. Şema ve biçim

`dogrula.py` (mini + jsonschema Draft 2020-12, venv-dogrula): **Q2317837 için 0 hata / 0 uyarı.** İlk turdaki 6 heuristic uyarı (cümle bölücü artefaktları: RA alıntısı içi nokta, "Bros." kısaltması, kaynakça satırı içi nokta) metin düzeltmeleriyle giderildi; iddia içerikleri değişmedi.
- Genel SONUÇtaki hata/uyarılar **eşzamanlı başka parti eserlerine** aittir (ör. eksik dosyalı kauffman girdisi); kapsam gereği dokunulmadı. Q2317837 temizliği kendi satırlarıyla değerlendirildi.
- **CJK: 0** (7 dosyanın tamamı; KALITE dahil son tarama).
- bolum_eslesme 12/12; durum "İnsan incelemesi bekliyor"; sanatci_id "henry-fuseli" (data/sanatcilar.json ile uyumlu).

## 4. Kelime/süre

| Seviye | Ölçülen | Hedef | Süre |
|---|---|---|---|
| Başlangıç | 416 | 400–500 | 3 dk |
| Orta | 1348 | 1300–1600 | 10 dk |
| İleri | 2619 | 2600–3200 | 20 dk |

Üç seviye de §8 aralığında; dolgu/tekrar yok (yakın tekrar ve seviyeler arası birebir cümle kontrolleri temiz). İleri alt sınıra yakındır: görsel inceleme ve refs metinleri erişilemediği için kapsam kanıtla sınırlı tutuldu (§1, §8).

## 5. Görsel doğrulama (Kural 6)

- WD P18 dosya adı + enwiki infobox DIA 2019 fotoğrafı + data commons_dosya adı kayıtlı; **hiçbir görsel açılmadı/incelenmedi** (vision kotası ana oturumda tükendi) → C031 E.
- incelenen_bolgeler=[]; çözünürlük bilinmiyor; **GZ TASLAK**; kompozisyon "kaynakların betimlediği" formülüyle K2 metninden.
- Lisans: WD P6216 public domain (Q19652); Fuseli ö. 1825 → ölüm+70 çok aşılmış (C024 B). Görsel projeye kopyalanmadı; URL + lisans + kaynak referansı.
- Data "bak" hotspot'ları kanıt olarak kullanılmadı; **insan editör görsel teyidi ZORUNLU** (kompozisyon, ışık, at başı, verso portre, versiyon ayrımı).

## 6. İnsan incelemesi gerektiren noktalar

1. **Görsel (C031, E):** incelenemedi; GZ TASLAK; tüm betimler kaynak aktarımı — görsel teyit zorunlu.
2. **DIA canlı kayıt (C032, E):** birincil 2018-10-20 arşivinden; güncel konum (Era of Revolution S331), boyut ve yorum metni teyidi.
3. **Boyut ihtilafı (C029, D):** DIA 101,6×126,7 ↔ enwiki 101,6×127 ↔ WD 101×127; birincil esas alındı, yuvarlama çıkarımı insan onayına.
4. **Data girdisi (C030, D):** data/basyapitlar.json "yaklaşık 1781–1782" + iki versiyon/iki müze tek girdide ↔ DIA 1781 Detroit; Frankfurt c. 1790–91 ayrı. Data DEĞİŞTİRİLMEDİ; düzeltme önerisi insan onayına.
5. **Lisans/dosya uyuşmazlığı:** data/sanatcilar.json "CC BY 2.5" + farklı Commons dosya adı ↔ WD PD + P18 dosyası; hangisi kullanılacak, insan kararı.
6. **Yorumlar (C025–C028):** psikanalitik anakronizm, erotik okuma tartışması, Landholdt kimliklendirmesi, yüce/Aydınlanma çerçeveleri — editör onayı; içerik politikası sınırı (açık ayrıntısız) korundu.
7. **Literatür (C033, E):** Knowles/Ward/Stewart/Schiff/Allentuck vb. metinleri erişilmedi; B iddialar enwiki atıf zincirine dayanır — birincil metin teyidi önerilir.
8. **Versiyon karışıklığı riski:** Klingender 1945'in Harrowby versiyonunu reprodukte ettiği DIA notu (C009); karşılaştırmalarda doğru görsel ayrımı insan editörce yapılmalı.

## 7. Yayına adaylık

Otomatik kısım sağlandı (şema, çapraz tutarlılık, quiz A/B, kelime, CJK, D/E işaretleri). **Durum "İnsan incelemesi bekliyor"; "Yayına aday" DEĞİL.** Otomatik testler yapısal tutarlılığı denetler; olgusal/semantik doğruluğu garanti etmez. Bu tur aynı asistan + ana oturum araştırmasıyla yapıldı; Denetim B cache temellidir (canlı yeniden erişim yok). **Haricî model/insan editör denetimi, görsel teyit ve canlı DIA teyidi tamamlanmadan yayımlanmaz.**
